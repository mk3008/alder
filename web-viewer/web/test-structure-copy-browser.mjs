import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {reviewDisplayCopy,copy} from '../../work/361-copy-separation/prepare-display-copy.mjs';

export async function verifyStructureCopy(browser,{base='http://127.0.0.1:4173/',published=false,before=false,localPackage=false,out='web/evidence/structure-copy-separation'}={}){
 mkdirSync(out,{recursive:true});const results=[];
 const fixture=published&&!localPackage?base+'examples/json-complete-concept-review.json':'https://fixture.test/structure-display-copy.json';
 for(const width of [1280,393]){
  const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  if(!published||localPackage)await context.route(fixture,route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(reviewDisplayCopy())}));
  try{
   await page.goto(base+'?preview=1&view=concept&concept=structure-explorer#source='+encodeURIComponent(fixture));
   await page.locator('.structure-detail-page:not([hidden]) table').waitFor({timeout:45000});
   if(await page.locator('#status-close').isVisible())await page.locator('#status-close').click();
   if(await page.locator('#check-followup').isVisible())await page.locator('#check-followup-later').click();
   if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();
   assert.equal(await page.locator('.structure-pending').innerText(),'null許容が未決：47項目（互換・移行用を含む）');
   assert(await page.locator('.structure-compatibility-filter').isVisible());
   await page.getByRole('searchbox',{name:'構造名・項目名で検索'}).fill('FlowStep');
   await page.locator('.structure-tree summary:visible').filter({hasText:'標準手順'}).first().click();
   const panel=page.locator('.structure-detail-page:not([hidden])');
   const description=await panel.locator('dt').filter({hasText:/^構造の説明$/}).evaluate(el=>el.nextElementSibling.textContent);
   assert.equal(description,before?copy.original:copy.description);
   if(!before){
    assert.doesNotMatch(await panel.innerText(),/倒れたものを立て直す|バリデーションで検出する問題|検査を通過した後の処理|独立した条件を設けず/);
    assert.doesNotMatch((await page.locator('[title]').evaluateAll(els=>els.map(el=>el.title))).join('\n'),/倒れたものを立て直す/);
    assert((await panel.innerText()).includes('順序'));
    assert((await panel.innerText()).includes('判定行'));
   }
   if(width<800)await page.locator('#design-explorer .shell-heading button').click();
   await panel.getByText('構造の説明',{exact:true}).scrollIntoViewIfNeeded();
   await page.screenshot({path:out+'/'+(before?'before':'after')+'-'+width+'.png'});
   if(published){assert(await page.locator('#preview-badge').isVisible());if(!before){
    const guide=page.getByRole('link',{name:'FlowStep 作成ガイド',exact:true});assert(await guide.isVisible());
    await guide.click();await page.getByRole('heading',{name:'FlowStep 作成ガイド',exact:true}).waitFor();
    for(const rule of copy.authoringRules)assert((await page.locator('main').innerText()).includes(rule));
    assert.doesNotMatch(await page.locator('main').innerText(),/倒れたものを立て直す/);
    assert(await page.getByRole('link',{name:'元JSON',exact:true}).isVisible());
    await page.screenshot({path:out+'/guide-'+width+'.png'});
   }}
   assert.deepEqual(errors,[]);results.push({width,before,description,nullPending47:true,compatibilityVisible:true,previewIdentifier:published,authoringGuide:published&&!before,pageErrors:errors});
  }finally{await context.close();}
 }
 writeFileSync(out+'/'+(before?'before-copy':'copy-results')+'.json',JSON.stringify({base,published,results},null,2));return results;
}
