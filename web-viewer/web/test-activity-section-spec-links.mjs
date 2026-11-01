import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';

const authorityPath='verification/activity-section-spec-links.check-items.json',authorityHash='ed16ed2dee866934f58a005e30b66a4ebf6c816c669b61652bac663a094c0ff7';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const verify=()=>assert.equal(hash(readFileSync(authorityPath)),authorityHash);verify();
const inputPath='../work/concept-review/issue-133/versions/purchase-v8-testability-reference-draft.json',input=readFileSync(inputPath),pkg=JSON.parse(input);
const business=pkg.documents.find(doc=>doc.kind==='businessDesign'),model=pkg.documents.find(doc=>doc.kind==='conceptModel'),checks=pkg.documents.find(doc=>doc.kind==='checkItems');
const old=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v7-value-independent-review.json'));
assert.deepEqual(checks.items.map(({id,checkId,reviewState})=>({id,checkId,reviewState})),old.documents.find(doc=>doc.kind==='checkItems').items.map(({id,checkId,reviewState})=>({id,checkId,reviewState})));
const reexport=checks.examples.find(e=>e.id==='decision-reexport-fixed-preparation-table');assert.deepEqual(reexport.columns,['購入準備番号','対象の購入準備','結果','Check ID']);assert.equal(reexport.rows[0][0][0].value,'指定あり');assert.equal(reexport.rows[0][1][0].value,'確定済み');assert.equal(reexport.rows[1][2][0].value,'要確認');assert(!JSON.stringify(reexport).includes('失敗・紛失'));
const race=checks.examples.find(e=>e.id==='decision-prepare-race-table');assert.deepEqual(race.columns,['申請状態','購入準備','結果','Check ID']);
const code=(await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}})).outputFiles[0].text;
async function open(source){const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/section-links',runScripts:'outside-only',pretendToBeVisual:true}).window;w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLElement.prototype.setPointerCapture=()=>{};const $=s=>w.document.querySelector(s),until=async fn=>{for(let i=0;i<800;i++){if(fn())return;await new Promise(r=>setTimeout(r,5));}throw Error('Viewer did not become ready');};w.eval(code);await until(()=>$('#open')&&!$('#open').disabled);$('#open-text').click();$('#source-text').value=JSON.stringify(source);await $('#source-submit').onclick();await until(()=>['saved','unchanged'].includes($('#app').dataset.saveState));return{w,$,until};}
const prepare=business.activities.find(a=>a.name==='購入を準備する'),csv=business.exceptions.find(e=>e.name==='CSV再出力'),collision=business.exceptions.find(e=>e.name==='購入準備競合');
const prepareKey=`fn:${prepare.id}:group-handoff:prepare-approved-requests`,exportKey=`fn:${prepare.id}:group-handoff:reexport-fixed-preparation`;
const select=app=>app.$(`[data-explorer-key="business:${prepare.id}"]`).click();
const labels=element=>[...element.querySelectorAll('[data-related-spec]')].map(b=>b.dataset.relatedSpec);
const app=await open(pkg);try{select(app);const {$}=app,root=$('#detail');const result=root.querySelector('[data-business-result]').nextElementSibling;
 assert.deepEqual(labels(result),['decision:'+prepareKey,prepareKey]);
 const csvLinks=root.querySelector(`[data-business-exception="${csv.id}"]`).nextElementSibling;assert.deepEqual(labels(csvLinks),['decision:'+exportKey,exportKey]);
 const collisionLinks=root.querySelector(`[data-business-exception="${collision.id}"]`).nextElementSibling;assert.deepEqual(labels(collisionLinks),['decision:'+prepareKey]);assert(!collisionLinks.textContent.includes('未作成'));
 assert.equal(root.querySelector('.shell-test-links'),null,'mapped functions are not repeated at the bottom');
 csvLinks.querySelector('[data-related-spec="decision:'+exportKey+'"]').click();assert.equal(new URL(app.w.location.href).searchParams.get('spec'),'decision:'+exportKey);assert.equal(app.$('#tests-workspace').hidden,false);
}finally{app.w.close();}
// An explicit assessment of a missing spec differs from an absent mapping.
for(const explicit of [true,false]){const copy=structuredClone(pkg),view=copy.documents.find(d=>d.kind==='conceptModel').presentation.activityViews.find(v=>v.activityId===prepare.id),ref=view.testSpecificationFunctions.find(f=>f.capabilityId==='prepare-approved-requests');ref.businessSections=ref.businessSections.filter(s=>s.exceptionId!==collision.id);if(explicit)view.uncreatedTestSections=[collision.id];const other=await open(copy);try{select(other);const content=other.$(`[data-business-exception="${collision.id}"]`).nextElementSibling;assert.equal(content.querySelector('.shell-spec-warning').textContent,explicit?'テスト仕様書未作成':'テスト仕様書との対応未確認');assert.equal(labels(content).length,0);}finally{other.w.close();}}
const invalid=structuredClone(pkg),invalidView=invalid.documents.find(d=>d.kind==='conceptModel').presentation.activityViews.find(v=>v.activityId===prepare.id),invalidRef=invalidView.testSpecificationFunctions.find(f=>f.capabilityId==='prepare-approved-requests'),bad=invalidRef.businessSections.find(s=>s.exceptionId===collision.id);bad.exceptionId=business.exceptions.find(e=>e.activityId!==prepare.id).id;
const wrong=await open(invalid);try{select(wrong);const content=wrong.$(`[data-business-exception="${collision.id}"]`).nextElementSibling;assert.equal(labels(content).length,0);assert.equal(content.querySelector('.shell-spec-warning').textContent,'テスト仕様書との対応未確認');}finally{wrong.w.close();}
// A package with no loaded Check cannot establish whether a spec exists elsewhere.
const noChecks=structuredClone(pkg);noChecks.documents=noChecks.documents.filter(doc=>doc.kind==='businessDesign');const absent=await open(noChecks);try{select(absent);assert.equal(absent.$('[data-business-result]').nextElementSibling.querySelector('.shell-spec-warning').textContent,'テスト仕様書との対応未確認');}finally{absent.w.close();}
// Every rendered section mapping belongs to the Activity and references a real function page.
for(const view of model.presentation.activityViews)for(const ref of view.testSpecificationFunctions??[])for(const section of ref.businessSections??[]){assert(['result','exception'].includes(section.kind));if(section.kind==='exception')assert(business.exceptions.some(e=>e.id===section.exceptionId&&e.activityId===view.activityId));assert(section.pages.length&&section.pages.every(p=>p==='decision'||p==='result'));assert(model.reviewGroups.find(g=>g.id===ref.groupId)?.capabilities.some(c=>c.id===ref.capabilityId&&c.testSpecification));}
verify();assert.deepEqual(readFileSync(inputPath),input);
console.log(JSON.stringify({checks:['ACTIVITY-SECTION-SPEC-001','ACTIVITY-SECTION-SPEC-002','ACTIVITY-SECTION-SPEC-003'],scope:'V8 reference draft, actual DOM, explicit and missing mappings, navigation and preserved review states'}));
