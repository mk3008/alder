import {routeER,sharedRun,isOneToOne} from './concept-routing.js';

// The grid records every explicit relationship before any pixel placement.
// For a reference the referenced concept precedes the referencing concept;
// for containment the parent precedes the child. Parallel relations remain
// separate entries in a cell rather than becoming a second source of truth.
function stableOrder(ids,pairs){
 const next=new Map(ids.map(id=>[id,new Set()])),indegree=new Map(ids.map(id=>[id,0]));
 for(const [a,b]of pairs)if(a!==b&&next.has(a)&&next.has(b)&&!next.get(a).has(b)){next.get(a).add(b);indegree.set(b,indegree.get(b)+1);}
 const remaining=new Set(ids),order=[];
 while(remaining.size){
  const id=ids.find(id=>remaining.has(id)&&indegree.get(id)===0)??ids.find(id=>remaining.has(id));
  remaining.delete(id);order.push(id);for(const child of next.get(id))indegree.set(child,indegree.get(child)-1);
 }
 return order;
}
// Prefer newly available descendants over unrelated branches. Dependencies
// still take precedence, so a child is never pulled ahead of its prerequisites.
function branchOrder(ids,pairs){
 const next=new Map(ids.map(id=>[id,new Set()])),indegree=new Map(ids.map(id=>[id,0]));
 for(const [a,b]of pairs)if(a!==b&&next.has(a)&&next.has(b)&&!next.get(a).has(b)){next.get(a).add(b);indegree.set(b,indegree.get(b)+1);}
 const remaining=new Set(ids),order=[],ready=ids.filter(id=>indegree.get(id)===0).reverse();
 while(remaining.size){
  let id;
  while(ready.length&&id===undefined){const pick=ready.pop();if(remaining.has(pick))id=pick;}
  id??=ids.find(value=>remaining.has(value));
  remaining.delete(id);order.push(id);
  const newly=[];
  for(const child of next.get(id)){indegree.set(child,indegree.get(child)-1);if(indegree.get(child)===0)newly.push(child);}
  newly.sort((a,b)=>ids.indexOf(b)-ids.indexOf(a));ready.push(...newly);
 }
 return order;
}
function orderStraightGroup(members,directed){
 if(members.length<3)return stableOrder(members,directed.filter(x=>!isOneToOne(x.edge)).map(x=>[x.upper,x.lower]));
 const memberSet=new Set(members),within=directed.filter(x=>memberSet.has(x.upper)&&memberSet.has(x.lower)&&x.upper!==x.lower);
 const constraints=within.filter(x=>!isOneToOne(x.edge)),straight=within.filter(x=>isOneToOne(x.edge));
 let best,bestCost=Infinity,attempts=0;
 function visit(order,remaining){
  if(attempts>=5000||bestCost===0)return;
  if(!remaining.length){attempts++;const positions=new Map(order.map((id,i)=>[id,i]));
   const cost=straight.reduce((sum,x)=>sum+Math.max(0,Math.abs(positions.get(x.upper)-positions.get(x.lower))-1),0);
   if(cost<bestCost){best=[...order];bestCost=cost;}return;
  }
  const ready=remaining.filter(id=>!constraints.some(x=>x.lower===id&&remaining.includes(x.upper)));
  if(!ready.length){attempts++;return;}
  for(const id of ready)visit([...order,id],remaining.filter(value=>value!==id));
 }
 visit([],members);
 return best??stableOrder(members,constraints.map(x=>[x.upper,x.lower]));
}
export function conceptCorrelationGrid(ids,edges,{branchFirst=false}={}){
 const parents=new Map(ids.map(id=>[id,id])),root=id=>{while(parents.get(id)!==id)id=parents.get(id);return id;};
 for(const edge of edges){const [a,b]=edge;if(parents.has(a)&&parents.has(b)&&isOneToOne(edge))parents.set(root(b),root(a));}
 const groupIds=[...new Set(ids.map(root))],groups=new Map(groupIds.map(id=>[id,ids.filter(n=>root(n)===id)]));
 const directed=edges.filter(([a,b])=>parents.has(a)&&parents.has(b)).map(edge=>{const [from,to,,,kind]=edge;return {edge,upper:kind==='reference'?to:from,lower:kind==='reference'?from:to};});
 const groupOrder=(branchFirst?branchOrder:stableOrder)(groupIds,directed.map(({upper,lower})=>[root(upper),root(lower)]));
 const orderedGroups=groupOrder.map(id=>orderStraightGroup(groups.get(id),directed));
 const order=orderedGroups.flat(),levels=new Map(ids.map(id=>[id,0]));
 for(const members of orderedGroups)for(const id of members)for(const item of directed){
  if(item.upper===id&&item.lower!==id&&members.includes(item.lower)&&!isOneToOne(item.edge))levels.set(item.lower,Math.max(levels.get(item.lower),levels.get(id)+1));
 }
 const indices=new Map(order.map((id,i)=>[id,i]));
 const cells=order.map(()=>order.map(()=>[]));
 edges.forEach(([from,to,,,kind],i)=>{
  if(!indices.has(from)||!indices.has(to))return;
  const [upper,lower]=kind==='reference'?[to,from]:[from,to];
  cells[indices.get(upper)][indices.get(lower)].push(i);
 });
 return {order,cells,groups:orderedGroups,levels};
}

