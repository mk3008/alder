# Applying Alder to a product

[Back to Alder](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/README.md) · [Why this loop](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/philosophy.md)

The [Alder Plugin](https://github.com/mk3008/alder/blob/e4c47ed227d055fb94cbfdc851573feb555f4406/docs/plugin-adoption.md) bundles the guidance for Business Design drafting/revision and review, Check Item drafting/maintenance, optional structural and functional questions, Optimization Review, implementation review and its separate follow-up. The plugin includes the deterministic graph exporter and the explicitly opt-in, restricted drift pilot. Its expanded ten-skill routing, combined implementation-review/follow-up route and agent-driven script execution in a real client remain unverified; the earlier 0.2.8 package retains its three workflows with bounded client-validation evidence. Supply your readable product inputs; no manual selection or copying of Alder's internal guidance is needed for the plugin route.

Alder assumes an AI agent performs implementation, followed by a separate agent or fresh context for review. The manual workflow requires no installer, runtime dependency, proprietary DSL, submodule, or dedicated configuration. In either route, the reviewer needs readable Business Design; the plugin bundles its review knowledge, while the manual route needs access to the selected Alder review knowledge.

## One Business Design across three loops

Alder has a **design loop** to describe, review and agree on current work; an **optional improvement loop** that first records and confirms a concrete Problem / Pain in Business Design for already viable work, reviews alternatives and returns an adopted change to Business Design; and a **realization and verification loop** that hands the agreed design and human-reviewed Check Items to implementation and checks the result in a separate Alder review/follow-up. Business Design is the one SSOT throughout. An incomplete or undecided business rule belongs in design; dissatisfaction with otherwise functioning work can start Optimization Review. Neither an unapproved candidate nor a passing Test approves business meaning.

The [Business Design for using Alder](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/business-design/alder/README.md) includes the optional improvement review as an in-scope Activity. It exchanges current design information and proposals with the requester through ordinary Input/Output, then returns an accepted decision to business design for revision and agreement. It is not an exception transition, nor a required step before every implementation. The standard design business still ends when the agreed Business Design and Check Items are handed to implementation; post-implementation review/follow-up is separate.

## 1. Place Business Design where the agent can read it

When asked to create or revise Business Design, apply the authoring guidance in this section from the first draft, then check the resulting work and correlations before requesting agreement. These are reusable authoring principles, not notes limited to Alder’s self-design.

For a new product, keep Business Design and material Decision Records alongside the implementation. Existing equivalent locations are fine:

```text
product/
  docs/
    business-design/
      ...
    decisions/
      ...
  src/
  tests/
```

| Example path | Content |
| --- | --- |
| `docs/business-design/` | Current Business Design. |
| `docs/decisions/` | Decision Records for material implementation assumptions and choices. |

This is a recommended example, not a required layout. With the plugin and the conventional `docs/business-design/` path, no Alder-specific AGENTS.md entry or local review-knowledge copy is needed. For manual review, provide a readable, revision-pinned knowledge source as described under [Versions and access](#versions-and-access).

This keeps design and implementation comparable in the same commit and PR, aligned on each branch, and available without additional repository discovery. The review can identify exactly which versions it compares.

A separate repository is also possible when both are readable at stable paths in the same workspace:

```text
workspace/
  product/
  business-design/
```

For nonconventional or cross-repository locations, state the design path in the task prompt or AGENTS.md and ensure the reviewer can read it. Pin a commit or tag where possible; if using a branch, record its resolved commit alongside the product revision at review time. The plugin discovers Business Design at the conventional product path. For manual review, provide a known readable path or versioned URL instead of relying on discovery.

### Before drafting a proposed business change

**Check missing background before drafting a change when learning it could change whether the proposed means should be adopted.** Use the conversation, current Business Design and stated constraints first to understand the purpose and whether the means is a candidate or an established decision. If the supplied context already establishes the purpose, background or decision, do not ask for it again. If a means-only request leaves candidate versus decided status unclear, briefly ask whether the requester has selected the means or wants help considering how to meet the goal; this is not a question to ask on every request.

For a still-open candidate whose purpose or actual Problem is unknown, retain the requester's idea and ask the smallest useful background question before expanding it into changed requirements. A plausible Why for the current Activity does not explain why its means should change. Do not invent a Problem or treat the proposed means as agreed. Once current work and a concrete Problem / Pain are established, use the existing optional Optimization Review when comparison is useful; keep that review separate from authoring and keep adoption with people.

An explicit decision to begin new work, implementation of agreed meaning, or a means fixed by an external constraint does not need its adoption reopened. Ask only about remaining concrete consequences that are needed for the requested work, including a genuine contradiction. Continue drafting the known scope while leaving deferrable or explicitly undecided matters visible; do not make every unresolved question a condition for agreement on the known scope. Keep the existing Draft / unconfirmed distinction, without a new required document, field or lifecycle state. The bundled intake change was introduced in Plugin 0.4.1 and remains included in 0.4.3; the fixed 0.4.0 package remains unchanged.

### Language for agreement

**Write Business Design prose in the language the requester actually uses.** Business Design is a document for agreement with users/requesters: they must be able to read it, understand it, point out errors, and agree to its meaning themselves. Readability for implementers alone is insufficient; this is a prerequisite for meaningful human review, not a cosmetic preference.

Apply this to explanations, business descriptions, and Input / Procedure / Output text when creating or updating the design. Headers and section names such as What / Why / When / Who / Where / How may remain English. For Alder's own design, the requester uses Japanese, so its prose is Japanese. The format recommendation below does not override this principle.

### Human and AI co-maintenance

Business Design must be writable, readable and maintainable by a person alone, starting from interview findings. AI may draft and edit the same visible information alongside people; it is not an AI-only source format. For example, either a person or AI may choose and later revise an Object's visible Icon field. Keep information in understandable headings, sections and ordinary text. Do not require authors to maintain hidden HTML-comment IDs, annotations or machine-only fingerprints. Derive export data from the human-readable structure; tooling must fit the document. Business Design remains the SSOT and human business agreement is still required.

### Business Design format

Alder defines Business Design around **5W1H, with How written as Input → Procedure → Output and an optional Exception section**, so users can read it as natural-language business documentation while AI can trace relationships between activities. New Business Design written for Alder should use this structure. The detailed visible structure is defined in [Business Design document structure](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/business-design-structure.ja.md), and the optional Business Graph profile uses the same headings and references. Existing documents in other formats can still be used as source material or reviewed where practical, but equivalent review behavior is not guaranteed until they are expressed in this structure.

| Field | What to describe |
| --- | --- |
| What | A short business name, represented by the Activity heading; do not repeat it as a separate explanatory field. |
| Why | Its purpose, in a short phrase. |
| When | Only the normal start trigger: a preceding result, external event, or state change. Keep exception/return triggers separate. |
| Who | A short, stable role name for the work; reuse the same name for the same role. |
| Where | The place, usage environment or channel that affects business procedures or resulting system requirements; otherwise “not specified” (規定なし). |
| How | Input: what is received from preceding work, users, or external sources → Procedure: the successful work → optional Exception: what can interrupt that work and where it returns → Output: what is passed to subsequent work as an established fact. |
| Result | The business state established when Procedure finishes normally and the subsequent business it enables. Keep it separate from Output's transferred information and Why's purpose. |

Design these field values for their later use in correlation views and role filters, not as general explanatory paragraphs. Do not require human authors to maintain machine IDs or hidden annotations in Business Design. Put AI/human assignments, assistance, approval responsibility and detailed operating conditions in Procedure or operating rules; shortening fields must not delete these guarantees. The [optional export profile](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/business-graph.md#opt-in-markdown-profile-v1) derives identity and connections from visible names and projects the Activity heading as the business name. Older research source documents remain frozen as evidence.

Input / Output describe the actual information transfers represented by Object ↔ Business connections in the agreed business correlations, not a general reference-material inventory. Keep business-to-business exception/return flows separate from ordinary I/O.

The point is not to fill every field mechanically. It is to **identify the activity through What and trace relationships between activities through Who / When / Input / Output / Result**. Read each Result alongside the succeeding Activity's normal When: if A's Result enables B, B's trigger should make sense once that state is established. Do not turn a possible handoff into a mandatory sequence, or repeat artifact lists, steps, exceptions, detailed acceptance criteria or the purpose in Result. Record the state in human-readable Business Design even when part of it might be derived from a graph view.

A When such as “whenever the person feels like doing it” makes timing depend on individual initiative. Check the real reason work begins, not merely whether the wording is passive. If human discretion itself is the operational trigger, state the concrete observation prompting that discretion. For example, the optional drift diagnosis starts when a synchronization gap is suspected in Business Design / Check / Test relationships, not on every edit or when an invented requester sends an undefined request. This is a normal start outside the standard flow, not an Exception When caused by another Activity. Use “any time” / 随時 only when no more specific start reason can be stated.

Examples (Japanese): [Facilities maintenance](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/business-design/facilities-maintenance/README.md) / [Purchase requests](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/business-design/purchase-request/README.md) / [Meeting-room reservation](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/business-design/meeting-room/README.md)

### Business quality requirements belong where they constrain the work

Alder does **not** omit business quality requirements. It also does not create a separate, general `Quality` bucket for them. When a deadline, continuity condition, retry invariant, authority rule or traceability period is part of what makes the work acceptable to the requester, it is **business meaning** and belongs in Business Design. Put it where that condition constrains the work, so the requirement stays connected to the Activity, Object or Result that gives it meaning.

Use the existing fields according to what the condition governs:

| Business condition | Put it primarily in | Example |
| --- | --- | --- |
| Completion deadline or normal completion guarantee | `Procedure` / `Result` | All payroll transfers are completed by 17:00 on the specified payday. |
| Invariant that must survive retry, partial failure or re-execution | `Procedure` / `Exception` / `Result` | Retrying a partially failed payroll run must not pay the same employee twice for the same month. |
| Continuity of the business when an ordinary path is unavailable | `Exception` / `Procedure` / `Result`; `Where` when the operating environment matters | Reception continues during an information-system outage by switching to the established fallback work. |
| Authority or approval needed for an acceptable outcome | `Who` / `Procedure` | Only an approved bank-account change may be used for payment. |
| Information that must remain traceable or available for a period | `Object.Information` plus the `Procedure` / `Result` that establishes or maintains it | The actor, approver, before/after values and change time remain reviewable for the required period. |
| State guaranteed after successful work | `Result` | The accepted application and its reception time are established for later monthly reporting. |

The same business condition may affect more than one part of the design, but do not copy it into a second category merely for visibility. Keep the governing statement close to the work that must preserve it. Repeat only the distinct meaning needed to describe, for example, both the action in Procedure and the state established in Result. A separate `Quality` heading that duplicates Procedure, Exception, Result or Object.Information creates another copy that can drift during later edits.

A desired condition is also different from an observed operational problem. A requirement such as “complete payroll by 17:00” can exist even when no delay has occurred. If current work actually misses that condition or creates a burden, record that separate fact as a **Problem** and its relative impact as **Pain** when using [Optimization Review](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/optimization-review.md). Do not infer a Problem or Pain merely because a business quality condition exists.

Likewise, state the **business condition**, not its technical implementation. “Reception must continue during business hours” can be Business Design; “use active-active servers” is a system-design candidate. “A change must remain attributable for two years” can be Business Design; an encryption algorithm, database, replica count or cloud topology belongs in technical requirements. Business Design defines what must hold. System Design chooses how to make it hold.

This boundary was checked in [Issue #107](https://github.com/mk3008/alder/issues/107): the evaluated deadline, continuity, duplicate-payment and traceability conditions were expressible with the existing Business Design fields, while a separate experimental `Quality` heading mainly improved scanning, duplicated existing meaning and introduced an attribution defect in one run. Alder therefore keeps the business-quality concept but does not add a dedicated Quality field, grammar rule, exporter field or mandatory checklist.

### Business structure requirements follow the work they change

When the way information is grouped, identified or retained changes what people can do or what a later activity can rely on, write that **business outcome difference** next to the affected work. For example, “one order can contain several items and quantities” belongs with the order's Procedure and established Result; “approve the entire request together, without approving individual items” belongs with the approval judgment. “Delivery requires an address; store pickup does not” belongs with the receiving conditions. Object.Information may name the corresponding concepts, without copying the operating rule there. If an interview does not decide whether approval is per item or for the whole request, ask which outcomes are allowed instead of inferring a policy from a proposed schema.

Consider identity across changes, optional information, independent changes, uniqueness within a business scope, the state to retain and the unit of approval only when two plausible choices would change a concrete current or downstream outcome. For instance, “a membership number is unique within an organization, but may be reused in another” expresses the scope of rejection without prescribing a composite key. Do not fill a cardinality inventory for every Object. Business Design supplies the **business-side structural requirements**; later data modeling selects among structures that satisfy them together with system requirements and existing constraints. It does not follow uniquely from Business Design and does not require ER/DDL before agreement on the work. The [Issue #114 study](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/data-structure-requirements-study.md) contains further contrasts.

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

Choose information names that can be expressed naturally in Procedure. From every I/O label, trace how the information is used or produced in the successful work; from each transfer in Procedure, trace its source or destination Object back to I/O. If listing several fine-grained names makes the steps awkward, summarize them at the level of the business exchange (requester feedback and decisions can form one review result). If a broad name conceals different exchanges, separate the information names. This is a semantic, two-way reading check, not a requirement to repeat every label verbatim in every step. The [trial quality check](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/business-design-quality-review.md#ioとprocedureの双方向照合) applies it to all Activities in PR #80.

Ordinary transfers connect Object → Business (Input) or Business → Object (Output). Do not use Business → Business or Object → Object as ordinary data connections. Where a real exception requires one, declare its kind, endpoints and meaning separately. Keep returns for unresolved business requirements distinct from ordinary information transfer. The [export contract](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/business-graph.md#json-v1-contract) encodes these distinctions when that optional tool is used.

**Procedure is the successful sequence of work that uses the declared Objects.** Make its actor the Who role; name each input Object and what is read or received, the action or judgment performed, and which Object is updated or delivered. If AI assists, keep its drafting or editing role distinct from the responsible Who. An actually autonomous Activity should name its automated actor in Who. Make the result usable by subsequent work. Keep exception conditions and their returns in How → Exception. Do not replace steps with principles such as “review appropriately” or “record decisions”; place general authoring rules in guidance rather than repeating them as the business procedure. Reconcile Procedure and I/O in both directions: a declared transfer must have a concrete use or production step, and an actual transfer in Procedure must appear in I/O. Reconcile Exception with Exception When or an explicit exceptional relation separately.

Preserve actual review exchanges in Business Design and generated JSON even when they make the diagram dense. A Viewer may filter or hide review lines; visual simplicity must not remove business correlations from the SSOT. When Check review reveals a problem with business meaning, conditions, guarantees or unresolved policy, represent the return from Check design to Business Design as a separate business exception, including correction and agreement before downstream updates.

Represent human review as an exchange when the work includes one: deliver the draft and unresolved questions to the requester, receive review results and judgments, update the design and remaining questions, and repeat relevant review until the design and unresolved scope can be agreed. Do not collapse this into one input or assume sending a document means approval. Agreement need not settle every possible future policy; keep confirmed meaning and open questions distinguishable.

When a requester or responsible person resolves a material open issue, record **which question was decided, by whom, the decision and its result at that resolution step** in the Decision Record. Reflect the resulting business meaning in Business Design as well. Records provide decision evidence; they do not replace the SSOT or confer approval themselves. Ordinary reversible technical choices still follow the [delegation guidance](#3-let-the-ai-implement-without-inventing-business-policy), without an added business-approval gate.

Before presenting a draft, walk one representative passage through its named Objects and steps. Check the [requester’s language](#language-for-agreement), [human/AI maintainability](#human-and-ai-co-maintenance), field meanings, normal versus exception triggers, environment-derived requirements, actual transfers and their content labels, review return paths and decision timing. Correct inconsistencies in the draft; ask people only about concrete unresolved business meaning. The [PR #80 writing-quality trial](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/business-design-quality-review.md) expands this check to every Activity of the design of using Alder; it is not a new mandatory independent-review pipeline or a change to review knowledge v0.3. The existing format recommendation and research limits above still apply.

### Record operational Problems when there is something to improve

Business Design may also record a concrete **Problem** and **Pain level** for an Activity when people actually experience a burden worth reviewing. These are not mandatory fields and should not be invented merely to make every Activity look optimizable.

```markdown
## Problem

Approved purchase requests require the purchasing operator to repeat purchase and result-registration work for each request.

## Pain level

High
```

For the [exportable v1 profile](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/business-graph.md#opt-in-markdown-profile-v1), place the two nonempty H2 fields after Result, in Problem then Pain level order, with **Low / Medium / High** as the entire Pain value. Both fields are optional as a pair; record at most one pair per Activity. Other Business Designs need not use the export profile, but keep Problem and Pain together as the inputs to this review. Pain is a proportionality signal for review, not a numerical score or an automatic decision rule. If frequency, time, error rate, cost or other observed evidence is available, record it; do not fabricate measurements when none exist.

The pair is current human-recorded business information. An AI-generated candidate, Expected benefit, Difficulty, Confidence or Narrow / Keep / Expand assessment is not a current fact. If people adopt a change, update and re-agree Business Design before deriving Checks, Tests or implementation; record any remaining Problem and Pain that still describes the revised current work. A recorded Problem is the entry point for [Optimization Review](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/optimization-review.md). The review stays centered on that Problem rather than trying to optimize the whole Business Design.


## 2. Point the agent to the design and review knowledge

The plugin routes the request and bundles its guidance. For `docs/business-design/`, no Alder-specific AGENTS.md entry is needed; specify a different design path when used. See [Product setup](https://github.com/mk3008/alder/blob/e4c47ed227d055fb94cbfdc851573feb555f4406/docs/plugin-adoption.md#product-setup).

For additional project-specific implementation instructions, AGENTS.md can route the agent. Adapt this example to your workspace:

```markdown
## Business Design

- Current business design is under `docs/business-design/`.
- Treat it as the current source of operational intent.
- Before creating or updating Business Design, read section 1 of `docs/adoption.md` from the selected Alder revision (provide its readable path or URL with the task). Apply its authoring principles and correlation check from the first draft.
- Do not invent business policy when the design does not decide it.
- Make material implementation assumptions and choices, including their reasons, available to the Alder review; maintain confirmed Decision Records as part of the Alder review/follow-up under `docs/decisions/`.
```

For manual review without the plugin, provide a readable path or versioned URL for the selected review knowledge. If you keep a local copy, record its source revision in the manual routing instructions or alongside the copied document. Do not copy the full review knowledge into AGENTS.md or inject Q1–Q3 / P1 / P2 / S into every implementation task. Apply it explicitly during review.

### Versions and access

Alder uses one user-facing product version, shared with the plugin manifest. A published `plugin-vX.Y.Z` tag fixes the documentation, source and plugin at one revision. The tag prefix remains compatible with existing installation commands; it does not identify a separate product version. A working branch or untagged commit is a development revision, not a published release.

The plugin bundles review knowledge v0.3; no knowledge copy or Alder checkout in the product is required. Record the installed Alder version and applicable knowledge identifier with review results. The knowledge identifier is retained for reproducibility, not as another product release.

For manual review, select the same published tag as the plugin, or an explicit development commit. Provide a readable versioned URL or checkout for `docs/phase2/review-knowledge-v0.3.md` from that revision. An optional copy at `docs/alder/review-knowledge.md` must preserve the rules and record its source revision. The knowledge remains research version v0.3 regardless of the selected product tag or local filename. Confirm the reviewer can read it; the current review knowledge is in Japanese.

Historical method tags such as `v0.6` retain their original meaning and optional Check Item workflow. The current standard workflow requires Check Item design and human review before implementation handoff; it is included in the published `plugin-v0.4.0` and later packages. Existing Check IDs and review states remain valid. Tests verify Code by execution; Alder does not maintain Check Item ↔ Code mappings. No independent method v0.7 release is planned.

### Run Optimization Review for a recorded Problem

When people recognize a new Problem / Pain, first record and confirm it in the current Business Design through the design loop. When Business Design contains that concrete Problem and Pain level, optionally use [Optimization Review](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/optimization-review.md) to explore whether a different business design could reduce that pain. This is an adopted Alder workflow capability, but it is not a requirement to optimize every Activity.

The review:

- starts from the stated Problem instead of searching the entire design for generic improvements
- treats Pain as a proportionality signal for how far investigation and business-change difficulty are worth exploring
- considers relevant directions such as Eliminate, Simplify/Merge, Automate, Delegate and Preserve without forcing one candidate from every category
- classifies Scope as Narrow / Keep / Expand and explains why the Problem requires that boundary
- judges Difficulty from affected roles, authority, Activities, systems, departments, external parties and contracts rather than code size
- preserves existing Business meaning unless people explicitly decide to change it
- allows zero useful candidates and does not count a restatement of the current Business Design as an optimization
- can clarify consequential “partial” proposals through [boundary decomposition](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/optimization-review.md#boundary-decomposition-when-useful), keeping separately variable responsibilities and genuine quantities distinct, and stopping when further exploration cannot change a grounded decision
- when the Problem warrants it, can return a few explicitly exploratory **Extreme perspectives** separately from candidates, so people can revisit a different business model if missing facts or business decisions become available

Return at most a few useful alternatives; the current guide uses a maximum of three for one Problem. Do not choose a winner. People decide whether a candidate is worth adopting.

If people accept a candidate, **update and confirm Business Design first**: apply the same writing-quality and business-correlation review used for any design revision, and use optional functional-consideration discovery where useful. Ask people to confirm the changed meaning and remaining Problem / Pain before Check Item design. Then update downstream Checks, Tests, Decisions and implementation. A candidate is not a requirement merely because the AI proposed it.

Use the copyable prompt and output contract in [Optimization Review](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/optimization-review.md). The evidence and limits for this adopted workflow are recorded there and in [Validation](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/validation.md).

<a id="optional-draft-and-review-atomic-checks"></a>

<a id="optional-draft-and-review-check-items"></a>

<a id="draft-and-review-check-items-required"></a>

### Draft and review Check Items (required)

After humans have completed Business Design and its business-correlation review, Alder requires Check Item design and human review before test implementation. An AI uses the [behavior/check draft prompt](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/behavior-derivation/candidate-c3.md) to prepare Check Items for designers and requesters. Read the **whole Business Design**; organize only the output by Activity or an already-reviewed Functional Interface. Derive concrete checks from activity conditions, preceding outputs and subsequent inputs, Data/Role/Rule constraints, and relevant zero/one/many, missing-target, boundary, failure and continuation cases.

The human-facing view should make **one Check Item represent one independently reviewable observable expectation whenever practical**. People primarily review ID, title, expected result, and review state. Keep exact conditions, evidence, derivation classification/confidence, connections and later Test mappings as supporting detail under the same ID. Do not mechanically split inseparable conditions merely to increase the item count.

Use these review states independently from AI confidence and test evidence: **未レビュー / 要確認 / 確認済み / 要修正**. A high-confidence AI derivation is still unreviewed until a person checks it. A human-confirmed Check may still have missing automated-test evidence.

The AI creates both the initial draft and subsequent updates, preserving IDs and Business Design / existing Check / Test mappings. Humans review expected results and return omissions, errors, correction requests and confirmation; the AI normally applies Check-level feedback while maintaining the mappings. Direct human editing is allowed, with mapping consistency checked afterward. This differs from Business Design, which must remain maintainable by humans alone. Repeat explanation, review and update until agreement before test implementation. If review reveals an unresolved business decision or changes business meaning, return to Business Design; resolve and record the decision there, then update and human-confirm Business Design first. Do not let a Check, Decision Record, test or existing implementation become a hidden replacement for Business Design. Then update affected Interfaces/Checks, Decisions, tests and code from that confirmed revision.

The **standard design business ends** when the requester has agreed to the Business Design and Check Items and both are handed to the adjacent implementation with their revisions and IDs. The Check ↔ Test mapping for newly created Tests cannot be complete at that handoff. Implementation then creates or updates code and representative normal, boundary, failure and continuation tests; Alder does not require a Test-first, Code-first or alternating order. The separate post-implementation Alder review and follow-up, required in the current development loop but outside this bounded Business Design, checks that Test expectations derive from the confirmed Check/Business Design rather than merely codifying current behavior. After the independent read-only review, the Alder follow-up adds or updates representative Check-to-Test/assertion mappings and evidence gaps in the Check Item details before accepting the implementation change. Keep expected results, review states and Business Design links under the same ID. Do not introduce a separate permanent test-plan Object for the same information.

An agreed Check expectation and evidence that a Test verifies it are different things. The Check review state records human confirmation of business meaning; a missing Test assertion or execution result is a separate evidence gap maintained after implementation. Do not read a design-time evidence gap as an unresolved business decision or make complete Test evidence a new pre-handoff gate. If an actual case raises a consequential question about handoff with a known gap, return that concrete question to the responsible people rather than imposing a universal policy.

When external visualization, analysis or processing would help the designer's own review, the requester's review or correlation checking, an author may optionally [export Business Graph JSON](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/business-graph.md). The JSON is an intermediate projection for external tools, not a standard Business Activity or a requester deliverable. It need not be generated or committed to complete the standard design business. Record any correction discovered through an external tool in the Business Design SSOT. A committed projection, such as Alder's regression fixture, is checked by deterministic regeneration; stale generated JSON is distinct from semantic Business Design ↔ Check ↔ Test drift.

Pass the human-reviewed, AI-maintained list and the same Business Design revision to the implementation agent. During Alder review/follow-up, map design revision + list revision + item ID to representative test assertions after checking their meaning. Do not maintain Code, file, symbol, SQL-entry-point, or line mappings as permanent Alder artifacts; tests verify the current implementation by execution. Do not turn unapproved candidates into pass/fail expectations. The [Check Item traceability guide](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/check-item-traceability.md) defines the two-layer view, review states, authority boundary, and meaning-preservation audit. The [research conclusion](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/behavior-derivation/conclusion.md) records evidence and limits. Review knowledge v0.3 is unchanged.

### Carry security requirements into implementation

When preparing an implementation handoff, identify the security conditions for the actual scope alongside the agreed Business Design and reviewed Checks. Reuse readable project instructions, decisions and existing System Requirements (SR); a separate security document is not required. Keep the security input's state explicit:

- **Provided:** identify the project-specific SR source, revision and applicable scope. If the product has adopted a standard baseline, identify that baseline's version, adoption decision, applicable scope and any known exclusions or open tailoring decisions. Naming a standard alone is not adoption or proof that it covers this product.
- **Not applicable:** retain the responsible product-side decision and concrete scope-based reason. “Local-only,” “no login,” silence, or “I do not know” alone does not establish non-applicability.
- **Unresolved:** distinguish not provided, unreadable, and a known undecided condition. Say what is missing, what affected work cannot yet be justified, and which product-side business or technical owner can resolve it. If the owner is unknown, say so rather than assigning authority to the AI.

Do not force an unknown into Provided or Not applicable just to complete the handoff. Carry unresolved scope forward visibly; do not describe that part as requirement-free, security-approved or ready for acceptance. Continue independent work. Hold only decisions or dependent work whose security-relevant outcome cannot be justified from the available requirements; this is not a blanket stop on design, Check drafting or implementation, and not a new universal human-approval stage.

Separate **business meaning** from **technical constraints**. Whether one person may view or change another person's information changes the allowed business result and belongs with the affected Activity or Object after human confirmation. An authorization mechanism, dependency-vulnerability handling, credential storage or untrusted-input boundary belongs in product-side SR. Missing technical policy must not generate speculative Business Design rules or Check Items. Ordinary reversible implementation choices within known constraints remain delegated.

If the product has no security SR, offer bounded creation support rather than silently applying an Alder baseline. For the actual feature and inputs, the product-side owner and AI can use this small prompt in their existing requirement location:

```text
For <feature and scope>, identify the data/assets and input, authority or external-service boundaries actually present.
Reuse <existing constraints and their revisions>. Identify the security properties implementation must preserve, remaining unknowns, and the responsible business/technical decision-maker.
For each relevant proposed condition, state its source or rationale, applicability, unapproved/decided status, and how evidence could verify it. Mark unavailable information as unknown.
Use a named standard baseline only if the product chooses it; record its version, scope and tailoring. Do not claim this draft is approved, complete, or a security assessment.
```

This is optional SR-authoring support, not a new required artifact or an Alder-owned catalog of security requirements. Select concrete questions from the product's actual operations; do not inject a general security checklist into Business Design or Checks. A person answering “not sure” leaves the affected question unresolved. Preserve a deferral without asking the same question repeatedly; identify the dependent step and resume condition instead. The product remains responsible for SR creation, validity and completeness. The later independent review continues to compare provided applicable SR and evidence under its existing boundary.

### Optional: explore undocumented functional conditions

After Business Design and its business-correlation review are complete, use [functional consideration discovery](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/behavior-derivation/functional-considerations.md) before or alongside Check Item drafting when the feature warrants it. This adopted optional step asks which real-system conditions still need a decision. Read the whole applicable Business Design, Scope, existing Decisions and shared contracts. Use relevant general knowledge to describe concrete situations with different observable outcomes, then close already settled questions before asking a person. It is not a mandatory gate, an exhaustive checklist, or a repeat of PoC/business-correlation review.

Keep document-derived Checks separate from externally prompted questions. External knowledge establishes possible relevance, not authority for an answer. Present genuinely unresolved choices as **unapproved candidates**, with their assumptions, alternatives and implications. Humans decide the meaning; update and confirm Business Design first when a meaning or guarantee changes, then derive c3 / Check Items and map them to Tests. Do not turn a candidate directly into an assertion or send routine reversible implementation choices back as business questions. Stop after a small set of concrete useful questions; no minimum finding count is required.

The [historical backtest](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/behavior-derivation/issue-71-historical.md) found one concrete failure-boundary question at an earlier Velvet revision that later received an explicit human decision and Decision record. Across two historical snapshots, four candidates comprised one such match, one conditional unresolved question and two already settled questions. This is bounded evidence for adopting the practice, not a controlled estimate of prompt effect or a completeness claim. Earlier [known-context](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/behavior-derivation/issue-71-discovery.md) and [current-version Fresh](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/behavior-derivation/issue-71-fresh-velvet.md) trials retain their original experimental dispositions; the latter found no qualifying unresolved issue. All raw outputs and the exact trial prompt remain frozen.

### Optional: use Functional Interfaces as a responsibility index

Where one Activity contains independently observable capabilities, or responsibility spans several Check Items and implementation locations, the [Functional Interface prompt](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/functional-interface/prompt.md) can draft a small intermediate index. Derive contracts from the whole completed Business Design, then relate them to Check Items and test assertions. Humans review and complete both drafts. An Interface is an observable operation contract, not a required function, API, class or file; several contracts may share code and one contract may span Python, SQL and tests.

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

Use this index only when it clarifies responsibility or change navigation; it may live in the existing Check list or mapping table instead of a separate specification. Direct Business Design → Check → Test traceability remains sufficient where clear. Do not maintain a complete code-line matrix. The [Check Item traceability guide](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/check-item-traceability.md) records the current operating form, while the [Functional Interface study](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/functional-interface/study.md) records the earlier bounded evaluation and duplicate-maintenance cost.

## 3. Let the AI implement without inventing business policy

Alder does not prescribe an architecture style or when to introduce structure. Give the implementation agent the Business Design, current requirements, project constraints, and the information below; let it choose how to realize them. See [the architecture position](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/philosophy.md#ai-coding-and-architecture).

A separate detailed-design gate is not required before implementation, and technical details need not all be settled in advance. Give the agent known schema and interface constraints, and identify decisions whose later change would be costly or hard to reverse; design those parts in advance as needed. Other technical details may be worked out with implementation and reviewed against the resulting DDL, SQL, code, tests, and decisions. The [detailed-design position](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/philosophy.md#where-detailed-design-fits) explains the new/legacy table cases and the limits of this approach.

Describe futures you actually foresee in concrete terms, separately from current requirements. For example: “additional delivery or payment providers are likely,” “there is a concrete prospect of changing the database,” or “business logic must be testable without external I/O.” The last example is a desired property, not a prediction. State the risk or property itself rather than translating it into “create a Port,” “add a Repository,” or “use Clean Architecture.”

Pass on what people actually know about likely changes; do not add hypothetical requirements merely because something might change someday. If no such future is foreseen, say so or omit it. Foresight informs design decisions; it does not authorize the agent to invent undecided future business rules or implement them as current requirements.

### Prefer error-resistant operation

Predictable operator mistakes are real implementation risks. When a plausible mistake can be removed by a cheap, clear structural choice without changing business meaning or adding disproportionate complexity, prefer that structure over relying on memory, documentation, or a non-obvious exception. Make the ordinary/default action the correct action where practical; first remove an avoidable trap before adding warnings, checks or special procedures around it. For example, where migration identities are not already fixed by deployment history, align natural file order with required execution order instead of documenting a reversed exception.

Apply this to concrete current operation, including relevant ordering, interruption or ambiguous-state risks; it is not a mandatory checklist for every task. Preserve legitimate manual judgment and useful runbooks. Do not require full automation, elimination of every invalid state, or UI redesign. Stop when the operating condition is sufficiently clear and robust and further safeguards would be disproportionate. Consider availability and continuity: stopping can be appropriate when incorrect execution has serious consequences and an ambiguous state cannot support safe continuation, but first look for a simple way to remove the ambiguity itself. Do not turn this into a blanket fail-closed rule.

This guides implementation choices, not a new Alder review rule. Keep established external responsibilities and the existing distinction between technical improvements, concrete requirement/guarantee violations and unresolved business meaning. The [Issue #54 case analysis](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/operational-error-resistance.md) records existing coverage, six authored thought cases and the limits of this clarification; behavioral improvement has not been measured.

### Prioritize and bound technical evaluation

When a task requires comparing technical candidates, reason from its acceptance conditions, risks, data and call cardinality, complexity, execution environment and resource ownership before choosing what to test. Separate established facts, conditional estimates and remaining unknowns. Prioritize uncertainties whose answers could change feasibility or candidate selection, weighing expected effect, information value, evaluation cost, change risk and reversibility. A small change is not sufficient reason to investigate a candidate deeply when its residual cost is already unlikely to meet the target; an order-of-growth advantage is not sufficient reason to choose a larger change either.

Use existing evidence to narrow the search. Test consequential unknowns such as semantic equivalence, environment-specific costs and shared-resource impact. Where work accumulates over time, reason about timeout, continuing arrivals, backlog, retries and durable catch-up rather than only one successful operation. Do not turn these examples into a checklist for unrelated tasks or require exhaustive design review before implementation.

Set a task-proportionate evaluation time budget and stopping condition before substantial experiments; a bounded scope or experiment count can serve as the budget when no elapsed-time limit is supplied. Stop optional evaluation when acceptance conditions have sufficient support and another experiment is unlikely to change the decision. Stop investigating a rejected candidate once decisive evidence rules it out, and redirect remaining effort to the consequential uncertainty. Preserve required correctness and regression gates. If the budget ends with a material unknown, report the limit and unresolved decision rather than claiming fitness or silently expanding the study.

Use the product concept, Business Design, requirements and user intent to identify where effort matters and which properties must not be compromised. If speed, low memory use or another property is an explicit differentiator, focus evaluation on that property; honor numeric targets when supplied. A qualitative priority also warrants focused effort, without requiring unlimited optimization.

Otherwise, default to a sufficiently good solution: try candidates with the strongest reasoned prospect of meeting the task's needs, and stop searching once relevant verification supports a reasonable result. Numeric targets are not a prerequisite. Relative comparisons, expected workload, resource costs and material risks can support a technical judgment of adequacy; being better than another candidate alone does not establish suitability. The possibility of a still-better candidate is not itself a reason to continue.

Record material adequacy judgments in the relevant Decision Record, including the supporting evidence, assumptions, tradeoffs, remaining limitations and reason for stopping, so they can be reviewed. Distinguish an agent's technical judgment from an agreed requirement or production guarantee. Do not turn every routine choice into a separate record or approval gate.

Ask only when unresolved priorities, unacceptable tradeoffs or consequential unknowns prevent a defensible decision within delegated authority. Missing numeric targets or an unspecified desire for further optimization alone do not require clarification. Make the decision concrete with available evidence and continue independent authorized work. Respect already accepted tradeoffs; do not invent agreed production thresholds, demand a global optimum, or default to smallest change regardless of fitness.

These are implementation and technical-evaluation instructions. Ordinary post-implementation Alder review keeps its Q1–Q3 / P2 / S scope: report concrete requirement or guarantee violations and unresolved business meaning, classify technical improvements separately, and close established sufficiency. A faster alternative alone does not reopen an accepted business decision. A separately requested performance audit uses its own acceptance conditions and evaluation budget.

The [Issue #51 case analysis](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/inference-validation.md) documents the rationale and limits. This clarification has not been shown to improve agent behavior in a controlled comparison.

Replace the placeholders with the requested task and actual design path:

```text
Task: <requested work and acceptance conditions>
Business Design: <path and revision>
Current requirements / constraints / review concerns: <concrete requirements and desired properties>
Security requirements: <provided source/version/scope, explicit non-applicability and reason, or unresolved status/owner; do not treat an unknown as no requirements>
Known risks / likely future changes: <concrete foresight, separate from current requirements; omit if none>

Read the relevant Business Design before implementing this task.
Apply “Carry security requirements into implementation” from the selected Alder adoption guidance. Preserve unresolved security inputs and the affected dependent steps; do not invent their resolution or block unrelated work.
Implement the requested work using the existing project conventions. Use the stated risks and desired properties to choose the implementation; do not treat architecture names as substitutes for requirements. Treat future foresight as design context, not authorization to implement undecided future behavior. Do not invent unforeseen future requirements or business policy that the Business Design does not decide.

When implementation makes a material assumption or choice that is not obvious from the Business Design, report what was chosen, why, and which evidence or constraint led to it, so the separate Alder review can verify and record it. Do not treat a rationale as approved business meaning or create a Decision Record for every routine, reversible technical choice.

If the choice would change the business outcome, authority, allowed state, data meaning or cardinality, unit of work, or a guarantee relied on by another activity, and the Business Design does not decide it, do not record it as an approved business decision. Report it as a focused Human Decision instead and keep it unresolved. Explain why the existing Business Design does not decide it, give the smallest useful alternatives, and continue independent work where possible.

Routine, reversible technical choices do not require Human Decision. Perform the relevant non-destructive verification for the requested work. For relevant operational choices, apply Alder adoption guidance “Prefer error-resistant operation” from <readable path or URL and revision>. When comparing technical candidates, apply Alder adoption guidance “Prioritize and bound technical evaluation” from <readable path or URL and revision>: use inference to select consequential uncertainties, set a proportionate evaluation budget and stopping condition, and preserve required verification gates.
```

A Decision Record is Alder's evidence of material assumptions and choices actually made during implementation, together with their reasons. The implementer supplies the rationale; the Alder review/follow-up checks its source and records confirmed material choices, marking missing reasons as questions rather than inventing them. A Human Decision is needed when Business Design leaves unresolved a choice that changes business meaning. A Decision Record does not replace that human decision; neither passing tests nor completed implementation constitute business approval.

Use the repository’s existing location and format for Decision Records, or a suitable location such as `docs/decisions/` if none exists. Alder requires the record, not a particular directory or template. These are Decision Records, not only architecture decisions. The independent Fresh review prompt below is deliberately read-only; update Check mappings and Decision Records in a subsequent Alder follow-up after that review, without asking the read-only reviewer to edit files.

## 4. Run a separate Alder review after implementation (outside the standard design business)

This is the **required post-implementation review in the current Alder development loop**, separate from the standard design business that ends at handoff. Use a separate agent or fresh context so that implementation assumptions are not simply carried forward as justification. With the plugin enabled, identify the design and implementation revisions and scope, make documented decisions and provided System Requirements (SR), including their sources, revisions and applicable scope, readable, and ask in a new chat: “コードをAlderでレビューして”. The plugin reads **Business Design → Decision Records / confirmed Checks / provided SR → implementation / DDL / Test / available execution evidence** using its bundled review knowledge and discovers the conventional design path; specify another path or a target when needed. With a package supporting combined requests, ask “Alderで実装をレビューして、チェックとテストの対応も更新して” to run the independent read-only stage and then maintain the requested Check ↔ Test/assertion mappings and evidence gaps in one interaction. The orchestrating agent performs authorized record maintenance after the separate reviewer returns; the reviewer itself remains read-only. “レビューだけ” and an ordinary review request without update authorization do not write. Record-only follow-up remains available without a new review. If the host cannot run a separate context, it reports the missing independent stage instead of substituting self-review or starting combined-workflow writes. This separation is not an additional rule in review knowledge v0.3.

When implementation or DDL fixes grouping, optionality, identity, retention, uniqueness or the unit of work, apply P2/Q3 to its **effect on allowed business states and downstream guarantees**. A table layout alone is a technical choice; a structure that prevents a stated multi-item order is a mismatch; an unconfirmed partial-approval policy is a focused Business question. Do not treat an absent ER relationship description in Business Design as a defect by itself.

The independent review checks provided SR constraints relevant to the change; the product remains responsible for SR authoring, validity and completeness. Preserve the SR version used for implementation and its applicable scope alongside project instructions and decisions so a history-free reviewer can find the same constraints. Missing or unreadable SR leaves that part unverified, not requirement-free; scope-based non-applicability needs a reason. Code inspection, passing tests and configuration targets do not establish unobserved operational guarantees.

Keep business meaning in Business Design and technical constraints in their supplied sources. If they are ambiguous or conflict, retain both, explain the impact and ask the relevant business/technical owner for the smallest needed decision. Continue unaffected review; do not require a general NFR checklist, SR Check ledger, Risk classification or new human gate. If a source revision or scope changes, retain the old review pin and re-review affected scope before relying on its conclusion or updating dependent records.

### Manual/reference review prompt

For clients without the plugin or for reproducibility, provide a readable, revision-pinned review-knowledge source and use this prompt:

```text
Review the current implementation against the relevant Business Design using Alder review knowledge v0.3 from the selected Alder revision. Review only; do not modify files.

Business Design / confirmed Checks: <paths and revisions>
Project instructions / decisions / provided SR: <readable sources, revisions and applicable scope, including SR used for implementation; distinguish not provided, unreadable and not applicable>
Implementation: <path and revision or precise working-tree scope>
Review knowledge: <readable path or versioned URL and revision>

Read in this order:
1. Business Design
2. Project instructions / Decision Records / documented assumptions / confirmed Checks / provided SR
3. implementation, DDL, tests and available execution evidence

Apply the referenced review knowledge, including its boundaries and stopping conditions. Check whether the implemented work can continue truthfully, whether constraints have explainable causes and remaining effects, and whether meaning, conditions, units of work, authority, and guarantees connect across preceding and subsequent activities.

Walk through representative work from each participant's perspective, then trace business-significant choices in the implementation back to the Business Design. Compare provided SR constraints relevant to this change against the implementation and evidence; cite the clause and any evidence gap. Do not claim SR completeness or unobserved operational guarantees. Preserve BD/SR ambiguity or conflict and ask the relevant owners for the smallest decision; continue unaffected work. Keep missing SR unverified and explain scoped non-applicability. Re-review affected scope if an input revision or scope changes before claiming current conformity.

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

A light check for obvious contradictions or Human Blockers before implementation is useful. The main use shown here is post-implementation review: ambiguity has become a concrete choice that can be traced back to Business Design. The optimal division between pre- and post-implementation review is still a research question, not a validated conclusion. See [validation and limits](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/docs/validation.md).

## Optional companion tools

For a product that chooses Raw SQL, these projects have independent responsibilities:

| Project | Responsibility |
| --- | --- |
| Alder | Review business meaning, continuity, and guarantees against Business Design. |
| [Raw SQL Rules](https://github.com/mk3008/raw-sql-rules) | A repository contract for reviewable Raw SQL construction: application-owned structure, with no arbitrary SQL syntax supplied by runtime input. |
| [Serene](https://github.com/mk3008/serene) | Make TypeScript Raw SQL construction easier to classify and triage while retaining native drivers and application-owned execution. |

Raw SQL Rules does not prescribe architecture or a framework. Serene is not an ORM, query builder, or mapper, and does not prove SQL meaning, authorization, or business behavior. Construction triage does not replace Alder review. They are optional companions, not a combined framework or Alder dependencies.

After adopting your selected Raw SQL Rules version, a product can add its SQL instructions to AGENTS.md without duplicating the plugin's review routing:

```text
For Raw SQL data-access work, read `rules/raw-sql-rules.md` and follow it as the repository contract.
```

For a TypeScript product also using Serene, follow its [AI adoption guide](https://github.com/mk3008/serene/blob/main/docs/ai-adoption.md) separately. Keep SQL meaning, binding, authorization, and business-behavior review even when construction is recognized as ordinary.
