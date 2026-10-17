import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {parseDesign} from '../src/graph.ts';
import {initialPositions} from '../src/layout.ts';
import {reconcile} from '../src/session.ts';
import {hiddenReadIndexes} from '../src/edge-visibility.ts';
import {RouteCache} from '../src/route-cache.ts';
import {routeEdge,routeCollisionCount} from '../src/routing.ts';

// Optional frozen router from immediately before this change. Existing routing
// comparison scripts use older baselines, so keep this input separate.
const baselinePath=process.env.RETURN_ROUTING_BASELINE_PATH;
const baseline=baselinePath?(await import(pathToFileURL(baselinePath).href)).routeEdge:undefined;
const rect=(id,x,y,width=260,height=68)=>({id,x,y,width,height});
const width=edge=>Math.max(30,edge.label.length*12);
const length=route=>route.points.slice(1).reduce((sum,p,i)=>sum+Math.hypot(p[0]-route.points[i][0],p[1]-route.points[i][1]),0);
const round=value=>+value.toFixed(3);
const side=(p,n)=>p[0]===n.x?'left':p[0]===n.x+n.width?'right':p[1]===n.y?'top':p[1]===n.y+n.height?'bottom':undefined;
const returning=(s,t)=>t.y+t.height<=s.y||(t.x+t.width/2<s.x+s.width/2&&t.y+t.height/2<=s.y+s.height/2)||s===t;
const overlap=(a,b)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
const crosses=(a,b,c,d)=>{
  const orientation=(p,q,r)=>(q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]);
  return orientation(a,b,c)*orientation(a,b,d)<-1e-6&&orientation(c,d,a)*orientation(c,d,b)<-1e-6;
};
function validate(options,route){
  const source=options.nodes.find(n=>n.id===options.from),target=options.nodes.find(n=>n.id===options.to);
  assert.doesNotMatch(route.path,/NaN|Infinity|[CHV]/);assert.ok(route.points.flat().every(Number.isFinite));
  assert.ok(route.points.length<=22);assert.ok(route.label.every(Number.isFinite));
  assert.equal(route.bounds.right,Math.max(...route.points.map(p=>p[0])));
  assert.equal(route.bounds.bottom,Math.max(...route.points.map(p=>p[1])));
  for(const [p,next,node] of [[route.points[0],route.points[1],source],[route.points.at(-1),route.points.at(-2),target]]){
    const face=side(p,node);assert.ok(face);
    const normal={left:[-1,0],right:[1,0],top:[0,-1],bottom:[0,1]}[face],delta=[next[0]-p[0],next[1]-p[1]];
    assert.equal(delta[0]*normal[1]-delta[1]*normal[0],0);assert.ok(delta[0]*normal[0]+delta[1]*normal[1]>0);
  }
  // Independently check the actual Q curve at 64 subdivisions per corner.
  const dense=[];let current;
  for(const match of route.path.matchAll(/([MLQ])([^MLQ]+)/g)){
    const values=match[2].trim().split(/[ ,]+/).map(Number);
    if(match[1]==='M'||match[1]==='L'){
      if(current)assert.ok(current[0]===values[0]||current[1]===values[1]);
      current=values;dense.push(current);continue;
    }
    const corner=values.slice(0,2),end=values.slice(2),start=current;
    assert.ok((start[0]===corner[0]||start[1]===corner[1])&&(corner[0]===end[0]||corner[1]===end[1]));
    assert.ok(Math.hypot(corner[0]-start[0],corner[1]-start[1])<=8+1e-6);
    for(let step=1;step<=64;step++){const t=step/64,u=1-t;dense.push([u*u*start[0]+2*u*t*corner[0]+t*t*end[0],u*u*start[1]+2*u*t*corner[1]+t*t*end[1]]);}
    current=end;
  }
  if(route.collisions)assert.equal(route.fallback,true);
  else{
    assert.equal(routeCollisionCount(dense,options.nodes.filter(n=>n!==source&&n!==target),14),0);
    assert.equal(routeCollisionCount(dense,source===target?[source]:[source,target],-.1),0);
  }
}
const modes={all63:{},writePreferred53:{preferWrite:true},screenshot16:{hideOutside:true,hideExceptions:true},scopeWritePreferred13:{hideOutside:true,hideExceptions:true,preferWrite:true}};
function visibleIndexes(nodes,edges,mode){
  const ids=new Set(nodes.filter(n=>!mode.hideOutside||n.scope!==false).map(n=>n.id)),hidden=hiddenReadIndexes(edges,mode.preferWrite===true);
  return edges.flatMap((edge,index)=>ids.has(edge.from)&&ids.has(edge.to)&&!hidden.has(index)&&(!mode.hideExceptions||!edge.kind.endsWith('exception'))?[index]:[]);
}
function measure(nodes,edges,routes,mode){
  const indexes=visibleIndexes(nodes,edges,mode),shown=indexes.map(i=>routes[i]);
  const labels=indexes.map(i=>({x:routes[i].label[0]-width(edges[i])/2,y:routes[i].label[1]-9,width:width(edges[i]),height:18}));
  let crossings=0,crossingPairs=0;
  for(let i=0;i<indexes.length;i++)for(let j=i+1;j<indexes.length;j++){
    const a=edges[indexes[i]],b=edges[indexes[j]];if([a.from,a.to].some(id=>id===b.from||id===b.to))continue;
    let count=0;for(let p=1;p<shown[i].points.length;p++)for(let q=1;q<shown[j].points.length;q++)count+=crosses(shown[i].points[p-1],shown[i].points[p],shown[j].points[q-1],shown[j].points[q]);
    crossings+=count;crossingPairs+=count>0;
  }
  const forward={count:0,left:0,verticalDeparture:0};
  for(const i of indexes){const source=nodes.find(n=>n.id===edges[i].from),target=nodes.find(n=>n.id===edges[i].to);if(!returning(source,target)){forward.count++;forward.left+=side(routes[i].points.at(-1),target)==='left';forward.verticalDeparture+=['top','bottom'].includes(side(routes[i].points[0],source));}}
  const bounds=rs=>({left:Math.min(...rs.flatMap(r=>r.points.map(p=>p[0]))),top:Math.min(...rs.flatMap(r=>r.points.map(p=>p[1]))),right:Math.max(...rs.map(r=>r.bounds.right)),bottom:Math.max(...rs.map(r=>r.bounds.bottom))});
  return {nodes:nodes.length,visibleNodes:nodes.filter(n=>!mode.hideOutside||n.scope!==false).length,edges:indexes.length,relationIndexes:indexes,forward,nodeCollisions:shown.reduce((sum,r)=>sum+r.collisions,0),labelNodeOverlaps:labels.reduce((sum,l)=>sum+nodes.filter(n=>overlap(l,n)).length,0),labelLabelOverlaps:labels.reduce((sum,l,i)=>sum+labels.slice(i+1).filter(other=>overlap(l,other)).length,0),fallbacks:shown.filter(r=>r.fallback).length,crossings,crossingPairs,routedLength:round(shown.reduce((sum,r)=>sum+length(r),0)),visibleBounds:bounds(shown),allRouteBounds:bounds(routes)};
}
const sampleText=readFileSync(new URL('../../business-design/alder/README.md',import.meta.url),'utf8');
const design=parseDesign(sampleText),positions=initialPositions(design.graph,design.activityOrder),edges=design.graph.relations;
const legacy=JSON.parse(readFileSync(new URL('./evidence/document-order-20261012/sample-layout.json',import.meta.url),'utf8'));
const saved128=JSON.parse(readFileSync(new URL('./authorities/overview-128-layout.json',import.meta.url),'utf8'));
const samples={};let sampleNodes,sampleRoutes;
for(const [name,savedPositions] of [['publicInitial',positions],['saved128',saved128],['legacySaved',legacy]]){
  const nodes=design.graph.nodes.map(n=>({...rect(n.id,...savedPositions[n.id]),scope:n.scope})),snapshot=JSON.stringify({nodes,savedPositions,design});
  const options=edges.map((edge,index)=>({...edge,nodes,index,labelWidth:width(edge),labelHeight:18}));
  const routes=options.map(o=>routeEdge(o)),previous=baseline&&options.map(o=>baseline(o));
  options.forEach((o,i)=>{validate(o,routes[i]);assert.deepEqual(routeEdge(o),routes[i]);
    if(previous&&!returning(nodes.find(n=>n.id===o.from),nodes.find(n=>n.id===o.to)))assert.deepEqual(routes[i],previous[i],'every forward route remains byte-for-byte unchanged');
  });
  samples[name]={};
  for(const [mode,flags] of Object.entries(modes)){
    const candidate=measure(nodes,edges,routes,flags),before=previous&&measure(nodes,edges,previous,flags);
    assert.equal(candidate.nodeCollisions,0);assert.equal(candidate.labelNodeOverlaps,0);assert.equal(candidate.fallbacks,0);
    assert.equal(candidate.edges,{all63:63,writePreferred53:53,screenshot16:16,scopeWritePreferred13:13}[mode]);
    if(before){assert.deepEqual(candidate.forward,before.forward);assert.ok(candidate.routedLength<=before.routedLength);}
    samples[name][mode]={...(before?{baseline:before}:{}),candidate};
  }
  const saved={key:name,name,design,positions:savedPositions,scroll:[31,72],zoom:.25};
  assert.deepEqual({...reconcile(saved,design).positions},{...savedPositions},'saved positions survive unchanged');
  assert.equal(JSON.stringify({nodes,savedPositions,design}),snapshot,'routing does not mutate graph, coordinates, or order');
  if(name==='saved128'){sampleNodes=nodes;sampleRoutes=routes;}
  if(name==='publicInitial'){const r=routes[41],source=nodes.find(n=>n.id===edges[41].from),target=nodes.find(n=>n.id===edges[41].to);assert.deepEqual(r.points[0],[source.x+260,source.y+34]);assert.deepEqual(r.points.at(-1),[target.x+260,target.y+34]);assert.equal(r.bounds.right,source.x+282);}
}
// The reported line is a real return Read, not a forward route with the wrong
// target port. Assert its source relation on the frozen saved 128-unit overview as well as the new initial layout above.
assert.equal(edges[41].kind,'input');assert.equal(edges[41].from,'業務設計書');assert.equal(edges[41].to,'業務設計');
const affected=sampleRoutes[41];
assert.deepEqual(affected.points[0],[556,554]);assert.deepEqual(affected.points.at(-1),[428,362]);
assert.equal(affected.bounds.right,578);assert.equal(affected.bounds.bottom,554);assert.ok(length(affected)<370);
assert.equal((affected.path.match(/ Q/g)??[]).length,2);
assert.ok(samples.publicInitial.screenshot16.candidate.relationIndexes.includes(41));
assert.ok(!samples.publicInitial.scopeWritePreferred13.candidate.relationIndexes.includes(41));
const affectedBefore=baseline?.({...edges[41],nodes:sampleNodes,index:41,labelWidth:width(edges[41]),labelHeight:18});
if(affectedBefore){assert.equal(affectedBefore.bounds.right,1890);assert.ok(length(affectedBefore)>2900);}
const routeSummary=r=>({length:round(length(r)),bounds:r.bounds,collisions:r.collisions,fallback:r.fallback,label:r.label,path:r.path});

