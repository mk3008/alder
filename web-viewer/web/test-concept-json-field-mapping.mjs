import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {registerHooks} from 'node:module';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

registerHooks({resolve(spec,context,next){if((spec.startsWith('./')||spec.startsWith('../'))&&!/\.[a-z0-9]+$/i.test(spec)){try{return next(spec+'.ts',context)}catch{}try{return next(spec+'.js',context)}catch{}}return next(spec,context)}});
const {parseDocument}=await import('../src/document-input.ts');
const {createConceptViews}=await import('../src/concept-views.ts');
const requirement=readFileSync('verification/concept-json-field-mapping.check-items.json','utf8');
assert.equal(createHash('sha256').update(requirement).digest('hex'),'45178adb013fb0345749d83148d9b265860a55fa05992bb05525c3ad066ec564');
assert.deepEqual(JSON.parse(requirement).checks.map(x=>x.id),['CONCEPT-FIELD-001','CONCEPT-FIELD-002','CONCEPT-FIELD-003']);
const pkg=JSON.parse(readFileSync('../business-design/alder/json-structure-review.json','utf8'));
const context=parseDocument(JSON.stringify(pkg)).model,model=context.concepts[0],views=createConceptViews({business:context.business,model});
const map=new Map(model.meta.fieldMappings.map(item=>[item.informationId,item]));
assert.equal(map.size,model.concepts.flatMap(item=>item.information).length,'every logical information item has one physical mapping');
assert.equal(map.get('fmt-package-field-4').physicalName,'documents[]');
assert.deepEqual(views.overviewGraph().tables['overview-package'].fields.find(x=>x[2]==='fmt-package-field-4'),['documents[]','文書一覧','fmt-package-field-4']);
assert.match(model.concepts.find(item=>item.id==='fmt-package').description,/業務設計書だけでなく/);
assert(views.overviewGraph().fieldLinks.some(x=>x.from==='overview-package'&&x.to==='overview-bd'&&x.informationId==='fmt-package-field-4'));
assert(views.graph('group-exchange').fieldLinks.some(x=>x.from==='fmt-step'&&x.to==='fmt-exchange'&&x.informationId==='fmt-step-field-4'));
assert(views.fieldLinks.some(x=>x.from==='fmt-step'&&x.to==='fmt-exchange'&&x.informationId==='fmt-step-field-4'));

const bundle=(await build({entryPoints:['src/concept-canvas.js'],bundle:true,write:false,format:'iife',loader:{'.css':'empty'}})).outputFiles[0].text;
function mount(graph,focus){
 const w=new JSDOM(readFileSync('concept.html','utf8'),{url:'https://viewer.test/concept.html',runScripts:'outside-only',pretendToBeVisual:true}).window;
 w.scrollTo=()=>{};w.HTMLElement.prototype.scrollTo=function(x,y){this.scrollLeft=x;this.scrollTop=y;};w.HTMLElement.prototype.scrollIntoView=()=>{};
 w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.hasPointerCapture=()=>false;w.SVGElement.prototype.focus=()=>{};
 w.HTMLCanvasElement.prototype.getContext=()=>({measureText:value=>({width:value.length*14})});
 const parent={location:{origin:'https://viewer.test',protocol:'https:'},postMessage:()=>{}};Object.defineProperty(w,'parent',{value:parent});w.eval(bundle);
 w.dispatchEvent(new w.MessageEvent('message',{origin:'https://viewer.test',source:parent,data:{type:'alder-concept-data',graph,focus,documentKey:'test',viewKey:'test',clearSelectionOnBackground:true}}));return w;
}
function choose(w,id){const node=w.document.querySelector(`[data-node="${id}"]`);assert(node,id);node.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));}
function highlighted(w,id){return !!w.document.querySelector(`[data-information-id="${id}"].concept-field-related`);}
let w=mount(views.overviewGraph());
assert(!highlighted(w,'fmt-package-field-4'));
choose(w,'overview-bd');assert(highlighted(w,'fmt-package-field-4'),'selected BD highlights documents in the parent');
assert(w.document.querySelector('[data-node="overview-bd"]').classList.contains('selected'));
assert(w.document.querySelector('[data-node="overview-package"]').classList.contains('review-neighbor'));
assert.equal(w.document.querySelector('[data-information-id="fmt-package-field-4"] title').textContent,'物理名：documents[]');
choose(w,'overview-data');assert(!highlighted(w,'fmt-package-field-4'),'changing selection clears old field highlight');
assert(highlighted(w,'fmt-bd-field-5'),'selecting Data highlights the BD data field');
w.document.querySelector('.canvas').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(w.document.querySelectorAll('.concept-field-related').length,0);w.close();

w=mount(views.graph('group-exchange'));choose(w,'fmt-exchange');assert(highlighted(w,'fmt-step-field-4'),'group shows the field containing the selected exchange');
choose(w,'fmt-data');assert(highlighted(w,'fmt-step-field-2'));assert(highlighted(w,'fmt-exchange-field-5'));w.close();
w=mount({ids:Object.keys(views.tables),edges:views.edges,tables:views.tables,fieldLinks:views.fieldLinks},'fmt-exchange');
choose(w,'fmt-exchange');assert(highlighted(w,'fmt-step-field-4'),'detail view keeps authored relationship mapping');w.close();

const noMap=structuredClone(model);delete noMap.meta.fieldMappings;
const oldViews=createConceptViews({business:context.business,model:noMap});w=mount(oldViews.overviewGraph());choose(w,'overview-bd');
assert.equal(w.document.querySelectorAll('.concept-field-related').length,0,'unmapped documents never infer a connection from names');w.close();
const invalid=structuredClone(model);invalid.meta.fieldMappings.find(x=>x.informationId==='fmt-package-field-4').relationIds=['rel-bd-data'];
const invalidViews=createConceptViews({business:context.business,model:invalid});w=mount(invalidViews.overviewGraph());choose(w,'overview-bd');
assert(!highlighted(w,'fmt-package-field-4'),'a nonincident relation cannot highlight the field');w.close();
console.log('CONCEPT-FIELD-001..003: logical/physical mapping, selection changes and no-inference cases verified.');
