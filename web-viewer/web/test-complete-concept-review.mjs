import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {registerHooks} from 'node:module';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {schema} from '../../tools/document_storage/schema.mjs';
import {validate} from '../../tools/document_storage/core.mjs';
import {normalizePackage,restorePackage} from '../../work/normalization-candidate/normalize.mjs';
import {structureGraph} from '../src/structure-explorer.ts';
const hash=b=>createHash('sha256').update(b).digest('hex');
const required={
 '../work/normalization-candidate/complete-review-acceptance.json':'074aa8cc645368d73846fbc25abb96f5f6eee047132e19d42df26269b8dbf0f8',
 '../work/normalization-candidate/complete-review-identity-checks.json':'52206635d478c99ea4f8bc2a258ca48d75de50116f0b9eb186a74bfa1e7d63a7',
 '../business-design/alder/json-normalized-model-review.json':'708023cc112e137f66d295213b50dd8c67e52737b3e0fdd02ca0718aef93ab36',
 '../work/normalization-candidate/example-source.json':'fa94aa2098a3a4578648c2403f184bb73bb65e2e40311442f9e7d848743d0b8f',
 '../work/normalization-candidate/example-normalized.json':'cfb0ee8dd1dd7b0aa99e868abc3844542c3c6881cc7c8315fb8f3a5a6566152a',
 '../tools/document_storage/schema.mjs':'e46e388660df746173e16e8c72b56e9a9a74f6fcd6935f5bff304737961dddb2'
};
const verifyHash=(bytes,digest)=>assert.equal(hash(bytes),digest,'frozen source changed');
for(const [path,digest] of Object.entries(required))verifyHash(readFileSync(path),digest);
assert.throws(()=>verifyHash(Buffer.from('{}'),required['../work/normalization-candidate/complete-review-acceptance.json']));
const read=path=>JSON.parse(readFileSync(path,'utf8'));
const ids=[...read('../work/normalization-candidate/complete-review-acceptance.json').checks,...read('../work/normalization-candidate/complete-review-identity-checks.json').checks].map(c=>c.id);
assert.deepEqual(ids,['COMPLETE-01','COMPLETE-02','COMPLETE-03','COMPLETE-04','LOGICAL-01','LOGICAL-02','LOGICAL-03']);
const covered=[],coverage=actual=>assert.deepEqual(actual.slice().sort(),ids.slice().sort(),'every requirement must be checked exactly once');
assert.throws(()=>coverage(ids.slice(1)));assert.throws(()=>coverage([...ids,ids[0]]));
const previous=read('../business-design/alder/json-normalized-model-review.json'),current=read('../business-design/alder/json-complete-concept-review.json'),source=read('../work/normalization-candidate/example-source.json');
const old=previous.documents.find(d=>d.kind==='conceptModel'),model=current.documents.find(d=>d.kind==='conceptModel');
validate(current);assert.deepEqual(current.documents.filter(d=>d.kind!=='conceptModel'),previous.documents.filter(d=>d.kind!=='conceptModel'),'BD and Check remain unchanged');
registerHooks({resolve(s,c,n){if((s.startsWith('./')||s.startsWith('../'))&&!/\.[a-z0-9]+$/i.test(s)){try{return n(s+'.ts',c);}catch{}try{return n(s+'.js',c);}catch{}}return n(s,c);}});
const {parseDocument}=await import('../src/document-input.ts');
const parsed=parseDocument(JSON.stringify(current));assert.equal(parsed.model.concepts[0].id,model.id);assert.equal(parsed.model.concepts[0].concepts.length,model.concepts.length);
const graph=structureGraph(model),relation=id=>model.relations.find(r=>r.id===id),mapping=id=>model.meta.fieldMappings.find(x=>x.informationId===id);
assert.equal(graph.packageRoot,'n-package');assert.deepEqual(graph.roots,['n-package']);assert.equal(graph.reachable.size,model.concepts.length);
for(const id of ['nr-package-bd','nr-package-checkdoc','nr-package-state-doc','nr-package-concept-doc']){const r=relation(id);assert(r&&r.fromConceptId==='n-package'&&r.kind==='down'&&r.toLabel==='0..N',id);}
assert(model.meta.fieldMappings.some(x=>x.physicalName==='documents[]'&&x.relationIds.length===4));
const sourceField=model.meta.schemaCoverage.find(x=>x.path==='Package.sources[].documentId');assert.equal(sourceField.relationIds.length,5);
for(const path of ['Check.index[].activityId','Check.sections[].activityId']){
 const refs=model.meta.schemaCoverage.find(x=>x.path===path).relationIds.map(relation);
 assert.equal(refs.length,2);assert(refs.some(r=>r.toConceptId==='n-activity'));assert(refs.some(r=>model.meta.conceptNames[r.toConceptId].typeName==='ExternalActivity'));assert(refs.every(r=>r.toLabel==='0..1'));
}
const richRefs=model.meta.schemaCoverage.find(x=>x.path==='Check.intro[].targetId').relationIds.map(relation);assert.equal(richRefs.length,8);assert(richRefs.some(r=>r.toConceptId==='n-row'));assert(richRefs.some(r=>r.toConceptId==='n-exception'));
assert.equal(model.meta.schemaCoverage.find(x=>x.path==='Concept.concepts[].sourceRefs[].documentId').relationIds.length,2);
const objectRef=model.meta.schemaCoverage.find(x=>x.path==='State.objectId'),objectEdge=relation(objectRef.relationId);assert.deepEqual([objectEdge.fromLabel,objectEdge.toLabel],['0..1','1']);
assert.deepEqual([relation('nr-concept-basedon').fromLabel,relation('nr-concept-basedon').toLabel],['0..1','1']);
const stateList=model.meta.schemaCoverage.find(x=>x.path==='State.states');assert.equal(relation(stateList.relationId).toLabel,'1..N');covered.push('COMPLETE-01');

