import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {parseDesign} from '../src/graph.ts';
import {initialPositions} from '../src/layout.ts';
import {hiddenReadIndexes} from '../src/edge-visibility.ts';
import {RouteCache} from '../src/route-cache.ts';
import {routeEdge,routeCollisionCount} from '../src/routing.ts';

// Optional frozen pre-change implementation. Coordinates and original relation
// indexes are identical on both sides; no browser or screenshot state is guessed.
const baseline=process.env.ROUTING_BASELINE_PATH?(await import(pathToFileURL(process.env.ROUTING_BASELINE_PATH).href)).routeEdge:undefined;
const rect=(id,x,y,width=260,height=68)=>({id,x,y,width,height});
const width=edge=>Math.max(30,(edge.label??'').length*12);
const length=route=>route.points.slice(1).reduce((sum,p,i)=>sum+Math.hypot(p[0]-route.points[i][0],p[1]-route.points[i][1]),0);
const overlap=(a,b)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
const returning=(s,t)=>t.y+t.height<=s.y||((t.x+t.width/2)<(s.x+s.width/2)&&(t.y+t.height/2)<=(s.y+s.height/2))||s===t;
const side=(p,n)=>p[0]===n.x?'left':p[0]===n.x+n.width?'right':p[1]===n.y?'top':p[1]===n.y+n.height?'bottom':undefined;
const vertical=(route,s)=>['top','bottom'].includes(side(route.points[0],s));
const intersects=(a,b,c,d)=>{
  const orientation=(p,q,r)=>(q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]);
  return orientation(a,b,c)*orientation(a,b,d)<-1e-6&&orientation(c,d,a)*orientation(c,d,b)<-1e-6;
};
function validate(options,route){
  const s=options.nodes.find(n=>n.id===options.from),t=options.nodes.find(n=>n.id===options.to);
  assert.doesNotMatch(route.path,/NaN|Infinity|[CHV]/);
  assert.ok(route.points.flat().every(Number.isFinite));assert.ok(route.points.length<=22);
  assert.ok(route.label.every(Number.isFinite));
  assert.equal(route.bounds.right,Math.max(...route.points.map(p=>p[0])));
  assert.equal(route.bounds.bottom,Math.max(...route.points.map(p=>p[1])));
  for(const [p,next,n] of [[route.points[0],route.points[1],s],[route.points.at(-1),route.points.at(-2),t]]){
    const face=side(p,n);assert.ok(face,'endpoint stays on its card boundary');
    const normal={left:[-1,0],right:[1,0],top:[0,-1],bottom:[0,1]}[face];
    const delta=[next[0]-p[0],next[1]-p[1]];
    assert.equal(delta[0]*normal[1]-delta[1]*normal[0],0);
    assert.ok(delta[0]*normal[0]+delta[1]*normal[1]>0,'outward departure and inward arrival');
  }
  // Independently sample actual Q commands at 64 steps, rather than trusting
  // the router's four-chord collision approximation.
  const dense=[];let current;
  for(const match of route.path.matchAll(/([MLQ])([^MLQ]+)/g)){
    const values=match[2].trim().split(/[ ,]+/).map(Number);
    if(match[1]==='M'||match[1]==='L'){
      if(current)assert.ok(current[0]===values[0]||current[1]===values[1]);
      current=values;dense.push(current);continue;
    }
    const c=values.slice(0,2),end=values.slice(2),a=current;
    assert.ok((a[0]===c[0]||a[1]===c[1])&&(c[0]===end[0]||c[1]===end[1]));
    assert.ok(Math.hypot(c[0]-a[0],c[1]-a[1])<=8+1e-6);
    for(let i=1;i<=64;i++){const t=i/64,u=1-t;dense.push([u*u*a[0]+2*u*t*c[0]+t*t*end[0],u*u*a[1]+2*u*t*c[1]+t*t*end[1]]);}
    current=end;
  }
  if(!route.collisions){
    assert.equal(routeCollisionCount(dense,options.nodes.filter(n=>n!==s&&n!==t),14),0);
    assert.equal(routeCollisionCount(dense,s===t?[s]:[s,t],-.1),0);
  }else assert.equal(route.fallback,true);
}
function measure(nodes,edges,router,mode={}){
  const hidden=hiddenReadIndexes(edges,mode.preferWrite===true);
  const visible=n=>!mode.hideOutside||n.scope!==false;
  const ids=new Set(nodes.filter(visible).map(n=>n.id));
  // All obstacles/routes remain present before applying presentation filters.
  const routes=edges.map((edge,index)=>router({...edge,nodes,index,labelWidth:width(edge),labelHeight:18}));
  const indexes=edges.flatMap((edge,i)=>!hidden.has(i)&&ids.has(edge.from)&&ids.has(edge.to)&&(!mode.hideExceptions||!edge.kind.endsWith('exception'))?[i]:[]);
  const shown=indexes.map(i=>routes[i]),labels=indexes.map(i=>({x:routes[i].label[0]-width(edges[i])/2,y:routes[i].label[1]-9,width:width(edges[i]),height:18}));
  let crossings=0,crossingPairs=0;
  for(let i=0;i<indexes.length;i++)for(let j=i+1;j<indexes.length;j++){
    const a=edges[indexes[i]],b=edges[indexes[j]];if([a.from,a.to].some(id=>id===b.from||id===b.to))continue;
    let count=0;for(let p=1;p<shown[i].points.length;p++)for(let q=1;q<shown[j].points.length;q++)count+=intersects(shown[i].points[p-1],shown[i].points[p],shown[j].points[q-1],shown[j].points[q]);
    crossings+=count;crossingPairs+=count>0;
  }
  const arrivals={left:0,right:0,top:0,bottom:0},forward={count:0,left:0,verticalDeparture:0};
  for(const i of indexes){const s=nodes.find(n=>n.id===edges[i].from),t=nodes.find(n=>n.id===edges[i].to),face=side(routes[i].points.at(-1),t);arrivals[face]++;if(!returning(s,t)){forward.count++;forward.left+=face==='left';forward.verticalDeparture+=vertical(routes[i],s);}}
  const bounds=rs=>({left:Math.min(...rs.flatMap(r=>r.points.map(p=>p[0]))),top:Math.min(...rs.flatMap(r=>r.points.map(p=>p[1]))),right:Math.max(...rs.map(r=>r.bounds.right)),bottom:Math.max(...rs.map(r=>r.bounds.bottom))});
  return {nodes:nodes.length,visibleNodes:nodes.filter(visible).length,edges:indexes.length,relationIndexes:indexes,arrivals,forward,nodeCollisions:shown.reduce((n,r)=>n+r.collisions,0),labelNodeOverlaps:labels.reduce((n,l)=>n+nodes.filter(r=>overlap(l,r)).length,0),labelLabelOverlaps:labels.reduce((n,l,i)=>n+labels.slice(i+1).filter(r=>overlap(l,r)).length,0),fallbacks:shown.filter(r=>r.fallback).length,crossings,crossingPairs,routedLength:+shown.reduce((n,r)=>n+length(r),0).toFixed(2),visibleBounds:bounds(shown),allRouteBounds:bounds(routes)};
}

