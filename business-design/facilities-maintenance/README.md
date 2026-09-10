# Facilities maintenance — Business Design

This document describes the business behavior for a facilities-maintenance application.

## Business roles

- **Site reporter** — records an observed equipment fault.
- **Maintenance coordinator** — schedules maintenance work.
- **Technician** — completes scheduled maintenance work.
- **Safety inspector** — records and clears equipment safety closure.

Role names describe the business authority required by the behavior below. The design does not define a production identity or authorization-management system.

## Business data

### Equipment

Each equipment item has an identity and is either:

- `available`
- `safety_closed`

### Maintenance request

A maintenance request records:

- request identity
- equipment identity
- reporter identity
- observation/report time
- description
- lifecycle state: `open`, `scheduled`, or `completed`
- scheduled time when scheduled
- completion time when completed

A maintenance request refers to existing equipment.

## Record an equipment fault

When a site reporter observes a fault, they may record a maintenance request with the equipment, reporter identity, observation time, and description.

- A new request begins as `open`.
- The equipment must exist.
- The description must not be empty or consist only of whitespace.
- A valid nonblank description is retained as supplied; leading or trailing whitespace is not itself a reason to rewrite the text.
- More than one request may be reported. No deduplication rule is specified.

## Schedule maintenance

An authorized maintenance coordinator may schedule an `open` maintenance request.

- The scheduled time must be a future time when the scheduling operation is performed.
- Scheduling changes the request to `scheduled` and records the chosen scheduled time.
- A completed request cannot be rescheduled.
- Reporter identity by itself does not grant coordinator authority.
- A request for equipment that is currently `safety_closed` cannot be scheduled.

## Complete maintenance

An authorized technician may complete a `scheduled` maintenance request.

- An `open` request cannot be completed.
- Successful completion changes the request to `completed`.
- The scheduled time remains recorded.
- Completion time is recorded by the application from a trusted system time associated with the successful completion operation; a caller- or technician-supplied completion time is not authoritative.
- The recorded completion time must not be earlier than the request's report time; otherwise completion is rejected without changing the request.
- `scheduled_for` is a plan, not a lower bound on physical completion. Completion before the scheduled time is allowed.
- Reporter identity by itself does not grant technician authority.

The recorded time represents the business completion fact for this application; the application is not assumed to detect physical work independently. Offline or later-reported completion is not specified here.

## Record a safety closure

After a safety inspection, an authorized safety inspector may record equipment as unsafe.

- Unsafe equipment becomes `safety_closed`.
- An existing `open` maintenance request for that equipment remains unchanged as `open`.
- While the equipment remains `safety_closed`, that open request cannot be scheduled.
- Safety closure does not retroactively change an already `completed` request.

The outstanding maintenance request and the equipment safety state are separate business facts: the fault may remain outstanding while equipment safety determines whether scheduling is currently permitted.

## Clear a safety closure

After a later safety inspection, an authorized safety inspector may clear a safety closure.

- The equipment becomes `available`.
- Clearing the equipment does not itself schedule or otherwise change an existing open maintenance request.
- Once equipment is available again, an authorized maintenance coordinator may schedule its open request under the ordinary scheduling rules above.

## Business behavior not decided by this design

The current design does not define additional policy for:

- a request that is already `scheduled` when equipment becomes safety-closed;
- reporting a new fault while equipment is already safety-closed;
- repeated safety closure or repeated clearing;
- clearing an unknown equipment identity;
- audit history or notifications;
- offline or externally reported completion.

These are not required behaviors for the current design.