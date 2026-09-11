# Alder

**設計書の抜けは、実装から見つける。**

Alderは、業務設計（Business Design）をもとにAIや開発者が実装し、その実装をAIでレビューして、業務要件の抜け・意味のずれ・未決事項を人間が判断できる形に絞り込む流れを研究しています。
実装で具体化された意味・処理単位・制約・保証を設計へ逆追跡するため、全要件を完全に決め切るまでコーディングを止めることは前提にしません。

要件記述、実装、ウォークスルー、レビュー、双方向トレーサビリティ、前提や判断根拠を残すDecision Record、人間判断という**既存のソフトウェア工学の仕組みを組み合わせます**。新しい設計理論やアーキテクチャを提案せず、コード配置も規定しません。

**Business Design → Implementation → Review → Human Decision → Update**

## 決めたと思っている仕様を疑う

あなたの設計書で、本当に業務は回るだろうか？

Business Designに未決事項が残るのは自然です。実装すると、その曖昧さがデータ、状態、権限、処理単位、保証についての具体的な選択になります。たとえば「承認済み」が何をどこまで認めるのかは、後続の購入処理まで追うと確認すべき点が見えてきます。

実装者やAIによる合理的な補完も、業務として承認済みとは限りません。実装から設計へ戻り、別の合理的な解釈で現在の仕事や保証が変わる箇所を、人間の判断へ戻します。Decision Recordやテストは意図と挙動の証拠ですが、業務上の承認の代用にはしません。

新しい手法が必要なのか、という問いに対して、Alderは要件の妥当性確認（requirements validation）やレビューなどの古典的な手法を使います。それらをAIが反復して実行できる開発ループとして扱うことが、現在の研究の中心です。

## 開発ループ — 業務を設計せよ。実装で確かめよ。

1. **Business Design** — 現在の業務と、前後の仕事のつながりを記述する。
2. **Implementation** — AIや開発者が実装し、選んだ前提や判断を記録する。
3. **Review** — AIが業務設計・実装・DDL・Decision Record・テストを照合する。担当者として仕事を通して歩き、実装が具体化した意味を設計へ戻って確かめる。
4. **Human Decision** — 現在の仕事に具体的な影響がある未決事項について、条件・根拠・判断責務を示し、業務責任者が判断する。
5. **Update** — 決定を設計・実装へ反映し、次のループへ進む。

レビューでは、要件との確定的な不一致、Business確認、技術改善候補、十分性確認を分けます。**Business確認は、実装修正要求と同義ではありません。** 必要な意味が外部運用や既存の契約で満たされるなら、その根拠を確認して閉じられます。

## Business Designの推奨形式

現在の研究では、業務同士の相関を追える記述として、**5W1HをベースにHowを Input → Procedure → Output で書く形式**を推奨しています。検証したケースが使う現時点の参照形式であり、絶対的な入力仕様ではありません。任意の設計書で同じようにレビューできると確認したわけでもありません。

| 観点 | 記述すること |
| --- | --- |
| What | 業務の名前。Activityを識別するために必須と考える。 |
| Why | 目的。判断・制約の意味を理解する助けになる範囲で簡潔に書く。深い目的分析は必須にしない。 |
| When | 開始契機。原則として、前段の業務結果・外部事象・状態変化を受けて始まる形を推奨する。 |
| Who | 誰の仕事・判断・責任なのか。 |
| Where | 拠点・場所・チャネルが業務判断や手順に影響する場合に書く。意味がなければ「規定なし」でよい。 |
| How | Input：前段・利用者・外部から受け取るもの → Procedure：判断・処理すること → Output：後段へ成立した事実として渡すもの。 |

各欄を機械的に埋めることより、**Whatで業務を識別し、Who / When / Input / Outputから前後の仕事の相関を追えること**を重視します。

Whenは「担当者がやろうと思ったとき」のような自主性だけに依存すると、実施タイミングが担当者ごとに揺れます。人間の裁量そのものが業務上の開始条件なら、その裁量を明示します。これは業務を安定して記述するための推奨であり、review knowledgeに追加するRuleではありません。

記述例：[設備保全](business-design/facilities-maintenance/README.md) / [備品購入申請](business-design/purchase-request/README.md) / [会議室予約](business-design/meeting-room/README.md)

## Review knowledge v0.3

現在の[review knowledge v0.3](docs/phase2/review-knowledge-v0.3.md)は、3問・2手順・1分類条件からなる研究候補です。

| 区分 | 観点・手順 |
| --- | --- |
| Q1 | 事実を保って仕事を継続できるか |
| Q2 | 制約の原因と残る効力は説明できるか |
| Q3 | 前後の仕事で意味・条件・保証がつながるか |
| P1 | 担当者として通して歩く |
| P2 | 実装が選んだ意味から戻る |
| S | 意味を確認してから要求を止める |

