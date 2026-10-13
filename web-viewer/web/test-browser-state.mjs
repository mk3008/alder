import {integerDragPlan} from './test-route-cache-browser.mjs';
import assert from 'node:assert/strict';
import {indexedDB,IDBFactory} from 'fake-indexeddb';
import {runBrowserCases} from './browser-cases.mjs';
import {waitForExactRead,readSessionInPage,viewerProjection,waitSavedViewer} from './wait-saved-viewer.mjs';
const calls=[],reports=[];await assert.rejects(runBrowserCases([{name:'first',run:()=>{calls.push('first');throw Error('retained failure');}},{name:'second',run:()=>{calls.push('second');return 'checked';}},{name:'third',run:()=>{calls.push('third');assert.ok(false,'false result failed');}}],s=>reports.push(JSON.parse(s))),e=>e instanceof AggregateError&&e.errors.length===2&&e.results.length===3);assert.deepEqual(calls,['first','second','third']);assert.equal(reports.at(-1).browserSummary.failed,2);assert.equal(reports.at(-1).browserSummary.passed,1);
// Reproduce the old library boundary, not an imaginary async-aware poller.
let oldReads=0;const oldResult=await new Promise(resolve=>{const success=(async()=>{oldReads++;return false;})();if(success)resolve(success);});assert.equal(oldResult,false);assert.equal(oldReads,1);
let i=0;const sequence=[false,null,{positions:{A:[995,40]}},{positions:{A:[1080,40]}}];const result=await waitForExactRead(async()=>sequence[i++],sequence[3],{timeoutMs:100,intervalMs:1});assert.equal(result.reads,4);assert.deepEqual(result.actual,sequence[3]);
for(const value of [false,null,sequence[2]])await assert.rejects(waitForExactRead(async()=>value,sequence[3],{timeoutMs:15,intervalMs:1}),e=>e.message.includes('deadline')&&e.reads>1);let errorReads=0;await assert.rejects(waitForExactRead(async()=>{errorReads++;throw Error('IDB error');},true),/IDB error/);assert.equal(errorReads,1);await assert.rejects(waitForExactRead(()=>new Promise(r=>setTimeout(()=>r(true),20)),true,{timeoutMs:5}),/deadline/);
globalThis.indexedDB=indexedDB;await assert.rejects(readSessionInPage(),/Missing viewer database/);const open=indexedDB.open('alder-web-viewer',1);open.onupgradeneeded=()=>open.result.createObjectStore('session');const db=await new Promise(r=>open.onsuccess=()=>r(open.result));
const expected={positions:{A:[1080,40]},hiddenNodes:['A'],selected:null,zoom:1/1.2,dark:true,preferWrite:true},make=()=>({active:'a',dark:true,preferWrite:true,tabs:[{key:'a',positions:{A:[1080,40]},hiddenNodes:['A'],zoom:1/1.2}]}),put=s=>new Promise(r=>{const tx=db.transaction('session','readwrite');tx.objectStore('session').put(s,'current');tx.oncomplete=r;});
assert.equal(await readSessionInPage(),null);
for(const mutate of [s=>{s.tabs[0].positions.A[0]=995;},s=>{s.tabs[0].hiddenNodes=[];},s=>{s.tabs[0].selected='A';},s=>{s.dark=false;},s=>{s.tabs[0].zoom=1;},s=>{s.preferWrite=false;},s=>{s.active='other';}]){const s=make();mutate(s);await put(s);assert.notDeepEqual(viewerProjection(await readSessionInPage(),Object.keys(expected)),expected);}
const good=make();await put(good);assert.deepEqual(await waitSavedViewer({evaluate:async fn=>await fn()},expected),good);db.close();globalThis.indexedDB=new IDBFactory();const missing=indexedDB.open('unused'); // Different object below deliberately has no store.
missing.onsuccess=()=>missing.result.close();const noStore=globalThis.indexedDB.open('alder-web-viewer',1);await new Promise(r=>noStore.onsuccess=()=>{noStore.result.close();r();});await assert.rejects(readSessionInPage(),/Missing session store/);
console.log('case collection and Node-side bounded actual reads passed; stale/false/null/timeout/error, old Promise bug, exact state projection, missing database/store. Real Playwright preflight remains separate.');

