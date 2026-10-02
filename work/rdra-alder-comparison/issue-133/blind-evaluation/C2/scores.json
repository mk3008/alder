{
  "case_id": "C2",
  "scores": [
    {
      "packet_id": "P002",
      "stage": "s2",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "社員が空室検索する",
        "社員が予約する",
        "時間重複は予約不可",
        "予約後の時間変更可",
        "取消可",
        "管理者が利用停止にできる"
      ],
      "answer_facts_preserved": [
        "停止中は検索非表示",
        "停止中は新規予約不可",
        "停止中は変更先にできない",
        "停止前の既存予約を維持し利用可",
        "取消期限なし・当日取消可",
        "取消時間帯は直ちに空室検索対象になる",
        "取消時間帯は直ちに新規予約対象になる"
      ],
      "unauthorized_decisions": [],
      "unsupported_additions": [
        {
          "meaning": "会議室の所在地・設備・利用時刻等を属性として確定",
          "evidence_ids": [
            "F23"
          ]
        },
        {
          "meaning": "予約日時・取消日時を属性として確定",
          "evidence_ids": [
            "F24"
          ]
        },
        {
          "meaning": "社員の所属・連絡先を属性として確定",
          "evidence_ids": [
            "F25"
          ]
        },
        {
          "meaning": "利用管理者の施設管理部門への所属を確定",
          "evidence_ids": [
            "F27"
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
        "F23-F25の属性列挙は局所的にassertedだが必須実装項目への昇格範囲はartifact_ambiguous。"
      ],
      "notes": [
        "F1,F3,F7,F11,F15が検索から予約・変更・取消・停止の活動を連結し、F16-F19が停止の四つの帰結を保持。",
        "F13,F14は取消直後の検索と新規予約を分けて保持。",
        "同時要求の未決はF1-F27に明示されず、answer coverageから除外。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "社員が空室検索する": [
            "F1"
          ],
          "社員が予約する": [
            "F3",
            "F4"
          ],
          "時間重複は予約不可": [
            "F4"
          ],
          "予約後の時間変更可": [
            "F7",
            "F8"
          ],
          "取消可": [
            "F11"
          ],
          "管理者が利用停止にできる": [
            "F15"
          ]
        },
        "answer_facts_preserved": {
          "停止中は検索非表示": [
            "F16"
          ],
          "停止中は新規予約不可": [
            "F17"
          ],
          "停止中は変更先にできない": [
            "F18"
          ],
          "停止前の既存予約を維持し利用可": [
            "F19",
            "F20"
          ],
          "取消期限なし・当日取消可": [
            "F11"
          ],
          "取消時間帯は直ちに空室検索対象になる": [
            "F13"
          ],
          "取消時間帯は直ちに新規予約対象になる": [
            "F14"
          ]
        },
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P006",
      "stage": "s1",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "社員が空室検索する",
        "社員が予約する",
        "時間重複は予約不可",
        "予約後の時間変更可",
        "取消可",
        "管理者が利用停止にできる"
      ],
      "answer_facts_preserved": [],
      "unauthorized_decisions": [
        {
          "meaning": "利用停止中の会議室を空室検索候補から除外と確定",
          "evidence_ids": [
            "F18"
          ]
        },
        {
          "meaning": "利用停止中の会議室を新規予約の対象外と確定",
          "evidence_ids": [
            "F18"
          ]
        },
        {
          "meaning": "利用停止中の会議室を時間変更先の対象外と確定",
          "evidence_ids": [
            "F18"
          ]
        },
        {
          "meaning": "取消時間帯を再予約可能と確定",
          "evidence_ids": [
            "F15"
          ]
        },
        {
          "meaning": "会議室登録と初期利用可能状態を確定",
          "evidence_ids": [
            "F16"
          ]
        }
      ],
      "unsupported_additions": [
        {
          "meaning": "利用停止中の会議室を空室検索候補から除外と確定（unauthorized内数）",
          "evidence_ids": [
            "F18"
          ]
        },
        {
          "meaning": "利用停止中の会議室を新規予約の対象外と確定（unauthorized内数）",
          "evidence_ids": [
            "F18"
          ]
        },
        {
          "meaning": "利用停止中の会議室を時間変更先の対象外と確定（unauthorized内数）",
          "evidence_ids": [
            "F18"
          ]
        },
        {
          "meaning": "取消時間帯を再予約可能と確定（unauthorized内数）",
          "evidence_ids": [
            "F15"
          ]
        },
        {
          "meaning": "会議室登録と初期利用可能状態を確定（unauthorized内数）",
          "evidence_ids": [
            "F16"
          ]
        },
        {
          "meaning": "会議室、予約、社員の詳細属性と管理権限を追加",
          "evidence_ids": [
            "F21",
            "F22",
            "F23"
          ]
        },
        {
          "meaning": "各活動の画面設置を追加",
          "evidence_ids": [
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
        "F15の再利用に即時性はなく、取消後再利用の確定は認める一方、直ちに再利用という別命題は採点しない。"
      ],
      "notes": [
        "F2,F5,F9,F13,F17が主要活動を保持する。F18は停止の三つの結果を回答前に確定。",
        "F15の非重複・非停止条件は検索・予約可能性を限定するが、即時性を含まない。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "社員が空室検索する": [
            "F2"
          ],
          "社員が予約する": [
            "F5",
            "F6"
          ],
          "時間重複は予約不可": [
            "F7"
          ],
          "予約後の時間変更可": [
            "F9"
          ],
          "取消可": [
            "F13"
          ],
          "管理者が利用停止にできる": [
            "F17"
          ]
        },
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P012",
      "stage": "s1",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "社員が空室検索する",
        "社員が予約する",
        "時間重複は予約不可",
        "予約後の時間変更可",
        "取消可",
        "管理者が利用停止にできる"
      ],
      "answer_facts_preserved": [],
      "unauthorized_decisions": [
        {
          "meaning": "利用停止中の会議室を空室検索候補から除外と確定",
          "evidence_ids": [
            "F12"
          ]
        },
        {
          "meaning": "利用停止中の会議室を新規予約の対象外と確定",
          "evidence_ids": [
            "F15"
          ]
        },
        {
          "meaning": "利用停止中の会議室を時間変更の対象外と確定",
          "evidence_ids": [
            "F21"
          ]
        },
        {
          "meaning": "取消時間帯を再予約可能と確定",
          "evidence_ids": [
            "F25",
            "F26"
          ]
        },
        {
          "meaning": "会議室利用再開と整合性確認を業務活動として確定",
          "evidence_ids": [
            "F29",
            "F30",
            "F31"
          ]
        }
      ],
      "unsupported_additions": [
        {
          "meaning": "利用停止中の会議室を空室検索候補から除外と確定（unauthorized内数）",
          "evidence_ids": [
            "F12"
          ]
        },
        {
          "meaning": "利用停止中の会議室を新規予約の対象外と確定（unauthorized内数）",
          "evidence_ids": [
            "F15"
          ]
        },
        {
          "meaning": "利用停止中の会議室を時間変更の対象外と確定（unauthorized内数）",
          "evidence_ids": [
            "F21"
          ]
        },
        {
          "meaning": "取消時間帯を再予約可能と確定（unauthorized内数）",
          "evidence_ids": [
            "F25",
            "F26"
          ]
        },
        {
          "meaning": "会議室利用再開と整合性確認を業務活動として確定（unauthorized内数）",
          "evidence_ids": [
            "F29",
            "F30",
            "F31"
          ]
        },
        {
          "meaning": "会議室登録・更新活動を追加",
          "evidence_ids": [
            "F4",
            "F5"
          ]
        },
        {
          "meaning": "詳細情報属性と複数の画面操作を追加",
          "evidence_ids": [
            "F6",
            "F7",
            "F8",
            "F33",
            "F34",
            "F35",
            "F36",
            "F37",
            "F38",
            "F39"
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
        "F11,F13,F19,F24,F28に活動が連続して記載される。F29-F31はsourceにない利用再開まで確定。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "社員が空室検索する": [
            "F11"
          ],
          "社員が予約する": [
            "F13"
          ],
          "時間重複は予約不可": [
            "F14"
          ],
          "予約後の時間変更可": [
            "F19"
          ],
          "取消可": [
            "F24"
          ],
          "管理者が利用停止にできる": [
            "F28"
          ]
        },
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P022",
      "stage": "s2",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "社員が空室検索する",
        "社員が予約する",
        "時間重複は予約不可",
        "予約後の時間変更可",
        "取消可",
        "管理者が利用停止にできる"
      ],
      "answer_facts_preserved": [
        "停止中は検索非表示",
        "停止中は新規予約不可",
        "停止中は変更先にできない",
        "停止前の既存予約を維持し利用可",
        "取消期限なし・当日取消可",
        "取消時間帯は直ちに空室検索対象になる",
        "取消時間帯は直ちに新規予約対象になる",
        "同時予約保証と順序は未決"
      ],
      "unauthorized_decisions": [],
      "unsupported_additions": [
        {
          "meaning": "会議室登録と初期利用可能状態を追加",
          "evidence_ids": [
            "F20"
          ]
        },
        {
          "meaning": "会議室・予約・社員の詳細属性を追加",
          "evidence_ids": [
            "F24",
            "F25",
            "F26"
          ]
        },
        {
          "meaning": "管理者への登録役割を追加",
          "evidence_ids": [
            "F27"
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
        "F12-F14は取消期限・即時検索・即時予約を保持し、F17-F18は停止と既存予約の境界を保持。F23は同時要求を未決として明示。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "社員が空室検索する": [
            "F1"
          ],
          "社員が予約する": [
            "F3",
            "F4"
          ],
          "時間重複は予約不可": [
            "F5"
          ],
          "予約後の時間変更可": [
            "F8",
            "F9"
          ],
          "取消可": [
            "F12"
          ],
          "管理者が利用停止にできる": [
            "F16"
          ]
        },
        "answer_facts_preserved": {
          "停止中は検索非表示": [
            "F2",
            "F17"
          ],
          "停止中は新規予約不可": [
            "F4",
            "F17"
          ],
          "停止中は変更先にできない": [
            "F9",
            "F17"
          ],
          "停止前の既存予約を維持し利用可": [
            "F18"
          ],
          "取消期限なし・当日取消可": [
            "F12"
          ],
          "取消時間帯は直ちに空室検索対象になる": [
            "F14"
          ],
          "取消時間帯は直ちに新規予約対象になる": [
            "F14"
          ],
          "同時予約保証と順序は未決": [
            "F23"
          ]
        },
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P026",
      "stage": "s1",
      "unknown_ids_found": [
        "C2-U1",
        "C2-U2",
        "C2-U3",
        "C2-U4"
      ],
      "actionable_unknown_ids": [
        "C2-U1",
        "C2-U2",
        "C2-U3",
        "C2-U4"
      ],
      "source_facts_preserved": [
        "社員が空室検索する",
        "社員が予約する",
        "時間重複は予約不可",
        "予約後の時間変更可",
        "取消可",
        "管理者が利用停止にできる"
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
      "needs_raw_check": [
        "Q7は新規予約と時間変更を一文で問うが、両方の扱いを明記し回答によって別々の可否が変わる。詳細条件の不足は残る。"
      ],
      "notes": [
        "F27-F29とQ6-Q8は停止が検索・新規予約・時間変更・既存予約に及ぼす結果を分けて未決にする。",
        "F22-F23,Q4-Q5は取消時間帯の再利用と時点を追加発見する。F8-F9は重複不可の確認済み境界。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {
          "C2-U1": [
            "F27",
            "Q6"
          ],
          "C2-U2": [
            "F28",
            "Q7"
          ],
          "C2-U3": [
            "F28",
            "Q7"
          ],
          "C2-U4": [
            "F29",
            "Q8"
          ]
        },
        "actionable_unknown_ids": {
          "C2-U1": [
            "Q6"
          ],
          "C2-U2": [
            "Q7"
          ],
          "C2-U3": [
            "Q7"
          ],
          "C2-U4": [
            "Q8"
          ]
        },
        "source_facts_preserved": {
          "社員が空室検索する": [
            "F5"
          ],
          "社員が予約する": [
            "F7",
            "F8"
          ],
          "時間重複は予約不可": [
            "F9"
          ],
          "予約後の時間変更可": [
            "F11",
            "F12"
          ],
          "取消可": [
            "F14"
          ],
          "管理者が利用停止にできる": [
            "F16"
          ]
        },
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P027",
      "stage": "s1",
      "unknown_ids_found": [
        "C2-U1",
        "C2-U2",
        "C2-U4"
      ],
      "actionable_unknown_ids": [
        "C2-U1",
        "C2-U2",
        "C2-U4"
      ],
      "source_facts_preserved": [
        "社員が空室検索する",
        "社員が予約する",
        "時間重複は予約不可",
        "予約後の時間変更可",
        "取消可",
        "管理者が利用停止にできる"
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
        "F10,F16,F22とQ2-Q4は停止の検索・新規予約・既存予約への影響を分ける。変更先への影響と同時要求保証は識別されない。",
        "F20,Q5は取消後の予約可否・時点・探索への連続性を問いとして発見。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {
          "C2-U1": [
            "F10",
            "Q2"
          ],
          "C2-U2": [
            "F16",
            "Q3"
          ],
          "C2-U4": [
            "F22",
            "Q4"
          ]
        },
        "actionable_unknown_ids": {
          "C2-U1": [
            "Q2"
          ],
          "C2-U2": [
            "Q3"
          ],
          "C2-U4": [
            "Q4"
          ]
        },
        "source_facts_preserved": {
          "社員が空室検索する": [
            "F8",
            "F9"
          ],
          "社員が予約する": [
            "F11",
            "F13"
          ],
          "時間重複は予約不可": [
            "F12"
          ],
          "予約後の時間変更可": [
            "F14",
            "F17"
          ],
          "取消可": [
            "F14",
            "F19"
          ],
          "管理者が利用停止にできる": [
            "F21"
          ]
        },
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P036",
      "stage": "s2",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "社員が空室検索する",
        "社員が予約する",
        "時間重複は予約不可",
        "予約後の時間変更可",
        "取消可",
        "管理者が利用停止にできる"
      ],
      "answer_facts_preserved": [
        "停止中は検索非表示",
        "停止中は新規予約不可",
        "停止中は変更先にできない",
        "停止前の既存予約を維持し利用可",
        "取消期限なし・当日取消可",
        "取消時間帯は直ちに空室検索対象になる",
        "取消時間帯は直ちに新規予約対象になる",
        "同時予約保証と順序は未決"
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
        "F5,F27-F28が取消から検索・新規予約への連続性を保ち、F9,F19,F30,F31は停止時の許否と既存予約を区別する。",
        "F22-F24,F35は変更時の重複と同時要求を未決に保つ。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "社員が空室検索する": [
            "F7"
          ],
          "社員が予約する": [
            "F10",
            "F12"
          ],
          "時間重複は予約不可": [
            "F13"
          ],
          "予約後の時間変更可": [
            "F15",
            "F17"
          ],
          "取消可": [
            "F25"
          ],
          "管理者が利用停止にできる": [
            "F29"
          ]
        },
        "answer_facts_preserved": {
          "停止中は検索非表示": [
            "F9"
          ],
          "停止中は新規予約不可": [
            "F13",
            "F30"
          ],
          "停止中は変更先にできない": [
            "F19"
          ],
          "停止前の既存予約を維持し利用可": [
            "F31"
          ],
          "取消期限なし・当日取消可": [
            "F26"
          ],
          "取消時間帯は直ちに空室検索対象になる": [
            "F27"
          ],
          "取消時間帯は直ちに新規予約対象になる": [
            "F28"
          ],
          "同時予約保証と順序は未決": [
            "F35"
          ]
        },
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P037",
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
        "社員が空室検索する",
        "社員が予約する",
        "時間重複は予約不可",
        "予約後の時間変更可",
        "取消可",
        "管理者が利用停止にできる",
        "停止中は検索非表示",
        "停止中は新規予約不可",
        "停止中は変更先にできない",
        "停止前の既存予約を維持し利用可",
        "取消期限なし・当日取消可",
        "取消時間帯は直ちに空室検索対象になる",
        "取消時間帯は直ちに新規予約対象になる"
      ],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": null,
      "implementation_viability": "not_executed",
      "needs_raw_check": [],
      "notes": [
        "F3,F8は取消直後の検索と新規予約を別に保持し、F14は停止前予約の利用権を維持。",
        "F15-F21はStage2 P036の未決を期待結果へ昇格せず伝える。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {},
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {
          "社員が空室検索する": [
            "F1"
          ],
          "社員が予約する": [
            "F2",
            "F4"
          ],
          "時間重複は予約不可": [
            "F5"
          ],
          "予約後の時間変更可": [
            "F7",
            "F9",
            "F10"
          ],
          "取消可": [
            "F7",
            "F11",
            "F12"
          ],
          "管理者が利用停止にできる": [
            "F13"
          ],
          "停止中は検索非表示": [
            "F1"
          ],
          "停止中は新規予約不可": [
            "F5"
          ],
          "停止中は変更先にできない": [
            "F9"
          ],
          "停止前の既存予約を維持し利用可": [
            "F14"
          ],
          "取消期限なし・当日取消可": [
            "F11"
          ],
          "取消時間帯は直ちに空室検索対象になる": [
            "F3"
          ],
          "取消時間帯は直ちに新規予約対象になる": [
            "F8"
          ]
        }
      }
    },
    {
      "packet_id": "P043",
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
        "社員が空室検索する",
        "社員が予約する",
        "時間重複は予約不可",
        "予約後の時間変更可",
        "取消可",
        "管理者が利用停止にできる",
        "停止中は検索非表示",
        "停止中は新規予約不可",
        "停止中は変更先にできない",
        "停止前の既存予約を維持し利用可",
        "取消期限なし・当日取消可",
        "取消時間帯は直ちに空室検索対象になる",
        "取消時間帯は直ちに新規予約対象になる"
      ],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": null,
      "implementation_viability": "not_executed",
      "needs_raw_check": [
        "F22の「未決」列挙なしは受領H043に未決の明記がない事実と整合するが、P043本文の局所的なメタ記述であり、対応原文の見え方は限定的。"
      ],
      "notes": [
        "F1-F19は検索、予約、変更、取消、停止と既存予約維持を期待結果に伝える。F15の直後反映は受領H043 F24にある。",
        "F22-F27は未定義事項を確定ルールにしない。H043には同時要求の未決が明記されず、F22をその解決済み宣言とは読まない。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {},
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {
          "社員が空室検索する": [
            "F1",
            "F4"
          ],
          "社員が予約する": [
            "F6",
            "F7"
          ],
          "時間重複は予約不可": [
            "F7"
          ],
          "予約後の時間変更可": [
            "F10",
            "F11"
          ],
          "取消可": [
            "F13",
            "F14"
          ],
          "管理者が利用停止にできる": [
            "F16"
          ],
          "停止中は検索非表示": [
            "F2"
          ],
          "停止中は新規予約不可": [
            "F17"
          ],
          "停止中は変更先にできない": [
            "F11",
            "F17"
          ],
          "停止前の既存予約を維持し利用可": [
            "F18"
          ],
          "取消期限なし・当日取消可": [
            "F13"
          ],
          "取消時間帯は直ちに空室検索対象になる": [
            "F15"
          ],
          "取消時間帯は直ちに新規予約対象になる": [
            "F15"
          ]
        }
      }
    },
    {
      "packet_id": "P044",
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
        "社員が空室検索する",
        "社員が予約する",
        "時間重複は予約不可",
        "予約後の時間変更可",
        "取消可",
        "管理者が利用停止にできる",
        "停止中は検索非表示",
        "停止中は新規予約不可",
        "停止中は変更先にできない",
        "停止前の既存予約を維持し利用可",
        "取消期限なし・当日取消可",
        "取消時間帯は直ちに空室検索対象になる",
        "取消時間帯は直ちに新規予約対象になる"
      ],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": null,
      "implementation_viability": "not_executed",
      "needs_raw_check": [],
      "notes": [
        "F12-F13は当日取消から解放と即時再検索・予約へつなぎ、F17-F18は停止の三つの除外と既存予約維持を分ける。",
        "F22は受領H044 F10にある同時要求保証と処理順序の未決を伝え、実装手段を確定しない。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {},
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {
          "社員が空室検索する": [
            "F1"
          ],
          "社員が予約する": [
            "F5",
            "F7"
          ],
          "時間重複は予約不可": [
            "F6"
          ],
          "予約後の時間変更可": [
            "F8",
            "F9",
            "F11"
          ],
          "取消可": [
            "F12",
            "F13"
          ],
          "管理者が利用停止にできる": [
            "F16"
          ],
          "停止中は検索非表示": [
            "F3"
          ],
          "停止中は新規予約不可": [
            "F6",
            "F17"
          ],
          "停止中は変更先にできない": [
            "F9",
            "F17"
          ],
          "停止前の既存予約を維持し利用可": [
            "F18"
          ],
          "取消期限なし・当日取消可": [
            "F12"
          ],
          "取消時間帯は直ちに空室検索対象になる": [
            "F13"
          ],
          "取消時間帯は直ちに新規予約対象になる": [
            "F13"
          ]
        }
      }
    },
    {
      "packet_id": "P055",
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
        "社員が空室検索する",
        "社員が予約する",
        "時間重複は予約不可",
        "予約後の時間変更可",
        "取消可",
        "管理者が利用停止にできる",
        "停止中は検索非表示",
        "停止中は新規予約不可",
        "停止中は変更先にできない",
        "停止前の既存予約を維持し利用可",
        "取消期限なし・当日取消可",
        "取消時間帯は直ちに空室検索対象になる",
        "取消時間帯は直ちに新規予約対象になる"
      ],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": null,
      "implementation_viability": "not_executed",
      "needs_raw_check": [],
      "notes": [
        "F3,F9,F13,F21,F22が停止の検索・予約・変更先・既存予約を区別し、F4,F11が取消直後の二つの復帰を保持。",
        "F23-F30はStage2 P058の時間変更や同時要求の未決を確定期待結果に変えず伝える。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {},
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {
          "社員が空室検索する": [
            "F1"
          ],
          "社員が予約する": [
            "F2",
            "F5",
            "F6"
          ],
          "時間重複は予約不可": [
            "F9"
          ],
          "予約後の時間変更可": [
            "F12",
            "F14"
          ],
          "取消可": [
            "F16"
          ],
          "管理者が利用停止にできる": [
            "F20"
          ],
          "停止中は検索非表示": [
            "F3"
          ],
          "停止中は新規予約不可": [
            "F9",
            "F21"
          ],
          "停止中は変更先にできない": [
            "F13"
          ],
          "停止前の既存予約を維持し利用可": [
            "F22"
          ],
          "取消期限なし・当日取消可": [
            "F17"
          ],
          "取消時間帯は直ちに空室検索対象になる": [
            "F4"
          ],
          "取消時間帯は直ちに新規予約対象になる": [
            "F11"
          ]
        }
      }
    },
    {
      "packet_id": "P058",
      "stage": "s2",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "社員が空室検索する",
        "社員が予約する",
        "時間重複は予約不可",
        "予約後の時間変更可",
        "取消可",
        "管理者が利用停止にできる"
      ],
      "answer_facts_preserved": [
        "停止中は検索非表示",
        "停止中は新規予約不可",
        "停止中は変更先にできない",
        "停止前の既存予約を維持し利用可",
        "取消期限なし・当日取消可",
        "取消時間帯は直ちに空室検索対象になる",
        "取消時間帯は直ちに新規予約対象になる",
        "同時予約保証と順序は未決"
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
        "F7,F9は取消後の検索と新規予約の即時復帰を保持し、F13,F22,F23は停止後の変更・新規予約と既存予約維持を区別。",
        "F15-F19は変更時の重複、対象者、同時要求の未決を明示する。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "社員が空室検索する": [
            "F5"
          ],
          "社員が予約する": [
            "F5",
            "F8"
          ],
          "時間重複は予約不可": [
            "F10"
          ],
          "予約後の時間変更可": [
            "F12",
            "F14"
          ],
          "取消可": [
            "F20"
          ],
          "管理者が利用停止にできる": [
            "F21"
          ]
        },
        "answer_facts_preserved": {
          "停止中は検索非表示": [
            "F6"
          ],
          "停止中は新規予約不可": [
            "F10",
            "F22"
          ],
          "停止中は変更先にできない": [
            "F13"
          ],
          "停止前の既存予約を維持し利用可": [
            "F23"
          ],
          "取消期限なし・当日取消可": [
            "F20"
          ],
          "取消時間帯は直ちに空室検索対象になる": [
            "F7"
          ],
          "取消時間帯は直ちに新規予約対象になる": [
            "F9"
          ],
          "同時予約保証と順序は未決": [
            "F19"
          ]
        },
        "downstream_facts_preserved": {}
      }
    }
  ],
  "limits": [
    "12 packetを独立に採点。unavailable packetはなく、品質0へのimputationなし。",
    "C2はC4 correct_stop・C5 architecture補助項目の対象外。該当欄はnull/空、implementation_viabilityはnot_executed。",
    "Stage3のprobe_inventionsはP037/P055で一致するStage2、P043はH043、P044はH044の実受領canonicalを比較基準とした。",
    "Stage1のU5は全packetで同時要求時の保証として識別されない。Stage3の同時要求未決は期待結果のdownstream分母に含めない。"
  ],
  "raw_check_resolutions": [
    {
      "claim_id": "attempt-001-P006-1",
      "status": "resolved",
      "judgment": "F15の原文は取消済み時間帯を占有から外し、非重複・非停止を条件に新規予約を受け付ける。即時性は記載されないのでStage1の先取り再利用規則だけを数え、即時反映は追加算入しない。",
      "raw_quote_refs": [
        {
          "review_file": "P006-review.json",
          "canonical_id": "F15"
        }
      ],
      "affected_metrics": [
        "unauthorized_decisions",
        "unsupported_additions"
      ]
    },
    {
      "claim_id": "attempt-001-P026-1",
      "status": "resolved",
      "judgment": "Q7の原文は新規予約と予約時間変更をともに名指しし「どう扱うか」を問う。各回答が許否を変えるためU2とU3の具体質問として認めるが、詳細条件の未指定はneeds_raw_checkに残す。",
      "raw_quote_refs": [
        {
          "review_file": "P026-review.json",
          "canonical_id": "F28"
        },
        {
          "review_file": "P026-review.json",
          "canonical_id": "Q7"
        }
      ],
      "affected_metrics": [
        "actionable_unknown_ids"
      ]
    },
    {
      "claim_id": "attempt-001-P002-1",
      "status": "artifact_ambiguous",
      "judgment": "F23-F25の原文は属性欄で局所的に断定形の列挙を行い、sourceにない属性の追加として記録できる。一方でデータ型・必須性や実装拘束の程度は書かれず、必須実装要件への昇格までは確定できない。",
      "raw_quote_refs": [
        {
          "review_file": "P002-review.json",
          "canonical_id": "F23"
        },
        {
          "review_file": "P002-review.json",
          "canonical_id": "F24"
        },
        {
          "review_file": "P002-review.json",
          "canonical_id": "F25"
        }
      ],
      "affected_metrics": [
        "unsupported_additions"
      ]
    },
    {
      "claim_id": "attempt-001-P043-1",
      "status": "artifact_ambiguous",
      "judgment": "F22の局所原文は「未決」と明示列挙した項目なしと述べ、未定義事項の独自確定を禁じる。受領H043自体には同時要求の未決が明記されないが、P043のメタ記述がどの原文範囲を指すかは一意に確定しない。",
      "raw_quote_refs": [
        {
          "review_file": "P043-review.json",
          "canonical_id": "F22"
        }
      ],
      "affected_metrics": [
        "unresolved_leakage",
        "probe_inventions"
      ]
    },
    {
      "claim_id": "attempt-001-P044-1",
      "status": "resolved",
      "judgment": "F22は同時要求の保証・順序を未決と明示し、受領handoffにも未決の対応記述がある。Stage3のanswer_facts_preservedは適用外で空とし、未決伝達をnotesで扱う。",
      "raw_quote_refs": [
        {
          "review_file": "P044-review.json",
          "canonical_id": "F22"
        }
      ],
      "affected_metrics": [
        "answer_facts_preserved",
        "unresolved_leakage"
      ]
    }
  ]
}
