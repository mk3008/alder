# Alder v0.5 — Test-bounded traceability

## Permanent traceability stops at Test

Alder now keeps permanent semantic traceability only through:

```text
Business Design ↔ Functional Interface (optional) ↔ Check Item ↔ Automated Test
Automated Test ─ verifies → Code
```

Business Design remains the SSOT for business meaning. Check Items remain human-reviewable observable expectations. Automated Tests remain executable evidence linked back to those expectations.

v0.5 deliberately **does not maintain Check Item ↔ Code, file, symbol, SQL-entry-point, or line mappings** as permanent Alder artifacts.

## Why Code mapping was removed

Code may be maintained by people or AI and can change physical structure without changing business behavior:

- files split or merge
- functions are renamed or extracted
- SQL moves
- helpers are introduced
- frameworks or architecture change
- entry points are reorganized

A separate Code-location mapping must follow those changes or become stale. A stale map can still look authoritative even when the executable tests are correct.

Check Item ↔ Test is different: it records the semantic relation between an approved expectation and the executable evidence for that expectation. Tests then verify the current implementation by running it, so Alder does not need a second permanent location map to describe which source file currently implements the behavior.

## What remains

- Business Design ↔ Check Item feedback when human review changes business meaning.
- Check Item ↔ Automated Test traceability in both directions.
- Automated Test → Code verification by execution.
- Fresh code exploration during review, debugging, or implementation when needed.
- Post-implementation Alder review that can inspect implementation-selected meaning and return unresolved business questions to people.

Fresh code exploration is diagnostic work, not a maintained traceability artifact.

## Historical evidence

Earlier Alder studies and preserved records may contain Code/SQL entry-point mappings because those were part of the evaluated candidate at the time. Those records remain unchanged as historical evidence. v0.5 changes current guidance; it does not rewrite prior experiments.

## Compatibility

Existing Check IDs, review states, Business Design, Decision Records, and Check ↔ Test mappings remain valid. Products may delete maintained Code-location columns or sidecars when they exist; no source annotations or replacement Code-mapping mechanism is required.

Research review knowledge remains **v0.3**. This release changes traceability maintenance guidance, not Q1–Q3 / P1 / P2 / S.
