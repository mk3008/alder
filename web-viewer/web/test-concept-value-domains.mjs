import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {schema} from '../../tools/document_storage/schema.mjs';
import {validate} from '../../tools/document_storage/core.mjs';

const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const authority='verification/concept-value-domains.check-items.json',authorityHash='af5aef86e67bddc26f485beb348bdbd0f717df896716975a0e7241df6376b2c2';
const frozen={
 '../business-design/alder/business-design.json':'b8356070947d73502197e08560a9084e139aa8c0f7c88c64109a98502d7182c9',
 '../business-design/alder/json-normalized-model-review.json':'708023cc112e137f66d295213b50dd8c67e52737b3e0fdd02ca0718aef93ab36',
 '../tools/document_storage/schema.mjs':'e46e388660df746173e16e8c72b56e9a9a74f6fcd6935f5bff304737961dddb2'
};
const verifyFrozen=()=>{assert.equal(hash(readFileSync(authority)),authorityHash);for(const [path,digest]of Object.entries(frozen))assert.equal(hash(readFileSync(path)),digest,path);};verifyFrozen();
const checks=JSON.parse(readFileSync(authority)).checks.map(item=>item.id),covered=[];
const coverage=actual=>{assert.equal(actual.length,checks.length);assert.equal(new Set(actual).size,actual.length);assert.deepEqual(new Set(actual),new Set(checks));};assert.throws(()=>coverage(checks.slice(1)));assert.throws(()=>coverage([...checks,checks[0]]));
const pkg=JSON.parse(readFileSync('../business-design/alder/json-complete-concept-review.json')),model=pkg.documents.find(item=>item.kind==='conceptModel'),before=JSON.stringify(model);
const inventory=JSON.parse(readFileSync('../work/normalization-candidate/value-domain-inventory.json'));
const all=model.concepts.flatMap(concept=>concept.information.map(info=>({concept,info}))),byId=new Map(model.meta.fieldMappings.map(mapping=>[mapping.informationId,mapping]));
assert.equal(all.length,339);assert.equal(byId.size,all.length);assert.equal(inventory.length,all.length);
assert.equal(new Set(inventory.map(item=>item.informationId)).size,all.length);
assert.deepEqual(new Set(inventory.map(item=>item.informationId)),new Set(all.map(item=>item.info.id)));
for(const entry of inventory){const mapping=byId.get(entry.informationId);assert(mapping);assert.equal(entry.physicalName,mapping.physicalName);assert.equal(entry.category,mapping.valueDomain.kind);assert(entry.reason);}
assert.throws(()=>{const incomplete=inventory.slice(1);assert.deepEqual(new Set(incomplete.map(x=>x.informationId)),new Set(all.map(x=>x.info.id)));});
covered.push('VALUE-DOMAIN-001');

const roots={BD:schema.$defs.decisionBusinessDesign,Package:schema.anyOf.find(x=>x.properties?.formatVersion?.enum?.[0]==='0.7'),Check:schema.$defs.checkItems,State:schema.$defs.stateTransitionStructured,Concept:schema.$defs.checkedConceptModel};
const expand=node=>{if(!node)return [];if(node.$ref)return expand(schema.$defs[node.$ref.split('/').at(-1)]);if(node.anyOf)return node.anyOf.flatMap(expand);if(node.type==='null')return [];return [node];};
function schemaValues(path){
 const parts=path.split('.'),root=parts.shift();let nodes=expand(roots[root]);
 for(const part of parts){const isArray=part.endsWith('[]'),name=isArray?part.slice(0,-2):part;nodes=nodes.flatMap(node=>expand(node.properties?.[name]));if(isArray)nodes=nodes.flatMap(node=>expand(node.items));}
 assert(nodes.length&&nodes.every(node=>Array.isArray(node.enum)),path+' must remain a finite schema domain');return new Set(nodes.flatMap(node=>node.enum).filter(value=>value!==null));
}
const field=path=>{const mapping=model.meta.fieldMappings.find(item=>item.physicalName===path);assert(mapping,path);return mapping;};
const values=path=>field(path).valueDomain.values.map(item=>item.value);
for(const mapping of model.meta.fieldMappings){
 const domain=mapping.valueDomain;assert(domain&&typeof domain.kind==='string');
 if(domain.kind!=='enum'&&domain.kind!=='fixed')continue;
 assert(Array.isArray(domain.values)&&domain.values.length);assert.equal(new Set(domain.values.map(item=>item.value)).size,domain.values.length);
 if(/^(BD|Package|Check|State|Concept)\./.test(domain.source??''))assert.deepEqual(new Set(domain.values.map(item=>item.value)),schemaValues(domain.source),mapping.physicalName);
 else if(domain.source==='概念モデルの定義'){const expected=mapping.valueType.match(/^string（(.+)）$/);assert(expected);assert.deepEqual(domain.values.map(item=>item.value),expected[1].split('／'));}
 else assert.equal(domain.source,'手順の当事者のFrom／To');
 const sample=Object.hasOwn(mapping,'sampleValue')?mapping.sampleValue:mapping.referenceValue;
 if(sample!==undefined&&sample!==null)assert(domain.values.some(item=>item.value===sample),mapping.physicalName+' sample must be in its domain');
}
assert.deepEqual(values('actors.kind'),['role','system','scheduler']);assert.deepEqual(values('stepParties.side'),['from','to']);
assert.deepEqual(values('decisions.kind'),['authorization','validation','algorithm']);assert.deepEqual(values('conditions.operator'),['is','eq','gte','lte','gt','lt']);
assert.deepEqual(values('State.transitions[].path'),['normal','exception']);assert.equal(field('actors.kind').nullable,false);
assert.match(field('actors.kind').valueDomain.note,/主体参照を未決/);assert.match(field('conditions.operator').valueDomain.note,/大小比較.*数値/);
assert.equal(field('continuities.outcome').sampleValue,'resume');assert.match(field('continuities.outcome').referenceValue,/下書き/);
covered.push('VALUE-DOMAIN-002');

