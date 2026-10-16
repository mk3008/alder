import {isDeepStrictEqual} from 'node:util';
// Node-side polling: await the actual async value before deciding whether to
// continue. Never pass an async predicate to Playwright1.56 waitForFunction.
export async function waitForExactRead(read,expected,{timeoutMs=5000,intervalMs=50,project=value=>value,observe=()=>{}}={}){
 const deadline=performance.now()+timeoutMs;let actual,observed,reads=0;
 const timeout=()=>Object.assign(new Error('Saved state deadline exceeded; last observed='+JSON.stringify(observed)),{actual,observed,reads});
 while(true){const remaining=deadline-performance.now();if(remaining<=0)throw timeout();let timer;
  try{actual=await Promise.race([Promise.resolve().then(read),new Promise((_,reject)=>{timer=setTimeout(()=>reject(timeout()),remaining);})]);reads++;}finally{clearTimeout(timer);}
  observed=project(actual);observe({reads,actual,observed});if(performance.now()>=deadline)throw timeout();
  if(isDeepStrictEqual(observed,expected))return {actual,observed,reads};
  await new Promise(resolve=>setTimeout(resolve,Math.min(intervalMs,Math.max(0,deadline-performance.now()))));
 }
}
// Serialized into the real browser by page.evaluate. Complete transaction,
// missing database/store, request error and abort all have explicit outcomes.
export function readSessionInPage(){return new Promise((resolve,reject)=>{
 const request=indexedDB.open('alder-web-viewer',1);let missing=false;
 request.onupgradeneeded=()=>{missing=true;request.transaction?.abort();};
 request.onerror=()=>reject(missing?Error('Missing viewer database'):request.error);
 request.onsuccess=()=>{const db=request.result;try{if(!db.objectStoreNames.contains('session'))throw Error('Missing session store');const tx=db.transaction('session','readonly'),get=tx.objectStore('session').get('current');let actual;
  get.onsuccess=()=>{actual=get.result;};tx.oncomplete=()=>{db.close();if(actual?.format===2){const {format,document,views,recovery,...rest}=actual;actual={...rest,tabs:views.map(view=>({...document,...view}))};}resolve(actual??null);};tx.onerror=tx.onabort=()=>{db.close();reject(tx.error??Error('Readonly transaction failed'));};
 }catch(error){db.close();reject(error);}};
});}
export function viewerProjection(snapshot,fields){const tab=snapshot?.format===2?{...snapshot.document,...snapshot.views.find(t=>t.key===snapshot.active)}:snapshot?.tabs?.find(t=>t.key===snapshot.active);if(!tab)return null;const projected={};for(const key of fields){if(key==='dark'||key==='preferWrite')projected[key]=snapshot[key];else if(key==='selected')projected[key]=tab.selected??null;else if(key==='hiddenNodes')projected[key]=[...(tab.hiddenNodes??[])].sort();else projected[key]=tab[key];}return projected;}
export async function waitSavedViewer(page,expected,options={}){
 const normalized={...expected,...('hiddenNodes' in expected?{hiddenNodes:[...expected.hiddenNodes].sort()}:{})};
 const result=await waitForExactRead(()=>page.evaluate(readSessionInPage),normalized,{...options,project:snapshot=>viewerProjection(snapshot,Object.keys(normalized))});
 console.log('SAVED_VIEWER_OBSERVED '+JSON.stringify({active:result.actual.active,observed:result.observed,reads:result.reads}));return result.actual;
}
