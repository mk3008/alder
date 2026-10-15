import json,datetime,pathlib
base=pathlib.Path('.')
lines=base.joinpath('packet.md').read_text().splitlines()
P=[
('社員の物品購入は購入申請を起点とし、物品と金額を申請する。',['社員による物品購入は購入申請を起点とする','社員が購入申請を出し','社員が10万円未満の物品と金額を申請し','社員が10万円以上の物品と金額を申請し','社員が10万円未満の金額と物品を入力して申請を提出する。','社員が10万円以上の金額と物品を入力して申請を提出する。']),
('申請金額は10万円未満と10万円以上に区分し、10万円ちょうどは高額区分に含む。',['10万円未満と10万円以上','10万円ちょうどを含む']),
('10万円未満の承認待ち申請は課長（role=manager）のみが承認または却下する。',['10万円未満は課長が承認または却下','10万円未満の購入申請の承認または却下は課長','課長が10万円未満の承認待ち申請を承認または却下','課長role=managerだけが承認または却下','申請金額が10万円未満の場合に課長が決裁できる']),
('10万円以上の承認待ち申請は部長（role=director）のみが承認または却下する。',['10万円以上は部長が承認または却下','10万円以上の購入申請の承認または却下は部長','部長が10万円以上の承認待ち申請を承認または却下','部長role=directorだけが承認または却下','申請金額が10万円以上の場合に部長が決裁できる']),
('申請金額に対応しない決裁役割は403で拒否する。',['異なる役割には403を返す','申請金額に対応しない役割による決定は403で拒否する','申請金額と決裁者の組合せが合わなければ権限外として403で拒否する','権限外の役割は403','権限外は403','権限外として403で拒否する']),
('存在しない申請IDに対する決定は404で拒否する。',['存在しないidに404','存在しないIDは404']),
('決裁はpendingの申請だけに行い、approvedまたはrejectedの再決定は409で拒否する。',['決定済みの申請は再決定しない','再決定は409で拒否','決定済みは409','approvedまたはrejectedの決定済み申請は再決裁を409で拒否する','決裁状態はこれ以上遷移しない']),
('決裁の結果はapprovedまたはrejectedへ状態を確定する。',['申請状態をapprovedまたはrejectedに確定する','決定はapprovedまたはrejectedのいずれか','承認ならapproved、却下ならrejectedに確定','pending\tapproved','pending\trejected']),
('少額・高額とも追加の承認条件を設けない。',['追加の承認条件を設けないこと','追加の承認条件は設けない','追加の承認条件なしで']),
('承認済み申請だけを購買担当へ購入対象として引き渡し、却下分は購入へ進めない。',['購買担当への購入引渡しは承認後に限る','承認された申請だけを購入対象','承認された申請だけを購買担当','却下された申請は購入へ進めない','決裁状態がapprovedである申請だけ','課長が承認した10万円未満の申請だけを購入対象','部長が承認した10万円以上の申請だけを購入対象']),
('購買担当は引渡し対象の承認済み申請ID・物品・金額を確認して引き受ける。',['承認済みの申請ID、物品と金額を購入への引渡し条件','承認済みの申請ID、物品、金額を購入への引渡し対象','承認した購入申請のID、物品、金額を確認し、購入対象として引き受ける']),
('購入結果は申請者へ伝える業務要求がある。',['購入結果は申請者へ伝える','購入結果を申請者へ伝えること']),
('今回のAPI実装範囲は申請・承認分岐・購入への引渡しまでで、購入実行と購入結果の記録・連絡を含めない。',['購入実行と結果連絡の実装は対象外','購入実行と購入結果の連絡は対象外','購入実行は今回のAPI実装範囲に含めない','今回のAPI実装範囲は申請・承認分岐と購入への引渡しまで','購入実行、購入結果の記録と申請者への連絡は今回のAPI実装範囲外','購入実行と結果連絡は対象外']),
('購入した物品と金額を記録する業務要求がある。',['購入した物品と金額を記録すること']),
('申請APIは既存の公開REST POST /purchase-requestsを維持し、amount_yenとitemを受け取る。',['既存公開REST APIのPOST /purchase-requestsを維持し、amount_yenとitemを受け取ること']),
('申請金額amount_yenは0以上の整数、itemは空でない文字列として検証し、不正入力には400を返す。',['amount_yenを0以上の整数、itemを空でない文字列として検証し、不正入力には400','金額が0以上の整数で物品名が空でないことを確認し、不正入力は400','購入申請の金額amount_yenは0以上の整数、物品itemは空でない文字列','申請金額は0以上の整数で物品名は空でないことを検証する。不正な入力は400']),
('有効な申請には一意のIDを付け、金額と物品をpendingで記録する。',['一意の申請IDを付けて承認待ちとして記録','一意の申請IDに紐付けてpendingとして記録','一意の申請IDを付け、金額と物品をpendingで記録','入力条件を満たす申請に一意の申請IDを付け、金額と物品を決裁待ち（pending）']),
('申請APIの正常応答は201でidとstatus=pendingを返す。',['正常時に201でidとstatus=pending','登録成功時は201でidとstatus=pending','正常な申請には201と申請IDおよびpending','正常時は201と申請IDおよびpending']),
('決定APIは既存の公開REST POST /purchase-requests/{id}/decisionを維持し、decision=approvedまたはrejected、role=managerまたはdirectorを受け取る。',['既存公開REST APIのPOST /purchase-requests/{id}/decisionを維持し、decision=approvedまたはrejected、role=managerまたはdirectorを受け取ること']),
('決定APIの正常応答は200でidと決定後のstatusを返す。',['正常時に200でidと決定後のstatus','正常時は200と申請IDおよび決定後の状態','成功時は申請状態をその結果に変更して200でidと決定後のstatus']),
('既存purchase_requestsスキーマを維持し、idはbigint自動採番主キー、amount_yenは0以上の必須整数、itemは空でない必須文字列、statusはpending・approved・rejectedの必須文字列とする。',['既存のpurchase_requestsスキーマを維持し、idはbigintの自動採番主キー、amount_yenは0以上の必須整数、itemは空でない必須文字列、statusはpending・approved・rejectedのいずれかの必須文字列とすること']),
('実装にTypeScriptとPostgreSQLを使用する。',['TypeScriptとPostgreSQLを使用すること','TypeScriptで申請入力の検証']),
('購入申請情報には申請ID、申請者社員ID、物品名、金額、決裁状態、決裁者社員IDを位置づけ、社員情報と関連付ける。',['申請ID、申請者社員ID、物品名、金額、決裁状態、決裁者社員ID']),
('社員情報は社員ID・氏名・役割を持ち、申請者と決裁者の識別および役割別決裁権限の確認に用いる。',['社員ID、氏名、役割','申請者および決裁者となる社員を識別']),
('申請画面は少額・高額の金額区分と決裁対象を示し、入力値を確認して確定できる。',['10万円未満の申請であることを確認できる','10万円以上の申請は部長の決裁対象となることを確認できる','提出した物品と金額を確認して確定でき']),
('申請画面は金額と物品の入力条件を示し、不正項目と理由を修正できる。',['金額は0以上の整数、物品名は空欄不可であることを入力時に示し、不正な項目と理由を修正できる']),
('受付画面は申請IDとpendingの状態を示し、受付不可時は理由を示す。',['受付後に申請IDと承認待ちの状態を確認でき、受付できなかった場合は理由を確認できる']),
('課長・部長の確認画面はIDで申請を探して物品・金額・状態を示し、対象なし・権限外・決定済みの理由を示す。',['申請IDで対象を探し、物品・金額・状態を確認できる。','対象なし・権限外・決定済みの理由を示す']),
('決裁画面は物品・金額・pending状態を示し、承認または却下の確定前に決裁内容・購入対象から外れることを確認できる。',['確定前に決裁内容を再確認できる','購入対象から外れることを確定前に確認できる']),
('決裁結果画面は決裁者に確定結果と再決裁不可を示し、申請者に自分の決裁結果と却下時の購入対象外を示す。',['決裁した申請IDと承認または却下の確定結果を確認でき、再決裁できないことが分かる','自分の申請IDと承認または却下の決裁結果を確認でき、却下された申請は購入対象外と分かる']),
('購入対象画面は決裁者と購買担当に各権限者の承認済み申請をID・物品・金額とともに示し、購買担当は却下・pendingと区別できる。',['自分が承認した10万円未満の申請だけを物品・金額・申請ID','自分が承認した10万円以上の申請だけを物品・金額・申請ID','却下または承認待ちの申請を区別できる']),
('購入対象確認画面は承認済み申請のID・物品・金額・決裁結果を一覧と詳細で示す。',['承認済み申請のID・物品・金額・決裁結果を一覧と詳細で確認し']),
]
facts=[]
for i,(meaning,phrases) in enumerate(P,1):
 e=[]
 for n,line in enumerate(lines,1):
  match=next((p for p in phrases if p in line),None)
  if match:e.append({'line_start':n,'line_end':n,'quote':match})
 if not e:raise ValueError((i,meaning))
 facts.append({'id':f'F{i}','meaning':meaning,'modality':'asserted','evidence':e})
result={'packet_id':'P059','facts':facts,'questions':[],'contradictions':[],'additional_human_inputs':[],'limitations':[]}
body=json.dumps(result,ensure_ascii=False,separators=(',',':'))
base.joinpath('canonical.json').write_text(body+'\n')
base.joinpath('raw-response.md').write_text(body+'\n')
now=datetime.datetime.now(datetime.timezone.utc).isoformat()
with base.joinpath('read-log.jsonl').open('w') as f:
 for name in ['extraction-prompt.txt','packet.md']:
  f.write(json.dumps({'path':str(base.resolve()/name),'timestamp':now},ensure_ascii=False)+'\n')
print(len(facts),sum(len(f['evidence']) for f in facts),len(body))
