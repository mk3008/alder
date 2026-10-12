import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseDesign} from '../src/graph.ts';
import {routeEdge} from '../src/routing.ts';
import {hiddenReadIndexes} from '../src/edge-visibility.ts';
import {readSessionInPage,waitSavedViewer} from './wait-saved-viewer.mjs';
export async function recordScopeGeometry(page,label,design){
 const saved=await page.evaluate(readSessionInPage),tab=saved?.tabs?.find(t=>t.key===saved.active);
 const dom=await page.evaluate(()=>{const v=document.querySelector('#viewport'),c=document.querySelector('#canvas'),n=document.querySelector('#nodes'),r=v.getBoundingClientRect(),zoom=Number(n.style.transform.match(/scale\(([^)]+)\)/)?.[1]??1),inset=[parseFloat(n.style.left||'0')/zoom,parseFloat(n.style.top||'0')/zoom];const nodes=[...document.querySelectorAll('.node')].map(n=>{const b=n.getBoundingClientRect();return {id:n.dataset.node,position:[parseFloat(n.style.left),parseFloat(n.style.top)],screen:[b.x,b.y,b.width,b.height],relative:[b.x-r.x-v.clientLeft,b.y-r.y-v.clientTop]};});return {client:[v.clientWidth,v.clientHeight],scroll:[v.scrollLeft,v.scrollTop],scrollExtent:[v.scrollWidth,v.scrollHeight],canvas:[parseFloat(c.style.width),parseFloat(c.style.height)],viewport:[r.x,r.y,r.width,r.height],zoom,inset,worldVisible:[v.scrollLeft/zoom-inset[0],v.scrollTop/zoom-inset[1],(v.scrollLeft+v.clientWidth)/zoom-inset[0],(v.scrollTop+v.clientHeight)/zoom-inset[1]],drawerOpen:!document.querySelector('#node-list-drawer').hidden,scope:document.querySelector('#scope-outside').getAttribute('aria-pressed'),preferWrite:document.querySelector('#prefer-write').checked,nodes};});
 assert.ok(tab&&Object.keys(tab.positions).length===design.graph.nodes.length,'diagnostic has all saved node positions');
 const positions=tab.positions,boxes=design.graph.nodes.map(n=>({id:n.id,x:positions[n.id][0],y:positions[n.id][1],width:260,height:68})),hiddenReads=hiddenReadIndexes(design.graph.relations,dom.preferWrite);let edgeRight=0,edgeBottom=0;const routeBounds=[];
 for(const [index,r] of design.graph.relations.entries()){if(hiddenReads.has(index))continue;const labelWidth=Math.max(30,r.label.length*12),route=routeEdge({from:r.from,to:r.to,index,nodes:boxes,labelWidth,labelHeight:18});edgeRight=Math.max(edgeRight,route.bounds.right+20,route.label[0]+labelWidth/2+12);edgeBottom=Math.max(edgeBottom,route.bounds.bottom+20,route.label[1]+22);routeBounds.push(route.bounds);}
 const content={nodeBounds:[Math.min(...boxes.map(n=>n.x)),Math.min(...boxes.map(n=>n.y)),Math.max(...boxes.map(n=>n.x+260)),Math.max(...boxes.map(n=>n.y+68))],routeMax:routeBounds.length?[Math.max(...routeBounds.map(b=>b.right)),Math.max(...routeBounds.map(b=>b.bottom))]:null,requiredWorld:[Math.max(1400,edgeRight,...boxes.map(n=>n.x+340)),Math.max(850,edgeBottom,...boxes.map(n=>n.y+220))]};
 const retentionWorld=dom.client.map((n,i)=>(n+dom.scroll[i])/dom.zoom-dom.inset[i]*2),predictedCanvas=retentionWorld.map((n,i)=>(Math.max(n,content.requiredWorld[i])+dom.inset[i]*2)*dom.zoom);
 const result={label,active:saved.active,saved:{positions,hiddenNodes:tab.hiddenNodes??[],scroll:tab.scroll,zoom:tab.zoom},dom,content,retentionWorld,predictedCanvas};console.log('SCOPE_GEOMETRY '+JSON.stringify(result));return result;
}
export async function diagnoseScopeGeometry(browser,mode){
 const context=await browser.newContext({viewport:{width:1280,height:960}}),page=await context.newPage(),errors=[],records=[];page.on('pageerror',e=>errors.push(e.message));const design=parseDesign(readFileSync('../business-design/alder/README.md','utf8'));
 try{
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('#open-sample').click();await page.locator('#drawer').click();await page.locator('#prefer-write').check();await page.locator('#out').click();const positions=await page.locator('.node').evaluateAll(ns=>Object.fromEntries(ns.map(n=>[n.dataset.node,[parseFloat(n.style.left),parseFloat(n.style.top)]])));
  await page.locator('#viewport').evaluate(v=>{v.scrollLeft=v.scrollWidth-v.clientWidth;v.scrollTop=v.scrollHeight-v.clientHeight;});const initialScroll=await page.locator('#viewport').evaluate(v=>[v.scrollLeft,v.scrollTop]);await waitSavedViewer(page,{positions,hiddenNodes:[],scroll:initialScroll,zoom:1/1.2,preferWrite:true});
  const record=async label=>{const r=await recordScopeGeometry(page,mode+':'+label,design);records.push(r);return r;};
  if(mode==='fixed-drawer')await page.locator('#node-list-toggle').click();
  const before=await record('before');
  if(mode==='drawer-only'){await page.locator('#node-list-toggle').click();await record('open');await page.locator('#node-list-close').click();await record('closed');}
  else{
   if(mode==='combined'){await page.locator('#node-list-toggle').click();await record('open');}
   await page.locator('#scope-outside').click();await record('hidden-immediate');await waitSavedViewer(page,{positions,hiddenNodes:design.graph.nodes.filter(n=>!n.scope).map(n=>n.id),zoom:1/1.2,preferWrite:true});await record('hidden-committed');
   if(mode==='combined'){await page.locator('#node-list-close').click();await record('hidden-closed');await page.locator('#node-list-toggle').click();}
   await page.locator('#scope-outside').click();await waitSavedViewer(page,{positions,hiddenNodes:[],zoom:1/1.2,preferWrite:true});await record('shown');
   if(mode==='combined'){await page.locator('#node-list-close').click();await record('shown-closed');}
  }
  // Do not relax the existing Scope case's strict canvas equality assertion.
  // These separate diagnostics establish content/position facts and report
  // camera changes even when they do not change saved world coordinates.
  for(const r of records){assert.deepEqual(r.saved.positions,positions);assert.deepEqual(r.content,before.content);for(const n of r.dom.nodes)assert.deepEqual(n.position,positions[n.id]);for(let i=0;i<2;i++)assert.ok(r.dom.canvas[i]+1>=r.content.requiredWorld[i]*r.dom.zoom,'canvas covers all-node content bounds');}
  if(mode==='fixed-drawer')for(const r of records)assert.deepEqual(r.dom.client,before.dom.client);
  assert.deepEqual(errors,[]);return {mode,records,pageErrors:errors,limit:'test-only observations; no product geometry/position/storage writes except normal viewer UI and viewport scroll'};
 }finally{console.log('SCOPE_GEOMETRY_CASE '+JSON.stringify({mode,records,pageErrors:errors}));await context.close();}
}
