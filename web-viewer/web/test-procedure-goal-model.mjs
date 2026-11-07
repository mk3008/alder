import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const authority='../work/normalization-candidate/procedure-goal-acceptance.json';
const authorityHash='dcee0d7830a08fa1869dc07b791533db990f7d1c5223ba05eef8dc149238b087';
const sourceHashes={
 '../work/normalization-candidate/complete-review-acceptance.json':'074aa8cc645368d73846fbc25abb96f5f6eee047132e19d42df26269b8dbf0f8',
 '../work/normalization-candidate/complete-review-identity-checks.json':'52206635d478c99ea4f8bc2a258ca48d75de50116f0b9eb186a74bfa1e7d63a7',
 'verification/structure-explorer-compatibility.check-items.json':'7b0cc06903c9bde5b1e449e4d5edf2a4a7bff67dcb4e5ae83ba0960f4931b2c0',
 '../business-design/alder/business-design.json':'b8356070947d73502197e08560a9084e139aa8c0f7c88c64109a98502d7182c9',
 '../business-design/alder/json-normalized-model-review.json':'708023cc112e137f66d295213b50dd8c67e52737b3e0fdd02ca0718aef93ab36',
 '../work/normalization-candidate/example-source.json':'fa94aa2098a3a4578648c2403f184bb73bb65e2e40311442f9e7d848743d0b8f',
 '../work/normalization-candidate/example-normalized.json':'cfb0ee8dd1dd7b0aa99e868abc3844542c3c6881cc7c8315fb8f3a5a6566152a',
 '../tools/document_storage/schema.mjs':'e46e388660df746173e16e8c72b56e9a9a74f6fcd6935f5bff304737961dddb2'
};
function authorityBytes(){const bytes=readFileSync(authority);assert.equal(hash(bytes),authorityHash,'fixed procedure authority');return bytes;}
function unchangedSources(){for(const [path,expected] of Object.entries(sourceHashes))assert.equal(hash(readFileSync(path)),expected,path);}
const checks=JSON.parse(authorityBytes()).checks.map(item=>item.id),covered=[];
function coverage(ids){assert.deepEqual([...ids].sort(),checks.slice().sort());assert.equal(new Set(ids).size,checks.length);}
assert.throws(()=>coverage(checks.slice(1)));assert.throws(()=>coverage([...checks,checks[0]]));
unchangedSources();
const candidatePath='../business-design/alder/json-complete-concept-review.json',candidateBytes=readFileSync(candidatePath);
const pkg=JSON.parse(candidateBytes),model=pkg.documents.find(document=>document.kind==='conceptModel');
const concept=id=>{const value=model.concepts.find(item=>item.id===id);assert(value,id);return value;};
const relation=id=>{const value=model.relations.find(item=>item.id===id);assert(value,id);return value;};
const mapping=physical=>{const value=model.meta.fieldMappings.find(item=>item.physicalName===physical);assert(value,physical);return value;};
const owner=id=>model.concepts.find(item=>item.information.some(field=>field.id===id));
const byName=(id,name)=>{const field=concept(id).information.find(item=>item.name===name);assert(field,id+' '+name);return model.meta.fieldMappings.find(item=>item.informationId===field.id);};
const edge=(id,from,to,kind,fromCount,toCount)=>{const value=relation(id);assert.deepEqual([value.fromConceptId,value.toConceptId,value.kind,value.fromLabel,value.toLabel],[from,to,kind,fromCount,toCount],id);};

assert.match(concept('n-activity').description,/目的.*標準手順.*未達/);
assert.match(concept('n-exception').description,/目的.*中断・終了.*エラーではない/);
assert.match(relation('nr-activity-exception').condition,/後続の業務に影響|扱いを明記/);
edge('nr-activity-exception','n-activity','n-exception','down','1','0..N');
covered.push('PROCEDURE-GOAL-01');

