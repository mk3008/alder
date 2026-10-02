{
  "packet_id": "P050",
  "checks": [
    {
      "canonical_id": "F20",
      "local_meaning": "P050は、10万円以上の部長フローと10万円未満の課長フローの結果記録説明が、結果を一律「承認済み」として扱う書き方だと述べる。これは記述内容についての断定であり、却下時にも承認済みへ遷移させる確定仕様ではない。",
      "local_modality": "asserted",
      "scope": "両金額帯の承認結果記録フローの文言。資料内矛盾として提示され、結果別の状態モデルとは整合未確認。",
      "evidence": [
        {
          "packet_id": "P050",
          "line_start": 18,
          "line_end": 18,
          "quote": "10万円以上・未満の両フローで、承認結果を記録すると一律に「承認済みとして管理する」と記され"
        },
        {
          "packet_id": "P050",
          "line_start": 18,
          "line_end": 18,
          "quote": "一方、条件定義と状態モデルは「却下」の記録・遷移を明示する。却下時にも承認済みにする仕様とは読めないため、結果記録フローと画面要求の記述を整合させる必要がある。"
        },
        {
          "packet_id": "P050",
          "line_start": 7,
          "line_end": 7,
          "quote": "承認なら「承認済み」、却下なら「却下」に遷移させる。"
        }
      ],
      "explicit_unknowns": [
        "却下時の結果記録フローの文言と却下状態への遷移をどう整合させるかは未確認。"
      ],
      "ambiguities": [
        "「承認結果」は承認という肯定結果だけを指す読みもあり得るが、P050は両フローの一律承認済み記述として矛盾を指摘する。実装時の扱いはここから確定しない。"
      ],
      "handoff_visibility": "actual_handoff",
      "correspondence_evidence": [
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "3088389556adf15794f81e23f8e9688fcdc946474cb3eb56a9955db7ca1ae05a",
          "input_kind": "actual_handoff",
          "packet_id": "P008",
          "line_start": 13,
          "line_end": 13,
          "quote": "部長の承認結果を購入申請に記録し、承認済みとして管理する。"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "3088389556adf15794f81e23f8e9688fcdc946474cb3eb56a9955db7ca1ae05a",
          "input_kind": "actual_handoff",
          "packet_id": "P008",
          "line_start": 22,
          "line_end": 22,
          "quote": "課長の承認結果を購入申請に記録し、承認済みとして管理する。"
        },
        {
          "source_file": "P008-packet.md",
          "input_sha256": "058a6f991ebb9b74caccf8eb438aa9c92316180fd0a9895a0c05d9924ce36eff",
          "input_kind": "full_stage2",
          "packet_id": "P008",
          "line_start": 148,
          "line_end": 148,
          "quote": "部長の承認結果を購入申請に記録し、承認済みとして管理する。"
        },
        {
          "source_file": "P008-packet.md",
          "input_sha256": "058a6f991ebb9b74caccf8eb438aa9c92316180fd0a9895a0c05d9924ce36eff",
          "input_kind": "full_stage2",
          "packet_id": "P008",
          "line_start": 157,
          "line_end": 157,
          "quote": "課長の承認結果を購入申請に記録し、承認済みとして管理する。"
        }
      ]
    },
    {
      "canonical_id": "F21",
      "local_meaning": "P050は、承認結果入力画面の要求が、結果記録後に承認済みとなったことの確認を求めると述べる。これは画面要求の記載についての断定であり、却下結果の場合の画面表示を確定しない。",
      "local_modality": "asserted",
      "scope": "部長・課長向けの結果入力画面の要求文言。P050では却下遷移との矛盾・要確認欄に置かれる。",
      "evidence": [
        {
          "packet_id": "P050",
          "line_start": 18,
          "line_end": 18,
          "quote": "結果入力画面の要求も記録後の承認済み確認を求める。"
        },
        {
          "packet_id": "P050",
          "line_start": 18,
          "line_end": 18,
          "quote": "一方、条件定義と状態モデルは「却下」の記録・遷移を明示する。却下時にも承認済みにする仕様とは読めないため、結果記録フローと画面要求の記述を整合させる必要がある。"
        }
      ],
      "explicit_unknowns": [
        "却下結果を記録した場合に画面が何を確認させるかは、整合方法が未決である。"
      ],
      "ambiguities": [
        "承認済み確認の要求は部長・課長の画面文言にあるが、却下の操作・画面挙動まではその文言から決まらない。"
      ],
      "handoff_visibility": "actual_handoff",
      "correspondence_evidence": [
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "3088389556adf15794f81e23f8e9688fcdc946474cb3eb56a9955db7ca1ae05a",
          "input_kind": "actual_handoff",
          "packet_id": "P008",
          "line_start": 17,
          "line_end": 17,
          "quote": "部長が担当する10万円以上の承認待ち申請を確認し、承認結果を記録して承認済みとなったことを確認できること。"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "3088389556adf15794f81e23f8e9688fcdc946474cb3eb56a9955db7ca1ae05a",
          "input_kind": "actual_handoff",
          "packet_id": "P008",
          "line_start": 18,
          "line_end": 18,
          "quote": "課長が担当する10万円未満の承認待ち申請を確認し、承認結果を記録して承認済みとなったことを確認できること。"
        },
        {
          "source_file": "P008-packet.md",
          "input_sha256": "058a6f991ebb9b74caccf8eb438aa9c92316180fd0a9895a0c05d9924ce36eff",
          "input_kind": "full_stage2",
          "packet_id": "P008",
          "line_start": 152,
          "line_end": 152,
          "quote": "部長が担当する10万円以上の承認待ち申請を確認し、承認結果を記録して承認済みとなったことを確認できること。"
        },
        {
          "source_file": "P008-packet.md",
          "input_sha256": "058a6f991ebb9b74caccf8eb438aa9c92316180fd0a9895a0c05d9924ce36eff",
          "input_kind": "full_stage2",
          "packet_id": "P008",
          "line_start": 153,
          "line_end": 153,
          "quote": "課長が担当する10万円未満の承認待ち申請を確認し、承認結果を記録して承認済みとなったことを確認できること。"
        }
      ]
    }
  ],
  "limits": [
    "P050の見出しは「確認済みの期待結果」（2行）と「資料内の矛盾・要確認」（16行）を区別する。F20・F21は後者の記述についての局所的な断定であり、却下時も承認済みにする確定ルールを意味しない。",
    "許可されたpacketには全体をdraftと呼ぶ表記を確認できない。全体draftという外部ラベルから、局所のasserted・未決の意味を変更しない。",
    "括弧内の「行13–18」などはP050外の参照であり、ここでのevidenceの行番号は各匿名packetの物理行である。"
  ]
}
