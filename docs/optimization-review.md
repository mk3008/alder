# Optimization Review

[Back to Alder](../README.md) · [Adoption guide](adoption.md) · [Validation](validation.md)

Alder Optimization Review starts from a **specific operational problem that people actually experience** and asks whether the current Business Design can be improved without losing the business meaning that must remain true.

It is an adopted Alder workflow capability. It is **not** a claim that AI can find a global optimum, enumerate every useful improvement, or make the business decision on behalf of people.

Business Design remains the SSOT. The review proposes alternatives; people decide whether to change the business. If a candidate is accepted, update and confirm Business Design first, then update downstream Check Items, Tests, Decisions and implementation as needed.

## Inputs

Use the current Business Design plus:

- **Problem** — a concrete current pain, burden, delay, error-prone step, duplication, or other observed difficulty.
- **Pain level** — a simple relative signal such as **Low / Medium / High**.

Do not invent a Problem merely to force optimization. Not every Activity needs one.

When the Problem belongs naturally to one Activity, record one nonempty Problem / Pain level pair after Result if it is part of the current Business Design. These H2 headings are also accepted by the optional [Business Graph exporter](business-graph.md#opt-in-markdown-profile-v1). For example:

```markdown
## Problem

Approved purchase requests require the purchasing operator to repeat purchase and result-registration work for each request.

## Pain level

High
```

For the exportable v1 profile the entire Pain level value is Low, Medium or High. In the recommended Alder workflow, record and confirm a newly recognized Problem / Pain in Business Design through the design loop before requesting Optimization Review. A research or PoC review may instead supply them explicitly in a prompt when the source design has not recorded them. That prompt-only input is not a current Business Design fact, does not change its JSON projection and is not the standard adoption route. Pain level is a review input, not a numerical score or a fixed decision matrix. In the current evidence, higher Pain caused the reviewer to retain broader or higher-difficulty investigation candidates, while lower Pain favored narrower changes and stopped expensive exploration earlier. Use that as a proportionality signal, not as a rule such as “High always permits High Difficulty.”

If measured frequency, time, error rate, cost, or other evidence is available, include it. Missing measurements do not require inventing a number.

## Review behavior

Review only the area relevant to the Problem first. Do not optimize the whole Business Design merely because further changes are imaginable.

Consider the following directions when they are relevant; they are lenses, not a checklist:

- **Eliminate** — can a step, input, check, transfer, or other work disappear?
- **Simplify / Merge** — can duplicated or fragmented work be simplified or combined?
- **Automate** — can deterministic human work be safely delegated to automation?
- **Delegate** — can responsibility move to an external service, package, existing platform capability, or another established owner?
- **Preserve** — which business meaning, control, judgment, responsibility, or experience should deliberately remain even if it costs effort?

For each useful candidate, evaluate:

### Scope

- **Narrow** — solve only a smaller subset of the current work.
- **Keep** — change the current scope without materially expanding its business boundary.
- **Expand** — the Problem cannot be addressed responsibly without considering adjacent work, responsibility, data, an external record, or another operational boundary.

Scope is not a preference for smaller or larger systems. Explain why the Problem requires that scope.

### Difficulty

Estimate business-change difficulty from the breadth of coordination and responsibility affected, not from code size.

Relevant factors include:

- roles and decision authority
- other Activities
- other systems
- other departments
- customers, vendors, or other external parties
- contracts, payment responsibility, regulation, or other external constraints

A technically small change can still be high difficulty when it changes responsibility across many parties.

### Meaning preservation

State the current Business meaning that must remain true. Do not improve efficiency by silently changing approval authority, allowed outcomes, the meaning of a state, the unit of work, data ownership, or a downstream guarantee.

Unknown external services, contracts, workloads, frequencies, or business facts must remain assumptions or questions. Do not present them as established facts.

## Stopping conditions

Optimization Review may validly return **zero candidates**.

Do not count these as new Optimization Candidates:

- a restatement of the current Business Design
- two proposals with materially the same benefit and responsibility change merely expressed with different technology
- a proposal unrelated to the stated Problem
- a proposal whose apparent benefit depends on invented facts

Prefer a few useful alternatives over filling a quota. The current default is **at most three** candidates for one Problem.

Pain should influence how far the search is worth taking. For example, a Low-pain issue normally gives weaker justification for exploring a high-difficulty cross-organization change when a narrow alternative exists. This is a proportionality judgment, not a hard threshold.

## Output

For each candidate, report:

1. **Candidate**
2. **Relation to the Problem**
3. **Approach** — Eliminate / Simplify / Merge / Automate / Delegate / Preserve, or another clearly explained direction
4. **Scope** — Narrow / Keep / Expand, with reason
5. **Expected benefit**
6. **Difficulty**, with affected coordination/responsibility as evidence
7. **Affected parties / affected business**
8. **Existing Business meaning and constraints to preserve**
9. **Assumptions / Unknowns**
10. **Questions people must decide or verify**
11. **Confidence**

Do not select a winner or state that a candidate should be adopted. The output is a review for human Business judgment.

## Copyable review prompt

Replace the placeholders with the actual paths, revision, Problem and Pain level.

```text
Run an Alder Optimization Review. Review only; do not modify files.

Business Design: <path and revision>
Problem: <specific current operational problem>
Pain level: <Low / Medium / High>
Optimization Review guidance: <readable path or versioned URL to docs/optimization-review.md from the selected Alder revision>

Read the relevant Business Design and the referenced Optimization Review guidance.

Start from the stated Problem. Do not optimize unrelated Activities merely because improvements are imaginable. Treat Pain level as a proportionality signal for how far investigation and business-change difficulty are worth exploring; do not use a fixed Pain-to-Difficulty matrix.

Consider Eliminate, Simplify/Merge, Automate, Delegate and Preserve only when they help this Problem. Evaluate whether the useful scope should be Narrow, Keep or Expand, and explain why. Evaluate Difficulty from affected roles, authority, Activities, systems, departments, external parties, contracts or other responsibility boundaries, not from code size.

Preserve the current Business meaning unless the candidate explicitly identifies a human Business decision that would change it. Do not invent workloads, services, contracts or external facts. Distinguish assumptions and unknowns.

Return at most three useful candidates. Zero candidates is a valid result. Do not count a restatement of the current Business Design or materially duplicate proposals as separate candidates.

For each candidate report:
- Candidate
- Relation to the Problem
- Approach
- Scope and reason
- Expected benefit
- Difficulty and its business/coordination basis
- Affected parties / affected business
- Existing Business meaning and constraints to preserve
- Assumptions / Unknowns
- Questions people must decide or verify
- Confidence

Do not choose or approve a candidate. People own the Business decision.
```

## After review

People may reject every candidate. No Business Design change is required merely because the review found alternatives.

If a candidate is accepted, the proposal fields (including Expected benefit, Difficulty, Confidence and Narrow / Keep / Expand) remain review output rather than current Business Design facts or Business Graph fields. Then:

1. confirm the changed business meaning, responsibility and scope with the responsible people
2. update Business Design first
3. update Check Items / Functional Interfaces where used
4. update Decision Records for material implementation choices, without using them as a substitute for Business approval
5. update Tests and implementation
6. run the normal Alder implementation review against the revised Business Design

Optimization Review therefore sits **before a business change is approved**. Normal Alder review still checks whether implementation faithfully realizes the approved Business Design.

## Evidence and limits

The adopted behavior was evaluated on the existing purchase-request benchmark:

- [Issue #81 initial PoC](optimization-review/issue-81.md) produced a bounded set of Problem-related alternatives while retaining existing approval and purchase meaning.
- [Problem / Pain / Scope follow-up](optimization-review/issue-82-followup.md) changed the Problem and observed the review focus move from purchasing work to approval waiting and purchase-result reconciliation; Narrow, Keep and Expand were all used with stated reasons.
- [Pain-isolation comparison](optimization-review/issue-82-pain-isolation.md) fixed a neutral Problem and ran High and Low twice each. Both High runs retained higher-difficulty investigation candidates; both Low runs stayed with narrower, lower-impact changes and explicitly stopped broader exploration.

These are small qualitative evaluations on one Business Design, not measured proof of cost savings, optimal candidate count, general completeness, or universal Pain behavior. Candidate feasibility and expected benefit still require business evidence. Those evidence limits do not make Optimization Review experimental; they bound the claims Alder makes about the adopted workflow.
