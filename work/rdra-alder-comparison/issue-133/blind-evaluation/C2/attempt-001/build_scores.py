import json
from pathlib import Path
b=Path('/workspace/scratch/62be7f260abb/blind-evaluation/C2')
src=['社員が空室検索する','社員が予約する','時間重複は予約不可','予約後の時間変更可','取消可','管理者が利用停止にできる']
ans=['停止中は検索非表示','停止中は新規予約不可','停止中は変更先にできない','停止前の既存予約を維持し利用可','取消期限なし・当日取消可','取消時間帯は直ちに空室検索対象になる','取消時間帯は直ちに新規予約対象になる','同時予約保証と順序は未決']
def e(ids):return ids.split() if isinstance(ids,str) else ids
def violation(meaning,ids):return {'meaning':meaning,'evidence_ids':e(ids)}
def mk(pid,stage,source='',answer='',unknown=None,action=None,down=None,ua=None,unsupported=None,leak=None,red=None,probe=None,notes=None,checks=None):
 sm={src[i]:e(x) for i,x in enumerate(source.split('|')) if x} if source else {}
 am={ans[i]:e(x) for i,x in enumerate(answer.split('|')) if x} if answer else {}
 dm={k:v for k,v in list(sm.items())+list(am.items()) if k in src+ans[:7]} if down is None else down
 u=unknown or {};a=action or {}
 return {'packet_id':pid,'stage':stage,'unknown_ids_found':list(u),'actionable_unknown_ids':list(a),'source_facts_preserved':list(sm),'answer_facts_preserved':list(am),'coverage_evidence':{'unknown_ids_found':u,'actionable_unknown_ids':a,'source_facts_preserved':sm,'answer_facts_preserved':am,'downstream_facts_preserved':dm if stage=='s3' else {}},'unauthorized_decisions':ua or [],'unsupported_additions':unsupported or [],'unresolved_leakage':leak or [],'redundant_questions':red or [],'correct_stop':None,'downstream_facts_preserved':list(dm) if stage=='s3' else [],'probe_inventions':probe or [],'architecture_input_required':None,'unapproved_architecture_promotion':[],'handoff_readiness':None,'implementation_viability':None,'needs_raw_check':checks or [],'notes':notes or []}
