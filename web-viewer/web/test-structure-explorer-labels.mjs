import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

const hashes={
 'verification/structure-explorer-labels.check-items.json':'69f406e74f4acd1f96bb659944c213637a1427fd86b9a017f69bb03386d667be',
 'verification/structure-explorer.check-items.json':'5a296df09675564f46ea71ea6fdb3847f1324c1fedfb6fd258f1234ed55e1fbd',
 'verification/structure-explorer-tab.check-items.json':'85552428a8e1c1161eda3bd42ba498b87fb227261f152c9d51dee9c39069efa1'
};
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const verify=(path,bytes)=>assert.equal(digest(bytes),hashes[path],path+' authority must remain unchanged');
for(const path of Object.keys(hashes))verify(path,readFileSync(path));
assert.throws(()=>verify('verification/structure-explorer-labels.check-items.json',Buffer.from('{}')),/authority must remain unchanged/);
const required=JSON.parse(readFileSync('verification/structure-explorer-labels.check-items.json')).checks.map(check=>check.id);
assert.deepEqual(required,['STRUCTURE-LABEL-001','STRUCTURE-LABEL-002','STRUCTURE-LABEL-003']);
const coverage=ids=>assert.deepEqual([...ids].sort(),required.slice().sort(),'every label guarantee is checked exactly once');
assert.throws(()=>coverage(required.slice(1)),/every label guarantee/);
assert.throws(()=>coverage([...required,required[0]]),/every label guarantee/);

