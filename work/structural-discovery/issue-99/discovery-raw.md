# Structural Discovery: みなと道具室 Business Design 第4草案

The design is explicitly **未合意** and lists unresolved rules. This analysis describes structural dependencies and possible opportunities for investigation. It asserts no observed delays, conflicts, losses, frequencies, or measured benefits beyond the stated schedules and quantities. A question is answered by the people doing the work and, where applicable, by comparing the named records and physical items.

## 1. Shared inventory has several demand signals but no settled common allocation point

**Present structure.** The Scope says resident loans, ordinary classes, and monthly school classes use the organization's tools; the school class uses current stock without dedicated purchases. `団体の工具` is explicitly shared between loans and classes. In `貸出申込と工具の割当`, When is the resident's request; the counter checks `貸出台帳` and shelf/repair tags, chooses a specific available asset number, and tells the resident a pickup plan. Its Procedure says the counter can view tool types and counts on `講座予定表`, but no routine check at application is settled; class asset numbers are not transcribed as loan plans. `通常の修理講座の予定と参加受付` fixes type/count on Wednesday noon, leaving numbers undecided. `通常講座の工具取揃え` selects numbers Friday afternoon. `出張講座の箱詰め` packs four drill sets Friday noon, earlier than ordinary selection. The first and sixth 未確認事項 expressly leave priorities, reassignment approval and communication unresolved, including an allocation between Wednesday and Friday.

**Opportunity hypothesis.** A jointly visible view of demand by time, tool type/count, assigned number, and physical availability, with an agreed allocation decision moment, *might* make clashes detectable before pickup or packing. This is a candidate operating rule or shared view, not a recommendation to give any channel priority or a claim that clashes have occurred.

**Unknowns.** Actual number of usable drill sets and overlapping dates, whether the same four can support all uses, how far ahead residents request, when class requirements change, whether an assigned number can be changed, who can decide, and what authoritative record holds the assignment.

**Human-verifiable questions.** For a chosen week containing a school class, can counter and class staff reconstruct every promised period, type/count, and number from the ledger, class schedule, records and physical shelf? At what exact event does a numbered set cease being available to another use? Who decides and informs residents and instructors when the promises cannot all be met?

## 2. Planned quantities become individual assets at different times

**Present structure.** `講座予定表` contains date, venue, instructor, and required types/counts; `通常の修理講座の予定と参加受付` Result explicitly says individual numbers are not yet decided after Wednesday confirmation. `点検票` contains numbers and accessories selected before class; `通常講座の工具取揃え` creates that list Friday afternoon. `出張講座の箱詰め` When is Friday noon for four sets, yet its Result says the person and time for securing particular numbers are unknown. `貸出申込と工具の割当` produces a number and pickup plan, while its record destination is unknown; `工具の受取と貸出` relies on that earlier number.

**Opportunity hypothesis.** Explicitly distinguishing a type/count request, a tentative selection, a committed number and a handed-over physical set *might* make the commitments legible to the next activity. No particular reservation mechanism is established in the design.

**Unknowns.** Whether tools can be reserved before picking, whether the Friday noon packed sets are removed from the shelf or marked unavailable, how changes are recorded, and whether `点検票` is used for school classes.

**Human-verifiable questions.** Can staff trace one numbered set from assignment through pickup or packing without relying on memory? What currently signals to the counter that a packed set is unavailable? What record and person resolve a mismatch between a scheduled count and the numbers physically present?

## 3. Availability depends on a recorded state and physical evidence

**Present structure.** `貸出申込と工具の割当` checks shelf condition and the repair tag as well as loan plans. `通常講座の工具取揃え` excludes tagged sets. In `工具の点検と整備`, the repair worker checks number, accessories and operation, records number/state/work in `整備記録`, tags unusable sets and removes them from both services, then records a return-to-use time for restored sets; each next use still has its own check. `団体の工具` holds physical state and tag; `整備記録` holds state, work and return time. 未確認事項 4 leaves repair triggers, waiting/unrepairable handling, approval after repair, and synchronization of record, tag and physical inspection open.

**Opportunity hypothesis.** A clear reconciliation event between the physical tag, tested item, and maintenance record *might* reduce disagreement about what may be selected. The design does not establish a single electronic status, a turnaround target, or that disagreements actually occur.

**Unknowns.** Who may remove a tag, whether the recorded return time precedes or follows physical placement on the shelf, how a set waiting for inspection is distinguished from a ready set, and what is done with unrepairable tools.

