import {useUngroupedSample} from './legacy-sample-browser.mjs';
import {openDisplaySettings} from './toolbar-settings-control.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {parseDesign} from '../src/graph.ts';
import {runBrowserCases} from './browser-cases.mjs';
import {readSessionInPage,waitForExactRead,waitSavedViewer} from './wait-saved-viewer.mjs';

// Test-only public sample regression. Import and --preflight never launch a
// browser. The main browser runner owns Chromium and the built-app server.
const origin='http://127.0.0.1:4173/';
const raw=readFileSync(new URL('./authorities/ungrouped-alder.md',import.meta.url),'utf8');
const design=parseDesign(raw),relationIndex=41;
export const returnRouteLimits={caseMs:30000,cleanupMs:3000};
export const returnRouteWidths=[1280,393,320];
// Explicit saved geometry freezes the reported case independently of subsequent
// initial-layout changes. These are test data, never product name heuristics.
export const returnRoutePositions={
 'Alder: 業務相関ナレッジ':[40,40],'Alder: 検査項目設計ナレッジ':[40,136],'Alder: 業務ナレッジ':[40,232],
 '業務設計':[168,328],'判断記録':[296,424],'業務設計書':[296,520],'依頼者':[296,616],
 'システム設計':[424,712],'検査項目の設計':[424,808],'業務改善レビュー':[424,904],
 'システム要件書':[552,1000],'検査項目':[552,1096],'画面設計':[680,1192],'画面設計資料':[808,1288],
 '実装':[936,1384],'コード':[1064,1480],'テスト':[1064,1576],'Alder実装レビュー':[1192,1672],
 '製品検証':[1192,1768],'同期漏れ検査':[1192,1864],'検証結果':[1320,1960],'同期漏れの候補':[1320,2056],
 '同期照合情報':[1320,2152],'検証結果の統合':[1448,2248],'統合検証結果':[1576,2344]
};
const selectors=['#open','#open-sample','#open-text','#source-text','#source-submit','#source-dialog','#drawer','#formattedMarkdownDrawer','#node-list-toggle','#node-list-drawer','#show-outside','#prefer-write','#show-exceptions','#selected-edges-only','#viewport','#nodes','#edges','#zoom'];
const hiddenNodes=design.graph.nodes.filter(n=>!n.scope).map(n=>n.id).sort();
const fields=(zoom,hidden=[])=>({positions:returnRoutePositions,zoom,scroll:[0,0],hiddenNodes:hidden,selected:null,showExceptions:false,selectedEdgesOnly:false,preferWrite:false,viewInset:undefined,canvasOrigin:undefined});
function expectedIndexes({outside=true,write=false,exceptions=false}={}){
 const visible=new Set(design.graph.nodes.filter(n=>outside||n.scope).map(n=>n.id));
 return design.graph.relations.flatMap((r,i)=>{
  const paired=write&&r.kind==='input'&&design.graph.relations.some(w=>w.kind==='output'&&w.from===r.to&&w.to===r.from);
  return visible.has(r.from)&&visible.has(r.to)&&!paired&&(exceptions||!r.kind.endsWith('exception'))?[String(i)]:[];
 }).sort();
}

