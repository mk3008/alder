import type {Graph,Relation} from './graph';
import type {Point} from './session';
import {dependencyOrder} from './layout-order.ts';
// 68px card + 44px for its caption, the following badge and visible clearance.
const ROW_STEP=112;
export const CAPTION_LINE_STEP=22;
export type MatrixWire={returning:boolean;captionLane:number;fromPort?:number;toPort?:number;returnLane?:number};
/** Only normal departures share captions; return/exception bends stay independent. */
export function captionKey(relation:Relation,index:number,wire?:MatrixWire):string{
 return wire&&!wire.returning&&(relation.kind==='input'||relation.kind==='output')
  ?JSON.stringify([relation.kind,relation.from,relation.label]):JSON.stringify(['relation',index]);
}
export type MatrixPlan={positions:Record<string,Point>;cells:Record<string,Point>;wires:MatrixWire[];forwardRelations:number[];feedbackRelations:number[];exceptionRelations:number[]};
export function isMatrixGraph(graph:Graph):boolean{
 const types=new Map(graph.nodes.map(n=>[n.id,n.type]));
 return graph.nodes.some(n=>n.type==='business')&&graph.relations.every(r=>r.kind==='input'?types.get(r.from)==='object'&&types.get(r.to)==='business':r.kind==='output'?types.get(r.from)==='business'&&types.get(r.to)==='object':true);
}
/** Bounded heap; graph depth and fan-out never use the call stack. */
class Heap<T>{
 private items:T[]=[];
 private before:(a:T,b:T)=>boolean;
 constructor(before:(a:T,b:T)=>boolean){this.before=before;}
 peek(){return this.items[0];}
 push(item:T){let i=this.items.length;this.items.push(item);while(i>0){const p=(i-1)>>1;if(!this.before(item,this.items[p]))break;this.items[i]=this.items[p];i=p;}this.items[i]=item;}
 pop(){const first=this.items[0],last=this.items.pop();if(this.items.length&&last!==undefined){let i=0;while(2*i+1<this.items.length){let c=2*i+1;if(c+1<this.items.length&&this.before(this.items[c+1],this.items[c]))c++;if(!this.before(this.items[c],last))break;this.items[i]=this.items[c];i=c;}this.items[i]=last;}return first;}
}
/** Activity skeleton -> Object insertion -> cell reservations -> projection.
 * SCCs determine direction before any cells or pixel coordinates exist. */
