import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
import {selectGraphNode} from './graph-selection-browser.mjs';

export async function verifyProcedureContinuity(browser){
 const draft=readFileSync('../tools/document_storage/examples/continuity-draft-v06.json','utf8');
 const paper=readFileSync('../tools/document_storage/examples/paper-manual-v06.json','utf8');
 const results=[];mkdirSync('web/evidence/json-document',{recursive:true});
 for(const width of [1280,393]){
  const context=await browser.newContext({viewport:{width,height:960}}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  const file=source=>page.locator('#fallback').setInputFiles({name:'candidate.json',mimeType:'application/json',buffer:Buffer.from(source)});
  const openDrawer=async()=>{if(!await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();};
  try{
   await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);
   await file(draft);await page.locator('[data-node="fill"]').waitFor();await selectGraphNode(page,'fill');await openDrawer();
   const details=page.locator('.json-detail');for(const value of ['発生条件','下書きとして保存','再開条件','下書きを探して開き','再開する手順'])assert.ok((await details.innerText()).includes(value),value);
   assert.deepEqual(await details.locator('[data-procedure-table] th').allTextContents(),['Step','From','To','Data','Action']);
   assert.equal(await details.locator('[data-procedure-table] tbody tr').count(),1);
   const scroller=details.locator('[data-procedure-scroll]');assert.equal(await scroller.getAttribute('role'),'region');assert.equal(await scroller.getAttribute('tabindex'),'0');assert.match(await details.innerText(),/表は左右にスクロールできます/);
   const geometry=await scroller.evaluate(el=>({client:el.clientWidth,scroll:el.scrollWidth,overflow:getComputedStyle(el).overflowX,headings:[...el.querySelectorAll('th')].map(th=>th.getBoundingClientRect().width),rowHeight:el.querySelector('tbody tr').getBoundingClientRect().height,tableWidth:el.querySelector('table').getBoundingClientRect().width}));assert.equal(geometry.overflow,'auto');assert.ok(geometry.scroll>geometry.client);assert.ok(geometry.headings.every(n=>n>=50));assert.ok(geometry.rowHeight<80,`short row height: ${geometry.rowHeight}`);assert.ok(geometry.tableWidth<640,`table width: ${geometry.tableWidth}`);
   assert.ok(await scroller.evaluate(el=>{el.scrollLeft=el.scrollWidth;return el.scrollLeft>0;}));await scroller.evaluate(el=>{el.scrollLeft=0;});
   const row=details.locator('[data-procedure-table] tbody tr').first(),dataCell=row.locator('td').nth(3),actionCell=row.locator('td').nth(4);const dataText=await dataCell.innerText();assert.equal((dataText.match(/申請内容/g)??[]).length,1);assert.doesNotMatch(dataText,/記入した内容/);assert.equal(await dataCell.locator('.procedure-data-list > li').count(),1);assert.equal((await actionCell.innerText()).trim(),'記入する');
   await dataCell.locator('summary').click();assert.match(await dataCell.innerText(),/記入した内容/);await dataCell.locator('summary').press('Enter');assert.doesNotMatch(await dataCell.innerText(),/記入した内容/);await scroller.evaluate(el=>{el.scrollLeft=0;});
   await page.screenshot({path:`web/evidence/json-document/procedure-continuity-${width}.png`});
   const bad=JSON.parse(draft);bad.documents[0].exceptions[0].continuity.resumeAtStepId='missing';await file(JSON.stringify(bad));
   await page.locator('#status-text').filter({hasText:'開けません'}).waitFor();assert.equal(await page.locator('[data-node="fill"]').count(),1);
   if(await page.locator('#status-close').isVisible())await page.locator('#status-close').click();
   if(width<=800&&await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
   await file(paper);await page.locator('[data-node="copy"]').waitFor();await selectGraphNode(page,'copy');await openDrawer();
   assert.equal(await details.locator('[data-procedure-table] tbody tr').count(),2);assert.match(await details.innerText(),/作業者/);assert.match(await details.innerText(),/紙/);assert.doesNotMatch(await details.innerText(),/記載成功|返す/);const paperRows=details.locator('[data-procedure-table] tbody tr');const readAction=await paperRows.nth(0).locator('td').nth(4).innerText();assert.match(readAction,/目視.*受渡し：Input/s);assert.doesNotMatch(readAction,/受渡し：紙/);assert.doesNotMatch(await paperRows.nth(1).locator('td').nth(4).innerText(),/メモ \/ Output|必須/);
   await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);assert.equal(await page.locator('[data-node="copy"]').count(),1);
   const long=JSON.parse(draft),longBD=long.documents[0],longStep=longBD.activities[0].procedure.steps[0];longBD.roles[0].name='非常に長い担当者の役割名を折り返して表示する';longBD.data[0].name='非常に長い申請内容のデータ名称を折り返して表示する';Object.assign(longStep,{action:'非常に長い手順名でも文字を省略せず確認できるよう記入する',method:'画面上で目視し内容を確認する',obligation:'optional',appliesWhen:'内容の確認が必要なとき',effect:'read'});await file(JSON.stringify(long));await page.locator('[data-node="fill"]').waitFor();await selectGraphNode(page,'fill');await openDrawer();const longRow=details.locator('[data-procedure-table] tbody tr').first();for(const value of [longBD.roles[0].name,longBD.data[0].name,longStep.action,'任意','方法：画面上で目視し内容を確認する','適用条件：内容の確認が必要なとき','操作効果：read'])assert.ok((await longRow.innerText()).includes(value),value);for(const index of [1,3,4]){const fit=await longRow.locator('td').nth(index).evaluate(el=>({height:el.clientHeight,content:el.scrollHeight,overflow:getComputedStyle(el).overflow,textOverflow:getComputedStyle(el).textOverflow}));assert.ok(fit.content<=fit.height+1,JSON.stringify(fit));assert.notEqual(fit.overflow,'hidden');assert.notEqual(fit.textOverflow,'ellipsis');}
   assert.deepEqual(errors,[]);results.push({width,normalAndInvalid:true,paperWithoutResponse:true,reload:true,compactRow:true,detailsAvailable:true,longValues:true});
  }finally{await context.close();}
 }
 return {browser:browser.version(),results};
}
