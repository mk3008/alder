import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {selectGraphNode} from './graph-selection-browser.mjs';
import {openSourceAction} from './source-menu-browser.mjs';
import {openExplorerGroup} from './explorer-browser.mjs';
import {ensureDocumentActions} from './test-tab-strip-browser.mjs';

// Synthetic only: its saved Check state is not a real business approval.
const raw=readFileSync('web/fixtures/json-05-reviewed-seed.json','utf8'),seed=JSON.parse(raw);
const cases=JSON.parse(readFileSync('web/fixtures/json-05-d2-cases.json','utf8'));
const current=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v9-draft-routes-reference-draft.json','utf8'));
const fixture=id=>{const business=structuredClone(cases.find(c=>c.caseId===id).candidate.business);for(const a of business.activities)a.results=a.results.map(r=>({id:r.id,text:r.condition?r.condition+'、'+r.text:r.text}));return JSON.stringify({format:'alder-document-package',formatVersion:'0.5',revision:'browser-probe',documents:[business],sources:[],externalDocuments:[],diagnostics:[]});};

export async function verifyJSON05Reintegration(browser){
 const results=[],out='web/evidence/json-document';mkdirSync(out,{recursive:true});
 for(const width of [1280,393]){
  const context=await browser.newContext({viewport:{width,height:960}}),page=await context.newPage(),errors=[],nonGET=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.method()!=='GET')nonGET.push(r.method()+' '+r.url());});
  const ready=()=>page.waitForFunction(()=>!document.querySelector('#open').disabled);
  const saved=()=>page.waitForFunction(()=>['saved','unchanged'].includes(document.querySelector('#app')?.dataset.saveState));
  const record=()=>page.evaluate(()=>new Promise((resolve,reject)=>{const request=indexedDB.open('alder-web-viewer',1);request.onerror=()=>reject(request.error);request.onsuccess=()=>{const db=request.result,tx=db.transaction('session'),get=tx.objectStore('session').get('current');tx.oncomplete=()=>{db.close();resolve(get.result);};tx.onerror=()=>reject(tx.error);};}));
  const waitRaw=expected=>page.waitForFunction(expected=>new Promise((resolve,reject)=>{const request=indexedDB.open('alder-web-viewer',1);request.onerror=()=>reject(request.error);request.onsuccess=()=>{const db=request.result,tx=db.transaction('session'),get=tx.objectStore('session').get('current');tx.oncomplete=()=>{db.close();resolve(get.result?.document?.design?.markdown===expected);};tx.onerror=()=>reject(tx.error);};}),expected);
  const file=body=>page.locator('#fallback').setInputFiles({name:'legacy-05.json',mimeType:'application/json',buffer:Buffer.from(body)});
  const drawer=async()=>{if(!await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();};
  const closeList=async()=>{if(await page.locator('#node-list-drawer').isVisible())await page.locator('#node-list-close').click();};
  const who=()=>page.locator('.json-detail').evaluate(el=>{const heading=[...el.querySelectorAll('h3')].find(h=>h.textContent==='Who');return heading?.nextElementSibling?.textContent;});
  const dismiss=async()=>{if(await page.locator('#source-dialog').isVisible())await page.keyboard.press('Escape');if(await page.locator('#status-close').isVisible())await page.locator('#status-close').click();};
  try{
   await page.goto('http://127.0.0.1:4173/');await ready();await file(raw);await page.locator('.node').first().waitFor();await saved();await waitRaw(raw);
   await ensureDocumentActions(page);await page.locator('#view-markdown').click();assert.equal(await page.locator('#source-text').getAttribute('readonly'),'');assert.equal(await page.locator('#source-text').inputValue(),raw);for(const id of ['staff-object','system-object','c-staff','mix-input'])assert.ok(raw.includes(id));await page.keyboard.press('Escape');await page.locator('#source-dialog').waitFor({state:'hidden'});
   await selectGraphNode(page,'c-guidance');await drawer();let text=await page.locator('.json-detail').innerText();
   for(const s of ['受付担当','受付システム','担当者','旧形式の担当情報','複数の担当Object','旧形式の担当：受付担当','旧形式の担当：受付システム','相談申込を入力する','依頼者へ担当窓口が説明される','依頼者へ次の連絡方法が説明される','連絡案内','その相談の担当窓口'])assert.ok(text.includes(s),s);assert.equal(await who(),'未決');assert.match(text,/手順の担当情報が異なります/);
   assert.equal(await page.locator('.json-detail [data-business-result]').count(),1);assert.equal(await page.locator('.json-detail [data-business-result] li').count(),2);assert.match(await page.locator('.json-detail [data-business-result]').evaluate(el=>el.nextElementSibling.textContent),/各Resultとの対応は未確認/);
   assert.doesNotMatch(text,/\[object Object\]|c-guidance|data-c-output/);
   await page.screenshot({path:`${out}/json-05-reintegration-detail-${width}.png`});
   assert.equal(await page.locator('[data-finding-link="viewer:who:c-guidance"]').count(),0);await page.locator('[data-structure-issue="viewer:who:c-guidance"] button').click();const finding=await page.locator('#node-list').innerText();for(const value of ['構造の要確認（表示のみ）','受付担当','受付システム','単一のWho','システム','スケジューラー'])assert.ok(finding.includes(value),value);
   await closeList();await selectGraphNode(page,'c-guidance');await drawer();assert.equal(await page.locator('[data-finding-link="viewer:steps:c-guidance"]').count(),0);await page.locator('[data-structure-issue="viewer:steps:c-guidance"] button').click();assert.match(await page.locator('#node-list').innerText(),/Activityの分割を検討/);await closeList();
   let stored=await record();assert.equal(stored.document.design.markdown,raw);assert.deepEqual(stored.document.design.model.business.findings,seed.documents[0].findings);assert.equal(stored.document.design.model.checks[0].items[0].reviewState,'確認済み');assert.equal(stored.document.design.model.checks[0].basedOn.verification,'unverified');
   await page.reload();await ready();assert.equal((await record()).document.design.markdown,raw);assert.equal(await page.locator('[data-node="c-guidance"]').count(),1);

   const loop=structuredClone(seed),bd=loop.documents.find(d=>d.kind==='businessDesign'),state=loop.documents.find(d=>d.kind==='stateTransition'),first=state.transitions[0];bd.exceptions.push({id:'loop-exception',activityId:'c-guidance',name:'案内例外',description:'合成された例外。'});
   state.transitions.push({...first,id:'loop-one',sourceId:'L1',fromId:'seed-done',toId:'seed-done',effect:'unchanged',condition:'同じ条件',note:'通常自己遷移'}, {...first,id:'loop-two',sourceId:'L2',fromId:'seed-done',toId:'seed-done',effect:'unchanged',path:'exception',exceptionId:'loop-exception',condition:'同じ条件',note:'例外自己遷移'});
   const loopRaw=JSON.stringify(loop);await file(loopRaw);await waitRaw(loopRaw);if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();await openExplorerGroup(page,'states');await page.locator(`[data-explorer-key="states:${state.objectId}"]`).click();await page.locator('#states-workspace .state-diagram').waitFor();
   assert.equal(await page.locator('#states-workspace path.state-self-loop').count(),1);assert.equal(await page.locator('#states-workspace path.state-self-loop').getAttribute('stroke-dasharray'),'6 5');
   for(const id of ['L1','L2'])assert.equal(await page.locator(`#states-workspace [data-transition="${id}"]`).count(),1);assert.match(await page.locator('#states-workspace [data-transition="L1"]').textContent(),/通常自己遷移/);assert.match(await page.locator('#states-workspace [data-transition="L2"]').textContent(),/例外自己遷移/);
   stored=await record();assert.deepEqual(stored.document.design.model.states[0].transitions,state.transitions);await page.reload();await ready();await page.locator('#states-workspace .state-diagram').waitFor();assert.equal((await record()).document.design.markdown,loopRaw);assert.equal(await page.locator('#states-workspace path.state-self-loop').count(),1);
   await page.screenshot({path:`${out}/json-05-reintegration-state-${width}.png`});

   const bad=structuredClone(loop);bad.documents[0].relations[0].dataId='missing';await file(JSON.stringify(bad));await page.locator('#status-text').filter({hasText:'開けません'}).waitFor();assert.equal((await record()).document.design.markdown,loopRaw);assert.equal(await page.locator('#states-workspace path.state-self-loop').count(),1);await dismiss();
   let response=loopRaw;const url='https://json-05-fixture.test/design.json';await context.route(url,route=>route.fulfill({headers:{'access-control-allow-origin':'*','content-type':'application/json'},body:response}));
   if(width<=800&&await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();await openSourceAction(page,'open-url');await page.locator('#source-url').fill(url);await page.locator('#source-submit').click();await page.locator('#source-dialog').waitFor({state:'hidden'});await waitRaw(loopRaw);await saved();
   response='{"format":"broken"}';await page.locator('#refresh').click();await page.locator('#status-text').filter({hasText:'旧表示を保持'}).waitFor();assert.equal((await record()).document.design.markdown,loopRaw);await dismiss();

   const photo=fixture('photo');await file(photo);await waitRaw(photo);await selectGraphNode(page,'photo-activity');await drawer();text=await page.locator('.json-detail').innerText();assert.match(text,/参加者/);assert.match(text,/記録担当/);assert.match(text,/複数Role/);assert.equal(await who(),'未決');assert.doesNotMatch(text,/旧形式の担当：/);assert.equal(await page.locator('[data-finding-link="viewer:who:photo-activity"]').count(),0);await page.locator('[data-structure-issue="viewer:who:photo-activity"] button').click();assert.match(await page.locator('#node-list').innerText(),/単一のWho/);await closeList();
   const undecided=fixture('molkkyCross'),unresolved=JSON.parse(undecided).documents[0].activities[0];await file(undecided);await waitRaw(undecided);await selectGraphNode(page,unresolved.id);await drawer();text=await page.locator('.json-detail').innerText();assert.match(text,/旧形式の担当：未決/);assert.match(text,/Whoは未決/);assert.equal(await who(),'未決');
   const revised=structuredClone(current),currentBD=revised.documents.find(d=>d.kind==='businessDesign'),currentActivity=currentBD.activities.find(a=>a.roleId),currentRole=currentBD.roles.find(r=>r.id===currentActivity.roleId);currentRole.name='単一ロールN';const currentRaw=JSON.stringify(revised);await file(currentRaw);await waitRaw(currentRaw);await selectGraphNode(page,currentActivity.id);await drawer();assert.equal(await who(),'単一ロールN');assert.equal(await page.locator('[data-finding-link^="viewer:"]').count(),0);
   assert.deepEqual(errors,[]);assert.deepEqual(nonGET,[]);results.push({width,file:true,url:true,restore:true,legacyMultiObject:true,legacyMultiRoleRejected:true,unresolved:true,directRoleN:true,stepDisagreement:true,resultsAndData:true,transitionIdsAndBundledLoop:true,invalidKeepsPrevious:true,sourceAndCheckPreserved:true});
  }catch(error){await page.screenshot({path:`${out}/json-05-reintegration-failure-${width}.png`}).catch(()=>{});throw error;}finally{await context.close();writeFileSync(`${out}/json-05-reintegration-results.json`,JSON.stringify({browser:browser.version(),results},null,2));}
 }
 return {browser:browser.version(),results,limits:'Synthetic fixtures; emulated narrow viewport; OS picker, physical mobile, real external server and human review are separate.'};
}
