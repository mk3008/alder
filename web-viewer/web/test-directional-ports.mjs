import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {parseDesign} from '../src/graph.ts';
import {initialPositions} from '../src/layout.ts';
import {hiddenReadIndexes} from '../src/edge-visibility.ts';
import {routeEdge,routeCollisionCount} from '../src/routing.ts';

const rect=(id,x,y)=>({id,x,y,width:260,height:68});
const intersects=(a,b,c,d)=>{
  const orientation=(p,q,r)=>(q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]);
  return orientation(a,b,c)*orientation(a,b,d)<-1e-6&&orientation(c,d,a)*orientation(c,d,b)<-1e-6;
};
const overlap=(a,b)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
const width=edge=>Math.max(30,(edge.label??'').length*12);
const preferred=(route,source,target)=>route.points[0][0]===source.x+source.width/2&&[source.y,source.y+source.height].includes(route.points[0][1])&&route.points.at(-1)[1]===target.y+target.height/2&&[target.x,target.x+target.width].includes(route.points.at(-1)[0]);

// Optional comparison uses a separately preserved routing.ts from the pinned
// baseline revision. Both implementations receive these exact same coordinates.
// ROUTING_BASELINE_PATH=/absolute/path/to/routing.ts node --experimental-strip-types web/test-directional-ports.mjs
const baseline=process.env.ROUTING_BASELINE_PATH?(await import(pathToFileURL(process.env.ROUTING_BASELINE_PATH).href)).routeEdge:undefined;
function measure(nodes,allEdges,route,preferWrite=false){
  // Match main.ts: keep the full node layout/obstacle set and original relation
  // indexes, then measure only visible routes, including unpaired Read edges.
  const hidden=hiddenReadIndexes(allEdges,preferWrite);
  const relationIndexes=allEdges.flatMap((edge,index)=>hidden.has(index)?[]:[index]);
  const edges=relationIndexes.map(index=>allEdges[index]);
  const routes=relationIndexes.map(index=>route({...allEdges[index],nodes,index,labelWidth:width(allEdges[index]),labelHeight:18}));
  for(const result of routes){
    assert.match(result.path,/ Q/);assert.doesNotMatch(result.path,/[LHV]|NaN|Infinity/);
    assert.ok(result.points.length<=321);assert.ok(result.points.flat().every(Number.isFinite));
    assert.ok(result.points.every(p=>p[0]<=result.bounds.right+1e-6&&p[1]<=result.bounds.bottom+1e-6));
  }
  const labels=routes.map((r,i)=>({x:r.label[0]-width(edges[i])/2,y:r.label[1]-9,width:width(edges[i]),height:18}));
  let crossings=0,crossingPairs=0;
  for(let i=0;i<routes.length;i++)for(let j=i+1;j<routes.length;j++){
    if([edges[i].from,edges[i].to].some(id=>id===edges[j].from||id===edges[j].to))continue;
    const a=routes[i].points,b=routes[j].points;let count=0;
    for(let p=1;p<a.length;p++)for(let q=1;q<b.length;q++)count+=intersects(a[p-1],a[p],b[q-1],b[q]);
    crossings+=count;crossingPairs+=count>0;
  }
  const edgeBounds={right:Math.max(...routes.map(r=>r.bounds.right)),bottom:Math.max(...routes.map(r=>r.bounds.bottom))};
  const contentBounds={right:Math.max(edgeBounds.right,...nodes.map(n=>n.x+n.width),...labels.map(n=>n.x+n.width)),bottom:Math.max(edgeBounds.bottom,...nodes.map(n=>n.y+n.height),...labels.map(n=>n.y+n.height))};
  // main.ts uses these edge/label margins before viewport/camera reserves.
  const edgeExtent={right:Math.max(...routes.map((r,i)=>Math.max(r.bounds.right+20,r.label[0]+width(edges[i])/2+12))),bottom:Math.max(...routes.map(r=>Math.max(r.bounds.bottom+20,r.label[1]+22)))};
  const intrinsicCanvas={width:Math.max(1400,edgeExtent.right,...nodes.map(n=>n.x+340)),height:Math.max(850,edgeExtent.bottom,...nodes.map(n=>n.y+220))};
  return {nodes:nodes.length,edges:edges.length,hiddenEdges:hidden.size,relationIndexes,fallbackRelationIndexes:routes.flatMap((r,i)=>r.fallback?[relationIndexes[i]]:[]),preferredPorts:routes.filter((r,i)=>preferred(r,nodes.find(n=>n.id===edges[i].from),nodes.find(n=>n.id===edges[i].to))).length,edgeBounds,contentBounds,edgeExtent,intrinsicCanvas,crossings,crossingPairs,nodeOverlaps:nodes.reduce((sum,n,i)=>sum+nodes.slice(i+1).filter(other=>overlap(n,other)).length,0),nodeCollisions:routes.reduce((sum,r)=>sum+r.collisions,0),labelNodeOverlaps:labels.reduce((sum,l)=>sum+nodes.filter(n=>overlap(l,n)).length,0),labelLabelOverlaps:labels.reduce((sum,l,i)=>sum+labels.slice(i+1).filter(other=>overlap(l,other)).length,0),fallbacks:routes.filter(r=>r.fallback).length,routedLength:Math.round(routes.reduce((sum,r)=>sum+r.points.slice(1).reduce((length,p,i)=>length+Math.hypot(p[0]-r.points[i][0],p[1]-r.points[i][1]),0),0))};
}
const design=parseDesign(readFileSync(new URL('../../business-design/alder/README.md',import.meta.url),'utf8'));
const current=initialPositions(design.graph,design.activityOrder);
const legacy=JSON.parse(readFileSync(new URL('./evidence/document-order-20261012/sample-layout.json',import.meta.url),'utf8'));
// These pin the reviewed staircase and retained saved-layout behavior. Label
// collisions on two long Write labels are a known, exposed limitation; never
// hide them behind an incorrect zero-fallback expectation.
const expected={
  currentStaircase:{
    writePreferred:{edges:53,preferredPorts:39,crossings:100,crossingPairs:91,labelNodeOverlaps:2,labelLabelOverlaps:7,fallbackRelationIndexes:[59,62]},
    all63Reference:{edges:63,preferredPorts:48,crossings:140,crossingPairs:126,labelNodeOverlaps:2,labelLabelOverlaps:12,fallbackRelationIndexes:[59,62]}
  },
  legacySavedCoordinates:{
    writePreferred:{edges:53,preferredPorts:53,crossings:102,crossingPairs:78,labelNodeOverlaps:0,labelLabelOverlaps:32,fallbackRelationIndexes:[]},
    all63Reference:{edges:63,preferredPorts:63,crossings:131,crossingPairs:98,labelNodeOverlaps:0,labelLabelOverlaps:46,fallbackRelationIndexes:[]}
  }
};
const sampleResults={};
for(const [name,positions] of [['currentStaircase',current],['legacySavedCoordinates',legacy]]){
  const nodes=design.graph.nodes.map(n=>rect(n.id,...positions[n.id])),snapshot=JSON.stringify({nodes,positions,graph:design.graph});
  const samples={};
  for(const [mode,preferWrite] of [['writePreferred',true],['all63Reference',false]]){
    const seen=[];
    const candidate=measure(nodes,design.graph.relations,options=>{seen.push(options.index);return routeEdge(options);},preferWrite),wanted=expected[name][mode];
    for(const [key,value] of Object.entries(wanted))assert.deepEqual(candidate[key],value,`${name} ${mode}: ${key}`);
    assert.equal(candidate.nodes,25);assert.equal(candidate.nodeOverlaps,0);assert.equal(candidate.nodeCollisions,0);
    assert.equal(candidate.fallbacks,wanted.fallbackRelationIndexes.length);
    assert.equal(candidate.hiddenEdges,preferWrite?10:0);
    if(preferWrite){
      const kinds=candidate.relationIndexes.map(i=>design.graph.relations[i].kind);
      assert.equal(kinds.filter(kind=>kind==='input').length,34,'Write preference keeps unpaired Read');
      assert.equal(kinds.filter(kind=>kind==='output').length,17);
      assert.equal(kinds.filter(kind=>kind==='business-exception').length,2);
      assert.deepEqual(seen,candidate.relationIndexes,'hidden Read edges never renumber retained routes');
      assert.ok(candidate.relationIndexes.some((index,i)=>index!==i),'fixture detects accidental post-filter indexing');
    }
    const previous=baseline&&measure(nodes,design.graph.relations,baseline,preferWrite);
    // The comparison is descriptive: preferred ports do not promise smaller
    // extents or fewer label overlaps than facing ports at every saved layout.
    if(previous)assert.ok(candidate.nodeCollisions<=previous.nodeCollisions);
    samples[mode]={...(previous?{baseline:previous}:{}),candidate};
  }
  assert.equal(JSON.stringify({nodes,positions,graph:design.graph}),snapshot,'routing leaves coordinates and relation semantics unchanged');
  if(name==='legacySavedCoordinates')for(const value of Object.values(samples))assert.deepEqual(value.candidate.intrinsicCanvas,{width:1460,height:1340},'saved-layout extents remain bounded');
  sampleResults[name]=samples;
}
const staircase=sampleResults.currentStaircase.writePreferred.candidate;
assert.ok(Math.abs(staircase.intrinsicCanvas.width-3043.845454508413)<1e-6);
assert.equal(staircase.intrinsicCanvas.height,2564);
assert.ok(Math.abs(staircase.contentBounds.bottom-2437.8351775598703)<1e-6);
// The two known fallbacks must identify the same long Write labels. This avoids
// merely accepting any arbitrary pair of hidden/Read regressions as "expected".
assert.deepEqual(staircase.fallbackRelationIndexes.map(i=>{const e=design.graph.relations[i];return [e.kind,e.from,e.to];}),[
  ['output','業務設計','業務設計書'],['output','製品検証','検証結果']
]);

