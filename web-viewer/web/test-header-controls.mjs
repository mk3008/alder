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
 const ids=['node-list-toggle','open','open-url','open-text','refresh','theme','drawer'];
 assert.equal(d.querySelectorAll('header>button').length,ids.length);assert.deepEqual([...d.querySelectorAll('header>button')].map(n=>n.id),ids);
 for(const id of ids){const n=d.getElementById(id),c=w.getComputedStyle(n);assert.ok(n.getAttribute('aria-label'));assert.equal(n.querySelectorAll('svg').length,1);assert.equal(c.height,'40px',id);assert.equal(c.minHeight,'40px',id);if(['node-list-toggle','theme','drawer'].includes(id)){assert.equal(c.width,'var(--header-control-width)',id+' shared width');assert.equal(c.minWidth,'var(--header-control-width)');assert.equal(c.padding,'7px');}assert.equal(c.alignItems,'center');assert.equal(c.justifyContent,'center');}
 // Fit is based on measured content, including the title while hidden.
 const header=d.querySelector('header'),title=header.querySelector('strong');
 header.style.columnGap='4px';header.style.paddingLeft='6px';header.style.paddingRight='6px';
 let available=0,titleWidth=96;
 Object.defineProperty(header,'clientWidth',{get:()=>available});
 title.getBoundingClientRect=()=>({width:titleWidth});
 for(const action of header.querySelectorAll(':scope > button, :scope > a'))action.getBoundingClientRect=()=>({width:40});
 // 8 actions + title + 9 gaps + padding = 464 CSS px. Resize repeatedly in
 // both directions, then change the measured title width (e.g. font change).
 for(const width of [320,375,390,463,464,601,768,1280,463,464,320,1280]){
  available=width;w.dispatchEvent(new w.Event('resize'));
  assert.equal(title.classList.contains('header-title-hidden'),width<464,'content fit at '+width);
 }
 available=464;titleWidth=120;w.dispatchEvent(new w.Event('resize'));assert.ok(title.classList.contains('header-title-hidden'));
 titleWidth=96;w.dispatchEvent(new w.Event('resize'));assert.ok(!title.classList.contains('header-title-hidden'));
 header.removeAttribute('style');
 // Inspect every media branch, including inactive ones: no individual header
 // control may silently acquire a different height at a breakpoint.
 let branches=0;function inspect(rules){for(const r of rules){if(r.cssRules?.length){branches++;inspect(r.cssRules);}if(r.selectorText&&ids.some(id=>d.getElementById(id).matches(r.selectorText))){for(const p of ['height','min-height']){const value=r.style.getPropertyValue(p);if(value)assert.equal(value,'40px',`${r.selectorText} ${p}`);}}}}
 inspect(d.styleSheets[0].cssRules);
 console.log(JSON.stringify({headerControls:'passed',controls:ids.length,mediaBranches:branches,limit:'DOM selectors and CSS declarations only; actual rectangles, SVG centers and badge wrapping require Chrome'}));
}finally{w.close();}
