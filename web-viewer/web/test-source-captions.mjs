// No browser, server or external dependencies: real source and independent rectangles.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseDesign} from '../src/graph.ts';
import {activityDesign} from '../src/activities.ts';
import {matrixPlan} from '../src/matrix-layout.ts';
import {RouteCache} from '../src/route-cache.ts';
import {routeEdge} from '../src/routing.ts';
import {reconcile} from '../src/session.ts';
import {resetLayout} from '../src/layout-reset.ts';
const design=parseDesign(readFileSync('../business-design/purchase-request/README.md','utf8'));
assert.equal(design.graph.nodes.length,8);assert.equal(design.graph.relations.length,11);
const overlap=(a,b)=>a.x<b.x+b.width&&b.x<a.x+a.width&&a.y<b.y+b.height&&b.y<a.y+a.height;
const labelBox=(r,i,g)=>({id:String(i),x:r.label[0]-Math.max(30,g.relations[i].label.length*12)/2,y:r.label[1]-9,width:Math.max(30,g.relations[i].label.length*12),height:18});
function check(d,focus){
 const g=d.graph,p=matrixPlan(g,d.activityOrder,focus);
 const ys=Object.values(p.positions).map(p=>p[1]).sort((a,b)=>a-b);
 assert.deepEqual(ys,Array.from({length:g.nodes.length},(_,i)=>40+96*i),'caption count never adds empty rows');
 const boxes=g.nodes.map(n=>({id:n.id,x:p.positions[n.id][0],y:p.positions[n.id][1],width:260,height:68}));
 const cache=new RouteCache(),key={},routes=cache.update(key,d,boxes,g.relations,p.wires);
 const labels=routes.map((r,i)=>labelBox(r,i,g));
 for(const [i,r]of g.relations.entries()){
  const s=boxes.find(n=>n.id===r.from),route=routes[i];
  if(!p.wires[i].returning){
   assert.equal(route.label[1],s.y+82,'normal Input AND Output share source row');
   assert.ok(labels[i].x>=s.x+40.5,'caption starts at or beyond source outlet');
  }
  assert.equal(route.fallback,false);assert.equal(route.collisions,0);
  for(const n of boxes)assert.equal(overlap(labels[i],n),false,'label never covers a card');
  for(const l of labels.slice(i+1))assert.equal(overlap(labels[i],l),false,'complete captions never overlap');
 }
 // Moving only a target keeps the Output caption's source row. Reopening from
 // persisted geometry is deterministic; a layout reset alone adopts new cells.
 const out=g.relations.find(r=>r.kind==='output');
 const moved=boxes.map(n=>n.id===out.to?{...n,x:n.x+17,y:n.y+113}:n);
 const changed=cache.update(key,d,moved,g.relations,p.wires),cold=new RouteCache().update({},d,moved,g.relations,p.wires);
 const i=g.relations.indexOf(out),source=boxes.find(n=>n.id===out.from);
 assert.equal(changed[i].label[1],source.y+82);assert.equal(cold[i].label[1],source.y+82);
 const old=Object.fromEntries(boxes.map((n,i)=>[n.id,[n.x,40+i*192]]));
 const tab={key:'purchase',name:'purchase',activity:focus,design:d,positions:old,scroll:[19,31],zoom:.52};
 assert.deepEqual({...reconcile(tab,d).positions},old,'saved coordinates never migrate');
 assert.deepEqual(resetLayout(tab).positions,matrixPlan(g,d.activityOrder,focus).positions,'explicit reset uses common compact planner');
 return {p,boxes};
}
for(const focus of [undefined,...design.activityOrder])check(activityDesign(design,focus),focus);
// Long captions + multiple normal exits from a shared source. All text remains
// on its source row, escaping sideways rather than adding vertical lanes.
const long={...design,graph:{...design.graph,relations:design.graph.relations.flatMap((r,i)=>i===0?[r,{...r,label:'長い入力の説明 / '.repeat(40)},{...r,label:'別の入力'}]:[r])}};
check(long);
// An unrelated manually placed node blocks the entire departure row near the
// outlet. Both normal kinds must escape it to the right on that SAME row,
// including the orthogonal-routing fallback for a same-row destination.
for(const kind of ['input','output']){
 const nodes=[{id:'s',x:40,y:40,width:260,height:68},{id:'block',x:100,y:115,width:420,height:68},{id:'t',x:900,y:40,width:260,height:68}];
 const r=routeEdge({from:'s',to:'t',kind,nodes,matrix:{returning:false,captionLane:9},labelWidth:480,labelHeight:18});
 assert.equal(r.label[1],122);assert.ok(r.label[0]-240>=528);assert.equal(r.fallback,false);
}
console.log('purchase captions: 4 Activities/4 Objects/11 relations; 5 views; 96-unit rows; full label/card separation; long and multiple captions; drag/cold reload; saved coordinates and reset; fallback source row');
