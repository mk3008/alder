import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {validate,inventory,graphV1,stringify} from './core.mjs';
import {guardAuthoring,fingerprint,meaningHash} from './authoring.mjs';
import {applyEdits} from './edit.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),'utf8'));
const adopted=read('./examples/d2-cases.json');
const cases=adopted.map(c=>{const business=structuredClone(c.candidate.business);for(const a of business.activities)a.results=a.results.map(r=>({id:r.id,text:r.condition?r.condition+'、'+r.text:r.text}));return {caseId:c.caseId,package:{format:'alder-document-package',formatVersion:'0.5',revision:'d2-contract-fixture-2',documents:[business],sources:[],externalDocuments:[],diagnostics:[]}};});
const sample=()=>structuredClone(cases.find(c=>c.caseId==='mixed').package);
const bd=p=>p.documents.find(d=>d.kind==='businessDesign'),activity=p=>bd(p).activities[0];
const bad=fn=>{const p=sample();fn(p);assert.throws(()=>validate(p));};
const authority=read('./d2-contract.check-items.json');
const names=['versions','performers','steps','orders','results','data','identity','references','migration','storage','compatibility','scope','exceptions'];
assert.deepEqual(authority.items.map(i=>i.testId),names);
assert.equal(createHash('sha256').update(fs.readFileSync(new URL('./d2-contract.check-items.json',import.meta.url))).digest('hex'),'c3652dbe667e43ea5e573867d297e49959ee60ed4739ed8bf9eb72543d8d43fb');
assert.equal(createHash('sha256').update(fs.readFileSync(new URL('./examples/d2-cases.json',import.meta.url))).digest('hex'),'2dc69d02541be6e092c3cfa36cffd1b0392684dc92aaa7b0b016ed1972ca687c');
assert.deepEqual(adopted.map(c=>c.caseId),['molkkyCross','mixed','photo','synthetic','molkky']);
const check=(name,fn)=>test(authority.items.find(i=>i.testId===name).id+' '+name,fn);
check('versions',()=>{
 for(const c of cases){const before=stringify(c.package);validate(c.package);assert.equal(stringify(c.package),before);}
 for(const v of ['0.4','D2.2','9.0'])bad(p=>p.formatVersion=v);
 bad(p=>bd(p).schemaVersion='0.3');bad(p=>p.proposalVersion='D2.2');bad(p=>p.format='alder-structure-design-example');
 bad(p=>activity(p).who='担当者');bad(p=>activity(p).roleId='c-staff');
});
check('performers',()=>{
 const p=sample();bd(p).roles.push({id:'second-role',name:'記録者',color:'#008576'});activity(p).performers[0].roleIds.push('second-role');validate(p);
 for(const f of [p=>activity(p).performers=[],p=>activity(p).performers[0].objectId='missing',p=>activity(p).performers[0].roleIds=['missing'],p=>activity(p).performers.push({...activity(p).performers[0]}),p=>activity(p).performers[0].roleIds.push('c-staff'),p=>activity(p).performers=null])bad(f);
 const q=structuredClone(cases[0].package);validate(q);bd(q).findings=[];assert.throws(()=>validate(q),/Finding/);
});
check('steps',()=>{
 const p=sample();activity(p).procedure.steps[0].obligation='optional';activity(p).procedure.steps[0].appliesWhen='依頼者が希望する場合';validate(p);
 for(const f of [p=>activity(p).procedure.steps=[],p=>activity(p).procedure.steps[0].text=' ',p=>activity(p).procedure.steps[0].obligation='sometimes',p=>activity(p).procedure.steps[0].performerObjectIds=[],p=>activity(p).procedure.steps[0].performerObjectIds=['c-requester'],p=>activity(p).procedure.steps[0].performerObjectIds=['staff-object','staff-object'],p=>activity(p).procedure.steps[0].performerObjectIds=null])bad(f);
 const q=structuredClone(cases.find(c=>c.caseId==='photo').package);activity(q).procedure.steps[0].performerObjectIds=null;validate(q); // One Activity performer is inherited, not invented.
});
check('orders',()=>{
 const p=sample(),a=activity(p),[x,y,z]=a.procedure.steps.map(s=>s.id);
 a.procedure.orderRules=[{kind:'before',beforeId:x,afterId:y},{kind:'interchangeable',stepIds:[y,z]}];validate(p);
 const mutations=[a=>a.procedure.orderRules.push({kind:'before',beforeId:y,afterId:x}),a=>a.procedure.orderRules.push({kind:'before',beforeId:y,afterId:z}),a=>a.procedure.orderRules.push({kind:'before',beforeId:x,afterId:x}),a=>a.procedure.orderRules.push({kind:'before',beforeId:x,afterId:'missing'}),a=>a.procedure.orderRules.push({...a.procedure.orderRules[0]}),a=>a.procedure.orderRules[1].stepIds=[y,y],a=>a.procedure.orderRules[1].stepIds=[y]];
 for(const fn of mutations){const q=structuredClone(p);fn(activity(q));assert.throws(()=>validate(q));}
 const q=sample(),other=structuredClone(activity(q));other.id='other-activity';other.name='別業務';other.results=[{id:'other-result',text:'別の結果'}];other.procedure.steps=other.procedure.steps.map(s=>({...s,id:s.id+'-other'}));bd(q).activities.push(other);activity(q).procedure.orderRules=[{kind:'before',beforeId:x,afterId:other.procedure.steps[0].id}];assert.throws(()=>validate(q),/owner|Activity|Procedure/);
 bad(p=>bd(p).crossActivityOrderRules=[]);
 const cycle=sample();activity(cycle).procedure.orderRules=[{kind:'before',beforeId:x,afterId:y},{kind:'before',beforeId:y,afterId:z},{kind:'before',beforeId:z,afterId:x}];assert.throws(()=>validate(cycle));
});
check('results',()=>{
 const p=sample();activity(p).results[0].text='依頼がある場合、担当窓口が説明される。';validate(p);
 bad(p=>activity(p).results=[]);bad(p=>activity(p).results[0].text='');bad(p=>activity(p).results[0].condition=null);bad(p=>activity(p).result='旧文字列');
});
check('data',()=>{
 for(const fn of [p=>bd(p).data.push({...bd(p).data[0],id:'same-name'}),p=>bd(p).data[0].items=[],p=>bd(p).data[0].items.push({...bd(p).data[0].items[0]}),p=>bd(p).data[0].items[0].informationId='missing',p=>bd(p).relations[0].dataId='missing',p=>bd(p).relations[0].items=[],p=>bd(p).relations[0].label='上書き',p=>bd(p).relations[0].toId='staff-object',p=>bd(p).relations[0].kind='input',p=>bd(p).data[0].name=' 連絡案内'])bad(fn);
 const p=sample();bd(p).relations.push({id:'read-shared',kind:'input',fromId:'c-requester',toId:'c-guidance',dataId:'data-c-output'});validate(p);assert.equal(bd(p).data.length,1);
 bd(p).data[0].name='同一定義の改名';validate(p);assert.deepEqual(bd(p).relations.map(r=>r.dataId),['data-c-output','data-c-output']);
});
check('identity',()=>{
 const p=sample(),inv=inventory(p);for(const [id,type,parent]of [['c-desk','information','c-requester'],['mix-input','step','c-guidance'],['c-guidance-r1','result','c-guidance'],['data-c-output','data','c-bd']]){assert.equal(inv.types.get(id),type);assert.equal(inv.parent.get(id),parent);}
 bad(p=>activity(p).results[0].id='c-desk');
 const q=structuredClone(p);q.revision='p2';bd(q).revision+='-2';bd(q).objects[1].information.push(bd(q).objects[0].information.shift());
 assert.throws(()=>guardAuthoring(p,q,{expectedRevision:p.revision}));
 const a=activity(p);assert.throws(()=>applyEdits(p,{expectedRevision:p.revision,revision:'p2',documentRevisions:{'c-bd':{expected:bd(p).revision,next:'bd2'}},changes:[{id:a.id,values:{results:a.results.slice(1)}}]}),/identity/i);
 for(const kind of ['step','result','information']){
  const q=structuredClone(p);q.revision='p2';bd(q).revision+='-2';
  if(kind==='information'){bd(q).data[0].items.pop();bd(q).objects[1].information.push(bd(q).objects[0].information.pop());}
  else{const other=structuredClone(activity(q));other.id='another-activity';other.name='別の担当業務';other.procedure.steps=other.procedure.steps.map(s=>({...s,id:s.id+'-another'}));other.results=other.results.map(r=>({...r,id:r.id+'-another'}));bd(q).activities.push(other);if(kind==='step')other.procedure.steps.push(activity(q).procedure.steps.pop());else other.results.push(activity(q).results.pop());}
  validate(q);assert.throws(()=>guardAuthoring(p,q,{expectedRevision:p.revision}),/owner/);
 }
 const rename=applyEdits(p,{expectedRevision:p.revision,revision:'p2',documentRevisions:{'c-bd':{expected:bd(p).revision,next:'bd2'}},changes:[{id:'c-desk',values:{name:'担当する窓口'}}]});assert.equal(bd(rename).data[0].items[0].informationId,'c-desk');
});
function legacyWithChecks(){
 const p=read('../../work/viewer-json/issue-274/json-native/independent.json'),d=p.documents[0];
 p.documents.push({id:'check-doc',schemaVersion:'0.1',kind:'checkItems',revision:'check-r1',title:'合成Check',basedOn:{documentId:d.id,revision:d.revision,verification:'unverified'},intro:[],index:[{activityId:d.activities[0].id,purpose:'',connections:'',checkIds:['check-one']}],sections:[{id:'check-section',activityId:d.activities[0].id,title:'受付',preamble:[]}],guarantees:[],examples:[],items:[{id:'check-one',checkId:'CI-001',title:'確認結果が残る',detailSummary:'',sectionId:'check-section',reviewState:'確認済み',fields:{guarantee:[{kind:'text',value:'確認結果が残る'}]}}],notes:[]});validate(p);return p;
}
function migrationRequest(p){
 const d=structuredClone(bd(p));d.schemaVersion='0.4';d.data=[{id:'request-data',name:'依頼内容',items:[{informationId:'request-number',condition:null}]}];d.objects[0].information=[{id:'request-number',name:'受付番号',description:''}];
 for(const a of d.activities){a.performers=[{objectId:'object-request',roleIds:[a.roleId]}];a.procedure={steps:[{id:a.id+'-step',text:a.procedure,obligation:'required',appliesWhen:null,performerObjectIds:null}],orderRules:[]};a.results=[{id:a.id+'-result',text:a.result}];delete a.who;delete a.roleId;delete a.result;delete a.exception;}
 for(const r of d.relations){r.dataId='request-data';delete r.label;}
 const documentRevisions=Object.fromEntries(p.documents.filter(x=>x.kind==='businessDesign').map(x=>[x.id,{expected:x.revision,next:x.revision+'-d2'}]));d.revision=documentRevisions[d.id].next;
 return {expectedRevision:p.revision,revision:'pkg-d2',documentRevisions,businessDesigns:[d]};
}
const confirmation=p=>({bdConfirmations:[{documentId:bd(p).id,revision:bd(p).revision,evidence:{source:'synthetic test only',quote:'模擬合意。実運用の承認ではない'}}]});
function legacyRebaseRequest(p){
 const r=migrationRequest(p);r.documentRevisions=Object.fromEntries(p.documents.map(d=>[d.id,{expected:d.revision,next:d.revision+'-d2'}]));for(const a of r.businessDesigns[0].activities)a.exception=bd(p).activities.find(old=>old.id===a.id).exception;return r;
}
function unsafeRebase(p){
 const r=migrationRequest(p),q=structuredClone(p);q.formatVersion='0.5';q.revision=r.revision;q.documents[0]=r.businessDesigns[0];for(const d of q.documents.slice(1)){d.revision+='-d2';d.basedOn.revision=bd(q).revision;}validate(q);return q;
}
function nativeReferenceFixture(){
 const p=sample(),d=bd(p),basedOn={documentId:d.id,revision:d.revision,verification:'unverified'};
 d.exceptions.push({id:'guide-exception',activityId:'c-guidance',name:'案内不能',description:'参照検査用の合成例外'});
 p.documents.push({id:'new-state-doc',schemaVersion:'0.2',kind:'stateTransition',revision:'new-state-1',title:'合成の部分状態',basedOn:structuredClone(basedOn),objectId:'c-requester',states:[{id:'new-state',name:'案内済み'}],start:'@new',terminal:'@unknown',completeness:'partial',source:'新規参照検証用fixture。移行や業務承認ではない。',transitions:[{id:'new-transition',sourceId:'N1',fromId:'@new',toId:'new-state',activityId:'c-guidance',exceptionId:null,event:null,condition:'案内を記録',effect:'change',path:'normal',evidence:'合成入力',note:'部分定義'}]});
 p.documents.push({id:'new-check-doc',schemaVersion:'0.1',kind:'checkItems',revision:'new-check-1',title:'新規合成Check',basedOn:structuredClone(basedOn),intro:[],index:[{activityId:'c-guidance',purpose:'',connections:'',checkIds:['new-check']}],sections:[{id:'new-section',activityId:'c-guidance',title:'案内',preamble:[]}],guarantees:[],examples:[],items:[{id:'new-check',checkId:'NEW-1',title:'案内を記録',detailSummary:'',sectionId:'new-section',reviewState:'未レビュー',fields:{guarantee:[{kind:'text',value:'案内が記録される'}]}}],notes:[]});return p;
}
const referenceCases=[['checkItems'],['stateTransition'],['checkItems','stateTransition']];
function reviewedReferenceFixture(kinds){
 const p=nativeReferenceFixture();p.documents=p.documents.filter(d=>d.kind==='businessDesign'||kinds.includes(d.kind));
 for(const d of p.documents)for(const i of d.items??[])i.reviewState='確認済み'; // Seed a previously reviewed synthetic snapshot, never a create/approval operation.
 validate(p);return p;
}
function rebasedReferenceCandidate(p){
 const q=structuredClone(p);q.revision+='-next';bd(q).revision+='-next';activity(q).why+='改訂後の案内も行う。';
 for(const d of q.documents.filter(d=>d.kind!=='businessDesign')){d.revision+='-next';d.basedOn.revision=bd(q).revision;}
 validate(q);return q;
}
check('references',async()=>{
 const {upgradeStructure}=await import('./structured.mjs'),old=legacyWithChecks(),bytes=stringify(old),q=upgradeStructure(old,migrationRequest(old));
 assert.equal(stringify(old),bytes);assert.deepEqual(q.documents.map(d=>d.kind),['businessDesign']);assert.equal(old.documents[2].items[0].reviewState,'確認済み');assert.equal(old.documents[2].basedOn.revision,'bd-r1');assert.equal(old.documents[1].basedOn.revision,'bd-r1');
 const fresh=nativeReferenceFixture();validate(fresh);guardAuthoring(null,fresh,confirmation(fresh));
 for(const fn of [p=>p.documents[2].basedOn.revision='old',p=>p.documents[1].basedOn.revision='old',p=>p.documents[1].transitions[0].exceptionId='missing',p=>p.documents[2].basedOn.verification='confirmed']){const b=structuredClone(fresh);fn(b);assert.throws(()=>validate(b));}
 const changed=structuredClone(fresh);changed.revision+='-next';changed.documents[2].revision+='-next';changed.documents[2].items[0].reviewState='確認済み';assert.throws(()=>guardAuthoring(fresh,changed,{expectedRevision:fresh.revision,...confirmation(changed)}),/Human review state/);
 for(const kinds of referenceCases){
  const p=reviewedReferenceFixture(kinds),before=stringify(p),q=rebasedReferenceCandidate(p),op={expectedRevision:p.revision,...confirmation(q)};
  const item=q.documents.find(d=>d.kind==='checkItems')?.items[0];
  if(item)assert.equal(meaningHash(q,item),meaningHash(p,p.documents.find(d=>d.kind==='checkItems').items[0])); // Same Check body/hash is insufficient for a new BD revision.
  assert.throws(()=>guardAuthoring(p,q,op),/source cannot be rebased/);
  if(item){op.humanDecisions=[{id:item.id,state:item.reviewState,meaningSha256:meaningHash(q,item),evidence:{source:'synthetic only',quote:'同じ本文の模擬フィードバック。新版意味再照合ではない'}}];assert.throws(()=>guardAuthoring(p,q,op),/source cannot be rebased/);}
  assert.equal(stringify(p),before);
 }
 const p=reviewedReferenceFixture(['checkItems','stateTransition']),edit=fn=>{const q=structuredClone(p);q.revision+='-edit';fn(q);return q;};
 const evidence=edit(q=>{q.documents[2].revision+='-edit';q.documents[2].items[0].fields.testEvidence=[{kind:'text',value:'証拠未収集を記録'}];});guardAuthoring(p,evidence,{expectedRevision:p.revision,...confirmation(evidence)});assert.equal(evidence.documents[2].items[0].reviewState,'確認済み');
 const checkEdit=edit(q=>{q.documents[2].revision+='-edit';q.documents[2].items[0].title+='訂正';q.documents[2].items[0].reviewState='要確認';});guardAuthoring(p,checkEdit,{expectedRevision:p.revision,...confirmation(checkEdit)});
 const human=structuredClone(fresh);human.revision+='-review';human.documents[2].revision+='-review';human.documents[2].items[0].reviewState='確認済み';guardAuthoring(fresh,human,{expectedRevision:fresh.revision,...confirmation(human),humanDecisions:[{id:'new-check',state:'確認済み',meaningSha256:meaningHash(human,human.documents[2].items[0]),evidence:{source:'synthetic only',quote:'同じBD版に対する模擬人間レビュー'}}]});
 const stateEdit=edit(q=>{q.documents[1].revision+='-edit';q.documents[1].transitions[0].condition+='（追記）';});guardAuthoring(p,stateEdit,{expectedRevision:p.revision});
 const bdOnly=structuredClone(fresh);bdOnly.documents=[bd(bdOnly)];const added=structuredClone(fresh);added.revision+='-add';guardAuthoring(bdOnly,added,{expectedRevision:bdOnly.revision,...confirmation(added)});
});
check('migration',async()=>{
 const {upgradeStructure}=await import('./structured.mjs'),old=legacyWithChecks(),before=stringify(old),q=upgradeStructure(old,migrationRequest(old));assert.equal(stringify(old),before);assert.deepEqual(q.sources,old.sources.filter(s=>s.documentId===bd(old).id));assert.deepEqual(q.documents.map(d=>d.kind),['businessDesign']);
 assert.throws(()=>upgradeStructure(old,legacyRebaseRequest(old)),/BD-only/);
 const rebased=unsafeRebase(old);assert.throws(()=>guardAuthoring(old,rebased,{expectedRevision:old.revision,migration:'structure-0.5',...confirmation(rebased)}),/separate BD-only/);assert.throws(()=>guardAuthoring(null,rebased,confirmation(rebased)),/New Check/);
 assert.throws(()=>guardAuthoring(old,q,{expectedRevision:old.revision}),/migration|contract|version/i);assert.throws(()=>guardAuthoring(old,q,{expectedRevision:old.revision,migration:'structure-0.5',...confirmation(q)}),/separate BD-only/);guardAuthoring(null,q);
 for(const fn of [r=>r.expectedRevision='wrong',r=>r.documentRevisions['state-document']={expected:'st-r1',next:'st-r2'},r=>r.businessDesigns[0].objects[0].id='new-object',r=>r.businessDesigns[0].activities[0].procedure.steps=[],r=>r.unknown=true]){const r=migrationRequest(old);fn(r);assert.throws(()=>upgradeStructure(old,r));}
 const pending=legacyWithChecks();activity(pending).roleId=null;activity(pending).who='担当未確認';pending.diagnostics.push('Role未確定: '+activity(pending).id+' — '+activity(pending).who);validate(pending);
 const request=migrationRequest(pending);request.businessDesigns[0].activities[0].performers=null;request.businessDesigns[0].findings.push({id:'pending-actor',sourceId:'ACTOR-1',kind:'question',status:'open',scope:'items',targetIds:[activity(pending).id],unresolvedTargets:[],summary:'実行主体未決',content:'移行で担当を創作しない。'});const migrated=upgradeStructure(pending,request);assert.equal(activity(migrated).performers,null);assert.deepEqual(migrated.diagnostics,[]);assert.ok(pending.diagnostics.some(s=>s.startsWith('Role未確定:')));
});
check('storage',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'alder-d2-')),cli=new URL('./author-cli.mjs',import.meta.url).pathname,validateCLI=new URL('./cli.mjs',import.meta.url).pathname;
 const run=(...args)=>spawnSync(process.execPath,[cli,...args],{encoding:'utf8',env:{...process.env,ALDER_PYTHON:'/no-python'}});
 try{const candidate=path.join(dir,'candidate.json'),target=path.join(dir,'saved.json'),op=path.join(dir,'op.json'),p=sample();fs.writeFileSync(candidate,stringify(p));fs.writeFileSync(op,'{}');let r=run('create',candidate,target,op);assert.equal(r.status,0,r.stderr);const initial=fs.readFileSync(target,'utf8'),info=JSON.parse(run('inspect',target).stdout);assert.deepEqual(JSON.parse(initial),p);
 const q=structuredClone(p);q.revision+='-2';bd(q).revision+='-2';activity(q).results[0].text+='確認済みの内容を通知する。';fs.writeFileSync(candidate,stringify(q));let operation={expectedRevision:p.revision,expectedSha256:'wrong'};fs.writeFileSync(op,JSON.stringify(operation));assert.equal(run('commit',target,candidate,op).status,2);assert.equal(fs.readFileSync(target,'utf8'),initial);
 operation.expectedSha256=info.sha256;fs.writeFileSync(op,JSON.stringify(operation));fs.writeFileSync(target+'.alder-lock','foreign');assert.equal(run('commit',target,candidate,op).status,2);assert.equal(fs.readFileSync(target+'.alder-lock','utf8'),'foreign');fs.unlinkSync(target+'.alder-lock');r=run('commit',target,candidate,op);assert.equal(r.status,0,r.stderr);const saved=fs.readFileSync(target,'utf8');assert.deepEqual(JSON.parse(saved),q);
 q.documents[0].data[0].items=[];fs.writeFileSync(candidate,stringify(q));assert.equal(run('commit',target,candidate,op).status,2);assert.equal(fs.readFileSync(target,'utf8'),saved);assert.equal(spawnSync(process.execPath,[validateCLI,'validate',target],{encoding:'utf8'}).status,0);
 const old=legacyWithChecks(),source=path.join(dir,'old.json'),prepared=path.join(dir,'prepared.json'),request=path.join(dir,'request.json'),newBD=path.join(dir,'new-bd.json');const original=stringify(old);fs.writeFileSync(source,original);fs.writeFileSync(request,JSON.stringify(migrationRequest(old)));r=run('prepare-structure-upgrade',source,prepared,request);assert.equal(r.status,0,r.stderr);assert.equal(fs.readFileSync(source,'utf8'),original);const next=JSON.parse(fs.readFileSync(prepared));assert.deepEqual(next.documents.map(d=>d.kind),['businessDesign']);
 fs.writeFileSync(op,JSON.stringify({expectedRevision:old.revision,expectedSha256:fingerprint(original),migration:'structure-0.5',...confirmation(next)}));assert.equal(run('commit',source,prepared,op).status,2);assert.equal(fs.readFileSync(source,'utf8'),original);
 const forced=path.join(dir,'forced.json');fs.writeFileSync(forced,stringify(unsafeRebase(old)));assert.equal(run('commit',source,forced,op).status,2);assert.equal(fs.readFileSync(source,'utf8'),original);fs.writeFileSync(op,JSON.stringify(confirmation(unsafeRebase(old))));const denied=run('create',forced,path.join(dir,'invalid-rebased.json'),op);assert.equal(denied.status,2);assert.match(denied.stderr,/New Check/);assert.ok(!fs.existsSync(path.join(dir,'invalid-rebased.json')));
 fs.writeFileSync(op,'{}');r=run('create',prepared,newBD,op);assert.equal(r.status,0,r.stderr);assert.deepEqual(JSON.parse(fs.readFileSync(newBD)),next);assert.equal(fs.readFileSync(source,'utf8'),original);assert.equal(JSON.parse(fs.readFileSync(source)).documents[2].items[0].reviewState,'確認済み');assert.equal(run('prepare-structure-upgrade',source,source,request).status,2);
 const failed=path.join(dir,'failed-candidate.json');fs.writeFileSync(request,JSON.stringify(legacyRebaseRequest(old)));assert.equal(run('prepare-structure-upgrade',source,failed,request).status,2);assert.ok(!fs.existsSync(failed));assert.equal(fs.readFileSync(source,'utf8'),original);
 for(const kinds of referenceCases){
  const p=reviewedReferenceFixture(kinds),q=rebasedReferenceCandidate(p),target=path.join(dir,'native-'+kinds.join('-')+'.json'),candidate=path.join(dir,'native-candidate.json'),initial=stringify(p),input=stringify(q);
  fs.writeFileSync(target,initial);fs.writeFileSync(candidate,input);const operation={expectedRevision:p.revision,expectedSha256:fingerprint(initial),...confirmation(q)};fs.writeFileSync(op,JSON.stringify(operation));
  const denied=run('commit',target,candidate,op);assert.equal(denied.status,2,denied.stdout);assert.match(denied.stderr,/source cannot be rebased/);assert.equal(fs.readFileSync(target,'utf8'),initial);assert.equal(fs.readFileSync(candidate,'utf8'),input);
  const changed=structuredClone(p);changed.revision+='-edit';const doc=changed.documents[1];doc.revision+='-edit';if(doc.kind==='checkItems')doc.items[0].fields.testEvidence=[{kind:'text',value:'保存回帰の模擬証拠'}];else doc.transitions[0].condition+='（保存回帰）';
  fs.writeFileSync(candidate,stringify(changed));fs.writeFileSync(op,JSON.stringify({...operation,...confirmation(changed)}));const saved=run('commit',target,candidate,op);assert.equal(saved.status,0,saved.stderr);assert.deepEqual(JSON.parse(fs.readFileSync(target,'utf8')),changed);
 }
 assert.ok(!fs.readdirSync(dir).some(f=>f.endsWith('.alder-lock')||f.startsWith('.alder-json-')));
 }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
