import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {build} from 'esbuild';
import {IDBFactory} from 'fake-indexeddb';
const raw=readFileSync(new URL('../../tools/fixtures/sr-dependencies/purchase-request.md',import.meta.url),'utf8');
const code=(await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}})).outputFiles[0].text;
const pause=()=>new Promise(r=>setTimeout(r,20));
async function until(check){for(let i=0;i<100&&!check();i++)await pause();assert.ok(check());}
const db=new IDBFactory(),windows=[];
async function env(){const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);w.indexedDB=db;w.structuredClone=structuredClone;w.HTMLElement.prototype.scrollIntoView=()=>{};w.eval(code);const $=id=>w.document.getElementById(id);await until(()=>!$('open-text').disabled);return {w,$};}
async function record(change){return new Promise((resolve,reject)=>{const r=db.open('alder-web-viewer',1);r.onsuccess=()=>{const d=r.result,tx=d.transaction('session',change?'readwrite':'readonly'),store=tx.objectStore('session'),q=store.get('current');let v;q.onsuccess=()=>{v=q.result;if(change){change(v);store.put(v,'current');}};tx.oncomplete=()=>{d.close();resolve(v);};tx.onerror=()=>reject(tx.error);};r.onerror=()=>reject(r.error);});}
try{
 let e=await env();e.$('open-text').click();e.$('source-text').value=raw;e.$('source-submit').click();await until(()=>e.w.document.querySelectorAll('.sr-dependency-badge').length===2);
 const button=e.w.document.querySelector('[data-node="認証基盤"] .sr-dependency-badge');button.click();assert.equal(e.$('detail').querySelector('h1').textContent,' : 認証基盤');assert.ok(e.$('detail').textContent.includes('SR照合状況：未照合'));assert.equal(e.w.document.activeElement.id,'sr-dependency-heading');assert.equal(e.$('detail').querySelectorAll('.sr-dependency-panel li button').length,5);assert.equal(e.w.document.querySelector('[data-node="申請者"] .sr-dependency-badge'),null);
 e.$('detail').querySelector('.sr-dependency-panel li button').click();assert.equal(e.$('detail').querySelector('.sr-dependency-panel'),null);
 e.w.document.querySelector('.activity-open').click();assert.equal(e.w.document.querySelectorAll('.sr-dependency-badge').length,2);
 e.w.dispatchEvent(new e.w.Event('blur'));for(let i=0;i<25;i++)await pause();assert.ok((await record()).document.design.objectSRDependencies);e.w.close();await record(v=>v.document.design.objectSRDependencies={申請者:['forged']});
 e=await env();assert.equal(e.w.document.querySelectorAll('.sr-dependency-badge').length,2);assert.equal(e.w.document.querySelector('[data-node="申請者"] .sr-dependency-badge'),null);e.w.close();
 await record(v=>{v.document.design.markdown=v.document.design.markdown.replace(/## SR Dependencies\n\n- [^\n]+\n\n/g,'');v.document.design.objectSRDependencies={申請者:['forged']};});
 e=await env();assert.equal(e.w.document.querySelector('.sr-dependency-badge'),null);assert.ok(e.w.document.querySelector('.node'));console.log('SR dependency real app DOM: drawer, focus, related activities, detail tab, reload/source authority and legacy passed (no geometry claim)');
}finally{windows.forEach(w=>w.close());}
