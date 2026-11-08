import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import {run as author} from './author-cli.mjs';
import {run as named} from './named-plans-cli.mjs';
import {validate,inventory} from './core.mjs';
import {requireEditablePackage,guardAuthoring} from './authoring.mjs';
import {upgradeRoles} from './roles.mjs';
import {upgradeExceptions,readLegacyPackage} from './legacy-json.mjs';

const fixture=p=>JSON.parse(fs.readFileSync(new URL('../../'+p,import.meta.url)));
const old1=fixture('work/plugin-json/issue-273/snapshots/01-direct-bd.json');
const old2=fixture('work/json-state/issue-275/purchase.json');
const checked=fixture('work/plugin-json/issue-273/snapshots/04-final-after-replay.json');
const native=fixture('work/viewer-json/issue-274/json-native/independent.json');
const revisions=p=>Object.fromEntries(p.documents.map(d=>[d.id,{expected:d.revision,next:d.revision+'-converted'}]));
const old3=upgradeRoles(old2,{expectedRevision:old2.revision,revision:'roles-package',documentRevisions:revisions(old2)});
const sha=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const write=(f,v)=>fs.writeFileSync(f,JSON.stringify(v));
const read=f=>JSON.parse(fs.readFileSync(f));
const mode=f=>fs.statSync(f).mode&0o7777;
// Exercise the actual public CLI entry points without a child-process dependency.
async function invoke(run,...args){
 const logs=[],errors=[],log=console.log,error=console.error;
 console.log=value=>logs.push(value);console.error=value=>errors.push(value);
 try{const status=await run(args);return {status,info:logs.length?JSON.parse(logs.at(-1)):null,error:errors.join('\n')};}
 finally{console.log=log;console.error=error;}
}
async function workspace(pkg,fn){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'alder-explicit-'));
 const source=path.join(dir,'source.json'),candidate=path.join(dir,'candidate.json'),request=path.join(dir,'request.json'),op=path.join(dir,'op.json');
 write(source,pkg);fs.chmodSync(source,0o644);
 const before=fs.readFileSync(source),originalSha=sha(source);
 const req={expectedSha256:originalSha,expectedRevision:pkg.revision,revision:pkg.revision+'-converted',documentRevisions:revisions(pkg)};write(request,req);
 const clean=()=>assert.deepEqual(fs.readdirSync(dir).filter(f=>f.startsWith('.alder-')||f.endsWith('.alder-lock')),[]);
 try{await fn({dir,source,candidate,request,op,before,originalSha,req,clean});}
 finally{fs.rmSync(dir,{recursive:true,force:true});}
}

for(const pkg of [old1,old2,old3])test('VERSION-POLICY-007: single '+pkg.formatVersion+' → 0.4, source hash/mode and identities preserved',()=>workspace(pkg,async c=>{
 const r=await invoke(author,'prepare-version-upgrade',c.source,c.candidate,c.request);assert.equal(r.status,0,r.error);
 const next=read(c.candidate);validate(next);assert.equal(requireEditablePackage(next).editable,true);
 assert.deepEqual(fs.readFileSync(c.source),c.before);assert.equal(sha(c.source),c.originalSha);assert.equal(mode(c.source),0o644);
 assert.equal(r.info.sourceSha256,c.originalSha);assert.equal(r.info.sourceAfterSha256,c.originalSha);assert.equal(r.info.editable,true);
 assert.deepEqual(next.sources,pkg.sources);assert.deepEqual(next.externalDocuments,pkg.externalDocuments);
 const fresh=inventory(next);for(const [id,e] of inventory(pkg).map){assert.ok(fresh.map.has(id));assert.equal(fresh.map.get(id).sourceId,e.sourceId);}
 for(const d of next.documents){assert.notEqual(d.revision,pkg.documents.find(p=>p.id===d.id).revision);assert.ok(r.info.documents.find(p=>p.id===d.id).changed);if(d.basedOn)assert.equal(d.basedOn.verification,'unverified');}
 if(pkg.formatVersion!=='0.3'){assert.deepEqual(next.documents[0].roles,[]);assert.ok(next.documents[0].activities.every(a=>a.roleId===null));}
 else {assert.deepEqual(next.documents[0].roles,pkg.documents[0].roles);assert.deepEqual(next.documents[0].activities.map(a=>a.roleId),pkg.documents[0].activities.map(a=>a.roleId));}
 write(c.op,{expectedRevision:pkg.revision,expectedSha256:c.originalSha,migration:'exceptions-0.4'});
 const saved=await invoke(author,'commit',c.source,c.candidate,c.op);assert.equal(saved.status,0,saved.error);assert.deepEqual(read(c.source),next);assert.equal(mode(c.source),0o644);c.clean();
}));

