import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {registerHooks} from 'node:module';

registerHooks({resolve(s,c,n){if((s.startsWith('./')||s.startsWith('../'))&&!/\.[a-z0-9]+$/i.test(s)){try{return n(s+'.ts',c)}catch{}try{return n(s+'.js',c)}catch{}}return n(s,c)}});
const {routeER}=await import('../src/concept-routing.js');
const {conceptDiagram}=await import('../src/concept-layout.js');
const {conceptNeighborhood}=await import('../src/concept-neighborhood.js');
const {parseDocument}=await import('../src/document-input.ts');
const {createConceptViews}=await import('../src/concept-views.ts');

const authority=readFileSync('verification/concept-reference-routing.check-items.json');
assert.equal(createHash('sha256').update(authority).digest('hex'),'43aad9abfc64e4be353963c6c1ace38498ece338730479f833e9621dd1399e4a');
assert.deepEqual(JSON.parse(authority).checks.map(c=>c.id),['CONCEPT-REFERENCE-001','CONCEPT-REFERENCE-002','CONCEPT-REFERENCE-003']);

function checkPorts(route,boxes){
 const from=boxes.get(route.from),to=boxes.get(route.to),first=route.points[0],last=route.points.at(-1);
 assert.equal(route.ports[0].table,route.from);
 assert.equal(route.ports[1].table,route.to);
 if(route.kind==='reference'){
  assert.equal(route.ports[0].side,'top','reference departs the referencing card at its top');
  assert.equal(route.ports[1].side,'right','reference enters the referenced card at its right');
  assert.equal(first.y,from.y);assert.equal(last.x,to.x+to.w);
 }else{
  assert.equal(route.ports[0].side,'bottom','containment departs the parent below');
  assert.equal(route.ports[1].side,'left','containment enters the child on the left');
  assert.equal(first.y,from.y+from.h);assert.equal(last.x,to.x);
 }
 assert.deepEqual(route.ports.map(p=>[p.p.x,p.p.y]),[[first.x,first.y],[last.x,last.y]],'drawn endpoints equal distinct allocated ports');
}

const boxes=new Map([['step',{x:50,y:50,w:240,h:180}],['dependency',{x:350,y:300,w:230,h:100}]]);
const routes=routeER(boxes,[['step','dependency','1','0..N','down'],['dependency','step','0..N','1','reference']]);
assert.equal(routes.routes.length,2,'containment and reference remain separate');
for(const route of routes.routes){checkPorts(route,boxes);assert.equal(route.unrouted,false,'simple case is routable');}
assert.deepEqual(routes.routes.map(r=>[r.fromCount,r.toCount]),[['1','0..N'],['0..N','1']]);
assert.equal(routes.labels.length,4,'each endpoint keeps its cardinality');

const pkg=JSON.parse(readFileSync('../business-design/alder/json-structure-review.json','utf8'));
const ctx=parseDocument(JSON.stringify(pkg)).model;
const views=createConceptViews({business:ctx.business,model:ctx.concepts[0]});
const g=views.overviewGraph();
const relation=g.edges.find(([a,b,,,kind])=>a==='overview-dependency'&&b==='overview-step'&&kind==='reference');
assert(relation,'the diagram keeps the actual dependency-to-step reference');
for(const focus of ['overview-step','overview-dependency']){
 const view=conceptNeighborhood(g.ids,g.edges,focus),sizes=new Map(view.ids.map(id=>[id,{w:300,h:44+g.tables[id].fields.length*25}]));
 const out=conceptDiagram(view.ids,view.edges,sizes),repeat=conceptDiagram([...view.ids],structuredClone(view.edges),sizes);
 assert.deepEqual(out,repeat,'the same selected graph has the same routing');
 const reference=out.routing.routes.find(r=>r.from==='overview-dependency'&&r.to==='overview-step'&&r.kind==='reference');
 assert(reference,'reference is retained in both detail selections');checkPorts(reference,out.boxes);
 const containment=out.routing.routes.find(r=>r.from==='overview-step'&&r.to==='overview-dependency'&&r.kind==='down');
 assert(containment,'the separately owned dependency remains');checkPorts(containment,out.boxes);
}
console.log('CONCEPT-REFERENCE-001/002: separate parent/reference ports, endpoint counts and actual model selections verified.');
