# Cumulative Stage 1–3 acceptance instrument contract — safety closure

Status: proposed executable business-acceptance contract for Stage 3. It
incorporates the adopted Stage 1 v3 and Stage 2 v4 instruments unchanged, then
adds only the observable Stage 3 requirements in the frozen Stage 3 packet. It
does not select an interface, write technique, module, transaction strategy,
authorization implementation, or a policy absent from the source material.

Execution requested: fresh Terra / medium. Actual model, effort, runtime,
session identity, and execution result are **unverified**.

## Frozen source references

| Source | SHA-256 |
| --- | --- |
| `stage1-acceptance-v3.md` | `caedb7a2f76966d30a9fc5e1ba180b601ca124b3c63142dac8468d1fc92e8241` |
| `stage2-acceptance-v4.md` | `247a868c3ccb6e772450e4e79eb8e9b3c7de0c74cfd5eaa0d8819e01e8419dbb` |
| `ddl.sql` | `7183953f7455cb7f9d2d4249bcf80639551d459aa59631e520509ada595a0bc7` |
| `stage1-packet.md` | `495a33d0dfd48fc5649014a41f18e338af614368957217753b6e1558b506dfc9` |
| `stage2-packet.md` | `4dc03d2565ababd6c46b4d54aac3aaaa719b07af25715307598f492dd8d2f687` |
| `stage3-packet.md` | `57d42bc611cfefbed2d82127a8402060e58e8b4e97c55b62137a51d35e4189ae` |
| `CANDIDATE_WORKFLOW.md` | `0bd0c660e62e846d73ada7b677ef112c982e6a7539c1fe068fa139c0fc120cc6` |
| `DECISIONS.md` (HD-WV-001 and HD-WV-002) | `200b10c1ee1fe0a2a519072267366e01a69a646ef1c4bcee1b3bb220ed476caa` |

Stage 1 v3 and Stage 2 v4, including their incorporated cases, SQL gates,
fixture provenance, temporal brackets, actor evidence, limits, and pass rules,
remain active without relaxation or substitution. In particular, HD-WV-001's
exact-preservation and whitespace cases and HD-WV-002's database-clock
completion and `completed_at >= reported_at` rule remain active. A Stage 3 run
must execute those instruments as written as well as this section.

## Stage 3 observable rule and fixture discipline

Use a fresh isolated PostgreSQL database/schema, run the frozen `ddl.sql`, and
retain database/schema identity and the hashes above. Each standalone case has
an isolated fixture or transaction. Seed known equipment as required, for
example:

```sql
INSERT INTO equipment (equipment_id, status)
VALUES ('eq-stage3-known', 'available');
```

Invoke a raw-SQL-capable adapter's **record safety closure** operation with an
existing equipment id and actor evidence. The packet supplies no closure id,
closure time, reason, inspector identity storage field, or return encoding;
none is asserted. “Authorized safety inspector” is demonstrated by retained
authorization evidence, just as the prior instrument requires demonstrable
actor evidence; no authentication or authorization mechanism is prescribed.

For every operation retain case id, exact inputs, actor/authorization evidence,
outcome (`accepted` or `rejected`), all listed query results, and asserted
counts. A missing outcome, evidence item, SQL gate, setup, or requested row is
**inconclusive**, not a pass. Rejection wording, SQLSTATE, protocol encoding,
and UI are not asserted.

The only new persisted business fact asserted for closure is the equipment row
`equipment.status = 'safety_closed'`. The frozen DDL's `equipment.status`
domain makes that state representable. Closure does not itself prescribe a
maintenance-request transition.

## Stage 3 cases and gates

### S3-01 — an authorized inspector records safety closure

With `eq-stage3-known` seeded `available`, invoke record safety closure for
that equipment under demonstrable authorized-safety-inspector evidence. The
operation must be accepted. Retain:

```sql
SELECT equipment_id, status FROM equipment
WHERE equipment_id = 'eq-stage3-known';
SELECT count(*) AS equipment_count FROM equipment
WHERE equipment_id = 'eq-stage3-known';
SELECT count(*) AS request_count FROM maintenance_request
WHERE equipment_id = 'eq-stage3-known';
```

Assert exactly one equipment row `eq-stage3-known | safety_closed`, equipment
count `1`, and request count `0`. An equivalent gate must fail unless all
three conditions hold:

```sql
DO $$ BEGIN
  IF (SELECT count(*) FROM equipment
      WHERE equipment_id='eq-stage3-known' AND status='safety_closed') <> 1
     OR (SELECT count(*) FROM equipment
         WHERE equipment_id='eq-stage3-known') <> 1
     OR (SELECT count(*) FROM maintenance_request
         WHERE equipment_id='eq-stage3-known') <> 0 THEN
    RAISE EXCEPTION 'S3-01 failed';
  END IF;
END $$;
```

