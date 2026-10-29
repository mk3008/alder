import {useUngroupedSample} from './legacy-sample-browser.mjs';
import {openSourceAction} from './source-menu-browser.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseDesign} from '../src/graph.ts';
import {reconcile} from '../src/session.ts';
import {readSessionInPage,waitForExactRead,waitSavedViewer} from './wait-saved-viewer.mjs';
import {touchDriver} from './touch-driver.mjs';

// Importing this module never launches a browser. The parent browser gate owns
// Chromium/server and explicitly calls verifyEmptyState(browser). --preflight
// runs only the real parser, DOM and fake-IndexedDB setup checks at the bottom.
const origin='http://127.0.0.1:4173/';
export const emptyStateMatrix=[1280,393,320].flatMap(width=>[.25,1,2.5].map(zoom=>({width,zoom,height:width===320?568:852})));
export const emptyStateLimits={caseMs:8000,suiteMs:100000,cleanupMs:2000};
export const emptyLayoutFields=['positions','selected','scroll','zoom','hiddenNodes','showExceptions','selectedEdgesOnly','viewInset','canvasOrigin'];
export const emptyStateSelectors=['#open','#open-sample','#empty','#viewport','#canvas','#nodes','#edges','.toolbar','#zoom','#drawer','#formattedMarkdownDrawer','#node-list-toggle','#node-list-drawer','#open-text','#source-text','#source-submit'];
const raw=readFileSync(new URL('./authorities/ungrouped-alder.md',import.meta.url),'utf8');
const design=parseDesign(raw);
export function emptyStateFixture(zoom){
 const tab=reconcile({key:'fixture',name:'Alder',design,positions:{},scroll:[7000,6000],zoom,source:{kind:'sample'}},design),ids=Object.keys(tab.positions);
 tab.positions[ids[0]]=[-640,-420];tab.positions[ids[1]]=[22000,17000];
 return {positions:{...tab.positions},selected:ids[0],scroll:tab.scroll,zoom,hiddenNodes:[],showExceptions:false,selectedEdgesOnly:true,viewInset:[320,240],canvasOrigin:[12000,10000]};
}
export const emptyLayoutProjection=tab=>Object.fromEntries(emptyLayoutFields.map(key=>[key,tab?.[key]]));

// Same-origin non-product page only: navigation disposes the old app debounce.
// Await transaction completion, then independently read the committed value.
// Never seed a living app, infer persistence from DOM, or rename the drawer key.
export function seedEmptyStateSession({layout,drawer=true,nodeDrawer=true}){return new Promise((resolve,reject)=>{
 const request=indexedDB.open('alder-web-viewer',1);request.onerror=()=>reject(request.error);
 request.onsuccess=()=>{const db=request.result;let failure;
  try{const tx=db.transaction('session','readwrite'),store=tx.objectStore('session'),get=store.get('current');
   get.onsuccess=()=>{const session=get.result;if(session?.format>=2){const {format,document,views,recovery,...rest}=session;Object.keys(session).forEach(k=>delete session[k]);Object.assign(session,rest,{tabs:views.map(view=>({...document,...view}))});}const tab=session?.tabs?.find(t=>t.key===session.active);
    if(!tab||tab.source?.kind!=='sample'){failure=Error('Empty-state fixture needs an active saved public sample');tx.abort();return;}
    Object.assign(tab,layout);session.drawer=drawer;session.nodeDrawer=nodeDrawer;store.put(session,'current');
   };
   tx.oncomplete=()=>{db.close();resolve(true);};tx.onerror=tx.onabort=()=>{db.close();reject(failure??tx.error??Error('Empty-state fixture commit failed'));};
  }catch(error){db.close();reject(error);}
 };
});}

