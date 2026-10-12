import type {Graph} from './graph';
import type {Point} from './session';
const STEP_X=360, STEP_Y=180, MARGIN=40, ORDER_PASSES=4;
export type LayoutPlan={positions:Record<string,Point>;forwardRelations:number[];feedbackRelations:number[];exceptionRelations:number[]};
const compare=(a:string,b:string)=>a<b?-1:a>b?1:0;

/**
 * Initial layout only: directed layers extend right without wrapping or fitting
 * a viewport. Saved positions remain the responsibility of reconcile.
 * Normal edges between strongly connected components always stay forward.
 * Inside a cycle, document Activity order (stable ID order without a valid hint)
 * and each Object's earliest-listed output Activity choose a display ordering.
 * This breaks layout cycles; it neither defines execution order nor edits edges.
 * O(V log V + E + ORDER_PASSES * (V log V + E)), with iterative graph walks.
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
  nodes.forEach((n,i)=>positions[n.id]=[MARGIN+rank[i]*STEP_X,MARGIN+row[i]*STEP_Y]);
  return {positions,forwardRelations,feedbackRelations,exceptionRelations};
}
export function initialPositions(graph:Graph,activityOrder?:readonly string[]):Record<string,Point>{return layoutPlan(graph,activityOrder).positions;}
