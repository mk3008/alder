import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {openExplorerGroup} from './explorer-browser.mjs';

export async function verifySpecRelatedLinks(browser){
 const source=readFileSync('../work/concept-review/issue-133/versions/purchase-v7-value-independent-review.json'),pkg=JSON.parse(source),model=pkg.documents.find(d=>d.kind==='conceptModel'),activity=model.presentation.activityViews.find(v=>v.testSpecificationFunctions?.some(f=>f.groupId==='group-request'&&f.capabilityId==='save-draft')).activityId,key=`fn:${activity}:group-request:save-draft`,observations=[];
 for(const [width,theme] of [[1280,'light'],[393,'dark']]){
  const context=await browser.newContext({viewport:{width,height:900},hasTouch:true}),page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  try{
   await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('#fallback').setInputFiles({name:'purchase-v7.json',mimeType:'application/json',buffer:source});await page.waitForFunction(()=>document.querySelectorAll('#explorer-business-activity .explorer-item').length>0);
   if(await page.locator('#check-followup').isVisible())await page.locator('#check-followup-later').click();if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();
   for(const group of ['subsystems','subsystem-approval'])await openExplorerGroup(page,group);await page.locator('[data-explorer-key="concept:group-request"]').click();if(!await page.locator('.concept-related').isVisible())await page.locator('#drawer').click();
   await page.locator('[data-sample="request-draft-approved"]').click();await page.locator('#tests-workspace [data-data-example="request-draft-approved"]').waitFor();const drawer=page.locator('#test-related-panel');assert(await drawer.isVisible());assert.equal(await drawer.locator('p,table,[data-data-example]').count(),0);assert.equal(await drawer.locator('[data-related-concept]').count(),3);
   await drawer.locator(`[data-related-activity="${activity}"]`).click();assert.equal(new URL(page.url()).searchParams.get('activity'),activity);assert(await page.locator('#formattedMarkdownDrawer').isVisible());
   const decision=page.locator(`#detail [data-related-spec="decision:${key}"]`),result=page.locator(`#detail [data-related-spec="${key}"]`);assert.equal(await decision.count(),1);assert.equal(await result.count(),1);await decision.click();assert(await drawer.isVisible());assert.equal(new URL(page.url()).searchParams.get('spec'),'decision:'+key);
   await drawer.locator('[data-related-group="group-request"]').click();assert(await page.locator('.concept-related').isVisible());await page.locator(`.data-review-overview [data-related-spec="${key}"]`).click();assert(await drawer.isVisible());
   await drawer.locator('[data-related-concept="item"]').click();assert(await page.locator('.concept-related').isVisible());assert.equal(await page.locator(`.concept-related-content [data-related-spec="decision:${key}"]`).count(),1);await page.locator(`.concept-related-content [data-related-spec="${key}"]`).click();
   await drawer.locator('.shell-heading button').click();assert.equal(await drawer.isVisible(),false);await page.goBack();assert.equal(await page.locator('.concept-related').isVisible(),false,'history does not reopen drawer');await page.goForward();assert.equal(await drawer.isVisible(),false);await page.locator('#drawer').click();assert(await drawer.isVisible());
   await page.waitForFunction(()=>['saved','unchanged'].includes(document.querySelector('#app')?.dataset.saveState));await page.reload();await drawer.waitFor({state:'visible'});assert.equal(await drawer.locator('[data-related-activity]').count(),1);assert.deepEqual(errors,[]);observations.push({width,theme,decision:true,result:true,activity:true,concept:true,history:true,reload:true});
  }finally{await context.close();}
 }
 return {authority:'SPEC-RELATED-001/002/003',observations};
}
