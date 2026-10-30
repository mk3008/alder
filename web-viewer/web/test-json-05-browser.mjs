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
   // B-valid 0.5: same condition and same destination, plus an unresolved
   // destination, must survive the ordinary file, URL and restore paths.
   const duplicate=structuredClone(seed),dupState=duplicate.documents.find(d=>d.kind==='stateTransition'),first=dupState.transitions[0];
   dupState.transitions.push({...first,id:'compat-same-target',sourceId:'S2',note:'同条件の別遷移は未確認'},{...first,id:'compat-unresolved',sourceId:'S3',toId:'@unknown',effect:'constraint',note:'到着先は未決'});
   const dupRaw=JSON.stringify(duplicate),awaitStored=expected=>page.waitForFunction(expected=>new Promise((resolve,reject)=>{const r=indexedDB.open('alder-web-viewer',1);r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,tx=db.transaction('session'),get=tx.objectStore('session').get('current');tx.oncomplete=()=>{db.close();resolve(get.result?.document?.design?.markdown===expected);};tx.onerror=()=>reject(tx.error);};}),expected);
   const showStates=async()=>{if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();await page.locator(`[data-explorer-key="states:${state.objectId}"]`).click();await page.locator('#states-workspace .state-diagram').waitFor();};
   const verifySeparate=async()=>{
    const paths=await page.locator('#states-workspace path.edge[data-transitions]').evaluateAll(es=>es.map(e=>{const first=e.getPointAtLength(0),last=e.getPointAtLength(e.getTotalLength());return {id:e.dataset.transitions,d:e.getAttribute('d'),first:[first.x,first.y],last:[last.x,last.y]};}));
    assert.deepEqual(paths.map(e=>e.id),['S1','S2','S3']);assert.equal(new Set(paths.map(e=>e.d)).size,3,'same-endpoint transitions have separate routes');
    assert.notDeepEqual(paths[0].first,paths[1].first,'same-endpoint transitions depart separately');assert.notDeepEqual(paths[0].last,paths[1].last,'same-endpoint transitions arrive separately');
    const captions=await page.locator('#states-workspace [data-transition-id]').evaluateAll(es=>es.map(e=>({id:e.dataset.transitionId,text:e.textContent,rows:[...e.querySelectorAll('tspan')].map(t=>t.dataset.transitions)})));
    assert.deepEqual(captions.map(e=>e.id),['S1','S2','S3']);for(const c of captions){assert(c.text.includes('案内を記録'));assert(c.rows.every(id=>id===c.id));}assert(captions[2].text.includes('未決'));
    const overlaps=await page.locator('#states-workspace .state-diagram').evaluate(svg=>{const paths=[...svg.querySelectorAll('path.edge[data-transitions]')],labels=[...svg.querySelectorAll('[data-transition-id]')],out=[];for(const label of labels){const box=label.getBBox();for(const path of paths){const length=path.getTotalLength();for(let d=0;d<=length;d+=1){const p=path.getPointAtLength(d);if(p.x>box.x&&p.x<box.x+box.width&&p.y>box.y&&p.y<box.y+box.height){out.push(`${label.dataset.transitionId}/${path.dataset.transitions}`);break;}}}}return out;});assert.deepEqual(overlaps,[],'the separate paths do not cross caption text in this fixture');
    await page.locator('#states-workspace summary').filter({hasText:'操作の詳細（3）'}).click();assert.equal(await page.locator('#states-workspace li[data-transition]').count(),3);assert.match(await page.locator('#states-workspace li[data-transition="S3"]').innerText(),/到着先は未決/);
    const current=await record();assert.equal(current.document.design.markdown,dupRaw);assert.deepEqual(current.document.design.model.states[0].transitions,dupState.transitions);assert.equal(current.document.design.model.states[0].basedOn.verification,'unverified');
   };
   await file(dupRaw);await awaitStored(dupRaw);await showStates();await verifySeparate();await page.screenshot({path:`${out}/json-05-same-condition-${width}.png`});
   if(width<=800&&await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();version=dupRaw;await openSourceAction(page,'open-url');await page.locator('#source-url').fill(url);await page.locator('#source-submit').click();await page.locator('#source-dialog').waitFor({state:'hidden'});await awaitStored(dupRaw);await showStates();
   await page.reload();await ready();await page.locator('#states-workspace .state-diagram').waitFor();await verifySeparate();
   const external=structuredClone(seed),foreign=external.documents.find(d=>d.kind==='checkItems');foreign.basedOn={documentId:'external-bd',revision:'external-r1',verification:'unverified'};foreign.index[0].activityId='external-activity';foreign.sections[0].activityId='external-activity';external.externalDocuments=[{id:'external-bd',kind:'businessDesign',revision:'external-r1',activities:[{id:'external-activity',name:'別原典の業務'}]}];external.sources=[{documentId:'external-bd',revision:'external-r1',sha256:'0'.repeat(64),uri:'https://example.test/external.json'}];const externalRaw=JSON.stringify(external);
   await file(externalRaw);await page.locator('.node').first().waitFor();await saved();assert.equal((await record()).document.design.markdown,externalRaw);await selectGraphNode(page,'c-guidance');if(!await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();await page.locator('#detail-mode-checks').click();const foreignView=await page.locator('.json-checks').innerText();assert.match(foreignView,/別の原典BDを参照/);assert.doesNotMatch(foreignView,/人間レビュー状態: 確認済み/);
   assert.deepEqual(errors,[]);assert.deepEqual(nonGET,[]);results.push({width,fileInput:true,detail:true,checkState:check.items[0].reviewState,checkVerification:'unverified',state:'S1',stateVerification:'unverified',sameConditionTransitions:['S1','S2','S3'],sameConditionFileURLRestore:true,externalCheckNotAssociated:true,invalidFileCases:4,urlAndInvalidRefresh:true,reload:true,nonGET,pageErrors:errors});
  }catch(error){await page.screenshot({path:`${out}/json-05-failure-${width}.png`}).catch(()=>{});throw error;}finally{await context.close();writeFileSync(`${out}/json-05-results.json`,JSON.stringify({browser:browser.version(),results},null,2));}
 }
 return {browser:browser.version(),results,limits:'Synthetic input; emulated narrow viewport; OS picker, physical mobile and human approval are separate.'};
}