for(const pkg of [old1,old2,old3])test('VERSION-POLICY-008: named '+pkg.formatVersion+' converts exactly one selected plan',()=>workspace(pkg,async c=>{
 const bundle={format:'alder-named-plans',formatVersion:'1.0',plans:[{id:'selected',name:'選択案',package:pkg},{id:'untouched',name:'現行案',package:native},{id:'legacy',name:'旧案',package:old1}]};
 write(c.source,bundle);const before=fs.readFileSync(c.source),hash=sha(c.source);write(c.request,{...c.req,expectedSha256:hash});
 const r=await invoke(named,'prepare-version-upgrade',c.source,'selected',c.candidate,c.request);assert.equal(r.status,0,r.error);
 const next=read(c.candidate);assert.deepEqual(next.plans.slice(1),bundle.plans.slice(1));assert.deepEqual(fs.readFileSync(c.source),before);assert.equal(sha(c.source),hash);assert.equal(mode(c.source),0o644);
 validate(next.plans[0].package);const extracted=path.join(c.dir,'selected.json');assert.equal((await invoke(named,'extract',c.candidate,'selected',extracted)).status,0);
 write(c.op,{expectedRevision:pkg.revision,expectedSha256:hash,migration:'exceptions-0.4'});
 const committed=await invoke(named,'commit',c.source,'selected',extracted,c.op);assert.equal(committed.status,0,committed.error);assert.deepEqual(read(c.source),next);assert.equal(mode(c.source),0o644);c.clean();
}));

test('VERSION-POLICY-009: unknown/future/mixed/malformed inputs stop with a target and reason',async()=>{
 for(const bad of [{...old1,formatVersion:'0.5'},{...old1,format:'unknown'},{...old1,formatVersion:null},{...old1,documents:native.documents},native])await workspace(bad,async c=>{
  const r=await invoke(author,'prepare-version-upgrade',c.source,c.candidate,c.request);assert.equal(r.status,2);assert.ok(r.error.includes(c.source));assert.match(r.error,/0\.4|0\.5|schema variant|unsupported/);assert.deepEqual(fs.readFileSync(c.source),c.before);assert.equal(fs.existsSync(c.candidate),false);c.clean();
 });
 await workspace(old1,async c=>{fs.writeFileSync(c.source,'{"format":');write(c.request,{...c.req,expectedSha256:sha(c.source)});const r=await invoke(author,'prepare-version-upgrade',c.source,c.candidate,c.request);assert.equal(r.status,2);assert.match(r.error,/Truncated|JSON/);assert.equal(fs.existsSync(c.candidate),false);c.clean();});
});

test('VERSION-POLICY-010: unresolved Role/Who and exception references remain explicit',()=>workspace(old2,async c=>{
 const pkg=structuredClone(old2),t=pkg.documents[1].transitions.find(t=>t.path==='exception');t.exception=null;write(c.source,pkg);write(c.request,{...c.req,expectedSha256:sha(c.source)});
 const r=await invoke(author,'prepare-version-upgrade',c.source,c.candidate,c.request);assert.equal(r.status,0,r.error);
 const next=read(c.candidate);assert.equal(next.documents[1].transitions.find(n=>n.id===t.id).exceptionId,null);assert.ok(next.diagnostics.includes('例外参照未決: '+t.id));
 assert.ok(r.info.unresolved.some(u=>u.id===t.id));assert.ok(r.info.unresolved.some(u=>u.kind==='Role / Who'));assert.deepEqual(next.documents[0].activities.map(a=>a.who),pkg.documents[0].activities.map(a=>a.who));c.clean();
}));

test('VERSION-POLICY-011: unknown/ambiguous exceptions cannot be guessed',async()=>{
 for(const ambiguous of [false,true])await workspace(old2,async c=>{
  const pkg=structuredClone(old2),t=pkg.documents[1].transitions.find(t=>t.exception);
  if(ambiguous)pkg.documents[0].activities.find(a=>a.id===t.activityId).exception+='\n- **'+t.exception+'** — 重複';else t.exception='存在しない';
  write(c.source,pkg);const before=fs.readFileSync(c.source);write(c.request,{...c.req,expectedSha256:sha(c.source)});
  const r=await invoke(author,'prepare-version-upgrade',c.source,c.candidate,c.request);assert.equal(r.status,2);assert.match(r.error,/Unknown or ambiguous|Duplicate/);assert.ok(r.error.includes(c.source));assert.deepEqual(fs.readFileSync(c.source),before);assert.equal(fs.existsSync(c.candidate),false);c.clean();
 });
});

