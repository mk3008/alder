import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadPurchaseReview} from './purchase-review-browser.mjs';

export async function verifyCtrlWheelZoom(browser){
 const context=await browser.newContext({viewport:{width:1280,height:960}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  await loadPurchaseReview(page);const pkg=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v3-beta.json','utf8')),state=pkg.documents.find(d=>d.kind==='stateTransition');
  async function check(host,label,name){
   await host.waitFor({state:'visible'});await host.evaluate(v=>{v.scrollLeft=180;v.scrollTop=180;v.addEventListener('wheel',e=>{v.dataset.lastWheelPrevented=String(e.defaultPrevented);},{passive:true});});
   const before=await label.textContent(),box=await host.boundingBox(),scale=await page.evaluate(()=>window.devicePixelRatio),x=box.x+Math.min(100,box.width/2),y=box.y+Math.min(100,box.height/2);
   await page.mouse.move(x,y);await page.keyboard.down('Control');await page.mouse.wheel(0,-100);await page.keyboard.up('Control');
   for(let i=0;i<50&&(await label.textContent())===before;i++)await page.waitForTimeout(20);
   assert.notEqual(await label.textContent(),before,name+' zoom changes');assert.equal(await host.getAttribute('data-last-wheel-prevented'),'true',name+' prevents browser zoom');assert.equal(await page.evaluate(()=>window.devicePixelRatio),scale,name+' keeps page scale');
   const after=await label.textContent();await page.mouse.wheel(0,100);await page.waitForTimeout(60);assert.equal(await host.getAttribute('data-last-wheel-prevented'),'false',name+' ordinary wheel keeps default scrolling');assert.equal(await label.textContent(),after);
   return {name,before,after};
  }
  const results=[];
  results.push(await check(page.locator('.subsystem-overview-canvas .diagram-viewport'),page.locator('.subsystem-overview-canvas .canvas-zoom'),'subsystem'));
  await page.locator('[data-explorer-key="business:overview"]').click();results.push(await check(page.locator('#viewport'),page.locator('#zoom'),'business'));
  await page.locator('[data-explorer-key="states:'+state.objectId+'"]').click();results.push(await check(page.locator('#states-workspace .diagram-viewport'),page.locator('#states-workspace .canvas-zoom'),'state'));
  await page.locator('[data-explorer-key="concept:overview"]').click();const frame=page.frameLocator('iframe[data-concept-view="overview"]');results.push(await check(frame.locator('.canvas'),frame.locator('.canvas-zoom'),'concept'));
  assert.deepEqual(errors,[]);return results;
 }finally{await context.close();}
}