// Far-away, unrelated cards may still be obstacles. They cannot enlarge a clear
// return lane, including after a reload/structural pass recomputes every route.
const near=[rect('source',296,520),rect('target',168,328),rect('between',296,424)];
const far=rect('unrelated',12000,12000);
const fixtures={};
for(const index of [0,1,2,3]){
  const options={from:'source',to:'target',nodes:near,index,labelWidth:180,labelHeight:18},r=routeEdge(options);
  const expanded={...options,nodes:[...near,far]};assert.deepEqual(routeEdge(expanded),r,'unrelated distant node does not change a clear return or label');
  validate(expanded,r);assert.equal(r.collisions,0);assert.equal(r.fallback,false);
  const renamed=expanded.nodes.map((n,i)=>({...n,id:`renamed-${i}`}));assert.deepEqual(routeEdge({...expanded,from:'renamed-0',to:'renamed-1',nodes:renamed}),r);
  if(baseline)assert.ok(length(baseline(expanded))>length(r)*10,'this regression reproduces on the old router');
  fixtures[`clearReturnIndex${index}`]=routeSummary(r);
}
assert.equal(new Set(Object.values(fixtures).map(r=>r.path)).size,4,'original relation indexes retain separated lanes');
// Input returns use a fixed card clearance, not relation-index lane spreading.
const feedbacks=[0,1,2,3,41].map(index=>routeEdge({from:'source',to:'target',kind:'input',nodes:near,index,labelWidth:180,labelHeight:18}));
for(const r of feedbacks){assert.equal(r.bounds.right,578);assert.equal(r.collisions,0);assert.equal(r.fallback,false);assert.equal(r.path,feedbacks[0].path);}
const blockedFeedbackNodes=[...near,rect('right-blocker',570,400,30,50)];
const blockedFeedbackOptions={from:'source',to:'target',kind:'input',nodes:blockedFeedbackNodes,index:41,labelWidth:180,labelHeight:18},blockedFeedback=routeEdge(blockedFeedbackOptions);
validate(blockedFeedbackOptions,blockedFeedback);assert.equal(blockedFeedback.collisions,0);assert.equal(blockedFeedback.fallback,false);assert.ok(blockedFeedback.bounds.right>578,'blocked shared corridor still detours around actual obstacles');
assert.deepEqual(blockedFeedback.points[0],[556,554]);assert.deepEqual(blockedFeedback.points.at(-1),[428,362]);
const blocked=[rect('source',400,600),rect('target',200,200),rect('blocker',690,340,100,100)];
const blockedOptions={from:'source',to:'target',nodes:blocked},blockedRoute=routeEdge(blockedOptions);
assert.ok(routeCollisionCount([[704,634],[704,234]],[blocked[2]],14)>0,'local right lane is genuinely blocked');
assert.equal(blockedRoute.bounds.right,432.5,'mandatory bottom outlet finds a short left corridor instead of a graph-wide right lane');
assert.equal(blockedRoute.collisions,0);assert.equal(blockedRoute.fallback,false);validate(blockedOptions,blockedRoute);
fixtures.blockedLocalUsesGlobal=routeSummary(blockedRoute);
for(const [name,nodes,from,to] of [
  ['sameRowReturn',[rect('source',740,100),rect('target',40,100)],'source','target'],
  ['selfLoop',[rect('source',400,400)],'source','source'],
  ['negativeReturn',near.map(n=>({...n,x:n.x-1000,y:n.y-1000})),'source','target'],
  ['coveredPorts',[rect('source',120,320),rect('target',120,320),rect('cover',0,0,2000,2000)],'source','target'],
]){
  const options={from,to,nodes,index:1,labelWidth:180,labelHeight:18},r=routeEdge(options);validate(options,r);assert.deepEqual(routeEdge(options),r);
  if(name==='coveredPorts'){assert.ok(r.collisions>0);assert.equal(r.fallback,true);}else {assert.equal(r.collisions,0);assert.equal(r.fallback,false);}
  if(name==='sameRowReturn')assert.equal(side(r.points.at(-1),nodes[1]),'left');
  assert.deepEqual(r.points[0],[nodes[0].x+nodes[0].width/8,nodes[0].y+nodes[0].height]);
  fixtures[name]=routeSummary(r);
}

