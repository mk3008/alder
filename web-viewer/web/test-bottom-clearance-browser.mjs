import {openSourceAction} from './source-menu-browser.mjs';
import {openDisplaySettings,closeDisplaySettings} from './toolbar-settings-control.mjs';
import assert from 'node:assert/strict';
import {readSessionInPage, waitForExactRead, waitSavedViewer} from './wait-saved-viewer.mjs';

// A single, isolated card makes the physical bottom edge unambiguous. It also
// keeps graph routing and sample-layout reuse out of this canvas regression.
import {bottomFixture as fixture,bottomNodeID as id} from './bottom-clearance-fixture.mjs';
const origin='http://127.0.0.1:4173/';
const at=[7000,5000];
const settle=page=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));

async function openFixture(page){
 await page.goto(origin);
 await page.waitForFunction(()=>!document.querySelector('#open').disabled);
 await openSourceAction(page,'open-text');
 await page.locator('#source-text').fill(fixture);
 await page.locator('#source-submit').click();
 await page.waitForFunction(()=>!!document.querySelector('.node')||!!document.querySelector('#status[data-kind=error]:not([hidden])'),null,{timeout:5000});
 assert.equal(await page.locator('#status[data-kind=error]:not([hidden])').count(),0,'Fixture input failed: '+await page.locator('#status-text').textContent());
 assert.equal(await page.locator('.node').count(),1);
 assert.equal(await page.locator('.node').getAttribute('data-node'),id);
 // The Markdown drawer is an unrelated overlay, and is not part of this case.
 if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
 const original=await page.locator('.node').evaluate(n=>[parseFloat(n.style.left),parseFloat(n.style.top)]);
 await waitSavedViewer(page,{positions:{[id]:original}});
 await waitForExactRead(()=>page.evaluate(readSessionInPage),false,{project:s=>s?.drawer});
}

async function seedSavedView(page,zoom,position=at,viewInset=[0,0]){
 await page.goto(origin+'LICENSE.txt');
 await page.evaluate(async({zoom,position,id,viewInset})=>{
  const request=indexedDB.open('alder-web-viewer',1);
  const db=await new Promise((resolve,reject)=>{request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});
  try{
   const current=await new Promise((resolve,reject)=>{const tx=db.transaction('session','readonly'),get=tx.objectStore('session').get('current');get.onsuccess=()=>resolve(get.result);get.onerror=()=>reject(get.error);});
   if(!current?.active)throw Error('Fixture session not saved');
   const tab=(current.format>=2?current.views:current.tabs).find(t=>t.key===current.active);
   if(!tab)throw Error('Fixture tab not saved');
   tab.positions[id]=position;tab.zoom=zoom;tab.scroll=[0,0];
   tab.viewInset=viewInset;tab.canvasOrigin=[0,0];
   await new Promise((resolve,reject)=>{const tx=db.transaction('session','readwrite');tx.objectStore('session').put(current,'current');tx.oncomplete=resolve;tx.onerror=tx.onabort=()=>reject(tx.error);});
  }finally{db.close();}
 },{zoom,position,id,viewInset});
 await waitSavedViewer(page,{positions:{[id]:position},zoom,scroll:[0,0],viewInset,canvasOrigin:[0,0]});
 await page.goto(origin);
 await page.waitForFunction(()=>!document.querySelector('#open').disabled&&document.querySelectorAll('.node').length===1);
 await page.waitForFunction(expected=>document.querySelector('#zoom').textContent===`${expected}%`,Math.round(zoom*100));
 assert.deepEqual(await page.locator('.node').evaluate(n=>[parseFloat(n.style.left),parseFloat(n.style.top)]),position);
 await settle(page);
}