export function readEmptyFrameInPage(){
 const box=e=>{const r=e.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height};};
 const visible=e=>!e.hidden&&getComputedStyle(e).display!=='none'&&getComputedStyle(e).visibility!=='hidden';
 const v=document.querySelector('#viewport'),hint=document.querySelector('#empty'),link=document.querySelector('#open-sample'),canvas=document.querySelector('#canvas'),toolbar=document.querySelector('.toolbar');
 const linkBox=box(link),hit=document.elementFromPoint(linkBox.left+linkBox.width/2,linkBox.top+linkBox.height/2);
 return {tabs:document.querySelectorAll('.tab').length,window:{width:innerWidth,height:innerHeight},viewport:box(v),hint:{...box(hint),visible:visible(hint),text:hint.textContent},link:{...linkBox,visible:visible(link),hit:hit===link||link.contains(hit),tabIndex:link.tabIndex,disabled:link.getAttribute('aria-disabled')},scroll:[v.scrollLeft,v.scrollTop],extent:[v.scrollWidth,v.scrollHeight],client:[v.clientWidth,v.clientHeight],canvasVisible:visible(canvas),toolbarVisible:visible(toolbar),explorerVisible:visible(document.getElementById('design-explorer')),drawers:['formattedMarkdownDrawer','node-list-drawer'].map(id=>({id,visible:visible(document.getElementById(id))})),toggles:['drawer','node-list-toggle'].map(id=>({id,disabled:document.getElementById(id).disabled,expanded:document.getElementById(id).getAttribute('aria-expanded')}))};
}
export function assertEmptyFrame(frame){
 const contains=(outer,inner)=>inner.left>=outer.left-.75&&inner.top>=outer.top-.75&&inner.right<=outer.right+.75&&inner.bottom<=outer.bottom+.75;
 assert.equal(frame.tabs,0);assert.equal(frame.hint.visible,true);assert.match(frame.hint.text,/業務設計書を開くには/);
 assert.equal(frame.link.visible,true);assert.ok(frame.link.width>0&&frame.link.height>0);
 assert.ok(contains(frame.viewport,frame.hint),'whole explanation is inside the visible graph viewport');
 assert.ok(contains(frame.viewport,frame.link),'sample link is inside the visible graph viewport');
 assert.ok(contains({left:0,top:0,right:frame.window.width,bottom:frame.window.height},frame.link),'sample link is inside the window');
 assert.equal(frame.link.hit,true,'real elementFromPoint must reach the sample link');assert.equal(frame.link.tabIndex,0);assert.equal(frame.link.disabled,'false');
 assert.deepEqual(frame.scroll,[0,0]);assert.equal(frame.canvasVisible,false);assert.equal(frame.toolbarVisible,false);
 for(const drawer of frame.drawers)assert.equal(drawer.visible,false,drawer.id+' cannot obscure empty help');
 for(const toggle of frame.toggles){assert.equal(toggle.disabled,toggle.id==='drawer');assert.equal(toggle.expanded,toggle.id==='drawer'?'false':String(frame.explorerVisible));}
 for(let axis=0;axis<2;axis++)assert.ok(frame.extent[axis]<=frame.client[axis]+1,'old world extent cannot remain in the empty scroll area');
 return frame;
}
async function painted(page){await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));}
async function inspectEmpty(page){await painted(page);return assertEmptyFrame(await page.evaluate(readEmptyFrameInPage));}
async function ready(page,count){await page.waitForFunction(count=>!document.querySelector('#open').disabled&&document.querySelectorAll('.tab').length===count,count);}
async function openPublicSample(page){
 await page.goto(origin);await ready(page,0);
 assert.equal(await page.locator('#drawer').isDisabled(),true,'never click the detail drawer while the app is empty');
 await page.locator('#open-sample').click();await ready(page,1);await useUngroupedSample(page);
 assert.equal(await page.locator('.node').count(),design.graph.nodes.length);
 await waitForExactRead(()=>page.evaluate(readSessionInPage),true,{project:s=>s?.tabs?.length===1&&s.tabs[0].source?.kind==='sample'});
 // Valid order: open sample first, then close its unrelated overlays.
 if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
 if(await page.locator('#node-list-drawer').isVisible())await page.locator('#node-list-toggle').click();
 await waitForExactRead(()=>page.evaluate(readSessionInPage),{drawer:false,nodeDrawer:false},{project:s=>({drawer:s?.drawer,nodeDrawer:!!s?.nodeDrawer})});
}
async function seedAndRestore(page,layout){
 await openPublicSample(page);await page.goto(origin+'LICENSE.txt');
 assert.equal(await page.evaluate(seedEmptyStateSession,{layout}),true);
 const committed=await waitSavedViewer(page,layout);assert.equal(committed.drawer,true);assert.equal(committed.nodeDrawer,true);
 await page.goto(origin);await ready(page,1);await assertGraph(page,layout);return committed.active;
}
async function assertGraph(page,layout,{drawer=true,nodeDrawer=false}={}){
 await painted(page);
 const observed=await page.evaluate(expected=>{
  const v=document.querySelector('#viewport'),n=document.querySelector('#nodes'),style=document.createElement('div').style;style.transform=`scale(${expected.zoom})`;
  const positions=Object.fromEntries([...document.querySelectorAll('.node')].map(node=>[node.dataset.node,[node.style.left,node.style.top]]));
  const canonical=Object.fromEntries(Object.entries(expected.positions).map(([id,p])=>{const s=document.createElement('div').style;s.left=p[0]+'px';s.top=p[1]+'px';return [id,[s.left,s.top]];}));
  return {positions,canonical,scroll:[v.scrollLeft,v.scrollTop],offset:[n.style.left,n.style.top],transform:n.style.transform,canonicalTransform:style.transform,canvasHidden:document.querySelector('#canvas').hidden,emptyHidden:document.querySelector('#empty').hidden,toolbarHidden:document.querySelector('.toolbar').hidden,drawer:!document.querySelector('#formattedMarkdownDrawer').hidden,nodeDrawer:!document.querySelector('#node-list-drawer').hidden,extent:[v.scrollWidth,v.scrollHeight]};
 },layout);
 assert.deepEqual(observed.positions,observed.canonical,'all world coordinates match the independent saved fixture exactly');
 assert.deepEqual(observed.scroll,layout.scroll,'native camera scroll is restored exactly');
 assert.deepEqual(observed.offset,layout.canvasOrigin.map((n,i)=>(n+layout.viewInset[i])*layout.zoom+'px'));
 assert.equal(observed.transform,observed.canonicalTransform);assert.equal(observed.emptyHidden,true);assert.equal(observed.canvasHidden,false);assert.equal(observed.toolbarHidden,false);assert.equal(observed.drawer,drawer);assert.equal(observed.nodeDrawer,nodeDrawer);
 await waitSavedViewer(page,layout);return observed;
}
async function closeLast(page,layout){
 await page.locator('.tab.active .close').click();await ready(page,0);
 const state=await waitForExactRead(()=>page.evaluate(readSessionInPage),{tabs:[],sampleLayout:layout,drawer:true,nodeDrawer:true},{project:s=>({tabs:s?.tabs,sampleLayout:emptyLayoutProjection(s?.sampleLayout),drawer:s?.drawer,nodeDrawer:s?.nodeDrawer})});
 return {empty:await inspectEmpty(page),saved:state.observed};
}
async function disturbEmpty(page,touch,frame){
 const v=frame.viewport,x=Math.round(v.left+v.width/2),y=Math.round(v.top+v.height*.75);
 await page.mouse.move(x,y);await page.mouse.wheel(700,900);await inspectEmpty(page);
 await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x-65,y-60,{steps:3});await page.mouse.up();await inspectEmpty(page);
 // Real observed touch events exercise the public pinch path while no tab is
 // active. There is deliberately no force-click on hidden zoom controls.
 await touch.send('touchStart',[[1,x-35,y],[2,x+35,y]]);
 await touch.send('touchMove',[[1,x-65,y],[2,x+65,y]]);await touch.send('touchEnd',[]);
 await inspectEmpty(page);
 const events=await page.evaluate(()=>window.touchTrace.filter(e=>['pointerdown','pointermove'].includes(e.type)));
 assert.ok(events.filter(e=>e.type==='pointerdown'&&e.region==='graph').length>=2,'both pinch contacts must really land in the graph');
 assert.ok(events.some(e=>e.type==='pointermove'),'pinch movement must be observed');
}
async function verifyOneEmpty({page,touch,options}){
 await page.goto(origin);await ready(page,0);const empty=await inspectEmpty(page);await disturbEmpty(page,touch,empty);
 const expected=emptyStateFixture(options.zoom);await seedAndRestore(page,expected);
 const before=await assertGraph(page,expected);assert.ok(before.extent[0]>options.width&&before.extent[1]>options.height);assert.ok(before.scroll.every(n=>n>1000));
 assert.equal(await page.locator('.tab.active .close').isVisible(),true,'overview can be closed');
 // Keep the seeded app-wide drawer preference true. At phone width the rail
 // covers the tab row; use the close button's native keyboard activation.
 // Pointer dismissal of the rail would intentionally change that preference.
 if(options.width<=800)await page.locator('.tab.active .close').press('Enter');
 else await page.locator('.tab.active .close').click();
 assert.equal(await page.locator('#empty-workspace').isVisible(),true,'closing the last workspace shows the empty workspace');
 if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();
 await page.locator('[data-explorer-key="business:overview"]').click();
 await assertGraph(page,expected);
 await page.reload();await ready(page,1);await assertGraph(page,expected);
 return {...options,empty,restoredFields:emptyLayoutFields,activation:['pointer and keyboard sample in initial empty viewport'],gestures:['wheel','mouse pan','observed two-contact pinch'],closeAndReopenOverview:true};
}
async function verifyRemainingTab({page}){
 const expected=emptyStateFixture(1);await seedAndRestore(page,expected);
 await openSourceAction(page,'open-text');await page.locator('#source-text').fill(raw);await page.locator('#source-submit').click();await ready(page,1);
 assert.equal(await page.locator('#document-recovery').count(),0);assert.equal(await page.locator('.tab').count(),1);const before=await page.locator('#nodes').innerHTML();await page.reload();await ready(page,1);assert.equal(await page.locator('#nodes').innerHTML(),before);
 return {replacementHasOneCurrentBody:true,newCurrentSurvivesReload:true};
}
async function isolated(browser,options,run){
 let context,timer,result,expired=false;const errors=[],failures=[];
 const work=(async()=>{context=await browser.newContext({viewport:{width:options.width,height:options.height},hasTouch:true});if(expired){await context.close();return;}
  const page=await context.newPage();page.setDefaultTimeout(2500);page.setDefaultNavigationTimeout(4000);page.on('pageerror',e=>errors.push(e.message));
  const touch=touchDriver(page,await context.newCDPSession(page));await touch.install();const result=await run({page,touch,options});assert.deepEqual(errors,[]);return result;
 })();
 try{result=await Promise.race([work,new Promise((_,reject)=>{timer=setTimeout(()=>{expired=true;reject(Error('Empty-state case deadline exceeded'));},emptyStateLimits.caseMs);})]);}catch(error){failures.push(error);}
 finally{clearTimeout(timer);if(context){let cleanup;try{await Promise.race([context.close(),new Promise((_,reject)=>{cleanup=setTimeout(()=>reject(Error('Empty-state context cleanup deadline exceeded')),emptyStateLimits.cleanupMs);})]);}catch(error){failures.push(error);}finally{clearTimeout(cleanup);}}}
 if(failures.length>1)throw new AggregateError(failures,'Empty-state case and context cleanup both failed');
 if(failures.length)throw failures[0];return result;
}
const emptyCaseError=error=>(error?.stack??String(error))+(Array.isArray(error?.errors)?'\nNested errors:\n'+error.errors.map(emptyCaseError).join('\n'):'');
export async function verifyEmptyState(browser){
 const cases=[...emptyStateMatrix.map(options=>({name:`empty ${options.width}px ${options.zoom*100}%`,options,run:verifyOneEmpty})),{name:'multiple tabs retain remaining document',options:{width:1280,height:852},run:verifyRemainingTab}],results=[],deadline=performance.now()+emptyStateLimits.suiteMs;
 for(const test of cases){
  if(performance.now()+emptyStateLimits.caseMs+emptyStateLimits.cleanupMs>deadline)results.push({name:test.name,status:'not-run',error:'Empty-state suite budget exhausted; unverified case fails this gate.'});
  else try{results.push({name:test.name,status:'passed',result:await isolated(browser,test.options,test.run)});}catch(error){results.push({name:test.name,status:'failed',error:emptyCaseError(error)});}
  console.log('EMPTY_STATE_CASE '+JSON.stringify(results.at(-1)));
 }
 const failed=results.filter(r=>r.status!=='passed');console.log('EMPTY_STATE_CASE_RESULTS '+JSON.stringify({total:results.length,passed:results.length-failed.length,failed:failed.length,results}));
 if(failed.length){const error=new AggregateError(failed.map(r=>Error(r.name+': '+r.error)),`${failed.length}/${results.length} empty-state cases failed`);error.results=results;throw error;}
 return {passed:results.length,checks:results,limits:['CDP pinch is observed browser input, not physical mobile hardware.','Storage failure is covered by the separate local controlled-save model.','The 8-second case budget is not yet calibrated for this new browser suite.']};
}

