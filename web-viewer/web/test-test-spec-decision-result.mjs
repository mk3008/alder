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
const independenceAuthority=readFileSync('verification/result-decision-independence.check-items.json');
assert.equal(createHash('sha256').update(independenceAuthority).digest('hex'),'7e844c4d1f8707e28df5633c35b92fd93165755edb6142cc8c99f9f80e954ae7');
const valueIndependentAuthority=readFileSync('verification/decision-value-independent.check-items.json');
assert.equal(createHash('sha256').update(valueIndependentAuthority).digest('hex'),'8ecb702e7c5912cbac1f505f17b942e2ff57243012c8108dba49fa1aa024b9cf');
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
 const openSpec=(kind,id)=>{const legacy=(kind==='decision'?'decision:':'')+id;w.history.pushState({},'',`?view=tests&spec=${encodeURIComponent(legacy)}`);w.dispatchEvent(new w.PopStateEvent('popstate'));const selector=kind==='decision'?'.activity-test-decision':'.activity-test-samples',node=[...w.document.querySelectorAll(selector)].find(value=>value.dataset.functionKey===id);assert(node,`missing ${kind} content for ${id}`);if(node.tagName==='DETAILS')node.open=true;return node;};
 return {w,$,entry,openSpec};
}
const apply=bd.activities.find(a=>a.name==='備品購入を申請する').id;
const key=cap=>`fn:${apply}:group-request:${cap}`;
const app=await appFor(pkg),{w,$,entry}=app;
try{
 entry('group:tests').click();
 const open=(kind,id)=>app.openSpec(kind,id);
 for(const cap of ['save-draft','submit-request']){
  assert.equal(entry('group:tests-function-'+key(cap)),null);
  assert.equal(entry('tests:decision:'+key(cap)),null);assert.equal(entry('tests:'+key(cap)),null);
 }
 assert(entry('tests:activity:'+apply),'the Activity is the only explorer entry');
 let page=open('decision',key('save-draft'));assert.equal(new URL(w.location.href).searchParams.get('spec'),'decision:'+key('save-draft'));assert.equal($('#tests-workspace .activity-test-spec h1').textContent,bd.activities.find(activity=>activity.id===apply).name);
 assert.match(page.textContent,/可否判定/);assert.equal(page.querySelector('[data-data-example]'),null);
 const tableRows=table=>{const top=table.querySelector('thead tr:first-child'),axes=table.querySelector('thead tr:nth-child(2)');assert(top&&axes,'decision table must group its headers');return [[...axes.children,...[...top.children].slice(1)].map(cell=>cell.textContent.trim()),...[...table.querySelectorAll('tbody tr')].map(row=>[...row.children].map(cell=>cell.textContent.trim()))];};
 const rows=()=>[...page.querySelectorAll('.decision-examples table')].flatMap(tableRows);
 assert.deepEqual(rows(),[['品目','入力内容','見積','申請状態','役職別上限','結果','Check ID'],['‐','‐','‐','‐','‐','保存可','P-01']]);
 assert.equal(page.querySelector('.decision-examples details'),null,'the table must not expand Check prose');
 assert.match(byId.get('purchase-check-p-01').fields.expectedResult[0].value,/役職別上限への適合・申請状態を問わず/,'underlying Check remains available in JSON');
 assert.match(page.textContent,/‐＝値不問。/);assert.doesNotMatch(page.textContent,/‐＝保存の可否を左右しない/);covered.add('SPEC-SEPARATE-001');covered.add('SPEC-SEPARATE-002');layoutCovered.add('DECISION-TABLE-002');layoutCovered.add('DECISION-TABLE-003');
 page=open('decision',key('submit-request'));assert.equal(page.querySelector('[data-data-example]'),null);
 assert.deepEqual(rows(),[['見積','役職別上限','結果','備考','Check ID'],['あり','上限以下','提出可','','P-03'],['あり','それ以外','提出不可','上限超過、判定不能など','P-04、P-06'],['なし','‐','提出不可','','P-05']]);
 assert.match(page.textContent,/上から順に判定/);assert.match(page.textContent,/‐＝値不問。/);assert.doesNotMatch(page.textContent,/その行では不問|複数の行に該当する場合があります/);
 const first=(quote,limit)=>rows().slice(1).find(row=>row[0]===quote&&(row[1]==='‐'||row[1]===limit||(row[1]==='それ以外'&&limit!=='上限以下')));
 assert.equal(first('なし','上限超過')[4],'P-05');assert.equal(first('なし','判定不能')[4],'P-05');assert.equal(first('あり','上限以下')[4],'P-03');assert.equal(first('あり','判定不能')[4],'P-04、P-06');
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
 page=open('result',key('save-draft'));assert.deepEqual([...page.querySelector('select').options].map(option=>option.value),['request-draft','request-draft-approved','request-draft-prepared']);assert.equal(page.querySelector('.data-example-decision-links'),null);assert.doesNotMatch(page.textContent,/関連する可否条件/);
 page.querySelector('select').value='request-draft-approved';page.querySelector('select').dispatchEvent(new w.Event('change'));assert.equal(page.querySelector('[data-data-example]').dataset.dataExample,'request-draft-approved');assert.equal(page.querySelector('.result-checks').textContent,'P-02、P-30');assert.doesNotMatch(page.textContent,/確認が必要/);assert.match(page.querySelector('.data-example-when').textContent,/10本/);assert.match(page.textContent,/12/);
 page.querySelector('select').value='request-draft-prepared';page.querySelector('select').dispatchEvent(new w.Event('change'));assert.match(page.textContent,/P-001/);assert.match(page.querySelector('.data-example-when').textContent,/10本/);assert.match(page.textContent,/適合済みにはなりません/);assert.equal(byId.get('purchase-check-p-02').reviewState,'未レビュー');covered.add('SPEC-SEPARATE-004');resultCovered.add('RESULT-EXAMPLE-004');

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
   const section=table.closest('[data-decision-example]');if(body.length>1)assert.match(section.textContent,/上から順に判定/);const usesDash=body.some(row=>row.slice(0,head.indexOf('結果')).includes('‐'));assert.equal((section.textContent.match(/‐＝値不問。/g)??[]).length,usesDash?1:0);assert.doesNotMatch(section.textContent,/‐＝(?:その行では不問|[^。]*左右しない)/);
  }
  for(const checkId of spec.decisionCheckIds){assert(page.textContent.includes(byId.get(checkId).checkId),`decision Check ${checkId} is not reachable`);reached.add(checkId);}
  page=open('result',id);assert.equal(page.querySelector('.decision-examples'),null);
  assert.equal(page.querySelector('.data-example-decision-links'),null);assert.doesNotMatch(page.textContent,/関連する可否条件/);
  for(const checkId of spec.resultCheckIds){assert(page.querySelector('.result-checks').textContent.includes(byId.get(checkId).checkId),`result Check ${checkId} is not visible`);reached.add(checkId);}
  assert.equal(page.querySelector('.result-checks details'),null,'covered examples display IDs without duplicate Check prose');
  const displayed=page.querySelector('[data-data-example]');assert(spec.sampleIds.includes(displayed?.dataset.dataExample));
  const picker=page.querySelector('select');if(spec.sampleIds.length>1){assert(picker);assert.deepEqual([...picker.options].map(option=>option.value),spec.sampleIds);for(const sampleId of spec.sampleIds){const current=page.querySelector('select');current.value=sampleId;current.dispatchEvent(new w.Event('change'));assert.equal(page.querySelector('[data-data-example]').dataset.dataExample,sampleId);assert.doesNotMatch(page.textContent,/関連する可否条件/);}}else assert.equal(picker,null);
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
try{let page=emptyApp.openSpec('decision',key('save-draft'));assert.match(page.textContent,/品目/);assert.match(page.textContent,/入力内容/);assert.equal(page.querySelector('[data-data-example]'),null);
 page=emptyApp.openSpec('result',key('save-draft'));assert.match(page.querySelector('.result-checks').textContent,/元の状態・確定版・承認・購入準備を変えず/);covered.add('SPEC-SEPARATE-005');resultCovered.add('RESULT-EXAMPLE-003');}finally{emptyApp.w.close();}
