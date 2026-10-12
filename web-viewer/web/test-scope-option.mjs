// Application DOM/IndexedDB model; rendered opacity is checked in browser QA.
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
const layout=d=>[...d.querySelectorAll('.node')].map(n=>[n.dataset.node,n.style.left,n.style.top]);
try{
 const d=await open(),$=id=>d.getElementById(id);assert.equal($('dim-outside').checked,false);assert.equal($('hide-outside'),null);$('open-sample').click();$('layout-lock').click();
 const design=parseDesign(readFileSync('../business-design/alder/README.md','utf8')),ids=new Set(design.graph.nodes.filter(n=>!n.scope).map(n=>n.id)),all=design.graph.relations,initial=layout(d);
 const outside=d.querySelector('.node.outside'),outsideID=outside.dataset.node;select(outside);const selectedDetail=$('detail').textContent;$('dim-outside').click();
 assert.equal(d.querySelectorAll('.node').length,25);assert.equal(d.querySelectorAll('.node.scope-dim').length,ids.size);assert.equal(d.querySelector('.selected').dataset.node,outsideID);assert.equal($('detail').textContent,selectedDetail);assert.equal($('scope-empty'),null);
 const verify=prefer=>{const hidden=hiddenReadIndexes(all,prefer),expected=all.map((r,i)=>({r,i})).filter(({i})=>!hidden.has(i)).map(({i})=>i);for(const css of ['.edge','.edge-label']){assert.deepEqual([...d.querySelectorAll(css)].map(n=>+n.dataset.relation).sort((a,b)=>a-b),expected);for(const el of d.querySelectorAll(css)){const r=all[+el.dataset.relation];assert.equal(el.classList.contains('scope-dim'),ids.has(r.from)||ids.has(r.to));}}return expected.length;};
 verify(false);$('prefer-write').click();const combinedEdges=verify(true);assert.deepEqual(layout(d),initial);
 // Dimmed outside nodes remain selectable and adjustable when unlocked.
 const moving=d.querySelector('.node.outside');moving.onpointerdown(pointer);moving.onpointermove({...pointer,clientX:55,clientY:35});moving.onpointerup(pointer);const moved=layout(d);assert.notDeepEqual(moved,initial);verify(true);assert.equal(d.querySelector('.selected').dataset.node,outsideID);
 // Rebuilding after a toggle invalidates detached mouse handlers.
 const stale=d.querySelector('.node');stale.onpointerdown(pointer);$('dim-outside').click();stale.onpointermove({...pointer,clientX:100,clientY:100});stale.onpointerup(pointer);assert.deepEqual(layout(d),moved);$('dim-outside').click();$('theme').click();$('out').click();assert.deepEqual(layout(d),moved);
 await sleep();const snapshot=await session();assert.equal(snapshot.dimOutside,true);assert.equal(snapshot.preferWrite,true);assert.equal(JSON.stringify(snapshot.tabs[0].design),JSON.stringify(design));assert.equal(Object.keys(snapshot.tabs[0].positions).length,25);
 const restored=await open();assert.equal(restored.getElementById('dim-outside').checked,true);assert.deepEqual(layout(restored),moved);assert.equal(restored.querySelector('.selected').dataset.node,outsideID);assert.equal(restored.getElementById('layout-lock').getAttribute('aria-pressed'),'true');
 // Both historical ON and OFF migrate without dropping positions or selection.
 for(const legacyValue of [true,false]){await session(s=>{delete s.dimOutside;s.hideOutside=legacyValue;});const legacy=await open();assert.equal(legacy.getElementById('dim-outside').checked,legacyValue);assert.equal(legacy.querySelectorAll('.node').length,25);assert.deepEqual(layout(legacy),moved);assert.equal(legacy.querySelector('.selected').dataset.node,outsideID);legacy.getElementById('theme').click();await sleep();assert.equal((await session()).hideOutside,undefined);}
 await session(s=>{delete s.dimOutside;delete s.hideOutside;delete s.preferWrite;});const noSetting=await open();assert.equal(noSetting.getElementById('dim-outside').checked,false);assert.equal(noSetting.querySelectorAll('.edge').length,63);
 await session(s=>{s.dimOutside=true;s.tabs.forEach(t=>t.design.graph.nodes.forEach(n=>n.scope=false));});const allOutside=await open();assert.equal(allOutside.querySelectorAll('.node.scope-dim').length,25);assert.equal(allOutside.querySelectorAll('.edge').length,63);assert.equal(allOutside.getElementById('empty').hidden,true);assert.ok(allOutside.getElementById('detail').textContent.length>0);
 await session(s=>{s.dimOutside='yes';});const invalid=await open();assert.equal(invalid.querySelectorAll('.tab').length,0);assert.match(invalid.getElementById('status-text').textContent,/復元できません/);
 console.log(JSON.stringify({model:'DOM/IndexedDB',allNodes:25,dimmedNodes:ids.size,allEdges:63,combinedEdges,checks:['default OFF','all nodes/edges retained','outside selected/neighbor classes and detail retained','outside movement unlocked','Write preference combination','stale detached drag ignored','theme/zoom/reload','full positions/data retained','legacy ON/OFF migration and cleanup','missing setting','all-outside remains usable','invalid setting rejected']},null,2));
}finally{windows.forEach(w=>w.close());}
