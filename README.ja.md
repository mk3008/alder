# Alder

[English](README.md) | 日本語

**設計書の抜けは、実装から見つける。**

Alderは、誰が、いつ、何を受け取り、何を成果として渡すかを記述した**業務設計**をもとに、AIエージェントが実装し、別のエージェントや新しいセッションでレビューする開発の流れを研究しています。実装で具体化された業務上の意味が設計のどこから来たのかをさかのぼり、抜けや未決事項を人間が判断できる問いに絞り込みます。すべての業務判断が決まる前でも、コーディングを始められます。

要求の妥当性確認、ウォークスルー、要求と実装を双方向にたどること、判断記録、人間による判断といった既存のソフトウェア工学の手法を、AIで繰り返し使うために組み合わせます。新しい設計理論やアーキテクチャを提案するものではありません。

**業務上の意図を定め、承認するのは人間。実装はAIが行い、別のAIがレビューする。未決の業務判断だけを人間に戻す。**

## プロダクトで始める

**実装後レビュー**にはAlder Plugin `0.1.0`を一度インストール・有効化し、新しいチャットを開始します。

```sh
codex plugin marketplace add mk3008/alder --ref plugin-v0.1.0
```

現在の業務設計をプロダクトの `docs/business-design/` に置きます（既存の別の場所なら、そのパスだけ指定します）。実装後、新しいチャットで次のように依頼します。

```text
実装が終わったのでAlderレビューして
```

Pluginが業務設計を探し、同梱のreview knowledge v0.3で読み取り専用のレビューを行います。標準パスではレビュー知識のコピー、長いプロンプト、Alder専用のAGENTS.md設定は不要です。人間の判断の反映とCheck ↔ Test/assertionの対応は別のフォローアップで行います。[Pluginの導入手順](docs/plugin-adoption.md)で有効化を確認してください。業務設計、実装への引き渡し、ほかのAlderワークフロー、Pluginを使えないクライアントでの手動レビューは[導入ガイド](docs/adoption.md)を参照してください。

人間が具体的な**困っていること（Problem）**と**困っているレベル（Pain level）**を記録した場合は、業務設計に対して[Optimization Review](docs/optimization-review.md)も実行できます。少数の代替業務案を探索し、Scopeと業務変更Difficultyを評価します。人間が変更を決めるまでは既存の業務上の意味を維持し、採用する場合はBusiness Designを先に更新します。

**Alderは、アーキテクチャの形式や構造を導入する時期を規定しません。** 実装を担当するAIには、業務設計、明示的な要求・制約、実際に予見している将来のリスクを具体的に伝え、実現方法を任せます。アーキテクチャの知識はその判断に使えますが、形式の名前だけでは要求の代わりになりません。

技術候補を比較するときは、**測る前に推論します。** 要求、リスク、規模、実行時の振る舞い、既存の根拠から、結論を変え得る不確実性へ検証を集中します。任意の評価には上限と停止条件を持たせ、プロダクトがより深い最適化を明示的に求めていないなら、十分な根拠のある妥当解で止めます。数値目標がないことだけを理由に、人間へ確認を戻す必要はありません。

[Alder Pluginの導入へ（英語）→](docs/plugin-adoption.md) · [手動の導入手順と参照用プロンプトへ（英語）→](docs/adoption.md)

## 詳しく読む

| 知りたいこと | 文書 |
| --- | --- |
| 一度のPlugin導入と短い実装後レビュー依頼 | [Alder Plugin（英語）](docs/plugin-adoption.md) |
| 初期Plugin検証、Fresh A/B比較、残る限界 | [Issue #86検証記録（英語）](docs/plugin-poc-evaluation.md) |
| 作業環境、業務設計の形式、AGENTS.mdでの参照先の案内、プロンプト、SQL関連ツールとの併用 | [導入ガイド（英語）](docs/adoption.md) |
| 実装を要求の妥当性確認に使う理由、推論、DDDやアーキテクチャとの関係 | [設計思想（英語）](docs/philosophy.md) |
| レビューの観点・手順・適用範囲・止める条件 | [レビュー知識 v0.3](docs/phase2/review-knowledge-v0.3.md) |
| Problem / Pain / Scope / Difficultyを使って業務の代替案を検討するレビュー | [Optimization Review（英語）](docs/optimization-review.md) |
| Check・Testを確定する前に未記載の機能条件を人間へ返す任意工程 | [考慮漏れ検証](docs/behavior-derivation/functional-considerations.md) |
| 必須の検査項目設計と人間レビュー、AIによる業務設計・Check Item・Testの対応関係の保守 | [Check Item traceability（英語）](docs/check-item-traceability.md) |
| 検討済みの仮説、採否、主要な既存工学上の由来、適用限界と再検討条件 | [研究判断の索引（英語）](docs/research-decisions.md) |
| 検証の根拠と限界、今後の問い、過去の研究 | [検証記録（英語）](docs/validation.md) |

**Alder v0.6** では、Problem起点のOptimization Reviewを正式なワークフロー能力として追加しつつ、恒久的なtraceabilityは **Business Design ↔ Check Item ↔ Test** のままです。リリース済みv0.6では検査項目の作成と追跡関係の保守は任意ですが、**今回の未リリース版**で、検査項目の設計と人間レビューを実装への引き渡し前の必須工程に変更します。標準設計業務は引き渡しで完了し、実装後の別運用であるAlderレビューとフォローアップがTestの期待結果を確認し、Check ↔ Test/assertionの対応を保守してから実装変更を受け入れます。Testは実行によってCodeを検証し、Check Item ↔ Code の物理位置mappingは持ちません。研究候補の**レビュー知識 v0.3**も変更していません。Alder全体は引き続き研究候補ですが、Optimization Review自体はadoptedです。[v0.6リリースノート（英語）](docs/release-notes-v0.6.md)も参照できます。フレームワーク、CLI、実行時パッケージの導入は不要です。

## 外部ツール向けBusiness Graph export（任意）

[Alderを使った設計業務のBusiness Design](business-design/alder/README.md)を、外部ツールで可視化・解析・加工したい場合は、業務設計や依頼者レビュー、設計者のセルフレビュー時に任意でJSONへ投影できます。BusinessとObjectのScopeは、それぞれ原文で明示した真偽値を投影し、Objectの内外を接続の向きから推測しません。JSONは中間形式であり、標準Business Activityや依頼者への成果物ではありません。利用や生成ファイルのcommitは標準設計業務の完了条件ではなく、このリポジトリの生成例はexporterの回帰用fixtureです。外部ツールで見つけた修正はSSOTであるBusiness Designへ反映します。Procedureは投影対象外です。[CLIの利用方法と形式](docs/business-graph.md)を参照してください。