const layoutCache=new WeakMap();
function routeScore(routing){
 let shared=0,crossings=0;
 for(let i=0;i<routing.routes.length;i++)for(let j=0;j<i;j++){
  for(const p of routing.routes[i].ports)for(const q of routing.routes[j].ports)
   if(p.table===q.table&&p.p.x===q.p.x&&p.p.y===q.p.y)shared++;
  for(const p of routing.routes[i].segments)for(const q of routing.routes[j].segments){
   if(sharedRun(p.a,p.b,q.a,q.b)){shared++;continue;}
   const pv=p.a.x===p.b.x,qv=q.a.x===q.b.x;if(pv===qv)continue;
   const v=pv?p:q,h=pv?q:p,x=v.a.x,y=h.a.y;
   if(x>Math.min(h.a.x,h.b.x)&&x<Math.max(h.a.x,h.b.x)&&y>Math.min(v.a.y,v.b.y)&&y<Math.max(v.a.y,v.b.y))crossings++;
  }
 }
 return [routing.routes.filter(r=>r.unrouted).length,routing.routes.reduce((n,r)=>n+r.shapeObstacles.length,0),routing.labels.filter(l=>l.conflict).length,shared,crossings];
}
const better=(a,b)=>a.some((v,i)=>v!==b[i]&&v<b[i]&&a.slice(0,i).every((n,j)=>n===b[j]));

/** Place the ordered matrix in a compact staircase before projecting wires. */
export function initialConceptPositions(ids,edges,sizes){
 const signature=JSON.stringify([ids.map(id=>[id,sizes.get(id).w,sizes.get(id).h]),edges]);
 let cache=layoutCache.get(sizes);if(!cache){cache=new Map();layoutCache.set(sizes,cache);}
 if(cache.has(signature))return cache.get(signature);
 const candidate=({order,groups,levels})=>{
 const membership=new Map(groups.flatMap((group,i)=>group.map(id=>[id,i])));
 const minimum=order.slice(1).map((id,i)=>membership.get(id)===membership.get(order[i])?sizes.get(order[i]).w+140:72);
 const stagger=groups.map((group,i)=>{
  let distance=120;
  for(const edge of edges){const [a,b]=edge;if(!isOneToOne(edge)||membership.get(a)!==i||membership.get(b)!==i)continue;
   const delta=Math.abs(levels.get(a)-levels.get(b));if(!delta)continue;
   const upper=levels.get(a)<levels.get(b)?a:b;distance=Math.min(distance,Math.floor((sizes.get(upper).h-28)/delta));
  }
  return Math.max(0,distance);
 });
 const place=gaps=>{
  const positions={};let x=40,y=40,column=0;
  for(const [i,group]of groups.entries()){let bottom=y;
   for(const id of group){if(column)x+=gaps[column-1];const top=y+levels.get(id)*stagger[i];positions[id]={x,y:top};bottom=Math.max(bottom,top+sizes.get(id).h);column++;}
   y=bottom+44;
  }
  return positions;
 };
 const score=gaps=>{const positions=place(gaps),boxes=new Map(ids.map(id=>[id,{...positions[id],...sizes.get(id)}]));return routeScore(routeER(boxes,edges));};
 let bestGaps,bestScore;
 for(const step of [72,96,128,160,192,240,300,384]){
  const gaps=minimum.map(gap=>Math.max(gap,step)),candidate=score(gaps);
  if(!bestGaps||better(candidate,bestScore)){bestGaps=gaps;bestScore=candidate;}
  if(candidate.every(value=>value===0))break;
 }
 // Compact each column without introducing a missing line, a label conflict,
 // an overlapping line, or more crossings than the safe initial placement.
 let attempts=0;
 // A dense complete overview can have dozens of relationships. Bound the
 // improvement search so displaying all concepts does not stall the canvas.
 const attemptLimit=ids.length>20&&edges.length>40?8:42;
 for(let column=0;column<bestGaps.length&&attempts<attemptLimit;column++)for(const gap of [72,96,128,160,192]){
  if(gap<minimum[column]||gap>=bestGaps[column]||attempts++>=attemptLimit)continue;
  const trial=bestGaps.slice();trial[column]=gap;const candidate=score(trial);
  if(candidate.every((value,i)=>value<=bestScore[i])){bestGaps=trial;bestScore=candidate;break;}
 }
 return {positions:place(bestGaps),score:bestScore};
 };
 const grid=conceptCorrelationGrid(ids,edges),baseline=candidate(grid);
 let best=baseline;
 // Keep the established placement if it has no crossings. Otherwise try a
 // branch-first order and accept it only when no routing guarantee worsens.
 if(baseline.score[4]>0){
  const alternate=conceptCorrelationGrid(ids,edges,{branchFirst:true});
  if(alternate.order.some((id,i)=>id!==grid.order[i])){
   const trial=candidate(alternate);
   if(trial.score.every((value,i)=>value<=baseline.score[i])&&better(trial.score,baseline.score))best=trial;
  }
 }
 cache.set(signature,best.positions);return best.positions;
}

/** Layout and route only the graph selected upstream, including saved positions. */
export function conceptDiagram(ids,edges,sizes,overrides=new Map()){
 const initial=initialConceptPositions(ids,edges,sizes);
 const boxes=new Map(ids.map(id=>[id,{...(overrides.get(id)||initial[id]),...sizes.get(id)}]));
 return {boxes,routing:routeER(boxes,edges)};
}
