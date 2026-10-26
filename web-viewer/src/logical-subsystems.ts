import draft from './logical-subsystems.json';
import {cardSurface,diagramCanvas,newDiagramView,type DiagramView} from './diagram-canvas';
import {graphFocus} from './graph-focus';
import {graphMarkers,paintGraphException} from './graph-visuals';
import {routeEdge,type RouteNode} from './routing';

export type LogicalSelection={kind:'group'|'connection';id:string};
type Subsystem=(typeof draft.subsystems)[number];
type LogicalConnection=(typeof draft.connections)[number];
const positions:Record<string,[number,number]>={approval:[60,65],receiving:[430,300]};
const legacyGroups:Record<string,string>={request:'approval',decision:'approval',progress:'approval',preparation:'receiving',result:'receiving'};
const ns='http://www.w3.org/2000/svg';
const sourceKey='alder-logical-subsystems-v1:'+location.pathname;
const find=(s:LogicalSelection)=>s.kind==='group'?draft.subsystems.find(x=>x.id===s.id):draft.connections.find(x=>x.id===s.id);
function svgElement(doc:Document,tag:string,attributes:Record<string,string|number>={}){const element=doc.createElementNS(ns,tag);for(const [key,value] of Object.entries(attributes))element.setAttribute(key,String(value));return element;}
function text(root:HTMLElement,tag:string,value:string){const element=root.ownerDocument.createElement(tag);element.textContent=value;root.append(element);return element;}
function buttonInSvg(doc:Document,x:number,y:number,width:number,label:string,action:()=>void){
 const foreign=svgElement(doc,'foreignObject',{x,y,width,height:36});const button=doc.createElement('button');button.type='button';button.className='logical-edge-button';button.textContent=label;button.onclick=action;foreign.append(button);return foreign;
}
function safeView(saved:unknown,view:DiagramView):LogicalSelection|undefined{
 if(!saved||typeof saved!=='object')return;const value=saved as {zoom?:unknown;scroll?:unknown;locked?:unknown;positions?:unknown;selection?:{kind?:unknown;id?:unknown}};
 if(typeof value.zoom==='number'&&Number.isFinite(value.zoom))view.zoom=Math.min(2.5,Math.max(.25,value.zoom));
 if(Array.isArray(value.scroll)&&value.scroll.length===2&&value.scroll.every(n=>typeof n==='number'&&Number.isFinite(n)))view.scroll=[value.scroll[0],value.scroll[1]];
 if(typeof value.locked==='boolean')view.locked=value.locked;
 if(value.positions&&typeof value.positions==='object')for(const [id,point]of Object.entries(value.positions))if(Object.hasOwn(positions,id)&&Array.isArray(point)&&point.length===2&&point.every(n=>typeof n==='number'&&Number.isFinite(n)))view.positions.set(id,[point[0],point[1]]);
 const old=value.selection;if(!old||typeof old.id!=='string')return;
 const selection:LogicalSelection|undefined=old.kind==='node'&&legacyGroups[old.id]?{kind:'group',id:legacyGroups[old.id]}:old.kind==='group'||old.kind==='connection'?{kind:old.kind,id:old.id}:undefined;
 if(selection&&find(selection)){if(selection.kind==='group')view.selected=selection.id;return selection;}
}

