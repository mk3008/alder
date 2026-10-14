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
 const el=document.getElementById('save-actions'),bar=document.getElementById('status'),r=el.getBoundingClientRect(),style=getComputedStyle(el),range=document.createRange();range.selectNodeContents(bar);
 const source=document.getElementById('source-dialog'),sourceRect=source.getBoundingClientRect(),barRect=bar.getBoundingClientRect();
 const visible=!el.hidden&&!bar.hidden, textRects=visible?Array.from(range.getClientRects()).filter(r=>r.width&&r.height):[];
 const clipping=[];
 for(let parent=el.parentElement;parent;parent=parent.parentElement){const s=getComputedStyle(parent),p=parent.getBoundingClientRect();if(['hidden','clip','scroll','auto'].includes(s.overflowX)&&textRects.some(t=>t.left<p.left-1||t.right>p.right+1))clipping.push(parent.id||parent.tagName);if(['hidden','clip','scroll','auto'].includes(s.overflowY)&&textRects.some(t=>t.top<p.top-1||t.bottom>p.bottom+1))clipping.push(parent.id||parent.tagName);}
 const buttons=Array.from(el.querySelectorAll('button')).filter(b=>!b.hidden).map(b=>{const r=b.getBoundingClientRect();return {id:b.id,text:b.getAttribute('aria-label')||b.textContent,tag:b.tagName,tabIndex:b.tabIndex,disabled:b.disabled,rect:{x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}};});
 return {sourceVisible:!source.hidden,sourceRect:{x:sourceRect.x,y:sourceRect.y,right:sourceRect.right,bottom:sourceRect.bottom},barRect:{x:barRect.x,y:barRect.y,right:barRect.right,bottom:barRect.bottom},state:document.getElementById('app').dataset.saveState,legacyRow:!!document.getElementById('save-state'),visible,text:bar.textContent,width:innerWidth,height:innerHeight,rect:{x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom},display:style.display,visibility:style.visibility,opacity:style.opacity,scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,scrollHeight:el.scrollHeight,clientHeight:el.clientHeight,textRects:textRects.map(t=>({x:t.x,y:t.y,right:t.right,bottom:t.bottom})),clipping,buttons};
}
function readableRecoveryElement(id){
 const element=document.getElementById(id),r=element.getBoundingClientRect(),range=document.createRange();range.selectNodeContents(element);
 const textRects=Array.from(range.getClientRects()).filter(rect=>rect.width&&rect.height).map(rect=>({x:rect.x,y:rect.y,right:rect.right,bottom:rect.bottom})),clipping=[];
 for(let parent=element;parent;parent=parent.parentElement){const style=getComputedStyle(parent),box=parent.getBoundingClientRect();if(['hidden','clip','scroll','auto'].includes(style.overflowX)&&textRects.some(rect=>rect.x<box.left-1||rect.right>box.right+1))clipping.push(parent.id||parent.tagName);if(['hidden','clip','scroll','auto'].includes(style.overflowY)&&textRects.some(rect=>rect.y<box.top-1||rect.bottom>box.bottom+1))clipping.push(parent.id||parent.tagName);}
 return {id,text:element.textContent,rect:{x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom},textRects,clipping};
}
async function captureLayout(page){
 const layout=await page.evaluate(saveStateLayout);layout.readable=[];
 if(layout.visible){
  // A bounded scroll panel may not show all recovery guidance at once. Prove
  // every individual action and paragraph is actually reachable and readable,
  // rather than accepting clipping just because overflow:auto exists.
  const ids=await page.locator('#status-text,#save-actions button,#save-actions p,#save-actions label,#save-actions textarea').evaluateAll(elements=>elements.filter(element=>!element.hidden&&element.getClientRects().length).map(element=>element.id));
  for(const id of ids){await page.locator('#'+id).scrollIntoViewIfNeeded();layout.readable.push(await page.evaluate(readableRecoveryElement,id));}
  await page.evaluate(()=>{document.getElementById('status').scrollTop=0;document.getElementById('status-text').scrollTop=0;});
 }
 return layout;
}
function checkLayout(layout){
 assert.equal(layout.legacyRow,false,'the ordinary save-state row has been removed');
 if(!layout.visible){assert.equal(layout.rect.width,0,'normal states reserve no recovery row width');assert.equal(layout.rect.height,0,'normal states reserve no recovery row height');assert.deepEqual(layout.textRects,[]);return;}
 if(layout.sourceVisible){const a=layout.sourceRect,b=layout.barRect;assert.ok(a.right<=b.x+1||b.right<=a.x+1||a.bottom<=b.y+1||b.bottom<=a.y+1,'recovery and source editor must not obscure each other: '+JSON.stringify(layout));}
 assert.ok(layout.text?.trim(),'recovery has readable text');assert.notEqual(layout.display,'none');assert.notEqual(layout.visibility,'hidden');assert.notEqual(layout.opacity,'0');
 assert.ok(layout.rect.width>0&&layout.rect.height>0,'recovery occupies visible space only when needed');
 const bar=layout.barRect;assert.ok(bar.x>=-1&&bar.y>=-1&&bar.right<=layout.width+1&&bar.bottom<=layout.height+1,'the bounded recovery panel fits the viewport: '+JSON.stringify(layout));
 assert.ok(layout.scrollWidth<=layout.clientWidth+1,'recovery content cannot hide horizontal overflow');assert.ok(layout.readable.length>0,'every visible recovery element is checked after scrolling');
 for(const item of layout.readable){const r=item.rect;assert.ok(r.width>0&&r.height>0&&r.x>=-1&&r.y>=-1&&r.right<=layout.width+1&&r.bottom<=layout.height+1,'each recovery element is reachable inside the viewport: '+JSON.stringify(item));assert.deepEqual(item.clipping,[],'each recovery element can be read without ancestor clipping: '+JSON.stringify(item));if(item.id!=='save-rescue-text')assert.ok(item.textRects.length>0);for(const rect of item.textRects)assert.ok(rect.x>=-1&&rect.y>=-1&&rect.right<=layout.width+1&&rect.bottom<=layout.height+1,'all text in each scrolled recovery element is visible');}
 for(const button of layout.buttons){assert.equal(button.tag,'BUTTON');assert.ok(button.text.trim(),'recovery buttons have accessible names');if(!button.disabled)assert.ok(button.tabIndex>=0,'available recovery buttons participate in keyboard order');assert.ok(layout.readable.some(item=>item.id===button.id),'every recovery button received an individual visibility check');}
}
const databaseFor=url=>{const match=new URL(url).pathname.match(/\/preview\/pr-(\d+)\/([A-Za-z0-9][A-Za-z0-9._-]*)\/(?:index\.html)?$/);return match?`alder-web-viewer:preview:pr-${match[1]}:${match[2]}`:'alder-web-viewer';};
async function ready(page){await page.waitForFunction(()=>document.getElementById('open-text')&&!document.getElementById('open-text').disabled);}
async function stateIs(page,state){await page.waitForFunction(state=>document.getElementById('app')?.dataset.saveState===state,state);}
async function guard(page,warning,states){const s=await page.evaluate(saveStateSnapshot);assert.equal(s.warning,warning,JSON.stringify(s));assert.equal(s.listeners,warning?1:0,JSON.stringify(s));assert.equal(s.legacyRow,false,'normal save-state row is absent');assert.equal(s.stateRole,null,'internal mode is not an accessibility announcement');assert.equal(s.stateLive,null,'internal mode has no live region');if(!['error','conflict','protected'].includes(s.state)){assert.equal(s.storageNotice,false,'normal save states produce no persistent storage announcement');assert.equal(s.recoveryHidden,true,'normal save states expose no recovery actions');}if(states)assert.ok(states.includes(s.state),JSON.stringify(s));return s;}
async function openText(page,body){await page.locator('#open-text').click();await page.locator('#source-text').fill(body);}
async function submit(page){await page.locator('#source-submit').click();await page.waitForFunction(()=>document.getElementById('source-dialog').hidden);}
async function flush(page){await page.evaluate(()=>window.dispatchEvent(new Event('blur')));}
async function held(page,n){await page.waitForFunction(n=>globalThis.__saveStateControl.writes.length>=n,n);}
async function release(page,n){await page.evaluate(n=>globalThis.__saveStateControl.writes[n-1].release(),n);await page.waitForFunction(n=>globalThis.__saveStateControl.writes[n-1].complete,n);}
async function cleanReload(page){const before=await page.evaluate(saveStateSnapshot);assert.equal(before.warning,false);await page.reload();await ready(page);await guard(page,false,['saved','unchanged']);}

