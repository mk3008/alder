# Beta provider stage

## Files read during this stage
- REQUEST.md
- acceptance.test.mjs
- entry.mjs
- alpha.mjs

No files outside the assigned workspace were inspected. No accidental outside-context exposure occurred.

## Design and current changes
Added beta.mjs implementing the existing provider book/cancel interface. Beta owns its endpoints, API-key authentication, kilograms conversion, JSON payloads, and status/response validation. Its internal POST helper shares only Beta's actual common request and response rules.

Updated entry.mjs to construct the two provider clients, validate optional provider selection before network activity, and default to Alpha only when the provider property is absent. Every stored and returned record includes its provider. Cancellation selects the client using that stored value, retaining stable routing across mixed-provider bookings. The single record map continues to enforce globally unique trimmed IDs.

Alpha's client is unchanged. Validation, defensive copies, local state mutation after successful remote responses, and existing scope limits remain intact. No public provider-registration abstraction or speculative provider policy was added. A failed network request does not assert that remote work was undone.

REQUEST.md, acceptance.test.mjs and check.py were not modified.

## Checks and corrections
Ran `python3 check.py` once in this stage. All syntax checks and all 11 acceptance tests passed. Evidence is saved in `.audit/check-001.json` by the supplied check runner.

No intermediate failures occurred and no correction rounds were needed. No other verification commands were run.
