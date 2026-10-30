// CI-RECONCILE-001/002: current explorer, plus restored legacy visibility.
// Prior per-card eye and role-category UI were explicitly retired. Camera/pinch
// and mixed-scope regressions remain in test-initial-left-margin, test-touch,
// test-node-edge-drag and test-scope-shortcut; this test exercises their current entry.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from './legacy-viewer-fixture.mjs';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {parseDesign} from '../src/graph.ts';
import {reconcile,saveSession,loadSession} from '../src/session.ts';
import {openDisplaySettingsDOM} from './toolbar-settings-control.mjs';
const source=readFileSync('web/authorities/ungrouped-alder.md','utf8'),design=parseDesign(source);
const focusAuthority=readFileSync('verification/explorer-focus.check-items.json');
assert.equal(createHash('sha256').update(focusAuthority).digest('hex'),'1489dbce5a5897a736913ce92cae4b63bebde2addb2260bf97972bb334bcd5cb','independent focus CheckItem changed');assert.equal(JSON.parse(focusAuthority).checks[0].id,'EXPLORER-FOCUS-001');
const css=readFileSync('src/viewer-shell.css','utf8');assert.match(css,/\.explorer-item\[aria-current=page\]/);assert.match(css,/\.explorer-subparent/);assert.match(css,/\.explorer-search input\{[^}]*border:/);
const {outputFiles}=await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}}),windows=[];
async function boot(db=new IDBFactory()){
 const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);w.indexedDB=db;w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};w.eval(outputFiles[0].text);const d=w.document,$=id=>d.getElementById(id);for(let i=0;i<120&&$('open').disabled;i++)await new Promise(r=>setTimeout(r,20));assert.equal($('open').disabled,false);return{w,d,$,db};
}
const positions=e=>Object.fromEntries([...e.d.querySelectorAll('.node')].map(n=>[n.dataset.node,[n.style.left,n.style.top]]));
const entry=(e,kind,id)=>[...e.d.querySelectorAll('[data-explorer-key]')].find(n=>n.dataset.explorerKey===kind+':'+id);
function search(e,value){const input=e.d.querySelector('.explorer-search input');input.value=value;input.dispatchEvent(new e.w.Event('input'));}
try{
 const e=await boot(),{$,d,w}=e;assert.equal($('node-list-drawer').hidden,true);$('open-sample').click();assert.equal($('design-explorer').hidden,false);assert.equal($('node-list-toggle').getAttribute('aria-expanded'),'true');
 const activity=design.graph.nodes.find(n=>n.type==='business'&&n.scope),object=design.graph.nodes.find(n=>n.type==='object'&&n.scope),outside=design.graph.nodes.find(n=>!n.scope);
 assert(entry(e,'business',activity.id));assert(entry(e,'object',object.id));assert(entry(e,outside.type==='business'?'business':'object',outside.id));assert.equal(d.querySelectorAll('.node-eye,[data-node-visibility]').length,0);
 assert.equal(d.querySelectorAll('.node.business .who-badge').length,design.graph.nodes.filter(n=>n.type==='business').length);assert.equal(d.querySelectorAll('.node.object .who-badge').length,0);
 const original=positions(e);search(e,'not-found');assert.match(d.querySelector('.explorer-groups').textContent,/該当する項目はありません/);assert.deepEqual(positions(e),original,'filtering must not change the graph');search(e,object.name);assert(entry(e,'object',object.id));assert.equal($('explorer-business-object').hidden,false);assert.deepEqual(positions(e),original);search(e,'');
 const group=d.querySelector('[data-explorer-key="group:business-object"]');group.click();assert.equal($('explorer-business-object').hidden,true);search(e,object.name);assert.equal($('explorer-business-object').hidden,false);search(e,'');assert.equal($('explorer-business-object').hidden,true);d.querySelector('[data-explorer-key="group:business-object"]').click();
 $('node-list-toggle').click();assert.equal($('design-explorer').hidden,true);assert.equal(d.activeElement.id,'node-list-toggle');$('node-list-toggle').click();assert.equal(d.activeElement,d.querySelector('#design-explorer .shell-heading button'),'opening does not focus the input or raise a mobile keyboard');d.querySelector('.explorer-search input').focus();d.querySelector('.explorer-search input').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal($('design-explorer').hidden,true);assert.equal(d.activeElement.id,'node-list-toggle');$('node-list-toggle').click();
 const viewport=$('viewport');Object.defineProperties(viewport,{clientWidth:{value:900},clientHeight:{value:800}});viewport.getBoundingClientRect=()=>({left:300,right:1200,top:108,bottom:908,width:900,height:800});$('formattedMarkdownDrawer').getBoundingClientRect=()=>({left:1200,right:1580,top:108,bottom:908,width:380,height:800});
 entry(e,'object',object.id).click();assert.equal(d.querySelectorAll('#tabs .tab').length,2);assert.equal(d.querySelector('.tab.active').dataset.object,object.id);assert.equal(d.querySelector('.node.selected').dataset.node,object.id);assert.equal(entry(e,'object',object.id).getAttribute('aria-current'),'page');assert.equal(d.querySelector(`[data-node="${object.id}"] .object-open`),null);
 const detail=positions(e),p=detail[object.id].map(parseFloat);assert.equal(p[0]+130+parseFloat($('nodes').style.left)-viewport.scrollLeft,450);assert.equal(p[1]+34+parseFloat($('nodes').style.top)-viewport.scrollTop,400);entry(e,'object',object.id).click();assert.equal(d.querySelectorAll('#tabs .tab').length,2,'existing detail is reused');assert.deepEqual(positions(e),detail);
 await d.querySelector('.tab.active .close').onclick();assert.equal(d.querySelectorAll('#tabs .tab').length,1);assert.deepEqual(positions(e),original,'overview coordinates stay intact after detail navigation');
 openDisplaySettingsDOM(d);$('show-outside').click();assert.equal(d.querySelectorAll('.node.outside').length,0);openDisplaySettingsDOM(d);$('show-outside').click();assert.deepEqual(positions(e),original);
 const isolated=source+'\n# Object 孤立Object\n\n## Scope\n\ntrue\n\n## Icon\n\nfile\n\n## Information\n\n- 独立した情報\n';$('open-text').click();$('source-text').value=isolated;await $('source-submit').onclick();assert(entry(e,'object','孤立Object'));entry(e,'object','孤立Object').click();assert.deepEqual([...d.querySelectorAll('.node')].map(n=>n.dataset.node),['孤立Object']);assert.equal(d.querySelector('.node.selected').dataset.node,'孤立Object');w.close();
 // Old persisted individual visibility remains readable despite removal of its UI.
 const legacyDB=new IDBFactory(),tab=reconcile({key:'legacy',name:'legacy.md',design,positions:{},selected:outside.id,hiddenNodes:[outside.id],scroll:[20,30],zoom:1,source:{kind:'text'}},design);globalThis.indexedDB=legacyDB;await loadSession();await saveSession({tabs:[tab],active:tab.key,dark:false,drawer:true,width:380});delete globalThis.indexedDB;
 const legacy=await boot(legacyDB);assert.equal(legacy.d.querySelector(`[data-node="${outside.id}"]`),null);assert(entry(legacy,outside.type==='business'?'business':'object',outside.id));assert.equal(legacy.$('show-outside').indeterminate,true);openDisplaySettingsDOM(legacy.d);legacy.$('show-outside').click();assert(legacy.d.querySelector(`[data-node="${outside.id}"]`));assert.equal(legacy.$('show-outside').checked,true);
 console.log(JSON.stringify({model:'DOM/IndexedDB',checks:['global explorer focus/Escape and hierarchical page entries','scope and named filtering leave graph unchanged','Object detail opens/reuses and centers with no self link','overview coordinates survive detail close','bulk scope restores exact layout','isolated Object opens','legacy hidden ID restores and can be shown'],passed:7}));
}finally{windows.forEach(w=>w.close());delete globalThis.indexedDB;}
