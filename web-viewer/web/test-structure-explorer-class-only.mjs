import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const authority='verification/structure-explorer-class-only.check-items.json';
const lock='c4ce58038b54145ab65467a60d24d612a378d231a5a1ea939c7debec707c42ec';
const fixed={
 '../business-design/alder/json-complete-concept-review.json':'e93657d3680bac31907b7d54e96498e79dcff8ffd66c420ef3ca9441cc5a7181',
 '../business-design/alder/business-design.json':'b8356070947d73502197e08560a9084e139aa8c0f7c88c64109a98502d7182c9',
 '../tools/document_storage/schema.mjs':'9a6f63990f5b679ea807d873e56e0c5895aae28d1b253d78c3af63f4141546df'
};
const verify=()=>{assert.equal(digest(readFileSync(authority)),lock);for(const [path,hash] of Object.entries(fixed))assert.equal(digest(readFileSync(path)),hash,path);};verify();
const required=JSON.parse(readFileSync(authority)).checks.map(item=>item.id),covered=[];
const coverage=ids=>{assert.equal(ids.length,required.length);assert.equal(new Set(ids).size,ids.length);assert.deepEqual(new Set(ids),new Set(required));};
assert.throws(()=>coverage(required.slice(1)));assert.throws(()=>coverage([...required,required[0]]));
const model=JSON.parse(readFileSync('../business-design/alder/json-complete-concept-review.json')).documents.find(item=>item.kind==='conceptModel'),before=JSON.stringify(model);
const source=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const w=new JSDOM('<div id="tree"></div><div id="detail"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
try{
 w.eval(source+';globalThis.Explorer=Explorer;');const tree=w.document.querySelector('#tree'),detail=w.document.querySelector('#detail');
 const render=(m,id)=>w.Explorer.renderStructureExplorer(tree,m,{rootId:id,select:s=>w.Explorer.renderStructureDetails(detail,m,s)});
 const root=()=>tree.querySelector('.structure-root > li > details > summary');
 const mapping=(m,path)=>{const item=m.meta.fieldMappings.find(x=>x.physicalName===path);assert(item,path);return item;};
 const row=(m,path)=>detail.querySelector(`.structure-attribute-table tr[data-information-id="${mapping(m,path).informationId}"]`);
 const field=label=>[...detail.querySelectorAll('dt')].find(dt=>(dt.querySelector('.structure-detail-caption')?.textContent??dt.textContent)===label)?.nextElementSibling?.textContent;
 const query=value=>{const search=tree.querySelector('input[type=search]');search.value=value;search.dispatchEvent(new w.Event('input',{bubbles:true}));};
 const toggle=on=>{const input=tree.querySelector('.structure-compatibility-filter input');input.checked=on;input.dispatchEvent(new w.Event('change',{bubbles:true}));};
 const visible=element=>!!element&&!element.closest('[hidden]');

 render(model,'n-activity');root().click();assert.equal(tree.querySelector('[data-information-id]'),null);
 for(const path of ['activities.id','activities.name','activities.scope','activities.why','activities.when'])assert(row(model,path),path);
 assert(!row(model,'steps.action'));assert(tree.querySelector('[data-relation-id="nr-who-activity"]'));assert(tree.querySelector('[data-relation-id="nr-activity-step"]'));
 render(model,'n-object');root().click();assert(row(model,'objects.id'));assert(row(model,'objects.name'));
 render(model,'n-dataitem');tree.querySelector('[data-relation-id="nr-dataitem-information"] > details > summary').click();assert(row(model,'information.name'));assert(!row(model,'information.objectId'));
 const leaf=[...model.concepts].find(c=>c.information.length&&!model.relations.some(r=>r.fromConceptId===c.id));assert(leaf);render(model,leaf.id);root().click();assert(!tree.querySelector('[data-information-id]'));assert(detail.querySelector('.structure-attribute-table'));
 covered.push('STRUCTURE-CLASS-ONLY-001');

 render(model,'n-activity');for(const value of ['名前','activities.name']){query(value);assert([...tree.querySelectorAll('[data-concept-id="n-activity"]')].some(visible),value);query('');}
 render(model,'n-step');root().click();assert(!row(model,'steps.legacyText'));query('旧手順の記述');assert(!visible(tree.querySelector('.structure-root > li')));toggle(false);assert(visible(tree.querySelector('.structure-root > li')));assert.match(row(model,'steps.legacyText').textContent,/互換・移行用/);toggle(true);assert(!row(model,'steps.legacyText'));query('');
 covered.push('STRUCTURE-CLASS-ONLY-002');

 const variants=structuredClone(model),paths=['activities.id','activities.name','activities.scope','activities.why','activities.when'],values=[0,false,null,'','長いサンプル'.repeat(100)];
 for(let i=0;i<paths.length;i++){const item=mapping(variants,paths[i]);item.sampleValue=values[i];delete item.sampleKind;delete item.referenceValue;delete item.referenceSource;}
 const ref=mapping(variants,'activities.id');ref.referenceValue='参照値';ref.referenceSource='設計資料';
 render(variants,'n-activity');root().click();const expected=['0','false','null','""',values[4]];
 for(let i=0;i<paths.length;i++){const cell=row(variants,paths[i]).querySelector('td');const first=cell.querySelector('.structure-attribute-sample');assert.equal(first.textContent,expected[i]);assert(!first.textContent.startsWith('例：'));row(variants,paths[i]).querySelector('button').click();assert(field('サンプル').startsWith(expected[i]));detail.querySelector('.structure-attribute-back').click();}
 assert(!row(variants,'activities.id').textContent.includes('参照値'));assert(!row(variants,'activities.id').textContent.includes('設計資料'));assert.equal(ref.referenceValue,'参照値');assert.equal(ref.referenceSource,'設計資料');assert(!row(variants,'activities.id').textContent.includes('例：'));
 const absent=mapping(variants,'activities.when');delete absent.sampleValue;root().click();assert.match(row(variants,'activities.when').textContent,/未記載/);
 covered.push('STRUCTURE-CLASS-ONLY-003');

 render(model,'n-activity');root().click();const chosen=row(model,'activities.name').querySelector('button');chosen.focus();chosen.click();assert.equal(field('ローカル名'),'名前');assert.equal(field('論理名'),'name');assert.equal(field('型名'),'string');assert.equal(field('所属'),'業務（Activity）');assert(field('説明'));assert(field('サンプル'));assert.equal(w.document.activeElement.className,'structure-attribute-back');
 detail.querySelector('.structure-attribute-back').click();assert.equal(w.document.activeElement.textContent,'名前');assert(row(model,'activities.name'));assert(tree.querySelector('.structure-selected'));
 covered.push('STRUCTURE-CLASS-ONLY-004');

 render(model,'n-object');tree.querySelector('[data-relation-id="nr-object-information"] > details > summary').click();assert.equal(field('所属'),'対象（Object）');
 render(model,'n-dataitem');const reference=tree.querySelector('[data-relation-id="nr-dataitem-information"] > details');reference.open=true;reference.dispatchEvent(new w.Event('toggle'));assert(reference.querySelector('[data-relation-id="nr-object-information"][data-relation-direction="owner"]'));
 tree.querySelector('.structure-toolbar button').click();assert(tree.querySelectorAll('.structure-item').length<model.relations.length+model.concepts.length+10);assert(!tree.querySelector('[data-information-id]'));
 assert.equal(JSON.stringify(model),before);verify();covered.push('STRUCTURE-CLASS-ONLY-005');
}finally{w.close();}
coverage(covered);verify();console.log(JSON.stringify({checks:covered,scope:'class-only tree, attribute search, samples, detail navigation and preservation'}));
