import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
export async function verifyViewerShell(browser){
 const context=await browser.newContext({viewport:{width:1280,height:960}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto('http://127.0.0.1:4173/?view=concept&conceptFixture=purchase');
  await page.locator('.concept-frame').waitFor();
  const frame=page.frameLocator('.concept-frame');await frame.locator('.table').first().waitFor();
  assert.equal(await page.locator('.workspace-tabs [role=tab]').count(),2);
  assert.equal(await page.locator('.workspace-tabs .close').count(),0);
  await page.getByRole('button',{name:'購入申請版',exact:true}).click();
  await page.locator('.concept-detail-page h1').waitFor();
  assert.equal(await page.locator('.concept-detail-page h1').textContent(),'購入申請版');
  await page.locator('#area-business').click();assert.equal(await page.locator('#business-workspace').isVisible(),true);
  await page.locator('#area-concept').click();assert.equal(await page.locator('#concept-tab-version').getAttribute('aria-selected'),'true');
  await page.locator('#concept-tab-overview').click();await page.goBack();
  assert.equal(await page.locator('#concept-tab-version').getAttribute('aria-selected'),'true','browser Back restores the concept detail');
  await page.getByRole('button',{name:'購入申請版の詳細を閉じる',exact:true}).click();
  assert.equal(await page.locator('#concept-tab-version').count(),0);
  mkdirSync('web/evidence/shell',{recursive:true});
  for(const theme of ['light','dark']){
   if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();
   for(const width of [1280,393]){
    await page.setViewportSize({width,height:960});
    const geometry=await page.locator('#concept-workspace').evaluate(el=>{const r=el.getBoundingClientRect();return {bottom:r.bottom,width:document.documentElement.scrollWidth,windowWidth:innerWidth,height:innerHeight};});
    assert.ok(geometry.bottom<=geometry.height+1,'workspace fits the viewport');assert.ok(geometry.width<=geometry.windowWidth+1,'no page-level horizontal overflow');
    await page.screenshot({path:`web/evidence/shell/concept-${width}-${theme}.png`});
   }
  }
  await page.locator('#node-list-toggle').click();assert.equal(await page.locator('.concept-list').isVisible(),false);
  await page.locator('#node-list-toggle').click();await page.locator('.concept-search input').focus();await page.keyboard.press('Escape');
  assert.equal(await page.locator('.concept-list').isVisible(),false);assert.equal(await page.locator('#node-list-toggle').evaluate(el=>el===document.activeElement),true);
  assert.deepEqual(errors,[]);
  return {checks:'two levels, nonclosable upper tabs, concept detail in main, area restore, Back, close, drawer Escape/focus, light/dark 1280/393 geometry',pageErrors:errors};
 }finally{await context.close();}
}
