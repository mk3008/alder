# 根拠と検証範囲

2026-10-21。Control: [root #133](https://github.com/mk3008/root/issues/133)、既存Execution: [Alder #253](https://github.com/mk3008/alder/issues/253)／[PR #254](https://github.com/mk3008/alder/pull/254)。新しいIssueは作らず、文書だけの子Draft PRとして分離する。

## 原典

- 購買BD草案固定版: [`6e55d98710a1d8757937ea268176929abcf49b2e`](https://github.com/mk3008/alder/blob/6e55d98710a1d8757937ea268176929abcf49b2e/business-design/purchase-request/README.md)。5 Activity・7 Object・4 Findings。全体合意前の草案。
- [旧全工程モデル（15概念）](https://github.com/mk3008/alder/blob/6e55d98710a1d8757937ea268176929abcf49b2e/business-design/purchase-request/logical-model-review.ja.md)。比較対象であり正解入力にはしない。
- [直近の局所ERラフ](https://mk3008.github.io/alder/preview/logical-model/6e55d98710a1d8757937ea268176929abcf49b2e/index.html#draft)。申請〜承認のみ。今回の新モデルはこのUIへ実装しない。
- 本人の後続指定: root #133 Goalの「モデル見直し（2026-10-20）」、および2026-10-21の本Work依頼。保存時に版と1品目以上、0..1だけを理由に細分化しない、物理構造・アーキテクチャを選ばない。
- [Alderのデータモデリング方針](https://github.com/mk3008/alder/blob/6e55d98710a1d8757937ea268176929abcf49b2e/docs/data-modeling.ja.md)／[詳細設計の位置づけ](https://github.com/mk3008/alder/blob/6e55d98710a1d8757937ea268176929abcf49b2e/docs/detailed-design.ja.md)／[既存欄への構造要求の記載方針](https://github.com/mk3008/alder/blob/6e55d98710a1d8757937ea268176929abcf49b2e/docs/adoption.md#business-structure-requirements-follow-the-work-they-change)。業務上の効果と実現方式を分ける。
- 開始時にroot／AlderのAGENTS.md、#133、#253、PR #254、open PR一覧を取得。新規モデル草案と同じ目的の別PRは一覧に見当たらず、#254をbaseとする文書差分に限定した。#259・#261〜#265等のViewer/SR作業と重複しない。

## 検証

`node work/business-structure-model/issue-133/verify-and-render.mjs` で3枚の関係図を生成し、全関係の端数値、未接続、線共有、数値欄の重なり、相対リンクを検査する。既存ラフの `er-routing.js` を読み取り専用で再利用する。UIコード・表示操作仕様は変更しない。

数量の9例と、Q1〜12の整数について合法なR/C/Wの全分割を列挙し、待ちがある例と3つの終結分類、過剰数量、品目間相殺の反例を確認する。整数範囲は検証fixtureであり、実業務の上限・精度の決定ではない。機械結果は[validation.json](validation.json)に記録する。

[正当例14件・反例14件](review.ja.md)と、5 Activityの入力・生成・利用・状態の机上照合は同一Agentによる自己レビュー。独立Freshではない。現在版切替・同時操作・再送は実行コードを作らず、要求としての整合を点検した。

図は既存の階段・数値表示を使った静的SVG。GitHubのMarkdown／SVG表示で読む。既存ラフにデータ入力口を追加することやViewerに新モデルをハードコードすることはしない。静的図にはドラッグや参照戻り操作はなく、既存のUIからそれらを廃止した意味ではない。

## 未検証・変更しない範囲

必要十分性・読みやすさ・業務上の採否は人間レビュー前。実DB、DDL、動く購買処理、競合・再送防止実装、外部認証・基幹・購買連携、実納品、実機スマートフォンは検証しない。全体CIやViewer E2Eを文書候補の前提として要求しない。

正式BD、旧モデル、Check Item、Skill、Plugin、DDL、Viewer本体、既存ラフのファイルを変更しない。新規Issue・merge・release・本番配信は行わない。旧モデルのPK/FK等を今回の採用済み要件へ引き継がない。
