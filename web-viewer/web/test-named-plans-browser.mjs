import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {openExplorerGroup} from './explorer-browser.mjs';
import {showTestChecks} from './test-spec-explorer-browser.mjs';

const raw=readFileSync('public/named-plans-example.json','utf8');
export async function verifyNamedPlans(browser){
 const results=[];
 for(const width of [1280,393,320]){
  const context=await browser.newContext({viewport:{width,height:960}}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  const ready=()=>page.waitForFunction(()=>!document.querySelector('#open').disabled);
  const saved=()=>page.waitForFunction(()=>['saved','unchanged'].includes(document.querySelector('#app')?.dataset.saveState));
  const choose=async(id,label)=>{await page.locator('#plan-select').selectOption(id);await page.locator('.node .node-name').filter({hasText:label+'の受付を行う'}).waitFor();await saved();assert.equal(await page.locator('#plan-select').inputValue(),id);};
  const openGroup=async group=>{if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();await openExplorerGroup(page,group);};
  try{
   await page.goto('http://127.0.0.1:4173/');await ready();
   await page.locator('#fallback').setInputFiles({name:'plans.json',mimeType:'application/json',buffer:Buffer.from(raw)});
   await page.locator('.node .node-name').filter({hasText:'現行案の受付を行う'}).waitFor();await saved();
   assert.equal(await page.locator('#plan-select').inputValue(),'current');assert.equal(await page.locator('#plan-select option').count(),3);
   await page.locator('.node[data-activity="activity"] .activity-open').first().press('Enter');await saved();assert.equal(await page.locator('#tabs .tab').count(),2);
   await choose('improved','改善案');assert.equal(await page.locator('#tabs .tab').count(),1);assert.equal(await page.locator('#nodes .node.selected').count(),0);
   await showTestChecks(page,'activity');assert.match(await page.locator('#tests-workspace').innerText(),/改善案の記録を確認する/);assert.doesNotMatch(await page.locator('#tests-workspace').innerText(),/現行案の記録を確認する/);
   await openGroup('states');await page.locator('[data-explorer-key="states:object"]').click();await page.locator('.state-diagram').waitFor();assert.match(await page.locator('.state-diagram').textContent(),/改善案受付済み/);
   await choose('alternative','提案A');assert.equal(await page.locator('#states-workspace').isVisible(),false);
   await openGroup('concept');await page.locator('[data-explorer-key="concept:overview"]').click();
   const frame=page.frameLocator('iframe[data-concept-view="overview"]');await frame.locator('#overview').waitFor();assert.match(await frame.locator('#overview').innerText(),/提案Aの受付記録/);
   await choose('improved','改善案');await page.reload();await ready();assert.equal(await page.locator('#plan-select').inputValue(),'improved');assert.match(await page.locator('#nodes').innerText(),/改善案の受付を行う/);
   const invalid=JSON.parse(raw);invalid.plans[2].package.documents[0].relations[0].toId='missing';
   await page.locator('#fallback').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(invalid))});
   await page.locator('#status-text').filter({hasText:'Plan alternative'}).waitFor();assert.equal(await page.locator('#plan-select').inputValue(),'improved');assert.match(await page.locator('#nodes').innerText(),/改善案の受付を行う/);
   await choose('current','現行案');assert.equal(await page.locator('#plan-select').isVisible(),true);
   const box=await page.locator('#plan-select').boundingBox();assert.ok(box&&box.x>=0&&box.x+box.width<=width,'plan selector remains visible in the header');
   const header=await page.locator('header').evaluate(root=>({client:root.clientWidth,scroll:root.scrollWidth,actions:[...root.querySelectorAll(':scope > button, :scope > a')].map(node=>{const r=node.getBoundingClientRect();return {left:r.left,right:r.right};})}));
   assert.ok(header.scroll<=header.client,'header does not overflow');for(const action of header.actions)assert.ok(action.left>=0&&action.right<=width,'existing header actions remain visible');
   assert.deepEqual(errors,[]);results.push({width,threePlans:true,sharedIDs:true,checks:true,state:true,concept:true,resetViews:true,reload:true,invalidKeepsDisplay:true});
  }finally{await context.close();}
 }
 const context=await browser.newContext({viewport:{width:1280,height:960}}),page=await context.newPage(),errors=[];
 page.on('pageerror',error=>errors.push(error.message));let response=raw;
 await page.route('https://example.test/named-plans.json',route=>route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:response}));
 try{
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);
  await page.locator('#open-menu-toggle').click();await page.locator('#open-url').click();await page.locator('#source-url').fill('https://example.test/named-plans.json');await page.locator('#source-submit').click();
  await page.locator('.node .node-name').filter({hasText:'現行案の受付を行う'}).waitFor();await page.locator('#plan-select').selectOption('improved');await page.locator('.node .node-name').filter({hasText:'改善案の受付を行う'}).waitFor();
  await page.waitForFunction(()=>['saved','unchanged'].includes(document.querySelector('#app')?.dataset.saveState));
  await page.locator('#refresh').click();await page.waitForFunction(()=>!document.querySelector('#refresh').disabled);assert.equal(await page.locator('#plan-select').inputValue(),'improved');
  const missing=JSON.parse(raw);missing.plans=missing.plans.filter(plan=>plan.id!=='improved');response=JSON.stringify(missing);
  await page.locator('#refresh').click();await page.locator('#status-text').filter({hasText:'指定した業務案がありません'}).waitFor();assert.equal(await page.locator('#plan-select').inputValue(),'improved');
  response=JSON.stringify(JSON.parse(raw).plans[0].package);await page.locator('#refresh').click();await page.locator('#plan-select').waitFor({state:'detached'});assert.match(await page.locator('#nodes').innerText(),/現行案の受付を行う/);assert.equal(await page.locator('#tabs .tab').count(),1);
  response=raw;await page.locator('#refresh').click();await page.locator('#plan-select').waitFor();assert.equal(await page.locator('#plan-select').inputValue(),'current');
  await page.locator('#open-menu-toggle').click();await page.locator('#open-sample-menu').click();await page.locator('#open-menu-toggle').click();await page.locator('#url-history button').first().click();
  await page.locator('.node .node-name').filter({hasText:'現行案の受付を行う'}).waitFor();assert.equal(await page.locator('#plan-select').inputValue(),'current');assert.deepEqual(errors,[]);
 }finally{await context.close();}
 const damaged=await browser.newContext(),restorePage=await damaged.newPage();
 try{
  await restorePage.goto('http://127.0.0.1:4173/');await restorePage.waitForFunction(()=>!document.querySelector('#open').disabled);
  await restorePage.locator('#fallback').setInputFiles({name:'plans.json',mimeType:'application/json',buffer:Buffer.from(raw)});await restorePage.locator('.node').first().waitFor();await restorePage.waitForFunction(()=>['saved','unchanged'].includes(document.querySelector('#app')?.dataset.saveState));
  await restorePage.evaluate(()=>new Promise((resolve,reject)=>{const request=indexedDB.open('alder-web-viewer',1);request.onerror=()=>reject(request.error);request.onsuccess=()=>{const db=request.result,tx=db.transaction('session','readwrite'),store=tx.objectStore('session'),get=store.get('current');get.onsuccess=()=>{const value=get.result;value.document.design.namedPlans.selected='missing';store.put(value,'current');};tx.oncomplete=()=>{db.close();resolve();};tx.onerror=tx.onabort=()=>reject(tx.error);};}));
  await restorePage.reload();await restorePage.locator('#status-text').filter({hasText:'前回の表示を復元できません'}).waitFor();
  const stored=await restorePage.evaluate(()=>new Promise((resolve,reject)=>{const request=indexedDB.open('alder-web-viewer',1);request.onerror=()=>reject(request.error);request.onsuccess=()=>{const db=request.result,tx=db.transaction('session'),get=tx.objectStore('session').get('current');get.onsuccess=()=>resolve(get.result.document.design.namedPlans.selected);tx.oncomplete=()=>db.close();};}));
  assert.equal(stored,'missing');assert.equal(await restorePage.locator('.node').count(),0);
 }finally{await damaged.close();}
 return {browser:browser.version(),results,urlRefreshAndHistory:true,missingPlanKeepsDisplay:true,invalidRestoreProtected:true};
}
