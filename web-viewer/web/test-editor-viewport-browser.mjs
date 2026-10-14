// Native Chromium layout under CDP page scaling, not physical Android/CCT.
import assert from 'node:assert/strict';
export async function verifyEditorViewport(browser){
 const results=[];
 for(const scale of [1,2,3])for(const accept of [false,true]){
  const context=await browser.newContext({viewport:{width:980,height:1700},isMobile:true,hasTouch:true}),page=await context.newPage();
  try{
   await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);
   await page.locator('#open-sample').click();await page.waitForFunction(()=>document.querySelector('#app').dataset.saveState==='saved');
   const camera=()=>page.evaluate(()=>({zoom:document.querySelector('#zoom').textContent,left:document.querySelector('#viewport').scrollLeft,top:document.querySelector('#viewport').scrollTop,nodes:document.querySelector('#nodes').innerHTML}));
   const before=await camera();await page.locator('#edit-markdown').click();const original=await page.locator('#source-text').inputValue();await page.locator('#source-text').fill(original+'\n');
   const cdp=await context.newCDPSession(page);await cdp.send('Emulation.setPageScaleFactor',{pageScaleFactor:scale});
   await page.locator('#source-cancel').click();await page.locator('#source-close-dialog').waitFor({state:'visible'});
   const open=await page.evaluate(()=>{const d=document.querySelector('#source-close-dialog'),r=d.getBoundingClientRect(),v=visualViewport;return{rect:r.toJSON(),view:{left:v.offsetLeft,top:v.offsetTop,width:v.width,height:v.height,scale:v.scale},style:d.getAttribute('style'),active:document.activeElement.id};});
   assert.equal(open.active,'source-close-continue');assert.ok(Math.abs(open.view.scale-scale)<.02,'actual Chromium page scale applied');
   assert.ok(open.rect.left>=open.view.left-1&&open.rect.right<=open.view.left+open.view.width+1&&open.rect.top>=open.view.top-1&&open.rect.bottom<=open.view.top+open.view.height+1,'confirmation fits visible viewport');
   await page.locator(accept?'#source-close-confirm':'#source-close-continue').click();await page.locator('#source-close-dialog').waitFor({state:'hidden'});
   if(accept)await page.waitForFunction(()=>document.querySelector('header').getBoundingClientRect().bottom>visualViewport.offsetTop,null,{timeout:3000});
   const closed=await page.evaluate(()=>({hidden:document.querySelector('#source-dialog').hidden,style:document.querySelector('#source-close-dialog').style.cssText,scale:visualViewport.scale,header:document.querySelector('header').getBoundingClientRect().toJSON(),visualTop:visualViewport.offsetTop}));
   if(accept)assert.ok(closed.header.bottom>closed.visualTop,'header is reachable before any auto-scrolling locator click');
   assert.equal(closed.hidden,accept);assert.equal(closed.style,'');assert.ok(Math.abs(closed.scale-scale)<.02,'browser scale retained');assert.deepEqual(await camera(),before,'graph layout, zoom and camera retained');
   if(accept){await page.locator('#edit-markdown').click();await page.locator('#source-dialog').waitFor({state:'visible'});}
   assert.equal(await page.locator('#source-text').inputValue(),original+'\n','draft retained on both choices');
   results.push({scale,choice:accept?'close':'continue',open,closed});
  }finally{await context.close();}
 }
 return {kind:'Native Chromium DOM/layout and CDP scale; no physical Android, Chrome Custom Tab, soft keyboard or manual pinch/pan guarantee; scale cases do not establish an initially hidden header',results};
}
