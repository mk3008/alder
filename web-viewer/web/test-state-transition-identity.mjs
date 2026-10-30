import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {validate,validateReferences} from '../../tools/document_storage/core.mjs';
import {parseDocument} from '../src/document-input.ts';
import {stateCaptionSnapshot,assertStateCaptionRows} from './caption-row-oracle.mjs';

const hash=b=>createHash('sha256').update(b).digest('hex');
const bytes=readFileSync('verification/state-transition-identity.check-items.json');
const frozen='9e4e340940d214878b471fc70101e8fabb2087c6369f1281b567e2ff7276be90';
const ids=Array.from({length:6},(_,i)=>'STATE-IDENTITY-00'+(i+1));
function authority(b){assert.equal(hash(b),frozen);const a=JSON.parse(b);assert.deepEqual(a.checks.map(c=>c.id),ids);return a;}
const checks=authority(bytes),results=[];
const coverage=r=>{assert.deepEqual(r.map(x=>x.id).sort(),ids);assert(r.every(x=>x.pass));};
for(const change of [a=>a.checks.pop(),a=>a.checks[0].condition='changed']){const a=structuredClone(checks);change(a);assert.throws(()=>authority(Buffer.from(JSON.stringify(a))));}
assert.throws(()=>coverage(ids.slice(1).map(id=>({id,pass:true}))));
const pass=id=>results.push({id,pass:true});
const base='../work/concept-review/issue-133/versions/';
const raw=readFileSync(base+'purchase-v2-beta.json','utf8'),pkg=JSON.parse(raw),bd=pkg.documents.find(d=>d.kind==='businessDesign'),st=pkg.documents.find(d=>d.kind==='stateTransition');
const row=id=>st.transitions.find(t=>t.sourceId===id),state=id=>st.states.find(s=>s.id===id)?.name??({'@new':'作成前','@none':'作成なし','@unknown':'未決'}[id]??id);
validate(pkg);
for(const id of ['T15','T17']){assert.match(row(id).condition,/登録後、待ち数量が残る/);assert.equal(state(row(id).toId),'作業中');}
for(const id of ['T16','T18']){assert.match(row(id).condition,/登録後、全品目の待ち数量が0になる/);assert.equal(state(row(id).toId),'終結');}
assert.equal(new Set(['T15','T16','T17','T18'].map(id=>row(id).activityId)).size,1);
assert.match(bd.activities.find(a=>a.id===row('T15').activityId).procedure,/いずれかの品目に待ちが残れば/);
for(const field of ['fromId','toId']){const p=structuredClone(pkg);p.documents.find(d=>d.kind==='stateTransition').transitions[0][field]=[row('T15')[field]];assert.throws(()=>validate(p));}
pass(ids[0]);

const duplicate=()=>{const p=structuredClone(pkg),d=p.documents.find(d=>d.kind==='stateTransition');d.transitions.push({...row('T15'),id:'duplicate-row',sourceId:'T99'});return p;};
for(const change of [()=>{},t=>t.toId=row('T16').toId,t=>{t.toId=t.fromId;t.effect='unchanged';},t=>t.event='different-event',t=>{t.path='exception';t.exceptionId=bd.exceptions.find(e=>e.activityId===t.activityId).id;},t=>t.condition=' \n'+t.condition+'\t ']){
 const p=duplicate(),t=p.documents.find(d=>d.kind==='stateTransition').transitions.at(-1);change(t);
 assert.throws(()=>validate(p),/Duplicate state transition condition.*T15.*T99/);
 assert.throws(()=>validateReferences(p),/Duplicate state transition condition/);
 assert.throws(()=>parseDocument(JSON.stringify(p)),/Duplicate state transition condition/);
}
for(const change of [t=>t.condition='検収結果を確認した場合',t=>t.fromId=row('T04').fromId,t=>t.activityId=bd.activities.find(a=>a.id!==t.activityId).id]){const p=duplicate();change(p.documents.find(d=>d.kind==='stateTransition').transitions.at(-1));validate(p);}
const spaced=duplicate(),spacedRows=spaced.documents.find(d=>d.kind==='stateTransition').transitions;spacedRows.find(t=>t.sourceId==='T15').condition='入力 確認';spacedRows.at(-1).condition=' 入力\n\t確認 ';assert.throws(()=>validate(spaced),/Duplicate state transition condition/);
pass(ids[1]);

