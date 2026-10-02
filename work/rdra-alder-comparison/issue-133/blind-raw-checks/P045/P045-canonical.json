{
  "packet_id": "P045",
  "facts": [
    {
      "id": "F1",
      "meaning": "社員の購入申請は POST /purchase-requests で受け付ける。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 4,
          "line_end": 4,
          "quote": "社員の購入申請は `POST /purchase-requests` で受け付ける。"
        }
      ]
    },
    {
      "id": "F2",
      "meaning": "購入申請の amount_yen は0以上の整数である。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 4,
          "line_end": 4,
          "quote": "`amount_yen` は0以上の整数"
        }
      ]
    },
    {
      "id": "F3",
      "meaning": "購入申請の item は空でない文字列である。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 4,
          "line_end": 4,
          "quote": "`item` は空でない文字列"
        }
      ]
    },
    {
      "id": "F4",
      "meaning": "有効な申請には一意のIDを付け、金額・物品を記録し、状態を pending とする。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 4,
          "line_end": 4,
          "quote": "有効な申請には一意のIDを付け、金額・物品を記録して `pending` とし"
        }
      ]
    },
    {
      "id": "F5",
      "meaning": "有効な購入申請には201でIDと status=pending を返す。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 4,
          "line_end": 4,
          "quote": "201でIDと `status=pending` を返す。"
        }
      ]
    },
    {
      "id": "F6",
      "meaning": "不正な購入申請入力は400で受け付けない。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 4,
          "line_end": 4,
          "quote": "不正入力は400で受け付けない。"
        }
      ]
    },
    {
      "id": "F7",
      "meaning": "既存公開REST APIと purchase_requests の既存schemaを維持する。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 5,
          "line_end": 5,
          "quote": "既存公開REST APIと `purchase_requests` の既存schemaを維持し"
        }
      ]
    },
    {
      "id": "F8",
      "meaning": "実装にはTypeScriptとPostgreSQLを使う。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 5,
          "line_end": 5,
          "quote": "TypeScriptとPostgreSQLを使う。"
        }
      ]
    },
    {
      "id": "F9",
      "meaning": "既存schemaにはID、金額、物品、および pending・approved・rejected の状態に関する記載がある。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 5,
          "line_end": 5,
          "quote": "schemaにはID、金額、物品、`pending`・`approved`・`rejected` の状態に関する記載がある。"
        }
      ]
    },
    {
      "id": "F10",
      "meaning": "POST /purchase-requests/{id}/decision は対象申請の金額と現在状態を確認する。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 6,
          "line_end": 6,
          "quote": "`POST /purchase-requests/{id}/decision` は対象申請の金額と現在状態を確認し"
        }
      ]
    },
    {
      "id": "F11",
      "meaning": "10万円未満の申請の承認・却下は課長（manager）の役割が扱う。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 6,
          "line_end": 6,
          "quote": "10万円未満は課長（`manager`）"
        }
      ]
    },
    {
      "id": "F12",
      "meaning": "10万円以上の申請の承認・却下は部長（director）の役割が扱う。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 6,
          "line_end": 6,
          "quote": "10万円以上は部長（`director`）の役割による承認・却下を扱う。"
        }
      ]
    },
    {
      "id": "F13",
      "meaning": "金額に対応する役割による pending 申請の決定では、決定に従い approved または rejected に更新する。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 6,
          "line_end": 6,
          "quote": "対応する役割で対象が `pending` なら、決定どおり `approved` または `rejected` に更新し"
        }
      ]
    },
    {
      "id": "F14",
      "meaning": "金額に対応する役割による pending 申請の決定には、200でIDと決定後の状態を返す。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 6,
          "line_end": 6,
          "quote": "200でIDと決定後の状態を返す。"
        }
      ]
    },
    {
      "id": "F15",
      "meaning": "金額に対応しない役割による決定は403で拒否する。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 7,
          "line_end": 7,
          "quote": "金額に対応しない役割の決定は403"
        },
        {
          "line_start": 12,
          "line_end": 12,
          "quote": "金額に対応しない役割を403で拒否する"
        }
      ]
    },
    {
      "id": "F16",
      "meaning": "決定対象IDが存在しなければ404を返す。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 7,
          "line_end": 7,
          "quote": "対象IDが存在しなければ404"
        }
      ]
    },
    {
      "id": "F17",
      "meaning": "決定済み申請の再決定には先の決定を維持し、409を返す。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 7,
          "line_end": 7,
          "quote": "決定済み申請の再決定は先の決定を維持して409とする。"
        }
      ]
    },
    {
      "id": "F18",
      "meaning": "approved の申請だけが購買担当による購入に進む。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 8,
          "line_end": 8,
          "quote": "`approved` の申請だけが購買担当による購入に進み"
        }
      ]
    },
    {
      "id": "F19",
      "meaning": "rejected の申請は購入しない。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 8,
          "line_end": 8,
          "quote": "`rejected` の申請は購入しない。"
        }
      ]
    },
    {
      "id": "F20",
      "meaning": "業務全体では購入結果を申請者に伝える。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 8,
          "line_end": 8,
          "quote": "業務全体では購入結果を申請者に伝える"
        }
      ]
    },
    {
      "id": "F21",
      "meaning": "購入実行と購入結果の連絡は今回のAPI実装範囲外で、具体的方法は保留されている。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 8,
          "line_end": 8,
          "quote": "購入実行と結果連絡は今回のAPI実装範囲外である。"
        },
        {
          "line_start": 13,
          "line_end": 13,
          "quote": "具体的方法は今回のAPI実装範囲外として保留されている。"
        }
      ]
    },
    {
      "id": "F22",
      "meaning": "決定APIの role 値だけで権限を判断してよいか、実際の課長・部長の本人性と役職を別途照合するかは未確認である。",
      "modality": "unresolved",
      "evidence": [
        {
          "line_start": 12,
          "line_end": 12,
          "quote": "`role` 値だけで権限を判断してよいか、実際の課長・部長の本人性と役職を別途照合するかは未確認。"
        },
        {
          "line_start": 18,
          "line_end": 18,
          "quote": "`role` の値だけで決定権限を判断できるかは明示的に未確認"
        }
      ]
    },
    {
      "id": "F23",
      "meaning": "本人性・役職の照合が必要な場合、誰のどの情報を使うかは未決である。",
      "modality": "unresolved",
      "evidence": [
        {
          "line_start": 12,
          "line_end": 12,
          "quote": "照合が必要なら、誰のどの情報を使うか"
        }
      ]
    },
    {
      "id": "F24",
      "meaning": "本人性・役職の確認ができない決定をどう扱うかは未決である。",
      "modality": "unresolved",
      "evidence": [
        {
          "line_start": 12,
          "line_end": 12,
          "quote": "確認不能な決定をどう扱うかも未決である。"
        }
      ]
    },
    {
      "id": "F25",
      "meaning": "認証・照合方式および確認不能時の応答は確定していない。",
      "modality": "unresolved",
      "evidence": [
        {
          "line_start": 12,
          "line_end": 12,
          "quote": "認証・照合方式や確認不能時の応答を確定させない。"
        }
      ]
    },
    {
      "id": "F26",
      "meaning": "framework、layer構成、Repository/Service等の指定はない。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 13,
          "line_end": 13,
          "quote": "framework、layer構成、Repository/Service等の指定もなく"
        }
      ]
    },
    {
      "id": "F27",
      "meaning": "技術条件から業務上の承認条件を追加しない。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 13,
          "line_end": 13,
          "quote": "技術条件から業務上の承認条件を追加しない。"
        }
      ]
    },
    {
      "id": "F28",
      "meaning": "草案は人による内容確認が未了で、草案全体は最終合意済みではない。",
      "modality": "unresolved",
      "evidence": [
        {
          "line_start": 14,
          "line_end": 14,
          "quote": "草案の人による内容確認は未了であるため、草案全体を最終合意済みとして扱わない。"
        }
      ]
    },
    {
      "id": "F29",
      "meaning": "追加の承認条件はないとの記述がある。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 18,
          "line_end": 18,
          "quote": "「追加の承認条件はない」との記述はあるが"
        }
      ]
    },
    {
      "id": "F30",
      "meaning": "追加の承認条件がないとの記述から、本人性・役職の照合が不要とは結論付けない。",
      "modality": "asserted",
      "evidence": [
        {
          "line_start": 18,
          "line_end": 18,
          "quote": "この記述を根拠に本人性・役職の照合が不要と結論付けない。"
        }
      ]
    }
  ],
  "questions": [
    {
      "id": "Q1",
      "meaning": "決定APIに渡された role 値だけで権限を判断してよいか、それとも実際の課長・部長の本人性と役職を別途照合するか。",
      "evidence": [
        {
          "line_start": 12,
          "line_end": 12,
          "quote": "`role` 値だけで権限を判断してよいか、実際の課長・部長の本人性と役職を別途照合するかは未確認。"
        }
      ]
    },
    {
      "id": "Q2",
      "meaning": "照合が必要な場合、誰のどの情報を使うか。",
      "evidence": [
        {
          "line_start": 12,
          "line_end": 12,
          "quote": "照合が必要なら、誰のどの情報を使うか"
        }
      ]
    },
    {
      "id": "Q3",
      "meaning": "確認不能な決定をどう扱い、どの応答を返すか。",
      "evidence": [
        {
          "line_start": 12,
          "line_end": 12,
          "quote": "確認不能な決定をどう扱うかも未決である。"
        },
        {
          "line_start": 12,
          "line_end": 12,
          "quote": "確認不能時の応答を確定させない。"
        }
      ]
    }
  ],
  "contradictions": [],
  "additional_human_inputs": [
    {
      "meaning": "草案の内容について人による確認が必要である。",
      "required": true,
      "evidence": [
        {
          "line_start": 14,
          "line_end": 14,
          "quote": "草案の人による内容確認は未了である"
        }
      ]
    }
  ],
  "limitations": [
    "資料は他の行への参照を含む要約であり、参照先の原文はこのpacket内にない。",
    "資料には明確な矛盾は見当たらないとの記述がある。"
  ]
}
