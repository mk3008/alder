import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fingerprint} from './authoring.mjs';
import {upgradeRoles} from './roles.mjs';

const read=p=>JSON.parse(fs.readFileSync(new URL('../../'+p,import.meta.url),'utf8'));
const old1=read('work/plugin-json/issue-273/snapshots/01-direct-bd.json');
const old2=read('work/json-state/issue-275/purchase.json');
const revisions=Object.fromEntries(old2.documents.map(d=>[d.id,{expected:d.revision,next:d.revision+'-roles'}]));
const old3=upgradeRoles(old2,{expectedRevision:old2.revision,revision:old2.revision+'-roles',documentRevisions:revisions});
const current=read('work/viewer-json/issue-274/json-native/independent.json');
const next=structuredClone(current);next.revision+='-next';const bd=next.documents.find(d=>d.kind==='businessDesign');bd.revision+='-next';bd.activities[0].name+='（改名）';
for(const doc of next.documents.filter(d=>d.basedOn?.documentId===bd.id)){doc.revision+='-next';doc.basedOn.revision=bd.revision;}
const cli=file=>new URL('./'+file,import.meta.url).pathname;
const run=(file,...args)=>spawnSync(process.execPath,[cli(file),...args],{encoding:'utf8'});
const message=result=>JSON.parse(result.stderr).diagnostics[0].message;
const write=(file,value)=>fs.writeFileSync(file,JSON.stringify(value));
const expectVersion=(info,pkg,editable)=>assert.deepEqual(info.compatibility,{format:'alder-document-package',formatVersion:pkg.formatVersion,readable:true,editable,conversion:editable?'not-required':'explicit-only-unassessed'});

test('VERSION-POLICY-001: inspect identifies readable 0.1–0.4 without writing',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'alder-version-read-'));
 try{for(const pkg of [old1,old2,old3,current]){
  const file=path.join(dir,pkg.formatVersion+'.json');write(file,pkg);const before=fs.readFileSync(file);
  const result=run('author-cli.mjs','inspect',file);assert.equal(result.status,0,result.stderr);
  expectVersion(JSON.parse(result.stdout),pkg,pkg.formatVersion==='0.4');assert.deepEqual(fs.readFileSync(file),before);
 }}finally{fs.rmSync(dir,{recursive:true,force:true});}
});

test('VERSION-POLICY-002/003: only current packages can be created or directly committed',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'alder-version-write-'));
 try{
  const candidate=path.join(dir,'candidate.json'),op=path.join(dir,'op.json'),target=path.join(dir,'target.json');write(op,{});
  for(const pkg of [old1,old2,old3,{...current,formatVersion:'0.5'},{...current,format:'unknown-format'}]){
   write(candidate,pkg);const result=run('author-cli.mjs','create',candidate,target,op);assert.equal(result.status,2,result.stderr);
   assert.match(message(result),/0\.4/);assert.ok(message(result).includes(pkg.formatVersion));assert.ok(message(result).includes(pkg.format));assert.equal(fs.existsSync(target),false);
  }
  for(const version of [0.5,null]){
   write(candidate,{...current,formatVersion:version});const result=run('author-cli.mjs','create',candidate,target,op);
   assert.equal(result.status,2,result.stderr);assert.ok(message(result).includes('formatVersion='+JSON.stringify(version)));assert.equal(fs.existsSync(target),false);
  }
  for(const old of [old1,old2,old3]){
   write(target,old);const before=fs.readFileSync(target);write(candidate,{...old,revision:old.revision+'-next'});write(op,{expectedRevision:old.revision,expectedSha256:fingerprint(before.toString())});
   const denied=run('author-cli.mjs','commit',target,candidate,op);assert.equal(denied.status,2,denied.stderr);assert.ok(message(denied).includes(old.formatVersion));assert.match(message(denied),/0\.4/);assert.match(message(denied),/explicit/i);assert.deepEqual(fs.readFileSync(target),before);
   write(candidate,next);write(op,{expectedRevision:old.revision,expectedSha256:fingerprint(before.toString()),migration:'exceptions-0.4'});
   assert.equal(run('author-cli.mjs','commit',target,candidate,op).status,2);assert.deepEqual(fs.readFileSync(target),before);fs.unlinkSync(target);
  }
  const malformed=structuredClone(current);malformed.documents[0].activities[0].id='';write(candidate,malformed);write(op,{});
  const invalid=run('author-cli.mjs','create',candidate,target,op);assert.equal(invalid.status,2,invalid.stderr);assert.match(message(invalid),/candidate/);assert.match(message(invalid),/alder-document-package/);assert.match(message(invalid),/0\.4/);assert.match(message(invalid),/correct/i);assert.equal(fs.existsSync(target),false);
  write(candidate,current);write(op,{});let result=run('author-cli.mjs','create',candidate,target,op);assert.equal(result.status,0,result.stderr);
  const before=fs.readFileSync(target,'utf8');write(candidate,next);write(op,{expectedRevision:current.revision,expectedSha256:fingerprint(before)});
  result=run('author-cli.mjs','commit',target,candidate,op);assert.equal(result.status,0,result.stderr);assert.deepEqual(JSON.parse(fs.readFileSync(target)),next);
  const saved=fs.readFileSync(target);write(candidate,old1);assert.equal(run('author-cli.mjs','commit',target,candidate,op).status,2);assert.deepEqual(fs.readFileSync(target),saved);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});

