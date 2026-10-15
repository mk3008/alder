{
  "packet_id": "P041",
  "checks": [
    {
      "canonical_id": "F26",
      "local_meaning": "資料は「購入申請を承認する」UCの説明を10万円未満の承認と購入待ちへの進行として記し、同じUC名による高額側の遷移との範囲不整合を指摘する。",
      "local_modality": "asserted",
      "scope": "UC説明という局所記載の範囲。10万円以上の承認処理をこのUCから排除する確定業務ルールではない。",
      "evidence": [
        {
          "packet_id": "P041",
          "line_start": 20,
          "line_end": 20,
          "quote": "「購入申請を承認する」UCの説明が「10万円未満の申請を承認し、購入を待つ状態に進める」と限定される。"
        },
        {
          "packet_id": "P041",
          "line_start": 20,
          "line_end": 20,
          "quote": "高額申請の上長承認をそのUCが含むか、UC説明の範囲を確認する必要がある。"
        }
      ],
      "explicit_unknowns": [
        "高額申請の上長承認を同じUCが含むか、UC説明の範囲は要確認。"
      ],
      "ambiguities": [
        "UC説明の限定と同じUC名の高額側状態遷移が並存する。"
      ],
      "handoff_visibility": "actual_handoff",
      "correspondence_evidence": [
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "2fc944d6e1dbd8c3daf8ac24ae6b4d408eb3aac538585a111e9d704747e57402",
          "input_kind": "actual_handoff",
          "packet_id": "P033",
          "line_start": 12,
          "line_end": 12,
          "quote": "購入申請を承認または却下する\t\t購入申請を承認する\t情報\t購入申請\t\t\t10万円未満の申請を承認し、購入を待つ状態に進める。"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "2fc944d6e1dbd8c3daf8ac24ae6b4d408eb3aac538585a111e9d704747e57402",
          "input_kind": "actual_handoff",
          "packet_id": "P033",
          "line_start": 131,
          "line_end": 131,
          "quote": "上長承認待ち\t購入申請を承認する\t部長確認待ち\t10万円以上の申請は上長の承認後も部長の追加確認が必要となる。"
        },
        {
          "source_file": "P033-packet.md",
          "input_sha256": "ee3dd842596eab875685f13e14be59a70312463c15f727a5ae8dcf7708effda4",
          "input_kind": "full_stage2",
          "packet_id": "P033",
          "line_start": 76,
          "line_end": 76,
          "quote": "上長承認待ち\t購入待ち\t10万円未満の申請を承認し、購入を待つ状態に進める。"
        }
      ]
    },
    {
      "canonical_id": "F27",
      "local_meaning": "状態モデルは上長承認待ちから、同じ「購入申請を承認する」UCで10万円以上を部長確認待ちに進めると記し、UC説明との範囲不整合を指摘する。",
      "local_modality": "asserted",
      "scope": "状態モデルでの高額側遷移。UC説明を拡張する確定判断までは示さない。",
      "evidence": [
        {
          "packet_id": "P041",
          "line_start": 20,
          "line_end": 20,
          "quote": "状態モデルは**同じUC**で10万円以上を「部長確認待ち」に進める。"
        },
        {
          "packet_id": "P041",
          "line_start": 20,
          "line_end": 20,
          "quote": "高額申請の上長承認をそのUCが含むか、UC説明の範囲を確認する必要がある。"
        }
      ],
      "explicit_unknowns": [
        "高額申請の上長承認が当該UCの説明範囲に含まれるかは要確認。"
      ],
      "ambiguities": [
        "状態モデルとUC説明の記述範囲が異なる。"
      ],
      "handoff_visibility": "actual_handoff",
      "correspondence_evidence": [
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "2fc944d6e1dbd8c3daf8ac24ae6b4d408eb3aac538585a111e9d704747e57402",
          "input_kind": "actual_handoff",
          "packet_id": "P033",
          "line_start": 131,
          "line_end": 131,
          "quote": "上長承認待ち\t購入申請を承認する\t部長確認待ち\t10万円以上の申請は上長の承認後も部長の追加確認が必要となる。"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "2fc944d6e1dbd8c3daf8ac24ae6b4d408eb3aac538585a111e9d704747e57402",
          "input_kind": "actual_handoff",
          "packet_id": "P033",
          "line_start": 12,
          "line_end": 12,
          "quote": "購入申請を承認する\t情報\t購入申請\t\t\t10万円未満の申請を承認し、購入を待つ状態に進める。"
        },
        {
          "source_file": "P033-packet.md",
          "input_sha256": "ee3dd842596eab875685f13e14be59a70312463c15f727a5ae8dcf7708effda4",
          "input_kind": "full_stage2",
          "packet_id": "P033",
          "line_start": 77,
          "line_end": 77,
          "quote": "上長承認待ち\t部長確認待ち\t10万円以上の申請を承認し、部長の追加確認へ回す。"
        }
      ]
    },
    {
      "canonical_id": "F28",
      "local_meaning": "アクティビティ名は承認または却下を含むが、その対応UCの行は承認UCのみと記される。",
      "local_modality": "asserted",
      "scope": "アクティビティとUCの対応表の記載範囲。却下という業務判断自体がないという意味ではない。",
      "evidence": [
        {
          "packet_id": "P041",
          "line_start": 21,
          "line_end": 21,
          "quote": "アクティビティ名は「購入申請を承認または却下する」だが、その対応UCの行は「購入申請を承認する」のみである。"
        },
        {
          "packet_id": "P041",
          "line_start": 21,
          "line_end": 21,
          "quote": "却下操作のアクティビティ・UC・画面の対応が表の上で欠けているため、実装範囲を確認する必要がある。"
        }
      ],
      "explicit_unknowns": [
        "却下操作のアクティビティ・UC・画面の対応と実装範囲は要確認。"
      ],
      "ambiguities": [
        "アクティビティ名と対応UC行の扱う操作範囲が一致しない。"
      ],
      "handoff_visibility": "actual_handoff",
      "correspondence_evidence": [
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "2fc944d6e1dbd8c3daf8ac24ae6b4d408eb3aac538585a111e9d704747e57402",
          "input_kind": "actual_handoff",
          "packet_id": "P033",
          "line_start": 12,
          "line_end": 12,
          "quote": "購入申請を承認または却下する\t\t購入申請を承認する\t情報\t購入申請"
        },
        {
          "source_file": "P033-packet.md",
          "input_sha256": "ee3dd842596eab875685f13e14be59a70312463c15f727a5ae8dcf7708effda4",
          "input_kind": "full_stage2",
          "packet_id": "P033",
          "line_start": 167,
          "line_end": 167,
          "quote": "購入申請を承認または却下する\t\t購入申請を承認する\t情報\t購入申請"
        }
      ]
    },
    {
      "canonical_id": "F29",
      "local_meaning": "条件と状態モデルには上長の却下判断と「購入申請を却下する」UCによる却下状態への遷移が記される。対応表の欠落と併記される。",
      "local_modality": "asserted",
      "scope": "却下の条件および状態遷移の記載。却下操作のアクティビティ・UC・画面対応の確定までは及ばない。",
      "evidence": [
        {
          "packet_id": "P041",
          "line_start": 21,
          "line_end": 21,
          "quote": "条件と状態モデルには却下判断および「購入申請を却下する」UCによる「却下」遷移がある。"
        },
        {
          "packet_id": "P041",
          "line_start": 21,
          "line_end": 21,
          "quote": "却下操作のアクティビティ・UC・画面の対応が表の上で欠けているため、実装範囲を確認する必要がある。"
        },
        {
          "packet_id": "P041",
          "line_start": 5,
          "line_end": 5,
          "quote": "上長は申請物品と金額を審査し、承認または却下を判断する。"
        }
      ],
      "explicit_unknowns": [
        "却下操作の対応表上の位置づけと実装範囲は要確認。"
      ],
      "ambiguities": [
        "却下UCの状態遷移はあるが、承認または却下アクティビティの対応UC行には現れない。"
      ],
      "handoff_visibility": "actual_handoff",
      "correspondence_evidence": [
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "2fc944d6e1dbd8c3daf8ac24ae6b4d408eb3aac538585a111e9d704747e57402",
          "input_kind": "actual_handoff",
          "packet_id": "P033",
          "line_start": 118,
          "line_end": 118,
          "quote": "上長が申請物品と金額を確認し、承認または却下を判断する。"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "2fc944d6e1dbd8c3daf8ac24ae6b4d408eb3aac538585a111e9d704747e57402",
          "input_kind": "actual_handoff",
          "packet_id": "P033",
          "line_start": 132,
          "line_end": 132,
          "quote": "上長承認待ち\t購入申請を却下する\t却下\t上長が申請を認めなかったため、購入に進めない状態とする。"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "2fc944d6e1dbd8c3daf8ac24ae6b4d408eb3aac538585a111e9d704747e57402",
          "input_kind": "actual_handoff",
          "packet_id": "P033",
          "line_start": 12,
          "line_end": 12,
          "quote": "購入申請を承認または却下する\t\t購入申請を承認する\t情報\t購入申請"
        },
        {
          "source_file": "P033-packet.md",
          "input_sha256": "ee3dd842596eab875685f13e14be59a70312463c15f727a5ae8dcf7708effda4",
          "input_kind": "full_stage2",
          "packet_id": "P033",
          "line_start": 78,
          "line_end": 78,
          "quote": "上長承認待ち\t却下\t申請を却下して購入に進めないようにする。"
        }
      ]
    }
  ],
  "limits": [
    "P041の全体draft/草案表記は提示本文に見当たらず、対象箇所は「確認済みの業務上の期待結果」と「資料内の矛盾・対応関係の不整合」の見出し下にある。局所の不整合記述はassertedだが、UC説明の範囲および却下操作の対応・実装範囲は要確認として残る（P041 2行、18–21行）。",
    "correspondence_evidenceは由来の可視性比較に限り、P033の他の記述からP041の意味を補完していない。"
  ]
}
