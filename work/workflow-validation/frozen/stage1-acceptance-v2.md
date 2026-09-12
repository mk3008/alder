# Stage 1 acceptance instrument contract v2 — report equipment fault

Status: executable acceptance-instrument contract. This amendment preserves the
four cases in `stage1-acceptance.md`, applies the accepted clarification
HD-WV-001, and repairs the S1-04 timestamp observation. It is derived from the
Stage 1 packet, acceptance design, frozen DDL, current pilot candidate
workflow, and HD-WV-001. It specifies observable outcomes only; it does not
require a particular interface, database write technique, module, folder, or
implementation layout.

Execution requested: fresh Terra / medium. Actual model, execution effort,
runtime identity, and session identity: **unverified**. The `reported_by` value
below is business evidence supplied to the operation, not proof of an
authenticated or authorized runtime identity.

## Boundary and invocation evidence

Invoke the system's **report equipment fault** business operation through any
raw-SQL-capable adapter. For every call, retain the exact input values, the
correlation id, the call outcome (`accepted` or `rejected`), and the
post-call observed rows and counts. The adapter must either supply the listed
`request_id` to the operation or capture the returned/generated request id
before querying. For a rejected call, retain the attempted correlation id when
it was supplied. No rejection wording, SQLSTATE, HTTP status, or protocol
encoding is asserted.

Inputs in every case are:

| Field | Value type |
| --- | --- |
| `equipment_id` | text |
| `reported_by` | text; actor evidence is `reporter` |
| `reported_at` | `timestamptz` |
| `description` | text, retained as an exact value |
| `request_id` | unique text correlation value |

## PostgreSQL setup and retained observations

Run `ddl.sql` in a fresh, isolated PostgreSQL database/schema. Before every
standalone case, establish this fixture (or an equivalent transaction-isolated
fixture) and prove the request relation is empty:

```sql
INSERT INTO equipment (equipment_id, status)
VALUES
  ('eq-stage1-known', 'available'),
  ('eq-stage1-other', 'available');

SELECT count(*) AS request_count FROM maintenance_request;
-- expected: 0
```

S1-04 is the stated exception: its fixture contains its successful first call
before its second call. PostgreSQL `timestamptz` comparison is by instant; each
expected literal denotes that instant regardless of display time zone.

For **each case**, the evidence record must retain:

- case id and database/schema identity;
- actor evidence, all inputs, and the correlation id;
- call outcome; and
- the rows returned by each listed postcondition query and every asserted row
  count.

An accepted call whose generated request id cannot be captured, an unobservable
call outcome, or a setup failure is **inconclusive**, not a pass.

## Cases and assertions

### S1-01 — create an open request for known equipment

Invoke as `reporter`:

```text
request_id:  req-stage1-01
equipment_id: eq-stage1-known
reported_by: reporter-stage1
reported_at: 2030-01-15T10:30:00Z
description:  Hydraulic pressure warning observed
```

The call must be accepted. Query:

```sql
SELECT request_id, equipment_id, reported_by, reported_at, description, status,
       scheduled_for, completed_at
FROM maintenance_request
WHERE request_id = 'req-stage1-01';
```

Assert exactly one row:

```text
req-stage1-01 | eq-stage1-known | reporter-stage1 |
2030-01-15T10:30:00Z | Hydraulic pressure warning observed | open | NULL | NULL
```

Also retain and assert total `maintenance_request` count `1`.

### S1-02 — reject an unknown equipment identifier without creating a request

Invoke as `reporter`:

```text
request_id:  req-stage1-02
equipment_id: eq-stage1-unknown
reported_by: reporter-stage1
reported_at: 2030-01-15T10:31:00Z
description:  Unknown asset probe
```

The call must be rejected. Retain results and assert:

```sql
SELECT count(*) AS unknown_equipment_request_count
FROM maintenance_request
WHERE equipment_id = 'eq-stage1-unknown';
-- expected: 0

SELECT count(*) AS attempted_id_count
FROM maintenance_request
WHERE request_id = 'req-stage1-02';
-- expected: 0 when request_id is an operation input

SELECT count(*) AS request_count FROM maintenance_request;
-- expected: 0
```

If the operation generates ids, the unknown-equipment and unchanged-total
counts are the no-creation proof; retain the attempted correlation id anyway.

### S1-03 — reject the empty description

Invoke as `reporter`:

```text
request_id:  req-stage1-03
equipment_id: eq-stage1-known
reported_by: reporter-stage1
reported_at: 2030-01-15T10:32:00Z
description:  ""
```

The call must be rejected. Retain results and assert:

```sql
SELECT count(*) AS attempted_id_count
FROM maintenance_request
WHERE request_id = 'req-stage1-03';
-- expected: 0 when request_id is an operation input

SELECT count(*) AS request_count FROM maintenance_request;
-- expected: 0
```

### S1-04 — permit a second, similar request and retain each supplied timestamp

In one fixture/transaction, first successfully invoke S1-01's input. Then
invoke as `reporter`:

```text
request_id:  req-stage1-04
equipment_id: eq-stage1-known
reported_by: reporter-stage1
reported_at: 2030-01-15T10:33:00Z
description:  Hydraulic pressure warning observed
```

The second call must be accepted. Retain its call outcome and query:

