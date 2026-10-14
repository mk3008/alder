// Real app DOM + fake IndexedDB with explicit viewport/toolbar measurements.
// Native Tab/Enter, text wrapping, clipping, touch hit targets and actual browser
// scroll/ResizeObserver timing remain separate browser gates.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {parseDesign} from '../src/graph.ts';
import {reconcile,saveSession,loadSession} from '../src/session.ts';

const css=readFileSync('src/style.css','utf8'),source=readFileSync('src/main.ts','utf8');
const markdown=readFileSync('../business-design/alder/README.md','utf8'),design=parseDesign(markdown);
const initial=reconcile({key:'toolbar',name:'Alder',source:{kind:'sample'},design,positions:{},scroll:[0,0],zoom:1,viewInset:[40,0]},design);
const count=name=>`globalThis.__calls.${name}++;`;
function replaceOnce(text,before,after){assert.equal(text.split(before).length,2,before+' instrumentation stays attached');return text.replace(before,after);}
const {outputFiles}=await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'},plugins:[{name:'count-presentation-effects',setup(b){
 b.onLoad({filter:/\/src\/(main|routing|session)\.ts$/},args=>{
  let text=readFileSync(args.path,'utf8');
  if(args.path.endsWith('/main.ts')){
   for(const [needle,name] of [['function graph(){','graph'],['function render(){','render'],['function persist(delay=180,changed=true){','persist'],['const drawEdges=()=>{','drawEdges']])text=replaceOnce(text,needle,needle+count(name));
   text+='\nglobalThis.__toolbarState=()=>structuredClone(state);';
  }else if(args.path.endsWith('/routing.ts'))text=replaceOnce(text,'const source=nodes.find',count('routes')+'const source=nodes.find');
  else{
   text=replaceOnce(text,'export function reconcile(tab:Tab,design:Design):Tab{','export function reconcile(tab:Tab,design:Design):Tab{'+count('reconcile'));
   text=replaceOnce(text,'export async function saveSession(value:Session):Promise<void>{','export async function saveSession(value:Session):Promise<void>{'+count('save')+'if(globalThis.__holdNextSave){globalThis.__holdNextSave=false;await new Promise(resolve=>globalThis.__releaseSave=resolve);}if(globalThis.__failNextSave){globalThis.__failNextSave=false;throw Error("controlled storage failure");}');
  }
  return {contents:text,loader:'ts'};
 });
}}]});
const windows=[],checks=[],tick=()=>new Promise(r=>setTimeout(r,10));
const rect=(left,top,width,height)=>({left,top,right:left+width,bottom:top+height,width,height,x:left,y:top,toJSON(){}});
const json=value=>JSON.parse(JSON.stringify(value));
const session=tab=>({tabs:[tab],active:tab.key,dark:false,drawer:false,nodeDrawer:false,width:380,preferWrite:false});
async function until(test){for(let i=0;i<300&&!await test();i++)await tick();assert.ok(await test());}
async function saved(e){globalThis.indexedDB=e.db;return loadSession();}
async function flush(e){e.w.dispatchEvent(new e.w.Event('blur'));await new Promise(r=>setTimeout(r,230));return saved(e);}
async function boot({db=new IDBFactory(),seed,width=1280,height=800}={}){
 globalThis.indexedDB=db;await loadSession();if(seed)await saveSession(seed);
 const w=new JSDOM('<style></style><div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);
 w.innerWidth=width;w.innerHeight=height;w.indexedDB=db;w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;
 w.__calls=Object.fromEntries(['graph','render','persist','drawEdges','routes','reconcile','save'].map(k=>[k,0]));
 w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};
 const observers=[],frames=new Map();let frameID=0;
 w.ResizeObserver=class{constructor(callback){this.callback=callback;this.targets=[];observers.push(this);}observe(target){this.targets.push(target);}};
 w.requestAnimationFrame=callback=>{frames.set(++frameID,callback);return frameID;};w.cancelAnimationFrame=id=>frames.delete(id);
 w.eval(outputFiles[0].text);
 const d=w.document,$=id=>d.getElementById(id),v=$('viewport'),bar=d.querySelector('.toolbar');d.querySelector('style').textContent=css;
 Object.defineProperties(v,{clientWidth:{value:width},clientHeight:{value:height-108}});
 v.getBoundingClientRect=()=>rect(0,108,width,v.clientHeight);
 $('formattedMarkdownDrawer').getBoundingClientRect=()=>rect(width,108,380,v.clientHeight);
 $('node-list-drawer').getBoundingClientRect=()=>rect(-300,108,300,v.clientHeight);
 bar.getBoundingClientRect=()=>{
  if(bar.hidden)return rect(0,0,0,0);
  // Deliberately taller open panel models wrapped labels at narrow widths.
  const open=!$('display-options').hidden,h=open?(width<=480?140:108):42;
  const size=open?Math.min(460,width-24):(width<=480?178:222),gap=width<=800?12:20;
  return rect(width-gap-size,height-gap-h,size,h);
 };
 for(const [property,size,client] of [['scrollLeft','width','clientWidth'],['scrollTop','height','clientHeight']]){
  let value=0;
  const maximum=()=>$('canvas').hidden?0:Math.max(0,(parseFloat($('canvas').style[size])||0)-v[client]);
  Object.defineProperty(v,property,{get:()=>Math.min(value,maximum()),set:x=>{value=Math.max(0,Math.min(x,maximum()));}});
 }
 const focusCalls=[],focus=w.HTMLElement.prototype.focus;w.HTMLElement.prototype.focus=function(options){focusCalls.push({id:this.id,options});return focus.call(this,options);};
 await until(()=>!$('open').disabled);w.dispatchEvent(new w.Event('resize'));
 return {w,d,$,v,bar,db,observers,frames,focusCalls,notifyResize:()=>observers.forEach(o=>o.callback([]))};
}
const extent=e=>[e.$('canvas').style.width,e.$('canvas').style.height];
const scroll=e=>[e.v.scrollLeft,e.v.scrollTop];
const camera=e=>[e.v.scrollLeft-parseFloat(e.$('nodes').style.left),e.v.scrollTop-parseFloat(e.$('nodes').style.top)];
const identities=e=>[...e.d.querySelectorAll('.node,#edges *,#node-list *,#detail *')];
const geometry=e=>[...e.d.querySelectorAll('.node,.edge,.edge-label')].map(n=>[n.tagName,n.className.baseVal??n.className,n.dataset.node??n.dataset.relation,n.style.left,n.style.top,n.getAttribute('d'),n.getAttribute('x'),n.getAttribute('y'),n.textContent]);
const state=e=>json(e.w.__toolbarState());
const calls=e=>({...e.w.__calls});
const toggle=e=>e.$('display-settings-toggle').click();
const escape=(e,target=e.$('display-settings-toggle'))=>{const event=new e.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true});target.dispatchEvent(event);return event;};
const inputIDs=['show-outside','prefer-write','show-exceptions','selected-edges-only'];
function assertOpen(e,open){
 assert.equal(e.$('display-options').hidden,!open);assert.equal(e.bar.dataset.settingsOpen,String(open));
 assert.equal(e.$('display-settings-toggle').getAttribute('aria-expanded'),String(open));
 assert.equal(e.$('display-settings-toggle').getAttribute('aria-label'),open?'表示設定を閉じる':'表示設定を開く');
 assert.equal(e.$('display-settings-toggle').title,open?'表示設定を閉じる':'表示設定を開く');
 assert.equal(e.w.getComputedStyle(e.$('display-options')).display,open?'grid':'none');
}
function stable(e,action){
 const before={state:state(e),geometry:geometry(e),identities:identities(e),scroll:scroll(e),camera:camera(e),calls:calls(e)};
 action();e.notifyResize();e.notifyResize();
 assert.deepEqual(state(e),before.state,'presentation does not alter live settings, selection or geometry');
 assert.deepEqual(geometry(e),before.geometry,'node/path/label coordinates and text stay unchanged');
 assert.deepEqual(identities(e),before.identities,'nodes, edges, list and Markdown retain their DOM identities');
 assert.deepEqual(scroll(e),before.scroll,'modeled scroll is preserved');assert.deepEqual(camera(e),before.camera,'world camera is preserved');
 assert.deepEqual(calls(e),before.calls,'no render, graph, redraw, routing, reconciliation, persistence or storage calls');
}
try{
 const e=await boot();assertOpen(e,false);assert.equal(e.bar.hidden,true);assert.equal(e.$('display-settings-toggle').disabled,true);
 e.$('open-sample').click();await flush(e);assertOpen(e,false);assert.equal(e.bar.hidden,false);
 const gear=e.$('display-settings-toggle'),panel=e.$('display-options');
 assert.equal(gear.tagName,'BUTTON');assert.equal(gear.type,'button');assert.equal(gear.getAttribute('aria-controls'),panel.id);assert.ok(gear.querySelector('svg'));
 assert.equal(e.bar.firstElementChild,gear);assert.equal(gear.nextElementSibling,panel);assert.equal(panel.nextElementSibling,e.$('layout-lock'));
 assert.equal(panel.parentElement,e.bar);assert.equal(e.w.getComputedStyle(panel).order,'-1','panel is visually above controls but follows gear in keyboard DOM order');
 assert.deepEqual(inputIDs.map(id=>e.$(id).checked),[true,false,true,false]);
 for(const id of ['layout-lock','out','zoom','in']){assert.equal(e.$(id).hidden,false);assert.equal(e.$(id).parentElement,e.bar);}
 // JSDOM has no native Tab/Enter traversal. Pin native button + document order,
 // and exercise normal click and focus/Escape handlers without custom key hacks.
 gear.focus();const focusCount=e.focusCalls.length;stable(e,()=>toggle(e));assertOpen(e,true);
 assert.equal(e.d.activeElement,gear);assert.equal(e.focusCalls.length,focusCount,'opening does not autofocus an input');
 const focusable=[...e.bar.querySelectorAll('button,input')].filter(n=>!n.disabled&&n.tabIndex>=0&&!n.closest('[hidden]'));
 assert.deepEqual(focusable.map(n=>n.id),['display-settings-toggle',...inputIDs,'reset-layout','findings-toggle','layout-lock','out','in']);
 e.$('selected-edges-only').focus();stable(e,()=>assert.equal(escape(e,e.$('selected-edges-only')).defaultPrevented,true));assertOpen(e,false);
 assert.equal(e.d.activeElement,gear);assert.deepEqual(json(e.focusCalls.at(-1)),{id:'display-settings-toggle',options:{preventScroll:true}});
 assert.equal(escape(e).defaultPrevented,false,'Escape when already closed is untouched');
 assert.deepEqual([...e.bar.querySelectorAll('button,input')].filter(n=>!n.disabled&&n.tabIndex>=0&&!n.closest('[hidden]')).map(n=>n.id),['display-settings-toggle','layout-lock','out','in']);
 checks.push('initial collapsed/native gear, ordered keyboard reachability contract, no input autofocus, Escape focus return, persistent control row');

 const baseExtent=extent(e);for(let i=0;i<8;i++){stable(e,()=>toggle(e));stable(e,()=>toggle(e));assert.deepEqual(extent(e),baseExtent,'origin toggles do not accumulate canvas extent');}
 assert.ok(e.observers.some(o=>o.targets.includes(e.bar)&&o.targets.includes(e.v)),'ResizeObserver measures the full toolbar');
 // Source-dialog Escape retains its existing priority rather than closing settings.
 toggle(e);e.$('open-text').click();escape(e,e.$('source-text'));assert.equal(e.$('source-dialog').hidden,true);assertOpen(e,true);escape(e);assertOpen(e,false);
 checks.push('repeated toggle/ResizeObserver callbacks keep extent stable; source-dialog Escape remains independent');

 toggle(e);for(const id of inputIDs)e.$(id).click();
 assert.deepEqual(inputIDs.map(id=>e.$(id).checked),[false,true,false,true]);
 const preferenceState=state(e);assert.equal(preferenceState.preferWrite,true);assert.equal(preferenceState.tabs[0].showExceptions,false);assert.equal(preferenceState.tabs[0].selectedEdgesOnly,true);
 assert.deepEqual(preferenceState.tabs[0].hiddenNodes,design.graph.nodes.filter(n=>!n.scope).map(n=>n.id));
 stable(e,()=>toggle(e));stable(e,()=>toggle(e));assert.deepEqual(inputIDs.map(id=>e.$(id).checked),[false,true,false,true]);
 const stored=await flush(e);assert.ok(!JSON.stringify(stored).includes('displaySettings'),'expansion is not stored');
 const reloaded=await boot({db:e.db});assertOpen(reloaded,false);assert.deepEqual(state(reloaded),state(e));assert.deepEqual(inputIDs.map(id=>reloaded.$(id).checked),[false,true,false,true]);
 reloaded.w.close();
 await e.d.querySelector('.tab.active .close').onclick();assertOpen(e,false);assert.equal(e.bar.hidden,true);assert.equal(e.w.getComputedStyle(e.bar).display,'none');assert.equal(e.$('display-settings-toggle').disabled,true);
 const closed=await saved(e);assert.deepEqual(closed.sampleLayout.positions,stored.tabs[0].positions);assert.equal(closed.preferWrite,true);assert.equal(closed.sampleLayout.showExceptions,false);assert.equal(closed.sampleLayout.selectedEdgesOnly,true);
 e.$('open-sample').click();assertOpen(e,false);assert.equal(e.bar.hidden,false);assert.deepEqual(inputIDs.map(id=>e.$(id).checked),[false,true,false,true]);
 assert.deepEqual(state(e).tabs[0].positions,stored.tabs[0].positions);
 checks.push('all four unchanged handlers persist settings; open panel reloads collapsed; last-tab close hides/resets toolbar; sample reopen preserves settings');
 e.w.close();

 // Selected, signed and far-away nodes exercise camera origins/insets while
 // low zoom makes the measured toolbar tail, rather than node padding, bind.
 for(const [width,height,zoom,dark] of [[1280,800,.25,false],[393,852,.36,true],[320,568,.25,false],[1280,800,1,false],[320,568,2.5,true]]){
  const tab=structuredClone(initial),ids=Object.keys(tab.positions);tab.positions[ids[0]]=[-500,-300];tab.positions[ids[1]]=[2600,5400];tab.canvasOrigin=[1000,800];tab.viewInset=[80,60];tab.zoom=zoom;tab.selected=design.graph.nodes.find(n=>n.scope).id;
  const e=await boot({width,height,seed:{...session(tab),dark}});await flush(e);assertOpen(e,false);
  const baseline=extent(e);for(let i=0;i<5;i++){stable(e,()=>toggle(e));if(zoom<1)assert.ok(parseFloat(extent(e)[1])>parseFloat(baseline[1]),'expanded panel reserves its measured top at low zoom');stable(e,()=>toggle(e));assert.deepEqual(extent(e),baseline);}
  toggle(e);e.v.scrollLeft=parseFloat(e.$('canvas').style.width)-e.v.clientWidth;e.v.scrollTop=parseFloat(e.$('canvas').style.height)-e.v.clientHeight;e.v.onscroll();await flush(e);
  const farExtent=extent(e),farScroll=scroll(e);stable(e,()=>toggle(e));assert.deepEqual(extent(e),farExtent,'close at far edge retains enough extent to preserve camera');
  for(let i=0;i<5;i++){stable(e,()=>toggle(e));stable(e,()=>toggle(e));assert.deepEqual(extent(e),farExtent);assert.deepEqual(scroll(e),farScroll);}
  e.v.scrollLeft=0;e.v.scrollTop=0;e.v.onscroll();e.notifyResize();assert.deepEqual(extent(e),baseline,'unused tail shrinks after returning to origin');
  const expected=await flush(e);toggle(e);const reload=await boot({db:e.db,width,height});assertOpen(reload,false);assert.deepEqual(state(reload),json(expected));reload.w.close();e.w.close();
 }
 checks.push('desktop/393/320 width models, 25/36/100/250% zoom, dark/light, signed nodes, selection, inset/origin, max-scroll preservation and origin nonaccumulation');

 const closing=await boot({seed:session(structuredClone(initial))});toggle(closing);await flush(closing);
 closing.w.__holdNextSave=true;closing.w.__failNextSave=true;
 const closePromise=closing.d.querySelector('.tab.active .close').onclick();
 await until(()=>typeof closing.w.__releaseSave==='function');assert.equal(closing.$('display-settings-toggle').disabled,true);
 stable(closing,()=>{closing.$('display-settings-toggle').onclick();escape(closing);});assertOpen(closing,true);
 closing.w.__releaseSave();await closePromise;assertOpen(closing,true);assert.equal(closing.$('display-settings-toggle').disabled,false);assert.equal(closing.d.querySelectorAll('.tab').length,1);
 assert.match(closing.$('status-text').textContent,/タブを閉じませんでした/);
 await closing.d.querySelector('.tab.active .close').onclick();assertOpen(closing,false);assert.equal(closing.bar.hidden,true);closing.w.close();
 checks.push('pending tab-close save disables/guards gear; failed save keeps open panel usable; successful close resets collapsed');

 const gesture=await boot({seed:session(structuredClone(initial))});gesture.$('layout-lock').click();await flush(gesture);
 const fire=(kind,type,id,x,y,target=gesture.v)=>{const event=new gesture.w.Event(type,{bubbles:true,cancelable:true});Object.assign(event,{pointerType:kind,pointerId:id,button:0,clientX:x,clientY:y});target.dispatchEvent(event);};
 // No graph rebuild is needed to invalidate a node drag or viewport pan.
 for(const kind of ['mouse','pen','touch']){
  const node=gesture.d.querySelector('.node');fire(kind,'pointerdown',1,400,400,node);
  stable(gesture,()=>toggle(gesture));const before=state(gesture),dom=identities(gesture),routeCalls=gesture.w.__calls.routes;
  fire(kind,'pointermove',1,450,440,kind==='touch'?gesture.v:node);fire(kind,'pointerup',1,450,440,kind==='touch'?gesture.v:node);
  assert.deepEqual(state(gesture),before);assert.deepEqual(identities(gesture),dom);assert.equal(gesture.w.__calls.routes,routeCalls);assert.equal(gesture.frames.size,0);
 }
 fire('mouse','pointerdown',2,400,400);stable(gesture,()=>toggle(gesture));const panBefore=scroll(gesture);fire('mouse','pointermove',2,300,300);fire('mouse','pointerup',2,300,300);assert.deepEqual(scroll(gesture),panBefore);
 gesture.w.close();checks.push('opening/closing cancels stale mouse, pen and touch node drags and background pan without rebuilding graph');

 // Static CSS assertions pin responsive bounds without pretending JSDOM does
 // native flex layout or a real 320px hit test.
 assert.match(css,/\.toolbar\{width:max-content;flex-wrap:wrap\}/);
 assert.match(css,/\.toolbar\[data-settings-open=true\]\{width:460px\}/);
 assert.match(css,/\.toolbar\{max-width:calc\(100% - 24px\)\}/);
 assert.match(css,/\.display-options\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)[^}]*order:-1/);
 assert.match(css,/\.display-options\[hidden\]\{display:none\}/);
 assert.match(css,/\.graph-actions\{[^}]*display:flex;flex-wrap:wrap;[^}]*justify-content:flex-start/);
 assert.match(css,/\.display-options \.graph-action\{[^}]*flex:0 1 auto;width:max-content;max-width:100%/);
 assert.match(css,/\.toolbar button\{height:40px;width:40px/);
 assert.match(css,/@media\(max-width:480px\)\{\.toolbar button\{width:32px\}\.toolbar #zoom\{min-width:48px/);
 assert.doesNotMatch(source.match(/function setDisplaySettings\([\s\S]*?\n\}/)[0],/graph\(|render\(|redrawEdges\(|persist\(|reconcile\(/);
 assert.match(readFileSync('README.md','utf8'),/歯車ボタンで、4つの表示設定を開閉/);
 checks.push('CSS static compact/460px expanded bounds, two-column normal flow, explicit hidden override, 40px/32px responsive buttons');
 console.log(JSON.stringify({model:'JSDOM + fake IndexedDB + explicit geometry and clamping model; no native browser verification',passed:checks.length,checks},null,2));
}finally{windows.forEach(w=>w.close());delete globalThis.indexedDB;}
