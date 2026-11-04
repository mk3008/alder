import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {registerHooks} from 'node:module';
import {JSDOM} from 'jsdom';
import {build} from 'esbuild';
import {validate} from '../../tools/document_storage/core.mjs';
import {restorePackage} from '../../work/normalization-candidate/normalize.mjs';
registerHooks({resolve(s,c,n){if((s.startsWith('./')||s.startsWith('../'))&&!/\.[a-z0-9]+$/i.test(s)){try{return n(s+'.ts',c)}catch{}try{return n(s+'.js',c)}catch{}}return n(s,c)}});
const {parseDocument}=await import('../src/document-input.ts');
const {createConceptViews}=await import('../src/concept-views.ts');
const {conceptNeighborhood}=await import('../src/concept-neighborhood.js');
const {conceptDiagram}=await import('../src/concept-layout.js');
const read=path=>JSON.parse(readFileSync(path,'utf8'));
const acceptance=readFileSync('../work/normalization-candidate/acceptance.json');
assert.equal(createHash('sha256').update(acceptance).digest('hex'),'fdc3609f594204ccd96d65f2e3a4fd4e2effd08a02f2c40e3bd23583d65d1bdb');
const normalized=read('../work/normalization-candidate/example-normalized.json'),source=read('../work/normalization-candidate/example-source.json');
assert.deepEqual(restorePackage(normalized),source);assert.equal(normalized.entities.activities.find(x=>x.id==='score-review-one').whoId,'score-reviewer');
assert.equal(normalized.entities.activities.find(x=>x.id==='score-review-two').whoId,'score-reviewer');assert.equal(normalized.entities.activities.find(x=>x.id==='score-review-undecided').whoId,null);

const original=read('../business-design/alder/json-structure-review.json'),pkg=read('../business-design/alder/json-normalized-model-review.json');
assert.deepEqual(pkg.documents.filter(d=>d.kind!=='conceptModel'),original.documents.filter(d=>d.kind!=='conceptModel'),'BD and Check source and human states remain untouched');
validate(pkg);const context=parseDocument(JSON.stringify(pkg)).model,model=context.concepts[0],views=createConceptViews({business:context.business,model}),overview=views.overviewGraph();
assert.equal(model.meta.modelStatus,'normalized-study');assert.match(model.meta.scope,/Business Designのみ/);
assert(model.concepts.find(c=>c.id==='n-who').information.every(x=>x.name!=='未決'),'unknown is not a Who attribute');
assert(model.concepts.find(c=>c.id==='n-activity').information.some(x=>x.name.includes('実行主体')));
assert(overview.ids.includes('overview-n-who')&&overview.ids.includes('overview-n-activity'),'the Who and Activity are visible in the labelled summary');
const expected=['n-activity','n-who','0..N','0..1','reference'];assert.deepEqual(views.edges.find(([from,to])=>from==='n-activity'&&to==='n-who'),expected);
assert.deepEqual(views.edges.find(([from,to])=>from==='n-condition'&&to==='n-axis'),['n-condition','n-axis','1..N','1','reference'],'each axis occurs once in every nonempty row');
assert.deepEqual(overview.edges.find(([from,to])=>from==='overview-n-activity'&&to==='overview-n-who'),['overview-n-activity','overview-n-who','0..N','0..1','reference']);
assert(overview.fieldLinks.some(x=>x.owner==='overview-n-activity'&&x.from==='overview-n-activity'&&x.to==='overview-n-who'),'Who selection is mapped to the actual activity field');
assert.match(model.subsystems[0].name,/主要構造・全関係は一覧/,'the smaller overview is labelled');
for(const focus of ['n-who','n-activity']){
 const ids=Object.keys(views.tables),view=conceptNeighborhood(ids,views.edges,focus),sizes=new Map(view.ids.map(id=>[id,{w:Math.max(220,views.tables[id].name.length*14+64,...views.tables[id].fields.map(([,name])=>name.length*14+24)),h:44+views.tables[id].fields.length*25}]));
 assert(view.edges.some(([a,b])=>a==='n-activity'&&b==='n-who'));const d=conceptDiagram(view.ids,view.edges,sizes);
 assert(d.routing.routes.every(r=>!r.unrouted&&!r.shapeObstacles.length),focus+' Who and Activity relationships must be rendered');
}

const bundle=(await build({entryPoints:['src/concept-canvas.js'],bundle:true,write:false,format:'iife',loader:{'.css':'empty'}})).outputFiles[0].text;
const w=new JSDOM(readFileSync('concept.html','utf8'),{url:'https://viewer.test/concept.html',runScripts:'outside-only',pretendToBeVisual:true}).window;
w.scrollTo=()=>{};w.HTMLElement.prototype.scrollTo=function(x,y){this.scrollLeft=x;this.scrollTop=y;};w.SVGElement.prototype.focus=()=>{};w.HTMLCanvasElement.prototype.getContext=()=>({measureText:value=>({width:value.length*14})});
try{
 const parent={location:{origin:'https://viewer.test',protocol:'https:'},postMessage:()=>{}};Object.defineProperty(w,'parent',{value:parent});w.eval(bundle);
 w.dispatchEvent(new w.MessageEvent('message',{origin:'https://viewer.test',source:parent,data:{type:'alder-concept-data',graph:overview,documentKey:'norm-review',viewKey:'overview'}}));
 const actor=w.document.querySelector('[data-node="overview-n-who"]');assert(actor);actor.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
 assert(w.document.querySelector('[data-node="overview-n-activity"] [data-information-id="n-activity-field-3"].concept-field-related'),'selecting Who highlights Activity.whoId');
 assert.equal(w.document.querySelectorAll('.routing-warning').length,1);assert.equal(w.document.querySelectorAll('.wire[data-unrouted="true"]').length,0);
}finally{w.close();}
console.log('NORM-01/03/04: exact actor identity, source preservation, labelled overview, full model, focused views and selection verified.');
