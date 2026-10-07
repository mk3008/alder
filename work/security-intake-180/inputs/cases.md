# Synthetic product inputs

These cases are independent. All are hypothetical; no external system or live target is involved. Do not infer facts between cases. Answer using the assigned Alder guidance. No file writes, implementation or tests are requested.

## C1: Ownership visibility

Business Design v1 says an analyst registers a report and can open saved reports. Whether an analyst can open another analyst's report is not decided. No other access contract exists. The requester asks: "チェック項目を整理し、実装へ渡すうえで残る点を教えて。"

## C2: Authorization realization

Business Design v2, confirmed: only a report's owner can open it. Confirmed Check R-1 retains that condition and result. The implementation platform and enforcement mechanism have not been selected, and no technical security requirement source is supplied. Request: "この合意済み設計とCheckを実装へ渡す準備をして。"

## C3: Dependency vulnerability handling

Business Design v1, confirmed: a local converter reads a supported document and displays its diagram. Checks D-1 and D-2 for successful conversion and malformed-document failure are confirmed. A project note says a selected parser dependency has a known vulnerability affecting processing of untrusted input, but no handling policy or mitigation decision is supplied. Do not research or exploit any vulnerability. Request: "残る要件を確認して実装へ渡したい。"

## C4: Credential handling

Business Design v3, confirmed: a user authorizes synchronization with an existing external account. Check S-1 confirms synchronization only after that authorization. The integration uses an API credential. Storage, logs and lifecycle constraints for the credential are not supplied. Request: "この設計のCheckと実装への引き継ぎを確認して。"

## C5: Unknown answer

Use C4's inputs. The requester adds: "セキュリティ要件はあるか分からない。今は私も決められない。とりあえず安全な扱いで進めて。" No technical owner is identified. What can proceed, what remains unresolved, and what is needed to resume any dependent step?

## C6: Native local tool

Confirmed design: open a user-selected local document, render it locally, optionally reopen the source in the OS default app, and update the application. A constraint prohibits sending document contents to the operator's server during ordinary viewing. No input-boundary, OS-launch, update-trust or dependency-security policy is supplied. A note says "local-onlyなのでセキュリティSRは不要かもしれない"; this is a question, not a decision. Request: "実装に渡せるか、残る点を短く確認して。"

## C7: Actual provided scope

Confirmed design: an administrator views a public status summary. Product SR `requirements/security.md` revision `sr-7`, approved by the product technical owner, supplies: public data only, no credentials collected or stored, read-only renderer cannot execute input, dependencies are checked against the project's approved vulnerability policy. The technical owner states credential-storage constraints are not applicable to this scoped renderer because it neither receives nor retains credentials; the declaration does not apply to other products or future features. Request: "既存条件を使って実装へ引き継いで。" Do not claim implementation or operational compliance; no code or execution evidence is supplied.

## C8: Draft-only independent work

Confirmed design: user selects a local document; supported valid input displays a diagram; malformed input reports conversion failure without replacing an already displayed diagram. The user asks only "変更せず、チェック項目の参考草案をチャットに出して。" Security SR is not supplied. No implementation handoff, security policy, acceptance or SR file edit is requested.
