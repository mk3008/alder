import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseDesign} from '../src/graph.ts';
export async function verifyNodeDrawer(browser){
 const context=await browser.newContext({viewport:{width:1440,height:960}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const design=parseDesign(readFileSync('../business-design/alder/README.md','utf8'));
 const activity=design.activityOrder[0],outside=design.graph.nodes.find(n=>n.type==='business'&&!n.scope).id;
 const exactRow=id=>page.locator(`[data-list-node=${JSON.stringify(id)}]`);
 const node=id=>page.locator(`.node[data-node=${JSON.stringify(id)}]`);
 const positions=()=>page.locator('.node').evaluateAll(ns=>Object.fromEntries(ns.map(n=>[n.dataset.node,[n.style.left,n.style.top]])));
 const centered=async id=>{const n=await node(id).boundingBox(),v=await page.locator('#viewport').evaluate(e=>{const r=e.getBoundingClientRect(),d=document.querySelector('#formattedMarkdownDrawer'),b=d.getBoundingClientRect();return {x:r.x+e.clientLeft,y:r.y+e.clientTop,width:!d.hidden&&b.left>r.left&&b.left<r.right?b.left-r.left-e.clientLeft:e.clientWidth,height:e.clientHeight};});assert.ok(Math.abs(n.x+n.width/2-(v.x+v.width/2))<3,'node is horizontally centered in visible graph');assert.ok(Math.abs(n.y+n.height/2-(v.y+v.height/2))<3,'node is vertically centered in visible graph');};
 const extent=async p=>{const e=await p.locator('#viewport').evaluate(v=>{const c=document.querySelector('#canvas');return {scroll:[v.scrollWidth,v.scrollHeight],client:[v.clientWidth,v.clientHeight],canvas:[parseFloat(c.style.width),parseFloat(c.style.height)]};});assert.ok(e.scroll.every((n,i)=>n<=Math.max(e.canvas[i],e.client[i])+2),'rendered scroll bounds match canvas at every zoom');};
 const openList=async()=>{if(!await page.locator('#node-list-drawer').isVisible())await page.locator('#node-list-toggle').click();};
 try{
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('#open-sample').click();
  const initial=await positions(),zoom=await page.locator('#zoom').textContent();assert.equal(Object.keys(initial).length,25);
  await openList();await page.locator('[data-category="activity"]').click();assert.equal(await page.locator('[data-list-node]').count(),10);
  await page.locator('#node-list-search').fill(activity);assert.ok(await page.locator('[data-list-node]').count()>=1);await exactRow(activity).locator('.node-navigate').click();await centered(activity);assert.deepEqual(await positions(),initial);assert.equal(await page.locator('#zoom').textContent(),zoom);assert.equal(await page.locator('.node.selected').getAttribute('data-node'),activity);
  await page.locator('#in').click();assert.deepEqual(await positions(),initial);const zoomExtent=await page.locator('#viewport').evaluate(v=>{const c=document.querySelector('#canvas');return {scroll:[v.scrollWidth,v.scrollHeight],client:[v.clientWidth,v.clientHeight],canvas:[parseFloat(c.style.width),parseFloat(c.style.height)]};});assert.ok(zoomExtent.scroll.every((n,i)=>n<=Math.max(zoomExtent.canvas[i],zoomExtent.client[i])+2),'zoomed wrappers do not multiply scroll extent twice');await page.locator('#out').click();assert.deepEqual(await positions(),initial);assert.equal(await page.locator('#zoom').textContent(),zoom);
  // A graph selection reveals the appropriate category, clears a conflicting
  // search if needed, and highlights its matching list row.
  await page.locator('[data-category="object"]').click();await page.locator('#node-list-search').fill('not-a-node');await node(activity).click();assert.equal(await page.locator('[data-category="activity"]').getAttribute('aria-selected'),'true');assert.equal(await page.locator('#node-list-search').inputValue(),'');assert.ok(await exactRow(activity).isVisible());
  await exactRow(activity).locator('[data-node-visibility]').click();assert.equal(await node(activity).count(),0);assert.equal(await exactRow(activity).count(),1);assert.equal(await page.locator('.node.selected').count(),0);
  const hiddenPositions=await positions();if(await exactRow(activity).locator('.node-navigate').isEnabled())await exactRow(activity).locator('.node-navigate').click();assert.equal(await node(activity).count(),0);assert.deepEqual(await positions(),hiddenPositions,'hidden name never reveals or moves nodes');
  await exactRow(activity).locator('[data-node-visibility]').click();assert.deepEqual(await positions(),initial);
  await exactRow(outside).locator('[data-node-visibility]').click();assert.equal(await page.locator('#scope-outside').getAttribute('aria-pressed'),'mixed');await page.locator('#scope-outside').click();assert.equal(await page.locator('.node').count(),25);await page.locator('#scope-outside').click();assert.equal(await page.locator('.node').count(),12);assert.equal(await page.locator('.node.outside').count(),0);
  await exactRow(outside).locator('[data-node-visibility]').click();assert.equal(await page.locator('.node').count(),13);assert.equal(await page.locator('#scope-outside').getAttribute('aria-pressed'),'mixed');await page.locator('#scope-outside').click();assert.deepEqual(await positions(),initial);
  await page.locator('[data-category="role"]').click();const categoryColor=await page.locator('[data-category="role"]').evaluate(n=>getComputedStyle(n).backgroundColor),fileColor=await page.locator('.tab.active').evaluate(n=>getComputedStyle(n).backgroundColor);assert.equal(categoryColor,fileColor,'category active uses file-tab active color');
  assert.ok(await page.locator('[data-role]').count()>0);for(const eye of await page.locator('[data-node-visibility]').all()){const style=await eye.evaluate(n=>({color:getComputedStyle(n).color,svg:getComputedStyle(n.querySelector('svg')).color}));assert.equal(style.color,style.svg,'visible eye inherits text color');}
  // A saved per-node override must not be lost on close/reload/reopen.
  await page.locator('[data-category="activity"]').click();await exactRow(outside).locator('[data-node-visibility]').click();const visible=await positions();await page.locator('#open-text').click();await page.locator('#source-text').fill(design.markdown.replace(/^# .+/,'# Independent visibility tab'));await page.locator('#source-submit').click();assert.equal(await page.locator('.node').count(),25,'new tab does not inherit another tab visibility');await page.locator('.tab>button:first-child').first().click();assert.deepEqual(await positions(),visible,'tab switch restores independent visibility');await page.locator('.tab').last().locator('.close').click();await page.locator('.close').click();await page.locator('.tab').waitFor({state:'detached'});await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('#open-sample').click();assert.deepEqual(await positions(),visible);await openList();await page.locator('[data-category="activity"]').click();await exactRow(outside).locator('[data-node-visibility]').click();assert.deepEqual(await positions(),initial);
  // On mobile the list is an overlay, closes before centering, and leaves zoom
  // and all graph positions unchanged. Right Markdown is closed explicitly so
  // the remaining visible graph rectangle is unambiguous.
  await page.setViewportSize({width:393,height:852});if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();await openList();await page.locator('[data-category="activity"]').click();await exactRow(activity).locator('.node-navigate').click();assert.equal(await page.locator('#node-list-drawer').isVisible(),false);await centered(activity);assert.deepEqual(await positions(),initial);assert.equal(await page.locator('#zoom').textContent(),zoom);
  await openList();await page.locator('#node-list-search').fill('業務');await page.locator('#node-list-search').press('Escape');assert.equal(await page.locator('#node-list-drawer').isVisible(),false);
  for(const inset of [false,true]){
   const zc=await browser.newContext({viewport:{width:1280,height:960}}),zp=await zc.newPage();zp.on('pageerror',e=>errors.push(e.message));try{
    await zp.goto('http://127.0.0.1:4173/');await zp.waitForFunction(()=>!document.querySelector('#open').disabled);await zp.locator('#open-sample').click();await zp.locator('#drawer').click();
    if(inset){await zp.locator('#node-list-toggle').click();await zp.locator(`[data-list-node=${JSON.stringify(activity)}] .node-navigate`).click();}
    for(let i=0;i<8;i++)await zp.locator('#out').click();assert.equal(await zp.locator('#zoom').textContent(),'25%');await extent(zp);
    for(let i=0;i<4;i++)await zp.locator('#in').click();await extent(zp);
   }finally{await zc.close();}
  }
  assert.deepEqual(errors,[]);return {checks:'Activity/Object/Role and search; currentColor/file-tab colors; per-node/bulk/mixed visibility; hidden name inert; graph/list sync; exact center without layout/zoom changes; persistence; mobile overlay and Escape',pageErrors:errors};
 }finally{await context.close();}
}
