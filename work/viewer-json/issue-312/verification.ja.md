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
- head `d5ddf4414612b2a00295b6a388588b9ea82f21d8` のViewer CIは、既存 `tabStrip` のURL切替直後に更新ボタンを検査し失敗した。旧テストは元のサンプルもURL読込後もタブ数が1件で、タブ数だけの待機が読込完了を保証していなかった。URL応答を600ms遅らせる限定再現で同じ失敗を確認。修正後は応答を明示的に保留して旧サンプルの無効状態を検査し、応答後はダイアログが閉じて更新ボタンが有効になるのを待ってから、既存の配置・操作・状態の検査をそのまま行う。URL要求の待機は10秒に制限し、失敗時も応答の保留を解放する。Chromium 141の `--cases tabStrip,json05` は両方成功した。
- 同head CIと本人GUI確認の成否はPR/Execution/Controlに記録する。0.5専用項目は個別の機械検証と人間レビューを分け、既存ブラウザー回帰だけで網羅成功とはしない。

## B受入0.5の状態互換

[Chatの判断](https://github.com/mk3008/alder/pull/313#issuecomment-6516146229)に従い、package 0.5はBで受理した状態遷移を引き続き受理し、旧0.4以前・Markdownには#301の条件一意性を維持する。0.5の同条件・別IDは業務上の同時成立や人間合意を表さない。0.5への新制約や形式版は追加しない。

- 新しい検証正本 `web-viewer/verification/json-05-state-compat.check-items.json` は実装修正前のcommit `a05d2dd91b608605ac562039020222f0b0578e78`、SHA-256 `bba34937692073b1fb99e7f5cd969e92009e1a47ea9442270aaf84b37c3492f0`、COMPAT-001〜005。既存のSTATE-IDENTITY正本 `3988b606a782cb7519df361d7e821f247bef74c92403971ec728d48b166b3295`、JSON05-VIEWER正本 `c1f6f0be6e7400cd5c84cafce067656d2d3aa4dcd4a4ac0518fdf3927d452f77` は維持する。
- `cd web-viewer && node --experimental-strip-types web/test-json-05-state-compat.mjs`：B合成seedから、同条件・同じ到着先の別遷移と、同条件で到着先未決の別遷移を作る。B受入head `5a1a4f47` のValidator・保存ガードでは元と訂正候補がvalid、修正前のC `4b01036f` は元を拒否した。修正後は元のraw・ID・sourceId・未決・Checkの確認状態を維持し、canonicalと同梱の通常CLIで条件の訂正保存・読戻しを確認する。
- 同テストは同条件3件・自己戻りの別遷移、旧0.4/MD拒否、stale hash/revision、不正参照、ID/sourceId変更、無確認rebaseの拒否と元bytes保全も検査する。DOMでは各遷移に個別のpath・caption・詳細があり、同じ出発/到着のpathが一致しないことを検査する。
- `cd web-viewer && node web/test-browser.mjs --cases jsonStates,jsonDocuments,json05`：Chromium 141、1280/393pxで通常File・URL・再読込、各sourceIdの線・キャプション・詳細、未決と元JSONの保持を確認。合成例では同一出発・到着の線の出発点と到着点が別であり、線がキャプション文字を横切らないことも検査。旧形式の状態図・JSON・Markdown関連回帰を併せて確認した。OSファイル選択ダイアログ・物理端末・本人操作は対象外。
- 正本の参照Validator・状態説明を先に公開したsource commit `002f67d61beab54bea8fc3ac54d30a8d935ab34c` から既存exporterで同梱28ファイルを再生成し、厳密なsource bytes比較を維持する。source内のcore固定リンクは同じbytesの `bfc851cc02c3237f09bb78045687a27e7406a977` を指す。

## 並行Viewerと残作業

#301では状態キャプションの位置・表示が継続して変更されている。本人のGUI判断と採用版の確定後に、取り込む表示と検証を選び、Cとの整合を再検証する。この段階の0.5互換性確認は、#301の最終表示との一致やPhase Cの最終受入を示さない。最終候補では同一headの全CIと本人による固定Preview操作が必要。

確認時の#301 head `ed224bf373fab87a545578ec7d4eed572de7c8f4` は、表示変更に加えState schema 0.2へ任意 `conditionLabel` を追加し、購買0.4 fixtureのT15〜T18に指定する候補を含む。Cの現行Validatorでその固定fixtureを検査すると `Unknown field $.documents[1].transitions[13].conditionLabel` と拒否する。#301の表示・Schemaは本人GUI判断とCIが未確定であり、Cへ取り込んでいない。採用後は旧0.4/0.5の契約境界・表示と同梱runtimeの整合をChatで確認し、無断で0.5 Schemaを変更しない。
