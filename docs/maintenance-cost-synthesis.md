# Issue #45 synthesis after two separate experiments

**Updated 2026-09-12.** No architecture prepayment recovery was observed on the measured cumulative source-change proxies in either experiment. The second experiment nevertheless demonstrates a specific benefit: local foresight (B) and Clean Architecture (D) kept an existing HTTP provider implementation unchanged while adding an incompatible provider contract. Working isolation and repaid investment are different observations.

This synthesis is new. It does not amend the [frozen first result](maintenance-cost/results.md), its plan, packets, raw measurements, conclusion or execution evidence. The [second result](maintenance-boundary/results.md) and [authorization](https://github.com/mk3008/alder/pull/46#issuecomment-5643502093) are separate. The first result's historical recommendation not to expand that run remains visible; the user's subsequent request authorized a new experiment within the same Issue/PR.

| Question | First experiment: memory workflow and local policy changes | Second experiment: real HTTP provider addition |
| --- | --- | --- |
| Did current requirements pass? | All 20 arm/stage snapshots pass | All 8 arm/stage snapshots pass |
| Did A require expensive late boundary extraction? | No substantial redesign observed | No extraction; conditional handling in one file, 41 changed production lines |
| Did B's concern create a useful seam? | Local approval-authority helper; marginal ordering metric-sensitive | Alpha client remains byte-identical after adding Beta |
| Did C/D repay initial structure? | No cumulative crossover against A on measured production proxies | No crossover in raw, filtered or post-hoc indentation-normalized views |
| What remains unknown? | Total maintenance cost, practical boundary value, generalization | Total maintenance cost, later semantic/consistency changes, generalization |

Do not pool the two fixtures' line counts into an overall ranking. They use different products, change opportunities and fresh realizations. The first experiment's initial A/B order reverses when blank/comments are omitted. In the second, A is smallest on all reported line proxies, but C's apparent disadvantage against B/D reverses when indentation is normalized. This confirms why source counts are inspectable evidence rather than a comprehensive cost measure.

## Updated hypotheses

| Hypothesis | Combined assessment |
| --- | --- |
| H1: no foresight tends to minimize initial cost | Mixed/unknown generally: metric-sensitive in experiment 1, lower A source proxies in experiment 2. |
| H2: a concrete concern can obtain some architecture benefit with less structure | Limited concrete support: experiment 2's B and D both preserve Alpha, while B uses fewer initial files/lines and lower cumulative lines. B does not beat A's change proxy. No general causal claim. |
| H3: architecture can recover prepayment | Recovery not observed in either bounded sequence. Experiment 2 confirms D's isolation benefit, not recovery or impossibility of recovery. |
| H4: wrong foresight leaves unrecovered cost | Still unknown. Experiment 1 has only a no-hit prefix; experiment 2's forecast hits. No permanently wrong forecast trajectory. |
| H5: no single style is universally best | Universal claim untested. Observed rankings depend on metric/change and desired property; no defensible overall winner. |

For Alder, the evidence is consistent with permitting requirements-led implementation and adding concrete risks when known. It is insufficient to claim that named architectures are unnecessary, that foresight always saves cost, or that minimum source churn is the right optimization target. B shows that a concern can lead an agent to an effective local I/O boundary without specifying a solution name; D shows another route to that same isolation. A shows that this particular real-I/O change can still be handled without large deferred design work.

The authorized addition is complete: **4 new fresh contexts + 4 continuations, eight passing snapshots and independent replays**, using requested `gpt-6-astra` / `low`. Together with the unchanged first experiment, the recorded implementations comprise 28 passing snapshots; this is an artifact count, not 28 independent samples. No extra seed/model/language or further experiment is needed to report these findings honestly. Leave the PR open for human review; no architecture recommendation or product code change is adopted by these experiments.
