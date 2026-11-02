import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fingerprint} from './authoring.mjs';
import {namedPlansSchema,validateNamedPlans,selectNamedPlan} from './named-plans.mjs';

const fixture=name=>JSON.parse(fs.readFileSync(new URL('../../work/plugin-json/issue-273/snapshots/'+name,import.meta.url),'utf8'));
const p1=fixture('01-direct-bd.json'),p2=fixture('02-add-rename.json'),p3=fixture('03-direct-checks.json');
const bundle=()=>({format:'alder-named-plans',formatVersion:'1.0',plans:[{id:'current',name:'現行案',package:structuredClone(p1)},{id:'next',name:'改善案',package:structuredClone(p1)},{id:'alternative',name:'別案',package:structuredClone(p3)}]});
test('NAMED-PLANS-002: schema and three independent plans preserve identical inner IDs',()=>{
 assert.deepEqual(namedPlansSchema,JSON.parse(fs.readFileSync(new URL('./named-plans-schema.json',import.meta.url),'utf8')));
 const b=bundle(),original=structuredClone(b);assert.equal(validateNamedPlans(b).valid,true);assert.deepEqual(b,original);
 assert.equal(selectNamedPlan(b,'next').package.documents[0].id,b.plans[0].package.documents[0].id);
 const one={...b,plans:[b.plans[0]]};assert.equal(validateNamedPlans(one).valid,true);assert.equal(selectNamedPlan(one,'current').name,'現行案');
 assert.throws(()=>selectNamedPlan(b,'missing'),/Unknown plan ID/);
});
test('NAMED-PLANS-003: malformed envelope and every inner package are rejected',()=>{
 for(const mutate of [
  b=>b.plans.splice(0),b=>b.plans[0].id='',b=>b.plans[0].id='bad id',b=>b.plans[1].id=b.plans[0].id,
  b=>b.plans[0].name=' ',b=>b.plans[0].name=' name ',b=>b.plans[0].extra=true,b=>b.extra=true,
  b=>b.format='unknown',b=>b.formatVersion='2.0',b=>b.plans[2].package.formatVersion='unknown',
  b=>b.plans[2].package.documents[0].relations[0].fromId='missing',b=>b.plans[2].package=bundle()
 ]){const b=bundle();mutate(b);assert.throws(()=>validateNamedPlans(b));}
});
test('NAMED-PLANS-004/005/008: create, extract and guarded commit preserve other plans and source files',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'alder-plans-'));
 try{
  const file=n=>path.join(dir,n),source=file('source.json'),second=file('second.json'),target=file('plans.json'),candidate=file('candidate.json'),op=file('operation.json'),extracted=file('extracted.json');
  fs.writeFileSync(source,JSON.stringify(p1));fs.writeFileSync(second,JSON.stringify(p3));fs.writeFileSync(candidate,JSON.stringify(p2));
  const run=(...args)=>spawnSync(process.execPath,[new URL('./named-plans-cli.mjs',import.meta.url).pathname,...args],{encoding:'utf8'});
  const sourceBytes=fs.readFileSync(source,'utf8'),created=run('create',target,'current','現行案',source,'next','改善案',source,'alternative','別案',second);
  assert.equal(created.status,0,created.stderr);assert.equal(fs.readFileSync(source,'utf8'),sourceBytes);
  if(process.platform!=='win32')assert.equal(fs.statSync(target).mode&0o077,0);
  const initial=fs.readFileSync(target,'utf8');assert.equal(run('create',target,'current','現行案',source).status,2);assert.equal(fs.readFileSync(target,'utf8'),initial);
  assert.equal(run('extract',target,'current',extracted).status,0);assert.deepEqual(JSON.parse(fs.readFileSync(extracted)),p1);assert.equal(run('extract',target,'current',extracted).status,2);
  if(process.platform!=='win32')assert.equal(fs.statSync(extracted).mode&0o077,0);
  fs.writeFileSync(op,JSON.stringify({expectedRevision:p1.revision,expectedSha256:'wrong'}));assert.equal(run('commit',target,'current',candidate,op).status,2);assert.equal(fs.readFileSync(target,'utf8'),initial);
  fs.writeFileSync(op,JSON.stringify({expectedRevision:p1.revision,expectedSha256:fingerprint(initial)}));
  fs.writeFileSync(target+'.alder-lock','foreign');assert.equal(run('commit',target,'current',candidate,op).status,2);assert.equal(fs.readFileSync(target+'.alder-lock','utf8'),'foreign');fs.unlinkSync(target+'.alder-lock');
  const committed=run('commit',target,'current',candidate,op);assert.equal(committed.status,0,committed.stderr);
  const saved=JSON.parse(fs.readFileSync(target)),before=JSON.parse(initial);assert.deepEqual(saved.plans[0].package,p2);assert.deepEqual(saved.plans.slice(1),before.plans.slice(1));
  const savedText=fs.readFileSync(target,'utf8');assert.equal(run('commit',target,'current',candidate,op).status,2);assert.equal(fs.readFileSync(target,'utf8'),savedText);
  assert.equal(run('commit',target,'unknown',candidate,op).status,2);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
for(const mode of [0o600,0o640,0o644,0o660])test(`NAMED-PLANS-MODE-001: commit preserves ${mode.toString(8)} permissions`,{skip:process.platform==='win32'},()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'alder-plans-mode-'));
 try{
  const file=n=>path.join(dir,n),source=file('source.json'),target=file('plans.json'),candidate=file('candidate.json'),op=file('operation.json');
  const run=(...args)=>spawnSync(process.execPath,[new URL('./named-plans-cli.mjs',import.meta.url).pathname,...args],{encoding:'utf8'});
  fs.writeFileSync(source,JSON.stringify(p1));fs.writeFileSync(candidate,JSON.stringify(p2));const sourceBytes=fs.readFileSync(source);
  const created=run('create',target,'current','現行案',source,'next','改善案',source,'alternative','別案',source);assert.equal(created.status,0,created.stderr);
  fs.chmodSync(target,mode);assert.equal(fs.statSync(target).mode&0o7777,mode);
  const before=fs.readFileSync(target,'utf8'),plans=JSON.parse(before).plans;
  fs.writeFileSync(op,JSON.stringify({expectedRevision:p1.revision,expectedSha256:fingerprint(before)}));
  const committed=run('commit',target,'current',candidate,op);assert.equal(committed.status,0,committed.stderr);
  assert.equal(fs.statSync(target).mode&0o7777,mode);const saved=JSON.parse(fs.readFileSync(target));
  assert.deepEqual(saved.plans[0].package,p2);assert.deepEqual(saved.plans.slice(1),plans.slice(1));assert.deepEqual(fs.readFileSync(source),sourceBytes);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('NAMED-PLANS-MODE-002: guard or chmod failure preserves bytes and permissions',{skip:process.platform==='win32'},()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'alder-plans-mode-failure-'));
 try{
  const file=n=>path.join(dir,n),target=file('plans.json'),candidate=file('candidate.json'),op=file('operation.json'),preload=file('fail-chmod.mjs');
  const cli=new URL('./named-plans-cli.mjs',import.meta.url).pathname;
  const run=(prefix,...args)=>spawnSync(process.execPath,[...prefix,cli,...args],{encoding:'utf8'});
  fs.writeFileSync(target,JSON.stringify(bundle()));fs.chmodSync(target,0o644);fs.writeFileSync(candidate,JSON.stringify(p2));
  const before=fs.readFileSync(target,'utf8'),check=()=>{assert.equal(fs.readFileSync(target,'utf8'),before);assert.equal(fs.statSync(target).mode&0o7777,0o644);assert.equal(fs.existsSync(target+'.alder-lock'),false);assert.deepEqual(fs.readdirSync(dir).filter(n=>n.startsWith('.alder-plans-')),[]);};
  fs.writeFileSync(op,JSON.stringify({expectedRevision:p1.revision,expectedSha256:'wrong'}));assert.equal(run([],'commit',target,'current',candidate,op).status,2);check();
  fs.writeFileSync(op,JSON.stringify({expectedRevision:'wrong',expectedSha256:fingerprint(before)}));assert.equal(run([],'commit',target,'current',candidate,op).status,2);check();
  fs.writeFileSync(op,JSON.stringify({expectedRevision:p1.revision,expectedSha256:fingerprint(before)}));
  fs.writeFileSync(preload,"import fs from 'node:fs';fs.chmodSync=()=>{throw Error('synthetic chmod failure');};\n");
  const failed=run(['--import',preload],'commit',target,'current',candidate,op);assert.equal(failed.status,2,failed.stderr);assert.match(failed.stderr,/synthetic chmod failure/);check();
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
test('NAMED-PLANS-005: an attempted human-state change cannot bypass the single-package guard',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'alder-plans-human-'));
 try{
  const target=path.join(dir,'plans.json'),candidate=path.join(dir,'candidate.json'),op=path.join(dir,'operation.json'),b=bundle();
  fs.writeFileSync(target,JSON.stringify(b));const before=fs.readFileSync(target,'utf8'),q=structuredClone(p3);q.revision+='-next';const check=q.documents.find(d=>d.kind==='checkItems');check.revision+='-next';check.items[0].reviewState='確認済み';
  fs.writeFileSync(candidate,JSON.stringify(q));fs.writeFileSync(op,JSON.stringify({expectedRevision:p3.revision,expectedSha256:fingerprint(before)}));
  const result=spawnSync(process.execPath,[new URL('./named-plans-cli.mjs',import.meta.url).pathname,'commit',target,'alternative',candidate,op],{encoding:'utf8'});
  assert.equal(result.status,2);assert.equal(fs.readFileSync(target,'utf8'),before);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
