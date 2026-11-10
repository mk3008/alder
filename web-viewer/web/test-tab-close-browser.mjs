import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {openExplorerGroup} from './explorer-browser.mjs';
import {closeCanvasOverlays} from './toolbar-settings-control.mjs';

// Compare actual rasterized tabs. Any changed pixel outside the small circle
// fails, including the parent background and the top/bottom selection bands.
async function pixels(page,png){
 return page.evaluate(async data=>{const image=await createImageBitmap(await (await fetch('data:image/png;base64,'+data)).blob()),canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);return {width:image.width,height:image.height,data:Array.from(ctx.getImageData(0,0,image.width,image.height).data)};},png.toString('base64'));
}
function circleDiff(before,after,center,radius){
 assert.equal(before.width,after.width);assert.equal(before.height,after.height);let changed=0;
 for(let y=0;y<before.height;y++)for(let x=0;x<before.width;x++){
  const i=(y*before.width+x)*4;if(before.data.slice(i,i+4).some((v,k)=>v!==after.data[i+k])){changed++;assert.ok(Math.hypot(x+.5-center.x,y+.5-center.y)<=radius,`changed pixel ${x},${y} must stay inside close circle`);}
 }
 assert.ok(changed>100,'close has a visible circular response (changed '+changed+' pixels)');return changed;
}
export async function verifyTabClose(browser,{base='http://127.0.0.1:4173/'}={}){
 const context=await browser.newContext({viewport:{width:1280,height:960},hasTouch:true}),page=await context.newPage(),results=[],observations=[],errors=[];
 page.on('pageerror',e=>errors.push(e.message));mkdirSync('web/evidence/tab-close',{recursive:true});
 try{
  await page.goto(base);await page.waitForFunction(()=>!document.querySelector('#open').disabled);
  await page.locator('#fallback').setInputFiles({name:'purchase-v7.json',mimeType:'application/json',buffer:readFileSync('../work/concept-review/issue-133/versions/purchase-v7-value-independent-review.json')});
  await page.waitForFunction(()=>document.querySelectorAll('#explorer-business-activity .explorer-item').length>0);
  await page.waitForFunction(()=>['saved','unchanged'].includes(document.querySelector('#app')?.dataset.saveState));
  if(await page.locator('#check-followup').isVisible())await page.locator('#check-followup-later').click();
  if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();
  for(const group of ['business','business-activity','states','subsystems','concept','tests'])await openExplorerGroup(page,group);
  await page.locator('[data-explorer-key="concept:landscape"]').click();
  const test=page.locator('[data-explorer-key^="tests:"]').first();
  const ancestors=await test.evaluate(el=>{const ids=[];for(let parent=el.parentElement;parent;parent=parent.parentElement)if(parent.id.startsWith('explorer-tests-'))ids.unshift(parent.id.slice('explorer-'.length));return ids;});
  for(const group of ancestors)await openExplorerGroup(page,group);
  await test.click();
  const keys=await page.locator('#explorer-business-activity .explorer-item').evaluateAll(items=>items.slice(0,2).map(item=>item.dataset.explorerKey));
  keys.push('concept:overview',await page.locator('#explorer-states .explorer-item').first().getAttribute('data-explorer-key'));
  for(const key of keys)await page.locator(`[data-explorer-key=${JSON.stringify(key)}]`).click();
  await closeCanvasOverlays(page);
  const kinds=await page.locator('.shell-open-tabs .tab:has(>.close:not([hidden]))').evaluateAll(tabs=>[...new Set(tabs.map(t=>t.dataset.viewKind))]);
  for(const required of ['business','concept','states','subsystems','tests'])assert.ok(kinds.includes(required));
  for(const theme of ['light','dark']){
   if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();
   for(const width of [1280,393])for(const state of ['active','inactive']){
    await page.setViewportSize({width,height:960});await closeCanvasOverlays(page);
    for(const kind of kinds){
     const tab=page.locator(`.shell-open-tabs .tab[data-view-kind="${kind}"]:has(>.close:not([hidden]))`).first(),label=tab.locator('button').first(),close=tab.locator('.close');
     await label.click();if(state==='inactive')await page.locator(`.shell-open-tabs .tab:not([data-view-kind="${kind}"]) button`).first().click();
     await close.scrollIntoViewIfNeeded();await page.mouse.move(0,0);await page.evaluate(()=>document.activeElement?.blur());
     const hit=await close.boundingBox(),center={x:hit.width/2,y:hit.height/2},capture=()=>page.screenshot({clip:hit});
     assert.equal(hit.width,32);assert.equal(hit.height,44);
     const background=await tab.evaluate(el=>getComputedStyle(el).backgroundColor),before=await pixels(page,await capture());
     await close.hover();assert.equal(await tab.evaluate(el=>getComputedStyle(el).backgroundColor),background,'close hover preserves parent color');
     const hover=await pixels(page,await capture()),changed=circleDiff(before,hover,center,13);
     const pseudo=await close.evaluate(el=>{const c=getComputedStyle(el,'::before');return {width:c.width,height:c.height,radius:c.borderRadius,background:c.backgroundColor};});
     assert.equal(pseudo.width,pseudo.height);assert.equal(pseudo.radius,'50%');assert.notEqual(pseudo.background,'rgba(0, 0, 0, 0)');
     if(kind==='concept')await page.screenshot({path:`web/evidence/tab-close/${theme}-${width}-${state}-hover.png`});
     await page.mouse.move(0,0);assert.deepEqual(await pixels(page,await capture()),before,'pointer leave restores all pixels');
     await label.focus();await page.keyboard.press('Tab');assert.equal(await close.evaluate(el=>el===document.activeElement&&el.matches(':focus-visible')),true);
     circleDiff(before,await pixels(page,await capture()),center,17);
     await page.evaluate(()=>document.activeElement.blur());await label.hover();
     if(state==='inactive')assert.notEqual(await tab.evaluate(el=>getComputedStyle(el).backgroundColor),background,'normal label hover remains');
     else assert.equal(await tab.evaluate(el=>getComputedStyle(el).backgroundColor),background,'active color remains');
     observations.push({theme,width,state,kind,hit:{width:hit.width,height:hit.height},circle:pseudo,changed});
    }
    for(const id of ['TAB-CLOSE-001','TAB-CLOSE-002'])results.push({id,case:`${theme}-${width}-${state}`,status:'pass'});
   }
  }
  await page.setViewportSize({width:1280,height:960});await closeCanvasOverlays(page);
  for(const operation of ['pointer-inactive','pointer-active','Enter','Space','touch-393']){
   let tab=page.locator('.shell-open-tabs .tab:has(>.close:not([hidden]))').last();
   if(operation==='pointer-inactive')await page.locator('.shell-open-tabs .tab button').first().click();else await tab.locator('button').first().click();
   const selected=await page.locator('.shell-open-tabs .tab.active button').first().getAttribute('aria-label'),name=await tab.locator('button').first().getAttribute('aria-label'),count=await page.locator('.shell-open-tabs .tab').count();
   if(operation==='touch-393'){await page.setViewportSize({width:393,height:960});await closeCanvasOverlays(page);await tab.locator('.close').tap();}
   else if(['Enter','Space'].includes(operation)){await tab.locator('.close').focus();await page.keyboard.press(operation);}
   else await tab.locator('.close').click({position:{x:2,y:2}}); // Outside the visible circle, inside the preserved target.
   await page.waitForFunction(n=>document.querySelectorAll('.shell-open-tabs .tab').length===n,count-1,{timeout:5000});
   assert.equal(await page.locator('.shell-open-tabs .tab').count(),count-1,operation);assert.equal(await page.getByRole('button',{name,exact:true}).count(),0);
   if(operation==='pointer-inactive')assert.equal(await page.locator('.shell-open-tabs .tab.active button').first().getAttribute('aria-label'),selected);
   results.push({id:'TAB-CLOSE-003',case:operation,status:'pass'});
  }
  assert.deepEqual(errors,[]);const report={results,observations,pageErrors:errors};writeFileSync('web/evidence/tab-close/results.json',JSON.stringify(report,null,2)+'\n');return report;
 }finally{await context.close();}
}