**Human-verifiable questions.** Walk one repaired number through test, record, tag removal, shelf placement and the next selection: who performed each step, when, and on what evidence? At a given time, can the physical shelf and maintenance record be reconciled for all tagged or returned sets?

## 4. Each use ends in a handoff to inspection, with different amounts of specification

**Present structure.** `工具の返却受付` has the counter match the loan number and accessories and record the return time, then leaves the returned set awaiting the repair worker; the transfer method is unknown. `通常の修理講座の実施と工具回収` has class staff receive all tools and pass them for inspection; its Output is the collected sets awaiting inspection. `学校での出張修理講座と工具の戻り` says tools return Saturday evening, while recipient, place, inspection transfer and count/accessory/protective-gear checks are unknown. `工具の点検と整備` accepts sets after all three kinds of use, but its Why and When explicitly say the school-to-worker handoff is unconfirmed.

**Opportunity hypothesis.** Named acceptance and custody points with number/accessory checks *might* close the gap from physical return to inspection and clarify when a set may enter the next allocation. The current design does not quantify missing tools or delays.

**Unknowns.** Locations, recipients, record media, and custody during each wait; whether the school return can be inspected before another promised use; whether protective gear is included in any return and inspection record.

**Human-verifiable questions.** For each return path, who last holds the tools, who accepts them next, what count or item list is compared, and where is acceptance evidenced? Can an example school-class set be traced from Friday packing through Saturday evening return to its maintenance record and next use?

## 5. The school trip adds a custody chain across places and days

**Present structure.** `出張講座の箱詰め` names class staff as Who, and its Procedure says class staff and instructor pack four drill sets plus protective gear in the tool room at Friday noon. It says they are transported to school, but carrier, numbered allocation, condition check, storage and transfer are unknown. `学校での出張修理講座と工具の戻り` takes place Saturday 13:00–15:00 at a neighboring school and returns tools Saturday evening. Its Who notes on-site execution/return roles are unknown; before-use and end checks are unknown. `保護具` is an in-scope object for packing, but the school activity's Output names only returned drill sets and its Result leaves protective-gear return unconfirmed.

**Opportunity hypothesis.** One trip manifest that follows numbered sets, accessories and protective gear through packing, transit, school receipt and return *might* make custody and completeness verifiable. This is an investigative possibility; the design does not require a particular form or specify the protective-gear quantity.

**Unknowns.** Carrier, storage security and access, school recipient, instructor's on-site role, protective-gear amount and condition standard, any differences between school and normal class checks.

**Human-verifiable questions.** Who can physically show the four numbered sets and protective gear at each handoff? What signed or otherwise observable evidence confirms the school received them and the tool room got them back? Is there a documented count of protective gear on both Friday and Saturday?

## 6. School notification is timed, while the plan and confirmation feeding it are unspecified

**Present structure.** `学校への出張講座開催通知` requires a notice by the preceding Friday, but Who is `通知担当（未確認）`, Input is `(none)`, and venue route, contents, changes, receipt and conditions for confirmed holding are unknown. `講座予定表` has date, venue, instructor and required type/count, while 未確認事項 5 asks whether ordinary Wednesday noon signup/count confirmation and schedule recording also apply to the school class. The Scope fixes monthly Saturday afternoon school classes starting next month, and the school activity fixes 13:00–15:00, without specifying how dates, instructor and school are coordinated.

**Opportunity hypothesis.** Identifying the agreed event details and owner that authorize a notice, plus how receipt or changes are handled, *might* connect the school-facing commitment to preparation. This does not presume the school already accepts every proposed date.

**Unknowns.** How and when a school date becomes agreed, who sends and receives notice, what school response is necessary, how a changed date propagates to reservations, packing and staff, and whether the ordinary class schedule is authoritative for school sessions.

**Human-verifiable questions.** For the next intended school visit, who can show the agreed date, instructor, school, and notice contents before the preceding Friday? How does the sender know it was received? If the school changes the date after notice, who updates which commitments and informs whom?

## 7. Several records cover adjoining stages, but their links and authoritative fields are unresolved

**Present structure.** `貸出台帳` holds expected loans by desired period; `貸出・返却の記録` holds signature, handover, matching and return time; `講座予定表` holds time/venue/instructor/type/count; `点検票` holds pre-class selected numbers/accessories; `整備記録` holds number, condition, work and return-to-use time. These are distinct in-scope objects. `貸出申込と工具の割当` does not specify where the number and pickup plan are recorded, while `工具の受取と貸出` needs the previous allocation; the return activity says the record medium is unknown. The ordinary-class numbers in the inspection sheet are explicitly not copied to loan plans.

