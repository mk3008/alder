# Applying Alder to a product

[Back to Alder](../README.md) · [Why this loop](philosophy.md)

For the standard **post-implementation review**, start with [Alder Plugin 0.1.0](plugin-adoption.md), currently pinned for GitHub distribution by tag `plugin-v0.1.0`: install/enable it once, provide a project Business Design path only when the conventional path does not apply, and use a short natural-language request. Plugin version `0.1.0` currently supports the read-only implementation-review workflow; workflows not yet packaged as skills still use this detailed manual/reference route. The prompt below remains available for external clients and reproducibility experiments; ordinary plugin use does not require copying it.

Alder assumes an AI agent performs implementation, followed by a separate agent or fresh context for review. The manual/reference route below requires no Alder installer or runtime dependency; the plugin is a distribution and routing layer for the same review knowledge. In either route, the reviewer needs readable Business Design and the selected Alder review knowledge.

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

The current research recommends **5W1H, with How written as Input → Procedure → Output and an optional Exception section**, to make relationships between activities traceable. This is the current reference format used by the evaluated cases, not a mandatory input specification. Equivalent review behavior has not been established for arbitrary specification formats.

| Field | What to describe |
| --- | --- |
| What | A short business name, represented by the Activity heading; do not repeat it as a separate explanatory field. |
| Why | Its purpose, in a short phrase. |
| When | Only the normal start trigger: a preceding result, external event, or state change. Keep exception/return triggers separate. |
| Who | A short, stable role name for the work; reuse the same name for the same role. |
| Where | The place, usage environment or channel that affects business procedures or resulting system requirements; otherwise “not specified” (規定なし). |
| How | Input: what is received from preceding work, users, or external sources → Procedure: the successful work → optional Exception: what can interrupt that work and where it returns → Output: what is passed to subsequent work as an established fact. |
| Result | The business state established when Procedure finishes normally and the subsequent business it enables. Keep it separate from Output's transferred information and Why's purpose. |