```sql
SELECT request_id, equipment_id, reported_by, reported_at, description, status,
       scheduled_for, completed_at
FROM maintenance_request
WHERE request_id IN ('req-stage1-01', 'req-stage1-04')
ORDER BY request_id;
```

Assert exactly these two rows (including the request-specific timestamps):

```text
req-stage1-01 | eq-stage1-known | reporter-stage1 |
2030-01-15T10:30:00Z | Hydraulic pressure warning observed | open | NULL | NULL
req-stage1-04 | eq-stage1-known | reporter-stage1 |
2030-01-15T10:33:00Z | Hydraulic pressure warning observed | open | NULL | NULL
```

Also retain and assert total `maintenance_request` count `2`. This proves a
similar earlier request is not a rejection basis; it does not assert a
duplicate-detection mechanism.

### S1-05 — reject ASCII-space-only description

Invoke as `reporter` with otherwise valid, known-equipment inputs:

```text
request_id:  req-stage1-05
equipment_id: eq-stage1-known
reported_by: reporter-stage1
reported_at: 2030-01-15T10:35:00Z
description:  "   " (three U+0020 ASCII spaces)
```

The call must be rejected. Assert the attempted-id count (when input) and total
request count are both `0`, using the S1-03 queries. These inputs make
whitespace the only invalid reason.

### S1-06 — reject tab-only description

Invoke as `reporter` with otherwise valid, known-equipment inputs:

```text
request_id:  req-stage1-06
equipment_id: eq-stage1-known
reported_by: reporter-stage1
reported_at: 2030-01-15T10:36:00Z
description:  "\t" (one U+0009 tab)
```

The call must be rejected. Assert the attempted-id count (when input) and total
request count are both `0`, using the S1-03 queries. Whitespace is the only
invalid reason.

### S1-07 — reject newline-only description

Invoke as `reporter` with otherwise valid, known-equipment inputs:

```text
request_id:  req-stage1-07
equipment_id: eq-stage1-known
reported_by: reporter-stage1
reported_at: 2030-01-15T10:37:00Z
description:  "\n" (one U+000A line feed)
```

The call must be rejected. Assert the attempted-id count (when input) and total
request count are both `0`, using the S1-03 queries. Whitespace is the only
invalid reason.

### S1-08 — reject ideographic-space-only description

Invoke as `reporter` with otherwise valid, known-equipment inputs:

```text
request_id:  req-stage1-08
equipment_id: eq-stage1-known
reported_by: reporter-stage1
reported_at: 2030-01-15T10:38:00Z
description:  "　" (one U+3000 ideographic/full-width space)
```

The call must be rejected. Assert the attempted-id count (when input) and total
request count are both `0`, using the S1-03 queries. Whitespace is the only
invalid reason.

### S1-09 — reject mixed-whitespace-only description

Invoke as `reporter` with otherwise valid, known-equipment inputs:

```text
request_id:  req-stage1-09
equipment_id: eq-stage1-known
reported_by: reporter-stage1
reported_at: 2030-01-15T10:39:00Z
description:  " \t\n　" (U+0020, U+0009, U+000A, U+3000 in that order)
```

The call must be rejected. Assert the attempted-id count (when input) and total
request count are both `0`, using the S1-03 queries. Whitespace is the only
invalid reason.

### S1-10 — accept and preserve an ordinary description exactly

Invoke as `reporter`:

```text
request_id:  req-stage1-10
equipment_id: eq-stage1-known
reported_by: reporter-stage1
reported_at: 2030-01-15T10:40:00Z
description:  Bearing temperature above normal
```

The call must be accepted. Query the S1-01 selected columns with
`request_id = 'req-stage1-10'`; retain the row and assert exactly one row with
the supplied id, equipment, reporter, timestamp, description, `open`, and
`NULL` `scheduled_for`/`completed_at`. Retain and assert total request count
`1`.

### S1-11 — accept and preserve leading/trailing whitespace exactly

Invoke as `reporter`:

```text
request_id:  req-stage1-11
equipment_id: eq-stage1-known
reported_by: reporter-stage1
reported_at: 2030-01-15T10:41:00Z
description:  "  Bearing temperature above normal  " (two leading and two trailing U+0020 spaces)
```

The call must be accepted. Query the S1-01 selected columns with
`request_id = 'req-stage1-11'`; retain the row and assert exactly one row with
the supplied id, equipment, reporter, timestamp, **the exact description
including its two leading and two trailing spaces**, `open`, and `NULL`
`scheduled_for`/`completed_at`. Retain and assert total request count `1`.

## Pass rule and limits

The instrument passes only when every listed case has the required call
outcome, all required observed rows/counts are retained, and every stated
postcondition holds. The whitespace rejection cases S1-05 through S1-09 apply
HD-WV-001: empty or whitespace-only descriptions are invalid; each description
containing a non-whitespace character is retained exactly as supplied. These
cases do not require a particular whitespace predicate or normalization
mechanism, but prove the listed character classes and mixture.

This contract deliberately does not assert identity authentication or role
authorization mechanics, rejection encoding, retry/idempotency, concurrency,
prose meaning, removal of invisible characters generally, reporting for
`safety_closed` equipment, later-stage transitions, auditing/history, or any
implementation layout.
