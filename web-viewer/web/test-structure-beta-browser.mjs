import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {reviewSamples} from '../../work/361-beta-fixes/prepare-review-samples.mjs';

export async function verifyStructureBetaFixes(browser,{base='http://127.0.0.1:4173/',published=false,out='web/evidence/structure-beta-fixes'}={}){
 mkdirSync(out,{recursive:true});const results=[];
 const fixture=published?base+'examples/json-complete-concept-review.json':'https://fixture.test/structure-beta.json';
 const url=id=>base+'?preview=1&view=concept&concept='+encodeURIComponent(id)+'#source='+encodeURIComponent(fixture);
 for(const width of [1280,393]){
  const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage(),errors=[];
  page.setDefaultTimeout(15000);
  page.on('pageerror',error=>errors.push(error.message));
  if(!published)await context.route(fixture,route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(reviewSamples())}));
  const showSidebar=async()=>{if(await page.locator('#status-close').isVisible())await page.locator('#status-close').click();if(await page.locator('#check-followup').isVisible())await page.locator('#check-followup-later').click();if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();};
  try{
   await page.goto(url('structure-explorer'));await page.locator('.structure-detail-page:not([hidden]) table').waitFor({timeout:45000});await showSidebar();
   const sidebar=page.locator('#design-explorer');assert.equal(Math.round((await sidebar.boundingBox()).width),280);
   const pending=page.locator('.structure-pending');assert.equal(await pending.textContent(),'null許容が未決：47項目（互換・移行用を含む）');
   const geometry=await pending.evaluate(el=>{const range=document.createRange();range.selectNodeContents(el);const b=el.getBoundingClientRect();return {box:{left:b.left,right:b.right},rects:[...range.getClientRects()].map(r=>({left:r.left,right:r.right})),scroll:el.scrollWidth,client:el.clientWidth};});
   assert(geometry.scroll<=geometry.client);assert(geometry.rects.every(r=>r.left>=geometry.box.left&&r.right<=geometry.box.right),'summary text fits at both edges');
   const tree=page.locator('.structure-tree');await page.getByRole('button',{name:'すべて展開',exact:true}).click();await page.locator('.structure-compatibility-filter input').uncheck();
   const overflow=await tree.evaluate(el=>({scroll:el.scrollWidth,client:el.clientWidth,labels:[...el.querySelectorAll('summary')].filter(s=>s.getClientRects().length&&!s.closest('[hidden]')).flatMap(s=>{const b=el.getBoundingClientRect();return [...s.querySelectorAll('strong')].flatMap(label=>{const range=document.createRange();range.selectNodeContents(label);return [...range.getClientRects()].filter(r=>r.left<b.left||r.right>b.right).map(r=>({text:label.textContent,left:r.left,right:r.right}));});})}));
   assert(overflow.scroll<=overflow.client,JSON.stringify(overflow));assert.deepEqual(overflow.labels,[]);
   assert((await tree.innerText()).includes('適用する判定行'));assert((await tree.innerText()).includes('外部業務設計書の目録'));
   await page.screenshot({path:out+'/tree-'+width+'.png'});
   const search=page.getByRole('searchbox',{name:'構造名・項目名で検索'});await search.fill('performers');await page.getByRole('status').filter({hasText:'検索結果は0件です。'}).waitFor();
   await page.screenshot({path:out+'/zero-'+width+'.png'});await search.fill('実行主体');assert.equal(await page.getByRole('status').filter({hasText:'検索結果は0件です。'}).isVisible(),false);
   const filtered=tree.locator('summary:visible').first();await filtered.focus();await page.keyboard.press('End');assert(await tree.locator('summary:visible').last().evaluate(el=>el===document.activeElement));await page.keyboard.press('Home');assert(await filtered.evaluate(el=>el===document.activeElement));await search.fill('');
   console.log(JSON.stringify({structureBeta:width,stage:'geometry-and-search-passed'}));
   // Reproduce the reported path from the Activity's Who reference with native keys.
   await page.goto(url('structure-explorer'));await page.locator('.structure-detail-page:not([hidden]) table').waitFor();await showSidebar();
   const openStructure=async node=>{
    const row=node.locator(':scope > summary');await row.click();
    if(!await node.evaluate(el=>el.open))await row.press('ArrowRight');
   };
   const bd=tree.locator('.structure-root > li > details > .structure-children > [data-concept-id="n-bd"] > details');await openStructure(bd);
   const activity=bd.locator(':scope > .structure-children > [data-relation-id="nr-bd-activity"] > details');await openStructure(activity);
   assert.equal(await activity.locator(':scope > summary strong').innerText(),'業務');
   const packageTab=page.getByRole('button',{name:'データ構造：構造-文書パッケージ',exact:true});
   const designTab=page.getByRole('button',{name:'データ構造：構造-業務設計書',exact:true});
   const activityTab=page.getByRole('button',{name:'データ構造：構造-業務',exact:true});
   assert.equal(await packageTab.count(),1);assert.equal(await designTab.count(),1);assert.equal(await activityTab.getAttribute('aria-current'),'true');
   if(width<800)await sidebar.getByRole('button',{name:'ナビゲーションを閉じる'}).click();
   const detail=page.locator('.structure-detail-page:not([hidden])');
   await packageTab.click();assert.match(await detail.innerText(),/型名\s+DocumentPackage/);
   await activityTab.click();assert.match(await detail.innerText(),/型名\s+Activity/);
   assert.equal(new URL(page.url()).searchParams.get('concept'),'structure-explorer:n-activity');
   await showSidebar();assert.equal(await activity.evaluate(el=>el.open),true);
   const reference=activity.locator(':scope > .structure-children > [data-relation-id="nr-who-activity"] > details > summary');
   console.log(JSON.stringify({structureBeta:width,stage:'keyboard-reference-ready'}));await reference.focus();const start=await reference.getAttribute('data-structure-selection');
   for(const key of ['ArrowDown','ArrowDown','ArrowRight','ArrowDown','Enter'])await page.keyboard.press(key);
   const selected=tree.locator('.structure-selected');assert.notEqual(await selected.getAttribute('data-structure-selection'),start);assert(await selected.evaluate(el=>document.activeElement===el));
   const selectedId=await selected.evaluate(el=>el.closest('[data-concept-id]').dataset.conceptId);const selection=JSON.parse(await selected.getAttribute('data-structure-selection'));assert.equal(selectedId,selection[1]);
   assert(!(await detail.innerText()).includes('型名\nActivity\n'),'Enter updates detail');
   await page.keyboard.press('Home');const root=tree.locator('.structure-root > li > details > summary');assert(await root.evaluate(el=>document.activeElement===el));await page.keyboard.press('ArrowLeft');assert.equal(await root.evaluate(el=>el.parentElement.open),false);await page.keyboard.press('ArrowRight');assert.equal(await root.evaluate(el=>el.parentElement.open),true);await page.keyboard.press('ArrowRight');const childWasOpen=await page.evaluate(()=>document.activeElement.parentElement.open);await page.keyboard.press('ArrowLeft');if(childWasOpen)await page.keyboard.press('ArrowLeft');assert(await root.evaluate(el=>document.activeElement===el));
   await page.screenshot({path:out+'/keyboard-'+width+'.png'});
   // The reviewed samples must reach the displayed table, including on public Pages.
   await page.goto(url('structure-explorer:n-bd'));await detail.locator('[data-information-id="cf-9b0df810c60eb0"]').waitFor();
   const preface=page.locator('.structure-detail-page:not([hidden]) [data-information-id="cf-9b0df810c60eb0"] td').first();assert.equal(await preface.innerText(),reviewSamples().documents.find(d=>d.kind==='conceptModel').meta.fieldMappings.find(f=>f.informationId==='cf-9b0df810c60eb0').sampleValue);
   if(width<800&&await sidebar.isVisible())await page.locator('#design-explorer .shell-heading button').click();await page.screenshot({path:out+'/samples-'+width+'.png'});
   await page.goto(url('overview'));await page.frameLocator('iframe[data-concept-view="overview"]').getByText('業務（Activity）',{exact:true}).waitFor();
   assert.deepEqual(errors,[]);results.push({width,sidebar:280,summaryFits:true,treeOverflow:overflow,zeroResults:true,nativeKeyboard:true,structureTabs:true,samples:true,activityNames:'業務 / 業務（Activity）',pageErrors:errors});
  }finally{await context.close();}
 }
 writeFileSync(out+'/results.json',JSON.stringify({base,published,results},null,2));return {base,published,results};
}
