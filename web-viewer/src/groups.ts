import type {Design,GraphNode,Relation} from './graph';
export type Group={name:string;activities:string[]};
/** Display-only IDs cannot collide with source node IDs. */
export function groupID(design:Design,name:string){let id='Group: '+name;while(design.graph.nodes.some(n=>n.id===id))id=':'+id;return id;}
export function parseGroups(markdown:string,design:Design):Group[]{
 const lines=markdown.split(/\r\n|[\n\r\v\f\u001c-\u001e\u0085\u2028\u2029]/),marks:{i:number;h:string}[]=[];let fence='';
 lines.forEach((line,i)=>{const m=/^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);if(m){if(!fence)fence=m[1];else if(m[1][0]===fence[0]&&m[1].length>=fence.length&&!m[2].trim())fence='';return;}if(!fence&&/^#{1,6} /.test(line))marks.push({i,h:line});});
 const end=marks.filter(m=>m.h.startsWith('# '))[1]?.i??lines.length;
 const seconds=marks.filter(m=>m.i<end&&m.h.startsWith('## ')),sections=seconds.filter(m=>m.h==='## Groups');
 const require=(ok:unknown,message:string)=>{if(!ok)throw Error(message);};
 require(sections.length<=1,'Duplicate Groups section');if(!sections.length)return [];
 const first=sections[0].i+1,last=seconds.find(m=>m.i>=first)?.i??end;
 const members=marks.filter(m=>m.i>=first&&m.i<last&&m.h.startsWith('###'));
 require(members.length&&!lines.slice(first,members[0]?.i).join('\n').trim(),'Groups require Group headings');
 const visible=(s:string)=>!!s&&s===s.trim()&&![' — ',' → ','<!--'].some(t=>s.includes(t));
 const names=new Set<string>(),assigned=new Set<string>();
 return members.map((m,index)=>{
  const match=/^### Group (\S.*)$/.exec(m.h);require(match,'Invalid Group heading: '+m.h);const name=match![1];require(visible(name)&&!names.has(name),'Invalid or duplicate Group name: '+name);names.add(name);
  const activities:string[]=[];
  for(const line of lines.slice(m.i+1,members[index+1]?.i??last)){if(!line.trim())continue;const ref=/^- Activity (\S.*)$/.exec(line);require(ref,'Invalid Group member: '+line);const id=ref![1];require(visible(id)&&design.graph.nodes.some(n=>n.id===id&&n.type==='business'),'Unknown Group Activity: '+id);require(!assigned.has(id),'Activity in multiple Groups: '+id);assigned.add(id);activities.push(id);}
  require(activities.length,'Group requires an Activity: '+name);return {name,activities};
 });
}
const projections=new WeakMap<Design,Map<string|undefined,Design>>();
/** Project existing relations through explicit membership; never infer an I/O. */
export function groupDesign(design:Design,group?:string):Design{
 const groups=parseGroups(design.markdown,design);if(!groups.length)return design;let cached=projections.get(design);if(!cached){cached=new Map();projections.set(design,cached);}const found=cached.get(group);if(found)return found;
 let nodes:GraphNode[],relations:Relation[];
 if(group!==undefined){
  const selected=groups.find(g=>g.name===group);if(!selected)throw Error('Unknown Group: '+group);
  const activities=new Set(selected.activities),objects=new Set(design.graph.relations.filter(r=>(r.kind==='input'&&activities.has(r.to))||(r.kind==='output'&&activities.has(r.from))).map(r=>r.kind==='input'?r.from:r.to));
  nodes=design.graph.nodes.filter(n=>activities.has(n.id)||objects.has(n.id));const ids=new Set(nodes.map(n=>n.id));relations=design.graph.relations.filter(r=>ids.has(r.from)&&ids.has(r.to));
 }else{
  const membership=new Map(groups.flatMap(g=>g.activities.map(a=>[a,groupID(design,g.name)] as const)));
  nodes=[...design.graph.nodes.filter(n=>!membership.has(n.id)),...groups.map(g=>({id:groupID(design,g.name),name:g.name,type:'business' as const,scope:g.activities.some(a=>design.graph.nodes.find(n=>n.id===a)!.scope),who:'Group',group:g.name}))];
  const seen=new Set<string>();relations=design.graph.relations.map(r=>({...r,from:membership.get(r.from)??r.from,to:membership.get(r.to)??r.to})).filter(r=>{const k=JSON.stringify(r);if(seen.has(k))return false;seen.add(k);return true;});
 }
 const visible=new Set(nodes.map(n=>n.id)),order=design.activityOrder??design.graph.nodes.filter(n=>n.type==='business').map(n=>n.id);
 const activityOrder=[...new Set(order.map(id=>{const owner=group===undefined?groups.find(g=>g.activities.includes(id)):undefined;return owner?groupID(design,owner.name):id;}))].filter(id=>visible.has(id));
 const result={...design,graph:{...design.graph,nodes,relations},activityOrder};cached.set(group,result);return result;
}
/** Boundary notes name the original endpoints without expanding other Activities. */
export function boundaryRelations(design:Design,group:string){
 const shown=new Set(groupDesign(design,group).graph.nodes.map(n=>n.id));
 return design.graph.relations.filter(r=>shown.has(r.from)!==shown.has(r.to));
}
