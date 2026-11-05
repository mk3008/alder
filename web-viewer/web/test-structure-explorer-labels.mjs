import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

const hashes={
 'verification/structure-explorer-labels.check-items.json':'fbb91d652356995c54bad10572ff783b2074ae896b4bbf9e6bb492c576fbd9e9',
 'verification/structure-explorer.check-items.json':'ffbab6ccab3329ea3b9ca0fb5e5e56c2d726b80e723ced8c5171feca573c66fc',
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
const source=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const window=new JSDOM('<div id="host"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
const covered=[];
try{
 window.eval(source+';globalThis.Explorer=Explorer;');const host=window.document.getElementById('host');
 const render=(model,rootId)=>window.Explorer.renderStructureExplorer(host,model,{rootId});
 const open=details=>{details.open=true;details.dispatchEvent(new window.Event('toggle'));};
 const row=id=>host.querySelector(`[data-relation-id="${id}"] > details > summary`);
 const pairs=summary=>[...summary.querySelectorAll(':scope > .structure-element')].map(node=>[node.querySelector('strong').textContent,node.querySelector('.structure-element-type').textContent]);

 render(normalized,'n-step');
 const root=host.querySelector('.structure-root > .structure-item > details > summary');
 assert.equal(root.querySelector(':scope > strong').textContent,'手順行（Step）');assert.equal(root.querySelector('.structure-element'),null,'a root is a type, not a child property');
 const attribute=host.querySelector('.structure-fields > .structure-field');
 assert.match(attribute.textContent,/識別子.*型：未定義.*steps\.id/,'an attribute shows its name and known or undefined type before the original physical name');
 open(host.querySelector('[data-relation-id="nr-step-exchange"] > details'));
 const paired=row('nr-exchange-pair');
 assert.deepEqual(pairs(paired),[['対応する手順','手順行（Step）']]);
 assert.equal(paired.querySelector('.structure-edge-detail').textContent,'pairedStepId');
 assert.equal(paired.querySelector('.structure-edge-detail').title,'stepInteractions.pairedStepId');
 assert.match(paired.textContent,/対応手順。/,'the relation description remains available');
 assert.equal(paired.querySelector('.structure-count').textContent,'0..1');
 assert.deepEqual(pairs(row('nr-step-data')),[['名前未定義','情報のまとまり（Data）']],'many-to-many without a declared element is not invented as an array');
 assert.equal(row('nr-step-data').querySelector('.structure-count').textContent,'0..N');
 const search=host.querySelector('input[type=search]');search.value='対応する手順';search.dispatchEvent(new window.Event('input'));
 assert([...host.querySelectorAll('[data-relation-id="nr-exchange-pair"]')].some(item=>!item.hidden),'search includes the source element name');
 search.value='';search.dispatchEvent(new window.Event('input'));
 covered.push('STRUCTURE-LABEL-001');

 render(physical,'fmt-package');
 const pkgRoot=host.querySelector('.structure-root > .structure-item > details > summary');
 assert.equal(pkgRoot.querySelector(':scope > strong').textContent,'文書パッケージ（0.7候補）');
 assert.deepEqual(pairs(row('rel-package-bd')),[['文書一覧','業務設計書（Business Design）[]']],'the explicit array is attached to the element type');
 render(physical,'fmt-order');
 assert.deepEqual(pairs(row('rel-order-step')),[['前後の手順','手順行（Step）'],['対象手順','手順行（Step）[]']],'each mapped element keeps its own name and array metadata');
 covered.push('STRUCTURE-LABEL-002');

 const ambiguous=structuredClone(physical);
 ambiguous.meta.fieldMappings.push({informationId:'fmt-package-field-4',physicalName:'other[]',relationIds:['rel-package-bd'],valueType:'array'});
 render(ambiguous,'fmt-package');
 assert.deepEqual(pairs(row('rel-package-bd')),[['名前未定義','業務設計書（Business Design）']],'conflicting mappings do not select a name or array status');
 const explicit=structuredClone(physical),mapping=explicit.meta.fieldMappings.find(item=>item.informationId==='fmt-package-field-1');
 mapping.valueType='string';render(explicit,'fmt-package');
 const first=host.querySelector('.structure-fields > .structure-field');
 assert.match(first.textContent,/形式.*型：string.*format/,'explicit attribute types remain visible');
 covered.push('STRUCTURE-LABEL-003');
}finally{window.close();}
coverage(covered);for(const path of Object.keys(hashes))verify(path,readFileSync(path));
console.log('STRUCTURE-LABEL-001..003: root type, element name/type, explicit arrays and undefined/ambiguous mappings verified.');
