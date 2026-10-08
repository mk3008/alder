import argparse
import json
import sqlite3
import sys
from . import Application, BusinessError


def main():
    parser = argparse.ArgumentParser(description='Local facilities maintenance CLI')
    parser.add_argument('--db', required=True)
    commands = parser.add_subparsers(dest='command', required=True)
    commands.add_parser('init')
    commands.add_parser('list')
    setup = commands.add_parser('provision', help='Local setup: register existing equipment')
    setup.add_argument('equipment_id')
    fields = {
        'report': ['equipment_id', 'reported_at', 'reported_by', 'description'],
        'schedule': ['request_id', 'scheduled_for'],
        'complete': ['request_id'],
        'close': ['equipment_id'],
        'release': ['equipment_id'],
    }
    for command, names in fields.items():
        sub = commands.add_parser(command)
        sub.add_argument('--role', required=True, choices=['reporter', 'coordinator', 'technician', 'inspector'])
        for name in names:
            sub.add_argument(name)
    args = vars(parser.parse_args())
    database, command = args.pop('db'), args.pop('command')
    app = None
    try:
        app = Application(database)
        if command == 'init':
            app.initialize()
            result = {'initialized': True}
        elif command == 'list':
            result = app.inspect()
        elif command == 'provision':
            result = app.provision(args['equipment_id'])
        elif command in ('close', 'release'):
            result = app.safety(**args, release=command == 'release')
        else:
            result = getattr(app, command)(**args)
        print(json.dumps(result, ensure_ascii=False))
        return 0
    except (BusinessError, sqlite3.Error) as error:
        print(json.dumps({'error': str(error)}, ensure_ascii=False), file=sys.stderr)
        return 1
    finally:
        if app:
            app.close()


if __name__ == '__main__':
    sys.exit(main())
