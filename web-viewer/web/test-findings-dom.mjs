import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {build} from 'esbuild';
import {IDBFactory} from 'fake-indexeddb';
const dom=new JSDOM('<body></body>',{runScripts:'outside-only'});
const compiled=await build({entryPoints:['src/findings.ts'],bundle:true,write:false,format:'iife',globalName:'findingUI'});
dom.window.eval(compiled.outputFiles[0].text+'\nwindow.findingUI=findingUI;');
const {parseDesign}=await import('../src/graph.ts');
const design=parseDesign(readFileSync(new URL('../../tools/fixtures/design-findings/example.md',import.meta.url),'utf8'));
const panel=dom.window.findingUI.findingsPanel(design);dom.window.document.body.append(panel);
assert.equal(panel.querySelectorAll('[data-finding-id=F01]').length,1);
assert.equal(panel.querySelectorAll('[data-finding-id=F04]').length,0);
assert.match(panel.textContent,/関連先未設定/);assert.match(panel.textContent,/参照先不一致/);
assert.equal(panel.querySelectorAll('img,script').length,0);
const toggle=panel.querySelector('input');toggle.checked=true;toggle.dispatchEvent(new dom.window.Event('change'));
assert.equal(panel.querySelectorAll('[data-finding-id=F04]').length,1);
assert.deepEqual(Array.from(dom.window.findingUI.nodeFindingLabels(design,design.graph.nodes.find(n=>n.type==='business'))),['困りごと','要確認 1']);
let selection;const index=dom.window.findingUI.findingsIndex(design,false,()=>{},value=>selection=value);dom.window.document.body.append(index);
assert.equal(index.querySelectorAll('[data-finding-key="finding:F01"]').length,1);assert.ok(index.querySelector('button').classList.contains('node-navigate'));assert.equal(panel.querySelector('.finding-card').tagName,'SECTION');
assert.equal(index.querySelectorAll('[data-finding-key="finding:F04"]').length,0);
index.querySelector('[data-finding-key="finding:F01"]').click();assert.equal(selection.id,'F01');
assert.match(index.textContent,/関連先未設定/);assert.match(index.textContent,/参照先不一致/);assert.equal(index.querySelectorAll('img,script').length,0);
assert.equal(dom.window.findingUI.findingsCount(design),4);
dom.window.close();console.log('findings DOM model checks passed (not browser geometry)');

// Real app wiring; native geometry is checked separately in Chromium.
const app=await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}});
const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.HTMLElement.prototype.scrollIntoView=()=>{};w.eval(app.outputFiles[0].text);
const $=id=>w.document.getElementById(id),tick=()=>new Promise(r=>setTimeout(r,20));
let copied=[],clipboardFails=false;
Object.defineProperty(w.navigator,'clipboard',{configurable:true,value:{writeText:async text=>{if(clipboardFails)throw Error('denied');copied.push(text);}}});
const snapshot=()=>({tabs:$('tabs').textContent,selected:w.document.querySelector('.node.selected')?.dataset.node,drawer:$('formattedMarkdownDrawer').hidden,left:$('node-list-drawer').hidden,nodes:$('nodes').innerHTML,edges:$('edges').innerHTML,canvas:$('canvas').getAttribute('style'),scroll:[$('viewport').scrollLeft,$('viewport').scrollTop]});
async function copyID(id){const before=snapshot(),button=$('node-list').querySelector('.finding-copy');assert.equal(button.getAttribute('aria-label'),`指摘ID ${id}をコピー`);button.focus();button.click();await tick();assert.equal(copied.at(-1),id);assert.match($('status-text').textContent,new RegExp(`指摘ID ${id}をコピーしました`));assert.deepEqual(snapshot(),before);assert.equal(w.document.activeElement,button);}

