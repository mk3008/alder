import {openSourceAction} from './source-menu-browser.mjs';
import {ensureDocumentActions} from './test-tab-strip-browser.mjs';
// Isolated same-origin pages, synthetic input, and native IndexedDB only.
// Importing this module never launches a browser. The parent gate owns the
// browser/server and calls verifySessionConcurrency(browser, {url}). Lifecycle
// events below are dispatched deliberately; OS/process termination is not tested.
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

export const concurrencyTriggers=['blur','pagehide','hidden','debounce','close'];
export const concurrencyMarkdown=label=>`# Synthetic ${label} design\n\n# Object Synthetic ${label} record\n\n## Scope\ntrue\n\n## Icon\nfile-text\n\n## Information\n- Synthetic ${label} data only\n\n# Activity Synthetic ${label} activity\n\n## Scope\ntrue\n\n## Why\nExercise isolated session persistence.\n\n## When\nDuring this synthetic regression.\n\n## Who\nSynthetic operator\n\n## Where\nIsolated test context\n\n## How\n\n### Input\n(none)\n\n### Procedure\n- Create the synthetic record.\n\n### Output\n- Synthetic ${label} record — Synthetic result\n\n## Result\nA synthetic result exists.\n`;
export const concurrencyBodies=Object.fromEntries(['shared','closed','added'].map(label=>[label,concurrencyMarkdown(label)]));
export const changedMarkdown=concurrencyBodies.shared.replace('Exercise isolated session persistence.','Retain B local submitted edit.').replace('Synthetic shared activity','Synthetic edited activity');
export const unsubmittedMarkdown=concurrencyMarkdown('unsubmitted B draft');
export const emptySession=()=>({tabs:[],dark:false,drawer:true,width:380});

