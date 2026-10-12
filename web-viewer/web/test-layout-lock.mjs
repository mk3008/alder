// DOM/IndexedDB model; no native touch scrolling is claimed by this suite.
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {build} from 'esbuild';
const {outputFiles}=await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}}),db=new IDBFactory(),windows=[];
async function boot(){
 const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);const d=w.document,$=id=>d.getElementById(id);w.indexedDB=db;w.structuredClone=structuredClone;w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};w.eval(outputFiles[0].text);
 for(let i=0;i<120&&$('open').disabled;i++)await new Promise(r=>setTimeout(r,10));assert.equal($('open').disabled,false);
 const fire=(kind,type,id,x,y,target=$('viewport'))=>{const e=new w.Event(type,{bubbles:true,cancelable:true});Object.assign(e,{pointerId:id,pointerType:kind,button:0,clientX:x,clientY:y});target.dispatchEvent(e);};
 return {w,d,$,fire,positions:()=>Object.fromEntries([...d.querySelectorAll('.node')].map(n=>[n.dataset.node,[n.style.left,n.style.top]]))};
}
try{
 const e=await boot(),{d,$,fire,positions}=e;$('open-sample').click();assert.equal($('layout-lock').getAttribute('aria-pressed'),'true');let before=positions();const firstID=d.querySelector('.node').dataset.node;
 for(const kind of ['mouse','pen','touch']){
  const node=d.querySelector('.node');$('viewport').scrollLeft=300;$('viewport').scrollTop=200;fire(kind,'pointerdown',1,200,200,node);fire(kind,'pointermove',1,140,160);fire(kind,'pointerup',1,140,160);assert.deepEqual(positions(),before);assert.deepEqual([$('viewport').scrollLeft,$('viewport').scrollTop],[360,240]);
  fire(kind,'pointerdown',1,100,100,d.querySelector('.node'));fire(kind,'pointerup',1,100,100);assert.equal(d.querySelector('.selected').dataset.node,firstID);assert.ok($('detail').textContent.length>0);
 }
 // Scope-outside remains pan/selectable while dimmed and locked.
 $('dim-outside').click();const outside=d.querySelector('.node.outside'),outsideID=outside.dataset.node;fire('touch','pointerdown',1,100,100,outside);fire('touch','pointerup',1,100,100);assert.equal(d.querySelector('.selected').dataset.node,outsideID);assert.ok(d.querySelector('.selected').classList.contains('scope-dim'));
 // Pinch beginning on a locked node preserves positions, including finger release.
 fire('touch','pointerdown',1,100,100,d.querySelector('.node'));fire('touch','pointerdown',2,200,100);fire('touch','pointermove',2,250,100);assert.equal($('zoom').textContent,'150%');fire('touch','pointerup',1,100,100);fire('touch','pointermove',2,300,130);fire('touch','pointerup',2,300,130);assert.deepEqual(positions(),before);
 // Explicit unlock permits mouse, pen and touch movement; re-lock blocks stale events.
 $('layout-lock').click();assert.equal($('layout-lock').getAttribute('aria-pressed'),'false');
 for(const kind of ['mouse','pen','touch']){const node=d.querySelector('.node.outside');fire(kind,'pointerdown',1,100,100,node);fire(kind,'pointermove',1,130,115,kind==='touch'?$('viewport'):node);fire(kind,'pointerup',1,130,115,kind==='touch'?$('viewport'):node);assert.notDeepEqual(positions(),before);before=positions();}
 const stale=d.querySelector('.node');fire('mouse','pointerdown',1,100,100,stale);$('layout-lock').click();fire('mouse','pointermove',1,200,200,stale);fire('mouse','pointerup',1,200,200,stale);assert.deepEqual(positions(),before);
 // A toggle cancels a live touch, and the remaining finger cannot edit/pan anew.
 $('layout-lock').click();fire('touch','pointerdown',1,100,100,d.querySelector('.node'));$('layout-lock').click();const scroll=[$('viewport').scrollLeft,$('viewport').scrollTop];fire('touch','pointermove',1,50,50);fire('touch','pointerup',1,50,50);assert.deepEqual(positions(),before);assert.deepEqual([$('viewport').scrollLeft,$('viewport').scrollTop],scroll);
 // Reload always locks, even when the user had left adjustment mode on.
 $('layout-lock').click();await d.querySelector('.close').onclick();e.w.close();const restored=await boot();assert.equal(restored.$('layout-lock').getAttribute('aria-pressed'),'true');restored.$('open-sample').click();assert.deepEqual(restored.positions(),before);assert.equal(restored.$('dim-outside').checked,true);
 console.log(JSON.stringify({model:'DOM/IndexedDB',passed:7,checks:['default locked','locked mouse/pen/touch node pan and tap selection','dimmed outside selection','locked-node pinch and finger-release safety','unlocked mouse/pen/touch movement','lock change cancels active/stale input','reload locks and preserves sample coordinates']},null,2));
}finally{windows.forEach(w=>w.close());}
