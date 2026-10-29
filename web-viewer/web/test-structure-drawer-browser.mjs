import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';

export async function verifyStructureDrawer(page){
 await page.setViewportSize({width:1280,height:960});
 const drawer=page.locator('.concept-related');
 for(const id of ['group-request','group-decision','group-handoff','group-result']){
  await page.locator('[data-explorer-key="concept:'+id+'"]').click();
  await page.frameLocator('iframe[data-concept-view="'+id+'"]').locator('.node').first().waitFor();
  assert.equal(await page.locator('.concept-main .data-example-modes,.concept-main h1').count(),0);
  if(!await drawer.isVisible())await page.locator('#drawer').click();
  assert.equal(await page.locator('.concept-overview-section').getAttribute('open'),'');
  assert(await page.locator('.data-review-overview .review-owner').isVisible());
  assert.equal(await page.locator('.data-review-overview .review-related-activities button:not(:disabled)').count()>0,true);
 }
 await page.locator('[data-explorer-key="concept:group-request"]').click();
 if(await drawer.isVisible())await page.locator('#drawer').click();
 const graph=page.frameLocator('iframe[data-concept-view=group-request]');
 await graph.locator('[data-node=request] .concept-select').click();assert.equal(await drawer.isVisible(),false,'shape selection keeps drawer closed');await page.locator('#drawer').click();
 assert.equal(await page.locator('.concept-related-content').textContent().then(s=>s.includes('申請者')),true);
 await page.locator('[data-sample=request-submitted]').click();
 assert.equal(await page.locator('.concept-examples-section').getAttribute('open'),'');
 assert.equal(await page.locator('iframe[data-concept-view=group-request]').isVisible(),true);
 const zoom=await graph.locator('.zoom-value').textContent();await graph.locator('.zoom-in').click();assert.notEqual(await graph.locator('.zoom-value').textContent(),zoom,'canvas zoom works during example review');
 await graph.locator('[data-node=item] .concept-select').click();assert.equal(await page.locator('.data-examples-panel').getAttribute('data-data-example'),'request-submitted');assert.match(await page.locator('.concept-related-content').textContent(),/依頼数量/);assert.match(await page.locator('.concept-page-details').textContent(),/申請者/);
 const separator=page.getByRole('separator',{name:'補足情報の幅'});await separator.focus();const before=Number(await separator.getAttribute('aria-valuenow'));await separator.press('ArrowLeft');assert.equal(Number(await separator.getAttribute('aria-valuenow')),before+40);
 const point=await separator.boundingBox();await page.mouse.move(point.x+point.width/2,point.y+40);await page.mouse.down();await page.mouse.move(point.x-80,point.y+40,{steps:5});await page.mouse.up();assert(Number(await separator.getAttribute('aria-valuenow'))>before+40,'pointer expands drawer');
 await separator.press('Home');assert.equal(Number(await separator.getAttribute('aria-valuenow')),280);
 const table=page.locator('.data-example-table').filter({has:page.locator('table')}).last();await table.scrollIntoViewIfNeeded();const tableScroll=await table.evaluate(el=>{el.scrollLeft=el.scrollWidth;return{left:el.scrollLeft,width:el.clientWidth,content:el.scrollWidth};});assert(tableScroll.content>tableScroll.width&&tableScroll.left>0,'table can scroll independently');
 await page.reload();await page.frameLocator('iframe[data-concept-view=group-request]').locator('.node').first().waitFor();assert.equal(await drawer.isVisible(),true);assert.equal(await page.locator('.data-examples-panel').getAttribute('data-data-example'),'request-submitted');assert.equal(Number(await separator.getAttribute('aria-valuenow')),280);
 mkdirSync('web/evidence/shell',{recursive:true});
 for(const theme of ['light','dark']){if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();for(const width of [1280,393]){
  await page.setViewportSize({width,height:960});if(await page.locator('#design-explorer').isVisible()&&width===393)await page.locator('#node-list-toggle').click();await separator.focus();await separator.press('End');
  const bounds=await drawer.boundingBox();assert(bounds.x>=0&&bounds.x+bounds.width<=width+1,'drawer fits viewport');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert(await page.locator('iframe[data-concept-view=group-request]').isVisible());await page.screenshot({path:`web/evidence/shell/structure-drawer-${width}-${theme}.png`});
 }}
 await page.setViewportSize({width:1280,height:960});await page.locator('.concept-related .shell-heading button').click();assert.equal(await drawer.isVisible(),false);await graph.locator('[data-node=version] .concept-select').click();assert.equal(await drawer.isVisible(),false);await page.locator('#drawer').click();assert.match(await page.locator('.concept-related-content').textContent(),/未確定／確定/);
 const sampleURL=new URL(page.url());assert.equal(sampleURL.searchParams.get('dataExample'),'request-submitted');
 await page.locator('.concept-examples-section>summary').click();await page.waitForFunction(()=>!new URL(location.href).searchParams.has('dataExample'));await page.goBack();await page.waitForFunction(()=>new URL(location.href).searchParams.get('dataExample')==='request-submitted');assert.equal(await page.locator('.concept-examples-section').getAttribute('open'),'');await page.goForward();assert.equal(await page.locator('.concept-examples-section').getAttribute('open'),null);
 if(await drawer.isVisible())await page.locator('#drawer').click();if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();await page.locator('[data-explorer-key="concept:landscape"]').click();
 return {checks:'STRUCTURE-SHELL-001..005: four graph-first pages, manual drawer, overview/sample separation, selection during samples, pointer/keyboard width, table scroll, persistence, Back/Forward, 1280/393 light/dark'};
}
