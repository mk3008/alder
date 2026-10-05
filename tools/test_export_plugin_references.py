"""Exporter tests use temporary local commits, not publication evidence."""

import hashlib
import contextlib
import io
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

from tools.export_plugin_references import export_plan, main


class ExportPluginReferencesTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.skill = Path("plugins/alder/skills/alder-example")
        self.provenance_path = self.skill / "references/provenance.json"
        (self.root / self.provenance_path).parent.mkdir(parents=True)
        (self.root / "docs").mkdir()
        (self.root / "docs/guide.md").write_text("# Original guide\n")
        self.git("init", "-q")
        self.git("config", "user.name", "Exporter Test")
        self.git("config", "user.email", "test@example.invalid")
        self.git("add", "docs/guide.md")
        self.git("commit", "-qm", "Fixture source")
        self.revision = self.git("rev-parse", "HEAD").strip()
        self.provenance = {"alder_source_revision": self.revision,
                           "sources": {"docs/guide.md": "outdated digest"}}
        self.save_provenance()

    def git(self, *args):
        return subprocess.check_output(["git", "-C", str(self.root), *args], text=True)

    def save_provenance(self):
        (self.root / self.provenance_path).write_text(json.dumps(self.provenance))

    def test_reproducible_bytes_and_digest_come_from_commit(self):
        (self.root / "docs/guide.md").write_text("Dirty working tree is not source evidence.\n")
        result = export_plan(self.root, ["alder-example"], self.revision)
        self.assertEqual(result, export_plan(self.root, ["alder-example"], self.revision))
        expected = b"# Original guide\n"
        self.assertEqual(result[self.skill / "references/guide.md"], expected)
        p = json.loads(result[self.provenance_path])
        self.assertEqual(p["alder_source_revision"], self.revision)
        self.assertEqual(p["sources"]["docs/guide.md"], hashlib.sha256(expected).hexdigest())
        self.assertFalse((self.root / self.skill / "references/guide.md").exists())

    def test_existing_pin_is_used_for_check(self):
        result = export_plan(self.root, ["alder-example"])
        self.assertEqual(json.loads(result[self.provenance_path])["alder_source_revision"], self.revision)

    def test_non_commit_or_short_revision_is_rejected(self):
        for revision in ("HEAD", self.revision[:8], "0" * 40, self.git("rev-parse", "HEAD:docs/guide.md").strip()):
            with self.subTest(revision=revision), self.assertRaises(ValueError):
                export_plan(self.root, ["alder-example"], revision)

    def test_missing_source_is_rejected(self):
        self.provenance["sources"]["docs/missing.md"] = ""
        self.save_provenance()
        with self.assertRaises(ValueError):
            export_plan(self.root, ["alder-example"])

    def test_flattened_basename_collision_is_rejected(self):
        self.provenance["sources"]["other/guide.md"] = ""
        self.save_provenance()
        with self.assertRaisesRegex(ValueError, "destination collision"):
            export_plan(self.root, ["alder-example"])

    def test_scripts_are_exported_without_rewriting(self):
        script = self.root / "tools/source.py"
        script.parent.mkdir()
        script.write_bytes(b"print('source')\n")
        self.git("add", "tools/source.py")
        self.git("commit", "-qm", "Fixture script")
        revision = self.git("rev-parse", "HEAD").strip()
        self.provenance["scripts"] = {"tools/source.py": "old"}
        self.save_provenance()
        result = export_plan(self.root, ["alder-example"], revision)
        self.assertEqual(result[self.skill / "scripts/source.py"], script.read_bytes())
        self.assertEqual(json.loads(result[self.provenance_path])["scripts"]["tools/source.py"],
                         hashlib.sha256(script.read_bytes()).hexdigest())

    def test_check_reports_mismatch_without_writing(self):
        before = (self.root / self.provenance_path).read_bytes()
        with patch("tools.export_plugin_references.ROOT", self.root), contextlib.redirect_stdout(io.StringIO()):
            result = main(["--skill", "alder-example", "--check"])
        self.assertEqual(result, 1)
        self.assertEqual((self.root / self.provenance_path).read_bytes(), before)
        self.assertFalse((self.root / self.skill / "references/guide.md").exists())

    def test_unsafe_source_path_is_rejected(self):
        for source in ("../guide.md", "/guide.md", "docs/../guide.md", "docs//guide.md"):
            self.provenance["sources"] = {source: ""}
            self.save_provenance()
            with self.subTest(source=source), self.assertRaisesRegex(ValueError, "Unsafe source"):
                export_plan(self.root, ["alder-example"])


if __name__ == "__main__":
    unittest.main()
