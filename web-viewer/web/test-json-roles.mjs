import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {parseDocument,normalizeDocument} from '../src/document-input.ts';import {activityRole,roleGroupKey} from '../src/roles.ts';import {reconcile} from '../src/session.ts';import {activityDesign} from '../src/activities.ts';import {resetLayout} from '../src/layout-reset.ts';import './json-layout-protection.mjs';
import {readLegacyPackage} from '../../tools/document_storage/legacy-json.mjs';
const dir='../work/json-roles/issue-280/',raw=readFileSync(dir+'same-business.roles.json','utf8'),pkg=JSON.parse(raw),bd=pkg.documents[0],modern=parseDocument(raw),old=parseDocument(readFileSync('../work/viewer-json/issue-274/layout-regression/same-business.json','utf8'));
for(const id of [undefined,...old.activityOrder]){const legacy=activityDesign(old,id),now=activityDesign(modern,id),base={key:'role-test',name:'roles',positions:{},scroll:[0,0],zoom:1,activity:id};assert.deepEqual(now.graph,legacy.graph);assert.deepEqual(now.activityOrder,legacy.activityOrder);assert.deepEqual(resetLayout({...base,design:now}).positions,resetLayout({...base,design:legacy}).positions);}
for(const r of bd.roles)for(const a of bd.activities.filter(a=>a.roleId===r.id)){assert.equal(activityRole(modern,a.id).id,r.id);assert.equal(activityRole(modern,a.id).color,r.color);}
const role=bd.roles[0],members=bd.activities.filter(a=>a.roleId===role.id);for(const a of members){assert.equal(activityRole(modern,a.id).color,role.color);assert.equal(roleGroupKey(modern,a.id,a.who),role.id);}
const renamed=structuredClone(pkg);renamed.revision='p-next';renamed.documents[0].revision='bd-next';renamed.documents[0].roles[0].name='名前を変えても同じロール';renamed.documents[0].roles.reverse();renamed.documents[0].activities.reverse();const next=parseDocument(JSON.stringify(renamed)),before=reconcile({key:'r',name:'r',design:modern,positions:{},scroll:[31,42],zoom:1.2,selected:members[0].id},modern),after=reconcile(before,next);assert.deepEqual(after.positions,before.positions);assert.deepEqual(after.scroll,before.scroll);assert.equal(after.selected,before.selected);
for(const a of members){assert.equal(next.graph.nodes.find(n=>n.id===a.id).who,'名前を変えても同じロール');assert.equal(activityRole(next,a.id).id,role.id);assert.equal(activityRole(next,a.id).color,role.color);}assert.equal(pkg.documents[0].roles[0].name,role.name);assert.equal(modern.markdown,raw);
const checks=JSON.parse(readFileSync(dir+'gate-b.roles.json','utf8')),checkDesign=parseDocument(JSON.stringify(checks));assert.equal(checkDesign.model.checks[0].basedOn.verification,'unverified');assert.deepEqual(checkDesign.model.checks[0].items.map(i=>i.reviewState),JSON.parse(readFileSync('../work/plugin-json/issue-273/snapshots/04-final-after-replay.json','utf8')).documents[1].items.map(i=>i.reviewState));
assert.equal(parseDocument(readFileSync(dir+'purchase.roles.json','utf8')).model.states[0].transitions.find(t=>t.sourceId==='T12').toId,'@unknown');console.log('Stored role identity/color, rename/reorder/camera, old JSON, Check states and partial State coexistence passed; all 11 world layouts exact');

// Pre-Role viewing retires its derived catalog and diagnostics together, without rewriting the source.
for(const source of [readFileSync('../work/plugin-json/issue-273/snapshots/04-final-after-replay.json','utf8'),readFileSync('../work/json-state/issue-275/purchase.json','utf8')]){
 const legacy=JSON.parse(source);legacy.diagnostics.push('legacy-note preserved');const original=JSON.stringify(legacy),normalized=normalizeDocument(original);
 assert.equal(normalized.original.text,original);assert.equal(parseDocument(original).markdown,original);
 assert.equal(normalized.data.business.schemaVersion,'0.1');assert.equal(normalized.data.business.roles,undefined);
 assert.ok(normalized.data.business.activities.every(a=>!Object.hasOwn(a,'roleId')));
 assert.ok(normalized.data.diagnostics.includes('legacy-note preserved'));assert.ok(!normalized.data.diagnostics.some(d=>d.startsWith('Role未確定:')));
 legacy.diagnostics.push('Role未確定: missing-activity — 旧原文');assert.throws(()=>parseDocument(JSON.stringify(legacy)),/diagnostic/);
}
// Actual Role-bearing source remains strictly checked before any viewing projection.
for(const source of [pkg,readLegacyPackage(pkg)]){
 assert.ok(parseDocument(JSON.stringify(source)).model.business.roles.length>0);
 const bad=structuredClone(source),activity=bad.documents[0].activities.find(a=>a.roleId!==null);activity.roleId=null;activity.who='申請者と承認者';
 bad.diagnostics.push('Role未確定: '+activity.id+' — '+activity.who,'Role未確定: '+activity.id+' — 旧原文');
 assert.throws(()=>parseDocument(JSON.stringify(bad)),/diagnostic/);
}
console.log('Pre-Role JSON 0.1/0.2 projection preserves source/notes; actual 0.3/0.4 Role mixtures still reject');
