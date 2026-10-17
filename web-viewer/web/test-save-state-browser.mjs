import {openSourceAction} from './source-menu-browser.mjs';
import {ensureDocumentActions} from './test-tab-strip-browser.mjs';
// Import-safe browser gate. The caller owns the local server and browser.
// Disposable contexts, synthetic documents and native IndexedDB only. The
// controls hold REAL transactions alive; they never replace product modules,
// transaction completion, generation comparison, or a stored document value.
import assert from 'node:assert/strict';
import {runBrowserCases} from './browser-cases.mjs';
import {concurrencyBodies,changedMarkdown,readConcurrencyRecord,seedLegacyRecord} from './test-session-concurrency-browser.mjs';

export function installSaveStateControls({holdWrites=false,failReads=false}={}){
 const control=globalThis.__saveStateControl={holdWrites,failReads,failWrites:0,failWriteName:'Error',writes:[],listeners:new Set(),registrations:0,removals:0,states:[]};
 const add=globalThis.addEventListener.bind(globalThis),remove=globalThis.removeEventListener.bind(globalThis);
 globalThis.addEventListener=function(type,listener,options){if(type==='beforeunload'){control.listeners.add(listener);control.registrations++;}return add(type,listener,options);};
 globalThis.removeEventListener=function(type,listener,options){if(type==='beforeunload'){control.listeners.delete(listener);control.removals++;}return remove(type,listener,options);};
 // Keep each database wrapper scoped to its own page. This also allows two
 // independent JSDOM windows to share one fake factory without shared patches.
 const factory=globalThis.indexedDB,open=factory.open.bind(factory);
 Object.defineProperty(globalThis,'indexedDB',{configurable:true,value:new Proxy(factory,{get(target,key){
  if(key!=='open'){const value=Reflect.get(target,key,target);return typeof value==='function'?value.bind(target):value;}
  return (...args)=>{const request=open(...args);request.addEventListener('success',()=>{
   const database=request.result,transaction=database.transaction.bind(database);
   database.transaction=function(stores,mode,...options){
    const session=typeof stores==='string'?stores==='session':Array.from(stores).includes('session');
    if(session&&mode!=='readwrite'&&control.failReads)throw Error('Injected synthetic restore read error');
    if(session&&mode==='readwrite'&&control.failWrites>0){control.failWrites--;throw new DOMException('Injected synthetic save error',control.failWriteName);}
    const tx=transaction(stores,mode,...options);
    if(session&&mode==='readwrite'){
     let held=control.holdWrites;const entry={held,complete:false,aborted:false,release(){held=false;entry.held=false;},abort(){held=false;entry.held=false;tx.abort();}};
     control.writes.push(entry);tx.addEventListener('complete',()=>{entry.complete=true;});tx.addEventListener('abort',()=>{held=false;entry.aborted=true;});
     // Each request queues another while held, so the transaction cannot
     // complete until release(). Aborting exercises the real rollback path.
     const keepAlive=()=>{const request=tx.objectStore('session').get('__save_state_test_hold__');request.addEventListener('success',()=>{if(held)keepAlive();});};
     if(held)keepAlive();
    }
    return tx;
   };
  });return request;};
 }})});
 control.dispose=()=>{control.holdWrites=false;for(const write of control.writes)write.release();};
 new MutationObserver(records=>{for(const record of records)if(record.target.id==='app'&&record.attributeName==='data-save-state'){if(record.oldValue!==null)control.states.push(record.oldValue);control.states.push(record.target.getAttribute('data-save-state'));}}).observe(document,{subtree:true,attributes:true,attributeFilter:['data-save-state'],attributeOldValue:true});
}
export function saveStateSnapshot(){
 const app=document.getElementById('app'),status=document.getElementById('status'),text=document.getElementById('status-text'),actions=document.getElementById('save-actions'),event=new Event('beforeunload',{cancelable:true});
 const allowed=globalThis.dispatchEvent(event);
 return {state:app?.dataset.saveState,stateRole:app?.getAttribute('role'),stateLive:app?.getAttribute('aria-live'),legacyRow:!!document.getElementById('save-state'),text:text?.textContent,role:text?.getAttribute('role'),live:text?.getAttribute('aria-live'),storageNotice:!status?.hidden&&status?.dataset.key==='storage',recoveryHidden:!actions||actions.hidden||status.hidden,warning:!allowed||event.defaultPrevented,listeners:globalThis.__saveStateControl.listeners.size};
}
export function saveStateLayout(){
 const bar=document.getElementById('status'),source=document.getElementById('source-dialog'),r=bar.getBoundingClientRect(),t=document.getElementById('status-text').getBoundingClientRect(),c=document.getElementById('status-close').getBoundingClientRect(),v=source.getBoundingClientRect();
 return {state:document.getElementById('app').dataset.saveState,visible:!bar.hidden,width:innerWidth,height:innerHeight,rect:{x:r.x,y:r.y,right:r.right,bottom:r.bottom},text:{x:t.x,y:t.y,right:t.right,bottom:t.bottom},close:{x:c.x,y:c.y,right:c.right,bottom:c.bottom},sourceVisible:!source.hidden,sourceRect:{x:v.x,y:v.y,right:v.right,bottom:v.bottom},actions:!!document.getElementById('save-actions')};
}
async function captureLayout(page){return page.evaluate(saveStateLayout);}
function checkLayout(l){
 assert.equal(l.actions,false);if(!l.visible)return;
 for(const r of [l.rect,l.text,l.close])assert.ok(r.x>=-1&&r.y>=-1&&r.right<=l.width+1&&r.bottom<=l.height+1,'plain error and close control fit the viewport: '+JSON.stringify(l));
 if(l.sourceVisible){const a=l.rect,b=l.sourceRect;assert.ok(a.right<=b.x+1||b.right<=a.x+1||a.bottom<=b.y+1||b.bottom<=a.y+1,'input and plain error never obscure each other');}
}
const databaseFor=url=>{const match=new URL(url).pathname.match(/\/preview\/pr-(\d+)\/([A-Za-z0-9][A-Za-z0-9._-]*)\/(?:index\.html)?$/);return match?`alder-web-viewer:preview:pr-${match[1]}:${match[2]}`:'alder-web-viewer';};
async function ready(page){await page.waitForFunction(()=>document.getElementById('open-text')&&!document.getElementById('open-text').disabled);}
async function stateIs(page,state){await page.waitForFunction(state=>document.getElementById('app')?.dataset.saveState===state,state);}
async function guard(page,warning,states){const s=await page.evaluate(saveStateSnapshot);assert.equal(s.warning,warning,JSON.stringify(s));assert.equal(s.listeners,warning?1:0,JSON.stringify(s));assert.equal(s.legacyRow,false,'normal save-state row is absent');assert.equal(s.stateRole,null,'internal mode is not an accessibility announcement');assert.equal(s.stateLive,null,'internal mode has no live region');if(!['error','conflict','protected'].includes(s.state)){assert.equal(s.storageNotice,false,'normal save states produce no persistent storage announcement');assert.equal(s.recoveryHidden,true,'normal save states expose no recovery actions');}if(states)assert.ok(states.includes(s.state),JSON.stringify(s));return s;}
async function openText(page,body){await openSourceAction(page,'open-text');await page.locator('#source-text').fill(body);}
async function submit(page){await page.locator('#source-submit').click();await page.waitForFunction(()=>document.getElementById('source-dialog').hidden);}
async function flush(page){await page.evaluate(()=>window.dispatchEvent(new Event('blur')));}
async function held(page,n){await page.waitForFunction(n=>globalThis.__saveStateControl.writes.length>=n,n);}
async function release(page,n){await page.evaluate(n=>globalThis.__saveStateControl.writes[n-1].release(),n);await page.waitForFunction(n=>globalThis.__saveStateControl.writes[n-1].complete,n);}
async function cleanReload(page){const before=await page.evaluate(saveStateSnapshot);assert.equal(before.warning,false);await page.reload();await ready(page);await guard(page,false,['saved','unchanged']);}

