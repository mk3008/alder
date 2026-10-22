import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validate,inventory} from './core.mjs';
import {convertMarkdown} from './convert.mjs';
import {extractStateDeclarations} from './state-declaration.mjs';
import {stateDocument} from './state-storage.mjs';
import {guardAuthoring} from './authoring.mjs';
import {applyEdits} from './edit.mjs';
const raw=fs.readFileSync(new URL('../../work/json-state/issue-275/original-pr265.md',import.meta.url),'utf8');
const fixture=JSON.parse(fs.readFileSync(new URL('../../work/json-state/issue-275/purchase.json',import.meta.url))),bd=fixture.documents[0],st=fixture.documents[1];
test('13 operations, partial and undecided stay exactly as declared',()=>{
 validate(fixture);const original=extractStateDeclarations(raw).declarations[0];assert.equal(st.transitions.length,13);assert.deepEqual(st.transitions.map(t=>[t.sourceId,t.effect,t.path,t.condition,t.evidence,t.note]),original.transitions.map(t=>[t.id,t.effect,t.path,t.condition,t.evidence,t.note]));
 for(const id of ['T07','T08','T10','T11','T12'])assert.equal(st.transitions.find(t=>t.sourceId===id).toId,'@unknown');
 assert.equal(st.transitions.find(t=>t.sourceId==='T03').toId,'@none');assert.equal(st.completeness,'partial');
 const direct=structuredClone(fixture);direct.sources=[];assert.equal(guardAuthoring(null,direct).valid,true);
});
test('version, type, source revision, state IDs and exception names reject invalid candidates',()=>{
 for(const change of [p=>p.formatVersion='0.1',p=>p.formatVersion='999',p=>p.documents[1].schemaVersion='999',p=>p.documents[1].basedOn.revision='old',p=>p.documents[1].objectId=bd.activities[0].id,p=>p.documents[1].transitions[0].activityId='missing',p=>p.documents[1].transitions[0].fromId='missing',p=>p.documents[1].states.push({...st.states[0]}),p=>p.documents[1].transitions[1].exception='不存在',p=>p.documents[1].completeness='complete',p=>p.documents[1].transitions[0].effect='unchanged',p=>p.documents[1].transitions[0].toId='@none',p=>p.documents[1].transitions.push({...st.transitions[0],id:'another'})]){const pkg=structuredClone(fixture);change(pkg);assert.throws(()=>validate(pkg));}
});
test('rename, reorder, explicit same-state/cycles, revisions and atomic references',()=>{
 let pkg=structuredClone(fixture);const state=pkg.documents[1].states[0],activity=pkg.documents[0].activities[0],object=pkg.documents[0].objects.find(o=>o.id===st.objectId);
 const next=applyEdits(pkg,{expectedRevision:pkg.revision,revision:'p2',documentRevisions:{'purchase-bd':{expected:'bd-1',next:'bd-2'},'purchase-states':{expected:'states-1',next:'states-2'}},changes:[{id:object.id,values:{name:'改名後'}},{id:activity.id,values:{name:'業務改名'}},{id:state.id,values:{name:'状態改名'}},{id:st.id,values:{basedOn:{...st.basedOn,revision:'bd-2'},transitions:[...st.transitions].reverse()}}]});
 assert.equal(next.documents[1].objectId,object.id);assert.equal(next.documents[1].states[0].id,state.id);assert.equal(next.documents[1].transitions.length,13);guardAuthoring(pkg,next,{expectedRevision:pkg.revision});
 const loop=structuredClone(fixture);loop.documents[1].transitions.push({...st.transitions[3],id:'explicit-loop',sourceId:'T14',effect:'unchanged',toId:st.transitions[3].fromId});validate(loop);assert.equal(loop.documents[1].transitions.length,14);
 const dropped=structuredClone(next);dropped.documents[1].transitions.pop();assert.throws(()=>guardAuthoring(next,dropped,{expectedRevision:next.revision}));
 assert.ok(inventory(next).types.has(state.id));
});
test('unsupported original SR/Medium profile remains rejected; supported explicit import is repeatable',()=>{
 const request={sources:[{text:raw,documentId:bd.id,kind:'businessDesign',revision:'bd-1'}],revision:'p1',stateDocuments:[{documentId:st.id,revision:'states-1',businessDesignId:bd.id,objectName:'購入申請'}]};assert.throws(()=>convertMarkdown(request),/unsupported heading|Unknown BD field/);
 const stateBlock=raw.slice(raw.indexOf('## State Transitions')).split('\n# ')[0];
 let canonical='# 状態図の試験\n\n# Object 購入申請\n\n## Scope\n\ntrue\n\n## Icon\n\nfile-text\n\n## Information\n\n- 状態\n\n'+stateBlock+'\n';
 for(const a of bd.activities){canonical+=`# Activity ${a.name}\n\n## Scope\n\n${a.scope}\n\n## Why\n\n${a.why}\n\n## When\n\n${a.when}\n\n## Who\n\n${a.who}\n\n## Where\n\n${a.where}\n\n## How\n\n### Input\n\n(none)\n\n### Procedure\n\n${a.procedure}\n\n${a.exception?'### Exception\n\n'+a.exception+'\n\n':''}### Output\n\n(none)\n\n## Result\n\n${a.result}\n\n`;}
 request.sources[0].text=canonical;const one=convertMarkdown(request).package;assert.equal(one.documents[1].transitions.length,13);assert.deepEqual(convertMarkdown(request).package,one);
 const two=convertMarkdown({...request,previousPackage:one,expectedRevision:'p1'}).package;assert.deepEqual(two,one);
 assert.equal(stateDocument(extractStateDeclarations(raw).declarations[0],bd,{documentId:st.id,revision:st.revision}).transitions.length,13);
});

test('quoted headings in both fence styles are inert; duplicate state metadata keys reject',()=>{
 for(const fence of ['```','~~~~']){const text='# Example\n'+fence+'markdown\n# Object fake\n## State Transitions\nthis is a quote\n'+fence;assert.deepEqual(extractStateDeclarations(text).declarations,[]);assert.equal(extractStateDeclarations(text).markdown,text);}
 assert.throws(()=>extractStateDeclarations(raw.replace('"object": "購入申請",','"object": "購入申請", "object": "購入申請",')),/Duplicate JSON key/);
});
