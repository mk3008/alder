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

try {
  // Restore guards cover every source entry, including direct handler calls.
  const loading=createWindow();
  for(const id of ['open','open-url','open-text']){assert.equal(loading.$(id).disabled,true);await invoke(loading,id);}
  assert.equal(tabs(loading).length,0);assert.equal(dialogOpen(loading),false);assert.equal(loading.calls.length,0);
  await waitRestored(loading);for(const id of ['open','open-url','open-text'])assert.equal(loading.$(id).disabled,false);
  checks.push('restore blocks all three input entry points');

  const text=await ready();
  await openText(text);assert.equal(tabs(text).length,1);assert.ok(text.w.document.querySelector('.node'));assert.equal(dialogOpen(text),false);
  const initial=graph(text),key=tabs(text)[0].dataset.key;
  for(const bad of ['   ','# invalid source']){
    await openText(text,bad);assert.equal(tabs(text).length,1);assert.equal(graph(text),initial);assert.ok(dialogOpen(text));assert.equal(text.$('source-text').value,bad);assert.ok(status(text).trim());
    await invoke(text,'source-cancel');assert.equal(dialogOpen(text),false);
  }
  checks.push('text success, empty/invalid rejection and cancel preserve current graph');

  const multibyte=markdown.replace(/^# [^\n]*/, '# '+'あ'.repeat(750000));
  assert.ok(multibyte.length<2*1024*1024);assert.ok(new TextEncoder().encode(multibyte).byteLength>2*1024*1024);
  await openText(text,multibyte);assert.equal(tabs(text).length,1);assert.equal(graph(text),initial);assert.ok(dialogOpen(text));assert.match(status(text),/2MiB/);assert.equal(text.$('source-text').value,multibyte);await invoke(text,'source-cancel');
  checks.push('text size limit counts UTF-8 bytes, retaining oversized multibyte input');

  assert.equal(text.$('refresh').disabled,true);await invoke(text,'edit-markdown');assert.ok(dialogOpen(text));await invoke(text,'source-edit');assert.equal(text.$('source-text').value,markdown);
  text.$('source-text').value='# invalid edit';await submit(text);
  assert.equal(graph(text),initial);assert.equal(tabs(text)[0].dataset.key,key);assert.equal(text.$('source-text').value,'# invalid edit');assert.ok(dialogOpen(text));
  text.$('source-text').value=markdown+'\n';await submit(text);assert.equal(dialogOpen(text),false);assert.equal(tabs(text).length,1);assert.equal(tabs(text)[0].dataset.key,key);
  await invoke(text,'edit-markdown');await invoke(text,'source-edit');assert.equal(text.$('source-text').value,markdown+'\n');text.$('source-text').value='unsaved cancellation';await invoke(text,'source-cancel');
  await invoke(text,'edit-markdown');assert.equal(text.$('source-text').value,'unsaved cancellation');await invoke(text,'source-cancel');
  checks.push('text editing swaps only after parse success and closing preserves a tab-local draft');

  await invoke(text,'open-text');text.$('source-text').value='retained Escape input';
  text.$('source-dialog').dispatchEvent(new text.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));
  assert.equal(dialogOpen(text),false);assert.equal(text.$('source-text').value,'retained Escape input');assert.equal(tabs(text).length,1);
  checks.push('Escape closes text entry while retaining draft input and existing graph');

  const closedEdit=await ready();await openText(closedEdit);await invoke(closedEdit,'edit-markdown');await invoke(closedEdit,'source-edit');
  closedEdit.$('source-text').value=markdown+'\n';closedEdit.w.confirm=()=>false;await tabs(closedEdit)[0].querySelector('.close').onclick();
  assert.equal(tabs(closedEdit).length,1);assert.ok(dialogOpen(closedEdit));assert.equal(closedEdit.$('source-text').value,markdown+'\n');
  closedEdit.w.confirm=()=>true;await tabs(closedEdit)[0].querySelector('.close').onclick();await submit(closedEdit);
  assert.equal(tabs(closedEdit).length,0);assert.equal(dialogOpen(closedEdit),false);
  checks.push('tab close protects unreflected drafts; explicit discard cannot resurrect the tab');

  // Graph and drawer selection are independent from dismissing a status message.
  const beforeDismiss=graph(text);assert.ok(status(text).trim());await invoke(text,'status-close');assert.equal(status(text),'');assert.equal(text.$('status').hidden,true);assert.equal(graph(text),beforeDismiss);
  await openText(text,'invalid');assert.ok(status(text).trim());assert.equal(text.$('status-text').getAttribute('role'),'alert');assert.equal(text.$('status').dataset.kind,'error');assert.equal(text.$('status').hidden,false);await invoke(text,'source-cancel');
  const drawer=text.$('formattedMarkdownDrawer');assert.equal(drawer.hidden,false);
  await invoke(text,'drawer');assert.equal(drawer.hidden,true);assert.equal(text.$('drawer').getAttribute('aria-expanded'),'false');
  await invoke(text,'drawer');assert.equal(drawer.hidden,false);assert.equal(text.$('drawer').getAttribute('aria-expanded'),'true');
  checks.push('InfoBar dismissal preserves graph; Drawer toggle updates visibility and aria state');

  const url=await ready({fetch:async()=>response()});
  await openURL(url);assert.equal(tabs(url).length,1);assert.ok(url.w.document.querySelector('.node'));assert.equal(url.calls.length,1);
  const [requested,options]=url.calls[0];assert.equal(String(requested),'https://raw.example.test/design.md');
  assert.equal(options.credentials,'omit');assert.equal(options.referrerPolicy,'no-referrer');assert.equal(options.mode,'cors');assert.equal(options.redirect,'error');assert.ok(options.signal);
  await invoke(url,'refresh');assert.equal(url.calls.length,2);assert.equal(tabs(url).length,1);assert.equal(url.$('refresh').disabled,false);
  checks.push('HTTPS URL import and update use anonymous no-referrer CORS requests');

  // Invalid inputs must be rejected before fetch, even without native validation.
  for(const value of ['', 'http://example.test/a.md','javascript:alert(1)','file:///tmp/a.md','https://user:password@example.test/a.md']){
    const env=await ready({fetch:async()=>response()});await openURL(env,value);assert.equal(env.calls.length,0,`Fetched invalid URL: ${value}`);assert.equal(tabs(env).length,0);assert.ok(dialogOpen(env));assert.equal(env.$('source-url').value,value);env.w.close();
  }
  checks.push('empty/non-HTTPS/credential-bearing URLs are rejected before network');

  for(const [name,fetch] of [
    ['HTML content type',async()=>response('<!doctype html><title>Sign in</title>',{type:'text/html'})],
    ['HTML disguised as plain text',async()=>response('<!doctype html><html><body>login</body></html>',{type:'text/plain'})],
    ['invalid Markdown',async()=>response('# invalid')],
    ['HTTP failure',async()=>response('Not found',{status:404,type:'text/plain'})],
    ['network/CORS failure',async()=>{throw new TypeError('Failed to fetch');}],
    ['oversized Content-Length',async()=>response(markdown,{length:2*1024*1024+1})],
    ['oversized streamed body',async()=>response('x'.repeat(2*1024*1024+1))],
  ]){
    const env=await ready({fetch});await openText(env);const previous=graph(env);await openURL(env);
    assert.equal(tabs(env).length,1,name);assert.equal(graph(env),previous,name);assert.ok(status(env).trim(),name);assert.ok(dialogOpen(env),name);assert.equal(env.$('source-submit').disabled,false,name);env.w.close();
    checks.push(`URL ${name} preserves existing graph and permits retry`);
  }

  let updatingResponse=response();const failedUpdate=await ready({fetch:async()=>updatingResponse});await openURL(failedUpdate);const previous=graph(failedUpdate);
  updatingResponse=response('# invalid updated document');await invoke(failedUpdate,'refresh');assert.equal(graph(failedUpdate),previous);assert.equal(tabs(failedUpdate).length,1);assert.ok(status(failedUpdate).trim());assert.equal(failedUpdate.$('refresh').disabled,false);
  updatingResponse=response();await invoke(failedUpdate,'refresh');assert.equal(tabs(failedUpdate).length,1);
  checks.push('URL failed update retains old graph and subsequent retry succeeds');

  const pending=deferred();const slow=await ready({fetch:async()=>pending.promise});
  await invoke(slow,'open-url');slow.$('source-url').value='https://raw.example.test/design.md';const firstSubmit=submit(slow);await tick();
  assert.equal(slow.$('source-submit').disabled,true);await submit(slow);assert.equal(slow.calls.length,1);
  await invoke(slow,'source-cancel');pending.resolve(response());await firstSubmit;assert.equal(tabs(slow).length,0);assert.equal(dialogOpen(slow),false);
  checks.push('duplicate URL submission is blocked and cancel discards a late response');

  const oldRequest=deferred();const switched=await ready({fetch:async()=>oldRequest.promise});
  await invoke(switched,'open-url');switched.$('source-url').value='https://raw.example.test/old.md';const oldSubmit=submit(switched);await tick();
  await openText(switched);const activeText=tabs(switched)[0].dataset.key;oldRequest.resolve(response());await oldSubmit;
  assert.equal(tabs(switched).length,1);assert.equal(tabs(switched)[0].dataset.key,activeText);assert.equal(dialogOpen(switched),false);
  checks.push('switching URL entry to text discards stale URL completion');

  let refreshPending;const closing=await ready({fetch:async()=>refreshPending?refreshPending.promise:response()});await openURL(closing);
  refreshPending=deferred();const refreshing=invoke(closing,'refresh');await tick();await invoke(closing,'refresh');assert.equal(closing.calls.length,2);
  await tabs(closing)[0].querySelector('.close').onclick();refreshPending.resolve(response());await refreshing;
  assert.equal(tabs(closing).length,0);assert.equal(closing.w.document.querySelectorAll('.node').length,0);
  checks.push('duplicate URL refresh is blocked and closing its tab discards late result');

  let timedOut=false;const timeout=await ready({fastTimeout:true,fetch:async(_url,{signal})=>new Promise((_resolve,reject)=>{
    signal.addEventListener('abort',()=>{timedOut=true;reject(new DOMException('Aborted','AbortError'));},{once:true});
  })});await openURL(timeout);assert.equal(timedOut,true);assert.equal(tabs(timeout).length,0);assert.ok(status(timeout).trim());assert.equal(timeout.$('source-submit').disabled,false);
  checks.push('30-second URL timeout aborts request and leaves input retryable (accelerated timer model)');

  // Persist all three origins, text bodies and UI state; restore never refetches.
  const db=new IDBFactory();const one=await ready({indexedDB:db,fetch:async()=>response()});
  Object.defineProperty(one.$('fallback'),'files',{value:[file('local.md')]});await one.$('fallback').onchange();await openURL(one);await openText(one,markdown+'\n');
  await invoke(one,'theme');await invoke(one,'drawer');await flush();const snapshot=await saved(db);
  assert.equal(snapshot.tabs.length,3);assert.equal(snapshot.tabs.filter(t=>t.source?.kind==='url').length,1);assert.equal(snapshot.tabs.filter(t=>t.source?.kind==='text').length,1);
  assert.equal(snapshot.tabs.find(t=>t.source?.kind==='text').design.markdown,markdown+'\n');assert.equal(snapshot.tabs.find(t=>t.source?.kind==='url').source.url,'https://raw.example.test/design.md');
  const keys=tabs(one).map(t=>t.dataset.key);one.w.close();
  const restored=await ready({indexedDB:db});assert.deepEqual(tabs(restored).map(t=>t.dataset.key),keys);assert.equal(restored.calls.length,0);assert.equal(restored.w.document.documentElement.dataset.theme,'dark');assert.equal(restored.$('formattedMarkdownDrawer').hidden,true);
  await invoke(restored,'edit-markdown');assert.ok(dialogOpen(restored));assert.equal(restored.$('source-text').value,markdown+'\n');await invoke(restored,'source-cancel');
  checks.push('file/URL/text tabs and source bodies restore from IndexedDB without automatic network access');

  // Persistence failures must be announced as errors, not success notices.
  const assertError=(env,message)=>{assert.match(status(env),message);assert.equal(env.$('status').hidden,false);assert.equal(env.$('status').dataset.kind,'error');assert.equal(env.$('status-text').getAttribute('role'),'alert');};
  const cloneFailure=await ready();
  cloneFailure.w.structuredClone=()=>{throw new DOMException('Cannot clone modeled handle','DataCloneError');};
  await openText(cloneFailure);const cloneGraph=graph(cloneFailure);await flush();
  assertError(cloneFailure,/保存できません/);assert.equal(graph(cloneFailure),cloneGraph);assert.equal(tabs(cloneFailure).length,1);
  checks.push('structuredClone persistence failure is an error alert and preserves current graph');

  const writeFailure=await ready();let saveAttempts=0;
  writeFailure.w.indexedDB={open(){saveAttempts++;throw new DOMException('Modeled storage unavailable','UnknownError');}};
  await openText(writeFailure);const writeGraph=graph(writeFailure);await flush();
  assert.equal(saveAttempts,1);assertError(writeFailure,/保存できません/);assert.equal(graph(writeFailure),writeGraph);assert.equal(tabs(writeFailure).length,1);
  checks.push('saveSession rejection is an error alert and preserves current graph');

  const corruptDB=new IDBFactory();const seed=await ready({indexedDB:corruptDB});seed.w.close();
  await new Promise((resolve,reject)=>{
    const request=corruptDB.open('alder-web-viewer',1);request.onerror=()=>reject(request.error);
    request.onsuccess=()=>{const database=request.result;const transaction=database.transaction('session','readwrite');
      transaction.objectStore('session').put({tabs:'invalid saved session'},'current');
      transaction.oncomplete=()=>{database.close();resolve();};transaction.onerror=()=>{database.close();reject(transaction.error);};
    };
  });
  const restoreFailure=await ready({indexedDB:corruptDB});
  assertError(restoreFailure,/復元できません/);assert.equal(tabs(restoreFailure).length,0);assert.equal(restoreFailure.calls.length,0);
  for(const id of ['open','open-url','open-text'])assert.equal(restoreFailure.$(id).disabled,false);
  await openText(restoreFailure);assert.equal(tabs(restoreFailure).length,1);
  checks.push('invalid persisted session restores no graph, announces error and leaves inputs usable');

  const unsafe=markdown+'\n<script>window.pwned=true</script>\n<img src="https://invalid.test" onerror="window.pwned=true">\n[unsafe](javascript:alert(1))';
  for(const kind of ['text','url']){
    const env=await ready({fetch:async()=>response(unsafe)});if(kind==='text')await openText(env,unsafe);else await openURL(env);
    assert.equal(tabs(env).length,1);assert.equal(env.w.pwned,undefined);assert.equal(env.$('detail').querySelectorAll('script,img,a,iframe').length,0);assert.match(env.$('detail').textContent,/<script>/);env.w.close();
  }
  checks.push('text and URL Markdown keep script/image/link payloads inert');
  console.log(JSON.stringify({model:'jsdom + fake-indexeddb; direct handler calls, modeled source dialog and mocked fetch, accelerated timeout; no real network or geometry',checks,passed:checks.length},null,2));
} finally {
  for(const w of windows)w.close();
}
