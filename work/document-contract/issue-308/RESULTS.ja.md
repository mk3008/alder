# D2.2 Phase Aの検証

対象は正式JSON契約・Validator・互換入力・保存境界だけ。baseはmain `1f05aeeb5e5c3acbd8722420a3ab9aacd7e29dd0`、採用設計はD2.2 `3d4c810938cdf2d61c307d0073e28adfc84fa605`。公開tag `plugin-v0.4.9`のSchemaはmainと同一だが、coreは先行PR #303のRole診断修正前であり、mainの厳密な検証を基準にした。構造版0.5/BD0.4はPlugin製品版ではない。

## 固定基準と変更前後

検証正本は `tools/document_storage/d2-contract.check-items.json` version 1、D2A-01〜12。SHA-256は `5f8d16908a16602ee97a24da5e0d73430bff223eaf33cbb591be3631c788d86f`。実装前に要求から作成し、実装へ合わせて変更していない。4ケースの入力fixture hashは `1921486f98e6bf4943764b82e0ac0db0b73725dffd87282f0f673d137cc47f55`。

- 修正前：既存Node回帰79/79成功。同じ `D2A-01 versions` は新0.5の正常fixtureを `No schema variant ... Invalid enum at $.formatVersion` で拒否して失敗。正式経路が未対応であることを固定した。
- 修正後：新12項目と既存79項目の計91/91成功。D2A-01の同じ正常入力を無変更で受理し、旧版と新形式の混在・未知版・研究wrapperは拒否。
- 途中で旧0.3移行の回帰が、早く検出するようになった版ガードの診断文差で1件失敗した。テストは変更せず、既存の `contract changed` 診断と新たな明示migration要件を両立する文言に修正し、79/79へ回復した。
- Business Graphの旧MD回帰52/52成功。最初のローカルsnapshotには既存test/fixtureが不足していたため、固定mainから同じbytesを補完して実行した。原典・Graph exporter・既存テスト自体はPRの変更対象にしていない。

## 要求と証拠

| 保証ID | Node test名 | 確認内容 |
| --- | --- | --- |
| D2A-01 | versions | 4ケースの非変異受理、版/旧フィールド/研究形式拒否 |
| D2A-02 | performers | Object/Role参照、複数Role、担当未決とopen Finding |
| D2A-03 | steps | 1..N、義務/適用条件、担当subset、単一主体の継承と複数主体未決 |
| D2A-04 | orders | 同一Procedure所有、標準順/循環/自己/重複/入替矛盾、横断構造拒否 |
| D2A-05 | results | 1..Nのid/text、自然文条件保持、専用condition/旧result拒否 |
| D2A-06 | data | 名前一意、項目1..N、参照/所有者/方向、関係側上書き拒否 |
| D2A-07 | identity | nested ID登録、改名参照保持、構造上validなStep/Result/Information親移動の保存拒否 |
| D2A-08 | references | Check/Stateの参照版・例外・unverified・確認状態維持、stale/無断変更拒否 |
| D2A-09 | migration | 要求版/候補BD、旧入力非変異、明示migration/BD合意必須、未決の非捏造 |
| D2A-10 | storage | 実Node CLIの作成/更新/読戻し/明示移行、hash競合/lock/不正候補の非書込み |
| D2A-11 | compatibility | 旧0.4の既存Graph/原文維持、0.5の旧Graph出力を明示拒否、旧版/MDは既存回帰で照合 |
| D2A-12 | scope | native 0.5作成時に旧adapter/MD/Pythonを遮断して成功。変更パスの境界はPR差分でも照合 |

正本hash、全ID/適用ケースと結果の対応、旧Schema定義・旧テストの不変は実装修正後の別工程で照合する。保証ID削除・適用ケース削除・結果脱落の負例で、不変/網羅性照合が検出することも確認する。同一Agentの別工程検証であり、独立Agentレビューとは呼ばない。

## 再現コマンド

```sh
node --test tools/document_storage/test-structured.mjs tools/document_storage/test-native-json.mjs tools/document_storage/test-storage.mjs tools/document_storage/test-states.mjs tools/document_storage/test-roles.mjs tools/document_storage/test-authoring.mjs
python3 -m unittest discover -s tools/business_graph -p 'test_*.py'
node tools/document_storage/cli.mjs validate tools/document_storage/examples/purchase.json
```

新12項目のpositive/negativeと既存回帰を、既存Gate A CIへ追加した。既存Plugin/Viewerの検証を削除・緩和しない。実際のCI runと最終head・結果はPR/Executionの返却記録で示す。

## 未決・未実証と次工程

Result専用conditionの便益は未実証。Phase Aの最小契約候補はid/textで条件を保持し、専用欄の採否を保留とする。将来必要なら版付き拡張とする案との比較は[契約説明](../../../docs/business-design-json-0.5.ja.md)へ記載した。必須化も永久的な不採用判断も行っていない。

0.4→0.5候補生成は、構造化済みBDと各版を明示する操作であり、文章の自動分割や実担当の推定をしない。移行候補の意味同一性は機械では証明せず、入力と原典のレビューへ残す。Checkの合意証拠は合成fixtureであり、実運用の人間承認ではない。

Plugin/同梱runtime/Skill/manifest、通常Viewer、#301/#305、凍結原本、main/配備/Release/個人環境は未変更。#301最新headは調査時 `3753461c86bece381389a4bca9c9affb6cecbefb`、#305は `26b90ab33ff7efc26e8d72c6f1368db7449e33cd`。#305は概念モデル保存契約の文書候補3ファイルだけで、本件のSchema実装を含めない。既存Check/Stateの構造も拡張していない。

Phase Bの実Agent実行/Plugin配布、Phase Cの通常Viewer対応/本人操作レビュー、Phase Dのmerge/Release/配備/同ID・PRIVATE個人Plugin更新/個人ChatGPT smokeは未実施。このPRはDraftとしてChatへ返し、製品化完了としない。
