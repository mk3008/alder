import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

const hash=value=>createHash('sha256').update(value).digest('hex');
const authority='verification/structure-explorer-compatibility.check-items.json';
const authorityHash='7b0cc06903c9bde5b1e449e4d5edf2a4a7bff67dcb4e5ae83ba0960f4931b2c0';
const authorityBytes=readFileSync(authority);assert.equal(hash(authorityBytes),authorityHash);
const checks=JSON.parse(authorityBytes).checks.map(item=>item.id),covered=[];
const coverage=ids=>{assert.equal(ids.length,checks.length);assert.equal(new Set(ids).size,ids.length);assert.deepEqual(new Set(ids),new Set(checks));};
assert.throws(()=>coverage(checks.slice(1)));assert.throws(()=>coverage([...checks,checks[0]]));
const modified=JSON.parse(authorityBytes);modified.checks[0].guarantee='';assert.notEqual(hash(JSON.stringify(modified)),authorityHash);
const path='../business-design/alder/json-complete-concept-review.json',bytes=readFileSync(path),pkg=JSON.parse(bytes);
const model=pkg.documents.find(d=>d.kind==='conceptModel'),before=JSON.stringify(model),catalog=model.meta.compatibilityReview;
const field=(m,path)=>{const mapping=m.meta.fieldMappings.find(item=>item.physicalName===path),owner=m.concepts.find(c=>c.information.some(i=>i.id===mapping?.informationId));assert(mapping&&owner,path);return {mapping,owner};};
const legacy=['steps.legacyText','State.transitions[].event','steps.obligation','continuities.trigger','continuities.onInterrupt'];
const uncertain=['Check.items[].detailSummary','retained Check.items.reviewState','Concept.subsystems[].reviewState','Concept.concepts[].reviewState','Concept.relations[].reviewState','Concept.handoffs[].reviewState'];
for(const path of legacy)assert.equal(catalog.fields[field(model,path).mapping.informationId]?.kind,'legacy',path);
for(const path of uncertain)assert.equal(catalog.fields[field(model,path).mapping.informationId]?.kind,'needs-review',path);
assert.equal(Object.keys(catalog.fields).length,legacy.length+uncertain.length);
for(const id of ['n-external','c-f6845a968ec2f3'])assert.equal(catalog.concepts[id]?.kind,'legacy',id);
assert.equal(catalog.concepts['n-order']?.kind,'needs-review');assert.equal(Object.keys(catalog.concepts).length,3);
for(const relation of model.relations){const boundary=['n-external','c-f6845a968ec2f3'].some(id=>relation.fromConceptId===id||relation.toConceptId===id);const order=relation.fromConceptId==='n-order'||relation.toConceptId==='n-order';assert.equal(catalog.relations[relation.id]?.kind,boundary?'legacy':order?'needs-review':undefined,relation.id);}
assert.equal(catalog.fields[field(model,'Check.basedOn.verification').mapping.informationId],undefined);
assert.equal(catalog.fields[field(model,'activities.name').mapping.informationId],undefined);
assert.equal(catalog.fields[field(model,'steps.appliesWhen').mapping.informationId],undefined,'a distinct normal-flow condition remains a current concept');
covered.push('STRUCTURE-COMPAT-001');
const code=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const w=new JSDOM('<div id="tree"></div><div id="detail"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
try{
 w.eval(code+';globalThis.Explorer=Explorer;');const host=w.document.querySelector('#tree'),detail=w.document.querySelector('#detail');let clearCount=0;
 const render=(m,id)=>w.Explorer.renderStructureExplorer(host,m,{rootId:id,select:selection=>w.Explorer.renderStructureDetails(detail,m,selection),clearSelection:()=>{clearCount++;w.Explorer.renderStructureDetails(detail,m);}});
 const checkbox=()=>host.querySelector('.structure-compatibility-filter input');const search=()=>host.querySelector('input[type="search"]');
 const item=path=>host.querySelector(`[data-information-id="${field(model,path).mapping.informationId}"]`);
 const toggle=checked=>{checkbox().checked=checked;checkbox().dispatchEvent(new w.Event('change',{bubbles:true}));};
 const query=value=>{search().value=value;search().dispatchEvent(new w.Event('input',{bubbles:true}));};
 const visible=element=>!!element&&!element.closest('[hidden]');
 render(model,'n-step');assert.equal(checkbox().checked,true);assert(item('steps.legacyText').hidden);assert(visible(item('steps.action')));
 query('旧手順の記述');assert(!visible(item('steps.legacyText')));assert(!visible(host.querySelector('.structure-root > .structure-item')),'hidden field must not produce a phantom search hit');
 toggle(false);assert(visible(item('steps.legacyText')));toggle(true);assert(!visible(item('steps.legacyText')));toggle(false);query('');
 assert(visible(item('steps.legacyText')));item('steps.legacyText').querySelector('button').click();assert(detail.textContent.includes('互換・移行用'));
 toggle(true);assert(item('steps.legacyText').hidden);assert.equal(clearCount,1);assert(detail.textContent.includes('項目を選択'));
 render(model,'n-flow-step');assert(item('steps.obligation').hidden);assert(visible(item('steps.appliesWhen')));item('steps.appliesWhen').querySelector('button').click();toggle(false);toggle(true);assert(item('steps.appliesWhen').querySelector('button').classList.contains('structure-selected'));assert.equal(clearCount,1);
 render(model,'n-activity');host.querySelector('.structure-toolbar button').click();const order=host.querySelector('[data-relation-id="nr-activity-order"]');assert(visible(order));assert.match(order.textContent,/要確認/);
 render(model,'n-external');assert.equal(checkbox().checked,true);assert(host.querySelector('.structure-root > li').hidden);assert(!host.querySelector('.structure-filter-empty').hidden);toggle(false);assert(visible(host.querySelector('.structure-root > li')));assert(host.querySelector('.structure-filter-empty').hidden);
 const unrelated=structuredClone(model);delete unrelated.meta.compatibilityReview;render(unrelated,'n-step');assert(checkbox().checked);assert(visible(item('steps.legacyText')));assert(!item('steps.legacyText').querySelector('.structure-review-badge'));
 covered.push('STRUCTURE-COMPAT-002');
 render(model,'n-step');assert(!item('steps.action').querySelector('.structure-review-badge'));
 toggle(false);const old=item('steps.legacyText');assert.match(old.textContent,/互換・移行用/);assert(old.querySelector('.structure-review-legacy'));old.querySelector('button').click();assert(detail.textContent.includes('旧形式の手順文章を移行時に保持する'));
 render(model,'n-flow-step');assert(item('steps.obligation').hidden);assert(!item('steps.appliesWhen').querySelector('.structure-review-badge'));toggle(false);item('steps.obligation').querySelector('button').click();assert(detail.textContent.includes('互換・移行用'));assert(detail.textContent.includes('選択可能だった意味'));
 render(model,'n-activity');host.querySelector('.structure-toolbar button').click();host.querySelector('[data-relation-id="nr-activity-order"] > details > summary').click();assert(detail.textContent.includes('手順の前提との重複'));
 covered.push('STRUCTURE-COMPAT-003');
}finally{w.close();}
assert.equal(JSON.stringify(model),before);assert.deepEqual(readFileSync(path),bytes);
const unchanged=structuredClone(pkg);delete unchanged.documents.find(d=>d.kind==='conceptModel').meta.compatibilityReview;
// The approved procedure, exception-origin and ownership revisions change the
// model itself; retain the lock with only compatibility notes removed.
assert.equal(hash(JSON.stringify(unchanged)),'722affaf43b7845805f13410f9d21d18617cc323eb989a154f8ecf281a600495');
assert.equal(hash(readFileSync('../business-design/alder/business-design.json')),'b8356070947d73502197e08560a9084e139aa8c0f7c88c64109a98502d7182c9');
assert.equal(hash(readFileSync('../tools/document_storage/schema.mjs')),'e46e388660df746173e16e8c72b56e9a9a74f6fcd6935f5bff304737961dddb2');
covered.push('STRUCTURE-COMPAT-004');coverage(covered);assert.equal(hash(readFileSync(authority)),authorityHash);
console.log(JSON.stringify({checks:covered,scope:'legacy classification, toggle, search, details and source preservation'}));
