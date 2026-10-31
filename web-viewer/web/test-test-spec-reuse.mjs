import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';

const raw=readFileSync('../business-design/alder/business-design.json','utf8'),pkg=JSON.parse(raw);
const business=pkg.documents.find(d=>d.kind==='businessDesign'),activity=business.activities.find(a=>a.name==='業務設計');
const code=(await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text','.json':'text'}})).outputFiles[0].text;
const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/menu-reuse',runScripts:'outside-only',pretendToBeVisual:true}).window;
w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLElement.prototype.setPointerCapture=()=>{};
w.eval(code);const $=selector=>w.document.querySelector(selector),until=async fn=>{for(let i=0;i<400&&!fn();i++)await new Promise(r=>setTimeout(r,10));assert.ok(fn(),'expected app state');};
const entry=key=>$('[data-explorer-key="'+key+'"]');
try{
 await until(()=>!$('#open').disabled);$('#open-sample').click();await until(()=>w.document.querySelectorAll('.node').length>0&&!!entry('group:tests'));
 assert.equal([...w.document.querySelectorAll('.explorer-parent')].at(-1).textContent,'テスト仕様');
 entry('business:'+activity.id).click();if($('#formattedMarkdownDrawer').hidden)$('#drawer').click();$('#detail-mode-checks').click();
 await until(()=>!!$('#detail [data-check-id="SAMPLE-01"]'));
 const before=$('#detail [data-check-id="SAMPLE-01"]').outerHTML;
 entry('tests:'+activity.id).click();await until(()=>!!$('#tests-workspace [data-check-id="SAMPLE-01"]'));
 assert.equal($('#tests-workspace [data-check-id="SAMPLE-01"]').outerHTML,before,'menu must use the existing Check display without rewriting it');
 assert.match($('#tests-workspace').textContent,/条件/);assert.match($('#tests-workspace').textContent,/期待結果/);
 entry('business:'+activity.id).click();assert.equal($('#formattedMarkdownDrawer').hidden,false,'visiting the menu leaves the global drawer preference intact');
 console.log(JSON.stringify({passed:['existing Check rendering','last menu entry','global drawer state'],scope:'actual app DOM'}));
}finally{w.close();}
