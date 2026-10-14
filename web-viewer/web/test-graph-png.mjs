// Bounds/serialization/unit failure models, separate from real PNG browser tests.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {imageSize,snapshotGraph,pngName,saveGraphPng} from '../src/graph-png.ts';

assert.deepEqual(imageSize([{x:-100,y:50,width:260,height:68}]),{bounds:{x:-124,y:26,width:308,height:116},width:616,height:232,scale:2});
assert.equal(imageSize([{x:0,y:0,width:5000,height:1000}]).width,8192);
assert.ok(imageSize([{x:0,y:0,width:3000,height:3000}]).width**2<=16_000_000);
assert.throws(()=>imageSize([]),/項目がありません/);
for(const boxes of [[{x:0,y:0,width:9000,height:1}],[{x:0,y:0,width:5000,height:5000}]])assert.throws(()=>imageSize(boxes),/大きすぎる/);
for(const value of [NaN,Infinity])assert.throws(()=>imageSize([{x:value,y:0,width:1,height:1}]),/範囲/);
assert.throws(()=>imageSize([{x:0,y:0,width:-1,height:1}]),/範囲/);
assert.equal(pngName('../日本語:図.md'),'alder-_日本語_図.png');assert.equal(pngName('...'),'alder-graph.png');

const css=readFileSync('src/style.css','utf8');
const w=new JSDOM(`<style>${css}</style><div id="nodes"><div class="node business" style="left:-100px;top:50px"><span class="who-badge" style="--role-color:#2563eb"><svg viewBox="0 0 24 24"><path d="M0 0L2 2"/></svg></span><span class="node-text"><span class="review-kind">Activity · 範囲内</span><span class="node-name">日本語の長い名前</span><small>担当者</small></span></div></div><svg id="edges"><defs><marker id="arrow"><path class="arrow" d="M0 0L10 5L0 10Z"/></marker></defs><path class="edge" d="M-80 60C20 -100 120 -100 160 60" marker-end="url(#arrow)"/><text class="edge-label" x="30" y="-90">長い日本語ラベル</text></svg>`,{url:'https://viewer.test/'}).window;
Object.assign(globalThis,{document:w.document,window:w,getComputedStyle:w.getComputedStyle.bind(w),XMLSerializer:w.XMLSerializer});
const nodes=w.document.querySelector('#nodes'),edges=w.document.querySelector('#edges'),card=nodes.firstElementChild;
Object.defineProperties(card,{offsetWidth:{value:260},offsetHeight:{value:68}});
edges.querySelector('.edge').getBBox=()=>({x:-80,y:-60,width:240,height:120});
edges.querySelector('.edge-label').getBBox=()=>({x:-200,y:-100,width:460,height:20});
const original=nodes.outerHTML+edges.outerHTML;
for(const theme of ['light','dark']){
 w.document.documentElement.dataset.theme=theme;
 const image=snapshotGraph(nodes,edges,theme==='light'?'#f6f6f6':'#111d28'),parsed=new w.DOMParser().parseFromString(image.svg,'image/svg+xml');
 assert.equal(parsed.querySelector('parsererror'),null);
 assert.deepEqual(image.bounds,{x:-236,y:-136,width:532,height:278});
 assert.equal(parsed.querySelector('g').getAttribute('transform'),'translate(236 136)');
 assert.equal(parsed.querySelector('.node').style.left,'136px');assert.equal(parsed.querySelector('.node').style.top,'186px');
 assert.equal(parsed.querySelector('foreignObject').getAttribute('width'),'532');
 assert.equal(parsed.querySelector('.edge').getAttribute('marker-end'),'url(#arrow)');
 assert.match(parsed.querySelector('.node').getAttribute('style'),/background-color:/);
 assert.match(image.svg,/日本語の長い名前/);assert.match(image.svg,/長い日本語ラベル/);
 assert.ok(!image.svg.includes('https:')&&!image.svg.includes('id="nodes"')&&!image.svg.includes('id="edges"'));
 assert.equal(nodes.outerHTML+edges.outerHTML,original,'source DOM untouched');
}
const base=snapshotGraph(nodes,edges,'#fff');
nodes.style.transform='scale(.25)';nodes.style.left='3000px';nodes.style.width='100000px';edges.setAttribute('viewBox','-1000 -2000 50000 90000');
assert.deepEqual(snapshotGraph(nodes,edges,'#fff'),base,'camera wrappers never change image bounds or styles');
card.remove();assert.throws(()=>snapshotGraph(nodes,edges,'#fff'),/項目がありません/);nodes.append(card);
const excess=w.document.createElement('div');excess.innerHTML='<span></span>'.repeat(4001);nodes.append(excess);
assert.throws(()=>snapshotGraph(nodes,edges,'#fff'),/大きすぎる/);excess.remove();
const text=w.document.createTextNode('a'.repeat(1_000_001));nodes.append(text);assert.throws(()=>snapshotGraph(nodes,edges,'#fff'),/大きすぎる/);text.remove();

// Pixel generation failures must release the bitmap/canvas; native download and
// nonblank pixels are verified separately in Chrome, not by these mocks.
let canvas,urlCreated=0,revoked=0,clicked=0,imageCount=0;
globalThis.Image=class{constructor(){imageCount++;}set src(value){if(value)queueMicrotask(()=>this.onload?.());}};
const create=w.document.createElement.bind(w.document);
w.document.createElement=(name)=>{const element=create(name);if(name==='canvas'){canvas=element;element.getContext=()=>({drawImage(){}});element.toBlob=callback=>callback(new Blob(['png'],{type:'image/png'}));}if(name==='a')element.click=()=>clicked++;return element;};
globalThis.URL={createObjectURL(){urlCreated++;return 'blob:local';},revokeObjectURL(){revoked++;}};
const timeout=w.setTimeout.bind(w);w.setTimeout=(callback,delay)=>timeout(callback,delay===1500?0:delay);
await saveGraphPng(base,'test.md');assert.equal(clicked,1);assert.equal(canvas.width,0);assert.equal(canvas.height,0);assert.equal(w.document.querySelector('a'),null);
await new Promise(r=>setTimeout(r,10));assert.equal(urlCreated,revoked);
const successfulCreate=w.document.createElement;
w.document.createElement=(name)=>{const element=successfulCreate(name);if(name==='canvas')element.toBlob=callback=>callback(null);return element;};
await assert.rejects(saveGraphPng(base,'test'),/PNG画像/);assert.equal(canvas.width,0);assert.equal(clicked,1);
w.document.createElement=(name)=>{const element=successfulCreate(name);if(name==='canvas')element.getContext=()=>null;return element;};
await assert.rejects(saveGraphPng(base,'test'),/メモリ/);assert.equal(canvas.width,0);assert.equal(clicked,1);
globalThis.Image=class{set src(value){if(value)queueMicrotask(()=>this.onerror?.());}};
await assert.rejects(saveGraphPng(base,'test'),/ブラウザー/);assert.equal(clicked,1);
w.close();
console.log(JSON.stringify({passed:9,checks:['signed full bounds and margin','2x or capped readable resolution','empty/invalid/oversized limits','safe Japanese filename','HTML/SVG theme style serialization','long label includes full measured bounds','zoom/scroll/camera independence','source DOM unchanged','raster failures and URL/canvas cleanup']}));
