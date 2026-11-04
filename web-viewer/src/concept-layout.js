import {routeER,sharedRun} from './concept-routing.js';
import {matrixPlan} from './matrix-layout.ts';

// Cache by the actual graph and measured card sizes. Selection redraws the
// same graph frequently; testing compact candidates must not reroute it then.
const layoutCache=new WeakMap();
/** Lay out the selected graph without overview/detail knowledge.
 * Reserve room for both endpoint counts even in a single-relation view.
 */
export function initialConceptPositions(ids,edges,sizes){
 const signature=JSON.stringify([ids.map(id=>[id,sizes.get(id).w,sizes.get(id).h]),edges]);
 let cache=layoutCache.get(sizes);if(!cache){cache=new Map();layoutCache.set(sizes,cache);}
 if(cache.has(signature))return cache.get(signature);
 const graph={version:1,nodes:ids.map(id=>({id,type:'business',name:id,scope:true})),relations:edges.map(([from,to])=>({kind:'input',from,to,label:''}))};
 const plan=matrixPlan(graph,ids),ordered=ids.slice().sort((a,b)=>plan.positions[a][1]-plan.positions[b][1]);
 const ports=Math.max(1,...ids.map(id=>edges.filter(([a,b])=>a===id||b===id).length));
 const widestCount=Math.max(0,...edges.flatMap(([, ,from,to])=>[from.length,to.length]).map(n=>n*8+10));
 const previousStep=Math.max(96,64+36*Math.max(0,ports-1),22+24+widestCount/2+8);
 const firstStep=Math.max(96,Math.ceil(22+24+widestCount/2+8));
 const steps=[firstStep,128,160,192].filter((step,index,all)=>step>=firstStep&&step<previousStep&&all.indexOf(step)===index);steps.push(previousStep);
 const columns=Math.max(0,...ids.map(id=>plan.cells[id][0])),gaps=Array.from({length:columns},()=>previousStep);
 const place=spacing=>{const result={},x=[40];let y=40;for(const gap of spacing)x.push(x.at(-1)+gap);for(const id of ordered){result[id]={x:x[plan.cells[id][0]],y};y+=sizes.get(id).h+44;}return result;};
 const route=positions=>routeER(new Map(ids.map(id=>[id,{...positions[id],...sizes.get(id)}])),edges);
 const aligned=s=>s.a.x===s.b.x||s.a.y===s.b.y;
 const crossing=(a,b)=>{
  const av=a.a.x===a.b.x,bv=b.a.x===b.b.x;if(av===bv)return false;
  const v=av?a:b,h=av?b:a,x=v.a.x,y=h.a.y;
  const within=(n,a,b)=>n>=Math.min(a,b)-0.01&&n<=Math.max(a,b)+0.01;
  return within(x,h.a.x,h.b.x)&&within(y,v.a.y,v.b.y);
 };
 const counts=routing=>{
  let duplicatePorts=0,sharedLines=0,crossings=0;
  for(let i=0;i<routing.routes.length;i++)for(let j=0;j<i;j++){
   const a=routing.routes[i],b=routing.routes[j];
   for(const p of a.ports)for(const q of b.ports)if(p.table===q.table&&p.p.x===q.p.x&&p.p.y===q.p.y)duplicatePorts++;
   for(const p of a.segments)for(const q of b.segments)if(aligned(p)&&aligned(q)){if(sharedRun(p.a,p.b,q.a,q.b))sharedLines++;else if(crossing(p,q))crossings++;}
  }
  return [routing.routes.filter(item=>item.unrouted).length,routing.labels.filter(item=>item.conflict).length,duplicatePorts,sharedLines,crossings];
 };
 const displacement=routing=>new Map(routing.labels.map(label=>{
  const port=routing.routes.find(item=>item.id===label.edge).ports.find(item=>item.table===label.table);
  return [label.edge+':'+label.table,Math.abs(label.x-port.label.x)+Math.abs(label.y-port.label.y)];
 }));
 const original=route(place(gaps)),baseline=counts(original),originalDisplacement=displacement(original);
 let attempts=0;
 // Keep large graphs responsive: untried columns retain their prior spacing.
 outer:for(let column=0;column<gaps.length;column++)for(const step of steps){
  if(attempts++>=48){gaps[column]=previousStep;break outer;}
  gaps[column]=step;
  const routing=route(place(gaps));
  if(counts(routing).every((value,index)=>value<=baseline[index])&&[...displacement(routing)].every(([key,value])=>value<=Math.max(32,originalDisplacement.get(key)??0)))break;
 }
 const positions=place(gaps);
 cache.set(signature,positions);
 return positions;
}

/** B: layout and route only the graph selected upstream by A.
 * No focus, hidden source graph, or overview/detail mode enters this function.
 */
export function conceptDiagram(ids,edges,sizes,overrides=new Map()){
 const initial=initialConceptPositions(ids,edges,sizes);
 const boxes=new Map(ids.map(id=>[id,{...(overrides.get(id)||initial[id]),...sizes.get(id)}]));
 return {boxes,routing:routeER(boxes,edges)};
}
