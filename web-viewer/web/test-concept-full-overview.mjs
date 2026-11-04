import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {registerHooks} from 'node:module';
import {JSDOM} from 'jsdom';
import {build} from 'esbuild';

registerHooks({resolve(s,c,n){if((s.startsWith('./')||s.startsWith('../'))&&!/\.[a-z0-9]+$/i.test(s)){try{return n(s+'.ts',c)}catch{}try{return n(s+'.js',c)}catch{}}return n(s,c)}});
const {parseDocument}=await import('../src/document-input.ts');
const {createConceptViews}=await import('../src/concept-views.ts');
const {conceptNeighborhood}=await import('../src/concept-neighborhood.js');
const authority=JSON.parse(readFileSync('verification/concept-full-overview.check-items.json','utf8'));
assert.deepEqual(authority.checks.map(c=>c.id),['CONCEPT-ALL-001','CONCEPT-ALL-002']);

const read=path=>parseDocument(readFileSync(path,'utf8')).model;
const context=read('../business-design/alder/json-normalized-model-review.json'),model=context.concepts[0],original=JSON.stringify(model);
const views=createConceptViews({business:context.business,model}),partial=views.authoredOverviewGraph(),full=views.overviewGraph();
const conceptId=(graph,id)=>graph.tables[id].conceptId??id;
assert.equal(partial.ids.length,13,'the previous projection remains available');
assert.equal(full.ids.length,25);assert.equal(full.edges.length,54);
assert.deepEqual([...new Set(full.ids.map(id=>conceptId(full,id)))].sort(),model.concepts.map(c=>c.id).sort(),'every concept is visible');
const edgeKey=(from,to,a,b,kind)=>JSON.stringify([from,to,a,b,kind]);
assert.deepEqual(full.edges.map(([a,b,x,y,k])=>edgeKey(conceptId(full,a),conceptId(full,b),x,y,k)).sort(),
 model.relations.map(r=>edgeKey(r.fromConceptId,r.toConceptId,r.fromLabel,r.toLabel,r.kind)).sort(),'all 54 relations and multiplicities are retained');
assert.deepEqual(partial.ids.map(id=>full.tables[id]),partial.ids.map(id=>partial.tables[id]),'authored names, fields and mappings stay intact');
assert.deepEqual(full.regions,partial.regions);assert.equal(JSON.stringify(model),original,'overview construction does not edit the source');
const activity=conceptNeighborhood(Object.keys(views.tables),views.edges,'n-activity');
assert(activity.ids.every(id=>full.ids.some(viewId=>conceptId(full,viewId)===id)),'the overview contains all Activity detail cards');
assert(full.fieldLinks.some(x=>x.owner==='overview-n-activity'&&x.from==='overview-n-activity'&&x.to==='overview-n-who'&&x.informationId==='n-activity-field-3'));

// This is a separate existing document, not the 25-card candidate.
const old=read('../business-design/alder/json-structure-review.json');
const oldViews=createConceptViews({business:old.business,model:old.concepts[0]}),oldFull=oldViews.overviewGraph();
assert.equal(oldViews.authoredOverviewGraph().ids.length,11);
assert.deepEqual([...new Set(oldFull.ids.map(id=>conceptId(oldFull,id)))].sort(),old.concepts[0].concepts.map(c=>c.id).sort());

// A generated view ID must never overwrite a separately authored card.
const collision=structuredClone(model),author=collision.presentation.subsystemViews,first=author.nodes[0],oldId=first.id;
first.id='overview-n-exchange';for(const edge of author.edges){if(edge.fromViewId===oldId)edge.fromViewId=first.id;if(edge.toViewId===oldId)edge.toViewId=first.id;}
const collided=createConceptViews({business:context.business,model:collision}).overviewGraph();
assert.equal(new Set(collided.ids).size,collided.ids.length);assert.equal(collided.tables['overview-n-exchange'].conceptId,first.conceptId);
assert.equal(collided.tables['overview-n-exchange-2'].conceptId,'n-exchange');
const absent=structuredClone(model);delete absent.presentation.subsystemViews;
const fallback=createConceptViews({business:context.business,model:absent}).overviewGraph();
assert.equal(fallback.ids.length,25);assert.equal(fallback.edges.length,54);

const code=(await build({entryPoints:['src/concept-canvas.js'],bundle:true,write:false,format:'iife',loader:{'.css':'empty'}})).outputFiles[0].text;
const w=new JSDOM(readFileSync('concept.html','utf8'),{url:'https://viewer.test/concept.html',runScripts:'outside-only',pretendToBeVisual:true}).window;
w.HTMLCanvasElement.prototype.getContext=()=>({measureText:value=>({width:value.length*14})});w.scrollTo=()=>{};
w.HTMLElement.prototype.scrollTo=function(x,y){this.scrollLeft=x;this.scrollTop=y;};w.SVGElement.prototype.focus=()=>{};
try{
 const sent=[],parent={location:{origin:'https://viewer.test',protocol:'https:'},postMessage:message=>sent.push(message)};Object.defineProperty(w,'parent',{value:parent});
 w.eval(code);w.dispatchEvent(new w.MessageEvent('message',{origin:'https://viewer.test',source:parent,data:{type:'alder-concept-data',graph:full,documentKey:'full-overview',viewKey:'overview'}}));
 assert.equal(w.document.querySelectorAll('.node').length,25);assert.equal(w.document.querySelectorAll('.wire').length,54);
 for(const wire of w.document.querySelectorAll('.wire')){
  if(wire.dataset.unrouted==='true'){
   assert.equal(wire.getAttribute('d'),'');const warning=w.document.querySelector('.routing-warning').textContent;
   assert(warning.includes(full.tables[wire.dataset.from].name)&&warning.includes(full.tables[wire.dataset.to].name),'unrouted relationship is named');
  }else if(wire.dataset.from!==wire.dataset.to){
   assert((wire.getAttribute('d').match(/Q/g)||[]).length<=1,'the one-corner constraint is retained');
  }
 }
 const open=w.document.querySelector('[data-concept-open="overview-n-exchange"]');assert(open,'previously omitted card can be opened');open.click();
 assert(sent.some(m=>m.type==='alder-concept-open'&&m.id==='n-exchange'),'opening returns the real concept ID');
}finally{w.close();}
console.log('CONCEPT-ALL-001/002: all concepts and relationships, identity, source preservation, canvas warnings and detail navigation verified.');
