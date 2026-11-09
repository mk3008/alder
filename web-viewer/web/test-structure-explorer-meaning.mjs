import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const authority='verification/structure-explorer-meaning.check-items.json';
const authorityHash='3aaaad261dc177f6bd9596299f6eec65b2e4fb30d5baef645aac4e8190ead8d5';
const authorityBytes=readFileSync(authority);assert.equal(hash(authorityBytes),authorityHash);
const checks=JSON.parse(authorityBytes).checks.map(item=>item.id),covered=[];
const coverage=ids=>{assert.equal(ids.length,checks.length);assert.equal(new Set(ids).size,ids.length);assert.deepEqual(new Set(ids),new Set(checks));};
assert.throws(()=>coverage(checks.slice(1)));assert.throws(()=>coverage([...checks,checks[0]]));
const path='../business-design/alder/json-complete-concept-review.json',bytes=readFileSync(path),pkg=JSON.parse(bytes);
const model=pkg.documents.find(d=>d.kind==='conceptModel'),before=JSON.stringify(model);
const code=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const w=new JSDOM('<div id="detail"></div>',{url:'https://viewer.test/',runScripts:'outside-only'}).window;
try{
 w.eval(code+';globalThis.Explorer=Explorer;');const detail=w.document.querySelector('#detail');
 const field=(m,predicate)=>{const mapping=m.meta.fieldMappings.find(predicate),owner=m.concepts.find(c=>c.information.some(i=>i.id===mapping?.informationId));assert(mapping&&owner);return {mapping,owner,info:owner.information.find(i=>i.id===mapping.informationId)};};
 const show=(m,predicate)=>{const f=field(m,predicate);w.Explorer.renderStructureDetails(detail,m,{kind:'attribute',conceptId:f.owner.id,informationId:f.info.id});return f;};
 const value=label=>[...detail.querySelectorAll('dt')].find(dt=>dt.textContent===label)?.nextElementSibling?.textContent;
 const byName=name=>mapping=>mapping.physicalName===name;
 for(const [name,expected] of [['format',/文書パッケージ.*他のJSON形式/],['formatVersion',/形式の版.*改訂とは別/],['revision',/内容の改訂.*形式の版とは別/],['Package.diagnostics',/文書に残す補足.*検証時/]]){
  show(model,byName(name));assert.match(value('説明'),expected,name);assert(!value('説明').includes('未定義'));assert(!value('説明').includes('null許容の理由：'));
 }
 covered.push('STRUCTURE-MEANING-001');
 for(const [name,expected] of [['activities.scope',/未決.*対象外/],['activities.problem',/未確認.*課題なし/],['data.name',/情報項目.*まとめ/],['steps.exchangeKind',/受渡し.*内部処理.*未決/],['stepInteractions.phase',/要求.*応答.*該当なし/],['findings.status',/未解決.*解決済み/],['State.transitions[].condition',/遷移.*条件/],['retained Check.items.id',/チェック項目.*識別/]]){
  show(model,byName(name));assert.match(value('説明'),expected,name);
 }
 show(model,item=>item.logicalSourcePaths?.includes('steps.dependencyState'));assert.match(value('説明'),/未決.*なし.*あり/);
 show(model,item=>item.logicalSourcePaths?.includes('steps.ordinal'));assert.match(value('説明'),/手順の順序/);
 covered.push('STRUCTURE-MEANING-002');
 const missing=structuredClone(model),f=field(missing,byName('format'));
 delete f.info.description;delete f.mapping.logicalMeaning;f.mapping.nullableReason='無関係な自動生成の理由。';
 show(missing,byName('format'));assert.equal(value('説明'),'この項目の説明はまだ記載されていません。');assert(!value('説明').includes(f.mapping.nullableReason));assert.equal(value('null許容の理由'),f.mapping.nullableReason);
 f.info.description='利用者が記録した説明。';show(missing,byName('format'));assert.equal(value('説明'),'利用者が記録した説明。');
 f.info.description='  ';show(missing,byName('format'));assert.equal(value('説明'),'この項目の説明はまだ記載されていません。');
 show(model,byName('Concept.presentation.activityViews'));assert.equal(value('説明'),'この項目の説明はまだ記載されていません。');
 assert.equal(JSON.stringify(model),before);covered.push('STRUCTURE-MEANING-003');
}finally{w.close();}
const withoutMeanings=structuredClone(pkg);const priorMeta=withoutMeanings.documents.find(d=>d.kind==='conceptModel').meta;

