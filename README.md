# Alder — Talk with users through Business Design

English | [日本語](README.ja.md)

**Turn agreed business work into a working system.**

Alder provides a workflow for organizing business requirements into **Business Design that users can read and confirm**, before AI implements them, and connecting the agreement to Check Items, code, and tests. AI reviews the description, connections between activities, and choices made concrete in implementation; only unresolved business decisions return to people.

This guide is for AI development users trying Alder for the first time. It takes you from interview notes to a draft, user agreement, implementation handoff, and review in a separate context. You do not need to memorize the format first. Use the skills and reference documents to organize the design, then have people confirm that it describes the actual work.

Business Design is natural language written with defined fields and description rules: a shared language for users, designers, and AI. **People approve business intent; Business Design is the source of truth (SSOT).** AI proposals and passing Tests do not supply that approval. No framework or runtime package is required.

## First minute — Turn interview notes into a draft

[Install Plugin 0.2.7, which includes the authoring skill](docs/plugin-adoption.md), start a new chat, and ask in ordinary language. The steps below explain unreleased installation and manual use.

```text
Turn these interview notes into an Alder Business Design.
Write the prose in the language the users can review.

We want meeting-room availability search, booking, changes, cancellation,
and management of unavailable/available rooms.
Overlapping bookings must not succeed.
If a booking cannot be changed, preserve the original booking.
We have not decided the cancellation deadline.
```

The skill organizes the notes into work and information exchanges and retains unresolved matters as questions. For this input, read the draft and questions separately:

| What is organized | Content in this example |
| --- | --- |
| Work (Activity) | Availability search, booking, changes, cancellation, availability management |
| Subjects handled (Object) | User, room register, booking register |
| Confirmed rules | Prevent overlapping bookings. Preserve the original booking when a change cannot succeed |
| Question for people | Until when is cancellation accepted? |

This illustrates the organization, not a complete Business Design or business approval. Answer the questions to revise the same draft, then check actual procedures, responsibility, and information transfers. See the [complete booking example](docs/examples/meeting-room-reservation.ja.md) and [booking/cancellation example](docs/examples/meeting-room-lifecycle.ja.md) (Japanese).

## Three-minute overview — From design to implementation review

Use Alder for existing work or a hypothesis for new work. Make the intended work concrete and check with users whether the connected activities can operate coherently.

| Stage | What to ask AI to do | What people confirm or decide |
| --- | --- | --- |
| Authoring | Draft/revise Business Design from notes or requirements | Fidelity to source facts; answers to unresolved business conditions |
| Business Design review | Review description quality, correlations, and optionally omissions | Agreement on meaning, responsibility, exceptions, and guarantees |
| Check Item | Derive observable expectations from the agreed work | Confirm expectations and resolve items needing clarification or correction |
| System Requirements | Organize existing constraints and technical conditions | Constraints to preserve, cost/change risks, and technology preferences |
| Implementation | Create Code / Test from agreed Business Design / Check Items and technical conditions | Answer unresolved business decisions if they arise |
| post-implementation review | Read-only review in a separate agent or fresh context | Answer unresolved business questions; update design, implementation, and mappings in a separate follow-up |

The standard design business ends at **handoff to implementation after Business Design agreement and human Check Item review**. Post-implementation Alder review and follow-up form a separate development loop. Detailed technical investigation for System Requirements is the product's responsibility.

**Plugin 0.2.7 packages two skills: Business Design drafting/revision and read-only post-implementation review.** Description-quality/correlation/omission review, improvement proposals, Check Item drafting, graph export, and follow-up are not packaged skills. The steps below use reference documents and prompts to ask AI to perform those stages.

## Five to ten minutes — Use Alder in your product

### 1. Prepare the plugin and document locations

| Version | Scope and entry point |
| --- | --- |
| Plugin 0.2.7 | Authoring/revision + implementation review. An unreleased package installed from a reviewed commit/branch containing this change |
| Stable tag `plugin-v0.1.0` | Implementation review only; no interview-to-design authoring skill |

To start with authoring, follow [Plugin setup](docs/plugin-adoption.md), select a revision containing 0.2.7, install/enable it, and start a new chat. Record the resolved commit when using a moving branch. The stable review-only entry point is:

```sh
codex plugin marketplace add mk3008/alder --ref plugin-v0.1.0
```

Plugin support and available marketplaces vary by client. GitHub distribution and public Plugins Directory publication are separate. Initial client validation covered 0.1.0 review; it does not establish client routing for the 0.2.7 authoring skill.

Keep Business Design in the product's conventional `docs/business-design/` directory, or retain an established equivalent location. The conventional path needs no Alder-specific `AGENTS.md` configuration or copied review knowledge for the plugin; identify a different path when necessary. For manual use, provide a readable Alder checkout or version-pinned references and use the [manual adoption prompts](docs/adoption.md).

### 2. Draft, then read the structure the skill organizes

Give the authoring skill notes or requirements, then answer its questions to revise the draft. For manual use, give AI readable [document-structure guidance](docs/business-design-structure.ja.md) and the [adoption guide](docs/adoption.md) and request a draft in the same format.

