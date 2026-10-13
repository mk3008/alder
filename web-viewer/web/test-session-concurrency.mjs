// Independent unchanged bundles in JSDOM share fresh fake IndexedDB. This is
// model evidence only; native IndexedDB tests are in the paired browser module.
// --source-root PATH --app-only provides a pre-fix negative control without
// adding the historical success-on-data-loss reproducer to a passing aggregate.
import assert from 'node:assert/strict';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'node:util';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory,IDBObjectStore} from 'fake-indexeddb';
import {concurrencyTriggers,concurrencyBodies,changedMarkdown,unsubmittedMarkdown,emptySession,readConcurrencyRecord,seedLegacyRecord,abortNextGenerationPut} from './test-session-concurrency-browser.mjs';

const {values}=parseArgs({options:{'source-root':{type:'string'},'app-only':{type:'boolean',default:false}}});
const sourceRoot=resolve(values['source-root']??resolve(dirname(fileURLToPath(import.meta.url)),'..'));
const appCode=(await build({absWorkingDir:sourceRoot,entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}})).outputFiles[0].text;
const storageCode=(await build({absWorkingDir:sourceRoot,entryPoints:['src/session.ts'],bundle:true,write:false,format:'iife',globalName:'concurrencySession'})).outputFiles[0].text;
const windows=[],results=[],unhandled=[];
const onRejection=error=>unhandled.push(String(error));process.on('unhandledRejection',onRejection);
const pause=(ms=15)=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(read,predicate,label,{timeout=5000}={}){
 const end=Date.now()+timeout;let latest;
 do{latest=await read();if(predicate(latest))return latest;await pause();}while(Date.now()<end);
 assert.fail(label+'; latest='+JSON.stringify(latest));
}
function realm(indexedDB){
 const w=new JSDOM('<div id="app"></div>',{url:'https://alder-concurrency-isolated.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
 windows.push(w);w.indexedDB=indexedDB;w.IDBObjectStore=IDBObjectStore;w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;
 w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};
 let networkCalls=0;w.fetch=()=>{networkCalls++;throw Error('Network is forbidden in the concurrency regression');};
 w.eval('globalThis.readRecord=('+readConcurrencyRecord.toString()+');');
 return {w,db:indexedDB,$:id=>w.document.getElementById(id),read:async()=>structuredClone(await w.readRecord()),networkCalls:()=>networkCalls};
}
async function boot(indexedDB){
 const e=realm(indexedDB);e.w.eval(appCode);await until(()=>e.$('open-text').disabled,v=>v===false,'app did not finish restoration');return e;
}
function moduleRealm(indexedDB){const e=realm(indexedDB);e.w.eval(storageCode+'\nglobalThis.__concurrencySession=concurrencySession;');e.api=e.w.__concurrencySession;return e;}
const tabs=e=>Array.from(e.w.document.querySelectorAll('.tab'));
const keys=e=>tabs(e).map(tab=>tab.dataset.key);
const coords=e=>Object.fromEntries(Array.from(e.w.document.querySelectorAll('.node'),node=>[node.dataset.node,[parseFloat(node.style.left),parseFloat(node.style.top)]]));
async function input(e,body){e.$('open-text').click();e.$('source-text').value=body;await e.$('source-submit').onclick();assert.equal(e.$('source-dialog').hidden,true,'synthetic document parses');}
function select(e,key){const tab=tabs(e).find(tab=>tab.dataset.key===key);assert.ok(tab);tab.querySelector('button').click();}
function drag(e,id,dx,dy){
 if(e.$('layout-lock').getAttribute('aria-pressed')==='true')e.$('layout-lock').click();
 const node=Array.from(e.w.document.querySelectorAll('.node')).find(node=>node.dataset.node===id);assert.ok(node);
 node.onpointerdown({button:0,clientX:0,clientY:0,pointerId:1,stopPropagation(){}});
 node.onpointermove({clientX:dx,clientY:dy,pointerId:1});node.onpointerup({pointerId:1});
}
function lifecycle(e,event){
 if(event==='hidden'){Object.defineProperty(e.w.document,'hidden',{configurable:true,value:true});e.w.document.dispatchEvent(new e.w.Event('visibilitychange'));}
 else e.w.dispatchEvent(new e.w.Event(event));
}
async function assertConflict(e){
 await until(()=>({hidden:e.$('status').hidden,text:e.$('status-text').textContent}),v=>!v.hidden&&v.text.includes('別の画面'),'stale window must explicitly report a save conflict');
 const text=e.$('status-text').textContent;assert.match(text,/保存していません/);assert.match(text,/コピー/);assert.match(text,/再読み込み/);
 assert.equal(e.$('status-text').getAttribute('role'),'alert');return text;
}
function assertLocalWork(e,expectedKeys){
 assert.deepEqual(keys(e),expectedKeys,'stale local tabs and rejected close target remain');
 assert.equal(e.$('source-dialog').hidden,false,'unsubmitted editor remains open');
 assert.equal(e.$('source-text').value,unsubmittedMarkdown,'unsubmitted input remains exact');
 assert.ok(e.$('detail').textContent.includes('Retain B local submitted edit.'),'submitted local edit remains displayed');
}
async function caseOf(name,test){
 const originalPut=IDBObjectStore.prototype.put;
 try{const detail=await test();results.push({name,passed:true,...detail});}
 catch(error){results.push({name,passed:false,error:error.stack});}
 finally{IDBObjectStore.prototype.put=originalPut;windows.splice(0).forEach(w=>w.close());}
}
if(!values['app-only']){
 await caseOf('atomic compare-and-write: exactly one independent same-generation writer commits',async()=>{
  const db=new IDBFactory(),a=moduleRealm(db),b=moduleRealm(db),envs=[a,b];
  assert.notEqual(a.w,b.w);assert.notEqual(a.api,b.api);
  assert.deepEqual(await Promise.all(envs.map(e=>e.api.loadSession())),[undefined,undefined]);
  assert.deepEqual(await a.read(),{current:undefined,generation:undefined},'load does not create saved keys');
  const proposals=[{...emptySession(),dark:true,width:411},{...emptySession(),dark:false,width:522}];
  const settled=await Promise.allSettled(envs.map((e,i)=>e.api.saveSession(proposals[i])));
  assert.equal(settled.filter(r=>r.status==='fulfilled').length,1);
  const rejected=settled.find(r=>r.status==='rejected');assert.equal(rejected.reason.name,'SessionConflictError');
  const winner=settled.findIndex(r=>r.status==='fulfilled'),loser=1-winner;
  assert.deepEqual(await a.read(),{current:proposals[winner],generation:1});
  const next={...proposals[winner],width:633};await envs[winner].api.saveSession(next);
  for(let retry=0;retry<3;retry++){
   await assert.rejects(()=>envs[loser].api.saveSession(proposals[loser]),{name:'SessionConflictError'});
   assert.deepEqual(await a.read(),{current:next,generation:2});
  }
  const fresh=moduleRealm(db);assert.deepEqual(await fresh.api.loadSession(),next);
  await fresh.api.saveSession({...next,width:744});assert.deepEqual(await a.read(),{current:{...next,width:744},generation:3});
  return {winner,initialGeneration:0,commits:3,staleRetries:3};
 });
 await caseOf('abort after both puts rolls back record and generation; retry remains writable',async()=>{
  const e=moduleRealm(new IDBFactory()),initial=emptySession();await e.api.loadSession();await e.api.saveSession(initial);
  e.w.eval('('+abortNextGenerationPut.toString()+')()');
  await assert.rejects(()=>e.api.saveSession({...initial,width:411}),error=>{
   assert.ok(error!=null,'abort must reject with an error, not null or undefined');
   assert.equal(typeof error.name,'string');assert.ok(error.name);
   assert.equal(typeof error.message,'string');assert.ok(error.message);return true;
  });
  assert.deepEqual(await e.read(),{current:initial,generation:1},'aborted transaction leaves both committed keys unchanged');
  await e.api.saveSession({...initial,width:522});
  assert.deepEqual(await e.read(),{current:{...initial,width:522},generation:2},'only completion advanced expected generation');
 });
 await caseOf('legacy no-generation reads stay unchanged; first normal save creates generation 1',async()=>{
  const db=new IDBFactory(),e=moduleRealm(db),legacy={...emptySession(),scopeOutside:'dim',width:277};
  e.w.__legacy=legacy;await e.w.eval('('+seedLegacyRecord.toString()+')({value:globalThis.__legacy})');
  assert.deepEqual(await e.api.loadSession(),legacy);assert.deepEqual(await e.api.loadSession(),legacy);
  assert.deepEqual(await e.read(),{current:legacy,generation:undefined});
  const b=moduleRealm(db);assert.deepEqual(await b.api.loadSession(),legacy);
  assert.deepEqual(await b.read(),{current:legacy,generation:undefined});
  await e.api.saveSession({...legacy,dark:true});assert.deepEqual(await e.read(),{current:{...legacy,dark:true},generation:1});
  await assert.rejects(()=>b.api.saveSession(legacy),{name:'SessionConflictError'});
 });
}
if(!values['app-only'])await caseOf('same-page queued lifecycle saves use the last committed local generation',async()=>{
 const e=await boot(new IDBFactory());await input(e,concurrencyBodies.shared);
 lifecycle(e,'blur');e.$('theme').click();lifecycle(e,'blur');
 const saved=await until(()=>e.read(),v=>v.generation===2&&v.current.dark===true&&v.current.tabs.length===1,'two queued local saves did not both commit');
 assert.equal(e.$('status').hidden,true,'same-page queue does not create a spurious conflict');
 e.$('theme').click();lifecycle(e,'pagehide');e.$('theme').click();lifecycle(e,'blur');
 const next=await until(()=>e.read(),v=>v.generation===4&&v.current.dark===true,'next queued pair did not both commit');
 assert.equal(next.current.tabs[0].design.markdown,concurrencyBodies.shared);assert.equal(saved.generation,2);
});
for(const trigger of concurrencyTriggers)await caseOf('stale app '+trigger+' preserves winner and local work',async()=>{
 const db=new IDBFactory(),seed=await boot(db);
 await input(seed,concurrencyBodies.shared);const shared=keys(seed)[0];
 await input(seed,concurrencyBodies.closed);const closed=keys(seed).find(key=>key!==shared);
 const initial=await until(()=>seed.read(),v=>v.current?.tabs.length===2,'seed did not commit');seed.w.close();
 const a=await boot(db),b=await boot(db),initialKeys=initial.current.tabs.map(t=>t.key);
 assert.notEqual(a.w,b.w);assert.notEqual(a.w.document,b.w.document);
 assert.deepEqual(keys(a),initialKeys);assert.deepEqual(keys(b),initialKeys);assert.deepEqual(await a.read(),initial,'both windows read the same untouched committed generation');
 select(a,shared);const nodeID='Synthetic shared activity',before=initial.current.tabs.find(t=>t.key===shared).positions[nodeID],moved=[before[0]+70,before[1]+45];
 drag(a,nodeID,70,45);assert.deepEqual(coords(a)[nodeID],moved);
 await input(a,concurrencyBodies.added);const added=keys(a).find(key=>![shared,closed].includes(key));assert.ok(added);
 a.$('theme').click();await tabs(a).find(tab=>tab.dataset.key===closed).querySelector('.close').onclick();
 const committedA=await until(()=>a.read(),v=>v.current?.tabs.some(t=>t.key===added)&&!v.current.tabs.some(t=>t.key===closed)&&v.current.dark===true,'A did not commit its addition, coordinates and close');
 assert.deepEqual(committedA.current.tabs.find(t=>t.key===shared).positions[nodeID],moved);
 assert.equal(committedA.current.tabs.find(t=>t.key===added).design.markdown,concurrencyBodies.added);
 assert.deepEqual(keys(b),initialKeys);
 select(b,shared);await b.$('refresh').onclick();b.$('source-text').value=changedMarkdown;await b.$('source-submit').onclick();
 b.$('open-text').click();b.$('source-text').value=unsubmittedMarkdown;
 if(trigger==='close')await tabs(b).find(tab=>tab.dataset.key===closed).querySelector('.close').onclick();
 else if(trigger!=='debounce')lifecycle(b,trigger);
 const warning=await assertConflict(b);assertLocalWork(b,initialKeys);
 assert.deepEqual(await a.read(),committedA,'stale first write changes neither current nor generation');
 for(const retry of concurrencyTriggers){
  b.$('status-close').click();
  if(retry==='close')await tabs(b).find(tab=>tab.dataset.key===closed).querySelector('.close').onclick();
  else if(retry==='debounce')b.$('theme').click();else lifecycle(b,retry);
  await assertConflict(b);assertLocalWork(b,initialKeys);assert.deepEqual(await a.read(),committedA,'further '+retry+' cannot overwrite the winner');
 }
 await pause(260);assert.deepEqual(await a.read(),committedA,'previously queued debounce cannot overwrite');
 b.w.close();const fresh=await boot(db);
 assert.deepEqual(keys(fresh),committedA.current.tabs.map(t=>t.key));select(fresh,shared);assert.deepEqual(coords(fresh)[nodeID],moved);
 assert.equal(fresh.$('status').hidden,true,'reload has no conflict warning');fresh.$('theme').click();
 const writable=await until(()=>fresh.read(),v=>v.generation>committedA.generation&&v.current.dark===false,'fresh reload is not writable');
 fresh.$('theme').click();const consecutive=await until(()=>fresh.read(),v=>v.generation>writable.generation&&v.current.dark===true,'normal consecutive save failed');
 assert.deepEqual(consecutive.current.tabs.map(t=>t.key),committedA.current.tabs.map(t=>t.key));
 assert.deepEqual(consecutive.current.tabs.find(t=>t.key===shared).positions[nodeID],moved);
 assert.equal(consecutive.current.tabs.find(t=>t.key===added).design.markdown,concurrencyBodies.added);
 for(const e of [seed,a,b,fresh])assert.equal(e.networkCalls(),0);
 return {trigger,warning,retained:['A added document','A exact coordinates','A tab deletion','B local edit','B unsubmitted draft'],reloadWritable:true,consecutiveSaves:true};
});
await pause();process.off('unhandledRejection',onRejection);windows.forEach(w=>w.close());
console.log(JSON.stringify({model:'Independent unchanged bundled modules and apps in JSDOM + fresh fake IndexedDB; no network or user browser data',limitations:'Dispatched lifecycle events and modeled pointer calls; native browser/process/origin/lifecycle durability requires separate evidence',sourceRoot,appOnly:values['app-only'],results,unhandledRejections:unhandled,passed:results.filter(r=>r.passed).length,failed:results.filter(r=>!r.passed).length},null,2));
if(results.some(r=>!r.passed)||unhandled.length)process.exitCode=1;
