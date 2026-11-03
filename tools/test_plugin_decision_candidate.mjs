import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cpSync,mkdtempSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import path from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';

// Exercise only the copied bundle: no repository module may be resolved at runtime.
test('isolated candidate bundle creates unreviewed decisions and protects migration source',()=>{
 const root=mkdtempSync(path.join(tmpdir(),'alder-plugin-decision-'));try{
  const skill=path.join(root,'installed'),sourceSkill='plugins/alder/skills/alder-manage-json-documents';cpSync(sourceSkill,skill,{recursive:true});
  const scripts=path.join(skill,'scripts/document_storage'),run=(name,...args)=>spawnSync(process.execPath,[path.join(scripts,name),...args],{cwd:root,encoding:'utf8',env:{...process.env,ALDER_PYTHON:'/no-python'}});
  const fixture=path.join(scripts,'examples/molkky-decisions-v07.json'),target=path.join(root,'candidate.json'),operation=path.join(root,'operation.json');writeFileSync(operation,'{}');
  const created=run('author-cli.mjs','create',fixture,target,operation);assert.equal(created.status,0,created.stderr);const raw=readFileSync(target,'utf8'),pkg=JSON.parse(raw);assert.equal(pkg.formatVersion,'0.7');assert.equal(pkg.documents.find(d=>d.kind==='checkItems').items.every(item=>item.reviewState==='未レビュー'),true);
  const before=JSON.parse(run('author-cli.mjs','inspect',target).stdout);assert.equal(run('cli.mjs','validate',target).status,0);assert.equal(readFileSync(target,'utf8'),raw);
  const changed=structuredClone(pkg);changed.documents[0].activities[0].decisions[1].note='変わった業務条件';const altered=path.join(root,'altered.json');writeFileSync(altered,JSON.stringify(changed));const after=JSON.parse(run('author-cli.mjs','inspect',altered).stdout);assert.notEqual(before.checks.find(item=>item.id==='check-01').meaningSha256,after.checks.find(item=>item.id==='check-01').meaningSha256);assert.equal(before.checks.find(item=>item.id==='check-04').meaningSha256,after.checks.find(item=>item.id==='check-04').meaningSha256);
  const broken=structuredClone(pkg);broken.documents[0].activities[0].procedure.steps[1].decisionIds=['missing'];const bad=path.join(root,'bad.json');writeFileSync(bad,JSON.stringify(broken));assert.notEqual(run('cli.mjs','validate',bad).status,0);assert.equal(readFileSync(target,'utf8'),raw);
  const old=readFileSync('tools/document_storage/examples/continuity-draft-v06.json','utf8'),oldPkg=JSON.parse(old),oldFile=path.join(root,'source.json'),request=path.join(root,'request.json'),prepared=path.join(root,'prepared.json');writeFileSync(oldFile,old);writeFileSync(request,JSON.stringify({expectedSha256:createHash('sha256').update(old).digest('hex'),expectedRevision:oldPkg.revision,revision:'new-package',businessRevisions:{[oldPkg.documents[0].id]:'new-bd'}}));
  const migration=run('author-cli.mjs','prepare-decision-upgrade',oldFile,prepared,request);assert.equal(migration.status,0,migration.stderr);assert.equal(readFileSync(oldFile,'utf8'),old);assert.equal(JSON.parse(readFileSync(prepared,'utf8')).formatVersion,'0.7');assert.notEqual(run('author-cli.mjs','prepare-decision-upgrade',oldFile,prepared,request).status,0);
 }finally{rmSync(root,{recursive:true,force:true});}
});
