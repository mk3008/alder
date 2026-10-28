import {cardSurface,diagramCanvas,newDiagramView,type DiagramView} from './diagram-canvas';
import {graphFocus} from './graph-focus.ts';
import {graphMarkers,paintGraphException} from './graph-visuals.ts';
import type {Design,Graph} from './graph';
import {matrixPlan} from './matrix-layout.ts';
import {routeEdge,type RouteNode} from './routing.ts';
import {captionRowStep,captionTop} from './caption-spacing.ts';
export type Transition={id:string;from:string;activity:string;event?:string;exception?:string;exceptionId?:string|null;condition:string;to:string;effect:string;path:string;evidence:string;note:string};
export type StateModel={object:string;states:string[];start:string;terminal:string;completeness:string;source:string;transitions:Transition[]};
export type StateDeclaration={model:StateModel;error?:never}|{error:string;model?:never};
/** Visual prototype: explicit edges only; no lifecycle or condition inference. */
function stateDiagram(model:StateModel,view:DiagramView=newDiagramView()):SVGSVGElement{
 const ns='http://www.w3.org/2000/svg',make=(name:string,attrs:Record<string,string>={})=>{const e=document.createElementNS(ns,name);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);return e;};
 const labels:Record<string,string>={'@new':'作成前','@none':'作成なし','@unknown':'未決'};
 const groups=new Map<string,Transition[]>();for(const row of model.transitions){const key=JSON.stringify([row.from,row.to,row.effect,row.activity,row.path]);groups.set(key,[...(groups.get(key)??[]),row]);}
 const rows=[...groups.values()],ids=[...new Set(['@new',...model.states,...rows.map(rs=>rs[0].to)])];
 // Rendering adapter only: business/input mean ordered boxes/dependencies to the
 // shared planner. They do not classify states as BD Activities or change Graph v1.
 // The declaration order is a display hint; it never adds or removes transitions.
 const layoutGraph:Graph={version:1,nodes:ids.map(id=>({id,type:'business',name:labels[id]??id,scope:true})),relations:rows.map(rs=>({kind:rs[0].path==='exception'?'business-exception':'input',from:rs[0].from,to:rs[0].to,label:rs[0].activity+'：'+rs.map(r=>r.path==='normal'?'通常':r.exception??'例外名未定義').join(' / ')}))};
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
  group.offset=departures.has(group.from)?departures.get(group.from)!+8:0;departures.set(group.from,group.offset+group.lines.length*18);
 }
 let y=40;const projected=new Map<string,number>();
 const ordered=ids.slice().sort((a,b)=>plan.positions[a][1]-plan.positions[b][1]);
 for(const id of ordered){projected.set(id,y);y+=captionRowStep(44,departures.get(id)??0);}
 const nodes:RouteNode[]=ids.map(id=>({id,x:view.positions.get(id)?.[0]??plan.positions[id][0],y:view.positions.get(id)?.[1]??projected.get(id)!,width:Math.max(104,Array.from(labels[id]??id).length*14+32),height:44}));
 const svg=make('svg',{role:'group','aria-label':model.object+'の状態遷移図',class:'state-diagram'}) as SVGSVGElement;
 const title=make('title');title.textContent=model.object+'：Activity名による階段状の状態遷移図。実線は通常、破線は例外。'+(ids.includes('@none')?'作成なしはこの操作の処理結果。':'')+(ids.includes('@unknown')?'未決は設計課題。':'');svg.append(title);
 svg.append(graphMarkers('state-transition-'));
 const shapeElements=new Map<string,SVGElement>(),edgeElements:SVGElement[]=[],captionElements:{element:SVGElement;rows:Transition[]}[]=[];
 let selected:string|undefined=view.selected;
 const select=(id?:string)=>{selected=id;view.selected=id;const focus=graphFocus(model.transitions,selected);for(const [state,element]of shapeElements){element.setAttribute('class','node graph-shape state-shape'+focus.nodeClasses(state));element.setAttribute('aria-pressed',String(state===selected));}edgeElements.forEach((element,i)=>{element.setAttribute('class','edge'+(rows[i][0].path==='exception'?' exception':'')+focus.labelClasses(rows[i]));element.setAttribute('marker-end','url(#state-transition-'+(rows[i].some(focus.related)?'related-arrow':'arrow')+')');});for(const caption of captionElements)caption.element.setAttribute('class','state-caption-line'+focus.labelClasses(caption.rows));svg.querySelectorAll('[data-exception-paint]').forEach(e=>e.remove());for(const path of edgeElements)if(path.classList.contains('exception'))paintGraphException(svg,path,{path:path.getAttribute('d')!},{'data-transitions':path.getAttribute('data-transitions')!});};
 svg.addEventListener('click',event=>{if(event.target===svg)select();});svg.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();select();}});
 const wirePoints:ReturnType<typeof routeEdge>['points'][]=[];
 let right=Math.max(...nodes.map(n=>n.x+n.width))+40,bottom=Math.max(...nodes.map(n=>n.y+n.height))+40;
 rows.forEach((rs,index)=>{
  const row=rs[0];
  const route=routeEdge({from:row.from,to:row.to,nodes,index,kind:row.path==='exception'?'business-exception':'input',matrix:plan.wires[index],labelWidth:0,labelHeight:0,wires:wirePoints});
  const path=make('path',{d:route.path,fill:'none',stroke:'currentColor','marker-end':'url(#state-transition-arrow)','data-transitions':rs.map(r=>r.id).join(' ')});if(row.path==='exception'){path.classList.add('exception');path.setAttribute('stroke-dasharray','6 5');}
  const description=make('title');description.textContent=rs.map(r=>`${r.id} ${r.activity} / ${r.path==='normal'?'通常':r.exception??'例外名未定義'}：${r.condition}`).join(' / ');path.append(description);svg.append(path);edgeElements.push(path);wirePoints.push(route.points);
  right=Math.max(right,route.bounds.right+40);bottom=Math.max(bottom,route.bounds.bottom+40);
 });
 for(const group of captionGroups.values()){
  const node=nodes.find(n=>n.id===group.from)!,x=node.x+node.width*.125+8,y=captionTop(node.y+node.height,group.offset)+14;
  const label=make('text',{x:String(x),y:String(y),class:'state-diagram-edge-label','data-activity':group.activity});
  group.lines.forEach((line,i)=>{const span=make('tspan',{x:String(x),dy:i?'18':'0','font-size':i?'12':'14','font-weight':i?'400':'600'});span.textContent=line;span.setAttribute('data-transitions',group.lineRows[i].map(r=>r.id).join(' '));captionElements.push({element:span,rows:group.lineRows[i]});label.append(span);});svg.append(label);
  right=Math.max(right,x+Math.max(...group.lines.map(line=>Array.from(line).length*14))+24);bottom=Math.max(bottom,y+group.lines.length*18+24);
 }
 for(const node of nodes){
  const special=node.id.startsWith('@'),group=make('g',{role:'button',tabindex:'0','aria-label':labels[node.id]??node.id,'aria-pressed':'false',class:'node graph-shape state-shape','data-state':node.id,'data-node':node.id});
  group.append(cardSurface(document,node,special));
  group.append(make('rect',{x:String(node.x),y:String(node.y),width:String(node.width),height:String(node.height),rx:special?'20':'8',class:special?'state-diagram-node state-note':'state-diagram-node'}));
  const label=make('text',{x:String(node.x+node.width/2),y:String(node.y+27),'text-anchor':'middle',class:'state-diagram-node-label'});label.textContent=labels[node.id]??node.id;group.append(label);
  if(special){const note=make('text',{x:String(node.x+node.width/2),y:String(node.y-8),'text-anchor':'middle',class:'state-diagram-event-id'});note.textContent=node.id==='@unknown'?'課題：保存状態が未定義':node.id==='@none'?'処理結果：記録を作らない':'記録作成前';group.append(note);}
  group.addEventListener('click',()=>select(node.id));group.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();select(node.id);}});
  shapeElements.set(node.id,group);svg.append(group);
 }
 select(view.selected);
 svg.setAttribute('viewBox',`0 0 ${right} ${bottom}`);svg.style.minWidth=`${right}px`;
 return svg;
}
const savedViews=new WeakMap<Design,Map<string,DiagramView>>();
export function stateTransitionPanel(design:Design,id:string,navigate:(id:string)=>void):HTMLElement|undefined{
 const declaration=design.objectStateTransitions?.[id];if(!declaration||!design.graph.nodes.some(n=>n.id===id&&n.type==='object'))return;
 const root=document.createElement('section');root.className='state-transition-panel';root.setAttribute('aria-label','状態遷移');
 const text=(tag:string,value:string,parent:HTMLElement=root)=>{const e=document.createElement(tag);e.textContent=value;parent.append(e);return e;};
 if(declaration.error){text('p','状態遷移を表示できません：'+declaration.error).setAttribute('role','status');return root;}
 const model=declaration.model!;
 // Identity is structural; description formatting never participates in references.
 for(const row of model.transitions){
  if(!design.graph.nodes.some(n=>n.id===row.activity&&n.type==='business')){text('p','状態遷移を表示できません：根拠Activityが見つかりません').setAttribute('role','status');return root;}
  if(row.exceptionId){const exception=design.model?.business.exceptions?.find(e=>e.id===row.exceptionId);
   if(!exception||exception.activityId!==row.activity){text('p','状態遷移を表示できません：例外ID参照が不正です').setAttribute('role','status');return root;}
  }
 }
 const views=savedViews.get(design)??new Map<string,DiagramView>();savedViews.set(design,views);const view=views.get(id)??newDiagramView();views.set(id,view);const projectedModel={...model,transitions:model.transitions.map(row=>({...row,activity:design.graph.nodes.find(n=>n.id===row.activity)?.name??row.activity}))};root.append(diagramCanvas(document,v=>stateDiagram(projectedModel,v),view));
 const label=(value:string)=>({'@new':'記録作成前','@none':'この操作では作成しない（処理結果）','@unknown':'未決（設計課題）'}[value]??value);
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
