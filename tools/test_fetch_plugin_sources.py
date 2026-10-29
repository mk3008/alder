"""Exercise provenance fetching after the source branch has been squash merged."""
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

from tools.fetch_plugin_sources import fetch_sources, source_revisions


class FetchPluginSourcesTest(unittest.TestCase):
    def record(self, root, value, skill='alder-test'):
        p = root / f'plugins/alder/skills/{skill}/references/provenance.json'
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(json.dumps({'alder_source_revision': value}))

    def test_invalid_inputs_fail_before_fetch(self):
        for revision in ['main', '--upload-pack=evil', 'a'*39, 'A'*40, None]:
            with self.subTest(revision=revision), tempfile.TemporaryDirectory() as tmp:
                root = Path(tmp)
                self.record(root, revision)
                with patch('tools.fetch_plugin_sources.subprocess.run') as run:
                    with self.assertRaises(ValueError):
                        fetch_sources(root)
                    run.assert_not_called()
        with tempfile.TemporaryDirectory() as tmp:
            with self.assertRaises(ValueError):
                source_revisions(Path(tmp))

    def test_fetches_source_outside_main_and_rejects_unavailable_sha(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            remote, checkout = root/'remote', root/'checkout'
            def git(where, *args):
                return subprocess.check_output(['git', '-C', str(where), *args], stderr=subprocess.DEVNULL, text=True).strip()
            remote.mkdir()
            git(remote, 'init', '-b', 'main')
            git(remote, 'config', 'user.email', 'test@example.com')
            git(remote, 'config', 'user.name', 'Test')
            (remote/'source').write_text('base')
            git(remote, 'add', '.')
            git(remote, 'commit', '-m', 'base')
            git(remote, 'switch', '-c', 'source-work')
            (remote/'source').write_text('published bytes')
            git(remote, 'commit', '-am', 'source')
            source = git(remote, 'rev-parse', 'HEAD')
            git(remote, 'switch', 'main')
            git(remote, 'merge', '--squash', 'source-work')
            self.record(remote, source)
            self.record(remote, source, 'alder-second')
            git(remote, 'add', '.')
            git(remote, 'commit', '-m', 'squashed package')
            subprocess.run(['git', 'clone', '--no-local', '--single-branch', '--branch', 'main', str(remote), str(checkout)], check=True, capture_output=True)
            self.assertNotEqual(subprocess.run(['git','-C',str(checkout),'cat-file','-e',source], capture_output=True).returncode, 0)
            self.assertEqual(fetch_sources(checkout), [source])
            self.assertEqual(git(checkout, 'show', f'{source}:source'), 'published bytes')
            self.record(checkout, 'a'*40)
            with self.assertRaises(subprocess.CalledProcessError):
                fetch_sources(checkout)

    def test_all_validation_workflows_fetch_before_tests(self):
        root = Path(__file__).resolve().parents[1]
        for name in ['plugin-package.yml', 'plugin-release-tag.yml', 'document-storage-plugin.yml']:
            source = (root / '.github/workflows' / name).read_text()
            if name == 'plugin-release-tag.yml':
                source = source.split('  validate:\n', 1)[1].split('  release:\n', 1)[0]
            self.assertLess(source.index('run: python3 tools/fetch_plugin_sources.py'), source.index('- run: python3 -m unittest'))
            self.assertIn('test_fetch_plugin_sources', source)


if __name__ == '__main__':
    unittest.main()
