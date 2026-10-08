from pathlib import Path
import json, hashlib, re
P=Path(__file__).parent
rows=[]

def e(id, field, statement, turns, status='observed', importance='material', group=None, **extra):
    row={'id':id,'field':field,'statement':statement,'status':status,'source_turns':turns.split(), 'importance':importance,'semantic_group':group or id,'expected_treatment':{
      'observed':'意味を保って草案に記載する。語句・配置・分解の一致は不要。',
      'corrected':'訂正後の内容だけを現行事実として記載する。旧発言は現行ルールにしない。',
      'proposal-not-adopted':'現行・決定済みの業務へ採用しない。未採用の提案として分離するか省略する。',
      'uncertain':'未確認・未決を明示して断定しない。明示的な保留は再質問を要求しない。',
      'hidden-unspoken':'回収の加点対象外。偶然一致しても根拠のない補完と扱う。'
    }[status],**extra}
    rows.append(row)
    return f'{statement} [{id}]'

parts=['# 機材レンタルの業務設計書（評価側の期待参照）','''この参照は、架空相談から初回草案に残せる内容と、評価側だけが知る設定を分けるためのオラクルである。設計者モデルへ渡さない。正しい語句・見出し・Activity数を当てさせる正解例ではない。現行業務の草案が対象で、採用・実装・運用変更の承認を表さない。各 ID は observability.json の同じ ID と対応する。Scope / Icon は表現上の整理であり、独立した業務発見として加点しない。''']

def para(x): parts.append(x)
def section(h): parts.append(h)
def bullet(x): parts.append('- '+x)

def item(id,field,s,t,status='observed',importance='material',group=None,**extra):
    v=e(id,field,s,t,status,importance,group,**extra);bullet(v);return v

section('# Scope')
item('S01','Scope','一店舗で行う、会社・団体向けのプロジェクター、マイク、三脚等の予約調整、準備・受渡し、返却確認、料金確認から経理への請求依頼までを対象とする。','T006 T016 T018 T026 T032 T042 T064 T068',importance='critical')
item('S02','Scope','受取り・返却は同じ店舗で行う。配送は対象外。','T005 T006',importance='material')
item('S03','Scope','修理作業、請求書の発行、入金の追跡は範囲外。修理担当・経理との受渡しは含む。','T036 T068',importance='critical')
item('S04','Change status','現行業務の整理を草案にし、店の人の確認に回す。紙廃止・画面設計・自動化の採用は未決。','T010 T070 T071 T072',importance='critical')
item('S05','Motivation','返却を受け取った状態と再貸出し可能な状態の混同が、翌朝の機材探し・代替手配につながっている。準備側と受付側で状況を共有したい。','T002 T004 T070')
item('S06','Pain','困りごとの Low / Medium / High は依頼者から示されていない。必要なら未確認とし、確定評価を創作しない。','T002 T004 T070',status='uncertain',importance='minor')

section('## 未確認・未採用の事項')
item('U01','Damage liability','故障分について、修理見積りを基に誰が負担を決めるかは確認が必要で、この相談では保留。未決の額を請求へ含めない。','T043 T044',status='uncertain',importance='critical')
item('U02','Proxy collection','予約者とは別人が来店した場合、誰に渡してよいかを確認する方法は店長への確認待ち。代理受取りを一律許可・禁止しない。','T053 T054',status='uncertain',importance='critical')
item('U03','Cancellation receipt time','取消料の無料期限と比べる時刻がメール送信時刻か店舗で受けた扱いとなる時刻かは、規約確認待ち。休日のメールも自動確定しない。','T058 T060',status='uncertain',importance='critical')
item('U04','Tariff details','料金表は後日提供予定。基本・延滞・取消の具体額と計算式や、変更時の取消料の細部は未提供。','T024 T042 T048 T049 T066',status='uncertain')
item('U05','Reminder timing','料金内訳への返信がない場合の催促日数は担当への確認待ち。無返信での確定はしない。','T065 T066',status='uncertain')
item('U06','Inventory arithmetic','稼働台数と重複期間の予約台数を確認し、点検待ち・修理中を除くことは観測できる。稼働台数が貸出中を含むか、予定返却をどう扱うか等の具体的な算術定義までは示されていない。精密な在庫式を創作しない。','T019 T020',status='uncertain',importance='material',question_obligation=False,question_note='数量計算式まで草案で断定する必要はない。高水準の確認手順を記述できれば、式を質問しないことを自動的な失敗にはしない。')
item('U07','Information storage and handoff','請求先を受付で聞くことと、請求依頼に予約を特定する番号が必要なことは既知。番号・請求先を保存する帳票、採番方法、経理への内部送付手段は未発言。必要な情報として表現し、予約表への格納や特定ツールを必須仕様にしない。','T064 T068',status='uncertain',importance='minor',question_obligation=False)
item('P01','Unadopted proposal','返却時のバーコード読取りだけで次の予約を受けられるようにする案は設計者の提案であり、依頼者は採用していない。','T009 T010',status='proposal-not-adopted',importance='critical')

