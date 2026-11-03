import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {validate,inventory,graphV1} from './core.mjs';
import {guardAuthoring,fingerprint,packageVersionPolicy} from './authoring.mjs';
import {prepareProcedureUpgrade} from './prepare-procedure.mjs';
import {projectProcedure} from './procedure-structure.mjs';

const read=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),'utf8'));
const example=read('./examples/paper-note-v06.json');
const oldCases=read('./examples/d2-cases-legacy.json');
const oldCase=(caseId='mixed')=>{const d=structuredClone(oldCases.find(c=>c.caseId===caseId).candidate.business);for(const a of d.activities)a.results=a.results.map(r=>({id:r.id,text:r.condition?r.condition+'、'+r.text:r.text}));return {format:'alder-document-package',formatVersion:'0.5',revision:'old-05-example',documents:[d],sources:[],externalDocuments:[],diagnostics:[]};};
const copy=()=>structuredClone(example),bd=p=>p.documents[0],activity=p=>bd(p).activities[0],step=(p,id)=>activity(p).procedure.steps.find(s=>s.id===id);
const bad=fn=>{const p=copy();fn(p);assert.throws(()=>validate(p));};

test('SP-001/013: legacy 0.4 and old 0.5 are read under their own versions without changing bytes',()=>{
 const current=read('../../work/viewer-json/issue-274/json-native/independent.json'),old=oldCase();
 for(const pkg of [current,old,example]){const before=JSON.stringify(pkg);validate(pkg);assert.equal(JSON.stringify(pkg),before);}
 assert.equal(packageVersionPolicy(old).editable,false);assert.equal(packageVersionPolicy(example).conversion,'candidate-not-yet-editable');
 const wrong=structuredClone(old);wrong.formatVersion='0.6';assert.throws(()=>validate(wrong));
 const unknown=copy();unknown.formatVersion='0.7';assert.throws(()=>validate(unknown));
 assert.throws(()=>graphV1(old,bd(old).id),/structured Business Design/);
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'alder-old05-'));try{const file=path.join(dir,'old.json'),bytes=JSON.stringify(old);fs.writeFileSync(file,bytes);const result=spawnSync(process.execPath,[new URL('./author-cli.mjs',import.meta.url).pathname,'inspect',file],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);assert.equal(JSON.parse(result.stdout).compatibility.editable,false);assert.equal(fs.readFileSync(file,'utf8'),bytes);}finally{fs.rmSync(dir,{recursive:true,force:true});}
});

test('SP-002: Who is one Role, system, scheduler or explicitly unresolved',()=>{
 for(const who of [{kind:'role',roleId:'worker'},{kind:'system',name:'業務システム'},{kind:'scheduler',name:'定刻バッチ'},null]){const p=copy();activity(p).who=who;const result=validate(p);if(who===null)assert.ok(result.diagnostics.includes('Who未確定: copy'));}
 bad(p=>{activity(p).who=[{kind:'role',roleId:'worker'}];});bad(p=>{activity(p).who={kind:'role',roleId:'missing'};});
});

test('SP-003/004: reading method stays in the Step, and Scope remains undecided until context is known',()=>{
 const p=copy(),unresolved=validate(p);assert.ok(unresolved.diagnostics.includes('Scope未確定: paper'));
 const ocr=copy();bd(ocr).objects[0].scope=true;step(ocr,'read').method='対象システムのOCR';validate(ocr);
 const manual=copy();bd(manual).objects[0].scope=false;step(manual,'read').method='目視';validate(manual);
 assert.equal(projectProcedure(bd(ocr)).rows[0].method,'対象システムのOCR');assert.equal(projectProcedure(bd(manual)).rows[0].method,'目視');
 assert.deepEqual(projectProcedure(bd(ocr)).edges,projectProcedure(bd(manual)).edges);
 const unchanged=copy();assert.equal(bd(unchanged).objects[0].scope,null);assert.equal(step(unchanged,'read').method,null);
 step(unchanged,'read').method='対象システムのOCR';assert.ok(validate(unchanged).diagnostics.includes('Scope未確定: paper'));assert.equal(bd(unchanged).objects[0].scope,null);
 bad(p=>{bd(p).objects[0].scope='false';});
});

