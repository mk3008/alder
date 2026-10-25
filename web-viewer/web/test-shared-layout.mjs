import {assertCaptionRows} from './caption-row-oracle.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {performance} from 'node:perf_hooks';
import {parseDesign} from '../src/graph.ts';
import {activityDesign} from '../src/activities.ts';
import {initialPositions} from '../src/layout.ts';
import {matrixPlan} from '../src/matrix-layout.ts';
import {reconcile} from '../src/session.ts';
import {resetLayout} from '../src/layout-reset.ts';
import {RouteCache} from '../src/route-cache.ts';
import {exceptionSegments} from '../src/exception-paint.ts';
const start=performance.now(),design=parseDesign(readFileSync('../business-design/alder/README.md','utf8'));
for(const focus of [undefined,...design.activityOrder]){
 const projected=activityDesign(design,focus),plan=matrixPlan(projected.graph,projected.activityOrder);
 assert.deepEqual(initialPositions(projected.graph,projected.activityOrder),plan.positions,'both views use the matrix plan directly');
 // A-selected graph must render as an ordinary overview of that graph.
 // This fails the former focus-only column replacement, even though it lived
 // inside the same matrixPlan function.
 const base={key:'view',name:'selected graph',design:projected,positions:{},zoom:1,scroll:[0,0]};
 const detail=reconcile({...base,activity:focus},projected),overview=reconcile({...base},structuredClone(projected));
 assert.deepEqual(detail.positions,overview.positions,'B ignores overview/detail origin');
 assert.deepEqual(resetLayout(detail).positions,resetLayout(overview).positions,'reset obeys the same B contract');
 assertCaptionRows(plan.positions,projected.graph.relations.filter((r,i)=>!plan.wires[i].returning));
 const boxes=projected.graph.nodes.map(n=>({id:n.id,x:plan.positions[n.id][0],y:plan.positions[n.id][1],width:260,height:68}));
 const routes=new RouteCache().update({},projected,boxes,projected.graph.relations,plan.wires);
 for(const [i,route]of routes.entries()){
  assert.equal(route.fallback,false,'initial selected graph routes without fallback');assert.equal(route.collisions,0,'every initial wire clears every selected card');
  const r=projected.graph.relations[i],source=boxes.find(n=>n.id===r.from),target=boxes.find(n=>n.id===r.to),wire=plan.wires[i];
  assert.deepEqual(route.points[0],wire.returning?[source.x+260,source.y+68*(wire.fromPort??.5)]:[source.x+32.5,source.y+68]);
  assert.deepEqual(route.points.at(-1),wire.returning?[target.x+260,target.y+68*(wire.toPort??.5)]:[target.x,target.y+34]);
 }
 for(const wire of plan.wires)assert.ok(!('detail'in wire),'routing has no detail-only branch');
}
// Independent point oracle: SVG dash offset + directed distance vs world coordinate.
// This catches the old path-start phase, reversed runs and negative dragged coordinates.
const mod=n=>(n%11+11)%11,paint=(offset,distance)=>mod(offset+distance)<6;
for(const vertical of [false,true])for(const [a,b]of [[-79,183],[203,-91],[17,231],[316,17]]){
 const path=vertical?`M28,${a} L28,${b}`:`M${a},28 L${b},28`,[run]=exceptionSegments(path);
 for(let t=.125;t<Math.abs(b-a);t+=.25){
  const coord=a+Math.sign(b-a)*t;
  assert.equal(paint(run.offset,t),mod(coord)<6,`${path}, world=${coord}`);
 }
}
const paths=['M428,328 L594,328 Q602,328 602,336 L602,554 Q602,562 594,562 L556,562','M428,328 L710,328 Q718,328 718,336 L718,800'];
const [a,b]=paths.map(p=>exceptionSegments(p)[0]);
for(let x=429.125;x<594;x+=.25)assert.equal(paint(a.offset,x-428),paint(b.offset,x-428),'different path lengths leave exactly the same gaps on their overlap');
assert.equal(exceptionSegments(paths[0]).filter(s=>s.offset===undefined).length,2,'rounded corners preserved');
assert.throws(()=>exceptionSegments('M0,0 L10,10'),/orthogonal/);
console.log(JSON.stringify({sharedViews:design.activityOrder.length+1,dashChecks:'coordinate phase, both directions/axes, signed coordinates, unequal paths, corners',durationMs:performance.now()-start}));

await import('./test-source-captions.mjs');
