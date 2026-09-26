# Acceptance traceability

This ledger is introduced by Protocol Amendment 001. `Current test location` is the post-review repair suite for Stage 1+2; it is not evidence that the original runs were cumulative.

The current full active suite is `work/business-process-dogfood/frozen-tests/cumulative-stage6-v4.test.js`; it executes the still-active covered conditions through Stage 6 (PostgreSQL 6/6 pass after the adopted Stage 6 refactoring). The table retains earlier listed locations to show when each condition first became executable; those locations do not replace the current suite.

| requirement / decision | rule | first stage | status | current test location | note |
| --- | --- | --- | --- | --- | --- |
| Quotation creation; nonblank identifiers; future expiry | HD-003, BR-004 | 1 | active | `work/business-process-dogfood/frozen-tests/cumulative-stage2-repair.test.js` | includes invalid customer/product and NaN cases |
| Quotation has one or more lines; duplicate products allowed | HD-002, BR-005 | 1 | active | `cumulative-stage2-repair.test.js` | duplicate is accepted |
| Read/search expired quotation; exact deterministic search | HD-001, HD-004 | 1 | active | `cumulative-stage2-repair.test.js` | expiry is based on statement time |
| Revise only eligible quotation before conversion | HD-007 | 2 | active | `cumulative-stage2-repair.test.js` | header and lines are coherent |
| Quotation-to-Order conversion; one canonical association; atomic ordered/read-only result | BR-001, BR-006 | 2 | active | `cumulative-stage2-repair.test.js` | second conversion rejected |
| Direct and sourced Orders have one or more lines | BR-008 | 2 | active | `cumulative-stage2-repair.test.js` | direct order is allowed |
| Sourced Order is conversion-time snapshot | BR-002, BR-009 | 2 | active | `cumulative-stage2-repair.test.js` | post-conversion source mutation is no longer a normal-operation property under HD-007 |
| Initial status and approval routing by inclusive threshold | HD-011, BR-012 | 3 | active | `cumulative-stage3-v2.test.js` | high-value direct and sourced Orders enter pending approval; low value is draft |
| Creator/manager separation and Sales confirmation | HD-010, BR-010, BR-011 | 3 | active | `cumulative-stage3-v2.test.js` | self decision rejected; approved high value confirms; rejected/pending does not |
| Exact Order total, round-once semantics, no old precision overflow | HD-012, BR-013 | 3 | active | `cumulative-stage3-v2.test.js` | includes below/equal/above threshold and a former-precision-overflow total |
| Approved unconfirmed Order revision invalidates approval and re-evaluates threshold | HD-013, BR-014 | 4 | active | `work/business-process-dogfood/frozen-tests/cumulative-stage4-v2.test.js` | covers above/below/equal threshold, confirmation gating, and reapproval |
| Approval invalidation applies to changed content even with equal total; sourced Quotation remains independent | HD-013, BR-014 | 4 | active | `cumulative-stage4-v2.test.js` | equal-total changed-lines and source snapshot comparison |
| Confirmation atomically creates one requested reservation | HD-014, BR-015 | 5 | active | `work/business-process-dogfood/frozen-tests/cumulative-stage5.test.js` | covers current eligible low/high confirmation paths |
| Trusted inventory result authority and requested result transitions | HD-014, BR-017, BR-018 | 5 | active | `cumulative-stage5.test.js` | rejects Sales result; covers requested→reserved and requested→failed |
| Commercial Order stays confirmed after reservation result; conflicting terminal result rejected | HD-014, BR-016, BR-018 | 5 | active | `cumulative-stage5.test.js` | no retry/recovery/release behavior is claimed |
| Sales cancellation eligibility and immediate commercial result | HD-015, BR-019 | 6 | active | `work/business-process-dogfood/frozen-tests/cumulative-stage6-v4.test.js` | non-Sales rejection is exercised while confirmed/unshipped; fixture establishes trusted `shipment_at` directly |
| Cancellation with failed or reserved reservation | HD-016, BR-020 | 6 | active | `cumulative-stage6-v4.test.js` | failed remains failed; reserved creates release_requested and stays pending until trusted completion |
| Cancelled requested reservation handles late failed/reserved without restoring Order | HD-016, BR-021 | 6 | active | `cumulative-stage6-v4.test.js` | late reserved reaches release obligation then released; independent fake records held inventory |
| Trusted release authority and eventual observed cleanup in covered paths | HD-016, BR-022 | 6 | active | `cumulative-stage6-v4.test.js` | Sales completion rejection is tested while release_requested; final assertions inspect local state and independent fake |

## Superseded/removed observation

| old condition | superseding decision | new condition | why old condition is no longer required | property removed |
| --- | --- | --- | --- | --- |
| Revise a source Quotation after conversion and prove its Order does not change | HD-007 | Test conversion-time copy and post-conversion Quotation immutability | sourced Quotations are read-only after conversion | normal-operation post-conversion source revision |