objects=[
('利用者',False,[('O01','団体・会社等の利用者。予約の希望、変更・取消・延長依頼、連絡先、請求先、料金内訳の確認・異議をやり取りする。','T006 T016 T024 T048 T050 T064 T068')]),
('予約表',True,[('O02','機材の型、台数、受取予定、返却予定、連絡先。予約を特定する番号は請求依頼で必要だが、番号の記録場所は未発言。請求先も受付で聞くが保存先は未発言。','T008 T016 T068'),('O03','予約確定、変更後の内容、取消の状態。個体番号の割当てとは区別する。','T018 T022 T046 T048')]),
('在庫表',True,[('O04','機材の管理番号・型・稼働台数と、貸出可、貸出中、点検待ち、修理中等の状態。','T008 T020 T028 T030 T032 T036')]),
('貸出票',True,[('O05','対象予約の貸出機材番号、付属品、利用者の受領サイン、実際の受取時刻、返却を受け取った時刻、変更後の返却予定。紙で扱う。','T008 T012 T026 T028 T030 T050'),('O06','機材ごとの点検結果、検収済み・保留、不足品・故障症状。全予約を一括完了にしない。','T030 T032 T034 T036 T038 T062'),('O07','準備済みの機材番号の割当てを、倉庫でほかの予約との重複確認に用いる。','T018 T040 T046')]),
('機材と付属品',True,[('O08','管理番号で区別する実物機材、付属品、準備した箱、返却後の黄色い札。受付・倉庫・修理担当との間を移動する。','T004 T008 T012 T018 T026 T032 T036')]),
('料金表',False,[('O09','基本料金、延滞の追加料金、取消料を調べる基準。表の管理・制定はこの相談では扱っておらず、具体額は未提供。','T024 T042 T048 T066')]),
('料金内訳・請求依頼',True,[('O10','機材ごとの基本料金・追加料金または取消料の内訳、金額、利用者の確認状況、経理へ渡す予約番号・請求先・確定した内訳と金額。','T062 T064 T066 T068')]),
('修理担当',False,[('O11','故障機材と症状の受領先。修理見積りは負担の決定に関係するが、判断責任者は未確認。','T036 T044')]),
('経理',False,[('O12','確定済みの請求依頼を受け取る。請求書発行・入金の追跡は範囲外で担当する。','T064 T068')])]
for name,scope,info in objects:
    section('# Object '+name); section('## Scope');para(str(scope).lower());section('## Icon');para('(generic icon)');section('## Information')
    for id,statement,turns in info: item(id,'Object Information',statement,turns,representation_note='Objectの分割・統合・名称・Scope境界の別表現は意味が保たれれば許容する。')

