# Synthetic tool-return implementation

This is one bounded local example using the fixed mock decisions, not actual user business acceptance or production readiness.

## Run

From this workspace:

```sh
PYTHONDONTWRITEBYTECODE=1 python run_tests.py
# Standard unittest discovery is also supported:
PYTHONDONTWRITEBYTECODE=1 python -m unittest discover -s tests -v
```

## Interface and rationale

`tool_return.receive_return(records, loan_id, tool_number=..., accessories=..., received_at=...)` operates on one existing `LoanRecord` selected by dictionary key. The caller supplies a timezone-aware `datetime`; the first successful return is recorded in UTC. The returned `ReceptionResult` is available directly to the calling counter (`窓口`). There is no notification delivery mechanism.

The loan record holds its borrowed group's return state for this in-memory example. A recorded return time is the single source of truth for receipt confirmation. A matching return sets inspection-pending and non-loanable state. A number mismatch, pure accessory shortage, or both produces 要確認 without recording a return time or changing inspection state. Reprocessing never overwrites an existing first return time, including mismatching reprocessing. A failed reprocessing result does not erase a previously confirmed receipt.

Accessory strings are opaque, distinct fixture tokens. The example compares them only to the selected loan's recorded tokens. Their real-world assignment, equivalence, quantities, tolerances, substitutes, and physical inspection are not defined here. A pure shortage contains only known tokens and omits one or more. Extras/substitutions, repeated labels, and an empty issued list are outside the callable example domain. `OutsideExampleScope` is a technical boundary exception with no reception outcome, not a newly decided 要確認 route or a refusal policy for those inputs. Scope validation occurs before state changes and before returning a reception result.

The two loan fixtures are synthetic. Existing-loan lookup and registered-resident status are preconditions; the module does not implement registration, new loans, authentication, or an unknown-loan reception workflow. Missing loans also raise the technical boundary exception.

## Verified and deferred

The tests exercise matching reception; first-time recording; inspection-pending/non-loanable state; mismatch, shortage, and combined failures; receiving 要確認 at the counter; replay with later and earlier supplied times; mismatch after prior receipt; correct selected-loan isolation; UTC normalization; naive/invalid time rejection; and exclusion boundaries. Boundary assertions are technical safeguards, not new business Check Items.

Still unresolved and excluded: actual responsibilities and permissions, notification/storage responsibilities, physical handoff, investigation and re-reception procedures, and accessory extras/substitutions/quantity semantics. Lending, inspection work, repairs, charges, real data, UI, persistence, concurrency, and production operations are not implemented.

The design, Checks, decisions, and system requirements remain unchanged. No Check-to-Test mapping was added, and no independent Alder implementation review or business approval was performed.