const unresolved=structuredClone(pkg),pending=unresolved.documents.find(d=>d.kind==='checkItems').items.find(item=>item.checkId==='P-02');pending.reviewState='要確認';pending.fields.question=[{kind:'text',value:'保存後の扱いは未決。'}];validate(unresolved);
const unresolvedApp=await appFor(unresolved);try{const page=unresolvedApp.openSpec('result',key('save-draft'));assert.match(page.querySelector('.result-checks').textContent,/保存後の扱いは未決/);assert.match(page.querySelector('.result-checks').textContent,/確認が必要/);}finally{unresolvedApp.w.close();}
const nonstandard=structuredClone(pkg),legacyExample=nonstandard.documents.find(d=>d.kind==='checkItems').examples.find(e=>e.id==='decision-submit-table');legacyExample.columns=['見積','役職別上限','提出','備考','関連 Check'];validate(nonstandard);
const legacyApp=await appFor(nonstandard);try{const page=legacyApp.openSpec('decision',key('submit-request')),table=page.querySelector('.decision-examples table');assert.equal(table.querySelector('thead'),null);assert.deepEqual([...table.querySelector('tr').children].map(cell=>cell.textContent),legacyExample.columns);groupCovered.add('DECISION-GROUP-003');}finally{legacyApp.w.close();}

