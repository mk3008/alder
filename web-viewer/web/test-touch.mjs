// Legacy no-Group input regression; the current Group sample is tested separately.
const toggleScope=el=>el.click();
// DOM/IndexedDB model. Browser touch routing is verified separately in Chrome.
import assert from 'node:assert/strict';
import {openDisplaySettingsDOM} from './toolbar-settings-control.mjs';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {build} from './legacy-viewer-fixture.mjs';
import {readFileSync} from 'node:fs';
const compiled=await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}});
const db=new IDBFactory(),checks=[];
async function boot(){
 const dom=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}),w=dom.window,d=w.document,$=id=>d.getElementById(id);
 w.indexedDB=db;w.structuredClone=structuredClone;w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};
 w.eval(compiled.outputFiles[0].text);for(let i=0;i<100&&$('open').disabled;i++)await new Promise(r=>setTimeout(r,10));assert.equal($('open').disabled,false);
 const fire=(type,id,x,y,target=$('viewport'))=>{const e=new w.Event(type,{bubbles:true,cancelable:true});Object.assign(e,{pointerId:id,pointerType:'touch',button:0,clientX:x,clientY:y});target.dispatchEvent(e);return e;};
 return {dom,w,d,$,fire};
}
let {dom,w,d,$,fire}=await boot();$('layout-lock').click();$('open-sample').click();
const positions=()=>Object.fromEntries([...d.querySelectorAll('.node')].map(n=>[n.dataset.node,[n.style.left,n.style.top]]));
let before=positions(),first=d.querySelector('.node'),id=first.dataset.node;
fire('pointerdown',1,100,100,first);fire('pointermove',1,104,110);assert.equal(first.isConnected,true);assert.notDeepEqual(positions(),before);
fire('pointerdown',2,200,100);assert.equal(first.isConnected,true);assert.deepEqual(positions(),before);fire('lostpointercapture',2,200,100,d.querySelector('.node'));fire('pointermove',1,50,100);fire('pointermove',2,250,100);
assert.equal($('zoom').textContent,'207%');
assert.deepEqual(positions(),before);assert.equal(d.querySelector('.selected'),null);
const z=$('zoom').textContent;fire('pointerup',1,50,100);fire('pointermove',2,300,130);fire('pointerup',2,300,130);assert.equal($('zoom').textContent,z);assert.deepEqual(positions(),before);checks.push('second finger rolls back tentative drag; child implicit-capture loss does not end viewport pinch; release never selects or moves nodes');
$('viewport').scrollLeft=300;$('viewport').scrollTop=200;
const initialZoom=parseFloat(d.querySelector('#nodes').style.transform.match(/[\d.]+/)[0]);
fire('pointerdown',10,100,100);fire('pointerdown',11,300,100);fire('pointermove',10,125,120);fire('pointermove',11,275,120);
const exact=initialZoom*.75;assert.ok(Math.abs(parseFloat($('nodes').style.transform.match(/[\d.]+/)[0])-exact)<1e-8);
assert.ok(Math.abs($('viewport').scrollLeft-175)<1e-8);assert.ok(Math.abs($('viewport').scrollTop-105)<1e-8);
fire('pointerup',10,125,120);fire('pointerup',11,275,120);checks.push('two-finger midpoint anchors both scroll axes and supports translated midpoint');
for(const [end,expected] of [[2000,'250%'],[1,'25%']]){fire('pointerdown',1,100,100);fire('pointerdown',2,200,100);fire('pointermove',2,100+end,100);assert.equal($('zoom').textContent,expected);fire('pointercancel',1,100,100);fire('pointermove',2,800,100);assert.equal($('zoom').textContent,expected);fire('pointerup',2,800,100);}
checks.push('25–250% clamp, cancel and repeated gestures');
fire('pointerdown',1,100,100);fire('pointerdown',2,200,100);fire('pointerdown',3,300,100);fire('pointermove',2,500,100);assert.equal($('zoom').textContent,'25%');for(const i of [1,2,3])fire('pointerup',i,100*i,100);
fire('pointerdown',1,100,100);fire('lostpointercapture',1,100,100);fire('pointerdown',2,100,100);fire('pointerdown',3,200,100);fire('pointermove',3,300,100);assert.equal($('zoom').textContent,'50%');fire('pointerup',2,100,100);fire('pointerup',3,300,100);checks.push('extra fingers block until all lifted; lost capture recovers');
first=d.querySelector('.node');fire('pointerdown',1,100,100,first);fire('pointerup',1,100,100);assert.equal(d.querySelector('.selected').dataset.node,id);
first=d.querySelector('.node');fire('pointerdown',1,100,100,first);fire('pointermove',1,120,110);fire('pointerup',1,120,110);assert.notDeepEqual(positions(),before);before=positions();
$('viewport').scrollLeft=300;$('viewport').scrollTop=200;fire('pointerdown',1,400,400);fire('pointermove',1,350,380);fire('pointerup',1,350,380);assert.equal($('viewport').scrollLeft,350);assert.equal($('viewport').scrollTop,220);checks.push('one-finger node selection/drag and background pan retained');
toggleScope($('scope-outside'));openDisplaySettingsDOM(d);$('prefer-write').click();const visible=positions();assert.equal(Object.keys(visible).length,12);
fire('pointerdown',1,100,100);fire('pointerdown',2,200,100);fire('pointermove',2,300,100);fire('pointerup',1,100,100);fire('pointerup',2,300,100);assert.equal($('zoom').textContent,'100%');assert.deepEqual(positions(),visible);
fire('pointerdown',1,100,100);fire('pointerdown',2,200,100);$('drawer').click();fire('pointermove',2,400,100);assert.equal($('zoom').textContent,'100%');fire('pointerup',1,100,100);fire('pointerup',2,400,100);
const scroll=[$('viewport').scrollLeft,$('viewport').scrollTop];assert.equal(d.querySelector('.close').hidden,true);w.dispatchEvent(new w.Event('blur'));await new Promise(r=>setTimeout(r,250));await d.querySelector('.close').onclick();assert.equal(d.querySelectorAll('.tab').length,1);dom.window.close();
({dom,w,d,$,fire}=await boot());$('open-sample').click();assert.equal($('zoom').textContent,'100%');assert.deepEqual(positions(),visible);assert.deepEqual([$('viewport').scrollLeft,$('viewport').scrollTop],scroll);assert.equal($('scope-outside').getAttribute('aria-pressed'),'false');assert.equal($('prefer-write').checked,true);toggleScope($('scope-outside'));assert.deepEqual(positions(),before);checks.push('Scope/Write, interrupted toolbar gesture and save→close→reboot→reopen retain full layout');
const css=readFileSync('src/style.css','utf8');assert.ok(css.includes('touch-action:none'));assert.ok(!readFileSync('index.html','utf8').match(/user-scalable\s*=\s*no|maximum-scale/));checks.push('no page-wide browser zoom prohibition');
dom.window.close();console.log(JSON.stringify({model:'synthetic DOM/IndexedDB',checks,passed:checks.length},null,2));
