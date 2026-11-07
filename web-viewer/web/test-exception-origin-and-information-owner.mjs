import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const fixed={
 '../work/normalization-candidate/exception-origin-acceptance.json':'7c1158dd2e59f544d6aaf7f60991cf3de310d9f228f3152c4e1699b347eb598f',
 '../work/normalization-candidate/information-ownership-acceptance.json':'bff949d37401d01f5edc157fbbe12f57e5d853bd1af5be2792404209ff538337',
 '../work/normalization-candidate/procedure-goal-acceptance.json':'dcee0d7830a08fa1869dc07b791533db990f7d1c5223ba05eef8dc149238b087',
 '../tools/document_storage/schema.mjs':'e46e388660df746173e16e8c72b56e9a9a74f6fcd6935f5bff304737961dddb2',
 '../tools/document_storage/procedure-structure.mjs':'1387154d9ca57dc7867f5fc4529f173f101d730570aeb48243b48cca2c220427',
 '../tools/document_storage/examples/molkky-decisions-v07.json':'eb732a3650a7d6a3b5cc1aa8e7d0a5ea1008f4fbe4f7333833f8ba4830e4eafc',
 '../tools/document_storage/examples/continuity-draft-v06.json':'dc27b59f846dd1affeaecaf5601a851b3f6fc9648781144d81afd9601a4c7c99',
 '../business-design/alder/business-design.json':'b8356070947d73502197e08560a9084e139aa8c0f7c88c64109a98502d7182c9'
};
const verifyFixed=()=>{for(const [path,digest] of Object.entries(fixed))assert.equal(hash(readFileSync(path)),digest,path);};
verifyFixed();
const read=path=>JSON.parse(readFileSync(path,'utf8'));
const authorities=['../work/normalization-candidate/exception-origin-acceptance.json','../work/normalization-candidate/information-ownership-acceptance.json'];
const required=authorities.flatMap(path=>read(path).checks.map(item=>item.id)),covered=[];
const coverage=ids=>{assert.equal(ids.length,required.length);assert.equal(new Set(ids).size,ids.length);assert.deepEqual(new Set(ids),new Set(required));};
assert.throws(()=>coverage(required.slice(1)));assert.throws(()=>coverage([...required,required[0]]));
const candidate='../business-design/alder/json-complete-concept-review.json',bytes=readFileSync(candidate),pkg=JSON.parse(bytes),model=pkg.documents.find(item=>item.kind==='conceptModel');
const concept=id=>{const c=model.concepts.find(item=>item.id===id);assert(c,id);return c;};
const relation=id=>{const r=model.relations.find(item=>item.id===id);assert(r,id);return r;};
const mapping=physical=>model.meta.fieldMappings.find(item=>item.physicalName===physical);
const field=(id,name)=>{const i=concept(id).information.find(item=>item.name===name);assert(i,name);return model.meta.fieldMappings.find(item=>item.informationId===i.id);};
const edge=(id,from,to,kind,fromCount,toCount)=>{const r=relation(id);assert.deepEqual([r.fromConceptId,r.toConceptId,r.kind,r.fromLabel,r.toLabel],[from,to,kind,fromCount,toCount],id);};

edge('nr-activity-exception','n-activity','n-exception','down','1','0..N');
edge('nr-flow-step-exception','n-flow-step','n-exception','reference','0..N','0..N');
assert.equal(field('n-exception','発生箇所').valueType,'string（未決／業務全体／手順）');
assert.equal(field('n-exception','発生箇所').nullable,false);
assert.match(field('n-exception','発生箇所').logicalMeaning,/分からない場合は未決/);
assert.match(relation('nr-activity-exception').condition,/属すること自体は業務全体.*意味せず/);
covered.push('EXCEPTION-ORIGIN-01');

edge('nr-row-exception','n-row','n-exception','reference','0..N','0..N');
assert.match(relation('nr-flow-step-exception').condition,/判定表への参照だけでは発生手順を確定しない/);
const molkky=read('../tools/document_storage/examples/molkky-decisions-v07.json').documents.find(d=>d.kind==='businessDesign');
const activity=molkky.activities[0],validation=activity.decisions.find(d=>d.id==='input-validation');
assert(activity.procedure.steps.find(step=>step.id==='validate').decisionIds.includes(validation.id));
assert.deepEqual(validation.rows.filter(row=>row.result.exceptionIds.includes('invalid-input')).map(row=>row.id),['duplicate','invalid-number']);
assert.equal(molkky.exceptions.filter(item=>item.id==='invalid-input').length,1);
covered.push('EXCEPTION-ORIGIN-02');

edge('nr-exception-continuity','n-exception','n-continuity','down','1','0..1');
edge('nr-continuity-interrupted','n-continuity','n-step','reference','0..N','0..1');
edge('nr-continuity-resume','n-continuity','n-step','reference','0..N','0..1');
assert.match(concept('n-continuity').description,/再開しない中断/);
assert.match(relation('nr-continuity-resume').condition,/別の業務で再開/);
const draft=read('../tools/document_storage/examples/continuity-draft-v06.json').documents[0].exceptions[0].continuity;
assert.equal(draft.interruptedAtStepId,'enter');assert.equal(draft.resumeAtStepId,'enter');
assert.match(draft.onInterrupt,/下書きとして保存/);assert.match(draft.resumeAction,/探して開き/);
covered.push('EXCEPTION-ORIGIN-03');

