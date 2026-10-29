# D2.2 Phase Aの修正と検証

対象は正式JSON契約・Validator・互換入力・保存境界。base mainは `1f05aeeb5e5c3acbd8722420a3ab9aacd7e29dd0`、採用D2.2は `3d4c810938cdf2d61c307d0073e28adfc84fa605`。[前回2件](https://github.com/mk3008/alder/pull/309#issuecomment-6496584155)を修正した `c1aabf96012d9fdabf9aa6cf86d5370e9e19ae59` に、[Chat再レビューの0.5同士のrebase指摘](https://github.com/mk3008/alder/pull/309#issuecomment-6497903158)だけを追加修正した。package 0.5/BD schema 0.4はPlugin製品版とは別であり未リリース。

## 0.5通常改訂の追加修正

既存正本v2のD2A-08（参照版・確認状態保持）とD2A-10（保存非破壊）を適用する。保証や採用fixtureは変更していない。

修正前head `c1aabf96` の実Node/CLIで、Check単独、State単独、両方の3ケースを実行した。入力は固定mixed BDに既存の合成Check/Stateを付け、旧Checkを確認済みの保存済みsnapshotとしてseedしたもの。fixtureの初期状態は実運用の承認ではない。

各候補ではBDのwhyへ「改訂後の案内も行う。」を追記し、BD revisionを `design-D2-D2.1-shared-data-D2.2-no-cross-order` から同値＋`-next`へ変更。package/従属文書revisionと各basedOn.revisionも更新し、Check本文・状態は不変とした。operationは正しいexpectedRevision/expectedSha256と新BDへの模擬bdConfirmationsだけで、humanDecisionsは渡さない。`author-cli.mjs commit target candidate operation`を実行する。

| 同じ入力と期待（3ケースすべて保存拒否） | 修正前の実測 | 修正後の実測 |
| --- | --- | --- |
| Check単独 | exit 0、元ファイル変更、確認済み保持 | exit 2、source cannot be rebased、元ファイルのバイト不変 |
| State単独 | exit 0、元ファイル変更、basedOn付替え | exit 2、同診断、元ファイルのバイト不変 |
| Check＋State | exit 0、両方を新版へ付替え、確認済み保持 | exit 2、同診断、元ファイルのバイト不変 |

原因は、0.4→0.5専用の保存拒否では通常0.5更新を守れず、CheckのmeaningHashがBD版を含まないことと、Stateに参照版変更の保存ガードがなかったこと。構造的な参照整合性は満たしていても意味の再照合にはならない。

修正はauthoringの0.5通常更新で、既存Check/State文書のbasedOnを元値と比較して変更を拒否する最小ガード。BD合意やCheck本文hashに対するhumanDecisionsを追加しても、再照合フローの代わりにしない。同じBD版のCheck本文訂正→要確認、Test証拠追記→確認済み保持、既存人間レビュー、State編集、新規Check/State追加、BD-only更新は正例で継続成功。拒否時のtarget/candidateバイト不変とlock/temp残留なし、拒否後の同版通常commit/readbackも実CLIで確認する。

Schema/Validatorの構造検査やmeaningHashの定義は変更しない。旧版保存契約、新承認機構、Plugin/Viewerは追加・変更しない。新版Check/Stateの意味再照合フローは未実装のままであり、今回の拒否をその実装完了と扱わない。

## 前回2件の修正前後

修正前headは `9979a35b14a45c95530387e05d6f9fe1df51e57b`。旧Node91/旧Graph52・Viewer回帰は成功していたが、以下の契約不整合を検出できていなかった。旧テストの成功を正式受入と読み替えない。

| 固定条件 | 修正前の実測 | 修正後 |
| --- | --- | --- |
| 旧BD＋確認済みCheck＋部分Stateに従属文書の新版revisionを渡す旧移行要求 | accepted。Check.basedOnはbd-r1→bd-r1-d2、reviewStateは確認済み。BD合意があれば保存guardも成功 | 同じ旧要求をBD-only要件で拒否。BD合意があっても元packageへの0.5 commitを拒否 |
| 新BDだけの明示候補と新出力先 | 旧実装はCheck/Stateのrebaseと持越しを前提としていた | 新BDだけを別package/別ファイルへ作成し、旧BD/Check/State・basedOn・確認状態を元packageへバイト不変で保全 |
| 採用D2.2の5例。Result条件のみid/text案へ連結し、exception欄を足さない | 全5例がMissing activities[0].exceptionで拒否 | 全5例を受理。Activity.exceptionはnullでも拒否 |
| 旧非null例外本文が候補catalogにない | 旧自由文欄を新契約でも必須として持ち越し、catalogと重複 | 欠落・要約・別Activityへの付替えを拒否。同じActivityのcatalog.descriptionへ全文を明示した場合だけ候補生成 |

旧例外catalogのID/Activity/名前/説明も保持する。変換器は例外名を発明せず、本文を推測分割しない。全文一致は欠落防止であり、粒度・名称の意味承認ではない。意味分割が必要なら原本を保全してレビューへ戻す。

## 固定基準

実装修正前に検証正本をv2へ訂正した。v1のD2A-09が認めた元packageへの保存時migrationは誤りだった。既存12 IDを維持し、D2A-09を別BD package/旧Check・State保全へ変更、D2A-13（例外正本と本文保全）を追加。他11項目は不変で、supersedesに旧commit/version/変更IDを残した。旧保証を維持したリファクタリングではない。

- 正本：`tools/document_storage/d2-contract.check-items.json` v2、SHA-256 `c3652dbe667e43ea5e573867d297e49959ee60ed4739ed8bf9eb72543d8d43fb`。
- fixture：採用D2.2の全5 candidateを加工せず保存した `examples/d2-cases.json`、SHA-256 `2dc69d02541be6e092c3cfa36cffd1b0392684dc92aaa7b0b016ed1972ca687c`。テストでのpackage化はResult条件の連結だけを行い、旧exception欄を補わない。
- 旧v1の正本hash `5f8d16908a16602ee97a24da5e0d73430bff223eaf33cbb591be3631c788d86f` と4加工fixture hash `1921486f98e6bf4943764b82e0ac0db0b73725dffd87282f0f673d137cc47f55` は旧headに保持。新基準と混同しない。

## 検証

```sh
node --test tools/document_storage/test-structured.mjs tools/document_storage/test-native-json.mjs tools/document_storage/test-storage.mjs tools/document_storage/test-states.mjs tools/document_storage/test-roles.mjs tools/document_storage/test-authoring.mjs
python3 -m unittest discover -s tools/business_graph -p 'test_*.py'
node tools/document_storage/cli.mjs validate tools/document_storage/examples/purchase.json
```

D2A-01〜13は版/主体/Step/局所順序/Result/共通Data/ID所有者/Check・State参照/分離移行/実CLI保存/互換/実行境界/例外保全を検査する。新13＋旧79、旧Graph52を対象とする。新規のCheck/State参照正例は未承認の新規fixtureとして作り、旧確認済み文書の移行成功とは扱わない。

旧Schema4変種/6定義・旧5 testファイル、訂正後正本/fixtureの不変と実TAPの全ID/skip/failを別工程で照合する。ID/適用ケース削除・結果脱落の負例も確認する。同一Agentの別工程であり、独立Agent検証とは呼ばない。実CI runと最終head/結果はPR・Executionに記録する。

## CIと未実施範囲

旧headの[Plugin Gate B 40869086074](https://github.com/mk3008/alder/actions/runs/40869086074)は、未変更provenance `11848cae45a171a1a49ac6e0542b2bd7cac89b16` をcheckoutで解決できず、fatal: Needed a single revisionで停止した。commitはGitHub APIで取得可能で#303検証headの祖先だが、mainの祖先ではない。

Phase Bではsource/provenanceの履歴到達性と同梱元の整合を確認し、必要な取得経路または公開・保持方法を修復して厳密なsource bytes検査を再実証する。今回はPlugin/同梱元/履歴/CI検査を変更・緩和しない。Required CIであればmerge前の成功確認が必要で、全CI成功とはしない。

Plugin/同梱runtime/Skill/manifest、通常Viewer、他PR、凍結原本、main/配備/Release/個人環境は不変更。新版Check/Stateの意味再照合、例外本文の意味分割・要約、実Agent/配布、0.5通常Viewer/本人操作、個人ChatGPT smokeは未実施。Result専用conditionは保留、Activity横断順序は不採用を維持する。
