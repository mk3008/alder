import {positionGraphNode,selectGraphNode} from './graph-selection-browser.mjs';
import {setScope} from './scope-control.mjs';
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
import {parseDesign} from '../src/graph.ts';
import {activityDesign} from '../src/activities.ts';
import {ensureDocumentActions} from './test-tab-strip-browser.mjs';
const source=readFileSync('../business-design/alder/README.md','utf8'),design=parseDesign(source),activities=design.activityOrder.map(id=>design.graph.nodes.find(n=>n.id===id));
export async function verifyActivityWorkspace(browser){
 const results=[];mkdirSync('web/evidence/activity-workspace',{recursive:true});
 for(const width of [1280,393,320]){
  const context=await browser.newContext({viewport:{width,height:900},hasTouch:width!==1280}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(5000);
  const saved=()=>page.waitForFunction(()=>document.querySelector('#app').dataset.saveState==='saved');
  const ids=()=>page.locator('.node').evaluateAll(ns=>ns.map(n=>n.dataset.node).sort());
  const scope=async()=>setScope(page,await page.locator('#show-outside').isChecked()?'hide':'show');
  try{
   await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);
   await page.locator('#open-sample').click();await saved();assert.equal(await page.locator('.tab').count(),1);assert.equal(await page.locator('.tab .close').isVisible(),true);
   assert.deepEqual(await ids(),activityDesign(design).graph.nodes.map(n=>n.id).sort());
   if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
   // Body selection/drag matches Objects; only the right-hand icon navigates.
   await positionGraphNode(page,'業務設計');
   const body=page.locator('.node[data-activity="業務設計"]'),position=()=>body.evaluate(n=>[parseFloat(n.style.left),parseFloat(n.style.top)]),locked=await position();
   assert.equal(await page.locator('.node-drag-handle').count(),0);assert.equal(await body.locator('.activity-open').getAttribute('aria-label'),'業務設計の詳細タブを開く');
   if(width===1280)await body.click({position:{x:60,y:30}});else await body.tap({position:{x:60,y:30}});
   assert.equal(await page.locator('.node.selected').getAttribute('data-node'),'業務設計');assert.equal(await page.locator('.tab').count(),1,'body only selects');assert.deepEqual(await position(),locked);
   await body.locator('.activity-open').focus();await page.keyboard.press('ArrowRight');assert.deepEqual(await position(),locked,'icon is not a movement handle');assert.equal(await page.locator('.tab').count(),1);
   // ArrowRight can animate native viewport scrolling. Observe its completion,
   // then use the normal list to center the card outside every edge-pan band.
   await page.waitForFunction(()=>{const v=document.querySelector('#viewport'),key=v.scrollLeft+','+v.scrollTop,now=performance.now(),p=globalThis.__activityCamera;if(!p||p.key!==key){globalThis.__activityCamera={key,time:now};return false;}return now-p.time>=200;});
   await positionGraphNode(page,'業務設計');
   await page.locator('#layout-lock').click();
   const rectangle=await body.boundingBox(),start=[rectangle.x+130,rectangle.y+34],beforeDrag=await position();
   const viewportBox=await page.locator('#viewport').boundingBox();assert.ok(start[0]-30>viewportBox.x+48&&start[0]<viewportBox.x+viewportBox.width-48,'ordinary body drag stays outside horizontal edge-pan bands');
   if(width===1280){await page.mouse.move(...start);await page.mouse.down();await page.mouse.move(start[0]-30,start[1]-20,{steps:4});await page.mouse.up();}
   else{const cdp=await context.newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:start[0],y:start[1],id:1}]});for(let i=1;i<=4;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:start[0]-30*i/4,y:start[1]-20*i/4,id:1}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();}
   const dragged=await position();assert.deepEqual(dragged,[beforeDrag[0]-30,beforeDrag[1]-20]);assert.equal(await page.locator('.tab').count(),1,'body drag never opens details');await saved();await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);assert.deepEqual(await position(),dragged);assert.equal(await page.locator('#layout-lock').getAttribute('aria-pressed'),'true');
   const card=page.locator('.node[data-activity="業務設計"] .activity-open').first();await card.focus();await page.keyboard.press('Enter');assert.equal(await page.locator('.tab').count(),2);assert.deepEqual(await ids(),activityDesign(design,activities[0].id).graph.nodes.map(n=>n.id).sort());assert.equal(await page.locator('.node[data-activity="業務設計"] .activity-open').count(),0,'the current Activity has no self-navigation button');
   const neighbor=page.locator('.node[data-activity="検査項目の設計"] .activity-open');assert.equal(await neighbor.count(),1);await neighbor.press('Enter');assert.equal(await page.locator('.tab').count(),3);assert.deepEqual(await ids(),['Alder: 検査項目設計ナレッジ','依頼者','業務設計','業務設計書','検査項目','検査項目の設計'].sort());assert.equal(await neighbor.count(),0);assert.ok((await page.locator('.edge.exception title').allTextContents()).some(text=>text.includes('検査項目の設計 → 業務設計:')));await card.press('Enter');assert.equal(await page.locator('.tab').count(),3,'return to existing adjacent detail');await page.locator('.tab').nth(2).locator('.close').click();
   await page.locator('#in').click();const zoom=await page.locator('#zoom').textContent();await page.locator('.tab').first().locator('button').first().click();assert.equal(await page.locator('#zoom').textContent(),'100%');
   await card.press('Space');assert.equal(await page.locator('.tab').count(),2);await page.locator('.tab').first().locator('button').first().click();if(width===1280)await card.click();else await card.tap();assert.equal(await page.locator('.tab').count(),2);assert.equal(await page.locator('#zoom').textContent(),zoom);await saved();await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);assert.equal(await page.locator('.tab').count(),2);assert.equal(await page.locator('#zoom').textContent(),zoom);assert.equal(await page.locator('.node[data-activity="業務設計"] .activity-open').count(),0,'restoring details keeps self-navigation absent');
   await page.locator('.tab.active .close').click();await saved();assert.equal(await page.locator('.tab').count(),1);
   await scope();const hidden=await ids();await saved();await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);assert.deepEqual(await ids(),hidden,'scope visibility survives aggregate restore');await scope();assert.ok((await ids()).includes('画面設計'));
   await ensureDocumentActions(page);await page.locator('#open-checks').click();await page.locator('#check-open-sample').click();await saved();
   await page.locator('.node[data-activity="業務設計"] .activity-open').first().press('Enter');await selectGraphNode(page,'業務設計');if(!await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();await page.locator('[data-check-id="SAMPLE-01"]').waitFor();
   await saved();const record=await page.evaluate(()=>new Promise((resolve,reject)=>{const r=indexedDB.open('alder-web-viewer',1);r.onsuccess=()=>{const db=r.result,tx=db.transaction('session'),q=tx.objectStore('session').get('current');tx.oncomplete=()=>{db.close();resolve(q.result);};};r.onerror=()=>reject(r.error);}));assert.equal(record.format,3);assert.equal(record.document.design.markdown,source);assert.ok(record.document.checks);assert.ok(record.views.every(v=>!('design' in v)&&!('draft' in v)&&!('checks' in v)));
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
    await page.locator('#open-menu-toggle').click();await page.locator('#open-url').click();await page.locator('#source-url').fill('https://refresh-fixture.test/original.md');await page.locator('#source-submit').click();await page.locator('#source-dialog').waitFor({state:'hidden'});await page.locator('.node[data-activity="業務設計"] .activity-open').first().press('Enter');await saved();await ensureDocumentActions(page);await page.locator('#refresh').click();await requestedRefresh;
    await page.locator('.tab.active .close').click();await saved();assert.equal(await page.locator('#refresh').isDisabled(),true);finishRefresh();await page.waitForFunction(()=>!document.querySelector('#refresh').disabled);await saved();
    const raw=await page.evaluate(()=>new Promise(resolve=>{const r=indexedDB.open('alder-web-viewer',1);r.onsuccess=()=>{const db=r.result,tx=db.transaction('session'),q=tx.objectStore('session').get('current');tx.oncomplete=()=>{db.close();resolve(q.result.document.design.markdown);};};}));assert.equal(raw,source+'\nRefreshed original');
   }
   await page.screenshot({path:`web/evidence/activity-workspace/${width}.png`});assert.deepEqual(errors,[]);results.push({width,keyboard:true,singleTap:true,duplicateSafe:true,independentZoom:true,scopeReload:true,sharedChecks:true,canonicalDocument:true,iconOnly:true,noSelfNavigation:true,exceptionNeighbors:true,oneHopOnly:true,bodySelection:true,bodyDrag:true,noDragOpen:true,dragReload:true});
  }finally{await context.close();}
 }
 return results;
}