const sampleText=readFileSync(new URL('../../business-design/alder/README.md',import.meta.url),'utf8');
const design=parseDesign(sampleText),current=initialPositions(design.graph,design.activityOrder);
const legacy=JSON.parse(readFileSync(new URL('./evidence/document-order-20261012/sample-layout.json',import.meta.url),'utf8'));
const samples={};
for(const [name,positions] of [['publicInitial',current],['legacySaved',legacy]]){
  const nodes=design.graph.nodes.map(n=>({...rect(n.id,...positions[n.id]),scope:n.scope})),snapshot=JSON.stringify({nodes,positions,graph:design.graph});
  samples[name]={};
  for(const [mode,options] of Object.entries({allVisible:{},writePreferred:{preferWrite:true},scopeHiddenWritePreferred:{preferWrite:true,hideOutside:true},screenshotFilters:{preferWrite:true,hideOutside:true,hideExceptions:true}})){
    const candidate=measure(nodes,design.graph.relations,routeEdge,options),previous=baseline&&measure(nodes,design.graph.relations,baseline,options);
    assert.equal(candidate.nodeCollisions,0);assert.equal(candidate.labelNodeOverlaps,0);assert.equal(candidate.fallbacks,0);
    if(previous)assert.ok(candidate.forward.left>=previous.forward.left,'forward left arrivals never decrease on sample layouts');
    samples[name][mode]={...(previous?{baseline:previous}:{}),candidate};
  }
  design.graph.relations.forEach((edge,index)=>{const o={...edge,nodes,index,labelWidth:width(edge),labelHeight:18},r=routeEdge(o);validate(o,r);assert.deepEqual(routeEdge(o),r);});
  assert.equal(JSON.stringify({nodes,positions,graph:design.graph}),snapshot,'saved coordinates and graph semantics unchanged');
}

