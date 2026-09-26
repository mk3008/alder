# Issue #99: conversation-to-Discovery reproduction

This is one synthetic research case, not an agreed customer Business Design or a performance estimate. The customer, designer, design evaluator, Discovery agent, and oracle evaluator had separate agent contexts. Role instructions and the customer fact card are in `scenario.md`, with launch prompts in `role-prompts.md`; the designer's initial input was only `initial-brief.md`. The actual exchange is in `customer-transcript.md`. Exact designer prompts and its reported source access are in `designer-prompts.md`; the Discovery prompt and reported access are in `discovery-prompt.md` and `discovery-read-log.md`. The evaluator's exact assignment is in `design-evaluation.md`; the oracle evaluator's assignment is reproduced in `oracle-evaluation.md`.

## Frozen sequence

1. The keeper wrote `scenario.md`, `initial-brief.md`, and the sealed oracle outside the repository. Before the first draft, the oracle plaintext SHA-256 was recorded in `oracle.sha256`: `2ffa150007e3baf934251793212ca436ed0ce5c812e946cddf093587905b2e01`. The public inputs and commitment were committed as `1a354f7`. That local commit happened after the first drafts were under way but before Discovery; the commitment file and plaintext existed before all agent outputs. The commit alone is **not** proof of the earlier creation time.
2. The designer used Alder Plugin `0.2.1`, source branch `b6660f73713ca11298b4fefe771e4af56a05fa01`, bundled authoring source `af733229c7f20c5a9fc1c4f094a8fb8c548fe544`. It read the actual `alder-draft-business-design` Skill and bundled guidance. It produced `design/v1.md`, asked five questions, incorporated the customer's answers in `v2.md`, and incorporated the later school course in `v3.md`. A design evaluator found one unsupported current-practice statement; a further customer clarification led to a Skill-mediated `v4.md`. `design/v1-v2.diff`, `v2-v3.diff`, and `v3-v4.diff` preserve each update.
3. The independent design evaluation and its v4 addendum are in `design-evaluation.md`. The final design was **not** signed off by a real customer. Its unanswered allocation, reassignment, notice and custody decisions remain questions.
4. A Fresh Discovery agent saw only `design/v4.md` as business input, without Problem/Pain, transcript, scenario, oracle, prior research, or evaluator output. Its unchanged result is `discovery-raw.md`. The full inputs and raw were committed as `24e7766` **before** the oracle was copied into the repository. The raw hash at freeze was `b8ee34b814e95320b4bd2231251257a4ed58352bcc17190d6b13b47215b0ec25`.
5. Only after that freeze was `oracle.md` revealed. Verify it with `sha256sum -c oracle.sha256` from this directory; compare the raw and oracle using `oracle-evaluation.md`.

## Independent rerun

Use fresh contexts and pin the plugin branch and bundled source revision above. Keep the oracle file outside all authoring and Discovery read paths until their output is frozen. Give a customer agent `scenario.md`, but give a designer only `initial-brief.md` and the Skill. Let the designer produce a draft and questions. Relay customer answers to the designer, update through the Skill, then relay the school-course addition and update again. The transcript records the actual questions and responses; a rerun can reproduce them exactly or let the customer answer new questions from its card. Independently check the resulting design against spoken facts before giving only that final design to a Fresh Discovery agent with `discovery-prompt.md`. Compare the raw output to the oracle only afterward. Judge semantic and structural evidence rather than exact Markdown or identical wording.

Requested agent configuration for customer, designer, design evaluator, Discovery, and oracle evaluator: `gpt-6-sol`, reasoning effort `medium`, `fork_turns: none`. Local task identifiers were `/root/customer`, `/root/designer`, `/root/design_evaluator`, `/root/discovery`, and `/root/oracle_evaluator`. The keeper was `/root/keeper` under the same requested settings. These are requested settings, not independently verified runtime settings. The contexts shared a filesystem; read restrictions were instructions and reported access logs, not an enforced access-control boundary. The coordinating agent did not inspect the oracle plaintext until after commit `24e7766`. The launch prompts are retained in `role-prompts.md`; some incidental orchestration prompts are reconstructed by the exchange rather than captured byte for byte. `designer-prompts.md` and `discovery-prompt.md` permit exact input reconstruction for the decisive stages.

## Integrity ledger

The following are SHA-256 of the final files at the raw freeze or, for the newly revealed oracle, at revelation. The transcript includes the post-evaluation clarification.

| File | SHA-256 |
| --- | --- |
| `scenario.md` | `8a5c2b4e901592dc85da3a972acc41b5fe3b07fa9a5c70a2cadb22345b6411c9` |
| `initial-brief.md` | `90966bcf51b1516e8d5df46dd0d1cab6f52390df3617b4b79ab6cd3a34290776` |
| `customer-transcript.md` | `6336ed4f0f831ba32f0802eb66e02ad3b498f08089b279557b0f0102500192e6` |
| `design/v1.md` | `11751c36a30256a3861802490cf10c79daa6ae5bcc50adfcfa5dc7e6c6441372` |
| `design/v2.md` | `1c11e14c2608623c3c5f6932b74ae65e69799a7d13c9c78fa10ff4ba5f3f645f` |
| `design/v3.md` | `2a942104fd78adca43fcf132abbe2888fb85e2d0d7b56cc7d36a510245427144` |
| `design/v4.md` | `253b8226880a3055bd6d1233e400fcf0f108f995dfa9a97087ed06a7144c777e` |
| `discovery-prompt.md` | `9b7ec954e9ec86783142c3d4b8e5fdb8b77cf4f8ab8fc4f5270ad73b227cf29d` |
| `discovery-raw.md` | `b8ee34b814e95320b4bd2231251257a4ed58352bcc17190d6b13b47215b0ec25` |
| `oracle.md` | `2ffa150007e3baf934251793212ca436ed0ce5c812e946cddf093587905b2e01` |

This case cannot establish general Discovery recall or prove that none of the agents used undeclared paths. It exposes the actual authoring correction and remaining unconfirmed business decisions rather than silently replacing the draft with a hand-written answer. It is intentionally separate from #96 and #98.

## Publication decision and gaps

This run found the oracle's main cross-business timing and commitment question, but the final Business Design remains unagreed. The customer role was simulated and no real operator reviewed the resulting meaning. Therefore the README is not updated with this as an approved model case. Its transcript and drafts can be used as a research example with this qualification.

The authoring draft initially turned a schedule's visibility into an asserted routine check; the evaluator detected it and a customer clarification corrected v4 through the same Skill. The interview never elicited whether the course team routinely checks future loan promises before fixing its required count. The final design also leaves the school-course planning and transfer correlations open. These are recorded as an observed fidelity lapse and interview/representation gaps, not silently repaired by consulting the keeper's unspoken role card. A single run does not establish that changing the Skill would solve them; a separate repeat would be needed before revising general guidance.
