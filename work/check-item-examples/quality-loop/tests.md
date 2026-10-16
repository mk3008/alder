# 関連検証

2026-10-16。最初の公開bundle revision `8853a63101bb5968751986b0260bb8bc036505e2`（81件）と、最終診断source `0986ae5c67efeed0797f3f78083f81ac12dbe047` を公式exportした作業木（84件） のgit worktreeで実行。既存テスト本体は変更していない。

| 実行 | 結果 |
| --- | --- |
| `python3 -m unittest tools/test_plugin_package.py tools/test_workflow_skills.py tools/test_plugin_release_workflow.py tools/test_export_plugin_references.py tools/test_plugin_references.py` | 84 tests OK（診断の正例・接頭辞/索引の誤り・未対応/コード例・repositoryなし実行の3 testを追加） |
| `python3 -m unittest discover -s work/check-item-examples -p 'test_*.py'` | 4 tests OK |
| `python3 -m unittest discover -s tools/business_graph -p 'test_*.py'` | 52 tests OK |
| `python3 -m unittest discover -s work/traceability-drift -p 'test_*.py'` | 12 tests OK |
| `python3 work/traceability-drift/evaluate.py --output /tmp/drift-observations.json` | 26 scenarios passed |

これらは配布・既存契約・限定監査等の検証であり、文章の意味やレビュー検出能力の証明ではない。実際の読取・修復の結果は同じディレクトリのrawと結果記録で確認する。

購買の最終更新 `update-candidate-3.md` には旧限定監査を無変更で適用し、`52 checks / 6 ids` が成功した。これは保持6フィールド・原典URL・単一本文・見出し先の限定監査である。一般的な意味の同値判定ではない。

新規診断の正例では宣言名自体の `Activity` を保持し、表示に余計な接頭辞を足した反例と索引の別名を検出する。コード例中の見出しを無視し、対応外入力は未検証を返す。repositoryなしのコピーでも実行できることを検査した。共有参照/例値の意味判定はこの診断へ移していない。