check('compatibility',()=>{
 const old=read('../../work/viewer-json/issue-274/json-native/independent.json'),bytes=stringify(old);validate(old);graphV1(old,bd(old).id);assert.equal(stringify(old),bytes);assert.throws(()=>graphV1(sample(),'c-bd'),/projection|Graph|0.5/);
});
check('scope',()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'alder-d2-native-'));try{const candidate=path.join(dir,'candidate.json'),target=path.join(dir,'target.json'),op=path.join(dir,'op.json'),block=path.join(dir,'block.mjs');fs.writeFileSync(candidate,stringify(sample()));fs.writeFileSync(op,'{}');fs.writeFileSync(block,"import {registerHooks} from 'node:module';registerHooks({resolve(s,c,next){if(/(?:legacy-json|convert|markdown|state-declaration|state-storage)\\.(?:mjs|py)$/.test(s))throw Error('Legacy module blocked');return next(s,c);}});");const r=spawnSync(process.execPath,['--import',block,new URL('./author-cli.mjs',import.meta.url).pathname,'create',candidate,target,op],{encoding:'utf8',env:{...process.env,ALDER_PYTHON:'/no-python'}});assert.equal(r.status,0,r.stderr);assert.deepEqual(JSON.parse(fs.readFileSync(target)),sample());}finally{fs.rmSync(dir,{recursive:true,force:true});}
});