async function recovery(page,expected){
 assert.equal(await page.locator('#status').isVisible(),true);assert.equal(await page.locator('#status').getAttribute('data-key'),'storage');assert.equal(await page.locator('#save-actions').isVisible(),true);assert.equal(await page.locator('#status-close').isVisible(),false);assert.equal(await page.locator('#status-text').getAttribute('role'),'alert');assert.equal(await page.locator('#status-text').getAttribute('aria-live'),'assertive');
 if(expected.includes('save-reload'))assert.equal(await page.locator('#save-reload').textContent(),'未保存の変更を破棄して読み直す','reload action names unsaved-change discard explicitly');
 const visible=await page.locator('#save-actions button').evaluateAll(buttons=>buttons.filter(button=>!button.hidden).map(button=>({id:button.id,tag:button.tagName,name:button.getAttribute('aria-label')||button.textContent,tabIndex:button.tabIndex,disabled:button.disabled})));assert.deepEqual(visible.map(button=>button.id).sort(),[...expected].sort());for(const button of visible){assert.equal(button.tag,'BUTTON');assert.ok(button.name.trim());if(!button.disabled)assert.ok(button.tabIndex>=0);}
 const help=await page.locator('#save-help').textContent();assert.match(help,/Markdown/);assert.match(help,/座標|位置|配置/);assert.match(help,/タブ/);assert.match(help,/含[まみ]|対象外|保存し|保存され|含め/);assert.match(help,/開|読/);
}
async function downloadedBytes(page,id){
 const pending=page.waitForEvent('download');await page.locator('#'+id).focus();await page.locator('#'+id).press('Enter');const download=await pending,stream=await download.createReadStream();assert.ok(stream,'native download exposes its actual file bytes');const chunks=[];for await(const chunk of stream)chunks.push(chunk);assert.equal(await download.failure(),null);const name=download.suggestedFilename();assert.match(name,/\.md$/i);assert.doesNotMatch(name,/[\/\\\u0000-\u001f\u007f<>:"|?*]/);assert.doesNotMatch(name,/^[. ]|[. ]$/);return {bytes:Buffer.concat(chunks),name};
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
  assert.equal((await page.evaluate(readConcurrencyRecord,database)).current,undefined);await recovery(page,['save-retry','save-download']);await page.locator('#save-retry').focus();await page.locator('#save-retry').press('Enter');await held(page,2);assert.equal(await page.locator('#save-retry').isDisabled(),true);await guard(page,true,['error','saving']);await page.evaluate(()=>__saveStateControl.holdWrites=false);await release(page,2);await stateIs(page,'saved');await guard(page,false,['saved']);return {abortRolledBack:true,retrySaved:true};
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
  await b.locator('#edit-markdown').click();await b.locator('#source-text').fill(changedMarkdown);await b.locator('#source-submit').click();await flush(b);await stateIs(b,'conflict');await guard(b,true,['conflict']);
  assert.deepEqual(await a.evaluate(readConcurrencyRecord,database),winner);assert.ok((await b.locator('#detail').textContent()).includes('Exercise isolated session persistence.'),'stale Apply preserves the original Graph');assert.equal(await b.locator('#source-text').inputValue(),changedMarkdown);await recovery(b,['save-download','save-draft-download','save-reload']);await b.locator('#save-download').press('Escape');await recovery(b,['save-download','save-draft-download','save-reload']);await guard(b,true,['conflict']);await guard(a,false,['saved']);return {winnerUnchanged:true,staleLocalEditRetained:true,conflictWarns:true};
 });
 add('recovery: native quota retry remains failed until the real successful commit',async({page,database})=>{
  await page.evaluate(()=>{__saveStateControl.failWriteName='QuotaExceededError';__saveStateControl.failWrites=1;});await openText(page,concurrencyBodies.shared);await submit(page);await flush(page);await stateIs(page,'error');await recovery(page,['save-retry','save-download']);
  await page.evaluate(()=>__saveStateControl.failWrites=1);await page.locator('#save-retry').focus();await page.locator('#save-retry').press(' ');await page.waitForFunction(()=>__saveStateControl.failWrites===0);await stateIs(page,'error');await guard(page,true,['error']);assert.equal((await page.evaluate(readConcurrencyRecord,database)).current,undefined);
  await page.evaluate(()=>__saveStateControl.holdWrites=true);await page.locator('#save-retry').press('Enter');await held(page,1);assert.equal(await page.locator('#save-retry').isDisabled(),true);await guard(page,true,['error','saving']);await release(page,1);await stateIs(page,'saved');await guard(page,false,['saved']);assert.equal((await page.evaluate(readConcurrencyRecord,database)).current.tabs[0].design.markdown,concurrencyBodies.shared);return {quotaRetried:true,clearedOnlyAfterNativeCommit:true};
 });
 add('recovery: keyboard downloads exact current document and invalid draft bytes without marking saved',async({page,database,departure})=>{
  const body=concurrencyBodies.shared+'\nLiteral <script>globalThis.__rescueExecuted=true</script> 日本語 🪵\n';await failedDocument(page,body);const raw='  invalid <img src=x onerror="globalThis.__rescueExecuted=true">\n日本語 🪵\n\n';await openText(page,raw);await page.locator('#source-submit').click();assert.equal(await page.locator('#save-actions').isVisible(),false);await page.locator('#status-close').click();await recovery(page,['save-retry','save-download','save-draft-download']);const before=await page.evaluate(readConcurrencyRecord,database);
  const draft=await downloadedBytes(page,'save-draft-download');assert.deepEqual(draft.bytes,Buffer.from(raw,'utf8'));const current=await downloadedBytes(page,'save-download');assert.deepEqual(current.bytes,Buffer.from(body,'utf8'));assert.equal(await page.locator('#source-text').inputValue(),raw);assert.equal(await page.evaluate(()=>globalThis.__rescueExecuted),undefined);assert.equal(await page.locator('#status img').count(),0);assert.deepEqual(await page.evaluate(readConcurrencyRecord,database),before);await guard(page,true,['error']);await departure('dismiss');assert.equal(await page.locator('#source-text').inputValue(),raw);await guard(page,true,['error']);return {draftBytes:draft.bytes.length,currentBytes:current.bytes.length,nativeDepartureStillWarns:true};
 });
 add('recovery: failed download provides exact readonly copy fallback and stays keyboard accessible',async({page,database})=>{
  await failedDocument(page);const raw='Synthetic manual rescue <script>not executed</script>\n';await openText(page,raw);const before=await page.evaluate(readConcurrencyRecord,database);await page.evaluate(()=>{URL.createObjectURL=()=>{throw Error('Injected synthetic download failure');};});await page.locator('#save-draft-download').focus();await page.locator('#save-draft-download').press('Enter');assert.equal(await page.locator('#save-download-error').isVisible(),true);assert.equal(await page.locator('#save-rescue-text').inputValue(),raw);assert.equal(await page.locator('#save-rescue-text').getAttribute('readonly'),'');assert.equal(await page.locator('#save-rescue-label').getAttribute('for'),'save-rescue-text');assert.deepEqual(await page.locator('#save-rescue-text').evaluate(field=>({focused:document.activeElement===field,start:field.selectionStart,end:field.selectionEnd})),{focused:true,start:0,end:raw.length});
  await page.locator('#save-rescue-text').focus();await page.locator('#save-rescue-text').press('Escape');await recovery(page,['save-retry','save-download','save-draft-download']);await page.locator('#save-rescue-text').press('Tab');assert.notEqual(await page.evaluate(()=>document.activeElement.id),'save-rescue-text','recovery is not a keyboard trap');assert.equal(await page.locator('#source-text').inputValue(),raw);assert.deepEqual(await page.evaluate(readConcurrencyRecord,database),before);await guard(page,true,['error']);return {copyFallbackExact:true,escapeRetainsRecovery:true,keyboardCanLeave:true};
 });
 add('recovery: stale page rescues both texts and reloads the winner only after warned explicit acceptance',async({page,context,database,departure,dialogs})=>{
  await openText(page,concurrencyBodies.shared);await submit(page);await stateIs(page,'saved');const winnerPage=await context.newPage();await winnerPage.goto(url);await ready(winnerPage);await winnerPage.locator('#theme').click();await stateIs(winnerPage,'saved');const winner=await winnerPage.evaluate(readConcurrencyRecord,database);
  await page.locator('#edit-markdown').click();await page.locator('#source-text').fill(changedMarkdown);await page.locator('#source-submit').click();await flush(page);await stateIs(page,'conflict');const raw='Synthetic stale invalid draft\n';await openText(page,raw);await recovery(page,['save-download','save-draft-download','save-reload']);const writes=await page.evaluate(()=>__saveStateControl.writes.length);await page.evaluate(()=>document.getElementById('save-retry').onclick?.());await flush(page);await page.evaluate(()=>new Promise(resolve=>setTimeout(resolve,220)));assert.equal(await page.evaluate(()=>__saveStateControl.writes.length),writes);assert.deepEqual(await page.evaluate(readConcurrencyRecord,database),winner);assert.equal(await page.locator('#source-text').inputValue(),raw,'conflict never auto-reloads local input');
  assert.deepEqual((await downloadedBytes(page,'save-download')).bytes,Buffer.from(concurrencyBodies.shared,'utf8'));assert.deepEqual((await downloadedBytes(page,'save-draft-download')).bytes,Buffer.from(raw,'utf8'));const warning=await page.locator('#save-reload-warning').textContent();assert.equal(await page.locator('#save-reload-warning').isVisible(),true);assert.match(warning,/未保存|保存していない/);assert.match(warning,/失|破棄|消/);assert.match(warning,/座標|位置|配置/);assert.match(warning,/入力|本文|テキスト/);
  await departure('dismiss',()=>page.locator('#save-reload').click());assert.equal(await page.locator('#source-text').inputValue(),raw);assert.ok((await page.locator('#detail').textContent()).includes('Exercise isolated session persistence.'),'failed stale Apply never replaces the Graph');await guard(page,true,['conflict']);assert.deepEqual(await page.evaluate(readConcurrencyRecord,database),winner);
  await departure('accept',()=>page.locator('#save-reload').click());await guard(page,false,['saved']);assert.equal(await page.locator('#source-dialog').isVisible(),false);assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');assert.deepEqual(await page.evaluate(readConcurrencyRecord,database),winner);assert.deepEqual(dialogs.map(dialog=>dialog.action),['dismiss','accept']);return {winnerUnchanged:true,rescuedBothTexts:true,nativeReload:['dismiss','accept']};
 });
 add('recovery: protected restoration rescues new input and explicit reload never overwrites original data',async({page,database,departure,dialogs})=>{
  const invalid={tabs:'invalid synthetic session',dark:false,drawer:true,width:380};await page.evaluate(seedLegacyRecord,{value:invalid,database});await page.reload();await ready(page);await recovery(page,['save-reload']);await guard(page,false,['protected']);const identity=await page.evaluate(()=>globalThis.__explicitProtectedReload=Math.random());await page.locator('#save-reload').click();await page.waitForFunction(identity=>globalThis.__explicitProtectedReload!==identity,identity);await ready(page);await guard(page,false,['protected']);assert.deepEqual(dialogs,[],'untouched protected reload needs no unsaved-data guard');assert.deepEqual((await page.evaluate(readConcurrencyRecord,database)).current,invalid);
  const raw='Synthetic new invalid rescue input\n';await openText(page,raw);await recovery(page,['save-draft-download','save-reload']);assert.deepEqual((await downloadedBytes(page,'save-draft-download')).bytes,Buffer.from(raw,'utf8'));await guard(page,true,['protected']);await departure('dismiss',()=>page.locator('#save-reload').click());assert.equal(await page.locator('#source-text').inputValue(),raw);await guard(page,true,['protected']);await departure('accept',()=>page.locator('#save-reload').click());await guard(page,false,['protected']);assert.deepEqual((await page.evaluate(readConcurrencyRecord,database)).current,invalid);assert.equal(await page.locator('.tab').count(),0);return {originalProtected:true,newInputRescued:true,nativeReload:['dismiss','accept']};
 });
 for(const width of [320,393,1280])for(const theme of ['light','dark'])add(`recovery: space-free normal states and unclipped actions ${theme} ${width}px`,async({page,context,database})=>{
  if(theme==='dark'){await page.locator('#theme').click();await stateIs(page,'saved');}const layouts=[await captureLayout(page)];
  await openText(page,concurrencyBodies.shared);layouts.push(await captureLayout(page));await page.evaluate(()=>__saveStateControl.holdWrites=true);await submit(page);await flush(page);await held(page,theme==='dark'?2:1);layouts.push(await captureLayout(page));
  await page.evaluate(()=>{__saveStateControl.holdWrites=false;for(const w of __saveStateControl.writes)w.release();});await stateIs(page,'saved');layouts.push(await captureLayout(page));
  await page.evaluate(()=>__saveStateControl.failWrites=1);await page.locator('#drawer').click();await flush(page);await stateIs(page,'error');layouts.push(await captureLayout(page));await openText(page,'Synthetic unsent rescue draft');layouts.push(await captureLayout(page));await page.locator('#source-cancel').click();await page.locator('#save-retry').click();await stateIs(page,'saved');
  const other=await context.newPage();await other.goto(url);await ready(other);await other.locator('#theme').click();await stateIs(other,'saved');
  await page.locator('#drawer').click();await flush(page);await stateIs(page,'conflict');layouts.push(await captureLayout(page));
  for(const layout of layouts)checkLayout(layout);assert.equal(await page.locator('html').getAttribute('data-theme'),theme);assert.ok((await page.evaluate(readConcurrencyRecord,database)).current);return {width,theme,checkedStates:layouts.map(l=>l.state)};
 },{viewport:{width,height:width===320?568:960}});
 add('recovery: common editor and expanded copy fallback remain separately reachable on short desktop and mobile',async({page,database})=>{
  await openText(page,concurrencyBodies.shared);await submit(page);await stateIs(page,'saved');const before=await page.evaluate(readConcurrencyRecord,database);
  const raw='  Unapplied common-editor draft 日本語 🪵\n'+changedMarkdown+'\n';
  await page.locator('#edit-markdown').click();await page.locator('#source-text').fill(raw);
  await page.evaluate(()=>{__saveStateControl.failWrites=1000;URL.createObjectURL=()=>{throw Error('Injected copy-fallback layout failure');};});
  await page.locator('#source-submit').click();await stateIs(page,'error');await recovery(page,['save-retry','save-download','save-draft-download']);assert.equal(await page.locator('#source-dialog').getAttribute('data-mode'),'edit');
  await page.locator('#save-draft-download').click();assert.equal(await page.locator('#save-rescue-text').inputValue(),raw);assert.equal(await page.locator('#save-rescue-text').isVisible(),true);
  const matrix=[];
  for(const viewport of [{width:1024,height:600},{width:320,height:568}])for(const theme of ['light','dark']){
   await page.setViewportSize(viewport);if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();
   const layout=await captureLayout(page);checkLayout(layout);assert.equal(layout.sourceVisible,true);assert.equal(layout.visible,true);
   const buttons=[];
   for(const id of ['source-submit','source-cancel',...layout.buttons.map(button=>button.id)]){
    const button=page.locator('#'+id);await button.scrollIntoViewIfNeeded();await button.focus();
    const item=await button.evaluate(el=>{const r=el.getBoundingClientRect(),target=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {id:el.id,focused:document.activeElement===el,covered:!(target===el||el.contains(target)),x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height};});
    assert.equal(item.focused,true,id+' can receive keyboard focus');assert.equal(item.covered,false,id+' is not obscured by editor/recovery overlay');assert.ok(item.width>0&&item.height>0&&item.x>=-1&&item.y>=-1&&item.right<=viewport.width+1&&item.bottom<=viewport.height+1,id+' is fully reachable');buttons.push(item);
   }
   assert.equal(await page.locator('#source-text').inputValue(),raw);assert.equal(await page.locator('#save-rescue-text').inputValue(),raw);await guard(page,true,['error']);matrix.push({viewport,theme,editor:layout.sourceRect,recovery:layout.barRect,buttons});
  }
  assert.deepEqual(await page.evaluate(readConcurrencyRecord,database),before,'layout and failed rescue do not commit the unapplied text');return {matrix,copyFallbackExact:true,graphUnchangedUntilCommit:true};
 });
 return await runBrowserCases(cases);
}
