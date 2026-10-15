// Structural/CSS gate only. Browser geometry is checked separately in Chrome.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {build} from 'esbuild';
const css=readFileSync('src/style.css','utf8');
const {outputFiles}=await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}});
const w=new JSDOM('<style></style><div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
try{
 w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;
 const fontEvents=new w.EventTarget();fontEvents.ready=Promise.resolve();
 Object.defineProperty(w.document,'fonts',{value:fontEvents});
 w.eval(outputFiles[0].text);const d=w.document;d.querySelector('style').textContent=css;
 for(let i=0;i<120&&d.querySelector('#open').disabled;i++)await new Promise(r=>setTimeout(r,25));
 assert.equal(d.querySelector('#open').disabled,false);
 const strip=w.getComputedStyle(d.querySelector('.tab-strip'));assert.equal(strip.height,'auto');assert.equal(strip.minHeight,'44px');assert.equal(strip.flexShrink,'0');assert.equal(w.getComputedStyle(d.querySelector('#tabs')).overflowX,'auto');
 const exportIDs=['save-image','copy-image'],actionIDs=['refresh',...exportIDs],stripIDs=['tabs','document-actions-toggle','document-actions'];
 assert.deepEqual([...d.querySelector('.tab-strip').children].map(n=>n.id),stripIDs,'tab navigation and disclosure precede original action group');assert.deepEqual([...d.querySelector('#document-actions').children].map(n=>n.id),[...actionIDs,'share-source','open-checks','edit-markdown'],'document refresh precedes PNG exports and source sharing in natural order');
 for(const [id,label] of [['refresh','現在の文書を取得元から読み直す'],['save-image','グラフ全体をPNGで保存'],['copy-image','グラフ全体をPNGでコピー']]){
  const n=d.getElementById(id),c=w.getComputedStyle(n);assert.equal(n.hidden,true,'no active document hides '+id);assert.equal(n.disabled,true);assert.equal(n.tabIndex,0);assert.equal(n.type,'button');
  assert.equal(n.getAttribute('aria-label'),label);assert.equal(n.title,label);assert.equal(n.querySelector('.document-action-label').textContent,label);assert.equal(w.getComputedStyle(n.querySelector('.document-action-label')).display,'none','inline action remains icon-only');assert.equal(n.querySelectorAll('svg').length,1);assert.equal(n.querySelector('svg').getAttribute('aria-hidden'),'true');
  for(const property of ['width','height','minWidth','minHeight'])assert.equal(c[property],'40px',id+' '+property);
  assert.equal(c.flexShrink,'0');assert.equal(c.display,'none','hidden action has no rendered target');
  assert.equal(n.closest('.toolbar'),null);assert.equal(n.parentElement,d.querySelector('#document-actions'));
 }
 const ids=['node-list-toggle','open-menu-toggle','theme','drawer'];
 assert.equal(d.querySelectorAll('header>button').length,ids.length);assert.deepEqual([...d.querySelectorAll('header>button')].map(n=>n.id),ids);
 for(const id of ids){const n=d.getElementById(id),c=w.getComputedStyle(n);assert.ok(n.getAttribute('aria-label'));assert.equal(n.querySelectorAll('svg').length,1);assert.equal(c.height,'40px',id);assert.equal(c.minHeight,'40px',id);if(['node-list-toggle','theme','drawer'].includes(id)){assert.equal(c.width,'var(--header-control-width)',id+' shared width');assert.equal(c.minWidth,'var(--header-control-width)');assert.equal(c.padding,'7px');}assert.equal(c.alignItems,'center');assert.equal(c.justifyContent,'center');}
 const headerActionIDs=['node-list-toggle','open-menu-toggle','theme','github-link','drawer'];
 assert.deepEqual([...d.querySelectorAll('header>button,header>a')].map(n=>n.id),headerActionIDs);
 for(const id of headerActionIDs){
  const icon=d.getElementById(id).querySelector('svg');
  assert.ok(icon,id+' always has an icon');
  assert.notEqual(w.getComputedStyle(icon).display,'none',id+' icon is displayed');
 }
 for(const id of ['open-menu-toggle']){
  assert.ok(d.getElementById(id).querySelector('.source-caption')?.textContent.trim(),id+' caption has the common visibility wrapper');
 }
 // All decisions use the expanded metrics, even after entering icons-only mode.
 const header=d.querySelector('header'),title=header.querySelector('strong');
 header.style.columnGap='4px';header.style.paddingLeft='6px';header.style.paddingRight='6px';
 let available=0,titleWidth=96,actionWidth=40;
 Object.defineProperty(header,'clientWidth',{get:()=>available});
 title.getBoundingClientRect=()=>({width:titleWidth});
 for(const action of header.querySelectorAll(':scope > button, :scope > a')){
  action.getBoundingClientRect=()=>{
   assert.equal(header.classList.contains('header-icons-only'),false,'measure expanded controls before deciding the mode');
   return {width:actionWidth};
  };
 }
 const assertMode=(width,full=332,captioned=232)=>{
  assert.equal(title.classList.contains('header-title-hidden'),width<full,'title fit at '+width);
  assert.equal(header.classList.contains('header-icons-only'),width<captioned,'caption fit at '+width);
 };
 // 5 actions + 5 gaps + padding = 232 CSS px; title + one gap adds 100.
 // Sweep every pixel through both thresholds, then visit widths out of order.
 const widths=Array.from({length:201},(_,i)=>280+i);
 for(const width of [...widths.toReversed(),...widths,280,1280,319,420,320,419,768,280,1280]){
  available=width;w.dispatchEvent(new w.Event('resize'));assertMode(width);
 }
 // A stale/corrupted prior mode cannot alter the next decision.
 for(const width of [280,319,320,419,420,1280])for(const prior of [false,true]){
  header.classList.toggle('header-icons-only',prior);
  title.classList.toggle('header-title-hidden',prior);
  available=width;w.dispatchEvent(new w.Event('resize'));assertMode(width);
 }
 // Font completion must remeasure without requiring a viewport resize. Cover
 // both title growth and action-caption growth while already icons-only.
 available=420;titleWidth=120;fontEvents.dispatchEvent(new w.Event('loadingdone'));assertMode(420,356);
 titleWidth=96;fontEvents.dispatchEvent(new w.Event('loadingdone'));assertMode(420);
 available=320;actionWidth=41;fontEvents.dispatchEvent(new w.Event('loadingdone'));assertMode(320,337,237);
 actionWidth=40;fontEvents.dispatchEvent(new w.Event('loadingdone'));assertMode(320);
 header.removeAttribute('style');
 // Inspect every media branch, including inactive ones: no individual header
 // control may silently acquire a different height at a breakpoint.
 let branches=0;function inspect(rules){for(const r of rules){if(r.cssRules?.length){branches++;inspect(r.cssRules);}if(r.selectorText&&[...headerActionIDs,...actionIDs].some(id=>d.getElementById(id).matches(r.selectorText))){for(const p of ['height','min-height']){const value=r.style.getPropertyValue(p);if(value)assert.equal(value,'40px',`${r.selectorText} ${p}`);}}}}
 inspect(d.styleSheets[0].cssRules);
 d.querySelector('#open-sample').click();for(let i=0;i<120&&!d.querySelector('.node');i++)await new Promise(r=>setTimeout(r,25));
 for(const id of actionIDs){assert.equal(d.getElementById(id).hidden,false);assert.equal(d.getElementById(id).disabled,id==='refresh');assert.equal(w.getComputedStyle(d.getElementById(id)).display,'flex');}
 assert.equal(w.getComputedStyle(d.getElementById('refresh')).opacity,'0.4','sample refresh remains visibly disabled');
 assert.equal(d.getElementById('refresh').closest('header'),null,'document refresh is outside header measurements');
 assert.equal(d.getElementById('refresh').querySelector('.source-caption'),null,'document refresh stays icon-only');
 assert.deepEqual([...d.querySelectorAll('#document-actions > button')].filter(n=>!n.hidden&&!n.disabled).map(n=>n.id),['save-image','copy-image','share-source','open-checks','edit-markdown'],'disabled sample refresh is skipped while PNG exports and sharing retain natural order');
 console.log(JSON.stringify({tabStripDocumentActions:'passed',headerControls:'passed',controls:headerActionIDs.length,monotonicThresholds:[232,332],mediaBranches:branches,limit:'DOM selectors and CSS declarations only; actual rectangles, SVG centers and badge wrapping require Chrome'}));
}finally{w.close();}
