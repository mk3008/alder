# Decision Record — Issue #25

This record separates technical choices from approval of business behavior.
The only requirement source is `business-design/meeting-room/README.md` at blob
`59d185f89535ee0414b9e51b4ed1bb435baf838e`.

## DR-1: Existing reservations when a room becomes unavailable

- **Chosen:** Do not choose a policy pending the
  [Human Blocker question](https://github.com/mk3008/alder/issues/25#issuecomment-5627206812).
  `set_available(room, False)` returns `human_decision_required` if *any* reserved
  reservation exists for that room. This is a visible partial-implementation gate,
  not a business rule. The transaction changes neither room nor reservation data.
  Rooms without reserved reservations can be made unavailable and resumed.
- **Basis:** Activity 5 requires stopping new reservations/changes into the room,
  but the explicit undecided list excludes the treatment of existing reservations.
  Preserving versus cancelling changes the outcome of later availability, change,
  cancellation and resume. No time-based selection of affected bookings is given.
- **Business status:** Unconfirmed; Human Decision requested, no answer received.
- **Recommended, not implemented:** Preserve existing reservation facts and state;
  permit the owner to move to another available room or cancel; include preserved
  bookings in occupancy when the room resumes. Automatic cancellation would instead
  require additional scope, authority and timestamp decisions.
- **Guarantee:** No unsupported reservation treatment is silently adopted. The
  implementation cannot yet complete Activity 5 for a room with reserved bookings.
  The blocked branch and its tests must be replaced/extended after the decision;
  passing the current tests does not close this business requirement.

## DR-2: Identity and authority boundary

- **Chosen:** The local CLI maps the real OS UID through an operator-controlled
  JSON file to a stable booker ID and explicit role set. The operation layer trusts
  `Actor`, checks roles and restricts change/cancel to the original booker. The
  manager role does not imply user/proxy authority; both roles can be explicitly
  supplied to one actor for the local demonstration.
- **Basis:** Each activity names its actor. Authentication technology is explicitly
  unspecified; proxy booking/change/cancel is explicitly outside the current scope.
- **Business status:** Actor requirements are explicit. Local identity resolution
  is an implementation assumption, not a production authentication approval.
- **Guarantee:** Authorized caller context is enforced inside the operation layer.
  No security against an operator who can replace the DB, identity mapping or code.
  A future untrusted transport must resolve identity itself, not accept a client role.

## DR-3: Instants, intervals and transaction time

- **Chosen:** Offset-bearing ISO timestamps, UTC integer microseconds, half-open
  intervals and strict `start > now` for reserve/change. The command's current time
  is sampled after obtaining its write lock; that same time is used for registration.
  Availability only requires `start < end`, including past queries.
- **Basis:** Rule 3 explicitly permits touching endpoints. Activities 2/3 require a
  future start relative to their operation; Activity 1 has no future-only restriction.
  Comparing local-time strings would produce different results for equal instants.
- **Business status:** Ordering/overlap are explicit. Precision, timestamp format
  and the operation's serialization point are technical assumptions.
- **Guarantee:** Offset-equivalent instants compare identically. Naive local times
  and precision beyond six fractional digits are rejected, not silently rounded.
  No business timezone, calendar, maximum duration or booking horizon is introduced.

## DR-4: Reservation identity and facts during changes/cancellation

- **Chosen:** A change updates only the room and interval of the existing UUID.
  Booker, purpose and registration timestamp remain intact. Cancellation preserves
  the row and sets state/time; cancelled rows cannot be reactivated. No old-start
  cutoff is added to change or cancellation.
- **Basis:** Activity 3 step 6 names exactly the fields to change; Activity 4 records
  cancellation rather than deleting the reservation. Rule 4 is terminal. Neither
  activity adds a check against the original start or end time.
- **Business status:** Explicit procedures; no additional business policy.
- **Guarantee:** Failed operations preserve all existing reservation facts, and a
  cancelled booking never occupies a slot again. Historical versions are not kept.

## DR-5: Data initialization and required text

- **Chosen:** Provision rooms offline from JSON with explicit IDs/states into a new
  DB. Store bookers as opaque external identity strings, not invented employee
  records. Require nonblank purpose, room ID/name/location and identity; preserve
  supplied text verbatim after that validation.
- **Basis:** Rooms must exist for Activity 1, but creating/managing a room catalog is
  not an activity in the design. Identity assignment is unspecified. Purpose is a
  required input; other text represents the supplied room/actor information.
- **Business status:** Technical bootstrap and representation assumptions. No
  room-registration authority or identity-lifecycle policy is being approved.
- **Guarantee:** Initialization never overwrites an existing file. No business rule
  about capacity, purpose content, identifier format or employee membership is added.

## DR-6: Atomic operations and observable outcomes

- **Chosen:** Each mutation takes the SQLite writer lock before reading mutable
  facts; overlapping reserved slots are additionally guarded by SQL triggers.
  Repeated resume/unavailable is a state assignment when the pending-decision gate
  does not apply. Repeated cancel is rejected because the reservation must be reserved.
- **Basis:** Rules 2/6/7 require concurrency safety and preservation on failed
  change. Activities 5/6 assign a target state without an opposite-state precondition;
  Activity 4 explicitly requires `reserved`.
- **Business status:** Atomicity and state conditions are explicit; locking,
  timeout/error format and repeated state assignment are implementation choices.
- **Guarantee:** Successful mutations form a serialization on one local SQLite file.
  Busy operations fail without a business mutation and can be retried. Availability
  gives no future reservation guarantee. No fairness, request deduplication, external
  audit or notification delivery guarantee is introduced.
