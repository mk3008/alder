import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {project} from './step-summary.mjs';

const raw=await readFile(new URL('./step-summary-fixture.json',import.meta.url),'utf8');
const awaitPaper=await readFile(new URL('./paper-note-fixture.json',import.meta.url),'utf8');
const fixture=JSON.parse(raw), copy=()=>structuredClone(fixture);
const act=(d,id)=>d.activities.find(a=>a.id===id);
const step=(d,id)=>d.activities.flatMap(a=>a.steps).find(s=>s.id===id);
const has=(r,code)=>r.errors.some(e=>e.code===code);
const pending=(r,code,id)=>r.pending.some(p=>p.code===code&&p.where===id);
let count=0;
function test(name,fn){fn();count++;console.log(`ok ${count} - ${name}`);}

test('role and system Who are each valid without making a system a Role',()=>{
  const r=project(fixture);assert.deepEqual(r.errors,[]);assert.deepEqual(r.pending,[]);
  assert.deepEqual(act(fixture,'a-inquiry').who,{kind:'role',roleId:'role-designer'});
  assert.deepEqual(act(fixture,'a-payment').who,{kind:'system',name:'会計システム'});
});
test('scheduler Who works without a Role',()=>{
  const d=copy();act(d,'a-payment').who={kind:'scheduler',name:'定時スケジューラー'};
  assert.deepEqual(project(d).errors,[]);
});
test('several outgoing steps become one directed edge and a combined label',()=>{
  const edge=project(fixture).edges.find(e=>e.activityId==='a-inquiry'&&e.objectId==='notebook'&&e.direction==='output');
  assert.deepEqual(edge,{activityId:'a-inquiry',objectId:'notebook',direction:'output',stepIds:['s-name-query','s-date-query','s-date-retry'],data:[{id:'d-name-filter',name:'顧客名の検索条件'},{id:'d-date-filter',name:'受付日の検索条件'}],label:'顧客名の検索条件 / 受付日の検索条件'});
});
test('incoming steps are a separate edge with their own combined label',()=>{
  const result=project(fixture), same=result.edges.filter(e=>e.activityId==='a-inquiry'&&e.objectId==='notebook');
  assert.equal(same.length,2);
  assert.deepEqual(same.find(e=>e.direction==='input'),{activityId:'a-inquiry',objectId:'notebook',direction:'input',stepIds:['s-name-result','s-date-result'],data:[{id:'d-name-result',name:'顧客名の検索結果'},{id:'d-date-result',name:'受付日の検索結果'}],label:'顧客名の検索結果 / 受付日の検索結果'});
});
test('every step stays distinct even when Data label is summarized',()=>{
  const result=project(fixture), row=result.rows.find(r=>r.stepId==='s-date-retry');
  assert.equal(row.dataId,'d-date-filter');assert.equal(row.effect,'read');
  assert.ok(result.edges.find(e=>e.activityId==='a-inquiry'&&e.direction==='output').stepIds.includes('s-date-retry'));
});
test('different Data IDs with the same name remain distinguishable',()=>{
  const d=copy();d.data.find(x=>x.id==='d-date-filter').name='顧客名の検索条件';
  const labels=project(d).edges.find(e=>e.activityId==='a-inquiry'&&e.direction==='output').data;
  assert.deepEqual(labels.map(x=>x.id),['d-name-filter','d-date-filter']);
});
test('different Activities using the same Object do not collapse into one edge',()=>{
  const d=copy();d.activities.push({id:'a-other',name:'別業務',scope:true,who:{kind:'role',roleId:'role-designer'},when:'連絡時',steps:[{id:'s-other',text:'検索する',obligation:'required',appliesWhen:null,effect:'read',exchange:{phase:'request',direction:'output',objectId:'notebook',dataId:'d-name-filter'}}]});
  const r=project(d);assert.deepEqual(r.errors,[]);assert.ok(r.edges.some(e=>e.activityId==='a-other'&&e.objectId==='notebook'));
  assert.ok(r.edges.some(e=>e.activityId==='a-inquiry'&&e.objectId==='notebook'));
});
test('Request/Response is independent of input/output',()=>{
  const d=copy(), before=project(d).edges;step(d,'s-name-query').exchange.phase='response';step(d,'s-name-result').exchange.phase='request';
  const r=project(d);assert.deepEqual(r.errors,[]);
  assert.deepEqual(r.edges,before);
  assert.equal(r.rows.find(x=>x.stepId==='s-name-query').direction,'output');
  assert.equal(r.rows.find(x=>x.stepId==='s-name-result').direction,'input');
});
test('Response is not required to reference another Activity or an invented request',()=>{
  const d=copy(), a=act(d,'a-inquiry');a.steps=[structuredClone(step(d,'s-name-result'))];d.activities=[a];
  assert.deepEqual(project(d).errors,[]);assert.deepEqual(project(d).pending,[]);
});
test('CRUD is a Step property and changing it does not change diagram edges',()=>{
  const d=copy(), before=project(d);step(d,'s-name-result').effect='update';
  const after=project(d);assert.deepEqual(after.errors,[]);assert.deepEqual(after.edges,before.edges);
  assert.equal(after.rows.find(r=>r.stepId==='s-name-result').effect,'update');
  assert.ok(after.edges.every(edge=>!('effect' in edge)));
});
test('multiple When patterns can join through conditionally required steps',()=>{
  const a=act(fixture,'a-inquiry');
  assert.equal(a.when,'問合せ、または変更連絡が届いたとき');
  assert.equal(step(fixture,'s-new-intake').obligation,'required');assert.equal(step(fixture,'s-new-intake').appliesWhen,'新規問合せのとき');
  assert.equal(step(fixture,'s-change-intake').obligation,'required');assert.equal(step(fixture,'s-change-intake').appliesWhen,'変更連絡のとき');
  assert.equal(step(fixture,'s-name-query').appliesWhen,null);
  assert.ok(a.steps.findIndex(s=>s.id==='s-new-intake')<a.steps.findIndex(s=>s.id==='s-name-query'));
  assert.ok(a.steps.findIndex(s=>s.id==='s-change-intake')<a.steps.findIndex(s=>s.id==='s-name-query'));
  assert.equal(a.steps.filter(s=>s.id==='s-name-query').length,1);
  const r=project(fixture);assert.deepEqual(r.errors,[]);assert.ok(r.rows.some(row=>row.stepId==='s-name-query'));
});
test('an unresolved Who does not remove the Activity endpoint',()=>{
  const d=copy(),before=project(d).rows.find(r=>r.stepId==='s-name-query');act(d,'a-inquiry').who=null;
  const r=project(d);assert.ok(pending(r,'WHO_UNRESOLVED','a-inquiry'));assert.deepEqual(r.rows.find(x=>x.stepId==='s-name-query'),before);
});
test('the projection leaves source steps and user conditions unchanged',()=>{
  const d=copy(),before=JSON.stringify(d);project(d);assert.equal(JSON.stringify(d),before);
});
const bad=[
  ['unknown Object is rejected','INVALID_REFERENCE',d=>{step(d,'s-name-query').exchange.objectId='missing';}],
  ['unknown Data is rejected','INVALID_REFERENCE',d=>{step(d,'s-name-query').exchange.dataId='missing';}],
  ['unknown Role is rejected','INVALID_REFERENCE',d=>{act(d,'a-inquiry').who.roleId='missing';}],
  ['multiple Who are rejected','SINGLE_WHO_REQUIRED',d=>{act(d,'a-inquiry').who=[{kind:'role',roleId:'role-designer'}];}],
  ['duplicate Step ID is rejected','DUPLICATE_ID',d=>{step(d,'s-date-query').id='s-name-query';}],
  ['unknown direction is rejected','DIRECTION',d=>{step(d,'s-name-query').exchange.direction='sideways';}],
  ['unknown communication phase is rejected in this candidate','PHASE',d=>{step(d,'s-name-query').exchange.phase='notification';}],
  ['invalid Scope values are rejected','SCOPE_BOOLEAN',d=>{d.objects[0].scope='true';}],
  ['unknown Step effect is rejected','EFFECT',d=>{step(d,'s-name-query').effect='maybe';}]
];
for(const [name,code,mutate] of bad)test(name,()=>{const d=copy();mutate(d);const r=project(d);assert.ok(has(r,code),`${code}: ${JSON.stringify(r.errors)}`);});
test('unresolved Data is reported without creating an invented label',()=>{
  const d=copy();step(d,'s-name-query').exchange.dataId=null;const r=project(d);
  assert.ok(pending(r,'DATA_UNRESOLVED','s-name-query'));
  assert.ok(!r.edges.find(e=>e.activityId==='a-inquiry'&&e.direction==='output').data.some(x=>x.id==='d-name-filter'));
});
test('an unresolved exchange is not assumed to be local',()=>{
  const d=copy();step(d,'s-judge').exchange=null;const r=project(d);
  assert.ok(pending(r,'EXCHANGE_UNRESOLVED','s-judge'));assert.equal(r.rows.find(x=>x.stepId==='s-judge').kind,'unresolved');
});
test('paper-to-note example keeps the same Data in the two explicit interactions',()=>{
  const paper=JSON.parse(awaitPaper), r=project(paper), a=act(paper,'a-copy');
  assert.deepEqual(r.errors,[]);assert.deepEqual(r.pending.map(p=>p.where).sort(),['a-copy','memo','paper','s-read']);
  assert.ok(pending(r,'DATA_UNRESOLVED','s-read'));
  assert.deepEqual(a.steps.map(s=>s.id),['s-read','s-read-response','s-write','s-write-response']);
  assert.equal(step(paper,'s-read-response').exchange.dataId,'content');
  assert.equal(step(paper,'s-write').exchange.dataId,'content');
  assert.equal(paper.objects.find(o=>o.id==='paper').scope,null);
  assert.deepEqual(r.edges.find(e=>e.objectId==='paper'&&e.direction==='input').data,[{id:'content',name:'記載内容'}]);
  assert.deepEqual(r.edges.find(e=>e.objectId==='memo'&&e.direction==='output').data,[{id:'content',name:'記載内容'}]);
  assert.deepEqual(r.edges.find(e=>e.objectId==='memo'&&e.direction==='input').data,[{id:'write-success',name:'記載成功'}]);
  assert.deepEqual(r.edges.filter(e=>e.data.length===0).map(e=>[e.objectId,e.direction]),[['paper','output']]);
});
test('paper Scope requires context; classification does not change the recorded steps',()=>{
  const paper=JSON.parse(awaitPaper), before=project(paper);
  paper.objects.find(o=>o.id==='paper').scope=true;step(paper,'s-read').text='作業者が対象システムのOCRで紙を読み取る';const machine=project(paper);
  paper.objects.find(o=>o.id==='paper').scope=false;step(paper,'s-read').text='作業者が紙を目視で読み取る';const human=project(paper);
  assert.ok(pending(before,'SCOPE_UNRESOLVED','paper'));
  assert.ok(!pending(machine,'SCOPE_UNRESOLVED','paper'));assert.ok(!pending(human,'SCOPE_UNRESOLVED','paper'));
  assert.equal(machine.rows.find(x=>x.stepId==='s-read').text,'作業者が対象システムのOCRで紙を読み取る');
  assert.equal(human.rows.find(x=>x.stepId==='s-read').text,'作業者が紙を目視で読み取る');
  assert.deepEqual(machine.edges,human.edges);
});
test('no Data differs from unresolved Data and does not manufacture a label',()=>{
  const d=copy();const e=step(d,'s-name-query').exchange;delete e.dataId;e.noData=true;
  const r=project(d);assert.deepEqual(r.errors,[]);assert.ok(!pending(r,'DATA_UNRESOLVED','s-name-query'));
  assert.ok(!r.edges.find(x=>x.activityId==='a-inquiry'&&x.direction==='output').data.some(x=>x.id==='d-name-filter'));
});
test('missing or contradictory Data declaration is rejected',()=>{
  const d=copy(),e=step(d,'s-name-query').exchange;delete e.dataId;
  assert.ok(has(project(d),'DATA_SHAPE'));e.dataId='d-name-filter';e.noData=true;assert.ok(has(project(d),'DATA_SHAPE'));
});
console.log(`${count} tests passed`);
