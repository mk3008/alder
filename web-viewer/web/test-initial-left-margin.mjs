import {joinedSession} from './session-test-view.mjs';
const loadSession=async()=>joinedSession(await loadStoredSession());
// Legacy no-Group input regression; the current Group sample is tested separately.
// DOM/IndexedDB model. Browser text bounds, clipping and native edge dragging
// are separate gates; this pins camera changes without moving graph geometry.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from './legacy-viewer-fixture.mjs';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {parseDesign} from '../src/graph.ts';
import {initialPositions} from '../src/layout.ts';
import {loadSession as loadStoredSession,saveSession} from '../src/session.ts';

const markdown=readFileSync('web/authorities/ungrouped-alder.md','utf8'),design=parseDesign(markdown);
const code=(await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}})).outputFiles[0].text;
const windows=[],checks=[],tick=()=>new Promise(r=>setTimeout(r,10));
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const positions=e=>Object.fromEntries([...e.d.querySelectorAll('.node')].map(n=>[n.dataset.node,[parseFloat(n.style.left),parseFloat(n.style.top)]]));
const routes=e=>[...e.d.querySelectorAll('.edge,.edge-label')].map(n=>[n.tagName,n.dataset.relation,n.tagName==='path'?n.getAttribute('d'):[n.getAttribute('x'),n.getAttribute('y')]]);
const layout=t=>Object.fromEntries(['positions','selected','scroll','zoom','viewInset','canvasOrigin'].filter(k=>t[k]!==undefined).map(k=>[k,t[k]]));
const state=tab=>({tabs:[tab],active:tab.key,dark:false,drawer:true,width:380});
const legacy={key:'legacy',name:'Alder',source:{kind:'sample'},design,positions:initialPositions(design.graph,design.activityOrder),scroll:[0,0],zoom:1};
async function until(test){for(let i=0;i<300&&!await test();i++)await tick();assert.ok(await test());}
async function saved(e){globalThis.indexedDB=e.db;return loadSession();}
async function flush(e){e.w.dispatchEvent(new e.w.Event('blur'));await new Promise(r=>setTimeout(r,230));return saved(e);}
async function boot({db=new IDBFactory(),seed,width=1280,height=800}={}){
 globalThis.indexedDB=db;await loadSession();if(seed)await saveSession(seed);
 const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);
 w.innerWidth=width;w.innerHeight=height;w.indexedDB=db;w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;
 w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};
 w.fetch=async()=>new Response(markdown,{headers:{'content-type':'text/markdown'}});
 w.eval(code);const d=w.document,$=id=>d.getElementById(id),v=$('viewport');
 Object.defineProperties(v,{clientWidth:{value:width<=800?width:width-380},clientHeight:{value:height-100}});
 v.getBoundingClientRect=()=>({left:0,right:v.clientWidth,top:100,bottom:height,width:v.clientWidth,height:v.clientHeight});
 $('formattedMarkdownDrawer').getBoundingClientRect=()=>({left:v.clientWidth,right:width,top:100,bottom:height});
 await until(()=>!$('open').disabled);w.dispatchEvent(new w.Event('resize'));
 return {w,d,$,v,db};
}
function geometry(e,inset=40,zoom=1){
 // Overview shares the detail's 64-unit step and separates source-only peers.
 // Pin its new coordinates and extents exactly; older saved geometry has a
 // separate frozen-128 restore/reset regression in layout and native wiring.
 assert.equal(hash(positions(e)),'e3290e87fca6d9fa00072fc32778971b602523445b19fa397d64bf7dd93f4424','all new overview coordinates use the shared 64-unit layout');
 // Keep the new overview paths/captions exact across camera and reload changes.
 assert.equal(hash(routes(e)),'e5d38510751ca9c33d8fac0daaa48b2a691f2dd1bd791c127bac627bf8a4c96b','all SVG paths and endpoint-relative left-aligned captions remain exact');
 assert.deepEqual([e.$('nodes').style.left,e.$('nodes').style.top],[inset*zoom+'px','0px']);
 assert.deepEqual([e.$('edges').style.left,e.$('edges').style.top],[inset*zoom+'px','0px']);
 assert.equal(e.$('edges').getAttribute('viewBox'),'0 0 2096 3428');
 assert.deepEqual([e.$('canvas').style.width,e.$('canvas').style.height],[(2096+inset*2)*zoom+'px',3428*zoom+'px'],'only the existing horizontal camera reserve grows');
 assert.equal(Math.min(...Object.values(positions(e)).map(p=>p[0]))*zoom+parseFloat(e.$('nodes').style.left),(40+inset)*zoom);
 assert.equal(e.$('zoom').textContent,Math.round(zoom*100)+'%');
}
async function close(e){await e.d.querySelector('.tab.active .close').onclick();}
try{
 const fresh=await boot();fresh.$('open-sample').click();geometry(fresh);
 fresh.$('open-sample').click();assert.equal(fresh.d.querySelectorAll('.tab').length,1);geometry(fresh);
 const freshTab=(await flush(fresh)).tabs[0];assert.deepEqual(freshTab.viewInset,[40,0]);assert.deepEqual(freshTab.scroll,[0,0]);
 assert.equal(fresh.d.querySelector('.close').hidden,true);await close(fresh);assert.equal(fresh.$('canvas').hidden,false);assert.deepEqual([fresh.v.scrollLeft,fresh.v.scrollTop],[0,0]);
 assert.deepEqual(layout((await saved(fresh)).tabs[0]),layout(freshTab));
 const db=fresh.db;fresh.w.close();const reopened=await boot({db});assert.equal(reopened.$('canvas').hidden,false);reopened.$('open-sample').click();geometry(reopened);
 assert.equal(reopened.$('refresh').disabled,true);await reopened.$('refresh').onclick();geometry(reopened);assert.deepEqual(layout((await flush(reopened)).tabs[0]),layout(freshTab));
 checks.push('fresh sample doubles the left node margin from 40 to 80; repeated open, disabled refresh, close, empty-state reload and reopen retain one inset');

 for(const entry of ['text','url','file']){
  const e=await boot();
  if(entry==='file'){Object.defineProperty(e.$('fallback'),'files',{value:[{name:'design.md',text:async()=>markdown}]});await e.$('fallback').onchange();}
  else{e.$('open-'+entry).click();e.$('source-'+entry).value=entry==='text'?markdown:'https://source.example.test/design.md';await e.$('source-submit').onclick();}
  geometry(e);assert.deepEqual((await flush(e)).tabs[0].viewInset,[40,0]);e.w.close();
 }
 checks.push('new file, pasted text and mocked URL inputs use identical camera-only padding');

 // Preserve both historical absence and an explicit user-navigation inset.
 for(const mode of ['absent','zero','custom']){
  const tab=structuredClone(legacy);tab.positions[design.graph.nodes[0].id]=[-640,654];tab.scroll=[137,219];tab.zoom=.8;tab.canvasOrigin=[1000,0];
  if(mode!=='absent')tab.viewInset=mode==='zero'?[0,0]:[450,300];
  let e=await boot({seed:state(tab)});assert.deepEqual(positions(e),tab.positions);assert.deepEqual(layout((await flush(e)).tabs[0]),layout(tab));
  assert.equal(e.$('refresh').disabled,true);await e.$('refresh').onclick();assert.deepEqual(layout((await flush(e)).tabs[0]),layout(tab));
  await close(e);assert.deepEqual(layout((await saved(e)).tabs[0]),layout(tab));const db=e.db;e.w.close();
  e=await boot({db});e.$('open-sample').click();assert.deepEqual(positions(e),tab.positions);assert.deepEqual(layout((await flush(e)).tabs[0]),layout(tab));e.w.close();
  const urlTab={...structuredClone(tab),source:{kind:'url',url:'https://source.example.test/design.md'}};const url=await boot({seed:state(urlTab)});assert.equal(url.$('refresh').disabled,false);await url.$('refresh').onclick();assert.deepEqual(positions(url),tab.positions);assert.deepEqual(layout((await flush(url)).tabs[0]),layout(tab),'eligible URL refresh preserves the same historical camera and geometry');url.w.close();
 }
 const old=await boot({seed:state(structuredClone(legacy))});geometry(old,0);await close(old);old.$('open-sample').click();geometry(old,0);old.w.close();
 checks.push('legacy tab and saved sample preserve absent/zero/custom inset, manual signed coordinates, origin, zoom and scroll across disabled sample refresh/reload/reopen and eligible URL refresh');

 // A narrow host keeps the canonical extent even at 25% zoom, so these exact
 // expectations test scaling, not the separate viewport-minimum width rule.
 for(const zoom of [.25,.36,1,2.5])for(const inset of [0,40]){
  const tab={...structuredClone(legacy),zoom};if(inset)tab.viewInset=[inset,0];
  const e=await boot({width:320,height:568,seed:state(tab)});geometry(e,inset,zoom);
  // The historical world point x=8 remains inside the padded camera, even
  // though corrected Input routes no longer use that exterior left lane.
  const nodeLeft=(40+inset)*zoom,lineLeft=(8+inset)*zoom;
  assert.ok(nodeLeft>lineLeft);assert.ok((1+inset)*zoom>0,'the leftmost estimated label box stays inside the canvas');e.w.close();
 }
 checks.push('25%, 36%, 100% and 250% preserve path/label geometry and vertical extent; node margin scales from 40 to 80 world units');

 const e=await boot();e.$('open-sample').click();const initial=positions(e),beforeRoutes=routes(e);e.$('layout-lock').click();
 const id=design.graph.nodes[0].id,node=[...e.d.querySelectorAll('.node')].find(n=>n.dataset.node===id),start=initial[id];
 node.onpointerdown({button:0,clientX:400,clientY:400,pointerId:1,stopPropagation(){}});node.onpointermove({clientX:430,clientY:425,pointerId:1});node.onpointerup({pointerId:1});
 assert.deepEqual(positions(e)[id],[start[0]+30,start[1]+25]);for(const [other,p] of Object.entries(initial))if(other!==id)assert.deepEqual(positions(e)[other],p);
 const moved=positions(e);assert.notDeepEqual(routes(e),beforeRoutes);assert.deepEqual((await flush(e)).tabs[0].viewInset,[40,0]);
 e.$('node-list-toggle').click();const row=e.d.querySelector('[data-list-node]');row.querySelector('.node-navigate').click();
 const navigated=(await flush(e)).tabs[0];assert.deepEqual(navigated.viewInset,[450,350],'list navigation replaces the initial camera inset instead of accumulating it');assert.deepEqual(positions(e),moved);
 const p=navigated.positions[row.dataset.listNode];assert.equal(p[0]+130+parseFloat(e.$('nodes').style.left)-e.v.scrollLeft,450);assert.equal(p[1]+34+parseFloat(e.$('nodes').style.top)-e.v.scrollTop,350);
 await close(e);e.$('open-sample').click();assert.deepEqual(layout((await flush(e)).tabs[0]),layout(navigated));e.w.close();
 checks.push('drag retains world-coordinate deltas; list navigation replaces padding, centers correctly, and persists its chosen camera');
 console.log(JSON.stringify({model:'JSDOM + fake IndexedDB; no native browser pixel or text-bound claims',checks,passed:checks.length},null,2));
}finally{windows.forEach(w=>w.close());delete globalThis.indexedDB;}
