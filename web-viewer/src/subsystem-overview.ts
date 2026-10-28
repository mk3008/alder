import {createElement,SquareArrowOutUpRight,UserRound} from 'lucide';
import {business,purchaseModel} from './purchase-review';
import {cardSurface,diagramCanvas,newDiagramView,type DiagramView} from './diagram-canvas';
import {graphFocus} from './graph-focus';
import {graphMarkers} from './graph-visuals';
import {routeEdge,type RouteNode} from './routing';

const ns='http://www.w3.org/2000/svg';
const svg=(doc:Document,tag:string,attributes:Record<string,string|number>={})=>{const el=doc.createElementNS(ns,tag);for(const [key,value] of Object.entries(attributes))el.setAttribute(key,String(value));return el;};

/** The model supplies membership, main-flow edges and reviewer IDs; the Viewer only lays them out. */
export function createSubsystemOverview(doc:Document,open:(id:string)=>void,changed:()=>void){
 const groups=purchaseModel.reviewGroups,subsystems=purchaseModel.subsystems;
 const connections=purchaseModel.presentation.landscapeRelationships.map(edge=>{
  if(!groups.some(group=>group.id===edge.from)||!groups.some(group=>group.id===edge.to)||!purchaseModel.presentation.reviewBoundaries.some(item=>item.from===edge.from&&item.to===edge.to))throw Error('Unknown overview relationship: '+edge.from+' -> '+edge.to);
  return edge;
 });
 for(const group of groups){if(!subsystems.some(item=>item.id===group.subsystemId))throw Error('Unknown overview subsystem: '+group.id);if(!business.roles.some(role=>role.id===group.reviewer.roleId))throw Error('Unknown overview reviewer: '+group.id);}
 const ordered=subsystems.flatMap(subsystem=>groups.filter(group=>group.subsystemId===subsystem.id));
 const positions=new Map<string,[number,number]>();let index=0;
 for(const [subsystemIndex,subsystem] of subsystems.entries())for(const group of ordered.filter(item=>item.subsystemId===subsystem.id)){positions.set(group.id,[80+index*170,100+index*120+subsystemIndex*64]);index++;}
 const view=newDiagramView();let canvas:HTMLElement|undefined;
 const choose=(id:string)=>{view.selected=id;const graph=canvas?.querySelector<SVGSVGElement>('.diagram-world>svg');if(graph)paint(graph);changed();};
 const paint=(graph:SVGSVGElement)=>{const focus=graphFocus(connections,view.selected);for(const group of groups){const shape=graph.querySelector(`[data-node="${group.id}"]`);shape?.setAttribute('class','node graph-shape state-shape'+focus.nodeClasses(group.id));shape?.setAttribute('aria-pressed',String(view.selected===group.id));}for(const edge of connections){const path=graph.querySelector(`[data-overview-from="${edge.from}"][data-overview-to="${edge.to}"]`);path?.setAttribute('class','edge'+(focus.related(edge)?' review-related':''));path?.setAttribute('marker-end',`url(#overview-${focus.related(edge)?'related-arrow':'arrow'})`);}};
 const render=(current:DiagramView)=>{
  const nodes:RouteNode[]=ordered.map(group=>{const point=current.positions.get(group.id)??positions.get(group.id)!;return{id:group.id,x:point[0],y:point[1],width:300,height:86};});
  const graph=svg(doc,'svg',{class:'state-diagram subsystem-overview-graph',role:'group','aria-label':'論理サブシステムと概念モデルの全体図'}) as SVGSVGElement;graph.append(graphMarkers('overview-'));let right=0,bottom=0;
  for(const subsystem of subsystems){const members=nodes.filter(node=>groups.find(group=>group.id===node.id)?.subsystemId===subsystem.id);if(!members.length)continue;const x=Math.min(...members.map(n=>n.x))-30,y=Math.min(...members.map(n=>n.y))-48,w=Math.max(...members.map(n=>n.x+n.width))-x+30,h=Math.max(...members.map(n=>n.y+n.height))-y+30;
   const region=svg(doc,'g',{'data-subsystem':subsystem.id,'aria-label':subsystem.name});region.append(svg(doc,'rect',{x,y,width:w,height:h,rx:8,class:'subsystem-overview-region'}));const title=svg(doc,'text',{x:x+14,y:y+24,class:'subsystem-overview-region-title'});title.textContent=subsystem.name;region.append(title);graph.append(region);right=Math.max(right,x+w+40);bottom=Math.max(bottom,y+h+40);
  }
  for(const [index,edge] of connections.entries()){const route=routeEdge({from:edge.from,to:edge.to,nodes,index,kind:'input',labelWidth:0,labelHeight:0});const path=svg(doc,'path',{d:route.path,class:'edge','data-overview-from':edge.from,'data-overview-to':edge.to,'marker-end':'url(#overview-arrow)'});graph.append(path);right=Math.max(right,route.bounds.right+40);bottom=Math.max(bottom,route.bounds.bottom+40);}
  for(const node of nodes){const group=groups.find(item=>item.id===node.id)!,role=business.roles.find(item=>item.id===group.reviewer.roleId)!;const shape=svg(doc,'g',{role:'button',tabindex:0,'aria-label':group.title+'を選択','aria-pressed':'false','data-node':node.id,'data-review-group':node.id,'data-subsystem-id':group.subsystemId,class:'node graph-shape state-shape'});
   const surface=cardSurface(doc,node);const panel=surface.querySelector<HTMLElement>('.graph-card-surface')!;panel.classList.add('subsystem-overview-card-surface');shape.append(surface,svg(doc,'rect',{x:node.x,y:node.y,width:node.width,height:node.height,rx:8,class:'state-diagram-node'}));
   const foreign=svg(doc,'foreignObject',{x:node.x,y:node.y,width:node.width,height:node.height});const card=doc.createElement('div');card.className='subsystem-overview-card';
   const badge=doc.createElement('span');badge.className='subsystem-overview-role-icon';badge.style.setProperty('--role-color',role.color);badge.setAttribute('aria-hidden','true');badge.append(doc.importNode(createElement(UserRound,{'aria-hidden':'true','stroke-width':1.8}),true));
   const labels=doc.createElement('span');labels.className='subsystem-overview-labels';for(const [tag,name,value]of [['span','subsystem-overview-kind','概念モデル'],['strong','subsystem-overview-name',group.title],['small','subsystem-overview-role',role.name]] as const){const el=doc.createElement(tag);el.className=name;el.textContent=value;labels.append(el);}
   const action=doc.createElement('button');action.type='button';action.className='subsystem-overview-open';action.setAttribute('aria-label',group.title+'の詳細タブを開く');action.title='詳細タブを開く';action.append(doc.importNode(createElement(SquareArrowOutUpRight,{'aria-hidden':'true','stroke-width':1.8}),true));action.onpointerdown=event=>event.stopPropagation();action.onpointerup=event=>event.stopPropagation();action.onclick=event=>{event.stopPropagation();open(group.id);};card.append(badge,labels,action);foreign.append(card);shape.append(foreign);
   shape.addEventListener('click',()=>choose(node.id));shape.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();choose(node.id);}});graph.append(shape);
  }
  graph.setAttribute('viewBox',`0 0 ${right} ${bottom}`);paint(graph);return graph;
 };
 canvas=diagramCanvas(doc,render,view);canvas.classList.add('subsystem-overview-canvas');
 return {root:canvas,selected:()=>view.selected,restore:()=>{const apply=()=>{const host=canvas!.querySelector<HTMLElement>('.diagram-viewport')!;host.scrollLeft=view.scroll[0];host.scrollTop=view.scroll[1];};if(doc.defaultView?.requestAnimationFrame)doc.defaultView.requestAnimationFrame(apply);else apply();}};
}
