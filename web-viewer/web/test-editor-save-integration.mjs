import {documentControls,readDocumentRecord} from './document-test-view.mjs';
import {groupSession} from './group-session-fixture.mjs';
import {joinedSession} from './session-test-view.mjs';
// Combined #82 / PR198 MODEL evidence. Production modules are bundled unchanged.
// Independent JSDOM windows share fresh fake IndexedDB only where a race needs it.
// The fixture holds/aborts real transactions; no native browser or server starts.
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {installSaveStateControls,saveStateSnapshot} from './test-save-state-browser.mjs';
import {concurrencyBodies,changedMarkdown,readConcurrencyRecord,seedLegacyRecord} from './test-session-concurrency-browser.mjs';

const code=(await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}})).outputFiles[0].text;
const windows=[],results=[],unhandled=[];
const onRejection=e=>unhandled.push(String(e));process.on('unhandledRejection',onRejection);
const pause=(ms=5)=>new Promise(resolve=>setTimeout(resolve,ms));
async function until(read,predicate,label){let last;const end=Date.now()+5000;do{last=await read();if(predicate(last))return last;await pause();}while(Date.now()<end);assert.fail(label+'; latest='+JSON.stringify(last));}
async function env({db=new IDBFactory(),seed,seedGeneration,failReads=false,fetch}={}){
 const w=new JSDOM('<div id="app"></div>',{url:'https://alder-editor-save.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);
 w.indexedDB=db;w.structuredClone=structuredClone;w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;w.Response=Response;w.Headers=Headers;w.ReadableStream=ReadableStream;w.AbortController=AbortController;
 w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};
 const requests=[],downloads=[],urls=new Map();w.fetch=async(...args)=>{requests.push(args);if(!fetch)throw Error('External request forbidden');return fetch(...args);};
 w.URL.createObjectURL=blob=>{const url='blob:https://alder-editor-save.test/'+urls.size;urls.set(url,blob);return url;};w.URL.revokeObjectURL=()=>{};
 w.HTMLAnchorElement.prototype.click=function(){assert.ok(this.download,'only explicit rescue downloads are allowed');downloads.push({name:this.download,blob:urls.get(this.href)});};
 w.eval('globalThis.__readRecord=('+readDocumentRecord.toString()+');globalThis.__seedRecord=('+seedLegacyRecord.toString()+');');
 if(seed!==undefined){const {documents,...rest}=seed??{};await w.__seedRecord({value:structuredClone(documents?{...rest,tabs:documents}:seed)});}
 if(seedGeneration!==undefined){w.__seedGeneration=seedGeneration;await w.eval(`new Promise((resolve,reject)=>{const open=indexedDB.open('alder-web-viewer',1);open.onerror=()=>reject(open.error);open.onsuccess=()=>{const db=open.result,tx=db.transaction('session','readwrite');tx.objectStore('session').put(globalThis.__seedGeneration,'generation');tx.oncomplete=()=>{db.close();resolve();};tx.onabort=tx.onerror=()=>{db.close();reject(tx.error);};};})`);}
 w.eval('('+installSaveStateControls.toString()+')('+JSON.stringify({failReads})+');globalThis.__snapshot=('+saveStateSnapshot.toString()+');');
 const e={w,db,$:id=>w.document.getElementById(id),tabs:()=>documentControls(w),read:async()=>{const record=structuredClone(await w.__readRecord());return {...record,current:joinedSession(record.current)};},probe:w.__saveStateControl,requests,downloads};
 w.eval(code);await until(()=>e.$('open-text')?.disabled,v=>v===false,'restoration finishes');return e;
}
const mode=e=>e.$('app').dataset.saveState;
const graph=e=>e.$('nodes').innerHTML;
const input=(e,raw)=>{e.$('source-text').value=raw;e.$('source-text').dispatchEvent(new e.w.Event('input',{bubbles:true}));};
async function invoke(e,id){const pending=e.$(id).onclick(new e.w.MouseEvent('click',{cancelable:true}));if(id==='source-cancel'&&e.$('source-close-dialog').open)await e.$('source-close-confirm').onclick();return await pending;}
const flush=e=>e.w.dispatchEvent(new e.w.Event('blur'));
const held=(e,n)=>until(()=>e.probe.writes.length,v=>v>=n,'write '+n+' begins');
async function release(e,n){e.probe.writes[n-1].release();await until(()=>e.probe.writes[n-1].complete,Boolean,'write '+n+' commits');}
async function clean(e){await until(()=>mode(e),v=>v==='saved','latest state is saved');guard(e,false);return e.read();}
async function add(e,body=concurrencyBodies.shared){await invoke(e,'open-text');input(e,body);await invoke(e,'source-submit');assert.equal(e.$('source-dialog').hidden,true);flush(e);return clean(e);}
async function edit(e,raw){await invoke(e,'edit-markdown');assert.equal(e.$('source-dialog').dataset.mode,'edit');assert.equal(e.$('source-dialog').hidden,false);if(raw!==undefined)input(e,raw);}
function guard(e,warning){const s=e.w.__snapshot();assert.equal(s.warning,warning,JSON.stringify(s));assert.equal(s.listeners,warning?1:0,JSON.stringify(s));assert.equal(s.legacyRow,false);assert.equal(s.stateRole,null);assert.equal(s.stateLive,null);if(!['error','conflict','protected'].includes(s.state)){assert.equal(s.storageNotice,false,'ordinary save transitions have no storage announcement');assert.equal(s.recoveryHidden,true,'ordinary transitions have no recovery actions');}return s;}
function storage(e){if(e.$('status').dataset.key==='operation')e.$('status-close').click();assert.equal(e.$('status').dataset.key,'storage');assert.equal(e.$('status').hidden,false);assert.equal(e.$('save-actions').hidden,false);assert.equal(e.$('status-close').hidden,true);}
async function bytes(e,blob){return new Promise((resolve,reject)=>{const r=new e.w.FileReader();r.onload=()=>resolve(Buffer.from(r.result));r.onerror=()=>reject(r.error);r.readAsArrayBuffer(blob);});}
async function rescue(e,id,expected){storage(e);assert.equal(e.$(id).hidden,false,id+' is offered');const record=await e.read(),before=guard(e,true),writes=e.probe.writes.length,count=e.downloads.length;await invoke(e,id);assert.equal(e.downloads.length,count+1);const d=e.downloads.at(-1);assert.equal(d.blob.type,'text/markdown;charset=utf-8');assert.match(d.name,/\.md$/);assert.doesNotMatch(d.name,/[\/\\\u0000-\u001f\u007f<>:"|?*]/);assert.deepEqual(await bytes(e,d.blob),Buffer.from(expected),'rescue retains exact raw UTF-8 bytes');assert.equal(e.probe.writes.length,writes,'rescue is read-only');assert.deepEqual(await e.read(),record);assert.equal(mode(e),before.state);guard(e,true);}
async function caseOf(name,run){try{const detail=await run();results.push({name,passed:true,...detail});}catch(error){results.push({name,passed:false,error:error.stack});}finally{for(const w of windows.splice(0)){w.__saveStateControl?.dispose();w.close();}}}

for(const operation of ['apply','refresh'])await caseOf(operation+' waits for commit, then saves concurrent theme/drawer/camera changes without a clean gap',async()=>{
 const initial=operation==='apply'?concurrencyBodies.shared:changedMarkdown;
 const e=await env({fetch:async()=>new Response(initial,{headers:{'content-type':'text/markdown'}})});
 await invoke(e,'open-url');e.$('source-url').value='https://synthetic.invalid/design.md';await invoke(e,'source-submit');flush(e);await clean(e);
 if(operation==='refresh'){await edit(e,concurrencyBodies.shared);await invoke(e,'source-submit');await clean(e);e.w.confirm=()=>true;}
 assert.equal(e.$('refresh').disabled,false,'eligible URL refresh is enabled before the document save');
 const before=await e.read(),key=e.tabs()[0].dataset.key,oldGraph=graph(e);e.probe.holdWrites=true;
 if(operation==='apply')await edit(e,changedMarkdown);
 const first=e.probe.writes.length+1,pending=invoke(e,operation==='apply'?'source-submit':'refresh');await held(e,first);
 assert.equal(e.$('refresh').disabled,true,'document save blocks source refresh');assert.equal(e.$('refresh').hidden,false,'active document keeps refresh visible during the saving guard');const requests=e.requests.length;await invoke(e,'refresh');assert.equal(e.requests.length,requests,'direct refresh handler cannot fetch during a document save');
 assert.equal(e.probe.writes[first-1].complete,false);assert.equal(graph(e),oldGraph,'Graph cannot publish an uncommitted document');guard(e,true);
 e.$('theme').click();e.$('drawer').click();e.$('viewport').scrollLeft=123;e.$('viewport').scrollTop=67;e.$('viewport').onscroll();
 if(operation==='apply'){await invoke(e,'source-submit');await invoke(e,'source-cancel');await e.tabs()[0].querySelector('.close').onclick();await invoke(e,'open-text');assert.equal(e.$('source-dialog').dataset.mode,'edit');assert.equal(e.$('source-dialog').hidden,false);}
 assert.equal(e.probe.writes.length,first,'duplicate document operations cannot queue conflicting snapshots');assert.equal(e.tabs().length,1);e.probe.states=[];
 await release(e,first);await pending;await held(e,first+1);guard(e,true);assert.ok(!e.probe.states.includes('saved'),'the older commit never acknowledges newer UI edits');assert.equal(e.tabs()[0].dataset.key,key);
 await release(e,first+1);const after=await clean(e),tab=after.current.documents[0];assert.equal(tab.design.markdown,changedMarkdown);assert.equal(tab.draft,undefined);assert.equal(after.current.dark,!before.current.dark);assert.equal(after.current.drawer,!before.current.drawer);assert.deepEqual(tab.scroll,[123,67]);assert.equal(after.generation,before.generation+2);assert.equal(e.$('save-actions').hidden,true);
 return {generationBefore:before.generation,generationAfter:after.generation,requests:e.requests.length};
});
await caseOf('close Group A blocks shared Apply until durable deletion; other Group applies without resurrection',async()=>{
 const source=groupSession(),raw=source.document.design.markdown+'\n';const e=await env({seed:source});await edit(e,raw);flush(e);await clean(e);const before=await e.read(),views=()=>[...e.w.document.querySelectorAll('.tab')],a=views()[1].dataset.key;
 e.probe.holdWrites=true;const first=e.probe.writes.length+1,closing=views()[1].querySelector('.close').onclick();await held(e,first);assert.equal(e.$('source-submit').disabled,true);assert.equal(e.$('source-text').disabled,true);await invoke(e,'source-submit');assert.equal(e.probe.writes.length,first);
 await release(e,first);await closing;assert.equal(views().length,2);assert.ok(!views().some(t=>t.dataset.key===a));assert.equal(e.$('source-text').value,raw);assert.equal(e.$('source-submit').disabled,false);
 const applying=invoke(e,'source-submit');await held(e,first+1);await release(e,first+1);await applying;const after=await clean(e);assert.equal(after.current.documents[0].design.markdown,raw);assert.equal(after.generation,before.generation+2);assert.ok(!views().some(t=>t.dataset.key===a));
});
for(const fault of ['Error','QuotaExceededError'])await caseOf(fault+' during Apply preserves prior Graph and exact draft; rescue/retry never falsely apply',async()=>{
 const e=await env();await add(e);const before=await e.read(),old=graph(e),raw=changedMarkdown+'\n  日本語 🪵 <script>globalThis.__ran=true</script>\n\n';await edit(e,raw);e.probe.failWriteName=fault;e.probe.failWrites=1;await invoke(e,'source-submit');assert.equal(mode(e),'error');assert.equal(graph(e),old);assert.equal(e.$('source-dialog').hidden,false);assert.equal(e.$('source-text').value,raw);assert.deepEqual(await e.read(),before);guard(e,true);
 await rescue(e,'save-download',concurrencyBodies.shared);await rescue(e,'save-draft-download',raw);assert.equal(e.w.__ran,undefined);
 e.probe.holdWrites=true;const next=e.probe.writes.length+1;await invoke(e,'save-retry');await held(e,next);assert.equal(e.$('save-retry').disabled,true);await invoke(e,'save-retry');assert.equal(e.probe.writes.length,next);guard(e,true);await release(e,next);const stored=await clean(e);assert.equal(stored.current.documents[0].draft,raw);assert.equal(stored.current.documents[0].design.markdown,concurrencyBodies.shared);assert.equal(graph(e),old,'retry preserves a draft without claiming to apply it');assert.equal(e.$('source-text').value,raw);assert.equal(e.$('save-actions').hidden,true);
 e.probe.holdWrites=false;await invoke(e,'source-submit');const applied=await clean(e);assert.equal(applied.current.documents[0].design.markdown,raw);assert.equal(applied.current.documents[0].draft,undefined);assert.equal(e.$('source-dialog').hidden,true);
});
await caseOf('a real Apply transaction abort rolls back document and generation together',async()=>{
 const e=await env();await add(e);const before=await e.read(),old=graph(e);await edit(e,changedMarkdown);e.probe.holdWrites=true;const next=e.probe.writes.length+1,applying=invoke(e,'source-submit');await held(e,next);e.probe.writes[next-1].abort();await applying;assert.equal(mode(e),'error');assert.deepEqual(await e.read(),before);assert.equal(graph(e),old);assert.equal(e.$('source-text').value,changedMarkdown);guard(e,true);await rescue(e,'save-draft-download',changedMarkdown);
});
await caseOf('stale Apply preserves winner, original Graph and exact local draft; no force retry',async()=>{
 const seed=await env();await add(seed);const a=await env({db:seed.db}),b=await env({db:seed.db}),old=graph(b);a.$('theme').click();flush(a);const winner=await clean(a);await edit(b,changedMarkdown);await invoke(b,'source-submit');assert.equal(mode(b),'conflict');assert.equal(graph(b),old);assert.equal(b.$('source-text').value,changedMarkdown);assert.deepEqual(await a.read(),winner);guard(b,true);await rescue(b,'save-download',concurrencyBodies.shared);await rescue(b,'save-draft-download',changedMarkdown);assert.equal(b.$('save-retry').hidden,true);const writes=b.probe.writes.length;await invoke(b,'save-retry');flush(b);await pause(220);assert.equal(b.probe.writes.length,writes);assert.deepEqual(await a.read(),winner);b.w.confirm=()=>true;await b.tabs()[0].querySelector('.close').onclick();assert.equal(b.tabs().length,1);assert.equal(b.$('source-text').value,changedMarkdown);
});
for(const closed of [false,true])for(const empty of [false,true])await caseOf((closed?'closed':'open')+(empty?' empty':' raw')+' per-tab saved draft remains rescuable after a later failure without mixing tabs',async()=>{
 const e=await env();await add(e);await add(e,concurrencyBodies.added);const raw=empty?'':'  # invalid draft\n日本語 🪵 <img src=x>\n\n',key=e.tabs()[1].dataset.key;await edit(e,raw);
 if(closed)await invoke(e,'source-cancel');else{flush(e);await clean(e);}guard(e,false);const before=await e.read();assert.equal(before.current.documents.find(t=>t.key===key).draft,raw);assert.equal(before.current.documents[0].draft,undefined);assert.equal(e.$('source-dialog').hidden,closed);
 e.probe.failWrites=1;e.$('theme').click();flush(e);await until(()=>mode(e),v=>v==='error','later UI save fails');await rescue(e,'save-download',concurrencyBodies.added);await rescue(e,'save-draft-download',raw);assert.equal(e.$('source-dialog').hidden,closed,'rescue never changes editor visibility');
});
for(const method of ['Close','Escape'])await caseOf(method+' durably saves raw draft before hiding; later removal clears the departure warning only after commit',async()=>{
 const e=await env();await add(e);const raw=' Unapplied durable draft\n';await edit(e,raw);e.probe.holdWrites=true;let next=e.probe.writes.length+1,closing;
 if(method==='Close')closing=invoke(e,'source-cancel');else{e.$('source-text').dispatchEvent(new e.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(e.$('source-close-dialog').open,true);closing=invoke(e,'source-close-confirm');}await held(e,next);assert.equal(e.$('source-dialog').hidden,false);guard(e,true);await release(e,next);if(closing)await closing;await until(()=>e.$('source-dialog').hidden,Boolean,'editor closes after draft save');const stored=await clean(e);assert.equal(stored.current.documents[0].draft,raw);
 await edit(e,concurrencyBodies.shared);guard(e,true);next=e.probe.writes.length+1;closing=invoke(e,'source-cancel');await held(e,next);guard(e,true);await release(e,next);await closing;assert.equal((await clean(e)).current.documents[0].draft,undefined);assert.equal(e.$('save-actions').hidden,true);
});
for(const fail of ['read','shape','shape-with-generation'])await caseOf('restore '+fail+' failure protects original bytes while local common-editor work stays rescuable',async()=>{
 const seed=await env();await add(seed);const initial=(await seed.read()).current;initial.documents[0].draft='Previously saved raw draft\n';if(fail.startsWith('shape'))initial.documents[0].draft=42;
 const e=await env({seed:initial,seedGeneration:fail==='shape-with-generation'?7:undefined,failReads:fail==='read'});assert.equal(mode(e),'protected');guard(e,false);assert.equal(e.tabs().length,0);e.probe.failReads=false;const protectedRecord=await e.read();if(fail==='shape-with-generation')assert.equal(protectedRecord.generation,7,'main-shape rejection follows a valid generation read');
 await invoke(e,'open-text');input(e,concurrencyBodies.added);await invoke(e,'source-submit');await edit(e,changedMarkdown);const old=graph(e);await invoke(e,'source-submit');assert.equal(graph(e),old);assert.equal(e.$('source-text').value,changedMarkdown);assert.equal(e.$('source-dialog').hidden,false);guard(e,true);await rescue(e,'save-download',concurrencyBodies.added);await rescue(e,'save-draft-download',changedMarkdown);await invoke(e,'source-cancel');assert.equal(e.$('source-dialog').hidden,false,'unsavable editor draft cannot claim a durable close');assert.equal(e.$('save-retry').hidden,true);flush(e);await pause(220);assert.equal(e.probe.writes.length,0);assert.deepEqual(await e.read(),protectedRecord);
});
for(const corrupt of [null,false,0,''])await caseOf('falsy stored current '+JSON.stringify(corrupt)+' with valid generation stays protected',async()=>{
 const e=await env({seed:corrupt,seedGeneration:7});const original=await e.read();assert.deepEqual(original,{current:corrupt,generation:7});assert.equal(mode(e),'protected','only an absent undefined record may be treated as empty');guard(e,false);
 await invoke(e,'open-text');input(e,concurrencyBodies.shared);await invoke(e,'source-submit');await edit(e,changedMarkdown);await invoke(e,'source-submit');assert.equal(e.$('source-dialog').hidden,false);assert.equal(e.$('source-text').value,changedMarkdown);guard(e,true);storage(e);assert.equal(e.$('save-retry').hidden,true);await rescue(e,'save-draft-download',changedMarkdown);
 await invoke(e,'source-cancel');assert.equal(e.$('source-dialog').hidden,false);flush(e);await pause(220);assert.equal(e.probe.writes.length,0);assert.deepEqual(await e.read(),original,'current and generation are never overwritten');
});
await caseOf('latest draft commit clears warning, then a newer draft immediately restores it without normal storage announcements',async()=>{
 const e=await env();await add(e);await edit(e,'first exact draft\n');e.probe.holdWrites=true;const next=e.probe.writes.length+1;flush(e);await held(e,next);guard(e,true);e.probe.states=[];input(e,'second exact draft\n');flush(e);await release(e,next);await held(e,next+1);guard(e,true);assert.ok(!e.probe.states.includes('saved'));await release(e,next+1);const stored=await clean(e);assert.equal(stored.current.documents[0].draft,'second exact draft\n');assert.equal(e.$('source-dialog').hidden,false);assert.equal(e.$('save-actions').hidden,true);input(e,'third exact draft\n');guard(e,true);assert.equal(e.$('save-actions').hidden,true);assert.equal(e.$('status').hidden,true);
});

process.off('unhandledRejection',onRejection);
console.log(JSON.stringify({model:'Unchanged production bundles; isolated synthetic JSDOM + fake IndexedDB, actual held transactions and aborts',limitations:'No native browser, network, server, real departure dialog or responsive-layout evidence',results,unhandledRejections:unhandled,passed:results.filter(r=>r.passed).length,failed:results.filter(r=>!r.passed).length},null,2));
if(results.some(r=>!r.passed)||unhandled.length)process.exitCode=1;