const code=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const w=new JSDOM('<div id="detail"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
try{
 w.eval(code+';globalThis.Explorer=Explorer;');const detail=w.document.querySelector('#detail');
 const show=(m,id,hideLegacy)=>w.Explorer.renderStructureDetails(detail,m,{kind:'structure',conceptId:id,hideLegacy});
 const row=(m,path)=>detail.querySelector(`tr[data-information-id="${m.meta.fieldMappings.find(x=>x.physicalName===path).informationId}"]`);
 const value=label=>[...detail.querySelectorAll('dt')].find(item=>item.textContent===label)?.nextElementSibling?.textContent;
 show(model,'n-who');const kind=row(model,'actors.kind');assert(kind.textContent.includes('型："role" | "system" | "scheduler"'));for(const word of ['role：人が担う役割','system：自動実行するシステム','scheduler：スケジューラー'])assert(kind.textContent.includes(word));assert.equal(kind.querySelectorAll('.structure-domain-values li').length,3);assert.match(kind.textContent,/role/);
 assert.match(row(model,'actors.id').textContent,/型：識別子/);assert.match(row(model,'actors.name').textContent,/空文字や空白のみは使用しない/);assert(!row(model,'actors.name').querySelector('.structure-domain-values'));
 kind.querySelector('button').click();assert.equal(value('型名'),'"role" | "system" | "scheduler"');assert.match(value('選択肢'),/role：人が担う役割/);assert.match(value('選択肢'),/system：自動実行するシステム/);assert.match(value('選択肢'),/scheduler：スケジューラー/);assert.equal(value('サンプル'),'role');assert.equal(value('null許容'),'許容しない');
 show(model,'n-flow-step',true);assert(!row(model,'steps.obligation'));show(model,'n-flow-step',false);assert.match(row(model,'steps.obligation').textContent,/required：必須/);assert.match(row(model,'steps.obligation').textContent,/互換・移行用/);
 const arbitrary=structuredClone(model),who=arbitrary.meta.fieldMappings.find(item=>item.physicalName==='actors.kind');who.valueDomain={kind:'enum',values:[{value:0},{value:false},{value:''}]};who.sampleValue=0;show(arbitrary,'n-who');assert.match(row(arbitrary,'actors.kind').textContent,/0.*false.*""/);assert(row(arbitrary,'actors.kind').textContent.includes('0'));
 who.valueDomain={kind:'enum',values:[{value:{wrong:true}}]};show(arbitrary,'n-who');assert(!row(arbitrary,'actors.kind').querySelector('.structure-domain-values'));assert.match(row(arbitrary,'actors.kind').textContent,/型：string/);
 const old=JSON.parse(readFileSync('../business-design/alder/json-normalized-model-review.json')).documents.find(item=>item.kind==='conceptModel');show(old,'n-who');assert(!detail.querySelector('.structure-domain-values'));
 assert.equal(JSON.stringify(model),before,'rendering does not mutate the model');
}finally{w.close();}
covered.push('VALUE-DOMAIN-003');

for(const path of ['retained Check.items.reviewState','Concept.concepts[].reviewState','Concept.subsystems[].reviewState'])assert.equal(field(path).valueDomain.kind,'historical');
for(const path of ['Check.basedOn.verification','State.completeness','Concept.concepts[].information[].responsibilityStatus'])assert.equal(field(path).valueDomain.kind,'undecided');
for(const path of ['businessDesigns.schemaVersion','formatVersion','Concept.schemaVersion'])assert.equal(field(path).valueDomain.kind,'version');
for(const path of ['actors.color','objects.icon'])assert.equal(field(path).valueDomain.kind,'presentation');
assert.equal(field('Concept.concepts[].sourceRefs[].targetType').valueDomain.kind,'referenceType');assert.equal(field('Concept.concepts[].sourceRefs[].targetId').valueDomain.kind,'reference');
const original=structuredClone(pkg),originalModel=original.documents.find(item=>item.kind==='conceptModel');for(const mapping of originalModel.meta.fieldMappings){delete mapping.valueDomain;if(mapping.physicalName==='continuities.outcome')delete mapping.sampleValue;}
assert.equal(hash(JSON.stringify(original,null,2)+'\n'),'31bb1a96de01c8973e67f988cb3cbe5d2a43714d2cf75324f19a3d9df3e2e6b0','only value-domain metadata and the corrected outcome sample changed');
covered.push('VALUE-DOMAIN-004');validate(pkg);verifyFrozen();covered.push('VALUE-DOMAIN-005');coverage(covered);
console.log(JSON.stringify({checks:covered,concepts:model.concepts.length,items:inventory.length,domains:inventory.reduce((counts,item)=>(counts[item.category]=(counts[item.category]??0)+1,counts),{}),scope:'conceptual domains, metadata/DOM and unchanged source; browser geometry checked separately'}));
