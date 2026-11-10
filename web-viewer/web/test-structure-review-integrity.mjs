import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {reviewCandidatePackage,candidates,verifyReviewOrigin} from '../../work/361-review-display-cleanup/prepare-preview.mjs';
import {structureReviewCandidates,reviewDigest,reviewModelBytes,canonicalReviewJSON} from '../src/structure-review-candidates.ts';
const pkg=await reviewCandidatePackage(),model=pkg.documents.find(d=>d.kind==='conceptModel'),old=JSON.parse(readFileSync('../work/361-review-hypotheses/candidates.json')),baseline=JSON.parse(readFileSync('../work/361-review-display-cleanup/start-baseline.json'));
const results=[],pass=(name)=>results.push({case:name,status:'pass'}),clone=()=>structuredClone(model),validate=async m=>(await structureReviewCandidates(m)).code;
const visible=Object.fromEntries(candidates.fields.map(f=>[f.target.informationId,{...(f.purpose===undefined?{}:{purpose:f.purpose}),...(f.sample===undefined?{}:{sample:f.sample.value}),perspectives:f.perspectives}]));
assert.equal(candidates.fields.length,339);assert.equal(candidates.fields.filter(f=>f.purpose!==undefined).length,338);assert.equal(candidates.fields.filter(f=>f.sample!==undefined).length,207);
for(const [id,v] of Object.entries(visible)){const expected=old.fields[id];assert.deepEqual(v,{...(expected.purpose===undefined?{}:{purpose:expected.purpose}),...(Object.hasOwn(expected,'sample')?{sample:expected.sample}:{}),perspectives:expected.perspectives});assert.equal(createHash('sha256').update(canonicalReviewJSON(v)).digest('hex'),baseline.visibleContent.perIdSha256[id]);}pass('id-values-and-json-types');
const pain=candidates.fields.find(f=>f.target.informationId==='cf-423df2519d7898'),fragment=candidates.fields.find(f=>f.target.informationId==='cf-3907e6aa0081d2');
assert.deepEqual(pain.sample.when,[{target:{conceptId:'n-activity',informationId:'cf-79e1f59247290a'},predicate:'nonempty'}]);assert.equal(fragment.sample.coverage,'document-fragment');assert.equal(fragment.sample.value[0].kind,'businessDesign');pass('sample-conditions-and-fragment');
assert.equal(await validate(model),'valid');pass('real-package');
assert.throws(()=>verifyReviewOrigin(Buffer.from('changed source'),candidates.origin),/original source bytes/);pass('origin-bytes');
assert.equal(await reviewDigest(new TextEncoder().encode('abc')),'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');assert.equal(canonicalReviewJSON({z:[false,0,null],a:'x'}),'{"a":"x","z":[false,0,null]}');pass('independent-canonical-and-sha');
// Independent review reproduction: keep the bound model identical and mutate
// only the candidate for the real scalar-union field.
const unionId='cf-3756ccb9208e42',unionField=candidates.fields.find(f=>f.target.informationId===unionId);
assert.equal(model.meta.fieldMappings.find(m=>m.informationId===unionId).valueType,'string | number');assert.equal(unionField.sample.value,7);assert.equal(model.meta.fieldMappings.find(m=>m.informationId===unionId).nullable,false);assert.equal(model.meta.fieldMappings.find(m=>m.informationId===unionId).valueDomain.kind,'scalar');
for(const [name,value,expected] of [['number',7,'valid'],['string','7','valid'],['object',{unexpected:true},'sample-type'],['null',null,'sample-type'],['boolean',true,'sample-type'],['array',[7],'sample-type']]){
 const changed=clone();changed.meta.previewStructureReview.fields.find(f=>f.target.informationId===unionId).sample.value=value;
 assert.equal(await validate(changed),expected,'string | number: '+name);pass('scalar-union-'+name);
}
// Existing other authored unions retain every declared member. Changing their
// model declaration here explicitly rebinds the test fixture, never the catalog.
for(const [type,values] of [['string | number | boolean',['text',0,false]],['string | null',['text',null]],['boolean | null',[true,false,null]],['number',[0,7]]]){
 for(const value of values){const changed=clone();changed.meta.fieldMappings.find(m=>m.informationId===unionId).valueType=type;changed.meta.previewStructureReview.basedOn.modelSha256=await reviewDigest(reviewModelBytes(changed));changed.meta.previewStructureReview.fields.find(f=>f.target.informationId===unionId).sample.value=value;assert.equal(await validate(changed),'valid',type+': '+JSON.stringify(value));}
 pass('declared-members-'+type);
}
for(const [type,validValues,invalidValues] of [
 ['number',[0,7],[null,false,'7',{},[]]],
 ['string | null',['text',null],[false,0,{},[]]],
 ['boolean | null',[true,false,null],['true',0,{},[]]],
 ['string | number | boolean',['text',7,false],[null,{},[]]],
 ['string（未決／なし／あり）',['text'],[null,0,false,{},[]]],
 ['object（任意構造）',[{any:true}],[null,[],0,false,'text']],
 ['array',[[7]],[null,{},0,false,'text']],
 ['string[]',[['text']],[null,{},[7],false,'text']],
]){
 const changed=clone();changed.meta.fieldMappings.find(m=>m.informationId===unionId).valueType=type;changed.meta.previewStructureReview.basedOn.modelSha256=await reviewDigest(reviewModelBytes(changed));
 for(const value of validValues){changed.meta.previewStructureReview.fields.find(f=>f.target.informationId===unionId).sample.value=value;assert.equal(await validate(changed),'valid',type+' accepts '+JSON.stringify(value));}
 for(const value of invalidValues){changed.meta.previewStructureReview.fields.find(f=>f.target.informationId===unionId).sample.value=value;assert.equal(await validate(changed),'sample-type',type+' rejects '+JSON.stringify(value));}
 pass('existing-type-boundary-'+type);
}
assert.equal(model.meta.fieldMappings.filter(m=>m.valueType===undefined).length,32);assert.equal(await validate(model),'valid');pass('32-unspecified-preserved-without-inference');
const negatives=[
 ['wrong-model',m=>m.id+='x','wrong-model'],
 ['same-revision-edit',m=>m.concepts[0].description+='x','model-content-mismatch'],
 ['reorder',m=>m.meta.fieldMappings.reverse(),'model-content-mismatch'],
 ['rename',m=>m.concepts[0].information[0].name+='x','model-content-mismatch'],
 ['delete',m=>m.concepts[0].information.shift(),'missing-mapping-target'],
 ['duplicate-information',m=>m.concepts[0].information.push(m.concepts[0].information[0]),'duplicate-information'],
 ['duplicate-concept',m=>m.concepts.push(m.concepts[0]),'duplicate-concept'],
 ['duplicate-mapping',m=>m.meta.fieldMappings.push(m.meta.fieldMappings[0]),'duplicate-or-invalid-mapping'],
 ['duplicate-relation',m=>m.relations.push(m.relations[0]),'duplicate-relation'],
 ['changed-id',m=>m.concepts[0].information[0].id+='x','missing-mapping-target'],
 ['pointer-id',m=>m.meta.previewStructureReview.fields[0].source='/meta/fieldMappings/1','entry-shape'],
 ['missing-dependency',m=>m.relations.splice(m.relations.findIndex(r=>r.id==='nr-who-activity'),1),'missing-dependency'],
 ['missing-condition',m=>m.meta.previewStructureReview.fields.find(f=>f.sample?.when).sample.when[0].target.informationId='absent','missing-dependency'],
 ['extra-target',m=>m.meta.previewStructureReview.fields.push(m.meta.previewStructureReview.fields[0]),'duplicate-target'],
 ['missing-target',m=>m.meta.previewStructureReview.fields.pop(),'incomplete-targets'],
 ['unknown-key',m=>m.meta.previewStructureReview.reason='SENTINEL_REASON','catalog-shape'],
 ['legacy-input',m=>{m.meta.previewStructureReview=structuredClone(old);},'catalog-shape'],
 ['candidate-type',m=>m.meta.previewStructureReview.fields.find(f=>f.sample&&m.meta.fieldMappings.find(x=>x.informationId===f.target.informationId)?.valueType==='boolean').sample.value='true','sample-type'],
 ['fragment-type',m=>m.meta.previewStructureReview.fields.find(f=>f.sample?.coverage==='document-fragment').sample.value='not a document fragment','fragment-shape'],
];
for(const [name,change,expected] of negatives){const m=clone();change(m);assert.equal(await validate(m),expected,name);pass(name);}
const reordered=clone();reordered.meta.fieldMappings.reverse();reordered.meta.previewStructureReview.basedOn.modelSha256=await reviewDigest(reviewModelBytes(reordered));assert.equal(await validate(reordered),'valid');assert.deepEqual((await structureReviewCandidates(reordered)).projection.get('n-bd-field-1'),(await structureReviewCandidates(model)).projection.get('n-bd-field-1'));pass('explicit-rebind-stable-id');
assert.equal((await structureReviewCandidates(model,async()=>{throw Error('no crypto');})).code,'digest-unavailable');pass('crypto-failure');
const code=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const w=new JSDOM('<div id="detail"></div>',{url:'https://viewer.test',runScripts:'outside-only'}).window;
const queue=[];Object.defineProperty(w,'crypto',{value:{subtle:{digest:(algorithm,bytes)=>new Promise((resolve,reject)=>queue.push(()=>globalThis.crypto.subtle.digest(algorithm,bytes).then(resolve,reject)))}}});Object.defineProperty(w,'structuredClone',{value:structuredClone});w.eval(code+';globalThis.Explorer=Explorer;');
const root=w.document.querySelector('#detail'),selection={kind:'structure',conceptId:'n-package'},render=m=>w.Explorer.renderStructureDetails(root,m,selection),has=()=>!!root.querySelector('.structure-review-value');
const release=async index=>{await queue.splice(index,1)[0]();};
try{
 const first=render(clone()),bad=clone();bad.concepts[0].description+='changed';const second=render(bad);await release(1);await second;assert.equal(has(),false);await release(0);await first;assert.equal(has(),false);pass('late-success-after-replacement-failure');
 const stale=clone();stale.concepts[0].description+='old failure';const a=render(stale),b=render(clone());await release(1);await b;assert.equal(has(),true);await release(0);await a;assert.equal(has(),true);pass('late-failure-after-replacement-success');
 const older=render(clone()),newerModel=clone();newerModel.meta.previewStructureReview.fields.find(f=>f.target.informationId==='cf-2afe02557bfa91').purpose='replacement purpose';const newer=render(newerModel);await release(1);await newer;assert.ok(root.textContent.includes('replacement purpose'));await release(0);await older;assert.ok(root.textContent.includes('replacement purpose'));pass('same-id-revision-replacement-success');
 const navigation=render(clone());root.querySelector('[data-information-id="cf-2afe02557bfa91"] button').click();assert.equal(root.querySelector('table'),null);await release(0);await navigation;assert.equal(root.querySelector('table'),null);await release(0);await new Promise(r=>setTimeout(r,0));assert.equal(root.querySelector('table'),null);assert.equal(has(),true);pass('pending-navigation-keeps-selection');
 const mutable=clone(),pending=render(mutable);mutable.meta.fieldMappings[0].logicalMeaning='mutated during validation';await release(0);await pending;assert.equal(has(),false);pass('mutation-pending');
 const live=clone(),ready=render(live);await release(0);await ready;assert.equal(has(),true);const text=root.textContent;live.meta.previewStructureReview.fields[0].purpose='mutated after validation';live.concepts[0].information[0].name='changed';assert.equal(root.textContent,text);pass('mutation-after-stable-snapshot');
 const repeat=render(live);await release(0);await repeat;assert.equal(has(),false);pass('mutation-after-revalidation');
 const legacy=clone();legacy.meta.previewStructureReview=structuredClone(old);for(const entry of Object.values(legacy.meta.previewStructureReview.fields)){entry.reason='SENTINEL_REASON';entry.source='SENTINEL_SOURCE';entry.perspectiveReason='SENTINEL_PERSPECTIVE';entry.sampleReason='SENTINEL_SAMPLE';}await render(legacy);const copied=[];Object.defineProperty(w.navigator,'clipboard',{value:{writeText:async value=>copied.push(value)}});root.querySelector('.structure-copy-full').click();await new Promise(r=>setTimeout(r,0));assert.ok(copied.length);for(const marker of ['SENTINEL_REASON','SENTINEL_SOURCE','SENTINEL_PERSPECTIVE','SENTINEL_SAMPLE']){assert.ok(!root.outerHTML.includes(marker));assert.ok(!copied[0].includes(marker));}pass('legacy-management-no-dom-attributes-or-copy');
 assert.equal(root.querySelector('details,.structure-review-hypothesis-label'),null);assert.ok(!root.outerHTML.includes('SENTINEL_REASON'));pass('no-management-dom');
}finally{w.close();}
mkdirSync('web/evidence/review-cleanup',{recursive:true});writeFileSync('web/evidence/review-cleanup/integrity-results.json',JSON.stringify({source:baseline.sourceHead,results},null,2)+'\n');console.log(JSON.stringify({reviewIntegrity:results}));
