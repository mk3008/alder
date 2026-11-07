import assert from 'node:assert/strict';
import {mkdirSync,readFileSync} from 'node:fs';

export async function verifyConceptValueDomains(browser){
 const raw=readFileSync('../business-design/alder/json-complete-concept-review.json','utf8');
 const fixture='https://fixture.test/concept-value-domains.json',out='web/evidence/concept-value-domains',results=[];mkdirSync(out,{recursive:true});
 for(const width of [1280,393]){
  const context=await browser.newContext({viewport:{width,height:720}}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  try{
   await context.route(fixture,route=>route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:raw}));
   await page.goto('http://127.0.0.1:4173/?view=concept&concept=structure-explorer%3An-who#source='+encodeURIComponent(fixture));
   const content=page.locator('.structure-detail-page:not([hidden])');await content.waitFor({state:'visible',timeout:30000});
   if(await page.locator('#check-followup').isVisible())await page.locator('#check-followup-later').click();
   if(await page.locator('#status').isVisible())await page.locator('#status-close').click();
   const table=content.locator('table.structure-attribute-table'),kind=table.locator('tr[data-information-id="n-who-field-2"]');await kind.waitFor({state:'visible'});
   assert.match(await kind.innerText(),/型：列挙/);for(const label of ['role：人が担う役割','system：自動実行するシステム','scheduler：スケジューラー'])assert((await kind.innerText()).includes(label));
   assert.equal(await kind.locator('.structure-domain-values li').count(),3);assert.match(await kind.innerText(),/未決/);
   const bounds=await kind.evaluate(row=>{const table=row.closest('table'),a=table.getBoundingClientRect(),b=row.querySelector('th').getBoundingClientRect();return{tableWidth:a.width,cellWidth:b.width,cellOverflow:row.querySelector('th').scrollWidth>row.querySelector('th').clientWidth+1,pageOverflow:document.documentElement.scrollWidth>innerWidth};});
   assert(!bounds.cellOverflow,'value labels remain within the item cell');assert(!bounds.pageOverflow,'page does not overflow');
   await kind.scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/who-${width}.png`});
   await kind.locator('button').click();assert((await content.innerText()).includes('型名\n列挙'));const text=await content.innerText();for(const label of ['role：人が担う役割','system：自動実行するシステム','scheduler：スケジューラー'])assert(text.includes(label));assert(text.includes('サンプル\nrole'));assert(text.includes('null許容\n許容しない'));
   await page.screenshot({path:`${out}/detail-${width}.png`});await content.locator('.structure-attribute-back').click();assert(await table.isVisible());
   await page.locator('#theme').click();assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');assert((await kind.innerText()).includes('scheduler：スケジューラー'));
   assert.deepEqual(errors,[]);results.push({width,...bounds,choices:3});
  }finally{await context.close();}
 }
 return {browser:browser.version(),results};
}