const load=path=>JSON.parse(readFileSync(path)).documents.find(document=>document.kind==='conceptModel');
const normalized=load('../business-design/alder/json-normalized-model-review.json');
const physical=load('../business-design/alder/json-structure-review.json');
const declaredNames=normalized.meta.conceptNames;
assert.deepEqual(Object.keys(declaredNames).sort(),normalized.concepts.map(concept=>concept.id).sort(),'every candidate structure has explicitly declared names');
assert.equal(Object.keys(declaredNames).length,25);
for(const concept of normalized.concepts){
 const {typeName,logicalName}=declaredNames[concept.id];assert(typeName&&logicalName,concept.id);
 assert.equal(concept.name,typeName===logicalName?logicalName:`${logicalName}（${typeName}）`,'legacy diagram label and authored names agree: '+concept.id);
}
assert.deepEqual(declaredNames['n-who'],{typeName:'Who',logicalName:'主体'});
assert.deepEqual(declaredNames['n-information'],{typeName:'InformationItem',logicalName:'情報項目'});
assert.deepEqual(declaredNames['n-data'],{typeName:'InformationGroup',logicalName:'情報項目グループ'});
assert.deepEqual(declaredNames['n-dataitem'],{typeName:'InformationGroupMember',logicalName:'グループ構成項目'});
assert.deepEqual(declaredNames['n-decision'],{typeName:'DecisionTable',logicalName:'判定表'});
assert.deepEqual(declaredNames['n-relation'],{typeName:'BusinessRelation',logicalName:'業務・対象の関係'});
const source=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const window=new JSDOM('<div id="host"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
const covered=[];
try{
 window.eval(source+';globalThis.Explorer=Explorer;');const host=window.document.getElementById('host'),detail=window.document.createElement('div');
 let shown;const render=(model,rootId)=>{shown=model;window.Explorer.renderStructureExplorer(host,model,{rootId,select:selection=>window.Explorer.renderStructureDetails(detail,model,selection)});host.querySelector('.structure-root > li > details > summary').click();};
 const detailText=()=>{const copy=detail.cloneNode(true);copy.querySelector('.structure-copy-actions')?.remove();return copy.textContent;};
 const open=details=>{details.open=true;details.dispatchEvent(new window.Event('toggle'));};
 const row=id=>host.querySelector(`[data-relation-id="${id}"] > details > summary`);
 const pairs=summary=>{assert(!summary.querySelector('.structure-element-type'));const item=summary.closest('.structure-item'),parent=item.parentElement.closest('.structure-item'),probe=window.document.createElement('div');window.Explorer.renderStructureDetails(probe,shown,{kind:'structure',conceptId:item.dataset.conceptId,fromId:parent.dataset.conceptId,relationId:item.dataset.relationId});const type=[...probe.querySelectorAll('dt')].find(dt=>dt.textContent==='型名').nextElementSibling.textContent;return [...summary.querySelectorAll(':scope > .structure-element')].map(node=>[node.querySelector('strong').textContent,'型：'+type]);};

 render(normalized,'n-data');
 assert.deepEqual(pairs(row('nr-data-dataitem')),[['構成項目','型：InformationGroupMember']]);
 assert.match(detail.textContent,/グループ名/);
 render(normalized,'n-dataitem');
 assert.deepEqual(pairs(row('nr-dataitem-information')),[['情報項目','型：InformationItem']]);
 assert.match(detail.textContent,/含める条件/);
 render(normalized,'n-party');assert.match(detail.textContent,/From／To/);assert.match(detail.textContent,/当事者の種類/);
 render(normalized,'n-activity');assert.match(detail.textContent,/システム化対象/);

 render(normalized,'n-step');
 const root=host.querySelector('.structure-root > .structure-item > details > summary');
 assert.equal(root.querySelector(':scope > strong').textContent,'手順行');
 assert.equal(root.querySelector(':scope > .structure-type'),null);assert.match(detail.textContent,/型名Step/,'the root type remains in detail');
 assert.equal(root.querySelector('.structure-element'),null,'a root is a type, not a child property');
 const attribute=detail.querySelector('.structure-attribute-table tbody tr');assert(!host.querySelector('.structure-field'));
 assert.match(attribute.textContent,/識別子.*型：未定義/,'an attribute shows its name and known or undefined type');
 window.Explorer.renderStructureDetails(detail,normalized,{kind:'attribute',conceptId:'n-step',informationId:attribute.dataset.informationId});assert.match(detailText(),/論理名id/);assert.equal(normalized.meta.fieldMappings.find(item=>item.informationId===attribute.dataset.informationId).physicalName,'steps.id','the full mapping remains in the model');
 open(host.querySelector('[data-relation-id="nr-step-exchange"] > details'));
 const paired=row('nr-exchange-pair');
 assert.deepEqual(pairs(paired),[['対応する手順','型：Step']]);
 assert.equal(paired.querySelector('.structure-edge-detail'),null,'relationship keys are not repeated at the end of the row');
 assert.match(paired.title,/stepInteractions\.pairedStepId/,'the full physical mapping remains available');
 assert.doesNotMatch(paired.textContent,/対応手順。/);window.Explorer.renderStructureDetails(detail,normalized,{kind:'structure',conceptId:'n-step',fromId:'n-exchange',relationId:'nr-exchange-pair'});assert.match(detail.textContent,/対応手順。/,'the relation description remains available in the detail');
 assert.equal(paired.querySelector('.structure-count').textContent,'0..1');
 assert.deepEqual(pairs(row('nr-step-data')),[['操作対象の項目グループ','型：InformationGroup']],'the authored conceptual name is shown without inventing an array');
 assert.equal(row('nr-step-data').querySelector('.structure-count').textContent,'0..N');
 const search=host.querySelector('input[type=search]');search.value='対応する手順';search.dispatchEvent(new window.Event('input'));
 assert([...host.querySelectorAll('[data-relation-id="nr-exchange-pair"]')].some(item=>!item.hidden),'search includes the source element name');
 search.value='';search.dispatchEvent(new window.Event('input'));
 const withoutNames=structuredClone(normalized);delete withoutNames.meta.relationNames;render(withoutNames,'n-step');
 assert.deepEqual(pairs(row('nr-step-data')),[['名前未定義','型：InformationGroup']],'missing relation names are still not inferred');
 covered.push('STRUCTURE-LABEL-001');

 render(physical,'fmt-package');
 const pkgRoot=host.querySelector('.structure-root > .structure-item > details > summary');
 assert.equal(pkgRoot.querySelector(':scope > strong').textContent,'文書パッケージ（0.7候補）');
 assert.deepEqual(pairs(row('rel-package-bd')),[['文書一覧','型：業務設計書（Business Design）']],'the explicit array is attached to the element type');
 render(physical,'fmt-order');
 assert.deepEqual(pairs(row('rel-order-step')),[['前後の手順','型：手順行（Step）'],['対象手順','型：手順行（Step）']],'each mapped element keeps its own name and type');
 assert.deepEqual(window.Explorer.structureGraph(physical).edges.get('fmt-order').find(edge=>edge.relation.id==='rel-order-step').fieldDetails.map(field=>[field.name,field.valueType]),[['前後の手順',undefined],['対象手順','array']],'array metadata is retained in the model');
 covered.push('STRUCTURE-LABEL-002');

 const ambiguous=structuredClone(physical);
 ambiguous.meta.fieldMappings.push({informationId:'fmt-package-field-4',physicalName:'other[]',relationIds:['rel-package-bd'],valueType:'array'});
 render(ambiguous,'fmt-package');
 assert.deepEqual(pairs(row('rel-package-bd')),[['名前未定義','型：業務設計書（Business Design）']],'conflicting mappings do not select a name or array status');
 const explicit=structuredClone(physical),mapping=explicit.meta.fieldMappings.find(item=>item.informationId==='fmt-package-field-1');
 mapping.valueType='string';render(explicit,'fmt-package');
 const first=detail.querySelector('.structure-attribute-table tbody tr');
 assert.match(first.textContent,/形式.*型：string/,'explicit attribute types remain visible');window.Explorer.renderStructureDetails(detail,explicit,{kind:'attribute',conceptId:'fmt-package',informationId:first.dataset.informationId});assert.match(detail.textContent,/format/,'the mapping remains available in the detail');
 render(normalized,'n-bd');
 assert.deepEqual(pairs(row('nr-bd-actor')),[['主体','型：Who']],'owned role name and declared type are clearly distinguished');
 render(normalized,'n-who');const whoRoot=host.querySelector('.structure-root > .structure-item > details > summary');
 assert.equal(whoRoot.querySelector(':scope > strong').textContent,'主体');assert.equal(whoRoot.querySelector(':scope > .structure-type'),null);assert.match(detail.textContent,/型名Who/);
 render(normalized,'n-activity');
 assert.deepEqual(pairs(row('nr-who-activity')),[['実行主体','型：Who']],'a different reference to the same type retains its role');
 render(normalized,'n-row');
 assert.deepEqual(pairs(row('nr-row-checklink')),[['チェック項目との対応','型：DecisionRowCheck']]);
 const japaneseType=structuredClone(normalized);japaneseType.meta.conceptNames['n-rowcheck']={typeName:'判定行とCheckの対応',logicalName:'判定行とCheckの対応'};render(japaneseType,'n-row');
 assert.deepEqual(pairs(row('nr-row-checklink')),[['チェック項目との対応','型：判定行とCheckの対応']],'a type without an English name keeps its declared name');
 const changed=structuredClone(normalized);changed.meta.conceptNames['n-who']={typeName:'主体（Admin）',logicalName:'共有する主体'};render(changed,'n-bd');
 assert.deepEqual(pairs(row('nr-bd-actor')),[['主体','型：主体（Admin）']],'the explicitly declared type is used without splitting, even when it contains parentheses');
 render(changed,'n-who');const changedRoot=host.querySelector('.structure-root > .structure-item > details > summary');
 assert.equal(changedRoot.querySelector(':scope > strong').textContent,'共有する主体');assert.equal(changedRoot.querySelector(':scope > .structure-type'),null);assert.match(detail.textContent,/型名主体（Admin）/);
 const searchType=host.querySelector('input[type=search]');searchType.value='共有する主体';searchType.dispatchEvent(new window.Event('input'));
 assert([...host.querySelectorAll('[data-concept-id="n-who"]')].some(item=>!item.hidden),'search includes the declared logical name');
 const fallback=structuredClone(normalized);delete fallback.meta.conceptNames;fallback.concepts.find(concept=>concept.id==='n-who').name='主体（ロールなど）';render(fallback,'n-bd');
 assert.deepEqual(pairs(row('nr-bd-actor')),[['主体','型：主体（ロールなど）']],'models without separate names retain their declared structure label without guessing');
 fallback.concepts.find(concept=>concept.id==='n-who').name='主体（Admin）';render(fallback,'n-bd');
 assert.deepEqual(pairs(row('nr-bd-actor')),[['主体','型：主体（Admin）']],'a parenthesized English term is not assumed to be a separate type name');
 fallback.concepts.find(concept=>concept.id==='n-who').name='Who';fallback.meta.relationNames['nr-bd-actor']='Who';render(fallback,'n-bd');
 assert.deepEqual(pairs(row('nr-bd-actor')),[['Who','型：Who']],'identical property and type names are separated by a type caption');
 const malformed=structuredClone(normalized);malformed.meta.conceptNames['n-who']={typeName:'',logicalName:'仮の名前'};render(malformed,'n-who');
 assert.equal(host.querySelector('.structure-root > .structure-item > details > summary > strong').textContent,'主体（Who）','missing types use the declared original label');
 assert.equal(host.querySelector('.structure-root > .structure-item > details > summary > .structure-type'),null,'a logical name alone does not invent a type association');
 const declaredInteger=structuredClone(normalized);declaredInteger.meta.fieldMappings.find(item=>item.informationId==='n-who-field-1').valueType='int';render(declaredInteger,'n-who');
 const integerField=detail.querySelector('.structure-attribute-table tbody tr');assert.match(integerField.textContent,/識別子.*型：int/,'an explicitly declared primitive type is shown as recorded');window.Explorer.renderStructureDetails(detail,declaredInteger,{kind:'attribute',conceptId:'n-who',informationId:integerField.dataset.informationId});assert.match(detailText(),/論理名id/);assert.equal(declaredInteger.meta.fieldMappings.find(item=>item.informationId===integerField.dataset.informationId).physicalName,'actors.id');
 covered.push('STRUCTURE-LABEL-003');
}finally{window.close();}
coverage(covered);for(const path of Object.keys(hashes))verify(path,readFileSync(path));
console.log('STRUCTURE-LABEL-001..003: root type, element name/type, explicit arrays and undefined/ambiguous mappings verified.');
