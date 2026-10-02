{
  "case_id": "C1",
  "flags": [
    {
      "packet_id": "P035",
      "flag_index": 0,
      "claim_ids": [
        "attempt-001-P035-1"
      ],
      "disposition": "artifact_ambiguous",
      "affected_metrics": [
        "unauthorized_decisions",
        "unsupported_additions"
      ],
      "judgment": "F19/F20は返却済記録の照会と日数算定を明示するが、その遅延を次回貸出可否へ適用する範囲は依然として確定できない。既存claimの本質的曖昧さであり、新規pendingではない。"
    },
    {
      "packet_id": "P038",
      "flag_index": 0,
      "claim_ids": [
        "attempt-001-P038-1"
      ],
      "disposition": "resolved_context_note",
      "affected_metrics": [
        "unauthorized_decisions"
      ],
      "judgment": "F14/F23の返却遅延日数の次回利用は断定形であり、F15の複数記録の選択未決と両立する。既存解決の文脈注記であり、代表値規則を補完しない。"
    },
    {
      "packet_id": "P005",
      "flag_index": 0,
      "claim_ids": [
        "attempt-001-P005-1"
      ],
      "disposition": "artifact_ambiguous",
      "affected_metrics": [
        "unauthorized_decisions",
        "unsupported_additions"
      ],
      "judgment": "F2/F4の未返却限定・返却済除外は局所的に断定されるが、固定sourceの返却遅延から必然的に導かれるかはなお曖昧。既存claimに対応し、新規pendingではない。"
    },
    {
      "packet_id": "P029",
      "flag_index": 0,
      "claim_ids": [
        "attempt-002-P029-1"
      ],
      "disposition": "artifact_ambiguous",
      "affected_metrics": [
        "unauthorized_decisions",
        "unsupported_additions"
      ],
      "judgment": "F19-F21の返却後遷移は条件付きで断定されるが、複数の未返却記録から代表日数を選ぶ規則までは示さない。既存claimの曖昧さを維持する。"
    },
    {
      "packet_id": "P046",
      "flag_index": 0,
      "claim_ids": [
        "attempt-001-P046-1",
        "attempt-002-P046-1"
      ],
      "disposition": "resolved_context_note",
      "affected_metrics": [
        "probe_inventions"
      ],
      "judgment": "F34/F35の対立する記載は実受領H046内にあり、probe独自の仕様化ではないと既存二claimで解決済み。原flagはその出所の文脈注記。"
    },
    {
      "packet_id": "P060",
      "flag_index": 0,
      "claim_ids": [
        "attempt-001-P060-1"
      ],
      "disposition": "resolved_context_note",
      "affected_metrics": [
        "unsupported_additions",
        "probe_inventions"
      ],
      "judgment": "F37/Q4は受領にない追加受付条件の必須確認で、具体的な許否規則は断定しないと既存claimで解決済み。原flagは質問の範囲を示す文脈注記。"
    }
  ],
  "limits": [
    "元scoresのneeds_raw_checkは変更しない。6 flagを各1回対応付け、新規pending concernはない。"
  ]
}
