## Artifact 001
# 購入申請・承認分岐の業務設計書（レビュー待ち草案）

本書はヒアリング結果 `source.txt` に基づく草案であり、業務上の未確認事項について合意前である。

**未確認の判断**

- **承認判断／購入申請**：決定時に申請がすでに `approved` または `rejected` の場合、再決定や変更を認めるか。認める場合、承認済み申請を却下へ変更すると購入への引渡しにどう反映するか。受付可能な状態と購買担当が信頼できる承認結果が変わる。
- **承認判断**：APIの `role` 値と実際の判断者の権限をどのように対応させるか。値の自己申告だけで決定を受け付けるのか、本人の役割を確認するのか。承認・却下の責任と許可される判断が変わる。
- **購入への引渡し**：承認後、誰が、どの時点で購買担当へ承認済み申請を渡すか。購買担当が購入に進める条件と引渡し責任が変わる。

既存の技術的制約：TypeScriptとPostgreSQLを使用する。公開REST APIと既存の `purchase_requests(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, amount_yen integer NOT NULL CHECK(amount_yen>=0), item text NOT NULL CHECK(length(item)>0), status text NOT NULL CHECK(status IN ('pending','approved','rejected')))` schema は維持する。これらは実装上の既存制約であり、以下の業務手順から新たなframework、layer構成、Repository/Serviceなどは指定しない。

# Scope

社員による購入申請の受付、金額による課長・部長の承認または却下、承認済み申請の購買担当への引渡しまでを扱う。購買担当による購入、購入結果の申請者への連絡、金額と物品の購入記録は後続の仕事としてヒアリングにあるが、本書の設計対象外とする。却下された申請は購入へ渡さない。

# Object 社員

## Scope

false

## Icon

user

## Information

- 購入したい金額
- 物品

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

# Object 判断入力者

## Scope

false

## Icon

user-check

## Information

- 承認または却下の決定
- 指定された役割（manager または director）

# Object 購買担当

## Scope

false

## Icon

shopping-cart

## Information

- 購入に進める承認済み申請

# Activity 購入申請の受付

## Scope

true

## Why

社員の購入希望を判断可能な申請にする。

## When

社員が購入申請を出したとき。

## Who

申請受付（担当未確認）

## Where

公開REST API。

## How

### Input

- 社員 — 金額と物品の申請内容

### Procedure

1. 社員から金額と物品を受け取る。公開API `POST /purchase-requests` は `amount_yen`（0以上の整数）と `item`（空でない文字列）を受け付ける。
2. 購入申請に金額、物品、`pending` の状態を記録し、申請IDを確立する。
3. 社員に、申請IDと `status=pending` を `201` で返す。

### Exception

- 入力が上記条件を満たさない場合、申請を正常受け付けとして扱わず `400` を返す。その後の再申請条件は規定されていない。

### Output

- 購入申請 — 申請ID、金額、物品、pending の状態
- 社員 — 申請IDと pending の受付結果

## Result

有効な購入申請が pending として成立し、金額に応じた承認判断を受けられる。

# Activity 承認判断

## Scope

true

## Why

金額に応じた役割が購入可否を決める。

## When

購入申請について承認または却下の決定が出されたとき。pending 以外への再決定の扱いは未確認。

## Who

課長または部長

## Where

公開REST API。

## How

### Input

- 購入申請 — 申請ID、金額、物品、現在の状態
- 判断入力者 — 承認または却下の決定と指定された役割

### Procedure

1. `POST /purchase-requests/{id}/decision` で対象申請と、`decision=approved` または `rejected`、`role=manager` または `director` の入力を受け取る。
2. 購入申請の金額を確認する。10万円以上なら部長（`director`）、10万円未満なら課長（`manager`）が承認または却下を決める。
3. 決定を購入申請の `status` に `approved` または `rejected` として記録する。

### Exception

- 金額に対応しない役割による決定は受け付けず `403` を返す。
- 指定された申請IDが存在しない場合は `404` を返す。

### Output

- 購入申請 — approved または rejected の決定結果

## Result

申請は承認または却下と決まる。承認された申請だけが購入への引渡しの対象となり、却下された申請は購入されない。

# Activity 購入への引渡し

## Scope

true

## Why

購買担当が承認済み申請に基づいて購入できるようにする。

## When

購入申請が承認されたとき。

## Who

引渡し担当（未確認）

## Where

規定なし。

## How

### Input

- 購入申請 — 承認済みの申請ID、金額、物品と状態

### Procedure

1. 購入申請の承認結果と金額・物品を購買担当へ渡す。担当者、時点、伝達方法は未確認である。

### Output

- 購買担当 — 承認済み申請の購入に必要な内容

## Result

承認済み申請が購買担当に引き渡され、後続の購入に進める。却下された申請はこの引渡しの対象にならない。

## Artifact 002
[method metadata removed]

