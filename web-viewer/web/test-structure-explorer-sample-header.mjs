import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

const digest=value=>createHash('sha256').update(value).digest('hex');
const authority='verification/structure-explorer-sample-header.check-items.json',authorityHash='b4970da4bfc47efd27a7739f706f551d41a066a48952e4264663e858e9882629';
const fixed={
 '../business-design/alder/json-complete-concept-review.json':'1f8abc11ad3ff741acb6e4e26ce7c47ac1a02327e6a6fa99941a6e54acf5bec7',
 '../business-design/alder/business-design.json':'b8356070947d73502197e08560a9084e139aa8c0f7c88c64109a98502d7182c9',
 '../tools/document_storage/schema.mjs':'e46e388660df746173e16e8c72b56e9a9a74f6fcd6935f5bff304737961dddb2'
};
const verify=()=>{assert.equal(digest(readFileSync(authority)),authorityHash);for(const [path,hash] of Object.entries(fixed))assert.equal(digest(readFileSync(path)),hash,path);};verify();
const required=JSON.parse(readFileSync(authority)).checks.map(item=>item.id),covered=[];
const coverage=actual=>{assert.equal(actual.length,required.length);assert.equal(new Set(actual).size,actual.length);assert.deepEqual(new Set(actual),new Set(required));};
assert.throws(()=>coverage(required.slice(1)));assert.throws(()=>coverage([...required,required[0]]));
const model=JSON.parse(readFileSync('../business-design/alder/json-complete-concept-review.json')).documents.find(d=>d.kind==='conceptModel'),before=JSON.stringify(model);
const code=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const w=new JSDOM('<div class="concept-drawer-body"><div class="concept-related-content"></div></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
try{
 w.eval(code+';globalThis.Explorer=Explorer;');const detail=w.document.querySelector('.concept-related-content');
 const style=w.document.createElement('style');style.textContent=readFileSync('src/structure-explorer.css','utf8')+'\n'+readFileSync('src/viewer-shell.css','utf8');w.document.head.append(style);
 const get=(m,path)=>{const item=m.meta.fieldMappings.find(x=>x.physicalName===path);assert(item,path);return item;};
 const show=(m,conceptId='n-bd')=>w.Explorer.renderStructureDetails(detail,m,{kind:'structure',conceptId});
 const row=(m,path)=>detail.querySelector(`[data-information-id="${get(m,path).informationId}"]`);
 const value=label=>[...detail.querySelectorAll('dt')].find(dt=>dt.textContent===label)?.nextElementSibling?.textContent;
 const sample=(m,path)=>row(m,path).querySelector('td').textContent;
 const revision=get(model,'businessDesigns.revision');assert.equal(revision.sampleValue,'bd-review-1');assert.equal(revision.referenceValue,'alder-design-1');assert(revision.referenceSource);
 show(model);assert.equal(sample(model,'businessDesigns.revision'),'bd-review-1');assert(!row(model,'businessDesigns.revision').textContent.includes('alder-design-1'));assert(!row(model,'businessDesigns.revision').textContent.includes(revision.referenceSource));
 row(model,'businessDesigns.revision').querySelector('button').click();assert.equal(value('サンプル'),'bd-review-1');assert.equal(value('参考の出所'),undefined);assert(!detail.textContent.includes('alder-design-1'));detail.querySelector('.structure-attribute-back').click();
 const changed=structuredClone(model),field=get(changed,'businessDesigns.revision');delete field.sampleValue;field.referenceValue='参照値のみ';field.referenceSource='参考資料';show(changed);assert.equal(sample(changed,'businessDesigns.revision'),'参照値のみ');assert(!row(changed,'businessDesigns.revision').textContent.includes('参考資料'));
 field.sampleValue='作成例';field.sampleKind='reference';show(changed);assert.equal(sample(changed,'businessDesigns.revision'),'作成例');covered.push('STRUCTURE-SAMPLE-HEADER-001');
 for(const [actual,expected] of [[0,'0'],[false,'false'],[null,'null'],['','""'],[['a','b'],'["a","b"]'],[{x:1},'{"x":1}']]){field.sampleValue=actual;show(changed);assert.equal(sample(changed,'businessDesigns.revision'),expected);row(changed,'businessDesigns.revision').querySelector('button').click();assert.equal(value('サンプル'),expected);}
 field.sampleValue='<img src=x onerror=alert(1)>'+('長い値'.repeat(100));show(changed);assert.equal(sample(changed,'businessDesigns.revision'),field.sampleValue);assert.equal(detail.querySelector('img'),null);
 delete field.sampleValue;delete field.referenceValue;show(changed);assert.equal(sample(changed,'businessDesigns.revision'),'未記載');row(changed,'businessDesigns.revision').querySelector('button').click();assert.equal(value('サンプル'),'未記載');covered.push('STRUCTURE-SAMPLE-HEADER-002');
 show(model);const headers=[...detail.querySelectorAll('.structure-attribute-table thead th')];assert.deepEqual(headers.map(x=>x.textContent),['項目','サンプル','説明']);for(const th of headers){const css=w.getComputedStyle(th);assert.equal(css.position,'sticky');assert(['0','0px'].includes(css.top));assert.equal(css.zIndex,'1');}assert.match(style.textContent,/\.structure-attribute-table thead th\{[^}]*background:var\(--bg\)/);
 const wrap=detail.querySelector('.structure-attribute-wrap'),wrapStyle=w.getComputedStyle(wrap);assert(!['auto','scroll','hidden'].includes(wrapStyle.overflowX));assert(!['auto','scroll','hidden'].includes(wrapStyle.overflow));assert.equal(w.getComputedStyle(w.document.querySelector('.concept-drawer-body')).overflow,'auto');covered.push('STRUCTURE-SAMPLE-HEADER-003');
 const table=detail.querySelector('.structure-attribute-table'),cell=table.querySelector('td');assert.equal(w.getComputedStyle(table).tableLayout,'fixed');assert.equal(w.getComputedStyle(table).width,'100%');assert.equal(w.getComputedStyle(cell).overflowWrap,'anywhere');assert.equal(JSON.stringify(model),before);verify();covered.push('STRUCTURE-SAMPLE-HEADER-004');
}finally{w.close();}
coverage(covered);verify();console.log(JSON.stringify({checks:covered,scope:'sample-only display, fallback, data preservation and sticky-header CSS/DOM; geometry requires browser'}));
