import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {JSDOM} from 'jsdom';
import {installCtrlWheelZoom} from '../src/graph-camera.ts';

const authority=readFileSync('verification/ctrl-wheel-zoom.check-items.json');
assert.deepEqual(JSON.parse(authority).checks.map(c=>c.id),['CTRL-WHEEL-001','CTRL-WHEEL-002','CTRL-WHEEL-003']);
const w=new JSDOM('<div id="outside"></div><div id="host"><div id="child"></div></div>').window,host=w.document.querySelector('#host');
host.getBoundingClientRect=()=>({left:20,top:30});Object.defineProperty(host,'clientHeight',{value:600});
let camera={zoom:1,scroll:[200,300]},changes=0;
const remove=installCtrlWheelZoom(host,{read:()=>camera,change:next=>{camera=next;changes++;}});
function fire(target,options){const event=new w.WheelEvent('wheel',{bubbles:true,cancelable:true,clientX:120,clientY:130,...options});target.dispatchEvent(event);return event;}
const first=fire(host.querySelector('#child'),{ctrlKey:true,deltaY:-100});assert(first.defaultPrevented);assert.equal(camera.zoom,1.2);assert(Math.abs((camera.scroll[0]+100)/camera.zoom-300)<1e-9);assert(Math.abs((camera.scroll[1]+100)/camera.zoom-400)<1e-9);
const back=fire(host,{ctrlKey:true,deltaY:100});assert(back.defaultPrevented);assert(Math.abs(camera.zoom-1)<1e-9);
for(const options of [{deltaY:100},{ctrlKey:true,shiftKey:true,deltaY:100},{ctrlKey:true,altKey:true,deltaY:100},{ctrlKey:true,metaKey:true,deltaY:100},{ctrlKey:true,deltaX:100},{ctrlKey:true,deltaY:100,cancelable:false}])assert(!fire(host,options).defaultPrevented);
assert(!fire(w.document.querySelector('#outside'),{ctrlKey:true,deltaY:100}).defaultPrevented);
camera={zoom:2.5,scroll:[0,0]};const before=changes;assert(fire(host,{ctrlKey:true,deltaY:-100}).defaultPrevented);assert.equal(camera.zoom,2.5);assert.equal(changes,before);
camera={zoom:.25,scroll:[0,0]};assert(fire(host,{ctrlKey:true,deltaY:100}).defaultPrevented);assert.equal(camera.zoom,.25);
camera={zoom:1,scroll:[0,0]};fire(host,{ctrlKey:true,deltaY:-1,deltaMode:1});assert(camera.zoom>1&&camera.zoom<1.2);camera=undefined;assert(!fire(host,{ctrlKey:true,deltaY:-100}).defaultPrevented);
remove();camera={zoom:1,scroll:[0,0]};assert(!fire(host,{ctrlKey:true,deltaY:-100}).defaultPrevented);w.close();
console.log(JSON.stringify({passed:JSON.parse(authority).checks.map(c=>c.id),authority:createHash('sha256').update(authority).digest('hex'),scope:'shared wheel handler; real browser and integration are separate'}));
