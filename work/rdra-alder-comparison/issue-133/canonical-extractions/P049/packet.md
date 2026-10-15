## Artifact 001
# 購入申請・承認の業務設計書（草案・要確認）

この草案はヒアリング結果と固定Human answerに基づく。人による内容確認は未了。

**未確認事項（申請の決定）**: APIに渡された `role` の値だけで決定権限を判断してよいか。それとも、実際の課長・部長の本人性と役職を別途確認する必要があるか。後者なら、誰のどの情報で確認し、確認できない決定をどう扱うかを決める必要がある。現在確認済みなのは、金額に対応しない役割の決定を403で拒否することまでである。

# Scope

社員の購入申請受付、金額に応じた課長または部長による承認・却下、および承認済み申請を購入へ引き渡せる条件までを対象とする。購入実行と購入結果の申請者への連絡は今回のAPI実装範囲外。業務全体では、購買担当が承認後だけ購入し、却下時は購入せず、購入結果を申請者へ伝え、金額と物品を記録する。

既存公開REST APIと既存schemaを維持する。実装にはTypeScriptとPostgreSQLを使用する。framework、layer構成、Repository/Service等の指定はない。これらの技術条件は業務上の承認条件を追加しない。

# Object 申請者

## Scope

false

## Icon

user

## Information

- 購入したい物品
- 申請金額
- 受付結果

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
- 承認または却下の決定
- 指定された役割（managerまたはdirector）
- 決定結果

# Activity 購入申請の受付

## Scope

true

## Why

社員の購入希望を、決定対象となる申請として受け付ける。

## When

社員が購入申請を出すとき。

## Who

社員

## Where

公開REST APIの `POST /purchase-requests`。

## How

### Input

- 申請者 — `amount_yen` と `item` を含む購入申請

### Procedure

1. 社員は申請者として `amount_yen` と `item` を提出する。`amount_yen` は0以上の整数、`item` は空でない文字列とする。
2. 有効な申請について、購入申請に金額と物品を記録し、一意の申請IDを付け、状態を `pending` とする。既存の `purchase_requests` は `id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY`、`amount_yen integer NOT NULL CHECK(amount_yen>=0)`、`item text NOT NULL CHECK(length(item)>0)`、`status text NOT NULL CHECK(status IN ('pending','approved','rejected'))` を維持する。
3. 申請者へ201でIDと `status=pending` を返す。

### Exception

- 入力が不正な場合は400を返し、申請を受け付けない。

### Output

- 購入申請 — ID、金額、物品、`pending` の状態
- 申請者 — 201、ID、`status=pending` の受付結果

## Result

有効な申請が `pending` として成立し、金額に応じた決定の対象になる。

# Activity 購入申請の決定

## Scope

true

## Why

申請金額に対応した役割の承認または却下を確定する。

## When

`pending` の購入申請について決定が提出されたとき。

## Who

決定者

## Where

公開REST APIの `POST /purchase-requests/{id}/decision`。

## How

### Input

- 決定者 — 対象ID、`decision=approved` または `rejected`、`role=manager` または `director`
- 購入申請 — 対象申請の金額、物品、状態

### Procedure

1. 決定者は対象ID、決定、役割を提出する。対象の購入申請を参照し、金額と現在の状態を確認する。
2. 10万円未満は課長（`manager`）、10万円以上は部長（`director`）だけが承認または却下を決定できる。追加の承認条件はない。
3. 対応する役割による決定で、対象が `pending` の場合、購入申請の状態を決定に応じて `approved` または `rejected` に更新する。成功時は200でIDと決定後の状態を決定者へ返す。

### Exception

- 金額に対応しない役割による決定は403で拒否する。
- 対象IDの申請が存在しない場合は404を返す。
- 既に決定済みの申請への再決定は409で拒否し、先の決定を維持する。

### Output

- 購入申請 — 確定した `approved` または `rejected` の状態
- 決定者 — 200、ID、決定後の状態

## Result

申請の承認または却下が確定する。`approved` となった申請だけが購買担当による購入へ進められ、`rejected` となった申請は購入しない。

## Artifact 002
[method metadata removed]

