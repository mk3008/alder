import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {registerHooks} from 'node:module';
import {JSDOM} from 'jsdom';
import {build} from 'esbuild';

registerHooks({resolve(s,c,n){if((s.startsWith('./')||s.startsWith('../'))&&!/\.[a-z0-9]+$/i.test(s)){try{return n(s+'.ts',c)}catch{}try{return n(s+'.js',c)}catch{}}return n(s,c)}});
const {parseDocument}=await import('../src/document-input.ts');
const parsed=parseDocument(readFileSync('../business-design/alder/json-normalized-model-review.json','utf8')).model;
const context={model:parsed.concepts[0],business:parsed.business};
const code=(await build({entryPoints:['src/viewer-shell.ts'],bundle:true,write:false,format:'iife',globalName:'Shell',loader:{'.css':'empty'}})).outputFiles[0].text;
const w=new JSDOM('<div id="app"><header><button id="node-list-toggle">Left</button><button id="drawer">Right</button></header><div class="tab-strip"><nav id="tabs"></nav><div id="document-actions"></div></div><div class="workspace"><aside id="node-list-drawer" hidden></aside><main></main><aside id="formattedMarkdownDrawer"></aside></div></div>',{url:'https://viewer.test/?view=concept&concept=overview',runScripts:'outside-only',pretendToBeVisual:true}).window;
const d=w.document;w.eval(code+';globalThis.Shell=Shell;');let current=context,key='candidate';
const options={capture(){},business:()=>({key,concept:current,activities:[],objects:[],states:[],views:[{key:'overview',name:'全体図'}],viewKey:'overview'}),openActivity(){},openObject(){},openOverview(){},activateView(){},statePanel(){},closeLegacyList(){},refresh(){}};
try{
 const shell=w.Shell.installViewerShell(d.querySelector('#app'),options);shell.syncDocument();
 const select=s=>d.querySelector(s),overview=select('iframe[data-concept-view="overview"]');assert(overview&&!overview.hidden);
 const originalSrc=overview.getAttribute('src');assert.match(originalSrc,/concept\.html\?view=overview/);
 const heading=select('[data-explorer-key="group:concept"]');if(heading.getAttribute('aria-expanded')==='false')heading.click();
 const item=select('[data-explorer-key="concept:structure-explorer"]');assert(item);item.click();
 assert.equal(new URL(w.location.href).searchParams.get('concept'),'structure-explorer');
 assert.equal(select('.structure-explorer').hidden,false);assert(select('[data-concept-id="n-activity"]'));
 assert.equal(select('#concept-tab-structure-explorer').getAttribute('aria-current'),'true');assert.equal(overview.hidden,true);
 assert.equal(select('#drawer').disabled,true,'the separate tree does not overwrite or open the graph drawer');
 select('[data-explorer-key="concept:overview"]').click();assert.equal(overview.hidden,false);assert.equal(overview.getAttribute('src'),originalSrc,'existing graph and its iframe are retained');
 assert.equal(select('.structure-explorer').hidden,true);assert.equal(select('#drawer').disabled,false);
 select('[data-explorer-key="concept:structure-explorer"]').click();
 select('.structure-toolbar button').click();assert.equal(new Set([...d.querySelectorAll('.structure-explorer [data-concept-id]')].map(el=>el.dataset.conceptId)).size,25);
 const close=select('[aria-label="データ構造：構造エクスプローラーのタブを閉じる"]');assert(close);close.click();assert.equal(select('#concept-tab-structure-explorer'),null);assert.equal(overview.hidden,false);
 select('[data-explorer-key="concept:structure-explorer"]').click();
 const another=structuredClone(context);another.model.meta.fieldMappings=[];current=another;key='other';shell.syncDocument();
 select('[data-explorer-key="concept:structure-explorer"]').click();assert.match(select('.structure-explorer').textContent,/Activityの構造を一意に特定できません/,'changing documents does not retain the old tree');
 assert(!select('.structure-explorer [data-concept-id="n-activity"]'));
}finally{w.close();}
const direct=new JSDOM('<div id="app"><header><button id="node-list-toggle"></button><button id="drawer"></button></header><div class="tab-strip"><nav id="tabs"></nav></div><div class="workspace"><aside id="node-list-drawer" hidden></aside><main></main></div></div>',{url:'https://viewer.test/?view=concept&concept=structure-explorer',runScripts:'outside-only',pretendToBeVisual:true}).window;
try{
 direct.eval(code+';globalThis.Shell=Shell;');const shell=direct.Shell.installViewerShell(direct.document.querySelector('#app'),{...options,business:()=>({key:'direct',concept:context,activities:[],objects:[],states:[],views:[{key:'overview',name:'全体図'}],viewKey:'overview'})});shell.syncDocument();
 assert.equal(direct.document.querySelector('.structure-explorer').hidden,false,'the fixed direct URL opens the structure explorer');
 assert(direct.document.querySelector('[data-concept-id="n-activity"]'));
}finally{direct.close();}
console.log('STRUCTURE-001: menu, fixed route, tabs, graph retention, close/reopen and document boundary verified.');
