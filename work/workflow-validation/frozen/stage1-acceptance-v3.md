# Stage 1 acceptance instrument contract v3 — report equipment fault

Status: executable acceptance-instrument contract. This supersedes v2 while
retaining every v2 case, requirement, limit, and HD-WV-001 clarification. It
also repairs the acceptance gate: every stated field of every accepted row is
now asserted in SQL. It is derived from the Stage 1 packet, frozen DDL,
acceptance design, current pilot candidate workflow, and HD-WV-001. It asserts
observable outcomes only, not an interface, write technique, module, folder,
or implementation layout.

Execution requested: fresh Terra / medium. Actual model, execution effort,
runtime identity, and session identity: **unverified**. `reported_by` is
business evidence supplied to the operation, not authentication/authorization
evidence.

## Boundary, fixture, and retained evidence

Invoke the **report equipment fault** operation through any raw-SQL-capable
adapter. Inputs are `equipment_id` (text), `reported_by` (text; actor evidence
is `reporter`), `reported_at` (`timestamptz`), `description` (text retained
exactly), and `request_id` (unique text correlation value). The adapter must
supply the listed `request_id`, or capture a returned/generated id before
querying. For every call retain exact inputs, correlation id, outcome
(`accepted` or `rejected`), post-call observed rows, and asserted counts; for
a rejected call retain the attempted correlation id when supplied. No rejection
wording, SQLSTATE, HTTP status, or protocol encoding is asserted.

Run `ddl.sql` in a fresh isolated PostgreSQL database/schema. Before each
standalone case, or in an equivalent transaction-isolated fixture, run:

```sql
INSERT INTO equipment (equipment_id, status)
VALUES ('eq-stage1-known', 'available'), ('eq-stage1-other', 'available');
SELECT count(*) AS request_count FROM maintenance_request;
-- expected: 0
```

S1-04 is the exception: one fixture/transaction contains its successful first
call before its second. `timestamptz` comparisons are by instant, so expected
literals are independent of display time zone. For each case retain case id,
database/schema identity, actor evidence, all inputs/correlation id, outcome,
each listed query's returned rows, and each asserted count.

An accepted call whose generated id cannot be captured, outcome cannot be
observed, required SQL gate is absent, or setup fails is **inconclusive**, not
a pass.

## Mandatory accepted-row SQL gate

For each accepted call creating a request, run a per-case SQL assertion that
proves exactly one row matches all of: `request_id`, `equipment_id`,
`reported_by`, `reported_at`, `description`, `status`, `scheduled_for`, and
`completed_at`, and separately proves that case's required total
`maintenance_request` count. Selecting/printing fields is not an assertion.
The required gates are below; an equivalent may be used only if it asserts the
same fields and count.

## Cases and assertions

### S1-01 — create an open request for known equipment

Invoke as `reporter` with:

```text
request_id: req-stage1-01
equipment_id: eq-stage1-known
reported_by: reporter-stage1
reported_at: 2030-01-15T10:30:00Z
description: Hydraulic pressure warning observed
```

The call must be accepted. Retain the result of:

```sql
SELECT request_id, equipment_id, reported_by, reported_at, description, status,
       scheduled_for, completed_at
FROM maintenance_request WHERE request_id = 'req-stage1-01';
```

Assert exactly one row:
`req-stage1-01 | eq-stage1-known | reporter-stage1 | 2030-01-15T10:30:00Z |
Hydraulic pressure warning observed | open | NULL | NULL`; assert total count
`1`, using:

```sql
DO $$ BEGIN
  IF (SELECT count(*) FROM maintenance_request WHERE request_id='req-stage1-01'
      AND equipment_id='eq-stage1-known' AND reported_by='reporter-stage1'
      AND reported_at='2030-01-15T10:30:00Z'::timestamptz
      AND description='Hydraulic pressure warning observed' AND status='open'
      AND scheduled_for IS NULL AND completed_at IS NULL) <> 1
     OR (SELECT count(*) FROM maintenance_request) <> 1 THEN
    RAISE EXCEPTION 'S1-01 failed';
  END IF;
END $$;
```

### S1-02 — reject unknown equipment without creating a request

Invoke as `reporter` with `request_id: req-stage1-02`,
`equipment_id: eq-stage1-unknown`, `reported_by: reporter-stage1`,
`reported_at: 2030-01-15T10:31:00Z`, and description `Unknown asset probe`.
The call must be rejected. Retain and assert:

