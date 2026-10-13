// Resource-cleanup unit tests only. No browser, server, or real network requests.
import assert from 'node:assert/strict';
import {syncBuiltinESMExports} from 'node:module';
import net from 'node:net';
import tls from 'node:tls';
import http from 'node:http';
import https from 'node:https';
import dns from 'node:dns';
import dgram from 'node:dgram';
import {fetchMarkdown} from '../src/source.ts';

const originalFetch=globalThis.fetch;
const originalSetTimeout=globalThis.setTimeout;
const originalClearTimeout=globalThis.clearTimeout;
const networkRestores=[];
let networkAttempts=0;
for(const [target,keys] of [[net,['connect','createConnection']],[net.Socket.prototype,['connect']],
  [tls,['connect']],[http,['request','get']],[https,['request','get']],
  [dns,['lookup','resolve']],[dns.promises,['lookup','resolve']],[dgram,['createSocket']]]){
  for(const key of keys){const original=target[key];networkRestores.push(()=>{target[key]=original;});target[key]=()=>{networkAttempts++;throw Error('Real network is disabled for this unit suite');};}
}
syncBuiltinESMExports();

const LIMIT=2*1024*1024;
const URL='https://example.test/document.md'; // Only ever passed to the mock fetch below.
const messages={http:status=>`URL取得に失敗しました（HTTP ${status}）。`,
  mime:'HTML等の表示ページではなくMarkdown本文URLを指定してください。',
  size:'本文は2MiB以内にしてください。',body:'本文を読み取れません。',
  abort:'取得を中止しました。時間を置いて明示的に再試行してください。',
  network:'URLへ接続できません。匿名取得とCORS許可を確認してください。'};
const results=[];
const encoder=new TextEncoder();

async function scenario(name,options={}){
  const observed={fetches:0,abortEvents:0,reads:0,pulls:0,cancels:0,releases:0,getReaders:0,timers:[],cleared:[],listenerAdds:0,listenerRemoves:0};
  const external=new AbortController();
  const add=external.signal.addEventListener.bind(external.signal),remove=external.signal.removeEventListener.bind(external.signal);
  external.signal.addEventListener=(type,...args)=>{if(type==='abort')observed.listenerAdds++;return add(type,...args);};
  external.signal.removeEventListener=(type,...args)=>{if(type==='abort')observed.listenerRemoves++;return remove(type,...args);};
  if(options.preAborted)external.abort();
  let streamController,requestSignal,body;
  const fire=()=>options.timeout?observed.timers[0].callback():external.abort();
  const chunks=options.chunks??[encoder.encode('# A document\n')];
  let chunkIndex=0;
  globalThis.setTimeout=(callback,ms)=>{const timer={callback,ms};observed.timers.push(timer);return timer;};
  globalThis.clearTimeout=timer=>{observed.cleared.push(timer);};
  globalThis.fetch=async(url,fetchOptions)=>{
    observed.fetches++;assert.equal(url,URL);requestSignal=fetchOptions.signal;
    assert.equal(fetchOptions.method,'GET');assert.equal(fetchOptions.mode,'cors');
    assert.equal(fetchOptions.credentials,'omit');assert.equal(fetchOptions.referrerPolicy,'no-referrer');
    assert.equal(fetchOptions.redirect,'error');assert.equal(fetchOptions.headers.Accept,'text/markdown, text/plain;q=0.9');
    requestSignal.addEventListener('abort',()=>{observed.abortEvents++;streamController?.error(new DOMException('Mock fetch aborted','AbortError'));});
    if(options.abortAt==='fetch')fire();
    if(requestSignal.aborted)throw new DOMException('Mock fetch aborted','AbortError');
    if(options.fetchError)throw options.fetchError;
    if(!options.noBody){
      body=new ReadableStream({
        start(controller){streamController=controller;},
        pull(controller){
          observed.pulls++;
          if(options.abortAt==='read'){fire();return;}
          if(options.readError){controller.error(options.readError);return;}
          if(chunkIndex<chunks.length)controller.enqueue(chunks[chunkIndex++]);else controller.close();
        },
        cancel(){observed.cancels++;if(options.cancel==='reject')return Promise.reject(new TypeError('Mock cleanup failure'));
          if(options.cancel==='throw')throw new TypeError('Mock cleanup failure');
          if(options.cancel==='pending')return new Promise(()=>{});}
      },{highWaterMark:0});
      const getReader=body.getReader.bind(body);
      body.getReader=()=>{
        observed.getReaders++;const reader=getReader();
        const read=reader.read.bind(reader),release=reader.releaseLock.bind(reader);
        reader.read=()=>{observed.reads++;return read();};
        reader.releaseLock=()=>{observed.releases++;return release();};
        return reader;
      };
    }
    const headers={'content-type':options.type??'text/markdown'};
    if(options.length!==undefined)headers['content-length']=String(options.length);
    return new Response(body??null,{status:options.status??200,headers});
  };
  let text,error;
  // A test-only deadline catches a stuck cleanup Promise; production's 30s timer is modeled.
  let watchdog;
  try{
    await Promise.race([
      fetchMarkdown(URL,external.signal).then(value=>{text=value;},reason=>{error=reason;}),
      new Promise((_,reject)=>{watchdog=originalSetTimeout(()=>reject(Error('Unit scenario did not settle')),1000);})
    ]);
    await new Promise(resolve=>setImmediate(resolve));
    if(options.error){assert.equal(error?.message,options.error);assert.equal(text,undefined);}
    else{assert.equal(error,undefined);assert.equal(text,options.text??'# A document\n');}
    assert.equal(observed.fetches,1);
    assert.equal(requestSignal.aborted,Boolean(options.error));
    assert.equal(observed.abortEvents,options.preAborted?0:options.error?1:0);
    assert.equal(observed.timers.length,1);assert.equal(observed.timers[0].ms,30000);
    assert.deepEqual(observed.cleared,observed.timers);
    assert.equal(observed.listenerAdds,1);assert.equal(observed.listenerRemoves,1);
    assert.equal(body?.locked??false,false);
    assert.equal(observed.releases,observed.getReaders);
    if(options.early){assert.equal(observed.getReaders,0);assert.equal(observed.reads,0);assert.equal(observed.pulls,0);}
    if(options.cancel)assert.equal(observed.cancels,1);
    if(options.expectedReads!==undefined)assert.equal(observed.reads,options.expectedReads);
    // Removal matters: aborting the caller after successful completion must not abort the completed request.
    if(!options.error){external.abort();assert.equal(requestSignal.aborted,false);assert.equal(observed.cancels,0);}
    const row={name,status:'passed',...observed,timers:observed.timers.map(x=>x.ms),cleared:observed.cleared.length};
    results.push(row);console.log(`PASS ${name}`);
  }finally{
    originalClearTimeout(watchdog);
    globalThis.fetch=originalFetch;globalThis.setTimeout=originalSetTimeout;globalThis.clearTimeout=originalClearTimeout;
  }
}

