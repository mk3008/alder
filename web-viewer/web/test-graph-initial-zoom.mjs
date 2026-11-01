import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
const authorityPath='verification/graph-initial-zoom.check-items.json',hash='1ab9458d7ed5c2387f39b2744a5188b0c1d8db55ab88256b2f0b6908a6a2e428';
const verify=bytes=>assert.equal(createHash('sha256').update(bytes).digest('hex'),hash);verify(readFileSync(authorityPath));assert.throws(()=>verify(Buffer.from('{}')));
const ids=JSON.parse(readFileSync(authorityPath)).checks.map(c=>c.id),covered=[];
const model=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-concepts-v2-beta.json','utf8'));
const business=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v2-beta.json','utf8')).documents.find(d=>d.kind==='businessDesign');
const code=(await build({entryPoints:['src/subsystem-overview.ts'],bundle:true,write:false,format:'iife',globalName:'Overview'})).outputFiles[0].text;
async function open(width,saved){
 const w=new JSDOM('<div id="host"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
 Object.defineProperty(w.HTMLElement.prototype,'clientWidth',{get(){return width;}});
 // Model a diagram wider than the viewport so the previous fit-to-content path is exercised.
 w.SVGElement.prototype.getBoundingClientRect=function(){return {left:0,top:0,right:width+1000,bottom:800,width:width+1000,height:800};};
 w.HTMLElement.prototype.getBoundingClientRect=function(){return {left:0,top:0,right:width,bottom:600,width,height:600};};
 if(saved!==undefined)w.localStorage.setItem('alder-subsystem-overview-v2:/:purchase',JSON.stringify({zoom:saved}));
 w.eval(code+';globalThis.Overview=Overview;');const overview=w.Overview.createSubsystemOverview(w.document,{model,business},'purchase',()=>{},()=>{});w.document.querySelector('#host').append(overview.root);await new Promise(r=>w.requestAnimationFrame(()=>w.requestAnimationFrame(r)));return{w,root:overview.root};
}
for(const width of [320,1280]){const {w,root}=await open(width);try{assert.equal(root.querySelector('.canvas-zoom').textContent.trim(),'100%',`fresh ${width}px canvas`);root.querySelector('[data-review-group]').dispatchEvent(new w.MouseEvent('click',{bubbles:true}));w.dispatchEvent(new w.Event('resize'));await new Promise(r=>w.requestAnimationFrame(r));assert.equal(root.querySelector('.canvas-zoom').textContent.trim(),'100%');assert(root.querySelector('.diagram-viewport'));}finally{w.close();}}
covered.push('GRAPH-ZOOM-001','GRAPH-ZOOM-003');
const saved=await open(400,.62);try{assert.equal(saved.root.querySelector('.canvas-zoom').textContent.trim(),'62%');saved.root.querySelector('.zoom-in').click();assert.notEqual(saved.root.querySelector('.canvas-zoom').textContent.trim(),'62%');assert.notEqual(JSON.parse(saved.w.localStorage.getItem('alder-subsystem-overview-v2:/:purchase')).zoom,.62);}finally{saved.w.close();}covered.push('GRAPH-ZOOM-002');
assert.deepEqual([...covered].sort(),ids.sort());assert.throws(()=>assert.deepEqual(covered.slice(1).sort(),ids.sort()));verify(readFileSync(authorityPath));
console.log(JSON.stringify({checks:covered,scope:'subsystem overview DOM; other graph types and actual dimensions verified by browser suite'}));
