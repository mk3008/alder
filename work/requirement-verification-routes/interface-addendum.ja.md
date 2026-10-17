# 実行前の検査接続契約

2026-10-08 JST。protocol/oracle固定後、実装・検査を別担当で作る際の型の明示。実行前の追記で、期待結果・合否基準は変えない。

成功payloadはid/owner/room/start/end/cancelledを含むflatな予約dict。拒否はerrorを持つdict。SQLite start/endの型は指定せず、DB状態は前後の全行で比較する。

- run_scan(current, advisories, now, history, fail=False) → {status, events, history, candidate, current}
- history: {status: 'success'|'failed', at: 整数時刻} のlist。no_fixやbreakingを検出したscan自体はsuccess、scan例外はfailed。入力のhistory/currentを変更しない。
- events: typeを持つdictのlist。candidate_ready/manual_action/candidate_blocked/scan_failedは同名type、clean通知は任意。
- ready/blockedのcandidate: {version, advisory_id, regression}。no_fix/failed/cleanのcandidateはnull。
- regression(version) → {passed, valid_status, invalid_status}。現行と候補の実際のアプリ操作を使う。
- watchdog(history, now, started_at, interval=86400, grace=3600) → overdueイベントlist。成功がなければstarted_at基準、最近のfailedは成功時刻の代わりにならない。

実装担当はprotocolとfixturesとこの型だけ読み、oracle.json・検査コード・結果を読まない。検査担当は実装コードを読む前に検査を書き、実行前に保存する。これは同一系列モデルの指示による分離で、隠蔽強制や意味の独立承認ではない。
