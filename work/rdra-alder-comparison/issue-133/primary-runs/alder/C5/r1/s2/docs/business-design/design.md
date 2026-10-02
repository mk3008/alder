# 購入申請・承認の業務設計書（草案・未合意）

この文書はヒアリング結果と固定Human answerに基づく確認用草案であり、業務上の合意は未了です。

**未確認事項:** 「承認・却下の決定」で、決定APIに渡された `role` の値と金額の一致だけを確認するのか、実際の決定者が課長または部長であることも確認するのか。後者が必要なら、誰の役職をどの情報で確かめるかの判断が必要です。現時点では本人・役職の確認方法を要件として確定しません。

# Scope

社員の購入申請受付、金額に応じた課長・部長による承認または却下、承認済みの申請だけを購買担当の購入対象とする引渡し条件を対象とします。購入実行、購入結果の申請者への連絡は今回のAPI実装範囲外です。購入後に金額と物品を記録する業務も、今回の引渡しまでの範囲には含めません。

既存の公開REST API `POST /purchase-requests` と `POST /purchase-requests/{id}/decision`、既存の `purchase_requests` schemaを維持します。実装上の指定はTypeScriptとPostgreSQLです。frameworkやlayer構成は指定されていません。

# Object 申請者

## Scope

false

## Icon

user

## Information

- 申請する金額と物品
- 受付時に受け取る申請IDと状態

# Object 購入申請

## Scope

true

## Icon

file-text

## Information

- 申請ID
- 金額（円）
- 物品
- 状態（pending、approved、rejected）

# Object 決定者

## Scope

false

## Icon

user-check

## Information

- 対象の申請ID
- 承認または却下の判断
- 決定APIに渡す役割（managerまたはdirector）
- 決定後の申請IDと状態

# Activity 購入申請の受付

## Scope

true

## Why

購入の判断対象となる申請を受け付ける。

## When

社員が購入申請を出すとき。

## Who

社員

## Where

公開REST API `POST /purchase-requests`。

## How

### Input

- 申請者 — 申請金額と物品

### Procedure

1. 社員は申請者から金額 `amount_yen`（0以上の整数）と物品 `item`（空でない文字列）を申請内容として提出する。
2. 有効な申請について、`purchase_requests` に申請ID、金額、物品、状態 `pending` を記録する。
3. 申請者にHTTP 201で申請IDと `status=pending` を返す。

### Exception

- `amount_yen` または `item` が指定条件を満たさない場合、HTTP 400を返し、申請を受け付けない。

### Output

- 購入申請 — 申請ID、金額、物品、pendingの状態
- 申請者 — 申請IDとpendingの状態

## Result

申請がpendingとして成立し、金額に対応する役割による承認・却下の決定を受けられる。

# Activity 承認・却下の決定

## Scope

true

## Why

購入申請を金額に応じた役割が承認または却下する。

## When

pendingの購入申請に対して決定が求められたとき。

## Who

課長または部長

## Where

公開REST API `POST /purchase-requests/{id}/decision`。

## How

### Input

- 決定者 — 対象の申請ID、`decision`（approvedまたはrejected）と `role`（managerまたはdirector）
- 購入申請 — 申請ID、金額、現在の状態

### Procedure

1. 課長または部長は決定者から対象の申請ID、判断と役割を提出し、購入申請の金額とpendingの状態を確認する。
2. 金額が10万円以上なら部長（`director`）、10万円未満なら課長（`manager`）だけがその申請を決定する。追加の承認条件はない。
3. 承認では状態を `approved`、却下では `rejected` に更新する。
4. 決定者にHTTP 200で申請IDと決定後の状態を返す。

### Exception

- 金額に対応しない `role` で決定しようとした場合、HTTP 403で拒否し、決定しない。
- 対象の申請IDが存在しない場合、HTTP 404を返し、決定しない。
- 既に決定済みの申請への再決定はHTTP 409で拒否し、決定しない。

### Output

- 購入申請 — approvedまたはrejectedの決定後の状態
- 決定者 — 申請IDと決定後の状態

## Result

承認なら申請はapprovedとなり、購買担当が購入してよい対象となる。却下ならrejectedとなり、その申請について購入しない。購入実行と結果連絡はこの範囲の後続業務である。
