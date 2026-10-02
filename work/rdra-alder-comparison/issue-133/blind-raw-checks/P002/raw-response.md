{
  "packet_id": "P002",
  "checks": [
    {
      "canonical_id": "F23",
      "local_meaning": "会議室管理の情報「会議室」の属性として、会議室ID、会議室名、所在地、収容人数、設備、利用開始時刻、利用終了時刻が列挙される。空室検索や予約申込の対象となる会議室についての情報である。",
      "local_modality": "asserted",
      "scope": "「会議室」の属性欄と情報・属性の対応表に限る。各属性の必須性、型、値域、更新責任、利用開始・終了時刻の具体的な運用はここでは定義されていない。",
      "evidence": [
        {
          "packet_id": "P002",
          "line_start": 136,
          "line_end": 137,
          "quote": "コンテキスト\t情報\t属性\t関連情報\t状態モデル\tバリエーション\t説明\n会議室管理\t会議室\t会議室ID、会議室名、所在地、収容人数、設備、利用開始時刻、利用終了時刻"
        },
        {
          "packet_id": "P002",
          "line_start": 248,
          "line_end": 248,
          "quote": "#attribute\t情報\t属性\t会議室@@会議室ID、会議室名、所在地、収容人数、設備、利用開始時刻、利用終了時刻"
        },
        {
          "packet_id": "P002",
          "line_start": 286,
          "line_end": 286,
          "quote": "会議室管理\t会議室\t会議室ID、会議室名、所在地、収容人数、設備、利用開始時刻、利用終了時刻"
        }
      ],
      "explicit_unknowns": [],
      "ambiguities": [
        "属性列挙はデータ型や必須性を示さない。"
      ],
      "correspondence_evidence": []
    },
    {
      "canonical_id": "F24",
      "local_meaning": "予約管理の情報「予約」の属性として、予約ID、会議室ID、社員ID、利用開始日時、利用終了日時、予約日時、取消日時が列挙される。社員による会議室と時間帯の予約を記録する情報である。",
      "local_modality": "asserted",
      "scope": "「予約」の属性欄と情報・属性の対応表に限る。取消日時の未取消時の扱い、各属性の必須性、型、値域、採番・入力方法はここでは定義されていない。",
      "evidence": [
        {
          "packet_id": "P002",
          "line_start": 138,
          "line_end": 138,
          "quote": "予約管理\t予約\t予約ID、会議室ID、社員ID、利用開始日時、利用終了日時、予約日時、取消日時\t社員\t予約状態、会議室利用状態\t予約状態\t社員による会議室と時間帯の予約を記録する。"
        },
        {
          "packet_id": "P002",
          "line_start": 248,
          "line_end": 248,
          "quote": "予約@@予約ID、会議室ID、社員ID、利用開始日時、利用終了日時、予約日時、取消日時"
        },
        {
          "packet_id": "P002",
          "line_start": 287,
          "line_end": 287,
          "quote": "予約管理\t予約\t予約ID、会議室ID、社員ID、利用開始日時、利用終了日時、予約日時、取消日時"
        }
      ],
      "explicit_unknowns": [],
      "ambiguities": [
        "取消日時が予約成立時にも値を持つかは属性列挙からは決まらない。"
      ],
      "correspondence_evidence": []
    },
    {
      "canonical_id": "F25",
      "local_meaning": "社員管理の情報「社員」に社員ID、氏名、所属、連絡先が属性として列挙され、会議室を検索・予約し、自身の予約を変更・取消する社員を識別するためのマスター情報と説明される。",
      "local_modality": "asserted",
      "scope": "「社員」の属性と識別用途の説明に限る。所属や連絡先の形式、入力元、更新者、必須性はここでは定義されていない。",
      "evidence": [
        {
          "packet_id": "P002",
          "line_start": 136,
          "line_end": 136,
          "quote": "コンテキスト\t情報\t属性\t関連情報\t状態モデル\tバリエーション\t説明"
        },
        {
          "packet_id": "P002",
          "line_start": 139,
          "line_end": 139,
          "quote": "社員管理\t社員\t社員ID、氏名、所属、連絡先\t\t\t\t会議室を検索・予約し、自身の予約時間を変更または取り消す社員を識別するためのマスター情報。"
        },
        {
          "packet_id": "P002",
          "line_start": 248,
          "line_end": 248,
          "quote": "社員@@社員ID、氏名、所属、連絡先"
        },
        {
          "packet_id": "P002",
          "line_start": 288,
          "line_end": 288,
          "quote": "社員管理\t社員\t社員ID、氏名、所属、連絡先"
        }
      ],
      "explicit_unknowns": [],
      "ambiguities": [
        "「連絡先」の媒体や「所属」の粒度は属性列挙からは決まらない。"
      ],
      "correspondence_evidence": []
    }
  ],
  "limits": [
    "対象3件の局所記載には暫定・提案・未決という留保表現はなく、属性として提示されている。packet内で全体を草案と指定する表記も確認されないため、全体草案と局所モダリティの関係を裏付ける引用はない。",
    "対応するStage2 packetは指定されていないため、correspondence_evidenceは空とした。"
  ]
}