section('# Activity 予約と利用予定を調整する')
para(e('A1-WHAT','What','利用希望の確定、既存予約の変更・取消、利用中の延長、貸出不能・遅延に伴う利用者との調整を行う。','T016 T022 T024 T038 T048 T050 T052',importance='critical'))
section('## Scope');para('true')
section('## Why');para(e('A1-WHY','Why','利用者が了解した型・台数・利用期間の機材を確保し、用意できない約束や無断の代替を避ける。','T020 T022 T038 T040',importance='critical'))
section('## When');para(e('A1-WHEN','When','電話・メールで新規・変更・取消・延長の依頼を受けたとき。返却予定を過ぎた機材を予約表で確認したとき。','T016 T024 T048 T050 T052'))
section('## Exception When')
bullet(e('A1-XWHEN','Exception When','機材を準備して貸し出す — 用意できないことが倉庫から戻されたとき。返却機材を受け取り点検する — 不足・故障が報告され、後続予約への影響調整が必要なとき。','T038 T040',importance='critical'))
section('## Who');para(e('A1-WHO','Who','受付。代替する型・日程の採否は利用者に確認する。','T016 T022 T038 T040',importance='critical'))
section('## Where');para(e('A1-WHERE','Where','店舗の受付で電話・メールを受け、予約表・在庫表等を参照する。','T006 T008 T016 T020 T024'))
section('## How');section('### Input')
item('A1-I1','Input','利用者 — 希望する型・台数・受取予定・返却予定、連絡先、請求先、変更・取消・延長の依頼。用途は相談時に聞くことがあるが必須ではない。','T016 T024 T048 T050 T068')
item('A1-I2','Input','予約表 — 既存の同型・重複期間の予約台数、変更対象、後続予約と返却予定。','T020 T038 T048 T050 T052',importance='critical')
item('A1-I3','Input','在庫表 — 型ごとの稼働台数、点検待ち・修理中の状態。','T020',importance='critical')
item('A1-I4','Input','貸出票 — 倉庫が記した不足・故障、準備不能の連絡、用意済みの割当てや返却予定。','T038 T040 T046 T050')
section('### Procedure')
item('A1-P1','Procedure','型ごとの稼働台数と受取りから返却まで重なる予約台数を確認する。点検待ち・修理中を貸せる台数から外す。','T019 T020',importance='critical')
item('A1-P2','Procedure','両表の確認が済み、必要な型・日程への利用者の了解が取れてから予約表へ確定で登録し、受付から確保できた旨を返す。個体番号はこの時点では決めない。','T018 T021 T022',importance='critical')
item('A1-P3','Procedure','変更は変更先の空きを先に確認し、利用者の了解後に同じ予約を更新して倉庫へ伝える。空きがなければ元の予約を残す。','T047 T048',importance='critical')
item('A1-P4','Procedure','取消を予約表へ反映した時点で、その予約の台数を別の利用者へ回せる。用意済みなら倉庫へ通知して個体割当てを外してもらう。取消料の有無とは独立して扱う。','T045 T046 T060',importance='critical')
item('A1-P5','Condition','取消料の無料期限は前営業日の17時まで。日曜定休である。「前日まで」は訂正された。メールについて期限と比較する時刻は U03 の保留を残す。','T024 T058 T060',status='corrected',importance='critical',superseded_turns=['T024'],replacement_turns=['T058'],semantic_group_note='U03とは別に、既知の期限と未確認の基準時刻を区別する。')
item('A1-P6','Procedure','取消料がある場合は計算担当へ取消の連絡を渡す。','T024 T066')
item('A1-P7','Procedure','利用中の延長は次の予約を確認し、可能なら新しい返却予定を利用者へ伝え、予約表・貸出票を更新して倉庫へ知らせる。不可なら元の返却期限を伝える。','T049 T050',importance='critical')
item('A1-P8','Procedure','無断の遅延は自動的な延長承認にしない。受付が返却予定を過ぎた対象を予約表で確認して利用者へ連絡し、次の貸出しに響く場合は後続の利用者にも連絡して調整する。','T051 T052',importance='critical')
section('### Exception')
item('A1-X1','Exception','台数が足りなければ別の日・型を相談する。倉庫から不足や故障が届いた場合は、受付が予約表で次の予約への影響を確認する。利用者の了解なしで似た機材へ替えない。','T020 T022 T038 T040',importance='critical')
section('### Output')
item('A1-O1','Output','予約表 — 確定、取消、了解済みの変更・延長後の内容。','T022 T046 T048 T050')
item('A1-O2','Output','貸出票 — 延長した返却予定。用意済みの割当て解除・変更に必要な内容を倉庫へ知らせる。','T046 T048 T050 T060')
item('A1-O3','Output','利用者 — 確保の返答、代替案・日程の相談、延長の可否・返却期限、遅延・後続予約への連絡。','T022 T038 T040 T050 T052')
item('A1-O4','Output','料金内訳・請求依頼 — 計算担当が取消料を計算するための取消情報。','T024 T066')
section('## Result');para(e('A1-RESULT','Result','了解済みの予約内容を基に倉庫で準備できる。取消した予約の台数は再受付でき、変更不能時は元の予約が維持される。相談中・未解決の代替は確約にしない。','T018 T022 T040 T046 T048',importance='critical'))

