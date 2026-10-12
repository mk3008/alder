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
