import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {parseDocument,readDesignFile} from '../src/document-input.ts';

// Requirements were committed before the implementation. Missing checks,
// cases, or results must fail instead of silently shrinking verification.
const authorityBytes=readFileSync('verification/json-05-viewer.check-items.json');
assert.equal(createHash('sha256').update(authorityBytes).digest('hex'),'c1f6f0be6e7400cd5c84cafce067656d2d3aa4dcd4a4ac0518fdf3927d452f77');
const authority=JSON.parse(authorityBytes),ids=['JSON05-VIEWER-001','JSON05-VIEWER-002','JSON05-VIEWER-003','JSON05-VIEWER-004','JSON05-VIEWER-005','JSON05-VIEWER-006'];
assert.deepEqual(authority.checks.map(c=>c.id),ids);
const cases=['molkkyCross','mixed','photo','synthetic','molkky'];
const cover=(required,results)=>{assert.deepEqual(Object.keys(results).sort(),[...required].sort());for(const id of required)assert.equal(results[id],true,id);};
assert.throws(()=>cover(ids.slice(0,-1),Object.fromEntries(ids.map(id=>[id,true]))));
assert.throws(()=>cover(cases,Object.fromEntries(cases.slice(0,-1).map(id=>[id,true]))));
assert.throws(()=>cover(ids,Object.fromEntries(ids.map(id=>[id,id!==ids[0]]))));

const adopted=JSON.parse(readFileSync('../tools/document_storage/examples/d2-cases.json','utf8'));
assert.deepEqual(adopted.map(c=>c.caseId),cases);
const packages=adopted.map(c=>{const business=structuredClone(c.candidate.business);for(const a of business.activities)a.results=a.results.map(r=>({id:r.id,text:r.condition?r.condition+'、'+r.text:r.text}));return {caseId:c.caseId,package:{format:'alder-document-package',formatVersion:'0.5',revision:'viewer-case-1',documents:[business],sources:[],externalDocuments:[],diagnostics:[]}};});
const results={};
for(const c of packages){const raw=JSON.stringify(c.package),design=parseDocument(raw);assert.equal(design.markdown,raw);assert.equal(design.model.formatVersion,'0.5');assert.deepEqual(design.model.business,c.package.documents[0]);assert.equal(design.graph.nodes.length,c.package.documents[0].objects.length+c.package.documents[0].activities.length);results[c.caseId]=true;}
cover(cases,results);
const raw=readFileSync('../work/viewer-json/issue-312/synthetic.json','utf8'),pkg=JSON.parse(raw),design=parseDocument(raw),bd=pkg.documents[0],activity=bd.activities[0];
const fromFile=await readDesignFile({name:'sample.json',type:'application/json',size:Buffer.byteLength(raw),text:async()=>raw});assert.equal(fromFile.markdown,raw);assert.deepEqual(fromFile.model.business,bd);
const compiled=await build({entryPoints:['src/document-view.ts'],bundle:true,write:false,format:'iife',globalName:'view'}),dom=new JSDOM('<body></body>',{runScripts:'outside-only'});
dom.window.eval(compiled.outputFiles[0].text+'\nwindow.view=view;');
try{
 const detail=dom.window.view.businessDetail(design,activity.id).textContent;
 for(const value of ['受付担当','受付システム','記録担当','相談申込を入力する','入力された申込を確認する','次の連絡方法を案内する','任意','依頼者が案内を希望する場合','手順1 → 手順2','手順2・3は入替可能','依頼者へ担当窓口が説明される','依頼者へ次の連絡方法が説明される','連絡案内','その相談の担当窓口','次の連絡方法','相談に応じて案内する窓口'])assert.ok(detail.includes(value),value);
 assert.doesNotMatch(detail,/c-guidance|mix-input|data-c-output|\[object Object\]|undefined/);
 assert.deepEqual(design.graph.relations.map(r=>[r.kind,r.label]).sort(),[['input','連絡案内'],['output','連絡案内']]);
 assert.ok(dom.window.view.businessDetail(design,'c-requester').textContent.includes('相談に応じて案内する窓口'));
 const unresolved=packages.find(c=>c.caseId==='molkkyCross'),unknown=parseDocument(JSON.stringify(unresolved.package));assert.match(dom.window.view.businessDetail(unknown,unknown.model.business.activities[0].id).textContent,/未決/);
 const photo=packages.find(c=>c.caseId==='photo'),one=structuredClone(photo.package),step=one.documents[0].activities[0].procedure.steps[0];step.performerObjectIds=null;const oneDesign=parseDocument(JSON.stringify(one)),oneDetail=dom.window.view.businessDetail(oneDesign,one.documents[0].activities[0].id).textContent;assert.match(oneDetail,/参加者/);assert.match(oneDetail,/記録/);assert.doesNotMatch(oneDetail,/担当：未決/);
 const multi=structuredClone(pkg);multi.documents[0].activities[0].procedure.steps[0].performerObjectIds=null;multi.documents[0].findings.push({id:'unknown-owner',sourceId:'OWNER-1',kind:'question',status:'open',scope:'items',targetIds:[activity.id],unresolvedTargets:[],summary:'手順担当未決',content:'担当は確認する。'});const multiDesign=parseDocument(JSON.stringify(multi));assert.match(dom.window.view.businessDetail(multiDesign,activity.id).textContent,/担当：未決/);
}finally{dom.window.close();}
for(const mutate of [p=>p.formatVersion='0.6',p=>p.documents[0].activities[0].results=[],p=>p.documents[0].relations[0].dataId='missing',p=>p.documents[0].activities[0].performers[0].roleIds=['missing'],p=>p.documents[0].activities[0].results[0].condition=null]){const bad=structuredClone(pkg);mutate(bad);assert.throws(()=>parseDocument(JSON.stringify(bad)));assert.equal(design.markdown,raw);}
assert.throws(()=>parseDocument('{"format":"x","format":"y"}'),/Duplicate JSON key/);
const old=readFileSync('../work/plugin-json/issue-273/snapshots/04-final-after-replay.json','utf8'),md=readFileSync('web/authorities/business-design.md','utf8');assert.equal(parseDocument(old).markdown,old);assert.equal(parseDocument(md).markdown,md);
// This early test covers parts of each requirement, not final acceptance.
const partial=Object.fromEntries(ids.map(id=>[id,'partial']));
const checkStage=(required,observed)=>{assert.deepEqual(Object.keys(observed),required);for(const id of required)assert.equal(observed[id],'partial');};
checkStage(ids,partial);assert.throws(()=>checkStage(ids,Object.fromEntries(Object.entries(partial).slice(1))));assert.throws(()=>checkStage(ids,{...partial,[ids[0]]:undefined}));
console.log(JSON.stringify({authority:'verification/json-05-viewer.check-items.json',checks:partial,cases,scope:'normal parser, File adapter, DOM details, adopted fixtures and negative input; URL, restoration, Chrome and human review remain separate'}));
