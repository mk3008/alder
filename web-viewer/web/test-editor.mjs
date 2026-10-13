// DOM/IndexedDB MODEL regression tests, not a real-browser test.
// Handlers may be called directly; source dialog, fetch, file handles and timers
// are modeled. CORS enforcement, focus trapping and overlay geometry need the
// separate browser suite. No network request is made by this suite.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {build} from 'esbuild';

const markdown=readFileSync(new URL('./authorities/business-design.md',import.meta.url),'utf8');
const {outputFiles}=await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}});
const code=outputFiles[0].text;
const tick=()=>new Promise(resolve=>setTimeout(resolve,25));
const deferred=()=>{let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});return {promise,resolve,reject};};
const file=(name,text=markdown)=>({name,text:async()=>text});
const checks=[];
const windows=[];
function createWindow({indexedDB=new IDBFactory(),fetch,fastTimeout=false}={}){
  const dom=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true});
  const w=dom.window,calls=[];
  w.indexedDB=indexedDB;w.structuredClone=structuredClone;
  w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;w.Response=Response;w.Headers=Headers;w.ReadableStream=ReadableStream;w.AbortController=AbortController;
  w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};
  const originalTimeout=w.setTimeout.bind(w);
  if(fastTimeout)w.setTimeout=(fn,ms,...args)=>originalTimeout(fn,ms===30000?1:ms,...args);
  w.fetch=async(...args)=>{calls.push(args);if(!fetch)throw new Error('Unexpected network request');return fetch(...args);};
  w.eval(code);windows.push(w);
  return {w,dom,calls,$:id=>w.document.getElementById(id)};
}
async function waitRestored(env){const end=Date.now()+3000;while(env.$('open-text').disabled&&Date.now()<end)await tick();assert.equal(env.$('open-text').disabled,false,'IndexedDB restoration must finish');return env;}
async function ready(options){return waitRestored(createWindow(options));}
const tabs=env=>Array.from(env.w.document.querySelectorAll('.tab'));
const graph=env=>env.$('nodes').innerHTML;
const dialogOpen=env=>!env.$('source-dialog').hidden;
const status=env=>env.$('status-text').textContent;
async function invoke(env,id){const button=env.$(id);assert.ok(button,`Missing #${id}`);if(typeof button.onclick==='function')await button.onclick(new env.w.MouseEvent('click',{cancelable:true}));else button.click();}
async function submit(env){
  const button=env.$('source-submit');
  if(typeof button.onclick==='function')await button.onclick(new env.w.MouseEvent('click',{cancelable:true}));
  else if(button.form?.onsubmit)await button.form.onsubmit(new env.w.Event('submit',{cancelable:true}));
  else {button.click();await tick();}
}
async function openText(env,value=markdown){await invoke(env,'open-text');assert.ok(dialogOpen(env));env.$('source-text').value=value;await submit(env);}
async function openURL(env,value='https://raw.example.test/design.md'){await invoke(env,'open-url');assert.ok(dialogOpen(env));env.$('source-url').value=value;await submit(env);}
function response(body=markdown,{type='text/markdown',status=200,url='https://raw.example.test/design.md',length}={}){
  const headers={'content-type':type};if(length!==undefined)headers['content-length']=String(length);
  const result=new Response(body,{status,headers});Object.defineProperty(result,'url',{value:url});return result;
}
async function saved(indexedDB){return new Promise((resolve,reject)=>{const request=indexedDB.open('alder-web-viewer',1);request.onerror=()=>reject(request.error);request.onsuccess=()=>{const db=request.result;const get=db.transaction('session').objectStore('session').get('current');get.onsuccess=()=>{db.close();resolve(get.result);};get.onerror=()=>{db.close();reject(get.error);};};});}
async function flush(){await new Promise(resolve=>setTimeout(resolve,260));}