section('# Activity 機材を準備して貸し出す')
para(e('A2-WHAT','What','予約に対応する個体と付属品を準備し、来店した利用者と内容を確かめて貸し出す。','T018 T026 T028',importance='critical'))
section('## Scope');para('true')
section('## Why');para(e('A2-WHY','Why','予約どおりに使える機材をそろえ、受付が渡す物を判断できるようにする。','T018 T026 T056'))
section('## When');para(e('A2-WHEN','When','倉庫の準備は貸出しの前営業日。日曜定休のため月曜分は土曜に準備する。受付での受渡しは利用者の来店時。','T018 T026 T057 T058',status='corrected',importance='material',superseded_turns=['T018'],replacement_turns=['T058']))
section('## Who');para(e('A2-WHO','Who','倉庫担当が個体選択・動作と付属品の確認・箱詰めを行い、受付が来店時の確認・サイン受領・貸出記録を行う。','T018 T026 T028 T040',importance='critical'))
section('## Where');para(e('A2-WHERE','Where','店舗の倉庫で準備し、同じ店舗の受付で受け渡す。','T006 T018 T026'))
section('## How');section('### Input')
item('A2-I1','Input','予約表 — 確定した型・台数・受取予定等、受付からの変更・取消内容。','T008 T018 T026 T046 T048')
item('A2-I2','Input','在庫表 — 個体の管理番号と現在貸せる状態。','T008 T018 T040')
item('A2-I3','Input','貸出票 — 別予約で使う個体の割当て、受渡しに用いる番号・付属品。','T008 T026 T040',importance='critical')
item('A2-I4','Input','機材と付属品 — 選択・点検・箱詰めして受渡す実物。','T018 T026')
item('A2-I5','Input','利用者 — 来店時の予約内容の照合、内容の確認、受領サイン。','T026 T053 T054')
section('### Procedure')
item('A2-P1','Procedure','倉庫担当は在庫表と貸出票を見て、今貸せる状態で、別の予約に割り当てられていない個体を選ぶ。番号・付属品を貸出票に記し、付属品と動作を確認して箱にまとめる。','T008 T018 T040',importance='critical')
item('A2-P2','Procedure','受付は利用者と予約内容を照合し、準備済みの箱と貸出票を出す。機材番号・付属品を利用者と一緒に確認して受領サインを得る。後払いなので支払いを受渡しの前提にしない。','T025 T026',importance='critical')
item('A2-P3','Procedure','受付は実際の受取時刻を貸出票に記録し、在庫表を貸出中にする。','T027 T028')
section('### Exception')
item('A2-X1','Exception','準備時に用意できなければ受付へ戻し、予約と利用予定を調整する業務で利用者と相談する。出せない機材を貸出済みと扱わない。','T039 T040',importance='critical')
item('A2-X2','Exception','来店時に型・台数と箱の中身が違えば受付から倉庫へ戻して確認する。直った内容を利用者と再確認するまでは、サイン受領・受渡しに進まない。','T055 T056',importance='critical')
item('A2-X3','Exception','代理の受取りは U02 の未確認事項を残す。本人確認書類や委任状、許可条件などを創作しない。','T053 T054',status='uncertain',importance='critical',group='U02')
section('### Output')
item('A2-O1','Output','利用者 — 確認済みの機材・付属品の引渡し。','T026')
item('A2-O2','Output','貸出票 — 貸した個体番号・付属品、サイン、実際の受取時刻。返却確認が照合できる記録。','T008 T026 T028 T032',importance='critical')
item('A2-O3','Output','在庫表 — 貸出中の状態。','T028')
section('## Result');para(e('A2-RESULT','Result','予約に対応する機材を確認のうえ利用者へ渡し、個体・付属品・時刻の記録により返却時の照合ができる。未解決の不一致では引渡しが成立しない。','T026 T028 T032 T056',importance='critical'))