// Restore only the superseded FlowStep/purpose changes when checking the earlier
// frozen hash. Their new behavior is checked by structure-explorer-review-feedback.
const previousFlow=withoutMeanings.documents.find(d=>d.kind==='conceptModel');
const flow=previousFlow.concepts.find(x=>x.id==='n-flow-step');
assert(!flow.information.some(x=>x.id==='cf-de02b14f7f7ee3'));
flow.description="一つの標準フローか一つの例外フローと手順の対応。順序と実施条件はこの対応に属し、同じ業務の複数の流れから共通の手順を参照できる。";
flow.information.push({"id":"cf-de02b14f7f7ee3","name":"実施条件の確定状態"});
previousFlow.relations.find(x=>x.id==='nr-step-when').condition="この流れで手順を実行する条件を判定表の行として表す場合の参照。別の実施条件があれば併せて保持する。";
const flowNode=previousFlow.presentation.subsystemViews.nodes.find(x=>x.id==='overview-n-flow-step');
flowNode.description="一つの標準フローか一つの例外フローと手順の対応。順序と実施条件はこの対応に属し、同じ業務の複数の流れから共通の手順を参照できる。";
flowNode.fields.push({"name":"実施条件の確定状態","informationId":"cf-de02b14f7f7ee3"});
const mappings=previousFlow.meta.fieldMappings;
const insertion=mappings.findIndex(x=>x.informationId==='cf-b1693377ad86be');assert(insertion>=0);
mappings.splice(insertion,0,{"informationId":"cf-de02b14f7f7ee3","physicalName":"","relationIds":[],"valueType":"string（未決／無条件／条件あり）","logicalMeaning":"この手順を行う条件が未決、無条件、条件ありのどれか。条件ありには判定行による条件も含む。","referenceValue":"条件あり","nullable":false,"nullableReason":"未決・なし・あり等の業務上の区別、または手順の順序そのものを明示する項目。","nullableStatus":"proposal","valueDomain":{"kind":"enum","source":"概念モデルの定義","values":[{"value":"未決"},{"value":"無条件"},{"value":"条件あり"}]}});
mappings.find(x=>x.physicalName==='steps.appliesWhen').nullableReason="判定行だけで条件を表す場合や無条件の場合は文章を持たない。条件未決と無条件は確定状態で区別する。";
delete mappings.find(x=>x.physicalName==='activities.problem').logicalPurpose;
const coverageEntry=previousFlow.meta.schemaCoverage.find(x=>x.informationId==='cf-d6937d0cbb9486');
delete coverageEntry.note;coverageEntry.stateInformationId='cf-de02b14f7f7ee3';

// The later compatibility filter adds review annotations without changing
// the underlying mappings or the earlier meaning guarantee.
delete priorMeta.compatibilityReview;for(const mapping of priorMeta.fieldMappings){delete mapping.logicalMeaning;delete mapping.valueDomain;if(mapping.physicalName==='continuities.outcome')delete mapping.sampleValue;}
// The procedure, exception-origin and information-owner requirements revise
// this candidate explicitly; retain a full lock apart from explanations.
assert.equal(hash(JSON.stringify(withoutMeanings)),'5a40e7935bba495a14b61019de2eaa643ab3de4e0e1c776136a83f10d1f7faee','only field explanations may change beyond the approved conceptual revisions');
assert.equal(hash(readFileSync('../business-design/alder/business-design.json')),'b8356070947d73502197e08560a9084e139aa8c0f7c88c64109a98502d7182c9');
assert.equal(hash(readFileSync('../tools/document_storage/schema.mjs')),'9a6f63990f5b679ea807d873e56e0c5895aae28d1b253d78c3af63f4141546df');
assert.deepEqual(readFileSync(path),bytes);covered.push('STRUCTURE-MEANING-004');
coverage(covered);assert.equal(hash(readFileSync(authority)),authorityHash);
console.log(JSON.stringify({checks:covered,scope:'curated attribute explanations and preservation of original data'}));
