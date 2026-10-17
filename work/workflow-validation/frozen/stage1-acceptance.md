# Stage 1 acceptance instrument contract — report equipment fault

Status: executable acceptance-instrument contract derived only from `ddl.sql`,
`stage1-packet.md`, and `acceptance-design.md`.

Execution requested: fresh Terra / medium. Actual model, execution effort, and
runtime/session identity: unverified. The reported actor below is business
evidence supplied to the instrument; it is not evidence of an authenticated or
authorized runtime identity.

## Boundary

This contract verifies observable Stage 1 outcomes by invoking the system's
"report equipment fault" business operation and querying PostgreSQL afterward.
The invocation adapter may be any raw-SQL-capable route to the system under
test, but must record the supplied input and either a returned request id or a
rejection. This contract does not require a particular application interface,
database write technique, or implementation structure.

Each invocation has these inputs:

| Field | Type / value in this instrument |
| --- | --- |
| `equipment_id` | text |
| `reported_by` | text; business actor evidence is `reporter` |
| `reported_at` | `timestamptz` |
| `description` | text |
| `request_id` | a unique text correlation value, supplied to the operation or returned by it and recorded by the adapter |

If the operation generates request identifiers and does not accept one, the
adapter must capture the returned/generated id before its postcondition query.
For a rejected call, the adapter must retain the attempted correlation value if
one was supplied. No error wording, SQLSTATE, HTTP status, or other rejection
encoding is asserted.

## PostgreSQL setup

Run `ddl.sql` in a fresh, isolated PostgreSQL database/schema. Before each
case, establish exactly this fixture (or an equivalent transaction-isolated
fixture):

```sql
INSERT INTO equipment (equipment_id, status)
VALUES
  ('eq-stage1-known', 'available'),
  ('eq-stage1-other', 'available');
```

The instrument requires an initially empty `maintenance_request` relation.
Validate that precondition before the case:

```sql
SELECT count(*) AS request_count FROM maintenance_request;
-- expected: 0
```

Use the literal timestamps and correlation ids below. PostgreSQL `timestamptz`
comparison is by instant; the expected literal denotes that instant regardless
of display time zone.

## Cases and assertions

### S1-01 — create an open request for known equipment

Invoke the operation as the `reporter` business actor with:

```text
request_id:  req-stage1-01
equipment_id: eq-stage1-known
reported_by: reporter-stage1
reported_at: 2030-01-15T10:30:00Z
description:  Hydraulic pressure warning observed
```

The invocation must be accepted. Query:

```sql
SELECT request_id, equipment_id, reported_by, reported_at, description, status,
       scheduled_for, completed_at
FROM maintenance_request
WHERE request_id = 'req-stage1-01';
```

Assert exactly one row with respectively:

```text
req-stage1-01 | eq-stage1-known | reporter-stage1 |
2030-01-15T10:30:00Z | Hydraulic pressure warning observed | open | NULL | NULL
```

Also assert the request count is `1`. The `NULL` assertions describe the
observable Stage 1-created row in the supplied schema; no later activity is
performed in this case.

### S1-02 — reject an unknown equipment identifier without creating a request

Invoke as `reporter` with:

```text
request_id:  req-stage1-02
equipment_id: eq-stage1-unknown
reported_by: reporter-stage1
reported_at: 2030-01-15T10:31:00Z
description:  Unknown asset probe
```

The invocation must be rejected. Assert both:

```sql
SELECT count(*) AS unknown_equipment_request_count
FROM maintenance_request
WHERE equipment_id = 'eq-stage1-unknown';
-- expected: 0

SELECT count(*) AS attempted_id_count
FROM maintenance_request
WHERE request_id = 'req-stage1-02';
-- expected: 0
```

The second assertion applies when the correlation id is an operation input; if
the operation generates ids, the first assertion plus an unchanged total count
from the setup is the no-creation proof.

### S1-03 — reject a blank description

Invoke as `reporter` with:

```text
request_id:  req-stage1-03
equipment_id: eq-stage1-known
reported_by: reporter-stage1
reported_at: 2030-01-15T10:32:00Z
description:  ""
```

The invocation must be rejected. Assert:

```sql
SELECT count(*) AS attempted_id_count
FROM maintenance_request
WHERE request_id = 'req-stage1-03';
-- expected: 0
```

Also assert the total request count remains `0`. This is the executable blank
case. The packet says “nonblank” but does not define treatment of whitespace-only
text; that distinct input is intentionally not asserted here.

### S1-04 — permit a second, similar request

In one fixture/transaction, first successfully invoke S1-01's input. Then
invoke as `reporter` with:

```text
request_id:  req-stage1-04
equipment_id: eq-stage1-known
reported_by: reporter-stage1
reported_at: 2030-01-15T10:33:00Z
description:  Hydraulic pressure warning observed
```

The second invocation must be accepted. Query:

```sql
SELECT request_id, equipment_id, reported_by, reported_at, description, status
FROM maintenance_request
WHERE request_id IN ('req-stage1-01', 'req-stage1-04')
ORDER BY request_id;
```

Assert two rows exist; both have `equipment_id = 'eq-stage1-known'`,
`reported_by = 'reporter-stage1'`, description `Hydraulic pressure warning
observed`, and `status = 'open'`. Assert their request ids and observation
times remain distinct as supplied. This proves that an existing/similar request
is not a rejection basis; it does not assert any duplicate-detection mechanism.

## Result record and pass rule

For every case, retain: case id; actor evidence; all inputs; invocation result
(accepted/rejected); observed SQL rows/counts; and database/schema identity.
The instrument passes Stage 1 only if S1-01 and S1-04 are accepted with every
listed postcondition, and S1-02 and S1-03 are rejected with every listed
no-creation postcondition. A setup failure, missing captured generated id, or
unobservable invocation result is **inconclusive**, not a pass.

## Deliberately unasserted

This contract does not resolve policy absent from the frozen materials,
including: how identity/role/session context is authenticated or authorized;
rejection wording or protocol; retry/idempotency and concurrency; a
whitespace-only definition of blank; reporting for `safety_closed` equipment;
or any Stage 2–4 transition. It also does not infer a requirement for auditing,
history, or implementation artifacts.