section('# Activity 返却機材を受け取り点検する')
para(e('A3-WHAT','What','返却の受領と時刻記録、個体・付属品・動作の点検を区別し、機材ごとに再貸出し可否と検収結果を残す。','T012 T030 T032 T062',importance='critical'))
section('## Scope');para('true')
section('## Why');para(e('A3-WHY','Why','受け取っただけの機材を貸せると扱わず、次の貸出しや料金計算に使える検収結果を残す。','T002 T004 T010 T032 T042 T062 T070',importance='critical'))
section('## When');para(e('A3-WHEN','When','利用者が店舗へ返却したときに受付が受領する。貸出票を添えた機材を倉庫担当が手の空いたとき順に点検する。当日中の点検完了は約束せず、翌朝になることもある。','T006 T012 T013 T014'))
section('## Who');para(e('A3-WHO','Who','受付は返却受領と時刻記録・点検待ちへの更新を行う。倉庫担当が点検し検収済みを付ける。「受付が全部戻ったら完了」は訂正済み。','T012 T028 T030 T032',status='corrected',importance='critical',superseded_turns=['T028'],replacement_turns=['T030']))
section('## Where');para(e('A3-WHERE','Where','同じ店舗で受け取り、黄色い札を付けた返却用の棚へ置く。倉庫で点検する。','T006 T012 T014 T032'))
section('## How');section('### Input')
item('A3-I1','Input','利用者 — 返却機材、遅れて持参する不足品。','T006 T012 T034')
item('A3-I2','Input','貸出票 — 貸出時の個体番号・付属品、実際の返却時刻、前回の不足・保留内容。','T008 T012 T032 T034',importance='critical')
item('A3-I3','Input','機材と付属品 — 返却された実物と箱。','T004 T012 T032')
section('### Procedure')
item('A3-P1','Procedure','受付は返却を受け取った時刻を貸出票に記入し、在庫表を点検待ちにする。箱に貸出票を添えて黄色い札の棚へ置く。この段階では再貸出し不可。','T012 T014 T030',importance='critical')
item('A3-P2','Procedure','倉庫担当は貸出票の個体番号・付属品との一致と動作を確かめる。問題がなければ結果と検収済みを記し、在庫表を貸出可へ戻す。箱数の確認だけでは戻さない。','T031 T032',importance='critical')
item('A3-P3','Procedure','同じ予約でも機材ごとに結果を扱う。検収済みの分だけ計算担当へ回し、不足・故障分はまだ計算しないと分かるよう残す。','T061 T062',importance='critical')
section('### Exception')
item('A3-X1','Exception','付属品不足は貸出票に残して検収を保留し、機材は点検待ちのままにする。受付が利用者に連絡して持参を依頼し、届いた後に倉庫担当が残りを確認する。','T033 T034 T037 T038',importance='critical')
item('A3-X2','Exception','故障は倉庫担当が症状を記録し修理中に更新する。機材と症状を修理担当へ渡す。その場で利用者の負担は決めない。','T035 T036 T043 T044',importance='critical')
item('A3-X3','Exception','不足・故障の記録を受付へ渡し、予約と利用予定を調整する業務で後続予約への影響を確認・調整できるようにする。','T037 T038',importance='critical')
section('### Output')
item('A3-O1','Output','貸出票 — 実返却時刻、機材ごとの検収結果、不足品・故障症状、保留。受付・計算担当が必要な内容を受け取る。','T012 T030 T032 T034 T038 T042 T062',importance='critical')
item('A3-O2','Output','在庫表 — 点検待ち、検収後の貸出可、故障時の修理中。','T030 T032 T034 T036',importance='critical')
item('A3-O3','Output','修理担当 — 故障した機材と症状。','T036')
item('A3-O4','Output','利用者 — 受付からの不足品持参依頼。','T034')
section('## Result');para(e('A3-RESULT','Result','正常に検収した機材は再貸出しでき、該当分の料金計算を進められる。不足・故障のある分は保留を維持し、同じ予約の正常分を止めない。店で受領したことだけを検収完了・再貸出し可としない。','T032 T034 T042 T062 T069 T070',importance='critical'))

