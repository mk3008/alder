// Synthetic geometry/RAF and fake IndexedDB model, NOT Android pinch evidence.
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
const code=(await build({entryPoints:[process.env.EDITOR_VIEWPORT_ENTRY||'src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}})).outputFiles[0].text;
const windows=[],results=[];
const pause=()=>new Promise(r=>setTimeout(r,5));
async function until(fn){for(let n=0;n<1000;n++){if(fn())return;await pause();}throw Error('state did not settle');}
async function env({top=180,height=420,scale=2,headerTop=0,hasViewport=true}={}){
 const w=new JSDOM('<div id="app"></div>',{url:'https://editor-viewport.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);
 Object.assign(w,{indexedDB:new IDBFactory(),structuredClone,TextEncoder,TextDecoder,Response,Headers,ReadableStream,AbortController});
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};
 w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};
 w.fetch=()=>{throw Error('external fetch forbidden');};
 const frames=new Map();let next=0;w.requestAnimationFrame=fn=>{frames.set(++next,fn);return next;};w.cancelAnimationFrame=id=>frames.delete(id);
 const vv={offsetTop:top,offsetLeft:0,width:490,height,scale};Object.defineProperty(w,'visualViewport',{value:hasViewport?vv:null});
 w.eval(code);const $=id=>w.document.getElementById(id);await until(()=>$('open').disabled===false);
 $('open-sample').click();await until(()=>$('app').dataset.saveState==='saved');
 const header=w.document.querySelector('header'),reveals=[];header.getBoundingClientRect=()=>({top:headerTop,bottom:headerTop+64,height:64});
 header.scrollIntoView=options=>{assert.equal($('source-close-dialog').open,false,'native modal must be closed');assert.equal($('source-dialog').hidden,true,'editor must be hidden');reveals.push(options);$('app').scrollTop=0;};
 const frame=()=>{const work=[...frames.values()];frames.clear();for(const f of work)f(0);};
 const open=()=>{$('edit-markdown').focus();$('edit-markdown').click();};
 const newline=()=>{$('source-text').value+='\n';$('source-text').dispatchEvent(new w.Event('input',{bubbles:true}));};
 async function close(accept=true){const promise=$('source-cancel').onclick(new w.MouseEvent('click'));if($('source-close-dialog').open){frame();assert.equal(reveals.length,0,'no reveal while confirmation is open');await $(accept?'source-close-confirm':'source-close-continue').onclick();}await promise;await pause();}
 return {w,$,vv,frames,frame,reveals,open,newline,close};
}
async function test(name,fn){try{await fn();results.push({name,passed:true});}catch(e){results.push({name,passed:false,error:String(e.stack||e)});}finally{while(windows.length)windows.pop().close();}}
await test('confirmed changed close queues exactly one post-modal reveal; graph/draft/scale preserved',async()=>{
 const e=await env();e.$('out').click();const zoom=e.$('zoom').textContent;
 e.$('viewport').scrollTop=120;e.$('viewport').scrollLeft=90;e.open();const original=e.$('source-text').value;e.newline();await e.close();assert.equal(e.reveals.length,0);assert.equal(e.frames.size,1);e.frame();assert.equal(e.reveals.length,1);assert.deepEqual(structuredClone(e.reveals[0]),{block:'start',inline:'nearest',behavior:'instant'});assert.equal(e.$('zoom').textContent,zoom);assert.equal(e.$('viewport').scrollTop,120);assert.equal(e.$('viewport').scrollLeft,90);assert.equal(e.vv.scale,2);e.frame();e.w.dispatchEvent(new e.w.Event('resize'));e.frame();assert.equal(e.reveals.length,1,'no resize loop');e.open();assert.equal(e.$('source-text').value,original+'\n','unapplied draft retained');
});
for(const [name,config] of [['ordinary desktop',{top:0}],['partly visible header',{top:63}],['missing visualViewport',{hasViewport:false}],['zero-height visualViewport',{height:0}]])await test(name+' does not scroll',async()=>{const e=await env(config);e.open();e.newline();await e.close();e.frame();assert.equal(e.reveals.length,0);});
await test('fully outside exact boundary reveals once',async()=>{const e=await env({top:64});e.open();await e.close();e.frame();assert.equal(e.reveals.length,1);});
await test('negative header rect from root scroll is detected',async()=>{const e=await env({top:0,headerTop:-108});e.open();await e.close();e.frame();assert.equal(e.reveals.length,1);});
await test('continue editing does not reveal or lose draft',async()=>{const e=await env();e.open();e.newline();const text=e.$('source-text').value;await e.close(false);e.frame();assert.equal(e.reveals.length,0);assert.equal(e.$('source-dialog').hidden,false);assert.equal(e.$('source-text').value,text);});
await test('reopen before queued frame suppresses stale correction',async()=>{const e=await env();e.open();await e.close();e.open();e.frame();assert.equal(e.reveals.length,0);assert.equal(e.$('source-dialog').hidden,false);});
await test('URL-input cancel does not expand editor-only scope',async()=>{const e=await env();e.$('open-url').click();await e.close();e.frame();assert.equal(e.reveals.length,0);});
function dialogGeometry(e,{left=400,top=300,width=460,height=180}={}){
 const d=e.$('source-close-dialog');d.getBoundingClientRect=()=>{const x=d.style.left?parseFloat(d.style.left):left,y=d.style.top?parseFloat(d.style.top):top,w=d.style.width?parseFloat(d.style.width):width,h=d.style.maxHeight?Math.min(height,parseFloat(d.style.maxHeight)):height;return {left:x,top:y,right:x+w,bottom:y+h,width:w,height:h};};return d;
}
await test('offscreen confirmation fits once within visual viewport; Continue removes placement without losing draft',async()=>{
 const e=await env({top:400,height:240,scale:2});e.vv.offsetLeft=240;e.vv.width=300;const d=dialogGeometry(e);e.open();e.newline();const text=e.$('source-text').value,pending=e.$('source-cancel').onclick(new e.w.MouseEvent('click'));assert.equal(d.open,true);
 const r=d.getBoundingClientRect();assert.ok(r.left>=248&&r.right<=532&&r.top>=408&&r.bottom<=632);assert.equal(d.style.width,'284px');assert.equal(d.style.maxHeight,'224px');const placed=d.style.cssText;
 e.vv.offsetTop=500;e.w.dispatchEvent(new e.w.Event('resize'));e.frame();assert.equal(d.style.cssText,placed,'no continual pan/resize chasing');
 await e.$('source-close-continue').onclick();await pending;assert.equal(d.style.cssText,'');assert.equal(e.$('source-dialog').hidden,false);assert.equal(e.$('source-text').value,text);assert.equal(e.vv.scale,2);assert.equal(e.reveals.length,0);
});
await test('visible confirmation keeps native layout unchanged',async()=>{
 const e=await env({top:0,height:757,scale:1});e.vv.width=1180;const d=dialogGeometry(e);e.open();e.newline();const p=e.$('source-cancel').onclick(new e.w.MouseEvent('click'));assert.equal(d.style.cssText,'');await e.$('source-close-confirm').onclick();await p;e.frame();assert.equal(e.reveals.length,0);
});
await test('tall confirmation uses internal overflow height without changing scale',async()=>{
 const e=await env({top:400,height:160,scale:3});e.vv.width=200;const d=dialogGeometry(e,{height:420});e.open();e.newline();const p=e.$('source-cancel').onclick(new e.w.MouseEvent('click'));const r=d.getBoundingClientRect();assert.equal(r.height,144);assert.ok(r.top>=408&&r.bottom<=552);await e.$('source-close-confirm').onclick();await p;e.frame();assert.equal(d.style.cssText,'');assert.equal(e.reveals.length,1);assert.equal(e.vv.scale,3);
});
await test('native Escape cancels confirmation and clears temporary placement',async()=>{
 const e=await env({top:500,height:200});const d=dialogGeometry(e);e.open();e.newline();const p=e.$('source-cancel').onclick(new e.w.MouseEvent('click'));assert.notEqual(d.style.cssText,'');const event=new e.w.Event('cancel',{cancelable:true});d.dispatchEvent(event);await p;e.frame();assert.equal(event.defaultPrevented,true);assert.equal(d.open,false);assert.equal(d.style.cssText,'');assert.equal(e.$('source-dialog').hidden,false);assert.equal(e.reveals.length,0);
});
console.log(JSON.stringify({kind:'Synthetic viewport geometry; real unchanged production bundle and fake IndexedDB. No physical Android/pinch/native scrollIntoView behavior claim.',results,passed:results.filter(r=>r.passed).length,failed:results.filter(r=>!r.passed).length},null,2));
if(results.some(r=>!r.passed))process.exitCode=1;
