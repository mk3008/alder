import {stateCaptionSnapshot,assertStateCaptionRows} from './caption-row-oracle.mjs';
import assert from 'node:assert/strict';import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
const dir='../work/json-state/issue-275/',raw=readFileSync(dir+'purchase.json','utf8'),md=readFileSync(dir+'supported-state.md','utf8'),pkg=JSON.parse(raw),st=pkg.documents[1],bd=pkg.documents[0];
const parseStateRows=()=>st.transitions.map(t=>({id:t.sourceId,from:st.states.find(s=>s.id===t.fromId)?.name??t.fromId}));
export async function verifyJSONStates(browser){
 const results=[],out='web/evidence/json-states';mkdirSync(out,{recursive:true});
 for(const width of [1280,393]){const snapshots=[];
 for(const [format,source]of [['md',md],['json',raw]]){
  const context=await browser.newContext({viewport:{width,height:960}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const ready=()=>page.waitForFunction(()=>!document.querySelector('#open').disabled),saved=()=>page.waitForFunction(()=>['saved','unchanged'].includes(document.querySelector('#app')?.dataset.saveState));
  const select=async id=>{if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();await page.locator(`[data-explorer-key="states:${id}"]`).click();};
  try{
   await page.goto('http://127.0.0.1:4173/');await ready();await page.locator('#fallback').setInputFiles({name:'states.'+format,mimeType:format==='json'?'application/json':'text/markdown',buffer:Buffer.from(source)});await page.locator('.node').first().waitFor();if(await page.locator('#check-followup').isVisible())await page.locator('#check-followup-later').click();await saved();
   await select(format==='json'?st.objectId:'購入申請');await page.locator('.state-diagram').waitFor();
   assert.equal(await page.locator('[data-transition]').count(),13);assert.equal(await page.locator('[data-state]').count(),8);assert.equal(await page.locator('.state-diagram [stroke-dasharray]').count()>0,true);
   assert.equal(await page.locator('[data-state="申請済み"] .graph-card-surface').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(228, 244, 235)');
   const spacing=assertStateCaptionRows(await page.locator('.state-diagram').evaluate(stateCaptionSnapshot),parseStateRows());
   const svg=await page.locator('.state-diagram').evaluate(e=>e.outerHTML);snapshots.push(svg);
   await page.screenshot({path:`${out}/${format}-states-${width}.png`});await page.locator('.state-transition-panel > details').first().locator('summary').click();assert.ok((await page.locator('[data-transition="T12"]').innerText()).includes('未決（設計課題）'));assert.ok((await page.locator('[data-transition="T07"]').innerText()).includes('申請内容の破棄'));
   await page.locator('[data-state="申請済み"]').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('[data-state="申請済み"]').getAttribute('aria-pressed'),'true');await page.keyboard.press('Escape');assert.equal(await page.locator('[data-state="申請済み"]').getAttribute('aria-pressed'),'false');await page.locator('[data-state="申請済み"]').press('Space');assert.equal(await page.locator('[data-state="申請済み"]').getAttribute('aria-pressed'),'true');
   for(const item of await page.locator('.state-diagram .muted').all())assert.equal(await item.evaluate(e=>getComputedStyle(e).opacity),'1');
   await page.screenshot({path:`${out}/${format}-selected-${width}.png`});
   await page.locator('[data-transition="T12"] button').click();assert.equal(await page.locator('.node.selected').getAttribute('data-node'),format==='json'?bd.activities.find(a=>a.name==='購入を準備する').id:'購入を準備する');
   await select(format==='json'?st.objectId:'購入申請');await saved();await page.reload();await ready();await page.locator('.state-diagram').waitFor();assert.equal(await page.locator('.state-diagram').evaluate(e=>e.outerHTML),svg);
   // A state operation outside an Activity detail must use existing navigation back to overview.
   await page.locator('#tabs .tab button:first-child').first().click();if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
   const firstActivity=format==='json'?bd.activities[0].id:bd.activities[0].name;
   await page.locator(`.node[data-activity="${firstActivity}"] .activity-open`).first().press('Enter');
   await select(format==='json'?st.objectId:'購入申請');await page.locator('.state-transition-panel > details').first().locator('summary').click();await page.locator('[data-transition="T12"] button').click();
   assert.equal(await page.locator('.node.selected .node-name').innerText(),'購入を準備する');assert.equal(await page.locator('#detail h1').innerText(),'購入を準備する');
   const other=bd.objects.find(o=>o.id!==st.objectId);if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();assert.equal(await page.locator(`[data-explorer-key="states:${format==='json'?other.id:other.name}"]`).count(),0,'an Object without a declaration has no state page');
   assert.deepEqual(errors,[]);results.push({width,format,operations:13,states:8,partial:true,spacing,T12:'@unknown',keyboard:true,activityNavigation:true,reload:true,unknownObjectDisabled:true,pageErrors:errors});
  }catch(e){await page.screenshot({path:`${out}/failure-${format}-${width}.png`}).catch(()=>{});throw e;}finally{await context.close();}
 }
 assert.equal(snapshots[0],snapshots[1],'MD/JSON SVG coordinates, routes, labels and controls must be identical');
 }
 // Current JSON contract is exercised directly, not only through old-version compatibility.
 const nativeSource=readFileSync('../work/viewer-json/issue-274/json-native/independent.json','utf8'),native=JSON.parse(nativeSource),nativeSVG=[];
 for(const decorated of [false,true]){
  const input=structuredClone(native);if(decorated){input.documents[0].exceptions[0].description='**装飾**\n- **偽の例外名** — 説明';input.documents[0].activities[0].exception='1. 表示用の文章だけ';}
  const context=await browser.newContext({viewport:{width:393,height:960}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);
   await page.locator('#fallback').setInputFiles({name:'native.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(input))});await page.waitForFunction(()=>document.querySelectorAll('.node').length===3);
   if(await page.locator('#check-followup').isVisible())await page.locator('#check-followup-later').click();
   if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();await page.locator('[data-explorer-key="states:object-request"]').click();await page.locator('.state-diagram').waitFor();
   assert.equal(await page.locator('[data-transition]').count(),2);const svg=await page.locator('.state-diagram').evaluate(e=>e.outerHTML);nativeSVG.push(svg);
   await page.screenshot({path:`${out}/native-0.4-${decorated?'decorated':'plain'}-393.png`});
   await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await page.waitForFunction(()=>['saved','unchanged'].includes(document.querySelector('#app').dataset.saveState));await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('.state-diagram').waitFor();assert.equal(await page.locator('.state-diagram').evaluate(e=>e.outerHTML),svg);
   const bad=structuredClone(input);bad.documents[1].transitions[1].exceptionId='missing';await page.locator('#fallback').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(bad))});await page.locator('#status-text').filter({hasText:'Dangling'}).waitFor();assert.equal(await page.locator('.state-diagram').evaluate(e=>e.outerHTML),svg);
   assert.deepEqual(errors,[]);results.push({format:'native-0.4',decorated,operations:2,stableExceptionId:'exception-receive',reload:true,invalidReferenceKeepsDisplay:true,pageErrors:errors});
  }finally{await context.close();}
 }
 assert.equal(nativeSVG[0],nativeSVG[1],'description formatting never changes structural state SVG');
 writeFileSync(out+'/results.json',JSON.stringify({browser:browser.version(),results,svgExact:true},null,2));return {results,svgExact:true};
}
