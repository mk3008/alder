import {activityRole} from './roles';
import type {Design} from './graph';
import type {Check,Run} from './json-document';
import {formattedMarkdown} from './markdown';
import {createElement,SquareArrowOutUpRight} from 'lucide';
const element=<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e;};
function field(root:HTMLElement,name:string,value:string|null|undefined){if(value===null||value===undefined)return;root.append(element('h3',name),formattedMarkdown(value));}
const labels:Record<string,string>={classification:'分類',condition:'条件',expectedResult:'期待結果',guarantee:'一般保証',question:'未決事項',alternatives:'選択肢',evidence:'根拠',testEvidence:'Test証拠',derivation:'導出',confidence:'確信度',related:'関連'};
export function businessDetail(design:Design,id?:string):HTMLElement{
 const root=element('article');root.className='markdown json-detail';const json=design.model!,bd=json.business;
 const object=bd.objects.find(n=>n.id===id),activity=bd.activities.find(n=>n.id===id);
 if(object){field(root,'Scope',String(object.scope));field(root,'Icon',object.icon);root.append(element('h3','Information'));const list=element('ul');for(const info of object.information)list.append(element('li',info));root.append(list);}
 else if(activity){
  for(const [label,key]of [['Scope','scope'],['Why','why'],['When','when'],['Who','who'],['Where','where'],['Procedure','procedure'],['Exception','exception'],['Result','result'],['Problem','problem'],['Pain level','painLevel']] as const)field(root,label,key==='who'?(activityRole(design,activity.id)?.name??activity.who):activity[key]===null?null:String(activity[key]));
  for(const exception of bd.exceptions?.filter(e=>e.activityId===activity.id)??[]){root.append(element('h3','Exception · '+exception.name));field(root,'説明',exception.description);}
  const names=new Map([...bd.objects,...bd.activities].map(n=>[n.id,n.name]));
  for(const [kind,label]of [['input','Input'],['output','Output'],['business-exception','Exception When']] as const){const relations=bd.relations.filter(r=>r.kind===kind&&(r.fromId===id||r.toId===id));if(relations.length){root.append(element('h3',label));for(const r of relations)root.append(element('p',`${names.get(r.fromId)} → ${names.get(r.toId)} — ${r.label}`));}}
 }else{root.append(element('p','項目を選択すると業務内容を表示します。'));}
 return root;
}
/** References are expanded on demand. Neither a cycle nor fan-out eagerly builds a tree. */
class RichReader{
 private remaining=5000;private warned=false;
 constructor(private doc:Check){}
 private take(root:HTMLElement){if(this.remaining-->0)return true;if(!this.warned){this.warned=true;root.append(element('p','展開する内容が表示量の上限に達しました。続きは原文で確認してください。'));}return false;}
 runs(root:HTMLElement,values:Run[],seen=new Set<string>()){
  for(const r of values){if(!this.take(root))break;
   if(r.kind==='markdown'){root.append(formattedMarkdown(r.value));continue;}
   if(r.kind==='text'){const span=element('span',r.value);span.style.whiteSpace='pre-wrap';root.append(span);continue;}
   if(r.kind==='link'){root.append(element('span',`${r.label} (${r.uri})`));continue;}
   const detail=element('details'),summary=element('summary',r.label||r.targetId);detail.append(summary);root.append(detail);let loaded=false;
   detail.addEventListener('toggle',()=>{if(!detail.open||loaded)return;loaded=true;
    if(seen.has(r.targetId)){detail.append(element('p','循環参照：'+r.targetId));return;}
    if(seen.size>=16){detail.append(element('p','参照の深さの上限です。続きは原文で確認してください。'));return;}
    const visited=new Set(seen).add(r.targetId),doc=this.doc,guarantee=doc.guarantees.find(g=>g.id===r.targetId),example=doc.examples.find(e=>e.id===r.targetId),item=doc.items.find(i=>i.id===r.targetId),section=doc.sections.find(s=>s.id===r.targetId),note=doc.notes.find(n=>n.id===r.targetId);
    if(guarantee){detail.append(element('h4',guarantee.title));for(const block of guarantee.blocks){if(!this.take(detail))break;if(block.kind==='prose')this.runs(detail,block.content,visited);else this.example(detail,block.exampleId,visited);}}
    else if(example)this.example(detail,example.id,visited);
    else if(item){detail.append(element('p',`${item.checkId} · ${item.title} · ${item.reviewState}`));this.fields(detail,item.fields,visited);}
    else if(section){detail.append(element('h4',section.title));this.runs(detail,section.preamble,visited);}
    else if(note){detail.append(element('h4',note.title));this.runs(detail,note.content,visited);}
    else if(r.targetId===doc.id){detail.append(element('h4',doc.title));this.runs(detail,doc.intro,visited);}
   });
  }
 }
 fields(root:HTMLElement,fields:Record<string,Run[]>,seen:Set<string>){for(const [name,content]of Object.entries(fields)){if(!this.take(root))break;root.append(element('h4',labels[name]??name));this.runs(root,content,seen);}}
 private example(root:HTMLElement,id:string,seen:Set<string>){
  const ex=this.doc.examples.find(e=>e.id===id)!;const table=element('table'),head=element('tr');for(const c of ex.columns){if(!this.take(root))break;head.append(element('th',c));}table.append(head);
  for(const row of ex.rows){if(!this.take(root))break;const tr=element('tr');for(const cell of row){if(!this.take(root))break;const td=element('td');this.runs(td,cell,seen);tr.append(td);}table.append(tr);}const wrap=element('div');wrap.className='json-example';wrap.append(table);root.append(wrap);
 }
}
/** A second view of the same JSON Check items; references are not copied. */
export function renderTestSpecification(design:Design,activityId:string,selectedKey:string|undefined,actions:{open:(id:string)=>void;select:(key:string)=>void;business:(id:string)=>void}){
 const content=element('div'),detail=element('div'),model=design.model!,bd=model.business;
 content.className='test-spec-content';detail.className='test-spec-detail';
 const checks=model.checks.filter(doc=>doc.basedOn.documentId===bd.id);
 const key=(doc:Check,id:string)=>JSON.stringify([doc.id,id]);
 const itemIds=(doc:Check)=>new Set(doc.index.flatMap(row=>row.checkIds));
 const unassigned=(doc:Check)=>doc.items.filter(item=>!itemIds(doc).has(item.id));
 const rows=(id:string)=>checks.flatMap(doc=>doc.index.filter(row=>row.activityId===id).map(row=>({doc,row})));
 const heading=(id:string)=>bd.activities.find(item=>item.id===id)?.name??id;
 const select=(doc:Check,id:string)=>actions.select(key(doc,id));
 let title='テスト仕様';
 if(activityId==='@overview'){
  content.append(element('h2','業務別'));
  if(!checks.length)content.append(element('p','この文書にテスト仕様はありません。'));
  for(const activity of bd.activities){
   const count=new Set(rows(activity.id).flatMap(({doc,row})=>row.checkIds.map(id=>key(doc,id)))).size;
   const button=element('button');button.type='button';button.className='test-spec-index';button.append(element('span',activity.name),element('span',count?`${count} 項目`:'項目なし'));button.onclick=()=>actions.open(activity.id);content.append(button);
  }
  if(checks.some(doc=>unassigned(doc).length)){const button=element('button','未割当');button.type='button';button.className='test-spec-index';button.onclick=()=>actions.open('@unassigned');content.append(button);}
 }else{
  const matching=activityId==='@unassigned'?checks.flatMap(doc=>unassigned(doc).map(item=>({doc,item}))):rows(activityId).flatMap(({doc,row})=>row.checkIds.map(id=>({doc,item:doc.items.find(item=>item.id===id)})).filter((value):value is {doc:Check;item:Check['items'][number]}=>!!value.item));
  const unique=matching.filter((value,index)=>matching.findIndex(other=>key(other.doc,other.item.id)===key(value.doc,value.item.id))===index);
  if(!unique.length)content.append(element('p','この業務に対応するテスト仕様はありません。'));
  for(const doc of checks){
   const sections=doc.sections.filter(section=>activityId==='@unassigned'?section.activityId===null:section.activityId===activityId);
   const reader=new RichReader(doc);
   for(const section of sections){reader.runs(content,section.preamble);for(const guarantee of doc.guarantees.filter(g=>g.sectionId===section.id)){const group=element('section');reader.runs(group,[{kind:'reference',targetId:guarantee.id,label:guarantee.title}]);const disclosure=group.querySelector('details');if(disclosure)disclosure.open=true;content.append(group);}}
  }
  for(const {doc,item}of unique){
   const card=element('section');card.className='test-spec-item';card.dataset.checkId=item.checkId;
   const button=element('button');button.type='button';button.className='test-spec-item-title';button.append(element('strong',`${item.checkId} · ${item.title}`),element('span',item.reviewState));
   if(selectedKey===key(doc,item.id))card.classList.add('selected');button.onclick=()=>select(doc,item.id);card.append(button);
   const reader=new RichReader(doc),fields=Object.fromEntries(Object.entries(item.fields).filter(([name])=>['classification','condition','expectedResult','guarantee','question'].includes(name)));
   reader.fields(card,fields,new Set([item.id]));content.append(card);
  }
 }
 const picked=checks.flatMap(doc=>doc.items.map(item=>({doc,item}))).find(({doc,item})=>key(doc,item.id)===selectedKey);
 if(picked){
  const {doc,item}=picked;title=`${item.checkId} · ${item.title}`;detail.append(element('h3','関連業務'));
  const linked=doc.index.filter(row=>row.checkIds.includes(item.id));
  if(!linked.length)detail.append(element('p','関連業務は未割当です。'));
  for(const row of linked){const name=heading(row.activityId),b=element('button');b.type='button';b.className='test-spec-business-link';b.append(element('span',name),createElement(SquareArrowOutUpRight,{'aria-hidden':'true','stroke-width':1.8}));b.setAttribute('aria-label',name+'を業務タブで開く');b.onclick=()=>actions.business(row.activityId);detail.append(b);}
  const fields=Object.fromEntries(Object.entries(item.fields).filter(([name])=>!['classification','condition','expectedResult','guarantee','question'].includes(name)));
  new RichReader(doc).fields(detail,fields,new Set([item.id]));if(item.detailSummary)field(detail,'補足',item.detailSummary);
 }else detail.append(element('p','項目を選択すると関連業務や根拠を表示します。'));
 return {content,detail,title};
}
export function renderChecks(design:Design,selected?:string,checks=design.model!.checks):HTMLElement{
 const root=element('section');root.className='check-content json-checks';const json=design.model!,bd=json.business;
 root.append(element('p','原典の意味対応は未確認です。ID・版の一致は、業務合意やCheckの人間承認を表しません。'));
 if(!checks.length){root.append(element('p','この文書にCheck Itemはありません。'));return root;}
 for(const doc of checks){const reader=new RichReader(doc);
  root.append(element('h3',doc.title),element('p',`Check ${doc.revision} · BD ${doc.basedOn.revision} · ${doc.basedOn.verification}`));reader.runs(root,doc.intro);
  if(doc.basedOn.documentId!==bd.id){root.append(element('p','別の原典BDを参照しているため、この図へ関連付けません。'));continue;}
  const card=(id:string)=>{const item=doc.items.find(i=>i.id===id)!;const section=element('section');section.className='check-item';section.dataset.checkId=item.checkId;section.dataset.elementId=item.id;section.append(element('h3',`${item.checkId} · ${item.title}`),element('p',`人間レビュー状態: ${item.reviewState}`));reader.fields(section,item.fields,new Set([item.id]));if(item.detailSummary)field(section,'補足',item.detailSummary);root.append(section);};
  const unknown=doc.index.filter(r=>!bd.activities.some(a=>a.id===r.activityId));if(unknown.length)root.append(element('p','対応先不明: '+unknown.map(r=>r.activityId).join('、')));
  const row=doc.index.find(r=>r.activityId===selected);
  if(!row)root.append(element('p','Activityを選択すると、対応するCheckを表示します。'));
  else{field(root,'業務の目的',row.purpose);field(root,'つながり',row.connections);for(const section of doc.sections.filter(s=>s.activityId===selected)){reader.runs(root,section.preamble);for(const g of doc.guarantees.filter(g=>g.sectionId===section.id))reader.runs(root,[{kind:'reference',targetId:g.id,label:g.title}]);}for(const id of row.checkIds)card(id);}
  const unassigned=doc.sections.filter(s=>s.activityId===null);if(unassigned.length){root.append(element('h3','文書全体・未割当のCheck'));for(const section of unassigned){root.append(element('h4',section.title));reader.runs(root,section.preamble);for(const g of doc.guarantees.filter(g=>g.sectionId===section.id))reader.runs(root,[{kind:'reference',targetId:g.id,label:g.title}]);for(const item of doc.items.filter(i=>i.sectionId===section.id&&!doc.index.some(r=>r.checkIds.includes(i.id))))card(item.id);}}
  for(const note of doc.notes)reader.runs(root,[{kind:'reference',targetId:note.id,label:note.title}]);
 }return root;
}
