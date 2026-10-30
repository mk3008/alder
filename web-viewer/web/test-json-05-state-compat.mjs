import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdtempSync,readFileSync,rmSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {validate} from '../../tools/document_storage/core.mjs';
import {guardAuthoring} from '../../tools/document_storage/authoring.mjs';
import {parseDocument,readDesignFile} from '../src/document-input.ts';

const hash=value=>createHash('sha256').update(value).digest('hex');
const authorityPath='verification/json-05-state-compat.check-items.json';
const ids=Array.from({length:5},(_,i)=>`JSON05-STATE-COMPAT-00${i+1}`);
function authority(bytes){
 assert.equal(hash(bytes),'bba34937692073b1fb99e7f5cd969e92009e1a47ea9442270aaf84b37c3492f0');
 const checks=JSON.parse(bytes).checks;assert.deepEqual(checks.map(c=>c.id),ids);return checks;
}
const checks=authority(readFileSync(authorityPath));
const cover=results=>{assert.deepEqual(Object.keys(results).sort(),[...ids].sort());assert(Object.values(results).every(v=>typeof v==='string'&&v.length>0));};
for(const mutate of [v=>v.checks.pop(),v=>{v.checks[0].condition='changed';}]){const v={checks:structuredClone(checks)};mutate(v);assert.throws(()=>authority(Buffer.from(JSON.stringify(v))));}
assert.throws(()=>cover(Object.fromEntries(ids.slice(1).map(id=>[id,true]))));
const done={};

// Phase B's reviewed synthetic seed is augmented only with separate IDs and
// source IDs. S1/S2 share both condition and destination; S3 is unresolved.
const previous=JSON.parse(readFileSync('../work/plugin-json/issue-310/reviewed-seed.json','utf8'));
const state=p=>p.documents.find(d=>d.kind==='stateTransition');
const check=p=>p.documents.find(d=>d.kind==='checkItems');
const original=state(previous).transitions[0];
state(previous).transitions.push({...original,id:'compat-same-target',sourceId:'S2',note:'同条件の別遷移は未確認'},
 {...original,id:'compat-unresolved',sourceId:'S3',toId:'@unknown',effect:'constraint',note:'到着先は未決'});
const raw=JSON.stringify(previous),expected=structuredClone(state(previous).transitions);
const transitionCases=['S1','S2','S3'],coverTransitions=rows=>assert.deepEqual(rows.map(r=>r.sourceId),transitionCases);
coverTransitions(expected);assert.throws(()=>coverTransitions(expected.slice(0,-1)));
validate(previous);
const design=parseDocument(raw),file=await readDesignFile({name:'same-condition.json',type:'application/json',size:Buffer.byteLength(raw),text:async()=>raw});
assert.equal(design.markdown,raw);assert.equal(file.markdown,raw);
assert.deepEqual(design.model.states[0].transitions,expected);
assert.equal(design.model.states[0].basedOn.verification,'unverified');
assert.equal(design.model.checks[0].items[0].reviewState,'確認済み');
done[ids[0]]='validator, parser and File adapter; URL/restore in Chrome';

const compiled=await build({entryPoints:['src/state-transitions.ts'],bundle:true,write:false,format:'iife',globalName:'StateUI'});
const window=new JSDOM('<body/>',{runScripts:'outside-only'}).window;
try{
 window.eval(compiled.outputFiles[0].text+';window.StateUI=StateUI;');
 const panel=window.StateUI.stateTransitionPanel(design,state(previous).objectId,()=>{}),svg=panel.querySelector('.state-diagram');
 const paths=[...svg.querySelectorAll('path.edge[data-transitions]')],labels=[...svg.querySelectorAll('[data-transition-id]')];
 assert.deepEqual(paths.map(p=>p.dataset.transitions),['S1','S2','S3']);
 assert.equal(new Set(paths.map(p=>p.getAttribute('d'))).size,3,'the two same-endpoint paths must be visibly distinct');
 assert.deepEqual(labels.map(p=>p.dataset.transitionId),['S1','S2','S3']);
 for(const row of expected){const label=labels.find(e=>e.dataset.transitionId===row.sourceId),detail=panel.querySelector(`[data-transition="${row.sourceId}"]`);assert(label.textContent.includes(row.condition));assert(label.textContent.includes(row.toId==='@unknown'?'未決':'案内済み'));assert([...label.querySelectorAll('tspan')].every(e=>e.dataset.transitions===row.sourceId));assert(detail.textContent.includes(row.note));}
 assert.match(panel.textContent,/操作の詳細（3）/);assert.match(panel.textContent,/到着先は未決/);
 // Three equivalent conditions and self-return rows exercise the same
 // identity guarantee without assuming a particular destination or route.
 for(const mode of ['three-forward','self-return']){
  const variant=structuredClone(previous),doc=state(variant);
  doc.transitions=doc.transitions.map((row,i)=>({...row,condition:i===2?'  案内を記録\n':'案内を記録',fromId:mode==='self-return'?'seed-done':'@new',toId:'seed-done',effect:mode==='self-return'?'unchanged':'change'}));
  validate(variant);const other=window.StateUI.stateTransitionPanel(parseDocument(JSON.stringify(variant)),doc.objectId,()=>{}),wires=[...other.querySelectorAll('path.edge[data-transitions]')];
  assert.deepEqual(wires.map(e=>e.dataset.transitions),['S1','S2','S3']);assert.equal(new Set(wires.map(e=>e.getAttribute('d'))).size,3,mode);
  assert.equal(other.querySelectorAll('[data-transition-id]').length,3);
 }
}finally{window.close();}
done[ids[1]]='DOM with distinct routes, captions and details; Chrome separately';

