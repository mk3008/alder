import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {guardAuthoring,fingerprint,meaningHash} from './authoring.mjs';
import {readLegacyPackage} from './legacy-json.mjs';
const root=new URL('../../work/plugin-json/issue-273/',import.meta.url),read=n=>JSON.parse(fs.readFileSync(new URL('snapshots/'+n,root),'utf8'));
const p1=read('01-direct-bd.json'),p2=read('02-add-rename.json'),p3=read('03-direct-checks.json');
const c=p=>p.documents.find(d=>d.kind==='checkItems'),b=p=>p.documents[0];
const confirm=p=>({bdConfirmations:[{documentId:b(p).id,revision:b(p).revision,evidence:{source:'fixture:notes.ja.md',quote:'試験用の模擬人間合意。実業務の承認ではない。'}}]});
const operation=(p,next)=>({expectedRevision:p.revision,...confirm(next)});
function update(p,fn){const q=structuredClone(p);q.revision=p.revision+'-next';fn(q);return q;}

test('direct BD create needs no Markdown or Python',()=>assert.equal(guardAuthoring(null,p1).approval,'not-evaluated'));
test('add Activity/Object, rename and pending Findings retain existing IDs',()=>{guardAuthoring(p1,p2,{expectedRevision:p1.revision});for(const f of b(p1).findings)assert.deepEqual(b(p2).findings.find(n=>n.id===f.id),f);assert.equal(b(p1).objects[1].id,b(p2).objects[1].id);});
test('Check drafting requires human BD confirmation for exact revision',()=>{assert.throws(()=>guardAuthoring(p2,p3,{expectedRevision:p2.revision}),/Human Business Design/);assert.equal(guardAuthoring(p2,p3,operation(p2,p3)).valid,true);const op=operation(p2,p3);op.bdConfirmations[0].revision='wrong';assert.throws(()=>guardAuthoring(p2,p3,op),/Human Business Design/);});
test('generic permission or invented confirmed state does not approve a new draft',()=>{const q=structuredClone(p3);c(q).items[0].reviewState='確認済み';assert.throws(()=>guardAuthoring(p2,q,operation(p2,q)),/New Check/);});
test('human review binds exact expectation and does not touch other states',()=>{const q=update(p3,q=>{c(q).revision='checks-2';c(q).items[0].reviewState='確認済み';});const item=c(q).items[0],op=operation(p3,q);assert.throws(()=>guardAuthoring(p3,q,op),/Human review state/);op.humanDecisions=[{id:item.id,state:item.reviewState,meaningSha256:meaningHash(q,item),evidence:{source:'fixture:event-2',quote:'CI-001の条件と期待を確認'}}];guardAuthoring(p3,q,op);assert.equal(meaningHash(q,item),meaningHash(p3,c(p3).items[0]));assert.deepEqual(c(q).items.slice(1),c(p3).items.slice(1));op.humanDecisions[0].meaningSha256='wrong';assert.throws(()=>guardAuthoring(p3,q,op),/different Check/);});
test('changed shared guarantee forces all affected expectations back to review',()=>{const base=structuredClone(p3);c(base).items[1].reviewState=c(base).items[2].reviewState='確認済み';const q=update(base,q=>{c(q).revision='checks-2';c(q).guarantees[1].blocks[0].content[0].value+='（未承認の変更）';});assert.throws(()=>guardAuthoring(base,q,operation(base,q)),/renewed human review/);c(q).items[1].reviewState=c(q).items[2].reviewState='要確認';guardAuthoring(base,q,operation(base,q));});
test('missing Test evidence alone preserves confirmed state',()=>{const base=structuredClone(p3);c(base).items[0].reviewState='確認済み';const q=update(base,q=>{c(q).revision='checks-2';c(q).items[0].fields.testEvidence=[{kind:'text',value:'証拠未収集を再確認'}];});guardAuthoring(base,q,operation(base,q));assert.equal(c(q).items[0].reviewState,'確認済み');});
test('pending correction cannot silently become confirmed after text repair',()=>{const base=structuredClone(p3);c(base).items[0].reviewState='要修正';const q=update(base,q=>{c(q).revision='checks-2';c(q).items[0].title+='修正';c(q).items[0].reviewState='確認済み';});assert.throws(()=>guardAuthoring(base,q,operation(base,q)),/renewed human review/);c(q).items[0].reviewState='要修正';guardAuthoring(base,q,operation(base,q));});
test('reorder is a content change, preserves IDs and does not approve Checks',()=>{const q=update(p3,q=>{c(q).revision='checks-2';c(q).items.reverse();});guardAuthoring(p3,q,operation(p3,q));assert.equal(c(q).items.find(i=>i.checkId==='CI-Q01').reviewState,'要確認');});
test('stale reference or missing new document revision is refused',()=>{const q=update(p3,q=>{b(q).revision='bd-3';});assert.throws(()=>guardAuthoring(p3,q,operation(p3,q)),/Stale Check/);const q2=update(p1,q=>b(q).activities[0].why+='追加');assert.throws(()=>guardAuthoring(p1,q2,operation(p1,q2)),/revision/);});
test('ID replacement, provenance loss, and fake decisions are refused',()=>{const q=update(p1,q=>{b(q).revision='bd-2';b(q).findings[0].id='replaced';});assert.throws(()=>guardAuthoring(p1,q,operation(p1,q)),/ID was removed/);assert.throws(()=>guardAuthoring(null,p1,{humanDecisions:[{id:'unknown'}]}),/unknown/);});

