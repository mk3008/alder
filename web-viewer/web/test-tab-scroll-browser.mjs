import assert from 'node:assert/strict';
import {loadPurchaseReview} from './purchase-review-browser.mjs';

// Real wheel input and the mixed-kind row, not synthetic DOM geometry.
export async function verifyTabScroll(browser){
 const context=await browser.newContext({viewport:{width:1000,height:850}}),page=await context.newPage(),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 try{
  await loadPurchaseReview(page);
  const keys=await page.locator('#explorer-business-activity .explorer-item').evaluateAll(items=>items.slice(0,3).map(item=>item.dataset.explorerKey));
  keys.push(...await page.locator('#explorer-subsystems .explorer-item-nested').evaluateAll(items=>items.map(item=>item.dataset.explorerKey)));
  keys.push('concept:overview');
  keys.push(await page.locator('#explorer-states .explorer-item').first().getAttribute('data-explorer-key'));
  for(const key of keys)await page.locator(`[data-explorer-key=${JSON.stringify(key)}]`).click();
  const row=page.locator('.shell-open-tabs');
  const initial=await row.evaluate(el=>({width:el.clientWidth,extent:el.scrollWidth,scrollbar:getComputedStyle(el).scrollbarWidth,webkit:getComputedStyle(el,'::-webkit-scrollbar').display,kinds:[...new Set([...el.querySelectorAll('.tab:not([hidden])')].map(tab=>tab.dataset.viewKind))]}));
  assert.ok(initial.extent>initial.width,'mixed tabs overflow the common row');assert.equal(initial.scrollbar,'none');assert.equal(initial.webkit,'none');
  for(const kind of ['business','concept','subsystems','states'])assert.ok(initial.kinds.includes(kind),`mixed row contains ${kind}`);
  const selected=await row.locator('.tab.active button:first-child').getAttribute('id'),url=page.url();
  await row.evaluate(el=>{el.scrollLeft=0;});const box=await row.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
  await page.mouse.wheel(0,180);await page.waitForFunction(()=>document.querySelector('.shell-open-tabs').scrollLeft>0);
  const forward=await row.evaluate(el=>el.scrollLeft);assert.equal(page.url(),url);assert.equal(await row.locator('.tab.active button:first-child').getAttribute('id'),selected);
  await page.mouse.wheel(-100,0);await page.waitForFunction(previous=>document.querySelector('.shell-open-tabs').scrollLeft<previous,forward);
  await row.evaluate(el=>{el.dataset.ctrlWheel='waiting';el.addEventListener('wheel',event=>{if(event.ctrlKey)el.dataset.ctrlWheel=String(event.defaultPrevented);},{once:true});});
  await page.keyboard.down('Control');try{await page.mouse.wheel(0,50);await page.waitForFunction(()=>document.querySelector('.shell-open-tabs').dataset.ctrlWheel!=='waiting');}finally{await page.keyboard.up('Control');}
  assert.equal(await row.getAttribute('data-ctrl-wheel'),'false','browser zoom wheel is not intercepted');
  // Select without Playwright auto-scrolling; the shell itself must reveal the tab.
  await row.locator('.concept-tabs .tab button:first-child').first().click();
  await row.evaluate(el=>{el.scrollLeft=0;const button=el.querySelector('.state-tabs .tab button:first-child');button.focus({preventScroll:true});button.click();});
  const visible=await row.evaluate(el=>{const a=el.getBoundingClientRect(),b=el.querySelector('.tab.active').getBoundingClientRect();return b.left>=a.left-1&&b.right<=a.right+1;});assert.equal(visible,true,'the newly selected tab is revealed');
  await row.locator('.tab.active .close').focus();assert.equal(await row.locator('.tab.active .close').evaluate(el=>document.activeElement===el),true,'close remains keyboard focusable');
  assert.deepEqual(errors,[]);return {checks:'mixed-kind overflow, hidden scrollbar, native vertical and horizontal wheel, Ctrl+wheel, unchanged selection/URL, active reveal and keyboard-focusable close'};
 }finally{await context.close();}
}
