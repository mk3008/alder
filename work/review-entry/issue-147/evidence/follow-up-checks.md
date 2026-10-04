# 検査項目 revision C2（C1の期待結果・レビュー状態を維持し、Test対応記録のみ更新）

| ID | タイトル | 期待結果 | レビュー状態 |
| --- | --- | --- | --- |
| CK-01 | 貸出可能な備品を貸し出せる | 貸出可能なら借り手と日時の貸出記録が作られ、貸出中になる | 確認済み |
| CK-02 | 貸出中の備品を貸し出さない | 貸出中なら貸し出さず、既存の貸出記録を変更しない | 確認済み |
| CK-03 | 返却後に次の人へ貸し出せる | 返却日時が記録され、備品が貸出可能になる | 確認済み |

## 詳細
- CK-01: Business Design「備品を貸し出す」Procedure 1。明示。**部分的なTest根拠**: `LendingTest.test_lend_available` の `self.assertEqual(item.status, "out")` は貸出中への状態変更を確認する。借り手と貸出日時を含む貸出記録の作成について直接assertionがなく、期待結果全体のTest根拠は不足。
- CK-02: Business Design「備品を貸し出す」Procedure 2。明示。**対応あり**: `LendingTest.test_refuse_busy` の `self.assertEqual(result, "unavailable")` が貸出拒否、`self.assertEqual(item.loans, before)` が既存貸出記録の保持を確認する。責任者は既存の期待結果の維持を判断済み。
- CK-03: Business Design「備品を返却する」Procedure 1 / Result。明示。**Test根拠なし**: 返却日時の記録、貸出可能への復帰、その後の次の利用者への貸出を直接確認するTestは見つからない。

- CK-04: 返却前の予約を受け付ける案。レビュー状態: 未確認。業務設計上の採否は未決。`LendingTest.test_reserve` は現在の予約動作をassertしているが、未承認の案を確認済みの業務期待として裏付ける対応付けは行わない。

Test根拠の確認範囲: Business Design `business-design.md` SHA-256 `2f9bd4672bc15fccc370f782aae687f3bfae9914a4ec2d1ccf18683cdcbbbea0`、元のCheck list revision C1、`test_lending.py` SHA-256 `25d5b51c210121011ecda2c7f6791f43e774e1ef4f6760f0946fd4c314b74a3b`。2026-10-04 UTCに `PYTHONDONTWRITEBYTECODE=1 python -m unittest test_lending.py -v` を実行し、3件すべて成功。成功は各Testの実際のassertion範囲についての実行根拠であり、CK-01・CK-03の不足やCK-04の業務上の未決を解消しない。逆方向の対応: `test_lend_available` → CK-01の状態変更部分、`test_refuse_busy` → CK-02、`test_reserve` → 未承認候補CK-04の現行動作のみ（確認済みCheckへの証拠ではない）。