test('CLI protects last package, CAS, alias targets, lock and runtime without Python',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'alder-json-guard-')),cli=new URL('./author-cli.mjs',import.meta.url).pathname;
 try{const native1=readLegacyPackage(p1),native2=readLegacyPackage(p2),target=path.join(dir,'design.json'),candidate=path.join(dir,'candidate.json'),opfile=path.join(dir,'op.json');fs.writeFileSync(candidate,JSON.stringify(native1));fs.writeFileSync(opfile,'{}');
 const run=(args,env={})=>spawnSync(process.execPath,[cli,...args],{encoding:'utf8',env:{...process.env,...env}});
 assert.equal(run(['create',candidate,target,opfile]).status,0);const initial=fs.readFileSync(target,'utf8');assert.equal(run(['create',candidate,target,opfile]).status,2);
 const runtime=run(['runtime'],{ALDER_PYTHON:'/missing-python'});assert.equal(runtime.status,0);assert.equal(JSON.parse(runtime.stdout).directJSON,true);assert.equal(JSON.parse(runtime.stdout).markdownConversion,false);
 fs.writeFileSync(candidate,JSON.stringify(native2));let op={expectedRevision:native1.revision,expectedSha256:'wrong'};fs.writeFileSync(opfile,JSON.stringify(op));assert.equal(run(['commit',target,candidate,opfile]).status,2);assert.equal(fs.readFileSync(target,'utf8'),initial);
 op.expectedSha256=fingerprint(initial);fs.writeFileSync(opfile,JSON.stringify(op));fs.writeFileSync(target+'.alder-lock','foreign lock');assert.equal(run(['commit',target,candidate,opfile]).status,2);assert.equal(fs.readFileSync(target+'.alder-lock','utf8'),'foreign lock');fs.unlinkSync(target+'.alder-lock');
 assert.equal(run(['commit',target,candidate,opfile]).status,0);const saved=fs.readFileSync(target,'utf8');assert.equal(JSON.parse(saved).revision,native2.revision);assert.equal(run(['commit',target,candidate,opfile]).status,2);assert.equal(fs.readFileSync(target,'utf8'),saved);
 fs.writeFileSync(candidate,'{broken');assert.equal(run(['commit',target,candidate,opfile]).status,2);assert.equal(fs.readFileSync(target,'utf8'),saved);assert.ok(!fs.readdirSync(dir).some(f=>f.includes('.alder-json-')||f.endsWith('.alder-lock')));
 for(const [name,link]of [['alias',fs.symlinkSync],['hard',fs.linkSync]]){const alias=path.join(dir,name);link(target,alias);fs.writeFileSync(candidate,JSON.stringify(native2));assert.equal(run(['commit',alias,candidate,opfile]).status,2);assert.equal(fs.readFileSync(target,'utf8'),saved);}
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});

