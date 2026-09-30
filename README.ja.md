# Alder — ユーザーと、業務設計書で話そう

[English](README.md) | 日本語

**ユーザーと合意した業務を、動くシステムへ。**

Alderは、業務の要求をAIが実装する前に、ユーザーが読んで確認できる**業務設計書（Business Design）**へ整理し、合意した内容を検査項目・コード・テストへつなぐための手順です。AIによるレビューで記述の不備や仕事のつながり、実装で具体化された判断を確かめ、未決の業務判断だけを人間へ戻します。

業務設計書は、自然言語を決まった項目と記述ルールに沿って書く、ユーザー・設計者・AIの共通言語です。**業務上の意図を承認するのは人間で、業務設計書が正本（SSOT）**。AIの提案やTest成功は、その承認を代行しません。フレームワークや実行時パッケージは不要です。

## 導入する

**作成・改訂と実装後レビューを使うには、Plugin 0.2.7を導入します。** 0.2.7は未リリースのため、次のように確認済みcommitを指定します。

```sh
codex plugin marketplace add mk3008/alder --ref 5cafd5109fe1a2b1806d2007aaa4309952de9418
```

[Plugin導入ガイド](docs/plugin-adoption.md#install-once)に従ってAlderをインストール・有効化し、新しいチャットを開始します。上のcommitには0.2.7が含まれます。Pluginの対応はクライアントにより異なり、Authoring Skillのクライアント起動は未検証です。

業務設計書をプロダクトの`docs/business-design/`へ置けば、Plugin用の専用`AGENTS.md`設定や知識のコピーは不要です。別の配置ならパスを伝えます。**AIが対象の文書と版を読めれば準備完了**。Pluginを使わない場合も[導入ガイドの手動プロンプト](docs/adoption.md)で進められます。版・更新・クライアント対応と検証範囲の詳細はPlugin導入ガイドへまとめています。

**実装後レビューだけを安定版で使う場合：** `plugin-v0.1.0`を指定してください。Authoring Skillは含まないため、次の草案作成には使えません。[安定版の導入手順](docs/plugin-adoption.md#install-once)を参照してください。

## まず使ってみる

Authoring Skillへ、ヒアリング結果を渡して依頼します。

```text
このヒアリング結果をAlder業務設計書にして。

対象は登録済みの地域住民です。
返却時は窓口で番号と付属品を照合して返却日時を記録します。
貸出の受渡しは署名と引き渡しの記録、返却の受領は照合と返却日時の記録で確認します。
返却された組は整備担当の点検を待ちます。
```

Skillへ回答を返しながら草案を整えます。工具の返却業務なら、次のように記述できます（Activityの一部）。

```markdown
# Activity 工具の返却受付

## When

住民が貸し出された工具を返却するとき。

## Who

窓口

## How

### Input

- 登録済み地域住民 — 返却する工具と付属品
- 貸出・返却の記録 — 貸し出した備品番号と引渡しの記録

### Procedure

1. 窓口は貸し出した番号と返却された現物の番号・付属品を照合し、返却日時を記録する。記録媒体は未確認。
2. 返却された組は整備担当の点検を待つ。具体的な引渡し方法は未確認。

### Output

- 貸出・返却の記録 — 照合結果と返却日時の記録
- 団体の工具 — 返却され点検を待つ組

## Result

番号と付属品の照合および返却日時の記録により受領が確認され、組は整備担当の点検を待つ。
```

未決の記録媒体や引渡し方法は「未確認」として残り、人間へ確認します。出力は実行ごとに変わり、この草案も業務承認前です。[予約受付](docs/examples/meeting-room-reservation.ja.md)と[予約・取消](docs/examples/meeting-room-lifecycle.ja.md)の記述例も参照できます。

## 標準的な使い方

既存業務の分析だけでなく、新しい業務の仮説にも使えます。実現したい仕事を具体化し、一連の仕事が成立するかをユーザーと確かめます。

| 工程 | AIに依頼すること | 人間が確認・判断すること |
| --- | --- | --- |
| Authoring | ヒアリングや要求からBusiness Designを作成・改訂 | 入力事実と草案が合うか。未決の業務条件への答え |
| Business Design review | 記述品質、業務相関、必要なら考慮漏れをレビュー | 仕事の意味、責任、例外、保証への合意 |
| Check Item | 合意した業務から検査すべき期待結果を作成 | 期待結果を確認し、要確認・要修正の項目を判断 |
| System Requirements | 既存制約と技術条件を整理 | 先に守るべき制約、費用や変更リスク、技術上の希望 |
| Implementation | 合意したBusiness Design / Check Itemと技術条件からCode / Testを作成 | 未決の業務判断が生じた場合に回答 |
| post-implementation review | 別エージェントや新しいコンテキストで読み取り専用レビュー | 未決の業務判断への回答。別のfollow-upで設計・実装・対応関係を更新 |

標準の設計業務は、**業務設計書の合意とCheck Itemの人間レビューを経た実装への引き渡し**で完了します。実装後のAlderレビューとfollow-upは別の開発ループです。System Requirementsの技術検討の詳細は、プロダクト側の責務です。

**Plugin 0.2.7の同梱Skillは、Business Designの作成・改訂と、実装後の読み取り専用レビューの二つ**です。記述品質・相関・考慮漏れレビュー、改善提案、Check Item作成、Graph出力、follow-upは同梱Skillではありません。次の手順では、これらを参照文書とプロンプトでAIへ依頼します。

### 1. 草案を作り、質問に答える

ヒアリングや要求をAuthoring Skillへ渡し、草案を作らせます。人間は入力事実と未決の問いを確認し、回答を返して同じ文書を改訂します。

Skillは仕事をActivity、情報・文書・台帳・外部の相手をObjectへ整理し、5W1HのHowをInput / Procedure / Outputへ分け、必要なExceptionと正常終了後のResultを書きます。たとえば予約結果の通知はOutput、予約が成立した状態はResultです。**書式を暗記せず、生成された内容を読んで確かめられる草案**を用意します。

各欄・Scope / Information・When・例外・情報の接続は[文書構造](docs/business-design-structure.ja.md)と[欄の説明](docs/adoption.md#business-design-format)を参照してください。手動作成でも同じ文書をAIへ渡します。

### 2. 業務設計をレビューし、ユーザーと合意する

対象全文・版・範囲・合意済み判断を渡し、[記述品質](docs/business-design-quality-check.ja.md)と[業務相関](docs/business-design-correlation-check.ja.md)をレビューさせます。必要なら任意の[考慮漏れチェック](docs/business-design-omission-check.ja.md)も使います。

人間は責任、条件、例外、保証に関わる問いへ答え、業務設計書を更新して再レビューします。**ユーザーと合意した版が正本**です。品質要求も省略せず、独立Quality欄ではなく、それが制約するProcedure / Exception / Result / Who / Object.Information等へ書き、実現手段はSystem Designへ分けます。[配置例](docs/adoption.md#business-quality-requirements-belong-where-they-constrain-the-work)を参照してください。

[レビュー事例](docs/business-design-review.ja.md)、[記述品質の根拠](docs/business-design-quality-review.md)、[任意の考慮漏れ探索](docs/behavior-derivation/functional-considerations.md)に詳細をまとめています。

### 3. Check Itemを作り、人間が期待結果を確認する

合意した設計と[検査項目の作成・保守](docs/check-item-traceability.md)をAIへ渡し、独立して確認できる期待結果ごとにCheck Itemを作らせます。たとえば「同時申込みでも重複予約が成立しない」を、条件と期待結果の組として確認します。

人間が`未レビュー / 要確認 / 確認済み / 要修正`を判断し、未決の業務条件は設計へ戻します。**確認済み項目と未確認候補を区別して引き渡せれば完了**です。

**なぜTest成功だけでは業務承認にならないか：** Testは書かれた期待値と実装を照合します。その期待値がユーザーの望む業務かは人間が確認するため、レビュー状態とTest根拠は別に扱います。

### 4. 先に守る制約をSystem Requirementsとして伝える

人間が既存制約と希望を伝え、AIに実装で守る技術条件を整理させます。**必要な制約と、委譲できる判断の区別が伝われば完了**です。

| 先に伝えるもの | 実装へ委譲できるもの |
| --- | --- |
| 既存インフラ・DB/schema、必須クラウド/外部サービス、公開API、移行・互換性、安全性・法的義務 | 変更しやすいクラス/関数分割、内部モジュール、命名 |
| 保守体制・既存資産・好みなど、言語や主要製品を指定する理由 | 制約や希望がなければ技術の選択も委譲可能 |

アーキテクチャ名を先に選ぶ必要はなく、守りたい性質やリスクを伝えます。外部サービスは業務契約上の制約か技術手段かを理由で区別します。

**なぜ詳細設計を独立必須工程にしないか：** 変更しやすい詳細はDDL・SQL・Code / Testと一緒に具体化し、後からレビューできます。移行や外部契約など変更費用が大きい判断は必要な範囲で先に設計します。[詳細設計](docs/detailed-design.ja.md)と[判断例](docs/philosophy.md#where-detailed-design-fits)へ進んでください。データモデリングも業務・システム要件と既存DB制約から行う後続設計です。[位置づけ](docs/data-modeling.ja.md)に詳細があります。

### 5. 合意した設計とCheck ItemをAIへ渡す

設計の版、確認済みCheckのID、技術条件、今回の範囲を指定して依頼します。実際の配置に合わせてパスを置き換えてください。

```text
確認済みの docs/business-design/meeting-room.md と
docs/checks/meeting-room.md、プロダクトの技術要件を読み、
今回合意した範囲のコードと実行可能なテストを作成・更新してください。
既存の開発ルールに従い、確認済みCheckの条件と期待結果を検証してください。
未決の業務判断は人間へ問いとして戻し、独立して進められる作業は続けてください。
重要な前提・判断と理由を、別コンテキストのレビューへ引き継いでください。
```

**合意済み範囲のCode / Testと検証結果、重要な判断の根拠が用意できればレビューへ進めます**。未決の取消期限を勝手にTestの期待値にせず、独立した予約処理は進められます。ここまでの引き渡しで標準設計業務は完了し、実装・実装後レビューは別の開発ループです。

### 6. 別コンテキストでレビューし、対応を分ける

別のAIエージェントや新しいコンテキストへ設計・実装の版と範囲を渡します。Review Skillには「実装が終わったのでAlderレビューして」と依頼します。

Skillは**Business Design → 判断記録 → 実装・DDL・Test**を読み、ファイルを変更せず、根拠・業務への影響・分類・必要な確認を報告します。人間は未決の業務判断だけに答え、別follow-upで意味が変わるなら業務設計書を先に更新・再合意し、Code / Testを合わせます。

**指摘への対応とCheck ↔ Test/assertionの根拠を確認したうえで実装変更の受入れを判断します**。恒久的な追跡はBusiness Design ↔ Check Item ↔ Testまでで、Check ↔ Code位置の表は維持しません。[レビュー知識](docs/phase2/review-knowledge-v0.3.md)、[手動依頼とfollow-up](docs/adoption.md)、[追跡の詳細](docs/check-item-traceability.md)を参照してください。

## 必要に応じて使う

現在の業務関係が確認できているなら、任意の[Structural Discovery](docs/optimization-review.md#optional-structural-discovery-before-a-problem-is-known)で見直す価値のある関係を問いとして探せます。観察ゼロも有効で、構造だけからProblemや負担、改善効果を認定しません。専用のStructural Optimization工程は設けません。

成立している業務に具体的な困りごとがあれば、人間が確認した**Problem / Pain level**をActivityのResultの後へ任意の対として記録し、[Optimization Review](docs/optimization-review.md)へ進みます。購買なら、申請ごとの購入・登録を繰り返す負担から、まとめ買い、自動化、外部委託等を比較できます。[購買改善の提案例](docs/examples/purchase-improvement.ja.md)で、期待効果、Scope、業務変更のDifficulty、採用前の確認を示しています。

採否を決めるのは人間です。Candidate / Difficulty / Confidence等は未承認提案で、現在仕様やGraphへ混ぜません。採用時は**業務設計書を先に更新・再合意**してからCheckや実装へ反映し、有益な候補がなければ現状を維持できます。[改善手順](docs/business-design-improvement.ja.md)を参照してください。

業務設計書を外部ツールで可視化・解析したい場合は、任意の[Business Graph JSON v1 / CLI](docs/business-graph.md)を使えます。JSONは中間形式で、正本は業務設計書です。Business / Objectの明示されたScopeや、記載されたProblem / Painを投影し、未承認候補は投影しません。Procedureは投影の対象外で、構文の成功は業務合意を意味しません。JSON出力や保存は標準設計の完了条件ではなく、外部ツールで得た修正は業務設計書へ戻します。

## 詳しく読む

| 知りたいこと | 文書 |
| --- | --- |
| ヒアリングと草案の記述例 | [ヒアリング](work/structural-discovery/issue-99/customer-transcript.md) / [草案](work/structural-discovery/issue-99/design/v4.md) |
| 各欄の意味、見出し順、参照書式 | [業務設計書の文書構造](docs/business-design-structure.ja.md) |
| 記述、漏れ、業務のつながりをレビューする | [品質チェック](docs/business-design-quality-check.ja.md) / [漏れのチェック](docs/business-design-omission-check.ja.md) / [相関チェック](docs/business-design-correlation-check.ja.md) |
| Pluginの導入、版、提供範囲 | [Plugin導入ガイド](docs/plugin-adoption.md) |
| 文書配置、手順、コピーして使うプロンプト | [導入ガイド](docs/adoption.md) |
| 詳細設計と技術判断のタイミング | [詳細設計の位置づけ](docs/detailed-design.ja.md) |
| データ構造要求とDB制約の扱い | [データモデリング](docs/data-modeling.ja.md) / [英語](docs/data-modeling.md) |
| 業務改善の観点と採用後の手順 | [改善提案](docs/business-design-improvement.ja.md) |
| Checkの粒度、レビュー状態、Testとの対応 | [検査項目の作成・保守](docs/check-item-traceability.md) |
| 実装レビューの観点と止める条件 | [レビュー知識v0.3](docs/phase2/review-knowledge-v0.3.md) |
| JSON契約とexporter | [Business Graph](docs/business-graph.md) |
| Alderを使った業務の責任範囲 | [Alder自身の業務設計書](business-design/alder/README.md) |
| 根拠を説明へ反映する基準と安全な追試記録 | [研究成果の公開方針](docs/research-publication.md) |
| 思想、採用判断、検証範囲と限界 | [設計思想](docs/philosophy.md) / [研究判断](docs/research-decisions.md) / [検証記録](docs/validation.md) |

現在のmain / PRは未リリース仕様です。標準の設計業務ではCheck Itemの設計と人間レビューが必須で、released v0.6では任意でした。Plugin版、Alder手法の版、レビュー知識v0.3は別です。Alder全体は研究候補であり、効果や検証範囲は[検証記録](docs/validation.md)を参照してください。

### 質問・改善提案

使ったAlderの版と、対象業務や確認したい点を添えて[GitHub Issues](https://github.com/mk3008/alder/issues)へお寄せください。
