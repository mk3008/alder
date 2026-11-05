import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {structureGraph} from '../src/structure-explorer.ts';

const hash=value=>createHash('sha256').update(value).digest('hex');
const authorities={
 'verification/structure-explorer.check-items.json':'f2ce7214cbaa5cd114214eb9f38307e7bf56a9a15c74c37f402dff5459b2d3ca',
 'verification/concept-full-overview.check-items.json':'b596ec259b2dbfb2f7a7a745f4fd61a380bf3a2df7989c047b1c00e786489190',
 'verification/concept-reference-routing.check-items.json':'43aad9abfc64e4be353963c6c1ace38498ece338730479f833e9621dd1399e4a',
 'verification/concept-json-field-mapping.check-items.json':'45178adb013fb0345749d83148d9b265860a55fa05992bb05525c3ad066ec564',
 'verification/concept-one-corner.check-items.json':'cd93baac5aaf2631ad02ad3547c7c911da300ff8cf132465b9e1b84e968d848e',
 'verification/check-items.json':'ec33503c2527f02e7ca81ba961ece2e4c7c9a2dd4d9c426fe3baaddda97c65b1'
};
function verifyAuthority(path,bytes){assert.equal(hash(bytes),authorities[path],path+' authority must remain unchanged');}
for(const path of Object.keys(authorities))verifyAuthority(path,readFileSync(path));
assert.throws(()=>verifyAuthority('verification/structure-explorer.check-items.json',Buffer.from('{}')),/authority must remain unchanged/);
const checks=JSON.parse(readFileSync('verification/structure-explorer.check-items.json','utf8')).checks.map(c=>c.id);
assert.deepEqual(checks,['STRUCTURE-001','STRUCTURE-002','STRUCTURE-003','STRUCTURE-004']);
const covered=new Set();function coverage(actual){assert.deepEqual([...actual].sort(),checks.slice().sort(),'each requirement is exercised exactly once');assert.equal(actual.length,new Set(actual).size,'no duplicated result');}
assert.throws(()=>coverage(checks.slice(1)),/each requirement/);assert.throws(()=>coverage([...checks,checks[0]]),/each requirement|duplicated/);

const source=readFileSync('../business-design/alder/json-normalized-model-review.json');
assert.equal(hash(source),'7bcf873a2bc0c3fa7fc3e25404bf7334d1751e28570666c81619ad9adf7c5590');
const formatSource=readFileSync('../business-design/alder/json-structure-review.json');
assert.equal(hash(formatSource),'feaadc66c694764fe1e22d2c7b38441b4e284113513cf5ccd94fef570d35a70c');
const formatModel=JSON.parse(formatSource).documents.find(d=>d.kind==='conceptModel'),formatGraph=structureGraph(formatModel);
assert.equal(formatGraph.packageRoot,'fmt-package');assert.deepEqual(formatGraph.roots,['fmt-package']);
assert.equal(formatGraph.nodes.size,24);assert.equal(formatGraph.reachable.size,24);assert.equal(formatModel.relations.length,39);
const model=JSON.parse(source).documents.find(d=>d.kind==='conceptModel'),before=JSON.stringify(model),graph=structureGraph(model);
assert.equal(graph.packageRoot,undefined);assert.deepEqual(graph.roots,['n-bd','n-external','n-checkdoc']);
assert.equal(graph.nodes.size,25);assert.equal(graph.reachable.size,25);assert.equal(model.relations.length,54);
for(const relation of model.relations){
 const forward=graph.edges.get(relation.fromConceptId).find(x=>x.relation.id===relation.id&&x.to===relation.toConceptId);
 const reverse=graph.edges.get(relation.toConceptId).find(x=>x.relation.id===relation.id&&x.to===relation.fromConceptId);
 assert(forward&&reverse,relation.id+' is accessible in both directions');
 assert.equal(forward.count,relation.toLabel);assert.equal(forward.reverseCount,relation.fromLabel);
 assert.equal(reverse.count,relation.fromLabel);assert.equal(reverse.reverseCount,relation.toLabel);
 assert.equal(forward.direction,relation.kind==='reference'?'reference':'owned');
 assert.equal(reverse.direction,relation.kind==='reference'?'referencedBy':'owner');
}
const who=graph.edges.get('n-activity').find(e=>e.relation.id==='nr-who-activity');
assert.deepEqual([who.direction,who.count,who.reverseCount,who.fields],['reference','0..1','0..N',['activities.whoId']]);
const parent=graph.edges.get('n-activity').find(e=>e.relation.id==='nr-bd-activity');
assert.deepEqual([parent.direction,parent.count,parent.reverseCount],['owner','1','1..N']);
assert.equal(JSON.stringify(model),before,'the displayed model stays unchanged');covered.add('STRUCTURE-004');