// Serialized into a same-origin non-product page AFTER disposing the app.
// Completion means a committed transaction, followed by a separate real read.
export function seedReturnRouteSession({positions,zoom}){return new Promise((resolve,reject)=>{
 const request=indexedDB.open('alder-web-viewer',1);request.onerror=()=>reject(request.error);
 request.onsuccess=()=>{const db=request.result;let failure;
  try{const tx=db.transaction('session','readwrite'),store=tx.objectStore('session'),get=store.get('current');
   get.onsuccess=()=>{const session=get.result;if(session?.format>=2){const {format,document,views,recovery,...rest}=session;Object.keys(session).forEach(k=>delete session[k]);Object.assign(session,rest,{tabs:views.map(view=>({...document,...view}))});}const tab=session?.tabs?.find(t=>t.key===session.active);
    if(!tab||tab.source?.kind!=='sample'){failure=Error('Return-route fixture needs the saved public sample');tx.abort();return;}
    Object.assign(tab,{positions,zoom,scroll:[0,0],hiddenNodes:[],showExceptions:false,selectedEdgesOnly:false});
    delete tab.selected;delete tab.viewInset;delete tab.canvasOrigin;
    session.drawer=false;session.nodeDrawer=false;session.preferWrite=false;store.put(session,'current');
   };
   tx.oncomplete=()=>{db.close();resolve(true);};tx.onerror=tx.onabort=()=>{db.close();reject(failure??tx.error??Error('Return-route fixture commit failed'));};
  }catch(error){db.close();reject(error);}
 };
});}
export function readReturnRoutesInPage(){
 return Object.fromEntries([...document.querySelectorAll('.edge')].map(edge=>{
  const label=document.querySelector(`.edge-label[data-relations~="${edge.dataset.relation}"]`);
  return [edge.dataset.relation,{path:edge.getAttribute('d'),label:label?[label.getAttribute('x'),label.getAttribute('y')]:null,collisions:edge.dataset.collisions}];
 }));
}
function readPositionsInPage(){return Object.fromEntries([...document.querySelectorAll('.node')].map(n=>[n.dataset.node,[parseFloat(n.style.left),parseFloat(n.style.top)]]));}