export function matrixPlan(graph:Graph,hint?:readonly string[],activity?:string):MatrixPlan{
 const analysis=dependencyOrder(graph,hint),{nodes:stable,children,parents,activityRank}=analysis;
 const indegree=parents.map(p=>p.length);
 const ready=new Heap<number>((a,b)=>{
  const x=stable[a],y=stable[b];if(x.type!==y.type)return x.type==='object';
  return x.type==='business'?activityRank.get(x.id)!<activityRank.get(y.id)!:a<b;
 });
 indegree.forEach((n,i)=>{if(n===0)ready.push(i);});
 const order:string[]=[];
 while(ready.peek()!==undefined){const n=ready.pop()!;if(stable[n].type==='business')order.push(stable[n].id);for(const other of children[n])if(--indegree[other]===0)ready.push(other);}
 const rank=new Map(order.map((id,i)=>[id,i])),phase=new Map(order.map((id,i)=>[id,2*i]));
 const returning=new Set([...analysis.feedbackRelations,...analysis.exceptionRelations]);
 const unique=new Map<string,{relation:Relation;index:number}>();
 graph.relations.forEach((r,i)=>{const key=JSON.stringify([r.kind,r.from,r.to,r.label]);if(!unique.has(key))unique.set(key,{relation:r,index:i});});
 const writers=new Map<string,string[]>(),readers=new Map<string,string[]>(),degree=new Map<string,number>();
 for(const {relation:r,index:i}of unique.values()){
  if(r.kind==='input'||r.kind==='output')degree.set(r.from,(degree.get(r.from)??0)+1);
  if(returning.has(i))continue;
  if(r.kind==='output'){const list=writers.get(r.to)??[];list.push(r.from);writers.set(r.to,list);}
  if(r.kind==='input'){const list=readers.get(r.from)??[];list.push(r.to);readers.set(r.from,list);}
 }
 const owner=new Map<string,string>();
 for(const n of stable.filter(n=>n.type==='object')){
  const ws=writers.get(n.id)??[],rs=readers.get(n.id)??[];
  // All acyclic writers must precede this Object. Later writers inside a cycle
  // already belong to feedback relations and cannot dictate its forward cell.
  if(ws.length){const writer=ws.reduce((a,b)=>rank.get(a)!>rank.get(b)!?a:b);owner.set(n.id,writer);phase.set(n.id,2*rank.get(writer)!+1);}
  else phase.set(n.id,rs.length?2*rs.reduce((min,id)=>Math.min(min,rank.get(id)!),Infinity)-1:2*order.length+1);
 }
 const nodes=stable.slice().sort((a,b)=>phase.get(a.id)!-phase.get(b.id)!||(degree.get(b.id)??0)-(degree.get(a.id)??0)||a.id.localeCompare(b.id,'en'));
 // Focus is a projection policy, not a second DAG/layout implementation.
 // Normal Object outputs precede exception Activities in either view.
 const focused=activity!==undefined&&stable.some(n=>n.id===activity&&n.type==='business');
 const detailColumns=new Map<string,number>();
 if(focused){
  const outputs=new Set(graph.relations.filter(r=>r.from===activity&&r.kind==='output').map(r=>r.to));
  const upstream=stable.filter(n=>n.id!==activity&&n.type!=='business'&&!outputs.has(n.id));
  const after=stable.filter(n=>outputs.has(n.id));
  const exceptions=stable.filter(n=>n.type==='business'&&n.id!==activity);
  const focus=stable.find(n=>n.id===activity)!;
  nodes.splice(0,nodes.length,...upstream,focus,...after,...exceptions);
  upstream.forEach((n,i)=>detailColumns.set(n.id,i));
  detailColumns.set(activity!,upstream.length);
  after.forEach(n=>detailColumns.set(n.id,upstream.length+1));
  exceptions.forEach((n,i)=>detailColumns.set(n.id,upstream.length+2+i));
 }
 const rowIndex=new Map(nodes.map((n,i)=>[n.id,i])),lanes=new Map<string,number>(),wireKeys=new Map<string,MatrixWire>(),captionLanes=new Map<string,number>();
 const wires:MatrixWire[]=graph.relations.map((r,i)=>{
  const identity=JSON.stringify([r.kind,r.from,r.to,r.label]);if(wireKeys.has(identity))return wireKeys.get(identity)!;
  const back=returning.has(i),key=(back?'return:':'departure:')+r.from,group=captionKey(r,i,{returning:back,captionLane:0});
  let captionLane=captionLanes.get(group);if(captionLane===undefined){captionLane=lanes.get(key)??0;lanes.set(key,captionLane+1);captionLanes.set(group,captionLane);}
  const wire={returning:back,captionLane};wireKeys.set(identity,wire);return wire;
 });
 const lastTarget=new Map<string,number>();
 for(const {relation:r,index:i}of unique.values())if(!wires[i].returning){
  lastTarget.set(r.from,Math.max(lastTarget.get(r.from)??-1,rowIndex.get(r.to)!));
 }
 const cells:Record<string,Point>=Object.create(null),positions:Record<string,Point>=Object.create(null);
 const corridors=new Heap<{column:number;until:number}>((a,b)=>a.column>b.column);
 let previousActivityColumn=-1,row=0;
 for(const [i,n]of nodes.entries()){
  // One logical row per card; extra caption lines expand only its pixel gap.
  if(i)row++;
  let column=n.type==='business'?previousActivityColumn+1:owner.has(n.id)?cells[owner.get(n.id)!][0]+1:0;
  if(focused)column=detailColumns.get(n.id)!;
  while(corridors.peek()&&corridors.peek().until<i)corridors.pop();
  if(!focused&&corridors.peek())column=Math.max(column,corridors.peek().column);
  cells[n.id]=[column,row];if(n.type==='business')previousActivityColumn=column;
  if(lastTarget.has(n.id))corridors.push({column:column+1,until:lastTarget.get(n.id)!});
 }
 let y=40;
 for(const n of nodes){
  positions[n.id]=[40+64*cells[n.id][0],y];
  y+=ROW_STEP+CAPTION_LINE_STEP*Math.max(0,(lanes.get('departure:'+n.id)??0)-1);
 }
 return {positions,cells,wires:directionalReturnWires(graph,wires,positions),forwardRelations:analysis.forwardRelations,feedbackRelations:analysis.feedbackRelations,exceptionRelations:analysis.exceptionRelations};
}

/** Order occupied roles by the side of their peers in the canonical layout.
 * Keep a role shared, even when it has peers on both sides. Use each distinct
 * peer once; ties retain semantic role order. Manual drags/filters never reorder.
 */
export function directionalReturnWires(graph:Graph,wires:readonly MatrixWire[],positions:Record<string,Point>):MatrixWire[]{
 const peers=new Map<string,Map<number,Set<string>>>();
 const endpointRoles=graph.relations.map((r,i)=>!wires[i].returning?undefined:r.kind.endsWith('exception')?{from:2,to:1}:{from:3,to:0});
 const add=(id:string,role:number,other:string)=>{const roles=peers.get(id)??new Map<number,Set<string>>(),ids=roles.get(role)??new Set<string>();ids.add(other);roles.set(role,ids);peers.set(id,roles);};
 graph.relations.forEach((r,i)=>{const role=endpointRoles[i];if(role){add(r.from,role.from,r.to);add(r.to,role.to,r.from);}});
 const direction=(id:string,ids:Set<string>)=>[...ids].reduce((sum,other)=>sum+Math.sign(positions[other][1]-positions[id][1]),0)/ids.size;
 const ordered=new Map([...peers].map(([id,roles])=>[id,[...roles].sort(([a,as],[b,bs])=>direction(id,as)-direction(id,bs)||a-b).map(([role])=>role)]));
 const slot=(id:string,role:number)=>ordered.get(id)!.indexOf(role);
 const fraction=(id:string,role:number)=>(slot(id,role)+1)/(ordered.get(id)!.length+1);
 // At an upper-facing endpoint, upper ports use the inner corridor; at a
 // lower-facing endpoint the order reverses. Combine both ends without moving
 // a corridor inside any card. This is a bounded local crossing heuristic.
 const lane=(id:string,role:number,other:string)=>positions[other][1]<positions[id][1]?slot(id,role):ordered.get(id)!.length-1-slot(id,role);
 return wires.map((wire,i)=>{const role=endpointRoles[i];if(!role)return {...wire};const r=graph.relations[i];return {...wire,fromPort:fraction(r.from,role.from),toPort:fraction(r.to,role.to),returnLane:Math.max(lane(r.from,role.from,r.to),lane(r.to,role.to,r.from))};});
}
