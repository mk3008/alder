// Replays the Codex-authored JSON snapshots against an isolated candidate installation.
// Human receipts in this replay are explicitly simulated fixtures, not real approvals.
import fs from 'node:fs';import path from 'node:path';import {pathToFileURL,fileURLToPath} from 'node:url';import {spawnSync} from 'node:child_process';import assert from 'node:assert/strict';
const here=fileURLToPath(new URL('./',import.meta.url)),[scriptDir,outputDir]=process.argv.slice(2);assert.ok(scriptDir&&outputDir);
const dir=path.resolve(scriptDir),out=path.resolve(outputDir);fs.mkdirSync(out,{recursive:true});
const {meaningHash}=await import(pathToFileURL(path.join(dir,'authoring.mjs')).href);
const cli=path.join(dir,'author-cli.mjs'),log=[];
const invoke=(args,expected=0)=>{const r=spawnSync(process.execPath,[cli,...args],{encoding:'utf8',cwd:out});log.push({args,status:r.status,stdout:r.stdout,stderr:r.stderr});assert.equal(r.status,expected,r.stderr);return r.stdout?JSON.parse(r.stdout):null;};
const read=name=>JSON.parse(fs.readFileSync(path.join(here,'snapshots',name),'utf8'));
const write=(name,p)=>{const f=path.join(out,name);fs.writeFileSync(f,JSON.stringify(p,null,2)+'\n');return f;};
const target=path.join(out,'design.json'),candidate=path.join(out,'candidate.json'),opfile=path.join(out,'operation.json');
const fake=(bd)=>({bdConfirmations:[{documentId:bd.id,revision:bd.revision,evidence:{source:'fixture:inputs/notes.ja.md#模擬人間イベント',quote:bd.revision+'の業務内容を未決事項を残したまま合意する（試験用）'}}]});
const bd=p=>p.documents[0],checks=p=>p.documents.find(d=>d.kind==='checkItems');
const inspected=()=>invoke(['inspect',target]);
const save=(p,extra={},expected=0)=>{const previous=inspected();write('candidate.json',p);write('operation.json',{expectedSha256:previous.sha256,expectedRevision:previous.revision,...extra});const before=fs.readFileSync(target,'utf8');invoke(['commit',target,candidate,opfile],expected);if(expected!==0)assert.equal(fs.readFileSync(target,'utf8'),before);};
invoke(['runtime']);const p1=read('01-direct-bd.json');write('candidate.json',p1);write('operation.json',{});invoke(['create',candidate,target,opfile]);
const p2=read('02-add-rename.json');save(p2);const p3=read('03-direct-checks.json');save(p3,{},2);save(p3,fake(bd(p3)));
const p4=structuredClone(p3);p4.revision='package-4';checks(p4).revision='checks-2';const first=checks(p4).items.find(i=>i.checkId==='CI-001');first.reviewState='確認済み';save(p4,{},2);
save(p4,{...fake(bd(p4)),humanDecisions:[{id:first.id,state:'確認済み',meaningSha256:meaningHash(p4,first),evidence:{source:'fixture:inputs/notes.ja.md#模擬人間イベント2',quote:'CI-001の条件と期待結果を確認する。他の項目の合意は与えない。（試験用）'}}]});
const p5=structuredClone(p4);p5.revision='package-5';bd(p5).revision='bd-3';bd(p5).activities[0].why+='記録した対象を後続で確認する。';checks(p5).revision='checks-3';checks(p5).basedOn.revision='bd-3';save(p5,{},2);save(p5,fake(bd(p5)));assert.equal(checks(p5).items.find(i=>i.checkId==='CI-001').reviewState,'確認済み');
const bad=structuredClone(p5);bad.revision='package-6';checks(bad).revision='checks-4';checks(bad).basedOn.revision='wrong';save(bad,fake(bd(bad)),2);
const p6=structuredClone(p5);p6.revision='package-6';checks(p6).revision='checks-4';checks(p6).guarantees[1].blocks[0].content[0].value+='（未承認の表現候補）';save(p6,fake(bd(p6)),2);
for(const item of checks(p6).items)if(['CI-002','CI-003'].includes(item.checkId))item.reviewState='要確認';save(p6,fake(bd(p6)));
const p7=structuredClone(p6);p7.revision='package-7';checks(p7).revision='checks-5';checks(p7).items.reverse();save(p7,fake(bd(p7)));
assert.equal(checks(p7).basedOn.verification,'unverified');assert.deepEqual(bd(p7).findings,bd(p2).findings);assert.equal(checks(p7).items.filter(i=>i.reviewState==='確認済み').length,1);
const validation=spawnSync(process.execPath,[path.join(dir,'cli.mjs'),'validate',target],{cwd:out,encoding:'utf8'});assert.equal(validation.status,0,validation.stderr);
const result={status:'passed',kind:'deterministic replay of Codex direct-JSON artifacts',businessApproval:'all positive human receipts are synthetic fixtures',node:process.version,scriptDir:dir,commands:log,finalValidation:JSON.parse(validation.stdout),limitations:['No marketplace registration or automatic skill selection proven','No real requester approval or semantic correctness inferred','No Viewer runtime integration']};
fs.writeFileSync(path.join(out,'replay-results.json'),JSON.stringify(result,null,2)+'\n');fs.writeFileSync(path.join(out,'final.json'),JSON.stringify(p7,null,2)+'\n');console.log(JSON.stringify({status:result.status,commands:log.length,finalValidation:result.finalValidation}));
