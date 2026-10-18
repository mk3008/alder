import {dependencyOrder} from './layout-order.ts';
import {matrixPlan,isMatrixGraph} from './matrix-layout.ts';
import type {Graph} from './graph';
import type {Point} from './session';
const STEP_X=64, STEP_Y=96, CARD_WIDTH=260, MARGIN=40, ORDER_PASSES=4;
export type LayoutPlan={positions:Record<string,Point>;forwardRelations:number[];feedbackRelations:number[];exceptionRelations:number[]};

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
export function layoutPlan(graph:Graph,activityOrder?:readonly string[],stairSources=true):LayoutPlan{
  const {nodes,previous,children,parents,forwardRelations,feedbackRelations,exceptionRelations}=dependencyOrder(graph,activityOrder),count=nodes.length;
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
  // Source-only Object peers need distinct left/up steps: a vertical outlet
  // from one must not run through the next peer's card. Expand only this
  // root cohort; later dependency columns and output peers keep their ranks.
  const sources=layers[0].filter(n=>nodes[n].type==='object'&&previous[n].length===0&&children[n].length>0);
  if(stairSources&&sources.length>1){
    const sourceSet=new Set(sources),others=layers[0].filter(n=>!sourceSet.has(n));
    layers.splice(0,1,...sources.map((n,i)=>i===0?[...others,n]:[n]));
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
/** Alder overview and one-hop detail use the same matrix planner.
 * The generic DAG fallback remains for non-Alder/imported graphs only.
 * Retained/manual coordinates are never migrated by this initial/reset plan.
 */
export function initialPositions(graph:Graph,activityOrder?:readonly string[],activity?:string):Record<string,Point>{
  return isMatrixGraph(graph)?matrixPlan(graph,activityOrder,activity).positions:layoutPlan(graph,activityOrder).positions;
}
