# Prospective Alder resume amendment — 2026-09-10

Resume head: `7eb00231c30956ac84ac3ccfa0926ac4edb85435`.
Authority: [operator handoff](https://github.com/mk3008/alder/pull/3#issuecomment-5615826574).
This note applies prospectively; frozen packets, contracts, run snapshots,
reviews and historical decisions remain unchanged.

## Reconstructed current state

- Stage 1: adopted `runs/stage1/refactoring-v1`, contract Stage 1 v3,
  HD-WV-001. Its retained log contains the v3 pass marker and cleanup count 0.
- Stage 2: adopted `runs/stage2/refactoring-v1`, cumulative Stage 1 v3 +
  Stage 2 v4 (including v2/v3), HD-WV-002. Its retained log contains both
  pass markers and cleanup count 0. RUN_RECORDS and adoption commit
  `16bfde9` establish adoption; the snapshot README's earlier “not adopted”
  status is historical, not the current status.
- Stage 3: `runs/stage3/implementation-v1` at `fef3157` is **unadopted**.
  Its retained pass markers and cleanup count 0 do not override the subsequent
  `sol-review-v1.md` or HB-WV-S3-01. The contract both asserts retain-open
  in S3-02 and reserves that outcome as unresolved. Preserve this contradiction.
- Repository tree at the resume head contains no AGENTS.md or SKILL.md.
  No later Human Decision selecting the open-request outcome exists in the
  PR conversation or DECISIONS at this checkpoint.

Paths under `runs/` above are relative to `work/workflow-validation/`.
Historical logs were inspected, not regenerated in this resume.

## Execution and decision policy from this point

A fresh Astra is requested as the phase owner for investigation, judgment,
implementation and verification. This turn uses the primary agent without
Terra/Sol delegation; exact serving-model version, effort and session identity
are unverified. Stage 1–2 remain evidence under the prior Terra/Sol-requested
orchestration, whose actual metadata was also unverified. Before/after results
are not a controlled model comparison. The purpose is practical Alder
dogfooding with incomplete-but-usable Business Design, not a causal benchmark.

Resolve accepted-rule consequences, instrument defects and ordinary reversible
technical choices automatically, including pre-release DDL representation
repairs that add no business meaning. Escalate only a currently required,
undetermined business outcome, authority, transition, invariant or Data
meaning/cardinality/identity. Give a recommendation, rationale, downside,
alternatives, impact and minimum answer. Stop only dependent work. Missing
future requirements are distinct from forgetting accepted requirements.

Start with Activity / Data / Rule and place decisions at the narrowest meaningful
semantic owner containing current consumers. Do not start from technical
layers or preserve indirection by habit. Shared tables do not require a shared
Domain Model/Repository. Reassess structure after consistency changes;
justified no-change is valid. Folder intent does not prove enforced access.

## Current boundary and independent work

HB-WV-S3-01 remains a genuine Business Decision: scheduling prohibition does
not determine whether safety closure retains, cancels or blocks an open
request. The unadopted implementation is not authority for that choice.

Recommendation: retain the request unchanged as `open`; reject scheduling
while equipment is `safety_closed`. This preserves the reported fault without
inventing cancellation or a new lifecycle state. Downside: `open` alone does
not distinguish an actionable request from one blocked by equipment safety;
consumers must consider equipment status. Alternatives are cancellation, a
distinct blocked state, or a closure-specific workflow, each requiring new
business meaning. Impact: safety closure, coordinator scheduling,
maintenance_request/equipment state, S3-02, and DDL sufficiency.

Minimum answer: approve retain-open, or specify the alternative post-closure
request outcome. No unrelated future policy is required now.

Independent instrument repairs are prepared in
`work/workflow-validation/runs/stage3/instrument-preparation-v2/`.
This supersedes only the old blocker's instruction to postpone even mechanical
repair preparation. It does not resolve the blocker or freeze a new contract.

After the answer: record the Human Decision; freeze the affected acceptance
before dependent implementation/adoption; integrate the prepared gates into a
new snapshot; run cumulative Stage 1–3 acceptance; reassess ownership and
structure; adopt Stage 3 only if the gates pass; then proceed to Stage 4.

## Compact observations and limits

- Automatic work: prepared the two known instrument repairs from existing
  contracts, without relaxing assertions or deciding lifecycle policy.
- External steering: the linked handoff changes execution and escalation policy.
- Business decisions: none newly selected; HB-WV-S3-01 remains open.
- DDL/source/visibility: unchanged. No structural change justified for this
  instrument-only preparation; post-consistency Stage 3 reassessment is pending.
- Verification: static preparation checks only; PostgreSQL/psql is unavailable
  in this environment. No new SQL execution, cumulative pass, independent
  review or Stage 3 adoption is claimed. No redundant historical rerun.
- Stage 4 and the planned final review remain unstarted.
