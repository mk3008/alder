import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {validate} from '../../tools/document_storage/core.mjs';

const authorityPath='verification/test-spec-examples-prototype.check-items.json',expectedAuthority='b59cfbd50c6c94f43c1aa2e1b6517b81bd446468744298a1eef7f26214a57f1c';
const sourcePath='../work/concept-review/issue-133/versions/purchase-v3-beta.json',previewPath='../work/concept-review/issue-133/versions/purchase-v3-beta-test-spec-preview.json';
const hash=b=>createHash('sha256').update(b).digest('hex'),authority=readFileSync(authorityPath),sourceBytes=readFileSync(sourcePath),previewBytes=readFileSync(previewPath);
assert.equal(hash(authority),expectedAuthority);assert.equal(hash(sourceBytes),'b3dfb5aa699026d748969671a4d9efee9523aa354e34a30bbc2f81447bae46f4');
const checks=JSON.parse(authority).checks,covered=new Set();assert.deepEqual(checks.map(c=>c.id),['SPEC-EXAMPLE-001','SPEC-EXAMPLE-002','SPEC-EXAMPLE-003','SPEC-EXAMPLE-004']);
const original=JSON.parse(sourceBytes),preview=JSON.parse(previewBytes);validate(original);validate(preview);
assert.deepEqual(preview.documents.slice(0,original.documents.length),original.documents);assert.deepEqual(preview.sources,original.sources);
const demo=preview.documents.find(d=>d.id==='purchase-checks-preview');assert(demo);assert(demo.items.every(i=>i.reviewState==='未レビュー'));assert.equal(demo.basedOn.verification,'unverified');covered.add('SPEC-EXAMPLE-003');
const bd=original.documents.find(d=>d.kind==='businessDesign'),concept=original.documents.find(d=>d.kind==='conceptModel');
const handoff=bd.activities.find(a=>a.name==='購入を準備する').id,approve=bd.activities.find(a=>a.name==='購入申請を承認する').id;
const sample=concept.reviewGroups.find(g=>g.id==='group-handoff').capabilities.flatMap(c=>c.samples).find(s=>s.id==='handoff-batch');
async function bundle(raw){return (await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text','.json':'text'},plugins:[{name:'purchase-sample',setup(b){b.onLoad({filter:/business-design\.json$/},()=>({contents:raw,loader:'text'}));}}]})).outputFiles[0].text;}
const [withPreview,withoutCheck]=await Promise.all([bundle(String(previewBytes)),bundle(String(sourceBytes))]),windows=[];
async function open(code){const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/spec-purchase',runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLElement.prototype.setPointerCapture=()=>{};w.eval(code);const $=s=>w.document.querySelector(s),until=async fn=>{for(let i=0;i<400&&!fn();i++)await new Promise(r=>setTimeout(r,10));assert.ok(fn(),'expected app state');};await until(()=>!$('#open').disabled);$('#open-sample').click();await until(()=>w.document.querySelectorAll('.node').length>0&&!!$('[data-explorer-key="group:tests"]'));return {w,$,entry:key=>$('[data-explorer-key="'+key+'"]')};}
try{
 const app=await open(withPreview);app.entry('tests:'+handoff).click();const main=app.$('#tests-workspace');assert.match(main.textContent,/PREVIEW-02/);assert.match(main.textContent,/関連するデータ例/);assert.match(main.textContent,/購入対象の確定・引渡し/);assert.equal(main.querySelector('[data-data-example]').dataset.dataExample,'handoff-batch');
 const actual=[...main.querySelectorAll('td')],colored=actual.filter(c=>c.dataset.sampleKey),expected=sample.blocks.flatMap(block=>block.rows.flatMap(row=>block.columns.map(col=>row.cells.find(cell=>cell.columnId===col.id)?.linkId).filter(Boolean)));
 assert.deepEqual(colored.map(c=>c.dataset.sampleKey),expected,'only explicit Link IDs determine colored cells');const tones=new Map();for(const td of colored){const id=td.dataset.sampleKey,tone=td.dataset.keyTone;if(tones.has(id))assert.equal(tones.get(id),tone);else tones.set(id,tone);}assert(tones.size>=5);assert.equal(new Set(tones.values()).size,tones.size,'different Link IDs are distinguishable inside the example');covered.add('SPEC-EXAMPLE-002');
 const picker=main.querySelector('.data-example-picker select');picker.value='handoff-retry';picker.dispatchEvent(new app.w.Event('change'));assert.equal(app.$('#tests-workspace [data-data-example]').dataset.dataExample,'handoff-retry');app.entry('tests:'+approve).click();assert.match(app.$('#tests-workspace').textContent,/購入可否の判断/);assert.doesNotMatch(app.$('#tests-workspace').textContent,/購入対象の確定・引渡し/);covered.add('SPEC-EXAMPLE-004');
 const plain=await open(withoutCheck);assert.equal(plain.entry('group:tests').disabled,false);plain.entry('tests:'+handoff).click();assert.match(plain.$('#tests-workspace').textContent,/Check Itemはありません/);assert.match(plain.$('#tests-workspace').textContent,/関連するデータ例/);assert.equal(plain.$('#tests-workspace [data-data-example]').dataset.dataExample,'handoff-batch');covered.add('SPEC-EXAMPLE-001');
 assert.deepEqual([...covered].sort(),checks.map(c=>c.id).sort());assert.equal(hash(readFileSync(authorityPath)),expectedAuthority);assert.equal(hash(readFileSync(sourcePath)),hash(sourceBytes));
 console.log(JSON.stringify({passed:[...covered],sourceUnchanged:true,scope:'actual app DOM; visual rendering and full CI remain separate'}));
}finally{for(const w of windows)w.close();}