export async function preflightEmptyStateBrowser(){
 const {JSDOM}=await import('jsdom'),{IDBFactory}=await import('fake-indexeddb'),{build}=await import('./legacy-viewer-fixture.mjs');
 assert.equal(design.graph.nodes.length,25);assert.equal(design.graph.relations.length,63);assert.equal(emptyStateMatrix.length,9);assert.equal(new Set(emptyStateMatrix.map(c=>`${c.width}/${c.zoom}`)).size,9);
 // Harness-only failures: no browser, DOM geometry or native input is involved.
 const primary=Error('controlled case failure'),cleanup=Error('controlled cleanup failure');
 const fakeBrowser=cleanupError=>({newContext:async()=>({newPage:async()=>({setDefaultTimeout(){},setDefaultNavigationTimeout(){},on(){},addInitScript:async()=>{}}),newCDPSession:async()=>({}),close:async()=>{if(cleanupError)throw cleanupError;}})});
 await assert.rejects(isolated(fakeBrowser(cleanup),{width:320,height:568},async()=>{throw primary;}),error=>{assert.ok(error instanceof AggregateError);assert.deepEqual(error.errors,[primary,cleanup]);const reported=emptyCaseError(error);assert.ok(reported.includes(primary.stack)&&reported.includes(cleanup.stack));return true;});
 await assert.rejects(isolated(fakeBrowser(cleanup),{width:320,height:568},async()=>({ok:true})),error=>error===cleanup);
 await assert.rejects(isolated(fakeBrowser(),{width:320,height:568},async()=>{throw primary;}),error=>error===primary);
 const {outputFiles}=await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}}),db=new IDBFactory(),windows=[];
 async function boot(){const w=new JSDOM('<style></style><div id="app"></div>',{url:origin,runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);w.indexedDB=db;w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};w.eval(outputFiles[0].text);w.document.querySelector('style').textContent=readFileSync('src/style.css','utf8');await waitForExactRead(()=>w.document.querySelector('#open').disabled,false,{timeoutMs:3000,intervalMs:10});return w;}
 try{
  globalThis.indexedDB=db;const w=await boot(),d=w.document,$=id=>d.getElementById(id);
  for(const selector of emptyStateSelectors)assert.equal(d.querySelectorAll(selector).length,1,selector);
  assert.equal($('drawer').disabled,true);assert.equal($('node-list-toggle').disabled,false);assert.equal(d.querySelector('.toolbar').hidden,true);
  $('open-sample').click();assert.equal(d.querySelectorAll('.node').length,25);assert.equal(d.querySelectorAll('.edge').length,63);assert.equal($('drawer').disabled,false);
  if(!$('formattedMarkdownDrawer').hidden)$('drawer').click();if(!$('node-list-drawer').hidden)$('node-list-toggle').click();assert.equal($('formattedMarkdownDrawer').hidden,true);assert.equal($('node-list-drawer').hidden,true);
  await waitForExactRead(readSessionInPage,{drawer:false,nodeDrawer:false},{timeoutMs:3000,intervalMs:10,project:s=>({drawer:s?.drawer,nodeDrawer:!!s?.nodeDrawer})});w.close();
  for(const {zoom} of emptyStateMatrix){const layout=emptyStateFixture(zoom);assert.equal(await seedEmptyStateSession({layout}),true);const saved=await readSessionInPage();assert.deepEqual(emptyLayoutProjection(saved.tabs[0]),layout);assert.equal(saved.drawer,true);assert.equal(saved.nodeDrawer,true);}
  const expected=emptyStateFixture(2.5);await seedEmptyStateSession({layout:expected});const restored=await boot(),r=restored.document;
  assert.deepEqual(Object.fromEntries([...r.querySelectorAll('.node')].map(n=>[n.dataset.node,[parseFloat(n.style.left),parseFloat(n.style.top)]])),expected.positions);assert.equal(r.querySelector('#zoom').textContent,'250%');assert.deepEqual([r.querySelector('#viewport').scrollLeft,r.querySelector('#viewport').scrollTop],expected.scroll);
  assert.equal(r.querySelector('#formattedMarkdownDrawer').hidden,false);assert.equal(r.querySelector('#node-list-drawer').hidden,true);
  assert.equal(r.querySelector('.tab.active .close').hidden,false);await r.querySelector('.tab.active .close').onclick();assert.equal(r.querySelector('#empty-workspace').hidden,false);
  if(r.querySelector('#design-explorer').hidden)r.querySelector('#node-list-toggle').click();r.querySelector('[data-explorer-key="business:overview"]').click();
  assert.equal(r.querySelector('#empty').hidden,true);assert.equal(r.querySelector('#canvas').hidden,false);assert.equal(r.querySelector('.toolbar').hidden,false);assert.deepEqual(emptyLayoutProjection((await readSessionInPage()).tabs[0]),expected);
  r.querySelector('#open-sample').click();assert.equal(r.querySelectorAll('.node').length,25);assert.equal(r.querySelector('#drawer').disabled,false);
  // Actual parser + source-dialog ordering used by the multi-tab browser case.
  r.querySelector('#open-text').click();r.querySelector('#source-text').value=raw;await r.querySelector('#source-submit').onclick();assert.equal(r.querySelectorAll('.tab').length,1);assert.equal(r.querySelector('#source-dialog').hidden,true);
  await r.querySelector('.tab.active .close').onclick();assert.equal(r.querySelector('#empty-workspace').hidden,false);
  const result={emptyStateBrowserPreflight:'passed',publicSample:'business-design/alder/README.md',nodes:25,relations:63,matrixCases:9,browserCases:10,selectors:emptyStateSelectors.length,committedSeeds:10,harnessFailureCases:3,overlayOrder:'open sample → nodes present → close overlays',limits:emptyStateLimits,budgetCalibrated:false,browserExecuted:false,limit:'Parser/DOM/fake-IDB and controlled harness failures only. Real rectangles, elementFromPoint, native wheel/pan/pinch and Chromium restoration have not been run. The 8-second case budget is uncalibrated for this new suite.'};console.log(JSON.stringify(result));return result;
 }finally{windows.forEach(w=>w.close());delete globalThis.indexedDB;}
}
if(process.argv.includes('--preflight'))await preflightEmptyStateBrowser();
