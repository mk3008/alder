import assert from 'node:assert/strict';
import {routeEdge, routeCollisionCount} from '../src/routing.ts';
const rect=(id,x,y)=>({id,x,y,width:260,height:68});
// Seven mixed business/object cards; routing deliberately knows nothing about types or IDs.
const nodes=[rect('start',40,100),rect('middleObject',390,100),rect('finish',740,100),rect('lowerBusiness',40,330),rect('lowerObject',390,330),rect('exception',740,330),rect('bottom',390,560)];
const input={from:'start',to:'finish',nodes,labelWidth:120,labelHeight:20};
const before=JSON.stringify(input),route=routeEdge(input);
assert.equal(route.rerouted,true);assert.equal(route.collisions,0);assert.equal(route.fallback,false);
assert.equal(routeCollisionCount(route.points,[nodes[1]]),0);
assert.equal(JSON.stringify(input),before,'pure API must not mutate source layout');
for(const n of nodes) assert.ok(route.label[0]+60+4<n.x || route.label[0]-60-4>n.x+n.width || route.label[1]+10+4<n.y || route.label[1]-10-4>n.y+n.height,'whole label clears every card');
const moved=nodes.map(n=>n.id==='middleObject'?{...n,y:230}:n);
const clear=routeEdge({...input,nodes:moved});
assert.equal(clear.rerouted,false);assert.match(clear.path,/ Q/);assert.notEqual(clear.path,route.path);
const drag=routeEdge({...input,nodes:nodes.map(n=>n.id==='finish'?{...n,x:870,y:210}:n)});
assert.notEqual(drag.path,route.path,'latest target position recomputes route');
assert.notDeepEqual(drag.points.at(-1),route.points.at(-1));
const reverse=routeEdge({...input,from:'finish',to:'start'});
assert.ok(reverse.points[0][0]>reverse.points.at(-1)[0],'direction remains source to target');
const outward=routeEdge({...input,index:4});
const inward=routeEdge({...input,from:'finish',to:'start',index:8});
assert.equal(outward.rerouted,true);assert.equal(inward.rerouted,true);
assert.equal(outward.collisions,0);assert.equal(inward.collisions,0);
assert.notDeepEqual(outward.points,[...inward.points].reverse(),'reciprocal detours must not retrace the same lane');
assert.notDeepEqual(outward.label,inward.label,'reciprocal detours retain individual label positions');
assert.ok(Math.abs(outward.label[0]-inward.label[0])>120 || Math.abs(outward.label[1]-inward.label[1])>20,'reciprocal labels do not overlap in this seven-card layout');
const parallel=routeEdge({...input,index:5});
assert.notDeepEqual(outward.points,parallel.points,'adjacent relation indices spread parallel detours');
const renamed=nodes.map((n,i)=>({...n,id:String(i)}));
assert.equal(routeEdge({...input,from:'0',to:'2',nodes:renamed}).path,route.path,'no fixture-specific IDs');
const endpoints=routeEdge({...input,nodes:[nodes[0],nodes[2]]});
assert.equal(endpoints.collisions,0);assert.equal(endpoints.rerouted,false,'endpoints are excluded');
assert.equal(routeCollisionCount([[0,0],[100,0]],[{id:'tiny',x:49,y:-1,width:2,height:2}],0),1,'segment tests catch small rectangles between samples');
const dense=routeEdge({...input,nodes:[...nodes,{id:'cover',x:0,y:0,width:2000,height:2000}]});
assert.equal(dense.fallback,true);assert.ok(dense.collisions>0);assert.ok(!/NaN|Infinity/.test(dense.path));
assert.throws(()=>routeEdge({...input,to:'missing'}),/endpoint/);
console.log(JSON.stringify({passed:13,checks:['seven-card obstacle avoidance','full-label clearance','purity','position change','live drag recomputation','direction','reciprocal detours and labels','parallel detour spread','ID independence','endpoint exclusion','segment intersection','dense fallback','missing endpoint']},null,2));

// Clear and obstructed routes remain curves throughout a coordinate sweep.
for(let x=320;x<=1000;x+=40){const r=routeEdge({...input,nodes:nodes.map(n=>n.id==='finish'?{...n,x,y:180}:n)});assert.ok(r.points.every(p=>p[0]<=r.bounds.right+1e-6&&p[1]<=r.bounds.bottom+1e-6));assert.match(r.path,/ Q/);assert.doesNotMatch(r.path,/[LHV]/);assert.ok(!/NaN|Infinity/.test(r.path));}

// Preferred vertical departures and horizontal arrivals stay independent of lane handles.
// Rotating this fixture exercises all four directions without ID-specific rules.
const facingNodes=[rect('source',120,320),rect('target',1100,320),{...rect('blocker',600,290),height:128}];
const rotate=n=>({...n,x:1600-n.y-n.height,y:n.x,width:n.height,height:n.width});
const turns=[facingNodes];for(let i=1;i<4;i++)turns.push(turns[i-1].map(rotate));
const quadratics=path=>{const numbers=path.match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi).map(Number);let a=numbers.slice(0,2);const result=[];for(let i=2;i<numbers.length;i+=4){const c=numbers.slice(i,i+2),b=numbers.slice(i+2,i+4);result.push({a,c,b});a=b;}return result;};
const equal=(a,b)=>assert.ok(Math.abs(a-b)<1e-6,`${a} differs from ${b}`);

