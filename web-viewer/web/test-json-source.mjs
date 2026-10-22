import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fetchDocumentSource,fetchMarkdown} from '../src/source.ts';
const raw=readFileSync('../work/plugin-json/issue-273/snapshots/04-final-after-replay.json','utf8'),previous=globalThis.fetch,calls=[];
let response=()=>new Response(raw,{headers:{'content-type':'application/json'}});
globalThis.fetch=async(url,options)=>{calls.push({url,options});return response(options);};
try{
 assert.equal(await fetchDocumentSource('https://fixture.test/design.json'),raw);const options=calls[0].options;assert.equal(options.credentials,'omit');assert.equal(options.referrerPolicy,'no-referrer');assert.equal(options.redirect,'error');assert.equal(options.mode,'cors');assert.match(options.headers.Accept,/application\/json/);
 await assert.rejects(()=>fetchMarkdown('https://fixture.test/check.json'),/Markdown/);
 for(const uri of ['http://fixture.test/design','https://user:secret@fixture.test/design','file:///tmp/design.json'])await assert.rejects(()=>fetchDocumentSource(uri),/HTTPS/);
 response=()=>new Response(raw,{headers:{'content-type':'text/plain'}});assert.equal(await fetchDocumentSource('https://fixture.test/plain'),raw);
 response=()=>new Response(raw,{headers:{'content-type':'application/example+json'}});assert.equal(await fetchDocumentSource('https://fixture.test/vendor'),raw);
 response=()=>new Response('# Markdown',{headers:{'content-type':'application/json'}});await assert.rejects(()=>fetchDocumentSource('https://fixture.test/wrong'),/JSON/);
 response=()=>new Response(raw,{headers:{'content-type':'text/html'}});await assert.rejects(()=>fetchDocumentSource('https://fixture.test/html'),/HTML/);
 response=()=>new Response('<!doctype html><html>error</html>',{headers:{'content-type':'text/plain'}});await assert.rejects(()=>fetchDocumentSource('https://fixture.test/sniff'),/HTML/);
 response=()=>new Response('missing',{status:404});await assert.rejects(()=>fetchDocumentSource('https://fixture.test/404'),/HTTP 404/);
 response=()=>new Response(raw,{headers:{'content-type':'application/json','content-length':String(2*1024*1024+1)}});await assert.rejects(()=>fetchDocumentSource('https://fixture.test/length'),/2MiB/);
 let cancelled=false;response=()=>new Response(new ReadableStream({start(c){c.enqueue(new Uint8Array(2*1024*1024));c.enqueue(new Uint8Array(1));},cancel(){cancelled=true;}}),{headers:{'content-type':'text/plain'}});await assert.rejects(()=>fetchDocumentSource('https://fixture.test/stream'),/2MiB/);assert.equal(cancelled,true);
 const controller=new AbortController();response=options=>new Response(new ReadableStream({start(c){options.signal.addEventListener('abort',()=>c.error(new DOMException('aborted','AbortError')),{once:true});queueMicrotask(()=>controller.abort());}}),{headers:{'content-type':'application/json'}});await assert.rejects(()=>fetchDocumentSource('https://fixture.test/delay',controller.signal),/中止/);
 console.log('JSON/MD MIME boundaries, anonymous HTTPS, streamed/header limits and abort cleanup passed');
}finally{globalThis.fetch=previous;}
