import {useUngroupedSample} from './legacy-sample-browser.mjs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {parseDesign} from '../src/graph.ts';
import {runBrowserCases} from './browser-cases.mjs';
import {readSessionInPage,waitForExactRead,waitSavedViewer} from './wait-saved-viewer.mjs';
import {svgViewportTransform,assertSvgMatrix,assertSvgLogicalExtent,preflightSvgViewportOracle,svgMatrixTolerance,svgScreenTolerance} from './test-svg-viewport-oracle.mjs';

// Import and --preflight never launch Chromium or make network requests. The
// browser runner supplies its own browser and serves the built product.
const origin='http://127.0.0.1:4173/';
const raw=readFileSync(new URL('./authorities/ungrouped-alder.md',import.meta.url),'utf8');
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
   get.onsuccess=()=>{const session=get.result;if(session?.format>=2){const {format,document,views,recovery,...rest}=session;Object.keys(session).forEach(k=>delete session[k]);Object.assign(session,rest,{tabs:views.map(view=>({...document,...view}))});}const tab=session?.tabs?.find(t=>t.key===session.active);if(closed&&session.tabs.length){session.sampleLayout={...tab};session.tabs=[];delete session.active;}const target=closed?session?.sampleLayout:tab;
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
  const label=document.querySelector(`.edge-label[data-relations~="${edge.dataset.relation}"]`);
  return [edge.dataset.relation,{path:edge.getAttribute('d'),label:[label.getAttribute('x'),label.getAttribute('y'),label.textContent],collisions:edge.dataset.collisions,rerouted:edge.dataset.rerouted,fallback:edge.dataset.fallback}];
 }))
};}

