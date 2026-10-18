# Check Consistency 読取記録

これは別 reader による読取結果であり、人間確認、実装・Test 検証、遠隔原典の照合を意味しない。候補と業務設計は編集していない。

## 受領した依頼

初回依頼全文：

> Read-only Alder Check Consistency review for /workspace/scratch/0261bb5be107/final-fix-delivery. Read only bundled current skill guidance plugins/alder/skills/alder-draft-check-items/SKILL.md and references/check-item-traceability.md, new BD work/check-item-examples/fixtures/README.md, prior Check inputs work/check-item-examples/meaning-validation-20261018/initial/final.md and update/final.md, saved candidates work/check-item-examples/final-corrections-20261019/initial-candidate-01.md and update-candidate-01.md. Do not read other work artifacts, tests/code, completed specimens, reviews, web. No file edits. Two source-led passes: declared Activity names and shared references; BD general guarantees versus each ID and distinct examples. Check source anchor/label migration to e8d808902641d4571bbc5656b4b23d9e959f7636, states, IDs and retained mappings. Return concrete evidenced defects or no defects, limits. Focus request narrowly: initial CI-02 table has no 本人14日非停止 row, so author marked counterfactual distinction; update only source version. Avoid proposing scope expansion.

再読取依頼全文：

> Affected re-review only. Parent authorized minimal CI-06 premise repair in new saved /workspace/scratch/0261bb5be107/final-fix-delivery/work/check-item-examples/final-corrections-20261019/initial-candidate-02.md (SHA-256 6f23acee887e35724fb589e17b76f4372efc08906137dea9887ffafdebcfe6f4). Compare with candidate-01, new BD fixtures/README.md, original initial/final.md, guidance already read. Read-only, no files edited, no other artifacts/web/tests. Check changed CI-06 condition no longer assumes correct recipient, retains source How/Result guarantee and wrong-recipient example; recheck CI-02, affected shared links/name and whole requested initial scope for regressions. Return concrete evidence and unperformed checks.

いずれもモデル名・推論設定の明示指定はない。実行時に使われたモデル、推論 effort、その他の実効設定を reader 自身で検証・証明する手段はなく、attestation はしない。

## 読んだ入力

パスはこの repository のルートからの相対パス。以下の SHA-256 は本記録直前にローカルファイルを計算した値である。初回は候補01と過去の初回・更新、業務設計、skill guidance を読み、再読取では候補02と01の差分、同じ業務設計・過去初回・既読 guidance に照らした。結合出力の一部が表示上切れたため、業務設計と各候補は別途読み直し、guidance は該当節を再読した。

| 入力 | SHA-256 |
| --- | --- |
| `plugins/alder/skills/alder-draft-check-items/SKILL.md` | `c8db0ae221668855cec1ef2e113511708d6ca1fbc15cb59c7ea7817679de0775` |
| `plugins/alder/skills/alder-draft-check-items/references/check-item-traceability.md` | `dac05f461a36b11c73edc595873aeb51bae66b038ef0cc003f24db63e293fcb6` |
| `work/check-item-examples/fixtures/README.md` | `cfb4a60b2f1f2dade893237cbdc38b9cda1bc4c8d89e9491d77affe13dd39c91` |
| `work/check-item-examples/meaning-validation-20261018/initial/final.md` | `5f0ed04d946d9df17aa7fad2fbdf22dc7d87b43d5d9892bc3a131cff9ff1f68d` |
| `work/check-item-examples/meaning-validation-20261018/update/final.md` | `9796b282318df8191d0804187bd9965105bf0d4662228b7e1e08644ecbfebce9` |
| `work/check-item-examples/final-corrections-20261019/initial-candidate-01.md` | `817babf252168c927b1153bef6aa8362a77340788c770088f8bf4fe93fe28fd8` |
| `work/check-item-examples/final-corrections-20261019/initial-candidate-02.md` | `6f23acee887e35724fb589e17b76f4372efc08906137dea9887ffafdebcfe6f4` |
| `work/check-item-examples/final-corrections-20261019/update-candidate-01.md` | `14217b081248021af68b4d7f6a00d40bfab002ed0ae7bf6341926c6ad3daa403` |

