# 独立監査後の検査補完（追加実行前固定）

2026-10-08 JST / 2026-10-07 UTC。

初回run-01とfresh-auditは元の5変異・15phaseで保存し、書き換えない。[独立監査](results/fresh-audit/audit.ja.md)で二つのassertion不足が見つかった。

1. SYS1は再送IDとDB全行不変を検査したが、返却receiptの全フィールドを照合していなかった。元から固定されていた「同一予約の結果・内容」に合わせ、保存行全体とのdict一致を追加する。返却roomだけを壊す変異を追加し、DB不変・ID一致だけでは見逃す違反を検出できるかを観測する。
2. OPS1はevent typeを検査したが、通知内容の関連付けを一部しかassertionしていなかった。通知の時刻、対象advisory、修正版、回帰結果、期限とlast_successを追加照合する。外部への配送は依然未検証。

protocol・fixture・oracle・実装は不変。これは合否条件を実装へ合わせた変更ではなく、固定済み要求と検査の対応不足の修正。初回の限定的検出成功を、全receipt/全通知payloadの検証済みへ遡及変更しない。

補完run-02では6変異・18phaseを実行する。runnerのrevision情報は呼出側が確認したSHAを `--source-revision` で渡し、source_sha256と公開commitの別照合を必要とする。文字列のSHAを記録しただけでは出所の証明にならない。
