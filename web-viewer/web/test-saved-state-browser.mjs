import assert from 'node:assert/strict';
import {waitForExactRead,waitSavedViewer,readSessionInPage,viewerProjection} from './wait-saved-viewer.mjs';
export async function verifySavedStatePreflight(browser){
 const context=await browser.newContext(),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  // Same local origin, no product JS: synthetic database/preflight only.
  await page.goto('http://127.0.0.1:4173/LICENSE.txt');
  const changed=await waitForExactRead(()=>page.evaluate(async()=>{globalThis.preflightReads=(globalThis.preflightReads??0)+1;return globalThis.preflightReads>=3;}),true,{timeoutMs:5000,intervalMs:10});assert.equal(changed.reads,3);assert.equal(changed.actual,true);
  await assert.rejects(waitForExactRead(()=>page.evaluate(async()=>false),true,{timeoutMs:1000,intervalMs:20}),e=>e.message.includes('deadline')&&e.actual===false&&e.reads>=2);
  await assert.rejects(waitForExactRead(()=>page.evaluate(async()=>{throw Error('synthetic async read error');}),true),/synthetic async read error/);
  await assert.rejects(page.evaluate(readSessionInPage),/Missing viewer database/);
  await page.evaluate(()=>new Promise((resolve,reject)=>{const r=indexedDB.open('alder-web-viewer',1);r.onupgradeneeded=()=>r.result.createObjectStore('session');r.onerror=()=>reject(r.error);r.onsuccess=()=>{r.result.close();resolve();};}));
  await assert.rejects(waitSavedViewer(page,{positions:{A:[1080,40]}},{timeoutMs:1000,intervalMs:20}),e=>e.message.includes('deadline')&&e.observed===null&&e.reads>=2);
  const put=value=>page.evaluate(value=>new Promise((resolve,reject)=>{const r=indexedDB.open('alder-web-viewer',1);r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,tx=db.transaction('session','readwrite');tx.objectStore('session').put(value,'current');tx.oncomplete=()=>{db.close();resolve();};tx.onerror=tx.onabort=()=>{db.close();reject(tx.error);};};}),value);
  const stale={active:'fixture',tabs:[{key:'fixture',positions:{A:[995,40]}}]},good={active:'fixture',tabs:[{key:'fixture',positions:{A:[1080,40]}}]};await put(stale);let reads=0;const observed=[];
  const matched=await waitForExactRead(async()=>{const snapshot=await page.evaluate(readSessionInPage);if(++reads===2)await put(good);return snapshot;},{positions:{A:[1080,40]}},{timeoutMs:5000,intervalMs:10,project:s=>viewerProjection(s,['positions']),observe:x=>observed.push(x.observed)});assert.equal(matched.reads,3);assert.deepEqual(matched.actual,good);assert.deepEqual(observed.map(x=>x.positions.A[0]),[995,995,1080]);
  // Missing store uses a distinct storage context, preserving the valid fixture.
  const badContext=await browser.newContext();try{const bad=await badContext.newPage();await bad.goto('http://127.0.0.1:4173/LICENSE.txt');await bad.evaluate(()=>new Promise(r=>{const q=indexedDB.open('alder-web-viewer',1);q.onsuccess=()=>{q.result.close();r();};}));await assert.rejects(bad.evaluate(readSessionInPage),/Missing session store/);}finally{await badContext.close();}
  // Deadline rejects an unresolved browser evaluation; context disposal cancels
  // its remaining browser work, rather than leaving it in another case.
  const hungContext=await browser.newContext();try{const hung=await hungContext.newPage();await hung.goto('http://127.0.0.1:4173/LICENSE.txt');await assert.rejects(waitForExactRead(()=>hung.evaluate(()=>new Promise(()=>{})),true,{timeoutMs:100,intervalMs:10}),/deadline/);}finally{await hungContext.close();}
  assert.deepEqual(errors,[]);return {checks:'real page.evaluate async false→true needs3reads; permanentfalse/missingrecord timeout; asyncerror; missingdatabase/store errors; committed IDB995/995/1080; hungread deadline/contextcleanup',observed,reads:matched.reads,pageErrors:errors};
 }finally{await context.close();}
}
