# Alder — Talk with users through Business Design

English | [日本語](README.ja.md)

**Turn agreed business work into a working system.**

Alder provides a workflow for organizing business requirements into **Business Design that users can read and confirm**, before AI implements them, and connecting the agreement to Check Items, code, and tests. AI reviews the description, connections between activities, and choices made concrete in implementation; only unresolved business decisions return to people.

Business Design is natural language written with defined fields and description rules: a shared language for users, designers, and AI. **People approve business intent; Business Design is the source of truth (SSOT).** AI proposals and passing Tests do not supply that approval. No framework or runtime package is required.

## Turn interview notes into a draft

Give interview notes to the installed Authoring Skill with a short request:

```text
Turn these interview notes into an Alder Business Design.

The users are registered local residents.
At return, the counter checks equipment numbers and accessories and records the return time.
Loan handover is confirmed by the signature and handover record;
return receipt is confirmed by the check and return-time record.
Returned sets await inspection by the maintenance staff.
```

Refine the draft by answering the skill's questions. A tool-return activity can be described as follows (partial Activity, translated from Japanese):

```markdown
# Activity Receive returned tools

## When

When a resident returns borrowed tools.

## Who

Counter

## How

### Input

- Registered local resident — Returned tools and accessories
- Loan/return record — Loaned equipment numbers and handover record

### Procedure

1. The counter compares the loaned number with the returned equipment number and accessories and records the return time. The recording medium is unconfirmed.
2. Returned sets await maintenance inspection. The specific handoff method is unconfirmed.

### Output

- Loan/return record — Check results and return-time record
- Organization's tools — Returned sets awaiting inspection

## Result

Receipt is confirmed by the equipment-number/accessory check and return-time record; the sets await maintenance inspection.
```

The recording medium and handoff method remain unconfirmed for people to answer. Output varies between runs, and this draft is not business-approved. Also see the [booking](docs/examples/meeting-room-reservation.ja.md) and [booking/cancellation](docs/examples/meeting-room-lifecycle.ja.md) examples.

## From design to implementation review

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

## Use Alder in your product

### 1. Prepare the plugin and document locations

Follow [Plugin setup](docs/plugin-adoption.md). For authoring/revision, install and enable a **reviewed commit/branch containing 0.2.7**, then start a new chat. Version 0.2.7 is unreleased; the stable `plugin-v0.1.0` tag provides implementation review only.

```sh
codex plugin marketplace add mk3008/alder --ref plugin-v0.1.0
```

Keep Business Design in the product's `docs/business-design/`: the plugin needs no dedicated `AGENTS.md` configuration or copied knowledge there. Identify a different path if used. **Preparation is complete when AI can read the target documents and revisions.** The [manual adoption prompts](docs/adoption.md) work without a plugin too. Plugin setup holds the version, update, client-support, and validation details.

### 2. Draft and answer questions

Give interview notes or requirements to the Authoring Skill to draft the design. People confirm source facts and unresolved questions, answer them, and revise the same document.

The skill organizes work as Activity and information, documents, registers, and external parties as Object. It divides the How of 5W1H into Input / Procedure / Output, with Exception as needed and Result for normal completion. A booking notification is Output; the established booking state is Result. Prepare **a draft people can read and check without memorizing the format**.

