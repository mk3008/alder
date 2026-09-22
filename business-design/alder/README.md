# Alder development — Business Design

<!-- alder-business-graph: 1 -->

This describes Alder's own development work, including its optional practices. Business Design is the SSOT for operational intent; Code, Test, Checks, Decisions and generated Graph JSON do not replace it. This initial description is submitted for human review in Issue #79; export or passing tests do not mark it human-approved.

The activities describe responsibilities, not a mandatory sequential pipeline. A single person can hold multiple roles. **Who is the worker for the activity**; the `requester` Object is the external party from whom that worker receives intent or to whom they return questions/results. The same person can participate in both capacities without making the roles equivalent.

Sources for the existing operating rules: [adoption](../../docs/adoption.md), [review knowledge v0.3](../../docs/phase2/review-knowledge-v0.3.md), [Check traceability](../../docs/check-item-traceability.md), [optional drift pilot](../../docs/traceability-drift/study.md), [research decisions](../../docs/research-decisions.md). Identifiers and explicit Object references below annotate the recommended 5W1H / Input → Procedure → Output format for deterministic export; the generated JSON is not edited by hand.

# Scope

Develop and maintain Alder's guidance, research evidence and optional tools: define business intent, choose technical means, optionally derive Checks and Test plans, implement, optionally inspect drift, verify, independently review, evaluate research changes and deliver approved changes. Graph export is an optional projection of this design. UI/Viewer design, layout, billing, automatic business approval, mandatory use of optional research practices and permanent Check-to-Code location mappings are outside scope. No product database or production service is operated by this development workflow.

# Object requester — System requester / domain expert

## Icon

users

# Object business-design — Business Design

## Icon

file-text

# Object knowledge — Alder guidance and review knowledge

## Icon

book-open

# Object decisions — Decision Records

## Icon

notebook-pen

# Object checks — Check Items and optional Functional Interfaces

## Icon

list-checks

# Object test-plan — Test design

## Icon

clipboard-list

# Object code — Code

## Icon

file-code

# Object tests — Test

## Icon

flask-conical

# Object drift-metadata — Opt-in source/Check/Test pins and current Test inventory

## Icon

fingerprint

# Object drift-report — Drift candidates

## Icon

scan-search

# Object verification — Verification results

## Icon

clipboard-check

# Object review — Fresh review findings

## Icon

messages-square

# Object research — Research evidence and adoption decisions

## Icon

microscope

# Object delivery — Pull request / release

## Icon

git-pull-request

# Object graph — Generated Business Graph JSON

## Icon

workflow

# Activity business-design-work — Business design

## What

Describe and maintain Alder's development work and its intended outcomes.

## Why

Keep business meaning, authority and guarantees explicit at the source before downstream artifacts rely on a changed decision.

## When

A requester supplies a new objective, or review or research exposes a concrete unresolved business choice or a requested change.

## Who

The responsible human designer, assisted by an AI drafting agent; the responsible human confirms business meaning.

## Where

The repository's Business Design and associated human review discussion.

## How

### Input

- [requester]: Objectives, operational constraints and human business decisions
- [business-design]: Current intent, Scope and activity correlations
- [review]: Concrete unresolved business questions and effects on downstream guarantees
- [research]: Evidence and limits relevant to a proposed change in operating practice

### Procedure

1. Read the whole applicable design and identify work through What, Why, When, Who, Where and Input → Procedure → Output.
2. Walk connected work to check that preceding results and subsequent conditions agree. Do not require every future policy to be settled before coding.
3. Return consequential unresolved choices to the responsible human. Keep a draft visibly unapproved; a test or Decision is not approval.
4. When meaning changes, update and obtain human confirmation of Business Design first, then revise affected downstream Checks, Decisions, Tests and Code. Ordinary reversible technical choices may proceed without business escalation.

### Output

- [business-design]: Current design with confirmed meaning distinguished from unresolved scope or draft proposals
- [requester]: Concrete choices needing a human decision, or the updated design for confirmation

# Activity system-design — System design

## What

Choose technical means within Alder's current business intent and task constraints.

## Why

Make implementation feasible and reviewable without inventing business policy or prescribing an architecture name.

## When

A development task needs technical choices or new evidence changes an existing technical assumption.

