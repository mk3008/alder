import {assertCaptionRows} from './caption-row-oracle.mjs';
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
 assertCaptionRows(p.positions,g.relations.filter((r,i)=>!p.wires[i].returning));
 const boxes=g.nodes.map(n=>({id:n.id,x:p.positions[n.id][0],y:p.positions[n.id][1],width:260,height:68}));
 const cache=new RouteCache(),key={},routes=cache.update(key,d,boxes,g.relations,p.wires);
 const labels=routes.map((r,i)=>labelBox(r,i,g));
 // Every following card may carry a badge extending 9px upward. Keep the
 // complete 18px caption at least 12px clear of that badge reservation.
 for(const label of labels)for(const n of boxes)if(n.y>label.y)assert.ok(n.y-9-(label.y+label.height)>=12,'caption clears the following badge reservation');
 for(const [i,r]of g.relations.entries()){
  const s=boxes.find(n=>n.id===r.from),route=routes[i];
  if(!p.wires[i].returning){
   assert.equal(route.label[1],s.y+101+p.wires[i].captionLane*22,'normal Input AND Output stack below source');
   assert.equal(labels[i].x,s.x+40.5,'normal captions share the source indent');
  }
  assert.equal(route.fallback,false);assert.equal(route.collisions,0);
  for(const n of boxes)assert.equal(overlap(labels[i],n),false,'label never covers a card');
  for(const [j,l] of labels.entries())if(j>i){const other=g.relations[j],same=!p.wires[i].returning&&!p.wires[j].returning&&r.kind===other.kind&&r.from===other.from&&r.label===other.label;if(same)assert.deepEqual(labels[i],{...l,id:labels[i].id},'identical departure captions share one rectangle');else assert.equal(overlap(labels[i],l),false,'distinct captions never overlap');}
 }
 // Moving only a target keeps the Output caption's source row. Reopening from
 // persisted geometry is deterministic; a layout reset alone adopts new cells.
 const out=g.relations.find(r=>r.kind==='output');
 const moved=boxes.map(n=>n.id===out.to?{...n,x:n.x+17,y:n.y+113}:n);
 const changed=cache.update(key,d,moved,g.relations,p.wires),cold=new RouteCache().update({},d,moved,g.relations,p.wires);
 const i=g.relations.indexOf(out),source=boxes.find(n=>n.id===out.from);
 assert.equal(changed[i].label[1],source.y+101+p.wires[i].captionLane*22);assert.equal(cold[i].label[1],source.y+101+p.wires[i].captionLane*22);
 const old=Object.fromEntries(boxes.map((n,i)=>[n.id,[n.x,40+i*192]]));
 const tab={key:'purchase',name:'purchase',activity:focus,design:d,positions:old,scroll:[19,31],zoom:.52};
 assert.deepEqual({...reconcile(tab,d).positions},old,'saved coordinates never migrate');
 assert.deepEqual(resetLayout(tab).positions,matrixPlan(g,d.activityOrder,focus).positions,'explicit reset uses common compact planner');
 return {p,boxes};
}
for(const focus of [undefined,...design.activityOrder])check(activityDesign(design,focus),focus);
const alder=parseDesign(readFileSync('../business-design/alder/README.md','utf8'));
for(const focus of [undefined,...alder.activityOrder])check(activityDesign(alder,focus),focus);
// Long captions + multiple normal exits from a shared source. All text remains
// below its source, one line per distinct normal departure.
const long={...design,graph:{...design.graph,relations:design.graph.relations.flatMap((r,i)=>i===0?[r,{...r,label:'長い入力の説明 / '.repeat(40)},{...r,label:'別の入力'}]:[r])}};
check(long);
// An unrelated manually placed node blocks the entire departure row near the
// outlet. Both normal kinds must escape it to the right on that SAME row,
// including the orthogonal-routing fallback for a same-row destination.
for(const kind of ['input','output']){
 const nodes=[{id:'s',x:40,y:40,width:260,height:68},{id:'block',x:100,y:313,width:420,height:68},{id:'t',x:900,y:40,width:260,height:68}];
 const r=routeEdge({from:'s',to:'t',kind,nodes,matrix:{returning:false,captionLane:9},labelWidth:480,labelHeight:18});
 assert.equal(r.label[1],339);assert.ok(r.label[0]-240>=528);assert.equal(r.fallback,false);
}
console.log('purchase captions: 4 Activities/4 Objects/11 relations; purchase 5 + Alder 11 views; 24px caption clearances + 22px per extra line; full label/card separation; long and multiple captions; drag/cold reload; saved coordinates and reset; fallback source row');

// An unrelated card moves over a cached caption: reroute no unrelated wire,
// but move text sideways. Cold and warm captions agree for the same geometry.
{
 const nodes=[{id:'s',x:40,y:40,width:260,height:68},{id:'t',x:360,y:232,width:260,height:68},{id:'block',x:800,y:40,width:260,height:68}],relations=[{kind:'input',from:'s',to:'t',label:'data'}],matrix=[{returning:false,captionLane:0}],d={},key={},cache=new RouteCache();
 const first=cache.update(key,d,nodes,relations,matrix),moved=nodes.map(n=>n.id==='block'?{...n,x:80,y:115}:n),next=cache.update(key,d,moved,relations,matrix),cold=new RouteCache().update({},d,moved,relations,matrix);
 assert.equal(next[0].points,first[0].points);assert.equal(next[0].path,first[0].path);assert.equal(next[0].label[1],first[0].label[1]);assert.ok(next[0].label[0]>first[0].label[0]);assert.deepEqual(next[0].label,cold[0].label);
}
