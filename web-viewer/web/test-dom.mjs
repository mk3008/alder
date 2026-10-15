// DOM/IndexedDB model regression tests. This is not a real-browser test.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {build} from 'esbuild';

const markdown=readFileSync(new URL('./authorities/business-design.md',import.meta.url),'utf8');
const compiled=await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}});
const code=compiled.outputFiles[0].text;
const tick=()=>new Promise(r=>setTimeout(r,25));
const restored=async $=>{for(let i=0;i<120&&$('open').disabled;i++)await tick();assert.equal($('open').disabled,false);};
const deferred=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};};
const file=(name,text=markdown)=>({name,text:async()=>text});
function createWindow(indexedDB=new IDBFactory()){
 const dom=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window;w.indexedDB=indexedDB;w.structuredClone=structuredClone;
 w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};
 w.eval(code);
 return {w,dom,$:id=>w.document.getElementById(id)};
}
const checks=[];
const {w,dom,$}=createWindow();
assert.equal($('open').disabled,true);assert.equal($('theme').disabled,true);await $('open').onclick();$('theme').onclick();assert.equal(w.document.querySelectorAll('.tab').length,0);
await restored($);$('layout-lock').click();assert.equal($('open').disabled,false);checks.push('restore disables conflicting open');
let selected=file('first.md'),permission='granted',pending;
const h={getFile:async()=>pending?pending.promise:selected,queryPermission:async()=>permission,isSameEntry:async x=>x===h};
w.showOpenFilePicker=async()=>[h];
await $('open').onclick();assert.ok(w.document.querySelectorAll('.node').length>0);assert.equal($('refresh').hidden,false,'file handle source shows refresh');assert.equal($('refresh').disabled,false);
await $('open').onclick();assert.equal(w.document.querySelectorAll('.tab').length,1);checks.push('handle duplicate open focuses existing tab');
const first=w.document.querySelector('.node');const id=first.dataset.node;
assert.equal(first.tagName,'DIV');assert.equal(first.hasAttribute('tabindex'),false);
assert.equal(first.getAttribute('role'),'group');assert.equal(first.onkeydown,null);
$('open-menu-toggle').focus();first.focus();assert.equal(w.document.activeElement.id,'open-menu-toggle');
const initialPosition=[first.style.left,first.style.top];
for(const key of ['Enter',' ','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'])first.dispatchEvent(new w.KeyboardEvent('keydown',{key,shiftKey:true,bubbles:true}));
assert.deepEqual([first.style.left,first.style.top],initialPosition);assert.equal(first.classList.contains('selected'),false);
first.onpointerdown({button:0,clientX:0,clientY:0,pointerId:1,stopPropagation(){}});first.onpointerup({pointerId:1});
const picked=Array.from(w.document.querySelectorAll('.node')).find(n=>n.dataset.node===id);
assert.equal(picked.classList.contains('selected'),true);assert.match(picked.getAttribute('aria-label'),/選択中/);
assert.equal(w.document.activeElement.id,'open-menu-toggle');checks.push('shapes omit focus and keyboard commands; pointer selection retains toolbar focus');
const node=w.document.querySelector('.node');
const connected=()=>Array.from($('edges').querySelectorAll('.edge')).find(e=>e.querySelector('title').textContent.includes(node.dataset.node));
const oldPath=connected().getAttribute('d');
node.onpointerdown({button:0,clientX:0,clientY:0,pointerId:1,stopPropagation(){}});
node.onpointermove({clientX:100,clientY:70});
assert.notEqual(connected().getAttribute('d'),oldPath);
node.onpointerup({pointerId:1});checks.push('edges follow drag before pointerup');
const priorLeft=w.document.querySelector('.node').style.left;
selected=file('first.md');await $('refresh').onclick();
assert.equal(w.document.querySelector('.node').style.left,priorLeft);checks.push('update preserves existing coordinates');
selected=file('first.md','# invalid');await $('refresh').onclick();
assert.equal(w.document.querySelector('.node').style.left,priorLeft);assert.match($('status').textContent,/旧表示/);checks.push('parse failure preserves previous graph');
selected=file('first.md');pending=deferred();let reads=0;
h.getFile=async()=>{reads++;return pending.promise;};
const refresh=$('refresh').onclick();await tick();await $('refresh').onclick();assert.equal(reads,1);assert.equal($('refresh').disabled,true);assert.equal($('refresh').hidden,false,'in-flight refresh stays visible but disabled');
await w.document.querySelector('.close').onclick();pending.resolve(selected);await refresh;
assert.equal(w.document.querySelectorAll('.tab').length,0);assert.equal(w.document.querySelectorAll('.node').length,0);assert.equal($('refresh').hidden,true);assert.equal($('refresh').disabled,true);checks.push('duplicate refresh blocked and close discards in-flight update');
pending=undefined;h.getFile=async()=>selected;await $('open').onclick();permission='denied';
w.showOpenFilePicker=async()=>{throw Object.assign(new Error('cancelled'),{name:'AbortError'});};
await $('refresh').onclick();assert.equal(w.document.querySelectorAll('.tab').length,1);assert.equal($('refresh').disabled,false);checks.push('permission reselect cancellation keeps graph and allows retry');
// Function-bearing mock handles cannot be structured-cloned. A failed
// transactional refresh retains the exact Graph and exposes storage recovery.
const cloneFailureGraph=$('nodes').innerHTML;
$('status-close').click();permission='granted';await $('refresh').onclick();
assert.doesNotMatch($('status-text').textContent,/更新しました/);assert.equal($('status').dataset.key,'storage');assert.match($('status-text').textContent,/保存できません/);assert.equal($('save-actions').hidden,false);assert.equal($('nodes').innerHTML,cloneFailureGraph);checks.push('noncloneable mock handle cannot commit a refresh or mask storage recovery');
const permissionWait=deferred();h.queryPermission=()=>permissionWait.promise;
const latePermission=$('refresh').onclick();let pickerCalls=0;w.showOpenFilePicker=async()=>{pickerCalls++;return [h];};
await w.document.querySelector('.close').onclick();permissionWait.resolve('denied');await latePermission;assert.equal(pickerCalls,0);
h.queryPermission=async()=>'granted';await $('open').onclick();checks.push('close during permission query prevents stale picker');
w.showOpenFilePicker=undefined;
const fallback=$('fallback');Object.defineProperty(fallback,'files',{configurable:true,value:[file('second.md')]});await fallback.onchange();
assert.equal(w.document.querySelectorAll('.tab').length,2);assert.equal($('refresh').hidden,false,'reselection-only file shows refresh');assert.equal($('refresh').disabled,false);
const fallbackRefresh=$('refresh').onclick();const reselect=w.document.querySelector('input[type=file]:not(#fallback):not(#check-file)');
assert.ok(reselect);assert.equal($('refresh').hidden,false);assert.equal($('refresh').disabled,true);reselect.dispatchEvent(new w.Event('cancel'));await fallbackRefresh;assert.equal($('refresh').disabled,false);checks.push('fallback reselect cancellation allows retry');
const tab=w.document.querySelectorAll('.tab')[1];tab.querySelector('button').focus();tab.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowLeft',altKey:true,bubbles:true}));
assert.equal(w.document.querySelector('.tab').dataset.key,w.document.activeElement.closest('.tab').dataset.key);checks.push('tab reorder retains focus');
const before=$('formattedMarkdownDrawer').style.width;$('resize').dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowLeft'}));assert.notEqual($('formattedMarkdownDrawer').style.width,before);
$('theme').click();assert.equal(w.document.documentElement.dataset.theme,'dark');$('drawer').click();assert.equal($('formattedMarkdownDrawer').hidden,true);checks.push('drawer resize and theme controls');
dom.window.close();