確認したい点は一つです。**決定APIの `role` 値だけで課長・部長の権限を判断してよいですか。それとも実際の本人性と役職の照合が必要ですか。** 後者なら確認に使う情報と確認不能時の扱いが必要です。購入実行・結果連絡の具体的方法は今回のAPI実装範囲外として保留しています。

草案全文：

# 購入申請・承認の業務設計書（草案・要確認）

この草案はヒアリング結果と固定Human answerに基づく。人による内容確認は未了。

**未確認事項（申請の決定）**: APIに渡された `role` の値だけで決定権限を判断してよいか。それとも、実際の課長・部長の本人性と役職を別途確認する必要があるか。後者なら、誰のどの情報で確認し、確認できない決定をどう扱うかを決める必要がある。現在確認済みなのは、金額に対応しない役割の決定を403で拒否することまでである。

# Scope

社員の購入申請受付、金額に応じた課長または部長による承認・却下、および承認済み申請を購入へ引き渡せる条件までを対象とする。購入実行と購入結果の申請者への連絡は今回のAPI実装範囲外。業務全体では、購買担当が承認後だけ購入し、却下時は購入せず、購入結果を申請者へ伝え、金額と物品を記録する。

既存公開REST APIと既存schemaを維持する。実装にはTypeScriptとPostgreSQLを使用する。framework、layer構成、Repository/Service等の指定はない。これらの技術条件は業務上の承認条件を追加しない。

# Object 申請者

## Scope

false

## Icon

user

## Information

- 購入したい物品
- 申請金額
- 受付結果

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
- 承認または却下の決定
- 指定された役割（managerまたはdirector）
- 決定結果

# Activity 購入申請の受付

## Scope

true

## Why

社員の購入希望を、決定対象となる申請として受け付ける。

## When

社員が購入申請を出すとき。

## Who

社員

## Where

公開REST APIの `POST /purchase-requests`。

## How

### Input

- 申請者 — `amount_yen` と `item` を含む購入申請

### Procedure

1. 社員は申請者として `amount_yen` と `item` を提出する。`amount_yen` は0以上の整数、`item` は空でない文字列とする。
2. 有効な申請について、購入申請に金額と物品を記録し、一意の申請IDを付け、状態を `pending` とする。既存の `purchase_requests` は `id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY`、`amount_yen integer NOT NULL CHECK(amount_yen>=0)`、`item text NOT NULL CHECK(length(item)>0)`、`status text NOT NULL CHECK(status IN ('pending','approved','rejected'))` を維持する。
3. 申請者へ201でIDと `status=pending` を返す。

### Exception

- 入力が不正な場合は400を返し、申請を受け付けない。

### Output

- 購入申請 — ID、金額、物品、`pending` の状態
- 申請者 — 201、ID、`status=pending` の受付結果

## Result

有効な申請が `pending` として成立し、金額に応じた決定の対象になる。

# Activity 購入申請の決定

## Scope

true

## Why

申請金額に対応した役割の承認または却下を確定する。

## When

`pending` の購入申請について決定が提出されたとき。

## Who

決定者

## Where

公開REST APIの `POST /purchase-requests/{id}/decision`。

## How

### Input

- 決定者 — 対象ID、`decision=approved` または `rejected`、`role=manager` または `director`
- 購入申請 — 対象申請の金額、物品、状態

### Procedure

1. 決定者は対象ID、決定、役割を提出する。対象の購入申請を参照し、金額と現在の状態を確認する。
2. 10万円未満は課長（`manager`）、10万円以上は部長（`director`）だけが承認または却下を決定できる。追加の承認条件はない。
3. 対応する役割による決定で、対象が `pending` の場合、購入申請の状態を決定に応じて `approved` または `rejected` に更新する。成功時は200でIDと決定後の状態を決定者へ返す。

### Exception

- 金額に対応しない役割による決定は403で拒否する。
- 対象IDの申請が存在しない場合は404を返す。
- 既に決定済みの申請への再決定は409で拒否し、先の決定を維持する。

### Output

- 購入申請 — 確定した `approved` または `rejected` の状態
- 決定者 — 200、ID、決定後の状態

## Result

申請の承認または却下が確定する。`approved` となった申請だけが購買担当による購入へ進められ、`rejected` となった申請は購入しない。
