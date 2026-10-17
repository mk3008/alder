import type {Graph} from './graph';
import type {Point} from './session';
export type MatrixWire={returning:boolean;captionLane:number};
export type MatrixPlan={positions:Record<string,Point>;cells:Record<string,Point>;wires:MatrixWire[]};
/** Experimental overview planner. Logical cells and direction contracts are
 * settled before plotting. No IDs or document-specific coordinates are used. */
export function matrixPlan(graph:Graph,hint?:readonly string[]):MatrixPlan{
 const activities=graph.nodes.filter(n=>n.type==='business').map(n=>n.id);
 const listed=(hint??[]).filter(id=>activities.includes(id));
 const order=[...new Set([...listed,...activities.slice().sort()])];
 const rank=new Map(order.map((id,i)=>[id,i]));
 const phase=new Map(order.map((id,i)=>[id,2*i]));
 const owner=new Map<string,string>();
 const normal=graph.relations.filter(r=>r.kind==='input'||r.kind==='output');
 for(const n of graph.nodes.filter(n=>n.type==='object')){
  const writers=normal.filter(r=>r.kind==='output'&&r.to===n.id&&rank.has(r.from)).map(r=>r.from).sort((a,b)=>rank.get(a)!-rank.get(b)!);
  const readers=normal.filter(r=>r.kind==='input'&&r.from===n.id&&rank.has(r.to)).map(r=>r.to).sort((a,b)=>rank.get(a)!-rank.get(b)!);
  if(writers.length){owner.set(n.id,writers[0]);phase.set(n.id,2*rank.get(writers[0])!+1);}
  else phase.set(n.id,readers.length?2*rank.get(readers[0])!-1:2*order.length+1);
 }
 // Activity anchors precede Object insertion. Each peer occupies its own row;
 // shared sources are inserted before the earliest reader, single sources
 // immediately before their reader, and outputs immediately after their owner.
 const nodes=graph.nodes.slice().sort((a,b)=>phase.get(a.id)!-phase.get(b.id)!||normal.filter(r=>r.from===b.id).length-normal.filter(r=>r.from===a.id).length||a.id.localeCompare(b.id,'en'));
 const rowIndex=new Map(nodes.map((n,i)=>[n.id,i]));
 const lanes=new Map<string,number>();
 const wires=graph.relations.map(r=>{
  const returning=r.kind.endsWith('exception')||!rowIndex.has(r.from)||!rowIndex.has(r.to)||rowIndex.get(r.from)!>=rowIndex.get(r.to)!;
  const key=(returning?'return:':r.kind+':')+(r.kind==='output'&&!returning?r.to:r.from),captionLane=lanes.get(key)??0;lanes.set(key,captionLane+1);
  return {returning,captionLane};
 });
 const forward=graph.relations.flatMap((r,i)=>!wires[i].returning?[r]:[]);
 const cells:Record<string,Point>=Object.create(null),positions:Record<string,Point>=Object.create(null);
 let previousActivityColumn=-1,row=0;
 for(const [i,n]of nodes.entries()){
  const previous=nodes[i-1];
  if(previous){
   const below=graph.relations.filter((r,j)=>!wires[j].returning&&r.kind==='input'&&r.from===previous.id).length;
   const above=graph.relations.filter((r,j)=>!wires[j].returning&&r.kind==='output'&&r.to===n.id).length;
   // Insert rows for fixed caption bands, rather than displacing captions.
   row+=Math.max(1,Math.ceil((68+4+22*(below+above))/96));
  }
  let column=n.type==='business'?previousActivityColumn+1:owner.has(n.id)?cells[owner.get(n.id)!][0]+1:0;
  // Every still-open L has a vertical corridor below its source. Insert a
  // column before this card whenever that corridor would pass through it.
  // This reservation covers the entire interval, not only the target pair.
  for(const r of forward){const a=rowIndex.get(r.from)!,b=rowIndex.get(r.to)!;if(a<i&&b>=i)column=Math.max(column,cells[r.from][0]+1);}
  cells[n.id]=[column,row];if(n.type==='business')previousActivityColumn=column;
 }
 // Pixel coordinates are only a projection of the completed logical matrix.
 for(const [id,[column,line]]of Object.entries(cells))positions[id]=[40+64*column,40+96*line];
 return {positions,cells,wires};
}
