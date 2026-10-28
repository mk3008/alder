import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {JSDOM} from 'jsdom';
import {installTabScroll,revealTab} from '../src/tab-scroll.ts';

const raw=readFileSync('verification/tab-scroll-vscode.check-items.json');assert.equal(createHash('sha256').update(raw).digest('hex'),'854fbc21777197d2913bec4da1c4d0ec7034304e46f89858848f6dc28d11f97a');const authority=JSON.parse(raw);assert.deepEqual(authority.checks.map(c=>c.id),['TAB-SCROLL-001','TAB-SCROLL-002','TAB-SCROLL-003']);for(const c of authority.checks)for(const key of ['condition','guarantee','reason','verification'])assert(c[key]);
const w=new JSDOM('<div id="strip"><button aria-current="true">業務</button><button>概念</button></div>').window,strip=w.document.querySelector('#strip');let width=200,extent=500;Object.defineProperties(strip,{clientWidth:{get:()=>width},scrollWidth:{get:()=>extent}});installTabScroll(strip);
const wheel=opts=>{const event=new w.WheelEvent('wheel',{bubbles:true,cancelable:true,...opts});strip.dispatchEvent(event);return event;};
assert.equal(wheel({deltaY:45}).defaultPrevented,true);assert.equal(strip.scrollLeft,45);assert.equal(w.document.querySelector('[aria-current=true]').textContent,'業務');
assert.equal(wheel({deltaX:30,deltaY:2}).defaultPrevented,true);assert.equal(strip.scrollLeft,75);assert.equal(wheel({deltaY:-2,deltaMode:1}).defaultPrevented,true);assert.equal(strip.scrollLeft,43);
assert.equal(wheel({deltaY:1,deltaMode:2}).defaultPrevented,true);assert.equal(strip.scrollLeft,243);assert.equal(wheel({deltaY:999}).defaultPrevented,true);assert.equal(strip.scrollLeft,300);assert.equal(wheel({deltaY:1}).defaultPrevented,false,'an exhausted boundary does not consume the event');
assert.equal(wheel({deltaY:-80,ctrlKey:true}).defaultPrevented,false,'browser zoom is not intercepted');assert.equal(strip.scrollLeft,300);assert.equal(wheel({deltaY:-999}).defaultPrevented,true);assert.equal(strip.scrollLeft,0);assert.equal(wheel({deltaY:0,deltaX:0}).defaultPrevented,false);
extent=200;assert.equal(wheel({deltaY:10}).defaultPrevented,false);assert.equal(strip.scrollLeft,0);extent=500;
strip.getBoundingClientRect=()=>({left:10,right:210});const tab=strip.querySelectorAll('button')[1];tab.getBoundingClientRect=()=>({left:190,right:260});revealTab(strip,tab);assert.equal(strip.scrollLeft,50);tab.getBoundingClientRect=()=>({left:-20,right:80});revealTab(strip,tab);assert.equal(strip.scrollLeft,20);tab.getBoundingClientRect=()=>({left:30,right:90});revealTab(strip,tab);assert.equal(strip.scrollLeft,20,'already visible tab does not jump');
const css=readFileSync('src/viewer-shell.css','utf8');assert.match(css,/\.shell-open-tabs\{[^}]*scrollbar-width:none/);assert.match(css,/\.shell-open-tabs::-webkit-scrollbar\{display:none\}/);w.close();console.log('TAB-SCROLL-001..003: pixel/line/page wheel, horizontal trackpad, browser zoom, boundaries, active reveal and hidden scrollbar passed');
