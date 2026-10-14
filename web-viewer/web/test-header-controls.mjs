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
 w.eval(outputFiles[0].text);const d=w.document;d.querySelector('style').textContent=css;
 for(let i=0;i<120&&d.querySelector('#open').disabled;i++)await new Promise(r=>setTimeout(r,25));
 assert.equal(d.querySelector('#open').disabled,false);
 const strip=w.getComputedStyle(d.querySelector('.tab-strip'));assert.equal(strip.height,'auto');assert.equal(strip.minHeight,'44px');assert.equal(strip.flexShrink,'0');assert.equal(w.getComputedStyle(d.querySelector('#tabs')).overflowX,'auto');
 const exportIDs=['save-image','copy-image'],actionIDs=['refresh',...exportIDs],stripIDs=['tabs',...actionIDs,'share-source','edit-markdown'];
 assert.deepEqual([...d.querySelector('.tab-strip').children].map(n=>n.id),stripIDs,'document refresh precedes PNG exports and source sharing in natural order');
 for(const [id,label] of [['refresh','現在の文書を取得元から読み直す'],['save-image','グラフ全体をPNGで保存'],['copy-image','グラフ全体をPNGでコピー']]){
  const n=d.getElementById(id),c=w.getComputedStyle(n);assert.equal(n.hidden,true,'no active document hides '+id);assert.equal(n.disabled,true);assert.equal(n.tabIndex,0);assert.equal(n.type,'button');
  assert.equal(n.getAttribute('aria-label'),label);assert.equal(n.title,label);assert.equal(n.textContent.trim(),'','compact action is icon-only');assert.equal(n.querySelectorAll('svg').length,1);assert.equal(n.querySelector('svg').getAttribute('aria-hidden'),'true');
  for(const property of ['width','height','minWidth','minHeight'])assert.equal(c[property],'40px',id+' '+property);
  assert.equal(c.flexShrink,'0');assert.equal(c.display,'none','hidden action has no rendered target');
  assert.equal(n.closest('.toolbar'),null);assert.equal(n.parentElement,d.querySelector('.tab-strip'));
 }
 const ids=['node-list-toggle','open','open-url','open-text','theme','drawer'];
 assert.equal(d.querySelectorAll('header>button').length,ids.length);assert.deepEqual([...d.querySelectorAll('header>button')].map(n=>n.id),ids);
 for(const id of ids){const n=d.getElementById(id),c=w.getComputedStyle(n);assert.ok(n.getAttribute('aria-label'));assert.equal(n.querySelectorAll('svg').length,1);assert.equal(c.height,'40px',id);assert.equal(c.minHeight,'40px',id);if(['node-list-toggle','theme','drawer'].includes(id)){assert.equal(c.width,'var(--header-control-width)',id+' shared width');assert.equal(c.minWidth,'var(--header-control-width)');assert.equal(c.padding,'7px');}assert.equal(c.alignItems,'center');assert.equal(c.justifyContent,'center');}
 // Inspect every media branch, including inactive ones: no individual header
 // control may silently acquire a different height at a breakpoint.
 let branches=0;function inspect(rules){for(const r of rules){if(r.cssRules?.length){branches++;inspect(r.cssRules);}if(r.selectorText&&[...ids,...actionIDs].some(id=>d.getElementById(id).matches(r.selectorText))){for(const p of ['height','min-height']){const value=r.style.getPropertyValue(p);if(value)assert.equal(value,'40px',`${r.selectorText} ${p}`);}}}}
 inspect(d.styleSheets[0].cssRules);
 d.querySelector('#open-sample').click();for(let i=0;i<120&&!d.querySelector('.node');i++)await new Promise(r=>setTimeout(r,25));
 for(const id of actionIDs){assert.equal(d.getElementById(id).hidden,false);assert.equal(d.getElementById(id).disabled,false);assert.equal(w.getComputedStyle(d.getElementById(id)).display,'flex');}
 assert.deepEqual([...d.querySelectorAll('.tab-strip > button')].filter(n=>!n.hidden&&!n.disabled).map(n=>n.id),stripIDs.slice(1),'sample refresh and both exports follow tabs in natural order');
 console.log(JSON.stringify({tabStripDocumentActions:'passed',headerControls:'passed',controls:ids.length,mediaBranches:branches,limit:'DOM selectors and CSS declarations only; actual rectangles, SVG centers and badge wrapping require Chrome'}));
}finally{w.close();}
