// Explicit review draft, not inference from an opened Business Design.
// Source and boundaries: work/concept-review/issue-133/README.ja.md.
import {tables as fixtureTables,edges,activityDefinitions} from './concept-fixture';
type Concept={name:string;note:string;fields:string[][];sources?:string[];sourceActivities?:string[]};
const tables:Record<string,Concept>=fixtureTables;
export type ReviewGroup={id:string;name:string;purpose:string;reviewer:string;consult:string[];activities:string[];inputs:string;guarantee:string;question:string;concepts:Record<string,Concept>;relations?:string[][]};
const concept=(id:string,fields:string[],note:string,name=tables[id].name,sources:string[]=[],sourceActivities:string[]=[]):Concept=>({name,fields:fields.map(name=>['',name]),note,sources,sourceActivities});
export const reviewGroups:ReviewGroup[]=[
 {id:'group-request',name:'購入要求・申請内容',purpose:'何を、なぜ、どの条件で購入したいかを表す。',reviewer:'申請業務責任者',consult:['申請者','承認者'],activities:['apply','revise'],inputs:'入力中の購入希望、見積根拠、差戻し理由、基幹の役職・役職別上限。',guarantee:'提出内容を版として特定し、理由・見積・品目を揃えて判断へ渡す。確定内容は直接変更しない。',question:'購入したい内容を過不足なく表せるか。再申請でも同じ要求を追い、過去に判断された内容を区別できるか。',concepts:{
 request:concept('request',['申請者','現在の提出版'],'差戻し・再申請でも同じ購入要求を追う。提出内容は版で区別する。承認や結果の生成責任は別でも、後続業務で必要な申請内容はそのビューにも表示する。','購入申請',['申請・再申請：同じ購入要求と現在の提出版を特定する。'],['apply','revise']),
 version:concept('version',['未確定／確定','購入理由','見積根拠（依頼全体）','提出日時'],tables.version.note,'購入申請版',['申請・再申請：提出時に確定した理由・見積・品目を保持する。'],['apply','revise']),
 item:concept('item',['版内の品目の識別','品名','税抜希望単価','依頼数量 Q'],'何を、いくつ、どの単価で依頼するかを提出版に結び付ける。保存時1品目以上。未確定は入力不足を許し、提出時は全品目情報を揃える。確定後は直接変更せず、再申請は別版の品目を使う。','申請品目',['申請・再申請：対象版の品名・税抜希望単価・依頼数量。'],['apply','revise'])
 }},
 {id:'group-decision',name:'購入可否の判断',purpose:'どの提出内容に対して、購入を認めたか、差し戻したかを表す。',reviewer:'承認業務責任者',consult:['申請者','購買担当者'],activities:['approve'],inputs:'現在提出版の購入理由・見積根拠・品目、現在判断、準備の有無。',guarantee:'現在有効な承認とその対象版を特定する。別版への再申請に旧判断を流用しない。',question:'何を判断したか明確か。差戻しと購入準備の確定が同時に成立しないか。',relations:[['request','item','1','1..N','down']],concepts:{
 request:concept('request',['申請者（申請元）','判断対象の提出版','購入理由（対象版）','見積根拠（対象版）','現在判断（承認／差戻し）','判断日時・差戻し理由','購入準備の有無（参照）'],'判断対象の申請内容と判断結果を一緒に確認する。品目はこの対象版に属する。再申請には旧判断を流用せず、準備確定後は差戻しできない。ビュー上のまとまりであり、独立した判断レコードの保存を要求しない。','購入判断と対象内容',['申請・再申請：対象版の理由・見積・申請者。','承認：対象版に対する判断・日時・差戻し理由。','購入準備：差戻し可否を確認するための準備の有無。'],['apply','revise','approve','prepare']),
 item:concept('item',['品名','依頼数量 Q','税抜希望単価'],'判断対象版の品目を展開する。数量や単価を別の図で探さず、判断内容が十分か確認する。承認業務が品目を生成・変更する意味ではない。','判断対象品目',['申請・再申請：判断対象の確定提出版の品目を使用する。'],['apply','revise'])
 }},
 {id:'group-handoff',name:'購入対象の確定・引渡し',purpose:'承認された内容のうち、何をまとめて購入に回したかを表す。',reviewer:'購買業務責任者',consult:['承認者','引渡し先'],activities:['prepare'],inputs:'有効な承認、承認と同じ対象版・品目・見積根拠、未準備の申請。',guarantee:'準備番号・対象申請・対象版を固定し、CSV失敗後も同番号・同内容で再出力する。',question:'承認どおりの対象を取り違えず渡せるか。重複した準備や、再出力による内容変更がないか。',relations:[['preparation','request','0..1','1..N','down'],['request','item','1','1..N','down']],concepts:{
 preparation:concept('preparation',['準備番号','書き出し日時の情報'],'1件以上の申請をまとめて購入へ渡す。準備番号と対象群は不変。CSV失敗でも準備を残し、同じ番号・内容を再出力する。書き出し日時の履歴範囲は未決。','購入準備',['購入準備：準備番号・固定した対象・書き出し日時。'],['prepare']),
 request:concept('request',['対象申請・申請者','対象の確定提出版','購入理由（対象版）','見積根拠（対象版）','有効な承認（対象版）'],'購入対象の申請内容を、対象版の理由・見積・承認まで含めて確認する。現在有効な承認と同じ版を確定し、以後は別版や最新情報から再構成しない。申請を品目別に分割しない規則の業務上の理由はレビューで補う。','購入対象（申請単位）',['購入準備：対象申請と対象版を固定する。','申請・再申請：その確定版の申請者・理由・見積根拠。','承認：固定する版と有効な承認の対象版が一致することを確認する。'],['prepare','apply','revise','approve']),
 item:concept('item',['品名','依頼数量 Q','税抜希望単価'],'購入へ回した品目・数量・単価を、その場で確認する。準備に固定した申請版の全品目を使用し、別申請・別版や後から変更された値を混ぜない。表示の展開は品目の複製保存や新しい業務概念の追加を要求しない。','購入対象品目',['申請・再申請：購入準備に固定した対象版の品名・依頼数量・税抜希望単価。','購入準備：使用する対象版を確定し、その内容で再出力する。'],['apply','revise','prepare'])
 }},
 {id:'group-result',name:'入庫・未購入・終結',purpose:'依頼した数量の行方を、入庫済み・購入しない・待ちに分けて説明する。',reviewer:'購買業務責任者',consult:['申請者','入庫を確認する人'],activities:['result'],inputs:'準備対象版の元品目・依頼数量、既存の入庫、申請者との未購入調整結果。',guarantee:'元の依頼内容を変えず、Q＝R＋C＋Wを保つ。全品目の待ち数量が0になったとき申請を一度だけ終結する。',question:'分割入庫・購入なしを表せるか。残数を見失わず、完了と判断できるか。',relations:[['request','item','1','1..N','down'],['request','receipt','1','0..N','down'],['receipt','line','1','1..N','down'],['item','line','1','0..N','reference']],concepts:{
 request:concept('request',['対象申請・申請者','準備番号・対象の確定版','終結結果'],'購入対象として固定した申請の結果を確認する。全品目の待ち数量が0のとき一度だけ終結。全部購入・一部購入・購入なしを区別し、破棄とは混同しない。','購入結果（申請単位）',['申請・購入準備：元の購入要求と固定した対象版。','結果登録：全品目の数量状況に基づく終結。'],['apply','prepare','result']),
 item:concept('item',['品名（対象版）','税抜希望単価（対象版）','依頼数量 Q','入庫累計 R','購入しない確定数量 C','待ち数量 W＝Q−R−C'],'元の品名・単価・数量と結果を一緒に確認する。Rは各回の入庫内訳の合計、WはQ−R−Cとして導出する値であり、新しい保存項目を要求しない。Cを増やす場合は申請者と調整済み。Q・品名・単価を結果に合わせて変更しない。','購入品目の数量状況',['申請・再申請：準備対象版の品名・税抜希望単価・依頼数量Q。','結果登録：各回の入庫、調整済みの購入しない数量C。','導出：入庫累計Rと待ちW。'],['apply','revise','prepare','result']),
 receipt:concept('receipt',['入庫回の識別','対象申請','各回の入庫内訳'],tables.receipt.note,'入庫回',['結果登録：各回の入庫を区別する。'],['result']),
 line:concept('line',['元の品名・品目（対象版）','今回入庫数量'],'どの元品目が今回いくつ入庫したかを示す。準備対象版の元品目を使い、別申請・旧版・代替品を混入させない。同じ登録の再送で数量を増やさない。','入庫内訳',['申請・購入準備：固定した対象版の元品目と品名。','結果登録：その回に入庫した数量。'],['apply','prepare','result'])
 }}
];
export const reviewBoundaries=[
 {from:'group-request',to:'group-decision',label:'提出版・購入理由・見積・品目',promise:'判断に必要な情報が揃い、対象の版を特定できる。'},
 {from:'group-request',to:'group-handoff',label:'購入対象として固定する申請内容',promise:'申請内容を版で特定し、引渡し内容を取り違えない。'},
 {from:'group-decision',to:'group-handoff',label:'現在有効な承認・その対象版',promise:'購入対象版と、承認の対象版が一致する。'},
 {from:'group-decision',to:'group-request',label:'差戻し理由',promise:'確定内容は直接変更せず、別版で再申請する。'},
 {from:'group-handoff',to:'group-result',label:'固定した対象申請・版・元品目',promise:'別申請・旧版を混入せず結果を記録する。'},
 {from:'group-result',to:'group-request',label:'入庫・未購入・待ち・終結',promise:'元の依頼数量を変えず、その行方を説明する。'}
];
export const findReviewGroup=(id:string|undefined|null)=>reviewGroups.find(group=>group.id===id);
export function reviewGraph(id:string){const group=findReviewGroup(id);if(!group)throw Error('Unknown review group: '+id);const ids=Object.keys(tables).filter(id=>Object.hasOwn(group.concepts,id));return {ids,tables:group.concepts,edges:(group.relations??edges).filter(([from,to]:string[])=>ids.includes(from)&&ids.includes(to))};}
export const reviewActivityNames=(group:ReviewGroup)=>group.activities.map(id=>activityDefinitions.find(a=>a.id===id)!.title);
