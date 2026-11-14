import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {validate} from './validate.mjs';

const source = await readFile(new URL('./fixture.json', import.meta.url), 'utf8');
const fixture = JSON.parse(source), copy = () => structuredClone(fixture);
const activity = (d,id) => d.activities.find(a => a.id === id);
const step = (d,id) => d.activities.flatMap(a => a.procedure.steps).find(s => s.id === id);
const relation = (d,id) => d.relations.find(r => r.id === id);
const has = (result,code) => result.errors.some(e => e.code === code);
const outstanding = (result,code,id) => result.pending.some(p => p.code === code && (!id || p.where === id));
let count = 0;
function test(name,fn) { fn(); count++; console.log(`ok ${count} - ${name}`); }

test('baseline is structurally valid but identifies unresolved Who, effect and graph link', () => {
  const result=validate(fixture);
  assert.deepEqual(result.errors,[]);
  assert.ok(outstanding(result,'WHO_UNRESOLVED','activity-auto'));
  assert.ok(outstanding(result,'EFFECT_UNRESOLVED','s-one-way'));
  assert.ok(outstanding(result,'UNLINKED_RELATION','s-object-transfer'));
});
test('read request and response project endpoints and Data from different Relations', () => {
  const rows=validate(fixture).rows;
  assert.deepEqual(rows.find(r=>r.stepId==='s-search'),{stepId:'s-search',kind:'exchange',relationId:'r-search',from:'who:activity-inquiry',to:'object:notebook',dataId:'d-search-criteria',direction:'output',phase:'request',operation:'検索',effect:'read',replyToStepId:null});
  const r=rows.find(r=>r.stepId==='s-search-result');
  assert.equal(r.from,'object:notebook'); assert.equal(r.to,'who:activity-inquiry'); assert.equal(r.dataId,'d-search-result'); assert.equal(r.replyToStepId,'s-search');
});
test('graph Activity endpoint and table Who always represent the same Activity',()=>{
  const r=validate(fixture), edge=r.graphEdges.find(e=>e.relationId==='r-search'), row=r.rows.find(s=>s.stepId==='s-search');
  assert.deepEqual(edge,{relationId:'r-search',from:'activity:activity-inquiry',to:'object:notebook',dataId:'d-search-criteria',direction:'output'});
  assert.equal(row.from,'who:activity-inquiry'); assert.equal(row.to,edge.to);
  assert.equal(row.relationId,edge.relationId); assert.equal(row.dataId,edge.dataId); assert.equal(row.direction,edge.direction);
  const incoming=r.graphEdges.find(e=>e.relationId==='r-search-result'), answer=r.rows.find(s=>s.stepId==='s-search-result');
  assert.equal(incoming.to,'activity:activity-inquiry'); assert.equal(answer.to,'who:activity-inquiry'); assert.equal(answer.from,incoming.from);
});
test('unresolved Role does not remove the Activity/Who endpoint correspondence',()=>{
  const d=copy(), before=validate(d).rows.find(s=>s.stepId==='s-search');
  activity(d,'activity-inquiry').roleId=null;
  const result=validate(d), after=result.rows.find(s=>s.stepId==='s-search');
  assert.deepEqual(after,before); assert.ok(outstanding(result,'WHO_UNRESOLVED','activity-inquiry'));
  assert.equal(result.graphEdges.find(e=>e.relationId==='r-search').from,'activity:activity-inquiry');
});
test('the same Role across Activities does not merge the two graph endpoints',()=>{
  const d=copy(); activity(d,'activity-approval').roleId='role-designer';
  const result=validate(d);
  assert.equal(result.rows.find(s=>s.stepId==='s-search').from,'who:activity-inquiry');
  assert.equal(result.rows.find(s=>s.stepId==='s-approval').from,'who:activity-approval');
  assert.deepEqual(result.errors,[]);
});
test('a graph Relation without a corresponding Procedure step is reported for review',()=>{
  const d=copy(); d.relations.push({...relation(d,'r-search'),id:'r-uncovered',dataId:'d-search-result'});
  const result=validate(d);
  assert.deepEqual(result.errors,[]);
  assert.ok(outstanding(result,'RELATION_WITHOUT_STEP','r-uncovered'));
  assert.ok(result.graphEdges.some(e=>e.relationId==='r-uncovered'));
});
test('an unlinked Procedure exchange is not falsely claimed as covered by the graph',()=>{
  const d=copy(), s=step(d,'s-search');
  s.exchange={phase:'request',operation:'検索',effect:'read',unlinked:{from:{kind:'who'},to:{kind:'object',id:'notebook'},data:{status:'ref',dataId:'d-search-criteria'},reason:'このStepと図の対応が未確認'}};
  const result=validate(d);
  assert.deepEqual(result.errors,[]);
  assert.ok(outstanding(result,'UNLINKED_RELATION','s-search'));
  assert.ok(outstanding(result,'RELATION_WITHOUT_STEP','r-search'));
  assert.equal(result.rows.find(row=>row.stepId==='s-search').relationId,null);
});
test('changing one Relation changes graph and table Data together',()=>{
  const d=copy(); relation(d,'r-search').dataId='d-search-result';
  const result=validate(d), edge=result.graphEdges.find(e=>e.relationId==='r-search'), row=result.rows.find(s=>s.stepId==='s-search');
  assert.equal(edge.dataId,'d-search-result'); assert.equal(row.dataId,'d-search-result'); assert.deepEqual(result.errors,[]);
  // Agreement with the natural-language intent still requires semantic review.
});
test('input can be Request; external Object may be outside Scope', () => {
  const row=validate(fixture).rows.find(r=>r.stepId==='s-one-way');
  assert.equal(row.direction,'input'); assert.equal(row.phase,'request'); assert.equal(row.replyToStepId,null);
  assert.equal(fixture.objects.find(o=>o.id==='customer').scope,false);
  assert.equal(activity(fixture,'activity-external-approval').scope,false);
});
test('internal judgment and automatic work do not invent exchanges', () => {
  const rows=validate(fixture).rows;
  assert.equal(rows.find(r=>r.stepId==='s-judge').kind,'local');
  assert.equal(rows.find(r=>r.stepId==='s-auto').kind,'local');
  assert.equal(activity(fixture,'activity-auto').roleId,null);
});
test('notification and a request without response do not invent counterparts', () => {
  const rows=validate(fixture).rows;
  assert.equal(rows.find(r=>r.stepId==='s-notice').phase,'notification');
  assert.ok(!fixture.activities.flatMap(a=>a.procedure.steps).some(s=>s.exchange?.replyToStepId==='s-one-way'));
});
test('Step IDs, conditions, order, multiple Results and exception remain separate', () => {
  const a=activity(fixture,'activity-inquiry');
  assert.equal(step(fixture,'s-question').obligation,'optional');
  assert.equal(step(fixture,'s-question').appliesWhen,'事実が不足するとき');
  assert.deepEqual(a.procedure.orderRules,[{kind:'before',beforeId:'s-search',afterId:'s-save'}]);
  assert.deepEqual(a.results.map(r=>r.id),['result-recorded','result-pending']);
  assert.equal(fixture.exceptions[0].activityId,'activity-auto');
  assert.deepEqual(fixture,JSON.parse(source));
});

