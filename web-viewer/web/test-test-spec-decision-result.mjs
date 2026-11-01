import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {validate} from '../../tools/document_storage/core.mjs';

const authority=readFileSync('verification/test-spec-decision-result.check-items.json');
assert.equal(createHash('sha256').update(authority).digest('hex'),'1c1b771c87b72d5575d706e2b6d3f8497f8bb1a3179adbeef058359634246070');
const expected=JSON.parse(authority).checks.map(check=>check.id),covered=new Set();
const pkg=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v4-check-review.json','utf8'));validate(pkg);
const bd=pkg.documents.find(doc=>doc.kind==='businessDesign'),model=pkg.documents.find(doc=>doc.kind==='conceptModel'),doc=pkg.documents.find(doc=>doc.kind==='checkItems');
const byId=new Map(doc.items.map(item=>[item.id,item]));
assert.equal(doc.items.length,31);assert(doc.items.every(item=>['未レビュー','要確認'].includes(item.reviewState)));
assert(doc.items.every(item=>!item.fields.testEvidence));
assert.equal(model.reviewGroups.flatMap(group=>group.capabilities.flatMap(cap=>cap.samples)).length,31,'original data examples remain in the JSON');

async function appFor(data){
 const bundle=await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text','.json':'text'},plugins:[{name:'purchase-separated',setup(b){b.onLoad({filter:/business-design\.json$/},()=>({contents:JSON.stringify(data),loader:'text'}));}}]});
 const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/purchase',runScripts:'outside-only',pretendToBeVisual:true}).window;
 w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLElement.prototype.setPointerCapture=()=>{};
 const $=selector=>w.document.querySelector(selector),entry=key=>$(`[data-explorer-key="${key}"]`),until=async fn=>{for(let i=0;i<500&&!fn();i++)await new Promise(resolve=>setTimeout(resolve,10));assert.ok(fn(),'expected app state');};
 w.eval(bundle.outputFiles[0].text);await until(()=>!!$('#open')&&!$('#open').disabled);$('#open-sample').click();await until(()=>w.document.querySelectorAll('.node').length>0&&entry('group:tests'));
 return {w,$,entry};
}
const apply=bd.activities.find(a=>a.name==='備品購入を申請する').id;
const key=cap=>`fn:${apply}:group-request:${cap}`;
const app=await appFor(pkg),{w,$,entry}=app;
try{
 entry('group:tests').click();
 const open=(kind,id)=>{const button=entry('tests:'+(kind==='decision'?'decision:':'')+id);assert(button,`missing ${kind} menu for ${id}`);button.click();return $('#tests-workspace');};
 for(const cap of ['save-draft','submit-request']){
  const group=entry('group:tests-function-'+key(cap));assert(group,`function group ${cap}`);group.click();assert.equal(entry('group:tests-function-'+key(cap)).getAttribute('aria-expanded'),'true');
  assert.equal(entry('tests:decision:'+key(cap)).textContent,'可否判定');assert.equal(entry('tests:'+key(cap)).textContent,'処理結果');
 }
 assert.equal(entry('group:tests-activity-'+apply),null,'the function replaces the duplicate Activity group');
 let page=open('decision',key('save-draft'));assert.equal(new URL(w.location.href).searchParams.get('spec'),'decision:'+key('save-draft'));
 assert.match(page.textContent,/可否判定/);assert.equal(page.querySelector('[data-data-example]'),null);
 const rows=()=>[...page.querySelectorAll('.decision-examples tr')].map(row=>[...row.children].map(cell=>cell.textContent.trim()));
 assert.deepEqual(rows(),[['条件','下書き保存','関連 Check'],['見積','‐','P-01'],['品目・入力内容','‐','P-01'],['申請の状態','‐','P-01'],['役職別上限','保存の条件にしない','P-01']]);
 const draftCheck=page.querySelector('.decision-examples details');draftCheck.open=true;draftCheck.dispatchEvent(new w.Event('toggle'));assert.match(draftCheck.textContent,/役職別上限への適合・申請状態を問わず/);
 assert.match(page.textContent,/保存の可否を左右しない/);covered.add('SPEC-SEPARATE-001');covered.add('SPEC-SEPARATE-002');
 page=open('decision',key('submit-request'));assert.equal(page.querySelector('[data-data-example]'),null);
 assert.deepEqual(rows(),[['見積','役職別上限','提出','関連 Check'],['あり','上限以下','可','P-03'],['‐','上限超過','不可','P-04'],['なし','‐','不可','P-05'],['‐','判定不能','不可','P-06']]);
 assert.match(page.textContent,/複数の条件に該当する場合があります/);const applicable=(quote,limit)=>rows().slice(1).filter(row=>(row[0]==='‐'||row[0]===quote)&&(row[1]==='‐'||row[1]===limit)).map(row=>row[3]).sort();
 assert.deepEqual(applicable('なし','上限超過'),['P-04','P-05']);assert.deepEqual(applicable('なし','判定不能'),['P-05','P-06']);assert.deepEqual(applicable('あり','上限以下'),['P-03']);
 const p05=[...page.querySelectorAll('summary')].find(summary=>summary.textContent==='P-05');assert(p05);p05.parentElement.open=true;p05.parentElement.dispatchEvent(new w.Event('toggle'));
 assert.match(p05.parentElement.textContent,/提出を成立させない/);assert.doesNotMatch(p05.parentElement.textContent,/未レビュー|confidence|testEvidence/);covered.add('SPEC-SEPARATE-003');
 page=open('result',key('submit-request'));assert.match(page.textContent,/処理結果/);assert.match(page.textContent,/P-03/);assert.doesNotMatch(page.textContent,/P-04|P-05|P-06/);
 const resultCheck=page.querySelector('[data-element-id="purchase-check-p-03"]');assert.equal(resultCheck.querySelector('h3').textContent,'P-03');assert.doesNotMatch(resultCheck.querySelector('h4').nextElementSibling.textContent,/上限/);
 const checkDetail=resultCheck.querySelector('details');assert.equal(checkDetail.open,false);assert.match(checkDetail.textContent,/上限額と同額も含む/);
 assert.equal(page.querySelector('.decision-examples'),null);assert.equal(page.querySelector('[data-data-example]').dataset.dataExample,'request-submitted');assert.equal(page.querySelector('select'),null,'one data example needs no picker');
 const scenario=page.querySelector('.data-example-context');assert(scenario);assert.equal(scenario.open,false);assert.match(scenario.textContent,/上限額2,000円と同額/);
 assert.match(page.textContent,/ボールペン/);assert.match(page.textContent,/ファイル/);const repeated=[...page.querySelectorAll('.data-example-key')].filter(cell=>cell.textContent==='R-101');assert(repeated.length>=3);assert.equal(new Set(repeated.map(cell=>cell.dataset.keyTone)).size,1);
 page=open('result',key('save-draft'));assert.deepEqual([...page.querySelector('select').options].map(option=>option.value),['request-draft','request-draft-approved']);assert.equal(page.querySelector('.data-example-decision-links button').textContent,'P-01');
 page.querySelector('.data-example-decision-links button').click();assert.match($('#tests-workspace').textContent,/可否判定/);page=open('result',key('save-draft'));
 page.querySelector('select').value='request-draft-approved';page.querySelector('select').dispatchEvent(new w.Event('change'));page=$('#tests-workspace');assert.equal(page.querySelector('[data-data-example]').dataset.dataExample,'request-draft-approved');assert.match(page.textContent,/P-02/);assert.match(page.textContent,/確認が必要/);covered.add('SPEC-SEPARATE-004');

 const reached=new Set();let count=0;
 for(const view of model.presentation.activityViews)for(const ref of view.testSpecificationFunctions??[]){
  const group=model.reviewGroups.find(value=>value.id===ref.groupId),cap=group.capabilities.find(value=>value.id===ref.capabilityId),spec=cap.testSpecification,id=`fn:${view.activityId}:${group.id}:${cap.id}`;
  assert(spec,`missing explicit specification for ${id}`);page=open('decision',id);assert.equal(page.querySelector('[data-data-example]'),null);
  for(const checkId of spec.decisionCheckIds){assert(page.textContent.includes(byId.get(checkId).checkId),`decision Check ${checkId} is not reachable`);reached.add(checkId);}
  page=open('result',id);assert.equal(page.querySelector('.decision-examples'),null);
  for(const checkId of spec.resultCheckIds){assert(page.querySelector(`[data-element-id="${checkId}"]`),`result Check ${checkId} is not reachable`);reached.add(checkId);}
  const displayed=page.querySelector('[data-data-example]');assert(spec.sampleIds.includes(displayed?.dataset.dataExample));
  const picker=page.querySelector('select');if(spec.sampleIds.length>1){assert(picker);assert.deepEqual([...picker.options].map(option=>option.value),spec.sampleIds);for(const sampleId of spec.sampleIds){const current=$('#tests-workspace select');current.value=sampleId;current.dispatchEvent(new w.Event('change'));assert.equal($('#tests-workspace [data-data-example]').dataset.dataExample,sampleId);}}else assert.equal(picker,null);
  count++;
 }
 assert.deepEqual([...reached].sort(),doc.items.map(item=>item.id).sort(),'all existing Checks remain reachable across decision and result');
 w.history.pushState({},'',`?view=tests&spec=${encodeURIComponent(key('submit-request'))}`);w.dispatchEvent(new w.Event('popstate'));assert.match($('#tests-workspace').textContent,/処理結果/);assert.match($('#tests-workspace').textContent,/P-03/);covered.add('SPEC-SEPARATE-006');
 assert.equal(count,12);covered.add('SPEC-SEPARATE-007');
}finally{w.close();}

// A capability with an explicit Check is navigable with no data samples at all.
const noSamples=structuredClone(pkg),noModel=noSamples.documents.find(d=>d.kind==='conceptModel'),group=noModel.reviewGroups.find(g=>g.id==='group-request'),draft=group.capabilities.find(cap=>cap.id==='save-draft'),removed=new Set(draft.samples.map(sample=>sample.id));
draft.samples=[];draft.testSpecification.sampleIds=[];draft.testSpecification.resultCheckIds=[];for(const statement of group.structureStatements)statement.sampleIds=statement.sampleIds.filter(id=>!removed.has(id));validate(noSamples);
const emptyApp=await appFor(noSamples);
try{const button=emptyApp.entry('tests:decision:'+key('save-draft'));assert(button);button.click();assert.match(emptyApp.$('#tests-workspace').textContent,/品目・入力内容/);assert.equal(emptyApp.$('#tests-workspace [data-data-example]'),null);covered.add('SPEC-SEPARATE-005');}finally{emptyApp.w.close();}
assert.deepEqual([...covered].sort(),expected.slice().sort());
console.log(JSON.stringify({passed:[...covered],activities:bd.activities.length,checks:doc.items.length,scope:'explicit specification, purchase DOM and legacy URL; human review remains separate'}));