const compiled=await build({entryPoints:['src/state-transitions.ts'],bundle:true,write:false,format:'iife',globalName:'StateUI'}),window=new JSDOM('<body/>',{runScripts:'outside-only'}).window;
window.eval(compiled.outputFiles[0].text+';window.StateUI=StateUI;');
const design=parseDocument(raw),panel=window.StateUI.stateTransitionPanel(design,st.objectId,()=>{});window.document.body.append(panel);
const svg=panel.querySelector('.state-diagram'),model=design.objectStateTransitions[st.objectId].model;
assert.equal(svg.querySelectorAll('path.edge[data-transitions]').length,st.transitions.length);
assert.equal(svg.querySelectorAll('[data-transition-id]').length,st.transitions.length);
for(const t of st.transitions){const label=svg.querySelector('[data-transition-id="'+t.sourceId+'"]'),detail=panel.querySelector('[data-transition="'+t.sourceId+'"]'),to=t.toId==='@none'?'この操作では作成しない':state(t.toId);assert(label.textContent.includes(bd.activities.find(a=>a.id===t.activityId).name));assert(detail.textContent.includes(t.condition));assert(detail.textContent.includes(to));assert(!label.textContent.includes('通常'));assert([...label.querySelectorAll('tspan')].every(e=>e.dataset.transitions===t.sourceId));}
assert.equal(svg.querySelector('[data-transition-id="T12"]').textContent,'購入を準備する');
assert.equal(svg.querySelector('[data-transition-id="T14"]').textContent,'購入申請を承認する（例外：承認後差戻し）');
for(const id of ['T15','T16','T17','T18'])assert.equal(svg.querySelector('[data-transition-id="'+id+'"]').textContent,'購入結果を登録する（'+row(id).conditionLabel+'）');
const withoutLabels=structuredClone(pkg);for(const t of withoutLabels.documents.find(d=>d.kind==='stateTransition').transitions)delete t.conditionLabel;
const oldPanel=window.StateUI.stateTransitionPanel(parseDocument(JSON.stringify(withoutLabels)),st.objectId,()=>{});for(const id of ['T15','T16'])assert(oldPanel.querySelector('[data-transition-id="'+id+'"]').textContent.includes(row(id).condition));
const duplicateLabels=structuredClone(pkg);for(const id of ['T15','T16'])duplicateLabels.documents.find(d=>d.kind==='stateTransition').transitions.find(t=>t.sourceId===id).conditionLabel='同じ表示';
const dupPanel=window.StateUI.stateTransitionPanel(parseDocument(JSON.stringify(duplicateLabels)),st.objectId,()=>{});for(const id of ['T15','T16'])assert(dupPanel.querySelector('[data-transition-id="'+id+'"]').textContent.includes(row(id).condition));
const emptyLabel=structuredClone(pkg);emptyLabel.documents.find(d=>d.kind==='stateTransition').transitions.find(t=>t.sourceId==='T15').conditionLabel=' ';assert.throws(()=>validate(emptyLabel));
const sameTarget=structuredClone(pkg),extra={...row('T15'),id:'same-target',sourceId:'T98',condition:'別の明示条件'};sameTarget.documents.find(d=>d.kind==='stateTransition').transitions.push(extra);
const extraPanel=window.StateUI.stateTransitionPanel(parseDocument(JSON.stringify(sameTarget)),st.objectId,()=>{});assert(extraPanel.querySelector('path[data-transitions="T98"]'));assert(extraPanel.querySelector('[data-transition-id="T98"]'));
pass(ids[2]);

const scratch=mkdtempSync(join(tmpdir(),'state-identity-'));
try{
 const target=join(scratch,'design.json'),candidate=join(scratch,'candidate.json'),operation=join(scratch,'operation.json');writeFileSync(target,raw);
 const p=duplicate();p.revision+='-invalid';p.documents.find(d=>d.kind==='stateTransition').revision+='-invalid';writeFileSync(candidate,JSON.stringify(p));writeFileSync(operation,JSON.stringify({expectedSha256:hash(raw),expectedRevision:pkg.revision}));
 for(const script of ['../tools/document_storage/author-cli.mjs','../plugins/alder/skills/alder-manage-json-documents/scripts/document_storage/author-cli.mjs']){const run=spawnSync(process.execPath,[resolve(script),'commit',target,candidate,operation],{encoding:'utf8'});assert.equal(run.status,2);assert.match(run.stderr,/Duplicate state transition condition/);assert.equal(readFileSync(target,'utf8'),raw);}
 const md=readFileSync('../work/json-state/issue-275/supported-state.md','utf8'),line=md.split('\n').find(l=>/^\| T01 \|/.test(l));assert(line);assert.throws(()=>parseDocument(md.replace(line,line+'\n'+line.replace('T01','T99'))),/Duplicate state transition condition/);
}finally{rmSync(scratch,{recursive:true,force:true});}
pass(ids[3]);

const op=JSON.parse(readFileSync(base+'purchase-state-identity.operation.json')),concept=JSON.parse(readFileSync(base+'purchase-concepts-v2-beta.json'));
assert.equal(op.expectedRevision,'purchase-v2-beta-6');assert.equal(pkg.revision,'purchase-v2-beta-8');assert.equal(st.revision,'states-v2-beta-8');assert.equal(concept.relatedStates[0].revision,st.revision);assert.equal(bd.revision,'bd-v2-beta-5');
assert.equal(hash(JSON.stringify(bd)),'b12890c25d8ad39cfd2b37dc2e10029d29a5ff4584c7d7710a8aa846aa1f24fe');
assert.equal(hash(readFileSync(base+'purchase-v1.json')),'ed5e26675c97ab4376c781cc7a47f72806c8e53d38d428540931c61f0e8b024e');
for(const id of ['T08','T11','T17','T19']){assert.equal(row(id).fromId,row(id).toId);assert.match(row(id).note,/仮説/);}
for(const name of ['終結','破棄'])assert(!st.transitions.some(t=>state(t.fromId)===name&&t.fromId===t.toId));
pass(ids[4]);

assertStateCaptionRows(stateCaptionSnapshot(svg),model.transitions);
svg.querySelector('[data-state="終結"]').dispatchEvent(new window.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));
for(const id of ['T15','T16','T17','T18']){const related=['T16','T18'].includes(id);assert.equal(svg.querySelector('path[data-transitions="'+id+'"]').classList.contains('review-related'),related);assert([...svg.querySelectorAll('[data-transition-id="'+id+'"] tspan')].every(e=>e.classList.contains('review-related')===related));}
pass(ids[5]);coverage(results);authority(readFileSync('verification/state-transition-identity.check-items.json'));window.close();console.log(JSON.stringify({stateIdentityChecks:results,limits:'Natural-language predicate overlap remains a semantic review; DOM cannot establish native rendering.'}));
