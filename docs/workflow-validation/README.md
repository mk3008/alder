# 業務設計からの段階的開発 — 次の適用検証

Current resume (2026-09-10): [Astra prospective amendment](pilot/ASTRA_RESUME.md).
Stage 1–2 adopted; Stage 3 remains blocked on HB-WV-S3-01. Independent
instrument repairs are prepared, not executed. The preparation record below
is preserved as historical context; its execution policy is superseded
prospectively by the linked amendment.

Status: **PREPARATION — NOT EXECUTED**.

この文書は、完了した研究の参照先と、次に検証する人間要件を整理した準備記録である。候補手順・シナリオ・受入条件の凍結や、Terra/Solによる新しい実行を行った記録ではない。正式Rules、新アーキテクチャ、比較実験の結論ではない。

## 1. 完了した研究と、新しい作業の分離

新ブランチは既定ブランチの `2fc64e261772b76099df92ed11fb6c55c234b28c` から作成した。完了した研究ブランチをそのまま延長せず、以下の固定SHAを資料として参照する。

| 研究 | 保存先 | 固定evidence head | 扱い |
| --- | --- | --- | --- |
| 意味的スコープと物理配置の研究 | [PR #1](https://github.com/mk3008/scope-semantics-across-architecture-labels/pull/1) | `83ae6041e134ee98d965f0a6008972c87a9bcf19` | Phase 9で研究チェックポイントに到達。Phase 3のINVALID等は保持する。 |
| 業務プロセス整合性の縦断dogfood | [PR #2](https://github.com/mk3008/scope-semantics-across-architecture-labels/pull/2) | `c8317d0b7d112a71b28c13db8a807ccf41b92aed` | Stage 1–6完了。新しいシナリオを追加しない。 |

両PRは整理開始時点でopen/unmerged。旧evidence、ブランチ、レビュー履歴を削除しない。この準備ではmainへのmerge、PR close、branch削除を行わない。新しい検証は旧PRのmergeを前提にせず進められる。

### 先行証拠の入口

- [配置研究のREADME](https://github.com/mk3008/scope-semantics-across-architecture-labels/blob/83ae6041e134ee98d965f0a6008972c87a9bcf19/README.md)
- [配置研究の既存文献と証拠の境界](https://github.com/mk3008/scope-semantics-across-architecture-labels/blob/83ae6041e134ee98d965f0a6008972c87a9bcf19/docs/sources.md)
- [Stage 1–6 review packet](https://github.com/mk3008/scope-semantics-across-architecture-labels/blob/c8317d0b7d112a71b28c13db8a807ccf41b92aed/docs/business-process-dogfood/REVIEW_PACKET.md)
- [最終Solレビュー](https://github.com/mk3008/scope-semantics-across-architecture-labels/blob/c8317d0b7d112a71b28c13db8a807ccf41b92aed/docs/business-process-dogfood/reviews/stage6-final-sol-review.md)
- [Human Decisionと影響](https://github.com/mk3008/scope-semantics-across-architecture-labels/blob/c8317d0b7d112a71b28c13db8a807ccf41b92aed/docs/business-process-dogfood/HUMAN_DECISION_IMPACT.md)
- [構造の履歴](https://github.com/mk3008/scope-semantics-across-architecture-labels/blob/c8317d0b7d112a71b28c13db8a807ccf41b92aed/docs/business-process-dogfood/STRUCTURE_TIMELINE.md)

PR #2の最終レビューは、対象経路の一事例としての成立、明示的な業務判断への依存、3回のプレリリースDDL変更を報告している。最終ソースは一つの `src/app.js` のままで、内部責務の整理とディレクトリ階層の成長は区別する。累積検証はProtocol Amendment 001以降の条件であり、過去のworker入力、モデル/session、並行実行、障害復旧、実在庫、post-releaseへの一般化には制限がある。これらを次の検証で解消済みと扱わない。

## 2. 今回まとめたいもの

新しい原理を発明するのではなく、既存の業務分析、情報隠蔽、カプセル化、凝集・結合、機能/コンポーネント単位の配置、YAGNI、リファクタリング、回帰検証を、誤解しにくい判断順序と開発手順にまとめる。

目的はDDD等との勝ち負けではない。既存方法論でも理論上可能かを論じ続けるのではなく、この説明に普通に従ったとき、以下の開発が実際に回るかを確かめる。既存知見を組み合わせたことだけで、この手順の実効性が立証されたとは扱わない。

## 3. 人間要件 — 候補手順を作る際の境界

1. 業務と手順を設計し、それをもとに必要な機能から順次実装する。全画面・全機能の仕様完成を着手条件にしない。業務設計、規則、初期DDLには考慮漏れがあり得る。
2. データモデルは業務を接続するために存在する。今回はプレリリースであり、業務の意味を保つために必要なDDLの直接修正を許容する。本番データや互換性義務を持つ変更は今回の範囲外。
3. 技術レイヤーを出発点にせず、現在の業務上の所有・利用範囲から実装を配置する。意味のある複数スコープがある場合、その関係が物理階層から読めることを目指す。ディレクトリを増やすこと自体は成功条件にしない。
4. 狭い範囲の内部実装は原則としてその範囲の内部に置き、外部から必要な操作だけを公開する。フォルダーによる意図の表現と、言語・ツールによる強制は分ける。特定言語のアクセス修飾子は成立条件にしない。
5. 各業務が共通のテーブルを使うことを禁止しない。コードのカプセル化を理由に、必ず共通Domain Model/Repository経由にする規則を追加しない。
6. レイヤー、共有処理、モデル等は現在必要なら導入できるが、先回りして全機能へ強制しない。共通化する業務上の意味と、コード共有の有無を同一視しない。
7. 機能追加・整合性確認の後に必ず構造を再評価する。現状維持を正解とせず、必要なら分割・統合・移動・公開範囲の縮小・不要な中継の撤去を行う。ただし変更不要の判断も正当。仕様変更と、振る舞いを保つリファクタリングを区別する。
8. 既存要件から解消できる実装不具合、意味を変えない表現修正、通常の可逆的実装選択は、関連検証とともにAIが処理する。選択肢が複数あるだけで人間へ戻さない。
9. 現在不要な将来方針は未決定として残せる。現在の業務結果・権限・許可状態・データの意味を変える選択が必要なら、人間へ推奨案、根拠、不都合、代案、影響範囲、必要最小限の回答を提示する。黙って業務方針を選ばない。
10. 人間判断に依存しない現在の作業は進められるが、未決定の意味を採用済みコードやテストへ埋め込まない。不要な停止の削減は、無断決定の増加で達成しない。
11. 要件の漏れは許容するが、確定済み要件の引継ぎ漏れを許容する理由にはしない。現在の実装に対して有効な過去の受入条件を累積実行する。

配置判断の先行候補は次の一文。ただし、この一文だけで上記すべてが実現できると仮定しない。

> For physical placement, choose the narrowest meaningful semantic boundary that owns the decision and contains its current required consumers.

## 4. 次の最小検証で確認するもの

検証対象は「短い候補手順で、外から毎回設計をやり直して教えなくても、意図した開発を進められるか」。無指示で同じ構造が自然発生するかの検証ではない。

同じ注文シナリオを再演せず、別のプレリリース業務シナリオを一件選ぶ。異なる担当者・時点の業務が複数あり、データを通じて接続し、追加変更によって関係する業務規則や利用範囲を見直す必要がある題材とする。期待するフォルダー木、クラス名、共有の移動先は課題に含めない。

新しいアプリ側のfixtureは、先行研究の巨大なevidenceや完成済み `app.js` をそのまま持ち込まない。初期DDL、公開済みの業務説明、現在のコード・有効な規則だけを使える最小の実行環境にする。初期DDLが後続概念の手がかりになる条件は隠さず記録する。

一件の短い縦断pilotに限定する。観測は以下を分ける。

- 決定済み要件から自動で修正できたもの。
- 既存情報の論理的帰結と、外から追加した業務方針。
- 人間への必要な判断依頼と、不要な停止・実装判断の押戻し。
- 推奨案が提示されたか、その根拠と影響が判断に十分だったか。
- 内部責務の整理、物理配置、公開境界、実際の依存関係の変化。
- 変更しなかった構造の理由と、使われなくなった共有・中継を見直したか。
- 修正後の現在のコードに対する累積検証。

フォルダー数、クラス数、ゼロblocker、新規性、DDDへの優位性を合否にしない。自動化の結果と、人間/ChatGPTが追加説明した効果を混ぜない。

## 5. 実行と証拠の最小条件

- 実装・修正・リファクタリング: Terra / medium、fresh workerを要求。
- レビュー: 別のfresh Sol / medium、read-only。既定の安全な検証用DBでのテスト実行は許容し、実施の有無を記録する。
- requested条件とactual model/version/sessionを区別する。取得不能な値を捏造しない。起動不能なworkerを別モデルや同じ担当者で実行したことにしない。
- 実装前に候補手順、既知の要求、受入条件、観測項目を固定する。未決定の業務方針に合否を捏造せず、決定後に対応する条件を固定して依存実装を再開する。
- テストは業務要求と決定から導く。完成コードの現状をそのまま正解にしない。実装担当が判定基準を変更して通すことを禁止する。
- current implementation、要求、規則、判断、テスト結果、レビュー、構造diffを一つの入口から追えるようにする。過去と現在の台帳を混同せず、現在有効な見取り図も維持する。
- 実際にworkerへ渡したファイル一式とhashを記録する。自己完結性をファイル名やrule IDだけから推定しない。将来packetと評価側の期待事項は別に保管する。
- 旧研究の欠落記録を後付けで再現したことにしない。新しい計測が必要でも、大規模runnerや多数の重複台帳を作ることを目的にしない。

## 6. 今回の完了条件と非対象

次の一件について、採用した候補手順、実行履歴、受入結果、自動対応/人間判断/未検証の区別を示し、独立したSolレビューを受けたところで停止する。人間判断が必要なら、関連する未解決事項をまとめ、推奨案付きでその手前に停止する。

今回行わないこと: DDD/Clean/VSAとの多群比較、名称や新規性の議論、正式Rules/installerの公開、post-release研究、本番データ操作、旧PRのmerge/close、旧ブランチ削除、シナリオの無断追加。
