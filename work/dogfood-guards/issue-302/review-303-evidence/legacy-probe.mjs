import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const root=path.resolve(process.argv[2]??'alder');
const {parseDocument,normalizeDocument}=await import(pathToFileURL(path.join(root,'web-viewer/src/document-input.ts')));
const {upgradeRoles}=await import(pathToFileURL(path.join(root,'tools/document_storage/roles.mjs')));
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const old=read('work/plugin-json/issue-273/snapshots/04-final-after-replay.json'),states=read('work/json-state/issue-275/purchase.json');
const results=[];
for(const pkg of [old,states]){
 pkg.diagnostics.push('legacy-note preserved');const raw=JSON.stringify(pkg);
 try{
  const normalized=normalizeDocument(raw),design=parseDocument(raw);
  assert.equal(normalized.original.text,raw);assert.equal(design.markdown,raw);
  assert.equal(normalized.data.business.schemaVersion,'0.1');assert.equal(normalized.data.business.roles,undefined);
  assert.ok(normalized.data.business.activities.every(a=>!Object.hasOwn(a,'roleId')));
  assert.ok(normalized.data.diagnostics.includes('legacy-note preserved'));
  assert.ok(!normalized.data.diagnostics.some(d=>d.startsWith('Role未確定:')));
  results.push({format:pkg.formatVersion,legacyLoad:'pass',nodes:design.graph.nodes.length,originalAndUnrelatedDiagnosticPreserved:true});
 }catch(error){results.push({format:pkg.formatVersion,legacyLoad:'fail',error:error.message});}
}
const modern=upgradeRoles(states,{expectedRevision:states.revision,revision:'legacy-probe-roles',documentRevisions:Object.fromEntries(states.documents.map(d=>[d.id,{expected:d.revision,next:d.revision+'-roles'}]))});
for(const pkg of [modern,read('work/viewer-json/issue-274/json-native/independent.json')]){
 parseDocument(JSON.stringify(pkg));const p=structuredClone(pkg),a=p.documents[0].activities.find(a=>a.roleId!==null);
 a.roleId=null;a.who='申請者と承認者';p.diagnostics.push('Role未確定: '+a.id+' — '+a.who,'Role未確定: '+a.id+' — 旧原文');
 assert.throws(()=>parseDocument(JSON.stringify(p)),/diagnostic/);
 results.push({format:pkg.formatVersion,currentRoleInput:'pass',mixedStaleRejected:true});
}
console.log(JSON.stringify({results},null,2));
assert.ok(results.every(r=>r.legacyLoad!=='fail'));
