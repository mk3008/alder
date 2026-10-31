import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {parseDocument} from '../src/document-input.ts';
import {createDataExamples} from '../src/data-examples.ts';
import {createConceptViews} from '../src/concept-views.ts';
import {stateCaptionSnapshot,assertStateCaptionRows} from './caption-row-oracle.mjs';

const authorityBytes=readFileSync('verification/purchase-v2-review.check-items.json');
const authorityHash='8c20bf4f3c4f2924c67f8b1720268555db99f2123e7d3a9ef1dba02adda0663c';
const sha=value=>createHash('sha256').update(value).digest('hex');
const expectedIds=Array.from({length:7},(_,i)=>'PURCHASE-V2-00'+(i+1));
function verifyAuthority(bytes){
 assert.equal(sha(bytes),authorityHash,'verification authority must remain unchanged');
 const parsed=JSON.parse(bytes);assert.deepEqual(parsed.checks.map(check=>check.id),expectedIds);
 for(const check of parsed.checks)for(const field of ['condition','guarantee','reason','source','verification'])assert(check[field],check.id+' '+field);
 return parsed;
}
const cardinalityAuthorityBytes=readFileSync('verification/concept-cardinality-display.check-items.json');
const cardinalityAuthorityHash='cda04609972882145a8b4ad616e2d96489136add7da87f6cbf862978454e2fb9';
function verifyCardinalityAuthority(bytes){assert.equal(sha(bytes),cardinalityAuthorityHash,'cardinality authority must stay unchanged');const a=JSON.parse(bytes);assert.deepEqual(a.checks.map(c=>c.id),['CARDINALITY-DISPLAY-001','CARDINALITY-DISPLAY-002','CARDINALITY-DISPLAY-003']);for(const c of a.checks)for(const field of ['condition','guarantee','reason','source','verification'])assert(c[field]);return a;}
const cardinalityAuthority=verifyCardinalityAuthority(cardinalityAuthorityBytes);const deletedCardinality=structuredClone(cardinalityAuthority);deletedCardinality.checks.pop();assert.throws(()=>verifyCardinalityAuthority(Buffer.from(JSON.stringify(deletedCardinality))),/authority must stay unchanged/);
const authority=verifyAuthority(authorityBytes);
const badAuthority=structuredClone(authority);badAuthority.checks.pop();
assert.throws(()=>verifyAuthority(Buffer.from(JSON.stringify(badAuthority))),/authority must remain unchanged/);
const coverage={
 'PURCHASE-V2-001':['business','model','empty-example'],
 'PURCHASE-V2-002':['finding','approved-example','prepared-example','states'],
 'PURCHASE-V2-003':['business','model','graph'],
 'PURCHASE-V2-004':['four-groups','roles','examples'],
 'PURCHASE-V2-005':['revisions','archive','source-boundary'],
 'PURCHASE-V2-006':['sample-values','navigation-contract'],
 'PURCHASE-V2-007':['standalone-columns','keys']
};
function verifyCoverage(expected,results){
 const wanted=Object.entries(expected).flatMap(([id,cases])=>cases.map(testCase=>id+':'+testCase)).sort();
 const actual=results.map(result=>result.id+':'+result.case).sort();
 assert.deepEqual(actual,wanted,'all authority cases must be covered exactly once');
 assert(results.every(result=>result.status==='pass'));
}
const expectedResults=Object.entries(coverage).flatMap(([id,cases])=>cases.map(testCase=>({id,case:testCase,status:'pass'})));
const missingCase=structuredClone(coverage);missingCase['PURCHASE-V2-001'].pop();
assert.throws(()=>verifyCoverage(missingCase,expectedResults),/all authority cases/);
assert.throws(()=>verifyCoverage(coverage,expectedResults.slice(1)),/all authority cases/);
const results=[];
const pass=(id,testCase)=>results.push({id,case:testCase,status:'pass'});

