import {useUngroupedSample} from './legacy-sample-browser.mjs';
import {openSourceAction} from './source-menu-browser.mjs';
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
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('#open-sample').click();await useUngroupedSample(page);
  const initial=await positions(),zoom=await page.locator('#zoom').textContent();assert.equal(Object.keys(initial).length,25);
  await openList();
  for(const category of ['activity','object','role']){
   await page.locator(`[data-category="${category}"]`).click();
   const rows=await page.locator('.node-list-row').evaluateAll(ns=>ns.map(n=>getComputedStyle(n).borderBottomWidth));assert.ok(rows.length>0);assert.ok(rows.every(w=>w==='0px'),category+' item dividers removed');
  }
  const retained=await page.evaluate(()=>({scope:getComputedStyle(document.querySelector('.scope-bulk')).borderBottomWidth,search:getComputedStyle(document.querySelector('#node-list-search')).borderBottomWidth,role:getComputedStyle(document.querySelector('.role-group')).borderBottomWidth,active:getComputedStyle(document.querySelector('#node-categories [aria-selected=true]')).borderBottomWidth}));
  assert.deepEqual(retained,{scope:'1px',search:'1px',role:'1px',active:'2px'});
  await page.locator('[data-category="activity"]').click();assert.equal(await page.locator('[data-list-node]').count(),10);
  await page.locator('#drawer').click();assert.equal(await page.locator('#formattedMarkdownDrawer').isVisible(),false);await page.locator('#node-list-search').fill(activity);assert.ok(await page.locator('[data-list-node]').count()>=1);await exactRow(activity).locator('.node-navigate').click();await centered(activity);assert.deepEqual(await positions(),initial);assert.equal(await page.locator('#zoom').textContent(),zoom);assert.equal(await page.locator('.node.selected').getAttribute('data-node'),activity);assert.notEqual(await exactRow(activity).evaluate(n=>getComputedStyle(n).backgroundColor),'rgba(0, 0, 0, 0)','selected row keeps its highlight');assert.equal(await page.locator('#formattedMarkdownDrawer').isVisible(),false,'item preserves closed right drawer');await page.locator('#drawer').click();await exactRow(activity).locator('.node-navigate').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#formattedMarkdownDrawer').isVisible(),true,'item preserves open right drawer');assert.match(await page.locator('#detail').textContent(),new RegExp(activity));
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
  await page.locator('[data-category="activity"]').click();await exactRow(outside).locator('[data-node-visibility]').click();const visible=await positions();await openSourceAction(page,'open-text');await page.locator('#source-text').fill(design.markdown.replace(/^# .+/,'# Independent visibility tab'));await page.locator('#source-submit').click();assert.equal(await page.locator('.node').count(),25,'new tab does not inherit another tab visibility');await page.locator('#document-recovery summary').click();await page.locator('#recovery-documents button').last().click();assert.deepEqual(await positions(),visible,'document recovery restores independent visibility');assert.equal(await page.locator('.tab .close').isVisible(),false);await page.waitForFunction(()=>document.querySelector('#app').dataset.saveState==='saved');await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);assert.deepEqual(await positions(),visible);await openList();await page.locator('[data-category="activity"]').click();await exactRow(outside).locator('[data-node-visibility]').click();assert.deepEqual(await positions(),initial);
  // On mobile the list remains open as an overlay and leaves zoom
  // and all graph positions unchanged. Right Markdown is closed explicitly so
  // the remaining visible graph rectangle is unambiguous.
  await page.setViewportSize({width:393,height:852});if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();await openList();await page.locator('[data-category="activity"]').click();await exactRow(activity).locator('.node-navigate').click();assert.equal(await page.locator('#node-list-drawer').isVisible(),true);assert.equal(await exactRow(activity).locator('.node-navigate').evaluate(e=>e===document.activeElement),true,'selected item retains focus');assert.equal(await page.locator('#formattedMarkdownDrawer').isVisible(),false,'mobile item preserves closed right drawer');await centered(activity);assert.deepEqual(await positions(),initial);assert.equal(await page.locator('#zoom').textContent(),zoom);
  await openList();await page.locator('#node-list-search').fill('業務');await page.locator('#node-list-search').press('Escape');assert.equal(await page.locator('#node-list-drawer').isVisible(),false);
  for(const inset of [false,true]){
   const zc=await browser.newContext({viewport:{width:1280,height:960}}),zp=await zc.newPage();zp.on('pageerror',e=>errors.push(e.message));try{
    await zp.goto('http://127.0.0.1:4173/');await zp.waitForFunction(()=>!document.querySelector('#open').disabled);await zp.locator('#open-sample').click();await useUngroupedSample(zp);await zp.locator('#drawer').click();
    if(inset){await zp.locator('#node-list-toggle').click();await zp.locator(`[data-list-node=${JSON.stringify(activity)}] .node-navigate`).click();}
    for(let i=0;i<8;i++)await zp.locator('#out').click();assert.equal(await zp.locator('#zoom').textContent(),'25%');await extent(zp);
    for(let i=0;i<4;i++)await zp.locator('#in').click();await extent(zp);
   }finally{await zc.close();}
  }
  assert.deepEqual(errors,[]);return {checks:'Activity/Object/Role and search; currentColor/file-tab colors; per-node/bulk/mixed visibility; hidden name inert; graph/list sync; exact center without layout/zoom changes; persistence; mobile overlay and Escape',pageErrors:errors};
 }finally{await context.close();}
}

