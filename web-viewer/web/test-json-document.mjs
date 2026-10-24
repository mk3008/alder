import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {parseDocument,readDesignFile} from '../src/document-input.ts';
import {parseDesign,validateGraph} from '../src/graph.ts';
import {reconcile} from '../src/session.ts';
import {graphV1} from '../../tools/document_storage/core.mjs';

const raw=readFileSync('../work/plugin-json/issue-273/snapshots/04-final-after-replay.json','utf8'),pkg=JSON.parse(raw),bd=pkg.documents[0],check=pkg.documents[1];
const parsed=parseDocument(raw);assert.equal(parsed.sourceFormat,'json');assert.equal(parsed.markdown,raw);assert.equal(parsed.model.revision,'package-7');assert.equal(parsed.model.business.revision,'bd-3');assert.equal(parsed.model.checks[0].basedOn.verification,'unverified');
assert.deepEqual(parsed.graph.nodes.map(n=>n.id).sort(),[...bd.objects,...bd.activities].map(n=>n.id).sort());assert.deepEqual(parsed.graph.nodes.map(n=>n.name),[...bd.objects,...bd.activities].map(n=>n.name).sort());assert.deepEqual(parsed.findings.map(f=>f.targets),bd.findings.map(f=>f.targetIds));
// The public Graph v1 contract remains name-based and separate from display IDs.
validateGraph(graphV1(pkg,bd.id));assert.throws(()=>validateGraph(parsed.graph),/ID must equal/);
const md=readFileSync('web/authorities/business-design.md','utf8');assert.deepEqual(parseDocument(md).graph,parseDesign(md).graph);assert.equal(parseDocument(md).markdown,md);
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
assert.equal(updated.selected,selected);assert.deepEqual(updated.positions[selected],[450,600]);assert.equal(updated.design.graph.nodes.find(n=>n.id===selected).name,'改名後');assert.deepEqual(updated.design.activityOrder,changed.documents[0].activities.map(a=>a.id));assert.deepEqual(updated.design.model.checks[0].items.map(i=>i.reviewState),check.items.map(i=>i.reviewState));

