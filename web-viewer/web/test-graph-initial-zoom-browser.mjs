import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadPurchaseReview} from './purchase-review-browser.mjs';

// Each context has no camera settings; switching and reloads exercise the existing per-view scopes.
export async function verifyGraphInitialZoom(browser){
 const documents=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v3-beta.json','utf8')).documents,stateId=documents.find(d=>d.kind==='stateTransition').objectId,activityId=documents.find(d=>d.kind==='businessDesign').activities[0].id,observations=[];
 for(const width of [393,1280]){
  const context=await browser.newContext({viewport:{width,height:850}}),page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  try{
   await loadPurchaseReview(page);
   const choose=async key=>{if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();await page.locator(`[data-explorer-key="${key}"]`).click();};
   const value=async label=>(await label.textContent()).trim();
   const overall=page.locator('.subsystem-overview-canvas .canvas-zoom');assert.equal(await value(overall),'100%');
   await page.setViewportSize({width:width===393?600:1040,height:850});await page.locator('#drawer').click();assert.equal(await value(overall),'100%','opening a drawer and resizing never fit the graph');await page.locator('#drawer').click();await page.setViewportSize({width,height:850});
   await page.locator('[data-review-group="group-request"]').click();assert.equal(await value(overall),'100%','selecting a card leaves zoom unchanged');
   await page.locator('.subsystem-overview-canvas .zoom-out').click();assert.equal(await value(overall),'83%');
   await choose('business:overview');assert.equal(await value(page.locator('#zoom')),'100%','new business overview');
   await choose('business:'+activityId);assert.equal(await value(page.locator('#zoom')),'100%','new business Activity');
   await choose('states:'+stateId);assert.equal(await value(page.locator('#states-workspace .canvas-zoom')),'100%','new state graph');await page.locator('#states-workspace .zoom-in').click();assert.equal(await value(page.locator('#states-workspace .canvas-zoom')),'120%');
   for(const id of ['overview','group-result','request']){await choose('concept:'+id);const frame=page.frameLocator(`iframe[data-concept-view="${id}"]`);await frame.locator('.node').first().waitFor();assert.equal(await value(frame.locator('.canvas-zoom')),'100%',`fresh ${id}`);if(id==='group-result')await frame.locator('.zoom-out').click();}
   await choose('states:'+stateId);assert.equal(await value(page.locator('#states-workspace .canvas-zoom')),'120%','state survives a tab change in this session');
   await choose('concept:landscape');assert.equal(await value(overall),'83%','overview retains its own adjusted zoom');
   await page.waitForFunction(()=>['saved','unchanged'].includes(document.querySelector('#app')?.dataset.saveState));await page.reload();await page.locator('.subsystem-overview-graph').waitFor();assert.equal(await value(overall),'83%','saved overview survives reload');
   await choose('concept:group-result');const result=page.frameLocator('iframe[data-concept-view="group-result"]');await result.locator('.node').first().waitFor();assert.equal(await value(result.locator('.canvas-zoom')),'83%','saved model zoom survives reload independently');
   await choose('states:'+stateId);assert.equal(await value(page.locator('#states-workspace .canvas-zoom')),'100%','state zoom is session-only');assert.deepEqual(errors,[]);observations.push({width,initial:'100%',overviewAfterReload:'83%',conceptAfterReload:'83%',stateAfterReload:'100%'});
  }finally{await context.close();}
 }
 return {authority:'GRAPH-ZOOM-001/002/003',observations};
}
