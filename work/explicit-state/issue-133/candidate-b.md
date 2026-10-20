# 案B：Object内の構造化ブロック（未採用）

```state-json
{
  "object": "購入申請",
  "states": [
    "下書き",
    "差戻し",
    "submitted",
    "approved",
    "purchased"
  ],
  "start": "@new",
  "terminal": "@unknown",
  "completeness": "partial",
  "source": "6f0b5d492f02a8659ca2836afa84aba18606a531:business-design/purchase-request/README.md",
  "transitions": [
    {
      "id": "T01",
      "from": "@new",
      "activity": "備品購入を申請する",
      "condition": "必須情報を入力し役職別上限額へ適合と自動判定",
      "to": "submitted",
      "effect": "change",
      "path": "normal",
      "evidence": "E1",
      "note": "新規作成"
    },
    {
      "id": "T02",
      "from": "@new",
      "activity": "備品購入を申請する",
      "condition": "提出前に中断し下書き保存を選択",
      "to": "下書き",
      "effect": "change",
      "path": "exception",
      "evidence": "E2",
      "note": "必須項目が未入力でも保存可能"
    },
    {
      "id": "T03",
      "from": "@new",
      "activity": "備品購入を申請する",
      "condition": "役職別上限額に不適合または判定不能",
      "to": "@none",
      "effect": "no-create",
      "path": "exception",
      "evidence": "E2",
      "note": "submittedを作成しない。下書き保存の選択とは別条件"
    },
    {
      "id": "T04",
      "from": "submitted",
      "activity": "購入申請を承認する",
      "condition": "承認者が購入を認める",
      "to": "approved",
      "effect": "change",
      "path": "normal",
      "evidence": "E3",
      "note": "承認日時を記録"
    },
    {
      "id": "T05",
      "from": "submitted",
      "activity": "購入申請を承認する",
      "condition": "承認者が購入を認めない",
      "to": "差戻し",
      "effect": "change",
      "path": "exception",
      "evidence": "E4",
      "note": "理由と日時を記録"
    },
    {
      "id": "T06",
      "from": "下書き",
      "activity": "購入申請を再申請・破棄する",
      "condition": "再申請を選択し必須情報と役職別上限額適合を確認",
      "to": "submitted",
      "effect": "change",
      "path": "normal",
      "evidence": "E5",
      "note": "同じ対象を再申請"
    },
    {
      "id": "T07",
      "from": "下書き",
      "activity": "購入申請を再申請・破棄する",
      "condition": "破棄を選択",
      "to": "@unknown",
      "effect": "constraint",
      "path": "exception",
      "evidence": "E6",
      "note": "以後の承認・購入対象外。保存状態・物理削除・履歴は未決"
    },
    {
      "id": "T08",
      "from": "下書き",
      "activity": "購入申請を再申請・破棄する",
      "condition": "再申請時に役職別上限額へ不適合または判定不能",
      "to": "@unknown",
      "effect": "constraint",
      "path": "exception",
      "evidence": "E6",
      "note": "submittedへ変更しない。元の状態・内容の扱いは未決"
    },
    {
      "id": "T09",
      "from": "差戻し",
      "activity": "購入申請を再申請・破棄する",
      "condition": "再申請を選択し必須情報と役職別上限額適合を確認",
      "to": "submitted",
      "effect": "change",
      "path": "normal",
      "evidence": "E5",
      "note": "同じ対象を再申請"
    },
    {
      "id": "T10",
      "from": "差戻し",
      "activity": "購入申請を再申請・破棄する",
      "condition": "破棄を選択",
      "to": "@unknown",
      "effect": "constraint",
      "path": "exception",
      "evidence": "E6",
      "note": "以後の承認・購入対象外。保存状態・物理削除・履歴は未決"
    },
    {
      "id": "T11",
      "from": "差戻し",
      "activity": "購入申請を再申請・破棄する",
      "condition": "再申請時に役職別上限額へ不適合または判定不能",
      "to": "@unknown",
      "effect": "constraint",
      "path": "exception",
      "evidence": "E6",
      "note": "submittedへ変更しない。元の状態・内容の扱いは未決"
    },
    {
      "id": "T12",
      "from": "approved",
      "activity": "購入を準備する",
      "condition": "対象を選択しCSV出力",
      "to": "@unknown",
      "effect": "constraint",
      "path": "normal",
      "evidence": "E7",
      "note": "purchasedへ変更しない。不変の明示宣言は未追加"
    },
    {
      "id": "T13",
      "from": "approved",
      "activity": "購入結果を登録する",
      "condition": "外部購入完了後に対象を選択し実購入金額と購入日時を記録",
      "to": "purchased",
      "effect": "change",
      "path": "normal",
      "evidence": "E8",
      "note": "購入日時を登録時刻と同一視しない"
    }
  ]
}
```
