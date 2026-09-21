# Alder v0.5.1 — Item-level traceability drift pilot

## Detect stale Check/Test mappings without tracing Code

Alder v0.5.1 adds an optional, bounded pilot for detecting traceability drift when Business Design changes but downstream Check Items or Tests remain aligned with an older meaning.

The permanent traceability boundary remains unchanged:

```text
Business Design ↔ Functional Interface (optional) ↔ Check Item ↔ Automated Test
Automated Test ─ verifies → Code
```

Code, file, symbol, SQL-entry-point, and line mappings are still intentionally excluded from permanent Alder traceability.

## What is new

The pilot records item-level fingerprints on the two semantic boundaries Alder already maintains:

- Business Design item → Check Item
- Check Item → Automated Test

A Business Design change marks only related Checks as requiring reconfirmation. While a Check is stale, its linked Tests are shown as impact candidates. If review confirms that the Check body remains unchanged, only the Business Design → Check pin is refreshed and the existing Test mapping remains current.

If the Check body changes, its linked Test mapping becomes stale until the Test is reconciled.

This keeps propagation bounded at the existing semantic boundaries instead of treating every upstream revision as a reason to re-review all downstream artifacts.

## Why item-level fingerprints

A whole-document hash makes every dependent Check a candidate after any edit in that document. The bounded PoC showed that a local Business Design edit could narrow the candidate set from three Checks to one.

The selected experiment uses:

- stable item IDs
- automatic content fingerprints
- explicit saved relationships
- read-only drift detection
- human/AI reconciliation only for affected items

It does not use an automatic approval command, bulk baseline refresh, Code markers, or a full OpenFastTrace graph.

## Maintenance boundary

Measured in the synthetic fixture:

- wording-only Business Design change with unchanged Check: 1 source-pin update, 0 Test-pin updates
- changed Check expectation: 1 source-pin update plus 1 Test-pin update
- ordinary Code refactor: 0 trace metadata updates

These are artifact-churn measurements, not measured human time or lifetime savings.

## Limits

The current implementation remains a research PoC and optional pilot, not a mandatory Alder checker or supported universal parser.

Fingerprints detect freshness, not semantic correctness or approval. Wrong mappings and blindly refreshed pins can still produce false negatives. Wording-only changes can produce conservative reconfirmation candidates. Real-product setup cost, review time, and long-term benefit remain unmeasured.

Use the pilot only where the observed cost of missed Business Design → Check/Test updates justifies the extra trace metadata and reconfirmation work.

## Compatibility

Existing Alder v0.5 Business Design, Check Item IDs, review states, Decision Records, and Check ↔ Test mappings remain valid.

Research review knowledge remains **v0.3**. This release does not change Q1–Q3 / P1 / P2 / S and does not change the Test-bounded traceability model introduced in v0.5.
