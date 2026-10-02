{
  "case_id": "C5",
  "flags": [
    {
      "packet_id": "P051",
      "flag_index": 0,
      "claim_ids": [
        "attempt-001-P051-1"
      ],
      "disposition": "artifact_ambiguous",
      "affected_metrics": [
        "source_facts_preserved",
        "unauthorized_decisions"
      ],
      "judgment": "既存引用はF7の課長だけの条件とF38の統合フロー単一行の部長アクターを照合済み。行の修正意図は未確定なので同じraw照会を再試行しない。"
    },
    {
      "packet_id": "P059",
      "flag_index": 0,
      "claim_ids": [
        "attempt-002-P059-1"
      ],
      "disposition": "artifact_ambiguous",
      "affected_metrics": [
        "source_facts_preserved"
      ],
      "judgment": "新規局所引用F21はschema維持と各列の意味的制約を確認するが、GENERATED ALWAYSとCHECK式の逐語形は示さず、厳密な維持判定は未確定。"
    },
    {
      "packet_id": "P040",
      "flag_index": 0,
      "claim_ids": [
        "attempt-001-P040-1"
      ],
      "disposition": "artifact_ambiguous",
      "affected_metrics": [
        "downstream_facts_preserved",
        "probe_inventions",
        "unauthorized_decisions"
      ],
      "judgment": "F24-F31の状態名、却下UC、少額画面行の競合は既存引用で確認済み。受領H040由来の記載をprobe発明に転嫁せず、対応付けの意図は曖昧なまま。"
    },
    {
      "packet_id": "P045",
      "flag_index": 0,
      "claim_ids": [
        "attempt-001-P045-1"
      ],
      "disposition": "resolved_context_note",
      "affected_metrics": [
        "downstream_facts_preserved"
      ],
      "judgment": "既存F7,F9引用はschema維持と列名・状態名の要約に限られ、型・CHECK式欠落を確認済み。参照先省略の可能性は採点限界の注記であり同一claimを新pendingにしない。"
    },
    {
      "packet_id": "P045",
      "flag_index": 1,
      "claim_ids": [
        "attempt-001-P045-1"
      ],
      "disposition": "resolved_context_note",
      "affected_metrics": [
        "downstream_facts_preserved"
      ],
      "judgment": "同じ既存claimのF10引用とcanonical F11-F13により経路・金額別役職・approved/rejectedの意味は追える。bodyフィールドの逐語列挙の欠落は精度限界として残し、別の新規raw concernを増やさない。"
    },
    {
      "packet_id": "P057",
      "flag_index": 0,
      "claim_ids": [
        "attempt-001-P057-1"
      ],
      "disposition": "resolved_context_note",
      "affected_metrics": [
        "probe_inventions",
        "unauthorized_decisions",
        "unresolved_leakage"
      ],
      "judgment": "既存F30,F31,Q1,Q2引用でrole値と実利用者照合の選択・条件付き確認方法は明示的未決と確認済み。実受領handoffにもあり、probe独自の確定要件ではない。"
    }
  ],
  "limits": [
    "全6 flagを各一回対応付けた。同一引用で確認済みの注記は無限retryの対象にしない。",
    "artifact_ambiguousは原artifactの対応意図やschema逐語同一性を新たに補完しない。"
  ]
}
