# Alder — Talk with requesters through Business Design

English | [日本語](README.ja.md)

**Turn business work agreed on with requesters into a working system.**

Alder organizes a requester's requirements into **Business Design**, the shared language for the requester, designer, and AI, and uses the content agreed on by the requester and designer as **the source of truth (SSOT) for business intent** to connect it to Check Items, code, and tests.

No framework or runtime package is required.

## Install / Setup

Prepare an account and environment with the subscription and permissions needed to use ChatGPT / Codex. To install Alder, use Codex CLI and the ChatGPT desktop app with access to Plugins Directory. In a terminal, run the following command to register the marketplace from which you can install Alder:

```sh
codex plugin marketplace add mk3008/alder --ref 35dd2cec2fb173785f730a5c08d15c7fdfa85598
```

After running the command, restart the ChatGPT desktop app, open Plugins Directory, select **Alder development**, and install and enable **Alder**. Then start a new chat.

## Getting Started

To turn interview notes into Business Design, try sending the following prompt in the new chat:

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

Starting from this Business Design, you can check Business Design description quality, connections between business activities, and omissions, then create Check Items from the agreed work and continue to code and tests. See [Standard workflow](#standard-workflow) for the steps and [document structure](docs/business-design-structure.ja.md) for field meanings and the reasons for the structure.

## Standard workflow

Alder can be used to analyze existing work and explore hypotheses for new work. Through Business Design, you can align understanding with requesters and check whether the connected activities can operate coherently.

| Stage | What to ask AI to do | What people confirm or decide |
| --- | --- | --- |
| Authoring | Draft/revise Business Design from notes or requirements | Fidelity to source facts; answers to unresolved business conditions |
| Business Design review | Review Business Design description quality and connections between business activities; check for omissions when needed | Agreement on meaning, responsibility, exceptions, and guarantees |
| Check Item | Derive observable expectations from the agreed work | Confirm expectations and resolve items needing clarification or correction |
| System Requirements | Organize existing constraints and technical conditions | Constraints to preserve, cost/change risks, and technology preferences |
| Implementation | Create Code / Test from agreed Business Design / Check Items and technical conditions | Answer unresolved business decisions if they arise |
| post-implementation review | Read-only review in a separate agent or fresh context | Answer unresolved business questions; update design, implementation, and mappings in a separate follow-up |

The standard design business ends at **handoff to implementation after Business Design agreement and human Check Item review**. Then proceed through the development loop of implementation, independent review, and follow-up.

Alder Plugin can draft/revise and review Business Design and review implementation from short requests. Use the linked reference documents for Check Items, System Requirements, and the other steps.

### 1. Draft and answer questions

In the target project's chat, provide interview notes or requirements and ask, “Draft an Alder Business Design in `docs/business-design/`.” People confirm source facts and unresolved questions, answer them, and revise the same document.

Business Design is written in natural language with defined fields. **You do not need to memorize the format.** The skill divides the How of 5W1H into Input / Procedure / Output, with Exception as needed and Result for normal completion. A booking notification is Output; the established booking state is Result. Read the generated draft and check that it matches the work.

### 2. Review and agree with requesters

In a chat that can access the target Business Design, ask:

```text
Review this Business Design with Alder.
```

People answer questions about responsibility, conditions, exceptions, and guarantees, then update the design and review again. **The revision agreed on by the requester and designer is SSOT.** Do not add fields for quality requirements; write them in the relevant existing fields according to [each field's role](docs/business-design-structure.ja.md). Leave technical mechanisms to System Design.

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

In a new chat, make the design and implementation files accessible, identify their revisions and scope, and ask, “Review the code with Alder.”

The skill reads **Business Design → Decision Records → implementation / DDL / Test** without editing files, and reports evidence, business effects, classifications, and needed confirmation. People answer only unresolved business decisions. In a separate follow-up, update/re-agree Business Design first if meaning changes, then align Code / Test.

**People judge acceptance after addressing findings and checking Check ↔ Test/assertion evidence.** See [follow-up and traceability details](docs/check-item-traceability.md).

## Advanced

- **Find relationships worth reconsidering:** Use [Structural Discovery](docs/optimization-review.md#optional-structural-discovery-before-a-problem-is-known) to raise questions from confirmed business relationships. Structure alone does not establish a Problem; there is no dedicated Structural Optimization workflow.
- **Improve a concrete difficulty:** Record human-confirmed Problem / Pain level, then compare candidates with [Optimization Review](docs/optimization-review.md). People decide adoption; [update and re-agree Business Design](docs/business-design-improvement.ja.md) first.
- **Visualize or analyze the work:** Use the optional [Business Graph JSON v1 / CLI](docs/business-graph.md). JSON is an intermediate format; Business Design remains SSOT. Unapproved improvement candidates are not projected.

## Read more

### Versions and plugin scope

See [Plugin setup](docs/plugin-adoption.md) for versions, updates, client support, and [installation steps](docs/plugin-adoption.md#install-once). The installation example pins unreleased 0.2.8 to a commit. Bounded real-client checks confirmed short routing for Business Design authoring/review and code review under the tested client conditions. The stable `plugin-v0.1.0` tag provides implementation review only and contains no authoring or Business Design review skill. Use the [manual prompts](docs/adoption.md) without a plugin.

The standard `docs/business-design/` location needs no plugin-specific `AGENTS.md` configuration or copied knowledge. Identify a different path if used. For manual authoring, give AI the document structure and adoption guide.

**Plugin 0.2.8 packages three skills: Business Design drafting/revision, read-only Business Design review, and read-only post-implementation review.** Improvement proposals, Check Item drafting, graph export, and follow-up are not packaged skills. Use reference documents and prompts to ask AI to perform those stages.

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