```sql
SELECT count(*) AS unknown_equipment_request_count FROM maintenance_request
WHERE equipment_id = 'eq-stage1-unknown'; -- expected 0
SELECT count(*) AS attempted_id_count FROM maintenance_request
WHERE request_id = 'req-stage1-02'; -- expected 0 when request_id is input
SELECT count(*) AS request_count FROM maintenance_request; -- expected 0
```

If ids are generated, unknown-equipment and unchanged-total counts prove no
creation; retain the attempted correlation id anyway.

### S1-03 — reject empty description

Invoke as `reporter` with `request_id: req-stage1-03`,
`equipment_id: eq-stage1-known`, `reported_by: reporter-stage1`,
`reported_at: 2030-01-15T10:32:00Z`, and description `""`. The call must be
rejected. Retain and assert attempted-id count `0` when request id is input and
total request count `0`:

```sql
SELECT count(*) AS attempted_id_count FROM maintenance_request
WHERE request_id = 'req-stage1-03';
SELECT count(*) AS request_count FROM maintenance_request;
```

### S1-04 — permit a second similar request and retain supplied timestamps

In one fixture/transaction, first successfully invoke S1-01's input. Then
invoke as `reporter` with:

```text
request_id: req-stage1-04
equipment_id: eq-stage1-known
reported_by: reporter-stage1
reported_at: 2030-01-15T10:33:00Z
description: Hydraulic pressure warning observed
```

The second call must be accepted. Retain its outcome and rows from:

```sql
SELECT request_id, equipment_id, reported_by, reported_at, description, status,
       scheduled_for, completed_at FROM maintenance_request
WHERE request_id IN ('req-stage1-01','req-stage1-04') ORDER BY request_id;
```

Assert exactly the S1-01 row above and
`req-stage1-04 | eq-stage1-known | reporter-stage1 | 2030-01-15T10:33:00Z |
Hydraulic pressure warning observed | open | NULL | NULL`; assert total count
`2`, with every field of both rows asserted:

```sql
DO $$ BEGIN
  IF (SELECT count(*) FROM maintenance_request WHERE request_id='req-stage1-01'
      AND equipment_id='eq-stage1-known' AND reported_by='reporter-stage1'
      AND reported_at='2030-01-15T10:30:00Z'::timestamptz
      AND description='Hydraulic pressure warning observed' AND status='open'
      AND scheduled_for IS NULL AND completed_at IS NULL) <> 1
     OR (SELECT count(*) FROM maintenance_request WHERE request_id='req-stage1-04'
      AND equipment_id='eq-stage1-known' AND reported_by='reporter-stage1'
      AND reported_at='2030-01-15T10:33:00Z'::timestamptz
      AND description='Hydraulic pressure warning observed' AND status='open'
      AND scheduled_for IS NULL AND completed_at IS NULL) <> 1
     OR (SELECT count(*) FROM maintenance_request) <> 2 THEN
    RAISE EXCEPTION 'S1-04 failed';
  END IF;
END $$;
```

This proves a similar earlier request is not a rejection basis; it does not
assert a duplicate-detection mechanism.

### S1-05 — reject ASCII-space-only description

Invoke as `reporter` with otherwise valid known-equipment inputs:
`request_id: req-stage1-05`, `equipment_id: eq-stage1-known`,
`reported_by: reporter-stage1`,
`reported_at: 2030-01-15T10:35:00Z`, description `"   "` (three U+0020
spaces). The call must be rejected. Assert attempted-id count (when input) and
total request count are both `0`, using S1-03's queries. Whitespace is the
only invalid reason.

### S1-06 — reject tab-only description

Invoke with otherwise valid known-equipment inputs, `request_id: req-stage1-06`,
`equipment_id: eq-stage1-known`, `reported_by: reporter-stage1`,
`reported_at: 2030-01-15T10:36:00Z`, and
description `"\t"` (one U+0009 tab). The call must be rejected. Assert the
S1-03 attempted-id and total counts are both `0`; whitespace is the only
invalid reason.

### S1-07 — reject newline-only description

Invoke with otherwise valid known-equipment inputs, `request_id: req-stage1-07`,
`equipment_id: eq-stage1-known`, `reported_by: reporter-stage1`,
`reported_at: 2030-01-15T10:37:00Z`, and
description `"\n"` (one U+000A line feed). The call must be rejected. Assert
the S1-03 attempted-id and total counts are both `0`; whitespace is the only
invalid reason.

