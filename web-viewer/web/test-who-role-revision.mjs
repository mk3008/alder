import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {parseDocument} from '../src/document-input.ts';
import {activityRole} from '../src/roles.ts';

const path='verification/json-05-who-role-revision.check-items.json';
const expectedHash='f38effb8c318a6b3df0fbc665b6eb32e152891e5dce898ed7756e4739a830548';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const fixed=readFileSync(path),authority=JSON.parse(fixed),ids=Array.from({length:10},(_,i)=>`WHO-ROLE-${String(i+1).padStart(3,'0')}`);
const verifyAuthority=bytes=>assert.equal(hash(bytes),expectedHash,'Who authority changed');
verifyAuthority(fixed);assert.deepEqual(authority.checks.map(c=>c.id),ids);
assert.deepEqual(authority.history.flatMap(h=>h.ids),['JSON05-REINTEGRATE-002','JSON05-REINTEGRATE-003','JSON05-REINTEGRATE-004','JSON05-VIEWER-002']);
const covered=checks=>{assert.equal(new Set(checks).size,checks.length,'duplicate coverage');assert.deepEqual([...checks].sort(),[...ids].sort(),'coverage mismatch');};
assert.throws(()=>covered(ids.slice(1)),/coverage mismatch/);assert.throws(()=>covered([...ids,ids[0]]),/duplicate coverage/);
const changed=structuredClone(authority);changed.checks.shift();assert.throws(()=>verifyAuthority(JSON.stringify(changed)),/Who authority changed/);

