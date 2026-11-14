import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

const authority='verification/structure-explorer-detail-policy.check-items.json';
const digest='0f0a110daed262ec474cf5ba4eadf9a1b82468acc31029014b33ff1cdf04bd99';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const authorityBytes=readFileSync(authority);
assert.equal(hash(authorityBytes),digest);
const checks=JSON.parse(authorityBytes).checks.map(item=>item.id),covered=[];
const altered=JSON.parse(authorityBytes);altered.checks.shift();assert.notEqual(hash(JSON.stringify(altered)),digest);
const missingCondition=JSON.parse(authorityBytes);delete missingCondition.checks[0].condition;assert.notEqual(hash(JSON.stringify(missingCondition)),digest);
const coverage=ids=>{assert.equal(ids.length,checks.length);assert.equal(new Set(ids).size,ids.length);assert.deepEqual(new Set(ids),new Set(checks));};
assert.throws(()=>coverage(checks.slice(1)));assert.throws(()=>coverage([...checks,checks[0]]));
const read=path=>JSON.parse(readFileSync(path,'utf8'));
const file='../business-design/alder/json-complete-concept-review.json';
const bytes=readFileSync(file),model=JSON.parse(bytes).documents.find(d=>d.kind==='conceptModel'),before=JSON.stringify(model);
const code=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const w=new JSDOM('<div id="tree"></div><div id="detail"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
try{
 w.eval(code+';globalThis.Explorer=Explorer;');const detail=w.document.querySelector('#detail'),tree=w.document.querySelector('#tree');
 const show=(m,selection)=>w.Explorer.renderStructureDetails(detail,m,selection);
 const value=label=>{const dt=[...detail.querySelectorAll('dt')].find(item=>(item.querySelector('.structure-detail-caption')?.textContent??item.textContent)===label);return dt?.nextElementSibling?.textContent;};
 const hidden=['構造のID','関係のID','情報項目のID','対応する項目','確認状態','関係の確認状態'];
 const assertHidden=()=>{for(const label of hidden)assert.equal(value(label),undefined,label);};
 show(model,{kind:'structure',conceptId:'n-bd',fromId:'n-package',relationId:'nr-package-bd'});
 assertHidden();assert.equal(value('論理名'),'未定義','a shared source array is not a logical name for just this relationship');assert(!detail.textContent.includes('documents[]'));assert.equal(value('ローカル名'),'業務設計書');assert.equal(value('型名'),'BusinessDesign');assert.equal(value('関係の種類'),'所有');assert.equal(value('多重度'),'0..N');assert.equal(value('反対側の多重度'),'1');assert(value('所属').includes('文書パッケージ'));
 assert.equal(value('理由'),undefined);assert.equal(value('サブシステム'),undefined);
 show(model,{kind:'structure',conceptId:'n-who',fromId:'n-activity',relationId:'nr-who-activity'});assertHidden();assert.equal(value('関係の種類'),'参照');assert(value('参照').includes('主体'));assert.equal(value('多重度'),'0..1');
 show(model,{kind:'structure',conceptId:'n-activity'});assertHidden();assert.equal(value('型名'),'Activity');assert.equal(value('理由'),undefined);
 const name=model.meta.fieldMappings.find(item=>item.physicalName==='activities.name');
 show(model,{kind:'attribute',conceptId:'n-activity',informationId:name.informationId});assertHidden();assert.equal(value('論理名'),'name');assert.equal(value('ローカル名'),'名前');assert.equal(value('型名'),'string');assert.equal(value('サンプル'),name.sampleValue);assert.equal(name.referenceValue,'業務設計');covered.push('STRUCTURE-POLICY-001');
 const authored=structuredClone(model),concept=authored.concepts.find(item=>item.id==='n-bd');
 concept.reason='業務の目的と結果を同じ設計書で説明するため。';
 show(authored,{kind:'structure',conceptId:'n-bd'});assert.equal(value('理由'),concept.reason);covered.push('STRUCTURE-POLICY-002');
 for(const path of [file,'../business-design/alder/json-normalized-model-review.json']){
  const m=read(path).documents.find(d=>d.kind==='conceptModel');show(m,{kind:'structure',conceptId:'n-bd'});assert.equal(value('サブシステム'),undefined,path);assert.equal(value('理由'),undefined,path);
 }
 concept.subsystemId='business-area';authored.subsystems.push({id:'business-area',name:'申込管理',purpose:'',information:[],reason:'',activityIds:[],reviewState:'未レビュー'});
 show(authored,{kind:'structure',conceptId:'n-bd'});assert.equal(value('サブシステム'),'申込管理');assert(!detail.textContent.includes('business-area'));
 const field=authored.concepts.find(item=>item.id==='n-activity').information.find(item=>item.id===name.informationId);field.responsibleSubsystemId='business-area';show(authored,{kind:'attribute',conceptId:'n-activity',informationId:field.id});assert.equal(value('責任を持つサブシステム'),'申込管理');assert(!detail.textContent.includes('business-area'));covered.push('STRUCTURE-POLICY-003');
 assert.equal(model.meta.fieldMappings.find(item=>item.physicalName==='documents[]').physicalName,'documents[]');
 assert(model.relations.find(item=>item.id==='nr-package-bd').reviewState);
 w.Explorer.renderStructureExplorer(tree,model,{rootId:'n-activity'});
 assert(!tree.querySelector('[data-relation-id="nr-who-activity"] > details > summary').title.includes('nr-who-activity'),'the internal relation ID is absent from the row tooltip');
 const search=tree.querySelector('input[type="search"]');search.value='activities.whoId';search.dispatchEvent(new w.Event('input',{bubbles:true}));
 const hit=tree.querySelector('[data-relation-id="nr-who-activity"]');assert(hit&&!hit.hidden,'source mapping remains searchable');
 assert.equal(JSON.stringify(model),before);assert.deepEqual(readFileSync(file),bytes);covered.push('STRUCTURE-POLICY-004');
 const id=model.meta.fieldMappings.find(item=>item.physicalName==='activities.id');
 show(model,{kind:'attribute',conceptId:'n-activity',informationId:id.informationId});assert.equal(value('論理名'),'id');assert.equal(value('ローカル名'),'識別子');assert.equal(value('null許容'),'許容しない');assert.match(value('説明'),/識別/);
 const undecided=structuredClone(model),pending=undecided.meta.fieldMappings.find(item=>item.physicalName==='activities.name');pending.nullable=null;pending.nullableReason='未決の意味を確認する。';show(undecided,{kind:'attribute',conceptId:'n-activity',informationId:pending.informationId});assert.equal(value('null許容'),'未決');assert(!value('説明').includes(pending.nullableReason));assert.equal(pending.nullableReason,'未決の意味を確認する。');assert.equal(JSON.stringify(model),before);covered.push('STRUCTURE-POLICY-005');
}finally{w.close();}
coverage(covered);assert.equal(hash(readFileSync(authority)),digest);
console.log(JSON.stringify({checks:covered,scope:'structure details, preserved source mappings and search'}));
