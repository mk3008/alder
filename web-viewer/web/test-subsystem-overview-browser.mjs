import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {loadPurchaseReview} from './purchase-review-browser.mjs';
import {touchDriver} from './touch-driver.mjs';

async function backgroundPoint(page,id){
 const point=await page.evaluate(subsystem=>{
  const rect=document.querySelector(`[data-subsystem="${subsystem}"] .subsystem-overview-region`),viewport=rect.closest('.diagram-viewport'),r=rect.getBoundingClientRect(),v=viewport.getBoundingClientRect();
  for(let y=Math.max(r.top+8,v.top+35);y<Math.min(r.bottom-8,v.bottom-35);y+=8)for(let x=Math.max(r.left+8,v.left+45);x<Math.min(r.right-8,v.right-45);x+=8){
   if(document.elementFromPoint(x,y)===rect&&document.elementFromPoint(x+8,y+8)===rect)return{x,y};
  }
 },id);
 assert(point,'visible uncovered background is required for '+id);return point;
}

export async function verifySubsystemOverview(browser){
 const context=await browser.newContext({viewport:{width:1280,height:960},hasTouch:true}),page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
 const cdp=await context.newCDPSession(page),touch=touchDriver(page,cdp);await touch.install();
 try{
  await loadPurchaseReview(page);
  assert.equal(await page.locator('.concept-review-landscape h1').count(),0);assert.equal(await page.locator('#concept-tab-landscape .view-tab-name').textContent(),'全体図');assert.equal(await page.locator('[data-explorer-key="group:concept"]').textContent(),'データ構造');assert.equal(await page.locator('.landscape-modes').count(),0);assert.equal(await page.locator('[data-explorer-key="concept:overview"]').textContent(),'概念相関図');
  assert.equal(await page.locator('[data-subsystem]').count(),2);assert.equal(await page.locator('[data-review-group]').count(),4);assert.equal(await page.locator('[data-overview-from]').count(),2);assert.equal(await page.locator('[data-handoff-id]').count(),2);assert.deepEqual(await page.locator('[data-handoff-label]').allTextContents(),['承認済みの版・品目','入荷・未購入の結果']);
  for(const label of await page.locator('[data-handoff-label]').all()){const bounds=await label.boundingBox(),viewport=await page.locator('.subsystem-overview-canvas .diagram-viewport').boundingBox();assert.ok(bounds.x>=viewport.x&&bounds.x+bounds.width<=viewport.x+viewport.width&&bounds.y>=viewport.y&&bounds.y+bounds.height<=viewport.y+viewport.height,'handoff label is visible on initial desktop display');}
  let point=await backgroundPoint(page,'approval');await page.mouse.click(point.x,point.y);
  assert.equal(await page.locator('[data-subsystem="approval"] button').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('.concept-related').isVisible(),false);
  await page.locator('#drawer').click();assert.equal(await page.locator('.concept-related .shell-heading strong').textContent(),'稟議サブシステム');
  point=await backgroundPoint(page,'receiving');await page.touchscreen.tap(point.x,point.y);
  assert.equal(await page.locator('[data-subsystem="receiving"] button').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('.concept-related .shell-heading strong').textContent(),'入荷予実サブシステム');await page.locator('#drawer').click();
  const title=page.locator('[data-subsystem="approval"] button');await title.focus();await page.keyboard.press('Enter');assert.equal(await title.getAttribute('aria-pressed'),'true');await page.keyboard.press('Space');assert.equal(await title.getAttribute('aria-pressed'),'true');
  const viewport=page.locator('.subsystem-overview-canvas .diagram-viewport');
  for(let i=0;i<8;i++){const size=await viewport.evaluate(v=>({x:v.scrollWidth-v.clientWidth,y:v.scrollHeight-v.clientHeight}));if(size.x>100&&size.y>100)break;await page.locator('.subsystem-overview-canvas .zoom-in').click();}
  const extent=await viewport.evaluate(v=>({x:v.scrollWidth-v.clientWidth,y:v.scrollHeight-v.clientHeight}));assert(extent.x>100&&extent.y>100,'canvas must have room to pan');
  for(const locked of [true,false]){
   const lock=page.locator('.subsystem-overview-canvas .canvas-lock');if((await lock.getAttribute('aria-pressed')==='true')!==locked)await lock.click();
   await viewport.evaluate(v=>{v.scrollLeft=40;v.scrollTop=40;});point=await backgroundPoint(page,'approval');
   const before=await viewport.evaluate(v=>[v.scrollLeft,v.scrollTop]);
   await page.mouse.move(point.x,point.y);await page.mouse.down();await page.mouse.move(point.x-25,point.y-25,{steps:4});await page.mouse.up();
   const after=await viewport.evaluate(v=>[v.scrollLeft,v.scrollTop]);assert(after[0]>before[0]&&after[1]>before[1],'mouse pans from region background');assert.equal(await title.getAttribute('aria-pressed'),'true','mouse pan does not change selection');
  }
  await viewport.evaluate(v=>{v.scrollLeft=40;v.scrollTop=40;});point=await backgroundPoint(page,'approval');
  const beforeTouch=await viewport.evaluate(v=>[v.scrollLeft,v.scrollTop]);
  await touch.send('touchStart',[[1,point.x,point.y]]);await touch.send('touchMove',[[1,point.x-25,point.y-25]]);await touch.send('touchEnd',[]);
  const afterTouch=await viewport.evaluate(v=>[v.scrollLeft,v.scrollTop]);assert(afterTouch[0]>beforeTouch[0]&&afterTouch[1]>beforeTouch[1],'touch pans from region background');assert.equal(await title.getAttribute('aria-pressed'),'true','touch pan does not change selection');
  point=await backgroundPoint(page,'approval');const zoom=await page.locator('.subsystem-overview-canvas .canvas-zoom').textContent();
  await touch.send('touchStart',[[1,point.x,point.y],[2,point.x+8,point.y+8]]);await touch.send('touchMove',[[1,point.x,point.y],[2,point.x+24,point.y+24]]);await touch.send('touchEnd',[]);touch.idle();
  assert.notEqual(await page.locator('.subsystem-overview-canvas .canvas-zoom').textContent(),zoom,'pinch changes zoom');assert.equal(await title.getAttribute('aria-pressed'),'true','pinch does not change selection');
  await page.locator('.subsystem-overview-canvas .graph-settings-toggle').click();await page.locator('.subsystem-overview-canvas .reset-layout').click();
  if(await page.locator('.subsystem-overview-canvas .canvas-lock').getAttribute('aria-pressed')==='false')await page.locator('.subsystem-overview-canvas .canvas-lock').click();
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
