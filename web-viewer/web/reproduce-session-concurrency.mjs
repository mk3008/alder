// R2 evidence reproducer: independent JSDOM app instances share fake IndexedDB.
// This is a DOM/storage model, NOT real-browser/process/lifecycle evidence.
// Product source is bundled unchanged. Only synthetic documents are imported;
// all persistence is in a fresh in-memory IDBFactory, with network disabled.
//
// Run from web-viewer:
//   node web/reproduce-session-concurrency.mjs
// To isolate evidence from concurrent source edits:
//   node web/reproduce-session-concurrency.mjs --source-root /path/to/pinned/web-viewer
// Optional provenance: --revision <upstream-revision> --expected-main-sha256 <hash>
// Exit 0 means the currently known overwrite was reproduced, NOT fixed.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {dirname,resolve,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'node:util';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';

const {values}=parseArgs({options:{
  'source-root':{type:'string'},revision:{type:'string'},
  'expected-main-sha256':{type:'string'}
}});
const sourceRoot=resolve(values['source-root']??resolve(dirname(fileURLToPath(import.meta.url)),'..'));
const sha256=value=>createHash('sha256').update(value).digest('hex');
const sourceInputs=new Map();
// Read source inputs once as esbuild loads them and record exactly those bytes.
const result=await build({
  absWorkingDir:sourceRoot,entryPoints:['src/main.ts'],bundle:true,write:false,
  format:'iife',loader:{'.css':'empty','.md':'text'},
  plugins:[{name:'record-unchanged-source',setup(builder){
    builder.onLoad({filter:/\.(?:ts|md)(?:\?raw)?$/},args=>{
      if(args.path.includes('/node_modules/'))return;
      const contents=readFileSync(args.path,'utf8');
      sourceInputs.set(relative(sourceRoot,args.path),sha256(contents));
      return {contents,loader:args.path.endsWith('.ts')?'ts':'text',resolveDir:dirname(args.path)};
    });
  }}]
});
const code=result.outputFiles[0].text;
if(values['expected-main-sha256'])assert.equal(sourceInputs.get('src/main.ts'),values['expected-main-sha256'],'source main.ts must match the requested pin');
assert.ok(sourceInputs.has('src/main.ts')&&sourceInputs.has('src/session.ts'));
const windows=[];
const tick=()=>new Promise(resolve=>setTimeout(resolve,20));
async function until(test,label){
  const end=Date.now()+5000;
  while(Date.now()<end){if(await test())return;await tick();}
  assert.fail(label);
}
const plain=value=>JSON.parse(JSON.stringify(value));
const documentBody=label=>`# Synthetic ${label} design\n\n# Object Synthetic ${label} record\n\n## Scope\ntrue\n\n## Icon\nfile-text\n\n## Information\n- Synthetic ${label} data only\n\n# Activity Synthetic ${label} activity\n\n## Scope\ntrue\n\n## Why\nExercise isolated session persistence.\n\n## When\nDuring this model reproduction.\n\n## Who\nSynthetic operator\n\n## Where\nIsolated memory model\n\n## How\n\n### Input\n(none)\n\n### Procedure\n- Create the synthetic record.\n\n### Output\n- Synthetic ${label} record — Synthetic result\n\n## Result\nA synthetic result exists.\n`;
const bodies=Object.fromEntries(['shared','closed','added'].map(label=>[label,documentBody(label)]));
async function boot(indexedDB){
  const w=new JSDOM('<div id="app"></div>',{
    url:'https://alder-r2-isolated.test/',runScripts:'outside-only',pretendToBeVisual:true
  }).window;
  windows.push(w);
  w.indexedDB=indexedDB;w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;
  w.HTMLElement.prototype.setPointerCapture=()=>{};
  w.HTMLElement.prototype.releasePointerCapture=()=>{};
  let networkCalls=0;
  w.fetch=()=>{networkCalls++;throw new Error('Network is forbidden in this reproduction');};
  w.eval(code);
  const env={w,$:id=>w.document.getElementById(id),networkCalls:()=>networkCalls};
  await until(()=>!env.$('open-text').disabled,'App did not finish IndexedDB restoration');
  return env;
}
const tabs=e=>Array.from(e.w.document.querySelectorAll('.tab'));
const tabKeys=e=>tabs(e).map(tab=>tab.dataset.key);
const coordinates=e=>Object.fromEntries(Array.from(e.w.document.querySelectorAll('.node'),node=>[
  node.dataset.node,[parseFloat(node.style.left),parseFloat(node.style.top)]
]));
async function input(e,body){
  e.$('open-text').click();e.$('source-text').value=body;
  await e.$('source-submit').onclick();
  assert.equal(e.$('source-dialog').hidden,true,'Synthetic document parses successfully');
}
function select(e,key){
  const tab=tabs(e).find(tab=>tab.dataset.key===key);
  assert.ok(tab,'Target document tab exists');tab.querySelector('button').click();
}
function drag(e,id,dx,dy){
  if(e.$('layout-lock').getAttribute('aria-pressed')==='true')e.$('layout-lock').click();
  const node=Array.from(e.w.document.querySelectorAll('.node')).find(node=>node.dataset.node===id);
  assert.ok(node,'Synthetic node is rendered');
  node.onpointerdown({button:0,clientX:0,clientY:0,pointerId:1,stopPropagation(){}});
  node.onpointermove({clientX:dx,clientY:dy,pointerId:1});
  node.onpointerup({pointerId:1});
}
// This inspects committed records; it does not wrap or replace product saves.
async function readSaved(indexedDB){
  return new Promise((resolve,reject)=>{
    const open=indexedDB.open('alder-web-viewer',1);
    open.onerror=()=>reject(open.error);
    open.onsuccess=()=>{
      const database=open.result;
      const transaction=database.transaction('session');
      const request=transaction.objectStore('session').get('current');
      let value;
      request.onsuccess=()=>{value=request.result;};
      transaction.oncomplete=()=>{database.close();resolve(value);};
      transaction.onerror=()=>{database.close();reject(transaction.error);};
    };
  });
}
async function savedWhen(indexedDB,test,label){
  let result;
  await until(async()=>{result=await readSaved(indexedDB);return result&&test(result);},label);
  return result;
}
function describe(snapshot,keys,nodeID){
  return {
    documents:snapshot.tabs.map(tab=>({key:tab.key,label:tab.design.markdown.split('\n')[0]})),
    active:snapshot.active,
    sharedCoordinates:snapshot.tabs.find(tab=>tab.key===keys.shared)?.positions[nodeID],
    addedDocumentPresent:snapshot.tabs.some(tab=>tab.key===keys.added),
    closedDocumentPresent:snapshot.tabs.some(tab=>tab.key===keys.closed),
    dark:snapshot.dark
  };
}
const scenarios=[];
try{
  for(const trigger of ['blur','pagehide','visibilitychange']){
    const db=new IDBFactory();
    const seed=await boot(db);
    await input(seed,bodies.shared);const shared=tabKeys(seed)[0];
    await input(seed,bodies.closed);const closed=tabKeys(seed)[1];
    const initial=await savedWhen(db,value=>value.tabs.length===2,'Seed snapshot was not committed');
    seed.w.close();

    // Two separate globals, application states and save queues. Sharing only
    // the fake storage factory models the same-origin persistent record.
    const a=await boot(db),b=await boot(db);
    assert.notEqual(a.w,b.w);assert.notEqual(a.w.document,b.w.document);
    assert.deepEqual(tabKeys(a),initial.tabs.map(tab=>tab.key));
    assert.deepEqual(tabKeys(b),initial.tabs.map(tab=>tab.key));
    assert.deepEqual(coordinates(a),coordinates(b));
    assert.deepEqual(await readSaved(db),initial,'Restoration alone has not changed the snapshot');

    select(a,shared);
    const nodeID='Synthetic shared activity';
    const before=plain(initial.tabs.find(tab=>tab.key===shared).positions[nodeID]);
    const moved=[before[0]+70,before[1]+45];
    drag(a,nodeID,70,45);
    assert.deepEqual(coordinates(a)[nodeID],moved,'A moves the existing document node');
    await input(a,bodies.added);
    const added=tabKeys(a).find(key=>key!==shared&&key!==closed);
    assert.ok(added,'A opens a new synthetic document');
    a.$('theme').click();
    await tabs(a).find(tab=>tab.dataset.key===closed).querySelector('.close').onclick();
    assert.ok(!tabKeys(a).includes(closed),'A finishes closing an existing tab');
    const committedA=await savedWhen(db,value=>
      value.tabs.length===2&&value.tabs.some(tab=>tab.key===added)&&
      !value.tabs.some(tab=>tab.key===closed)&&value.dark===true&&
      JSON.stringify(value.tabs.find(tab=>tab.key===shared)?.positions[nodeID])===JSON.stringify(moved),
      'A changes did not commit together');
    assert.equal(committedA.tabs.find(tab=>tab.key===added).design.markdown,bodies.added);
    assert.deepEqual(tabKeys(b),initial.tabs.map(tab=>tab.key),'B is still stale without user edits');

    // A fresh observer window proves A was committed and restorable before B saves.
    const observerA=await boot(db);
    assert.deepEqual(tabKeys(observerA),committedA.tabs.map(tab=>tab.key));
    select(observerA,shared);
    assert.deepEqual(coordinates(observerA)[nodeID],moved);
    observerA.w.close(); // Cancels the selection debounce before it can save.

    if(trigger==='visibilitychange'){
      Object.defineProperty(b.w.document,'hidden',{configurable:true,value:true});
      b.w.document.dispatchEvent(new b.w.Event('visibilitychange'));
    }else b.w.dispatchEvent(new b.w.Event(trigger));
    const afterB=await savedWhen(db,value=>
      value.tabs.some(tab=>tab.key===closed)&&!value.tabs.some(tab=>tab.key===added),
      `Stale B ${trigger} did not overwrite the full session`);
    assert.deepEqual(afterB.tabs.map(tab=>tab.key),initial.tabs.map(tab=>tab.key));
    assert.deepEqual(afterB.tabs.find(tab=>tab.key===shared).positions[nodeID],before,'A coordinates have reverted');
    assert.equal(afterB.dark,false,'A global UI change has reverted');
    assert.ok(!afterB.tabs.some(tab=>tab.design.markdown===bodies.added),'A new document body is absent from the session');
    assert.equal(b.$('status-text').textContent,'','B shows no save/conflict warning');
    assert.deepEqual(tabKeys(a),committedA.tabs.map(tab=>tab.key),'A memory still shows its own state despite storage loss');
    const afterReload=await boot(db);
    assert.deepEqual(tabKeys(afterReload),initial.tabs.map(tab=>tab.key),'A new app restores the stale record');
    select(afterReload,shared);
    assert.deepEqual(coordinates(afterReload)[nodeID],before);
    for(const env of [seed,a,b,observerA,afterReload])assert.equal(env.networkCalls(),0);

    const keys={shared,closed,added};
    scenarios.push({
      trigger,
      expectedPreservation:'An untouched stale window must not silently discard A’s committed document, coordinates, close operation or UI state; exact multiwindow policy remains undecided.',
      beforeA:describe(initial,keys,nodeID),
      committedA:describe(committedA,keys,nodeID),
      actualAfterStaleB:describe(afterB,keys,nodeID),
      observations:{newDocumentLost:true,coordinatesReverted:true,closedTabResurrected:true,globalPreferenceReverted:true,conflictWarningShown:false,freshWindowRestoresStaleRecord:true}
    });
    for(const env of [a,b,afterReload])env.w.close();
  }
  console.log(JSON.stringify({
    finding:'R2: stale independent app window silently overwrites committed whole-session state',
    result:'Known defect reproduced; this command succeeds only when the asserted losses occur.',
    model:'Separate JSDOM globals evaluating the unchanged app bundle, one fresh shared fake-indexeddb factory per scenario; native timers and app event handlers; direct modeled pointer calls.',
    limitations:'No real browser/process, native focus lifecycle, background timer throttling, origin enforcement, browser shutdown durability, pointer geometry or user database is exercised. Lifecycle events are explicitly dispatched; hidden is modeled. No real network or external storage.',
    provenance:{reportedUpstreamRevision:values.revision??null,sourceRoot,sourceSha256:Object.fromEntries([...sourceInputs].sort()),bundleSha256:sha256(code)},
    passedScenarios:scenarios.length,scenarios,
    undecidedPolicyOptions:[
      'Reject stale writes with a persisted revision checked and updated atomically in the same readwrite transaction; decide how to retain/export local unsaved work and ask the user to reload or resolve conflicts.',
      'Permit one writable window and make other windows explicitly read-only; decide lock lifetime, failure recovery and user-visible transfer of ownership.',
      'Merge per-document/per-field changes with explicit deletion/tombstone and same-field conflict semantics; tab closure, reopen, ordering, active tab and shared preferences make an unqualified union unsafe.'
    ]
  },null,2));
}finally{windows.forEach(w=>w.close());}
