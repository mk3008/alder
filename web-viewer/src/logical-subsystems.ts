import draft from './logical-subsystems.json';
import {cardSurface,diagramCanvas,newDiagramView,type DiagramView} from './diagram-canvas';
import {graphFocus} from './graph-focus';
import {graphMarkers} from './graph-visuals';
import {routeEdge,type RouteNode} from './routing';

export type LogicalSelection={kind:'group'|'node'|'connection';id:string};
type Subsystem=(typeof draft.subsystems)[number];
type LogicalNode=(typeof draft.nodes)[number];
type LogicalConnection=(typeof draft.connections)[number];
const positions:Record<string,[number,number]>={request:[65,90],decision:[155,220],preparation:[585,365],result:[675,500],progress:[270,635]};
const ns='http://www.w3.org/2000/svg';
const sourceKey='alder-logical-subsystems-v1:'+location.pathname;
const find=(s:LogicalSelection)=>s.kind==='group'?draft.subsystems.find(x=>x.id===s.id):s.kind==='node'?draft.nodes.find(x=>x.id===s.id):draft.connections.find(x=>x.id===s.id);
function svgElement(doc:Document,tag:string,attributes:Record<string,string|number>={}){const element=doc.createElementNS(ns,tag);for(const [key,value] of Object.entries(attributes))element.setAttribute(key,String(value));return element;}
function text(root:HTMLElement,tag:string,value:string){const element=root.ownerDocument.createElement(tag);element.textContent=value;root.append(element);return element;}
function buttonInSvg(doc:Document,x:number,y:number,width:number,label:string,action:()=>void,className:string){
 const foreign=svgElement(doc,'foreignObject',{x,y,width,height:36});const button=doc.createElement('button');button.type='button';button.className=className;button.textContent=label;button.onclick=action;foreign.append(button);return foreign;
}
function safeView(saved:unknown,view:DiagramView):LogicalSelection|undefined{
 if(!saved||typeof saved!=='object')return;const value=saved as {zoom?:unknown;scroll?:unknown;locked?:unknown;positions?:unknown;selection?:unknown};
 if(typeof value.zoom==='number'&&Number.isFinite(value.zoom))view.zoom=Math.min(2.5,Math.max(.25,value.zoom));
 if(Array.isArray(value.scroll)&&value.scroll.length===2&&value.scroll.every(n=>typeof n==='number'&&Number.isFinite(n)))view.scroll=[value.scroll[0],value.scroll[1]];
 if(typeof value.locked==='boolean')view.locked=value.locked;
 if(value.positions&&typeof value.positions==='object')for(const [id,point]of Object.entries(value.positions))if(Object.hasOwn(positions,id)&&Array.isArray(point)&&point.length===2&&point.every(n=>typeof n==='number'&&Number.isFinite(n)))view.positions.set(id,[point[0],point[1]]);
 const selection=value.selection as LogicalSelection|undefined;if(selection&&['group','node','connection'].includes(selection.kind)&&typeof selection.id==='string'&&find(selection)){if(selection.kind==='node')view.selected=selection.id;return selection;}
}

