# Gate A：型付き単一JSONの保存契約と一方向変換

保存契約・Schema・共通検証器・MD→JSON CLI/APIを独立実装した。候補`alder-document-package / formatVersion: 0.1`であり、正式v1採用・Plugin配布・Viewer組込ではない。既存の製品ファイル・正式BD/Check・研究PR #269/#271は変更していない。

## 今回成立した範囲

| 受入事項 | 実装・証拠 |
| --- | --- |
| 単一ファイルと版 | package formatVersion/revision、文書id/kind/schemaVersion/revision、原典digest。Schemaと実装の一致試験 |
| 一方向変換 | Node API/CLI＋Pythonの厳格なMarkdown adapter。元MDを保持し、旧MD全文・旧版BD本文をJSONへ同梱しない。既存出力・symlink/hardlinkは上書きしない |
| BD/Check | BD 5W1H・IO・例外・Procedure/Result・Findings、Checkの既存ID/状態/根拠/Test証拠、一般保証・比較表・共有・未割当を保持 |
| ID | 初回UUIDv5。JSON改名、再順序、serialize/reloadで維持。MD再変換は前JSONと期待版、必要な改名対応を明示し、位置・類似名で推測しない |
| 不整合 | 未知format/payload版/kind/欄、重複ID/キー、未解決参照、版ずれ、曖昧な再対応を拒否。失敗時に元package/MDを変更しない |
| 後続向けAPI | ブラウザーでも使えるcore/schema、Node変換API、原子的なapplyEdits、Graph v1投影。後続Plugin/Viewerの依存・受入条件を契約文書へ記載 |
| 将来の文書 | kind/schemaVersionとID参照の境界を用意。状態遷移/概念モデルは現在未対応として拒否し、意味や具体Schemaを定めない |

[使用開始](../../../tools/document_storage/README.md)、[保存契約・API](../../../docs/document-storage.ja.md)、[変換見本](../../../tools/document_storage/examples/purchase.json)。

## 確認した原典と既存機能

baseはmain `f3a045d9f55bb27b1289145fcdc5f6bd2df594a1`。root/Alder最新AGENTS、実行IssueのGoal/Done、PR #269（`a2e841d049fa45a795e99b16ff4a053805474180`）とPR #271（`9dd6fb1ca7c598a0cc3f3d352967481d04521093`）のコード・報告を確認した。Phase 2の固定専用importerをそのまま製品変換器とせず、固定原典への依存と全文格納を除いた。実装hashと確認対象は[authority.json](results/authority.json)。

正式BD構造、Check仕様、Plugin 0.4.8のauthoring/Check/Graph Skill、ViewerのBD/Check/URL reader、Graph v1の公式Python exporter、版管理・結果返却方針を確認した。

購買の変換例には、正式profileに適合する既存BDと0.4.8のCheck見本を使用。Checkが主張する`c2852531…`のBD本文をGitHubから取得し、main上の入力と同じバイト列であることを確認した。これは本Taskでの出所照合であり、変換器が外部URIを自動取得したり業務意味を承認したりする機能ではない。Checkの意味対応は`unverified`、5件未レビュー・1件要確認、Test証拠未収集のままである。

研究中のPR #254購買草案はMedium/SR Dependenciesを含み現行正式profile外なので、これを削って成功させる候補は採用していない。新変換器では未知欄を診断して停止する。状態遷移・概念モデル研究には変更していない。

## 検証

```sh
node --test tools/document_storage/test-storage.mjs
python3 -m unittest discover -s tools/business_graph -p 'test_*.py'
node tools/document_storage/cli.mjs validate tools/document_storage/examples/purchase.json
```

[Gate Aの46試験](results/tests.txt)と[既存Graph 52試験](results/graph-regression.txt)が成功。Node v24.19.0 / Python 3.12 / Linuxで実行した。

- 現行共通保証/比較表形式と旧anchor/details形式、購買以外の会議室BD、Procedure/Problem/Findingsを検査。
- Activity/Objectの明示改名、MD並び替え、再変換、JSON再読込、ID集合と関係端点の維持を検査。共通保証と例の所有関係、共有Check一本文、未割当Check、状態/根拠/Test証拠を検査。
- 不正JSON、重複キー/ID、未知kind/版/欄、誤った型/所属/参照、原典URI・版の不一致、曖昧な改名を拒否。
- 同一内容のGraph v1を未変更の公式exporterと比較。APIによる複数文書の原子的更新、古い期待版拒否、ID置換・重複編集拒否、元package不変を検査。
- CLIの新規出力、既存出力・入力・symlink・hardlink保護、不正入力時の出力不存在と一時ファイル清掃を検査。

これは同一作者による実装・機械試験・自己点検であり、独立Freshレビューではない。既存Viewerを変更していないため、実ViewerのJSON読込やブラウザー表示を本Gateの成果として主張しない。CIの有無・状態はExecution Issueに実際の結果を記録し、ローカル成功をCI成功へ読み替えない。

## 未解決・後続へ渡す条件

1. PluginのJSON直接草案/編集Skill、bundleと実行runtime、provenance、日本語ガイド、業務レビュー→JSON修正→Check更新の縦断検証はGate B。現在のPluginが新形式を扱えるとは言わない。
2. 本物のViewerのJSON読込・全体図・詳細・Findings・関連Check・MD互換・File/HTTPS URL・大容量・保存復元・最後の描画保持はGate C。過去PoCの5要素描画やCIを流用した成功主張はしない。
3. 変換対象は明示したMarkdown profile。英語Check欄・任意Markdown方言・複雑なHTML等は未対応。一般的な意味照合や全旧資料の移行成功は未実証。
4. 再変換で共通保証タイトル等の対応が曖昧な場合は停止する。JSON正本の編集を標準経路とし、任意MDの変更へ推測で追従する同期エンジンは作らない。
5. ロールID一元化は今回は見送り、Who文字列を保持。役割の同一性や同義語を推測して統合しない。
6. 状態遷移の未合意の意味・概念モデルSchema/表示、正式構造版の採用と長期migration規則は未決。未知版/kindを無視しない境界を先に固定した。

本Gateから後続へ渡すAPIは`convertMarkdown / validate / parseStrict / stringify / applyEdits / graphV1`。APIの成功は人間の合意を代行しない。merge・release・デプロイ・既存MD廃止は行っていない。
