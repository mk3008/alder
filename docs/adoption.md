# Applying Alder to a product

[Back to Alder](../README.md) · [Why this loop](philosophy.md)

Alder assumes an AI agent performs implementation, followed by a separate agent or fresh context for review. No installer, runtime dependency, proprietary DSL, submodule, or dedicated configuration is required. The reviewer needs readable Business Design and the selected Alder review knowledge.

## 1. Place Business Design where the agent can read it

When asked to create or revise Business Design, apply the authoring guidance in this section from the first draft, then check the resulting work and correlations before requesting agreement. These are reusable authoring principles, not notes limited to Alder’s self-design.

For a new product, prefer this local arrangement in the product repository:

```text
product/
  AGENTS.md
  docs/
    business-design/
      ...
    decisions/
      ...
    alder/
      review-knowledge.md
  src/
  tests/
```

| Example path | Content |
| --- | --- |
| `docs/business-design/` | Current Business Design. |
| `docs/decisions/` | Decision Records for material implementation assumptions and choices. |
| `docs/alder/review-knowledge.md` | A copy of the selected Alder version's review knowledge / review definition. |

This is a recommended example, not a required layout. Keep existing equivalent locations when they are already established. Copy the selected review knowledge without changing its rules and record its source revision, so the local filename does not obscure which version is used.

This keeps design and implementation comparable in the same commit and PR, aligned on each branch, and available without additional repository discovery. The review can identify exactly which versions it compares.

A separate repository is also possible when both are readable at stable paths in the same workspace:

```text
workspace/
  product/
  business-design/
```

State the design path and target revision in the task prompt or AGENTS.md. Pin a commit or tag where possible; if using a branch, record its resolved commit alongside the product revision at review time. A GitHub URL alone, or an expectation that the agent will discover the design, is not the standard arrangement. Make the access path known before reviewing.

### Language for agreement

**Write Business Design prose in the language the requester actually uses.** Business Design is a document for agreement with users/requesters: they must be able to read it, understand it, point out errors, and agree to its meaning themselves. Readability for implementers alone is insufficient; this is a prerequisite for meaningful human review, not a cosmetic preference.

Apply this to explanations, business descriptions, and Input / Procedure / Output text when creating or updating the design. Headers and section names such as What / Why / When / Who / Where / How may remain English. For Alder's own design, the requester uses Japanese, so its prose is Japanese. The format recommendation below does not override this principle.

### Human and AI co-maintenance

Business Design must be writable, readable and maintainable by a person alone, starting from interview findings. AI may draft and edit the same visible information alongside people; it is not an AI-only source format. For example, either a person or AI may choose and later revise an Object's visible Icon field. Keep information in understandable headings, sections and ordinary text. Do not require authors to maintain hidden HTML-comment IDs, annotations or machine-only fingerprints. Derive export data from the human-readable structure; tooling must fit the document. Business Design remains the SSOT and human business agreement is still required.

### Recommended Business Design format

The current research recommends **5W1H, with How written as Input → Procedure → Output**, to make relationships between activities traceable. This is the current reference format used by the evaluated cases, not a mandatory input specification. Equivalent review behavior has not been established for arbitrary specification formats.

| Field | What to describe |
| --- | --- |
| What | A short business name, represented by the Activity heading; do not repeat it as a separate explanatory field. |
| Why | Its purpose, in a short phrase. |
| When | Only the normal start trigger: a preceding result, external event, or state change. Keep exception/return triggers separate. |
| Who | A short, stable role name for the work; reuse the same name for the same role. |
| Where | The place, usage environment or channel that affects business procedures or resulting system requirements; otherwise “not specified” (規定なし). |
| How | Input: what is received from preceding work, users, or external sources → Procedure: what is decided or processed → Output: what is passed to subsequent work as an established fact. |

