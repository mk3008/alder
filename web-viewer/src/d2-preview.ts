import {parseDocument} from './document-input';
import {businessDetail} from './document-view';
import {diagramCanvas,cardSurface,newDiagramView} from './diagram-canvas';
import {matrixPlanForDesign} from './json-layout';
import {routeEdge} from './routing';
import {graphMarkers} from './graph-visuals';
import type {BD,ActivityEntry} from './json-document';
import type {Design} from './graph';
// @ts-expect-error Preview-only browser-safe experimental validation boundary.
import {readPreview,actorsForStep} from './d2-preview-model.mjs';
import './style.css';
import './canvas-toolbar.css';
import './d2-preview.css';

type Step={id:string;text:string;obligation:'required'|'optional';appliesWhen:string|null;performerObjectIds:string[]|null};
type Activity=Omit<ActivityEntry,'who'|'roleId'|'procedure'|'result'|'exception'>&{performers:{objectId:string;roleIds:string[]}[]|null;procedure:{steps:Step[];orderRules:({kind:'before';beforeId:string;afterId:string}|{kind:'interchangeable';stepIds:string[]})[]};results:{id:string;text:string;condition:string|null}[]};
type Endpoint={activityId:string;stepId:string};
type Business=Omit<BD,'objects'|'activities'|'relations'>&{objects:{id:string;name:string;scope:boolean;icon:string;information:{id:string;name:string;description:string}[]}[];activities:Activity[];relations:(BD['relations'][number]&{items?:{informationId:string;condition:string|null}[]})[];crossActivityOrderRules:({id:string;label:string;context:string;kind:'interchangeable';standardSteps:Endpoint[]}|{id:string;label:string;context:string;kind:'before';before:Endpoint;after:Endpoint})[]};
type PreviewCase={id:string;title:string;before:unknown;candidate:{business:Business}};
type Preview={cases:PreviewCase[]};
const el=<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
function title(root:HTMLElement,name:string){root.append(el('h2',name));}
function note(root:HTMLElement,text:string){const p=el('p',text);p.className='d2-note';root.append(p);}
function tag(text:string,pending=false){const n=el('span',text);n.className='d2-tag'+(pending?' d2-pending':'');return n;}
function actorName(b:Business,a:Activity,s?:Step){
 const ids:string[]|null=s?actorsForStep(a,s):a.performers?.map(p=>p.objectId)??null;
 if(!ids)return '担当未確認';
 return ids.map(id=>{const o=b.objects.find(o=>o.id===id)!,assignment=a.performers!.find(p=>p.objectId===id)!;const roles=assignment.roleIds.map(id=>b.roles?.find(r=>r.id===id)?.name).filter(Boolean);return o.name+(roles.length?'（'+roles.join('・')+'）':'');}).join('、');
}
export function candidateDetail(b:Business,id:string,navigate:(activityId:string,stepId?:string)=>void):HTMLElement{
 const root=el('article');root.className='markdown json-detail';
 const object=b.objects.find(o=>o.id===id),a=b.activities.find(a=>a.id===id);
 if(object){root.append(el('h1',object.name),tag(object.scope?'対象範囲内':'外部Object'));title(root,'情報');const ul=el('ul');for(const i of object.information){const li=el('li',i.name);if(i.description)li.append(el('p',i.description));ul.append(li);}root.append(ul);return root;}
 if(!a)return root;
 root.append(el('h1',a.name),tag(a.scope?'対象範囲内':'外部業務'),el('p',actorName(b,a)));
 if(a.performers===null)note(root,'実行主体と分担は未確認です。外部業務の担当を内部の担当として補完しません。');
 title(root,'目的');root.append(el('p',a.why));title(root,'開始');root.append(el('p',a.when));
 title(root,'標準手順');const ol=el('ol');
 for(const s of a.procedure.steps){const li=el('li');li.className='d2-step';li.id='step-'+s.id;li.dataset.stepId=s.id;li.append(el('p',s.text));const meta=el('div');meta.className='d2-step-meta';const actor=actorName(b,a,s);meta.append(tag(s.obligation==='required'?'必須':'任意'),tag(actor,actor==='担当未確認'));li.append(meta);if(s.appliesWhen)li.append(el('p','適用：'+s.appliesWhen));const code=el('span',s.id);code.className='d2-source-id';li.append(code);ol.append(li);}root.append(ol);
 const stepLabel=(id:string)=>String(a.procedure.steps.findIndex(s=>s.id===id)+1);
 for(const r of a.procedure.orderRules)root.append(el('p',r.kind==='before'?'厳守：手順'+stepLabel(r.beforeId)+' → '+stepLabel(r.afterId):'入替可能：手順'+r.stepIds.map(stepLabel).join('・')));
 root.append(el('p','番号は標準提示順です。規則のない先後は未確認であり、自由な入替えを意味しません。'));
 title(root,'正常結果');note(root,'次は結果の定義です。成立条件に合わない項目は、その場面の成立結果には数えません。条件の判定は表示から確認してください。');
 const results=el('ul');for(const r of a.results){const li=el('li',r.text);li.dataset.resultId=r.id;if(r.condition)li.append(el('p','成立条件：'+r.condition));results.append(li);}root.append(results);
 const names=new Map([...b.objects,...b.activities].map(n=>[n.id,n.name]));
 for(const [kind,label]of [['input','入力'],['output','出力']]as const){const rs=b.relations.filter(r=>r.kind===kind&&(r.fromId===a.id||r.toId===a.id));if(!rs.length)continue;title(root,label);for(const r of rs){root.append(el('h3',r.label+' · '+names.get(kind==='input'?r.fromId:r.toId)));const o=b.objects.find(o=>o.id===(kind==='input'?r.fromId:r.toId))!;const ul=el('ul');ul.dataset.relationId=r.id;for(const item of r.items!){const i=o.information.find(i=>i.id===item.informationId)!;const li=el('li',i.name);li.dataset.informationId=i.id;if(i.description)li.append(el('p',i.description));if(item.condition)li.append(el('p','受渡し条件：'+item.condition));ul.append(li);}root.append(ul);}}
 for(const rule of b.crossActivityOrderRules){const refs=rule.kind==='interchangeable'?rule.standardSteps:[rule.before,rule.after];if(!refs.some(e=>e.activityId===a.id))continue;
  const panel=el('section');panel.className='d2-cross';panel.dataset.orderId=rule.id;panel.append(el('strong',rule.label),el('p',rule.context),el('p',rule.kind==='interchangeable'?'標準提示順 — このStep同士は入替可能':'このStep間の厳守先後'));
  const list=el('ol');for(const e of refs){const owner=b.activities.find(a=>a.id===e.activityId)!,s=owner.procedure.steps.find(s=>s.id===e.stepId)!;const li=el('li'),button=el('button',owner.name+' / '+s.id);button.className='d2-ref';button.onclick=()=>navigate(owner.id,s.id);li.append(button,el('p',s.text));list.append(li);}panel.append(list,el('p','同じ場面の対象Stepだけの関係です。Activity全体の交換・並列実行・次の投球への許可を表しません。'));root.append(panel);
 }
 const findings=b.findings.filter(f=>f.status==='open'&&f.targetIds.includes(a.id));if(findings.length){title(root,'未確認');for(const f of findings)note(root,f.content);}
 return root;
}
function graphCanvas(design:Design,view:ReturnType<typeof newDiagramView>,select:(id:string)=>void){
 const doc=document,NS='http://www.w3.org/2000/svg',svg=(name:string,attrs:Record<string,string|number>={})=>{const x=doc.createElementNS(NS,name);for(const[k,v]of Object.entries(attrs))x.setAttribute(k,String(v));return x;};
 return diagramCanvas(doc,current=>{
  const plan=matrixPlanForDesign(design),nodes=design.graph.nodes.map(n=>{const p=current.positions.get(n.id)??plan.positions[n.id];return{id:n.id,x:p[0],y:p[1],width:260,height:68};});
  const root=svg('svg',{class:'state-diagram',role:'group','aria-label':'業務全体図'})as SVGSVGElement;root.append(graphMarkers('d2-'));let width=Math.max(400,...nodes.map(n=>n.x+n.width+40)),height=Math.max(240,...nodes.map(n=>n.y+n.height+50));
  for(const [i,r]of design.graph.relations.entries()){
   const labelWidth=Math.max(30,r.label.length*12),route=routeEdge({from:r.from,to:r.to,nodes,index:i,kind:r.kind,matrix:plan.wires[i],labelWidth,labelHeight:18});
   const path=svg('path',{d:route.path,class:'edge','marker-end':'url(#d2-arrow)','data-relation-id':i});root.append(path);const label=svg('text',{x:route.label[0]-labelWidth/2,y:route.label[1],class:'edge-label','text-anchor':'start','dominant-baseline':'middle'});label.textContent=r.label;root.append(label);width=Math.max(width,route.bounds.right+40,route.label[0]+labelWidth/2+40);height=Math.max(height,route.bounds.bottom+40);
  }
  for(const n of nodes){const source=design.graph.nodes.find(s=>s.id===n.id)!,g=svg('g',{'data-node':n.id,role:'button',tabindex:0,'aria-label':source.name+'を選択','aria-pressed':String(current.selected===n.id),class:'graph-shape '+source.type+(source.scope?'':' outside')+(current.selected===n.id?' selected':'')});g.append(cardSurface(doc,n),svg('rect',{x:n.x,y:n.y,width:n.width,height:n.height,class:'state-diagram-node'}));const fo=svg('foreignObject',{x:n.x+16,y:n.y+7,width:n.width-32,height:n.height-14});const text=el('div');text.style.cssText='font-size:14px;line-height:1.5;display:flex;flex-direction:column;justify-content:center;height:100%';text.append(el('small',source.type==='business'?(source.scope?'Activity':'Activity · 外部'):'Object'),el('span',source.name));fo.append(text);g.append(fo);g.addEventListener('click',()=>select(n.id));g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(n.id);}});root.append(g);}
  root.setAttribute('viewBox',`0 0 ${width} ${height}`);return root;
 },view);
}
export function mountPreview(root:HTMLElement,collection:Preview,initialCase?:string,initialMode='d2'){
 let current=collection.cases.find(c=>c.id===initialCase)??collection.cases[0],mode=initialMode==='before'?'before':'d2',selected=current.candidate.business.activities[0].id,view=newDiagramView();
 const page=el('div');page.className='d2-page';const header=el('header');header.append(el('strong','Alder · 構造比較'),el('small','未採用の構造案 · 読み取り専用'));const spacer=el('span');spacer.className='spacer';const theme=el('button','配色');theme.setAttribute('aria-label','配色を切り替える');theme.onclick=()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';};header.append(spacer,theme);page.append(header);
 const controls=el('nav');controls.className='d2-controls';controls.setAttribute('aria-label','構造比較の表示');const label=el('label','例 '),cases=el('select');cases.setAttribute('aria-label','比較する業務例');for(const c of collection.cases){const o=el('option',c.title);o.value=c.id;cases.append(o);}cases.value=current.id;label.append(cases);controls.append(label);const modes=el('div');modes.className='d2-modes';const before=el('button','0.4表現'),after=el('button','D2構造案');modes.append(before,after);controls.append(modes);const source=el('a','比較JSON');source.href=new URLSearchParams(location.search).get('source')??'./d2-examples.json';source.target='_blank';source.rel='noopener noreferrer';controls.append(source);page.append(controls);
 const workspace=el('div');workspace.className='d2-workspace';const left=el('div');left.className='d2-left';const list=el('nav');list.className='d2-list';list.setAttribute('aria-label','ActivityとObject');const graph=el('div');graph.style.cssText='flex:1;min-height:0';const detail=el('section');detail.className='d2-detail';detail.setAttribute('aria-label','選択項目の業務内容');left.append(list,graph);workspace.append(left,detail);page.append(workspace);root.replaceChildren(page);
 const designFor=()=>{
  const original=parseDocument(JSON.stringify(current.before));if(mode==='before')return original;
  const ids=new Map(original.model!.business.relations.map(r=>[JSON.stringify([r.kind,r.fromId,r.toId,r.label]),r.id]));
  const labels=new Map(current.candidate.business.relations.map(r=>[r.id,r.label]));
  // A viewing projection into the same graph/camera/planner, never a storage conversion.
  return {...original,graph:{...original.graph,relations:original.graph.relations.map(r=>({...r,label:labels.get(ids.get(JSON.stringify([r.kind,r.from,r.to,r.label]))!)??r.label}))}};
 };
 const show=(id:string,stepId?:string)=>{selected=id;view.selected=id;draw();if(stepId){const target=Array.from(detail.querySelectorAll<HTMLElement>('[data-step-id]')).find(e=>e.dataset.stepId===stepId);if(target){target.dataset.focused='true';target.scrollIntoView?.({block:'center'});}}};
 function draw(){
  before.setAttribute('aria-pressed',String(mode==='before'));after.setAttribute('aria-pressed',String(mode==='d2'));list.replaceChildren();for(const n of [...current.candidate.business.activities,...current.candidate.business.objects]){const button=el('button',n.name);button.setAttribute('aria-current',String(n.id===selected));button.onclick=()=>show(n.id);list.append(button);}
  const design=designFor();view.selected=selected;graph.replaceChildren(graphCanvas(design,view,id=>show(id)));detail.replaceChildren();const modeLabel=el('div',mode==='before'?'同じ情報を現行0.4で表した比較用草案':'D2構造案 — 条件や担当を項目ごとに確認');modeLabel.className='d2-mode-label';detail.append(modeLabel);
  if(mode==='before'){const name=design.graph.nodes.find(n=>n.id===selected)?.name??'';detail.append(el('h1',name),businessDetail(design,selected));}
  else detail.append(candidateDetail(current.candidate.business,selected,show));
 }
 before.onclick=()=>{mode='before';draw();};after.onclick=()=>{mode='d2';draw();};cases.onchange=()=>{current=collection.cases.find(c=>c.id===cases.value)!;selected=current.candidate.business.activities[0].id;view=newDiagramView();draw();};draw();return {show};
}
async function start(root:HTMLElement){try{
 const params=new URLSearchParams(location.search),url=new URL(params.get('source')??'./d2-examples.json',location.href);if(url.username||url.password||!(url.protocol==='https:'||url.origin===location.origin))throw Error('比較JSONには匿名取得できるHTTPS URLを指定してください。');
 const response=await fetch(url,{credentials:'omit'});if(!response.ok)throw Error('比較JSONを取得できませんでした。');const collection=readPreview(await response.text())as Preview;
 for(const c of collection.cases){const design=parseDocument(JSON.stringify(c.before)),b=c.candidate.business;const same=(xs:unknown[],ys:unknown[])=>JSON.stringify([...xs].sort())===JSON.stringify([...ys].sort());if(!same(design.graph.nodes.map(n=>n.id),[...b.objects,...b.activities].map(n=>n.id)))throw Error('比較する要素のIDが一致しません。');}
 mountPreview(root,collection,params.get('case')??undefined,params.get('mode')??'d2');
 }catch(e){const error=el('p',e instanceof Error?e.message:String(e));error.className='d2-error';error.setAttribute('role','alert');root.replaceChildren(error);}}
const root=document.querySelector<HTMLElement>('#d2-root');if(root)void start(root);
