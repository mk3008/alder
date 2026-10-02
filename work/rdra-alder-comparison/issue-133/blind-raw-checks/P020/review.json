{
  "packet_id": "P020",
  "checks": [
    {
      "canonical_id": "F33",
      "local_meaning": "同じ上長判断活動に結び付く説明文は「上長の承認を記録し」と記し、この説明文自体は承認だけに言及する。活動・画面要求等の承認／却下双方の記述とは区別される。",
      "local_modality": "asserted",
      "scope": "P020の「資料内の矛盾・記述の不一致」にある、上長判断活動の説明文についての局所的な記述。却下を記録できないという業務ルールを述べてはいない。",
      "evidence": [
        {
          "packet_id": "P020",
          "line_start": 17,
          "line_end": 17,
          "quote": "## 資料内の矛盾・記述の不一致"
        },
        {
          "packet_id": "P020",
          "line_start": 19,
          "line_end": 19,
          "quote": "同じ活動の説明は「上長の承認を記録し」と承認だけを記す"
        }
      ],
      "explicit_unknowns": [
        "説明文が承認だけを記す意図、修正要否および最終文言は資料に明示されていない。"
      ],
      "ambiguities": [
        "説明文の記載範囲の狭さを、活動全体から却下が除外される意味へ拡張できない。"
      ],
      "handoff_visibility": "actual_handoff",
      "correspondence_evidence": [
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "7806f0bfaa8e843977b0d6f1b935b143037c635c25de9d98ed5bfe0d13425d97",
          "input_kind": "actual_handoff",
          "packet_id": "P010",
          "line_start": 12,
          "line_end": 12,
          "quote": "承認または却下を記録する\t\t購入申請の判断を記録する\t情報\t購入申請\t\t\t上長の承認を記録し、金額に応じた次の確認または購入判断へ進める。"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "7806f0bfaa8e843977b0d6f1b935b143037c635c25de9d98ed5bfe0d13425d97",
          "input_kind": "actual_handoff",
          "packet_id": "P010",
          "line_start": 15,
          "line_end": 15,
          "quote": "上長の承認を記録し、金額に応じた次の確認または購入判断へ進める。\t申請内容を確認して承認または却下を選び、判断を記録できること。"
        },
        {
          "source_file": "P010-packet.md",
          "input_sha256": "2b3b1785b59b949692e6f32becbcc659bfeb1534ebda2e416a0f0c29bce6b4a5",
          "input_kind": "full_stage2",
          "packet_id": "P010",
          "line_start": 183,
          "line_end": 183,
          "quote": "承認または却下を記録する\t\t購入申請の判断を記録する\t情報\t購入申請\t\t\t上長の承認を記録し、金額に応じた次の確認または購入判断へ進める。"
        }
      ]
    },
    {
      "canonical_id": "F34",
      "local_meaning": "上長判断活動の説明文が承認だけに言及する一方、活動・画面要求や条件・記録・状態遷移には承認と却下双方が示される。この説明文の不一致が確認対象と明示されている。",
      "local_modality": "unresolved",
      "scope": "P020の不一致に関する確認対象。承認・却下双方を扱う期待結果が複数箇所で示されることと、説明文の未解消の不一致を同時に保持する。",
      "evidence": [
        {
          "packet_id": "P020",
          "line_start": 19,
          "line_end": 19,
          "quote": "「承認または却下を記録する」という活動・画面要求に対し、同じ活動の説明は「上長の承認を記録し」と承認だけを記す。"
        },
        {
          "packet_id": "P020",
          "line_start": 19,
          "line_end": 19,
          "quote": "一方、上長判断条件、承認記録、状態遷移には却下の記録が明記されている。"
        },
        {
          "packet_id": "P020",
          "line_start": 19,
          "line_end": 19,
          "quote": "実装上は承認・却下の双方を扱う期待結果が複数箇所で示されているが、この説明文の不一致は確認対象である。"
        }
      ],
      "explicit_unknowns": [
        "説明文の不一致をどの文言・手続で解消するかは指定されていない。",
        "確認の結果として業務要件が変更されるかは記されていない。"
      ],
      "ambiguities": [
        "承認のみの説明文と、却下を含む活動・画面要求との表現上の不一致であり、却下処理が不要と確定したという意味ではない。"
      ],
      "handoff_visibility": "actual_handoff",
      "correspondence_evidence": [
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "7806f0bfaa8e843977b0d6f1b935b143037c635c25de9d98ed5bfe0d13425d97",
          "input_kind": "actual_handoff",
          "packet_id": "P010",
          "line_start": 15,
          "line_end": 15,
          "quote": "承認または却下を記録する\t\t購入申請の判断を記録する\t画面\t申請審査画面\tアクター\t上長\t上長の承認を記録し、金額に応じた次の確認または購入判断へ進める。\t申請内容を確認して承認または却下を選び、判断を記録できること。"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "7806f0bfaa8e843977b0d6f1b935b143037c635c25de9d98ed5bfe0d13425d97",
          "input_kind": "actual_handoff",
          "packet_id": "P010",
          "line_start": 133,
          "line_end": 133,
          "quote": "上長が物品と金額を確認し、承認または却下を記録する。承認なら上長承認済、却下なら却下へ審査状態を遷移させる。"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "7806f0bfaa8e843977b0d6f1b935b143037c635c25de9d98ed5bfe0d13425d97",
          "input_kind": "actual_handoff",
          "packet_id": "P010",
          "line_start": 147,
          "line_end": 147,
          "quote": "申請済\t購入申請の判断を記録する\t却下\t上長の却下を記録し、この申請による購入を禁止する。"
        },
        {
          "source_file": "P010-packet.md",
          "input_sha256": "2b3b1785b59b949692e6f32becbcc659bfeb1534ebda2e416a0f0c29bce6b4a5",
          "input_kind": "full_stage2",
          "packet_id": "P010",
          "line_start": 186,
          "line_end": 186,
          "quote": "上長の承認を記録し、金額に応じた次の確認または購入判断へ進める。\t申請内容を確認して承認または却下を選び、判断を記録できること。"
        },
        {
          "source_file": "P010-packet.md",
          "input_sha256": "2b3b1785b59b949692e6f32becbcc659bfeb1534ebda2e416a0f0c29bce6b4a5",
          "input_kind": "full_stage2",
          "packet_id": "P010",
          "line_start": 83,
          "line_end": 83,
          "quote": "申請済\t却下\t上長の却下を記録し、この申請の購入を禁止する。"
        }
      ]
    }
  ],
  "limits": [
    "P020は期待結果の要約であり、引用中の元資料行番号に対応する元資料そのものはこのレビューの入力ではない。",
    "P020の見出しには「確認済みの期待結果」（2行）と「資料内の矛盾・記述の不一致」（17行）がある。入力packetに全体を「ドラフト」とする表記は見当たらない。F33の説明文に関するassertedな局所記述と、F34の不一致に関するunresolvedな確認対象を混同しない。",
    "対応資料のfull Stage2に見える文言を、実際のhandoffにはない意味の受領証拠として扱わない。"
  ]
}