The draft organizes work as **Activity** and information, documents, registers, and external parties as **Object**. Activities use 5W1H, with How divided into **Input / Procedure / Output**, an Exception when needed, and **Result** for the state established after normal completion.

For booking, Output is the registered booking information and the result communicated to the user; Result is the established booking that lets the user prepare for the meeting. Read the generated fields to check what is received, who decides, and what becomes true.

Activity / Object Scope describes responsibility boundaries; Object.Information describes business information. Avoid splitting continuous work excessively. Connect independently triggered work through its actual When and information exchanges via Objects. Document order is not execution order; exception returns are separate from normal I/O. See [document structure](docs/business-design-structure.ja.md) for field meanings, heading order, and reference notation, and the [adoption field table](docs/adoption.md#business-design-format) for details.

### 3. Review Business Design and agree with users

A well-formatted draft still needs confirmation of business meaning. Provide the full design, revision, scope, and agreed decisions, then use these documents' prompts:

1. [Description-quality check](docs/business-design-quality-check.ja.md): actors, field roles, Input / Procedure / Output consistency
2. [Correlation check](docs/business-design-correlation-check.ja.md): Result and When across activities, information transfers, units of work, authority, exceptions, and recovery
3. Optional [omission check](docs/business-design-omission-check.ja.md): questions about concrete scenarios whose outcomes differ

Separate wording corrections that preserve meaning from questions requiring business judgment. Apply users' decisions to Business Design, review again, and keep the agreed revision as SSOT. See the [quality-review rationale](docs/business-design-quality-review.md), [review case](docs/business-design-review.ja.md), and [optional functional consideration discovery](docs/behavior-derivation/functional-considerations.md).

Write business quality requirements here too: deadlines, continuity, retry invariants, authority, and traceability. **Do not add a separate Quality field.** Use the Procedure / Exception / Result / Who / Object.Information field the condition constrains. A desired condition is different from an observed Problem / Pain. System Design chooses technical mechanisms such as topology or encryption. See the [field mapping and examples](docs/adoption.md#business-quality-requirements-belong-where-they-constrain-the-work).

### 4. Draft Check Items and have people confirm expectations

Give AI the [adoption guide](docs/adoption.md) and [Check Item guidance](docs/check-item-traceability.md). Ask it to derive independently reviewable observable expectations from the agreed Business Design.

| ID | Title | Expected result | Review state |
| --- | --- | --- | --- |
| MR-001 | Overlapping bookings cannot succeed for one room | Concurrent requests do not establish multiple bookings for the same room with overlapping time intervals | Unreviewed |
| MR-002 | The original booking survives a failed change | When change conditions are not satisfied, the original booking remains intact | Unreviewed |

This is part of a list derived from booking/change activities. People read the title, expectation, and necessary conditions and update `Unreviewed / Needs confirmation / Confirmed / Needs correction` (`未レビュー / 要確認 / 確認済み / 要修正`). If business meaning is undecided, return to Business Design rather than decide in the Check; update it after agreement. Human review state is separate from AI confidence and Test evidence strength.

**Why passing Tests are not business approval:** Tests show that implementation matches the written expectation under the tested conditions. People must confirm whether that expectation is what users need. Code and Tests must not turn an unapproved expectation into policy; distinguish confirmed items from unconfirmed candidates.

### 5. State constraints to preserve as System Requirements

Alongside business requirements, state technical conditions implementation must respect, including existing infrastructure, databases, and published contracts. You need not fill in every technical decision first.

| Treatment | Examples |
| --- | --- |
| State early when constrained or costly to change | Existing infrastructure or DB/schema compatibility, required cloud/services, public APIs, migration/compatibility, security or legal obligations |
| State preferences or organizational reasons | Language, database product, major libraries. Without a maintenance, existing-asset, or preference reason, implementation may choose |
| Usually delegate to implementation and review | Class/function decomposition, internal modules, naming, and other reversible local choices |

A service required by a business contract may also be a business condition; a replaceable mechanism is a technical choice. State the reason, not only the name. Architecture names are not required either. A property such as “test the core without external I/O” helps implementation select a structure. Explicit standards or justified styles remain constraints.

**Why not settle every technical choice or require an independent detailed-design stage:** Reversible details can become concrete alongside actual DDL, SQL, Code, and Test and remain reviewable afterward. Design hard-to-reverse migrations, external contracts, or cutovers early where necessary. AI's ability to rewrite code does not remove persistent-data or external-contract change costs. See [detailed-design guidance](docs/detailed-design.ja.md) and the [rationale and examples](docs/philosophy.md#where-detailed-design-fits).

Data modeling is also a downstream design choice based on business-side structural requirements, System Requirements, and existing DB constraints. Table definitions need not be settled before business agreement; normalization and database constraints remain useful design knowledge. See [data modeling](docs/data-modeling.ja.md).

### 6. Hand the agreed design and Checks to AI

Identify the Business Design revision, confirmed Check IDs, technical conditions, and implementation scope. Replace the example paths with your established document locations and development conventions.

```text
Read the confirmed docs/business-design/meeting-room.md,
docs/checks/meeting-room.md, and the product's technical requirements.
Implement the agreed scope using the existing development rules.
Create/update code and executable tests that verify the conditions and
expected results of confirmed Check Items.
Do not decide unresolved business rules; return concrete questions to people.
Continue independent work and hand material assumptions, choices, and reasons
to the later review.
```

For example, do not invent a cancellation deadline in Test expectations while it is undecided. Retain that question without stopping independent, agreed booking work indiscriminately. Record material reasons in Decision Records or equivalent evidence; those records do not replace business approval.

### 7. Review in a separate context and separate follow-up

After implementation and product verification, give a separate agent or fresh context the design and implementation revisions and scope. With a plugin that supports the review skill, ask:

```text
Review the completed implementation with Alder.
The scope is the current meeting-room booking change.
Use the attached references for the design and implementation revisions/scope.
```

The skill reads **Business Design → Decision Records → implementation / DDL / Tests**, leaves files unchanged, and reports evidence, business effects, classifications, and needed confirmation. Manual [post-implementation review prompts](docs/adoption.md) and [review knowledge v0.3](docs/phase2/review-knowledge-v0.3.md) are also available.

Distinguish mismatches, Business confirmation, technical improvements, and sufficient behavior. Return only unresolved business decisions to the responsible people. In a separate follow-up, update/re-agree Business Design first if meaning changes, then change Code / Test as needed. Check and maintain Check ↔ representative Test/assertion mappings and evidence gaps there. Permanent traceability stops at **Business Design ↔ Check Item ↔ Test**; do not maintain Check ↔ Code-location mappings. Tests verify Code by execution.

## When needed — Business improvement and Business Graph

With confirmed current-state relationships, optional [Structural Discovery](docs/optimization-review.md#optional-structural-discovery-before-a-problem-is-known) can raise grounded questions about relationships worth reconsidering. Zero observations is valid; structure alone does not establish a Problem, burden, or benefit. There is no dedicated Structural Optimization workflow.

For a concrete difficulty in otherwise viable work, optionally record the human-confirmed **Problem / Pain level** pair after an Activity's Result, then use [Optimization Review](docs/optimization-review.md). Repeated purchasing and recording for individual requests might lead to comparisons of batching, automation, or outsourcing. The [purchase-improvement example](docs/examples/purchase-improvement.ja.md) shows expected benefit, Scope, business-change Difficulty, and pre-adoption questions.

People decide whether to adopt a candidate. Candidate / Difficulty / Confidence and similar proposal information are unapproved, not current specification or Graph facts. **Update and re-agree Business Design first** before changing Checks or implementation. Keep current work if no useful candidate emerges. See [improvement guidance](docs/business-design-improvement.ja.md).

For external visualization or analysis, use the optional [Business Graph JSON v1 / CLI](docs/business-graph.md). JSON is an intermediate format; Business Design remains SSOT. It projects explicit Business / Object Scope and recorded Problem / Pain, not unapproved candidates. Procedure is outside the projection; syntax success does not approve business meaning. Exporting or storing JSON is not a standard design-completion condition. Feed corrections found with external tools back into Business Design.

## Read more

| Need | Document |
| --- | --- |
| Field meanings, heading order, reference notation | [Business Design structure](docs/business-design-structure.ja.md) |
| Review descriptions, omissions, and correlations | [Quality](docs/business-design-quality-check.ja.md) / [Omissions](docs/business-design-omission-check.ja.md) / [Correlations](docs/business-design-correlation-check.ja.md) |
| Plugin installation, versions, and scope | [Plugin setup](docs/plugin-adoption.md) |
| Document locations, steps, copyable prompts | [Adoption guide](docs/adoption.md) |
| Timing of detailed design and technical decisions | [Detailed design](docs/detailed-design.ja.md) |
| Business structure requirements and DB constraints | [Data modeling](docs/data-modeling.ja.md) / [English](docs/data-modeling.md) |
| Business improvement and adoption follow-up | [Improvement guidance](docs/business-design-improvement.ja.md) |
| Check granularity, review states, Test mappings | [Check Item traceability](docs/check-item-traceability.md) |
| Implementation review and stopping conditions | [Review knowledge v0.3](docs/phase2/review-knowledge-v0.3.md) |
| JSON contract and exporter | [Business Graph](docs/business-graph.md) |
| Responsibility boundaries when using Alder | [Alder's own Business Design](business-design/alder/README.md) |
| User-facing explanations and safe reproducible evidence | [Research publication practice](docs/research-publication.md) |
| Rationale, adoption decisions, validation scope and limits | [Philosophy](docs/philosophy.md) / [Research decisions](docs/research-decisions.md) / [Validation](docs/validation.md) |

This README describes the unreleased main / PR specification. Check Item design and human review are required in the standard design business; they were optional in released v0.6. The plugin version, Alder method release, and review knowledge v0.3 are distinct. Alder remains a research candidate overall; see [validation](docs/validation.md) for evidence and limits.

## Questions and improvement proposals

Open [GitHub Issues](https://github.com/mk3008/alder/issues) with the Alder version, target work, and question you want to resolve.
