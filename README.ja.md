# Alder — 依頼者と、業務設計書で話そう

[English](README.md) | 日本語

**依頼者と合意した業務を、動くシステムへ。**

Alderは、依頼者の要求を、依頼者・設計者・AIの共通言語となる**業務設計書（Business Design）**に整理し、依頼者と設計者が合意した内容を**業務上の正本（SSOT）**として、検査項目・コード・テストへつなげます。

フレームワークや実行時パッケージは不要です。

## 導入する

ChatGPT / Codexを利用できる契約・権限のあるアカウントと環境を用意してください。Alderの導入にはCodex CLIと、Plugins Directoryを利用できるChatGPTデスクトップアプリを使います。ターミナルで次のコマンドを実行し、Alderをインストールできる配布元（marketplace）を登録してください。

```sh
codex plugin marketplace add mk3008/alder --ref 35dd2cec2fb173785f730a5c08d15c7fdfa85598
```

コマンド実行後、ChatGPTデスクトップアプリを再起動し、Plugins Directoryで**Alder development**を選び、**Alder**をインストール・有効化してください。その後、新しいチャットを開始してください。

## まず使ってみる

業務ヒアリングから業務設計書を作るには、新しいチャットで次のプロンプトを送ってみてください。

```text
このヒアリング結果をAlder業務設計書にして。

対象は登録済みの地域住民です。
返却時は窓口で番号と付属品を照合して返却日時を記録します。
貸出の受渡しは署名と引き渡しの記録、返却の受領は照合と返却日時の記録で確認します。
返却された組は整備担当の点検を待ちます。
```

次のような構造化された業務設計書が得られます。

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