test('VERSION-POLICY-012: Check states/evidence preserved, exact human BD confirmation still required',()=>workspace(checked,async c=>{
 let r=await invoke(author,'prepare-version-upgrade',c.source,c.candidate,c.request);assert.equal(r.status,0,r.error);
 const next=read(c.candidate),check=p=>p.documents.find(d=>d.kind==='checkItems'),bd=next.documents.find(d=>d.kind==='businessDesign');
 assert.deepEqual(check(next).items,check(checked).items);assert.equal(check(next).basedOn.verification,'unverified');assert.deepEqual(r.info.documents.find(d=>d.kind==='checkItems').reviews.map(i=>i.reviewState),check(checked).items.map(i=>i.reviewState));
 const op={expectedSha256:c.originalSha,expectedRevision:checked.revision,migration:'exceptions-0.4'};
 for(const bdConfirmations of [undefined,[{documentId:bd.id,revision:'wrong',evidence:{source:'synthetic',quote:'模擬確認'}}]]){
  write(c.op,{...op,bdConfirmations});r=await invoke(author,'commit',c.source,c.candidate,c.op);assert.equal(r.status,2);assert.match(r.error,/Human Business Design confirmation/);assert.deepEqual(fs.readFileSync(c.source),c.before);assert.equal(mode(c.source),0o644);c.clean();
 }
 write(c.op,{...op,bdConfirmations:[{documentId:bd.id,revision:bd.revision,evidence:{source:'synthetic fixture only',quote:'この固定版の業務内容を確認する模擬イベント'}}]});
 r=await invoke(author,'commit',c.source,c.candidate,c.op);assert.equal(r.status,0,r.error);assert.equal(mode(c.source),0o644);assert.deepEqual(check(read(c.source)).items,check(checked).items);c.clean();
}));

test('VERSION-POLICY-013: request revisions/hash and distinct new output are mandatory',async()=>{
 for(const change of [r=>r.expectedSha256='wrong',r=>r.expectedRevision='wrong',r=>r.revision=r.expectedRevision,r=>r.documentRevisions={},r=>r.documentRevisions.extra={expected:'x',next:'y'},r=>delete r.documentRevisions])await workspace(old2,async c=>{
  change(c.req);write(c.request,c.req);const r=await invoke(author,'prepare-version-upgrade',c.source,c.candidate,c.request);assert.equal(r.status,2);assert.equal(fs.existsSync(c.candidate),false);assert.deepEqual(fs.readFileSync(c.source),c.before);assert.equal(mode(c.source),0o644);c.clean();
 });
 await workspace(old1,async c=>{
  for(const output of [c.source,c.candidate]){if(output===c.candidate)fs.writeFileSync(output,'existing output');const r=await invoke(author,'prepare-version-upgrade',c.source,output,c.request);assert.equal(r.status,2);assert.deepEqual(fs.readFileSync(c.source),c.before);if(output===c.candidate)assert.equal(fs.readFileSync(output,'utf8'),'existing output');c.clean();}
  for(const link of ['symlinkSync','linkSync']){const output=path.join(c.dir,link);fs[link](c.source,output);assert.equal((await invoke(author,'prepare-version-upgrade',c.source,output,c.request)).status,2);assert.deepEqual(fs.readFileSync(c.source),c.before);c.clean();}
 });
});

