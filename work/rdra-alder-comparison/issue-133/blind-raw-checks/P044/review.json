{
  "packet_id": "P044",
  "checks": [
    {
      "canonical_id": "F22",
      "local_meaning": "同時要求に対する保証と処理順序は未決である。競合時の成立優先順位、排他方式、再試行は確定済みの業務ルールとして扱わない、という局所的な未決事項。",
      "local_modality": "unresolved",
      "scope": "会議室予約の同時要求に関する保証・処理順序と、競合時の成立優先順位、排他方式、再試行。単一要求時の予約可否条件や一般的な時間帯重複禁止の確定内容まで未決とする記述ではない。",
      "evidence": [
        {
          "packet_id": "P044",
          "line_start": 11,
          "line_end": 13,
          "quote": "## 明示された未決事項・まだ決めてはいけない事項\n\n- 同時要求に対する保証と処理順序は明示的に未決である。競合時の成立優先順位、排他方式、再試行などを確定済みの業務ルールとして扱わない。"
        },
        {
          "packet_id": "P044",
          "line_start": 2,
          "line_end": 2,
          "quote": "## 確認済みの期待結果"
        },
        {
          "packet_id": "P044",
          "line_start": 5,
          "line_end": 5,
          "quote": "利用停止中、または他の有効な予約と時間帯が重なる場合は予約できず、理由を示す。条件を満たす場合は予約が成立し、結果と内容を示す。"
        }
      ],
      "explicit_unknowns": [
        "同時要求に対する保証と処理順序",
        "競合時の成立優先順位、排他方式、再試行の確定ルール"
      ],
      "ambiguities": [
        "P044には全体をdraftとする表記が見当たらない。確認済みの期待結果という見出しと、F22の明示的な未決は局所的に別扱い。",
        "実際のhandoffは保証と処理順序の未決まで明記し、成立優先順位・排他方式・再試行の各語はその引用箇所にはない。"
      ],
      "handoff_visibility": "actual_handoff",
      "correspondence_evidence": [
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "592d2042f8383fc87c9defbcec7b35584dfaf81cce1bfb5428a3f137f5929145",
          "input_kind": "actual_handoff",
          "packet_id": "P022",
          "line_start": 25,
          "line_end": 25,
          "quote": "予約可能な会議室と時間帯の予約を成立させる。同時要求の保証と処理順序は未決とする。"
        },
        {
          "source_file": "P022-packet.md",
          "input_sha256": "7a42612781a41d9afc7305d9dd3582d5a6d9faf3327d5b5b01789a2ddc046263",
          "input_kind": "full_stage2",
          "packet_id": "P022",
          "line_start": 21,
          "line_end": 21,
          "quote": "社員の選んだ会議室と時間帯について、利用停止中でなく既存予約と時間が重複しない場合に予約を登録する。取消済み予約の時間帯は再予約できる。同時要求の保証と処理順序は未決とする。"
        }
      ]
    }
  ],
  "limits": [
    "P044の局所引用と実際のhandoffの引用範囲に限る。P022全体の記述を受領済みの意味に読み替えない。",
    "競合時の具体的な優先順位、排他方式、再試行方法は資料から確定しない。"
  ]
}
