# 検査項目 revision C2

| ID | タイトル | 期待結果 | レビュー状態 |
| --- | --- | --- | --- |
| CK-01 | 貸出可能な備品を貸し出せる | 貸出可能なら借り手と日時の貸出記録が作られ、貸出中になる | 確認済み |
| CK-02 | 貸出中の備品を貸し出さない | 貸出中なら貸し出さず、既存の貸出記録を変更しない | 確認済み |
| CK-03 | 返却後に次の人へ貸し出せる | 返却日時が記録され、備品が貸出可能になる | 確認済み |

## 詳細
- CK-01: Business Design「備品を貸し出す」Procedure 1 / Output、Business Design revision（SHA-256: `2f9bd4672bc15fccc370f782aae687f3bfae9914a4ec2d1ccf18683cdcbbbea0`）。明示。Test `test_lend_available`（Test revision SHA-256: `25d5b51c210121011ecda2c7f6791f43e774e1ef4f6760f0946fd4c314b74a3b`）の `self.assertEqual(item.status, "out")` は貸出中への状態変更のみを検証。借り手・貸出日時のassertionはなく、Business Designが貸出記録に要求する備品番号と返却時の貸出特定も検証されていない。部分的なTest対応。2026-10-04 UTCの実行では当該Test成功（3件中3件成功）だが、未assertの期待結果を立証しない。
- CK-02: Business Design「備品を貸し出す」Procedure 2、同revision。明示。Test `test_refuse_busy`（同Test revision）の `self.assertEqual(result, "unavailable")` と `self.assertEqual(item.loans, before)` が、貸出中の拒否と既存記録不変を検証。Test対応あり。2026-10-04 UTCの実行で当該Test成功（3件中3件成功）。
- CK-03: Business Design「備品を返却する」Procedure 1 / Result、同revision。明示。返却日時・貸出可能状態・次の利用者への貸出を直接検証するTest/assertionはない。Test対応なし。2026-10-04 UTCに3件のTestが成功したが、返却を扱うTestは実行されていない。

- CK-04: 返却前の予約を受け付ける案。レビュー状態: 未確認。業務設計上の採否は未決。`test_reserve`（同Test revision）は予約用の保存と戻り値をassertし、2026-10-04 UTCの実行で成功したが、承認済みのBusiness Design上の期待結果へのTest対応ではない。予約の採否と約束する権利・優先順位は業務責任者の判断待ち。承認済みCheckとしてのTest mappingなし。