const dom=new JSDOM('<body></body>',{runScripts:'outside-only'}),w=dom.window;
const bundle=await build({entryPoints:['src/document-view.ts'],bundle:true,write:false,format:'iife',globalName:'Detail'});w.eval(bundle.outputFiles[0].text+';window.Detail=Detail;');
const detail=(design,id)=>w.Detail.businessDetail(design,id),section=(el,name)=>{const heading=[...el.querySelectorAll('h3')].find(h=>h.textContent===name);assert.ok(heading,`missing ${name}`);return heading.nextElementSibling.textContent;};
const load=p=>parseDocument(JSON.stringify(p));
const original=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v9-draft-routes-reference-draft.json','utf8'));
const cases=JSON.parse(readFileSync('web/fixtures/json-05-d2-cases.json','utf8'));
const packageFor=id=>{const business=structuredClone(cases.find(c=>c.caseId===id).candidate.business);for(const a of business.activities)a.results=a.results.map(r=>({id:r.id,text:r.condition?r.condition+'、'+r.text:r.text}));return {format:'alder-document-package',formatVersion:'0.5',revision:'who-probe',documents:[business],sources:[],externalDocuments:[],diagnostics:[]};};
const seedRaw=readFileSync('web/fixtures/json-05-reviewed-seed.json','utf8'),seed=JSON.parse(seedRaw),checks=[];
try{
 const current=load(original),bd=original.documents.find(d=>d.kind==='businessDesign'),a=bd.activities.find(a=>a.roleId),role=bd.roles.find(r=>r.id===a.roleId);
 assert.equal(activityRole(current,a.id).id,role.id);assert.equal(current.graph.nodes.find(n=>n.id===a.id).who,role.name);assert.equal(section(detail(current,a.id),'Who'),role.name);checks.push(ids[0]);

 const n=structuredClone(original),nbd=n.documents.find(d=>d.kind==='businessDesign'),na=nbd.activities.find(activity=>activity.id===a.id),nr=nbd.roles.find(r=>r.id===na.roleId);nr.name='単一ロールN';
 const nview=load(n);assert.equal(section(detail(nview,na.id),'Who'),'単一ロールN');assert.equal(activityRole(nview,na.id).id,nr.id);assert.equal(nview.graph.nodes.find(node=>node.id===na.id).who,'単一ロールN');checks.push(ids[1]);

 const single=packageFor('photo'),sa=single.documents[0].activities[0],multiRoles=structuredClone(single),oneRole=structuredClone(single),zeroRoles=structuredClone(single);
 oneRole.documents[0].activities[0].performers[0].roleIds=['fx-player'];zeroRoles.documents[0].activities[0].performers[0].roleIds=[];
 for(const p of [oneRole,zeroRoles,multiRoles]){const v=load(p),render=detail(v,sa.id);assert.equal(section(render,'Who'),'未決');assert.match(render.textContent,/旧形式の担当情報/);assert.equal(activityRole(v,sa.id),undefined);assert.equal(v.graph.nodes.find(node=>node.id===sa.id).who,'未決');assert.deepEqual(v.model.business,p.documents[0]);assert.equal(v.markdown,JSON.stringify(p));}
 checks.push(ids[2]);

 const multi=load(multiRoles),multiDetail=detail(multi,sa.id),multiIssue=multi.findings.find(f=>f.id===`viewer:who:${sa.id}`);assert.ok(multiIssue);assert.equal(multiIssue.kind,'correction');assert.match(multiIssue.summary+multiIssue.content,/複数Role/);assert.match(multiIssue.content,/単一.*Role/);for(const s of ['参加者','記録担当']){assert.ok(multiDetail.textContent.includes(s));assert.ok(multiIssue.content.includes(s));}checks.push(ids[3]);

 const legacy=parseDocument(seedRaw),legacyId='c-guidance',legacyDetail=detail(legacy,legacyId),issue=legacy.findings.find(f=>f.id===`viewer:who:${legacyId}`);assert.equal(section(legacyDetail,'Who'),'未決');assert.equal(issue.kind,'correction');for(const s of ['受付担当','受付システム','担当者'])assert.ok(legacyDetail.textContent.includes(s));assert.match(issue.summary+issue.content,/複数.*Object/);
 const unresolved=packageFor('molkkyCross'),ua=unresolved.documents[0].activities[0],unresolvedView=load(unresolved);assert.equal(section(detail(unresolvedView,ua.id),'Who'),'未決');assert.equal(section(detail(unresolvedView,ua.id),'旧形式の担当情報'),'未決');assert.ok(unresolvedView.findings.some(f=>f.id===`viewer:who:${ua.id}`));checks.push(ids[4]);

 const stepIssue=legacy.findings.find(f=>f.id===`viewer:steps:${legacyId}`);assert.ok(stepIssue);assert.match(stepIssue.content,/Activity.*分割/);for(const s of ['旧形式の担当：受付担当','旧形式の担当：受付システム','相談申込を入力する','入力された申込を確認する'])assert.ok(legacyDetail.textContent.includes(s),s);
 const inherited=load(oneRole);assert.match(detail(inherited,sa.id).textContent,/旧形式の担当情報を継承/);
 const pending=structuredClone(seed),pa=pending.documents[0].activities[0];pa.procedure.steps[0].performerObjectIds=null;pending.documents[0].findings.push({id:'who-pending',sourceId:'WHO-PENDING',kind:'question',status:'open',scope:'items',targetIds:[pa.id],unresolvedTargets:[],summary:'旧手順未決',content:'確認する。'});const pendingView=load(pending);assert.match(detail(pendingView,pa.id).textContent,/旧形式の担当：未決/);assert.ok(pendingView.findings.some(f=>f.id===`viewer:steps:${pa.id}`));checks.push(ids[5]);

 const io=structuredClone(unresolved),ioView=load(io),first=io.documents[0].activities[0];assert.ok(io.documents[0].relations.some(r=>r.kind==='input'||r.kind==='output'));assert.equal(ioView.graph.nodes.find(node=>node.id===first.id).who,'未決');assert.equal(activityRole(ioView,first.id),undefined);checks.push(ids[6]);

 assert.equal(legacy.markdown,seedRaw);assert.deepEqual(legacy.model.business,seed.documents[0]);assert.deepEqual(legacy.model.checks[0],seed.documents[1]);assert.deepEqual(legacy.model.states[0],seed.documents[2]);assert.equal(legacy.model.checks[0].items[0].reviewState,'確認済み');assert.ok(!legacy.model.business.findings.some(f=>f.id.startsWith('viewer:')));
 const invalid=structuredClone(seed);invalid.documents[0].activities[0].performers[0].roleIds=['no-such-role'];assert.throws(()=>load(invalid));assert.equal(legacy.markdown,seedRaw);checks.push(ids[7]);

 assert.equal(current.model.formatVersion,'0.4');assert.equal(current.model.concepts[0].schemaVersion,'0.2');const md=readFileSync('web/authorities/business-design.md','utf8');assert.equal(parseDocument(md).markdown,md);checks.push(ids[8]);
 assert.match(legacyDetail.textContent,/受付システム/);assert.equal(activityRole(legacy,legacyId),undefined);assert.equal(section(legacyDetail,'Who'),'未決');checks.push(ids[9]);
 covered(checks);verifyAuthority(readFileSync(path));
 console.log(JSON.stringify({authority:expectedHash,checks,scope:'Node/DOM; real Chrome, URL/restore and physical-device review are separate'}));
}finally{w.close();}
