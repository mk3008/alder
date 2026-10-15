{
  "packet_id": "P045",
  "checks": [
    {
      "canonical_id": "F7",
      "local_meaning": "既存の公開REST APIおよび purchase_requests の既存schemaを維持するという技術条件。",
      "local_modality": "asserted",
      "scope": "既存の公開APIと既存テーブルschemaの維持。具体的なAPI全体の形状やschema列定義まではこの命題だけで確定しない。",
      "evidence": [
        {
          "packet_id": "P045",
          "line_start": 2,
          "line_end": 2,
          "quote": "確認済みの期待結果"
        },
        {
          "packet_id": "P045",
          "line_start": 5,
          "line_end": 5,
          "quote": "既存公開REST APIと `purchase_requests` の既存schemaを維持し"
        },
        {
          "packet_id": "P045",
          "line_start": 14,
          "line_end": 14,
          "quote": "草案の人による内容確認は未了であるため、草案全体を最終合意済みとして扱わない。"
        }
      ],
      "explicit_unknowns": [
        "既存公開REST APIの全エンドポイント・契約の詳細は自身のpacketには列挙されない。",
        "schemaの列型・制約の厳密な定義は自身のpacketのF7の記述にはない。",
        "草案全体の人による内容確認は未了。"
      ],
      "ambiguities": [
        "「維持する」の具体的な互換性判定範囲は自身のpacketでは詳述されない。"
      ],
      "handoff_visibility": "actual_handoff",
      "correspondence_evidence": [
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "e1cbb6ccdae550843fc67764e8dd3b36e801e99eb99258e144a7fc4e0cc5cf6f",
          "input_kind": "actual_handoff",
          "packet_id": "P049",
          "line_start": 12,
          "line_end": 12,
          "quote": "既存公開REST APIと既存schemaを維持する。"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "e1cbb6ccdae550843fc67764e8dd3b36e801e99eb99258e144a7fc4e0cc5cf6f",
          "input_kind": "actual_handoff",
          "packet_id": "P049",
          "line_start": 95,
          "line_end": 95,
          "quote": "既存の `purchase_requests` は"
        }
      ]
    },
    {
      "canonical_id": "F9",
      "local_meaning": "既存schemaにID、金額、物品、および pending・approved・rejected の状態の記載がある。",
      "local_modality": "asserted",
      "scope": "既存schemaについてpacketが列挙した項目と状態名。データ型やSQL制約の逐語的仕様はこの局所記載からは決めない。",
      "evidence": [
        {
          "packet_id": "P045",
          "line_start": 2,
          "line_end": 2,
          "quote": "確認済みの期待結果"
        },
        {
          "packet_id": "P045",
          "line_start": 5,
          "line_end": 5,
          "quote": "schemaにはID、金額、物品、`pending`・`approved`・`rejected` の状態に関する記載がある。"
        },
        {
          "packet_id": "P045",
          "line_start": 14,
          "line_end": 14,
          "quote": "草案の人による内容確認は未了であるため、草案全体を最終合意済みとして扱わない。"
        }
      ],
      "explicit_unknowns": [
        "自身のpacketは列の厳密なSQL定義と制約式を明記していない。",
        "草案全体の人による内容確認は未了。"
      ],
      "ambiguities": [
        "「状態に関する記載」が列の型・制約式まで意味するかは自身のpacketだけでは特定されない。"
      ],
      "handoff_visibility": "actual_handoff",
      "correspondence_evidence": [
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "e1cbb6ccdae550843fc67764e8dd3b36e801e99eb99258e144a7fc4e0cc5cf6f",
          "input_kind": "actual_handoff",
          "packet_id": "P049",
          "line_start": 42,
          "line_end": 42,
          "quote": "申請ID"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "e1cbb6ccdae550843fc67764e8dd3b36e801e99eb99258e144a7fc4e0cc5cf6f",
          "input_kind": "actual_handoff",
          "packet_id": "P049",
          "line_start": 43,
          "line_end": 43,
          "quote": "金額（円）"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "e1cbb6ccdae550843fc67764e8dd3b36e801e99eb99258e144a7fc4e0cc5cf6f",
          "input_kind": "actual_handoff",
          "packet_id": "P049",
          "line_start": 44,
          "line_end": 44,
          "quote": "物品"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "e1cbb6ccdae550843fc67764e8dd3b36e801e99eb99258e144a7fc4e0cc5cf6f",
          "input_kind": "actual_handoff",
          "packet_id": "P049",
          "line_start": 45,
          "line_end": 45,
          "quote": "状態（pending、approved、rejected）"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "e1cbb6ccdae550843fc67764e8dd3b36e801e99eb99258e144a7fc4e0cc5cf6f",
          "input_kind": "actual_handoff",
          "packet_id": "P049",
          "line_start": 95,
          "line_end": 95,
          "quote": "既存の `purchase_requests` は `id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY`、`amount_yen integer NOT NULL CHECK(amount_yen>=0)`、`item text NOT NULL CHECK(length(item)>0)`、`status text NOT NULL CHECK(status IN ('pending','approved','rejected'))` を維持する。"
        }
      ]
    },
    {
      "canonical_id": "F10",
      "local_meaning": "決定APIは対象の購入申請を参照し、金額と現在の状態を確認する。",
      "local_modality": "asserted",
      "scope": "POST /purchase-requests/{id}/decision の決定処理における対象申請の参照と金額・現状態の確認。役割や本人性の照合方式までは含めない。",
      "evidence": [
        {
          "packet_id": "P045",
          "line_start": 2,
          "line_end": 2,
          "quote": "確認済みの期待結果"
        },
        {
          "packet_id": "P045",
          "line_start": 6,
          "line_end": 6,
          "quote": "`POST /purchase-requests/{id}/decision` は対象申請の金額と現在状態を確認し"
        },
        {
          "packet_id": "P045",
          "line_start": 12,
          "line_end": 12,
          "quote": "`role` 値だけで権限を判断してよいか、実際の課長・部長の本人性と役職を別途照合するかは未確認。"
        },
        {
          "packet_id": "P045",
          "line_start": 14,
          "line_end": 14,
          "quote": "草案の人による内容確認は未了であるため、草案全体を最終合意済みとして扱わない。"
        }
      ],
      "explicit_unknowns": [
        "決定APIに渡されたrole値だけで権限を判断できるか、本人性と役職の別途照合が要るかは未確認。",
        "照合が必要な場合の情報と確認不能時の扱いは未決。",
        "草案全体の人による内容確認は未了。"
      ],
      "ambiguities": [
        "金額と状態の確認の具体的な実装手順や順序は自身のpacketでは定めない。"
      ],
      "handoff_visibility": "actual_handoff",
      "correspondence_evidence": [
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "e1cbb6ccdae550843fc67764e8dd3b36e801e99eb99258e144a7fc4e0cc5cf6f",
          "input_kind": "actual_handoff",
          "packet_id": "P049",
          "line_start": 131,
          "line_end": 131,
          "quote": "公開REST APIの `POST /purchase-requests/{id}/decision`。"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "e1cbb6ccdae550843fc67764e8dd3b36e801e99eb99258e144a7fc4e0cc5cf6f",
          "input_kind": "actual_handoff",
          "packet_id": "P049",
          "line_start": 142,
          "line_end": 142,
          "quote": "対象の購入申請を参照し、金額と現在の状態を確認する。"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "e1cbb6ccdae550843fc67764e8dd3b36e801e99eb99258e144a7fc4e0cc5cf6f",
          "input_kind": "actual_handoff",
          "packet_id": "P049",
          "line_start": 6,
          "line_end": 6,
          "quote": "APIに渡された `role` の値だけで決定権限を判断してよいか。"
        }
      ]
    }
  ],
  "limits": [
    "自身のpacketは確認済み期待結果を局所的に列挙する一方、草案全体の人による内容確認は未了と記す。局所assertedを草案全体の最終合意と同一視しない。",
    "対応証拠は実際に受領した匿名handoff内にある。full Stage2の存在を受領証拠の代替にはしていない。",
    "正誤・採点・元資料との照合は行っていない。"
  ]
}
