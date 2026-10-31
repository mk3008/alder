import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {validate} from '../../tools/document_storage/core.mjs';

const authorityPath='verification/test-spec-prototype.check-items.json';
const authorityHash='2a5e41195133d734eea7f36fc27598807104bd9bc9e48534c3f555a283c8b95d';
const frozen=readFileSync(authorityPath),digest=bytes=>createHash('sha256').update(bytes).digest('hex');
assert.equal(digest(frozen),authorityHash);
const authority=JSON.parse(frozen),covered=new Set();
assert.deepEqual(authority.checks.map(c=>c.id),['SPEC-PROTOTYPE-001','SPEC-PROTOTYPE-002','SPEC-PROTOTYPE-003','SPEC-PROTOTYPE-004','SPEC-PROTOTYPE-005']);
for(const c of authority.checks)for(const name of ['condition','guarantee','reason','verification'])assert(c[name]);
const raw=readFileSync('../business-design/alder/business-design.json','utf8'),pkg=JSON.parse(raw);
const bd=pkg.documents.find(d=>d.kind==='businessDesign'),checks=pkg.documents.find(d=>d.kind==='checkItems');
const first=bd.activities.find(a=>a.name==='業務設計'),second=bd.activities.find(a=>a.name==='検査項目の設計');
const shared=JSON.parse(readFileSync('../work/plugin-json/issue-273/snapshots/04-final-after-replay.json','utf8')),sharedBD=shared.documents.find(d=>d.kind==='businessDesign'),sharedChecks=shared.documents.find(d=>d.kind==='checkItems');
validate(shared);
const sharedId=sharedChecks.index.flatMap(row=>row.checkIds).find(id=>sharedChecks.index.filter(row=>row.checkIds.includes(id)).length>1),sharedItem=sharedChecks.items.find(item=>item.id===sharedId),sharedRows=sharedChecks.index.filter(row=>row.checkIds.includes(sharedId));
assert(sharedItem&&sharedRows.length>=2,'the existing fixture contains a Check shared by multiple Activities');
const withoutChecks=JSON.parse(readFileSync('../work/viewer-json/issue-274/json-native/independent.json','utf8'));validate(withoutChecks);
async function bundle(sample){return (await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text','.json':'text'},plugins:sample?[{name:'prototype-sample',setup(b){b.onLoad({filter:/business-design\.json$/},()=>({contents:sample,loader:'text'}));}}]:[]})).outputFiles[0].text;}
const base=await bundle(),sharedCode=await bundle(JSON.stringify(shared)),emptyCode=await bundle(JSON.stringify(withoutChecks));
const windows=[];
async function open(code){
 const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/spec',runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);
 w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLElement.prototype.setPointerCapture=()=>{};
 w.eval(code);const $=selector=>w.document.querySelector(selector),until=async fn=>{for(let i=0;i<400&&!fn();i++)await new Promise(r=>setTimeout(r,10));assert.ok(fn(),'expected app state');};
 await until(()=>!$('#open').disabled);$('#open-sample').click();await until(()=>w.document.querySelectorAll('.node').length>0&&!!$('[data-explorer-key="group:tests"]'));
 return {w,$,until,entry:key=>$('[data-explorer-key="'+key+'"]')};
}
try{
 const app=await open(base),{$,entry}=app;
 assert.equal([...app.w.document.querySelectorAll('.explorer-parent')].at(-1).textContent,'テスト仕様');
 entry('tests:@overview').click();assert.equal($('#tests-workspace').hidden,false);assert.match($('.test-spec-content').textContent,/業務設計/);covered.add('SPEC-PROTOTYPE-001');
 entry('tests:'+first.id).click();const firstItem=$('[data-check-id="SAMPLE-01"]');assert(firstItem);assert.match(firstItem.textContent,/条件/);assert.match(firstItem.textContent,/期待結果/);assert.match(firstItem.textContent,/未レビュー/);covered.add('SPEC-PROTOTYPE-002');
 $('#drawer').click();assert($('#test-spec-related').hidden);firstItem.querySelector('button').click();assert($('#test-spec-related').hidden,'selection does not reopen the global drawer');$('#drawer').click();assert.equal($('#test-spec-related').hidden,false);assert.match($('#test-spec-related').textContent,/業務設計/);covered.add('SPEC-PROTOTYPE-003');
 const missing=bd.activities.find(a=>!checks.index.some(row=>row.activityId===a.id));entry('tests:'+missing.id).click();assert.match($('#tests-workspace').textContent,/テスト仕様はありません/);covered.add('SPEC-PROTOTYPE-005');
 const empty=await open(emptyCode);assert.equal(empty.entry('group:tests').disabled,true,'a document with no Check does not appear complete');
 const cross=await open(sharedCode);cross.entry('tests:'+sharedRows[0].activityId).click();const a=cross.$('[data-check-id="'+sharedItem.checkId+'"]').textContent;assert.match(a,/一般保証/,'a shared guarantee remains reachable from the item');cross.entry('tests:'+sharedRows[1].activityId).click();const b=cross.$('[data-check-id="'+sharedItem.checkId+'"]').textContent;assert.equal(a,b);cross.$('[data-check-id="'+sharedItem.checkId+'"] button').click();for(const row of sharedRows)assert(cross.$('#test-spec-related').textContent.includes(sharedBD.activities.find(activity=>activity.id===row.activityId).name));covered.add('SPEC-PROTOTYPE-004');
 const exampleActivity=sharedChecks.sections.find(section=>sharedChecks.guarantees.some(g=>g.sectionId===section.id&&g.blocks.some(block=>block.kind==='example'))).activityId;cross.entry('tests:'+exampleActivity).click();await cross.until(()=>!!cross.$('.test-spec-content .json-example table'));assert.match(cross.$('.test-spec-content').textContent,/返却予定日/,'shared example is visible in the main content');
 assert.deepEqual([...covered].sort(),authority.checks.map(c=>c.id).sort());assert.equal(digest(readFileSync(authorityPath)),authorityHash);
 console.log(JSON.stringify({authority:authorityPath,sha256:authorityHash,passed:[...covered],scope:'actual app DOM; visual rendering and full CI not checked'}));
}finally{for(const w of windows)w.close();}
