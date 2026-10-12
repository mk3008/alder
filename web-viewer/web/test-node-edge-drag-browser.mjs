import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseDesign} from '../src/graph.ts';
import {touchDriver} from './touch-driver.mjs';
import {readSessionInPage,waitForExactRead,waitSavedViewer} from './wait-saved-viewer.mjs';

const origin='http://127.0.0.1:4173/';
const caseTimeoutMs=8000, suiteBudgetMs=360000; // Global budget leaves room for the existing CI gates.
export const edgeDragMoving='person';
export const edgeDragPositions={person:[0,0],record:[700,1000],read:[1300,600],approve:[1300,1400]};
export function edgeDragFixture(){
 const raw=JSON.parse(readFileSync(new URL('./authorities/contract-cases.json',import.meta.url),'utf8')).find(c=>c.name==='test_explicit_exception_kinds').input;
 return {raw,design:parseDesign(raw)};
}
const {raw,design}=edgeDragFixture();
const incident=design.graph.relations.flatMap((r,i)=>r.from===edgeDragMoving||r.to===edgeDragMoving?[String(i)]:[]);
const unrelated=design.graph.relations.flatMap((r,i)=>r.from!==edgeDragMoving&&r.to!==edgeDragMoving?[String(i)]:[]);
assert.ok(incident.length&&unrelated.length,'fixture must contain incident and unrelated relations');
const clone=value=>structuredClone(value);

// Pure oracle: integer physical input, power-of-two zoom and actual realized
// scroll define the world result independently. Native scroll values can be
// fractional: DB values still compare exactly, while DOM styles compare against
// the same browser's exact canonical CSSOM serialization of that expectation.
// No CSS-derived expected positions and no approximate world/IndexedDB assertions. Only getBoundingClientRect screen
// coordinates may differ by <= 1 CSS pixel due to browser layout/scroll rounding.
export function expectedEdgePosition(initial,start,end,zoom,before,after){
 return initial.map((value,axis)=>value+(end[axis]-start[axis])/zoom+
  ((after.scroll[axis]/zoom-after.offset[axis]/zoom)-(before.scroll[axis]/zoom-before.offset[axis]/zoom)));
}
export const edgeDragMatrix=[1280,393,320].flatMap(width=>[.25,1].flatMap(zoom=>['mouse','touch'].flatMap(input=>['left','right','top','bottom'].map(edge=>({width,zoom,input,edge})))));

// Serialized by page.evaluate, and shared with the local fake-IDB preflight.
// Seed from a same-origin non-product document so an old app debounce cannot
// overwrite this committed fixture. The real right-drawer field is `drawer`.
export function seedEdgeDragSession({positions,zoom,scroll,viewInset,moving='person'}){return new Promise((resolve,reject)=>{
 const request=indexedDB.open('alder-web-viewer',1);request.onerror=()=>reject(request.error);
 request.onsuccess=()=>{const db=request.result;let failure;
  try{const tx=db.transaction('session','readwrite'),store=tx.objectStore('session'),get=store.get('current');
   get.onsuccess=()=>{const session=get.result,tab=session?.tabs?.find(t=>t.key===session.active);
    if(!tab){failure=Error('Edge-drag fixture has no active saved tab');tx.abort();return;}
    Object.assign(tab,{positions,zoom,scroll,viewInset,selected:moving,hiddenNodes:[],showExceptions:true,selectedEdgesOnly:false});delete tab.canvasOrigin;
    session.drawer=false;session.nodeDrawer=false;session.preferWrite=false;store.put(session,'current');
   };
   tx.oncomplete=()=>{db.close();resolve(true);};tx.onerror=tx.onabort=()=>{db.close();reject(failure??tx.error??Error('Edge-drag fixture transaction failed'));};
  }catch(error){db.close();reject(error);}
 };
});}

