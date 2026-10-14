// Native Chromium layout under CDP page scaling, not physical Android/CCT.
import assert from 'node:assert/strict';
export async function verifyEditorViewport(browser){
 const results=[],failures=[];
 const inspect=page=>page.evaluate(()=>{
  const v=visualViewport,view={left:v.offsetLeft,top:v.offsetTop,width:v.width,height:v.height,scale:v.scale};
  const describe=e=>e?{tag:e.tagName,id:e.id}:null;
  const elements=Object.fromEntries(['source-dialog','source-text','source-cancel','source-close-dialog','source-close-confirm','source-close-continue'].map(id=>{
   const e=document.getElementById(id),r=e.getBoundingClientRect(),s=getComputedStyle(e),x=r.left+r.width/2,y=r.top+r.height/2;
   return[id,{rect:r.toJSON(),style:{display:s.display,visibility:s.visibility,position:s.position,zIndex:s.zIndex,pointerEvents:s.pointerEvents},center:{x,y,hit:describe(document.elementFromPoint(x,y))},visualCenter:{x:x-v.offsetLeft,y:y-v.offsetTop,hit:describe(document.elementFromPoint(x-v.offsetLeft,y-v.offsetTop))}}];
  }));return{view,scroll:{x:scrollX,y:scrollY},active:describe(document.activeElement),elements};
 });
 // Scaled CDP cases showed locator-hit/DOM-hit coordinate disagreement after visual-viewport pan.
 // Keep native input: verify layout hit/visible bounds, send viewport CSS coordinates, then verify the trusted event target.
 const clickScaled=async(page,selector)=>{
  await page.locator(selector).scrollIntoViewIfNeeded();
  const point=await page.evaluate(async selector=>{
   await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
   const e=document.querySelector(selector),r=e.getBoundingClientRect(),v=visualViewport,x=r.left+r.width/2,y=r.top+r.height/2,hit=document.elementFromPoint(x,y),s=getComputedStyle(e);
   const check={enabled:!e.disabled,visible:r.width>0&&r.height>0&&s.visibility==='visible'&&s.display!=='none',hit:hit===e||e.contains(hit),inView:x>=v.offsetLeft&&x<v.offsetLeft+v.width&&y>=v.offsetTop&&y<v.offsetTop+v.height};
   window.__viewportClickEvidence=null;
   document.addEventListener('click',event=>{window.__viewportClickEvidence={trusted:event.isTrusted,target:event.target.id,matches:event.target===e||e.contains(event.target)};},{once:true,capture:true});
   return{x:x-v.offsetLeft,y:y-v.offsetTop,check};
  },selector);
  assert.deepEqual(point.check,{enabled:true,visible:true,hit:true,inView:true},'scaled pointer target must be enabled, visible and unobscured');
  await page.mouse.click(point.x,point.y);
  const event=await page.evaluate(()=>window.__viewportClickEvidence);
  assert.equal(event?.trusted,true,'native input must create a trusted click');assert.equal(event?.matches,true,'native click must reach intended target');
 };
 for(const input of ['pointer','keyboard'])for(const scale of [1,2,3])for(const accept of [false,true]){
  const context=await browser.newContext({viewport:{width:980,height:1700},isMobile:true,hasTouch:true}),page=await context.newPage();
  let phase='setup';const evidence={input,scale,choice:accept?'close':'continue'};
  try{
   await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);
   await page.locator('#open-sample').click();await page.waitForFunction(()=>document.querySelector('#app').dataset.saveState==='saved');
   const camera=()=>page.evaluate(()=>({zoom:document.querySelector('#zoom').textContent,left:document.querySelector('#viewport').scrollLeft,top:document.querySelector('#viewport').scrollTop,nodes:document.querySelector('#nodes').innerHTML}));
   const before=await camera();await page.locator('#edit-markdown').click();const original=await page.locator('#source-text').inputValue();await page.locator('#source-text').fill(original+'\n');
   const cdp=await context.newCDPSession(page);await cdp.send('Emulation.setPageScaleFactor',{pageScaleFactor:scale});
   evidence.beforeClose=await inspect(page);evidence.playwrightCancelBox=await page.locator('#source-cancel').boundingBox();phase='open confirmation';
   if(input==='pointer'){if(scale===1)await page.locator('#source-cancel').click({timeout:5000});else await clickScaled(page,'#source-cancel');}else await page.keyboard.press('Escape');
   await page.locator('#source-close-dialog').waitFor({state:'visible'});
   const open=await page.evaluate(()=>{const d=document.querySelector('#source-close-dialog'),r=d.getBoundingClientRect(),v=visualViewport;return{rect:r.toJSON(),view:{left:v.offsetLeft,top:v.offsetTop,width:v.width,height:v.height,scale:v.scale},style:d.getAttribute('style'),active:document.activeElement.id};});
   evidence.open=open;
   assert.equal(open.active,'source-close-continue');assert.ok(Math.abs(open.view.scale-scale)<.02,'actual Chromium page scale applied');
   assert.ok(open.rect.left>=open.view.left-1&&open.rect.right<=open.view.left+open.view.width+1&&open.rect.top>=open.view.top-1&&open.rect.bottom<=open.view.top+open.view.height+1,'confirmation fits visible viewport');
   phase='choose confirmation';
   if(input==='pointer'){const selector=accept?'#source-close-confirm':'#source-close-continue';if(scale===1)await page.locator(selector).click({timeout:5000});else await clickScaled(page,selector);}
   else{if(accept)await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),accept?'source-close-confirm':'source-close-continue');await page.keyboard.press('Enter');}
   await page.locator('#source-close-dialog').waitFor({state:'hidden'});
   if(accept)await page.waitForFunction(()=>document.querySelector('header').getBoundingClientRect().bottom>visualViewport.offsetTop,null,{timeout:3000});
   const closed=await page.evaluate(()=>({hidden:document.querySelector('#source-dialog').hidden,style:document.querySelector('#source-close-dialog').style.cssText,scale:visualViewport.scale,header:document.querySelector('header').getBoundingClientRect().toJSON(),visualTop:visualViewport.offsetTop}));
   if(accept)assert.ok(closed.header.bottom>closed.visualTop,'header is reachable before any auto-scrolling locator click');
   assert.equal(closed.hidden,accept);assert.equal(closed.style,'');assert.ok(Math.abs(closed.scale-scale)<.02,'browser scale retained');assert.deepEqual(await camera(),before,'graph layout, zoom and camera retained');
   if(accept){phase='reopen draft';evidence.closed=closed;if(input==='keyboard'){assert.equal(await page.evaluate(()=>document.activeElement.id),'edit-markdown');await page.keyboard.press('Enter');}else if(scale===1)await page.locator('#edit-markdown').click();else await clickScaled(page,'#edit-markdown');await page.locator('#source-dialog').waitFor({state:'visible'});}
   assert.equal(await page.locator('#source-text').inputValue(),original+'\n','draft retained on both choices');
   results.push({...evidence,closed});console.log('EDITOR_VIEWPORT_CASE '+JSON.stringify({...evidence,closed,status:'passed'}));
  }catch(error){
   const failure={...evidence,phase,error:String(error),atFailure:await inspect(page).catch(e=>({error:String(e)}))};
   failures.push(error);results.push(failure);console.log('EDITOR_VIEWPORT_CASE '+JSON.stringify({...failure,status:'failed'}));
   try{const jpeg=await page.screenshot({type:'jpeg',quality:35,scale:'css'});console.log('EDITOR_VIEWPORT_JPEG '+JSON.stringify({input,scale,choice:evidence.choice,base64:jpeg.toString('base64')}));}catch(e){console.log('EDITOR_VIEWPORT_SCREENSHOT_ERROR '+String(e));}
  }finally{await context.close();}
 }
 if(failures.length)throw new AggregateError(failures,`${failures.length}/${results.length} editor viewport cases failed; per-case diagnostics above`);
 return {kind:'Native Chromium DOM/layout and CDP scale; no physical Android, Chrome Custom Tab, soft keyboard or manual pinch/pan guarantee; scale cases do not establish an initially hidden header',results};
}
