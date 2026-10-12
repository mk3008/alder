import assert from 'node:assert/strict';
import {touchDriver} from './touch-driver.mjs';

// One attempt per case, independent contexts, no retries. Collect all failures
// so a protocol issue cannot conceal unrelated product and regression results.
export async function verifyTouchZoom(browser){
 const results=[];
 const run=async(name,body,{protocol=false,blocked=false}={})=>{
  if(blocked){results.push({name,status:'blocked',reason:'required input protocol preflight failed'});console.error('Touch case',JSON.stringify(results.at(-1)));return false;}
  let context,page,result;const errors=[];
  try{
  context=await browser.newContext({viewport:{width:1280,height:960},hasTouch:true});page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  const cdp=await context.newCDPSession(page),driver=touchDriver(page,cdp),send=driver.send;
  const positions=()=>page.locator('.node').evaluateAll(ns=>ns.map(n=>[n.dataset.node,n.style.left,n.style.top]));
  const view=()=>page.locator('#viewport').evaluate(n=>({scroll:[n.scrollLeft,n.scrollTop],zoom:parseFloat(document.querySelector('#nodes').style.transform.slice(6)),scale:visualViewport.scale,rect:{x:n.getBoundingClientRect().left+n.clientLeft,y:n.getBoundingClientRect().top+n.clientTop,width:n.clientWidth,height:n.clientHeight}}));
  const waitZoom=expected=>page.waitForFunction(value=>Math.abs(parseFloat(document.querySelector('#nodes').style.transform.slice(6))-value)<1e-8,expected);
  const pinch=async(cx,cy,from,to,end='touchEnd')=>{
   const expected=Math.max(.25,Math.min(2.5,(await view()).zoom*to/from));
   await send('touchStart',[[1,cx-from/2,cy],[2,cx+from/2,cy]]);
   for(let i=1;i<=5;i++){const gap=from+(to-from)*i/5;await send('touchMove',[[1,cx-gap/2,cy],[2,cx+gap/2,cy]]);}
   await waitZoom(expected);await send(end,[]);
  };
   await driver.install();
   if(protocol){
    await page.goto('data:text/html,'+encodeURIComponent('<!doctype html><style>body{margin:0}#viewport{width:100vw;height:100vh;touch-action:none}</style><div id="viewport"></div>'));
   }else{
    await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);
    await page.locator('#open-sample').click();await page.locator('#drawer').click();
   }
   await body({page,cdp,driver,send,positions,view,pinch,waitZoom});driver.idle();assert.deepEqual(errors,[]);
   result={name,status:'passed'};
  }catch(error){
   let diagnostics;try{diagnostics=page?await page.evaluate(()=>({command:window.touchCommand,events:window.touchTrace,observed:window.touchObserved,panProbe:window.panProbe,drawerProbe:window.drawerProbe})):null;}catch(readError){diagnostics={readError:String(readError)};}
   result={name,status:'failed',error:String(error),pageErrors:errors,diagnostics};
  }finally{
   if(context)try{await context.close();}catch(error){result={...result,name,status:'failed',teardownError:String(error)};}
  }
  results.push(result);console.log('Touch case',JSON.stringify(result));return result.status==='passed';
 };
 console.log('Touch browser configuration',JSON.stringify({browser:browser.version(),input:'CDP; observed legacy partial-end adapter; no feature-flag override'}));
 const basic=await run('protocol: move, full end, cancel, repeated gesture',async({send})=>{
  await send('touchStart',[[1,200,200],[2,400,200]]);await send('touchMove',[[1,180,200],[2,420,200]]);await send('touchEnd',[]);
  await send('touchStart',[[1,200,200],[2,400,200]]);await send('touchCancel',[]);
  await send('touchStart',[[1,200,200]]);await send('touchEnd',[]);
 },{protocol:true});
 const partial=await run('protocol: added finger and partial end releases removed ID',async({send})=>{
  await send('touchStart',[[1,200,200]]);await send('touchStart',[[1,200,200],[2,400,200]]);
  await send('touchMove',[[1,180,200],[2,420,200]]);await send('touchEnd',[[2,420,200]]);
  await send('touchMove',[[2,440,210]]);await send('touchEnd',[]);
 },{protocol:true,blocked:!basic});
 await run('product: second finger rollback and remaining finger isolation',async({page,send,positions,view,waitZoom})=>{
  const initial=await positions(),box=await page.locator('.node').first().boundingBox(),x=box.x+80,y=box.y+30;
  await send('touchStart',[[1,x,y]]);await send('touchEnd',[]);const selected=await page.locator('.node.selected').getAttribute('data-node');
  await send('touchStart',[[1,x,y]]);await send('touchMove',[[1,x+15,y+8]]);assert.notDeepEqual(await positions(),initial);
  await send('touchStart',[[1,x+15,y+8],[2,x+115,y+8]]);assert.deepEqual(await positions(),initial);
  await send('touchMove',[[1,x-10,y+8],[2,x+140,y+8]]);await waitZoom(1.5);assert.equal((await view()).zoom,1.5);assert.deepEqual(await positions(),initial);
  await send('touchEnd',[[2,x+140,y+8]]);const held=await view();await send('touchMove',[[2,x+200,y+30]]);await send('touchEnd',[]);
  assert.equal((await view()).zoom,held.zoom);assert.deepEqual(await positions(),initial);assert.equal(await page.locator('.node.selected').getAttribute('data-node'),selected);
 },{blocked:!partial});
 await run('product: midpoint, zoom limits, cancel and consecutive gestures',async({page,positions,view,pinch})=>{
  const initial=await positions(),cx=500,cy=400;await pinch(cx,cy,200,300);assert.equal((await view()).zoom,1.5);
  await page.locator('#viewport').evaluate(n=>{n.scrollLeft=300;n.scrollTop=200;});const before=await view();
  const anchor=[(before.scroll[0]+cx-before.rect.x)/before.zoom,(before.scroll[1]+cy-before.rect.y)/before.zoom];
  await pinch(cx,cy,200,300);const after=await view();assert.equal(after.zoom,2.25);
  for(let i=0;i<2;i++){const local=[cx-before.rect.x,cy-before.rect.y][i];assert.ok(Math.abs((after.scroll[i]+local)/after.zoom-anchor[i])<1,'midpoint anchor');}
  assert.equal(after.scale,1);assert.deepEqual(await positions(),initial);
  await pinch(cx,cy,200,300);assert.equal((await view()).zoom,2.5);await pinch(cx,cy,300,20,'touchCancel');assert.equal((await view()).zoom,.25);await pinch(cx,cy,100,200);assert.equal((await view()).zoom,.5);assert.deepEqual(await positions(),initial);
 },{blocked:!basic});
 await run('product: one-finger node drag and confirmed-background pan',async({page,driver,send,positions,view,pinch})=>{
  const initial=await positions();await pinch(500,400,200,300);await pinch(500,400,300,200);assert.equal((await view()).zoom,1);assert.deepEqual(await positions(),initial);
  await page.locator('#viewport').evaluate(n=>{n.scrollLeft=0;n.scrollTop=0;});const target=await page.locator('.node').first().boundingBox();
  await send('touchStart',[[1,target.x+30,target.y+15]]);await send('touchMove',[[1,target.x+60,target.y+35]]);await send('touchEnd',[]);assert.notDeepEqual(await positions(),initial);
  await page.locator('#viewport').evaluate(n=>{n.scrollLeft=100;n.scrollTop=100;});
  // Wait for a painted frame after programmatic scroll/scale, then keep well clear
  // of every node rectangle. A point on a rounded corner is not a safe touch area.
  await driver.painted();
  const background=await page.locator('#viewport').evaluate(n=>{
    const r=n.getBoundingClientRect(),rects=[...n.querySelectorAll('.node')].map(node=>{const b=node.getBoundingClientRect();return {id:node.dataset.node,left:b.left,top:b.top,right:b.right,bottom:b.bottom};});
    let best;
    for(let y=r.top+80;y<r.bottom-80;y+=20)for(let x=r.left+80;x<r.right-80;x+=20){
      const hit=document.elementFromPoint(x,y);if(!hit||!n.contains(hit)||hit.closest('.node'))continue;
      const clearance=Math.min(...rects.map(b=>Math.hypot(Math.max(b.left-x,0,x-b.right),Math.max(b.top-y,0,y-b.bottom))));
      if(!best||clearance>best.clearance)best={x,y,clearance,domTarget:hit.id||hit.className};
    }
    if(!best||best.clearance<48)throw Error('No background with 48px node clearance for touch pan');
    window.panProbe={...best,rects,scroll:[n.scrollLeft,n.scrollTop],transform:document.querySelector('#nodes').style.transform,viewport:{left:r.left,top:r.top,right:r.right,bottom:r.bottom},actualDown:null};
    document.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')window.panProbe.actualDown={id:e.pointerId,target:e.target.id||e.target.className,node:e.target.closest('.node')?.dataset.node??null,inViewport:n.contains(e.target),x:e.clientX,y:e.clientY};},{capture:true,once:true});
    return best;
  });
  const beforePanPositions=await positions();await send('touchStart',[[1,background.x,background.y]]);
  await page.waitForFunction(()=>window.panProbe.actualDown!==null);const probe=await page.evaluate(()=>window.panProbe);console.log('Background pan probe',JSON.stringify(probe));
  assert.ok(probe.actualDown?.inViewport,'touch must really target the graph');
  assert.equal(probe.actualDown.node,null,'a touch adjusted onto a node is not a background pan test');
  assert.ok(Math.abs(probe.actualDown.x-background.x)<=1&&Math.abs(probe.actualDown.y-background.y)<=1,'touch coordinates must match the inspected scene');
  await send('touchMove',[[1,background.x-50,background.y-50]]);await send('touchEnd',[]);
  await page.waitForFunction(()=>{const n=document.querySelector('#viewport');return n.scrollLeft===150&&n.scrollTop===150;});
  assert.deepEqual((await view()).scroll,[150,150]);assert.deepEqual(await positions(),beforePanPositions);
 },{blocked:!basic});
 await run('product: Scope/Write and pinch save-close-reload-reopen',async({page,send,positions,view,pinch})=>{
  const target=await page.locator('.node').first().boundingBox();
  await send('touchStart',[[1,target.x+30,target.y+15]]);await send('touchMove',[[1,target.x+60,target.y+35]]);await send('touchEnd',[]);
  const dragged=await positions();
  await page.locator('#hide-outside').check();await page.locator('#prefer-write').check();assert.equal(await page.locator('.node').count(),12);assert.equal(await page.locator('.edge').count(),14);await pinch(500,400,200,300);
  const savedView=await view(),visible=await positions();assert.equal(savedView.zoom,1.5);assert.equal(await page.locator('#zoom').textContent(),'150%');
  await page.locator('.close').click();await page.locator('.tab').waitFor({state:'detached'});await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('#open-sample').click();
  assert.equal((await view()).zoom,savedView.zoom);assert.deepEqual((await view()).scroll,savedView.scroll);assert.deepEqual(await positions(),visible);
  assert.equal(await page.locator('#hide-outside').isChecked(),true);assert.equal(await page.locator('#prefer-write').isChecked(),true);await page.locator('#hide-outside').uncheck();assert.deepEqual(await positions(),dragged);
 },{blocked:!basic});
 await run('product: Drawer native touch scroll is independent of graph',async({page,cdp,driver,view})=>{
  await page.locator('.node.outside').first().click();await page.locator('#hide-outside').check();await page.locator('#hide-outside').uncheck();await page.locator('#drawer').click();const detail=page.locator('#detail');assert.equal(await detail.evaluate(n=>getComputedStyle(n).touchAction),'auto');driver.idle();await detail.evaluate(n=>{n.scrollTop=0;});await driver.painted();const d=await detail.boundingBox();
  const nativeStart=await detail.evaluate(n=>({serial:window.touchObserved.serial,scroll:n.scrollTop}));
  assert.equal(nativeStart.scroll,0,'native scroll needs a fresh zero-scroll baseline');
  await page.evaluate(probe=>{window.drawerProbe=probe;},{...nativeStart,x:d.x+d.width/2,y:d.y+300});
  await cdp.send('Input.synthesizeScrollGesture',{x:d.x+d.width/2,y:d.y+300,yDistance:-150,gestureSourceType:'touch',speed:400,preventFling:true});
  await page.waitForFunction(({serial,scroll})=>{
    const state=window.touchObserved,down=state.downs.find(e=>e.seq>serial);
    const end=down&&state.last[down.id];
    return down&&end&&end.seq>down.seq&&['pointerup','pointercancel'].includes(end.type)&&Object.keys(state.active).length===0&&document.querySelector('#detail').scrollTop>scroll;
  },nativeStart);
  const nativeDown=await page.evaluate(serial=>window.touchObserved.downs.find(e=>e.seq>serial),nativeStart.serial);
  assert.equal(nativeDown.region,'drawer','native touch must really start inside the Drawer');
  assert.equal((await view()).zoom,1);await page.locator('#drawer').click();
 });
 await run('product: 393px viewport pinch and unchanged browser scale',async({page,view,pinch})=>{
  await page.setViewportSize({width:393,height:852});await page.locator('#viewport').evaluate(n=>{n.scrollLeft=0;n.scrollTop=0;});const before=await view();
  await pinch(before.rect.x+before.rect.width/2,before.rect.y+200,80,120);assert.equal((await view()).zoom,1.5);assert.equal((await view()).scale,1);
 },{blocked:!basic});
 return {input:'Chrome CDP touch emulation, not physical Android',ok:results.every(r=>r.status==='passed'),results};
}
