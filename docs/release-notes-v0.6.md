# Alder v0.6 — Problem-driven Optimization Review

## Optimize the business where people actually feel pain

Alder v0.6 adds **Optimization Review** as an adopted workflow capability.

The review starts from a concrete operational **Problem** and a relative **Pain level** recorded by people. It does not ask AI to optimize the entire Business Design. Instead, it uses the current Business Design as the authority boundary and explores a small number of alternative business designs around the stated Problem.

People still own the business decision.

## Optimization Review

For a Problem such as repeated purchasing work, approval waiting, or error-prone result reconciliation, the reviewer may consider relevant directions such as:

- Eliminate
- Simplify / Merge
- Automate
- Delegate
- Preserve

These are review lenses, not a checklist and not a requirement to return one candidate from every category.

Each useful candidate records:

- relation to the Problem
- Scope: Narrow / Keep / Expand
- expected benefit
- Difficulty based on affected responsibility and coordination, not code size
- affected parties / business
- existing Business meaning and constraints that must remain true
- assumptions / unknowns
- questions people must decide or verify
- confidence

The review returns at most a few useful alternatives; zero candidates is a valid result. A restatement of the current Business Design and materially duplicate proposals are not counted as new Optimization Candidates.

## Pain guides exploration depth

Pain is a proportionality signal, not a score or fixed decision matrix.

In the bounded validation for v0.6, a neutral fixed Problem was reviewed in two High and two Low Fresh runs:

- both High runs retained broader, higher-difficulty investigation candidates
- both Low runs stayed with narrower, lower-impact changes and explicitly stopped broader external coordination as disproportionate to the stated Pain

This does not mean High automatically authorizes a high-difficulty change. It means Pain can inform whether deeper investigation is worth keeping on the table.

## Scope and Difficulty

Scope asks how far the business boundary must move to address the Problem:

- **Narrow** — solve a smaller subset
- **Keep** — change the current scope without materially expanding the boundary
- **Expand** — adjacent work, responsibility, data, external records, or another operational boundary must be considered

Difficulty is judged from affected roles, authority, Activities, systems, departments, external parties, contracts, payment responsibility, regulation, and other coordination boundaries. A technically small change can still be high-difficulty.

## Business Design remains the SSOT

Optimization Review does not approve its own candidates.

If people accept a candidate:

1. confirm the changed business meaning, responsibility, and scope
2. update Business Design first
3. update Check Items / Functional Interfaces where used
4. update Decision Records for material implementation choices
5. update Tests and implementation
6. run the normal Alder implementation review against the revised Business Design

Existing implementation, tests, or generated optimization candidates do not become Business authority.

## Evidence and limits

The adopted behavior was evaluated using Alder's existing purchase-request Business Design.

- The initial Problem-driven PoC stayed centered on purchasing burden and preserved approval and purchase-completion meaning.
- Changing the Problem moved the review focus to approval waiting and purchase-result reconciliation instead of repeating the earlier purchasing candidates.
- Narrow, Keep, and Expand Scope decisions were all observed with stated reasons.
- A neutral Pain-isolation comparison ran High and Low twice each and observed consistent differences in exploration breadth.
- Review inspection rejected a current-design restatement as a new candidate and did not count overlapping proposals as additive value.

The evidence remains bounded:

- one Business Design
- a small number of qualitative Fresh runs
- no measured operational time, error reduction, cost saving, or implemented candidate
- no completeness guarantee
- no proof of an optimal candidate count or universal Pain behavior

These limits bound Alder's claims; they do not make Optimization Review a beta or experimental feature.

## Compatibility

v0.6 does not change review knowledge v0.3.

The permanent traceability boundary from v0.5 remains:

```text
Business Design ↔ Functional Interface (optional) ↔ Check Item ↔ Automated Test
Automated Test ─ verifies → Code
```

No framework, CLI, runtime package, architecture style, or code-location traceability is introduced.

## Included guidance

- [Optimization Review](optimization-review.md)
- [Adoption guide](adoption.md)
- [Validation and evidence limits](validation.md)
- [Research Decision Index](research-decisions.md)

Historical PoC inputs, raw outputs, prompts, hashes, and limitations remain preserved under the Issue #81 / PR #82 research records.
