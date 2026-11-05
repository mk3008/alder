import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {structureGraph} from '../src/structure-explorer.ts';

const hash=value=>createHash('sha256').update(value).digest('hex');
const authorities={
 'verification/structure-explorer.check-items.json':'a9f91ace9c954458a12999026b6cf60054f8365a4e8c915614fb33631898c60d',
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
const model=JSON.parse(source).documents.find(d=>d.kind==='conceptModel'),before=JSON.stringify(model),graph=structureGraph(model);
assert.equal(graph.root,'n-activity');assert.equal(graph.nodes.size,25);assert.equal(graph.reachable.size,25);assert.equal(model.relations.length,54);
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

const missing=structuredClone(model);missing.meta.fieldMappings=[];assert.equal(structureGraph(missing).root,undefined,'names and IDs do not identify Activity');
const ambiguous=structuredClone(model);ambiguous.meta.fieldMappings.push({informationId:'n-who-field-1',physicalName:'activities.id',relationIds:[]});assert.equal(structureGraph(ambiguous).root,undefined,'ambiguous explicit mappings are not guessed');covered.add('STRUCTURE-001');
const duplicate=structuredClone(model);duplicate.meta.fieldMappings.push({informationId:'n-activity-field-1',physicalName:'other.id',relationIds:[]});assert.equal(structureGraph(duplicate).root,undefined,'conflicting mappings for one field are not guessed');

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
 assert(one&&!one.open&&many&&!many.open);one.open=true;one.dispatchEvent(new w.Event('toggle'));
 assert.deepEqual(groups(one),['属性（1）','所有（1）','所有先（1）','参照（1）'],'nested counts include the owner without reversing its meaning');
 assert.equal(many.open,false,'one branch does not expand another');
 assert(one.querySelector('[data-relation-id="nested"][data-relation-direction="owned"]'),'single-valued ownership exposes its child');
 assert(one.textContent.includes('single.value')&&one.textContent.includes('array・未決可'),'explicit field mapping and type stay visible');
 assert(host.textContent.includes('activities.id')&&host.textContent.includes('未定義'),'missing attribute types are not invented');
 many.open=true;many.dispatchEvent(new w.Event('toggle'));assert(many.querySelector('[data-relation-id="self"] .structure-seen'),'self reference is marked and terminates');
 one.open=false;assert.equal(many.open,true,'collapsing one node preserves the other node');
 const shared=one.querySelector('[data-relation-id="shared"] > details');assert(shared,'shared reference is offered in each independent path');
 host.querySelector('.structure-toolbar button').click();assert(host.querySelectorAll('.structure-item').length<=sample.relations.length*2+1,'expand all visits every concept once and stops');
 assert(host.querySelector('.structure-seen'),'cycles or shared instances are identified');
 host.querySelectorAll('.structure-toolbar button')[1].click();assert.equal(host.querySelector('.structure-node').open,false,'collapse all closes the root');covered.add('STRUCTURE-003');
 w.Explorer.renderStructureExplorer(host,model);
 assert.deepEqual(groups(host.querySelector('.structure-node')),['属性（6）','所有（5）','所有先（1）','参照（1）','参照元（3）'],'parallel references count as separate relationships');
 host.querySelector('.structure-toolbar button').click();
 const concepts=new Set([...host.querySelectorAll('[data-concept-id]')].map(el=>el.dataset.conceptId));
 const relations=new Set([...host.querySelectorAll('[data-relation-id]')].map(el=>el.dataset.relationId));
 assert.deepEqual([...concepts].sort(),model.concepts.map(c=>c.id).sort());assert.deepEqual([...relations].sort(),model.relations.map(r=>r.id).sort());
 assert(host.querySelectorAll('.structure-item').length<=model.relations.length*2+1,'complete expansion is bounded');
 const search=host.querySelector('input[type=search]');search.value='手順行';search.dispatchEvent(new w.Event('input'));
 assert([...host.querySelectorAll('[data-concept-id="n-step"]')].some(el=>!el.hidden),'search retains matching structure');
 search.value='';search.dispatchEvent(new w.Event('input'));assert(host.querySelector('[data-concept-id="n-activity"]'),'clearing search restores the tree');
 const disconnected=structuredClone(sample);disconnected.concepts.push(concept('isolated','未接続'));w.Explorer.renderStructureExplorer(host,disconnected);
 assert.match(host.textContent,/この起点からたどれない構造：1件/,'the missing-structure notice remains available without the side panel');
 w.Explorer.renderStructureExplorer(host,missing);assert.match(host.textContent,/Activityの構造を一意に特定できません/);
}finally{w.close();}
coverage([...covered]);for(const path of Object.keys(authorities))verifyAuthority(path,readFileSync(path));assert.equal(hash(readFileSync('../business-design/alder/json-normalized-model-review.json')),hash(source));
console.log('STRUCTURE-001..004: explicit root, full relation coverage, ownership/reference directions, recursion, cycles and independent authorities verified.');
