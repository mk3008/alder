import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
export async function verifyViewerShell(browser){
 const context=await browser.newContext({viewport:{width:1280,height:960}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  await page.goto('http://127.0.0.1:4173/?view=concept&conceptFixture=purchase');
  await page.locator('.concept-frame').waitFor();
  const frame=page.frameLocator('.concept-frame');await frame.locator('#overview .table').first().waitFor();await frame.locator('.graph-settings-toggle svg').waitFor();
  const lock=frame.locator('.layout-lock'),locked=await lock.getAttribute('aria-pressed');await lock.click();assert.notEqual(await lock.getAttribute('aria-pressed'),locked);await lock.click();
  await frame.locator('.graph-settings-toggle').click();await frame.getByRole('button',{name:'レイアウトを初期値に戻す',exact:true}).waitFor();await frame.locator('.graph-settings-toggle').press('Escape');assert.equal(await frame.locator('.graph-settings-toggle').getAttribute('aria-expanded'),'false');
  await frame.getByRole('button',{name:'縮小',exact:true}).click();const zoom=await frame.locator('.zoom-value').textContent();
  const clearance=await frame.locator('.canvas').evaluate(host=>{const saved=[host.scrollLeft,host.scrollTop];host.scrollTop=host.scrollHeight;const bottom=host.querySelector('.node[data-table=\"line\"]').getBoundingClientRect().bottom,toolbarTop=host.parentElement.querySelector('.canvas-controls').getBoundingClientRect().top;host.scrollTo(...saved);return {bottom,toolbarTop};});assert.ok(clearance.bottom<clearance.toolbarTop,'last concept remains above the floating toolbar at the bottom of scroll');
  await frame.getByRole('button',{name:'購入申請版の説明へ移動',exact:true}).click();await page.locator('.concept-detail-page h1').waitFor();
  await page.locator('#concept-tab-overview').click();assert.equal(await frame.locator('.zoom-value').textContent(),zoom,'canvas zoom survives detail navigation');
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
    const controls=await frame.locator('.canvas-controls').evaluate(bar=>{const box=e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};const host=bar.parentElement.querySelector('.canvas'),root=bar.ownerDocument.defaultView;return {bar:box(bar),host:box(host),viewport:[root.innerWidth,root.innerHeight],buttons:[...bar.querySelectorAll(':scope>button')].map(b=>({...box(b),name:b.getAttribute('aria-label'),svg:b.querySelectorAll('svg').length})),settings:box(bar.querySelector('.graph-settings-toggle'))};});
    assert.ok(controls.bar.bottom<=controls.host.bottom&&controls.bar.top>controls.host.top+controls.host.height/2,'toolbar floats at the bottom of the canvas');assert.ok(controls.bar.right<=controls.viewport[0]&&controls.bar.left>=0);assert.deepEqual(controls.buttons.map(b=>b.name),['表示設定を開く','配置ロック','縮小','拡大']);for(const button of controls.buttons){assert.ok(button.height>=40);assert.ok(button.svg>0);}assert.equal(controls.settings.width,width<=480?32:40);
    await page.screenshot({path:`web/evidence/shell/concept-${width}-${theme}.png`});
   }
  }
  await page.locator('#node-list-toggle').click();assert.equal(await page.locator('.concept-list').isVisible(),false);
  await page.locator('#node-list-toggle').click();await page.locator('.concept-search input').focus();await page.keyboard.press('Escape');
  assert.equal(await page.locator('.concept-list').isVisible(),false);assert.equal(await page.locator('#node-list-toggle').evaluate(el=>el===document.activeElement),true);
  await page.locator('#area-business').click();await page.locator('#open-sample').click();
  await page.locator('#check-followup-later').click();await page.locator('#node-list-toggle').click();
  const spacing=await page.locator('#node-list-drawer').evaluate(el=>{const box=s=>el.querySelector(s).getBoundingClientRect();return {heading:box('.node-list-heading').bottom,modesTop:box('#drawer-modes').top,modesBottom:box('#drawer-modes').bottom,categoriesTop:box('#node-categories').top,categoriesBottom:box('#node-categories').bottom,searchTop:box('#node-list-search').top};});
  assert.ok(Math.abs(spacing.heading-spacing.modesTop)<1);assert.ok(Math.abs(spacing.modesBottom-spacing.categoriesTop)<1);assert.ok(Math.abs(spacing.searchTop-spacing.categoriesBottom-8)<1,'search follows tabs at 8px');
  await page.screenshot({path:'web/evidence/shell/business-drawer-393-dark.png'});
  assert.deepEqual(errors,[]);
  return {checks:'two levels, nonclosable upper tabs, concept detail in main, area restore, Back, close, drawer Escape/focus, light/dark 1280/393 geometry',pageErrors:errors};
 }finally{await context.close();}
}
