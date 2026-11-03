import {RichReader} from './document-view';
import {formattedMarkdown} from './markdown';
import type {Design} from './graph';
import type {Check,Run} from './json-document';
// @ts-expect-error Shared JSON reference resolution is implemented in JavaScript.
import {exampleCheckIds} from '../../tools/document_storage/core.mjs';

const el=<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;return node;};
type Item=Check['items'][number];

/** Project existing Activity-to-Check relationships; names and evidence prose do not create links. */
function activityDocuments(design:Design,activityId:string,documents:Check[]){
 const bd=design.model!.business;
 return documents.filter(doc=>doc.basedOn.documentId===bd.id).map(doc=>{
  const ids=[...new Set(doc.index.filter(row=>row.activityId===activityId).flatMap(row=>row.checkIds))];
  const items=ids.flatMap(id=>{const item=doc.items.find(value=>value.id===id);return item?[item]:[];});
  const sections=doc.sections.filter(section=>section.activityId===activityId);
  return {doc,items,sections};
 }).filter(value=>value.items.length||value.sections.length);
}

export function activityTestAvailability(design:Design,activityId:string,documents:Check[]){
 const groups=activityDocuments(design,activityId,documents),items=groups.flatMap(group=>group.items);
 return {available:groups.length>0,unlinked:items.length>0&&items.every(item=>!item.fields.testEvidence?.length)};
}

function evidenceRuns(root:HTMLElement,runs:Run[],doc:Check,seen=new Set<string>()){
 for(const run of runs){
  if(run.kind==='text'){const span=el('span',run.value);span.style.whiteSpace='pre-wrap';root.append(span);}
  else if(run.kind==='markdown')root.append(formattedMarkdown(run.value));
  else if(run.kind==='link'){
   let uri:URL|undefined;try{uri=new URL(run.uri);}catch{}
   if(uri&&uri.protocol==='https:'&&!uri.username&&!uri.password){const a=el('a',run.label||run.uri);a.href=uri.href;a.target='_blank';a.rel='noopener noreferrer';root.append(a,el('span','（リンク先未確認）'));}
   else root.append(el('span',run.label||run.uri));
  }else{
   const note=doc.notes.find(item=>item.id===run.targetId);
   if(!note){new RichReader(doc,true).runs(root,[run],seen);continue;}
   const details=el('details');details.append(el('summary',run.label||note.title));root.append(details);let loaded=false;
   details.addEventListener('toggle',()=>{if(!details.open||loaded)return;loaded=true;if(seen.has(note.id)||seen.size>=16){details.append(el('p','参照を展開できません。原文で確認してください。'));return;}evidenceRuns(details,note.content,doc,new Set(seen).add(note.id));});
  }
 }
}