assert.equal(model.meta.relationNames['nr-continuity-interrupted'],'中断した位置');
assert.equal(model.meta.relationNames['nr-continuity-resume'],'再開する位置');
assert.match(relation('nr-continuity-interrupted').condition,/中断操作そのものではない/);
assert.match(relation('nr-continuity-resume').condition,/再開操作そのものではない/);
assert.match(mapping('continuities.resumeAction').logicalMeaning,/操作.*位置とは区別/);
assert.match(relation('nr-exception-continuity').condition,/別業務.*配線が複雑.*例外に含める/);
covered.push('EXCEPTION-ORIGIN-04');

assert.deepEqual(mapping('exceptions.activityId').relationKeyIds,['nr-activity-exception']);
for(const path of ['BD.exceptions[].continuity.interruptedAtStepId','BD.exceptions[].continuity.resumeAtStepId','BD.activities[].decisions[].rows[].result.exceptionIds','State.transitions[].exceptionId'])assert(model.meta.schemaCoverage.some(item=>item.path===path),path);
for(const path of ['continuities.trigger','continuities.onInterrupt'])assert.equal(model.meta.compatibilityReview.fields[mapping(path).informationId].kind,'legacy');
covered.push('EXCEPTION-ORIGIN-05');

edge('nr-object-information','n-object','n-information','down','1','0..N');
edge('nr-dataitem-information','n-dataitem','n-information','reference','0..N','1');
assert.equal(model.meta.reverseRelationNames['nr-object-information'],'所属する対象');
assert.equal(model.relations.filter(item=>item.id==='nr-object-information').length,1);
const sourceItem=molkky.objects.find(item=>item.name==='利用者').information[0],group=molkky.data.find(item=>item.id==='throws');
assert.equal(sourceItem.id,'throws-info');assert.equal(group.items[0].informationId,sourceItem.id);
assert.equal(molkky.objects.flatMap(item=>item.information).filter(item=>item.id===sourceItem.id).length,1);
covered.push('INFORMATION-OWNER-01');
edge('nr-axis-data','n-axis','n-data','reference','0..N','0..N');
assert(validation.axes.find(item=>item.id==='axis-numbers').dataIds.includes(group.id));
assert(validation.axes.find(item=>item.id==='axis-duplicate').dataIds.includes(group.id));
assert.match(concept('n-axis').description,/情報項目自体とは限らず/);
assert.match(relation('nr-axis-data').condition,/未記録の場合に参照先を推測しない/);
covered.push('INFORMATION-OWNER-02');

const code=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const w=new JSDOM('<div id="tree"></div><div id="detail"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
try{
 w.eval(code+';globalThis.Explorer=Explorer;');const tree=w.document.querySelector('#tree'),detail=w.document.querySelector('#detail');
 const render=(m,id)=>w.Explorer.renderStructureExplorer(tree,m,{rootId:id,select:selection=>w.Explorer.renderStructureDetails(detail,m,selection)});
 const value=label=>[...detail.querySelectorAll('dt')].find(item=>item.textContent===label)?.nextElementSibling?.textContent;
 const expand=()=>[...tree.querySelectorAll('button')].find(item=>item.textContent==='すべて展開').click();
 render(model,'n-exception');const continuity=tree.querySelector('[data-relation-id="nr-exception-continuity"] > details > summary');assert(continuity);continuity.click();assert.match(value('説明'),/別業務.*配線が複雑.*例外に含める/);
 render(model,'n-flow-step');assert(tree.querySelector('[data-relation-id="nr-flow-step-exception"]'));
 render(model,'n-axis');expand();const item=tree.querySelector('[data-relation-id="nr-dataitem-information"][data-relation-direction="reference"]');assert(item,'decision axis reaches the same information item through the group');
 item.querySelector(':scope > details > summary').click();assert.equal(value('所属'),'対象（Object）');
 const owner=item.querySelector(':scope > details > ul > [data-relation-id="nr-object-information"][data-relation-direction="owner"]');assert(owner,'reverse view of the existing ownership');
 assert.match(owner.textContent,/所属する対象.*型：Object/);assert.match(owner.textContent,/既出/);
 assert(tree.querySelectorAll('.structure-item').length<model.relations.length+model.concepts.length+15,'expand all terminates with a reverse ownership cycle');
 render(model,'n-information');const parent=tree.querySelector('[data-relation-id="nr-object-information"][data-relation-direction="owner"]');assert(parent);parent.querySelector('summary').click();assert.equal(value('ローカル名'),'所属する対象');
 const without=structuredClone(model);delete without.meta.reverseRelationNames;render(without,'n-information');assert(!tree.querySelector('[data-relation-direction="owner"]'),'unannotated models retain their original tree');
 covered.push('INFORMATION-OWNER-03');
}finally{w.close();}
assert.deepEqual(readFileSync(candidate),bytes);verifyFixed();covered.push('INFORMATION-OWNER-04');coverage(covered);
console.log(JSON.stringify({checks:covered,scope:'exception origin, optional continuity and information ownership/navigation'}));
