import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

// Real-browser geometry check for the structure detail drawer. The fixture is
// fulfilled locally and no external service or user document is contacted.
export async function verifyStructureSampleHeader(browser){
 const raw=readFileSync('../business-design/alder/json-complete-concept-review.json','utf8');
 const fixture='https://fixture.test/structure-sample-header.json',results=[];
 for(const width of [1280,393]){
  const context=await browser.newContext({viewport:{width,height:600}}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  try{
   await context.route(fixture,route=>route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:raw}));
   await page.goto('http://127.0.0.1:4173/?view=concept&concept=structure-explorer%3An-bd#source='+encodeURIComponent(fixture));
   const root=page.locator('.structure-explorer:not([hidden]) .structure-root > [data-concept-id="n-bd"] > details > summary');await root.waitFor({state:'visible',timeout:30000});
   if(await page.locator('#check-followup').isVisible())await page.locator('#check-followup-later').click();
   if(await page.locator('#node-list-drawer').isVisible())await page.locator('#node-list-toggle').click();
   await root.click();const panel=page.locator('#concept-related-panel');if(!await panel.isVisible())await page.locator('#drawer').click();
   const body=panel.locator('.concept-drawer-body'),table=body.locator('table.structure-attribute-table'),header=table.locator('thead th').first();await header.waitFor({state:'visible'});
   const revision=table.locator('tr[data-information-id="n-bd-field-3"]');
   const revisionRow=await revision.count()?revision:table.locator('tr').filter({hasText:'論理名：revision'});
   assert.equal(await revisionRow.locator('td').first().innerText(),'bd-review-1');assert.doesNotMatch(await revisionRow.innerText(),/alder-design-1|参考の出所|参考：/);
   const before=await body.evaluate(el=>{const header=el.querySelector('thead th'),table=el.querySelector('table');return {top:el.getBoundingClientRect().top,headerTop:header.getBoundingClientRect().top,tableBottom:table.getBoundingClientRect().bottom,available:el.scrollHeight-el.clientHeight};});
   assert(before.available>0,'fixture must actually scroll');
   await body.evaluate(el=>{const delta=el.querySelector('thead th').getBoundingClientRect().top-el.getBoundingClientRect().top;el.scrollTop=Math.min(el.scrollHeight-el.clientHeight,delta+75);});
   const after=await body.evaluate(el=>{const header=el.querySelector('thead th'),table=el.querySelector('table'),body=el.getBoundingClientRect(),head=header.getBoundingClientRect(),t=table.getBoundingClientRect(),style=getComputedStyle(header),wrap=getComputedStyle(table.parentElement);return {scrollTop:el.scrollTop,bodyTop:body.top,bodyLeft:body.left,bodyRight:body.right,headerTop:head.top,headerBottom:head.bottom,tableBottom:t.bottom,tableLeft:t.left,tableRight:t.right,position:style.position,background:style.backgroundColor,wrapOverflowX:wrap.overflowX};});
   assert(after.scrollTop>0);assert.equal(after.position,'sticky');assert(Math.abs(after.headerTop-after.bodyTop)<2,'header stays at the drawer top');assert(after.tableBottom>after.headerBottom,'header stays in the table bounds');assert.notEqual(after.background,'rgba(0, 0, 0, 0)');assert.equal(after.wrapOverflowX,'visible');
   assert(after.tableLeft>=after.bodyLeft-1&&after.tableRight<=after.bodyRight+1,'table fits within the drawer');
   assert.deepEqual(await table.locator('thead th').allTextContents(),['項目','サンプル','説明']);
   await page.locator('#theme').click();assert.notEqual(await header.evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(0, 0, 0, 0)','sticky heading remains opaque in dark mode');
   assert.deepEqual(errors,[]);results.push({width,drawerScrollTop:after.scrollTop,headerTop:after.headerTop,bodyTop:after.bodyTop,tableFits:true});
  }finally{await context.close();}
 }
 return {browser:browser.version(),results};
}
