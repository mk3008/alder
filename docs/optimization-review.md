# Optimization Review

[Back to Alder](../README.md) · [Adoption guide](adoption.md) · [Validation](validation.md)

Alder Optimization Review starts from a **specific operational problem that people actually experience** and asks whether the current Business Design can be improved without losing the business meaning that must remain true.

It is an adopted Alder workflow capability. It is **not** a claim that AI can find a global optimum, enumerate every useful improvement, or make the business decision on behalf of people.

Business Design remains the SSOT. The review proposes alternatives; people decide whether to change the business. If a candidate is accepted, update and confirm Business Design first, then update downstream Check Items, Tests, Decisions and implementation as needed.

## Optional Structural Discovery before a Problem is known

When people want to look for questions about the current way of working without supplying a Problem, they may run a **Structural Discovery** inquiry. First confirm that the Business Design faithfully describes the relevant current work and that the relationships needed for the inquiry are established. Read across Activities, Objects, roles, timing and Results. Report only a few grounded relationships that may be worth reconsidering; **zero observations is valid**. This inquiry is optional and does not change Business Design or approve an alternative.

For each observation, keep these distinct:

1. **Structural Observation** — the present relationship directly supported by Business Design.
2. **Evidence** — the named Activities, Objects, roles, times, information flows or Results.
3. **Why it may matter** — a possibility to investigate, without asserting a burden or benefit.
4. **Unknowns** — facts needed to determine whether there is a real Problem.
5. **Question** — something the people doing the work can verify or decide.

If a proposed observation depends on an **unconfirmed** procedure, authority, state or relationship, return a plain Business Design confirmation question to Authoring / Quality Review instead. Count no improvement observation for that relation; do not use the observation template for a design defect. Preserve checks with different purposes, even when they share a time, person or object. Do not infer Pain, error, delay, cost or an optimal design from structure alone.

People may reject every observation or leave it pending. Only after they confirm a specific operational Problem and a Pain level should they use the existing Optimization Review below. Discovery neither supplies that confirmation nor creates a separate Structural Optimization workflow.

Copyable optional inquiry:

```text
Review this confirmed current-state Business Design for a small number of relationships across Activities, Objects, roles, times and Results that may be worth reconsidering. Review only; do not change files.
For each supported relationship, separate Structural Observation, Evidence, Why it may matter, Unknowns and a Question people can verify.
Do not turn an unconfirmed Business Design relation into an improvement: return a plain design-confirmation question first.
Do not invent a Problem, Pain, benefit or implementation. Preserve checks with different purposes. Zero observations is valid.
People decide whether any observation represents a Problem; use the existing Optimization Review only after that decision and a Pain level.
```

This narrow boundary is supported by the [Issue #108 comparison](../work/structural-discovery/issue-108/RESULT.md): #99 revealed one useful shared-tool commitment question amid many unfinished design correlations; #105's grounded observation was rejected as a Problem by the synthetic customer; new zero and incomplete-design controls returned no improvement candidates. These small synthetic cases do not establish a general discovery rate or operational benefit.

## Inputs

Use the current Business Design plus:

- **Problem** — a concrete current pain, burden, delay, error-prone step, duplication, or other observed difficulty.
- **Pain level** — a simple relative signal such as **Low / Medium / High**.

Do not invent a Problem merely to force optimization. Not every Activity needs one.

When the Problem belongs naturally to one Activity, it can be recorded alongside that Activity, for example:

```markdown
### Problem

Approved purchase requests require the purchasing operator to repeat purchase and result-registration work for each request.

### Pain level

High
```

Pain level is a review input, not a numerical score or a fixed decision matrix. In the current evidence, higher Pain caused the reviewer to retain broader or higher-difficulty investigation candidates, while lower Pain favored narrower changes and stopped expensive exploration earlier. Use that as a proportionality signal, not as a rule such as “High always permits High Difficulty.”

If measured frequency, time, error rate, cost, or other evidence is available, include it. Missing measurements do not require inventing a number.

## Review behavior

Review only the area relevant to the Problem first. Do not optimize the whole Business Design merely because further changes are imaginable.

Consider the following directions when they are relevant; they are lenses, not a checklist:

- **Eliminate** — can a step, input, check, transfer, or other work disappear?
- **Simplify / Merge** — can duplicated or fragmented work be simplified or combined?
- **Automate** — can deterministic human work be safely delegated to automation?
- **Delegate** — can responsibility move to an external service, package, existing platform capability, or another established owner?
- **Preserve** — which business meaning, control, judgment, responsibility, or experience should deliberately remain even if it costs effort?

When the Problem and Pain warrant it, briefly question whether the current Activity, its trigger, timing, unit of work or responsibility boundary must exist in its current form. An extreme alternative may reveal a different business model even if present constraints keep it from becoming a candidate. Restore those constraints before proposing a candidate. This is a light exploration heuristic, not a required sequence or a reason to enumerate every extreme. Stop when further variations add little information relative to their review cost.

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

Do not inflate candidate counts with extreme alternatives that are not ready for candidate evaluation. A materially different perspective may instead be returned separately for human exploration, with its unknowns and business-meaning changes made explicit. Omit mere automation, batching, delegation, technical variants or paraphrases that leave the business model intact.

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

### Extreme perspectives (when useful)

Separate from Optimization Candidates, optionally return a few **Extreme perspectives** that question the current business model but cannot yet be treated as candidates. For each, state:

- the different business model and how it could remove the stated Problem
- why it was not retained as a candidate under current constraints
- which facts or human business decisions would make it worth revisiting

These are exploration prompts, not feasible proposals or recommendations. State which current Business meaning would change. Do not repeat a perspective already covered by a candidate, fill a quota, or prolong the review to invent one. Zero is valid for both sections.

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

When the Problem and Pain justify it, briefly consider whether the current Activity, timing, unit of work or responsibility boundary is needed at all. Return to actual constraints before proposing candidates. Do not follow a fixed multi-step algorithm or generate weak variants to fill a quota. If a meaningfully different business model cannot become a candidate yet but would give people a useful question to investigate, report it separately under Extreme perspectives: the alternative model and its causal path to removing the Problem, why it is not a candidate, and the facts or human decisions needed to revisit it. Clearly label it as exploratory, not feasible or recommended. Omit this section when there is no useful perspective.

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

If a candidate is accepted:

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
- [Issue #85 exploration](optimization-review/issue-85-followup.md) compared the existing purchase-request results with one extreme exploration and ran paired Fresh Control/Treatment reviews on facilities maintenance and meeting-room booking. The treatment exposed distinct alternative business models in all three, including ones that did not survive as candidates. The evidence supports returning a bounded perspective to people, not a claim of higher candidate quality or feasibility.

These are small qualitative evaluations, not measured proof of cost savings, optimal candidate count, general completeness, universal Pain behavior, or a causal improvement in candidate quality. The #85 purchase comparison used historical controls rather than a paired run. Candidate feasibility and expected benefit, and whether an extreme perspective is applicable, still require business evidence. Those evidence limits do not make Optimization Review experimental; they bound the claims Alder makes about the adopted workflow.
