# Plugin authoring validation — Issue #94

## Reproducible case

Use a clean product repository containing only the notes in [`tools/fixtures/plugin-authoring/interview-notes.md`](../tools/fixtures/plugin-authoring/interview-notes.md). Install the Alder plugin from this PR's exact commit, open a new chat, and ask:

```text
このヒアリング結果をAlder業務設計書にして
```

The request should select `alder-draft-business-design` without naming it. Expected scope: create one Business Design under `docs/business-design/`, keep the meeting-room facts, explicitly mark the draft unconfirmed, and surface questions about overlapping changes, existing reservations when a room is stopped, and authority. It must not write Check Items, code, or other product files. Afterward, separately ask `実装が終わったのでAlderレビューして` in a product with an agreed design and implementation: that skill must remain read-only.

The [representative draft](../tools/fixtures/plugin-authoring/business-design.md) is a reproducible **authoring fixture**, not an agreed Business Design or evidence of client routing. Its preamble holds the unanswered questions, leaving the optional export profile's Object/Activity headings intact. Source facts are checked against the interview notes in `tools/test_plugin_package.py`; the export parser checks the supported structure. The tests also check that the packaged authoring guidance is byte-identical to its source and that the review skill retains its read-only instruction.

Run `python3 -m unittest tools/test_plugin_package.py` and `python3 -m unittest discover -s tools/business_graph -p 'test_*.py'`. These tests do not substitute for an installed-client Fresh run. Record its plugin source commit, request, resulting file diff, and route selection before claiming short-request client validation.
