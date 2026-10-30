import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdtempSync,readFileSync,rmSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {validate} from '../../tools/document_storage/core.mjs';
import {validate as bundledValidate} from '../../plugins/alder/skills/alder-manage-json-documents/scripts/document_storage/core.mjs';
import {parseDocument} from '../src/document-input.ts';

const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const authorityPath='verification/state-condition-label.check-items.json';
const ids=Array.from({length:6},(_,i)=>`STATE-LABEL-00${i+1}`);
const authority=bytes=>{assert.equal(hash(bytes),'14316d199b56bf6dfbb3bc7046d1a7c22dca753017b6b55ebc0ac850d7decf12');const a=JSON.parse(bytes);assert.deepEqual(a.checks.map(c=>c.id),ids);return a;};
const checks=authority(readFileSync(authorityPath));
for(const change of [a=>a.checks.pop(),a=>a.checks[0].condition='0.4 only']){const a=structuredClone(checks);change(a);assert.throws(()=>authority(Buffer.from(JSON.stringify(a))));}
const coverage=results=>assert.deepEqual(Object.keys(results).sort(),[...ids].sort());
assert.throws(()=>coverage(Object.fromEntries(ids.slice(1).map(id=>[id,'missing']))));
const evidence={};
const state=p=>p.documents.find(d=>d.kind==='stateTransition');
const purchase=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v2-beta.json','utf8'));
const seed=JSON.parse(readFileSync('../work/plugin-json/issue-310/reviewed-seed.json','utf8'));
const zeroFive=structuredClone(seed),doc=state(zeroFive),first=doc.transitions[0];
first.conditionLabel='明示された表示名';
doc.transitions.push({...first,id:'label-same-target',sourceId:'S2',conditionLabel:'別の表示名'},
 {...first,id:'label-undecided',sourceId:'S3',conditionLabel:'未決の表示名',toId:'@unknown',effect:'constraint',note:'到着先は未決'});
assert.deepEqual(JSON.parse(readFileSync('../work/viewer-json/issue-312/state-label-05.json','utf8')),zeroFive,'fixed GUI fixture matches the reproducible synthetic input');

for(const pkg of [purchase,zeroFive]){
 for(const validator of [validate,bundledValidate]){
  validator(pkg);
  const absent=structuredClone(pkg);delete state(absent).transitions[0].conditionLabel;validator(absent);
  for(const invalid of ['', '  \n', null, 2, {}, []]){const bad=structuredClone(pkg);state(bad).transitions[0].conditionLabel=invalid;assert.throws(()=>validator(bad));}
  const unknown=structuredClone(pkg);state(unknown).transitions[0].conditionExtra='x';assert.throws(()=>validator(unknown));
 }
}
const duplicate04=structuredClone(purchase),p04=state(duplicate04),row04=p04.transitions.find(t=>t.sourceId==='T15');
p04.transitions.push({...row04,id:'label-duplicate',sourceId:'T99',conditionLabel:'別の表示名'});
for(const validator of [validate,bundledValidate])assert.throws(()=>validator(duplicate04),/Duplicate state transition condition/);
evidence[ids[0]]='0.4 and 0.5: canonical/bundled positive, absent, invalid and unknown fields';

