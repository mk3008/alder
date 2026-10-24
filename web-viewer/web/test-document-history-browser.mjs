import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {openSourceAction} from './source-menu-browser.mjs';

/** Native history/IDB boundary only; geometry belongs to existing layout cases. */
export async function verifyDocumentHistory(browser){
 const md=readFileSync('web/authorities/business-design.md','utf8'),json=readFileSync('../work/plugin-json/issue-273/snapshots/04-final-after-replay.json','utf8'),results=[];
 for(const [format,source,mime,count]of [['md',md,'text/markdown',18],['json',json,'application/json',6]]){
  const context=await browser.newContext({viewport:{width:393,height:960}}),page=await context.newPage(),errors=[];let broken=false;
  const url='https://loader-fixture.test/design.'+format;
  page.on('pageerror',e=>errors.push(e.message));
  await context.route(url,route=>route.fulfill({headers:{'content-type':mime,'access-control-allow-origin':'*'},body:broken?'{broken':source}));
  const saved=()=>page.waitForFunction(()=>['saved','unchanged'].includes(document.querySelector('#app')?.dataset.saveState));
  const leave=async()=>{await openSourceAction(page,'open-text');await page.locator('#source-text').fill(md);await page.locator('#source-submit').click();await page.locator('#source-dialog').waitFor({state:'hidden'});if(await page.locator('#check-followup').isVisible())await page.locator('#check-followup-later').click();await saved();};
  const history=async()=>{if(!await page.locator('#source-menu').isVisible())await page.locator('#open-menu-toggle').click();await page.locator('#url-history button').first().click();};
  try{
   await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);
   await openSourceAction(page,'open-url');await page.locator('#source-url').fill(url);await page.locator('#source-submit').click();await page.locator('#source-dialog').waitFor({state:'hidden'});if(await page.locator('#check-followup').isVisible())await page.locator('#check-followup-later').click();await saved();
   assert.equal(await page.locator('.node').count(),count);await leave();await history();
   await page.waitForFunction(count=>document.querySelectorAll('.node').length===count,count);await page.waitForFunction(()=>!document.querySelector('#open-url').disabled);await saved();
   assert.equal(await page.locator('#url-history button').count(),1);await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);assert.equal(await page.locator('.node').count(),count);
   await leave();broken=true;const before=await page.locator('#nodes').innerHTML();await history();await page.locator('#status-text').filter({hasText:'履歴のURLを開けません'}).waitFor();assert.equal(await page.locator('#nodes').innerHTML(),before);
   assert.deepEqual(errors,[]);results.push({format,mime,newURL:true,history:true,reload:true,failureRetainsDisplay:true});
   await page.screenshot({path:'web/evidence/json-document/history-'+format+'-393.png'});
  }finally{await context.close();}
 }
 writeFileSync('web/evidence/json-document/history-results.json',JSON.stringify(results,null,2));return results;
}
