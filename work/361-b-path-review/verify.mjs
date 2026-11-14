// Read-only reproduction of the frozen-byte and case-completeness checks.
// This gate is review evidence, not a new product requirement or semantic oracle.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {execFileSync,spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const browserPath=process.argv[2],browserIdentityPath=process.argv[3];
const root=fileURLToPath(new URL('../../',import.meta.url));
const git=(...args)=>execFileSync('git',['-C',root,...args],{maxBuffer:30*1024*1024});
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const path='work/361-b-path-review/frozen.json',preparation='e5de0729';
const frozenBytes=git('show',preparation+':'+path);
assert.deepEqual(readFileSync(root+path),frozenBytes,'pre-B inventory immutable');
const frozen=JSON.parse(frozenBytes);
const expected=frozen.authorities.flatMap(a=>a.checks.flatMap(c=>c.cases.map(name=>({path:a.path,id:c.id,case:name}))));
const priorTests=git('ls-tree','-r','--name-only',frozen.start,'--','web-viewer/web').toString().trim().split('\n').filter(p=>/\.(mjs|json)$/.test(p));
const paths=[...new Set([...Object.keys(frozen.protected),...frozen.authorities.map(a=>a.path),...priorTests])];
// Read the pinned blobs in one Git process, preserving exact bytes.
const batch=execFileSync('git',['-C',root,'cat-file','--batch'],{input:paths.map(p=>frozen.start+':'+p+'\n').join(''),maxBuffer:80*1024*1024});
let offset=0;const fixedFiles=new Map();
for(const p of paths){
 const end=batch.indexOf(10,offset),header=batch.subarray(offset,end).toString().split(' ');
 assert.equal(header[1],'blob',p+' fixed object exists');const size=Number(header[2]);assert(Number.isSafeInteger(size)&&size>=0);
 offset=end+1;fixedFiles.set(p,batch.subarray(offset,offset+size));offset+=size;assert.equal(batch[offset++],10);
}
assert.equal(offset,batch.length);
const key=r=>JSON.stringify([r.path,r.id,r.case]);
const byteGate=(bytes,fixed,label)=>assert.deepEqual(bytes,fixed,label+' bytes immutable');
const resultGate=results=>{
 assert.deepEqual(results.map(key).sort(),expected.map(key).sort(),'all frozen IDs/cases require exactly one result');
 assert.equal(new Set(results.map(key)).size,expected.length,'unique results');
 assert(results.every(r=>['node-pass','browser-pass','pending-browser'].includes(r.status)&&r.evidence?.length),'failure/missing evidence is not pass');
};
for(const [p,digest] of Object.entries(frozen.protected)){
 const fixed=fixedFiles.get(p);assert.equal(hash(fixed),digest,p+' baseline hash');
 byteGate(readFileSync(root+p),fixed,p);
}
for(const authority of frozen.authorities){
 const fixed=fixedFiles.get(authority.path),document=JSON.parse(fixed);
 assert.equal(hash(fixed),authority.sha256);
 assert.deepEqual(authority.checks.map(c=>[c.id,c.cases]),document.checks.map(c=>[c.id,c.cases??['declared-guarantee']]),'complete baseline inventory');
 byteGate(readFileSync(root+authority.path),fixed,authority.path);
 const fewerIds=structuredClone(document);fewerIds.checks.pop();assert.throws(()=>byteGate(Buffer.from(JSON.stringify(fewerIds)),fixed,'negative deleted ID'));
 const inventoryGate=actual=>assert.deepEqual(actual.checks.map(c=>[c.id,c.cases]),authority.checks.map(c=>[c.id,c.cases]),'fixed IDs and applicable cases');
 const fewerCases=structuredClone(authority);fewerCases.checks[0].cases.pop();assert.throws(()=>inventoryGate(fewerCases),'negative deleted case rejected by inventory gate');
 if(document.checks.some(c=>c.cases?.length)){
  const dropped=structuredClone(document);dropped.checks.find(c=>c.cases?.length).cases.pop();assert.throws(()=>byteGate(Buffer.from(JSON.stringify(dropped)),fixed,'negative deleted authority case'));
 }
}
// Every pre-existing test remains byte-identical, rather than attempting to
// infer assert preservation from test counts alone.
for(const p of priorTests)byteGate(readFileSync(root+p),fixedFiles.get(p),p);
const executions=[];
for(const file of [...new Set(frozen.authorities.map(a=>a.verification))]){
 const result=spawnSync(process.execPath,['--experimental-strip-types',file],{cwd:root+'web-viewer',encoding:'utf8',timeout:120000});
 assert.equal(result.status,0,`${file}: ${result.error??''}\n${result.stdout}\n${result.stderr}`);
 executions.push({file,status:'node-pass',stdoutSha256:hash(result.stdout),stdout:result.stdout.trim()});
}
let browser;
if(browserPath){
 const bytes=readFileSync(browserPath);browser=JSON.parse(bytes);
 assert(browserIdentityPath,'browser evidence requires source/build binding');
 const identity=JSON.parse(readFileSync(browserIdentityPath));
 assert.equal(hash(bytes),identity.resultsSha256,'bound browser observations');
 assert.equal(git('diff',identity.productRevision,'--','web-viewer/src','web-viewer/package.json','web-viewer/package-lock.json').length,0,'current product source matches tested revision');
 for(const [p,digest] of Object.entries(identity.servedBuildSha256))assert.equal(hash(readFileSync(root+'web-viewer/dist/'+p)),digest,p+' served build unchanged');
 assert(Object.keys(identity.servedBuildSha256).some(p=>p.endsWith('.js')),'actual built JS is bound');
 assert.equal(browser.published,false,'this run does not modify or replace the public Preview');
 assert.deepEqual(browser.results.map(r=>r.width).sort((a,b)=>a-b),[393,1280]);
 for(const r of browser.results){
  assert.equal(r.sidebar,280);assert.equal(r.summaryFits,true);assert.equal(r.zeroResults,true);assert.equal(r.nativeKeyboard,true);assert.equal(r.samples,true);
  assert.equal(r.activityNames,'業務 / 業務（Activity）');assert.deepEqual(r.pageErrors,[]);
  assert(r.treeOverflow.scroll<=r.treeOverflow.client);assert.deepEqual(r.treeOverflow.labels,[]);
 }
}
const results=expected.map(r=>{
 const betaBrowser=/^BETA-00[1-5]$/.test(r.id);
 return {...r,status:betaBrowser?(browser?'browser-pass':'pending-browser'):'node-pass',evidence:[frozen.authorities.find(a=>a.path===r.path).verification,...(betaBrowser&&browser?['web/test-structure-beta-browser.mjs',browserPath]:[])]};
});
resultGate(results);
assert.throws(()=>resultGate(results.slice(1)),'negative missing result');
assert.throws(()=>resultGate([...results,results[0]]),'negative duplicate result');
assert.throws(()=>resultGate(results.filter(r=>r.id!==expected[0].id)),'negative missing guarantee results');
assert.throws(()=>resultGate(results.map((r,i)=>i?r:{...r,status:'fail'})),'negative failed result');
const explicit=expected.find(r=>r.case!=='declared-guarantee');
assert.throws(()=>resultGate(results.filter(r=>key(r)!==key(explicit))),'negative missing explicit case result');
// Reacquire at the end of this separate read-only process.
for(const [p,digest] of Object.entries(frozen.protected))assert.equal(hash(readFileSync(root+p)),digest,p+' final bytes');
console.log(JSON.stringify({start:frozen.start,preparation:git('rev-parse',preparation).toString().trim(),candidate:git('rev-parse','HEAD').toString().trim(),gateSha256:hash(readFileSync(fileURLToPath(import.meta.url))),productSha256:hash(readFileSync(root+'web-viewer/src/structure-explorer.ts')),workingTree:git('status','--short').toString().trim(),authorityInventorySha256:hash(frozenBytes),protectedFiles:Object.keys(frozen.protected).length,unchangedExistingTests:priorTests.length,guarantees:frozen.authorities.reduce((n,a)=>n+a.checks.length,0),cases:expected.length,negativeExamples:['deleted-ID','deleted-case','missing-result','duplicate-result','missing-ID-results','missing-explicit-case-result'],results,executions,browser,scope:'Frozen-byte and inventory-completeness gates; file-level Node evidence is not per-case execution proof. BETA-001..005 remain pending without actual browser observations. Per-ID semantic correspondence is reviewed separately. Full CI remains required.'},null,2));
