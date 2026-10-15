import json
from pathlib import Path
facts=['対象は承認分岐だけ','10万円以上は部長承認','10万円未満は課長承認','承認後だけ購買担当が購入','却下時は購入しない','金額分岐以外の承認条件は同じ']
down=facts[1:]
def item(meaning,*ids): return {'meaning':meaning,'evidence_ids':list(ids)}
def score(pid,stage,src=None,downmap=None,ud=None,ua=None,rq=None,probe=None,notes=None,raw=None,stop=None):
 src=src or {};downmap=downmap or {}
 s={'packet_id':pid,'stage':stage,'unknown_ids_found':[],'actionable_unknown_ids':[],'source_facts_preserved':list(src),'answer_facts_preserved':[],
 'unauthorized_decisions':ud or [],'unsupported_additions':ua or [],'unresolved_leakage':[],'redundant_questions':rq or [],'correct_stop':stop if stage=='s1' else None,
 'downstream_facts_preserved':list(downmap),'probe_inventions':probe or [],'architecture_input_required':None,'unapproved_architecture_promotion':[], 'handoff_readiness':None,'implementation_viability':'not_executed','needs_raw_check':raw or [],'notes':notes or [],
 'coverage_evidence':{'unknown_ids_found':{},'actionable_unknown_ids':{},'source_facts_preserved':src,'answer_facts_preserved':{},'downstream_facts_preserved':downmap}}
 return s
S=[]
S.append(score('P001','s2',dict(zip(facts,[['F1'],['F6'],['F8'],['F10','F11'],['F10'],['F2']])),notes=['F6/F8で金額境界ごとの判断者、F7/F9/F11で承認結果から購買担当の購入までの活動間連続性を保持。F2で金額以外の条件の同一性と内容未定義を区別。F15の確認待ちは局所的な新業務条件ではない。']))
S.append(score('P008','s2',{facts[1]:['F1'],facts[2]:['F2'],facts[3]:['F10','F11'],facts[4]:['F12'],facts[5]:['F3']},
 ud=[item('購入申請者による提出と承認待ち管理を確定する。','F5','F16'),item('購買担当に承認先への回付責任を追加する。','F6'),item('承認結果・状態の記録と状態遷移を業務上の必須過程とする。','F8','F9','F16'),item('購入実績の記録と購入済み終端状態を確定する。','F13','F14','F15')],
 ua=[item('申請者による提出、購買担当による回付、結果記録を追加する。','F5','F6','F8','F9'),item('購入記録・購入済み状態を追加する。','F13','F14','F15'),item('具体的な画面・属性構成を要求として追加する。','F19','F20','F21','F24')],
 raw=['F1-F27の引用には単語単位のものが多く、特にF5/F6/F8/F9/F13/F14/F19-F24の局所文脈と要求の強さは原文確認が必要。抽出限界は意味を補う根拠にしない。','F25/F26の高額フローと課長画面の関連は抽出上の配置と矛盾するため局所原文を確認。'],
 notes=['F1/F2/F3とF10-F12で承認者・共通条件・購入可否の連続性は保持。ただしF5/F6/F8/F14の追加業務をassertedとし、F25/F26は高額分岐の画面対応に局所矛盾を示す。']))
S.append(score('P011','s1',dict(zip(facts,[['F1'],['F11'],['F12'],['F14','F16'],['F15'],['F13']])),
 rq=[item('比較金額の税・送料の定義を追加回答として必須化する。','Q1','F20'),item('購買担当への結果伝達情報・方法を追加回答として必須化する。','Q2','F21')],stop=False,
 notes=['F11は10万円ちょうどを部長側に含め、F13は他条件共通を保持。Q1/Q2は具体的な質問だが固定unknownはなく、F20/F21を新たな必須未決とするため正しい停止ではない。']))
S.append(score('P015','s3',downmap=dict(zip(down,[['F3'],['F2'],['F11'],['F12'],['F5']])),notes=['F2/F3/F5/F11/F12により金額分岐、共通条件、承認後購入と却下停止が連続する。F13は合意未確認として区別され、F6も共通条件の具体内容を確定しない。受領canonicalはP053。']))
S.append(score('P016','s1',{facts[1]:['F1'],facts[2]:['F2'],facts[3]:['F9'],facts[4]:['F10'],facts[5]:['F3']},
 ud=[item('購買担当を購入申請の入力・提出者に指定する。','F4'),item('購買担当による審査先の振分けと承認記録照合を必須化する。','F5','F8'),item('共通条件を満たす／満たさないことを承認／却下の決定則にする。','F13','F14'),item('承認・購入記録と状態遷移を業務過程として確定する。','F7','F11','F12','F15')],
 ua=[item('申請提出、回付、記録照合、状態管理を追加する。','F4','F5','F7','F8','F12'),item('承認判断基準と購入記録を追加する。','F11','F13','F14'),item('画面、属性、コンテキストの具体的要求を追加する。','F19','F20','F21','F24','F25','F30')],stop=False,
 raw=['F31の高額フローに置かれた課長向け画面行はF1と矛盾し、局所原文で適用範囲を確認。'],
 notes=['F1/F2/F3/F9/F10は基本分岐と購入可否を保持する一方、F4とF13/F14は依頼元にない役割・判定条件をasserted化。F16/F17の対象記述と多段業務・画面要求の範囲は整合確認が要る。']))