const missing=structuredClone(formatModel);missing.meta.fieldMappings=[];assert.equal(structureGraph(missing).packageRoot,undefined,'names and IDs do not establish a package root');
const duplicate=structuredClone(formatModel);duplicate.meta.fieldMappings.push({informationId:'fmt-package-field-1',physicalName:'other',relationIds:[]});assert.equal(structureGraph(duplicate).packageRoot,undefined,'conflicting mappings are not guessed');
const ambiguous=structuredClone(formatModel),originalPackage=ambiguous.concepts.find(c=>c.id==='fmt-package');
const alternate=structuredClone(originalPackage);alternate.id='alternate-package';alternate.information=alternate.information.map(info=>({...info,id:info.id+'-alt'}));ambiguous.concepts.push(alternate);
const originalFields=ambiguous.meta.fieldMappings.filter(field=>originalPackage.information.some(info=>info.id===field.informationId));
ambiguous.meta.fieldMappings.push(...originalFields.map(field=>({...field,informationId:field.informationId+'-alt',relationIds:field.physicalName==='documents[]'?['alternate-bd']:field.relationIds})));
ambiguous.relations.push({...structuredClone(ambiguous.relations.find(r=>r.id==='rel-package-bd')),id:'alternate-bd',fromConceptId:'alternate-package'});
assert.equal(structureGraph(ambiguous).packageRoot,undefined,'multiple package candidates are not guessed');covered.add('STRUCTURE-001');

const concept=(id,name,fields=[])=>({id,name,subsystemId:'test',information:fields.map(([key,label])=>({id:key,name:label})),reason:'',description:'',businessObjectIds:[],activityLinks:[],sourceRefs:[],reviewState:'未レビュー'});
const rel=(id,from,to,fromLabel,toLabel,kind)=>({id,fromConceptId:from,toConceptId:to,fromPerTarget:fromLabel,toPerSource:toLabel,condition:id,reviewState:'未レビュー',sourceRefs:[],fromLabel,toLabel,kind});
const sample={...structuredClone(model),concepts:[concept('a','Activity',[['a-id','識別子']]),concept('one','単一の子',[['one-id','値']]),concept('nested','さらに下'),concept('many','複数の子'),concept('who','共有主体')],
 relations:[rel('one','a','one','1','0..1','down'),rel('nested','one','nested','1','1','down'),rel('many','a','many','1','1..N','down'),rel('who','a','who','0..N','0..1','reference'),rel('shared','one','who','0..N','1','reference'),rel('loop','who','a','0..N','0..1','reference'),rel('self','many','many','0..N','0..1','reference'),rel('unknown','a','nested','?','?','other')],
 meta:{fieldMappings:[{informationId:'a-id',physicalName:'activities.id',relationIds:[]},{informationId:'one-id',physicalName:'single.value',relationIds:[],valueType:'array',nullable:true}]}};
const sg=structureGraph(sample);
assert.deepEqual(sg.edges.get('a').map(e=>[e.relation.id,e.direction,e.count,e.reverseCount]),[['one','owned','0..1','1'],['many','owned','1..N','1'],['who','reference','0..1','0..N'],['loop','referencedBy','0..N','0..1'],['unknown','unknownOut','?','?']]);
assert.equal(sg.edges.get('one').find(e=>e.relation.id==='one').direction,'owner');
assert.equal(sg.edges.get('who').find(e=>e.relation.id==='shared').direction,'referencedBy');covered.add('STRUCTURE-002');