## Who

The implementation AI or developer accountable for the delegated technical work.

## Where

Repository and task discussion; material choices in Decision Records.

## How

### Input

- [business-design]: Applicable intent, Scope, constraints and explicitly foreseen risks
- [knowledge]: Guidance for bounded technical reasoning and error-resistant operation
- [decisions]: Existing technical choices and their limits
- [code]: Current implementation constraints

### Procedure

1. Reason from requirements, data, risks and existing evidence; select an adequate minimal approach.
2. Bound optional evaluation to uncertainty that could change the decision. Do not impose layers, an architecture label or a new runtime without a concrete need.
3. Record material assumptions and technical decisions. If alternatives change unresolved business meaning, return that question to Business design.

### Output

- [decisions]: Technical choices, rationale, assumptions, evidence and stopping conditions

# Activity check-design — Check Item design and confirmation

## What

Optionally derive and review observable expectations from the whole Business Design.

## Why

Make requirements review and representative test coverage easier to navigate where the added maintenance is justified.

## When

Business Design and its activity-correlation review are ready, and the task benefits from Check Items or optional Functional Interfaces.

## Who

An AI drafts; responsible human designers/requesters review, correct and complete the expectations.

## Where

Repository Check list and human review discussion.

## How

### Input

- [business-design]: Whole applicable design, activity conditions and guarantees
- [knowledge]: c3 derivation, optional functional consideration discovery and traceability guidance
- [decisions]: Already settled choices and shared contracts
- [requester]: Human corrections and review decisions on expectations

### Procedure

1. Draft independently reviewable expectations with evidence and stable IDs; do not turn externally prompted unapproved candidates into test assertions.
2. Keep human review state separate from AI confidence and test evidence. Use unreviewed / needs confirmation / confirmed / needs correction states.
3. If a correction changes meaning, return to Business design first. Preserve guarantees when splitting or regrouping Checks.
4. Use a Functional Interface only where it clarifies responsibility. Maintain Business Design ↔ Check ↔ Test traceability; do not maintain Check-to-Code locations.

### Output

- [checks]: Human-facing expectations with review state and supporting evidence, plus optional responsibility index
- [requester]: Only remaining concrete business choices needing confirmation

# Activity test-design — Test design

## What

Plan observable assertions and relevant verification cases for the delegated change.

## Why

Verify behavior against the current business intent rather than merely reproducing the implementation's choices.

## When

An implementable change has testable expectations; if Check Items are used, their human review is complete.

## Who

The AI or developer responsible for test design.

## Where

Repository tests, task plan or existing Check/Test mapping.

## How

### Input

- [business-design]: Current intended outcomes and boundaries
- [checks]: Human-completed expectations and supporting detail, when the optional Check workflow is used
- [tests]: Existing assertions and relevant regression coverage
- [decisions]: Technical constraints and assumptions affecting verification

### Procedure

1. Select representative normal, boundary, failure and continuation cases relevant to the changed guarantees.
2. Separate automated evidence from human approval and identify gaps rather than assuming passing tests establish completeness.
3. When Checks are used, map the design/list revision and Check ID to representative test assertions. Do not require a separate maintained test-plan file where the existing test or Check artifacts suffice.

### Output

- [test-plan]: Planned cases, observable expectations, representative assertions and known evidence gaps

# Activity implementation — Implementation

## What

Implement and maintain Alder's guidance, executable tools and tests for the delegated task.

## Why

Make the intended work executable or usable and expose concrete choices for subsequent review.

## When

The task has sufficient business direction and technical constraints to proceed; complete prior resolution of every future choice is not required.

## Who

The implementation AI or developer.

## Where

An isolated repository branch and local execution environment.

## How

### Input

- [business-design]: Authoritative current intent and unresolved boundaries
- [decisions]: Technical choices and assumptions
- [test-plan]: Relevant assertions and verification cases
- [code]: Existing implementation
- [tests]: Existing executable tests
- [knowledge]: Existing published guidance that the task may update
- [review]: Confirmed mismatches or accepted technical improvements to address

### Procedure

