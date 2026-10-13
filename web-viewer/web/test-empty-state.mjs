// DOM/IndexedDB + explicit viewport-size model. This does not measure browser
// pixels, native scroll clamping, text wrapping, pointer hit targets or overlays.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {parseDesign} from '../src/graph.ts';
import {reconcile,saveSession,loadSession} from '../src/session.ts';

const css=readFileSync('src/style.css','utf8');
const design=parseDesign(readFileSync('../business-design/alder/README.md','utf8'));
const initial=reconcile({key:'empty-regression',name:'Alder',design,positions:{},scroll:[0,0],zoom:1,source:{kind:'sample'}},design);
const session=readFileSync('src/session.ts','utf8').replace('export async function saveSession(', 'async function realSaveSession(')+`
export async function saveSession(value:Session):Promise<void>{
 if((globalThis as any).__failNextSave){(globalThis as any).__failNextSave=false;throw Error('controlled storage failure');}
 return realSaveSession(value);
}`;
const {outputFiles}=await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'},plugins:[{name:'empty-state-save-control',setup(b){b.onLoad({filter:/\/src\/session\.ts$/},()=>({contents:session,loader:'ts',resolveDir:process.cwd()+'/src'}));}}]});
const windows=[],checks=[];
const tick=()=>new Promise(r=>setTimeout(r,10));
async function until(test){for(let i=0;i<300&&!await test();i++)await tick();assert.ok(await test());}
async function saved(e){globalThis.indexedDB=e.db;return loadSession();}
const layout=t=>Object.fromEntries(['positions','selected','scroll','zoom','hiddenNodes','showExceptions','selectedEdgesOnly','viewInset','canvasOrigin'].filter(k=>t[k]!==undefined).map(k=>[k,t[k]]));
const positions=e=>Object.fromEntries([...e.d.querySelectorAll('.node')].map(n=>[n.dataset.node,[parseFloat(n.style.left),parseFloat(n.style.top)]]));
const scroll=e=>[e.v.scrollLeft,e.v.scrollTop];
async function boot({db=new IDBFactory(),width=1280,height=800,seed}={}){
 globalThis.indexedDB=db;await loadSession();if(seed)await saveSession(seed);
 const w=new JSDOM('<style></style><div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);
 w.innerWidth=width;w.innerHeight=height;w.indexedDB=db;w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;
 w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};
 let captures=0;w.HTMLElement.prototype.setPointerCapture=()=>{captures++;};
 w.eval(outputFiles[0].text);const d=w.document,$=id=>d.getElementById(id),v=$('viewport');d.querySelector('style').textContent=css;
 Object.defineProperties(v,{clientWidth:{get:()=>width<=800?width:width-($('node-list-drawer').hidden?0:300)-($('formattedMarkdownDrawer').hidden?0:380)},clientHeight:{value:height-108}});
 await until(()=>!$('open').disabled);w.dispatchEvent(new w.Event('resize'));
 return {w,d,$,v,db,width,height,captures:()=>captures};
}
function empty(e){
 const {$,w,d,v}=e;
 assert.equal(d.querySelectorAll('.tab').length,0);
 assert.equal($('empty').hidden,false,'the explanation is present');
 assert.match($('empty').textContent,/Business Design Markdownを開いてください。/);
 assert.deepEqual(scroll(e),[0,0],'empty presentation has no historical camera scroll');
 assert.equal($('canvas').hidden,true,'huge canvas and transformed children cannot contribute empty scroll overflow');
 for(const [drawer,toggle] of [['node-list-drawer','node-list-toggle'],['formattedMarkdownDrawer','drawer']]){
  assert.equal($(drawer).hidden,true,drawer+' cannot obscure the empty hint');
  assert.equal($(toggle).getAttribute('aria-expanded'),'false');
  assert.equal($(toggle).disabled,true,'empty drawer toggle is disabled');
 }
 const link=$('open-sample');assert.equal(link.tabIndex,0);assert.equal(link.getAttribute('aria-disabled'),'false');
 assert.equal(w.getComputedStyle($('canvas')).display,'none');
 assert.equal(w.getComputedStyle($('empty')).position,'absolute');
 assert.equal(w.getComputedStyle($('empty')).inset,'30% 20px auto','hint stays relative to the unscrolled viewport');
 assert.equal($('empty').parentElement,v);
 assert.equal(w.getComputedStyle(link).pointerEvents,'auto');
 link.focus();assert.equal(d.activeElement,link,'sample remains keyboard-focusable');
 const captures=e.captures(),pointer=new w.Event('pointerdown',{bubbles:true,cancelable:true});Object.assign(pointer,{button:0,pointerId:1,clientX:20,clientY:20});link.dispatchEvent(pointer);assert.equal(e.captures(),captures,'sample pointer cannot begin graph panning');
 const bar=d.querySelector('.toolbar');assert.equal(bar.hidden,true,'graph controls cannot obscure the empty hint');assert.equal(w.getComputedStyle(bar).display,'none','explicit hidden rule overrides toolbar flex display');
 assert.equal(v.clientWidth,e.width,'empty drawers release the full modeled viewport width');
}
function restored(e,expected,{drawer=true,nodeDrawer=true}={}){
 const {$}=e;assert.equal(e.d.querySelectorAll('.tab').length,1);assert.equal($('empty').hidden,true);assert.equal($('canvas').hidden,false);
 assert.deepEqual(positions(e),expected.positions);assert.deepEqual(scroll(e),expected.scroll);assert.equal($('zoom').textContent,Math.round(expected.zoom*100)+'%');
 assert.equal($('nodes').style.left,(expected.canvasOrigin[0]+expected.viewInset[0])*expected.zoom+'px');
 assert.equal($('nodes').style.top,(expected.canvasOrigin[1]+expected.viewInset[1])*expected.zoom+'px');
 assert.equal($('formattedMarkdownDrawer').hidden,!drawer);assert.equal($('node-list-drawer').hidden,!nodeDrawer);
 assert.equal($('drawer').getAttribute('aria-expanded'),String(drawer));assert.equal($('node-list-toggle').getAttribute('aria-expanded'),String(nodeDrawer));
 assert.equal($('drawer').disabled,false);assert.equal($('node-list-toggle').disabled,false);
 assert.equal(e.d.querySelector('.toolbar').hidden,false);assert.equal(e.w.getComputedStyle(e.d.querySelector('.toolbar')).display,'flex');
}
try{
 for(const [width,height,zoom,dark] of [[320,568,.25,false],[393,852,2.5,true],[1440,900,1,false]]){
  const tab=structuredClone(initial),ids=Object.keys(tab.positions);tab.positions[ids[0]]=[-640,-420];tab.positions[ids[1]]=[22000,17000];tab.zoom=zoom;tab.scroll=[16000,12000];tab.canvasOrigin=[12000,10000];tab.viewInset=[320,240];tab.selected=ids[0];tab.hiddenNodes=[];tab.showExceptions=false;tab.selectedEdgesOnly=true;
  const seed={tabs:[tab],active:tab.key,dark,drawer:true,nodeDrawer:true,width:380};
  let e=await boot({width,height,seed});
  assert.ok(parseFloat(e.$('canvas').style.width)>10000);assert.ok(parseFloat(e.$('canvas').style.height)>10000);
  // Native pan/zoom can leave any positive scroll in this huge extent. Closing
  // must snapshot the actual viewport, not an older saved scroll value.
  e.v.scrollLeft+=217;e.v.scrollTop+=391;const expected={...layout(tab),scroll:scroll(e)};
  for(let round=0;round<2;round++){
   await e.d.querySelector('.close').onclick();empty(e);
   const closed=await saved(e);assert.deepEqual(layout(closed.sampleLayout),expected);assert.equal(closed.drawer,true);assert.equal(closed.nodeDrawer,true);
   // Theme/resize/empty controls cannot overwrite the closed sample camera.
   e.$('theme').click();e.w.dispatchEvent(new e.w.Event('resize'));e.v.dispatchEvent(new e.w.Event('scroll'));e.$('drawer').click();e.$('node-list-toggle').click();empty(e);
   const history=e.w.history.length;e.$('open-sample').click();restored(e,expected);assert.equal(e.w.location.hash,'');assert.equal(e.w.history.length,history);
  }
  await e.d.querySelector('.close').onclick();empty(e);const db=e.db;e.w.close();e=await boot({db,width,height});empty(e);
  e.$('open-sample').click();restored(e,expected);e.w.dispatchEvent(new e.w.Event('blur'));await until(async()=>Boolean((await saved(e))?.tabs.length));assert.deepEqual(layout((await saved(e)).tabs[0]),expected);
  e.w.__failNextSave=true;await e.d.querySelector('.close').onclick();restored(e,expected);assert.match(e.$('status-text').textContent,/タブを閉じませんでした/);
  await e.d.querySelector('.close').onclick();empty(e);e.w.close();
  checks.push(`${width}×${height}, zoom ${zoom}: huge/signed layout + actual scroll + origin/inset survive repeated close/reopen, empty redraw, reload and failed close; both drawer preferences restored`);
 }
 const fresh=await boot({width:320,height:568});empty(fresh);fresh.$('open-sample').click();assert.equal(fresh.d.querySelectorAll('.tab').length,1);fresh.w.close();checks.push('fresh no-tab state has visible explanation contract and keyboard/pointer-safe sample action');
 const e=await boot();e.$('open-sample').click();e.$('drawer').click();assert.equal(e.$('formattedMarkdownDrawer').hidden,true);await e.d.querySelector('.close').onclick();empty(e);e.$('open-sample').click();assert.equal(e.$('formattedMarkdownDrawer').hidden,true);assert.equal(e.$('node-list-drawer').hidden,true);e.w.close();checks.push('closed drawer preferences stay closed after sample reopening');
 console.log(JSON.stringify({model:'JSDOM + fake IndexedDB + explicit viewport dimensions; no browser pixel/hit-test evidence',checks,passed:checks.length},null,2));
}finally{windows.forEach(w=>w.close());delete globalThis.indexedDB;}
