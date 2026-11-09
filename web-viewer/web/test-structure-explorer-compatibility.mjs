import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

const hash=value=>createHash('sha256').update(value).digest('hex');
const authority='verification/structure-explorer-compatibility-v2.check-items.json';
const previousAuthority='verification/structure-explorer-compatibility.check-items.json';
const previousHash='7b0cc06903c9bde5b1e449e4d5edf2a4a7bff67dcb4e5ae83ba0960f4931b2c0';assert.equal(hash(readFileSync(previousAuthority)),previousHash);
const authorityHash='b3882414dca81504221acd67745a07203d827349c5fecaed65217ae6931f5c02';
const authorityBytes=readFileSync(authority);assert.equal(hash(authorityBytes),authorityHash);
const checks=JSON.parse(authorityBytes).checks.map(item=>item.id),covered=[];
const coverage=ids=>{assert.equal(ids.length,checks.length);assert.equal(new Set(ids).size,ids.length);assert.deepEqual(new Set(ids),new Set(checks));};
assert.throws(()=>coverage(checks.slice(1)));assert.throws(()=>coverage([...checks,checks[0]]));
const modified=JSON.parse(authorityBytes);modified.checks[0].guarantee='';assert.notEqual(hash(JSON.stringify(modified)),authorityHash);
const path='../business-design/alder/json-complete-concept-review.json',bytes=readFileSync(path),pkg=JSON.parse(bytes);
const model=pkg.documents.find(d=>d.kind==='conceptModel'),before=JSON.stringify(model),catalog=model.meta.compatibilityReview;
const field=(m,path)=>{const mapping=m.meta.fieldMappings.find(item=>item.physicalName===path),owner=m.concepts.find(c=>c.information.some(i=>i.id===mapping?.informationId));assert(mapping&&owner,path);return {mapping,owner};};
const legacy=['steps.legacyText','State.transitions[].event','steps.obligation','continuities.trigger','continuities.onInterrupt','steps.appliesWhen'];
const uncertain=['Check.items[].detailSummary','retained Check.items.reviewState','Concept.subsystems[].reviewState','Concept.concepts[].reviewState','Concept.relations[].reviewState','Concept.handoffs[].reviewState'];
for(const path of legacy)assert.equal(catalog.fields[field(model,path).mapping.informationId]?.kind,'legacy',path);
for(const path of uncertain)assert.equal(catalog.fields[field(model,path).mapping.informationId]?.kind,'needs-review',path);
assert.equal(Object.keys(catalog.fields).length,legacy.length+uncertain.length);
for(const id of ['n-external','c-f6845a968ec2f3'])assert.equal(catalog.concepts[id]?.kind,'legacy',id);
assert.equal(catalog.concepts['n-order']?.kind,'needs-review');assert.equal(Object.keys(catalog.concepts).length,3);
for(const relation of model.relations){const boundary=['n-external','c-f6845a968ec2f3'].some(id=>relation.fromConceptId===id||relation.toConceptId===id);const order=relation.fromConceptId==='n-order'||relation.toConceptId==='n-order';assert.equal(catalog.relations[relation.id]?.kind,boundary?'legacy':order?'needs-review':undefined,relation.id);}
assert.equal(catalog.fields[field(model,'Check.basedOn.verification').mapping.informationId],undefined);
assert.equal(catalog.fields[field(model,'activities.name').mapping.informationId],undefined);
assert.equal(catalog.fields[field(model,'steps.appliesWhen').mapping.informationId].kind,'legacy');
covered.push('STRUCTURE-COMPAT-001');
const code=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const w=new JSDOM('<div id="tree"></div><div id="detail"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
try{
 w.eval(code+';globalThis.Explorer=Explorer;');const host=w.document.querySelector('#tree'),detail=w.document.querySelector('#detail');let clearCount=0;
 const render=(m,id)=>{w.Explorer.renderStructureExplorer(host,m,{rootId:id,select:selection=>w.Explorer.renderStructureDetails(detail,m,selection),clearSelection:()=>{clearCount++;w.Explorer.renderStructureDetails(detail,m);}});host.querySelector('.structure-root > li > details > summary').click();};
 const checkbox=()=>host.querySelector('.structure-compatibility-filter input');const search=()=>host.querySelector('input[type="search"]');
 const item=path=>detail.querySelector(`[data-information-id="${field(model,path).mapping.informationId}"]`);
 const toggle=checked=>{checkbox().checked=checked;checkbox().dispatchEvent(new w.Event('change',{bubbles:true}));};
 const query=value=>{search().value=value;search().dispatchEvent(new w.Event('input',{bubbles:true}));};
 const visible=element=>!!element&&!element.closest('[hidden]');
 render(model,'n-step');assert.equal(checkbox().checked,true);assert(!item('steps.legacyText'));assert(visible(item('steps.action')));
 query('旧手順の記述');assert(!visible(host.querySelector('.structure-root > .structure-item')),'hidden field must not produce a phantom search hit');
 toggle(false);assert(visible(host.querySelector('.structure-root > .structure-item')));assert(visible(item('steps.legacyText')));toggle(true);assert(!item('steps.legacyText'));toggle(false);query('');
 assert(visible(item('steps.legacyText')));item('steps.legacyText').querySelector('button').click();assert(detail.textContent.includes('互換・移行用'));
 toggle(true);assert(!item('steps.legacyText'));assert(detail.querySelector('.structure-attribute-table'),'filter restores the selected class and hides legacy details');
 render(model,'n-flow-step');assert(!item('steps.obligation'));assert(!item('steps.appliesWhen'));toggle(false);assert(visible(item('steps.appliesWhen')));toggle(true);assert(!item('steps.appliesWhen'));assert.equal(clearCount,0);
 render(model,'n-activity');host.querySelector('.structure-toolbar button').click();const order=host.querySelector('[data-relation-id="nr-activity-order"]');assert(visible(order));assert.match(order.textContent,/要確認/);
 render(model,'n-external');assert.equal(checkbox().checked,true);assert(host.querySelector('.structure-root > li').hidden);assert(!host.querySelector('.structure-filter-empty').hidden);toggle(false);assert(visible(host.querySelector('.structure-root > li')));assert(host.querySelector('.structure-filter-empty').hidden);
 const unrelated=structuredClone(model);delete unrelated.meta.compatibilityReview;render(unrelated,'n-step');assert(checkbox().checked);assert(visible(item('steps.legacyText')));assert(!item('steps.legacyText').querySelector('.structure-review-badge'));
 covered.push('STRUCTURE-COMPAT-002');
 render(model,'n-step');assert(!item('steps.action').querySelector('.structure-review-badge'));
 toggle(false);const old=item('steps.legacyText');assert.match(old.textContent,/互換・移行用/);assert(old.querySelector('.structure-review-legacy'));old.querySelector('button').click();assert(detail.textContent.includes('旧形式の手順文章を移行時に保持する'));
 render(model,'n-flow-step');assert(!item('steps.obligation'));assert(!item('steps.appliesWhen'));toggle(false);assert.match(item('steps.appliesWhen').textContent,/互換・移行用/);item('steps.obligation').querySelector('button').click();assert(detail.textContent.includes('互換・移行用'));assert(detail.textContent.includes('選択可能だった意味'));
 render(model,'n-activity');host.querySelector('.structure-toolbar button').click();host.querySelector('[data-relation-id="nr-activity-order"] > details > summary').click();assert(detail.textContent.includes('手順の前提との重複'));
 covered.push('STRUCTURE-COMPAT-003');
}finally{w.close();}
assert.equal(JSON.stringify(model),before);assert.deepEqual(readFileSync(path),bytes);
const unchanged=structuredClone(pkg),unchangedMeta=unchanged.documents.find(d=>d.kind==='conceptModel').meta;delete unchangedMeta.compatibilityReview;
// Restore only the superseded FlowStep/purpose changes when checking the earlier
// frozen hash. Their new behavior is checked by structure-explorer-review-feedback.
const previousFlow=unchanged.documents.find(d=>d.kind==='conceptModel');
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

mappings.find(x=>x.physicalName==='steps.appliesWhen').logicalMeaning="この手順を実行する条件。判定表の行で同じ条件を表せる場合は重ねて記載せず、別の条件は保持する。条件の未決・無条件・条件ありは確定状態で区別する。";

for(const mapping of unchangedMeta.fieldMappings){delete mapping.valueDomain;if(mapping.physicalName==='continuities.outcome')delete mapping.sampleValue;}
// The approved procedure, exception-origin and ownership revisions change the
// model itself; retain the lock with only compatibility notes removed.
assert.equal(hash(JSON.stringify(unchanged)),'b3d45152143a03dc377c5ab57c5d383ef282692ac274568ba9d50b19975ccea5');
assert.equal(hash(readFileSync('../business-design/alder/business-design.json')),'b8356070947d73502197e08560a9084e139aa8c0f7c88c64109a98502d7182c9');
assert.equal(hash(readFileSync('../tools/document_storage/schema.mjs')),'9a6f63990f5b679ea807d873e56e0c5895aae28d1b253d78c3af63f4141546df');
covered.push('STRUCTURE-COMPAT-004');coverage(covered);assert.equal(hash(readFileSync(authority)),authorityHash);assert.equal(hash(readFileSync(previousAuthority)),previousHash);
console.log(JSON.stringify({checks:covered,scope:'legacy classification, toggle, search, details and source preservation'}));
