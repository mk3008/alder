import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {validate} from '../../tools/document_storage/core.mjs';

const authority=readFileSync('verification/test-spec-decision-result.check-items.json');
assert.equal(createHash('sha256').update(authority).digest('hex'),'1c1b771c87b72d5575d706e2b6d3f8497f8bb1a3179adbeef058359634246070');
const layoutAuthority=readFileSync('verification/decision-table-layout.check-items.json');
assert.equal(createHash('sha256').update(layoutAuthority).digest('hex'),'6fc1816c9083ccd766ef9cc1c035c56db7ec2896ca87558b479c1a7a05c8f55c');
const groupAuthority=readFileSync('verification/decision-table-groups.check-items.json');
assert.equal(createHash('sha256').update(groupAuthority).digest('hex'),'6ebb9859e6b15ea876b8c784d246c8c4c26171b93bbad9af36ce76cd9b86edfe');
const resultAuthority=readFileSync('verification/result-example-first.check-items.json');
assert.equal(createHash('sha256').update(resultAuthority).digest('hex'),'8dded4ab43d807a467b7027f622f1e8b6c8acd755b6480c829380a8312a0b03a');
const expected=JSON.parse(authority).checks.map(check=>check.id),covered=new Set();
const layoutExpected=JSON.parse(layoutAuthority).checks.map(check=>check.id),layoutCovered=new Set();
const groupExpected=JSON.parse(groupAuthority).checks.map(check=>check.id),groupCovered=new Set();
const resultExpected=JSON.parse(resultAuthority).checks.map(check=>check.id),resultCovered=new Set();
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
 const tableRows=table=>{const top=table.querySelector('thead tr:first-child'),axes=table.querySelector('thead tr:nth-child(2)');assert(top&&axes,'decision table must group its headers');return [[...axes.children,...[...top.children].slice(1)].map(cell=>cell.textContent.trim()),...[...table.querySelectorAll('tbody tr')].map(row=>[...row.children].map(cell=>cell.textContent.trim()))];};
 const rows=()=>[...page.querySelectorAll('.decision-examples table')].flatMap(tableRows);
 assert.deepEqual(rows(),[['品目','入力内容','見積','申請状態','役職別上限','結果','Check ID'],['‐','‐','‐','‐','‐','保存可','P-01']]);
 assert.equal(page.querySelector('.decision-examples details'),null,'the table must not expand Check prose');
 assert.match(byId.get('purchase-check-p-01').fields.expectedResult[0].value,/役職別上限への適合・申請状態を問わず/,'underlying Check remains available in JSON');
 assert.match(page.textContent,/保存の可否を左右しない/);covered.add('SPEC-SEPARATE-001');covered.add('SPEC-SEPARATE-002');layoutCovered.add('DECISION-TABLE-002');layoutCovered.add('DECISION-TABLE-003');
 page=open('decision',key('submit-request'));assert.equal(page.querySelector('[data-data-example]'),null);
 assert.deepEqual(rows(),[['見積','役職別上限','結果','Check ID'],['あり','上限以下','提出可','P-03'],['‐','上限超過','提出不可','P-04'],['なし','‐','提出不可','P-05'],['‐','判定不能','提出不可','P-06']]);
 assert.match(page.textContent,/複数の行に該当する場合があります/);const applicable=(quote,limit)=>rows().slice(1).filter(row=>(row[0]==='‐'||row[0]===quote)&&(row[1]==='‐'||row[1]===limit)).map(row=>row[3]).sort();
 assert.deepEqual(applicable('なし','上限超過'),['P-04','P-05']);assert.deepEqual(applicable('なし','判定不能'),['P-05','P-06']);assert.deepEqual(applicable('あり','上限以下'),['P-03']);
 assert.equal(page.querySelector('.decision-examples details'),null);assert.match(byId.get('purchase-check-p-05').fields.expectedResult[0].value,/提出を成立させない/);
 assert.doesNotMatch(page.textContent,/未レビュー|confidence|testEvidence/);covered.add('SPEC-SEPARATE-003');
 const resubmitView=model.presentation.activityViews.find(view=>view.testSpecificationFunctions?.some(ref=>ref.capabilityId==='resubmit-request'));
 page=open('decision',`fn:${resubmitView.activityId}:group-request:resubmit-request`);
 assert.match(page.textContent,/元の状態を保つ/);assert.match(page.textContent,/確定済みの準備を保つ/);
 const prepareView=model.presentation.activityViews.find(view=>view.testSpecificationFunctions?.some(ref=>ref.capabilityId==='prepare-approved-requests'));
 const prepareGroup=model.reviewGroups.find(group=>group.capabilities.some(cap=>cap.id==='prepare-approved-requests'));
 page=open('decision',`fn:${prepareView.activityId}:${prepareGroup.id}:prepare-approved-requests`);
 assert.match(page.textContent,/両方の同時成立は不可/);assert.match(page.textContent,/P-26/);layoutCovered.add('DECISION-TABLE-004');
 page=open('result',key('submit-request'));assert.match(page.textContent,/処理結果/);assert.match(page.textContent,/P-03/);assert.doesNotMatch(page.textContent,/P-04|P-05|P-06/);
 assert.equal(page.querySelector('.result-checks').textContent,'P-03');assert.equal(page.querySelector('.result-checks details'),null);
 assert.equal(page.querySelector('.decision-examples'),null);assert.equal(page.querySelector('[data-data-example]').dataset.dataExample,'request-submitted');assert.equal(page.querySelector('select'),null,'one data example needs no picker');
 assert.equal(page.querySelector('.data-example-context'),null);assert.match(page.querySelector('.data-example-when').textContent,/上限額2,000円と同額/);resultCovered.add('RESULT-EXAMPLE-001');
 assert.match(page.textContent,/ボールペン/);assert.match(page.textContent,/ファイル/);const repeated=[...page.querySelectorAll('.data-example-key')].filter(cell=>cell.textContent==='R-101');assert(repeated.length>=3);assert.equal(new Set(repeated.map(cell=>cell.dataset.keyTone)).size,1);
 page=open('result',key('save-draft'));assert.deepEqual([...page.querySelector('select').options].map(option=>option.value),['request-draft','request-draft-approved','request-draft-prepared']);assert.equal(page.querySelector('.data-example-decision-links button').textContent,'P-01');
 page.querySelector('.data-example-decision-links button').click();assert.match($('#tests-workspace').textContent,/可否判定/);page=open('result',key('save-draft'));
 page.querySelector('select').value='request-draft-approved';page.querySelector('select').dispatchEvent(new w.Event('change'));page=$('#tests-workspace');assert.equal(page.querySelector('[data-data-example]').dataset.dataExample,'request-draft-approved');assert.equal(page.querySelector('.result-checks').textContent,'P-02、P-30');assert.doesNotMatch(page.textContent,/確認が必要/);assert.match(page.querySelector('.data-example-when').textContent,/10本/);assert.match(page.textContent,/12/);
 page.querySelector('select').value='request-draft-prepared';page.querySelector('select').dispatchEvent(new w.Event('change'));page=$('#tests-workspace');assert.match(page.textContent,/P-001/);assert.match(page.querySelector('.data-example-when').textContent,/10本/);assert.match(page.textContent,/適合済みにはなりません/);assert.equal(byId.get('purchase-check-p-02').reviewState,'未レビュー');covered.add('SPEC-SEPARATE-004');resultCovered.add('RESULT-EXAMPLE-004');

 const reached=new Set();let count=0;
 for(const view of model.presentation.activityViews)for(const ref of view.testSpecificationFunctions??[]){
  const group=model.reviewGroups.find(value=>value.id===ref.groupId),cap=group.capabilities.find(value=>value.id===ref.capabilityId),spec=cap.testSpecification,id=`fn:${view.activityId}:${group.id}:${cap.id}`;
  assert(spec,`missing explicit specification for ${id}`);page=open('decision',id);assert.equal(page.querySelector('[data-data-example]'),null);
  const tables=[...page.querySelectorAll('.decision-examples table')];assert(tables.length,`missing decision table for ${cap.id}`);
  for(const table of tables){const [head,...body]=tableRows(table),group=table.querySelector('thead th[scope="colgroup"]'),result=table.querySelector('thead th.decision-result');
   assert.equal(group.textContent,'条件');assert.equal(group.colSpan,head.indexOf('結果'));assert.equal(result.textContent,'結果');assert.equal(result.rowSpan,2);
   assert.equal(head.at(-1),'Check ID',`${cap.id} must put Check ID last`);assert(head.includes('結果'),`${cap.id} must identify its result`);assert(head.indexOf('結果')>0,`${cap.id} must have a condition column`);
   assert(!head.includes('条件')&&!head.includes('対象・条件'),`${cap.id} must name independent condition axes`);
   const bodyNodes=[...table.querySelectorAll('tbody tr')];assert.equal(body.length,bodyNodes.length);for(const row of bodyNodes){const cells=[...row.children];assert.equal(cells.length,head.length);assert(cells[head.indexOf('結果')].classList.contains('decision-result'));assert.match(cells.at(-1).textContent.trim(),/^P-\d+(、P-\d+)*$/);assert.equal(cells.at(-1).querySelector('details,button,a'),null);}
  }
  for(const checkId of spec.decisionCheckIds){assert(page.textContent.includes(byId.get(checkId).checkId),`decision Check ${checkId} is not reachable`);reached.add(checkId);}
  page=open('result',id);assert.equal(page.querySelector('.decision-examples'),null);
  for(const checkId of spec.resultCheckIds){assert(page.querySelector('.result-checks').textContent.includes(byId.get(checkId).checkId),`result Check ${checkId} is not visible`);reached.add(checkId);}
  assert.equal(page.querySelector('.result-checks details'),null,'covered examples display IDs without duplicate Check prose');
  const displayed=page.querySelector('[data-data-example]');assert(spec.sampleIds.includes(displayed?.dataset.dataExample));
  const picker=page.querySelector('select');if(spec.sampleIds.length>1){assert(picker);assert.deepEqual([...picker.options].map(option=>option.value),spec.sampleIds);for(const sampleId of spec.sampleIds){const current=$('#tests-workspace select');current.value=sampleId;current.dispatchEvent(new w.Event('change'));assert.equal($('#tests-workspace [data-data-example]').dataset.dataExample,sampleId);}}else assert.equal(picker,null);
  count++;
 }
 assert.deepEqual([...reached].sort(),doc.items.map(item=>item.id).sort(),'all existing Checks remain reachable across decision and result');
 w.history.pushState({},'',`?view=tests&spec=${encodeURIComponent(key('submit-request'))}`);w.dispatchEvent(new w.Event('popstate'));assert.match($('#tests-workspace').textContent,/処理結果/);assert.match($('#tests-workspace').textContent,/P-03/);covered.add('SPEC-SEPARATE-006');
 assert.equal(count,12);covered.add('SPEC-SEPARATE-007');layoutCovered.add('DECISION-TABLE-001');groupCovered.add('DECISION-GROUP-001');groupCovered.add('DECISION-GROUP-002');resultCovered.add('RESULT-EXAMPLE-002');
}finally{w.close();}

