import {documentControls,readDocumentRecord} from './document-test-view.mjs';
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
const documentOrder=[],windows=[],results=[],unhandled=[];
const rejected=error=>unhandled.push(String(error));process.on('unhandledRejection',rejected);
async function until(read,predicate,label){const end=Date.now()+5000;let latest;do{latest=await read();if(predicate(latest))return latest;await pause();}while(Date.now()<end);assert.fail(label+'; latest='+JSON.stringify(latest));}
async function env({db=new IDBFactory(),url='https://viewer-sharing.test/',seed,fetch,fastTimeout=false,failReads=false,controls={}}={}){
 const w=new JSDOM('<div id="app"></div>',{url,runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);
 w.__testDocumentOrder=documentOrder;w.indexedDB=db;w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;w.Response=Response;w.Headers=Headers;w.ReadableStream=ReadableStream;w.AbortController=AbortController;
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};
 w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};
 const originalTimeout=w.setTimeout.bind(w);if(fastTimeout)w.setTimeout=(fn,ms,...args)=>originalTimeout(fn,ms===30000?5:ms,...args);
 const requests=[],copies=[],replacements=[];const replace=w.history.replaceState.bind(w.history);
 w.history.replaceState=(...args)=>{replacements.push(args[2]);return replace(...args);};
 w.fetch=async(...args)=>{requests.push({args,hash:w.location.hash});if(!fetch)throw Error('External request forbidden');return fetch(...args);};
 Object.defineProperty(w.navigator,'clipboard',{configurable:true,value:{writeText:async text=>{copies.push(text);}}});
 w.eval('globalThis.__readRecord=('+readDocumentRecord.toString()+');globalThis.__seedRecord=('+seedLegacyRecord.toString()+');');
 const database=databaseFor(url);if(seed!==undefined){const {documents,...settings}=seed;await w.__seedRecord({value:structuredClone(documents===undefined?seed:{...settings,tabs:documents}),database});}
 w.eval('('+installSaveStateControls.toString()+')('+JSON.stringify({failReads,...controls})+');');
 const e={w,db,database,$:id=>w.document.getElementById(id),documents:()=>documentControls(w),read:async()=>structuredClone(await w.__readRecord(database)),probe:w.__saveStateControl,requests,copies,replacements};
 w.eval(code);await until(()=>e.$('open-text')?.disabled,v=>v===false,'restore finishes');return e;
}
// Restore's existing migration fills an absent hiddenNodes list; every other field stays exact.
const restoredSession=session=>({...session,documents:session.documents.map(t=>({...t,hiddenNodes:t.hiddenNodes??[]}))});
const graph=e=>e.$('nodes').innerHTML;
const status=e=>e.$('status-text').textContent;
const input=(e,value)=>{e.$('source-text').value=value;e.$('source-text').dispatchEvent(new e.w.Event('input',{bubbles:true}));};
async function invoke(e,id){const pending=e.$(id).onclick?.(new e.w.MouseEvent('click',{cancelable:true}));if(id==='source-cancel'&&e.$('source-close-dialog')?.open)await e.$('source-close-confirm').onclick();await pending;}
const flush=e=>e.w.dispatchEvent(new e.w.Event('blur'));
async function saved(e){assert.equal(e.w.document.querySelectorAll('.tab').length,e.documents().length?1:0,'one live overall view; other originals stay in recovery');flush(e);await until(()=>e.$('app').dataset.saveState,v=>v==='saved','save completes');return e.read();}
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
await caseOf('clipboard rejection and missing API report failure without source or storage changes',async()=>{
 const e=await env({fetch:async()=>response()});await openURL(e);const before=await e.read(),old=graph(e),requests=e.requests.length;
 Object.defineProperty(e.w.navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('synthetic clipboard denial');}}});await invoke(e,'share-source');assert.equal(e.$('status').dataset.kind,'error');assert.ok(status(e).trim());
 Object.defineProperty(e.w.navigator,'clipboard',{configurable:true,value:undefined});await invoke(e,'share-source');assert.equal(e.$('status').dataset.kind,'error');assert.deepEqual(await e.read(),before);assert.equal(graph(e),old);assert.equal(e.requests.length,requests);
});
await caseOf('latest shared request wins without retaining obsolete body generations',async()=>{
 const pending=deferred(),last='https://source-sharing.test/public/latest.md',e=await env({fetch:async url=>url===source?pending.promise:response(changedMarkdown)});await openText(e);await hash(e,fragment(source));await until(()=>e.requests.length,n=>n===1,'first request');await hash(e,fragment(last));await until(()=>e.requests.length,n=>n===2,'latest request');pending.resolve(response());await until(()=>e.$('app').dataset.saveState,v=>v==='saved','latest committed');await pause(230);const after=await e.read();assert.equal(after.current.documents.length,1);assert.equal(after.current.documents[0].source.url,last);assert.equal(after.current.documents[0].design.markdown,changedMarkdown);assert.equal(after.current.urlHistory.length,1);assert.equal(e.requests[0].args[1].signal.aborted,true);
});
await caseOf('hashes during atomic import keep only latest queued source and preserve the commit boundary',async()=>{
 const superseded='https://source-sharing.test/public/superseded.md',last='https://source-sharing.test/public/latest.md',e=await env({fetch:async()=>response()});await openText(e);const before=await e.read();e.probe.holdWrites=true;await hash(e,fragment(source));await until(()=>e.probe.writes.length,n=>n===2,'first import held');await hash(e,fragment(superseded));await hash(e,fragment(last));assert.equal(e.requests.length,1);assert.equal(e.probe.writes[1].complete,false,'uncommitted import remains held');e.probe.writes[1].release();await until(()=>e.probe.writes.length,n=>n===3,'last import held');assert.deepEqual(e.requests.map(r=>r.args[0]),[source,last]);e.probe.holdWrites=false;e.probe.writes[2].release();const after=await saved(e);assert.equal(after.current.documents.length,1);assert.equal(after.current.documents[0].source.url,last);assert.deepEqual(after.current.urlHistory.map(v=>v.url),[last,source]);assert.equal(after.generation,before.generation+2);
});
for(const invalid of ['#source=%','#source=',fragment('http://source-sharing.test/a.md'),fragment(source+'?'),fragment(source+'#'),fragment('https://name:pass@source-sharing.test/a.md')])await caseOf('invalid shared fragment '+invalid+' is consumed, explained and never fetched',async()=>{
 const e=await env();await openText(e);const before=await e.read(),old=graph(e);await hash(e,invalid);await until(()=>status(e),Boolean,'invalid source error');assert.equal(e.requests.length,0);assert.equal(e.documents().length,1);assert.equal(graph(e),old);assert.deepEqual(await e.read(),before);await pause(220);assert.equal(e.requests.length,0);
});
for(const [name,fetch,fastTimeout] of [
 ['HTTP 404',async()=>response('missing',{status:404})],['CORS/network',async()=>{throw new TypeError('synthetic CORS failure');}],['redirect',async()=>{throw new TypeError('redirect error');}],
 ['HTML type',async()=>response('<html>login</html>',{type:'text/html'})],['HTML disguised as text',async()=>response('<!doctype html><html>login</html>',{type:'text/plain'})],['JSON type',async()=>response('{}',{type:'application/json'})],['invalid graph',async()=>response('# invalid')],
 ['oversized header',async()=>response(body,{length:2*1024*1024+1})],['oversized stream',async()=>response('x'.repeat(2*1024*1024+1))],
 ['timeout',async(_url,{signal})=>new Promise((_resolve,reject)=>{signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError')),{once:true});}),true],
])await caseOf('shared '+name+' failure preserves prior memory/storage and has no automatic retry',async()=>{
 const e=await env({fetch,fastTimeout});await openText(e);const before=await e.read(),old=graph(e);await hash(e,fragment(source));await until(()=>status(e),Boolean,'shared error is shown');assert.equal(e.w.location.hash,'');assert.equal(e.documents().length,1);assert.equal(graph(e),old);assert.deepEqual(await e.read(),before);await pause(230);assert.equal(e.requests.length,1);assert.deepEqual(await e.read(),before);
 const restored=await env({db:e.db});assert.equal(restored.requests.length,0);assert.equal(restored.documents().length,1);assert.deepEqual(await restored.read(),before);
});
for(const fault of ['Error','QuotaExceededError','abort'])await caseOf('shared '+fault+' storage failure publishes no failed tab and preserves session/generation',async()=>{
 const e=await env({fetch:async()=>response(changedMarkdown)});await openText(e);const before=await e.read(),old=graph(e);
 if(fault==='abort')e.probe.holdWrites=true;else{e.probe.failWriteName=fault;e.probe.failWrites=1;}
 await hash(e,fragment(source));if(fault==='abort'){await until(()=>e.probe.writes.length,n=>n===2,'shared transaction starts');e.probe.writes[1].abort();}
 await until(()=>status(e),Boolean,'storage failure shown');assert.equal(e.documents().length,1);assert.equal(graph(e),old);assert.deepEqual(await e.read(),before);await pause(230);assert.equal(e.requests.length,1);assert.deepEqual(await e.read(),before,'failed import cannot be automatically saved later');
});
await caseOf('protected restore cannot overwrite original stored bytes when opening a shared source',async()=>{
 const seed={documents:'corrupt existing record',privateMarker:'synthetic retained bytes'},e=await env({seed,url:'https://viewer.test/'+fragment(source),fetch:async()=>response()});await until(()=>e.w.location.hash,v=>v==='','protected fragment consumed');await pause(230);assert.equal(e.$('app').dataset.saveState,'protected');assert.equal(e.documents().length,0);assert.deepEqual((await e.read()).current,seed);assert.equal(e.probe.writes.length,0);
});
await caseOf('stale shared import cannot overwrite a newer same-origin session',async()=>{
 const first=await env();await openText(first);const stale=await env({db:first.db,fetch:async()=>response(changedMarkdown)}),old=graph(stale);first.$('theme').click();const winner=await saved(first);await hash(stale,fragment(source));await until(()=>stale.$('app').dataset.saveState,v=>v==='conflict','stale import detects conflict');assert.equal(stale.documents().length,1);assert.equal(graph(stale),old);assert.deepEqual(await stale.read(),winner);await pause(230);assert.equal(stale.requests.length,1);assert.deepEqual(await stale.read(),winner);
});
await caseOf('existing sample and unrelated hashes are ignored by sharing, including hashchange',async()=>{
 const e=await env({url:'https://viewer.test/#alder-sample'});assert.equal(e.requests.length,0);assert.equal(e.w.location.hash,'#alder-sample');await invoke(e,'open-sample');await saved(e);assert.equal(e.documents().length,1);await allowed(e,false);const before=await e.read();e.w.location.hash='#unrelated';await pause(30);assert.equal(e.w.location.hash,'#unrelated');assert.equal(e.requests.length,0);assert.deepEqual(await e.read(),before);
});

process.off('unhandledRejection',rejected);
console.log(JSON.stringify({model:'Unchanged production bundles; synthetic JSDOM/fake IndexedDB, mocked clipboard/network, actual transaction hold/abort; accelerated timeout',limitations:'No native browser, actual clipboard permission, real CORS server or responsive geometry evidence',results,unhandledRejections:unhandled,passed:results.filter(r=>r.passed).length,failed:results.filter(r=>!r.passed).length},null,2));
if(results.some(r=>!r.passed)||unhandled.length)process.exitCode=1;
