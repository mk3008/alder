# Alder — Talk with users through Business Design

English | [日本語](README.ja.md)

**Turn agreed business work into a working system.**

Alder is a workflow for organizing business requirements into **Business Design that users can read and agree on**, then connecting it to Check Items, code, and tests. You can confirm the work to build with users before delegating implementation to AI.

Business Design is a shared language written in natural language with defined fields. **People approve business intent; Business Design is the source of truth (SSOT).** No framework or runtime package is required.

## Install / Setup

```sh
codex plugin marketplace add mk3008/alder --ref 5cafd5109fe1a2b1806d2007aaa4309952de9418
```

Run this command, install and enable Alder, then start a new chat.

## Getting Started

To turn interview notes into Business Design, try sending this request to the Authoring Skill:

```text
Turn these interview notes into an Alder Business Design.

The users are registered local residents.
At return, the counter checks equipment numbers and accessories and records the return time.
Loan handover is confirmed by the signature and handover record;
return receipt is confirmed by the check and return-time record.
Returned sets await inspection by the maintenance staff.
```

You receive structured Business Design like this:

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

This structure has a purpose. See [document structure](docs/business-design-structure.ja.md) for the reasons. Continue to [Standard workflow](#standard-workflow) for the steps from design to implementation.

## Standard workflow

Alder can be used to analyze existing work and explore hypotheses for new work. Through Business Design, you can align understanding with users and check whether the connected activities can operate coherently.

| Stage | What to ask AI to do | What people confirm or decide |
| --- | --- | --- |
| Authoring | Draft/revise Business Design from notes or requirements | Fidelity to source facts; answers to unresolved business conditions |
| Business Design review | Review description quality, correlations, and optionally omissions | Agreement on meaning, responsibility, exceptions, and guarantees |
| Check Item | Derive observable expectations from the agreed work | Confirm expectations and resolve items needing clarification or correction |
| System Requirements | Organize existing constraints and technical conditions | Constraints to preserve, cost/change risks, and technology preferences |
| Implementation | Create Code / Test from agreed Business Design / Check Items and technical conditions | Answer unresolved business decisions if they arise |
| post-implementation review | Read-only review in a separate agent or fresh context | Answer unresolved business questions; update design, implementation, and mappings in a separate follow-up |

The standard design business ends at **handoff to implementation after Business Design agreement and human Check Item review**. Then proceed through the development loop of implementation, independent review, and follow-up.

Ask the Authoring Skill to draft and the Review Skill to review completed implementation. Give AI the linked reference documents for the other steps.

### 1. Draft and answer questions

Give interview notes or requirements to the Authoring Skill to draft the design in `docs/business-design/`. People confirm source facts and unresolved questions, answer them, and revise the same document.

**You do not need to memorize the format.** The skill divides the How of 5W1H into Input / Procedure / Output, with Exception as needed and Result for normal completion. A booking notification is Output; the established booking state is Result. Read the generated draft and check that it matches the work.

### 2. Review and agree with users

Provide the full design, revision, scope, and agreed decisions. Ask for [description-quality](docs/business-design-quality-check.ja.md) and [correlation](docs/business-design-correlation-check.ja.md) review.

People answer questions about responsibility, conditions, exceptions, and guarantees, then update the design and review again. **The user-agreed revision is SSOT.** Write quality requirements in the existing fields they constrain, without adding a separate Quality field. Leave technical mechanisms to System Design.

### 3. Draft Checks and have people confirm expectations

Give AI the agreed design and [Check Item guidance](docs/check-item-traceability.md). Ask for independently reviewable expectations. For example, confirm “concurrent requests must not establish overlapping bookings” as a condition/expected-result pair.

People assign `Unreviewed / Needs confirmation / Confirmed / Needs correction` (`未レビュー / 要確認 / 確認済み / 要修正`). Return undecided business conditions to design. **This stage is complete when confirmed items and unconfirmed candidates can be handed over separately.**

**Why passing Tests are not business approval:** Tests compare implementation with written expectations. People confirm whether those expectations describe the desired work, so human review state and Test evidence are separate.

### 4. State constraints as System Requirements

People provide existing constraints and preferences; ask AI to organize technical conditions implementation must preserve. Detailed technical investigation belongs to the product.

| State early | May be delegated to implementation |
| --- | --- |
| Existing infrastructure/DB/schema, required cloud/services, public APIs, migration/compatibility, security/legal obligations | Reversible class/function decomposition, internal modules, naming |
| Reasons for language or major-product preferences, such as maintenance, existing assets, or personal preference | Technology selection where no constraint or preference applies |

**Why not decide every technical choice up front:** Reversible choices can become concrete during implementation. First identify the properties, constraints, and change risks to preserve.

**Why a separate detailed-design stage is not mandatory:** Details can become concrete with DDL, SQL, Code / Test and be reviewed. Design costly changes, such as migrations or external contracts, early where necessary. See [the place of detailed design](docs/detailed-design.ja.md).

### 5. Hand the agreed design and Checks to AI

Identify the design revision, confirmed Check IDs, technical conditions, and current scope. Replace paths with actual product locations.

```text
Read the confirmed docs/business-design/meeting-room.md,
docs/checks/meeting-room.md, and the product's technical requirements.
Create/update code and executable tests for the agreed scope.
Follow existing development rules and verify confirmed Check conditions/results.
Return unresolved business decisions as questions to people; continue independent work.
Hand material assumptions, choices, and reasons to a separate-context review.
```

Pass Code / Test, verification results, and evidence for material choices in the agreed scope to the next review. Do not invent an undecided cancellation deadline in Test expectations; independent booking work may proceed.

### 6. Review in a separate context and separate follow-up

Give a fresh context the design/implementation revisions and scope. Ask the Review Skill to “Review this completed implementation with Alder.”

The skill reads **Business Design → Decision Records → implementation / DDL / Test** without editing files, and reports evidence, business effects, classifications, and needed confirmation. People answer only unresolved business decisions. In a separate follow-up, update/re-agree Business Design first if meaning changes, then align Code / Test.

**People judge acceptance after addressing findings and checking Check ↔ Test/assertion evidence.** See [follow-up and traceability details](docs/check-item-traceability.md).

## Advanced

- **Find relationships worth reconsidering:** Use [Structural Discovery](docs/optimization-review.md#optional-structural-discovery-before-a-problem-is-known) to raise questions from confirmed business relationships. Structure alone does not establish a Problem; there is no dedicated Structural Optimization workflow.
- **Improve a concrete difficulty:** Record human-confirmed Problem / Pain level, then compare candidates with [Optimization Review](docs/optimization-review.md). People decide adoption; [update and re-agree Business Design](docs/business-design-improvement.ja.md) first.
- **Visualize or analyze the work:** Use the optional [Business Graph JSON v1 / CLI](docs/business-graph.md). JSON is an intermediate format; Business Design remains SSOT. Unapproved improvement candidates are not projected.

## Read more

### Versions and plugin scope

See [Plugin setup](docs/plugin-adoption.md) for versions, updates, client support, and [installation steps](docs/plugin-adoption.md#install-once). The installation example pins unreleased 0.2.7 to a commit; client routing for the Authoring Skill has not been validated. The stable `plugin-v0.1.0` tag provides implementation review only and contains no authoring skill. Use the [manual prompts](docs/adoption.md) without a plugin.

The standard `docs/business-design/` location needs no plugin-specific `AGENTS.md` configuration or copied knowledge. Identify a different path if used. For manual authoring, give AI the document structure and adoption guide.

**Plugin 0.2.7 packages two skills: Business Design drafting/revision and read-only post-implementation review.** Description-quality/correlation/omission review, improvement proposals, Check Item drafting, graph export, and follow-up are not packaged skills. Use reference documents and prompts to ask AI to perform those stages.

The current main / PR specification is unreleased. Check Item design and human review are required in the standard design business; they were optional in released v0.6. The plugin version, Alder method release, and review knowledge v0.3 are distinct. Alder remains a research candidate overall; see [validation](docs/validation.md) for evidence and limits.

### Documents by purpose

| Need | Document |
| --- | --- |
| Interview and draft examples | [Interview](work/structural-discovery/issue-99/customer-transcript.md) / [Draft](work/structural-discovery/issue-99/design/v4.md) |
| Business description examples | [Booking](docs/examples/meeting-room-reservation.ja.md) / [Booking/cancellation](docs/examples/meeting-room-lifecycle.ja.md) |
| Field meanings, heading order, reference notation | [Document structure](docs/business-design-structure.ja.md) / [Field guidance](docs/adoption.md#business-design-format) / [Quality field mapping](docs/adoption.md#business-quality-requirements-belong-where-they-constrain-the-work) |
| Design-review examples and rationale | [Review case](docs/business-design-review.ja.md) / [Quality rationale](docs/business-design-quality-review.md) / [Functional consideration discovery](docs/behavior-derivation/functional-considerations.md) |
| Review descriptions, omissions, and correlations | [Quality](docs/business-design-quality-check.ja.md) / [Omissions](docs/business-design-omission-check.ja.md) / [Correlations](docs/business-design-correlation-check.ja.md) |
| Plugin installation, versions, and scope | [Plugin setup](docs/plugin-adoption.md) |
| Document locations, steps, copyable prompts | [Adoption guide](docs/adoption.md) |
| Timing of detailed design and technical decisions | [Detailed design](docs/detailed-design.ja.md) / [Decision examples](docs/philosophy.md#where-detailed-design-fits) |
| Business structure requirements and DB constraints | [Data modeling](docs/data-modeling.ja.md) / [English](docs/data-modeling.md) |
| Business improvement and adoption follow-up | [Improvement guidance](docs/business-design-improvement.ja.md) / [Purchase-improvement example](docs/examples/purchase-improvement.ja.md) |
| Check granularity, review states, Test mappings | [Check Item traceability](docs/check-item-traceability.md) |
| Implementation review and stopping conditions | [Review knowledge v0.3](docs/phase2/review-knowledge-v0.3.md) |
| JSON contract and exporter | [Business Graph](docs/business-graph.md) |
| Responsibility boundaries when using Alder | [Alder's own Business Design](business-design/alder/README.md) |
| User-facing explanations and safe reproducible evidence | [Research publication practice](docs/research-publication.md) |
| Rationale, adoption decisions, validation scope and limits | [Philosophy](docs/philosophy.md) / [Research decisions](docs/research-decisions.md) / [Validation](docs/validation.md) |

### Questions and improvement proposals

Open [GitHub Issues](https://github.com/mk3008/alder/issues) with the Alder version, target work, and question you want to resolve.