const base='../work/concept-review/issue-133/versions/';
const raw=readFileSync(base+'purchase-v2-beta.json','utf8'),pkg=JSON.parse(raw);
const model=JSON.parse(readFileSync(base+'purchase-concepts-v2-beta.json','utf8'));
const bd=pkg.documents.find(x=>x.kind==='businessDesign'),states=pkg.documents.find(x=>x.kind==='stateTransition');
const original=readFileSync(base+'purchase-v1.json');
assert.equal(sha(original),'ed5e26675c97ab4376c781cc7a47f72806c8e53d38d428540931c61f0e8b024e');
pass('PURCHASE-V2-005','archive');
assert.equal(model.basedOn.documentId,bd.id);assert.equal(model.basedOn.revision,bd.revision);
assert.equal(states.basedOn.revision,bd.revision);assert.equal(model.relatedStates[0].revision,states.revision);
assert.equal(model.basedOn.verification,'unverified');
pass('PURCHASE-V2-005','revisions');
const draft=bd.exceptions.find(e=>e.name==='下書き保存'),finding=bd.findings.find(f=>f.sourceId==='F05');
assert.match(draft.description,/前提条件を設けず/);assert.match(draft.description,/品目が0件/);
const draftOutput=bd.relations.find(relation=>relation.kind==='output'&&relation.fromId===draft.activityId&&relation.label.includes('下書き'));
assert(draftOutput);assert.match(draftOutput.label,/元の状態・承認・購入準備を保つ案/);
assert(!draftOutput.label.includes('保存後の状態は未決'));
pass('PURCHASE-V2-001','business');
assert.match(draft.description,/元の申請状態・提出内容・承認・購入準備を変更しない/);
assert.match(draft.description,/仮説/);assert.equal(finding.status,'open');assert.match(finding.content,/採否/);
assert.match(finding.content,/再提出/);
pass('PURCHASE-V2-002','finding');
assert.equal(states.completeness,'partial');
const draftSave=states.transitions.find(t=>t.sourceId==='T19');
assert(draftSave);assert.equal(draftSave.fromId,draftSave.toId);assert.equal(draftSave.condition,'下書きを保存する');
assert.equal(draftSave.effect,'unchanged');assert.equal(draftSave.exceptionId,draft.id);assert.match(draftSave.note,/仮説/);
for(const name of ['購入準備済み','作業中','終結','破棄'])assert(states.states.some(s=>s.name===name));
const discard=states.states.find(state=>state.name==='破棄');
assert.equal(bd.findings.find(f=>f.sourceId==='F06').status,'open');
for(const sourceId of ['T07','T10']){const t=states.transitions.find(x=>x.sourceId===sourceId);assert.equal(t.toId,discard.id);assert.equal(t.effect,'change');assert.match(t.note,/仮説/);}
for(const sourceId of ['T08','T11']){const t=states.transitions.find(x=>x.sourceId===sourceId);assert.equal(t.fromId,t.toId);assert.equal(t.effect,'unchanged');assert.match(t.note,/仮説/);}
const failedNew=states.transitions.find(t=>t.sourceId==='T03');assert.equal(failedNew.effect,'no-create');assert.equal(failedNew.toId,'@none');
assert(states.transitions.every(t=>t.toId!=='@unknown'),'review uses an explicit proposed result');
pass('PURCHASE-V2-002','states');
assert(bd.relations.every(r=>!r.label.includes('未決')),'graph labels contain business information, not internal tracking');
assert(bd.objects.every(o=>o.information.every(i=>!i.includes('未決'))),'object labels contain business information, not internal tracking');
const application=bd.objects.find(o=>o.name==='購入申請');
const stateInfo=application.information.find(i=>i.startsWith('状態（'));
for(const state of states.states)assert(stateInfo.includes(state.name),'state referenced by Object: '+state.name);
assert(pkg.diagnostics.some(d=>d.includes('合意の記録')),'internal unresolved details remain in diagnostics');
const apply=bd.activities.find(a=>a.name==='備品購入を申請する');
assert(apply&&draft.activityId===apply.id);
assert(model.reviewGroups.every(group=>bd.roles.some(role=>role.id===group.reviewer.roleId)));
assert.equal(model.reviewGroups.length,4);
pass('PURCHASE-V2-004','four-groups');
pass('PURCHASE-V2-004','roles');
const informationIds=new Set(model.concepts.flatMap(concept=>concept.information.map(info=>info.id)));
for(const group of model.reviewGroups){
 assert(group.structureStatements.length,'each group describes its information structure');
 const samples=group.capabilities.flatMap(capability=>capability.samples);
 for(const item of group.structureStatements){
  assert(item.sampleIds.every(id=>samples.some(sample=>sample.id===id)));
  assert(item.sourceRefs.length);
  for(const ref of item.sourceRefs){assert.equal(ref.documentId,bd.id);assert.equal(ref.revision,bd.revision);assert(bd.activities.some(a=>a.id===ref.targetId&&typeof a[ref.section]==='string'));}
 }
 for(const sample of samples)for(const block of sample.blocks){
  for(const column of block.columns)assert(informationIds.has(column.informationId),sample.id+' / '+column.name);
  for(const row of block.rows)assert.deepEqual(row.cells.map(cell=>cell.columnId).sort(),block.columns.map(column=>column.id).sort(),sample.id+' cell references');
 }
 for(const id of group.relatedActivityIds)assert(bd.activities.some(a=>a.id===id));
}
pass('PURCHASE-V2-004','examples');
const groups=Object.fromEntries(model.reviewGroups.map(g=>[g.id,g]));
const request=groups['group-request'],handoff=groups['group-handoff'];
assert(!handoff.description.includes('1件以上'));
assert(!handoff.capabilities[0].description.includes('1件以上'));
pass('PURCHASE-V2-003','model');
assert.equal(handoff.graph.edges.find(e=>e.id==='prepared-requests-view').toLabel,'N');
const globalPreparation=model.relations.find(r=>r.id==='preparation-request');
assert.deepEqual([globalPreparation.fromLabel,globalPreparation.toLabel],['0..1','N']);
assert.equal(globalPreparation.fromPerTarget,'単一または未準備');assert.equal(globalPreparation.toPerSource,'複数');
assert.match(model.meta.cardinalityNotation.N,/最小件数/);
for(const edge of [...model.relations,...model.reviewGroups.flatMap(g=>g.graph.edges)])for(const label of [edge.fromLabel,edge.toLabel])assert.match(label,/^(?:1|0\.\.1|N|0\.\.N|1\.\.N)$/,'all model endpoints use numeric notation: '+edge.id);

