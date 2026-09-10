# Stage 4 — clear safety closure

Status at creation: verification/final review pending, not adopted.
Current status: **ADOPTED** after corrected run 34462769183 and independent
re-review. See INDEPENDENT_REVIEW.md and docs/workflow-validation/pilot/FINAL_REPORT.md.
The Stage 4 acceptance contract was committed before this implementation.

The only business-source change is `clear_safety_closure` in equipment_safety.sql.
It uses the existing inspector fixture authority and changes a closed equipment
row to available. It does not change requests. Existing scheduling then admits
an open request under its original coordinator/future-time conditions.
No DDL, new lifecycle status, layer, service or shared domain model is added.

Stage 1–3 business operations are retained; Stage 4 adds the three frozen
cases. The final independent review prompted targeted corrections to inherited
Stage 2/3 instruments under frozen/final-instrument-amendment.md; historical
snapshots remain unchanged. Run from the repository root against disposable test
PostgreSQL using standard PG environment variables, or through the CI service:

```sh
python3 work/workflow-validation/run-acceptance.py work/workflow-validation/runs/stage4/implementation-v1 --output /tmp/alder-evidence
```

Fixtures demonstrate supplied authority only. Unknown/repeat clearing and
other unrequested lifecycle outcomes are not acceptance claims. Exact serving
model/session metadata is unverified; this uses the primary phase owner,
with an explicitly separate independent review at the final gate.
