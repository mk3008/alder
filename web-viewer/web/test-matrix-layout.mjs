import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {matrixPlan} from '../src/matrix-layout.ts';
import {routeEdge} from '../src/routing.ts';
import {parseDesign} from '../src/graph.ts';
import {RouteCache} from '../src/route-cache.ts';
const design=parseDesign(readFileSync('../business-design/alder/README.md','utf8'));
const accepted=JSON.parse(readFileSync(new URL('./authorities/overview-matrix-c407.json',import.meta.url),'utf8'));
assert.deepEqual({...matrixPlan(design.graph,design.activityOrder).positions},accepted,'all 25 GUI-approved cells remain exact');
const rectHit=(a,b,n)=>a[0]===b[0]?a[0]>n.x&&a[0]<n.x+260&&Math.max(a[1],b[1])>n.y&&Math.min(a[1],b[1])<n.y+68:a[1]>n.y&&a[1]<n.y+68&&Math.max(a[0],b[0])>n.x&&Math.min(a[0],b[0])<n.x+260;
function verify(graph,hint){
 const before=JSON.stringify(graph),p=matrixPlan(graph,hint),normal=graph.relations.filter(r=>r.kind==='input'||r.kind==='output');
 const reach=id=>{const seen=new Set([id]),q=[id];for(let i=0;i<q.length;i++)for(const r of normal)if(r.from===q[i]&&!seen.has(r.to)){seen.add(r.to);q.push(r.to);}return seen;};
 const boxes=graph.nodes.map(n=>({id:n.id,x:p.positions[n.id][0],y:p.positions[n.id][1],width:260,height:68}));
 assert.equal(Object.keys(p.cells).length,graph.nodes.length);
 for(const [id,[column,row]]of Object.entries(p.cells)){assert.ok(Number.isInteger(column)&&column>=0&&Number.isInteger(row)&&row>=0);assert.deepEqual(p.positions[id],[40+64*column,40+96*row]);}
 for(const [i,r]of graph.relations.entries()){
  const a=boxes.find(n=>n.id===r.from),b=boxes.find(n=>n.id===r.to),wire=p.wires[i];
  assert.equal(wire.returning,r.kind.endsWith('exception')||p.feedbackRelations.includes(i));
  if(wire.returning&&!r.kind.endsWith('exception'))assert.ok(reach(r.to).has(r.from),'only a genuine cycle may return');
  const route=routeEdge({...r,nodes:boxes,index:i,matrix:wire,labelWidth:Math.max(30,(r.label??'').length*12),labelHeight:18});
  assert.deepEqual(route.points[0],wire.returning?[a.x+260,a.y+68*(wire.fromPort??.5)]:[a.x+32.5,a.y+68]);
  assert.deepEqual(route.points.at(-1),wire.returning?[b.x+260,b.y+68*(wire.toPort??.5)]:[b.x,b.y+34]);
  assert.equal(route.collisions,0);assert.equal(route.fallback,false);assert.doesNotMatch(route.path,/NaN|Infinity/);
  if(!wire.returning){
   assert.ok(a.x+32.5<b.x&&a.y+68<b.y+34);
   const elbow=[a.x+32.5,b.y+34];
   for(const n of boxes.filter(n=>n.id!==r.from&&n.id!==r.to)){assert.equal(rectHit(route.points[0],elbow,n),false,'reserved vertical corridor clears every card');assert.equal(rectHit(elbow,route.points.at(-1),n),false,'horizontal arrival clears every card');}
   assert.ok(route.points.slice(1).every((q,j)=>q[0]>=route.points[j][0]&&q[1]>=route.points[j][1]));
   if(r.kind==='input'){assert.equal(route.label[0],a.x+32.5+8+Math.max(30,(r.label??'').length*12)/2);assert.equal(route.label[1],a.y+82+22*wire.captionLane);}
   else assert.equal(route.label[1],b.y-14-22*wire.captionLane);
  }
 }
 assert.equal(JSON.stringify(graph),before);assert.deepEqual(matrixPlan({...graph,nodes:[...graph.nodes].reverse(),relations:[...graph.relations].reverse()},hint).positions,p.positions,'array order does not move cells');
 return p;
}
verify(design.graph,design.activityOrder);
// Saved/manual coordinates can put the target on the source's row with a card
// between them. Keep the structural bottom/left ports and avoid that card.
const manualBoxes=[{id:'source',x:40,y:40,width:260,height:68},{id:'obstacle',x:760,y:40,width:260,height:68},{id:'target',x:1080,y:40,width:260,height:68}];
const manual=routeEdge({from:'source',to:'target',kind:'input',nodes:manualBoxes,matrix:{returning:false,captionLane:0}});
assert.deepEqual(manual.points[0],[72.5,108]);assert.ok(manual.points[1][1]>108,'manual departure points out of the bottom');
assert.deepEqual(manual.points.at(-1),[1080,74]);assert.ok(manual.points.at(-2)[0]<1080,'manual arrival approaches the left port from outside');
assert.equal(manual.collisions,0);assert.equal(manual.fallback,false);
const self=routeEdge({from:'source',to:'source',kind:'business-exception',nodes:[manualBoxes[0]],matrix:{returning:true,captionLane:0}});
assert.deepEqual(self.points[0],[300,74]);assert.deepEqual(self.points.at(-1),[300,74]);
assert.ok(self.points[1][0]>300&&self.points.at(-2)[0]>300,'self exception keeps right/right outward stubs');
assert.equal(self.collisions,0);assert.doesNotMatch(self.path,/NaN|Infinity/);
// The coordinate-free contracts survive manual movement. A drag recomputes
// incident edges only, while reload recomputes the same endpoint geometry.
const plan=matrixPlan(design.graph,design.activityOrder),tab={},cache=new RouteCache();
const boxes=design.graph.nodes.map(n=>({id:n.id,x:plan.positions[n.id][0],y:plan.positions[n.id][1],width:260,height:68}));
const original=cache.update(tab,design,boxes,design.graph.relations,plan.wires);
const movedID=design.graph.relations[plan.forwardRelations[0]].from;
const moved=boxes.map(n=>n.id===movedID?{...n,x:n.x+700,y:n.y+1100}:n);
const updated=cache.update(tab,design,moved,design.graph.relations,plan.wires);
const reloaded=new RouteCache().update({},design,moved,design.graph.relations,plan.wires);
for(const [i,r]of design.graph.relations.entries()){
 if(r.from!==movedID&&r.to!==movedID){assert.equal(updated[i],original[i]);continue;}
 assert.deepEqual(updated[i],reloaded[i]);
 const a=moved.find(n=>n.id===r.from),b=moved.find(n=>n.id===r.to);
 assert.deepEqual(updated[i].points[0],plan.wires[i].returning?[a.x+260,a.y+68*(plan.wires[i].fromPort??.5)]:[a.x+32.5,a.y+68]);
 assert.deepEqual(updated[i].points.at(-1),plan.wires[i].returning?[b.x+260,b.y+68*(plan.wires[i].toPort??.5)]:[b.x,b.y+34]);
}
const A=id=>({id,type:'business'}),O=id=>({id,type:'object'}),out=(a,b)=>({kind:'output',from:a,to:b,label:'written'}),input=(a,b)=>({kind:'input',from:a,to:b,label:'read'});
const chain={version:1,nodes:[A('A'),A('B'),O('O')],relations:[out('A','O'),input('O','B')]};
assert.equal(verify(chain,['B','A']).wires.some(w=>w.returning),false,'reverse reading order never creates a false return');
const multi={version:1,nodes:[A('A'),A('B'),A('C'),O('shared')],relations:[out('A','shared'),out('B','shared'),input('shared','C')]};
const mp=verify(multi,['C','B','A']);for(const id of ['A','B'])assert.ok(mp.cells[id][1]<mp.cells.shared[1]);assert.ok(mp.cells.shared[1]<mp.cells.C[1]);assert.ok(mp.wires.every(w=>!w.returning));
verify({...chain,nodes:[...chain.nodes,O('P')],relations:[...chain.relations,out('B','P'),input('P','A'),{kind:'business-exception',from:'B',to:'A',label:'redo'}]},['A','B']);
let seed=1943;const random=()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/2**32);
for(let trial=0;trial<24;trial++){const activities=Array.from({length:8},(_,i)=>A('A'+i)),objects=Array.from({length:12},(_,i)=>O('O'+i));const relations=objects.flatMap(o=>[out(activities[Math.floor(random()*8)].id,o.id),input(o.id,activities[Math.floor(random()*8)].id)]);verify({version:1,nodes:[...activities,...objects],relations},activities.map(n=>n.id));}
// Valid Alder inputs, not just the legacy JSON-only fallback: iterative SCC,
// priority scheduling and interval reservations must scale beyond call depth.
for(const mode of ['chain','fanout']){
 const activities=Array.from({length:10000},(_,i)=>A('A'+String(i).padStart(5,'0'))),objects=Array.from({length:10000},(_,i)=>O('O'+String(i).padStart(5,'0')));
 const relations=mode==='chain'?activities.flatMap((a,i)=>[input(objects[i].id,a.id),...(i+1<activities.length?[out(a.id,objects[i+1].id)]:[])]):objects.map(o=>input(o.id,activities[0].id));
 const p=matrixPlan({version:1,nodes:[...activities,...objects],relations},activities.map(n=>n.id));assert.equal(Object.keys(p.cells).length,20000);assert.ok(Object.values(p.cells).flat().every(Number.isFinite));assert.ok(p.wires.every(w=>!w.returning));
}
console.log('matrix: approved 25 coordinates exact; reverse-order DAG/multiple writers; genuine cycles only; independent L/card oracle; seeded graphs; 20000-node valid chains and fanout');

