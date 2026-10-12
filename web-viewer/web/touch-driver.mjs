// CDP acknowledgements are not DOM event acknowledgements. Keep this test-only
// driver in lockstep with the real pointer events before checking app state.
import assert from 'node:assert/strict';

export function planTouch(type,points,previous){
 const next=new Map(points.map(([id,x,y])=>[id,{x,y}]));
 assert.equal(next.size,points.length,'physical touch IDs must be unique');
 for(const [id,p] of next){assert.ok(Number.isFinite(id)&&Number.isFinite(p.x)&&Number.isFinite(p.y));}
 const added=[...next.keys()].filter(id=>!previous.has(id));
 const removed=[...previous.keys()].filter(id=>!next.has(id));
 const moved=[...next.keys()].filter(id=>previous.has(id)&&(next.get(id).x!==previous.get(id).x||next.get(id).y!==previous.get(id).y));
 if(type==='touchStart'){assert.ok(added.length>0);assert.equal(removed.length,0);assert.equal(moved.length,0);}
 else if(type==='touchMove'){assert.equal(added.length,0);assert.equal(removed.length,0);}
 else if(type==='touchEnd'){assert.equal(added.length,0);assert.ok(removed.length>0);assert.equal(moved.length,0);}
 else {assert.equal(type,'touchCancel');assert.equal(next.size,0);assert.ok(previous.size>0);}
 return {next,added,removed,moved,skip:type==='touchMove'&&moved.length===0};
}

export function matchTouchStarts(events,added,next){
 assert.equal(events.length,added.length,'each added contact needs exactly one fresh pointerdown');
 const unused=[...events],matched=new Map();
 for(const id of added){
   const p=next.get(id);unused.sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y));
   const event=unused.shift();
   assert.ok(Math.abs(event.x-p.x)<=1&&Math.abs(event.y-p.y)<=1,'pointerdown coordinates must match the requested contact');
   assert.ok(![...matched.values()].includes(event.id),'different contacts need different DOM pointer IDs');
   matched.set(id,event.id);
 }
 return matched;
}

export function touchDriver(page,cdp){
 let physical=new Map();const pointerIDs=new Map();
 const painted=()=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 const install=()=>page.addInitScript(()=>{
   window.touchTrace=[];window.touchObserved={serial:0,active:{},last:{},downs:[]};
   for(const type of ['pointerdown','pointermove','pointerup','pointercancel','gotpointercapture','lostpointercapture'])document.addEventListener(type,e=>{
     if(e.pointerType!=='touch')return;
     const state=window.touchObserved,event={seq:++state.serial,type,id:e.pointerId,target:e.target.id||e.target.className,node:e.target.closest('.node')?.dataset.node??null,region:e.target.closest('#viewport')?'graph':e.target.closest('#detail')?'drawer':null,x:e.clientX,y:e.clientY};
     window.touchTrace.push(event);if(window.touchTrace.length>100)window.touchTrace.shift();
     if(type==='pointerdown'){state.active[e.pointerId]=event;state.downs.push(event);}
     if(type==='pointermove')state.active[e.pointerId]=event;
     if(type==='pointerup'||type==='pointercancel')delete state.active[e.pointerId];
     if(!type.includes('capture'))state.last[e.pointerId]=event;
   },true);
 });
 const send=async(type,points)=>{
   const plan=planTouch(type,points,physical);if(plan.skip)return;
   // New hit testing must see the previously rendered scroll/transform.
   if(type==='touchStart')await painted();
   const serial=await page.evaluate(()=>window.touchObserved.serial);
   await page.evaluate(command=>{window.touchCommand=command;},{type,points,serial});
   await cdp.send('Input.dispatchTouchEvent',{type,touchPoints:points.map(([id,x,y])=>({id,x,y,radiusX:1,radiusY:1,force:1}))});
   if(type==='touchStart'){
     await page.waitForFunction(({serial,count})=>window.touchObserved.downs.filter(e=>e.seq>serial).length===count,{serial,count:plan.added.length});
     const events=await page.evaluate(serial=>window.touchObserved.downs.filter(e=>e.seq>serial),serial);
     for(const [physicalID,pointerID] of matchTouchStarts(events,plan.added,plan.next))pointerIDs.set(physicalID,pointerID);
   }else if(type==='touchMove'){
     const wanted=plan.moved.map(id=>({id:pointerIDs.get(id),...plan.next.get(id)}));
     await page.waitForFunction(({serial,wanted})=>wanted.every(p=>{const e=window.touchObserved.last[p.id];return e&&e.seq>serial&&e.type==='pointermove'&&Math.abs(e.x-p.x)<.01&&Math.abs(e.y-p.y)<.01;}),{serial,wanted});
   }else{
     const wanted=plan.removed.map(id=>pointerIDs.get(id)),expected=type==='touchCancel'?'pointercancel':'pointerup';
     await page.waitForFunction(({serial,wanted,expected})=>wanted.every(id=>{const s=window.touchObserved,e=s.last[id];return e&&e.seq>serial&&e.type===expected&&s.active[id]===undefined;}),{serial,wanted,expected});
     for(const id of plan.removed)pointerIDs.delete(id);
   }
   physical=plan.next;
   assert.equal(await page.evaluate(()=>Object.keys(window.touchObserved.active).length),physical.size,'DOM pointer lifetime must match dispatched touch lifetime');
 };
 const idle=()=>{assert.equal(physical.size,0,'previous gesture must end before starting native scroll');};
 return {install,send,painted,idle};
}
