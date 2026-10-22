import type {Design} from './graph';
import type {Check,Run} from './json-document';
import {formattedMarkdown} from './markdown';
const element=(tag:string,text?:string)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e;};
function field(root:HTMLElement,name:string,value:string|null|undefined){if(value===null||value===undefined)return;root.append(element('h3',name),formattedMarkdown(value));}
export function jsonDetail(design:Design,id?:string):HTMLElement{
 const root=element('article');root.className='markdown json-detail';const json=design.json!,bd=json.business;
 root.append(element('p',`JSON · package ${json.revision} · BD ${bd.revision}`));
 const object=bd.objects.find(n=>n.id===id),activity=bd.activities.find(n=>n.id===id);
 if(object){field(root,'Scope',String(object.scope));field(root,'Icon',object.icon);field(root,'Information',object.information.join('\n'));}
 else if(activity){
  for(const [label,key]of [['Scope','scope'],['Why','why'],['When','when'],['Who','who'],['Where','where'],['Procedure','procedure'],['Exception','exception'],['Result','result'],['Problem','problem'],['Pain level','painLevel']] as const)field(root,label,activity[key]===null?null:String(activity[key]));
  for(const kind of ['input','output','business-exception'] as const){const relations=bd.relations.filter(r=>r.kind===kind&&(r.fromId===id||r.toId===id));if(relations.length){root.append(element('h3',kind));for(const r of relations){const names=(i:string)=>[...bd.objects,...bd.activities].find(n=>n.id===i)?.name??i;root.append(element('p',`${names(r.fromId)} → ${names(r.toId)} — ${r.label}`));}}}
 }else{field(root,bd.title,bd.preface);field(root,'Scope',bd.scope);}
 if(id)root.append(element('small',`要素ID: ${id}`));return root;
}
function runs(root:HTMLElement,values:Run[],doc:Check,seen=new Set<string>()){
 for(const r of values){
  if(r.kind==='text'){root.append(document.createTextNode(r.value));continue;}
  if(r.kind==='link'){root.append(element('span',`${r.label} (${r.uri})`));continue;}
  const detail=element('details'),summary=element('summary',r.label);detail.append(summary);root.append(detail);
  if(seen.has(r.targetId)){detail.append(element('p','循環参照：'+r.targetId));continue;}
  const visited=new Set(seen).add(r.targetId),guarantee=doc.guarantees.find(g=>g.id===r.targetId),example=doc.examples.find(e=>e.id===r.targetId),item=doc.items.find(i=>i.id===r.targetId),section=doc.sections.find(s=>s.id===r.targetId),note=doc.notes.find(n=>n.id===r.targetId);
  if(guarantee){detail.append(element('h4',guarantee.title));for(const block of guarantee.blocks){if(block.kind==='prose')runs(detail,block.content,doc,visited);else renderExample(detail,doc,block.exampleId,visited);}}
  else if(example)renderExample(detail,doc,example.id,visited);
  else if(item){detail.append(element('p',`${item.checkId} · ${item.title} · ${item.reviewState}`));for(const [name,content]of Object.entries(item.fields)){detail.append(element('h4',name));runs(detail,content,doc,visited);}}
  else if(section){detail.append(element('h4',section.title));runs(detail,section.preamble,doc,visited);}
  else if(note)runs(detail,note.content,doc,visited);
  else if(r.targetId===doc.id){detail.append(element('h4',doc.title));runs(detail,doc.intro,doc,visited);}
 }
}
function renderExample(root:HTMLElement,doc:Check,id:string,seen:Set<string>){
 const ex=doc.examples.find(e=>e.id===id)!;const table=element('table'),head=element('tr');for(const c of ex.columns)head.append(element('th',c));table.append(head);
 for(const row of ex.rows){const tr=element('tr');for(const cell of row){const td=element('td');runs(td,cell,doc,seen);tr.append(td);}table.append(tr);}root.append(table);
}
const labels:Record<string,string>={classification:'分類',condition:'条件',expectedResult:'期待結果',guarantee:'一般保証',question:'未決事項',evidence:'根拠',testEvidence:'Test証拠',derivation:'導出',confidence:'確信度',related:'関連'};
export function jsonChecks(design:Design,selected?:string):HTMLElement{
 const root=element('section');root.className='check-content json-checks';const json=design.json!,bd=json.business;
 root.append(element('p','原典の意味対応は未確認です。ID・版の一致は、業務合意やCheckの人間承認を表しません。'));
 if(!json.checks.length){root.append(element('p','このJSONにCheck Itemはありません。'));return root;}
 for(const doc of json.checks){
  root.append(element('h3',doc.title),element('p',`Check ${doc.revision} · BD ${doc.basedOn.revision} · ${doc.basedOn.verification}`));runs(root,doc.intro,doc);
  if(doc.basedOn.documentId!==bd.id){root.append(element('p','別の原典BDを参照しているため、この図へ関連付けません。'));continue;}
  const row=doc.index.find(r=>r.activityId===selected);
  if(!row){root.append(element('p','Activityを選択すると、対応するCheckを表示します。'));continue;}
  field(root,'業務の目的',row.purpose);field(root,'つながり',row.connections);
  for(const section of doc.sections.filter(s=>s.activityId===selected))runs(root,section.preamble,doc);
  for(const id of row.checkIds){const item=doc.items.find(i=>i.id===id)!;const card=element('section');card.className='check-item';card.dataset.checkId=item.checkId;card.dataset.elementId=item.id;
   card.append(element('h3',`${item.checkId} · ${item.title}`),element('p',`人間レビュー状態: ${item.reviewState}`));
   for(const [key,content]of Object.entries(item.fields)){card.append(element('h4',labels[key]??key));runs(card,content,doc,new Set([item.id]));}
   if(item.detailSummary)field(card,'補足',item.detailSummary);root.append(card);
  }
  for(const note of doc.notes){const d=element('details');d.append(element('summary','文書の補足'));runs(d,note.content,doc);root.append(d);}
 }return root;
}
