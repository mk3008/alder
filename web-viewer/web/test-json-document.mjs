import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {parseDocument,readDesignFile} from '../src/json-document.ts';
import {parseDesign,validateGraph} from '../src/graph.ts';
import {reconcile} from '../src/session.ts';
import {graphV1} from '../../tools/document_storage/core.mjs';

const raw=readFileSync('../work/plugin-json/issue-273/snapshots/04-final-after-replay.json','utf8'),pkg=JSON.parse(raw),bd=pkg.documents[0],check=pkg.documents[1];
const parsed=parseDocument(raw);assert.equal(parsed.sourceFormat,'json');assert.equal(parsed.markdown,raw);assert.equal(parsed.json.revision,'package-7');assert.equal(parsed.json.business.revision,'bd-3');assert.equal(parsed.json.checks[0].basedOn.verification,'unverified');
assert.deepEqual(parsed.graph.nodes.map(n=>n.id),[...bd.objects,...bd.activities].map(n=>n.id));assert.deepEqual(parsed.findings.map(f=>f.targets),bd.findings.map(f=>f.targetIds));
// The public Graph v1 contract remains name-based and separate from display IDs.
validateGraph(graphV1(pkg,bd.id));assert.throws(()=>validateGraph(parsed.graph),/ID must equal/);
const md=readFileSync('web/authorities/business-design.md','utf8');assert.deepEqual(parseDocument(md),parseDesign(md));
for(const mutate of [p=>p.formatVersion='999',p=>p.documents[0].kind='conceptModel',p=>p.documents[0].schemaVersion='999',p=>p.documents[0].relations[0].toId='absent',p=>p.documents[1].basedOn.revision='old',p=>p.documents.push(structuredClone(p.documents[0])),p=>p.documents[1].items[0].reviewState='AI承認']){
 const candidate=structuredClone(pkg);mutate(candidate);assert.throws(()=>parseDocument(JSON.stringify(candidate)));
}
assert.throws(()=>parseDocument('{"format":"alder-document-package","format":"other"}'),/Duplicate JSON key/);
assert.equal(parseDocument('\uFEFF'+raw).markdown,'\uFEFF'+raw);
let read=false;await assert.rejects(()=>readDesignFile({name:'big.json',type:'application/json',size:8*1024*1024+1,text:async()=>{read=true;return raw;}}),/8MiB/);assert.equal(read,false);
await assert.rejects(()=>readDesignFile({name:'wrong.json',type:'application/json',size:md.length,text:async()=>md}),/JSON/);
assert.throws(()=>parseDocument(raw.slice(0,-10)));assert.throws(()=>parseDocument('['));
const changed=structuredClone(pkg);changed.revision='next';changed.documents[0].revision='bd-next';changed.documents[1].basedOn.revision='bd-next';changed.documents[1].revision='check-next';changed.documents[0].objects[0].name='改名後';changed.documents[0].objects.reverse();changed.documents[0].activities.reverse();
const selected=bd.objects[0].id,tab={key:'test',name:'test',design:parsed,selected,positions:{[selected]:[450,600]},scroll:[3,4],zoom:1},updated=reconcile(tab,parseDocument(JSON.stringify(changed)));
assert.equal(updated.selected,selected);assert.deepEqual(updated.positions[selected],[450,600]);assert.equal(updated.design.graph.nodes.find(n=>n.id===selected).name,'改名後');assert.deepEqual(updated.design.activityOrder,changed.documents[0].activities.map(a=>a.id));assert.deepEqual(updated.design.json.checks[0].items.map(i=>i.reviewState),check.items.map(i=>i.reviewState));

const model=structuredClone(pkg),doc=model.documents[1];doc.sections.push({id:'unassigned-section',activityId:null,title:'文書の未決',preamble:[]});doc.items.push({id:'unassigned-check',checkId:'CI-DOC',title:'文書全体の未決',sectionId:'unassigned-section',reviewState:'要確認',detailSummary:'',fields:{condition:[{kind:'text',value:'文書全体'}],expectedResult:[{kind:'text',value:'未決'}]}});
doc.notes.push({id:'cycle-a',title:'循環A',content:[{kind:'reference',targetId:'cycle-b',label:'循環Bを読む'}]},{id:'cycle-b',title:'循環B',content:[{kind:'reference',targetId:'cycle-a',label:'循環Aを読む'}]});doc.items.find(i=>i.checkId==='CI-001').fields.related=[{kind:'reference',targetId:'cycle-a',label:'文書メモを読む'}];
doc.items.find(i=>i.checkId==='CI-001').fields.evidence.push({kind:'text',value:'<img src="https://must-not-load.test/image" onerror="alert(1)">'});
const dom=new JSDOM('<body></body>',{runScripts:'outside-only'}),compiled=await build({entryPoints:['src/json-view.ts'],bundle:true,write:false,format:'iife',globalName:'jsonUI'});dom.window.eval(compiled.outputFiles[0].text+'\nwindow.jsonUI=jsonUI;');
const d=parseDocument(JSON.stringify(model)),panel=dom.window.jsonUI.jsonChecks(d,bd.activities[0].id);dom.window.document.body.append(panel);
assert.match(panel.textContent,/意味対応は未確認/);assert.match(panel.textContent,/CI-DOC/);assert.match(panel.textContent,/人間レビュー状態: 確認済み/);assert.equal(panel.querySelectorAll('img,script,iframe').length,0);
assert.equal(panel.querySelectorAll('table').length,0,'references must not recursively render while closed');
const open=async label=>{const detail=[...panel.querySelectorAll('details')].find(e=>e.querySelector(':scope > summary')?.textContent===label);assert.ok(detail,label);detail.open=true;detail.dispatchEvent(new dom.window.Event('toggle'));await new Promise(r=>setTimeout(r,0));return detail;};
await open('CI-001の一般保証');assert.equal(panel.querySelectorAll('table').length,1);assert.match(panel.textContent,/必須不足/);
await open('文書メモを読む');await open('循環Bを読む');await open('循環Aを読む');assert.match(panel.textContent,/循環参照/);assert.ok(panel.querySelectorAll('*').length<500);
dom.window.close();console.log('JSON projection, Graph/MD compatibility, ID/revision reconciliation, strict rejection, unassigned checks, inert content and lazy cyclic references passed');
