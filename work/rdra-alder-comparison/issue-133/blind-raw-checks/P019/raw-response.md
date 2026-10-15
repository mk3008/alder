{
  "packet_id": "P019",
  "checks": [
    {
      "canonical_id": "F7",
      "local_meaning": "蔵書貸出に先立つ貸出可否判断の手順として、担当者が対象会員の会員種別と返却遅延日数を受け取り、示された表に従って判断する。『担当者』という役割は記述されるが、その人の特定まではされていない。",
      "local_modality": "asserted",
      "scope": "貸出可否を判断するActivity内のProcedure。会員種別と返却遅延日数による貸出可否に限られ、文書全体はレビュー待ち草案。",
      "evidence": [
        {"packet_id":"P019","line_start":20,"line_end":20,"quote":"蔵書を貸し出すにあたり、対象会員の会員種別と返却遅延日数を用いて貸出可否を判断する時"},
        {"packet_id":"P019","line_start":39,"line_end":39,"quote":"担当者は対象会員の会員種別と返却遅延日数を受け取り、次の表で貸出可否を判断する"},
        {"packet_id":"P019","line_start":4,"line_end":4,"quote":"この文書全体について人のレビューを待つ"},
        {"packet_id":"P019","line_start":24,"line_end":24,"quote":"貸出可否を判断する担当者（未確認）"},
        {"packet_id":"P019","line_start":147,"line_end":147,"quote":"担当者は対象会員の会員種別と返却遅延日数を受け取り、次の表で貸出可否を判断する"}
      ],
      "explicit_unknowns": [
        "貸出可否を判断する担当者の特定は未確認（24、93行）。",
        "会員種別と遅延日数の受け渡し元、遅延日数の算出方法と判断に用いる値の時点は未確認（34–35、94行）。",
        "判断結果を貸出業務へ渡す方法は未確認（48行）。"
      ],
      "ambiguities": [
        "手順中の『担当者』は役割の呼称であり、判断担当と貸出担当が同一人物かどうかは未決（93行）。",
        "全体のレビュー待ちという暫定性と、局所の手順文が断定形であることは併存する。"
      ],
      "correspondence_evidence": []
    },
    {
      "canonical_id": "F17",
      "local_meaning": "蔵書を貸し出すActivityでは、対象会員に対する『貸出可』の判断と対象の蔵書をInputとし、担当者がその判断に従い対象の蔵書を貸し出す手順が書かれている。",
      "local_modality": "asserted",
      "scope": "貸出可と判断された対象会員の蔵書貸出Activity。貸出後の業務は規定されず、文書全体はレビュー待ち草案。",
      "evidence": [
        {"packet_id":"P019","line_start":62,"line_end":62,"quote":"対象会員について上記の貸出判断が「貸出可」となった時"},
        {"packet_id":"P019","line_start":76,"line_end":77,"quote":"- 対象会員の貸出可否（「貸出可」）。\n- 貸出対象の蔵書。"},
        {"packet_id":"P019","line_start":81,"line_end":81,"quote":"担当者は貸出可の判断に従い、対象の蔵書を貸し出す"},
        {"packet_id":"P019","line_start":66,"line_end":66,"quote":"蔵書を貸し出す担当者（未確認）"},
        {"packet_id":"P019","line_start":89,"line_end":89,"quote":"貸出後の業務はこの設計では規定しない"},
        {"packet_id":"P019","line_start":112,"line_end":112,"quote":"この文書全体について人のレビューを待つ"},
        {"packet_id":"P019","line_start":184,"line_end":185,"quote":"- 対象会員の貸出可否（「貸出可」）。\n- 貸出対象の蔵書。"},
        {"packet_id":"P019","line_start":189,"line_end":189,"quote":"担当者は貸出可の判断に従い、対象の蔵書を貸し出す"}
      ],
      "explicit_unknowns": [
        "蔵書を貸し出す担当者の特定は未確認（66、93行）。",
        "判断担当と貸出担当が同じか、別担当に判断結果を渡すかは未確認（93行）。",
        "貸出を行う業務への貸出可否の受け渡し方法は未確認（48行）。",
        "個々の蔵書の選び方は対象外、貸出後の業務は規定されない（10、89行）。"
      ],
      "ambiguities": [
        "手順中の『担当者』の具体的人物や判断担当との同一性は確定していない。",
        "全体のレビュー待ちという暫定性と、局所のInput・Procedureの断定的記述は併存する。"
      ],
      "correspondence_evidence": []
    }
  ],
  "limits": [
    "匿名packetの該当記述のみを根拠にし、全体のレビュー待ち状態を局所の明示的な手順表現と区別した。",
    "指定された匿名対応Stage2はなく、correspondence_evidenceは空。"
  ]
}