test('SP-004/009: Step identity, required/optional, condition, local ordering and multiple Results are retained',()=>{
 const p=copy();activity(p).when='新規依頼または変更連絡が届いたとき';step(p,'read').appliesWhen='新規依頼のとき';step(p,'write').obligation='optional';step(p,'write').appliesWhen='転記が必要な場合';activity(p).procedure.orderRules=[{kind:'before',beforeId:'read',afterId:'write'}];activity(p).results.push({id:'result-extra',text:'必要なら記録を残す'});validate(p);
 assert.equal(activity(p).when,'新規依頼または変更連絡が届いたとき');assert.equal(step(p,'read-response').appliesWhen,null);
 assert.deepEqual(projectProcedure(bd(p)).rows.find(r=>r.stepId==='write').appliesWhen,'転記が必要な場合');assert.equal(activity(p).results.length,2);
 bad(p=>{activity(p).procedure.orderRules=[{kind:'before',beforeId:'write',afterId:'read'}];});
 bad(p=>{activity(p).procedure.orderRules=[{kind:'before',beforeId:'read',afterId:'missing'}];});
 bad(p=>{activity(p).procedure.orderRules=[{kind:'before',beforeId:'read',afterId:'read'}];});
 bad(p=>{activity(p).procedure.orderRules=[{kind:'before',beforeId:'read',afterId:'write'},{kind:'interchangeable',stepIds:['read','write']}];});
 bad(p=>{activity(p).procedure.steps[1].id='read';});bad(p=>{activity(p).results=[];});
});

test('SP-005/010: paper content is one shared Data even when it is sent to the memo',()=>{
 validate(example);const d=bd(example),readRow=step(example,'read-response').exchange,writeRow=step(example,'write').exchange;
 assert.deepEqual(readRow.dataIds,['content']);assert.deepEqual(writeRow.dataIds,['content']);
 assert.equal(d.data.find(x=>x.id==='content').items[0].informationId,'paper-content');assert.equal(inventory(example).parent.get('paper-content'),'paper');
 const rows=projectProcedure(d).rows;assert.deepEqual(rows.find(x=>x.stepId==='read-response').from,{kind:'object',objectId:'paper'});assert.deepEqual(rows.find(x=>x.stepId==='write').from,{kind:'who',activityId:'copy'});assert.equal(rows.find(x=>x.stepId==='write').pairedStepId,'write-response');
 const edges=projectProcedure(d).edges;assert.equal(edges.find(e=>e.objectId==='paper'&&e.direction==='input').label,'記載内容');assert.equal(edges.find(e=>e.objectId==='memo'&&e.direction==='output').label,'記載内容');
 const request=rows.find(x=>x.stepId==='read');assert.equal(request.action,'読み取る');assert.deepEqual(request.data,[{id:'content',name:'記載内容',uses:['target']}]);
 const outgoing=edges.find(e=>e.objectId==='paper'&&e.direction==='output');assert.equal(outgoing.transferUndecided,true);assert.equal(outgoing.data.length,0);assert.equal(outgoing.label,'');
 bad(p=>{step(p,'write').exchange.dataIds=['missing'];});bad(p=>{bd(p).data[0].items[0].informationId='missing';});bad(p=>{step(p,'write').exchange.objectId='worker';});
 bad(p=>{step(p,'write').exchange.dataIds=['content','content'];});bad(p=>{step(p,'read').whatDataIds=['missing'];});bad(p=>{step(p,'read').whatDataIds=['content','content'];});
});

test('SP-006: Steps summarize into one edge per Activity/Object/direction while their IDs and existing Relation IDs remain distinct',()=>{
 const p=copy(),again=structuredClone(step(p,'write'));again.id='write-again';again.exchange.pairedStepId=null;again.exchange.relationId='memo-output-2';
 activity(p).procedure.steps.push(again);bd(p).relations.push({id:'memo-output-2',kind:'output',fromId:'copy',toId:'memo'});validate(p);
 const edges=projectProcedure(bd(p)).edges,write=edges.filter(e=>e.objectId==='memo'&&e.direction==='output');assert.equal(write.length,1);
 assert.deepEqual(write[0].stepIds,['write','write-again']);assert.deepEqual(write[0].relationIds,['memo-output','memo-output-2']);assert.deepEqual(write[0].data,[{id:'content',name:'記載内容'}]);
 assert.equal(edges.filter(e=>e.objectId==='memo'&&e.direction==='input').length,1);
 const other=structuredClone(activity(p));other.id='another';other.name='別の転記';other.results=[{id:'other-result',text:'結果'}];other.procedure={steps:[{...again,id:'other-step',exchange:{...again.exchange,relationId:null}}],orderRules:[]};bd(p).activities.push(other);validate(p);
 assert.equal(projectProcedure(bd(p)).edges.filter(e=>e.objectId==='memo'&&e.direction==='output').length,2);
});

