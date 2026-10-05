# Reproducing plugin references

Packaged authorities and scripts remain byte-identical to their canonical sources. Each skill's `references/provenance.json` records a full source commit and SHA-256 digests. Copying working-tree content while retaining an older commit would make that record false.

## Update canonical guidance before exporting

1. Make the canonical source change and review it. Publish that source commit on the intended GitHub working branch; it need not be merged or released. Verify its full SHA on GitHub. A local commit, a matching digest or a successful test does not prove publication.
2. Make that exact commit available in the local checkout. Run the exporter for the affected skills, substituting its full published SHA below:

```sh
python3 tools/export_plugin_references.py \
  --source-revision PUBLISHED_SOURCE_COMMIT \
  --skill alder-draft-business-design \
  --skill alder-draft-check-items \
  --skill alder-follow-up-review
```

3. Run the package checks, inspect the source/copy/provenance diff and publish the generated changes in a subsequent commit:

```sh
python3 tools/export_plugin_references.py --check \
  --skill alder-draft-business-design \
  --skill alder-draft-check-items \
  --skill alder-follow-up-review
python3 -m unittest tools/test_plugin_package.py tools/test_workflow_skills.py \
  tools/test_plugin_release_workflow.py tools/test_export_plugin_references.py \
  tools/test_plugin_references.py
```

The exporter reads each listed source or script with `git show COMMIT:PATH`, preserves its bytes, and regenerates its digest. It uses the existing provenance source lists and rejects missing paths and flattened filename collisions before writing. `--check` reproduces each selected skill from its recorded revision and does not write. The tool validates Git object identity, not remote publication; maintainers must establish publication in step 1. Released packages remain immutable, and workflow changes follow the versioning policy in [Plugin adoption](plugin-adoption.md#reproducibility-and-scope).

## Adoption navigation boundary

The adoption guide's repository navigation, examples and optional further reading use immutable source URLs, so its three flattened package copies do not promise nonexistent sibling files. Those URLs pin the referenced page independently from the adoption guide's own source revision. Further reading requires web access.

Authoring explicitly reads the already installed structure guide from the Business Design review skill and uses that guide's separate provenance. Its required adoption, structure and graph guidance therefore remain readable within the installed plugin, without copying all documentation and research into every skill.

Both the package workflow and the Plugin 0.4.3 release-validation workflow use a full-history checkout for `tools/test_plugin_references.py`. In a shallow local checkout, fetch the referenced source commits or unshallow the checkout before running these reference checks.

The focused regression checks all links directly in the changed adoption guide, verifies pinned file/heading targets, and resolves authoring's required local links in an isolated package copy. It also reproduces the three adoption-bearing skills from their recorded Git source commits. It does not claim recursive link closure for the unchanged graph/structure guides or unrelated skills; their pre-existing outbound navigation is outside this repair.
