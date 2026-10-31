import {cardSurface,diagramCanvas,newDiagramView,type DiagramView} from './diagram-canvas';
import {graphFocus} from './graph-focus.ts';
import {graphMarkers,paintGraphException} from './graph-visuals.ts';
import type {Design,Graph} from './graph';
import {matrixPlan} from './matrix-layout.ts';
import {captionOnRow,type RouteNode} from './routing.ts';
import {RouteCache} from './route-cache.ts';
import {captionRowStep,CAPTION_LINE_STEP} from './caption-spacing.ts';
import {stateSelfLoopRoute} from './state-self-loop.ts';
export type Transition={id:string;from:string;activity:string;activityId?:string;event?:string;exception?:string;exceptionId?:string|null;condition:string;conditionLabel?:string;to:string;effect:string;path:string;evidence:string;note:string};
export type StateModel={object:string;states:string[];start:string;terminal:string;completeness:string;source:string;transitions:Transition[]};
export type StateDeclaration={model:StateModel;error?:never}|{error:string;model?:never};
/** Visual prototype: explicit edges only; no lifecycle or condition inference. */
function stateDiagram(model:StateModel,view:DiagramView=newDiagramView()):SVGSVGElement{
 const ns='http://www.w3.org/2000/svg',make=(name:string,attrs:Record<string,string>={})=>{const e=document.createElementNS(ns,name);for(const [k,v] of Object.entries(attrs))e.setAttribute(k,v);return e;};
 const labels:Record<string,string>={'@new':'作成前','@none':'作成なし','@unknown':'未決'};
 const rows=model.transitions.map(row=>[row]),ids=[...new Set(['@new',...model.states,...rows.map(rs=>rs[0].to)])];
 // Rendering adapter only: business/input mean ordered boxes/dependencies to the
 // shared planner. They do not classify states as BD Activities or change Graph v1.
 // The declaration order is a display hint; it never adds or removes transitions.
 const layoutGraph:Graph={version:1,nodes:ids.map(id=>({id,type:'business',name:labels[id]??id,scope:true})),relations:rows.map(([row])=>({kind:row.path==='exception'?'business-exception':'input',from:row.from,to:row.to,label:row.id+'：'+row.activity+'：'+row.condition}))};
 const plan=matrixPlan(layoutGraph,ids);
 // Project the shared staircase onto smaller state boxes; reserve actual
 // multiline captions without changing the shared planner/router contracts.
 const wrap=(value:string)=>{const chars=Array.from(value);return Array.from({length:Math.ceil(chars.length/28)},(_,i)=>chars.slice(i*28,(i+1)*28).join(''));};
 const captionGroups=rows.map(([row])=>({from:row.from,activity:row.activity,rows:[row],lines:[] as string[],lineRows:[] as Transition[][],offset:0,width:0,height:0}));
 const departures=new Map<string,number>();
 for(const [index,group] of captionGroups.entries()){
  const row=group.rows[0];
  const siblings=model.transitions.filter(other=>other.from===row.from&&(other.activityId??other.activity)===(row.activityId??row.activity)&&other.path===row.path&&(row.path!=='exception'||(other.exception??'例外名未定義')===(row.exception??'例外名未定義')));
  const shortConditions=siblings.map(other=>(other.conditionLabel??other.condition).trim().replace(/\s+/g,' '));
  const condition=new Set(shortConditions).size===siblings.length?(row.conditionLabel??row.condition):row.condition;
  const exception=row.path==='exception'?'例外：'+(row.exception??'例外名未定義'):'';
  const detail=[exception,...(siblings.length>1?[condition]:[])].filter(Boolean).join('：');
  group.lines=wrap(group.activity+(detail?'（'+detail+'）':''));group.lineRows=group.lines.map(()=>group.rows);
  group.width=Math.max(...group.lines.map(line=>Array.from(line).length*14));group.height=group.lines.length*18;
  if(!plan.wires[index].returning){group.offset=departures.has(group.from)?departures.get(group.from)!+8:0;departures.set(group.from,group.offset+group.height);}
 }
 const loopGroups=new Map<string,number[]>();
 rows.forEach(([row],i)=>{if(row.from===row.to){const group=loopGroups.get(row.from)??[];group.push(i);loopGroups.set(row.from,group);}});
 const loopWires=new Map<number,{index:number;count:number;rise:number}>(),loopSpace=new Map<string,number>();
 for(const [id,indices]of loopGroups){
  let used=0;
  indices.forEach((i,index)=>{const height=captionGroups[i].height,rise=32+used+height/2;loopWires.set(i,{index,count:indices.length,rise});loopSpace.set(id,rise+height/2);used+=height+8;});
 }
 const nodeHeight=(_id:string)=>44;
 const ordered=ids.slice().sort((a,b)=>plan.positions[a][1]-plan.positions[b][1]);
 // A multiline return caption can extend above the first state. Reserve only
 // the extra initial top space needed so the initial view does not clip it.
 let y=Math.max(40,...captionGroups.map((group,i)=>plan.wires[i].returning&&group.from===ordered[0]?16+group.height/2-44*(plan.wires[i].fromPort??.5):40));const projected=new Map<string,number>();let occupiedBottom=4;
 for(const id of ordered){
  const extra=loopSpace.get(id)??0;if(extra)y=Math.max(y,occupiedBottom+extra+12);
  const height=nodeHeight(id),caption=departures.get(id)??0;projected.set(id,y);occupiedBottom=y+height+(caption?24+caption:0);y+=captionRowStep(height,caption);
 }
 const nodes:RouteNode[]=ids.map(id=>({id,x:view.positions.get(id)?.[0]??plan.positions[id][0],y:view.positions.get(id)?.[1]??projected.get(id)!,width:Math.max(104,Array.from(labels[id]??id).length*14+32,16+Math.max(0,2*(loopGroups.get(id)?.length??0)-1)*24),height:nodeHeight(id)}));
 const svg=make('svg',{role:'group','aria-label':model.object+'の状態遷移図',class:'state-diagram'}) as SVGSVGElement;
 const title=make('title');title.textContent=model.object+'：Activity名による階段状の状態遷移図。実線は通常、破線は例外。'+(ids.includes('@none')?'作成なしはこの操作の処理結果。':'')+(ids.includes('@unknown')?'未決は設計課題。':'');svg.append(title);
 svg.append(graphMarkers('state-transition-'));
 const shapeElements=new Map<string,SVGElement>(),edgeElements:SVGElement[]=[],captionElements:{element:SVGElement;rows:Transition[]}[]=[];
 let selected:string|undefined=view.selected;
 const select=(id?:string)=>{selected=id;view.selected=id;const focus=graphFocus(model.transitions,selected);for(const [state,element]of shapeElements){element.setAttribute('class','node graph-shape state-shape'+focus.nodeClasses(state));element.setAttribute('aria-pressed',String(state===selected));}edgeElements.forEach((element,i)=>{element.setAttribute('class','edge'+(rows[i][0].path==='exception'?' exception':'')+focus.labelClasses(rows[i]));element.setAttribute('marker-end','url(#state-transition-'+(rows[i].some(focus.related)?'related-arrow':'arrow')+')');});for(const caption of captionElements)caption.element.setAttribute('class','state-caption-line'+focus.labelClasses(caption.rows));svg.querySelectorAll('[data-exception-paint]').forEach(e=>e.remove());for(const path of edgeElements)if(path.classList.contains('exception'))paintGraphException(svg,path,{path:path.getAttribute('d')!},{'data-transitions':path.getAttribute('data-transitions')!});svg.querySelectorAll('.state-diagram-edge-label').forEach(label=>svg.append(label));};
 svg.addEventListener('click',event=>{if(event.target===svg)select();});svg.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();select();}});
 const wires=plan.wires.map((wire,i)=>({...wire,captionLane:captionGroups[i].offset/CAPTION_LINE_STEP}));
 // The shared business router measures single-line labels. Supply equivalent
 // widths, then use its same collision escape for the full multiline boxes.
 const captionRelations=layoutGraph.relations.map((relation,i)=>({...relation,label:String(i).padEnd(Math.ceil(captionGroups[i].width/12),'x')}));
 const loopBoxes=[...loopWires].map(([i,loop])=>{const node=nodes.find(n=>n.id===rows[i][0].from)!,group=captionGroups[i];return{x:node.x+node.width+8,y:node.y-loop.rise-group.height/2,width:group.width,height:group.height};});
 let sharedRoutes=new RouteCache().update({},model,nodes,captionRelations,wires);
 // For a long return corridor, moving the corridor a little can keep a loop
 // caption much closer to its state. Otherwise keep the existing corridor and
 // let the shared caption escape move the text by the smaller amount.
 for(let pass=0;pass<=loopBoxes.length;pass++){
  let changed=false;
  sharedRoutes.forEach((route,i)=>{
   if(!route||loopWires.has(i)||!wires[i].returning)return;
   let distance=0;
   for(const box of loopBoxes)for(let j=1;j<route.points.length;j++){
    const a=route.points[j-1],b=route.points[j];if(Math.abs(a[0]-b[0])>1e-7||Math.abs(a[1]-b[1])<2)continue;
    const x=a[0];if(x<box.x-4||x>box.x+box.width+4||Math.max(a[1],b[1])<box.y-4||Math.min(a[1],b[1])>box.y+box.height+4)continue;
    const labelMove=x+10-box.x,routeMove=box.x+box.width+12-x;if(routeMove>0&&routeMove<labelMove)distance=Math.max(distance,routeMove);
   }
   if(distance){wires[i]={...wires[i],returnLane:(wires[i].returnLane??0)+Math.ceil(distance/16)};changed=true;}
  });
  if(!changed)break;sharedRoutes=new RouteCache().update({},model,nodes,captionRelations,wires);
 }
 const otherWires=sharedRoutes.flatMap((route,i)=>route&&!loopWires.has(i)?[route.points]:[]);
 const routes=sharedRoutes.map((route,i)=>{
  const loop=loopWires.get(i);if(!loop)return route;
  const id=rows[i][0].from,node=nodes.find(n=>n.id===id)!;
  const related=sharedRoutes.flatMap((other,j)=>other&&!loopWires.has(j)?[other.points]:[]);
  const width=Math.max(30,captionRelations[i].label.length*12),group=captionGroups[i];
  const result=stateSelfLoopRoute(node,nodes,{...loop,labelLeft:node.x+node.width+8},width,otherWires);
  // The same shared row escape keeps a loop's label clear of another line
  // only when that line actually passes through this label's vertical span.
  const barriers=related.flatMap((points,j)=>points.slice(1).map((p,k)=>({id:`${j}:${k}`,x:Math.min(points[k][0],p[0])-2,y:Math.min(points[k][1],p[1])-2,width:Math.abs(points[k][0]-p[0])+4,height:Math.abs(points[k][1]-p[1])+4})));
  const position=captionOnRow([node.x+node.width+8+group.width/2,result.label[1]],group.width,group.height,[...nodes,...barriers]);
  result.label=[position[0]-group.width/2+width/2,position[1]];otherWires.push(result.points);return result;
 });
 const labelPositions:([number,number]|undefined)[]=new Array(rows.length),placed:RouteNode[]=[];
 const captionOrder=rows.map((_,i)=>i).sort((a,b)=>Number(wires[a].returning)-Number(wires[b].returning));
 for(const i of captionOrder){
  const route=routes[i]!,group=captionGroups[i],singleWidth=Math.max(30,captionRelations[i].label.length*12);
  const anchor:[number,number]=[route.label[0]-singleWidth/2+group.width/2,route.label[1]+(wires[i].returning?0:group.height/2-9)];
  const label=captionOnRow(anchor,group.width,group.height,nodes,placed);labelPositions[i]=label;
  placed.push({id:String(i),x:label[0]-group.width/2,y:label[1]-group.height/2,width:group.width,height:group.height});
 }
 let right=Math.max(...nodes.map(n=>n.x+n.width))+40,bottom=Math.max(...nodes.map(n=>n.y+n.height))+40;
 rows.forEach((rs,index)=>{
  const row=rs[0];
  const route=routes[index]!;
  const path=make('path',{d:route.path,fill:'none',stroke:'currentColor','marker-end':'url(#state-transition-arrow)','data-transitions':rs.map(r=>r.id).join(' ')});if(row.path==='exception'){path.classList.add('exception');path.setAttribute('stroke-dasharray','6 5');}
  const description=make('title');description.textContent=rs.map(r=>`${r.id} ${r.activity} / ${r.path==='normal'?'通常':r.exception??'例外名未定義'}：${r.condition}`).join(' / ');path.append(description);svg.append(path);edgeElements.push(path);
  right=Math.max(right,route.bounds.right+40);bottom=Math.max(bottom,route.bounds.bottom+40);
 });
 for(const [index,group] of captionGroups.entries()){
  const position=labelPositions[index]!,x=position[0]-group.width/2,y=position[1]-group.height/2+14;
  svg.append(make('rect',{x:String(x),y:String(y-14),width:String(group.width),height:String(group.height),fill:'none','pointer-events':'none','data-canvas-boundary':''}));
  const label=make('text',{x:String(x),y:String(y),class:'state-diagram-edge-label','data-activity':group.activity,'data-transition-id':group.rows[0].id,'aria-label':group.lines.join('')});
  group.lines.forEach((line,i)=>{const span=make('tspan',{x:String(x),dy:i?'18':'0','font-size':'14','font-weight':'600'});span.textContent=line;span.setAttribute('data-transitions',group.lineRows[i].map(r=>r.id).join(' '));captionElements.push({element:span,rows:group.lineRows[i]});label.append(span);});svg.append(label);
  right=Math.max(right,x+group.width+24);bottom=Math.max(bottom,y+group.height+24);
 }
 for(const node of nodes){
  const special=node.id.startsWith('@'),group=make('g',{role:'button',tabindex:'0','aria-label':labels[node.id]??node.id,'aria-pressed':'false',class:'node graph-shape state-shape','data-state':node.id,'data-node':node.id});
  group.append(cardSurface(document,node,special));
  group.append(make('rect',{x:String(node.x),y:String(node.y),width:String(node.width),height:String(node.height),rx:special?'20':'8',class:special?'state-diagram-node state-note':'state-diagram-node'}));
  const label=make('text',{x:String(node.x+node.width/2),y:String(node.y+node.height/2+5),'text-anchor':'middle',class:'state-diagram-node-label'});label.textContent=labels[node.id]??node.id;group.append(label);
  if(special&&node.id!=='@new'){const note=make('text',{x:String(node.x+node.width/2),y:String(node.y-8),'text-anchor':'middle',class:'state-diagram-event-id'});note.textContent=node.id==='@unknown'?'課題：保存状態が未定義':'処理結果：記録を作らない';group.append(note);}
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
 const views=savedViews.get(design)??new Map<string,DiagramView>();savedViews.set(design,views);const view=views.get(id)??newDiagramView();views.set(id,view);const projectedModel={...model,transitions:model.transitions.map(row=>({...row,activityId:row.activity,activity:design.graph.nodes.find(n=>n.id===row.activity)?.name??row.activity}))};root.append(diagramCanvas(document,v=>stateDiagram(projectedModel,v),view));
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
