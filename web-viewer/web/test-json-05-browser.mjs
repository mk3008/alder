import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {selectGraphNode} from './graph-selection-browser.mjs';
import {openSourceAction} from './source-menu-browser.mjs';

// The Phase B seed has a 0.5 BD, a human-state Check and a partial State.
// It is a synthetic test input, not evidence of a business approval.
const raw=readFileSync('../work/plugin-json/issue-310/reviewed-seed.json','utf8');
const seed=JSON.parse(raw),bd=seed.documents.find(d=>d.kind==='businessDesign'),check=seed.documents.find(d=>d.kind==='checkItems'),state=seed.documents.find(d=>d.kind==='stateTransition');

export async function verifyJSON05(browser){
 const results=[],out='web/evidence/json-document';mkdirSync(out,{recursive:true});
 for(const width of [1280,393]){
  const context=await browser.newContext({viewport:{width,height:960}}),page=await context.newPage(),errors=[],nonGET=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.method()!=='GET')nonGET.push(r.method()+' '+r.url());});
  const ready=()=>page.waitForFunction(()=>!document.querySelector('#open').disabled);
  const saved=()=>page.waitForFunction(()=>['saved','unchanged'].includes(document.querySelector('#app')?.dataset.saveState));
  const record=()=>page.evaluate(()=>new Promise((resolve,reject)=>{const r=indexedDB.open('alder-web-viewer',1);r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,tx=db.transaction('session'),get=tx.objectStore('session').get('current');tx.oncomplete=()=>{db.close();resolve(get.result);};tx.onerror=()=>reject(tx.error);};}));
  const file=body=>page.locator('#fallback').setInputFiles({name:'phase-c-05.json',mimeType:'application/json',buffer:Buffer.from(body)});
  const dismiss=async()=>{if(await page.locator('#source-dialog').isVisible())await page.keyboard.press('Escape');if(await page.locator('#status-close').isVisible())await page.locator('#status-close').click();};
  try{
   await page.goto('http://127.0.0.1:4173/');await ready();await file(raw);await page.locator('.node').first().waitFor();await saved();
   assert.equal(await page.locator('.node').count(),bd.objects.length+bd.activities.length);
   assert.equal((await record()).document.design.markdown,raw);
   await selectGraphNode(page,'c-guidance');if(!await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
   const detail=await page.locator('.json-detail').innerText();
   for(const s of ['受付担当','受付システム','相談申込を入力する','次の連絡方法を案内する','依頼者へ担当窓口が説明される','連絡案内','その相談の担当窓口'])assert.ok(detail.includes(s),s);
   assert.doesNotMatch(detail,/\[object Object\]|c-guidance|data-c-output/);
   await page.screenshot({path:`${out}/json-05-detail-${width}.png`});
   await page.locator('#detail-mode-checks').click();const checks=await page.locator('.json-checks').innerText();assert.match(checks,/意味対応は未確認/);assert.match(checks,/SYN-1/);assert.match(checks,/確認済み/);
   let stored=await record();assert.equal(stored.document.design.model.checks[0].basedOn.verification,'unverified');assert.equal(stored.document.design.model.checks[0].items[0].reviewState,check.items[0].reviewState);
   if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();await page.locator(`[data-explorer-key="states:${state.objectId}"]`).click();await page.locator('.state-diagram').waitFor();
   assert.equal(await page.locator('[data-transition="S1"]').count(),1);await saved();await page.reload();await ready();await page.locator('.state-diagram').waitFor();assert.equal(await page.locator('[data-transition="S1"]').count(),1);stored=await record();assert.equal(stored.document.design.markdown,raw);assert.equal(stored.document.design.model.states[0].basedOn.verification,'unverified');
   for(const mutate of [p=>p.documents[0].relations[0].dataId='missing',p=>p.documents[0].activities[0].results=[],p=>p.documents[1].basedOn.revision='stale',p=>p.documents[2].transitions[0].activityId='missing']){
    const bad=structuredClone(seed);mutate(bad);await file(JSON.stringify(bad));await page.locator('#status-text').filter({hasText:'開けません'}).waitFor();assert.equal((await record()).document.design.markdown,raw);assert.equal(await page.locator('[data-transition="S1"]').count(),1);await dismiss();
   }
   let version=raw;const url='https://json-05-fixture.test/design.json';await context.route(url,route=>route.fulfill({headers:{'access-control-allow-origin':'*','content-type':'application/json'},body:version}));
   await openSourceAction(page,'open-url');await page.locator('#source-url').fill(url);await page.locator('#source-submit').click();await page.locator('#source-dialog').waitFor({state:'hidden'});await saved();assert.equal((await record()).document.design.markdown,raw);
   version='{"format":"broken"}';if(width<=800&&await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();await page.locator('#refresh').click();await page.locator('#status-text').filter({hasText:'旧表示を保持'}).waitFor();assert.equal((await record()).document.design.markdown,raw);await dismiss();
   version=raw;await page.reload();await ready();await saved();assert.equal((await record()).document.design.markdown,raw);
   const external=structuredClone(seed),foreign=external.documents.find(d=>d.kind==='checkItems');foreign.basedOn={documentId:'external-bd',revision:'external-r1',verification:'unverified'};foreign.index[0].activityId='external-activity';foreign.sections[0].activityId='external-activity';external.externalDocuments=[{id:'external-bd',kind:'businessDesign',revision:'external-r1',activities:[{id:'external-activity',name:'別原典の業務'}]}];external.sources=[{documentId:'external-bd',revision:'external-r1',sha256:'0'.repeat(64),uri:'https://example.test/external.json'}];const externalRaw=JSON.stringify(external);
   await file(externalRaw);await page.locator('.node').first().waitFor();await saved();assert.equal((await record()).document.design.markdown,externalRaw);await selectGraphNode(page,'c-guidance');if(!await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();await page.locator('#detail-mode-checks').click();const foreignView=await page.locator('.json-checks').innerText();assert.match(foreignView,/別の原典BDを参照/);assert.doesNotMatch(foreignView,/人間レビュー状態: 確認済み/);
   assert.deepEqual(errors,[]);assert.deepEqual(nonGET,[]);results.push({width,fileInput:true,detail:true,checkState:check.items[0].reviewState,checkVerification:'unverified',state:'S1',stateVerification:'unverified',externalCheckNotAssociated:true,invalidFileCases:4,urlAndInvalidRefresh:true,reload:true,nonGET,pageErrors:errors});
  }catch(error){await page.screenshot({path:`${out}/json-05-failure-${width}.png`}).catch(()=>{});throw error;}finally{await context.close();writeFileSync(`${out}/json-05-results.json`,JSON.stringify({browser:browser.version(),results},null,2));}
 }
 return {browser:browser.version(),results,limits:'Synthetic input; emulated narrow viewport; OS picker, physical mobile and human approval are separate.'};
}
