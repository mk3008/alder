import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {validate} from './core.mjs';
import {guardAuthoring,meaningHash} from './authoring.mjs';

const read=name=>readFileSync(new URL(name,import.meta.url),'utf8');
const authority=read('./verification/procedure-dependencies.check-items.json');
const ids=JSON.parse(authority).checks.map(value=>value.id);
assert.equal(createHash('sha256').update(authority).digest('hex'),'cb361098a8120dbd2bb4a8eadf482675be790b45c7a99278b03ff17e28096b6c');
assert.deepEqual(ids,['DEP-001','DEP-002','DEP-003','DEP-004','DEP-005','DEP-006']);
const base=JSON.parse(read('./examples/molkky-dependencies-v07.json'));
const activity=pkg=>pkg.documents[0].activities[0],step=(pkg,id)=>activity(pkg).procedure.steps.find(value=>value.id===id);
const prereq=(stepId,whenDecision=null)=>({stepId,whenDecision});
const copy=()=>structuredClone(base);
const swap=(steps,a,b)=>{const i=steps.findIndex(x=>x.id===a),j=steps.findIndex(x=>x.id===b);[steps[i],steps[j]]=[steps[j],steps[i]];};

test('DEP-001: explicit prerequisites permit independent reorder and reject a reversed dependency',()=>{
 assert.doesNotThrow(()=>validate(base));const reversed=copy();swap(activity(reversed).procedure.steps,'validate','calculate');
 assert.throws(()=>validate(reversed),/contradicts prerequisite/);
 const independent=copy(),a=activity(independent),extra=structuredClone(step(independent,'validate'));
 Object.assign(extra,{id:'other-review',action:'別項目を確認する',decisionIds:[],dependsOn:[prereq('receive')]});
 a.procedure.steps.splice(2,0,extra);assert.doesNotThrow(()=>validate(independent));swap(a.procedure.steps,'validate','other-review');assert.doesNotThrow(()=>validate(independent));
});
test('DEP-002: absence/null are unknown, empty is explicit, and a later decision link only raises a review diagnostic',()=>{
 const old=JSON.parse(read('./examples/molkky-decisions-v07.json')),before=JSON.stringify(old);assert.doesNotThrow(()=>validate(old));assert.equal(JSON.stringify(old),before);
 const reversed=structuredClone(old);swap(activity(reversed).procedure.steps,'validate','calculate');
 assert.ok(validate(reversed).diagnostics.some(value=>value.includes('判定表を参照する手順が後方: calculate / validate')));
 step(reversed,'calculate').dependsOn=null;assert.ok(validate(reversed).diagnostics.some(value=>value.includes('前提を確認')));
 step(reversed,'calculate').dependsOn=[];assert.equal(validate(reversed).diagnostics.some(value=>value.includes('前提を確認')),false);
 const ambiguous=structuredClone(old);step(ambiguous,'receive').decisionIds=['input-validation'];swap(activity(ambiguous).procedure.steps,'validate','calculate');
 assert.equal(validate(ambiguous).diagnostics.some(value=>value.includes('判定表を参照する手順が後方')),false);
});
test('DEP-003: reject missing, foreign, duplicate, self, cyclic and contradictory prerequisites',()=>{
 const bad=change=>{const pkg=copy();change(pkg);assert.throws(()=>validate(pkg));};
 bad(x=>step(x,'calculate').dependsOn=[prereq('missing')]);
 bad(x=>step(x,'calculate').dependsOn=[prereq('calculate')]);
 bad(x=>step(x,'calculate').dependsOn=[prereq('validate'),prereq('validate')]);
 bad(x=>step(x,'validate').dependsOn=[prereq('calculate')]);
 bad(x=>activity(x).procedure.orderRules.push({kind:'interchangeable',stepIds:['validate','calculate']}));
 bad(x=>step(x,'reply').dependsOn=[prereq('calculate',{decisionId:'input-validation',rowId:'missing'})]);
 bad(x=>{const a=structuredClone(activity(x)),s=structuredClone(step(x,'validate'));a.id='other-activity';a.name='別業務';s.id='foreign-step';s.decisionIds=[];s.dependsOn=[];a.procedure={steps:[s],orderRules:[]};a.decisions=[];a.results=[{id:'other-result',text:'完了'}];x.documents[0].activities.push(a);step(x,'calculate').dependsOn=[prereq('foreign-step')];});
});
test('DEP-004: a conditional prerequisite is preserved and an optional prerequisite requires review',()=>{
 const pkg=copy(),reply=step(pkg,'reply');assert.deepEqual(reply.dependsOn[1],prereq('calculate',{decisionId:'input-validation',rowId:'valid'}));
 assert.equal(validate(pkg).diagnostics.some(value=>value.includes('前提手順の実施条件を確認')),false);
 step(pkg,'validate').obligation='optional';const result=validate(pkg);assert.ok(result.diagnostics.some(value=>value.includes('前提手順の実施条件を確認: calculate <- validate')));
 assert.equal(step(pkg,'validate').obligation,'optional');assert.equal(step(pkg,'calculate').whenDecision.rowId,'valid');
 const inconsistent=copy();step(inconsistent,'reply').dependsOn[1].whenDecision=null;assert.ok(validate(inconsistent).diagnostics.some(value=>value.includes('前提手順の実施条件を確認: reply <- calculate')));
});
test('dependency changes do not silently preserve confirmed linked Check meaning',()=>{
 const prior=JSON.parse(read('./examples/molkky-decisions-v07.json')),oldChecks=prior.documents[1];for(const item of oldChecks.items)item.reviewState='確認済み';
 const next=structuredClone(prior);next.revision='new-package';next.documents[0].revision='new-bd';next.documents[1].revision='new-check';next.documents[1].basedOn.revision='new-bd';
 step(next,'calculate').dependsOn=[prereq('validate')];
 const previousItem=oldChecks.items.find(item=>item.id==='check-01'),nextItem=next.documents[1].items.find(item=>item.id==='check-01');
 assert.notEqual(meaningHash(prior,previousItem),meaningHash(next,nextItem));
 const operation={expectedRevision:prior.revision,bdConfirmations:[{documentId:next.documents[0].id,revision:'new-bd',evidence:{source:'test',quote:'test'}}]};
 assert.throws(()=>guardAuthoring(prior,next,operation),/renewed human review/);assert.equal(previousItem.reviewState,'確認済み');
});