test('SP-007: explicit pairing and relation mismatches reject without equating phase with direction',()=>{
 const p=copy();assert.equal(step(p,'read').exchange.phase,'request');assert.equal(step(p,'read').exchange.direction,'output');validate(p);
 const q=copy();step(q,'read').exchange.phase='response';step(q,'read-response').exchange.phase='request';validate(q);
 bad(p=>{step(p,'write').exchange.relationId='paper-output';});
 bad(p=>{step(p,'write').exchange.direction='input';});
 bad(p=>{step(p,'write-response').exchange.phase='request';});
 bad(p=>{step(p,'write-response').exchange.objectId='paper';});
 bad(p=>{step(p,'write').exchange.pairedStepId='missing';});
});

test('SP-008: internal judgement, unresolved exchange and no response are distinct',()=>{
 const p=copy();activity(p).procedure.steps.push({id:'judge',action:'判断する',method:null,whatDataIds:['content'],obligation:'required',appliesWhen:null,effect:'not-applicable',exchange:{kind:'internal'}});validate(p);
 const row=projectProcedure(bd(p)).rows.find(x=>x.stepId==='judge');assert.equal(row.to,null);assert.deepEqual(row.data,[{id:'content',name:'記載内容',uses:['target']}]);
 const q=copy();step(q,'read').exchange={kind:'unresolved'};step(q,'read-response').exchange.pairedStepId=null;assert.ok(validate(q).diagnostics.includes('やり取り未確定: read'));
 const r=copy();activity(r).procedure.steps=activity(r).procedure.steps.filter(s=>s.id!=='write-response');step(r,'write').exchange.pairedStepId=null;validate(r);assert.ok(!projectProcedure(bd(r)).rows.some(x=>x.stepId==='write-response'));
 const partial=copy();step(partial,'read').exchange.phase=null;step(partial,'read').exchange.pairedStepId=null;step(partial,'read-response').exchange.pairedStepId=null;
 assert.ok(validate(partial).diagnostics.includes('Request/Response未確定: read'));
 const partialRow=projectProcedure(bd(partial)).rows.find(x=>x.stepId==='read');assert.deepEqual(partialRow.to,{kind:'object',objectId:'paper'});assert.equal(partialRow.direction,'output');assert.equal(partialRow.phase,null);assert.equal(partialRow.data[0].id,'content');
 const falsePair=copy();step(falsePair,'read').exchange.phase=null;assert.throws(()=>validate(falsePair),/Request\/Response mismatch/);
 const noPayload=copy();step(noPayload,'read').exchange.dataIds=[];assert.ok(!validate(noPayload).diagnostics.includes('Data未確定: read'));
});

test('SP-003/004/005/008: business examples retain their meaning in a structured procedure',()=>{
 const p=read('./examples/procedure-cases-v06.json'),d=bd(p),diagnostics=validate(p).diagnostics,view=projectProcedure(d),rows=new Map(view.rows.map(r=>[r.stepId,r]));
 assert.equal(rows.get('search').action,'検索する');assert.equal(rows.get('search').effect,'read');assert.equal(rows.get('search-result').data[0].name,'検索結果');
 assert.equal(rows.get('ask').action,'確認する');assert.deepEqual(rows.get('ask').to,{kind:'object',objectId:'customer'});assert.equal(d.objects.find(o=>o.id==='customer').scope,false);
 assert.equal(rows.get('answer-step').data[0].name,'顧客回答');assert.equal(rows.get('save').data[0].name,'顧客回答');assert.equal(rows.get('save').effect,'create');
 assert.equal(rows.get('apply').action,'承認を依頼する');assert.equal(rows.get('decide').data[0].name,'承認結果');assert.equal(rows.get('decide').pairedStepId,'apply');
 assert.equal(rows.get('notify').action,'通知する');assert.equal(rows.get('notify').method,'人が直接やり取りする');assert.equal(d.objects.find(o=>o.id==='approver').scope,false);assert.equal(rows.get('notify').phase,null);assert.equal(rows.get('notify').pairedStepId,null);assert.ok(diagnostics.includes('Request/Response未確定: notify'));
 assert.equal(rows.get('judge').to,null);assert.equal(rows.get('wait-record').appliesWhen,'期限までに顧客回答がない場合');assert.equal(d.exceptions[0].description,'期限までに顧客回答がない場合は確認待ちとして記録する。');
 assert.equal(d.activities[0].results.length,2);assert.deepEqual(d.activities[1].who,{kind:'scheduler',name:'定刻バッチ'});assert.equal(d.activities[1].when,'定刻');
 assert.equal(rows.get('auto-read').effect,'read');assert.equal(rows.get('auto-read').dataIds,null);assert.ok(diagnostics.includes('Data未確定: auto-read'));
 const broken=structuredClone(p);bd(broken).activities[0].procedure.steps.find(s=>s.id==='save').whatDataIds=['missing'];assert.throws(()=>validate(broken));
});

