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
 header.scrollIntoView=options=>{assert.equal($('source-close-dialog'),null,'editing confirmation removed');assert.equal($('source-dialog').hidden,true,'editor must be hidden');reveals.push(options);$('app').scrollTop=0;};
 const frame=()=>{const work=[...frames.values()];frames.clear();for(const f of work)f(0);};
 const open=()=>{$('view-markdown').focus();$('view-markdown').click();};
 const newline=()=>{assert.equal($('source-text').readOnly,true);assert.equal($('source-submit').hidden,true);};
 async function close(accept=true){const promise=$('source-cancel').onclick(new w.MouseEvent('click'));if($('source-close-dialog')?.open){frame();assert.equal(reveals.length,0,'no reveal while confirmation is open');await $(accept?'source-close-confirm':'source-close-continue').onclick();}await promise;await pause();}
 return {w,$,vv,frames,frame,reveals,open,newline,close};
}
async function test(name,fn){try{await fn();results.push({name,passed:true});}catch(e){results.push({name,passed:false,error:String(e.stack||e)});}finally{while(windows.length)windows.pop().close();}}
await test('confirmed changed close queues exactly one post-modal reveal; graph/draft/scale preserved',async()=>{
 const e=await env();e.$('out').click();const zoom=e.$('zoom').textContent;
 e.$('viewport').scrollTop=120;e.$('viewport').scrollLeft=90;e.open();const original=e.$('source-text').value;e.newline();await e.close();assert.equal(e.reveals.length,0);assert.equal(e.frames.size,1);e.frame();assert.equal(e.reveals.length,1);assert.deepEqual(structuredClone(e.reveals[0]),{block:'start',inline:'nearest',behavior:'instant'});assert.equal(e.$('zoom').textContent,zoom);assert.equal(e.$('viewport').scrollTop,120);assert.equal(e.$('viewport').scrollLeft,90);assert.equal(e.vv.scale,2);e.frame();e.w.dispatchEvent(new e.w.Event('resize'));e.frame();assert.equal(e.reveals.length,1,'no resize loop');e.open();assert.equal(e.$('source-text').value,original,'readonly source retained');
});
for(const [name,config] of [['ordinary desktop',{top:0}],['partly visible header',{top:63}],['missing visualViewport',{hasViewport:false}],['zero-height visualViewport',{height:0}]])await test(name+' does not scroll',async()=>{const e=await env(config);e.open();e.newline();await e.close();e.frame();assert.equal(e.reveals.length,0);});
await test('fully outside exact boundary reveals once',async()=>{const e=await env({top:64});e.open();await e.close();e.frame();assert.equal(e.reveals.length,1);});
await test('negative header rect from root scroll is detected',async()=>{const e=await env({top:0,headerTop:-108});e.open();await e.close();e.frame();assert.equal(e.reveals.length,1);});
await test('reopen before queued frame suppresses stale correction',async()=>{const e=await env();e.open();await e.close();e.open();e.frame();assert.equal(e.reveals.length,0);assert.equal(e.$('source-dialog').hidden,false);});
await test('URL-input cancel does not expand editor-only scope',async()=>{const e=await env();e.$('open-url').click();await e.close();e.frame();assert.equal(e.reveals.length,0);});
console.log(JSON.stringify({kind:'Synthetic viewport geometry; real unchanged production bundle and fake IndexedDB. No physical Android/pinch/native scrollIntoView behavior claim.',results,passed:results.filter(r=>r.passed).length,failed:results.filter(r=>!r.passed).length},null,2));
if(results.some(r=>!r.passed))process.exitCode=1;
