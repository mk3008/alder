// Explicit review draft, not inference from an opened Business Design.
// Source and boundaries: work/concept-review/issue-133/README.ja.md.
import {tables as fixtureTables,edges,activityDefinitions} from './concept-fixture';
type Concept={name:string;note:string;fields:string[][]};
const tables:Record<string,Concept>=fixtureTables;
export type ReviewGroup={id:string;name:string;purpose:string;reviewer:string;consult:string[];activities:string[];inputs:string;guarantee:string;question:string;concepts:Record<string,Concept>};
const concept=(id:string,fields:string[],note:string):Concept=>({name:tables[id].name,fields:fields.map(name=>['',name]),note});
export const reviewGroups:ReviewGroup[]=[
 {id:'group-request',name:'購入要求・申請内容',purpose:'何を、なぜ、どの条件で購入したいかを表す。',reviewer:'申請業務責任者',consult:['申請者','承認者'],activities:['apply','revise'],inputs:'入力中の購入希望、見積根拠、差戻し理由、基幹の役職・役職別上限。',guarantee:'提出内容を版として特定し、理由・見積・品目を揃えて判断へ渡す。確定内容は直接変更しない。',question:'購入したい内容を過不足なく表せるか。再申請でも同じ要求を追い、過去に判断された内容を区別できるか。',concepts:{
 request:concept('request',['申請者','現在の提出版'],'差戻し・再申請でも同じ購入要求を追うためのまとまり。提出する内容は版で区別する。承認判断、購入準備への所属、終結結果は、それぞれを生成する業務の分類で説明する。'),
 version:concept('version',['未確定／確定','購入理由','見積根拠（依頼全体）','提出日時'],tables.version.note),
 item:concept('item',['版内の品目の識別','品名・税抜希望単価','依頼数量 Q'],'何を、いくつ購入したいかを、提出する版に結び付ける。保存時1品目以上で、未確定なら入力値の不足を許す。提出時は全品目情報が必要。確定後の品目は直接変更せず、再申請は別版の品目を使う。購入しない数量・入庫実績は後続の結果登録で扱う。')
 }},
 {id:'group-decision',name:'購入可否の判断',purpose:'どの提出内容に対して、購入を認めたか、差し戻したかを表す。',reviewer:'承認業務責任者',consult:['申請者','購買担当者'],activities:['approve'],inputs:'現在提出版の購入理由・見積根拠・品目、現在判断、準備の有無。',guarantee:'現在有効な承認とその対象版を特定する。別版への再申請に旧判断を流用しない。',question:'何を判断したか明確か。差戻しと購入準備の確定が同時に成立しないか。',concepts:{
 request:concept('request',['提出版（参照）','現在判断（対象版・承認／差戻し）','判断日時・差戻し理由'],'判断は特定の提出版に対して成立する。再申請で対象版を切り替えると旧判断は現在の根拠から外れる。差戻し理由は必須。購入準備確定後は差戻しできない。独立した判断概念や判断履歴を必須にせず、現在の草案では購入申請に含まれる情報として表示する。')
 }},
 {id:'group-handoff',name:'購入対象の確定・引渡し',purpose:'承認された内容のうち、何をまとめて購入に回したかを表す。',reviewer:'購買業務責任者',consult:['承認者','引渡し先'],activities:['prepare'],inputs:'有効な承認、承認と同じ対象版・品目・見積根拠、未準備の申請。',guarantee:'準備番号・対象申請・対象版を固定し、CSV失敗後も同番号・同内容で再出力する。',question:'承認どおりの対象を取り違えず渡せるか。重複した準備や、再出力による内容変更がないか。',concepts:{
 preparation:tables.preparation,
 request:concept('request',['準備所属・対象版'],'有効な承認を持つ申請を購入準備へ所属させ、その対象版を固定する。申請を品目別に分割しないという現行草案の規則を保持するが、その業務上の理由はレビューで補う。同じ申請を別の購入準備へ重複して含めない。')
 }},
 {id:'group-result',name:'入庫・未購入・終結',purpose:'依頼した数量の行方を、入庫済み・購入しない・待ちに分けて説明する。',reviewer:'購買業務責任者',consult:['申請者','入庫を確認する人'],activities:['result'],inputs:'準備対象版の元品目・依頼数量、既存の入庫、申請者との未購入調整結果。',guarantee:'元の依頼内容を変えず、Q＝R＋C＋Wを保つ。全品目の待ち数量が0になったとき申請を一度だけ終結する。',question:'分割入庫・購入なしを表せるか。残数を見失わず、完了と判断できるか。',concepts:{
 request:concept('request',['終結結果'],'全品目の待ち数量が0のとき申請を一度だけ終結する。全部購入・一部購入・購入なしを区別する。破棄と終結は別の意味。'),
 receipt:tables.receipt,line:tables.line,
 item:concept('item',['元品目の識別（参照）','依頼数量 Q（参照）','購入しない確定数量 C'], '依頼数量Qは申請側が生成した照合基準として参照する。各回の入庫から累計Rを求め、購入しない数量Cと待ちWを区別する。Q＝R＋C＋W、R・C・Wは非負。Cを増やす場合は申請者と調整済み。元の品名・単価・依頼数量を結果に合わせて変更しない。')
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
export function reviewGraph(id:string){const group=findReviewGroup(id);if(!group)throw Error('Unknown review group: '+id);const ids=Object.keys(tables).filter(id=>Object.hasOwn(group.concepts,id));return {ids,tables:group.concepts,edges:edges.filter(([from,to]:string[])=>ids.includes(from)&&ids.includes(to))};}
export const reviewActivityNames=(group:ReviewGroup)=>group.activities.map(id=>activityDefinitions.find(a=>a.id===id)!.title);
