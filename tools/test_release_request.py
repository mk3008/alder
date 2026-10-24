"""Exercise release request boundaries with real Git history, without remote writes."""
from contextlib import contextmanager
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

from tools.resolve_release_request import REQUEST, parse_request, resolve


@contextmanager
def repository():
    previous = Path.cwd()
    with tempfile.TemporaryDirectory() as temporary:
        os.chdir(temporary)
        try:
            subprocess.run(['git', 'init', '-q'], check=True)
            subprocess.run(['git', 'config', 'user.name', 'Test'], check=True)
            subprocess.run(['git', 'config', 'user.email', 'test@example.invalid'], check=True)
            Path('plugins/alder').mkdir(parents=True)
            Path('plugins/alder/plugin.json').write_text('{"version":"0.4.9"}')
            yield
        finally:
            os.chdir(previous)


def git(*args):
    return subprocess.check_output(['git', *args], text=True).strip()


def commit():
    git('add', '.')
    git('commit', '-qm', 'Test')
    return git('rev-parse', 'HEAD')


def request(revision, **extra):
    Path('.github').mkdir(exist_ok=True)
    Path(REQUEST).write_text(json.dumps({'version': '0.4.9', 'revision': revision, **extra}))
    return commit()


class ReleaseRequestTest(unittest.TestCase):
    def test_parser_rejects_ambiguous_or_executable_values(self):
        for text in ('[]', '{}', '{"version":"0.4.9","version":"0.4.9","revision":"' + 'a'*40 + '"}',
                     json.dumps({'version': '0.4.9', 'revision': 'main'}),
                     json.dumps({'version': '0.4.9\nother=bad', 'revision': 'a'*40}),
                     json.dumps({'version': '0.4.9', 'revision': 'a'*40, 'command': 'bad'}),
                     json.dumps({'version': '0.4.9', 'revision': 5})):
            with self.subTest(text=text), self.assertRaises(ValueError):
                parse_request(text)

    def test_merged_request_publishes_pinned_ancestor_not_merge_commit(self):
        with repository():
            target = commit()
            current = request(target)
            self.assertEqual(resolve('push', 'refs/heads/main', current, {'before': target}),
                             {'version': '0.4.9', 'revision': target, 'publish': 'true'})
            # Unrelated subsequent pushes never replay a historical request.
            Path('other').write_text('ordinary change')
            following = commit()
            with self.assertRaises(ValueError):
                resolve('push', 'refs/heads/main', following, {'before': current})

    def test_dispatch_keeps_exact_triggering_revision_contract(self):
        with repository():
            target = commit()
            inputs = {'version': '0.4.9', 'revision': target}
            self.assertEqual(resolve('workflow_dispatch', 'refs/heads/main', target, {'inputs': inputs})['publish'], 'true')
            current = request(target)
            with self.assertRaises(ValueError):
                resolve('workflow_dispatch', 'refs/heads/main', current, {'inputs': inputs})

    def test_pr_validates_request_but_never_publishes(self):
        with repository():
            target = commit()
            current = request(target)
            event = {'pull_request': {'base': {'sha': target, 'ref': 'main'}}}
            self.assertEqual(resolve('pull_request', 'refs/pull/1/merge', current, event),
                             {'version': '0.4.9', 'revision': current, 'publish': 'false'})
            Path(REQUEST).write_text('{"version":"0.4.9","revision":"main"}')
            broken = commit()
            with self.assertRaises(ValueError):
                resolve('pull_request', 'refs/pull/1/merge', broken, event)

    def test_rejects_wrong_manifest_unknown_or_unmerged_target(self):
        for kind in ('wrong-version', 'missing', 'unmerged'):
            with self.subTest(kind=kind), repository():
                target = commit()
                if kind == 'wrong-version':
                    current = request(target, version='0.5.0')
                elif kind == 'missing':
                    current = request('a'*40)
                else:
                    git('checkout', '-qb', 'independent')
                    Path('independent').write_text('not on main')
                    independent = commit()
                    git('checkout', '-q', '--detach', target)
                    current = request(independent)
                with self.assertRaises((ValueError, subprocess.CalledProcessError)):
                    resolve('push', 'refs/heads/main', current, {'before': target})

    def test_rejects_other_events_refs_checkout_mismatch_and_initial_push(self):
        with repository():
            target = commit()
            current = request(target)
            for event, ref, revision, payload in (
                ('push', 'refs/heads/topic', current, {'before': target}),
                ('push', 'refs/heads/main', target, {'before': target}),
                ('push', 'refs/heads/main', current, {'before': '0'*40}),
                ('push', 'refs/heads/main', current, {'before': current}),
                ('push', 'refs/heads/main', current, {'before': 'main'}),
                ('schedule', 'refs/heads/main', current, {}),
            ):
                with self.subTest(event=event, ref=ref, revision=revision), self.assertRaises(ValueError):
                    resolve(event, ref, revision, payload)


if __name__ == '__main__':
    unittest.main()