async function readingError(page){
 assert.equal(await page.locator('#status').isVisible(),true);assert.equal(await page.locator('#status-text').getAttribute('role'),'alert');assert.equal(await page.locator('#status-close').isVisible(),true);
 assert.equal(await page.locator('#save-actions,#save-download,#legacy-notice').count(),0);assert.doesNotMatch(await page.locator('#status-text').textContent(),/保護|保存|退避|書き出/);
}
async function failedDocument(page,body=concurrencyBodies.shared){await page.evaluate(()=>__saveStateControl.failWrites=1);await openText(page,body);await submit(page);await flush(page);await stateIs(page,'error');await guard(page,true,['error']);}

async function withPage(browser,url,run,{viewport={width:1280,height:960},controls={}}={}){
 const context=await browser.newContext({viewport}),errors=[],external=[],dialogs=[];let expected;
 const origin=new URL(url).origin;
 try{
  await context.route('**/*',route=>{if(new URL(route.request().url()).origin===origin)return route.continue();external.push(route.request().url());return route.abort();});
  await context.addInitScript(installSaveStateControls,controls);
  context.on('page',page=>{page.setDefaultTimeout(7000);page.setDefaultNavigationTimeout(10000);page.on('pageerror',e=>errors.push(e.message));page.on('dialog',async dialog=>{
   dialogs.push({type:dialog.type(),action:expected?.action??'unexpected'});
   const request=expected;expected=undefined;
   try{assert.equal(dialog.type(),'beforeunload');if(!request)throw Error('Unexpected departure dialog');await dialog[request.action]();request.resolve();}catch(error){errors.push(error.message);try{await dialog.accept();}catch{}request?.reject(error);}
  });});
  const page=await context.newPage();await page.goto(url);await ready(page);
  const departure=async (action,trigger)=>{
   // Real click/fill user activation in callers enables native beforeunload.
   let timeout;const seen=new Promise((resolve,reject)=>{expected={action,resolve,reject};timeout=setTimeout(()=>reject(Error('Expected actual beforeunload dialog did not appear')),7000);});
   const marker=await page.evaluate(()=>globalThis.__departureIdentity??=(Math.random().toString()));
   const navigation=(trigger?trigger():page.reload()).then(()=>({loaded:true}),error=>({loaded:false,error:error.message}));
   try{await seen;const result=await navigation;if(action==='dismiss'){if(!trigger)assert.equal(result.loaded,false,'dismissed departure must cancel navigation');assert.equal(await page.evaluate(()=>globalThis.__departureIdentity),marker,'dismissal retains the original document');}else{assert.equal(result.loaded,true,'accepted departure must navigate');await page.waitForFunction(marker=>globalThis.__departureIdentity!==marker,marker);await ready(page);}return result;}finally{clearTimeout(timeout);expected=undefined;}
  };
  const result=await run({page,context,departure,dialogs,database:databaseFor(url)});
  assert.deepEqual(errors,[],'no page errors or unexpected dialogs');assert.deepEqual(external,[],'no external network calls');return result;
 }finally{for(const page of context.pages()){try{await page.evaluate(()=>globalThis.__saveStateControl?.dispose());}catch{}}await context.close();}
}