async function maxGeometry(page){
 const metrics=await page.locator('#viewport').evaluate(v=>{v.scrollLeft=v.scrollWidth;v.scrollTop=v.scrollHeight;return {maxX:v.scrollWidth-v.clientWidth,maxY:v.scrollHeight-v.clientHeight};});
 await page.waitForFunction(({maxX,maxY})=>{const v=document.querySelector('#viewport');return Math.abs(v.scrollLeft-maxX)<1&&Math.abs(v.scrollTop-maxY)<1;},metrics);
 await settle(page);
 return page.evaluate(()=>{
  const v=document.querySelector('#viewport'),card=document.querySelector('.node'),toolbar=document.querySelector('.toolbar'),canvas=document.querySelector('#canvas');
  const n=card.getBoundingClientRect(),t=toolbar.getBoundingClientRect(),r=v.getBoundingClientRect();
  return {node:{left:n.left,right:n.right,top:n.top,bottom:n.bottom},position:[parseFloat(card.style.left),parseFloat(card.style.top)],toolbar:{left:t.left,right:t.right,top:t.top,bottom:t.bottom},viewport:{top:r.top,bottom:r.bottom,clientBottom:r.top+v.clientTop+v.clientHeight},gap:t.top-n.bottom,scrollX:v.scrollLeft,scrollY:v.scrollTop,maxX:v.scrollWidth-v.clientWidth,maxY:v.scrollHeight-v.clientHeight,scrollHeight:v.scrollHeight,canvasHeight:canvas.getBoundingClientRect().height};
 });
}

// Real gear transitions complement the synthetic min-height observer case.
// Check full top-of-toolbar clearance in both states without interpreting a
// retained tail camera as an extent leak. At origin each state must repeat.
async function verifyDisplaySettingsGeometry(page,first){
 const read=()=>page.locator('#viewport').evaluate(v=>({scroll:[v.scrollLeft,v.scrollTop],maxX:v.scrollWidth-v.clientWidth,scrollHeight:v.scrollHeight,canvasHeight:document.querySelector('#canvas').getBoundingClientRect().height}));
 const toOrigin=async()=>{await page.locator('#viewport').evaluate(v=>{v.scrollLeft=0;v.scrollTop=0;});await settle(page);};
 await toOrigin();await closeDisplaySettings(page);const closedOrigin=await read();let openOrigin;const transitions=[];
 for(let cycle=0;cycle<3;cycle++){
  await openDisplaySettings(page);const atOrigin=await read();
  assert.deepEqual(atOrigin.scroll,[0,0],'settings expansion must not move origin camera');
  if(openOrigin)assert.deepEqual(atOrigin,openOrigin,'repeated expansion at origin must not accumulate extent');else openOrigin=atOrigin;
  const openTail=await maxGeometry(page);
  assert.deepEqual(openTail.position,first.position,'gear expansion retains exact card coordinates');
  assert.ok(openTail.gap>=11.5,`expanded settings need 12px bottom gap; got ${openTail.gap}`);
  assert.ok(Math.abs(openTail.maxX-first.maxX)<.5,'settings panel does not change horizontal extent');
  await closeDisplaySettings(page);const retainedClosed=await read();
  assert.deepEqual(retainedClosed.scroll,[openTail.scrollX,openTail.scrollY],'closing retains camera at the previous maximum');
  const closedTail=await maxGeometry(page);
  assert.ok(closedTail.gap>=11.5,'closed settings retain bottom gap after expansion');
  assert.deepEqual(closedTail.position,first.position);
  await openDisplaySettings(page);const retainedOpen=await read();
  assert.deepEqual(retainedOpen.scroll,[closedTail.scrollX,closedTail.scrollY],'opening retains the current maximum-scroll camera');
  const repeated=await maxGeometry(page);
  assert.ok(Math.abs(repeated.scrollHeight-openTail.scrollHeight)<.5&&Math.abs(repeated.canvasHeight-openTail.canvasHeight)<.5,'tail open/close roundtrip must not grow canvas');
  assert.ok(repeated.gap>=11.5,'repeated expanded settings retain bottom gap');
  await toOrigin();await closeDisplaySettings(page);const restoredOrigin=await read();
  assert.deepEqual(restoredOrigin,closedOrigin,'returning to origin restores closed extent without accumulation');
  transitions.push({cycle,openGap:openTail.gap,closedGap:closedTail.gap,repeatedGap:repeated.gap,openScrollHeight:openTail.scrollHeight});
 }
 return {closedOrigin,openOrigin,transitions};
}

