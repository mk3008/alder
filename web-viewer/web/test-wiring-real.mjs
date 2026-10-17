import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseDesign} from '../src/graph.ts';
import {activityDesign} from '../src/activities.ts';
import {initialPositions} from '../src/layout.ts';
import {RouteCache} from '../src/route-cache.ts';
import {reconcile} from '../src/session.ts';
import {resetLayout} from '../src/layout-reset.ts';
import {createWorkspace,openActivity,snapshotWorkspace,restoreWorkspace,viewDesign} from '../src/workspace.ts';
const design=parseDesign(readFileSync('../business-design/alder/README.md','utf8')),before=JSON.stringify(design);
const expected={
 '業務設計':['Alder: 業務ナレッジ','Alder: 業務相関ナレッジ','実装','検査項目の設計','業務設計'],
 '検査項目の設計':['Alder: 検査項目設計ナレッジ','業務設計書','業務設計','検査項目の設計']
};
const state=createWorkspace({tabs:[{key:'source',name:'sample',design,positions:{},scroll:[0,0],zoom:1}],dark:false,drawer:false,width:400});
const overview=structuredClone(state.tabs[0].positions);
for(const [activity,staircase] of Object.entries(expected)){
 const projected=activityDesign(design,activity),positions=initialPositions(projected.graph,projected.activityOrder,activity);
 for(const [i,id] of staircase.entries())assert.deepEqual(positions[id],[40+i*128,40+i*96],'all upstream Object and exception Activity peers advance right and down');
 assert.deepEqual(initialPositions({...projected.graph,nodes:[...projected.graph.nodes].reverse(),relations:[...projected.graph.relations].reverse()},projected.activityOrder,activity),positions,'deterministic detail ordering');
 const boxes=projected.graph.nodes.map(n=>({id:n.id,x:positions[n.id][0],y:positions[n.id][1],width:260,height:68}));
 const routes=new RouteCache().update({},projected,boxes,projected.graph.relations);
 const labels=routes.map((r,i)=>({id:String(i),x:r.label[0]-Math.max(30,projected.graph.relations[i].label.length*12)/2,y:r.label[1]-9,width:Math.max(30,projected.graph.relations[i].label.length*12),height:18}));
 const overlaps=(a,b)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
 let forward=0,exceptions=0;
 for(const [i,relation] of projected.graph.relations.entries()){
  const route=routes[i],source=boxes.find(n=>n.id===relation.from),target=boxes.find(n=>n.id===relation.to);
  assert.deepEqual(route.points[0],[source.x+source.width*.125,source.y+source.height],'same icon-side bottom outlet for EVERY kind');
  assert.equal(route.points[1][0],route.points[0][0]);assert.ok(route.points[1][1]>route.points[0][1]);
  assert.equal(route.collisions,0);assert.equal(route.fallback,false);
  for(const n of boxes)assert.equal(overlaps(labels[i],n),false,'complete label clears every shape');
  for(const other of labels.slice(i+1))assert.equal(overlaps(labels[i],other),false,'complete labels do not overlap');
  if(relation.kind==='input'){
   assert.ok(route.label[1]>=source.y+68&&route.label[1]<=source.y+96,'caption beside source departure, including return Inputs');
   if(source.y<target.y){forward++;assert.ok(route.points.slice(1).every((p,j)=>p[0]>=route.points[j][0]&&p[1]>=route.points[j][1]));assert.deepEqual(route.points.at(-1),[target.x,target.y+34],'normal arrow enters from left');}
  }
  if(relation.kind.endsWith('exception')){
   exceptions++;assert.ok(projected.graph.nodes.some(n=>n.id===relation.from&&n.type==='business'));assert.ok(projected.graph.nodes.some(n=>n.id===relation.to&&n.type==='business'));
   // Preserve actual directed hand-back, not the old side-departing coordinates.
   if(activity==='検査項目の設計')assert.ok(route.points.at(-1)[1]<route.points[0][1],'hand-back still reaches the upstream Activity');
   assert.equal(relation.label,design.graph.relations.find(r=>r.kind===relation.kind&&r.from===relation.from&&r.to===relation.to).label);
  }
 }
 assert.equal(forward,2);assert.equal(exceptions,activity==='業務設計'?2:1);
 const tab=openActivity(state,activity);assert.deepEqual(tab.positions,positions,'new detail uses the same plan');
 // Simulate the previously saved vertical stack, including deliberate overlap.
 const old={...tab,positions:Object.fromEntries(Object.keys(positions).map((id,i)=>[id,[40,40+i*96]])),scroll:[17,29],zoom:.75};
 const retained=reconcile(old,projected);assert.deepEqual({...retained.positions},old.positions,'old saved coordinates never migrate');
 Object.assign(tab,old);const serialized=snapshotWorkspace(state),restored=restoreWorkspace(serialized),view=restored.tabs.find(t=>t.activity===activity);
 assert.deepEqual({...view.positions},old.positions,'native workspace restore keeps every old coordinate');
 const reset=resetLayout({...view,design:viewDesign(view)});assert.deepEqual(reset.positions,positions,'explicit reset applies new staircase');assert.deepEqual(reset.scroll,[0,0]);assert.equal(reset.zoom,1);
 assert.deepEqual({...restored.tabs[0].positions},overview,'reset is isolated from overview');
 Object.assign(tab,{positions});
}
assert.equal(JSON.stringify(design),before,'source Graph and document remain exact');
console.log('Both real Activity details: staircase peers, common bottom outlets, semantic exceptions, 4 source captions each, no label/card overlaps, old saved stack unchanged, explicit reset and per-tab restore.');
