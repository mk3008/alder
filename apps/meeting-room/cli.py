"""Local CLI. Identity is resolved from a trusted OS-UID mapping file."""

import argparse
import json
import os
from pathlib import Path
import sqlite3
import sys

from meeting_room import Actor, MeetingRooms, Rejected, initialize


def parser():
    root = argparse.ArgumentParser(description='Meeting-room booking (SQLite)')
    root.add_argument('--db', required=True)
    root.add_argument('--identity', help='Trusted JSON mapping of OS UID to id and roles')
    commands = root.add_subparsers(dest='command', required=True)
    init = commands.add_parser('init', help='Offline provisioning of a new DB only')
    init.add_argument('--rooms', required=True, help='JSON room array')
    for name in ('availability', 'reserve', 'change'):
        cmd = commands.add_parser(name)
        cmd.add_argument('--start', required=True)
        cmd.add_argument('--end', required=True)
        if name != 'availability':
            cmd.add_argument('--room', required=True)
        if name == 'reserve':
            cmd.add_argument('--purpose', required=True)
        if name == 'change':
            cmd.add_argument('--reservation', required=True)
    commands.add_parser('cancel').add_argument('--reservation', required=True)
    for name in ('unavailable', 'resume'):
        commands.add_parser(name).add_argument('--room', required=True)
    return root


def identity(path):
    if not path:
        raise Rejected('identity_required')
    # Real OS UID, not USER/LOGNAME or a client-supplied booker/role flag.
    mapping = json.loads(Path(path).read_text())
    item = mapping.get(str(os.getuid()))
    if not isinstance(item, dict):
        raise Rejected('forbidden')
    actor_id, roles = item.get('id'), item.get('roles')
    if (not isinstance(actor_id, str) or not actor_id.strip()
            or not isinstance(roles, list) or not all(isinstance(r, str) for r in roles)
            or not set(roles) <= {'user', 'manager'}):
        raise Rejected('invalid_identity')
    return Actor(actor_id, frozenset(roles))


def main(argv=None):
    args = parser().parse_args(argv)
    try:
        if args.command == 'init':
            initialize(args.db, json.loads(Path(args.rooms).read_text()))
            result = {'database': args.db, 'initialized': True}
        else:
            app = MeetingRooms(args.db, identity(args.identity))
            if args.command == 'availability':
                result = app.availability(args.start, args.end)
            elif args.command == 'reserve':
                result = app.reserve(args.room, args.start, args.end, args.purpose)
            elif args.command == 'change':
                result = app.change(args.reservation, args.room, args.start, args.end)
            elif args.command == 'cancel':
                result = app.cancel(args.reservation)
            else:
                result = app.set_available(args.room, args.command == 'resume')
        print(json.dumps(result, ensure_ascii=False))
        return 0
    except Rejected as error:
        print(json.dumps({'error': str(error)}), file=sys.stderr)
        return 2
    except (OSError, ValueError, KeyError, TypeError, AttributeError, sqlite3.Error) as error:
        print(json.dumps({'error': 'configuration_or_storage_error', 'detail': str(error)}), file=sys.stderr)
        return 3


if __name__ == '__main__':
    sys.exit(main())
