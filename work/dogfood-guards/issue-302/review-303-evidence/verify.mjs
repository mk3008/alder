import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {upgradeRoles} from '../../../alder/tools/document_storage/roles.mjs';
const here=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(here,'../../..'),tool=path.join(root,'alder/tools/document_storage');
const exec=(script,...args)=>{const r=spawnSync(process.execPath,[path.join(tool,script),...args],{encoding:'utf8'});return {status:r.status,stdout:r.stdout.trim(),stderr:r.stderr.trim()};};
const write=(name,v)=>{const file=path.join(here,name);fs.writeFileSync(file,JSON.stringify(v));return file;};
const legacy=JSON.parse(fs.readFileSync(path.join(root,'alder/work/json-state/issue-275/purchase.json'))),bd=legacy.documents[0],st=legacy.documents[1];
const p03=upgradeRoles(legacy,{expectedRevision:legacy.revision,revision:'verify-03',documentRevisions:{[bd.id]:{expected:bd.revision,next:'verify-bd-03'},[st.id]:{expected:st.revision,next:'verify-st-03'}}});
const p04=JSON.parse(fs.readFileSync(path.join(root,'alder/work/viewer-json/issue-274/json-native/independent.json')));
const report={};
for(const fixture of [p03,p04]){
 const version=fixture.formatVersion,p=structuredClone(fixture),a=p.documents[0].activities[0];a.roleId=null;a.who='申請者と承認者';
 const current=`Role未確定: ${a.id} — ${a.who}`,stale=`Role未確定: ${a.id} — 旧原文`;
 const cases={current:[current],stale:[stale],currentThenStale:[current,stale],staleThenCurrent:[stale,current],duplicate:[current,current],unknown:[current,'Role未確定: unknown-activity — '+a.who],object:[current,'Role未確定: '+p.documents[0].objects[0].id+' — '+a.who]};
 report[version]={};
 for(const [label,diagnostics] of Object.entries(cases)){
  const q=structuredClone(p);q.diagnostics=['unrelated diagnostic',...diagnostics];const file=write(`${version}-${label}.json`,q);
  const result=exec('cli.mjs','validate',file);report[version][label]={status:result.status,message:result.stderr||result.stdout};
 }
 const resolved=structuredClone(p);resolved.documents[0].activities[0].roleId=resolved.documents[0].roles[0].id;resolved.diagnostics=['unrelated diagnostic',current];
 report[version].resolvedStale=exec('cli.mjs','validate',write(`${version}-resolved-stale.json`,resolved)).status;
 resolved.diagnostics=['unrelated diagnostic'];report[version].resolvedClean=exec('cli.mjs','validate',write(`${version}-resolved-clean.json`,resolved)).status;
 const valid=structuredClone(p);valid.diagnostics=['unrelated diagnostic',current];
 const candidate=write(`${version}-candidate.json`,valid),target=path.join(here,`${version}-saved.json`),op=write(`${version}-op.json`,{});
 report[version].createValid=exec('author-cli.mjs','create',candidate,target,op).status;
 const before=fs.readFileSync(target),info=exec('author-cli.mjs','inspect',target);report[version].inspectValid=info.status;
 const bad=structuredClone(valid);bad.revision+='-next';bad.diagnostics.push(stale);
 write(`${version}-bad.json`,bad);
 report[version].createMixed=exec('author-cli.mjs','create',path.join(here,`${version}-bad.json`),path.join(here,`${version}-invalid-output.json`),op).status;
 report[version].invalidOutputExists=fs.existsSync(path.join(here,`${version}-invalid-output.json`));
 write(`${version}-commit-op.json`,{expectedRevision:valid.revision,expectedSha256:JSON.parse(info.stdout).sha256});
 report[version].commitMixed=exec('author-cli.mjs','commit',target,path.join(here,`${version}-bad.json`),path.join(here,`${version}-commit-op.json`)).status;
 report[version].savedBytesUnchanged=fs.readFileSync(target).equals(before);
 report[version].unrelatedRetained=JSON.parse(fs.readFileSync(target)).diagnostics[0]==='unrelated diagnostic';
}
fs.writeFileSync(path.join(here,'results.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(Object.fromEntries(Object.entries(report).map(([v,cases])=>[v,Object.fromEntries(Object.entries(cases).map(([k,r])=>[k,typeof r==='object'?r.status:r]))]))));
