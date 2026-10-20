import {documentControls} from './document-test-view.mjs';
// DOM/IndexedDB model checks for the bundled public sample; no network.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {build} from 'esbuild';
import {parseDesign} from '../src/graph.ts';
const raw=readFileSync('../business-design/alder/README.md','utf8');
const design=parseDesign(raw);
assert.equal(design.graph.nodes.length,25);assert.equal(design.graph.relations.length,63);
assert.ok(design.graph.relations.every(r=>design.graph.nodes.some(n=>n.id===r.from)&&design.graph.nodes.some(n=>n.id===r.to)));
const bundle=async invalid=>(await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'},plugins:invalid?[{name:'invalid-sample',setup(b){b.onLoad({filter:/README\.md$/},()=>({contents:'# Invalid sample',loader:'text'}));}}]:[]})).outputFiles[0].text;
const code=await bundle(false),windows=[],checks=[];
const tick=ms=>new Promise(r=>setTimeout(r,ms));
function env(db=new IDBFactory(),script=code){const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);w.indexedDB=db;w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;let fetches=0,pickers=0;w.fetch=()=>{fetches++;throw Error('Unexpected network');};w.showOpenFilePicker=()=>{pickers++;throw Error('Unexpected picker');};w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};w.eval(script);const $=id=>w.document.getElementById(id);return {w,$,calls:()=>({fetches,pickers}),tabs:()=>w.document.querySelectorAll('.tab'),nodes:()=>w.document.querySelectorAll('.node')};}
async function ready(e){for(let i=0;i<120&&e.$('open').disabled;i++)await tick(25);assert.equal(e.$('open').disabled,false);e.$('layout-lock').click();return e;}
const click=(e,id)=>e.$(id).click();
function choose(e,node){node.onpointerdown({button:0,clientX:0,clientY:0,pointerId:1,stopPropagation(){}});node.onpointerup({pointerId:1});}
try{
 // Purchase-request format migration: source, graph, exporter and rendered body agree.
 const purchasePath='../business-design/purchase-request/README.md';
 const purchaseRaw=readFileSync(purchasePath,'utf8'),purchaseDesign=parseDesign(purchaseRaw);
 const activityNames=['備品購入を申請する','購入申請を承認する','購入申請を却下する','承認済み備品を購入する'];
 assert.deepEqual(purchaseDesign.activityOrder,activityNames);
 assert.equal(purchaseDesign.graph.nodes.filter(n=>n.type==='business').length,4);
 assert.deepEqual(purchaseDesign.graph.nodes.filter(n=>n.type==='object').map(n=>n.name).sort(),['申請者','承認者','購買担当者','購入申請'].sort());
 assert.equal(purchaseDesign.graph.relations.length,11);
 const exported=JSON.parse(execFileSync('python3',['../tools/business_graph/export.py',purchasePath],{encoding:'utf8'}));
 assert.deepEqual(purchaseDesign.graph,exported,'Viewer and existing Python exporter project the same graph');
 const outputs=activityNames.map(name=>purchaseDesign.graph.relations.filter(r=>r.kind==='output'&&r.from===name));
 for(const [i,state] of ['submitted','approved','rejected','purchased'].entries()){
  assert.equal(outputs[i].length,1);assert.equal(outputs[i][0].to,'購入申請');assert.ok(outputs[i][0].label.includes(state));
  assert.ok(purchaseDesign.graph.nodes.find(n=>n.id===activityNames[i]).result.includes(state));
 }
 for(const [name,state] of [[activityNames[1],'submitted'],[activityNames[2],'submitted'],[activityNames[3],'approved']]){
  const input=purchaseDesign.graph.relations.find(r=>r.kind==='input'&&r.from==='購入申請'&&r.to===name);
  assert.ok(input?.label.includes(state));assert.ok(purchaseDesign.graph.nodes.find(n=>n.id===name).when.includes(state));
 }
 assert.ok(purchaseDesign.graph.nodes.find(n=>n.id===activityNames[2]).result.includes('購入対象にはならない'));
 assert.ok(purchaseRaw.includes('識別子の採番・入力方法はこの業務設計では規定しない'));
 for(const unresolved of ['申請金額によって承認者や承認段階が変わる場合の扱い','在庫確認、発注、納品、検収、支払に関する業務','購入先の選定方法','購入後の備品管理、資産管理、廃棄','外部システムとの連携','監査履歴や通知に関する業務'])assert.ok(purchaseRaw.includes('- '+unresolved));
 const purchase=await ready(env());click(purchase,'open-text');purchase.$('source-text').value=purchaseRaw;await purchase.$('source-submit').onclick();
 assert.equal(purchase.nodes().length,8);assert.equal(purchase.$('edges').querySelectorAll('.edge').length,11);
 assert.equal(purchase.$('detail').querySelector('.markdown').textContent,'図の業務やObjectを選択してください');
 for(const name of purchaseDesign.graph.nodes.map(n=>n.name)){
  assert.ok(purchaseDesign.sections[name].startsWith('# '+(activityNames.includes(name)?'Activity ':'Object ')+name));
  const node=Array.from(purchase.nodes()).find(n=>n.dataset.node===name);assert.ok(node);choose(purchase,node);
  assert.equal(purchase.$('detail').querySelector('h1').textContent,(activityNames.includes(name)?' ':' : ')+name);
  assert.ok(purchase.$('detail').textContent.includes(name),'selected graph node resolves to its Markdown section');
 }
 click(purchase,'view-markdown');assert.equal(purchase.$('source-text').value,purchaseRaw);
 assert.deepEqual(purchase.calls(),{fetches:0,pickers:0});
 checks.push('purchase request: four activities, four objects, eleven relations, branch states, six unresolved items, Python parity and every node Markdown reference');
 const db=new IDBFactory(),e=env(db),history=e.w.history.length;
 assert.equal(e.$('open-sample').getAttribute('aria-disabled'),'true');click(e,'open-sample');assert.equal(e.tabs().length,0);await ready(e);
 assert.equal(e.$('open-sample').textContent,'サンプルを開く');assert.equal(e.$('empty').hidden,false);assert.ok(e.$('empty').textContent.startsWith('業務設計書を開くには'));
 click(e,'open-sample');click(e,'open-sample');click(e,'open-sample');
 assert.equal(e.tabs().length,1);assert.equal(e.nodes().length,25);assert.equal(e.$('edges').querySelectorAll('.edge').length,63);assert.equal(e.$('empty').hidden,true);assert.equal(e.$('status').hidden,true);assert.equal(e.w.location.hash,'');assert.equal(e.w.history.length,history);assert.equal(e.w.document.activeElement,e.$('viewport'));assert.equal(e.$('detail').querySelector('.markdown').textContent,'図の業務やObjectを選択してください');checks.push('restore guard, no-file sample, 25 nodes/63 relations, silent duplicate-safe open, unchanged history');
 const key=e.tabs()[0].dataset.key,node=e.nodes()[0],id=node.dataset.node;choose(e,node);const n=e.w.document.querySelector('.node.selected');n.onpointerdown({button:0,clientX:0,clientY:0,pointerId:1,stopPropagation(){}});n.onpointermove({clientX:80,clientY:50});n.onpointerup({pointerId:1});const pos=[e.nodes()[0].style.left,e.nodes()[0].style.top];
 click(e,'theme');assert.equal(e.$('refresh').hidden,false);assert.equal(e.$('refresh').disabled,true);await e.$('refresh').onclick();assert.equal(e.tabs().length,1);assert.equal(e.tabs()[0].dataset.key,key);assert.deepEqual([e.nodes()[0].style.left,e.nodes()[0].style.top],pos);assert.equal(e.w.document.querySelector('.node.selected').dataset.node,id);assert.deepEqual(e.calls(),{fetches:0,pickers:0});assert.equal(e.$('status').hidden,true);assert.equal(e.$('status-text').textContent,'');await tick(300);e.w.close();
 const restored=await ready(env(db));assert.equal(restored.tabs().length,1);assert.equal(restored.tabs()[0].dataset.key,key);assert.equal(restored.w.document.documentElement.dataset.theme,'dark');assert.equal(restored.w.document.querySelector('.node.selected').dataset.node,id);assert.deepEqual([restored.nodes()[0].style.left,restored.nodes()[0].style.top],pos);assert.equal(restored.$('status').hidden,true);assert.deepEqual(restored.calls(),{fetches:0,pickers:0});checks.push('disabled sample refresh handler and IndexedDB reload preserve selected node/layout/theme with no fetch or picker');
 click(restored,'open-text');restored.$('source-text').value='# invalid';await restored.$('source-submit').onclick();assert.equal(restored.tabs().length,1);assert.equal(restored.nodes().length,25);click(restored,'source-cancel');
 await restored.$('open-sample').onclick({preventDefault(){}});assert.equal(restored.tabs().length,1);assert.equal(restored.w.document.querySelector('.tab.active').dataset.key,key);assert.deepEqual([restored.nodes()[0].style.left,restored.nodes()[0].style.top],pos);assert.equal(restored.$('document-recovery'),null);

 const layout=e=>Array.from(e.nodes(),n=>[n.dataset.node,n.style.left,n.style.top]);
 const moved=restored.nodes()[0];moved.onpointerdown({button:0,clientX:0,clientY:0,pointerId:1,stopPropagation(){}});moved.onpointermove({clientX:65,clientY:35});moved.onpointerup({pointerId:1});
 click(restored,'out');restored.$('viewport').scrollLeft=130;restored.$('viewport').scrollTop=85;restored.$('viewport').dispatchEvent(new restored.w.Event('scroll'));
 const latestLayout=layout(restored),latestZoom=restored.$('zoom').textContent;
 await restored.w.document.querySelector('.close').onclick();assert.equal(restored.tabs().length,1);click(restored,'open-sample');click(restored,'open-sample');assert.equal(restored.tabs().length,1);assert.deepEqual(layout(restored),latestLayout);assert.equal(restored.$('zoom').textContent,latestZoom);assert.deepEqual([restored.$('viewport').scrollLeft,restored.$('viewport').scrollTop],[130,85]);
 assert.equal(restored.$('refresh').hidden,false);assert.equal(restored.$('refresh').disabled,true);await restored.$('refresh').onclick();assert.deepEqual(layout(restored),latestLayout);restored.w.dispatchEvent(new restored.w.Event('blur'));await tick(250);await restored.w.document.querySelector('.close').onclick();restored.w.close();
 const closedReload=await ready(env(db));assert.equal(closedReload.tabs().length,1);assert.equal(closedReload.$('empty').hidden,true);click(closedReload,'open-sample');assert.deepEqual(layout(closedReload),latestLayout);assert.equal(closedReload.$('zoom').textContent,latestZoom);assert.deepEqual([closedReload.$('viewport').scrollLeft,closedReload.$('viewport').scrollTop],[130,85]);assert.equal(closedReload.w.document.documentElement.dataset.theme,'dark');assert.deepEqual(closedReload.calls(),{fetches:0,pickers:0});
 closedReload.$('scope-outside').click();assert.equal(closedReload.nodes().length,12);closedReload.w.dispatchEvent(new closedReload.w.Event('blur'));await tick(250);await closedReload.w.document.querySelector('.close').onclick();closedReload.w.close();
 const filteredReload=await ready(env(db));assert.equal(filteredReload.tabs().length,1);click(filteredReload,'open-sample');assert.equal(filteredReload.nodes().length,12);filteredReload.$('scope-outside').click();assert.deepEqual(layout(filteredReload),latestLayout);checks.push('close/reopen retains latest all-node positions, zoom and scroll; closed-tab reload stays closed then restores sample; hidden close/reload retains outside positions');
 const readonlySample=await ready(env());click(readonlySample,'open-sample');click(readonlySample,'view-markdown');assert.equal(readonlySample.$('source-text').readOnly,true);assert.equal(readonlySample.$('source-text').value,raw);assert.equal(readonlySample.$('source-submit').hidden,true);const graphBefore=readonlySample.$('nodes').innerHTML;await readonlySample.$('source-submit').onclick();await readonlySample.$('refresh').onclick();assert.equal(readonlySample.$('nodes').innerHTML,graphBefore);assert.deepEqual(readonlySample.calls(),{fetches:0,pickers:0});
 const broken=await ready(env(new IDBFactory(),await bundle(true)));click(broken,'open-sample');assert.equal(broken.tabs().length,0);assert.equal(broken.$('empty').hidden,false);assert.match(broken.$('status-text').textContent,/サンプルを開けません/);click(broken,'open-sample');assert.equal(broken.tabs().length,0);assert.deepEqual(broken.calls(),{fetches:0,pickers:0});checks.push('invalid bundled sample leaves empty state and retry link with visible error');
 const saving=await ready(env());saving.w.structuredClone=()=>{throw Error('storage unavailable');};click(saving,'open-sample');await tick(230);assert.equal(saving.nodes().length,25);assert.match(saving.$('status-text').textContent,/引き継げません/);click(saving,'open-sample');assert.equal(saving.tabs().length,1);assert.match(saving.$('status-text').textContent,/引き継げません/);checks.push('save failure retains usable sample and persistent error without duplicate tabs');
 console.log(JSON.stringify({model:'JSDOM/IndexedDB, no real browser',publicSource:'business-design/alder/README.md',nodes:25,relations:63,checks,passed:checks.length},null,2));
}finally{windows.forEach(w=>w.close());}
