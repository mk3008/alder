import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {resolve,join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {validate,inventory,graphV1} from './core.mjs';
import {readLegacyPackage,upgradeExceptions} from './legacy-json.mjs';
import {applyEdits} from './edit.mjs';
import {guardAuthoring} from './authoring.mjs';
const fixture=JSON.parse(readFileSync(new URL('../../work/viewer-json/issue-274/json-native/independent.json',import.meta.url),'utf8'));
test('native explicit exception identity is independent of description syntax and visible name',()=>{
 validate(fixture);assert.equal(inventory(fixture).types.get('exception-receive'),'exception');
 for(const description of ['plain prose','**入力エラー**\n- 装飾\n\n説明','1. 別の例外名に見える文章','```markdown\n- **偽名** — 例\n```']){
  const q=structuredClone(fixture),bd=q.documents[0];bd.activities[0].exception=description;bd.exceptions[0].description=description;bd.exceptions[0].name='別の表示名';validate(q);
  assert.equal(q.documents[1].transitions[1].exceptionId,'exception-receive');assert.equal(q.documents[1].transitions[1].activityId,'activity-receive');
 }
 const q=structuredClone(fixture);q.documents[0].activities[0].name='受付 — → <!-- **装飾**';validate(q);assert.throws(()=>graphV1(q,'bd-native'),/Graph v1/); // Export keeps its independent contract.
});
test('missing/duplicate/cross-Activity exception IDs and version mismatches reject',()=>{
 for(const [mutate,re] of [
  [q=>q.documents[1].transitions[1].exceptionId='missing',/Dangling/],
  [q=>q.documents[0].exceptions.push({...q.documents[0].exceptions[0]}),/Duplicate ID/],
  [q=>q.documents[1].transitions[1].exceptionId='exception-review',/Activity mismatch/],
  [q=>q.documents[0].exceptions[0].activityId='missing',/Dangling/],
  [q=>q.documents[1].basedOn.revision='wrong',/Stale/],
  [q=>q.documents[1].schemaVersion='0.1',/variant/],
  [q=>q.formatVersion='0.3',/variant/],
  [q=>q.documents[1].transitions[0].exceptionId='exception-receive',/Normal/],
  [q=>q.documents[1].transitions[1].exceptionId=null,/diagnostic/]
 ]){const q=structuredClone(fixture);mutate(q);assert.throws(()=>validate(q),re);}
});
test('old JSON is explicitly normalized at compatibility boundary; ambiguous old names reject',()=>{
 const old=JSON.parse(readFileSync(new URL('../../work/json-state/issue-275/purchase.json',import.meta.url),'utf8')),original=JSON.stringify(old),next=readLegacyPackage(old);
 assert.equal(next.formatVersion,'0.4');assert.equal(JSON.stringify(old),original);assert.deepEqual(next.sources,old.sources);assert.equal(next.documents[0].revision,old.documents[0].revision);
 assert.equal(next.documents[1].transitions.find(t=>t.sourceId==='T03').exceptionId,next.documents[0].exceptions.find(e=>e.name===old.documents[1].transitions.find(t=>t.sourceId==='T03').exception).id);
 const bad=structuredClone(old);bad.documents[1].transitions.find(t=>t.exception).exception='存在しない';assert.throws(()=>readLegacyPackage(bad),/Unknown or ambiguous/);
 const duplicate=structuredClone(old),transition=duplicate.documents[1].transitions.find(t=>t.exception),activity=duplicate.documents[0].activities.find(a=>a.id===transition.activityId);activity.exception+='\n- **'+transition.exception+'** — 重複';assert.throws(()=>readLegacyPackage(duplicate),/Unknown or ambiguous|Duplicate/);
 const revisions=Object.fromEntries(old.documents.map(d=>[d.id,{expected:d.revision,next:d.revision+'-structured'}]));
 const upgraded=upgradeExceptions(old,{expectedRevision:old.revision,revision:'upgraded',documentRevisions:revisions});validate(upgraded);
 guardAuthoring(old,upgraded,{expectedRevision:old.revision,migration:'exceptions-0.4'});assert.equal(upgraded.documents[1].basedOn.verification,'unverified');
 assert.throws(()=>upgradeExceptions(old,{expectedRevision:'bad',revision:'upgraded',documentRevisions:revisions}),/conflict/);
});
test('actual Node JSON create/inspect/commit/validate work with all MD modules blocked and no Python',()=>{
 const dir=mkdtempSync(join(tmpdir(),'native-json-')),candidate=join(dir,'candidate.json'),target=join(dir,'target.json'),operation=join(dir,'operation.json'),blocker=join(dir,'blocker.mjs');
 writeFileSync(blocker,"import {registerHooks} from 'node:module'; registerHooks({resolve(s,c,next){if(/(?:legacy-json|convert|markdown|state-declaration|state-storage)\\.(?:mjs|py)$/.test(s))throw Error('MD dependency blocked: '+s);return next(s,c);}});");
 const run=(file,...args)=>spawnSync(process.execPath,['--import',blocker,resolve('tools/document_storage/'+file),...args],{encoding:'utf8',env:{...process.env,ALDER_PYTHON:'/no-python'}});
 try{
  writeFileSync(candidate,JSON.stringify(fixture));writeFileSync(operation,'{}');let r=run('author-cli.mjs','create',candidate,target,operation);assert.equal(r.status,0,r.stderr);
  const info=JSON.parse(run('author-cli.mjs','inspect',target).stdout),q=structuredClone(fixture);q.revision='package-r2';q.documents[0].revision='bd-r2';q.documents[0].exceptions[0].name='改名しても同じID';q.documents[0].exceptions[0].description='- **偽の名前** — 装飾だけ';q.documents[1].revision='st-r2';q.documents[1].basedOn.revision='bd-r2';
  writeFileSync(candidate,JSON.stringify(q));writeFileSync(operation,JSON.stringify({expectedRevision:info.revision,expectedSha256:info.sha256}));r=run('author-cli.mjs','commit',target,candidate,operation);assert.equal(r.status,0,r.stderr);assert.equal(JSON.parse(readFileSync(target)).documents[1].transitions[1].exceptionId,'exception-receive');
  r=run('cli.mjs','validate',target);assert.equal(r.status,0,r.stderr);
 }finally{rmSync(dir,{recursive:true,force:true});}
});

test('exception identity cannot silently move to another Activity',()=>{const q=structuredClone(fixture);q.documents=q.documents.slice(0,1);assert.throws(()=>applyEdits(q,{expectedRevision:'package-r1',revision:'package-r2',documentRevisions:{'bd-native':{expected:'bd-r1',next:'bd-r2'}},changes:[{id:'exception-review',values:{activityId:'activity-receive'}}]}),/ownership/);});

test('explicit 0.4 migration preserves Check human states and still requires exact BD confirmation',()=>{
 const old=JSON.parse(readFileSync(new URL('../../work/plugin-json/issue-273/snapshots/04-final-after-replay.json',import.meta.url),'utf8'));
 const documentRevisions=Object.fromEntries(old.documents.map(d=>[d.id,{expected:d.revision,next:d.revision+'-structured'}]));
 const next=upgradeExceptions(old,{expectedRevision:old.revision,revision:'structured-next',documentRevisions}),check=old.documents.find(d=>d.kind==='checkItems');
 assert.deepEqual(next.documents.find(d=>d.id===check.id).items,check.items);
 const operation={expectedRevision:old.revision,migration:'exceptions-0.4'};assert.throws(()=>guardAuthoring(old,next,operation),/Human Business Design confirmation/);
 guardAuthoring(old,next,{...operation,bdConfirmations:[{documentId:next.documents[0].id,revision:next.documents[0].revision,evidence:{source:'synthetic migration fixture only',quote:'この固定版の業務内容を確認する模擬イベント'}}]});
});
