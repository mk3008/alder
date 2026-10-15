import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
const ids=['refresh','save-image','copy-image','share-source','edit-markdown'];
export async function verifyDocumentActions(browser){
 const context=await browser.newContext({viewport:{width:1280,height:900},hasTouch:true}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const sample=readFileSync('../business-design/alder/README.md','utf8');
 const mode=()=>page.locator('.tab-strip').getAttribute('data-actions-mode');
 const open=async()=>{if(await mode()==='menu'&&await page.locator('#document-actions-toggle').getAttribute('aria-expanded')!=='true')await page.locator('#document-actions-toggle').click();};
 const focus=()=>page.evaluate(()=>document.activeElement?.id);
 const geometry=async()=>{
  const m=await page.evaluate(()=>{
   const r=e=>{const b=e.getBoundingClientRect();return {left:b.left,right:b.right,top:b.top,bottom:b.bottom,width:b.width,height:b.height};};
   const strip=document.querySelector('.tab-strip'),group=document.querySelector('#document-actions'),tabs=document.querySelector('#tabs');
   return {mode:strip.dataset.actionsMode,viewport:innerWidth,document:document.documentElement.scrollWidth,tabs:r(tabs),strip:r(strip),group:r(group),actions:[...group.querySelectorAll('button')].map(b=>({id:b.id,...r(b),hit:(()=>{const p=r(b),e=document.elementFromPoint((p.left+p.right)/2,(p.top+p.bottom)/2);return e===b||b.contains(e);})()}))};
  });
  assert.ok(m.document<=m.viewport+1,'no global horizontal overflow');assert.ok(m.tabs.width>=44,'tab navigation retains usable width');
  for(const a of m.actions){assert.ok(a.left>=-.5&&a.right<=m.viewport+.5,a.id+' inside viewport');assert.ok(a.height>=(m.mode==='menu'?43.5:39.5),a.id+' touch target');assert.ok(a.hit,a.id+' unobscured target');}
  if(m.mode==='inline'){assert.ok(m.actions[0].left>=m.tabs.right-.5,'inline controls follow tabs');for(let i=1;i<m.actions.length;i++)assert.ok(m.actions[i].left>=m.actions[i-1].right-.5,'all actions inline');}
  else{for(let i=1;i<m.actions.length;i++)assert.ok(m.actions[i].top>=m.actions[i-1].bottom-.5,'all actions in one menu');}
  return m;
 };
 try{
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('#open-sample').click();
  await page.evaluate(ids=>{window.__documentActionNodes=ids.map(id=>document.getElementById(id));},ids);
  assert.equal(await mode(),'inline');await geometry();
  for(let i=0;i<4;i++){await page.locator('#open-text').click();await page.locator('#source-text').fill(sample.replace(/^# .+/,`# A very long document title ${i} for responsive tab navigation`));await page.locator('#source-submit').click();}
  const results=[];
  for(const theme of ['light','dark']){
   if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();
   for(const width of [320,375,393,480,600,800,1280]){
    await page.setViewportSize({width,height:900});await page.waitForTimeout(80);await open();results.push({theme,width,...await geometry()});
    if(width<=393)assert.equal(await mode(),'menu','long title uses disclosure on phone');
    assert.equal(await page.locator('#refresh').isDisabled(),true,'text refresh disabled');
    if(await mode()==='menu')await page.keyboard.press('Escape');
    await page.locator('.tab').last().locator('.close').scrollIntoViewIfNeeded();const close=await page.locator('.tab').last().locator('.close').boundingBox(),tabs=await page.locator('#tabs').boundingBox();assert.ok(close.x>=tabs.x-.5&&close.x+close.width<=tabs.x+tabs.width+.5,'tab close reachable');
   }
  }
  // Find the actual measured breakpoint and revisit both sides without relying
  // on a viewport media-query constant or a particular font's text width.
  let low=320,high=1280;while(high-low>1){const mid=Math.floor((high+low)/2);await page.setViewportSize({width:mid,height:900});await page.waitForTimeout(30);if(await mode()==='menu')low=mid;else high=mid;}
  for(const width of [low,high,low,high]){await page.setViewportSize({width,height:900});await page.waitForTimeout(60);const expected=width===low?'menu':'inline';assert.equal(await mode(),expected);await page.waitForTimeout(120);assert.equal(await mode(),expected,'boundary stable after observers settle');}
  await page.setViewportSize({width:375,height:900});await page.waitForTimeout(80);
  await page.locator('#document-actions-toggle').tap();assert.equal(await focus(),'save-image');
  await page.keyboard.press('Tab');assert.equal(await focus(),'copy-image');await page.keyboard.press('Shift+Tab');assert.equal(await focus(),'save-image');
  await page.keyboard.press('ArrowUp');assert.equal(await focus(),'edit-markdown');await page.keyboard.press('ArrowDown');assert.equal(await focus(),'save-image');await page.keyboard.press('Escape');assert.equal(await focus(),'document-actions-toggle');
  for(const width of [360,375,360,375]){await page.setViewportSize({width,height:900});await page.waitForTimeout(80);assert.equal(await focus(),'document-actions-toggle','menu-to-menu resize retains toggle focus');}
  for(const key of ['Enter','Space','ArrowDown','ArrowUp']){await page.locator('#document-actions-toggle').focus();await page.keyboard.press(key);assert.equal(await page.locator('#document-actions-toggle').getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');}
  await open();await page.keyboard.press('Shift+Tab');assert.equal(await focus(),'document-actions-toggle');await page.keyboard.press('Shift+Tab');assert.equal(await page.locator('#document-actions-toggle').getAttribute('aria-expanded'),'false','Tab exits without trap');
  await open();await page.locator('#theme').click();assert.equal(await page.locator('#document-actions-toggle').getAttribute('aria-expanded'),'false','outside pointer dismisses');
  await open();await page.locator('#edit-markdown').click();assert.equal(await page.locator('#source-dialog').isVisible(),true,'editor reachable');await page.locator('#source-cancel').click();
  let reads=0;await context.route('https://actions.test/design.md',route=>{reads++;return route.fulfill({contentType:'text/markdown',headers:{'access-control-allow-origin':'*'},body:sample});});
  await page.locator('#open-url').click();await page.locator('#source-url').fill('https://actions.test/design.md');await page.locator('#source-submit').click();await page.waitForFunction(()=>document.querySelectorAll('.tab').length===6);
  await open();assert.equal(await page.locator('#refresh').isDisabled(),false);const read=page.waitForRequest('https://actions.test/design.md');await page.locator('#refresh').click();await read;await page.waitForFunction(()=>!document.querySelector('#refresh').disabled);assert.equal(reads,2,'selected URL refresh uses original handler');assert.equal(await page.locator('.tab').count(),6);
  await open();const downloaded=page.waitForEvent('download');await page.locator('#save-image').click();const download=await downloaded;assert.match(download.suggestedFilename(),/\.png$/,'PNG export reachable');assert.equal(await download.failure(),null);
  await page.locator('.tab').last().locator('.close').click();await page.waitForFunction(()=>document.querySelectorAll('.tab').length===5);await open();assert.equal(await page.locator('#refresh').isDisabled(),true,'closing URL restores text eligibility');
  await page.keyboard.press('Escape');await page.locator('.tab').first().locator('button').first().click();await open();assert.equal(await page.locator('#refresh').isDisabled(),true,'sample refresh disabled');
  assert.equal(await page.evaluate(ids=>ids.every((id,i)=>document.getElementById(id)===window.__documentActionNodes[i]),ids),true,'original action nodes retained across source/mode changes');
  mkdirSync('web/evidence/header-controls',{recursive:true});await page.screenshot({path:'web/evidence/header-controls/document-actions-mobile-menu.png'});
  assert.deepEqual(errors,[]);return {checks:'Measured all-inline/all-menu layout, phone/intermediate/desktop, themes, no document overflow, long tabs/close, boundary stability, touch/native keys, focus and outside dismissal, source eligibility/refresh, editor and PNG export',boundary:{menu:low,inline:high},results,pageErrors:errors};
 }finally{await context.close();}
}
