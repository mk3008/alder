import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';

export async function verifyGlobalRightDrawer(page){
 const right=page.locator('#drawer'),concept=page.locator('.concept-related'),business=page.locator('#formattedMarkdownDrawer');
 const explorer=page.locator('#design-explorer');
 const showExplorer=async()=>{if(!await explorer.isVisible())await page.locator('#node-list-toggle').click();};
 const open=async value=>{if((await right.getAttribute('aria-expanded')==='true')!==value)await right.click();};
 const choose=async id=>{await showExplorer();await page.locator('[data-explorer-key="'+id+'"]').click();};
 const saved=()=>page.waitForFunction(()=>['saved','unchanged'].includes(document.querySelector('#app')?.dataset.saveState));
 await page.setViewportSize({width:1280,height:960});await choose('business:overview');await open(true);assert(await business.isVisible());
 for(const id of ['landscape','overview','request','group-request']){await choose('concept:'+id);assert(await concept.isVisible(),'app open survives '+id);}
 await page.locator('.concept-related .shell-heading button').click();await choose('business:overview');assert.equal(await business.isVisible(),false,'concept close applies to business');await open(true);await choose('concept:group-request');assert(await concept.isVisible());
 const frame=page.frameLocator('iframe[data-concept-view=group-request]');await frame.locator('[data-node=request]').waitFor();await open(false);await frame.locator('[data-node=request] .concept-select').click();await frame.locator('[data-node=request].selected').waitFor();await page.waitForFunction(()=>document.querySelector('.concept-related .shell-heading strong')?.textContent==='購入申請');assert.equal(await concept.isVisible(),false,'selection preserves closed preference');await open(true);
 await page.locator('[data-sample=request-submitted]').click();await choose('concept:overview');await open(false);await page.goBack();await page.waitForFunction(()=>new URL(location.href).searchParams.get('concept')==='group-request');assert.equal(await concept.isVisible(),false,'sample history cannot reopen the app drawer');assert.equal(await page.locator('.data-examples-panel').getAttribute('data-data-example'),'request-submitted');await page.goForward();assert.equal(await concept.isVisible(),false);
 await choose('concept:group-request');await page.locator('#concept-tab-group-request').locator('..').locator('.close').click();await choose('concept:group-request');assert.equal(await concept.isVisible(),false,'tab reopen does not reset preference');
 await open(true);await showExplorer();await page.locator('#explorer-states .explorer-item').first().click();assert.equal(await concept.isVisible(),false);assert.equal(await business.isVisible(),false);assert(await right.isDisabled());await choose('concept:group-request');assert(await concept.isVisible(),'state page does not reset preference');
 for(const wanted of [false,true]){await open(wanted);await saved();await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled&&document.querySelectorAll('#explorer-business-activity .explorer-item').length>0&&!document.querySelector('#drawer').disabled);assert.equal(await concept.isVisible(),wanted,'native reload restores global preference');await choose('business:overview');assert.equal(await business.isVisible(),wanted);await choose('concept:group-request');assert.equal(await concept.isVisible(),wanted);}
 mkdirSync('web/evidence/shell',{recursive:true});const geometry=[];
 for(const theme of ['light','dark']){if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();for(const width of [1280,393]){
  await page.setViewportSize({width,height:960});
  for(const kind of ['business','concept']){
   await choose(kind==='business'?'business:overview':'concept:group-request');await open(true);await showExplorer();
   const result=await page.evaluate(kind=>{const pane=document.querySelector(kind==='business'?'#formattedMarkdownDrawer':'.concept-related'),left=document.querySelector('#design-explorer'),strip=document.querySelector('.tab-strip'),workbench=document.querySelector('.shell-workbench'),box=e=>{const r=e.getBoundingClientRect();return{top:r.top,bottom:r.bottom,left:r.left,right:r.right};};return{pane:box(pane),left:box(left),strip:box(strip),workbench:box(workbench),peer:pane.parentElement===workbench,overflow:document.documentElement.scrollWidth>innerWidth};},kind);
   assert(result.peer);assert(Math.abs(result.pane.top-result.left.top)<=1,'both rails share top');assert(Math.abs(result.pane.top-result.strip.top)<=1,'right rail extends alongside tabs');assert(Math.abs(result.pane.bottom-result.workbench.bottom)<=1,'right rail fills workbench height');if(width>800)assert(result.strip.right<=result.pane.left+1,'desktop tabs stop before the right rail');assert.equal(result.overflow,false);
   await page.screenshot({path:`web/evidence/shell/global-drawer-${kind}-${width}-${theme}.png`});geometry.push({kind,width,theme,...result});
  }
 }}
 await page.setViewportSize({width:1280,height:960});await choose('concept:group-request');await open(false);
 return {checks:'GLOBAL-DRAWER-001..004: app-wide both directions, sample/history and tab reopen, unsupported state page, native preference reload, workbench peers and tab-height rails, 393/1280 light/dark',geometry};
}
