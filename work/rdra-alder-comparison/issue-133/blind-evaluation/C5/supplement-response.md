{
  "raw_flag_dispositions": {
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
  },
  "additional_raw_check_resolutions": {
    "case_id": "C5",
    "raw_check_resolutions": [
      {
        "claim_id": "attempt-002-P059-1",
        "status": "artifact_ambiguous",
        "judgment": "F21の局所原文は既存schema維持を要求形で述べ、bigint自動採番主キー、非負の必須整数、空でない必須文字列、三状態の必須文字列を意味として保持する。一方でGENERATED ALWAYS AS IDENTITYとCHECK式の逐語形、既存定義そのものは提示されず、固定oracleの列型制約全体を厳密に保持したかはこの箇所だけで確定できない。元scoreを0または保持へ強制しない。",
        "raw_quote_refs": [
          {
            "review_file": "P059-review.json",
            "canonical_id": "F21"
          }
        ],
        "affected_metrics": [
          "source_facts_preserved"
        ]
      }
    ]
  },
  "architecture_assessments": {
    "case_id": "C5",
    "assessments": [
      {
        "packet_id": "P004",
        "assessment": "not_requested",
        "judgment": "named architecture/framework/layerの追加Human inputを必須要求していない。canonicalの技術条件・未指定記載と追加Human input欄を照合。元nullは固定C5指標の適用漏れであり、要求ありとは扱わない。",
        "evidence_ids": [
          "F21",
          "F27",
          "F32"
        ]
      },
      {
        "packet_id": "P021",
        "assessment": "not_requested",
        "judgment": "named architecture/framework/layerの追加Human inputを必須要求していない。canonicalの技術条件・未指定記載と追加Human input欄を照合。元nullは固定C5指標の適用漏れであり、要求ありとは扱わない。",
        "evidence_ids": [
          "F28",
          "F29"
        ]
      },
      {
        "packet_id": "P023",
        "assessment": "not_requested",
        "judgment": "named architecture/framework/layerの追加Human inputを必須要求していない。canonicalの技術条件・未指定記載と追加Human input欄を照合。元nullは固定C5指標の適用漏れであり、要求ありとは扱わない。",
        "evidence_ids": [
          "F23",
          "F26",
          "F27"
        ]
      },
      {
        "packet_id": "P024",
        "assessment": "not_requested",
        "judgment": "named architecture/framework/layerの追加Human inputを必須要求していない。canonicalの技術条件・未指定記載と追加Human input欄を照合。元nullは固定C5指標の適用漏れであり、要求ありとは扱わない。",
        "evidence_ids": [
          "F2",
          "F4"
        ]
      },
      {
        "packet_id": "P018",
        "assessment": "not_requested",
        "judgment": "named architecture/framework/layerの追加Human inputを必須要求していない。canonicalの技術条件・未指定記載と追加Human input欄を照合。元nullは固定C5指標の適用漏れであり、要求ありとは扱わない。",
        "evidence_ids": [
          "F7",
          "F8"
        ]
      },
      {
        "packet_id": "P049",
        "assessment": "not_requested",
        "judgment": "named architecture/framework/layerの追加Human inputを必須要求していない。canonicalの技術条件・未指定記載と追加Human input欄を照合。元nullは固定C5指標の適用漏れであり、要求ありとは扱わない。",
        "evidence_ids": [
          "F8",
          "F9"
        ]
      },
      {
        "packet_id": "P051",
        "assessment": "not_requested",
        "judgment": "named architecture/framework/layerの追加Human inputを必須要求していない。canonicalの技術条件・未指定記載と追加Human input欄を照合。元nullは固定C5指標の適用漏れであり、要求ありとは扱わない。",
        "evidence_ids": [
          "F19",
          "F23",
          "F24"
        ]
      },
      {
        "packet_id": "P059",
        "assessment": "not_requested",
        "judgment": "named architecture/framework/layerの追加Human inputを必須要求していない。canonicalの技術条件・未指定記載と追加Human input欄を照合。元nullは固定C5指標の適用漏れであり、要求ありとは扱わない。",
        "evidence_ids": [
          "F21",
          "F22"
        ]
      },
      {
        "packet_id": "P014",
        "assessment": "not_requested",
        "judgment": "named architecture/framework/layerの追加Human inputを必須要求していない。canonicalの技術条件・未指定記載と追加Human input欄を照合。元nullは固定C5指標の適用漏れであり、要求ありとは扱わない。",
        "evidence_ids": [
          "F29",
          "F30",
          "F31"
        ]
      },
      {
        "packet_id": "P040",
        "assessment": "not_requested",
        "judgment": "named architecture/framework/layerの追加Human inputを必須要求していない。canonicalの技術条件・未指定記載と追加Human input欄を照合。元nullは固定C5指標の適用漏れであり、要求ありとは扱わない。",
        "evidence_ids": [
          "F36"
        ]
      },
      {
        "packet_id": "P045",
        "assessment": "not_requested",
        "judgment": "named architecture/framework/layerの追加Human inputを必須要求していない。canonicalの技術条件・未指定記載と追加Human input欄を照合。元nullは固定C5指標の適用漏れであり、要求ありとは扱わない。",
        "evidence_ids": [
          "F26"
        ]
      },
      {
        "packet_id": "P057",
        "assessment": "not_requested",
        "judgment": "named architecture/framework/layerの追加Human inputを必須要求していない。canonicalの技術条件・未指定記載と追加Human input欄を照合。元nullは固定C5指標の適用漏れであり、要求ありとは扱わない。",
        "evidence_ids": [
          "F29",
          "F33"
        ]
      }
    ],
    "limits": [
      "不要求はcanonical全体のadditional_human_inputs欄も確認した陰性判定。evidence_idsは各packet内の技術制約または内部構造未指定に関する局所根拠。",
      "採点元ファイルのnullは保持し、別patchに訂正提案を記録する。"
    ]
  },
  "score_correction": {
    "case_id": "C5",
    "corrections": [
      {
        "packet_id": "P004",
        "field": "architecture_input_required",
        "original_value": null,
        "corrected_value": false,
        "status": "rubric_correction",
        "reason": "固定C5指標は追加Human inputとしてnamed architecture/framework/layer指定を必須要求したかを全packetに適用する。canonicalにその要求はなく、元nullは適用漏れ。",
        "evidence_ids": [
          "F21",
          "F27",
          "F32"
        ]
      },
      {
        "packet_id": "P021",
        "field": "architecture_input_required",
        "original_value": null,
        "corrected_value": false,
        "status": "rubric_correction",
        "reason": "固定C5指標は追加Human inputとしてnamed architecture/framework/layer指定を必須要求したかを全packetに適用する。canonicalにその要求はなく、元nullは適用漏れ。",
        "evidence_ids": [
          "F28",
          "F29"
        ]
      },
      {
        "packet_id": "P023",
        "field": "architecture_input_required",
        "original_value": null,
        "corrected_value": false,
        "status": "rubric_correction",
        "reason": "固定C5指標は追加Human inputとしてnamed architecture/framework/layer指定を必須要求したかを全packetに適用する。canonicalにその要求はなく、元nullは適用漏れ。",
        "evidence_ids": [
          "F23",
          "F26",
          "F27"
        ]
      },
      {
        "packet_id": "P024",
        "field": "architecture_input_required",
        "original_value": null,
        "corrected_value": false,
        "status": "rubric_correction",
        "reason": "固定C5指標は追加Human inputとしてnamed architecture/framework/layer指定を必須要求したかを全packetに適用する。canonicalにその要求はなく、元nullは適用漏れ。",
        "evidence_ids": [
          "F2",
          "F4"
        ]
      },
      {
        "packet_id": "P018",
        "field": "architecture_input_required",
        "original_value": null,
        "corrected_value": false,
        "status": "rubric_correction",
        "reason": "固定C5指標は追加Human inputとしてnamed architecture/framework/layer指定を必須要求したかを全packetに適用する。canonicalにその要求はなく、元nullは適用漏れ。",
        "evidence_ids": [
          "F7",
          "F8"
        ]
      },
      {
        "packet_id": "P049",
        "field": "architecture_input_required",
        "original_value": null,
        "corrected_value": false,
        "status": "rubric_correction",
        "reason": "固定C5指標は追加Human inputとしてnamed architecture/framework/layer指定を必須要求したかを全packetに適用する。canonicalにその要求はなく、元nullは適用漏れ。",
        "evidence_ids": [
          "F8",
          "F9"
        ]
      },
      {
        "packet_id": "P051",
        "field": "architecture_input_required",
        "original_value": null,
        "corrected_value": false,
        "status": "rubric_correction",
        "reason": "固定C5指標は追加Human inputとしてnamed architecture/framework/layer指定を必須要求したかを全packetに適用する。canonicalにその要求はなく、元nullは適用漏れ。",
        "evidence_ids": [
          "F19",
          "F23",
          "F24"
        ]
      },
      {
        "packet_id": "P059",
        "field": "architecture_input_required",
        "original_value": null,
        "corrected_value": false,
        "status": "rubric_correction",
        "reason": "固定C5指標は追加Human inputとしてnamed architecture/framework/layer指定を必須要求したかを全packetに適用する。canonicalにその要求はなく、元nullは適用漏れ。",
        "evidence_ids": [
          "F21",
          "F22"
        ]
      },
      {
        "packet_id": "P014",
        "field": "architecture_input_required",
        "original_value": null,
        "corrected_value": false,
        "status": "rubric_correction",
        "reason": "固定C5指標は追加Human inputとしてnamed architecture/framework/layer指定を必須要求したかを全packetに適用する。canonicalにその要求はなく、元nullは適用漏れ。",
        "evidence_ids": [
          "F29",
          "F30",
          "F31"
        ]
      },
      {
        "packet_id": "P040",
        "field": "architecture_input_required",
        "original_value": null,
        "corrected_value": false,
        "status": "rubric_correction",
        "reason": "固定C5指標は追加Human inputとしてnamed architecture/framework/layer指定を必須要求したかを全packetに適用する。canonicalにその要求はなく、元nullは適用漏れ。",
        "evidence_ids": [
          "F36"
        ]
      },
      {
        "packet_id": "P045",
        "field": "architecture_input_required",
        "original_value": null,
        "corrected_value": false,
        "status": "rubric_correction",
        "reason": "固定C5指標は追加Human inputとしてnamed architecture/framework/layer指定を必須要求したかを全packetに適用する。canonicalにその要求はなく、元nullは適用漏れ。",
        "evidence_ids": [
          "F26"
        ]
      },
      {
        "packet_id": "P057",
        "field": "architecture_input_required",
        "original_value": null,
        "corrected_value": false,
        "status": "rubric_correction",
        "reason": "固定C5指標は追加Human inputとしてnamed architecture/framework/layer指定を必須要求したかを全packetに適用する。canonicalにその要求はなく、元nullは適用漏れ。",
        "evidence_ids": [
          "F29",
          "F33"
        ]
      }
    ],
    "limits": [
      "原scores.jsonとraw-response.mdは変更しない。",
      "P059のschema逐語同一性は局所引用では曖昧なため、source_facts_preservedとcoverage_evidenceに確定値の別訂正を行わない。"
    ]
  }
}