/** A pre-authored logical review draft. The Viewer does not infer boundaries from JSON. */
export function createLogicalSubsystemPanel(doc:Document,selected:()=>void){
 const root=doc.createElement('article');root.className='logical-subsystems-panel';root.setAttribute('aria-label','論理サブシステムのレビュー');
 const view=newDiagramView();let selection:LogicalSelection|undefined;try{selection=safeView(JSON.parse(localStorage.getItem(sourceKey)||'null'),view);}catch{}
 const save=()=>{try{localStorage.setItem(sourceKey,JSON.stringify({zoom:view.zoom,scroll:view.scroll,locked:view.locked,positions:Object.fromEntries(view.positions),selection}));}catch{}};
 let canvas:HTMLElement|undefined;
 const choose=(next:LogicalSelection)=>{selection=next;view.selected=next.kind==='group'?next.id:undefined;const svg=canvas?.querySelector<SVGSVGElement>('.diagram-world>svg');if(svg)paint(svg);save();selected();};
 const paint=(svg:SVGSVGElement)=>{
  const selectedGroup=selection?.kind==='group'?selection.id:undefined,focus=graphFocus(draft.connections,selectedGroup);
  const edge=selection?.kind==='connection'?draft.connections.find(e=>e.id===selection!.id):undefined;
  for(const group of draft.subsystems){const shape=svg.querySelector(`[data-logical-group="${group.id}"]`);if(!shape)continue;const extra=focus.nodeClasses(group.id)||(edge&&(edge.from===group.id||edge.to===group.id)?' review-neighbor':'');shape.setAttribute('class','node graph-shape state-shape'+extra);shape.setAttribute('aria-pressed',String(selectedGroup===group.id));}
  for(const connection of draft.connections){const active=focus.related(connection)||edge?.id===connection.id;const path=svg.querySelector<SVGElement>(`[data-logical-edge="${connection.id}"]`);path?.setAttribute('class','edge'+(connection.returning?' exception':'')+(active?' review-related':''));path?.setAttribute('marker-end',`url(#logical-${active?'related-arrow':'arrow'})`);svg.querySelector(`[data-logical-caption="${connection.id}"]`)?.classList.toggle('review-related',!!active);}
  svg.querySelectorAll('[data-exception-paint]').forEach(element=>element.remove());
  svg.querySelectorAll<SVGElement>('[data-logical-edge].exception').forEach(path=>paintGraphException(svg,path,{path:path.getAttribute('d')!},{'data-logical-return-paint':path.getAttribute('data-logical-edge')!}));
 };
 const render=(current:DiagramView)=>{
  const nodes:RouteNode[]=draft.subsystems.map(item=>{const point=current.positions.get(item.id)??positions[item.id];return{id:item.id,x:point[0],y:point[1],width:270,height:126};});
  const svg=svgElement(doc,'svg',{class:'state-diagram logical-diagram',role:'group','aria-label':'論理サブシステムの相関図'}) as SVGSVGElement;
  svg.append(graphMarkers('logical-'));let right=0,bottom=0;
  for(const [index,connection]of draft.connections.entries()){
   const route=routeEdge({from:connection.from,to:connection.to,nodes,index,kind:'input',matrix:{returning:connection.returning,captionLane:0},labelWidth:190,labelHeight:18});
   const path=svgElement(doc,'path',{d:route.path,class:'edge'+(connection.returning?' exception':''),'data-logical-edge':connection.id,'data-from':connection.from,'data-to':connection.to,'data-unrouted':String(route.fallback),'marker-end':'url(#logical-arrow)'});const title=svgElement(doc,'title');title.textContent=connection.label;path.append(title);svg.append(path);
   const caption=buttonInSvg(doc,route.label[0]-95,route.label[1]-14,190,connection.label,()=>choose({kind:'connection',id:connection.id}));caption.setAttribute('data-logical-caption',connection.id);svg.append(caption);
   right=Math.max(right,route.bounds.right+40,route.label[0]+105);bottom=Math.max(bottom,route.bounds.bottom+40,route.label[1]+30);
  }
  for(const node of nodes){const group=draft.subsystems.find(item=>item.id===node.id)!;const shape=svgElement(doc,'g',{role:'button',tabindex:0,'aria-label':group.name+'を選択','aria-pressed':'false',class:'node graph-shape state-shape','data-node':node.id,'data-logical-group':node.id});shape.append(cardSurface(doc,node));shape.append(svgElement(doc,'rect',{x:node.x,y:node.y,width:node.width,height:node.height,rx:8,class:'state-diagram-node','data-canvas-boundary':''}));const label=svgElement(doc,'text',{x:node.x+16,y:node.y+27,class:'state-diagram-node-label logical-card-title'});label.textContent=group.name;shape.append(label);
   group.information.forEach((item,index)=>{const line=svgElement(doc,'text',{x:node.x+16,y:node.y+54+index*22,class:'state-diagram-node-label logical-card-information'});line.textContent=item;shape.append(line);});
   shape.addEventListener('click',()=>choose({kind:'group',id:node.id}));shape.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();choose({kind:'group',id:node.id});}});svg.append(shape);right=Math.max(right,node.x+node.width+40);bottom=Math.max(bottom,node.y+node.height+40);
  }
  svg.setAttribute('viewBox',`0 0 ${right} ${bottom}`);paint(svg);return svg;
 };
 text(root,'h2','論理サブシステムの相関');
 canvas=diagramCanvas(doc,render,view);canvas.classList.add('logical-subsystems-canvas');root.append(canvas);
 canvas.addEventListener('click',save);canvas.addEventListener('pointerup',()=>queueMicrotask(save));canvas.querySelector('.diagram-viewport')?.addEventListener('scroll',save);
 for(const [heading,items]of [['メリット',draft.benefits],['デメリット・必要な管理',draft.considerations],['レビューポイント',draft.reviewPoints]] as const){const section=doc.createElement('section');section.className='logical-review-section';text(section,'h2',heading);const list=doc.createElement('ul');for(const item of items)text(list,'li',item);section.append(list);root.append(section);}
 return {root,selection:()=>selection,activities:(entry:LogicalSelection)=>{const data=find(entry);return data?data.activities.map(key=>draft.activities.find(activity=>activity.key===key)!).filter(Boolean):[];},describe(target:HTMLElement,entry:LogicalSelection){
  target.replaceChildren();const data=find(entry);if(!data)return '';if(entry.kind==='group'){const group=data as Subsystem;text(target,'p',group.purpose);text(target,'h3','扱う情報');const list=doc.createElement('ul');for(const value of group.information)text(list,'li',value);target.append(list);text(target,'h3','まとまりの理由');text(target,'p',group.reason);return group.name;}
  const connection=data as LogicalConnection;text(target,'p',connection.detail);text(target,'h3','出元と受取先');const from=draft.subsystems.find(group=>group.id===connection.from)!,to=draft.subsystems.find(group=>group.id===connection.to)!;text(target,'p',`${from.name} → ${to.name}`);return connection.label;
 }};
}
