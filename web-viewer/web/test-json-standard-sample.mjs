import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {convertMarkdown} from '../../tools/document_storage/convert.mjs';
import {parseStrict,validate} from '../../tools/document_storage/core.mjs';
import {parseDocument} from '../src/document-input.ts';
import {sampleLayoutForDesign} from '../src/sample-layout.ts';

const path='../business-design/alder/business-design.json';
const authority=readFileSync('verification/json-standard-sample.check-items.json');
assert.equal(createHash('sha256').update(authority).digest('hex'),'00f3bed7e4623fb4f0bd4befdb977e7f9a460a2d52667cf2264854a3972e7510');
assert.deepEqual(JSON.parse(authority).checks.map(c=>c.id),['STANDARD-SAMPLE-001','STANDARD-SAMPLE-002','STANDARD-SAMPLE-003','STANDARD-SAMPLE-004']);
const raw=readFileSync(path,'utf8'),legacy=readFileSync('../business-design/alder/README.md','utf8');
const legacyChecks=readFileSync('src/samples/alder-checks.md','utf8');
const pkg=parseStrict(raw);validate(pkg);
const bd=pkg.documents.find(d=>d.kind==='businessDesign'),checks=pkg.documents.find(d=>d.kind==='checkItems');
assert.equal(pkg.formatVersion,'0.4');assert.equal(bd.id,'alder-design');
assert.equal(checks.basedOn.documentId,bd.id);assert.equal(checks.basedOn.revision,bd.revision);assert.equal(checks.basedOn.verification,'unverified');
assert.deepEqual(checks.items.map(i=>[i.checkId,i.reviewState]),[['SAMPLE-01','未レビュー'],['SAMPLE-02','未レビュー']]);
assert.match(bd.preface,/レビューを待つ草案/);assert.match(bd.preface,/一つのJSON/);
const sourceURI='https://github.com/mk3008/alder/blob/304e7d4e82fe7087193012511a437a3c726ce7c2/business-design/alder/README.md';
const converted=convertMarkdown({revision:pkg.revision,roleCatalog:true,sources:[
 {text:legacy,documentId:bd.id,kind:'businessDesign',revision:bd.revision,uri:sourceURI},
 {text:legacyChecks,documentId:checks.id,kind:'checkItems',revision:checks.revision,basedOn:{documentId:bd.id,revision:bd.revision}}
]}).package;
const before=converted.documents.find(d=>d.kind==='businessDesign'),oldChecks=converted.documents.find(d=>d.kind==='checkItems');
const expectedPreface=before.preface.replace('見出しの業務名・Object名と、Input / Outputに書いたObject名から接続を読み取る。人間がヒアリング結果をまとめ、単独でも読み書き・保守できる文書とし、AIも同じ表面上の情報を編集して協業する。IconはAIが提案しても、人間が変更してもよい。非表示のIDや機械専用の注釈は管理しない。生成JSONは手で編集しない。','Activity・Objectと、そのInput / Outputの参照から接続を読み取る。業務設計書と検査項目は一つのJSONに保持し、ID・参照・版はPluginが管理する。人間はViewerで業務の内容を確認し、AIに作成・更新を依頼する。Iconは提案や指示により変更できる。');
before.preface=expectedPreface;
before.activities.find(a=>a.name==='業務設計').procedure=before.activities.find(a=>a.name==='業務設計').procedure.replace('5W1H + Input / Output / Resultの形式で業務設計書の業務要件と期待結果を作成・更新する。','5W1H + Input / Output / Resultの形式で業務要件と期待結果を整理し、Pluginに依頼して業務設計書のJSONを作成・更新する。');
before.activities.find(a=>a.name==='検査項目の設計').procedure=before.activities.find(a=>a.name==='検査項目の設計').procedure.replace('直接編集した場合も対応関係を確認する。','更新後も対応関係を確認する。');
for(const item of oldChecks.intro)if(item.kind==='link'&&item.uri==='https://github.com/mk3008/alder/blob/main/business-design/alder/README.md')item.uri='https://github.com/mk3008/alder/blob/main/business-design/alder/business-design.json';
assert.deepEqual(bd,before,'only the requested JSON workflow wording changes');
assert.deepEqual(checks,oldChecks,'existing unreviewed examples and references are retained');
assert.deepEqual(pkg.sources,converted.sources);assert.deepEqual(pkg.diagnostics,converted.diagnostics);