// Fractional SVG midpoint is quantized at the input boundary, not in the saved
// value assertion. A viewport origin need not itself be an integer.
const dragFixture={person:[1040,100],record:[80,100],read:[650,420],approve:[1040,650]};
const dragPlan=integerDragPlan(dragFixture,'person',{x:1040,y:209,width:260,height:68},{screen:[252.1070556640625,563],world:[252.1070556640625,454]});
assert.deepEqual(dragPlan,{start:[1170,243],end:[252,563],expected:{...dragFixture,person:[122,420]}});
assert.deepEqual(dragFixture.person,[1040,100]);
const fractionalOrigin=integerDragPlan(dragFixture,'person',{x:1040.25,y:209.25,width:260,height:68},{screen:[252.3570556640625,563.25],world:[252.1070556640625,454]});
assert.deepEqual(fractionalOrigin.expected.person,[122,420]);
assert.throws(()=>integerDragPlan(dragFixture,'person',{x:1040,y:209,width:260,height:68},{screen:[500,500],world:[0,0]}),/still covers/);
console.log('integer drag plan: independent exact coordinates, fractional target/origin, input nonmutation, crossing validity');

// Toolbar browser gate lifecycle only; these stubs never launch a browser or
// assert rendered geometry. Setup, case and cleanup failures stay observable.
const {verifyToolbarSettings,withToolbarPage,toolbarSettingsLimits}=await import('./test-toolbar-settings-browser.mjs');
assert.deepEqual(toolbarSettingsLimits,{caseMs:30000,cleanupMs:3000});
const oldLog=console.log;console.log=()=>{};
try{
 let attempts=0;
 await assert.rejects(verifyToolbarSettings({newContext:async()=>{attempts++;throw Error('controlled toolbar setup failure');}}),error=>error instanceof AggregateError&&error.results.length===9&&error.results.every(r=>r.status==='failed'&&r.error.message.includes('controlled toolbar setup failure')));
 assert.equal(attempts,9,'a setup failure never skips a later toolbar case');
}finally{console.log=oldLog;}
let closeCount=0;
await assert.rejects(withToolbarPage({newContext:async()=>({newPage:async()=>{throw Error('controlled toolbar page failure');},close:async()=>{closeCount++;throw Error('controlled toolbar cleanup failure');}})},{width:320,height:568},()=>{}),error=>error instanceof AggregateError&&error.errors.map(e=>e.message).join('|')==='controlled toolbar page failure|controlled toolbar cleanup failure');
assert.equal(closeCount,1,'page creation failure closes its owned context once');
const mockPage={setDefaultTimeout:ms=>assert.equal(ms,4000),setDefaultNavigationTimeout:ms=>assert.equal(ms,5000),on:(event)=>assert.equal(event,'pageerror')};
closeCount=0;let configuredViewport;
const mockBrowser={newContext:async({viewport})=>{configuredViewport=viewport;return {newPage:async()=>mockPage,close:async()=>{closeCount++;}};}};
assert.equal(await withToolbarPage(mockBrowser,{width:320,height:568},async(page,errors)=>{assert.equal(page,mockPage);assert.deepEqual(errors,[]);return 'completed';}),'completed');
assert.deepEqual(configuredViewport,{width:320,height:568});assert.equal(closeCount,1);
closeCount=0;await assert.rejects(withToolbarPage(mockBrowser,{width:393,height:960},()=>new Promise(()=>{}),{caseMs:15,cleanupMs:15}),/Toolbar case deadline exceeded/);assert.equal(closeCount,1,'case timeout still closes its context');
await assert.rejects(withToolbarPage({newContext:async()=>({newPage:async()=>mockPage,close:()=>new Promise(()=>{})})},{width:1280,height:960},async()=>true,{caseMs:50,cleanupMs:15}),/Toolbar cleanup deadline exceeded/);
let resolveContext,lateClose,lateClosed=new Promise(resolve=>{lateClose=resolve;});
const lateBrowser={newContext:()=>new Promise(resolve=>{resolveContext=resolve;})};
await assert.rejects(withToolbarPage(lateBrowser,{width:320,height:568},()=>{assert.fail('late context may not execute a case');},{caseMs:15,cleanupMs:15}),/Toolbar case deadline exceeded/);
resolveContext({close:async()=>lateClose(),newPage:async()=>assert.fail('late context may not create a page')});
let lateTimer;try{await Promise.race([lateClosed,new Promise((_,reject)=>{lateTimer=setTimeout(()=>reject(Error('late context was not closed')),500);})]);}finally{clearTimeout(lateTimer);}
console.log('toolbar gate lifecycle: all nine independent setup failures collected; exact viewport; page failure and cleanup error both retained; case/cleanup deadlines and late-context disposal. Controlled Node harness only, no browser.');
