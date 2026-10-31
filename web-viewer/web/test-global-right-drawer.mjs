import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';

const path='verification/global-right-drawer.check-items.json',hash='d510bbad60f81a4c29b72f5114230e25517bcf3fdf545f7269bb8da6eb822d10';
const verify=bytes=>assert.equal(createHash('sha256').update(bytes).digest('hex'),hash);verify(readFileSync(path));assert.throws(()=>verify(Buffer.from('{}')));
const checks=JSON.parse(readFileSync(path)).checks,covered=new Set();
const code=(await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}})).outputFiles[0].text;
const source=readFileSync('../work/concept-review/issue-133/versions/purchase-v3-beta.json','utf8');
const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/global',runScripts:'outside-only',pretendToBeVisual:true}).window;
w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLElement.prototype.setPointerCapture=()=>{};
const d=w.document,$=s=>d.querySelector(s),entry=id=>$('[data-explorer-key="'+id+'"]'),until=async fn=>{for(let i=0;i<1000;i++){if(fn())return;await new Promise(r=>setTimeout(r,5));}throw Error('not ready: '+fn);};
const step=async direction=>{const event=new Promise(resolve=>w.addEventListener('popstate',resolve,{once:true}));w.history[direction]();await event;};
try{
 w.sessionStorage.setItem('alder-explorer-v1:/global',JSON.stringify({right:{'concept:landscape':false,'concept:overview':false,'concept:request':false}}));
 w.eval(code);await until(()=>!$('#open').disabled);$('#open-text').click();$('#source-text').value=source;await $('#source-submit').onclick();await until(()=>['saved','unchanged'].includes($('#app').dataset.saveState));
 assert.equal($('#formattedMarkdownDrawer').hidden,false,'existing app default is retained');assert.equal($('#drawer').getAttribute('aria-controls'),'formattedMarkdownDrawer');
 const workbench=$('.shell-workbench');assert.equal($('#formattedMarkdownDrawer').parentElement,workbench);assert.equal($('.concept-related').parentElement,workbench);assert.equal($('#design-explorer').parentElement,workbench);assert.equal($('.tab-strip').parentElement,$('.shell-center'));covered.add('GLOBAL-DRAWER-002');
 entry('concept:landscape').click();assert.equal($('.concept-related').hidden,false,'business open carries into subsystem');entry('concept:overview').click();assert.equal($('.concept-related').hidden,false);entry('concept:request').click();assert.equal($('.concept-related').hidden,false);
 $('.concept-related .shell-heading button').click();entry('business:overview').click();assert.equal($('#formattedMarkdownDrawer').hidden,true,'concept close carries back to business');$('#drawer').click();assert.equal($('#formattedMarkdownDrawer').hidden,false);entry('concept:group-request').click();assert.equal($('.concept-related').hidden,false);
 const frame=$('[data-concept-view=group-request]');$('#drawer').click();w.dispatchEvent(new w.MessageEvent('message',{origin:w.location.origin,source:frame.contentWindow,data:{type:'alder-concept-select',id:'item'}}));assert($('.concept-related').hidden);assert.match($('.concept-related-content').textContent,/依頼数量/);$('#drawer').click();$('[data-sample=request-submitted]').click();
 assert.equal($('.data-examples-panel').dataset.dataExample,'request-submitted');entry('concept:overview').click();assert.equal($('.concept-related').hidden,false);$('#drawer').click();await step('back');assert($('.concept-related').hidden,'Back to a sample URL cannot reopen the global closed drawer');assert.equal($('.data-examples-panel').dataset.dataExample,'request-submitted');await step('forward');assert($('.concept-related').hidden);
 entry('concept:group-request').click();$('#concept-tab-group-request').parentElement.querySelector('.close').click();entry('concept:group-request').click();assert($('.concept-related').hidden,'closing/reopening a tab cannot reset app preference');covered.add('GLOBAL-DRAWER-001');
 const sceneBeforeState=$('.data-examples-panel').dataset.dataExample;$('#drawer').click();
 // Use the actual state menu identity rather than assuming the package projection shape.
 const stateEntry=$('#explorer-states .explorer-item');assert(stateEntry);stateEntry.click();assert($('.concept-related').hidden);assert($('#formattedMarkdownDrawer').hidden);assert($('#drawer').disabled);entry('concept:group-request').click();assert.equal($('.concept-related').hidden,false,'unsupported state page retains the open preference');assert.equal($('.data-examples-panel').dataset.dataExample,sceneBeforeState);covered.add('GLOBAL-DRAWER-003');
 $('#drawer').click();await until(()=>['saved','unchanged'].includes($('#app').dataset.saveState));const saved=JSON.parse(w.sessionStorage.getItem('alder-explorer-v1:/global'));assert.equal(saved.right,undefined,'no tab-level right drawer map is written');assert.equal(saved.rightOpen,undefined,'real app has one persisted Workspace drawer setting');
 const activity=JSON.parse(source).documents.find(x=>x.kind==='businessDesign').activities[0].id;entry('business:'+activity).click();assert.equal($('#formattedMarkdownDrawer').hidden,true);entry('concept:overview').click();assert($('.concept-related').hidden);$('#open-text').click();$('#source-text').value=readFileSync('../work/viewer-json/issue-274/json-native/independent.json','utf8');await $('#source-submit').onclick();await until(()=>['saved','unchanged'].includes($('#app').dataset.saveState));assert.equal($('#formattedMarkdownDrawer').hidden,true,'document changes retain the app preference');assert.equal($('.concept-related').hidden,true);covered.add('GLOBAL-DRAWER-004');
}finally{w.close();}
const complete=results=>{assert.equal(results.length,checks.length);assert.equal(new Set(results).size,results.length);assert.deepEqual(new Set(checks.map(c=>c.id)),new Set(results));};complete([...covered]);assert.throws(()=>complete([...covered].slice(1)));assert.throws(()=>complete([...covered,...covered]));verify(readFileSync(path));console.log(JSON.stringify({authority:path,sha256:hash,passed:[...covered],scope:'actual app DOM; Chrome verifies native persistence and geometry'}));
