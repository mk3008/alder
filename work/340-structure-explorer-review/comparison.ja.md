# #340 Phase 1：main と構造エクスプローラーの保証比較

基準は main `777b79a4f919a1456c74a724b949bc7748f32df1`（#359 / #348 Phase 2 統合済み）。表示の移植元は Draft #357 `887c0f60a191d06e1db0ed50567844cca2ec1950`、その base は `2bede8037078bde07039b47735d4618d6322bb5a`。#357 全体と main の差分は契約・Plugin・概念図配線まで含むため、一括適用しない。

旧候補は #309 `85ed1d14b0e6cc0cdc9c62f6e4ac37d8b187acf8`、#311 `5a1a4f47eb4635e6221bffa39e5d52fe2f8519bc`、#313 `fa93735283f84e51fceac74e07b35f9df70d2d9a` を読取固定。[以前の比較](https://github.com/mk3008/alder/issues/340#issuecomment-6563283832)を、今回の main とレビュー環境の範囲に更新した。以下の「保持」は現行契約の維持であり、未統合の旧候補を採用した意味ではない。

| 保証単位 | 今回の判断 | 衝突点・根拠 | 実装境界・検証先 |
| --- | --- | --- | --- |
| File / URL / 復元、JSON中心の入力 | main保持 | mainは0.1–0.3を互換adapter、0.4を通常経路で読む。旧0.5追加を含む#357のdocument-input/compat-json-05は移植しない | document-input / json-document / main は不変。test-document-loader / json-document / json-native / source-sharing / save-state、Chrome jsonDocuments等 |
| 業務・状態・概念・サブシステム・テスト仕様 | main保持 | mainの表示・タブ・可否/処理結果・Result/例外/Checkの導線が正本。#357 base側の業務Procedure拡張や概念図配線は別判断 | viewer-shellの構造表示用分岐だけを追加。mainのconcept-views / canvas / layout / routing / document-view / graphは不変。verify:contract、既存npm test、Chrome全体 |
| 現在対象と選択、相互ナビゲーション | main保持 | 別カードを選択してもカレントは変わらず、詳細自身への重複リンクを抑える条件付き保証を維持 | verification/check-items.json と graph-rendering.ja.md を既存固定commitで照合。review-navigation-contract / review-explorer-contract |
| 右Drawerの開閉・幅、他画面へ戻る操作 | main保持＋構造画面だけ選択移植 | #357最新の構造詳細は中央で右Drawerを使わない。他画面の共通開閉状態を上書きしない | shellのisStructureView分岐、drawer-resizeの左右指定（既定right）。global-right-drawer / structure-shell / structure-explorer-sidebar、Chrome nodeDrawer / explorerResizeScroll |
| 左Explorerの文章／構造タブ、幅変更 | 選択移植 | 既存文章メニューの順序・件数・選択は保持。構造は別パネル。幅の保存キーと方向は右Drawerから独立 | viewer-shell.ts/css、drawer-resize.ts、explorer-resize-scroll正本とChrome。既存右幅テストの対象selectorのみ右Drawerへ限定し同じassertを維持 |
| 構造の属性・所有・参照・多重度、循環、検索、互換フィルター | 選択移植 | ConceptModelに明記された関係だけを読む。名前から関係・型・人間合意を推測しない。Markdown専用経路は増やさない | structure-explorer.ts/css、structureGraph。#357のstructure-explorer系正本・DOM検査、sidebar / focus-tabs / meaning / relation-keys等 |
| 構造URL・選択・中央の項目表・値域・コピー | 選択移植 | concept=structure-explorer と旧個別構造URLを保持。型の列挙値は候補metaから読み、保存契約として強制しない | shellルーティング、structure-explorer。review-feedback / concept-value-domains / shell / sidebar / Chrome conceptValueDomains |
| JSON候補・未決・理由 | 選択移植（読取固定） | 最新json-complete-concept-review.jsonをbyte同一で引継ぐ。47のnullable=nullを残す。最新表示ではnull理由が詳細から落ちているため、今回の明示依頼に基づき「null許容の理由」を説明/用途とは別欄に表示 | MAIN-REVIEW-001/003、全47項目のDOMと原モデル不変。候補を再生成せず、版/hashをmanifestとPRへ固定 |
| Input / Output詳細、Procedure複数Step・局所順序、複数Result、共有Data | 保留・別判断 | 旧#313/#342/#357 baseの候補。mainの文字列Procedure・Result、既存I/Oを今回変更しない。Activity単位の仕様参照を各Resultへ確定対応としない | document-view / structured-display等を移植しない。既存activity-section-spec-links / business-drawer-direct / test-spec-related-linksを維持。旧0.5の追加検査は未実装・未検証 |
| Who（単一、Role／system／scheduler） | 保留・別判断 | 本人指摘と#340更新を尊重。候補モデルの値域はレビュー材料であり、旧performers[]の複数主体を正式採用しない。mainのroleIdを新Who契約へ置換しない | 原JSON・Schema・roles・保存器不変。既存jsonRoles / document_storageテスト。#357のWho訂正adapterは未移植 |
| 状態自己戻りの束ねと個別ID | main保持 | mainは正常/例外を問わず自己遷移を破線1本に束ねる。旧#313のID別SVG線は採らない。ID・条件・説明・選択・Check対応は統合しない | stateの描画とモデル不変。state-transition-identity / state-self-loop / state-selection-layering、Chrome jsonStates |
| conceptModel 0.1/0.2、Check・例の明示参照 | main保持 | 旧0.5 packageへの単純置換ではmainの概念/サンプル保証を失う。今回の候補ファイルは既存package 0.4 / conceptModel 0.1で読める | Schema・validator不変。test-unified-concept-json/canvas / test-spec-check-samples、storage concept-model / check-samples |
| 読取・編集・明示変換の分離 | main保持 | #348 Phase 2を優先。mainは旧0.1–0.3の閲覧/原本保護と0.4編集、別候補への明示変換を分離する。未対応0.5の読取・訂正保存を今回追加したとはしない | tools/document_storageと同梱runtimeはbyte不変。test-version-policy / test-explicit-conversion / test-authoring / test-named-plans、Storage CI |
| ID・期待版/hash・人間状態・source provenance・遷移の明示削除 | main保持 | 旧#309の無確認rebase防止とmainの概念ID/保存ガードを単純に片方へ置換しない。BD合意をCheckの意味承認にしない | 保存器/原業務JSON/Check不変。test-authoring / test-native-json / test-concept-model / test-check-samples、保護差分ゲート |
| Plugin / Skill・Schema/Validator・正式version/移行 | main保持、旧候補は保留・別判断 | #311/#313/#357 baseには構造契約とruntime変更がある。正式JSON0.5/Who/移行と配布は今回の権限外 | plugins / tools/document_storage / schemaは不変。Plugin Gate B / package CI、Storage Gate A。候補metaを契約の第二正本にしない |
| 固定Previewと本人GUIレビュー | 選択移植（公開方法） | gh-pages-web-viewerの新preview/pr-357/<head>-main-review/だけに追加。本番トップ・既存Previewを不変とする | 公開前後tree比較、配信ファイルhash、HTTP/Chrome疎通。本人の業務疑問・構造不整合の確認は未実施。テスト成功と分けてDraft PRへ返す |

## 保留した契約と未確認

候補のFlowStep、Who、共有Data、null許容、値域、正式版・移行は採用しない。GUIは依頼者がこれらの意味・不整合・不足を確認するための環境である。業務JSONの訂正・人間状態の変更は行わない。

既知の `test-graph-identity.mjs` 配線ポート参照失敗は修正しない。新旧同じ失敗かを比較して結果を記録し、限定検査成功を全体成功として扱わない。今回の照合は同一Agentの修正後の別工程で行い、独立した人間/Agentレビューとは呼ばない。
