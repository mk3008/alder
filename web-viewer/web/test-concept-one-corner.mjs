import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {registerHooks} from 'node:module';
import {JSDOM} from 'jsdom';
import {build} from 'esbuild';

registerHooks({resolve(s,c,n){if((s.startsWith('./')||s.startsWith('../'))&&!/\.[a-z0-9]+$/i.test(s)){try{return n(s+'.ts',c)}catch{}try{return n(s+'.js',c)}catch{}}return n(s,c)}});
const {conceptCorrelationGrid,conceptDiagram}=await import('../src/concept-layout.js');
const {conceptNeighborhood}=await import('../src/concept-neighborhood.js');
const {routeER}=await import('../src/concept-routing.js');
const {parseDocument}=await import('../src/document-input.ts');
const {createConceptViews}=await import('../src/concept-views.ts');
const {tables,edges,reviewGraph}=await import('./fixtures/concept-sample.ts');

const authority=readFileSync('verification/concept-one-corner.check-items.json');
assert.equal(createHash('sha256').update(authority).digest('hex'),'6ccfb35ca1dfc5d390f7df242de74c20ed05a6645714dca716d5d156bfb358f6');
const oracle=JSON.parse(authority);
assert.deepEqual(oracle.checks.map(c=>c.id),['CONCEPT-CORNER-001','CONCEPT-CORNER-002','CONCEPT-CORNER-003']);
function inside(a,b,r){
 const overlap=(a,b,c,d)=>Math.min(Math.max(a,b),Math.max(c,d))>Math.max(Math.min(a,b),Math.min(c,d));
 return a.x===b.x?a.x>r.x&&a.x<r.x+r.w&&overlap(a.y,b.y,r.y,r.y+r.h):a.y===b.y&&a.y>r.y&&a.y<r.y+r.h&&overlap(a.x,b.x,r.x,r.x+r.w);
}
function check(view, cards, name){
 const sizes=new Map(view.ids.map(id=>[id,{w:Math.max(220,cards[id].name.length*14+64,...cards[id].fields.map(([,field])=>field.length*14+24)),h:44+cards[id].fields.length*25}]));
 const grid=conceptCorrelationGrid(view.ids,view.edges),flat=grid.cells.flatMap(row=>row.flat());
 assert.equal(grid.cells.length,view.ids.length,name+' has one row per concept');
 assert(grid.cells.every(row=>row.length===view.ids.length),name+' has one column per concept');
 assert.equal(flat.length,view.edges.length,name+' preserves every relation in its matrix');
 const result=conceptDiagram(view.ids,view.edges,sizes);
 assert.equal(result.routing.routes.length,view.edges.length,name+' preserves every drawn relation');
 for(const route of result.routing.routes){
  assert(!route.unrouted,`${name}: ${route.from} -> ${route.to} has a valid one-corner route`);
  assert.equal((route.d.match(/Q/g)||[]).length,1,`${name}: exactly one rounded corner`);
  assert.equal(route.points.length,3,`${name}: one logical corner`);
  const [start,corner,end]=route.points,source=result.boxes.get(route.from),target=result.boxes.get(route.to);
  assert.equal(corner.x,start.x);assert.equal(corner.y,end.y);
  if(route.kind==='reference'){
   assert.equal(start.y,source.y);assert.equal(end.x,target.x+target.w);
   assert(start.x>end.x&&start.y>end.y,`${name}: reference is ┐`);
  }else{
   assert.equal(start.y,source.y+source.h);assert.equal(end.x,target.x);
   assert(start.x<end.x&&start.y<end.y,`${name}: containment is └`);
  }
  for(const [id,box]of result.boxes)for(const {a,b}of route.segments)if(id!==route.from&&id!==route.to)assert(!inside(a,b,box),`${name}: ${route.from} -> ${route.to} crosses ${id}`);
 }
 assert(!result.routing.labels.some(label=>label.conflict),name+' cardinalities remain readable');
}
const context=parseDocument(readFileSync('../business-design/alder/json-structure-review.json','utf8')).model;
const views=createConceptViews({business:context.business,model:context.concepts[0]}),overview=views.overviewGraph();
check(overview,overview.tables,'JSON structure overview');
const allIds=Object.keys(views.tables),step=conceptNeighborhood(allIds,views.edges,'fmt-step');
assert(step.edges.some(([a,b,,,kind])=>a==='fmt-order'&&b==='fmt-step'&&kind==='reference'),'covers the reported multi-bend relation');
assert(step.edges.some(([a,b,,,kind])=>a==='fmt-dependency'&&b==='fmt-step'&&kind==='reference'),'covers the prerequisite reference');
check(step,views.tables,'Step detail');
const purchaseIds=Object.keys(tables);
check({ids:purchaseIds,edges},tables,'purchase overview');
for(const id of purchaseIds)check(conceptNeighborhood(purchaseIds,edges,id),tables,'purchase '+id);

