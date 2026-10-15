# Synthetic order registration: Business Design and confirmed Checks

All organizations, people, decisions and product revisions in this fixture are
invented. Revision labels below identify source content inside this fixture;
they are not Git commit hashes. The surrounding repository commit or a recorded
file-digest snapshot pins the actual bytes.

## Business Design BD-1, agreed 2026-10-01

### Scope and Objects

The order desk records a partner's purchase-order reference and hands the saved
order identifier back to the submitting clerk. A partner is the business that
issued the reference. An order has a saved order identifier, partner, and external
reference. Partner selection and authorization are performed upstream and are
outside this local prototype. Inputs are already nonempty strings. Two partners
can issue the same external reference independently.

### Activity: Record a partner's order

- Why: Let the order desk recognize a repeated submission without suppressing a
  different partner's genuine order.
- Who / When: The order clerk, after selecting the partner and its order reference.
- Input: The selected partner and its external reference.
- Procedure: If that partner already has that exact reference, reject the
  additional order without creating a record. Otherwise save one order and return
  its saved order identifier and the external reference unchanged.
- Output: Either a created order with its identifier and reference, or a duplicate
  response without a new order identifier.
- Result: The clerk can distinguish a saved order from an unrecorded repeat.

BD-1 §Record explicitly permits the same external reference for different
partners. It does not select a table layout, key type, database engine or backup
mechanism. Cancelling orders, reference edits, migration, concurrency and operator
recovery are outside this prototype's agreed business scope.

### Activity: Show the receipt

- Who / When: The receipt formatter, when given the saved identifier and reference.
- Input: The identifiers already returned for a created order.
- Procedure / Output: Display exactly `Order {order_id}: {external_ref}`; retain both
  values. This function does not open storage or claim the order was newly saved.
- Result: The clerk can quote the saved identifier together with the partner's
  reference. Duplicate responses are handled by the caller and not passed here.

## Check list CK-1, confirmed 2026-10-02

The synthetic business owner Rika confirmed all three expectations below. This is
fixture input, not a claim of a real person's approval. IDs, expectations and the
Confirmed state must not be changed by this read-only review.

| ID | Source | Condition | Expected result | Human state |
| --- | --- | --- | --- | --- |
| CHK-01 | BD-1 §Record | Submit a reference already saved for that partner | Return duplicate, no new identifier, and no additional order record | Confirmed |
| CHK-02 | BD-1 §Record | Submit a reference saved only for a different partner | Save an independent order and return a different saved identifier | Confirmed |
| CHK-03 | BD-1 §Show the receipt | Give the formatter saved identifier 17 and reference PO-17 | Return exactly Order 17: PO-17; preserve supplied identifier and reference | Confirmed |

Candidate mapping for inspection (not a coverage verdict): CHK-01 →
`test_order_register.RegistrationTests.test_same_partner_reference_is_rejected`;
CHK-02 → `test_order_register.RegistrationTests.test_other_partner_may_reuse_reference`;
CHK-03 → `test_order_register.ReceiptTests.test_receipt_preserves_saved_identifiers`.

## Implementation snapshot IMPL-1

- `order_register.py`: complete prototype implementation and its inline SQLite DDL.
- `test_order_register.py`: representative tests; assertion meaning must be read.
- `execution.txt`: actual local fixture execution E-1, only when selected by the
  current case. It establishes no deployment, load, durability or recovery result.
- All cases use BD-1, CK-1 and IMPL-1 unchanged unless the selected case says otherwise.
- Review the one case selected by the caller. Other cases describe mutually
  exclusive products/handoffs and are not additional requirements for this case.
