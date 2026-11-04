import {routeER,sharedRun} from './concept-routing.js';

// The grid records every explicit relationship before any pixel placement.
// For a reference the referenced concept precedes the referencing concept;
// for containment the parent precedes the child. Parallel relations remain
// separate entries in a cell rather than becoming a second source of truth.
export function conceptCorrelationGrid(ids,edges){
 const active=new Set(ids),next=new Map(ids.map(id=>[id,new Set()])),indegree=new Map(ids.map(id=>[id,0]));
 for(const [from,to,,,kind]of edges){
  if(!active.has(from)||!active.has(to))continue;
  const [upper,lower]=kind==='reference'?[to,from]:[from,to];
  if(!next.get(upper).has(lower)){next.get(upper).add(lower);indegree.set(lower,indegree.get(lower)+1);}
 }
 const remaining=new Set(ids),order=[];
 while(remaining.size){
  // A cycle has no perfect placement. Keep all its cards and relations so
  // routing can report precisely which ones cannot satisfy the rule.
  const id=ids.find(id=>remaining.has(id)&&indegree.get(id)===0)??ids.find(id=>remaining.has(id));
  remaining.delete(id);order.push(id);
  for(const child of next.get(id))indegree.set(child,indegree.get(child)-1);
 }
 const indices=new Map(order.map((id,i)=>[id,i]));
 const cells=order.map(()=>order.map(()=>[]));
 edges.forEach(([from,to,,,kind],i)=>{
  if(!indices.has(from)||!indices.has(to))return;
  const [upper,lower]=kind==='reference'?[to,from]:[from,to];
  cells[indices.get(upper)][indices.get(lower)].push(i);
 });
 return {order,cells};
}

const layoutCache=new WeakMap();
function routeScore(routing){
 let shared=0,crossings=0;
 for(let i=0;i<routing.routes.length;i++)for(let j=0;j<i;j++){
  for(const p of routing.routes[i].segments)for(const q of routing.routes[j].segments){
   if(sharedRun(p.a,p.b,q.a,q.b)){shared++;continue;}
   const pv=p.a.x===p.b.x,qv=q.a.x===q.b.x;if(pv===qv)continue;
   const v=pv?p:q,h=pv?q:p,x=v.a.x,y=h.a.y;
   if(x>Math.min(h.a.x,h.b.x)&&x<Math.max(h.a.x,h.b.x)&&y>Math.min(v.a.y,v.b.y)&&y<Math.max(v.a.y,v.b.y))crossings++;
  }
 }
 return [routing.routes.filter(r=>r.unrouted).length,routing.labels.filter(l=>l.conflict).length,shared,crossings];
}
const better=(a,b)=>a.some((v,i)=>v!==b[i]&&v<b[i]&&a.slice(0,i).every((n,j)=>n===b[j]));

/** Place the ordered matrix in a compact staircase before projecting wires. */
export function initialConceptPositions(ids,edges,sizes){
 const signature=JSON.stringify([ids.map(id=>[id,sizes.get(id).w,sizes.get(id).h]),edges]);
 let cache=layoutCache.get(sizes);if(!cache){cache=new Map();layoutCache.set(sizes,cache);}
 if(cache.has(signature))return cache.get(signature);
 const {order}=conceptCorrelationGrid(ids,edges);
 const place=gaps=>{
  const positions={};let x=40,y=40;
  for(const [column,id]of order.entries()){if(column)x+=gaps[column-1];positions[id]={x,y};y+=sizes.get(id).h+44;}
  return positions;
 };
 const score=gaps=>{const positions=place(gaps),boxes=new Map(ids.map(id=>[id,{...positions[id],...sizes.get(id)}]));return routeScore(routeER(boxes,edges));};
 let bestGaps,bestScore;
 for(const step of [72,96,128,160,192,240,300,384]){
  const gaps=Array(Math.max(0,order.length-1)).fill(step),candidate=score(gaps);
  if(!bestGaps||better(candidate,bestScore)){bestGaps=gaps;bestScore=candidate;}
  if(candidate.every(value=>value===0))break;
 }
 // Compact each column without introducing a missing line, a label conflict,
 // an overlapping line, or more crossings than the safe initial placement.
 let attempts=0;
 for(let column=0;column<bestGaps.length&&attempts<42;column++)for(const gap of [72,96,128,160,192]){
  if(gap>=bestGaps[column]||attempts++>=42)continue;
  const trial=bestGaps.slice();trial[column]=gap;const candidate=score(trial);
  if(candidate.every((value,i)=>value<=bestScore[i])){bestGaps=trial;bestScore=candidate;break;}
 }
 const best=place(bestGaps);cache.set(signature,best);return best;
}

/** Layout and route only the graph selected upstream, including saved positions. */
export function conceptDiagram(ids,edges,sizes,overrides=new Map()){
 const initial=initialConceptPositions(ids,edges,sizes);
 const boxes=new Map(ids.map(id=>[id,{...(overrides.get(id)||initial[id]),...sizes.get(id)}]));
 return {boxes,routing:routeER(boxes,edges)};
}
