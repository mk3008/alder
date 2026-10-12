import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {parseDesign} from '../src/graph.ts';
const raw=readFileSync('../business-design/alder/README.md','utf8'),design=parseDesign(raw),outside=design.graph.nodes.filter(n=>!n.scope);
assert.ok(outside.length>1);
const {outputFiles}=await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'},plugins:[{name:'route-counter',setup(b){b.onLoad({filter:/\/routing\.ts$/},a=>({contents:readFileSync(a.path,'utf8').replace('const source=nodes.find','globalThis.__routes=(globalThis.__routes??0)+1; const source=nodes.find'),loader:'ts'}));}}]});
const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window,d=w.document,$=id=>d.getElementById(id);w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};
function state(value){assert.equal($('scope-outside').getAttribute('aria-pressed'),value);assert.equal($('show-outside').getAttribute('aria-checked'),value);assert.equal($('show-outside').indeterminate,value==='mixed');assert.equal($('show-outside').checked,value==='true');}
function individual(n){$('node-category-'+(n.type==='business'?'activity':'object')).click();[...d.querySelectorAll('[data-node-visibility]')].find(e=>e.dataset.nodeVisibility===n.id).click();}
const geometry=()=>({nodes:[...d.querySelectorAll('.node')].map(n=>[n.dataset.node,n.style.left,n.style.top]),paths:[...d.querySelectorAll('.edge')].map(n=>[n.dataset.relation,n.getAttribute('d')]),canvas:$('canvas').getAttribute('style'),viewBox:$('edges').getAttribute('viewBox'),scroll:[$('viewport').scrollLeft,$('viewport').scrollTop]});
try{w.eval(outputFiles[0].text);assert.equal($('show-outside').disabled,true);for(let i=0;i<120&&$('open').disabled;i++)await new Promise(r=>setTimeout(r,25));assert.equal($('show-outside').disabled,true);$('open-sample').click();state('true');assert.equal($('show-outside').disabled,false);w.__routes=0;
 $('viewport').scrollLeft=200;$('viewport').scrollTop=100;$('viewport').dispatchEvent(new w.Event('scroll'));const before=geometry();
 for(let i=0;i<3;i++){$('show-outside').click();state('false');assert.equal(d.querySelectorAll('.node.outside').length,0);$('scope-outside').click();state('true');assert.deepEqual(geometry(),before);individual(outside[0]);state('mixed');assert.equal(d.querySelectorAll('.node.outside').length,outside.length-1);$('show-outside').click();state('true');assert.deepEqual(geometry(),before);}
 $('scope-outside').click();state('false');individual(outside[0]);state('mixed');$('scope-outside').click();state('true');assert.deepEqual(geometry(),before);assert.equal(w.__routes,0);
 // No outside nodes disables both controls, with no independent preference.
 $('open-text').click();$('source-text').value=raw.replace(/(## Scope\s+)false/g,'$1true');await $('source-submit').onclick();assert.equal($('show-outside').disabled,true);assert.equal($('scope-outside').disabled,true);assert.equal(d.querySelectorAll('.node.outside').length,0);
 console.log(JSON.stringify({checks:'bottom and drawer common bulk action; true/false/mixed and indeterminate/aria-checked synchronization; individual overrides; mixed click always show all; zero reroutes; restored geometry/camera/extent; no-document/no-outside disabled',outside:outside.length}));
}finally{w.close();}