export async function verifySaveState(browser,{url='http://127.0.0.1:4173/'}={}){
 const target=new URL(url);assert.ok(['localhost','127.0.0.1','[::1]'].includes(target.hostname),'save-state gate requires an isolated local server');
 const cases=[];const add=(name,run,options)=>cases.push({name,run:()=>withPage(browser,url,run,options)});
 add('save state: clean restore and unchanged lifecycle do not warn or write',async({page,database,dialogs})=>{
  await guard(page,false,['unchanged']);const before=await page.evaluate(readConcurrencyRecord,database);
  for(const type of ['blur','pagehide'])await page.evaluate(type=>window.dispatchEvent(new Event(type)),type);
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
  await guard(page,false,['unchanged']);assert.equal(await page.evaluate(()=>__saveStateControl.writes.length),0);assert.deepEqual(await page.evaluate(readConcurrencyRecord,database),before);
  await cleanReload(page);assert.deepEqual(dialogs,[]);return {cleanReload:true,lifecycleWrites:0};
 });
 add('save state: native draft reload is dismissible and explicitly discardable',async({page,departure,database,dialogs})=>{
  await openSourceAction(page,'open-text');await guard(page,false,['unchanged']);await page.locator('#source-text').fill('Synthetic unsubmitted draft');await guard(page,true,['draft']);
  await departure('dismiss');assert.equal(await page.locator('#source-text').inputValue(),'Synthetic unsubmitted draft');await guard(page,true,['draft']);
  await page.locator('#source-cancel').click();await guard(page,false,['unchanged']);await openSourceAction(page,'open-text');await guard(page,true,['draft']);
  await page.locator('#source-text').press('Escape');await guard(page,false,['unchanged']);assert.equal((await page.evaluate(readConcurrencyRecord,database)).current,undefined);
  await openSourceAction(page,'open-text');await departure('accept');await guard(page,false,['unchanged']);assert.deepEqual(dialogs.map(d=>d.action),['dismiss','accept']);return {nativeDialogs:['dismiss','accept'],draftPersisted:false};
 });
 add('save state: URL draft and invalid submit retain warning; blank input does not',async({page})=>{
  await openSourceAction(page,'open-url');await guard(page,false,['unchanged']);await page.locator('#source-url').fill('http://invalid.example/synthetic.md');await guard(page,true,['draft']);
  await page.locator('#source-submit').click();await page.waitForFunction(()=>!document.getElementById('source-submit').disabled);await guard(page,true,['draft']);assert.equal(await page.locator('#source-dialog').isVisible(),true);
  await page.locator('#source-url').fill('');await guard(page,false,['unchanged']);await page.locator('#source-url').press('Escape');await guard(page,false,['unchanged']);return {invalidURLRetained:true,externalRequests:0};
 });
 add('save state: native pending write warns, dismissal retains it, completion clears warning',async({page,departure,database})=>{
  await openText(page,concurrencyBodies.shared);await submit(page);await flush(page);await held(page,1);await guard(page,true,['saving']);
  await departure('dismiss');assert.equal(await page.locator('.tab').count(),1);await guard(page,true,['saving']);
  await page.evaluate(()=>__saveStateControl.holdWrites=false);await release(page,1);await stateIs(page,'saved');await guard(page,false,['saved']);assert.equal((await page.evaluate(readConcurrencyRecord,database)).current.tabs[0].design.markdown,concurrencyBodies.shared);
  await cleanReload(page);return {pendingDismissed:true,nativeCommitClearsGuard:true};
 },{controls:{holdWrites:true}});
 add('save state: older queued completion cannot clean a newer edit or editor draft',async({page,database})=>{
  await openText(page,concurrencyBodies.shared);await submit(page);await flush(page);await held(page,1);
  await page.locator('#theme').click();await flush(page);await page.evaluate(()=>__saveStateControl.states=[]);await release(page,1);await held(page,2);await guard(page,true,['saving','dirty']);
  assert.ok(!(await page.evaluate(()=>__saveStateControl.states)).includes('saved'),'old completion must never display saved for a newer edit');
  await openText(page,'Synthetic newer draft');await page.evaluate(()=>__saveStateControl.states=[]);await release(page,2);await stateIs(page,'draft');await guard(page,true,['draft']);assert.ok(!(await page.evaluate(()=>__saveStateControl.states)).includes('saved'),'old completion must never clean a draft');
  assert.equal((await page.evaluate(readConcurrencyRecord,database)).current.dark,true);await page.locator('#source-cancel').click();await guard(page,false,['saved']);return {queuedNewEditProtected:true,newDraftProtected:true};
 },{controls:{holdWrites:true}});
 add('save state: native pending no-op lifecycle flushes commit the current revision exactly once',async({page,database})=>{
  await openText(page,concurrencyBodies.shared);await submit(page);await flush(page);await held(page,1);await guard(page,true,['saving']);
  await flush(page);await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
  // Observe past the app's 180ms debounce while the native transaction remains
  // held. A second same-revision save must not be queued behind it.
  await page.evaluate(()=>new Promise(resolve=>setTimeout(resolve,220)));
  assert.equal(await page.evaluate(()=>__saveStateControl.writes[0].complete),false);
  await page.evaluate(()=>__saveStateControl.holdWrites=false);await release(page,1);await stateIs(page,'saved');await guard(page,false,['saved']);
  const record=await page.evaluate(readConcurrencyRecord,database),counts=await page.evaluate(()=>({writes:__saveStateControl.writes.length,commits:__saveStateControl.writes.filter(write=>write.complete).length}));
  assert.deepEqual({...counts,generation:record.generation},{writes:1,commits:1,generation:1});assert.equal(record.current.tabs[0].design.markdown,concurrencyBodies.shared);return {...counts,generation:record.generation};
 },{controls:{holdWrites:true}});
 add('save state: native transaction abort warns until a successful retry',async({page,database})=>{
  await openText(page,concurrencyBodies.shared);await submit(page);await flush(page);await held(page,1);await page.evaluate(()=>__saveStateControl.writes[0].abort());await stateIs(page,'error');await guard(page,true,['error']);
  assert.equal((await page.evaluate(readConcurrencyRecord,database)).current,undefined);await readingError(page);await flush(page);await held(page,2);assert.equal(await page.locator('#save-retry').count(),0);await guard(page,true,['error','saving']);await page.evaluate(()=>__saveStateControl.holdWrites=false);await release(page,2);await stateIs(page,'saved');await guard(page,false,['saved']);return {abortRolledBack:true,retrySaved:true};
 },{controls:{holdWrites:true}});
 add('save state: close remains pending through failure and clears only on latest retry commit',async({page})=>{
  await openText(page,concurrencyBodies.shared);await submit(page);await page.locator('.node[data-activity] .activity-open').first().press('Enter');await stateIs(page,'saved');await page.evaluate(()=>__saveStateControl.holdWrites=true);const base=await page.evaluate(()=>__saveStateControl.writes.length);
  await page.locator('.tab.active .close').click();await held(page,base+1);await guard(page,true,['saving']);assert.equal(await page.locator('.tab').count(),2);
  await page.evaluate(n=>__saveStateControl.writes[n].abort(),base);await stateIs(page,'error');await guard(page,true,['error']);assert.equal(await page.locator('.tab').count(),2);
  // Retry may already have been queued by recovery; release every real pending
  // transaction, then wait for the semantic saved state rather than a delay.
  await page.evaluate(()=>{__saveStateControl.holdWrites=false;for(const w of __saveStateControl.writes)w.release();});await flush(page);await stateIs(page,'saved');await guard(page,false,['saved']);
  await page.locator('.tab.active .close').click();await page.waitForFunction(()=>document.querySelectorAll('.tab').length===1);await stateIs(page,'saved');await guard(page,false,['saved']);return {failedCloseRetained:true,retryCloses:true};
 });
 add('save state: invalid restoration protects storage; local change enables warning',async({page,database,dialogs})=>{
  const invalid={tabs:'invalid synthetic session',dark:false,drawer:true,width:380};await page.evaluate(seedLegacyRecord,{value:invalid,database});await page.reload();await ready(page);await guard(page,false,['protected']);
  await flush(page);assert.deepEqual((await page.evaluate(readConcurrencyRecord,database)).current,invalid);await page.reload();await ready(page);await guard(page,false,['protected']);assert.deepEqual(dialogs,[]);
  await page.locator('#theme').click();await guard(page,true,['protected']);assert.deepEqual((await page.evaluate(readConcurrencyRecord,database)).current,invalid);return {protectedRecordUnchanged:true,untouchedReloadAllowed:true,changedReloadWarns:true};
 });
 add('save state: two windows retain winner, stale work and departure protection',async({page:a,context,database})=>{
  await openText(a,concurrencyBodies.shared);await submit(a);await stateIs(a,'saved');const b=await context.newPage();await b.goto(url);await ready(b);await guard(b,false,['saved']);
  await a.locator('#theme').click();await stateIs(a,'saved');const winner=await a.evaluate(readConcurrencyRecord,database);
  await openSourceAction(b,'open-text');await b.locator('#source-text').fill(changedMarkdown);await b.locator('#source-submit').click();await flush(b);await stateIs(b,'conflict');await guard(b,true,['conflict']);
  assert.deepEqual(await a.evaluate(readConcurrencyRecord,database),winner);assert.ok((await b.locator('#nodes').textContent()).includes('Synthetic shared activity'),'failed input keeps the old Graph');assert.equal(await b.locator('#source-text').inputValue(),changedMarkdown);await readingError(b);await b.locator('#source-text').press('Escape');await readingError(b);await guard(b,true,['conflict']);await guard(a,false,['saved']);return {winnerUnchanged:true,staleLocalEditRetained:true,conflictWarns:true};
 });
 add('recovery: native quota retry remains failed until the real successful commit',async({page,database})=>{
  await page.evaluate(()=>{__saveStateControl.failWriteName='QuotaExceededError';__saveStateControl.failWrites=1;});await openText(page,concurrencyBodies.shared);await submit(page);await flush(page);await stateIs(page,'error');await readingError(page);
  await page.evaluate(()=>__saveStateControl.failWrites=1);await flush(page);await page.waitForFunction(()=>__saveStateControl.failWrites===0);await stateIs(page,'error');await guard(page,true,['error']);assert.equal((await page.evaluate(readConcurrencyRecord,database)).current,undefined);
  await page.evaluate(()=>__saveStateControl.holdWrites=true);await flush(page);await held(page,1);assert.equal(await page.locator('#save-retry').count(),0);await guard(page,true,['error','saving']);await release(page,1);await stateIs(page,'saved');await guard(page,false,['saved']);assert.equal((await page.evaluate(readConcurrencyRecord,database)).current.tabs[0].design.markdown,concurrencyBodies.shared);return {quotaRetried:true,clearedOnlyAfterNativeCommit:true};
 });
 // Download/copy management was removed; retain failure, CAS and mobile UX coverage.
 add('readonly errors: invalid input remains exact without export controls',async({page,database})=>{
  await openText(page,concurrencyBodies.shared);await submit(page);await stateIs(page,'saved');const before=await page.evaluate(readConcurrencyRecord,database),graph=await page.locator('#nodes').innerHTML();await page.evaluate(()=>__saveStateControl.failWrites=1000);await openText(page,changedMarkdown);await page.locator('#source-submit').click();await stateIs(page,'error');await readingError(page);assert.equal(await page.locator('#nodes').innerHTML(),graph);assert.equal(await page.locator('#source-text').inputValue(),changedMarkdown);await page.locator('#status-close').click();assert.equal(await page.locator('#status').isVisible(),false);assert.deepEqual(await page.evaluate(readConcurrencyRecord,database),before);return {noManagementUI:true,uncommittedInputAndGraphIntact:true};
 });
 add('readonly errors: browser reload adopts winning view after conflict',async({page,context,database,departure})=>{
  await openText(page,concurrencyBodies.shared);await submit(page);await stateIs(page,'saved');const other=await context.newPage();await other.goto(url);await ready(other);await other.locator('#theme').click();await stateIs(other,'saved');const winner=await other.evaluate(readConcurrencyRecord,database),graph=await page.locator('#nodes').innerHTML();await openText(page,changedMarkdown);await page.locator('#source-submit').click();await stateIs(page,'conflict');await readingError(page);assert.equal(await page.locator('#nodes').innerHTML(),graph);await page.locator('#status-close').click();await flush(page);assert.deepEqual(await page.evaluate(readConcurrencyRecord,database),winner);await departure('accept',()=>page.reload());await guard(page,false,['saved']);assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');assert.deepEqual(await page.evaluate(readConcurrencyRecord,database),winner);return {winnerIntact:true,browserReload:true};
 });
 add('readonly errors: invalid restoration has no export prompt and never rewrites data',async({page,database})=>{
  const invalid={tabs:'invalid synthetic session',dark:false,drawer:true,width:380};await page.evaluate(seedLegacyRecord,{value:invalid,database});await page.reload();await ready(page);await readingError(page);await page.locator('#status-close').click();assert.equal(await page.locator('#status').isVisible(),false);await flush(page);assert.deepEqual((await page.evaluate(readConcurrencyRecord,database)).current,invalid);return {originalIntact:true,noManagementUI:true};
 });
 for(const width of [320,393,1280])for(const theme of ['light','dark'])add(`readonly errors: readable dismissible notice ${theme} ${width}px`,async({page,database})=>{
  if(theme==='dark'){await page.locator('#theme').click();await stateIs(page,'saved');}await openText(page,concurrencyBodies.shared);await submit(page);await stateIs(page,'saved');const before=await page.evaluate(readConcurrencyRecord,database);await page.evaluate(()=>__saveStateControl.failWrites=1000);await openText(page,changedMarkdown);await page.locator('#source-submit').click();await stateIs(page,'error');await readingError(page);const l=await captureLayout(page);checkLayout(l);await page.locator('#status-close').focus();await page.locator('#status-close').press('Enter');assert.equal(await page.locator('#status').isVisible(),false);assert.equal(await page.locator('#source-text').inputValue(),changedMarkdown);assert.deepEqual(await page.evaluate(readConcurrencyRecord,database),before);return {width,theme,errorDismissible:true,inputIntact:true};
 },{viewport:{width,height:width===320?568:960}});
 return await runBrowserCases(cases);
}