test('SP-010/013: the old 0.5 owner constraint remains on the historical version',()=>{
 const old=oldCase('molkkyCross'),d=bd(old),r=d.relations.find(r=>['input','output'].includes(r.kind)),target=r.kind==='input'?r.fromId:r.toId;
 const other=d.objects.find(o=>o.id!==target&&o.information.length);assert.ok(other,'fixture has Information owned by another Object');
 const data=d.data.find(x=>x.id===r.dataId);data.items[0].informationId=other.information[0].id;assert.throws(()=>validate(old),/owner mismatch/i);
});

function old04Fixture(){
 const source=copy(),d=bd(source),a=d.activities[0];
 const oldActivity={id:a.id,name:a.name,scope:true,why:a.why,when:a.when,who:'作業者',where:a.where,procedure:'紙を読み、メモへ書く',exception:null,result:a.results[0].text,problem:null,painLevel:null,roleId:'worker'};
 const oldBD={id:d.id,schemaVersion:'0.3',kind:'businessDesign',revision:'legacy-bd',title:d.title,preface:d.preface,scope:d.scope,
  objects:d.objects.map((o,i)=>({...o,scope:i===0?false:true,information:o.information.map(info=>info.name)})),roles:d.roles,activities:[oldActivity],
  relations:d.relations.map(r=>({...r,label:r.id})),exceptions:[],findings:[]};
 const checks={id:'legacy-checks',schemaVersion:'0.1',kind:'checkItems',revision:'checks-1',title:'既存Check',basedOn:{documentId:oldBD.id,revision:oldBD.revision,verification:'unverified'},intro:[],index:[{activityId:'copy',purpose:'',connections:'',checkIds:['check-one']}],sections:[{id:'section-one',activityId:'copy',title:'確認',preamble:[]}],guarantees:[],examples:[],items:[{id:'check-one',checkId:'C-01',title:'記載確認',detailSummary:'',sectionId:'section-one',reviewState:'確認済み',fields:{guarantee:[{kind:'text',value:'記載内容を保持する'}]}}],notes:[]};
 return {format:'alder-document-package',formatVersion:'0.4',revision:'legacy-package',documents:[oldBD,checks],sources:[],externalDocuments:[],diagnostics:[]};
}

// A synthetic legacy 0.5 source. The separate candidate below is authored for
// the test; the product migration does not infer it from old performers.
function old05Fixture(){
 const candidate=copy(),d=bd(candidate),a=activity(candidate);candidate.revision='candidate-05';d.revision='candidate-bd-05';
 d.objects[0].information.push({id:'paper-request-info',name:'読取依頼',description:''});
 d.objects[1].information.push({id:'memo-content-info',name:'メモの記載内容',description:''});
 d.objects.push({id:'old-worker',name:'旧担当Object',scope:null,icon:'user',information:[]});
 d.data.push({id:'read-request-data',name:'読取依頼',items:[{informationId:'paper-request-info',condition:null}]});
 d.data.push({id:'memo-content-data',name:'メモの記載内容',items:[{informationId:'memo-content-info',condition:null}]});
 step(candidate,'read').exchange.dataIds=['read-request-data'];step(candidate,'write').exchange.dataIds=['memo-content-data'];a.who=null;
 const originalText={read:'紙の記載内容を読み取る','read-response':'紙から記載内容を受け取る',write:'記載内容をメモに書く','write-response':'メモの記載成功を受け取る'};
 for(const s of a.procedure.steps)s.legacyText=originalText[s.id];
 const oldActivity={id:a.id,name:a.name,scope:true,why:a.why,when:a.when,where:a.where,problem:a.problem,painLevel:a.painLevel,
  performers:[{objectId:'old-worker',roleIds:['worker']}],procedure:{steps:a.procedure.steps.map(s=>({id:s.id,text:s.legacyText,obligation:s.obligation,appliesWhen:s.appliesWhen,performerObjectIds:['old-worker']})),orderRules:a.procedure.orderRules},results:a.results};
 const relationData={'paper-output':'read-request-data','paper-input':'content','memo-output':'memo-content-data','memo-input':'success'};
 const oldBD={...structuredClone(d),schemaVersion:'0.4',revision:'legacy-bd-05',objects:d.objects.map(o=>({...o,scope:false})),activities:[oldActivity],relations:d.relations.map(r=>({...r,dataId:relationData[r.id]}))};
 const old={format:'alder-document-package',formatVersion:'0.5',revision:'legacy-package-05',documents:[oldBD],sources:[],externalDocuments:[],diagnostics:[]};
 return {old,candidate};
}

