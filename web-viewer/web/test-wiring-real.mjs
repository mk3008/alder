import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseDesign} from '../src/graph.ts';
import {activityDesign} from '../src/activities.ts';
import {initialPositions} from '../src/layout.ts';
import {matrixPlan} from '../src/matrix-layout.ts';
import {routeEdge} from '../src/routing.ts';
import {RouteCache} from '../src/route-cache.ts';
import {reconcile} from '../src/session.ts';
import {resetLayout} from '../src/layout-reset.ts';
import {createWorkspace,openActivity,snapshotWorkspace,restoreWorkspace,viewDesign} from '../src/workspace.ts';
const design=parseDesign(readFileSync('../business-design/alder/README.md','utf8')),before=JSON.stringify(design);
const expected=['業務設計','検査項目の設計'];
const state=createWorkspace({tabs:[{key:'source',name:'sample',design,positions:{},scroll:[0,0],zoom:1}],dark:false,drawer:false,width:400});
const overview=structuredClone(state.tabs[0].positions);
for(const activity of expected){
 const projected=activityDesign(design,activity),positions=initialPositions(projected.graph,projected.activityOrder),plan=matrixPlan(projected.graph,projected.activityOrder);
 assert.deepEqual(positions,plan.positions,'selected graph uses the same layout plan as an overview');
 assert.deepEqual(initialPositions({...projected.graph,nodes:[...projected.graph.nodes].reverse(),relations:[...projected.graph.relations].reverse()},projected.activityOrder),positions,'deterministic detail ordering');
 const boxes=projected.graph.nodes.map(n=>({id:n.id,x:positions[n.id][0],y:positions[n.id][1],width:260,height:68}));
 const routes=new RouteCache().update({},projected,boxes,projected.graph.relations,plan.wires);
 const labels=routes.map((r,i)=>({id:String(i),x:r.label[0]-Math.max(30,projected.graph.relations[i].label.length*12)/2,y:r.label[1]-9,width:Math.max(30,projected.graph.relations[i].label.length*12),height:18}));
 const overlaps=(a,b)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
 let forward=0,exceptions=0;
 for(const [i,relation] of projected.graph.relations.entries()){
  const route=routes[i],source=boxes.find(n=>n.id===relation.from),target=boxes.find(n=>n.id===relation.to);
  const returnInput=relation.kind==='input'&&source.y>=target.y+target.height;
  if(returnInput||relation.kind.endsWith('exception')){
   assert.equal(route.points[0][0],source.x+source.width,'feedback leaves on the right');assert.ok(route.points[0][1]>source.y&&route.points[0][1]<source.y+source.height);
   assert.ok(route.points[1][0]>route.points[0][0]);assert.equal(route.points[1][1],route.points[0][1]);
   assert.equal(route.points.at(-1)[0],target.x+target.width,'feedback enters on the right');assert.ok(route.points.at(-1)[1]>target.y&&route.points.at(-1)[1]<target.y+target.height);
   assert.ok(route.points.at(-2)[0]>route.points.at(-1)[0]);
   assert.ok(route.points.some(p=>target.y<source.y?p[1]<route.points[0][1]:p[1]>route.points[0][1]),'right corridor follows the directed target height');
  }else{
   assert.deepEqual(route.points[0],[source.x+source.width/8,source.y+source.height],'ordinary icon-side bottom outlet');
   assert.equal(route.points[1][0],route.points[0][0]);assert.ok(route.points[1][1]>route.points[0][1]);
  }
  assert.equal(route.collisions,0);assert.equal(route.fallback,false);
  for(const n of boxes)assert.equal(overlaps(labels[i],n),false,'complete label clears every shape');
  for(const other of labels.slice(i+1))assert.equal(overlaps(labels[i],other),false,'complete labels do not overlap');
  if(relation.kind==='input'){
   if(source.y<target.y){forward++;assert.ok(route.points.slice(1).every((p,j)=>p[0]>=route.points[j][0]&&p[1]>=route.points[j][1]));assert.equal(route.points.at(-1)[0],target.x,'normal arrow enters from left');}
  }
  if(relation.kind==='output')assert.ok(labels[i].x>=route.points[0][0]+8,'Output text clears its departure');
  if(relation.kind.endsWith('exception')){
   exceptions++;assert.ok(projected.graph.nodes.some(n=>n.id===relation.from&&n.type==='business'));assert.ok(projected.graph.nodes.some(n=>n.id===relation.to&&n.type==='business'));
   // Preserve actual directed hand-back, not the old side-departing coordinates.
   assert.equal(relation.label,design.graph.relations.find(r=>r.kind===relation.kind&&r.from===relation.from&&r.to===relation.to).label);
  }
 }
 assert.equal(forward,2);assert.equal(exceptions,activity==='業務設計'?2:1);
 // Move the downstream data Object as in the marked review. Recompute only
 // incident edges; caption anchors must remain endpoint-relative after reload.
 const dataID=activity==='業務設計'?'業務設計書':'検査項目',cache=new RouteCache(),key={};
 const original=cache.update(key,projected,boxes,projected.graph.relations,plan.wires);
 for(const delta of [[25,500],[-80,700],[170,900]]){
  const moved=boxes.map(n=>n.id===dataID?{...n,x:n.x+delta[0],y:n.y+delta[1]}:n);
  const updated=cache.update(key,projected,moved,projected.graph.relations,plan.wires),fresh=new RouteCache().update({},projected,moved,projected.graph.relations,plan.wires),object=moved.find(n=>n.id===dataID);
  for(const [i,relation]of projected.graph.relations.entries()){
   if(relation.from!==dataID&&relation.to!==dataID){assert.equal(updated[i],original[i]);continue;}
   for(const route of [updated[i],fresh[i]]){
    const left=route.label[0]-Math.max(30,relation.label.length*12)/2;
    if(relation.kind==='output'){const source=moved.find(n=>n.id===relation.from);assert.ok(left>=source.x+40.5);assert.deepEqual(route.label,original[i].label,'Output caption stays at source after target drag');}
    else if(relation.kind==='input'){assert.ok(left>=object.x+object.width);assert.equal(route.label[1]-original[i].label[1],delta[1],'Input caption follows the moved source');}
   }
  }
 }
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
console.log('Both real Activity details: staircase peers, ordinary bottom outlets, right/right semantic exceptions, 4 source captions each, no label/card overlaps, old saved stack unchanged, explicit reset and per-tab restore.');

const overviewNodes=design.graph.nodes.map(n=>({id:n.id,x:overview[n.id][0],y:overview[n.id][1],width:260,height:68}));
for(const [index,relation] of design.graph.relations.entries()){
 const source=overviewNodes.find(n=>n.id===relation.from),target=overviewNodes.find(n=>n.id===relation.to);
 if(relation.kind==='input'&&relation.from.startsWith('Alder: ')){
  assert.ok(source.x+32.5<target.x,'source icon column is left of normal Input target');
  const route=routeEdge({...relation,nodes:overviewNodes,index,labelWidth:Math.max(30,relation.label.length*12),labelHeight:18});
  assert.deepEqual(route.points[0],[source.x+32.5,source.y+68]);assert.deepEqual(route.points.at(-1),[target.x,target.y+34]);
  assert.ok(route.points[1][1]>route.points[0][1]);assert.equal(route.collisions,0);assert.equal(route.fallback,false);
 }
 if(relation.kind.endsWith('exception')){
  const route=routeEdge({...relation,nodes:overviewNodes,index,labelWidth:Math.max(30,relation.label.length*12),labelHeight:18});
  assert.deepEqual(route.points[0],[source.x+260,source.y+34]);assert.deepEqual(route.points.at(-1),[target.x+260,target.y+34]);
  assert.ok(route.points[1][0]>route.points[0][0]);assert.ok(route.points.at(-2)[0]>route.points.at(-1)[0]);assert.equal(route.collisions,0);
 }
}