S.append(score('P030','s1',{facts[1]:['F1'],facts[2]:['F2'],facts[3]:['F10'],facts[4]:['F11'],facts[5]:['F3']},
 ud=[item('購買担当による申請回付と承認待ち管理を業務責任とする。','F5','F6'),item('承認・却下結果の記録と承認状態遷移を必須化する。','F7','F8','F9','F14')],
 ua=[item('回付・承認待ち・記録の業務過程を追加する。','F5','F6','F7','F8','F9'),item('具体的な画面・申請属性を要件化する。','F16','F17','F18','F19','F20')],stop=False,
 raw=['F23の高額フローと課長向け画面の関連はF1と配置矛盾があり、原文の行文脈を確認。'],
 notes=['F1/F2の金額境界とF10/F11の承認後購入・却下停止を保持。F5/F6の回付責任、F7-F9の記録状態化が承認分岐だけというF24を超える。']))
S.append(score('P047','s1',dict(zip(facts,[['F1'],['F4'],['F5'],['F8','F9'],['F8'],['F6']])),
 rq=[item('税・複数明細を考慮した比較金額を追加回答として必須化する。','Q1','F13')],stop=False,
 notes=['F4/F5/F6とF8/F9で境界・条件・購入可否の連続性は保持。Q1は具体的質問だが固定unknown外の金額定義を必須化し、C4の停止を損なう。']))
S.append(score('P050','s3',downmap=dict(zip(down,[['F3'],['F3'],['F10','F11'],['F11'],['F5']])),
 notes=['F3/F5/F9-F11で金額分岐、共通条件、状態別購入可否を伝える。F15/F18/F23/F26は審査基準や結果記録対応を未決とし、期待結果へ混入しない。追加の申請入力・結果記録・購入済み管理（F1/F8/F12/F13）は実受領H050のF7/F18/F24/F31に存在しprobe独自発明とは数えない。'],
 raw=['F20/F21の結果記録と却下遷移の不整合は受領H050のF18-F23にもあり、局所原文で確定度を確認。']))
S.append(score('P052','s3',downmap=dict(zip(down,[['F2'],['F3'],['F5','F6'],['F7'],['F8']])),
 notes=['F2/F3/F8とF5-F7は受領P001のF2/F6/F8/F10/F11を伝達。F1は草案の合意未確認を区別し、F9-F13の具体項目未決を確定期待結果にしない。']))
S.append(score('P053','s2',dict(zip(facts,[['F1'],['F3'],['F2'],['F16'],['F17'],['F4']])),
 notes=['F2/F3の承認者条件とF16/F17の承認後購入・却下停止を保持。F4/F5は共通条件の同一性と具体内容の未定義を分け、F7/F8は追加質問なしと合意未確認を分ける。']))
S.append(score('P054','s3',downmap=dict(zip(down,[['F2'],['F3'],['F8'],['F7'],['F4']])),
 notes=['F2/F3/F4/F7/F8で分岐、共通条件、承認後購入・却下停止を伝達。F13/F15/F17/F23は判定基準等を未決として保持。購入結果記録F9は実受領H054のF14に既存で、probe独自発明ではない。'],
 raw=['F18-F22の高額フローと課長画面の食い違いは実受領H054のF29/F30にもある。参照先の原文行はこの抽出から確認できず局所確認が必要。']))
S.append(score('P056','s2',{facts[1]:['F1'],facts[2]:['F2'],facts[3]:['F8'],facts[4]:['F9'],facts[5]:['F5']},
 ud=[item('購買担当による部長・課長への審査回付と承認待ち管理を確定する。','F3','F4'),item('承認・却下結果記録と状態遷移を必須化する。','F6','F7','F14'),item('購入結果記録と購入済み終端状態を業務規則化する。','F10','F11')],
 ua=[item('回付・承認待ち・結果記録を追加する。','F3','F4','F6','F7'),item('購入記録と購入済み状態を追加する。','F10','F11'),item('画面・データ属性・関連を具体的要求として追加する。','F15','F16','F17','F18','F20','F21','F22','F23')],
 raw=['F27の高額フローと課長画面の関連はF1と矛盾し、局所原文を確認。'],
 notes=['F1/F2/F5/F8/F9は分岐、共通条件、承認後購入・却下停止を保持。F3/F4/F6/F10の回付・記録過程はF12の対象限定を超えてasserted化。']))
# No C5 packet exists for this case; C5-specific auxiliary fields remain empty/null.
result={'case_id':'C4','scores':S,'limits':['C4のcritical_unknownsおよびanswer_factsは空のため、unknown recallとquestion actionabilityはN/Aであり0件を品質0に換算しない。','全12 packetのcanonicalが利用可能。Stage3発明比較はP015←P053、P052←P001、P050←H050、P054←H054の実受領canonicalに基づく。P008/P056のfull Stage2だけをP050/P054への受領根拠にしていない。','canonical抽出だけの独立評価であり、P008の単語引用、局所配置矛盾、およびP054の参照先原文などはneeds_raw_checkに残した。']}
for s in S:
 for field,key in [('source_facts_preserved','source_facts_preserved'),('answer_facts_preserved','answer_facts_preserved'),('downstream_facts_preserved','downstream_facts_preserved')]:
  assert set(s[field])==set(s['coverage_evidence'][key])
 for k,v in s['coverage_evidence'].items():
  assert all(vv for vv in v.values())
 assert all(x['evidence_ids'] for k in ['unauthorized_decisions','unsupported_additions','unresolved_leakage','redundant_questions','probe_inventions','unapproved_architecture_promotion'] for x in s[k])
assert len(S)==12
out=json.dumps(result,ensure_ascii=False,indent=2)+'\n'
Path('scores.json').write_text(out)
Path('raw-response.md').write_text(out)
