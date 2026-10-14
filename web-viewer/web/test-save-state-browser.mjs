// Import-safe browser gate. The caller owns the local server and browser.
// Disposable contexts, synthetic documents and native IndexedDB only. The
// controls hold REAL transactions alive; they never replace product modules,
// transaction completion, generation comparison, or a stored document value.
import assert from 'node:assert/strict';
import {runBrowserCases} from './browser-cases.mjs';
import {concurrencyBodies,changedMarkdown,readConcurrencyRecord,seedLegacyRecord} from './test-session-concurrency-browser.mjs';

export function installSaveStateControls({holdWrites=false,failReads=false}={}){
 const control=globalThis.__saveStateControl={holdWrites,failReads,failWrites:0,writes:[],listeners:new Set(),registrations:0,removals:0,states:[]};
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
    if(session&&mode==='readwrite'&&control.failWrites>0){control.failWrites--;throw Error('Injected synthetic save error');}
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
 new MutationObserver(records=>{for(const record of records)if(record.target.id==='save-state'&&record.attributeName==='data-state'){if(record.oldValue!==null)control.states.push(record.oldValue);control.states.push(record.target.getAttribute('data-state'));}}).observe(document,{subtree:true,attributes:true,attributeFilter:['data-state'],attributeOldValue:true});
}
export function saveStateSnapshot(){
 const state=document.getElementById('save-state'),event=new Event('beforeunload',{cancelable:true});
 const allowed=globalThis.dispatchEvent(event);
 return {state:state?.dataset.state,text:state?.textContent,role:state?.getAttribute('role'),live:state?.getAttribute('aria-live'),warning:!allowed||event.defaultPrevented,listeners:globalThis.__saveStateControl.listeners.size};
}
export function saveStateLayout(){
 const el=document.getElementById('save-state'),r=el.getBoundingClientRect(),style=getComputedStyle(el),range=document.createRange();range.selectNodeContents(el);
 const textRects=Array.from(range.getClientRects()).filter(r=>r.width&&r.height);
 const clipping=[];
 for(let parent=el.parentElement;parent;parent=parent.parentElement){const s=getComputedStyle(parent),p=parent.getBoundingClientRect();if(['hidden','clip','scroll','auto'].includes(s.overflowX)&&textRects.some(t=>t.left<p.left-1||t.right>p.right+1))clipping.push(parent.id||parent.tagName);if(['hidden','clip','scroll','auto'].includes(s.overflowY)&&textRects.some(t=>t.top<p.top-1||t.bottom>p.bottom+1))clipping.push(parent.id||parent.tagName);}
 return {state:el.dataset.state,text:el.textContent,width:innerWidth,height:innerHeight,rect:{x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom},display:style.display,visibility:style.visibility,opacity:style.opacity,scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,scrollHeight:el.scrollHeight,clientHeight:el.clientHeight,textRects:textRects.map(t=>({x:t.x,y:t.y,right:t.right,bottom:t.bottom})),clipping};
}
function checkLayout(layout){
 assert.ok(layout.text?.trim(),'save state has readable text');assert.notEqual(layout.display,'none');assert.notEqual(layout.visibility,'hidden');assert.notEqual(layout.opacity,'0');
 assert.ok(layout.rect.width>0&&layout.rect.height>0,'save state occupies visible space');
 assert.ok(layout.rect.x>=-1&&layout.rect.y>=-1&&layout.rect.right<=layout.width+1&&layout.rect.bottom<=layout.height+1,'save state fits the viewport: '+JSON.stringify(layout));
 assert.ok(layout.scrollWidth<=layout.clientWidth+1&&layout.scrollHeight<=layout.clientHeight+1,'save state text is not clipped inside its box: '+JSON.stringify(layout));
 assert.ok(layout.textRects.length>0);assert.deepEqual(layout.clipping,[],'save state text is not clipped by an ancestor');
 for(const r of layout.textRects)assert.ok(r.x>=-1&&r.y>=-1&&r.right<=layout.width+1&&r.bottom<=layout.height+1,'all save status text is in viewport');
}
const databaseFor=url=>{const match=new URL(url).pathname.match(/\/preview\/pr-(\d+)\/([A-Za-z0-9][A-Za-z0-9._-]*)\/(?:index\.html)?$/);return match?`alder-web-viewer:preview:pr-${match[1]}:${match[2]}`:'alder-web-viewer';};
async function ready(page){await page.waitForFunction(()=>document.getElementById('open-text')&&!document.getElementById('open-text').disabled);}
async function stateIs(page,state){await page.waitForFunction(state=>document.getElementById('save-state')?.dataset.state===state,state);}
async function guard(page,warning,states){const s=await page.evaluate(saveStateSnapshot);assert.equal(s.warning,warning,JSON.stringify(s));assert.equal(s.listeners,warning?1:0,JSON.stringify(s));assert.equal(s.role,'status');assert.equal(s.live,'polite');if(states)assert.ok(states.includes(s.state),JSON.stringify(s));return s;}
async function openText(page,body){await page.locator('#open-text').click();await page.locator('#source-text').fill(body);}
async function submit(page){await page.locator('#source-submit').click();await page.waitForFunction(()=>document.getElementById('source-dialog').hidden);}
async function flush(page){await page.evaluate(()=>window.dispatchEvent(new Event('blur')));}
async function held(page,n){await page.waitForFunction(n=>globalThis.__saveStateControl.writes.length>=n,n);}
async function release(page,n){await page.evaluate(n=>globalThis.__saveStateControl.writes[n-1].release(),n);await page.waitForFunction(n=>globalThis.__saveStateControl.writes[n-1].complete,n);}
async function cleanReload(page){const before=await page.evaluate(saveStateSnapshot);assert.equal(before.warning,false);await page.reload();await ready(page);await guard(page,false,['saved','unchanged']);}

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
  const departure=async action=>{
   // Real click/fill user activation in callers enables native beforeunload.
   let timeout;const seen=new Promise((resolve,reject)=>{expected={action,resolve,reject};timeout=setTimeout(()=>reject(Error('Expected actual beforeunload dialog did not appear')),7000);});
   const marker=await page.evaluate(()=>globalThis.__departureIdentity??=(Math.random().toString()));
   const navigation=page.reload().then(()=>({loaded:true}),error=>({loaded:false,error:error.message}));
   try{await seen;const result=await navigation;if(action==='dismiss'){assert.equal(result.loaded,false,'dismissed departure must cancel navigation');assert.equal(await page.evaluate(()=>globalThis.__departureIdentity),marker,'dismissal retains the original document');}else{assert.equal(result.loaded,true,'accepted departure must navigate');await ready(page);}return result;}finally{clearTimeout(timeout);expected=undefined;}
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
  await page.locator('#open-text').click();await guard(page,false,['unchanged']);await page.locator('#source-text').fill('Synthetic unsubmitted draft');await guard(page,true,['draft']);
  await departure('dismiss');assert.equal(await page.locator('#source-text').inputValue(),'Synthetic unsubmitted draft');await guard(page,true,['draft']);
  await page.locator('#source-cancel').click();await guard(page,false,['unchanged']);await page.locator('#open-text').click();await guard(page,true,['draft']);
  await page.locator('#source-text').press('Escape');await guard(page,false,['unchanged']);assert.equal((await page.evaluate(readConcurrencyRecord,database)).current,undefined);
  await page.locator('#open-text').click();await departure('accept');await guard(page,false,['unchanged']);assert.deepEqual(dialogs.map(d=>d.action),['dismiss','accept']);return {nativeDialogs:['dismiss','accept'],draftPersisted:false};
 });
 add('save state: URL draft and invalid submit retain warning; blank input does not',async({page})=>{
  await page.locator('#open-url').click();await guard(page,false,['unchanged']);await page.locator('#source-url').fill('http://invalid.example/synthetic.md');await guard(page,true,['draft']);
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
  assert.equal((await page.evaluate(readConcurrencyRecord,database)).current,undefined);await page.evaluate(()=>__saveStateControl.holdWrites=false);await flush(page);await stateIs(page,'saved');await guard(page,false,['saved']);return {abortRolledBack:true,retrySaved:true};
 },{controls:{holdWrites:true}});
 add('save state: close remains pending through failure and clears only on latest retry commit',async({page})=>{
  await openText(page,concurrencyBodies.shared);await submit(page);await stateIs(page,'saved');await page.evaluate(()=>__saveStateControl.holdWrites=true);const base=await page.evaluate(()=>__saveStateControl.writes.length);
  await page.locator('.tab .close').click();await held(page,base+1);await guard(page,true,['saving']);assert.equal(await page.locator('.tab').count(),1);
  await page.evaluate(n=>__saveStateControl.writes[n].abort(),base);await stateIs(page,'error');await guard(page,true,['error']);assert.equal(await page.locator('.tab').count(),1);
  // Retry may already have been queued by recovery; release every real pending
  // transaction, then wait for the semantic saved state rather than a delay.
  await page.evaluate(()=>{__saveStateControl.holdWrites=false;for(const w of __saveStateControl.writes)w.release();});await flush(page);await stateIs(page,'saved');await guard(page,false,['saved']);
  await page.locator('.tab .close').click();await page.waitForFunction(()=>document.querySelectorAll('.tab').length===0);await stateIs(page,'saved');await guard(page,false,['saved']);return {failedCloseRetained:true,retryCloses:true};
 });
 add('save state: invalid restoration protects storage; local change enables warning',async({page,database,dialogs})=>{
  const invalid={tabs:'invalid synthetic session',dark:false,drawer:true,width:380};await page.evaluate(seedLegacyRecord,{value:invalid,database});await page.reload();await ready(page);await guard(page,false,['protected']);
  await flush(page);assert.deepEqual((await page.evaluate(readConcurrencyRecord,database)).current,invalid);await page.reload();await ready(page);await guard(page,false,['protected']);assert.deepEqual(dialogs,[]);
  await page.locator('#theme').click();await guard(page,true,['protected']);assert.deepEqual((await page.evaluate(readConcurrencyRecord,database)).current,invalid);return {protectedRecordUnchanged:true,untouchedReloadAllowed:true,changedReloadWarns:true};
 });
 add('save state: two windows retain winner, stale work and departure protection',async({page:a,context,database})=>{
  await openText(a,concurrencyBodies.shared);await submit(a);await stateIs(a,'saved');const b=await context.newPage();await b.goto(url);await ready(b);await guard(b,false,['saved']);
  await a.locator('#theme').click();await stateIs(a,'saved');const winner=await a.evaluate(readConcurrencyRecord,database);
  await b.locator('#refresh').click();await b.locator('#source-text').fill(changedMarkdown);await submit(b);await flush(b);await stateIs(b,'conflict');await guard(b,true,['conflict']);
  assert.deepEqual(await a.evaluate(readConcurrencyRecord,database),winner);assert.ok((await b.locator('#detail').textContent()).includes('Retain B local submitted edit.'));await b.locator('#status-close').click();await guard(b,true,['conflict']);await guard(a,false,['saved']);return {winnerUnchanged:true,staleLocalEditRetained:true,conflictWarns:true};
 });
 for(const width of [320,393,1280])for(const theme of ['light','dark'])add(`save state: visible unclipped ${theme} ${width}px`,async({page,context,database})=>{
  if(theme==='dark'){await page.locator('#theme').click();await stateIs(page,'saved');}const layouts=[await page.evaluate(saveStateLayout)];
  await openText(page,concurrencyBodies.shared);layouts.push(await page.evaluate(saveStateLayout));await page.evaluate(()=>__saveStateControl.holdWrites=true);await submit(page);await flush(page);await held(page,theme==='dark'?2:1);layouts.push(await page.evaluate(saveStateLayout));
  await page.evaluate(()=>{__saveStateControl.holdWrites=false;for(const w of __saveStateControl.writes)w.release();});await stateIs(page,'saved');layouts.push(await page.evaluate(saveStateLayout));
  await page.evaluate(()=>__saveStateControl.failWrites=1);await page.locator('#drawer').click();await flush(page);await stateIs(page,'error');layouts.push(await page.evaluate(saveStateLayout));await flush(page);await stateIs(page,'saved');
  const other=await context.newPage();await other.goto(url);await ready(other);await other.locator('#theme').click();await stateIs(other,'saved');
  await page.locator('#drawer').click();await flush(page);await stateIs(page,'conflict');layouts.push(await page.evaluate(saveStateLayout));
  for(const layout of layouts)checkLayout(layout);assert.equal(await page.locator('html').getAttribute('data-theme'),theme);assert.ok((await page.evaluate(readConcurrencyRecord,database)).current);return {width,theme,checkedStates:layouts.map(l=>l.state)};
 },{viewport:{width,height:width===320?568:960}});
 return await runBrowserCases(cases);
}