1. Implement within the delegated scope and existing design; record material assumptions.
2. Write or update relevant tests without weakening expectations merely to pass.
3. Preserve historical research evidence. A proposed permanent guidance change needs its supporting evidence and disposition.
4. If implementation reveals unresolved business meaning, return the concrete question to Business design rather than authoring hidden policy in Code or Test.

### Output

- [code]: Changed implementation for review
- [tests]: Executable assertions for the changed behavior
- [knowledge]: Proposed guidance updates, when authorized by the task
- [decisions]: Material implementation choices and remaining limits

# Activity drift-inspection — Drift inspection

## What

Optionally detect outdated source/Check/Test relationships and select reconfirmation candidates.

## Why

Expose omitted synchronization after source edits without confusing text freshness with business correctness.

## When

A bounded opt-in pilot is in use and its identified source items, Checks or current Test inventory change.

## Who

The developer or AI operating the read-only detector and interpreting its candidates.

## Where

The optional drift pilot and its supplied fixture/product adapter.

## How

### Input

- [business-design]: Current identified source items supported by the selected pilot adapter
- [checks]: Current Check bodies
- [drift-metadata]: Reconciled source/Check/Test fingerprints and Test IDs from current runner discovery

### Procedure

1. Compute freshness and reference mismatches without changing pins or human review state.
2. Select stale or missing relationships for reconfirmation, not automatic defect classification.
3. Reconcile affected Checks with their source. An unchanged Check body does not require refreshing matching Test pins solely because a source was reconfirmed.
4. Reconcile changed Check expectations with Tests; update pins only after the separate reconciliation is complete. A matching hash does not prove semantic coverage.
5. This remains an optional bounded pilot, not a mandatory checker or universal Markdown adapter.

### Output

- [drift-report]: Stale/missing/mapping candidates and reasons, distinct from product defects
- [drift-metadata]: Only separately reconciled pins; detector execution itself never acknowledges them

# Activity verification-work — Test / verification

## What

Execute relevant tests and gates, and reproduce bounded research observations when the task requires them.

## Why

Establish actual implementation evidence and report its limits before a change is delivered.

## When

Implementation changes are ready for verification, or changed expectations require regression testing.

## Who

The implementing developer or AI and the configured CI runner.

## Where

Local temporary test environments and repository CI.

## How

### Input

- [code]: Current implementation under test
- [tests]: Executable test suite
- [test-plan]: Required cases and expected observations
- [drift-report]: Impact candidates to inspect when the opt-in pilot is used

### Procedure

1. Run relevant tests against current Code; capture actual results including failures.
2. Resolve implementation defects within scope and rerun relevant checks. Keep research scenarios expecting deliberate failures distinct from product success.
3. Do not equate a passing suite with business approval, complete coverage or correct source-to-test meaning. Stop optional evaluation when sufficiently supported.

### Output

- [verification]: Passed/failed checks, observed behavior, reproduction instructions and remaining verification gaps

# Activity fresh-review — Fresh review

## What

Independently review the concrete implementation choices against Business Design.

## Why

Detect definite mismatches and narrow unresolved business meaning into questions that people can decide.

## When

An implementation or material revision is available for review with its source design and Decisions.

## Who

A separate AI reviewer or fresh context; responsible humans decide unresolved business meaning.

## Where

Repository diff and review discussion.

## How

### Input

- [business-design]: Current business intent, Scope and correlations
- [decisions]: Recorded implementation choices and assumptions
- [knowledge]: Selected review knowledge version and its stopping boundaries
- [code]: Business meaning made concrete in implementation
- [tests]: Assertions as evidence of chosen behavior
- [verification]: Observed test/gate results and limitations

### Procedure

1. Read Business Design → Decisions → implementation and Tests.
2. Walk representative work and trace concrete implementation choices back to their source using Q1–Q3 / P1 / P2 / S.
3. Classify definite mismatches, business confirmation, technical improvement or sufficient behavior without imposing unrelated architecture or future scope.
4. Return only unresolved consequential business choices to people. If meaning changes, Business Design is corrected and confirmed before downstream artifacts.

### Output

- [review]: Findings with concrete conditions, effects, source evidence and classification, including sufficient behavior
- [requester]: Unresolved business choices requiring the responsible human's judgment

# Activity research-evaluation — Research evaluation

## What

Evaluate proposed changes to Alder's practices and record whether evidence justifies adoption.

