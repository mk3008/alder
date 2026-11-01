import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {parseDocument,readDesignFile} from '../src/document-input.ts';
import {loadDocumentURL} from '../src/document-loader.ts';

const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const authorities={
 'verification/json-05-reintegration.check-items.json':'ca0e3566e44b8d606cede2bf62a41c8fbe27a0a8dcf5062bddf9d35087aea2b3',
 'verification/json-05-viewer.check-items.json':'c1f6f0be6e7400cd5c84cafce067656d2d3aa4dcd4a4ac0518fdf3927d452f77',
 'verification/check-items.json':'ec33503c2527f02e7ca81ba961ece2e4c7c9a2dd4d9c426fe3baaddda97c65b1',
 'verification/state-unified-loop.check-items.json':'334d6e172795a1e321f81ac68144d076f0e1a9cb599bc14c6ff66f9be6c1f3be',
 'verification/activity-section-spec-links.check-items.json':'ed16ed2dee866934f58a005e30b66a4ebf6c816c669b61652bac663a094c0ff7',
 'verification/unified-concept-json.check-items.json':'1dac953ee2b6c41a00a8bade8b6a770c69d6c6fced407f89d01ef128c062a3fd'
};
const verify=(path,bytes=readFileSync(path))=>assert.equal(sha(bytes),authorities[path],path);
for(const path of Object.keys(authorities))verify(path);
const authority=JSON.parse(readFileSync('verification/json-05-reintegration.check-items.json','utf8'));
const ids=Array.from({length:8},(_,i)=>`JSON05-REINTEGRATE-00${i+1}`);
assert.deepEqual(authority.checks.map(c=>c.id),ids);
const oldIds=Array.from({length:6},(_,i)=>`JSON05-VIEWER-00${i+1}`);
assert.deepEqual(JSON.parse(readFileSync('verification/json-05-viewer.check-items.json','utf8')).checks.map(c=>c.id),oldIds);
const coverage=results=>{assert.equal(new Set(results).size,results.length,'duplicate coverage');assert.deepEqual([...results].sort(),[...ids].sort(),'coverage mismatch');};
const oldCoverage=results=>{assert.equal(new Set(results).size,results.length,'duplicate old coverage');assert.deepEqual([...results].sort(),[...oldIds].sort(),'old coverage mismatch');};
const altered=structuredClone(authority);altered.checks.shift();assert.throws(()=>verify('verification/json-05-reintegration.check-items.json',JSON.stringify(altered)));
assert.throws(()=>coverage(ids.slice(1)),/coverage mismatch/);assert.throws(()=>coverage([...ids,ids[0]]),/duplicate coverage/);
assert.throws(()=>oldCoverage(oldIds.slice(1)),/old coverage mismatch/);assert.throws(()=>oldCoverage([...oldIds,oldIds[0]]),/duplicate old coverage/);
// The compatibility runtime is exactly the old read validator, not a new writer.
for(const [file,digest] of Object.entries({'core.mjs':'476a6e7f262a9b8f721fe090017e09cd67f18b153e0de07bd47ac38273f54797','schema.mjs':'d990488a401def838cc39ff645a39ee92a8a3e6f813115c019db7aa4b77c9b46','structured.mjs':'c99643307947118041d78d354f886642c100ed8ff9726b717dd476b6ea53729d'}))assert.equal(sha(readFileSync('src/compat-json-05/'+file)),digest);
const inputBundle=await build({entryPoints:['src/document-input.ts'],bundle:true,write:false,format:'esm'});
assert.doesNotMatch(inputBundle.outputFiles[0].text,/Structure migration requires package 0\.4|Migration must preserve the source/,'viewer must not bundle a migration or authoring entry point');

