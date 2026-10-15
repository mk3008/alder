{
  "packet_id": "P057",
  "facts": [
    {"id":"F1","meaning":"この資料の期待結果は草案の記載であり、業務上の合意済み要件ではない。草案自体も未合意と明記されている。","modality":"asserted","evidence":[{"line_start":4,"line_end":4,"quote":"草案に記載された期待結果であり、業務上の合意済み要件という意味ではありません。資料自体が「草案・未合意」と明記"}]},
    {"id":"F2","meaning":"対象範囲は社員の購入申請受付である。","modality":"provisional","evidence":[{"line_start":8,"line_end":8,"quote":"対象は社員の購入申請受付"}]},
    {"id":"F3","meaning":"対象範囲には金額に応じた承認・却下が含まれる。","modality":"provisional","evidence":[{"line_start":8,"line_end":8,"quote":"金額に応じた承認・却下"}]},
    {"id":"F4","meaning":"対象範囲は承認済み申請を購買担当の購入対象として引き渡すところまでである。","modality":"provisional","evidence":[{"line_start":8,"line_end":8,"quote":"承認済み申請を購買担当の購入対象とする引渡しまで"},{"line_start":13,"line_end":13,"quote":"`approved` は購買担当が購入してよい対象"}]},
    {"id":"F5","meaning":"購入実行は対象範囲外の後続業務である。","modality":"provisional","evidence":[{"line_start":8,"line_end":8,"quote":"購入実行、結果連絡、購入後の金額・物品の記録は範囲外"},{"line_start":13,"line_end":13,"quote":"購入実行と結果連絡は後続業務"}]},
    {"id":"F6","meaning":"購入結果の連絡は対象範囲外の後続業務である。","modality":"provisional","evidence":[{"line_start":8,"line_end":8,"quote":"購入実行、結果連絡、購入後の金額・物品の記録は範囲外"},{"line_start":13,"line_end":13,"quote":"購入実行と結果連絡は後続業務"}]},
    {"id":"F7","meaning":"購入後の金額・物品の記録は対象範囲外である。","modality":"provisional","evidence":[{"line_start":8,"line_end":8,"quote":"購入後の金額・物品の記録は範囲外"}]},
    {"id":"F8","meaning":"申請受付の公開APIは POST /purchase-requests である。","modality":"provisional","evidence":[{"line_start":9,"line_end":9,"quote":"申請受付では `POST /purchase-requests`"}]},
    {"id":"F9","meaning":"申請受付には amount_yen として0以上の整数を提出する。","modality":"provisional","evidence":[{"line_start":9,"line_end":9,"quote":"`amount_yen`（0以上の整数）"}]},
    {"id":"F10","meaning":"申請受付には item として空でない文字列を提出する。","modality":"provisional","evidence":[{"line_start":9,"line_end":9,"quote":"`item`（空でない文字列）"}]},
    {"id":"F11","meaning":"有効な申請では purchase_requests に申請ID・金額・物品・pendingを記録する。","modality":"provisional","evidence":[{"line_start":9,"line_end":9,"quote":"有効なら `purchase_requests` に申請ID・金額・物品・`pending` を記録"}]},
    {"id":"F12","meaning":"有効な申請受付はHTTP 201で申請IDと status=pending を返す。","modality":"provisional","evidence":[{"line_start":9,"line_end":9,"quote":"HTTP 201で申請IDと `status=pending` を返します"}]},
    {"id":"F13","meaning":"申請受付条件を満たさない申請はHTTP 400で受け付けない。","modality":"provisional","evidence":[{"line_start":9,"line_end":9,"quote":"条件を満たさなければHTTP 400で受け付けません"}]},
    {"id":"F14","meaning":"決定の公開APIは POST /purchase-requests/{id}/decision である。","modality":"provisional","evidence":[{"line_start":10,"line_end":10,"quote":"決定は `POST /purchase-requests/{id}/decision`"}]},
    {"id":"F15","meaning":"決定APIは対象申請ID、decision（approvedまたはrejected）、role（managerまたはdirector）を受ける。","modality":"provisional","evidence":[{"line_start":10,"line_end":10,"quote":"対象申請ID、`decision`（`approved`／`rejected`）、`role`（`manager`／`director`）を受け"}]},
    {"id":"F16","meaning":"決定時には対象申請の金額とpending状態を確認する。","modality":"provisional","evidence":[{"line_start":10,"line_end":10,"quote":"申請の金額と `pending` 状態を確認"}]},
    {"id":"F17","meaning":"10万円以上の申請は部長（director）が決定する。","modality":"provisional","evidence":[{"line_start":11,"line_end":11,"quote":"金額が10万円以上の申請は部長（`director`）"}]},
    {"id":"F18","meaning":"10万円未満の申請は課長（manager）が決定する。","modality":"provisional","evidence":[{"line_start":11,"line_end":11,"quote":"10万円未満は課長（`manager`）が決定"}]},
    {"id":"F19","meaning":"追加の承認条件は資料に記載されていない。","modality":"asserted","evidence":[{"line_start":11,"line_end":11,"quote":"追加の承認条件は記されていません"}]},
    {"id":"F20","meaning":"承認時は状態をapprovedに更新する。","modality":"provisional","evidence":[{"line_start":11,"line_end":11,"quote":"承認時は `approved`"}]},
    {"id":"F21","meaning":"却下時は状態をrejectedに更新する。","modality":"provisional","evidence":[{"line_start":11,"line_end":11,"quote":"却下時は `rejected` に更新"}]},
    {"id":"F22","meaning":"決定時はHTTP 200で申請IDと決定後の状態を返す。","modality":"provisional","evidence":[{"line_start":11,"line_end":11,"quote":"HTTP 200で申請IDと決定後の状態を返します"}]},
    {"id":"F23","meaning":"金額に対応しないroleの場合、決定せずHTTP 403とする。","modality":"provisional","evidence":[{"line_start":12,"line_end":12,"quote":"金額に対応しない `role` はHTTP 403"},{"line_start":12,"line_end":12,"quote":"いずれも決定しません"}]},
    {"id":"F24","meaning":"申請IDが存在しない場合、決定せずHTTP 404とする。","modality":"provisional","evidence":[{"line_start":12,"line_end":12,"quote":"存在しない申請IDはHTTP 404"},{"line_start":12,"line_end":12,"quote":"いずれも決定しません"}]},
    {"id":"F25","meaning":"決定済み申請の再決定は行わずHTTP 409とする。","modality":"provisional","evidence":[{"line_start":12,"line_end":12,"quote":"決定済み申請への再決定はHTTP 409"},{"line_start":12,"line_end":12,"quote":"いずれも決定しません"}]},
    {"id":"F26","meaning":"rejectedは当該申請を購入しない結果である。","modality":"provisional","evidence":[{"line_start":13,"line_end":13,"quote":"`rejected` はその申請を購入しない結果"}]},
    {"id":"F27","meaning":"既存の二つの公開REST APIを維持する。","modality":"provisional","evidence":[{"line_start":14,"line_end":14,"quote":"既存の公開REST API二つ"},{"line_start":14,"line_end":14,"quote":"維持し"}]},
    {"id":"F28","meaning":"既存のpurchase_requests schemaを維持する。","modality":"provisional","evidence":[{"line_start":14,"line_end":14,"quote":"既存の `purchase_requests` schemaを維持"}]},
    {"id":"F29","meaning":"実装にはTypeScriptとPostgreSQLが指定されている。","modality":"provisional","evidence":[{"line_start":14,"line_end":14,"quote":"実装指定はTypeScriptとPostgreSQL"}]},
    {"id":"F30","meaning":"決定APIのrole値と金額の一致だけで決定を認めるか、実際の利用者の役職も確認するかは未確認である。","modality":"unresolved","evidence":[{"line_start":18,"line_end":18,"quote":"`role` と金額の一致だけで決定を認めるか、実際の利用者が課長・部長であることも確認するかは未確認"},{"line_start":23,"line_end":23,"quote":"実際の決定者の役職まで確認するかどうかが明示的に未決"}]},
    {"id":"F31","meaning":"利用者の実際の役職も確認する場合、誰の役職をどの情報で確かめるかは未決である。","modality":"unresolved","evidence":[{"line_start":18,"line_end":18,"quote":"後者なら誰の役職をどの情報で確かめるかも未決"}]},
    {"id":"F32","meaning":"本人・役職の確認方法を要件として確定してはいけない。","modality":"asserted","evidence":[{"line_start":18,"line_end":18,"quote":"本人・役職の確認方法を要件として確定してはいけません"}]},
    {"id":"F33","meaning":"frameworkとlayer構成は指定されておらず、資料から特定構成を業務要件として導けない。","modality":"asserted","evidence":[{"line_start":19,"line_end":19,"quote":"frameworkやlayer構成は指定されていません。資料から特定の構成を業務要件として導けません"}]},
    {"id":"F34","meaning":"資料に明確に相反する記載は見当たらず、草案の重複掲載は同内容とされる。","modality":"asserted","evidence":[{"line_start":23,"line_end":23,"quote":"明確に相反する記載は見当たりません。同じ草案の重複掲載は同内容です"}]}
  ],
  "questions": [
    {"id":"Q1","meaning":"決定APIのroleと金額の一致だけで決定を認めるか、実際の利用者が課長・部長かも確認するか。","evidence":[{"line_start":18,"line_end":18,"quote":"`role` と金額の一致だけで決定を認めるか、実際の利用者が課長・部長であることも確認するかは未確認"}]},
    {"id":"Q2","meaning":"実際の役職を確認する場合、誰の役職をどの情報で確かめるか。","evidence":[{"line_start":18,"line_end":18,"quote":"後者なら誰の役職をどの情報で確かめるかも未決"}]}
  ],
  "contradictions": [],
  "additional_human_inputs": [
    {"meaning":"決定APIのrole値と金額の一致だけでよいか、実際の利用者の課長・部長の役職を確認するかを指定する。","required":true,"evidence":[{"line_start":18,"line_end":18,"quote":"`role` と金額の一致だけで決定を認めるか、実際の利用者が課長・部長であることも確認するかは未確認"}]},
    {"meaning":"実際の役職確認を求める場合、誰の役職をどの情報で確かめるかを指定する。","required":true,"evidence":[{"line_start":18,"line_end":18,"quote":"後者なら誰の役職をどの情報で確かめるかも未決"}]}
  ],
  "limitations": ["期待結果は草案の明示記載であり、業務上の合意済み要件ではない。", "frameworkやlayer構成、および本人・役職の確認方法を資料から確定できない。"]
}