// Browser focus/viewport evidence, not a claim about an Android native keyboard.
export async function verifyDrawerOpeningFocus(browser){
 const context=await browser.newContext(),page=await context.newPage(),results=[];
 const view=()=>page.evaluate(()=>({height:innerHeight,visualHeight:visualViewport?.height??null,graphHeight:document.querySelector('#viewport').clientHeight,graphWidth:document.querySelector('#viewport').clientWidth,drawerPosition:getComputedStyle(document.querySelector('#node-list-drawer')).position,active:document.activeElement.id,editable:document.activeElement.matches('input,textarea,[contenteditable=true]')}));
 try{
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled,null,{timeout:5000});await page.locator('#open-sample').click();await useUngroupedSample(page);
  for(const width of [1280,393,320])for(const theme of ['light','dark']){
   if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();
   await page.setViewportSize({width,height:960});
   if(await page.locator('#node-list-drawer').isVisible())await page.locator('#node-list-close').click();
   const before=await view();
   for(let i=0;i<3;i++){
    await page.locator('#node-list-toggle').click();const opened=await view();assert.equal(opened.active,'node-list-close');assert.equal(opened.editable,false);assert.equal(opened.height,before.height);assert.equal(opened.visualHeight,before.visualHeight);assert.equal(opened.graphHeight,before.graphHeight);if(width<=800){assert.equal(opened.graphWidth,before.graphWidth,'mobile list overlays without shrinking graph');assert.equal(opened.drawerPosition,'absolute');}assert.ok(await page.locator('.node-list-row').evaluateAll(ns=>ns.length>0&&ns.every(n=>getComputedStyle(n).borderBottomWidth==='0px')),'item divider absent at each viewport');
    const selectedCategory=await page.locator('#node-categories [aria-selected="true"]').getAttribute('id');assert.ok(['node-category-activity','node-category-object','node-category-role'].includes(selectedCategory));for(const id of ['drawer-mode-items',selectedCategory,'node-list-search']){await page.keyboard.press('Tab');assert.equal((await view()).active,id,'keyboard Tab reaches mode, category, then search');}await page.keyboard.type('業務');assert.equal(await page.locator('#node-list-search').inputValue(),'業務');await page.locator('#node-list-search').fill('');
    await page.locator('#node-list-close').click();assert.equal((await view()).active,'node-list-toggle');results.push({width,theme,cycle:i,opened});
   }
   await page.locator('#node-list-toggle').click();await page.locator('#node-list-search').click();assert.equal((await view()).active,'node-list-search','explicit click can focus search');await page.locator('#node-list-close').click();
   // A graph selection followed by reopening must still land on a non-input.
   if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
   await page.locator('.node').first().click();await page.locator('#node-list-toggle').click();assert.equal((await view()).active,'node-list-close');await page.locator('#node-list-close').click();
  }
  return {results,limit:'Desktop Chrome resized viewports; native Android keyboard appearance has not been measured.'};
 }finally{await context.close();}
}
