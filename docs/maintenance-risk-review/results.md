# Risk-alignment review: why the expected benefits did and did not appear

**Retrospective evaluation, 2026-09-12.** The stronger hypothesis is partly borne out: B's local forecast and D's I/O boundary both isolate the original provider in experiment 2, and B obtains that particular benefit with a smaller initial source footprint. Their complete benefit sets are not equivalent, however. A new diagnostic confirms that D exposes an injectable application seam for testing successful workflow behavior without HTTP. B separates transport into a module but constructs its concrete clients inside the application entry.

The contrary source-churn result also has a concrete explanation: A reuses existing request/response scaffolding through local branches. Both providers still implement the same two application operations, without a change in durability or completion semantics. A needs no expensive extraction for this change. This is observed inexpensive adaptation on a source proxy within the fixture, not proof that deferred structural design is generally cheap.

The earlier response separated isolation from line-count recovery but did not sufficiently investigate which benefits were obtained or which instruments missed them. This addition supplies that analysis. Neither experiment, its measurements/conclusions, nor the previous synthesis is edited. **All 445 previously tracked files match their baseline SHA-256 hashes.** The stronger grouped expectation was added after the results; this is not an original preregistration.

## Hypothesis and evidence standard

The [review request](https://github.com/mk3008/alder/pull/46#issuecomment-5643647704) asks whether local knowledge of risk R can obtain the major benefits of an R-suited architecture with less prepayment, and whether encountering R without foresight requires expensive restructuring.

For experiment 2, the expected leading group is **B and D** on provider-related benefits; the other group is **A and C**. No B-versus-D or A-versus-C order follows. C's feature grouping is a valid tactic on a different axis. These are evaluations of the actual implementations, not blanket properties of every VSA or Clean implementation. Experiment 1's single approval-policy change may already align with C's feature boundary; it does not justify importing the same B/D grouping mechanically.

The expectation has necessary conditions: the boundary must address the actual costly change, the agent must translate the forecast effectively, and avoided work must exceed added structure over the measured horizon. An ideal chooser could ignore unhelpful information; one generated implementation is not a globally optimized solution. More information therefore makes a strong comparative hypothesis reasonable, but does not guarantee a deterministic cost ordering.

For any chosen cost measure, cumulative advantage requires:

~~~text
(initial_B − initial_A) + Σ(change_B − change_A) ≤ 0
~~~

This is an accounting identity, not a new score. A matched risk alone does not remove the initial difference. Failure of the inequality on source lines does not negate benefits that source lines do not price. We separate correctness, locality, dependency direction, test boundary and cost proxies.

Evidence labels used here:

- **Observed:** supported by source, prompt, hash comparison, recorded Gate or the new diagnostic.
- **Mechanistic inference:** a specific code/data-flow explanation fits the observations, without isolating causation.
- **Unresolved alternative:** artifacts cannot decide the cause. No false-positive/negative rate or significance is estimated.

## Experiment 1: real function boundaries inside small files

All original 20 functional Gates and replays passed. In-memory operation permits every arm to test the workflow without external I/O, so this fixture cannot discriminate I/O-testing advantage.

| Arm | Observed F1 change and logical boundary | Locality implication |
| --- | --- | --- |
| A | Approval selects the role and uses an existing generic transition; the transition body is byte-identical from U2 to F1 | Existing present-tense structure supports local adaptation without a new module |
| B | The authority helper gains the amount rule; the approval use-case body itself is byte-identical from U2 to F1 | Forecast produced a policy boundary within one file; file count misses it |
| C | The approval slice gains the rule | Its feature boundary already matches a single-feature policy change |
| D | Application passes an actor object instead of actor ID; authorization moves into domain approval | Real domain/application separation exists, but its contract also needs adaptation |

B also changes its role enumeration, so the entire change is not confined to its authority helper. Its validation choices differ from A. Raw F1 churn is B=7 versus A=5; excluding blank/standalone-comment changes gives B=4 versus A=5. Replacing two B policy comments with one contributes three raw changed lines. The final threshold change is one line replacement in every arm.

**Why the expected benefit appears:** B's advance concern identifies the approval decision, and its private helper isolates that decision from orchestration. This is a logical policy boundary without another file, class or exported interface. The unchanged approval body is direct evidence.

**Why large savings do not appear:** there is one approval operation and one place to read the amount. A's existing transition already accepts a role. C already has an approval feature. A local comparison or role choice is tiny in all implementations, leaving little duplicated policy work for B to eliminate. D additionally needs actor information across a boundary where only actor ID was previously passed. The observed differences do not require the explanations “B ignored the forecast” or “D omitted architecture.”

The policy risk occurred, but the costly propagation/restructuring mechanism was barely engaged. This does not erase the first experiment's initial ranking sensitivity or retroactively equate all designs.

## Experiment 2: evaluation by distinct axes

The original eight Gates and replays passed, including loopback HTTP, mixed-provider cancellation and local failure atomicity. The new diagnostic below is separate from those Gates.

| Axis | A: current requirements | B: provider forecast | C: VSA | D: Clean Architecture |
| --- | --- | --- | --- | --- |
| Functional correctness | Original Gate passes | Original Gate passes | Original Gate passes | Original Gate passes |
| Existing provider isolation | Alpha wire expressions in booking/cancellation change into conditional handling | Alpha module is byte-identical; Beta added separately | Alpha blocks wrapped/reindented in both mutating slices | Alpha adapter byte-identical; Beta added separately |
| Logical dependency direction | Commands contain HTTP details | Entry imports/concretely constructs clients, then calls small operation contracts | Mutating slices contain HTTP; entry composes features | Application imports no transport/store implementation; dependencies are injected |
| Existing policy-test seam | No application/provider injection argument exposed | Transport separation exists, but application does not accept substitute clients | Slice accepts Map/config, but its successful path still invokes fetch | Existing application factory accepts replaceable shipment operations and records |
| Deferred restructuring | Local branching/response normalization; no extraction | Single client generalized into provider map | Branches within existing slices; configuration propagation | Single injected service becomes provider-indexed services; application still changes |
| Unrelated query locality | Lookup/detail function bodies unchanged | Lookup/detail function bodies unchanged | Detail file unchanged | Detail body and memory-store file unchanged |

An unchanged provider module is meaningful because its responsibility was chosen before the change. However, it does not imply an unchanged whole execution path: B/D composition and command routing change. All arms still require regression tests of assembled Alpha behavior.

Conversely, A's one changed file does not mean every behavior inside it changed. Exact region comparisons show stable lookup/detail functions. Folder or class counts are not architecture-quality measures; the first experiment's B policy helper and A shared transition are also logical boundaries.

### The targeted test-boundary diagnostic

The evaluator executes unchanged saved S1 sources with a fetch guard that throws before network I/O and counts attempts. For each public entry, invalid input fails before fetch; a valid booking reaches the guard once and creates no record. **D's public entry is deliberately included as a control** and does the same. C's directly exported booking slice also reaches the guard.

Using D's **already exported application factory**, the diagnostic injects fake shipment operations and the existing memory store. It checks normalization/default selection, three successful bookings, two successful cancellations, duplicate/invalid/repeat guards, mixed-provider routing, defensive copies, failed booking without ID reservation, and failed cancellation without state change. Fetch calls are zero.

**All six diagnostic cases pass on the first run.** The [raw attempt](../../work/maintenance-risk-review/records/attempts/run-001.json) preserves command arguments, output, fake-operation traces and exit codes.

This establishes an existing substitution seam, not a general testability score. A/B/C could still test without real network through a global fetch substitute or module-loader replacement; their effort, fragility and speed were not compared. The guard is not a successful global HTTP mock. D's successes use its declared application dependency arguments. Those fake operations do not test wire contracts or distributed transactions.

The central distinction is therefore narrower and stronger than “B/D both have layers”: **B matches D's provider-module isolation, but does not expose the same application-level inversion/substitution seam.** D's extra source includes a memory-store boundary and composition with an additional observable capability. Calling every extra line wasted overhead would omit that benefit.

## Why the source ranking differs

Original measures remain unchanged:

| Experiment 2 arm | Initial raw | Provider-addition raw | Cumulative raw | Cumulative blank/comment-filtered | Cumulative indentation-normalized |
| --- | ---: | ---: | ---: | ---: | ---: |
| A | 57 | 41 | 98 | 92 | 92 |
| B | 69 | 50 | 119 | 113 | 113 |
| C | 67 | 88 | 155 | 152 | 110 |
| D | 87 | 55 | 142 | 133 | 133 |

The indentation view was already recorded as a post-hoc diagnostic in experiment 2. It remains a formatting-sensitive source proxy, not semantic or labor cost.

B/D each add a 34-line Beta implementation containing wire handling and packaging. A instead shares fetch/control-flow scaffolding and selects URLs, authentication, payloads, expected statuses and result fields. This explains a smaller patch without proving that such sharing is always safer or easier to understand. Both Beta operations still fit the existing request/response booking lifecycle.

Relative to A, B starts 12 raw lines larger and adds 9 more at S1, leaving 21. D starts 30 larger and adds 14 more, leaving 44. There is no observed marginal line saving to repay the initial gap; this remains true in the reported sensitivities. Future marginal costs cannot be extrapolated from one provider addition.

C wraps and indents existing Alpha blocks. Its S1 falls from 88 to 46 after normalization, below B's 48 and D's 50 in that view. Thus the apparent raw B/D advantage over C is a **false-positive candidate** if interpreted as less semantic work or labor. C still lacks a separate unchanged provider module. These facts do not conflict.

A stays smallest in all recorded line views, so this narrow result cannot be dismissed solely as whitespace noise. Its branches reuse existing code in a small, weakly constrained fixture. They may create later coupling/review costs, but those costs are not measured. We do not invent a future penalty to restore the expected ranking.

## Explanation checklist from the review

| Candidate explanation | What the artifacts establish | Remaining boundary |
| --- | --- | --- |
| Risk not sufficiently triggered | E2 really changes auth, payload/unit mapping, statuses and cancellation protocol. Completion/consistency semantics, durability and client population stay fixed. E1 changes policy but one comparison suffices. | “Risk never fired” is false for the specified risk. Costly propagation was weak. Redefining R after seeing cheap adaptation would unfairly rescue the hypothesis. |
| Forecast too specific/weak or untranslated | B creates the policy helper in E1 and client boundary in E2. Its E2 S0 report explicitly connects its operation contract to future providers. Neither prompt supplies an interface/port/adapter name, Beta endpoint/schema or exact future threshold. | Translation is observed. Optimal forecast strength and its causal effect are not established. B's missing application injection seam is not an unfulfilled explicit requirement. |
| Style lacks the relevant tactic | D has inward dependencies and injectable services, verified by the new probe; E1 has pure domain functions. C implements feature slices with local HTTP. | No artifact basis for calling these failed style implementations. Other legitimate realizations may differ. |
| A cheaply adapts with little prior constraint | E1 preserves a generic transition; E2 adds branches/normalization without extraction or a failed original check. | No labor measurement or evidence for migrations, ownership changes or mandatory future extraction. |
| Public API supplies a free common boundary | All arms receive explicit commands, lifecycle and record contracts. E2 has two effects that both providers can normalize into. | This provides a common outer API, not D's inner injection seam or B's adapter. Its causal magnitude is unknown. |
| Proxy misses important benefits | Function locality, provider isolation and injected policy testing differ without cumulative line savings. C's normalized rank changes. | Comprehension, review speed and defect probability remain unmeasured; no substitute overall score is invented. |
| Incidental independent implementation differences | Role enumeration/comments in E1, ternary reuse versus Beta modules, C indentation and D's extra storage seam are concrete differences. | Attribution to prompt/style versus incidental generation is not isolated. B–D initial subtraction is not the price of architecture. |
| One realization / agent variance | Original requests used the same Astra/low settings, but each arm is a different realization and effective backend settings are not attested. | Same requested model does not eliminate variance. No probability or frequency claim; no new seeds were run. |

A was allowed to choose helpers/boundaries for present requirements. It was not forced boundary-free. B was also not required to stay flat. The informal “flat plus foresight” interpretation must not replace the delivered instructions after the fact.

## False-negative analysis

A positive claim can mean “a risk-aligned tactic provides a benefit” or the stronger “it repays initial investment on a chosen measure.” The error analysis must distinguish them.

| Candidate false negative | Evidence and limit |
| --- | --- |
| Churn misses an actual benefit | **Supported:** B/D retain Alpha; D offers the injectable workflow seam; E1 B retains its approval body. These are real benefits missed by a cumulative-line-only verdict. Their practical monetary/review value remains unknown. |
| Small scale or short horizon conceals savings | **Plausible:** one provider addition, two operations, no persistence/async semantics; E1's repeated hit is a threshold replacement. More changes might help any arm. No crossover is forecast as fact. |
| Common present requirements already organize A enough | **Enabling facts observed:** named commands, central state and agent-chosen helpers. How much this suppresses the treatment contrast is unknown; removing API guidance changes the question and may add correctness variance. |
| Forecast realization obtains only part of the benefit | **Observed partial fit:** B isolates providers but lacks D's explicit application substitution API. An improved B cannot be assumed to preserve its current costs; no evaluator-improved B is substituted. |
| A's small patch defers an unpriced liability | **Plausible:** provider branches live in both mutating commands. No resulting defect, future bill or comprehension penalty was observed. |

These mechanisms qualify a generalized “no benefit” conclusion. They do not invalidate the narrow absence of line-proxy recovery in the actual sequence.

## False-positive analysis

| Candidate false positive | Check, result and bound |
| --- | --- |
| Forecast secretly dictates implementation | Prompts identify the concern without solution names or future endpoint/schema details. No direct prescription found. Risk salience/information is the intended treatment; its specific effect versus general prompting or variance is not separated. |
| Fixture favors B/D unusually | The evaluator intentionally chose I/O after experiment 1, and both providers fit book/cancel. The new grouped hypothesis is retrospective. Isolation is valid for this selected fit, not general style validation; the same fit also enables A's cheap branching. |
| Initial cost is understated | All initial production files are included. B starts below D but above A. These are source footprints, not time; D demonstrates an additional test capability. Equal full benefit at lower true cost is unproven. |
| Unchanged file is treated as unchanged whole path | Hashes establish adapter stability, while maps/composition/commands change. Region checks also identify stable A functions. Isolation is supported; reduced regression effort or defect probability is not measured. |
| Metric manufactures expected ranking | Removing C's indentation changes its order against B/D. Removing comments reverses E1 A/B marginal order. Raw line ranking is not causal evidence of less work. |
| Diagnostic is tailored to reward D | It was chosen after source inspection, uses an existing seam, includes all public entries as transport-reaching controls and checks C's exported slice. Capability is established, not an unbiased comparative testability score; mocking alternatives remain uncosted. |
| Favorable independent generation | Specific incidental differences are recorded, but no same-code counterfactual isolates the prompt. The observed boundaries are real; why/how often agents select them remains unresolved. |

The same caution applies to A: low churn is a potential false positive for “A has the lowest total maintenance cost.” Only its source-change result is established.

## Answers to the two central questions

**Can a local forecast obtain a risk-suited style's major benefit with less prepayment?** B obtains the same narrowly defined provider-module isolation as D with initial raw lines 69 versus 87 (filtered 65 versus 83). E1 B obtains effective policy isolation without another file. These are concrete partial positive results, not merely UNKNOWN. But B/D's complete benefit sets are not equivalent: D's existing application test seam is an additional demonstrated capability. Their initial differences also include incidental design, so lower total labor and causal equivalence are unproven.

**Is late structure addition expensive without foresight?** Neither experiment demonstrates that premise. A uses existing organization and local branches rather than extracting a new boundary. This contradicts a claim that these specific changes must cause expensive deferred extraction. It does not measure the cost of an extraction that never became necessary, nor estimate a more constrained system. Provider-map generalization also occurs in B/D; deferred design is not exclusive to A.

The expected grouping therefore appears on **provider isolation**, with an additional D capability on **injected policy tests**. It does not appear on **cumulative source-churn recovery**. The mismatch has observable mechanisms and unresolved alternatives; it is neither dismissed as a generic UNKNOWN nor explained away by changing the risk definition.

## H1–H5 after this review

| Hypothesis | Updated interpretation; original results remain unchanged |
| --- | --- |
| H1: no foresight minimizes initial cost | E2 supports lower initial A source footprint; E1 remains metric-sensitive. Total-cost/general tendency unknown. |
| H2: local forecast obtains some matched-architecture benefit with less prepayment | Concrete partial support from B's policy/provider isolation and smaller E2 initial footprint than D. Full benefit parity, causal attribution and lower total cost are unproven. |
| H3: style investment can be recovered | No cumulative source crossover. D's additional test seam demonstrates value the line proxy does not price; absence of recovery is not absence of benefit. |
| H4: wrong foresight leaves unrecovered investment | Still not tested by a permanently wrong forecast; a no-hit prefix is insufficient. |
| H5: no universally best style | No universal ordering established. Matched-risk isolation, substitution capability and source proxies yield distinct observations. |

## Reproduction, execution cost and stopping decision

See the [plan](plan.md), [captured request](../../work/maintenance-risk-review/records/review-request.json), [frozen diagnostic hashes](../../work/maintenance-risk-review/records/diagnostic-freeze.json) and [derived evidence](../../work/maintenance-risk-review/records/evaluation-evidence.json). Evidence includes exact source regions/markers/paths/hashes, complete E2 module hashes/import/export inventory, recomputed original measures and parsed diagnostic traces. Regions are selected manually and retrospectively; the extractor is not a generic semantic parser. Raw attempts retain every executed diagnostic command and output.

From repository root:

~~~sh
python3 work/maintenance-risk-review/tools/run.py
python3 work/maintenance-risk-review/tools/summarize.py run-001.json
~~~

The runner appends a new attempt, verifies frozen diagnostic files and all 445 baseline files, recomputes both original measurements, syntax-checks and runs the six diagnostic cases. The summarizer reproduces the derived evidence from the saved first attempt without a model call or another behavioral execution. Original full Gate replay commands remain available in the unchanged experiment documents; they were not rerun solely to restate previously recorded success.

Actual added behavioral execution: **zero model/agent/seed calls; one evidence extraction, one Node syntax check and one Node test invocation containing six cases; no diagnostic failures or correction rounds.** These are evaluator diagnostics, not six independent architecture samples. Original requested Astra/low metadata remains untouched. Effective evaluator model/effort is not independently attested and is not invented. Hash checks establish artifact integrity, not backend execution identity or absence of all historical context leakage.

The targeted diagnostic resolves the immediate risk of falsely equating B/D's full benefit sets. No additional implementation trial is necessary for this request. More seeds would not repair unmeasured comprehension cost or prove that the current change requires extraction. If a later product decision depends on completion/durability semantics or substitution effort, first specify that decision and its matched acceptance/cost axes. Adding requirements merely to force a preferred rank would change the question. This evaluation stops here, with the PR left for human review.
