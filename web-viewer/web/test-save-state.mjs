// Unchanged production bundles in independent JSDOM windows. Transactions are
// real fake-indexeddb transactions, held/aborted through the shared import-safe
// browser fixture. This does not claim native-dialog or layout evidence.
import assert from 'node:assert/strict';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'node:util';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {installSaveStateControls,saveStateSnapshot,verifySaveState} from './test-save-state-browser.mjs';
import {concurrencyBodies,changedMarkdown,readConcurrencyRecord,seedLegacyRecord} from './test-session-concurrency-browser.mjs';

const {values}=parseArgs({options:{'source-root':{type:'string'}}});
const sourceRoot=resolve(values['source-root']??resolve(dirname(fileURLToPath(import.meta.url)),'..'));
const code=(await build({absWorkingDir:sourceRoot,entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}})).outputFiles[0].text;
const windows=[],results=[],unhandled=[];
const onRejection=error=>unhandled.push(String(error));process.on('unhandledRejection',onRejection);
async function until(read,predicate,label,{timeout=5000}={}){let last;const end=Date.now()+timeout;do{last=await read();if(predicate(last))return last;await new Promise(resolve=>setTimeout(resolve,5));}while(Date.now()<end);assert.fail(label+'; latest='+JSON.stringify(last));}
// Observe real readonly transaction creation so a second window can queue
// its restore behind a held writer before that writer actually commits.
function observeRestoreTransactions(){
 const control=globalThis.__saveStateControl;control.reads=[];
 const factory=globalThis.indexedDB,open=factory.open.bind(factory);
 Object.defineProperty(globalThis,'indexedDB',{configurable:true,value:new Proxy(factory,{get(target,key){
  if(key!=='open'){const value=Reflect.get(target,key,target);return typeof value==='function'?value.bind(target):value;}
  return (...args)=>{const request=open(...args);request.addEventListener('success',()=>{
   const db=request.result,original=db.transaction.bind(db);
   db.transaction=function(stores,mode,...options){const tx=original(stores,mode,...options);if(mode!=='readwrite'&&(stores==='session'||Array.from(stores).includes('session'))){const read={complete:false};control.reads.push(read);tx.addEventListener('complete',()=>{read.complete=true;});}return tx;};
  });return request;};
 }})});
}
async function env({db=new IDBFactory(),holdWrites=false,failReads=false,wait=true,seed}={}){
 const w=new JSDOM('<div id="app"></div>',{url:'https://alder-save-state.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);
 w.indexedDB=db;w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};
 let requests=0;w.fetch=()=>{requests++;throw Error('External requests forbidden in isolated save-state regression');};
 w.eval('globalThis.__readRecord=('+readConcurrencyRecord.toString()+');globalThis.__seedRecord=('+seedLegacyRecord.toString()+');');
 if(seed!==undefined)await w.__seedRecord({value:structuredClone(seed)});
 w.eval('('+installSaveStateControls.toString()+')('+JSON.stringify({holdWrites,failReads})+');');
 w.eval('('+observeRestoreTransactions.toString()+')();');
 w.eval('globalThis.__saveStateSnapshot=('+saveStateSnapshot.toString()+');');
 const e={w,db,$:id=>w.document.getElementById(id),tabs:()=>Array.from(w.document.querySelectorAll('.tab')),probe:w.__saveStateControl,read:async()=>structuredClone(await w.__readRecord()),network:()=>requests};
 w.eval(code);if(wait)await ready(e);return e;
}
async function ready(e){await until(()=>e.$('open-text')?.disabled,value=>value===false,'restore completes');}
const state=e=>e.$('save-state')?.dataset.state;
const stateIs=(e,value)=>until(()=>state(e),actual=>actual===value,'expected save state '+value);
function guard(e,warning,states){const actual=e.w.__saveStateSnapshot();assert.equal(actual.warning,warning,JSON.stringify(actual));assert.equal(actual.listeners,warning?1:0,JSON.stringify(actual));assert.equal(actual.role,'status');assert.equal(actual.live,'polite');assert.ok(actual.text?.trim(),'visible status has text');if(states)assert.ok(states.includes(actual.state),JSON.stringify(actual));return actual;}
function input(e,id,value){e.$(id).value=value;e.$(id).dispatchEvent(new e.w.Event('input',{bubbles:true}));}
function draft(e,value,mode='text'){e.$('open-'+mode).click();input(e,'source-'+mode,value);}
async function submit(e){await e.$('source-submit').onclick();assert.equal(e.$('source-dialog').hidden,true,'synthetic valid document parses');}
async function document(e,body=concurrencyBodies.shared){draft(e,body);await submit(e);}
function flush(e,type='blur'){if(type==='hidden'){Object.defineProperty(e.w.document,'hidden',{configurable:true,value:true});e.w.document.dispatchEvent(new e.w.Event('visibilitychange'));}else e.w.dispatchEvent(new e.w.Event(type));}
const held=(e,n)=>until(()=>e.probe.writes.length,count=>count>=n,'transaction '+n+' started');
async function release(e,n){e.probe.writes[n-1].release();await until(()=>e.probe.writes[n-1].complete,Boolean,'transaction '+n+' actually completed');}
async function saved(e){await stateIs(e,'saved');guard(e,false,['saved']);return e.read();}
async function caseOf(name,test){try{const detail=await test();results.push({name,passed:true,...detail});}catch(error){results.push({name,passed:false,error:error.stack});}finally{for(const w of windows.splice(0)){w.__saveStateControl?.dispose();w.close();}}}

await caseOf('restoring starts without a guard; empty restore is clean and read-only',async()=>{
 const e=await env({wait:false});assert.equal(state(e),'restoring');assert.equal(e.probe.listeners.size,0);await ready(e);guard(e,false,['unchanged']);assert.deepEqual(await e.read(),{current:undefined,generation:undefined});assert.equal(e.probe.registrations,0);
});
for(const type of ['blur','pagehide','hidden'])await caseOf('unchanged '+type+' does not create a write or false warning',async()=>{
 const e=await env();flush(e,type);guard(e,false,['unchanged']);assert.equal(e.probe.writes.length,0);assert.deepEqual(await e.read(),{current:undefined,generation:undefined});
 await document(e);flush(e);await saved(e);const before=await e.read(),writes=e.probe.writes.length;flush(e,type);guard(e,false,['saved']);assert.equal(e.probe.writes.length,writes);assert.deepEqual(await e.read(),before);
});
await caseOf('dirty and saving warn until the actual latest transaction completes',async()=>{
 const e=await env({holdWrites:true});await document(e);guard(e,true,['dirty']);flush(e);await held(e,1);guard(e,true,['saving']);assert.equal(e.probe.writes[0].complete,false);assert.equal(e.probe.registrations,1);
 await release(e,1);const record=await saved(e);assert.equal(record.current.tabs[0].design.markdown,concurrencyBodies.shared);assert.equal(record.generation,1);assert.equal(e.probe.removals,1);
 const reload=await env({db:e.db});guard(reload,false,['saved']);assert.equal(reload.tabs().length,1);assert.equal(reload.probe.registrations,0);
});
await caseOf('blank/unchanged text editor is clean; draft clear, Cancel, Escape and reopen are exact',async()=>{
 const e=await env();e.$('open-text').click();guard(e,false,['unchanged']);input(e,'source-text','Synthetic unsubmitted text');guard(e,true,['draft']);input(e,'source-text','');guard(e,false,['unchanged']);
 input(e,'source-text','Retained but explicitly canceled');e.$('source-cancel').click();guard(e,false,['unchanged']);e.$('open-text').click();guard(e,true,['draft']);assert.equal(e.$('source-text').value,'Retained but explicitly canceled');
 e.$('source-text').dispatchEvent(new e.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(e.$('source-dialog').hidden,true);guard(e,false,['unchanged']);assert.equal(e.probe.writes.length,0);assert.equal((await e.read()).current,undefined);
 await document(e);flush(e);await saved(e);await e.$('refresh').onclick();guard(e,false,['saved']);assert.equal(e.$('source-text').value,concurrencyBodies.shared);input(e,'source-text',changedMarkdown);guard(e,true,['draft']);input(e,'source-text',concurrencyBodies.shared);guard(e,false,['saved']);
});
await caseOf('invalid text submit retains exact draft and warning without writing it',async()=>{
 const e=await env();draft(e,'Invalid synthetic Markdown without activities');await e.$('source-submit').onclick();assert.equal(e.$('source-dialog').hidden,false);assert.equal(e.$('source-text').value,'Invalid synthetic Markdown without activities');guard(e,true,['draft']);assert.equal(e.probe.writes.length,0);assert.equal((await e.read()).current,undefined);assert.equal(e.network(),0);
});
await caseOf('URL drafts, invalid submit, clear, Cancel and reopening are protected without external requests',async()=>{
 const e=await env();e.$('open-url').click();guard(e,false,['unchanged']);input(e,'source-url','http://invalid.example/synthetic.md');guard(e,true,['draft']);await e.$('source-submit').onclick();guard(e,true,['draft']);assert.equal(e.$('source-dialog').hidden,false);assert.equal(e.network(),0);
 e.$('source-cancel').click();guard(e,false,['unchanged']);e.$('open-url').click();guard(e,true,['draft']);input(e,'source-url','');guard(e,false,['unchanged']);assert.equal((await e.read()).current,undefined);
});
await caseOf('successful submit transfers draft protection to the pending Session save',async()=>{
 const e=await env({holdWrites:true});draft(e,concurrencyBodies.shared);guard(e,true,['draft']);const registrations=e.probe.registrations;await submit(e);guard(e,true,['dirty']);assert.equal(e.$('source-dialog').hidden,true);assert.equal(e.probe.registrations,registrations,'draft-to-session transfer must not re-register');assert.equal(e.probe.removals,0,'no unprotected gap before persistence');flush(e);await held(e,1);await release(e,1);await saved(e);
});
await caseOf('old queued completion cannot clean a newer settings edit',async()=>{
 const e=await env({holdWrites:true});await document(e);flush(e);await held(e,1);e.$('theme').click();flush(e);e.probe.states=[];await release(e,1);await held(e,2);guard(e,true,['saving','dirty']);assert.ok(!e.probe.states.includes('saved'),'older transaction cannot display saved');assert.equal(e.probe.removals,0);
 await release(e,2);const value=await saved(e);assert.equal(value.current.dark,true);assert.equal(value.generation,2);
});
await caseOf('old completion cannot clean a newer submitted document edit',async()=>{
 const e=await env({holdWrites:true});await document(e);flush(e);await held(e,1);await e.$('refresh').onclick();input(e,'source-text',changedMarkdown);await submit(e);flush(e);e.probe.states=[];await release(e,1);await held(e,2);guard(e,true,['saving','dirty']);assert.ok(!e.probe.states.includes('saved'));await release(e,2);assert.equal((await saved(e)).current.tabs[0].design.markdown,changedMarkdown);
});
await caseOf('old completion cannot clean a newer unsubmitted text or URL draft',async()=>{
 for(const mode of ['text','url']){
  const e=await env({holdWrites:true});await document(e);flush(e);await held(e,1);draft(e,mode==='text'?'Synthetic new draft':'https://example.invalid/synthetic.md',mode);guard(e,true,['draft']);e.probe.states=[];await release(e,1);await stateIs(e,'draft');guard(e,true,['draft']);assert.ok(!e.probe.states.includes('saved'));assert.equal(e.probe.removals,0);assert.equal((await e.read()).current.tabs.length,1);
  e.$('source-cancel').click();guard(e,false,['saved']);e.$('open-'+mode).click();guard(e,true,['draft']);
 }
});
for(const kind of ['node drag','drawer resize'])await caseOf('old save completion cannot clean an unfinished '+kind,async()=>{
 const e=await env({holdWrites:true});await document(e);flush(e);await held(e,1);let finish;
 if(kind==='node drag'){
  e.$('layout-lock').click();const node=e.w.document.querySelector('.node');node.onpointerdown({button:0,clientX:0,clientY:0,pointerId:1,stopPropagation(){}});node.onpointermove({clientX:41,clientY:29,pointerId:1});finish=()=>node.onpointerup({pointerId:1});
 }else{e.$('resize').onpointerdown({pointerId:1});e.$('resize').onpointermove({clientX:e.w.innerWidth-470});finish=()=>e.$('resize').onpointerup({pointerId:1});}
 e.probe.states=[];await release(e,1);await until(()=>state(e),value=>value!=='saving','old save has settled');guard(e,true,['dirty']);assert.ok(!e.probe.states.includes('saved'),'an in-progress mutation is newer than completed transaction');finish();flush(e);await held(e,2);await release(e,2);const value=await saved(e);if(kind==='drawer resize')assert.equal(value.current.width,470);
});
for(const fault of ['transaction creation error','transaction abort','snapshot clone error'])await caseOf(fault+' remains unsaved until retry completes',async()=>{
 const e=await env({holdWrites:true});await document(e);const clone=e.w.structuredClone;
 if(fault==='transaction creation error')e.probe.failWrites=1;
 if(fault==='snapshot clone error')e.w.structuredClone=()=>{throw Error('Injected synthetic snapshot error');};
 flush(e);if(fault==='transaction abort'){await held(e,1);e.probe.writes[0].abort();}
 await stateIs(e,'error');guard(e,true,['error']);assert.equal((await e.read()).current,undefined);e.w.structuredClone=clone;const next=e.probe.writes.length+1;flush(e);await held(e,next);guard(e,true,['error','saving']);await release(e,next);await saved(e);
});
await caseOf('close pending keeps the tab and guard; latest committed close removes both',async()=>{
 const e=await env({holdWrites:true});await document(e);const closing=e.tabs()[0].querySelector('.close').onclick();await held(e,1);guard(e,true,['saving']);assert.equal(e.tabs().length,1);assert.equal(e.tabs()[0].querySelector('.close').disabled,true);await release(e,1);await closing;await saved(e);assert.equal(e.tabs().length,0);assert.equal((await e.read()).current.tabs.length,0);
});
await caseOf('failed close keeps tab, exact content and guard until successful close retry',async()=>{
 const e=await env({holdWrites:true});await document(e);const before=e.$('detail').textContent,closing=e.tabs()[0].querySelector('.close').onclick();await held(e,1);e.probe.writes[0].abort();await closing;guard(e,true,['error']);assert.equal(e.tabs().length,1);assert.equal(e.$('detail').textContent,before);assert.equal(e.tabs()[0].querySelector('.close').disabled,false);
 const retry=e.tabs()[0].querySelector('.close').onclick();await held(e,2);guard(e,true,['error','saving']);await release(e,2);await retry;await saved(e);assert.equal(e.tabs().length,0);
});
await caseOf('close completion preserves warning for newer settings until their queued save completes',async()=>{
 const e=await env({holdWrites:true});await document(e);const closing=e.tabs()[0].querySelector('.close').onclick();await held(e,1);e.$('theme').click();e.probe.states=[];await release(e,1);await closing;await held(e,2);assert.equal(e.tabs().length,0);guard(e,true,['saving','dirty']);assert.ok(!e.probe.states.includes('saved'));await release(e,2);assert.equal((await saved(e)).current.dark,true);
});
await caseOf('close completion preserves an editor draft warning',async()=>{
 const e=await env({holdWrites:true});await document(e);const closing=e.tabs()[0].querySelector('.close').onclick();await held(e,1);draft(e,'Synthetic draft during close');await release(e,1);await closing;guard(e,true,['draft']);assert.equal(e.tabs().length,0);assert.equal(e.$('source-dialog').hidden,false);e.$('source-cancel').click();guard(e,false,['saved']);
});
for(const failure of ['invalid session','read error'])await caseOf(failure+' protects storage but only warns after local work',async()=>{
 const initial={tabs:[],dark:false,drawer:true,width:380},value=failure==='invalid session'?{...initial,tabs:'invalid synthetic shape'}:initial;
 const e=await env({seed:value,failReads:failure==='read error'});guard(e,false,['protected']);assert.equal(e.probe.registrations,0);e.probe.failReads=false;flush(e);assert.equal(e.probe.writes.length,0);assert.deepEqual((await e.read()).current,value);
 draft(e,'Synthetic protected draft');guard(e,true,['protected']);e.$('source-cancel').click();guard(e,false,['protected']);e.$('theme').click();guard(e,true,['protected']);flush(e);assert.equal(e.probe.writes.length,0);assert.deepEqual((await e.read()).current,value);
});
await caseOf('invalid saved tab rejects adoption without marking untouched restoration dirty',async()=>{
 const seed=await env();await document(seed);flush(seed);const record=await saved(seed),value=record.current;delete value.tabs[0].design.markdown;
 const e=await env({seed:value});guard(e,false,['protected']);assert.equal(e.tabs().length,0);flush(e,'pagehide');assert.equal(e.probe.writes.length,0);assert.deepEqual((await e.read()).current,value);
});
await caseOf('independent stale window retains local edit, close target and guard; winner stays clean',async()=>{
 const seed=await env();await document(seed);flush(seed);await saved(seed);const a=await env({db:seed.db}),b=await env({db:seed.db});guard(a,false,['saved']);guard(b,false,['saved']);
 a.$('theme').click();flush(a);const winner=await saved(a);await b.$('refresh').onclick();input(b,'source-text',changedMarkdown);await submit(b);flush(b);await stateIs(b,'conflict');guard(b,true,['conflict']);guard(a,false,['saved']);assert.deepEqual(await a.read(),winner);assert.ok(b.$('detail').textContent.includes('Retain B local submitted edit.'));
 b.$('status-close').click();guard(b,true,['conflict']);draft(b,'Keep stale local draft');guard(b,true,['conflict']);await b.tabs()[0].querySelector('.close').onclick();assert.equal(b.tabs().length,1);assert.equal(b.$('source-text').value,'Keep stale local draft');flush(b,'pagehide');guard(b,true,['conflict']);assert.deepEqual(await a.read(),winner);
 const reload=await env({db:seed.db});guard(reload,false,['saved']);reload.$('theme').click();flush(reload);assert.equal((await saved(reload)).current.dark,false);assert.equal(a.network()+b.network()+reload.network(),0);
});

// No-op checks intentionally observe longer than the documented 180ms save
// debounce. Absence of a save cannot be proved by waiting for a saved state:
// that could hide a transient false warning and an unnecessary committed write.
async function noOp(e,act){
 const record=await e.read(),writes=e.probe.writes.length,registrations=e.probe.registrations;
 await act();const immediate=e.w.__saveStateSnapshot();
 await new Promise(resolve=>setTimeout(resolve,220));
 const after=await e.read(),detail={immediate,after:e.w.__saveStateSnapshot(),writes:e.probe.writes.length-writes,registrations:e.probe.registrations-registrations,generationBefore:record.generation,generationAfter:after.generation};
 assert.equal(immediate.warning,false,'no-op must not transiently warn: '+JSON.stringify(detail));
 guard(e,false,['saved','unchanged']);assert.equal(detail.writes,0,'no-op must not enqueue a write: '+JSON.stringify(detail));assert.equal(detail.registrations,0,'no-op must never register departure warning: '+JSON.stringify(detail));assert.deepEqual(after,record,'no-op leaves stored record and generation unchanged');return detail;
}
async function cleanDocument(){const e=await env();await document(e);flush(e);await saved(e);return e;}
function mouseTap(e,target=e.$('viewport')){e.$('viewport').onpointerdown({button:0,pointerId:91,clientX:100,clientY:100,target});e.$('viewport').onpointerup({pointerId:91});}
function touchEvent(e,type,target=e.$('viewport'),point={x:100,y:100}){const event=new e.w.Event(type,{bubbles:true,cancelable:true});Object.assign(event,{pointerId:92,pointerType:'touch',button:0,clientX:point.x,clientY:point.y});target.dispatchEvent(event);}
for(const empty of [true,false])await caseOf('no-op background pointer click on '+(empty?'empty page':'saved document')+' stays clean',async()=>{
 const e=empty?await env():await cleanDocument();return noOp(e,()=>mouseTap(e));
});
await caseOf('no-op already-selected locked-node pointer click stays clean',async()=>{
 const e=await cleanDocument();mouseTap(e,e.w.document.querySelector('.node'));flush(e);const selected=await saved(e);assert.equal(selected.current.tabs[0].selected,e.w.document.querySelector('.node.selected').dataset.node);return noOp(e,()=>mouseTap(e,e.w.document.querySelector('.node.selected')));
});
for(const end of ['onpointerup','onpointercancel','onlostpointercapture'])await caseOf('no-op selected unlocked-node '+end+' without movement stays clean',async()=>{
 const e=await cleanDocument();mouseTap(e,e.w.document.querySelector('.node'));flush(e);const baseline=await saved(e);assert.equal(baseline.current.tabs[0].selected,e.w.document.querySelector('.node.selected').dataset.node);e.$('layout-lock').click();
 return noOp(e,()=>{const node=e.w.document.querySelector('.node.selected');node.onpointerdown({button:0,pointerId:94,clientX:100,clientY:100,stopPropagation(){}});node[end]({pointerId:94});});
});
for(const end of ['onpointerup','onpointercancel'])await caseOf('no-op drawer resize '+end+' without movement stays clean',async()=>{
 const e=await cleanDocument();return noOp(e,()=>{e.$('resize').onpointerdown({pointerId:93});e.$('resize')[end]({pointerId:93});});
});
for(const end of ['pointerup','pointercancel','lostpointercapture'])await caseOf('no-op background touch '+end+' without movement stays clean',async()=>{
 const e=await cleanDocument();return noOp(e,()=>{touchEvent(e,'pointerdown');touchEvent(e,end);});
});
await caseOf('no-op touch movement with identical coordinates stays clean',async()=>{
 const e=await cleanDocument();return noOp(e,()=>{touchEvent(e,'pointerdown');touchEvent(e,'pointermove');touchEvent(e,'pointerup');});
});
await caseOf('no-op already-selected locked-node touch tap stays clean',async()=>{
 const e=await cleanDocument();touchEvent(e,'pointerdown',e.w.document.querySelector('.node'));touchEvent(e,'pointerup');flush(e);const selected=await saved(e);assert.equal(selected.current.tabs[0].selected,e.w.document.querySelector('.node.selected').dataset.node);return noOp(e,()=>{touchEvent(e,'pointerdown',e.w.document.querySelector('.node.selected'));touchEvent(e,'pointerup');});
});
await caseOf('no-op current active-tab click stays clean',async()=>{const e=await cleanDocument();return noOp(e,()=>e.tabs()[0].querySelector('button').click());});
await caseOf('no-op tab drop at its existing index stays clean',async()=>{
 const e=await cleanDocument();return noOp(e,()=>{const tab=e.tabs()[0];tab.ondrop({preventDefault(){},dataTransfer:{getData:()=>tab.dataset.key}});});
});
await caseOf('no-op submit of an unchanged existing document stays clean',async()=>{
 const e=await cleanDocument();await e.$('refresh').onclick();guard(e,false,['saved']);return noOp(e,async()=>{await submit(e);assert.equal(e.tabs().length,1);});
});
for(const [button,label] of [['in','250%'],['out','25%']])await caseOf('no-op zoom at '+label+' limit stays clean',async()=>{
 const e=await cleanDocument();for(let count=0;count<30&&e.$('zoom').textContent!==label;count++)e.$(button).click();assert.equal(e.$('zoom').textContent,label);flush(e);await saved(e);return noOp(e,()=>e.$(button).click());
});

async function clampedDocument(){
 const e=await cleanDocument(),viewport=e.$('viewport');let x=300,y=200;
 // Model a viewport already at its native maximum scroll on both axes.
 // Requested motion can be nonzero while the actual browser camera stays put.
 Object.defineProperty(viewport,'scrollLeft',{configurable:true,get:()=>x,set:value=>{x=Math.max(0,Math.min(300,value));}});
 Object.defineProperty(viewport,'scrollTop',{configurable:true,get:()=>y,set:value=>{y=Math.max(0,Math.min(200,value));}});
 viewport.onscroll();flush(e);const baseline=await saved(e);assert.deepEqual(baseline.current.tabs[0].scroll,[300,200]);return e;
}
await caseOf('no-op touch movement clamped at actual scroll boundaries stays clean',async()=>{
 const e=await clampedDocument();return noOp(e,()=>{touchEvent(e,'pointerdown');touchEvent(e,'pointermove',e.$('viewport'),{x:50,y:50});touchEvent(e,'pointerup',e.$('viewport'),{x:50,y:50});assert.equal(e.$('viewport').scrollLeft,300);assert.equal(e.$('viewport').scrollTop,200);});
});
await caseOf('partly clamped touch still warns and saves actual movement on the other axis',async()=>{
 const e=await clampedDocument();touchEvent(e,'pointerdown');touchEvent(e,'pointermove',e.$('viewport'),{x:50,y:150});guard(e,true,['dirty']);touchEvent(e,'pointerup',e.$('viewport'),{x:50,y:150});flush(e);const record=await saved(e);assert.deepEqual(record.current.tabs[0].scroll,[300,150]);
});
for(const control of ['layout-lock','display-settings-toggle'])await caseOf(control+' captures an undispatched camera change without swallowing its dirty state',async()=>{
 const e=await cleanDocument();e.$('viewport').scrollLeft=123;e.$('viewport').scrollTop=67;e.$(control).click();guard(e,true,['dirty','saving']);flush(e);const record=await saved(e);assert.deepEqual(record.current.tabs[0].scroll,[123,67]);
});

const pendingNoOps=[
 ['background pointer release',e=>mouseTap(e)],
 ['touch finish',e=>{touchEvent(e,'pointerdown');touchEvent(e,'pointerup');}],
 ['resize release',e=>{e.$('resize').onpointerdown({pointerId:96});e.$('resize').onpointerup({pointerId:96});}],
 ...['blur','pagehide','hidden'].map(type=>['lifecycle '+type,e=>flush(e,type)])
];
for(const [label,act] of pendingNoOps)await caseOf('pending current revision is not duplicated by no-op '+label,async()=>{
 const e=await env({holdWrites:true});await document(e);flush(e);await held(e,1);guard(e,true,['saving']);act(e);
 // Give a mistakenly queued same-revision debounce the opportunity to fire
 // while transaction 1 is still held. Then observe all real completions.
 await new Promise(resolve=>setTimeout(resolve,220));assert.equal(e.probe.writes[0].complete,false);e.probe.holdWrites=false;await release(e,1);const record=await saved(e);
 const detail={writes:e.probe.writes.length,commits:e.probe.writes.filter(write=>write.complete).length,generation:record.generation};
 assert.deepEqual(detail,{writes:1,commits:1,generation:1},'a no-op may flush the existing save but must not queue another same-revision write');assert.equal(record.current.tabs[0].design.markdown,concurrencyBodies.shared);return detail;
});
await caseOf('no-op during pending save cannot stale a second window restoring its first commit',async()=>{
 const a=await env({holdWrites:true});await document(a);flush(a);await held(a,1);mouseTap(a);await new Promise(resolve=>setTimeout(resolve,220));
 const b=await env({db:a.db,wait:false});await until(()=>b.probe.reads.length,count=>count===1,'second window queued its readonly restoration');assert.equal(b.probe.reads[0].complete,false,'restore waits behind first held transaction');
 a.probe.holdWrites=false;await release(a,1);await ready(b);await saved(a);guard(b,false,['saved']);
 // B loaded commit 1 before any needless follow-on writer can start. Its first
 // genuine edit must therefore remain writable once A reports saved.
 b.$('theme').click();flush(b);await until(()=>state(b),value=>['saved','conflict'].includes(value),'second window attempted its first real edit');
 const record=await a.read(),detail={originalWindowWrites:a.probe.writes.length,secondWindowState:state(b),generation:record.generation};
 assert.equal(state(b),'saved','duplicate same-revision save must not stale the newly restored window: '+JSON.stringify(detail));assert.equal(a.probe.writes.length,1);assert.equal(record.generation,2);assert.equal(record.current.dark,true);guard(b,false,['saved']);return detail;
});

await caseOf('browser module imports without launch; all independent setup failures remain observable',async()=>{
 let contexts=0;const log=console.log;console.log=()=>{};
 try{await assert.rejects(verifySaveState({newContext:async()=>{contexts++;throw Error('Synthetic browser setup failure');}}),error=>error instanceof AggregateError&&error.results.length===16&&error.results.every(result=>result.status==='failed'&&result.error.message.includes('Synthetic browser setup failure')));}finally{console.log=log;}
 assert.equal(contexts,16,'each native-browser case is attempted independently');
});

process.off('unhandledRejection',onRejection);
console.log(JSON.stringify({model:'Unmodified bundled production app in independent JSDOM windows, shared fresh fake IndexedDB; held real transactions and real aborts; no browser, server, network or user data',limitations:'Synthetic beforeunload cancellation and listener lifecycle only; actual dialogs and responsive geometry require verifySaveState(browser,{url})',sourceRoot,results,unhandledRejections:unhandled,passed:results.filter(r=>r.passed).length,failed:results.filter(r=>!r.passed).length},null,2));
if(results.some(r=>!r.passed)||unhandled.length)process.exitCode=1;