const next=structuredClone(previous);next.revision='p2';state(next).revision='state-2';state(next).transitions[1].condition='訂正後の条件';
validate(next);assert.equal(guardAuthoring(previous,next,{expectedRevision:previous.revision}).valid,true);
assert.deepEqual(state(next).transitions.map(t=>[t.id,t.sourceId]),expected.map(t=>[t.id,t.sourceId]));
assert.deepEqual(state(next).basedOn,state(previous).basedOn);assert.deepEqual(check(next),check(previous));
assert.deepEqual(state(next).transitions[2],expected[2]);

const scratch=mkdtempSync(join(tmpdir(),'alder-05-state-compat-'));
try{
 const target=join(scratch,'target.json'),candidate=join(scratch,'candidate.json'),operation=join(scratch,'operation.json');
 const scripts=['../tools/document_storage/author-cli.mjs','../plugins/alder/skills/alder-manage-json-documents/scripts/document_storage/author-cli.mjs'];
 for(const script of scripts){
  writeFileSync(target,raw);const op={expectedSha256:hash(raw),expectedRevision:previous.revision};
  const run=(pkg,operationValue=op)=>{writeFileSync(candidate,typeof pkg==='string'?pkg:JSON.stringify(pkg));writeFileSync(operation,JSON.stringify(operationValue));return spawnSync(process.execPath,[resolve(script),'commit',target,candidate,operation],{encoding:'utf8'});};
  const rejected=(pkg,pattern,operationValue=op)=>{const result=run(pkg,operationValue);assert.equal(result.status,2,result.stderr);assert.match(result.stderr,pattern);assert.equal(readFileSync(target,'utf8'),raw);};
  rejected(next,/File content conflict/,{...op,expectedSha256:'stale'});
  rejected(next,/Package revision conflict/,{...op,expectedRevision:'stale'});
  rejected('{broken',/JSON|object|Truncated|Unclosed/i);
  const missing=structuredClone(next);state(missing).transitions[1].activityId='missing';rejected(missing,/Dangling reference/);
  const replaced=structuredClone(next);state(replaced).transitions[1].id='replaced';rejected(replaced,/Existing ID was removed/);
  const changedSource=structuredClone(next);state(changedSource).transitions[1].sourceId='S9';rejected(changedSource,/Source identity changed/);
  const duplicateSource=structuredClone(next);state(duplicateSource).transitions[1].sourceId='S1';rejected(duplicateSource,/Duplicate transition source ID/);
  const rebase=structuredClone(next),bd=rebase.documents.find(d=>d.kind==='businessDesign');bd.revision+='-new';check(rebase).revision+='-new';check(rebase).basedOn.revision=bd.revision;state(rebase).basedOn.revision=bd.revision;
  rejected(rebase,/cannot be rebased/);
  const result=run(next);assert.equal(result.status,0,result.stderr);const saved=readFileSync(target,'utf8');assert.deepEqual(JSON.parse(saved),next);validate(JSON.parse(saved));
  assert.equal(state(JSON.parse(saved)).transitions[2].note,'到着先は未決');
  const stateOnly=structuredClone(previous);stateOnly.documents=stateOnly.documents.filter(d=>d.kind!=='checkItems');const oldStateRaw=JSON.stringify(stateOnly),stateRebase=structuredClone(stateOnly),newBD=stateRebase.documents.find(d=>d.kind==='businessDesign');
  stateRebase.revision='p2';newBD.revision+='-new';state(stateRebase).revision='state-2';state(stateRebase).basedOn.revision=newBD.revision;validate(stateRebase);writeFileSync(target,oldStateRaw);
  const stateResult=run(stateRebase,{expectedSha256:hash(oldStateRaw),expectedRevision:stateOnly.revision});assert.equal(stateResult.status,2,stateResult.stderr);assert.match(stateResult.stderr,/cannot be rebased/);assert.equal(readFileSync(target,'utf8'),oldStateRaw);
 }
}finally{rmSync(scratch,{recursive:true,force:true});}
done[ids[2]]='canonical and bundled CLI';done[ids[4]]='canonical and bundled CLI';

const legacy=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v2-beta.json','utf8'));
const legacyState=state(legacy),old=legacyState.transitions.find(t=>t.sourceId==='T15');legacyState.transitions.push({...old,id:'compat-legacy-duplicate',sourceId:'T99'});
assert.throws(()=>validate(legacy),/Duplicate state transition condition/);assert.throws(()=>parseDocument(JSON.stringify(legacy)),/Duplicate state transition condition/);
const markdown=readFileSync('../work/json-state/issue-275/supported-state.md','utf8'),line=markdown.split('\n').find(l=>/^\| T01 \|/.test(l));assert(line);
assert.throws(()=>parseDocument(markdown.replace(line,line+'\n'+line.replace('T01','T99'))),/Duplicate state transition condition/);
done[ids[3]]='legacy parser; STATE-IDENTITY covers save and Chrome';cover(done);authority(readFileSync(authorityPath));
console.log(JSON.stringify({checks:done,scope:'Node/DOM and real canonical/bundled author CLI; URL, reload and native Chrome are verified separately'}));
