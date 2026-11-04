import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {registerHooks} from 'node:module';
import {schema} from '../../tools/document_storage/schema.mjs';
import {validate} from '../../tools/document_storage/core.mjs';
import {guardAuthoring} from '../../tools/document_storage/authoring.mjs';

registerHooks({resolve(spec,context,next){if((spec.startsWith('./')||spec.startsWith('../'))&&!/\.[a-z0-9]+$/i.test(spec)){try{return next(spec+'.ts',context)}catch{}try{return next(spec+'.js',context)}catch{}}return next(spec,context)}});
const {parseDocument}=await import('../src/document-input.ts');
const {createConceptViews}=await import('../src/concept-views.ts');
const read=path=>readFileSync(path,'utf8');
const authority=read('verification/alder-json-structure-review.check-items.json');
assert.equal(createHash('sha256').update(authority).digest('hex'),'2d926c0ecca26e43b90049eb423e29acb460dff986fbadc40548984582238d18');
assert.deepEqual(JSON.parse(authority).checks.map(value=>value.id),['JSON-STRUCT-001','JSON-STRUCT-002','JSON-STRUCT-003','JSON-STRUCT-004']);
const original=JSON.parse(read('../business-design/alder/business-design.json'));
const pkg=JSON.parse(read('../business-design/alder/json-structure-review.json')),model=pkg.documents.find(value=>value.kind==='conceptModel');
assert.equal(pkg.formatVersion,'0.4');assert.equal(model.schemaVersion,'0.2');assert.equal(model.meta.sourceFormatVersion,'0.7');
assert.equal(model.meta.sourceCommit,'14e59596bf07cc42b6dac43dc0c426b06f546a34');
const restored=structuredClone(pkg);restored.documents=restored.documents.filter(value=>value.kind!=='conceptModel');restored.revision=original.revision;
assert.deepEqual(restored,original,'the original BD, IDs, Check states and metadata remain unchanged');
assert.doesNotThrow(()=>validate(pkg));
assert.equal(guardAuthoring(original,pkg,{expectedRevision:original.revision}).approval,'not-evaluated');

// Check independently against the executable 0.7 shape, including nested
// records that have no ID of their own and nullable/optional fields.
const bd=schema.$defs.decisionBusinessDesign.properties,activity=bd.activities.items.properties,procedure=activity.procedure.properties,step=procedure.steps.items;
assert.equal(bd.activities.minItems,1);assert.equal(activity.results.minItems,1);assert.equal(procedure.steps.minItems,1);
assert.equal(step.required.includes('dependsOn'),false);assert.ok(step.properties.dependsOn.anyOf.some(value=>value.type==='null'));
const dependency=step.properties.dependsOn.anyOf.find(value=>value.type==='array').items;
assert.deepEqual(dependency.required,['stepId','whenDecision']);assert.equal(Object.hasOwn(dependency.properties,'id'),false);
const interaction=step.properties.exchange.anyOf.find(value=>value.properties?.kind?.enum?.includes('interaction'));
assert.ok(interaction.required.includes('pairedStepId'));assert.ok(interaction.properties.pairedStepId.anyOf.some(value=>value.type==='null'));
assert.deepEqual(interaction.properties.direction.enum,['input','output']);assert.deepEqual(interaction.properties.phase.anyOf[0].enum,['request','response','not-applicable']);
assert.equal(activity.decisions.items.properties.rows.minItems,1);assert.equal(activity.decisions.items.properties.axes.minItems,1);

const expected={
 'activity-procedure':['1','1'],'procedure-step':['1','1..N'],'step-dependency':['1','0..N'],'dependency-step':['0..N','1'],
 'step-exchange':['1','1'],'exchange-pair':['0..N','0..1'],'exchange-object':['0..N','0..1'],
 'step-data':['0..N','0..N'],'exchange-data':['0..N','0..N'],'data-dataitem':['1','1..N'],'dataitem-information':['0..N','1'],
 'activity-decision':['1','0..N'],'step-decision':['0..N','0..N'],'decision-row':['1','1..N'],
 'row-condition':['1','1..N'],'row-outcome':['1','1'],'row-checkref':['1','0..N'],'checkref-check':['0..N','1'],'checkdoc-check':['1','0..N']
};
for(const [id,labels] of Object.entries(expected)){
 const rel=model.relations.find(value=>value.id==='rel-'+id);assert.ok(rel,id);assert.deepEqual([rel.fromLabel,rel.toLabel],labels,id);
}
assert.match(model.concepts.find(value=>value.id==='fmt-exchange').description,/internalとunresolved/);
assert.match(model.relations.find(value=>value.id==='rel-exchange-pair').condition,/片方向可/);
const design=parseDocument(JSON.stringify(pkg)),views=createConceptViews({business:design.model.business,model:design.model.concepts[0]});
assert.equal(views.authoredOverviewGraph().ids.length,11,'the original authored projection is retained');
assert.equal(new Set(views.overviewGraph().ids.map(id=>views.overviewGraph().tables[id].conceptId??id)).size,model.concepts.length,'the overview includes every model concept');
assert.equal(views.groups.length,4);
for(const id of ['group-steps','group-exchange','group-data','group-decisions'])assert.ok(views.graph(id).ids.length>=5,id);
console.log('JSON-STRUCT-002/003: fixed schema, multiplicities, original documents and existing Viewer projections verified.');