const model=structuredClone(pkg),doc=model.documents[1];doc.sections.push({id:'unassigned-section',activityId:null,title:'文書の未決',preamble:[]});doc.items.push({id:'unassigned-check',checkId:'CI-DOC',title:'文書全体の未決',sectionId:'unassigned-section',reviewState:'要確認',detailSummary:'',fields:{condition:[{kind:'text',value:'文書全体'}],expectedResult:[{kind:'text',value:'未決'}]}});
doc.notes.push({id:'cycle-a',title:'循環A',content:[{kind:'reference',targetId:'cycle-b',label:'循環Bを読む'}]},{id:'cycle-b',title:'循環B',content:[{kind:'reference',targetId:'cycle-a',label:'循環Aを読む'}]});doc.items.find(i=>i.checkId==='CI-001').fields.related=[{kind:'reference',targetId:'cycle-a',label:'文書メモを読む'}];
doc.items.find(i=>i.checkId==='CI-001').fields.evidence.push({kind:'text',value:'<img src="https://must-not-load.test/image" onerror="alert(1)">'});
const dom=new JSDOM('<body></body>',{runScripts:'outside-only'}),compiled=await build({entryPoints:['src/document-view.ts'],bundle:true,write:false,format:'iife',globalName:'jsonUI'});dom.window.eval(compiled.outputFiles[0].text+'\nwindow.jsonUI=jsonUI;');
// Package metadata and preface belong to original source, never selected item details.
const detailDesign=structuredClone(parsed);detailDesign.model.business.preface='DOCUMENT-PREFACE-ONLY';
for(const selectedItem of [...bd.objects,...bd.activities]){
 const detail=dom.window.jsonUI.businessDetail(detailDesign,selectedItem.id);
 assert.doesNotMatch(detail.textContent,/DOCUMENT-PREFACE-ONLY|JSON 0\.1|package |文書ID:|要素ID:/);
 assert.ok(detail.querySelector('h3'));
 if(bd.objects.includes(selectedItem))assert.deepEqual([...detail.querySelectorAll('h3')].map(n=>n.textContent),['Scope','Icon','Information']);
}
assert.equal(dom.window.jsonUI.businessDetail(detailDesign).textContent,'項目を選択すると業務内容を表示します。');
assert.equal(detailDesign.markdown,raw,'source remains unchanged');
const d=parseDocument(JSON.stringify(model)),panel=dom.window.jsonUI.renderChecks(d,bd.activities[0].id);dom.window.document.body.append(panel);
assert.match(panel.textContent,/意味対応は未確認/);assert.match(panel.textContent,/CI-DOC/);assert.match(panel.textContent,/人間レビュー状態: 確認済み/);assert.equal(panel.querySelectorAll('img,script,iframe').length,0);
assert.equal(panel.querySelectorAll('table').length,0,'references must not recursively render while closed');
const open=async label=>{const detail=[...panel.querySelectorAll('details')].find(e=>e.querySelector(':scope > summary')?.textContent===label);assert.ok(detail,label);detail.open=true;detail.dispatchEvent(new dom.window.Event('toggle'));await new Promise(r=>setTimeout(r,0));return detail;};
await open('CI-001の一般保証');assert.equal(panel.querySelectorAll('table').length,1);assert.match(panel.textContent,/必須不足/);
await open('文書メモを読む');await open('循環Bを読む');await open('循環Aを読む');assert.match(panel.textContent,/循環参照/);assert.ok(panel.querySelectorAll('*').length<500);
dom.window.close();console.log('JSON projection, Graph/MD compatibility, ID/revision reconciliation, strict rejection, unassigned checks, inert content and lazy cyclic references passed');

// Actual app restoration must publish the recomputed design into DocumentState.
const app=await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}}),w=new JSDOM('<div id="app"></div>',{url:'https://document-viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.scrollIntoView=()=>{};
const cached=structuredClone(parsed);cached.graph.nodes[0].name='偽の表示名';cached.model.checks[0].items[0].reviewState='AI承認';delete cached.sourceFormat;
await new Promise((resolve,reject)=>{const request=w.indexedDB.open('alder-web-viewer',1);request.onupgradeneeded=()=>request.result.createObjectStore('session');request.onsuccess=()=>{const db=request.result,tx=db.transaction('session','readwrite'),store=tx.objectStore('session');store.put({format:3,document:{key:'json-restore',name:'JSON',design:cached},views:[{key:'json-restore',selected:bd.activities[0].id,positions:{},scroll:[0,0],zoom:1}],recovery:[],active:'json-restore',dark:false,drawer:true,width:380},'current');store.put(1,'generation');tx.oncomplete=()=>{db.close();resolve();};tx.onabort=()=>reject(tx.error);};});
try{w.eval(app.outputFiles[0].text);for(let i=0;i<200&&w.document.getElementById('open').disabled;i++)await new Promise(r=>setTimeout(r,10));assert.equal(w.document.querySelectorAll('.node').length,6);assert.ok(!w.document.querySelector('#nodes').textContent.includes('偽の表示名'));assert.ok(w.document.querySelector('.json-detail'));for(const [i,color]of [[0,'#8b5cf6'],[1,'#008576']])assert.equal(w.document.querySelector(`.node[data-node="${bd.activities[i].id}"] .who-badge`).style.getPropertyValue('--role-color'),color,'pre-Role JSON retains the fixed legacy palette without inferring Role IDs');w.document.getElementById('detail-mode-checks').click();assert.ok(!w.document.querySelector('.json-checks').textContent.includes('AI承認'));console.log('JSON native app restoration rejects tampered derived cache and missing format tag');}finally{w.close();}
