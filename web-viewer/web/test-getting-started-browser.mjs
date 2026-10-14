import assert from 'node:assert/strict';
export async function verifyGettingStarted(browser,origin='http://127.0.0.1:4173/'){
 const context=await browser.newContext(),page=await context.newPage(),results=[];
 try{
  for(const width of [1440,1001,1000,800,393,320]){
   await page.setViewportSize({width,height:width===320?568:852});await page.goto(origin);
   await page.waitForFunction(()=>!document.querySelector('#open').disabled);
   const github=page.locator('#github-link'),guide=page.locator('#authoring-guide');
   assert.equal(await github.isVisible(),width>1000);assert.equal(await guide.isVisible(),true);
   const frame=await page.locator('#empty').evaluate(e=>{
    const r=e.getBoundingClientRect(),v=e.parentElement.getBoundingClientRect();
    return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,viewport:{top:v.top,bottom:v.bottom,left:v.left,right:v.right},touch:getComputedStyle(e.parentElement).touchAction};
   });
   assert.ok(frame.top>=frame.viewport.top&&frame.bottom<=frame.viewport.bottom+1,'empty content frame fits vertically');
   assert.ok(frame.left>=frame.viewport.left&&frame.right<=frame.viewport.right+1,'empty content frame fits horizontally');
   assert.equal(frame.touch,'pan-y','overflowing empty help permits native touch scrolling');
   assert.equal(await github.getAttribute('href'),'https://github.com/mk3008/alder');
   assert.equal(await guide.locator('a').getAttribute('href'),'https://github.com/mk3008/alder/blob/main/README.ja.md');
   if(width>1000){
    await page.locator('body').click({position:{x:1,y:1}});
    let reached=false;
    for(let i=0;i<15;i++){await page.keyboard.press('Tab');if(await github.evaluate(e=>document.activeElement===e)){reached=true;break;}}
    assert.ok(reached,'repository link is in keyboard traversal');
    assert.equal(await github.evaluate(e=>getComputedStyle(e).outlineStyle),'solid');
   }
   for(const id of ['open','open-url','open-text','theme']){
    const control=page.locator('#'+id);await control.scrollIntoViewIfNeeded();
    const r=await control.boundingBox();assert.ok(r.x>=-.5&&r.x+r.width<=width+.5,id+' remains reachable');
   }
   const readme=guide.locator('a');await readme.scrollIntoViewIfNeeded();await readme.focus();
   assert.equal(await readme.evaluate(e=>document.activeElement===e),true);
   assert.equal(await readme.evaluate(e=>{const r=e.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return hit===e||e.contains(hit);}),true,'README link is reachable after scrolling');
   const bounds=await page.locator('#empty').evaluate(e=>({width:e.getBoundingClientRect().width,scroll:e.scrollWidth}));
   assert.ok(bounds.scroll<=bounds.width+1,'guide has no horizontal overflow');
   await page.locator('#open-sample').click();await page.waitForSelector('.node');
   assert.equal(await guide.isVisible(),false);
   await page.locator('.close').click();await page.waitForFunction(()=>!document.querySelector('.tab'));
   assert.equal(await guide.isVisible(),true);
   await page.locator('#fallback').setInputFiles({name:'getting-started.md',mimeType:'text/markdown',buffer:Buffer.from('# Object 文書\n\n## Information\n\n- 内容\n')});
   await page.waitForSelector('.tab');assert.equal(await guide.isVisible(),false);
   await page.reload();await page.waitForSelector('.tab');assert.equal(await guide.isVisible(),false);
   await page.locator('.close').click();await page.waitForFunction(()=>!document.querySelector('.tab'));
   assert.equal(await guide.isVisible(),true);
   results.push({width,repositoryVisible:width>1000,guide:'no horizontal overflow; sample/file/reload/close passed'});
  }
  return {results,limits:'Chromium desktop emulation; native mobile and human acceptance remain separate.'};
 }finally{await context.close();}
}