for(let turn=0;turn<4;turn++){
  const fixture=turns[turn],s=fixture[0],t=fixture[1];
  const result=routeEdge({from:s.id,to:t.id,nodes:fixture});
  assert.equal(result.points[0][0],s.x+s.width/2,'departure uses a vertical face');
  assert.ok([s.y,s.y+s.height].includes(result.points[0][1]));
  assert.equal(result.points.at(-1)[1],t.y+t.height/2,'arrival uses a horizontal face');
  assert.ok([t.x,t.x+t.width].includes(result.points.at(-1)[0]));
  assert.equal(result.collisions,0);
  assert.equal(routeCollisionCount(result.points,[s,t],-.1),0,'detour never re-enters either endpoint');
  const normal=[0,result.points[0][1]===s.y?-1:1];
  const inward=[result.points.at(-1)[0]===t.x?1:-1,0];
  const segments=quadratics(result.path),first=segments[0],last=segments.at(-1);
  equal((first.c[0]-first.a[0])*normal[1]-(first.c[1]-first.a[1])*normal[0],0);
  assert.ok((first.c[0]-first.a[0])*normal[0]+(first.c[1]-first.a[1])*normal[1]>0,'first handle departs along the outward normal');
  equal((last.b[0]-last.c[0])*inward[1]-(last.b[1]-last.c[1])*inward[0],0);
  assert.ok((last.b[0]-last.c[0])*inward[0]+(last.b[1]-last.c[1])*inward[1]>0,'last handle enters along the inward normal');
  assert.ok(Math.hypot(last.b[0]-last.c[0],last.b[1]-last.c[1])<=28,'ingress handle is short');
  for(let i=1;i<segments.length;i++){
    const previous=segments[i-1],next=segments[i];
    const u=[previous.b[0]-previous.c[0],previous.b[1]-previous.c[1]],v=[next.c[0]-next.a[0],next.c[1]-next.a[1]];
    equal(u[0]*v[1]-u[1]*v[0],0);
    assert.ok(u[0]*v[0]+u[1]*v[1]>=0,'quadratics join with a continuous tangent');
  }
  assert.match(result.path,/ Q/);assert.doesNotMatch(result.path,/[LHV]/);
  assert.ok(result.points.every(p=>p[0]<=result.bounds.right+1e-6&&p[1]<=result.bounds.bottom+1e-6));
}
for(const x of [980,1100,1400])for(const y of [260,320,390]){
  const fixture=facingNodes.map(n=>n.id==='target'?{...n,x,y}:n);
  const r=routeEdge({from:'source',to:'target',nodes:fixture});
  assert.equal(r.points.at(-1)[0],x,'far-right target always receives at its left face');
  assert.ok(r.bounds.right<=x+1e-6,'no loop behind a far-right target');
  assert.equal(r.collisions,0);
  for(const delta of [-.1,.1]){
    const moved=fixture.map(n=>n.id==='target'?{...n,x:n.x+delta,y:n.y+delta}:n.id==='blocker'?{...n,y:n.y+delta}:n);
    const next=routeEdge({from:'source',to:'target',nodes:moved});
    equal(next.points.at(-1)[0],x+delta);
    assert.equal(next.collisions,0,'small drags keep the facing ports without route collisions');
  }
}
// Covering both preferred departures makes a horizontal source port necessary.
const blockedPort=[rect('a',120,320),rect('b',1100,320),{id:'port-cover',x:230,y:290,width:40,height:130}];
const alternate=routeEdge({from:'a',to:'b',nodes:blockedPort});
assert.equal(alternate.collisions,0);assert.equal(alternate.points[0][0],380,'horizontal source port is allowed when both vertical ports are covered');
// Multiple same-direction and reciprocal relations remain individually curved.
const distinct=Array.from({length:3},(_,index)=>routeEdge({from:'source',to:'target',nodes:facingNodes,index}));
assert.equal(new Set(distinct.map(r=>r.path)).size,3);
for(const r of distinct){assert.equal(r.points.at(-1)[0],1100);assert.equal(r.collisions,0);}
// Every candidate has a fixed segment/sample budget, including dense fallback.
const grid=Array.from({length:25},(_,i)=>rect(String(i),40+(i%5)*360,100+Math.floor(i/5)*180));
const began=performance.now();
for(let i=0;i<63;i++){
  const r=routeEdge({from:String(i%25),to:String((i*7+6)%25),nodes:grid,index:i});
  assert.ok(r.points.length<=321);assert.ok(Number.isFinite(r.label[0])&&Number.isFinite(r.label[1]));
}
assert.ok(performance.now()-began<5000,'25-node/63-edge fixture stays within a generous bounded-work budget');
assert.ok(dense.points.length<=321);
console.log(JSON.stringify({passed:8,checks:['four-direction vertical departures and horizontal arrivals','normal short ingress and egress','smooth quadratic joins','live drag without back-side loops','horizontal departure fallback when vertical ports blocked','parallel preferred-port detours','curve extents','bounded dense routing'],sampleRoutingMs:Math.round(performance.now()-began)},null,2));

// Fixed-coordinate sample and proximity/cycle regressions, plus optional baseline comparison.
await import("./test-directional-ports.mjs");
