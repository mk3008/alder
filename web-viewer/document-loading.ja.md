# JSON中心のViewer読込

MDは旧ファイルの入力互換として扱う。今後の機能追加先はJSON側の共通モデルと処理とし、MD版を並行開発しない。旧MDの情報・原文・人間レビュー状態と参照は保持するが、旧表示の見出し階層・整形を完全再現することは要求しない。

## 入力と共通処理

新規・履歴・共有URL・再取得は `loadDocumentURL`、Fileは `loadDocumentFile`、貼付本文は `loadDocumentText` から、同じ `parseDocument` を通る。

- JSONはGate Aのstrict parser／validatorで検査して型付き業務モデルへ渡す。
- MDは `legacy-document.ts` が既存の文法検査中にActivityのフィールドを受け取り、同じ型付き業務モデルへ投影する。Procedure／Exceptionを後段でMD sectionから再抽出しない。
- `readViewerDocument` は両形式の同じBusiness Design／Check／状態モデルから、共通の図・Findings・状態panelの入力を作る。
- `document-view.ts` は形式によらず選択した業務詳細とCheckを表示する。原文の形式やMD sectionを参照しない。

`Design.model` は閲覧時の唯一の業務モデル。内部version 1を持つが、正式保存JSONの新しい構造版やBusiness Graph v1ではない。旧 `Design.json` と `ViewerDocumentJSON.storage` のJSON専用payload／旧Design往復は廃止した。元の本文は従来のSessionフィールド `markdown` へ保持し、原文dialogで読取専用表示する。`sections` は旧Design型の空の互換枠として残るだけで、表示・復元・状態図は使わない。

MDの名称ID、JSONのUUIDは維持する。既存の名称IDを入力とする配置器には、両形式とも同じ表示用ID adapterから渡し、座標mapを元IDへ戻す。IDアダプターは配置器・配線・Graph v1の契約を変更しない。

## 旧Checkと状態の境界

外部Check MDのFile/URL読込・原典照合・人間による関連付け確認は旧入力互換として残す。`check-items.ts`／`legacy-check-model.ts` が一度解釈して、JSON側と同じCheck、文章／参照block、保証へ投影する。未知の補足fieldも保持する。原典の一致と項目の人間レビュー状態を混同しない。

取得元recordごとのWeakMapでCheckの投影を再利用する。保存からは派生cacheを信用せず原文から再構成する。業務表示側のMD専用Check本文renderer・形式別タブ生成は廃止した。原典照合・candidate／手動確認の表示は関連付けの責務として残る。

状態panelは共通モデルのActivity ID／Exceptionを参照する。JSONから仮Designと `### Exception` を合成する処理、panel内のMD見出し再解析は廃止。図の既存アルゴリズムへはActivity表示名を投影し、永続IDや遷移の業務意味を変えない。未記載の遷移は補わない。

## 保存と制限

新規・URL履歴と同様、旧MD／JSONの保存復元も原文→共通読込とする。派生Graph／section／modelの欠落・改変は原文から再構成し、原文欠落・壊れた構文、保存metadata不正は採用しない。元recordの非破壊保護、世代CAS、保存成功前に画面を切り替えない契約を維持する。JSON内のCheckが旧MDの外部添付を継承することはない。

Gate AのNode/Python保存コンバーターは独立した明示移行として残す。Viewerは正式保存JSONへの自動移行やMDの上書き、JSON→MD同期を行わない。元MDは保持する。

URL履歴はURL/nameだけで本文を蓄積しない。URL／テキスト2MiB、ローカルJSON8MiB、MIME/CORS・匿名GET・中止、読込失敗時の旧表示保持を維持する。単独Check MDの取得方針はその入力境界だけに残す。

## 回帰と整理した保証

`web-viewer/` で実行する。

```sh
node --experimental-strip-types web/test-document-loader.mjs
node --experimental-strip-types web/test-document-loader.mjs --baseline-model
```

通常は成功する。`--baseline-model` は固定head2574の実parserと依存ソースを使い、手書きの旧MD入力が型付きモデルへ渡らない失敗を再現する。期待値をparser／converterから生成せず、Procedure／Exception／Object／明示関係／未解決Findingを直接指定する。旧MD sectionへのアクセスを禁止して同じ詳細rendererで表示できることも検査する。

履歴不具合の旧head1b82による再現は `--baseline`。現行の新規／履歴・MIME・保存復元は同じ回帰に残す。

| 以前の重複／前提 | 現在の検証先 |
| --- | --- |
| MDの旧section表示とJSON詳細の別経路 | 共通詳細rendererの回帰＋旧MD入力の独立期待値 |
| MDのCheck本文renderer | 共通Check renderer＋旧入力の共有ID・人間状態・保証参照・追加本文の独立期待値。関連付けのDOM／Chrome回帰は維持 |
| section cache欠落で復元拒否 | 原文から再構成し、元recordと座標を保持する復元回帰。原文・metadata不正は拒否を維持 |
| Role版でも同じ11図のChrome操作・撮影を反復 | `test-json-roles.mjs` が旧／Role版の全11図のGraph・文書順・配置入力を比較。共通描画のnative oracleは `jsonLayout` に集約。Role固有の色／改名／選択／復元はChromeに残す |
| CI先行JSON6群と全47群で同じ6群を再実行 | 同じ候補の全47群を一度実行し、失敗時もartifactを回収 |

旧MDとの11図の座標・配線・PNG比較自体は現状維持する。これは共通図への入力・既存配置の回帰であり、旧MD Drawerの整形完全一致を保証するものではない。追加の旧MD専用GUI oracleは作らない。保証移管と誤実装の検出をIssue #274／PR #285へ記録し、影響する速い検証を反復して、最終CIの所要時間を実測する。

2026-10-23の本人承認により、余白修正66a0を同じPR #285へ統合した。業務図と状態図は `caption-spacing.ts` の共通計算を使い、要素→captionとcaption→次要素を各24 world pxとする。状態図は表示する行数だけを一度予約し、matrixの余白を重ねない。既存の保存済みノード座標は自動移行せず、新規配置または明示リセットで新しい行間を使う。

この話題の編集先は `refactor/144-unified-document-loader`／PR #285、作業ディレクトリは `alder-loader` に固定する。旧stackと66a0枝は参照用で並行編集しない。Previewは必ず共通化と余白修正の両方を含む同一headから生成する。Plugin／保存Schema、概念モデル具体仕様、正式JSON採否・merge/releaseは対象外。
