import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {parseDocument} from '../src/document-input.ts';

const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const authority=readFileSync('verification/state-selection-layering.check-items.json');
const verifyAuthority=bytes=>{assert.equal(hash(bytes),'74b22c240e04504db5e6ba5f0137a22d3a0e317be71171194c19ae1737309b1e');assert.deepEqual(JSON.parse(bytes).checks.map(c=>c.id),['STATE-FRONT-001','STATE-FRONT-002','STATE-FRONT-003']);};
verifyAuthority(authority);const altered=JSON.parse(authority);altered.checks.pop();assert.throws(()=>verifyAuthority(Buffer.from(JSON.stringify(altered))));
const raw=readFileSync('../work/concept-review/issue-133/versions/purchase-v5-resume-reference-draft.json','utf8');
assert.equal(hash(raw),'3d81bae8b4b44cf928c9088a1549469c7b47a21a82a4f55abcb5ccf0501a2412');
const pkg=JSON.parse(raw),state=pkg.documents.find(d=>d.kind==='stateTransition'),design=parseDocument(raw);
const compiled=await build({entryPoints:['src/state-transitions.ts'],bundle:true,write:false,format:'iife',globalName:'StateUI'}),w=new JSDOM('<body/>',{runScripts:'outside-only'}).window;
try{
 w.eval(compiled.outputFiles[0].text+';window.StateUI=StateUI;');
 const panel=w.StateUI.stateTransitionPanel(design,state.objectId,()=>{});w.document.body.append(panel);
 const svg=()=>panel.querySelector('.state-diagram'),path=id=>svg().querySelector(`path.edge[data-transitions~="${id}"]`),children=()=>[...svg().children];
 const snapshot=()=>[...svg().querySelectorAll('path.edge[data-transitions]')].map(e=>[e.dataset.transitions,e.getAttribute('d'),e.getAttribute('stroke-dasharray')]).sort((a,b)=>a[0].localeCompare(b[0]));
 const captions=()=>[...svg().querySelectorAll('[data-transition-id]')].map(e=>[e.dataset.transitionId,e.textContent]).sort((a,b)=>a[0].localeCompare(b[0]));
 const assertLayers=()=>{
  const order=children(),painted=order.filter(e=>e.matches('path.edge,[data-exception-paint]'));
  const unrelated=painted.filter(e=>!e.classList.contains('review-related')),related=painted.filter(e=>e.classList.contains('review-related'));
  if(unrelated.length&&related.length)assert(Math.max(...unrelated.map(e=>order.indexOf(e)))<Math.min(...related.map(e=>order.indexOf(e))),'highlighted lines, arrows and dashed paint follow every unrelated line');
  const content=order.filter(e=>e.matches('[data-state],.state-diagram-edge-label'));
  assert(Math.max(...painted.map(e=>order.indexOf(e)))<Math.min(...content.map(e=>order.indexOf(e))),'all lines remain behind cards and labels');
 };
 const select=name=>svg().querySelector(`[data-state="${name}"]`).dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
 const unchanged=snapshot(),text=captions(),initialOrder=children().filter(e=>e.matches('path.edge')).map(e=>e.dataset.transitions);
 assertLayers();select('下書き');assertLayers();
 assert(path('T06').classList.contains('review-related'));assert(!path('T09').classList.contains('review-related'));
 assert(children().indexOf(path('T06'))>children().indexOf(path('T09')),'selected T06 arrow must be drawn over T09 at the shared target');
 assert.match(path('T06').getAttribute('marker-end'),/related-arrow/);assert.match(path('T09').getAttribute('marker-end'),/transition-arrow/);
 assert.deepEqual(path('T08'),path('T19'));assert.deepEqual(path('T08'),path('T20'));
 assert(svg().querySelector('[data-exception-paint][data-transitions~="T20"].review-related'));
 select('差戻し');assertLayers();assert(children().indexOf(path('T09'))>children().indexOf(path('T06')),'the front arrow follows the new selection');
 assert(svg().querySelector('[data-exception-paint][data-transitions~="T05"].review-related'));
 assert.deepEqual(snapshot(),unchanged);assert.deepEqual(captions(),text);
 svg().dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assertLayers();
 assert.equal(svg().querySelectorAll('path.edge.review-related').length,0);assert.deepEqual(children().filter(e=>e.matches('path.edge')).map(e=>e.dataset.transitions),initialOrder,'clearing selection restores input order');
 select('下書き');const zoom=panel.querySelector('.canvas-zoom').textContent;panel.querySelector('.zoom-in').click();assert.notEqual(panel.querySelector('.canvas-zoom').textContent,zoom);assertLayers();
 assert(path('T06').classList.contains('review-related'));assert.deepEqual(snapshot(),unchanged);assert.deepEqual(captions(),text);
 verifyAuthority(readFileSync('verification/state-selection-layering.check-items.json'));
 console.log(JSON.stringify({checks:['STATE-FRONT-001','STATE-FRONT-002','STATE-FRONT-003'],cases:'real purchase JSON; selected normal/dashed paths, shared arrow target, selection switch/clear and zoom',limit:'DOM rendering order; native browser and human review are separate'}));
}finally{w.close();}
