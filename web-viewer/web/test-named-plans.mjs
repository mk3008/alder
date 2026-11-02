import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseDocument,readDesignFile} from '../src/document-input.ts';
import {loadDocumentURL} from '../src/document-loader.ts';
import {namedPlansFixture} from './named-plans-fixture.mjs';

const raw=readFileSync('public/named-plans-example.json','utf8');
test('NAMED-PLANS-006/007: each plan projects its own content despite shared IDs',()=>{
 assert.deepEqual(JSON.parse(raw),namedPlansFixture);
 for(const [id,label] of [['current','現行案'],['improved','改善案'],['alternative','提案A']]){
  const design=parseDocument(raw,id);assert.equal(design.namedPlans.selected,id);
  assert.equal(design.graph.nodes.find(n=>n.id==='activity').name,label+'の受付を行う');
  assert.equal(design.objectStateTransitions.object.model.states[0],label+'受付済み');
  assert.equal(design.model.checks[0].items[0].title,label+'の記録を確認する');
  assert.equal(design.model.concepts[0].concepts[0].name,label+'の受付記録');
 }
 assert.equal(parseDocument(raw).namedPlans.selected,'current');
 assert.throws(()=>parseDocument(raw,'unknown'),/業務案/);
 assert.throws(()=>parseDocument(JSON.stringify(namedPlansFixture.plans[0].package),'current'),/業務案/);
});
test('NAMED-PLANS-003: an invalid unselected plan or duplicate key rejects the whole input',()=>{
 const invalid=structuredClone(namedPlansFixture);invalid.plans[2].package.documents[0].relations[0].toId='missing';
 assert.throws(()=>parseDocument(JSON.stringify(invalid),'current'),/Plan alternative/);
 const unsupported=structuredClone(namedPlansFixture);unsupported.plans[2].package.documents.push({...structuredClone(unsupported.plans[2].package.documents[0]),id:'other-bd',objects:[],activities:[{...structuredClone(unsupported.plans[2].package.documents[0].activities[0]),id:'other-activity',roleId:'other-role'}],relations:[],findings:[],roles:[{id:'other-role',name:'別担当',color:'#2563eb'}]});
 assert.throws(()=>parseDocument(JSON.stringify(unsupported),'current'),/業務案 alternative/);
 assert.throws(()=>parseDocument(raw.replace('"format": "alder-named-plans"','"format": "alder-named-plans", "format": "other"')),/Duplicate JSON key/);
});
test('NAMED-PLANS-009: URL and local file budgets are retained at their byte boundaries',async()=>{
 const bytes=Buffer.byteLength(raw),limit=2*1024*1024,within=raw+' '.repeat(limit-bytes),over=within+' ';
 const original=globalThis.fetch;
 try{
  globalThis.fetch=async()=>new Response(within,{headers:{'content-type':'application/json','content-length':String(limit)}});
  assert.equal((await loadDocumentURL('https://example.test/plans.json')).namedPlans.selected,'current');
  globalThis.fetch=async()=>new Response(over,{headers:{'content-type':'application/json','content-length':String(limit+1)}});
  await assert.rejects(()=>loadDocumentURL('https://example.test/plans.json'),/2MiB/);
  let read=false;await assert.rejects(()=>readDesignFile({name:'plans.json',type:'application/json',size:8*1024*1024+1,text:async()=>{read=true;return raw;}}),/8MiB/);assert.equal(read,false);
  const local=raw+' '.repeat(8*1024*1024-bytes);assert.equal((await readDesignFile({name:'plans.json',type:'application/json',size:8*1024*1024,text:async()=>local})).namedPlans.selected,'current');
 }finally{globalThis.fetch=original;}
});
