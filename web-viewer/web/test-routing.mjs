import assert from 'node:assert/strict';
import {routeEdge, routeCollisionCount} from '../src/routing.ts';
const rect=(id,x,y)=>({id,x,y,width:260,height:68});
const equal=(a,b)=>assert.ok(Math.abs(a-b)<1e-6,`${a} differs from ${b}`);
const commands=path=>Array.from(path.matchAll(/([MLQ])([^MLQ]+)/g),m=>({op:m[1],values:m[2].trim().split(/[ ,]+/).map(Number)}));
function orthogonalCorners(route){
  let current,lastTangent;let corners=0;
  for(const {op,values} of commands(route.path)){
    if(op==='M'){current=values;continue;}
    const end=values.slice(-2),start=current;
    if(op==='L'){
      assert.ok(start[0]===end[0]||start[1]===end[1],'straight legs are horizontal or vertical');
      const tangent=[end[0]-start[0],end[1]-start[1]];
      if(lastTangent){equal(lastTangent[0]*tangent[1]-lastTangent[1]*tangent[0],0);assert.ok(lastTangent[0]*tangent[0]+lastTangent[1]*tangent[1]>=0);}
      lastTangent=tangent;
    }else{
      corners++;const control=values.slice(0,2),a=[control[0]-start[0],control[1]-start[1]],b=[end[0]-control[0],end[1]-control[1]];
      assert.ok((a[0]===0||a[1]===0)&&(b[0]===0||b[1]===0));
      equal(a[0]*b[0]+a[1]*b[1],0);
      assert.ok(Math.hypot(...a)<=8+1e-6&&Math.hypot(...b)<=8+1e-6,'curves are limited to short 90-degree corners');
      if(lastTangent){equal(lastTangent[0]*a[1]-lastTangent[1]*a[0],0);assert.ok(lastTangent[0]*a[0]+lastTangent[1]*a[1]>=0);}
      lastTangent=b;
    }
    current=end;
  }
  assert.ok(corners<=4);assert.ok(route.points.length<=22);
  assert.ok(route.points.flat().every(Number.isFinite));assert.doesNotMatch(route.path,/NaN|Infinity|[CHV]/);
  assert.ok(route.points.every(p=>p[0]<=route.bounds.right+1e-6&&p[1]<=route.bounds.bottom+1e-6));
  equal(route.bounds.right,Math.max(...route.points.map(p=>p[0])));equal(route.bounds.bottom,Math.max(...route.points.map(p=>p[1])));
}
function endpointNormals(route,source,target){
  const outward=(p,r)=>p[0]===r.x?[-1,0]:p[0]===r.x+r.width?[1,0]:p[1]===r.y?[0,-1]:p[1]===r.y+r.height?[0,1]:null;
  const a=route.points[0],b=route.points.at(-1),na=outward(a,source),nb=outward(b,target);
  assert.ok(na&&nb,'ports are on endpoint boundaries');
  const first=route.points[1],previous=route.points.at(-2);
  equal((first[0]-a[0])*na[1]-(first[1]-a[1])*na[0],0);
  equal((previous[0]-b[0])*nb[1]-(previous[1]-b[1])*nb[0],0);
  assert.ok((first[0]-a[0])*na[0]+(first[1]-a[1])*na[1]>0,'source exits outward');
  assert.ok((previous[0]-b[0])*nb[0]+(previous[1]-b[1])*nb[1]>0,'arrow enters target inward');
}
const nodes=[rect('start',40,100),rect('middleObject',390,100),rect('finish',740,100),rect('lowerBusiness',40,330),rect('lowerObject',390,330),rect('exception',740,330),rect('bottom',390,560)];
const input={from:'start',to:'finish',nodes,labelWidth:120,labelHeight:20};
const before=JSON.stringify(input),route=routeEdge(input);
assert.equal(route.collisions,0);assert.equal(route.fallback,false);assert.equal(routeCollisionCount(route.points,[nodes[1]]),0);
assert.equal(JSON.stringify(input),before,'pure API does not mutate source layout');
assert.deepEqual(routeEdge(input),route,'deterministic geometry and labels');
for(const n of nodes)assert.ok(route.label[0]+64<n.x||route.label[0]-64>n.x+n.width||route.label[1]+14<n.y||route.label[1]-14>n.y+n.height,'whole label clears each card');
const drag=routeEdge({...input,nodes:nodes.map(n=>n.id==='finish'?{...n,x:870,y:210}:n)});
assert.notEqual(drag.path,route.path);assert.notDeepEqual(drag.points.at(-1),route.points.at(-1));
const reverse=routeEdge({...input,from:'finish',to:'start'});
assert.equal(reverse.collisions,0);assert.ok(reverse.points[0][0]>reverse.points.at(-1)[0]);
assert.equal(reverse.points[0][0],nodes[2].x+nodes[2].width);assert.equal(reverse.points.at(-1)[0],nodes[0].x+nodes[0].width);
assert.ok(reverse.bounds.right>Math.max(...nodes.map(n=>n.x+n.width)),'return uses the outside right lane');
assert.notDeepEqual(route.points,[...reverse.points].reverse());
assert.ok(Math.abs(route.label[0]-reverse.label[0])>120||Math.abs(route.label[1]-reverse.label[1])>20,'reciprocal fixture labels do not overlap');
assert.notEqual(routeEdge({...input,index:1}).path,route.path,'parallel detours have index-based spacing');
const renamed=nodes.map((n,i)=>({...n,id:String(i)}));assert.equal(routeEdge({...input,from:'0',to:'2',nodes:renamed}).path,route.path,'no fixture-specific IDs');
assert.equal(routeCollisionCount([[0,0],[100,0]],[{id:'tiny',x:49,y:-1,width:2,height:2}],0),1,'segment test catches small obstacles between vertices');
const dense=routeEdge({...input,nodes:[...nodes,{id:'cover',x:0,y:0,width:2000,height:2000}]});
assert.equal(dense.fallback,true);assert.ok(dense.collisions>0);orthogonalCorners(dense);
assert.throws(()=>routeEdge({...input,to:'missing'}),/endpoint/);

