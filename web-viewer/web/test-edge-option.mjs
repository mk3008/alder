// Legacy no-Group input regression; the current Group sample is tested separately.
// DOM model: real application handlers and persisted Session, not rendered geometry.
import assert from 'node:assert/strict';
import {openDisplaySettingsDOM} from './toolbar-settings-control.mjs';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {build} from './legacy-viewer-fixture.mjs';
import {parseDesign} from '../src/graph.ts';
import {hiddenReadIndexes} from '../src/edge-visibility.ts';
const {outputFiles}=await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}});
const db=new IDBFactory(),windows=[];
const tick=()=>new Promise(r=>setTimeout(r,25));
async function open(){const dom=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true});const w=dom.window;windows.push(w);w.indexedDB=db;w.structuredClone=structuredClone;w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};w.eval(outputFiles[0].text);for(let i=0;i<120&&w.document.querySelector('#open').disabled;i++)await tick();return w.document;}
const d=await open(),$=id=>d.getElementById(id);
$('layout-lock').click();assert.equal($('prefer-write').checked,false);$('open-sample').click();
const design=parseDesign(readFileSync('web/authorities/ungrouped-alder.md','utf8')),before=JSON.stringify(design),hidden=hiddenReadIndexes(design.graph.relations,true);
assert.ok(hidden.size>0);const all=design.graph.relations.map((_,i)=>String(i));
const visible=()=>[...d.querySelectorAll('.edge')].map(n=>n.dataset.relation).sort((a,b)=>+a-+b);
assert.deepEqual(visible(),all);
const selected=d.querySelector('.node.business');selected.onpointerdown({button:0,clientX:0,clientY:0,pointerId:1,stopPropagation(){}});selected.onpointerup({pointerId:1});const selectedID=selected.dataset.node;
const positions=()=>[...d.querySelectorAll('.node')].map(n=>[n.dataset.node,n.style.left,n.style.top]);const initialPositions=positions();
openDisplaySettingsDOM(d);$('prefer-write').click();const expected=all.filter(i=>!hidden.has(+i));assert.deepEqual(visible(),expected);
assert.equal(d.querySelector('.node.selected').dataset.node,selectedID);
for(const label of d.querySelectorAll('.edge-label'))assert.ok(expected.includes(label.dataset.relation));
for(const edge of d.querySelectorAll('.edge')){const r=design.graph.relations[+edge.dataset.relation];assert.equal(edge.classList.contains('review-related'),r.from===selectedID||r.to===selectedID);assert.equal(edge.classList.contains('exception'),r.kind.endsWith('exception'));}
$('out').click();$('theme').click();assert.deepEqual(visible(),expected);assert.deepEqual(positions(),initialPositions);
await new Promise(r=>setTimeout(r,300));const restored=await open();assert.equal(restored.getElementById('prefer-write').checked,true);assert.equal(restored.querySelector('.node.selected').dataset.node,selectedID);assert.equal(restored.querySelectorAll('.edge').length,expected.length);
openDisplaySettingsDOM(restored);restored.getElementById('prefer-write').click();assert.equal(restored.querySelectorAll('.edge').length,all.length);assert.equal(restored.querySelectorAll('.edge-label').length,62,'same source caption is drawn once');assert.deepEqual([...restored.querySelectorAll('.edge-label')].flatMap(n=>n.dataset.relations.split(' ').map(Number)).sort((a,b)=>a-b),all.map(Number),'every relation retains a displayed caption');
await new Promise(r=>setTimeout(r,300));
await new Promise((resolve,reject)=>{const req=db.open('alder-web-viewer',1);req.onerror=()=>reject(req.error);req.onsuccess=()=>{const database=req.result,tx=database.transaction('session','readwrite'),store=tx.objectStore('session'),get=store.get('current');get.onsuccess=()=>{const saved=get.result;delete saved.preferWrite;store.put(saved,'current');};tx.oncomplete=()=>{database.close();resolve();};tx.onerror=()=>reject(tx.error);};});
const legacy=await open();assert.equal(legacy.getElementById('prefer-write').checked,false);assert.equal(legacy.querySelectorAll('.edge').length,all.length);
assert.equal(JSON.stringify(design),before);
windows.forEach(w=>w.close());console.log(JSON.stringify({checks:'option default OFF, paired Reads only, labels/exceptions/highlight, selection/positions, zoom/theme redraw, persistence/reload and OFF restoration',all:all.length,hidden: hidden.size,visible:expected.length}));
