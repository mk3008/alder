{
  "packet_id": "P042",
  "checks": [
    {
      "canonical_id": "F8",
      "local_meaning": "上長が承認した高額の購入申請を追加確認対象として確認待ちにし、高額購買確認担当者が物品と金額を見て購入可否を判断し、申請へ結果を記録する。",
      "local_modality": "asserted",
      "scope": "承認済みで高額に区分される申請の追加確認。確認待ちから購入可能なら確認済み、不可なら購入不可へ進む状態表現。金額基準そのものは含まれない。",
      "evidence": [
        {
          "packet_id": "P042",
          "line_start": 43,
          "line_end": 43,
          "quote": "上長が承認した申請のうち高額なものを追加確認の対象とする。"
        },
        {
          "packet_id": "P042",
          "line_start": 44,
          "line_end": 44,
          "quote": "申請物品と金額を確認し、高額な支出を進めてよいか判断する。"
        },
        {
          "packet_id": "P042",
          "line_start": 45,
          "line_end": 45,
          "quote": "確認結果を申請に記録し、確認が済まないか進行不可の場合は購入に進めない。"
        },
        {
          "packet_id": "P042",
          "line_start": 153,
          "line_end": 153,
          "quote": "上長が承認した申請のうち申請金額が高額に区分されるものを追加確認の対象とし、確認待ちとして高額購買確認担当者に回す条件。"
        },
        {
          "packet_id": "P042",
          "line_start": 167,
          "line_end": 167,
          "quote": "高額購入追加確認状態\t確認待ち\t高額申請を購入可能と判断する\t確認済み"
        },
        {
          "packet_id": "P042",
          "line_start": 168,
          "line_end": 168,
          "quote": "高額購入追加確認状態\t確認待ち\t高額申請を購入不可と判断する\t購入不可"
        },
        {
          "packet_id": "P042",
          "line_start": 60,
          "line_end": 60,
          "quote": "高額とする金額の基準は初期要望と入力資料では指定されていない。"
        }
      ],
      "explicit_unknowns": [
        "高額とする金額の基準は初期要望と入力資料で未指定（packet 60行）。"
      ],
      "ambiguities": [],
      "correspondence_evidence": []
    },
    {
      "canonical_id": "F9",
      "local_meaning": "高額申請は上長承認に加えて追加確認で購入可能と判断され、確認済みになった場合だけ購入へ進む。確認が済まない場合または進行不可の場合は進めず、購入不可も購入対象にならない。",
      "local_modality": "asserted",
      "scope": "高額申請の購入可否と購買担当の購入対象への移行条件。通常申請の処理条件とは区別され、実際の購入成功を保証する意味ではない。",
      "evidence": [
        {
          "packet_id": "P042",
          "line_start": 61,
          "line_end": 61,
          "quote": "高額な購入申請は、上長の承認と追加確認の結果によって購入可能と判断された場合に限り購入へ進める。"
        },
        {
          "packet_id": "P042",
          "line_start": 45,
          "line_end": 45,
          "quote": "確認が済まないか進行不可の場合は購入に進めない。"
        },
        {
          "packet_id": "P042",
          "line_start": 69,
          "line_end": 69,
          "quote": "通常の承認に加えて確認済みとなった場合だけ購入に進める。"
        },
        {
          "packet_id": "P042",
          "line_start": 155,
          "line_end": 155,
          "quote": "確認待ちの高額申請について追加確認の結果を購入可能な確認済みか購入不可かで判断し、確認済みの場合だけ購入に進める条件。"
        },
        {
          "packet_id": "P042",
          "line_start": 86,
          "line_end": 86,
          "quote": "承認と追加確認を満たした高額申請を購入対象にする。"
        },
        {
          "packet_id": "P042",
          "line_start": 116,
          "line_end": 116,
          "quote": "却下・購入不可の申請を購入対象として扱わないこと。"
        },
        {
          "packet_id": "P042",
          "line_start": 60,
          "line_end": 60,
          "quote": "高額とする金額の基準は初期要望と入力資料では指定されていない。"
        }
      ],
      "explicit_unknowns": [
        "高額とする金額の基準は初期要望と入力資料で未指定（packet 60行）。"
      ],
      "ambiguities": [],
      "correspondence_evidence": []
    }
  ],
  "limits": [
    "許可されたpacket本文に全体の「draft／ドラフト」表記や局所の暫定・提案表記は見当たらず、引用された局所条件は断定形として記載される。高額判定の金額基準は60行で明示的に未指定。",
    "匿名Stage2対応packetはreview-targets.jsonでnullのため、correspondence_evidenceは空。"
  ]
}