pass('PURCHASE-V2-003','graph');
const prepare=bd.activities.find(a=>a.name==='購入を準備する');
assert.match(prepare.procedure,/一つの申請の品目を別々の準備へ分割しない/);
assert.match(prepare.procedure,/選択した申請を同じ番号に紐づける/);
pass('PURCHASE-V2-003','business');
const save=request.capabilities.find(c=>c.id==='save-draft');
assert.match(save.description,/入力内容・品目数・申請の状態を問わず/);
pass('PURCHASE-V2-001','model');
const sample=id=>save.samples.find(s=>s.id===id);
assert.equal(sample('request-draft-empty').blocks.find(b=>b.card==='item').rows.length,0);
pass('PURCHASE-V2-001','empty-example');
for(const [id,status] of [['request-draft-approved','承認済み'],['request-draft-prepared','購入準備済み']]){
 const example=sample(id);assert(example);
 const read=card=>{const block=example.blocks.find(b=>b.card===card);return block.rows.map(row=>Object.fromEntries(block.columns.map(column=>[column.name,row.cells.find(cell=>cell.columnId===column.id)?.value])));};
 const [header]=read('request'),versions=read('version'),items=read('item');
 assert.equal(header['保存前の状態'],status);assert.equal(header['保存後の状態'],status);assert.equal(header['承認対象版'],'V1');
 assert.deepEqual(versions.map(row=>[row['版'],row['状態'],row['承認']]),[['V1','提出済み','承認済み'],['D1','下書き','未提出']]);
 assert.deepEqual(items.map(row=>[row['版'],row['品名'],row['依頼数量 Q']]),[['V1','ボールペン',10],['D1','ボールペン',12]]);
 if(status==='購入準備済み')assert.equal(header['準備番号'],'P-001');
 pass('PURCHASE-V2-002',status==='承認済み'?'approved-example':'prepared-example');
}
assert(request.limitations.some(item=>item.id==='no-overwrite-by-draft'));
assert.equal(request.meta.hypotheses[0].status,'未合意');
for(const example of [sample('request-draft-approved'),sample('request-draft-prepared')]){
 const columns=example.blocks.find(b=>b.card==='request').columns.map(c=>c.name);
 for(const name of ['申請','保存前の状態','保存後の状態','承認対象版'])assert(columns.includes(name));
}
pass('PURCHASE-V2-007','standalone-columns');
// The frozen old sample remains intact; its explicit data is now read from one package.
const unified=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v3-beta.json','utf8'));
const unifiedModel=unified.documents.find(item=>item.kind==='conceptModel');
assert.deepEqual(unified.documents.find(item=>item.kind==='businessDesign'),bd);
assert.deepEqual(unified.documents.find(item=>item.kind==='stateTransition'),states);
const preserved=structuredClone(unifiedModel);delete preserved.schemaVersion;delete preserved.presentation.sampleCaption;
// Project the explicitly authorized V3 identity additions away before comparing
// every other model field with the frozen V2 source. The old source is not edited.
const identificationNotes={request:'申請の識別で、別の申請と区別する想定。',version:'申請と、その申請内の版の識別を組み合わせて区別する想定。',item:'申請版と、その版内の品目の識別を組み合わせて区別する想定。'};
for(const c of preserved.concepts)if(identificationNotes[c.id]){assert(c.description.endsWith(identificationNotes[c.id]));c.description=c.description.slice(0,-identificationNotes[c.id].length);}
for(const g of preserved.reviewGroups){
 for(const node of g.graph.nodes)if(identificationNotes[node.conceptId]){assert(node.description.endsWith(identificationNotes[node.conceptId]));node.description=node.description.slice(0,-identificationNotes[node.conceptId].length);}
 for(const cap of g.capabilities)for(const example of cap.samples)for(const block of example.blocks){
  const addedId=`${example.id}-${block.card}-item-identity`;
  if(['result-partial','result-closed'].includes(example.id)&&['item','line'].includes(block.card)){
   const added=block.columns.find(column=>column.id===addedId);assert(added&&added.informationId===(block.card==='item'?'item-information-1':'line-information-2'));
   block.columns=block.columns.filter(column=>column.id!==addedId);
   for(const row of block.rows){assert.equal(row.cells.filter(cell=>cell.columnId===addedId).length,1);row.cells=row.cells.filter(cell=>cell.columnId!==addedId);}
  }
  for(const row of block.rows)for(const cell of row.cells)if(cell.linkId?.startsWith('version:'))delete cell.linkId;
 }
}
preserved.kind=model.kind;preserved.revision=model.revision;preserved.format=model.format;preserved.formatVersion=model.formatVersion;
assert.deepEqual(preserved,model,'the explicit model and all review content survive one-file integration');
const changed=structuredClone(unified);changed.documents.find(item=>item.kind==='conceptModel').reviewGroups[0].capabilities[0].description='表示される更新内容';
const loaded=parseDocument(JSON.stringify(changed));
assert.equal(createDataExamples({business:loaded.model.business,model:loaded.model.concepts[0]}).reviewContents[0].capabilities[0].description,'表示される更新内容');
const stale=structuredClone(unified);stale.documents.find(item=>item.kind==='conceptModel').basedOn.revision='obsolete';
assert.throws(()=>parseDocument(JSON.stringify(stale)),/matching in-package BD revision/);
for(const file of ['src/data-examples.ts','src/concept-views.ts','src/logical-subsystems.ts','src/viewer-shell.ts'])assert(!readFileSync(file,'utf8').includes('purchase-review'),'product must not depend on the purchase fixture');
pass('PURCHASE-V2-005','source-boundary');