// A new candidate removes decision-only references from result examples without
// changing the business, Check, decision tables, sample contents, or old files.
const previous=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v5-resume-reference-draft.json','utf8'));
const candidate=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v6-result-independence-review.json','utf8'));
validate(previous);validate(candidate);
const expectedCandidate=structuredClone(previous),candidateModel=candidate.documents.find(d=>d.kind==='conceptModel'),expectedModel=expectedCandidate.documents.find(d=>d.kind==='conceptModel');
expectedCandidate.revision='purchase-v6-result-independence-review-1';expectedModel.revision='concepts-v6-result-independence-review-1';
const removedDecisionRefs=new Map([['request-draft','purchase-check-p-01'],['resume-new-draft','purchase-check-p-32'],['resume-approved-draft','purchase-check-p-32']]);
for(const group of expectedModel.reviewGroups)for(const cap of group.capabilities)for(const sample of cap.samples){const id=removedDecisionRefs.get(sample.id);if(id){assert(sample.checkIds.includes(id));sample.checkIds=sample.checkIds.filter(value=>value!==id);}}
assert.deepEqual(candidate,expectedCandidate,'only explicitly identified decision-only references and version labels change');
const candidateChecks=candidate.documents.find(d=>d.kind==='checkItems'),candidateById=new Map(candidateChecks.items.map(item=>[item.id,item]));
const candidateApp=await appFor(candidate);
try{
 candidateApp.entry('group:tests').click();
 for(const view of candidateModel.presentation.activityViews)for(const ref of view.testSpecificationFunctions??[]){
  const group=candidateModel.reviewGroups.find(value=>value.id===ref.groupId),cap=group.capabilities.find(value=>value.id===ref.capabilityId),spec=cap.testSpecification,id=`fn:${view.activityId}:${group.id}:${cap.id}`;
  const decision=candidateApp.openSpec('decision',id);assert(decision.querySelector('.decision-examples'));for(const checkId of spec.decisionCheckIds)assert(decision.textContent.includes(candidateById.get(checkId).checkId));
  let page=candidateApp.openSpec('result',id);assert.equal(page.querySelector('.decision-examples'),null);assert.doesNotMatch(page.textContent,/関連する可否条件/);
  for(const sampleId of spec.sampleIds){
   const sample=cap.samples.find(value=>value.id===sampleId);assert(sample.checkIds.length&&sample.checkIds.every(checkId=>spec.resultCheckIds.includes(checkId)),`${sampleId}: result Checks only`);
   const picker=page.querySelector('select');if(picker){picker.value=sampleId;picker.dispatchEvent(new candidateApp.w.Event('change'));}
   assert.equal(page.querySelector('[data-data-example]')?.dataset.dataExample,sampleId);assert.doesNotMatch(page.textContent,/関連する可否条件/);
  }
 }
 const submit=candidateModel.reviewGroups.flatMap(group=>group.capabilities).find(cap=>cap.id==='submit-request');
 assert(submit.testSpecification.decisionCheckIds.includes('purchase-check-p-03'));assert(submit.testSpecification.resultCheckIds.includes('purchase-check-p-03'));
 assert.match(candidateById.get('purchase-check-p-03').fields.expectedResult[0].value,/申請内容を確定/,'shared P-03 is a result guarantee, not a branch dependency');
}finally{candidateApp.w.close();}
assert.deepEqual(JSON.parse(independenceAuthority).checks.map(check=>check.id).sort(),['RESULT-INDEPENDENT-001','RESULT-INDEPENDENT-002','RESULT-INDEPENDENT-003','RESULT-INDEPENDENT-004']);