// Real fake-indexeddb round trip with serializable file-input tabs.
const db=new IDBFactory();const one=createWindow(db);await restored(one.$);
Object.defineProperty(one.$('fallback'),'files',{value:[file('restore.md')]});await one.$('fallback').onchange();
one.$('theme').click();await new Promise(r=>setTimeout(r,250));const key=one.w.document.querySelector('.tab').dataset.key;one.w.close();
const two=createWindow(db);assert.equal(two.$('open').disabled,true);await restored(two.$);
assert.equal(two.w.document.querySelector('.tab').dataset.key,key);assert.equal(two.w.document.documentElement.dataset.theme,'dark');two.w.close();checks.push('IndexedDB session restoration round trip');

// Script/link/image text must remain inert.
const unsafe=markdown+'\n<script>window.pwned=true</script>\n<img src="https://invalid.test" onerror="window.pwned=true">';
const three=createWindow();await restored(three.$);Object.defineProperty(three.$('fallback'),'files',{value:[file('safe.md',unsafe)]});await three.$('fallback').onchange();
three.$('scope-outside').click();three.$('node-category-activity').click();three.w.document.querySelector('[data-list-node="同期漏れ検査"] .node-navigate').click();assert.match(three.$('detail').textContent,/<script>/);assert.equal(three.w.pwned,undefined);assert.equal(three.$('detail').querySelectorAll('script,img,a').length,0);three.w.close();checks.push('Markdown remains inert text');
console.log(JSON.stringify({model:'jsdom + fake-indexeddb; mocked file handles/pointer capture',checks,passed:checks.length},null,2));
