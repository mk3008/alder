import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {validate} from '../../tools/document_storage/core.mjs';

const authPath='verification/test-spec-function-menu.check-items.json',authHash='9346d5184f76eb9af0acfc843682df0a7c45fcfff40c732ee8f1c9cb7c4ba10a';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex'),authority=readFileSync(authPath),sourceBytes=readFileSync('../work/concept-review/issue-133/versions/purchase-v3-beta.json');
assert.equal(hash(authority),authHash);assert.equal(hash(sourceBytes),'b3dfb5aa699026d748969671a4d9efee9523aa354e34a30bbc2f81447bae46f4');
const authorityIds=JSON.parse(authority).checks.map(item=>item.id),covered=new Set();assert.deepEqual(authorityIds,Array.from({length:7},(_,i)=>'FUNCTION-MENU-00'+(i+1)));
const original=JSON.parse(sourceBytes),preview=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v3-beta-function-preview.json','utf8'));
validate(original);validate(preview);
const withoutNavigation=structuredClone(preview),conceptOf=p=>p.documents.find(d=>d.kind==='conceptModel');
for(const view of conceptOf(withoutNavigation).presentation.activityViews)delete view.testSpecificationFunctions;
assert.deepEqual(withoutNavigation,original,'preview changes only explicit presentation navigation');
assert(!preview.documents.some(d=>d.kind==='checkItems'),'the purchase preview must not fabricate formal checks');
const bd=preview.documents.find(d=>d.kind==='businessDesign'),concept=conceptOf(preview),activity=name=>bd.activities.find(a=>a.name===name).id;
const apply=activity('備品購入を申請する'),handoff=activity('購入を準備する'),approve=activity('購入申請を承認する');
const key=(activityId,groupId,capabilityId)=>`fn:${activityId}:${groupId}:${capabilityId}`;
const draft=key(apply,'group-request','save-draft'),submit=key(apply,'group-request','submit-request'),batch=key(handoff,'group-handoff','prepare-approved-requests'),retry=key(handoff,'group-handoff','reexport-fixed-preparation');
const oldDemo=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v3-beta-test-spec-preview.json','utf8'));
const both=structuredClone(preview);both.documents.push(oldDemo.documents.find(d=>d.kind==='checkItems'));validate(both);
const shared=JSON.parse(readFileSync('../work/plugin-json/issue-273/snapshots/04-final-after-replay.json','utf8'));validate(shared);
async function bundle(raw){return (await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text','.json':'text'},plugins:[{name:'fixture',setup(b){b.onLoad({filter:/business-design\.json$/},()=>({contents:JSON.stringify(raw),loader:'text'}));}}]})).outputFiles[0].text;}
const [previewCode,bothCode,sharedCode,originalCode]=await Promise.all([bundle(preview),bundle(both),bundle(shared),bundle(original)]),windows=[];
async function open(code){
 const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/functions',runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);
 w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLElement.prototype.setPointerCapture=()=>{};
 w.eval(code);const $=selector=>w.document.querySelector(selector),until=async fn=>{for(let i=0;i<500&&!fn();i++)await new Promise(r=>setTimeout(r,10));assert.ok(fn(),'expected app state');};
 await until(()=>!!$('#open')&&!$('#open').disabled);$('#open-sample').click();await until(()=>w.document.querySelectorAll('.node').length>0&&!!$('[data-explorer-key="group:tests"]'));
 return {w,$,until,entry:key=>$('[data-explorer-key="'+key+'"]')};
}
try{
 const app=await open(previewCode),{$,entry}=app;
 assert.equal([...app.w.document.querySelectorAll('.explorer-parent')].at(-1).textContent,'テスト仕様');
 const applyGroup=entry('group:tests-activity-'+apply);assert(applyGroup);if(applyGroup.getAttribute('aria-expanded')==='false')applyGroup.click();
 assert.equal(entry('tests:'+draft).textContent,'下書き保存');assert.equal(entry('tests:'+submit).textContent,'提出');
 assert.equal(entry('tests:'+key(approve,'group-request','save-draft')),null,'no inferred cross-activity association');
 assert(!$('#explorer-tests').textContent.includes('正常系'));assert(!$('#explorer-tests').textContent.includes('例外系'));covered.add('FUNCTION-MENU-001');
 entry('tests:'+draft).click();const main=()=>$('#tests-workspace'),picker=()=>main().querySelector('.data-example-picker select');
 assert.match(main().textContent,/入力途中の内容を保存する/);assert.match(main().textContent,/品目数・申請の状態を問わず/);
 assert.deepEqual([...picker().options].map(o=>o.textContent),['品目がない下書き','入力途中の下書き','承認後に下書きを保存','購入準備後に下書きを保存']);
 assert.equal(main().querySelector('[data-data-example]').dataset.dataExample,'request-draft-empty');
 picker().value='request-draft';picker().dispatchEvent(new app.w.Event('change'));assert.equal(main().querySelector('[data-data-example]').dataset.dataExample,'request-draft');
 app.w.history.back();await app.until(()=>main().querySelector('[data-data-example]')?.dataset.dataExample==='request-draft-empty');
 entry('tests:'+submit).click();assert.deepEqual([...picker().options].map(o=>o.textContent),['2品目をまとめて提出']);assert.doesNotMatch(main().textContent,/入力途中の下書き/);covered.add('FUNCTION-MENU-002');
 const text=main().textContent;assert.doesNotMatch(text,/原典の意味対応|unverified|Check preview|purchase-concepts|人間レビュー状態|同じ色は同じ対象/);covered.add('FUNCTION-MENU-003');
 entry('tests:'+batch).click();assert.equal(main().querySelector('[data-data-example]').dataset.dataExample,'handoff-batch');assert.deepEqual([...picker().options].map(o=>o.textContent),['2申請をまとめて購入へ']);
 const sourceSample=concept.reviewGroups.find(g=>g.id==='group-handoff').capabilities.find(c=>c.id==='prepare-approved-requests').samples[0];
 const cells=[...main().querySelectorAll('td[data-sample-key]')],expected=sourceSample.blocks.flatMap(b=>b.rows.flatMap(row=>b.columns.map(col=>row.cells.find(c=>c.columnId===col.id)?.linkId).filter(Boolean)));
 assert.deepEqual(cells.map(c=>c.dataset.sampleKey),expected);const tones=new Map();for(const cell of cells){const id=cell.dataset.sampleKey,tone=cell.dataset.keyTone;if(tones.has(id))assert.equal(tones.get(id),tone);else tones.set(id,tone);}assert(tones.size>=5);assert.equal(new Set(tones.values()).size,tones.size);covered.add('FUNCTION-MENU-004');
 entry('tests:'+retry).click();assert.deepEqual([...picker().options].map(o=>o.textContent),['CSV失敗後も同じ内容を再出力']);
 const mixed=await open(bothCode);assert(mixed.entry('tests:checks:'+apply));mixed.entry('tests:'+draft).click();assert.doesNotMatch(mixed.$('#tests-workspace').textContent,/PREVIEW-01|保存を選んだ場合に/);mixed.entry('tests:checks:'+apply).click();assert.match(mixed.$('#tests-workspace').textContent,/下書き/);assert.doesNotMatch(mixed.$('#tests-workspace').textContent,/PREVIEW-01|unverified|Check preview/);
 const cross=await open(sharedCode),checkDoc=shared.documents.find(d=>d.kind==='checkItems'),sharedItem=checkDoc.items.find(i=>i.checkId==='CI-003'),refs=checkDoc.index.filter(row=>row.checkIds.includes(sharedItem.id));assert.equal(refs.length,2);
 cross.entry('tests:checks:'+refs[0].activityId).click();const first=cross.$('#tests-workspace [data-check-id="CI-003"]').outerHTML;cross.entry('tests:checks:'+refs[1].activityId).click();assert.equal(cross.$('#tests-workspace [data-check-id="CI-003"]').outerHTML,first);covered.add('FUNCTION-MENU-005');
 const plain=await open(originalCode);assert(plain.entry('tests:fn:_:group-request:save-draft'));assert.equal(plain.entry('tests:fn:_:group-request:save-draft').textContent,'入力途中の内容を保存する');
 assert.equal(hash(readFileSync('../work/concept-review/issue-133/versions/purchase-v3-beta.json')),hash(sourceBytes));covered.add('FUNCTION-MENU-006');
 entry('business:'+apply).click();if($('#formattedMarkdownDrawer').hidden)$('#drawer').click();entry('tests:'+draft).click();entry('tests:'+submit).click();entry('tests:'+draft).click();assert.equal(main().querySelector('[data-data-example]').dataset.dataExample,'request-draft-empty');entry('business:'+apply).click();assert.equal($('#formattedMarkdownDrawer').hidden,false,'test navigation leaves global drawer preference intact');covered.add('FUNCTION-MENU-007');
 assert.deepEqual([...covered].sort(),authorityIds.sort());assert.equal(hash(readFileSync(authPath)),authHash);
 console.log(JSON.stringify({passed:[...covered],scope:'actual app DOM; mobile and full CI remain separate'}));
}finally{for(const w of windows)w.close();}
