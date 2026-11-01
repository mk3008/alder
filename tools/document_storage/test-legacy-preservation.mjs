import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {guardAuthoring} from './authoring.mjs';
import {applyEdits} from './edit.mjs';
import {exampleCheckIds,requireCheckedSamples,validate} from './core.mjs';

const authority=readFileSync(new URL('./legacy-samples.check-items.json',import.meta.url));
const authorityHash='8820e8a1db1da6017fcd4a0d9cefc1c372cfeb14e3fcc839f2a5eb45b05c3ec8';
const verifyAuthority=bytes=>{assert.equal(createHash('sha256').update(bytes).digest('hex'),authorityHash);return JSON.parse(bytes).checks.map(c=>c.id);};
const ids=verifyAuthority(authority),covered=new Set();
assert.deepEqual(ids,['LEGACY-SAMPLE-001','LEGACY-SAMPLE-002','LEGACY-SAMPLE-003']);
assert.throws(()=>verifyAuthority(Buffer.from('{}')));
const mainFixture=JSON.parse(readFileSync(new URL('../../work/concept-review/issue-133/versions/purchase-v3-beta.json',import.meta.url),'utf8'));
const releasedFixture=JSON.parse(readFileSync(new URL('../../work/plugin-json/issue-273/snapshots/04-final-after-replay.json',import.meta.url),'utf8'));
const model=p=>p.documents.find(d=>d.kind==='conceptModel');
const check=p=>p.documents.find(d=>d.kind==='checkItems');
const sample=p=>model(p).reviewGroups[0].capabilities.flatMap(c=>c.samples)[0];
const legacyChecks=()=>{
 const p=structuredClone(releasedFixture),d=check(p),example=d.examples[0],guaranteeId=example.guaranteeId;
 for(const row of example.rows)for(const cell of row)for(let i=0;i<cell.length;i++)if(cell[i].kind==='reference')cell[i]={kind:'text',value:cell[i].label};
 for(const item of d.items)for(const runs of Object.values(item.fields))for(let i=0;i<runs.length;i++)if(runs[i].kind==='reference'&&runs[i].targetId===guaranteeId)runs[i]={kind:'text',value:runs[i].label};
 assert.deepEqual(exampleCheckIds(d,example),[]);validate(p);return p;
};
const editCheck=p=>{const n=structuredClone(p);n.revision+='-edit';const d=check(n);d.revision+='-edit';d.intro.push({kind:'text',value:'無関係な補足'});return n;};
const syntheticEvidence=p=>({expectedRevision:p.revision,bdConfirmations:[{documentId:check(p).basedOn.documentId,revision:check(p).basedOn.revision,evidence:{source:'synthetic test only',quote:'fictional confirmation for this fixture'}}]});

test('unchanged historical examples survive an unrelated update without inferred links',()=>{
 const before=structuredClone(mainFixture),n=structuredClone(before),m=model(n);n.revision+='-edit';m.revision+='-edit';m.benefits.push('補足。');
 assert.equal(guardAuthoring(before,n,{expectedRevision:before.revision}).valid,true);
 assert.deepEqual(sample(n),sample(before));
 const viaEdit=applyEdits(before,{expectedRevision:before.revision,revision:before.revision+'-direct',documentRevisions:{[m.id]:{expected:model(before).revision,next:model(before).revision+'-direct'}},changes:[{id:m.id,values:{benefits:[...model(before).benefits,'補足']}}]});
 assert.deepEqual(sample(viaEdit),sample(before));

 const prior=legacyChecks(),next=editCheck(prior);
 assert.equal(guardAuthoring(prior,next,syntheticEvidence(prior)).valid,true);
 assert.deepEqual(check(next).examples,check(prior).examples);
 assert.deepEqual(check(next).items.map(i=>[i.id,i.reviewState]),check(prior).items.map(i=>[i.id,i.reviewState]));
 assert.deepEqual(exampleCheckIds(check(next),check(next).examples[0]),[]);
 covered.add('LEGACY-SAMPLE-001');
});

test('changed, added, moved or context-changed historical samples require explicit migration',()=>{
 const prior=structuredClone(mainFixture),base=structuredClone(prior),m=model(base);base.revision+='-edit';m.revision+='-edit';
 for(const mutate of [
  p=>{sample(p).meaning+=' changed';},
  p=>{const cap=model(p).reviewGroups[0].capabilities.find(c=>c.samples.length);cap.samples.push({...structuredClone(cap.samples[0]),id:'added-sample'});},
  p=>{const cap=model(p).reviewGroups[0].capabilities.find(c=>c.samples.length);cap.title+=' changed';},
  p=>{model(p).concepts[0].description+=' changed';},
 ]){
  const n=structuredClone(base);mutate(n);assert.throws(()=>guardAuthoring(prior,n,{expectedRevision:prior.revision}),/Legacy samples require explicit Check references/);
 }
 const changedSource=structuredClone(base);model(changedSource).basedOn.revision+='-changed';
 assert.throws(()=>requireCheckedSamples(changedSource,prior),/Legacy samples require explicit Check references/);
 const old=legacyChecks(),next=editCheck(old),d=check(next),g=d.examples[0].guaranteeId;
 for(const mutate of [
  p=>{check(p).examples[0].columns[0]='changed';},
  p=>{check(p).guarantees.find(v=>v.id===g).title+=' changed';},
  p=>{const c=check(p),parent=c.guarantees.find(v=>v.id===g);c.sections.find(v=>v.id===parent.sectionId).title+=' changed';},
 ]){
  const n=structuredClone(next);mutate(n);assert.throws(()=>guardAuthoring(old,n,syntheticEvidence(old)),/Check example needs an explicit Check reference/);
 }
 const sourceChanged=structuredClone(next);check(sourceChanged).basedOn.revision+='-changed';
 assert.throws(()=>requireCheckedSamples(sourceChanged,old),/Check example needs an explicit Check reference/);
 const lostLink=legacyChecks();assert.throws(()=>requireCheckedSamples(lostLink,releasedFixture),/Check example needs an explicit Check reference/);
 covered.add('LEGACY-SAMPLE-002');
});

test('new samples and changes to human review remain protected',()=>{
 const old=legacyChecks();assert.throws(()=>guardAuthoring(null,old),/Check example needs an explicit Check reference/);
 assert.throws(()=>requireCheckedSamples(mainFixture),/Legacy samples require explicit Check references/);
 const edited=editCheck(old),item=check(edited).items.find(i=>i.reviewState==='要確認');assert(item);item.reviewState='確認済み';
 assert.throws(()=>guardAuthoring(old,edited,syntheticEvidence(old)),/Human review state cannot change without explicit feedback/);
 assert.equal(verifyAuthority(readFileSync(new URL('./legacy-samples.check-items.json',import.meta.url))).length,3);
 covered.add('LEGACY-SAMPLE-003');
});
test('all independent compatibility requirements were exercised',()=>assert.deepEqual([...covered].sort(),ids.slice().sort()));
