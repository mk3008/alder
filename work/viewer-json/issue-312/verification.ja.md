# Phase C Viewer検証記録

## 対象と条件

- Control: [root #177](https://github.com/mk3008/root/issues/177)、Execution: [Alder #312](https://github.com/mk3008/alder/issues/312)、Draft PR: [#313](https://github.com/mk3008/alder/pull/313)。
- Phase A `85ed1d14b0e6cc0cdc9c62f6e4ac37d8b187acf8` とPhase B `5a1a4f47eb4635e6221bffa39e5d52fe2f8519bc` は受入済み・未マージ。Viewerの見た目・操作基準は#301 `868db62a151f2644a0f6fcbca53d29bff9f75329`。
- 表示のラフ `b0c26685586c7130a31f371c47eaaefc5851fee3` について、本人から表示方向の継続指示を受けた。最終GUI受入、業務意味の合意、Phase C全体の受入とは区別する。
- 先に固定した検証正本は `web-viewer/verification/json-05-viewer.check-items.json`（SHA-256 `c1f6f0be6e7400cd5c84cafce067656d2d3aa4dcd4a4ac0518fdf3927d452f77`）。既存のViewer検証正本も維持する。

## 再現する入力

`synthetic.json` は表示用合成例。複数主体、Role兼任、複数Step/Result、Stepの適用条件と順序制約、同じDataを参照するInput/Outputを含む。

`work/plugin-json/issue-310/reviewed-seed.json`（SHA-256 `c187376c4d49f3e6da9756bc8cfc167c30f6ee68c22a865e05d124a8c1293181`）は、Phase Bで作った合成0.5 BD・Check・部分Stateの組。Checkの「確認済み」は合成試験の記録であり、実業務の承認ではない。

## 検証と範囲

- `cd web-viewer && node --experimental-strip-types web/test-json-05-viewer.mjs`：採用5例、File adapter、複数主体と未決、Step/Result/Dataの詳細、無効入力、外部原典Checkの0.5/0.4互換を検査する。対象ID・入力ケースの欠落検知を含む。GUIを含む要件の全体受入を表さない。
- `cd web-viewer && node web/test-browser.mjs --cases json05`：既存Playwright/Chrome harnessと127.0.0.1のbuild previewを用いる。Phase B合成seedについて、File入力、Activity詳細、Checkの状態とbasedOn、State表示、再読込、4種の不正File、URLと不正更新時の保持、外部原典Checkを確認する。1280pxと393pxのviewportで実行し、書込みリクエスト・page errorの不在も確認する。
- ローカルの限定実行ではChromium 141.0.7390.37で上記2幅が成功した。393pxはエミュレートしたviewportであり、物理モバイル、OSのファイル選択ダイアログ、本人の操作を代替しない。
- 外部原典の参照目録を共通モデルから落とす旧候補では、正式Validatorが受理する0.5外部Check付き文書が `Dangling reference: external-bd` で読込失敗した。目録とsource descriptorを保持し、同じ共通参照Validatorへ渡す修正後に0.5・0.4の正例と不正な参照版の拒否が通った。外部Checkを表示中のBDに結び付けないことも確認する。
- head `d5ddf4414612b2a00295b6a388588b9ea82f21d8` のViewer CIは、既存 `tabStrip` のURL切替直後に更新ボタンを検査し失敗した。旧テストは元のサンプルもURL読込後もタブ数が1件で、タブ数だけの待機が読込完了を保証していなかった。URL応答を600ms遅らせる限定再現で同じ失敗を確認。修正後は応答を明示的に保留して旧サンプルの無効状態を検査し、応答後はダイアログが閉じて更新ボタンが有効になるのを待ってから、既存の配置・操作・状態の検査をそのまま行う。Chromium 141の `--cases tabStrip,json05` は両方成功した。
- 同head CIと本人GUI確認の成否はPR/Execution/Controlに記録する。0.5専用項目は個別の機械検証と人間レビューを分け、既存ブラウザー回帰だけで網羅成功とはしない。

## 未決の互換性

Phase Bの `reviewed-seed.json` に、既存State遷移を同一fromId/activityId/condition・別id/sourceIdで複製すると、B受入Validatorは受理する。C候補は#301の状態条件一意性により拒否する。現在の候補は#301と一致するが、Bで受理した全入力の互換を維持できない。判断の選択肢と影響は[PR #313](https://github.com/mk3008/alder/pull/313#issuecomment-6514966365)と[root #177](https://github.com/mk3008/root/issues/177#issuecomment-6514966118)へ返却済み。本人の表示方向への回答をこの互換性判断に読み替えず、Chatレビューを待つ。
