import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
import {withToolbarPage} from './test-toolbar-settings-browser.mjs';
import {openSourceAction} from './source-menu-browser.mjs';
const raw=readFileSync('../tools/fixtures/state-transitions/purchase-request.md','utf8');
export async function verifyStateTransitions(browser){
 mkdirSync('web/evidence/wiring',{recursive:true});const results=[];
 for(const width of [320,393,1280])results.push(await withToolbarPage(browser,{width,height:900},async(page,errors)=>{
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open-text').disabled);
  await openSourceAction(page,'open-text');await page.locator('#source-text').fill(raw);await page.locator('#source-submit').click();await page.waitForSelector('[data-node="購入申請"]');
  if(await page.locator('#check-followup').isVisible())await page.locator('#check-followup-later').click();
  const paths=await page.locator('#edges .edge').evaluateAll(es=>es.map(e=>[e.dataset.relation,e.getAttribute('d')]).sort((a,b)=>Number(a[0])-Number(b[0])));
  const choose=async()=>{if(!await page.locator('#node-list-drawer').isVisible())await page.locator('#node-list-toggle').click();await page.locator('#node-category-object').click();await page.locator('[data-list-node="購入申請"] .node-navigate').click();await page.locator('#node-list-close').click();if(!await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();};
  await choose();assert.equal(await page.locator('#detail h1').textContent(),' : 購入申請');assert.equal(await page.locator('[data-transition]').count(),0);await page.getByRole('tab',{name:'状態遷移',exact:true}).click();assert.equal(await page.locator('[data-transition]').count(),13);assert.equal(await page.locator('.state-diagram path[data-transitions]').count(),11);assert.doesNotMatch(await page.locator('.state-transition-panel').textContent(),/部分定義：|図は横にスクロールできます/);
  await page.locator('[data-state="申請済み"]').press('Enter');assert.equal(await page.locator('[data-state="申請済み"]').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('[data-state="購入済み"]').evaluate(e=>getComputedStyle(e).opacity),'1');
  const captions=await page.locator('[data-activity="備品購入を申請する"] tspan').evaluateAll(es=>es.map(e=>[e.textContent,e.classList.contains('review-related')]));assert.deepEqual(captions,[['備品購入を申請する',true],['・通常',true],['・例外：作業中断',false],['・例外：権限判定不成立',false]]);
  await page.locator('[data-state="下書き"]').press('Space');assert.equal(await page.locator('[data-state="下書き"]').getAttribute('aria-pressed'),'true');await page.locator('[data-state="下書き"]').press('Escape');assert.equal(await page.locator('.state-shape[aria-pressed=true]').count(),0);
  assert.deepEqual(await page.locator('#edges .edge').evaluateAll(es=>es.map(e=>[e.dataset.relation,e.getAttribute('d')]).sort((a,b)=>Number(a[0])-Number(b[0]))),paths);
  const geometry=await page.locator('.state-transition-panel').evaluate(e=>({width:e.clientWidth,content:e.scrollWidth,canvas:e.querySelector('.state-diagram-scroll').clientWidth}));assert.ok(geometry.width>=180);assert.ok(geometry.content<=geometry.width+1);assert.ok(geometry.canvas>0);
  for(const theme of ['light','dark']){if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();await page.locator('#detail').evaluate(e=>e.scrollTop=0);await page.screenshot({path:`web/evidence/wiring/real-state-transitions-${width}-${theme}.png`});}
  await page.getByText('操作の詳細（13）',{exact:true}).click();assert.ok(await page.locator('.state-transition-panel button').first().evaluate(e=>e.getBoundingClientRect().height>=44));await page.locator('.state-transition-panel button').first().press('Enter');assert.equal(await page.locator('#detail h1').textContent(),' 備品購入を申請する');assert.equal(await page.locator('.state-transition-panel').count(),0);
  await choose();await page.getByRole('tab',{name:'状態遷移',exact:true}).click();await page.waitForFunction(()=>['saved','unchanged'].includes(document.querySelector('#app').dataset.saveState));await page.reload();await page.waitForSelector('#detail-mode-states');await page.getByRole('tab',{name:'状態遷移',exact:true}).click();await page.waitForSelector('[data-transition]',{state:'attached'});assert.equal(await page.locator('[data-transition]').count(),13);assert.deepEqual(errors,[]);return {width,geometry,operations:13,reload:true};
 }));return results;
}