// Independent role oracle: every nonempty subset of the three Activity roles.
for(let mask=1;mask<8;mask++){
 const roles=[0,1,2].filter(bit=>mask&(1<<bit));
 const g={version:1,nodes:[A('Focus'),A('Before'),A('After'),O('Data')],relations:[
  ...(mask&1?[out('Focus','Data'),input('Data','Focus'),{...input('Data','Focus'),label:'second data'}]:[]),
  ...(mask&2?[{kind:'business-exception',from:'Before',to:'Focus',label:'redo'}]:[]),
  ...(mask&4?[{kind:'business-exception',from:'Focus',to:'After',label:'hand back'}]:[])
 ]};
 const p=matrixPlan(g,['Focus','Before','After']);
 const expectRole=role=>(roles.indexOf(role)+1)/(roles.length+1);
 for(const [i,r]of g.relations.entries()){
  if(r.kind==='input')assert.equal(p.wires[i].toPort,expectRole(0));
  if(r.kind==='business-exception'&&r.to==='Focus')assert.equal(p.wires[i].toPort,expectRole(1));
  if(r.kind==='business-exception'&&r.from==='Focus')assert.equal(p.wires[i].fromPort,expectRole(2));
 }
 const reversed={...g,nodes:[...g.nodes].reverse(),relations:[...g.relations].reverse()},rp=matrixPlan(reversed,['Focus','Before','After']);
 for(const [i,r]of g.relations.entries()){const j=reversed.relations.findIndex(e=>e===r);assert.equal(p.wires[i].fromPort,rp.wires[j].fromPort);assert.equal(p.wires[i].toPort,rp.wires[j].toPort);}
 const boxes=g.nodes.map(n=>({id:n.id,x:p.positions[n.id][0],y:p.positions[n.id][1],width:260,height:68}));
 const k={},cache=new RouteCache(),first=cache.update(k,g,boxes,g.relations,p.wires);
 // Resize and drag the Activity. Both outgoing/incoming ports must follow it.
 const changed=boxes.map(n=>n.id==='Focus'?{...n,x:n.x+23,y:n.y+31,height:120}:n),focus=changed.find(n=>n.id==='Focus');
 const moved=cache.update(k,g,changed,g.relations,p.wires),reload=new RouteCache().update({},g,changed,g.relations,p.wires);
 for(const [i,r]of g.relations.entries()){
  assert.deepEqual(moved[i],reload[i]);
  if(r.kind==='input')assert.deepEqual(moved[i].points.at(-1),[focus.x+260,focus.y+120*expectRole(0)]);
  if(r.kind==='business-exception'&&r.to==='Focus')assert.deepEqual(moved[i].points.at(-1),[focus.x+260,focus.y+120*expectRole(1)]);
  if(r.kind==='business-exception'&&r.from==='Focus')assert.deepEqual(moved[i].points[0],[focus.x+260,focus.y+120*expectRole(2)]);
 }
 if((mask&3)===3){const data=first[g.relations.findIndex(r=>r.kind==='input')],process=first[g.relations.findIndex(r=>r.kind==='business-exception'&&r.to==='Focus')];assert.notEqual(Math.max(...data.points.map(p=>p[0])),Math.max(...process.points.map(p=>p[0])),'data and process arrivals do not share their vertical run');}
}
console.log('Activity ports: all 7 role subsets; duplicate data wires share role; relation-order independent; resize/drag/reload; separate return runs');

