# JSONの構造と例外参照

新規のJSON草案は候補 `formatVersion: "0.4"` を使う。Business Designは `schemaVersion: "0.3"`、状態文書は `schemaVersion: "0.2"`、Check Itemは従来の `0.1`。正式JSON v1の採用・Plugin releaseは別判断である。

## 概念モデルを同じJSONに含める候補

候補0.4は、同じ `documents` 内に `kind: "conceptModel"`、`schemaVersion: "0.1"` を持てる。業務設計のID・revision、必要な状態文書、サブシステム、概念、関連、レビュー範囲とデータ例を明示する。Viewerはこの情報を表示し、別ファイルや購買専用の切替を使わない。業務意味や人間の合意は構造検証から推定しない。従来の概念なし0.4はそのまま読める。

レビュー範囲の `graph.subsystemViews` と全体相関の `presentation.subsystemViews` は任意で、サブシステムごとに見せる情報と領域間の受け渡しを明示する。表示ノードは既存の `conceptId` と `subsystemId` を参照し、各項目はその概念に属する `informationId` を参照する。同じ概念を複数領域に表示しても、物理テーブルの分割や複製を意味しない。領域内の関連は表示ノードを参照し、領域間の受け渡しは既存の `handoffIds` で指定する。未指定の場合、Viewerは概念のレビュー位置や名前から責務・境界を推測しない。責務・受け渡しの業務上の妥当性は引き続き人間が確認する。

領域間では、出元・受取先のサブシステムと、受け渡す情報の業務上の意味を定める。矢印は領域につなぎ、どの概念や項目が受け取りを担うかは概念図に要求しない。表示項目の `informationId` は図中の項目を元の概念情報と対応させるための参照であり、受け渡しの送信列・受信列の対応ではない。実装に必要な対象の識別、受渡しの粒度や反映の契機などは、後続の設計で具体化する。

この追加を知らない旧0.4検証器は、概念文書を含む新しいJSONを受理できない。並行作業中の0.5への統合と配布前のSchema・保存器・Plugin・Viewerの整合は別途必要である。概念文書を更新するときも既存の要素IDと所属を保持し、未申告の削除・置換・移動は保存器が拒否する。概念の削除を申告する専用操作はまだない。正式版や別文書間の自動更新を意味しない。

## Check Itemとデータ例

データ例をCheck Itemの説明として持つ概念文書は `schemaVersion: "0.2"` とし、各 `samples[]` に `checkIds` を付ける。値は同一JSON内のCheck内部IDで、同じBusiness Designとその版に基づくCheckを一件以上参照する。IDの欠落・重複・参照先の型や原典の不一致は拒否する。同じCheckを複数の例・Activityで参照でき、例が複数Checkを説明してもよい。データ例のセルにある `linkId` は表間の同一対象を表すもので、Checkの参照とは別である。

従来の `checkItems` 内の比較表も、表のセルや共有保証からCheck IDを明示参照するか、Checkから対象の保証／例を明示参照する。単に同じActivity節に置くだけでは対応とみなさない。未接続の比較表を含む旧文書は読み取れるが、そのまま保存せず、ViewerでもCheckの例として表示しない。

機能別の可否判定と処理結果を分けて表示する場合、`conceptModel/0.2` の該当 `capabilities[]` に任意の `testSpecification` を置ける。`decisionExampleIds` は同じBD版のCheck文書にある比較表、`decisionCheckIds` は判定のCheck、`resultCheckIds` は処理結果のCheck、`sampleIds` は同じ機能にある結果説明用データ例を参照する。表が参照するCheckは判定のCheckに含め、結果例は少なくとも一つの結果Checkを参照する。結果は可否判定が可の場合の処理を表し、特定の判定行やCheck IDを実行条件として結び付けない。新たな結果例には、それが説明する結果Checkを記載し、判定行を示すだけの判定専用Checkは追加しない。一つのCheckが判定と結果の両方を記述する場合は、双方から参照してよい。従来の判定専用Check参照を含む結果例も読み取れるが、その参照を実行条件と解釈しない。可否のみの機能に結果例は要求しない。従来の `testSpecification` を持たない文書も読める。この欄を知らない旧検証器は新しい欄を持つJSONを受理できない。

可否判定表の条件値 `‐` は、その行では値を問わないことを表す。Viewerは必要な表に「‐＝値不問。」を共通表示するため、JSONに凡例を重複して記載しない。業務上の前提、表の対象範囲、判断順序、結果や備考は別に保持する。未定義・未決・不適用を `‐` に置き換えない。

