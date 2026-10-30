# PR #303 Role診断候補の再確認

固定契約 `alder/work/dogfood-guards/issue-302/review-303-contract.json` のSHA-256は `e8b8931c0797228ddc66e4ae97b8e6a82b3bb6808e77fa8796c8f7b23290b627`。対象baselineは指定のPR head `b850df15875f53e994504d590226c07a6a0b1005`。この作業環境のGitHubコメントURLはweb取得が無効で直接本文を照合できず、固定契約に基づく確認である。既存文脈を再利用した別Agentの再確認で、新規Fresh/盲検評価や実効モデル設定の検証ではない。

候補coreはRole未確定Activityの現在の `id` と生の `who` から期待診断をSetに構成し、`Role未確定:` で始まる各入力診断の重複と一対一対応を検査する。差分はこの対応検査だけ。Schema、人間状態、承認、業務意味、他種diagnosticsには変更がない。`validate` は入力オブジェクトを書き換えない。

0.3/0.4それぞれcanonical CLI `validate` で、現在原文のみは成功(0)。古い原文のみ、正しい原文と古い原文の両順序、正しい原文の重複、未知Activity ID、Object ID、Role確定後の残存はすべて失敗(2)。解決済みRoleから診断を除いた正例は成功(0)。無関係diagnosticは保持。`author-cli create` は正例で成功、混在不正例で失敗して新規出力を作らない。`inspect`で得た期待revision/hashを渡した不正例`commit`は両版で失敗し、保存済みバイトが完全一致する。既存の対象テストは最終候補で10/10成功し、複数Activityそれぞれの正しい診断の共存も0.3/0.4の正例として通る。

独立実行の各ケース、CLI終了コードとエラーは `results.json`、実行コードは `verify.mjs`、対象テスト出力は `test-roles-final.tap`。この範囲では固定G4に対して妥当。旧Plugin runtimeはbaselineのまま残されているため、この結果は未コミット候補のcanonical tools側に限定される。

## 外部BD目録fixtureの追補

全保存器テストの初回実行で78成功/1失敗となった原因は、`test-storage.mjs` がin-package BDを `externalDocuments` のID・名前目録へ置き換えながら、元BDの未確定Role診断をpackageに残したこと。G4の「診断は現在のin-package BD Activityへ一対一対応」条件に対し、目録には `who`/`roleId` がなく、その診断は孤立する。候補テストはこの孤立を明示的に拒否し、Role診断だけを除いた目録は引き続き受け入れ、無関係診断と入力不変を検査する。元の外部revisionを変えた場合のStale Check拒否も残る。converterが外部目録からRole診断を新たに生成しないことを `convert.mjs` の実装で確認した。

これは期待の弱化ではなく、従来の正例fixtureをG4に整合させる修正。該当2テストを個別実行し2/2成功 (`test-external-final.tap`)。全79件の最終実行結果は親Agentの実行待ちで、この追補は全件成功を主張しない。
