{
  "packet_id": "P057",
  "checks": [
    {
      "canonical_id": "F30",
      "local_meaning": "決定APIへ渡されたroleと金額の一致だけで決定を認めるか、実際の利用者の課長・部長の役職も確認するかは未確認。どちらかの運用を確定していない。",
      "local_modality": "unresolved",
      "scope": "決定APIの決定許可条件に限る。資料全体は草案・未合意であり、この選択はその中でも明示的な未決事項。",
      "evidence": [
        {
          "packet_id": "P057",
          "line_start": 4,
          "line_end": 4,
          "quote": "以下は草案に記載された期待結果であり、業務上の合意済み要件という意味ではありません。資料自体が「草案・未合意」と明記しています"
        },
        {
          "packet_id": "P057",
          "line_start": 18,
          "line_end": 18,
          "quote": "決定APIに渡された `role` と金額の一致だけで決定を認めるか、実際の利用者が課長・部長であることも確認するかは未確認です。後者なら誰の役職をどの情報で確かめるかも未決で、本人・役職の確認方法を要件として確定してはいけません"
        },
        {
          "packet_id": "P057",
          "line_start": 23,
          "line_end": 23,
          "quote": "実際の決定者の役職まで確認するかどうかが明示的に未決"
        }
      ],
      "explicit_unknowns": [
        "role値と金額の一致だけで足りるか",
        "実際の利用者の役職確認も必要か"
      ],
      "ambiguities": [
        "「課長または部長が決定する」という草案上の表現と、APIのrole値による照合の関係は、この未決事項により確定しない。"
      ],
      "handoff_visibility": "actual_handoff",
      "correspondence_evidence": [
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "ae62692a5175b05a62e8ffc8780e73d98d67b57dd8fe8f6666103c306ccf6730",
          "input_kind": "actual_handoff",
          "packet_id": "P018",
          "line_start": 6,
          "line_end": 6,
          "quote": "決定APIに渡された `role` の値と金額の一致だけを確認するのか、実際の決定者が課長または部長であることも確認するのか。後者が必要なら、誰の役職をどの情報で確かめるかの判断が必要です。現時点では本人・役職の確認方法を要件として確定しません。"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "ae62692a5175b05a62e8ffc8780e73d98d67b57dd8fe8f6666103c306ccf6730",
          "input_kind": "actual_handoff",
          "packet_id": "P018",
          "line_start": 164,
          "line_end": 164,
          "quote": "決定APIの `role` 値が金額に対応していれば決定を認める運用ですか。それとも、実際の利用者が課長・部長であることの確認も必要ですか。後者なら確認に用いる役職情報も決める必要があります。草案にはこの点を未確認として残しました。"
        },
        {
          "source_file": "P018-packet.md",
          "input_sha256": "ae62692a5175b05a62e8ffc8780e73d98d67b57dd8fe8f6666103c306ccf6730",
          "input_kind": "full_stage2",
          "packet_id": "P018",
          "line_start": 170,
          "line_end": 170,
          "quote": "決定APIに渡された `role` の値と金額の一致だけを確認するのか、実際の決定者が課長または部長であることも確認するのか。後者が必要なら、誰の役職をどの情報で確かめるかの判断が必要です。現時点では本人・役職の確認方法を要件として確定しません。"
        },
        {
          "source_file": "P018-packet.md",
          "input_sha256": "ae62692a5175b05a62e8ffc8780e73d98d67b57dd8fe8f6666103c306ccf6730",
          "input_kind": "full_stage2",
          "packet_id": "P018",
          "line_start": 164,
          "line_end": 164,
          "quote": "決定APIの `role` 値が金額に対応していれば決定を認める運用ですか。それとも、実際の利用者が課長・部長であることの確認も必要ですか。後者なら確認に用いる役職情報も決める必要があります。草案にはこの点を未確認として残しました。"
        }
      ]
    },
    {
      "canonical_id": "F31",
      "local_meaning": "実際の役職確認を必要とする場合、誰の役職をどの情報で確かめるかは未決。",
      "local_modality": "unresolved",
      "scope": "F30で実際の利用者の役職確認が必要と判断された場合に限る条件付きの未決。草案全体も未合意。",
      "evidence": [
        {
          "packet_id": "P057",
          "line_start": 4,
          "line_end": 4,
          "quote": "以下は草案に記載された期待結果であり、業務上の合意済み要件という意味ではありません。資料自体が「草案・未合意」と明記しています"
        },
        {
          "packet_id": "P057",
          "line_start": 18,
          "line_end": 18,
          "quote": "決定APIに渡された `role` と金額の一致だけで決定を認めるか、実際の利用者が課長・部長であることも確認するかは未確認です。後者なら誰の役職をどの情報で確かめるかも未決で、本人・役職の確認方法を要件として確定してはいけません"
        }
      ],
      "explicit_unknowns": [
        "確認対象となる人物",
        "役職確認に用いる情報"
      ],
      "ambiguities": [
        "役職確認が必要か自体が未確認なので、その方法の確定はできない。"
      ],
      "handoff_visibility": "actual_handoff",
      "correspondence_evidence": [
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "ae62692a5175b05a62e8ffc8780e73d98d67b57dd8fe8f6666103c306ccf6730",
          "input_kind": "actual_handoff",
          "packet_id": "P018",
          "line_start": 6,
          "line_end": 6,
          "quote": "決定APIに渡された `role` の値と金額の一致だけを確認するのか、実際の決定者が課長または部長であることも確認するのか。後者が必要なら、誰の役職をどの情報で確かめるかの判断が必要です。現時点では本人・役職の確認方法を要件として確定しません。"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "ae62692a5175b05a62e8ffc8780e73d98d67b57dd8fe8f6666103c306ccf6730",
          "input_kind": "actual_handoff",
          "packet_id": "P018",
          "line_start": 164,
          "line_end": 164,
          "quote": "決定APIの `role` 値が金額に対応していれば決定を認める運用ですか。それとも、実際の利用者が課長・部長であることの確認も必要ですか。後者なら確認に用いる役職情報も決める必要があります。草案にはこの点を未確認として残しました。"
        },
        {
          "source_file": "P018-packet.md",
          "input_sha256": "ae62692a5175b05a62e8ffc8780e73d98d67b57dd8fe8f6666103c306ccf6730",
          "input_kind": "full_stage2",
          "packet_id": "P018",
          "line_start": 170,
          "line_end": 170,
          "quote": "決定APIに渡された `role` の値と金額の一致だけを確認するのか、実際の決定者が課長または部長であることも確認するのか。後者が必要なら、誰の役職をどの情報で確かめるかの判断が必要です。現時点では本人・役職の確認方法を要件として確定しません。"
        },
        {
          "source_file": "P018-packet.md",
          "input_sha256": "ae62692a5175b05a62e8ffc8780e73d98d67b57dd8fe8f6666103c306ccf6730",
          "input_kind": "full_stage2",
          "packet_id": "P018",
          "line_start": 164,
          "line_end": 164,
          "quote": "決定APIの `role` 値が金額に対応していれば決定を認める運用ですか。それとも、実際の利用者が課長・部長であることの確認も必要ですか。後者なら確認に用いる役職情報も決める必要があります。草案にはこの点を未確認として残しました。"
        }
      ]
    },
    {
      "canonical_id": "Q1",
      "local_meaning": "role値と金額の一致だけで決定を認める運用か、実際の利用者が課長・部長であることの確認も要るか、という質問。",
      "local_modality": "unresolved",
      "scope": "決定APIにおける許可判断の未確認事項。草案の確認質問であり、合意済みの追加要件ではない。",
      "evidence": [
        {
          "packet_id": "P057",
          "line_start": 4,
          "line_end": 4,
          "quote": "以下は草案に記載された期待結果であり、業務上の合意済み要件という意味ではありません。資料自体が「草案・未合意」と明記しています"
        },
        {
          "packet_id": "P057",
          "line_start": 18,
          "line_end": 18,
          "quote": "決定APIに渡された `role` と金額の一致だけで決定を認めるか、実際の利用者が課長・部長であることも確認するかは未確認です。後者なら誰の役職をどの情報で確かめるかも未決で、本人・役職の確認方法を要件として確定してはいけません"
        },
        {
          "packet_id": "P057",
          "line_start": 23,
          "line_end": 23,
          "quote": "実際の決定者の役職まで確認するかどうかが明示的に未決"
        }
      ],
      "explicit_unknowns": [
        "二択のどちらの運用を採るか"
      ],
      "ambiguities": [
        "本文の役職表現から本人確認方法を導くことはできない。"
      ],
      "handoff_visibility": "actual_handoff",
      "correspondence_evidence": [
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "ae62692a5175b05a62e8ffc8780e73d98d67b57dd8fe8f6666103c306ccf6730",
          "input_kind": "actual_handoff",
          "packet_id": "P018",
          "line_start": 6,
          "line_end": 6,
          "quote": "決定APIに渡された `role` の値と金額の一致だけを確認するのか、実際の決定者が課長または部長であることも確認するのか。後者が必要なら、誰の役職をどの情報で確かめるかの判断が必要です。現時点では本人・役職の確認方法を要件として確定しません。"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "ae62692a5175b05a62e8ffc8780e73d98d67b57dd8fe8f6666103c306ccf6730",
          "input_kind": "actual_handoff",
          "packet_id": "P018",
          "line_start": 164,
          "line_end": 164,
          "quote": "決定APIの `role` 値が金額に対応していれば決定を認める運用ですか。それとも、実際の利用者が課長・部長であることの確認も必要ですか。後者なら確認に用いる役職情報も決める必要があります。草案にはこの点を未確認として残しました。"
        },
        {
          "source_file": "P018-packet.md",
          "input_sha256": "ae62692a5175b05a62e8ffc8780e73d98d67b57dd8fe8f6666103c306ccf6730",
          "input_kind": "full_stage2",
          "packet_id": "P018",
          "line_start": 170,
          "line_end": 170,
          "quote": "決定APIに渡された `role` の値と金額の一致だけを確認するのか、実際の決定者が課長または部長であることも確認するのか。後者が必要なら、誰の役職をどの情報で確かめるかの判断が必要です。現時点では本人・役職の確認方法を要件として確定しません。"
        },
        {
          "source_file": "P018-packet.md",
          "input_sha256": "ae62692a5175b05a62e8ffc8780e73d98d67b57dd8fe8f6666103c306ccf6730",
          "input_kind": "full_stage2",
          "packet_id": "P018",
          "line_start": 164,
          "line_end": 164,
          "quote": "決定APIの `role` 値が金額に対応していれば決定を認める運用ですか。それとも、実際の利用者が課長・部長であることの確認も必要ですか。後者なら確認に用いる役職情報も決める必要があります。草案にはこの点を未確認として残しました。"
        }
      ]
    },
    {
      "canonical_id": "Q2",
      "local_meaning": "実際の役職確認が必要なら、誰の役職をどの情報で確かめるか、という条件付きの質問。",
      "local_modality": "unresolved",
      "scope": "Q1の後者が必要とされた場合だけの確認事項。草案段階で確認方法は未確定。",
      "evidence": [
        {
          "packet_id": "P057",
          "line_start": 4,
          "line_end": 4,
          "quote": "以下は草案に記載された期待結果であり、業務上の合意済み要件という意味ではありません。資料自体が「草案・未合意」と明記しています"
        },
        {
          "packet_id": "P057",
          "line_start": 18,
          "line_end": 18,
          "quote": "決定APIに渡された `role` と金額の一致だけで決定を認めるか、実際の利用者が課長・部長であることも確認するかは未確認です。後者なら誰の役職をどの情報で確かめるかも未決で、本人・役職の確認方法を要件として確定してはいけません"
        }
      ],
      "explicit_unknowns": [
        "確認する人物",
        "確認に用いる役職情報",
        "本人・役職の確認方法"
      ],
      "ambiguities": [
        "確認要否が未決であり、確認情報や方式の指定もない。"
      ],
      "handoff_visibility": "actual_handoff",
      "correspondence_evidence": [
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "ae62692a5175b05a62e8ffc8780e73d98d67b57dd8fe8f6666103c306ccf6730",
          "input_kind": "actual_handoff",
          "packet_id": "P018",
          "line_start": 6,
          "line_end": 6,
          "quote": "決定APIに渡された `role` の値と金額の一致だけを確認するのか、実際の決定者が課長または部長であることも確認するのか。後者が必要なら、誰の役職をどの情報で確かめるかの判断が必要です。現時点では本人・役職の確認方法を要件として確定しません。"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "ae62692a5175b05a62e8ffc8780e73d98d67b57dd8fe8f6666103c306ccf6730",
          "input_kind": "actual_handoff",
          "packet_id": "P018",
          "line_start": 164,
          "line_end": 164,
          "quote": "決定APIの `role` 値が金額に対応していれば決定を認める運用ですか。それとも、実際の利用者が課長・部長であることの確認も必要ですか。後者なら確認に用いる役職情報も決める必要があります。草案にはこの点を未確認として残しました。"
        },
        {
          "source_file": "P018-packet.md",
          "input_sha256": "ae62692a5175b05a62e8ffc8780e73d98d67b57dd8fe8f6666103c306ccf6730",
          "input_kind": "full_stage2",
          "packet_id": "P018",
          "line_start": 170,
          "line_end": 170,
          "quote": "決定APIに渡された `role` の値と金額の一致だけを確認するのか、実際の決定者が課長または部長であることも確認するのか。後者が必要なら、誰の役職をどの情報で確かめるかの判断が必要です。現時点では本人・役職の確認方法を要件として確定しません。"
        },
        {
          "source_file": "P018-packet.md",
          "input_sha256": "ae62692a5175b05a62e8ffc8780e73d98d67b57dd8fe8f6666103c306ccf6730",
          "input_kind": "full_stage2",
          "packet_id": "P018",
          "line_start": 164,
          "line_end": 164,
          "quote": "決定APIの `role` 値が金額に対応していれば決定を認める運用ですか。それとも、実際の利用者が課長・部長であることの確認も必要ですか。後者なら確認に用いる役職情報も決める必要があります。草案にはこの点を未確認として残しました。"
        }
      ]
    }
  ],
  "limits": [
    "P057は草案の期待結果をまとめた匿名packetであり、業務上の合意済み要件ではない（P057 4行）。",
    "対応するP018の引用はprovenanceと記載範囲の比較に限り使用し、P057にない業務意味の補完には使用しない。",
    "実際のhandoffにある引用とfull Stage2にある引用を別々に記録した。role値と実際の利用者の確認要否、対象者、情報源、確認方法は確定しない。"
  ]
}