/** A single Activity page; test-evidence prose is presented as a record, not an executed result. */
export function renderActivityTestSpec(design:Design,activityId:string,documents:Check[],decisionExamples=new Set<string>()){
 const activity=design.model!.business.activities.find(value=>value.id===activityId);
 const root=el('article');root.className='activity-test-spec';
 const sections:{label:string;node:HTMLElement}[]=[];
 const addSection=(label:string,node:HTMLElement)=>{node.tabIndex=-1;sections.push({label,node});return node;};
 if(!activity){root.append(el('p','この業務は見つかりません。'));return {root,sections};}
 const groups=activityDocuments(design,activityId,documents);
 const header=el('div');header.className='activity-test-header';
 const heading=el('h1',activity.name),id=el('span',activity.id);id.className='activity-test-id';id.title=activity.id;
 const title=el('div');title.className='activity-test-title';title.append(id,heading);header.append(title);
 if(activity.why)header.append(formattedMarkdown(activity.why));
 const status=el('p','テストの対応・実行結果・証拠の鮮度：未確認');status.className='activity-test-status';header.append(status);root.append(header);

 const spec=addSection('仕様',el('section'));spec.className='activity-test-section check-content json-checks';spec.append(el('h2','仕様'));
 for(const {doc,items,sections:activitySections} of groups){
  if(doc.basedOn.revision!==design.model!.business.revision){const warning=el('p','このCheckと現在の業務設計の版の対応は未確認です。');warning.className='activity-test-warning';spec.append(warning);}
  const reader=new RichReader(doc,true),wanted=new Set(items.map(item=>item.id)),refs=new Set<string>();
  for(const item of items)for(const values of Object.values(item.fields))for(const run of values)if(run.kind==='reference')refs.add(run.targetId);
  for(const section of activitySections)reader.runs(spec,section.preamble);
  const guarantees=doc.guarantees.filter(guarantee=>activitySections.some(section=>section.id===guarantee.sectionId)||refs.has(guarantee.id));
  const shownExamples=new Set<string>();
  for(const guarantee of guarantees){
   const block=el('section');block.className='activity-test-rule';block.append(el('h3',guarantee.title));
   const decision=guarantee.blocks.some(value=>value.kind==='example'&&decisionExamples.has(value.exampleId));
   for(const value of guarantee.blocks){
    if(value.kind==='prose'){if(!decision)reader.runs(block,value.content,new Set([guarantee.id]));}
    else if(!shownExamples.has(value.exampleId)&&!decisionExamples.has(value.exampleId)){
     const example=doc.examples.find(entry=>entry.id===value.exampleId);
     if(example&&exampleCheckIds(doc,example).some((id:string)=>wanted.has(id))){reader.example(block,example.id,new Set([guarantee.id]),true);shownExamples.add(example.id);}
    }
   }
   if(block.childElementCount>1)spec.append(block);
  }
  // A Check may reference an example directly rather than through its section's blocks.
  for(const example of doc.examples.filter(value=>refs.has(value.id)&&!shownExamples.has(value.id)&&!decisionExamples.has(value.id))){
   if(exampleCheckIds(doc,example).some((id:string)=>wanted.has(id))){reader.example(spec,example.id,new Set(),true);shownExamples.add(example.id);}
  }
  for(const item of items){
   const card=addSection(item.checkId,el('section'));card.className='check-item activity-test-check';card.dataset.checkId=item.checkId;card.dataset.elementId=item.id;
   const top=el('div');top.className='activity-test-check-title';const badge=el('span',item.checkId);badge.className='activity-test-check-id';top.append(badge,el('h3',item.title));card.append(top);
   const review=el('p','人間レビュー：'+item.reviewState);review.className='activity-test-review';card.append(review);
   if(item.reviewState==='要確認'||item.reviewState==='要修正')card.append(el('p','確認が必要です。'));
   const fields:Record<string,Run[]>={};
   for(const name of ['condition','expectedResult','guarantee','question','alternatives']){
    const values=item.fields[name];if(!values?.length)continue;
    // References are closed on demand; their shared content is rendered once above.
    fields[name]=values;
   }
   reader.fields(card,fields,new Set([item.id]));spec.append(card);
  }
 }
 if(!groups.length)spec.append(el('p','この業務に対応するCheck Itemはありません。'));
 root.append(spec);

 const tests=addSection('テスト',el('section'));tests.className='activity-test-section activity-test-evidence';tests.append(el('h2','テスト'));
 const records:{doc:Check;item:Item;runs:Run[]}[]=groups.flatMap(({doc,items})=>items.flatMap(item=>item.fields.testEvidence?.length?[{doc,item,runs:item.fields.testEvidence}]:[]));
 if(!records.length)tests.append(el('p','対応するテストの記録はありません。'));
 else{
  tests.append(el('p','保存された証拠の記述があります。テストとの対応、実行結果、鮮度は確認されていません。'));
  for(const {doc,item,runs} of records){const details=el('details'),summary=el('summary',item.checkId+' の証拠記録');details.append(summary);const content=el('div');evidenceRuns(content,runs,doc);details.append(content);tests.append(details);}
 }
 root.append(tests);return {root,sections};
}

export function renderActivityTestContents(page:HTMLElement,toc:HTMLElement,view:ReturnType<typeof renderActivityTestSpec>){
 page.replaceChildren(view.root);toc.replaceChildren(el('h2','目次'));
 const buttons=view.sections.map(({label,node},index)=>{
  const button=el('button',label);button.type='button';button.className=index>0&&label!=='テスト'?'activity-test-toc-check':'';
  button.onclick=()=>{node.scrollIntoView({block:'start'});node.focus({preventScroll:true});setCurrent(index);};toc.append(button);return button;
 });
 const setCurrent=(active:number)=>buttons.forEach((button,index)=>{if(index===active)button.setAttribute('aria-current','location');else button.removeAttribute('aria-current');});
 const update=()=>{const top=page.getBoundingClientRect().top+24;let active=0;for(let i=0;i<view.sections.length;i++)if(view.sections[i].node.getBoundingClientRect().top<=top)active=i;if(page.scrollHeight>page.clientHeight&&page.scrollTop+page.clientHeight>=page.scrollHeight-2)active=buttons.length-1;setCurrent(active);};
 page.onscroll=update;update();
}
