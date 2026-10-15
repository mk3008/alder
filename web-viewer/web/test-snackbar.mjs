import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {createSnackbar} from '../src/snackbar.ts';
const dom=new JSDOM('<button id="origin">Origin</button><div id="bar" hidden><span id="text"></span><button id="close">Close</button></div><button id="fallback">Fallback</button>',{pretendToBeVisual:true});
const w=dom.window,d=w.document,$=id=>d.getElementById(id);let now=0,next=0;const timers=new Map();const realNow=Date.now;Date.now=()=>now;
w.setTimeout=(fn,ms)=>{const id=++next;timers.set(id,{fn,at:now+ms});return id;};w.clearTimeout=id=>timers.delete(id);
const advance=ms=>{now+=ms;for(const [id,t]of [...timers])if(t.at<=now){timers.delete(id);t.fn();}};
const notify=createSnackbar($('bar'),$('text'),$('close'),$('fallback'));const checks=[];
try{
 $('origin').focus();notify('Updated');assert.equal(d.activeElement,$('origin'));assert.equal($('text').getAttribute('aria-live'),'polite');advance(4999);assert.equal($('bar').hidden,false);advance(1);assert.equal($('bar').hidden,true);checks.push('routine result expires at five seconds without taking focus');
 notify('First');advance(4000);notify('Second');advance(1000);assert.equal($('bar').hidden,false);advance(4000);assert.equal($('bar').hidden,true);checks.push('newest result replaces prior result and cancels stale timer');
 notify('Same');advance(4000);notify('Same');advance(1000);assert.equal($('bar').hidden,true);checks.push('duplicate messages do not reset timer or queue');
 notify('Warning','warning');advance(7000);$('bar').dispatchEvent(new w.Event('pointerenter'));advance(10000);assert.equal($('bar').hidden,false);$('bar').dispatchEvent(new w.Event('pointerleave'));advance(1000);assert.equal($('bar').hidden,true);checks.push('hover pauses warning remaining duration');
 notify('Keyboard');$('close').focus();advance(20000);assert.equal($('bar').hidden,false);$('close').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));assert.equal($('bar').hidden,true);assert.equal(d.activeElement,$('origin'));checks.push('keyboard focus pauses timeout and Escape restores prior focus');
 notify('Storage failed','error','storage');assert.equal($('text').getAttribute('role'),'alert');assert.equal($('text').getAttribute('aria-live'),'assertive');advance(60000);assert.equal($('bar').hidden,false);notify('Updated');assert.equal($('text').textContent,'Storage failed');notify('');assert.equal($('text').textContent,'Storage failed');$('close').click();checks.push('persistent storage error survives routine success and silent open');
 notify('Storage again','error','storage');notify('Input error','error');notify('Updated');assert.equal($('text').textContent,'Storage again');$('close').click();checks.push('different error categories are retained without stacking and operation success does not erase storage failure');
 notify('Invalid input','error');notify('Updated');assert.equal($('text').textContent,'Updated');notify('');assert.equal($('bar').hidden,true);checks.push('successful operation resolves its own stale error without an open-success notice');
 notify('Background');Object.defineProperty(d,'hidden',{configurable:true,value:true});d.dispatchEvent(new w.Event('visibilitychange'));advance(20000);assert.equal($('bar').hidden,false);Object.defineProperty(d,'hidden',{configurable:true,value:false});d.dispatchEvent(new w.Event('visibilitychange'));advance(5000);assert.equal($('bar').hidden,true);checks.push('background tab pauses timeout');
 notify('Removed origin');$('origin').focus();$('close').focus();$('origin').remove();$('close').click();assert.equal(d.activeElement,$('fallback'));checks.push('removed prior focus target falls back safely');
 console.log(JSON.stringify({model:'JSDOM with controlled clock; no real browser',checks,passed:checks.length},null,2));
}finally{Date.now=realNow;w.close();}