## Why

Keep operating guidance grounded in bounded evidence and preserve the distinction between observations and general claims.

## When

A task proposes a practice change or a documented reconsideration condition is met.

## Who

The research developer or AI; the maintainer decides adoption of proposed permanent guidance.

## Where

Repository research docs and work artifacts.

## How

### Input

- [requester]: Research objective and permitted evaluation scope
- [knowledge]: Current practice and candidate change
- [research]: Existing results, limits and reconsideration conditions
- [verification]: Relevant reproducible observations
- [review]: Review findings relevant to the candidate

### Procedure

1. Reason from existing evidence and bound the experiment to a decision-relevant uncertainty.
2. Preserve prompts, source revisions and outcomes required to reproduce the stated observation; distinguish Fresh evaluation from reused context.
3. Record adoption, rejection or insufficient evidence with reasons and limits in the research decision index. Do not silently turn an experimental result into a universal rule.

### Output

- [research]: Evidence, disposition, reasons, limits and reconsideration conditions
- [decisions]: Task-specific evaluation choices and reason for stopping

# Activity delivery-work — Delivery

## What

Present reviewed changes for human acceptance and publish approved repository changes or releases.

## Why

Make the actual scope, evidence and remaining limits reviewable before adoption.

## When

A task is ready for a pull request, or the maintainer explicitly authorizes merge or release after review.

## Who

The implementing agent prepares the change; the maintainer authorizes acceptance/release, and the authorized agent or release workflow executes it.

## Where

GitHub pull requests and the repository release workflow.

## How

### Input

- [code]: Proposed executable changes
- [tests]: Updated regression tests
- [knowledge]: Proposed guidance/documentation changes
- [verification]: Relevant local and CI verification results
- [review]: Fresh review outcome and remaining limitations
- [research]: Adoption evidence for a practice change, when applicable
- [requester]: Human acceptance and explicit merge/release authorization when those actions are requested

### Procedure

1. Describe the problem, changed behavior, evidence and remaining limitations in the pull request.
2. Address review findings and rerun affected verification. A prepared PR is not a merged or released change.
3. Merge or release only within the human authorization; preserve release identity and prevent overwriting an existing release/tag.

### Output

- [delivery]: Reviewable pull request, and merged/released revision only when authorized
- [requester]: Outcome, verification status and unresolved limitations

# Activity graph-export — Business Graph export

## What

Project an explicitly annotated Business Design into versioned Business Graph JSON.

## Why

Make the documented activity/Object correlations machine-readable without creating another authority or maintaining the same meaning twice.

## When

A developer requests a projection or the source design changes and its checked-in example must be regenerated.

## Who

The developer or AI invoking the optional export CLI.

## Where

Local repository or CI; no network or external service is required.

## How

### Input

- [business-design]: Annotated 5W1H source including independent Objects, labeled Input/Output and explicit exceptions

### Procedure

1. Deterministically extract stable IDs, display names, What/Why/When/Who/Where, Scope, Object icon names and labeled relations from the supported source format.
2. Validate unique IDs, references and endpoint kinds. Ordinary data connections are only Object → Business (Input) or Business → Object (Output). Reject malformed supported input with a nonzero exit.
3. Keep business-exception (Business → Business, non-data control with dashed rendering semantics) and object-exception (Object → Object, explicitly exceptional) distinct and labeled.
4. Supply a generic icon when omitted; icon strings name Lucide icons and no SVG set is maintained here.
5. Emit stable JSON only after validation. Do not overwrite the input design. Procedure is deliberately excluded, so Graph JSON is never a complete specification or business-approval signal.

### Output

- [graph]: Generated versioned JSON; regenerate from Business Design instead of editing by hand

# Graph exceptions

- business-exception implementation -> business-design-work: If implementation reveals unresolved business meaning, return for a human design decision
- business-exception fresh-review -> business-design-work: If review changes business meaning, correct and confirm Business Design first
- business-exception fresh-review -> implementation: If a definite implementation mismatch is found, return for an in-scope correction
- business-exception verification-work -> implementation: If a test exposes an implementation defect, correct it before delivery
- object-exception tests -> code: Tests verify Code by execution; this is not a maintained Check-to-Code location mapping
