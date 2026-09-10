# Phase 4 Exploratory Freeze Record

Phase 3 status remains `INVALID`; no Phase 3 artifact is changed by this phase.

| Arm | Candidate source | SHA-256 |
| --- | --- | --- |
| A `none` | no candidate text | n/a |
| B `p3-baseline` | `docs/phase3/scope-first-candidate.txt` | `6C992C617EDAD4833673A4087DF8AAD13D5F742C48B898E4356CE996E882F1BE` |
| C `nearest-common` | `docs/phase4/candidates/b-nearest-common.txt` | `227F6A479E122D730D64F6CFDF2E00D4A8ED991C97D2ABBAFA552102B53AA0B8` |
| D `semantic-first` | `docs/phase4/candidates/c-semantic-first.txt` | `76D6BEFDD60573927582999924AF4885E2C3B2C63A09644CB0123916D91B635A` |

Candidate B is the retained Phase 3 baseline. Candidate C adds explicit smallest access scope and nearest meaningful common scope. Candidate D adds only the distinct hypothesis that semantic scope precedes technical classification. None names an architecture, requires a layer, folder template, framework, or anticipated reuse.

Fixture: `work/phase4/fixture-base`; frozen test sources: `work/phase4/frozen-tests`; stages: A–F in `task-packets.md`.

Implementation and scope-refactoring requests: fresh `gpt-5.6-terra`, `medium`. Actual model/version/session metadata is recorded `unverified` unless the execution surface exposes it. Refactoring common prompt: inspect current business requirements and actual code usage; do not preserve existing structure merely because it exists; organize access/visibility at currently necessary scope; do not widen scope for future possibilities; preserve observable behavior.
