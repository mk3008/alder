// Local parser/DOM/IndexedDB setup gate, never a native-browser substitute.
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {edgeDragFixture,edgeDragMoving,edgeDragPositions,edgeDragMatrix,expectedEdgePosition,seedEdgeDragSession} from './test-node-edge-drag-browser.mjs';
import {readSessionInPage,waitForExactRead,waitSavedViewer} from './wait-saved-viewer.mjs';

const {raw,design}=edgeDragFixture();
assert.deepEqual(design.graph.nodes.map(n=>n.id).sort(),Object.keys(edgeDragPositions).sort());
assert.equal(edgeDragMoving,'person');assert.equal(design.graph.nodes.find(n=>n.id==='person').type,'object');assert.equal(design.graph.nodes.find(n=>n.id==='read').type,'business');
assert.equal(design.graph.nodes.length,4);assert.equal(design.graph.relations.length,10);
const incident=design.graph.relations.filter(r=>r.from===edgeDragMoving||r.to===edgeDragMoving),unrelated=design.graph.relations.filter(r=>r.from!==edgeDragMoving&&r.to!==edgeDragMoving);
assert.equal(incident.length,5);assert.equal(unrelated.length,5);
assert.equal(edgeDragMatrix.length,48);assert.equal(new Set(edgeDragMatrix.map(c=>JSON.stringify(c))).size,48);
for(const width of [1280,393,320])for(const zoom of [.25,1])for(const input of ['mouse','touch'])assert.deepEqual(edgeDragMatrix.filter(c=>c.width===width&&c.zoom===zoom&&c.input===input).map(c=>c.edge),['left','right','top','bottom']);
// At all requested widths the committed inset can center the selected card
// with nonnegative scroll, even at minimum zoom. Actual hit testing is Chrome's job.
for(const width of [1280,393,320])for(const zoom of [.25,1]){
 const inset=[4096,4096],scroll=[Math.round((inset[0]+130)*zoom-width/2),Math.round((inset[1]+34)*zoom-350)];
 assert.ok(scroll.every(v=>v>=0));
 for(const axis of [0,1])for(const sign of [-1,1]){
  const before={scroll:[512,512],offset:inset.map(v=>v*zoom)},after={scroll:[...before.scroll],offset:[...before.offset]},start=[150,450],end=[...start];end[axis]+=sign*100;after.scroll[axis]+=sign*20;
  const expected=[0,0];expected[axis]=sign*120/zoom;assert.deepEqual(expectedEdgePosition([0,0],start,end,zoom,before,after),expected);
  // Origin growth + matching integer scroll compensation alone cannot rebase
  // world coordinates or alter the pointer grip equation.
  after.scroll[axis]+=80;after.offset[axis]+=80;assert.deepEqual(expectedEdgePosition([0,0],start,end,zoom,before,after),expected);
 }
}
const {outputFiles}=await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}});
let restoredWindow;
const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
try{
 w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};
 w.eval(outputFiles[0].text);const d=w.document,$=id=>d.getElementById(id);
 await waitForExactRead(()=>$('open').disabled,false,{timeoutMs:3000,intervalMs:10});
 $('open-text').click();$('source-text').value=raw;await $('source-submit').onclick();
 assert.equal(d.querySelectorAll('.node').length,4);assert.equal(d.querySelectorAll('.edge').length,10);assert.equal(d.querySelectorAll('.edge-label').length,10);assert.equal($('source-dialog').hidden,true);assert.equal($('status').dataset.kind==='error'&&!$('status').hidden,false);
 for(const selector of ['#open-text','#source-text','#source-submit','#layout-lock','#viewport','#canvas','#nodes','#edges','.toolbar','#zoom','.tab .close','#formattedMarkdownDrawer','#node-list-drawer','.node[data-node="person"]','.node.business[data-node="read"]'])assert.equal(d.querySelectorAll(selector).length,1,selector);
 if(!$('formattedMarkdownDrawer').hidden)$('drawer').click();assert.equal($('formattedMarkdownDrawer').hidden,true);assert.equal($('node-list-drawer').hidden,true);
 const before=Object.fromEntries([...d.querySelectorAll('.node')].map(n=>[n.dataset.node,[parseFloat(n.style.left),parseFloat(n.style.top)]]));
 $('layout-lock').click();assert.equal($('layout-lock').getAttribute('aria-pressed'),'false');assert.deepEqual(Object.fromEntries([...d.querySelectorAll('.node')].map(n=>[n.dataset.node,[parseFloat(n.style.left),parseFloat(n.style.top)]])),before);
 globalThis.indexedDB=w.indexedDB;
 await waitForExactRead(readSessionInPage,before,{project:s=>s?.tabs?.find(t=>t.key===s.active)?.positions,timeoutMs:3000,intervalMs:10});
 // Stop the old app before the seed, as the browser gate's LICENSE navigation
 // does, then await the real transaction and read it back independently.
 w.close();
 for(const zoom of [.25,1]){
  const seed={positions:edgeDragPositions,zoom,scroll:[100,200],viewInset:[4096,4096]};assert.equal(await seedEdgeDragSession(seed),true);
  const snapshot=await readSessionInPage(),tab=snapshot.tabs.find(t=>t.key===snapshot.active);assert.deepEqual(tab.positions,edgeDragPositions);assert.equal(tab.zoom,zoom);assert.deepEqual(tab.scroll,seed.scroll);assert.deepEqual(tab.viewInset,seed.viewInset);assert.equal(tab.selected,edgeDragMoving);assert.deepEqual(tab.hiddenNodes,[]);assert.equal(tab.canvasOrigin,undefined);assert.equal(snapshot.drawer,false);assert.equal(snapshot.nodeDrawer,false);
 }
 // A fractional native-scroll fixture must remain *exact* in storage even
 // when a browser would shorten a CSS declaration's decimal representation.
 const fractional=expectedEdgePosition([0,0],[150,450],[14,10],.25,{scroll:[512,512],offset:[1024,1024]},{scroll:[512.123456789,512.987654321],offset:[1024,1024]});
 assert.ok(fractional.every(v=>v<0));assert.ok(fractional.some(v=>!Number.isInteger(v)));
 const expectedPositions={...structuredClone(edgeDragPositions),[edgeDragMoving]:fractional},seed={positions:expectedPositions,zoom:.25,scroll:[100,200],viewInset:[4096,4096]};
 await seedEdgeDragSession(seed);const fakePage={evaluate:fn=>fn()};
 const observed=await waitSavedViewer(fakePage,{positions:expectedPositions},{timeoutMs:100,intervalMs:5});assert.deepEqual(observed.tabs.find(t=>t.key===observed.active).positions,expectedPositions);
 restoredWindow=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
 restoredWindow.indexedDB=w.indexedDB;restoredWindow.structuredClone=structuredClone;restoredWindow.TextEncoder=TextEncoder;restoredWindow.HTMLElement.prototype.setPointerCapture=()=>{};restoredWindow.HTMLElement.prototype.releasePointerCapture=()=>{};restoredWindow.eval(outputFiles[0].text);
 await waitForExactRead(()=>restoredWindow.document.querySelector('#open').disabled,false,{timeoutMs:3000,intervalMs:10});
 for(const [id,p] of Object.entries(expectedPositions)){const node=[...restoredWindow.document.querySelectorAll('.node')].find(n=>n.dataset.node===id),style=restoredWindow.document.createElement('div').style;style.left=p[0]+'px';style.top=p[1]+'px';assert.deepEqual([node.style.left,node.style.top],[style.left,style.top],'exact CSSOM representation after signed fractional reload');}
 restoredWindow.close();
 const corrupted=structuredClone(expectedPositions);corrupted[edgeDragMoving][0]+=1e-7;await seedEdgeDragSession({...seed,positions:corrupted});
 await assert.rejects(waitSavedViewer(fakePage,{positions:expectedPositions},{timeoutMs:75,intervalMs:5}),e=>e.message.includes('deadline')&&e.reads>=2,'even subpixel DB corruption must fail exact asynchronous persistence');
 await seedEdgeDragSession(seed);assert.deepEqual((await readSessionInPage()).tabs[0].positions,expectedPositions);
 const activityPositions={...structuredClone(edgeDragPositions),person:[1300,600],read:[0,0]};await seedEdgeDragSession({...seed,positions:activityPositions,moving:'read'});const activitySaved=await readSessionInPage(),activityTab=activitySaved.tabs.find(t=>t.key===activitySaved.active);assert.deepEqual(activityTab.positions,activityPositions);assert.equal(activityTab.selected,'read');
 console.log(JSON.stringify({nodeEdgeDragFixturePreflight:'passed',publicFixture:'test_explicit_exception_kinds',nodes:4,relations:10,incident:5,nonincident:5,matrixCases:48,selectors:15,committedSeeds:6,exactOracleCases:49,activitySeedSelected:true,signedFractionalCSSOMRestore:true,subpixelDBMismatchRejected:true,limit:'Parser/DOM/fake-IDB and arithmetic only. Native pointer capture, actual screen grip, RAF edge pan and Chromium persistence/reload have not run here.'}));
}finally{w.close();restoredWindow?.close();delete globalThis.indexedDB;}