section('# Activity 料金を確認して請求を依頼する')
para(e('A4-WHAT','What','検収済みの貸出分または取消料がある予約の料金を計算し、利用者の確認を得た分を経理へ渡す。','T042 T062 T064 T066 T068',importance='critical'))
section('## Scope');para('true')
section('## Why');para(e('A4-WHY','Why','予約・返却実績に基づく内訳を利用者と確認し、未確定額を混ぜずに経理が請求できる材料をそろえる。','T042 T044 T064 T068',importance='critical'))
section('## When');para(e('A4-WHEN','When','検収済みの貸出票が計算担当へ届いたとき。取消料の対象となる取消の連絡を受けたとき。','T024 T042 T062 T066'))
section('## Who');para(e('A4-WHO','Who','受付とは別の計算担当。内容の確認・異議の提示は利用者が行い、請求書発行は範囲外の経理が担う。','T041 T042 T064 T068',importance='critical'))
section('## Where');para(e('A4-WHERE','Where','計算担当から利用者への内訳提示はメール。計算作業場所と経理への送付チャネルは発言されていないため未確認とする。','T064 T068',status='uncertain',importance='minor',observed_part='内訳の利用者への提示はメール。',uncertain_part='計算作業場所、経理への送付チャネル。'))
section('## How');section('### Input')
item('A4-I1','Input','貸出票 — 機材ごとの検収済みの結果、実際の返却時刻。','T042 T062')
item('A4-I2','Input','予約表 — 予約した期間と対象予約の情報。取消の場合は受付から取消の連絡を受ける。','T024 T066 T068')
item('A4-I5','Input','利用者 — 受付で確認した請求先。保存先と内部での受渡し手段は未確認。','T067 T068')
item('A4-I3','Input','料金表 — 基本・延滞・取消料の計算基準。具体額等は U04 の未提供を残す。','T024 T042 T048 T066')
item('A4-I4','Input','利用者 — 料金内訳に間違いがない旨の返信、または異議。','T064 T066',importance='critical')
section('### Procedure')
item('A4-P1','Procedure','検収済みの分について、予約期間の基本料金と実返却時刻を料金表に照らし、遅延の追加料金を計算する。取消料は取消の連絡と料金表から計算する。','T042 T062 T066',importance='critical')
item('A4-P2','Procedure','計算担当が内訳を利用者へメールし、間違いがないとの返信を得た分を確定する。','T063 T064',importance='critical')
item('A4-P3','Procedure','確定した分について予約番号、請求先、内訳、金額を経理へ請求依頼として渡す。','T064 T067 T068',importance='critical')
section('### Exception')
item('A4-X1','Exception','異議のある分は貸出票・料金表を確認して利用者へ再説明する。無返信では確定せず、催促日数は U05 の未確認を残す。','T064 T065 T066',importance='critical')
item('A4-X2','Exception','不足・故障のある未検収分を計算対象に混ぜない。正常な検収済み分は進める。故障分の負担決定は U01 の保留を維持する。','T044 T061 T062',importance='critical')
section('### Output')
item('A4-O1','Output','利用者 — 基本・追加・取消料の内訳と、異議があった場合の再説明。','T064 T066')
item('A4-O2','Output','料金内訳・請求依頼 — 利用者が確認した確定分と、未確認・保留の区別。','T062 T064 T066')
item('A4-O3','Output','経理 — 予約番号、請求先、確定した内訳と金額を含む請求依頼。','T064 T068',importance='critical')
section('## Result');para(e('A4-RESULT','Result','利用者が確認した分の請求依頼が経理へ渡り、経理が請求書を発行できる。無返信・異議・未決の故障負担は請求確定に変えず、入金済みまで主張しない。','T044 T064 T066 T068',importance='critical'))

