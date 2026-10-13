import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
export async function verifyMarkdownEditor(browser){
 const markdown=readFileSync('web/authorities/business-design.md','utf8'),extra='\n# Object Browser edit\n\n## Scope\n\ntrue\n\n## Icon\n\nbox\n\n## Information\n\n- local only\n',edited=markdown+extra;
 const results=[];
 for(const origin of ['file','url','text']){
  const context=await browser.newContext({viewport:{width:1280,height:960}}),page=await context.newPage(),errors=[],requests=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push({url:r.url(),method:r.method()}));
  await context.route('https://editor-fixture.test/source.md',r=>r.fulfill({status:200,headers:{'access-control-allow-origin':'*','content-type':'text/markdown'},body:markdown}));
  try{
   await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);
   if(origin==='file')await page.locator('#fallback').setInputFiles({name:'fixture.md',mimeType:'text/markdown',buffer:Buffer.from(markdown)});
   else{await page.locator('#open-'+origin).click();await page.locator('#source-'+origin).fill(origin==='url'?'https://editor-fixture.test/source.md':markdown);await page.locator('#source-submit').click();}
   await page.locator('.node').first().waitFor();const key=await page.locator('.tab').getAttribute('data-key'),count=await page.locator('.node').count();
   await page.locator('.node').first().click();const selected=await page.locator('.node.selected').getAttribute('data-node');
   await page.locator('#edit-markdown').click();assert.equal(await page.locator('#source-text').inputValue(),markdown,'common editor contains full source despite selected drawer section');assert.equal(await page.locator('#source-text').getAttribute('readonly'),'');
   await page.locator('#source-edit').click();await page.locator('#source-text').fill(edited);await page.locator('#source-submit').click();await page.locator('#source-dialog').waitFor({state:'hidden'});
   assert.equal(await page.locator('.node').count(),count+1);assert.equal(await page.locator('.tab').getAttribute('data-key'),key);assert.equal(await page.locator('.node.selected').getAttribute('data-node'),selected);
   await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('#edit-markdown').click();assert.equal(await page.locator('#source-text').inputValue(),edited);
   await page.locator('#source-edit').click();await page.locator('#source-text').fill(edited+'\n');await page.locator('#source-submit').click();await page.locator('#source-dialog').waitFor({state:'hidden'});
   await page.locator('#edit-markdown').click();await page.locator('#source-edit').click();await page.locator('#source-text').fill('# unreflected browser draft');await page.keyboard.press('Escape');await page.locator('#source-dialog').waitFor({state:'hidden'});
   await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('#edit-markdown').click();assert.equal(await page.locator('#source-text').inputValue(),'# unreflected browser draft');assert.match(await page.locator('#source-state').textContent(),/未反映/);
   await page.locator('#source-edit').click();await page.locator('#source-submit').click();assert.equal(await page.locator('#source-dialog').isVisible(),true);assert.equal(await page.locator('.node').count(),count+1);assert.equal(await page.locator('#source-text').inputValue(),'# unreflected browser draft');
   if(origin==='url'){
    const countRequests=requests.filter(r=>r.url==='https://editor-fixture.test/source.md').length;
    page.once('dialog',d=>d.dismiss());await page.locator('#refresh').click();assert.equal(requests.filter(r=>r.url==='https://editor-fixture.test/source.md').length,countRequests);assert.equal(await page.locator('#source-text').inputValue(),'# unreflected browser draft');
    page.once('dialog',d=>d.accept());await page.locator('#refresh').click();await page.waitForFunction(()=>!document.querySelector('#refresh').disabled);assert.equal(await page.locator('.node').count(),count);await page.locator('#edit-markdown').click();assert.equal(await page.locator('#source-text').inputValue(),markdown);
   }
   await page.locator('#source-cancel').click();await page.locator('#source-dialog').waitFor({state:'hidden'});
   if(origin==='text'){
    const geometry=[];
    for(const width of [1280,800,393,320])for(const theme of ['light','dark']){
     await page.setViewportSize({width,height:800});if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();
     const button=await page.locator('#edit-markdown').boundingBox();assert.ok(button.x>=0&&button.x+button.width<=width+.5);assert.equal(button.height,40);
     await page.locator('#edit-markdown').click();await page.locator('#source-edit').click();
     for(const id of ['source-text','source-submit','source-cancel','source-edit']){await page.locator('#'+id).scrollIntoViewIfNeeded();const r=await page.locator('#'+id).boundingBox();assert.ok(r.x>=0&&r.x+r.width<=width+.5,id+' fits narrow dialog');}
     geometry.push({width,theme,editorButton:button});
     if(process.env.EDITOR_SCREENSHOTS&&width===320)await page.screenshot({path:process.env.EDITOR_SCREENSHOTS+`/editor-320-${theme}.png`});
     await page.locator('#source-cancel').click();await page.locator('#source-dialog').waitFor({state:'hidden'});
    }
    results.push({geometry});
   }
   assert.deepEqual(errors,[]);const external=requests.filter(r=>!r.url.startsWith('http://127.0.0.1:4173/'));
   assert.ok(external.every(r=>r.url==='https://editor-fixture.test/source.md'&&r.method==='GET'));
   assert.equal(external.length,origin==='url'?2:0);
   results.push({origin,checks:'full source despite selected node; two edits; stable tab/selection; immediate reload; draft close/Escape/reload; invalid draft retention; no source writes',pageErrors:errors,interceptedSourceRequests:external.length});
  }finally{await context.close();}
 }
 return {results,limits:'Synthetic public Markdown; URL fulfilled by Playwright without external transmission; file input tested, OS picker/permissions not exercised.'};
}
