import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,existsSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {validate} from './core.mjs';
import {fingerprint,guardAuthoring,meaningHash} from './authoring.mjs';
import {prepareDecisionUpgrade} from './prepare-decisions.mjs';

const text=readFileSync(new URL('./examples/molkky-decisions-v07.json',import.meta.url),'utf8'),base=JSON.parse(text),clone=()=>structuredClone(base);
const bd=x=>x.documents.find(doc=>doc.kind==='businessDesign'),checks=x=>x.documents.find(doc=>doc.kind==='checkItems');
const activity=x=>bd(x).activities[0],decision=(x,i=0)=>activity(x).decisions[i],step=(x,i)=>activity(x).procedure.steps[i];
const rejected=mutate=>{const x=clone();mutate(x);assert.throws(()=>validate(x));};

test('structured business decisions, checks and graph direction validate without modifying source',()=>{
 const before=JSON.stringify(base);assert.doesNotThrow(()=>validate(base));assert.equal(JSON.stringify(base),before);assert.equal(checks(base).items.every(item=>item.reviewState==='未レビュー'),true);
 assert.equal(JSON.parse(text).formatVersion,'0.7');
 rejected(x=>{x.formatVersion='0.8';});rejected(x=>{bd(x).schemaVersion='0.5';});
});
test('decisions, row dependencies, Check and Data references must be explicit',()=>{
 rejected(x=>{step(x,1).decisionIds=['missing'];});
 rejected(x=>{step(x,2).whenDecision.rowId='missing';});
 rejected(x=>{decision(x).rows[0].conditions[0].axisId='missing';});
 rejected(x=>{decision(x).rows[0].conditions.pop();});
 rejected(x=>{decision(x).rows[0].conditions[0]={axisId:'axis-numbers',kind:'else'};});
 rejected(x=>{decision(x).rows[0].conditions[0]={axisId:'axis-numbers',kind:'undecided'};});
 rejected(x=>{decision(x).rows[0].conditions[0]={axisId:'axis-numbers',kind:'value',operator:'gte',value:'1'};});
 rejected(x=>{decision(x).rows[0].result.dataIds=['missing'];});
 rejected(x=>{decision(x).rows[1].result.exceptionIds=['missing'];});
 rejected(x=>{decision(x).rows[1].checkRefs[0].checkId='missing';});
 rejected(x=>{checks(x).index[0].checkIds=checks(x).index[0].checkIds.filter(id=>id!=='check-04');});
 rejected(x=>{decision(x,1).appliesWhen={decisionId:'score-algorithm',rowId:'zero-pins'};});
 rejected(x=>{decision(x).appliesWhen={decisionId:'score-algorithm',rowId:'zero-pins'};});
 rejected(x=>{step(x,0).exchange.relationId='rel-output';});
 rejected(x=>{step(x,4).exchange.phase='request';});
});
test('ordered else uses its own outer branch, independently of JSON key order',()=>{
 const x=clone();decision(x).rows[1].conditions[0]={value:'1〜12の整数',operator:'is',kind:'value',axisId:'axis-numbers'};assert.doesNotThrow(()=>validate(x));
 const y=clone();decision(y).rows[1].conditions[0].value='別の範囲';assert.throws(()=>validate(y),/Else needs an earlier branch/);
});
test('business changes require new review for linked confirmed checks, not unrelated checks',()=>{
 const prior=clone();for(const item of checks(prior).items)item.reviewState='確認済み';const next=structuredClone(prior);
 next.revision='changed-package';bd(next).revision='changed-business';checks(next).revision='changed-checks';checks(next).basedOn.revision=bd(next).revision;decision(next,1).rows[0].result.text='別の点数';
 const oldItem=checks(prior).items[0],newItem=checks(next).items[0];assert.notEqual(meaningHash(prior,oldItem),meaningHash(next,newItem));
 assert.equal(meaningHash(prior,checks(prior).items[3]),meaningHash(next,checks(next).items[3]));
 const operation={expectedRevision:prior.revision,bdConfirmations:[{documentId:bd(next).id,revision:bd(next).revision,evidence:{source:'test',quote:'test'}}]};
 assert.throws(()=>guardAuthoring(prior,next,operation),/renewed human review/);
 for(const item of checks(next).items.filter(item=>['check-01','check-02','check-03','check-10'].includes(item.id)))item.reviewState='要確認';
 assert.equal(guardAuthoring(prior,next,operation).valid,true);assert.equal(checks(prior).items.every(item=>item.reviewState==='確認済み'),true);
});
function oldPackage(){const p=clone();p.formatVersion='0.6';bd(p).schemaVersion='0.5';for(const a of bd(p).activities){delete a.decisions;for(const s of a.procedure.steps){delete s.decisionIds;delete s.whenDecision;}}for(const item of checks(p).items)item.fields={guarantee:[{kind:'text',value:'既存の保証'}]};return p;}
test('0.6 to 0.7 preparation keeps the original and separates dependent human review',()=>{
 const source=oldPackage(),sourceText=JSON.stringify(source);validate(source);const original=structuredClone(source),request={expectedSha256:fingerprint(sourceText),expectedRevision:source.revision,revision:'new-package',businessRevisions:{[bd(source).id]:'new-business'}};
 const {next,report}=prepareDecisionUpgrade(source,request);assert.deepEqual(source,original);assert.equal(next.formatVersion,'0.7');assert.equal(next.documents.length,1);assert.equal(report.dependenciesRetainedInSource[0].id,checks(source).id);assert.deepEqual(activity(next).procedure.steps.map(({decisionIds,whenDecision,...step})=>step),activity(source).procedure.steps);assert.deepEqual(activity(next).decisions,[]);validate(next);
 assert.throws(()=>prepareDecisionUpgrade(source,{...request,expectedRevision:'stale'}));assert.throws(()=>prepareDecisionUpgrade(source,{...request,businessRevisions:{}}));
});
test('migration CLI is create-only, checks source bytes and leaves original unchanged',()=>{
 const dir=mkdtempSync(path.join(tmpdir(),'alder-decisions-'));try{
  const source=oldPackage(),sourceText=JSON.stringify(source),src=path.join(dir,'source.json'),out=path.join(dir,'out.json'),req=path.join(dir,'request.json');writeFileSync(src,sourceText);
  const request={expectedSha256:fingerprint(sourceText),expectedRevision:source.revision,revision:'new-package',businessRevisions:{[bd(source).id]:'new-business'}};writeFileSync(req,JSON.stringify({...request,expectedSha256:'0'.repeat(64)}));
  const run=()=>spawnSync(process.execPath,[new URL('./author-cli.mjs',import.meta.url).pathname,'prepare-decision-upgrade',src,out,req],{encoding:'utf8'});
  assert.notEqual(run().status,0);assert.equal(existsSync(out),false);writeFileSync(req,JSON.stringify(request));const result=run();assert.equal(result.status,0,result.stderr);const candidate=readFileSync(out,'utf8');assert.notEqual(run().status,0);assert.equal(readFileSync(out,'utf8'),candidate);assert.equal(readFileSync(src,'utf8'),sourceText);assert.doesNotThrow(()=>validate(JSON.parse(candidate)));
 }finally{rmSync(dir,{recursive:true,force:true});}
});
test('0.7 Business Design and unreviewed Check drafts can be saved together without pretending approval',()=>{
 const dir=mkdtempSync(path.join(tmpdir(),'alder-decision-save-'));try{
  const candidate=clone();assert.equal(checks(candidate).items.every(item=>item.reviewState==='未レビュー'),true);
  const file=path.join(dir,'candidate.json'),out=path.join(dir,'out.json'),op=path.join(dir,'operation.json');writeFileSync(file,JSON.stringify(candidate));writeFileSync(op,'{}');
  const run=()=>spawnSync(process.execPath,[new URL('./author-cli.mjs',import.meta.url).pathname,'create',file,out,op],{encoding:'utf8'});
  const first=run();assert.equal(first.status,0,first.stderr);const saved=readFileSync(out,'utf8');assert.deepEqual(JSON.parse(saved),candidate);assert.equal(checks(JSON.parse(saved)).items.every(item=>item.reviewState==='未レビュー'),true);assert.notEqual(run().status,0);assert.equal(readFileSync(out,'utf8'),saved);
  const approved=clone();checks(approved).items[0].reviewState='確認済み';writeFileSync(file,JSON.stringify(approved));const reject=spawnSync(process.execPath,[new URL('./author-cli.mjs',import.meta.url).pathname,'create',file,path.join(dir,'approved.json'),op],{encoding:'utf8'});assert.notEqual(reject.status,0);assert.equal(existsSync(path.join(dir,'approved.json')),false);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
