// Controlled save completion with real fake-indexedDB writes; no real browser.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {IDBFactory,IDBDatabase} from 'fake-indexeddb';
import {saveSession,loadSession} from '../src/session.ts';
import {build} from 'esbuild';
const session=readFileSync('src/session.ts','utf8').replace('export async function saveSession(', 'async function realSaveSession(')+`\nexport async function saveSession(value:Session):Promise<void>{return (globalThis as any).__saveSession(value,()=>realSaveSession(value));}`;
const code=(await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'},plugins:[{name:'controlled-save',setup(b){b.onLoad({filter:/\/src\/session\.ts$/},()=>({contents:session,loader:'ts',resolveDir:process.cwd()+'/src'}));}}]})).outputFiles[0].text;
const raw=readFileSync('../business-design/alder/README.md','utf8'),windows=[],checks=[];
const tick=()=>new Promise(r=>setTimeout(r,10));
async function until(test){for(let i=0;i<300&&!test();i++)await tick();assert.ok(test());}
async function env(db=new IDBFactory()){
 const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);w.indexedDB=db;w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};
 const writes=[];w.__saveSession=(value,commit)=>new Promise((resolve,reject)=>writes.push({value,fail:()=>reject(Error('storage failed')),commit:async()=>{await commit();resolve();}}));w.eval(code);
 const e={w,db,writes,$:id=>w.document.getElementById(id),tabs:()=>Array.from(w.document.querySelectorAll('.tab'))};await until(()=>!e.$('open').disabled);e.$('layout-lock').click();return e;
}
const open=e=>e.$('open-sample').click();
const close=(e,index=0)=>e.tabs()[index].querySelector('.close').onclick();
const positions=e=>Array.from(e.w.document.querySelectorAll('.node'),n=>[n.dataset.node,n.style.left,n.style.top]);
function drag(e,dx,dy){const n=e.w.document.querySelector('.node');n.onpointerdown({button:0,clientX:0,clientY:0,pointerId:1,stopPropagation(){}});n.onpointermove({clientX:dx,clientY:dy});n.onpointerup({pointerId:1});}
async function text(e){e.$('open-text').click();e.$('source-text').value=raw;await e.$('source-submit').onclick();}
try{
 const e=await env();open(e);drag(e,70,45);const expected=positions(e),done=close(e);assert.equal(e.tabs().length,1);assert.ok(e.tabs()[0].querySelector('.close').disabled);await until(()=>e.writes.length===1);assert.equal(e.writes[0].value.tabs.length,0);assert.deepEqual(Object.values(e.writes[0].value.sampleLayout.positions)[0],[110,85]);
 await close(e);assert.equal(e.writes.length,1);drag(e,100,100);assert.deepEqual(positions(e),expected);await e.writes[0].commit();await done;assert.equal(e.tabs().length,0);
 e.w.close();const restored=await env(e.db);assert.equal(restored.tabs().length,0);open(restored);assert.deepEqual(positions(restored),expected);checks.push('close retains tab until committed; duplicate close and closing-tab drag blocked; immediate reload/open restores exact positions');
 const failure=await env();open(failure);drag(failure,35,25);const before=positions(failure),failed=close(failure);await until(()=>failure.writes.length===1);failure.writes[0].fail();await failed;assert.equal(failure.tabs().length,1);assert.deepEqual(positions(failure),before);assert.match(failure.$('status-text').textContent,/タブを閉じませんでした/);assert.equal(failure.tabs()[0].querySelector('.close').disabled,false);
 const retry=close(failure);await until(()=>failure.writes.length===2);await failure.writes[1].commit();await retry;assert.equal(failure.tabs().length,0);checks.push('failed close keeps tab and coordinates with Snackbar; explicit close retry succeeds');
 const clone=await env();open(clone);clone.w.structuredClone=()=>{throw Error('clone failed');};await close(clone);assert.equal(clone.tabs().length,1);assert.equal(clone.writes.length,0);assert.match(clone.$('status-text').textContent,/閉じませんでした/);checks.push('snapshot failure keeps tab without issuing a save');
 const queued=await env();open(queued);await until(()=>queued.writes.length===1);drag(queued,21,32);const ordered=close(queued);await tick();assert.equal(queued.writes.length,1);await queued.writes[0].commit();await until(()=>queued.writes.length===2);assert.equal(queued.writes[0].value.tabs.length,1);assert.equal(queued.writes[1].value.tabs.length,0);assert.deepEqual(Object.values(queued.writes[1].value.sampleLayout.positions)[0],[61,72]);await queued.writes[1].commit();await ordered;assert.equal(queued.tabs().length,0);checks.push('pending ordinary saves complete before final close snapshot; no stale tab resurrection');
 const concurrent=await env();open(concurrent);const sampleKey=concurrent.tabs()[0].dataset.key;const closing=close(concurrent);await until(()=>concurrent.writes.length===1);await text(concurrent);concurrent.$('theme').click();drag(concurrent,14,29);const otherKey=concurrent.tabs()[1].dataset.key,otherPositions=positions(concurrent);assert.equal(concurrent.tabs().length,2);await concurrent.writes[0].commit();await closing;assert.equal(concurrent.tabs().length,1);assert.equal(concurrent.tabs()[0].dataset.key,otherKey);assert.deepEqual(positions(concurrent),otherPositions);await until(()=>concurrent.writes.length===2);assert.equal(concurrent.writes[1].value.tabs.length,1);assert.equal(concurrent.writes[1].value.tabs[0].key,otherKey);assert.equal(concurrent.writes[1].value.dark,true);assert.ok(!concurrent.writes[1].value.tabs.some(t=>t.key===sampleKey));await concurrent.writes[1].commit();checks.push('new/other tab operations survive pending close and persist afterward without resurrecting closed tab');
 const inactive=await env();open(inactive);drag(inactive,46,37);const samplePositions=positions(inactive);await text(inactive);const active=inactive.tabs()[1].dataset.key,closingInactive=close(inactive,0);await until(()=>inactive.writes.length===1);await inactive.writes[0].commit();await closingInactive;assert.equal(inactive.tabs().length,1);assert.equal(inactive.tabs()[0].dataset.key,active);open(inactive);assert.deepEqual(positions(inactive),samplePositions);checks.push('inactive sample close preserves other active tab and sample layout');
 windows.forEach(w=>w.close());globalThis.indexedDB=new IDBFactory();const original={tabs:[],dark:false,drawer:true,width:380};await saveSession(original);
 const transaction=IDBDatabase.prototype.transaction;IDBDatabase.prototype.transaction=function(...args){const tx=transaction.apply(this,args);if(args[1]==='readwrite')queueMicrotask(()=>tx.abort());return tx;};
 try{await assert.rejects(saveSession({...original,dark:true}));}finally{IDBDatabase.prototype.transaction=transaction;}
 assert.deepEqual(await loadSession(),original);delete globalThis.indexedDB;checks.push('aborted IndexedDB transaction rejects save and preserves previously committed session');
 console.log(JSON.stringify({model:'JSDOM controlled save completion + fake IndexedDB',checks,passed:checks.length},null,2));
}finally{windows.forEach(w=>w.close());}
