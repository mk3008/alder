import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,mkdirSync,cpSync,rmSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {validate,validateShape,validateReferences} from '../../tools/document_storage/core.mjs';
import {normalizePackage,restorePackage} from './normalize.mjs';

const acceptance=readFileSync(new URL('./acceptance.json',import.meta.url));
const acceptanceHash='fdc3609f594204ccd96d65f2e3a4fd4e2effd08a02f2c40e3bd23583d65d1bdb';
const inputPath=new URL('../../tools/document_storage/examples/molkky-decisions-v07.json',import.meta.url);
const inputBytes=readFileSync(inputPath),source=JSON.parse(inputBytes);
const copy=()=>structuredClone(source),bd=p=>p.documents.find(d=>d.kind==='businessDesign');
const binding={'bd-score-example/calculate-score':{id:'score-system',evidence:'合成例の単一自動主体'}};

test('regeneration preserves authored conceptual names and rejects incomplete names',()=>{
 const temp=mkdtempSync(join(tmpdir(),'alder-concept-names-'));
 try{
  const folder=(path)=>mkdirSync(join(temp,path),{recursive:true});folder('tools');folder('work/normalization-candidate');folder('business-design/alder');
  cpSync(new URL('../../tools/document_storage',import.meta.url),join(temp,'tools/document_storage'),{recursive:true});
  for(const name of ['create-review.mjs','normalize.mjs'])cpSync(new URL('./'+name,import.meta.url),join(temp,'work/normalization-candidate',name));
  for(const name of ['json-structure-review.json','json-normalized-model-review.json'])cpSync(new URL('../../business-design/alder/'+name,import.meta.url),join(temp,'business-design/alder',name));
  const path=join(temp,'business-design/alder/json-normalized-model-review.json'),initial=readFileSync(path),candidate=JSON.parse(initial);
  const run=()=>spawnSync(process.execPath,[join(temp,'work/normalization-candidate/create-review.mjs')],{encoding:'utf8'});
  let result=run();assert.equal(result.status,0,result.stderr);assert.deepEqual(readFileSync(path),initial,'regeneration without edits preserves the entire model');
  const model=candidate.documents.find(d=>d.kind==='conceptModel');model.meta.relationNames['nr-exchange-pair']='人が記録した対応手順';
  model.meta.conceptNames['n-who']={typeName:'Actor',logicalName:'担当主体'};
  writeFileSync(path,JSON.stringify(candidate,null,2)+'\n');
  result=run();assert.equal(result.status,0,result.stderr);
  let after=JSON.parse(readFileSync(path,'utf8'));const regenerated=after.documents.find(d=>d.kind==='conceptModel');
  assert.deepEqual(regenerated.meta.relationNames,model.meta.relationNames,'regeneration reads relation names from the authored model');
  assert.deepEqual(regenerated.meta.conceptNames,model.meta.conceptNames,'regeneration reads type and logical names from the authored model');
  assert.equal(regenerated.concepts.find(c=>c.id==='n-who').name,'担当主体（Actor）','legacy diagram labels are derived from the authored names');
  assert.equal(regenerated.presentation.subsystemViews.nodes.find(n=>n.conceptId==='n-who').name,'担当主体（Actor）','the overview label stays synchronized');
  delete model.meta.conceptNames['n-who'];writeFileSync(path,JSON.stringify(candidate,null,2)+'\n');let before=readFileSync(path);
  rmSync(join(temp,'work/normalization-candidate/example-source.json'));rmSync(join(temp,'work/normalization-candidate/example-normalized.json'));
  result=run();assert.notEqual(result.status,0);assert.match(result.stderr,/type and logical names do not match/);assert.deepEqual(readFileSync(path),before,'missing conceptual type names do not overwrite the source model');
  assert(!existsSync(join(temp,'work/normalization-candidate/example-source.json'))&&!existsSync(join(temp,'work/normalization-candidate/example-normalized.json')),'a failed regeneration writes no examples');
  model.meta.conceptNames['n-who']={typeName:'Actor',logicalName:'担当主体'};delete model.meta.relationNames['nr-exchange-pair'];writeFileSync(path,JSON.stringify(candidate,null,2)+'\n');before=readFileSync(path);
  result=run();assert.notEqual(result.status,0);assert.match(result.stderr,/relation names do not match/);assert.deepEqual(readFileSync(path),before,'incomplete names do not overwrite the source model');
  assert(!existsSync(join(temp,'work/normalization-candidate/example-source.json'))&&!existsSync(join(temp,'work/normalization-candidate/example-normalized.json')),'a failed regeneration writes no examples');
 }finally{rmSync(temp,{recursive:true,force:true});}
});