const negatives = [
  ['missing Relation reference','INVALID_REFERENCE',d=>{step(d,'s-search').exchange.relationId='missing';}],
  ['missing Data reference','INVALID_REFERENCE',d=>{relation(d,'r-search').dataId='missing';}],
  ['Information belongs to a different Object','DATA_OWNER',d=>{relation(d,'r-search').dataId='d-answer';}],
  ['output endpoints contradict Relation direction','INVALID_REFERENCE',d=>{relation(d,'r-search').kind='input';}],
  ['Relation belongs to a different Activity','RELATION_ACTIVITY_DIRECTION',d=>{step(d,'s-search').exchange.relationId='r-approval';}],
  ['response refers to a response, not a request','REPLY_NOT_REQUEST',d=>{step(d,'s-search-result').exchange.replyToStepId='s-answer';}],
  ['paired response has same direction as request','REPLY_DIRECTION',d=>{step(d,'s-search-result').exchange.relationId='r-search';}],
  ['paired response is from another Object','REPLY_DIRECTION',d=>{step(d,'s-search-result').exchange.relationId='r-answer';}],
  ['request cannot claim to be a response','REQUEST_REPLY',d=>{step(d,'s-search').exchange.replyToStepId='s-answer';}],
  ['notification cannot silently be a response','NOTIFICATION_REPLY',d=>{step(d,'s-notice').exchange.replyToStepId='s-question';}],
  ['CRUD effect cannot be assigned to response','NON_REQUEST_EFFECT',d=>{step(d,'s-answer').exchange.effect='update';}],
  ['Who cannot be an array','SINGLE_WHO_REQUIRED',d=>{activity(d,'activity-inquiry').roleId=['role-designer'];}],
  ['Scope is explicitly boolean','SCOPE_BOOLEAN',d=>{d.objects[0].scope='true';}],
  ['duplicate Step ID is rejected','DUPLICATE_ID',d=>{step(d,'s-answer').id='s-question';}],
  ['order rules cannot refer to another Activity','ORDER_REFERENCE',d=>{activity(d,'activity-inquiry').procedure.orderRules[0].afterId='s-approval';}],
  ['duplicate local ordering rule is rejected','DUPLICATE_ORDER',d=>{const rules=activity(d,'activity-inquiry').procedure.orderRules;rules.push(structuredClone(rules[0]));}],
  ['interchangeable steps cannot have a before constraint','INTERCHANGEABLE_CONFLICT',d=>{activity(d,'activity-inquiry').procedure.orderRules.push({kind:'interchangeable',stepIds:['s-search','s-save']});}],
  ['normal Step count cannot become zero','STEP_REQUIRED',d=>{activity(d,'activity-approval').procedure.steps=[];}],
  ['exception must refer to an existing Activity','INVALID_REFERENCE',d=>{d.exceptions[0].activityId='missing';}]
];
for(const [name,code,mutate] of negatives) test(name,()=>{const d=copy();mutate(d);const result=validate(d);assert.ok(has(result,code),`${code}: ${JSON.stringify(result.errors)}`);});
test('an explicitly unresolved response is pending, without a fabricated request',()=>{
  const d=copy(); step(d,'s-answer').exchange.replyToStepId=null;
  const r=validate(d); assert.deepEqual(r.errors,[]); assert.ok(outstanding(r,'REPLY_UNRESOLVED','s-answer'));
});
test('an undecided exchange is not mistaken for a local-only step',()=>{
  const d=copy(); step(d,'s-judge').exchange=null;
  const r=validate(d); assert.deepEqual(r.errors,[]); assert.ok(outstanding(r,'EXCHANGE_UNRESOLVED','s-judge'));
  assert.equal(r.rows.find(row=>row.stepId==='s-judge').kind,'unresolved');
});
test('multiple explicit responses may refer to the same request',()=>{
  const d=copy(), a=activity(d,'activity-inquiry'), second=structuredClone(step(d,'s-search-result'));
  second.id='s-search-result-second'; a.procedure.steps.splice(2,0,second);
  assert.deepEqual(validate(d).errors,[]);
});
test('unlinked transmission with unknown or no Data is not represented as a linked pass',()=>{
  const d=copy(); step(d,'s-object-transfer').exchange.unlinked.data={status:'unknown'};
  let r=validate(d); assert.deepEqual(r.errors,[]); assert.ok(outstanding(r,'DATA_UNRESOLVED','s-object-transfer')); assert.ok(outstanding(r,'UNLINKED_RELATION','s-object-transfer'));
  step(d,'s-object-transfer').exchange.unlinked.data={status:'none'};
  r=validate(d); assert.deepEqual(r.errors,[]); assert.ok(!outstanding(r,'DATA_UNRESOLVED','s-object-transfer')); assert.ok(outstanding(r,'UNLINKED_RELATION','s-object-transfer'));
});
test('read-only projection does not mutate the source fixture',()=>{
  const d=copy(), before=JSON.stringify(d); validate(d); assert.equal(JSON.stringify(d),before);
});
console.log(`${count} tests passed`);
