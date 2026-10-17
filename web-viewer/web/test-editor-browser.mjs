import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ensureDocumentActions} from './test-tab-strip-browser.mjs';
import {openSourceAction} from './source-menu-browser.mjs';
const markdown=readFileSync('../business-design/alder/README.md','utf8');
export async function verifyMarkdownEditor(browser){
 const results=[];
 for(const width of [320,768,1280]){
  const context=await browser.newContext({viewport:{width,height:800}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);await openSourceAction(page,'open-text');await page.locator('#source-text').fill(markdown);await page.locator('#source-submit').click();await page.waitForFunction(()=>document.querySelector('#source-dialog').hidden&&document.querySelector('#app').dataset.saveState==='saved');const graph=await page.locator('#nodes').innerHTML();
   await ensureDocumentActions(page);await page.locator('#view-markdown').click();assert.equal(await page.locator('#source-text').getAttribute('readonly'),'');assert.equal(await page.locator('#source-text').inputValue(),markdown);assert.equal(await page.locator('#source-submit').isVisible(),false);assert.equal(await page.locator('#edit-markdown,#source-close-dialog,#document-recovery').count(),0);
   await page.locator('#source-text').focus();await page.keyboard.press('ControlOrMeta+A');await page.keyboard.type('cannot edit');assert.equal(await page.locator('#source-text').inputValue(),markdown);await page.keyboard.press('Escape');assert.equal(await page.locator('#source-dialog').isVisible(),false);assert.equal(await page.locator('#nodes').innerHTML(),graph);assert.equal(await page.locator('#app').getAttribute('data-save-state'),'saved');await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);assert.equal(await page.locator('#nodes').innerHTML(),graph);assert.deepEqual(errors,[]);results.push({width,readonly:true,keyboardClose:true,reloaded:true});
  }finally{await context.close();}
 }
 return {results};
}
