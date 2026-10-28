// One fixed regression probe. Run against either runtime without changing inputs.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const runtime=path.resolve(process.argv[2]??'tools/document_storage');
const input=process.argv[3]??new URL('./evidence/role-stale-before.json',import.meta.url);
const fixture=JSON.parse(fs.readFileSync(input,'utf8'));
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'alder-302-role-'));
const candidate=path.join(dir,'candidate.json'),target=path.join(dir,'saved.json'),op=path.join(dir,'operation.json');
const hash=b=>createHash('sha256').update(b).digest('hex');
const rows=[];
const run=(label,script,args)=>{
 const r=spawnSync(process.execPath,[path.join(runtime,script),...args],{encoding:'utf8'});
 const row={label,status:r.status,stdout:r.stdout,stderr:r.stderr};rows.push(row);return row;
};
try{
 fs.writeFileSync(candidate,JSON.stringify(fixture));fs.writeFileSync(op,'{}');
 run('stale-validate','cli.mjs',['validate',candidate]);
 run('stale-create','author-cli.mjs',['create',candidate,path.join(dir,'invalid.json'),op]);
 const good=structuredClone(fixture),bd=good.documents.find(d=>d.kind==='businessDesign');
 const activity=bd.activities.find(a=>a.roleId===null);
 good.diagnostics=['unrelated diagnostic','Role未確定: '+activity.id+' — '+activity.who];
 fs.writeFileSync(candidate,JSON.stringify(good));
 run('exact-create','author-cli.mjs',['create',candidate,target,op]);
 const before=fs.readFileSync(target),inspect=run('exact-inspect','author-cli.mjs',['inspect',target]);
 const pin=JSON.parse(inspect.stdout),bad=structuredClone(good);
 bad.revision+='-next';bad.documents[0].revision+='-next';
 bad.documents[0].activities.find(a=>a.id===activity.id).who+='（変更）';
 for(const d of bad.documents.filter(d=>d.basedOn?.documentId===bd.id)){d.revision+='-next';d.basedOn.revision=bad.documents[0].revision;}
 bad.diagnostics=fixture.diagnostics;
 fs.writeFileSync(candidate,JSON.stringify(bad));
 fs.writeFileSync(op,JSON.stringify({expectedRevision:pin.revision,expectedSha256:pin.sha256}));
 run('stale-commit','author-cli.mjs',['commit',target,candidate,op]);
 const preserved=before.equals(fs.readFileSync(target));
 console.log(JSON.stringify({inputSha256:hash(fs.readFileSync(input)),runtime,rows,preserved},null,2));
 for(const row of rows)assert.equal(row.status,row.label.startsWith('stale-')?2:0,row.label);
 assert.equal(preserved,true,'failed commit must preserve saved bytes');
}finally{fs.rmSync(dir,{recursive:true,force:true});}