## 初回の独立所見

**NG（candidate-01 の CI-06）：** 「説明の条件と結果」の条件は「相談の受付後に**その依頼者へ**次の案内をするとき」だった。原典の「次の連絡方法を説明する」How/Result は、担当者が**その相談の依頼者**へ担当窓口と次の連絡方法を説明する保証である。候補自身の CI-06 例も代理人Bへの説明と、別相談の依頼者Fへの取り違えを区別する。条件に正しい相手への案内を置くと後者を条件外にしてしまい、guidance の「行為・前提・観測結果を分け、成功を前提にしない」に反する。これは表示上の条件定義の欠陥であり、原典に未決の新業務規則を提案したものではない。

**CI-02 の採否：** 停止中・本人・14日の行は表で不成立。非停止・本人・14日の行は表にない。candidate-01 はそれを「表にない対照」「一般則から導いた比較」と明記し、原典の登録済み・本人または委任済み代理人・非停止・0～30日という条件に照らしている。架空の行を表にあると主張する欠陥は認めなかった。

**更新候補：** 過去 update/final.md との差分は冒頭の原典 URL と固定版 SHA の変更のみだった。C-01～C-04 の本文・ID、人間レビュー状態（順に確認済み、要確認、未レビュー、要修正）、C-01 の既存 Test 参照、C-04 のフィードバックと限定された相手の保証が保持されていた。C-03 は相手と内容の両方を含む保証、C-04 は相手の対応関係の限定保証であり、表は相手違いの場合に内容が揃っていても C-03 全体を満たさないと明記していた。原典の未決の条件不成立後の応答・記録・再申請、希望日変更を確定していない。

## candidate-02 の再読取結果

candidate-01 との差分は CI-06 の共有定義の一文だけで、「相談の受付後に**その相談について**次の案内をするとき」に修正されていた。行為の対象となる相談を前提に据え、正しい説明相手は直後の期待結果に残した。代理人Bと別相談の依頼者Fの取り違え、および窓口だけ伝える内容不足という短い例も保持している。**初回 NG は解消**と判断する。

再読取では原典の宣言 `# Activity 相談を受付する` と `# Activity 次の連絡方法を説明する` を候補の index/H2/関連参照に照らした。CI-01～CI-05 と CI-07/08 は前者、CI-06 は後者の主項目で、後続への接続を CI-05/06 が関連参照する。原典の受付条件（登録、資格の包含的 OR、非停止、両端を含む0～30日）、相談そのものの受付済み状態と対応対象、説明の相手・内容を各 ID の共有定義と別の具体例に追った。CI-07/08 の未決表示、CI-02 の表にない対照の説明、ID と人間状態、原典セクションへのリンクに回帰は見つからなかった。新しい source revision は候補内の原典 URL/ラベルに反映され、ローカル原典の見出しに対応する `#業務上の規則`、`#activity-相談を受付する`、`#activity-次の連絡方法を説明する` を使っている。candidate-02 に残る別の source-supported NG は認めなかった。

## 未決・任意・未実施

- **業務上の未決：** 条件不成立後の応答、記録、再申請と希望日変更は原典通り未決。CI-07/08 は要確認のまま。reader は決定も人間承認もしていない。
- **任意提案：** この狭い修正範囲について追加の項目・例・業務規則を提案しない。
- **未実施：** 遠隔の `e8d808902641d4571bbc5656b4b23d9e959f7636` の内容一致・URL 到達性、GitHub 上の実レンダリング、人間の読みやすさ確認、Test/実装の確認、literal-name diagnostic script の実行は行っていない。原典リンクの評価は手元の指定された業務設計の見出しと候補の文字列による。これらを済ませたという主張はしない。