try{
  for(const status of [404,503])await scenario(`HTTP ${status} aborts unread response`,{status,error:messages.http(status),early:true});
  for(const type of ['text/html','application/json','application/xml'])await scenario(`${type} aborts unread response`,{type,error:messages.mime,early:true});
  await scenario('large Content-Length aborts unread response',{length:LIMIT+1,error:messages.size,early:true});
  await scenario('missing body aborts request',{noBody:true,error:messages.body,early:true});
  await scenario('successful Markdown preserves result and completed request');
  await scenario('empty body remains accepted',{chunks:[],text:''});
  const unicode=encoder.encode('# あいう\n');
  await scenario('split UTF-8 remains intact',{chunks:[unicode.slice(0,3),unicode.slice(3,4),unicode.slice(4)],text:'# あいう\n'});
  await scenario('exact 2MiB remains accepted',{chunks:[encoder.encode('a'.repeat(LIMIT))],length:LIMIT,text:'a'.repeat(LIMIT)});
  for(const cancel of ['resolve','reject','throw','pending'])await scenario(`stream limit survives ${cancel} cleanup`,{
    chunks:[encoder.encode('a'.repeat(LIMIT)),encoder.encode('b'),encoder.encode('not read')],
    error:messages.size,cancel,expectedReads:2
  });
  await scenario('TypeError still receives connection message',{fetchError:new TypeError('Mock fetch failed'),error:messages.network,early:true});
  await scenario('ordinary fetch error preserves original message',{fetchError:new Error('Mock service unavailable'),error:'Mock service unavailable',early:true});
  await scenario('ordinary read error preserves original message and releases lock',{readError:new Error('Mock read failed'),error:'Mock read failed',expectedReads:1});
  await scenario('read TypeError preserves connection message',{readError:new TypeError('Mock read failed'),error:messages.network,expectedReads:1});
  await scenario('pre-aborted caller retains cancellation message',{preAborted:true,error:messages.abort,early:true});
  await scenario('caller abort during fetch retains cancellation message',{abortAt:'fetch',error:messages.abort,early:true});
  await scenario('caller abort during reading retains cancellation message',{abortAt:'read',error:messages.abort,expectedReads:1});
  await scenario('30-second fetch timeout retains cancellation message',{abortAt:'fetch',timeout:true,error:messages.abort,early:true});
  await scenario('30-second read timeout retains cancellation message',{abortAt:'read',timeout:true,error:messages.abort,expectedReads:1});
  assert.equal(networkAttempts,0);
  console.log(JSON.stringify({model:'Node native Response/ReadableStream with mock fetch and virtual timeout; no browser or real network',passed:results.length,failed:0,networkAttempts,results},null,2));
}finally{
  globalThis.fetch=originalFetch;globalThis.setTimeout=originalSetTimeout;globalThis.clearTimeout=originalClearTimeout;
  for(const restore of networkRestores)restore();syncBuiltinESMExports();
}
