import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stateCaptionSnapshot,assertStateCaptionRows} from './caption-row-oracle.mjs';
import {stateCaptionGeometry,assertStateCaptionPlacement} from './caption-placement-oracle.mjs';
import {loadPurchaseReview} from './purchase-review-browser.mjs';

export async function verifyStateTransitionIdentity(browser){
 const raw=readFileSync('../work/concept-review/issue-133/versions/purchase-v2-beta.json','utf8'),pkg=JSON.parse(raw),st=pkg.documents.find(d=>d.kind==='stateTransition');
 const results=[];
 for(const width of [1280,393]){
  const context=await browser.newContext({viewport:{width,height:960}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.goto('http://127.0.0.1:4173/');await loadPurchaseReview(page);
   if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();
   await page.locator('[data-explorer-key="states:'+st.objectId+'"]').click();await page.locator('#states-workspace .state-diagram').waitFor();
   for(const theme of ['light','dark']){
    if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();
    const edges=await page.locator('#states-workspace .state-diagram path.edge[data-transitions]').evaluateAll(es=>es.map(e=>e.dataset.transitions));
    assert.deepEqual(edges.sort(),st.transitions.map(t=>t.sourceId).sort(),'every explicit transition has one independent route');
    const selfRoutes=await page.locator('#states-workspace .state-diagram path.edge[data-transitions]').evaluateAll(es=>es.filter(e=>['T08','T19'].includes(e.dataset.transitions)).map(e=>e.getAttribute('d')));
    assert.equal(selfRoutes.length,2);assert.notEqual(selfRoutes[0],selfRoutes[1],'distinct self-return IDs have separate paths');
    const labels=await page.locator('#states-workspace .state-diagram [data-transition-id]').evaluateAll(es=>es.map(e=>({id:e.dataset.transitionId,text:e.textContent,members:[...e.querySelectorAll('tspan')].map(t=>t.dataset.transitions)})));
    assert.equal(labels.length,st.transitions.length);
    for(const row of st.transitions){const l=labels.find(l=>l.id===row.sourceId);assert(l.text.includes(pkg.documents.find(d=>d.kind==='businessDesign').activities.find(a=>a.id===row.activityId).name));if(row.conditionLabel)assert(l.text.includes(row.conditionLabel));assert(!l.text.includes('通常'));assert(l.members.every(id=>id===row.sourceId));}
    assert.equal(labels.find(l=>l.id==='T12').text,'購入を準備する');assert.equal(labels.find(l=>l.id==='T14').text,'購入申請を承認する（例外：承認後差戻し）');
    const modelRows=st.transitions.map(t=>({id:t.sourceId,from:st.states.find(s=>s.id===t.fromId)?.name??t.fromId}));
    assertStateCaptionRows(await page.locator('#states-workspace .state-diagram').evaluate(stateCaptionSnapshot),modelRows);
    assertStateCaptionPlacement(await page.locator('#states-workspace .state-diagram').evaluate(stateCaptionGeometry),modelRows);
    const native=await page.locator('#states-workspace .state-diagram').evaluate(svg=>{
     const boxes=[...svg.querySelectorAll('.state-diagram-edge-label')].map(e=>{const b=e.getBBox();return{id:e.dataset.transitionId,x:b.x,y:b.y,width:b.width,height:b.height};});
     const nodes=[...svg.querySelectorAll('[data-state] rect.state-diagram-node')].map(e=>{const b=e.getBBox();return{x:b.x,y:b.y,width:b.width,height:b.height};});
     const overlap=(a,b)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
     return{labelPairs:boxes.flatMap((b,i)=>boxes.slice(i+1).filter(c=>overlap(b,c)).map(c=>[b.id,c.id])),cardPairs:boxes.filter(b=>nodes.some(n=>overlap(b,n))).map(b=>b.id)};
    });
    assert.deepEqual(native.labelPairs,[],'native caption glyphs do not overlap');assert.deepEqual(native.cardPairs,[],'native caption glyphs do not cover states');
    await page.locator('#states-workspace [data-state="購入準備済み"]').press('Enter');
    for(const [id,related]of [['T12',true],['T14',false]])assert((await page.locator(`#states-workspace [data-transition-id="${id}"] tspan`).evaluateAll(es=>es.map(e=>e.classList.contains('review-related')))).every(v=>v===related));
    await page.locator('#states-workspace [data-state="差戻し"]').press('Enter');
    for(const [id,related]of [['T12',false],['T14',true]])assert((await page.locator(`#states-workspace [data-transition-id="${id}"] tspan`).evaluateAll(es=>es.map(e=>e.classList.contains('review-related')))).every(v=>v===related));
    assert(await page.locator('#states-workspace .state-diagram').evaluate(svg=>{const order=[...svg.children],labels=[...svg.querySelectorAll('.state-diagram-edge-label')],paints=[...svg.querySelectorAll('[data-exception-paint]')];return paints.length>0&&paints.every(p=>labels.every(label=>order.indexOf(p)<order.indexOf(label)));}),'selected dashed paint is behind captions');
    await page.locator('#states-workspace [data-transition-id="T14"]').scrollIntoViewIfNeeded();
    await page.screenshot({path:`web/evidence/json-states/caption-placement-${width}-${theme}.png`});
    await page.locator('#states-workspace [data-state="終結"]').press('Enter');
    for(const id of ['T15','T16','T17','T18']){const expected=['T16','T18'].includes(id),classes=await page.locator('#states-workspace [data-transition-id="'+id+'"] tspan').evaluateAll(es=>es.map(e=>e.classList.contains('review-related')));assert(classes.every(x=>x===expected));}
    await page.locator('#states-workspace [data-transition-id="T15"]').scrollIntoViewIfNeeded();
    await page.screenshot({path:`web/evidence/json-states/condition-identity-${width}-${theme}.png`});
    await page.keyboard.press('Escape');
   }
   const svg=await page.locator('#states-workspace .state-diagram').evaluate(e=>e.outerHTML);
   const bad=structuredClone(pkg),doc=bad.documents.find(d=>d.kind==='stateTransition'),row=doc.transitions.find(t=>t.sourceId==='T15');
   doc.transitions.push({...row,id:'ambiguous-operation',sourceId:'T99',toId:doc.transitions.find(t=>t.sourceId==='T16').toId});
   await page.locator('#fallback').setInputFiles({name:'invalid-states.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(bad))});
   await page.locator('#status-text').filter({hasText:'Duplicate state transition condition'}).waitFor();
   assert.equal(await page.locator('#states-workspace .state-diagram').evaluate(e=>e.outerHTML),svg,'invalid source retains the accepted diagram');
   await page.waitForFunction(()=>['saved','unchanged'].includes(document.querySelector('#app').dataset.saveState));await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('#states-workspace .state-diagram').waitFor();
   assert.equal(await page.locator('#states-workspace .state-diagram [data-transition-id]').count(),st.transitions.length);assert.equal(await page.locator('#states-workspace [data-transition-id="T99"]').count(),0);
   assert.deepEqual(errors,[]);results.push({width,themes:['light','dark'],transitions:st.transitions.length,oneCaptionPerTransition:true,conditionSpecificSelection:true,invalidReadPreserved:true,reload:true});
  }finally{await context.close();}
 }
 return {checks:'STATE-IDENTITY-001..006: actual purchase JSON, singular routes and conditions, state-specific highlighting, shared spacing, invalid-read preservation',results};
}