// The legend is presentation, while original business scope and table values
// remain in the new draft and the previously shared JSON is unchanged.
const displayCandidate=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v7-value-independent-review.json','utf8'));validate(displayCandidate);
const expectedDisplay=structuredClone(candidate);expectedDisplay.revision='purchase-v7-value-independent-review-1';
const displayChecks=expectedDisplay.documents.find(d=>d.kind==='checkItems');displayChecks.revision='checks-v10-value-independent-review-1';
const replacements=new Map([
 ['decision-draft-guarantee',['‐＝保存の可否を左右しない。','']],
 ['decision-submit-guarantee',['品目情報と購入理由が揃っている場合。‐＝その行では不問。','品目情報と購入理由が揃っている場合。']],
 ['decision-return-request-guarantee',['承認者が差戻しを判断する場合。‐＝購入準備番号の確定後は、申請状態が差戻しの可否を左右しない。','承認者が差戻しを判断する場合。']],
 ['decision-resubmit-request-guarantee',['同じ申請の再提出を選ぶ場合。‐＝その行では不問。見積があり上限以下でも、品目情報または購入理由が不足する場合の可否はこの表では示していません。','同じ申請の再提出を選ぶ場合。見積があり上限以下でも、品目情報または購入理由が不足する場合の可否はこの表では示していません。']],
 ['decision-prepare-approved-requests-guarantee',['差戻しとの競合がない場合。‐＝重複確定の可否を左右しない。','差戻しとの競合がない場合。']],
 ['decision-record-partial-receipts-guarantee',['‐＝その行では不問。','']]
]);
for(const [id,[before,after]] of replacements){const guarantee=displayChecks.guarantees.find(item=>item.id===id),block=guarantee.blocks.find(item=>item.kind==='prose');assert.equal(block.content[0].value,before);if(after)block.content[0].value=after;else guarantee.blocks.splice(guarantee.blocks.indexOf(block),1);}
assert.deepEqual(displayCandidate,expectedDisplay,'only the six display legends and version labels change');
const displayModel=displayCandidate.documents.find(d=>d.kind==='conceptModel'),displayApp=await appFor(displayCandidate);
try{
 displayApp.entry('group:tests').click();
 for(const view of displayModel.presentation.activityViews)for(const ref of view.testSpecificationFunctions??[]){
  const group=displayModel.reviewGroups.find(g=>g.id===ref.groupId),cap=group.capabilities.find(c=>c.id===ref.capabilityId),id=`fn:${view.activityId}:${group.id}:${cap.id}`;
  const page=displayApp.openSpec('decision',id);
  for(const section of page.querySelectorAll('[data-decision-example]')){const table=section.querySelector('table'),heads=[...table.querySelectorAll('thead tr:nth-child(2) th')],body=[...table.querySelectorAll('tbody tr')],usesDash=body.some(row=>[...row.children].slice(0,heads.length).some(cell=>['‐','-'].includes(cell.textContent.trim())));assert.equal((section.textContent.match(/‐＝値不問。/g)??[]).length,usesDash?1:0);}
 }
 const applyId=displayCandidate.documents.find(d=>d.kind==='businessDesign').activities.find(a=>a.name==='備品購入を申請する').id;
 assert.match(displayApp.openSpec('decision','fn:'+applyId+':group-request:submit-request').textContent,/品目情報と購入理由が揃っている場合/);
 const retryView=displayModel.presentation.activityViews.find(view=>view.testSpecificationFunctions?.some(ref=>ref.capabilityId==='resubmit-request'));
 assert.match(displayApp.openSpec('decision',`fn:${retryView.activityId}:group-request:resubmit-request`).textContent,/不足する場合の可否はこの表では示していません/);
}finally{displayApp.w.close();}

// A dash in a result/notes column does not make a condition value irrelevant.
const noteDash=structuredClone(candidate),noteDoc=noteDash.documents.find(d=>d.kind==='checkItems'),noteTable=noteDoc.examples.find(e=>e.id==='decision-submit-table'),noteGuarantee=noteDoc.guarantees.find(g=>g.id===noteTable.guaranteeId);
noteTable.rows=noteTable.rows.slice(0,1);noteTable.rows[0][3]=[{kind:'text',value:'‐'}];noteGuarantee.blocks[0].content=[{kind:'text',value:'前提'},{kind:'text',value:' '},{kind:'text',value:'説明。‐＝その行では不問。'},{kind:'text',value:'補足。'}];validate(noteDash);
const noteApp=await appFor(noteDash);try{const page=noteApp.openSpec('decision',key('submit-request'));assert.match(page.textContent,/前提 説明。補足。/);assert.doesNotMatch(page.textContent,/‐＝値不問。|その行では不問/);}finally{noteApp.w.close();}
assert.deepEqual(JSON.parse(valueIndependentAuthority).checks.map(check=>check.id).sort(),['VALUE-INDEPENDENT-001','VALUE-INDEPENDENT-002','VALUE-INDEPENDENT-003','VALUE-INDEPENDENT-004']);
assert.deepEqual([...covered].sort(),expected.slice().sort());
assert.deepEqual([...layoutCovered].sort(),layoutExpected.slice().sort());
assert.deepEqual([...groupCovered].sort(),groupExpected.slice().sort());assert.deepEqual([...resultCovered].sort(),resultExpected.slice().sort());
console.log(JSON.stringify({passed:[...covered].filter(id=>id!=='SPEC-SEPARATE-001'),partiallySuperseded:{id:'SPEC-SEPARATE-001',portion:'separate function menus and tabs',authority:'verification/activity-test-spec.check-items.json'},activities:bd.activities.length,checks:doc.items.length,scope:'explicit specification, purchase DOM and legacy URL; human review remains separate'}));
