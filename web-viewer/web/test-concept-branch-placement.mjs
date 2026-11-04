import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {registerHooks} from 'node:module';

registerHooks({resolve(s,c,n){if((s.startsWith('./')||s.startsWith('../'))&&!/\.[a-z0-9]+$/i.test(s)){try{return n(s+'.ts',c)}catch{}try{return n(s+'.js',c)}catch{}}return n(s,c)}});
const {parseDocument}=await import('../src/document-input.ts');
const {createConceptViews}=await import('../src/concept-views.ts');
const {conceptCorrelationGrid,conceptDiagram}=await import('../src/concept-layout.js');

const authority=readFileSync('verification/concept-branch-placement.check-items.json','utf8');
assert.deepEqual(JSON.parse(authority).checks.map(c=>c.id),['CONCEPT-BRANCH-001','CONCEPT-BRANCH-002','CONCEPT-BRANCH-003']);
const crosses=(p,q)=>{
 const pv=p.a.x===p.b.x,qv=q.a.x===q.b.x;if(pv===qv)return false;
 const v=pv?p:q,h=pv?q:p;
 return v.a.x>Math.min(h.a.x,h.b.x)&&v.a.x<Math.max(h.a.x,h.b.x)&&h.a.y>Math.min(v.a.y,v.b.y)&&h.a.y<Math.max(v.a.y,v.b.y);
};
function verify(diagram,edges){
 const {boxes,routing}=diagram;
 assert.equal(routing.routes.length,edges.length,'all relationships remain present');
 assert.equal(routing.labels.length,edges.length*2,'both multiplicities remain present');
 assert(routing.labels.every(label=>!label.conflict),'multiplicity labels remain clear');
 const cards=[...boxes.values()];
 for(let i=0;i<cards.length;i++)for(let j=0;j<i;j++){
  const a=cards[i],b=cards[j];assert(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y,'cards do not overlap');
 }
 for(const route of routing.routes){assert(!route.unrouted&&!route.shapeObstacles.length,'each line avoids unrelated cards');assert.equal(route.points.length,3,'each 1:N line has one corner');}
 for(let i=0;i<routing.routes.length;i++)for(let j=0;j<i;j++){
  assert(!routing.routes[i].segments.some(p=>routing.routes[j].segments.some(q=>crosses(p,q))),'unrelated lines do not cross');
 }
}

// An unrelated branch appears before the first branch's children in the input.
const ids=['p','a','b','bc','as','ar'];
const edges=[['p','a','1','0..N','down'],['p','b','1','0..N','down'],['b','bc','1','0..N','down'],['a','as','1','0..N','down'],['a','ar','1','0..N','down']];
const sizes=new Map(ids.map(id=>[id,{w:220,h:100}])),input=JSON.stringify([ids,edges,[...sizes]]);
const diagram=conceptDiagram(ids,edges,sizes);verify(diagram,edges);
assert(diagram.boxes.get('as').y<diagram.boxes.get('b').y,'a child moves ahead of an unrelated branch');
assert.deepEqual(conceptDiagram([...ids],structuredClone(edges),sizes),diagram,'placement is deterministic');
assert.equal(JSON.stringify([ids,edges,[...sizes]]),input,'layout does not mutate the input');
const saved=new Map([['as',{x:912,y:211}]]),custom=conceptDiagram(ids,edges,sizes,saved);
assert.deepEqual({x:custom.boxes.get('as').x,y:custom.boxes.get('as').y},saved.get('as'),'saved manual coordinates take precedence');

// A node with two prerequisites must not be emitted before either one.
const joinIds=['root','left','right','join'],joinEdges=[['root','left','1','0..N','down'],['root','right','1','0..N','down'],['left','join','1','0..N','down'],['right','join','1','0..N','down']];
const order=conceptCorrelationGrid(joinIds,joinEdges,{branchFirst:true}).order;
assert(order.indexOf('join')>order.indexOf('left')&&order.indexOf('join')>order.indexOf('right'));
const cyclic=conceptCorrelationGrid(['x','y'],[['x','y','1','0..N','down'],['y','x','1','0..N','down']],{branchFirst:true});
assert.equal(new Set(cyclic.order).size,2,'cycles terminate without dropping concepts');

const pkg=readFileSync('../business-design/alder/json-normalized-model-review.json','utf8'),context=parseDocument(pkg).model;
const views=createConceptViews({business:context.business,model:context.concepts[0]}),g=views.authoredOverviewGraph();
const realSizes=new Map(g.ids.map(id=>{const t=g.tables[id];return[id,{w:Math.max(220,t.name.length*14+64,...t.fields.map(([,name])=>name.length*14+24)),h:44+t.fields.length*25}];}));
const result=conceptDiagram(g.ids,g.edges,realSizes);verify(result,g.edges);
const top=id=>result.boxes.get('overview-n-'+id).y;
for(const child of ['step','result','decision'])assert(top(child)>top('activity')&&top(child)<top('object'),child+' remains grouped with Activity');
assert.equal(createHash('sha256').update(readFileSync('../work/normalization-candidate/acceptance.json')).digest('hex'),'fdc3609f594204ccd96d65f2e3a4fd4e2effd08a02f2c40e3bd23583d65d1bdb','previous review authority is unchanged');
console.log('CONCEPT-BRANCH-001..003: independent branches, zero-crossing overview, constraints and saved coordinates verified.');
