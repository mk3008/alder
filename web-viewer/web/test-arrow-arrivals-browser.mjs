import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
import {withToolbarPage} from './test-toolbar-settings-browser.mjs';
import {openSourceAction} from './source-menu-browser.mjs';
const raw=readFileSync('../tools/fixtures/arrow-arrivals/purchase-request.md','utf8');
export async function verifyArrowArrivals(browser){
 mkdirSync('web/evidence/wiring',{recursive:true});const results=[];
 for(const width of [320,393,1280])results.push(await withToolbarPage(browser,{width,height:900},async(page,errors)=>{
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open-text').disabled);
  await openSourceAction(page,'open-text');await page.locator('#source-text').fill(raw);await page.locator('#source-submit').click();await page.waitForFunction(()=>document.querySelectorAll('.node').length===12);
  if(await page.locator('#check-followup').isVisible())await page.locator('#check-followup-later').click();
  if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
  const measure=()=>page.evaluate(()=>[...document.querySelectorAll('.edge')].map(e=>{
   const commands=[...e.getAttribute('d').matchAll(/([MLQ])([^MLQ]+)/g)],end=commands.at(-1)[2].trim().split(/[ ,]+/).map(Number),previous=commands.at(-2)[2].trim().split(/[ ,]+/).map(Number).slice(-2),length=e.getTotalLength(),run=Math.hypot(end[0]-previous[0],end[1]-previous[1]),point=e.getPointAtLength(Math.max(0,length-Math.min(24,run)));
   const marker=document.querySelector(e.getAttribute('marker-end').replace('url(','').replace(')',''));
   return {title:e.querySelector('title').textContent,run,end,previous,native:[point.x,point.y],markerWidth:+marker.getAttribute('markerWidth'),stroke:parseFloat(getComputedStyle(e).strokeWidth),related:e.classList.contains('review-related')};
  }));
  for(let i=0;i<5;i++)await page.locator('#out').click();
  await page.locator('.node[data-node="購入申請を承認する"]').click();
  const modes=[];
  for(const theme of ['light','dark']){
   if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();
   const edges=await measure(),yellow=edges.find(e=>e.title.startsWith('購入申請を承認する → 購入申請を再申請・破棄する:')),green=edges.find(e=>e.title.startsWith('購入申請を承認する → 購入申請:'));
   assert.equal(edges.length,23);assert.ok(yellow.related&&green.related);assert.ok(yellow.run>=24);assert.ok(yellow.run>=green.run,'marked yellow arrival is at least as long as green');assert.ok(yellow.run>yellow.markerWidth*yellow.stroke,'whole highlighted marker fits within straight segment');assert.ok(Math.abs(yellow.native[1]-yellow.end[1])<.01);assert.ok(yellow.native[0]>yellow.end[0]);
   await page.screenshot({path:`web/evidence/wiring/real-arrow-arrivals-${width}-${theme}.png`});modes.push({theme,yellow,green});
  }
  await page.locator('.node[data-node="購入申請を再申請・破棄する"] .activity-open').click();
  const detail=await measure(),arrivals=detail.filter(e=>e.title.startsWith('備品購入を申請する → 購入申請を再申請・破棄する:')||e.title.startsWith('購入申請を承認する → 購入申請を再申請・破棄する:'));
  assert.equal(arrivals.length,2);for(const e of arrivals)assert.ok(e.run>=24);assert.deepEqual(errors,[]);return {width,modes,detailExceptionRuns:arrivals.map(e=>e.run)};
 }));return results;
}