check('exceptions',async()=>{
 const {upgradeStructure}=await import('./structured.mjs');
 for(const c of adopted){assert.ok(c.candidate.business.activities.every(a=>!Object.hasOwn(a,'exception')));const q=structuredClone(cases.find(x=>x.caseId===c.caseId).package);validate(q);q.documents[0].activities[0].exception=null;assert.throws(()=>validate(q),/Unknown field/);}
 const old=legacyWithChecks();activity(old).exception='必要項目がない場合、受付を中止して依頼者へ連絡する。';validate(old);const bytes=stringify(old),r=migrationRequest(old);assert.throws(()=>upgradeStructure(old,r),/Legacy exception text/);assert.equal(stringify(old),bytes);
 r.businessDesigns[0].exceptions.push({id:'explicit-legacy-body',activityId:activity(old).id,name:'受付できない場合の対応',description:activity(old).exception});const q=upgradeStructure(old,r);assert.equal(stringify(old),bytes);assert.equal(bd(q).exceptions.find(e=>e.id==='explicit-legacy-body').description,activity(old).exception);assert.ok(bd(q).activities.every(a=>!Object.hasOwn(a,'exception')));
 for(const mutate of [d=>d.exceptions.at(-1).description='要約して一部を落とす',d=>d.exceptions.at(-1).activityId='activity-review',d=>d.exceptions[0].description='既存定義を変える',d=>d.exceptions.splice(0,1)]){const bad=structuredClone(r);mutate(bad.businessDesigns[0]);assert.throws(()=>upgradeStructure(old,bad));}
});
