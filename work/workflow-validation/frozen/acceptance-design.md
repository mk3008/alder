# Business acceptance design — facilities maintenance pilot

Status: requirements-derived acceptance design. It defines observable business
outcomes for the current four-stage horizon; it does not require a particular
implementation structure or test technique.

## Scope and evidence

Acceptance evidence must identify the equipment, request (where applicable),
input values, acting business role, attempted activity, and resulting observable
state or rejection. An actor context that represents the stated role is needed
to demonstrate the role-dependent conditions below. The packets do not expose
how identity, authorization, or session metadata is established, so those facts
must not be assumed from an unverified runtime/session value.

The acceptance result is evaluated against the business facts in the packets.
It is not an acceptance requirement that a particular table, file, package,
class, module, layer, folder, or visibility mechanism exists.

## Conditions that remain active

- A maintenance request is associated with existing equipment.
- A request has a nonblank description and starts in the `open` state.
- A reporter can record more than one request; similarity to an earlier request
  is not a basis to reject it.
- The reporter identity does not confer maintenance-coordinator or technician
  authority.
- Stage 1 conditions continue through Stage 4; later conditions add to them.

## Stage 1 — report equipment fault

The following outcomes are accepted:

1. Given an existing equipment identifier and reporter identity, a reporter can
   record an equipment fault with an observation time and nonblank description.
   The resulting request identifies that equipment and reporter, retains the
   supplied observation time and description, and is `open`.
2. An attempt to report against an unknown equipment identifier is rejected;
   no request for that unknown equipment is created.
3. An attempt with a blank description is rejected.
4. Reporting a second request is permitted even when an earlier request exists
   for the same equipment or appears similar. No duplicate-detection outcome is
   required or implied.

## Stage 2 — schedule and complete maintenance

The following outcomes are accepted in addition to Stage 1:

1. An authorized maintenance coordinator can schedule an `open` request for a
   future time. The request becomes `scheduled`, with that scheduled time.
2. A non-coordinator, including the request reporter solely by virtue of being
   the reporter, cannot schedule the request.
3. A request that is not `open` cannot be scheduled. In particular, a completed
   request cannot be rescheduled.
4. An authorized technician can complete a `scheduled` request at completion
   time. The request becomes `completed`, with that completion time.
5. A request that is `open` cannot be completed.
6. A non-technician, including the request reporter solely by virtue of being
   the reporter, cannot complete the request.

## Stage 3 — record safety closure

The following outcomes are accepted in addition to earlier stages:

1. An authorized safety inspector can record an unsafe result for equipment.
   That equipment becomes `safety_closed`.
2. A coordinator's attempt to schedule an `open` request for `safety_closed`
   equipment is rejected. The request does not become scheduled as a result of
   that attempt.
3. Closing equipment does not retrospectively alter a request that was already
   `completed`, including its completed status or completion fact.
4. A person without safety-inspector authority cannot record the safety closure.

## Stage 4 — clear safety closure

The following outcomes are accepted in addition to earlier stages:

1. An authorized safety inspector can clear an existing safety closure. The
   equipment becomes `available`.
2. Once equipment is available, an authorized coordinator can again schedule
   its `open` requests, subject to all Stage 2 conditions (including a future
   schedule time).
3. A person without safety-inspector authority cannot clear the safety closure.

## Decisions deliberately not inferred

These are genuine policy or operational gaps in the packets. They must be
decided before an acceptance condition can demand a particular outcome:

- How an actor is authenticated, how its role/authorization is determined, and
  what rejection is observed when identity or authorization information is
  missing, invalid, or stale.
- The authoritative clock and boundary for “future time,” including whether an
  exact current-time value is permitted and how time-zone or clock differences
  are treated.
- Whether reporting a new fault for equipment already `safety_closed` is
  permitted. The stated block is on scheduling, not reporting.
- What happens to a request already `scheduled` when its equipment is closed:
  whether it remains scheduled, can be completed, is cancelled, or requires
  another action.
- Whether an unsafe result may be recorded again for already
  `safety_closed` equipment, and whether clearing already `available` equipment
  is rejected, a no-op, or separately recorded.
- Whether inspection results, inspector identity, inspection time, rationale,
  history, or audit records must be retained. The packets require the resulting
  equipment status only.
- The error wording, transport/protocol status, retry/idempotency behavior,
  concurrency resolution, and presentation of rejection.

