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
type Business=Omit<BD,'objects'|'activities'|'relations'>&{objects:{id:string;name:string;scope:boolean;icon:string;information:{id:string;name:string;description:string}[]}[];activities:Activity[];relations:(BD['relations'][number]&{items?:{informationId:string;condition:string|null}[]})[];crossActivityOrderRules:({id:string;label:string;context:string;kind:'interchangeable';standardSteps:Endpoint[]}|{id:string;label:string;context:string;kind:'before';before:Endpoint;after:Endpoint})[]};
type PreviewCase={id:string;title:string;before:unknown;candidate:{business:Business}};
type Preview={cases:PreviewCase[]};
const el=<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
function title(root:HTMLElement,name:string){root.append(el('h3',name));}
function note(root:HTMLElement,text:string){const p=el('p',text);p.className='d2-note';root.append(p);}
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
 if(a.performers===null)note(root,'実行主体と分担は未確認です。外部業務の担当を内部の担当として補完しません。');
 title(root,'Why');root.append(el('p',a.why));title(root,'When');root.append(el('p',a.when));title(root,'Who');root.append(el('p',actorName(b,a)));title(root,'Where');root.append(el('p',a.where));
 title(root,'Procedure');const ol=el('ol');
 for(const s of a.procedure.steps){const li=el('li');li.className='d2-step';li.id='step-'+s.id;li.dataset.stepId=s.id;li.append(el('p',s.text));const meta=el('div');meta.className='d2-step-meta';const actor=actorName(b,a,s);meta.append(el('small',(s.obligation==='required'?'必須':'任意')+' · '+actor));li.append(meta);if(s.appliesWhen)li.append(el('p','適用：'+s.appliesWhen));const code=el('span',s.id);code.className='d2-source-id';li.append(code);ol.append(li);}root.append(ol);
 const stepLabel=(id:string)=>String(a.procedure.steps.findIndex(s=>s.id===id)+1);
 for(const r of a.procedure.orderRules)root.append(el('p',r.kind==='before'?'厳守：手順'+stepLabel(r.beforeId)+' → '+stepLabel(r.afterId):'入替可能：手順'+r.stepIds.map(stepLabel).join('・')));
 root.append(el('p','番号は標準提示順です。規則のない先後は未確認であり、自由な入替えを意味しません。'));
 for(const rule of b.crossActivityOrderRules){const refs=rule.kind==='interchangeable'?rule.standardSteps:[rule.before,rule.after];if(!refs.some(e=>e.activityId===a.id))continue;
  const panel=el('section');panel.className='d2-cross';panel.dataset.orderId=rule.id;panel.append(el('strong',rule.label),el('p',rule.context),el('p',rule.kind==='interchangeable'?'標準提示順 — このStep同士は入替可能':'このStep間の厳守先後'));
  const list=el('ol');for(const e of refs){const owner=b.activities.find(a=>a.id===e.activityId)!,s=owner.procedure.steps.find(s=>s.id===e.stepId)!;const li=el('li'),button=el('button',owner.name+' / '+s.id);button.type='button';button.className='node-navigate d2-ref';button.onclick=()=>navigate(owner.id,s.id);li.append(button,el('p',s.text));list.append(li);}panel.append(list,el('p','同じ場面の対象Stepだけの関係です。Activity全体の交換・並列実行・次の投球への許可を表しません。'));root.append(panel);
 }
 for(const e of (b.exceptions??[]).filter(e=>e.activityId===a.id)){title(root,'Exception · '+e.name);root.append(el('p',e.description));}
 title(root,'Result');note(root,'次は結果の定義です。成立条件に合わない項目は、その場面の成立結果には数えません。条件の判定は表示から確認してください。');
 const results=el('ul');for(const r of a.results){const li=el('li',r.text);li.dataset.resultId=r.id;if(r.condition)li.append(el('p','成立条件：'+r.condition));results.append(li);}root.append(results);
 if(a.problem!==null){title(root,'Problem');root.append(el('p',a.problem));}if(a.painLevel!==null){title(root,'Pain level');root.append(el('p',a.painLevel));}
 const names=new Map([...b.objects,...b.activities].map(n=>[n.id,n.name]));
 for(const [kind,label]of [['input','Input'],['output','Output']]as const){const rs=b.relations.filter(r=>r.kind===kind&&(r.fromId===a.id||r.toId===a.id));if(!rs.length)continue;title(root,label);for(const r of rs){root.append(el('p',names.get(r.fromId)+' → '+names.get(r.toId)+' — '+r.label));const o=b.objects.find(o=>o.id===(kind==='input'?r.fromId:r.toId))!;const ul=el('ul');ul.dataset.relationId=r.id;for(const item of r.items!){const i=o.information.find(i=>i.id===item.informationId)!;const li=el('li',i.name);li.dataset.informationId=i.id;if(i.description)li.append(el('p',i.description));if(item.condition)li.append(el('p','受渡し条件：'+item.condition));ul.append(li);}root.append(ul);}}
 const findings=b.findings.filter(f=>f.status==='open'&&f.targetIds.includes(a.id));if(findings.length){title(root,'未確認');for(const f of findings)note(root,f.content);}
 return root;
}

/** Read-only display projection. Its model is not an accepted storage package. */
export function projectD2(candidate:{business:Business}):Design{
 validateD2(candidate);const b=candidate.business;
 const objects=b.objects.map(o=>({...o,information:o.information.map(i=>i.name+(i.description?' — '+i.description:''))}));
 const activities=b.activities.map(a=>{const roleIds=[...new Set(a.performers?.flatMap(p=>p.roleIds)??[])];return {...a,who:actorName(b,a),roleId:roleIds.length===1?roleIds[0]:null,procedure:a.procedure.steps.map(s=>s.text).join('\n'),result:a.results.map(r=>r.text+(r.condition?'（成立条件：'+r.condition+'）':'')).join('\n'),exception:null};});
 const business:BD={...b,objects,activities};
 const graph=canonicalJSONGraph({version:1,scope:b.scope,nodes:[...objects.map(o=>({...o,type:'object' as const})),...activities.map(a=>({id:a.id,name:a.name,type:'business' as const,scope:a.scope,why:a.why,when:a.when,who:a.who,where:a.where,result:a.result,...(a.problem===null?{}:{problem:a.problem,pain_level:a.painLevel})}))],relations:b.relations.map(r=>({kind:r.kind,from:r.fromId,to:r.toId,label:r.label}))});
 const names=new Map([...b.objects,...b.activities].map(n=>[n.id,n.name]));
 return {graph,sections:Object.fromEntries(graph.nodes.map(n=>[n.id,''])),markdown:JSON.stringify(candidate,null,2),sourceFormat:'json',model:{formatVersion:'D2-preview',revision:b.revision,business,checks:[],states:[],diagnostics:[]},activityOrder:b.activities.map(a=>a.id),findings:b.findings.map(f=>({...f,displayId:f.sourceId,targets:[...f.targetIds,...f.unresolvedTargets],targetNames:[...f.targetIds,...f.unresolvedTargets].map(id=>names.get(id)??id)}))};
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
