{
  "case_id": "C1",
  "corrections": [
    {
      "packet_id": "P035",
      "field": "actionable_unknown_ids",
      "original_value": [
        "C1-U1",
        "C1-U2"
      ],
      "corrected_value": [],
      "status": "rubric_correction",
      "reason": "canonical questionsは空。F6/F4は各意思決定の未決を記すが、証拠引用は許否未決・境界解釈未決であり、具体的な質問文ではない。additional_human_inputsも「定める」「確定する」という要求で、質問としての実引用はない。",
      "evidence_ids": [
        "F6",
        "F4"
      ],
      "question_quote_refs": []
    },
    {
      "packet_id": "P035",
      "field": "coverage_evidence.actionable_unknown_ids",
      "original_value": {
        "C1-U1": [
          "F6"
        ],
        "C1-U2": [
          "F4"
        ]
      },
      "corrected_value": {},
      "status": "rubric_correction",
      "reason": "actionable_unknown_idsのrubric訂正に伴い、質問としての証拠対応も空にする。unknown_ids_foundとsource_facts_preservedは変更しない。",
      "evidence_ids": [
        "F6",
        "F4"
      ],
      "question_quote_refs": []
    },
    {
      "packet_id": "P038",
      "field": "actionable_unknown_ids",
      "original_value": [
        "C1-U1",
        "C1-U2"
      ],
      "corrected_value": [],
      "status": "rubric_correction",
      "reason": "canonical questionsは空。F7/F4は組合せ許否と区分境界の未決を識別するが、証拠引用は未決の叙述であり、具体的な質問文ではない。additional_human_inputsの「確定する必要」も質問ではない。",
      "evidence_ids": [
        "F7",
        "F4"
      ],
      "question_quote_refs": []
    },
    {
      "packet_id": "P038",
      "field": "coverage_evidence.actionable_unknown_ids",
      "original_value": {
        "C1-U1": [
          "F7"
        ],
        "C1-U2": [
          "F4"
        ]
      },
      "corrected_value": {},
      "status": "rubric_correction",
      "reason": "actionable_unknown_idsのrubric訂正に伴い、質問としての証拠対応も空にする。unknown_ids_foundとsource_facts_preservedは変更しない。",
      "evidence_ids": [
        "F7",
        "F4"
      ],
      "question_quote_refs": []
    }
  ],
  "limits": [
    "未決の発見は保持する。具体的な質問の引用はP035/P038 canonicalに存在せず、Question actionabilityだけを訂正する。",
    "原scores.json、raw-response.md、needs_raw_checkと既存raw_check_resolutionsは変更しない。"
  ]
}
