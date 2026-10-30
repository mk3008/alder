import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {loadPurchaseReview} from './purchase-review-browser.mjs';
import {openSourceAction} from './source-menu-browser.mjs';

// Exercise the normal input and navigation paths, without purchase-only product hooks.
export async function verifyUnifiedConcept(browser){
 const context=await browser.newContext({viewport:{width:1280,height:960}}),page=await context.newPage(),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('dialog',async dialog=>{errors.push('Unexpected dialog: '+dialog.type());await dialog.dismiss();});
 const source=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v3-beta.json','utf8'));
 const other=structuredClone(source),model=other.documents.find(item=>item.kind==='conceptModel');
 model.reviewGroups[0].title='別業務のまとまり';model.concepts[0].name='別業務の情報';model.reviewGroups[0].graph.nodes[0].name='別業務の情報';
 model.reviewGroups[0].capabilities[0].samples[0].name='別業務の例';
 const absent=structuredClone(source);absent.documents=absent.documents.filter(item=>item.kind!=='conceptModel');
 const invalid=structuredClone(other);invalid.documents.find(item=>item.kind==='conceptModel').basedOn.revision='stale';
 const injection=structuredClone(other),payload='<img src=x onerror=alert(1)>';
 injection.documents.find(item=>item.kind==='conceptModel').reviewGroups[0].title=payload;
 const file=async(name,data)=>{await page.locator('#fallback').setInputFiles({name,mimeType:'application/json',buffer:Buffer.from(JSON.stringify(data))});await page.waitForFunction(()=>!document.querySelector('#open').disabled);};
 const saved=()=>page.waitForFunction(()=>['saved','unchanged'].includes(document.querySelector('#app')?.dataset.saveState));
 try{
  await loadPurchaseReview(page);
  assert.ok(await page.locator('#explorer-business-activity .explorer-item').count());
  assert.ok(await page.locator('#explorer-states .explorer-item').count());
  await page.locator('[data-explorer-key="concept:group-request"]').click();
  const group=page.frameLocator('iframe[data-concept-view="group-request"]');await group.locator('[data-node="request"]').waitFor();
  await group.locator('[data-concept-open="request"]').click();
  const focus=page.frameLocator('iframe[data-concept-view="request"]');await focus.locator('[data-node="request"]').waitFor();
  assert.equal(await focus.locator('[data-node="request"] [data-concept-open="request"]').count(),0);
  assert.ok(await focus.locator('[data-concept-open="version"]').count());
  await saved();await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);
  await focus.locator('[data-node="request"]').waitFor();assert.equal(await page.locator('#concept-tab-request').getAttribute('aria-current'),'true');
  await page.goBack();await page.locator('#concept-tab-group-request[aria-current="true"]').waitFor();

  await file('other.json',other);await page.getByRole('button',{name:'別業務のまとまり',exact:true}).waitFor();
  assert.equal(await page.getByRole('button',{name:'購入要求・申請内容',exact:true}).count(),0);
  await page.getByRole('button',{name:'別業務のまとまり',exact:true}).click();
  await page.frameLocator('iframe[data-concept-view="group-request"]').locator('[data-node="request"]').waitFor();
  if(await page.locator('#drawer').getAttribute('aria-expanded')!=='true')await page.locator('#drawer').click();
  assert.ok((await page.locator('.data-review-overview').textContent()).includes('別業務の例'));
  await file('invalid.json',invalid);await page.locator('#status-text').filter({hasText:'表示できません'}).waitFor();
  assert.ok((await page.locator('.data-review-overview').textContent()).includes('別業務の例'),'invalid input preserves the previous document');
  await file('without-concept.json',absent);await page.waitForFunction(()=>!document.querySelector('[data-explorer-key="concept:group-request"]'));
  assert.equal(await page.getByRole('button',{name:'別業務のまとまり',exact:true}).count(),0);

  await file('untrusted.json',injection);await page.getByRole('button',{name:payload,exact:true}).waitFor();
  assert.equal(await page.locator('img[src="x"]').count(),0,'JSON title remains text');
  const url='https://fixture.test/unified.json';let requests=0;
  await page.route(url,route=>{requests++;return route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify(source)});});
  await openSourceAction(page,'open-url');await page.locator('#source-url').fill(url);await page.locator('#source-submit').click();
  await page.waitForFunction(()=>document.querySelector('#source-dialog').hidden);await page.getByRole('button',{name:'購入要求・申請内容',exact:true}).waitFor();
  await page.locator('[data-explorer-key="concept:group-request"]').click();await saved();await page.reload();
  await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('#concept-tab-group-request[aria-current="true"]').waitFor();
  assert.ok(requests>=2,'URL source is rechecked after reload');assert.deepEqual(errors,[]);
  return {checks:'single JSON through File/URL, all views, current/neighbor links, Back/reload, document isolation, invalid-input preservation and safe text',pageErrors:errors};
 }finally{await context.close();}
}