const design=parseDocument(raw),old=parseDocument(legacy);
assert.equal(design.sourceFormat,'json');assert.equal(design.graph.nodes.length,25);assert.equal(design.graph.relations.length,63);
const namedGraph=d=>{const names=new Map(d.graph.nodes.map(n=>[n.id,n.name]));return d.graph.relations.map(r=>[r.kind,names.get(r.from),names.get(r.to),r.label].join('\u0000')).sort();};
assert.deepEqual(namedGraph(design),namedGraph(old),'all business relationships survive ID migration');
const designActivity=design.graph.nodes.find(n=>n.name==='業務設計'),oldActivity=old.graph.nodes.find(n=>n.name==='業務設計');
const mapped=sampleLayoutForDesign({positions:{[oldActivity.id]:[12,34]},selected:oldActivity.id,hiddenNodes:[oldActivity.id],scroll:[4,5],zoom:1},design);
assert.deepEqual(mapped.positions[designActivity.id],[12,34]);assert.equal(mapped.selected,designActivity.id);assert.deepEqual(mapped.hiddenNodes,[designActivity.id]);

const bundle=async legacySample=>(await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text','.json':'text'},plugins:legacySample?[{name:'old-sample',setup(b){b.onLoad({filter:/business-design\.json$/},()=>({contents:legacy,loader:'text'}));}}]:[]})).outputFiles[0].text;
const code=await bundle(false),legacyCode=await bundle(true),windows=[];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function until(predicate){for(let i=0;i<200&&!predicate();i++)await sleep(15);assert.ok(predicate(),'expected application state');}
function env(db=new IDBFactory(),script=code){const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);w.indexedDB=db;w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;let fetches=0;w.fetch=()=>{fetches++;throw Error('Unexpected network');};w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};w.eval(script);return {w,$:id=>w.document.getElementById(id),fetches:()=>fetches};}
async function ready(e){await until(()=>!e.$('open').disabled);e.$('layout-lock').click();return e;}
function select(e,id){const node=[...e.w.document.querySelectorAll('.node')].find(n=>n.dataset.node===id);assert.ok(node);node.onpointerdown({button:0,clientX:0,clientY:0,pointerId:1,stopPropagation(){}});node.onpointerup({pointerId:1});}
try{
 const e=await ready(env());assert.match(e.$('opening-guide').textContent,/JSON形式/);assert.match(e.$('authoring-guide').textContent,/JSONの草案/);
 e.$('open-sample').click();await until(()=>e.w.document.querySelectorAll('.node').length===25);
 e.$('view-markdown').click();assert.equal(e.$('source-text').value,raw);assert.match(e.$('source-title').textContent,/JSON/);await e.$('source-cancel').onclick();
 select(e,designActivity.id);e.$('detail-mode-checks').click();assert.ok(e.$('detail').querySelector('[data-check-id="SAMPLE-01"]'),e.$('detail').textContent+' / selected='+e.w.document.querySelector('.node.selected')?.dataset.node);assert.equal(e.$('open-checks').hidden,true);
 const key=e.w.document.querySelector('.tab').dataset.key;e.$('open-sample-menu').click();assert.equal(e.w.document.querySelector('.tab').dataset.key,key);assert.equal(e.fetches(),0);

 const db=new IDBFactory(),legacyApp=await ready(env(db,legacyCode));legacyApp.$('open-sample').click();await until(()=>legacyApp.w.document.querySelectorAll('.node').length===25);
 legacyApp.$('check-open-sample').click();await until(()=>legacyApp.$('app').dataset.saveState==='saved');select(legacyApp,oldActivity.id);
 assert.ok(legacyApp.$('detail-mode-checks'));legacyApp.$('detail-mode-checks').click();assert.ok(legacyApp.$('detail').querySelector('[data-check-id="SAMPLE-01"]'));
 await sleep(300);legacyApp.w.close();
 const restored=await ready(env(db));restored.$('view-markdown').click();assert.equal(restored.$('source-text').value,legacy,'legacy source is not replaced on restore');await restored.$('source-cancel').onclick();
 restored.$('detail-mode-checks').click();assert.ok(restored.$('detail').querySelector('[data-check-id="SAMPLE-01"]'),'legacy attached checks survive restore');
 await restored.$('open-sample').onclick({preventDefault(){}});await until(()=>restored.w.document.querySelector(`[data-node="${designActivity.id}"]`));
 assert.equal(restored.w.document.querySelector('.node.selected')?.dataset.node,designActivity.id,'explicit switch maps legacy selection by unique name');
 restored.$('view-markdown').click();assert.equal(restored.$('source-text').value,raw);assert.equal(restored.fetches(),0);
 console.log('STANDARD-SAMPLE-001..004: JSON sample, preserved business/check content, legacy restore and JSON-first guidance passed');
}finally{windows.forEach(w=>w.close());}
