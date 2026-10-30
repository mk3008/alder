import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {parseDocument} from '../src/document-input.ts';

// Independent verification authority is frozen before implementation.
const hash=v=>createHash('sha256').update(v).digest('hex');
const authorityBytes=readFileSync('verification/purchase-state-correction.check-items.json');
assert.equal(hash(authorityBytes),'446bacbed35575bd182cfa4b9708ae08a658f439c0242df22e42ba963f5adb6e');
const checks=JSON.parse(authorityBytes).checks;
assert.deepEqual(checks.map(c=>c.id),['PURCHASE-STATE-001','PURCHASE-STATE-002','PURCHASE-STATE-003','PURCHASE-STATE-004','PURCHASE-STATE-005']);
for(const c of checks)for(const field of ['condition','guarantee','reason','source','verification'])assert(c[field],c.id+' '+field);
assert.equal(hash(readFileSync('verification/purchase-v2-review.check-items.json')),'8c20bf4f3c4f2924c67f8b1720268555db99f2123e7d3a9ef1dba02adda0663c');

const base='../work/concept-review/issue-133/versions/';
const pkg=JSON.parse(readFileSync(base+'purchase-v2-beta.json','utf8'));
const concept=JSON.parse(readFileSync(base+'purchase-concepts-v2-beta.json','utf8'));
const operation=JSON.parse(readFileSync(base+'purchase-state-correction.operation.json','utf8'));
const bd=pkg.documents.find(d=>d.kind==='businessDesign'),states=pkg.documents.find(d=>d.kind==='stateTransition');
assert.equal(hash(readFileSync(base+'purchase-v1.json')),'ed5e26675c97ab4376c781cc7a47f72806c8e53d38d428540931c61f0e8b024e');
assert.equal(operation.expectedRevision,'purchase-v2-beta-5');
assert.match(operation.expectedSha256,/^[a-f0-9]{64}$/);
assert.equal(operation.removedTransitions.length,7);
for(const r of operation.removedTransitions){assert(r.id&&r.reason&&r.source);assert(!states.transitions.some(t=>t.id===r.id));}
assert.equal(new Set(operation.removedTransitions.map(r=>r.id)).size,7);
assert.equal(states.basedOn.revision,bd.revision);
assert.equal(concept.basedOn.revision,bd.revision);
assert.equal(concept.relatedStates[0].revision,states.revision);
assert.equal(states.basedOn.verification,'unverified');
assert.match(bd.exceptions.find(e=>e.name==='下書き保存').description,/前提条件を設けず/);
assert.match(bd.exceptions.find(e=>e.name==='下書き保存').description,/品目が0件/);
assert.equal(bd.findings.find(f=>f.sourceId==='F05').status,'open');

for(let n=20;n<=26;n++)assert(!states.transitions.some(t=>t.sourceId==='T'+n));
for(const id of ['T08','T11','T17','T19']){
 const row=states.transitions.find(t=>t.sourceId===id);
 assert(row,id);assert.equal(row.fromId,row.toId);assert.equal(row.effect,'unchanged');assert.match(row.note,/仮説/);
}
assert.match(states.transitions.find(t=>t.sourceId==='T17').condition,/待ち数量が残る/);
for(const name of ['終結','破棄']){
 const state=states.states.find(s=>s.name===name);assert(state);
 assert(!states.transitions.some(t=>t.fromId===state.id&&t.toId===state.id),name+' self-loop');
}

const compiled=await build({entryPoints:['src/state-transitions.ts'],bundle:true,write:false,format:'iife',globalName:'StateUI'});
const window=new JSDOM('<body></body>',{runScripts:'outside-only'}).window;
window.eval(compiled.outputFiles[0].text+';window.StateUI=StateUI;');
function painted(candidate){
 const design=parseDocument(JSON.stringify(candidate));
 const panel=window.StateUI.stateTransitionPanel(design,states.objectId,()=>{});
 assert(panel?.querySelector('.state-diagram'));
 return new Set([...panel.querySelectorAll('path[data-transitions]')].flatMap(p=>p.getAttribute('data-transitions').split(' ')));
}
const actual=painted(pkg);
assert.deepEqual([...actual].sort(),states.transitions.map(t=>t.sourceId).sort());
for(const id of ['T08','T11','T17','T19'])assert(actual.has(id),id+' rendered');
for(let n=20;n<=26;n++)assert(!actual.has('T'+n));
const explicit=structuredClone(pkg),state=explicit.documents.find(d=>d.kind==='stateTransition');
const draft=state.transitions.find(t=>t.sourceId==='T19');
state.transitions.push({...draft,id:'explicit-loop-test',sourceId:'SYNTHETIC',condition:'追加の明示的な下書き保存条件'});
assert(painted(explicit).has('SYNTHETIC'),'explicit self-loop remains supported');
window.close();
console.log('PURCHASE-STATE-001..005: source, revisions, explicit loops and renderer verified; business hypotheses remain unapproved');
