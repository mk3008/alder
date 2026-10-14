// Isolated unchanged bundles, fake IndexedDB and synthetic documents only.
// --source-root allows the same regression against the pre-fix source.
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory,IDBObjectStore} from 'fake-indexeddb';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'node:util';
import {readConcurrencyRecord,concurrencyBodies,changedMarkdown,emptySession} from './test-session-concurrency-browser.mjs';
const {values}=parseArgs({options:{'source-root':{type:'string'}}});
const root=resolve(values['source-root']??resolve(dirname(fileURLToPath(import.meta.url)),'..'));
const bundle=async entry=>(await build({absWorkingDir:root,entryPoints:[entry],bundle:true,write:false,format:'iife',globalName:'api',loader:{'.md':'text','.css':'empty'}})).outputFiles[0].text;
const storage=await bundle('src/session.ts'),app=await bundle('src/main.ts');
const windows=[],results=[],unhandled=[];const rejected=e=>unhandled.push(String(e));process.on('unhandledRejection',rejected);
const pause=(ms=15)=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(read,predicate,label){let last;for(let i=0;i<300;i++){last=await read();if(predicate(last))return last;await pause();}assert.fail(label+': '+JSON.stringify(last));}
function realm(db=new IDBFactory(),code=app){
 const w=new JSDOM('<div id="app"></div>',{url:'https://save-conflict.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);
 w.indexedDB=db;w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};
 w.fetch=()=>{throw Error('Network forbidden');};w.eval('globalThis.readRecord='+readConcurrencyRecord.toString());w.eval(code+';globalThis.testAPI=api;');
 return {w,api:w.testAPI,$:id=>w.document.getElementById(id),read:async()=>structuredClone(await w.readRecord())};
}
async function boot(db){const e=realm(db);await until(()=>e.$('open-text').disabled,x=>!x,'restore');return e;}
async function input(e,body){e.$('open-text').click();e.$('source-text').value=body;await e.$('source-submit').onclick();assert.equal(e.$('source-dialog').hidden,true);}
function flush(e){e.w.dispatchEvent(new e.w.Event('blur'));}
const saved=e=>until(()=>e.$('app').dataset.saveState,x=>x==='saved','save');
async function run(name,test){try{const detail=await test();results.push({name,passed:true,...detail});}catch(error){results.push({name,passed:false,error:error.stack});}finally{windows.splice(0).forEach(w=>w.close());}}
await run('equal repeated writes do not advance generation or invalidate a second reader',async()=>{
 const db=new IDBFactory(),a=realm(db,storage),b=realm(db,storage),value=emptySession();await a.api.loadSession();await a.api.saveSession(value);await b.api.loadSession();
 for(let i=0;i<3;i++)await a.api.saveSession(structuredClone(value));
 assert.equal((await a.read()).generation,1,'unchanged writes must not invent generations');
 await b.api.saveSession({...value,dark:true});assert.deepEqual(await a.read(),{current:{...value,dark:true},generation:2});
 return {repeatedNoops:3,generationBeforeReaderSave:1};
});
await run('concurrent identical proposals both succeed with one stored generation',async()=>{
 const db=new IDBFactory(),a=realm(db,storage),b=realm(db,storage),value=emptySession();await Promise.all([a.api.loadSession(),b.api.loadSession()]);
 await Promise.all([a.api.saveSession(value),b.api.saveSession(value)]);assert.deepEqual(await a.read(),{current:value,generation:1});
 await b.api.saveSession({...value,width:420});assert.equal((await a.read()).generation,2);
 await assert.rejects(()=>a.api.saveSession({...value,dark:true}),{name:'SessionConflictError'});
});
await run('generation-only drift with identical current payload is acknowledged without writes',async()=>{
 const db=new IDBFactory(),a=realm(db,storage),b=realm(db,storage),value=emptySession();await a.api.loadSession();await a.api.saveSession(value);await b.api.loadSession();
 await a.api.saveSession({...value,dark:true});await a.api.saveSession(value);const before=await a.read();assert.equal(before.generation,3);
 await b.api.saveSession(value);assert.deepEqual(await a.read(),before);await b.api.saveSession({...value,width:460});assert.equal((await a.read()).generation,4);
 return {before:3,afterAcknowledgement:3,afterEdit:4};
});
await run('opaque file handles never qualify as equal plain snapshots',async()=>{
 const db=new IDBFactory(),a=realm(db,storage),b=realm(db,storage),value={...emptySession(),tabs:[{handle:{}}]};
 await a.api.loadSession();await a.api.saveSession(value);await b.api.loadSession();await a.api.saveSession(value);
 assert.equal((await a.read()).generation,2);await assert.rejects(()=>b.api.saveSession(value),{name:'SessionConflictError'});
});
await run('own undefined properties are distinct stored payloads and retain stale-write protection',async()=>{
 const db=new IDBFactory(),a=realm(db,storage),b=realm(db,storage),value=emptySession();await a.api.loadSession();await a.api.saveSession(value);await b.api.loadSession();
 await a.api.saveSession({...value,preferWrite:undefined});const before=await a.read();assert.equal(before.generation,2);assert.equal(Object.hasOwn(before.current,'preferWrite'),true);
 await assert.rejects(()=>b.api.saveSession(value),{name:'SessionConflictError'});assert.deepEqual(await a.read(),before);
});
await run('an equal transaction abort does not acknowledge another writer generation',async()=>{
 const db=new IDBFactory(),a=realm(db,storage),b=realm(db,storage),value=emptySession();await a.api.loadSession();await b.api.loadSession();await a.api.saveSession(value);
 const get=IDBObjectStore.prototype.get;
 IDBObjectStore.prototype.get=function(key){const request=get.call(this,key);if(this.transaction.mode==='readwrite'&&key==='current'){const tx=this.transaction;request.addEventListener('success',()=>tx.abort());}return request;};
 try{await assert.rejects(()=>b.api.saveSession(value));}finally{IDBObjectStore.prototype.get=get;}
 await assert.rejects(()=>b.api.saveSession({...value,dark:true}),{name:'SessionConflictError'});assert.deepEqual(await a.read(),{current:value,generation:1});
});
await run('single page clean lifecycle and repeated selection leave storage unchanged',async()=>{
 const db=new IDBFactory(),e=await boot(db);flush(e);assert.deepEqual(await e.read(),{current:undefined,generation:undefined});
 await input(e,concurrencyBodies.shared);flush(e);await saved(e);const initial=await e.read();
 for(let i=0;i<3;i++){e.w.document.querySelector('.tab > button').click();e.$('viewport').dispatchEvent(new e.w.Event('scroll'));flush(e);e.w.dispatchEvent(new e.w.Event('pagehide'));}
 await pause(250);assert.deepEqual(await e.read(),initial);assert.equal(e.$('status').hidden,true);
 const fresh=await boot(db);flush(fresh);await pause(230);assert.deepEqual(await fresh.read(),initial);assert.equal(fresh.$('status').hidden,true);
});
await run('real UI round-trip setting before debounce does not invalidate a peer',async()=>{
 const db=new IDBFactory(),seed=await boot(db);await input(seed,concurrencyBodies.shared);flush(seed);await saved(seed);seed.w.close();
 // Commit one restored canonical snapshot (legacy normalization is not equality).
 const canonical=await boot(db);canonical.$('theme').click();flush(canonical);await saved(canonical);canonical.w.close();
 const a=await boot(db),b=await boot(db),before=await a.read();a.$('theme').click();a.$('theme').click();flush(a);await saved(a);
 assert.deepEqual(await a.read(),before,'returning to the stored setting is no new snapshot');
 b.$('in').click();flush(b);await saved(b);assert.equal(b.$('status').hidden,true);assert.equal((await b.read()).generation,before.generation+1);
 return {setting:'theme toggled twice before debounce',peerCameraSaved:true};
});
for(const kind of ['theme','body'])await run('true '+kind+' divergence protects newer data; clean stale viewing stays quiet',async()=>{
 const db=new IDBFactory(),seed=await boot(db);await input(seed,concurrencyBodies.shared);flush(seed);await saved(seed);seed.w.close();
 const a=await boot(db),b=await boot(db);
 if(kind==='theme'){a.$('theme').click();flush(a);await saved(a);}else{a.$('edit-markdown').click();a.$('source-text').value=changedMarkdown;a.$('source-text').dispatchEvent(new a.w.Event('input',{bubbles:true}));await a.$('source-submit').onclick();await saved(a);}
 const newer=await a.read();for(let i=0;i<3;i++){flush(b);b.w.dispatchEvent(new b.w.Event('pagehide'));b.w.document.querySelector('.tab > button').click();}
 await pause(230);assert.equal(b.$('status').hidden,true,'no unsaved change means no warning');assert.deepEqual(await b.read(),newer);
 b.$('in').click();flush(b);await until(()=>b.$('app').dataset.saveState,x=>x==='conflict','conflict after real local camera change');
 assert.deepEqual(await b.read(),newer);assert.match(b.$('status-text').textContent,/ブラウザーのタブやウィンドウ/);assert.match(b.$('status-text').textContent,/本文または表示設定/);
 let announcements=0;const observer=new b.w.MutationObserver(records=>{announcements+=records.length;});observer.observe(b.$('status-text'),{childList:true,characterData:true,subtree:true});
 const warning=b.$('status-text').textContent;for(let i=0;i<3;i++){flush(b);b.$('in').click();b.$('display-settings-toggle').click();}
 await pause(250);observer.disconnect();assert.equal(announcements,0,'existing conflict is retained, not re-announced');assert.equal(b.$('status-text').textContent,warning);assert.deepEqual(await b.read(),newer);
 b.w.close();const reloaded=await boot(db);assert.equal(reloaded.$('status').hidden,true);reloaded.$('theme').click();flush(reloaded);await saved(reloaded);
 return {kind,repeatAnnouncements:announcements,unchangedNewerSnapshot:true,reloadWritable:true};
});
await pause();process.off('unhandledRejection',rejected);windows.forEach(w=>w.close());
console.log(JSON.stringify({model:'JSDOM + isolated fake IndexedDB; unchanged production bundles',sourceRoot:root,results,unhandled,passed:results.filter(x=>x.passed).length,failed:results.filter(x=>!x.passed).length},null,2));
if(results.some(x=>!x.passed)||unhandled.length)process.exitCode=1;
