import {useUngroupedSample} from './legacy-sample-browser.mjs';
import {setScope} from './scope-control.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseDesign} from '../src/graph.ts';

// The old category/per-node-eye controls were removed by request. Test the
// current explorer and the persisted legacy override through public controls.
export async function verifyNodeDrawer(browser){
 const context=await browser.newContext({viewport:{width:1440,height:960}}),page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
 const design=parseDesign(readFileSync('web/authorities/ungrouped-alder.md','utf8')),activity=design.activityOrder[0],outside=design.graph.nodes.find(node=>!node.scope).id;
 const entry=(kind,id)=>page.locator(`[data-explorer-key=${JSON.stringify(kind+':'+id)}]`),positions=()=>page.locator('.node').evaluateAll(nodes=>Object.fromEntries(nodes.map(node=>[node.dataset.node,[node.style.left,node.style.top]])));
 const showExplorer=async()=>{if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();};
 try{
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('#open-sample').click();await useUngroupedSample(page);
  const initial=await positions(),zoom=await page.locator('#zoom').textContent();assert.equal(Object.keys(initial).length,25);assert.equal(await page.locator('.node-eye,[data-node-visibility]').count(),0);
  await showExplorer();const search=page.locator('.explorer-search input');await search.fill('not-a-node');assert.match(await page.locator('.explorer-groups').innerText(),/該当する項目はありません/);assert.deepEqual(await positions(),initial,'filtering the explorer leaves the graph untouched');
  await search.fill(activity);assert.equal(await entry('business',activity).isVisible(),true);if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();await entry('business',activity).click();
  assert.equal(await page.locator('.node.selected').getAttribute('data-node'),activity);assert.equal(await page.locator('.tab').count(),2);assert.equal(await page.locator('.node.selected .activity-open').count(),0,'current detail has no self link');assert.equal(await page.locator('#formattedMarkdownDrawer').isVisible(),false,'opening detail preserves the closed right drawer');
  await search.fill('');await entry('business','overview').click();assert.deepEqual(await positions(),initial,'overview positions survive detail navigation');assert.equal(await page.locator('#zoom').textContent(),zoom);
  await page.locator('#in').click();const extent=await page.locator('#viewport').evaluate(view=>{const canvas=document.querySelector('#canvas');return {scroll:[view.scrollWidth,view.scrollHeight],client:[view.clientWidth,view.clientHeight],canvas:[parseFloat(canvas.style.width),parseFloat(canvas.style.height)]};});assert.ok(extent.scroll.every((n,i)=>n<=Math.max(extent.canvas[i],extent.client[i])+2),'zoom does not multiply the world extent');await page.locator('#out').click();assert.deepEqual(await positions(),initial);
  await setScope(page,'hide');assert.equal(await page.locator('.node.outside').count(),0);await setScope(page,'show');assert.deepEqual(await positions(),initial,'scope toggle restores positions');
  await page.setViewportSize({width:393,height:852});await showExplorer();await entry('business',activity).click();assert.equal(await page.locator('#design-explorer').isVisible(),false,'mobile page selection releases the overlay');assert.equal(await page.locator('.node.selected').getAttribute('data-node'),activity);assert.equal(await page.locator('#formattedMarkdownDrawer').isVisible(),false);
  await showExplorer();await entry('business','overview').click();await page.waitForFunction(()=>document.querySelector('#app').dataset.saveState==='saved');await page.goto('http://127.0.0.1:4173/LICENSE.txt');
  await page.evaluate(id=>new Promise((resolve,reject)=>{const request=indexedDB.open('alder-web-viewer',1);request.onerror=()=>reject(request.error);request.onsuccess=()=>{const db=request.result,tx=db.transaction('session','readwrite'),store=tx.objectStore('session'),get=store.get('current');get.onsuccess=()=>{const session=get.result;if(session.format!==3){tx.abort();return;}const view=session.views.find(item=>item.key===session.active)??session.views[0];view.hiddenNodes=[id];store.put(session,'current');};tx.oncomplete=()=>{db.close();resolve();};tx.onerror=tx.onabort=()=>{db.close();reject(tx.error??Error('legacy seed failed'));};};}),outside);
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);assert.equal(await page.locator(`.node[data-node=${JSON.stringify(outside)}]`).count(),0);assert.equal(await page.locator('#show-outside').evaluate(input=>input.indeterminate),true);await setScope(page,'show');assert.equal(await page.locator(`.node[data-node=${JSON.stringify(outside)}]`).count(),1);
  assert.deepEqual(errors,[]);return {checks:'global explorer filtering, Activity detail and self-link, drawer state, overview positions, zoom extent, bulk scope, mobile overlay, restored legacy hidden ID',pageErrors:errors};
 }finally{await context.close();}
}

// Browser focus evidence; resized desktop Chrome is not physical mobile input.
export async function verifyDrawerOpeningFocus(browser){
 const context=await browser.newContext(),page=await context.newPage(),results=[],errors=[];page.on('pageerror',error=>errors.push(error.message));
 const view=()=>page.evaluate(()=>({height:innerHeight,visualHeight:visualViewport?.height??null,graphHeight:document.querySelector('#viewport').clientHeight,graphWidth:document.querySelector('#viewport').clientWidth,drawerPosition:getComputedStyle(document.querySelector('#design-explorer')).position,editable:document.activeElement.matches('input,textarea,[contenteditable=true]')}));
 try{
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled,null,{timeout:5000});await page.locator('#open-sample').click();await useUngroupedSample(page);
  for(const width of [1280,393,320])for(const theme of ['light','dark']){
   if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();await page.setViewportSize({width,height:960});
   if(await page.locator('#design-explorer').isVisible())await page.locator('#design-explorer .shell-heading button').click();const before=await view();
   for(let i=0;i<3;i++){
    await page.locator('#node-list-toggle').click();const opened=await view();assert.equal(await page.locator('#design-explorer .shell-heading button').evaluate(el=>document.activeElement===el),true);assert.equal(opened.editable,false);assert.equal(opened.height,before.height);assert.equal(opened.visualHeight,before.visualHeight);assert.equal(opened.graphHeight,before.graphHeight);if(width<=800){assert.equal(opened.graphWidth,before.graphWidth,'mobile explorer overlays without shrinking graph');assert.equal(opened.drawerPosition,'absolute');}
    await page.keyboard.press('Tab');assert.equal(await page.locator('.explorer-search input').evaluate(el=>document.activeElement===el),true);await page.keyboard.type('業務');assert.equal(await page.locator('.explorer-search input').inputValue(),'業務');await page.locator('.explorer-search input').fill('');await page.keyboard.press('Escape');assert.equal(await page.locator('#design-explorer').isVisible(),false);assert.equal(await page.locator('#node-list-toggle').evaluate(el=>document.activeElement===el),true);results.push({width,theme,cycle:i,opened});
   }
  }
  assert.deepEqual(errors,[]);return {results,limit:'Desktop Chrome resized viewports; native mobile keyboard appearance has not been measured.'};
 }finally{await context.close();}
}
