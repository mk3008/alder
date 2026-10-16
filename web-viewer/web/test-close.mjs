import {groupSession} from './group-session-fixture.mjs';
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
async function env(db=new IDBFactory()){globalThis.indexedDB=db;if(!await loadSession())await saveSession(groupSession());delete globalThis.indexedDB;
 const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);w.indexedDB=db;w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};
 const writes=[];w.__saveSession=(value,commit)=>new Promise((resolve,reject)=>writes.push({value,fail:()=>reject(Error('storage failed')),commit:async()=>{await commit();resolve();}}));w.eval(code);
 const e={w,db,writes,$:id=>w.document.getElementById(id),tabs:()=>Array.from(w.document.querySelectorAll('.tab'))};await until(()=>!e.$('open').disabled);e.$('layout-lock').click();return e;
}
const open=e=>assert.equal(e.tabs().length,3);
const close=(e,index=2)=>e.tabs()[index].querySelector('.close').onclick();
const positions=e=>Array.from(e.w.document.querySelectorAll('.node'),n=>[n.dataset.node,n.style.left,n.style.top]);
const coordinates=e=>Object.fromEntries(positions(e).map(([id,x,y])=>[id,[parseFloat(x),parseFloat(y)]]));
const translated=(e,dx,dy)=>{const all=coordinates(e),id=e.w.document.querySelector('.node').dataset.node;all[id]=[all[id][0]+dx,all[id][1]+dy];return all;};
const savedCoordinates=value=>Object.fromEntries(Object.entries(value).map(([id,p])=>[id,Array.from(p)]));
function drag(e,dx,dy){const n=e.w.document.querySelector('.node');n.onpointerdown({button:0,clientX:0,clientY:0,pointerId:1,stopPropagation(){}});n.onpointermove({clientX:dx,clientY:dy});n.onpointerup({pointerId:1});}
async function text(e){e.$('open-text').click();e.$('source-text').value=raw;await e.$('source-submit').onclick();}
try{
 const e=await env();open(e);const expectedMove=translated(e,70,45);drag(e,70,45);assert.deepEqual(coordinates(e),expectedMove);const expected=positions(e),done=close(e);assert.equal(e.tabs().length,3);assert.ok(e.tabs()[2].querySelector('.close').disabled);await until(()=>e.writes.length===1);assert.equal(e.writes[0].value.views.length,2);assert.equal(e.writes[0].value.document.design.markdown,groupSession().document.design.markdown);
 await close(e);assert.equal(e.writes.length,1);drag(e,100,100);assert.deepEqual(positions(e),expected);await e.writes[0].commit();await done;assert.equal(e.tabs().length,2);
 e.w.close();const restored=await env(e.db);assert.equal(restored.tabs().length,2);assert.equal(restored.tabs()[0].querySelector('.close').hidden,true);checks.push('Group close waits for commit; duplicate close and closing-view drag blocked; reload preserves overview and other Group without resurrecting closed view');
 const failure=await env();open(failure);drag(failure,35,25);const before=positions(failure),failed=close(failure);await until(()=>failure.writes.length===1);failure.writes[0].fail();await failed;assert.equal(failure.tabs().length,3);assert.deepEqual(positions(failure),before);assert.match(failure.$('status-text').textContent,/保存/);assert.equal(failure.tabs()[2].querySelector('.close').disabled,false);
 const retry=close(failure);await until(()=>failure.writes.length===2);await failure.writes[1].commit();await retry;assert.equal(failure.tabs().length,2);checks.push('failed close retains view and exact coordinates; explicit retry succeeds');
 const clone=await env();open(clone);clone.w.structuredClone=()=>{throw Error('clone failed');};await close(clone);assert.equal(clone.tabs().length,3);assert.equal(clone.writes.length,0);assert.match(clone.$('status-text').textContent,/保存/);checks.push('snapshot failure keeps Group without issuing a save');
 const queued=await env();open(queued);queued.$('theme').click();await until(()=>queued.writes.length===1);const queuedMove=translated(queued,21,32);drag(queued,21,32);assert.deepEqual(coordinates(queued),queuedMove);const ordered=close(queued);await tick();assert.equal(queued.writes.length,1);await queued.writes[0].commit();await until(()=>queued.writes.length===2);assert.equal(queued.writes[0].value.views.length,3);assert.equal(queued.writes[1].value.views.length,2);await queued.writes[1].commit();await ordered;assert.equal(queued.tabs().length,2);checks.push('pending ordinary saves precede final Group close snapshot; closed view cannot resurrect');
 const concurrent=await env();open(concurrent);const originalKey=concurrent.tabs()[2].dataset.key,closing=close(concurrent);await until(()=>concurrent.writes.length===1);concurrent.$('theme').click();concurrent.$('drawer').click();await concurrent.writes[0].commit();await closing;assert.equal(concurrent.tabs().length,2);await until(()=>concurrent.writes.length===2);assert.equal(concurrent.writes[1].value.dark,true);assert.equal(concurrent.writes[1].value.drawer,false);assert.ok(!concurrent.writes[1].value.views.some(t=>t.key===originalKey));await concurrent.writes[1].commit();checks.push('theme/drawer changes during Group close are saved afterward without resurrecting the view');
 const inactive=await env();open(inactive);const active=inactive.tabs()[2].dataset.key,closingInactive=close(inactive,1);await until(()=>inactive.writes.length===1);await inactive.writes[0].commit();await closingInactive;assert.equal(inactive.tabs().length,2);assert.equal(inactive.w.document.querySelector('.tab.active').dataset.key,active);checks.push('inactive Group close retains active Group and shared original');
 windows.forEach(w=>w.close());globalThis.indexedDB=new IDBFactory();const original={tabs:[],dark:false,drawer:true,width:380};await loadSession();await saveSession(original);
 const transaction=IDBDatabase.prototype.transaction;IDBDatabase.prototype.transaction=function(...args){const tx=transaction.apply(this,args);if(args[1]==='readwrite')queueMicrotask(()=>tx.abort());return tx;};
 try{await assert.rejects(saveSession({...original,dark:true}));}finally{IDBDatabase.prototype.transaction=transaction;}
 assert.deepEqual(await loadSession(),original);delete globalThis.indexedDB;checks.push('aborted IndexedDB transaction rejects save and preserves previously committed session');
 console.log(JSON.stringify({model:'JSDOM controlled save completion + fake IndexedDB',checks,passed:checks.length},null,2));
}finally{windows.forEach(w=>w.close());}
