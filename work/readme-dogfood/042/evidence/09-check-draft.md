# 09 — Check Item initial draft

## Result

Created `workspace/docs/checks/tool-return.md`, initial list v1, with 9 new Checks (`TR-01`–`TR-09`), all `未レビュー`. The fixed simulated rules cover matching acceptance, initial timestamp, inspection-wait state, unavailability for lending, four independently reviewable mismatch/shortage outcomes, and preservation of the first timestamp on reprocessing.

The artifact is explicitly an unresolved-input reference draft, not an agreed handoff. The source Business Design says human agreement is unfinished. Simulated agreement on the source rules did not become human confirmation of newly authored Check titles, conditions or expectations. Unknown responsibility, notification/storage and post-exception continuation remain separate `要確認` topics. Explicitly deferred physical handoff remains outside this draft's Check expectations and is not asked again.

## Selection and bounded method

- Complete source catalog read: `evidence/available-skills.txt`.
- Exact README prompt selected `alder-draft-check-items` on its description: initial Check derivation from Business Design, not implementation review or follow-up.
- Source Skill: `codex-home/plugins/cache/alder-development/alder/0.4.2/skills/alder-draft-check-items/SKILL.md`.
- Read in full: source Skill, `references/check-item-traceability.md`, `references/candidate-c3.md`, `references/provenance.json`, and both permitted product inputs.
- Read the required adoption span: `references/adoption.md`, lines 235–286, from “Draft and review Check Items (required)” through “Optional: use Functional Interfaces as a responsibility index.” The first broad tool output truncated part of adoption; a second, targeted read supplied the required span without truncation.
- Project instructions: no filesystem AGENTS.md found in the workspace or checked ancestry. The supplied conversation rule remains applicable.
- No pre-existing Check artifact was present in `workspace/docs/checks/`; no prior derivation or past experiment was consulted.
- No account c0/c11 Skill, implementation, Test, old review, parent finding or prior tool history was read. No implementation, product Test execution, independent review or self-review was performed.
- Source catalog routing and a native worker produced this artifact. This is not evidence that a real host client automatically discovered/loaded the plugin.
- Requested native setting: inherited model / xhigh / no-history. Effective runtime setting: unverified.

## Full prompts

### Exact README user prompt

> この業務設計書から、Alderでチェック項目の草案を作って。

### Bounded diagnostic assignment received

Run next bounded source-catalog diagnostic for public Alder0.4.2 at6d30b93. Workspace <dogfood><workspace-root>. Read complete ../evidence/available-skills.txt and choose the Skill from the exact README prompt below; read that source Skill and required authorities. Do not use account c0/c11 skills0.4.1, old experiments, parent findings or prior tool histories. Allowed product inputs: docs/business-design/tool-return.md and ../evidence/simulated-feedback.md. The fixed rules in this fixture are simulated requester-agreed inputs, not real user's business acceptance. Explicitly undecided physical handoff and other unknown roles remain unconfirmed. Exact README user prompt: この業務設計書から、Alderでチェック項目の草案を作って。

Save the requested draft using normal project convention docs/checks/tool-return.md. Start new Checks as 未レビュー; do not turn simulated BD agreement into human-reviewed Check states. Preserve non-implemented/unconfirmed expectations separate from confirmed business meaning. Do not implement, run product tests or self-review yet. Save concise observation/full response with selected Skill, full prompt, input/output hashes, paths and friction to ../evidence/09-check-draft.md. Requested native setting inherited/xhigh/no-history, effective runtime unverified. [Administrative coordination omitted; this task prompt is a safe abstraction.]

## Full task response

チェック項目の草案を `docs/checks/tool-return.md` に保存しました。TR-01〜TR-09 の 9 件をすべて「未レビュー」で作成しています。

