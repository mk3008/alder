import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validate,requireCheckedSamples,exampleCheckIds} from './core.mjs';
import {guardAuthoring} from './authoring.mjs';
import {applyEdits} from './edit.mjs';
import {convertMarkdown} from './convert.mjs';

// Existing, explicitly labelled preview Checks are used only as a technical fixture.
const fixture=JSON.parse(readFileSync(new URL('../../work/concept-review/issue-133/versions/purchase-v3-beta-test-spec-preview.json',import.meta.url),'utf8'));
const strict=()=>{
 const pkg=structuredClone(fixture),model=pkg.documents.find(doc=>doc.kind==='conceptModel');model.schemaVersion='0.2';
 for(const group of model.reviewGroups){
  for(const cap of group.capabilities){
   const id=cap.id==='save-draft'?'request-draft':cap.id==='prepare-approved-requests'?'handoff-batch':null;
   cap.samples=cap.samples.filter(sample=>sample.id===id);
   for(const sample of cap.samples)sample.checkIds=[cap.id==='save-draft'?'preview-check-draft':'preview-check-handoff'];
  }
  const available=new Set(group.capabilities.flatMap(cap=>cap.samples.map(sample=>sample.id)));
  for(const statement of group.structureStatements)statement.sampleIds=statement.sampleIds.filter(id=>available.has(id));
 }
 return pkg;
};
const sample=pkg=>pkg.documents.find(doc=>doc.kind==='conceptModel').reviewGroups[0].capabilities[0].samples[0];
test('new samples require explicit Checks in the same Business Design and accept shared references',()=>{
 const pkg=strict();validate(pkg);assert.deepEqual(sample(pkg).checkIds,['preview-check-draft']);
 for(const mutate of [
  p=>delete sample(p).checkIds,
  p=>sample(p).checkIds=[],
  p=>sample(p).checkIds=['missing-check'],
  p=>sample(p).checkIds=['preview-check-draft','preview-check-draft'],
  p=>sample(p).checkIds=['purchase-bd'],
  p=>p.documents=p.documents.filter(doc=>doc.kind!=='checkItems')
 ]){const broken=structuredClone(pkg);mutate(broken);assert.throws(()=>validate(broken));}
 const other=structuredClone(pkg);
 other.externalDocuments.push({id:'other-bd',kind:'businessDesign',revision:'other-r1',activities:[{id:'other-activity',name:'別の業務'}]});
 other.sources.push({documentId:'other-bd',revision:'other-r1',sha256:'0'.repeat(64),uri:''});
 other.documents.push({id:'other-check-doc',schemaVersion:'0.1',kind:'checkItems',revision:'other-check-r1',title:'別のCheck',basedOn:{documentId:'other-bd',revision:'other-r1',verification:'unverified'},intro:[],index:[{activityId:'other-activity',purpose:'',connections:'',checkIds:['other-check']}],sections:[{id:'other-section',activityId:'other-activity',title:'別の業務',preamble:[]}],guarantees:[],examples:[],items:[{id:'other-check',checkId:'OTHER-1',title:'別の保証',detailSummary:'',sectionId:'other-section',reviewState:'未レビュー',fields:{guarantee:[{kind:'text',value:'別の業務の保証'}]}}],notes:[]});
 validate(other);sample(other).checkIds=['other-check'];assert.throws(()=>validate(other),/Sample Check source mismatch/);
});
test('function decision and result references are explicit, scoped and may omit samples',()=>{
 const pkg=strict(),model=pkg.documents.find(d=>d.kind==='conceptModel'),doc=pkg.documents.find(d=>d.kind==='checkItems');
 const cap=model.reviewGroups.flatMap(group=>group.capabilities).find(value=>value.id==='save-draft'),item=doc.items.find(value=>value.id==='preview-check-draft');
 doc.guarantees.push({id:'test-decision-guarantee',sectionId:item.sectionId,title:'可否',blocks:[{kind:'prose',content:[{kind:'text',value:'判定条件'}]},{kind:'example',exampleId:'test-decision-table'}]});
 doc.examples.push({id:'test-decision-table',guaranteeId:'test-decision-guarantee',columns:['条件','Check'],rows:[[[{kind:'text',value:'不問'}],[{kind:'reference',targetId:item.id,label:item.checkId}]]]});
 cap.testSpecification={decisionExampleIds:['test-decision-table'],decisionCheckIds:[item.id],resultCheckIds:[item.id],sampleIds:['request-draft']};
 validate(pkg);requireCheckedSamples(pkg);
 const onlyDecision=structuredClone(pkg),onlyCap=onlyDecision.documents.find(d=>d.kind==='conceptModel').reviewGroups.flatMap(g=>g.capabilities).find(c=>c.id==='save-draft');
 onlyCap.samples=[];onlyCap.testSpecification.sampleIds=[];onlyCap.testSpecification.resultCheckIds=[];
 for(const group of onlyDecision.documents.find(d=>d.kind==='conceptModel').reviewGroups)for(const statement of group.structureStatements)statement.sampleIds=statement.sampleIds.filter(id=>id!=='request-draft');
 validate(onlyDecision);
 for(const mutate of [
  c=>c.testSpecification.decisionCheckIds=['missing-check'],
  c=>c.testSpecification.decisionCheckIds=['purchase-bd'],
  c=>c.testSpecification.decisionCheckIds=[item.id,item.id],
  c=>c.testSpecification.decisionCheckIds=[],
  c=>c.testSpecification.decisionExampleIds=['missing-table'],
  c=>c.testSpecification.decisionExampleIds=[item.id],
  c=>c.testSpecification.resultCheckIds=[],
  c=>c.testSpecification.sampleIds=['handoff-batch'],
  c=>c.testSpecification.sampleIds=['request-draft','request-draft']
 ]){const broken=structuredClone(pkg),bad=broken.documents.find(d=>d.kind==='conceptModel').reviewGroups.flatMap(g=>g.capabilities).find(c=>c.id==='save-draft');mutate(bad);assert.throws(()=>validate(broken));}
 const orphan=structuredClone(pkg),orphanDoc=orphan.documents.find(d=>d.kind==='checkItems');orphanDoc.examples.find(e=>e.id==='test-decision-table').rows[0][1]=[{kind:'text',value:'関連なし'}];
 assert.throws(()=>validate(orphan),/Function decision table needs a Check/);
 const other=structuredClone(pkg);other.externalDocuments.push({id:'other-bd',kind:'businessDesign',revision:'other-r1',activities:[{id:'other-activity',name:'別の業務'}]});
 other.sources.push({documentId:'other-bd',revision:'other-r1',sha256:'0'.repeat(64),uri:''});
 other.documents.push({id:'other-check-doc',schemaVersion:'0.1',kind:'checkItems',revision:'other-check-r1',title:'別のCheck',basedOn:{documentId:'other-bd',revision:'other-r1',verification:'unverified'},intro:[],index:[{activityId:'other-activity',purpose:'',connections:'',checkIds:['other-check']}],sections:[{id:'other-section',activityId:'other-activity',title:'別の業務',preamble:[]}],guarantees:[],examples:[],items:[{id:'other-check',checkId:'OTHER-1',title:'別の保証',detailSummary:'',sectionId:'other-section',reviewState:'未レビュー',fields:{guarantee:[{kind:'text',value:'別の業務の保証'}]}}],notes:[]});
 validate(other);other.documents.find(d=>d.kind==='conceptModel').reviewGroups.flatMap(g=>g.capabilities).find(c=>c.id==='save-draft').testSpecification.decisionCheckIds.push('other-check');
 assert.throws(()=>validate(other),/Function Check source mismatch/);
});
test('an explicitly linked function decision table does not need a placeholder prose guarantee',()=>{
 const pkg=strict(),model=pkg.documents.find(d=>d.kind==='conceptModel'),doc=pkg.documents.find(d=>d.kind==='checkItems');
 const cap=model.reviewGroups.flatMap(g=>g.capabilities).find(c=>c.id==='save-draft'),item=doc.items.find(i=>i.id==='preview-check-draft');
 doc.guarantees.push({id:'table-only-guarantee',sectionId:item.sectionId,title:'可否',blocks:[{kind:'example',exampleId:'table-only-example'}]});
 doc.examples.push({id:'table-only-example',guaranteeId:'table-only-guarantee',columns:['条件','結果','Check'],rows:[[[{kind:'text',value:'‐'}],[{kind:'text',value:'可'}],[{kind:'reference',targetId:item.id,label:item.checkId}]]]});
 cap.testSpecification={decisionExampleIds:['table-only-example'],decisionCheckIds:[item.id],resultCheckIds:[item.id],sampleIds:['request-draft']};
 validate(pkg);requireCheckedSamples(pkg);
 const unassigned=structuredClone(pkg);unassigned.documents.find(d=>d.kind==='conceptModel').reviewGroups.flatMap(g=>g.capabilities).find(c=>c.id==='save-draft').testSpecification.decisionExampleIds=[];
 assert.throws(()=>validate(unassigned),/General guarantee prose required/);
 const unlinked=structuredClone(pkg);unlinked.documents.find(d=>d.kind==='checkItems').examples.find(e=>e.id==='table-only-example').rows[0][2]=[{kind:'text',value:'未関連'}];
 assert.throws(()=>validate(unlinked),/General guarantee prose required|Function decision table needs a Check/);
 const emptyCheck=structuredClone(pkg);emptyCheck.documents.find(d=>d.kind==='checkItems').items.find(i=>i.id===item.id).fields={};
 assert.throws(()=>validate(emptyCheck),/Check guarantee required/);
});
test('legacy concept samples stay readable but are not silently upgraded',()=>{
 validate(fixture);const next=structuredClone(fixture),model=next.documents.find(d=>d.kind==='conceptModel');next.revision+='-new';model.revision+='-new';model.schemaVersion='0.2';
 for(const group of model.reviewGroups)for(const capability of group.capabilities)for(const example of capability.samples)example.checkIds=['preview-check-draft'];
 assert.throws(()=>guardAuthoring(fixture,next,{expectedRevision:fixture.revision}),/Document contract changed/);
 assert.equal(guardAuthoring(fixture,next,{expectedRevision:fixture.revision,migration:'check-samples-0.2'}).valid,true);
 const changed=structuredClone(fixture);changed.revision+='-new';const oldModel=changed.documents.find(d=>d.kind==='conceptModel');oldModel.revision+='-new';oldModel.reviewGroups[0].capabilities[0].samples[0].meaning+=' changed';
 assert.throws(()=>guardAuthoring(fixture,changed,{expectedRevision:fixture.revision}),/Legacy samples require explicit Check references/);
 const unrelated=structuredClone(fixture);unrelated.revision+='-new';const changedModel=unrelated.documents.find(d=>d.kind==='conceptModel');changedModel.revision+='-new';changedModel.benefits.push('別の変更');
 assert.equal(guardAuthoring(fixture,unrelated,{expectedRevision:fixture.revision}).valid,true,'unchanged legacy samples survive unrelated edits');
 const original=fixture.documents.find(d=>d.kind==='conceptModel');
 assert.doesNotThrow(()=>applyEdits(fixture,{expectedRevision:fixture.revision,revision:fixture.revision+'-edit',documentRevisions:{[original.id]:{expected:original.revision,next:original.revision+'-edit'}},changes:[{id:original.id,values:{benefits:[...original.benefits,'別の変更']}}]}));
});
test('linking examples does not bypass the exact-revision Business Design confirmation gate',()=>{
 const previous=structuredClone(fixture);previous.documents=previous.documents.filter(doc=>doc.kind!=='checkItems');
 const next=structuredClone(previous),model=next.documents.find(doc=>doc.kind==='conceptModel');next.revision+='-new';model.revision+='-new';model.schemaVersion='0.2';
 next.documents.push(structuredClone(fixture.documents.find(doc=>doc.kind==='checkItems')));
 for(const group of model.reviewGroups)for(const cap of group.capabilities)for(const example of cap.samples)example.checkIds=['preview-check-draft'];
 validate(previous);validate(next);
 assert.throws(()=>guardAuthoring(previous,next,{expectedRevision:previous.revision,migration:'check-samples-0.2'}),/Human Business Design confirmation for this exact revision is required/);
});
test('Check comparison tables require an explicit Check connection on save',()=>{
 const pkg=JSON.parse(readFileSync(new URL('./examples/purchase.json',import.meta.url),'utf8'));
 const doc=pkg.documents.find(d=>d.kind==='checkItems'),example=doc.examples[0];
 assert(exampleCheckIds(doc,example).length>0);requireCheckedSamples(pkg);
 const bad=structuredClone(pkg),check=bad.documents.find(d=>d.kind==='checkItems'),first=check.examples[0],guarantee=check.guarantees.find(g=>g.id===first.guaranteeId);
 const strip=runs=>runs.filter(run=>run.kind!=='reference');
 for(const row of first.rows)for(let i=0;i<row.length;i++)row[i]=strip(row[i]);
 for(const block of guarantee.blocks)if(block.kind==='prose')block.content=strip(block.content);
 for(const item of check.items)item.fields.guarantee=strip(item.fields.guarantee??[]);
 assert.equal(exampleCheckIds(check,first).length,0);
 assert.throws(()=>requireCheckedSamples(bad),/Check example needs an explicit Check reference/);
});
test('Markdown conversion refuses an unlinked Check example instead of saving it',()=>{
 const revision='c2852531ad62691c375e87818d8c3a49fd19803f';
 const read=relative=>readFileSync(new URL('../../'+relative,import.meta.url),'utf8');
 const original=read('work/check-item-examples/meaning-validation-20261018/purchase/final.md');
 const start=original.indexOf('### 申請の条件・保証と例'),end=original.indexOf('## 購入申請を承認する');
 assert(start>=0&&end>start);
 const section=original.slice(start,end)
  .replaceAll('[JA-EX-01](#ja-ex-01--新しい購入申請が提出済みになる)','JA-EX-01')
  .replace('- 条件・期待結果：[申請の条件・保証と例](#申請の条件保証と例)に示す JA-EX-01 の一般保証を参照。[同節の比較例](#申請の条件保証と例)','- 条件・期待結果：適用条件と結果を確認する。');
 const sources=[{documentId:'purchase-bd',kind:'businessDesign',revision,uri:`https://github.com/mk3008/alder/blob/${revision}/business-design/purchase-request/README.md`,text:read('business-design/purchase-request/README.md')},{documentId:'purchase-checks',kind:'checkItems',revision:'checks-1',basedOn:{documentId:'purchase-bd',revision},text:original.slice(0,start)+section+original.slice(end)}];
 assert.throws(()=>convertMarkdown({revision:'pkg-1',sources}),/Check example needs an explicit Check reference/);
});
