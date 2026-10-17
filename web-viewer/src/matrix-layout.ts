import type {Graph,Relation} from './graph';
import type {Point} from './session';
import {dependencyOrder} from './layout-order.ts';
export type MatrixWire={returning:boolean;captionLane:number;fromPort?:number;toPort?:number;returnLane?:number;detail?:boolean};
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
export function matrixPlan(graph:Graph,hint?:readonly string[]):MatrixPlan{
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
 const rowIndex=new Map(nodes.map((n,i)=>[n.id,i])),lanes=new Map<string,number>(),wireKeys=new Map<string,MatrixWire>();
 const wires:MatrixWire[]=graph.relations.map((r,i)=>{
  const identity=JSON.stringify([r.kind,r.from,r.to,r.label]);if(wireKeys.has(identity))return wireKeys.get(identity)!;
  const back=returning.has(i),key=(back?'return:':r.kind+':')+(r.kind==='output'&&!back?r.to:r.from),captionLane=lanes.get(key)??0;lanes.set(key,captionLane+1);
  const wire={returning:back,captionLane};wireKeys.set(identity,wire);return wire;
 });
 // Allocate roles before any display filter or coordinate-based routing.
 // Activity right edge: data return arrival, exception arrival, exception exit.
 const activities=new Set(graph.nodes.filter(n=>n.type==='business').map(n=>n.id));
 const roles=new Map<string,Set<number>>();
 const addRole=(id:string,role:number)=>{if(activities.has(id)){const set=roles.get(id)??new Set<number>();set.add(role);roles.set(id,set);}};
 graph.relations.forEach((r,i)=>{
  if(r.kind==='business-exception'){addRole(r.to,1);addRole(r.from,2);}
  else if(r.kind==='input'&&wires[i].returning)addRole(r.to,0);
 });
 const fraction=(id:string,role:number)=>{const ordered=[...(roles.get(id)??[])].sort();return ordered.includes(role)?(ordered.indexOf(role)+1)/(ordered.length+1):undefined;};
 graph.relations.forEach((r,i)=>{
  const wire=wires[i];
  if(r.kind==='business-exception'){wire.fromPort=fraction(r.from,2);wire.toPort=fraction(r.to,1);}
  else if(r.kind==='input'&&wire.returning)wire.toPort=fraction(r.to,0);
  // Different arrival roles use separate vertical runs as well as ports.
  if(wire.toPort!==undefined&&roles.get(r.to)!.size>1)wire.returnLane=r.kind==='business-exception'?1:0;
 });
 const below=new Map<string,number>(),above=new Map<string,number>(),lastTarget=new Map<string,number>();
 for(const {relation:r,index:i}of unique.values())if(!wires[i].returning){
  lastTarget.set(r.from,Math.max(lastTarget.get(r.from)??-1,rowIndex.get(r.to)!));
  if(r.kind==='input')below.set(r.from,(below.get(r.from)??0)+1);
  if(r.kind==='output')above.set(r.to,(above.get(r.to)??0)+1);
 }
 const cells:Record<string,Point>=Object.create(null),positions:Record<string,Point>=Object.create(null);
 const corridors=new Heap<{column:number;until:number}>((a,b)=>a.column>b.column);
 let previousActivityColumn=-1,row=0;
 for(const [i,n]of nodes.entries()){
  const previous=nodes[i-1];if(previous)row+=Math.max(1,Math.ceil((68+4+22*((below.get(previous.id)??0)+(above.get(n.id)??0)))/96));
  let column=n.type==='business'?previousActivityColumn+1:owner.has(n.id)?cells[owner.get(n.id)!][0]+1:0;
  while(corridors.peek()&&corridors.peek().until<i)corridors.pop();
  if(corridors.peek())column=Math.max(column,corridors.peek().column);
  cells[n.id]=[column,row];if(n.type==='business')previousActivityColumn=column;
  if(lastTarget.has(n.id))corridors.push({column:column+1,until:lastTarget.get(n.id)!});
 }
 for(const [id,[column,line]]of Object.entries(cells))positions[id]=[40+64*column,40+96*line];
 return {positions,cells,wires,forwardRelations:analysis.forwardRelations,feedbackRelations:analysis.feedbackRelations,exceptionRelations:analysis.exceptionRelations};
}
