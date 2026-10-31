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
const original=JSON.parse(sourceBytes),oldPreview=JSON.parse(previewBytes),preview=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v3-beta-function-preview.json','utf8'));validate(original);validate(oldPreview);validate(preview);
assert.deepEqual(oldPreview.documents.slice(0,original.documents.length),original.documents);assert.deepEqual(oldPreview.sources,original.sources);
const demo=oldPreview.documents.find(d=>d.id==='purchase-checks-preview');assert(demo);assert(demo.items.every(i=>i.reviewState==='未レビュー'));assert.equal(demo.basedOn.verification,'unverified');covered.add('SPEC-EXAMPLE-003');
const mixed=structuredClone(preview);mixed.documents.push(demo);validate(mixed);
const bd=original.documents.find(d=>d.kind==='businessDesign'),concept=original.documents.find(d=>d.kind==='conceptModel');
const id=name=>bd.activities.find(a=>a.name===name).id,apply=id('備品購入を申請する'),handoff=id('購入を準備する'),approve=id('購入申請を承認する');
const fn=(a,g,c)=>`fn:${a}:${g}:${c}`,draft=fn(apply,'group-request','save-draft'),batch=fn(handoff,'group-handoff','prepare-approved-requests'),approval=fn(approve,'group-decision','approve-current-version');
const sample=concept.reviewGroups.find(g=>g.id==='group-handoff').capabilities.flatMap(c=>c.samples).find(s=>s.id==='handoff-batch');
async function bundle(raw){return (await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text','.json':'text'},plugins:[{name:'purchase-sample',setup(b){b.onLoad({filter:/business-design\.json$/},()=>({contents:raw,loader:'text'}));}}]})).outputFiles[0].text;}
const [withChecks,withoutChecks]=await Promise.all([bundle(JSON.stringify(mixed)),bundle(JSON.stringify(preview))]),windows=[];
async function open(code){const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/spec-purchase',runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLElement.prototype.setPointerCapture=()=>{};w.eval(code);const $=s=>w.document.querySelector(s),until=async fn=>{for(let i=0;i<400&&!fn();i++)await new Promise(r=>setTimeout(r,10));assert.ok(fn(),'expected app state');};await until(()=>!$('#open').disabled);$('#open-sample').click();await until(()=>w.document.querySelectorAll('.node').length>0&&!!$('[data-explorer-key="group:tests"]'));return {w,$,entry:key=>$('[data-explorer-key="'+key+'"]')};}
try{
 const app=await open(withChecks);app.entry('tests:checks:'+handoff).click();assert.match(app.$('#tests-workspace').textContent,/承認済み申請をまとめて購入対象にする/);
 app.entry('tests:'+batch).click();const main=app.$('#tests-workspace');assert.equal(main.querySelector('[data-data-example]').dataset.dataExample,'handoff-batch');assert.doesNotMatch(main.textContent,/PREVIEW-02/,'the example is not assigned to a Check without a reference');
 const actual=[...main.querySelectorAll('td')],colored=actual.filter(c=>c.dataset.sampleKey),expected=sample.blocks.flatMap(block=>block.rows.flatMap(row=>block.columns.map(col=>row.cells.find(cell=>cell.columnId===col.id)?.linkId).filter(Boolean)));
 assert.deepEqual(colored.map(c=>c.dataset.sampleKey),expected,'only explicit Link IDs determine colored cells');const tones=new Map();for(const td of colored){const key=td.dataset.sampleKey,tone=td.dataset.keyTone;if(tones.has(key))assert.equal(tones.get(key),tone);else tones.set(key,tone);}assert(tones.size>=5);assert.equal(new Set(tones.values()).size,tones.size,'different Link IDs are distinguishable inside the example');covered.add('SPEC-EXAMPLE-002');
 app.entry('tests:'+draft).click();const picker=app.$('#tests-workspace .data-example-picker select');picker.value='request-draft-approved';picker.dispatchEvent(new app.w.Event('change'));assert.equal(app.$('#tests-workspace [data-data-example]').dataset.dataExample,'request-draft-approved');app.entry('tests:'+approval).click();assert.match(app.$('#tests-workspace').textContent,/提出された内容を承認する/);assert.doesNotMatch(app.$('#tests-workspace').textContent,/購入対象の確定/);covered.add('SPEC-EXAMPLE-004');
 const plain=await open(withoutChecks);assert.equal(plain.entry('group:tests').disabled,false);plain.entry('tests:'+batch).click();assert.match(plain.$('#tests-workspace').textContent,/チェック項目はまだありません/);assert.equal(plain.$('#tests-workspace [data-data-example]').dataset.dataExample,'handoff-batch');covered.add('SPEC-EXAMPLE-001');
 assert.deepEqual([...covered].sort(),checks.map(c=>c.id).sort());assert.equal(hash(readFileSync(authorityPath)),expectedAuthority);assert.equal(hash(readFileSync(sourcePath)),hash(sourceBytes));
 console.log(JSON.stringify({passed:[...covered],sourceUnchanged:true,scope:'actual app DOM; visual rendering and full CI remain separate'}));
}finally{for(const w of windows)w.close();}
