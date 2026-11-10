import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';

export async function verifyStructureCopyHeading(browser){
 const raw=JSON.parse(readFileSync('../business-design/alder/json-complete-concept-review.json')),snapshot=JSON.parse(readFileSync('../work/361-copy-heading/payloads.json'));
 const out='web/evidence/structure-copy-heading';mkdirSync(out,{recursive:true});const results=[];
 for(const width of [1280,393])for(const kind of ['structure','attribute','long-name']){
  const context=await browser.newContext({viewport:{width,height:900},hasTouch:width===393,permissions:['clipboard-read','clipboard-write']}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(15000);
  const fixture=structuredClone(raw),model=fixture.documents.find(d=>d.kind==='conceptModel');
  if(kind==='long-name')model.meta.conceptNames['n-package'].typeName='DocumentPackage_長い論理名_'.repeat(30);
  const fixtureURL='https://fixture.test/copy-heading.json';await context.route(fixtureURL,r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(fixture)}));
  try{
   await page.goto('http://127.0.0.1:4173/?view=concept&concept=structure-explorer#source='+encodeURIComponent(fixtureURL));
   const panel=page.locator('.structure-detail-page:not([hidden])');await panel.locator('table').waitFor({timeout:45000});
   if(await page.locator('#check-followup').isVisible())await page.locator('#check-followup-later').click();
   if(await page.locator('#status-close').isVisible())await page.locator('#status-close').click();
   if(width<800&&await page.locator('#design-explorer').isVisible())await page.locator('#design-explorer .shell-heading button').click();
   if(kind==='attribute')await panel.locator('[data-information-id="cf-fa56ab6bd9ad29"] button').click();
   const heading=panel.locator('.structure-copy-heading'),short=heading.getByRole('button',{name:'識別情報をコピー',exact:true}),full=heading.getByRole('button',{name:'全文をコピー',exact:true}),status=heading.locator('[role=status]');
   assert.equal(await heading.locator('.structure-detail-caption').textContent(),'論理名');assert.equal(await panel.locator(':scope > .structure-copy-actions').count(),0);
   const geometry=async()=>heading.evaluate(el=>{const rect=n=>{const b=n.getBoundingClientRect();return {left:b.left,right:b.right,top:b.top,bottom:b.bottom,height:b.height};};return {heading:rect(el),caption:rect(el.querySelector('.structure-detail-caption')),buttons:[...el.querySelectorAll('button')].map(rect),value:rect(el.nextElementSibling),nextCaption:rect(el.nextElementSibling.nextElementSibling),scroll:el.closest('.structure-detail-page').scrollWidth,client:el.closest('.structure-detail-page').clientWidth,valueText:el.nextElementSibling.textContent};});
   const g=await geometry();assert(g.buttons.every(b=>b.left>=g.heading.left-1&&b.right<=g.heading.right+1));assert(g.value.top>=g.heading.bottom-1);assert(g.nextCaption.top>=g.value.bottom+12);assert(g.scroll<=g.client);
   assert(g.buttons.every(b=>b.height>=(width<800?40:36)));assert(g.caption.top<g.buttons[0].bottom&&g.caption.bottom>g.buttons[0].top,'caption and controls share their first row');
   if(kind!=='long-name'){
    const expected=snapshot.cases.find(c=>c.name===kind);
    await short.focus();await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),expected.short);await status.getByText('識別情報をコピーしました。',{exact:true}).waitFor();
    await full.focus();await page.keyboard.press('Space');assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),expected.full);
    await short.focus();await page.keyboard.press('Shift+Enter');assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),expected.full);
    if(width===393){await short.tap();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),expected.short);await full.tap();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),expected.full);}
    await full.click();assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),expected.full,'status/button text never contaminates repeated full copy');
   }else{assert.equal(g.valueText,'DocumentPackage_長い論理名_'.repeat(30));assert(g.value.height>45,'long value wraps across lines');}
   const afterActions=await geometry();assert(afterActions.caption.top<afterActions.buttons[0].bottom&&afterActions.caption.bottom>afterActions.buttons[0].top,'notification does not push controls off the caption row');
   await page.screenshot({path:out+'/'+kind+'-'+width+'.png'});
   let wrapped,denied;
   if(width===393&&kind==='structure'){
    await heading.evaluate(el=>el.style.maxWidth='220px');wrapped=await geometry();assert(wrapped.buttons[1].top>=wrapped.buttons[0].bottom,'both controls wrap under constrained available width');assert(wrapped.value.top>=wrapped.heading.bottom-1);await page.screenshot({path:out+'/wrapped-393.png'});await heading.evaluate(el=>el.style.removeProperty('max-width'));
    const targetSession=await context.newCDPSession(page),{targetInfo}=await targetSession.send('Target.getTargetInfo');assert(targetInfo.browserContextId);
    const cdp=await browser.newBrowserCDPSession();
    await cdp.send('Browser.setPermission',{permission:{name:'clipboard-write'},setting:'denied',origin:'http://127.0.0.1:4173',browserContextId:targetInfo.browserContextId});
    denied=await page.evaluate(async()=> (await navigator.permissions.query({name:'clipboard-write'})).state);assert.equal(denied,'denied');await full.tap();await status.getByText('コピーできませんでした。ブラウザーの設定を確認してください。',{exact:true}).waitFor();
    await page.screenshot({path:out+'/denied-393.png'});
   }
   assert.deepEqual(errors,[]);results.push({width,kind,geometry:g,keyboard:kind!=='long-name',touch:width===393&&kind!=='long-name',wrapped,denied,pageErrors:errors});
  }finally{await context.close();}
 }
 const result={browser:browser.version(),results,scope:'Actual app UI, native clipboard keyboard/touch and actual denied permission; 220px heading constraint tests wrapping inside393px viewport.'};writeFileSync(out+'/results.json',JSON.stringify(result,null,2));return result;
}
