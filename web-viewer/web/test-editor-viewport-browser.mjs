import assert from 'node:assert/strict';
import {ensureDocumentActions} from './test-tab-strip-browser.mjs';
export async function verifyEditorViewport(browser){
 const results=[];
 for(const scale of [1,2,3])for(const method of ['Escape','button']){
 const context=await browser.newContext({viewport:{width:980,height:1700},isMobile:true,hasTouch:true}),page=await context.newPage();
 try{await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('#open-sample').click();await page.waitForFunction(()=>document.querySelector('#app').dataset.saveState==='saved');const graph=await page.locator('#nodes').innerHTML(),zoom=await page.locator('#zoom').textContent();await ensureDocumentActions(page);await page.locator('#view-markdown').click();assert.equal(await page.locator('#source-text').getAttribute('readonly'),'');const cdp=await context.newCDPSession(page);await cdp.send('Emulation.setPageScaleFactor',{pageScaleFactor:scale});if(method==='Escape')await page.keyboard.press('Escape');else await page.locator('#source-cancel').click();await page.waitForFunction(()=>document.querySelector('#source-dialog').hidden);assert.equal(await page.locator('#source-close-dialog').count(),0);assert.equal(await page.evaluate(()=>visualViewport.scale),scale);assert.equal(await page.locator('#nodes').innerHTML(),graph);assert.equal(await page.locator('#zoom').textContent(),zoom);assert.ok(await page.evaluate(()=>document.querySelector('header').getBoundingClientRect().bottom>visualViewport.offsetTop));results.push({scale,method});}finally{await context.close();}
 }
 return {results,limit:'Chromium CDP scale; physical Android keyboard/pinch not verified'};
}