// A capability with an explicit Check is navigable with no data samples at all.
const noSamples=structuredClone(pkg),noModel=noSamples.documents.find(d=>d.kind==='conceptModel'),group=noModel.reviewGroups.find(g=>g.id==='group-request'),draft=group.capabilities.find(cap=>cap.id==='save-draft'),removed=new Set(draft.samples.map(sample=>sample.id));
draft.samples=[];draft.testSpecification.sampleIds=[];for(const statement of group.structureStatements)statement.sampleIds=statement.sampleIds.filter(id=>!removed.has(id));validate(noSamples);
const emptyApp=await appFor(noSamples);
try{const button=emptyApp.entry('tests:decision:'+key('save-draft'));assert(button);button.click();assert.match(emptyApp.$('#tests-workspace').textContent,/品目/);assert.match(emptyApp.$('#tests-workspace').textContent,/入力内容/);assert.equal(emptyApp.$('#tests-workspace [data-data-example]'),null);
 emptyApp.entry('tests:'+key('save-draft')).click();assert.match(emptyApp.$('#tests-workspace .result-checks').textContent,/元の状態・確定版・承認・購入準備を変えず/);covered.add('SPEC-SEPARATE-005');resultCovered.add('RESULT-EXAMPLE-003');}finally{emptyApp.w.close();}
