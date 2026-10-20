import type {Design,Graph} from './graph';
import {matrixPlan} from './matrix-layout.ts';
import {routeEdge,type RouteNode} from './routing.ts';
export type Transition={id:string;from:string;activity:string;event?:string;condition:string;to:string;effect:string;path:string;evidence:string;note:string};
export type StateModel={object:string;states:string[];start:string;terminal:string;completeness:string;source:string;transitions:Transition[]};
export type StateDeclaration={model:StateModel;error?:never}|{error:string;model?:never};
const fields=['id','from','activity','condition','to','effect','path','evidence','note'];
const check=(ok:unknown,message:string):void=>{if(!ok)throw Error(message);};
const isText=(v:unknown):v is string=>typeof v==='string'&&!!v.trim();
/** Experimental table declaration only. No prose extraction or condition evaluation. */
export function parseStateDeclaration(body:string,object:string):StateDeclaration{
 try{
  const match=/^```state-meta\r?\n([\s\S]*?)\r?\n```\s*\r?\n([\s\S]*)$/.exec(body.trim());
  check(match,'state-meta と遷移表が必要です');const meta=JSON.parse(match![1]);
  check(meta&&typeof meta==='object'&&!Array.isArray(meta),'メタ情報が不正です');
  check(Object.keys(meta).sort().join('|')===['object','states','start','terminal','completeness','source'].sort().join('|'),'メタ情報の項目が不正です');
  check(meta.object===object,'対象Objectが一致しません');
  check(Array.isArray(meta.states)&&meta.states.length>0&&meta.states.every((s:unknown)=>isText(s)&&!s.startsWith('@'))&&new Set(meta.states).size===meta.states.length,'状態一覧が不正です');
  check(meta.start==='@new'&&meta.terminal==='@unknown'&&meta.completeness==='partial'&&isText(meta.source),'開始・終端・部分定義の宣言が不正です');
  const ls=match![2].trim().split(/\r?\n/),cells=(line:string)=>{check(line.startsWith('|')&&line.endsWith('|'),'表の行が不正です');return line.slice(1,-1).split('|').map(v=>v.trim());};
  const columns=cells(ls[0]);check(columns.join('|')===fields.join('|')||columns.join('|')===['id','from','activity','event','condition','to','effect','path','evidence','note'].join('|'),'表の列名が不正です');
  check(cells(ls[1]).length===columns.length&&cells(ls[1]).every(s=>/^-+$/.test(s)),'表の区切りが不正です');
  check(ls.length<=1002,'遷移は1000行以内にしてください');
  const ids=new Set<string>();
  const transitions=ls.slice(2).map(line=>{
   const values=cells(line);check(values.length===columns.length&&values.every(isText),'表の列数・空欄が不正です');
   const r=Object.fromEntries(columns.map((key,i)=>[key,values[i]])) as Transition;
   check(/^T[0-9]+$/.test(r.id)&&!ids.has(r.id),'遷移IDが不正または重複しています');ids.add(r.id);
   check([...meta.states,'@new'].includes(r.from)&&[...meta.states,'@unknown','@none'].includes(r.to),'未登録の状態が参照されています');
   check(['change','unchanged','no-create','constraint'].includes(r.effect)&&['normal','exception'].includes(r.path),'効果・経路の指定が不正です');
   check(r.effect!=='unchanged'||r.from===r.to,'状態不変の元と先が一致しません');
   check(r.effect!=='change'||(!r.to.startsWith('@')&&r.from!==r.to),'状態変更の遷移先が不正です');
   check(r.effect!=='no-create'||(r.from==='@new'&&r.to==='@none'),'不成立の元と先が不正です');
   check(r.effect!=='constraint'||r.to==='@unknown','未決の制約は遷移先未決としてください');return r;
  });return {model:{...meta,transitions}};
 }catch(error){return {error:error instanceof Error?error.message:'状態遷移の宣言が不正です'};}
}
/** Visual prototype: explicit edges only; no lifecycle or condition inference. */
function stateDiagram(model:StateModel):SVGSVGElement{
 const ns='http://www.w3.org/2000/svg',make=(name:string,attrs:Record<string,string>={})=>{const e=document.createElementNS(ns,name);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);return e;};
 const labels:Record<string,string>={'@new':'開始候補','@none':'作成不成立','@unknown':'遷移先未決'};
 const groups=new Map<string,Transition[]>();for(const row of model.transitions){const key=JSON.stringify([row.from,row.to,row.effect,row.activity]);groups.set(key,[...(groups.get(key)??[]),row]);}
 const rows=[...groups.values()],ids=[...new Set(['@new',...model.states,...rows.map(rs=>rs[0].to)])];
 // Rendering adapter only: business/input mean ordered boxes/dependencies to the
 // shared planner. They do not classify states as BD Activities or change Graph v1.
 // The declaration order is a display hint; it never adds or removes transitions.
 const layoutGraph:Graph={version:1,nodes:ids.map(id=>({id,type:'business',name:labels[id]??id,scope:true})),relations:rows.map(rs=>({kind:'input',from:rs[0].from,to:rs[0].to,label:rs.map(r=>r.event??r.activity).join(' / ')}))};
 const plan=matrixPlan(layoutGraph,ids);
 const nodes:RouteNode[]=ids.map(id=>({id,x:plan.positions[id][0],y:plan.positions[id][1],width:260,height:68}));
 const svg=make('svg',{role:'img','aria-label':model.object+'の状態遷移図',class:'state-diagram'}) as SVGSVGElement;
 const title=make('title');title.textContent=model.object+'：既存グラフの階段状配置・配線を流用したラフ。破線の先は保存状態が未決。';svg.append(title);
 const defs=make('defs'),marker=make('marker',{id:'state-transition-arrow',viewBox:'0 0 10 10',refX:'9',refY:'5',markerWidth:'6',markerHeight:'6',orient:'auto-start-reverse'});marker.append(make('path',{d:'M0 0 L10 5 L0 10 Z',fill:'currentColor'}));defs.append(marker);svg.append(defs);
 const captionBoxes:RouteNode[]=[],wirePoints:ReturnType<typeof routeEdge>['points'][]=[];
 let right=Math.max(...nodes.map(n=>n.x+n.width))+40,bottom=Math.max(...nodes.map(n=>n.y+n.height))+40;
 rows.forEach((rs,index)=>{
  const row=rs[0],caption=rs.map(r=>`${r.event??r.activity}（${r.id}）`).join(' / '),labelWidth=Array.from(caption).reduce((n,c)=>n+(/[\x00-\x7f]/.test(c)?7:14),0);
  const route=routeEdge({from:row.from,to:row.to,nodes,index,kind:'input',matrix:plan.wires[index],labelWidth,labelHeight:20,labels:captionBoxes,wires:wirePoints});
  const path=make('path',{d:route.path,fill:'none',stroke:'currentColor','stroke-width':'1.8','marker-end':'url(#state-transition-arrow)'});if(row.to==='@unknown')path.setAttribute('stroke-dasharray','5 4');
  const description=make('title');description.textContent=rs.map(r=>`${r.id} ${r.event??r.activity}：${r.condition}`).join(' / ');path.append(description);svg.append(path);
  const [x,y]=route.label,label=make('text',{x:String(x-labelWidth/2),y:String(y+5),class:'state-diagram-edge-label'});label.textContent=caption;svg.append(label);
  captionBoxes.push({id:'caption-'+index,x:x-labelWidth/2,y:y-10,width:labelWidth,height:20});wirePoints.push(route.points);
  right=Math.max(right,route.bounds.right+40,x+labelWidth/2+24);bottom=Math.max(bottom,route.bounds.bottom+40,y+30);
 });
 for(const node of nodes){
  const special=node.id.startsWith('@');svg.append(make('rect',{x:String(node.x),y:String(node.y),width:String(node.width),height:String(node.height),rx:special?'4':'12',class:special?'state-diagram-node undecided':'state-diagram-node'}));
  const label=make('text',{x:String(node.x+node.width/2),y:String(node.y+39),'text-anchor':'middle',class:'state-diagram-node-label'});label.textContent=labels[node.id]??node.id;svg.append(label);
 }
 svg.setAttribute('viewBox',`0 0 ${right} ${bottom}`);svg.style.minWidth=`${right}px`;
 return svg;
}
export function stateTransitionPanel(design:Design,id:string,navigate:(id:string)=>void):HTMLElement|undefined{
 const declaration=design.objectStateTransitions?.[id];if(!declaration||!design.graph.nodes.some(n=>n.id===id&&n.type==='object'))return;
 const root=document.createElement('section');root.className='state-transition-panel';root.setAttribute('aria-label','状態遷移');
 const text=(tag:string,value:string,parent:HTMLElement=root)=>{const e=document.createElement(tag);e.textContent=value;parent.append(e);return e;};
 text('h2','状態遷移図');
 if(declaration.error){text('p','状態遷移を表示できません：'+declaration.error).setAttribute('role','status');return root;}
 const model=declaration.model!;
 text('p','部分定義：未記載の操作は未決です。終端は未決です。');
 const canvas=document.createElement('div');canvas.className='state-diagram-scroll';canvas.append(stateDiagram(model));root.append(canvas);
 text('p','階段状配置のラフです。図は横にスクロールできます。破線：遷移先未決。作成不成立・未決は保存状態ではありません。');
 const label=(value:string)=>({'@new':'記録作成前','@none':'作成不成立','@unknown':'遷移先未決'}[value]??value);
 const effects:Record<string,string>={change:'状態変更',unchanged:'状態不変','no-create':'作成しない',constraint:'結果の制約・遷移先未決'};
 const details=document.createElement('details');text('summary',`操作の詳細（${model.transitions.length}）`,details);const list=document.createElement('ol');details.append(list);root.append(details);
 for(const row of model.transitions){
  const li=document.createElement('li');li.dataset.transition=row.id;
  text('h3',`${row.id} · ${label(row.from)} → ${label(row.to)}`,li);
  if(row.event)text('p','イベント：'+row.event,li);
  text('p',`${effects[row.effect]} · ${row.path==='normal'?'正常':'例外'}`,li);
  const activity=design.graph.nodes.find(n=>n.id===row.activity&&n.type==='business');
  if(activity){const b=document.createElement('button');b.type='button';b.textContent=activity.name;b.onclick=()=>navigate(activity.id);li.append(b);}
  else text('p','要確認：根拠Activityが見つかりません — '+row.activity,li);
  text('p','条件：'+row.condition,li);text('p',row.note,li);text('p','根拠：'+row.evidence,li);list.append(li);
 }
 if(!model.transitions.length)text('p','明示された操作はありません。');
 const provenance=document.createElement('details');text('summary','宣言の出典',provenance);text('p',model.source,provenance);root.append(provenance);
 return root;
}