test('acceptance is fixed before the implementation and all guarantees are present',()=>{
 assert.equal(createHash('sha256').update(acceptance).digest('hex'),acceptanceHash);
 assert.deepEqual(JSON.parse(acceptance).checks.map(x=>x.id),['NORM-01','NORM-02','NORM-03','NORM-04','NORM-05']);
});
test('NORM-03: the 0.7 decision example restores the entire source, including Check state and order',()=>{
 const before=readFileSync(inputPath);const result=normalizePackage(source,binding);
 assert.deepEqual(restorePackage(result),source);assert.deepEqual(readFileSync(inputPath),before);
 assert.equal(result.entities.conditions.length,14);assert.equal(result.entities.rowChecks.length,6);
 assert.deepEqual(result.documents.map(x=>x.document),source.documents.filter(d=>d.kind!=='businessDesign'));
 assert(!Object.hasOwn(result.entities.activities[0],'who'));assert(!Object.hasOwn(result.entities.steps[0],'exchange'));
 assert.deepEqual(result.entities.actors,[{id:'score-system',documentId:'bd-score-example',kind:'system',name:'点数計算機能'}]);
});
test('NORM-03: existing human review state remains attached to the original Check document',()=>{
 const p=copy(),check=p.documents.find(d=>d.kind==='checkItems').items[0];check.reviewState='確認済み';
 validate(p);const n=normalizePackage(p,binding),out=restorePackage(n);
 assert.equal(out.documents.find(d=>d.kind==='checkItems').items[0].reviewState,'確認済み');assert.deepEqual(out,p);
});
test('NORM-02: automatic identities need explicit evidence and cannot be silently merged',()=>{
 assert.throws(()=>normalizePackage(copy()),/Explicit automatic Who identity/);
 assert.throws(()=>normalizePackage(copy(),{'bd-score-example/calculate-score':{id:'score-system',evidence:''}}),/Explicit automatic Who identity/);
 assert.throws(()=>normalizePackage(copy(),{'bd-score-example/calculate-score':{id:'throws',evidence:'仮'}}),/conflicts with source/);
 assert.throws(()=>normalizePackage(copy(),{...binding,'bd-score-example/no-such-activity':{id:'x',evidence:'仮'}}),/Binding does not correspond/);
});
function plainActivity(id,name,who){return {id,name,scope:true,why:'例',when:'開始時',where:'規定なし',who,
 procedure:{steps:[{id:id+'-step',action:'確認する',method:null,whatDataIds:[],obligation:'required',appliesWhen:null,effect:null,exchange:{kind:'internal'},decisionIds:[],whenDecision:null}],orderRules:[]},
 decisions:[],results:[{id:id+'-result',text:'確認した'}],problem:null,painLevel:null};}
function whoFixture(){const p=copy(),d=bd(p);d.roles=[{id:'worker',name:'作業者',color:'#8b5cf6'},{id:'other-role',name:'確認者',color:'#2563eb'},{id:'unused-role',name:'未使用',color:'#c2410c'}];
 d.activities.push(plainActivity('task-one','業務1',{kind:'role',roleId:'worker'}),plainActivity('task-two','業務2',{kind:'role',roleId:'worker'}),
  plainActivity('task-other','業務3',{kind:'role',roleId:'other-role'}),plainActivity('task-unknown','業務4',null),
  plainActivity('auto-two','自動業務',{kind:'system',name:'点数計算機能'}),plainActivity('batch','定刻業務',{kind:'scheduler',name:'定刻バッチ'}));
 validate(p);return p;}