確認したいことは3点です。①決定済み申請の再決定や変更は可能ですか。②`role` は自己申告値で判定しますか、それとも実際の課長・部長権限を確認しますか。③承認済み申請を購買担当へ渡す担当者とタイミングは何ですか。これらは合意前の事項として草案にも残しました。

草案全文：

# 購入申請・承認分岐の業務設計書（レビュー待ち草案）

本書はヒアリング結果 `source.txt` に基づく草案であり、業務上の未確認事項について合意前である。

**未確認の判断**

- **承認判断／購入申請**：決定時に申請がすでに `approved` または `rejected` の場合、再決定や変更を認めるか。認める場合、承認済み申請を却下へ変更すると購入への引渡しにどう反映するか。受付可能な状態と購買担当が信頼できる承認結果が変わる。
- **承認判断**：APIの `role` 値と実際の判断者の権限をどのように対応させるか。値の自己申告だけで決定を受け付けるのか、本人の役割を確認するのか。承認・却下の責任と許可される判断が変わる。
- **購入への引渡し**：承認後、誰が、どの時点で購買担当へ承認済み申請を渡すか。購買担当が購入に進める条件と引渡し責任が変わる。

既存の技術的制約：TypeScriptとPostgreSQLを使用する。公開REST APIと既存の `purchase_requests(id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY, amount_yen integer NOT NULL CHECK(amount_yen>=0), item text NOT NULL CHECK(length(item)>0), status text NOT NULL CHECK(status IN ('pending','approved','rejected')))` schema は維持する。これらは実装上の既存制約であり、以下の業務手順から新たなframework、layer構成、Repository/Serviceなどは指定しない。

# Scope

社員による購入申請の受付、金額による課長・部長の承認または却下、承認済み申請の購買担当への引渡しまでを扱う。購買担当による購入、購入結果の申請者への連絡、金額と物品の購入記録は後続の仕事としてヒアリングにあるが、本書の設計対象外とする。却下された申請は購入へ渡さない。

# Object 社員

## Scope

false

## Icon

user

## Information

- 購入したい金額
- 物品

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

# Object 判断入力者

## Scope

false

## Icon

user-check

## Information

- 承認または却下の決定
- 指定された役割（manager または director）

# Object 購買担当

## Scope

false

## Icon

shopping-cart

## Information

- 購入に進める承認済み申請

# Activity 購入申請の受付

## Scope

true

## Why

社員の購入希望を判断可能な申請にする。

## When

社員が購入申請を出したとき。

## Who

申請受付（担当未確認）

## Where

公開REST API。

## How

### Input

- 社員 — 金額と物品の申請内容

### Procedure

1. 社員から金額と物品を受け取る。公開API `POST /purchase-requests` は `amount_yen`（0以上の整数）と `item`（空でない文字列）を受け付ける。
2. 購入申請に金額、物品、`pending` の状態を記録し、申請IDを確立する。
3. 社員に、申請IDと `status=pending` を `201` で返す。

### Exception

- 入力が上記条件を満たさない場合、申請を正常受け付けとして扱わず `400` を返す。その後の再申請条件は規定されていない。

### Output

- 購入申請 — 申請ID、金額、物品、pending の状態
- 社員 — 申請IDと pending の受付結果

## Result

有効な購入申請が pending として成立し、金額に応じた承認判断を受けられる。

# Activity 承認判断

## Scope

true

## Why

金額に応じた役割が購入可否を決める。

## When

購入申請について承認または却下の決定が出されたとき。pending 以外への再決定の扱いは未確認。

## Who

課長または部長

## Where

公開REST API。

## How

### Input

- 購入申請 — 申請ID、金額、物品、現在の状態
- 判断入力者 — 承認または却下の決定と指定された役割

### Procedure

1. `POST /purchase-requests/{id}/decision` で対象申請と、`decision=approved` または `rejected`、`role=manager` または `director` の入力を受け取る。
2. 購入申請の金額を確認する。10万円以上なら部長（`director`）、10万円未満なら課長（`manager`）が承認または却下を決める。
3. 決定を購入申請の `status` に `approved` または `rejected` として記録する。

### Exception

- 金額に対応しない役割による決定は受け付けず `403` を返す。
- 指定された申請IDが存在しない場合は `404` を返す。

### Output

- 購入申請 — approved または rejected の決定結果

## Result

申請は承認または却下と決まる。承認された申請だけが購入への引渡しの対象となり、却下された申請は購入されない。

# Activity 購入への引渡し

## Scope

true

## Why

購買担当が承認済み申請に基づいて購入できるようにする。

## When

購入申請が承認されたとき。

## Who

引渡し担当（未確認）

## Where

規定なし。

## How

### Input

- 購入申請 — 承認済みの申請ID、金額、物品と状態

### Procedure

1. 購入申請の承認結果と金額・物品を購買担当へ渡す。担当者、時点、伝達方法は未確認である。

### Output

- 購買担当 — 承認済み申請の購入に必要な内容

## Result

承認済み申請が購買担当に引き渡され、後続の購入に進める。却下された申請はこの引渡しの対象にならない。