// Independent analytic SVG oracle: parse the rendered M/L/Q, solve quadratic
// intersections with rectangle boundaries, then classify each open interval.
// No routeEdge, routing collision helper, cached points, or sample-only probes.
function pathSegments(path){
 const tokens=path.match(/[MLQ]|[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/gi)??[];
 assert.equal(path.replace(/[MLQ]|[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?|[\s,]/gi,''),'','only finite M/L/Q geometry');
 let i=0,p,first;const segments=[];
 const point=()=>{const q=[Number(tokens[i++]),Number(tokens[i++])];assert.ok(q.every(Number.isFinite));return q;};
 while(i<tokens.length){const kind=tokens[i++];if(kind==='M'){assert.equal(first,undefined);p=point();first=p;}else{assert.ok(p);assert.ok(kind==='L'||kind==='Q');const control=kind==='Q'?point():null,end=point();segments.push({kind,start:p,control,end});p=end;}}
 assert.ok(first&&segments.length);return {first,last:p,segments};
}
const at=(s,t)=>s.start.map((a,k)=>s.kind==='L'?a+(s.end[k]-a)*t:(1-t)**2*a+2*(1-t)*t*s.control[k]+t*t*s.end[k]);
function roots(s,axis,value){
 const c=s.start[axis]-value,b=s.kind==='L'?s.end[axis]-s.start[axis]:2*(s.control[axis]-s.start[axis]),a=s.kind==='L'?0:s.start[axis]-2*s.control[axis]+s.end[axis];
 if(Math.abs(a)<1e-12)return Math.abs(b)<1e-12?[]:[-c/b];
 const d=b*b-4*a*c;return d<0?[]:[(-b-Math.sqrt(d))/(2*a),(-b+Math.sqrt(d))/(2*a)];
}
function enters(s,r){
 const cuts=[0,1,...[0,1].flatMap(axis=>[r[axis],r[axis+2]].flatMap(value=>roots(s,axis,value)))].filter(t=>t>=0&&t<=1).sort((a,b)=>a-b);
 return cuts.slice(1).some((t,i)=>{const p=at(s,(t+cuts[i])/2);return p[0]>r[0]+1e-7&&p[0]<r[2]-1e-7&&p[1]>r[1]+1e-7&&p[1]<r[3]-1e-7;});
}
export function assertLocalReturnPath(path){
 const {first,last,segments}=pathSegments(path),r=design.graph.relations[relationIndex],source=returnRoutePositions[r.from],target=returnRoutePositions[r.to];
 assert.deepEqual(first,[source[0]+260,source[1]+34],'right source perimeter');
 assert.deepEqual(last,[target[0]+260,target[1]+68/3],'data return uses the upper of two Activity arrival roles');
 const initial=segments[0],final=segments.at(-1);
 assert.equal(initial.kind,'L');assert.equal(initial.end[1],first[1]);assert.ok(initial.end[0]>first[0],'outward horizontal departure');
 assert.equal(final.kind,'L');assert.equal(final.start[1],last[1]);assert.ok(final.start[0]>last[0],'inward horizontal arrival from the right');
 const extrema=segments.flatMap(s=>{const ts=[0,1];if(s.kind==='Q')for(const axis of [0,1]){const denominator=s.start[axis]-2*s.control[axis]+s.end[axis];if(denominator){const t=(s.start[axis]-s.control[axis])/denominator;if(t>0&&t<1)ts.push(t);}}return ts.map(t=>at(s,t));});
 const bounds=[Math.min(...extrema.map(p=>p[0])),Math.min(...extrema.map(p=>p[1])),Math.max(...extrema.map(p=>p[0])),Math.max(...extrema.map(p=>p[1]))];
 // Both arrival roles face lower peers. The upper data port uses the outer
 // of the two 16-unit return corridors to avoid crossing the lower arrival.
 const right=Math.max(source[0]+260,target[0]+260)+24+8+16;
 assert.deepEqual(bounds,[target[0]+260,target[1]+68/3,right,source[1]+34],'local return stays within its endpoint corridor, including exact curve extrema');
 assert.equal(segments.filter(s=>s.kind==='Q').length,2,'rounded two-corner return');
 for(const s of segments)if(s.kind==='L')assert.ok(s.start[0]===s.end[0]||s.start[1]===s.end[1],'straight legs are orthogonal');
 for(const [id,[x,y]] of Object.entries(returnRoutePositions)){
  const padding=id===r.from||id===r.to?0:14,rectangle=[x-padding,y-padding,x+260+padding,y+68+padding];
  assert.ok(!segments.some(s=>enters(s,rectangle)),`rendered curve cannot enter ${id}${padding?' or its clearance':''}`);
 }
 const maxLength=(right-first[0])+(right-last[0])+Math.abs(first[1]-last[1]);
 return {start:first,end:last,bounds,maxLength,minLength:maxLength-8};
}
function assertVisible(routes,baseline,options){
 assert.deepEqual(Object.keys(routes).sort(),expectedIndexes(options),'exact original relation indexes survive visibility controls');
 for(const [index,route] of Object.entries(routes))assert.deepEqual(route,baseline[index],'visibility and viewport retain path/label/collision '+index);
}
async function assertNativeRoute(page,zoom){
 const routes=await page.evaluate(readReturnRoutesInPage),oracle=assertLocalReturnPath(routes[relationIndex].path);
 assert.equal(routes[relationIndex].collisions,'0');
 const measured=await page.locator(`.edge[data-relation="${relationIndex}"]`).evaluate(edge=>{
  const length=edge.getTotalLength(),box=edge.getBBox(),screen=edge.getBoundingClientRect(),matrix=edge.getScreenCTM(),point=t=>{const p=edge.getPointAtLength(t);return [p.x,p.y];};
  return {length,start:point(0),after:point(1),before:point(length-1),end:point(length),bounds:[box.x,box.y,box.x+box.width,box.y+box.height],scale:[matrix.a,matrix.b,matrix.c,matrix.d],screenSize:[screen.width,screen.height]};
 });
 assert.ok(measured.scale.every((value,i)=>Math.abs(value-[zoom,0,0,zoom][i])<1e-6),'actual SVG transform uses requested zoom');
 for(const axis of [0,1])assert.ok(Math.abs(measured.screenSize[axis]-(oracle.bounds[axis+2]-oracle.bounds[axis])*zoom)<.05,'actual rendered SVG size uses requested zoom');
 // Native SVGPoint/getBBox coordinates are float32; the analytic path oracle
 // stays double precision. Compare the exact native representation, including
 // fractional role ports, rather than accepting a loose geometric tolerance.
 assert.deepEqual(measured.start,oracle.start.map(Math.fround));assert.deepEqual(measured.end,oracle.end.map(Math.fround));assert.deepEqual(measured.bounds,oracle.bounds.map(Math.fround));
 assert.ok(measured.after[0]>measured.start[0]&&measured.after[1]===measured.start[1]);
 assert.ok(measured.before[0]>measured.end[0]&&measured.before[1]===measured.end[1]);
 assert.ok(measured.length>oracle.minLength&&measured.length<oracle.maxLength,'native SVG length remains within independent rounded-corridor bounds');
 return measured;
}
// Observational native-glyph metric, separate from routing's estimated label
// width. Count actual SVG glyph boxes against each other and rendered cards;
// no zero-overlap assertion, stroke expansion, screenshots, or clipping claim.
function readGlyphOverlapsInPage(){
 const overlap=(a,b)=>a[0]<b[2]&&a[2]>b[0]&&a[1]<b[3]&&a[3]>b[1];
 const labels=[...document.querySelectorAll('.edge-label')].map(label=>{const b=label.getBBox(),m=label.getScreenCTM(),a=new DOMPoint(b.x,b.y).matrixTransform(m),z=new DOMPoint(b.x+b.width,b.y+b.height).matrixTransform(m);return {id:label.dataset.relation,box:[a.x,a.y,z.x,z.y]};});
 const nodes=[...document.querySelectorAll('.node')].map(node=>{const b=node.getBoundingClientRect();return {id:node.dataset.node,box:[b.left,b.top,b.right,b.bottom]};});
 const labelPairs=[],cardPairs=[];
 for(let i=0;i<labels.length;i++){for(let j=0;j<i;j++)if(overlap(labels[i].box,labels[j].box))labelPairs.push([labels[j].id,labels[i].id]);for(const node of nodes)if(overlap(labels[i].box,node.box))cardPairs.push([labels[i].id,node.id]);}
 return {scopeOutside:document.querySelector('#show-outside').checked,preferWrite:document.querySelector('#prefer-write').checked,exceptions:document.querySelector('#show-exceptions').checked,edges:document.querySelectorAll('.edge').length,labels:labels.length,visibleCards:nodes.length,glyphLabelPairCount:labelPairs.length,glyphCardPairCount:cardPairs.length,labelPairs,cardPairs,metric:'native SVG getBBox in screen coordinates; no stroke padding; full rendered diagram regardless of clipping'};
}
async function ready(page){await page.waitForFunction(()=>!document.querySelector('#open').disabled&&document.querySelectorAll('.tab').length===1);}
async function verifyZoom(page,zoom){
 await page.goto(origin);await page.waitForFunction(()=>!document.querySelector('#open').disabled);
 assert.equal(await page.locator('#drawer').isDisabled(),true,'empty overlay must not be clicked');
 await page.locator('#open-sample').click();await ready(page);await useUngroupedSample(page);assert.equal(await page.locator('.node').count(),25);
 if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
 if(await page.locator('#node-list-drawer').isVisible())await page.locator('#node-list-toggle').click();
 await waitForExactRead(()=>page.evaluate(readSessionInPage),true,{project:s=>s?.tabs?.length===1&&s.tabs[0].source?.kind==='sample'&&s.drawer===false&&!s.nodeDrawer});
 await page.goto(origin+'LICENSE.txt');
 assert.equal(await page.evaluate(seedReturnRouteSession,{positions:returnRoutePositions,zoom}),true);
 const committed=await waitSavedViewer(page,fields(zoom));assert.deepEqual(committed.tabs[0].design.graph,design.graph);
 await page.goto(origin);await ready(page);assert.deepEqual(await page.evaluate(readPositionsInPage),returnRoutePositions);
 assert.equal(await page.locator('#zoom').textContent(),`${zoom*100}%`);
 const baseline=await page.evaluate(readReturnRoutesInPage);assertVisible(baseline,baseline,{});const measurements=[],labelMetrics=[];
 for(const width of returnRouteWidths){
  await page.setViewportSize({width,height:960});assert.deepEqual(await page.evaluate(readPositionsInPage),returnRoutePositions,'all 25 coordinates stay fixed at '+width);
  assertVisible(await page.evaluate(readReturnRoutesInPage),baseline,{});
  await openDisplaySettings(page);await page.locator('#show-outside').uncheck();assert.equal(await page.locator('.node').count(),12);
  assert.equal(await page.locator('#prefer-write').isChecked(),false);assert.equal(await page.locator('#show-exceptions').isChecked(),false);
  const shown=await page.evaluate(readReturnRoutesInPage);assert.equal(Object.keys(shown).length,16);assertVisible(shown,baseline,{outside:false});
  const visiblePositions=Object.fromEntries(Object.entries(returnRoutePositions).filter(([id])=>!hiddenNodes.includes(id)));
  assert.deepEqual(await page.evaluate(readPositionsInPage),visiblePositions);const normalGlyphs=await page.evaluate(readGlyphOverlapsInPage);assert.equal(normalGlyphs.edges,16);assert.equal(normalGlyphs.labels,16);labelMetrics.push({width,zoom,mode:'Scope OFF / Write OFF / exceptions OFF',...normalGlyphs});console.log('RETURN_ROUTE_LABEL_GEOMETRY '+JSON.stringify(labelMetrics.at(-1)));measurements.push({width,zoom,...await assertNativeRoute(page,zoom)});
  await openDisplaySettings(page);await page.locator('#prefer-write').check();const preferred=await page.evaluate(readReturnRoutesInPage);
  assert.equal(Object.keys(preferred).length,13);assert.equal(preferred[relationIndex],undefined,'Write preference hides this paired read');assertVisible(preferred,baseline,{outside:false,write:true});const preferredGlyphs=await page.evaluate(readGlyphOverlapsInPage);assert.equal(preferredGlyphs.edges,13);assert.equal(preferredGlyphs.labels,13);labelMetrics.push({width,zoom,mode:'Scope OFF / Write ON / exceptions OFF',...preferredGlyphs});console.log('RETURN_ROUTE_LABEL_GEOMETRY '+JSON.stringify(labelMetrics.at(-1)));
  await openDisplaySettings(page);await page.locator('#prefer-write').uncheck();assertVisible(await page.evaluate(readReturnRoutesInPage),baseline,{outside:false});
  await openDisplaySettings(page);await page.locator('#show-outside').check();assert.deepEqual(await page.evaluate(readPositionsInPage),returnRoutePositions);assertVisible(await page.evaluate(readReturnRoutesInPage),baseline,{});
 }
 await openDisplaySettings(page);await page.locator('#show-exceptions').check();const exceptions=await page.evaluate(readReturnRoutesInPage);assert.deepEqual(Object.keys(exceptions).sort(),expectedIndexes({exceptions:true}));
 for(const [index,route] of Object.entries(baseline))assert.deepEqual(exceptions[index],route,'exceptions toggle preserves normal geometry');
 await openDisplaySettings(page);await page.locator('#show-exceptions').uncheck();assertVisible(await page.evaluate(readReturnRoutesInPage),baseline,{});
 await openDisplaySettings(page);await page.locator('#show-outside').uncheck();const before=await page.evaluate(readReturnRoutesInPage);
 const saved=await waitSavedViewer(page,fields(zoom,hiddenNodes));assert.equal(saved.drawer,false);assert.equal(saved.nodeDrawer,false);
 await page.reload();await ready(page);assert.equal(await page.locator('#zoom').textContent(),`${zoom*100}%`);
 assert.deepEqual(await page.evaluate(readReturnRoutesInPage),before,'committed cold reload preserves paths and labels');await assertNativeRoute(page,zoom);
 await waitSavedViewer(page,fields(zoom,hiddenNodes));
 await openDisplaySettings(page);await page.locator('#show-outside').check();assert.deepEqual(await page.evaluate(readPositionsInPage),returnRoutePositions,'hidden coordinates also survive reload');assertVisible(await page.evaluate(readReturnRoutesInPage),baseline,{});
 return {zoom,measurements,labelMetrics,scopeOff:16,writePreferred:13,positions:25,reload:'exact committed positions and routes'};
}
async function isolatedReturn(browser,zoom){
 let context,timer,expired=false,result;const errors=[],failures=[];
 const work=(async()=>{context=await browser.newContext({viewport:{width:1280,height:960}});if(expired){await context.close();return;}
  const page=await context.newPage();page.setDefaultTimeout(4000);page.setDefaultNavigationTimeout(5000);page.on('pageerror',e=>errors.push(e.message));
  const result=await verifyZoom(page,zoom);assert.deepEqual(errors,[]);return result;
 })();
 try{result=await Promise.race([work,new Promise((_,reject)=>{timer=setTimeout(()=>{expired=true;reject(Error('Return-route case deadline exceeded'));},returnRouteLimits.caseMs);})]);}catch(error){failures.push(error);}
 finally{clearTimeout(timer);if(context){let cleanup;try{await Promise.race([context.close(),new Promise((_,reject)=>{cleanup=setTimeout(()=>reject(Error('Return-route cleanup deadline exceeded')),returnRouteLimits.cleanupMs);})]);}catch(error){failures.push(error);}finally{clearTimeout(cleanup);}}}
 if(failures.length>1)throw new AggregateError(failures,'Return-route case and cleanup failed');if(failures.length)throw failures[0];return result;
}
export async function verifyReturnRoutes(browser){
 return await runBrowserCases([.25,1].map(zoom=>({name:`local return ${zoom*100}%`,run:()=>isolatedReturn(browser,zoom)})));
}

export async function preflightReturnRoutes(){
 const {openDisplaySettingsDOM}=await import('./toolbar-settings-control.mjs');
 const {JSDOM}=await import('jsdom'),{IDBFactory}=await import('fake-indexeddb'),{build}=await import('./legacy-viewer-fixture.mjs');
 assert.equal(design.graph.nodes.length,25);assert.equal(design.graph.relations.length,63);
 assert.deepEqual(Object.keys(returnRoutePositions).sort(),design.graph.nodes.map(n=>n.id).sort());
 assert.equal(design.graph.relations[relationIndex].from,'業務設計書');assert.equal(design.graph.relations[relationIndex].to,'業務設計');assert.equal(design.graph.relations[relationIndex].kind,'input');
 assert.equal(expectedIndexes({outside:false}).length,16);assert.equal(expectedIndexes({outside:false,write:true}).length,13);
 const {outputFiles}=await build({entryPoints:[fileURLToPath(new URL('../src/main.ts',import.meta.url))],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}});
 const db=new IDBFactory(),windows=[];
 function makeWindow(product=true){const w=new JSDOM('<div id="app"></div>',{url:origin,runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);w.indexedDB=db;w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;if(product)w.eval(outputFiles[0].text);return w;}
 // Serialize functions into their own window, as Playwright does. No process
 // globals or shared fake-IDB state escape this preflight invocation.
 const adapter=w=>({evaluate:async(fn,arg)=>structuredClone(await w.eval(`(${fn.toString()})`)(structuredClone(arg)))});
 const boot=async()=>{const w=makeWindow();await waitForExactRead(()=>w.document.querySelector('#open').disabled,false,{timeoutMs:3000,intervalMs:10});return w;};
 try{
  const w=await boot(),d=w.document,$=id=>d.getElementById(id);
  for(const selector of selectors)assert.equal(d.querySelectorAll(selector).length,1,selector);
  assert.equal($('drawer').disabled,true);$('open-sample').click();assert.equal(d.querySelectorAll('.node').length,25);assert.equal(d.querySelectorAll('.edge').length,63);
  assert.equal($('drawer').disabled,false);if(!$('formattedMarkdownDrawer').hidden)$('drawer').click();if(!$('node-list-drawer').hidden)$('node-list-toggle').click();
  assert.equal($('formattedMarkdownDrawer').hidden,true);assert.equal($('node-list-drawer').hidden,true);
  // Check actual parser inputs/dialog, then return to the public sample tab.
  $('open-text').click();$('source-text').value=raw;await $('source-submit').onclick();assert.equal($('source-dialog').hidden,true);assert.equal(d.querySelectorAll('.tab').length,1);
  await $('open-sample').onclick({preventDefault(){}});assert.equal(d.querySelectorAll('.tab').length,1);
  await waitForExactRead(()=>adapter(w).evaluate(readSessionInPage),true,{project:s=>s?.tabs?.[0]?.source?.kind==='sample'&&!s.drawer&&!s.nodeDrawer});
  w.close();const storage=makeWindow(false),storePage=adapter(storage);
  for(const zoom of [.25,1]){
   assert.equal(await storePage.evaluate(seedReturnRouteSession,{positions:returnRoutePositions,zoom}),true);
   const committed=await waitSavedViewer(storePage,fields(zoom));assert.deepEqual(committed.tabs[0].design.graph,design.graph);
   const restored=await boot(),page=adapter(restored),doc=restored.document;
   assert.deepEqual(await page.evaluate(readPositionsInPage),returnRoutePositions);assert.equal(doc.querySelector('#zoom').textContent,`${zoom*100}%`);
   assert.equal(doc.querySelector('#formattedMarkdownDrawer').hidden,true);assert.equal(doc.querySelector('#node-list-drawer').hidden,true);
   const baseline=await page.evaluate(readReturnRoutesInPage);assertVisible(baseline,baseline,{});assertLocalReturnPath(baseline[relationIndex].path);
   openDisplaySettingsDOM(doc);doc.querySelector('#show-outside').click();assert.equal(doc.querySelectorAll('.node').length,12);assertVisible(await page.evaluate(readReturnRoutesInPage),baseline,{outside:false});
   openDisplaySettingsDOM(doc);doc.querySelector('#prefer-write').click();const preferred=await page.evaluate(readReturnRoutesInPage);assert.equal(preferred[relationIndex],undefined);assertVisible(preferred,baseline,{outside:false,write:true});
   openDisplaySettingsDOM(doc);doc.querySelector('#prefer-write').click();assertVisible(await page.evaluate(readReturnRoutesInPage),baseline,{outside:false});
   await waitSavedViewer(page,fields(zoom,hiddenNodes));restored.close();
   const cold=await boot(),coldPage=adapter(cold);assertVisible(await coldPage.evaluate(readReturnRoutesInPage),baseline,{outside:false});assertLocalReturnPath((await coldPage.evaluate(readReturnRoutesInPage))[relationIndex].path);
   await waitSavedViewer(coldPage,fields(zoom,hiddenNodes));openDisplaySettingsDOM(cold.document);cold.document.querySelector('#show-outside').click();assert.deepEqual(await coldPage.evaluate(readPositionsInPage),returnRoutePositions);cold.close();
  }
  // Exercise oracle sensitivity without invoking product routing as an oracle.
  const y=328+68/3,good=`M556,554 L596,554 Q604,554 604,546 L604,${y+8} Q604,${y} 596,${y} L428,${y}`;
  assertLocalReturnPath(good);assert.throws(()=>assertLocalReturnPath(good.replaceAll('604','1890').replaceAll('596','1882')),/endpoint corridor/);
  assert.throws(()=>assertLocalReturnPath(good.replace('M556,554','M555,554')),/source perimeter/);
  assert.ok(enters({kind:'L',start:[0,1],end:[10,1]},[4,.9,4.01,1.1]),'analytical collision catches a narrow interval between sample points');
  assert.ok(enters({kind:'Q',start:[0,0],control:[10,0],end:[10,10]},[7.49,2.49,7.51,2.51]),'quadratic collision catches a narrow interior interval');
  const result={returnRoutePreflight:'passed',publicSample:'business-design/alder/README.md',nodes:25,relations:63,relation:relationIndex,localRight:604,scopeOff:16,writePreferred:13,zoomCases:2,widths:returnRouteWidths,selectors:selectors.length,limits:returnRouteLimits,browserExecuted:false,limit:'Real parser, DOM controls, analytic M/L/Q geometry and committed fake-IDB restore only. Native SVG metrics and Chromium viewport/persistence cases are prepared but not executed; case budgets are uncalibrated.'};console.log(JSON.stringify(result));return result;
 }finally{windows.forEach(w=>w.close());}
}
if(process.argv.includes('--preflight'))await preflightReturnRoutes();
