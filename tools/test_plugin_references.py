"""Pinned reference navigation and provenance checks; require full Git history.

The package and release-validation workflows provide full-history checkouts.
"""

import re
import shutil
import tempfile
import unittest
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
PLUGIN = ROOT / "plugins/alder"


class PluginReferencesTest(unittest.TestCase):
    def test_adoption_navigation_is_pinned_and_resolves_in_source(self):
        from tools.export_plugin_references import git_bytes

        # Scope: the changed adoption document, not all historic reference links.
        def heading_ids(text):
            headings = set()
            fenced = False
            for line in text.splitlines():
                if line.startswith("```"):
                    fenced = not fenced
                if not fenced and re.match(r"^#{1,6} ", line):
                    title = re.sub(r"^#+ ", "", line).lower()
                    headings.add(re.sub(r"[^\w\- ]", "", title).replace(" ", "-"))
            return headings

        for document in [ROOT / "docs/adoption.md", *[
            PLUGIN / "skills" / name / "references/adoption.md"
            for name in ("alder-draft-business-design", "alder-draft-check-items", "alder-follow-up-review")
        ]]:
            text = document.read_text()
            self.assertIn("Alder uses one user-facing product version", text)
            self.assertIn("was introduced in Plugin 0.4.1", text)
            for target in re.findall(r"\]\(([^)]+)\)", text):
                with self.subTest(document=document, target=target):
                    if target.startswith("#"):
                        self.assertIn(unquote(target[1:]), heading_ids(text))
                    else:
                        self.assertTrue(target.startswith("https://"), target)
                        if target.startswith("https://github.com/mk3008/alder/blob/"):
                            match = re.fullmatch(
                                r"https://github.com/mk3008/alder/blob/([0-9a-f]{40})/([^#]+)(?:#(.*))?", target)
                            self.assertIsNotNone(match, target)
                            revision, source, fragment = match.groups()
                            content = git_bytes(ROOT, "show", f"{revision}:{source}").decode()
                            if fragment:
                                self.assertIn(unquote(fragment), heading_ids(content))

    def test_authoring_required_references_resolve_in_an_installed_package(self):
        # No source repository is available at the installed path.
        with tempfile.TemporaryDirectory() as tmp:
            installed = Path(tmp) / "alder"
            shutil.copytree(PLUGIN, installed)
            document = installed / "skills/alder-draft-business-design/SKILL.md"
            targets = re.findall(r"\]\(([^)]+)\)", document.read_text())
            structure = "../alder-review-business-design/references/business-design-structure.ja.md"
            self.assertIn(structure, targets)
            self.assertIn("Before drafting, also read", document.read_text())
            for target in targets:
                path = target.split("#", 1)[0]
                if path and "://" not in path:
                    resolved = (document.parent / path).resolve()
                    self.assertTrue(resolved.is_relative_to(installed))
                    self.assertTrue(resolved.is_file(), target)
            self.assertEqual((document.parent / structure).read_bytes(),
                             (ROOT / "docs/business-design-structure.ja.md").read_bytes())

    def test_adoption_bundles_reproduce_their_exact_source_commit(self):
        from tools.export_plugin_references import export_plan

        names = ["alder-draft-business-design", "alder-draft-check-items", "alder-follow-up-review",
                 "alder-explore-functional-conditions", "alder-export-business-graph"]
        for path, content in export_plan(ROOT, names).items():
            self.assertEqual((ROOT / path).read_bytes(), content, str(path))


if __name__ == "__main__":
    unittest.main()
