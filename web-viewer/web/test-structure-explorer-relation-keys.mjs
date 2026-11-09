import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {structureGraph} from '../src/structure-explorer.ts';

const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const authorityPath='verification/structure-explorer-relation-keys.check-items.json';
const authorityHash='1e95a018d88f0e145c33eb662ff48bd88bf1f9f6ceaac42d322e5740f6f1b2d4';
const authority=readFileSync(authorityPath);
const verifyAuthority=bytes=>assert.equal(hash(bytes),authorityHash,'relationship-key authority must not change');
verifyAuthority(authority);assert.throws(()=>verifyAuthority(Buffer.from('{}')),/authority must not change/);
const ids=JSON.parse(authority).checks.map(check=>check.id);
assert.deepEqual(ids,['STRUCTURE-RELKEY-001','STRUCTURE-RELKEY-002','STRUCTURE-RELKEY-003','STRUCTURE-RELKEY-004']);
const coverage=results=>assert.deepEqual(results.slice().sort(),ids.slice().sort(),'every relationship-key guarantee must be exercised once');
assert.throws(()=>coverage(ids.slice(1)),/every relationship-key guarantee/);
assert.throws(()=>coverage([...ids,ids[0]]),/every relationship-key guarantee/);

const read=path=>JSON.parse(readFileSync(path,'utf8'));
const modelPath='../business-design/alder/json-normalized-model-review.json';
const physicalPath='../business-design/alder/json-structure-review.json';
const dataPath='../work/normalization-candidate/example-normalized.json';
const normalized=read(modelPath).documents.find(doc=>doc.kind==='conceptModel');
const physicalBytes=readFileSync(physicalPath),physical=JSON.parse(physicalBytes).documents.find(doc=>doc.kind==='conceptModel');
const dataBytes=readFileSync(dataPath),data=JSON.parse(dataBytes);
assert.equal(hash(physicalBytes),'feaadc66c694764fe1e22d2c7b38441b4e284113513cf5ccd94fef570d35a70c');
assert.equal(hash(dataBytes),'cfb0ee8dd1dd7b0aa99e868abc3844542c3c6881cc7c8315fb8f3a5a6566152a');
assert(data.entities.information.some(info=>info.objectId));
assert(data.entities.objects.every(object=>object.documentId));
assert(data.entities.activities.some(activity=>activity.whoId));

const graph=structureGraph(normalized),marked=normalized.meta.fieldMappings.filter(mapping=>mapping.representation==='relationKey');
assert.deepEqual([...graph.relationKeys].sort(),marked.map(mapping=>mapping.informationId).sort(),'each declared key must resolve to actual endpoint relationships');
assert.deepEqual(graph.edges.get('n-object').find(edge=>edge.relation.id==='nr-object-information').fields,['information.objectId']);
assert.deepEqual(graph.edges.get('n-bd').find(edge=>edge.relation.id==='nr-bd-object').fields,['objects.documentId']);
assert.deepEqual(graph.edges.get('n-activity').find(edge=>edge.relation.id==='nr-who-activity').fields,['activities.whoId']);

