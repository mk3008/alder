import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {parseDocument,normalizeDocument} from '../src/json-document.ts';
import {readViewerDocument} from '../src/viewer-document.ts';
import {loadDocumentURL,loadDocumentText,loadDocumentFile} from '../src/document-loader.ts';
const md=readFileSync('web/authorities/business-design.md','utf8'),json=readFileSync('../work/plugin-json/issue-273/snapshots/04-final-after-replay.json','utf8');
// Independent legacy-input oracle: no converter, parser output or old Design as expected.
const legacyInput=`# 受付の業務

# Object 申請
## Scope
true
## Icon
file-text
## Information
- 申請番号

# Activity 受付
## Scope
true
## Why
申請を受け付ける
## When
申請が届いたとき
## Who
窓口
## Where
受付
## How
### Input
- 申請 — 申請番号
### Procedure
1. 申請番号を確認する
### Exception
- **番号不明** — 確認を依頼する
### Output
(none)
## Result
受付を記録する

# Findings
## Finding F1
### Kind
question
### Status
open
### Scope
items
### Targets
- 存在しない項目
### Summary
対応先の確認
### Content
人間に確認する
`;
let oracleParse=parseDocument;
if(process.argv.includes('--baseline-model')){
 const pinned='2574d90b0fe765d47b514a5602e29114a1ace4b8';
 const compiled=await build({entryPoints:['src/json-document.ts'],bundle:true,write:false,platform:'node',format:'cjs',plugins:[{name:'pinned-viewer',setup(b){b.onLoad({filter:/\/src\/.*\.ts$/},args=>({contents:execFileSync('git',['show',pinned+':web-viewer/'+args.path.slice(args.path.lastIndexOf('/src/')+1)],{encoding:'utf8'}),loader:'ts',resolveDir:args.path.slice(0,args.path.lastIndexOf('/'))}));}}]});
 const module={exports:{}};new Function('module','exports',compiled.outputFiles[0].text)(module,module.exports);oracleParse=module.exports.parseDocument;
}
const typed=oracleParse(legacyInput);
assert.ok(typed.model,'MD must feed the JSON feature model, not old sections');
assert.deepEqual(typed.model.business.activities,[{id:'受付',name:'受付',scope:true,why:'申請を受け付ける',when:'申請が届いたとき',who:'窓口',where:'受付',procedure:'1. 申請番号を確認する',exception:'- **番号不明** — 確認を依頼する',result:'受付を記録する',problem:null,painLevel:null}]);
assert.deepEqual(typed.model.business.objects,[{id:'申請',name:'申請',scope:true,icon:'file-text',information:['申請番号']}]);
assert.deepEqual(typed.model.business.relations.map(({kind,fromId,toId,label})=>({kind,fromId,toId,label})),[{kind:'input',fromId:'申請',toId:'受付',label:'申請番号'}]);
assert.deepEqual(typed.findings[0].unresolvedTargets,['存在しない項目']);assert.equal(typed.findings[0].status,'open');assert.equal(typed.markdown,legacyInput);
const reservedName=oracleParse(legacyInput.replace('# Object 申請','# Object constructor').replace('- 申請 —','- constructor —'));assert.equal(reservedName.objectStateTransitions.constructor,undefined,'legacy IDs never inherit object properties as state declarations');
// A JSON-shaped model alone is sufficient; poisoned legacy sections cannot affect detail rendering.
const detailBundle=await build({entryPoints:['src/document-view.ts'],bundle:true,write:false,format:'iife',globalName:'viewUI'});
const viewWindow=new JSDOM('<body></body>',{runScripts:'outside-only'}).window;viewWindow.eval(detailBundle.outputFiles[0].text+';window.viewUI=viewUI;');
Object.defineProperty(typed,'sections',{get(){throw Error('Legacy renderer reintroduced');}});
const rendered=viewWindow.viewUI.businessDetail(typed,'受付');assert.match(rendered.textContent,/申請番号を確認する/);assert.match(rendered.textContent,/番号不明/);
const renamedSourceTag={graph:typed.graph,model:typed.model,sourceFormat:'json'};assert.equal(viewWindow.viewUI.businessDetail(renamedSourceTag,'受付').outerHTML,rendered.outerHTML,'business output cannot depend on source format');viewWindow.close();
const originalFetch=globalThis.fetch;
try{
 for(const [format,source,mime]of [['md',md,'text/markdown'],['json',json,'application/json']]){
  const expected=parseDocument(source),normalized=normalizeDocument(source);
  assert.deepEqual(JSON.parse(JSON.stringify(readViewerDocument(JSON.parse(JSON.stringify(normalized))))),JSON.parse(JSON.stringify(expected)),'typed viewing JSON is serializable');
  assert.ok(!('markdown'in normalized.data)&&!('sections'in normalized.data),'original source is outside the normalized JSON');
  assert.equal(normalized.original.text,source);
  globalThis.fetch=async(_url,options)=>{assert.match(options.headers.Accept,/application\/json/);return new Response(source,{headers:{'content-type':mime}});};
  assert.deepEqual(await loadDocumentURL('https://fixture.test/design.'+format),expected);
  assert.deepEqual(loadDocumentText(source),expected);
  assert.deepEqual(await loadDocumentFile({name:'design.'+format,type:mime,size:Buffer.byteLength(source),text:async()=>source}),expected);
 }
 const invalid=normalizeDocument(md);invalid.data.business.relations[0].toId='missing';assert.throws(()=>readViewerDocument(invalid),/endpoint/);
 await assert.rejects(()=>loadDocumentFile({name:'wrong.json',type:'application/json',size:md.length,text:async()=>md}),/JSON/);
}finally{globalThis.fetch=originalFetch;}