async function verifyClearanceAt(browser,width,zoom,height=960){
 const context=await browser.newContext({viewport:{width,height}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  await openFixture(page);await seedSavedView(page,zoom);
  const first=await maxGeometry(page);
  assert.ok(first.maxY>0,`vertical overflow missing at ${width}px / ${zoom}`);
  assert.ok(first.maxX>0,`horizontal overflow missing at ${width}px / ${zoom}`);
  assert.ok(first.node.bottom<=first.viewport.bottom+0.5,'card is outside viewport at maximum scroll');
  assert.ok(first.gap>=11.5,`bottom card needs 12px toolbar gap; got ${first.gap} at ${width}px / ${zoom}`);
  // Arithmetic comparison only. This is the old Y+220 term applied to this
  // exact one-card geometry, not a run of the old application. At low zoom it
  // would leave less than the required screen-pixel clearance.
  const oldHeight=Math.max(850,at[1]+220),oldGap=(oldHeight-(at[1]+68))*zoom-(first.viewport.clientBottom-first.toolbar.top);
  if(zoom<=.28)assert.ok(oldGap<12,`old-formula counterfactual should expose the low-zoom deficit; got ${oldGap}`);
  const redraws=[];
  for(let i=0;i<3;i++){
   // Each click rebuilds the graph and calls layoutCanvas; mere reads would
   // miss an accumulated extent error. Lock changes never move the card.
   await page.locator('#layout-lock').click();
   const again=await maxGeometry(page);redraws.push(again);
   assert.deepEqual(again.position,first.position,'redraw must retain exact card coordinates');
   assert.ok(Math.abs(again.scrollHeight-first.scrollHeight)<0.5,'redraw must not grow scroll extent');
   assert.ok(Math.abs(again.canvasHeight-first.canvasHeight)<0.5,'redraw must not grow canvas');
   assert.ok(Math.abs(again.maxX-first.maxX)<0.5&&Math.abs(again.scrollX-first.scrollX)<0.5,'redraw must retain horizontal pan extent');
   assert.ok(again.gap>=11.5,'redraw must retain toolbar clearance');
  }
  const settingsTransitions=await verifyDisplaySettingsGeometry(page,first);
  assert.deepEqual(errors,[]);
  return {width,height,zoom,settingsTransitions,toolbarTop:first.toolbar.top,nodeBottom:first.node.bottom,gap:first.gap,scrollHeight:first.scrollHeight,oldFormulaArithmeticOnly:{height:oldHeight,gap:oldGap},redraws:redraws.length};
 }finally{await context.close();}
}

async function verifyResize(browser){
 const context=await browser.newContext({viewport:{width:393,height:960}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  await openFixture(page);await seedSavedView(page,.25);
  const before=await maxGeometry(page);
  await page.setViewportSize({width:320,height:740});await settle(page);
  const after=await maxGeometry(page);
  assert.ok(after.gap>=11.5,`resize must recalculate clearance; got ${after.gap}`);
  assert.ok(after.viewport.bottom<before.viewport.bottom-100,'viewport resize did not take effect');
  const repeated=await maxGeometry(page);
  assert.ok(Math.abs(repeated.scrollHeight-after.scrollHeight)<0.5,'resized layout must not cause runaway canvas growth');
  assert.deepEqual(errors,[]);
  return {beforeGap:before.gap,afterGap:after.gap,beforeViewportBottom:before.viewport.bottom,afterViewportBottom:after.viewport.bottom};
 }finally{await context.close();}
}

async function verifyInset(browser){
 const context=await browser.newContext({viewport:{width:393,height:960}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  const inset=[120,90];
  await openFixture(page);await seedSavedView(page,.25,at,inset);
  const first=await maxGeometry(page);
  assert.deepEqual(first.position,at,'camera inset must not change saved node coordinates');
  assert.ok(first.gap>=11.5,`nonzero inset must retain 12px bottom gap; got ${first.gap}`);
  await page.locator('#layout-lock').click();
  const again=await maxGeometry(page);
  assert.deepEqual(again.position,at);
  assert.ok(again.gap>=11.5);
  assert.ok(Math.abs(again.scrollHeight-first.scrollHeight)<0.5,'inset redraw must not grow extent');
  assert.deepEqual(errors,[]);
  return {inset,gap:first.gap,redrawGap:again.gap,position:first.position};
 }finally{await context.close();}
}

async function verifyToolbarObserver(browser){
 const context=await browser.newContext({viewport:{width:393,height:960}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  await openFixture(page);await seedSavedView(page,.25);
  const before=await maxGeometry(page),oldHeight=before.toolbar.bottom-before.toolbar.top;
  // Test-only fixture change: the viewport is deliberately NOT resized. This
  // exercises the toolbar ResizeObserver, independently of window.resize.
  await page.locator('.toolbar').evaluate((bar,height)=>{bar.style.minHeight=`${height+80}px`;},oldHeight);
  await page.waitForFunction(oldHeight=>{const r=document.querySelector('.toolbar').getBoundingClientRect();return r.height>oldHeight+70;},oldHeight);
  await page.waitForFunction(oldCanvas=>document.querySelector('#canvas').getBoundingClientRect().height>oldCanvas+40,before.canvasHeight);
  const taller=await maxGeometry(page);
  assert.ok(taller.gap>=11.5,`taller toolbar must retain 12px gap; got ${taller.gap}`);
  assert.deepEqual(taller.position,before.position);
  assert.ok(Math.abs(taller.viewport.bottom-before.viewport.bottom)<0.5,'toolbar-only case must not resize viewport');
  assert.ok(Math.abs(taller.maxX-before.maxX)<0.5&&Math.abs(taller.scrollX-before.scrollX)<0.5,'toolbar height must not change horizontal pan');
  await page.locator('.toolbar').evaluate(bar=>bar.style.removeProperty('min-height'));
  await page.waitForFunction(oldHeight=>Math.abs(document.querySelector('.toolbar').getBoundingClientRect().height-oldHeight)<1,oldHeight);
  await settle(page);
  const restored=await maxGeometry(page);
  assert.ok(restored.gap>=11.5,'restored toolbar must retain clearance');
  assert.deepEqual(restored.position,before.position);
  assert.ok(Math.abs(restored.maxX-before.maxX)<0.5&&Math.abs(restored.scrollX-before.scrollX)<0.5,'restored toolbar must retain horizontal pan');
  await page.locator('#layout-lock').click();
  const repeated=await maxGeometry(page);
  assert.ok(Math.abs(repeated.scrollHeight-restored.scrollHeight)<0.5,'restored toolbar redraw must not grow extent');
  assert.deepEqual(repeated.position,before.position);
  assert.deepEqual(errors,[]);
  return {heightBefore:oldHeight,heightTaller:taller.toolbar.bottom-taller.toolbar.top,heightRestored:restored.toolbar.bottom-restored.toolbar.top,gaps:[before.gap,taller.gap,restored.gap,repeated.gap]};
 }finally{await context.close();}
}

async function verifyDragAndPan(browser){
 const context=await browser.newContext({viewport:{width:1280,height:960}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 try{
  await openFixture(page);await seedSavedView(page,1,[100,700],[0,400]);
  // Keep this ordinary +100 drag outside the new edge-pan band. Camera padding
  // provides scroll room without moving the fixture or weakening its oracle.
  await page.locator('#viewport').evaluate(v=>{v.scrollTop=740;v.scrollLeft=0;});
  await settle(page);
  const before=await page.locator('#viewport').evaluate(v=>v.scrollHeight),box=await page.locator('.node').boundingBox();
  const x=box.x+40,y=box.y+30;
  const bounds=await page.evaluate(()=>{const v=document.querySelector('#viewport'),r=v.getBoundingClientRect(),bar=document.querySelector('.toolbar').getBoundingClientRect();return {left:r.left+v.clientLeft,right:r.left+v.clientLeft+v.clientWidth,top:r.top+v.clientTop,bottom:Math.min(r.top+v.clientTop+v.clientHeight,bar.top-12)};});
  assert.ok(x>bounds.left+48&&x<bounds.right-48&&y>bounds.top+48&&y+100<bounds.bottom-48,'ordinary drag must stay outside every measured 48px edge-pan band');
  await page.locator('#layout-lock').click();
  await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x,y+100,{steps:8});await page.mouse.up();
  const moved=await page.locator('.node').evaluate(n=>[parseFloat(n.style.left),parseFloat(n.style.top)]);
  assert.deepEqual(moved,[100,800],'pointer drag must move the card by the physical delta');
  const expanded=await page.locator('#viewport').evaluate(v=>v.scrollHeight);
  assert.ok(expanded>before+75,`downward drag must expand canvas (${before} → ${expanded})`);
  await waitSavedViewer(page,{positions:{[id]:moved}});
  await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled&&document.querySelectorAll('.node').length===1);
  assert.deepEqual(await page.locator('.node').evaluate(n=>[parseFloat(n.style.left),parseFloat(n.style.top)]),moved,'reload must restore exact card coordinates');
  // Blank-canvas horizontal pointer pan remains available with layout locked.
  await page.locator('#viewport').evaluate(v=>{v.scrollLeft=30;v.scrollTop=200;});
  await settle(page);
  const panBefore=await page.locator('#viewport').evaluate(v=>[v.scrollLeft,v.scrollTop]);
  const vp=await page.locator('#viewport').boundingBox();
  const px=vp.x+Math.min(500,vp.width/2),py=vp.y+120;
  assert.equal(await page.evaluate(({x,y})=>!document.elementFromPoint(x,y)?.closest('.node'),{x:px,y:py}),true,'pan start must be blank canvas');
  await page.mouse.move(px,py);await page.mouse.down();await page.mouse.move(px-60,py,{steps:4});await page.mouse.up();
  const panAfter=await page.locator('#viewport').evaluate(v=>[v.scrollLeft,v.scrollTop]);
  assert.deepEqual(panAfter,[panBefore[0]+60,panBefore[1]],'horizontal pan must change only scrollLeft');
  assert.deepEqual(errors,[]);
  return {draggedTo:moved,scrollHeightBefore:before,scrollHeightAfter:expanded,panBefore,panAfter};
 }finally{await context.close();}
}

// Each independent real-Chrome case runs even when an earlier one fails.
export async function verifyBottomClearance(browser){
 const cases=[...[1280,393,320].flatMap(width=>[.25,.28,1,2.5].map(zoom=>({name:`clearance ${width}px ${zoom*100}%`,run:()=>verifyClearanceAt(browser,width,zoom)}))),...[.25,.28,1,2.5].map(zoom=>({name:`clearance 320x568 ${zoom*100}%`,run:()=>verifyClearanceAt(browser,320,zoom,568)})),{name:'resize recalculation',run:()=>verifyResize(browser)},{name:'nonzero camera inset',run:()=>verifyInset(browser)},{name:'toolbar-only ResizeObserver',run:()=>verifyToolbarObserver(browser)},{name:'downward drag, persistence and horizontal pan',run:()=>verifyDragAndPan(browser)}];
 const results=[];
 for(const test of cases){try{results.push({name:test.name,status:'passed',result:await test.run()});}catch(error){results.push({name:test.name,status:'failed',error:error?.stack??String(error)});}}
 const failed=results.filter(result=>result.status==='failed');
 console.log('BOTTOM_CLEARANCE_CASE_RESULTS '+JSON.stringify({total:results.length,passed:results.length-failed.length,failed:failed.length,results}));
 assert.equal(failed.length,0,`Bottom clearance failures:\n${failed.map(result=>result.name+': '+result.error).join('\n')}`);
 return {checks:results,passed:results.length};
}