### S3-02 — a coordinator cannot schedule an open request for closed equipment

In one isolated fixture, while `eq-stage3-known` is `available`, create one
valid open request through the retained Stage 1 instrument. Use a unique
request id, retain all exact report inputs, and run its complete accepted-row
gate. Then close that equipment through an accepted S3-01-style operation.

Under demonstrable authorized-coordinator evidence, attempt to schedule that
open request using a retained exact `scheduled_for` value that satisfies the
active Stage 2 future-time fixture discipline. The schedule call must be
rejected. Retain its outcome and the following complete post-state observation:

```sql
SELECT request_id, equipment_id, reported_by, reported_at, description, status,
       scheduled_for, completed_at
FROM maintenance_request WHERE request_id = :stage3_open_request_id;
SELECT equipment_id, status FROM equipment
WHERE equipment_id = 'eq-stage3-known';
SELECT count(*) AS request_count FROM maintenance_request
WHERE equipment_id = 'eq-stage3-known';
```

The SQL gate must assert exactly one request retaining every exact report input
and `status='open'`, `scheduled_for IS NULL`, and `completed_at IS NULL`; the
equipment row must be exactly `eq-stage3-known | safety_closed`; and the
equipment request count must remain `1`. This proves the rejection does not
schedule or otherwise mutate the request. It does not define how a previously
scheduled request behaves when equipment later closes.

### S3-03 — safety closure does not retrospectively change a completed request

In one isolated fixture, create a valid request for `eq-stage3-known` while it
is `available`, schedule it as an authorized coordinator, and complete it as
an authorized technician using the full active Stage 2 v4 positive-fixture
discipline. Retain its exact report fields, retained schedule, completion DB
clock value/bracket, actor evidence, and complete Stage 2 accepted-row gate.

After that accepted completion, invoke record safety closure for the same
equipment under demonstrable authorized-safety-inspector evidence. It must be
accepted. Retain:

```sql
SELECT request_id, equipment_id, reported_by, reported_at, description, status,
       scheduled_for, completed_at
FROM maintenance_request WHERE request_id = :stage3_completed_request_id;
SELECT equipment_id, status FROM equipment
WHERE equipment_id = 'eq-stage3-known';
SELECT count(*) AS request_count FROM maintenance_request
WHERE equipment_id = 'eq-stage3-known';
```

Assert exactly one request with every exact pre-closure report field, exact
pre-closure `scheduled_for`, `status='completed'`, and the exact retained
non-null completion DB-clock value. Also assert exactly one equipment row
`eq-stage3-known | safety_closed` and request count `1`. This is the required
non-retroactivity proof: closing the equipment does not alter an already
completed request.

## Authority-negative coverage

The packet makes safety closure an authorized-safety-inspector activity. A
non-inspector must therefore not be able to record it. With a newly seeded
`available` `eq-stage3-known`, invoke the closure operation with actor evidence
that is demonstrably not authorized as a safety inspector. The operation must
be rejected. Retain outcome and actor evidence, then assert exactly one row
`eq-stage3-known | available` and no request rows for that equipment. This
asserts the stated authority boundary only; it does not prescribe role names,
identity provider, policy engine, or error representation.

## Deliberately untested unresolved policy

The Stage 3 packet does not determine the following acceptance-relevant
outcomes/data meanings. This contract does not choose them. Dependent work
must raise one grouped proposal-form human-decision blocker before claiming
coverage of any of them:

- whether closing already `safety_closed` equipment is accepted, rejected, or
  records another event;
- whether a closure of an unknown equipment id is rejected and what observable
  result is required;
- whether, and how, a closure affects an existing `open` or `scheduled`
  request other than the explicit no-retrospective-change rule for `completed`;
- whether safety closure is reversible, who can reverse it, and its resulting
  state/data; and
- any closure reason, timestamp, correlation/idempotency key, audit/history,
  notification, concurrency, or cross-request atomicity requirement.

The blocker must state the uncertainty, recommendation/trade-off,
alternatives, impact, and smallest needed answer. It must not silently add a
test expectation for these choices.

## Cumulative pass rule and limits

Pass only when every active Stage 1 v3 condition, every active Stage 2 v4
condition (including all incorporated conditions), and S3-01 through S3-03
plus authority-negative coverage above pass; all required observations, counts,
full-row gates, authorization evidence, clock samples/brackets, fixture
provenance, schema identity, and source hashes must be retained. Any missing
item is inconclusive, not a pass.

No pass claims a policy about untested unresolved items, interface shape,
error encoding, authentication design, physical work detection, offline or
external completion reporting, retry/idempotency, auditing/history,
notifications, concurrency, implementation layout, or any later lifecycle
stage.
