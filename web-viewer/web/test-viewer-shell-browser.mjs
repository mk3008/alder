import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {verifyGlobalRightDrawer} from './test-global-right-drawer-browser.mjs';
import {loadPurchaseReview} from './purchase-review-browser.mjs';
import {verifyUnifiedConcept} from './test-unified-concept-browser.mjs';
import {verifyRightDrawerUnification} from './test-right-drawer-unification-browser.mjs';

// Current shell: one global explorer and one shared row for all document tabs.
export async function verifyViewerShell(browser){
 const context=await browser.newContext({viewport:{width:1280,height:960}}),page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
 try{
  await loadPurchaseReview(page);
  await page.locator('[data-explorer-key="concept:overview"]').click();
  const whole=page.locator('iframe[data-concept-view="overview"]'),frame=page.frameLocator('iframe[data-concept-view="overview"]');await whole.waitFor();await frame.locator('#overview .table').first().waitFor();await frame.locator('.graph-settings-toggle svg').waitFor();
  const lock=frame.locator('.layout-lock'),locked=await lock.getAttribute('aria-pressed');await lock.click();assert.notEqual(await lock.getAttribute('aria-pressed'),locked);await lock.click();
  await frame.locator('.graph-settings-toggle').click();await frame.getByRole('button',{name:'レイアウトを初期値に戻す',exact:true}).waitFor();await frame.locator('.graph-settings-toggle').press('Escape');assert.equal(await frame.locator('.graph-settings-toggle').getAttribute('aria-expanded'),'false');
  await frame.getByRole('button',{name:'縮小',exact:true}).click();const zoom=await frame.locator('.zoom-value').textContent();
  const clearance=await frame.locator('.canvas').evaluate(host=>{const saved=[host.scrollLeft,host.scrollTop];host.scrollTop=host.scrollHeight;const bottom=host.querySelector('.node[data-table="line"]').getBoundingClientRect().bottom,toolbarTop=host.parentElement.querySelector('.canvas-controls').getBoundingClientRect().top;host.scrollTo(...saved);return {bottom,toolbarTop};});assert.ok(clearance.bottom<clearance.toolbarTop,'last concept remains above the floating toolbar at the bottom of scroll');
  await frame.locator('[data-concept-open="version"]').click();await page.locator('iframe[data-concept-view="version"]').waitFor();assert.equal(await page.locator('#concept-tab-version').getAttribute('aria-current'),'true');
  await page.locator('#concept-tab-overview').click();assert.equal(await frame.locator('.zoom-value').textContent(),zoom,'canvas zoom survives detail navigation');
  await page.locator('#concept-tab-version').click();await page.locator('#tabs .tab button:first-child').first().click();assert.equal(await page.locator('#business-workspace').isVisible(),true);
  await page.locator('#concept-tab-version').click();assert.equal(await page.locator('#concept-tab-version').getAttribute('aria-current'),'true');await page.locator('#concept-tab-overview').click();await page.goBack();assert.equal(await page.locator('#concept-tab-version').getAttribute('aria-current'),'true','browser Back restores concept detail');
  await page.getByRole('button',{name:'データ構造：購入申請版のタブを閉じる',exact:true}).click();assert.equal(await page.locator('#concept-tab-version').count(),0);await page.locator('#concept-tab-overview').click();
  mkdirSync('web/evidence/shell',{recursive:true});
  for(const theme of ['light','dark']){if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();for(const width of [1280,393]){
   await page.setViewportSize({width,height:960});const geometry=await page.locator('#concept-workspace').evaluate(el=>{const r=el.getBoundingClientRect();return {bottom:r.bottom,width:document.documentElement.scrollWidth,windowWidth:innerWidth,height:innerHeight};});assert.ok(geometry.bottom<=geometry.height+1);assert.ok(geometry.width<=geometry.windowWidth+1,'no page-level horizontal overflow');
   const controls=await frame.locator('.canvas-controls').evaluate(bar=>{const box=e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};const host=bar.parentElement.querySelector('.canvas'),root=bar.ownerDocument.defaultView;return {bar:box(bar),host:box(host),viewport:[root.innerWidth,root.innerHeight],buttons:[...bar.querySelectorAll(':scope>button')].map(b=>({...box(b),name:b.getAttribute('aria-label'),svg:b.querySelectorAll('svg').length})),settings:box(bar.querySelector('.graph-settings-toggle'))};});
   assert.ok(controls.bar.bottom<=controls.host.bottom&&controls.bar.top>controls.host.top+controls.host.height/2);assert.ok(controls.bar.right<=controls.viewport[0]&&controls.bar.left>=0);assert.deepEqual(controls.buttons.map(b=>b.name),['表示設定を開く','配置ロック','縮小','拡大']);for(const button of controls.buttons){assert.ok(button.height>=40);assert.ok(button.svg>0);}assert.equal(controls.settings.width,width<=480?32:40);await page.screenshot({path:`web/evidence/shell/concept-${width}-${theme}.png`});
  }}
  if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();await page.locator('.explorer-search input').focus();await page.keyboard.press('Escape');assert.equal(await page.locator('#design-explorer').isVisible(),false);assert.equal(await page.locator('#node-list-toggle').evaluate(el=>el===document.activeElement),true);
  await page.locator('#tabs .tab button:first-child').first().click();await page.locator('#node-list-toggle').click();const hierarchy=await page.locator('#design-explorer').evaluate(el=>{const parent=el.querySelector('.explorer-parent'),sub=el.querySelector('.explorer-subparent'),item=el.querySelector('.explorer-item-nested');return {parentSize:getComputedStyle(parent).fontSize,subSize:getComputedStyle(sub).fontSize,subPadding:parseFloat(getComputedStyle(sub).paddingLeft),itemPadding:parseFloat(getComputedStyle(item).paddingLeft)};});assert.equal(hierarchy.parentSize,hierarchy.subSize);assert.ok(hierarchy.itemPadding>hierarchy.subPadding,'child entries remain visibly nested');await page.screenshot({path:'web/evidence/shell/business-drawer-393-dark.png'});
  const globalDrawer=await verifyGlobalRightDrawer(page);
  const unifiedConcept=await verifyUnifiedConcept(browser);
  const rightDrawer=await verifyRightDrawerUnification(browser);
  assert.deepEqual(errors,[]);return {checks:'shared tab row, concept canvas controls and zoom persistence, detail/Back/close, explorer Escape and hierarchy, light/dark 1280/393 geometry',pageErrors:errors,globalDrawer,unifiedConcept,rightDrawer};
 }finally{await context.close();}
}
