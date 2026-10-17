import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {readFileSync} from 'node:fs';
import {installSaveStateControls} from './test-save-state-browser.mjs';
export const body=readFileSync('../business-design/alder/README.md','utf8'),changed=body.replaceAll('業務設計','業務設計改名'),source='https://readonly.test/design.md';
export const code=(await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}})).outputFiles[0].text;
export const pause=(ms=10)=>new Promise(r=>setTimeout(r,ms));
export async function until(fn,label='condition'){for(let n=0;n<500;n++){if(await fn())return;await pause();}assert.fail('Timed out: '+label);}
export async function record(db,key='current'){return new Promise((yes,no)=>{const r=db.open('alder-web-viewer',1);r.onupgradeneeded=()=>r.result.createObjectStore('session');r.onsuccess=()=>{const d=r.result,t=d.transaction('session'),g=t.objectStore('session').get(key);t.oncomplete=()=>{d.close();yes(g.result);};t.onerror=()=>no(t.error);};});}
export async function seed(db,value){return new Promise((yes,no)=>{const r=db.open('alder-web-viewer',1);r.onupgradeneeded=()=>r.result.createObjectStore('session');r.onsuccess=()=>{const d=r.result,t=d.transaction('session','readwrite');t.objectStore('session').put(value,'current');t.oncomplete=()=>{d.close();yes();};t.onerror=()=>no(t.error);};});}
export async function boot({db=new IDBFactory(),fetch=async()=>new Response(body,{headers:{'content-type':'text/plain'}}),value}={}){
 if(value)await seed(db,value);
 const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
 Object.assign(w,{indexedDB:db,structuredClone,TextEncoder,TextDecoder,Response,Headers,ReadableStream,AbortController});w.confirm=()=>true;w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};
 const requests=[],downloads=[];w.fetch=async(...args)=>{requests.push(args);return fetch(...args);};w.URL.createObjectURL=()=> 'blob:legacy';w.URL.revokeObjectURL=()=>{};w.HTMLAnchorElement.prototype.click=function(){downloads.push(this.download);};
 w.eval('('+installSaveStateControls.toString()+')({})');w.eval(code);const $=id=>w.document.getElementById(id);await until(()=>!$('open').disabled);return {w,$,db,requests,downloads,probe:w.__saveStateControl,close(){w.__saveStateControl.dispose();w.close();}};
}
export async function saved(e){e.w.dispatchEvent(new e.w.Event('blur'));await until(()=>e.$('app').dataset.saveState==='saved','saved');return record(e.db);}
export async function open(e,url=source){e.$('open-url').click();e.$('source-url').value=url;await e.$('source-submit').onclick();return saved(e);}
export async function text(e,value=body){e.$('open-text').click();e.$('source-text').value=value;await e.$('source-submit').onclick();return saved(e);}
