{
  "case_id": "C2",
  "flags": [
    {
      "packet_id": "P002",
      "flag_index": 0,
      "claim_ids": [
        "attempt-001-P002-1"
      ],
      "disposition": "artifact_ambiguous",
      "affected_metrics": [
        "unsupported_additions"
      ],
      "judgment": "F23-F25の属性は局所的な断定形の追加として採点済み。必須実装項目へどこまで昇格するかは原文だけで定まらないため、既存の曖昧さを維持する。"
    },
    {
      "packet_id": "P006",
      "flag_index": 0,
      "claim_ids": [
        "attempt-001-P006-1"
      ],
      "disposition": "resolved_context_note",
      "affected_metrics": [
        "unauthorized_decisions",
        "unsupported_additions"
      ],
      "judgment": "F15は取消後の条件付き再予約可能性を確定しており、即時性は述べない。既存の先取り判断の採点範囲を示す文脈注記で、新たな未確認claimではない。"
    },
    {
      "packet_id": "P026",
      "flag_index": 0,
      "claim_ids": [
        "attempt-001-P026-1"
      ],
      "disposition": "resolved_context_note",
      "affected_metrics": [
        "actionable_unknown_ids"
      ],
      "judgment": "Q7は新規予約と時間変更を明示して別々の許否回答を導くため両unknownにactionableと判断済み。詳細条件が未指定という限定は残すが、同じactionabilityの新しい未確認claimではない。"
    },
    {
      "packet_id": "P043",
      "flag_index": 0,
      "claim_ids": [
        "attempt-001-P043-1"
      ],
      "disposition": "artifact_ambiguous",
      "affected_metrics": [
        "unresolved_leakage",
        "probe_inventions"
      ],
      "judgment": "F22の未決列挙なしは受領H043に未決明記がないことと整合する一方、そのメタ記述の原文参照範囲は一意に定まらない。既存の曖昧さを維持する。"
    }
  ],
  "limits": [
    "4件の既存needs_raw_checkをそれぞれ1回だけ対応付けた。既存scores、raw-response、各判断は変更していない。",
    "新たなpending concernは認めず、既存resolutionのresolved文脈注記2件とartifact曖昧2件に分類した。"
  ]
}
