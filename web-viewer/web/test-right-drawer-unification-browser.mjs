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
 const shape=async selector=>page.locator(selector).evaluate(el=>{const header=el.querySelector('.right-drawer-heading'),tabs=el.querySelector('.right-drawer-tabs'),h=header.getBoundingClientRect(),b=header.querySelector('button').getBoundingClientRect(),hs=getComputedStyle(header),title=getComputedStyle(header.querySelector('h1,strong'));return {headerHeight:h.height,paddingLeft:hs.paddingLeft,paddingRight:hs.paddingRight,titleSize:title.fontSize,close:[b.width,b.height],tabs:[...tabs.querySelectorAll('button')].map(x=>{const r=x.getBoundingClientRect(),s=getComputedStyle(x);return {width:r.width,height:r.height,whiteSpace:s.whiteSpace,font:s.fontSize,background:s.backgroundColor,border:s.borderBottomWidth,selected:x.getAttribute('aria-selected')};})};});
 try{
  await loadPurchaseReview(page);mkdirSync('web/evidence/shell',{recursive:true});
  for(const theme of ['light','dark'])for(const width of [320,393,1280]){
   await page.setViewportSize({width,height:960});if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();
   await go('object:'+object.id);await open();assert.equal(await page.locator('#detail h1').textContent(),object.name);assert.equal(await page.locator('#detail-mode-states').count(),0);
   assert.deepEqual(await page.locator('#detail .right-drawer-tabs [role=tab]').allTextContents(),['業務内容','チェック項目']);
   await page.locator('#detail-mode-checks').click();assert.equal(await page.locator('#detail-mode-checks').getAttribute('aria-selected'),'true');await page.locator('#detail-mode-business').click();
   const business=await shape('#formattedMarkdownDrawer');assert.deepEqual(business.close,[44,44]);for(const t of business.tabs){assert(t.width>=44&&t.height>=44);assert.equal(t.whiteSpace,'nowrap');}
   if(width===393)await page.screenshot({path:`web/evidence/shell/right-business-${theme}.png`});
   await page.locator('#business-drawer-close').click();assert.equal(await page.locator('#formattedMarkdownDrawer').isVisible(),false);
   await go('concept:group-request');await open();assert.equal(await page.locator('.concept-related .right-drawer-heading strong').textContent(),'購入要求・申請内容');
   await page.locator('#concept-drawer-overview').click();const concept=await shape('.concept-related');assert.deepEqual(concept.close,[44,44]);
   for(const key of ['headerHeight','paddingLeft','paddingRight','titleSize'])assert.equal(concept[key],business[key],key+' must match');
   for(const [i,t]of concept.tabs.entries()){assert(t.width>=44&&t.height>=44);assert.equal(t.whiteSpace,'nowrap');assert.equal(t.height,business.tabs[i].height);assert.equal(t.font,business.tabs[i].font);}
   assert.equal(concept.tabs.find(x=>x.selected==='true').background,business.tabs.find(x=>x.selected==='true').background);assert.equal(concept.tabs.find(x=>x.selected==='true').border,business.tabs.find(x=>x.selected==='true').border);
   await page.locator('#concept-drawer-examples').click();assert.equal(await page.locator('.data-examples-panel').isVisible(),true);await page.locator('#concept-drawer-examples').press('ArrowLeft');assert.equal(await page.locator('#concept-drawer-overview').getAttribute('aria-selected'),'true');assert.equal(await page.locator('#concept-drawer-overview').evaluate(e=>e===document.activeElement),true);
   if(width===393)await page.screenshot({path:`web/evidence/shell/right-concept-${theme}.png`});
   await page.locator('.concept-related .right-drawer-heading button').click();assert.equal(await page.locator('.concept-related').isVisible(),false);
  }
  await page.setViewportSize({width:1280,height:960});await go('states:'+object.id);assert(await page.locator('.state-detail-page .state-diagram').isVisible());
  await go('concept:request');await open();assert.equal(await page.locator('.concept-child-tabs').isVisible(),false);const frame=page.frameLocator('iframe[data-concept-view=request]');await frame.locator('[data-node=request]').waitFor();assert.equal(await frame.locator('[data-node=request] [data-concept-open=request]').count(),0);assert(await frame.locator('[data-concept-open=version]').count()>0);
  assert.deepEqual(errors,[]);return {checks:'DRAWER-UI-001..005: real common header and tabs, 320/393/1280 light/dark, close and keyboard, state menu and intentional concept link difference',pageErrors:errors};
 }finally{await context.close();}
}
