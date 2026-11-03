import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validate} from './core.mjs';
import {projectProcedure} from './procedure-structure.mjs';

const fixture=name=>JSON.parse(readFileSync(new URL('./examples/'+name,import.meta.url),'utf8'));
const draft=()=>fixture('continuity-draft-v06.json');
const c=p=>p.documents[0].exceptions[0].continuity;

test('CONTINUITY-001: an exception retains the interruption, restart and referenced information',()=>{
 const p=draft(),before=JSON.stringify(p);validate(p);assert.equal(JSON.stringify(p),before);
 assert.equal(c(p).trigger,'記入中に不明点が見つかったとき');assert.match(c(p).onInterrupt,/下書き/);
 assert.match(c(p).resumeAction,/下書き.*探して開き/);assert.equal(c(p).resumeAtStepId,'enter');assert.deepEqual(c(p).retainedDataIds,['application-data']);
});
test('CONTINUITY-002: an end, uninterrupted continuation and unresolved handling do not manufacture a restart',()=>{
 for(const outcome of ['end','continue',null]){const p=draft();Object.assign(c(p),{outcome,resumeCondition:null,resumeAction:null,resumeAtStepId:null,retainedDataIds:null});validate(p);assert.equal(c(p).resumeAction,null);}
 const p=draft();delete p.documents[0].exceptions[0].continuity;validate(p);
});
test('CONTINUITY-003: unknown, foreign and repeated references are rejected',()=>{
 for(const edit of [p=>{c(p).resumeAtStepId='missing';},p=>{c(p).interruptedAtStepId='missing';},p=>{c(p).retainedDataIds=['missing'];},p=>{c(p).retainedDataIds=['application-data','application-data'];}]){const p=draft();edit(p);assert.throws(()=>validate(p));}
 const p=draft(),a=structuredClone(p.documents[0].activities[0]);a.id='other';a.name='別の業務';a.procedure.steps[0].id='other-step';a.procedure.steps[0].exchange.relationId=null;a.results[0].id='other-result';p.documents[0].activities.push(a);c(p).resumeAtStepId='other-step';assert.throws(()=>validate(p),/owner mismatch/);
});
test('SP-005/008: a person can read paper without inventing a response or reversing the data flow',()=>{
 const p=fixture('paper-manual-v06.json');validate(p);const {rows,edges}=projectProcedure(p.documents[0]);
 assert.equal(rows.length,2);assert.equal(rows[0].action,'読む');assert.deepEqual(rows[0].parties,{from:{kind:'who'},to:{kind:'object',objectId:'paper'}});
 assert.equal(rows[0].direction,'input');assert.equal(rows[0].phase,'not-applicable');assert.equal(rows[0].pairedStepId,null);
 assert.equal(edges.find(e=>e.objectId==='paper').direction,'input');assert.equal(edges.find(e=>e.objectId==='memo').direction,'output');
 const bad=structuredClone(p);bad.documents[0].activities[0].procedure.steps[0].parties.to.objectId='missing';assert.throws(()=>validate(bad));
 const paired=structuredClone(p);paired.documents[0].activities[0].procedure.steps[0].exchange.pairedStepId='write';assert.throws(()=>validate(paired),/Request\/Response mismatch/);
});
