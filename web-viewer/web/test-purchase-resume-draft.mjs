import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {validate} from '../../tools/document_storage/core.mjs';
import {parseDocument} from '../src/document-input.ts';
import {stateCaptionGeometry,assertStateCaptionPlacement} from './caption-placement-oracle.mjs';

const authority=readFileSync('verification/resume-draft-reference.check-items.json');
assert.equal(createHash('sha256').update(authority).digest('hex'),'6599e034d8b89fe31cf5de65684144a9acede0192f69cd75cbecc137071526ef');
const required=JSON.parse(authority).checks.map(check=>check.id),covered=new Set();
const original=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v4-check-review.json','utf8'));
const raw=readFileSync('../work/concept-review/issue-133/versions/purchase-v5-resume-reference-draft.json','utf8'),candidate=JSON.parse(raw);
validate(original);validate(candidate);
const document=(pkg,kind)=>pkg.documents.find(value=>value.kind===kind);
const oldChecks=document(original,'checkItems'),checks=document(candidate,'checkItems');
const oldStates=document(original,'stateTransition'),states=document(candidate,'stateTransition');
const oldModel=document(original,'conceptModel'),model=document(candidate,'conceptModel');
const preserve=(before,after)=>{const byId=new Map(after.map(item=>[item.id,item]));for(const item of before)assert.deepEqual(byId.get(item.id),item,`original ${item.id} is preserved`);};
preserve(oldChecks.items,checks.items);preserve(oldChecks.examples,checks.examples);preserve(oldStates.transitions,states.transitions);
const samples=m=>m.reviewGroups.flatMap(group=>group.capabilities.flatMap(cap=>cap.samples));preserve(samples(oldModel),samples(model));
assert.equal(checks.items.length,oldChecks.items.length+2);assert.equal(samples(model).length,samples(oldModel).length+2);
const item=id=>checks.items.find(check=>check.checkId===id),p32=item('P-32'),p33=item('P-33');
assert.equal(p32.reviewState,'未レビュー');assert.equal(p33.reviewState,'未レビュー');
assert.match(p32.fields.expectedResult[0].value,/編集を再開できる/);assert.match(p33.fields.expectedResult[0].value,/再開だけでは提出・破棄しない/);
assert.match(p33.fields.expectedResult[0].value,/状態・確定済みの内容・承認・購入準備は変わらない/);
for(const [sourceId,stateName] of [['T20','下書き'],['T21','承認済み'],['T22','購入準備済み']]){
 const transition=states.transitions.find(value=>value.sourceId===sourceId),state=states.states.find(value=>value.id===transition.fromId);
 assert.equal(state.name,stateName);assert.equal(transition.toId,transition.fromId);assert.equal(transition.effect,'unchanged');assert.equal(transition.path,'normal');
 assert.equal(transition.activityId,'b180c827-00ce-50ca-85b6-1a2f9f5d3533');assert.match(transition.condition,/保存済みの下書き/);
}
assert.equal(states.transitions.length,oldStates.transitions.length+3);
const cap=model.reviewGroups.find(group=>group.id==='group-request').capabilities.find(value=>value.id==='resume-draft');
assert.deepEqual(cap.testSpecification.decisionCheckIds,[p32.id]);assert.deepEqual(cap.testSpecification.resultCheckIds,[p33.id]);
assert.deepEqual(cap.samples.map(sample=>sample.id),['resume-new-draft','resume-approved-draft']);
assert(cap.samples.every(sample=>sample.checkIds.includes(p32.id)&&sample.checkIds.includes(p33.id)));
covered.add('RESUME-DRAFT-003');

const stateBundle=await build({entryPoints:['src/state-transitions.ts'],bundle:true,write:false,format:'iife',globalName:'StateUI'});
const stateWindow=new JSDOM('<body/>',{runScripts:'outside-only'}).window;
try{
 stateWindow.eval(stateBundle.outputFiles[0].text+';window.StateUI=StateUI;');
 const design=parseDocument(raw),panel=stateWindow.StateUI.stateTransitionPanel(design,states.objectId,()=>{}),svg=panel.querySelector('.state-diagram');
 const rows=design.objectStateTransitions[states.objectId].model.transitions;
 assertStateCaptionPlacement(stateCaptionGeometry(svg),rows);
 for(const sourceId of ['T20','T21','T22'])assert(svg.querySelector(`[data-transition-id="${sourceId}"]`),`state caption ${sourceId} is rendered`);
}finally{stateWindow.close();}

const bundle=await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text','.json':'text'},plugins:[{name:'resume-reference',setup(b){b.onLoad({filter:/business-design\.json$/},()=>({contents:raw,loader:'text'}));}}]});
const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/purchase',runScripts:'outside-only',pretendToBeVisual:true}).window;
w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLElement.prototype.setPointerCapture=()=>{};
const $=selector=>w.document.querySelector(selector),entry=key=>$(`[data-explorer-key="${key}"]`),until=async fn=>{for(let i=0;i<500&&!fn();i++)await new Promise(resolve=>setTimeout(resolve,10));assert.ok(fn(),'expected app state');};
try{
 w.eval(bundle.outputFiles[0].text);await until(()=>!!$('#open')&&!$('#open').disabled);$('#open-sample').click();await until(()=>w.document.querySelectorAll('.node').length>0&&entry('group:tests'));
 const key='fn:b180c827-00ce-50ca-85b6-1a2f9f5d3533:group-request:resume-draft';entry('group:tests').click();
 assert(entry('tests:decision:'+key),'resume decision is navigable');entry('tests:decision:'+key).click();
 let page=$('#tests-workspace');assert.match(page.textContent,/対象の下書き/);assert.match(page.textContent,/保存済み/);assert.match(page.textContent,/再開可/);assert.match(page.textContent,/P-32/);
 entry('tests:'+key).click();page=$('#tests-workspace');assert.equal(page.querySelector('.result-checks').textContent,'P-33');
 assert.deepEqual([...page.querySelector('select').options].map(option=>option.value),['resume-new-draft','resume-approved-draft']);
 assert.match(page.textContent,/再開だけでは提出されず/);assert.match(page.textContent,/ボールペン/);assert.equal(page.querySelector('.data-example-decision-links button').textContent,'P-32');
 covered.add('RESUME-DRAFT-001');
 page.querySelector('select').value='resume-approved-draft';page.querySelector('select').dispatchEvent(new w.Event('change'));page=$('#tests-workspace');
 assert.match(page.textContent,/再開前の状態/);assert.match(page.textContent,/再開後の状態/);assert.match(page.textContent,/D1/);assert.match(page.textContent,/V1/);assert.match(page.textContent,/承認済み/);assert.doesNotMatch(page.textContent,/参考草案|未レビュー/);
 covered.add('RESUME-DRAFT-002');
}finally{w.close();}
assert.deepEqual([...covered].sort(),required.sort());
console.log(JSON.stringify({passed:[...covered],scope:'reference draft: schema, preserved records, transition captions and example UI; business review remains open'}));
