# README 0.4.2 ドッグフーディングの結果

2026-10-05 UTC。工具返却受付の合成例を使い、READMEの短い依頼文から草案・レビュー・改訂・Checkの作成と更新・実装まで進めた。公開PluginのCLI配布とインストールは確認できた。実クライアントの自動Skill選択はモデル起動前の環境エラーで確認できていない。後半の生成・レビューは全10 Skillの説明を渡すsource-catalog診断として実施した。

初回実装の20テストはすべて成功したが、独立レビューでTR-04のテストが初期値に依存する弱さを見つけた。コードの誤りは観測していない。補強後は21テストが成功した。Falseへの代入だけをメモリ上で取り除く試験では、元の20テストは成功し、新しいテストだけが失敗した。最後にTR-01〜09と実際のTest/assertionの対応を更新し、ID・条件・期待結果・模擬確認状態と未決事項の保存を確認した。

この一例は、実業務での効果、実際の依頼者の合意、全クライアントでの動作、全10 Skillの検証を示さない。

## 固定した資料

- README: [`00600974872ff6cce41ecb6a0d4786d82b922f5d`](https://github.com/mk3008/alder/blob/00600974872ff6cce41ecb6a0d4786d82b922f5d/README.ja.md)。比較用の本文は [README.accepted.ja.md](evidence/README.accepted.ja.md) に保存した。これは元READMEの写しであり、元の相対リンクはこの保存場所では解決しない。
- Plugin: `plugin-v0.4.2`、commit [`6d30b93abf8ecdc8902fef5c16bfb53fda8617e9`](https://github.com/mk3008/alder/tree/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/plugins/alder)。取得物とインストールcacheの45ファイルのSHA-256が一致した。
- 事前固定した試験条件: [`b7971be8c7059f768a41524169421cd85c1277a1`](https://github.com/mk3008/alder/blob/b7971be8c7059f768a41524169421cd85c1277a1/work/readme-dogfood/042/PROTOCOL.md)。実行統括がGitHubから公開commitと内容を取得して確認した。commit作成日時は2026-10-05 02:11:32 UTC、parentはPluginの6d30b93、treeは8b797e1b18580d3c753ae972f40f7163574dbdefである。
- 模擬回答・システム要件: [PROTOCOL](PROTOCOL.md)、[模擬回答](evidence/simulated-feedback.md)、[版とIDへ適用した模擬レビュー](evidence/simulated-final-review.md)、[システム要件](evidence/system-requirements.md)。後二者の状態・IDへの適用は、生成前に完成していた成果物ではない。

## 何を実行したか

| 工程 | 観測した結果 | 主な証拠 |
| --- | --- | --- |
| 配布元登録 | READMEのコマンド本体を変えず、隔離したCODEX_HOMEで成功 | [導入記録](INSTALL.md)、[stdout](evidence/01-marketplace.log) |
| CLI代替インストール | 0.4.2、installed/enabledがtrue。45ファイル一致、10 Skills。package tests 14件成功 | [list](evidence/02-cli-plugin-list.json)、[hash](evidence/package-hashes.json)、[tests](evidence/05-package-tests.log) |
| GUI操作・自動routing | GUIは未実施。fresh起動はモデル応答前にread-only filesystemエラー | [導入記録](INSTALL.md)、[stderr](evidence/03-auth-probe.err)、[限定再試行](evidence/08-auth-probe-redirected.err) |
| 草案 | `alder-draft-business-design`を選択。貸出受渡し・返却受領を分け、照合元や担当・引渡しを未確認とした | [観測](evidence/04-draft-observation.md)、[初稿](evidence/draft.initial.md) |
| 業務設計レビュー | `alder-review-business-design`を選択。正常終了と不一致、引渡し、役割などを問いとして返した。元文書を変更していない | [レビュー](evidence/06-bd-review.md) |
| 模擬回答の反映 | `alder-draft-business-design`で同一設計を改訂。返却受付だけへ限定し、正常・不一致・再処理を記述。未決は維持 | [改訂記録](evidence/07-bd-revision.md)、[改訂版](evidence/draft.revised.md) |
| Check草案 | `alder-draft-check-items`を選択。TR-01〜09をすべて未レビューで作成 | [草案記録](evidence/09-check-draft.md)、[リスト](evidence/checks.initial.md) |
| Checkレビュー | 同Skillでread-onlyレビュー。余剰・置換の扱いは業務未決とし、TR-08のタイトルを表現上の修正候補とした | [レビュー](evidence/10-check-review.md) |
| 模擬確認の反映 | 同Skillで9項目を確認済み（模擬）へ更新。ID・条件・期待結果を保持し、TR-08タイトルのみ許可された表現へ変更 | [更新記録](evidence/11-check-update.md)、[不変条件](evidence/check-update-invariants.json) |
| 実装・テスト | 通常のプロダクト実装として実行。Alderの実装レビューSkillを実装作業に流用していない。20件成功 | [実装記録](evidence/12-implementation.md)、[stdout](evidence/12-unittest.stdout.log)、[凍結実装](implementation/) |
| 独立実装レビュー | `alder-review-implementation`を選択。20件を再実行し、限定範囲内の明確な不一致は観測せず、TR-04の回帰テスト不足を指摘 | [レビュー](evidence/13-implementation-review.md) |
| TR-04テスト補強 | 人工的な初期値TrueからFalseへの変更を確かめる1件を追加し、21件成功。指定代入を除くmutationでは追加した1件だけが失敗 | [補強記録](evidence/14-regression-strengthening.md) |
| 対応記録更新 | `alder-follow-up-review`で9 Checkの対応を更新。21 unique Test IDsとassertionの意味を確認し、21件成功。業務上の意味・模擬確認状態・未決事項は保存 | [更新記録](evidence/15-follow-up-review.md)、[不変条件](evidence/15-invariants.json)、[最終版](implementation-revised/) |
| 任意のDiscovery / Optimization | prompt-09/10を保存しただけで未実行 | [prompt-09](evidence/prompt-09.txt)、[prompt-10](evidence/prompt-10.txt) |

## 実装とテストの範囲

Python標準ライブラリだけのメモリ上の貸出記録を使った。番号と付属品が一致する返却の受領、最初の返却日時、点検待ち・貸出不可、番号不一致や付属品不足時の非更新と窓口への要確認、再処理時の日時保持を実装した。timezone付き日時をUTCへ正規化することは試験用の技術条件である。

20件という数は実装担当が作成したunittestの件数であり、業務条件20件や20回の独立試行ではない。通常のdiscoveryでも同じ20件を実行した。独立レビューはコード・assertion・対象条件を読み直し、同じsuiteを再実行した。

TR-04の元テストは、受領前から `available_for_loan=False` のfixtureに対して受領後のFalseをassertしていた。コードにはFalseへの代入があるため、この指摘は観測された業務違反ではない。ただし代入を削除してもそのテストが成功する可能性を排除できず、成功件数だけで回帰検出能力が十分とは言えない。TR-07は初回失敗でFalseを保持し、受領済みの再処理でTrueを保持する既存テストがある。それぞれの文脈で両値の保持を検査しており、追加修正が必要な欠陥とは扱わなかった。

付属品の余剰・置換・数量の意味、役割分担、通知と保管、要確認後の調査・再受付、物理的な引渡しは未決のまま。例の入力範囲外は `OutsideExampleScope` で扱い、実際の窓口の拒否方針や新しい業務上の要確認ルートは決めていない。UI、認証、永続化、同時実行、点検作業、修理、課金、本番運用は対象外である。

補強したTR-04の1件は、人工的な `available_for_loan=True` を入れる技術的な回帰検査であり、正当な業務状態や新しい貸出条件を定義しない。21件の逆引き表では、13件を限定的なCheck／補助根拠へ対応づけ、8件を技術的な入力・例の範囲の検査として区別した。対応更新工程ではCheck文書だけを変更し、コード・業務設計・判断記録は変更していない。独立レビューは元20件へのレビューであり、21件の最終版全体を再び独立レビューしたとは記録しない。

公開用の配置から [reproduce-product.sh](reproduce-product.sh) を実行し、正常21件の成功、元20件による指定mutationの見逃し、補強後の新テスト1件による検出を確認した。[再実行ログ](PUBLIC-REPRODUCTION.log)を参照。

## READMEとpackageで見つかった引っかかり

### 1. 最初の入力と出力例に事実の差がある

READMEの「まず使ってみる」の入力は「番号」「付属品」「組」と書き、工具であること、団体が所有すること、照合元が貸出記録であることを明示していない。一方、直後の出力例は「工具の返却受付」「団体の工具」「貸出・返却の記録」を確定した形で使う。実際の初稿は照合元や番号の意味を未確認とし、貸出側も別Activityに残した。

最小の修正候補は、出力例の前提になる事実だけを入力例へ足すか、出力例を未確認事項の残る草案へ合わせること。初回の到達点を「提示した事実を整理し、足りない条件を質問できる草案」と伝えるなら、本文中の「不明な条件を推測で埋めない」とも整合する。今回の模擬回答を最初の入力から与えたことにして、この差を隠してはならない。

根拠: [固定README](evidence/README.accepted.ja.md)、[初回観測の質問と生成物](evidence/04-draft-observation.md)。

### 2. 配布版と同梱説明の版表記が読み分けにくい

インストール済みpackageは0.4.2で一致しているが、authoring Skillの同梱 `references/adoption.md` 冒頭は「Plugin 0.4.1」と記述する。過去の導入時点を説明する履歴記述もあるため、すべての0.4.1を機械的に置換する根拠にはならない。

最小の修正候補は、現在の提供範囲を説明する文と、機能が導入された版を説明する文を区別してpackageの説明を点検すること。インストール失敗や古いpackageの読込みとは判定しない。

根拠: [初回観測](evidence/04-draft-observation.md)、[公開固定source](https://github.com/mk3008/alder/blob/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/plugins/alder/skills/alder-draft-business-design/references/adoption.md)。

### 3. 同梱説明の相対リンク先がそのSkill内にない

同じ `references/adoption.md` は `business-design-structure.ja.md` へ相対リンクするが、authoring Skillのreferencesは `adoption.md`、`business-graph.md`、`provenance.json` の3ファイルだった。必須として読んだadoption節とgraph profileは取得でき、草案作成は続けられた。したがって実行停止ではなく、参照をたどる際の欠落である。

最小の修正候補は、必要な説明を同梱するか、既存の公開文書へ解決できるリンクにすること。packageのリンク解決テストも候補になる。READMEへ内部のpackage構造を大量に説明する必要はない。

根拠: [初回観測](evidence/04-draft-observation.md)、[固定references一覧](https://github.com/mk3008/alder/tree/6d30b93abf8ecdc8902fef5c16bfb53fda8617e9/plugins/alder/skills/alder-draft-business-design/references)。

### 4. 実クライアントでの残確認をsource診断で代替しない

READMEが指示するデスクトップのPlugins Directory、再起動後の表示、有効化、新規チャットでの自動routingは未確認である。CLI代替installとsource-catalog診断の成功を、それらの成功とは書けない。今回のread-only filesystemエラーは実行環境の制約であり、Alderが原因とは確認できていない。

次の確認は書込み可能な通常クライアントで、固定タグの登録からREADMEの同じ依頼文を新規チャットへ送るところまで進めること。現時点では導入コマンドを変更する根拠はない。

## 証拠の読み方と再現性の限界

- [PUBLICATION](PUBLICATION.md) と [manifest](PUBLICATION-MANIFEST.json) に原本SHA-256、公開コピーのSHA-256、変換を記録した。元の出力を修正して実行成功に見せる加工はしていない。
- `prompt-00`〜`prompt-10` は固定READMEからの依頼文であり、workerに渡した制御指示全文とは異なる。残存する観測記録には一部の制御指示があるが、全工程の元handoff全文・agent識別子は揃っていない。不足分を推測で復元し「raw prompt」とは呼ばない。
- authoringと実装はinherited model / xhigh / no-historyの要求値を各観測記録に保存した。独立FreshレビューはrepoのAGENTSに従い `gpt-6-sol` / `medium` / no-historyを要求した。テスト補強・対応更新の要求設定はinheritedで、model/effortの明示overrideなし。実効runtimeの独立証明はない。各記録に書かれていない設定を補完して断定しない。
- 初期草案から模擬確認版までのスナップショットを別々に保持した。模擬合意は実際のユーザーの業務承認ではなく、Checkの確認状態とテスト実行状態も別である。
- 公開固定sourceと安全な合成入力を使うため、配布確認と決定的な実装テストは再実行できる。agent工程は元handoffと実効設定の記録が不完全であり、完全な実行再現を主張しない。公開コピーだけで照合できる観測と、その限界を区別する。

これらは修正候補と一回の観測であり、README/packageの変更採用、実業務の改善効果、最終受入れの判断は含まない。
