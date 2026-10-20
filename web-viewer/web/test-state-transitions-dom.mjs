import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {build} from 'esbuild';
import {IDBFactory} from 'fake-indexeddb';
const raw=readFileSync(new URL('../../tools/fixtures/state-transitions/purchase-request.md',import.meta.url),'utf8');
const code=(await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}})).outputFiles[0].text;
const pause=()=>new Promise(r=>setTimeout(r,20));
async function until(check){for(let i=0;i<100&&!check();i++)await pause();assert.ok(check());}
const db=new IDBFactory(),windows=[];
async function env(){const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);w.indexedDB=db;w.structuredClone=structuredClone;w.HTMLElement.prototype.scrollIntoView=()=>{};w.eval(code);const $=id=>w.document.getElementById(id);await until(()=>!$('open-text').disabled);return {w,$};}
async function record(change){return new Promise((resolve,reject)=>{const r=db.open('alder-web-viewer',1);r.onsuccess=()=>{const d=r.result,tx=d.transaction('session',change?'readwrite':'readonly'),store=tx.objectStore('session'),q=store.get('current');let v;q.onsuccess=()=>{v=q.result;if(change){change(v);store.put(v,'current');}};tx.oncomplete=()=>{d.close();resolve(v);};tx.onerror=()=>reject(tx.error);};r.onerror=()=>reject(r.error);});}
try{
 let e=await env();e.$('open-text').click();e.$('source-text').value=raw;e.$('source-submit').click();await until(()=>e.w.document.querySelectorAll('.node').length===12);
 e.$('node-list-toggle').click();e.$('node-category-object').click();e.w.document.querySelector('[data-list-node="購入申請"] .node-navigate').click();
 assert.equal(e.$('detail').querySelector('h1').textContent,'購入申請');assert.equal(e.$('detail').querySelectorAll('[data-transition]').length,13);
 assert.match(e.$('detail').textContent,/未記載の操作は未決/);assert.doesNotMatch(e.$('detail').querySelector('.markdown').textContent,/state-meta/);
 e.$('detail').querySelector('.state-transition-panel button').click();assert.equal(e.$('detail').querySelector('.state-transition-panel'),null);assert.equal(e.$('detail').querySelector('h1').textContent,'備品購入を申請する');
 e.$('node-category-object').click();e.w.document.querySelector('[data-list-node="購入申請"] .node-navigate').click();
 e.w.dispatchEvent(new e.w.Event('blur'));for(let i=0;i<25;i++)await pause();assert.ok((await record()).document.design.objectStateTransitions);e.w.close();
 await record(v=>v.document.design.objectStateTransitions={購入申請:{error:'forged'}});
 e=await env();assert.equal(e.$('detail').querySelectorAll('[data-transition]').length,13);assert.doesNotMatch(e.$('detail').textContent,/forged/);
 console.log('State transition real app DOM: Object selection, source hidden in formatted view, Activity navigation, reload and source authority passed (no geometry claim)');
}finally{windows.forEach(w=>w.close());}
