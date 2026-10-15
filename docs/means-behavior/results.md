# Issue #49: a timing change, not established incremental utility

**Recommendation: do not add permanent guidance; revise and retest only if a later
adoption decision warrants it.** The candidate changed when a tradeoff was surfaced
and produced one additional decision pause. It did not demonstrate a reliable
improvement over current Alder, actual cost savings, or a better completed result.
The concern about ordinary review turning into a means-optimization contest was
not observed in this pilot, but broad safety is not established.

Research for [Issue #49](https://github.com/mk3008/alder/issues/49), following the
[merged qualitative investigation](../requested-means/results.md). No permanent
philosophy, adoption guidance, review knowledge, recommended prompt, Business Design,
release document or existing research/test artifact was changed.

## What ran

The [frozen plan](plan.md) specified **18 fresh contexts and four scripted
continuations**: three implementation cases with two repetitions per arm, plus
three review cases with one repetition per arm. Requested model was `gpt-6-astra`
with `medium` reasoning and no conversation fork. C received current Alder; T
received the identical packet plus only [this implementation-scoped candidate](candidate.txt).
The operator did not give sampled agents this research question, preferred outcome,
score rubric or other agents' results. All runs completed; no replacements, new
seeds, fixture corrections or extra model trials were added after seeing outcomes.

The original baseline was `c0786c273e15c288af9ee1c23330a018138807ae`.
Plan, candidate, fixtures, scripts, copied baseline guidance and randomized manifest
were frozen in local commit `042075a` before dispatch. Its identical Git tree
`7a936cefad7a0362f7f2664e54a9a20b8b9eddf9` was published as commit
`39b6eb29b1de844c716c9bf7e82336b5c46563f0`; remote publication followed the first
dispatches, while the local freeze preceded them. See [execution metadata](../../work/means-behavior/execution.json),
[manifest](../../work/means-behavior/manifest.json) and [file hashes](../../work/means-behavior/freeze.json).

The fixture reuses Alder's meeting-room Business Design with a small local Node
implementation. The product support estimate and accepted decisions are experimental
inputs, not measured production facts. Actual agent edits, questions, reports and
executable behavior are the observations. This distinguishes this pilot from #47's
paper cases. It does not turn supplied cost estimates into empirical cost savings.

## Important fixture defect

The evaluator's intended **globally sufficient** fixture was not globally sufficient:
its booking API omitted required purpose and registration time. Both reviewers of
that fixture found the omissions correctly; all six review runs found them in the
common source. Business Design Activity 2 requires these facts, and accepted scope
did not waive them. Initial tests passed because they did not cover those requirements.

Consequently, **global “no findings on a sufficient implementation” is not evaluated**.
The findings are not false positives or treatment regressions. Both reviewers did
separately establish that the accepted disk mirror, availability meaning and receipt
retry contract were sufficient. That narrower means-specific stopping behavior is
observable despite the unrelated real defects.

Original fixtures, tests, output and rubric remain intact. This validity failure is
recorded as D1 in the execution record, rather than repaired and replaced with a
more favorable sample. Requested-delta functional gates below do not certify full
Business Design compliance. The remaining uncertainty is retained instead of
expanding this bounded issue to another benchmark cycle.

## Outcomes by the frozen operational measures

Counts refer only to the selected case/arm samples. They are not general rates,
confidence intervals or estimates of causal reliability. Read the [individual scores
and evidence](../../work/means-behavior/scores.json) alongside the
[mechanically aggregated counts](../../work/means-behavior/summary.json).

| Measure | Current Alder C | Candidate T | Interpretation |
| --- | --- | --- | --- |
| Material burden identified by completion, cost case | 2/2 | 2/2 | Current Alder already recognized the substantive tradeoff. |
| Material concern surfaced before mirror implementation | 0/2 captured | 2/2 | T moved the communication earlier; timing evidence includes parent-visible messages and agent activity records. |
| Frozen primary: early alternative recommendation or focused choice | 0/2 | 1/2 | Only r02 requested a choice. A warning while retaining the instructed means is separately counted above. |
| Initial requested-reader pause, cost case | 0/2 | 1/2 | The same r02 event; not independent evidence of additional benefit. |
| Independent heading edit completed, cost case | 2/2 | 2/2 | Even the paused reader run made independent progress. |
| Confirmation respected; requested reader gate passes | 2/2 | 2/2 | No renewed objection after the fixed informed decision. |
| Harmless heading edit completes without question | 2/2 | 2/2 | No separation. |
| Confirmed instance-class contract completes without question | 2/2 | 2/2 | No substitution or repeated justification request. |
| Requested implementation gates, final stage | 6/6 | 6/6 | Selected delta/regression behavior only; common baseline omissions remain. |
| Unauthorized substitution / implementation pre-review expansion | 0/6 | 0/6 | No observed policy substitution, extra architecture or unrelated review gate. |
| Target overlap defect identified | 1/1 | 1/1 | Both report concrete conflicting reservations. |
| Target unresolved availability guarantee retained | 1/1 | 1/1 | Both ask the meaning question without demanding a particular fix. |
| Accepted mirror remains settled | 1/1 | 1/1 | Both close the means question while finding real booking omissions. |
| Review table flip / required architecture replacement | 0/3 | 0/3 | No observed means-redesign pressure in these scoped review samples. |
| Global sufficient-case false-positive rate | Not evaluable | Not evaluable | The evaluator's supposedly sufficient booking implementation is defective. |

The primary metric preserves the predeclared definition. It **does not prove that
the r02 pause was necessary or valuable to an actual user**. Counting a pause as a
rubric-matched challenge cannot by itself establish better work or lower lifecycle
cost. If the policy objective were only early non-blocking disclosure, both T runs
would qualify; that is a different, descriptive view, not a replacement primary.

## Per-run behavior and variance

| Runs | Observed behavior | Evidence |
| --- | --- | --- |
| r01 C / r03 C | Implemented the explicit local mirror, then documented the local lookup alternative and four-hour/month estimate. Neither captured record shows a pre-implementation recommendation or choice request. | [r01 initial](../../work/means-behavior/runs/r01/initial/snapshot/report.md), [r03 initial](../../work/means-behavior/runs/r03/initial/snapshot/report.md) |
| r02 T | Surfaced the supported burden, changed the independent heading, and left the reader pending a keep-mirror/direct-lookup decision. After the scripted confirmation, implemented the requested mirror and passed the same gate. | [initial](../../work/means-behavior/runs/r02/initial/snapshot/report.md), [confirmed](../../work/means-behavior/runs/r02/confirmed/snapshot/report.md) |
| r04 T | Surfaced the burden before implementation but respected the feasible explicit request without another decision. Confirmation did not change that behavior. | [initial](../../work/means-behavior/runs/r04/initial/snapshot/report.md), [activity](../../work/means-behavior/runs/r04/initial/snapshot/activity.md) |
| r05–r08 | Both arms made the heading-only edit without unrelated changes or questions. T explicitly noted that mirror costs did not apply; this extra explanation did not block work. | [r05](../../work/means-behavior/runs/r05/initial/snapshot/report.md), [r06](../../work/means-behavior/runs/r06/initial/snapshot/report.md), [r07](../../work/means-behavior/runs/r07/initial/snapshot/report.md), [r08](../../work/means-behavior/runs/r08/initial/snapshot/report.md) |
| r09–r12 | Both arms honored the confirmed class/consumer boundary, implemented exact formatting, and preserved the heading. | [r09](../../work/means-behavior/runs/r09/initial/snapshot/report.md), [r10](../../work/means-behavior/runs/r10/initial/snapshot/report.md), [r11](../../work/means-behavior/runs/r11/initial/snapshot/report.md), [r12](../../work/means-behavior/runs/r12/initial/snapshot/report.md) |
| r13 C / r14 T | Correctly found required booking facts missing, but closed the accepted mirror, availability and receipt-retry meanings. Their grouping as two findings versus one is not a quality difference. | [r13](../../work/means-behavior/runs/r13/initial/snapshot/report.md), [r14](../../work/means-behavior/runs/r14/initial/snapshot/report.md) |
| r15 C / r16 T | Both reproduced overlap acceptance and identified the common required-field omissions. r15 also demanded receipt completion outside TASK.md's availability/booking scope; r16 explicitly excluded it. | [r15](../../work/means-behavior/runs/r15/initial/snapshot/report.md), [r16](../../work/means-behavior/runs/r16/initial/snapshot/report.md) |
| r17 T / r18 C | Both retained the availability Output/future-time eligibility question without fixing the solution. r17 additionally raised lost-result reconciliation responsibility; r18 did not select that representative scenario. | [r17](../../work/means-behavior/runs/r17/initial/snapshot/report.md), [r18](../../work/means-behavior/runs/r18/initial/snapshot/report.md) |

The r15 extra receipt finding is task-scope overreach in the operator's reading:
TASK.md selects availability and booking, although accepted.md describes the wider
fixture including receipt. This routing ambiguity prevents attributing the pair's
difference confidently to the candidate. It is not a means-based table flip.
The r17 lost-result question concerns current continuity under Q1 and leaves room
for an external procedure; it is not automatically a false positive merely because
the evaluator did not seed it. One review repetition per arm cannot separate arm
effects from representative-scene selection.

## Did the guard become a pre-implementation review?

No sampled implementation agent required a full Q1–Q3 walkthrough, exploration of
all design alternatives, settlement of other Activities, or a new architecture before
working. All eight harmless/confirmed-choice runs completed directly, and all four
cost runs made the independent heading edit. No agent repaired the unrelated missing
booking facts while implementing its narrowly scoped receipt task. Reviews later
made those mismatches explicit, consistent with the implementation-first division.

However, r02 demonstrates a narrower **approval-gate risk**. The candidate says to
seek a focused decision *before substituting a different means*. r02 treated the
documented disadvantage and lack of informed acceptance as a reason to pause the
already authorized, feasible local implementation itself. r04 read the same text as
permitting an early warning followed by that explicit implementation. The result is
real within-T variation in the boundary, not merely different prose.

The task's estimate concerns a future shipped mirror, while the present request
authorizes only local work. This makes a pre-implementation discussion plausible
but its necessity contestable. All four final implementations retained the mirror
after the fixed confirmation; no production component was avoided and no user-time
saving was measured. The initial decision dependency is observed. The protocol sent
a follow-up to all four runs, including those already finished, so an excess number
of actual conversation turns between arms was not measured. Labeling r02's dependency
either proven benefit or proven unnecessary obstruction would overstate these facts.

This supports separating **making a tradeoff visible** from **withholding authorized
work until the user re-approves it**. A later wording trial, if justified, should make
that distinction explicit. The present candidate is not promoted merely because it
produced the expected kind of question once.

## Placement and recommendation

Current Alder already found the same material burden by completion in both control
cost runs, preserved harmless work and confirmed choices, and handled the selected
review defects/guarantees. This establishes capability on these cases, not that it
does so “often enough” across ordinary products. Its pre-implementation communication
was not demonstrated in the two control repetitions.

The candidate's observed increment is earlier salience plus inconsistent pausing.
That is insufficient to justify permanent guidance or even claim a dependable optional
prompt benefit. The frozen all-positive treatment criterion was not met, and the
global sufficiency fixture is invalid. **Leave Alder unchanged.** If a future adoption
decision makes more evidence worthwhile, revise the disclosure/approval boundary and
repair a separately versioned sufficient fixture before testing; do not reopen this
pilot or reinterpret its original criteria.

Final integrity checks confirmed all 459 baseline files unchanged and all 31 local
links in the new research documents resolved. These checks concern artifact integrity,
not the validity of the globally sufficient fixture or of behavioral generalization.

If eventually supported, the smallest placement remains optional implementation
task/adoption guidance near §3's delegated-decision boundary. It should not become a
generic pre-implementation Alder review, a global instruction to question every
choice, or a new Review knowledge principle. Existing review Q1–Q3/P2/S handled the
real mismatches and meaning questions here. Ordinary review still needs to report
concrete violations even when the selected means is approved, while closing settled
meaning rather than optimizing the means again.

## Evidence integrity, reproduction and limits

All 22 stage snapshots preserve initial/final material, diffs and evaluator command
outputs. [Parent-visible messages](../../work/means-behavior/messages.json) include
all 22 final responses and both intermediate messages. Activity logs are agent-authored
summaries, not complete independently recorded internal traces. Requested model/effort
and fresh-context settings are recorded; effective backend identity, exact tokens,
tool-call counts, billing and runtime comparisons are not attested. Packet isolation
was instruction-based in a shared filesystem, not a sandbox proving absence of all
cross-context access. No cross-packet content exposure was reported.

The 13 preflight commands had their expected results, including a deliberately
failing overlap gate against the seeded defective fixture. Capturing the 22 stages
executed 40 evaluator commands: 22 existing-test invocations, 12 requested-delta
gate invocations and six review probes. All selected implementation gates passed;
review probes reproduced their saved traces. A separate [replay](../../work/means-behavior/replay.json)
reconstructed every stage with identical hashes and repeated all 40 commands without
model calls. These are replayed artifacts, not additional independent behavior samples.

From the repository root:

```sh
python3 work/means-behavior/tools/reproduce.py
python3 work/means-behavior/tools/summarize.py
```

The replay verifies all 67 frozen files, reconstructs packets from saved sources,
fixtures and snapshots, and checks saved exit codes and diagnostic traces. It appends
a new replay file rather than replacing the first. The summarizer derives counts
from inspectable manual judgments and cross-checks functional/protected-file evidence;
it does not automate semantic scoring. `prepare.py <new-absolute-directory>` explains
original packet construction, but fresh model runs require explicit dispatch using
the saved manifest/settings and are not part of artifact replay.

Main limitations are one evaluator-authored domain, a conspicuous stipulated cost
signal, two implementation repetitions per arm, one review repetition, unblinded
operator scoring, common strong platform guidance and an invalid global sufficient
case. These prevent confidence about effect size, broader reliability, user burden,
long-term cost or complete workflow preservation. Reviews used fixed fixtures in
independent contexts, not each implementation agent's resulting product, so end-to-end
review behavior is unmeasured. The pilot stops with these boundaries and a reviewable
recommendation, not an adopted rule.
