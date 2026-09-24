"""Check that the installed review skill carries the selected Alder knowledge."""

import hashlib
import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PLUGIN = ROOT / "plugins/alder"
SKILL = PLUGIN / "skills/alder-review-implementation"


class PluginPackageTest(unittest.TestCase):
    def test_review_source_is_bundled_without_drift(self):
        provenance = json.loads((SKILL / "references/provenance.json").read_text())
        source = (ROOT / provenance["review_knowledge_source"]).read_bytes()
        bundled = (SKILL / "references/review-knowledge-v0.3.md").read_bytes()
        self.assertEqual(source, bundled)
        self.assertEqual(hashlib.sha256(bundled).hexdigest(), provenance["review_knowledge_sha256"])
        self.assertEqual(len(provenance["alder_source_revision"]), 40)

    def test_marketplace_resolves_a_skill_only_package(self):
        marketplace = json.loads((ROOT / ".agents/plugins/marketplace.json").read_text())
        entry, = marketplace["plugins"]
        self.assertEqual((ROOT / entry["source"]["path"]).resolve(), PLUGIN.resolve())
        self.assertEqual(entry["name"], json.loads((PLUGIN / "plugin.json").read_text())["name"])
        self.assertTrue((SKILL / "SKILL.md").is_file())
        self.assertFalse((PLUGIN / "mcp.json").exists())


if __name__ == "__main__":
    unittest.main()
