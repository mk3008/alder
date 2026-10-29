import {parseDocument} from './document-input';
import {canonicalJSONGraph} from './json-layout';
import type {ViewerPreview,PreviewActions} from './viewer-preview';
import type {BD,ActivityEntry} from './json-document';
import type {Design} from './graph';
// @ts-expect-error Preview-only browser-safe experimental validation boundary.
import {readPreview,validateD2,actorsForStep} from './d2-preview-model.mjs';

type Step={id:string;text:string;obligation:'required'|'optional';appliesWhen:string|null;performerObjectIds:string[]|null};
type Activity=Omit<ActivityEntry,'who'|'roleId'|'procedure'|'result'|'exception'>&{performers:{objectId:string;roleIds:string[]}[]|null;procedure:{steps:Step[];orderRules:({kind:'before';beforeId:string;afterId:string}|{kind:'interchangeable';stepIds:string[]})[]};results:{id:string;text:string;condition:string|null}[]};
type Endpoint={activityId:string;stepId:string};
type DataDefinition={id:string;name:string;items:{informationId:string;condition:string|null}[]};
type IORelation={id:string;kind:'input'|'output';fromId:string;toId:string;dataId:string};
type ExceptionRelation={id:string;kind:'business-exception'|'object-exception';fromId:string;toId:string;label:string};
type Business=Omit<BD,'objects'|'activities'|'relations'>&{objects:{id:string;name:string;scope:boolean;icon:string;information:{id:string;name:string;description:string}[]}[];activities:Activity[];data:DataDefinition[];relations:(IORelation|ExceptionRelation)[];crossActivityOrderRules:({id:string;label:string;context:string;kind:'interchangeable';standardSteps:Endpoint[]}|{id:string;label:string;context:string;kind:'before';before:Endpoint;after:Endpoint})[]};
type PreviewCase={id:string;title:string;before:unknown;candidate:{business:Business}};
type Preview={cases:PreviewCase[]};
const el=<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
function title(root:HTMLElement,name:string){root.append(el('h3',name));}
function resultText(r:Activity['results'][number]){return (r.condition?r.condition+'、':'')+r.text;}
function actorName(b:Business,a:Activity,s?:Step){
 const ids:string[]|null=s?actorsForStep(a,s):a.performers?.map(p=>p.objectId)??null;
 if(!ids)return '担当未確認';
 return ids.map(id=>{const o=b.objects.find(o=>o.id===id)!,assignment=a.performers!.find(p=>p.objectId===id)!;const roles=assignment.roleIds.map(id=>b.roles?.find(r=>r.id===id)?.name).filter(Boolean);return o.name+(roles.length?'（'+roles.join('・')+'）':'');}).join('、');
}
export function candidateDetail(b:Business,id:string|undefined,navigate:(activityId:string,stepId:string)=>void):HTMLElement{
 const root=el('article');root.className='markdown json-detail';
 const object=b.objects.find(o=>o.id===id),a=b.activities.find(a=>a.id===id);
 if(object){title(root,'Scope');root.append(el('p',String(object.scope)));title(root,'Icon');root.append(el('p',object.icon));title(root,'Information');const ul=el('ul');for(const i of object.information){const li=el('li',i.name);if(i.description)li.append(el('p',i.description));ul.append(li);}root.append(ul);return root;}
 if(!a){root.append(el('p','項目を選択すると業務内容を表示します。'));return root;}
 title(root,'Scope');root.append(el('p',String(a.scope)));
 title(root,'Why');root.append(el('p',a.why));title(root,'When');root.append(el('p',a.when));title(root,'Who');root.append(el('p',actorName(b,a)));title(root,'Where');root.append(el('p',a.where));
 title(root,'Procedure');const ol=el('ol');
 const swaps=[...b.activities.flatMap(owner=>owner.procedure.orderRules.filter(r=>r.kind==='interchangeable').map(r=>({id:'',refs:r.stepIds.map(stepId=>({activityId:owner.id,stepId}))}))),...b.crossActivityOrderRules.filter(r=>r.kind==='interchangeable').map(r=>({id:r.id,refs:r.standardSteps}))].map((g,index)=>({...g,number:index+1})).filter(g=>g.refs.some(e=>e.activityId===a.id));
 for(const s of a.procedure.steps){const li=el('li');li.className='d2-step';li.id='step-'+s.id;li.dataset.stepId=s.id;const p=el('p',s.text),labels:string[]=[];if(s.appliesWhen)labels.push(s.appliesWhen);if(s.obligation==='optional')labels.push('任意');if(a.performers&&a.performers.length>1&&s.performerObjectIds&&s.performerObjectIds.length<a.performers.length)labels.push('担当：'+actorName(b,a,s));if(labels.length)p.append('（'+labels.join('・')+'）');
  for(const g of swaps){const index=g.refs.findIndex(e=>e.activityId===a.id&&e.stepId===s.id);if(index<0)continue;const text='（※'+g.number+'）';if(g.id){const next=g.refs[(index+1)%g.refs.length],owner=b.activities.find(a=>a.id===next.activityId)!,step=owner.procedure.steps.findIndex(s=>s.id===next.stepId),link=el('a',text);link.href='#step-'+next.stepId;link.className='d2-ref';link.style.whiteSpace='nowrap';link.dataset.orderId=g.id;link.dataset.stepRef=next.stepId;link.setAttribute('aria-label',owner.name+'の手順'+(step+1));link.onclick=e=>{e.preventDefault();navigate(owner.id,next.stepId);};p.append(link);}else{const mark=el('span',text);mark.style.whiteSpace='nowrap';p.append(mark);}}li.append(p);ol.append(li);}root.append(ol);
 for(const g of swaps){const p=el('p',swaps.length===1?'※が付いているものは順不同。':'※'+g.number+'の手順は順不同。');p.className='d2-order-note';root.append(p);}
 for(const e of (b.exceptions??[]).filter(e=>e.activityId===a.id)){title(root,'Exception · '+e.name);root.append(el('p',e.description));}
 title(root,'Result');
 const results=el('ul');for(const r of a.results){const li=el('li',resultText(r));li.dataset.resultId=r.id;results.append(li);}root.append(results);
 if(a.problem!==null){title(root,'Problem');root.append(el('p',a.problem));}if(a.painLevel!==null){title(root,'Pain level');root.append(el('p',a.painLevel));}
 const names=new Map([...b.objects,...b.activities].map(n=>[n.id,n.name]));
 const io=b.relations.filter((r):r is IORelation=>'dataId' in r&&(r.fromId===a.id||r.toId===a.id)),data=new Map(b.data.map(d=>[d.id,d]));
 for(const [kind,label]of [['input','Input'],['output','Output']]as const){const rs=io.filter(r=>r.kind===kind);title(root,label);if(!rs.length){root.append(el('p','記載なし'));continue;}for(const r of rs){const name=data.get(r.dataId)!.name;root.append(el('p',kind==='input'?names.get(r.fromId)+' → '+name:name+' → '+names.get(r.toId)));}}
 if(io.length){title(root,'Data');const information=new Map(b.objects.flatMap(o=>o.information).map(i=>[i.id,i]));for(const id of new Set(io.map(r=>r.dataId))){const d=data.get(id)!,name=el('p');name.append(el('strong',d.name));root.append(name);const ul=el('ul');ul.dataset.dataId=d.id;for(const item of d.items){const i=information.get(item.informationId)!;const li=el('li',i.name);li.dataset.informationId=i.id;if(i.description)li.append(el('p',i.description));if(item.condition)li.append(el('p','受渡し条件：'+item.condition));ul.append(li);}root.append(ul);}}
 return root;
}

