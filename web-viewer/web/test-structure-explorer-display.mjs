import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {structureGraph} from '../src/structure-explorer.ts';

const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const authorities={
 'verification/structure-explorer-key-display.check-items.json':'ebba5f0f48d97204a7f0e19c3d63fb1c1f481247b1b1a72e7bbd1098b35322d7',
 'verification/structure-explorer-sample-values.check-items.json':'6cff19488af3ddd530d0e72a3fa46b213a8f1a3f76989a5726b087ff454b2fba'
};
const checks=[];
for(const [path,digest] of Object.entries(authorities)){
 const bytes=readFileSync(path);assert.equal(hash(bytes),digest,path+' must remain unchanged');
 checks.push(...JSON.parse(bytes).checks.map(check=>check.id));
}
assert.deepEqual(checks,['STRUCTURE-KEYDISPLAY-001','STRUCTURE-KEYDISPLAY-002','STRUCTURE-KEYDISPLAY-003','STRUCTURE-SAMPLE-001','STRUCTURE-SAMPLE-002','STRUCTURE-SAMPLE-003']);
const coverage=results=>assert.deepEqual(results.slice().sort(),checks.slice().sort(),'every display guarantee is exercised once');
assert.throws(()=>coverage(checks.slice(1)),/every display guarantee/);
assert.throws(()=>coverage([...checks,checks[0]]),/every display guarantee/);

const read=path=>JSON.parse(readFileSync(path,'utf8'));
const model=read('../business-design/alder/json-normalized-model-review.json').documents.find(doc=>doc.kind==='conceptModel');
const physical=read('../business-design/alder/json-structure-review.json').documents.find(doc=>doc.kind==='conceptModel');
const normalizedBytes=readFileSync('../work/normalization-candidate/example-normalized.json');
const sourceBytes=readFileSync('../work/normalization-candidate/example-source.json');
const normalized=JSON.parse(normalizedBytes);
assert.equal(hash(normalizedBytes),'cfb0ee8dd1dd7b0aa99e868abc3844542c3c6881cc7c8315fb8f3a5a6566152a');
assert.equal(hash(sourceBytes),'fa94aa2098a3a4578648c2403f184bb73bb65e2e40311442f9e7d848743d0b8f');
const paper=read('../work/340-structure-explorer-review/paper-manual-v06.json');
const method=paper.documents.find(doc=>doc.kind==='businessDesign').activities.flatMap(activity=>activity.procedure.steps).find(step=>step.method)?.method;
assert.equal(method,'目視');

