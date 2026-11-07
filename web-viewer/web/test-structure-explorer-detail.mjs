import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

const hash=value=>createHash('sha256').update(value).digest('hex');
const authority={
 'verification/structure-explorer-detail.check-items.json':'15a1fe1b1fc9874df39c48f6a7741d7850e4f230c232cb2e04c733819e9cb5e1',
 'verification/structure-explorer-nullability.check-items.json':'37138ede526514a102b42cb922be027cdbc22c4f434d2626fe5f2bc4d0b650b4'
};
const checks=[];for(const [path,digest] of Object.entries(authority)){const bytes=readFileSync(path);assert.equal(hash(bytes),digest,path);checks.push(...JSON.parse(bytes).checks.map(item=>item.id));}
const coverage=ids=>{assert.equal(ids.length,checks.length);assert.equal(new Set(ids).size,ids.length);assert.deepEqual(new Set(ids),new Set(checks));};
assert.throws(()=>coverage(checks.slice(1)));assert.throws(()=>coverage([...checks,checks[0]]));
const read=path=>JSON.parse(readFileSync(path,'utf8'));
const realSource='../business-design/alder/business-design.json',realBytes=readFileSync(realSource);assert.equal(hash(realBytes),'b8356070947d73502197e08560a9084e139aa8c0f7c88c64109a98502d7182c9','the real design is unchanged');
const pkg=read('../business-design/alder/json-complete-concept-review.json'),model=pkg.documents.find(item=>item.kind==='conceptModel');
const baseline=JSON.stringify(model),covered=[];
const code=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const w=new JSDOM('<div id="tree"></div><div id="detail"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
try{
 w.eval(code+';globalThis.Explorer=Explorer;');const tree=w.document.querySelector('#tree'),detail=w.document.querySelector('#detail');
 const render=(m,id)=>w.Explorer.renderStructureExplorer(tree,m,{rootId:id,openStructure:()=>{},select:selection=>w.Explorer.renderStructureDetails(detail,m,selection)});
 const mapping=path=>model.meta.fieldMappings.find(item=>item.physicalName===path);
 const field=(path,m=model)=>{const id=m.meta.fieldMappings.find(item=>item.physicalName===path)?.informationId;return tree.querySelector(`[data-information-id="${id}"] button`);};
 const value=label=>{const dt=[...detail.querySelectorAll('dt')].find(item=>item.textContent===label);return dt?.nextElementSibling?.textContent;};
 const assertFields=(expected)=>{for(const [label,content] of Object.entries(expected))assert.equal(value(label),content,label);};
 render(model,'n-activity');const name=field('activities.name');assert(name);assert.match(name.textContent,/名前.*型：string/);assert(!name.textContent.includes('activities.name'));assert(!name.textContent.includes('例：'));
 const step=tree.querySelector('[data-relation-id="nr-activity-step"] > details > summary');assert.match(step.textContent,/1\.\.N.*標準手順.*型：FlowStep/);assert(!step.textContent.includes('順序と実施条件を持ち'));assert(step.querySelector('button.structure-open'));covered.push('STRUCTURE-DETAIL-001');
 name.click();assertFields({'論理名':'name','ローカル名':'名前','型名':'string','所属':'業務（Activity）','参照':'なし'});assert(value('サンプル').startsWith('例：'));assert(value('サンプル').includes('参考例：業務設計'));assert.match(value('参考例の出所'),/Alder自身の業務設計書/);assert.match(value('説明'),/他の業務と区別/);assert.equal(value('対応する項目'),undefined);assert.equal(mapping('activities.name').physicalName,'activities.name');assert(name.getAttribute('aria-current')==='true');
 step.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));assert.equal(value('ローカル名'),'標準手順');assert.match(value('所属'),/業務/);assert.match(value('説明'),/標準フロー.*順序と実施条件/);assert.equal(value('多重度'),'1..N');
 render(model,'n-activity');const who=tree.querySelector('[data-relation-id="nr-who-activity"] > details > summary');who.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));assert.match(value('参照'),/主体/);assert.equal(value('対応する項目'),undefined);assert(mapping('activities.whoId'));covered.push('STRUCTURE-DETAIL-002');
 render(model,'n-activity');field('activities.scope').click();assert.equal(value('null許容'),'許容する');assert.match(value('説明'),/未決.*対象外/);assert.equal(value('参照元の型表記'),undefined);assert.equal(mapping('activities.scope').valueType,'boolean | null');
 field('activities.id').click();assert.equal(value('null許容'),'許容しない');assert.match(value('説明'),/識別/);
 field('activities.problem').click();assert.equal(value('null許容'),'許容する');assert.match(value('説明'),/未確認.*課題なし/);
 render(model,'n-dataitem');field('dataItems.condition').click();assert.equal(value('null許容'),'許容する');assert.match(value('説明'),/無条件.*条件未決/);
 covered.push('STRUCTURE-DETAIL-003','STRUCTURE-NULL-001');
 const changed=structuredClone(model),target=changed.meta.fieldMappings.find(item=>item.physicalName==='activities.name');delete target.nullable;delete target.nullableReason;delete target.nullableStatus;delete target.referenceValue;delete target.referenceSource;target.valueType='string | null';target.optional=true;target.sampleValue=null;
 render(changed,'n-activity');field('activities.name',changed).click();assert.equal(value('null許容'),'未定義','source type, optional and sample are not a proposed business decision');assert.equal(value('項目の省略'),'可能');assert.equal(value('サンプル'),'例：null');
 target.nullable=null;target.nullableStatus='proposal';target.nullableReason='未決の意味を確認する。';render(changed,'n-activity');field('activities.name',changed).click();assert.equal(value('null許容'),'未決');
 target.nullable=false;target.sampleValue='<script>'+('長い値'.repeat(100))+'</script>';target.referenceValue='別資料';render(changed,'n-activity');field('activities.name',changed).click();assert(value('サンプル').includes('長い値'.repeat(100)));assert(value('サンプル').includes('参考例：別資料'));assert.equal(detail.querySelector('script'),null);
 target.sampleValue='';delete target.referenceValue;render(changed,'n-activity');field('activities.name',changed).click();assert.equal(value('サンプル'),'例：""');covered.push('STRUCTURE-DETAIL-004','STRUCTURE-NULL-002','STRUCTURE-NULL-003');
 const proposals=model.meta.fieldMappings.filter(item=>item.representation!=='relationKey');assert(proposals.length>200);assert(proposals.every(item=>item.nullableStatus==='proposal'&&Object.hasOwn(item,'nullable')&&item.nullableReason),'every conceptual attribute has a reviewable proposal or explicit open question');
 const actual=read('../business-design/alder/business-design.json').documents.find(item=>item.kind==='businessDesign').activities.find(item=>item.name==='業務設計');for(const [path,key] of [['activities.name','name'],['activities.why','why'],['activities.when','when'],['activities.where','where'],['activities.problem','problem']])assert.deepEqual(mapping(path).referenceValue,actual[key],path+' reference comes from the real document');
 assert(!Object.hasOwn(mapping('activities.scope'),'referenceSource'),'old Scope is not treated as an example of the changed meaning');
 for(const label of ['課題の確認状態','条件の確定状態']){const owner=model.concepts.find(c=>c.information.some(i=>i.name===label)),info=owner.information.find(i=>i.name===label),record=model.meta.fieldMappings.find(i=>i.informationId===info.id);assert.equal(record.nullable,false);assert(record.logicalSourcePaths.length);}
 assert.equal(JSON.stringify(model),baseline,'rendering does not change the conceptual model');covered.push('STRUCTURE-DETAIL-005','STRUCTURE-DETAIL-006');
}finally{w.close();}
coverage(covered);for(const [path,digest] of Object.entries(authority))assert.equal(hash(readFileSync(path)),digest,path);assert.deepEqual(readFileSync(realSource),realBytes);
console.log(JSON.stringify({checks:covered,scope:'tree and drawer DOM; shell, browser and source-preservation checks run separately'}));
