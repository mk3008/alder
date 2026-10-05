"""Check that the installed skills carry the selected Alder knowledge."""

import hashlib
import json
import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
PLUGIN = ROOT / "plugins/alder"
SKILL = PLUGIN / "skills/alder-review-implementation"
AUTHOR = PLUGIN / "skills/alder-draft-business-design"
DESIGN_REVIEW = PLUGIN / "skills/alder-review-business-design"
OPTIMIZE = PLUGIN / "skills/alder-optimize-business"


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

    def test_openai_listing_fields_fit_client_limits(self):
        interface = json.loads((PLUGIN / "plugin.json").read_text())["extensions"]["com.openai"]["interface"]
        self.assertLessEqual(len(interface["shortDescription"]), 30)
        self.assertLessEqual(len(interface["defaultPrompt"]), 3)
        version = json.loads((PLUGIN / "plugin.json").read_text())["version"]
        reporting = [*(PLUGIN / "skills").glob("*/SKILL.md"), SKILL / "references/read-only-review.md"]
        for document in reporting:
            with self.subTest(document=document):
                for reported in re.findall(r"Alder plugin ([0-9]+\.[0-9]+\.[0-9]+)", document.read_text()):
                    self.assertEqual(reported, version)

    def test_authoring_sources_are_bundled_without_drift(self):
        provenance = json.loads((AUTHOR / "references/provenance.json").read_text())
        self.assertEqual(len(provenance["alder_source_revision"]), 40)
        for source, digest in provenance["sources"].items():
            self.assertEqual((ROOT / source).read_bytes(), (AUTHOR / "references" / Path(source).name).read_bytes())
            self.assertEqual(hashlib.sha256((ROOT / source).read_bytes()).hexdigest(), digest)
        self.assertTrue((AUTHOR / "SKILL.md").is_file())
        plugin = json.loads((PLUGIN / "plugin.json").read_text())
        self.assertEqual(plugin["version"], "0.4.3")
        self.assertIn("Write", plugin["extensions"]["com.openai"]["interface"]["capabilities"])
        self.assertIn("このヒアリング結果をAlder業務設計書にして", plugin["extensions"]["com.openai"]["interface"]["defaultPrompt"])
        self.assertIn("業務設計書をAlderでレビューして", plugin["extensions"]["com.openai"]["interface"]["defaultPrompt"])
        self.assertIn("コードをAlderでレビューして", plugin["extensions"]["com.openai"]["interface"]["defaultPrompt"])
        author_skill = (AUTHOR / "SKILL.md").read_text()
        review_skill = (SKILL / "references/read-only-review.md").read_text()
        self.assertIn("interview notes", author_skill)
        self.assertIn("Write only the requested Business Design file(s)", author_skill)
        self.assertIn("Alder plugin 0.4.3", author_skill)
        self.assertIn("Review only; do not edit product files", review_skill)

    def test_business_design_review_sources_are_bundled_without_drift(self):
        provenance = json.loads((DESIGN_REVIEW / "references/provenance.json").read_text())
        self.assertEqual(len(provenance["alder_source_revision"]), 40)
        for source, digest in provenance["sources"].items():
            bundled = DESIGN_REVIEW / "references" / Path(source).name
            self.assertEqual((ROOT / source).read_bytes(), bundled.read_bytes())
            self.assertEqual(hashlib.sha256((ROOT / source).read_bytes()).hexdigest(), digest)

        self.assertTrue((DESIGN_REVIEW / "SKILL.md").is_file())
        design_review_skill = (DESIGN_REVIEW / "SKILL.md").read_text()
        implementation_review_skill = (SKILL / "SKILL.md").read_text()
        self.assertIn("業務設計書をAlderでレビューして", design_review_skill)
        self.assertIn("コードをAlderでレビューして", implementation_review_skill)
        self.assertIn("read-only", design_review_skill)
        self.assertIn("Review only; do not edit product files", (SKILL / "references/read-only-review.md").read_text())

    def test_optimization_source_is_bundled_without_drift(self):
        provenance = json.loads((OPTIMIZE / "references/provenance.json").read_text())
        self.assertEqual(set(provenance["sources"]), {"docs/optimization-review.md"})
        self.assertEqual(len(provenance["alder_source_revision"]), 40)
        for source, digest in provenance["sources"].items():
            bundled = OPTIMIZE / "references" / Path(source).name
            self.assertEqual((ROOT / source).read_bytes(), bundled.read_bytes())
            self.assertEqual(hashlib.sha256(bundled.read_bytes()).hexdigest(), digest)
        self.assertEqual(
            {p.name for p in (PLUGIN / "skills").iterdir() if (p / "SKILL.md").is_file()},
            {SKILL.name, AUTHOR.name, DESIGN_REVIEW.name, OPTIMIZE.name,
             "alder-draft-check-items", "alder-explore-functional-conditions",
             "alder-discover-business-questions", "alder-follow-up-review",
             "alder-export-business-graph", "alder-check-traceability-drift"},
        )

    def test_review_entry_package_references_resolve(self):
        import re
        entry = SKILL / "SKILL.md"
        stage = SKILL / "references/read-only-review.md"
        for document in [entry, stage]:
            for target in re.findall(r"\]\(([^)]+)\)", document.read_text()):
                path = target.split("#", 1)[0]
                if path and "://" not in path:
                    self.assertTrue((document.parent / path).resolve().is_file(), (document, target))
        # A distinct review procedure remains installable without any product checkout.
        self.assertTrue(stage.is_file())
        self.assertEqual((SKILL / "references/review-knowledge-v0.3.md").read_bytes(),
                         (ROOT / "docs/phase2/review-knowledge-v0.3.md").read_bytes())

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
