{
  "packet_id": "P054",
  "facts": [
    {"id":"F1","meaning":"購買担当は申請金額と内容を確認する。","modality":"asserted","evidence":[{"line_start":4,"line_end":4,"quote":"購買担当は申請金額と内容を確認し"}]},
    {"id":"F2","meaning":"購買担当は10万円以上の申請を部長へ回付し、承認待ちにする。10万円ちょうどは部長側に含む。","modality":"asserted","evidence":[{"line_start":4,"line_end":4,"quote":"10万円以上**の申請を部長へ、**10万円未満**の申請を課長へ回付して「承認待ち」にする。10万円ちょうどは部長側に入る"},{"line_start":18,"line_end":18,"quote":"金額区分と役割の定義も10万円以上を部長、未満を課長としている"}]},
    {"id":"F3","meaning":"購買担当は10万円未満の申請を課長へ回付し、承認待ちにする。","modality":"asserted","evidence":[{"line_start":4,"line_end":4,"quote":"**10万円未満**の申請を課長へ回付して「承認待ち」にする"},{"line_start":18,"line_end":18,"quote":"金額区分と役割の定義も10万円以上を部長、未満を課長としている"}]},
    {"id":"F4","meaning":"金額に応じた部長または課長は申請内容を審査し、同じ承認条件を適用して承認か却下を判断・記録する。","modality":"asserted","evidence":[{"line_start":5,"line_end":5,"quote":"金額に応じた部長または課長が申請内容を審査し、同じ承認条件を適用して「承認」か「却下」を判断・記録する"},{"line_start":12,"line_end":12,"quote":"課長と部長に同じ条件を適用することまでは確定している"}]},
    {"id":"F5","meaning":"承認待ちの申請は承認の記録により承認済みへ進む。","modality":"asserted","evidence":[{"line_start":6,"line_end":6,"quote":"承認の記録で「承認済み」"}]},
    {"id":"F6","meaning":"承認待ちの申請は却下の記録により却下へ進む。","modality":"asserted","evidence":[{"line_start":6,"line_end":6,"quote":"却下の記録で「却下」に進める"},{"line_start":14,"line_end":14,"quote":"却下結果の記録は状態遷移として示される"}]},
    {"id":"F7","meaning":"却下された申請は購入対象から除外し、購入へ進めない。","modality":"asserted","evidence":[{"line_start":6,"line_end":6,"quote":"却下された申請は購入対象から外し、購入へ進めない"}]},
    {"id":"F8","meaning":"購買担当は承認済みの申請だけを購入対象として選び、その申請の品目を購入する。","modality":"asserted","evidence":[{"line_start":7,"line_end":7,"quote":"購買担当は承認済みの申請だけを購入対象として選び、その申請の品目を購入する"}]},
    {"id":"F9","meaning":"購買担当は購入結果を購入記録に残し、対応する申請を購入済みに進める。","modality":"asserted","evidence":[{"line_start":7,"line_end":7,"quote":"購入結果を購入記録に残し、対応する申請を「購入済み」に進める"}]},
    {"id":"F10","meaning":"確認対象の購入申請情報として金額・品目・数量・承認者・承認結果等が示されている。","modality":"asserted","evidence":[{"line_start":8,"line_end":8,"quote":"購入申請の金額・品目・数量・承認者・承認結果等"}]},
    {"id":"F11","meaning":"確認対象の購入記録情報として申請ID・購入品目・数量・金額等が示されている。","modality":"asserted","evidence":[{"line_start":8,"line_end":8,"quote":"購入記録の申請ID・購入品目・数量・金額等"}]},
    {"id":"F12","meaning":"申請者と審査担当者の識別には社員情報を用い、購入品目の照合には品目情報を用いる。","modality":"asserted","evidence":[{"line_start":8,"line_end":8,"quote":"申請者・審査担当者の識別には社員、購入品目の照合には品目の情報を用いる"}]},
    {"id":"F13","meaning":"具体的な審査基準は明示されておらず、承認・却下の判定基準や閾値を実装者が補ってはならない。","modality":"unresolved","evidence":[{"line_start":12,"line_end":12,"quote":"具体的な審査基準は明示的に未記載"},{"line_start":12,"line_end":12,"quote":"承認・却下の判定基準や閾値を実装者が補ってはいけない"}]},
    {"id":"F14","meaning":"却下理由は購入申請の属性として挙げられている。","modality":"asserted","evidence":[{"line_start":13,"line_end":13,"quote":"却下理由は購入申請の属性として挙がる"}]},
    {"id":"F15","meaning":"却下理由の入力必須性、記録・表示方法は示されず、属性の存在だけから運用規則を確定しない。","modality":"unresolved","evidence":[{"line_start":13,"line_end":13,"quote":"入力必須か、どのように記録・表示するかは示されていない。属性の存在から運用規則を確定しない"}]},
    {"id":"F16","meaning":"業務アクティビティ表と画面への対応には独立した却下結果記録の記載がない。","modality":"asserted","evidence":[{"line_start":14,"line_end":14,"quote":"業務アクティビティ表と画面への対応には独立した却下結果記録の記載がない"}]},
    {"id":"F17","meaning":"却下結果記録の画面、操作手順、記録担当の具体的実装は、この資料だけでは決められない。","modality":"unresolved","evidence":[{"line_start":14,"line_end":14,"quote":"画面、操作手順、記録担当の具体的な実装をこの資料だけで決めない"}]},
    {"id":"F18","meaning":"『10万円以上の購入申請承認フロー』の審査画面には課長が結び付けられ、画面要求には10万円未満の申請を扱うと記載される。","modality":"asserted","evidence":[{"line_start":18,"line_end":18,"quote":"「10万円以上の購入申請承認フロー」の審査画面に**課長**が結び付けられ、画面要求は**10万円未満**の申請を扱うと書かれている"}]},
    {"id":"F19","meaning":"同じ高額申請フローの説明は部長による審査である。","modality":"asserted","evidence":[{"line_start":18,"line_end":18,"quote":"このフローの説明は部長による審査"}]},
    {"id":"F20","meaning":"高額申請フローの『承認結果を記録する』行には課長が結び付けられている。","modality":"asserted","evidence":[{"line_start":19,"line_end":19,"quote":"同じ高額申請フローの「承認結果を記録する」行にも**課長**が結び付く"}]},
    {"id":"F21","meaning":"高額申請フローの承認結果記録の説明は部長による承認判断であり、高額申請を部長が判断・記録するという記載もある。","modality":"asserted","evidence":[{"line_start":19,"line_end":19,"quote":"説明は「部長による承認の判断」であり、高額申請を部長が判断・記録するという記載"}]},
    {"id":"F22","meaning":"共通名のUC『購入申請を審査する』『購入申請の承認結果を記録する』には高額側の部長と少額側の課長それぞれの説明が対応し、UC説明の列では同じUC名に双方の説明が現れる。","modality":"asserted","evidence":[{"line_start":20,"line_end":20,"quote":"共通名のUC「購入申請を審査する」「購入申請の承認結果を記録する」には、高額側の部長と少額側の課長それぞれの説明が対応する"},{"line_start":20,"line_end":20,"quote":"UC説明の列には同じUC名で部長・課長双方の説明が現れる"}]},
    {"id":"F23","meaning":"高額申請を課長に審査させることは該当画面の行だけでは確定できない。","modality":"unresolved","evidence":[{"line_start":18,"line_end":18,"quote":"この行を根拠に高額申請を課長に審査させるとは確定できない"}]},
    {"id":"F24","meaning":"共通UC名だけで審査者を一律に決めると金額別の定義と整合しない。","modality":"asserted","evidence":[{"line_start":20,"line_end":20,"quote":"UC名だけから審査者を一律に決めると金額別の定義と整合しない"}]}
  ],
  "questions": [],
  "contradictions": [
    {"fact_ids":["F2","F3","F18","F19"],"meaning":"高額申請フローの審査画面に課長・10万円未満の要求が結び付く一方、フロー説明と金額別役割では10万円以上を部長が審査する。"},
    {"fact_ids":["F2","F20","F21"],"meaning":"高額申請フローの承認結果記録行に課長が結び付く一方、説明と高額申請の判断・記録の記載は部長を指す。"}
  ],
  "additional_human_inputs": [],
  "limitations": ["本文が参照する別の『packet.md』の行は、この20行の資料には含まれないため、その参照先の原文は検証できない。"]
}
