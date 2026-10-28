import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {loadPurchaseReview} from './purchase-review-browser.mjs';

export async function verifySubsystemOverview(browser){
 const context=await browser.newContext({viewport:{width:1280,height:960}}),page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
 try{
  await loadPurchaseReview(page);
  assert.equal(await page.locator('.concept-review-landscape h1').count(),0);assert.equal(await page.locator('#concept-tab-landscape .view-tab-name').textContent(),'全体図');assert.equal(await page.locator('[data-explorer-key="group:concept"]').textContent(),'データ構造');assert.equal(await page.locator('.landscape-modes').count(),0);assert.equal(await page.locator('[data-explorer-key="concept:overview"]').textContent(),'概念相関図');
  assert.equal(await page.locator('[data-subsystem]').count(),2);assert.equal(await page.locator('[data-review-group]').count(),4);assert.equal(await page.locator('[data-overview-from]').count(),2);assert.equal(await page.locator('[data-handoff-id]').count(),2);assert.deepEqual(await page.locator('[data-handoff-label]').allTextContents(),['承認済みの版・品目','入荷・未購入の結果']);
  for(const label of await page.locator('[data-handoff-label]').all()){const bounds=await label.boundingBox(),viewport=await page.locator('.subsystem-overview-canvas .diagram-viewport').boundingBox();assert.ok(bounds.x>=viewport.x&&bounds.x+bounds.width<=viewport.x+viewport.width&&bounds.y>=viewport.y&&bounds.y+bounds.height<=viewport.y+viewport.height,'handoff label is visible on initial desktop display');}
  await page.locator('[data-handoff-label="result-progress"]').click();assert.equal(await page.locator('.concept-related').isVisible(),false);await page.locator('#drawer').click();assert.equal(await page.locator('.concept-related .shell-heading strong').textContent(),'入荷・未購入の結果');await page.locator('#drawer').click();
  const shape=page.locator('[data-review-group="group-request"]');await shape.click();assert.equal(await shape.getAttribute('aria-pressed'),'true');assert.equal(await page.locator('.concept-related').isVisible(),false);assert.ok((await page.locator('[data-review-group="group-decision"]').getAttribute('class')).includes('review-neighbor'));
  await page.locator('#drawer').click();assert.equal(await page.locator('.concept-related').isVisible(),true);assert.equal(await page.locator('.concept-related .shell-heading strong').textContent(),'購入要求・申請内容');await page.locator('#drawer').click();
  await shape.locator('.subsystem-overview-open').click();assert.equal(await page.locator('.concept-review-heading h1').textContent(),'購入要求・申請内容');assert.equal(await page.locator('.data-review-overview').isVisible(),true);await page.goBack();await page.locator('.subsystem-overview-graph').waitFor();
  for(const theme of ['light','dark']){
   if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();
   await page.locator('#tabs .tab button:first-child').first().click();
   const business=await page.evaluate(()=>{const tab=document.querySelector('.tab-strip').getBoundingClientRect(),view=document.querySelector('#viewport').getBoundingClientRect(),bar=document.querySelector('#business-workspace .canvas-controls').getBoundingClientRect();return{color:getComputedStyle(document.documentElement).backgroundColor,top:view.top-tab.bottom,right:view.right-bar.right,bottom:view.bottom-bar.bottom};});
   await page.locator('#concept-tab-landscape').click();
   const index=await page.evaluate(()=>{const tab=document.querySelector('.tab-strip').getBoundingClientRect(),v=document.querySelector('.subsystem-overview-canvas .diagram-viewport'),view=v.getBoundingClientRect(),bar=document.querySelector('.subsystem-overview-canvas .canvas-controls').getBoundingClientRect();return{color:getComputedStyle(v).backgroundColor,top:view.top-tab.bottom,right:view.right-bar.right,bottom:view.bottom-bar.bottom};});
   assert.deepEqual(index,business,'the index shares canvas color and placement with the business overview');
   await page.locator('[data-explorer-key="concept:overview"]').click();await page.waitForFunction(()=>document.querySelector('iframe[data-concept-view="overview"]')?.contentDocument?.querySelector('.stage .canvas'));
   const graph=await page.evaluate(()=>{const tab=document.querySelector('.tab-strip').getBoundingClientRect(),frame=document.querySelector('iframe[data-concept-view="overview"]'),outer=frame.getBoundingClientRect(),d=frame.contentDocument,v=d.querySelector('.canvas'),view=v.getBoundingClientRect(),bar=d.querySelector('.canvas-controls').getBoundingClientRect();let color=getComputedStyle(v).backgroundColor;if(color==='rgba(0, 0, 0, 0)')color=getComputedStyle(d.querySelector('.stage')).backgroundColor;return{color,top:outer.top+view.top-tab.bottom,right:view.right-bar.right,bottom:view.bottom-bar.bottom};});
   assert.deepEqual(graph,business,'the concept graph shares canvas color and placement with the business overview');assert.equal(await page.locator('.concept-review-landscape h1').count(),0);
   await page.locator('#concept-tab-landscape').click();
  }
  mkdirSync('web/evidence/shell',{recursive:true});const observations=[];
  for(const theme of ['light','dark']){if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();for(const width of [1280,393]){
   await page.setViewportSize({width,height:960});const measured=await page.locator('.subsystem-overview-graph').evaluate(graph=>{
    const boxes=[...graph.querySelectorAll('[data-review-group]')].map(g=>{const rect=g.querySelector('.state-diagram-node'),region=graph.querySelector(`[data-subsystem="${g.dataset.subsystemId}"] rect`);const num=(e,k)=>Number(e.getAttribute(k));return{id:g.dataset.reviewGroup,x:num(rect,'x'),y:num(rect,'y'),inside:num(rect,'x')>=num(region,'x')&&num(rect,'y')>=num(region,'y')&&num(rect,'x')+num(rect,'width')<=num(region,'x')+num(region,'width')&&num(rect,'y')+num(rect,'height')<=num(region,'y')+num(region,'height')};});return {boxes,edges:graph.querySelectorAll('[data-overview-from]').length,overflow:document.documentElement.scrollWidth>innerWidth};});
   assert.equal(measured.overflow,false,'no document-wide horizontal overflow');assert.ok(measured.boxes.every(box=>box.inside),'every card is within its region');for(let i=1;i<measured.boxes.length;i++){assert.ok(measured.boxes[i].x>measured.boxes[i-1].x);assert.ok(measured.boxes[i].y>measured.boxes[i-1].y);}assert.equal(measured.edges,2);
   for(const control of ['.zoom-in','.zoom-out','.canvas-lock','.reset-layout'])assert.equal(await page.locator('.subsystem-overview-canvas '+control).count(),1);
   await page.screenshot({path:`web/evidence/shell/subsystem-overview-${width}-${theme}.png`});observations.push({width,theme,...measured});
  }}
  assert.deepEqual(errors,[]);return {checks:'browser selection, manual drawer, open detail, Back, region containment, staircase, common controls, 1280/393 light/dark',observations};
 }finally{await context.close();}
}
