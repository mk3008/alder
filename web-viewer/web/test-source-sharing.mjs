// #201 MODEL evidence: unchanged production bundles, isolated JSDOM windows,
// fake IndexedDB transactions and synthetic fetch/clipboard controls only.
// Native focus, CORS and responsive geometry are covered by the browser gate.
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {installSaveStateControls} from './test-save-state-browser.mjs';
import {concurrencyBodies,changedMarkdown,readConcurrencyRecord,seedLegacyRecord} from './test-session-concurrency-browser.mjs';

const bundle=async entry=>(await build({entryPoints:[entry],bundle:true,write:false,format:entry.endsWith('main.ts')?'iife':'esm',loader:{'.css':'empty','.md':'text'}})).outputFiles[0].text;
const code=await bundle('src/main.ts');
const sharing=await import('data:text/javascript;base64,'+Buffer.from(await bundle('src/sharing.ts')).toString('base64'));
const {validateShareSource,sourceSharingReason,createSourceShareLink,readSharedSource}=sharing;
const source='https://source-sharing.test/public/design.md',body=concurrencyBodies.shared;
const fragment=value=>'#source='+encodeURIComponent(value);
const pause=(ms=5)=>new Promise(resolve=>setTimeout(resolve,ms));
const deferred=()=>{let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});return {promise,resolve,reject};};
const response=(raw=body,{status=200,type='text/markdown',length}={})=>new Response(raw,{status,headers:{'content-type':type,...(length===undefined?{}:{'content-length':String(length)})}});
const databaseFor=url=>{const m=new URL(url).pathname.match(/\/preview\/pr-(\d+)\/([A-Za-z0-9][A-Za-z0-9._-]*)\/(?:index\.html)?$/);return m?`alder-web-viewer:preview:pr-${m[1]}:${m[2]}`:'alder-web-viewer';};
const windows=[],results=[],unhandled=[];
const rejected=error=>unhandled.push(String(error));process.on('unhandledRejection',rejected);
async function until(read,predicate,label){const end=Date.now()+5000;let latest;do{latest=await read();if(predicate(latest))return latest;await pause();}while(Date.now()<end);assert.fail(label+'; latest='+JSON.stringify(latest));}
async function env({db=new IDBFactory(),url='https://viewer-sharing.test/',seed,fetch,fastTimeout=false,failReads=false,controls={}}={}){
 const w=new JSDOM('<div id="app"></div>',{url,runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);
 w.indexedDB=db;w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;w.Response=Response;w.Headers=Headers;w.ReadableStream=ReadableStream;w.AbortController=AbortController;
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};
 w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};
 const originalTimeout=w.setTimeout.bind(w);if(fastTimeout)w.setTimeout=(fn,ms,...args)=>originalTimeout(fn,ms===30000?5:ms,...args);
 const requests=[],copies=[],replacements=[];const replace=w.history.replaceState.bind(w.history);
 w.history.replaceState=(...args)=>{replacements.push(args[2]);return replace(...args);};
 w.fetch=async(...args)=>{requests.push({args,hash:w.location.hash});if(!fetch)throw Error('External request forbidden');return fetch(...args);};
 Object.defineProperty(w.navigator,'clipboard',{configurable:true,value:{writeText:async text=>{copies.push(text);}}});
 w.eval('globalThis.__readRecord=('+readConcurrencyRecord.toString()+');globalThis.__seedRecord=('+seedLegacyRecord.toString()+');');
 const database=databaseFor(url);if(seed!==undefined)await w.__seedRecord({value:structuredClone(seed),database});
 w.eval('('+installSaveStateControls.toString()+')('+JSON.stringify({failReads,...controls})+');');
 const e={w,db,database,$:id=>w.document.getElementById(id),tabs:()=>[...w.document.querySelectorAll('.tab')],read:async()=>structuredClone(await w.__readRecord(database)),probe:w.__saveStateControl,requests,copies,replacements};
 w.eval(code);await until(()=>e.$('open-text')?.disabled,v=>v===false,'restore finishes');return e;
}
// Restore's existing migration fills an absent hiddenNodes list; every other field stays exact.
const restoredSession=session=>({...session,tabs:session.tabs.map(t=>({...t,hiddenNodes:t.hiddenNodes??[]}))});
const graph=e=>e.$('nodes').innerHTML;
const status=e=>e.$('status-text').textContent;
const input=(e,value)=>{e.$('source-text').value=value;e.$('source-text').dispatchEvent(new e.w.Event('input',{bubbles:true}));};
async function invoke(e,id){const pending=e.$(id).onclick?.(new e.w.MouseEvent('click',{cancelable:true}));if(id==='source-cancel'&&e.$('source-close-dialog').open)await e.$('source-close-confirm').onclick();await pending;}
const flush=e=>e.w.dispatchEvent(new e.w.Event('blur'));
async function saved(e){flush(e);await until(()=>e.$('app').dataset.saveState,v=>v==='saved','save completes');return e.read();}
async function openText(e){await invoke(e,'open-text');input(e,body);await invoke(e,'source-submit');await saved(e);}
async function openURL(e,url=source){await invoke(e,'open-url');e.$('source-url').value=url;await invoke(e,'source-submit');await saved(e);}
async function hash(e,value){e.w.location.hash=value;await until(()=>e.w.location.hash,v=>v==='','shared fragment consumed');}
async function allowed(e,value=true){const b=e.$('share-source');assert.ok(b,'share button exists');assert.equal(b.previousElementSibling?.id,'copy-image');assert.equal(b.previousElementSibling?.previousElementSibling?.id,'save-image');assert.equal(b.disabled,false,'reason control stays enabled');assert.ok(b.tabIndex>=0,'reason control stays keyboard-focusable');assert.equal(b.closest('.tab-strip')!==null,true);assert.equal(b.getAttribute('aria-disabled')==='true',!value);const n=e.copies.length;await invoke(e,'share-source');assert.equal(e.copies.length,n+(value?1:0));if(!value)assert.ok(status(e).trim(),'ineligible action explains why');}
async function caseOf(name,run){try{results.push({name,passed:true,...await run()});}catch(error){results.push({name,passed:false,error:error.stack});}finally{for(const w of windows.splice(0)){w.__saveStateControl?.dispose();w.close();}}}