**Opportunity hypothesis.** A shared way to relate asset number and time across these existing records *might* support cross-service tracing and reconciliation. It need not imply one database or replacement of current documents.

**Unknowns.** Actual media, identifiers, update timing, access rights, edit ownership, whether these objects are already cross-referenced, and which record wins when a sheet and an item disagree.

**Human-verifiable questions.** For one real asset number, can staff reconstruct planned loan/class use, actual handover, return, inspection and readiness from the named records? Which record holds the committed pickup plan today, and who updates it on a change?

## 8. Class completion checks and readiness for reuse are separate decisions

**Present structure.** In ordinary classes, the instructor checks sets, protective gear and workspace before use; afterward class staff receive all tools. `通常の修理講座の実施と工具回収` says any completion criteria beyond total count are unconfirmed. The school class does not yet specify use-before and end checks. `工具の点検と整備` separately checks accessories and operation after use and records availability, while repaired items also require a still-unconfirmed permission procedure. The respective Results establish class completion/return and maintenance state as successive outcomes, not the same recorded event.

**Opportunity hypothesis.** Defining what the instructor, class staff and repair worker each verify at their own handoff *might* prevent ambiguous completion and reavailability decisions. No conclusion about actual safety performance follows from the design.

**Unknowns.** Required checks for each class, whether missing accessories block a completed class or a ready status, whether the instructor or class staff signs off, and the criteria for making repaired items available.

**Human-verifiable questions.** What evidence marks an ordinary or school class complete when all numbered tools are back but an accessory or protective item is unresolved? Who makes the distinct decision that a returned set is safe and available for the next resident or class?

## 9. Timing exposes decision dependencies around Wednesday, two Friday milestones and Saturday

**Present structure.** Ordinary class attendance and tool types/counts are confirmed Wednesday noon (`通常の修理講座の予定と参加受付`); school packing is Friday noon (`出張講座の箱詰め`); ordinary numbered selection is Friday afternoon (`通常講座の工具取揃え`); ordinary use is Saturday 10:00–12:00 and school use is Saturday 13:00–15:00 (`通常の修理講座の実施と工具回収`, `学校での出張修理講座と工具の戻り`). Resident loans can be requested for a period covering these events. The notice is due by the Friday of the prior week. The design does not say every ordinary and school class occurs on the same Saturday, nor that a set used at 10:00 can be inspected and moved to the school by 13:00.

**Opportunity hypothesis.** Testing a concrete calendar with actual usable inventory and required turnaround *might* reveal which decision and preparation deadlines need to be coordinated. The close clock times alone do not prove a shortfall or a feasible same-day reuse.

**Unknowns.** Whether school and ordinary classes coincide, class venues and travel time, quantity of usable sets, actual loan periods, inspection capacity and timing, and how changes after each deadline are handled.

**Human-verifiable questions.** For the first planned school Saturday, put each promised set on a time line from loan planning through maintenance readiness. Is a given set physically and procedurally available at Friday noon, Friday afternoon and each Saturday start? What decision is needed first if demand exceeds the eligible sets?

## Decision questions to resolve with the participants

1. **Allocation:** What priority and change authority applies when a resident loan, ordinary class and school class need the same type/count, including numbered promises between Wednesday and Friday? What record and notifications accompany a changed commitment? (未確認事項 1, 6; loan allocation, ordinary preparation, school packing.)
2. **Readiness:** How do staff determine and record available, awaiting inspection, under repair, repair impossible and restored states, in agreement with the physical tag? Who authorizes restored use? (未確認事項 4; `工具の点検と整備`.)
3. **School preparation:** Who coordinates date/instructor/school and sends the preceding-Friday notice; what response confirms it? When and by whom are four particular drill sets and the required protective gear secured and checked? (未確認事項 5, 6; notification and packing.)
4. **Custody:** Who handles each transfer from shelf to packing to school to tool room to repair worker, with what numbered/accessory/protective-gear reconciliation and record? (未確認事項 3, 7; returns, school trip and maintenance.)
5. **Completion:** What ends each class and what separately makes each used set ready for further service? Which normal-class signup and schedule rules extend to the school class? (未確認事項 2, 5, 7; ordinary and school execution.)

These are proposals for verification and decisions, not adopted rules. The design contains no measurement of current incidents, staff effort or improvement potential; those would require separate observation or records.
