# Acceptance-instrument amendment 003 — Stage 3 review defects

Status: frozen before fresh Stage 3 defect resolution. The v2 cumulative suite and its hash remain historical evidence.

The fresh Sol review found no HUMAN_BLOCKER, but found an implementation defect for decimal-string `"NaN"` and coverage defects. This amendment adds rejection checks for numeric and decimal-string NaN, a multi-line case distinguishing round-after-sum from per-line rounding, low-value sourced initial state, duplicate Order Lines, persisted manager decision, and manager denial for Sales confirmation. No Business Rule or Human Decision is changed.

- v2 cumulative suite SHA-256: `e94d36d8dfe62d9459658e1a5ea4a577f514a16fb51c20eba4a6c914e1997028`
- v3 cumulative suite SHA-256: `bf0336e7151d292aa0fa1a66c15dfc4ce1142d1e14a00f5ef9dcf64c255f8ef5`