const compiled=await build({entryPoints:['src/state-transitions.ts'],bundle:true,write:false,format:'iife',globalName:'StateUI'});
const window=new JSDOM('<body/>',{runScripts:'outside-only'}).window;
try{
 window.eval(compiled.outputFiles[0].text+';window.StateUI=StateUI;');
 const make=p=>{const design=parseDocument(JSON.stringify(p));return window.StateUI.stateTransitionPanel(design,state(p).objectId,()=>{});};
 let panel=make(purchase),t15=state(purchase).transitions.find(t=>t.sourceId==='T15');
 assert.match(panel.querySelector('[data-transition-id="T15"]').textContent,/待ち数量が残る/);
 assert.ok(panel.querySelector('[data-transition="T15"]').textContent.includes(t15.condition));
 assert.equal(panel.querySelector('[data-transition-id="T12"]').textContent,'購入を準備する');
 assert.equal(panel.querySelector('[data-transition-id="T14"]').textContent,'購入申請を承認する（例外：承認後差戻し）');
 const absent=structuredClone(purchase);for(const t of state(absent).transitions)delete t.conditionLabel;panel=make(absent);
 assert.ok(panel.querySelector('[data-transition-id="T15"]').textContent.includes(t15.condition));
 const collision=structuredClone(purchase);for(const t of state(collision).transitions.filter(t=>['T15','T16'].includes(t.sourceId)))t.conditionLabel='同じ表示';panel=make(collision);
 for(const id of ['T15','T16'])assert.ok(panel.querySelector(`[data-transition-id="${id}"]`).textContent.includes(state(purchase).transitions.find(t=>t.sourceId===id).condition));
 evidence[ids[1]]='purchase DOM explicit, absent, collision, singleton, exception and original details';

 panel=make(zeroFive);const paths=[...panel.querySelectorAll('path.edge[data-transitions]')],labels=[...panel.querySelectorAll('[data-transition-id]')];
 assert.deepEqual(paths.map(p=>p.dataset.transitions),['S1','S2','S3']);assert.equal(new Set(paths.map(p=>p.getAttribute('d'))).size,3);
 assert.deepEqual(labels.map(p=>p.dataset.transitionId),['S1','S2','S3']);
 for(const t of doc.transitions){assert.ok(panel.querySelector(`[data-transition-id="${t.sourceId}"]`).textContent.includes(t.conditionLabel));const detail=panel.querySelector(`[data-transition="${t.sourceId}"]`);assert.ok(detail.textContent.includes(t.condition));assert.ok(detail.textContent.includes(t.note));}
 const duplicates=structuredClone(zeroFive);for(const t of state(duplicates).transitions)t.conditionLabel='重複';panel=make(duplicates);
 for(const t of doc.transitions)assert.ok(panel.querySelector(`[data-transition-id="${t.sourceId}"]`).textContent.includes(t.condition));
 evidence[ids[2]]='0.5 DOM distinct labeled paths and collision fallback; Chrome separately';
}finally{window.close();}

const scratch=mkdtempSync(join(tmpdir(),'state-condition-label-'));
try{
 const target=join(scratch,'package.json'),candidate=join(scratch,'candidate.json'),operation=join(scratch,'operation.json');
 for(const original of [purchase,zeroFive])for(const script of ['../tools/document_storage/author-cli.mjs','../plugins/alder/skills/alder-manage-json-documents/scripts/document_storage/author-cli.mjs']){
  const raw=JSON.stringify(original),next=structuredClone(original);next.revision+='-corrected';state(next).revision+='-corrected';state(next).transitions[0].note+=' 訂正';
  const op={expectedSha256:hash(raw),expectedRevision:original.revision};writeFileSync(target,raw);writeFileSync(candidate,JSON.stringify(next));writeFileSync(operation,JSON.stringify(op));
  const call=()=>spawnSync(process.execPath,[resolve(script),'commit',target,candidate,operation],{encoding:'utf8'});
  const bad=structuredClone(next);state(bad).transitions[0].conditionLabel=' ';writeFileSync(candidate,JSON.stringify(bad));let result=call();assert.equal(result.status,2,result.stderr);assert.equal(readFileSync(target,'utf8'),raw);
  writeFileSync(candidate,JSON.stringify(next));writeFileSync(operation,JSON.stringify({...op,expectedSha256:'stale'}));result=call();assert.equal(result.status,2,result.stderr);assert.equal(readFileSync(target,'utf8'),raw);
  writeFileSync(operation,JSON.stringify(op));result=call();assert.equal(result.status,0,result.stderr);const saved=JSON.parse(readFileSync(target,'utf8'));assert.deepEqual(saved,next);
  for(const [i,t]of state(original).transitions.entries()){const got=state(saved).transitions[i];assert.equal(got.id,t.id);assert.equal(got.sourceId,t.sourceId);assert.equal(got.condition,t.condition);assert.equal(got.conditionLabel,t.conditionLabel);}
  assert.deepEqual(state(saved).basedOn,state(original).basedOn);
  assert.deepEqual(saved.documents.filter(d=>d.kind==='checkItems'),original.documents.filter(d=>d.kind==='checkItems'));
 }
 evidence[ids[3]]='0.4 purchase and 0.5: canonical/bundled CLI commit, readback and rejected-save bytes; existing rebase tests retained';
}finally{rmSync(scratch,{recursive:true,force:true});}
evidence[ids[4]]='STATE-CAPTION-001..003 and stateIdentity/tabStrip browser suites (separate execution)';
evidence[ids[5]]='canonical and bundled validators; old B comparison and provenance gate (separate execution)';
coverage(evidence);authority(readFileSync(authorityPath));
console.log(JSON.stringify({evidence,limitations:'DOM and CLI here; browser, old-validator compatibility and byte-provenance checked separately'}));
