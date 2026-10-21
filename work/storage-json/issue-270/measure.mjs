import fs from 'node:fs';
import os from 'node:os';
import crypto from 'node:crypto';
import {performance} from 'node:perf_hooks';
import {Worker} from 'node:worker_threads';
import {fileURLToPath} from 'node:url';
import {parseStrict,validate,inventory,graphV1,stringify} from './core.mjs';
import {markdown} from './export-md.mjs';
import {parseDesign,validateGraph} from '../../../web-viewer/src/graph.ts';
const dir=fileURLToPath(new URL('./',import.meta.url));
function measure(fn){for(let n=0;n<2;n++)fn();const samples=[];for(let n=0;n<5;n++){const start=performance.now();fn();samples.push(performance.now()-start);}const sorted=[...samples].sort((a,b)=>a-b);return {medianMs:sorted[2],minMs:sorted[0],maxMs:sorted.at(-1),samplesMs:samples};}
const rows=[];
for(const count of [5,100,1000]){
 const path=dir+`.generated/activities-${count}.json`,text=fs.readFileSync(path,'utf8'),pkg=parseStrict(text),doc=pkg.documents[0],md=markdown(pkg,doc.id).text;
 validate(pkg);validateGraph(graphV1(pkg,doc.id));
 const row={activities:count,bytes:Buffer.byteLength(text),readDisk:measure(()=>fs.readFileSync(path,'utf8')),syntax:measure(()=>parseStrict(text)),structuralAndReference:measure(()=>validate(pkg)),index:measure(()=>inventory(pkg)),graphProjection:measure(()=>validateGraph(graphV1(pkg,doc.id))),serialization:measure(()=>stringify(pkg)),writeDisk:measure(()=>fs.writeFileSync(dir+'.generated/save.json',text)),legacyParser:measure(()=>parseDesign(md)),processMemorySnapshot:process.memoryUsage()};
 rows.push(row);console.log(JSON.stringify({activities:count,bytes:row.bytes,parseMs:row.syntax.medianMs,validateMs:row.structuralAndReference.medianMs}));
}
async function workerRoundTrip(text,maxNodes=5000,timeout=5000){
 const start=performance.now(),w=new Worker(new URL('./node-worker.mjs',import.meta.url));
 try{return await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Node worker timeout')),timeout);w.on('error',e=>{clearTimeout(timer);reject(e);});w.on('message',m=>{if(m.ready)w.postMessage({token:1,text,maxNodes});else{clearTimeout(timer);resolve({error:m.error??null,metrics:m.metrics??null,roundtripIncludingStartupMs:performance.now()-start});}});});}finally{await w.terminate();}
}
const worker=[];
worker.push({name:'valid-small',...await workerRoundTrip(fs.readFileSync(dir+'fixtures/purchase.json','utf8'))});
worker.push({name:'valid-over-2MiB',...await workerRoundTrip(fs.readFileSync(dir+'.generated/activities-1000.json','utf8'))});
worker.push({name:'element-budget-rejection',...await workerRoundTrip(fs.readFileSync(dir+'fixtures/purchase.json','utf8'),1)});
try{await workerRoundTrip(fs.readFileSync(dir+'fixtures/purchase.json','utf8'),5000,1);throw Error('timeout not observed');}catch(e){if(e.message!=='Node worker timeout')throw e;worker.push({name:'node-thread-termination',error:e.message,note:'1ms Node-only startup deadline, not browser UI timing'});}
const hashes=Object.fromEntries(['schema.mjs','core.mjs','import_fixture.py','build.mjs','app.mjs','worker.mjs','measure.mjs'].map(p=>[p,crypto.createHash('sha256').update(fs.readFileSync(dir+p)).digest('hex')]));
fs.writeFileSync(dir+'results/node-performance.json',JSON.stringify({environment:{node:process.version,v8:process.versions.v8,platform:process.platform,arch:process.arch,cpus:os.cpus().length,timestampUtc:new Date().toISOString(),implementationSha256:hashes},scope:'Node CPU, disk and Node worker threads ONLY. No browser File/render/IndexedDB/download performance measured.',warmups:2,repeats:5,rows,worker},null,2)+'\n');