S=[]
S.append(mk('P006','s1','F2|F5 F6|F7|F9 F11|F13 F14|F17 F18',ua=[violation('停止中は空室候補から除外と確定','F3 F18'),violation('停止中は新規予約から除外と確定','F6 F18'),violation('停止中は時間変更対象から除外と確定','F10 F18'),violation('取消時間帯を再び検索・予約対象にすると確定','F15'),violation('管理者による会議室登録を対象活動と確定','F16 F24')],unsupported=[violation('停止時の検索・新規予約・時間変更の規則（unauthorized内数）','F18'),violation('取消後の再利用規則（unauthorized内数）','F15'),violation('会議室登録業務（unauthorized内数）','F16 F24')],checks=['F15の再利用は即時性を明記しない。原文で範囲を確認。'],notes=['F6-F7で同一会議室の有効予約との重複排除は保持。ただしF18で停止後の3用途を未決のままにしていない。']))
S.append(mk('P012','s1','F11|F13 F17|F14|F19 F22|F24 F25|F28',ua=[violation('停止中を検索候補から除外と確定','F12'),violation('停止中は新規予約不可と確定','F15 F28'),violation('停止中は時間変更不可と確定','F21'),violation('取消時間帯を再び予約可能と確定','F25 F26'),violation('管理者による登録・更新を対象業務と確定','F2 F4 F5 F33'),violation('利用停止の解除・再開手順を確定','F2 F29 F30 F31 F39')],unsupported=[violation('停止による検索・新規予約・変更先の扱い（unauthorized内数）','F12 F15 F21'),violation('取消後の再予約規則（unauthorized内数）','F26'),violation('会議室登録・更新業務（unauthorized内数）','F4 F5'),violation('利用再開業務と事前整合性確認（unauthorized内数）','F29 F30 F31')],notes=['F14で重複禁止を保持する一方、F12/F15/F21が停止の未回答境界を確定し、F29-F31で再開活動も増やしている。','停止前予約の影響はlimitationsでは未定義とされ、確定結果の発明には数えない。']))
S.append(mk('P026','s1','F5 F6|F7 F8|F8 F9|F11 F12|F11 F14|F16',unknown={'C2-U1':['F27','Q6'],'C2-U2':['F28','Q7'],'C2-U3':['F28','Q7'],'C2-U4':['F29','Q8']},action={'C2-U1':['Q6'],'C2-U2':['Q7'],'C2-U3':['Q7'],'C2-U4':['Q8']},notes=['F5-F16は草案の活動間で検索→予約→変更・取消と管理停止をつなぐ。F27-F29/Q6-Q8は停止後の検索・新規・変更・既存予約を分け、未決とした。','F8-F9の重複禁止は局所的にassertedで保持される。'],checks=['F28/Q7は新規予約と変更先を一問にまとめており、原文で回答分離の明瞭さを確認。']))
S.append(mk('P027','s1','F8 F9|F11 F13|F12|F14 F17|F14 F19|F21',unknown={'C2-U1':['F10','Q2'],'C2-U2':['F16','Q3'],'C2-U4':['F22','Q4']},action={'C2-U1':['Q2'],'C2-U2':['Q3'],'C2-U4':['Q4']},notes=['F8-F21は予約と変更・取消の連続性を草案として保持。F10/F16/F22とQ2-Q4は停止の検索・新規・既存予約を具体的に問う。','停止中の変更先を独立して問うQはなく、U3に加算しない。']))
S.append(mk('P002','s2','F1|F3 F4|F4|F7 F8|F11 F12|F15','F16|F17|F18|F19 F20|F11|F13|F14|',ua=[violation('会議室利用管理者の所属を施設管理部門と確定','F27')],unsupported=[violation('管理者の所属部門を必須の業務設定として追加（unauthorized内数）','F27')],notes=['F16-F20で停止中の3つの排除と停止前予約の利用権を接続。F11-F14は当日取消から即時の検索・新規予約復帰まで保持。','同時要求の未決はcanonical factとlimitationsに明記されず、answer factとして加算しない。'],checks=['F23-F25の追加データ項目が実装必須要件か、説明用整理かはcanonicalだけでは確定しない。']))
S.append(mk('P022','s2','F1|F3 F4|F5|F8 F9|F12 F13|F16','F2 F17|F4 F17|F9 F17|F18|F12|F14|F14|F23',ua=[violation('管理者による会議室登録と初期状態を業務規則化','F20')],unsupported=[violation('会議室登録業務と初期利用可能状態（unauthorized内数）','F20')],notes=['F12-F14は期限なしの取消から検索・新規予約への即時復帰を保持し、F18は停止前予約の利用維持を明記。F23は同時要求を未決として隔離。']))
S.append(mk('P036','s2','F7|F10 F12|F12 F13|F15 F17 F20|F25 F26|F29','F9|F13 F30|F19|F31|F26|F27|F28|F35',notes=['F9/F19/F30/F31は停止による検索・変更先・新規予約と既存予約の境界を区別する。F26-F28の当日取消と即時復帰も保持。','F22-F24/F35は変更時の詳細と同時要求を未決としており、確定保証への漏出はない。']))
S.append(mk('P058','s2','F5|F8|F8 F10|F12 F14|F20|F21','F6|F10 F22|F13|F23|F20|F7|F9|F19',notes=['F5-F10は検索・予約・取消時間帯の再利用の連続性を草案として示す。F13/F22/F23は停止による変更先・新規・既存予約を区別する。','F19は同時要求の保証と順序を未決として保持し、F15-F18は変更詳細を合意済みとしない。']))
S.append(mk('P037','s3','F1|F2 F4|F4 F5|F7 F9 F10|F7 F11 F12|F13','F1|F5|F9|F14|F11|F3|F8|F21',notes=['F1-F14は受領P036の検索→予約→変更・取消→停止と即時復帰を伝達する。F15-F21は変更時の未決と同時要求の未決を確定結果から分離。']))
S.append(mk('P043','s3','F1 F4|F6 F7|F3 F7|F10 F11|F13 F14|F16','F2|F17|F11 F17|F18|F13|F5 F15|F15|',notes=['受領H043のF12-F26にある停止、重複、取消直後の再利用、停止前予約の権利を期待結果F2-F18へ伝達。','受領H043には同時要求の未決命題がない。P043でも保証を発明せず、未決伝達の欠落は受領内容に照らす。'],checks=['P043 F22の「未決列挙なし」は受領H043の要約表現。元原文を要する場合は別途確認。']))
S.append(mk('P044','s3','F1|F5 F7|F3 F6|F8 F9 F11|F12 F13|F16','F3 F17|F6 F17|F9 F17|F18|F12|F13|F13|',notes=['F3-F18は受領H044の検索・予約・変更・取消・停止を引き継ぎ、F22で受領H044 F10の同時要求未決を維持。','会議室登録F15は受領H044 F26に既にあり、probe独自発明としては数えない。'],checks=['F22の未決についてanswer_facts_preservedの同時要求項目はstage3では適用外として空にした。']))
S.append(mk('P055','s3','F1 F3|F2 F5 F6|F6 F9|F12 F14|F16 F17|F20','F3|F9 F21|F13|F22|F17|F4|F11|',notes=['F3-F22は受領P058の停止時の新規・変更先・既存予約、当日取消と即時の検索・予約復帰を伝える。F23-F30は変更時の条件および同時予約の未決を明示。','F23の変更時重複未決は受領P058 F15にあり、probe独自発明ではない。']))
# Stage 3 answer fact and source fact fields are inapplicable; their coverage is downstream only.
for x in S:
 if x['stage']=='s3':
  x['source_facts_preserved']=[];x['answer_facts_preserved']=[]
  x['coverage_evidence']['source_facts_preserved']={};x['coverage_evidence']['answer_facts_preserved']={}
  x['coverage_evidence']['downstream_facts_preserved'].pop(ans[7],None)
  x['downstream_facts_preserved']=list(x['coverage_evidence']['downstream_facts_preserved'])
 else:
  x['coverage_evidence']['downstream_facts_preserved']={}
# P044 uses H044 F10 for unresolved conveyance, not a downstream included fact.
result={'case_id':'C2','scores':S,'limits':['匿名canonicalのみの意味採点。曖昧な根拠はneeds_raw_checkへ残し、raw成果物やarm情報を確認していない。','P043は短縮受領H043、P044は短縮受領H044をprobe発明の基準とし、P037/P055はbyte-identicalなP036/P058を基準とした。','Stage1はC2のcritical unknown 5件、source fact 6件を固定分母とし、Stage2はsource 6件とanswer 8件、Stage3の下流必要事実は13件。Stage3の未決はcoverageの分母に含めず伝達をnotesで記録。','C5専用項目は本caseに適用外。C4 correct stopも適用外。']}
(b/'scores.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
(b/'raw-response.md').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