Business Designで範囲を定め、順方向の成立を確認した後、P1 / P2でQ1〜Q3を当てます。見つけた差の具体的な影響と依存を確かめ、最後にSで分類します。適用範囲・止める条件・分類の詳細はリンク先を参照してください。

## 何を検証したか

既存の3つの業務ベンチマークで実装とFresh reviewを実施しました。Fresh回帰検証では、過去のレビュー結果を参照しないAgentが固定された実装をレビューしています。

| ベンチマーク | 業務の範囲 | Fresh回帰検証 |
| --- | --- | --- |
| 設備保全 | 故障報告、日程設定、完了、安全閉鎖・解除 | [#32](https://github.com/mk3008/alder/issues/32#issuecomment-5630178622) |
| 備品購入申請 | 申請、承認・却下、購入完了 | [#33](https://github.com/mk3008/alder/issues/33#issuecomment-5630314919) |
| 会議室予約 | 空き確認、予約・変更・取消、利用可否の管理 | [#36](https://github.com/mk3008/alder/issues/36#issuecomment-5633135941) |

この固定セット内では、業務上の未決事項を見つけ、特定の実装案を勝手に要求せず、Human Decision候補として残すレビューが観測されました。たとえば会議室予約では、「予約可能」という一覧の保証範囲をBusiness確認として残しつつ、予約時の正当な再検査を欠陥扱いせず、未来限定検索などの解決策も固定しませんでした。

**検証限界：**

- 全欠陥を必ず検出するわけではなく、完全性は保証しません。
- Fresh実行ごとに同一論点が完全再現されるわけではありません。予約保存後の結果受領中断・予約ID喪失時の照合責務は、#34で観測されましたが#36では主要論点として再現されませんでした。
- 検出率改善や一般化の因果効果は未証明です。
- #32 / #33は#31の補正後、#36は#35のQ3 Boundary補正後の検証です。最終補正後に3ケースすべてを再実行したという意味ではありません。

証拠と非再現の詳細は[review knowledgeの検証記録](docs/phase2/review-knowledge-v0.3.md)にまとめています。

## Alderが規定しないこと

- アーキテクチャスタイル、コード配置、レイヤー構成。
- 新しいDomain Modeling手法や独自のモデリング言語。
- 未記述事項をすべて機能追加へ変換すること。

Alderはフレームワーク・パッケージ・CLIとして提供するものではありません。リポジトリ内の実験用実装は検証材料です。レビューで確認する業務上の依存を超えて、アーキテクチャ一般論や外部境界レビュー全般へ責務を広げません。

## 現在地と次の問い

現在は**research candidate（研究候補）**です。review knowledge v0.3を参照できる形で保存していますが、普遍的な正式Ruleとして認定したものではありません。

次に検討するのは、実装前レビューと実装後レビューの役割分担、開発フローやAGENTS.mdへの組込み方、review knowledge変更時の低コストな回帰運用です。

[評価運用方針](docs/evaluation-plan.md#review-knowledge-benchmark-operation-2026-09-11)では、既存3ベンチマークを固定セットとして優先再利用し、局所変更は影響するケースだけを再実行します。過去の全指摘の再現を合格条件にはせず、変更で狙った能力と過剰要求の有無を確かめます。

## Repository map

| 読みたいもの | 参照先 |
| --- | --- |
| 業務設計の記述例 | [設備保全](business-design/facilities-maintenance/README.md) / [備品購入申請](business-design/purchase-request/README.md) / [会議室予約](business-design/meeting-room/README.md) |
| レビューの観点・手順・境界と検証証拠 | [Review knowledge v0.3](docs/phase2/review-knowledge-v0.3.md) |
| ベンチマークの再利用・局所再実行 | [評価運用方針の追記](docs/evaluation-plan.md#review-knowledge-benchmark-operation-2026-09-11) |

### Historical / earlier research — Scope-First

初期のScope-First研究は、AI支援開発の小さなリポジトリ契約を検討した記録です。Phase 1から事前登録評価へ進み、最初の実行環境での認証失敗を経て、Fresh Agentによる4組のパイロット比較を完了しました。結果は **NO_PRACTICAL_SEPARATION_OBSERVED** で、候補を規範的なルールへ昇格させていません。現在のreview knowledge研究とは分けて参照してください。

- [Research synthesis](docs/research.md) / [Candidate proposal](docs/proposal.md) / [Sources and evidence boundary](docs/sources.md)
- [Preregistered evaluation plan](docs/evaluation-plan.md)（末尾に現在の評価運用方針を追記）
- [Freeze record](docs/phase2/freeze-record.md) / [Frozen candidate](docs/phase2/candidate-contract.txt) / [Matched task packets](docs/phase2/task-packets.md)
- [Run record and invalidity log](docs/phase2/run-record.md) / [Pilot results](docs/phase2/results.md)
