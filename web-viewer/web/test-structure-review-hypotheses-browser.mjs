import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {reviewCandidatePackage} from '../../work/361-review-display-cleanup/prepare-preview.mjs';
export async function verifyStructureReviewHypotheses(browser,{base='http://127.0.0.1:4173/',published=false}={}){
 const pkg=await reviewCandidatePackage(),model=pkg.documents.find(d=>d.kind==='conceptModel'),diagnostic=model.meta.fieldMappings.find(m=>m.physicalName==='Package.diagnostics'),results=[],observations=[];
 const out='web/evidence/review-hypotheses';mkdirSync(out,{recursive:true});
 for(const width of [1280,393])for(const theme of ['light','dark']){
  const context=await browser.newContext({viewport:{width,height:960},hasTouch:width===393,permissions:['clipboard-read','clipboard-write']}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(15000);
  const fixture=published?base+'examples/json-complete-concept-review.json':'https://fixture.test/structure-hypotheses.json';if(!published)await context.route(fixture,r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(pkg)}));
  try{
   await page.goto(base+'?preview=1&view=concept&concept=structure-explorer#source='+encodeURIComponent(fixture));
   const panel=page.locator('.structure-detail-page:not([hidden])');await panel.locator('table.structure-review-table').waitFor({timeout:45000});
   if(await page.locator('#status-close').isVisible())await page.locator('#status-close').click();
   if(await page.locator('#check-followup').isVisible())await page.locator('#check-followup-later').click();
   if(width===393&&await page.locator('#design-explorer').isVisible())await page.locator('#design-explorer .shell-heading button').click();
   if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();
   const table=panel.locator('.structure-attribute-table'),row=table.locator(`[data-information-id="${diagnostic.informationId}"]`);
   assert.deepEqual(await table.locator('thead th').allTextContents(),['項目','サンプル','説明','使用目的','確認する立場']);
   assert.equal(await row.locator('.structure-attribute-sample').textContent(),'[]');assert.ok(!(await row.innerText()).includes('仮説（未確認）'));assert.ok((await row.innerText()).includes('0回の入力を未入力と区別する必要があるかは確認中。'));
   await row.locator('button').scrollIntoViewIfNeeded();
   const geometry=await panel.evaluate(el=>{const p=el.getBoundingClientRect(),t=el.querySelector('table').getBoundingClientRect();return {panel:[p.left,p.right],table:[t.left,t.right],scroll:el.scrollWidth,client:el.clientWidth,page:document.documentElement.scrollWidth,window:innerWidth,columns:[...el.querySelectorAll('thead th')].map(th=>th.getBoundingClientRect().width)};});
   assert.ok(geometry.scroll<=geometry.client,'no detail overflow');assert.ok(geometry.page<=geometry.window,'no page overflow');assert.ok(geometry.table[0]>=geometry.panel[0]-1&&geometry.table[1]<=geometry.panel[1]+1);assert.ok(geometry.columns.every(w=>w>=30),'all five columns remain visible');
   await page.screenshot({path:`${out}/table-${width}-${theme}.png`});
   if(width===393)await row.locator('button').tap();else await row.locator('button').press('Enter');
   const value=label=>panel.locator('dt').filter({hasText:new RegExp('^'+label+'$')}).locator('xpath=following-sibling::dd[1]');
   await value('確認する立場').waitFor();assert.ok((await value('サンプル').innerText()).startsWith('[]'));assert.ok((await value('使用目的').innerText()).includes('文書を読む際に残る補足'));assert.ok((await value('確認する立場').innerText()).includes('依頼者・設計者'));
   assert.equal(await panel.locator('details,.structure-review-hypothesis-label').count(),0);
   const short=panel.locator('.structure-copy-id'),full=panel.locator('.structure-copy-full');
   await short.focus();await page.keyboard.press('Enter');const identity=await page.evaluate(()=>navigator.clipboard.readText());assert.ok(identity.includes('項目：診断（diagnostics）'));assert.ok(!identity.includes('仮説'));
   await short.focus();await page.keyboard.press('Shift+Enter');const payload=await page.evaluate(()=>navigator.clipboard.readText());assert.ok(!payload.includes('仮説（未確認）'));assert.ok(payload.includes('使用目的：'));assert.ok(payload.includes('確認する立場：'));assert.ok(!payload.includes('全文をコピー'));assert.ok(!payload.includes('識別情報をコピー'));
   if(width===393){await full.tap();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),payload);}
   const heading=await panel.evaluate(el=>{
    const dt=el.querySelector('.structure-copy-heading'),caption=dt.querySelector('.structure-detail-caption'),local=[...el.querySelectorAll('dt')].find(n=>n.textContent==='ローカル名');
    const metric=n=>({font:getComputedStyle(n).fontSize,line:getComputedStyle(n).lineHeight,height:n.getBoundingClientRect().height});
    const baseline=n=>{const marker=document.createElement('span');marker.style.cssText='display:inline-block;width:0;height:0;vertical-align:baseline';n.append(marker);const y=marker.getBoundingClientRect().top;marker.remove();return y;};
    const captionY=baseline(caption),localY=baseline(local),cr=caption.getBoundingClientRect(),lr=local.getBoundingClientRect();
    const buttons=[...dt.querySelectorAll('button')].map(n=>{const r=n.getBoundingClientRect(),pseudo=getComputedStyle(n,'::before'),top=r.top+parseFloat(pseudo.top),left=r.left+parseFloat(pseudo.left),right=r.right-parseFloat(pseudo.right),bottom=r.bottom-parseFloat(pseudo.bottom);const x=(left+right)/2,y=top+1;return {...metric(n),baseline:baseline(n),rect:{top,left,right,bottom},hit:document.elementFromPoint(x,y)===n,border:getComputedStyle(n).borderTopWidth,decoration:getComputedStyle(n).textDecorationLine};});
    return {caption:metric(caption),local:metric(local),captionY,captionOffset:captionY-cr.top,localOffset:localY-lr.top,buttons,headingHeight:dt.getBoundingClientRect().height};
   });
   assert.equal(heading.caption.font,heading.local.font);assert.equal(heading.caption.line,heading.local.line);assert.ok(Math.abs(heading.captionOffset-heading.localOffset)<=1);
   for(const b of heading.buttons){assert.equal(b.font,heading.local.font);assert.equal(b.line,heading.local.line);assert.equal(b.border,'0px');assert.ok(b.decoration.includes('underline'));assert.ok(b.rect.bottom-b.rect.top>=24);assert.equal(b.hit,true);if(Math.abs(b.baseline-heading.captionY)<10)assert.ok(Math.abs(b.baseline-heading.captionY)<=1);}
   const [a,b]=heading.buttons;assert.ok(a.rect.right<=b.rect.left||b.rect.right<=a.rect.left||a.rect.bottom<=b.rect.top||b.rect.bottom<=a.rect.top,'copy hit rectangles do not overlap');
   await page.keyboard.press('Tab');await short.focus();assert.ok(await short.evaluate(el=>el.matches(':focus-visible')));assert.equal(await short.evaluate(el=>getComputedStyle(el).outlineStyle),'solid');
   await page.screenshot({path:`${out}/attribute-${width}-${theme}.png`});
   const layout=await panel.evaluate(el=>{const p=el.getBoundingClientRect();return {scroll:el.scrollWidth,client:el.clientWidth,items:[...el.querySelectorAll('dd')].map(dd=>{const r=dd.getBoundingClientRect();return {left:r.left,right:r.right,panelLeft:p.left,panelRight:p.right};})};});
   assert.ok(layout.scroll<=layout.client);assert.ok(layout.items.every(i=>i.left>=i.panelLeft-1&&i.right<=i.panelRight+1),'wrapped purpose and perspectives fit');
   await panel.getByRole('button',{name:'項目一覧に戻る',exact:true}).press('Enter');await table.waitFor();assert.equal(await row.locator('button').evaluate(el=>el===document.activeElement),true);
   assert.equal((await page.locator('.structure-pending').first().textContent()).trim(),'null許容が未決：47項目（互換・移行用を含む）');assert.deepEqual(errors,[]);
   observations.push({width,theme,geometry,heading,nativeKeyboard:true,touch:width===393,managementHidden:true,unresolved:47,pageErrors:errors});
  }finally{await context.close();}
 }
 for(const name of ['navigation','mobile-wrap'])results.push({id:'REVIEW-HYP-005',case:name,status:'pass',evidence:'Actual Chromium 1280/393 light/dark; Enter/tap/clipboard/back and wrapped geometry'});
 const report={results,observations};writeFileSync(out+'/browser-results.json',JSON.stringify(report,null,2)+'\n');return report;
}
