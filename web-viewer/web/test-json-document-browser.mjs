import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {openSourceAction} from './source-menu-browser.mjs';

const raw=readFileSync('../work/plugin-json/issue-273/snapshots/04-final-after-replay.json','utf8');
const pkg=JSON.parse(raw),bd=pkg.documents[0],checks=pkg.documents[1];
export async function verifyJSONDocuments(browser){
 const results=[],out='web/evidence/json-document';mkdirSync(out,{recursive:true});
 for(const width of [1280,393]){
  const context=await browser.newContext({viewport:{width,height:960}}),page=await context.newPage(),errors=[],requests=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.method()!=='GET')requests.push(r.method()+' '+r.url());});
  const saved=()=>page.waitForFunction(()=>['saved','unchanged'].includes(document.querySelector('#app')?.dataset.saveState));
  const shot=name=>page.screenshot({path:`${out}/${name}-${width}.png`});
  try{
   await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);
   await page.locator('#fallback').setInputFiles({name:'gate-b.json',mimeType:'application/json',buffer:Buffer.from(raw)});
   await page.locator('.node').first().waitFor();if(await page.locator('#check-followup').isVisible())await page.locator('#check-followup-later').click();await saved();
   assert.equal(await page.locator('.node').count(),6);assert.equal(await page.locator('.edge').count(),6);
   assert.deepEqual((await page.locator('.node').evaluateAll(ns=>ns.map(n=>n.dataset.node))).sort(),[...bd.objects,...bd.activities].map(n=>n.id).sort());
   await shot('overview');
   if(!await page.locator('#node-list-drawer').isVisible())await page.locator('#node-list-toggle').click();
   const activity=bd.activities[0];await page.locator(`[data-list-node="${activity.id}"] .node-navigate`).click();
   await shot('activity-list');if(await page.locator('#node-list-drawer').isVisible())await page.locator('#node-list-close').click();
   if(!await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
   assert.equal(await page.locator('#detail h1').textContent(),activity.name);for(const line of activity.procedure.split('\n'))assert.ok((await page.locator('#detail').innerText()).includes(line.replace(/^\d+\. /,'')));await shot('activity-detail');
   await page.locator('#detail-mode-checks').click();assert.equal(await page.locator('.check-item').count(),2);
   assert.ok((await page.locator('.json-checks').innerText()).includes('意味対応は未確認'));
   const item=page.locator('[data-check-id="CI-001"]');assert.ok((await item.innerText()).includes('確認済み'));
   await item.locator('summary').filter({hasText:'CI-001の一般保証'}).click();await item.locator('table').waitFor({state:'visible'});assert.ok((await item.innerText()).includes('必須不足'));
   assert.ok((await page.locator('[data-check-id="CI-Q01"]').innerText()).includes('要確認'));await shot('checks-guarantee-example');
   for(const linked of bd.activities.slice(1)){
    if(!await page.locator('#node-list-drawer').isVisible())await page.locator('#node-list-toggle').click();await page.locator(`[data-list-node="${linked.id}"] .node-navigate`).click();if(await page.locator('#node-list-drawer').isVisible())await page.locator('#node-list-close').click();if(!await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();await page.locator('#detail-mode-checks').click();const shared=page.locator('.json-checks > .check-item[data-check-id="CI-003"]');assert.equal(await shared.getAttribute('data-element-id'),checks.items.find(i=>i.checkId==='CI-003').id);assert.ok((await shared.innerText()).includes('要確認'));await shared.locator('summary').filter({hasText:'CI-003の一般保証'}).click();assert.ok((await shared.innerText()).includes('受付番号を保持'));await shot('shared-check-'+bd.activities.indexOf(linked));
   }
   if(!await page.locator('#node-list-drawer').isVisible())await page.locator('#node-list-toggle').click();await page.locator(`[data-list-node="${activity.id}"] .node-navigate`).click();if(await page.locator('#node-list-drawer').isVisible())await page.locator('#node-list-close').click();if(!await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
   await page.locator('#detail-mode-business').click();await page.locator(`.node[data-activity="${activity.id}"] .activity-open`).first().press('Enter');await saved();
   assert.equal(await page.locator('.tab').count(),2);assert.ok((await page.locator('.tab.active').innerText()).includes(activity.name));
   await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);assert.equal(await page.locator('.tab').count(),2);assert.equal(await page.locator('#detail h1').textContent(),activity.name);
   await page.locator('.tab').first().locator('button').first().click();
   await page.locator(`.finding-badges[aria-label="${bd.activities[2].name}の指摘を開く"]`).press('Enter');
   assert.ok((await page.locator('#node-list').innerText()).includes('通知媒体'));assert.ok((await page.locator('#node-list').innerText()).includes(bd.activities[2].name));await shot('findings');
   await saved();assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
   results.push({width,localFile:true,nodes:6,relations:6,list:true,activityDetail:true,checkStates:checks.items.map(i=>[i.checkId,i.reviewState]),sharedGuaranteeAndExample:true,findings:true,detailTabAndReload:true,nonGETRequests:requests,pageErrors:errors});
  }catch(error){await shot('failure').catch(()=>{});throw error;}finally{await context.close();writeFileSync(`${out}/smoke-results.json`,JSON.stringify({browser:browser.version(),results},null,2));}
 }
 return {browser:browser.version(),results};
}