const code=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const w=new JSDOM('<div id="host"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
try{
 w.eval(code+';globalThis.Explorer=Explorer;');const host=w.document.getElementById('host');w.Explorer.renderStructureExplorer(host,sample);
 const groups=node=>[...node.querySelectorAll(':scope > .structure-children > li > details.structure-group > summary')].map(summary=>summary.textContent);
 assert.deepEqual(groups(host.querySelector('.structure-node')),['属性（1）','所有（2）','参照（1）','参照元（1）','種類未定義（出）（1）'],'folder counts show direct entries and directions');
 assert(!host.querySelector('.structure-heading, .structure-intro, .structure-help'),'the tab already supplies the title and the tree uses the full content area');
 const one=host.querySelector('[data-relation-id="one"][data-relation-direction="owned"] > details'),many=host.querySelector('[data-relation-id="many"][data-relation-direction="owned"] > details');
 assert(one&&!one.open&&many&&!many.open);
 assert.equal(one.querySelector(':scope > summary .structure-condition').textContent,'one','relationship description is shown before expanding');
 one.open=true;one.dispatchEvent(new w.Event('toggle'));
 assert.equal(one.querySelectorAll(':scope > p.structure-condition').length,0,'expansion does not duplicate the description');
 assert.deepEqual(groups(one),['属性（1）','所有（1）','所有先（1）','参照（1）'],'nested counts include the owner without reversing its meaning');
 assert.equal(many.open,false,'one branch does not expand another');
 assert(one.querySelector('[data-relation-id="nested"][data-relation-direction="owned"]'),'single-valued ownership exposes its child');
 assert(one.textContent.includes('single.value')&&one.textContent.includes('array・未決可'),'explicit field mapping and type stay visible');
 assert(host.textContent.includes('activities.id')&&host.textContent.includes('未定義'),'missing attribute types are not invented');
 many.open=true;many.dispatchEvent(new w.Event('toggle'));assert(many.querySelector('[data-relation-id="self"] .structure-seen'),'self reference is marked and terminates');
 one.open=false;assert.equal(many.open,true,'collapsing one node preserves the other node');
 const shared=one.querySelector('[data-relation-id="shared"] > details');assert(shared,'shared reference is offered in each independent path');
 host.querySelector('.structure-toolbar button').click();assert(host.querySelectorAll('.structure-item').length<=sample.relations.length*2+sg.roots.length,'expand all visits every concept once and stops');
 assert(host.querySelector('.structure-seen'),'cycles or shared instances are identified');
 host.querySelectorAll('.structure-toolbar button')[1].click();assert([...host.querySelectorAll('.structure-root > .structure-item > details')].every(d=>!d.open),'collapse all closes every root');covered.add('STRUCTURE-003');
 w.Explorer.renderStructureExplorer(host,model);
 assert.match(host.textContent,/JSON全体のルートをこの構造モデルから一意に特定できません/);
 assert.deepEqual([...host.querySelectorAll('.structure-root > .structure-item')].map(el=>el.dataset.conceptId),['n-bd','n-external','n-checkdoc']);
 assert.deepEqual(groups(host.querySelector('.structure-node')),['属性（3）','所有（6）','参照元（1）']);
 const activity=host.querySelector('[data-relation-id="nr-bd-activity"][data-relation-direction="owned"] > details');
 assert(activity&&!activity.open,'Activity is below Business Design');activity.open=true;activity.dispatchEvent(new w.Event('toggle'));
 assert.deepEqual(groups(activity),['属性（6）','所有（5）','所有先（1）','参照（1）','参照元（3）'],'parallel references count as separate relationships');
 const step=host.querySelector('[data-relation-id="nr-activity-step"][data-relation-direction="owned"] > details');
 const stepRow=step.querySelector(':scope > summary');assert.equal(step.open,false);
 assert.match(stepRow.textContent,/1\.\.N.*手順行（Step）.*業務内の順序付き手順。/,'description follows the name on the collapsed row');
 assert(!stepRow.textContent.includes('n-step')&&!stepRow.textContent.includes('逆 1'),'internal ID and reverse count are not displayed in the row');
 assert.match(stepRow.title,/移動先 1\.\.N／反対側 1/,'both defined multiplicities remain available');
 const parallel=[...host.querySelectorAll('[data-concept-id="n-relation"][data-relation-direction="referencedBy"] > details > summary')].map(row=>row.textContent);
 assert(parallel.some(value=>value.includes('fromIdがActivityを指す関係の場合。'))&&parallel.some(value=>value.includes('toIdがActivityを指す関係の場合。')),'parallel relationships stay distinguishable before expanding');
 host.querySelector('.structure-toolbar button').click();
 const concepts=new Set([...host.querySelectorAll('[data-concept-id]')].map(el=>el.dataset.conceptId));
 const relations=new Set([...host.querySelectorAll('[data-relation-id]')].map(el=>el.dataset.relationId));
 assert.deepEqual([...concepts].sort(),model.concepts.map(c=>c.id).sort());assert.deepEqual([...relations].sort(),model.relations.map(r=>r.id).sort());
 assert(host.querySelectorAll('.structure-item').length<=model.relations.length*2+graph.roots.length,'complete expansion is bounded');
 const search=host.querySelector('input[type=search]');search.value='手順行';search.dispatchEvent(new w.Event('input'));
 assert([...host.querySelectorAll('[data-concept-id="n-step"]')].some(el=>!el.hidden),'search retains matching structure');
 search.value='';search.dispatchEvent(new w.Event('input'));assert(host.querySelector('[data-concept-id="n-activity"]'),'clearing search restores the tree');
 const disconnected=structuredClone(formatModel);disconnected.concepts.push(concept('isolated','未接続'));w.Explorer.renderStructureExplorer(host,disconnected);
 assert.match(host.textContent,/この起点からたどれない構造：1件/,'the missing-structure notice remains available without the side panel');
 w.Explorer.renderStructureExplorer(host,missing);assert.match(host.textContent,/JSON全体のルートをこの構造モデルから一意に特定できません/);
 w.Explorer.renderStructureExplorer(host,formatModel);
 assert.equal(host.querySelector('.structure-root > .structure-item').dataset.conceptId,'fmt-package','the 0.7 package is the actual starting point');
 assert(!host.textContent.includes('JSON全体のルートをこの構造モデルから一意に特定できません'));
 assert(host.textContent.includes('format')&&host.textContent.includes('documents[]'));
 const bd=host.querySelector('[data-relation-id="rel-package-bd"][data-relation-direction="owned"] > details');assert(bd&&!bd.open);
 bd.open=true;bd.dispatchEvent(new w.Event('toggle'));assert(bd.querySelector('[data-relation-id="rel-bd-activity"]'),'package can be followed through Business Design to Activity');
 host.querySelector('.structure-toolbar button').click();
 assert.equal(new Set([...host.querySelectorAll('[data-concept-id]')].map(el=>el.dataset.conceptId)).size,24);
 assert.equal(new Set([...host.querySelectorAll('[data-relation-id]')].map(el=>el.dataset.relationId)).size,39);
 assert(host.querySelectorAll('.structure-item').length<=formatModel.relations.length*2+1,'package expansion terminates despite references');
 const cycle={...structuredClone(sample),concepts:[concept('x','X'),concept('y','Y')],relations:[rel('xy','x','y','1','1','down'),rel('yx','y','x','1','1','down')],meta:{fieldMappings:[]}};
 w.Explorer.renderStructureExplorer(host,cycle);assert.match(host.textContent,/所有関係の起点を特定できない/);host.querySelector('.structure-toolbar button').click();
 assert(host.querySelectorAll('.structure-item').length<=cycle.relations.length*2+2,'a cycle without ownership roots does not expand forever');
 w.Explorer.renderStructureExplorer(host,{...structuredClone(sample),concepts:[],relations:[]});assert.match(host.textContent,/概念がありません/);
}finally{w.close();}
coverage([...covered]);for(const path of Object.keys(authorities))verifyAuthority(path,readFileSync(path));assert.equal(hash(readFileSync('../business-design/alder/json-normalized-model-review.json')),hash(source));assert.equal(hash(readFileSync('../business-design/alder/json-structure-review.json')),hash(formatSource));
console.log('STRUCTURE-001..004: explicit root, full relation coverage, ownership/reference directions, recursion, cycles and independent authorities verified.');
