import {activityRole} from './roles';
import type {Design} from './graph';
import type {BD,Check,Run,LegacyActivity,ProcedureActivity,Party} from './json-document';
import {formattedMarkdown} from './markdown';
import {activityWho,legacyPerformerNames,relationLabel} from './structured-display';
// @ts-expect-error The shared storage validator is a JavaScript module.
import {exampleCheckIds} from '../../tools/document_storage/core.mjs';
const element=<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e;};
function field(root:HTMLElement,name:string,value:string|null|undefined){if(value===null||value===undefined)return;const content=formattedMarkdown(value);root.append(element('h3',name),content);return content;}
function dataDetails(bd:BD,ids:string[]){const list=element('ul');for(const id of [...new Set(ids)]){const data=bd.data?.find(d=>d.id===id);if(!data)continue;for(const entry of data.items){const info=bd.objects.flatMap(o=>o.information).find(i=>typeof i!=='string'&&i.id===entry.informationId);if(!info||typeof info==='string')continue;const item=element('li',info.name+(entry.condition?`（条件：${entry.condition}）`:''));if(info.description)item.append(formattedMarkdown(info.description));list.append(item);}}return list;}
function exceptionSummary(value:string|null,exceptions:{name:string;description:string}[]){
 if(value===null)return;const content=formattedMarkdown(value),normalize=(text:string|null)=>String(text??'').replace(/\s+/g,'');
 const repeated=new Set(exceptions.map(e=>normalize(formattedMarkdown(`**${e.name}** — ${e.description}`).textContent)));
 for(const item of Array.from(content.querySelectorAll('li')))if(repeated.has(normalize(item.textContent)))item.remove();
 for(const list of Array.from(content.querySelectorAll('ul,ol')))if(!list.children.length)list.remove();
 return content.textContent?.trim()?content:undefined;
}
const labels:Record<string,string>={classification:'分類',condition:'条件',expectedResult:'期待結果',guarantee:'一般保証',question:'未決事項',alternatives:'選択肢',evidence:'根拠',testEvidence:'Test証拠',derivation:'導出',confidence:'確信度',related:'関連'};
type VariationKind='alternative'|'exception';
/** Only explicit, unambiguous annotations for the same Activity may classify a route. */
function variationKinds(design:Design,activityId:string,items:{id:string}[]):Map<string,VariationKind>{
 const kinds=new Map<string,VariationKind>(),conflicted=new Set<string>(),allowed=new Set(items.map(item=>item.id)),business=design.model!.business;
 for(const model of design.model!.concepts??[]){
  if(model.basedOn.documentId!==business.id||model.basedOn.revision!==business.revision)continue;
  const views=model.presentation.activityViews;if(!Array.isArray(views))continue;
  for(const view of views){
   if(!view||typeof view!=='object'||Array.isArray(view)||view.activityId!==activityId||!Array.isArray(view.businessVariations))continue;
   for(const item of view.businessVariations){
    if(!item||typeof item!=='object'||Array.isArray(item)||typeof item.exceptionId!=='string'||!allowed.has(item.exceptionId)||(item.kind!=='alternative'&&item.kind!=='exception')||conflicted.has(item.exceptionId))continue;
    const previous=kinds.get(item.exceptionId);
    if(previous&&previous!==item.kind){kinds.delete(item.exceptionId);conflicted.add(item.exceptionId);}else kinds.set(item.exceptionId,item.kind);
   }
  }
 }
 return kinds;
}
export function businessDetail(design:Design,id?:string,onStructureFinding?:(id:string)=>void):HTMLElement{
 const root=element('article');root.className='markdown json-detail';const json=design.model!,bd=json.business;
 const object=bd.objects.find(n=>n.id===id),activity=bd.activities.find(n=>n.id===id);
 if(object){field(root,'Scope',object.scope===null?'未決':String(object.scope));root.append(element('h3','Information'));const list=element('ul');for(const info of object.information){const item=element('li',typeof info==='string'?info:info.name);if(typeof info!=='string'&&info.description)item.append(formattedMarkdown(info.description));list.append(item);}root.append(list);}
 else if(activity){
  const exceptions=bd.exceptions?.filter(e=>e.activityId===activity.id)??[];
  if('performers' in activity){
   field(root,'Scope',String(activity.scope));field(root,'Why',activity.why);field(root,'When',activity.when);field(root,'Who',activityWho(bd,activity));field(root,'旧形式の担当情報',legacyPerformerNames(bd,activity));
   if(activity.performers?.length===1&&activity.procedure.steps.some(step=>step.performerObjectIds===null))root.append(element('p','旧形式では、指定のない手順は旧形式の担当情報を継承します。'));
   field(root,'Where',activity.where);
   const issues=(design.findings??[]).filter(f=>f.id.startsWith('viewer:')&&f.targets.includes(activity.id));
   for(const issue of issues){const warning=element('p',issue.summary+' ');warning.className='finding-reference-warning';warning.dataset.structureIssue=issue.id;const link=element('button','構造の要確認を開く');link.type='button';link.className='node-navigate';link.onclick=()=>onStructureFinding?.(issue.id);warning.append(link);root.append(warning);}
   root.append(element('h3','Procedure'));const steps=element('ol');
   for(const step of activity.procedure.steps){const item=element('li');item.append(formattedMarkdown(step.text));
    const same=activity.performers?.length===1&&(step.performerObjectIds===null||step.performerObjectIds.length===1&&step.performerObjectIds[0]===activity.performers[0].objectId);
    const detail=[step.obligation==='required'?'必須':'任意',...(step.appliesWhen?[`適用条件：${step.appliesWhen}`]:[]),...(!same?[`旧形式の担当：${legacyPerformerNames(bd,activity,step.performerObjectIds)}`]:[])];
    item.append(element('p',detail.join(' · ')));steps.append(item);
   }root.append(steps);
   if(activity.procedure.orderRules.length){root.append(element('h3','手順の順序制約'));const rules=element('ul'),number=(id:string)=>String(activity.procedure.steps.findIndex(s=>s.id===id)+1);for(const rule of activity.procedure.orderRules)rules.append(element('li',rule.kind==='before'?`手順${number(rule.beforeId)} → 手順${number(rule.afterId)}`:`手順${rule.stepIds.map(number).join('・')}は入替可能`));root.append(rules);}
   root.append(element('h3','Result'));const results=element('ul');results.dataset.businessResult='';results.dataset.resultScope='activity';for(const result of activity.results){const item=element('li');item.append(formattedMarkdown(result.text));results.append(item);}root.append(results);field(root,'Problem',activity.problem);field(root,'Pain level',activity.painLevel);
  }else if(typeof activity.who!=='string'){
   const a=activity as ProcedureActivity;
   field(root,'Scope',a.scope===null?'未決':String(a.scope));field(root,'Why',a.why);field(root,'When',a.when);field(root,'Who',activityWho(bd,a));field(root,'Where',a.where);
   root.append(element('h3','Procedure'));
   const table=element('table');table.dataset.procedureTable='';const head=element('thead'),header=element('tr');for(const name of ['Step','From','To','Data','Action']){const th=element('th',name);th.scope='col';header.append(th);}head.append(header);table.append(head);const body=element('tbody');
   const party=(p:Party|null|undefined)=>!p?'未決':p.kind==='who'?activityWho(bd,a):(bd.objects.find(o=>o.id===p.objectId)?.name??'未決');
   for(const [index,step] of a.procedure.steps.entries()){
    const row=element('tr');row.dataset.stepId=step.id;const parties=step.parties;const names=(ids:string[]|null)=>ids===null?'未決':ids.map(id=>bd.data?.find(d=>d.id===id)?.name??'未決').join('、')||'なし';
    const target=names(step.whatDataIds),transferred=step.exchange.kind==='interaction'?names(step.exchange.dataIds):null;
    const data=transferred===null||transferred===target?target:`対象：${target} / 受渡し：${transferred}`;
    const from=parties?party(parties.from):step.exchange.kind==='internal'?activityWho(bd,a):'未決';const to=parties?party(parties.to):step.exchange.kind==='internal'?'—':'未決';
    for(const value of [String(index+1),from,to])row.append(element('td',value));const dataCell=element('td',data),items=dataDetails(bd,[...(step.whatDataIds??[]),...(step.exchange.kind==='interaction'?step.exchange.dataIds??[]:[])]);if(items.children.length)dataCell.append(items);row.append(dataCell);
    const action=element('td',step.action),details=[step.obligation==='required'?'必須':'任意',...(step.method?[`方法：${step.method}`]:[]),...(step.appliesWhen?[`適用条件：${step.appliesWhen}`]:[]),...(step.effect?[`操作効果：${step.effect}`]:[])];
    if(step.exchange.kind==='interaction'){const exchange=step.exchange;details.push(`受渡し：${exchange.direction==='input'?'Input':'Output'}${exchange.phase==='not-applicable'?'':exchange.phase?` / ${exchange.phase}`:' / 未決'}`);if(exchange.pairedStepId)details.push(`対応：手順${a.procedure.steps.findIndex(s=>s.id===exchange.pairedStepId)+1}`);}
    else if(step.exchange.kind==='unresolved')details.push('やり取り：未決');
    action.append(element('small',details.join(' · ')));if(step.legacyText)action.append(element('p',`旧手順：${step.legacyText}`));row.append(action);body.append(row);
   }table.append(body);root.append(table);
   if(a.procedure.orderRules.length){root.append(element('h3','手順の順序制約'));const rules=element('ul'),number=(id:string)=>String(a.procedure.steps.findIndex(s=>s.id===id)+1);for(const rule of a.procedure.orderRules)rules.append(element('li',rule.kind==='before'?`手順${number(rule.beforeId)} → 手順${number(rule.afterId)}`:`手順${rule.stepIds.map(number).join('・')}は入替可能`));root.append(rules);}
   root.append(element('h3','Result'));const results=element('ul');results.dataset.businessResult='';results.dataset.resultScope='activity';for(const result of a.results){const item=element('li');item.append(formattedMarkdown(result.text));results.append(item);}root.append(results);field(root,'Problem',a.problem);field(root,'Pain level',a.painLevel);
  }else {const a=activity as LegacyActivity;for(const [label,key]of [['Scope','scope'],['Why','why'],['When','when'],['Who','who'],['Where','where'],['Procedure','procedure'],['Result','result'],['Problem','problem'],['Pain level','painLevel']] as const){const content=field(root,label,key==='who'?(activityRole(design,a.id)?.name??a.who):a[key]===null?null:String(a[key]));if(key==='result'&&content)content.dataset.businessResult='';}}
  const summary=exceptionSummary('exception' in activity?activity.exception:null,exceptions),kinds=variationKinds(design,activity.id,exceptions);
  const section=(title:string,items:typeof exceptions,extra?:HTMLElement)=>{if(!items.length&&!extra)return;const group=element('section');group.dataset.businessVariations='';group.append(element('h3',title));if(extra)group.append(extra);for(const item of items){const content=formattedMarkdown(item.description);content.dataset.businessException=item.id;group.append(element('h4',item.name),content);const c=item.continuity;if(c){const lines=element('dl');const stepName=(id:string|null)=>id&&typeof activity.procedure!=='string'?`手順${activity.procedure.steps.findIndex(s=>s.id===id)+1}`:'未決';const dataName=(ids:string[]|null)=>ids===null?'未決':ids.map(id=>bd.data?.find(d=>d.id===id)?.name??'未決').join('、')||'なし';const entries:[string,string][]=[['発生条件',c.trigger??'未決']];if(c.onInterrupt!==null||c.outcome==='resume'||c.outcome===null)entries.push(['中断時の扱い',c.onInterrupt??'未決']);entries.push(['その後',c.outcome==='resume'?'再開':c.outcome==='continue'?'そのまま続行':c.outcome==='end'?'終了':'未決']);if(c.outcome==='resume'||c.outcome===null)entries.push(['再開条件',c.resumeCondition??'未決'],['再開方法',c.resumeAction??'未決']);if(c.interruptedAtStepId)entries.push(['中断した手順',stepName(c.interruptedAtStepId)]);if(c.resumeAtStepId)entries.push(['再開する手順',stepName(c.resumeAtStepId)]);if(c.retainedDataIds!==null||c.outcome==='resume')entries.push(['保持するData',dataName(c.retainedDataIds)]);for(const [key,value]of entries)lines.append(element('dt',key),element('dd',value));group.append(lines);}}root.append(group);};
  if(json.formatVersion==='0.6')section('Exception',exceptions,summary);
  else if(!kinds.size)section('通常以外の扱い',exceptions,summary);
  else{
   section('例外',exceptions.filter(item=>kinds.get(item.id)==='exception'));
   section('別ルート',exceptions.filter(item=>kinds.get(item.id)==='alternative'));
   section('通常以外の扱い',exceptions.filter(item=>!kinds.has(item.id)),summary);
  }
  const names=new Map([...bd.objects,...bd.activities].map(n=>[n.id,n.name]));
  if(json.formatVersion==='0.6'){
   for(const [kind,label]of [['input','Input'],['output','Output'],['business-exception','Exception When']] as const){
    const relations=design.graph.relations.filter(r=>r.kind===kind&&(r.from===id||r.to===id));if(!relations.length)continue;
    root.append(element('h3',label));const list=element('ul');
    for(const r of relations){const endpoints=kind==='business-exception'?`${names.get(r.from)} → ${names.get(r.to)}`:names.get(kind==='input'?r.from:r.to);const description=`${endpoints} — ${r.label||'未決'}`;
     if(kind==='business-exception'){root.append(element('p',description));continue;}list.append(element('li',description));
    }if(kind!=='business-exception')root.append(list);
   }
  }else{
  for(const [kind,label]of [['input','Input'],['output','Output'],['business-exception','Exception When']] as const){
   const relations=bd.relations.filter(r=>r.kind===kind&&(r.fromId===id||r.toId===id));if(!relations.length)continue;
   root.append(element('h3',label));const list=element('ul');
   for(const r of relations){const endpoints=kind==='business-exception'?`${names.get(r.fromId)} → ${names.get(r.toId)}`:names.get(kind==='input'?r.fromId:r.toId);const labels=relationLabel(bd,r);const description=`${endpoints} — ${labels||'未決'}`;
    if(kind==='business-exception'){root.append(element('p',description));continue;}
    const item=element('li',description);
    if('dataId' in r){const data=bd.data!.find(d=>d.id===r.dataId)!,details=element('ul');for(const entry of data.items){const info=bd.objects.flatMap(o=>o.information).find(i=>typeof i!=='string'&&i.id===entry.informationId);if(!info||typeof info==='string')continue;const line=element('li',info.name+(entry.condition?`（条件：${entry.condition}）`:''));if(info.description)line.append(formattedMarkdown(info.description));details.append(line);}item.append(details);}
    list.append(item);
   }if(kind!=='business-exception')root.append(list);
  }
  }
 }else{root.append(element('p','項目を選択すると業務内容を表示します。'));}
 return root;
}
/** References are expanded on demand. Neither a cycle nor fan-out eagerly builds a tree. */
class RichReader{
 private remaining=5000;private warned=false;
 private doc:Check;private requester:boolean;
 constructor(doc:Check,requester=false){this.doc=doc;this.requester=requester;}
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
    else if(item){detail.append(element('p',`${item.checkId} · ${item.title}`+(this.requester?'':` · ${item.reviewState}`)));if(this.requester&&(item.reviewState==='要確認'||item.reviewState==='要修正'))detail.append(element('p','確認が必要です。'));const fields=this.requester?Object.fromEntries(Object.entries(item.fields).filter(([name])=>['classification','condition','expectedResult','guarantee','question','alternatives'].includes(name))):item.fields;this.fields(detail,fields,visited);}
    else if(section){detail.append(element('h4',section.title));this.runs(detail,section.preamble,visited);}
    else if(note){detail.append(element('h4',note.title));this.runs(detail,note.content,visited);}
    else if(r.targetId===doc.id){detail.append(element('h4',doc.title));this.runs(detail,doc.intro,visited);}
   });
  }
 }
 fields(root:HTMLElement,fields:Record<string,Run[]>,seen:Set<string>,expandGuarantees=false){for(const [name,content]of Object.entries(fields)){if(!this.take(root))break;root.append(element('h4',labels[name]??name));
  if(name==='guarantee'&&expandGuarantees){const expanded=new Set<string>();for(const run of content){
   const guarantee=run.kind==='reference'?this.doc.guarantees.find(item=>item.id===run.targetId):undefined;
   if(!guarantee){this.runs(root,[run],seen);continue;}if(expanded.has(guarantee.id))continue;expanded.add(guarantee.id);
   const visited=new Set(seen).add(guarantee.id);for(const block of guarantee.blocks){if(!this.take(root))break;if(block.kind==='prose')this.runs(root,block.content,visited);else this.example(root,block.exampleId,visited);}
  }}else this.runs(root,content,seen);
 }}
 example(root:HTMLElement,id:string,seen:Set<string>,checkIdsOnly=false){
  const ex=this.doc.examples.find(e=>e.id===id)!;if(!exampleCheckIds(this.doc,ex).length)return;const table=element('table');
  const result=checkIdsOnly?ex.columns.indexOf('結果'):-1,grouped=result>0&&ex.columns.at(-1)==='Check ID';
  if(grouped){
   const conditions=element('colgroup');conditions.span=result;table.append(conditions);for(let i=result;i<ex.columns.length;i++)table.append(element('colgroup'));
   const thead=element('thead'),top=element('tr'),group=element('th','条件');group.colSpan=result;group.scope='colgroup';top.append(group);
   for(let i=result;i<ex.columns.length;i++){const th=element('th',ex.columns[i]);th.rowSpan=2;th.scope='col';if(i===result)th.className='decision-result';else if(ex.columns[i]==='備考')th.className='decision-notes';top.append(th);}
   const axes=element('tr');for(const label of ex.columns.slice(0,result)){const th=element('th',label);th.scope='col';axes.append(th);}thead.append(top,axes);table.append(thead);
  }else{const head=element('tr');for(const c of ex.columns){if(!this.take(root))break;head.append(element('th',c));}table.append(head);}
  const body=grouped?element('tbody'):table;
  for(const row of ex.rows){if(!this.take(root))break;const tr=element('tr');for(const [index,cell] of row.entries()){if(!this.take(root))break;const td=element('td');if(grouped&&index===result)td.className='decision-result';else if(grouped&&ex.columns[index]==='備考')td.className='decision-notes';
   if(checkIdsOnly){for(const run of cell){const item=run.kind==='reference'?this.doc.items.find(value=>value.id===run.targetId):undefined;if(item)td.append(element('span',item.checkId));else this.runs(td,[run],seen);}}
   else this.runs(td,cell,seen);tr.append(td);}body.append(tr);}if(grouped)table.append(body);const wrap=element('div');wrap.className='json-example';wrap.append(table);root.append(wrap);
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
export function renderRequesterChecks(design:Design,activityId?:string,documents=design.model!.checks,exclude=new Set<string>(),excludeGuarantees=new Set<string>()):HTMLElement{
 const root=element('section');root.className='check-content json-checks';const bd=design.model!.business;
 const checks=documents.filter(doc=>doc.basedOn.documentId===bd.id);
 let found=false;
 for(const doc of checks){
  const reader=new RichReader(doc),rows=doc.index.filter(row=>row.activityId===activityId);
  const assigned=new Set(doc.index.flatMap(row=>row.checkIds));
  const ids=(activityId?[...new Set(rows.flatMap(row=>row.checkIds))]:doc.items.filter(item=>!assigned.has(item.id)).map(item=>item.id)).filter(id=>!exclude.has(id));
  const sections=doc.sections.filter(section=>activityId?section.activityId===activityId:section.activityId===null);
  for(const section of sections){
   if(section.preamble.length||doc.guarantees.some(guarantee=>guarantee.sectionId===section.id&&!excludeGuarantees.has(guarantee.id)))found=true;
   reader.runs(root,section.preamble);
   for(const guarantee of doc.guarantees.filter(value=>value.sectionId===section.id&&!excludeGuarantees.has(value.id)))reader.runs(root,[{kind:'reference',targetId:guarantee.id,label:guarantee.title}]);
  }
  for(const id of ids){const item=doc.items.find(value=>value.id===id);if(!item)continue;found=true;
   const section=element('section');section.className='check-item';section.dataset.checkId=item.checkId;section.dataset.elementId=item.id;section.append(element('h3',item.checkId+' · '+item.title));
   if(item.reviewState==='要確認'||item.reviewState==='要修正')section.append(element('p','確認が必要です。'));
   const fields=Object.fromEntries(Object.entries(item.fields).filter(([name])=>['classification','condition','expectedResult','guarantee','question','alternatives'].includes(name)));
   reader.fields(section,fields,new Set([item.id]));root.append(section);
  }
  if(!activityId)for(const note of doc.notes){found=true;reader.runs(root,[{kind:'reference',targetId:note.id,label:note.title}]);}
 }
 if(!found)root.append(element('p','この業務のテスト仕様はありません。'));
 return root;
}

/** Show actual Check expectations tied to an example; do not infer a mapping. */
export function renderLinkedChecks(design:Design,ids:string[],documents=design.model!.checks):HTMLElement{
 const root=element('section');root.className='check-content json-checks sample-checks';const bd=design.model!.business,wanted=new Set(ids);
 for(const doc of documents.filter(d=>d.basedOn.documentId===bd.id&&d.basedOn.revision===bd.revision)){
  const reader=new RichReader(doc);
  for(const item of doc.items.filter(item=>wanted.has(item.id))){
   const section=element('section');section.className='check-item';section.dataset.checkId=item.checkId;section.dataset.elementId=item.id;
   section.append(element('h3',item.checkId+' · '+item.title));if(item.reviewState==='要確認'||item.reviewState==='要修正')section.append(element('p','確認が必要です。'));
   const fields=Object.fromEntries(Object.entries(item.fields).filter(([name])=>['classification','condition','expectedResult','guarantee','question','alternatives'].includes(name)));
   reader.fields(section,fields,new Set([item.id]),true);root.append(section);
  }
 }
 return root;
}

// Older JSON documents sometimes embedded this display legend in prose. Keep
// their business context but render the meaning of the symbol in one place.
const legacyDecisionLegend=/[‐-]\s*[＝=]\s*[^。\r\n]*(?:不問|左右しない|問わない)[^。\r\n]*。?/g;
function decisionProse(runs:Run[]):Run[]{const result:Run[]=[];for(const run of runs){
 if(run.kind!=='text'&&run.kind!=='markdown'){result.push(run);continue;}
 const value=run.value.replace(legacyDecisionLegend,'');if(value===run.value)result.push(run);else if(value.trim())result.push({...run,value});
}return result;}

/** The authored comparison belongs to the Check document, not to a data example. */
export function renderDecisionExamples(design:Design,ids:string[],documents=design.model!.checks):HTMLElement{
 const root=element('section');root.className='check-content json-checks decision-examples';const bd=design.model!.business;
 for(const id of ids)for(const doc of documents.filter(d=>d.basedOn.documentId===bd.id&&d.basedOn.revision===bd.revision)){
  const example=doc.examples.find(value=>value.id===id);if(!example||!exampleCheckIds(doc,example).length)continue;
  const reader=new RichReader(doc,true),guarantee=doc.guarantees.find(value=>value.id===example.guaranteeId),section=element('section');section.dataset.decisionExample=id;
  for(const block of guarantee?.blocks??[])if(block.kind==='prose')reader.runs(section,decisionProse(block.content),new Set([guarantee!.id]));
  if(example.rows.length>1)section.append(element('p','上から順に判定し、最初に当てはまる行を見ます。'));
  const resultColumn=example.columns.indexOf('結果'),conditionCount=resultColumn>0?resultColumn:example.columns.length;
  const hasDontCare=example.rows.some(row=>row.slice(0,conditionCount).some(cell=>cell.some(run=>run.kind==='text'&&/^\s*[-‐]\s*$/.test(run.value))));
  if(hasDontCare)section.append(element('p','‐＝値不問。'));
  reader.example(section,id,new Set([id]),true);root.append(section);
 }
 return root;
}

/** For a Check without a comparison table, keep the condition separate from its outcome. */
export function renderDecisionChecks(design:Design,ids:string[],documents=design.model!.checks):HTMLElement{
 const root=element('section');root.className='check-content json-checks decision-checks';const bd=design.model!.business,wanted=new Set(ids);
 for(const doc of documents.filter(d=>d.basedOn.documentId===bd.id&&d.basedOn.revision===bd.revision)){
  const reader=new RichReader(doc,true);
  for(const item of doc.items.filter(value=>wanted.has(value.id))){
   const section=element('section');section.className='check-item';section.dataset.checkId=item.checkId;section.dataset.elementId=item.id;
   section.append(element('h3',item.checkId+' · '+item.title));if(item.reviewState==='要確認'||item.reviewState==='要修正')section.append(element('p','確認が必要です。'));
   if(item.fields.condition?.length){section.append(element('h4','条件'));reader.runs(section,item.fields.condition,new Set([item.id]));}
   const fields=Object.fromEntries(Object.entries(item.fields).filter(([name])=>['expectedResult','guarantee','question','alternatives'].includes(name)));
   if(Object.keys(fields).length){const detail=element('details');detail.append(element('summary','期待結果'));reader.fields(detail,fields,new Set([item.id]),true);section.append(detail);}
   root.append(section);
  }
 }
 return root;
}

/** Samples explain their Checks; unsampled or unresolved expectations remain readable. */
export function renderResultChecks(design:Design,ids:string[],documents=design.model!.checks,sampledIds=new Set<string>()):HTMLElement{
 const root=element('section');root.className='check-content json-checks result-checks';const bd=design.model!.business,wanted=new Set(ids);
 for(const doc of documents.filter(d=>d.basedOn.documentId===bd.id&&d.basedOn.revision===bd.revision)){
  const reader=new RichReader(doc,true);
  const explained=doc.items.filter(item=>wanted.has(item.id)&&sampledIds.has(item.id)&&item.reviewState!=='要確認'&&item.reviewState!=='要修正'&&!item.fields.question?.length&&!item.fields.alternatives?.length);
  if(explained.length)root.append(element('p',explained.map(item=>item.checkId).join('、')));
  for(const item of doc.items.filter(value=>wanted.has(value.id))){
   if(explained.includes(item))continue;
   const section=element('section');section.className='check-item';section.dataset.checkId=item.checkId;section.dataset.elementId=item.id;
   section.append(element('h3',item.checkId));if(item.reviewState==='要確認'||item.reviewState==='要修正')section.append(element('p','確認が必要です。'));
   const fields=Object.fromEntries(Object.entries(item.fields).filter(([name])=>['expectedResult','guarantee','question','alternatives'].includes(name)));
   reader.fields(section,fields,new Set([item.id]),true);
   const detail=element('details'),summary=element('summary','Check の詳細');detail.append(summary,element('p',item.title));if(item.fields.condition?.length)reader.runs(detail,item.fields.condition,new Set([item.id]));section.append(detail);
   root.append(section);
  }
 }
 return root;
}
