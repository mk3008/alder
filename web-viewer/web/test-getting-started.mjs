// DOM contract only; real layout and keyboard traversal are covered in the browser gate.
import assert from 'node:assert/strict';
import {gettingStartedFile} from './test-getting-started-browser.mjs';
assert.ok(gettingStartedFile.length>0);
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
const {outputFiles}=await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}});
const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
try{
 w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;
 w.eval(outputFiles[0].text);const d=w.document,$=id=>d.getElementById(id);
 for(let i=0;i<200&&$('open').disabled;i++)await new Promise(r=>setTimeout(r,10));
 const github=$('github-link'),guide=$('authoring-guide'),readme=guide.querySelector('a');
 assert.equal(github.href,'https://github.com/mk3008/alder');
 assert.match(github.getAttribute('aria-label'),/GitHub/);assert.equal(github.tabIndex,0);
 assert.equal(github.querySelector('svg').getAttribute('aria-hidden'),'true');
 assert.equal(readme.href,'https://github.com/mk3008/alder/blob/main/README.ja.md');
 for(const a of [github,readme]){assert.equal(a.target,'_blank');assert.ok(a.relList.contains('noopener'));assert.ok(a.relList.contains('noreferrer'));a.focus();assert.equal(d.activeElement,a);}
 assert.equal(guide.closest('#empty').hidden,false);assert.equal(d.querySelectorAll('.tab').length,0);
 for(const text of ['Alderプラグイン','ヒアリングメモ・議事録・発言内容','このヒアリング結果をAlder業務設計書にして','草案','合意する前にレビュー','このViewerで開くと、図で確認'])assert.ok(guide.textContent.includes(text),text);
 const readmeText=readFileSync('../README.ja.md','utf8');assert.match(readmeText,/## 導入する/);assert.match(readmeText,/## まず使ってみる/);
 $('open-sample').click();assert.equal(d.querySelectorAll('.tab').length,1);assert.equal(guide.closest('#empty').hidden,true);
 await d.querySelector('.close').onclick();assert.equal(d.querySelectorAll('.tab').length,0);assert.equal(guide.closest('#empty').hidden,false);
 assert.equal($('open').disabled,false);assert.equal($('open-sample').getAttribute('aria-disabled'),'false');
 console.log('Getting-started DOM contract passed: links, names, focus, Japanese guidance, sample open/close and zero-tab visibility.');
}finally{w.close();}