test('VERSION-POLICY-004: mixed named plans gate only the requested plan and preserve the others',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'alder-version-plans-'));
 try{
  const legacy=path.join(dir,'legacy.json'),native=path.join(dir,'native.json'),plans=path.join(dir,'plans.json'),candidate=path.join(dir,'candidate.json'),op=path.join(dir,'op.json');
  write(legacy,old1);write(native,current);const sourceBefore=fs.readFileSync(legacy);
  let result=run('named-plans-cli.mjs','create',plans,'old','旧案',legacy,'new','現行案',native);assert.equal(result.status,0,result.stderr);
  const original=fs.readFileSync(plans,'utf8');result=run('named-plans-cli.mjs','inspect',plans);assert.equal(result.status,0,result.stderr);
  const info=JSON.parse(result.stdout);expectVersion(info.plans.find(p=>p.id==='old'),old1,false);expectVersion(info.plans.find(p=>p.id==='new'),current,true);assert.equal(fs.readFileSync(plans,'utf8'),original);
  write(candidate,next);write(op,{expectedRevision:current.revision,expectedSha256:fingerprint(original)});
  result=run('named-plans-cli.mjs','commit',plans,'new',candidate,op);assert.equal(result.status,0,result.stderr);
  const saved=fs.readFileSync(plans,'utf8'),bundle=JSON.parse(saved);assert.deepEqual(bundle.plans[0].package,old1);assert.deepEqual(bundle.plans[1].package,next);assert.deepEqual(fs.readFileSync(legacy),sourceBefore);
  write(candidate,old1);write(op,{expectedRevision:old1.revision,expectedSha256:fingerprint(saved)});
  result=run('named-plans-cli.mjs','commit',plans,'old',candidate,op);assert.equal(result.status,2,result.stderr);assert.match(message(result),/old/);assert.match(message(result),/0\.1/);assert.match(message(result),/0\.4/);assert.equal(fs.readFileSync(plans,'utf8'),saved);
  assert.equal(run('named-plans-cli.mjs','commit',plans,'missing',candidate,op).status,2);assert.equal(fs.readFileSync(plans,'utf8'),saved);
  const future=JSON.parse(saved);future.plans[0].package.formatVersion='0.5';write(plans,future);const futureBytes=fs.readFileSync(plans);
  result=run('named-plans-cli.mjs','inspect',plans);assert.equal(result.status,2,result.stderr);assert.match(message(result),/old/);assert.match(message(result),/0\.5/);assert.deepEqual(fs.readFileSync(plans),futureBytes);
  future.formatVersion='2.0';write(plans,future);result=run('named-plans-cli.mjs','inspect',plans);assert.equal(result.status,2,result.stderr);assert.match(message(result),/2\.0/);assert.match(message(result),/1\.0/);
  future.formatVersion=2;write(plans,future);result=run('named-plans-cli.mjs','inspect',plans);assert.equal(result.status,2,result.stderr);assert.match(message(result),/formatVersion=2/);assert.match(message(result),/1\.0/);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