// The nine older scenes keep their existing cells, while independent status and key columns may be added.
const legacy=JSON.parse(readFileSync('src/business-review-content.json','utf8'));
const currentSamples=model.reviewGroups.flatMap(group=>group.capabilities.flatMap(cap=>cap.samples));
const normalize=name=>({'品名（V1）':'品名','元の品名（V1）':'元の品名'}[name]??name);
let previousCount=0;
for(const group of legacy.groups)for(const capability of group.capabilities)for(const old of capability.samples){
 const next=currentSamples.find(item=>item.id===old.id);assert(next,old.id);previousCount++;
 for(const block of old.blocks){
  const updated=next.blocks.find(item=>item.card===block.card);assert(updated);
  assert.equal(updated.rows.length,block.rows.length,old.id+' row count');
  for(const [rowIndex,row] of block.rows.entries())for(const [index,value] of row.entries()){
   const column=updated.columns.find(item=>item.name===normalize(block.columns[index]));assert(column,old.id+' '+block.columns[index]);
   const cell=updated.rows[rowIndex].cells.find(item=>item.columnId===column.id);assert.equal(cell?.value,value,old.id+' cell value');
  }
 }
}
assert.equal(previousCount,9);
pass('PURCHASE-V2-006','sample-values');
execFileSync(process.execPath,['web/test-navigation-authority-gate.mjs'],{stdio:'pipe'});
execFileSync(process.execPath,['--experimental-strip-types','web/review-navigation-contract.mjs'],{stdio:'pipe'});
pass('PURCHASE-V2-006','navigation-contract');