// The reference's small staircase: long vertical + horizontal legs, one short Q.
const stairs=[rect('source',40,40),rect('target',168,136)];
const step=routeEdge({from:'source',to:'target',nodes:stairs});
assert.deepEqual(step.points[0],[97.2,108]);assert.deepEqual(step.points.at(-1),[168,170]);
assert.equal(commands(step.path).filter(c=>c.op==='Q').length,1);assert.equal(step.collisions,0);assert.equal(step.fallback,false);
assert.ok(step.bounds.right<=stairs[1].x,'ordinary dependency never loops behind target');

// Fixed target-moved-past-obstacle regression, plus perturbations in both axes.
for(const delta of [-.1,0,.1]){
  const fixture=[rect('a',40,40),rect('blocker',760,40),rect('b',1080+delta,40+delta)];
  const r=routeEdge({from:'a',to:'b',nodes:fixture});
  assert.equal(r.collisions,0);assert.equal(r.points.at(-1)[0],fixture[2].x);assert.ok(r.bounds.right<=fixture[2].x+1);
  orthogonalCorners(r);endpointNormals(r,fixture[0],fixture[2]);
}
// Rotate obstacle fixtures and sweep drag positions; port normals and arrow
// direction are invariant even when an alternate port is needed.
const original=[rect('source',120,320),rect('target',1100,320),{...rect('blocker',600,290),height:128}];
const rotate=n=>({...n,x:1600-n.y-n.height,y:n.x,width:n.height,height:n.width});
let fixture=original;
for(let turn=0;turn<4;turn++,fixture=fixture.map(rotate)){
  const r=routeEdge({from:'source',to:'target',nodes:fixture});
  orthogonalCorners(r);endpointNormals(r,fixture[0],fixture[1]);assert.equal(r.collisions,0);assert.equal(routeCollisionCount(r.points,fixture.slice(0,2),-.1),0);
}
for(let x=320;x<=1000;x+=40){
  const fixture=nodes.map(n=>n.id==='finish'?{...n,x,y:180}:n),r=routeEdge({...input,nodes:fixture});
  orthogonalCorners(r);endpointNormals(r,fixture[0],fixture[2]);assert.deepEqual(routeEdge({...input,nodes:fixture}),r);
}
// This cover spans the new left-biased vertical ports, forcing side departure.
const blockedPort=[rect('a',120,320),rect('b',1100,320),{id:'port-cover',x:160,y:290,width:40,height:130}];
const alternate=routeEdge({from:'a',to:'b',nodes:blockedPort});
assert.equal(alternate.collisions,0);assert.ok([120,380].includes(alternate.points[0][0]));
for(const r of [route,drag,reverse,step,alternate])orthogonalCorners(r);