// The supplied image establishes relative geometry, not the user's saved world
// coordinates. This proportional model is deliberately separate from samples.
const proportional=[rect('source',400,400),rect('target',548,562),rect('later',400,744)];
const priority=[rect('source',400,400),rect('target',548,650),rect('below',430,550,120,50),rect('leftObstacle',300,486,140,50)];
const cases=[
  ['screenshotProportions',proportional],
  ['topLeftBeforeBottomRight',priority],
  ['sideLeftBeforeSideRight',[rect('source',400,400),rect('target',548,688),rect('upperCard',400,304),rect('lowerCard',400,496)]],
  ['downLeft',[rect('source',400,400),rect('target',280,650)]],
  ['coveredLeftArrival',[rect('source',120,320),rect('target',1100,500),rect('cover',1080,480,40,110)]],
  ['trueUpstream',[rect('source',740,500),rect('target',40,100)]],
  ['sameRowReturn',[rect('source',740,100),rect('target',40,100)]],
  ['negativeCoordinates',proportional.map(n=>({...n,x:n.x-1000,y:n.y-1000}))],
  ['impossibleOverlap',[rect('source',120,320),rect('target',120,320),rect('cover',0,0,2000,2000)]],
];
const fixtures={};
for(const [name,nodes] of cases){
  const o={from:'source',to:'target',nodes,index:1,labelWidth:300,labelHeight:18},snapshot=JSON.stringify(o),r=routeEdge(o),old=baseline?.(o),s=nodes[0],t=nodes[1];
  validate(o,r);assert.deepEqual(routeEdge(o),r);assert.equal(JSON.stringify(o),snapshot);
  const renamed=nodes.map((n,i)=>({...n,id:`renamed-${i}`}));assert.deepEqual(routeEdge({...o,from:'renamed-0',to:'renamed-1',nodes:renamed}),r,'no node-name special cases');
  if(['screenshotProportions','topLeftBeforeBottomRight','sideLeftBeforeSideRight','downLeft','negativeCoordinates'].includes(name)){assert.equal(side(r.points.at(-1),t),'left');assert.equal(r.collisions,0);assert.equal(r.fallback,false);}
  assert.deepEqual(r.points[0],[s.x+s.width/8,s.y+s.height],'mandatory outlet replaces old top/side departure preferences');
  if(name==='sideLeftBeforeSideRight')assert.ok(r.points[1][1]>r.points[0][1],'tight saved gap still starts downward');
  if(name==='screenshotProportions'){assert.equal(side(r.points[0],s),'bottom');assert.equal((r.path.match(/ Q/g)??[]).length,1);assert.ok(r.bounds.right<=t.x);}
  if(name==='coveredLeftArrival'){assert.notEqual(side(r.points.at(-1),t),'left');assert.equal(r.collisions,0);}
  if(name==='trueUpstream'||name==='sameRowReturn'){assert.equal(side(r.points.at(-1),t),'left');assert.ok(r.points[1][1]>r.points[0][1]);}
  if(name==='impossibleOverlap'){assert.ok(r.collisions>0);assert.equal(r.fallback,true);}
  fixtures[name]={nodes,candidate:r,...(old?{baseline:old}:{}),candidateLength:+length(r).toFixed(2),...(old?{baselineLength:+length(old).toFixed(2)}:{})};
}
const parallel=Array.from({length:4},(_,index)=>routeEdge({from:'source',to:'target',nodes:priority,index}));
assert.equal(new Set(parallel.map(r=>r.path)).size,4,'detours retain original index lane spacing');
const selfOptions={from:'source',to:'source',nodes:[proportional[0]]},self=routeEdge(selfOptions);assert.equal(self.collisions,0);validate(selfOptions,self);assert.deepEqual(self.points[0],[proportional[0].x+32.5,proportional[0].y+68]);

