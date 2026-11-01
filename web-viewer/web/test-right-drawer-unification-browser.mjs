import assert from 'node:assert/strict';
import {mkdirSync,readFileSync} from 'node:fs';
import {loadPurchaseReview} from './purchase-review-browser.mjs';

export async function verifyRightDrawerUnification(browser){
 const context=await browser.newContext({viewport:{width:1280,height:960}}),page=await context.newPage(),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 const pkg=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v3-beta.json','utf8'));
 const bd=pkg.documents.find(x=>x.kind==='businessDesign'),state=pkg.documents.find(x=>x.kind==='stateTransition'),object=bd.objects.find(x=>x.id===state.objectId);
 const go=async key=>{if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();await page.locator('[data-explorer-key="'+key+'"]').click();if(await page.evaluate(()=>innerWidth<=800)&&await page.locator('#design-explorer').isVisible())await page.locator('#design-explorer .shell-heading button').click();};
 const open=async()=>{if(await page.locator('#drawer').getAttribute('aria-expanded')!=='true')await page.locator('#drawer').click();};
 const shape=async selector=>page.locator(selector).evaluate(el=>{const header=el.querySelector('.right-drawer-heading'),tabs=el.querySelector('.right-drawer-tabs'),content=el.querySelector('#detail>.markdown')??el.querySelector('.data-review-overview'),h=header.getBoundingClientRect(),b=header.querySelector('button').getBoundingClientRect(),c=content.getBoundingClientRect(),panel=el.getBoundingClientRect(),bar=(el.querySelector('.drawer-findings')??tabs??header).getBoundingClientRect(),hs=getComputedStyle(header),cs=getComputedStyle(content),title=getComputedStyle(header.querySelector('h1,strong')),scroll=el.querySelector('.concept-drawer-body')?.scrollTop??0;return {headerHeight:h.height,paddingLeft:hs.paddingLeft,paddingRight:hs.paddingRight,titleSize:title.fontSize,bodyLeft:c.left-panel.left+parseFloat(cs.paddingLeft),bodyTop:c.top-bar.bottom+parseFloat(cs.paddingTop)+scroll,close:[b.width,b.height],tabs:[...(tabs?.querySelectorAll('button')??[])].map(x=>{const r=x.getBoundingClientRect(),s=getComputedStyle(x);return {width:r.width,height:r.height,whiteSpace:s.whiteSpace,font:s.fontSize,background:s.backgroundColor,border:s.borderBottomWidth,selected:x.getAttribute('aria-selected')};})};});
 try{
  await loadPurchaseReview(page);mkdirSync('web/evidence/shell',{recursive:true});
  for(const theme of ['light','dark'])for(const width of [320,393,1280]){
   await page.setViewportSize({width,height:960});if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();
   await go('object:'+object.id);await open();assert.equal(await page.locator('#detail h1').textContent(),object.name);assert.equal(await page.locator('#detail-mode-states').count(),0);
   assert.equal(await page.locator('#detail .right-drawer-tabs').count(),0);assert.equal(await page.locator('#detail>.markdown').count(),1);
   const business=await shape('#formattedMarkdownDrawer');assert.deepEqual(business.close,[44,44]);assert.equal(business.tabs.length,0);
   if(width===393)await page.screenshot({path:`web/evidence/shell/right-business-${theme}.png`});
   await page.locator('#business-drawer-close').click();assert.equal(await page.locator('#formattedMarkdownDrawer').isVisible(),false);
   await go('concept:group-request');await open();assert.equal(await page.locator('.concept-related .right-drawer-heading strong').textContent(),'購入要求・申請内容');
   assert(await page.locator('.data-review-overview').isVisible());assert.equal(await page.locator('.concept-child-tabs').count(),0);const concept=await shape('.concept-related');assert.deepEqual(concept.close,[44,44]);
   for(const key of ['headerHeight','paddingLeft','paddingRight','titleSize'])assert.equal(concept[key],business[key],key+' must match');
   for(const key of ['bodyLeft','bodyTop'])assert.ok(Math.abs(concept[key]-business[key])<=1,key+' must match within a pixel');
   assert.equal(concept.tabs.length,0);
   const sample=page.locator('[data-sample=request-submitted]'),body=page.locator('.concept-drawer-body');await sample.scrollIntoViewIfNeeded();const overviewScroll=await body.evaluate(el=>el.scrollTop);await sample.click();assert.equal(await page.locator('.data-examples-panel').isVisible(),true);await page.locator('.concept-example-back').press('Enter');assert.equal(await page.locator('.data-review-overview').isVisible(),true);assert.equal(await page.locator('.data-review-overview').evaluate(e=>e===document.activeElement),true);assert.ok(Math.abs((await body.evaluate(el=>el.scrollTop))-overviewScroll)<=1,'returning to the overview restores its scroll position');
   if(width===393)await page.screenshot({path:`web/evidence/shell/right-concept-${theme}.png`});
   await page.locator('.concept-related .right-drawer-heading button').click();assert.equal(await page.locator('.concept-related').isVisible(),false);
  }
  await page.setViewportSize({width:1280,height:960});
  const finding=bd.findings.find(item=>item.sourceId==='F05'),activity=bd.activities.find(item=>finding.targetIds.includes(item.id));
  await go('business:'+activity.id);await open();const findingLink=page.locator('#detail [data-finding-link="'+finding.id+'"]');assert.match(await findingLink.innerText(),/F05/);await findingLink.click();assert.match(await page.locator('#node-list .finding-card').innerText(),/F05/);assert.match(await page.locator('#node-list .finding-card').innerText(),/仮説/);await page.locator('#node-list-close').click();
  await go('states:'+object.id);assert(await page.locator('.state-detail-page .state-diagram').isVisible());
  await go('concept:request');await open();assert.equal(await page.locator('.concept-child-tabs').count(),0);const frame=page.frameLocator('iframe[data-concept-view=request]');await frame.locator('[data-node=request]').waitFor();assert.equal(await frame.locator('[data-node=request] [data-concept-open=request]').count(),0);assert(await frame.locator('[data-concept-open=version]').count()>0);
  assert.deepEqual(errors,[]);return {checks:'DRAWER-UI-001..005: real common header and tabs, 320/393/1280 light/dark, close and keyboard, state menu and intentional concept link difference',pageErrors:errors};
 }finally{await context.close();}
}
