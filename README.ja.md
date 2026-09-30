# Alder — ユーザーと、業務設計書で話そう

[English](README.md) | 日本語

**ユーザーと合意した業務を、動くシステムへ。**

Alderは、業務の要求をAIが実装する前に、ユーザーが読んで確認できる**業務設計書（Business Design）**へ整理し、合意した内容を検査項目・コード・テストへつなぐための手順です。AIによるレビューで記述の不備や仕事のつながり、実装で具体化された判断を確かめ、未決の業務判断だけを人間へ戻します。

初めてAlderを使うAI開発利用者に向けて、ヒアリングから草案を作り、ユーザーと合意し、AIへ実装を渡して別のコンテキストでレビューするまでを説明します。書式を最初から暗記する必要はありません。Skillと参照文書を使って整え、生成された内容が実際の業務に合うかを人間が確認します。

業務設計書は、自然言語を決まった項目と記述ルールに沿って書く、ユーザー・設計者・AIの共通言語です。**業務上の意図を承認するのは人間で、業務設計書が正本（SSOT）**。AIの提案やTest成功は、その承認を代行しません。フレームワークや実行時パッケージは不要です。

## まず1分 — ヒアリングを業務設計の草案にする

[作成Skillを含むPlugin 0.2.7を導入](docs/plugin-adoption.md)し、新しいチャットで、普段の言葉のまま依頼します。未リリース版の導入と手動での利用は、後述の手順を参照してください。

```text
このヒアリング結果をAlder業務設計書にして。
本文はユーザーが確認できる日本語にしてください。

社内の会議室について、空き確認、予約、変更、取消、
利用不可・利用再開の管理をしたい。
重複予約は成立させない。変更できない場合は元の予約を維持する。
取消をいつまで受け付けるかは、まだ決まっていない。
```

Skillは、ヒアリングを仕事と情報の受け渡しに整理し、未決事項を確認する問いとして残します。上の入力なら、草案と確認事項を次のように読み分けられます。

| 整理するもの | この例での内容 |
| --- | --- |
| 仕事（Activity） | 空き確認、予約、変更、取消、利用可否の管理 |
| 扱う対象（Object） | 利用者、会議室台帳、予約台帳 |
| 確認済みのルール | 重複予約を成立させない。変更できない場合は元の予約を維持する |
| 人間に確認すること | 取消はいつまで受け付けるか |

これは整理結果の説明例です。完全な業務設計書や業務承認ではありません。答えを返して同じ草案を改訂し、実際の手順、責任、情報の受け渡しを確かめます。[予約受付の全文](docs/examples/meeting-room-reservation.ja.md)と[予約・取消の記述例](docs/examples/meeting-room-lifecycle.ja.md)で完成形を確認できます。

## 3分で全体像 — 設計から実装後レビューまで

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

## 5〜10分で使い方 — 自分のプロダクトで進める

### 1. Pluginと文書の置き場を用意する

| 利用する版 | 提供範囲と入口 |
| --- | --- |
| Plugin 0.2.7 | 作成・改訂 + 実装後レビュー。この変更を含む確認済みcommit / branchから導入する未リリースのパッケージ |
| 安定タグ `plugin-v0.1.0` | 実装後レビューのみ。ヒアリングからの作成Skillは含まない |

作成から試す場合は、[Plugin導入ガイド](docs/plugin-adoption.md)に従って0.2.7を含む版を指定し、インストール・有効化後に新しいチャットを開始します。動くbranchを使った場合は、解決されたcommitも記録します。実装後レビューだけを試す安定版の入口は次のとおりです。

```sh
codex plugin marketplace add mk3008/alder --ref plugin-v0.1.0
```

Pluginの対応と利用可能なmarketplaceはクライアントによって異なります。GitHub配布と公開Plugins Directoryへの掲載は別で、初期の実クライアント検証は0.1.0のレビューを対象としています。0.2.7の作成Skillのクライアント起動を検証済みとは扱いません。

業務設計書はプロダクトの`docs/business-design/`に置くのが標準です。既存の相当する配置も使えます。標準の配置なら、Plugin用のAlder専用`AGENTS.md`設定やレビュー知識のコピーは不要で、別の場所を使う場合はパスを伝えます。Pluginを使わずに進める場合は、読み取り可能なAlderのcheckoutや版を固定した参照文書を用意し、[導入ガイドの手動プロンプト](docs/adoption.md)を使います。

### 2. 草案を作り、Skillが整えた構造を読む

ヒアリングや要求を渡して作成Skillへ依頼し、質問への回答を返して改訂します。手動なら[文書構造](docs/business-design-structure.ja.md)と[導入ガイド](docs/adoption.md)を読める形でAIへ渡し、同じ形式の草案を依頼します。

草案は、仕事を**Activity**、扱う情報・文書・台帳・外部の相手を**Object**として整理します。Activityは5W1Hを基本に、Howを**Input / Procedure / Output**へ分け、必要なExceptionと、正常終了後の状態を表す**Result**を記述します。

