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
 show(missing,byName('format'));assert.equal(value('説明'),'この項目の説明はまだ記載されていません。');assert(!detail.textContent.includes(f.mapping.nullableReason));
 f.info.description='利用者が記録した説明。';show(missing,byName('format'));assert.equal(value('説明'),'利用者が記録した説明。');
 f.info.description='  ';show(missing,byName('format'));assert.equal(value('説明'),'この項目の説明はまだ記載されていません。');
 show(model,byName('Concept.presentation.activityViews'));assert.equal(value('説明'),'この項目の説明はまだ記載されていません。');
 assert.equal(JSON.stringify(model),before);covered.push('STRUCTURE-MEANING-003');
}finally{w.close();}
const withoutMeanings=structuredClone(pkg);const priorMeta=withoutMeanings.documents.find(d=>d.kind==='conceptModel').meta;
// The later compatibility filter adds review annotations without changing
// the underlying mappings or the earlier meaning guarantee.
delete priorMeta.compatibilityReview;for(const mapping of priorMeta.fieldMappings)delete mapping.logicalMeaning;
// The procedure, exception-origin and information-owner requirements revise
// this candidate explicitly; retain a full lock apart from explanations.
assert.equal(hash(JSON.stringify(withoutMeanings)),'579814bed8f7fad00423cedd038f2f59016dfe6a35a5956f487df7303a67aff8','only field explanations may change beyond the approved conceptual revisions');
assert.equal(hash(readFileSync('../business-design/alder/business-design.json')),'b8356070947d73502197e08560a9084e139aa8c0f7c88c64109a98502d7182c9');
assert.equal(hash(readFileSync('../tools/document_storage/schema.mjs')),'e46e388660df746173e16e8c72b56e9a9a74f6fcd6935f5bff304737961dddb2');
assert.deepEqual(readFileSync(path),bytes);covered.push('STRUCTURE-MEANING-004');
coverage(covered);assert.equal(hash(readFileSync(authority)),authorityHash);
console.log(JSON.stringify({checks:covered,scope:'curated attribute explanations and preservation of original data'}));
