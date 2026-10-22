import assert from 'node:assert/strict';import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const dir='../work/json-state/issue-275/',raw=readFileSync(dir+'purchase.json','utf8'),md=readFileSync(dir+'supported-state.md','utf8'),pkg=JSON.parse(raw),st=pkg.documents[1],bd=pkg.documents[0];
export async function verifyJSONStates(browser){
 const results=[],out='web/evidence/json-states';mkdirSync(out,{recursive:true});
 for(const width of [1280,393]){const snapshots=[];
 for(const [format,source]of [['md',md],['json',raw]]){
  const context=await browser.newContext({viewport:{width,height:960}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const ready=()=>page.waitForFunction(()=>!document.querySelector('#open').disabled),saved=()=>page.waitForFunction(()=>['saved','unchanged'].includes(document.querySelector('#app')?.dataset.saveState));
  const select=async id=>{if(!await page.locator('#node-list-drawer').isVisible())await page.locator('#node-list-toggle').click();await page.locator('#node-category-object').click();await page.locator(`[data-list-node="${id}"] .node-navigate`).click();await page.locator('#node-list-close').click();if(!await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();};
  try{
   await page.goto('http://127.0.0.1:4173/');await ready();await page.locator('#fallback').setInputFiles({name:'states.'+format,mimeType:format==='json'?'application/json':'text/markdown',buffer:Buffer.from(source)});await page.locator('.node').first().waitFor();if(await page.locator('#check-followup').isVisible())await page.locator('#check-followup-later').click();await saved();
   await select(format==='json'?st.objectId:'購入申請');await page.locator('#detail-mode-states').click();await page.locator('.state-diagram').waitFor();
   assert.equal(await page.locator('[data-transition]').count(),13);assert.equal(await page.locator('[data-state]').count(),8);assert.equal(await page.locator('.state-diagram [stroke-dasharray]').count()>0,true);
   assert.equal(await page.locator('[data-state="申請済み"] rect').evaluate(e=>getComputedStyle(e).fill),'rgb(228, 244, 235)');
   const svg=await page.locator('.state-diagram').evaluate(e=>e.outerHTML);snapshots.push(svg);
   await page.screenshot({path:`${out}/${format}-states-${width}.png`});await page.locator('.state-transition-panel > details').first().locator('summary').click();assert.ok((await page.locator('[data-transition="T12"]').innerText()).includes('未決（設計課題）'));assert.ok((await page.locator('[data-transition="T07"]').innerText()).includes('申請内容の破棄'));
   await page.locator('[data-state="申請済み"]').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('[data-state="申請済み"]').getAttribute('aria-pressed'),'true');await page.keyboard.press('Escape');assert.equal(await page.locator('[data-state="申請済み"]').getAttribute('aria-pressed'),'false');await page.locator('[data-state="申請済み"]').press('Space');assert.equal(await page.locator('[data-state="申請済み"]').getAttribute('aria-pressed'),'true');
   for(const item of await page.locator('.state-diagram .muted').all())assert.equal(await item.evaluate(e=>getComputedStyle(e).opacity),'1');
   await page.screenshot({path:`${out}/${format}-selected-${width}.png`});
   await page.locator('[data-transition="T12"] button').click();assert.equal(await page.locator('#detail h1').innerText(),'購入を準備する');assert.equal(await page.locator('.node.selected').getAttribute('data-node'),format==='json'?bd.activities.find(a=>a.name==='購入を準備する').id:'購入を準備する');
   await select(format==='json'?st.objectId:'購入申請');await saved();await page.reload();await ready();assert.equal(await page.locator('#detail h1').innerText(),'購入申請');await page.locator('#detail-mode-states').click();assert.equal(await page.locator('.state-diagram').evaluate(e=>e.outerHTML),svg);
   const other=bd.objects.find(o=>o.id!==st.objectId);await select(format==='json'?other.id:other.name);assert.equal(await page.locator('#detail-mode-states').isDisabled(),true);assert.equal(await page.locator('.state-diagram').count(),0);
   assert.deepEqual(errors,[]);results.push({width,format,operations:13,states:8,partial:true,T12:'@unknown',keyboard:true,activityNavigation:true,reload:true,unknownObjectDisabled:true,pageErrors:errors});
  }catch(e){await page.screenshot({path:`${out}/failure-${format}-${width}.png`}).catch(()=>{});throw e;}finally{await context.close();}
 }
 assert.equal(snapshots[0],snapshots[1],'MD/JSON SVG coordinates, routes, labels and controls must be identical');
 }
 writeFileSync(out+'/results.json',JSON.stringify({browser:browser.version(),results,svgExact:true},null,2));return {results,svgExact:true};
}
