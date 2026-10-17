# 検査補完の継続監査

日付: 2026-10-07 UTC。これは初回 `fresh-audit` の続きであり、新規の独立 Fresh 監査や初回結果の書き換えではない。`results/run-02` を読む前に、補完対象の `assertion-addendum.ja.md`、`test_routes.py`、`run_experiment.py` を読んだ。依頼元は3ファイルが公開 commit `0dbbf642368419625c0bd45c0002e71fe68950b9` と Git blob 一致と確認済み。本監査は Git blob 照合を再実行していない。実装・fixture・oracle・protocol は不変との引き継ぎを受けた。

## 指示の公開用要約

補完ソースを先に評価し、返却 receipt 全内容、通知イベント詳細、新しい返却値破損 mutation の検出を確認する。既存 run-02 を見る前に `python3 -B run_experiment.py --source-revision 0dbbf642368419625c0bd45c0002e71fe68950b9 --output results/audit-supplement` を1回実行する。ソースや外部状態は変更しない。結果、hash、限界を記録する。

## 評価

1. 先の SYS1 指摘は対象ケースに対し改善された。commit 後の再送 `receipt` 全dictを保存済み SQLite 行全dictと照合する。新 `system_corrupt_replay_receipt` は DB を変えず返却 `room` のみ破損する。違反 run は `test_SYS1_after_commit_cut_then_same_receipt` の `AssertionError` で失敗した。以前の ID/DB 全行だけの照合では見逃した種類の違反を検出した。
2. OPS1 のイベント詳細も改善された。ready/blocked の通知時刻・advisory ID・version・regression と candidate の一致、manual_action の advisory ID、scan_failed の時刻、missing の時刻・due_at・last_success=null を確認する。ただし、**古い成功履歴を使う stale 分岐は overdue の type のみ**で、同分岐の `last_success`/`due_at` は assert しない。全通知 payload を検証済みとは言えない。外部配送・長期スケジューラも依然未検証。
3. `run_experiment.py` の `SOURCES` は8ファイルのままで、今回追加の `assertion-addendum.ja.md` は manifest の `source_sha256` に含まれない。この文章の内容と公開 commit の対応は別途照合が必要。`--source-revision` は呼出側の文字列であり、runner 自身は Git revision を検証しない。manifest もそれを明記している。
4. `test_routes.py` 冒頭の「before implementation read」は元の検査作成については記録されるが、今回の assertion 補完は独立監査後の実装既知の追加である。`assertion-addendum.ja.md` は時系列を正しく記すため、補完部分を初回の盲検検査と呼ばないこと。

## 実行・証拠

- コマンド: `python3 -B run_experiment.py --source-revision 0dbbf642368419625c0bd45c0002e71fe68950b9 --output results/audit-supplement`。終了0。Python 3.12.14、SQLite 3.53.1、Linux x86_64。
- 6 mutation × normal/violated/repaired = 18 phase。全 normal/repaired は終了0、全 violated は終了1。`ERROR`/import failure は0。新 mutation を含む6つすべてが期待した test 名の assertion failure。manifest は `all_expectations_met=true`、`source_unchanged=true`。
- manifest の8ソース hash と現在の実ファイル、18ログ hash と実ログを再計算して一致。12個の normal/repaired snapshot は元ソース hash と完全一致。6 violated snapshot は各々該当する `app.py` または `maintenance.py` 1ファイルだけ変化。
- 新 mutation の raw ログは `system_corrupt_replay_receipt-violated.log`、diff は `system_corrupt_replay_receipt.diff`。違反結果は返却 room `wrong-room` 対保存 room `A` であり、ID/DB状態は維持。修復 phase は終了0で元ファイル hash に復帰。

結論: 固定された有限ケースについて補完テストと第6 mutation の意味ある検出を確認した。初回の主張を遡及拡大せず、追加検査として扱う。実認証、HTTP/TLS、実 advisory、全通知内容、運用配信・継続監視、業務承認や残余リスク受容は立証していない。
