import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {validate} from '../../tools/document_storage/core.mjs';
import {parseDocument} from '../src/document-input.ts';
import {stateCaptionGeometry,assertStateCaptionPlacement} from './caption-placement-oracle.mjs';

const authorityPath='verification/draft-route.check-items.json';
const rawAuthority=readFileSync(authorityPath);
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const fixed='7b9d0d252416902bc9ffdd7e537aaff507e50445d8f73ff06a548a06d9e82edf';
const checkAuthority=bytes=>{assert.equal(sha(bytes),fixed);const ids=JSON.parse(bytes).checks.map(c=>c.id);assert.deepEqual(ids,['DRAFT-ROUTE-001','DRAFT-ROUTE-002','DRAFT-ROUTE-003']);return ids;};
const ids=checkAuthority(rawAuthority),covered=new Set();
assert.throws(()=>checkAuthority(Buffer.from('{}')));

const base='../work/concept-review/issue-133/versions/';
const oldRaw=readFileSync(base+'purchase-v8-testability-reference-draft.json','utf8');
const newRaw=readFileSync(base+'purchase-v9-draft-routes-reference-draft.json','utf8');
const before=JSON.parse(oldRaw),after=JSON.parse(newRaw);
validate(before);validate(after);
const doc=(pkg,kind)=>pkg.documents.find(d=>d.kind===kind);
assert.deepEqual(doc(after,'businessDesign'),doc(before,'businessDesign'));
assert.deepEqual(doc(after,'checkItems'),doc(before,'checkItems'));
const oldState=doc(before,'stateTransition'),state=doc(after,'stateTransition');
assert.notEqual(state.revision,oldState.revision);
assert.equal(state.transitions.length,oldState.transitions.length);
const oldById=new Map(oldState.transitions.map(t=>[t.sourceId,t]));
for(const t of state.transitions){
 const previous=oldById.get(t.sourceId);assert(previous,'all transition identities retained');
 if(t.sourceId==='T01'){const {conditionLabel,...rest}=t;assert.equal(conditionLabel,'提出');assert.deepEqual(rest,previous);continue;}
 if(t.sourceId==='T02'||t.sourceId==='T19'){
  const {path,exceptionId,conditionLabel,...rest}=t,{path:oldPath,exceptionId:oldRef,...oldRest}=previous;
  assert.equal(path,'normal');assert.equal(exceptionId,null);assert.equal(conditionLabel,'下書き保存');
  assert.equal(oldPath,'exception');assert(oldRef);assert.deepEqual(rest,oldRest);continue;
 }
 assert.deepEqual(t,previous,'unrelated transition unchanged: '+t.sourceId);
}
assert.equal(doc(after,'conceptModel').relatedStates.find(r=>r.documentId===state.id).revision,state.revision);
assert.equal(state.transitions.find(t=>t.sourceId==='T03').path,'exception');
covered.add('DRAFT-ROUTE-003');

const bundle=await build({entryPoints:['src/state-transitions.ts'],bundle:true,write:false,format:'iife',globalName:'StateUI'});
const w=new JSDOM('<body/>',{runScripts:'outside-only'}).window;
try{
 w.eval(bundle.outputFiles[0].text+';window.StateUI=StateUI;');
 const design=parseDocument(newRaw),panel=w.StateUI.stateTransitionPanel(design,state.objectId,()=>{}),svg=panel.querySelector('.state-diagram');
 assertStateCaptionPlacement(stateCaptionGeometry(svg),design.objectStateTransitions[state.objectId].model.transitions);
 const label=id=>svg.querySelector(`[data-transition-id="${id}"]`)?.textContent??'';
 for(const id of ['T02','T19']){assert.match(label(id),/下書き保存/);assert.doesNotMatch(label(id),/例外/);}
 assert(svg.querySelector('path[data-transitions~="T19"][stroke-dasharray]'),'state-unchanged save remains dashed');
 assert.match(label('T03'),/例外.*権限判定不成立/);
 covered.add('DRAFT-ROUTE-001');
 for(const id of ['T20','T21','T22'])assert.match(label(id),/下書きの再開/);
 covered.add('DRAFT-ROUTE-002');

 const oldDesign=parseDocument(oldRaw),oldPanel=w.StateUI.stateTransitionPanel(oldDesign,oldState.objectId,()=>{});
 assert.match(oldPanel.querySelector('[data-transition-id="T02"]').textContent,/例外/,'legacy documents retain their explicitly declared old path');
 assert.equal(readFileSync(base+'purchase-v8-testability-reference-draft.json','utf8'),oldRaw);
}finally{w.close();}
assert.equal(sha(readFileSync(authorityPath)),fixed,'verification authority remains unchanged');
assert.deepEqual([...covered].sort(),ids.sort());
console.log(JSON.stringify({passed:[...covered],scope:'unreviewed V9 draft, old-format input, state captions and unchanged Check items'}));