edge('nr-activity-step','n-activity','n-flow-step','down','0..1','1..N');
edge('nr-exception-step','n-exception','n-flow-step','down','0..1','0..N');
edge('nr-flow-step-definition','n-flow-step','n-step','reference','0..N','1');
edge('nr-continuity-interrupted','n-continuity','n-step','reference','0..N','0..1');
edge('nr-continuity-resume','n-continuity','n-step','reference','0..N','0..1');
edge('nr-continuity-data','n-continuity','n-data','reference','0..N','0..N');
const order=byName('n-flow-step','手順の順序');assert.equal(order.valueType,'number');assert.match(order.logicalMeaning,/フロー.*順序/);
assert.match(concept('n-flow-step').description,/順序と実施条件.*複数の流れ/);
// Different flow entries can point to the same response Step while retaining
// different positions and conditions; the reference's reverse side is 0..N.
assert.equal(relation('nr-flow-step-definition').fromLabel,'0..N');
assert.equal(owner(mapping('steps.action').informationId).id,'n-step');
covered.push('PROCEDURE-GOAL-02');

const obligation=mapping('steps.obligation'),condition=mapping('steps.appliesWhen');
assert.equal(owner(obligation.informationId).id,'n-flow-step');
assert.equal(model.meta.compatibilityReview.fields[obligation.informationId].kind,'legacy');
assert.equal(model.meta.compatibilityReview.fields[condition.informationId],undefined);
assert.equal(owner(condition.informationId).id,'n-flow-step');assert.match(condition.logicalMeaning,/重ねて記載せず.*別の条件/);
assert.equal(byName('n-flow-step','実施条件の確定状態').valueType,'string（未決／無条件／条件あり）');
edge('nr-step-when','n-flow-step','n-row','reference','0..N','0..1');
const oldOptional=model.meta.schemaCoverage.find(item=>item.path==='BD.activities[].procedure.steps[].obligation');
assert.match(oldOptional.note,/optional.*必須手順に変換しない/);
assert.equal(model.meta.schemaCoverage.find(item=>item.path==='BD.activities[].procedure.steps[].appliesWhen').stateInformationId,byName('n-flow-step','実施条件の確定状態').informationId);
covered.push('PROCEDURE-GOAL-03');

const conditionExample=byName('n-exception','発生条件'),outcomeExample=byName('n-exception','例外時の結果');
assert.match(conditionExample.referenceValue,/編集.*下書き/);assert.match(outcomeExample.referenceValue,/確定せず.*下書き/);
for(const path of ['continuities.trigger','continuities.onInterrupt'])assert.equal(model.meta.compatibilityReview.fields[mapping(path).informationId].kind,'legacy');
assert.match(mapping('continuities.resumeAction').referenceValue,/下書き.*再開/);
const code=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const w=new JSDOM('<div id="tree"></div><div id="detail"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
try{
 w.eval(code+';globalThis.Explorer=Explorer;');const tree=w.document.querySelector('#tree'),detail=w.document.querySelector('#detail');
 const render=id=>w.Explorer.renderStructureExplorer(tree,model,{rootId:id,select:selection=>w.Explorer.renderStructureDetails(detail,model,selection)});
 render('n-exception');assert(tree.querySelector('[data-relation-id="nr-exception-step"]'));assert(tree.querySelector('[data-relation-id="nr-exception-continuity"]'));
 tree.querySelector('.structure-root > li > details > summary').click();const field=detail.querySelector(`[data-information-id="${conditionExample.informationId}"] button`);assert(field);field.click();assert(detail.textContent.includes('参考：編集の途中で下書き保存を選択した場合'));assert(detail.textContent.includes('架空の編集業務'));
 render('n-flow-step');tree.querySelector('.structure-root > li > details > summary').click();const old=()=>detail.querySelector(`[data-information-id="${obligation.informationId}"]`),current=()=>detail.querySelector(`[data-information-id="${condition.informationId}"]`);
 assert(!old());assert(current());assert(tree.querySelector('[data-relation-id="nr-flow-step-definition"]'));
 const toggle=tree.querySelector('.structure-compatibility-filter input');toggle.checked=false;toggle.dispatchEvent(new w.Event('change',{bubbles:true}));assert(old());assert.match(old().textContent,/互換・移行用/);
}finally{w.close();}
covered.push('PROCEDURE-GOAL-04');

assert.deepEqual(readFileSync(candidatePath),candidateBytes);unchangedSources();authorityBytes();
covered.push('PROCEDURE-GOAL-05');coverage(covered);
console.log(JSON.stringify({checks:covered,scope:'flow placement, shared step, exception, conditions and source preservation'}));
