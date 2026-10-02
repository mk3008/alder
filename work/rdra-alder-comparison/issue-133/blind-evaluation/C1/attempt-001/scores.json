{
  "case_id": "C1",
  "scores": [
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
        "F10/F20とQ3は許否を未決のまま具体化し、F17/F18とQ1は重複と排他的区分案を区別する。",
        "F22は判断担当と結果の受け渡しという活動間の連続性を未確認として残す。"
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
            "F1",
            "F2"
          ],
          "返却遅延による貸出制限": [
            "F1",
            "F9"
          ],
          "判断材料は遅延日数と会員種別": [
            "F7",
            "F9"
          ],
          "大人と子供の2種別": [
            "F7"
          ],
          "3日未満・7日未満・7日以上の候補": [
            "F17",
            "F18",
            "Q1"
          ]
        },
        "answer_facts_preserved": {},
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
          "meaning": "基準未確定時は貸出判定を保留し会員の制限状態を変更しないという運用規則。",
          "evidence_ids": [
            "F8",
            "F9"
          ]
        },
        {
          "meaning": "貸出・返却の登録、状態遷移、通知と担当責任を確定。",
          "evidence_ids": [
            "F10",
            "F11",
            "F12",
            "F13",
            "F14",
            "F15",
            "F16",
            "F17",
            "F18",
            "F21",
            "F22",
            "F23",
            "F24",
            "F35",
            "F36",
            "F37"
          ]
        },
        {
          "meaning": "返却済み記録も遅延判定に使い、期限・現在日／返却日から日数を計算する規則。",
          "evidence_ids": [
            "F19",
            "F20"
          ]
        },
        {
          "meaning": "新規会員・蔵書を貸出可能状態で開始する規則。",
          "evidence_ids": [
            "F27",
            "F30"
          ]
        },
        {
          "meaning": "登録内容の不足・重複の確認と修正、情報更新の必須業務。",
          "evidence_ids": [
            "F25",
            "F26",
            "F28",
            "F29",
            "F31"
          ]
        }
      ],
      "unsupported_additions": [
        {
          "meaning": "基準未確定時は貸出判定を保留し会員の制限状態を変更しないという運用規則。（unauthorized内数）",
          "evidence_ids": [
            "F8",
            "F9"
          ]
        },
        {
          "meaning": "貸出・返却の登録、状態遷移、通知と担当責任を確定。（unauthorized内数）",
          "evidence_ids": [
            "F10",
            "F11",
            "F12",
            "F13",
            "F14",
            "F15",
            "F16",
            "F17",
            "F18",
            "F21",
            "F22",
            "F23",
            "F24",
            "F35",
            "F36",
            "F37"
          ]
        },
        {
          "meaning": "返却済み記録も遅延判定に使い、期限・現在日／返却日から日数を計算する規則。（unauthorized内数）",
          "evidence_ids": [
            "F19",
            "F20"
          ]
        },
        {
          "meaning": "新規会員・蔵書を貸出可能状態で開始する規則。（unauthorized内数）",
          "evidence_ids": [
            "F27",
            "F30"
          ]
        },
        {
          "meaning": "登録内容の不足・重複の確認と修正、情報更新の必須業務。（unauthorized内数）",
          "evidence_ids": [
            "F25",
            "F26",
            "F28",
            "F29",
            "F31"
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
        "F19/F20の返却済み遅延を次回判定へ適用する範囲はcanonicalでは断定困難。"
      ],
      "notes": [
        "F3/F4/F6は二つの重要未決を保持する。追加Human inputは具体的だがcanonical質問IDがなく、actionabilityは確認できない。",
        "F8/F9は未確定時の取扱いを局所的に確定する。F25-F59の業務・画面群はsource外の拡張。"
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
            "F1",
            "F2"
          ],
          "判断材料は遅延日数と会員種別": [
            "F2"
          ],
          "大人と子供の2種別": [
            "F5"
          ],
          "3日未満・7日未満・7日以上の候補": [
            "F3",
            "F4"
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
          "meaning": "返却済み貸出の遅延記録を次回貸出判定に引き継ぐ規則。",
          "evidence_ids": [
            "F14",
            "F23"
          ]
        },
        {
          "meaning": "会員・蔵書の登録、訂正、状態管理とその担当責任を確定。",
          "evidence_ids": [
            "F8",
            "F9",
            "F10",
            "F11",
            "F12",
            "F20",
            "F22",
            "F24",
            "F27",
            "F28",
            "F29"
          ]
        },
        {
          "meaning": "不一致なら貸出直前に再照合・再判定し、保留時は進めない運用。",
          "evidence_ids": [
            "F18",
            "F19"
          ]
        },
        {
          "meaning": "期限超過時の貸出状態変更と会員の貸出制限状態開始・解除を規定。",
          "evidence_ids": [
            "F21",
            "F25",
            "F32"
          ]
        },
        {
          "meaning": "画面群と状態・情報属性を必須のシステム化対象として規定。",
          "evidence_ids": [
            "F27",
            "F28",
            "F29",
            "F30",
            "F31",
            "F33"
          ]
        }
      ],
      "unsupported_additions": [
        {
          "meaning": "返却済み貸出の遅延記録を次回貸出判定に引き継ぐ規則。（unauthorized内数）",
          "evidence_ids": [
            "F14",
            "F23"
          ]
        },
        {
          "meaning": "会員・蔵書の登録、訂正、状態管理とその担当責任を確定。（unauthorized内数）",
          "evidence_ids": [
            "F8",
            "F9",
            "F10",
            "F11",
            "F12",
            "F20",
            "F22",
            "F24",
            "F27",
            "F28",
            "F29"
          ]
        },
        {
          "meaning": "不一致なら貸出直前に再照合・再判定し、保留時は進めない運用。（unauthorized内数）",
          "evidence_ids": [
            "F18",
            "F19"
          ]
        },
        {
          "meaning": "期限超過時の貸出状態変更と会員の貸出制限状態開始・解除を規定。（unauthorized内数）",
          "evidence_ids": [
            "F21",
            "F25",
            "F32"
          ]
        },
        {
          "meaning": "画面群と状態・情報属性を必須のシステム化対象として規定。（unauthorized内数）",
          "evidence_ids": [
            "F27",
            "F28",
            "F29",
            "F30",
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
      "needs_raw_check": [
        "F14/F23の返却済み遅延の次回利用とF15の複数記録未決との整合はrawで要確認。"
      ],
      "notes": [
        "F3/F4/F7は候補境界と許否を未決として保持。具体的質問IDがなくactionabilityは計上しない。",
        "F14/F23は返却済み記録の後続判定への利用という独立した追加規則。"
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
            "F2",
            "F6"
          ],
          "大人と子供の2種別": [
            "F2"
          ],
          "3日未満・7日未満・7日以上の候補": [
            "F3",
            "F4"
          ]
        },
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {}
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
        "F3/F24とQ1は候補区分の重なりを特定し、Q3は種別×区分の貸出許否を尋ねる。",
        "F2/F9/F10/F13/F18は役割、開始契機、受け渡し先を仮置き・未確認にとどめる。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {
          "C1-U1": [
            "F5"
          ],
          "C1-U2": [
            "F3",
            "F4",
            "F23",
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
            "F1",
            "F8"
          ],
          "返却遅延による貸出制限": [
            "F1",
            "F8"
          ],
          "判断材料は遅延日数と会員種別": [
            "F12"
          ],
          "大人と子供の2種別": [
            "F12"
          ],
          "3日未満・7日未満・7日以上の候補": [
            "F3",
            "F24",
            "Q3"
          ]
        },
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {}
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
      "needs_raw_check": [],
      "notes": [
        "F4とF8-F13が排他的境界および六つの組合せを保持し、F15-F18が判断から貸出への条件付き連続性を示す。",
        "F21-F25は担当と受渡し・計算時点を未確認のまま維持する。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "蔵書の貸出": [
            "F5",
            "F18"
          ],
          "返却遅延による貸出制限": [
            "F6",
            "F7"
          ],
          "判断材料は遅延日数と会員種別": [
            "F2",
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
        "F11-F19は排他的三区分と許否六セルを保持する。F6/F21/F23は担当・算出・通知を未確認として残す。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "蔵書の貸出": [
            "F1",
            "F9"
          ],
          "返却遅延による貸出制限": [
            "F4"
          ],
          "判断材料は遅延日数と会員種別": [
            "F8",
            "F12"
          ],
          "大人と子供の2種別": [
            "F8"
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
          "meaning": "未返却の貸出記録だけを貸出判定に使い返却済み記録を除く。",
          "evidence_ids": [
            "F2",
            "F4",
            "F23",
            "F31"
          ]
        },
        {
          "meaning": "未返却記録の返却期限から遅延日数を求める。",
          "evidence_ids": [
            "F5",
            "F19",
            "F20"
          ]
        },
        {
          "meaning": "会員登録の申出・確認・修正案内と登録責任を確定。",
          "evidence_ids": [
            "F10",
            "F11",
            "F12",
            "F13"
          ]
        },
        {
          "meaning": "蔵書の識別・登録・更新と初期貸出可能状態を確定。",
          "evidence_ids": [
            "F14",
            "F15",
            "F16",
            "F17"
          ]
        },
        {
          "meaning": "貸出不可の理由通知、許可時の期限付き記録・蔵書状態遷移・引渡しを確定。",
          "evidence_ids": [
            "F21",
            "F22",
            "F23",
            "F24",
            "F25"
          ]
        },
        {
          "meaning": "3日・7日到達時に区分状態を更新する運用を確定。",
          "evidence_ids": [
            "F26",
            "F27"
          ]
        },
        {
          "meaning": "返却照合・不一致時保留・返却済記録・蔵書状態復帰を確定。",
          "evidence_ids": [
            "F28",
            "F29",
            "F30",
            "F31",
            "F32"
          ]
        },
        {
          "meaning": "返却後の残存貸出に基づく区分再計算・下降遷移を確定。",
          "evidence_ids": [
            "F33",
            "F34",
            "F35",
            "F36"
          ]
        },
        {
          "meaning": "役割・属性・画面・管理フローを必須構造として拡張。",
          "evidence_ids": [
            "F38",
            "F39",
            "F40",
            "F41",
            "F42",
            "F43",
            "F44",
            "F45",
            "F46",
            "F47",
            "F48",
            "F49",
            "F50",
            "F51",
            "F52",
            "F53",
            "F54",
            "F57"
          ]
        }
      ],
      "unsupported_additions": [
        {
          "meaning": "未返却の貸出記録だけを貸出判定に使い返却済み記録を除く。（unauthorized内数）",
          "evidence_ids": [
            "F2",
            "F4",
            "F23",
            "F31"
          ]
        },
        {
          "meaning": "未返却記録の返却期限から遅延日数を求める。（unauthorized内数）",
          "evidence_ids": [
            "F5",
            "F19",
            "F20"
          ]
        },
        {
          "meaning": "会員登録の申出・確認・修正案内と登録責任を確定。（unauthorized内数）",
          "evidence_ids": [
            "F10",
            "F11",
            "F12",
            "F13"
          ]
        },
        {
          "meaning": "蔵書の識別・登録・更新と初期貸出可能状態を確定。（unauthorized内数）",
          "evidence_ids": [
            "F14",
            "F15",
            "F16",
            "F17"
          ]
        },
        {
          "meaning": "貸出不可の理由通知、許可時の期限付き記録・蔵書状態遷移・引渡しを確定。（unauthorized内数）",
          "evidence_ids": [
            "F21",
            "F22",
            "F23",
            "F24",
            "F25"
          ]
        },
        {
          "meaning": "3日・7日到達時に区分状態を更新する運用を確定。（unauthorized内数）",
          "evidence_ids": [
            "F26",
            "F27"
          ]
        },
        {
          "meaning": "返却照合・不一致時保留・返却済記録・蔵書状態復帰を確定。（unauthorized内数）",
          "evidence_ids": [
            "F28",
            "F29",
            "F30",
            "F31",
            "F32"
          ]
        },
        {
          "meaning": "返却後の残存貸出に基づく区分再計算・下降遷移を確定。（unauthorized内数）",
          "evidence_ids": [
            "F33",
            "F34",
            "F35",
            "F36"
          ]
        },
        {
          "meaning": "役割・属性・画面・管理フローを必須構造として拡張。（unauthorized内数）",
          "evidence_ids": [
            "F38",
            "F39",
            "F40",
            "F41",
            "F42",
            "F43",
            "F44",
            "F45",
            "F46",
            "F47",
            "F48",
            "F49",
            "F50",
            "F51",
            "F52",
            "F53",
            "F54",
            "F57"
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
        "F2/F4の未返却限定が原資料の前提から自然に含意されるかはrawで要確認。"
      ],
      "notes": [
        "F6-F9は固定回答の境界と成人・子供の許否を保持する。",
        "F19-F36は登録→判定→貸出→返却→再評価の連続性を示すが、その運用規則は固定回答からは導けない。"
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
            "F2",
            "F20"
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
            "F6",
            "F7"
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
          "meaning": "新規会員の返却遅延区分を0日以上3日未満に初期化する。",
          "evidence_ids": [
            "F7"
          ]
        },
        {
          "meaning": "会員登録の申出・訂正・一意登録と蔵書現物登録を必須化。",
          "evidence_ids": [
            "F6",
            "F8"
          ]
        },
        {
          "meaning": "未返却貸出から会員区分を算出する運用を確定。",
          "evidence_ids": [
            "F9",
            "F10"
          ]
        },
        {
          "meaning": "3日・7日到達・飛び越し時の会員区分の状態更新を確定。",
          "evidence_ids": [
            "F11",
            "F12",
            "F13"
          ]
        },
        {
          "meaning": "貸出不可時の通知、可の場合の貸出記録と蔵書・貸出状態変更を確定。",
          "evidence_ids": [
            "F14",
            "F15",
            "F16"
          ]
        },
        {
          "meaning": "返却照合・不一致時の照会・返却日記録と蔵書状態復帰を確定。",
          "evidence_ids": [
            "F17",
            "F18",
            "F22",
            "F23"
          ]
        },
        {
          "meaning": "返却後の残存貸出による区分再評価・下降遷移を確定。",
          "evidence_ids": [
            "F19",
            "F20",
            "F21"
          ]
        },
        {
          "meaning": "会員・蔵書・貸出の属性、画面群を必須構造として追加。",
          "evidence_ids": [
            "F24",
            "F25",
            "F26",
            "F27",
            "F28",
            "F29",
            "F30",
            "F31",
            "F32",
            "F33",
            "F34",
            "F35"
          ]
        }
      ],
      "unsupported_additions": [
        {
          "meaning": "新規会員の返却遅延区分を0日以上3日未満に初期化する。（unauthorized内数）",
          "evidence_ids": [
            "F7"
          ]
        },
        {
          "meaning": "会員登録の申出・訂正・一意登録と蔵書現物登録を必須化。（unauthorized内数）",
          "evidence_ids": [
            "F6",
            "F8"
          ]
        },
        {
          "meaning": "未返却貸出から会員区分を算出する運用を確定。（unauthorized内数）",
          "evidence_ids": [
            "F9",
            "F10"
          ]
        },
        {
          "meaning": "3日・7日到達・飛び越し時の会員区分の状態更新を確定。（unauthorized内数）",
          "evidence_ids": [
            "F11",
            "F12",
            "F13"
          ]
        },
        {
          "meaning": "貸出不可時の通知、可の場合の貸出記録と蔵書・貸出状態変更を確定。（unauthorized内数）",
          "evidence_ids": [
            "F14",
            "F15",
            "F16"
          ]
        },
        {
          "meaning": "返却照合・不一致時の照会・返却日記録と蔵書状態復帰を確定。（unauthorized内数）",
          "evidence_ids": [
            "F17",
            "F18",
            "F22",
            "F23"
          ]
        },
        {
          "meaning": "返却後の残存貸出による区分再評価・下降遷移を確定。（unauthorized内数）",
          "evidence_ids": [
            "F19",
            "F20",
            "F21"
          ]
        },
        {
          "meaning": "会員・蔵書・貸出の属性、画面群を必須構造として追加。（unauthorized内数）",
          "evidence_ids": [
            "F24",
            "F25",
            "F26",
            "F27",
            "F28",
            "F29",
            "F30",
            "F31",
            "F32",
            "F33",
            "F34",
            "F35"
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
        "F3-F5は固定回答の境界と許否を保持するが、他の貸出条件が試験範囲外との限定は明示されない。",
        "F7の初期化は無遅延／記録なしの場合を確定する追加規則で、F10の複数記録の集約則は未定義。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "蔵書の貸出": [
            "F15"
          ],
          "返却遅延による貸出制限": [
            "F1",
            "F14"
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
        "F1-F11は判断条件、排他的境界、六セル、可の場合の貸出と不可の場合の非貸出を活動間で連続して伝える。",
        "F12-F18は担当・判断情報の出所・算出時点を未確認として維持する。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {},
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {
          "蔵書の貸出": [
            "F1",
            "F9"
          ],
          "返却遅延による貸出制限": [
            "F1",
            "F11"
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
        "F3-F11は境界と六セルの許否から貸出結果への連続性を保持。",
        "F14-F21は仮称の担当と算出・結果伝達を未決として維持する。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {},
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {
          "蔵書の貸出": [
            "F1",
            "F10"
          ],
          "返却遅延による貸出制限": [
            "F1",
            "F11"
          ],
          "判断材料は遅延日数と会員種別": [
            "F1",
            "F2"
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
      "packet_id": "P046",
      "stage": "s3",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [],
      "answer_facts_preserved": [],
      "unauthorized_decisions": [
        {
          "meaning": "未返却記録のみを判定対象とし返却済み記録を除外する上流規則の伝達。",
          "evidence_ids": [
            "F8",
            "F21"
          ]
        },
        {
          "meaning": "会員・蔵書の登録と担当、初期貸出可能状態を業務要件として伝達。",
          "evidence_ids": [
            "F1",
            "F2",
            "F3",
            "F6"
          ]
        },
        {
          "meaning": "不可時の理由通知、期限付き貸出記録、状態変更と引渡しの上流規則を伝達。",
          "evidence_ids": [
            "F14",
            "F15",
            "F16"
          ]
        },
        {
          "meaning": "3日・7日到達時の区分状態更新と返却後の再計算という上流規則を伝達。",
          "evidence_ids": [
            "F17",
            "F18",
            "F21",
            "F22"
          ]
        }
      ],
      "unsupported_additions": [
        {
          "meaning": "未返却記録のみを判定対象とし返却済み記録を除外する上流規則の伝達。（unauthorized内数）",
          "evidence_ids": [
            "F8",
            "F21"
          ]
        },
        {
          "meaning": "会員・蔵書の登録と担当、初期貸出可能状態を業務要件として伝達。（unauthorized内数）",
          "evidence_ids": [
            "F1",
            "F2",
            "F3",
            "F6"
          ]
        },
        {
          "meaning": "不可時の理由通知、期限付き貸出記録、状態変更と引渡しの上流規則を伝達。（unauthorized内数）",
          "evidence_ids": [
            "F14",
            "F15",
            "F16"
          ]
        },
        {
          "meaning": "3日・7日到達時の区分状態更新と返却後の再計算という上流規則を伝達。（unauthorized内数）",
          "evidence_ids": [
            "F17",
            "F18",
            "F21",
            "F22"
          ]
        }
      ],
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
        "F34/F35が上流の状態モデルの説明かprobe独自の仕様化か、引用元の文脈をrawで要確認。"
      ],
      "notes": [
        "F8-F16は固定の判断条件・境界・許否を伝える。",
        "F27-F32は複数記録の集約や日数計算の不足を識別し、F34-F39は上流資料内の表記不一致を追跡する。",
        "追加された会員・蔵書登録、状態更新、返却業務は対応するP005の上流追加事項が伝達されたもので、probe独自発明に数えない。"
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
            "F8",
            "F14"
          ],
          "判断材料は遅延日数と会員種別": [
            "F8"
          ],
          "大人と子供の2種別": [
            "F1",
            "F8"
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
      "packet_id": "P060",
      "stage": "s3",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [],
      "answer_facts_preserved": [],
      "unauthorized_decisions": [
        {
          "meaning": "新規会員の返却遅延区分を0日以上3日未満で初期化する上流規則の伝達。",
          "evidence_ids": [
            "F4",
            "F5"
          ]
        },
        {
          "meaning": "会員・蔵書登録、初期貸出可能状態と担当業務の上流規則を伝達。",
          "evidence_ids": [
            "F1",
            "F2",
            "F3",
            "F6",
            "F7"
          ]
        },
        {
          "meaning": "未返却貸出から会員区分を更新・再評価する上流規則を伝達。",
          "evidence_ids": [
            "F9",
            "F21",
            "F22",
            "F23",
            "F24",
            "F25",
            "F26"
          ]
        },
        {
          "meaning": "不可時の通知、期限付き貸出記録、状態変更と返却業務の上流規則を伝達。",
          "evidence_ids": [
            "F18",
            "F19",
            "F20",
            "F28",
            "F29",
            "F30"
          ]
        }
      ],
      "unsupported_additions": [
        {
          "meaning": "新規会員の返却遅延区分を0日以上3日未満で初期化する上流規則の伝達。（unauthorized内数）",
          "evidence_ids": [
            "F4",
            "F5"
          ]
        },
        {
          "meaning": "会員・蔵書登録、初期貸出可能状態と担当業務の上流規則を伝達。（unauthorized内数）",
          "evidence_ids": [
            "F1",
            "F2",
            "F3",
            "F6",
            "F7"
          ]
        },
        {
          "meaning": "未返却貸出から会員区分を更新・再評価する上流規則を伝達。（unauthorized内数）",
          "evidence_ids": [
            "F9",
            "F21",
            "F22",
            "F23",
            "F24",
            "F25",
            "F26"
          ]
        },
        {
          "meaning": "不可時の通知、期限付き貸出記録、状態変更と返却業務の上流規則を伝達。（unauthorized内数）",
          "evidence_ids": [
            "F18",
            "F19",
            "F20",
            "F28",
            "F29",
            "F30"
          ]
        },
        {
          "meaning": "貸出可能な蔵書だけを判定・記録対象にする追加条件を必須の確認事項とする。",
          "evidence_ids": [
            "F37",
            "Q4"
          ]
        }
      ],
      "unresolved_leakage": [],
      "redundant_questions": [
        {
          "meaning": "固定回答が対象外とした他の貸出条件について、貸出可能な蔵書だけを対象とする追加条件を必須確認する。",
          "evidence_ids": [
            "Q4",
            "F37"
          ]
        }
      ],
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
        "F37/Q4の追加受付条件は上流F8の貸出可能状態と一部隣接するため、境界外の必須質問かrawで要確認。"
      ],
      "notes": [
        "F9-F20は固定の判断材料・境界・六セルと条件付き貸出を伝える。",
        "F33-F38は複数未返却記録、日数計算、更新契機の未定義を区別する。",
        "追加された会員・蔵書登録、状態更新、返却業務は対応するP029の上流追加事項が伝達されたもので、probe独自発明に数えない。",
        "F37/Q4は未承認の業務規則を確定せず、対象外の追加条件を必須確認する質問であるためprobe inventionには数えない。"
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
            "F9",
            "F18"
          ],
          "判断材料は遅延日数と会員種別": [
            "F9",
            "F10"
          ],
          "大人と子供の2種別": [
            "F1",
            "F3",
            "F9"
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
    "匿名canonical抽出のみで採点し、raw成果物の原文と行番号への独立照合は未実施。曖昧な含意はneeds_raw_checkに残した。",
    "全12 packetが利用可能であり、unavailableを0点補完した行はない。",
    "Stage1で質問IDのない具体的additional_human_inputsはquestion actionabilityの根拠にせず、発見自体はfact IDで計上した。"
  ]
}
