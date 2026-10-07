# 独立ソース監査・再実行記録

日付: 2026-10-07 UTC。対象: `mk3008/alder` #187 の架空会議室予約・3領域検証。監査前に `results/run-01`、他の研究結果、親スレッドの会話を参照せず、固定された8ソースを先に読んだ。ソースは依頼元で公開 commit `8b3eac9ebfa2d47d073e41c082faf424b6caa828` の Git blob と一致確認済みと伝えられた。本監査では Git blob 照合を再実行していない。

## 監査指示（作業指示の公開用要約。内部の伝達文は除外）

「`protocol.ja.md`、`interface-addendum.ja.md`、`fixtures.json`、`oracle.json`、`app.py`、`maintenance.py`、`test_routes.py`、`run_experiment.py` を、既存結果より先に読み、固定要件が機械的に検査されるかを独立に評価する。mutation が import error ではなく意味のある assertion failure を起こすか、修復で元ソースが戻るか、保守が failed/missing/no fix/breaking を扱うか、境界の主張が正直かを確認する。その後 `python3 run_experiment.py --output results/fresh-audit` を新規出力先で1回実行し、ログと manifest を確認する。ソースは変更せず、外部書き込みは行わない。業務要件を承認したり、実認証・HTTP transport・長期稼働を保証したりしない。」

要求設定: リポジトリ指示に従い gpt-6-sol / medium / fork none が指定された。ただしモデル名・実際の推論 effort・隔離はこの結果ファイルや実行環境からは証明できない。

## 重要な所見

1. 有限ケースの経路成立は確認できた。通常・修復の各 suite は成功し、5種類の違反注入は対象 assert で失敗した。`ERROR`/import failure は0。15 phase すべて manifest の期待と一致した。実DB接続 `close` と再接続、owner の直接呼出、アプリを実際に呼ぶ候補回帰という観測点は、文書だけの照合より具体的。
2. SYS1 の「再送で同一予約の結果・内容」はテストが部分的にしか assertion していない。commit 後再送では返却 `id` と DB 全行不変、status=201 を検査するが、返却 dict 全体が DB 内容に一致することや `room/start/end/cancelled` の全フィールドは照合しない。現実装は正しい形を返すが、固定 oracle の文章全体を自動テストで証明したとは言えない。
3. OPS1 の通知イベントは原則 `type` の存在だけをテストする。候補の version/advisory/regression は result の `candidate` では照合するが、イベント本文では照合しない。`manual_action` と `overdue` の補足フィールドも assertion 対象外。現実装には値があるが、イベント payload 完全性の変異検出までは実証していない。
4. 実験範囲は明示的に限定されている。架空 token とアプリ呼出境界であり HTTP/TLS/実認証ではない。watchdog は関数を固定時刻で呼び出すだけで、長期 scheduler や配信を試していない。fake advisory/version であり実 CVE、更新、rollback は扱わない。業務担当者の実承認、要件網羅、安全性一般も証明しない。

## 入力と実行証拠

- 入力: 上記8ソース（`results/fresh-audit/manifest.json` の `source_sha256` に個別 SHA-256）。固定 oracle と fixture は変更なし。
- 実行: `python3 run_experiment.py --output results/fresh-audit`。終了コード0。CPython 3.12.14、SQLite 3.53.1、Linux x86_64。
- 追加の読み取り検証: manifest 内の8ソース SHA-256 と実ファイル、15ログ SHA-256 と実ログを再照合。10個の normal/repaired snapshot が元ソース hashes と完全一致し、5個の violated snapshot は該当する `app.py` または `maintenance.py` の1ファイルだけ変化することを確認。
- `system_skip_replay`: 通常0、違反1、修復0。違反は `test_SYS1_after_commit_cut_then_same_receipt` の assertion failure (`409 != 201`)。
- `security_allow_other_owner`: 0/1/0。違反は bob の GET、取消、body owner 偽装の3件が `200 != 403`。
- `maintenance_skip_regression`: 0/1/0。breaking 候補が `candidate_ready != candidate_blocked`。
- `maintenance_hide_failed_run`: 0/1/0。`scan_failed` イベントが欠落。
- `maintenance_hide_missing_run`: 0/1/0。25時間+1秒と古い成功履歴に対する `overdue` イベントが欠落。
- これらはすべて assertion failure で、import error などではない。`manifest.json` は `all_expectations_met: true`、`source_unchanged: true`。

## 判断境界

3領域の選定された有限 oracle と指定 mutation について、実行可能な検証経路と違反検出・復旧は支持される。要件の完全性、他の実装変異、実運用の信頼性、モデル独立性や盲検性は未立証。`protocol_revision` と `code_and_test_revision` は runner の固定文字列であり、その SHA の出所を manifest 単体では立証しない。今回の公開 source commit との同一性は、依頼元の Git blob 照合を前提とする。