const code=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const w=new JSDOM('<div id="host"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
const covered=[];
try{
 w.eval(code+';globalThis.Explorer=Explorer;');const host=w.document.getElementById('host');
 const detail=w.document.createElement('div');let shown;
 const render=(m,id)=>{shown=m;w.Explorer.renderStructureExplorer(host,m,{rootId:id,select:selection=>w.Explorer.renderStructureDetails(detail,m,selection)});host.querySelector('.structure-root > li > details > summary').click();};
 const row=id=>host.querySelector(`[data-relation-id="${id}"] > details > summary`);
 const attribute=path=>{const id=shown.meta.fieldMappings.find(item=>item.physicalName===path)?.informationId;if(!detail.querySelector('.structure-attribute-table'))host.querySelector('.structure-root > li > details > summary').click();return detail.querySelector(`.structure-attribute-table [data-information-id="${id}"]`);};
 const values=label=>{const dt=[...detail.querySelectorAll('dt')].find(node=>node.textContent===label),dd=dt?.nextElementSibling;return dd?[...dd.childNodes].filter(node=>node.nodeType===w.Node.TEXT_NODE).map(node=>node.textContent):[];};
 const samples=path=>{attribute(path)?.querySelector('button').click();const result=values('サンプル');detail.querySelector('.structure-attribute-back')?.click();return result.length===1&&['なし','未定義','未記載'].includes(result[0])?[]:result;};
 const sample=path=>samples(path)[0];
 const showRelation=(conceptId,fromId,relationId)=>w.Explorer.renderStructureDetails(detail,shown,{kind:'structure',conceptId,fromId,relationId});

 render(model,'n-activity');
 for(const [id,label,count] of [
  ['nr-activity-step','手順','1..N'],['nr-activity-result','業務結果','1..N'],
  ['nr-activity-decision','判定表','0..N'],['nr-activity-exception','例外','0..N'],
  ['nr-activity-order','旧順序規則','0..N'],['nr-who-activity','実行主体','0..1']
 ]){const current=row(id);assert(current);assert(current.textContent.includes(label));assert.equal(current.querySelector('.structure-count').textContent,count);assert.equal(current.querySelector('.structure-edge-detail'),null,id+' has no redundant key suffix');}
 assert(!row('nr-who-activity').textContent.includes('未決はNULL'));showRelation('n-who','n-activity','nr-who-activity');assert(detail.textContent.includes('未決はNULL'),'relationship description is retained in the detail');
 render(model,'n-object');assert.equal(row('nr-object-information').querySelector('.structure-edge-detail'),null);
 covered.push('STRUCTURE-KEYDISPLAY-001');

 assert.match(row('nr-object-information').title,/information\.objectId/);
 render(model,'n-bd');assert.match(row('nr-bd-object').title,/objects\.documentId/);
 render(model,'n-activity');assert.match(row('nr-activity-step').title,/steps\.activityId/);assert.match(row('nr-who-activity').title,/activities\.whoId/);
 const graph=structureGraph(model);assert.deepEqual(graph.edges.get('n-activity').find(edge=>edge.relation.id==='nr-who-activity').fields,['activities.whoId']);
 render(model,'n-bd');const search=host.querySelector('input[type=search]');search.value='objects.documentId';search.dispatchEvent(new w.Event('input'));
 assert([...host.querySelectorAll('[data-relation-id="nr-bd-object"]')].some(node=>!node.hidden));
 covered.push('STRUCTURE-KEYDISPLAY-002');

 render(physical,'fmt-package');assert.equal(row('rel-package-bd').querySelector('.structure-edge-detail'),null);showRelation('fmt-bd','fmt-package','rel-package-bd');assert(detail.textContent.includes('documents[]'));assert.equal(host.querySelectorAll('.structure-example').length,0);
 render(physical,'fmt-order');const order=shown.relations.find(item=>item.id==='rel-order-step');showRelation(order.toConceptId,order.fromConceptId,order.id);assert.match(detail.textContent,/beforeId \/ afterId/);assert.match(detail.textContent,/stepIds\[\]/);
 const unmarked=structuredClone(model),who=unmarked.meta.fieldMappings.find(item=>item.physicalName==='activities.whoId');delete who.representation;render(unmarked,'n-activity');
 assert.equal(row('nr-who-activity').querySelector('.structure-edge-detail'),null);showRelation('n-who','n-activity','nr-who-activity');assert(values('論理名').includes('whoId'));assert.deepEqual(structureGraph(unmarked).edges.get('n-activity').find(edge=>edge.relation.id==='nr-who-activity').fields,['activities.whoId']);
 host.querySelector('.structure-root > li > details > summary').click();assert(attribute('activities.whoId'),'an unmarked mapping remains an attribute');
 covered.push('STRUCTURE-KEYDISPLAY-003');

 const activity=normalized.entities.activities[0],step=normalized.entities.steps[0];
 render(model,'n-activity');
 assert.equal(sample('activities.name'),''+activity.name);assert.equal(sample('activities.scope'),'true');assert.equal(sample('activities.why'),''+activity.why);
 assert(attribute('activities.name').textContent.includes('型：未定義'),'examples do not invent a type');
 render(model,'n-object');assert.equal(sample('objects.scope'),'false');
 render(model,'n-step');assert.equal(sample('steps.action'),''+step.action);assert.equal(sample('steps.method'),method);
 covered.push('STRUCTURE-SAMPLE-001');
 assert.equal(step.method,null,'the reference does not alter the normalized input');
 assert.equal(model.meta.fieldMappings.find(item=>item.physicalName==='steps.method').sampleKind,'reference');
 render(model,'n-data');assert.deepEqual(samples('data.name'),[''+normalized.entities.data[0].name]);
 render(model,'n-dataitem');assert.deepEqual(samples('dataItems.condition'),['null']);
 render(model,'n-information');assert.deepEqual(samples('information.name'),[''+normalized.entities.information[0].name]);
 render(model,'n-dependency');const emptyIds=[...detail.querySelectorAll('.structure-attribute-table tbody tr')].map(row=>row.dataset.informationId);if(!emptyIds.length)assert.match(detail.textContent,/表示する属性はありません/);for(const id of emptyIds){detail.querySelector(`[data-information-id="${id}"] button`).click();assert.deepEqual(values('サンプル'),['未記載'],'a structure with no sample rows has no invented values');detail.querySelector('.structure-attribute-back').click();}
 covered.push('STRUCTURE-SAMPLE-002');

 const modified=structuredClone(model),name=modified.meta.fieldMappings.find(item=>item.physicalName==='activities.name');
 for(const [value,expected] of [[0,'0'],[false,'false'],[null,'null'],['','""'],[['a','b'],'["a","b"]'],[{x:1},'{"x":1}']]){
  name.sampleValue=value;render(modified,'n-activity');assert.equal(sample('activities.name'),expected);assert(attribute('activities.name').textContent.includes('型：未定義'));
 }
 name.sampleValue='<script>example</script>';render(modified,'n-activity');assert.equal(sample('activities.name'),'<script>example</script>');assert.equal(detail.querySelector('script'),null,'sample text cannot create DOM elements');
 delete name.sampleValue;render(modified,'n-activity');assert.equal(sample('activities.name'),undefined);
 covered.push('STRUCTURE-SAMPLE-003');
}finally{w.close();}
coverage(covered);
for(const [path,digest] of Object.entries(authorities))assert.equal(hash(readFileSync(path)),digest,path+' must remain unchanged');
assert.deepEqual(readFileSync('../work/normalization-candidate/example-normalized.json'),normalizedBytes);
assert.deepEqual(readFileSync('../work/normalization-candidate/example-source.json'),sourceBytes);
console.log('STRUCTURE-KEYDISPLAY-001..003 and STRUCTURE-SAMPLE-001..003: relation keys, explicit values and preservation verified.');
