import {activityTabFixture} from './document-test-view.mjs';
import {parseDesign} from '../src/graph.ts';
import {openSourceAction} from './source-menu-browser.mjs';
import assert from 'node:assert/strict';
import {closeCanvasOverlays} from './toolbar-settings-control.mjs';
import {readFileSync,mkdirSync} from 'node:fs';
// Narrow-screen rails cover the tab row too. Dismiss them through their native
// controls before operating the document disclosure or its inline actions.
export async function ensureDocumentActions(page){
 await closeCanvasOverlays(page);
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 const toggle=page.locator('#document-actions-toggle');
 if(await toggle.isVisible()&&await toggle.getAttribute('aria-expanded')!=='true')await toggle.click();
}
// Shared geometry oracle. Source refresh and image actions precede
// sharing while the tab navigation itself owns horizontal scrolling.
export async function assertTabStripActions(page,{refreshDisabled=false}={}){
 await ensureDocumentActions(page);
 const measured=await page.locator('.tab-strip').evaluate(strip=>{
  const box=el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
  return {mode:strip.dataset.actionsMode,group:box(strip.querySelector('#document-actions')),toggle:box(strip.querySelector('#document-actions-toggle')),strip:box(strip),window:{width:innerWidth,height:innerHeight},order:[...strip.children].map(el=>el.id||el.className),actionOrder:[...strip.querySelector('#document-actions').children].map(el=>el.id),tabs:box(document.querySelector('.shell-open-tabs')),actions:[...strip.querySelectorAll('#document-actions > button')].map(button=>{
   const r=box(button),hit=document.elementFromPoint((r.left+r.right)/2,(r.top+r.bottom)/2),icon=button.querySelector('svg');
   return {id:button.id,...r,hidden:button.hidden,disabled:button.disabled,hit:hit===button||button.contains(hit),label:button.getAttribute('aria-label'),title:button.title,text:button.innerText.trim(),tabIndex:button.tabIndex,icon:icon&&{...box(icon),hidden:icon.getAttribute('aria-hidden')},opacity:getComputedStyle(button).opacity,css:{width:getComputedStyle(button).width,height:getComputedStyle(button).height}};
  })};
 });
 const tolerance=.75,contains=(outer,inner)=>inner.left>=outer.left-tolerance&&inner.right<=outer.right+tolerance&&inner.top>=outer.top-tolerance&&inner.bottom<=outer.bottom+tolerance;
 assert.deepEqual(measured.order,['shell-open-tabs','document-actions-toggle','document-actions'],'tabs precede the document-action disclosure');
 assert.deepEqual(measured.actionOrder,['refresh','save-image','copy-image','share-source','open-checks','view-markdown'],'natural document-action order places refresh before PNG actions and sharing');
 const menu=measured.mode==='menu',windowBox={left:0,top:0,right:measured.window.width,bottom:measured.window.height};
 assert.ok(['menu','inline'].includes(measured.mode),'document actions have an explicit responsive mode');
 if(menu){assert.ok(contains(measured.strip,measured.toggle),'disclosure remains inside tab-strip');assert.ok(measured.toggle.left>=measured.tabs.right-tolerance,'disclosure does not overlap tabs');assert.ok(contains(windowBox,measured.group),'open actions fit the window');}
 assert.ok(measured.tabs.width>0,'tabs retain a usable scrolling region');
 assert.ok(contains({left:0,top:0,right:measured.window.width,bottom:measured.window.height},measured.strip),'tab-strip stays inside the visible window');
 let previous=menu?null:measured.tabs;
 for(const action of measured.actions){
  if(action.id==='refresh'){assert.equal(action.disabled,refreshDisabled,'refresh eligibility follows the active source');assert.equal(action.opacity,refreshDisabled?'0.4':'1','disabled refresh is visibly gray');}
  assert.equal(action.hidden,false,action.id+' visible with an active document');assert.ok(contains(menu?measured.group:measured.strip,action),action.id+' remains within its action container');
  if(previous)assert.ok(menu?action.top>=previous.bottom-tolerance:action.left>=previous.right-tolerance,action.id+' has a separate target after previous control');assert.equal(action.hit,true,action.id+' native center hit-test');assert.equal(action.tabIndex,0,'natural keyboard order');
  assert.ok(action.width>=40-tolerance&&action.height>=40-tolerance,action.id+' at least 40px target');previous=action;
 }
 for(const [id,label] of [['share-source','取得元の共有リンクをコピー'],['view-markdown','原文を見る']]){const action=measured.actions.find(a=>a.id===id);assert.equal(action.label,label);if(id==='share-source')assert.ok(action.title.trim(),'sharing keeps the current eligibility explanation');else assert.equal(action.title,label);if(id==='view-markdown')assert.equal(action.text,'','editor remains icon-only');else if(menu)assert.equal(action.text,label,'menu action exposes its label');}
 for(const [id,label] of [['refresh','現在の文書を取得元から読み直す'],['save-image','グラフ全体をPNGで保存'],['copy-image','グラフ全体をPNGでコピー']]){
  const action=measured.actions.find(a=>a.id===id);assert.equal(action.label,label);assert.equal(action.title,label);assert.equal(action.text,menu?label:'',menu?'menu action exposes its label':'inline document action remains icon-only');if(!menu)assert.deepEqual(action.css,{width:'40px',height:'40px'});else assert.ok(action.height>=44-tolerance,'menu action at least 44px high');
  assert.ok(action.icon&&contains(action,action.icon),'document-action icon inside its target');assert.equal(action.icon.hidden,'true','document-action icon is decorative');
  if(!menu)assert.ok(Math.abs((action.icon.left+action.icon.right)-(action.left+action.right))<1.5,'document-action icon horizontally centered');assert.ok(Math.abs((action.icon.top+action.icon.bottom)-(action.top+action.bottom))<1.5,'document-action icon vertically centered');
 }
 if(menu){await page.keyboard.press('Escape');assert.equal(await page.locator('#document-actions-toggle').getAttribute('aria-expanded'),'false','geometry inspection closes the disclosure');}
 return measured;
}

