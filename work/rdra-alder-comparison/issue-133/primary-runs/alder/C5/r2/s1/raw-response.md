草案を [design.md](sandbox:/workspace/scratch/62be7f260abb/primary-runs/alder/C5/r2/s1/docs/business-design/design.md) に保存しました。ヒアリング結果を使用し、Alder plugin 0.2.8、authoring source revision `e9726b4c84608db42c5286d072b5ec762d31596a` の手順で作成しました。次の2点をご確認ください。

1. 一度承認・却下した申請の再決定や変更を認めますか。認める場合、購買担当への引渡しとの整合はどう扱いますか。
2. 却下結果は申請者に通知しますか。通知する場合、誰がいつ伝えますか。

これらは未確認のまま草案に残しています。購入後の結果通知と追加記録は対象範囲外として、具体的な担当・方法は人の確認を要します。

---

# 購入申請・承認の業務設計（レビュー待ちの草案）

ヒアリング結果に基づく草案。未確認の判断は合意済みの業務ルールではない。

**未確認の業務判断**

1. **購入判断／購入申請**：一度 `approved` または `rejected` となった申請に再び判断要求が来た場合、再決定や変更を認めるか。認めない場合の応答、認める場合の購買担当への引渡しとの整合を決める必要がある。現在の記述は初回判断までを確定範囲とする。
2. **購入判断／申請者**：却下結果を申請者に伝える業務があるか。ある場合、誰がどの時点で伝えるか。ヒアリングで明示された「購入結果」の通知は購入後の話であり、却下通知と同一視しない。

# Scope

対象は社員の購入申請、金額に応じた課長・部長の承認または却下、承認済み申請の購買担当への引渡しまで。購買担当による購入、購入結果の申請者への通知は隣接する対象外の仕事である。申請時に金額と物品を記録する。購入後の追加記録の内容や担当は、この範囲では確定していない。

既存の公開REST APIと `purchase_requests` スキーマを維持する。`POST /purchase-requests` は `amount_yen`（0以上の整数）と `item`（空でない文字列）を受け、正常時に201で `id` と `status=pending` を返し、不正入力は400とする。`POST /purchase-requests/{id}/decision` は `decision=approved|rejected` と `role=manager|director` を受け、金額に対応しない役割には403、存在しないIDには404を返す。既存スキーマは `id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY`、`amount_yen integer NOT NULL CHECK(amount_yen>=0)`、`item text NOT NULL CHECK(length(item)>0)`、`status text NOT NULL CHECK(status IN ('pending','approved','rejected'))`。実装言語はTypeScript、データベースはPostgreSQL。フレームワークや層構成は指定されていない。

# Object 申請者

## Scope

false

## Icon

user

## Information

- 購入したい物品と金額
- 申請受付結果

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

# Object 購買担当

## Scope

false

## Icon

shopping-cart

## Information

- 購入のために受け取る承認済み申請の金額と物品

# Activity 購入申請の受付

## Scope

true

## Why

購入したい物品と金額を判断可能な申請として受け付ける。

## When

社員が購入申請を出すとき。

## Who

社員

## Where

公開REST APIを通じた申請。

## How

### Input

- 申請者 — 申請する金額と物品

### Procedure

1. 社員が申請者として金額と物品を `POST /purchase-requests` に提出する。金額は0以上の整数、物品は空でない文字列とする。
2. 購入申請に金額と物品を記録し、申請IDと `pending` 状態を成立させる。
3. 申請者に201で申請IDと `pending` 状態を返す。

### Exception

- 入力が不正な場合は400を返し、申請を受け付けない。

### Output

- 購入申請 — 申請ID、金額、物品、pending状態
- 申請者 — 申請IDとpending状態の受付結果

## Result

金額と物品を伴う申請が `pending` となり、金額に応じた購入判断を受けられる。

# Activity 購入判断

## Scope

true

## Why

金額に対応する承認権限で購入の可否を決める。

## When

金額と物品を伴う申請が `pending` として受け付けられた後、判断要求が出されたとき。

## Who

課長または部長

## Where

公開REST APIを通じた判断。

## How

### Input

- 購入申請 — 申請ID、金額、物品、pending状態

### Procedure

1. `POST /purchase-requests/{id}/decision` で申請ID、`approved` または `rejected` の判断、`manager` または `director` の役割を受ける。
2. 購入申請の金額が10万円未満なら課長（`manager`）、10万円以上なら部長（`director`）だけが承認または却下する。
3. 判断に従って購入申請の状態を `approved` または `rejected` として記録する。
4. 承認した場合だけ、購買担当に承認済み申請の金額と物品を引き渡す。却下した場合は購入へ引き渡さない。

### Exception

- 申請IDが存在しない場合は404を返し、判断を記録しない。
- 金額に対応しない役割の場合は403を返し、判断を記録しない。

### Output

- 購入申請 — approvedまたはrejectedの判断結果
- 購買担当 — 承認時だけの購入対象の金額と物品

## Result

権限に応じた判断が申請に成立する。承認された申請だけが購買担当の購入へ進み、却下された申請は購入へ進まない。