/** A pre-authored logical review draft. The Viewer does not infer boundaries from JSON. */
export function createLogicalSubsystemPanel(doc:Document,selected:()=>void){
 const root=doc.createElement('article');root.className='logical-subsystems-panel';root.setAttribute('aria-label','論理サブシステムのレビュー');
 const view=newDiagramView();let selection:LogicalSelection|undefined;try{selection=safeView(JSON.parse(localStorage.getItem(sourceKey)||'null'),view);}catch{}
 const save=()=>{try{localStorage.setItem(sourceKey,JSON.stringify({zoom:view.zoom,scroll:view.scroll,locked:view.locked,positions:Object.fromEntries(view.positions),selection}));}catch{}};
 let canvas:HTMLElement|undefined;
 const choose=(next:LogicalSelection)=>{selection=next;view.selected=next.kind==='node'?next.id:undefined;const svg=canvas?.querySelector<SVGSVGElement>('.diagram-world>svg');if(svg)paint(svg);save();selected();};
 const paint=(svg:SVGSVGElement)=>{
  const selectedNode=selection?.kind==='node'?selection.id:undefined,focus=graphFocus(draft.connections,selectedNode);
  const groupNodes=selection?.kind==='group'?new Set(draft.nodes.filter(n=>n.group===selection!.id).map(n=>n.id)):new Set<string>();
  const edge=selection?.kind==='connection'?draft.connections.find(e=>e.id===selection!.id):undefined;
  for(const node of draft.nodes){const shape=svg.querySelector(`[data-logical-node="${node.id}"]`);if(!shape)continue;const extra=focus.nodeClasses(node.id)||(groupNodes.has(node.id)||(edge&&(edge.from===node.id||edge.to===node.id))?' review-neighbor':'');shape.setAttribute('class','node graph-shape state-shape'+extra);shape.setAttribute('aria-pressed',String(selectedNode===node.id));}
  for(const group of draft.subsystems){const shape=svg.querySelector(`[data-logical-group="${group.id}"]`);shape?.classList.toggle('selected',selection?.kind==='group'&&selection.id===group.id);}
  for(const connection of draft.connections){const active=focus.related(connection)||edge?.id===connection.id||(groupNodes.size>0&&(groupNodes.has(connection.from)||groupNodes.has(connection.to)));const path=svg.querySelector(`[data-logical-edge="${connection.id}"]`);path?.setAttribute('class','edge'+(active?' review-related':''));path?.setAttribute('marker-end',`url(#logical-${active?'related-arrow':'arrow'})`);svg.querySelector(`[data-logical-caption="${connection.id}"]`)?.classList.toggle('review-related',!!active);}
 };
 const render=(current:DiagramView)=>{
  const nodes:RouteNode[]=draft.nodes.map(item=>{const point=current.positions.get(item.id)??positions[item.id];return{id:item.id,x:point[0],y:point[1],width:220,height:55};});
  const svg=svgElement(doc,'svg',{class:'state-diagram logical-diagram',role:'group','aria-label':'論理サブシステムの相関図'}) as SVGSVGElement;
  svg.append(graphMarkers('logical-'));
  let right=0,bottom=0;
  for(const group of draft.subsystems){const members=draft.nodes.filter(n=>n.group===group.id).map(n=>nodes.find(x=>x.id===n.id)!);const x=Math.min(...members.map(n=>n.x))-25,y=Math.min(...members.map(n=>n.y))-46,r=Math.max(...members.map(n=>n.x+n.width))+25,b=Math.max(...members.map(n=>n.y+n.height))+25;
   const region=svgElement(doc,'g',{'data-logical-group':group.id,class:'logical-boundary'});region.append(svgElement(doc,'rect',{x,y,width:r-x,height:b-y,rx:8,'data-canvas-boundary':''}));region.append(buttonInSvg(doc,x+10,y+6,170,group.name+'（案）',()=>choose({kind:'group',id:group.id}),'logical-boundary-button'));svg.append(region);right=Math.max(right,r+40);bottom=Math.max(bottom,b+40);
  }
  for(const [index,connection]of draft.connections.entries()){
   const cross=draft.nodes.find(n=>n.id===connection.from)!.group!==draft.nodes.find(n=>n.id===connection.to)!.group;
   const route=routeEdge({from:connection.from,to:connection.to,nodes,index,kind:'input',matrix:{returning:false,captionLane:0},labelWidth:cross?178:0,labelHeight:18});
   const path=svgElement(doc,'path',{d:route.path,class:'edge','data-logical-edge':connection.id,'data-from':connection.from,'data-to':connection.to,'data-unrouted':String(route.fallback),'marker-end':'url(#logical-arrow)'});const title=svgElement(doc,'title');title.textContent=connection.label;path.append(title);svg.append(path);
   if(cross){const caption=buttonInSvg(doc,route.label[0]-89,route.label[1]-14,178,connection.label,()=>choose({kind:'connection',id:connection.id}),'logical-edge-button');caption.setAttribute('data-logical-caption',connection.id);svg.append(caption);right=Math.max(right,route.label[0]+100);bottom=Math.max(bottom,route.label[1]+30);}
   right=Math.max(right,route.bounds.right+40);bottom=Math.max(bottom,route.bounds.bottom+40);
  }
  for(const node of nodes){const data=draft.nodes.find(n=>n.id===node.id)!;const shape=svgElement(doc,'g',{role:'button',tabindex:0,'aria-label':data.label+'を選択','aria-pressed':'false',class:'node graph-shape state-shape','data-node':node.id,'data-logical-node':node.id});shape.append(cardSurface(doc,node));shape.append(svgElement(doc,'rect',{x:node.x,y:node.y,width:node.width,height:node.height,rx:8,class:'state-diagram-node'}));const label=svgElement(doc,'text',{x:node.x+node.width/2,y:node.y+32,'text-anchor':'middle',class:'state-diagram-node-label'});label.textContent=data.label;shape.append(label);shape.addEventListener('click',()=>choose({kind:'node',id:node.id}));shape.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();choose({kind:'node',id:node.id});}});svg.append(shape);}
  svg.setAttribute('viewBox',`0 0 ${right} ${bottom}`);paint(svg);return svg;
 };
 text(root,'h2','論理サブシステムの相関');text(root,'p','稟議と入荷予実の分割案').className='logical-draft-label';
 canvas=diagramCanvas(doc,render,view);canvas.classList.add('logical-subsystems-canvas');root.append(canvas);
 canvas.addEventListener('click',save);canvas.addEventListener('pointerup',()=>queueMicrotask(save));canvas.querySelector('.diagram-viewport')?.addEventListener('scroll',save);
 for(const [heading,items]of [['メリット',draft.benefits],['デメリット・必要な管理',draft.considerations],['レビューポイント',draft.reviewPoints]] as const){const section=doc.createElement('section');section.className='logical-review-section';text(section,'h2',heading);const list=doc.createElement('ul');for(const item of items)text(list,'li',item);section.append(list);root.append(section);}
 return {root,selection:()=>selection,activities:(entry:LogicalSelection)=>{const data=find(entry);return data?data.activities.map(key=>draft.activities.find(activity=>activity.key===key)!).filter(Boolean):[];},describe(target:HTMLElement,entry:LogicalSelection){
  target.replaceChildren();const data=find(entry);if(!data)return '';if(entry.kind==='group'){const group=data as Subsystem;text(target,'p',group.purpose);text(target,'h3','扱う情報');const list=doc.createElement('ul');for(const value of group.information)text(list,'li',value);target.append(list);text(target,'h3','まとまりの理由');text(target,'p',group.reason);return group.name;}
  if(entry.kind==='node'){const node=data as LogicalNode;text(target,'p',node.detail);text(target,'h3','属するまとまり');text(target,'p',draft.subsystems.find(group=>group.id===node.group)!.name);return node.label;}
  const connection=data as LogicalConnection;text(target,'p',connection.detail);text(target,'h3','出元と受取先');const from=draft.nodes.find(node=>node.id===connection.from)!,to=draft.nodes.find(node=>node.id===connection.to)!;text(target,'p',`${from.label} → ${to.label}`);return connection.label;
 }};
}
