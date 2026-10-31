import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {loadPurchaseReview} from './purchase-review-browser.mjs';

export async function verifySampleIdentification(browser){
 const context=await browser.newContext({viewport:{width:393,height:960}}),page=await context.newPage(),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 const go=async key=>{if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();await page.locator(`[data-explorer-key="${key}"]`).click();if(await page.evaluate(()=>innerWidth<=800)&&await page.locator('#design-explorer').isVisible())await page.locator('#design-explorer .shell-heading button').click();};
 const example=async(group,scene)=>{await go('concept:'+group);if(await page.locator('#drawer').getAttribute('aria-expanded')!=='true')await page.locator('#drawer').click();await page.locator('#concept-drawer-examples').click();await page.locator('.data-example-picker select').selectOption(scene);assert.equal(await page.locator('.data-examples-panel').getAttribute('data-data-example'),scene);};
 const colors=()=>page.locator('.data-examples-panel').evaluate(panel=>{const result={};for(const cell of panel.querySelectorAll('[data-sample-key]')){const key=cell.dataset.sampleKey;(result[key]??=[]).push({text:cell.textContent,color:getComputedStyle(cell).backgroundColor});}return result;});
 const color=(values,key,count)=>{assert.equal(values[key]?.length,count,key);assert(values[key].every(cell=>cell.color===values[key][0].color&&cell.text));return values[key][0].color;};
 try{
  await loadPurchaseReview(page);mkdirSync('web/evidence/shell',{recursive:true});
  for(const theme of ['light','dark'])for(const width of [393,1280]){
   await page.setViewportSize({width,height:960});if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();
   await example('group-request','request-draft-approved');assert.equal(await page.locator('.data-example-caption').count(),0);
   let map=await colors();const req=color(map,'request:R-101',5),v1=color(map,'version:R-101:V1',3),d1=color(map,'version:R-101:D1',2);assert.equal(new Set([req,v1,d1]).size,3);
   if(width===393)await page.screenshot({path:`web/evidence/shell/sample-identity-request-${theme}.png`});
   await example('group-handoff','handoff-batch');map=await colors();assert.notEqual(color(map,'version:R-101:V1',4),color(map,'version:R-102:V1',3));
   await example('group-result','result-partial');map=await colors();assert.notEqual(color(map,'item:R-101:V1:01',2),color(map,'item:R-101:V1:02',2));
   assert.equal(await page.locator('[data-example-card="item"] tbody tr').first().locator('td').nth(2).textContent(),'01');assert.equal(await page.locator('[data-example-card="line"] tbody tr').first().locator('td').nth(3).textContent(),'01');
   if(width===393){await page.locator('[data-example-card="item"]').scrollIntoViewIfNeeded();await page.screenshot({path:`web/evidence/shell/sample-identity-result-${theme}.png`});}
  }
  assert.deepEqual(errors,[]);return {checks:'SAMPLE-IDENTITY-001/002/004: actual cross-table colors, same-name versions in different requests, item links and scene switching, 393/1280 light/dark',pageErrors:errors};
 }finally{await context.close();}
}
