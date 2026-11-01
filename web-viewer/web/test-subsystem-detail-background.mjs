import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';

const authorityPath='verification/subsystem-detail-background.check-items.json';
const authorityHash='2ef0aa3aff70d8fc4e033cf76bce898f220eac7223dd2049d8f24a5295e28e00';
const checkAuthority=()=>assert.equal(createHash('sha256').update(readFileSync(authorityPath)).digest('hex'),authorityHash);
checkAuthority();
const pkg=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v7-value-independent-review.json','utf8'));
const bundle=async entry=>(await build({entryPoints:[entry],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}})).outputFiles[0].text;
const [main,canvas]=await Promise.all([bundle('src/main.ts'),bundle('src/concept-canvas.js')]);
const p=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/app/index.html',runScripts:'outside-only',pretendToBeVisual:true}).window;
p.indexedDB=new IDBFactory();p.structuredClone=structuredClone;p.TextEncoder=TextEncoder;p.HTMLElement.prototype.scrollIntoView=()=>{};p.eval(main);
async function until(test){for(let i=0;i<500;i++){if(test())return;await new Promise(resolve=>setTimeout(resolve,10));}throw Error('UI did not become ready');}
await until(()=>!p.document.querySelector('#open').disabled);p.document.querySelector('#open-text').click();p.document.querySelector('#source-text').value=JSON.stringify(pkg);await p.document.querySelector('#source-submit').onclick();
const children=[];
function connect(frame){
 const c=new JSDOM(readFileSync('concept.html','utf8'),{url:'https://viewer.test/app/concept.html',runScripts:'outside-only',pretendToBeVisual:true}).window;
 c.scrollTo=()=>{};c.HTMLElement.prototype.scrollTo=function(x,y){this.scrollLeft=x;this.scrollTop=y;};c.HTMLElement.prototype.scrollIntoView=()=>{};c.HTMLElement.prototype.setPointerCapture=()=>{};c.HTMLElement.prototype.hasPointerCapture=()=>false;c.SVGElement.prototype.focus=()=>{};
 c.HTMLCanvasElement.prototype.getContext=()=>({measureText:value=>({width:value.length*14})});
 const parent={location:{origin:'https://viewer.test',protocol:'https:'},postMessage:(data,origin)=>p.dispatchEvent(new p.MessageEvent('message',{data,origin,source:frame.contentWindow}))};Object.defineProperty(c,'parent',{value:parent});
 Object.defineProperty(frame,'contentDocument',{value:c.document,configurable:true});Object.defineProperty(frame.contentWindow,'postMessage',{value:(data,origin)=>c.dispatchEvent(new c.MessageEvent('message',{data,origin,source:parent})),configurable:true});
 c.eval(canvas);frame.onload();const host=c.document.querySelector('.canvas');Object.defineProperty(host,'clientWidth',{value:800});Object.defineProperty(host,'clientHeight',{value:600});host.getBoundingClientRect=()=>({left:0,top:0,right:800,bottom:600,width:800,height:600});children.push(c);return c;
}
function pointer(c,target,type,pointerType='mouse',x=10,y=10){const e=new c.MouseEvent(type,{bubbles:true,cancelable:true,button:0,clientX:x,clientY:y});Object.defineProperties(e,{pointerId:{value:1},pointerType:{value:pointerType}});target.dispatchEvent(e);}
const title=()=>p.document.querySelector('.concept-related .shell-heading strong').textContent;
const selected=()=>!p.document.querySelector('.concept-selection').hidden;
const saved=()=>JSON.parse(p.sessionStorage.getItem('alder-explorer-v1:/app/index.html'));
let firstFrame,firstChild;
for(const group of pkg.documents.find(d=>d.kind==='conceptModel').reviewGroups){
 p.document.querySelector(`[data-explorer-key="concept:${group.id}"]`).click();
 const frame=p.document.querySelector(`iframe[data-concept-view="${group.id}"]`),c=connect(frame),host=c.document.querySelector('.canvas');
 if(!firstFrame){firstFrame=frame;firstChild=c;}
 assert.equal(title(),group.title);const overview=p.document.querySelector('.data-review-overview').textContent;assert(overview.includes(group.description));
 const select=()=>c.document.querySelector('.node .concept-select').dispatchEvent(new c.KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));
 const checkRestored=()=>{assert.equal(title(),group.title);assert.equal(selected(),false);assert.equal(c.document.querySelectorAll('.node.selected').length,0);assert.equal(p.document.querySelector('.data-review-overview').textContent,overview);assert.equal(saved().selected[group.id],undefined);};
 select();assert(selected());assert(c.document.querySelector('.node.selected'));assert.equal(p.document.querySelector('.concept-selection-clear').hidden,false);
 pointer(c,host,'pointerdown');pointer(c,host,'pointermove','mouse',25,10);pointer(c,host,'pointerup','mouse',25,10);assert(selected(),'panning is not a background click');
 pointer(c,host,'pointerdown');pointer(c,host,'pointerup');checkRestored();
 select();p.document.querySelector('.concept-selection-clear').click();checkRestored();
 select();host.dispatchEvent(new c.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));checkRestored();
 select();pointer(c,host,'pointerdown','touch');pointer(c,host,'pointerup','touch');checkRestored();
 if(frame!==firstFrame){select();p.dispatchEvent(new p.MessageEvent('message',{origin:'https://attacker.test',source:frame.contentWindow,data:{type:'alder-concept-clear-selection'}}));p.dispatchEvent(new p.MessageEvent('message',{origin:p.location.origin,source:firstFrame.contentWindow,data:{type:'alder-concept-clear-selection'}}));assert(selected(),'foreign origin and inactive frame cannot change selection');pointer(c,host,'pointerdown');pointer(c,host,'pointerup');checkRestored();}
}
p.document.querySelector('[data-explorer-key="concept:group-request"]').click();
const requestFrame=p.document.querySelector('iframe[data-concept-view=group-request]');assert.equal(requestFrame,firstFrame);
if(p.document.querySelector('.concept-related').hidden)p.document.querySelector('#drawer').click();
p.document.querySelector('[data-sample=request-submitted]').click();assert.equal(p.document.querySelector('.data-examples-panel').dataset.dataExample,'request-submitted');
firstChild.document.querySelector('.node .concept-select').dispatchEvent(new firstChild.KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));
p.document.querySelector('.concept-selection-clear').click();assert.equal(p.document.querySelector('.data-examples-panel').dataset.dataExample,'request-submitted');assert.equal(p.document.querySelector('.data-examples-panel').hidden,false);assert.equal(p.document.querySelector('.concept-example-back').hidden,false);
checkAuthority();for(const child of children)child.close();p.close();
console.log('SUBSYSTEM-RETURN-001..004: all four groups, parent/iframe selection, mouse, touch, keyboard, pan, samples, persistence and message boundaries verified in DOM.');