const extra=name=>`\n# Object ${name}\n\n## Scope\n\ntrue\n\n## Icon\n\nbox\n\n## Information\n\n- edited locally\n`;
const edited=markdown+extra('Editor A'),twice=edited+extra('Editor B');
const input=(env,value)=>{env.$('source-text').value=value;env.$('source-text').dispatchEvent(new env.w.Event('input',{bubbles:true}));};
const edit=async env=>{env.$('edit-markdown').focus();await invoke(env,'edit-markdown');assert.equal(env.w.document.activeElement,env.$('source-text'));assert.equal(env.$('source-text').readOnly,true);assert.equal(env.$('source-submit').hidden,true);await invoke(env,'source-edit');assert.equal(env.$('source-text').readOnly,false);assert.equal(env.$('source-submit').textContent,'図に反映');};
const local=async(env,name='local.md')=>{Object.defineProperty(env.$('fallback'),'files',{value:[file(name)],configurable:true});await env.$('fallback').onchange();};
try {
 for(const origin of ['file','url','text']){
  const db=new IDBFactory(),env=await ready({indexedDB:db,fetch:async()=>response()});
  if(origin==='file')await local(env);else if(origin==='url')await openURL(env);else await openText(env);
  const key=tabs(env)[0].dataset.key,count=env.$('nodes').children.length,requests=env.calls.length;
  const initialIDs=new Set([...env.$('nodes').children].map(n=>n.dataset.node));const coordinates=()=>[...env.$('nodes').children].filter(n=>initialIDs.has(n.dataset.node)).map(n=>[n.dataset.node,n.style.left,n.style.top]);const before=coordinates();
  await edit(env);assert.equal(env.$('source-text').value,markdown);input(env,edited);await submit(env);
  assert.equal(dialogOpen(env),false);assert.equal(env.w.document.activeElement,env.$('edit-markdown'));assert.equal(env.$('nodes').children.length,count+1);assert.equal(tabs(env)[0].dataset.key,key);assert.deepEqual(coordinates(),before);assert.equal(env.calls.length,requests);
  let snapshot=await saved(db);assert.equal(snapshot.tabs[0].design.markdown,edited);assert.equal(snapshot.tabs[0].edited,true);assert.equal(snapshot.tabs[0].draft,undefined);
  if(origin==='url')assert.equal(snapshot.tabs[0].source.url,'https://raw.example.test/design.md');
  if(origin==='file')assert.equal(snapshot.tabs[0].name,'local.md');
  await edit(env);assert.equal(env.$('source-text').value,edited);input(env,twice);await submit(env);assert.equal(env.$('nodes').children.length,count+2);assert.equal(tabs(env).length,1);
  snapshot=await saved(db);assert.equal(snapshot.tabs[0].design.markdown,twice);env.w.close();
  const restored=await ready({indexedDB:db});await edit(restored);assert.equal(restored.$('source-text').value,twice);assert.equal(restored.calls.length,0);assert.equal(restored.$('nodes').children.length,count+2);restored.w.close();
  checks.push(`${origin}: common read/edit, two apply cycles, stable key/coordinates, full Markdown persisted before completion, restore without fetch or source writes`);
 }
 const db=new IDBFactory(),env=await ready({indexedDB:db});await local(env,'first.md');await edit(env);input(env,'invalid draft A');await invoke(env,'source-cancel');
 assert.equal(dialogOpen(env),false);assert.equal((await saved(db)).tabs[0].draft,'invalid draft A');
 await openText(env);const second=tabs(env)[1].dataset.key;await edit(env);input(env,'invalid draft B');
 await tabs(env)[0].querySelector('button').onclick();assert.equal(dialogOpen(env),false);await invoke(env,'edit-markdown');assert.equal(env.$('source-text').value,'invalid draft A');
 await invoke(env,'source-cancel');await tabs(env).find(t=>t.dataset.key===second).querySelector('button').onclick();await invoke(env,'edit-markdown');assert.equal(env.$('source-text').value,'invalid draft B');
 await invoke(env,'source-cancel');env.w.close();const restored=await ready({indexedDB:db});await invoke(restored,'edit-markdown');assert.equal(restored.$('source-text').value,'invalid draft B');
 await invoke(restored,'source-cancel');await tabs(restored)[0].querySelector('button').onclick();await invoke(restored,'edit-markdown');assert.equal(restored.$('source-text').value,'invalid draft A');restored.w.close();
 checks.push('drafts survive close, tab switching, separate new text entry and reload without cross-tab mixing');

 const errors=await ready();await openText(errors);const previous=graph(errors),key=tabs(errors)[0].dataset.key;await edit(errors);
 for(const raw of ['# invalid','あ'.repeat(750000)]){input(errors,raw);await submit(errors);assert.equal(graph(errors),previous);assert.equal(errors.$('source-text').value,raw);assert.ok(dialogOpen(errors));assert.equal(errors.$('source-text').disabled,false);}
 input(errors,edited);const originalClone=errors.w.structuredClone;errors.w.structuredClone=()=>{throw Error('synthetic clone failure');};await submit(errors);assert.equal(graph(errors),previous);assert.equal(errors.$('source-text').value,edited);assert.ok(dialogOpen(errors));assert.equal(tabs(errors)[0].dataset.key,key);errors.w.structuredClone=originalClone;
 const originalDB=errors.w.indexedDB;errors.w.indexedDB={open(){throw Error('synthetic write failure');}};await submit(errors);assert.equal(graph(errors),previous);assert.equal(errors.$('source-text').value,edited);assert.ok(dialogOpen(errors));await invoke(errors,'source-cancel');assert.ok(dialogOpen(errors));assert.equal(graph(errors),previous);
 errors.w.indexedDB=originalDB;await submit(errors);assert.equal(dialogOpen(errors),false);assert.notEqual(graph(errors),previous);assert.equal((await saved(originalDB)).tabs[0].design.markdown,edited);errors.w.close();
 checks.push('invalid/over-2MiB input, clone failure and storage failure preserve old Graph and draft; explicit retry succeeds; failed close retains editor');

 let result=response();const url=await ready({fetch:async()=>{if(result instanceof Error)throw result;return result;}});await openURL(url);await edit(url);input(url,edited);await submit(url);await edit(url);input(url,'unreflected draft');
 let confirmations=0;url.w.confirm=()=>{confirmations++;return false;};const before=graph(url),requests=url.calls.length;await invoke(url,'refresh');assert.equal(confirmations,1);assert.equal(url.calls.length,requests);assert.equal(graph(url),before);assert.equal(url.$('source-text').value,'unreflected draft');
 url.w.confirm=()=>{confirmations++;return true;};
 for(const responseOrError of [new TypeError('network failure'),response('# invalid refreshed source')]){result=responseOrError;await invoke(url,'refresh');assert.equal(graph(url),before);await invoke(url,'edit-markdown');assert.equal(url.$('source-text').value,'unreflected draft');}
 const dbBefore=url.w.indexedDB;url.w.indexedDB={open(){throw Error('synthetic refresh save failure');}};result=response();await invoke(url,'refresh');assert.equal(graph(url),before);await invoke(url,'edit-markdown');assert.equal(url.$('source-text').value,'unreflected draft');
 url.w.indexedDB=dbBefore;result=response();await invoke(url,'refresh');await invoke(url,'edit-markdown');assert.equal(url.$('source-text').value,markdown);const final=await saved(dbBefore);assert.equal(final.tabs[0].draft,undefined);assert.equal(final.tabs[0].edited,false);assert.equal(final.tabs[0].source.url,'https://raw.example.test/design.md');url.w.close();
 checks.push('refresh confirmation precedes fetch; denial/network/parse/save failure preserve edited Graph and draft; successful confirmed refresh clears dirty state only after save');

 let pending;const slow=await ready({fetch:async()=>pending?pending.promise:response()});await openURL(slow);await edit(slow);input(slow,edited);await submit(slow);slow.w.confirm=()=>true;
 pending=deferred();const refresh=invoke(slow,'refresh');await tick();assert.equal(slow.$('edit-markdown').disabled,true);await invoke(slow,'edit-markdown');assert.equal(dialogOpen(slow),false);
 await tabs(slow)[0].querySelector('.close').onclick();pending.resolve(response());await refresh;assert.equal(tabs(slow).length,0);assert.equal(slow.$('nodes').children.length,0);slow.w.close();
 checks.push('pending source refresh prevents same-tab editor and cannot resurrect a closed tab');


 const guarded=await ready();await openText(guarded);await edit(guarded);input(guarded,'unsaved unload draft');
 const leaving=()=>{const event=new guarded.w.Event('beforeunload',{cancelable:true});guarded.w.dispatchEvent(event);return event.defaultPrevented;};
 assert.equal(leaving(),true,'leaving before draft save must request browser confirmation');
 await invoke(guarded,'source-cancel');assert.equal(leaving(),false,'durably saved draft no longer blocks navigation');
 await edit(guarded);input(guarded,markdown);assert.equal(leaving(),true,'clearing an old saved draft must also be saved');await invoke(guarded,'source-cancel');assert.equal(leaving(),false);
 assert.equal((await saved(guarded.w.indexedDB)).tabs[0].draft,undefined);guarded.w.close();
 checks.push('beforeunload guard covers pending draft saves and draft removal; successful explicit close acknowledges durable save');

 const pendingSave=await ready();await openText(pendingSave);await flush();await edit(pendingSave);input(pendingSave,edited);
 const durableDB=pendingSave.w.indexedDB,gate=deferred();let pendingTransactions=0;
 pendingSave.w.indexedDB={open(...args){
  const real=durableDB.open(...args),request={};
  real.onerror=()=>{request.error=real.error;request.onerror?.();};
  real.onsuccess=()=>{const db=real.result;request.result={close:()=>db.close(),transaction(...args){
   const tx=db.transaction(...args);if(args[1]==='readwrite'){let complete;Object.defineProperty(tx,'oncomplete',{set(callback){complete=callback;}});tx.addEventListener('complete',()=>{pendingTransactions++;gate.promise.then(()=>complete?.());});}return tx;
  }};request.onsuccess?.();};return request;
 }};
 const pendingApply=submit(pendingSave);await tick();assert.equal(pendingTransactions,1);assert.equal(pendingSave.$('source-submit').disabled,true);assert.equal(pendingSave.$('source-text').disabled,true);
 const graphBefore=graph(pendingSave);await submit(pendingSave);await invoke(pendingSave,'source-cancel');await invoke(pendingSave,'open-text');await tabs(pendingSave)[0].querySelector('.close').onclick();
 assert.equal(pendingTransactions,1);assert.equal(graph(pendingSave),graphBefore);assert.equal(tabs(pendingSave).length,1);assert.ok(dialogOpen(pendingSave));
 gate.resolve();await pendingApply;assert.equal(dialogOpen(pendingSave),false);assert.equal((await saved(durableDB)).tabs[0].design.markdown,edited);assert.notEqual(graph(pendingSave),graphBefore);pendingSave.w.close();
 checks.push('pending save blocks duplicate apply, conflicting source entry, close and draft changes until the persisted Graph swap completes');


 const closeFirst=await ready();await openText(closeFirst);await openText(closeFirst);await edit(closeFirst);input(closeFirst,edited);await flush();
 const closeDB=closeFirst.w.indexedDB,closeGate=deferred();let closeTransactions=0;
 closeFirst.w.indexedDB={open(...args){
  const real=closeDB.open(...args),request={};real.onerror=()=>{request.error=real.error;request.onerror?.();};
  real.onsuccess=()=>{const db=real.result;request.result={close:()=>db.close(),transaction(...args){
   const tx=db.transaction(...args);if(args[1]==='readwrite'){const first=++closeTransactions===1;let complete;Object.defineProperty(tx,'oncomplete',{set(callback){complete=callback;}});tx.addEventListener('complete',()=>{if(first)closeGate.promise.then(()=>complete?.());else complete?.();});}return tx;
  }};request.onsuccess?.();};return request;
 }};
 const closedKey=tabs(closeFirst)[0].dataset.key,closing=tabs(closeFirst)[0].querySelector('.close').onclick();await tick();assert.equal(closeTransactions,1);
 assert.equal(closeFirst.$('source-submit').disabled,true);assert.equal(closeFirst.$('source-text').disabled,true);
 await submit(closeFirst);assert.equal(closeTransactions,1,'apply must not enqueue a snapshot containing the closing tab');
 closeGate.resolve();await closing;assert.equal(tabs(closeFirst).length,1);assert.equal(closeFirst.$('source-submit').disabled,false);assert.equal(closeFirst.$('source-text').value,edited);
 await submit(closeFirst);await flush();const afterClose=await saved(closeDB);assert.equal(afterClose.tabs.length,1);assert.equal(afterClose.tabs.some(t=>t.key===closedKey),false);assert.equal(afterClose.tabs[0].design.markdown,edited);closeFirst.w.close();
 checks.push('close-A then apply-B cannot resurrect closed A in IndexedDB; editor unblocks and B can apply after close completion');

 const inert=await ready();await openText(inert);await edit(inert);input(inert,edited+'\n<script>window.pwned=true</script>\n<img src="https://invalid.test" onerror="window.pwned=true">');await submit(inert);assert.equal(inert.w.pwned,undefined);assert.equal(inert.$('detail').querySelectorAll('script,img,iframe,a').length,0);assert.equal(inert.calls.length,0);inert.w.close();
 checks.push('edited script/image markup remains inert with zero automatic network');
 console.log(JSON.stringify({model:'jsdom/fake IndexedDB with synthetic file and mocked URL; no real network or OS picker',passed:checks.length,checks},null,2));
} finally {for(const w of windows)w.close();}