// Independently enumerate the package, BD, Check, State and both Concept
// document versions. Reused types require explicit path aliases.
const package07=schema.anyOf.find(x=>x.properties?.formatVersion?.enum?.[0]==='0.7');
const roots={Package:package07,BD:schema.$defs.decisionBusinessDesign,Check:schema.$defs.checkItems,State:schema.$defs.stateTransitionStructured,Concept:schema.$defs.conceptModel,ConceptChecked:schema.$defs.checkedConceptModel},paths=new Set();
function resolve(s){return s?.$ref?schema.$defs[s.$ref.split('/').at(-1)]:s;}
function walk(path,raw){const s=resolve(raw);if(s?.type==='array')return walk(path+'[]',s.items);if(s?.anyOf){for(const variant of s.anyOf)walk(path,variant);return;}if(s?.type!=='object'||!s.properties)return;for(const [key,value] of Object.entries(s.properties)){const name=path+'.'+key;paths.add(name);if(name!=='Package.documents')walk(name,value);}}
for(const [key,value] of Object.entries(roots))walk(key==='ConceptChecked'?'Concept':key,value);
const recorded=new Map();for(const entry of model.meta.schemaCoverage){assert(!recorded.has(entry.path),'duplicate coverage '+entry.path);recorded.set(entry.path,entry);}
const aliases=[...model.meta.schemaAliases].sort((a,b)=>b.from.length-a.from.length),canonical=path=>{for(const a of aliases)if(path.startsWith(a.from+'.'))return a.to+path.slice(a.from.length);return path;};
const missingPaths=entries=>[...paths].filter(path=>!entries.has(path)&&!entries.has(canonical(path)));
assert.deepEqual(missingPaths(recorded),[],'all declared properties must have a conceptual mapping');
const incomplete=new Map(recorded);incomplete.delete('State.transitions[].event');assert(missingPaths(incomplete).includes('State.transitions[].event'),'missing applicability cannot pass the coverage check');
for(const entry of recorded.values()){
 if(entry.conceptId)assert(graph.nodes.has(entry.conceptId),entry.path+' owner');
 if(entry.informationId)assert(mapping(entry.informationId),entry.path+' field');
 if(entry.stateInformationId)assert(mapping(entry.stateInformationId),entry.path+' logical state');
 if(entry.orderInformationId)assert(mapping(entry.orderInformationId),entry.path+' order');
 for(const id of [...(entry.relationIds??[]),...(entry.relationId?[entry.relationId]:[])])assert(relation(id),entry.path+' relation');
}
for(const p of ['BD.objects[].information[].description','BD.activities[].where','BD.activities[].procedure.steps[].obligation','BD.activities[].procedure.steps[].appliesWhen','BD.activities[].procedure.steps[].effect','State.transitions[].exceptionId','Check.items[].fields.expectedResult','Concept.reviewGroups[].capabilities[].samples[].checkIds'])assert(recorded.has(p)||recorded.has(canonical(p)),p);
const versioned=relation(recorded.get('Concept.reviewGroups[].capabilities[].samples[].checkIds').relationId);assert.equal(versioned.toLabel,'0..N');assert.match(versioned.condition,/0\.2.*1件以上.*0\.1/);
assert.equal(recorded.get('Concept.reviewGroups[].capabilities[].testSpecification').representation,'flattened');covered.push('COMPLETE-02');