- 番号・付属品が一致した場合の受領、返却日時の記録、点検待ち、貸出不可を分けて記載しました。
- 番号不一致・付属品不足の場合の、受領非確定、日時を記録しないこと、点検待ちへ変更しないこと、窓口への要確認をそれぞれ確認できる形にしました。
- 同じ貸出の再処理では、最初の返却日時を保持する条件を残しました。

入力が未完成・未合意の草案と明記されているため、今回は「未解決入力の参考草案」です。模擬入力の条件を、実際の人による Check の確認済み状態にはしていません。

優先して確認したい点は、受領を確定する担当と、要確認結果を受け取る窓口が同じ担当か、別担当かです。別担当なら両者の責任を Business Design で整理してから、役割・権限の Check を導きます。通知・保管責任と要確認後の手順も未確認のまま別枠に残しました。物理的な引渡し方法は明示的な保留・対象外として維持しています。

実装や Test は作成・実行していません。Test の証拠が未収集であることと、業務上の未確認事項は分けて記載しました。

## Inputs, output and provenance

All paths below are relative to `alder-readme-dogfood/`, unless stated otherwise. Digest algorithm: SHA-256.

| Path | Digest / role |
| --- | --- |
| `evidence/available-skills.txt` | `e4b66c8464ecb8f5ed65ca99185140f6335b1753bddb482eccd866bc6cb41436` — complete routing catalog |
| `workspace/docs/business-design/tool-return.md` | `687f04cc6848d9b3daeef36bbe03c45eff5bd985c91abc4db169fcb1bc3124f4` — full 138-line Business Design input |
| `evidence/simulated-feedback.md` | `d22a536ff015811d28a1566fb162d0381b305e2dedf8113fc702ad1d8aac5a94` — simulated source-rule agreement, not Check-level review |
| `workspace/docs/checks/tool-return.md` | `a366d2a44ff1fbc75384b829e695c49a4f40e138b8a09ef1f82fdfa4510f9e47` — output, 167 lines |
| source `SKILL.md` | `57f92c6886a78754ad88b3afff5712919e87595f168ba6451b26d673e5f79894` |
| source `references/check-item-traceability.md` | `87b98910b3cc5be9b7b2ccba017d57dba38be2b18db4faa22a6ac24d5529a884` |
| source `references/adoption.md` | `c2d153263b765f8870531e658b8e410d9a90043d585056c16146159bf29b0547` |
| source `references/candidate-c3.md` | `a5c3874601d70edf87e1fc79b5501be80c35aa4f98d3870a545b79f4867f8446` |
| source `references/provenance.json` | `174f07d0f1e42273a9bd3f5c104b44f14661797ea090fae414c7f9c354c32e0f` |

Alder plugin: 0.4.2. Public plugin commit: `6d30b93` as supplied by the assignment (short SHA; not independently resolved in this stage). Bundled authority source revision: `f904fe1e584ed6693983d58749b1f9dec83b3c8c`. Three used authority-file digests agree with `provenance.json`.

## Friction and limits

1. The README request routes cleanly from the catalog, but the actual Business Design header explicitly states that agreement is unfinished. The Skill therefore yields a reviewable reference draft rather than a ready design handoff.
2. The simulated feedback says source-backed Checks should become “模擬確認済み.” The new-draft task and current Skill require new Check meaning to remain unreviewed until title/condition/expectation are actually reviewed. All 9 Checks therefore remain `未レビュー`; no approved Check state was fabricated.
3. Historical c3 mentions Code/SQL permanent mappings. The Skill and current authorities explicitly override that passage; the output limits future mappings to Test/assertion.
4. Missing loan records, unspecified multi-loan batching, extra accessories, and roles do not receive invented expected outcomes. The output records the applicable input boundary and unresolved roles without creating unapproved pass/fail policy.
5. The source says notification and physical handoff are not guaranteed by “点検待ち.” That boundary is retained, avoiding an accidental handoff-completed or notification-sent expectation.
6. No authorization blocker occurred. No product tests or semantic self-review were performed; SHA-256 and line-count operations only recorded files and source provenance.