const seedRaw=readFileSync('web/fixtures/json-05-reviewed-seed.json','utf8'),seed=JSON.parse(seedRaw);
const synthetic=JSON.parse(readFileSync('web/fixtures/json-05-synthetic.json','utf8'));
const cases=JSON.parse(readFileSync('web/fixtures/json-05-d2-cases.json','utf8'));
const packageFor=id=>{const business=structuredClone(cases.find(c=>c.caseId===id).candidate.business);for(const a of business.activities)a.results=a.results.map(r=>({id:r.id,text:r.condition?r.condition+'、'+r.text:r.text}));return {format:'alder-document-package',formatVersion:'0.5',revision:'viewer-probe',documents:[business],sources:[],externalDocuments:[],diagnostics:[]};};
const make=p=>parseDocument(JSON.stringify(p));
const dom=new JSDOM('<body></body>',{runScripts:'outside-only'}),w=dom.window;
// Build with explicit global names so the tests exercise actual DOM renderers.
for(const [file,name] of [['src/document-view.ts','Detail'],['src/findings.ts','Findings'],['src/state-transitions.ts','States']]){const out=await build({entryPoints:[file],bundle:true,write:false,format:'iife',globalName:name});w.eval(out.outputFiles[0].text+`;window.${name}=${name};`);}
const done=[],oldDone=[];
try{
 const design=parseDocument(seedRaw);assert.equal(design.markdown,seedRaw);assert.deepEqual(design.model.business,seed.documents[0]);assert.deepEqual(design.model.checks[0],seed.documents[1]);assert.deepEqual(design.model.states[0],seed.documents[2]);
 assert.deepEqual(cases.map(c=>c.caseId),['molkkyCross','mixed','photo','synthetic','molkky']);
 for(const input of cases){const pkg=packageFor(input.caseId),source=JSON.stringify(pkg),view=parseDocument(source);assert.equal(view.markdown,source);assert.deepEqual(view.model.business,pkg.documents[0]);assert.equal(view.graph.nodes.length,pkg.documents[0].objects.length+pkg.documents[0].activities.length);}
 const file=await readDesignFile({name:'seed.json',type:'application/json',size:Buffer.byteLength(seedRaw),text:async()=>seedRaw});assert.equal(file.markdown,seedRaw);
 const fetchBefore=globalThis.fetch;try{globalThis.fetch=async()=>new Response(seedRaw,{status:200,headers:{'content-type':'application/json'}});assert.equal((await loadDocumentURL('https://example.test/seed.json')).markdown,seedRaw);}finally{globalThis.fetch=fetchBefore;}
 done.push(ids[0]);oldDone.push(oldIds[0]);

 const photo=packageFor('photo'),single=make(photo),activity=photo.documents[0].activities[0],detail=w.Detail.businessDetail(single,activity.id),detailText=detail.textContent;
 for(const value of ['参加者','記録担当','写真がある場合','その写真を残す'])assert.ok(detailText.includes(value),value);
 assert.doesNotMatch(detailText,/担当：/,'single Activity performer is not repeated for inherited Step');assert.equal(single.findings.filter(f=>f.id.startsWith('viewer:')).length,0);
 const explicit=structuredClone(photo);explicit.documents[0].activities[0].procedure.steps[0].performerObjectIds=['fx-person'];assert.doesNotMatch(w.Detail.businessDetail(make(explicit),'photo-activity').textContent,/担当：/);
 const noRole=structuredClone(photo);noRole.documents[0].activities[0].performers[0].roleIds=[];assert.ok(w.Detail.businessDetail(make(noRole),'photo-activity').textContent.includes('その写真を残す'));
 const unresolved=packageFor('molkkyCross'),unknown=make(unresolved),unknownActivity=unresolved.documents[0].activities[0];assert.match(w.Detail.businessDetail(unknown,unknownActivity.id).textContent,/担当：未決/);assert(unknown.findings.some(f=>f.id===`viewer:who:${unknownActivity.id}`));assert(unknown.findings.some(f=>f.id===`viewer:steps:${unknownActivity.id}`));
 done.push(ids[1]);

 const issue=design.findings.find(f=>f.id==='viewer:who:c-guidance');assert(issue);assert.equal(issue.kind,'correction');assert.deepEqual(issue.targets,['c-guidance']);for(const s of ['受付担当','受付システム','担当者','1つ'])assert.ok(issue.content.includes(s),s);
 assert.ok(w.Findings.findingLinks(design,'c-guidance',()=>{}).textContent.includes('構造の要確認（表示のみ）'));
 assert.deepEqual(design.model.business.findings,seed.documents[0].findings);assert.deepEqual(design.model.checks[0].items.map(i=>i.reviewState),seed.documents[1].items.map(i=>i.reviewState));assert.equal(design.markdown,seedRaw);
 done.push(ids[2]);oldDone.push(oldIds[1]);

 const sourceView=make(synthetic),sourceBD=synthetic.documents.find(d=>d.kind==='businessDesign'),a=sourceBD.activities[0],mixedDetail=w.Detail.businessDetail(sourceView,a.id),content=mixedDetail.textContent;
 for(const value of ['受付担当','受付システム','相談申込を入力する','入力された申込を確認する','担当：受付担当','担当：受付システム','任意','手順1 → 手順2','手順2・3は入替可能'])assert.ok(content.includes(value),value);
 const pending=structuredClone(synthetic),pa=pending.documents[0].activities[0];pa.procedure.steps[0].performerObjectIds=null;pending.documents[0].findings.push({id:'test-pending-step',sourceId:'PENDING-1',kind:'question',status:'open',scope:'items',targetIds:[pa.id],unresolvedTargets:[],summary:'手順担当未決',content:'担当を確認する。'});const pendingDesign=make(pending);assert.match(w.Detail.businessDetail(pendingDesign,pa.id).textContent,/担当：未決/);assert(pendingDesign.findings.some(f=>f.id===`viewer:steps:${pa.id}`));
 done.push(ids[3]);oldDone.push(oldIds[2]);

 for(const value of ['依頼者へ担当窓口が説明される','依頼者へ次の連絡方法が説明される','連絡案内','その相談の担当窓口','次の連絡方法'])assert.ok(content.includes(value),value);
 const resultGroup=mixedDetail.querySelector('[data-business-result]');assert.equal(resultGroup.tagName,'UL');assert.equal(resultGroup.dataset.resultScope,'activity');assert.equal(resultGroup.querySelectorAll('li').length,2);assert.equal(resultGroup.querySelectorAll('[data-business-result]').length,0);
 const changed=structuredClone(synthetic),data=changed.documents[0].data[0];data.items[0].condition='本人の希望がある場合';const information=changed.documents[0].objects.flatMap(o=>o.information).find(i=>i.id===data.items[0].informationId);information.description='窓口の説明';const io=w.Detail.businessDetail(make(changed),a.id).textContent;assert.match(io,/本人の希望がある場合/);assert.match(io,/窓口の説明/);
 const escaped=structuredClone(photo);escaped.documents[0].objects.find(o=>o.id==='fx-person').name='<img src=x onerror=alert(1)>';const safe=w.Detail.businessDetail(make(escaped),'photo-activity');assert.equal(safe.querySelector('img'),null);assert.ok(safe.textContent.includes('<img src=x onerror=alert(1)>'));
 done.push(ids[4]);oldDone.push(oldIds[3]);

 const transitions=structuredClone(seed),state=transitions.documents.find(d=>d.kind==='stateTransition'),first=state.transitions[0];state.transitions.push({...first,id:'compat-same-target',sourceId:'S2',note:'別の遷移'}, {...first,id:'compat-unresolved',sourceId:'S3',toId:'@unknown',effect:'constraint',note:'到着先は未決'});const distinct=make(transitions);assert.deepEqual(distinct.model.states[0].transitions,state.transitions);assert.equal(distinct.objectStateTransitions[state.objectId].model.transitions.length,3);
 const loop=structuredClone(seed),stateLoop=loop.documents.find(d=>d.kind==='stateTransition'),source=stateLoop.transitions[0];stateLoop.transitions.push({...source,id:'loop-1',sourceId:'L1',fromId:'seed-done',toId:'seed-done',effect:'unchanged',note:'1つ目'}, {...source,id:'loop-2',sourceId:'L2',fromId:'seed-done',toId:'seed-done',effect:'unchanged',note:'2つ目'});const loopDesign=make(loop),panel=w.States.stateTransitionPanel(loopDesign,stateLoop.objectId,()=>{});assert.equal(panel.querySelectorAll('path.state-self-loop').length,1);for(const text of ['L1','L2','1つ目','2つ目'])assert.ok(panel.textContent.includes(text),text);
 const labeled=structuredClone(transitions);labeled.documents.find(d=>d.kind==='stateTransition').transitions.forEach((t,i)=>{t.conditionLabel=`表示名${i+1}`;});const labeledDesign=make(labeled),labeledPanel=w.States.stateTransitionPanel(labeledDesign,state.objectId,()=>{});for(const t of labeled.documents.find(d=>d.kind==='stateTransition').transitions){assert.ok(labeledPanel.querySelector(`[data-transition-id="${t.sourceId}"]`).textContent.includes(t.conditionLabel));assert.ok(labeledPanel.querySelector(`[data-transition="${t.sourceId}"]`).textContent.includes(t.condition));}
 const collisions=structuredClone(labeled);for(const t of collisions.documents.find(d=>d.kind==='stateTransition').transitions)t.conditionLabel='同じ表示';const collisionPanel=w.States.stateTransitionPanel(make(collisions),state.objectId,()=>{});for(const t of state.transitions)assert.ok(collisionPanel.querySelector(`[data-transition-id="${t.sourceId}"]`).textContent.includes(t.condition));
 done.push(ids[5]);

 const mainRaw=readFileSync('../work/concept-review/issue-133/versions/purchase-v9-draft-routes-reference-draft.json','utf8'),main=JSON.parse(mainRaw),current=parseDocument(mainRaw);assert.equal(current.markdown,mainRaw);assert.equal(current.model.formatVersion,'0.4');assert.equal(current.model.concepts[0].schemaVersion,'0.2');assert.deepEqual(current.model.checks[0].items.map(i=>i.reviewState),main.documents.find(d=>d.kind==='checkItems').items.map(i=>i.reviewState));const md=readFileSync('web/authorities/business-design.md','utf8');assert.equal(parseDocument(md).markdown,md);
 done.push(ids[6]);oldDone.push(oldIds[4]);

 for(const mutate of [p=>p.documents[0].activities[0].performers[0].roleIds=['missing'],p=>p.documents[0].activities[0].procedure.steps[0].performerObjectIds=['missing'],p=>p.documents[0].relations[0].dataId='missing',p=>p.documents[0].activities[0].results=[],p=>p.documents[1].basedOn.revision='stale',p=>p.documents[2].transitions[0].activityId='missing',p=>p.formatVersion='0.6']){const invalid=structuredClone(seed);mutate(invalid);assert.throws(()=>make(invalid));assert.equal(design.markdown,seedRaw);}
 assert.throws(()=>parseDocument('{"format":"a","format":"b"}'),/Duplicate JSON key/);
 done.push(ids[7]);oldDone.push(oldIds[5]);
 coverage(done);oldCoverage(oldDone);for(const path of Object.keys(authorities))verify(path);
 console.log(JSON.stringify({checks:done,oldAuthority:oldDone,scope:'Node/DOM partial; File adapter and mocked URL. Restore, real Chrome, external server and CI are separate.'}));
}finally{w.close();}
