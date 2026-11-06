import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

const authority='verification/structure-explorer-source-details.check-items.json';
const digest='ea706d19f535c7ded6bddab94184f200146e53958633b73c229b5f8282cdd4ed';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const authorityBytes=readFileSync(authority);assert.equal(hash(authorityBytes),digest);
const checks=JSON.parse(authorityBytes).checks.map(item=>item.id),covered=[];
const coverage=ids=>{assert.equal(ids.length,checks.length);assert.equal(new Set(ids).size,ids.length);assert.deepEqual(new Set(ids),new Set(checks));};
assert.throws(()=>coverage(checks.slice(1)));assert.throws(()=>coverage([...checks,checks[0]]));
const removed=JSON.parse(authorityBytes);removed.checks.shift();assert.notEqual(hash(JSON.stringify(removed)),digest);
const source='../business-design/alder/json-complete-concept-review.json',real='../business-design/alder/business-design.json';
const bytes=readFileSync(source),realBytes=readFileSync(real),model=JSON.parse(bytes).documents.find(d=>d.kind==='conceptModel'),before=JSON.stringify(model);
const code=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const w=new JSDOM('<div id="tree"></div><div id="detail"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
try{
 w.eval(code+';globalThis.Explorer=Explorer;');const detail=w.document.querySelector('#detail'),tree=w.document.querySelector('#tree');
 const field=(m,path)=>{const mapping=m.meta.fieldMappings.find(item=>item.physicalName===path),owner=m.concepts.find(c=>c.information.some(i=>i.id===mapping?.informationId));assert(mapping&&owner,path);return {mapping,owner,info:owner.information.find(i=>i.id===mapping.informationId)};};
 const show=(m,path)=>{const f=field(m,path);w.Explorer.renderStructureDetails(detail,m,{kind:'attribute',conceptId:f.owner.id,informationId:f.info.id});return f.mapping;};
 const value=label=>[...detail.querySelectorAll('dt')].find(dt=>dt.textContent===label)?.nextElementSibling?.textContent;
 const diagnostics=show(model,'Package.diagnostics');assert.equal(value('定義元'),undefined);assert.equal(value('参照元の型表記'),undefined);
 assert.equal(value('論理名'),'diagnostics');assert.equal(value('型名'),'string[]');assert.equal(value('null許容'),'許容する');assert(value('説明').includes('null許容の理由：'));assert.equal(value('サンプル'),'例：[]');assert(!detail.textContent.includes('Package.diagnostics'));
 assert.equal(diagnostics.sourceSchemaPath,'Package.diagnostics');assert.equal(diagnostics.valueType,'string[]');
 const scope=show(model,'activities.scope');assert.equal(value('定義元'),undefined);assert.equal(value('参照元の型表記'),undefined);assert.equal(value('型名'),'boolean');assert.equal(value('null許容'),'許容する');assert.equal(scope.valueType,'boolean | null');covered.push('STRUCTURE-SOURCE-001');
 w.Explorer.renderStructureExplorer(tree,model,{rootId:'n-package'});const search=tree.querySelector('input[type="search"]');search.value='Package.diagnostics';search.dispatchEvent(new w.Event('input',{bubbles:true}));assert([...tree.querySelectorAll('[data-information-id="cf-2afe02557bfa91"]')].some(item=>!item.hidden),'the retained source path remains searchable');
 const changed=structuredClone(model),pending=field(changed,'activities.scope').mapping;pending.nullable=null;show(changed,'activities.scope');assert.equal(value('null許容'),'未決');
 delete pending.nullable;delete pending.nullableStatus;pending.sampleValue=null;show(changed,'activities.scope');assert.equal(value('null許容'),'未定義');
 assert.equal(JSON.stringify(model),before);assert.deepEqual(readFileSync(source),bytes);assert.deepEqual(readFileSync(real),realBytes);covered.push('STRUCTURE-SOURCE-002');
}finally{w.close();}
coverage(covered);assert.equal(hash(readFileSync(authority)),digest);
console.log(JSON.stringify({checks:covered,scope:'source metadata hidden in details and preserved for conversion'}));
