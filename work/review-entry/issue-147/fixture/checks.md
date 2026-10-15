# 検査項目 revision C1

| ID | タイトル | 期待結果 | レビュー状態 |
| --- | --- | --- | --- |
| CK-01 | 貸出可能な備品を貸し出せる | 貸出可能なら借り手と日時の貸出記録が作られ、貸出中になる | 確認済み |
| CK-02 | 貸出中の備品を貸し出さない | 貸出中なら貸し出さず、既存の貸出記録を変更しない | 確認済み |
| CK-03 | 返却後に次の人へ貸し出せる | 返却日時が記録され、備品が貸出可能になる | 確認済み |

## 詳細
- CK-01: Business Design「備品を貸し出す」Procedure 1。明示。Test `test_lend_available`、assertion `self.assertEqual(item.status, "out")`。借り手・日時のassertion根拠は未確認。
- CK-02: Business Design「備品を貸し出す」Procedure 2。明示。Test mappingなし。
- CK-03: Business Design「備品を返却する」Procedure 1 / Result。明示。Test mappingなし。

- CK-04: 返却前の予約を受け付ける案。レビュー状態: 未確認。業務設計上の採否は未決。Test mappingなし。
