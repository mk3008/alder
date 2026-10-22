---
name: alder-manage-json-documents
description: Create, update or review an explicitly selected Alder typed JSON Business Design/Check package, or explicitly convert existing Markdown to JSON. Use for 「Alderで業務設計をJSONで草案にして」「このJSONの業務を追加・改名して」「JSON正本からCheckを作って」「AlderのMDをJSONへ変換して」. Preserve human agreement gates and existing Markdown workflows. Not state/concept model specification, Viewer implementation, or business approval.
license: MIT
---

# AlderのJSON文書を作成・更新する

[JSON操作ガイド](references/plugin-json-authoring.ja.md)を読み、操作を選ぶ。実際の導入版は`../../plugin.json`、同梱ソースの版/hashは[provenance](references/provenance.json)で確認する。候補契約は`alder-document-package/0.1`。Plugin版やGraph v1と混同しない。

1. 対象ProjectのAGENTSと既存正本、今回の依頼を読む。JSONの明示指定か、既存正本のformatを確認する。MDが選ばれている場合は元のMD Skillへ戻り、形式を勝手に変更しない。
2. BDの作成・改稿には[adoption](references/adoption.md)のsection 1と[文書構造](references/business-design-structure.ja.md)を読む。JSONでは見出しを[Schema](scripts/document_storage/schema.json)の型付きフィールドへ対応させ、Markdown中間正本を作らない。既知の入力・IO・条件・役割・Procedure/Resultを保持し、未決を推測補完しない。
3. [同梱runtime](scripts/document_storage/author-cli.mjs)のruntimeを実行する。直接JSONはNode24以上、MD変換はPython3.12以上も必要。利用不能なら報告してその操作を止める。repo clone・外部API・ランタイムの無断導入を要求しない。
4. 作成はIDを割り当ててJSON候補を直接書き、validate→create→保存後inspect/validateを行う。更新は既存IDを維持し、文書/package版とファイルhashを照合するcommitを使う。参照・版ずれ、既存lock、競合、未対応欄を修正したふりで通さない。
5. BDレビューでは[品質](references/business-design-quality-check.ja.md)、[相関](references/business-design-correlation-check.ja.md)、[漏れ](references/business-design-omission-check.ja.md)、[Findings](references/design-findings.ja.md)を適用する。review-onlyは読取り・検査・指摘だけにし、保存・状態変更しない。
6. Check操作では[Check契約](references/check-item-traceability.md)を読み、**正確なBD版に対する人間合意を先に確認**する。なければCheck草案/更新を止め、必要な業務判断を求める。共有保証・例・根拠・Test証拠・既存ID/人間状態を保持する。確認済みへの変更は該当期待への実際の人間発言と候補hashを明示し、テストや無回答から推定しない。basedOn.verificationはunverifiedのままにする。
7. 返却前に全体Schema/参照/版と要求・業務意味の対応を別々に点検する。Checkは保存候補とBD全体を使って、原典→保証/例・全index/共有参照を確認するread-onlyのConsistency reviewを別工程で行う。独立readerがない場合は同じ文脈で行ったと開示する。根拠のある範囲だけ修正し、再検査する。人間にJSONの手修正を委ねない。

明示的なMD変換は[同梱converter](scripts/document_storage/cli.mjs)のconvertを使う。元MDを保持し、旧MD全文の同梱・JSON→MD同期を行わない。購買研究草案の未知見出しやCheck原典版の不一致は診断して止める。

状態遷移・概念モデルの具体Schemaと業務意味、JSONの正式v1採用、Viewer対応、配布/releaseはここで決めない。保存した版・実際に使ったランタイムと検査結果、残る未決と人間判断を短く返す。
