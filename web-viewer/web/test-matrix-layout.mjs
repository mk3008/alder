import {assertCaptionRows} from './caption-row-oracle.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {matrixPlan,directionalReturnWires} from '../src/matrix-layout.ts';
import {routeEdge} from '../src/routing.ts';
import {parseDesign} from '../src/graph.ts';
import {RouteCache} from '../src/route-cache.ts';
const design=parseDesign(readFileSync('../business-design/alder/README.md','utf8'));
const accepted=JSON.parse(readFileSync(new URL('./authorities/overview-matrix-c407.json',import.meta.url),'utf8'));
const compactPlan=matrixPlan(design.graph,design.activityOrder),compact=compactPlan.positions;
for(const [id,[x]] of Object.entries(accepted))assert.equal(compact[id][0],x,'approved horizontal corridors remain exact');
assertCaptionRows(compact,design.graph.relations.filter((r,i)=>!compactPlan.wires[i].returning),Object.keys(accepted).sort((a,b)=>accepted[a][1]-accepted[b][1]));
const rectHit=(a,b,n)=>a[0]===b[0]?a[0]>n.x&&a[0]<n.x+260&&Math.max(a[1],b[1])>n.y&&Math.min(a[1],b[1])<n.y+68:a[1]>n.y&&a[1]<n.y+68&&Math.max(a[0],b[0])>n.x&&Math.min(a[0],b[0])<n.x+260;
function verify(graph,hint){
 const before=JSON.stringify(graph),p=matrixPlan(graph,hint),normal=graph.relations.filter(r=>r.kind==='input'||r.kind==='output');
 const reach=id=>{const seen=new Set([id]),q=[id];for(let i=0;i<q.length;i++)for(const r of normal)if(r.from===q[i]&&!seen.has(r.to)){seen.add(r.to);q.push(r.to);}return seen;};
 const boxes=graph.nodes.map(n=>({id:n.id,x:p.positions[n.id][0],y:p.positions[n.id][1],width:260,height:68}));
 assert.equal(Object.keys(p.cells).length,graph.nodes.length);assertCaptionRows(p.positions,graph.relations.filter((r,i)=>!p.wires[i].returning));
 for(const [id,[column,row]]of Object.entries(p.cells)){assert.ok(Number.isInteger(column)&&column>=0&&Number.isInteger(row)&&row>=0);assert.equal(p.positions[id][0],40+64*column);}
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
   assert.ok(route.label[0]>=a.x+32.5+8+Math.max(30,(r.label??'').length*12)/2);
   assert.equal(route.label[1],a.y+82+wire.captionLane*22,'both normal kinds stay directly below their source');
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
// Move outside unrelated route corridors: nonincident wires intentionally stay cached.
const moved=boxes.map(n=>n.id===movedID?{...n,x:n.x+700,y:n.y+10000}:n);
const updated=cache.update(tab,design,moved,design.graph.relations,plan.wires);
const reloaded=new RouteCache().update({},design,moved,design.graph.relations,plan.wires);
for(const [i,r]of design.graph.relations.entries()){
 if(r.from!==movedID&&r.to!==movedID){assert.equal(updated[i].path,original[i].path);assert.equal(updated[i].points,original[i].points,'nonincident geometry stays cached');assert.deepEqual(updated[i].label,reloaded[i].label,'caption slots are history independent');continue;}
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
console.log('matrix: compact 25 rows, approved horizontal corridors; reverse-order DAG/multiple writers; genuine cycles only; independent L/card oracle; seeded graphs; 20000-node valid chains and fanout');

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
 if(r.to==='依頼者'){arrivals++;assert.equal(wire.toPort,2/3);assert.deepEqual(route.points.at(-1),[requesterPos[0]+260,requesterPos[1]+68*2/3]);}
 if(r.from==='依頼者'){departures++;assert.equal(wire.fromPort,1/3);assert.deepEqual(route.points[0],[requesterPos[0]+260,requesterPos[1]+68/3]);}
 const left=route.label[0]-Math.max(30,r.label.length*12)/2,y=route.label[1];
 assert.equal(y,route.points[0][1],'caption shares departure bend height');
 assert.ok(left>route.points[0][0],'caption follows the right-hand bend');
 assert.ok(left>=Math.max(...route.points.map(p=>p[0]))+8,'return caption stays beyond bend, with horizontal collision escape');
}
assert.equal(arrivals,4);assert.equal(departures,1);
console.log('Requester Object: four return arrivals share lower 2/3, upward return exit uses upper 1/3; captions immediately follow their return bend');

{
// Yellow-circle regression: upper peers use upper ports; the lower data peer
// arrives below them. Compare actual right-side crossings against fixed roles.
const focus='検査項目の設計',right=requesterPlan.positions[focus][0]+260,top=requesterPlan.positions[focus][1];
const incidentIndices=design.graph.relations.flatMap((r,i)=>requesterPlan.wires[i].returning&&(r.from===focus||r.to===focus)?[i]:[]);
assert.equal(incidentIndices.length,3);
for(const i of incidentIndices){const r=design.graph.relations[i],w=requesterPlan.wires[i];if(r.to===focus)assert.equal(w.toPort,3/4);else if(r.kind.endsWith('exception'))assert.equal(w.fromPort,1/4);else assert.equal(w.fromPort,1/2);}
const role=(r,end)=>r.kind.endsWith('exception')?(end==='from'?2:1):(end==='from'?3:0),occupied=new Map();
for(const [i,r]of design.graph.relations.entries())if(requesterPlan.wires[i].returning)for(const end of ['from','to']){const id=r[end],set=occupied.get(id)??new Set();set.add(role(r,end));occupied.set(id,set);}
const oldPort=(id,k)=>{const list=[...occupied.get(id)].sort();return (list.indexOf(k)+1)/(list.length+1);};
const oldWires=requesterPlan.wires.map((w,i)=>{const r=design.graph.relations[i];return w.returning?{...w,fromPort:oldPort(r.from,role(r,'from')),toPort:oldPort(r.to,role(r,'to')),returnLane:occupied.get(r.to).size>1&&r.kind.endsWith('exception')?1:0}:w;});
const oldRoutes=new RouteCache().update({},design,requesterBoxes,design.graph.relations,oldWires);
function nearCardCrossings(routes){const hits=new Set();for(let a=0;a<incidentIndices.length;a++)for(let b=a+1;b<incidentIndices.length;b++){const p=routes[incidentIndices[a]].points,q=routes[incidentIndices[b]].points;for(let i=1;i<p.length;i++)for(let j=1;j<q.length;j++){let h=[p[i-1],p[i]],v=[q[j-1],q[j]];if(h[0][0]===h[1][0]&&v[0][1]===v[1][1])[h,v]=[v,h];if(h[0][1]!==h[1][1]||v[0][0]!==v[1][0])continue;const x=v[0][0],y=h[0][1];if(x>Math.min(h[0][0],h[1][0])+1e-5&&x<Math.max(h[0][0],h[1][0])-1e-5&&y>Math.min(v[0][1],v[1][1])+1e-5&&y<Math.max(v[0][1],v[1][1])-1e-5&&x>right&&x<right+120&&y>top&&y<top+68)hits.add([a,b,x,y].join(':'));}}return hits.size;}
assert.ok(nearCardCrossings(oldRoutes)>0,'fixed semantic role order reproduces marked crossings');assert.equal(nearCardCrossings(requesterRoutes),0,'directional ports and corridors remove marked card-side crossings');
// A role shared by peers above AND below remains one role. Distinct peer IDs
// (not repeated copies of a wire) determine the stable directional preference.
const mixed={version:1,nodes:[A('F'),A('Up'),A('Down'),O('D')],relations:[{kind:'business-exception',from:'Up',to:'F',label:'u'},{kind:'business-exception',from:'Down',to:'F',label:'d'},input('D','F')]};
const mp={F:[0,200],Up:[0,0],Down:[0,400],D:[0,500]},mw=mixed.relations.map(()=>({returning:true,captionLane:0})),mixedWires=directionalReturnWires(mixed,mw,mp);
assert.equal(mixedWires[0].toPort,mixedWires[1].toPort);assert.equal(mixedWires[0].toPort,1/3);assert.equal(mixedWires[2].toPort,2/3);
const duplicated={...mixed,relations:[...mixed.relations,...Array(10).fill(mixed.relations[1])]},dw=directionalReturnWires(duplicated,duplicated.relations.map(()=>({returning:true,captionLane:0})),mp);assert.deepEqual(dw.slice(0,3),mixedWires);
console.log('Directional role order: marked card-side crossings '+nearCardCrossings(oldRoutes)+' -> 0; mixed-side shared roles and duplicate-peer stability');
}