test('NORM-01/02: one Who can serve multiple Activities, an unused Role survives, and null has no actor',()=>{
 const p=whoFixture(),b={...binding,'bd-score-example/auto-two':{id:'score-system',evidence:'合成例で同じ主体と明示'},'bd-score-example/batch':{id:'batch-system',evidence:'合成例の別主体'}};
 const n=normalizePackage(p,b),a=n.entities.activities;
 assert.equal(a.find(x=>x.id==='task-one').whoId,'worker');assert.equal(a.find(x=>x.id==='task-two').whoId,'worker');
 assert.equal(a.find(x=>x.id==='task-other').whoId,'other-role');assert.equal(a.find(x=>x.id==='task-unknown').whoId,null);
 assert(!n.entities.actors.some(x=>x.name==='未決'));assert(n.entities.actors.some(x=>x.id==='unused-role'));
 assert.equal(a.find(x=>x.id==='auto-two').whoId,a.find(x=>x.id==='calculate-score').whoId);
 assert.equal(a.find(x=>x.id==='batch').whoId,'batch-system');assert.deepEqual(restorePackage(n),p);
 const separate=normalizePackage(p,{...b,'bd-score-example/auto-two':{id:'other-system',evidence:'合成例で別主体と明示'}});
 assert.notEqual(separate.entities.activities.find(x=>x.id==='auto-two').whoId,separate.entities.activities.find(x=>x.id==='calculate-score').whoId);
 const changed=structuredClone(p);bd(changed).activities.find(x=>x.id==='auto-two').who.name='別のシステム';
 assert.throws(()=>normalizePackage(changed,b),/binding conflicts/);
});
test('NORM-03: prerequisites, optional parties, nullable arrays, old ordering and continuity survive',()=>{
 const p=copy(),d=bd(p),a=d.activities[0],s=a.procedure.steps;
 s[0].dependsOn=null;s[0].parties={from:null,to:{kind:'who'}};s[1].dependsOn=[];
 s[2].dependsOn=[{stepId:'validate',whenDecision:null}];s[3].whatDataIds=null;s[3].exchange.dataIds=null;
 a.procedure.orderRules=[{kind:'before',beforeId:'receive',afterId:'validate'},{kind:'interchangeable',stepIds:['receive','reply']}];
 d.exceptions[0].continuity={trigger:'入力エラー',onInterrupt:'中断する',outcome:'resume',resumeCondition:'入力を直した',resumeAction:'再開する',interruptedAtStepId:'validate',resumeAtStepId:'calculate',retainedDataIds:[]};
 d.findings.push({id:'question-example',sourceId:'source-example',kind:'question',status:'open',scope:'items',targetIds:['calculate-score'],unresolvedTargets:['不明な対象'],summary:'確認',content:'確認する'});
 const opts={allowUnresolvedFindings:true};validateShape(p);validateReferences(p,opts);assert.throws(()=>validate(p),/Unresolved Finding/);
 assert.throws(()=>normalizePackage(p,binding),/Unresolved Finding/);const n=normalizePackage(p,binding,opts);assert.deepEqual(restorePackage(n,opts),p);
 const byId=Object.fromEntries(n.entities.steps.map(x=>[x.id,x]));
 assert.equal(byId.receive.dependencyState,'null');assert.equal(byId.validate.dependencyState,'array');assert.equal(byId.reply.dependencyState,'absent');
 assert.equal(byId['pass-scores'].targetDataState,'null');assert.equal(n.entities.stepInteractions.find(x=>x.stepId==='pass-scores').dataState,'null');
 assert.deepEqual(n.entities.dependencies.map(x=>x.prerequisiteStepId),['validate']);
 assert.equal(n.entities.orderRuleSteps.length,2);assert.equal(n.entities.continuities.length,1);assert.equal(n.entities.findingUnresolved[0].text,'不明な対象');
});
test('NORM-01/03: missing Who, orphan rows, duplicates and order corruption are rejected',()=>{
 const baseline=normalizePackage(whoFixture(),{...binding,'bd-score-example/auto-two':{id:'score-system',evidence:'同じ'},'bd-score-example/batch':{id:'batch-system',evidence:'別'}});
 const bad=fn=>{const n=structuredClone(baseline);fn(n.entities);assert.throws(()=>restorePackage(n));};
 bad(e=>{e.activities.find(a=>a.id==='task-one').whoId='missing';});
 bad(e=>{e.actors.find(a=>a.id==='worker').kind='person';});
 bad(e=>{e.stepTargetData.push({stepId:'missing',dataId:'throws',ordinal:0});});
 bad(e=>{e.activities.push(structuredClone(e.activities[0]));});
 bad(e=>{e.steps[1].ordinal=e.steps[0].ordinal;});
 bad(e=>{e.actors.find(a=>a.id==='worker').unexpected='must not disappear';});
 bad(e=>{e.stepTargetData[0].unexpected='must not disappear';});
 bad(e=>{e.rows.find(r=>r.id==='valid').resultKind='undecided';e.conditions.find(c=>c.rowId==='valid').axisId='missing';});
 bad(e=>{e.stepInteractions.find(x=>x.stepId==='receive').direction='output';});
});
test('NORM-03: table row order is not confused with recorded business order',()=>{
 const n=normalizePackage(copy(),binding);for(const rows of Object.values(n.entities))rows.reverse();
 assert.deepEqual(restorePackage(n),source);
});
test('NORM-01/03: several Business Designs keep their own Actors and reject cross-document references',()=>{
 const p=copy();p.documents.push({id:'other-bd',schemaVersion:'0.6',kind:'businessDesign',revision:'other-bd-1',title:'別業務',preface:'',scope:'',
  objects:[],roles:[{id:'other-worker',name:'別の作業者',color:'#be185d'}],activities:[plainActivity('other-task','別業務の確認',{kind:'role',roleId:'other-worker'})],exceptions:[],data:[],relations:[],findings:[]});
 validate(p);const n=normalizePackage(p,binding);assert.deepEqual(restorePackage(n),p);
 n.entities.activities.find(a=>a.id==='other-task').whoId='score-system';assert.throws(()=>restorePackage(n),/Missing or cross-document Who/);
});