const fixtures=[
  ['near-horizontal',[rect('a',120,320),rect('b',386,320)],[['a','b']]],
  ['near-vertical',[rect('a',120,320),rect('b',120,394)],[['a','b']]],
  ['overlap',[rect('a',120,320),rect('b',240,350)],[['a','b']]],
  ['coincident',[rect('a',120,320),rect('b',120,320)],[['a','b']]],
  ['self',[rect('a',120,320)],[['a','a']]],
  ['cycle',[rect('a',120,320),rect('b',500,440),rect('c',880,320)],[['a','b'],['b','c'],['c','a']]],
  ['read-write',[rect('activity',120,320),rect('object',500,320)],[['activity','object'],['object','activity']]],
  ['drag-far-right',[rect('a',120,320),rect('blocker',600,290),rect('b',1800,320)],[['a','b']]],
  ['covered-vertical-ports',[rect('a',120,320),rect('b',1100,320),{id:'cover',x:230,y:290,width:40,height:130}],[['a','b']]],
  ['top-boundary-return',[rect('a',120,40),rect('b',1100,40)],[['b','a']]],
];
const syntheticResults={};
for(const [name,nodes,links] of fixtures){
  const edges=links.map(([from,to])=>({from,to,label:name})),snapshot=JSON.stringify(nodes),paths=[];
  for(const [index,edge] of edges.entries()){
    const input={...edge,nodes,index},route=routeEdge(input),source=nodes.find(n=>n.id===edge.from),target=nodes.find(n=>n.id===edge.to);
    assert.match(route.path,/ Q/);assert.doesNotMatch(route.path,/[LHV]|NaN|Infinity/);
    assert.equal(route.collisions,0);assert.equal(routeCollisionCount(route.points,[source,target],-.1),0);
    assert.ok(route.points.length<=321);assert.ok(route.points.every(p=>p[0]>=1&&p[1]>=1));
    assert.ok(route.bounds.right<=Math.max(...nodes.map(n=>n.x+n.width))+200);
    assert.ok(route.bounds.bottom<=Math.max(...nodes.map(n=>n.y+n.height))+200);
    assert.deepEqual(routeEdge(input),route,'routing is deterministic');
    if(name==='drag-far-right'){assert.equal(route.points.at(-1)[0],target.x);assert.ok(route.bounds.right<=target.x);}
    if(name==='covered-vertical-ports')assert.equal(route.points[0][0],source.x+source.width,'covered preferred ports allow a horizontal departure');
    else assert.ok(preferred(route,source,target));
    if(baseline)assert.ok(route.collisions<=baseline(input).collisions);
    paths.push(route.path);
  }
  assert.equal(JSON.stringify(nodes),snapshot);
  assert.equal(new Set(paths).size,paths.length,'cycle/read-write relations remain separate');
  syntheticResults[name]={...(baseline?{baseline:measure(nodes,edges,baseline)}:{}),candidate:measure(nodes,edges,routeEdge)};
}
console.log(JSON.stringify({measurement:'Primary sample metrics use actual Write-preferred 53 visible relations and original routing indexes; all 63 remain a separate reference. Exact quadratic right/bottom; pairwise segment crossings sampled at 32 intervals per quadratic; shared-endpoint edge pairs excluded. Labels use the same length×12 estimate as main.ts, not browser glyph measurements. Intrinsic canvas excludes viewport, camera, and bottom-toolbar reserves.',samples:sampleResults,synthetic:syntheticResults},null,2));
