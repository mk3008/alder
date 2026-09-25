# Plugin authoring validation — Issue #94

## Reproducible case

Use a clean product repository containing only the notes in [`tools/fixtures/plugin-authoring/interview-notes.md`](../tools/fixtures/plugin-authoring/interview-notes.md). Install the Alder plugin from this PR's exact commit, open a new chat, and ask:

```text
このヒアリング結果をAlder業務設計書にして
```

The request should select `alder-draft-business-design` without naming it. Expected scope: create one Business Design under `docs/business-design/`, keep the meeting-room facts, explicitly mark the draft unconfirmed, and surface questions about overlapping changes, existing reservations when a room is stopped, and authority. It must not write Check Items, code, or other product files. Afterward, separately ask `実装が終わったのでAlderレビューして` in a product with an agreed design and implementation: that skill must remain read-only.

The [representative draft](../tools/fixtures/plugin-authoring/business-design.md) is a reproducible **authoring fixture**, not an agreed Business Design or evidence of client routing. Its preamble holds the unanswered questions, leaving the optional export profile's Object/Activity headings intact. Source facts are checked against the interview notes in `tools/test_plugin_package.py`; the export parser checks the supported structure. The tests also check that the packaged authoring guidance is byte-identical to its source and that the review skill retains its read-only instruction.

### First installed-client run (revision `29747b2f79f1ceba85fb9d1ac048e2f2b5bd0266`)

From a new Work chat, with the exact short request above and the fixture notes pasted inline, the installed Plugin 0.2.0 produced one `meeting-room.md` file. The optional export parser accepted that file. It retained the stated actions and exposed unresolved questions about overlap, authority, change failure and existing reservations on room shutdown. However, its cancellation Result asserted that cancellation frees the time slot for the next search, which the notes did not establish. **This run fails the no-invented-policy criterion.** Plugin 0.2.1 tightens the skill to require a sentence-level source check, including Result and downstream consequences, and adds a regression question in the representative fixture. The run had no pre-existing product file, so a one-file output is not yet a strong write-boundary regression test. Its browser conversation was `https://chatgpt.com/c/WEB:b4224037-74d0-4f08-904f-e9736190142f`; the requested model was the browser's GPT-6 Astra Light and effective runtime settings were not independently verified. The 0.2.1 installed-client rerun is pending approval for updating the existing test plugin. Record the exact source revision, output and diff when rerun.

Run `python3 -m unittest tools/test_plugin_package.py` and `python3 -m unittest discover -s tools/business_graph -p 'test_*.py'`. These tests do not substitute for an installed-client Fresh run. Record its plugin source commit, request, resulting file diff, and route selection before claiming short-request client validation.
