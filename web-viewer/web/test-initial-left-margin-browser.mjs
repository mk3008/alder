import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {parseDesign} from '../src/graph.ts';
import {runBrowserCases} from './browser-cases.mjs';
import {readSessionInPage,waitForExactRead,waitSavedViewer} from './wait-saved-viewer.mjs';

// Import and --preflight never launch Chromium or make network requests. The
// browser runner supplies its own browser and serves the built product.
const origin='http://127.0.0.1:4173/';
const raw=readFileSync(new URL('../../business-design/alder/README.md',import.meta.url),'utf8');
const design=parseDesign(raw);
export const initialLeftMarginWidths=[1280,393,320];
export const initialLeftMarginZooms=[.25,.36,1];
export const initialLeftMarginLimits={caseMs:30000,cleanupMs:3000};
const selectors=['#open','#open-sample','#empty','#viewport','#canvas','#nodes','#edges','#zoom','.toolbar','#drawer','#formattedMarkdownDrawer','#node-list-toggle','#node-list-drawer','#open-text','#source-dialog','#source-text','#source-submit'];
const layoutFields=['positions','scroll','zoom','viewInset','canvasOrigin'];
const layoutOf=tab=>Object.fromEntries(layoutFields.map(key=>[key,tab?.[key]]));
const activeOf=session=>session?.tabs?.find(tab=>tab.key===session.active);
const near=(actual,expected,message)=>assert.ok(Number.isFinite(actual)&&Math.abs(actual-expected)<.08,`${message}: ${actual} ≈ ${expected}`);

// Run only after disposing the app (LICENSE.txt in Chromium, a separate window
// in preflight). This changes persisted test data, never live product state.
// Resolve on commit, then callers independently read the real saved record.
export function seedInitialLeftMarginSession({layout,closed=false,omitInset=false}){return new Promise((resolve,reject)=>{
 const request=indexedDB.open('alder-web-viewer',1);request.onerror=()=>reject(request.error);
 request.onsuccess=()=>{const db=request.result;let failure;
  try{const tx=db.transaction('session','readwrite'),store=tx.objectStore('session'),get=store.get('current');
   get.onsuccess=()=>{const session=get.result,tab=session?.tabs?.find(t=>t.key===session.active),target=closed?session?.sampleLayout:tab;
    if(!target||(!closed&&tab.source?.kind!=='sample')||(closed&&session.tabs.length!==0)){failure=Error('Margin fixture needs the committed public sample or its closed layout');tx.abort();return;}
    Object.assign(target,layout);if(omitInset)delete target.viewInset;
    session.drawer=false;session.nodeDrawer=false;store.put(session,'current');
   };
   tx.oncomplete=()=>{db.close();resolve(true);};tx.onerror=tx.onabort=()=>{db.close();reject(failure??tx.error??Error('Margin fixture commit failed'));};
  }catch(error){db.close();reject(error);}
 };
});}
export function readInitialMarginWorldInPage(){return {
 positions:Object.fromEntries([...document.querySelectorAll('.node')].map(node=>[node.dataset.node,[parseFloat(node.style.left),parseFloat(node.style.top)]])),
 routes:Object.fromEntries([...document.querySelectorAll('.edge')].map(edge=>{
  const label=document.querySelector(`.edge-label[data-relation="${edge.dataset.relation}"]`);
  return [edge.dataset.relation,{path:edge.getAttribute('d'),label:[label.getAttribute('x'),label.getAttribute('y'),label.textContent],collisions:edge.dataset.collisions,rerouted:edge.dataset.rerouted,fallback:edge.dataset.fallback}];
 }))
};}