const sampleBundle=await build({entryPoints:['web/fixtures/concept-sample.ts'],bundle:true,write:false,format:'iife',globalName:'Samples'});
const groupsBundle=await build({entryPoints:['web/fixtures/concept-sample.ts'],bundle:true,write:false,format:'iife',globalName:'Groups'});
const sampleWindow=new JSDOM('<body></body>',{runScripts:'outside-only'}).window;
sampleWindow.eval(sampleBundle.outputFiles[0].text+';window.Samples=Samples;');
sampleWindow.eval(groupsBundle.outputFiles[0].text+';window.Groups=Groups;');
const card=sampleWindow.document.createElement('article');
sampleWindow.Samples.renderDataExample(card,sampleWindow.Groups.findReviewGroup('group-request'),'request-draft-approved',()=>{});
const requestCells=[...card.querySelectorAll('[data-sample-key="request:R-101"]')];
assert(requestCells.length>=4);assert(requestCells[0].dataset.keyTone);assert(requestCells.every(cell=>cell.dataset.keyTone===requestCells[0].dataset.keyTone));
for(const version of ['V1','D1']){const cells=[...card.querySelectorAll(`[data-sample-key="version:R-101:${version}"]`)];assert(cells.length>=2);assert(cells.every(cell=>cell.dataset.keyTone===cells[0].dataset.keyTone));}
assert.notEqual(card.querySelector('[data-sample-key="version:R-101:V1"]').dataset.keyTone,card.querySelector('[data-sample-key="version:R-101:D1"]').dataset.keyTone);
const oldSamples=createDataExamples({business:bd,model}),oldGroup=createConceptViews({model}).findGroup('group-request'),oldCard=sampleWindow.document.createElement('article');
oldSamples.renderDataExample(oldCard,oldGroup,'request-draft-approved',()=>{});
for(const cell of oldCard.querySelectorAll('td'))if(['V1','D1'].includes(cell.textContent))assert(!cell.dataset.keyTone,'the frozen V2 data is not recolored');
sampleWindow.close();
pass('PURCHASE-V2-007','keys');

// Exercise the actual renderer, including the expanded state graph, from the same V2 JSON.
const design=parseDocument(raw),stateModel=design.objectStateTransitions[states.objectId].model;
const built=await build({entryPoints:['src/state-transitions.ts'],bundle:true,write:false,format:'iife',globalName:'StateUI'});
const window=new JSDOM('<body></body>',{runScripts:'outside-only'}).window;
window.eval(built.outputFiles[0].text+';window.StateUI=StateUI;');
const panel=window.StateUI.stateTransitionPanel(design,states.objectId,()=>{});
assert.equal(panel.querySelectorAll('[data-transition]').length,states.transitions.length);
const svg=panel.querySelector('.state-diagram');assert(svg);
assert.match(svg.textContent,/作成なし/);assert(!svg.textContent.includes('保存不可'));assert(![...svg.querySelectorAll('[data-state]')].some(n=>n.getAttribute('data-state')==='@unknown'));
for(const path of svg.querySelectorAll('path[d]'))assert(!/NaN|Infinity/.test(path.getAttribute('d')));
assertStateCaptionRows(stateCaptionSnapshot(svg),stateModel.transitions);
window.close();
verifyCoverage(coverage,results);
console.log(JSON.stringify({authority:{sha256:authorityHash,ids:expectedIds},cases:results.length,
 businessRevision:bd.revision,stateRevision:states.revision,modelRevision:model.revision,
 checks:'source/role/revision, 0-item draft, approved and prepared drafts, state SVG, original nine scenes; three authority/coverage negative cases',
 limitation:'same-author read-only verification; business hypothesis is not approved'},null,2));