test('VERSION-POLICY-013: unchanged Check revision, external source and references survive conversion',async()=>{
 const pkg=structuredClone(checked),bd=pkg.documents.find(d=>d.kind==='businessDesign');
 pkg.documents=pkg.documents.filter(d=>d.kind!=='businessDesign');
 pkg.externalDocuments.push({id:bd.id,kind:bd.kind,revision:bd.revision,activities:bd.activities.map(({id,name})=>({id,name}))});
 pkg.sources.push({documentId:bd.id,revision:bd.revision,sha256:'0'.repeat(64),uri:''});validate(pkg);
 await workspace(pkg,async c=>{
  write(c.request,{...c.req,documentRevisions:{}});
  const r=await invoke(author,'prepare-version-upgrade',c.source,c.candidate,c.request);assert.equal(r.status,0,r.error);
  const next=read(c.candidate);assert.deepEqual(next.documents,pkg.documents);assert.deepEqual(next.sources,pkg.sources);assert.deepEqual(next.externalDocuments,pkg.externalDocuments);
  assert.equal(r.info.documents[0].changed,false);assert.equal(r.info.documents[0].revision.before,r.info.documents[0].revision.after);assert.deepEqual(r.info.documents[0].changes,[]);
  write(c.op,{expectedRevision:pkg.revision,expectedSha256:c.originalSha,migration:'exceptions-0.4'});
  const committed=await invoke(author,'commit',c.source,c.candidate,c.op);assert.equal(committed.status,0,committed.error);assert.equal(mode(c.source),0o644);c.clean();
 });
});

test('VERSION-POLICY-014: conversion save failures and source races clean staged files',async()=>{
 for(const method of ['writeFileSync','fsyncSync','linkSync'])await workspace(old1,async c=>{
  const original=fs[method];fs[method]=()=>{throw Error('synthetic '+method+' failure');};
  let r;try{r=await invoke(author,'prepare-version-upgrade',c.source,c.candidate,c.request);}finally{fs[method]=original;}
  assert.equal(r.status,2);assert.match(r.error,/synthetic/);assert.deepEqual(fs.readFileSync(c.source),c.before);assert.equal(mode(c.source),0o644);assert.equal(fs.existsSync(c.candidate),false);c.clean();
 });
 await workspace(old1,async c=>{
  const sync=fs.fsyncSync;fs.fsyncSync=fd=>{sync(fd);fs.appendFileSync(c.source,' ');};
  let r;try{r=await invoke(author,'prepare-version-upgrade',c.source,c.candidate,c.request);}finally{fs.fsyncSync=sync;}
  assert.equal(r.status,2);assert.match(r.error,/Source changed/);assert.equal(fs.existsSync(c.candidate),false);assert.equal(fs.readFileSync(c.source,'utf8'),c.before.toString()+' ');assert.equal(mode(c.source),0o644);c.clean();
 });
});

test('VERSION-POLICY-015: migration commit conflicts, lock and save failures preserve bytes/mode',async()=>{
 for(const bundle of [false,true])for(const failure of ['hash','revision','lock','fsyncSync','chmodSync','renameSync','race'])await workspace(old1,async c=>{
  const next=upgradeExceptions(old1,c.req);write(c.candidate,next);
  if(bundle)write(c.source,{format:'alder-named-plans',formatVersion:'1.0',plans:[{id:'selected',name:'選択案',package:old1},{id:'other',name:'別案',package:native}]});
  const before=fs.readFileSync(c.source),op={expectedSha256:sha(c.source),expectedRevision:old1.revision,migration:'exceptions-0.4'};
  if(failure==='hash')op.expectedSha256='wrong';if(failure==='revision')op.expectedRevision='wrong';write(c.op,op);
  if(failure==='lock')fs.writeFileSync(c.source+'.alder-lock','foreign');
  const method=failure==='race'?'fsyncSync':failure,original=fs[method];
  if(['fsyncSync','chmodSync','renameSync'].includes(method))fs[method]=failure==='race'?fd=>{original(fd);fs.appendFileSync(c.source,' ');}:()=>{throw Error('synthetic '+method+' failure');};
  let r;try{r=await invoke(bundle?named:author,'commit',c.source,...(bundle?['selected']:[]),c.candidate,c.op);}finally{if(original)fs[method]=original;}
  assert.equal(r.status,2);assert.deepEqual(fs.readFileSync(c.source),failure==='race'?Buffer.concat([before,Buffer.from(' ')]):before);assert.equal(mode(c.source),0o644);
  if(failure==='lock'){assert.equal(fs.readFileSync(c.source+'.alder-lock','utf8'),'foreign');fs.unlinkSync(c.source+'.alder-lock');}c.clean();
 });
});