// Native path/text boxes are reference measurements, not estimated routing
// label widths. Record all rendered glyphs, even those below the visible area;
// this is neither a zero-overlap assertion nor a full clipping/paint proof.
export function readInitialMarginGeometryInPage(){
 const viewport=document.querySelector('#viewport'),v=viewport.getBoundingClientRect(),left=v.left+viewport.clientLeft;
 const svgBox=element=>{const b=element.getBBox(),m=element.getScreenCTM(),p=new DOMPoint(b.x,b.y).matrixTransform(m),q=new DOMPoint(b.x+b.width,b.y+b.height).matrixTransform(m),r=element.getBoundingClientRect();return {id:element.dataset.relation,world:[b.x,b.y,b.width,b.height],left:r.left-left,transformedLeft:p.x-left,screen:[r.width,r.height],transformedSize:[q.x-p.x,q.y-p.y],matrix:[m.a,m.b,m.c,m.d]};};
 return {viewportLeft:left,scroll:[viewport.scrollLeft,viewport.scrollTop],nodes:[...document.querySelectorAll('.node')].map(node=>{const r=node.getBoundingClientRect();return {id:node.dataset.node,world:[parseFloat(node.style.left),parseFloat(node.style.top)],left:r.left-left,width:r.width};}),edges:[...document.querySelectorAll('.edge')].map(svgBox),labels:[...document.querySelectorAll('.edge-label')].map(svgBox)};
}
export function assertInitialMarginGeometry(measured,{zoom,inset=40}){
 assert.deepEqual(measured.scroll,[0,0]);assert.equal(measured.nodes.length,25);assert.equal(measured.edges.length,63);assert.equal(measured.labels.length,63);
 for(const node of measured.nodes){near(node.left,(node.world[0]+inset)*zoom,'native card left '+node.id);near(node.width,260*zoom,'native card width '+node.id);}
 for(const kind of ['edges','labels'])for(const item of measured[kind]){
  assert.ok(item.world.every(Number.isFinite),'finite native '+kind+' box');
  assert.ok(item.matrix.every((value,i)=>Math.abs(value-[zoom,0,0,zoom][i])<1e-6),'native SVG matrix '+kind+' '+item.id);
  near(item.left,(item.world[0]+inset)*zoom,'native '+kind+' left '+item.id);near(item.left,item.transformedLeft,'getBBox transformed to screen agrees with DOM rect');
  for(const axis of [0,1]){near(item.screen[axis],item.world[axis+2]*zoom,'native SVG size');near(item.screen[axis],item.transformedSize[axis],'native SVG transformed size');}
 }
 const minimum=items=>Math.min(...items.map(item=>item.left));
 const result={zoom,inset,nodeLeft:minimum(measured.nodes),edgeLeft:minimum(measured.edges),labelGlyphLeft:minimum(measured.labels),nativeLabelWorldLeft:Math.min(...measured.labels.map(item=>item.world[0])),glyphBoxesLeftOfViewport:measured.labels.filter(item=>item.left<0).map(item=>item.id),metric:'Native getBBox/getBoundingClientRect; no stroke/marker expansion, clipping or overlap claim'};
 near(result.nodeLeft,(40+inset)*zoom,'sample leftmost node');near(result.edgeLeft,(8+inset)*zoom,'sample exact SVG path minimum');
 if(inset===40)assert.ok(result.edgeLeft>0);
 return result;
}
async function painted(page){await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));}
async function ready(page,count){await page.waitForFunction(count=>!document.querySelector('#open').disabled&&document.querySelectorAll('.tab').length===count,count);}
async function openFreshSample(page){
 await page.goto(origin);await ready(page,0);assert.equal(await page.locator('#drawer').isDisabled(),true,'do not click an empty drawer');
 await page.locator('#open-sample').click();await ready(page,1);assert.equal(await page.locator('.node').count(),25);
 // Open the document before dismissing overlays, including the mobile drawer.
 if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
 if(await page.locator('#node-list-drawer').isVisible())await page.locator('#node-list-toggle').click();
 await waitForExactRead(()=>page.evaluate(readSessionInPage),{tabs:1,source:'sample',drawer:false,nodeDrawer:false},{project:s=>({tabs:s?.tabs?.length,source:activeOf(s)?.source?.kind,drawer:s?.drawer,nodeDrawer:s?.nodeDrawer})});
 const saved=await waitSavedViewer(page,{zoom:1,scroll:[0,0],viewInset:[40,0],canvasOrigin:undefined});
 assert.equal(saved.drawer,false);assert.equal(saved.nodeDrawer,false);assert.equal(activeOf(saved).source.kind,'sample');assert.deepEqual(activeOf(saved).design.graph,design.graph);
 const world=await page.evaluate(readInitialMarginWorldInPage);assert.deepEqual(world.positions,activeOf(saved).positions);assert.equal(Object.keys(world.routes).length,63);assert.equal(Math.min(...Object.values(world.positions).map(p=>p[0])),40);
 return {layout:layoutOf(activeOf(saved)),world};
}
async function seedAndRestore(page,layout,{omitInset=false,closed=false}={}){
 await page.goto(origin+'LICENSE.txt');assert.equal(await page.evaluate(seedInitialLeftMarginSession,{layout,omitInset,closed}),true);
 const expected={...layout,...(omitInset?{viewInset:undefined}:{})};
 const committed=await waitForExactRead(()=>page.evaluate(readSessionInPage),expected,{project:s=>layoutOf(closed?s?.sampleLayout:activeOf(s))});
 if(omitInset)assert.equal(Object.hasOwn(closed?committed.actual.sampleLayout:activeOf(committed.actual),'viewInset'),false,'fixture genuinely omits the legacy property');
 await page.goto(origin);await ready(page,closed?0:1);return expected;
}
async function assertCamera(page,layout){
 await painted(page);const actual=await page.evaluate(()=>{const v=document.querySelector('#viewport'),n=document.querySelector('#nodes'),e=document.querySelector('#edges');return {scroll:[v.scrollLeft,v.scrollTop],nodeOffset:[parseFloat(n.style.left),parseFloat(n.style.top)],edgeOffset:[parseFloat(e.style.left),parseFloat(e.style.top)],zoom:document.querySelector('#zoom').textContent};});
 assert.deepEqual(actual.scroll,layout.scroll,'stored native pan is not migrated');assert.equal(actual.zoom,`${Math.round(layout.zoom*100)}%`);
 for(const axis of [0,1]){near(actual.nodeOffset[axis],((layout.viewInset?.[axis]??0)+(layout.canvasOrigin?.[axis]??0))*layout.zoom,'saved card offset');near(actual.edgeOffset[axis],(layout.viewInset?.[axis]??0)*layout.zoom,'saved edge offset');}
 await waitSavedViewer(page,layout);
}
async function inspectEmpty(page){
 await painted(page);const frame=await page.evaluate(()=>{
  const v=document.querySelector('#viewport'),link=document.querySelector('#open-sample'),empty=document.querySelector('#empty'),r=link.getBoundingClientRect(),b=v.getBoundingClientRect(),h=empty.getBoundingClientRect(),hit=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);
  const shown=e=>!e.hidden&&getComputedStyle(e).display!=='none'&&getComputedStyle(e).visibility!=='hidden';
  return {tabs:document.querySelectorAll('.tab').length,link:[r.left,r.top,r.right,r.bottom],hint:[h.left,h.top,h.right,h.bottom],viewport:[b.left,b.top,b.right,b.bottom],window:[0,0,innerWidth,innerHeight],visible:shown(empty)&&shown(link),size:[r.width,r.height],hit:hit===link||link.contains(hit),scroll:[v.scrollLeft,v.scrollTop],extent:[v.scrollWidth,v.scrollHeight],client:[v.clientWidth,v.clientHeight],canvas:shown(document.querySelector('#canvas')),toolbar:shown(document.querySelector('.toolbar')),drawers:['formattedMarkdownDrawer','node-list-drawer'].map(id=>shown(document.getElementById(id))),disabled:['drawer','node-list-toggle'].map(id=>document.getElementById(id).disabled)};
 });
 const contains=(outer,inner)=>inner[0]>=outer[0]-.75&&inner[1]>=outer[1]-.75&&inner[2]<=outer[2]+.75&&inner[3]<=outer[3]+.75;
 assert.equal(frame.tabs,0);assert.equal(frame.visible,true);assert.ok(frame.size.every(n=>n>0));assert.equal(frame.hit,true,'sample link is actually hit-testable');
 assert.ok(contains(frame.viewport,frame.hint)&&contains(frame.viewport,frame.link)&&contains(frame.window,frame.link));assert.deepEqual(frame.scroll,[0,0]);assert.equal(frame.canvas,false);assert.equal(frame.toolbar,false);assert.deepEqual(frame.drawers,[false,false]);assert.deepEqual(frame.disabled,[true,true]);
 for(const axis of [0,1])assert.ok(frame.extent[axis]<=frame.client[axis]+1,'closed graph does not leave a scroll extent');return frame;
}
async function closeAndReopen(page,layout,world){
 await page.locator('.tab.active .close').click();await ready(page,0);
 await waitForExactRead(()=>page.evaluate(readSessionInPage),{tabs:0,layout},{project:s=>({tabs:s?.tabs?.length,layout:layoutOf(s?.sampleLayout)})});
 await inspectEmpty(page);await page.reload();await ready(page,0);const empty=await inspectEmpty(page);
 await page.locator('#open-sample').focus();await page.keyboard.press('Enter');await ready(page,1);
 await assertCamera(page,layout);assert.deepEqual(await page.evaluate(readInitialMarginWorldInPage),world,'closed-session reload and reopen preserve every coordinate and route');return empty;
}
async function verifyFreshZoom(page,zoom){
 const fresh=await openFreshSample(page),layout={...fresh.layout,zoom};
 // 100% remains a direct fresh open. Lower zooms are committed through IDB only
 // after disposing the app, then tested through its ordinary restore path.
 if(zoom!==1)await seedAndRestore(page,layout);
 const measurements=[];let paddedReference;
 for(const width of initialLeftMarginWidths){
  await page.setViewportSize({width,height:960});await assertCamera(page,layout);
  assert.deepEqual(await page.evaluate(readInitialMarginWorldInPage),fresh.world,'zoom and viewport change no world geometry');
  const native=await page.evaluate(readInitialMarginGeometryInPage);if(width===1280)paddedReference=native;
  const measurement={width,...assertInitialMarginGeometry(native,{zoom})};measurements.push(measurement);console.log('INITIAL_LEFT_MARGIN_GEOMETRY '+JSON.stringify(measurement));
 }
 const empty=await closeAndReopen(page,layout,fresh.world);let noInsetReference;
 if(zoom===.36){
  await page.setViewportSize({width:1280,height:960});const legacy=await seedAndRestore(page,layout,{omitInset:true});await assertCamera(page,legacy);
  assert.deepEqual(await page.evaluate(readInitialMarginWorldInPage),fresh.world,'removing only camera inset changes no node, SVG path, label or routing status');
  const native=await page.evaluate(readInitialMarginGeometryInPage);noInsetReference=assertInitialMarginGeometry(native,{zoom,inset:0});
  for(const kind of ['nodes','edges','labels'])for(const item of paddedReference[kind]){const previous=native[kind].find(old=>old.id===item.id);assert.ok(previous);assert.deepEqual(item.world,previous.world,'inset does not change native '+kind+' geometry');near(item.left-previous.left,40*zoom,'36% exact per-element camera translation '+kind+' '+item.id);}
  near(measurements[0].nodeLeft,noInsetReference.nodeLeft*2,'36% initial node margin doubles');
  for(const key of ['nodeLeft','edgeLeft','labelGlyphLeft'])near(measurements[0][key]-noInsetReference[key],40*zoom,'same 40-world-unit translation for '+key);
 }
 return {zoom,measurements,noInsetReference,emptyAfterClose:{hit:empty.hit,scroll:empty.scroll},worldCoordinatesAndRoutes:'unchanged',committedReopen:'exact'};
}
function manualLegacyLayout(fresh){
 const positions=structuredClone(fresh.positions),ids=Object.keys(positions);positions[ids[0]]=[180,156];positions[ids.at(-1)]=[2600,2400];
 return {...fresh,positions,zoom:.36,scroll:[128,192],viewInset:undefined,canvasOrigin:undefined};
}
async function verifyLegacy(page){
 const fresh=await openFreshSample(page),layout=manualLegacyLayout(fresh.layout);await seedAndRestore(page,layout,{omitInset:true});await assertCamera(page,layout);
 const world=await page.evaluate(readInitialMarginWorldInPage);assert.deepEqual(world.positions,layout.positions);
 await page.reload();await ready(page,1);await assertCamera(page,layout);assert.deepEqual(await page.evaluate(readInitialMarginWorldInPage),world,'legacy active-tab reload has no layout migration');
 await page.locator('.tab.active .close').click();await ready(page,0);await inspectEmpty(page);
 await waitForExactRead(()=>page.evaluate(readSessionInPage),layout,{project:s=>layoutOf(s?.sampleLayout)});
 await seedAndRestore(page,layout,{omitInset:true,closed:true});await inspectEmpty(page);
 await page.locator('#open-sample').click();await ready(page,1);await assertCamera(page,layout);
 assert.deepEqual(await page.evaluate(readInitialMarginWorldInPage),world,'legacy sampleLayout with missing inset never inherits the new default');
 await closeAndReopen(page,layout,world);
 return {activeLegacyMissingInset:true,closedLegacyMissingInset:true,manualPositions:25,zoom:.36,scroll:layout.scroll,viewInset:'absent remains zero',routes:'exact after reload and close/reopen'};
}
const errorDetails=error=>(error?.stack??String(error))+(Array.isArray(error?.errors)?'\nNested errors:\n'+error.errors.map(errorDetails).join('\n'):'');
async function isolated(browser,run){
 let context,timer,result,expired=false;const errors=[],failures=[];
 const work=(async()=>{context=await browser.newContext({viewport:{width:1280,height:960}});if(expired){await context.close();return;}
  const page=await context.newPage();page.setDefaultTimeout(4000);page.setDefaultNavigationTimeout(5000);page.on('pageerror',error=>errors.push(error));return await run(page);
 })();
 try{result=await Promise.race([work,new Promise((_,reject)=>{timer=setTimeout(()=>{expired=true;reject(Error('Initial-left-margin case deadline exceeded'));},initialLeftMarginLimits.caseMs);})]);}catch(error){failures.push(error);}
 finally{clearTimeout(timer);if(context){let cleanup;try{await Promise.race([context.close(),new Promise((_,reject)=>{cleanup=setTimeout(()=>reject(Error('Initial-left-margin cleanup deadline exceeded')),initialLeftMarginLimits.cleanupMs);})]);}catch(error){failures.push(error);}finally{clearTimeout(cleanup);}}}
 failures.push(...errors);if(failures.length){const error=new AggregateError(failures,'Initial-left-margin case, page or cleanup failure');error.stack+='\n'+failures.map(errorDetails).join('\n');throw error;}return result;
}
export async function verifyInitialLeftMargin(browser){return runBrowserCases([
 ...initialLeftMarginZooms.map(zoom=>({name:`initial left margin ${zoom*100}%`,run:()=>isolated(browser,page=>verifyFreshZoom(page,zoom))})),
 {name:'legacy manual camera and missing sample inset',run:()=>isolated(browser,verifyLegacy)}
]);}

