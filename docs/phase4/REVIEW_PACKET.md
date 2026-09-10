# Phase 4 independent review packet

Review target: exploratory evidence at the Phase 4 commit. Phase 3 remains `INVALID`; its evidence is hypothesis-generating only and is not repaired by this work.

## Question and boundary

This phase asks which minimal human requirements communicate scope as an access/visibility boundary. It does not test whether Scope-First is superior to other architectures, does not compare architecture labels, and must not select a normative candidate.

## Frozen inputs

- Charter: `phase4-charter.md`
- Candidate texts and SHA-256 hashes: `freeze-record.md`
- Staged task requirements: `task-packets.md`
- Architecture-neutral base fixture: `work/phase4/fixture-base/`
- Behavioral-only frozen tests: `work/phase4/frozen-tests/`
- Run source/evidence: `work/phase4/runs/`
- Factual matrix and observations: `RUN_MATRIX.md`, `OBSERVATIONS.md`

## Independent review questions

1. Does this fixture apply enough pressure to actually require hierarchical scope?
2. Do the Scope-First candidates express access/visibility semantics rather than a folder taxonomy?
3. Does Stage A induce premature structure?
4. When multiple features needed the same semantic contract, was promotion to a nearest meaningful/common scope observed?
5. Was scope widened before application-wide sharing was actually necessary?
6. Did technical classification come before semantic scope?
7. Did the work avoid premature sharing for similar-but-different requirements?
8. When the domain-consistency requirement appeared, was shared business meaning/invariant recognized and expressed independently of a Domain Layer?
9. Which evidence-backed clause differences between the Phase 3 candidate and revised candidates appear meaningful, if any?
10. Which clauses appear unnecessary or overly architecture-forming, if any?
11. Can the candidate be shorter?
12. What validity threats exist, including fixture bias, model uncertainty, run isolation, and public API constraints?

The reviewer is read-only, should cite retained paths, and must not decide normative final text or a candidate winner.
