import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';

export async function verifySubsystemOverview(browser){
 const context=await browser.newContext({viewport:{width:1280,height:960}}),page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
 try{
  await page.goto('http://127.0.0.1:4173/review-concept.html');await page.locator('.subsystem-overview-graph').waitFor();
  assert.equal(await page.locator('.concept-review-landscape h1').textContent(),'全体図');assert.equal(await page.locator('[data-explorer-key="group:concept"]').textContent(),'データ構造');
  assert.equal(await page.locator('[data-subsystem]').count(),2);assert.equal(await page.locator('[data-review-group]').count(),4);assert.equal(await page.locator('[data-overview-from]').count(),3);
  const shape=page.locator('[data-review-group="group-request"]');await shape.click();assert.equal(await shape.getAttribute('aria-pressed'),'true');assert.equal(await page.locator('.concept-related').isVisible(),false);assert.ok((await page.locator('[data-review-group="group-decision"]').getAttribute('class')).includes('review-neighbor'));
  await page.locator('#drawer').click();assert.equal(await page.locator('.concept-related').isVisible(),true);assert.equal(await page.locator('.concept-related .shell-heading strong').textContent(),'購入要求・申請内容');await page.locator('#drawer').click();
  await shape.locator('.subsystem-overview-open').click();assert.equal(await page.locator('.concept-review-heading h1').textContent(),'購入要求・申請内容');assert.equal(await page.locator('.data-review-overview').isVisible(),true);await page.goBack();await page.locator('.subsystem-overview-graph').waitFor();
  mkdirSync('web/evidence/shell',{recursive:true});const observations=[];
  for(const theme of ['light','dark']){if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();for(const width of [1280,393]){
   await page.setViewportSize({width,height:960});const measured=await page.locator('.subsystem-overview-graph').evaluate(graph=>{
    const boxes=[...graph.querySelectorAll('[data-review-group]')].map(g=>{const rect=g.querySelector('.state-diagram-node'),region=graph.querySelector(`[data-subsystem="${g.dataset.subsystemId}"] rect`);const num=(e,k)=>Number(e.getAttribute(k));return{id:g.dataset.reviewGroup,x:num(rect,'x'),y:num(rect,'y'),inside:num(rect,'x')>=num(region,'x')&&num(rect,'y')>=num(region,'y')&&num(rect,'x')+num(rect,'width')<=num(region,'x')+num(region,'width')&&num(rect,'y')+num(rect,'height')<=num(region,'y')+num(region,'height')};});return {boxes,edges:graph.querySelectorAll('[data-overview-from]').length,overflow:document.documentElement.scrollWidth>innerWidth};});
   assert.equal(measured.overflow,false,'no document-wide horizontal overflow');assert.ok(measured.boxes.every(box=>box.inside),'every card is within its region');for(let i=1;i<measured.boxes.length;i++){assert.ok(measured.boxes[i].x>measured.boxes[i-1].x);assert.ok(measured.boxes[i].y>measured.boxes[i-1].y);}assert.equal(measured.edges,3);
   for(const control of ['.zoom-in','.zoom-out','.canvas-lock','.reset-layout'])assert.equal(await page.locator('.subsystem-overview-canvas '+control).count(),1);
   await page.screenshot({path:`web/evidence/shell/subsystem-overview-${width}-${theme}.png`});observations.push({width,theme,...measured});
  }}
  assert.deepEqual(errors,[]);return {checks:'browser selection, manual drawer, open detail, Back, region containment, staircase, common controls, 1280/393 light/dark',observations};
 }finally{await context.close();}
}