try{
 for(let i=0;i<100&&$('open-text').disabled;i++)await tick();assert.equal($('open-text').disabled,false);
 for(let i=0;i<100&&$('open-text').disabled;i++)await tick();$('open-text').click();$('source-text').value=readFileSync(new URL('../../tools/fixtures/design-findings/example.md',import.meta.url),'utf8');$('source-submit').click();
 for(let i=0;i<100&&!w.document.querySelector('.node');i++)await tick();assert.ok(w.document.querySelector('.node'));
 assert.equal($('findings-toggle'),null);assert.equal($('display-settings-toggle').dataset.findingCount,undefined);
 $('node-list-toggle').click();$('drawer-mode-findings').click();assert.equal($('node-categories').hidden,true);assert.equal($('node-list-search').hidden,true);
 assert.match($('drawer-mode-findings').textContent,/4/);assert.equal($('node-list').querySelectorAll('[data-finding-key="finding:F01"]').length,1);
 $('node-list').querySelector('[data-finding-key="finding:F01"]').click();assert.ok($('node-list').querySelector('.finding-back').classList.contains('node-navigate'));assert.ok($('node-list').querySelector('.finding-target-link').classList.contains('node-navigate'));await copyID('F01');const card=$('node-list').querySelector('.finding-card');assert.deepEqual(Array.from(card.children).slice(0,3).map(e=>e.className),['finding-heading','finding-related','finding-summary']);assert.equal(card.querySelector('.finding-target'),null);assert.equal(card.querySelectorAll('.finding-related li > button').length,2);assert.equal(card.querySelector('.finding-related h3').textContent,'関連項目');assert.doesNotMatch($('node-list').textContent,/関連項目へ移動|対象：/);clipboardFails=true;$('node-list').querySelector('.finding-copy').click();await tick();assert.match($('status-text').textContent,/F01をコピーできません/);clipboardFails=false;const clipboard=w.navigator.clipboard;delete w.navigator.clipboard;$('node-list').querySelector('.finding-copy').click();await tick();assert.match($('status-text').textContent,/F01をコピーできません/);Object.defineProperty(w.navigator,'clipboard',{configurable:true,value:clipboard});assert.equal($('node-list').querySelectorAll('[data-finding-target]').length,2);
 if(!$('formattedMarkdownDrawer').hidden)$('drawer').click();$('node-list').querySelector('[data-finding-target="受付情報"]').click();assert.equal($('formattedMarkdownDrawer').hidden,true,'related target preserves closed state');assert.equal($('node-list-drawer').hidden,false,'related target retains left drawer');$('drawer').click();$('node-list').querySelector('[data-finding-target="依頼を受け付ける"]').click();assert.equal($('formattedMarkdownDrawer').hidden,false,'related target preserves open state');assert.match($('detail').textContent,/依頼を受け付ける/);$('node-list').querySelector('[data-finding-target="受付情報"]').click();assert.equal(w.document.querySelector('.node.selected').dataset.node,'受付情報');assert.match($('detail').textContent,/受付情報/);assert.equal($('detail').querySelector('.finding-card'),null);assert.ok($('node-list').querySelector('[data-finding-id="F01"]'));
 $('node-list').querySelector('.finding-back').click();$('node-list').querySelector('[data-finding-key="finding:F03"]').click();assert.equal($('node-list').querySelectorAll('[data-finding-target]').length,0);await copyID('F03');assert.equal($('node-list').querySelector('.finding-related'),null);assert.match($('node-list').querySelector('.finding-card').children[1].textContent,/関連先：未設定/);
 $('node-list').querySelector('.finding-back').click();$('node-list').querySelector('[data-finding-key="finding:F02"]').click();assert.equal($('node-list').querySelector('[data-finding-target]').disabled,true);assert.equal($('node-list').querySelectorAll('img,script').length,0);
 $('node-list').querySelector('.finding-back').click();const resolved=$('node-list').querySelector('input');resolved.checked=true;resolved.dispatchEvent(new w.Event('change'));assert.ok($('node-list').querySelector('[data-finding-key="finding:F04"]'));$('node-list').querySelector('[data-finding-key="finding:F04"]').click();await copyID('F04');assert.equal($('node-list').querySelector('.finding-related'),null);assert.match($('node-list').querySelector('.finding-card').children[1].textContent,/対象：文書全体/);$('node-list').querySelector('.finding-back').click();$('node-list').querySelector('[data-finding-key^="problem:"]').click();assert.equal($('node-list').querySelector('.finding-copy'),null);$('node-list').querySelector('.finding-back').click();
 $('drawer-mode-items').click();assert.equal($('node-categories').hidden,false);assert.equal($('node-list-search').hidden,false);assert.ok($('node-list').querySelector('[data-list-node]'));
 $('node-category-object').click();const objectRow=Array.from($('node-list').querySelectorAll('[data-list-node]')).find(row=>row.dataset.listNode==='受付情報');objectRow.querySelector('.node-eye').click();
 $('drawer-mode-findings').click();$('node-list').querySelector('[data-finding-key="finding:F01"]').click();assert.equal($('node-list').querySelector('[data-finding-target="受付情報"]').disabled,true,'hidden target stays hidden');
 for(let i=0;i<100&&$('open-text').disabled;i++)await tick();$('open-text').click();$('source-text').value=readFileSync(new URL('../../tools/fixtures/design-findings/example.md',import.meta.url),'utf8').split('# Findings')[0];await $('source-submit').onclick();
 for(let i=0;i<100&&!$('source-dialog').hidden;i++)await tick();assert.equal($('tabs').children.length,1);assert.equal($('document-recovery'),null);assert.equal($('drawer-mode-items').getAttribute('aria-selected'),'true','new document has independent mode');assert.equal($('node-list').querySelector('.finding-back'),null,'old finding detail does not leak to new document');
 $('open-text').click();$('source-text').value=readFileSync(new URL('../../tools/fixtures/design-findings/example.md',import.meta.url),'utf8');await $('source-submit').onclick();$('drawer-mode-findings').click();$('node-list').querySelector('[data-finding-key="finding:F01"]').click();assert.ok($('node-list').querySelector('[data-finding-id="F01"]'));
 $('node-list').querySelector('.finding-back').click();$('drawer-mode-items').click();$('node-category-object').click();const hiddenObject=Array.from($('node-list').querySelectorAll('[data-list-node]')).find(row=>row.dataset.listNode==='受付情報');if(hiddenObject.querySelector('.node-eye').getAttribute('aria-pressed')==='false')hiddenObject.querySelector('.node-eye').click();
 w.document.querySelector('.node[data-node="受付情報"] .finding-badges').click();assert.equal($('node-list-drawer').hidden,false);assert.ok($('node-list').querySelector('[data-finding-id="F01"]'));assert.equal($('detail').querySelector('.finding-card'),null);$('node-list').querySelector('.finding-back').click();$('node-list').querySelector('.finding-all').click();assert.match($('node-list').textContent,/関連先未設定/);
 console.log('findings drawer application DOM wiring passed');
}finally{w.close();}
