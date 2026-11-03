import assert from 'node:assert/strict';
import {mkdirSync,readFileSync} from 'node:fs';
import {showTestChecks,showBusinessOverview} from './test-spec-explorer-browser.mjs';

// The public JSON is the input: no sample Test results or file locations are invented.
export async function verifyActivityTestSpec(browser){
 const raw=readFileSync('../examples/molkky/business-design.json','utf8'),pkg=JSON.parse(raw);
 const bd=pkg.documents.find(doc=>doc.kind==='businessDesign'),checks=pkg.documents.find(doc=>doc.kind==='checkItems');
 const output='web/evidence/json-document';mkdirSync(output,{recursive:true});const results=[];
 for(const width of [1280,393]){
  const context=await browser.newContext({viewport:{width,height:960}}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  try{
   await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);
   await page.locator('#fallback').setInputFiles({name:'molkky.json',mimeType:'application/json',buffer:Buffer.from(raw)});
   await page.locator('.node').first().waitFor();if(await page.locator('#check-followup').isVisible())await page.locator('#check-followup-later').click();
   await showTestChecks(page,bd.activities[0].id);
   assert.equal(await page.locator('.activity-test-spec h1').textContent(),bd.activities[0].name);
   assert.equal(await page.locator('.spec-tabs .tab').count(),1);
   assert.equal(await page.locator('.activity-test-check').count(),checks.index.find(row=>row.activityId===bd.activities[0].id).checkIds.length);
   assert.match(await page.locator('.activity-test-status').innerText(),/未確認/);
   assert.equal(await page.locator('#tests-workspace [aria-label="テスト成功"],#tests-workspace [aria-label="テスト失敗"]').count(),0);
   assert.ok(await page.locator('.activity-test-section table').count()>0);
   assert.equal(await page.locator('.activity-test-toc').isVisible(),width>800);
   const layout=await page.locator('.activity-test-spec').evaluate(spec=>{
    const header=spec.querySelector('.activity-test-header'),content=spec.closest('.test-spec-page'),workspace=spec.closest('#tests-workspace');
    return {headerTag:header.tagName,headerColor:getComputedStyle(header).color,workspaceColor:getComputedStyle(workspace).color,contentWidth:content.clientWidth,contentScrollWidth:content.scrollWidth,headerWidth:header.getBoundingClientRect().width,tableOverflow:[...spec.querySelectorAll('table')].map(table=>getComputedStyle(table).overflowX)};
   });
   assert.notEqual(layout.headerTag,'HEADER','the page heading must not inherit the application header styles');
   assert.equal(layout.headerColor,layout.workspaceColor,'the page heading uses the document text color');
   assert.ok(layout.headerWidth<=layout.contentWidth+2&&layout.contentScrollWidth<=layout.contentWidth+2,'the reading area fits the viewport');
   if(width<=800)assert.ok(layout.tableOverflow.every(value=>value==='auto'),'wide tables scroll within the reading area');
   await page.screenshot({path:`${output}/activity-test-spec-${width}.png`});
   if(width>800){
    await page.locator('.activity-test-toc button').filter({hasText:'MK-03'}).click();
    await page.waitForFunction(()=>document.activeElement?.dataset.checkId==='MK-03');
    assert.equal(await page.locator('.activity-test-toc button[aria-current="location"]').textContent(),'MK-03');
    await page.screenshot({path:`${output}/activity-test-spec-check-${width}.png`});
    await page.locator('.activity-test-toc button').filter({hasText:'テスト'}).click();
    assert.equal(await page.locator('.activity-test-toc button[aria-current="location"]').textContent(),'テスト');
    await page.screenshot({path:`${output}/activity-test-spec-evidence-${width}.png`});
   }
   await showTestChecks(page,bd.activities[0].id);assert.equal(await page.locator('.spec-tabs .tab').count(),1);
   await showTestChecks(page,bd.activities[1].id);assert.equal(await page.locator('.spec-tabs .tab').count(),2);
   await page.waitForFunction(()=>['saved','unchanged'].includes(document.querySelector('#app')?.dataset.saveState));await page.reload();
   await page.waitForFunction(()=>!document.querySelector('#open').disabled);
   assert.equal(await page.locator('.activity-test-spec h1').textContent(),bd.activities[1].name);
   assert.equal(await page.locator('.spec-tabs .tab').count(),2);
   await showBusinessOverview(page);assert.deepEqual(errors,[]);results.push({width,activityTabs:true,examples:true,unverifiedEvidence:true,toc:width>800,reload:true});
  }finally{await context.close();}
 }
 return results;
}
