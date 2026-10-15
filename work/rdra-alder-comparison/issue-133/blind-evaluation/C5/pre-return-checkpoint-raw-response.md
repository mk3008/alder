{
  "case_id": "C5",
  "scores": [
    {
      "packet_id": "P004",
      "stage": "s1",
      "unknown_ids_found": [
        "C5-U2"
      ],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "社員が購入申請",
        "10万円以上は部長承認または却下",
        "10万円未満は課長承認または却下",
        "承認後だけ購買担当が購入",
        "却下時は購入しない",
        "購入結果を申請者へ伝える",
        "金額と物品を記録",
        "TypeScript使用",
        "PostgreSQL使用",
        "POST /purchase-requestsの入力と201/pending応答",
        "不正入力400",
        "decision APIの入力",
        "金額に対応する役割だけが決定",
        "役割不一致403",
        "存在しないid404",
        "既存schemaの列・型・制約維持",
        "申請・承認分岐と購入への引渡しまで"
      ],
      "answer_facts_preserved": [],
      "unauthorized_decisions": [
        {
          "meaning": "決定済み申請の状態変更を認めないと回答前に確定",
          "evidence_ids": [
            "F14",
            "F15"
          ]
        }
      ],
      "unsupported_additions": [
        {
          "meaning": "既存schemaにない申請者・決裁者社員IDや決裁日時を必須属性化",
          "evidence_ids": [
            "F33",
            "F34"
          ]
        },
        {
          "meaning": "承認却下結果を申請者へ知らせる追加業務",
          "evidence_ids": [
            "F18"
          ]
        }
      ],
      "unresolved_leakage": [],
      "redundant_questions": [],
      "correct_stop": null,
      "downstream_facts_preserved": [],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [
        {
          "meaning": "社員情報と申請者・決裁者属性のモデルを既存schema外の確定構造として要求",
          "evidence_ids": [
            "F33",
            "F34"
          ]
        }
      ],
      "handoff_readiness": "API・分岐は概ね追えるがschema外属性と再決定の先決めで要修正",
      "implementation_viability": "not_executed",
      "needs_raw_check": [],
      "notes": [
        "金額境界と拒否分岐を活動からAPIまで保持（F9,F10,F25,F26）。再決定はF14,F15が回答前に確定。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {
          "C5-U2": [
            "F14",
            "F15"
          ]
        },
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "社員が購入申請": [
            "F1"
          ],
          "10万円以上は部長承認または却下": [
            "F10"
          ],
          "10万円未満は課長承認または却下": [
            "F9"
          ],
          "承認後だけ購買担当が購入": [
            "F16",
            "F17"
          ],
          "却下時は購入しない": [
            "F16"
          ],
          "購入結果を申請者へ伝える": [
            "F19"
          ],
          "金額と物品を記録": [
            "F6",
            "F20"
          ],
          "TypeScript使用": [
            "F32"
          ],
          "PostgreSQL使用": [
            "F27"
          ],
          "POST /purchase-requestsの入力と201/pending応答": [
            "F22"
          ],
          "不正入力400": [
            "F23"
          ],
          "decision APIの入力": [
            "F24"
          ],
          "金額に対応する役割だけが決定": [
            "F9",
            "F10"
          ],
          "役割不一致403": [
            "F25"
          ],
          "存在しないid404": [
            "F26"
          ],
          "既存schemaの列・型・制約維持": [
            "F28",
            "F29",
            "F30",
            "F31"
          ],
          "申請・承認分岐と購入への引渡しまで": [
            "F16"
          ]
        },
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P021",
      "stage": "s1",
      "unknown_ids_found": [
        "C5-U2"
      ],
      "actionable_unknown_ids": [
        "C5-U2"
      ],
      "source_facts_preserved": [
        "社員が購入申請",
        "10万円以上は部長承認または却下",
        "10万円未満は課長承認または却下",
        "承認後だけ購買担当が購入",
        "却下時は購入しない",
        "購入結果を申請者へ伝える",
        "金額と物品を記録",
        "TypeScript使用",
        "PostgreSQL使用",
        "POST /purchase-requestsの入力と201/pending応答",
        "不正入力400",
        "decision APIの入力",
        "金額に対応する役割だけが決定",
        "役割不一致403",
        "存在しないid404",
        "既存schemaの列・型・制約維持",
        "named architecture/framework/layer未指定",
        "申請・承認分岐と購入への引渡しまで"
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
      "handoff_readiness": "既存制約と範囲を保持し、再決定判断を確認可能",
      "implementation_viability": "not_executed",
      "needs_raw_check": [],
      "notes": [
        "引渡しと購入結果連絡の範囲を分ける（F17,F22）。再決定の可否と拒否応答を具体的に尋ねる（Q1,Q2）。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {
          "C5-U2": [
            "F21",
            "Q1",
            "Q2"
          ]
        },
        "actionable_unknown_ids": {
          "C5-U2": [
            "Q1",
            "Q2"
          ]
        },
        "source_facts_preserved": {
          "社員が購入申請": [
            "F7"
          ],
          "10万円以上は部長承認または却下": [
            "F15"
          ],
          "10万円未満は課長承認または却下": [
            "F14"
          ],
          "承認後だけ購買担当が購入": [
            "F17"
          ],
          "却下時は購入しない": [
            "F18"
          ],
          "購入結果を申請者へ伝える": [
            "F22"
          ],
          "金額と物品を記録": [
            "F4",
            "F9"
          ],
          "TypeScript使用": [
            "F28"
          ],
          "PostgreSQL使用": [
            "F28"
          ],
          "POST /purchase-requestsの入力と201/pending応答": [
            "F8",
            "F10"
          ],
          "不正入力400": [
            "F11"
          ],
          "decision APIの入力": [
            "F13"
          ],
          "金額に対応する役割だけが決定": [
            "F14",
            "F15"
          ],
          "役割不一致403": [
            "F20"
          ],
          "存在しないid404": [
            "F19"
          ],
          "既存schemaの列・型・制約維持": [
            "F24",
            "F25",
            "F26",
            "F27"
          ],
          "named architecture/framework/layer未指定": [
            "F29"
          ],
          "申請・承認分岐と購入への引渡しまで": [
            "F2",
            "F17"
          ]
        },
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P023",
      "stage": "s1",
      "unknown_ids_found": [
        "C5-U2"
      ],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "社員が購入申請",
        "10万円以上は部長承認または却下",
        "10万円未満は課長承認または却下",
        "承認後だけ購買担当が購入",
        "却下時は購入しない",
        "購入結果を申請者へ伝える",
        "金額と物品を記録",
        "TypeScript使用",
        "PostgreSQL使用",
        "POST /purchase-requestsの入力と201/pending応答",
        "不正入力400",
        "decision APIの入力",
        "金額に対応する役割だけが決定",
        "役割不一致403",
        "存在しないid404",
        "既存schemaの列・型・制約維持",
        "申請・承認分岐と購入への引渡しまで"
      ],
      "answer_facts_preserved": [],
      "unauthorized_decisions": [
        {
          "meaning": "決定済みを終端状態として再決定不可に確定",
          "evidence_ids": [
            "F14"
          ]
        }
      ],
      "unsupported_additions": [
        {
          "meaning": "既存schemaにない申請・購入結果・社員情報の属性と関係を必須化",
          "evidence_ids": [
            "F33",
            "F34",
            "F35"
          ]
        },
        {
          "meaning": "対象外の購入結果入力・通知画面と行為を設計範囲の要求化",
          "evidence_ids": [
            "F44",
            "F45"
          ]
        }
      ],
      "unresolved_leakage": [],
      "redundant_questions": [],
      "correct_stop": null,
      "downstream_facts_preserved": [],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [
        {
          "meaning": "購入申請・購入結果・社員情報の追加属性と関係を確定モデルとして要求",
          "evidence_ids": [
            "F33",
            "F34",
            "F35"
          ]
        }
      ],
      "handoff_readiness": "APIの重要分岐は伝わるが範囲外の画面・データ構造を除く必要",
      "implementation_viability": "not_executed",
      "needs_raw_check": [],
      "notes": [
        "申請から金額別決裁、承認のみの引渡しまで連続（F1,F5,F6,F17,F18）。F14は未回答の再決定を先決め。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {
          "C5-U2": [
            "F14"
          ]
        },
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "社員が購入申請": [
            "F1"
          ],
          "10万円以上は部長承認または却下": [
            "F6"
          ],
          "10万円未満は課長承認または却下": [
            "F5"
          ],
          "承認後だけ購買担当が購入": [
            "F17",
            "F20"
          ],
          "却下時は購入しない": [
            "F18"
          ],
          "購入結果を申請者へ伝える": [
            "F22"
          ],
          "金額と物品を記録": [
            "F7",
            "F21"
          ],
          "TypeScript使用": [
            "F26"
          ],
          "PostgreSQL使用": [
            "F26"
          ],
          "POST /purchase-requestsの入力と201/pending応答": [
            "F24",
            "F8"
          ],
          "不正入力400": [
            "F9"
          ],
          "decision APIの入力": [
            "F25"
          ],
          "金額に対応する役割だけが決定": [
            "F5",
            "F6"
          ],
          "役割不一致403": [
            "F15"
          ],
          "存在しないid404": [
            "F16"
          ],
          "既存schemaの列・型・制約維持": [
            "F28",
            "F29",
            "F30",
            "F31"
          ],
          "申請・承認分岐と購入への引渡しまで": [
            "F32"
          ]
        },
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P024",
      "stage": "s1",
      "unknown_ids_found": [
        "C5-U2"
      ],
      "actionable_unknown_ids": [
        "C5-U2"
      ],
      "source_facts_preserved": [
        "社員が購入申請",
        "10万円以上は部長承認または却下",
        "10万円未満は課長承認または却下",
        "承認後だけ購買担当が購入",
        "却下時は購入しない",
        "購入結果を申請者へ伝える",
        "金額と物品を記録",
        "TypeScript使用",
        "PostgreSQL使用",
        "POST /purchase-requestsの入力と201/pending応答",
        "不正入力400",
        "decision APIの入力",
        "金額に対応する役割だけが決定",
        "役割不一致403",
        "存在しないid404",
        "既存schemaの列・型・制約維持",
        "named architecture/framework/layer未指定",
        "申請・承認分岐と購入への引渡しまで"
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
      "handoff_readiness": "既存APIとschemaを保持し、再決定は未決として引渡しへの影響を示す",
      "implementation_viability": "not_executed",
      "needs_raw_check": [],
      "notes": [
        "F26とQ1は再決定の可否を未決として特定。Q2は承認後変更が引渡しに及ぼす条件軸を示す。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {
          "C5-U2": [
            "F26",
            "Q1"
          ]
        },
        "actionable_unknown_ids": {
          "C5-U2": [
            "Q1"
          ]
        },
        "source_facts_preserved": {
          "社員が購入申請": [
            "F11"
          ],
          "10万円以上は部長承認または却下": [
            "F20"
          ],
          "10万円未満は課長承認または却下": [
            "F20"
          ],
          "承認後だけ購買担当が購入": [
            "F24"
          ],
          "却下時は購入しない": [
            "F24"
          ],
          "購入結果を申請者へ伝える": [
            "F6"
          ],
          "金額と物品を記録": [
            "F13",
            "F6"
          ],
          "TypeScript使用": [
            "F2"
          ],
          "PostgreSQL使用": [
            "F2"
          ],
          "POST /purchase-requestsの入力と201/pending応答": [
            "F12",
            "F14"
          ],
          "不正入力400": [
            "F15"
          ],
          "decision APIの入力": [
            "F19"
          ],
          "金額に対応する役割だけが決定": [
            "F20"
          ],
          "役割不一致403": [
            "F22"
          ],
          "存在しないid404": [
            "F23"
          ],
          "既存schemaの列・型・制約維持": [
            "F3"
          ],
          "named architecture/framework/layer未指定": [
            "F4"
          ],
          "申請・承認分岐と購入への引渡しまで": [
            "F5",
            "F24"
          ]
        },
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P018",
      "stage": "s2",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "社員が購入申請",
        "10万円以上は部長承認または却下",
        "10万円未満は課長承認または却下",
        "承認後だけ購買担当が購入",
        "却下時は購入しない",
        "購入結果を申請者へ伝える",
        "金額と物品を記録",
        "TypeScript使用",
        "PostgreSQL使用",
        "POST /purchase-requestsの入力と201/pending応答",
        "不正入力400",
        "decision APIの入力",
        "金額に対応する役割だけが決定",
        "役割不一致403",
        "存在しないid404",
        "named architecture/framework/layer未指定",
        "申請・承認分岐と購入への引渡しまで"
      ],
      "answer_facts_preserved": [
        "追加の承認条件なし",
        "決定成功200でidと決定後status",
        "決定済みへの再決定409",
        "購入実行と結果連絡はAPI実装範囲外・引渡し条件は保持"
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
      "handoff_readiness": "主要フローと応答は揃うが既存schemaの列型制約を展開していない",
      "implementation_viability": "not_executed",
      "needs_raw_check": [],
      "notes": [
        "追加承認条件なし、200、409、引渡し境界を回答どおり保持（F22,F24,F27,F3）。本人性はF30,F31で明示的未決。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "社員が購入申請": [
            "F9",
            "F12"
          ],
          "10万円以上は部長承認または却下": [
            "F20"
          ],
          "10万円未満は課長承認または却下": [
            "F21"
          ],
          "承認後だけ購買担当が購入": [
            "F28"
          ],
          "却下時は購入しない": [
            "F29"
          ],
          "購入結果を申請者へ伝える": [
            "F3"
          ],
          "金額と物品を記録": [
            "F14",
            "F4"
          ],
          "TypeScript使用": [
            "F7"
          ],
          "PostgreSQL使用": [
            "F7"
          ],
          "POST /purchase-requestsの入力と201/pending応答": [
            "F13",
            "F15"
          ],
          "不正入力400": [
            "F16"
          ],
          "decision APIの入力": [
            "F11"
          ],
          "金額に対応する役割だけが決定": [
            "F20",
            "F21"
          ],
          "役割不一致403": [
            "F25"
          ],
          "存在しないid404": [
            "F26"
          ],
          "named architecture/framework/layer未指定": [
            "F8"
          ],
          "申請・承認分岐と購入への引渡しまで": [
            "F2",
            "F28"
          ]
        },
        "answer_facts_preserved": {
          "追加の承認条件なし": [
            "F22"
          ],
          "決定成功200でidと決定後status": [
            "F24"
          ],
          "決定済みへの再決定409": [
            "F27"
          ],
          "購入実行と結果連絡はAPI実装範囲外・引渡し条件は保持": [
            "F3",
            "F28"
          ]
        },
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P049",
      "stage": "s2",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "社員が購入申請",
        "10万円以上は部長承認または却下",
        "10万円未満は課長承認または却下",
        "承認後だけ購買担当が購入",
        "却下時は購入しない",
        "購入結果を申請者へ伝える",
        "金額と物品を記録",
        "TypeScript使用",
        "PostgreSQL使用",
        "POST /purchase-requestsの入力と201/pending応答",
        "不正入力400",
        "decision APIの入力",
        "金額に対応する役割だけが決定",
        "役割不一致403",
        "存在しないid404",
        "既存schemaの列・型・制約維持",
        "named architecture/framework/layer未指定",
        "申請・承認分岐と購入への引渡しまで"
      ],
      "answer_facts_preserved": [
        "追加の承認条件なし",
        "決定成功200でidと決定後status",
        "決定済みへの再決定409",
        "購入実行と結果連絡はAPI実装範囲外・引渡し条件は保持"
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
      "handoff_readiness": "既存APIと列型制約、分岐応答を追跡できる。本人性の未決を維持",
      "implementation_viability": "not_executed",
      "needs_raw_check": [],
      "notes": [
        "スキーマ列型制約を個別に保持（F19-F22）。F37,F38はrole値と本人性の別途照合を未決に留める。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "社員が購入申請": [
            "F14"
          ],
          "10万円以上は部長承認または却下": [
            "F30"
          ],
          "10万円未満は課長承認または却下": [
            "F29"
          ],
          "承認後だけ購買担当が購入": [
            "F5",
            "F25"
          ],
          "却下時は購入しない": [
            "F5"
          ],
          "購入結果を申請者へ伝える": [
            "F5"
          ],
          "金額と物品を記録": [
            "F6",
            "F18"
          ],
          "TypeScript使用": [
            "F8"
          ],
          "PostgreSQL使用": [
            "F8"
          ],
          "POST /purchase-requestsの入力と201/pending応答": [
            "F15",
            "F17",
            "F23"
          ],
          "不正入力400": [
            "F24"
          ],
          "decision APIの入力": [
            "F26",
            "F27"
          ],
          "金額に対応する役割だけが決定": [
            "F29",
            "F30"
          ],
          "役割不一致403": [
            "F32"
          ],
          "存在しないid404": [
            "F35"
          ],
          "既存schemaの列・型・制約維持": [
            "F19",
            "F20",
            "F21",
            "F22"
          ],
          "named architecture/framework/layer未指定": [
            "F9"
          ],
          "申請・承認分岐と購入への引渡しまで": [
            "F3",
            "F4"
          ]
        },
        "answer_facts_preserved": {
          "追加の承認条件なし": [
            "F31"
          ],
          "決定成功200でidと決定後status": [
            "F34"
          ],
          "決定済みへの再決定409": [
            "F36"
          ],
          "購入実行と結果連絡はAPI実装範囲外・引渡し条件は保持": [
            "F4",
            "F5"
          ]
        },
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P051",
      "stage": "s2",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "社員が購入申請",
        "10万円以上は部長承認または却下",
        "10万円未満は課長承認または却下",
        "承認後だけ購買担当が購入",
        "却下時は購入しない",
        "購入結果を申請者へ伝える",
        "金額と物品を記録",
        "TypeScript使用",
        "PostgreSQL使用",
        "POST /purchase-requestsの入力と201/pending応答",
        "不正入力400",
        "decision APIの入力",
        "金額に対応する役割だけが決定",
        "役割不一致403",
        "存在しないid404",
        "既存schemaの列・型・制約維持",
        "申請・承認分岐と購入への引渡しまで"
      ],
      "answer_facts_preserved": [
        "追加の承認条件なし",
        "決定成功200でidと決定後status",
        "決定済みへの再決定409",
        "購入実行と結果連絡はAPI実装範囲外・引渡し条件は保持"
      ],
      "unauthorized_decisions": [],
      "unsupported_additions": [
        {
          "meaning": "既存schema外の社員識別・決定担当属性を確定データモデルに追加",
          "evidence_ids": [
            "F27",
            "F28"
          ]
        }
      ],
      "unresolved_leakage": [],
      "redundant_questions": [],
      "correct_stop": null,
      "downstream_facts_preserved": [],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [
        {
          "meaning": "既存schema外の社員情報・申請者・決定者属性を確定情報構造として要求",
          "evidence_ids": [
            "F27",
            "F28"
          ]
        }
      ],
      "handoff_readiness": "分岐と既存制約はあるが統合フロー行のアクター不整合を要確認",
      "implementation_viability": "not_executed",
      "needs_raw_check": [
        {
          "meaning": "10万円未満の課長権限F7と統合フローの部長アクターF38の表示不整合。対応行の修正意図は未確定",
          "evidence_ids": [
            "F7",
            "F38"
          ]
        }
      ],
      "notes": [
        "F7は課長だけの規則だがF38の単一対応行に部長が併記。局所表示の競合として留保。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "社員が購入申請": [
            "F1"
          ],
          "10万円以上は部長承認または却下": [
            "F8"
          ],
          "10万円未満は課長承認または却下": [
            "F7"
          ],
          "承認後だけ購買担当が購入": [
            "F15",
            "F26"
          ],
          "却下時は購入しない": [
            "F15"
          ],
          "購入結果を申請者へ伝える": [
            "F17"
          ],
          "金額と物品を記録": [
            "F4",
            "F17"
          ],
          "TypeScript使用": [
            "F24"
          ],
          "PostgreSQL使用": [
            "F24"
          ],
          "POST /purchase-requestsの入力と201/pending応答": [
            "F20",
            "F5"
          ],
          "不正入力400": [
            "F6"
          ],
          "decision APIの入力": [
            "F21"
          ],
          "金額に対応する役割だけが決定": [
            "F7",
            "F8",
            "F9"
          ],
          "役割不一致403": [
            "F12"
          ],
          "存在しないid404": [
            "F11"
          ],
          "既存schemaの列・型・制約維持": [
            "F23"
          ],
          "申請・承認分岐と購入への引渡しまで": [
            "F18"
          ]
        },
        "answer_facts_preserved": {
          "追加の承認条件なし": [
            "F9"
          ],
          "決定成功200でidと決定後status": [
            "F14"
          ],
          "決定済みへの再決定409": [
            "F13"
          ],
          "購入実行と結果連絡はAPI実装範囲外・引渡し条件は保持": [
            "F18"
          ]
        },
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P059",
      "stage": "s2",
      "unknown_ids_found": [],
      "actionable_unknown_ids": [],
      "source_facts_preserved": [
        "社員が購入申請",
        "10万円以上は部長承認または却下",
        "10万円未満は課長承認または却下",
        "承認後だけ購買担当が購入",
        "却下時は購入しない",
        "購入結果を申請者へ伝える",
        "金額と物品を記録",
        "TypeScript使用",
        "PostgreSQL使用",
        "POST /purchase-requestsの入力と201/pending応答",
        "不正入力400",
        "decision APIの入力",
        "金額に対応する役割だけが決定",
        "役割不一致403",
        "存在しないid404",
        "申請・承認分岐と購入への引渡しまで"
      ],
      "answer_facts_preserved": [
        "追加の承認条件なし",
        "決定成功200でidと決定後status",
        "決定済みへの再決定409",
        "購入実行と結果連絡はAPI実装範囲外・引渡し条件は保持"
      ],
      "unauthorized_decisions": [],
      "unsupported_additions": [
        {
          "meaning": "既存schema外の社員ID・決裁者IDと社員マスターの確定モデル追加",
          "evidence_ids": [
            "F23",
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
      "unapproved_architecture_promotion": [
        {
          "meaning": "申請者・決裁者IDと社員マスター関係を確定モデルとして要求",
          "evidence_ids": [
            "F23",
            "F24"
          ]
        }
      ],
      "handoff_readiness": "応答と承認から購買引渡しの連続性を保持。schema逐語制約と追加社員モデルは要点検",
      "implementation_viability": "not_executed",
      "needs_raw_check": [
        {
          "meaning": "既存schemaの自動採番・必須・状態値はあるがGENERATED ALWAYS、具体的CHECK式の厳密保持は曖昧",
          "evidence_ids": [
            "F21"
          ]
        }
      ],
      "notes": [
        "金額境界100,000円、再決定409、購入引渡しをつなぐ（F2,F7,F10）。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {
          "社員が購入申請": [
            "F1"
          ],
          "10万円以上は部長承認または却下": [
            "F4"
          ],
          "10万円未満は課長承認または却下": [
            "F3"
          ],
          "承認後だけ購買担当が購入": [
            "F10"
          ],
          "却下時は購入しない": [
            "F10"
          ],
          "購入結果を申請者へ伝える": [
            "F12"
          ],
          "金額と物品を記録": [
            "F14",
            "F17"
          ],
          "TypeScript使用": [
            "F22"
          ],
          "PostgreSQL使用": [
            "F22"
          ],
          "POST /purchase-requestsの入力と201/pending応答": [
            "F15",
            "F16",
            "F18"
          ],
          "不正入力400": [
            "F16"
          ],
          "decision APIの入力": [
            "F19"
          ],
          "金額に対応する役割だけが決定": [
            "F3",
            "F4"
          ],
          "役割不一致403": [
            "F5"
          ],
          "存在しないid404": [
            "F6"
          ],
          "申請・承認分岐と購入への引渡しまで": [
            "F13"
          ]
        },
        "answer_facts_preserved": {
          "追加の承認条件なし": [
            "F9"
          ],
          "決定成功200でidと決定後status": [
            "F20"
          ],
          "決定済みへの再決定409": [
            "F7"
          ],
          "購入実行と結果連絡はAPI実装範囲外・引渡し条件は保持": [
            "F13"
          ]
        },
        "downstream_facts_preserved": {}
      }
    },
    {
      "packet_id": "P014",
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
        "社員が購入申請",
        "10万円以上は部長承認または却下",
        "10万円未満は課長承認または却下",
        "承認後だけ購買担当が購入",
        "却下時は購入しない",
        "金額と物品を記録",
        "POST /purchase-requestsの入力と201/pending応答",
        "不正入力400",
        "金額に対応する役割だけが決定",
        "役割不一致403",
        "存在しないid404",
        "追加の承認条件なし",
        "決定成功200でidと決定後status",
        "決定済みへの再決定409"
      ],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": "流れとHTTP分岐は有用。既存API入力の具体形・schema制約は欠ける",
      "implementation_viability": "not_executed",
      "needs_raw_check": [],
      "notes": [
        "金額別の役職、承認のみの引渡し、409拒否が連続（F8,F19,F13）。追加社員モデルF23-F25は受領H014のF20-F21に既在。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {},
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {
          "社員が購入申請": [
            "F1"
          ],
          "10万円以上は部長承認または却下": [
            "F8"
          ],
          "10万円未満は課長承認または却下": [
            "F8"
          ],
          "承認後だけ購買担当が購入": [
            "F19",
            "F20"
          ],
          "却下時は購入しない": [
            "F19"
          ],
          "金額と物品を記録": [
            "F7"
          ],
          "POST /purchase-requestsの入力と201/pending応答": [
            "F2",
            "F3",
            "F9"
          ],
          "不正入力400": [
            "F4"
          ],
          "金額に対応する役割だけが決定": [
            "F8",
            "F12"
          ],
          "役割不一致403": [
            "F12"
          ],
          "存在しないid404": [
            "F11"
          ],
          "追加の承認条件なし": [
            "F14"
          ],
          "決定成功200でidと決定後status": [
            "F17"
          ],
          "決定済みへの再決定409": [
            "F13"
          ]
        }
      }
    },
    {
      "packet_id": "P040",
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
        "社員が購入申請",
        "10万円以上は部長承認または却下",
        "10万円未満は課長承認または却下",
        "承認後だけ購買担当が購入",
        "却下時は購入しない",
        "金額と物品を記録",
        "金額に対応する役割だけが決定"
      ],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": "業務分岐は読めるがHTTP値とschema詳細欠落、活動・画面対応に未確定箇所",
      "implementation_viability": "not_executed",
      "needs_raw_check": [
        {
          "meaning": "状態名の二系統、却下UC経路、少額決定の部長行は局所対応未確定",
          "evidence_ids": [
            "F24",
            "F25",
            "F26",
            "F27",
            "F28",
            "F29",
            "F30",
            "F31"
          ]
        }
      ],
      "notes": [
        "承認だけを引き渡す境界は保持（F18,F19）。状態名と活動/画面対応の競合はF24-F31、受領H040のF23,F24,F37,F38にも由来。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {},
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {
          "社員が購入申請": [
            "F1"
          ],
          "10万円以上は部長承認または却下": [
            "F10"
          ],
          "10万円未満は課長承認または却下": [
            "F9"
          ],
          "承認後だけ購買担当が購入": [
            "F18"
          ],
          "却下時は購入しない": [
            "F19"
          ],
          "金額と物品を記録": [
            "F6"
          ],
          "金額に対応する役割だけが決定": [
            "F9",
            "F10",
            "F12"
          ]
        }
      }
    },
    {
      "packet_id": "P045",
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
        "社員が購入申請",
        "10万円以上は部長承認または却下",
        "10万円未満は課長承認または却下",
        "承認後だけ購買担当が購入",
        "却下時は購入しない",
        "金額と物品を記録",
        "POST /purchase-requestsの入力と201/pending応答",
        "不正入力400",
        "decision APIの入力",
        "金額に対応する役割だけが決定",
        "役割不一致403",
        "存在しないid404",
        "追加の承認条件なし",
        "決定成功200でidと決定後status",
        "決定済みへの再決定409"
      ],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": "API分岐と応答、承認後引渡しは追える。schemaの列型制約は要約で欠落",
      "implementation_viability": "not_executed",
      "needs_raw_check": [
        {
          "meaning": "schemaは維持・列名と状態名の要約に止まり、列型・CHECK式は参照先省略の可能性",
          "evidence_ids": [
            "F7",
            "F9"
          ]
        },
        {
          "meaning": "decision入力は役職・決定結果の語から意味上追えるが具体的body列挙は局所要約にない。原資料省略の可能性を残す",
          "evidence_ids": [
            "F10",
            "F11",
            "F12",
            "F13"
          ]
        }
      ],
      "notes": [
        "409拒否と承認のみの購入を保持（F17-F19）。F22-F25は本人性照合の未決であり追加ルールの確定ではない。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {},
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {
          "社員が購入申請": [
            "F1"
          ],
          "10万円以上は部長承認または却下": [
            "F12"
          ],
          "10万円未満は課長承認または却下": [
            "F11"
          ],
          "承認後だけ購買担当が購入": [
            "F18"
          ],
          "却下時は購入しない": [
            "F19"
          ],
          "金額と物品を記録": [
            "F4"
          ],
          "POST /purchase-requestsの入力と201/pending応答": [
            "F1",
            "F2",
            "F3",
            "F5"
          ],
          "不正入力400": [
            "F6"
          ],
          "decision APIの入力": [
            "F10",
            "F11",
            "F12",
            "F13"
          ],
          "金額に対応する役割だけが決定": [
            "F11",
            "F12",
            "F15"
          ],
          "役割不一致403": [
            "F15"
          ],
          "存在しないid404": [
            "F16"
          ],
          "追加の承認条件なし": [
            "F29"
          ],
          "決定成功200でidと決定後status": [
            "F14"
          ],
          "決定済みへの再決定409": [
            "F17"
          ]
        }
      }
    },
    {
      "packet_id": "P057",
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
        "社員が購入申請",
        "10万円以上は部長承認または却下",
        "10万円未満は課長承認または却下",
        "承認後だけ購買担当が購入",
        "却下時は購入しない",
        "金額と物品を記録",
        "POST /purchase-requestsの入力と201/pending応答",
        "不正入力400",
        "decision APIの入力",
        "金額に対応する役割だけが決定",
        "役割不一致403",
        "存在しないid404",
        "追加の承認条件なし",
        "決定成功200でidと決定後status",
        "決定済みへの再決定409"
      ],
      "probe_inventions": [],
      "architecture_input_required": null,
      "unapproved_architecture_promotion": [],
      "handoff_readiness": "API分岐と回答反映は明瞭。schema列型制約は維持宣言だけ",
      "implementation_viability": "not_executed",
      "needs_raw_check": [
        {
          "meaning": "本人性照合の追加判断がHuman answer後に必要か、その強さは未決として残る",
          "evidence_ids": [
            "F30",
            "F31",
            "Q1",
            "Q2"
          ]
        }
      ],
      "notes": [
        "決定API 200、再決定409、承認のみ引渡しを維持（F22,F25,F4）。本人性は受領Stage2 P018 F30,F31の未決を伝える（F30,F31,Q1,Q2）。"
      ],
      "coverage_evidence": {
        "unknown_ids_found": {},
        "actionable_unknown_ids": {},
        "source_facts_preserved": {},
        "answer_facts_preserved": {},
        "downstream_facts_preserved": {
          "社員が購入申請": [
            "F2",
            "F9",
            "F10"
          ],
          "10万円以上は部長承認または却下": [
            "F17"
          ],
          "10万円未満は課長承認または却下": [
            "F18"
          ],
          "承認後だけ購買担当が購入": [
            "F4"
          ],
          "却下時は購入しない": [
            "F26"
          ],
          "金額と物品を記録": [
            "F11"
          ],
          "POST /purchase-requestsの入力と201/pending応答": [
            "F8",
            "F9",
            "F10",
            "F12"
          ],
          "不正入力400": [
            "F13"
          ],
          "decision APIの入力": [
            "F14",
            "F15"
          ],
          "金額に対応する役割だけが決定": [
            "F17",
            "F18"
          ],
          "役割不一致403": [
            "F23"
          ],
          "存在しないid404": [
            "F24"
          ],
          "追加の承認条件なし": [
            "F19"
          ],
          "決定成功200でidと決定後status": [
            "F22"
          ],
          "決定済みへの再決定409": [
            "F25"
          ]
        }
      }
    }
  ],
  "limits": [
    "12 packetのcanonicalは利用可能。固定18 source、4 answer、16 downstream factを分母とし、欠落は補完しない。",
    "P014はH014、P040はH040を実受領比較基準とする。P045はP049、P057はP018がbyte-identical受領。",
    "API/schema維持の総称だけでは列・型・制約の具体保持と数えない。意味的な抽出不足と参照先省略の可能性はneeds_raw_checkに残す。",
    "C5 implementation viabilityは全packetでnot_executed。"
  ],
  "raw_check_resolutions": [
    {
      "claim_id": "attempt-001-P051-1",
      "status": "artifact_ambiguous",
      "judgment": "F7の少額は課長だけという断定と、統合フロー単一行F38の部長アクター・高額画面要求は不整合。引用は局所表示の競合を裏づけるが、部長へ少額決定権を与える確定規則とは判定できず、修正意図は未記載。",
      "raw_quote_refs": [
        {
          "review_file": "P051-review.json",
          "canonical_id": "F7"
        },
        {
          "review_file": "P051-review.json",
          "canonical_id": "F38"
        }
      ],
      "affected_metrics": [
        "source_facts_preserved",
        "unauthorized_decisions"
      ]
    },
    {
      "claim_id": "attempt-001-P040-1",
      "status": "artifact_ambiguous",
      "judgment": "二系統の状態名は保存値・表示値への対応が未確定。却下UCは状態モデルにあるが活動・画面経路は欠け、少額活動の部長行も矛盾する。受領handoffに由来する記載を独自発明としないが、実装上の対応は推測しない。",
      "raw_quote_refs": [
        {
          "review_file": "P040-review.json",
          "canonical_id": "F24"
        },
        {
          "review_file": "P040-review.json",
          "canonical_id": "F25"
        },
        {
          "review_file": "P040-review.json",
          "canonical_id": "F26"
        },
        {
          "review_file": "P040-review.json",
          "canonical_id": "F27"
        },
        {
          "review_file": "P040-review.json",
          "canonical_id": "F28"
        },
        {
          "review_file": "P040-review.json",
          "canonical_id": "F29"
        },
        {
          "review_file": "P040-review.json",
          "canonical_id": "F30"
        },
        {
          "review_file": "P040-review.json",
          "canonical_id": "F31"
        }
      ],
      "affected_metrics": [
        "downstream_facts_preserved",
        "probe_inventions",
        "unauthorized_decisions"
      ]
    },
    {
      "claim_id": "attempt-001-P045-1",
      "status": "resolved",
      "judgment": "局所引用は既存API/schema維持とID・金額・物品・状態の要約に限定。列型・CHECK制約の具体内容はこのprobe canonicalに保持されない。決定APIの経路、役職とapproved/rejectedの意味はF10-F13から追えるがbodyフィールドの逐語列挙はないため精度に限界。",
      "raw_quote_refs": [
        {
          "review_file": "P045-review.json",
          "canonical_id": "F7"
        },
        {
          "review_file": "P045-review.json",
          "canonical_id": "F9"
        },
        {
          "review_file": "P045-review.json",
          "canonical_id": "F10"
        }
      ],
      "affected_metrics": [
        "downstream_facts_preserved"
      ]
    },
    {
      "claim_id": "attempt-001-P057-1",
      "status": "resolved",
      "judgment": "role値だけか実利用者の役職確認も要るか、さらに確認対象と情報をどう定めるかは明示的未決であり、Q1/Q2は具体的な選択質問。実受領handoffにも同内容があり、probe独自の確定要件ではない。",
      "raw_quote_refs": [
        {
          "review_file": "P057-review.json",
          "canonical_id": "F30"
        },
        {
          "review_file": "P057-review.json",
          "canonical_id": "F31"
        },
        {
          "review_file": "P057-review.json",
          "canonical_id": "Q1"
        },
        {
          "review_file": "P057-review.json",
          "canonical_id": "Q2"
        }
      ],
      "affected_metrics": [
        "probe_inventions",
        "unauthorized_decisions",
        "unresolved_leakage"
      ]
    }
  ]
}