test('VERSION-POLICY-016: explicit migration cannot smuggle business changes or review approval',()=>workspace(old1,async c=>{
 assert.equal((await invoke(author,'prepare-version-upgrade',c.source,c.candidate,c.request)).status,0);
 const next=read(c.candidate),withRoles=upgradeExceptions(upgradeRoles(old1,{...c.req,revision:'intermediate'}),{expectedRevision:'intermediate',revision:'final',documentRevisions:Object.fromEntries(old1.documents.map(d=>[d.id,{expected:c.req.documentRevisions[d.id].next,next:'final-bd'}]))});
 write(c.op,{expectedRevision:old1.revision,expectedSha256:c.originalSha,migration:'exceptions-0.4'});
 for(const candidate of [withRoles,{...next,diagnostics:[]},(()=>{const q=structuredClone(next);q.documents[0].activities[0].who='推定した担当者';return q;})()]){
  write(c.candidate,candidate);const r=await invoke(author,'commit',c.source,c.candidate,c.op);assert.equal(r.status,2);assert.deepEqual(fs.readFileSync(c.source),c.before);c.clean();
 }
 write(c.candidate,next);write(c.op,{expectedRevision:old1.revision,expectedSha256:c.originalSha});const r=await invoke(author,'commit',c.source,c.candidate,c.op);assert.equal(r.status,2);assert.match(r.error,/explicit/);c.clean();
}));

test('VERSION-POLICY-017: named conversion rejects ambiguous/missing targets and invalid versions',async()=>{
 for(const [id,change] of [['missing',b=>{}],['selected',b=>b.plans.push(structuredClone(b.plans[0]))],['selected',b=>b.plans[1].package.formatVersion='0.5'],['selected',b=>b.formatVersion='2.0']])await workspace(old1,async c=>{
  const bundle={format:'alder-named-plans',formatVersion:'1.0',plans:[{id:'selected',name:'選択案',package:old1},{id:'other',name:'別案',package:structuredClone(old2)}]};change(bundle);write(c.source,bundle);const before=fs.readFileSync(c.source);write(c.request,{...c.req,expectedSha256:sha(c.source)});
  const r=await invoke(named,'prepare-version-upgrade',c.source,id,c.candidate,c.request);assert.equal(r.status,2,r.error);assert.ok(r.error.includes(c.source));assert.deepEqual(fs.readFileSync(c.source),before);assert.equal(fs.existsSync(c.candidate),false);c.clean();
 });
});

test('VERSION-POLICY-018: untouched Concept documents keep revision in ordinary guards',()=>{
 // Legacy 0.1–0.3 schemas do not admit Concept documents: never infer a mixed contract.
 const pkg=fixture('work/concept-review/issue-133/versions/purchase-v3-beta.json'),next=structuredClone(pkg);next.revision+='-next';next.diagnostics.push('synthetic package-only edit');
 guardAuthoring(pkg,next,{expectedRevision:pkg.revision});for(const d of pkg.documents)assert.equal(next.documents.find(n=>n.id===d.id).revision,d.revision);
 for(const version of ['0.1','0.2','0.3'])assert.throws(()=>readLegacyPackage({...pkg,formatVersion:version}),/schema variant/);
});

test('VERSION-POLICY-019: native create/commit and migration preserve all AUTHOR-MODE permissions',async()=>{
 for(const permissions of [0o600,0o640,0o644,0o660])for(const bundle of [false,true])await workspace(old1,async c=>{
  const next=upgradeExceptions(old1,c.req);write(c.candidate,next);
  if(bundle)write(c.source,{format:'alder-named-plans',formatVersion:'1.0',plans:[{id:'selected',name:'選択案',package:old1}]});
  fs.chmodSync(c.source,permissions);write(c.op,{expectedRevision:old1.revision,expectedSha256:sha(c.source),migration:'exceptions-0.4'});
  const r=await invoke(bundle?named:author,'commit',c.source,...(bundle?['selected']:[]),c.candidate,c.op);assert.equal(r.status,0,r.error);assert.equal(mode(c.source),permissions);c.clean();
 });
 await workspace(native,async c=>{
  write(c.candidate,native);write(c.op,{});const target=path.join(c.dir,'created.json');assert.equal((await invoke(author,'create',c.candidate,target,c.op)).status,0);
  const info=await invoke(author,'inspect',target);assert.equal(info.status,0);assert.equal(info.info.compatibility.editable,true);
  const next=structuredClone(native);next.revision+='-next';next.diagnostics.push('synthetic package-only change');write(c.candidate,next);write(c.op,{expectedSha256:sha(target),expectedRevision:native.revision});
  const r=await invoke(author,'commit',target,c.candidate,c.op);assert.equal(r.status,0,r.error);assert.deepEqual(read(target),next);c.clean();
 });
});
