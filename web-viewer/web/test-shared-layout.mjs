import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {performance} from 'node:perf_hooks';
import {parseDesign} from '../src/graph.ts';
import {activityDesign} from '../src/activities.ts';
import {initialPositions} from '../src/layout.ts';
import {matrixPlan} from '../src/matrix-layout.ts';
import {exceptionSegments} from '../src/exception-paint.ts';
const start=performance.now(),design=parseDesign(readFileSync('../business-design/alder/README.md','utf8'));
const accepted=JSON.parse(readFileSync(new URL('./authorities/detail-matrix-0df6146.json',import.meta.url),'utf8'));
for(const focus of [undefined,...design.activityOrder]){
 const projected=activityDesign(design,focus),plan=matrixPlan(projected.graph,projected.activityOrder,focus);
 assert.deepEqual(initialPositions(projected.graph,projected.activityOrder,focus),plan.positions,'both views use the matrix plan directly');
 if(focus){
  for(const [id,[x]]of Object.entries(accepted[focus]))assert.equal(plan.positions[id][0],x,'existing detail columns remain exact');
  assert.deepEqual(Object.values(plan.positions).map(p=>p[1]).sort((a,b)=>a-b),Array.from({length:projected.graph.nodes.length},(_,i)=>40+96*i),'details use the same compact single-row policy');
  const outputs=projected.graph.relations.filter(r=>r.kind==='output'&&r.from===focus).map(r=>plan.positions[r.to][1]);
  for(const node of projected.graph.nodes.filter(n=>n.type==='business'&&n.id!==focus))assert.ok(plan.positions[node.id][1]>Math.max(plan.positions[focus][1],...outputs),'exception peers follow all normal outputs');
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
