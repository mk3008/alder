// Exercise the actual npm-test Node flags with independent controlled files.
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdtempSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir,availableParallelism,totalmem} from 'node:os';
import {join} from 'node:path';
const script=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8')).scripts.test;
const command=script.split(' && ').find(c=>c.split(' ').includes('--test'));
assert.ok(command,'npm test must invoke the Node test runner');
const args=command.split(' '),firstFile=args.findIndex(s=>s.startsWith('web/'));
assert.ok(firstFile>0);const flags=args.slice(1,firstFile);
assert.ok(flags.includes('--test-concurrency=2'));assert.ok(flags.includes('--test-isolation=process'));
assert.ok(!flags.some(s=>/force-exit|test-(?:name|skip)-pattern|test-only/.test(s)),'do not hide work or asynchronous failures');
const dir=mkdtempSync(join(tmpdir(),'viewer-node-runner-')),events=join(dir,'events.jsonl');
const invoke=files=>spawnSync(process.execPath,[...flags,...files],{encoding:'utf8',timeout:15000,env:{...process.env,NODE_OPTIONS:'',NODE_RUNNER_EVENTS:events}});
const source=index=>`import assert from 'node:assert/strict';
import {appendFileSync,readFileSync} from 'node:fs';
assert.equal(globalThis.__viewerRunnerIsolation,undefined);globalThis.__viewerRunnerIsolation=true;
const file=process.env.NODE_RUNNER_EVENTS,id=${index};
const log=kind=>appendFileSync(file,JSON.stringify({id,kind,pid:process.pid})+'\\n');
log('start');try{if(id<2){const deadline=Date.now()+5000;while(readFileSync(file,'utf8').trim().split('\\n').map(JSON.parse).filter(e=>e.kind==='start').length<2){assert.ok(Date.now()<deadline,'two workers must start');await new Promise(r=>setTimeout(r,5));}}}finally{log('end');}
`;
try{
 const files=[0,1,2].map(i=>{const file=join(dir,`case-${i}.mjs`);writeFileSync(file,source(i));return file;});
 writeFileSync(events,'');const success=invoke(files);assert.equal(success.status,0,success.stdout+success.stderr);
 const observed=readFileSync(events,'utf8').trim().split('\n').map(JSON.parse);let active=0,max=0;
 for(const e of observed){active+=e.kind==='start'?1:-1;max=Math.max(max,active);assert.ok(active>=0&&active<=2);}
 assert.equal(active,0);assert.equal(max,2);assert.equal(new Set(observed.map(e=>e.pid)).size,3,'each file has its own process');
 writeFileSync(events,'');writeFileSync(files[1],source(1)+"assert.fail('controlled assertion failure');\n");
 const failed=invoke(files);assert.equal(failed.signal,null);assert.notEqual(failed.status,0);assert.ok(readFileSync(events,'utf8').includes('"id":2,"kind":"end"'),'later independent file must finish after failure');
 const signalled=join(dir,'signal.mjs');writeFileSync(signalled,"process.kill(process.pid,'SIGTERM');\n");
 const signal=invoke([signalled]);assert.equal(signal.signal,null);assert.notEqual(signal.status,0,'a signalled test child cannot pass');
 const late=join(dir,'late.mjs');writeFileSync(late,"setTimeout(()=>{throw Error('controlled late async failure');},20);\n");
 const asynchronous=invoke([late]);assert.equal(asynchronous.signal,null);assert.notEqual(asynchronous.status,0,'late async failure cannot be hidden');
 const missing=invoke([join(dir,'missing.mjs')]);assert.notEqual(missing.status,0,'missing test files cannot pass');
 console.log(JSON.stringify({nodeExecution:{separateProcesses:true,maxActiveFiles:max,assertionFailure:'nonzero',signalFailure:'nonzero',independentContinuation:true,node:process.version,availableParallelism:availableParallelism(),totalMemoryBytes:totalmem()}}));
}finally{rmSync(dir,{recursive:true,force:true});}
