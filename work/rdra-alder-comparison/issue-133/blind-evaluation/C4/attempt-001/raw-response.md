{
  "case_id": "C4",
  "scores": [
    {
      "packet_id": "P001",
      "stage": "s2",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "対象は承認分岐だけ",
        "10万円以上は部長承認",
        "10万円未満は課長承認",
        "承認後だけ購買担当が購入",
        "却下時は購入しない",
        "金額分岐以外の承認条件は同じ"
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
        "F6/F8で金額境界ごとの判断者、F7/F9/F11で承認結果から購買担当の購入までの活動間連続性を保持。F2で金額以外の条件の同一性と内容未定義を区別。F15の確認待ちは局所的な新業務条件ではない。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "対象は承認分岐だけ": [
            "F1"
          ],
          "10万円以上は部長承認": [
            "F6"
          ],
          "10万円未満は課長承認": [
            "F8"
          ],
          "承認後だけ購買担当が購入": [
            "F10",
            "F11"
          ],
          "却下時は購入しない": [
            "F10"
          ],
          "金額分岐以外の承認条件は同じ": [
            "F2"
          ]
        },
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P008",
      "stage": "s2",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "10万円以上は部長承認",
        "10万円未満は課長承認",
        "承認後だけ購買担当が購入",
        "却下時は購入しない",
        "金額分岐以外の承認条件は同じ"
      ],
      "answer_facts_preserved": [],
      "unauthorized_decisions": [
        {
          "meaning": "購入申請者による提出と承認待ち管理を確定する。",
          "evidence_ids": [
            "F5",
            "F16"
          ]
        },
        {
          "meaning": "購買担当に承認先への回付責任を追加する。",
          "evidence_ids": [
            "F6"
          ]
        },
        {
          "meaning": "承認結果・状態の記録と状態遷移を業務上の必須過程とする。",
          "evidence_ids": [
            "F8",
            "F9",
            "F16"
          ]
        },
        {
          "meaning": "購入実績の記録と購入済み終端状態を確定する。",
          "evidence_ids": [
            "F13",
            "F14",
            "F15"
          ]
        }
      ],
      "unsupported_additions": [
        {
          "meaning": "申請者による提出、購買担当による回付、結果記録を追加する。",
          "evidence_ids": [
            "F5",
            "F6",
            "F8",
            "F9"
          ]
        },
        {
          "meaning": "購入記録・購入済み状態を追加する。",
          "evidence_ids": [
            "F13",
            "F14",
            "F15"
          ]
        },
        {
          "meaning": "具体的な画面・属性構成を要求として追加する。",
          "evidence_ids": [
            "F19",
            "F20",
            "F21",
            "F24"
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
        "F1-F27の引用には単語単位のものが多く、特にF5/F6/F8/F9/F13/F14/F19-F24の局所文脈と要求の強さは原文確認が必要。抽出限界は意味を補う根拠にしない。",
        "F25/F26の高額フローと課長画面の関連は抽出上の配置と矛盾するため局所原文を確認。"
      ],
      "notes": [
        "F1/F2/F3とF10-F12で承認者・共通条件・購入可否の連続性は保持。ただしF5/F6/F8/F14の追加業務をassertedとし、F25/F26は高額分岐の画面対応に局所矛盾を示す。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "10万円以上は部長承認": [
            "F1"
          ],
          "10万円未満は課長承認": [
            "F2"
          ],
          "承認後だけ購買担当が購入": [
            "F10",
            "F11"
          ],
          "却下時は購入しない": [
            "F12"
          ],
          "金額分岐以外の承認条件は同じ": [
            "F3"
          ]
        },
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P011",
      "stage": "s1",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "対象は承認分岐だけ",
        "10万円以上は部長承認",
        "10万円未満は課長承認",
        "承認後だけ購買担当が購入",
        "却下時は購入しない",
        "金額分岐以外の承認条件は同じ"
      ],
      "answer_facts_preserved": [],
      "unauthorized_decisions": [],
      "unsupported_additions": [],
      "unresolved_leakage": [],
      "redundant_questions": [
        {
          "meaning": "比較金額の税・送料の定義を追加回答として必須化する。",
          "evidence_ids": [
            "Q1",
            "F20"
          ]
        },
        {
          "meaning": "購買担当への結果伝達情報・方法を追加回答として必須化する。",
          "evidence_ids": [
            "Q2",
            "F21"
          ]
        }
      ],
      "correct_stop": false,
      "downstream_facts_preserved": [],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": null,
      "implementation_viability": "not_executed",
      "needs_raw_check": [],
      "notes": [
        "F11は10万円ちょうどを部長側に含め、F13は他条件共通を保持。Q1/Q2は具体的な質問だが固定unknownはなく、F20/F21を新たな必須未決とするため正しい停止ではない。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "対象は承認分岐だけ": [
            "F1"
          ],
          "10万円以上は部長承認": [
            "F11"
          ],
          "10万円未満は課長承認": [
            "F12"
          ],
          "承認後だけ購買担当が購入": [
            "F14",
            "F16"
          ],
          "却下時は購入しない": [
            "F15"
          ],
          "金額分岐以外の承認条件は同じ": [
            "F13"
          ]
        },
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P015",
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
        "10万円以上は部長承認",
        "10万円未満は課長承認",
        "承認後だけ購買担当が購入",
        "却下時は購入しない",
        "金額分岐以外の承認条件は同じ"
      ],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": null,
      "implementation_viability": "not_executed",
      "needs_raw_check": [],
      "notes": [
        "F2/F3/F5/F11/F12により金額分岐、共通条件、承認後購入と却下停止が連続する。F13は合意未確認として区別され、F6も共通条件の具体内容を確定しない。受領canonicalはP053。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {},
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {
          "10万円以上は部長承認": [
            "F3"
          ],
          "10万円未満は課長承認": [
            "F2"
          ],
          "承認後だけ購買担当が購入": [
            "F11"
          ],
          "却下時は購入しない": [
            "F12"
          ],
          "金額分岐以外の承認条件は同じ": [
            "F5"
          ]
        }
      }
    },
    {
      "packet_id": "P016",
      "stage": "s1",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "10万円以上は部長承認",
        "10万円未満は課長承認",
        "承認後だけ購買担当が購入",
        "却下時は購入しない",
        "金額分岐以外の承認条件は同じ"
      ],
      "answer_facts_preserved": [],
      "unauthorized_decisions": [
        {
          "meaning": "購買担当を購入申請の入力・提出者に指定する。",
          "evidence_ids": [
            "F4"
          ]
        },
        {
          "meaning": "購買担当による審査先の振分けと承認記録照合を必須化する。",
          "evidence_ids": [
            "F5",
            "F8"
          ]
        },
        {
          "meaning": "共通条件を満たす／満たさないことを承認／却下の決定則にする。",
          "evidence_ids": [
            "F13",
            "F14"
          ]
        },
        {
          "meaning": "承認・購入記録と状態遷移を業務過程として確定する。",
          "evidence_ids": [
            "F7",
            "F11",
            "F12",
            "F15"
          ]
        }
      ],
      "unsupported_additions": [
        {
          "meaning": "申請提出、回付、記録照合、状態管理を追加する。",
          "evidence_ids": [
            "F4",
            "F5",
            "F7",
            "F8",
            "F12"
          ]
        },
        {
          "meaning": "承認判断基準と購入記録を追加する。",
          "evidence_ids": [
            "F11",
            "F13",
            "F14"
          ]
        },
        {
          "meaning": "画面、属性、コンテキストの具体的要求を追加する。",
          "evidence_ids": [
            "F19",
            "F20",
            "F21",
            "F24",
            "F25",
            "F30"
          ]
        }
      ],
      "unresolved_leakage": [],
      "redundant_questions": [],
      "correct_stop": false,
      "downstream_facts_preserved": [],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": null,
      "implementation_viability": "not_executed",
      "needs_raw_check": [
        "F31の高額フローに置かれた課長向け画面行はF1と矛盾し、局所原文で適用範囲を確認。"
      ],
      "notes": [
        "F1/F2/F3/F9/F10は基本分岐と購入可否を保持する一方、F4とF13/F14は依頼元にない役割・判定条件をasserted化。F16/F17の対象記述と多段業務・画面要求の範囲は整合確認が要る。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "10万円以上は部長承認": [
            "F1"
          ],
          "10万円未満は課長承認": [
            "F2"
          ],
          "承認後だけ購買担当が購入": [
            "F9"
          ],
          "却下時は購入しない": [
            "F10"
          ],
          "金額分岐以外の承認条件は同じ": [
            "F3"
          ]
        },
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P030",
      "stage": "s1",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "10万円以上は部長承認",
        "10万円未満は課長承認",
        "承認後だけ購買担当が購入",
        "却下時は購入しない",
        "金額分岐以外の承認条件は同じ"
      ],
      "answer_facts_preserved": [],
      "unauthorized_decisions": [
        {
          "meaning": "購買担当による申請回付と承認待ち管理を業務責任とする。",
          "evidence_ids": [
            "F5",
            "F6"
          ]
        },
        {
          "meaning": "承認・却下結果の記録と承認状態遷移を必須化する。",
          "evidence_ids": [
            "F7",
            "F8",
            "F9",
            "F14"
          ]
        }
      ],
      "unsupported_additions": [
        {
          "meaning": "回付・承認待ち・記録の業務過程を追加する。",
          "evidence_ids": [
            "F5",
            "F6",
            "F7",
            "F8",
            "F9"
          ]
        },
        {
          "meaning": "具体的な画面・申請属性を要件化する。",
          "evidence_ids": [
            "F16",
            "F17",
            "F18",
            "F19",
            "F20"
          ]
        }
      ],
      "unresolved_leakage": [],
      "redundant_questions": [],
      "correct_stop": false,
      "downstream_facts_preserved": [],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": null,
      "implementation_viability": "not_executed",
      "needs_raw_check": [
        "F23の高額フローと課長向け画面の関連はF1と配置矛盾があり、原文の行文脈を確認。"
      ],
      "notes": [
        "F1/F2の金額境界とF10/F11の承認後購入・却下停止を保持。F5/F6の回付責任、F7-F9の記録状態化が承認分岐だけというF24を超える。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "10万円以上は部長承認": [
            "F1"
          ],
          "10万円未満は課長承認": [
            "F2"
          ],
          "承認後だけ購買担当が購入": [
            "F10"
          ],
          "却下時は購入しない": [
            "F11"
          ],
          "金額分岐以外の承認条件は同じ": [
            "F3"
          ]
        },
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P047",
      "stage": "s1",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "対象は承認分岐だけ",
        "10万円以上は部長承認",
        "10万円未満は課長承認",
        "承認後だけ購買担当が購入",
        "却下時は購入しない",
        "金額分岐以外の承認条件は同じ"
      ],
      "answer_facts_preserved": [],
      "unauthorized_decisions": [],
      "unsupported_additions": [],
      "unresolved_leakage": [],
      "redundant_questions": [
        {
          "meaning": "税・複数明細を考慮した比較金額を追加回答として必須化する。",
          "evidence_ids": [
            "Q1",
            "F13"
          ]
        }
      ],
      "correct_stop": false,
      "downstream_facts_preserved": [],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": null,
      "implementation_viability": "not_executed",
      "needs_raw_check": [],
      "notes": [
        "F4/F5/F6とF8/F9で境界・条件・購入可否の連続性は保持。Q1は具体的質問だが固定unknown外の金額定義を必須化し、C4の停止を損なう。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "対象は承認分岐だけ": [
            "F1"
          ],
          "10万円以上は部長承認": [
            "F4"
          ],
          "10万円未満は課長承認": [
            "F5"
          ],
          "承認後だけ購買担当が購入": [
            "F8",
            "F9"
          ],
          "却下時は購入しない": [
            "F8"
          ],
          "金額分岐以外の承認条件は同じ": [
            "F6"
          ]
        },
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P050",
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
        "10万円以上は部長承認",
        "10万円未満は課長承認",
        "承認後だけ購買担当が購入",
        "却下時は購入しない",
        "金額分岐以外の承認条件は同じ"
      ],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": null,
      "implementation_viability": "not_executed",
      "needs_raw_check": [
        "F20/F21の結果記録と却下遷移の不整合は受領H050のF18-F23にもあり、局所原文で確定度を確認。"
      ],
      "notes": [
        "F3/F5/F9-F11で金額分岐、共通条件、状態別購入可否を伝える。F15/F18/F23/F26は審査基準や結果記録対応を未決とし、期待結果へ混入しない。追加の申請入力・結果記録・購入済み管理（F1/F8/F12/F13）は実受領H050のF7/F18/F24/F31に存在しprobe独自発明とは数えない。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {},
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {
          "10万円以上は部長承認": [
            "F3"
          ],
          "10万円未満は課長承認": [
            "F3"
          ],
          "承認後だけ購買担当が購入": [
            "F10",
            "F11"
          ],
          "却下時は購入しない": [
            "F11"
          ],
          "金額分岐以外の承認条件は同じ": [
            "F5"
          ]
        }
      }
    },
    {
      "packet_id": "P052",
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
        "10万円以上は部長承認",
        "10万円未満は課長承認",
        "承認後だけ購買担当が購入",
        "却下時は購入しない",
        "金額分岐以外の承認条件は同じ"
      ],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": null,
      "implementation_viability": "not_executed",
      "needs_raw_check": [],
      "notes": [
        "F2/F3/F8とF5-F7は受領P001のF2/F6/F8/F10/F11を伝達。F1は草案の合意未確認を区別し、F9-F13の具体項目未決を確定期待結果にしない。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {},
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {
          "10万円以上は部長承認": [
            "F2"
          ],
          "10万円未満は課長承認": [
            "F3"
          ],
          "承認後だけ購買担当が購入": [
            "F5",
            "F6"
          ],
          "却下時は購入しない": [
            "F7"
          ],
          "金額分岐以外の承認条件は同じ": [
            "F8"
          ]
        }
      }
    },
    {
      "packet_id": "P053",
      "stage": "s2",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "対象は承認分岐だけ",
        "10万円以上は部長承認",
        "10万円未満は課長承認",
        "承認後だけ購買担当が購入",
        "却下時は購入しない",
        "金額分岐以外の承認条件は同じ"
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
        "F2/F3の承認者条件とF16/F17の承認後購入・却下停止を保持。F4/F5は共通条件の同一性と具体内容の未定義を分け、F7/F8は追加質問なしと合意未確認を分ける。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "対象は承認分岐だけ": [
            "F1"
          ],
          "10万円以上は部長承認": [
            "F3"
          ],
          "10万円未満は課長承認": [
            "F2"
          ],
          "承認後だけ購買担当が購入": [
            "F16"
          ],
          "却下時は購入しない": [
            "F17"
          ],
          "金額分岐以外の承認条件は同じ": [
            "F4"
          ]
        },
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P054",
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
        "10万円以上は部長承認",
        "10万円未満は課長承認",
        "承認後だけ購買担当が購入",
        "却下時は購入しない",
        "金額分岐以外の承認条件は同じ"
      ],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": null,
      "implementation_viability": "not_executed",
      "needs_raw_check": [
        "F18-F22の高額フローと課長画面の食い違いは実受領H054のF29/F30にもある。参照先の原文行はこの抽出から確認できず局所確認が必要。"
      ],
      "notes": [
        "F2/F3/F4/F7/F8で分岐、共通条件、承認後購入・却下停止を伝達。F13/F15/F17/F23は判定基準等を未決として保持。購入結果記録F9は実受領H054のF14に既存で、probe独自発明ではない。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {},
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {
          "10万円以上は部長承認": [
            "F2"
          ],
          "10万円未満は課長承認": [
            "F3"
          ],
          "承認後だけ購買担当が購入": [
            "F8"
          ],
          "却下時は購入しない": [
            "F7"
          ],
          "金額分岐以外の承認条件は同じ": [
            "F4"
          ]
        }
      }
    },
    {
      "packet_id": "P056",
      "stage": "s2",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "10万円以上は部長承認",
        "10万円未満は課長承認",
        "承認後だけ購買担当が購入",
        "却下時は購入しない",
        "金額分岐以外の承認条件は同じ"
      ],
      "answer_facts_preserved": [],
      "unauthorized_decisions": [
        {
          "meaning": "購買担当による部長・課長への審査回付と承認待ち管理を確定する。",
          "evidence_ids": [
            "F3",
            "F4"
          ]
        },
        {
          "meaning": "承認・却下結果記録と状態遷移を必須化する。",
          "evidence_ids": [
            "F6",
            "F7",
            "F14"
          ]
        },
        {
          "meaning": "購入結果記録と購入済み終端状態を業務規則化する。",
          "evidence_ids": [
            "F10",
            "F11"
          ]
        }
      ],
      "unsupported_additions": [
        {
          "meaning": "回付・承認待ち・結果記録を追加する。",
          "evidence_ids": [
            "F3",
            "F4",
            "F6",
            "F7"
          ]
        },
        {
          "meaning": "購入記録と購入済み状態を追加する。",
          "evidence_ids": [
            "F10",
            "F11"
          ]
        },
        {
          "meaning": "画面・データ属性・関連を具体的要求として追加する。",
          "evidence_ids": [
            "F15",
            "F16",
            "F17",
            "F18",
            "F20",
            "F21",
            "F22",
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
        "F27の高額フローと課長画面の関連はF1と矛盾し、局所原文を確認。"
      ],
      "notes": [
        "F1/F2/F5/F8/F9は分岐、共通条件、承認後購入・却下停止を保持。F3/F4/F6/F10の回付・記録過程はF12の対象限定を超えてasserted化。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "10万円以上は部長承認": [
            "F1"
          ],
          "10万円未満は課長承認": [
            "F2"
          ],
          "承認後だけ購買担当が購入": [
            "F8"
          ],
          "却下時は購入しない": [
            "F9"
          ],
          "金額分岐以外の承認条件は同じ": [
            "F5"
          ]
        },
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {}
      }
    }
  ],
  "limits": [
    "C4のcritical_unknownsおよびanswer_factsは空のため、unknown recallとquestion actionabilityはN/Aであり0件を品質0に換算しない。",
    "全12 packetのcanonicalが利用可能。Stage3発明比較はP015←P053、P052←P001、P050←H050、P054←H054の実受領canonicalに基づく。P008/P056のfull Stage2だけをP050/P054への受領根拠にしていない。",
    "canonical抽出だけの独立評価であり、P008の単語引用、局所配置矛盾、およびP054の参照先原文などはneeds_raw_checkに残した。",
    "unauthorized_decisionsとunsupported_additionsは重なりがあり、同じ追加業務命題は内数として示す。両件数を合算しない。"
  ]
}
