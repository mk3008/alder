import {stateCaptionSnapshot,assertStateCaptionRows} from './caption-row-oracle.mjs';
import {parseDesign} from '../src/graph.ts';
import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {build} from 'esbuild';import {JSDOM} from 'jsdom';
import {parseDocument} from '../src/document-input.ts';
const folder='../work/json-state/issue-275/',raw=readFileSync(folder+'purchase.json','utf8'),md=readFileSync(folder+'supported-state.md','utf8'),pkg=JSON.parse(raw),bd=pkg.documents[0],st=pkg.documents[1];
const json=parseDocument(raw),legacy=parseDocument(md),projected=json,object=bd.objects.find(o=>o.id===st.objectId);
const normalized=structuredClone(legacy.objectStateTransitions[object.name]);for(const row of normalized.model.transitions)row.activity=bd.activities.find(a=>a.name===row.activity).id;for(const row of normalized.model.transitions){delete row.exceptionId;if(row.exception==='-')delete row.exception;}
const nativeComparable=structuredClone(projected.objectStateTransitions[object.id]);for(const row of nativeComparable.model.transitions)delete row.exceptionId;assert.deepEqual(nativeComparable,normalized);assert.equal(json.markdown,raw);assert.equal(legacy.markdown,md);
const dom=new JSDOM('<body></body>',{runScripts:'outside-only'}),compiled=await build({entryPoints:['src/state-transitions.ts'],bundle:true,write:false,format:'iife',globalName:'stateUI'});dom.window.eval(compiled.outputFiles[0].text+'\nwindow.stateUI=stateUI;');
const ui=dom.window.stateUI;const expected=ui.stateTransitionPanel(legacy,object.name,()=>{}),actual=ui.stateTransitionPanel(projected,object.id,()=>{});
assert.equal(actual.outerHTML,expected.outerHTML);assert.equal(actual.querySelectorAll('[data-transition]').length,13);assert.equal(actual.querySelectorAll('[data-state]').length,8);assert.ok(actual.querySelector('[stroke-dasharray]'));
assertStateCaptionRows(stateCaptionSnapshot(actual.querySelector('.state-diagram')),legacy.objectStateTransitions[object.name].model.transitions);
const state=actual.querySelector('[data-state="申請済み"]');state.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));assert.equal(state.getAttribute('aria-pressed'),'true');state.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(state.getAttribute('aria-pressed'),'false');
const renamed=structuredClone(pkg);renamed.documents[0].objects.find(o=>o.id===st.objectId).name='改名された申請';assert.ok(parseDocument(JSON.stringify(renamed)).objectStateTransitions[object.id]);
dom.window.close();console.log('Pinned state renderer MD/typed JSON: 13 operation details, all SVG boxes/routes/captions and keyboard exact; identity survives rename');

const ordinary=readFileSync('web/authorities/business-design.md','utf8');
for(const fence of ['```','~~~~']){
 const quoted=ordinary.replace('\n','\n\n'+fence+'markdown\n## State Transitions\n# Object example\n'+fence+'\n');
 assert.deepEqual(parseDocument(quoted).graph,parseDesign(quoted).graph,'quoted example headings are never declarations');
}
