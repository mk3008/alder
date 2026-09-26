# 業務設計書の文書構造

[READMEへ戻る](../README.ja.md) · [複数業務の記述例](examples/meeting-room-lifecycle.ja.md)

このページは、業務設計書の見出し、各欄に書く内容、複数の業務の記述方法を説明します。本文はユーザーが普段使う言語で書きます。見出しと参照の形式は、[Business GraphのMarkdown形式](business-graph.md#opt-in-markdown-profile-v1)に対応しています。

## 1. 見出しの構造

### 文書全体

文書に一つのタイトルを置き、その後に文書全体のScope、複数のObject、複数のActivityを並べます。たとえば、予約と取消を扱う文書の最上位の見出しは次のようになります。

```markdown
# 会議室予約の業務設計書

# Scope

# Object 利用者

# Object 会議室台帳

# Object 予約台帳

# Activity 会議室を予約する

# Activity 予約を取り消す
```

### Objectの内部

```markdown
# Object 予約台帳

## Scope

## Icon

## Information
```

### Activityの内部

```markdown
# Activity 会議室を予約する

## Scope

## Why

## When

## Exception When

## Who

## Where

## How

### Input

### Procedure

### Exception

### Output

## Result

## Problem

## Pain level
```

各Object・Activityで同じ構造を使います。上のブロックは見出しだけを示しています。各欄の内容と省略できる欄は、次の節にまとめています。

## 2. 各欄に書く内容

### 文書全体

| 位置 | 内容 | 記載 |
| --- | --- | --- |
| 文書タイトル | 対象業務が分かる名前 | 必須 |
| タイトルの直後 | 目的、前提、文書全体の未決事項。現行業務と変更後の業務のどちらを記述しているか | 必要に応じて記載 |
| `# Scope` | 今回扱う業務と対象外の業務の範囲 | 推奨。JSON形式上は省略可能 |

### Object

Objectは、受け渡す情報のまとまり、台帳、文書、情報をやり取りする相手を表します。

| 欄 | 内容 | 記載 |
| --- | --- | --- |
| `# Object 名前` | 文書内で一意の名前 | 必須 |
| `## Scope` | 対象の業務範囲内で成立・管理するものは`true`、外部の相手や範囲外の業務が管理するものは`false` | 必須 |
| `## Icon` | Lucideアイコン名。たとえば`calendar`。指定しない場合は`(generic icon)`と書く | 必須 |
| `## Information` | 含まれる業務情報を`- 項目名`で列挙する | 任意 |

Scopeの値は真偽値だけにし、理由は本文に書きます。Informationは「予約者」「利用時間帯」のような業務上の情報です。DBの型・主キー・テーブル構造は含めません。

### Activity

Activityは一つの仕事を表します。担当者がひと続きに進める仕事を目安にし、担当や判断主体が変わる箇所、待ち時間を挟む箇所で分けます。同じ目的の作成・確認・修正を一つにまとめることもできます。

| 欄 | 内容 | 記載 |
| --- | --- | --- |
| `# Activity 名前` | 短い業務名。5W1HのWhatに相当する | 必須。`## What`は置かない |
| `## Scope` | 対象の責任範囲内なら`true`、受け渡しを説明するために載せる隣接業務なら`false` | 必須 |
| `## Why` | 仕事の目的 | 必須 |
| `## When` | 正常に仕事を始めるきっかけ | 必須 |
| `## Exception When` | 他のActivityから例外を受けて開始・再開する条件 | 該当する場合 |
| `## Who` | 仕事を担う短いロール名。同じ役割には同じ名前を使う | 必須 |
| `## Where` | 業務に影響する場所・環境・チャネル。条件がなければ「規定なし」 | 必須 |
| `## How` | InputからOutputまでをまとめる見出し | 必須。直接の本文は置かない |
| `### Input` | どのObjectから何を受け取るか | 必須。受け取る情報がなければ`(none)` |
| `### Procedure` | Whoが入力を使い、判断・更新・出力する正常な手順 | 必須 |
| `### Exception` | 実行中に起こる例外と、その扱いや戻り先 | 該当する場合 |
| `### Output` | どのObjectへ何を渡す・書き出すか | 必須。渡す情報がなければ`(none)` |
| `## Result` | 正常終了時に成立する状態と、そこから可能になる後続業務 | 必須 |
| `## Problem` | ユーザーが確認した現行業務の困りごと | 任意。Pain levelと対で記載 |
| `## Pain level` | 困りごとの相対的な大きさ。`Low`・`Medium`・`High`のいずれか | Problemを書く場合は必須 |

任意の欄を使わない場合は、見出しごと省略します。ProblemとPain levelは、一つのActivityに一組まで、Resultの後に置きます。仕様の未決事項はProblemと区別し、前提や関係する欄の本文に残します。

Why・Output・Resultの違いは、予約業務なら次のようになります。

| 欄 | 内容の例 |
| --- | --- |
| Why | 会議に必要な時間帯の会議室を確保するため |
| Output | 予約台帳へ登録した予約内容、利用者へ伝える予約結果 |
| Result | 予約が成立し、その予定で会議の準備を進められる |

## 3. 複数のActivityを書く

一つの業務設計書に、対象範囲のActivityを並べます。二つ目以降も`# Activity 名前`から始め、その下にScopeからResultまでの欄と、必要な任意欄を置きます。一つのActivityの下へ別のActivityを入れ子にしません。

- 共有するObjectは文書内で一度だけ定義し、複数のActivityから同じ名前で参照します。
- Object名とActivity名は、両方を通じて文書内で一意にします。名前を変更したら参照名も変更します。
- 文書上の並び順は、実行順序を表しません。開始条件はWhen、情報の受け渡しはInput・Outputに書きます。
- 通常の受け渡しは「Activity → Object → Activity」で表します。Input・Outputの参照先にはActivity名を書きません。
- 同じロールが複数のActivityを担当しても構いません。Whoに書いたロール名だけではObjectへの接続は生まれません。

たとえば、予約と取消は一つの予約台帳を共有します。

| Activity | Input | Output | 開始条件 |
| --- | --- | --- | --- |
| 会議室を予約する | 利用者の予約希望、会議室の利用可否、既存予約 | 予約台帳の新規予約、利用者への予約結果 | 予約希望の受付 |
| 予約を取り消す | 利用者の取消依頼、予約台帳の対象予約 | 予約台帳の取消状態、利用者への取消結果 | 取消依頼の受付 |

予約の次に取消を必ず行うという意味ではありません。取消は、依頼を受けたときに予約台帳の情報を使って行います。

二つのActivityと共有Objectを含む全文は、[会議室の予約・取消の記述例](examples/meeting-room-lifecycle.ja.md)にあります。一つのActivityの詳しい例は[予約受付の記述例](examples/meeting-room-reservation.ja.md)を参照してください。

## 4. 参照の書式

### Input・Output

一行を`- Object名 — 受け渡す情報`の形で書きます。参照名は宣言済みのObject名と完全に一致させます。

```markdown
### Input

- 利用者 — 対象予約 / 取消依頼者
- 予約台帳 — 対象予約の内容と状態

### Output

- 予約台帳 — 取消済みの状態 / 取消日時
- 利用者 — 取消結果 / 取消できない理由
```

### Exception When

一行を`- 発生元のActivity名 — 発生条件と必要な再開条件`の形で書きます。発生元は同じ文書で宣言したActivityを参照します。

```markdown
## Exception When

- 検査項目の設計 — 検査項目のレビューで未決の業務ルールが見つかったとき
```

発生元のExceptionには起きた例外と戻り先の動作を、受け側のException Whenには開始・再開条件を書きます。通常の情報の受け渡しとは別の関係です。

JSON化は一つの文書を単位とし、参照先のObject・Activityもその文書内に定義します。名前には区切り文字の` — `と` → `を含めません。JSONの形式や追加の例外関係の記法は[Business Graph export](business-graph.md)を参照してください。

## 関連ガイド

| 目的 | ページ |
| --- | --- |
| 文書の読みやすさ、各欄の役割、記述の整合を確かめる | [品質チェック](business-design-quality-check.ja.md) |
| 未記載の機能条件や未決事項の候補を探す | [漏れのチェック](business-design-omission-check.ja.md) |
| 前後の業務、入出力、状態、例外のつながりを確かめる | [相関チェック](business-design-correlation-check.ja.md) |
| 記録した困りごとから改善候補を考える | [改善提案](business-design-improvement.ja.md) |
| JSON出力の手順・形式を調べる | [Business Graph export](business-graph.md) |
