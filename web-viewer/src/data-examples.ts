import {type ReviewGroup} from './concept-review-fixture';
export type SampleBlock={card:string;columns:string[];rows:(string|number)[][];empty?:string};
export type DataExample={id:string;group:string;name:string;when:string;meaning:string;blocks:SampleBlock[];note?:string};
const itemColumns=['申請','対象版','品名','依頼数量 Q','税抜希望単価'];
const itemsA=[['R-101','V1','ボールペン',10,'100円'],['R-101','V1','ファイル',2,'500円']];
const itemsB=[['R-102','V1','コピー用紙',3,'400円']];
const requests=[['R-101','申請者A','V1','見積Q-101','承認済み','V1'],['R-102','申請者B','V1','見積Q-102','承認済み','V1']];
const targetColumns=['申請','申請者','対象版','見積根拠','有効な承認','承認対象版'];
const block=(card:string,columns:string[],rows:(string|number)[][],empty?:string):SampleBlock=>({card,columns,rows,empty});
const handoff=(time:string)=>[
 block('preparation',['準備番号','今回の書き出し日時'],[['P-001',time]]),
 block('request',targetColumns,requests),block('item',itemColumns,[...itemsA,...itemsB])
];
const balanceColumns=['品名（V1）','税抜希望単価','依頼数量 Q','入庫累計 R','購入しない C','待ち W'];
const balances=(penR:number,penC:number,fileR:number,fileC:number)=>([
 ['ボールペン','100円',10,penR,penC,10-penR-penC],['ファイル','500円',2,fileR,fileC,2-fileR-fileC]
]);
const result=(status:string,rows:(string|number)[][],receipts:(string|number)[][],lines:(string|number)[][])=>[
 block('request',['対象申請','対象版','準備番号','結果'],[['R-101','V1','P-001',status]]),block('item',balanceColumns,rows),
 block('receipt',['入庫回','対象申請'],receipts,'入庫回は0件です。'),block('line',['入庫回','元の品名（V1）','今回入庫数量'],lines,'入庫内訳は0件です。')
];
export const dataExamples:DataExample[]=[
 {id:'request-draft',group:'group-request',name:'入力途中の下書き',when:'ボールペンを購入したいが、数量・見積がまだ決まっていない。',meaning:'品目が存在することと、値がすべて入力済みであることを分けます。保存できますが、提出済みではありません。',blocks:[
 block('request',['申請','申請者','現在の提出版'],[['R-101','申請者A','まだない']]),
 block('version',['版','確定状態','購入理由','見積根拠','提出日時'],[['V1','未確定','未入力','未入力','未提出のため、まだない']]),
 block('item',['版','品名','依頼数量 Q','税抜希望単価'],[['V1','ボールペン','未入力','未入力']])
 ]},
 {id:'request-submitted',group:'group-request',name:'2品目をまとめて提出',when:'購入理由・見積・全品目情報が揃い、提出条件を満たして提出した。',meaning:'1件の申請のV1に2品目が属します。判断を受ける内容は、この確定版です。',blocks:[
 block('request',['申請','申請者','現在の提出版'],[['R-101','申請者A','V1']]),
 block('version',['版','確定状態','購入理由','見積根拠','提出日時'],[['V1','確定','事務用品の補充','見積Q-101','2026-10-25 09:00']]),block('item',itemColumns,itemsA)
 ],note:'税抜希望額は2,000円。金額などの提出条件を満たす前提の例で、役職別上限額の値は定めていません。'},
 {id:'decision-approved',group:'group-decision',name:'V1の内容を承認',when:'提出されたR-101のV1を確認して、承認した。',meaning:'承認は申請番号だけでなく、V1の内容に対応します。品名・数量・単価も同じ場面で確認できます。',blocks:[
 block('request',['申請','判断対象版','購入理由','見積根拠','現在判断','判断日時','購入準備'],[['R-101','V1','事務用品の補充','見積Q-101','承認','2026-10-25 09:30','未準備']]),block('item',itemColumns,itemsA)
 ]},
 {id:'decision-resubmitted',group:'group-decision',name:'差戻し後のV2は判断待ち',when:'V1は「数量を見直してください」と差し戻され、ボールペンを12本にしたV2が再提出された。',meaning:'以前のV1への差戻しを、V2の判断として扱いません。新しい対象版はV2で、まだ判断されていません。',blocks:[
 block('request',['申請','現在の判断対象版','購入理由','見積根拠','現在判断'],[['R-101','V2','事務用品の補充','見積Q-101-V2','まだない（判断待ち）']]),
 block('item',itemColumns,[['R-101','V2','ボールペン',12,'100円'],['R-101','V2','ファイル',2,'500円']])
 ],note:'この場面は他の例とは独立しています。過去の確定V1の品目は直接書き換えません。'},
 {id:'handoff-batch',group:'group-handoff',name:'2申請をまとめて購入へ',when:'R-101のV1とR-102のV1に有効な承認があり、同じ購入準備P-001へ確定した。',meaning:'1つの準備に2申請、対象品目は合計3行。各品目がどの申請・版のものか追えます。',blocks:handoff('2026-10-25 10:00')},
 {id:'handoff-retry',group:'group-handoff',name:'CSV失敗後も同じ内容を再出力',when:'10:00のCSV出力に失敗したが、購入準備P-001は残った。10:05に同じ対象を再出力する。',meaning:'準備番号・対象申請・対象版・品目・数量・単価を変えずに再出力します。新しい準備を作る例ではありません。',blocks:handoff('2026-10-25 10:05'),note:'各時点の今回の書き出し日時を例示しています。初回・最終・全履歴のどれを保存するかは未決です。'},
 {id:'result-partial',group:'group-result',name:'1回目の入庫で、まだ待ちがある',when:'ボールペン4本とファイル1冊が届いた。残りは引き続き待っている。',meaning:'品目ごとに待ち数量が残るため、申請はまだ終結しません。',blocks:result('作業中（未終結）',balances(4,0,1,0),[['RC-001','R-101']],[['RC-001','ボールペン',4],['RC-001','ファイル',1]])},
 {id:'result-closed',group:'group-result',name:'2回の入庫と未購入の確定で終結',when:'2回目にボールペン3本とファイル1冊が届いた。残りのボールペン3本は、申請者と調整して購入しないと確定した。',meaning:'ボールペンは10＝7＋3＋0、ファイルは2＝2＋0＋0。全品目の待ちが0なので、一部購入として終結します。',blocks:result('一部購入で終結',balances(7,3,2,0),[['RC-001','R-101'],['RC-002','R-101']],[['RC-001','ボールペン',4],['RC-001','ファイル',1],['RC-002','ボールペン',3],['RC-002','ファイル',1]])},
 {id:'result-none',group:'group-result',name:'入庫せず、全数購入なしで終結',when:'申請者と調整し、ボールペン10本・ファイル2冊とも購入しないと確定した。',meaning:'購入しない数量だけで待ちが0になります。入庫がないので、空の入庫回や内訳は作りません。',blocks:result('購入なしで終結',balances(0,10,0,2),[],[])}
];
export const examplesFor=(group:string)=>dataExamples.filter(example=>example.group===group);
export const findDataExample=(group:string,id:string|undefined|null)=>examplesFor(group).find(example=>example.id===id);
function add(root:HTMLElement,tag:string,value:string){const el=document.createElement(tag);el.textContent=value;root.append(el);return el;}
export function renderExampleControls(root:HTMLElement,group:ReviewGroup,current:string|undefined,change:(id?:string)=>void){
 const bar=document.createElement('div');bar.className='data-example-modes';bar.setAttribute('aria-label','構造図とデータ例の切替');
 for(const [label,id]of [['構造図',undefined],['データ例',current??examplesFor(group.id)[0].id]] as const){const b=document.createElement('button');b.type='button';b.textContent=label;b.setAttribute('aria-pressed',String(label==='構造図'?!current:!!current));b.onclick=()=>change(id);bar.append(b);}root.append(bar);
}
export function renderDataExample(root:HTMLElement,group:ReviewGroup,id:string,change:(id:string)=>void){
 const example=findDataExample(group.id,id);if(!example)throw Error('Unknown data example: '+id);root.replaceChildren();root.dataset.dataExample=id;
 add(root,'p','架空のデータ例です。各場面は独立した例で、同じ申請番号でも同時に成立する状態ではありません。').className='data-example-caption';
 const label=document.createElement('label');label.className='data-example-picker';add(label,'span','場面');const select=document.createElement('select');select.setAttribute('aria-label','データ例の場面');for(const candidate of examplesFor(group.id)){const option=document.createElement('option');option.value=candidate.id;option.textContent=candidate.name;select.append(option);}select.value=id;select.onchange=()=>change(select.value);label.append(select);root.append(label);
 add(root,'h2',example.name);add(root,'p',example.when).className='data-example-when';add(root,'p',example.meaning).className='data-example-meaning';
 for(const block of example.blocks){const section=document.createElement('section');section.className='data-example-block';section.dataset.exampleCard=block.card;add(section,'h3',group.concepts[block.card].name);const wrap=document.createElement('div');wrap.className='data-example-table';const table=document.createElement('table');table.setAttribute('aria-label',group.concepts[block.card].name+'のデータ例');const caption=document.createElement('caption');caption.textContent=group.concepts[block.card].name+'に入る情報';table.append(caption);const head=document.createElement('thead'),tr=document.createElement('tr');for(const column of block.columns){const th=add(tr,'th',column);th.setAttribute('scope','col');}head.append(tr);table.append(head);const body=document.createElement('tbody');for(const row of block.rows){const tr=document.createElement('tr');for(const cell of row)add(tr,'td',String(cell));body.append(tr);}table.append(body);wrap.append(table);section.append(wrap);if(!block.rows.length)add(section,'p',block.empty??'データはありません。');root.append(section);}
 if(example.note)add(root,'p',example.note).className='data-example-note';
}