export async function verifyTabStrip(browser){
 const context=await browser.newContext({viewport:{width:1280,height:960}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const sample=readFileSync('../business-design/alder/README.md','utf8'),measure=()=>page.locator('.shell-open-tabs').evaluate(n=>{const r=n.getBoundingClientRect();return {client:[n.clientWidth,n.clientHeight],scroll:[n.scrollWidth,n.scrollHeight],rect:{x:r.x,y:r.y,width:r.width,height:r.height},overflowX:getComputedStyle(n).overflowX,overflowY:getComputedStyle(n).overflowY,tabs:[...n.querySelectorAll('.tab:not([hidden])')].map(t=>{const b=t.getBoundingClientRect(),c=t.querySelector('.close').getBoundingClientRect();return {hidden:t.querySelector('.close').hidden,top:b.top,bottom:b.bottom,closeTop:c.top,closeBottom:c.bottom};})};});
 const checkVertical=async()=>{const m=await measure();assert.ok(m.scroll[1]<=m.client[1],'tab strip has no vertical overflow');for(const t of m.tabs){assert.ok(t.top>=m.rect.y&&t.bottom<=m.rect.y+m.rect.height,'whole tab visible vertically');if(!t.hidden)assert.ok(t.closeTop>=m.rect.y&&t.closeBottom<=m.rect.y+m.rect.height,'close button not clipped');}return m;};
 try{
  mkdirSync('web/evidence/header-controls',{recursive:true});
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('#open-sample').click();
  // Force an explicit scrollbar size in this browser fixture. This does not
  // claim Windows OS execution, but catches classic-gutter sizing mistakes.
  await page.addStyleTag({content:'.shell-open-tabs::-webkit-scrollbar{width:17px;height:17px}'});
  const single=await checkVertical();await assertTabStripActions(page,{refreshDisabled:true});
  const keyboardOrder=async(ids)=>{
   const start=await page.locator('.tab').last().locator('.close').isVisible()?page.locator('.tab').last().locator('.close'):page.locator('.tab').last().locator('button').first();await start.focus();
   for(const id of ids){await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement?.id),id,'native Tab order: '+id);}
   for(const id of ids.slice(0,-1).reverse()){await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement?.id),id,'native reverse Tab order: '+id);}
   await page.keyboard.press('Shift+Tab');assert.equal(await start.evaluate(el=>document.activeElement===el),true,'reverse traversal returns to the tab close control');
  };
  await keyboardOrder(['save-image','copy-image','share-source','open-checks','view-markdown']);
  const sampleGraph=await page.locator('#nodes').innerHTML();await page.locator('#refresh').evaluate(button=>button.click());assert.equal(await page.locator('#nodes').innerHTML(),sampleGraph,'disabled sample button is inert');
  let sourceReads=0;
  await context.route('https://tab-strip.test/design.md',route=>{sourceReads++;return route.fulfill({status:200,contentType:'text/markdown',headers:{'access-control-allow-origin':'*'},body:sample});});
  await openSourceAction(page,'open-url');await page.locator('#source-url').fill('https://tab-strip.test/design.md');await page.locator('#source-submit').click();await page.waitForFunction(()=>document.querySelectorAll('.tab').length===1);await assertTabStripActions(page);
  await keyboardOrder(['refresh','save-image','copy-image','share-source','open-checks','view-markdown']);
  assert.equal(sourceReads,1);
  for(const key of ['Enter','Space']){const before=sourceReads;await page.locator('#refresh').focus();assert.equal(await page.locator('#refresh').evaluate(el=>document.activeElement===el),true);const read=page.waitForRequest('https://tab-strip.test/design.md');await page.keyboard.press(key);await read;await page.waitForFunction(()=>!document.querySelector('#refresh').disabled);assert.equal(sourceReads,before+1,'native keyboard refresh rereads the URL');assert.equal(await page.locator('.tab').count(),1,'URL keyboard refresh keeps the same tab');}
  const read=page.waitForRequest('https://tab-strip.test/design.md');await page.locator('#refresh').click();await read;await page.waitForFunction(()=>!document.querySelector('#refresh').disabled);assert.equal(sourceReads,4,'native pointer refresh rereads the URL');await openSourceAction(page,'open-sample-menu');await page.waitForFunction(()=>document.querySelectorAll('.tab').length===1);
  assert.ok(single.scroll[0]<=single.client[0],'one short tab needs no horizontal scroll');
  const names=parseDesign(sample).activityOrder.slice(0,8).map((id,i)=>['Long Group '+i+' synthetic title for horizontal scrolling',[id]]);
  await openSourceAction(page,'open-text');await page.locator('#source-text').fill(activityTabFixture(names.map(([name])=>name)));await page.locator('#source-submit').click();await page.locator('#source-dialog').waitFor({state:'hidden'});
  for(const [name] of names){await page.locator('.tab').first().locator('button').first().click();await page.locator('.node[data-activity='+JSON.stringify(name)+'] .activity-open').press('Enter');}
  assert.equal(await page.locator('.tab').count(),9);await keyboardOrder(['save-image','copy-image','share-source','open-checks','view-markdown']);
  const results=[];
  for(const theme of ['light','dark']){
   if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();
   for(const width of [1280,1000,600,480,393,360,320])for(const zoom of [1,1.25]){
    await page.setViewportSize({width,height:960});await closeCanvasOverlays(page);await page.evaluate(z=>{document.body.style.zoom=String(z);},zoom);
    const m=await checkVertical();await assertTabStripActions(page,{refreshDisabled:true});
    await page.locator('.tab').first().locator('button').first().click();await assertTabStripActions(page,{refreshDisabled:true});
    if(zoom===1&&[1280,393,320].includes(width))await page.screenshot({path:`web/evidence/header-controls/document-refresh-${width}-${theme}.png`});
    await page.locator('.tab').last().locator('button').first().click();await assertTabStripActions(page,{refreshDisabled:true});assert.ok(m.scroll[0]>m.client[0],'many tabs retain horizontal scroll');assert.ok(['auto','scroll'].includes(m.overflowX));
    await page.locator('.tab').last().locator('button').first().click();await page.locator('.tab').last().locator('.close').scrollIntoViewIfNeeded();const last=await page.locator('.tab').last().locator('.close').boundingBox(),nav=await page.locator('.shell-open-tabs').boundingBox();assert.ok(last.x>=nav.x&&last.x+last.width<=nav.x+nav.width+1,'last close button reachable horizontally');results.push({theme,width,cssZoom:zoom,client:m.client,extent:m.scroll});
   }
  }
  await page.evaluate(()=>{document.body.style.zoom='1';});await page.setViewportSize({width:1280,height:960});const before=await page.locator('.tab').count();await page.locator('.tab').last().locator('.close').click();await page.waitForFunction(n=>document.querySelectorAll('.tab').length===n,before-1,{timeout:5000});assert.equal(await page.locator('.tab').count(),before-1);await checkVertical();assert.deepEqual(errors,[]);
  return {checks:'Source refresh before PNG actions and sharing; sample/text gray disabled controls skipped by natural Tab/Shift+Tab; URL pointer/Enter/Space reread; text/sample tab switching; one tab no scroll; many tabs horizontal scrolling; no vertical overflow or clipped close controls; light/dark; 320/360/393/480/600/1000/1280; CSS zoom1/1.25; classic17px scrollbar fixture',results,pageErrors:errors,limit:'CSS scrollbar/zoom fixture in Linux Chrome, not Windows OS/native browser zoom'};
 }finally{await context.close();}
}
