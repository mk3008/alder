// Test the harness's asynchronous acknowledgement contract without a browser.
import assert from 'node:assert/strict';
import {touchDriver,planTouch,matchTouchStarts} from './touch-driver.mjs';
const handlers=new Map(),pending=[],physical=new Map(),ids=new Map();let nextID=40,calls=0;
globalThis.window={};globalThis.requestAnimationFrame=cb=>setImmediate(()=>cb(0));
globalThis.document={addEventListener(type,fn){handlers.set(type,fn);}};
const page={
 addInitScript:async fn=>fn(),evaluate:async(fn,arg)=>fn(arg),
 waitForFunction:async(fn,arg)=>{for(let i=0;i<1000;i++){if(fn(arg))return;await new Promise(r=>setImmediate(r));}throw Error('model wait timed out');}
};
const target={id:'viewport',className:'',closest:()=>null};
const emit=(type,id,p)=>handlers.get(type)({type,pointerType:'touch',pointerId:id,target,clientX:p.x,clientY:p.y});
// Independent wire model of Chromium CreateWebTouchEvents. Deliberately does
// NOT call planTouch: wire end points name RELEASED contacts, not survivors.
const packets=[];
const cdp={send:async(method,{type,touchPoints})=>{
 assert.equal(method,'Input.dispatchTouchEvent');calls++;packets.push({type,touchPoints});
 if(type==='touchCancel')assert.equal(touchPoints.length,0);
 if(type==='touchEnd'||type==='touchCancel'){
   const releases=touchPoints.length?touchPoints.map(p=>p.id):[...physical.keys()];
   for(const id of releases){assert.ok(physical.has(id));const pointer=ids.get(id),point=physical.get(id);pending.push(()=>emit(type==='touchCancel'?'pointercancel':'pointerup',pointer,point));physical.delete(id);ids.delete(id);}
 }else{
   assert.ok(touchPoints.length>0);
   for(const {id,x,y} of touchPoints){
     const old=physical.get(id),point={x,y};
     if(!old){const pointer=nextID++;ids.set(id,pointer);pending.push(()=>emit('pointerdown',pointer,point));}
     else if(type==='touchStart'||old.x!==x||old.y!==y){const pointer=ids.get(id);pending.push(()=>emit('pointermove',pointer,point));}
     physical.set(id,point);
   }
 }
}};
const driver=touchDriver(page,cdp);await driver.install();
async function staged(type,points){
 let settled=false;const task=driver.send(type,points).then(()=>{settled=true;});
 for(let i=0;i<30&&!pending.length;i++)await new Promise(r=>setImmediate(r));assert.ok(pending.length);
 assert.equal(settled,false,'CDP response alone must not complete the input');
 if(pending.length>1){pending.shift()();await new Promise(r=>setImmediate(r));assert.equal(settled,false,'one of two pointer events is insufficient');}
 while(pending.length)pending.shift()();await task;assert.equal(settled,true);
}
await staged('touchStart',[[1,100,100],[2,200,100]]);
// Even matching coordinates from before this command must not satisfy receipt.
emit('pointermove',ids.get(1),{x:80,y:100});emit('pointermove',ids.get(2),{x:220,y:100});
await staged('touchMove',[[1,80,100],[2,220,100]]);
const count=calls;await driver.send('touchMove',[[1,80,100],[2,220,100]]);assert.equal(calls,count,'unchanged coordinates need no event that Chrome may not dispatch');
await staged('touchEnd',[[2,220,100]]);assert.deepEqual(packets.at(-1).touchPoints.map(p=>[p.id,p.x,p.y]),[[1,80,100]],'partial end sends removed ID 1, never surviving ID 2');assert.deepEqual([...physical.keys()],[2]);await staged('touchMove',[[2,230,110]]);await staged('touchEnd',[]);assert.deepEqual(packets.at(-1).touchPoints,[]);driver.idle();
await staged('touchStart',[[1,100,100],[2,200,100]]);await staged('touchCancel',[]);assert.deepEqual(packets.at(-1).touchPoints,[]);driver.idle();
assert.throws(()=>planTouch('touchStart',[[1,1,1],[1,2,2]],new Map()));
assert.throws(()=>planTouch('touchMove',[[1,1,1]],new Map()));
assert.throws(()=>planTouch('touchEnd',[],new Map()));
assert.throws(()=>planTouch('touchStart',[[1,2,2]],new Map([[1,{x:1,y:1}]])));
const contacts=new Map([[1,{x:100,y:100}],[2,{x:200,y:100}]]);
assert.deepEqual([...matchTouchStarts([{id:42,x:200,y:100},{id:41,x:100,y:100}],[1,2],contacts)],[[1,41],[2,42]]);
assert.throws(()=>matchTouchStarts([{id:41,x:150,y:100}],[1],contacts),/coordinates/);
assert.throws(()=>matchTouchStarts([{id:41,x:100,y:100},{id:41,x:200,y:100}],[1,2],contacts),/different DOM/);
// Negative contract fixture: the old survivor-as-End payload releases ID 2.
// Omitting ID 1 from a legacy Move also does not release it.
const raw=async(type,touchPoints)=>{await cdp.send('Input.dispatchTouchEvent',{type,touchPoints});while(pending.length)pending.shift()();};
await raw('touchStart',[{id:1,x:100,y:100},{id:2,x:200,y:100}]);
await raw('touchMove',[{id:2,x:210,y:100}]);assert.deepEqual([...physical.keys()],[1,2]);
await raw('touchEnd',[{id:2,x:210,y:100}]);assert.deepEqual([...physical.keys()],[1]);
await raw('touchEnd',[]);assert.equal(physical.size,0);
console.log(JSON.stringify({model:'controlled DOM-event acknowledgement; no browser',checks:['CDP response does not satisfy input receipt','every changed pointer must arrive','physical IDs mapped to independent DOM pointer IDs','unchanged move is a no-op','partial lift and remaining-finger move','full end/cancel and repeated gesture','invalid duplicate/lifetime packets rejected','start coordinates and distinct DOM IDs verified','matching but stale pointer events are rejected','independent legacy wire model validates released IDs and empty full end/cancel','old survivor-End and omitted-Move assumptions explicitly disproved'],passed:11},null,2));
