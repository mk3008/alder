// Local setup gate: use the same literal that all16 browser subcases consume.
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {build} from 'esbuild';
import {parseDesign} from '../src/graph.ts';
import {bottomFixture,bottomNodeID} from './bottom-clearance-fixture.mjs';
const expected={version:1,nodes:[{id:bottomNodeID,type:'business',name:bottomNodeID,scope:true,why:'Test toolbar clearance',when:'Test',who:'Tester',where:'Test',result:'Test'}],relations:[]};
assert.deepEqual(parseDesign(bottomFixture).graph,expected);
const invalid='# Clearance fixture\n\n# Object Clearance card\n\n## Scope\n\ntrue\n\n## Icon\n\nfile-text\n\n## Information\n\n- Synthetic canvas boundary test\n';
assert.throws(()=>parseDesign(invalid),/Activity required/);
const {outputFiles}=await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}});
const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
try{
 w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};
 w.eval(outputFiles[0].text);const d=w.document,$=id=>d.getElementById(id);
 for(let i=0;i<120&&$('open').disabled;i++)await new Promise(r=>setTimeout(r,25));assert.equal($('open').disabled,false);
 $('open-text').click();$('source-text').value=invalid;await $('source-submit').onclick();
 assert.equal(d.querySelectorAll('.node').length,0);assert.equal($('status').hidden,false);assert.equal($('status').dataset.kind,'error');assert.match($('status-text').textContent,/Activity required/);
 $('status-close').click();$('source-text').value=bottomFixture;await $('source-submit').onclick();
 assert.equal(d.querySelectorAll('.node').length,1);assert.equal(d.querySelector('.node').dataset.node,bottomNodeID);assert.equal($('source-dialog').hidden,true);
 if(!$('formattedMarkdownDrawer').hidden)$('drawer').click();
 assert.equal($('node-list-drawer').hidden,true);assert.equal($('formattedMarkdownDrawer').hidden,true);
 const selectors=['#open-text','#source-text','#source-submit','.node','#formattedMarkdownDrawer','#drawer','#layout-lock','#viewport','#canvas','.toolbar','#zoom'];for(const s of selectors)assert.equal(d.querySelectorAll(s).length,1,s);
 // Actual graph rebuild changes lock only, not the single fixture position.
 const position=()=>[d.querySelector('.node').style.left,d.querySelector('.node').style.top],before=position();$('layout-lock').click();assert.deepEqual(position(),before);
 // The low-zoom formula comparison is arithmetic; it is not browser evidence.
 for(const width of [1280,393,320])for(const zoom of [.25,.28,1,2.5])for(const scrollbar of [0,15]){const obstruction=(width===1280?62:54)-scrollbar,required=obstruction+12,height=Math.max(850,5220,5068+required/zoom);assert.ok((height-5068)*zoom-obstruction>=12-1e-9);}
 console.log(JSON.stringify({bottomFixturePreflight:'passed',nodes:1,relations:0,objectOnlyRejected:true,invalidUIErrorDetected:true,selectors:selectors.length,overlaysClosed:true,arithmeticCases:24,limit:'DOM/parser setup and arithmetic only; real geometry, hit testing, resize and pointer behavior require Chrome'}));
}finally{w.close();}
// Ordinary-drag setup arithmetic with the preserved [100,700] fixture. Camera
// inset creates scroll room; the browser test still measures real boundaries.
{
 const nodeY=700,inset=400,scroll=740,header=109,clientHeight=851,toolbarTop=841;
 const canvasHeight=Math.max(850,nodeY+220)+inset*2;
 assert.ok(canvasHeight-clientHeight>=scroll);
 const start=header+nodeY+inset-scroll+30,end=start+100;
 assert.ok(start>header+48&&end<toolbarTop-12-48);
 assert.equal((Math.max(850,nodeY+100+220)+inset*2)-canvasHeight,100);
 console.log(JSON.stringify({ordinaryDragCameraPreflight:'arithmetic-only',start,end,expectedPosition:[100,800],canvasHeight,scroll}));
}
