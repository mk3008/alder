{
  "packet_id": "P005",
  "checks": [
    {
      "canonical_id": "F2",
      "local_meaning": "貸出可否は会員種別と、未返却の貸出記録を基にした返却遅延日数で判断する。資料はこの試験における判定条件をその二つに限定している。",
      "local_modality": "asserted",
      "scope": "貸出可否の判定。未返却記録に基づく遅延日数と会員種別を用いる、この試験の条件範囲。",
      "evidence": [
        {
          "packet_id": "P005",
          "line_start": 55,
          "line_end": 55,
          "quote": "貸出可否は会員種別と未返却の貸出記録に基づく返却遅延日数で判断する。この試験ではそれ以外の貸出条件を扱わない。"
        },
        {
          "packet_id": "P005",
          "line_start": 43,
          "line_end": 43,
          "quote": "大人は3日未満、子供は7日未満の返却遅延だけ貸出可とし、会員種別と遅延日数だけで判断する。"
        }
      ],
      "explicit_unknowns": [
        "未返却記録がない場合の遅延日数および区分の扱いは、この資料に記載がない。",
        "複数の未返却記録から会員の判定用遅延日数をどう代表させるかは、この資料に記載がない。"
      ],
      "ambiguities": [
        "「この試験では」という限定があり、試験外の貸出条件一般には広げられない。"
      ],
      "correspondence_evidence": []
    },
    {
      "canonical_id": "F4",
      "local_meaning": "貸出可否の判定では未返却の貸出記録だけを対象とし、返却済の記録は遅延日数の判定から外す。",
      "local_modality": "asserted",
      "scope": "貸出可否に用いる遅延日数の判定対象。返却状態を更新した後の対象除外にも言及する。",
      "evidence": [
        {
          "packet_id": "P005",
          "line_start": 139,
          "line_end": 139,
          "quote": "貸出可否の判定では未返却の貸出記録だけを対象とし、返却済の記録は遅延日数の判定から除外する。"
        },
        {
          "packet_id": "P005",
          "line_start": 143,
          "line_end": 143,
          "quote": "貸出記録を未返却から返却済に更新した時点でその記録を遅延日数の判定対象から外し"
        }
      ],
      "explicit_unknowns": [
        "対象の未返却記録がゼロとなった場合の遅延日数・区分は、この資料に記載がない。"
      ],
      "ambiguities": [],
      "correspondence_evidence": []
    },
    {
      "canonical_id": "F55",
      "local_meaning": "コンテキスト付き状態モデル表では「蔵書の貸出状態」と「貸出の返却状態」の行が会員管理、「返却遅延日数区分」の行が蔵書管理に配置されている。",
      "local_modality": "asserted",
      "scope": "Artifact 027の「コンテキスト」「状態モデル」列の記載上の配置。業務上の責任者、実装上の所有権、配置理由は表からは定まらない。",
      "evidence": [
        {
          "packet_id": "P005",
          "line_start": 285,
          "line_end": 285,
          "quote": "コンテキスト\t状態モデル\t状態"
        },
        {
          "packet_id": "P005",
          "line_start": 286,
          "line_end": 286,
          "quote": "会員管理\t蔵書の貸出状態"
        },
        {
          "packet_id": "P005",
          "line_start": 289,
          "line_end": 289,
          "quote": "蔵書管理\t返却遅延日数区分"
        },
        {
          "packet_id": "P005",
          "line_start": 295,
          "line_end": 295,
          "quote": "会員管理\t貸出の返却状態"
        }
      ],
      "explicit_unknowns": [
        "このコンテキスト配置を選んだ理由は明記されていない。",
        "表のコンテキスト欄が実装上の所有権や業務責任を意味するかは明記されていない。"
      ],
      "ambiguities": [
        "Artifact 025の情報表では、蔵書の行に蔵書の貸出状態等、貸出の行に返却遅延日数区分等が状態モデル列として列挙されているが、Artifact 027のコンテキスト配置と同一の関係・所有権とは明記されていない。"
      ],
      "correspondence_evidence": []
    },
    {
      "canonical_id": "F56",
      "local_meaning": "コンテキスト付き情報表では、会員情報は会員管理、蔵書は蔵書管理、貸出は貸出管理の各行に配置されている。",
      "local_modality": "asserted",
      "scope": "Artifact 016とArtifact 025の「コンテキスト」「情報」列の記載上の配置。実装の境界や業務責任の詳細は含めない。",
      "evidence": [
        {
          "packet_id": "P005",
          "line_start": 132,
          "line_end": 132,
          "quote": "コンテキスト\t情報\t属性"
        },
        {
          "packet_id": "P005",
          "line_start": 133,
          "line_end": 133,
          "quote": "会員管理\t会員情報"
        },
        {
          "packet_id": "P005",
          "line_start": 134,
          "line_end": 134,
          "quote": "蔵書管理\t蔵書"
        },
        {
          "packet_id": "P005",
          "line_start": 135,
          "line_end": 135,
          "quote": "貸出管理\t貸出"
        },
        {
          "packet_id": "P005",
          "line_start": 271,
          "line_end": 271,
          "quote": "コンテキスト\t情報\t属性"
        },
        {
          "packet_id": "P005",
          "line_start": 272,
          "line_end": 272,
          "quote": "会員管理\t会員情報"
        },
        {
          "packet_id": "P005",
          "line_start": 273,
          "line_end": 273,
          "quote": "蔵書管理\t蔵書"
        },
        {
          "packet_id": "P005",
          "line_start": 274,
          "line_end": 274,
          "quote": "貸出管理\t貸出"
        }
      ],
      "explicit_unknowns": [
        "情報配置から実装上のデータ所有権や更新責任をどう定義するかは明記されていない。"
      ],
      "ambiguities": [],
      "correspondence_evidence": []
    }
  ],
  "limits": [
    "匿名packetには全体をdraft／草案と明示する文言、および対象4命題を暫定・提案・未決とする局所文言が見当たらない。したがって各local_modalityは該当する表・条件の断定的記載に基づくassertedであり、資料全体の確定承認状態は推定しない。",
    "匿名対応Stage2はreview-targets.jsonで指定されていないため、correspondence_evidenceは空配列とした。"
  ]
}
