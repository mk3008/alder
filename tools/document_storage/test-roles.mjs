import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {validate,graphV1} from './core.mjs';import {ROLE_PALETTE,initialRoleColor,upgradeRoles} from './roles.mjs';import {convertMarkdown} from './convert.mjs';import {guardAuthoring} from './authoring.mjs';import {applyEdits} from './edit.mjs';
const legacy=JSON.parse(fs.readFileSync(new URL('../../work/json-state/issue-275/purchase.json',import.meta.url))),bd=legacy.documents[0],state=legacy.documents[1];
const revisions={expectedRevision:legacy.revision,revision:'package-roles-1',documentRevisions:{[bd.id]:{expected:bd.revision,next:'bd-role-1'},[state.id]:{expected:state.revision,next:'state-role-1'}}};
const upgraded=upgradeRoles(legacy,revisions);
test('0.1/0.2 remain accepted; explicit 0.3 migration preserves IDs, raw Who, provenance and partial states',()=>{
 validate(legacy);validate(upgraded);const oldIDs=[...bd.objects,...bd.activities].map(e=>e.id);assert.deepEqual([...upgraded.documents[0].objects,...upgraded.documents[0].activities].map(e=>e.id),oldIDs);assert.deepEqual(upgraded.sources,legacy.sources);assert.deepEqual(upgraded.documents[0].activities.map(a=>a.who),bd.activities.map(a=>a.who));
 assert.deepEqual(upgraded.documents[1].transitions,state.transitions);assert.equal(upgraded.documents[1].basedOn.revision,'bd-role-1');assert.equal(upgraded.documents[1].basedOn.verification,'unverified');assert.throws(()=>guardAuthoring(legacy,upgraded,{expectedRevision:legacy.revision}),/contract changed/);guardAuthoring(legacy,upgraded,{expectedRevision:legacy.revision,migration:'roles-0.3'});
 assert.deepEqual(graphV1(upgraded,bd.id),graphV1(legacy,bd.id));assert.throws(()=>upgradeRoles(legacy,{...revisions,expectedRevision:'wrong'}));assert.throws(()=>upgradeRoles(legacy,{...revisions,documentRevisions:{}}));
});
test('stored palette values equal legacy hash initially; rename/reorder preserve role ID and color',()=>{
 const b=upgraded.documents[0],role=b.roles[0],members=b.activities.filter(a=>a.roleId===role.id);assert.ok(members.length);for(const r of b.roles)assert.equal(r.color,initialRoleColor(r.name));assert.equal(ROLE_PALETTE.length,5);
 const next=applyEdits(upgraded,{expectedRevision:upgraded.revision,revision:'p-next',documentRevisions:{[b.id]:{expected:b.revision,next:'bd-next'},[state.id]:{expected:'state-role-1',next:'state-next'}},changes:[{id:role.id,values:{name:'新しいロール名'}},{id:b.id,values:{roles:[{...role,name:'新しいロール名'},...b.roles.slice(1).reverse()],activities:[...b.activities].reverse()}},{id:state.id,values:{basedOn:{...upgraded.documents[1].basedOn,revision:'bd-next'}}}]});guardAuthoring(upgraded,next,{expectedRevision:upgraded.revision});const actual=next.documents[0].roles.find(r=>r.id===role.id);assert.equal(actual.color,role.color);assert.equal(actual.name,'新しいロール名');assert.deepEqual(next.documents[0].activities.filter(a=>a.roleId===role.id).map(a=>a.id).sort(),members.map(a=>a.id).sort());
});
test('unknown roles, duplicate IDs/names, invalid colors, stale references and wrong package/schema versions reject',()=>{
 for(const mutate of [p=>p.documents[0].activities[0].roleId='missing',p=>p.documents[0].roles.push({...p.documents[0].roles[0]}),p=>p.documents[0].roles.push({...p.documents[0].roles[0],id:'new-role'}),p=>p.documents[0].roles[0].color='red',p=>p.documents[0].roles.splice(0,1),p=>p.formatVersion='0.2',p=>p.documents[0].schemaVersion='0.1',p=>p.formatVersion='0.4',p=>p.documents[0].activities[0].roleId=state.id]){const pkg=structuredClone(upgraded);mutate(pkg);assert.throws(()=>validate(pkg));}
});
test('MD conversion is explicit, repeatable and reimport retains renamed catalog identity/color',()=>{
 const md=fs.readFileSync(new URL('../../work/json-state/issue-275/supported-state.md',import.meta.url),'utf8'),request={sources:[{text:md,documentId:bd.id,kind:'businessDesign',revision:bd.revision}],revision:legacy.revision,stateDocuments:[{documentId:state.id,revision:state.revision,businessDesignId:bd.id,objectName:'購入申請'}],roleCatalog:true};
 const pkg=convertMarkdown(request).package;assert.equal(pkg.formatVersion,'0.3');assert.deepEqual(convertMarkdown(request).package,pkg);assert.deepEqual(convertMarkdown({...request,previousPackage:pkg,expectedRevision:pkg.revision}).package,pkg);
 const renamed=structuredClone(pkg);renamed.documents[0].roles[0].name='改名後';renamed.documents[0].roles[0].color=ROLE_PALETTE[(ROLE_PALETTE.indexOf(renamed.documents[0].roles[0].color)+1)%5];
 assert.deepEqual(convertMarkdown({...request,previousPackage:renamed,expectedRevision:pkg.revision}).package.documents[0].roles,renamed.documents[0].roles);
});
test('compound Who is retained verbatim and unresolved; more than five explicit roles can reuse colors',()=>{
 const p=structuredClone(legacy);p.documents[0].activities[0].who='申請者と承認者';const next=upgradeRoles(p,revisions);assert.equal(next.documents[0].activities[0].roleId,null);assert.equal(next.documents[0].activities[0].who,'申請者と承認者');assert.ok(next.diagnostics.some(d=>d.includes('Role未確定:')));next.diagnostics=[];assert.throws(()=>validate(next),/diagnostic/);
 const many=structuredClone(upgraded),b=many.documents[0];for(let i=0;i<7;i++)b.roles.push({id:'extra-'+i,name:'明示役割'+i,color:ROLE_PALETTE[i%5]});validate(many);assert.ok(b.roles.length>5);
});
test('Check migration needs exact human BD confirmation and preserves every review state/meaning',()=>{
 const prior=JSON.parse(fs.readFileSync(new URL('../../work/plugin-json/issue-273/snapshots/04-final-after-replay.json',import.meta.url))),documentRevisions=Object.fromEntries(prior.documents.map(d=>[d.id,{expected:d.revision,next:d.revision+'-roles'}])),next=upgradeRoles(prior,{expectedRevision:prior.revision,revision:'roles-check-package',documentRevisions}),operation={expectedRevision:prior.revision,migration:'roles-0.3'};
 assert.throws(()=>guardAuthoring(prior,next,operation),/Human Business Design confirmation/);
 assert.deepEqual(next.documents[1].items,prior.documents[1].items);assert.equal(next.documents[1].basedOn.verification,'unverified');
 guardAuthoring(prior,next,{...operation,bdConfirmations:[{documentId:next.documents[0].id,revision:next.documents[0].revision,evidence:{source:'synthetic-test-only',quote:'この固定版の業務内容を確認する模擬イベント'}}]});
});

test('undecided Who placeholders are retained without inventing a role',()=>{
 for(const who of ['未定','未決','TBD','unknown']){const p=structuredClone(legacy);p.documents[0].activities[0].who=who;const n=upgradeRoles(p,revisions);assert.equal(n.documents[0].activities[0].who,who);assert.equal(n.documents[0].activities[0].roleId,null);validate(n);}
});
