import assert from 'node:assert/strict';
import {ensureDocumentActions} from './test-tab-strip-browser.mjs';
export async function verifyEditorViewport(browser){
 const results=[];
 const clickScaled=async(page,selector)=>{
  await page.locator(selector).scrollIntoViewIfNeeded();
  const point=await page.evaluate(async selector=>{
   await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
   const e=document.querySelector(selector),r=e.getBoundingClientRect(),v=visualViewport,x=r.left+r.width/2,y=r.top+r.height/2,hit=document.elementFromPoint(x,y),s=getComputedStyle(e);
   const check={enabled:!e.disabled,visible:r.width>0&&r.height>0&&s.visibility==='visible'&&s.display!=='none',hit:hit===e||e.contains(hit),inView:x>=v.offsetLeft&&x<v.offsetLeft+v.width&&y>=v.offsetTop&&y<v.offsetTop+v.height};
   window.__viewportClickEvidence=null;
   document.addEventListener('click',event=>{window.__viewportClickEvidence={trusted:event.isTrusted,target:event.target.id,matches:event.target===e||e.contains(event.target)};},{once:true,capture:true});
   return{x:x-v.offsetLeft,y:y-v.offsetTop,check};
  },selector);
  assert.deepEqual(point.check,{enabled:true,visible:true,hit:true,inView:true},'scaled pointer target must be enabled, visible and unobscured');
  await page.mouse.click(point.x,point.y);
  const event=await page.evaluate(()=>window.__viewportClickEvidence);
  assert.equal(event?.trusted,true,'native input must create a trusted click');assert.equal(event?.matches,true,'native click must reach intended target');
 };

 for(const scale of [1,2,3])for(const method of ['Escape','button']){
 const context=await browser.newContext({viewport:{width:980,height:1700},isMobile:true,hasTouch:true}),page=await context.newPage();
 try{await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('#open-sample').click();await page.waitForFunction(()=>document.querySelector('#app').dataset.saveState==='saved');const graph=await page.locator('#nodes').innerHTML(),zoom=await page.locator('#zoom').textContent();await ensureDocumentActions(page);await page.locator('#view-markdown').click();assert.equal(await page.locator('#source-text').getAttribute('readonly'),'');const cdp=await context.newCDPSession(page);await cdp.send('Emulation.setPageScaleFactor',{pageScaleFactor:scale});if(method==='Escape')await page.keyboard.press('Escape');else if(scale===1)await page.locator('#source-cancel').click();else await clickScaled(page,'#source-cancel');await page.waitForFunction(()=>document.querySelector('#source-dialog').hidden);assert.equal(await page.locator('#source-close-dialog').count(),0);assert.equal(await page.evaluate(()=>visualViewport.scale),scale);assert.equal(await page.locator('#nodes').innerHTML(),graph);assert.equal(await page.locator('#zoom').textContent(),zoom);assert.ok(await page.evaluate(()=>document.querySelector('header').getBoundingClientRect().bottom>visualViewport.offsetTop));results.push({scale,method});}finally{await context.close();}
 }
 return {results,limit:'Chromium CDP scale; physical Android keyboard/pinch not verified'};
}