let calls=[];const cache=new RouteCache(o=>{calls.push(o.index);return routeEdge(o);}),tab={};
const cached=cache.update(tab,design,sampleNodes,edges);assert.equal(calls.length,63);calls=[];
for(const flags of Object.values(modes)){visibleIndexes(sampleNodes,edges,flags);assert.deepEqual(cache.update(tab,design,sampleNodes,edges),cached);}
assert.equal(calls.length,0,'zoom/selection/filter presentation does not change cache inputs');
const movedID=edges[41].from,moved=sampleNodes.map(n=>n.id===movedID?{...n,x:n.x+20,y:n.y+16}:n);
const incident=edges.flatMap((e,i)=>e.from===movedID||e.to===movedID?[i]:[]),after=cache.update(tab,design,moved,edges);
assert.deepEqual(calls,incident);cached.forEach((r,i)=>{if(!incident.includes(i))assert.equal(after[i],r);});
const percentile=(values,p)=>[...values].sort((a,b)=>a-b)[Math.floor((values.length-1)*p)];
function benchmark(nodes,relations,router,indexes=relations.map((_,i)=>i)){
  const run=()=>{const start=performance.now();relations.forEach((edge,i)=>router({...edge,nodes,index:indexes[i],labelWidth:width(edge),labelHeight:18}));return performance.now()-start;};
  for(let i=0;i<3;i++)run();const times=Array.from({length:25},run),result={medianMs:round(percentile(times,.5)),p95Ms:round(percentile(times,.95))};
  assert.ok(result.p95Ms<2000,'finite templates retain the existing generous routing budget');return result;
}
const hubNodes=[rect('hub',40,40),...Array.from({length:24},(_,i)=>rect(`leaf-${i}`,400+i%4*360,160+Math.floor(i/4)*150))];
const hubEdges=hubNodes.slice(1).flatMap(n=>[{from:'hub',to:n.id,label:'outbound'},{from:n.id,to:'hub',label:'return'}]);
const benchmarks={};
for(const [name,nodes,relations] of [['sample63',sampleNodes,edges],['incidentHighDegree48',hubNodes,hubEdges]])benchmarks[name]={...(baseline?{baseline:benchmark(nodes,relations,baseline)}:{}),candidate:benchmark(nodes,relations,routeEdge)};
const affectedEdges=incident.map(i=>edges[i]);
benchmarks.dragAffectedIncident10={...(baseline?{baseline:benchmark(moved,affectedEdges,baseline,incident)}:{}),candidate:benchmark(moved,affectedEdges,routeEdge,incident)};
const hash=text=>createHash('sha256').update(text).digest('hex');
console.log(JSON.stringify({method:'Pure local geometry. Initial sample and legacy saved coordinates; full 25-node obstacle set and original indexes before display filters. Screenshot settings show 16 edges; Write-preferred variant shows 13 and hides relation 41. Label boxes use the renderer length×12 estimate, not browser glyph bounds. Crossings exclude shared endpoints. Benchmarks are 25 local Node passes after 3 warm-ups, retaining original indexes for the moved-node incident union. Removing the early return can increase ordinary return evaluations despite the smaller worst-case template cap; timings do not establish a speedup. No CI or publication.',hashes:{sample:hash(sampleText),candidate:hash(readFileSync(new URL('../src/routing.ts',import.meta.url))),...(baselinePath?{baseline:hash(readFileSync(baselinePath))}:{})},samples,affectedRelation:{index:41,from:edges[41].from,to:edges[41].to,label:edges[41].label,...(affectedBefore?{baseline:routeSummary(affectedBefore)}:{}),candidate:routeSummary(affected)},fixtures,cache:{initialCalls:63,displayOnlyCalls:0,incidentCalls:incident.length,incidentIndexes:incident,unrelatedRoutesUnchanged:true},benchmarks},null,2));
