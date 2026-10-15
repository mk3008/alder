import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {build} from 'esbuild';
import {IDBFactory} from 'fake-indexeddb';
const markdown=readFileSync('../docs/examples/purchase-check-review.ja.md','utf8'),bd=readFileSync('../business-design/purchase-request/README.md','utf8');
const app=await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}});
const idb=new IDBFactory();
function boot(){const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;w.indexedDB=idb;w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.scrollIntoView=()=>{};w.eval(app.outputFiles[0].text);return w;}
let w=boot();const $=id=>w.document.getElementById(id),tick=()=>new Promise(r=>setTimeout(r,10));
async function until(fn){for(let i=0;i<300;i++){if(fn())return;await tick();}throw Error('Timed out: '+fn.toString());}
async function open(raw){$('open-text').click();$('source-text').value=raw;$('source-submit').click();await until(()=>$('source-dialog').hidden);}
async function file(raw,name='checks.md'){const input=$('check-file');Object.defineProperty(input,'files',{value:[{name,size:raw.length,text:async()=>raw}]});input.dispatchEvent(new w.Event('change'));await until(()=>!$('detail').textContent.includes('読み込み・保存しています'));}
const select=name=>{if($('node-list-drawer').hidden)$('node-list-toggle').click();w.document.querySelector(`[data-list-node="${name}"] .node-navigate`).click();};
try{
 await until(()=>!$('open-text').disabled);await open(bd);const graph=()=>w.document.querySelectorAll('.node').length,initial=graph();
 await file(markdown);assert.ok($('check-confirm'));assert.equal($('tabs').children.length,1);assert.equal(w.document.querySelectorAll('.check-item').length,0,'unverified candidate is not associated silently');
 $('check-confirm').click();await until(()=>!$('check-confirm'));select('購入申請を却下する');assert.ok(w.document.querySelector('[data-check-id="JA-EX-04"]'));assert.equal(w.document.querySelectorAll('[data-check-id="JA-EX-04"]').length,1);
 select('承認済み備品を購入する');assert.ok(w.document.querySelector('[data-check-id="JA-EX-04"]'));assert.match($('detail').textContent,/人間レビュー状態：未レビュー/);select('購入申請を承認する');assert.match(w.document.querySelector('[data-check-id="JA-EX-Q01"]').textContent,/人間レビュー状態：要確認/);
 assert.equal($('detail').querySelector('.check-source').textContent,markdown);
 assert.equal($('detail').querySelectorAll('img,script,a').length,0,'source links/HTML are inert');
 $('detail-mode-business').click();assert.match($('detail').textContent,/# Activity 購入申請を承認する|購入申請を承認する/);$('detail-mode-checks').click();
 $('edit-markdown').click();$('source-text').value=bd+'\n';$('source-text').dispatchEvent(new w.Event('input'));
 await file('not check');assert.match($('detail').textContent,/読み込めません/);assert.equal($('source-text').value,bd+'\n');assert.ok(w.document.querySelector('[data-check-id="JA-EX-Q01"]'));assert.equal(graph(),initial);
 // Failure to read local file also leaves the association and pending editor intact.
 const input=$('check-file');Object.defineProperty(input,'files',{value:[{name:'denied.md',size:1,text:async()=>{throw Error('read denied');}}]});input.dispatchEvent(new w.Event('change'));await until(()=>$('detail').textContent.includes('read denied'));assert.equal($('source-text').value,bd+'\n');
 $('source-submit').click();await until(()=>$('source-dialog').hidden);assert.equal(w.document.querySelectorAll('.check-item').length,0,'BD edit invalidates manual confirmation');
 const reconfirm=Array.from($('detail').querySelectorAll('button')).find(b=>b.textContent==='現在のBDとの対応を確認して表示する');assert.ok(reconfirm);reconfirm.click();await until(()=>!!w.document.querySelector('[data-check-id="JA-EX-Q01"]'));
 await open(bd.replace(/^# .+/,'# another BD'));assert.equal($('tabs').children.length,2);$('detail-mode-checks').click();select('購入申請を承認する');assert.equal(w.document.querySelectorAll('.check-item').length,0,'another BD tab never inherits Checks');
 $('tabs').querySelector('.tab>button').click();assert.ok(w.document.querySelector('[data-check-id="JA-EX-Q01"]'));
 // URL loader reuses fetchMarkdown and refuses a different document despite same Activity names.
 const encoder=new TextEncoder();let response=markdown.replaceAll('purchase-request/README.md','other/README.md');w.fetch=async()=>new Response(encoder.encode(response),{headers:{'content-type':'text/plain'}});
 // Give this tab a URL identity through a third source tab, without altering the local tab.
 $('open-url').click();$('source-url').value='https://raw.githubusercontent.com/mk3008/alder/main/business-design/purchase-request/README.md';response=bd;$('source-submit').click();await until(()=>$('source-dialog').hidden);
 response=markdown.replaceAll('purchase-request/README.md','other/README.md');$('check-url').value='https://example.test/checks.md';$('check-url-submit').click();await until(()=>$('detail').textContent.includes('原典参照が'));assert.equal($('check-confirm'),null);assert.equal(w.document.querySelectorAll('.check-item').length,0);
 response=markdown;$('check-url').value='https://example.test/checks.md';$('check-url-submit').click();await until(()=>!!$('check-confirm'));$('check-confirm').click();await until(()=>!$('check-confirm'));select('購入申請を承認する');assert.ok(w.document.querySelector('[data-check-id="JA-EX-Q01"]'));
 response=markdown.replaceAll('purchase-request/README.md','other/README.md');$('check-url').value='https://example.test/checks.md';$('check-url-submit').click();await until(()=>$('detail').textContent.includes('原典参照が'));assert.ok(w.document.querySelector('[data-check-id="JA-EX-Q01"]'),'wrong replacement keeps existing association');
 response='broken';$('check-url').value='https://example.test/checks.md';$('check-url-submit').click();await until(()=>$('detail').textContent.includes('読み込めません'));assert.ok(w.document.querySelector('[data-check-id="JA-EX-Q01"]'));
 await until(()=>$('app').dataset.saveState==='saved');w.close();w=boot();await until(()=>!$('open').disabled);$('detail-mode-checks').click();select('購入申請を承認する');assert.ok(w.document.querySelector('[data-check-id="JA-EX-Q01"]'),'reload restores association without network');
 Array.from($('detail').querySelectorAll('button')).find(b=>b.textContent==='関連Checkを解除').click();await until(()=>!$('detail').textContent.includes('読込済み:'));assert.equal(graph(),initial);assert.equal(w.document.querySelectorAll('.check-item').length,0);
 console.log('related Check application DOM: file/URL, failure preservation, shared/unresolved, re-confirm, multi-tab, persistence and detach passed');
}finally{w.close();}
