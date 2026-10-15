{
  "packet_id": "P029",
  "checks": [
    {
      "canonical_id": "F19",
      "local_meaning": "返却後、残る未返却貸出を再評価して遅延が3日未満となった場合、会員の返却遅延区分を3日以上7日未満から0日以上3日未満へ更新する。",
      "local_modality": "asserted",
      "scope": "蔵書返却フローでの返却記録後の再評価。元区分が3日以上7日未満である場合の状態遷移。",
      "evidence": [
        {
          "packet_id": "P029",
          "line_start": 84,
          "line_end": 84,
          "quote": "返却遅延区分\t3日以上7日未満\t0日以上3日未満\t返却後の未返却貸出を再評価し、遅延が3日未満になった場合に区分を更新する。"
        },
        {
          "packet_id": "P029",
          "line_start": 147,
          "line_end": 147,
          "quote": "返却遅延区分\t3日以上7日未満\t返却遅延区分を更新する\t0日以上3日未満\t返却後の未返却貸出を再評価し、遅延が3日未満になったことを反映する。"
        },
        {
          "packet_id": "P029",
          "line_start": 289,
          "line_end": 289,
          "quote": "返却遅延区分\t3日以上7日未満\t返却遅延区分を更新する\t0日以上3日未満\t返却後の未返却貸出を再評価し、遅延が3日未満になったことを反映する。"
        }
      ],
      "explicit_unknowns": [],
      "ambiguities": [],
      "correspondence_evidence": []
    },
    {
      "canonical_id": "F20",
      "local_meaning": "返却後にも別の貸出で3日以上7日未満の遅延が残る場合、会員の返却遅延区分を7日以上から3日以上7日未満へ更新する。",
      "local_modality": "asserted",
      "scope": "蔵書返却フローでの返却後、別の未返却貸出の遅延が3日以上7日未満に残る場合の状態遷移。",
      "evidence": [
        {
          "packet_id": "P029",
          "line_start": 85,
          "line_end": 85,
          "quote": "返却遅延区分\t7日以上\t3日以上7日未満\t返却後にも別の貸出で3日以上7日未満の遅延が残る場合に区分を更新する。"
        },
        {
          "packet_id": "P029",
          "line_start": 148,
          "line_end": 148,
          "quote": "返却遅延区分\t7日以上\t返却遅延区分を更新する\t3日以上7日未満\t返却後も別の貸出に3日以上7日未満の遅延が残ることを反映する。"
        },
        {
          "packet_id": "P029",
          "line_start": 290,
          "line_end": 290,
          "quote": "返却遅延区分\t7日以上\t返却遅延区分を更新する\t3日以上7日未満\t返却後も別の貸出に3日以上7日未満の遅延が残ることを反映する。"
        }
      ],
      "explicit_unknowns": [],
      "ambiguities": [],
      "correspondence_evidence": []
    },
    {
      "canonical_id": "F21",
      "local_meaning": "返却後の未返却貸出に3日以上の遅延がなくなった場合、会員の返却遅延区分を7日以上から0日以上3日未満へ更新する。",
      "local_modality": "asserted",
      "scope": "蔵書返却フローでの返却後、元区分が7日以上で、残る未返却貸出に3日以上の遅延がない場合の状態遷移。",
      "evidence": [
        {
          "packet_id": "P029",
          "line_start": 86,
          "line_end": 86,
          "quote": "返却遅延区分\t7日以上\t0日以上3日未満\t返却後の未返却貸出に3日以上の遅延がなくなった場合に区分を更新する。"
        },
        {
          "packet_id": "P029",
          "line_start": 149,
          "line_end": 149,
          "quote": "返却遅延区分\t7日以上\t返却遅延区分を更新する\t0日以上3日未満\t返却後に3日以上の遅延がなくなったことを反映する。"
        },
        {
          "packet_id": "P029",
          "line_start": 291,
          "line_end": 291,
          "quote": "返却遅延区分\t7日以上\t返却遅延区分を更新する\t0日以上3日未満\t返却後に3日以上の遅延がなくなったことを反映する。"
        }
      ],
      "explicit_unknowns": [],
      "ambiguities": [
        "残る未返却貸出がない場合に遅延日数をどう定義するかは、この局所記述に明記されない。"
      ],
      "correspondence_evidence": []
    }
  ],
  "limits": [
    "匿名packet内に全体をdraftとする明示的な表記は確認できない。対象の状態遷移は条件つきの記述として提示され、局所的に暫定・提案・未決との明示もない。",
    "複数の未返却貸出から会員単位の遅延を集約する計算規則や再評価の実行時刻は、対象箇所の引用から特定しない。",
    "対応するStage2 packetの指定はないため、correspondence_evidenceは空欄とした。"
  ]
}
