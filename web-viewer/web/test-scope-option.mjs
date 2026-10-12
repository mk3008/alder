// Application DOM/IndexedDB model; real rendered geometry is covered separately.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {build} from 'esbuild';
import {parseDesign} from '../src/graph.ts';
import {hiddenReadIndexes} from '../src/edge-visibility.ts';
const {outputFiles}=await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}});
const db=new IDBFactory(),windows=[],sleep=()=>new Promise(r=>setTimeout(r,300));
async function open(){const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);w.indexedDB=db;w.structuredClone=structuredClone;w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};w.eval(outputFiles[0].text);for(let i=0;i<120&&w.document.getElementById('open').disabled;i++)await new Promise(r=>setTimeout(r,25));return w.document;}
async function session(edit){return new Promise((resolve,reject)=>{const r=db.open('alder-web-viewer',1);r.onerror=()=>reject(r.error);r.onsuccess=()=>{const d=r.result,t=d.transaction('session',edit?'readwrite':'readonly'),s=t.objectStore('session'),g=s.get('current');let saved;g.onsuccess=()=>{saved=g.result;if(edit){edit(saved);s.put(saved,'current');}};t.oncomplete=()=>{d.close();resolve(saved);};t.onerror=()=>reject(t.error);};});}
const pointer={button:0,clientX:0,clientY:0,pointerId:1,stopPropagation(){}};
const select=n=>{n.onpointerdown(pointer);n.onpointerup(pointer);};
try{
 const d=await open(),$=id=>d.getElementById(id);assert.equal($('hide-outside').checked,false);$('open-sample').click();
 const design=parseDesign(readFileSync('../business-design/alder/README.md','utf8')),ids=new Set(design.graph.nodes.filter(n=>n.scope).map(n=>n.id)),all=design.graph.relations;
 const positions=()=>[...d.querySelectorAll('.node')].map(n=>[n.dataset.node,n.style.left,n.style.top]);const initial=positions();
 const fullDetail=$('detail').textContent;const outside=d.querySelector('.node.outside');select(outside);assert.ok(d.querySelector('.selected'));$('hide-outside').click();
 assert.equal(d.querySelectorAll('.node').length,ids.size);assert.equal(d.querySelectorAll('.outside,.selected,.muted,.review-related').length,0);assert.equal($('detail').textContent,fullDetail);assert.equal($('scope-empty').hidden,true);
 const verify=prefer=>{const hidden=hiddenReadIndexes(all,prefer),expected=all.map((r,i)=>({r,i})).filter(({r,i})=>ids.has(r.from)&&ids.has(r.to)&&!hidden.has(i)).map(({i})=>i);for(const css of ['.edge','.edge-label'])assert.deepEqual([...d.querySelectorAll(css)].map(n=>+n.dataset.relation).sort((a,b)=>a-b),expected);return expected.length;};
 const scopeEdges=verify(false);$('prefer-write').click();const combinedEdges=verify(true);
 assert.deepEqual(positions(),initial.filter(([id])=>ids.has(id)));
 const inside=d.querySelector('.node.business'),insideID=inside.dataset.node;select(inside);assert.equal(d.querySelector('.selected').dataset.node,insideID);$('hide-outside').click();assert.deepEqual(positions(),initial);assert.equal(d.querySelector('.selected').dataset.node,insideID);$('hide-outside').click();
 // Interrupt a pointer drag with filtering and deliver stale detached-node events.
 const drag=d.querySelector('.node');drag.onpointerdown(pointer);$('hide-outside').click();const before=positions();drag.onpointermove({...pointer,clientX:100,clientY:100});drag.onpointerup(pointer);assert.deepEqual(positions(),before);$('hide-outside').click();
 const moving=d.querySelector('.node');moving.onpointerdown(pointer);moving.onpointermove({...pointer,clientX:55,clientY:35});moving.onpointerup(pointer);const moved=positions();verify(true);$('theme').click();$('out').click();assert.deepEqual(positions(),moved);
 await sleep();const snapshot=await session();assert.equal(snapshot.hideOutside,true);assert.equal(snapshot.preferWrite,true);assert.equal(JSON.stringify(snapshot.tabs[0].design),JSON.stringify(design));assert.equal(Object.keys(snapshot.tabs[0].positions).length,design.graph.nodes.length);
 const restored=await open();assert.equal(restored.getElementById('hide-outside').checked,true);assert.equal(restored.getElementById('prefer-write').checked,true);assert.deepEqual([...restored.querySelectorAll('.node')].map(n=>[n.dataset.node,n.style.left,n.style.top]),moved);assert.equal(restored.querySelector('.selected').dataset.node,insideID);
 // A stored selection that is now hidden is cleared on restoration; inactive tabs clear on activation.
 await session(s=>{s.tabs[0].selected=outside.dataset.node;s.tabs.push({...structuredClone(s.tabs[0]),key:'second',name:'second'});});
 const hiddenSelection=await open();assert.equal(hiddenSelection.querySelectorAll('.selected,.muted').length,0);hiddenSelection.querySelectorAll('.tab>button:first-child')[1].click();assert.equal(hiddenSelection.querySelectorAll('.selected,.muted').length,0);
 await sleep();await session(s=>{delete s.hideOutside;delete s.preferWrite;});const legacy=await open();assert.equal(legacy.getElementById('hide-outside').checked,false);assert.equal(legacy.querySelectorAll('.node').length,25);assert.equal(legacy.querySelectorAll('.edge').length,63);
 // All-outside graph remains an open document with a reversible empty-graph hint.
 await session(s=>{s.hideOutside=true;s.tabs.forEach(t=>t.design.graph.nodes.forEach(n=>n.scope=false));});const empty=await open();assert.equal(empty.querySelectorAll('.node,.edge,.edge-label').length,0);assert.equal(empty.getElementById('scope-empty').hidden,false);assert.equal(empty.getElementById('empty').hidden,true);assert.ok(empty.getElementById('detail').textContent.length>0);empty.getElementById('hide-outside').click();assert.equal(empty.querySelectorAll('.node').length,25);assert.equal(empty.getElementById('scope-empty').hidden,true);
 await sleep();await session(s=>{s.hideOutside='yes';});const invalid=await open();assert.equal(invalid.querySelectorAll('.tab').length,0);assert.match(invalid.getElementById('status-text').textContent,/復元できません/);
 console.log(JSON.stringify({model:'DOM/IndexedDB',allNodes:25,scopeNodes:ids.size,allEdges:63,scopeEdges,combinedEdges,checks:['default OFF','scope node/edge/label exclusion','Write preference combination','hidden selection clears to full Markdown','visible selection/positions preserved','stale interrupted drag ignored','visible drag routing','theme/zoom/reload','original data/full positions retained','legacy settings','inactive tab hidden selection','all-outside hint and restoration','invalid setting rejected']},null,2));
}finally{windows.forEach(w=>w.close());}