// Synthetic snapshots are normalized only to prepare current-version test fixtures.
for(const mode of [0o600,0o640,0o644,0o660])test(`AUTHOR-MODE-001: commit preserves ${mode.toString(8)} permissions`,{skip:process.platform==='win32'},()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'alder-author-mode-'));
 try{
  const target=path.join(dir,'target.json'),candidate=path.join(dir,'candidate.json'),op=path.join(dir,'operation.json');
  const previous=readLegacyPackage(p1),next=readLegacyPackage(p2);
  fs.writeFileSync(target,JSON.stringify(previous));fs.chmodSync(target,mode);assert.equal(fs.statSync(target).mode&0o7777,mode);
  fs.writeFileSync(candidate,JSON.stringify(next));const candidateBytes=fs.readFileSync(candidate);
  fs.writeFileSync(op,JSON.stringify({expectedRevision:previous.revision,expectedSha256:fingerprint(fs.readFileSync(target,'utf8'))}));
  const committed=spawnSync(process.execPath,[new URL('./author-cli.mjs',import.meta.url).pathname,'commit',target,candidate,op],{encoding:'utf8'});
  assert.equal(committed.status,0,committed.stderr);assert.equal(JSON.parse(committed.stdout).approval,'not-evaluated');
  assert.equal(fs.statSync(target).mode&0o7777,mode);assert.deepEqual(JSON.parse(fs.readFileSync(target,'utf8')),next);
  assert.deepEqual(fs.readFileSync(candidate),candidateBytes);assert.ok(!fs.readdirSync(dir).some(n=>n.startsWith('.alder-json-')||n.endsWith('.alder-lock')));
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
for(const mode of [0o600,0o640,0o644,0o660])test(`AUTHOR-MODE-002: guard or save failure preserves bytes and ${mode.toString(8)} permissions`,{skip:process.platform==='win32'},()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'alder-author-mode-failure-'));
 try{
  const target=path.join(dir,'target.json'),candidate=path.join(dir,'candidate.json'),op=path.join(dir,'operation.json'),preload=path.join(dir,'fail-save.mjs');
  const previous=readLegacyPackage(p1),next=readLegacyPackage(p2),cli=new URL('./author-cli.mjs',import.meta.url).pathname;
  fs.writeFileSync(target,JSON.stringify(previous));fs.chmodSync(target,mode);fs.writeFileSync(candidate,JSON.stringify(next));
  const before=fs.readFileSync(target),validOp={expectedRevision:previous.revision,expectedSha256:fingerprint(before.toString('utf8'))};
  const check=()=>{assert.deepEqual(fs.readFileSync(target),before);assert.equal(fs.statSync(target).mode&0o7777,mode);assert.equal(fs.existsSync(target+'.alder-lock'),false);assert.deepEqual(fs.readdirSync(dir).filter(n=>n.startsWith('.alder-json-')),[]);};
  const fail=(prefix,message)=>{const result=spawnSync(process.execPath,[...prefix,cli,'commit',target,candidate,op],{encoding:'utf8'});assert.equal(result.status,2,result.stderr);assert.match(result.stderr,message);check();};
  fs.writeFileSync(op,JSON.stringify({...validOp,expectedSha256:'wrong'}));fail([],/File content conflict/);
  fs.writeFileSync(op,JSON.stringify({...validOp,expectedRevision:'wrong'}));fail([],/Package revision conflict/);
  fs.writeFileSync(op,JSON.stringify(validOp));
  for(const method of ['fsyncSync','chmodSync','renameSync']){
   fs.writeFileSync(preload,`import fs from 'node:fs';fs.${method}=()=>{throw Error('synthetic ${method} failure');};\n`);
   fail(['--import',preload],new RegExp(`synthetic ${method} failure`));
  }
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('AUTHOR-MODE-002: human agreement guards preserve bytes and permissions',{skip:process.platform==='win32'},()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'alder-author-mode-human-'));
 try{
  const target=path.join(dir,'target.json'),candidate=path.join(dir,'candidate.json'),op=path.join(dir,'operation.json');
  const previous=readLegacyPackage(p3),next=update(previous,q=>{c(q).revision+='-next';c(q).items[0].reviewState='確認済み';});
  fs.writeFileSync(target,JSON.stringify(previous));fs.chmodSync(target,0o644);fs.writeFileSync(candidate,JSON.stringify(next));
  const before=fs.readFileSync(target),validOp={expectedRevision:previous.revision,expectedSha256:fingerprint(before.toString('utf8'))};
  for(const [input,message]of [[validOp,/Human Business Design/],[{...validOp,...confirm(next)},/Human review state/]]){
   fs.writeFileSync(op,JSON.stringify(input));
   const result=spawnSync(process.execPath,[new URL('./author-cli.mjs',import.meta.url).pathname,'commit',target,candidate,op],{encoding:'utf8'});
   assert.equal(result.status,2,result.stderr);assert.match(result.stderr,message);assert.deepEqual(fs.readFileSync(target),before);assert.equal(fs.statSync(target).mode&0o7777,0o644);
   assert.ok(!fs.readdirSync(dir).some(n=>n.startsWith('.alder-json-')||n.endsWith('.alder-lock')));
  }
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('AUTHOR-MODE-002: final fingerprint conflict stops before chmod or rename',{skip:process.platform==='win32'},()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'alder-author-mode-conflict-'));
 try{
  const target=path.join(dir,'target.json'),candidate=path.join(dir,'candidate.json'),op=path.join(dir,'operation.json'),preload=path.join(dir,'change-target.mjs');
  const previous=readLegacyPackage(p1),next=readLegacyPackage(p2);
  fs.writeFileSync(target,JSON.stringify(previous));fs.chmodSync(target,0o644);fs.writeFileSync(candidate,JSON.stringify(next));
  const before=fs.readFileSync(target,'utf8');fs.writeFileSync(op,JSON.stringify({expectedRevision:previous.revision,expectedSha256:fingerprint(before)}));
  // Simulate an external writer after the temp file is written, before the final content check.
  fs.writeFileSync(preload,`import fs from 'node:fs';const sync=fs.fsyncSync;fs.fsyncSync=fd=>{sync(fd);fs.appendFileSync(${JSON.stringify(target)},' ');};for(const method of ['chmodSync','renameSync'])fs[method]=()=>{throw Error('unexpected '+method);};\n`);
  const result=spawnSync(process.execPath,['--import',preload,new URL('./author-cli.mjs',import.meta.url).pathname,'commit',target,candidate,op],{encoding:'utf8'});
  assert.equal(result.status,2,result.stderr);assert.match(result.stderr,/File changed while preparing save/);
  assert.equal(fs.readFileSync(target,'utf8'),before+' ');assert.equal(fs.statSync(target).mode&0o7777,0o644);
  assert.ok(!fs.readdirSync(dir).some(n=>n.startsWith('.alder-json-')||n.endsWith('.alder-lock')));
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});