const movedFlowFields=new Set(['n-step-field-2','n-step-field-6']);
for(const c of old.concepts){const after=graph.nodes.get(c.id);assert(after,c.id);if(!['n-order','n-continuity'].includes(c.id))assert.deepEqual(model.meta.conceptNames[c.id],old.meta.conceptNames[c.id],c.id+' name');for(const f of c.information){const owner=c.id==='n-step'&&movedFlowFields.has(f.id)?graph.nodes.get('n-flow-step'):after;assert.deepEqual(owner.information.find(x=>x.id===f.id),f,c.id+' field');}}
for(const r of old.relations){const next=relation(r.id);assert(next,r.id);for(const key of ['fromConceptId','toConceptId','kind','fromLabel','toLabel','reviewState']){if(r.id==='nr-activity-step'&&['toConceptId','fromLabel'].includes(key))continue;if(r.id==='nr-step-when'&&key==='fromConceptId')continue;assert.equal(next[key],r[key],r.id+' '+key);}}
assert.deepEqual([relation('nr-activity-step').toConceptId,relation('nr-activity-step').fromLabel],['n-flow-step','0..1']);assert.equal(relation('nr-step-when').fromConceptId,'n-flow-step');
assert.equal(model.meta.conceptNames['n-order'].logicalName,'順序制約');covered.push('COMPLETE-03');

const actual=source.documents.find(d=>d.kind==='checkItems');
const values=model.meta.fieldMappings.filter(x=>x.sourceSchemaPath?.startsWith('Check.')&&Object.hasOwn(x,'sampleValue'));
const findValues=(root,path)=>{let current=[root];for(const part of path.split('.')){const key=part.replace(/\[\]/g,''),n=(part.match(/\[\]/g)||[]).length;current=current.flatMap(x=>x!=null&&typeof x==='object'&&Object.hasOwn(x,key)?[x[key]]:[]);for(let i=0;i<n;i++)current=current.flatMap(x=>Array.isArray(x)?x:[]);}return current;};
assert(values.length>5);for(const item of values){const candidates=findValues(actual,item.sourceSchemaPath.slice(6));assert(candidates.some(value=>JSON.stringify(value)===JSON.stringify(item.sampleValue)),item.sourceSchemaPath+' sample');}
for(const item of model.meta.fieldMappings.filter(x=>x.sourceSchemaPath?.startsWith('Concept.')&&Object.hasOwn(x,'sampleValue')))assert.equal(item.sampleKind,'reference');
const reference=model.meta.fieldMappings.find(x=>x.sourceSchemaPath==='State.states[].name');assert.equal(reference.referenceValue,'受付済');assert(!Object.hasOwn(reference,'sampleValue'));covered.push('COMPLETE-04');

for(const path of ['Check.items[].fields','Concept.reviewGroups[].reviewer','Concept.reviewGroups[].graph','Concept.reviewGroups[].graph.subsystemViews','Concept.reviewGroups[].capabilities[].testSpecification','Concept.reviewGroups[].meta','Concept.presentation','Concept.presentation.subsystemViews'])assert.equal(recorded.get(path).representation,'flattened',path);
for(const path of ['Concept.reviewGroups[].graph.subsystemViews','Concept.reviewGroups[].capabilities[].testSpecification','Concept.presentation.subsystemViews'])assert(mapping(recorded.get(path).stateInformationId),'optional flattened property retains presence: '+path);
const oneToOneOwned=model.relations.filter(r=>r.kind==='down'&&['1','0..1'].includes(r.toLabel)).map(r=>r.id).sort();assert.deepEqual(oneToOneOwned,['nr-exception-continuity','nr-step-exchange']);
assert.match(relation('nr-step-exchange').condition,/受渡しがある手順/);assert.match(graph.nodes.get('n-continuity').description,/中断する例外で必要/);assert.equal(model.meta.conceptNames['n-continuity'].logicalName,'中断・再開の扱い');covered.push('LOGICAL-01');