Design these field values for their later use in correlation views and role filters, not as general explanatory paragraphs. Do not require human authors to maintain machine IDs or hidden annotations in Business Design. Put AI/human assignments, assistance, approval responsibility and detailed operating conditions in Procedure or operating rules; shortening fields must not delete these guarantees. The [optional export profile](business-graph.md#opt-in-markdown-profile-v1) derives identity and connections from visible names and projects the Activity heading as the business name. Older research source documents remain frozen as evidence.

Input / Output describe the actual information transfers represented by Object ↔ Business connections in the agreed business correlations, not a general reference-material inventory. Keep business-to-business exception/return flows separate from ordinary I/O.

The point is not to fill every field mechanically. It is to **identify the activity through What and trace relationships between activities through Who / When / Input / Output**.

A When such as “whenever the person feels like doing it” makes timing depend on individual initiative. If human discretion itself is the operational trigger, state that discretion explicitly. This recommendation helps describe work consistently; it is not an additional rule in the review knowledge.

Examples (Japanese): [Facilities maintenance](../business-design/facilities-maintenance/README.md) / [Purchase requests](../business-design/purchase-request/README.md) / [Meeting-room reservation](../business-design/meeting-room/README.md)

### Normal triggers, exceptions and environment

Keep When and the normal Procedure focused on normal work. If an exception or return requires restarting an Activity, record it separately in a visible **Exception When** section: identify the originating Activity, the trigger and any necessary recovery/confirmation condition. Do not enumerate speculative exceptions. In a graph, normal When remains an Activity attribute; these exception triggers become explicit Business → Business dashed flows. Describe each exception once rather than maintaining a second copy in a global relation list. The optional export profile defines the exact notation.

**Where records the business basis for deriving technical requirements, not the selected technical solution.** Include a place, usage environment or channel only when it affects whether the work can happen, its procedures or downstream requirements. “Customer site” may prompt questions about on-site access, mobile use and connectivity; “company intranet” about network/authentication constraints; “store/warehouse” about available equipment or terminals; “Web/phone” about an actual required channel. These are requirement candidates to establish from the work, not automatic mandates for a device or technology. Derive the required capability first, then compare smartphone Web, native apps, tablets or other technical means in system design. Do not infer “native app required” merely from “customer site”. Where the environment imposes no business condition, write “not specified” (規定なし) instead of listing the repository or review discussion used to record the work.

### Authoring and checking business correlations

Describe Objects independently from Activities. **Who is the role performing the work; an external-human Object is a party that sends or receives information.** The same person may occupy both roles, but one does not imply the other or create a connection automatically. Several Activities may use the same Object and receive different information from it; label each actual transfer instead of duplicating the Object for each Activity.

**Nodes identify who or what is involved; I/O relation labels identify the content transferred between them.** Apply this distinction to documents, forms, databases and external people alike. For example, 業務設計 → 依頼者 carries “業務レビュー依頼 / 仮案説明 / 未決事項相談 / 判断依頼”, while the return carries requirements, feedback or judgment results. Keep 業務設計書 as its own Object; do not use its name as a substitute for the content sent to the requester. Likewise, 業務設計書 → テスト設計 should label the business requirements, expected results or boundaries actually read. Check labels against Procedure; the exporter cannot validate this semantic distinction.

Ordinary transfers connect Object → Business (Input) or Business → Object (Output). Do not use Business → Business or Object → Object as ordinary data connections. Where a real exception requires one, declare its kind, endpoints and meaning separately. Keep returns for unresolved business requirements distinct from ordinary information transfer. The [export contract](business-graph.md#json-v1-contract) encodes these distinctions when that optional tool is used.

**Procedure is the sequence of work that uses the declared Objects.** Name the input Object and what is read or received, the action or judgment performed, and which Object is updated or delivered. Make the result usable by subsequent work. Do not replace these steps with principles such as “review appropriately” or “record decisions”; place general authoring rules in guidance rather than repeating them as the business procedure. Reconcile Procedure and I/O in both directions: a declared transfer must have a concrete use or production step, and an actual transfer in Procedure must appear in I/O (or the explicitly separate exception relations).

Represent human review as an exchange when the work includes one: deliver the draft and unresolved questions to the requester, receive review results and judgments, update the design and remaining questions, and repeat relevant review until the design and unresolved scope can be agreed. Do not collapse this into one input or assume sending a document means approval. Agreement need not settle every possible future policy; keep confirmed meaning and open questions distinguishable.

When a requester or responsible person resolves a material open issue, record **which question was decided, by whom, the decision and its result at that resolution step** in the Decision Record. Reflect the resulting business meaning in Business Design as well. Records provide decision evidence; they do not replace the SSOT or confer approval themselves. Ordinary reversible technical choices still follow the [delegation guidance](#3-let-the-ai-implement-without-inventing-business-policy), without an added business-approval gate.

Before presenting a draft, walk one representative passage through its named Objects and steps. Check the [requester’s language](#language-for-agreement), [human/AI maintainability](#human-and-ai-co-maintenance), field meanings, normal versus exception triggers, environment-derived requirements, actual transfers and their content labels, review return paths and decision timing. Correct inconsistencies in the draft; ask people only about concrete unresolved business meaning. This is an authoring check for new and revised designs, not a new mandatory independent-review pipeline or a change to review knowledge v0.3. The existing format recommendation and research limits above still apply.

## 2. Point the agent to the design and review knowledge

Use root AGENTS.md as a router. Adapt the paths to your workspace:

```markdown
## Business Design

- Current business design is under `docs/business-design/`.
- Treat it as the current source of operational intent.
- Before creating or updating Business Design, read section 1 of `docs/adoption.md` from the selected Alder revision (provide its readable path or URL with the task). Apply its authoring principles and correlation check from the first draft.
- Do not invent business policy when the design does not decide it.
- Record material implementation assumptions and choices in Decision Records under `docs/decisions/`.
- For an Alder review, use `docs/alder/review-knowledge.md` from the selected Alder revision. Read Business Design, then Decision Records, then implementation, DDL, and tests.
```

Record the selected review knowledge source revision in the routing instructions or alongside the copied document. Do not copy the full review knowledge into AGENTS.md or inject Q1–Q3 / P1 / P2 / S into every implementation task. Apply it explicitly during review.

### Versions and access

The current release is **Alder v0.5**, containing **research review knowledge v0.3**. These versions describe different things and are not renamed to match. v0.4 adds optional functional consideration discovery and uses Check Item (introduced as Atomic Check in v0.3); the review knowledge itself remains v0.3.

For the recommended local setup, copy [the review knowledge](phase2/review-knowledge-v0.3.md) from the selected revision to `docs/alder/review-knowledge.md`. For a released version, select and record tag `v0.5`. If you intentionally use an unreleased commit, record that exact revision instead. The Alder release is v0.5 and the copied knowledge remains research version v0.3, regardless of the local filename.

A local copy is optional. A readable versioned GitHub URL for `docs/phase2/review-knowledge-v0.3.md`, or a checkout of the selected Alder revision in the same workspace, also works. State its path or URL and revision and confirm the reviewer can read it. The current review knowledge is in Japanese.

Alder v0.5 keeps **Check Item** (Atomic Check in v0.3) and narrows permanent traceability to Business Design ↔ Check Item ↔ Test. Tests verify Code by execution; Alder does not maintain Check Item ↔ Code mappings. See the [v0.5 release notes](release-notes-v0.5.md). Existing Check IDs and review states remain valid.

<a id="optional-draft-and-review-atomic-checks"></a>

### Optional: draft and review Check Items

After humans have completed Business Design and its business-correlation review, an AI can use the [behavior/check draft prompt](behavior-derivation/candidate-c3.md) to prepare Check Items for designers and requesters. Read the **whole Business Design**; organize only the output by Activity or an already-reviewed Functional Interface. Derive concrete checks from activity conditions, preceding outputs and subsequent inputs, Data/Role/Rule constraints, and relevant zero/one/many, missing-target, boundary, failure and continuation cases.

The human-facing view should make **one Check Item represent one independently reviewable observable expectation whenever practical**. People primarily review ID, title, expected result, and review state. Keep exact conditions, evidence, derivation classification/confidence, connections and later Test mappings as supporting detail under the same ID. Do not mechanically split inseparable conditions merely to increase the item count.

Use these review states independently from AI confidence and test evidence: **未レビュー / 要確認 / 確認済み / 要修正**. A high-confidence AI derivation is still unreviewed until a person checks it. A human-confirmed Check may still have missing automated-test evidence.

The AI writes the first draft. Humans review, correct and add items to complete the Check list before handing it to the AI for test implementation. If review changes business meaning, **Business Design must be updated and human-confirmed first**; do not let a Check, Decision Record, test or existing implementation become a hidden replacement for Business Design. Then update affected Interfaces/Checks, Decisions, tests and code from that confirmed revision.

Pass the human-completed list and the same Business Design revision to the implementation agent. Map design revision + list revision + item ID to representative test assertions. Do not maintain Code, file, symbol, SQL-entry-point, or line mappings as permanent Alder artifacts; tests verify the current implementation by execution. Do not turn unapproved candidates into pass/fail expectations. The [Check Item traceability guide](check-item-traceability.md) defines the two-layer view, review states, authority boundary, and meaning-preservation audit. The [research conclusion](behavior-derivation/conclusion.md) records evidence and limits. Review knowledge v0.3 is unchanged.

### Optional: explore undocumented functional conditions

After Business Design and its business-correlation review are complete, use [functional consideration discovery](behavior-derivation/functional-considerations.md) before or alongside Check Item drafting when the feature warrants it. This adopted optional step asks which real-system conditions still need a decision. Read the whole applicable Business Design, Scope, existing Decisions and shared contracts. Use relevant general knowledge to describe concrete situations with different observable outcomes, then close already settled questions before asking a person. It is not a mandatory gate, an exhaustive checklist, or a repeat of PoC/business-correlation review.

Keep document-derived Checks separate from externally prompted questions. External knowledge establishes possible relevance, not authority for an answer. Present genuinely unresolved choices as **unapproved candidates**, with their assumptions, alternatives and implications. Humans decide the meaning; update and confirm Business Design first when a meaning or guarantee changes, then derive c3 / Check Items and map them to Tests. Do not turn a candidate directly into an assertion or send routine reversible implementation choices back as business questions. Stop after a small set of concrete useful questions; no minimum finding count is required.

The [historical backtest](behavior-derivation/issue-71-historical.md) found one concrete failure-boundary question at an earlier Velvet revision that later received an explicit human decision and Decision record. Across two historical snapshots, four candidates comprised one such match, one conditional unresolved question and two already settled questions. This is bounded evidence for adopting the practice, not a controlled estimate of prompt effect or a completeness claim. Earlier [known-context](behavior-derivation/issue-71-discovery.md) and [current-version Fresh](behavior-derivation/issue-71-fresh-velvet.md) trials retain their original experimental dispositions; the latter found no qualifying unresolved issue. All raw outputs and the exact trial prompt remain frozen.

### Optional: use Functional Interfaces as a responsibility index

Where one Activity contains independently observable capabilities, or responsibility spans several Check Items and implementation locations, the [Functional Interface prompt](functional-interface/prompt.md) can draft a small intermediate index. Derive contracts from the whole completed Business Design, then relate them to Check Items and test assertions. Humans review and complete both drafts. An Interface is an observable operation contract, not a required function, API, class or file; several contracts may share code and one contract may span Python, SQL and tests.

Use the combined trace only where it improves navigation:

```text
Business Design
  ↓
Functional Interface
  ↓
Check Item
  ↓
Automated Test
  │
  └─ verifies → Code
```

The downward direction is **meaning authority**: Business Design is the SSOT. For review and maintenance, trace Business Design / Interface / Check / Test in both directions so an AI can answer “which approved business expectation justifies this test?” Tests verify Code by execution; do not keep a permanent Check-to-Code location map. Reverse tracing is diagnostic; it never promotes current code or tests into Business Design without human approval.

Keep source revisions and distinguish missing implementation, conflicting behavior, partial/missing test evidence, unapproved candidates and technical support. A passing test or a matching name does not establish a semantic mapping. If a human review exposes a meaning conflict or missing policy, return to Business Design first, then update downstream artifacts.

When Checks are split, renamed, regrouped or regenerated, perform a **meaning-preservation audit**: account for each independent guarantee in the old representation, record intentional removals, and re-check against Business Design. The previous Check set can be a transformation regression oracle, but it is not the SSOT.

Use this index only when it clarifies responsibility or change navigation; it may live in the existing Check list or mapping table instead of a separate specification. Direct Business Design → Check → Test traceability remains sufficient where clear. Do not maintain a complete code-line matrix. The [Check Item traceability guide](check-item-traceability.md) records the current operating form, while the [Functional Interface study](functional-interface/study.md) records the earlier bounded evaluation and duplicate-maintenance cost.

## 3. Let the AI implement without inventing business policy

Alder does not prescribe an architecture style or when to introduce structure. Give the implementation agent the Business Design, current requirements, project constraints, and the information below; let it choose how to realize them. See [the architecture position](philosophy.md#ai-coding-and-architecture).

Describe futures you actually foresee in concrete terms, separately from current requirements. For example: “additional delivery or payment providers are likely,” “there is a concrete prospect of changing the database,” or “business logic must be testable without external I/O.” The last example is a desired property, not a prediction. State the risk or property itself rather than translating it into “create a Port,” “add a Repository,” or “use Clean Architecture.”

Pass on what people actually know about likely changes; do not add hypothetical requirements merely because something might change someday. If no such future is foreseen, say so or omit it. Foresight informs design decisions; it does not authorize the agent to invent undecided future business rules or implement them as current requirements.

### Prefer error-resistant operation

Predictable operator mistakes are real implementation risks. When a plausible mistake can be removed by a cheap, clear structural choice without changing business meaning or adding disproportionate complexity, prefer that structure over relying on memory, documentation, or a non-obvious exception. Make the ordinary/default action the correct action where practical; first remove an avoidable trap before adding warnings, checks or special procedures around it. For example, where migration identities are not already fixed by deployment history, align natural file order with required execution order instead of documenting a reversed exception.

Apply this to concrete current operation, including relevant ordering, interruption or ambiguous-state risks; it is not a mandatory checklist for every task. Preserve legitimate manual judgment and useful runbooks. Do not require full automation, elimination of every invalid state, or UI redesign. Stop when the operating condition is sufficiently clear and robust and further safeguards would be disproportionate. Consider availability and continuity: stopping can be appropriate when incorrect execution has serious consequences and an ambiguous state cannot support safe continuation, but first look for a simple way to remove the ambiguity itself. Do not turn this into a blanket fail-closed rule.

This guides implementation choices, not a new Alder review rule. Keep established external responsibilities and the existing distinction between technical improvements, concrete requirement/guarantee violations and unresolved business meaning. The [Issue #54 case analysis](operational-error-resistance.md) records existing coverage, six authored thought cases and the limits of this clarification; behavioral improvement has not been measured.

### Prioritize and bound technical evaluation

When a task requires comparing technical candidates, reason from its acceptance conditions, risks, data and call cardinality, complexity, execution environment and resource ownership before choosing what to test. Separate established facts, conditional estimates and remaining unknowns. Prioritize uncertainties whose answers could change feasibility or candidate selection, weighing expected effect, information value, evaluation cost, change risk and reversibility. A small change is not sufficient reason to investigate a candidate deeply when its residual cost is already unlikely to meet the target; an order-of-growth advantage is not sufficient reason to choose a larger change either.

Use existing evidence to narrow the search. Test consequential unknowns such as semantic equivalence, environment-specific costs and shared-resource impact. Where work accumulates over time, reason about timeout, continuing arrivals, backlog, retries and durable catch-up rather than only one successful operation. Do not turn these examples into a checklist for unrelated tasks or require exhaustive design review before implementation.

Set a task-proportionate evaluation time budget and stopping condition before substantial experiments; a bounded scope or experiment count can serve as the budget when no elapsed-time limit is supplied. Stop optional evaluation when acceptance conditions have sufficient support and another experiment is unlikely to change the decision. Stop investigating a rejected candidate once decisive evidence rules it out, and redirect remaining effort to the consequential uncertainty. Preserve required correctness and regression gates. If the budget ends with a material unknown, report the limit and unresolved decision rather than claiming fitness or silently expanding the study.

Use the product concept, Business Design, requirements and user intent to identify where effort matters and which properties must not be compromised. If speed, low memory use or another property is an explicit differentiator, focus evaluation on that property; honor numeric targets when supplied. A qualitative priority also warrants focused effort, without requiring unlimited optimization.

Otherwise, default to a sufficiently good solution: try candidates with the strongest reasoned prospect of meeting the task's needs, and stop searching once relevant verification supports a reasonable result. Numeric targets are not a prerequisite. Relative comparisons, expected workload, resource costs and material risks can support a technical judgment of adequacy; being better than another candidate alone does not establish suitability. The possibility of a still-better candidate is not itself a reason to continue.

Record material adequacy judgments in the relevant Decision Record, including the supporting evidence, assumptions, tradeoffs, remaining limitations and reason for stopping, so they can be reviewed. Distinguish an agent's technical judgment from an agreed requirement or production guarantee. Do not turn every routine choice into a separate record or approval gate.

Ask only when unresolved priorities, unacceptable tradeoffs or consequential unknowns prevent a defensible decision within delegated authority. Missing numeric targets or an unspecified desire for further optimization alone do not require clarification. Make the decision concrete with available evidence and continue independent authorized work. Respect already accepted tradeoffs; do not invent agreed production thresholds, demand a global optimum, or default to smallest change regardless of fitness.

These are implementation and technical-evaluation instructions. Ordinary post-implementation Alder review keeps its Q1–Q3 / P2 / S scope: report concrete requirement or guarantee violations and unresolved business meaning, classify technical improvements separately, and close established sufficiency. A faster alternative alone does not reopen an accepted business decision. A separately requested performance audit uses its own acceptance conditions and evaluation budget.

The [Issue #51 case analysis](inference-validation.md) documents the rationale and limits. This clarification has not been shown to improve agent behavior in a controlled comparison.

Replace the placeholders with the requested task and actual design path:

```text
Task: <requested work and acceptance conditions>
Business Design: <path and revision>
Current requirements / constraints / review concerns: <concrete requirements and desired properties>
Known risks / likely future changes: <concrete foresight, separate from current requirements; omit if none>

Read the relevant Business Design before implementing this task.
Implement the requested work using the existing project conventions. Use the stated risks and desired properties to choose the implementation; do not treat architecture names as substitutes for requirements. Treat future foresight as design context, not authorization to implement undecided future behavior. Do not invent unforeseen future requirements or business policy that the Business Design does not decide.

When implementation makes a material assumption or choice that is not obvious from the Business Design, record it in a Decision Record. Record what was chosen, why it was needed, and the evidence or constraint that led to it. Do not create Decision Records for every routine, reversible technical choice.

If the choice would change the business outcome, authority, allowed state, data meaning or cardinality, unit of work, or a guarantee relied on by another activity, and the Business Design does not decide it, do not record it as an approved business decision. Report it as a focused Human Decision instead and keep it unresolved. Explain why the existing Business Design does not decide it, give the smallest useful alternatives, and continue independent work where possible.

Routine, reversible technical choices do not require Human Decision. Perform the relevant non-destructive verification for the requested work. For relevant operational choices, apply Alder adoption guidance “Prefer error-resistant operation” from <readable path or URL and revision>. When comparing technical candidates, apply Alder adoption guidance “Prioritize and bound technical evaluation” from <readable path or URL and revision>: use inference to select consequential uncertainties, set a proportionate evaluation budget and stopping condition, and preserve required verification gates.
```

A Decision Record is evidence of material assumptions and choices actually made during implementation, together with their reasons. A Human Decision is needed when Business Design leaves unresolved a choice that changes business meaning. A Decision Record does not replace that human decision; neither passing tests nor completed implementation constitute business approval.

Use the repository’s existing location and format for Decision Records, or a suitable location such as `docs/decisions/` if none exists. Alder requires the record, not a particular directory or template. These are Decision Records, not only architecture decisions.

## 4. Run a separate Alder review after implementation

Use a separate agent or fresh context so that implementation assumptions are not simply carried forward as justification. Provide the design and implementation revisions, documented decisions, and readable review knowledge. This is a workflow recommendation, not an additional rule in review knowledge v0.3.

```text
Review the current implementation against the relevant Business Design using Alder review knowledge v0.3 from Alder v0.5. Review only; do not modify files.

Business Design: <path and revision>
Implementation: <path and revision or precise working-tree scope>
Review knowledge: <readable path or versioned URL and revision>

Read in this order:
1. Business Design
2. Decision Records / documented assumptions
3. implementation, DDL, and tests

Apply the referenced review knowledge, including its boundaries and stopping conditions. Check whether the implemented work can continue truthfully, whether constraints have explainable causes and remaining effects, and whether meaning, conditions, units of work, authority, and guarantees connect across preceding and subsequent activities.

Walk through representative work from each participant's perspective, then trace business-significant choices in the implementation back to the Business Design.

For each important finding, report:
- evidence
- concrete effect on current or downstream work
- classification: definite mismatch / Business confirmation / technical improvement / sufficient
- the minimal decision or confirmation needed, including who is responsible for deciding; state when none is needed

Do not turn every undocumented detail into a requirement. Do not prescribe a particular architecture, UI, data model, or implementation solution when multiple implementations could satisfy the business meaning. A technical fix is not a substitute for confirming unresolved business meaning.
```

If you use an unreleased Alder commit rather than v0.5, replace the release name with that selected revision. The prompt routes to the full knowledge; its summary does not replace that document.

A Business confirmation is not automatically a request to change implementation. An existing contract or external procedure may supply the required meaning. Confirm that basis and stop when sufficient.

### Follow up on human decisions

Give the agent the actual decisions from the responsible people; this prompt does not authorize it to decide unresolved business policy:

```text
Apply these human decisions to the Business confirmation items from the review: <decisions and responsible people>.
Update Business Design first for decisions that change business meaning, then update implementation and tests to match. Do not turn technical improvement suggestions into business policy. Keep still-unresolved items open and continue independent work where possible.
```

### Before or after implementation?

A light check for obvious contradictions or Human Blockers before implementation is useful. The main use shown here is post-implementation review: ambiguity has become a concrete choice that can be traced back to Business Design. The optimal division between pre- and post-implementation review is still a research question, not a validated conclusion. See [validation and limits](validation.md).

## Optional companion tools

For a product that chooses Raw SQL, these projects have independent responsibilities:

| Project | Responsibility |
| --- | --- |
| Alder | Review business meaning, continuity, and guarantees against Business Design. |
| [Raw SQL Rules](https://github.com/mk3008/raw-sql-rules) | A repository contract for reviewable Raw SQL construction: application-owned structure, with no arbitrary SQL syntax supplied by runtime input. |
| [Serene](https://github.com/mk3008/serene) | Make TypeScript Raw SQL construction easier to classify and triage while retaining native drivers and application-owned execution. |

Raw SQL Rules does not prescribe architecture or a framework. Serene is not an ORM, query builder, or mapper, and does not prove SQL meaning, authorization, or business behavior. Construction triage does not replace Alder review. They are optional companions, not a combined framework or Alder dependencies.

After adopting your selected Raw SQL Rules version, a product can route both concerns from AGENTS.md:

```text
For business implementation and Alder review, use the Business Design under `docs/business-design/` and the selected Alder review knowledge referenced above.
For Raw SQL data-access work, read `rules/raw-sql-rules.md` and follow it as the repository contract.
```

For a TypeScript product also using Serene, follow its [AI adoption guide](https://github.com/mk3008/serene/blob/main/docs/ai-adoption.md) separately. Keep SQL meaning, binding, authorization, and business-behavior review even when construction is recognized as ordinary.
