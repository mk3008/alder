import {joinedSession} from './session-test-view.mjs';
const loadSession=async()=>joinedSession(await loadStoredSession());
// Legacy no-Group input regression; the current Group sample is tested separately.
// Real app DOM + fake IndexedDB. Native keyboard/touch/layout is a browser gate.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from './legacy-viewer-fixture.mjs';
import {RotateCcw} from 'lucide';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {parseDesign} from '../src/graph.ts';
import {initialPositions} from '../src/layout.ts';
import {resetLayout} from '../src/layout-reset.ts';
import {loadSession as loadStoredSession,saveSession} from '../src/session.ts';

const markdown=readFileSync('web/authorities/ungrouped-alder.md','utf8'),design=parseDesign(markdown);
const initial=()=>({key:'a',name:'Alder',design,positions:initialPositions(design.graph,design.activityOrder),scroll:[0,0],zoom:1,viewInset:[40,0],source:{kind:'sample'}});
const modified=()=>{const t=initial(),ids=Object.keys(t.positions);const selected=design.graph.nodes.find(n=>n.type==='business'&&n.scope).id;t.positions[selected]=[-600,1200];t.positions[ids[1]]=[2200,3500];return {...t,canvasOrigin:[900,100],viewInset:[100,200],scroll:[650,700],zoom:.5,selected,hiddenNodes:[ids[3]],showExceptions:false,selectedEdgesOnly:true,draft:markdown+'\nUnapplied draft',edited:true};};
const session=tab=>({tabs:[tab,{...modified(),key:'b',name:'Other',source:{kind:'url',url:'https://example.org/design.md'}}],active:tab.key,dark:true,drawer:false,nodeDrawer:true,width:430,preferWrite:true});
const json=x=>JSON.parse(JSON.stringify(x));
const fields=t=>{const {positions,scroll,zoom,viewInset,canvasOrigin,...other}=t;return other;};
const layout=t=>({positions:t.positions,scroll:t.scroll,zoom:t.zoom,viewInset:t.viewInset,canvasOrigin:t.canvasOrigin??[0,0]});
const tick=()=>new Promise(r=>setTimeout(r,10));
async function until(fn){for(let i=0;i<200&&!await fn();i++)await tick();assert.ok(await fn());}
const {outputFiles}=await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'},plugins:[{name:'reset-test-state',setup(b){b.onLoad({filter:/\/src\/(main|session)\.ts$/},args=>{
 let text=readFileSync(args.path,'utf8');
 if(args.path.endsWith('/main.ts'))text+='\nglobalThis.__resetState=()=>structuredClone(snapshotWorkspace(state));globalThis.__resetRevision=()=>revision;globalThis.__resetRecovery=()=>structuredClone(state.recovery);';
 else text=text.replace('export async function saveSession(value:Session|WorkspaceSnapshot):Promise<void>{','export async function saveSession(value:Session|WorkspaceSnapshot):Promise<void>{ if(globalThis.__failSave)throw Error("controlled save failure");');
 return {contents:text,loader:'ts'};
});}}]});
const windows=[];
async function boot({db=new IDBFactory(),seed,width=1280}={}){
 globalThis.indexedDB=db;await loadSession();if(seed)await saveSession(seed);
 const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);
 w.indexedDB=db;w.structuredClone=structuredClone;w.innerWidth=width;
 w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};
 w.eval(outputFiles[0].text);const d=w.document,$=id=>d.getElementById(id),v=$('viewport');
 Object.defineProperties(v,{clientWidth:{value:width},clientHeight:{value:600}});
 v.getBoundingClientRect=()=>({left:0,top:108,right:width,bottom:708,width,height:600});
 await until(()=>!$('open').disabled);
 return {w,d,$,v,db,state:()=>joinedSession(json(w.__resetState()))};
}
async function saved(e){globalThis.indexedDB=e.db;return json(await loadSession());}
async function flush(e){e.w.dispatchEvent(new e.w.Event('blur'));await until(()=>['saved','error','conflict','unchanged'].includes(e.$('app').dataset.saveState));return saved(e);}
const fire=(e,node,type,x,y,id=1)=>{const event=new e.w.Event(type,{bubbles:true,cancelable:true});Object.assign(event,{button:0,pointerId:id,pointerType:'mouse',clientX:x,clientY:y});node.dispatchEvent(event);};
const geometry=e=>[...e.d.querySelectorAll('.edge,.edge-label')].map(n=>[n.dataset.relation,n.getAttribute('d'),n.getAttribute('x'),n.getAttribute('y')]);
const checks=[];
try{
 const t=modified(),before=structuredClone(t),reset=resetLayout(t);
 assert.deepEqual(json(t),json(before));assert.deepEqual(reset.positions,initial().positions);assert.deepEqual(fields(reset),fields(t));assert.equal(reset.design,t.design);assert.equal(resetLayout(reset),reset,'no-op keeps identity');
 assert.deepEqual(layout(reset),layout(initial()));checks.push('pure current-Graph layout reset preserves all non-layout fields and avoids no-op writes');

 const e=await boot({seed:session(modified())});await flush(e);const baseline=e.state(),oldRecovery=json(e.w.__resetRecovery()),oldGeometry=geometry(e),button=e.$('reset-layout');
 assert.equal(button.type,'button');assert.equal(button.textContent,'レイアウトを初期値に戻す');assert.equal(button.closest('#display-options').hidden,true);
 assert.equal(button.parentElement.className,'graph-actions');assert.ok(button.classList.contains('graph-action'));
 assert.equal(button.querySelector('svg').getAttribute('aria-hidden'),'true','decorative reset icon does not change the accessible name');assert.deepEqual([...button.querySelector('svg').children].map(n=>[n.tagName,n.getAttribute('d')]),RotateCcw.map(([tag,attrs])=>[tag,attrs.d]));assert.equal(button.querySelector('span').textContent,'レイアウトを初期値に戻す');
 e.$('display-settings-toggle').click();button.focus();button.click();
 const after=e.state();assert.deepEqual(after.tabs[0].positions,json(initial().positions));assert.deepEqual(layout(after.tabs[0]),json(layout(initial())));
 assert.deepEqual(fields(after.tabs[0]),fields(baseline.tabs[0]));assert.deepEqual(json(e.w.__resetRecovery()),oldRecovery);assert.deepEqual({...after,tabs:[]},{...baseline,tabs:[]});
 assert.equal(e.$('layout-lock').getAttribute('aria-pressed'),'true');assert.equal(e.d.activeElement,button);assert.notDeepEqual(geometry(e),oldGeometry);
 assert.deepEqual([e.v.scrollLeft,e.v.scrollTop],[0,0]);assert.equal(e.$('zoom').textContent,'100%');
 const stable=e.w.__resetRevision();button.click();button.click();assert.equal(e.w.__resetRevision(),stable);
 const stored=await flush(e);assert.deepEqual(stored,after);
 const reloaded=await boot({db:e.db});assert.deepEqual(reloaded.state(),after);reloaded.w.close();
 assert.deepEqual(json(e.w.__resetRecovery()),oldRecovery,'legacy documents remain immutable through reset');
 checks.push('active tab only; draft/source/filters/selection/theme/drawers/lock unchanged; paths/labels update; repeated no-op; tab switch and IDB reload');

 // A pending editor draft is left intact while displayed Graph, not draft, wins.
 e.$('view-markdown').click();const input=e.$('source-text');assert.equal(input.readOnly,true);
 e.$('in').click();button.click();assert.equal(input.value,markdown);assert.equal(e.$('source-dialog').hidden,false);assert.deepEqual(e.state().tabs[0].positions,json(initial().positions));
 checks.push('open editor and unapplied draft retained');e.w.close();

 const changed=parseDesign(markdown.replace('# Activity ', '# Activity Updated ')),edited=modified();edited.design=changed;
 const c=await boot({seed:session(edited)});c.$('reset-layout').click();assert.deepEqual(c.state().tabs[0].positions,json(initialPositions(changed.graph,changed.activityOrder)));c.w.close();
 checks.push('applied document edits use current Graph and activity order');

 const sample=await boot();assert.equal(sample.$('reset-layout').disabled,true);sample.$('open-sample').click();sample.$('layout-lock').click();
 for(let i=0;i<2;i++){const n=sample.d.querySelectorAll('.node')[i];fire(sample,n,'pointerdown',100,200);fire(sample,n,'pointermove',180,260);fire(sample,n,'pointerup',180,260);}
 assert.notDeepEqual(sample.state().tabs[0].positions,json(initial().positions));
 sample.$('reset-layout').click();assert.deepEqual(sample.state().tabs[0].positions,json(initial().positions));assert.equal(sample.$('layout-lock').getAttribute('aria-pressed'),'false');
 await flush(sample);await sample.d.querySelector('.tab .close').onclick();sample.$('open-sample').click();assert.deepEqual(sample.state().tabs[0].positions,json(initial().positions));
 // Reset also cancels an active old-node pointer sequence and its frame.
 const old=sample.d.querySelector('.node');fire(sample,old,'pointerdown',100,200);fire(sample,old,'pointermove',140,230);sample.$('reset-layout').click();
 fire(sample,old,'pointermove',500,500);fire(sample,old,'pointerup',500,500);assert.deepEqual(sample.state().tabs[0].positions,json(initial().positions));sample.w.close();
 checks.push('two real app pointer drags, unlocked reset, sample close/reopen, stale drag cannot overwrite reset');

 const fail=await boot({seed:session(modified())});await flush(fail);const oldStored=await saved(fail);fail.w.__failSave=true;fail.$('reset-layout').click();await flush(fail);
 assert.equal(fail.$('app').dataset.saveState,'error');assert.match(fail.$('status-text').textContent,/引き続き閲覧できます/);assert.deepEqual(await saved(fail),oldStored);assert.deepEqual(fail.state().tabs[0].positions,json(initial().positions));assert.deepEqual(fields(fail.state().tabs[0]),fields(oldStored.tabs[0]));
 fail.w.__failSave=false;await flush(fail);assert.deepEqual((await saved(fail)).tabs[0].positions,json(initial().positions));fail.w.close();
 checks.push('storage failure is visible, reset stays in memory, stored document unchanged, explicit retry persists');

 const conflict=await boot({seed:session(modified())});await flush(conflict);globalThis.indexedDB=conflict.db;const newer=await loadStoredSession();(newer.format>=2?newer.recovery.find(x=>x.key==='b'):newer.tabs[1]).name='Newer other window';await saveSession(newer);
 conflict.$('reset-layout').click();await flush(conflict);assert.equal(conflict.$('app').dataset.saveState,'conflict');assert.equal(conflict.$('reset-layout').disabled,true);assert.deepEqual(json(await loadStoredSession()),json(newer));assert.deepEqual(conflict.state().tabs[0].positions,json(initial().positions));
 const memory=conflict.state();conflict.$('reset-layout').onclick();assert.deepEqual(conflict.state(),memory);assert.equal(conflict.$('save-retry'),null);conflict.w.close();
 checks.push('CAS conflict never overwrites newer storage, retains local document/reset and blocks further reset');
 // Returning cards by hand can leave nonincident cached routes from the trip.
 const raw=JSON.parse(readFileSync('web/authorities/contract-cases.json','utf8')).find(c=>c.name==='test_explicit_exception_kinds').input;
 const routeDesign=parseDesign(raw),routePositions=initialPositions(routeDesign.graph,routeDesign.activityOrder);
 const routes=await boot({seed:{tabs:[{key:'routes',name:'Routes',design:routeDesign,positions:routePositions,scroll:[0,0],zoom:1,viewInset:[40,0]}],active:'routes',dark:false,drawer:false,width:380}});
 const originalRoutes=geometry(routes);routes.$('layout-lock').click();
 const move=(id,dx,dy)=>{const n=[...routes.d.querySelectorAll('.node')].find(n=>n.dataset.node===id);fire(routes,n,'pointerdown',400,300);fire(routes,n,'pointermove',400+dx,300+dy);fire(routes,n,'pointerup',400+dx,300+dy);};
 // Put this nonincident obstacle beyond the old right corridor without
 // covering either endpoint. Returning the endpoint first retains that wider
 // cached corridor until reset explicitly recomputes the whole tab.
 move('person',500,50);move('read',0,10);move('read',0,-10);move('person',-500,-50);
 assert.deepEqual(routes.state().tabs[0].positions,json(routePositions));assert.notDeepEqual(geometry(routes),originalRoutes);
 const routeRevision=routes.w.__resetRevision();routes.$('reset-layout').click();
 assert.deepEqual(geometry(routes),originalRoutes);assert.equal(routes.w.__resetRevision(),routeRevision,'route-only reset adds no saved revision');routes.w.close();
 checks.push('already-initial coordinates still refresh historical routes/labels without a new saved revision');
 console.log(JSON.stringify({model:'JSDOM + fake IndexedDB; native layout/keyboard/tap separate',passed:checks.length,checks},null,2));
}finally{windows.forEach(w=>w.close());delete globalThis.indexedDB;}