// Native path/text boxes are reference measurements, not estimated routing
// label widths. Record all rendered glyphs, even those below the visible area;
// this is neither a zero-overlap assertion nor a full clipping/paint proof.
export function readInitialMarginGeometryInPage(){
 const viewport=document.querySelector('#viewport'),v=viewport.getBoundingClientRect(),left=v.left+viewport.clientLeft,top=v.top+viewport.clientTop;
 const rect=r=>[r.left,r.top,r.width,r.height],matrix=m=>m?[m.a,m.b,m.c,m.d,m.e,m.f]:null;
 const svg=document.querySelector('#edges'),box=svg.viewBox.baseVal,style=getComputedStyle(svg),ratio=svg.preserveAspectRatio.baseVal;
 const svgBox=element=>{const b=element.getBBox(),m=element.getScreenCTM(),p=m?new DOMPoint(b.x,b.y).matrixTransform(m):null,q=m?new DOMPoint(b.x+b.width,b.y+b.height).matrixTransform(m):null,r=element.getBoundingClientRect();return {id:element.dataset.relation,world:[b.x,b.y,b.width,b.height],left:r.left-left,transformedLeft:p?p.x-left:null,screen:[r.width,r.height],transformedSize:p&&q?[q.x-p.x,q.y-p.y]:null,matrix:matrix(m)};};
 return {viewportLeft:left,viewportOrigin:[left,top],viewportSize:[viewport.clientWidth,viewport.clientHeight],scroll:[viewport.scrollLeft,viewport.scrollTop],svg:{usedRect:rect(svg.getBoundingClientRect()),viewBoxAttribute:svg.getAttribute('viewBox'),viewBox:[box.x,box.y,box.width,box.height],preserveAspectRatio:{attribute:svg.getAttribute('preserveAspectRatio'),align:ratio.align,meetOrSlice:ratio.meetOrSlice},inlineCss:{left:svg.style.left,top:svg.style.top,width:svg.style.width,height:svg.style.height},computedCss:{width:style.width,height:style.height,transform:style.transform,border:['Left','Top','Right','Bottom'].map(side=>parseFloat(style['border'+side+'Width'])),padding:['Left','Top','Right','Bottom'].map(side=>parseFloat(style['padding'+side]))},matrix:matrix(svg.getScreenCTM())},nodes:[...document.querySelectorAll('.node')].map(node=>{const r=node.getBoundingClientRect();return {id:node.dataset.node,world:[parseFloat(node.style.left),parseFloat(node.style.top)],left:r.left-left,width:r.width};}),edges:[...document.querySelectorAll('.edge')].map(svgBox),labels:[...document.querySelectorAll('.edge-label')].map(svgBox)};
}
export function assertInitialMarginGeometry(measured,{zoom,inset=40,width,report=console.log}){
 const {svg}=measured,logicalMatrix=[zoom,0,0,zoom,measured.viewportOrigin[0]+inset*zoom-measured.scroll[0],measured.viewportOrigin[1]-measured.scroll[1]];
 let expectedMatrix,oracleError;try{expectedMatrix=svgViewportTransform({rect:svg.usedRect,viewBox:svg.viewBox,preserveAspectRatio:svg.preserveAspectRatio.attribute});}catch(error){oracleError=error.message;}
 const boxes=[...measured.nodes.map(node=>[...node.world,260,68]),...measured.edges.map(item=>item.world),...measured.labels.map(item=>item.world)];
 const worldBounds=[Math.min(...boxes.map(b=>b[0])),Math.min(...boxes.map(b=>b[1])),Math.max(...boxes.map(b=>b[0]+b[2])),Math.max(...boxes.map(b=>b[1]+b[3]))];
 const viewBoxBounds=[svg.viewBox[0],svg.viewBox[1],svg.viewBox[0]+svg.viewBox[2],svg.viewBox[1]+svg.viewBox[3]],intendedCssDimensions=svg.viewBox.slice(2).map(n=>n*zoom);
 const matrices=[{kind:'root',id:'edges',matrix:svg.matrix},...['edges','labels'].flatMap(kind=>measured[kind].map(item=>({kind,id:item.id,matrix:item.matrix})))];
 const mismatches=matrices.filter(item=>!expectedMatrix||!item.matrix||item.matrix.length!==6||item.matrix.some((n,i)=>!Number.isFinite(n)||Math.abs(n-expectedMatrix[i])>=svgMatrixTolerance));
 const fullExtentDeviations=matrices.filter(item=>item.matrix?.length===6).map(item=>({...item,maxScreenDelta:Math.max(...[viewBoxBounds,worldBounds].flatMap(b=>[b[0],b[2]].flatMap(x=>[b[1],b[3]].flatMap(y=>[0,1].map(axis=>Math.abs((item.matrix[axis]-logicalMatrix[axis])*x+(item.matrix[axis+2]-logicalMatrix[axis+2])*y+item.matrix[axis+4]-logicalMatrix[axis+4]))))))})).sort((a,b)=>b.maxScreenDelta-a.maxScreenDelta);
 // Emit bounded evidence before any geometry assertion can fail. Include all
 // six coefficients and the independent expected matrix even on a failed run.
 report('INITIAL_LEFT_MARGIN_NATIVE_INPUT '+JSON.stringify({width,viewportSize:measured.viewportSize,viewportOrigin:measured.viewportOrigin,scroll:measured.scroll,logicalZoom:zoom,inset,intendedCssDimensions,svg,expectedMatrix,oracleError,logicalMatrix,viewBoxBounds,worldBounds,matrixTolerance:svgMatrixTolerance,screenTolerancePx:svgScreenTolerance,ctmCount:matrices.length,ctmSamples:[matrices[0],matrices.find(item=>item.kind==='edges'),matrices.find(item=>item.kind==='labels')],mismatchingCtmCount:mismatches.length,mismatchingCtms:mismatches.slice(0,4),largestFullExtentDeviations:fullExtentDeviations.slice(0,2)}));
 assert.equal(oracleError,undefined,'independent SVG viewport oracle inputs');
 assert.deepEqual(measured.scroll,[0,0]);assert.equal(measured.nodes.length,25);assert.equal(measured.edges.length,63);assert.equal(measured.labels.length,62);
 assert.deepEqual(svg.computedCss.border,[0,0,0,0],'SVG measured border box is its viewport');assert.deepEqual(svg.computedCss.padding,[0,0,0,0],'SVG viewport has no CSS padding');assert.equal(svg.computedCss.transform,'none','root SVG has no additional CSS transform');
 assert.deepEqual(svg.preserveAspectRatio,{attribute:null,align:6,meetOrSlice:1},'product retains SVG default xMidYMid meet');
 assertSvgMatrix(svg.matrix,expectedMatrix,'native SVG root matrix');
 for(const bounds of [viewBoxBounds,worldBounds])assertSvgLogicalExtent(svg.matrix,logicalMatrix,bounds,'native SVG root full extent at intended zoom');
 for(const axis of [0,1]){near(parseFloat(svg.inlineCss[axis?'height':'width']),intendedCssDimensions[axis],'intended SVG CSS dimension');near(svg.usedRect[axis+2],intendedCssDimensions[axis],'used SVG CSS dimension');near(svg.usedRect[axis],logicalMatrix[axis+4]+svg.viewBox[axis]*zoom,'SVG viewport position at intended zoom');}
 for(const node of measured.nodes){near(node.left,(node.world[0]+inset)*zoom,'native card left '+node.id);near(node.width,260*zoom,'native card width '+node.id);}
 for(const kind of ['edges','labels'])for(const item of measured[kind]){
  assert.ok(item.world.every(Number.isFinite),'finite native '+kind+' box');
  assertSvgMatrix(item.matrix,expectedMatrix,'native SVG matrix '+kind+' '+item.id);
  for(const bounds of [viewBoxBounds,worldBounds])assertSvgLogicalExtent(item.matrix,logicalMatrix,bounds,'native '+kind+' '+item.id+' full extent at intended zoom');
  near(item.left,(item.world[0]+inset)*zoom,'native '+kind+' left '+item.id);near(item.left,item.transformedLeft,'getBBox transformed to screen agrees with DOM rect');
  for(const axis of [0,1]){near(item.screen[axis],item.world[axis+2]*zoom,'native SVG size');near(item.screen[axis],item.transformedSize[axis],'native SVG transformed size');}
 }
 const minimum=items=>Math.min(...items.map(item=>item.left));
 const result={zoom,inset,nodeLeft:minimum(measured.nodes),edgeLeft:minimum(measured.edges),labelGlyphLeft:minimum(measured.labels),nativeLabelWorldLeft:Math.min(...measured.labels.map(item=>item.world[0])),glyphBoxesLeftOfViewport:measured.labels.filter(item=>item.left<0).map(item=>item.id),metric:'Native getBBox/getBoundingClientRect; no stroke/marker expansion, clipping or overlap claim'};
 near(result.nodeLeft,(40+inset)*zoom,'sample leftmost node');near(result.edgeLeft,(72.5+inset)*zoom,'sample exact SVG path minimum in compact overview');
 if(inset===40)assert.ok(result.edgeLeft>0);
 return result;
}
async function painted(page){await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));}
async function ready(page,count){await page.waitForFunction(count=>!document.querySelector('#open').disabled&&document.querySelectorAll('.tab').length===count,count);}
async function openFreshSample(page){
 await page.goto(origin);await ready(page,0);assert.equal(await page.locator('#drawer').isDisabled(),true,'do not click an empty drawer');
 await page.locator('#open-sample').click();await ready(page,1);await useUngroupedSample(page);assert.equal(await page.locator('.node').count(),25);
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
 assert.equal(await page.locator('.tab.active .close').isVisible(),false);
 await page.evaluate(()=>document.querySelector('.tab.active .close').click());await ready(page,1);
 await waitSavedViewer(page,layout);await page.reload();await ready(page,1);
 await assertCamera(page,layout);assert.deepEqual(await page.evaluate(readInitialMarginWorldInPage),world,'permanent overview reload preserves every coordinate and route');return {hit:true,scroll:layout.scroll};
}
// Coordinates and path geometry are exact semantic data. Native glyph boxes
// are measured layout results; compare only those in the existing CSS-pixel
// tolerance while keeping label x/y/text and every saved coordinate exact.
export function assertInsetWorldGeometry(kind,actual,previous,zoom){
 if(kind!=='labels'){assert.deepEqual(actual,previous,'inset does not change native '+kind+' geometry');return;}
 assert.ok(Number.isFinite(zoom)&&zoom>0,'finite positive comparison zoom');
 for(const box of [actual,previous])assert.ok(Array.isArray(box)&&box.length===4&&box.every(Number.isFinite),'four finite native label bbox values');
 for(let axis=0;axis<4;axis++)near((actual[axis]-previous[axis])*zoom,0,'native label bbox component '+axis+' screen delta');
}
function preflightInsetWorldGeometry(){
 const actual=[1110.5770263671875,495.3662414550781,214.84591674804688,19.44464111328125],previous=[1110.577392578125,495.3662414550781,214.84535217285156,19.444589614868164];
 assertInsetWorldGeometry('labels',actual,previous,.36);
 for(const kind of ['nodes','edges']){assertInsetWorldGeometry(kind,previous,previous,.36);assert.throws(()=>assertInsetWorldGeometry(kind,actual,previous,.36),{name:'AssertionError'});}
 for(const zoom of [.25,.36,1,2.5])for(let axis=0;axis<4;axis++)for(const sign of [-1,1]){
  const a=[0,0,0,0],b=[0,0,0,0];a[axis]=sign*.079/zoom;assertInsetWorldGeometry('labels',a,b,zoom);a[axis]=sign*.081/zoom;assert.throws(()=>assertInsetWorldGeometry('labels',a,b,zoom),{name:'AssertionError'});
 }
 for(const sign of [-1,1])assert.throws(()=>assertInsetWorldGeometry('labels',[sign*.08,0,0,0],[0,0,0,0],1),{name:'AssertionError'});
 for(const bad of [[NaN,0,0,0],[0,0,0]])assert.throws(()=>assertInsetWorldGeometry('labels',bad,[0,0,0,0],1),{name:'AssertionError'});
 return {observedCI41LabelDifferenceAccepted:true,exactNodePathRejects:2,screenPositiveCases:32,screenNegativeCases:32,strictBoundaryRejects:2,invalidBoxesRejected:2,screenTolerancePx:.08,coordinatesAndLabelAttributes:'remain exact in browser case'};
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
  const measurement={width,...assertInitialMarginGeometry(native,{zoom,width})};measurements.push(measurement);console.log('INITIAL_LEFT_MARGIN_GEOMETRY '+JSON.stringify(measurement));
 }
 const empty=await closeAndReopen(page,layout,fresh.world);let noInsetReference;
 if(zoom===.36){
  await page.setViewportSize({width:1280,height:960});const legacy=await seedAndRestore(page,layout,{omitInset:true});await assertCamera(page,legacy);
  assert.deepEqual(await page.evaluate(readInitialMarginWorldInPage),fresh.world,'removing only camera inset changes no node, SVG path, label or routing status');
  const native=await page.evaluate(readInitialMarginGeometryInPage);noInsetReference=assertInitialMarginGeometry(native,{zoom,inset:0,width:1280});
  for(const kind of ['nodes','edges','labels'])for(const item of paddedReference[kind]){const previous=native[kind].find(old=>old.id===item.id);assert.ok(previous);assertInsetWorldGeometry(kind,item.world,previous.world,zoom);near(item.left-previous.left,40*zoom,'36% exact per-element camera translation '+kind+' '+item.id);}
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
 await closeAndReopen(page,layout,world);
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

function preflightInitialMarginGeometryAssertions(){
 // Synthetic caller-contract controls only; these never stand in for native
 // measurements from the real browser cases or the JSDOM/IDB product checks.
 const zoom=.36,viewBox=[0,0,1916,2564],logs=[];
 function fixture(rect){
  const matrix=svgViewportTransform({rect,viewBox}),shape=(id,world)=>({id,world,left:matrix[0]*world[0]+matrix[4],transformedLeft:matrix[0]*world[0]+matrix[4],screen:[world[2]*matrix[0],world[3]*matrix[3]],transformedSize:[world[2]*matrix[0],world[3]*matrix[3]],matrix:[...matrix]});
  return {viewportLeft:0,viewportOrigin:[0,108],viewportSize:[1280,852],scroll:[0,0],svg:{usedRect:rect,viewBoxAttribute:'0 0 1916 2564',viewBox,preserveAspectRatio:{attribute:null,align:6,meetOrSlice:1},inlineCss:{left:'14.4px',top:'0px',width:'689.76px',height:'923.04px'},computedCss:{width:rect[2]+'px',height:rect[3]+'px',transform:'none',border:[0,0,0,0],padding:[0,0,0,0]},matrix},nodes:Array.from({length:25},(_,i)=>({id:'node-'+i,world:[40,40+i*96],left:80*zoom,width:260*zoom})),edges:Array.from({length:63},(_,i)=>shape('edge-'+i,[72.5,40+i*10,100,40])),labels:Array.from({length:62},(_,i)=>shape('label-'+i,[1,40+i*10,20,10]))};
 }
 const options={zoom,width:1280,report:line=>logs.push(JSON.parse(line.slice(line.indexOf(' ')+1)))};
 for(const rect of [[14.4,108,689.76,923.04],[14.390625,108,689.75,923.03125]]){
  assertInitialMarginGeometry(fixture(rect),options);const log=logs.at(-1);assert.equal(log.ctmCount,126);assert.equal(log.expectedMatrix.length,6);assert.equal(log.svg.matrix.length,6);assert.equal(log.mismatchingCtmCount,0);
 }
 const corrupted=fixture([14.4,108,689.76,923.04]);corrupted.labels.at(-1).matrix[4]+=2e-6;
 const before=logs.length;assert.throws(()=>assertInitialMarginGeometry(corrupted,options),/native SVG matrix labels label-61.e/);assert.equal(logs.length,before+1,'diagnostic is emitted before failure');assert.equal(logs.at(-1).mismatchingCtms[0].id,'label-61');
 assert.throws(()=>assertInitialMarginGeometry(fixture([14.5,108,689.76,923.04]),options),/root full extent at intended zoom/);
 const far=fixture([14.4,108,689.76,923.04]);far.labels.at(-1).world[2]=1e6;far.labels.at(-1).matrix[0]+=5e-7;
 assert.throws(()=>assertInitialMarginGeometry(far,options),/label-61 full extent at intended zoom/);assert.equal(logs.at(-1).largestFullExtentDeviations[0].id,'label-61');
 for(const log of logs){assert.ok(log.mismatchingCtms.length<=4);assert.ok(log.largestFullExtentDeviations.length<=2);assert.ok(JSON.stringify(log).length<6000,'bounded synthetic diagnostic size');}
 return {syntheticPositiveCases:2,syntheticRejections:3,diagnosticBeforeFailure:true,nativeBrowserExecuted:false};
}

export async function preflightInitialLeftMargin(){
 const insetWorldGeometry=preflightInsetWorldGeometry(),svgViewportOracle=preflightSvgViewportOracle(),geometryAssertionControls=preflightInitialMarginGeometryAssertions();
 const {JSDOM}=await import('jsdom'),{IDBFactory}=await import('fake-indexeddb'),{build}=await import('./legacy-viewer-fixture.mjs');
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
  $('open-text').click();assert.equal($('source-dialog').hidden,false);$('source-text').value=raw;await $('source-submit').onclick();assert.equal($('source-dialog').hidden,true);assert.equal(d.querySelectorAll('.tab').length,1);
  await waitForExactRead(()=>page.evaluate(readSessionInPage),{tabs:1,source:'text'},{project:s=>({tabs:s?.tabs?.length,source:activeOf(s)?.source?.kind})});
  const text=await waitSavedViewer(page,{viewInset:[40,0],zoom:1,scroll:[0,0]});assert.equal(activeOf(text).source.kind,'text');assert.deepEqual(await page.evaluate(readInitialMarginWorldInPage),world);
  await $('open-sample').onclick({preventDefault(){}});await assertModel(w,fresh,world);w.close();
  const storage=makeWindow(false),storagePage=adapter(storage);
  for(const zoom of initialLeftMarginZooms){
   const layout={...fresh,zoom};assert.equal(await storagePage.evaluate(seedInitialLeftMarginSession,{layout}),true);await waitSavedViewer(storagePage,layout);
   const restored=await boot();await assertModel(restored,layout,world);await restored.document.querySelector('.tab.active .close').onclick();
   assert.equal(restored.document.querySelector('#empty').hidden,true);assert.equal(restored.document.querySelector('#canvas').hidden,false);assert.equal(restored.document.querySelector('.toolbar').hidden,false);
   assert.deepEqual(layoutOf((await storagePage.evaluate(readSessionInPage)).tabs[0]),layout);restored.close();
   const closed=await boot();assert.equal(closed.document.querySelectorAll('.tab').length,1);assert.equal(closed.document.querySelector('#drawer').disabled,false);closed.document.querySelector('#open-sample').click();await assertModel(closed,layout,world);closed.close();
  }
  const zero={...fresh,zoom:.36,viewInset:undefined};await storagePage.evaluate(seedInitialLeftMarginSession,{layout:zero,omitInset:true});assert.equal(Object.hasOwn(activeOf(await storagePage.evaluate(readSessionInPage)),'viewInset'),false);
  const noInset=await boot();await assertModel(noInset,zero,world);noInset.close();
  const manual=manualLegacyLayout(fresh);await storagePage.evaluate(seedInitialLeftMarginSession,{layout:manual,omitInset:true});await waitSavedViewer(storagePage,manual);
  const legacy=await boot(),legacyWorld=await adapter(legacy).evaluate(readInitialMarginWorldInPage);assert.deepEqual(legacyWorld.positions,manual.positions);await assertModel(legacy,manual,legacyWorld);legacy.close();
  const cold=await boot();await assertModel(cold,manual,legacyWorld);await cold.document.querySelector('.tab.active .close').onclick();cold.close();
  await storagePage.evaluate(seedInitialLeftMarginSession,{layout:manual,closed:true,omitInset:true});const historical=await storagePage.evaluate(readSessionInPage);assert.equal(historical.tabs.length,0);assert.equal(Object.hasOwn(historical.sampleLayout,'viewInset'),false);
  const reopen=await boot();assert.equal(reopen.document.querySelectorAll('.tab').length,0);reopen.document.querySelector('#open-sample').click();await assertModel(reopen,manual,legacyWorld);
  assert.equal(createHash('sha256').update(readFileSync(new URL('../src/main.ts',import.meta.url))).digest('hex'),mainSha256,'product source stays pinned during preflight');
  const result={initialLeftMarginPreflight:'passed',mainSha256,svgViewportOracle,insetWorldGeometry,geometryAssertionControls,nodes:25,relations:63,browserCases:4,zoomCases:initialLeftMarginZooms,widths:initialLeftMarginWidths,selectors:selectors.length,newInset:[40,0],legacyInset:'absent remains zero',manualCamera:{zoom:manual.zoom,scroll:manual.scroll},limits:initialLeftMarginLimits,browserExecuted:false,limit:'Real parser, DOM control order, committed fake-IDB, pure SVG viewport oracle controls and independent case/error aggregation only. CI 40 native SVG scale failure remains unresolved until new native measurements. Native SVG/glyph bounds, hit testing, scroll clamping and Chromium restore cases are prepared, not executed; case budgets are uncalibrated.'};console.log(JSON.stringify(result));return result;
 }finally{windows.forEach(w=>w.close());}
}
if(process.argv.includes('--preflight')&&process.argv[1]===fileURLToPath(import.meta.url))await preflightInitialLeftMargin();