// This function reads one synchronous frame, including the *rendered* grip and
// route labels; no inferred bounding boxes or internal app/controller hooks.
function readFrame(){
 const v=document.querySelector('#viewport'),nodes=document.querySelector('#nodes'),bar=document.querySelector('.toolbar').getBoundingClientRect(),r=v.getBoundingClientRect();
 const positions={},styles={},rects={},routes={};
 for(const node of document.querySelectorAll('.node')){const b=node.getBoundingClientRect();positions[node.dataset.node]=[parseFloat(node.style.left),parseFloat(node.style.top)];styles[node.dataset.node]=[node.style.left,node.style.top];rects[node.dataset.node]=[b.left,b.top,b.width,b.height];}
 for(const edge of document.querySelectorAll('.edge')){const label=document.querySelector(`.edge-label[data-relation="${edge.dataset.relation}"]`);routes[edge.dataset.relation]={path:edge.getAttribute('d'),label:label?[label.getAttribute('x'),label.getAttribute('y')]:null};}
 const left=r.left+v.clientLeft,top=r.top+v.clientTop;
 const scroll=[v.scrollLeft,v.scrollTop],offset=[parseFloat(nodes.style.left)||0,parseFloat(nodes.style.top)||0],plan=window.edgeDragOracle;let oracle;
 if(plan){const {position,start,end,zoom,before}=plan,expected=position.map((value,axis)=>value+(end[axis]-start[axis])/zoom+((scroll[axis]/zoom-offset[axis]/zoom)-(before.scroll[axis]/zoom-before.offset[axis]/zoom))),style=document.createElement('div').style;style.left=expected[0]+'px';style.top=expected[1]+'px';oracle={id:plan.id,position:expected,style:[style.left,style.top]};}
 return {positions,styles,rects,routes,scroll,offset,oracle,zoom:parseFloat(nodes.style.transform.slice(6)),bounds:{left,top,right:left+v.clientWidth,bottom:Math.min(top+v.clientHeight,bar.top-12)},client:[v.clientWidth,v.clientHeight],extent:[v.scrollWidth,v.scrollHeight],events:window.edgeDragTrace?.length??0};
}
const frame=page=>page.evaluate(readFrame);
async function paintedFrames(page,count=4){
 // page.evaluate has no built-in timeout. Bound even a backgrounded/frozen RAF
 // and close its independent context on failure instead of hanging the suite.
 let timer;try{return await Promise.race([page.evaluate(async({source,count})=>{
  const read=(0,eval)(`(${source})`),samples=[];
  for(let i=0;i<count;i++){await new Promise(resolve=>requestAnimationFrame(resolve));samples.push(read());}
  return samples;
 },{source:readFrame.toString(),count}),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Edge-drag painted-frame deadline exceeded')),4000);})]);}finally{clearTimeout(timer);}
}
function assertUnchangedOthers(current,initial){
 const moving=current.oracle?.id??edgeDragMoving,unrelated=design.graph.relations.flatMap((r,i)=>r.from!==moving&&r.to!==moving?[String(i)]:[]);
 for(const [id,p] of Object.entries(initial.positions))if(id!==moving)assert.deepEqual(current.positions[id],p,`other world position ${id}`);
 for(const id of unrelated)assert.deepEqual(current.routes[id],initial.routes[id],`nonincident path and label ${id}`);
}
function assertGrip(current,grip,pointer){
 const box=current.rects[current.oracle?.id??edgeDragMoving];
 for(const axis of [0,1])assert.ok(Math.abs(box[axis]+grip[axis]-pointer[axis])<=1,`actual screen grip axis ${axis}: ${box[axis]+grip[axis]} vs pointer ${pointer[axis]} (maximum 1 CSS pixel)`);
}
function assertDrag(current,initial,start,end,zoom,grip){
 const moving=current.oracle.id,expected=expectedEdgePosition(initial.positions[moving],start,end,zoom,initial,current);
 assert.ok(expected.every(Number.isFinite),'independent world oracle must be finite');
 assert.ok(current.offset.every(Number.isSafeInteger),'power-of-two zoom preserves exact integer screen-pixel origin/inset increments');
 assert.deepEqual(current.oracle.position,expected,'browser CSS serialization receives the exact independent world expectation');
 assert.deepEqual(current.styles[moving],current.oracle.style,'DOM matches exact canonical CSSOM serialization of independent world coordinates');
 assertUnchangedOthers(current,initial);assertGrip(current,grip,end);
 return {...clone(initial.positions),[moving]:expected};
}
function stoppedProjection(value){return {positions:value.positions,styles:value.styles,routes:value.routes,scroll:value.scroll,offset:value.offset,extent:value.extent,zoom:value.zoom};}
async function assertStopped(page,baseline){
 for(const sample of await paintedFrames(page,8))assert.deepEqual(stoppedProjection(sample),stoppedProjection(baseline),'released/interrupted edge hold must stop on every painted frame');
}

async function installTrace(page){await page.addInitScript(()=>{
 window.edgeDragTrace=[];
 for(const type of ['pointerdown','pointermove','pointerup','pointercancel','lostpointercapture'])document.addEventListener(type,e=>{
  window.edgeDragTrace.push({type,kind:e.pointerType,id:e.pointerId,x:e.clientX,y:e.clientY,node:e.target.closest?.('.node')?.dataset.node??null,trusted:e.isTrusted});
 },true);
});}
async function pointerDriver(page,context,input){
 const cdp=await context.newCDPSession(page);
 if(input==='touch'){
  const driver=touchDriver(page,cdp);await driver.install();
  return {touch:driver.send,down:p=>driver.send('touchStart',[[1,...p]]),move:p=>driver.send('touchMove',[[1,...p]]),up:()=>driver.send('touchEnd',[]),cancel:()=>driver.send('touchCancel',[])};
 }
 if(input==='pen'){
  const send=(type,p,buttons)=>cdp.send('Input.dispatchMouseEvent',{type,x:p[0],y:p[1],button:type==='mouseMoved'?'none':'left',buttons,clickCount:type==='mouseMoved'?0:1,pointerType:'pen'});
  let point;return {down:async p=>{point=p;await send('mouseMoved',p,0);await send('mousePressed',p,1);},move:async p=>{point=p;await send('mouseMoved',p,1);},up:()=>send('mouseReleased',point,0)};
 }
 return {down:async p=>{await page.mouse.move(...p);await page.mouse.down();},move:p=>page.mouse.move(...p),up:()=>page.mouse.up()};
}
async function openFixture(page,zoom,atExtent,moving=edgeDragMoving){
 await page.goto(origin);await page.waitForFunction(()=>!document.querySelector('#open').disabled);
 await page.locator('#open-text').click();await page.locator('#source-text').fill(raw);await page.locator('#source-submit').click();
 await page.waitForFunction(()=>document.querySelectorAll('.node').length===4||!!document.querySelector('#status[data-kind=error]:not([hidden])'));
 assert.equal(await page.locator('#status[data-kind=error]:not([hidden])').count(),0,'public parser fixture must open without an error');
 await waitSavedViewer(page,{positions:(await frame(page)).positions});
 // Explicitly close both overlays before measuring the visible viewport.
 if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
 if(await page.locator('#node-list-drawer').isVisible())await page.locator('#node-list-toggle').click();
 await waitForExactRead(()=>page.evaluate(readSessionInPage),{drawer:false,nodeDrawer:false},{project:s=>({drawer:s?.drawer,nodeDrawer:!!s?.nodeDrawer})});
 const measured=await frame(page),viewInset=[4096,4096],positions=clone(edgeDragPositions);
 if(moving!==edgeDragMoving){positions[edgeDragMoving]=positions[moving];positions[moving]=[0,0];}
 if(atExtent==='right'){positions[moving]=[7000,0];viewInset[0]=0;}
 if(atExtent==='bottom'){positions[moving]=[0,5000];viewInset[1]=0;}
 if(atExtent==='left')viewInset[0]=0;
 if(atExtent==='top')viewInset[1]=0;
 const scroll=[Math.max(0,Math.round((positions[moving][0]+viewInset[0]+130)*zoom-measured.client[0]/2)),Math.max(0,Math.round((positions[moving][1]+viewInset[1]+34)*zoom-(measured.bounds.bottom-measured.bounds.top)/2))];
 assert.ok(scroll.every(x=>x>=0),'inset must be large enough to center the visible fixture');
 await page.goto(origin+'LICENSE.txt');
 await page.evaluate(seedEdgeDragSession,{positions,zoom,scroll,viewInset,moving});
 const saved=await waitSavedViewer(page,{positions,zoom,scroll,viewInset,selected:moving});
 assert.equal(saved.drawer,false);assert.equal(saved.nodeDrawer,false);
 await page.goto(origin);await page.waitForFunction(()=>!document.querySelector('#open').disabled&&document.querySelectorAll('.node').length===4);
 if(atExtent)await page.locator('#viewport').evaluate((v,edge)=>{if(edge==='right')v.scrollLeft=v.scrollWidth;else if(edge==='bottom')v.scrollTop=v.scrollHeight;else if(edge==='left')v.scrollLeft=0;else v.scrollTop=0;},atExtent);
 await paintedFrames(page,2);const initial=await frame(page);
 assert.deepEqual(initial.positions,positions);assert.equal(initial.zoom,zoom);
 if(!atExtent)assert.deepEqual(initial.scroll,scroll);
 else {const axis=['left','right'].includes(atExtent)?0:1,negative=['left','top'].includes(atExtent);assert.equal(initial.scroll[axis],negative?0:initial.extent[axis]-initial.client[axis],'boundary fixture begins at the realized scroll limit');}
 assert.equal(await page.locator('#formattedMarkdownDrawer').isVisible(),false);assert.equal(await page.locator('#node-list-drawer').isVisible(),false);
 assert.equal(Object.keys(initial.routes).length,design.graph.relations.length);
 const box=initial.rects[moving],start=[Math.round(box[0]+130*zoom),Math.round(box[1]+34*zoom)];
 // A near-leading-edge grip exhausts the 24-world-pixel negative reserve in
 // a bounded frame window without a long arbitrary hold. Still inside the card.
 if(atExtent==='left')start[0]=Math.ceil(box[0])+8;
 if(atExtent==='top')start[1]=Math.ceil(box[1])+8;
 const margin=atExtent?0:48;assert.ok(start[0]>initial.bounds.left+margin&&start[0]<initial.bounds.right-margin&&start[1]>initial.bounds.top+margin&&start[1]<initial.bounds.bottom-margin,'selected node must begin visibly inside the usable viewport');
 assert.equal(await page.evaluate(([x,y])=>document.elementFromPoint(x,y)?.closest('.node')?.dataset.node,start),moving,'actual hit test must reach the selected node');
 return {moving,initial,start,grip:[start[0]-box[0],start[1]-box[1]],viewInset};
}
function edgeTarget(initial,start,edge){const end=[...start],b=initial.bounds;if(edge==='left')end[0]=Math.ceil(b.left)+2;if(edge==='right')end[0]=Math.floor(b.right)-2;if(edge==='top')end[1]=Math.ceil(b.top)+2;if(edge==='bottom')end[1]=Math.floor(b.bottom)-2;return end;}
async function unlock(page){await page.locator('#layout-lock').click();assert.equal(await page.locator('#layout-lock').getAttribute('aria-pressed'),'false');}
async function beginHold(env,edge){
 const {page,driver,input,zoom,initial,start,grip,moving}=env,end=edgeTarget(initial,start,edge);
 await page.evaluate(oracle=>{window.edgeDragOracle=oracle;},{id:moving,position:initial.positions[moving],start,end,zoom,before:{scroll:initial.scroll,offset:initial.offset}});
 await driver.down(start);await driver.move(end);
 await page.waitForFunction(({input,end})=>window.edgeDragTrace.some(e=>e.type==='pointermove'&&e.kind===input&&e.trusted&&Math.abs(e.x-end[0])<.01&&Math.abs(e.y-end[1])<.01),{input,end});
 const first=await frame(page),samples=await paintedFrames(page,env.atExtent&&['left','top'].includes(edge)?24:10),last=samples.at(-1),axis=['left','right'].includes(edge)?0:1,direction=['left','top'].includes(edge)?-1:1;
 assert.ok(direction*(last.positions[moving][axis]-first.positions[moving][axis])*zoom>=4,'stationary pointer hold must advance world position on successive painted frames');
 for(const sample of samples){assertDrag(sample,initial,start,end,zoom,grip);assert.equal(sample.events,first.events,'stationary hold must not depend on fresh pointer events');}
 const incident=design.graph.relations.flatMap((r,i)=>r.from===moving||r.to===moving?[String(i)]:[]);
 assert.ok(incident.some(id=>last.routes[id].path!==initial.routes[id].path),'incident routes follow the dragged card');
 if(direction<0){assert.ok(last.positions[moving][axis]<0,'left/top drag must cross zero into signed world coordinates');assert.ok(last.offset[axis]>initial.offset[axis],'signed drag must grow the camera origin');}
 return {end,last,samples:samples.length,frames:samples};
}
async function committedReload(env,expected){
 const {page,zoom,viewInset}=env,current=await frame(page),canvasOrigin=current.offset.map((v,i)=>v/zoom-viewInset[i]);
 const fields={positions:expected,zoom,scroll:current.scroll,viewInset,canvasOrigin:canvasOrigin.some(Boolean)?canvasOrigin:undefined};
 const committed=await waitSavedViewer(page,fields);
 const tab=committed.tabs.find(t=>t.key===committed.active);assert.deepEqual(tab.positions,expected,'actual committed DB values must equal independent world coordinates');
 await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled&&document.querySelectorAll('.node').length===4);await paintedFrames(page,2);
 const restored=await frame(page),canonical=await page.evaluate(expected=>Object.fromEntries(Object.entries(expected).map(([id,p])=>{const style=document.createElement('div').style;style.left=p[0]+'px';style.top=p[1]+'px';return [id,[style.left,style.top]];})),expected);assert.deepEqual(restored.styles,canonical,'cold reload DOM exactly serializes the independently expected world coordinates');assert.equal(restored.zoom,zoom);
 // Cold routing may discover a more-negative route and grow canvasOrigin.
 // The saved DB snapshot above remains exact. This check is solely the screen
 // representation: matching origin/scroll compensation must retain every card.
 const screenCameraDelta=restored.scroll.map((value,axis)=>(value-current.scroll[axis])-(restored.offset[axis]-current.offset[axis]));
 assert.ok(screenCameraDelta.every(v=>Math.abs(v)<=1),'cold route-origin compensation must preserve the physical camera within 1 CSS pixel');
 for(const [id,box] of Object.entries(current.rects))for(const axis of [0,1])assert.ok(Math.abs(restored.rects[id][axis]-box[axis])<=1,`cold reload actual card screen position ${id} axis ${axis} must stay within 1 CSS pixel`);
 const readback=await page.evaluate(readSessionInPage);assert.deepEqual(readback.tabs.find(t=>t.key===readback.active).positions,expected,'cold DB readback remains exact');
 return {positions:expected,scroll:current.scroll,canvasOrigin,coldView:{scroll:restored.scroll,offset:restored.offset,originScreenChange:restored.offset.map((v,i)=>v-current.offset[i]),screenCameraDelta}};
}
async function runIsolated(browser,options,body){
 const context=await browser.newContext({viewport:{width:options.width,height:960},hasTouch:options.input==='touch'}),page=await context.newPage(),errors=[];
 page.setDefaultTimeout(4000);page.setDefaultNavigationTimeout(8000);page.on('pageerror',e=>errors.push(e.message));
 let timer;try{
  return await Promise.race([(async()=>{await installTrace(page);const driver=await pointerDriver(page,context,options.input),fixture=await openFixture(page,options.zoom,options.atExtent,options.moving),env={...options,...fixture,page,context,driver};
   const result=await body(env);assert.deepEqual(errors,[],'browser page errors');return result;
  })(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error(`Independent edge-drag case exceeded ${caseTimeoutMs}ms`)),caseTimeoutMs);})]);
 }catch(error){
  let diagnostics;try{diagnostics=await Promise.race([page.evaluate(()=>({events:window.edgeDragTrace?.slice(-12),touch:window.touchCommand,status:document.querySelector('#status-text')?.textContent})),new Promise(resolve=>setTimeout(()=>resolve({diagnosticTimeout:true}),500))]);}catch(readError){diagnostics={readError:String(readError)};}
  console.error('NODE_EDGE_DRAG_DIAGNOSTICS '+JSON.stringify({options,errors,diagnostics}));throw error;
 }finally{clearTimeout(timer);await context.close();}
}
async function verifyEdge(browser,options){return runIsolated(browser,options,async env=>{
 await unlock(env.page);const hold=await beginHold(env,options.edge);if(options.atExtent){const axis=['left','right'].includes(options.edge)?0:1;if(['left','top'].includes(options.edge)){const exhausted=hold.frames.filter(s=>s.scroll[axis]<=1);assert.ok(exhausted.length>=2,'hold must actually exhaust the negative native scroll reserve');assert.ok(exhausted.at(-1).offset[axis]>exhausted[0].offset[axis],'origin must keep growing after native scroll reaches zero');}else assert.ok(hold.last.extent[axis]>env.initial.extent[axis]+4,'holding at the existing positive scroll limit must grow the real canvas extent');}await env.driver.up();const released=await frame(env.page),expected=assertDrag(released,env.initial,env.start,hold.end,env.zoom,env.grip);
 await assertStopped(env.page,released);const saved=await committedReload(env,expected);
 return {...options,moving:env.moving,paintedHoldFrames:hold.samples,screenGripTolerance:1,...saved};
});}
async function verifyInterruption(browser,stop,input='mouse',zoom=.25){return runIsolated(browser,{width:393,zoom,input},async env=>{
 const {page,driver}=env;await unlock(page);const hold=await beginHold(env,'right');
 if(stop==='cancel')await driver.cancel();
 else if(stop==='capture-loss')await page.locator('.node[data-node="person"]').evaluate(node=>{const event=[...window.edgeDragTrace].reverse().find(e=>e.type==='pointerdown'&&e.kind==='mouse');if(!event||!node.hasPointerCapture(event.id))throw Error('Expected native pointer capture');node.releasePointerCapture(event.id);});
 else if(stop==='lock'){await page.locator('#layout-lock').focus();await page.keyboard.press('Space');assert.equal(await page.locator('#layout-lock').getAttribute('aria-pressed'),'true');}
 else if(stop==='blur')await page.evaluate(()=>window.dispatchEvent(new Event('blur')));
 else if(stop==='tab-close'){
  await page.locator('.tab .close').focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>document.querySelectorAll('.tab,.node').length===0);
  await driver.up();await paintedFrames(page,8);assert.equal(await page.locator('.node').count(),0);
  await waitForExactRead(()=>page.evaluate(readSessionInPage),[],{project:s=>s?.tabs});await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);assert.equal(await page.locator('.tab,.node').count(),0);
  return {stop,input,zoom,closedSavedTabs:0};
 }
 else throw Error('Unknown stop '+stop);
 // Capture-loss is asynchronously delivered by Chromium, not dispatchEvent.
 const releasedPointer=stop==='capture-loss'?[hold.end[0]-1,hold.end[1]]:hold.end;
 if(stop==='capture-loss'){await driver.move(releasedPointer);await page.waitForFunction(()=>window.edgeDragTrace.some(e=>e.type==='lostpointercapture'&&e.trusted));}
 const stopped=await frame(page);await assertStopped(page,stopped);
 let expected;
 if(stop==='capture-loss'){expected={...clone(env.initial.positions),[edgeDragMoving]:expectedEdgePosition(env.initial.positions[edgeDragMoving],env.start,hold.end,zoom,env.initial,stopped)};assert.deepEqual(stopped.oracle.position,expected[edgeDragMoving],'capture loss retains the last valid drag equation, ignoring the new physical pointer move');assert.deepEqual(stopped.styles[edgeDragMoving],stopped.oracle.style,'capture loss retains the exact serialized world coordinate');assertUnchangedOthers(stopped,env.initial);}
 else expected=assertDrag(stopped,env.initial,env.start,hold.end,zoom,env.grip);
 if(stop!=='cancel')await driver.up();await assertStopped(page,stopped);
 const saved=await committedReload(env,expected);return {stop,input,zoom,...saved,...(stop==='capture-loss'?{lastDragPointer:hold.end,releasedPointer}:{}),...(stop==='blur'?{limit:'Blur event is deliberately dispatched to exercise the lifecycle handler; real OS focus switching is not claimed.'}:{})};
});}
async function verifySecondFinger(browser,zoom){return runIsolated(browser,{width:393,zoom,input:'touch'},async env=>{
 const {page,driver,start}=env;await unlock(page);const hold=await beginHold(env,'right'),second=[start[0],start[1]+100];
 await driver.touch('touchStart',[[1,...hold.end],[2,...second]]);const rollback=await frame(page);assert.deepEqual(rollback.positions,edgeDragPositions,'second finger rolls back the tentative node movement exactly');
 await assertStopped(page,rollback);
 const spread=[second[0]-20,second[1]+20];await driver.touch('touchMove',[[1,...hold.end],[2,...spread]]);const pinched=await frame(page);assert.notEqual(pinched.zoom,zoom,'second finger must enter working pinch zoom');assert.deepEqual(pinched.positions,edgeDragPositions);
 await driver.touch('touchEnd',[[2,...spread]]);const lifted=await frame(page);await driver.touch('touchMove',[[2,spread[0]+15,spread[1]+15]]);assert.deepEqual(stoppedProjection(await frame(page)),stoppedProjection(lifted),'remaining finger is blocked from resuming node drag or pinch');
 await driver.touch('touchEnd',[]);const final=await frame(page);await assertStopped(page,final);
 await waitSavedViewer(page,{positions:edgeDragPositions,zoom:final.zoom,scroll:final.scroll});await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled&&document.querySelectorAll('.node').length===4);assert.deepEqual((await frame(page)).positions,edgeDragPositions);
 return {zoom,pinchZoom:final.zoom,rolledBackPositions:edgeDragPositions,remainingFingerBlocked:true};
});}
async function verifyLocked(browser,input){return runIsolated(browser,{width:320,zoom:1,input},async env=>{
 const {page,driver,start,initial}=env,end=edgeTarget(initial,start,'left');assert.equal(await page.locator('#layout-lock').getAttribute('aria-pressed'),'true');
 await driver.down(start);await driver.move(end);const held=await frame(page);assert.deepEqual(held.positions,edgeDragPositions);await assertStopped(page,held);await driver.up();await assertStopped(page,await frame(page));
 await waitSavedViewer(page,{positions:edgeDragPositions,zoom:1});return {input,positions:edgeDragPositions,stationaryAutopan:false};
});}