section('# 受渡しと状態の横断確認')
for id,s,t,group in [
('HOF01','予約表の確定した型・台数・日時が、倉庫の前営業日の準備の入力になる。','T008 T018 T022','A2-I1'),
('HOF02','倉庫の個体選択・付属品確認が箱と貸出票に残り、受付での利用者との照合へ渡る。','T018 T026 T040','A2-P1'),
('HOF03','貸出時の個体・付属品記録と返却物を照合し、倉庫が機材ごとの検収結果を貸出票へ残す。','T026 T032 T062','A3-P2'),
('HOF04','不足・故障・準備不能は受付へ戻り、受付が後続予約と利用者への影響を調整する。','T038 T040','A1-XWHEN'),
('HOF05','正常に検収した分の貸出票が計算担当へ渡り、利用者が確認した料金情報が経理へ渡る。','T042 T062 T064 T068','A4-P3'),
('HOF06','取消は予約上の台数を解放し、用意済みなら倉庫で個体の割当てを解除する。変更・延長も倉庫へ知らせる。','T046 T048 T050 T060','A1-P4'),
('HOF07','店での返却受領、検収、再貸出し可能、料金確定は別の状態である。受領と検収の区別は設計者のまとめを依頼者が明示的に確認した。','T030 T032 T064 T069 T070','A3-RESULT')]:
    item(id,'Handoff',s,t,importance='critical',group=group)

section('# 許容する別分解')
para('''基本参照は、予約調整／準備・貸出し／受領・検収／料金確認の四つである。次の表現も同等に扱う。

- 「貸出し」と「返却」を一つの機材貸借管理にまとめた三つのActivity。受付と倉庫の責任差、点検待ち、準備・返却の異なる開始条件を埋没させないこと。
- 予約の新規・変更・取消・延長を別Activityに分ける、または準備と店頭受渡し、返却受領と検収を分ける分解。数が増えても内容が維持されていれば減点しない。
- 予約調整と延滞連絡を分ける、料金内訳の確定と経理への受渡しを一つにまとめる等、待ちや判断責任に沿った境界変更。
- 貸出票と検収記録を別Objectに分ける、利用者の請求先を顧客情報として分ける、物理機材をObjectにせず貸出票・在庫表との対応で書く構成。

What・Who・When・Where・Why・How・Input/Output・Resultと必要条件を意味で対応付ける。見出し数、順序、文言、こちらの ID の再現を評価しない。Objectの Scope は業務境界に沿う別整理を許容する。経理・修理が外部業務であることは維持する。''')