// Reviewer regression: the shared Requester Object has TWO right-edge roles,
// even though every wire carries data: returning Output arrival and Input exit.
const requesterPlan=matrixPlan(design.graph,design.activityOrder),requesterPos=requesterPlan.positions['依頼者'];
const requesterBoxes=design.graph.nodes.map(n=>({id:n.id,x:requesterPlan.positions[n.id][0],y:requesterPlan.positions[n.id][1],width:260,height:68}));
const requesterRoutes=new RouteCache().update({},design,requesterBoxes,design.graph.relations,requesterPlan.wires);
let arrivals=0,departures=0;
for(const [i,r]of design.graph.relations.entries()){
 const wire=requesterPlan.wires[i],route=requesterRoutes[i];if(!wire.returning)continue;
 if(r.to==='依頼者'){arrivals++;assert.equal(wire.toPort,1/3);assert.deepEqual(route.points.at(-1),[requesterPos[0]+260,requesterPos[1]+68/3]);}
 if(r.from==='依頼者'){departures++;assert.equal(wire.fromPort,2/3);assert.deepEqual(route.points[0],[requesterPos[0]+260,requesterPos[1]+68*2/3]);}
 const left=route.label[0]-Math.max(30,r.label.length*12)/2,y=route.label[1];
 assert.equal(y,route.points[0][1],'caption shares departure bend height');
 assert.ok(left>route.points[0][0],'caption follows the right-hand bend');
 assert.equal(left,Math.max(...route.points.map(p=>p[0]))+8,'caption starts immediately after its return bend');
}
assert.equal(arrivals,4);assert.equal(departures,1);
console.log('Requester Object: four return arrivals share 1/3, return exit uses 2/3; captions immediately follow their return bend');
