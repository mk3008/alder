import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {build} from 'esbuild';
import {IDBFactory} from 'fake-indexeddb';
const raw=readFileSync(new URL('../../tools/fixtures/state-transitions/purchase-request.md',import.meta.url),'utf8');
const css=readFileSync('src/style.css','utf8');
const code=(await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}})).outputFiles[0].text;
const pause=()=>new Promise(r=>setTimeout(r,20));
async function until(check){for(let i=0;i<100&&!check();i++)await pause();assert.ok(check());}
const db=new IDBFactory(),windows=[];
async function env(){const w=new JSDOM('<style>'+css+'</style><div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);w.indexedDB=db;w.structuredClone=structuredClone;w.HTMLElement.prototype.scrollIntoView=()=>{};w.eval(code);const $=id=>w.document.getElementById(id);await until(()=>!$('open-text').disabled);return {w,$};}
async function record(change){return new Promise((resolve,reject)=>{const r=db.open('alder-web-viewer',1);r.onsuccess=()=>{const d=r.result,tx=d.transaction('session',change?'readwrite':'readonly'),store=tx.objectStore('session'),q=store.get('current');let v;q.onsuccess=()=>{v=q.result;if(change){change(v);store.put(v,'current');}};tx.oncomplete=()=>{d.close();resolve(v);};tx.onerror=()=>reject(tx.error);};r.onerror=()=>reject(r.error);});}
const mode=(e,name)=>e.$('detail-mode-'+name);
const clickNode=(e,id)=>e.w.document.querySelector('[data-list-node="'+id+'"] .node-navigate').click();
try{
 let e=await env();e.$('open-text').click();e.$('source-text').value=raw;e.$('source-submit').click();await until(()=>e.w.document.querySelectorAll('.node').length===12);
 e.$('node-list-toggle').click();e.$('node-category-object').click();clickNode(e,'購入申請');
 assert.equal(e.$('detail').querySelector('h1').textContent,' : 購入申請');assert.ok(e.$('detail').querySelector('h1 svg'));
 assert.deepEqual([...e.$('detail').querySelectorAll('[role=tab]')].map(t=>t.textContent),['要素','状態遷移','チェック項目']);
 assert.equal(mode(e,'business').getAttribute('aria-selected'),'true');assert.equal(e.$('detail').querySelectorAll('[data-transition]').length,0);
 mode(e,'states').click();assert.equal(e.$('detail').querySelectorAll('[data-transition]').length,13);
 assert.equal(e.$('detail').querySelectorAll('.state-diagram path[data-transitions]').length,11);
 assert.equal(e.$('detail').querySelectorAll('.state-diagram path[stroke-dasharray]').length,5);
 assert.doesNotMatch(e.$('detail').textContent,/部分定義：|図は横にスクロールできます/);
 const svg=e.$('detail').querySelector('.state-diagram'),shape=id=>svg.querySelector('[data-state="'+id+'"]');
 shape('申請済み').dispatchEvent(new e.w.MouseEvent('click',{bubbles:true}));assert.equal(shape('申請済み').getAttribute('aria-pressed'),'true');
 assert.ok(shape('承認済み').classList.contains('review-neighbor'));assert.ok(shape('購入済み').classList.contains('muted'));
 assert.equal(e.w.getComputedStyle(shape('購入済み')).opacity,'1');
 const lines=[...svg.querySelector('[data-activity="備品購入を申請する"]').querySelectorAll('tspan')];
 assert.ok(lines.find(n=>n.textContent==='・通常').classList.contains('review-related'));
 for(const text of ['・例外：作業中断','・例外：権限判定不成立'])assert.ok(lines.find(n=>n.textContent===text).classList.contains('muted'));
 assert.equal(svg.querySelectorAll('path.edge.review-related').length,5);
 shape('下書き').dispatchEvent(new e.w.KeyboardEvent('keydown',{key:'Enter',bubbles:true}));assert.equal(shape('下書き').getAttribute('aria-pressed'),'true');
 shape('差戻し').dispatchEvent(new e.w.KeyboardEvent('keydown',{key:' ',bubbles:true}));assert.equal(shape('差戻し').getAttribute('aria-pressed'),'true');
 svg.dispatchEvent(new e.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(svg.querySelectorAll('[aria-pressed=true]').length,0);assert.equal(svg.querySelectorAll('.muted').length,0);
 mode(e,'states').dispatchEvent(new e.w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));assert.equal(mode(e,'checks').getAttribute('aria-selected'),'true');
 mode(e,'checks').dispatchEvent(new e.w.KeyboardEvent('keydown',{key:'Home',bubbles:true}));assert.equal(mode(e,'business').getAttribute('aria-selected'),'true');
 clickNode(e,'申請者');assert.equal(mode(e,'states').disabled,true);
 mode(e,'business').dispatchEvent(new e.w.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));assert.equal(mode(e,'checks').getAttribute('aria-selected'),'true');
 clickNode(e,'購入申請');mode(e,'states').click();e.$('detail').querySelector('.state-transition-panel button').click();
 assert.equal(e.$('detail').querySelector('.state-transition-panel'),null);assert.equal(e.$('detail').querySelector('h1').textContent,' 備品購入を申請する');
 assert.deepEqual([...e.$('detail').querySelectorAll('[role=tab]')].map(t=>t.textContent),['基本','手順と結果','課題']);assert.ok(e.$('detail').querySelector('.who-badge svg'));
 assert.equal(mode(e,'business').getAttribute('aria-selected'),'true');assert.match(e.$('activity-detail-content').textContent,/Procedure/);assert.match(e.$('activity-detail-content').textContent,/Result/);assert.doesNotMatch(e.$('activity-detail-content').textContent,/Why/);
 mode(e,'basic').click();assert.match(e.$('activity-detail-content').textContent,/Why/);assert.doesNotMatch(e.$('activity-detail-content').textContent,/Procedure/);
 e.$('node-category-object').click();clickNode(e,'購入申請');assert.equal(mode(e,'business').getAttribute('aria-selected'),'true');mode(e,'states').click();
 e.w.dispatchEvent(new e.w.Event('blur'));for(let i=0;i<25;i++)await pause();assert.ok((await record()).document.design.objectStateTransitions);e.w.close();
 await record(v=>v.document.design.objectStateTransitions={購入申請:{error:'forged'}});
 e=await env();mode(e,'states').click();assert.equal(e.$('detail').querySelectorAll('[data-transition]').length,13);assert.doesNotMatch(e.$('detail').textContent,/forged/);
 console.log('State/Activity tabs, disabled navigation, SVG adjacency and per-branch focus, neutral opacity, keyboard, Activity navigation, source-authoritative restore passed (no geometry claim)');
}finally{windows.forEach(w=>w.close());}
