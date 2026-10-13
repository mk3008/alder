import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
export async function verifyTabStrip(browser){
 const context=await browser.newContext({viewport:{width:1280,height:960}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const sample=readFileSync('../business-design/alder/README.md','utf8'),measure=()=>page.locator('#tabs').evaluate(n=>{const r=n.getBoundingClientRect();return {client:[n.clientWidth,n.clientHeight],scroll:[n.scrollWidth,n.scrollHeight],rect:{x:r.x,y:r.y,width:r.width,height:r.height},overflowX:getComputedStyle(n).overflowX,overflowY:getComputedStyle(n).overflowY,tabs:[...n.querySelectorAll('.tab')].map(t=>{const b=t.getBoundingClientRect(),c=t.querySelector('.close').getBoundingClientRect();return {top:b.top,bottom:b.bottom,closeTop:c.top,closeBottom:c.bottom};})};});
 const checkVertical=async()=>{const m=await measure();assert.ok(m.scroll[1]<=m.client[1],'tab strip has no vertical overflow');for(const t of m.tabs){assert.ok(t.top>=m.rect.y&&t.bottom<=m.rect.y+m.rect.height,'whole tab visible vertically');assert.ok(t.closeTop>=m.rect.y&&t.closeBottom<=m.rect.y+m.rect.height,'close button not clipped');}return m;};
 try{
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('#open-sample').click();
  // Force an explicit scrollbar size in this browser fixture. This does not
  // claim Windows OS execution, but catches classic-gutter sizing mistakes.
  await page.addStyleTag({content:'#tabs::-webkit-scrollbar{width:17px;height:17px}'});
  const single=await checkVertical();assert.ok(single.scroll[0]<=single.client[0],'one short tab needs no horizontal scroll');
  for(let i=0;i<8;i++){await page.locator('#open-text').click();await page.locator('#source-text').fill(sample.replace(/^# .+/,`# Long tab ${i} synthetic title for horizontal scrolling`));await page.locator('#source-submit').click();}
  assert.equal(await page.locator('.tab').count(),9);
  const results=[];
  for(const theme of ['light','dark']){
   if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();
   for(const width of [1280,393,320])for(const zoom of [1,1.25]){
    await page.setViewportSize({width,height:960});await page.evaluate(z=>{document.body.style.zoom=String(z);},zoom);
    const m=await checkVertical();assert.ok(m.scroll[0]>m.client[0],'many tabs retain horizontal scroll');assert.ok(['auto','scroll'].includes(m.overflowX));
    await page.locator('.tab').last().locator('button').first().click();await page.locator('.tab').last().locator('.close').scrollIntoViewIfNeeded();const last=await page.locator('.tab').last().locator('.close').boundingBox(),nav=await page.locator('#tabs').boundingBox();assert.ok(last.x>=nav.x&&last.x+last.width<=nav.x+nav.width+1,'last close button reachable horizontally');results.push({theme,width,cssZoom:zoom,client:m.client,extent:m.scroll});
   }
  }
  await page.evaluate(()=>{document.body.style.zoom='1';});await page.setViewportSize({width:1280,height:960});const before=await page.locator('.tab').count();await page.locator('.tab').last().locator('.close').click();await page.waitForFunction(n=>document.querySelectorAll('.tab').length===n,before-1,{timeout:5000});assert.equal(await page.locator('.tab').count(),before-1);await checkVertical();assert.deepEqual(errors,[]);
  return {checks:'one tab no scroll; many tabs horizontal scrolling; no vertical overflow or clipped close controls; light/dark; 320/393/1280; CSS zoom1/1.25; classic17px scrollbar fixture',results,pageErrors:errors,limit:'CSS scrollbar/zoom fixture in Linux Chrome, not Windows OS/native browser zoom'};
 }finally{await context.close();}
}