// Caller owns Chromium/server. Every case owns a fresh context and has an
// explicit deadline; failures never silently skip independent cases or inputs.
export async function verifyNodeEdgeDrag(browser){
 const cases=[...edgeDragMatrix.map(options=>({name:`${options.input} ${options.edge} ${options.width}px ${options.zoom*100}%`,run:()=>verifyEdge(browser,options)})),
  ...[.25,1].flatMap(zoom=>['left','right','top','bottom'].map(edge=>({name:`grow existing ${edge} extent ${zoom*100}%`,run:()=>verifyEdge(browser,{width:393,zoom,input:['left','right'].includes(edge)?'mouse':'touch',edge,atExtent:edge})}))),
  {name:'activity read mouse right 1280px 100%',run:()=>verifyEdge(browser,{width:1280,zoom:1,input:'mouse',edge:'right',atExtent:'right',moving:'read'})},
  {name:'pen left 1280px 25%',run:()=>verifyEdge(browser,{width:1280,zoom:.25,input:'pen',edge:'left'})},
  ...[.25,1].map(zoom=>({name:`second finger rollback/pinch ${zoom*100}%`,run:()=>verifySecondFinger(browser,zoom)})),
  {name:'native touch cancel',run:()=>verifyInterruption(browser,'cancel','touch')},
  ...['capture-loss','lock','blur','tab-close'].map(stop=>({name:`stop on ${stop}`,run:()=>verifyInterruption(browser,stop)})),
  ...['mouse','touch'].map(input=>({name:`locked ${input} does not move nodes or edge-hold pan`,run:()=>verifyLocked(browser,input)}))];
 const results=[],deadline=performance.now()+suiteBudgetMs;
 for(const test of cases){if(performance.now()+caseTimeoutMs>deadline)results.push({name:test.name,status:'not-run',error:'Six-minute suite budget exhausted; this case is explicitly unverified and fails the gate.'});else try{results.push({name:test.name,status:'passed',result:await test.run()});}catch(error){results.push({name:test.name,status:'failed',error:error?.stack??String(error)});}console.log('NODE_EDGE_DRAG_CASE '+JSON.stringify(results.at(-1)));}
 const failed=results.filter(r=>r.status!=='passed');console.log('NODE_EDGE_DRAG_CASE_RESULTS '+JSON.stringify({total:results.length,passed:results.length-failed.length,failed:failed.length,results}));
 if(failed.length){const error=new AggregateError(failed.map(r=>Error(r.name+': '+r.error)),`${failed.length}/${results.length} node edge-drag cases failed`);error.results=results;throw error;}
 return {passed:results.length,checks:results,limits:['CDP touch and pen emulate browser input; physical mobile/stylus hardware is not tested.','Blur handler receives an explicit lifecycle event; OS window focus loss is not tested.','Runtime route history is not persisted; cold reload verifies exact world/camera state, not route-cache history.']};
}