const fixed=new Map([['a',{x:400,y:20,w:220,h:100}],['b',{x:40,y:240,w:220,h:100}]]);
const blocked=routeER(fixed,[['a','b','1','1','down']]).routes[0];
assert(blocked.unrouted,'saved reverse placement is not silently rerouted');
assert.equal(blocked.d,'','do not draw an elbow in the forbidden direction or a multi-bend detour');
const cycle=conceptDiagram(['a','b'],[['a','b','1','1','down'],['b','a','1','1','down']],new Map([['a',{w:220,h:100}],['b',{w:220,h:100}]]));
assert.equal(cycle.routing.routes.length,2,'a contradictory cycle keeps both relationships');
assert(cycle.routing.routes.some(route=>route.unrouted&&!route.d),'an impossible one-corner cycle is reported');

// A saved layout that cannot satisfy the constraint must keep both positions
// and expose the relation and both counts to the person reviewing the model.
const code=(await build({entryPoints:['src/concept-canvas.js'],bundle:true,write:false,format:'iife',loader:{'.css':'empty'}})).outputFiles[0].text;
const w=new JSDOM(readFileSync('concept.html','utf8'),{url:'https://viewer.test/concept.html',runScripts:'outside-only',pretendToBeVisual:true}).window;
w.HTMLCanvasElement.prototype.getContext=()=>({font:'',measureText:value=>({width:value.length*14})});w.scrollTo=()=>{};
w.HTMLElement.prototype.scrollTo=function(x,y){this.scrollLeft=x;this.scrollTop=y;};w.SVGElement.prototype.focus=()=>{};
try{
 w.localStorage.setItem('alder-concept-canvas-v9:/concept.html:corner-test:overview',JSON.stringify({positions:{a:{x:400,y:20},b:{x:40,y:240}},zoom:1,locked:true}));
 w.eval(code);
 const graph={ids:['a','b'],tables:{a:{name:'親',fields:[]},b:{name:'子',fields:[]}},edges:[['a','b','1','0..N','down']],regions:[],handoffs:[],fieldLinks:[]};
 w.dispatchEvent(new w.MessageEvent('message',{origin:w.location.origin,source:w.parent,data:{type:'alder-concept-data',graph,documentKey:'corner-test',viewKey:'overview'}}));
 const warning=w.document.querySelector('.routing-warning').textContent;
 assert.match(warning,/親（1） → 子（0\.\.N）/,'unrenderable relation and counts remain visible');
 assert.equal(w.document.querySelector('[data-node="a"] .concept-select>rect').getAttribute('x'),'400','saved position is retained');
 assert.equal(w.document.querySelector('.wire').dataset.unrouted,'true');
 assert.equal(w.document.querySelector('.wire').getAttribute('d'),'','no multi-corner detour is drawn');
}finally{w.close();}
const regionWindow=new JSDOM(readFileSync('concept.html','utf8'),{url:'https://viewer.test/concept.html',runScripts:'outside-only',pretendToBeVisual:true}).window;
regionWindow.HTMLCanvasElement.prototype.getContext=()=>({font:'',measureText:value=>({width:value.length*14})});regionWindow.scrollTo=()=>{};
regionWindow.HTMLElement.prototype.scrollTo=function(x,y){this.scrollLeft=x;this.scrollTop=y;};regionWindow.SVGElement.prototype.focus=()=>{};
try{
 regionWindow.eval(code);
 regionWindow.dispatchEvent(new regionWindow.MessageEvent('message',{origin:regionWindow.location.origin,source:regionWindow.parent,data:{type:'alder-concept-data',graph:reviewGraph('group-result'),documentKey:'purchase',viewKey:'group-result'}}));
 const handoffs=[...regionWindow.document.querySelectorAll('.concept-handoff')];
 assert.equal(handoffs.length,2,'both subsystem handoffs remain visible');
 for(const handoff of handoffs){assert.equal(handoff.dataset.unrouted,'false');assert.equal((handoff.getAttribute('d').match(/Q/g)||[]).length,1,'each subsystem handoff uses one corner');assert(regionWindow.document.querySelector(`[data-handoff-label="${handoff.dataset.handoffId}"]`),'handoff label remains visible');}
 assert.equal(handoffs[1].dataset.flowDirection,'return');assert(handoffs[1].classList.contains('returning'));
}finally{regionWindow.close();}
console.log('CONCEPT-CORNER-001..003: matrix, exact corners, real models and impossible placements verified.');
