{
  "case_id": "C3",
  "scores": [
    {
      "packet_id": "P009",
      "stage": "s1",
      "unknown_ids_found": [
        "C3-U1",
        "C3-U2",
        "C3-U3"
      ],
      "actionable_unknown_ids": [
        "C3-U1",
        "C3-U2",
        "C3-U3"
      ],
      "source_facts_preserved": [
        "社員が申請",
        "上長が承認または却下",
        "承認後に購買担当が購入",
        "購入結果を申請者へ伝える",
        "金額と物品を記録",
        "高額の場合に追加確認が必要"
      ],
      "answer_facts_preserved": [],
      "unauthorized_decisions": [],
      "unsupported_additions": [],
      "unresolved_leakage": [],
      "redundant_questions": [],
      "correct_stop": null,
      "downstream_facts_preserved": [],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": null,
      "implementation_viability": "not_executed",
      "needs_raw_check": [],
      "notes": [
        "申請から承認、購買、連絡・記録への受渡しを保持（F7, F14, F18, F19, F22）。",
        "高額の閾値・担当・承認との順序と効力を具体的に問う（Q1–Q3）。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {
          "C3-U1": [
            "Q1"
          ],
          "C3-U2": [
            "F26",
            "Q2"
          ],
          "C3-U3": [
            "F26",
            "Q2",
            "Q3"
          ]
        },
        "actionable_unknown_ids": {
          "C3-U1": [
            "Q1"
          ],
          "C3-U2": [
            "Q2"
          ],
          "C3-U3": [
            "Q2",
            "Q3"
          ]
        },
        "source_facts_preserved": {
          "社員が申請": [
            "F4",
            "F7"
          ],
          "上長が承認または却下": [
            "F9",
            "F10"
          ],
          "承認後に購買担当が購入": [
            "F14",
            "F16"
          ],
          "購入結果を申請者へ伝える": [
            "F19"
          ],
          "金額と物品を記録": [
            "F22"
          ],
          "高額の場合に追加確認が必要": [
            "F1",
            "F26"
          ]
        },
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P013",
      "stage": "s1",
      "unknown_ids_found": [
        "C3-U1",
        "C3-U2"
      ],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "社員が申請",
        "上長が承認または却下",
        "承認後に購買担当が購入",
        "購入結果を申請者へ伝える",
        "金額と物品を記録",
        "高額の場合に追加確認が必要"
      ],
      "answer_facts_preserved": [],
      "unauthorized_decisions": [
        {
          "meaning": "追加確認を上長承認後の購買担当による振分け・別担当の購入可否判断として確定",
          "evidence_ids": [
            "F7",
            "F8",
            "F11"
          ]
        }
      ],
      "unsupported_additions": [
        {
          "meaning": "物品マスターを業務の必須情報として置く",
          "evidence_ids": [
            "F23"
          ]
        }
      ],
      "unresolved_leakage": [],
      "redundant_questions": [],
      "correct_stop": null,
      "downstream_facts_preserved": [],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": null,
      "implementation_viability": "not_executed",
      "needs_raw_check": [
        "F7–F11の順序・追加確認の購入不可判断が提案扱いだったか、原文で確認余地がある。"
      ],
      "notes": [
        "閾値と確認者は未決として認識する一方、追加確認の順序と拒否判断を確定している（F6–F11）。",
        "追加確認後に購入・実績記録・結果通知までの連続性を示す（F11, F13–F15）。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {
          "C3-U1": [
            "F6"
          ],
          "C3-U2": [
            "F9"
          ]
        },
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "社員が申請": [
            "F1"
          ],
          "上長が承認または却下": [
            "F2"
          ],
          "承認後に購買担当が購入": [
            "F4",
            "F13"
          ],
          "購入結果を申請者へ伝える": [
            "F15"
          ],
          "金額と物品を記録": [
            "F14"
          ],
          "高額の場合に追加確認が必要": [
            "F5",
            "F8"
          ]
        },
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P032",
      "stage": "s1",
      "unknown_ids_found": [
        "C3-U1",
        "C3-U2",
        "C3-U3"
      ],
      "actionable_unknown_ids": [
        "C3-U1",
        "C3-U2",
        "C3-U3"
      ],
      "source_facts_preserved": [
        "社員が申請",
        "上長が承認または却下",
        "承認後に購買担当が購入",
        "購入結果を申請者へ伝える",
        "金額と物品を記録",
        "高額の場合に追加確認が必要"
      ],
      "answer_facts_preserved": [],
      "unauthorized_decisions": [],
      "unsupported_additions": [],
      "unresolved_leakage": [],
      "redundant_questions": [],
      "correct_stop": null,
      "downstream_facts_preserved": [],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": null,
      "implementation_viability": "not_executed",
      "needs_raw_check": [],
      "notes": [
        "高額確認の閾値、責任者、承認との順序と購入可否への効力を未決として保持（F10–F13, Q1–Q4）。",
        "購入結果の連絡と物品・金額記録を別活動として保持（F7, F8）。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {
          "C3-U1": [
            "F10",
            "Q1"
          ],
          "C3-U2": [
            "F11",
            "Q2"
          ],
          "C3-U3": [
            "F12",
            "F13",
            "Q3",
            "Q4"
          ]
        },
        "actionable_unknown_ids": {
          "C3-U1": [
            "Q1"
          ],
          "C3-U2": [
            "Q2"
          ],
          "C3-U3": [
            "Q3",
            "Q4"
          ]
        },
        "source_facts_preserved": {
          "社員が申請": [
            "F3"
          ],
          "上長が承認または却下": [
            "F4"
          ],
          "承認後に購買担当が購入": [
            "F5"
          ],
          "購入結果を申請者へ伝える": [
            "F7"
          ],
          "金額と物品を記録": [
            "F8"
          ],
          "高額の場合に追加確認が必要": [
            "F6"
          ]
        },
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P042",
      "stage": "s1",
      "unknown_ids_found": [
        "C3-U1"
      ],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "社員が申請",
        "上長が承認または却下",
        "承認後に購買担当が購入",
        "購入結果を申請者へ伝える",
        "金額と物品を記録",
        "高額の場合に追加確認が必要"
      ],
      "answer_facts_preserved": [],
      "unauthorized_decisions": [
        {
          "meaning": "高額確認担当者が購入可否を判断し、購入不可なら購入へ進めないことを確定",
          "evidence_ids": [
            "F8",
            "F9"
          ]
        },
        {
          "meaning": "購入失敗を確定状態として扱い、失敗時も結果通知を必須とする",
          "evidence_ids": [
            "F13",
            "F14"
          ]
        }
      ],
      "unsupported_additions": [
        {
          "meaning": "物品マスターと仕様による照合を業務情報として必須化",
          "evidence_ids": [
            "F19"
          ]
        }
      ],
      "unresolved_leakage": [],
      "redundant_questions": [],
      "correct_stop": null,
      "downstream_facts_preserved": [],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": null,
      "implementation_viability": "not_executed",
      "needs_raw_check": [
        "F8–F9の高額担当・拒否判断はsourceの「追加確認」の自然な具体化とも読めるため、原文の位置づけ確認を要する。"
      ],
      "notes": [
        "高額閾値だけ未指定とし、確認者と承認との順序・効力は設計上確定する（F6–F10, F31）。",
        "却下後の購入禁止から結果通知と記録までの活動を連結する（F5, F11–F15）。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {
          "C3-U1": [
            "F31"
          ]
        },
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "社員が申請": [
            "F2"
          ],
          "上長が承認または却下": [
            "F3",
            "F4"
          ],
          "承認後に購買担当が購入": [
            "F11"
          ],
          "購入結果を申請者へ伝える": [
            "F14"
          ],
          "金額と物品を記録": [
            "F12"
          ],
          "高額の場合に追加確認が必要": [
            "F6"
          ]
        },
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P010",
      "stage": "s2",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "社員が申請",
        "上長が承認または却下",
        "承認後に購買担当が購入",
        "購入結果を申請者へ伝える",
        "金額と物品を記録",
        "高額の場合に追加確認が必要"
      ],
      "answer_facts_preserved": [
        "高額は10万円以上",
        "部長が追加確認",
        "通常承認後に追加確認",
        "10万円以上は上長承認と部長確認の両方完了で購入可",
        "10万円未満は上長承認で購入可",
        "却下時は購入しない",
        "必要確認未完了では購入しない",
        "購入結果の連絡手段と期限は未決"
      ],
      "unauthorized_decisions": [
        {
          "meaning": "結果連絡の担当者を購買担当と確定",
          "evidence_ids": [
            "F21",
            "F35"
          ]
        }
      ],
      "unsupported_additions": [],
      "unresolved_leakage": [],
      "redundant_questions": [],
      "correct_stop": null,
      "downstream_facts_preserved": [],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": null,
      "implementation_viability": "not_executed",
      "needs_raw_check": [
        "F19の「実際の購入額」確定とF21の連絡担当は元回答にないが、実務的具体化か業務決定かの原文確認余地。"
      ],
      "notes": [
        "10万円境界と上長承認後の部長確認、金額別購入条件を一連の状態と画面に保持（F8–F17, F31–F34）。",
        "手段・期限の未決境界は維持（F23）。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "社員が申請": [
            "F1",
            "F2"
          ],
          "上長が承認または却下": [
            "F4",
            "F5",
            "F6"
          ],
          "承認後に購買担当が購入": [
            "F17"
          ],
          "購入結果を申請者へ伝える": [
            "F21"
          ],
          "金額と物品を記録": [
            "F19"
          ],
          "高額の場合に追加確認が必要": [
            "F8",
            "F9"
          ]
        },
        "answer_facts_preserved": {
          "高額は10万円以上": [
            "F8"
          ],
          "部長が追加確認": [
            "F9",
            "F12"
          ],
          "通常承認後に追加確認": [
            "F9"
          ],
          "10万円以上は上長承認と部長確認の両方完了で購入可": [
            "F14"
          ],
          "10万円未満は上長承認で購入可": [
            "F13"
          ],
          "却下時は購入しない": [
            "F6",
            "F15"
          ],
          "必要確認未完了では購入しない": [
            "F15"
          ],
          "購入結果の連絡手段と期限は未決": [
            "F23"
          ]
        },
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P017",
      "stage": "s2",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "社員が申請",
        "上長が承認または却下",
        "承認後に購買担当が購入",
        "購入結果を申請者へ伝える",
        "金額と物品を記録",
        "高額の場合に追加確認が必要"
      ],
      "answer_facts_preserved": [
        "高額は10万円以上",
        "部長が追加確認",
        "通常承認後に追加確認",
        "10万円以上は上長承認と部長確認の両方完了で購入可",
        "10万円未満は上長承認で購入可",
        "却下時は購入しない",
        "必要確認未完了では購入しない",
        "購入結果の連絡手段と期限は未決"
      ],
      "unauthorized_decisions": [],
      "unsupported_additions": [],
      "unresolved_leakage": [],
      "redundant_questions": [],
      "correct_stop": null,
      "downstream_facts_preserved": [],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": null,
      "implementation_viability": "not_executed",
      "needs_raw_check": [],
      "notes": [
        "10万円未満/以上の異なる購入条件と確認の順序を保持（F3–F5, F10–F11）。",
        "連絡担当を仮置きし、手段・期限や金額変更条件を未決として分離（F14–F18, Q1–Q4）。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "社員が申請": [
            "F6"
          ],
          "上長が承認または却下": [
            "F7",
            "F8"
          ],
          "承認後に購買担当が購入": [
            "F11"
          ],
          "購入結果を申請者へ伝える": [
            "F13"
          ],
          "金額と物品を記録": [
            "F12"
          ],
          "高額の場合に追加確認が必要": [
            "F4",
            "F10"
          ]
        },
        "answer_facts_preserved": {
          "高額は10万円以上": [
            "F3",
            "F4"
          ],
          "部長が追加確認": [
            "F4",
            "F10"
          ],
          "通常承認後に追加確認": [
            "F4"
          ],
          "10万円以上は上長承認と部長確認の両方完了で購入可": [
            "F4",
            "F11"
          ],
          "10万円未満は上長承認で購入可": [
            "F3"
          ],
          "却下時は購入しない": [
            "F5"
          ],
          "必要確認未完了では購入しない": [
            "F5"
          ],
          "購入結果の連絡手段と期限は未決": [
            "F15"
          ]
        },
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P031",
      "stage": "s2",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "社員が申請",
        "上長が承認または却下",
        "承認後に購買担当が購入",
        "購入結果を申請者へ伝える",
        "金額と物品を記録",
        "高額の場合に追加確認が必要"
      ],
      "answer_facts_preserved": [
        "高額は10万円以上",
        "部長が追加確認",
        "通常承認後に追加確認",
        "10万円以上は上長承認と部長確認の両方完了で購入可",
        "10万円未満は上長承認で購入可",
        "却下時は購入しない",
        "必要確認未完了では購入しない",
        "購入結果の連絡手段と期限は未決"
      ],
      "unauthorized_decisions": [],
      "unsupported_additions": [],
      "unresolved_leakage": [],
      "redundant_questions": [],
      "correct_stop": null,
      "downstream_facts_preserved": [],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": null,
      "implementation_viability": "not_executed",
      "needs_raw_check": [],
      "notes": [
        "申請→上長判断→金額別引渡し→部長確認→購買の連続性を草案扱いで記す（F5–F9）。",
        "連絡担当や金額境界の再判定は未確認とし、手段・期限を今回決めない（F12–F16）。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "社員が申請": [
            "F5"
          ],
          "上長が承認または却下": [
            "F6"
          ],
          "承認後に購買担当が購入": [
            "F9"
          ],
          "購入結果を申請者へ伝える": [
            "F11"
          ],
          "金額と物品を記録": [
            "F10"
          ],
          "高額の場合に追加確認が必要": [
            "F3",
            "F8"
          ]
        },
        "answer_facts_preserved": {
          "高額は10万円以上": [
            "F2",
            "F3"
          ],
          "部長が追加確認": [
            "F3",
            "F8"
          ],
          "通常承認後に追加確認": [
            "F3"
          ],
          "10万円以上は上長承認と部長確認の両方完了で購入可": [
            "F3",
            "F9"
          ],
          "10万円未満は上長承認で購入可": [
            "F2"
          ],
          "却下時は購入しない": [
            "F4"
          ],
          "必要確認未完了では購入しない": [
            "F4"
          ],
          "購入結果の連絡手段と期限は未決": [
            "F16"
          ]
        },
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P033",
      "stage": "s2",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "社員が申請",
        "上長が承認または却下",
        "承認後に購買担当が購入",
        "購入結果を申請者へ伝える",
        "金額と物品を記録",
        "高額の場合に追加確認が必要"
      ],
      "answer_facts_preserved": [
        "高額は10万円以上",
        "部長が追加確認",
        "通常承認後に追加確認",
        "10万円以上は上長承認と部長確認の両方完了で購入可",
        "10万円未満は上長承認で購入可",
        "却下時は購入しない",
        "必要確認未完了では購入しない",
        "購入結果の連絡手段と期限は未決"
      ],
      "unauthorized_decisions": [
        {
          "meaning": "結果連絡の責任者を購買担当に確定",
          "evidence_ids": [
            "F15",
            "F42"
          ]
        },
        {
          "meaning": "却下時にも購入しなかった結果を申請者に伝えることを確定",
          "evidence_ids": [
            "F17",
            "F32"
          ]
        }
      ],
      "unsupported_additions": [],
      "unresolved_leakage": [],
      "redundant_questions": [],
      "correct_stop": null,
      "downstream_facts_preserved": [],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": null,
      "implementation_viability": "not_executed",
      "needs_raw_check": [
        "却下時の「購入結果」通知がsourceの連絡対象に含まれるか、原文で確認余地。"
      ],
      "notes": [
        "上長承認から高額時の部長確認を経る金額別購入条件を保持（F4–F10, F25–F30）。",
        "連絡手段・期限は未決だが、却下時連絡と担当は追加の確定規則（F15–F19）。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "社員が申請": [
            "F1",
            "F2"
          ],
          "上長が承認または却下": [
            "F3"
          ],
          "承認後に購買担当が購入": [
            "F12"
          ],
          "購入結果を申請者へ伝える": [
            "F15"
          ],
          "金額と物品を記録": [
            "F13"
          ],
          "高額の場合に追加確認が必要": [
            "F4",
            "F5"
          ]
        },
        "answer_facts_preserved": {
          "高額は10万円以上": [
            "F4"
          ],
          "部長が追加確認": [
            "F5"
          ],
          "通常承認後に追加確認": [
            "F5"
          ],
          "10万円以上は上長承認と部長確認の両方完了で購入可": [
            "F8"
          ],
          "10万円未満は上長承認で購入可": [
            "F7"
          ],
          "却下時は購入しない": [
            "F9"
          ],
          "必要確認未完了では購入しない": [
            "F10"
          ],
          "購入結果の連絡手段と期限は未決": [
            "F18",
            "F19"
          ]
        },
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P020",
      "stage": "s3",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [],
      "answer_facts_preserved": [],
      "unauthorized_decisions": [],
      "unsupported_additions": [],
      "unresolved_leakage": [],
      "redundant_questions": [],
      "correct_stop": null,
      "downstream_facts_preserved": [
        "社員が申請",
        "上長が承認または却下",
        "承認後に購買担当が購入",
        "購入結果を申請者へ伝える",
        "金額と物品を記録",
        "高額の場合に追加確認が必要",
        "高額は10万円以上",
        "部長が追加確認",
        "通常承認後に追加確認",
        "10万円以上は上長承認と部長確認の両方完了で購入可",
        "10万円未満は上長承認で購入可",
        "却下時は購入しない",
        "必要確認未完了では購入しない"
      ],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": null,
      "implementation_viability": "not_executed",
      "needs_raw_check": [
        "F33–F34の文書内不一致は受領canonical H020にない情報で、probe原資料参照の真偽はcanonicalだけでは確認できない。"
      ],
      "notes": [
        "申請画面から審査、部長確認、購入、記録・連絡への期待結果を連続して伝える（F1–F29）。",
        "受領handoff H020 の未決手段・期限（F20–F21）と金額別購入条件（F10–F13）を保持。上長の説明文不一致という別論点は受領canonicalには見えずraw確認余地（F33–F34）。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {},
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {
          "社員が申請": [
            "F1",
            "F3"
          ],
          "上長が承認または却下": [
            "F5",
            "F6",
            "F8"
          ],
          "承認後に購買担当が購入": [
            "F20"
          ],
          "購入結果を申請者へ伝える": [
            "F26"
          ],
          "金額と物品を記録": [
            "F24"
          ],
          "高額の場合に追加確認が必要": [
            "F10",
            "F15"
          ],
          "高額は10万円以上": [
            "F10"
          ],
          "部長が追加確認": [
            "F15",
            "F18"
          ],
          "通常承認後に追加確認": [
            "F15",
            "F18"
          ],
          "10万円以上は上長承認と部長確認の両方完了で購入可": [
            "F12"
          ],
          "10万円未満は上長承認で購入可": [
            "F11"
          ],
          "却下時は購入しない": [
            "F9"
          ],
          "必要確認未完了では購入しない": [
            "F14"
          ]
        }
      }
    },
    {
      "packet_id": "P034",
      "stage": "s3",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [],
      "answer_facts_preserved": [],
      "unauthorized_decisions": [],
      "unsupported_additions": [],
      "unresolved_leakage": [],
      "redundant_questions": [],
      "correct_stop": null,
      "downstream_facts_preserved": [
        "社員が申請",
        "上長が承認または却下",
        "承認後に購買担当が購入",
        "購入結果を申請者へ伝える",
        "金額と物品を記録",
        "高額の場合に追加確認が必要",
        "高額は10万円以上",
        "部長が追加確認",
        "通常承認後に追加確認",
        "10万円以上は上長承認と部長確認の両方完了で購入可",
        "10万円未満は上長承認で購入可",
        "却下時は購入しない",
        "必要確認未完了では購入しない"
      ],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": null,
      "implementation_viability": "not_executed",
      "needs_raw_check": [],
      "notes": [
        "購入申請から承認・部長確認、購入、記録・結果連絡の引渡しを保つ（F1–F12）。",
        "判定金額の種類、連絡担当、購入不能経路、手段・期限を未決に保つ（F13–F29）。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {},
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {
          "社員が申請": [
            "F1"
          ],
          "上長が承認または却下": [
            "F2"
          ],
          "承認後に購買担当が購入": [
            "F9"
          ],
          "購入結果を申請者へ伝える": [
            "F12"
          ],
          "金額と物品を記録": [
            "F11"
          ],
          "高額の場合に追加確認が必要": [
            "F4"
          ],
          "高額は10万円以上": [
            "F4"
          ],
          "部長が追加確認": [
            "F4",
            "F5"
          ],
          "通常承認後に追加確認": [
            "F4",
            "F5"
          ],
          "10万円以上は上長承認と部長確認の両方完了で購入可": [
            "F6"
          ],
          "10万円未満は上長承認で購入可": [
            "F3"
          ],
          "却下時は購入しない": [
            "F7"
          ],
          "必要確認未完了では購入しない": [
            "F8"
          ]
        }
      }
    },
    {
      "packet_id": "P039",
      "stage": "s3",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [],
      "answer_facts_preserved": [],
      "unauthorized_decisions": [],
      "unsupported_additions": [],
      "unresolved_leakage": [],
      "redundant_questions": [],
      "correct_stop": null,
      "downstream_facts_preserved": [
        "社員が申請",
        "上長が承認または却下",
        "承認後に購買担当が購入",
        "購入結果を申請者へ伝える",
        "金額と物品を記録",
        "高額の場合に追加確認が必要",
        "高額は10万円以上",
        "部長が追加確認",
        "通常承認後に追加確認",
        "10万円以上は上長承認と部長確認の両方完了で購入可",
        "10万円未満は上長承認で購入可",
        "却下時は購入しない",
        "必要確認未完了では購入しない"
      ],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": null,
      "implementation_viability": "not_executed",
      "needs_raw_check": [],
      "notes": [
        "上長判断→高額時の部長確認→購買の条件と引継ぎを保持（F6–F14）。",
        "受領Stage2の仮置き連絡担当を確定せず、金額変更・記録額・却下連絡等を未決に残す（F18–F28）。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {},
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {
          "社員が申請": [
            "F4",
            "F5"
          ],
          "上長が承認または却下": [
            "F6"
          ],
          "承認後に購買担当が購入": [
            "F14"
          ],
          "購入結果を申請者へ伝える": [
            "F16"
          ],
          "金額と物品を記録": [
            "F15"
          ],
          "高額の場合に追加確認が必要": [
            "F9"
          ],
          "高額は10万円以上": [
            "F9"
          ],
          "部長が追加確認": [
            "F9",
            "F11"
          ],
          "通常承認後に追加確認": [
            "F9",
            "F11"
          ],
          "10万円以上は上長承認と部長確認の両方完了で購入可": [
            "F10"
          ],
          "10万円未満は上長承認で購入可": [
            "F8"
          ],
          "却下時は購入しない": [
            "F12"
          ],
          "必要確認未完了では購入しない": [
            "F10",
            "F13"
          ]
        }
      }
    },
    {
      "packet_id": "P041",
      "stage": "s3",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [],
      "answer_facts_preserved": [],
      "unauthorized_decisions": [
        {
          "meaning": "却下した申請について購入しなかった結果を申請者へ通知する規則を確定",
          "evidence_ids": [
            "F17",
            "F18"
          ]
        }
      ],
      "unsupported_additions": [],
      "unresolved_leakage": [],
      "redundant_questions": [],
      "correct_stop": null,
      "downstream_facts_preserved": [
        "社員が申請",
        "上長が承認または却下",
        "承認後に購買担当が購入",
        "購入結果を申請者へ伝える",
        "金額と物品を記録",
        "高額の場合に追加確認が必要",
        "高額は10万円以上",
        "部長が追加確認",
        "通常承認後に追加確認",
        "10万円以上は上長承認と部長確認の両方完了で購入可",
        "10万円未満は上長承認で購入可",
        "却下時は購入しない",
        "必要確認未完了では購入しない"
      ],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": null,
      "implementation_viability": "not_executed",
      "needs_raw_check": [
        "F26–F29の文書内UC不整合は受領canonical H041にないため、原資料による裏取りが必要。"
      ],
      "notes": [
        "受領handoff H041の却下後連絡を引継ぎつつ、金額別の承認・確認条件を期待結果に保持（F5–F18）。この却下通知はprobe独自の発明ではない。",
        "手段と期限は未決とし、UC説明と状態モデルの対応問題を別途示す（F21, F26–F29）。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {},
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {
          "社員が申請": [
            "F1",
            "F2"
          ],
          "上長が承認または却下": [
            "F4",
            "F5"
          ],
          "承認後に購買担当が購入": [
            "F14"
          ],
          "購入結果を申請者へ伝える": [
            "F17"
          ],
          "金額と物品を記録": [
            "F15"
          ],
          "高額の場合に追加確認が必要": [
            "F6",
            "F8"
          ],
          "高額は10万円以上": [
            "F6"
          ],
          "部長が追加確認": [
            "F8",
            "F10"
          ],
          "通常承認後に追加確認": [
            "F8"
          ],
          "10万円以上は上長承認と部長確認の両方完了で購入可": [
            "F12"
          ],
          "10万円未満は上長承認で購入可": [
            "F7"
          ],
          "却下時は購入しない": [
            "F5",
            "F13"
          ],
          "必要確認未完了では購入しない": [
            "F13"
          ]
        }
      }
    }
  ],
  "limits": [
    "匿名canonicalだけの独立評価。原成果物の文脈と抽出漏れは監査できず、曖昧な意味は各needs_raw_checkに残した。",
    "全12 packetのcanonicalを利用できたためunavailable除外はない。",
    "C3の評価でありC4 correct stopとC5補助指標は適用外。implementation_viabilityは実装未実行としてnot_executed。",
    "Stage3の独自発明比較には実受領handoff canonical H020/H041、およびbyte-identicalのP031/P017を使用した。full Stage2はStage2評価のみで、H020/H041にない意味を受領済みとは推定していない。"
  ]
}
