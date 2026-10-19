import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {build} from 'esbuild';
import {IDBFactory} from 'fake-indexeddb';
const raw=readFileSync(new URL('../../tools/fixtures/object-medium/example.md',import.meta.url),'utf8');
const code=(await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}})).outputFiles[0].text;
const pause=()=>new Promise(r=>setTimeout(r,20));
async function until(check){for(let i=0;i<100&&!check();i++)await pause();assert.ok(check());}
const db=new IDBFactory(),windows=[];
async function env(){const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);w.indexedDB=db;w.structuredClone=structuredClone;w.HTMLElement.prototype.scrollIntoView=()=>{};w.eval(code);const $=id=>w.document.getElementById(id);await until(()=>!$('open-text').disabled);return {w,$};}
async function record(change){return new Promise((resolve,reject)=>{const r=db.open('alder-web-viewer',1);r.onsuccess=()=>{const d=r.result,tx=d.transaction('session',change?'readwrite':'readonly'),store=tx.objectStore('session'),q=store.get('current');let v;q.onsuccess=()=>{v=q.result;if(change){change(v);store.put(v,'current');}};tx.oncomplete=()=>{d.close();resolve(v);};tx.onerror=()=>reject(tx.error);};r.onerror=()=>reject(r.error);});}
try{
 let e=await env();e.$('open-text').click();e.$('source-text').value=raw.replace('PDF','<img src=x onerror=alert(1)>');e.$('source-submit').click();await until(()=>e.w.document.querySelector('.object-medium'));
 assert.equal(e.w.document.querySelector('[data-node="受付情報"] .object-medium').textContent,'<img src=x onerror=alert(1)>');assert.equal(e.w.document.querySelector('.object-medium img'),null);
 assert.equal(e.w.document.querySelector('[data-node="媒体未指定"] .object-medium'),null);
 e.w.document.querySelector('.activity-open').click();assert.equal(e.w.document.querySelector('[data-node="外部台帳"] .object-medium').textContent,'データベース / shared.employee_roles_authority_limits_2026');
 e.w.dispatchEvent(new e.w.Event('blur'));await until(()=>e.$('status-text').textContent!==undefined);for(let i=0;i<20;i++)await pause();const saved=await record();assert.ok(saved.document.design.markdown.includes('## Medium'));assert.ok(saved.document.design.objectMedia);
 e.w.close();await record(v=>v.document.design.objectMedia={受付情報:'stale',媒体未指定:'forged'});
 e=await env();await until(()=>e.w.document.querySelector('.object-medium'));assert.equal(e.w.document.querySelector('[data-node="受付情報"] .object-medium').textContent,'<img src=x onerror=alert(1)>');assert.equal(e.w.document.querySelector('[data-node="媒体未指定"] .object-medium'),null);
 e.w.close();await record(v=>{v.document.design.markdown=v.document.design.markdown.replace(/## Medium\n\n[^\n]+\n/g,'');v.document.design.objectMedia={受付情報:'stale'};});
 e=await env();assert.equal(e.w.document.querySelector('.object-medium'),null);assert.ok(e.w.document.querySelector('.node'));
 console.log('Object media real app DOM: literal text, detail, save/restore, source authority and legacy passed (no geometry claim)');
}finally{windows.forEach(w=>w.close());}