/** Read-only display projection. Its model is not an accepted storage package. */
export function projectD2(candidate:{business:Business}):Design{
 validateD2(candidate);const b=candidate.business;
 const objects=b.objects.map(o=>({...o,information:o.information.map(i=>i.name+(i.description?' — '+i.description:''))}));
 const activities=b.activities.map(a=>{const roleIds=[...new Set(a.performers?.flatMap(p=>p.roleIds)??[])];return {...a,who:actorName(b,a),roleId:roleIds.length===1?roleIds[0]:null,procedure:a.procedure.steps.map(s=>s.text).join('\n'),result:a.results.map(resultText).join('\n'),exception:null};});
 const data=new Map(b.data.map(d=>[d.id,d.name])),relations=b.relations.map(r=>({id:r.id,kind:r.kind,fromId:r.fromId,toId:r.toId,label:'dataId' in r?data.get(r.dataId)!:r.label}));
 const business:BD={...b,objects,activities,relations};
 const graph=canonicalJSONGraph({version:1,scope:b.scope,nodes:[...objects.map(o=>({...o,type:'object' as const})),...activities.map(a=>({id:a.id,name:a.name,type:'business' as const,scope:a.scope,why:a.why,when:a.when,who:a.who,where:a.where,result:a.result,...(a.problem===null?{}:{problem:a.problem,pain_level:a.painLevel})}))],relations:relations.map(r=>({kind:r.kind,from:r.fromId,to:r.toId,label:r.label}))});
 const names=new Map([...b.objects,...b.activities].map(n=>[n.id,n.name]));
 return {graph,sections:Object.fromEntries(graph.nodes.map(n=>[n.id,''])),markdown:JSON.stringify(candidate,null,2),sourceFormat:'json',model:{formatVersion:'D2.1-preview',revision:b.revision,business,checks:[],states:[],diagnostics:[]},activityOrder:b.activities.map(a=>a.id),findings:b.findings.map(f=>({...f,displayId:f.sourceId,targets:[...f.targetIds,...f.unresolvedTargets],targetNames:[...f.targetIds,...f.unresolvedTargets].map(id=>names.get(id)??id)}))};
}
export function createD2Preview():ViewerPreview{
 let collection:Preview,current:PreviewCase,mode='d2',actions:PreviewActions,busy=false;
 const candidates=new Map<string,Business>(),sources=new Set<string>();
 const designFor=()=>{const d=mode==='before'?parseDocument(JSON.stringify(current.before)):projectD2(current.candidate);sources.add(d.markdown);if(mode==='d2')candidates.set(d.markdown,current.candidate.business);return d;};
 const route=()=>{const url=new URL(location.href);url.searchParams.set('case',current.id);url.searchParams.set('mode',mode);history.replaceState(history.state,'',url);};
 const change=async(nextCase:string,nextMode:string)=>{if(busy)return;busy=true;const previous=current,previousMode=mode;current=collection.cases.find(c=>c.id===nextCase)!;mode=nextMode;try{const design=designFor();if(previous===current)await actions.update(design);else await actions.open(design,current.title);route();}catch(e){current=previous;mode=previousMode;throw e;}finally{busy=false;actions.redraw();}};
 return {
  async start(value){actions=value;const params=new URLSearchParams(location.search),url=new URL(params.get('source')??'./d2-examples.json',location.href);if(url.username||url.password||!(url.protocol==='https:'||url.origin===location.origin))throw Error('比較JSONには匿名取得できるHTTPS URLを指定してください。');const response=await fetch(url,{credentials:'omit'});if(!response.ok)throw Error('比較JSONを取得できませんでした。');collection=readPreview(await response.text())as Preview;current=collection.cases.find(c=>c.id===params.get('case'))??collection.cases[0];mode=params.get('mode')==='before'?'before':'d2';await actions.open(designFor(),current.title);route();},
  controls(design,disabled){if(!sources.has(design.markdown))return;const controls=el('div');controls.className='check-modes';controls.setAttribute('aria-label','研究用の構造比較');const label=el('label','例 '),select=el('select');select.setAttribute('aria-label','比較する業務例');for(const c of collection.cases){const option=el('option',c.title);option.value=c.id;select.append(option);}select.value=current.id;select.disabled=disabled||busy;select.onchange=()=>{void change(select.value,mode);};label.append(select);controls.append(label);for(const[key,text]of [['before','0.4表現'],['d2','D2構造案']]){const button=el('button',text);button.type='button';button.disabled=disabled||busy;button.setAttribute('aria-pressed',String(mode===key));button.onclick=()=>{void change(current.id,key);};controls.append(button);}return controls;},
  detail(design,id,navigate){const b=candidates.get(design.markdown);return b?candidateDetail(b,id,navigate):undefined;}
 };
}

