import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';

const pkg=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v3-beta.json','utf8'));
const bundle=async entry=>(await build({entryPoints:[entry],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}})).outputFiles[0].text;
const [main,canvas]=await Promise.all([bundle('src/main.ts'),bundle('src/concept-canvas.js')]);
const p=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/app/index.html',runScripts:'outside-only',pretendToBeVisual:true}).window;
p.indexedDB=new IDBFactory();p.structuredClone=structuredClone;p.TextEncoder=TextEncoder;p.HTMLElement.prototype.scrollIntoView=()=>{};p.eval(main);
async function until(test){for(let i=0;i<500;i++){if(test())return;await new Promise(resolve=>setTimeout(resolve,10));}throw Error('UI did not become ready');}
await until(()=>!p.document.querySelector('#open').disabled);p.document.querySelector('#open-text').click();p.document.querySelector('#source-text').value=JSON.stringify(pkg);await p.document.querySelector('#source-submit').onclick();
p.document.querySelector('[data-explorer-key="concept:overview"]').click();
let frame=p.document.querySelector('iframe[data-concept-view="overview"]');assert(frame&&!frame.hidden);
function connect(frame,url='https://viewer.test/app/concept.html'){
 const c=new JSDOM(readFileSync('concept.html','utf8'),{url,runScripts:'outside-only',pretendToBeVisual:true}).window;
 c.scrollTo=()=>{};c.HTMLElement.prototype.scrollTo=function(x,y){this.scrollLeft=x;this.scrollTop=y;};c.HTMLElement.prototype.scrollIntoView=()=>{};c.HTMLElement.prototype.setPointerCapture=()=>{};c.HTMLElement.prototype.hasPointerCapture=()=>false;c.SVGElement.prototype.focus=()=>{};
 c.HTMLCanvasElement.prototype.getContext=()=>({measureText:value=>({width:value.length*14})});
 const parent={location:{origin:'https://viewer.test',protocol:'https:'},postMessage:(data,origin)=>p.dispatchEvent(new p.MessageEvent('message',{data,origin,source:frame.contentWindow}))};Object.defineProperty(c,'parent',{value:parent});
 Object.defineProperty(frame,'contentDocument',{value:c.document,configurable:true});
 Object.defineProperty(frame.contentWindow,'postMessage',{value:(data,origin)=>c.dispatchEvent(new c.MessageEvent('message',{data,origin,source:parent})),configurable:true});
 c.eval(canvas);c.dispatchEvent(new c.MessageEvent('message',{data:{type:'alder-concept-data'},origin:'https://attacker.test',source:parent}));assert.equal(c.document.querySelectorAll('[data-node]').length,0,'wrong origin must not initialize the canvas');frame.onload();return c;
}
let c=connect(frame,'about:srcdoc');assert.equal(c.document.querySelectorAll('[data-node]').length,6);
assert(c.document.querySelector('.graph-settings-toggle svg'),'toolbar icons are added after the asynchronous canvas renders');
assert(c.document.querySelector('[data-node="request"] .concept-open-action'),'overview has detail link');
c.document.querySelector('[data-node="preparation"] .concept-open-action').click();
frame=p.document.querySelector('iframe[data-concept-view="preparation"]');assert(frame&&!frame.hidden);c.close();c=connect(frame);
assert.equal(c.document.querySelector('[data-node="preparation"] .concept-open-action'),null,'current concept has no self link');
assert(c.document.querySelector('[data-node="request"] .concept-open-action'),'neighbor detail link remains');
c.document.querySelector('[data-node="request"] .concept-open-action').click();
assert.equal(p.document.querySelector('#concept-tab-request').getAttribute('aria-current'),'true');
assert(!p.document.querySelector('iframe[data-concept-view="request"]').hidden);
c.close();p.close();
console.log('UNIFIED-CONCEPT-004: actual parent/child message path, overview and current/neighbor navigation verified in DOM; real browser remains separate.');
