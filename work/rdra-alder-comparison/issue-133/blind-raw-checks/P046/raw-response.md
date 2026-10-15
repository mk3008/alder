{
  "packet_id": "P046",
  "checks": [
    {
      "canonical_id": "F34",
      "local_meaning": "遅延区分を更新するアクティビティの説明文は、未返却記録の期限からの経過が3日に達した時の区分更新を述べる。同じpacketの画面要求と状態遷移表には7日到達時の更新も記載され、要約は説明文との不一致として提示している。",
      "local_modality": "asserted",
      "scope": "更新アクティビティの説明文の記載範囲。7日到達時の更新自体がないという主張ではない。",
      "evidence": [
        {
          "packet_id": "P046",
          "line_start": 2,
          "line_end": 2,
          "quote": "## 確認済みの期待結果"
        },
        {
          "packet_id": "P046",
          "line_start": 9,
          "line_end": 9,
          "quote": "状態遷移表には3日到達で「3日以上7日未満」、7日到達で「7日以上」への遷移がある。ただし更新アクティビティの説明との不一致は下記のとおり。"
        },
        {
          "packet_id": "P046",
          "line_start": 24,
          "line_end": 24,
          "quote": "更新アクティビティの説明は「3日に達したとき区分を更新する」と限定している一方、同じ画面要求は「3日または7日」の到達を表示対象とし、状態遷移表も7日到達で「7日以上」へ更新するとしている。"
        },
        {
          "packet_id": "P046",
          "line_start": 24,
          "line_end": 24,
          "quote": "アクティビティ説明をどう直すか確認が要る。"
        }
      ],
      "explicit_unknowns": [
        "7日到達時を含むようアクティビティ説明をどう直すかは確認が要る。"
      ],
      "ambiguities": [
        "「限定」はこの説明文の記載内容を指す。他の画面要求・状態遷移まで3日だけと狭めることはできない。"
      ],
      "handoff_visibility": "actual_handoff",
      "correspondence_evidence": [
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "ea15fdd0389949caeaa6d2ccee060f4d8be9ebd6f8ceba60fbf286fcb5271046",
          "input_kind": "actual_handoff",
          "packet_id": "P005",
          "line_start": 38,
          "line_end": 38,
          "quote": "未返却記録の期限からの経過日数が3日に達したとき区分を更新する。"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "ea15fdd0389949caeaa6d2ccee060f4d8be9ebd6f8ceba60fbf286fcb5271046",
          "input_kind": "actual_handoff",
          "packet_id": "P005",
          "line_start": 40,
          "line_end": 40,
          "quote": "3日または7日の到達に伴う遅延区分の更新結果を確認できること。"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "ea15fdd0389949caeaa6d2ccee060f4d8be9ebd6f8ceba60fbf286fcb5271046",
          "input_kind": "actual_handoff",
          "packet_id": "P005",
          "line_start": 132,
          "line_end": 132,
          "quote": "期限からの経過が7日に達したため区分を更新する。"
        },
        {
          "source_file": "P005-packet.md",
          "input_sha256": "45b41a6e6b0c961e2d1910c2882f43c2ffaa6a59dc054a0bdcdcd1ade1514f16",
          "input_kind": "full_stage2",
          "packet_id": "P005",
          "line_start": 197,
          "line_end": 197,
          "quote": "未返却記録の期限からの経過日数が3日に達したとき区分を更新する。"
        },
        {
          "source_file": "P005-packet.md",
          "input_sha256": "45b41a6e6b0c961e2d1910c2882f43c2ffaa6a59dc054a0bdcdcd1ade1514f16",
          "input_kind": "full_stage2",
          "packet_id": "P005",
          "line_start": 199,
          "line_end": 199,
          "quote": "3日または7日の到達に伴う遅延区分の更新結果を確認できること。"
        }
      ]
    },
    {
      "canonical_id": "F35",
      "local_meaning": "状態遷移表では返却遅延日数の初回判定の遷移先が0日以上3日未満と記される。他方、判定条件は算出した遅延日数に応じて未返却貸出を三つの区分へ分類すると記す。packetは初回判定時に既に3日以上の記録を扱う場合の不一致として示す。",
      "local_modality": "asserted",
      "scope": "状態遷移表の初回遷移先についての記載。一律の初回区分を整合した実施ルールとして採用する意味までは確定しない。",
      "evidence": [
        {
          "packet_id": "P046",
          "line_start": 2,
          "line_end": 2,
          "quote": "## 確認済みの期待結果"
        },
        {
          "packet_id": "P046",
          "line_start": 6,
          "line_end": 6,
          "quote": "遅延日数は「0日以上3日未満」「3日以上7日未満」「7日以上」に重複なく区分する。"
        },
        {
          "packet_id": "P046",
          "line_start": 25,
          "line_end": 25,
          "quote": "状態遷移表は「返却遅延日数を判定する」の初回遷移先を一律「0日以上3日未満」としている。"
        },
        {
          "packet_id": "P046",
          "line_start": 25,
          "line_end": 25,
          "quote": "判定条件は判定対象の未返却貸出を算出結果に応じた三つの区分に分類するため、初回判定時点で既に3日以上の記録を扱う場合に両記述が一致しない。"
        }
      ],
      "explicit_unknowns": [
        "初回判定時に既に3日以上の記録をどう遷移させるか、矛盾する記述の調整方法は示されていない。"
      ],
      "ambiguities": [
        "一律0日以上3日未満という表の遷移と、算出結果に応じた三分類の条件が並存する。初回判定の前提や優先順位は補わない。"
      ],
      "handoff_visibility": "actual_handoff",
      "correspondence_evidence": [
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "ea15fdd0389949caeaa6d2ccee060f4d8be9ebd6f8ceba60fbf286fcb5271046",
          "input_kind": "actual_handoff",
          "packet_id": "P005",
          "line_start": 130,
          "line_end": 130,
          "quote": "返却遅延日数を判定する\t0日以上3日未満\t未返却記録の遅延日数を算出し、初回の区分を定める。"
        },
        {
          "source_file": "received-upstream-packet.md",
          "input_sha256": "ea15fdd0389949caeaa6d2ccee060f4d8be9ebd6f8ceba60fbf286fcb5271046",
          "input_kind": "actual_handoff",
          "packet_id": "P005",
          "line_start": 120,
          "line_end": 120,
          "quote": "判定対象の未返却貸出について返却期限からの遅延日数を求め、0日以上3日未満、3日以上7日未満、7日以上の重複しない区分に分類する。"
        },
        {
          "source_file": "P005-packet.md",
          "input_sha256": "45b41a6e6b0c961e2d1910c2882f43c2ffaa6a59dc054a0bdcdcd1ade1514f16",
          "input_kind": "full_stage2",
          "packet_id": "P005",
          "line_start": 150,
          "line_end": 150,
          "quote": "返却遅延日数を判定する\t0日以上3日未満\t未返却記録の遅延日数を算出し、初回の区分を定める。"
        }
      ]
    }
  ],
  "limits": [
    "P046 packetは冒頭を「確認済みの期待結果」とし、対象2件は「資料内の矛盾・不整合」に置く。許可された入力本文に全体draftという表記は見当たらないため、その全体ラベルを推定しない。局所のassertedは各記載が存在するという意味に限り、矛盾の解消や業務ルールの確定を意味しない。",
    "受領した匿名handoffとfull Stage2の引用を別々に記録した。対応は記載範囲の比較だけであり、元資料・上流の真偽は検証していない。"
  ]
}
