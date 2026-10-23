import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {parseDocument,normalizeDocument} from '../src/json-document.ts';
import {readViewerDocument} from '../src/viewer-document.ts';
import {loadDocumentURL,loadDocumentText,loadDocumentFile} from '../src/document-loader.ts';
const md=readFileSync('web/authorities/business-design.md','utf8'),json=readFileSync('../work/plugin-json/issue-273/snapshots/04-final-after-replay.json','utf8');
const originalFetch=globalThis.fetch;
try{
 for(const [format,source,mime]of [['md',md,'text/markdown'],['json',json,'application/json']]){
  const expected=parseDocument(source),normalized=normalizeDocument(source);
  assert.deepEqual(JSON.parse(JSON.stringify(readViewerDocument(JSON.parse(JSON.stringify(normalized))))),JSON.parse(JSON.stringify(expected)),'typed viewing JSON is serializable');
  assert.ok(!('markdown'in normalized.data)&&!('sections'in normalized.data),'original source is outside the normalized JSON');
  assert.equal(normalized.original.text,source);
  globalThis.fetch=async(_url,options)=>{assert.match(options.headers.Accept,/application\/json/);return new Response(source,{headers:{'content-type':mime}});};
  assert.deepEqual(await loadDocumentURL('https://fixture.test/design.'+format),expected);
  assert.deepEqual(loadDocumentText(source),expected);
  assert.deepEqual(await loadDocumentFile({name:'design.'+format,type:mime,size:Buffer.byteLength(source),text:async()=>source}),expected);
 }
 const invalid=normalizeDocument(md);invalid.data.graph.relations[0].to='missing';assert.throws(()=>readViewerDocument(invalid),/endpoint/);
 await assert.rejects(()=>loadDocumentFile({name:'wrong.json',type:'application/json',size:md.length,text:async()=>md}),/JSON/);
}finally{globalThis.fetch=originalFetch;}

// The baseline builds the actual old main, rather than simulating a wrong helper.
const baseline=process.argv.includes('--baseline');
const main=baseline?execFileSync('git',['show','1b82b23ff4fa8537a0b80562d9be88ca37ae0c2d:web-viewer/src/main.ts'],{encoding:'utf8'}):null;
const bundle=await build({...main?{stdin:{contents:main,resolveDir:process.cwd()+'/src',loader:'ts'}}:{entryPoints:['src/main.ts']},bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}});
for(const [format,source,mime]of [['md',md,'text/markdown'],['json',json,'application/json']]){
 const w=new JSDOM('<div id="app"></div>',{url:'https://loader.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
 w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;w.AbortController=AbortController;w.HTMLElement.prototype.scrollIntoView=()=>{};
 const requests=[];let response=source;
 w.fetch=async(url,opts)=>{requests.push({url,opts});return new Response(response,{headers:{'content-type':mime}});};
 const $=id=>w.document.getElementById(id),wait=async(fn,label)=>{for(let i=0;i<150&&!fn();i++)await new Promise(r=>setTimeout(r,10));assert.ok(fn(),label);};
 try{
  w.eval(bundle.outputFiles[0].text);await wait(()=>!$('open-url').disabled,'ready');
  $('open-url').click();$('source-url').value='https://fixture.test/design.'+format;await $('source-submit').onclick();
  await wait(()=>$('source-dialog').hidden,'new URL opens');
  const expected=w.document.querySelectorAll('.node').length;assert.ok(expected>0);
  assert.ok($('url-history').textContent.includes('design.'+format));
  $('open-text').click();$('source-text').value=md;await $('source-submit').onclick();await wait(()=>$('source-dialog').hidden,'other document opens');
  const before=requests.length;$('url-history').querySelector('button').click();
  await wait(()=>!$('open-url').disabled&&requests.length>before,'history request completes');
  assert.equal(w.document.querySelectorAll('.node').length,expected,'history reloads the same MD/JSON document');
  assert.ok(!$('status-text').textContent.includes('履歴のURLを開けません'),'JSON MIME is accepted on history too');
  assert.equal($('url-history').querySelectorAll('button').length,1,'history is deduplicated');
  response='{broken';$('open-text').click();$('source-text').value=md;await $('source-submit').onclick();await wait(()=>$('source-dialog').hidden,'leave history document');
  const nodes=$('nodes').innerHTML;$('url-history').querySelector('button').click();await wait(()=>$('status-text').textContent.includes('履歴のURLを開けません'),'invalid history reported');assert.equal($('nodes').innerHTML,nodes,'failure retains the previous display');
  assert.ok(requests.every(r=>r.opts.method==='GET'&&r.opts.credentials==='omit'));
 }finally{w.close();}
}
console.log('MD/JSON File, URL, text -> typed viewing JSON -> common model; actual new/history routes; JSON MIME; history deduplication; invalid history keeps display');
