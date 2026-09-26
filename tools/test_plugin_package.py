"""Check that the installed skills carry the selected Alder knowledge."""

import hashlib
import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PLUGIN = ROOT / "plugins/alder"
SKILL = PLUGIN / "skills/alder-review-implementation"
AUTHOR = PLUGIN / "skills/alder-draft-business-design"


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

    def test_authoring_sources_are_bundled_without_drift(self):
        provenance = json.loads((AUTHOR / "references/provenance.json").read_text())
        self.assertEqual(len(provenance["alder_source_revision"]), 40)
        for source, digest in provenance["sources"].items():
            self.assertEqual((ROOT / source).read_bytes(), (AUTHOR / "references" / Path(source).name).read_bytes())
            self.assertEqual(hashlib.sha256((ROOT / source).read_bytes()).hexdigest(), digest)
        self.assertTrue((AUTHOR / "SKILL.md").is_file())
        plugin = json.loads((PLUGIN / "plugin.json").read_text())
        self.assertEqual(plugin["version"], "0.2.2")
        self.assertIn("Write", plugin["extensions"]["com.openai"]["interface"]["capabilities"])
        self.assertIn("このヒアリング結果をAlder業務設計書にして", plugin["extensions"]["com.openai"]["interface"]["defaultPrompt"])
        author_skill = (AUTHOR / "SKILL.md").read_text()
        review_skill = (SKILL / "SKILL.md").read_text()
        self.assertIn("interview notes", author_skill)
        self.assertIn("Write only the requested Business Design file(s)", author_skill)
        self.assertIn("Review only; do not edit product files", review_skill)

    def test_interview_fixture_is_valid_and_leaves_policy_open(self):
        from tools.business_graph.export import parse_design

        fixture = ROOT / "tools/fixtures/plugin-authoring"
        notes = (fixture / "interview-notes.md").read_text()
        draft = (fixture / "business-design.md").read_text()
        graph = parse_design(draft)
        names = {n["name"] for n in graph["nodes"] if n["type"] == "business"}
        self.assertEqual(names, {
            "空いている会議室を探す", "会議室を予約する", "予約時間を変更する",
            "予約をキャンセルする", "会議室を利用停止にする",
        })
        self.assertIn("予約時間が重複していたら予約できない", notes)
        self.assertIn("予約時間が重複する場合、予約は成立しない", draft)
        self.assertIn("元の予約を維持するか", draft)
        self.assertIn("既存の予約がある場合", draft)
        self.assertIn("どの会議室について判断できるか", draft)
        self.assertIn("既存予約と新規予約への影響は未確認", draft)
        self.assertIn("キャンセル後にその時間帯を空きとして扱うか", draft)
        self.assertNotIn("キャンセル後は空きとして扱う", draft)
        self.assertNotIn("元の予約は維持される", draft)
        self.assertNotIn("既存予約を取り消す", draft)


if __name__ == "__main__":
    unittest.main()