test('SP-011: explicit candidate preparation preserves legacy bytes, IDs, human state and unresolved Scope',()=>{
 const old=old04Fixture(),p=copy(),source=JSON.stringify(old),request={expectedRevision:old.revision,expectedSha256:fingerprint(source),whoDecisions:{copy:{value:{kind:'role',roleId:'worker'},evidence:'fixture: human statement'}}};
 validate(old);const before=JSON.stringify(old);const result=prepareProcedureUpgrade(old,p,request);
 assert.equal(JSON.stringify(old),before);assert.equal(old.documents[1].items[0].reviewState,'確認済み');assert.equal(p.documents.length,1);assert.equal(result.approval,'not-evaluated');assert.ok(result.diagnostics.includes('Scope未確定: paper'));
 assert.ok(result.manualReview.some(x=>x.kind==='legacy-procedure-result-who'&&x.id==='copy'));assert.ok(result.manualReview.some(x=>x.kind==='legacy-relation-label'&&x.id==='paper-input'));assert.equal(result.decisionEvidence.whoDecisions.copy.evidence,'fixture: human statement');
 const noWho=structuredClone(request);noWho.whoDecisions={};assert.throws(()=>prepareProcedureUpgrade(old,p,noWho),/Who evidence/);
 const guessed=copy();bd(guessed).objects[0].scope=false;assert.throws(()=>prepareProcedureUpgrade(old,guessed,request),/Scope evidence/);
 const changed=copy();bd(changed).objects[0].id='changed';assert.throws(()=>prepareProcedureUpgrade(old,changed,request));
});

test('SP-011/013: old 0.5 keeps every Step/Data/Relation and never infers direct Who',()=>{
 const {old,candidate}=old05Fixture(),original=JSON.stringify(old),request={expectedRevision:old.revision,expectedSha256:fingerprint(original)};
 validate(old);validate(candidate);const result=prepareProcedureUpgrade(old,candidate,request);
 assert.equal(result.approval,'not-evaluated');assert.equal(JSON.stringify(old),original);assert.equal(activity(candidate).who,null);
 assert.ok(result.manualReview.some(x=>x.kind==='legacy-performers'&&x.id==='copy'));assert.ok(result.manualReview.some(x=>x.kind==='legacy-step-performers'&&x.id==='read'));
 for(const id of ['read','read-response','write','write-response','content','memo-content-data','paper-input','memo-output'])assert.ok(inventory(candidate).map.has(id));
 const missing=structuredClone(candidate);step(missing,'write').exchange.dataIds=['content'];assert.throws(()=>prepareProcedureUpgrade(old,missing,request),/explicit Step mapping/);
 const changedText=structuredClone(candidate);step(changedText,'read').legacyText='変更された旧文';assert.throws(()=>prepareProcedureUpgrade(old,changedText,request),/legacy Step text/);
 const assumed=structuredClone(candidate);activity(assumed).who={kind:'role',roleId:'worker'};assert.throws(()=>prepareProcedureUpgrade(old,assumed,request),/Who evidence/);
 const moved=structuredClone(candidate),info=bd(moved).objects[0].information.shift();bd(moved).objects[1].information.push(info);assert.throws(()=>prepareProcedureUpgrade(old,moved,request),/owner changed/i);
});

