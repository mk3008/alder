import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
import {parseDesign} from '../src/graph.ts';
import {parseGroups,groupDesign} from '../src/groups.ts';
import {ensureDocumentActions} from './test-tab-strip-browser.mjs';
const source=readFileSync('../business-design/alder/README.md','utf8'),design=parseDesign(source),groups=parseGroups(source,design);
export async function verifyGroupWorkspace(browser){
 const results=[];mkdirSync('web/evidence/group-workspace',{recursive:true});
 for(const width of [1280,393,320]){
  const context=await browser.newContext({viewport:{width,height:900},hasTouch:width!==1280}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(5000);
  const saved=()=>page.waitForFunction(()=>document.querySelector('#app').dataset.saveState==='saved');
  const ids=()=>page.locator('.node').evaluateAll(ns=>ns.map(n=>n.dataset.node).sort());
  const scope=async()=>{if(!await page.locator('#node-list-drawer').isVisible())await page.locator('#node-list-toggle').click();await page.locator('#scope-outside').click();await page.locator('#node-list-close').click();};
  try{
   await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);
   await page.locator('#open-sample').click();await saved();assert.equal(await page.locator('.tab').count(),1);assert.equal(await page.locator('.tab .close').isVisible(),false);
   assert.deepEqual(await ids(),groupDesign(design).graph.nodes.map(n=>n.id).sort());
   if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
   const card=page.locator('.node[data-group]').first();await card.focus();await page.keyboard.press('Enter');assert.equal(await page.locator('.tab').count(),2);assert.deepEqual(await ids(),groupDesign(design,groups[0].name).graph.nodes.map(n=>n.id).sort());
   await page.locator('#in').click();const zoom=await page.locator('#zoom').textContent();await page.locator('.tab').first().locator('button').first().click();assert.equal(await page.locator('#zoom').textContent(),'100%');
   if(width===1280)await card.click();else await card.tap();assert.equal(await page.locator('.tab').count(),2);assert.equal(await page.locator('#zoom').textContent(),zoom);await saved();await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);assert.equal(await page.locator('.tab').count(),2);assert.equal(await page.locator('#zoom').textContent(),zoom);
   await page.locator('.tab.active .close').click();await saved();assert.equal(await page.locator('.tab').count(),1);
   await scope();const hidden=await ids();await saved();await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);assert.deepEqual(await ids(),hidden,'scope visibility survives aggregate restore');await scope();assert.ok((await ids()).includes('画面設計'));
   await ensureDocumentActions(page);await page.locator('#open-checks').click();await page.locator('#check-open-sample').click();await saved();
   await page.locator('.node[data-group]').first().press('Enter');await page.locator('#node-list-toggle').click();await page.locator('[data-list-node="業務設計"] .node-navigate').click();if(await page.locator('#node-list-drawer').isVisible())await page.locator('#node-list-close').click();if(!await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();await page.locator('[data-check-id="SAMPLE-01"]').waitFor();
   await saved();const record=await page.evaluate(()=>new Promise((resolve,reject)=>{const r=indexedDB.open('alder-web-viewer',1);r.onsuccess=()=>{const db=r.result,tx=db.transaction('session'),q=tx.objectStore('session').get('current');tx.oncomplete=()=>{db.close();resolve(q.result);};};r.onerror=()=>reject(r.error);}));assert.equal(record.format,2);assert.equal(record.document.design.markdown,source);assert.ok(record.document.checks);assert.ok(record.views.every(v=>!('design' in v)&&!('draft' in v)&&!('checks' in v)));
   if(width===1280){
    // Close the initiating view while a real intercepted Check request waits.
    const rawChecks=readFileSync('src/samples/alder-checks.md','utf8')+'\n';let finishCheck,seenCheck;const requestedCheck=new Promise(resolve=>{seenCheck=resolve;});
    await context.route('https://check-fixture.test/shared.md',async route=>{await new Promise(resolve=>{finishCheck=resolve;seenCheck();});await route.fulfill({headers:{'access-control-allow-origin':'*','content-type':'text/markdown'},body:rawChecks});});
    await ensureDocumentActions(page);await page.locator('#open-checks').click();await page.locator('#check-open-url').click();await page.locator('#check-url').fill('https://check-fixture.test/shared.md');await page.locator('#check-url-submit').click();await requestedCheck;
    await page.locator('.tab.active .close').click();await saved();finishCheck();await page.waitForFunction(()=>document.querySelector('#check-confirm')||!document.querySelector('#open-checks').disabled);
    if(await page.locator('#check-confirm').count())await page.locator('#check-confirm').click();await saved();
    const checkBody=await page.evaluate(()=>new Promise(resolve=>{const r=indexedDB.open('alder-web-viewer',1);r.onsuccess=()=>{const db=r.result,tx=db.transaction('session'),q=tx.objectStore('session').get('current');tx.oncomplete=()=>{db.close();resolve(q.result.document.checks.markdown);};};}));assert.equal(checkBody,rawChecks);
    // The same original continues its refresh after the initiating Group closes.
    let reads=0,finishRefresh,seenRefresh;const requestedRefresh=new Promise(resolve=>{seenRefresh=resolve;});
    await context.route('https://refresh-fixture.test/original.md',async route=>{const refreshing=reads++>0;if(refreshing)await new Promise(resolve=>{finishRefresh=resolve;seenRefresh();});await route.fulfill({headers:{'access-control-allow-origin':'*','content-type':'text/markdown'},body:source+(refreshing?'\nRefreshed original':'')});});
    await page.locator('#open-menu-toggle').click();await page.locator('#open-url').click();await page.locator('#source-url').fill('https://refresh-fixture.test/original.md');await page.locator('#source-submit').click();await page.locator('#source-dialog').waitFor({state:'hidden'});await page.locator('.node[data-group]').first().press('Enter');await saved();await ensureDocumentActions(page);await page.locator('#refresh').click();await requestedRefresh;
    await page.locator('.tab.active .close').click();await saved();assert.equal(await page.locator('#refresh').isDisabled(),true);finishRefresh();await page.waitForFunction(()=>!document.querySelector('#refresh').disabled);await saved();
    const raw=await page.evaluate(()=>new Promise(resolve=>{const r=indexedDB.open('alder-web-viewer',1);r.onsuccess=()=>{const db=r.result,tx=db.transaction('session'),q=tx.objectStore('session').get('current');tx.oncomplete=()=>{db.close();resolve(q.result.document.design.markdown);};};}));assert.equal(raw,source+'\nRefreshed original');
   }
   await page.screenshot({path:`web/evidence/group-workspace/${width}.png`});assert.deepEqual(errors,[]);results.push({width,keyboard:true,singleTap:true,duplicateSafe:true,independentZoom:true,scopeReload:true,sharedChecks:true,canonicalDocument:true});
  }finally{await context.close();}
 }
 return results;
}
