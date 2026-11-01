import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
const authorityPath='verification/test-spec-related-links.check-items.json',hash='7a6ee9449bf6abef42f7490117b6e2f00ed0c01dea416b07680bd85e425783fc';
const verify=bytes=>assert.equal(createHash('sha256').update(bytes).digest('hex'),hash);verify(readFileSync(authorityPath));assert.throws(()=>verify(Buffer.from('{}')));
const checks=JSON.parse(readFileSync(authorityPath)).checks.map(c=>c.id),covered=[];
const inputPath='../work/concept-review/issue-133/versions/purchase-v7-value-independent-review.json',input=readFileSync(inputPath),pkg=JSON.parse(input),model=pkg.documents.find(d=>d.kind==='conceptModel'),business=pkg.documents.find(d=>d.kind==='businessDesign');
const code=(await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}})).outputFiles[0].text;
async function open(source){const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/related',runScripts:'outside-only',pretendToBeVisual:true}).window;w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLElement.prototype.setPointerCapture=()=>{};const $=s=>w.document.querySelector(s),entry=id=>$(`[data-explorer-key="${id}"]`),until=async fn=>{for(let i=0;i<800;i++){if(fn())return;await new Promise(r=>setTimeout(r,5));}throw Error('Viewer did not become ready');};w.eval(code);await until(()=>$('#open')&&!$('#open').disabled);$('#open-text').click();$('#source-text').value=source;await $('#source-submit').onclick();await until(()=>['saved','unchanged'].includes($('#app').dataset.saveState));return{w,$,entry,until};}
const app=await open(input.toString()),{w,$,entry}=app;
try{
 const group=model.reviewGroups.find(g=>g.id==='group-request'),cap=group.capabilities.find(c=>c.id==='save-draft'),activity=model.presentation.activityViews.find(v=>v.testSpecificationFunctions?.some(f=>f.groupId===group.id&&f.capabilityId===cap.id)).activityId,key=`fn:${activity}:${group.id}:${cap.id}`;
 for(const prefix of ['decision:','']){
  entry('tests:'+prefix+key).click();assert.equal($('#drawer').disabled,false,'function pages support drawer');if($('#test-related-panel').hidden)$('#drawer').click();
  const drawer=$('#test-related-panel');assert(!drawer.hidden);assert(drawer.querySelector(`[data-related-activity="${activity}"]`));assert(drawer.querySelector('[data-related-group="group-request"]'));
  for(const id of ['request','version','item'])assert(drawer.querySelector(`[data-related-concept="${id}"]`),id);
  assert(!drawer.querySelector('[data-related-concept="receipt"]'));assert.equal(drawer.querySelectorAll('p,table,[data-data-example]').length,0,'drawer contains links, not copied explanations or examples');
 }
 // Activity -> both views, and back via its explicitly linked Activity.
 $('[data-related-activity="'+activity+'"]').click();assert.equal($('#app').dataset.workspaceArea,'business');assert.equal(new URL(w.location.href).searchParams.get('activity'),activity);
 for(const prefix of ['decision:',''])assert($(`#detail [data-related-spec="${prefix+key}"]`));
 assert.equal($('#detail [data-related-spec*="group-handoff"]'),null,'no unrelated function');
 $(`#detail [data-related-spec="decision:${key}"]`).click();assert.equal(new URL(w.location.href).searchParams.get('spec'),'decision:'+key);assert(!$('#test-related-panel').hidden);
 $('[data-related-group="group-request"]').click();assert.equal(new URL(w.location.href).searchParams.get('concept'),'group-request');for(const prefix of ['decision:',''])assert($(`.data-review-overview [data-related-spec="${prefix+key}"]`));
 $(`.data-review-overview [data-related-spec="${key}"]`).click();$('[data-related-concept="item"]').click();assert.equal(new URL(w.location.href).searchParams.get('concept'),'item');for(const prefix of ['decision:',''])assert($(`.concept-related-content [data-related-spec="${prefix+key}"]`));
 // A concept only referenced in another model is never linked to this function.
 entry('concept:receipt').click();assert.equal($(`.concept-related-content [data-related-spec="${key}"]`),null);covered.push('SPEC-RELATED-001','SPEC-RELATED-002');
 entry('tests:'+key).click();$('#drawer').click();assert($('#test-related-panel').hidden);entry('tests:decision:'+key).click();assert($('#test-related-panel').hidden,'switching functions cannot reopen a closed drawer');entry('concept:group-request').click();assert($('.concept-related').hidden);entry('tests:'+key).click();assert($('#test-related-panel').hidden);$('#drawer').click();assert(!$('#test-related-panel').hidden);
 const state=$('#explorer-states .explorer-item');assert(state);state.click();assert($('#drawer').disabled);assert($('#test-related-panel').hidden);entry('tests:'+key).click();assert(!$('#test-related-panel').hidden,'unsupported views preserve preference');covered.push('SPEC-RELATED-003');
 const unrelated=readFileSync('../work/viewer-json/issue-274/json-native/independent.json','utf8');$('#open-text').click();$('#source-text').value=unrelated;await $('#source-submit').onclick();await app.until(()=>['saved','unchanged'].includes($('#app').dataset.saveState));assert.equal($(`[data-related-spec="${key}"]`),null,'document change must not carry old links');
}finally{w.close();}
const legacy=await open(readFileSync('../work/concept-review/issue-133/versions/purchase-v3-beta.json','utf8'));try{legacy.entry('concept:group-request').click();if(legacy.$('.concept-related').hidden)legacy.$('#drawer').click();assert.equal(legacy.$('[data-related-spec]'),null,'no inferred links for legacy package');}finally{legacy.w.close();}covered.push('SPEC-RELATED-004');
assert.deepEqual(covered.sort(),checks.sort());assert.throws(()=>assert.deepEqual(covered.slice(1).sort(),checks.sort()));verify(readFileSync(authorityPath));assert.deepEqual(readFileSync(inputPath),input);assert(business.activities.length);
console.log(JSON.stringify({checks:covered,scope:'actual app DOM and explicit V7 relationships; Chrome and human review separate'}));