See [document structure](docs/business-design-structure.ja.md) and the [field guidance](docs/adoption.md#business-design-format) for fields, Scope / Information, When, exceptions, and information connections. Give the same references to AI for manual authoring.

### 3. Review and agree with users

Provide the full design, revision, scope, and agreed decisions. Ask for [description-quality](docs/business-design-quality-check.ja.md) and [correlation](docs/business-design-correlation-check.ja.md) review, plus an optional [omission check](docs/business-design-omission-check.ja.md) when needed.

People answer questions about responsibility, conditions, exceptions, and guarantees, then update and review again. **The user-agreed revision is SSOT.** Include business quality requirements in the Procedure / Exception / Result / Who / Object.Information field they constrain, rather than a separate Quality field; leave mechanisms to System Design. See the [field mapping](docs/adoption.md#business-quality-requirements-belong-where-they-constrain-the-work).

The [review case](docs/business-design-review.ja.md), [quality rationale](docs/business-design-quality-review.md), and [optional functional consideration discovery](docs/behavior-derivation/functional-considerations.md) provide details.

### 4. Draft Checks and have people confirm expectations

Give AI the agreed design and [Check Item guidance](docs/check-item-traceability.md). Ask for independently reviewable expectations. For example, confirm “concurrent requests must not establish overlapping bookings” as a condition/expected-result pair.

People assign `Unreviewed / Needs confirmation / Confirmed / Needs correction` (`未レビュー / 要確認 / 確認済み / 要修正`). Return undecided business conditions to design. **This stage is complete when confirmed items and unconfirmed candidates can be handed over separately.**

**Why passing Tests are not business approval:** Tests compare implementation with written expectations. People confirm whether those expectations describe the desired work, so human review state and Test evidence are separate.

### 5. State constraints as System Requirements

People provide existing constraints and preferences; ask AI to organize technical conditions implementation must preserve. **This is complete when required constraints and delegated choices are clear.**

| State early | May be delegated to implementation |
| --- | --- |
| Existing infrastructure/DB/schema, required cloud/services, public APIs, migration/compatibility, security/legal obligations | Reversible class/function decomposition, internal modules, naming |
| Reasons for language or major-product preferences, such as maintenance, existing assets, or personal preference | Technology selection where no constraint or preference applies |

No architecture name is required first: state properties or risks to protect. Distinguish business-contract constraints from technical mechanisms by the reason for using a service.

**Why a separate detailed-design stage is not mandatory:** Reversible details can become concrete with DDL, SQL, Code / Test and be reviewed afterward. Design costly changes, such as migrations or external contracts, early where necessary. See [detailed design](docs/detailed-design.ja.md) and the [decision examples](docs/philosophy.md#where-detailed-design-fits). Data modeling is also downstream design from business/system requirements and existing DB constraints; see its [position](docs/data-modeling.ja.md).

### 6. Hand the agreed design and Checks to AI

Identify the design revision, confirmed Check IDs, technical conditions, and current scope. Replace paths with actual product locations.

```text
Read the confirmed docs/business-design/meeting-room.md,
docs/checks/meeting-room.md, and the product's technical requirements.
Create/update code and executable tests for the agreed scope.
Follow existing development rules and verify confirmed Check conditions/results.
Return unresolved business decisions as questions to people; continue independent work.
Hand material assumptions, choices, and reasons to a separate-context review.
```

**Proceed to review when Code / Test, verification results, and evidence for material choices are available for the agreed scope.** Do not invent an undecided cancellation deadline in Test expectations; independent booking work may proceed. Handoff completes the standard design business; implementation and post-implementation review form a separate development loop.

### 7. Review in a separate context and separate follow-up

Give a separate AI agent or fresh context the design/implementation revisions and scope. Ask the Review Skill to “Review this completed implementation with Alder.”

The skill reads **Business Design → Decision Records → implementation / DDL / Test** without editing files, and reports evidence, business effects, classifications, and needed confirmation. People answer only unresolved business decisions. In a separate follow-up, update/re-agree Business Design first if meaning changes, then align Code / Test.

**Judge acceptance after addressing findings and checking Check ↔ Test/assertion evidence.** Permanent traceability stops at Business Design ↔ Check Item ↔ Test; do not maintain Check ↔ Code-location tables. See [review knowledge](docs/phase2/review-knowledge-v0.3.md), [manual prompts/follow-up](docs/adoption.md), and [traceability details](docs/check-item-traceability.md).

## When needed — Business improvement and Business Graph

With confirmed current-state relationships, optional [Structural Discovery](docs/optimization-review.md#optional-structural-discovery-before-a-problem-is-known) can raise grounded questions about relationships worth reconsidering. Zero observations is valid; structure alone does not establish a Problem, burden, or benefit. There is no dedicated Structural Optimization workflow.

For a concrete difficulty in otherwise viable work, optionally record the human-confirmed **Problem / Pain level** pair after an Activity's Result, then use [Optimization Review](docs/optimization-review.md). Repeated purchasing and recording for individual requests might lead to comparisons of batching, automation, or outsourcing. The [purchase-improvement example](docs/examples/purchase-improvement.ja.md) shows expected benefit, Scope, business-change Difficulty, and pre-adoption questions.

People decide whether to adopt a candidate. Candidate / Difficulty / Confidence and similar proposal information are unapproved, not current specification or Graph facts. **Update and re-agree Business Design first** before changing Checks or implementation. Keep current work if no useful candidate emerges. See [improvement guidance](docs/business-design-improvement.ja.md).

For external visualization or analysis, use the optional [Business Graph JSON v1 / CLI](docs/business-graph.md). JSON is an intermediate format; Business Design remains SSOT. It projects explicit Business / Object Scope and recorded Problem / Pain, not unapproved candidates. Procedure is outside the projection; syntax success does not approve business meaning. Exporting or storing JSON is not a standard design-completion condition. Feed corrections found with external tools back into Business Design.

## Read more

| Need | Document |
| --- | --- |
| Interview and draft examples | [Interview](work/structural-discovery/issue-99/customer-transcript.md) / [Draft](work/structural-discovery/issue-99/design/v4.md) |
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

The current main / PR specification is unreleased. Check Item design and human review are required in the standard design business; they were optional in released v0.6. The plugin version, Alder method release, and review knowledge v0.3 are distinct. Alder remains a research candidate overall; see [validation](docs/validation.md) for evidence and limits.

## Questions and improvement proposals

Open [GitHub Issues](https://github.com/mk3008/alder/issues) with the Alder version, target work, and question you want to resolve.