### S1-08 — reject ideographic-space-only description

Invoke with otherwise valid known-equipment inputs, `request_id: req-stage1-08`,
`equipment_id: eq-stage1-known`, `reported_by: reporter-stage1`,
`reported_at: 2030-01-15T10:38:00Z`, and
description `"　"` (one U+3000 ideographic/full-width space). The call must be
rejected. Assert the S1-03 attempted-id and total counts are both `0`;
whitespace is the only invalid reason.

### S1-09 — reject mixed-whitespace-only description

Invoke with otherwise valid known-equipment inputs, `request_id: req-stage1-09`,
`equipment_id: eq-stage1-known`, `reported_by: reporter-stage1`,
`reported_at: 2030-01-15T10:39:00Z`, and
description `" \t\n　"` (U+0020, U+0009, U+000A, U+3000 in that order). The
call must be rejected. Assert the S1-03 attempted-id and total counts are both
`0`; whitespace is the only invalid reason.

### S1-10 — accept and preserve ordinary description exactly

Invoke as `reporter` with `request_id: req-stage1-10`,
`equipment_id: eq-stage1-known`, `reported_by: reporter-stage1`,
`reported_at: 2030-01-15T10:40:00Z`, description `Bearing temperature above
normal`. The call must be accepted. Query S1-01's selected columns for
`request_id = 'req-stage1-10'`, retain and assert exactly one row
`req-stage1-10 | eq-stage1-known | reporter-stage1 | 2030-01-15T10:40:00Z |
Bearing temperature above normal | open | NULL | NULL`, and run:

```sql
DO $$ BEGIN
  IF (SELECT count(*) FROM maintenance_request WHERE request_id='req-stage1-10'
      AND equipment_id='eq-stage1-known' AND reported_by='reporter-stage1'
      AND reported_at='2030-01-15T10:40:00Z'::timestamptz
      AND description='Bearing temperature above normal' AND status='open'
      AND scheduled_for IS NULL AND completed_at IS NULL) <> 1
     OR (SELECT count(*) FROM maintenance_request) <> 1 THEN
    RAISE EXCEPTION 'S1-10 failed';
  END IF;
END $$;
```

### S1-11 — accept and preserve leading/trailing whitespace exactly

Invoke as `reporter` with `request_id: req-stage1-11`,
`equipment_id: eq-stage1-known`, `reported_by: reporter-stage1`,
`reported_at: 2030-01-15T10:41:00Z`, and description
`"  Bearing temperature above normal  "` (two leading/two trailing U+0020
spaces). The call must be accepted. Query S1-01's selected columns for
`request_id = 'req-stage1-11'`, retain and assert exactly one row
`req-stage1-11 | eq-stage1-known | reporter-stage1 | 2030-01-15T10:41:00Z |
  Bearing temperature above normal   | open | NULL | NULL` (the description
contains exactly two leading and two trailing spaces), and run:

```sql
DO $$ BEGIN
  IF (SELECT count(*) FROM maintenance_request WHERE request_id='req-stage1-11'
      AND equipment_id='eq-stage1-known' AND reported_by='reporter-stage1'
      AND reported_at='2030-01-15T10:41:00Z'::timestamptz
      AND description='  Bearing temperature above normal  ' AND status='open'
      AND scheduled_for IS NULL AND completed_at IS NULL) <> 1
     OR (SELECT count(*) FROM maintenance_request) <> 1 THEN
    RAISE EXCEPTION 'S1-11 failed';
  END IF;
END $$;
```

## Pass rule and limits

Pass only when every case has the required outcome, every required observed
row/count is retained, every accepted-case SQL gate is run, and every
postcondition holds. Per HD-WV-001, S1-05 through S1-09 prove empty or
whitespace-only descriptions are invalid for ASCII space, tab, newline,
ideographic space, and their mixture. A description containing any
non-whitespace character is retained exactly as supplied, including
leading/trailing whitespace. No particular whitespace predicate or
normalization mechanism is required.

This contract does not assert identity authentication/role authorization,
rejection encoding, retry/idempotency, concurrency, prose meaning, removal of
invisible characters generally, reporting for `safety_closed` equipment,
later-stage transitions, auditing/history, or implementation layout.