const code=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const w=new JSDOM('<div id="host"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
const covered=[];
try{
 w.eval(code+';globalThis.Explorer=Explorer;');const host=w.document.getElementById('host'),detail=w.document.createElement('div');
 const render=(model,id)=>{w.Explorer.renderStructureExplorer(host,model,{rootId:id,select:selection=>w.Explorer.renderStructureDetails(detail,model,selection)});host.querySelector('.structure-root > li > details > summary').click();};
 const fields=()=>[...detail.querySelectorAll('.structure-attribute-table tbody tr')].map(element=>element.textContent);
 const row=id=>host.querySelector(`[data-relation-id="${id}"] > details > summary`);
 const mapping=model=>model.meta.fieldMappings.find(field=>field.informationId==='n-information-field-3');

 render(normalized,'n-information');
 assert.equal(fields().length,2);assert(fields().some(value=>value.includes('識別子'))&&fields().some(value=>value.includes('項目名')));
 assert(!fields().some(value=>value.includes('所属する対象')||value.includes('objectId')));
 render(normalized,'n-activity');
 assert(!fields().some(value=>value.includes('実行主体')));assert(row('nr-who-activity').textContent.includes('実行主体'));
 render(normalized,'n-step');
 assert(!fields().some(value=>value.includes('所属する業務')||value.includes('適用する判定行')));
 assert(row('nr-step-when'));assert(fields().some(value=>value.includes('操作')));
 render(normalized,'n-check');assert(fields().some(value=>value.includes('表示番号')),'a Check display ID remains an attribute');
 const checkMapping=normalized.meta.fieldMappings.find(item=>item.physicalName.includes('Check.items.checkId'));w.Explorer.renderStructureDetails(detail,normalized,{kind:'attribute',conceptId:'n-check',informationId:checkMapping.informationId});assert(detail.textContent.includes('checkId'),'the code name remains available in the detail');
 covered.push('STRUCTURE-RELKEY-001');

 render(normalized,'n-object');assert.match(row('nr-object-information').title,/information\.objectId/);
 render(normalized,'n-bd');assert.match(row('nr-bd-object').title,/objects\.documentId/);
 render(normalized,'n-activity');assert.match(row('nr-who-activity').title,/activities\.whoId/);
 covered.push('STRUCTURE-RELKEY-002');

 const missing=structuredClone(normalized);mapping(missing).relationKeyIds=['unknown'];render(missing,'n-information');assert(fields().some(value=>value.includes('所属する対象')));
 const wrong=structuredClone(normalized);mapping(wrong).relationKeyIds=['nr-bd-data'];render(wrong,'n-information');assert(fields().some(value=>value.includes('所属する対象')));
 const duplicate=structuredClone(normalized);duplicate.meta.fieldMappings.push(structuredClone(mapping(duplicate)));render(duplicate,'n-information');assert(fields().some(value=>value.includes('所属する対象')));
 const malformed=structuredClone(normalized);mapping(malformed).relationKeyIds=['nr-object-information','missing'];render(malformed,'n-information');assert(fields().some(value=>value.includes('所属する対象')));
 const unmarked=structuredClone(normalized);delete mapping(unmarked).representation;render(unmarked,'n-information');assert(fields().some(value=>value.includes('所属する対象')));
 render(physical,'fmt-package');assert(fields().some(value=>value.includes('文書一覧')));assert(row('rel-package-bd'));
 covered.push('STRUCTURE-RELKEY-003');

 render(normalized,'n-bd');const search=host.querySelector('input[type=search]');search.value='objects.documentId';search.dispatchEvent(new w.Event('input'));
 assert([...host.querySelectorAll('[data-relation-id="nr-bd-object"]')].some(node=>!node.hidden),'search includes the owner relation physical path');
 search.value='';search.dispatchEvent(new w.Event('input'));
 render(normalized,'n-step');const expected=fields();
 const exchange=host.querySelector('[data-relation-id="nr-step-exchange"] > details');exchange.open=true;exchange.dispatchEvent(new w.Event('toggle'));
 const repeated=host.querySelector('[data-relation-id="nr-exchange-pair"] > details');repeated.open=true;repeated.dispatchEvent(new w.Event('toggle'));
 repeated.querySelector(':scope > summary').click();const repeatedFields=fields();
 assert.deepEqual(repeatedFields,expected,'a repeated Step and its individual root use the same conceptual attributes');
 assert.equal(row('nr-step-when').querySelector('.structure-count').textContent,'0..1');
 covered.push('STRUCTURE-RELKEY-004');
}finally{w.close();}
coverage(covered);verifyAuthority(readFileSync(authorityPath));
assert.deepEqual(readFileSync(physicalPath),physicalBytes);assert.deepEqual(readFileSync(dataPath),dataBytes);
console.log('STRUCTURE-RELKEY-001..004: conceptual fields, physical mappings, ambiguity and exploration verified.');
