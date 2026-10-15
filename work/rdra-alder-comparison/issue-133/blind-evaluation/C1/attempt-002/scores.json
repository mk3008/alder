{
  "case_id": "C1",
  "scores": [
    {
      "packet_id": "P003",
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
        "蔵書の貸出",
        "返却遅延による貸出制限",
        "判断材料は遅延日数と会員種別",
        "大人と子供の2種別",
        "0以上3未満・3以上7未満・7以上の排他的3区分",
        "大人は3日未満可",
        "大人は3日以上7日未満不可",
        "大人は7日以上不可",
        "子供は3日未満可",
        "子供は3日以上7日未満可",
        "子供は7日以上不可"
      ],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": null,
      "implementation_viability": "not_executed",
      "needs_raw_check": [],
      "notes": [
        "F1-F11で種別・区分・許否から貸出実行まで連続し、F12-F18は責任・算出を未確認のまま残す。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {},
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {
          "蔵書の貸出": [
            "F1"
          ],
          "返却遅延による貸出制限": [
            "F1"
          ],
          "判断材料は遅延日数と会員種別": [
            "F1"
          ],
          "大人と子供の2種別": [
            "F1"
          ],
          "0以上3未満・3以上7未満・7以上の排他的3区分": [
            "F2"
          ],
          "大人は3日未満可": [
            "F3"
          ],
          "大人は3日以上7日未満不可": [
            "F4"
          ],
          "大人は7日以上不可": [
            "F5"
          ],
          "子供は3日未満可": [
            "F6"
          ],
          "子供は3日以上7日未満可": [
            "F7"
          ],
          "子供は7日以上不可": [
            "F8"
          ]
        }
      }
    },
    {
      "packet_id": "P005",
      "stage": "s2",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "蔵書の貸出",
        "返却遅延による貸出制限",
        "判断材料は遅延日数と会員種別",
        "大人と子供の2種別"
      ],
      "answer_facts_preserved": [
        "0以上3未満・3以上7未満・7以上の排他的3区分",
        "大人は3日未満可",
        "大人は3日以上7日未満不可",
        "大人は7日以上不可",
        "子供は3日未満可",
        "子供は3日以上7日未満可",
        "子供は7日以上不可",
        "他の貸出条件は試験範囲外"
      ],
      "unauthorized_decisions": [
        {
          "meaning": "未返却記録のみを判定対象とし、返却済記録を排除する",
          "evidence_ids": [
            "F4",
            "F19",
            "F31"
          ]
        },
        {
          "meaning": "司書の分業と担当責任を確定する",
          "evidence_ids": [
            "F11",
            "F14",
            "F19",
            "F21",
            "F29"
          ]
        },
        {
          "meaning": "蔵書と貸出の登録・返却・状態更新を業務要件化する",
          "evidence_ids": [
            "F16",
            "F22",
            "F23",
            "F24",
            "F29",
            "F31",
            "F32"
          ]
        },
        {
          "meaning": "3日・7日到達時に区分を更新する運用を確定する",
          "evidence_ids": [
            "F26",
            "F27"
          ]
        },
        {
          "meaning": "複数記録が残る返却後の区分再計算を確定する",
          "evidence_ids": [
            "F33",
            "F34",
            "F35",
            "F36"
          ]
        }
      ],
      "unsupported_additions": [
        {
          "meaning": "会員登録・蔵書登録・返却とその画面群を追加する",
          "evidence_ids": [
            "F10",
            "F13",
            "F14",
            "F15",
            "F28",
            "F29",
            "F43",
            "F54",
            "F57"
          ]
        },
        {
          "meaning": "貸出情報の属性と返却期限記録を要求する",
          "evidence_ids": [
            "F22",
            "F38",
            "F39",
            "F40"
          ]
        },
        {
          "meaning": "未返却記録と返却期限に基づく算定と運用を追加する",
          "evidence_ids": [
            "F4",
            "F5",
            "F19",
            "F26",
            "F27",
            "F33"
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
        "F55-F56の文書構造上の配置が実際の業務要件として要求されたか、canonicalだけでは曖昧。"
      ],
      "notes": [
        "F6-F9は回答の排他的区分と種別別許否を保持。F4-F5、F10-F57は試験範囲外の具体的運用を多数確定する。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "蔵書の貸出": [
            "F22",
            "F25"
          ],
          "返却遅延による貸出制限": [
            "F2"
          ],
          "判断材料は遅延日数と会員種別": [
            "F2"
          ],
          "大人と子供の2種別": [
            "F1"
          ]
        },
        "answer_facts_preserved": {
          "0以上3未満・3以上7未満・7以上の排他的3区分": [
            "F6"
          ],
          "大人は3日未満可": [
            "F8"
          ],
          "大人は3日以上7日未満不可": [
            "F8"
          ],
          "大人は7日以上不可": [
            "F8"
          ],
          "子供は3日未満可": [
            "F9"
          ],
          "子供は3日以上7日未満可": [
            "F9"
          ],
          "子供は7日以上不可": [
            "F9"
          ],
          "他の貸出条件は試験範囲外": [
            "F3"
          ]
        },
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P007",
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
        "蔵書の貸出",
        "返却遅延による貸出制限",
        "判断材料は遅延日数と会員種別",
        "大人と子供の2種別",
        "0以上3未満・3以上7未満・7以上の排他的3区分",
        "大人は3日未満可",
        "大人は3日以上7日未満不可",
        "大人は7日以上不可",
        "子供は3日未満可",
        "子供は3日以上7日未満可",
        "子供は7日以上不可"
      ],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": null,
      "implementation_viability": "not_executed",
      "needs_raw_check": [],
      "notes": [
        "F3-F11は境界・判定表と貸出結果を一続きに伝え、F14-F21で責任や記録の未確認を維持。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {},
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {
          "蔵書の貸出": [
            "F1"
          ],
          "返却遅延による貸出制限": [
            "F1"
          ],
          "判断材料は遅延日数と会員種別": [
            "F1"
          ],
          "大人と子供の2種別": [
            "F1"
          ],
          "0以上3未満・3以上7未満・7以上の排他的3区分": [
            "F3"
          ],
          "大人は3日未満可": [
            "F4"
          ],
          "大人は3日以上7日未満不可": [
            "F5"
          ],
          "大人は7日以上不可": [
            "F6"
          ],
          "子供は3日未満可": [
            "F7"
          ],
          "子供は3日以上7日未満可": [
            "F8"
          ],
          "子供は7日以上不可": [
            "F9"
          ]
        }
      }
    },
    {
      "packet_id": "P019",
      "stage": "s2",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "蔵書の貸出",
        "返却遅延による貸出制限",
        "判断材料は遅延日数と会員種別",
        "大人と子供の2種別"
      ],
      "answer_facts_preserved": [
        "0以上3未満・3以上7未満・7以上の排他的3区分",
        "大人は3日未満可",
        "大人は3日以上7日未満不可",
        "大人は7日以上不可",
        "子供は3日未満可",
        "子供は3日以上7日未満可",
        "子供は7日以上不可",
        "他の貸出条件は試験範囲外"
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
      "needs_raw_check": [
        "F7/F17の「担当者」は未確認の役割名を便宜的に使うのか、責任の確定なのか曖昧。"
      ],
      "notes": [
        "F7-F18は貸出可否の判断結果を貸出活動の入力へ渡す連続性を保持。F21-F25は担当・引継ぎ・日数算出を未確認とする。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "蔵書の貸出": [
            "F5"
          ],
          "返却遅延による貸出制限": [
            "F6"
          ],
          "判断材料は遅延日数と会員種別": [
            "F7"
          ],
          "大人と子供の2種別": [
            "F3"
          ]
        },
        "answer_facts_preserved": {
          "0以上3未満・3以上7未満・7以上の排他的3区分": [
            "F4"
          ],
          "大人は3日未満可": [
            "F8"
          ],
          "大人は3日以上7日未満不可": [
            "F9"
          ],
          "大人は7日以上不可": [
            "F10"
          ],
          "子供は3日未満可": [
            "F11"
          ],
          "子供は3日以上7日未満可": [
            "F12"
          ],
          "子供は7日以上不可": [
            "F13"
          ],
          "他の貸出条件は試験範囲外": [
            "F2"
          ]
        },
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P025",
      "stage": "s2",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "蔵書の貸出",
        "返却遅延による貸出制限",
        "判断材料は遅延日数と会員種別",
        "大人と子供の2種別"
      ],
      "answer_facts_preserved": [
        "0以上3未満・3以上7未満・7以上の排他的3区分",
        "大人は3日未満可",
        "大人は3日以上7日未満不可",
        "大人は7日以上不可",
        "子供は3日未満可",
        "子供は3日以上7日未満可",
        "子供は7日以上不可",
        "他の貸出条件は試験範囲外"
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
        "F11-F19が回答の六つの許否セルと貸出結果を保持し、F6/F21/F23は担当・算出・通知を未確認に留める。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "蔵書の貸出": [
            "F1"
          ],
          "返却遅延による貸出制限": [
            "F1"
          ],
          "判断材料は遅延日数と会員種別": [
            "F8"
          ],
          "大人と子供の2種別": [
            "F8",
            "F13",
            "F16"
          ]
        },
        "answer_facts_preserved": {
          "0以上3未満・3以上7未満・7以上の排他的3区分": [
            "F11"
          ],
          "大人は3日未満可": [
            "F13"
          ],
          "大人は3日以上7日未満不可": [
            "F14"
          ],
          "大人は7日以上不可": [
            "F15"
          ],
          "子供は3日未満可": [
            "F16"
          ],
          "子供は3日以上7日未満可": [
            "F17"
          ],
          "子供は7日以上不可": [
            "F18"
          ],
          "他の貸出条件は試験範囲外": [
            "F2"
          ]
        },
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P028",
      "stage": "s1",
      "unknown_ids_found": [
        "C1-U1",
        "C1-U2"
      ],
      "actionable_unknown_ids": [
        "C1-U1",
        "C1-U2"
      ],
      "source_facts_preserved": [
        "蔵書の貸出",
        "返却遅延による貸出制限",
        "判断材料は遅延日数と会員種別",
        "大人と子供の2種別",
        "3日未満・7日未満・7日以上の候補"
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
        "F17-F18/Q1は候補の重複を見つけ排他的解釈を確認し、F20/Q3は大人・子供別の許否を尋ねる。",
        "質問数の有無ではなく、C1-U1/C1-U2への具体的対応で評価。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {
          "C1-U1": [
            "F10",
            "F20"
          ],
          "C1-U2": [
            "F17",
            "F18"
          ]
        },
        "actionable_unknown_ids": {
          "C1-U1": [
            "Q3"
          ],
          "C1-U2": [
            "Q1"
          ]
        },
        "source_facts_preserved": {
          "蔵書の貸出": [
            "F1"
          ],
          "返却遅延による貸出制限": [
            "F1"
          ],
          "判断材料は遅延日数と会員種別": [
            "F7"
          ],
          "大人と子供の2種別": [
            "F7"
          ],
          "3日未満・7日未満・7日以上の候補": [
            "F17"
          ]
        },
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P029",
      "stage": "s2",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "蔵書の貸出",
        "返却遅延による貸出制限",
        "判断材料は遅延日数と会員種別",
        "大人と子供の2種別"
      ],
      "answer_facts_preserved": [
        "0以上3未満・3以上7未満・7以上の排他的3区分",
        "大人は3日未満可",
        "大人は3日以上7日未満不可",
        "大人は7日以上不可",
        "子供は3日未満可",
        "子供は3日以上7日未満可",
        "子供は7日以上不可"
      ],
      "unauthorized_decisions": [
        {
          "meaning": "会員登録と新規会員の遅延区分初期値を決定する",
          "evidence_ids": [
            "F6",
            "F7"
          ]
        },
        {
          "meaning": "蔵書登録と初期貸出可能状態を決定する",
          "evidence_ids": [
            "F8"
          ]
        },
        {
          "meaning": "未返却貸出の遅延区分更新と返却後の再計算を決定する",
          "evidence_ids": [
            "F10",
            "F11",
            "F12",
            "F13",
            "F19",
            "F20",
            "F21"
          ]
        },
        {
          "meaning": "貸出記録と状態遷移・返却処理を決定する",
          "evidence_ids": [
            "F15",
            "F16",
            "F17",
            "F18",
            "F22",
            "F23"
          ]
        }
      ],
      "unsupported_additions": [
        {
          "meaning": "会員・蔵書登録、貸出・返却フローおよび画面を追加する",
          "evidence_ids": [
            "F6",
            "F8",
            "F17",
            "F27",
            "F28",
            "F29",
            "F30",
            "F32",
            "F35"
          ]
        },
        {
          "meaning": "会員・蔵書・貸出情報の属性を規定する",
          "evidence_ids": [
            "F24",
            "F25",
            "F26"
          ]
        },
        {
          "meaning": "未返却貸出からの遅延算出・区分更新を導入する",
          "evidence_ids": [
            "F10",
            "F11",
            "F12",
            "F13"
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
        "F19-F21は複数貸出の代表値選択を含意する可能性があるが、集約規則はcanonicalで明示されない。"
      ],
      "notes": [
        "F3-F5は回答の排他区分と大人/子供別許否を保持。F6-F35では会員登録から返却までの追加運用を確定。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "蔵書の貸出": [
            "F15"
          ],
          "返却遅延による貸出制限": [
            "F1"
          ],
          "判断材料は遅延日数と会員種別": [
            "F1"
          ],
          "大人と子供の2種別": [
            "F2"
          ]
        },
        "answer_facts_preserved": {
          "0以上3未満・3以上7未満・7以上の排他的3区分": [
            "F3"
          ],
          "大人は3日未満可": [
            "F4"
          ],
          "大人は3日以上7日未満不可": [
            "F4"
          ],
          "大人は7日以上不可": [
            "F4"
          ],
          "子供は3日未満可": [
            "F5"
          ],
          "子供は3日以上7日未満可": [
            "F5"
          ],
          "子供は7日以上不可": [
            "F5"
          ]
        },
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P035",
      "stage": "s1",
      "unknown_ids_found": [
        "C1-U1",
        "C1-U2"
      ],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "蔵書の貸出",
        "返却遅延による貸出制限",
        "判断材料は遅延日数と会員種別",
        "大人と子供の2種別",
        "3日未満・7日未満・7日以上の候補"
      ],
      "answer_facts_preserved": [],
      "unauthorized_decisions": [
        {
          "meaning": "基準未確定時は貸出判定・制限状態変更を保留する運用を確定する",
          "evidence_ids": [
            "F8",
            "F9"
          ]
        },
        {
          "meaning": "会員・蔵書の登録、返却、状態遷移と担当を確定する",
          "evidence_ids": [
            "F10",
            "F13",
            "F14",
            "F15",
            "F17",
            "F18",
            "F25",
            "F30",
            "F35"
          ]
        },
        {
          "meaning": "未返却・返却済み双方の履歴を遅延判定対象にする",
          "evidence_ids": [
            "F19",
            "F20"
          ]
        },
        {
          "meaning": "制限状態の開始・解除を管理する",
          "evidence_ids": [
            "F22",
            "F23"
          ]
        }
      ],
      "unsupported_additions": [
        {
          "meaning": "会員登録・蔵書管理・返却業務と画面群を要求する",
          "evidence_ids": [
            "F25",
            "F30",
            "F40",
            "F59"
          ]
        },
        {
          "meaning": "貸出記録・返却期限・状態管理を要求する",
          "evidence_ids": [
            "F14",
            "F17",
            "F32",
            "F34"
          ]
        },
        {
          "meaning": "独自の保留および制限状態の運用を要求する",
          "evidence_ids": [
            "F8",
            "F9",
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
      "needs_raw_check": [],
      "notes": [
        "F4/F6は二つの未決を分け、追加Human inputでも具体化。明示的なQ項目はない。F8-F59の保留・登録・返却運用は局所的に確定している。",
        "質問数の有無ではなく、C1-U1/C1-U2への具体的対応で評価。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {
          "C1-U1": [
            "F6"
          ],
          "C1-U2": [
            "F4"
          ]
        },
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "蔵書の貸出": [
            "F1"
          ],
          "返却遅延による貸出制限": [
            "F2"
          ],
          "判断材料は遅延日数と会員種別": [
            "F2"
          ],
          "大人と子供の2種別": [
            "F5"
          ],
          "3日未満・7日未満・7日以上の候補": [
            "F3"
          ]
        },
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P038",
      "stage": "s1",
      "unknown_ids_found": [
        "C1-U1",
        "C1-U2"
      ],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "蔵書の貸出",
        "返却遅延による貸出制限",
        "判断材料は遅延日数と会員種別",
        "大人と子供の2種別",
        "3日未満・7日未満・7日以上の候補"
      ],
      "answer_facts_preserved": [],
      "unauthorized_decisions": [
        {
          "meaning": "会員・蔵書登録と返却処理を確定する",
          "evidence_ids": [
            "F8",
            "F10",
            "F20",
            "F22",
            "F23",
            "F24"
          ]
        },
        {
          "meaning": "返却済記録の遅延日数を次回判定に引き継ぐ",
          "evidence_ids": [
            "F14",
            "F23"
          ]
        },
        {
          "meaning": "期限超過時の貸出状態と制限状態の管理を確定する",
          "evidence_ids": [
            "F21",
            "F25"
          ]
        },
        {
          "meaning": "基準未確定の判定保留と再照合を運用にする",
          "evidence_ids": [
            "F16",
            "F18",
            "F19"
          ]
        }
      ],
      "unsupported_additions": [
        {
          "meaning": "会員・蔵書登録、貸出・返却の業務と画面群を追加する",
          "evidence_ids": [
            "F8",
            "F10",
            "F22",
            "F29",
            "F30"
          ]
        },
        {
          "meaning": "貸出・返却記録と状態・属性を要求する",
          "evidence_ids": [
            "F20",
            "F21",
            "F24",
            "F27",
            "F28"
          ]
        },
        {
          "meaning": "保留・再判定・制限状態の運用を要求する",
          "evidence_ids": [
            "F16",
            "F18",
            "F19",
            "F25",
            "F31",
            "F33"
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
      "needs_raw_check": [],
      "notes": [
        "F4/F7は重複区分と許否を未決のまま識別する。明示的なQ項目はない。F14/F23の返却履歴を次回判定へ使う規則は上流から導けない。",
        "質問数の有無ではなく、C1-U1/C1-U2への具体的対応で評価。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {
          "C1-U1": [
            "F7"
          ],
          "C1-U2": [
            "F4"
          ]
        },
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "蔵書の貸出": [
            "F1"
          ],
          "返却遅延による貸出制限": [
            "F5"
          ],
          "判断材料は遅延日数と会員種別": [
            "F6"
          ],
          "大人と子供の2種別": [
            "F2"
          ],
          "3日未満・7日未満・7日以上の候補": [
            "F3"
          ]
        },
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P046",
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
        "蔵書の貸出",
        "返却遅延による貸出制限",
        "判断材料は遅延日数と会員種別",
        "大人と子供の2種別",
        "0以上3未満・3以上7未満・7以上の排他的3区分",
        "大人は3日未満可",
        "大人は3日以上7日未満不可",
        "大人は7日以上不可",
        "子供は3日未満可",
        "子供は3日以上7日未満可",
        "子供は7日以上不可"
      ],
      "probe_inventions": [
        {
          "meaning": "初回の遅延区分遷移先を一律0日以上3日未満とする状態表を記述する",
          "evidence_ids": [
            "F35"
          ]
        }
      ],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": null,
      "implementation_viability": "not_executed",
      "needs_raw_check": [
        "F35が上流P005の未抽出の状態表を引用している可能性があり、probe独自性の最終確認にはrawが要る。"
      ],
      "notes": [
        "F8-F22は上流P005の登録・返却運用も伝達する。F27-F32の未定義論点は期待結果として確定せず、F35の初回一律区分はP005に明示されない。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {},
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {
          "蔵書の貸出": [
            "F15",
            "F16"
          ],
          "返却遅延による貸出制限": [
            "F8"
          ],
          "判断材料は遅延日数と会員種別": [
            "F8"
          ],
          "大人と子供の2種別": [
            "F1"
          ],
          "0以上3未満・3以上7未満・7以上の排他的3区分": [
            "F9"
          ],
          "大人は3日未満可": [
            "F11"
          ],
          "大人は3日以上7日未満不可": [
            "F11"
          ],
          "大人は7日以上不可": [
            "F11"
          ],
          "子供は3日未満可": [
            "F12"
          ],
          "子供は3日以上7日未満可": [
            "F12"
          ],
          "子供は7日以上不可": [
            "F12"
          ]
        }
      }
    },
    {
      "packet_id": "P048",
      "stage": "s1",
      "unknown_ids_found": [
        "C1-U1",
        "C1-U2"
      ],
      "actionable_unknown_ids": [
        "C1-U1",
        "C1-U2"
      ],
      "source_facts_preserved": [
        "蔵書の貸出",
        "返却遅延による貸出制限",
        "判断材料は遅延日数と会員種別",
        "大人と子供の2種別",
        "3日未満・7日未満・7日以上の候補"
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
        "F3/F24・Q1は重複区分を、F5・Q3は種別別許否を未決として特定。F2/F15の役割や手順は仮置き。",
        "質問数の有無ではなく、C1-U1/C1-U2への具体的対応で評価。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {
          "C1-U1": [
            "F5"
          ],
          "C1-U2": [
            "F3",
            "F24"
          ]
        },
        "actionable_unknown_ids": {
          "C1-U1": [
            "Q3"
          ],
          "C1-U2": [
            "Q1",
            "Q2"
          ]
        },
        "source_facts_preserved": {
          "蔵書の貸出": [
            "F1"
          ],
          "返却遅延による貸出制限": [
            "F1"
          ],
          "判断材料は遅延日数と会員種別": [
            "F12"
          ],
          "大人と子供の2種別": [
            "F12"
          ],
          "3日未満・7日未満・7日以上の候補": [
            "F3"
          ]
        },
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P060",
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
        "蔵書の貸出",
        "返却遅延による貸出制限",
        "判断材料は遅延日数と会員種別",
        "大人と子供の2種別",
        "0以上3未満・3以上7未満・7以上の排他的3区分",
        "大人は3日未満可",
        "大人は3日以上7日未満不可",
        "大人は7日以上不可",
        "子供は3日未満可",
        "子供は3日以上7日未満可",
        "子供は7日以上不可"
      ],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": null,
      "implementation_viability": "not_executed",
      "needs_raw_check": [
        "F4の新規会員区分初期化はP029 F7に由来するが、未返却がない時の区分を決める妥当性は原資料で要確認。"
      ],
      "notes": [
        "F10-F20は境界・六セル・貸出可否を伝え、F33-F38は上流P029の複数記録や算定の欠落を未決として露出する。F39-F43は資料内の説明・配置の不一致。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {},
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {
          "蔵書の貸出": [
            "F19",
            "F20"
          ],
          "返却遅延による貸出制限": [
            "F9"
          ],
          "判断材料は遅延日数と会員種別": [
            "F9"
          ],
          "大人と子供の2種別": [
            "F1"
          ],
          "0以上3未満・3以上7未満・7以上の排他的3区分": [
            "F10"
          ],
          "大人は3日未満可": [
            "F12"
          ],
          "大人は3日以上7日未満不可": [
            "F13"
          ],
          "大人は7日以上不可": [
            "F14"
          ],
          "子供は3日未満可": [
            "F15"
          ],
          "子供は3日以上7日未満可": [
            "F16"
          ],
          "子供は7日以上不可": [
            "F17"
          ]
        }
      }
    }
  ],
  "limits": [
    "匿名canonicalのみを採点し、rawの局所文脈と抽出網羅性は未監査。needs_raw_checkに明記した曖昧さを確定値へ変換しない。",
    "全12 packetは利用可能。C4 correct stop、C5専用項目は本caseでは適用外。implementation_viabilityは全行not_executed。",
    "Stage3の上流追加事項は対応するStage2からの伝達として扱い、probe_inventionsへ重複計上しない。"
  ]
}
