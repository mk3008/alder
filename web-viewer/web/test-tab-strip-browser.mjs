import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
// Read-only shared geometry oracle. Both image actions remain next to source
// sharing while the tab navigation itself owns horizontal scrolling.
export async function assertTabStripActions(page){
 const measured=await page.locator('.tab-strip').evaluate(strip=>{
  const box=el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
  return {strip:box(strip),window:{width:innerWidth,height:innerHeight},order:[...strip.children].map(el=>el.id),tabs:box(document.querySelector('#tabs')),actions:[...strip.querySelectorAll(':scope > button')].map(button=>{
   const r=box(button),hit=document.elementFromPoint((r.left+r.right)/2,(r.top+r.bottom)/2),icon=button.querySelector('svg');
   return {id:button.id,...r,hidden:button.hidden,hit:hit===button||button.contains(hit),label:button.getAttribute('aria-label'),title:button.title,text:button.textContent.trim(),tabIndex:button.tabIndex,icon:icon&&{...box(icon),hidden:icon.getAttribute('aria-hidden')},css:{width:getComputedStyle(button).width,height:getComputedStyle(button).height}};
  })};
 });
 const tolerance=.75,contains=(outer,inner)=>inner.left>=outer.left-tolerance&&inner.right<=outer.right+tolerance&&inner.top>=outer.top-tolerance&&inner.bottom<=outer.bottom+tolerance;
 assert.deepEqual(measured.order,['tabs','save-image','copy-image','share-source','edit-markdown'],'natural tab-strip order keeps both PNG actions immediately before sharing');
 assert.ok(measured.tabs.width>0,'tabs retain a usable scrolling region');
 assert.ok(contains({left:0,top:0,right:measured.window.width,bottom:measured.window.height},measured.strip),'tab-strip stays inside the visible window');
 let previous=measured.tabs;
 for(const action of measured.actions){
  assert.equal(action.hidden,false,action.id+' visible with an active document');assert.ok(contains(measured.strip,action),action.id+' remains within tab-strip');
  assert.ok(action.left>=previous.right-tolerance,action.id+' has a separate target after previous control');assert.equal(action.hit,true,action.id+' native center hit-test');assert.equal(action.tabIndex,0,'natural keyboard order');
  assert.ok(action.width>=40-tolerance&&action.height>=40-tolerance,action.id+' at least 40px target');previous=action;
 }
 for(const [id,label] of [['save-image','グラフ全体をPNGで保存'],['copy-image','グラフ全体をPNGでコピー']]){
  const action=measured.actions.find(a=>a.id===id);assert.equal(action.label,label);assert.equal(action.title,label);assert.equal(action.text,'','PNG action remains icon-only');assert.deepEqual(action.css,{width:'40px',height:'40px'});
  assert.ok(action.icon&&contains(action,action.icon),'PNG icon inside its target');assert.equal(action.icon.hidden,'true','PNG icon is decorative');
  assert.ok(Math.abs((action.icon.left+action.icon.right)-(action.left+action.right))<1.5,'PNG icon horizontally centered');assert.ok(Math.abs((action.icon.top+action.icon.bottom)-(action.top+action.bottom))<1.5,'PNG icon vertically centered');
 }
 return measured;
}

export async function verifyTabStrip(browser){
 const context=await browser.newContext({viewport:{width:1280,height:960}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const sample=readFileSync('../business-design/alder/README.md','utf8'),measure=()=>page.locator('#tabs').evaluate(n=>{const r=n.getBoundingClientRect();return {client:[n.clientWidth,n.clientHeight],scroll:[n.scrollWidth,n.scrollHeight],rect:{x:r.x,y:r.y,width:r.width,height:r.height},overflowX:getComputedStyle(n).overflowX,overflowY:getComputedStyle(n).overflowY,tabs:[...n.querySelectorAll('.tab')].map(t=>{const b=t.getBoundingClientRect(),c=t.querySelector('.close').getBoundingClientRect();return {top:b.top,bottom:b.bottom,closeTop:c.top,closeBottom:c.bottom};})};});
 const checkVertical=async()=>{const m=await measure();assert.ok(m.scroll[1]<=m.client[1],'tab strip has no vertical overflow');for(const t of m.tabs){assert.ok(t.top>=m.rect.y&&t.bottom<=m.rect.y+m.rect.height,'whole tab visible vertically');assert.ok(t.closeTop>=m.rect.y&&t.closeBottom<=m.rect.y+m.rect.height,'close button not clipped');}return m;};
 try{
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('#open-sample').click();
  // Force an explicit scrollbar size in this browser fixture. This does not
  // claim Windows OS execution, but catches classic-gutter sizing mistakes.
  await page.addStyleTag({content:'#tabs::-webkit-scrollbar{width:17px;height:17px}'});
  const single=await checkVertical();await assertTabStripActions(page);
  await page.locator('.tab').last().locator('.close').focus();
  for(const id of ['save-image','copy-image','share-source','edit-markdown']){await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement?.id),id,'native Tab order: '+id);}
  for(const id of ['share-source','copy-image','save-image']){await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement?.id),id,'native reverse Tab order: '+id);}
  assert.ok(single.scroll[0]<=single.client[0],'one short tab needs no horizontal scroll');
  for(let i=0;i<8;i++){await page.locator('#open-text').click();await page.locator('#source-text').fill(sample.replace(/^# .+/,`# Long tab ${i} synthetic title for horizontal scrolling`));await page.locator('#source-submit').click();}
  assert.equal(await page.locator('.tab').count(),9);
  const results=[];
  for(const theme of ['light','dark']){
   if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();
   for(const width of [1280,393,320])for(const zoom of [1,1.25]){
    await page.setViewportSize({width,height:960});await page.evaluate(z=>{document.body.style.zoom=String(z);},zoom);
    const m=await checkVertical();await assertTabStripActions(page);assert.ok(m.scroll[0]>m.client[0],'many tabs retain horizontal scroll');assert.ok(['auto','scroll'].includes(m.overflowX));
    await page.locator('.tab').last().locator('button').first().click();await page.locator('.tab').last().locator('.close').scrollIntoViewIfNeeded();const last=await page.locator('.tab').last().locator('.close').boundingBox(),nav=await page.locator('#tabs').boundingBox();assert.ok(last.x>=nav.x&&last.x+last.width<=nav.x+nav.width+1,'last close button reachable horizontally');results.push({theme,width,cssZoom:zoom,client:m.client,extent:m.scroll});
   }
  }
  await page.evaluate(()=>{document.body.style.zoom='1';});await page.setViewportSize({width:1280,height:960});const before=await page.locator('.tab').count();await page.locator('.tab').last().locator('.close').click();await page.waitForFunction(n=>document.querySelectorAll('.tab').length===n,before-1,{timeout:5000});assert.equal(await page.locator('.tab').count(),before-1);await checkVertical();assert.deepEqual(errors,[]);
  return {checks:'PNG actions before source sharing with natural Tab/Shift+Tab order; one tab no scroll; many tabs horizontal scrolling; no vertical overflow or clipped close controls; light/dark; 320/393/1280; CSS zoom1/1.25; classic17px scrollbar fixture',results,pageErrors:errors,limit:'CSS scrollbar/zoom fixture in Linux Chrome, not Windows OS/native browser zoom'};
 }finally{await context.close();}
}
