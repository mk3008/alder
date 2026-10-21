const $=id=>document.getElementById(id),limit=16*1024*1024;
let current=null,worker=null,cancelWorker=null,abort=null,generation=0,metrics=[],traffic=[],legacy=null,selectedDocId=null;
const log=(type,data)=>{metrics.push({type,...data});$('metrics').textContent=JSON.stringify({userAgent:navigator.userAgent,origin:location.origin,metrics,traffic},null,2);};
const notice=(text,error=false)=>{$('status').textContent=text;$('status').style.color=error?'#b42318':'#14532d';};
function render(){
 const start=performance.now();const first=current.pkg.documents.find(d=>d.id===selectedDocId)??current.pkg.documents[0];selectedDocId=first.id;
 $('document-select').replaceChildren();for(const d of current.pkg.documents){const o=document.createElement('option');o.value=d.id;o.textContent=d.title+' / '+d.kind;o.selected=d.id===first.id;$('document-select').append(o);}
 $('title').textContent=first.title;$('summary').textContent=first.kind==='businessDesign'?`${first.activities.length} Activity / ${first.objects.length} Object / ${first.findings.length} Findings。表示は先頭100件まで。`:`${first.items.length} Check / ${first.guarantees.length} 保証 / ${first.examples.length} 比較表。表示は先頭100件まで。`;
 const list=$('entities');list.replaceChildren();
 const key=$('view-select').value;const entities=first[key]??first.activities??first.items;
 for(const a of entities.slice(0,100)){const row=document.createElement('button');row.textContent=a.name??a.title??a.sourceId??a.id;row.onclick=()=>{$('detail').textContent=JSON.stringify(a,null,2);};list.append(row);}
 $('detail').textContent=JSON.stringify(entities[0],null,2);$('diagnostics').textContent=current.result.diagnostics.join('\n');
 const svg=$('graph');svg.replaceChildren();svg.setAttribute('viewBox','0 0 900 125');
 const ns='http://www.w3.org/2000/svg',nodes=first.kind==='businessDesign'?[...first.objects.slice(0,2),...first.activities.slice(0,3)]:[];
 nodes.forEach((n,i)=>{const x=i*178+4;const box=document.createElementNS(ns,'rect');for(const [k,v]of Object.entries({x,y:16,width:168,height:66,rx:7,fill:i<2?'#dbeafe':'#d1fae5'}))box.setAttribute(k,String(v));const text=document.createElementNS(ns,'text');text.setAttribute('x',String(x+7));text.setAttribute('y','48');text.setAttribute('font-size','11');text.textContent=n.name;svg.append(box,text);});
 // This is a bounded reading view, not the production Viewer layout or its rendering benchmark.
 return performance.now()-start;
}
function beginRead(){generation++;cancelWorker?.();cancelWorker=null;worker?.terminate();worker=null;abort?.abort();abort=null;return generation;}
function cancel(){beginRead();notice('中止しました。最後の表示を保持しています。');log('cancel',{});}
async function processText(text,route,readMs=0,readToken=null){
 if(readToken!==null&&readToken!==generation)return false;
 const token=readToken??beginRead();
 const bytes=new TextEncoder().encode(text).length;demand(bytes<=limit,'PoC byte budget exceeded');
 if($('legacy-limit').checked&&route!=='file')demand(bytes<=2*1024*1024,'現行経路の2MiB条件を再現');
 const start=performance.now();
 return new Promise((resolve,reject)=>{
  const workerURL=URL.createObjectURL(new Blob([WORKER_SOURCE],{type:'text/javascript'}));worker=new Worker(workerURL);
  const active=worker;const timer=setTimeout(()=>{active.terminate();URL.revokeObjectURL(workerURL);if(token===generation)cancelWorker=null;if(token===generation)notice('処理時間上限。最後の表示を保持しています。',true);log('timeout',{route,bytes});reject(Error('Worker time budget'));},5000);
  cancelWorker=()=>{clearTimeout(timer);active.terminate();URL.revokeObjectURL(workerURL);reject(new DOMException('Canceled','AbortError'));};
  active.onmessage=event=>{
   clearTimeout(timer);active.terminate();URL.revokeObjectURL(workerURL);if(token===generation)cancelWorker=null;if(token!==generation){resolve(false);return;}
   if(event.data.error){reject(Error(event.data.error));return;}
   const roundtrip=performance.now()-start;current=event.data;const renderMs=render();requestAnimationFrame(()=>{requestAnimationFrame(()=>{
    const row={route,bytes,readMs,...current.metrics,workerRoundtripMs:roundtrip,renderMs,untilPaintMs:performance.now()-start};
    log('load',row);notice('読込成功。ローカル内容のサーバー送信はありません。');resolve(true);
   });});
  };
  active.onerror=e=>{clearTimeout(timer);active.terminate();URL.revokeObjectURL(workerURL);if(token===generation)cancelWorker=null;reject(Error(e.message));};active.postMessage({token,text});
 });
}
const safely=fn=>async()=>{try{await fn();}catch(e){if(e.name==='AbortError')return;notice(e.message+'。最後の表示を保持しています。',true);log('error',{message:e.message});}};
$('file').onchange=safely(async()=>{const file=$('file').files[0];if(!file)return;const readToken=beginRead();demand(file.size<=limit,'PoC byte budget exceeded before file.text');const start=performance.now(),text=await file.text();await processText(text,'file',performance.now()-start,readToken);$('file').value='';});
$('load-text').onclick=safely(async()=>{await processText($('input').value,'text');});
$('sample').onclick=safely(async()=>{await processText(document.getElementById('sample-data').textContent,'text');});
$('url-load').onclick=safely(async()=>{
 const url=new URL($('url').value);demand(url.protocol==='https:'||url.protocol==='http:'&&['localhost','127.0.0.1'].includes(url.hostname),'HTTPS or loopback HTTP required');demand(!url.username&&!url.password,'URL credentials forbidden');
 const token=beginRead();abort=new AbortController();const controller=abort,timer=setTimeout(()=>controller.abort(),30000),start=performance.now();
 try{
  traffic.push({method:'GET',url:url.href,bodyBytes:0,credentials:'omit'});log('url-request',{});
  const response=await fetch(url,{credentials:'omit',mode:'cors',redirect:'error',signal:controller.signal,headers:{Accept:'application/json'}});
  demand(response.ok,'HTTP '+response.status);demand((response.headers.get('content-type')??'').includes('json')||(response.headers.get('content-type')??'').includes('text/plain'),'Expected JSON/plain Content-Type');
  const cap=$('legacy-limit').checked?2*1024*1024:limit;demand(Number(response.headers.get('content-length'))<=cap,'Response Content-Length limit');
  const reader=response.body.getReader(),chunks=[];let size=0;
  try{while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>cap){await reader.cancel();throw Error('Response streaming byte limit');}chunks.push(value);}}finally{reader.releaseLock();}
  if(token!==generation)return;const blob=new Blob(chunks);await processText(await blob.text(),'url',performance.now()-start,token);
 }finally{clearTimeout(timer);}
});
$('cancel').onclick=cancel;
$('document-select').onchange=()=>{selectedDocId=$('document-select').value;if(current)render();};
$('view-select').onchange=()=>{if(current)render();};
function database(){return new Promise((resolve,reject)=>{const r=indexedDB.open('alder-storage-270-poc-v1',1);r.onupgradeneeded=()=>r.result.createObjectStore('snapshot');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
$('save-db').onclick=safely(async()=>{demand(current,'No current document');const start=performance.now(),text=stringify(current.pkg),serialized=performance.now(),db=await database();try{await new Promise((resolve,reject)=>{const tx=db.transaction('snapshot','readwrite');tx.objectStore('snapshot').put(text,'current');tx.oncomplete=resolve;tx.onerror=tx.onabort=()=>reject(tx.error??Error('IndexedDB abort'));});}finally{db.close();}log('save-db',{bytes:new TextEncoder().encode(text).length,stringifyMs:serialized-start,transactionMs:performance.now()-serialized});notice('ブラウザー内への保存が完了しました。');});
$('restore').onclick=safely(async()=>{const readToken=beginRead(),start=performance.now(),db=await database();let text;try{text=await new Promise((resolve,reject)=>{const tx=db.transaction('snapshot'),r=tx.objectStore('snapshot').get('current');tx.oncomplete=()=>resolve(r.result);tx.onerror=tx.onabort=()=>reject(tx.error);});}finally{db.close();}demand(typeof text==='string','No snapshot');await processText(text,'restore',performance.now()-start,readToken);});
$('download').onclick=safely(async()=>{demand(current,'No current document');const start=performance.now(),text=stringify(current.pkg),blob=new Blob([text],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='alder-270.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);log('download',{bytes:blob.size,prepareMs:performance.now()-start});});
$('legacy-file').onchange=safely(async()=>{const f=$('legacy-file').files[0];if(!f)return;const start=performance.now();const design=baseline.parseDesign(await f.text());legacy=design;$('legacy-result').textContent=`旧MD読込成功: ${design.graph.nodes.length} nodes / Graph v${design.graph.version}`;log('legacy-file',{bytes:f.size,nodes:design.graph.nodes.length,totalMs:performance.now()-start});});
$('checks-file').onchange=safely(async()=>{const f=$('checks-file').files[0];if(!f)return;demand(f.size<=2*1024*1024,'現行Checkの2MiB条件を再現');baseline.parseChecks(await f.text());notice('現行Check parser成功');});
$('failure-tests').onclick=safely(async()=>{
 demand(current,'Load sample first');const before=$('title').textContent,cases=[];
 for(const [name,change]of [['unknownVersion',p=>p.formatVersion='future'],['duplicateID',p=>p.documents[0].objects[1].id=p.documents[0].objects[0].id],['staleCheck',p=>p.documents.find(d=>d.kind==='checkItems').basedOn.revision='stale']]){
  const p=structuredClone(current.pkg);change(p);let rejected=false;try{await processText(stringify(p),'test');}catch{rejected=true;}
  demand(rejected,'Failure test did not reject');demand($('title').textContent===before,'Failure changed display');cases.push({name,rejected,displayPreserved:true});
 }
 log('failure-tests',{cases});notice('未知版・重複ID・Check版不一致を拒否し、最後の表示を保持しました。');
});
$('export-log').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([$('metrics').textContent],{type:'application/json'}));a.download='alder-270-browser-log.json';a.click();};
