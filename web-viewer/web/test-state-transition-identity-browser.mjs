import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stateCaptionSnapshot,assertStateCaptionRows} from './caption-row-oracle.mjs';
import {loadPurchaseReview} from './purchase-review-browser.mjs';

export async function verifyStateTransitionIdentity(browser){
 const raw=readFileSync('../work/concept-review/issue-133/versions/purchase-v2-beta.json','utf8'),pkg=JSON.parse(raw),st=pkg.documents.find(d=>d.kind==='stateTransition');
 const results=[];
 for(const width of [1280,393]){
  const context=await browser.newContext({viewport:{width,height:960}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.goto('http://127.0.0.1:4173/');await loadPurchaseReview(page);
   if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();
   await page.locator('[data-explorer-key="states:'+st.objectId+'"]').click();await page.locator('.state-diagram').waitFor();
   for(const theme of ['light','dark']){
    if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();
    const edges=await page.locator('.state-diagram path.edge[data-transitions]').evaluateAll(es=>es.map(e=>e.dataset.transitions));
    assert.deepEqual(edges.sort(),st.transitions.map(t=>t.sourceId).sort(),'every explicit transition has one independent route');
    const labels=await page.locator('.state-diagram [data-transition-id]').evaluateAll(es=>es.map(e=>({id:e.dataset.transitionId,text:e.textContent,members:[...e.querySelectorAll('tspan')].map(t=>t.dataset.transitions)})));
    assert.equal(labels.length,st.transitions.length);
    for(const row of st.transitions){const l=labels.find(l=>l.id===row.sourceId),to=st.states.find(s=>s.id===row.toId)?.name??({'@none':'作成なし','@unknown':'未決'}[row.toId]??row.toId);assert(l.text.includes(row.condition));assert(l.text.includes(' → '+to));assert(!l.text.includes('通常'));assert(l.members.every(id=>id===row.sourceId));}
    const modelRows=st.transitions.map(t=>({id:t.sourceId,from:st.states.find(s=>s.id===t.fromId)?.name??t.fromId}));
    assertStateCaptionRows(await page.locator('.state-diagram').evaluate(stateCaptionSnapshot),modelRows);
    await page.locator('[data-state="終結"]').press('Enter');
    for(const id of ['T15','T16','T17','T18']){const expected=['T16','T18'].includes(id),classes=await page.locator('[data-transition-id="'+id+'"] tspan').evaluateAll(es=>es.map(e=>e.classList.contains('review-related')));assert(classes.every(x=>x===expected));}
    await page.locator('[data-transition-id="T15"]').scrollIntoViewIfNeeded();
    await page.screenshot({path:`web/evidence/json-states/condition-identity-${width}-${theme}.png`});
    await page.keyboard.press('Escape');
   }
   const svg=await page.locator('.state-diagram').evaluate(e=>e.outerHTML);
   const bad=structuredClone(pkg),doc=bad.documents.find(d=>d.kind==='stateTransition'),row=doc.transitions.find(t=>t.sourceId==='T15');
   doc.transitions.push({...row,id:'ambiguous-operation',sourceId:'T99',toId:doc.transitions.find(t=>t.sourceId==='T16').toId});
   await page.locator('#fallback').setInputFiles({name:'invalid-states.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(bad))});
   await page.locator('#status-text').filter({hasText:'Duplicate state transition condition'}).waitFor();
   assert.equal(await page.locator('.state-diagram').evaluate(e=>e.outerHTML),svg,'invalid source retains the accepted diagram');
   await page.waitForFunction(()=>['saved','unchanged'].includes(document.querySelector('#app').dataset.saveState));await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('.state-diagram').waitFor();
   assert.equal(await page.locator('.state-diagram [data-transition-id]').count(),st.transitions.length);assert.equal(await page.locator('[data-transition-id="T99"]').count(),0);
   assert.deepEqual(errors,[]);results.push({width,themes:['light','dark'],transitions:st.transitions.length,oneCaptionPerTransition:true,conditionSpecificSelection:true,invalidReadPreserved:true,reload:true});
  }finally{await context.close();}
 }
 return {checks:'STATE-IDENTITY-001..006: actual purchase JSON, singular routes and conditions, state-specific highlighting, shared spacing, invalid-read preservation',results};
}
