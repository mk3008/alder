{
  "packet_id": "P054",
  "checks": [
    {
      "canonical_id": "F18",
      "local_meaning": "高額申請フローの審査画面の行に課長が結び付き、その画面要求は10万円未満を扱うと記す、という資料内の不整合の記述。課長が高額申請を審査する確定ルールではない。",
      "local_modality": "asserted",
      "scope": "「10万円以上の購入申請承認フロー」の審査画面対応行とその画面要求に限定。",
      "evidence": [
        {
          "packet_id": "P054",
          "line_start": 16,
          "line_end": 16,
          "quote": "## 資料内の矛盾・整合しない記載"
        },
        {
          "packet_id": "P054",
          "line_start": 18,
          "line_end": 18,
          "quote": "「10万円以上の購入申請承認フロー」の審査画面に**課長**が結び付けられ、画面要求は**10万円未満**の申請を扱うと書かれている"
        },
        {
          "packet_id": "P054",
          "line_start": 18,
          "line_end": 18,
          "quote": "この行を根拠に高額申請を課長に審査させるとは確定できない"
        }
      ],
      "explicit_unknowns": [
        "この矛盾する画面対応の意図・訂正先は資料から確定できない。"
      ],
      "ambiguities": [
        "同じ高額フロー内の部長による審査説明および金額別役割と、課長・10万円未満の画面行が整合しない。"
      ],
      "handoff_visibility": "actual_handoff",
      "correspondence_evidence": [
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "51d7b4e54ccabd15cc0f9e667fcd94c54887e070a01dd868b80e73ecc160f818",
          "input_kind": "actual_handoff",
          "packet_id": "P056",
          "line_start": 10,
          "line_end": 10,
          "quote": "10万円以上の購入申請承認フロー\t\t購入申請を審査する\t↓\t購入申請を審査する\t画面\t購入申請審査画面\tアクター\t課長\t部長が申請内容を共通の承認条件で確認し、承認または却下を判断する。\t10万円未満の申請内容と共通の承認条件を確認し、承認または却下を判断できること。"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "51d7b4e54ccabd15cc0f9e667fcd94c54887e070a01dd868b80e73ecc160f818",
          "input_kind": "actual_handoff",
          "packet_id": "P056",
          "line_start": 9,
          "line_end": 9,
          "quote": "購入申請審査画面\tアクター\t部長\t部長が申請内容を共通の承認条件で確認し、承認または却下を判断する。\t10万円以上の申請内容と共通の承認条件を確認し、承認または却下を判断できること。"
        }
      ]
    },
    {
      "canonical_id": "F19",
      "local_meaning": "同じ高額申請フローの説明は部長による審査であり、金額別の役割も10万円以上を部長とする、と述べる。",
      "local_modality": "asserted",
      "scope": "10万円以上の購入申請承認フローの説明と金額別役割。画面行の課長表記との不整合を示す文脈。",
      "evidence": [
        {
          "packet_id": "P054",
          "line_start": 16,
          "line_end": 16,
          "quote": "## 資料内の矛盾・整合しない記載"
        },
        {
          "packet_id": "P054",
          "line_start": 18,
          "line_end": 18,
          "quote": "このフローの説明は部長による審査で、金額区分と役割の定義も10万円以上を部長、未満を課長としている"
        }
      ],
      "explicit_unknowns": [
        "画面行の課長表記との整合方法は確定していない。"
      ],
      "ambiguities": [
        "同じフローの画面対応行と説明の役職が異なる。"
      ],
      "handoff_visibility": "actual_handoff",
      "correspondence_evidence": [
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "51d7b4e54ccabd15cc0f9e667fcd94c54887e070a01dd868b80e73ecc160f818",
          "input_kind": "actual_handoff",
          "packet_id": "P056",
          "line_start": 9,
          "line_end": 9,
          "quote": "10万円以上の購入申請承認フロー\t\t購入申請を審査する\t↓\t購入申請を審査する\t画面\t購入申請審査画面\tアクター\t部長\t部長が申請内容を共通の承認条件で確認し、承認または却下を判断する。\t10万円以上の申請内容と共通の承認条件を確認し、承認または却下を判断できること。"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "51d7b4e54ccabd15cc0f9e667fcd94c54887e070a01dd868b80e73ecc160f818",
          "input_kind": "actual_handoff",
          "packet_id": "P056",
          "line_start": 80,
          "line_end": 80,
          "quote": "高額購入申請の承認部長\t10万円以上の購入申請を共通の承認条件で審査し、承認または却下の判断と結果を記録する。"
        }
      ]
    },
    {
      "canonical_id": "F20",
      "local_meaning": "高額申請フローの「承認結果を記録する」の画面対応行にも課長が結び付く、という資料内の行の存在。課長が高額申請の結果記録を担当すると確定するものではない。",
      "local_modality": "asserted",
      "scope": "10万円以上の購入申請承認フローの承認結果記録行に限定。",
      "evidence": [
        {
          "packet_id": "P054",
          "line_start": 16,
          "line_end": 16,
          "quote": "## 資料内の矛盾・整合しない記載"
        },
        {
          "packet_id": "P054",
          "line_start": 19,
          "line_end": 19,
          "quote": "同じ高額申請フローの「承認結果を記録する」行にも**課長**が結び付く"
        }
      ],
      "explicit_unknowns": [
        "この課長対応の意図・訂正先は資料だけでは確定できない。"
      ],
      "ambiguities": [
        "行の課長と同じ行の「部長による承認の判断」の説明が食い違う。"
      ],
      "handoff_visibility": "actual_handoff",
      "correspondence_evidence": [
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "51d7b4e54ccabd15cc0f9e667fcd94c54887e070a01dd868b80e73ecc160f818",
          "input_kind": "actual_handoff",
          "packet_id": "P056",
          "line_start": 15,
          "line_end": 15,
          "quote": "10万円以上の購入申請承認フロー\t\t承認結果を記録する\t↓\t購入申請の承認結果を記録する\t画面\t承認結果記録画面\tアクター\t課長\t部長による承認の判断を申請に記録し、承認済みとして購入へ進める。"
        }
      ]
    },
    {
      "canonical_id": "F21",
      "local_meaning": "高額申請フローの承認結果記録の説明は部長による承認判断を申請に記録するものであり、資料の高額申請の条件も部長による判断・結果記録を記す。",
      "local_modality": "asserted",
      "scope": "10万円以上の申請に関する説明・役割の範囲。承認結果記録画面の課長対応行との不整合を示す。",
      "evidence": [
        {
          "packet_id": "P054",
          "line_start": 16,
          "line_end": 16,
          "quote": "## 資料内の矛盾・整合しない記載"
        },
        {
          "packet_id": "P054",
          "line_start": 19,
          "line_end": 19,
          "quote": "説明は「部長による承認の判断」であり、高額申請を部長が判断・記録するという記載と食い違う"
        }
      ],
      "explicit_unknowns": [
        "課長を結び付けた画面対応行との整合方法は確定していない。"
      ],
      "ambiguities": [
        "高額フローの記録行のアクター欄には部長と課長がともに現れる。"
      ],
      "handoff_visibility": "actual_handoff",
      "correspondence_evidence": [
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "51d7b4e54ccabd15cc0f9e667fcd94c54887e070a01dd868b80e73ecc160f818",
          "input_kind": "actual_handoff",
          "packet_id": "P056",
          "line_start": 14,
          "line_end": 14,
          "quote": "承認結果記録画面\tアクター\t部長\t部長による承認の判断を申請に記録し、承認済みとして購入へ進める。"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "51d7b4e54ccabd15cc0f9e667fcd94c54887e070a01dd868b80e73ecc160f818",
          "input_kind": "actual_handoff",
          "packet_id": "P056",
          "line_start": 15,
          "line_end": 15,
          "quote": "承認結果記録画面\tアクター\t課長\t部長による承認の判断を申請に記録し、承認済みとして購入へ進める。"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "51d7b4e54ccabd15cc0f9e667fcd94c54887e070a01dd868b80e73ecc160f818",
          "input_kind": "actual_handoff",
          "packet_id": "P056",
          "line_start": 104,
          "line_end": 104,
          "quote": "高額申請の部長承認\t購入申請の金額が10万円以上の場合は部長へ審査を回付し、部長の承認または却下を記録する。"
        }
      ]
    },
    {
      "canonical_id": "F22",
      "local_meaning": "共通名の審査UCと承認結果記録UCには高額側の部長、少額側の課長それぞれの説明が対応し、UC名だけでは金額別の担当者を一律に定められない。",
      "local_modality": "asserted",
      "scope": "同名UCの説明・対応関係と金額別フローの区別に限る。",
      "evidence": [
        {
          "packet_id": "P054",
          "line_start": 16,
          "line_end": 16,
          "quote": "## 資料内の矛盾・整合しない記載"
        },
        {
          "packet_id": "P054",
          "line_start": 20,
          "line_end": 20,
          "quote": "共通名のUC「購入申請を審査する」「購入申請の承認結果を記録する」には、高額側の部長と少額側の課長それぞれの説明が対応する"
        },
        {
          "packet_id": "P054",
          "line_start": 20,
          "line_end": 20,
          "quote": "UC説明の列には同じUC名で部長・課長双方の説明が現れる"
        },
        {
          "packet_id": "P054",
          "line_start": 20,
          "line_end": 20,
          "quote": "UC名だけから審査者を一律に決めると金額別の定義と整合しない"
        }
      ],
      "explicit_unknowns": [
        "共通UC名だけから各申請の担当者や画面行の曖昧な対応を確定できない。"
      ],
      "ambiguities": [
        "同名UCの説明が金額別に部長・課長の双方として現れる。"
      ],
      "handoff_visibility": "actual_handoff",
      "correspondence_evidence": [
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "51d7b4e54ccabd15cc0f9e667fcd94c54887e070a01dd868b80e73ecc160f818",
          "input_kind": "actual_handoff",
          "packet_id": "P056",
          "line_start": 6,
          "line_end": 6,
          "quote": "購入申請を審査する\t↓\t購入申請を審査する\t情報\t購入申請\t\t\t部長が申請内容を共通の承認条件で確認し、承認または却下を判断する。"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "51d7b4e54ccabd15cc0f9e667fcd94c54887e070a01dd868b80e73ecc160f818",
          "input_kind": "actual_handoff",
          "packet_id": "P056",
          "line_start": 22,
          "line_end": 22,
          "quote": "10万円未満の購入申請承認フロー\t\t購入申請を審査する\t↓\t購入申請を審査する\t条件\t少額申請の課長承認\t\t\t課長が申請内容を共通の承認条件で確認し、承認または却下を判断する。"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "51d7b4e54ccabd15cc0f9e667fcd94c54887e070a01dd868b80e73ecc160f818",
          "input_kind": "actual_handoff",
          "packet_id": "P056",
          "line_start": 11,
          "line_end": 11,
          "quote": "承認結果を記録する\t↓\t購入申請の承認結果を記録する\t情報\t購入申請\t\t\t部長による承認の判断を申請に記録し、承認済みとして購入へ進める。"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "51d7b4e54ccabd15cc0f9e667fcd94c54887e070a01dd868b80e73ecc160f818",
          "input_kind": "actual_handoff",
          "packet_id": "P056",
          "line_start": 23,
          "line_end": 23,
          "quote": "10万円未満の購入申請承認フロー\t\t承認結果を記録する\t↓\t購入申請の承認結果を記録する\t条件\t少額申請の課長承認\t\t\t課長による承認の判断を申請に記録し、承認済みとして購入へ進める。"
        }
      ]
    }
  ],
  "limits": [
    "自身の資料では「確認済みの期待結果」（2行）と「明示された未決事項」（10行）、「資料内の矛盾・整合しない記載」（16行）が分かれる。全体をdraftとする明示ラベルは見当たらず、対象5件のassertedは矛盾する記載の存在を述べる局所的な記述であり、相反する業務役割の解消ではない。",
    "P054の本文が参照する別の「packet.md」の原文は許可された入力に含まれず、その行番号の直接照合はできない。",
    "対応Stage2の引用は受領済みhandoffの範囲を示すためだけに用い、自身の資料の意味を補完しない。"
  ]
}
