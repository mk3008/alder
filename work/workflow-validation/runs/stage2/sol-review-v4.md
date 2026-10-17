# Stage 2 v4 read-only consistency review

Reviewed head: `0416cd8ba1dae669c8805a009b64f14a28b6b5a3`.

Requested condition: fresh Sol / medium / read-only. Actual model, version,
session identity, and freshness are unverified. The reviewer did not rerun the
instrument, because its missing executable gate could not be resolved by a
repeat execution.

## Result

`HUMAN_BLOCKER: none`.

Adoption remains pending an acceptance-instrument repair, not a business
decision or data-model change.

## Findings

1. **Acceptance-instrument defect.** Frozen v4 requires the positive S2-10
   guard `completion db_after < scheduled_for`, but the executable runner
   only checked `db_before < scheduled_for` before the call and
   `completed_at < scheduled_for` after it. The recorded values happened to
   meet the omitted predicate, but retained favorable evidence is not the
   contract's executable gate. Repair by asserting `s210c_db_after <
   s210_scheduled` and executing in a new disposable schema.
2. **Evidence-labeling defect.** The v4 run README still said execution was
   pending, and the executable SQL title still said v3. Correct labels only;
   do not change behavior or frozen contract.

## Confirmed observations

- No implementation defect was found. `complete_maintenance` captures one
  trusted `clock_timestamp()` value, uses it for the report-time comparison,
  and stores that same value as `completed_at` under technician and scheduled
  state gates.
- Early completion is independent of `scheduled_for`; S2-11 exercises the
  before-reported-at rejection and complete-row non-mutation path.
- Stage 1 source/instrument copies are byte-identical to the adopted v3
  copies. Current recorded evidence includes Stage 1 and Stage 2 pass markers
  and disposable-schema cleanup `0`.

This review is evidence of the separate review run; it does not revise the
historical v4 run or its result.
