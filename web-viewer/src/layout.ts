import type {Graph} from './graph';
import type {Point} from './session';
const STEP_X=64, STEP_Y=96, CARD_WIDTH=260, MARGIN=40, ORDER_PASSES=4;
export type LayoutPlan={positions:Record<string,Point>;forwardRelations:number[];feedbackRelations:number[];exceptionRelations:number[]};
const compare=(a:string,b:string)=>a<b?-1:a>b?1:0;

/**
 * Initial layout only: directed layers extend right without wrapping or fitting
 * a viewport. Saved positions remain the responsibility of reconcile.
 * Normal edges between strongly connected components always stay forward.
 * Inside a cycle, document Activity order (stable ID order without a valid hint)
 * and each Object's earliest-listed output Activity choose a display ordering.
 * This breaks layout cycles; it neither defines execution order nor edits edges.
 * Ranks and crossing-reduced row order form a downward staircase. A forward
 * parent is at least one 96-unit step above its child. Compact 64-unit columns
 * overlap the 260-unit card width, so every horizontally overlapping column
 * participates in placement with a 28-unit vertical gap between cards.
 * Graph walks and occupied-slot lookup are iterative, including long chains.
 */
export function layoutPlan(graph:Graph,activityOrder?:readonly string[]):LayoutPlan{
  const nodes=[...graph.nodes].sort((a,b)=>compare(a.id,b.id)),count=nodes.length;
  const index=new Map(nodes.map((n,i)=>[n.id,i])),out=nodes.map(()=>new Set<number>()),incoming=nodes.map(()=>new Set<number>());
  const edges=graph.relations.map((r,i)=>({i,r,a:index.get(r.from),b:index.get(r.to)}));
  for(const {r,a,b} of edges)if(a!==undefined&&b!==undefined&&(r.kind==='input'||r.kind==='output')){out[a].add(b);incoming[b].add(a);}
  const next=out.map(s=>[...s].sort((a,b)=>a-b)),previous=incoming.map(s=>[...s].sort((a,b)=>a-b));
  // Iterative Kosaraju: long chains must not exhaust the JavaScript call stack.
  const seen=new Set<number>(),finish:number[]=[];
  for(let root=0;root<count;root++){
    if(seen.has(root))continue;
    const stack:[number,number][]=[[root,0]];seen.add(root);
    while(stack.length){const frame=stack[stack.length-1],n=frame[0];
      if(frame[1]<next[n].length){const other=next[n][frame[1]++];if(!seen.has(other)){seen.add(other);stack.push([other,0]);}}
      else{stack.pop();finish.push(n);}
    }
  }
  const component=nodes.map(()=>-1);let components=0;
  for(const root of finish.reverse())if(component[root]<0){
    const stack=[root];component[root]=components;
    while(stack.length){const n=stack.pop()!;for(const other of previous[n])if(component[other]<0){component[other]=components;stack.push(other);}}
    components++;
  }
  const activities=nodes.filter(n=>n.type==='business'),hint=new Map(Array.isArray(activityOrder)?activityOrder.map((id,i)=>[id,i]):[]);
  const validHint=hint.size>0&&hint.size===activityOrder?.length&&hint.size===activities.length&&activities.every(n=>hint.has(n.id));
  const activityRank=new Map(activities.map((n,i)=>[n.id,validHint?hint.get(n.id)!:i]));
  const cycleOrder=nodes.map(n=>n.type==='business'?2*activityRank.get(n.id)!:Infinity);
  for(const {r,a,b} of edges)if(r.kind==='output'&&a!==undefined&&b!==undefined&&component[a]===component[b]){
    const writer=activityRank.get(nodes[a].id);if(writer!==undefined)cycleOrder[b]=Math.min(cycleOrder[b],2*writer+1);
  }
  const forwardRelations:number[]=[],feedbackRelations:number[]=[],exceptionRelations:number[]=[];
  const forward=nodes.map(()=>new Set<number>()),back=nodes.map(()=>new Set<number>());
  for(const {i,r,a,b} of edges){
    if(r.kind!=='input'&&r.kind!=='output'){exceptionRelations.push(i);continue;}
    if(a===undefined||b===undefined)continue;
    if(component[a]===component[b]&&cycleOrder[a]>=cycleOrder[b]){feedbackRelations.push(i);continue;}
    forwardRelations.push(i);forward[a].add(b);back[b].add(a);
  }
  const children=forward.map(s=>[...s].sort((a,b)=>a-b)),parents=back.map(s=>[...s].sort((a,b)=>a-b));
  const indegree=parents.map(a=>a.length),rank=nodes.map(()=>0),queue=nodes.flatMap((_,i)=>indegree[i]===0?[i]:[]);
  for(let q=0;q<queue.length;q++)for(const other of children[queue[q]]){rank[other]=Math.max(rank[other],rank[queue[q]]+1);if(--indegree[other]===0)queue.push(other);}
  const layers:number[][]=Array.from({length:rank.reduce((max,r)=>Math.max(max,r),0)+1},()=>[]);
  nodes.forEach((_,i)=>layers[rank[i]].push(i));
  const row=nodes.map(()=>0);const update=(layer:number[])=>layer.forEach((n,i)=>row[n]=i);layers.forEach(update);
  // Crossing reduction is restricted to vertical order; it cannot reverse flow.
  for(let pass=0;pass<ORDER_PASSES;pass++){
    const scan=pass%2?[...layers].reverse():layers;
    for(const layer of scan){
      const barycenter=new Map(layer.map(n=>{const linked=pass%2?children[n]:parents[n];return [n,linked.length?linked.reduce((sum,other)=>sum+row[other],0)/linked.length:row[n]];}));
      layer.sort((a,b)=>barycenter.get(a)!-barycenter.get(b)!||a-b);update(layer);
    }
  }
  const positions:Record<string,Point>=Object.create(null);
  const slot=nodes.map(()=>0),recentSlots:number[][]=[];
  const overlappingColumns=Math.ceil(CARD_WIDTH/STEP_X)-1;
  for(let column=0;column<layers.length;column++){
    // All y coordinates are on a 96-unit grid: a card plus its 28-unit gap
    // blocks exactly its own slot. Retain every earlier column whose cards
    // still overlap horizontally. Successor links skip occupied runs without
    // repeatedly scanning all cards (including wide isolated-node layers).
    const occupied=new Map<number,number>();
    for(const slots of recentSlots)for(const y of slots)occupied.set(y,y+1);
    const firstFree=(start:number)=>{
      let free=start;
      while(occupied.has(free))free=occupied.get(free)!;
      let current=start;
      while(occupied.has(current)){const next=occupied.get(current)!;occupied.set(current,free);current=next;}
      return free;
    };
    const currentSlots:number[]=[];
    for(const n of layers[column]){
      let earliest=column;
      for(const parent of parents[n])earliest=Math.max(earliest,slot[parent]+1);
      const y=firstFree(earliest);slot[n]=y;occupied.set(y,y+1);currentSlots.push(y);
      positions[nodes[n].id]=[MARGIN+column*STEP_X,MARGIN+y*STEP_Y];
    }
    recentSlots.push(currentSlots);
    if(recentSlots.length>overlappingColumns)recentSlots.shift();
  }
  return {positions,forwardRelations,feedbackRelations,exceptionRelations};
}
/** One-hop Activity views put upstream peers on successive staircase steps.
 * This is an initial/reset plan, never a migration of retained coordinates.
 * Stable source order comes from the same dependency/cycle plan as overview.
 */
export function initialPositions(graph:Graph,activityOrder?:readonly string[],activity?:string):Record<string,Point>{
  const plan=layoutPlan(graph,activityOrder);
  if(activity===undefined||!graph.nodes.some(n=>n.id===activity&&n.type==='business'))return plan.positions;
  const downstream=new Set(graph.relations.filter(r=>r.from===activity&&r.kind==='output').map(r=>r.to));
  const ordered=Object.keys(plan.positions).sort((a,b)=>plan.positions[a][1]-plan.positions[b][1]||compare(a,b));
  const upstream=ordered.filter(id=>id!==activity&&!downstream.has(id)),after=ordered.filter(id=>downstream.has(id));
  const positions:Record<string,Point>=Object.create(null);
  const detailStepX=STEP_X;
  upstream.forEach((id,i)=>positions[id]=[MARGIN+i*detailStepX,MARGIN+i*STEP_Y]);
  const step=upstream.length;positions[activity]=[MARGIN+step*detailStepX,MARGIN+step*STEP_Y];
  after.forEach((id,i)=>positions[id]=[MARGIN+(step+1)*detailStepX,MARGIN+(step+i+1)*STEP_Y]);
  return positions;
}