この業務設計書を起点に、業務設計書の記述品質・業務間のつながり・考慮漏れを確認し、合意した業務からCheck Itemを作ってコードとテストへつなげられます。具体的な流れは[標準的な使い方](#標準的な使い方)、各項目の意味と構造の理由は[文書構造](docs/business-design-structure.ja.md)を参照してください。

## 標準的な使い方

Alderは、既存業務の分析と新しい業務の仮説に使えます。業務設計書を通じて依頼者と認識を合わせ、一連の仕事が成立するかを確かめられます。

| 工程 | AIに依頼すること | 人間が確認・判断すること |
| --- | --- | --- |
| Authoring | ヒアリングや要求からBusiness Designを作成・改訂 | 入力事実と草案が合うか。未決の業務条件への答え |
| Business Design review | 業務設計書の記述品質と業務間のつながりをレビューし、必要に応じて考慮漏れも確認 | 仕事の意味、責任、例外、保証への合意 |
| Check Item | 合意した業務から検査すべき期待結果を作成 | 期待結果を確認し、要確認・要修正の項目を判断 |
| System Requirements | 既存制約と技術条件を整理 | 先に守るべき制約、費用や変更リスク、技術上の希望 |
| Implementation | 合意したBusiness Design / Check Itemと技術条件からCode / Testを作成 | 未決の業務判断が生じた場合に回答 |
| post-implementation review | 別エージェントや新しいコンテキストで読み取り専用レビュー | 未決の業務判断への回答。別のfollow-upで設計・実装・対応関係を更新 |

標準の設計業務は、**業務設計書の合意とCheck Itemの人間レビューを経た実装への引き渡し**で完了します。その後は、実装・独立レビュー・follow-upの開発ループへ進みます。

Alder Pluginは、業務設計書の作成・レビューと実装レビューを短い依頼から実行できます。Check ItemやSystem Requirementsなど、ほかの手順では下記の参照文書を使います。

### 1. 草案を作り、質問に答える

対象プロジェクトのチャットへヒアリングや要求を渡し、「Alder業務設計書の草案を `docs/business-design/` に作って」と依頼してください。人間は入力事実と未決の問いを確認し、回答を返して同じ文書を改訂します。

業務設計書は、自然言語を決まった項目に沿って書きます。**書式を暗記する必要はありません**。Skillが5W1HのHowをInput / Procedure / Outputへ分け、必要なExceptionと正常終了後のResultを整理します。たとえば予約結果の通知はOutput、予約が成立した状態はResultです。生成された草案を読んで、実際の仕事と合うかを確かめてください。

### 2. 業務設計をレビューし、依頼者と合意する

対象の業務設計書を参照できるチャットで、次のように依頼してください。

```text
業務設計書をAlderでレビューして
```

人間は責任、条件、例外、保証への問いに答え、設計を更新して再レビューします。**依頼者と設計者が合意した版が正本**です。品質要求のために項目を増やさず、[各項目の役割](docs/business-design-structure.ja.md)に沿って関係する既存項目へ書いてください。技術的な実現手段はSystem Designへ分けてください。

### 3. Check Itemを作り、人間が期待結果を確認する

合意した設計と[検査項目の作成・保守](docs/check-item-traceability.md)をAIへ渡し、独立して確認できる期待結果ごとにCheck Itemを作らせてください。たとえば「同時申込みでも重複予約が成立しない」を、条件と期待結果の組として確認してください。

人間が`未レビュー / 要確認 / 確認済み / 要修正`を判断し、未決の業務条件は設計へ戻します。**確認済み項目と未確認候補を区別して引き渡せれば完了**です。

**なぜTest成功だけでは業務承認にならないか：** Testは書かれた期待値と実装を照合します。その期待値が依頼者の望む業務かは人間が確認するため、レビュー状態とTest根拠は別に扱います。

### 4. 先に守る制約をSystem Requirementsとして伝える

人間が既存制約と希望を伝え、AIに実装で守る技術条件を整理させます。技術検討の詳細はプロダクト側で進めます。

| 先に伝えるもの | 実装へ委譲できるもの |
| --- | --- |
| 既存インフラ・DB/schema、必須クラウド/外部サービス、公開API、移行・互換性、安全性・法的義務 | 変更しやすいクラス/関数分割、内部モジュール、命名 |
| 保守体制・既存資産・好みなど、言語や主要製品を指定する理由 | 制約や希望がなければ技術の選択も委譲可能 |

**なぜ全技術判断を先に決めないか：** 変更しやすい選択は実装時に具体化できます。先に必要なのは、守るべき性質・制約と変更リスクです。

**なぜ詳細設計を独立必須工程にしないか：** 詳細はDDL・SQL・Code / Testと一緒に具体化し、レビューできます。移行や外部契約など変更費用が大きい判断は必要な範囲で先に設計してください。[詳細設計の位置づけ](docs/detailed-design.ja.md)を参照してください。

### 5. 合意した設計とCheck ItemをAIへ渡す

設計の版、確認済みCheckのID、技術条件、今回の範囲を指定して依頼してください。実際の配置に合わせてパスを置き換えてください。

```text
確認済みの docs/business-design/meeting-room.md と
docs/checks/meeting-room.md、プロダクトの技術要件を読み、
今回合意した範囲のコードと実行可能なテストを作成・更新してください。
既存の開発ルールに従い、確認済みCheckの条件と期待結果を検証してください。
未決の業務判断は人間へ問いとして戻し、独立して進められる作業は続けてください。
重要な前提・判断と理由を、別コンテキストのレビューへ引き継いでください。
```

合意済み範囲のCode / Test、検証結果、重要な判断の根拠を次のレビューへ渡してください。未決の取消期限をTestの期待値にせず、独立した予約処理は進められます。

### 6. 別コンテキストでレビューし、対応を分ける

新しいチャットで設計・実装のファイルを参照できるようにし、版と範囲を指定して「コードをAlderでレビューして」と依頼してください。

Skillは**Business Design → 判断記録 → 実装・DDL・Test**を読み、ファイルを変更せず、根拠・業務への影響・分類・必要な確認を報告します。人間は未決の業務判断だけに答え、別follow-upで意味が変わるなら業務設計書を先に更新・再合意し、Code / Testを合わせます。

**人間が指摘への対応とCheck ↔ Test/assertionの根拠を確認して、実装変更の受入れを判断します**。[follow-upと追跡の詳細](docs/check-item-traceability.md)を参照してください。

## 必要に応じて使う

- **見直す関係を探す：** 確認済みの業務関係から、[Structural Discovery](docs/optimization-review.md#optional-structural-discovery-before-a-problem-is-known)で問いを探せます。構造だけからProblemを認定することはできず、専用のStructural Optimization工程はありません。
- **具体的な困りごとを改善する：** 人間が確認したProblem / Pain levelを記録し、[Optimization Review](docs/optimization-review.md)で候補を比較してください。採用は人間が決め、[業務設計書の更新・再合意](docs/business-design-improvement.ja.md)を先に行います。
- **業務を可視化・解析する：** 任意の[Business Graph JSON v1 / CLI](docs/business-graph.md)を使えます。JSONは中間形式で、業務設計書が正本です。未承認の改善候補は投影しません。

## 詳しく読む

### 版とPluginの提供範囲

版・更新・クライアント対応・[導入手順](docs/plugin-adoption.md#install-once)は[Plugin導入ガイド](docs/plugin-adoption.md)を参照してください。上の導入例は未リリースの0.2.8を固定commitで指定しています。実クライアントでは、業務設計書の作成・レビューとコードレビューの短文routingを確認済みです。安定タグ`plugin-v0.1.0`は実装後レビュー専用で、作成・業務設計書レビューSkillは含みません。Pluginなしの利用は[手動プロンプト](docs/adoption.md)で進められます。

標準配置`docs/business-design/`ではPlugin専用の`AGENTS.md`設定や知識コピーは不要です。別の配置ではパスを伝えてください。手動作成でも文書構造と導入ガイドをAIへ渡してください。

**Plugin 0.2.8の同梱Skillは、Business Designの作成・改訂、Business Designの読み取り専用レビュー、実装後の読み取り専用レビューの三つ**です。改善提案、Check Item作成、Graph出力、follow-upは同梱Skillではありません。これらは参照文書とプロンプトでAIへ依頼してください。

現在のmain / PRは未リリース仕様です。標準の設計業務ではCheck Itemの設計と人間レビューが必須で、released v0.6では任意でした。Plugin版、Alder手法の版、レビュー知識v0.3は別です。Alder全体は研究候補であり、効果や検証範囲は[検証記録](docs/validation.md)を参照してください。

### 目的別の文書

| 知りたいこと | 文書 |
| --- | --- |
| ヒアリングと草案の記述例 | [ヒアリング](work/structural-discovery/issue-99/customer-transcript.md) / [草案](work/structural-discovery/issue-99/design/v4.md) |
| 業務の記述例 | [予約受付](docs/examples/meeting-room-reservation.ja.md) / [予約・取消](docs/examples/meeting-room-lifecycle.ja.md) |
| 各欄の意味、見出し順、参照書式 | [文書構造](docs/business-design-structure.ja.md) / [欄の説明](docs/adoption.md#business-design-format) / [品質要求の配置](docs/adoption.md#business-quality-requirements-belong-where-they-constrain-the-work) |
| 設計レビューの事例と根拠 | [レビュー事例](docs/business-design-review.ja.md) / [記述品質の根拠](docs/business-design-quality-review.md) / [考慮漏れ探索](docs/behavior-derivation/functional-considerations.md) |
| 記述、漏れ、業務のつながりをレビューする | [品質チェック](docs/business-design-quality-check.ja.md) / [漏れのチェック](docs/business-design-omission-check.ja.md) / [相関チェック](docs/business-design-correlation-check.ja.md) |
| Pluginの導入、版、提供範囲 | [Plugin導入ガイド](docs/plugin-adoption.md) |
| 文書配置、手順、コピーして使うプロンプト | [導入ガイド](docs/adoption.md) |
| 詳細設計と技術判断のタイミング | [詳細設計の位置づけ](docs/detailed-design.ja.md) / [判断例](docs/philosophy.md#where-detailed-design-fits) |
| データ構造要求とDB制約の扱い | [データモデリング](docs/data-modeling.ja.md) / [英語](docs/data-modeling.md) |
| 業務改善の観点と採用後の手順 | [改善提案](docs/business-design-improvement.ja.md) / [購買改善の提案例](docs/examples/purchase-improvement.ja.md) |
| Checkの粒度、レビュー状態、Testとの対応 | [検査項目の作成・保守](docs/check-item-traceability.md) |
| 実装レビューの観点と止める条件 | [レビュー知識v0.3](docs/phase2/review-knowledge-v0.3.md) |
| JSON契約とexporter | [Business Graph](docs/business-graph.md) |
| Alderを使った業務の責任範囲 | [Alder自身の業務設計書](business-design/alder/README.md) |
| 根拠を説明へ反映する基準と安全な追試記録 | [研究成果の公開方針](docs/research-publication.md) |
| 思想、採用判断、検証範囲と限界 | [設計思想](docs/philosophy.md) / [研究判断](docs/research-decisions.md) / [検証記録](docs/validation.md) |

### 質問・改善提案

使ったAlderの版と、対象業務や確認したい点を添えて[GitHub Issues](https://github.com/mk3008/alder/issues)へお寄せください。
