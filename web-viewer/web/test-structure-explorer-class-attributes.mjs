import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const authority='verification/structure-explorer-class-attributes.check-items.json';
const authorityHash='910329aa83b5697b4b5f576ec59aa4668f025737cea87124556b0418c41a0de5';
const fixed={
 '../business-design/alder/json-complete-concept-review.json':'5eacaf2d16da2a2dbc86d071526c1570a9c2085f1ac6ed3ea86f6d208c1f4fa7',
 '../business-design/alder/business-design.json':'b8356070947d73502197e08560a9084e139aa8c0f7c88c64109a98502d7182c9',
 '../tools/document_storage/schema.mjs':'e46e388660df746173e16e8c72b56e9a9a74f6fcd6935f5bff304737961dddb2'
};
const verify=()=>{assert.equal(hash(readFileSync(authority)),authorityHash);for(const [path,digest] of Object.entries(fixed))assert.equal(hash(readFileSync(path)),digest,path);};verify();
const required=JSON.parse(readFileSync(authority)).checks.map(item=>item.id),covered=[];
const coverage=ids=>{assert.equal(ids.length,required.length);assert.equal(new Set(ids).size,ids.length);assert.deepEqual(new Set(ids),new Set(required));};
assert.throws(()=>coverage(required.slice(1)));assert.throws(()=>coverage([...required,required[0]]));
const pkg=JSON.parse(readFileSync('../business-design/alder/json-complete-concept-review.json')),model=pkg.documents.find(item=>item.kind==='conceptModel'),before=JSON.stringify(model);
const code=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const w=new JSDOM('<div id="tree"></div><div id="detail"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
try{
 w.eval(code+';globalThis.Explorer=Explorer;');const tree=w.document.querySelector('#tree'),detail=w.document.querySelector('#detail');
 const render=(m,id)=>w.Explorer.renderStructureExplorer(tree,m,{rootId:id,select:selection=>w.Explorer.renderStructureDetails(detail,m,selection)});
 const show=(m,selection)=>w.Explorer.renderStructureDetails(detail,m,selection);
 const mapping=(m,path)=>{const x=m.meta.fieldMappings.find(item=>item.physicalName===path);assert(x,path);return x;};
 const row=(m,path)=>detail.querySelector(`.structure-attribute-table tbody tr[data-information-id="${mapping(m,path).informationId}"]`);
 const value=label=>[...detail.querySelectorAll('dt')].find(item=>item.textContent===label)?.nextElementSibling?.textContent;
 const selectRoot=()=>tree.querySelector('.structure-root > li > details > summary').click();

 show(model,{kind:'structure',conceptId:'n-activity'});
 const table=detail.querySelector('table.structure-attribute-table');assert(table);assert.equal(table.getAttribute('aria-label'),'業務の項目とサンプル');
 assert.deepEqual([...table.querySelectorAll('thead th')].map(item=>item.textContent),['項目','サンプル','説明']);
 for(const path of ['activities.id','activities.name','activities.scope','activities.why','activities.when'])assert(row(model,path),path+' immediate attribute');
 assert.match(row(model,'activities.id').textContent,/識別子.*論理名：id.*型：識別子.*calculate-score/);
 assert.match(row(model,'activities.name').textContent,/名前.*1回の点数を計算する.*他の業務と区別/);
 assert.match(row(model,'activities.scope').textContent,/システム化対象.*boolean.*true/);
 assert.match(row(model,'activities.why').textContent,/目的.*点数を知るため/);
 assert.match(row(model,'activities.when').textContent,/開始条件.*入力したとき/);
 assert(!row(model,'activities.whoId'),'a relation key is not repeated as an attribute');assert(!row(model,'steps.action'),'child structure attributes are not mixed in');
 show(model,{kind:'structure',conceptId:'n-activity',fromId:'n-bd',relationId:'nr-bd-activity'});assert(row(model,'activities.name'));
 show(model,{kind:'structure',conceptId:'n-information',fromId:'n-dataitem',relationId:'nr-dataitem-information'});assert(row(model,'information.name'));assert(!row(model,'information.objectId'));
 covered.push('STRUCTURE-CLASS-ATTR-001');

 const changed=structuredClone(model),variants=[['activities.id',0],['activities.name',false],['activities.why',''],['activities.when',null]];
 for(const [path,sample] of variants){const x=mapping(changed,path);x.sampleValue=sample;delete x.referenceValue;delete x.referenceSource;}
 const source=mapping(changed,'activities.scope');delete source.sampleValue;delete source.referenceValue;source.referenceSource='参照値のない出所';
 show(changed,{kind:'structure',conceptId:'n-activity'});
 for(const [path,expected] of [['activities.id','0'],['activities.name','false'],['activities.why','""'],['activities.when','null']])assert(row(changed,path).textContent.includes(expected),path);
 assert.match(row(changed,'activities.scope').textContent,/未記載/);assert(!row(changed,'activities.scope').textContent.includes('参照値のない出所'));
 assert(!detail.textContent.includes('サンプルは項目ごとの例'));
 show(model,{kind:'structure',conceptId:'n-activity'});const originalName=row(model,'activities.name');assert.match(originalName.textContent,/1回の点数を計算する/);assert(!originalName.textContent.includes('参考：'));assert(!originalName.textContent.includes('Alder自身の業務設計書'));assert.equal(mapping(model,'activities.name').referenceValue,'業務設計');
 covered.push('STRUCTURE-CLASS-ATTR-002');

 render(model,'n-step');selectRoot();const legacy=mapping(model,'steps.legacyText');assert(!detail.querySelector(`tr[data-information-id="${legacy.informationId}"]`));
 const toggle=tree.querySelector('.structure-compatibility-filter input');toggle.checked=false;toggle.dispatchEvent(new w.Event('change',{bubbles:true}));
 assert.match(row(model,'steps.legacyText').textContent,/互換・移行用/);toggle.checked=true;toggle.dispatchEvent(new w.Event('change',{bubbles:true}));assert(!detail.querySelector(`tr[data-information-id="${legacy.informationId}"]`));
 const marked=model.concepts.find(c=>c.information.some(i=>model.meta.compatibilityReview.fields[i.id]?.kind==='needs-review'));
 show(model,{kind:'structure',conceptId:marked.id});assert(detail.querySelector('.structure-attribute-table .structure-review-needs-review .structure-review-badge'));
 covered.push('STRUCTURE-CLASS-ATTR-003');

 render(model,'n-activity');selectRoot();const nameField=mapping(model,'activities.name');const button=detail.querySelector(`[data-information-id="${nameField.informationId}"] button`);assert(button);assert(!tree.querySelector('[data-information-id]'));button.click();
 assert.equal(detail.querySelector('table.structure-attribute-table'),null);assert.equal(value('ローカル名'),'名前');assert.equal(value('所属'),'業務（Activity）');assert.match(value('サンプル'),/1回の点数を計算する/);assert.match(value('説明'),/他の業務と区別/);detail.querySelector('.structure-attribute-back').click();assert(row(model,'activities.name'));
 show(model,{kind:'structure',conceptId:'n-activity'});assert.equal(value('所属'),'業務設計書（BusinessDesign）');assert(value('含む構造').includes('標準手順'));
 assert.equal(JSON.stringify(model),before);verify();covered.push('STRUCTURE-CLASS-ATTR-004');

 const long=structuredClone(model),x=mapping(long,'activities.name'),unsafe='<script>alert(1)</script>'+('非常に長い名前'.repeat(100));x.sampleValue=unsafe;x.referenceValue='参考の値';x.referenceSource='サンプル出所';
 show(long,{kind:'structure',conceptId:'n-activity'});const current=row(long,'activities.name');assert(current.textContent.includes(unsafe));assert(!current.textContent.includes('参考の値'));assert(!current.textContent.includes('サンプル出所'));assert.equal(x.referenceValue,'参考の値');assert.equal(x.referenceSource,'サンプル出所');assert.equal(detail.querySelector('script'),null);
 assert([...detail.querySelectorAll('thead th')].every(th=>th.getAttribute('scope')==='col'));assert([...detail.querySelectorAll('tbody th')].every(th=>th.getAttribute('scope')==='row'));
 const css=readFileSync('src/structure-explorer.css','utf8');assert.match(css,/\.structure-attribute-table thead th\{[^}]*position:sticky;top:0/);assert.doesNotMatch(css,/\.structure-attribute-wrap\{[^}]*overflow-x:auto/);assert.match(css,/\.structure-attribute-table th,\.structure-attribute-table td\{[^}]*overflow-wrap:anywhere/);
 covered.push('STRUCTURE-CLASS-ATTR-005');
}finally{w.close();}
coverage(covered);verify();console.log(JSON.stringify({checks:covered,scope:'class attribute table, samples, compatibility and individual detail'}));
