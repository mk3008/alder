import {graphFocus} from './graph-focus.ts';
import {graphMarkers} from './graph-visuals.ts';
import type {Design,Graph} from './graph';
import {matrixPlan} from './matrix-layout.ts';
import {routeEdge,type RouteNode} from './routing.ts';
export type Transition={id:string;from:string;activity:string;event?:string;exception?:string;condition:string;to:string;effect:string;path:string;evidence:string;note:string};
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
  const columns=cells(ls[0]);check([fields,['id','from','activity','event','condition','to','effect','path','evidence','note'],['id','from','activity','exception','condition','to','effect','path','evidence','note']].some(keys=>columns.join('|')===keys.join('|')),'表の列名が不正です');
  check(cells(ls[1]).length===columns.length&&cells(ls[1]).every(s=>/^-+$/.test(s)),'表の区切りが不正です');
  check(ls.length<=1002,'遷移は1000行以内にしてください');
  const ids=new Set<string>();
  const transitions=ls.slice(2).map(line=>{
   const values=cells(line);check(values.length===columns.length&&values.every(isText),'表の列数・空欄が不正です');
   const r=Object.fromEntries(columns.map((key,i)=>[key,values[i]])) as Transition;
   check(/^T[0-9]+$/.test(r.id)&&!ids.has(r.id),'遷移IDが不正または重複しています');ids.add(r.id);
   check([...meta.states,'@new'].includes(r.from)&&[...meta.states,'@unknown','@none'].includes(r.to),'未登録の状態が参照されています');
   check(['change','unchanged','no-create','constraint'].includes(r.effect)&&['normal','exception'].includes(r.path),'効果・経路の指定が不正です');
   if(columns.includes('exception'))check(r.path==='normal'?r.exception==='-':isText(r.exception)&&r.exception!=='-','通常は例外名なし、例外は名前が必要です');
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
 const labels:Record<string,string>={'@new':'作成前','@none':'保存不可','@unknown':'未決'};
 const groups=new Map<string,Transition[]>();for(const row of model.transitions){const key=JSON.stringify([row.from,row.to,row.effect,row.activity,row.path]);groups.set(key,[...(groups.get(key)??[]),row]);}
 const rows=[...groups.values()],ids=[...new Set(['@new',...model.states,...rows.map(rs=>rs[0].to)])];
 // Rendering adapter only: business/input mean ordered boxes/dependencies to the
 // shared planner. They do not classify states as BD Activities or change Graph v1.
 // The declaration order is a display hint; it never adds or removes transitions.
 const layoutGraph:Graph={version:1,nodes:ids.map(id=>({id,type:'business',name:labels[id]??id,scope:true})),relations:rows.map(rs=>({kind:'input',from:rs[0].from,to:rs[0].to,label:rs[0].activity+'：'+rs.map(r=>r.path==='normal'?'通常':r.exception??'例外名未定義').join(' / ')}))};
 const plan=matrixPlan(layoutGraph,ids);
 // Project the shared staircase onto smaller state boxes; reserve actual
 // multiline captions without changing the shared planner/router contracts.
 const wrap=(value:string)=>{const chars=Array.from(value);return Array.from({length:Math.ceil(chars.length/18)},(_,i)=>chars.slice(i*18,(i+1)*18).join(''));};
 const captionGroups=new Map<string,{from:string;activity:string;rows:Transition[];lines:string[];lineRows:Transition[][];offset:number}>();
 for(const rs of rows){const first=rs[0],key=JSON.stringify([first.from,first.activity]),g=captionGroups.get(key)??{from:first.from,activity:first.activity,rows:[],lines:[],lineRows:[],offset:0};g.rows.push(...rs);captionGroups.set(key,g);}
 const departures=new Map<string,number>();
 for(const group of captionGroups.values()){
  group.lines=wrap(group.activity);group.lineRows=group.lines.map(()=>group.rows);
  if(group.rows.length>1||group.rows[0].path==='exception')for(const row of group.rows){const branch=row.path==='normal'?'通常':'例外：'+(row.exception??'例外名未定義');const line='・'+branch,index=group.lines.indexOf(line);if(index<0){group.lines.push(line);group.lineRows.push([row]);}else group.lineRows[index].push(row);}
  group.offset=departures.get(group.from)??0;departures.set(group.from,group.offset+group.lines.length*18+8);
 }
 let shift=0;const projected=new Map<string,number>();
 const ordered=ids.slice().sort((a,b)=>plan.positions[a][1]-plan.positions[b][1]);
 ordered.forEach((id,i)=>{const y=plan.positions[id][1]+shift;projected.set(id,y);const next=ordered[i+1];if(next){const reserved=plan.positions[next][1]-plan.positions[id][1],needed=44+(departures.get(id)??0)+16;shift+=Math.max(0,needed-reserved);}});
 const nodes:RouteNode[]=ids.map(id=>({id,x:plan.positions[id][0],y:projected.get(id)!,width:Math.max(104,Array.from(labels[id]??id).length*14+32),height:44}));
 const svg=make('svg',{role:'group','aria-label':model.object+'の状態遷移図',class:'state-diagram'}) as SVGSVGElement;
 const title=make('title');title.textContent=model.object+'：Activity名による階段状の状態遷移図。実線は通常、破線は例外。保存不可は処理結果、未決は設計課題。';svg.append(title);
 svg.append(graphMarkers('state-transition-'));
 const shapeElements=new Map<string,SVGElement>(),edgeElements:SVGElement[]=[],captionElements:{element:SVGElement;rows:Transition[]}[]=[];
 let selected:string|undefined;
 const select=(id?:string)=>{selected=id;const focus=graphFocus(model.transitions,selected);for(const [state,element]of shapeElements){element.setAttribute('class','state-shape'+focus.nodeClasses(state));element.setAttribute('aria-pressed',String(state===selected));}edgeElements.forEach((element,i)=>{element.setAttribute('class','edge'+focus.labelClasses(rows[i]));element.setAttribute('marker-end','url(#state-transition-'+(rows[i].some(focus.related)?'related-arrow':'arrow')+')');});for(const caption of captionElements)caption.element.setAttribute('class','state-caption-line'+focus.labelClasses(caption.rows));};
 svg.addEventListener('click',event=>{if(event.target===svg)select();});svg.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();select();}});
 const wirePoints:ReturnType<typeof routeEdge>['points'][]=[];
 let right=Math.max(...nodes.map(n=>n.x+n.width))+40,bottom=Math.max(...nodes.map(n=>n.y+n.height))+40;
 rows.forEach((rs,index)=>{
  const row=rs[0];
  const route=routeEdge({from:row.from,to:row.to,nodes,index,kind:'input',matrix:plan.wires[index],labelWidth:0,labelHeight:0,wires:wirePoints});
  const path=make('path',{d:route.path,fill:'none',stroke:'currentColor','stroke-width':'1.8','marker-end':'url(#state-transition-arrow)','data-transitions':rs.map(r=>r.id).join(' ')});if(row.path==='exception')path.setAttribute('stroke-dasharray','5 4');
  const description=make('title');description.textContent=rs.map(r=>`${r.id} ${r.activity} / ${r.path==='normal'?'通常':r.exception??'例外名未定義'}：${r.condition}`).join(' / ');path.append(description);svg.append(path);edgeElements.push(path);wirePoints.push(route.points);
  right=Math.max(right,route.bounds.right+40);bottom=Math.max(bottom,route.bounds.bottom+40);
 });
 for(const group of captionGroups.values()){
  const node=nodes.find(n=>n.id===group.from)!,x=node.x+node.width*.125+8,y=node.y+node.height+group.offset+18;
  const label=make('text',{x:String(x),y:String(y),class:'state-diagram-edge-label','data-activity':group.activity});
  group.lines.forEach((line,i)=>{const span=make('tspan',{x:String(x),dy:i?'18':'0','font-size':i?'12':'14','font-weight':i?'400':'600'});span.textContent=line;span.setAttribute('data-transitions',group.lineRows[i].map(r=>r.id).join(' '));captionElements.push({element:span,rows:group.lineRows[i]});label.append(span);});svg.append(label);
  right=Math.max(right,x+Math.max(...group.lines.map(line=>Array.from(line).length*14))+24);bottom=Math.max(bottom,y+group.lines.length*18+24);
 }
 for(const node of nodes){
  const special=node.id.startsWith('@'),group=make('g',{role:'button',tabindex:'0','aria-label':labels[node.id]??node.id,'aria-pressed':'false',class:'state-shape','data-state':node.id});
  group.append(make('rect',{x:String(node.x),y:String(node.y),width:String(node.width),height:String(node.height),rx:special?'20':'8',class:special?'state-diagram-node state-note':'state-diagram-node'}));
  const label=make('text',{x:String(node.x+node.width/2),y:String(node.y+27),'text-anchor':'middle',class:'state-diagram-node-label'});label.textContent=labels[node.id]??node.id;group.append(label);
  if(special){const note=make('text',{x:String(node.x+node.width/2),y:String(node.y-8),'text-anchor':'middle',class:'state-diagram-event-id'});note.textContent=node.id==='@unknown'?'課題：保存状態が未定義':node.id==='@none'?'処理結果：記録を作らない':'記録作成前';group.append(note);}
  group.addEventListener('click',()=>select(node.id));group.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();select(node.id);}});
  shapeElements.set(node.id,group);svg.append(group);
 }
 select();
 svg.setAttribute('viewBox',`0 0 ${right} ${bottom}`);svg.style.minWidth=`${right}px`;
 return svg;
}
export function stateTransitionPanel(design:Design,id:string,navigate:(id:string)=>void):HTMLElement|undefined{
 const declaration=design.objectStateTransitions?.[id];if(!declaration||!design.graph.nodes.some(n=>n.id===id&&n.type==='object'))return;
 const root=document.createElement('section');root.className='state-transition-panel';root.setAttribute('aria-label','状態遷移');
 const text=(tag:string,value:string,parent:HTMLElement=root)=>{const e=document.createElement(tag);e.textContent=value;parent.append(e);return e;};
 if(declaration.error){text('p','状態遷移を表示できません：'+declaration.error).setAttribute('role','status');return root;}
 const model=declaration.model!;
 // Exact visible Exception names only. Never summarize prose or reuse event aliases.
 for(const row of model.transitions){
  if(!design.graph.nodes.some(n=>n.id===row.activity&&n.type==='business')){text('p',`状態遷移を表示できません：根拠Activityが見つかりません — ${row.activity}`).setAttribute('role','status');return root;}
  if(row.path!=='exception'||!row.exception)continue;
  const body=design.model?.business.activities.find(a=>a.id===row.activity)?.exception??'';
  const names=[...body.matchAll(/^- \*\*([^*]+)\*\* — /gm)].map(m=>m[1]);
  if(names.filter(name=>name===row.exception).length!==1){text('p',`状態遷移を表示できません：${row.activity} の例外名「${row.exception}」を一意に参照できません`).setAttribute('role','status');return root;}
 }
 const canvas=document.createElement('div');canvas.className='state-diagram-scroll';canvas.append(stateDiagram({...model,transitions:model.transitions.map(row=>({...row,activity:design.graph.nodes.find(n=>n.id===row.activity)?.name??row.activity}))}));root.append(canvas);
 const label=(value:string)=>({'@new':'記録作成前','@none':'保存不可（処理結果）','@unknown':'未決（設計課題）'}[value]??value);
 const effects:Record<string,string>={change:'状態変更',unchanged:'状態不変','no-create':'作成しない',constraint:'結果の制約・遷移先未決'};
 const details=document.createElement('details');text('summary',`操作の詳細（${model.transitions.length}）`,details);const list=document.createElement('ol');details.append(list);root.append(details);
 for(const row of model.transitions){
  const li=document.createElement('li');li.dataset.transition=row.id;
  text('h3',`${row.id} · ${label(row.from)} → ${label(row.to)}`,li);
  if(row.path==='exception')text('p','例外名：'+(row.exception??'未定義'),li);
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
