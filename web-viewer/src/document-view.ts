import {activityRole} from './roles';
import type {Design} from './graph';
import type {Check,Run} from './json-document';
import {formattedMarkdown} from './markdown';
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

/** Requester-facing view of existing Check contents; provenance remains in the document. */
export function renderRequesterChecks(design:Design,activityId?:string):HTMLElement{
 const root=element('section');root.className='check-content json-checks';const bd=design.model!.business;
 const checks=design.model!.checks.filter(doc=>doc.basedOn.documentId===bd.id);
 let found=false;
 for(const doc of checks){
  const reader=new RichReader(doc),rows=doc.index.filter(row=>row.activityId===activityId);
  const assigned=new Set(doc.index.flatMap(row=>row.checkIds));
  const ids=activityId?[...new Set(rows.flatMap(row=>row.checkIds))]:doc.items.filter(item=>!assigned.has(item.id)).map(item=>item.id);
  const sections=doc.sections.filter(section=>activityId?section.activityId===activityId:section.activityId===null);
  for(const section of sections){
   if(section.preamble.length||doc.guarantees.some(guarantee=>guarantee.sectionId===section.id))found=true;
   reader.runs(root,section.preamble);
   for(const guarantee of doc.guarantees.filter(value=>value.sectionId===section.id))reader.runs(root,[{kind:'reference',targetId:guarantee.id,label:guarantee.title}]);
  }
  for(const id of ids){const item=doc.items.find(value=>value.id===id);if(!item)continue;found=true;
   const section=element('section');section.className='check-item';section.dataset.checkId=item.checkId;section.dataset.elementId=item.id;section.append(element('h3',item.title));
   const fields=Object.fromEntries(Object.entries(item.fields).filter(([name])=>['classification','condition','expectedResult','guarantee','question','alternatives'].includes(name)));
   reader.fields(section,fields,new Set([item.id]));root.append(section);
  }
 }
 if(!found)root.append(element('p','この業務のテスト仕様はありません。'));
 return root;
}
