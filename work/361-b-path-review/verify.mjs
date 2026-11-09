// Read-only reproduction of the frozen-byte and case-completeness checks.
// This gate is review evidence, not a new product requirement or semantic oracle.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {execFileSync,spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
const git=(...args)=>execFileSync('git',['-C',root,...args],{maxBuffer:30*1024*1024});
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const path='work/361-b-path-review/frozen.json',preparation='e5de0729';
const frozenBytes=git('show',preparation+':'+path);
assert.deepEqual(readFileSync(root+path),frozenBytes,'pre-B inventory immutable');
const frozen=JSON.parse(frozenBytes);
const expected=frozen.authorities.flatMap(a=>a.checks.flatMap(c=>c.cases.map(name=>({path:a.path,id:c.id,case:name}))));
const key=r=>JSON.stringify([r.path,r.id,r.case]);
const byteGate=(bytes,fixed,label)=>assert.deepEqual(bytes,fixed,label+' bytes immutable');
const resultGate=results=>{
 assert.deepEqual(results.map(key).sort(),expected.map(key).sort(),'all frozen IDs/cases require exactly one result');
 assert.equal(new Set(results.map(key)).size,expected.length,'unique results');
 assert(results.every(r=>r.status==='node-pass'&&r.evidence?.length),'failure/missing evidence is not pass');
};
for(const [p,digest] of Object.entries(frozen.protected)){
 const fixed=git('show',frozen.start+':'+p);assert.equal(hash(fixed),digest,p+' baseline hash');
 byteGate(readFileSync(root+p),fixed,p);
}
for(const authority of frozen.authorities){
 const fixed=git('show',frozen.start+':'+authority.path),document=JSON.parse(fixed);
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
const priorTests=git('ls-tree','-r','--name-only',frozen.start,'--','web-viewer/web').toString().trim().split('\n').filter(p=>/\.(mjs|json)$/.test(p));
for(const p of priorTests)byteGate(readFileSync(root+p),git('show',frozen.start+':'+p),p);
const executions=[];
for(const file of [...new Set(frozen.authorities.map(a=>a.verification))]){
 const result=spawnSync(process.execPath,['--experimental-strip-types',file],{cwd:root+'web-viewer',encoding:'utf8',timeout:120000});
 assert.equal(result.status,0,`${file}: ${result.error??''}\n${result.stdout}\n${result.stderr}`);
 executions.push({file,status:'node-pass',stdoutSha256:hash(result.stdout),stdout:result.stdout.trim()});
}
const results=expected.map(r=>({...r,status:'node-pass',evidence:[frozen.authorities.find(a=>a.path===r.path).verification]}));
resultGate(results);
assert.throws(()=>resultGate(results.slice(1)),'negative missing result');
assert.throws(()=>resultGate([...results,results[0]]),'negative duplicate result');
assert.throws(()=>resultGate(results.filter(r=>r.id!==expected[0].id)),'negative missing guarantee results');
const explicit=expected.find(r=>r.case!=='declared-guarantee');
assert.throws(()=>resultGate(results.filter(r=>key(r)!==key(explicit))),'negative missing explicit case result');
// Reacquire at the end of this separate read-only process.
for(const [p,digest] of Object.entries(frozen.protected))assert.equal(hash(readFileSync(root+p)),digest,p+' final bytes');
console.log(JSON.stringify({start:frozen.start,preparation:git('rev-parse',preparation).toString().trim(),candidate:git('rev-parse','HEAD').toString().trim(),authorityInventorySha256:hash(frozenBytes),protectedFiles:Object.keys(frozen.protected).length,unchangedExistingTests:priorTests.length,guarantees:frozen.authorities.reduce((n,a)=>n+a.checks.length,0),cases:expected.length,negativeExamples:['deleted-ID','deleted-case','missing-result','duplicate-result','missing-ID-results','missing-explicit-case-result'],results,executions,scope:'Node evidence and byte/completeness gates only. Semantic correspondence is reviewed separately. Actual Chrome/full CI are required for final completion; node-pass does not claim browser validation.'},null,2));