// The baseline builds the actual old main, rather than simulating a wrong helper.
const baseline=process.argv.includes('--baseline');
const main=baseline?execFileSync('git',['show','1b82b23ff4fa8537a0b80562d9be88ca37ae0c2d:web-viewer/src/main.ts'],{encoding:'utf8'}):null;
const bundle=await build({...main?{stdin:{contents:main,resolveDir:process.cwd()+'/src',loader:'ts'},plugins:[{name:'pinned-history-main',setup(b){b.onLoad({filter:/\/src\/.*\.ts$/},args=>({contents:execFileSync('git',['show','1b82b23ff4fa8537a0b80562d9be88ca37ae0c2d:web-viewer/'+args.path.slice(args.path.lastIndexOf('/src/')+1)],{encoding:'utf8'}),loader:'ts',resolveDir:args.path.slice(0,args.path.lastIndexOf('/'))}));}}]}:{entryPoints:['src/main.ts']},bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}});
for(const [format,source,mime]of [['md',md,'text/markdown'],['json',json,'application/json']]){
 const w=new JSDOM('<div id="app"></div>',{url:'https://loader.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
 w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.TextDecoder=TextDecoder;w.AbortController=AbortController;w.HTMLElement.prototype.scrollIntoView=()=>{};
 const requests=[];let response=source;
 w.fetch=async(url,opts)=>{requests.push({url,opts});return new Response(response,{headers:{'content-type':mime}});};
 const $=id=>w.document.getElementById(id),wait=async(fn,label)=>{for(let i=0;i<150&&!fn();i++)await new Promise(r=>setTimeout(r,10));assert.ok(fn(),label);};
 try{
  w.eval(bundle.outputFiles[0].text);await wait(()=>!$('open-url').disabled,'ready');
  $('open-url').click();$('source-url').value='https://fixture.test/design.'+format;await $('source-submit').onclick();
  await wait(()=>$('source-dialog').hidden,'new URL opens');
  const expected=w.document.querySelectorAll('.node').length;assert.ok(expected>0);
  assert.ok($('url-history').textContent.includes('design.'+format));
  $('open-text').click();$('source-text').value=md;await $('source-submit').onclick();await wait(()=>$('source-dialog').hidden,'other document opens');
  const before=requests.length;$('url-history').querySelector('button').click();
  await wait(()=>!$('open-url').disabled&&requests.length>before,'history request completes');
  assert.equal(w.document.querySelectorAll('.node').length,expected,'history reloads the same MD/JSON document');
  assert.ok(!$('status-text').textContent.includes('履歴のURLを開けません'),'JSON MIME is accepted on history too');
  assert.equal($('url-history').querySelectorAll('button').length,1,'history is deduplicated');
  response='{broken';$('open-text').click();$('source-text').value=md;await $('source-submit').onclick();await wait(()=>$('source-dialog').hidden,'leave history document');
  const nodes=$('nodes').innerHTML;$('url-history').querySelector('button').click();await wait(()=>$('status-text').textContent.includes('履歴のURLを開けません'),'invalid history reported');assert.equal($('nodes').innerHTML,nodes,'failure retains the previous display');
  assert.ok(requests.every(r=>r.opts.method==='GET'&&r.opts.credentials==='omit'));
 }finally{w.close();}
}
console.log('MD/JSON File, URL, text -> typed viewing JSON -> common model; actual new/history routes; JSON MIME; history deduplication; invalid history keeps display');