// Read both committed keys in one readonly transaction, independently of the
// product module's cached generation. This function also runs in browser pages.
export function readConcurrencyRecord(database='alder-web-viewer',raw=false){
 if(typeof database==='object')({database,raw}=database);
 return new Promise((resolve,reject)=>{
  const request=indexedDB.open(database,1);
  request.onupgradeneeded=()=>request.result.createObjectStore('session');
  request.onerror=()=>reject(request.error);
  request.onsuccess=()=>{
   const db=request.result,tx=db.transaction('session'),store=tx.objectStore('session');
   const current=store.get('current'),generation=store.get('generation');
   tx.oncomplete=()=>{db.close();let value=current.result;if(!raw&&value?.format>=2){const {format,document,views,recovery,...settings}=value;value={...settings,tabs:views.map(v=>({...document,...v}))};}resolve({current:value,generation:generation.result});};
   tx.onerror=tx.onabort=()=>{db.close();reject(tx.error??Error('Read aborted'));};
  };
 });
}
export function seedLegacyRecord({value,database='alder-web-viewer'}){
 return new Promise((resolve,reject)=>{
  const request=indexedDB.open(database,1);
  request.onupgradeneeded=()=>request.result.createObjectStore('session');
  request.onerror=()=>reject(request.error);
  request.onsuccess=()=>{
   const db=request.result,tx=db.transaction('session','readwrite'),store=tx.objectStore('session');
   store.put(value,'current');store.delete('generation');
   tx.oncomplete=()=>{db.close();resolve();};
   tx.onerror=tx.onabort=()=>{db.close();reject(tx.error??Error('Seed aborted'));};
  };
 });
}
// Abort after the product has issued BOTH puts. The real transaction must roll
// both back, and only an oncomplete may advance the module's expected generation.
export function abortNextGenerationPut(){
 const original=IDBObjectStore.prototype.put;
 IDBObjectStore.prototype.put=function(value,key){
  const request=original.call(this,value,key);
  if(this.name==='session'&&key==='generation'){
   IDBObjectStore.prototype.put=original;this.transaction.abort();
  }
  return request;
 };
 return true;
}
export async function concurrencySessionBundle(){
 const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
 return (await build({absWorkingDir:root,entryPoints:['src/session.ts'],bundle:true,write:false,format:'iife',globalName:'concurrencySession'})).outputFiles[0].text;
}
async function until(read,predicate,label,{timeout=7000}={}){
 const end=Date.now()+timeout;let latest;
 do{latest=await read();if(predicate(latest))return latest;await new Promise(resolve=>setTimeout(resolve,20));}while(Date.now()<end);
 assert.fail(label+'; latest='+JSON.stringify(latest));
}
function databaseFor(url){
 const match=new URL(url).pathname.match(/\/preview\/pr-(\d+)\/([A-Za-z0-9][A-Za-z0-9._-]*)\/(?:index\.html)?$/);
 return match?`alder-web-viewer:preview:pr-${match[1]}:${match[2]}`:'alder-web-viewer';
}
async function ready(page){await page.waitForFunction(()=>document.getElementById('open-text')&&!document.getElementById('open-text').disabled);}
async function keys(page){return page.locator('.tab').evaluateAll(tabs=>tabs.map(tab=>tab.dataset.key));}
async function input(page,body){
 await page.evaluate(async body=>{
  document.getElementById('open-text').click();document.getElementById('source-text').value=body;
  await document.getElementById('source-submit').onclick();
  if(!document.getElementById('source-dialog').hidden)throw Error('Synthetic input did not parse');
 },body);
}
async function select(page,key){await page.evaluate(key=>document.querySelector(`.tab[data-key="${key}"] > button`).click(),key);}
async function assertConflict(page){
 await page.waitForFunction(()=>!document.getElementById('status').hidden&&document.getElementById('status-text').textContent.includes('別の画面'));
 const warning=await page.locator('#status-text').textContent();
 assert.match(warning,/保存していません/);assert.match(warning,/コピー/);assert.match(warning,/再読み込み/);
 assert.equal(await page.locator('#status-text').getAttribute('role'),'alert');return warning;
}
async function assertLocalWork(page,expectedKeys){
 assert.deepEqual(await keys(page),expectedKeys,'stale local tabs, including the close target, are retained');
 assert.equal(await page.locator('#source-dialog').isVisible(),true,'unsubmitted editor remains open');
 assert.equal(await page.locator('#source-text').inputValue(),unsubmittedMarkdown,'unsubmitted input is retained exactly');
 assert.equal(await page.locator('.node[data-node="Synthetic shared activity"]').count(),1,'prior Graph remains displayed until Apply commits');await ensureDocumentActions(page);await page.locator('#edit-markdown').click();assert.equal(await page.locator('#source-text').inputValue(),changedMarkdown,'per-tab draft remains exact');await openSourceAction(page,'open-text');assert.equal(await page.locator('#source-text').inputValue(),unsubmittedMarkdown,'new-input draft remains exact');
}
// Observe the first generation read without replacing requests, transactions,
// values, or save behavior. It proves each app really loaded the same version.
function observeInitialGeneration(){
 globalThis.__initialSessionGeneration={done:false};
 const original=IDBObjectStore.prototype.get;
 IDBObjectStore.prototype.get=function(key){
  const request=original.call(this,key);
  if(this.name==='session'&&this.transaction.mode==='readonly'&&key==='generation')request.addEventListener('success',()=>{
   if(!globalThis.__initialSessionGeneration.done)globalThis.__initialSessionGeneration={done:true,value:request.result};
  });
  return request;
 };
}
async function queuedPageCase(browser,url,database){
 const context=await browser.newContext(),external=[],errors=[];
 const origin=new URL(url).origin;
 await context.route('**/*',route=>{
  if(new URL(route.request().url()).origin===origin)return route.continue();
  external.push(route.request().url());return route.abort();
 });
 try{
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
  await page.goto(url);await ready(page);
  await page.evaluate(async body=>{
   document.getElementById('open-text').click();document.getElementById('source-text').value=body;
   await document.getElementById('source-submit').onclick();
   window.dispatchEvent(new Event('blur'));document.getElementById('theme').click();window.dispatchEvent(new Event('blur'));
  },concurrencyBodies.shared);
  await until(()=>page.evaluate(readConcurrencyRecord,database),v=>v.generation===2&&v.current.dark===true&&v.current.tabs.length===1,'queued local saves did not both commit');
  assert.equal(await page.locator('#status').isVisible(),false);
  await page.evaluate(()=>{
   document.getElementById('theme').click();window.dispatchEvent(new Event('pagehide'));
   document.getElementById('theme').click();window.dispatchEvent(new Event('blur'));
  });
  const saved=await until(()=>page.evaluate(readConcurrencyRecord,database),v=>v.generation===4&&v.current.dark===true,'second queued local pair did not both commit');
  assert.equal(saved.current.tabs[0].design.markdown,concurrencyBodies.shared);
  assert.equal(await page.locator('#status').isVisible(),false);assert.deepEqual(external,[]);assert.deepEqual(errors,[]);
  return {name:'same-page queued lifecycle saves use the last committed local generation',generation:4};
 }finally{await context.close();}
}
async function storageCases(browser,url,sessionCode){
 const context=await browser.newContext(),results=[];
 try{
  // These pages contain only the bundled storage module, no app save handlers.
  const fixture=new URL('__session_concurrency_storage__',url).href;
  await context.route(fixture,route=>route.fulfill({contentType:'text/html',body:'<!doctype html><title>Synthetic session concurrency fixture</title>'}));
  const pages=await Promise.all([context.newPage(),context.newPage()]);
  for(const page of pages){await page.goto(fixture);await page.addScriptTag({content:sessionCode});}
  const [a,b]=pages;
  const loaded=await Promise.all(pages.map(page=>page.evaluate(()=>concurrencySession.loadSession())));
  assert.deepEqual(loaded,[undefined,undefined]);
  assert.deepEqual(await a.evaluate(readConcurrencyRecord),{current:undefined,generation:undefined},'read does not initialize storage');
  const proposals=[{...emptySession(),dark:true,width:411},{...emptySession(),dark:false,width:522}];
  const race=await Promise.all(pages.map((page,i)=>page.evaluate(async value=>{
   try{await concurrencySession.saveSession(value);return {ok:true};}catch(error){return {ok:false,name:error?.name??null,message:error?.message??String(error)};}
  },proposals[i])));
  assert.equal(race.filter(r=>r.ok).length,1,'exactly one independent same-generation writer commits');
  assert.equal(race.find(r=>!r.ok).name,'SessionConflictError');
  const winner=race.findIndex(r=>r.ok),loser=1-winner;
  assert.deepEqual(await a.evaluate(readConcurrencyRecord),{current:proposals[winner],generation:1});
  const next={...proposals[winner],width:633};
  await pages[winner].evaluate(value=>concurrencySession.saveSession(value),next);
  for(let retry=0;retry<3;retry++){
   const error=await pages[loser].evaluate(async value=>{try{await concurrencySession.saveSession(value);return null;}catch(error){return error?.name??String(error);}},proposals[loser]);
   assert.equal(error,'SessionConflictError');
   assert.deepEqual(await a.evaluate(readConcurrencyRecord),{current:next,generation:2});
  }
  results.push({name:'native IndexedDB atomic race and repeated stale rejection',race,generation:2});
  await pages[winner].evaluate(abortNextGenerationPut);
  const aborted=await pages[winner].evaluate(async value=>{try{await concurrencySession.saveSession(value);return null;}catch(error){return {name:error?.name??null,message:error?.message??String(error)};}},{...next,width:744});
  assert.ok(aborted,'injected transaction abort rejects the write');
  assert.equal(typeof aborted.name,'string','abort must reject with a named error, not null or undefined');assert.ok(aborted.name);
  assert.equal(typeof aborted.message,'string');assert.ok(aborted.message);
  assert.deepEqual(await a.evaluate(readConcurrencyRecord),{current:next,generation:2},'aborted puts change neither record nor generation');
  const recovered={...next,width:855};await pages[winner].evaluate(value=>concurrencySession.saveSession(value),recovered);
  assert.deepEqual(await a.evaluate(readConcurrencyRecord),{current:recovered,generation:3},'retry after abort uses the unchanged expected generation');
  results.push({name:'native transaction abort rolls back both keys and allows retry',generation:3});
  await pages[loser].reload();await pages[loser].addScriptTag({content:sessionCode});
  assert.deepEqual(await pages[loser].evaluate(()=>concurrencySession.loadSession()),recovered);
  await pages[loser].evaluate(value=>concurrencySession.saveSession(value),{...recovered,width:966});
  assert.equal((await a.evaluate(readConcurrencyRecord)).generation,4);
  results.push({name:'fresh module reload becomes writable',generation:4});
  const legacy={...emptySession(),scopeOutside:'dim',width:277};
  await a.evaluate(seedLegacyRecord,{value:legacy});
  await a.reload();await a.addScriptTag({content:sessionCode});
  assert.deepEqual(await a.evaluate(()=>concurrencySession.loadSession()),legacy);
  assert.deepEqual(await a.evaluate(readConcurrencyRecord),{current:legacy,generation:undefined},'legacy load is read-only');
  await a.evaluate(value=>concurrencySession.saveSession(value),{...legacy,dark:true});
  assert.deepEqual(await a.evaluate(readConcurrencyRecord),{current:{...legacy,dark:true},generation:1});
  results.push({name:'legacy no-generation record is unchanged on load; next save initializes generation',generation:1});
 }finally{await context.close();}
 return results;
}
export async function verifySessionConcurrency(browser,{url='http://127.0.0.1:4173/'}={}){
 const target=new URL(url);assert.ok(['127.0.0.1','localhost','[::1]'].includes(target.hostname),'concurrency tests require an isolated local server');
 const results=await storageCases(browser,url,await concurrencySessionBundle()),database=databaseFor(url);
 results.push(await queuedPageCase(browser,url,database));
 for(const trigger of concurrencyTriggers){
  const context=await browser.newContext({viewport:{width:1280,height:960}}),errors=[],external=[];
  const origin=new URL(url).origin;
  await context.route('**/*',route=>{
   if(new URL(route.request().url()).origin===origin)return route.continue();
   external.push(route.request().url());return route.abort();
  });
  await context.addInitScript(observeInitialGeneration);
  context.on('page',page=>{page.setDefaultTimeout(7000);page.on('pageerror',error=>errors.push(error.message));});
  try{
   const seed=await context.newPage();await seed.goto(url);await ready(seed);
   const combine=(...parts)=>parts[0]+parts.slice(1).map(p=>p.slice(p.indexOf('\n# ',p.indexOf('\n')))).join('');
   const source=combine(concurrencyBodies.shared,concurrencyBodies.closed);
   await input(seed,source);const overall=(await keys(seed))[0];
   await seed.locator('.node[data-activity="Synthetic closed activity"]').evaluate(n=>n.click());const closed=await seed.locator('.tab.active').getAttribute('data-key');
   await select(seed,overall);await seed.locator('.node[data-activity="Synthetic shared activity"]').evaluate(n=>n.click());const shared=await seed.locator('.tab.active').getAttribute('data-key');
   const read=page=>page.evaluate(readConcurrencyRecord,database);
   await until(()=>read(seed),v=>v.current?.tabs.length===3,'seed views did not commit');
   const seedRecord=await seed.evaluate(readConcurrencyRecord,{database,raw:true});
   await seed.close();
   // Re-seed this disposable context from an inert page. A late lifecycle save
   // from the closed seed has expected generation >=1 and cannot overwrite the
   // fresh legacy generation 0. The fixture itself has no app save handlers.
   const seedURL=new URL('__session_concurrency_seed__',url).href;
   await context.route(seedURL,route=>route.fulfill({contentType:'text/html',body:'<!doctype html><title>Synthetic legacy seed</title>'}));
   const writer=await context.newPage();await writer.goto(seedURL);
   await writer.evaluate(seedLegacyRecord,{value:seedRecord.current,database});await writer.close();
   const a=await context.newPage(),b=await context.newPage();
   await a.goto(url);await ready(a);await b.goto(url);await ready(b);
   const initial=await read(a),initialKeys=initial.current.tabs.map(tab=>tab.key);
   assert.equal(initial.generation,undefined,'inert seed starts both app pages at legacy generation 0');
   assert.deepEqual(await keys(a),initialKeys);assert.deepEqual(await keys(b),initialKeys);
   const loadedGenerations=await Promise.all([a,b].map(page=>page.evaluate(()=>globalThis.__initialSessionGeneration)));
   assert.deepEqual(loadedGenerations,[{done:true,value:initial.generation},{done:true,value:initial.generation}],'both independent app pages load the same committed generation');
   const nodeID='Synthetic shared activity',before=initial.current.tabs.find(tab=>tab.key===shared).positions[nodeID];
   // DOM handler calls deliberately avoid changing operating-system focus;
   // actual native IndexedDB and independent page modules remain unmodified.
   await select(a,shared);
   const moved=await a.evaluate(({nodeID})=>{
    if(document.getElementById('layout-lock').getAttribute('aria-pressed')==='true')document.getElementById('layout-lock').click();
    const node=[...document.querySelectorAll('.node')].find(node=>node.dataset.node===nodeID);
    const noop=()=>{};node.setPointerCapture=noop;node.releasePointerCapture=noop;
    (node.querySelector('.node-drag-handle')??node).onpointerdown({button:0,clientX:0,clientY:0,pointerId:1,stopPropagation:noop});
    (node.querySelector('.node-drag-handle')??node).onpointermove({clientX:70,clientY:45,pointerId:1});(node.querySelector('.node-drag-handle')??node).onpointerup({pointerId:1});
    const after=[...document.querySelectorAll('.node')].find(node=>node.dataset.node===nodeID);
    return [parseFloat(after.style.left),parseFloat(after.style.top)];
   },{nodeID});
   assert.deepEqual(moved,[before[0]+70,before[1]+45]);
   const addedSource=combine(concurrencyBodies.shared,concurrencyBodies.closed,concurrencyBodies.added);
   await a.evaluate(async text=>{await document.querySelector('#edit-markdown').onclick();const t=document.querySelector('#source-text');t.value=text;t.dispatchEvent(new Event('input',{bubbles:true}));await document.querySelector('#source-submit').onclick();},addedSource);
   await select(a,overall);await a.locator('.node[data-activity="Synthetic added activity"]').evaluate(n=>n.click());const added=await a.locator('.tab.active').getAttribute('data-key');
   await a.evaluate(async closed=>{document.getElementById('theme').click();await document.querySelector(`.tab[data-key="${closed}"] .close`).onclick();},closed);
   const committedA=await until(()=>read(a),v=>v.current?.tabs.some(t=>t.key===added)&&!v.current.tabs.some(t=>t.key===closed)&&v.current.dark===true,'A did not commit its addition, move and Group close');
   assert.deepEqual(committedA.current.tabs.find(t=>t.key===shared).positions[nodeID],moved);
   assert.equal(committedA.current.tabs.find(t=>t.key===added).design.markdown,addedSource);
   // One browser task prepares per-tab and new-input drafts, then invokes the chosen
   // first stale write. The debounce case lets the normal 180ms timer fire.
   await b.evaluate(async ({shared,closed,changed,draft,trigger})=>{
    document.querySelector(`.tab[data-key="${shared}"] > button`).click();
    await document.getElementById('edit-markdown').onclick();document.getElementById('source-text').value=changed;document.getElementById('source-text').dispatchEvent(new Event('input',{bubbles:true}));
    document.getElementById('open-text').click();document.getElementById('source-text').value=draft;document.getElementById('source-text').dispatchEvent(new Event('input',{bubbles:true}));
    if(trigger==='close')await document.querySelector(`.tab[data-key="${closed}"] .close`).onclick();
    else if(trigger==='hidden'){
     Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));
    }else if(trigger!=='debounce')window.dispatchEvent(new Event(trigger));
   },{shared,closed,changed:changedMarkdown,draft:unsubmittedMarkdown,trigger});
   const warning=await assertConflict(b);await assertLocalWork(b,initialKeys);
   assert.deepEqual(await read(a),committedA,'stale first write cannot replace A snapshot or advance generation');
   for(const retry of concurrencyTriggers){
    await b.evaluate(async ({retry,closed})=>{
     document.getElementById('status-close').click();
     if(retry==='close')await document.querySelector(`.tab[data-key="${closed}"] .close`).onclick();
     else if(retry==='hidden'){Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));}
     else if(retry==='debounce')document.getElementById('theme').click();
     else window.dispatchEvent(new Event(retry));
    },{retry,closed});
    await assertConflict(b);await assertLocalWork(b,initialKeys);assert.deepEqual(await read(a),committedA);
   }
   await b.waitForTimeout(260);assert.deepEqual(await read(a),committedA,'queued timers cannot overwrite the winner');
   // Deliberately discard this stale page only after checking all local work.
   // The separate save-state suite verifies dismissal keeps the user on-page.
   b.once('dialog',async dialog=>{assert.equal(dialog.type(),'beforeunload');await dialog.accept();});
   await b.reload();await ready(b);
   assert.deepEqual(await keys(b),committedA.current.tabs.map(tab=>tab.key),'reload restores the winner including deletion');
   await select(b,shared);
   assert.deepEqual(await b.locator('.node').evaluateAll((nodes,id)=>{
    const n=nodes.find(node=>node.dataset.node===id);return [parseFloat(n.style.left),parseFloat(n.style.top)];
   },nodeID),moved);
   assert.notEqual(await b.locator('#app').getAttribute('data-save-state'),'conflict','conflict clears only in a fresh page');
   await b.evaluate(()=>document.getElementById('theme').click());
   const writable=await until(()=>read(b),v=>v.generation>committedA.generation&&v.current.dark===false,'fresh reload is not writable');
   await b.evaluate(()=>document.getElementById('theme').click());
   const consecutive=await until(()=>read(b),v=>v.generation>writable.generation&&v.current.dark===true,'normal consecutive save failed');
   assert.deepEqual(consecutive.current.tabs.map(t=>t.key),committedA.current.tabs.map(t=>t.key));
   assert.deepEqual(consecutive.current.tabs.find(t=>t.key===shared).positions[nodeID],moved);
   assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
   results.push({name:'same-origin stale app write rejected',trigger,warning,retained:['A added Activity and Group','A exact coordinates','A Group deletion','B local edit','B unsubmitted draft'],reloadWritable:true,consecutiveSaves:true});
  }finally{await context.close();}
 }
 const result={browser:browser.version(),model:'fresh same-origin browser pages and native IndexedDB; synthetic fixtures and dispatched lifecycle/DOM pointer handlers',limitations:'No OS/process-kill durability, native focus transition, background timer throttling, or native pointer geometry claim.',results,passed:results.length};
 console.log('SESSION_CONCURRENCY '+JSON.stringify(result));return result;
}
