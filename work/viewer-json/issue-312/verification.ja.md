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

## 先行する並行Viewerの確認

#301では状態キャプションの位置・表示が継続して変更されている。本人のGUI判断と採用版の確定後に、取り込む表示と検証を選び、Cとの整合を再検証する。この段階の0.5互換性確認は、#301の最終表示との一致やPhase Cの最終受入を示さない。最終候補では同一headの全CIと本人による固定Preview操作が必要。

確認時の#301 head `ed224bf373fab87a545578ec7d4eed572de7c8f4` は、表示変更に加えState schema 0.2へ任意 `conditionLabel` を追加し、購買0.4 fixtureのT15〜T18に指定する候補を含む。Cの現行Validatorでその固定fixtureを検査すると `Unknown field $.documents[1].transitions[13].conditionLabel` と拒否する。#301の表示・Schemaは本人GUI判断とCIが未確定であり、Cへ取り込んでいない。採用後は旧0.4/0.5の契約境界・表示と同梱runtimeの整合をChatで確認し、無断で0.5 Schemaを変更しない。

## conditionLabelと採用済み状態図の統合

[Chat判断](https://github.com/mk3008/alder/pull/313#issuecomment-6519259849)により、State payload 0.2の任意・非空 `conditionLabel` を0.4/0.5共通で受理する。packageとpayloadの版は据え置き、`condition` は業務条件の正本である。表示名の欠落または兄弟内の表示条件の衝突では元の条件を使う。単独の通常はActivity名、例外はActivity名と例外名、分岐は表示条件を使い、操作詳細には元の条件と到着先を残す。後方互換な入力追加は、旧Validatorが新フィールドを読めることを意味しない。

#317 `4b3b6a0d98ec114649a8a387696fd08edc7452e3` は本人確認を経てmainへマージ済み。CはそのPRを丸ごと取り込まず、状態キャプション位置・選択時の描画順とフォーカス、購買0.4のラベル付きfixtureを取り込む。T08/T19は同じ自己戻り先を持つ別IDで、#317固定版ではSVG pathの座標が重なっていた。Cでは同じ出発・到着の行にそれぞれ接続点を与え、同条件でも異なる条件でも統合しない。T02/T12/T14と例外のキャプション配置、およびtabStripの既存待機回帰は保持する。

- 新検証正本 `web-viewer/verification/state-condition-label.check-items.json` は実装前commit `0b1bae76ebe426de12d93fc65f8199f1a5928f69`、SHA-256 `14316d199b56bf6dfbb3bc7046d1a7c22dca753017b6b55ebc0ac850d7decf12`、STATE-LABEL-001〜006。#317の固定 `STATE-CAPTION-001〜003` は同commitで取得し、SHA-256 `7ffbb694bf26b9c7934e3963d24612e0af5225f97e611b186df7e3fea3c09694`。旧COMPAT・STATE-IDENTITY・JSON05-VIEWERの正本は不変。STATE-IDENTITYの旧「図上に条件と到着先を併記」という範囲は上記Chat判断で置き換えられ、原文条件と到着先は操作詳細で照合する。
- `cd web-viewer && node --experimental-strip-types web/test-state-condition-label.mjs`：購買0.4とB合成0.5の省略・明示・空・非文字列・未知field、ラベルの衝突、0.4一意性と0.5同条件の差、canonical/同梱通常CLIの保存・読戻し・異常保存時bytesを検証する。`test-state-caption-placement.mjs` は購買T02/T12/T14の位置・線と詳細、T08/T19の別線、選択・破線順・フォーカスと全保証IDをDOMで照合する。旧互換・無確認rebaseは既存の `test-json-05-state-compat.mjs` でも検査する。
- `state-label-05.json` はB合成seedから再現した確認用fixtureで、同条件・同到着先のS1/S2と到着先未決のS3、明示ラベルとCheckの合成確認状態を含む。業務上の同時成立・人間承認を表さない。
- 同一作業者の別工程でB受入 `5a1a4f47` の `core/schema/structured.mjs` を取得し、同じ合成0.5 seedはラベルなしで受理、ラベル付きで未知field拒否を確認した。新canonical source `bbef80433b885203f2c769dab2e75bdffd8738d2` は公開後に既存exporterで同梱28ファイルを再生成し、byte単位の照合を維持する。
- CIの `jsonStates` は購買0.4のPC/狭幅・両テーマ、各キャプション、元条件、T12/T14の選択、破線描画順、読込失敗時の保持・復元を確認する。`json05` は従来の0.5同条件3遷移のFile/URL/復元に加え、ラベル明示・衝突時の表示を確認する。`tabStrip` は遅延したURL読込時の待機と既存操作を維持する。
- ローカルChromeは実行環境でUnixソケット作成が `Operation not permitted` となり起動できなかった。実ブラウザーの成否は最終headのGitHub CIを別途確認する。393pxはviewportであり、物理モバイルやOSのファイル選択、本人による最終GUI操作ではない。
