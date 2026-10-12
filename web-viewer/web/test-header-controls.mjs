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
 const ids=['node-list-toggle','open','open-url','open-text','refresh','theme','drawer'];
 assert.equal(d.querySelectorAll('header>button').length,ids.length);assert.deepEqual([...d.querySelectorAll('header>button')].map(n=>n.id),ids);
 for(const id of ids){const n=d.getElementById(id),c=w.getComputedStyle(n);assert.ok(n.getAttribute('aria-label'));assert.equal(n.querySelectorAll('svg').length,1);assert.equal(c.height,'40px',id);assert.equal(c.minHeight,'40px',id);assert.equal(c.alignItems,'center');assert.equal(c.justifyContent,'center');}
 // Inspect every media branch, including inactive ones: no individual header
 // control may silently acquire a different height at a breakpoint.
 let branches=0;function inspect(rules){for(const r of rules){if(r.cssRules?.length){branches++;inspect(r.cssRules);}if(r.selectorText&&ids.some(id=>d.getElementById(id).matches(r.selectorText))){for(const p of ['height','min-height']){const value=r.style.getPropertyValue(p);if(value)assert.equal(value,'40px',`${r.selectorText} ${p}`);}}}}
 inspect(d.styleSheets[0].cssRules);
 console.log(JSON.stringify({headerControls:'passed',controls:ids.length,mediaBranches:branches,limit:'DOM selectors and CSS declarations only; actual rectangles, SVG centers and badge wrapping require Chrome'}));
}finally{w.close();}