test('SP-012: protected authoring retains nested identities and does not silently reassign Information',()=>{
 const next=copy();next.revision='example-2';bd(next).revision='bd-2';step(next,'write').action+='（確認）';assert.equal(guardAuthoring(example,next,{expectedRevision:example.revision}).valid,true);
 const moved=structuredClone(next),info=bd(moved).objects[0].information.pop();bd(moved).objects[1].information.push(info);assert.throws(()=>guardAuthoring(example,moved,{expectedRevision:example.revision}),/owner changed/i);
 const removed=structuredClone(next);activity(removed).results=[];assert.throws(()=>guardAuthoring(example,removed,{expectedRevision:example.revision}));
 const base=copy(),checks=structuredClone(old04Fixture().documents[1]);checks.basedOn.revision=bd(base).revision;base.documents.push(checks);validate(base);
 const rebase=structuredClone(base);rebase.revision='example-new';bd(rebase).revision='bd-new';rebase.documents[1].revision='checks-new';rebase.documents[1].basedOn.revision='bd-new';
 assert.throws(()=>guardAuthoring(base,rebase,{expectedRevision:base.revision}),/cannot be rebased/);assert.equal(base.documents[1].items[0].reviewState,'確認済み');
});

test('SP-011/012: real CLI creates only a separate checked candidate and protects original/target on failures',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'alder-procedure-')),cli=new URL('./author-cli.mjs',import.meta.url).pathname;
 try{const old=old04Fixture(),source=path.join(dir,'source.json'),candidate=path.join(dir,'authored.json'),output=path.join(dir,'output.json'),req=path.join(dir,'request.json');
  const bytes=JSON.stringify(old);fs.writeFileSync(source,bytes);fs.writeFileSync(candidate,JSON.stringify(example));
  const request={expectedRevision:old.revision,expectedSha256:fingerprint(bytes),whoDecisions:{copy:{value:{kind:'role',roleId:'worker'},evidence:'fixture: human statement'}}};fs.writeFileSync(req,JSON.stringify(request));
  const run=()=>spawnSync(process.execPath,[cli,'prepare-procedure-upgrade',source,candidate,output,req],{encoding:'utf8'});
  const inspect=spawnSync(process.execPath,[cli,'inspect',candidate],{encoding:'utf8'});assert.equal(inspect.status,0,inspect.stderr);assert.equal(JSON.parse(inspect.stdout).compatibility.editable,false);
  const create=spawnSync(process.execPath,[cli,'create',candidate,output,req],{encoding:'utf8'});assert.equal(create.status,2);assert.equal(fs.existsSync(output),false);
  let result=run();assert.equal(result.status,0,result.stderr);assert.equal(JSON.parse(result.stdout).approval,'not-evaluated');assert.equal(fs.readFileSync(source,'utf8'),bytes);assert.equal(JSON.parse(fs.readFileSync(output)).formatVersion,'0.6');
  const saved=fs.readFileSync(output,'utf8');result=run();assert.equal(result.status,2);assert.equal(fs.readFileSync(output,'utf8'),saved);assert.equal(fs.readFileSync(source,'utf8'),bytes);
  fs.unlinkSync(output);request.expectedSha256='0'.repeat(64);fs.writeFileSync(req,JSON.stringify(request));result=run();assert.equal(result.status,2);assert.equal(fs.existsSync(output),false);assert.equal(fs.readFileSync(source,'utf8'),bytes);
  assert.equal(fs.readdirSync(dir).some(f=>f.startsWith('.alder-json-')),false);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});

test('SP-011/013: real CLI preserves old 0.5 and reports original performer information for review',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'alder-procedure-old05-')),cli=new URL('./author-cli.mjs',import.meta.url).pathname;
 try{const {old,candidate}=old05Fixture(),source=path.join(dir,'old.json'),authored=path.join(dir,'authored.json'),output=path.join(dir,'candidate.json'),request=path.join(dir,'request.json'),bytes=JSON.stringify(old);
  fs.writeFileSync(source,bytes);fs.writeFileSync(authored,JSON.stringify(candidate));fs.writeFileSync(request,JSON.stringify({expectedRevision:old.revision,expectedSha256:fingerprint(bytes)}));
  const result=spawnSync(process.execPath,[cli,'prepare-procedure-upgrade',source,authored,output,request],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);
  const report=JSON.parse(result.stdout);assert.ok(report.manualReview.some(x=>x.kind==='legacy-performers'));assert.ok(report.manualReview.some(x=>x.kind==='legacy-step-performers'));
  assert.equal(fs.readFileSync(source,'utf8'),bytes);assert.equal(JSON.parse(fs.readFileSync(output)).documents[0].activities[0].who,null);
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
