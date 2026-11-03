import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {openExplorerGroup} from './explorer-browser.mjs';

// Exercise actual pointer navigation, reload and browser history with the current JSON.
export async function verifySubsystemSpecLinks(browser){
 const source=readFileSync('../work/concept-review/issue-133/versions/purchase-v7-value-independent-review.json');
 const observations=[];
 for(const [width,theme] of [[1280,'light'],[393,'dark']]){
  const context=await browser.newContext({viewport:{width,height:960},hasTouch:true}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  try{
   await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);
   await page.locator('#fallback').setInputFiles({name:'purchase-v7.json',mimeType:'application/json',buffer:source});
   await page.waitForFunction(()=>document.querySelectorAll('#explorer-business-activity .explorer-item').length>0);
   if(await page.locator('#check-followup').isVisible())await page.locator('#check-followup-later').click();
   if((await page.locator('html').getAttribute('data-theme'))!==theme)await page.locator('#theme').click();
   if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();
   for(const group of ['subsystems','subsystem-approval'])await openExplorerGroup(page,group);
   await page.locator('[data-explorer-key="concept:group-request"]').click();
   if(!await page.locator('.concept-related').isVisible())await page.locator('#drawer').click();
   const exact=page.locator('[data-sample=request-draft-approved]');assert.match(await exact.textContent(),/^サンプル：/);
   await exact.click();await page.locator('#tests-workspace [data-data-example="request-draft-approved"]').waitFor();
   assert.equal(await page.locator('.concept-related').isVisible(),false);assert.match(await page.locator('#tests-workspace').textContent(),/P-02/);
   if(width>800){assert.equal(await page.locator('#test-related-panel').isVisible(),true);if(await page.locator('.activity-test-toc').isVisible()){const toc=await page.locator('.activity-test-toc').boundingBox(),drawer=await page.locator('#test-related-panel').boundingBox();assert(toc&&drawer&&toc.x+toc.width<=drawer.x,'section contents do not overlap the related drawer');}}
   const resultURL=new URL(page.url());assert.equal(resultURL.searchParams.get('view'),'tests');assert.equal(resultURL.searchParams.get('dataExample'),'request-draft-approved');
   await page.waitForFunction(()=>['saved','unchanged'].includes(document.querySelector('#app')?.dataset.saveState));
   await page.reload();await page.locator('#tests-workspace [data-data-example="request-draft-approved"]').waitFor();
   await page.goBack();await page.locator('[data-sample=request-draft-approved]').waitFor({state:'visible'});
   await page.goForward();await page.locator('#tests-workspace [data-data-example="request-draft-approved"]').waitFor();
   if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();
   await page.locator('[data-explorer-key="concept:group-request"]').click();
   if(!await page.locator('.concept-related').isVisible())await page.locator('#drawer').click();
   const decision=page.locator('[data-sample=request-over-limit]');assert.match(await decision.textContent(),/^可否判定：/);
   await decision.click();await page.locator('#tests-workspace [data-decision-example="decision-submit-table"]').waitFor({state:'visible'});
   assert.equal(await page.evaluate(()=>document.activeElement?.dataset.decisionExample),'decision-submit-table');
   assert.match(await page.locator('#tests-workspace').textContent(),/P-04/);assert.equal(await page.locator('#tests-workspace [data-data-example]:visible').count(),0);
   assert.equal(new URL(page.url()).searchParams.has('dataExample'),false);assert.deepEqual(errors,[]);
   observations.push({width,theme,result:'exact example',decision:'linked Check',reload:true,history:true});
  }finally{await context.close();}
 }
 return {authority:'SUBSYSTEM-SPEC-001/002/004',observations};
}