参照が妥当でも、例の条件・対象・期待結果がCheckの意味に一致するとは限らない。本人がCheckをレビューできるよう、原典・Check・各例の意味と未決を別途照合し、テストはCheckの条件と期待結果に対応させる。例の内容変更を理由に人間の合意やテスト証拠を推測しない。

旧 `conceptModel/0.1` は互換入力として読めるが、その例をCheckの具体例と推測しない。例がある旧文書を含むパッケージは、別の項目だけの変更でも、全例をCheckへ明示的に対応付けるまで保存しない。既存データの移行は `migration: "check-samples-0.2"` を用いて明示し、ID・データ値・原典・人間状態・Test証拠を保持する。未合意のBDに新規Checkを作ることを、移行によって承認したとは扱わない。

## 例外をIDで参照する

Business Designは `exceptions: [{id, activityId, name, description}]` を持つ。idは名称や説明文を変更しても維持し、activityIdは同じBDのActivityを参照する。同名の例外を異なるActivityに置ける。識別と整合性の根拠はIDであり、Markdownの装飾・改行・箇条書きから例外を認定しない。

状態操作の `exceptionId` は、この例外IDを参照する。別Activityの例外、存在しないID、重複ID、原典revisionの不一致を拒否する。正常経路はnull。例外経路で参照先が未決ならnullとし、`diagnostics` に `例外参照未決: <transition id>` を残す。未記載の遷移や例外は生成しない。

`name` と `description` は表示用情報である。Activityの `exception` 文章も任意の補足として保持できるが、例外IDの存在・参照・状態の検証に使わない。文章中に別の例外名や装飾が現れても構造は変わらない。

JSON専用の検証・編集は `core.mjs`／`authoring.mjs`／`edit.mjs`、ViewerのJSON専用入口は `parseJSONDocument`。これらは旧MDの業務parser／変換器を必要としない。文章のMarkdown表示は許容するが、構造や参照の導出には使わない。

## 旧候補JSONとMDを開く

旧JSON 0.1〜0.3は、版を識別する互換入力adapter `legacy-json.mjs` の `readLegacyPackage` へ渡す。旧候補の名前付き例外を旧契約の表記で解釈し、構造化した例外とID参照へ変換する。名前が存在しない・曖昧な場合は拒否する。名前のない旧例外は未決を保持する。

旧版に対する `core.validate` は構造と既存の型付き参照を検査し、名前による例外参照をadapterで検査する必要をdiagnosticsへ返す。旧版の完全な受入検査には `readLegacyPackage` を使う。CLIのvalidate／inspect／create／commitは、旧版の場合だけこの境界を通す。旧名前参照を未検査のまま保存成功にはしない。

Viewerの共通入力入口は `document-input.ts`。MDの場合だけ `legacy-document.ts` と旧文法parserを使い、業務情報・例外・明示状態を型付きモデルへ渡す。旧MDの名称ID、旧JSONのUUID、原文、revision、Check人間状態と未決は保持する。変換後は同じ `validateReferences` と表示処理を使い、MDを再解析しない。旧MDの参照先不明Findingは、解決済みIDと未決の参照名を分けて保持する。

互換読込はメモリー内の投影であり、元ファイルを書き換えず、保存済みの手動配置も再発行しない。Viewerが元のMD／旧JSONを正式な保存0.4へ自動移行したことにはしない。

## 保存形式を明示移行する

`author-cli.mjs prepare-exception-upgrade old.json candidate.json revisions.json` は、旧ファイルを残して候補0.4を新規ファイルへ作る。要求にはexpectedRevision、新しいpackage revision、変更する各文書のexpected／next revisionを渡す。BDと従属状態／CheckのbasedOnを整合させ、既存ID・原典情報・Checkレビュー状態を維持する。

候補の検査後、既存のcommitに期待hash／版と `migration: "exceptions-0.4"` を渡す。Checkがある場合は新しいBD版に対する既存の人間合意ゲートも必要で、構造移行から人間の確認を推定しない。MD→JSONの明示convertは0.4を出力し、旧MDを保持する。JSON→MD同期は行わない。

Business Graph v1は従来の独立した契約である。0.4の表示名には旧MDの区切り記法を構造制約として適用しない。Graph v1で表現できない表示名を明示exportした場合は拒否し、Graph v1自体の仕様を変更しない。