// Verify the cache boundary directly: display-only filtering has no routing
// calls, and moving one node only recomputes that node's incident union.
let calls=[];const cache=new RouteCache(o=>{calls.push(o.index);return routeEdge(o);}),tab={};
const cacheNodes=design.graph.nodes.map(n=>rect(n.id,...current[n.id]));
const original=cache.update(tab,design,cacheNodes,design.graph.relations);assert.equal(calls.length,63);calls=[];
for(const preferWrite of [true,false]){hiddenReadIndexes(design.graph.relations,preferWrite);assert.deepEqual(cache.update(tab,design,cacheNodes,design.graph.relations),original);}
assert.equal(calls.length,0);
const movedID='検査項目の設計',moved=cacheNodes.find(n=>n.id===movedID);moved.x+=20;moved.y+=16;
const incident=design.graph.relations.flatMap((r,i)=>r.from===movedID||r.to===movedID?[i]:[]),after=cache.update(tab,design,cacheNodes,design.graph.relations);
assert.deepEqual(calls,incident);original.forEach((r,i)=>{if(!incident.includes(i))assert.equal(after[i],r);});

const percentile=(values,p)=>[...values].sort((a,b)=>a-b)[Math.floor((values.length-1)*p)];
function benchmark(nodes,edges,router){
  const run=()=>{const start=performance.now();for(const [index,edge] of edges.entries())router({...edge,nodes,index,labelWidth:width(edge),labelHeight:18});return performance.now()-start;};
  for(let i=0;i<3;i++)run();const values=Array.from({length:25},run);
  const result={medianMs:+percentile(values,.5).toFixed(3),p95Ms:+percentile(values,.95).toFixed(3)};
  assert.ok(result.p95Ms<2000,'bounded work retains the existing generous 25-card regression budget');return result;
}
const allNodes=design.graph.nodes.map(n=>rect(n.id,...current[n.id])),star=[rect('hub',40,40),...Array.from({length:24},(_,i)=>rect(`leaf-${i}`,400+i%4*360,160+Math.floor(i/4)*150))];
const starEdges=star.slice(1).flatMap(n=>[{from:'hub',to:n.id,label:'outbound'},{from:n.id,to:'hub',label:'return'}]);
const benchmarks={};
for(const [name,nodes,edges] of [['sample63',allNodes,design.graph.relations],['incidentHighDegree48',star,starEdges]])benchmarks[name]={...(baseline?{baseline:benchmark(nodes,edges,baseline)}:{}),candidate:benchmark(nodes,edges,routeEdge)};
console.log(JSON.stringify({method:'Local pure-routing regression. Public sample and legacy saved coordinates are separate from screenshot-proportional model. Every route uses full obstacle set and original relation index; display filters only select metrics. Labels use renderer length × 12 estimate, not browser glyph bounds. Crossings exclude shared endpoints. No browser/CI/publication was run.',hashes:{sample:createHash('sha256').update(sampleText).digest('hex'),routing:createHash('sha256').update(readFileSync(new URL('../src/routing.ts',import.meta.url))).digest('hex')},samples,fixtures,parallelRoutes:parallel.map(r=>r.path),cache:{initialCalls:63,displayOnlyCalls:0,incidentCalls:incident.length,incidentIndexes:incident,unrelatedRouteObjectsUnchanged:true},benchmarks},null,2));
