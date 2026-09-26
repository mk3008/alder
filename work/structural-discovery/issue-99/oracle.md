# Issue #99 sealed structural oracle

Fixed before customer/designer/discovery outputs. This file is excluded from their allowed inputs.

## Target observation

Resident lending and repair classes each make a commitment against the same finite, individually identified drill-set pool for overlapping intervals, but the commitments are represented and checked at different stages and granularity. Lending selects and promises a particular set using its dated ledger; classes promise an event requiring a quantity of sets while assigning identifiers only during preparation. The class plan is visible but is not a dated reservation in the lending check, and the class procedure does not routinely check future loan allocations when locking the required quantity. Physical shelf and maintenance status address present usability, not both future commitments. The later school event moves custody of four sets from Friday noon through Saturday evening, extending the shared availability interval beyond the class's nominal teaching hours.

The structural opportunity to surface is a cross-business allocation/commitment boundary for equipment availability by interval and quantity, with explicit transitions from proposed demand to confirmed commitment to identified set and return/maintenance release. A reviewer should ask who is allowed to commit shared capacity and at which point, how priorities and substitutions are decided, and how changes are propagated to affected resident or class commitments. It is a hypothesis for human confirmation, not an assertion of measured failures or a prescribed software implementation. The current activities work independently and on many dates can coexist; the oracle does not depend on a recorded incident.

## Minimum Business Design support facts

1. One physical, numbered drill-set pool serves both loans and courses, including the new school course; physical use and custody intervals cannot overlap for the same set.
2. Loan intake records dated promises and normally assigns a specific set before pickup, checking the lending ledger and maintenance status.
3. A course fixes time and required set count, communicates the event to participants, but selects specific identifiers only at preparation; ordinary class demand is in a class schedule and is not entered as per-item loan reservations.
4. Course preparation does not routinely cross-check future dated loan allocations when locking the required quantity; the two records are visible but used for distinct work.
5. Maintenance temporarily removes a set from use and releases it after inspection; on-site physical presence does not alone imply future availability.
6. School delivery adds Friday noon to Saturday evening custody for four sets, while loan periods may include Friday through Monday; it uses the existing pool. The new operating rule for this interaction remains a question for the business owner.
7. Resident and course notifications are meaningful commitments; priority and approval for changes remain undecided. Do not infer customer dissatisfaction, exact frequency, monetary loss, or a fixed inventory size.

If the final design omits any core relation in items 1–4 or 6, classify a missed discovery separately as interview, authoring, or representation insufficiency. A hypothesis grounded in the initial ordinary class overlap can count even if the later case is omitted, but the design update should separately preserve the added custody interval.

## Negative control

The lending handover check and course pre-use check may look like repeated inspections of the same tool. Do not conclude they should simply be merged or eliminated: the former documents condition and accessories mutually with the resident for return accountability; the latter has an instructor validate the group teaching setup, protective equipment, and workspace before instruction. Both also follow the maintenance functional inspection. A good analysis may ask which evidence is shared or copied, while preserving the different actor, moment, purpose, and record of each check. The distinct records are not evidence of a redundant business activity by themselves.

## Evaluation guidance

Credit discovery that reaches the same underlying temporal capacity/commitment structure with evidence from both services, even if it frames the design as an invariant, availability policy, reservation stage, or cross-business allocation question. Do not require the words "single ledger" or an implementation proposal. Do not credit generic calls for integration, ungrounded collision claims, a narrow missing field in one activity, or a recommendation to merge the two usage checks without their separate purposes. Favor questions an owner can answer about commitment timing, priority, substitutions, change authority, and notification.