export async function preflightInitialLeftMargin(){
 const {JSDOM}=await import('jsdom'),{IDBFactory}=await import('fake-indexeddb'),{build}=await import('esbuild');
 const source=readFileSync(new URL('../src/main.ts',import.meta.url),'utf8'),mainSha256=createHash('sha256').update(source).digest('hex');
 assert.equal(design.graph.nodes.length,25);assert.equal(design.graph.relations.length,63);
 const primary=Error('controlled margin case failure'),cleanup=Error('controlled margin cleanup failure'),pageError=Error('controlled margin page error');
 const fakeBrowser={newContext:async()=>({newPage:async()=>({setDefaultTimeout(){},setDefaultNavigationTimeout(){},on(_event,listener){listener(pageError);}}),close:async()=>{throw cleanup;}})};
 await assert.rejects(isolated(fakeBrowser,async()=>{throw primary;}),error=>{assert.deepEqual(error.errors,[primary,cleanup,pageError]);for(const expected of [primary,cleanup,pageError])assert.ok(errorDetails(error).includes(expected.stack));return true;});
 const sequence=[];await assert.rejects(runBrowserCases([{name:'controlled failure',run:()=>{sequence.push('failed');throw primary;}},{name:'independent next case',run:()=>{sequence.push('continued');return true;}}],()=>{}),error=>error.results.length===2&&error.results[1].status==='passed');assert.deepEqual(sequence,['failed','continued']);
 const {outputFiles}=await build({entryPoints:[fileURLToPath(new URL('../src/main.ts',import.meta.url))],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}}),db=new IDBFactory(),windows=[];
 function makeWindow(product=true){const w=new JSDOM('<div id="app"></div>',{url:origin,runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);w.indexedDB=db;w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;if(product)w.eval(outputFiles[0].text);return w;}
 const adapter=w=>({evaluate:async(fn,arg)=>structuredClone(await w.eval(`(${fn.toString()})`)(structuredClone(arg)))});
 const boot=async()=>{const w=makeWindow();await waitForExactRead(()=>w.document.querySelector('#open').disabled,false,{timeoutMs:3000,intervalMs:10});return w;};
 const assertModel=async(w,layout,world)=>{
  const page=adapter(w),d=w.document;assert.deepEqual(await page.evaluate(readInitialMarginWorldInPage),world);assert.equal(d.querySelector('#zoom').textContent,`${Math.round(layout.zoom*100)}%`);assert.deepEqual([d.querySelector('#viewport').scrollLeft,d.querySelector('#viewport').scrollTop],layout.scroll);
  for(const axis of [0,1]){const key=axis?'top':'left';near(parseFloat(d.querySelector('#nodes').style[key]),((layout.viewInset?.[axis]??0)+(layout.canvasOrigin?.[axis]??0))*layout.zoom,'model card offset');near(parseFloat(d.querySelector('#edges').style[key]),(layout.viewInset?.[axis]??0)*layout.zoom,'model edge offset');}
  await waitSavedViewer(page,layout);assert.equal(d.querySelector('#formattedMarkdownDrawer').hidden,true);assert.equal(d.querySelector('#node-list-drawer').hidden,true);
 };
 try{
  const w=await boot(),d=w.document,$=id=>d.getElementById(id),page=adapter(w);
  for(const selector of selectors)assert.equal(d.querySelectorAll(selector).length,1,selector);
  assert.equal($('drawer').disabled,true);$('open-sample').click();assert.equal(d.querySelectorAll('.node').length,25);assert.equal(d.querySelectorAll('.edge').length,63);assert.equal($('drawer').disabled,false);
  if(!$('formattedMarkdownDrawer').hidden)$('drawer').click();if(!$('node-list-drawer').hidden)$('node-list-toggle').click();
  const saved=await waitSavedViewer(page,{zoom:1,scroll:[0,0],viewInset:[40,0],canvasOrigin:undefined}),fresh=layoutOf(activeOf(saved)),world=await page.evaluate(readInitialMarginWorldInPage);
  assert.deepEqual(activeOf(saved).design.graph,design.graph);assert.deepEqual(world.positions,fresh.positions);assert.equal(Math.min(...Object.values(fresh.positions).map(p=>p[0])),40);assert.equal(Object.keys(world.routes).length,63);
  // Exercise the actual source-dialog/parser ordering, then return to sample.
  $('open-text').click();assert.equal($('source-dialog').hidden,false);$('source-text').value=raw;await $('source-submit').onclick();assert.equal($('source-dialog').hidden,true);assert.equal(d.querySelectorAll('.tab').length,2);
  await waitForExactRead(()=>page.evaluate(readSessionInPage),{tabs:2,source:'text'},{project:s=>({tabs:s?.tabs?.length,source:activeOf(s)?.source?.kind})});
  const text=await waitSavedViewer(page,{viewInset:[40,0],zoom:1,scroll:[0,0]});assert.equal(activeOf(text).source.kind,'text');assert.deepEqual(await page.evaluate(readInitialMarginWorldInPage),world);
  await d.querySelector('.tab.active .close').onclick();await assertModel(w,fresh,world);w.close();
  const storage=makeWindow(false),storagePage=adapter(storage);
  for(const zoom of initialLeftMarginZooms){
   const layout={...fresh,zoom};assert.equal(await storagePage.evaluate(seedInitialLeftMarginSession,{layout}),true);await waitSavedViewer(storagePage,layout);
   const restored=await boot();await assertModel(restored,layout,world);await restored.document.querySelector('.tab.active .close').onclick();
   assert.equal(restored.document.querySelector('#empty').hidden,false);assert.equal(restored.document.querySelector('#canvas').hidden,true);assert.equal(restored.document.querySelector('.toolbar').hidden,true);
   assert.deepEqual(layoutOf((await storagePage.evaluate(readSessionInPage)).sampleLayout),layout);restored.close();
   const closed=await boot();assert.equal(closed.document.querySelectorAll('.tab').length,0);assert.equal(closed.document.querySelector('#drawer').disabled,true);closed.document.querySelector('#open-sample').click();await assertModel(closed,layout,world);closed.close();
  }
  const zero={...fresh,zoom:.36,viewInset:undefined};await storagePage.evaluate(seedInitialLeftMarginSession,{layout:zero,omitInset:true});assert.equal(Object.hasOwn(activeOf(await storagePage.evaluate(readSessionInPage)),'viewInset'),false);
  const noInset=await boot();await assertModel(noInset,zero,world);noInset.close();
  const manual=manualLegacyLayout(fresh);await storagePage.evaluate(seedInitialLeftMarginSession,{layout:manual,omitInset:true});await waitSavedViewer(storagePage,manual);
  const legacy=await boot(),legacyWorld=await adapter(legacy).evaluate(readInitialMarginWorldInPage);assert.deepEqual(legacyWorld.positions,manual.positions);await assertModel(legacy,manual,legacyWorld);legacy.close();
  const cold=await boot();await assertModel(cold,manual,legacyWorld);await cold.document.querySelector('.tab.active .close').onclick();cold.close();
  await storagePage.evaluate(seedInitialLeftMarginSession,{layout:manual,closed:true,omitInset:true});const historical=await storagePage.evaluate(readSessionInPage);assert.equal(historical.tabs.length,0);assert.equal(Object.hasOwn(historical.sampleLayout,'viewInset'),false);
  const reopen=await boot();assert.equal(reopen.document.querySelectorAll('.tab').length,0);reopen.document.querySelector('#open-sample').click();await assertModel(reopen,manual,legacyWorld);
  assert.equal(createHash('sha256').update(readFileSync(new URL('../src/main.ts',import.meta.url))).digest('hex'),mainSha256,'product source stays pinned during preflight');
  const result={initialLeftMarginPreflight:'passed',mainSha256,nodes:25,relations:63,browserCases:4,zoomCases:initialLeftMarginZooms,widths:initialLeftMarginWidths,selectors:selectors.length,newInset:[40,0],legacyInset:'absent remains zero',manualCamera:{zoom:manual.zoom,scroll:manual.scroll},limits:initialLeftMarginLimits,browserExecuted:false,limit:'Real parser, DOM control order, committed fake-IDB and independent case/error aggregation only. Native SVG/glyph bounds, hit testing, scroll clamping and Chromium restore cases are prepared, not executed; case budgets are uncalibrated.'};console.log(JSON.stringify(result));return result;
 }finally{windows.forEach(w=>w.close());}
}
if(process.argv.includes('--preflight')&&process.argv[1]===fileURLToPath(import.meta.url))await preflightInitialLeftMargin();