const example=structuredClone(source),bd=example.documents.find(d=>d.kind==='businessDesign'),informationId='logical-test-phone';
bd.objects[0].information.push({id:informationId,name:'電話番号',description:'連絡先の電話番号'});
bd.data.push({id:'logical-group-contact',name:'連絡先',items:[{informationId,condition:null}]},{id:'logical-group-request',name:'申込情報',items:[{informationId,condition:'電話連絡を希望する場合'}]});
validate(example);const projected=normalizePackage(example,{'bd-score-example/calculate-score':{id:'score-system',evidence:'公開サンプルのシステムを識別する検討例'}});
const first=projected.entities.dataItems.find(x=>x.dataId==='logical-group-contact'),second=projected.entities.dataItems.find(x=>x.dataId==='logical-group-request');
assert.equal(first.informationId,second.informationId);assert.equal(first.condition,null);assert.equal(second.condition,'電話連絡を希望する場合');
assert.equal(projected.entities.information.filter(x=>x.id===informationId).length,1);assert.deepEqual(restorePackage(projected),example);assert.match(relation('nr-data-dataitem').condition,/グループごとに含める条件/);covered.push('LOGICAL-02');

for(const p of ['BD.activities[].procedure.steps[].whatDataIds','BD.activities[].procedure.steps[].exchange.dataIds','BD.activities[].procedure.steps[].dependsOn','BD.exceptions[].continuity.retainedDataIds']){const state=mapping(recorded.get(p).stateInformationId);assert.equal(state.valueType,'string（未決／なし／あり）',p);assert.equal(state.physicalName,'',p+' conceptual status');if(Object.hasOwn(state,'sampleValue'))assert(['未決','なし','あり'].includes(state.sampleValue));}
assert.equal(mapping(recorded.get('BD.activities[].procedure.steps[].whatDataIds').stateInformationId).sampleValue,'あり');
assert.equal(mapping(recorded.get('BD.activities[].procedure.steps[].dependsOn').stateInformationId).sampleValue,'未決');
const stepOrder=mapping(recorded.get('BD.activities[].procedure.steps').orderInformationId);assert.equal(stepOrder.valueType,'number');assert.equal(stepOrder.sampleValue,1);assert.equal(stepOrder.physicalName,'');
for(const [p,parts] of [['State.transitions[].fromId',['新規','既存']],['State.transitions[].toId',['状態','作成なし','未決']]]){const state=mapping(recorded.get(p).stateInformationId);for(const part of parts)assert(state.valueType.includes(part),p+' '+part);}
assert.match(relation('nr-step-party').condition,/未記録.*存在しない/);covered.push('LOGICAL-03');

const code=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const w=new JSDOM('<div id="host"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
try{
 w.eval(code+';globalThis.Explorer=Explorer;');const host=w.document.getElementById('host'),detail=w.document.createElement('div');w.Explorer.renderStructureExplorer(host,model,{select:selection=>w.Explorer.renderStructureDetails(detail,model,selection)});
 const root=host.querySelector('.structure-root > [data-concept-id="n-package"] > details > summary');assert(root);assert.match(root.textContent,/文書パッケージ/);assert(!root.textContent.includes('DocumentPackage'));
 for(const id of ['nr-package-bd','nr-package-checkdoc','nr-package-state-doc','nr-package-concept-doc'])assert(host.querySelector(`[data-relation-id="${id}"]`),id);
 assert(!host.textContent.includes('この起点からたどれない構造'));
 [...host.querySelectorAll('button')].find(x=>x.textContent==='すべて展開').click();
 assert(host.textContent.includes('情報項目グループ'));assert(host.textContent.includes('状態遷移文書'));const owner=model.concepts.find(c=>c.information.some(i=>i.id===reference.informationId));assert(owner);const ownerRow=host.querySelector(`[data-concept-id="${owner.id}"] > details > summary`);assert(ownerRow);ownerRow.click();const sampleField=detail.querySelector(`[data-information-id="${reference.informationId}"] button`);assert(sampleField);sampleField.click();assert(detail.textContent.includes('受付済'));
 assert(host.querySelectorAll('.structure-item').length<model.relations.length+model.concepts.length+10,'expand all terminates');
}finally{w.close();}
coverage(covered);for(const [path,digest] of Object.entries(required))assert.equal(hash(readFileSync(path)),digest,path+' changed after verification');
console.log(JSON.stringify({checks:covered,concepts:model.concepts.length,relations:model.relations.length,sourceSchemaPaths:paths.size,reachable:graph.reachable.size}));
