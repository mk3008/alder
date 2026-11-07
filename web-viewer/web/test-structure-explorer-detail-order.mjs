import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

const authority='verification/structure-explorer-detail-order.check-items.json';
const digest='9d1887bd30d46a44f1bbbc0bbd5c802eaee3d13f27c946d052743db57c039326';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const baseline=readFileSync(authority);assert.equal(hash(baseline),digest);
const checks=JSON.parse(baseline).checks.map(item=>item.id),covered=[];
const coverage=ids=>{assert.equal(ids.length,checks.length);assert.equal(new Set(ids).size,ids.length);assert.deepEqual(new Set(ids),new Set(checks));};
assert.throws(()=>coverage(checks.slice(1)));assert.throws(()=>coverage([...checks,checks[0]]));
const changedAuthority=JSON.parse(baseline);changedAuthority.checks.shift();assert.notEqual(hash(JSON.stringify(changedAuthority)),digest);
const source='../business-design/alder/json-complete-concept-review.json',real='../business-design/alder/business-design.json';
const bytes=readFileSync(source),realBytes=readFileSync(real),model=JSON.parse(bytes).documents.find(d=>d.kind==='conceptModel'),modelBefore=JSON.stringify(model);
const code=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const w=new JSDOM('<div id="detail"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
try{
 w.eval(code+';globalThis.Explorer=Explorer;');const detail=w.document.querySelector('#detail');
 const field=(m,path)=>{const mapping=m.meta.fieldMappings.find(item=>item.physicalName===path),owner=m.concepts.find(c=>c.information.some(i=>i.id===mapping?.informationId));assert(mapping&&owner,path);return {mapping,owner,info:owner.information.find(i=>i.id===mapping.informationId)};};
 const show=(m,path)=>{const f=field(m,path);w.Explorer.renderStructureDetails(detail,m,{kind:'attribute',conceptId:f.owner.id,informationId:f.info.id});return f;};
 const value=label=>[...detail.querySelectorAll('dt')].find(dt=>dt.textContent===label)?.nextElementSibling?.textContent;
 const lines=label=>{const dd=[...detail.querySelectorAll('dt')].find(dt=>dt.textContent===label)?.nextElementSibling;return dd?[...dd.childNodes].filter(node=>node.nodeType===w.Node.TEXT_NODE).map(node=>node.textContent):[];};
 show(model,'format');const labels=[...detail.querySelectorAll('dt')].map(item=>item.textContent);
 assert.deepEqual(labels.slice(0,6),['論理名','ローカル名','型名','サンプル','null許容','説明']);assert.equal(value('サンプル'),'alder-document-package');
 show(model,'activities.name');assert(value('サンプル').includes('1回の点数を計算する'));assert(!value('サンプル').includes('参考：'));assert.equal(field(model,'activities.name').mapping.referenceValue,'業務設計');
 const examples=structuredClone(model),sample=field(examples,'activities.name').mapping;delete sample.referenceValue;
 for(const [item,expected] of [[null,'null'],['','""'],[0,'0']]){sample.sampleValue=item;show(examples,'activities.name');assert.equal(value('サンプル'),expected);}
 delete sample.sampleValue;show(examples,'activities.name');assert.equal(value('サンプル'),'未記載');covered.push('STRUCTURE-ORDER-001');
 show(model,'activities.id');assert.equal(value('null許容'),'許容しない');assert.equal(value('null許容（候補）'),undefined);
 show(model,'activities.scope');assert.equal(value('null許容'),'許容する');assert.equal(value('参照元の型表記'),undefined);assert.equal(field(model,'activities.scope').mapping.valueType,'boolean | null');
 const undecided=structuredClone(model),u=field(undecided,'activities.name').mapping;u.nullable=null;show(undecided,'activities.name');assert.equal(value('null許容'),'未決');
 delete u.nullable;delete u.nullableStatus;u.valueType='string | null';u.sampleValue=null;show(undecided,'activities.name');assert.equal(value('null許容'),'未定義');covered.push('STRUCTURE-ORDER-002');
 const cases=structuredClone(model),f=field(cases,'activities.name');
 f.info.description='項目の意味。';f.mapping.nullableReason='未入力を区別する。';show(cases,'activities.name');assert.deepEqual(lines('説明'),['項目の意味。']);assert.equal(value('判定理由'),undefined);
 delete f.mapping.nullableReason;show(cases,'activities.name');assert.deepEqual(lines('説明'),['項目の意味。']);
 delete f.info.description;delete f.mapping.logicalMeaning;f.mapping.nullableReason='理由のみ。';show(cases,'activities.name');assert.deepEqual(lines('説明'),['この項目の説明はまだ記載されていません。']);
 delete f.mapping.nullableReason;show(cases,'activities.name');assert.deepEqual(lines('説明'),['この項目の説明はまだ記載されていません。']);covered.push('STRUCTURE-ORDER-003');
 show(model,'activities.name');assert.equal(value('所属'),'業務（Activity）');assert.equal(value('参照'),'なし');assert.equal(JSON.stringify(model),modelBefore);assert.deepEqual(readFileSync(source),bytes);assert.deepEqual(readFileSync(real),realBytes);covered.push('STRUCTURE-ORDER-004');
}finally{w.close();}
coverage(covered);assert.equal(hash(readFileSync(authority)),digest);
console.log(JSON.stringify({checks:covered,scope:'attribute detail order, nullability and meaningful explanation'}));
