import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fetchMarkdown} from '../../../web-viewer/src/source.ts';
import {parseDesign} from '../../../web-viewer/src/graph.ts';
import {parseChecks} from '../../../web-viewer/src/check-items.ts';
const MiB=1024*1024,old=fs.readFileSync(new URL('./inputs/check-source.md',import.meta.url),'utf8');
async function withFetch(response,run){const saved=globalThis.fetch,calls=[];globalThis.fetch=async(url,init)=>{calls.push({url:String(url),method:init.method,body:init.body??null,credentials:init.credentials});return response;};try{await run(calls);}finally{globalThis.fetch=saved;}}
test('production URL reader refuses HTTP before making a request',async()=>withFetch(null,async calls=>{await assert.rejects(fetchMarkdown('http://127.0.0.1/local.md'),/HTTPS/);assert.equal(calls.length,0);}));
test('production URL GET has no upload body and omits credentials',async()=>withFetch(new Response(old,{headers:{'content-type':'text/markdown'}}),async calls=>{assert.equal(await fetchMarkdown('https://example.invalid/source.md'),old);assert.deepEqual(calls,[{url:'https://example.invalid/source.md',method:'GET',body:null,credentials:'omit'}]);}));
test('production URL JSON MIME remains rejected',async()=>withFetch(new Response('{}',{headers:{'content-type':'application/json'}}),async()=>{await assert.rejects(fetchMarkdown('https://example.invalid/a.json'),/Markdown/);}));
test('production URL declared size above 2MiB is rejected',async()=>withFetch(new Response('x',{headers:{'content-type':'text/plain','content-length':String(2*MiB+1)}}),async()=>{await assert.rejects(fetchMarkdown('https://example.invalid/a.md'),/2MiB/);}));
test('production URL counts stream bytes without Content-Length',async()=>{
 const stream=new ReadableStream({start(c){c.enqueue(new Uint8Array(2*MiB));c.enqueue(new Uint8Array(1));c.close();}});
 await withFetch(new Response(stream,{headers:{'content-type':'text/plain'}}),async()=>{await assert.rejects(fetchMarkdown('https://example.invalid/a.md'),/2MiB/);});
});
test('production Check parser has its own 2MiB guard',()=>assert.throws(()=>parseChecks('x'.repeat(2*MiB+1)),/2MiB/));
test('Node WHATWG File.text plus unchanged BD parser accepts over 2MiB without fetch',async()=>{
 const text=old.replace('# Scope\n\n','# Scope\n\n'+'x'.repeat(2*MiB)+'\n\n'),file=new File([text],'large.md');
 await withFetch(null,async calls=>{assert.ok(file.size>2*MiB);const d=parseDesign(await file.text());assert.equal(d.graph.version,1);assert.equal(calls.length,0);});
});
