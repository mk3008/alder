# Case inputs

These are independent synthetic handoffs. Read only the selected case in addition
to `design-and-checks.md` and the source files. A named SR block is its complete
supplied text. The source locator and revision identify that block; no external
service needs to be contacted. An unavailable-source result is part of the case's
controlled input, not an instruction to bypass access controls. No unlisted
Decision Record or SR may be assumed to exist.

## C01

Request: Review IMPL-1, its DDL and tests for all three confirmed Checks, read-only.
The requester supplied no System Requirements and named no location for them.
No declaration about whether technical constraints apply is available.
Execution evidence available: E-1 in `execution.txt`.

## C02

Request: Review IMPL-1, its DDL and tests for all three confirmed Checks, read-only.
SR intake: The requester identifies `product/system-requirements.md`, revision
SR-B-3, for registration storage and receipt formatting. The supplied retrieval
result is `permission denied`; its body is not available in the allowed inputs.
The requester has not said it is irrelevant. Do not guess the inaccessible content.
Execution evidence available: E-1 in `execution.txt`.

## C03

Request: Review only `receipt_text` and CHK-03, read-only. No registration, database,
migration, deployment or test-record update is in this request.
SR intake: The technical owner provided the following complete scope statement in
`product/requirements-note.md`, revision SR-C-1, confirmed 2026-10-02:
“The product's additional System Requirements govern only the nightly database
backup job. They do not apply to the pure receipt-formatting function, which opens
no database. There are no applicable System Requirements for this review scope.”
Execution evidence available: E-1's `ReceiptTests` result only. The registration
results in that log are outside the selected review scope.

## C04

Request: Read-only assessment of which Check-to-Test record updates can proceed
under a pending authorized follow-up. Do not write the records in this exercise.
The prior independent review completed against BD-1, CK-1, IMPL-1 and SR-D-1. Its
conclusions are not supplied. E-1 was collected at that source set. All implementation,
Checks and tests are byte-identical since that review. Before follow-up, the
technical owner replaced SR-D-1 with SR-D-2. The replacement is the current source;
its receipt section is unchanged. No review of SR-D-2 has occurred.

Source `product/system-requirements.md`, reviewed revision SR-D-1:
- Storage: The local prototype uses SQLite. No journal-mode requirement applies.
- Receipt: The formatter has no storage or network dependency.

The same source, current revision SR-D-2:
- Storage: The local prototype uses SQLite. A file-backed database must use WAL
  journal mode when opened by the application. Applies to `open_database(path)`.
- Receipt: The formatter has no storage or network dependency.

Review scope: Registration/storage and receipt evidence records. CHK-03 and its
pure formatter test have no dependency on the changed storage condition.
Execution evidence available: E-1 from the older source set; no later run, file-backed
journal-mode observation or new independent review was provided.

## C05

Request: Review IMPL-1, its DDL and tests for all three confirmed Checks, read-only.
Source `product/system-requirements.md`, revision SR-E-1; complete applicable scope:
- The local prototype uses Python standard-library SQLite.
- The reference identifier must be globally unique.
The text does not define “reference identifier.” Both a generated saved order
identifier and a partner-issued external reference occur in this product. There
is no later clarification or approved business change.
Execution evidence available: E-1 in `execution.txt`.

## C06

Request: Review IMPL-1, its DDL and tests for all three confirmed Checks, read-only.
Source `product/system-requirements.md`, revision SR-F-1; complete applicable scope:
- The local prototype uses Python standard-library SQLite.
- `external_ref` must be unique across all partners. Reject a registration when
  any partner has already saved that external reference, even if the new partner
  is different.
BD-1 and CK-1 remain agreed/confirmed and no business owner decision changes them.
The technical owner supplied SR-F-1 as current, without a supersession statement
for BD-1. Receipt formatting and repeat rejection within one partner are unchanged.
Execution evidence available: E-1 in `execution.txt`.

## C07

Request: Review IMPL-1, its DDL and tests for all three confirmed Checks, read-only.
Source `product/technical-constraints.md`, revision SR-G-1; complete applicable scope:
- Use Python's standard library and SQLite for this local prototype.
- Enforce the agreed per-partner reference uniqueness in the database.
- A surrogate primary key with a per-partner unique constraint is permitted; no
  composite primary key, ORM, cloud service or separate detailed-design document
  is prescribed. Receipt formatting requires no network.
Execution evidence available: E-1 in `execution.txt`. Production operations and
concurrent clients are outside this local prototype review request.

## C08

Request: Review the static IMPL-1, DDL and test sources for all three confirmed
Checks, and report what is established about the supplied operational requirement.
Do not execute tests in this case; only the handed-over evidence is being evaluated.
Source `product/system-requirements.md`, revision SR-H-1; complete applicable scope:
- Use Python's standard library and SQLite.
- Enforce the agreed per-partner reference uniqueness in the database.
- For the production release, operators must demonstrate restore from a backup
  with at most one hour of committed-order loss. A successful rehearsal record is
  required before claiming this operational condition satisfied.
No test execution has been supplied for this case's reviewed snapshot, and no
production deployment, backup configuration or restore rehearsal is available.
`execution.txt` belongs to the other cases and is not an admissible input for C08.
No code implementing a backup/restore service is in scope. There is no claim that
a rehearsal failed or that committed orders were actually lost.

## C09

Request: Review IMPL-1, its DDL and tests for all three confirmed Checks, read-only.
Source `product/system-requirements.md`, revision SR-I-1; complete applicable scope:
- This deployment must store orders in the existing PostgreSQL 16 service.
- SQLite is not permitted, including as the production implementation backend.
- Preserve the agreed per-partner reference uniqueness and receipt text.
The Python/SQLite implementation is submitted as the proposed production
implementation, not as a permitted test double. No PostgreSQL adapter, deployment
configuration or exception is supplied.
Execution evidence available: E-1 in `execution.txt`, run against SQLite only.