Design these field values for their later use in correlation views and role filters, not as general explanatory paragraphs. Do not require human authors to maintain machine IDs or hidden annotations in Business Design. Put AI/human assignments, assistance, approval responsibility and detailed operating conditions in Procedure or operating rules; shortening fields must not delete these guarantees. The [optional export profile](business-graph.md#opt-in-markdown-profile-v1) derives identity and connections from visible names and projects the Activity heading as the business name. Older research source documents remain frozen as evidence.

Input / Output describe the actual information transfers represented by Object ↔ Business connections in the agreed business correlations, not a general reference-material inventory. Keep business-to-business exception/return flows separate from ordinary I/O.

The point is not to fill every field mechanically. It is to **identify the activity through What and trace relationships between activities through Who / When / Input / Output / Result**. Read each Result alongside the succeeding Activity's normal When: if A's Result enables B, B's trigger should make sense once that state is established. Do not turn a possible handoff into a mandatory sequence, or repeat artifact lists, steps, exceptions, detailed acceptance criteria or the purpose in Result. Record the state in human-readable Business Design even when part of it might be derived from a graph view.

A When such as “whenever the person feels like doing it” makes timing depend on individual initiative. Check the real reason work begins, not merely whether the wording is passive. If human discretion itself is the operational trigger, state the concrete observation prompting that discretion. For example, the optional drift diagnosis starts when a synchronization gap is suspected in Business Design / Check / Test relationships, not on every edit or when an invented requester sends an undefined request. This is a normal start outside the standard flow, not an Exception When caused by another Activity. Use “any time” / 随時 only when no more specific start reason can be stated.

Examples (Japanese): [Facilities maintenance](../business-design/facilities-maintenance/README.md) / [Purchase requests](../business-design/purchase-request/README.md) / [Meeting-room reservation](../business-design/meeting-room/README.md)

### Normal triggers, exceptions and environment

Keep When and Procedure focused on the normal, successful path. Put exceptions discovered during an Activity and their return/transition in its optional **How → Exception** section, not as “if ...” branches in Procedure. Put the corresponding exceptional restart condition in the destination Activity's **Exception When**, naming the originating Activity, trigger and necessary recovery/confirmation condition. These describe the producing and receiving sides of the same event. Do not enumerate speculative exceptions. In a graph, normal When remains an Activity attribute; the destination's Exception When becomes the single explicit Business → Business dashed relation. How → Exception explains the source behavior but creates no second relation. Reconcile the two descriptions by human review; the exporter checks their structure, not their semantic agreement. When a global Graph exception is used instead of Exception When, likewise declare its relation only once. The optional export profile defines the exact notation.

**Where records the business basis for deriving technical requirements, not the selected technical solution.** Include a place, usage environment or channel only when it affects whether the work can happen, its procedures or downstream requirements. “Customer site” may prompt questions about on-site access, mobile use and connectivity; “company intranet” about network/authentication constraints; “store/warehouse” about available equipment or terminals; “Web/phone” about an actual required channel. These are requirement candidates to establish from the work, not automatic mandates for a device or technology. Derive the required capability first, then compare smartphone Web, native apps, tablets or other technical means in system design. Do not infer “native app required” merely from “customer site”. Where the environment imposes no business condition, write “not specified” (規定なし) instead of listing the repository or review discussion used to record the work.

### Authoring and checking business correlations

**Choose Activity boundaries around work that can normally proceed continuously without another actor, decision or wait intervening.** This is a starting point, not a requirement to split every handoff. When finer separation obscures overall correlations, one Activity may include a same-purpose creation, human review and update loop. Preserve the actual exchanges and exceptions within that grouping. In Alder, Check Item design includes generation, human meaning review and updates until agreement. Adjacent implementation creates or updates code and Automated Tests in the same Activity without imposing which comes first. Test execution and Alder's later review happen in the separate post-implementation development loop: the latter checks whether those tests derive from confirmed Check Items and its follow-up maintains Check-to-Test mappings and evidence gaps. They are outside the bounded design-to-handoff Business Design. Split Activities when a meaningful responsibility or operational boundary needs to be understood, not merely to increase detail. When merging Activities, also review their former outputs and Objects for duplication. Consolidate information that belongs to the same maintained artifact, update downstream inputs and Procedure, and retain separate Objects only where distinct artifacts actually exist.

**State each Activity’s and Object’s scope visibly.** An out-of-scope Business may still be needed to explain the overall correlations: identify it as outside the subject’s responsibility and retain enough of its preceding/following Objects, actual I/O and Procedure to show the handoff. Inclusion in the graph does not mean the subject governs that work. Using Alder's Business Design or Check Items does not itself make system design, coding, Test creation or Test execution Alder-owned work; these are adjacent Businesses. Do not assume they use the subject’s guides or prescribe their internal methods merely to connect the flow. Use a required visible `## Scope` section containing only `true` or `false` for each Activity and Object. For an Object, `true` means work within the subject's boundary establishes or maintains it, including knowledge resources the subject supplies; `false` means an external party or out-of-scope work establishes or maintains it. An external requester is outside even when an in-scope Activity sends it an Output. Keep explanations in prose, separate from the boolean value. Do not infer Object scope from relation direction, node presence or presentation color.

Describe Objects independently from Activities. **Who is the role performing the work; an external-human Object is a party that sends or receives information.** The same person may occupy both roles, but one does not imply the other or create a connection automatically. Several Activities may use the same Object and receive different information from it; label each actual transfer instead of duplicating the Object for each Activity.

An Object names a business information group, medium or counterpart. Decide its Scope from who establishes or maintains it within the described work, independently of the connected Activities and relation directions. In its optional **Information** section, list the business information concepts it contains, at a level useful for deriving later Entity candidates. Keep the overview readable: do not require normalization, keys, types, complete cardinality, table mapping, or a permanent mapping of every I/O label to every concept. An I/O label may summarize several concepts (for example, an order document's “order contents”). If an Object carries information needed in later design but has no meaningful concepts listed, add a few; do not turn Business Design into a logical data model.

Set the model boundary by the work being described before assigning Activity scope. A Business Design of using Alder describes the requester-facing design and Check Item handoff; research, maintenance and release of Alder itself belong to a different workflow. Include only out-of-scope Businesses that directly exchange Alder inputs or outputs, unless a concrete additional correlation requires more. For an out-of-scope adjacent Business, describe only the major handoffs needed to understand the flow; omit unrelated internal operations and speculative exceptions. Keep an actual return to Business Design or implementation when it is needed to explain an exceptional correlation. In Alder’s system design, business requirements from 業務設計書 lead to technical requirements in システム要件書, which implementation reads alongside the business requirements. 業務設計書 defines what must hold; システム要件書 collects the current technical conditions; Decision Records explain why choices were made. Implementers should not reconstruct current technical requirements by searching decision history. Infrastructure, languages, architecture and frameworks belong in the technical requirements when selected; examples such as AWS, Lambda, C#, DDD or PostgreSQL are not Alder mandates. Add a separate external-constraint Object only when an actual need has been established.

**Nodes identify who or what is involved; I/O relation labels identify the content transferred between them.** Apply this distinction to documents, forms, databases and external people alike. For example, 業務設計 → 依頼者 carries “業務レビュー依頼 / 仮案説明 / 未決事項相談 / 判断依頼”, while the return carries requirements, feedback or judgment results. Keep 業務設計書 as its own Object; do not use its name as a substitute for the content sent to the requester. Likewise, 業務設計書 → 検査項目の設計 should label the business requirements, expected results or boundaries actually read. Check labels against Procedure; the exporter cannot validate this semantic distinction.

Keep each I/O label to **what information crosses the boundary**. Put when, why and how it is used, what judgment it supports, what Object is updated and review order in Procedure; put exceptional branches in Exception. For a knowledge Object, label the available checking perspectives, not “feedback” produced by applying them. First combine repeated Input or Output entries for the same Object in one Activity when they represent one information contract. If they must stay separate, review whether the work has distinct Activity boundaries. Information concepts on the Object need not be expanded in the label.

Choose information names that can be expressed naturally in Procedure. From every I/O label, trace how the information is used or produced in the successful work; from each transfer in Procedure, trace its source or destination Object back to I/O. If listing several fine-grained names makes the steps awkward, summarize them at the level of the business exchange (requester feedback and decisions can form one review result). If a broad name conceals different exchanges, separate the information names. This is a semantic, two-way reading check, not a requirement to repeat every label verbatim in every step. The [trial quality check](business-design-quality-review.md#ioとprocedureの双方向照合) applies it to all Activities in PR #80.

Ordinary transfers connect Object → Business (Input) or Business → Object (Output). Do not use Business → Business or Object → Object as ordinary data connections. Where a real exception requires one, declare its kind, endpoints and meaning separately. Keep returns for unresolved business requirements distinct from ordinary information transfer. The [export contract](business-graph.md#json-v1-contract) encodes these distinctions when that optional tool is used.

**Procedure is the successful sequence of work that uses the declared Objects.** Make its actor the Who role; name each input Object and what is read or received, the action or judgment performed, and which Object is updated or delivered. If AI assists, keep its drafting or editing role distinct from the responsible Who. An actually autonomous Activity should name its automated actor in Who. Make the result usable by subsequent work. Keep exception conditions and their returns in How → Exception. Do not replace steps with principles such as “review appropriately” or “record decisions”; place general authoring rules in guidance rather than repeating them as the business procedure. Reconcile Procedure and I/O in both directions: a declared transfer must have a concrete use or production step, and an actual transfer in Procedure must appear in I/O. Reconcile Exception with Exception When or an explicit exceptional relation separately.

Preserve actual review exchanges in Business Design and generated JSON even when they make the diagram dense. A Viewer may filter or hide review lines; visual simplicity must not remove business correlations from the SSOT. When Check review reveals a problem with business meaning, conditions, guarantees or unresolved policy, represent the return from Check design to Business Design as a separate business exception, including correction and agreement before downstream updates.

Represent human review as an exchange when the work includes one: deliver the draft and unresolved questions to the requester, receive review results and judgments, update the design and remaining questions, and repeat relevant review until the design and unresolved scope can be agreed. Do not collapse this into one input or assume sending a document means approval. Agreement need not settle every possible future policy; keep confirmed meaning and open questions distinguishable.

When a requester or responsible person resolves a material open issue, record **which question was decided, by whom, the decision and its result at that resolution step** in the Decision Record. Reflect the resulting business meaning in Business Design as well. Records provide decision evidence; they do not replace the SSOT or confer approval themselves. Ordinary reversible technical choices still follow the [delegation guidance](#3-let-the-ai-implement-without-inventing-business-policy), without an added business-approval gate.

Before presenting a draft, walk one representative passage through its named Objects and steps. Check the [requester’s language](#language-for-agreement), [human/AI maintainability](#human-and-ai-co-maintenance), field meanings, normal versus exception triggers, environment-derived requirements, actual transfers and their content labels, review return paths and decision timing. Correct inconsistencies in the draft; ask people only about concrete unresolved business meaning. The [PR #80 writing-quality trial](business-design-quality-review.md) expands this check to every Activity of the design of using Alder; it is not a new mandatory independent-review pipeline or a change to review knowledge v0.3. The existing format recommendation and research limits above still apply.

### Record operational Problems when there is something to improve

Business Design may also record a concrete **Problem** and **Pain level** for an Activity when people actually experience a burden worth reviewing. These are not mandatory fields and should not be invented merely to make every Activity look optimizable.

```markdown
### Problem

Approved purchase requests require the purchasing operator to repeat purchase and result-registration work for each request.

### Pain level

High
```

Use a simple relative Pain level such as **Low / Medium / High**. Pain is a proportionality signal for review, not a numerical score or an automatic decision rule. If frequency, time, error rate, cost or other observed evidence is available, record it; do not fabricate measurements when none exist.

A recorded Problem is the entry point for [Optimization Review](optimization-review.md). The review stays centered on that Problem rather than trying to optimize the whole Business Design.


## 2. Point the agent to the design and review knowledge

Use root AGENTS.md as a router. Adapt the paths to your workspace:

```markdown
## Business Design

- Current business design is under `docs/business-design/`.
- Treat it as the current source of operational intent.
- Before creating or updating Business Design, read section 1 of `docs/adoption.md` from the selected Alder revision (provide its readable path or URL with the task). Apply its authoring principles and correlation check from the first draft.
- Do not invent business policy when the design does not decide it.
- Make material implementation assumptions and choices, including their reasons, available to the Alder review; maintain confirmed Decision Records as part of the Alder review/follow-up under `docs/decisions/`.
- For an Alder review, use `docs/alder/review-knowledge.md` from the selected Alder revision. Read Business Design, then Decision Records, then implementation, DDL, and tests.
```

Record the selected review knowledge source revision in the routing instructions or alongside the copied document. Do not copy the full review knowledge into AGENTS.md or inject Q1–Q3 / P1 / P2 / S into every implementation task. Apply it explicitly during review.

### Versions and access

The current release is **Alder v0.6**, containing **research review knowledge v0.3**. v0.6 adds the adopted Problem-driven Optimization Review workflow; the review knowledge itself remains v0.3. Released v0.6 still keeps Check Item drafting and traceability optional. **This unreleased revision** makes Check Item design and human review required before handoff to implementation without retroactively changing v0.6.

For the recommended local setup, copy [the review knowledge](phase2/review-knowledge-v0.3.md) from the selected revision to `docs/alder/review-knowledge.md`. For a released version, select and record tag `v0.6`. If you intentionally use an unreleased commit, record that exact revision instead. The copied review knowledge remains research version v0.3, regardless of the Alder release tag or local filename.

A local copy is optional. A readable versioned GitHub URL for `docs/phase2/review-knowledge-v0.3.md`, or a checkout of the selected Alder revision in the same workspace, also works. State its path or URL and revision and confirm the reviewer can read it. The current review knowledge is in Japanese.

Alder v0.6 retains the **Check Item** (Atomic Check in v0.3) traceability boundary: Business Design ↔ Check Item ↔ Test, while Check Item drafting and traceability remain optional in that released version. **This unreleased revision** makes Check Item design and human review required before handing the design to implementation. It does not retroactively change v0.6. Tests verify Code by execution; Alder does not maintain Check Item ↔ Code mappings. v0.6 additionally adopts [Optimization Review](optimization-review.md). See the [v0.6 release notes](release-notes-v0.6.md). Existing Check IDs and review states remain valid.

### Run Optimization Review for a recorded Problem

When Business Design contains a concrete Problem and Pain level, use [Optimization Review](optimization-review.md) to explore whether a different business design could reduce that pain. This is an adopted Alder workflow capability, but it is not a requirement to optimize every Activity.

The review:

- starts from the stated Problem instead of searching the entire design for generic improvements
- treats Pain as a proportionality signal for how far investigation and business-change difficulty are worth exploring
- considers relevant directions such as Eliminate, Simplify/Merge, Automate, Delegate and Preserve without forcing one candidate from every category
- classifies Scope as Narrow / Keep / Expand and explains why the Problem requires that boundary
- judges Difficulty from affected roles, authority, Activities, systems, departments, external parties and contracts rather than code size
- preserves existing Business meaning unless people explicitly decide to change it
- allows zero useful candidates and does not count a restatement of the current Business Design as an optimization
- when the Problem warrants it, can return a few explicitly exploratory **Extreme perspectives** separately from candidates, so people can revisit a different business model if missing facts or business decisions become available

Return at most a few useful alternatives; the current guide uses a maximum of three for one Problem. Do not choose a winner. People decide whether a candidate is worth adopting.

If people accept a candidate, **update and confirm Business Design first**, then update downstream Checks, Tests, Decisions and implementation. A candidate is not a requirement merely because the AI proposed it.

Use the copyable prompt and output contract in [Optimization Review](optimization-review.md). The evidence and limits for this adopted workflow are recorded there and in [Validation](validation.md).

<a id="optional-draft-and-review-atomic-checks"></a>

<a id="optional-draft-and-review-check-items"></a>

<a id="draft-and-review-check-items-required"></a>

### Draft and review Check Items (required)

After humans have completed Business Design and its business-correlation review, Alder requires Check Item design and human review before test implementation. An AI uses the [behavior/check draft prompt](behavior-derivation/candidate-c3.md) to prepare Check Items for designers and requesters. Read the **whole Business Design**; organize only the output by Activity or an already-reviewed Functional Interface. Derive concrete checks from activity conditions, preceding outputs and subsequent inputs, Data/Role/Rule constraints, and relevant zero/one/many, missing-target, boundary, failure and continuation cases.

The human-facing view should make **one Check Item represent one independently reviewable observable expectation whenever practical**. People primarily review ID, title, expected result, and review state. Keep exact conditions, evidence, derivation classification/confidence, connections and later Test mappings as supporting detail under the same ID. Do not mechanically split inseparable conditions merely to increase the item count.

Use these review states independently from AI confidence and test evidence: **未レビュー / 要確認 / 確認済み / 要修正**. A high-confidence AI derivation is still unreviewed until a person checks it. A human-confirmed Check may still have missing automated-test evidence.

The AI creates both the initial draft and subsequent updates, preserving IDs and Business Design / existing Check / Test mappings. Humans review expected results and return omissions, errors, correction requests and confirmation; the AI normally applies Check-level feedback while maintaining the mappings. Direct human editing is allowed, with mapping consistency checked afterward. This differs from Business Design, which must remain maintainable by humans alone. Repeat explanation, review and update until agreement before test implementation. If review reveals an unresolved business decision or changes business meaning, return to Business Design; resolve and record the decision there, then update and human-confirm Business Design first. Do not let a Check, Decision Record, test or existing implementation become a hidden replacement for Business Design. Then update affected Interfaces/Checks, Decisions, tests and code from that confirmed revision.

The **standard design business ends** when the requester has agreed to the Business Design and Check Items and both are handed to the adjacent implementation with their revisions and IDs. The Check ↔ Test mapping for newly created Tests cannot be complete at that handoff. Implementation then creates or updates code and representative normal, boundary, failure and continuation tests; Alder does not require a Test-first, Code-first or alternating order. The separate post-implementation Alder review and follow-up, required in the current development loop but outside this bounded Business Design, checks that Test expectations derive from the confirmed Check/Business Design rather than merely codifying current behavior. After the independent read-only review, the Alder follow-up adds or updates representative Check-to-Test/assertion mappings and evidence gaps in the Check Item details before accepting the implementation change. Keep expected results, review states and Business Design links under the same ID. Do not introduce a separate permanent test-plan Object for the same information.

An agreed Check expectation and evidence that a Test verifies it are different things. The Check review state records human confirmation of business meaning; a missing Test assertion or execution result is a separate evidence gap maintained after implementation. Do not read a design-time evidence gap as an unresolved business decision or make complete Test evidence a new pre-handoff gate. If an actual case raises a consequential question about handoff with a known gap, return that concrete question to the responsible people rather than imposing a universal policy.

When external visualization, analysis or processing would help the designer's own review, the requester's review or correlation checking, an author may optionally [export Business Graph JSON](business-graph.md). The JSON is an intermediate projection for external tools, not a standard Business Activity or a requester deliverable. It need not be generated or committed to complete the standard design business. Record any correction discovered through an external tool in the Business Design SSOT. A committed projection, such as Alder's regression fixture, is checked by deterministic regeneration; stale generated JSON is distinct from semantic Business Design ↔ Check ↔ Test drift.

Pass the human-reviewed, AI-maintained list and the same Business Design revision to the implementation agent. During Alder review/follow-up, map design revision + list revision + item ID to representative test assertions after checking their meaning. Do not maintain Code, file, symbol, SQL-entry-point, or line mappings as permanent Alder artifacts; tests verify the current implementation by execution. Do not turn unapproved candidates into pass/fail expectations. The [Check Item traceability guide](check-item-traceability.md) defines the two-layer view, review states, authority boundary, and meaning-preservation audit. The [research conclusion](behavior-derivation/conclusion.md) records evidence and limits. Review knowledge v0.3 is unchanged.

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

When implementation makes a material assumption or choice that is not obvious from the Business Design, report what was chosen, why, and which evidence or constraint led to it, so the separate Alder review can verify and record it. Do not treat a rationale as approved business meaning or create a Decision Record for every routine, reversible technical choice.

If the choice would change the business outcome, authority, allowed state, data meaning or cardinality, unit of work, or a guarantee relied on by another activity, and the Business Design does not decide it, do not record it as an approved business decision. Report it as a focused Human Decision instead and keep it unresolved. Explain why the existing Business Design does not decide it, give the smallest useful alternatives, and continue independent work where possible.

Routine, reversible technical choices do not require Human Decision. Perform the relevant non-destructive verification for the requested work. For relevant operational choices, apply Alder adoption guidance “Prefer error-resistant operation” from <readable path or URL and revision>. When comparing technical candidates, apply Alder adoption guidance “Prioritize and bound technical evaluation” from <readable path or URL and revision>: use inference to select consequential uncertainties, set a proportionate evaluation budget and stopping condition, and preserve required verification gates.
```

A Decision Record is Alder's evidence of material assumptions and choices actually made during implementation, together with their reasons. The implementer supplies the rationale; the Alder review/follow-up checks its source and records confirmed material choices, marking missing reasons as questions rather than inventing them. A Human Decision is needed when Business Design leaves unresolved a choice that changes business meaning. A Decision Record does not replace that human decision; neither passing tests nor completed implementation constitute business approval.

Use the repository’s existing location and format for Decision Records, or a suitable location such as `docs/decisions/` if none exists. Alder requires the record, not a particular directory or template. These are Decision Records, not only architecture decisions. The independent Fresh review prompt below is deliberately read-only; update Check mappings and Decision Records in a subsequent Alder follow-up after that review, without asking the read-only reviewer to edit files.

## 4. Run a separate Alder review after implementation (outside the standard design business)

This is the **required post-implementation review in the current Alder development loop**, separate from the standard design business that ends at handoff. Use a separate agent or fresh context so that implementation assumptions are not simply carried forward as justification. Provide the design and implementation revisions, documented decisions, and readable review knowledge. After its read-only findings, the Alder follow-up maintains the Check ↔ Test/assertion mappings and evidence gaps; implementation authors and this read-only reviewer do not silently change Alder's Check records. This separation is not an additional rule in review knowledge v0.3.

```text
Review the current implementation against the relevant Business Design using Alder review knowledge v0.3 from the selected Alder revision. Review only; do not modify files.

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

Name the selected release tag or unreleased commit and its readable review-knowledge source when giving the prompt. The prompt routes to the full knowledge; its summary does not replace that document.

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
