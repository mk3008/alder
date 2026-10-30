// Scope visibility uses the current toolbar; mixed legacy states come from storage.
import assert from 'node:assert/strict';
import {openDisplaySettingsDOM} from './toolbar-settings-control.mjs';
import {readFileSync} from 'node:fs';
import {build} from './legacy-viewer-fixture.mjs';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {parseDesign} from '../src/graph.ts';
const raw=readFileSync('web/authorities/ungrouped-alder.md','utf8'),design=parseDesign(raw),outside=design.graph.nodes.filter(n=>!n.scope);
assert.ok(outside.length>1);
const {outputFiles}=await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'},plugins:[{name:'route-counter',setup(b){b.onLoad({filter:/\/routing\.ts$/},a=>({contents:readFileSync(a.path,'utf8').replace('const source=nodes.find','globalThis.__routes=(globalThis.__routes??0)+1; const source=nodes.find'),loader:'ts'}));}}]});
const db=new IDBFactory(),windows=[];
async function boot(){const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);w.indexedDB=db;w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};w.eval(outputFiles[0].text);const d=w.document,$=id=>d.getElementById(id);for(let i=0;i<120&&$('open').disabled;i++)await new Promise(r=>setTimeout(r,25));assert.equal($('open').disabled,false);return{w,d,$};}
async function seedHidden(ids){await new Promise((resolve,reject)=>{const r=db.open('alder-web-viewer',1);r.onerror=()=>reject(r.error);r.onsuccess=()=>{const d=r.result,t=d.transaction('session','readwrite'),s=t.objectStore('session'),q=s.get('current');q.onsuccess=()=>{const value=q.result;assert.equal(value.format,3);value.views[0].hiddenNodes=ids;s.put(value,'current');};t.oncomplete=()=>{d.close();resolve();};t.onerror=()=>reject(t.error);};});}
const state=(e,value)=>{const input=e.$('show-outside');assert.equal(input.getAttribute('aria-checked'),value);assert.equal(input.indeterminate,value==='mixed');assert.equal(input.checked,value==='true');};
const geometry=e=>({nodes:[...e.d.querySelectorAll('.node')].map(n=>[n.dataset.node,n.style.left,n.style.top]),paths:[...e.d.querySelectorAll('.edge')].map(n=>[n.dataset.relation,n.getAttribute('d')]),canvas:e.$('canvas').getAttribute('style'),viewBox:e.$('edges').getAttribute('viewBox'),scroll:[e.$('viewport').scrollLeft,e.$('viewport').scrollTop]});
try{
 let e=await boot();assert.equal(e.$('show-outside').disabled,true);e.$('open-sample').click();state(e,'true');assert.equal(e.$('show-outside').disabled,false);assert.equal(e.d.querySelectorAll('.node-eye').length,0);e.w.__routes=0;
 e.$('viewport').scrollLeft=200;e.$('viewport').scrollTop=100;e.$('viewport').dispatchEvent(new e.w.Event('scroll'));const before=geometry(e);
 for(let i=0;i<3;i++){openDisplaySettingsDOM(e.d);e.$('show-outside').click();state(e,'false');assert.equal(e.d.querySelectorAll('.node.outside').length,0);openDisplaySettingsDOM(e.d);e.$('show-outside').click();state(e,'true');assert.deepEqual(geometry(e),before);}assert.equal(e.w.__routes,0);
 await new Promise(r=>setTimeout(r,300));e.w.close();
 for(const hidden of [[outside[0].id],outside.slice(1).map(n=>n.id)]){
  await seedHidden(hidden);e=await boot();state(e,'mixed');assert.equal(e.d.querySelectorAll('.node.outside').length,outside.length-hidden.length);e.w.__routes=0;openDisplaySettingsDOM(e.d);e.$('show-outside').click();state(e,'true');assert.equal(e.d.querySelectorAll('.node.outside').length,outside.length);assert.equal(e.w.__routes,0,'restored mixed visibility reuses routes');assert.deepEqual(geometry(e),before);await new Promise(r=>setTimeout(r,300));e.w.close();
 }
 e=await boot();e.$('open-text').click();e.$('source-text').value=raw.replace(/(## Scope\s+)false/g,'$1true');await e.$('source-submit').onclick();assert.equal(e.$('show-outside').disabled,true);assert.equal(e.d.querySelectorAll('.node.outside').length,0);
 console.log(JSON.stringify({checks:'toolbar scope true/false/mixed and indeterminate/aria-checked; both historical mixed configurations restore; mixed click shows all; no per-node eye; zero reroutes; restored geometry/camera/extent; no-document/no-outside disabled',outside:outside.length}));
}finally{windows.forEach(w=>w.close());}