const unresolved=structuredClone(pkg),pending=unresolved.documents.find(d=>d.kind==='checkItems').items.find(item=>item.checkId==='P-02');pending.reviewState='要確認';pending.fields.question=[{kind:'text',value:'保存後の扱いは未決。'}];validate(unresolved);
const unresolvedApp=await appFor(unresolved);try{unresolvedApp.entry('tests:'+key('save-draft')).click();assert.match(unresolvedApp.$('.result-checks').textContent,/保存後の扱いは未決/);assert.match(unresolvedApp.$('.result-checks').textContent,/確認が必要/);}finally{unresolvedApp.w.close();}
const nonstandard=structuredClone(pkg),legacyExample=nonstandard.documents.find(d=>d.kind==='checkItems').examples.find(e=>e.id==='decision-submit-table');legacyExample.columns=['見積','役職別上限','提出','関連 Check'];validate(nonstandard);
const legacyApp=await appFor(nonstandard);try{legacyApp.entry('tests:decision:'+key('submit-request')).click();const table=legacyApp.$('.decision-examples table');assert.equal(table.querySelector('thead'),null);assert.deepEqual([...table.querySelector('tr').children].map(cell=>cell.textContent),legacyExample.columns);groupCovered.add('DECISION-GROUP-003');}finally{legacyApp.w.close();}
assert.deepEqual([...covered].sort(),expected.slice().sort());
assert.deepEqual([...layoutCovered].sort(),layoutExpected.slice().sort());
assert.deepEqual([...groupCovered].sort(),groupExpected.slice().sort());assert.deepEqual([...resultCovered].sort(),resultExpected.slice().sort());
console.log(JSON.stringify({passed:[...covered],activities:bd.activities.length,checks:doc.items.length,scope:'explicit specification, purchase DOM and legacy URL; human review remains separate'}));
