import {openSourceAction} from './source-menu-browser.mjs';
import {ensureDocumentActions} from './test-tab-strip-browser.mjs';
// Native IndexedDB in isolated contexts; built app is never instrumented.
// These checks do not reproduce an Android OS lifecycle or inspect user data.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {concurrencySessionBundle,readConcurrencyRecord,emptySession,concurrencyBodies,changedMarkdown} from './test-session-concurrency-browser.mjs';
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function record(page){return page.evaluate(readConcurrencyRecord);}
async function ready(page,url){await page.goto(url);await page.waitForFunction(()=>!document.getElementById('open-text').disabled);}
async function saved(page){await page.waitForFunction(()=>document.getElementById('app').dataset.saveState==='saved');}
async function input(page,body){await openSourceAction(page,'open-text');await page.locator('#source-text').fill(body);await page.locator('#source-submit').click();await saved(page);}
export async function verifySaveConflictNoop(browser,{url='http://127.0.0.1:4173/'}={}){
 const results=[],storageCode=await concurrencySessionBundle();
 // Product storage modules in independent native realms verify exact generation
 // effects separately from application dirty tracking and layout clamping.
 const storage=await browser.newContext();
 try{
  const a=await storage.newPage(),b=await storage.newPage();
  for(const page of [a,b]){await ready(page,url);await page.addScriptTag({content:storageCode+';globalThis.testSession=concurrencySession;'});await page.evaluate(()=>testSession.loadSession());}
  const value=emptySession();await a.evaluate(value=>testSession.saveSession(value),value);
  await b.evaluate(value=>testSession.saveSession(value),value);
  assert.deepEqual(await record(a),{current:value,generation:1},'same competing proposal is a no-op');
  for(let i=0;i<3;i++)await a.evaluate(value=>testSession.saveSession(value),value);
  assert.equal((await record(a)).generation,1);
  await b.evaluate(value=>testSession.saveSession(value),{...value,dark:true});assert.equal((await record(a)).generation,2);
  await b.evaluate(value=>testSession.saveSession(value),value);assert.equal((await record(a)).generation,3);
  await a.evaluate(value=>testSession.saveSession(value),value);assert.equal((await record(a)).generation,3,'acknowledge identical latest record without writing');
  await a.evaluate(value=>testSession.saveSession(value),{...value,width:420});assert.equal((await record(a)).generation,4);
  const rejected=await b.evaluate(async value=>{try{await testSession.saveSession(value);return null;}catch(error){return error.name;}},{...value,dark:true});
  assert.equal(rejected,'SessionConflictError');assert.deepEqual(await record(a),{current:{...value,width:420},generation:4});
  results.push({name:'native exact-content no-op, generation-only drift and subsequent true divergence',passed:true,noops:5,finalGeneration:4});
 }finally{await storage.close();}
 const noopContext=await browser.newContext();
 try{
  const a=await noopContext.newPage();await ready(a,url);await input(a,concurrencyBodies.shared);await a.reload();await a.waitForFunction(()=>!document.getElementById('open-text').disabled);
  // Normalize the old restored representation with a real saved change first.
  await a.locator('#theme').click();await saved(a);const b=await noopContext.newPage();await ready(b,url);const before=await record(a);
  await a.evaluate(()=>{document.getElementById('theme').click();document.getElementById('theme').click();dispatchEvent(new Event('blur'));});await saved(a);
  assert.deepEqual(await record(a),before,'two theme changes before flush restore the stored value without invalidating a peer');
  await b.locator('#in').click();await saved(b);assert.equal((await record(b)).generation,before.generation+1);
  assert.notEqual(await b.locator('#app').getAttribute('data-save-state'),'conflict');results.push({name:'native UI theme round trip is a no-op; peer camera edit still saves',passed:true});
 }finally{await noopContext.close();}
 for(const kind of ['theme','body']){
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
  const errors=[],external=[];const origin=new URL(url).origin;
  await context.route('**/*',route=>{if(new URL(route.request().url()).origin===origin)return route.continue();external.push(route.request().url());return route.abort();});
  try{
   const a=await context.newPage();a.on('pageerror',e=>errors.push(e.message));await ready(a,url);
   assert.deepEqual(await record(a),{current:undefined,generation:undefined});
   await input(a,concurrencyBodies.shared);
   // On narrow screens the Markdown drawer overlays graph controls. Close it
   // through the actual button before establishing both readers' baseline.
   await a.locator('#drawer').click();await saved(a);const initial=await record(a);
   // Real reload plus repeated native focus changes leave a settled page clean.
   await a.reload();await a.waitForFunction(()=>!document.getElementById('open-text').disabled);
   const b=await context.newPage();b.on('pageerror',e=>errors.push(e.message));await ready(b,url);
   for(let i=0;i<3;i++){await a.bringToFront();await b.bringToFront();await b.locator('.tab > button').first().click();}
   await pause(230);assert.deepEqual(await record(b),initial);assert.notEqual(await b.locator('#app').getAttribute('data-save-state'),'conflict');
   if(kind==='theme'){await a.locator('#theme').click();await saved(a);}else{await ensureDocumentActions(a);await a.locator('#edit-markdown').click();await a.locator('#source-text').fill(changedMarkdown);await a.locator('#source-submit').click();await saved(a);}
   const newer=await record(a);
   await b.bringToFront();await b.locator('.tab > button').first().click();await b.evaluate(()=>{dispatchEvent(new Event('blur'));dispatchEvent(new Event('pagehide'));document.dispatchEvent(new Event('visibilitychange'));});
   await pause(230);assert.deepEqual(await record(b),newer);assert.notEqual(await b.locator('#app').getAttribute('data-save-state'),'conflict','clean stale page stays silent');
   await b.locator('#in').click();await b.waitForFunction(()=>document.getElementById('app').dataset.saveState==='conflict');
   assert.deepEqual(await record(b),newer,'camera-only edit cannot replace other page content or settings');
   const text=await b.locator('#status-text').textContent();assert.match(text,/ブラウザーのタブやウィンドウ/);assert.match(text,/本文または表示設定/);assert.match(text,/この画面を閉じるまで/);
   await b.evaluate(()=>{globalThis.repeatAnnouncements=0;globalThis.noticeObserver=new MutationObserver(records=>{globalThis.repeatAnnouncements+=records.length;});noticeObserver.observe(document.getElementById('status-text'),{childList:true,characterData:true,subtree:true});});
   for(let i=0;i<3;i++){await b.evaluate(()=>{dispatchEvent(new Event('blur'));dispatchEvent(new Event('pagehide'));});await b.locator('#display-settings-toggle').click();}
   await pause(230);assert.equal(await b.evaluate(()=>repeatAnnouncements),0);assert.deepEqual(await record(b),newer);
   const geometry=await b.evaluate(()=>{
    const bar=document.getElementById('status'),text=document.getElementById('status-text');
    return {width:innerWidth,overflow:bar.scrollWidth>bar.clientWidth,textBounds:text.getBoundingClientRect().toJSON(),buttons:[...document.querySelectorAll('#save-actions button')].filter(e=>!e.hidden).map(e=>({id:e.id,bounds:e.getBoundingClientRect().toJSON(),name:e.textContent,disabled:e.disabled}))};
   });
   assert.equal(geometry.overflow,false,'warning has no horizontal overflow at mobile width');
   assert.ok(geometry.textBounds.left>=0&&geometry.textBounds.right<=390);
   for(const button of geometry.buttons){assert.ok(button.bounds.width>0&&button.bounds.left>=0&&button.bounds.right<=390,'mobile recovery button is readable horizontally');}
   // Export the exact applied body through the actual download control; this
   // must not alter stored session or clear the conflict/departure protection.
   const downloadEvent=b.waitForEvent('download');await b.locator('#save-download').click();const download=await downloadEvent;
   const stream=await download.createReadStream();let bytes='';for await(const chunk of stream)bytes+=chunk.toString('utf8');
   assert.equal(bytes,concurrencyBodies.shared);assert.deepEqual(await record(b),newer);
   assert.equal(await b.locator('#app').getAttribute('data-save-state'),'conflict');
   await mkdir('web/evidence/save-conflict-212',{recursive:true});await b.screenshot({path:`web/evidence/save-conflict-212/mobile-${kind}.png`,fullPage:true});
   b.on('dialog',dialog=>dialog.accept());await b.locator('#save-reload').click();await b.waitForLoadState('load');await b.waitForFunction(()=>!document.getElementById('open-text').disabled);
   assert.notEqual(await b.locator('#app').getAttribute('data-save-state'),'conflict');
   await b.locator('#theme').click();await saved(b);assert.ok((await record(b)).generation>newer.generation,'reload makes next real edit writable');
   assert.deepEqual(errors,[]);assert.deepEqual(external,[]);results.push({name:'native mobile '+kind+' divergence / silent clean stale page / persistent single notice / body rescue / reload',passed:true,repeatAnnouncements:0,geometry});
  }finally{await context.close();}
 }
 const result={browser:browser.version(),model:'isolated native Chromium contexts with real reload and mobile viewport; synthetic documents only',results,passed:results.length,limitations:'Mobile emulation is not physical Android; abrupt OS termination, installed PWA and file-handle equality are not covered'};
 console.log('SAVE_CONFLICT_NOOP '+JSON.stringify(result));return result;
}