await caseOf('source helpers accept only source-only HTTPS and preserve exact original URL',async()=>{
 const good=[source,'HTTPS://SOURCE-SHARING.TEST:443/a%2Fb.md','https://source-sharing.test/a%3Fb%23c.md','https://source-sharing.test/日本語.md'];
 for(const value of good){assert.equal(validateShareSource(value),value);assert.equal(readSharedSource(fragment(value)),value);}
 const bad=['','relative.md','//source-sharing.test/a.md','http://source-sharing.test/a.md','file:///a.md','data:text/plain,hello','javascript:alert(1)','https://name:password@source-sharing.test/a.md',source+'?',source+'?token=private',source+'#',source+'#part'];
 for(const value of bad){assert.throws(()=>validateShareSource(value),undefined,value);assert.throws(()=>readSharedSource(fragment(value)),undefined,value);}
 for(const value of ['#source=','#source=%','#source=%E0%A4%A','#source='+encodeURIComponent(source)+'&other=1','#source='+encodeURIComponent(source)+'&source='+encodeURIComponent(source)])assert.throws(()=>readSharedSource(value),undefined,value);
 for(const value of ['','#alder-sample','#unrelated','#sources=ignored'])assert.equal(readSharedSource(value),undefined);
 const link=createSourceShareLink('https://viewer.test/preview/pr-201/v7/index.html?private=viewer#alder-sample',source);
 assert.equal(link,'https://viewer.test/preview/pr-201/v7/index.html'+fragment(source));assert.equal(createSourceShareLink('https://synthetic:password@viewer.test/preview/pr-201/v7/index.html?token=synthetic#other',source),link,'viewer URL credentials must not enter the shared link');assert.equal(new URL(link).search,'');assert.equal(decodeURIComponent(new URL(link).hash.slice('#source='.length)),source);
 return {accepted:good.length,rejected:bad.length+5};
});
await caseOf('eligibility requires URL origin without any draft or applied edit',async()=>{
 const tab={source:{kind:'url',url:source}};assert.equal(sourceSharingReason(tab),undefined);assert.equal(sourceSharingReason({...tab,edited:false}),undefined);
 for(const t of [undefined,{}, {source:{kind:'text'}},{source:{kind:'sample'}},{...tab,edited:true},{...tab,draft:''},{...tab,draft:body},{source:{kind:'url',url:source+'?'}},{source:{kind:'url',url:source+'#'}}])assert.equal(typeof sourceSharingReason(t),'string');
});
await caseOf('ineligible empty, text, file, sample and query-bearing sources explain without writing clipboard',async()=>{
 const e=await env({fetch:async()=>response()});await allowed(e,false);await openText(e);await allowed(e,false);
 Object.defineProperty(e.$('fallback'),'files',{configurable:true,value:[{name:'local.md',text:async()=>body}]});await e.$('fallback').onchange();await saved(e);await allowed(e,false);
 await invoke(e,'open-sample');await saved(e);await allowed(e,false);
 for(const url of [source+'?token=example',source+'?',source+'#part',source+'#']){await openURL(e,url);await allowed(e,false);}
 assert.equal(e.copies.length,0);
});
await caseOf('clipboard link retains preview path and contains only source URL, independent of local state',async()=>{
 const e=await env({url:'https://viewer.test/preview/pr-201/v7/index.html?viewer=private#alder-sample',fetch:async()=>response()});await openText(e);await openURL(e);e.$('theme').click();e.$('drawer').click();await saved(e);
 const before=await e.read(),requests=e.requests.length;await allowed(e);assert.equal(e.copies[0],'https://viewer.test/preview/pr-201/v7/index.html'+fragment(source));assert.equal(e.requests.length,requests);assert.deepEqual(await e.read(),before,'sharing is read-only');
 assert.doesNotMatch(e.copies[0],/viewer=|markdown|positions|draft|selected|token|generation/);
});
await caseOf('editor opening remains eligible, draft immediately blocks, Apply remains edited through restore, refresh restores eligibility',async()=>{
 const e=await env({fetch:async()=>response()});await openURL(e);await invoke(e,'edit-markdown');await allowed(e);input(e,changedMarkdown);await allowed(e,false);await invoke(e,'source-cancel');await saved(e);await allowed(e,false);
 const draft=await env({db:e.db,fetch:async()=>response()});assert.equal(draft.requests.length,0);await allowed(draft,false);await invoke(draft,'edit-markdown');assert.equal(draft.$('source-text').value,changedMarkdown);await invoke(draft,'source-submit');await saved(draft);await allowed(draft,false);
 const applied=await env({db:e.db,fetch:async()=>response()});assert.equal(applied.requests.length,0);await allowed(applied,false);applied.w.confirm=()=>true;await invoke(applied,'refresh');await saved(applied);assert.equal(applied.requests.length,1);await allowed(applied);assert.equal((await applied.read()).current.tabs[0].edited,false);
});
await caseOf('exact draft revert restores eligibility before Apply',async()=>{const e=await env({fetch:async()=>response()});await openURL(e);await invoke(e,'edit-markdown');input(e,changedMarkdown);await allowed(e,false);input(e,body);await allowed(e);});
await caseOf('clipboard rejection and missing API report failure without source or storage changes',async()=>{
 const e=await env({fetch:async()=>response()});await openURL(e);const before=await e.read(),old=graph(e),requests=e.requests.length;
 Object.defineProperty(e.w.navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('synthetic clipboard denial');}}});await invoke(e,'share-source');assert.equal(e.$('status').dataset.kind,'error');assert.ok(status(e).trim());
 Object.defineProperty(e.w.navigator,'clipboard',{configurable:true,value:undefined});await invoke(e,'share-source');assert.equal(e.$('status').dataset.kind,'error');assert.deepEqual(await e.read(),before);assert.equal(graph(e),old);assert.equal(e.requests.length,requests);
});
await caseOf('initial fragment consumed before anonymous request; durable success adds exactly one tab and never refetches on restore',async()=>{
 const e=await env({url:'https://viewer.test/?keep=viewer'+fragment(source),fetch:async()=>response()});await until(()=>e.tabs().length,n=>n===1,'shared document appears');const record=await saved(e);
 assert.equal(e.w.location.hash,'');assert.equal(e.w.location.search,'?keep=viewer');assert.equal(e.replacements.length,1);assert.equal(e.requests.length,1);assert.equal(e.requests[0].hash,'');
 const [url,options]=e.requests[0].args;assert.equal(url,source);assert.equal(options.method,'GET');assert.equal(options.credentials,'omit');assert.equal(options.mode,'cors');assert.equal(options.redirect,'error');assert.equal(options.referrerPolicy,'no-referrer');assert.match(options.headers.Accept,/text\/markdown/);assert.ok(options.signal);
 assert.equal(record.current.tabs.length,1);assert.equal(record.current.tabs[0].source.url,source);assert.equal(record.current.tabs[0].design.markdown,body);assert.equal(record.generation,1);
 const restored=await env({db:e.db,url:e.w.location.href});assert.equal(restored.requests.length,0);assert.equal(restored.tabs().length,1);assert.deepEqual(await restored.read(),record);await allowed(restored);
});
await caseOf('same-page shared source revisit reuses its tab without fetching or changing stored document',async()=>{
 const e=await env({url:'https://viewer.test/'+fragment(source),fetch:async()=>response()});await until(()=>e.tabs().length,n=>n===1,'initial shared import');const before=await saved(e);await hash(e,fragment(source));await until(()=>e.$('open-text').disabled,v=>v===false,'revisit finishes');await pause(230);const after=await saved(e);
 assert.equal(e.requests.length,1,'revisiting an existing source must not fetch');assert.equal(e.tabs().length,1,'revisiting an existing source must not add a tab');assert.deepEqual(after.current,before.current);assert.equal(e.w.location.hash,'');
});
await caseOf('full share navigation restores and selects the same edited source, draft and saved view',async()=>{
 const e=await env({fetch:async()=>response()});await openURL(e);await invoke(e,'edit-markdown');input(e,changedMarkdown);await invoke(e,'source-submit');await saved(e);await invoke(e,'edit-markdown');const draft=changedMarkdown+'\nUnapplied local draft.\n';input(e,draft);await invoke(e,'source-cancel');e.$('theme').click();e.$('drawer').click();e.$('in').click();await saved(e);await openText(e);const before=await e.read(),key=before.current.tabs[0].key;
 const restored=await env({db:e.db,url:'https://viewer.test/'+fragment(source),fetch:async()=>{throw Error('original host now unavailable');}});await until(()=>restored.w.location.hash,v=>v==='','revisited fragment consumed');await until(()=>restored.$('open-text').disabled,v=>v===false,'existing source selection finishes');const after=await saved(restored);
 assert.equal(restored.requests.length,0,'restored source is selected without refetch');assert.equal(restored.tabs().length,2);assert.equal(after.current.active,key);assert.deepEqual(after.current,{...restoredSession(before.current),active:key},'all document, draft and session view data stay intact');assert.equal(after.current.tabs[0].design.markdown,changedMarkdown);assert.equal(after.current.tabs[0].draft,draft);assert.equal(after.current.tabs[0].edited,true);assert.equal(after.current.tabs[0].zoom,1.2);await invoke(restored,'edit-markdown');assert.equal(restored.$('source-text').value,draft);await allowed(restored,false);
 const reload=await env({db:e.db,url:restored.w.location.href});assert.equal(reload.requests.length,0);assert.deepEqual((await reload.read()).current,after.current);
});
await caseOf('same-page revisit selects existing source while another tab is active and host is unavailable',async()=>{
 let unavailable=false;const e=await env({fetch:async()=>{if(unavailable)throw Error('synthetic offline host');return response();}});await openURL(e);await openText(e);const before=await e.read(),key=before.current.tabs[0].key;unavailable=true;await hash(e,fragment(source));await until(()=>e.$('open-text').disabled,v=>v===false,'revisit ends');const after=await saved(e);
 assert.equal(e.requests.length,1);assert.equal(e.tabs().length,2);assert.equal(after.current.active,key);assert.deepEqual(after.current,{...before.current,active:key});
});
await caseOf('revisit of active edited source keeps its open editor and still-unsaved draft',async()=>{
 const e=await env({fetch:async()=>response()});await openURL(e);await invoke(e,'edit-markdown');input(e,changedMarkdown);await invoke(e,'source-submit');await saved(e);await invoke(e,'edit-markdown');const draft=changedMarkdown+'\nPending editor contents.\n',before=await e.read(),writeCount=e.probe.writes.length;e.probe.holdWrites=true;input(e,draft);await hash(e,fragment(source));await until(()=>e.probe.writes.length,n=>n===writeCount+1,'unsaved draft transaction held');
 assert.equal(e.requests.length,1);assert.equal(e.tabs().length,1);assert.equal(e.$('source-dialog').hidden,false);assert.equal(e.$('source-text').value,draft);assert.equal(e.probe.writes[writeCount].complete,false,'draft is still uncommitted at revisit');assert.equal(e.$('source-close-dialog').open,false);e.probe.holdWrites=false;e.probe.writes[writeCount].release();const after=await saved(e);assert.deepEqual(after.current,{...before.current,tabs:before.current.tabs.map(t=>({...t,draft}))});
});
await caseOf('same basename from different exact source URLs remains separate',async()=>{
 const other='https://source-sharing.test/other/design.md',e=await env({fetch:async()=>response()});await openURL(e);const first=(await e.read()).current.tabs[0];await hash(e,fragment(other));await until(()=>e.tabs().length,n=>n===2,'different URL imports');const before=await saved(e);assert.equal(before.current.tabs[0].name,before.current.tabs[1].name);assert.notEqual(before.current.tabs[0].key,before.current.tabs[1].key);assert.deepEqual(e.requests.map(r=>r.args[0]),[source,other]);await hash(e,fragment(source));await until(()=>e.$('open-text').disabled,v=>v===false,'first source is selected');const after=await saved(e);assert.equal(e.requests.length,2);assert.equal(e.tabs().length,2);assert.equal(after.current.active,first.key);assert.deepEqual(after.current.tabs,before.current.tabs);
});
await caseOf('same source queued during first atomic import selects the committed tab without second fetch or save',async()=>{
 const e=await env({fetch:async()=>response()});await openText(e);const before=await e.read();e.probe.holdWrites=true;await hash(e,fragment(source));await until(()=>e.probe.writes.length,n=>n===2,'first import transaction held');await hash(e,fragment(source));await hash(e,fragment(source));assert.equal(e.requests.length,1);assert.equal(e.tabs().length,1);assert.equal(e.probe.writes.length,2);e.probe.writes[1].release();await until(()=>e.tabs().length,n=>n===2,'first import publishes');await pause(230);
 assert.equal(e.requests.length,1,'queued same source must reuse newly committed tab');assert.equal(e.probe.writes.length,2,'no duplicate import transaction');const after=await saved(e);assert.equal(after.current.tabs.length,2);assert.equal(after.current.active,after.current.tabs[1].key);assert.equal(after.current.tabs[1].source.url,source);assert.equal(after.generation,before.generation+1);
});
await caseOf('existing source supersedes in-flight different shared source without fetch or late publication',async()=>{
 const pending=deferred(),other='https://source-sharing.test/public/pending.md',e=await env({fetch:async url=>url===other?pending.promise:response()});await openURL(e);await openText(e);const before=await e.read(),key=before.current.tabs[0].key;await hash(e,fragment(other));await until(()=>e.requests.length,n=>n===2,'other fetch begins');await hash(e,fragment(source));pending.resolve(response(changedMarkdown));await until(()=>e.$('open-text').disabled,v=>v===false,'superseding selection completes');await pause(230);const after=await saved(e);
 assert.equal(e.requests.length,2);assert.equal(e.requests[1].args[1].signal.aborted,true);assert.equal(e.tabs().length,2);assert.equal(after.current.active,key);assert.deepEqual(after.current,{...before.current,active:key});
});
await caseOf('revisit to a different existing source saves the current editor draft before switching',async()=>{
 const other='https://source-sharing.test/public/other.md',e=await env({fetch:async()=>response()});await openURL(e);await openURL(e,other);const key=(await e.read()).current.tabs[0].key;await invoke(e,'edit-markdown');input(e,changedMarkdown);
 const writeCount=e.probe.writes.length;e.probe.holdWrites=true;await hash(e,fragment(source));await until(()=>e.probe.writes.length,n=>n===writeCount+1,'draft save held');assert.equal(e.tabs()[1].classList.contains('active'),true,'active tab stays until draft commits');assert.equal(e.$('source-dialog').hidden,false);e.probe.writes[writeCount].release();await until(()=>e.$('source-dialog').hidden,v=>v===true,'saved editor closes');e.probe.holdWrites=false;const after=await saved(e);assert.equal(e.requests.length,2);assert.equal(e.tabs().length,2);assert.equal(after.current.active,key);assert.equal(after.current.tabs[1].draft,changedMarkdown);assert.equal(after.current.tabs[1].design.markdown,body);
});
await caseOf('pending explicit Close confirmation keeps editor and active source when Keep Editing cancels shared revisit',async()=>{
 const other='https://source-sharing.test/public/other.md',e=await env({fetch:async()=>response()});await openURL(e);await openURL(e,other);const before=await e.read(),old=graph(e);await invoke(e,'edit-markdown');input(e,changedMarkdown);
 const close=e.$('source-cancel').onclick(new e.w.MouseEvent('click',{cancelable:true}));assert.equal(e.$('source-close-dialog').open,true);await hash(e,fragment(source));await pause(230);assert.equal(e.$('source-dialog').hidden,false,'shared revisit must wait for the open Close confirmation');assert.equal(e.$('source-close-dialog').open,true);assert.equal(e.tabs()[1].classList.contains('active'),true);assert.equal(e.$('source-text').value,changedMarkdown);
 await invoke(e,'source-close-continue');assert.equal(await close,false);await pause(230);const after=await saved(e);assert.equal(e.$('source-dialog').hidden,false);assert.equal(e.$('source-close-dialog').open,false);assert.equal(e.$('source-text').value,changedMarkdown);assert.equal(e.tabs()[1].classList.contains('active'),true);assert.equal(graph(e),old);assert.equal(e.requests.length,2);assert.equal(e.tabs().length,2);assert.deepEqual(after.current,{...before.current,tabs:before.current.tabs.map((t,i)=>i===1?{...t,draft:changedMarkdown}:t)});
});
await caseOf('pending Escape confirmation saves draft then closes both dialogs before selecting existing shared source',async()=>{
 const other='https://source-sharing.test/public/other.md',e=await env({fetch:async()=>response()});await openURL(e);await openURL(e,other);const before=await e.read(),key=before.current.tabs[0].key;await invoke(e,'edit-markdown');input(e,changedMarkdown);e.$('source-text').dispatchEvent(new e.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));assert.equal(e.$('source-close-dialog').open,true);
 await hash(e,fragment(source));await pause(230);assert.equal(e.$('source-dialog').hidden,false,'shared revisit must wait for the open Escape confirmation');assert.equal(e.$('source-close-dialog').open,true);assert.equal(e.tabs()[1].classList.contains('active'),true);await saved(e);const writeCount=e.probe.writes.length;e.probe.holdWrites=true;const confirm=invoke(e,'source-close-confirm');await until(()=>e.probe.writes.length,n=>n===writeCount+1,'confirmed draft save held');assert.equal(e.$('source-dialog').hidden,false);assert.equal(e.$('source-close-dialog').open,true);assert.equal(e.tabs()[1].classList.contains('active'),true);assert.equal(e.$('source-text').value,changedMarkdown);
 e.probe.holdWrites=false;e.probe.writes[writeCount].release();await confirm;await until(()=>e.tabs()[0].classList.contains('active'),Boolean,'shared source selected after confirmation commits');const after=await saved(e);assert.equal(e.$('source-dialog').hidden,true);assert.equal(e.$('source-close-dialog').open,false);assert.equal(e.requests.length,2);assert.equal(e.tabs().length,2);assert.deepEqual(after.current,{...before.current,active:key,tabs:before.current.tabs.map((t,i)=>i===1?{...t,draft:changedMarkdown}:t)});
});
await caseOf('latest existing-source hash wins while one explicit Close confirmation is pending',async()=>{
 const other='https://source-sharing.test/public/other.md',third='https://source-sharing.test/public/third.md',e=await env({fetch:async()=>response()});await openURL(e);await openURL(e,third);await openURL(e,other);const before=await e.read(),key=before.current.tabs[1].key;await invoke(e,'edit-markdown');input(e,changedMarkdown);const close=e.$('source-cancel').onclick(new e.w.MouseEvent('click',{cancelable:true}));assert.equal(e.$('source-close-dialog').open,true);
 await hash(e,fragment(source));await hash(e,fragment(third));await pause(230);assert.equal(e.$('source-dialog').hidden,false,'both revisits must wait for the same pending confirmation');assert.equal(e.$('source-close-dialog').open,true);assert.equal(e.tabs()[2].classList.contains('active'),true);await invoke(e,'source-close-confirm');assert.equal(await close,true);await until(()=>e.tabs()[1].classList.contains('active'),Boolean,'latest existing source selected');const after=await saved(e);assert.equal(e.$('source-dialog').hidden,true);assert.equal(e.$('source-close-dialog').open,false);assert.equal(e.requests.length,3);assert.equal(e.tabs().length,3);assert.deepEqual(after.current,{...before.current,active:key,tabs:before.current.tabs.map((t,i)=>i===2?{...t,draft:changedMarkdown}:t)});
});
for(const [navigation,expectedHash] of [['#unrelated','#unrelated'],['#','']])await caseOf('non-source '+(expectedHash||'empty fragment')+' navigation cancels existing-source revisit awaiting Close confirmation',async()=>{
 const other='https://source-sharing.test/public/other.md',e=await env({fetch:async()=>response()});await openURL(e);await openURL(e,other);const before=await e.read(),old=graph(e);await invoke(e,'edit-markdown');input(e,changedMarkdown);const close=e.$('source-cancel').onclick(new e.w.MouseEvent('click',{cancelable:true}));assert.equal(e.$('source-close-dialog').open,true);await saved(e);await hash(e,fragment(source));
 // Clear a real nonempty hash; the silent history setup does not notify the product.
 let observed=false;if(navigation==='#')e.w.history.replaceState(e.w.history.state,'',e.w.location.pathname+e.w.location.search+'#before-clear');e.w.addEventListener('hashchange',()=>{observed=true;},{once:true});e.w.location.hash=navigation==='#'?'':navigation;await until(()=>observed,v=>v===true,'actual non-source hashchange delivered');assert.equal(e.w.location.hash,expectedHash);assert.equal(e.$('source-close-dialog').open,true);assert.equal(e.$('source-dialog').hidden,false);assert.equal(e.tabs()[1].classList.contains('active'),true);await invoke(e,'source-close-confirm');assert.equal(await close,true);await pause(230);const after=await saved(e);
 assert.equal(e.$('source-dialog').hidden,true);assert.equal(e.$('source-close-dialog').open,false);assert.equal(e.w.location.hash,expectedHash);assert.equal(e.requests.length,2);assert.equal(e.tabs().length,2);assert.equal(e.tabs()[1].classList.contains('active'),true,'non-source navigation must invalidate the pending existing-source selection');assert.equal(graph(e),old);assert.deepEqual(after.current,{...before.current,tabs:before.current.tabs.map((t,i)=>i===1?{...t,draft:changedMarkdown}:t)});
});
await caseOf('failed draft save prevents existing-source switch and keeps editor, graph and stored session',async()=>{
 const other='https://source-sharing.test/public/other.md',e=await env({fetch:async()=>response()});await openURL(e);await openURL(e,other);const before=await e.read(),old=graph(e);await invoke(e,'edit-markdown');input(e,changedMarkdown);e.probe.failWrites=1;await hash(e,fragment(source));await until(()=>e.$('app').dataset.saveState,v=>v==='error','draft save failure is reported');assert.equal(e.requests.length,2);assert.equal(e.tabs().length,2);assert.equal(e.tabs()[1].classList.contains('active'),true);assert.equal(e.$('source-dialog').hidden,false);assert.equal(e.$('source-text').value,changedMarkdown);assert.equal(graph(e),old);assert.deepEqual(await e.read(),before);await pause(230);assert.deepEqual(await e.read(),before,'failed switch does not silently save or select later');
});
await caseOf('legacy duplicate source tabs remain intact and revisiting never creates a third copy',async()=>{
 const initial=await env({fetch:async()=>response()});await openURL(initial);const original=(await initial.read()).current,first=original.tabs[0],duplicate={...structuredClone(first),key:'synthetic-legacy-duplicate',edited:true,draft:changedMarkdown},seed={...original,tabs:[first,duplicate],active:duplicate.key};
 const e=await env({seed,url:'https://viewer.test/'+fragment(source)});await until(()=>e.w.location.hash,v=>v==='','legacy source link consumed');const after=await saved(e);assert.equal(e.requests.length,0);assert.equal(e.tabs().length,2);assert.deepEqual(after.current.tabs,restoredSession(seed).tabs,'existing legacy copies must not be merged or deleted');assert.ok(seed.tabs.some(t=>t.key===after.current.active));
});
await caseOf('hashchange keeps existing tabs and current DB untouched until shared import transaction commits',async()=>{
 const e=await env({fetch:async()=>response(changedMarkdown)});await openText(e);const before=await e.read(),old=graph(e);e.probe.holdWrites=true;await hash(e,fragment(source));await until(()=>e.probe.writes.length,n=>n===2,'shared transaction starts');assert.equal(e.tabs().length,1);assert.equal(graph(e),old);assert.equal(e.probe.writes[1].complete,false);
 e.probe.writes[1].release();await until(()=>e.tabs().length,n=>n===2,'shared commit is published');const after=await saved(e);assert.deepEqual(after.current.tabs[0],before.current.tabs[0]);assert.equal(after.current.tabs[1].design.markdown,changedMarkdown);assert.equal(after.generation,before.generation+1);assert.equal(e.requests.length,1);
});
for(const invalid of ['#source=%','#source=',fragment('http://source-sharing.test/a.md'),fragment(source+'?'),fragment(source+'#'),fragment('https://name:pass@source-sharing.test/a.md')])await caseOf('invalid shared fragment '+invalid+' is consumed, explained and never fetched',async()=>{
 const e=await env();await openText(e);const before=await e.read(),old=graph(e);await hash(e,invalid);await until(()=>status(e),Boolean,'invalid source error');assert.equal(e.requests.length,0);assert.equal(e.tabs().length,1);assert.equal(graph(e),old);assert.deepEqual(await e.read(),before);await pause(220);assert.equal(e.requests.length,0);
});
for(const [name,fetch,fastTimeout] of [
 ['HTTP 404',async()=>response('missing',{status:404})],['CORS/network',async()=>{throw new TypeError('synthetic CORS failure');}],['redirect',async()=>{throw new TypeError('redirect error');}],
 ['HTML type',async()=>response('<html>login</html>',{type:'text/html'})],['HTML disguised as text',async()=>response('<!doctype html><html>login</html>',{type:'text/plain'})],['JSON type',async()=>response('{}',{type:'application/json'})],['invalid graph',async()=>response('# invalid')],
 ['oversized header',async()=>response(body,{length:2*1024*1024+1})],['oversized stream',async()=>response('x'.repeat(2*1024*1024+1))],
 ['timeout',async(_url,{signal})=>new Promise((_resolve,reject)=>{signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError')),{once:true});}),true],
])await caseOf('shared '+name+' failure preserves prior memory/storage and has no automatic retry',async()=>{
 const e=await env({fetch,fastTimeout});await openText(e);const before=await e.read(),old=graph(e);await hash(e,fragment(source));await until(()=>status(e),Boolean,'shared error is shown');assert.equal(e.w.location.hash,'');assert.equal(e.tabs().length,1);assert.equal(graph(e),old);assert.deepEqual(await e.read(),before);await pause(230);assert.equal(e.requests.length,1);assert.deepEqual(await e.read(),before);
 const restored=await env({db:e.db});assert.equal(restored.requests.length,0);assert.equal(restored.tabs().length,1);assert.deepEqual(await restored.read(),before);
});
for(const fault of ['Error','QuotaExceededError','abort'])await caseOf('shared '+fault+' storage failure publishes no failed tab and preserves session/generation',async()=>{
 const e=await env({fetch:async()=>response(changedMarkdown)});await openText(e);const before=await e.read(),old=graph(e);
 if(fault==='abort')e.probe.holdWrites=true;else{e.probe.failWriteName=fault;e.probe.failWrites=1;}
 await hash(e,fragment(source));if(fault==='abort'){await until(()=>e.probe.writes.length,n=>n===2,'shared transaction starts');e.probe.writes[1].abort();}
 await until(()=>status(e),Boolean,'storage failure shown');assert.equal(e.tabs().length,1);assert.equal(graph(e),old);assert.deepEqual(await e.read(),before);await pause(230);assert.equal(e.requests.length,1);assert.deepEqual(await e.read(),before,'failed import cannot be automatically saved later');
});
await caseOf('protected restore cannot overwrite original stored bytes when opening a shared source',async()=>{
 const seed={tabs:'corrupt existing record',privateMarker:'synthetic retained bytes'},e=await env({seed,url:'https://viewer.test/'+fragment(source),fetch:async()=>response()});await until(()=>e.w.location.hash,v=>v==='','protected fragment consumed');await pause(230);assert.equal(e.$('app').dataset.saveState,'protected');assert.equal(e.tabs().length,0);assert.deepEqual((await e.read()).current,seed);assert.equal(e.probe.writes.length,0);
});
await caseOf('stale shared import cannot overwrite a newer same-origin session',async()=>{
 const first=await env();await openText(first);const stale=await env({db:first.db,fetch:async()=>response(changedMarkdown)}),old=graph(stale);first.$('theme').click();const winner=await saved(first);await hash(stale,fragment(source));await until(()=>stale.$('app').dataset.saveState,v=>v==='conflict','stale import detects conflict');assert.equal(stale.tabs().length,1);assert.equal(graph(stale),old);assert.deepEqual(await stale.read(),winner);await pause(230);assert.equal(stale.requests.length,1);assert.deepEqual(await stale.read(),winner);
});
await caseOf('rapid incoming hashes ignore late obsolete response and import latest source once',async()=>{
 const pending=deferred(),newSource='https://source-sharing.test/public/latest.md';const e=await env({fetch:async url=>url===source?pending.promise:response(changedMarkdown)});await openText(e);await hash(e,fragment(source));await until(()=>e.requests.length,n=>n===1,'first request starts');await hash(e,fragment(newSource));await until(()=>e.requests.length,n=>n===2,'latest request starts');pending.resolve(response());await until(()=>e.tabs().length,n=>n===2,'latest shared document appears');await pause(230);const record=await saved(e);assert.equal(e.tabs().length,2);assert.equal(record.current.tabs[1].source.url,newSource);assert.equal(record.current.tabs.some(t=>t.source?.url===source),false);assert.equal(e.requests[0].args[1].signal.aborted,true);assert.ok(e.requests.every(r=>r.hash===''));
});
await caseOf('incoming hashes during held shared commit retain only latest queued source without interrupting atomic save',async()=>{
 const b='https://source-sharing.test/public/superseded.md',c='https://source-sharing.test/public/last.md';const e=await env({fetch:async()=>response()});await openText(e);const before=await e.read();e.probe.holdWrites=true;
 await hash(e,fragment(source));await until(()=>e.probe.writes.length,n=>n===2,'A reaches held transaction');await hash(e,fragment(b));await hash(e,fragment(c));assert.deepEqual(e.requests.map(r=>r.args[0]),[source]);assert.equal(e.tabs().length,1);
 e.probe.writes[1].release();await until(()=>e.probe.writes.length,n=>n===3,'latest queued source reaches held transaction');assert.deepEqual(e.requests.map(r=>r.args[0]),[source,c]);assert.equal(e.tabs().length,2,'A publishes only after its own commit');e.probe.writes[2].release();await until(()=>e.tabs().length,n=>n===3,'C publishes after its own commit');const after=await saved(e);assert.deepEqual(after.current.tabs.map(t=>t.source?.url).filter(Boolean),[source,c]);assert.equal(after.current.active,after.current.tabs[2].key);assert.equal(after.generation,before.generation+2);assert.ok(e.requests.every(r=>r.hash===''));assert.equal(e.w.location.hash,'');
});
await caseOf('unrelated hash cancels queued source during commit without canceling atomic save',async()=>{
 const c='https://source-sharing.test/public/queued.md',e=await env({fetch:async()=>response()});await openText(e);const before=await e.read();e.probe.holdWrites=true;await hash(e,fragment(source));await until(()=>e.probe.writes.length,n=>n===2,'shared commit held');await hash(e,fragment(c));e.w.location.hash='#unrelated';await pause(30);e.probe.writes[1].release();await until(()=>e.tabs().length,n=>n===2,'first source commits');await pause(230);const after=await saved(e);assert.equal(e.w.location.hash,'#unrelated');assert.deepEqual(e.requests.map(r=>r.args[0]),[source]);assert.equal(after.current.tabs.length,2);assert.equal(after.current.tabs[1].source.url,source);assert.equal(after.generation,before.generation+1);
});
await caseOf('shared source queued during Apply drains only after edited document commits',async()=>{
 const e=await env({fetch:async()=>response()});await openText(e);await invoke(e,'edit-markdown');input(e,changedMarkdown);e.probe.holdWrites=true;const apply=invoke(e,'source-submit');await until(()=>e.probe.writes.length,n=>n===2,'Apply transaction held');await hash(e,fragment(source));assert.equal(e.requests.length,0);e.probe.writes[1].release();await apply;await until(()=>e.probe.writes.length,n=>n===3,'queued share transaction held');assert.equal(e.requests.length,1);e.probe.writes[2].release();await until(()=>e.tabs().length,n=>n===2,'queued share commits');const after=await saved(e);assert.equal(after.current.tabs[0].design.markdown,changedMarkdown);assert.equal(after.current.tabs[0].edited,true);assert.equal(after.current.tabs[1].source.url,source);assert.equal(after.generation,3);
});
await caseOf('existing sample and unrelated hashes are ignored by sharing, including hashchange',async()=>{
 const e=await env({url:'https://viewer.test/#alder-sample'});assert.equal(e.requests.length,0);assert.equal(e.w.location.hash,'#alder-sample');await invoke(e,'open-sample');await saved(e);assert.equal(e.tabs().length,1);await allowed(e,false);const before=await e.read();e.w.location.hash='#unrelated';await pause(30);assert.equal(e.w.location.hash,'#unrelated');assert.equal(e.requests.length,0);assert.deepEqual(await e.read(),before);
});

process.off('unhandledRejection',rejected);
console.log(JSON.stringify({model:'Unchanged production bundles; synthetic JSDOM/fake IndexedDB, mocked clipboard/network, actual transaction hold/abort; accelerated timeout',limitations:'No native browser, actual clipboard permission, real CORS server or responsive geometry evidence',results,unhandledRejections:unhandled,passed:results.filter(r=>r.passed).length,failed:results.filter(r=>!r.passed).length},null,2));
if(results.some(r=>!r.passed)||unhandled.length)process.exitCode=1;
