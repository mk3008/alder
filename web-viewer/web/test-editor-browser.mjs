import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
export async function verifyMarkdownEditor(browser){
 const markdown=readFileSync('web/authorities/business-design.md','utf8'),extra='\n# Object Browser edit\n\n## Scope\n\ntrue\n\n## Icon\n\nbox\n\n## Information\n\n- local only\n',edited=markdown+extra;
 const results=[];
 const closeEditor=async(page,escape=false)=>{if(escape)await page.keyboard.press('Escape');else await page.locator('#source-cancel').click();const asked=await page.locator('#source-close-dialog').isVisible();if(asked)await page.locator('#source-close-confirm').click();await page.locator('#source-dialog').waitFor({state:'hidden'});return asked;};
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
   await page.locator('#edit-markdown').click();assert.equal(await page.locator('#source-text').inputValue(),markdown,'common editor contains full source despite selected drawer section');assert.equal(await page.locator('#source-text').getAttribute('readonly'),null);assert.equal(await page.locator('#source-submit').textContent(),'反映する');assert.equal(await page.locator('#source-submit').isDisabled(),true);assert.equal(await page.locator('#source-state,#source-edit').count(),0);assert.equal(await page.locator('#source-help').textContent(),'元ファイルやURLは書き換えません。');
   await page.locator('#source-text').fill(edited);assert.equal(await page.locator('#source-submit').isDisabled(),false);await page.locator('#source-text').fill(markdown);assert.equal(await page.locator('#source-submit').isDisabled(),true);await page.locator('#source-text').fill(edited);await page.locator('#source-submit').click();await page.locator('#source-dialog').waitFor({state:'hidden'});
   assert.equal(await page.locator('.node').count(),count+1);assert.equal(await page.locator('.tab').getAttribute('data-key'),key);assert.equal(await page.locator('.node.selected').getAttribute('data-node'),selected);
   await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('#edit-markdown').click();assert.equal(await page.locator('#source-text').inputValue(),edited);assert.equal(await page.locator('#source-submit').isDisabled(),true);
   assert.equal(await closeEditor(page),false,'applied text closes without confirmation');await page.locator('#edit-markdown').click();
   await page.locator('#source-text').fill(edited+'\n');await page.locator('#source-cancel').click();await page.locator('#source-close-dialog').waitFor({state:'visible'});
   assert.equal(await page.locator('#source-close-message').textContent(),'グラフには反映されません。編集内容は保持されます。閉じますか？');
   assert.deepEqual(await page.locator('#source-close-dialog button').allTextContents(),['閉じる','編集を続ける']);
   assert.equal(await page.locator('#source-close-continue').evaluate(el=>el===document.activeElement),true);
   await page.locator('#source-close-continue').click();assert.equal(await page.locator('#source-dialog').isVisible(),true);assert.equal(await page.locator('#source-text').inputValue(),edited+'\n');assert.equal(await page.locator('#source-text').evaluate(el=>el===document.activeElement),true);
   await page.keyboard.press('Escape');await page.locator('#source-close-dialog').waitFor({state:'visible'});await page.keyboard.press('Escape');await page.locator('#source-close-dialog').waitFor({state:'hidden'});assert.equal(await page.locator('#source-dialog').isVisible(),true);assert.equal(await page.locator('#source-text').evaluate(el=>el===document.activeElement),true);
   assert.equal(await closeEditor(page),true);assert.equal(await page.locator('.node').count(),count+1);
   await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('#edit-markdown').click();assert.equal(await page.locator('#source-text').inputValue(),edited+'\n');
   await page.locator('#source-text').fill(edited);assert.equal(await closeEditor(page),false,'exact revert closes without confirmation');await page.locator('#edit-markdown').click();
   await page.locator('#source-text').fill(edited+'\n');await page.locator('#source-submit').click();await page.locator('#source-dialog').waitFor({state:'hidden'});
   await page.locator('#edit-markdown').click();await page.locator('#source-text').fill('# unreflected browser draft');await closeEditor(page,true);
   await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('#edit-markdown').click();assert.equal(await page.locator('#source-text').inputValue(),'# unreflected browser draft');assert.equal(await page.locator('#source-submit').isDisabled(),false);
   await page.locator('#source-submit').click();assert.equal(await page.locator('#source-dialog').isVisible(),true);assert.equal(await page.locator('.node').count(),count+1);assert.equal(await page.locator('#source-text').inputValue(),'# unreflected browser draft');
   if(origin==='url'){
    const countRequests=requests.filter(r=>r.url==='https://editor-fixture.test/source.md').length;
    page.once('dialog',d=>d.dismiss());await page.locator('#refresh').click();assert.equal(requests.filter(r=>r.url==='https://editor-fixture.test/source.md').length,countRequests);assert.equal(await page.locator('#source-text').inputValue(),'# unreflected browser draft');
    page.once('dialog',d=>d.accept());await page.locator('#refresh').click();await page.waitForFunction(()=>!document.querySelector('#refresh').disabled);assert.equal(await page.locator('.node').count(),count);await page.locator('#edit-markdown').click();assert.equal(await page.locator('#source-text').inputValue(),markdown);
   }
   await closeEditor(page);
   if(origin==='text'){
    await page.locator('#edit-markdown').click();await page.locator('#source-text').fill(edited+'\n');await closeEditor(page);
    if(await page.locator('#status').isVisible())await page.locator('#status-close').click();
    const geometry=[];
    for(const width of [1280,800,393,320])for(const theme of ['light','dark']){
     await page.setViewportSize({width,height:800});if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();
     const button=await page.locator('#edit-markdown').boundingBox();assert.ok(button.x>=0&&button.x+button.width<=width+.5);assert.equal(button.height,40);
     await page.locator('#edit-markdown').click();
     for(const id of ['source-text','source-submit','source-cancel']){await page.locator('#'+id).scrollIntoViewIfNeeded();const r=await page.locator('#'+id).boundingBox();assert.ok(r.x>=0&&r.x+r.width<=width+.5,id+' fits narrow dialog');}
     const textarea=await page.locator('#source-text').boundingBox(),dialog=await page.locator('#source-dialog').boundingBox(),apply=await page.locator('#source-submit').boundingBox();
     assert.ok(dialog.x>=0&&dialog.x+dialog.width<=width+.5,'dialog fits viewport');
     assert.ok(apply.y>=0&&apply.y+apply.height<=800,'actions are reachable in viewport');
     if(width>800){assert.ok(textarea.width>=1000,'desktop editor uses wider screen');assert.ok(textarea.height>=400,'desktop editor uses viewport height');assert.ok(dialog.y+dialog.height<=800,'desktop dialog fits vertically');}
     geometry.push({width,theme,editorButton:button,textarea,dialog,apply});
     if(process.env.EDITOR_SCREENSHOTS&&(width===1280||width===320))await page.screenshot({path:process.env.EDITOR_SCREENSHOTS+`/editor-${width}-${theme}.png`});
     const prior=await page.locator('#source-text').inputValue();await page.locator('#source-text').fill(prior+'\n');await page.locator('#source-cancel').click();await page.locator('#source-close-dialog').waitFor({state:'visible'});
     const confirmation=await page.locator('#source-close-dialog').boundingBox();assert.ok(confirmation.x>=0&&confirmation.x+confirmation.width<=width+.5&&confirmation.y>=0&&confirmation.y+confirmation.height<=800,'confirmation fits viewport');
     for(const id of ['source-close-confirm','source-close-continue'])assert.equal(await page.locator('#'+id).evaluate(el=>{const r=el.getBoundingClientRect();return r.height>=44&&el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));}),true,'confirmation choices reachable');
     await page.locator('#source-close-continue').click();await page.locator('#source-text').fill(prior);
     await closeEditor(page);
    }
    await page.setViewportSize({width:1600,height:1100});await page.locator('#edit-markdown').click();
    const large=await page.locator('#source-text').boundingBox();assert.ok(large.height>geometry.find(g=>g.width===1280).textarea.height+250,'taller desktop grows textarea');
    await page.locator('#source-text').fill('# invalid');await page.locator('#source-submit').click();
    assert.equal(await page.locator('#source-dialog').isVisible(),true);assert.equal(await page.locator('#source-submit').isEnabled(),true);
    const error=await page.locator('#status').boundingBox(),actions=await page.locator('.source-actions').boundingBox();assert.ok(actions.y+actions.height<error.y,'error notification does not cover actions');
    await page.locator('#source-text').fill(edited+'\n');assert.equal(await page.locator('#source-submit').isDisabled(),true,'reverting invalid input clears dirty state');
    assert.equal(await closeEditor(page),false);
    await page.setViewportSize({width:1024,height:600});await page.locator('#edit-markdown').click();
    await page.locator('#source-text').fill('# invalid '+ 'long error '.repeat(80));await page.locator('#source-submit').click();
    await page.locator('#source-submit').scrollIntoViewIfNeeded();
    const compact=await page.locator('#source-dialog').boundingBox(),compactApply=await page.locator('#source-submit').boundingBox(),compactError=await page.locator('#status').boundingBox();
    assert.ok(compact.x>=0&&compact.x+compact.width<=1024&&compact.y+compact.height<=600,'short desktop dialog fits');
    assert.ok(compactApply.y>=compact.y&&compactApply.y+compactApply.height<=compact.y+compact.height,'short desktop apply remains scroll-reachable');
    assert.ok(compactApply.y+compactApply.height<compactError.y,'long error stays below short desktop actions');
    assert.equal(await page.locator('#source-submit').evaluate(el=>{const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));}),true,'short desktop apply is not covered');
    await page.locator('#source-text').fill(edited+'\n');assert.equal(await page.locator('#source-submit').isDisabled(),true);assert.equal(await closeEditor(page),false);
    results.push({geometry,tallDesktopTextarea:large,shortDesktop:{dialog:compact,apply:compactApply,error:compactError}});
   }
   assert.deepEqual(errors,[]);const external=requests.filter(r=>!r.url.startsWith('http://127.0.0.1:4173/'));
   assert.ok(external.every(r=>r.url==='https://editor-fixture.test/source.md'&&r.method==='GET'));
   assert.equal(external.length,origin==='url'?2:0);
   results.push({origin,checks:'direct editable full source; disabled unchanged and exact revert; two edits; stable tab/selection; immediate reload; two-choice close/continue/Escape; blank-line draft close/reload; invalid draft retention; no source writes',pageErrors:errors,interceptedSourceRequests:external.length});
  }finally{await context.close();}
 }
 return {results,limits:'Synthetic public Markdown; URL fulfilled by Playwright without external transmission; file input tested, OS picker/permissions not exercised.'};
}
