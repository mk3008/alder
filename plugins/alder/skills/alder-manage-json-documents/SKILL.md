---
name: alder-manage-json-documents
description: Create, update or review Alder typed JSON Business Design/Check/explicit partial State Transition package, as the default for new artifacts, or explicitly convert existing Markdown to JSON. Use for 「Alderで業務設計をJSONで草案にして」「このJSONの業務を追加・改名して」「JSON正本からCheckを作って」「AlderのMDをJSONへ変換して」. Preserve human agreement gates and existing Markdown workflows. Not general lifecycle/concept model specification, Viewer implementation, or business approval.
license: MIT
---

# AlderのJSON文書を作成・更新する

新規作成で形式が未指定ならJSONを既定とする。新規草案は[JSON構造契約](references/json-native-contract.ja.md)の候補0.4で作成する。例外をID付き要素として定義し、状態操作はexceptionIdで参照する。説明文の装飾から例外を認定しない。旧JSON／MDは互換入力または明示移行だけに使い、JSONから仮MDを生成しない。

[JSON操作ガイド](references/plugin-json-authoring.ja.md)を読み、操作を選ぶ。実際の導入版は`../../plugin.json`、同梱ソースの版/hashは[provenance](references/provenance.json)で確認する。候補契約は`alder-document-package/0.1（BD/Check）、0.2（部分定義の状態遷移）、0.3（Role ID/名称/保存色）、0.4（構造化した例外とID参照）`。Plugin版やGraph v1と混同しない。

1. 対象ProjectのAGENTSと既存正本、今回の依頼を読む。既存正本のformatを確認し、新規作成はJSON、既存JSONは同じJSONを更新する。既存MDを指名した改稿は元のMD Skillの互換経路へ戻り、明示依頼なしに移行しない。MD原典から新規JSON Checkを作る場合も、一方向変換の明示依頼と対象BD版への人間合意を先に確認する。
2. BDの作成・改稿には[adoption](references/adoption.md)のsection 1と[文書構造](references/business-design-structure.ja.md)を読む。JSONでは見出しを[Schema](scripts/document_storage/schema.json)の型付きフィールドへ対応させ、Markdown中間正本を作らない。既知の入力・IO・条件・役割・Procedure/Resultを保持し、未決を推測補完しない。
3. [同梱runtime](scripts/document_storage/author-cli.mjs)のruntimeを実行する。直接JSONはNode24以上、MD変換はPython3.12以上も必要。利用不能なら報告してその操作を止める。repo clone・外部API・ランタイムの無断導入を要求しない。
4. 作成はIDを割り当ててJSON候補を直接書き、validate→create→保存後inspect/validateを行う。更新は既存IDを維持し、文書/package版とファイルhashを照合するcommitを使う。参照・版ずれ、既存lock、競合、未対応欄を修正したふりで通さない。
5. BDレビューでは[品質](references/business-design-quality-check.ja.md)、[相関](references/business-design-correlation-check.ja.md)、[漏れ](references/business-design-omission-check.ja.md)、[Findings](references/design-findings.ja.md)を適用する。review-onlyは読取り・検査・指摘だけにし、保存・状態変更しない。
6. Check操作では[Check契約](references/check-item-traceability.md)を読み、**正確なBD版に対する人間合意を先に確認**する。なければCheck草案/更新を止め、必要な業務判断を求める。[共通の意味保持圧縮指針](references/check-item-traceability.md#meaning-preserving-condition-compression)を条件組合せの検討・草案・更新・Consistency reviewに適用する。共有保証・例・根拠・Test証拠・既存ID/人間状態を保持する。確認済みへの変更は該当期待への実際の人間発言と候補hashを明示し、テストや無回答から推定しない。basedOn.verificationはunverifiedのままにする。
7. Roleを含む新規JSONは[ロール契約](references/json-roles.ja.md)を読み、rolesの安定ID/名称/基本5色を一元化してActivityから参照する。改名でID/色を変えず、複合Whoは原文と未確定診断を残す。旧JSONの移行は候補作成と明示migration commitに分け、原本・人間Checkゲートを保持する。
8. BD・Checkの草案作成と更新は、通常の依頼の中で[返却前の意味レビューと修正反復](references/plugin-json-authoring.ja.md#返却前の意味レビューと修正反復)を必ず実行する。全体Schema/参照/版の構造検査に加え、品質・相関・重要な漏れ、手順の具体性や要求・業務意味の対応を点検する。read-onlyの実レビュー→作者の根拠付き修正→修正版の再レビューを行い、影響箇所と依頼範囲全体を確認する。Checkは保存候補とBD全体の一般保証・具体例・共有参照を照合する。別readerがない場合は同じ文脈で工程を分け、非独立と開示する。未決の規則を創作せず、同じ指摘の非改善・レビュー失敗や利用不能では停止して最後のレビュー版と残件を返す。review-onlyでは修正・保存・再帰レビューを行わない。人間に別の品質チェック依頼やJSONの手修正を求めない。

明示的なMD変換は[同梱converter](scripts/document_storage/cli.mjs)のconvertを使う。元MDを保持し、旧MD全文の同梱・JSON→MD同期を行わない。購買研究草案の未知見出しやCheck原典版の不一致は診断して止める。

明示された部分定義の状態遷移は[状態文書契約](references/json-state-transitions.ja.md)を読み、既存ID・未決・例外名・根拠を保持して直接草案/更新する。一般の状態遷移や概念モデルの業務意味、JSONの正式v1採用、Viewer対応、配布/releaseはここで決めない。保存した版・実際に使ったランタイムと検査結果、残る未決と人間判断を短く返す。
