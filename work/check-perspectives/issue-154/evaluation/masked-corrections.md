# Blinded evidence corrections

This is an overlay on the original masked scores and review; those files remain unchanged. It applies the same frozen rubric to two specified points. The arm key remains withheld. These are meaning-evidence judgments, not human business approval.

## Purchase request: X X-02 has an equivalent in Y

X X-02 separately checks that approval, rejection, and purchase results attach to the selected application without changing another application's state as that result. The purchase BD says applications are uniquely identifiable and repeatedly assigns each outcome to the target application. The separate presentation is useful and keeps its **same-meaning-view** category within X.

The original comparison overstated uniqueness. Y's “接続・代表場面と境界” explicitly says that with one or multiple applications, a unique target is selected and each result is established **only for that target**, citing Y A1-04, A2-01, A3-01, and A4-01. That is the same target-isolation guarantee at the business-result level. A standalone Check ID is not necessary for cross-output semantic coverage. Corrected unique meaning gain for X X-02: **none**. This does not add any concurrency, rollback, or implementation guarantee to either output.

Exact evidence: X main table X-02, “別の申請の状態をその判断結果として変更しない”; Y footer second bullet, “1件・複数件は、どの場合も一意な対象を選び、その対象にだけ各結果を成立させる範囲を`A1-04`、`A2-01`、`A3-01`、`A4-01`で扱う。” BD “購入申請” says “購入申請は一意に識別できるものとする” and the Outputs of businesses 2–4 each refer to “対象購入申請”.

## Facilities maintenance: X A3-04 detail narrows the BD incorrectly

The main-table A3-04 says an otherwise valid completion is not blocked **merely** because it is earlier than the planned time. That is grounded in BD business 3. Its detail, however, says the completion time must not fall under a restriction of “報告日時以前”. “以前” includes equality; the BD's exact restriction is “報告日時より前になることはない”, which excludes only times **before** the report. Thus the detail silently changes “completion time ≥ report time” to “completion time > report time.” Equality is not prohibited by this BD boundary.

This is a narrow **unsupported detail subclaim / unauthorized stricter boundary**. Retain the main-table A3-04 as **direct**; do not mark the whole Check invalid. A source-faithful detail would say “報告日時より前という別の制限には当たらない,” or simply state that completion time is not earlier than report time. The correction does not determine how inconsistent timestamps or offline work should be handled.

Exact evidence: facilities X A3-04 main table, “完了日時が予定日時より前であることだけを理由に、完了を妨げない”; X A3-04 detail, “報告日時以前という別の制限には当たらない”; facilities BD business 3, line 203, “予定日時より前に作業が完了してもよい。ただし、業務上の完了日時が故障の報告日時より前になることはない。”

## Net effect

Remove X X-02 from purchase X's unique cross-output meaning gains, while retaining it as a separately displayed useful check. Add one narrow grounding mismatch to facilities X A3-04's detail. The original evaluation artifacts are retained for audit, and no new generation or arm identification was used.
