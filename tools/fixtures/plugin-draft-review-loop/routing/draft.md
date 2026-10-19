# 備品返却業務（草案）

返却受付と点検を対象とする。業務内容は人間のレビュー待ち。

# Activity 返却を受け付ける

## Scope
true

## Why
返却した品と受付の記録を対応させる。

## Whne
返却者が返却品と管理番号を受付担当へ渡したとき。

## Who
受付担当

## Where
備品受付窓口

## How

### Input
- [[返却者]] から 管理番号

### Procedure
1. 受付担当が返却者から管理番号を受け取る。
2. 返却台帳へ管理番号と受付番号を記録する。

### Output
- [[返却台帳]] へ 管理番号 / 受付番号

## Result
受付番号が返却台帳に記録されている。

# Activity 返却品を点検する

## Scope
true

## Why
返却品の状態を確認する。

## When
返却品が点検済みであることを確認したとき。

## Who
受付担当

## Where
備品受付窓口

## How

### Input
- [[返却台帳]] から 管理番号 / 受付番号

### Procedure
1. 返却台帳の管理番号と受付番号を確認する。
2. 故障の有無を判断し、点検結果へ状態を記す。

### Output
- [[点検結果]] へ 管理番号 / 故障の有無

## Result
故障の有無が点検結果に記されている。

# Object 返却者

## Scope
false

## Icon
user-round

## Information
- 管理番号
- 受付番号

# Object 返却台帳

## Scope
true

## Icon
book-open

## Information
- 管理番号
- 受付番号

# Object 点検結果

## Scope
true

## Icon
clipboard-check

## Information
- 管理番号
- 故障の有無
