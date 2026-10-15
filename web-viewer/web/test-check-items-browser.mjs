import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
export async function verifyRelatedChecks(browser){
 const bd=readFileSync('../business-design/purchase-request/README.md','utf8'),check=readFileSync('../docs/examples/purchase-check-review.ja.md','utf8'),results=[];
 for(const width of [1280,393,320]){
  const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage(),errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:4173/'))requests.push(r.url());});
  try{
   await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);
   const load=async(name,raw)=>{await page.locator('#check-file').setInputFiles({name,mimeType:'text/markdown',buffer:Buffer.from(raw)});await page.waitForFunction(()=>!document.querySelector('#detail').textContent.includes('読み込み・保存しています'));};
   await page.locator('#fallback').setInputFiles({name:'purchase.md',mimeType:'text/markdown',buffer:Buffer.from(bd)});await page.locator('#check-open').waitFor();
   const nodes=await page.locator('.node').count(),positions=await page.locator('.node').evaluateAll(ns=>ns.map(n=>[n.dataset.node,n.style.left,n.style.top]));
   await load('checks.md',check);await page.locator('#check-confirm').click();await page.locator('#check-confirm').waitFor({state:'detached'});assert.equal(await page.locator('.tab').count(),1);
   const select=async name=>{if(!await page.locator('#node-list-drawer').isVisible())await page.locator('#node-list-toggle').click();await page.locator(`[data-list-node="${name}"] .node-navigate`).click();};
   await select('購入申請を承認する');await page.locator('[data-check-id="JA-EX-Q01"]').waitFor();assert.match(await page.locator('[data-check-id="JA-EX-Q01"]').textContent(),/人間レビュー状態：要確認/);
   await select('購入申請を却下する');assert.equal(await page.locator('[data-check-id="JA-EX-04"]').count(),1);await select('承認済み備品を購入する');assert.equal(await page.locator('[data-check-id="JA-EX-04"]').count(),1);
   await load('invalid.md','not a Check');assert.equal(await page.locator('[data-check-id="JA-EX-04"]').count(),1);assert.match(await page.locator('#detail').textContent(),/読み込めません/);
   assert.equal(await page.locator('.node').count(),nodes);assert.deepEqual(await page.locator('.node').evaluateAll(ns=>ns.map(n=>[n.dataset.node,n.style.left,n.style.top])),positions);
   await page.locator('#detail-mode-business').click();assert.ok(await page.locator('#detail>.markdown').count());await page.locator('#detail-mode-checks').click();
   const dimensions=await page.locator('#detail').evaluate(e=>({width:e.clientWidth,scrollWidth:e.scrollWidth}));assert.ok(dimensions.scrollWidth<=dimensions.width+2,'Check content stays inside Drawer');
   if(await page.locator('#node-list-drawer').isVisible())await page.locator('#node-list-close').click();
   mkdirSync('web/evidence/related-checks',{recursive:true});await page.screenshot({path:`web/evidence/related-checks/${width}.png`});
   await page.waitForFunction(()=>document.querySelector('#app').dataset.saveState==='saved');await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('#detail-mode-checks').click();assert.equal(await page.locator('[data-check-id="JA-EX-04"]').count(),1);
   await page.getByRole('button',{name:'関連Checkを解除',exact:true}).click();await page.waitForFunction(()=>!document.querySelector('#detail').textContent.includes('読込済み:'));assert.equal(await page.locator('.node').count(),nodes);
   assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);results.push({width,shared:true,unresolved:true,failedReadPreserved:true,restoreAndDetach:true,geometry:dimensions});
  }finally{await context.close();}
 }
 return {checks:results,limits:['Synthetic native file inputs; OS chooser and physical devices are not covered.']};
}