section('# 評価側だけが知る未発言設定')
para('以下はこの架空店舗の世界設定で、発言録から導出できない。初回草案の成功条件には入れない。これらを推測で断定した出力は、偶然設定と一致しても grounded な回収ではない。省略・適切な未確認表示は問題ない。')
item('HIDDEN01','Unspoken record retention','紙の貸出票は精算が終わった年の翌年から3年間、店舗の鍵付き書庫へ保管する。','',status='hidden-unspoken',importance='minor',prompted_by_transcript=False,question_obligation=False,acceptable_silence=True,question_note='保存期間を示す話題や問題は入力にない。無言でよく、質問しないことを失敗にしない。')
item('HIDDEN02','Unspoken handover artifact','受領サインのある貸出票は複写式で、控えを利用者にも渡している。','',status='hidden-unspoken',prompted_by_transcript=False,question_obligation=False,acceptable_silence=True,question_note='紙とサインへの言及だけでは複写や利用者控えを要求する根拠にならない。質問は任意で、無言でもよい。')
item('HIDDEN03','Unspoken assignment constraint','高輝度プロジェクターの一部は、持ち運ぶケースを二人で運べると倉庫担当が確認してから出庫する。','',status='hidden-unspoken',prompted_by_transcript=False,question_obligation=False,acceptable_silence=True,question_note='高輝度型・重量・搬送事故等は入力に出ていない。推測による二人作業ルールの断定は不可で、質問せず省略してよい。')

(P/'expected-business-design.md').write_text('\n\n'.join(parts)+'\n',encoding='utf-8')
ledger={
 'schema_version':'1.0','study':'Issue 172 synthetic consultation first-draft study','input_file':'transcript.txt',
 'input_sha256':hashlib.sha256((P/'transcript.txt').read_bytes()).hexdigest(),
 'provenance':'Evaluator-authored before first authoring output. Synthetic, not a real human transcript.',
 'status_definitions':{
  'observed':'発言から回収できる事実・依頼者が受け入れた解釈。構造上の整理は明示する。',
  'corrected':'先行発言が明示的に訂正されている。訂正後が対象。',
  'proposal-not-adopted':'発言にあるが採用された業務ルールではない。',
  'uncertain':'未発言の細部、明示的な未決、確認待ち。主張の不足と入力不足を分ける。',
  'hidden-unspoken':'世界設定にだけ存在し、入力から回収不能。正答の分母にも加点にも入れない。'},
 'scoring_policy':{
  'primary_unit':'引用付きの要素対応表と重要欠落・捏造の記述。118行を独立した118事実の標本とみなさない。semantic_group は既知の重複を結ぶ補助であり、網羅的な重複排除ではない。',
  'aggregate_warning':'単純な行数ベースの回収率を主成績にしない。集計する場合は、評価者が重複した業務命題を統合し、元の ID と統合根拠を公開する。',
  'positive_recovery_statuses':['observed','corrected'],
  'uncertainty_credit':'uncertain は内容の正答ではなく、留保を保てたかを別項目で評価する。明示保留の再質問は成功条件にしない。',
  'proposal_credit':'proposal-not-adopted は不採用を維持したかを評価し、業務実装としての回収に数えない。未採用案に触れず省略し、現行業務に採用しない出力も成功。拒否の明記や列挙を要求しない。',
  'hidden_rule':'hidden-unspoken は成功分母から除外。偶然一致でも positive credit はゼロ。断定した場合は unsupported assertion として別記録。',
  'unknown_detection_scope':'未知の検出は supplied work に重要で入力に手掛かりのあるものに限る。隠された任意の設定を質問しないことは失敗ではない。各 hidden の prompted_by_transcript / question_obligation / acceptable_silence を参照する。',
  'partial_rows':'複数の意味成分を持つ行は、どの成分が回収・欠落・誤記か引用付きで分ける。部分回収を完全回収にしない。',
  'critical_omissions':'importance critical の observed/corrected の根拠がある重要関係を落とした場合は material omission。uncertain/hidden の未知値を埋めないことは omission ではない。',
  'reasonable_structure':'名称・Object分割・Activity境界・順序・言い換えは意味維持なら許容。規則・責任・状態変化を追加する推論は構造整理ではない。',
  'grounding':'根拠として挙げた発言が支持する範囲だけで採点する。source_turns の近隣も必要なら読む。' },
 'elements':rows}
(P/'observability.json').write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('elements',len(rows),'statuses', {s:sum(r['status']==s for r in rows) for s in ledger['status_definitions']})