// Cost is capped at 193 small templates, independent of the number of cards.
// Dense impossible layouts must stay finite and report the compromise honestly.
const grid=Array.from({length:25},(_,i)=>rect(String(i),40+(i%5)*360,100+Math.floor(i/5)*180));
const began=performance.now();
for(let i=0;i<63;i++){
  const r=routeEdge({from:String(i%25),to:String((i*7+6)%25),nodes:grid,index:i});orthogonalCorners(r);
  assert.ok(Number.isFinite(r.label[0])&&Number.isFinite(r.label[1]));
}
assert.ok(performance.now()-began<2000,'25-card / 63-edge routing stays within a generous bounded-work budget');
// Seeded arbitrary drags, coincidences and overlaps. Re-sample the actual Q
// commands densely to independently check the router's short-chord margin.
let seed=20261012;
const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
const densePath=path=>{
  const points=[];let a;
  for(const {op,values} of commands(path)){
    if(op==='M'||op==='L'){a=values;points.push(a);continue;}
    const c=values.slice(0,2),b=values.slice(2);
    for(let i=1;i<=64;i++){const t=i/64,u=1-t;points.push([u*u*a[0]+2*u*t*c[0]+t*t*b[0],u*u*a[1]+2*u*t*c[1]+t*t*b[1]]);}
    a=b;
  }
  return points;
};
for(let run=0;run<2000;run++){
  const nodes=Array.from({length:6},(_,i)=>rect(String(i),Math.round(random()*1200),Math.round(random()*1200)));
  if(run%15===0)Object.assign(nodes[1],{x:nodes[0].x,y:nodes[0].y});
  const result=routeEdge({from:'0',to:'1',index:run,nodes});orthogonalCorners(result);endpointNormals(result,nodes[0],nodes[1]);
  if(result.collisions)assert.equal(result.fallback,true);
  else{
    const actual=densePath(result.path);
    assert.equal(routeCollisionCount(actual,nodes.slice(2),14),0,'rendered Q clears obstacle margin');
    assert.equal(routeCollisionCount(actual,nodes.slice(0,2),-.1),0,'rendered Q never re-enters endpoints');
  }
}
console.log(JSON.stringify({passed:19,checks:['reference left-biased staircase','orthogonal legs','short rounded corners','tangent continuity','endpoint normals and arrow meaning','seven-card obstacle avoidance','full-label clearance','purity','determinism','live target drag','outside-right returns','parallel detour spacing','ID independence','segment intersection','dense finite fallback','four-direction fixtures','covered-port alternate','bounded routing','2000 seeded drag/overlap cases with dense curve verification'],sampleRoutingMs:Math.round(performance.now()-began)},null,2));
await import('./test-directional-ports.mjs');

// Normal staircase: a blocked default port has a short forward alternative.
// Exception paths keep the historical geometry, even in the same positions.
const staircase=[rect('s',100,100),rect('t',228,400),{id:'block',x:140,y:230,width:70,height:68}];
const opts={from:'s',to:'t',nodes:staircase,labelWidth:60,labelHeight:18};
const monotone=r=>r.points.slice(1).every((p,i)=>p[0]>=r.points[i][0]&&p[1]>=r.points[i][1]);
const snapshot=JSON.stringify(staircase),legacyRoute=routeEdge(opts);
assert.equal(monotone(legacyRoute),false,'fixture exposes the previous upstream detour');
for(const kind of ['input','output']){
 const r=routeEdge({...opts,kind});assert.equal(monotone(r),true);assert.equal(r.collisions,0);assert.equal(r.fallback,false);
 assert.ok(r.bounds.right<=staircase[1].x);assert.equal(r.points[0][1],168);
 assert.ok(r.points[0][0]<230,'departure stays in the left half of the card');
 endpointNormals(r,staircase[0],staircase[1]);orthogonalCorners(r);
}
assert.deepEqual(routeEdge({...opts,kind:'business-exception'}),legacyRoute);
assert.deepEqual(routeEdge({...opts,kind:'object-exception'}),legacyRoute);
const caption=routeEdge({...opts,kind:'input'});
assert.ok(caption.label[1]>168&&caption.label[1]<210,'Input caption stays near the Object departure');
equal(Math.abs(caption.label[0]-caption.points[0][0]),38);
const labelBox={id:'caption',x:caption.label[0]-30,y:caption.label[1]-9,width:60,height:18};
const other=routeEdge({...opts,kind:'input',labels:[labelBox]});
assert.equal(other.path,caption.path,'caption avoidance never reroutes a wire');
assert.ok(Math.abs(other.label[0]-caption.label[0])>64||Math.abs(other.label[1]-caption.label[1])>22,'adjacent Input captions avoid one another');
assert.deepEqual(routeEdge({...opts,kind:'output',labels:[labelBox]}),routeEdge({...opts,kind:'output'}),'Output placement does not inherit Input preferences');
assert.equal(JSON.stringify(staircase),snapshot,'saved positions remain untouched');
const upstream={...opts,from:'t',to:'s'};
assert.equal(routeEdge({...upstream,kind:'input'}).path,routeEdge(upstream).path,'manual upstream normal edges do not force a giant forward loop');
console.log('Wiring regression: monotone obstacle alternative, adaptive bottom anchor, source-side Input captions, label avoidance, unchanged exceptions/Output and coordinates.');

const blockedBottom={...opts,nodes:[rect('s',100,100),rect('t',500,400),{id:'floor',x:80,y:182,width:300,height:70}]};
assert.equal(monotone(routeEdge(blockedBottom)),false);
const sideForward=routeEdge({...blockedBottom,kind:'input'});
assert.equal(monotone(sideForward),true,'try a forward side departure before accepting a clear upstream route');
assert.equal(sideForward.collisions,0);assert.equal(sideForward.points[0][0],360);