test('PURCHASE-STATE-005: transition removal retains CLI byte conflict protection',()=>{
 const previous=readLegacyPackage(JSON.parse(fs.readFileSync(new URL('../../work/json-state/issue-275/purchase.json',import.meta.url),'utf8')));
 const next=structuredClone(previous),state=next.documents.find(d=>d.kind==='stateTransition'),removed=state.transitions.pop();
 next.revision+='-next';state.revision+='-next';
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'alder-state-removal-'));
 try{
  const target=path.join(dir,'target.json'),candidate=path.join(dir,'candidate.json'),opfile=path.join(dir,'operation.json');
  const original=JSON.stringify(previous);fs.writeFileSync(target,original);fs.writeFileSync(candidate,JSON.stringify(next));
  const operation={expectedRevision:previous.revision,expectedSha256:'wrong',removedTransitions:[{id:removed.id,reason:'試験用の訂正',source:'fixture:test'}]};
  const run=()=>spawnSync(process.execPath,[new URL('./author-cli.mjs',import.meta.url).pathname,'commit',target,candidate,opfile],{encoding:'utf8'});
  fs.writeFileSync(opfile,JSON.stringify(operation));assert.equal(run().status,2);assert.equal(fs.readFileSync(target,'utf8'),original);
  operation.expectedSha256=fingerprint(original);fs.writeFileSync(opfile,JSON.stringify(operation));
  assert.equal(run().status,0);assert.deepEqual(JSON.parse(fs.readFileSync(target,'utf8')),next);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
