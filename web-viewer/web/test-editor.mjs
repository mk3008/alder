import {withTestGroups} from './document-test-view.mjs';
import {joinedSession} from './session-test-view.mjs';
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
  // Model dialog state only; native modality, focus isolation and geometry are separate browser evidence.
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};
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
async function invoke(env,id){const button=env.$(id);assert.ok(button,`Missing #${id}`);if(typeof button.onclick==='function'){const pending=button.onclick(new env.w.MouseEvent('click',{cancelable:true}));if(id==='source-cancel'&&env.$('source-close-dialog').open)await env.$('source-close-confirm').onclick();await pending;}else button.click();}
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
async function saved(indexedDB,raw=false){return new Promise((resolve,reject)=>{const request=indexedDB.open('alder-web-viewer',1);request.onerror=()=>reject(request.error);request.onsuccess=()=>{const db=request.result;const get=db.transaction('session').objectStore('session').get('current');get.onsuccess=()=>{db.close();resolve(raw?get.result:joinedSession(get.result));};get.onerror=()=>{db.close();reject(get.error);};};});}
async function flush(){await new Promise(resolve=>setTimeout(resolve,260));}


const extra=name=>`\n# Object ${name}\n\n## Scope\n\ntrue\n\n## Icon\n\nbox\n\n## Information\n\n- edited locally\n`;
const edited=markdown+extra('Editor A'),twice=edited+extra('Editor B');
const input=(env,value)=>{env.$('source-text').value=value;env.$('source-text').dispatchEvent(new env.w.Event('input',{bubbles:true}));};
const edit=async env=>{env.$('edit-markdown').focus();await invoke(env,'edit-markdown');assert.equal(env.w.document.activeElement,env.$('source-text'));assert.equal(env.$('source-submit').hidden,false);assert.equal(env.$('source-edit'),null);assert.equal(env.$('source-state'),null);assert.equal(env.$('source-text').readOnly,false);assert.equal(env.$('source-submit').textContent,'反映する');assert.equal(env.$('source-help').textContent,'元ファイルやURLは書き換えません。','editor help contains only the source-file safety note');};
const local=async(env,name='local.md')=>{Object.defineProperty(env.$('fallback'),'files',{value:[file(name)],configurable:true});await env.$('fallback').onchange();};
try {
 for(const origin of ['file','url','text']){
  const db=new IDBFactory(),env=await ready({indexedDB:db,fetch:async()=>response()});
  if(origin==='file')await local(env);else if(origin==='url')await openURL(env);else await openText(env);
  const key=tabs(env)[0].dataset.key,count=env.$('nodes').children.length,requests=env.calls.length;
  const initialIDs=new Set([...env.$('nodes').children].map(n=>n.dataset.node));const coordinates=()=>[...env.$('nodes').children].filter(n=>initialIDs.has(n.dataset.node)).map(n=>[n.dataset.node,n.style.left,n.style.top]);const before=coordinates();
  await edit(env);assert.equal(env.$('source-text').value,markdown);assert.equal(env.$('source-submit').disabled,true);
  await submit(env);assert.ok(dialogOpen(env));assert.deepEqual(coordinates(),before,'unchanged submit is a no-op');
  input(env,edited);assert.equal(env.$('source-submit').disabled,false);
  input(env,markdown);assert.equal(env.$('source-submit').disabled,true,'exact revert clears dirty state');
  input(env,markdown+'\n');assert.equal(env.$('source-submit').disabled,false,'whitespace differences are real edits');
  input(env,edited);await submit(env);
  assert.equal(dialogOpen(env),false);assert.equal(env.w.document.activeElement,env.$('edit-markdown'));assert.equal(env.$('nodes').children.length,count+1);assert.equal(tabs(env)[0].dataset.key,key);assert.deepEqual(coordinates(),before);assert.equal(env.calls.length,requests);
  let snapshot=await saved(db);assert.equal(snapshot.tabs[0].design.markdown,edited);assert.equal(snapshot.tabs[0].edited,true);assert.equal(snapshot.tabs[0].draft,undefined);
  if(origin==='url')assert.equal(snapshot.tabs[0].source.url,'https://raw.example.test/design.md');
  if(origin==='file')assert.equal(snapshot.tabs[0].name,'local.md');
  await edit(env);assert.equal(env.$('source-text').value,edited);assert.equal(env.$('source-submit').disabled,true,'successful apply resets dirty state');input(env,twice);await submit(env);assert.equal(env.$('nodes').children.length,count+2);assert.equal(tabs(env).length,1);
  snapshot=await saved(db);assert.equal(snapshot.tabs[0].design.markdown,twice);env.w.close();
  const restored=await ready({indexedDB:db});await edit(restored);assert.equal(restored.$('source-text').value,twice);assert.equal(restored.$('source-submit').disabled,true);assert.equal(restored.calls.length,0);assert.equal(restored.$('nodes').children.length,count+2);restored.w.close();
  checks.push(`${origin}: direct common editor; unchanged/reverted disabled; whitespace dirty; two apply cycles, stable key/coordinates, full Markdown persisted before completion, restore without fetch or source writes`);
 }
 const crlf=await ready({fetch:async()=>response(markdown.replace(/\n/g,'\r\n'))});await openURL(crlf);await edit(crlf);
 assert.equal(crlf.$('source-submit').disabled,true,'CRLF normalization alone is not a change');
 input(crlf,edited);assert.equal(crlf.$('source-submit').disabled,false);input(crlf,markdown);assert.equal(crlf.$('source-submit').disabled,true);
 await invoke(crlf,'source-cancel');await flush();assert.equal((await saved(crlf.w.indexedDB)).tabs[0].draft,undefined);crlf.w.close();
 checks.push('CRLF sources remain clean when opened and reverted without changing stored source');
 const db=new IDBFactory(),env=await ready({indexedDB:db});await local(env,'first.md');await edit(env);input(env,'invalid draft A');await invoke(env,'source-cancel');
 assert.equal(dialogOpen(env),false);assert.equal((await saved(db)).tabs[0].draft,'invalid draft A');
 await openText(env);const second=tabs(env)[0].dataset.key;await edit(env);input(env,'invalid draft B');
 const recover=async(e,key)=>{const row=[...e.w.document.querySelectorAll('[data-document-key]')].find(n=>n.dataset.documentKey===key);assert.ok(row);await row.querySelector('button').onclick();};
 const first=[...env.w.document.querySelectorAll('[data-document-key]')][0].dataset.documentKey;
 await recover(env,first);assert.equal(dialogOpen(env),false);await invoke(env,'edit-markdown');assert.equal(env.$('source-text').value,'invalid draft A');
 await invoke(env,'source-cancel');await recover(env,second);await invoke(env,'edit-markdown');assert.equal(env.$('source-text').value,'invalid draft B');
 await invoke(env,'source-cancel');env.w.close();const restored=await ready({indexedDB:db});await invoke(restored,'edit-markdown');assert.equal(restored.$('source-text').value,'invalid draft B');
 await invoke(restored,'source-cancel');await recover(restored,first);await invoke(restored,'edit-markdown');assert.equal(restored.$('source-text').value,'invalid draft A');assert.equal(tabs(restored).length,1);restored.w.close();
 checks.push('drafts survive close, tab switching, separate new text entry and reload without cross-tab mixing');

 const errors=await ready();await openText(errors);const previous=graph(errors),key=tabs(errors)[0].dataset.key;await edit(errors);
 for(const raw of ['# invalid','あ'.repeat(750000)]){input(errors,raw);await submit(errors);assert.equal(graph(errors),previous);assert.equal(errors.$('source-text').value,raw);assert.match(status(errors),/入力と旧表示を保持しています/,'parse failure still explains retained input');assert.ok(dialogOpen(errors));assert.equal(errors.$('source-text').disabled,false);assert.equal(errors.$('source-submit').disabled,false,'invalid draft remains available to fix and retry');}
 input(errors,edited);const originalClone=errors.w.structuredClone;errors.w.structuredClone=()=>{throw Error('synthetic clone failure');};await submit(errors);assert.equal(graph(errors),previous);assert.equal(errors.$('source-text').value,edited);assert.match(status(errors),/保存できません/);assert.equal(errors.$('status').dataset.key,'storage');assert.equal(errors.$('save-actions').hidden,false);assert.ok(dialogOpen(errors));assert.equal(tabs(errors)[0].dataset.key,key);errors.w.structuredClone=originalClone;
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
 await openText(slow);pending.resolve(response());await refresh;assert.equal(tabs(slow).length,1);assert.equal((await saved(slow.w.indexedDB)).tabs[0].source.kind,'text');assert.equal(slow.$('nodes').children.length,markdown.match(/^# (?:Activity|Object) /gm).length);slow.w.close();
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


 const closeFirst=await ready();const activities=[...markdown.matchAll(/^# Activity (.+)$/gm)].map(m=>m[1]);const grouped=raw=>withTestGroups(raw,[['First',[activities[0]]],['Second',[activities[1]]]]);await openText(closeFirst,grouped(markdown));closeFirst.$('nodes').querySelector('[data-group=First]').click();await tabs(closeFirst)[0].querySelector('button').onclick();closeFirst.$('nodes').querySelector('[data-group=Second]').click();await edit(closeFirst);input(closeFirst,grouped(edited));await flush();
 const closeDB=closeFirst.w.indexedDB,closeGate=deferred();let closeTransactions=0;
 closeFirst.w.indexedDB={open(...args){
  const real=closeDB.open(...args),request={};real.onerror=()=>{request.error=real.error;request.onerror?.();};
  real.onsuccess=()=>{const db=real.result;request.result={close:()=>db.close(),transaction(...args){
   const tx=db.transaction(...args);if(args[1]==='readwrite'){const first=++closeTransactions===1;let complete;Object.defineProperty(tx,'oncomplete',{set(callback){complete=callback;}});tx.addEventListener('complete',()=>{if(first)closeGate.promise.then(()=>complete?.());else complete?.();});}return tx;
  }};request.onsuccess?.();};return request;
 }};
 const closedKey=tabs(closeFirst)[1].dataset.key,closing=tabs(closeFirst)[1].querySelector('.close').onclick();await tick();assert.equal(closeTransactions,1);
 assert.equal(closeFirst.$('source-submit').disabled,true);assert.equal(closeFirst.$('source-text').disabled,true);
 await submit(closeFirst);assert.equal(closeTransactions,1,'apply must not enqueue a snapshot containing the closing tab');
 closeGate.resolve();await closing;assert.equal(tabs(closeFirst).length,2);assert.equal(closeFirst.$('source-submit').disabled,false);assert.equal(closeFirst.$('source-text').value,grouped(edited));
 await submit(closeFirst);await flush();const afterClose=await saved(closeDB);assert.equal(afterClose.tabs.length,2);assert.equal(afterClose.tabs.some(t=>t.key===closedKey),false);assert.equal(afterClose.tabs[0].design.markdown,grouped(edited));closeFirst.w.close();
 checks.push('close-A then apply-B cannot resurrect closed A in IndexedDB; editor unblocks and B can apply after close completion');

 const inert=await ready();await openText(inert);await edit(inert);input(inert,edited+'\n<script>window.pwned=true</script>\n<img src="https://invalid.test" onerror="window.pwned=true">');await submit(inert);assert.equal(inert.w.pwned,undefined);assert.equal(inert.$('detail').querySelectorAll('script,img,iframe,a').length,0);assert.equal(inert.calls.length,0);inert.w.close();
 checks.push('edited script/image markup remains inert with zero automatic network');
 // Invoke Close directly so these regressions observe the decision instead of
 // using the compatibility helper above, which accepts prompts for older flows.
 const requestClose=env=>env.$('source-cancel').onclick(new env.w.MouseEvent('click',{cancelable:true}));
 const selection=env=>{const text=env.$('source-text');return [text.selectionStart,text.selectionEnd,text.selectionDirection];};
 const blankLineDraft=markdown+'\n';
 const confirmation=await ready();await openText(confirmation);await edit(confirmation);input(confirmation,blankLineDraft);
 confirmation.$('source-text').setSelectionRange(3,17,'backward');
 const originalSelection=selection(confirmation),originalGraph=graph(confirmation),prompt=confirmation.$('source-close-dialog');
 const continued=requestClose(confirmation);
 assert.equal(prompt.open,true,'a blank-line-only edit must prompt on explicit Close');
 assert.equal(confirmation.$('source-close-message').textContent,'グラフには反映されません。編集内容は保持されます。閉じますか？');
 assert.equal(prompt.getAttribute('aria-labelledby'),'source-close-message');
 assert.deepEqual([...prompt.querySelectorAll('button')].map(button=>[button.id,button.textContent]),[
  ['source-close-confirm','閉じる'],['source-close-continue','編集を続ける']
 ],'the confirmation offers exactly two named choices');
 assert.equal(confirmation.w.document.activeElement,confirmation.$('source-close-continue'),'Continue is the default focus');
 assert.equal(requestClose(confirmation),continued,'repeated Close shares the outstanding decision promise');
 await invoke(confirmation,'source-close-continue');assert.equal(await continued,false);
 assert.equal(prompt.open,false);assert.ok(dialogOpen(confirmation));assert.equal(confirmation.$('source-text').value,blankLineDraft);
 assert.deepEqual(selection(confirmation),originalSelection);assert.equal(confirmation.w.document.activeElement,confirmation.$('source-text'));
 assert.equal(graph(confirmation),originalGraph);assert.equal(confirmation.$('source-submit').disabled,false);
 await flush();const continuedSnapshot=await saved(confirmation.w.indexedDB);
 assert.equal(continuedSnapshot.tabs[0].draft,blankLineDraft);assert.equal(continuedSnapshot.tabs[0].design.markdown,markdown);
 checks.push('blank-line Close shows exact two-choice confirmation with Continue focused; duplicate Close shares a promise; Continue preserves editor, draft, selection, focus and Graph');

 confirmation.$('source-text').setSelectionRange(5,21,'forward');const escapeSelection=selection(confirmation);
 const editorEscape=new confirmation.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true});
 confirmation.$('source-text').dispatchEvent(editorEscape);
 assert.equal(editorEscape.defaultPrevented,true);assert.equal(prompt.open,true,'editor Escape uses the same confirmation');
 const cancelled=requestClose(confirmation),cancelEvent=new confirmation.w.Event('cancel',{cancelable:true});
 prompt.dispatchEvent(cancelEvent);assert.equal(cancelEvent.defaultPrevented,true);assert.equal(await cancelled,false);
 assert.equal(prompt.open,false);assert.ok(dialogOpen(confirmation));assert.equal(confirmation.$('source-text').value,blankLineDraft);
 assert.deepEqual(selection(confirmation),escapeSelection);assert.equal(confirmation.w.document.activeElement,confirmation.$('source-text'));
 assert.equal(graph(confirmation),originalGraph);confirmation.w.close();
 checks.push('editor Escape opens confirmation; modeled dialog cancel continues editing with exact text, selection and focus restored');

 const keptDB=new IDBFactory(),kept=await ready({indexedDB:keptDB});await openText(kept);await flush();await edit(kept);
 const keptGraph=graph(kept),keptKey=tabs(kept)[0].dataset.key,exactDraft=markdown+'\n\n  \n';
 // The Close handler must inspect the current textarea, even before an input event.
 kept.$('source-text').value=exactDraft;
 const accepted=requestClose(kept);assert.equal(kept.$('source-close-dialog').open,true);
 await invoke(kept,'source-close-confirm');assert.equal(await accepted,true);
 assert.equal(kept.$('source-close-dialog').open,false);assert.equal(dialogOpen(kept),false);
 assert.equal(kept.w.document.activeElement,kept.$('edit-markdown'));assert.equal(graph(kept),keptGraph);
 const keptSnapshot=await saved(keptDB);
 assert.equal(keptSnapshot.tabs[0].key,keptKey);assert.equal(keptSnapshot.tabs[0].draft,exactDraft);
 assert.equal(keptSnapshot.tabs[0].design.markdown,markdown);assert.notEqual(keptSnapshot.tabs[0].edited,true,'closing a draft must not mark the Graph as edited');
 await edit(kept);assert.equal(kept.$('source-text').value,exactDraft);kept.w.close();
 const keptRestored=await ready({indexedDB:keptDB});await edit(keptRestored);
 assert.equal(keptRestored.$('source-text').value,exactDraft);assert.equal(keptRestored.$('source-submit').disabled,false);
 assert.equal(tabs(keptRestored)[0].dataset.key,keptKey);assert.equal(graph(keptRestored),keptGraph);assert.equal(keptRestored.calls.length,0);keptRestored.w.close();
 checks.push('accepted Close reads current textarea, keeps exact whitespace draft separately from applied Markdown, restores opener focus and survives reopen/model reload without Graph application');

 const clean=await ready();await openText(clean);let cleanPrompts=0;
 clean.$('source-close-dialog').showModal=function(){cleanPrompts++;this.open=true;};
 await edit(clean);assert.equal(await requestClose(clean),true);assert.equal(dialogOpen(clean),false);
 await edit(clean);input(clean,blankLineDraft);input(clean,markdown);
 assert.equal(await requestClose(clean),true);assert.equal(dialogOpen(clean),false);
 await edit(clean);input(clean,edited);await submit(clean);await edit(clean);
 assert.equal(await requestClose(clean),true);assert.equal(dialogOpen(clean),false);assert.equal(cleanPrompts,0,'unchanged, exactly reverted and already applied text never prompt');
 assert.equal((await saved(clean.w.indexedDB)).tabs[0].draft,undefined);clean.w.close();
 checks.push('unchanged, exactly reverted and already applied text close without confirmation');

 const switched=await ready();await openText(switched);await openText(switched);await edit(switched);input(switched,blankLineDraft);
 let switchPrompts=0;switched.$('source-close-dialog').showModal=function(){switchPrompts++;this.open=true;};
 const switchedFrom=tabs(switched)[0].dataset.key,earlier=switched.w.document.querySelector('[data-document-key]').dataset.documentKey;
 await recover(switched,earlier);assert.equal(dialogOpen(switched),false);assert.equal(switchPrompts,0,'shared tab-switch close remains prompt-free');
 assert.equal((await saved(switched.w.indexedDB,true)).recovery.find(tab=>tab.key===switchedFrom).draft,blankLineDraft);
 await recover(switched,switchedFrom);await edit(switched);
 assert.equal(switched.$('source-text').value,blankLineDraft);switched.w.close();
 checks.push('tab switching keeps its quiet save-and-close behavior and returns the draft to the original tab');

 const failedClose=await ready();await openText(failedClose);await flush();await edit(failedClose);input(failedClose,blankLineDraft);
 failedClose.$('source-text').setSelectionRange(4,19,'backward');const failureSelection=selection(failedClose),failureGraph=graph(failedClose),retryDB=failedClose.w.indexedDB;
 failedClose.w.indexedDB={open(){throw Error('synthetic confirmed-close save failure');}};
 const failedDecision=requestClose(failedClose);await invoke(failedClose,'source-close-confirm');assert.equal(await failedDecision,false);
 assert.equal(failedClose.$('source-close-dialog').open,false);assert.ok(dialogOpen(failedClose));assert.equal(graph(failedClose),failureGraph);
 assert.equal(failedClose.$('source-text').value,blankLineDraft);assert.deepEqual(selection(failedClose),failureSelection);
 assert.equal(failedClose.w.document.activeElement,failedClose.$('source-text'));assert.equal(failedClose.$('source-text').disabled,false);
 assert.equal(failedClose.$('source-close-confirm').disabled,false);assert.equal(failedClose.$('source-close-continue').disabled,false);
 assert.match(status(failedClose),/保存できません/);assert.equal(failedClose.$('status').dataset.key,'storage');assert.equal(failedClose.$('save-actions').hidden,false);
 failedClose.w.indexedDB=retryDB;const retriedDecision=requestClose(failedClose);assert.notEqual(retriedDecision,failedDecision);
 await invoke(failedClose,'source-close-confirm');assert.equal(await retriedDecision,true);assert.equal((await saved(retryDB)).tabs[0].draft,blankLineDraft);failedClose.w.close();
 checks.push('confirmed-close save failure dismisses only the confirmation, preserving editor/error/selection/focus; a fresh confirmation can retry successfully');

 const waitingClose=await ready();await openText(waitingClose);await flush();await edit(waitingClose);input(waitingClose,blankLineDraft);
 const waitingDB=waitingClose.w.indexedDB,waitingGate=deferred(),waitingGraph=graph(waitingClose);let waitingTransactions=0,decisionSettled=false;
 waitingClose.w.indexedDB={open(...args){
  const real=waitingDB.open(...args),request={};real.onerror=()=>{request.error=real.error;request.onerror?.();};
  real.onsuccess=()=>{const db=real.result;request.result={close:()=>db.close(),transaction(...args){
   const tx=db.transaction(...args);if(args[1]==='readwrite'){waitingTransactions++;let complete;Object.defineProperty(tx,'oncomplete',{set(callback){complete=callback;}});tx.addEventListener('complete',()=>waitingGate.promise.then(()=>complete?.()));}return tx;
  }};request.onsuccess?.();};return request;
 }};
 const waitingDecision=requestClose(waitingClose);waitingDecision.then(()=>{decisionSettled=true;});
 const accepting=waitingClose.$('source-close-confirm').onclick();await tick();
 assert.equal(waitingTransactions,1);assert.equal(waitingClose.$('source-close-dialog').open,true);assert.ok(dialogOpen(waitingClose));
 assert.equal(waitingClose.$('source-close-confirm').disabled,true);assert.equal(waitingClose.$('source-close-continue').disabled,true);
 assert.equal(waitingClose.$('source-text').disabled,true);assert.equal(waitingClose.$('source-cancel').disabled,true);
 assert.equal(requestClose(waitingClose),waitingDecision,'pending save continues to return the original Close promise');
 await waitingClose.$('source-close-confirm').onclick();await waitingClose.$('source-close-continue').onclick();
 const waitingCancel=new waitingClose.w.Event('cancel',{cancelable:true});waitingClose.$('source-close-dialog').dispatchEvent(waitingCancel);
 assert.equal(waitingCancel.defaultPrevented,true);await tick();assert.equal(decisionSettled,false);assert.equal(waitingTransactions,1);
 assert.equal(waitingClose.$('source-close-dialog').open,true);assert.ok(dialogOpen(waitingClose));assert.equal(graph(waitingClose),waitingGraph);
 waitingGate.resolve();await accepting;assert.equal(await waitingDecision,true);
 assert.equal(waitingClose.$('source-close-dialog').open,false);assert.equal(dialogOpen(waitingClose),false);assert.equal(graph(waitingClose),waitingGraph);
 assert.equal(waitingClose.$('source-close-confirm').disabled,false);assert.equal(waitingClose.$('source-close-continue').disabled,false);
 const waitingSnapshot=await saved(waitingDB);assert.equal(waitingSnapshot.tabs[0].draft,blankLineDraft);assert.equal(waitingSnapshot.tabs[0].design.markdown,markdown);waitingClose.w.close();
 checks.push('modeled pending draft-save completion keeps confirmation/editor open, disables both choices and blocks duplicate Close/accept/Continue/cancel until save acknowledgment, then hides without applying Graph');
 console.log(JSON.stringify({model:'jsdom/fake IndexedDB with synthetic file and mocked URL; no real network or OS picker',passed:checks.length,checks},null,2));
} finally {for(const w of windows)w.close();}
