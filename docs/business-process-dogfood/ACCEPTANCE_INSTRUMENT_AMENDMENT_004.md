# Acceptance-instrument amendment 004 — read-coherence defect

Status: frozen before fresh Stage 3 defect resolution. The v3 suite remains historical evidence.

The fresh Sol re-review found that quotation search and approval-waiting search can combine separate autocommit reads and expose a mixed state during concurrent change. No new business policy is required: existing activity semantics entail coherent reads. The v4 suite retains v3 coverage and asserts that approval-waiting results are pending at observation. The exact concurrent interleaving is preserved as reviewer evidence because the public API has no test synchronization hook; the repair is additionally verified by source/diff review and a fresh Sol re-review.

- v3 cumulative suite SHA-256: `bf0336e7151d292aa0fa1a66c15dfc4ce1142d1e14a00f5ef9dcf64c255f8ef5`
- v4 cumulative suite SHA-256: `f05f82f5de3ef7d04bb41863666263c8e528b778a4c39babf2a881bbf0119911`
