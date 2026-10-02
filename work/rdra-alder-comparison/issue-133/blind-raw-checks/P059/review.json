{
  "packet_id": "P059",
  "checks": [
    {
      "canonical_id": "F21",
      "local_meaning": "既存のpurchase_requestsスキーマを維持する要求。idはbigintの自動採番主キー、amount_yenは0以上の必須整数、itemは空でない必須文字列、statusはpending・approved・rejectedのいずれかの必須文字列とする。",
      "local_modality": "asserted",
      "scope": "Artifact 004の非機能要求として記載されたpurchase_requestsの既存スキーマ維持と列の型・必須性・値域。実際のDDLや実装完了の証明ではない。",
      "evidence": [
        {
          "packet_id": "P059",
          "line_start": 42,
          "line_end": 42,
          "quote": "既存のpurchase_requestsスキーマを維持し、idはbigintの自動採番主キー、amount_yenは0以上の必須整数、itemは空でない必須文字列、statusはpending・approved・rejectedのいずれかの必須文字列とすること"
        },
        {
          "packet_id": "P059",
          "line_start": 44,
          "line_end": 44,
          "quote": "今回のAPI実装範囲は申請・承認分岐と購入への引渡しまでとし、購入実行と結果連絡は含めないこと"
        }
      ],
      "explicit_unknowns": [
        "実際のDDL、制約の実装方法、移行手順、既存スキーマの全列はこの箇所で明示されていない。"
      ],
      "ambiguities": [
        "「既存のスキーマを維持」と各列の指定の関係について、既存定義そのものの提示はない。",
        "全体を草案と明示する文言はpacket内に見当たらず、この局所文は「とすること」という要求表現である。"
      ],
      "correspondence_evidence": []
    }
  ],
  "limits": [
    "指定IDはF21のみ。Stage2対応packetの指定はない。",
    "全体draft表記はpacket内の明示語として確認できないため、局所の要求表現を全体の確定済み実装に読み替えない。"
  ]
}
