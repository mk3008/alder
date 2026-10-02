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
      "unsupported_additions": [
        {
          "meaning": "日数の起点・端数、制限の通知等を追加で必須確認する範囲拡張。",
          "evidence_ids": [
            "F19",
            "Q2",
            "F13",
            "Q6"
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
        "F7/F9で二軸を活動入力と判断材料に接続し、F17/F18とQ1で重複を未決とした。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {
          "C1-U1": [
            "F10",
            "F20",
            "Q3"
          ],
          "C1-U2": [
            "F17",
            "F18",
            "Q1"
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
            "F18"
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
      "unsupported_additions": [
        {
          "meaning": "結果伝達・記録方法等を追加で必須確認する範囲拡張。",
          "evidence_ids": [
            "F18",
            "Q7"
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
        "F3/F4は区分重複が許否を一意にできない関係を明示し、F15は判断手順を草案扱いにしている。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {
          "C1-U1": [
            "F5",
            "Q3"
          ],
          "C1-U2": [
            "F3",
            "F24",
            "Q1"
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
            "F24"
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
      "unauthorized_decisions": [
        {
          "meaning": "未決基準に当たると貸出判定を保留し制限状態を不変にする運用を確定する。",
          "evidence_ids": [
            "F8",
            "F9",
            "F42",
            "F51"
          ]
        },
        {
          "meaning": "会員登録と新規会員の貸出可能初期状態を確定する。",
          "evidence_ids": [
            "F25",
            "F27",
            "F55"
          ]
        },
        {
          "meaning": "蔵書登録と貸出可能初期状態を確定する。",
          "evidence_ids": [
            "F29",
            "F30",
            "F58"
          ]
        },
        {
          "meaning": "返却照合、遅延記録、蔵書状態復帰と再貸出を確定する。",
          "evidence_ids": [
            "F15",
            "F17",
            "F18"
          ]
        },
        {
          "meaning": "返却済記録も制限判定の照会・日数算定へ含む。",
          "evidence_ids": [
            "F19",
            "F20"
          ]
        },
        {
          "meaning": "貸出制限状態の開始・解除遷移を業務規則とする。",
          "evidence_ids": [
            "F22",
            "F23"
          ]
        }
      ],
      "unsupported_additions": [
        {
          "meaning": "未承認の登録・貸出・返却フローと担当責任を要求化する。",
          "evidence_ids": [
            "F10",
            "F13",
            "F15",
            "F25",
            "F29",
            "F35",
            "F36",
            "F37"
          ]
        },
        {
          "meaning": "未承認の詳細データ属性と画面群を要求化する。",
          "evidence_ids": [
            "F32",
            "F33",
            "F34",
            "F40",
            "F41",
            "F45",
            "F49",
            "F55",
            "F58"
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
        "F19/F20の返却済記録を判定へ用いる範囲は、局所引用でも記録照会と算定の接続が曖昧。"
      ],
      "notes": [
        "F2/F5は二軸と種別を保持し、F4/F6は許否表を未決とする。一方F8/F9など局所運用は確定形。"
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
        "actionable_unknown_ids": {
          "C1-U1": [
            "F6"
          ],
          "C1-U2": [
            "F4"
          ]
        },
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
      "unauthorized_decisions": [
        {
          "meaning": "返却済記録の日数を次回の貸出可否へ引き継ぐ。",
          "evidence_ids": [
            "F14",
            "F23"
          ]
        },
        {
          "meaning": "基準未確定時に貸出処理を保留し進めない。",
          "evidence_ids": [
            "F16",
            "F18"
          ]
        },
        {
          "meaning": "貸出直前の再照合と状態変化時の再判定を義務付ける。",
          "evidence_ids": [
            "F19"
          ]
        },
        {
          "meaning": "会員登録、蔵書登録・補正、貸出返却の業務フローを確定する。",
          "evidence_ids": [
            "F8",
            "F10",
            "F11",
            "F20",
            "F22",
            "F24"
          ]
        },
        {
          "meaning": "会員の制限状態を管理し、開始・解除基準で遷移させる。",
          "evidence_ids": [
            "F25"
          ]
        }
      ],
      "unsupported_additions": [
        {
          "meaning": "未承認の担当・画面・情報属性を要求化する。",
          "evidence_ids": [
            "F8",
            "F10",
            "F27",
            "F28",
            "F29",
            "F30",
            "F31",
            "F32",
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
        "返却済記録利用と複数記録未決は併存する。具体的な選択規則まではF14/F23から補わない。"
      ],
      "notes": [
        "F4/F7は二つの未決を分離。F14/F23は返却済履歴を次回判定へ接続し、F15は複数記録の選び方を未決に保つ。"
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
        "actionable_unknown_ids": {
          "C1-U1": [
            "F7"
          ],
          "C1-U2": [
            "F4"
          ]
        },
        "source_facts_preserved": {
          "蔵書の貸出": [
            "F1"
          ],
          "返却遅延による貸出制限": [
            "F5",
            "F6"
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
      "packet_id": "P005",
      "stage": "s2",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "蔵書の貸出",
        "返却遅延による貸出制限",
        "判断材料は遅延日数と会員種別",
        "大人と子供の2種別",
        "3日未満・7日未満・7日以上の候補"
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
          "meaning": "返却済記録を貸出判定から除外し未返却だけを対象にする。",
          "evidence_ids": [
            "F2",
            "F4",
            "F31"
          ]
        },
        {
          "meaning": "会員登録・蔵書登録の責任と初期状態を定める。",
          "evidence_ids": [
            "F10",
            "F11",
            "F13",
            "F14",
            "F16"
          ]
        },
        {
          "meaning": "未返却記録の期限から区分を更新し返却後に残存分を再計算する状態運用を定める。",
          "evidence_ids": [
            "F26",
            "F27",
            "F33",
            "F34",
            "F35",
            "F36"
          ]
        }
      ],
      "unsupported_additions": [
        {
          "meaning": "未承認の登録・返却活動と画面、データ属性を追加要求する。",
          "evidence_ids": [
            "F29",
            "F30",
            "F38",
            "F39",
            "F40",
            "F43",
            "F54"
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
        "F2/F4の未返却限定は局所では確定形だが原sourceの含意範囲は争点として残る。"
      ],
      "notes": [
        "F6-F9は排他的区分と大人・子供の閾値を保持。F55/F56は表のコンテキスト配置の記述であり、業務所有権の確定とは読まない。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "蔵書の貸出": [
            "F18",
            "F25"
          ],
          "返却遅延による貸出制限": [
            "F2",
            "F8"
          ],
          "判断材料は遅延日数と会員種別": [
            "F2",
            "F20"
          ],
          "大人と子供の2種別": [
            "F1"
          ],
          "3日未満・7日未満・7日以上の候補": [
            "F6"
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
      "packet_id": "P019",
      "stage": "s2",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "蔵書の貸出",
        "返却遅延による貸出制限",
        "判断材料は遅延日数と会員種別",
        "大人と子供の2種別",
        "3日未満・7日未満・7日以上の候補"
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
        "F7の判断結果をF17の貸出入力へ渡す活動間連続性を保持。担当者の特定・同一性はF21/F22で未決。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "蔵書の貸出": [
            "F5",
            "F16",
            "F18"
          ],
          "返却遅延による貸出制限": [
            "F6",
            "F15"
          ],
          "判断材料は遅延日数と会員種別": [
            "F2",
            "F7"
          ],
          "大人と子供の2種別": [
            "F3"
          ],
          "3日未満・7日未満・7日以上の候補": [
            "F4"
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
        "大人と子供の2種別",
        "3日未満・7日未満・7日以上の候補"
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
        "F11-F19で排他的区分から許否、貸出実行まで連続している。F6/Q1/Q2は担当責任を未決に保つ。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "蔵書の貸出": [
            "F1",
            "F4",
            "F19"
          ],
          "返却遅延による貸出制限": [
            "F4",
            "F12"
          ],
          "判断材料は遅延日数と会員種別": [
            "F8",
            "F12"
          ],
          "大人と子供の2種別": [
            "F8"
          ],
          "3日未満・7日未満・7日以上の候補": [
            "F11"
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
      "packet_id": "P029",
      "stage": "s2",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "蔵書の貸出",
        "返却遅延による貸出制限",
        "判断材料は遅延日数と会員種別",
        "大人と子供の2種別",
        "3日未満・7日未満・7日以上の候補"
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
          "meaning": "新規会員の遅延区分を0日以上3日未満に初期化する。",
          "evidence_ids": [
            "F7"
          ]
        },
        {
          "meaning": "会員登録と蔵書登録を担当付き業務として確定する。",
          "evidence_ids": [
            "F6",
            "F8"
          ]
        },
        {
          "meaning": "未返却のみから遅延日数を算出し会員区分を状態更新する。",
          "evidence_ids": [
            "F9",
            "F10",
            "F11",
            "F12",
            "F13"
          ]
        },
        {
          "meaning": "返却後の残存貸出に応じ会員区分を更新する。",
          "evidence_ids": [
            "F19",
            "F20",
            "F21"
          ]
        }
      ],
      "unsupported_additions": [
        {
          "meaning": "未承認の画面と詳細情報属性を要求化する。",
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
      "needs_raw_check": [
        "F19-F21の残存貸出再評価は確定形。代表値の選択規則までは記述から補えない。"
      ],
      "notes": [
        "F3-F5は回答の境界・種別別閾値を保持。F19-F21は返却後再評価を条件付きで断定するが、複数記録の集約規則を明記しない。F2/F3等に試験範囲外の条件を除く明示は見当たらない。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "蔵書の貸出": [
            "F1",
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
          ],
          "3日未満・7日未満・7日以上の候補": [
            "F3"
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
        "F1-F11は判断二軸から可否、蔵書貸出へ接続。F12-F18は上流P019の担当・受渡し未決を維持。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {},
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {
          "蔵書の貸出": [
            "F9",
            "F10"
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
        "F1-F12は判断から蔵書貸出の結果へ連続し、F14-F21は上流P025の担当・通知未決を維持。"
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
          "meaning": "上流で確定した未返却限定・返却後再計算等の追加運用を伝達する。",
          "evidence_ids": [
            "F8",
            "F21",
            "F22"
          ]
        }
      ],
      "unsupported_additions": [
        {
          "meaning": "上流の登録・返却フローと画面群を下流へ要求として伝える。",
          "evidence_ids": [
            "F1",
            "F6",
            "F19",
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
        "F34/F35は実受領本文の状態・画面記載に由来し、上流の不整合として記録。"
      ],
      "notes": [
        "H046 F17-F23の受領範囲に沿ってF8-F12が判定軸を保持。F34/F35の不整合は実受領H046の記載同士を突き合わせたものでprobe独自発明ではない。"
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
            "F11",
            "F12"
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
          "meaning": "上流受領にある新規会員区分の初期化、会員区分更新等の未承認運用を伝達する。",
          "evidence_ids": [
            "F4",
            "F21",
            "F22"
          ]
        }
      ],
      "unsupported_additions": [
        {
          "meaning": "受領にない追加受付条件の確認を必須の人間入力として提示する。",
          "evidence_ids": [
            "F37",
            "Q4"
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
        "F37/Q4は具体的な許否条件を断定しないが、受領外の質問を必須化する範囲は残る。"
      ],
      "notes": [
        "F10-F17は二軸・排他的区分・許否を保持。F4はH060 F13の初期値を伝達した上流誤りでありprobe独自発明ではない。F37/Q4は未決の問いとして提示。"
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
  "raw_check_resolutions": [
    {
      "claim_id": "attempt-001-P035-1",
      "status": "artifact_ambiguous",
      "judgment": "F19は未返却と返却済の照会を明示し、F20は現在日または返却日で貸出ごとの日数を求め制限判定で参照する。しかし返却済み遅延を次回の可否へどう適用するかは直接定めない。",
      "raw_quote_refs": [
        {
          "review_file": "P035-review.json",
          "canonical_id": "F19"
        },
        {
          "review_file": "P035-review.json",
          "canonical_id": "F20"
        }
      ],
      "affected_metrics": [
        "unauthorized_decisions",
        "unsupported_additions"
      ]
    },
    {
      "claim_id": "attempt-001-P038-1",
      "status": "resolved",
      "judgment": "F14/F23は返却日数の次回判定への引継ぎを断定し、F15は複数記録からの選択・算定を未決とする。引継ぎという追加運用は数え、集約規則の創作は数えない。",
      "raw_quote_refs": [
        {
          "review_file": "P038-review.json",
          "canonical_id": "F14"
        },
        {
          "review_file": "P038-review.json",
          "canonical_id": "F23"
        },
        {
          "review_file": "P038-review.json",
          "canonical_id": "F15"
        }
      ],
      "affected_metrics": [
        "unauthorized_decisions"
      ]
    },
    {
      "claim_id": "attempt-001-P005-1",
      "status": "artifact_ambiguous",
      "judgment": "F2とF4は未返却限定および返却済除外を局所的に断定する。原sourceの返却遅延という語がこの対象集合を必然的に限定するかは資料だけでは確定しない。",
      "raw_quote_refs": [
        {
          "review_file": "P005-review.json",
          "canonical_id": "F2"
        },
        {
          "review_file": "P005-review.json",
          "canonical_id": "F4"
        }
      ],
      "affected_metrics": [
        "unauthorized_decisions",
        "unsupported_additions"
      ]
    },
    {
      "claim_id": "attempt-001-P046-1",
      "status": "resolved",
      "judgment": "F34は3日だけの説明と7日の画面・状態表の不一致、F35は初回一律区分と計算別三区分の不一致を指す。実受領H046に両記載があり、probe独自の規則ではない。",
      "raw_quote_refs": [
        {
          "review_file": "P046-review.json",
          "canonical_id": "F34"
        },
        {
          "review_file": "P046-review.json",
          "canonical_id": "F35"
        }
      ],
      "affected_metrics": [
        "probe_inventions"
      ]
    },
    {
      "claim_id": "attempt-001-P060-1",
      "status": "resolved",
      "judgment": "F37/Q4は具体的な受付規則を確定せず、受領の貸出可能状態からは追加条件の必須確認までは導けない。範囲外の問いとして区別し、業務規則の独自発明には数えない。",
      "raw_quote_refs": [
        {
          "review_file": "P060-review.json",
          "canonical_id": "F37"
        },
        {
          "review_file": "P060-review.json",
          "canonical_id": "Q4"
        }
      ],
      "affected_metrics": [
        "unsupported_additions",
        "probe_inventions"
      ]
    },
    {
      "claim_id": "attempt-002-P005-1",
      "status": "resolved",
      "judgment": "F55/F56は状態モデル表・情報表の配置の記述であり、文書コンテキスト配置を業務上の所有権や必須アーキテクチャとして命じる引用ではない。",
      "raw_quote_refs": [
        {
          "review_file": "P005-review.json",
          "canonical_id": "F55"
        },
        {
          "review_file": "P005-review.json",
          "canonical_id": "F56"
        }
      ],
      "affected_metrics": [
        "unauthorized_decisions",
        "unsupported_additions"
      ]
    },
    {
      "claim_id": "attempt-002-P019-1",
      "status": "resolved",
      "judgment": "F7/F17は局所手順として担当者を呼称するが、担当の特定が未確認と明記される。仮の呼称による責任確定違反にはしない。",
      "raw_quote_refs": [
        {
          "review_file": "P019-review.json",
          "canonical_id": "F7"
        },
        {
          "review_file": "P019-review.json",
          "canonical_id": "F17"
        }
      ],
      "affected_metrics": [
        "unauthorized_decisions"
      ]
    },
    {
      "claim_id": "attempt-002-P029-1",
      "status": "artifact_ambiguous",
      "judgment": "F19-F21は返却後の区分遷移条件を確定形で記すが、複数の未返却貸出から代表日数を選ぶ規則は示されない。遷移運用の追加は数え、代表値選択の内容は確定できない。",
      "raw_quote_refs": [
        {
          "review_file": "P029-review.json",
          "canonical_id": "F19"
        },
        {
          "review_file": "P029-review.json",
          "canonical_id": "F20"
        },
        {
          "review_file": "P029-review.json",
          "canonical_id": "F21"
        }
      ],
      "affected_metrics": [
        "unauthorized_decisions",
        "unsupported_additions"
      ]
    },
    {
      "claim_id": "attempt-002-P046-1",
      "status": "resolved",
      "judgment": "F35の初回一律区分と計算値別分類は実受領H046の状態表と条件に双方存在し、probeによる独自仕様化ではなく上流内の不一致の指摘。",
      "raw_quote_refs": [
        {
          "review_file": "P046-review.json",
          "canonical_id": "F35"
        }
      ],
      "affected_metrics": [
        "probe_inventions"
      ]
    },
    {
      "claim_id": "attempt-002-P060-1",
      "status": "resolved",
      "judgment": "F4の新規会員の初期区分は実受領H060の会員登録と状態遷移に由来する。原sourceにない上流決定の伝達として扱い、probe独自発明にはしない。",
      "raw_quote_refs": [
        {
          "review_file": "P060-review.json",
          "canonical_id": "F4"
        }
      ],
      "affected_metrics": [
        "unauthorized_decisions",
        "probe_inventions"
      ]
    }
  ],
  "limits": [
    "利用可能なcanonical 12件を独立採点し、unavailableはpacket-index上0件。",
    "Stage1には回答後の事実を採点せず、Stage2には未決recallやStage3 downstream coverageを適用しない。C5補助観測は本caseに適用しない。",
    "raw reviewは局所引用による補足であり、原sourceとcanonical以上の判定不能箇所はartifact_ambiguousとして保持。",
    "P046/P060のprobe独自発明はfull Stage2ではなく、それぞれ実受領H046/H060を基準にした。"
  ]
}