たとえば予約業務のOutputは「予約台帳への登録内容や利用者への予約結果」、Resultは「予約が成立し、その予定で会議の準備を進められる状態」です。生成された各欄を読めば、何が入力され、誰が判断し、何が成立するかを確認できます。

Activity / ObjectのScopeは責任範囲を示し、Object.Informationには扱う業務情報を書きます。ひと続きに進む仕事を過度に分割せず、独立して始まる仕事は実際のWhenとObjectを介した情報の受け渡しでつなぎます。文書の並び順が実行順ではなく、例外による差し戻しは通常のI/Oとは分けます。項目の意味・見出し順・参照書式は[文書構造](docs/business-design-structure.ja.md)へ、詳細な欄表は[導入ガイド](docs/adoption.md#business-design-format)へ進んでください。

### 3. 業務設計をレビューし、ユーザーと合意する

書式が整った草案も、業務上の正しさは確認が必要です。対象の全文・版・範囲・合意済み判断を渡し、次の参照文書のプロンプトを使います。

1. [記述品質チェック](docs/business-design-quality-check.ja.md)で、主体、各欄の役割、Input / Procedure / Outputの整合を確認する
2. [相関チェック](docs/business-design-correlation-check.ja.md)で、前後の仕事のResultとWhen、情報の受け渡し、処理単位、権限、例外と再開を確認する
3. 必要なら任意の[考慮漏れチェック](docs/business-design-omission-check.ja.md)で、結果が変わる具体的な場面を問いにする

意味を変えない記述修正と、人間が決める業務上の問いを分けます。ユーザーの判断を業務設計書へ反映して再レビューし、合意した版を正本にします。[確認観点の根拠](docs/business-design-quality-review.md)、[実際のレビュー事例](docs/business-design-review.ja.md)、[任意の考慮漏れ探索](docs/behavior-derivation/functional-considerations.md)も参照できます。

期限、継続条件、再実行時の不変条件、権限、追跡可能性など、業務成立に必要な品質要求もここへ書きます。**独立したQuality欄は設けず**、それが制約するProcedure / Exception / Result / Who / Object.Information等へ記述します。望ましい条件と、今起きている困りごと（Problem / Pain）は別です。構成や暗号方式などの実現手段はSystem Designで判断します。[具体的な配置例](docs/adoption.md#business-quality-requirements-belong-where-they-constrain-the-work)を参照してください。

### 4. Check Itemを作り、人間が期待結果を確認する

[導入ガイド](docs/adoption.md)と[検査項目の作成・保守](docs/check-item-traceability.md)をAIへ渡し、合意した業務設計書から、独立してレビューできる期待結果ごとにCheck Itemを作らせます。

| ID | タイトル | 期待結果 | レビュー状態 |
| --- | --- | --- | --- |
| MR-001 | 同じ会議室で重複予約が成立しない | 同時に申し込まれても、同じ会議室・重なる時間帯の予約が複数成立しない | 未レビュー |
| MR-002 | 変更できなくても元の予約が残る | 予約変更の条件を満たさない場合、元の予約内容が維持される | 未レビュー |

これは予約・変更業務から導く一覧の一部です。人間はタイトルと期待結果、必要な条件を読み、`未レビュー / 要確認 / 確認済み / 要修正`を更新します。業務判断が足りなければCheck側で決めず、業務設計へ戻して合意後に更新します。AIの確信度やTest根拠の強さとは別の状態です。

**なぜTest成功だけでは業務承認にならないか：** Testが通るのは、その条件で書かれた期待値と実装が一致するためです。その期待値をユーザーが望んでいるかは、人間の確認が必要です。未承認の期待値をコードやTestで承認済みにせず、確認済み項目と未確認候補を区別します。

### 5. 先に守る制約をSystem Requirementsとして伝える

業務上の要件と併せて、既存インフラ・DB・公開契約など、実装が守る技術条件を伝えます。全技術判断を先に埋める必要はありません。

| 扱い | 例 |
| --- | --- |
| 制約がある、または変更費用が大きいなら先に伝える | 既存インフラやDB/schemaへの相乗り、指定クラウド、必須外部サービス、公開API、移行・互換性、安全性・法的義務 |
| 希望や組織上の理由があれば伝える | 言語、DB製品、主要ライブラリ。保守体制・既存資産・好みがなければ実装側が選んでもよい |
| 通常は実装とレビューへ委譲する | クラス・関数の分割、内部モジュール、命名など、変更しやすい局所的な技術判断 |

外部サービスは、契約上使う必要があるなら業務成立条件でもあり、単なる実現手段なら技術選択です。名称だけでなく理由を伝えます。アーキテクチャ名も必須ではありません。「外部I/Oなしでコアをテストしたい」など、守りたい性質を伝えれば実装側が構造を選べます。明示された標準や理由のある方式は制約として扱います。

**なぜ全技術判断を先に決めず、詳細設計を独立必須工程にしないか：** 変更しやすい詳細は、実際のDDL・SQL・コード・Testと一緒に具体化し、実装後にもレビューできます。一方、データ移行、外部契約、切替など後戻りが難しい判断は必要な範囲で先に設計します。AIがコードを直せても、永続データや外部契約の変更費用は消えません。[詳細設計の位置づけ](docs/detailed-design.ja.md)と[思想・判断例](docs/philosophy.md#where-detailed-design-fits)を参照してください。

データモデリングも、業務側の構造要求・System Requirements・既存DB制約から選ぶ後続設計です。テーブル定義を合意前に決めきる必要はなく、正規化やDB制約を使う設計知識は引き続き有用です。[データモデリング](docs/data-modeling.ja.md)で詳しく説明しています。

### 6. 合意した設計とCheck ItemをAIへ渡す

業務設計書の版、確認済みCheckのID、技術条件、今回の実装範囲を特定します。既存の文書配置と開発ルールに合わせて、次の例のパスを置き換えてください。

```text
確認済みの docs/business-design/meeting-room.md と
docs/checks/meeting-room.md、プロダクトの技術要件を読み、
今回合意した範囲を実装してください。
既存の開発ルールに従い、コードと実行可能なテストを作成・更新し、
確認済みCheck Itemの条件と期待結果を検証してください。
未決の業務ルールは決めず、具体的な問いとして人間へ戻してください。
独立して進められる作業は続け、重要な前提・判断と理由をレビューへ引き継いでください。
```

たとえば取消期限が未決なら、期限を勝手にTestの期待値へせず、その部分を問いとして残します。合意済みで独立して進められる予約処理まで、一律に停止する必要はありません。重大な判断の理由はDecision Record等へ残しますが、それ自体も業務承認の代わりにはなりません。

### 7. 別コンテキストで実装後レビューし、対応を分ける

実装・製品側の検証後、別のAIエージェントや新しいコンテキストに、設計と実装の版・範囲を渡します。レビューSkillが使えるPluginなら、次のように依頼します。

```text
実装が終わったのでAlderレビューして。
対象は会議室予約の今回の変更です。
業務設計書と実装の対象版・範囲は、添付した参照を使ってください。
```

Skillは**業務設計書 → 判断記録 → 実装・DDL・Test**の順に読み、ファイルを変更せず、根拠・業務への影響・分類・必要な確認を報告します。手動で使う[実装後レビューのプロンプト](docs/adoption.md)と[レビュー知識v0.3](docs/phase2/review-knowledge-v0.3.md)も利用できます。

不一致、業務確認、技術改善、十分な挙動を区別し、未決の業務判断だけを責任者へ戻します。判断後の別follow-upで、意味が変わるなら業務設計書を先に更新・再合意し、必要なCode / Testを直します。Checkと代表Test/assertionの対応・根拠不足もそこで確認・保守します。恒久的な追跡関係は**Business Design ↔ Check Item ↔ Test**までで、Check ↔ Code位置の対応表は維持しません。Testは実行によってCodeを検証します。

## 必要なときに — 業務改善とBusiness Graph

現在の業務関係が確認できているなら、任意の[Structural Discovery](docs/optimization-review.md#optional-structural-discovery-before-a-problem-is-known)で見直す価値のある関係を問いとして探せます。観察ゼロも有効で、構造だけからProblemや負担、改善効果を認定しません。専用のStructural Optimization工程は設けません。

成立している業務に具体的な困りごとがあれば、人間が確認した**Problem / Pain level**をActivityのResultの後へ任意の対として記録し、[Optimization Review](docs/optimization-review.md)へ進みます。購買なら、申請ごとの購入・登録を繰り返す負担から、まとめ買い、自動化、外部委託等を比較できます。[購買改善の提案例](docs/examples/purchase-improvement.ja.md)で、期待効果、Scope、業務変更のDifficulty、採用前の確認を示しています。

採否を決めるのは人間です。Candidate / Difficulty / Confidence等は未承認提案で、現在仕様やGraphへ混ぜません。採用時は**業務設計書を先に更新・再合意**してからCheckや実装へ反映し、有益な候補がなければ現状を維持できます。[改善手順](docs/business-design-improvement.ja.md)を参照してください。

業務設計書を外部ツールで可視化・解析したい場合は、任意の[Business Graph JSON v1 / CLI](docs/business-graph.md)を使えます。JSONは中間形式で、正本は業務設計書です。Business / Objectの明示されたScopeや、記載されたProblem / Painを投影し、未承認候補は投影しません。Procedureは投影の対象外で、構文の成功は業務合意を意味しません。JSON出力や保存は標準設計の完了条件ではなく、外部ツールで得た修正は業務設計書へ戻します。

## 詳しく読む

| 知りたいこと | 文書 |
| --- | --- |
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

このREADMEはmain / PRの未リリース仕様を説明しています。標準の設計業務ではCheck Itemの設計と人間レビューが必須で、released v0.6では任意でした。Plugin版、Alder手法の版、レビュー知識v0.3は別です。Alder全体は研究候補であり、効果や検証範囲は[検証記録](docs/validation.md)を参照してください。

## 質問・改善提案

使ったAlderの版と、対象業務や確認したい点を添えて[GitHub Issues](https://github.com/mk3008/alder/issues)へお寄せください。
