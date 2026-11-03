import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {registerHooks} from 'node:module';
import {createHash} from 'node:crypto';

// This small DOM exercises the shared renderer without pretending to be a browser.
class Node {
 constructor(tag=''){this.tagName=tag.toUpperCase();this.children=[];this.dataset={};this._text='';this.className='';}
 set textContent(value){this._text=String(value??'');this.children=[];}
 get textContent(){return this._text+this.children.map(c=>c.textContent).join('');}
 append(...nodes){this.children.push(...nodes.map(n=>typeof n==='string'?Object.assign(new Node('#text'),{textContent:n}):n));}
 setAttribute(name,value){this[name]=String(value);}
 querySelectorAll(selector){const names=new Set(selector.split(',').map(x=>x.trim().toUpperCase())),found=[];const walk=n=>{for(const c of n.children){if(names.has(c.tagName))found.push(c);walk(c);}};walk(this);return found;}
 querySelector(selector){return this.querySelectorAll(selector)[0]??null;}
 remove(){}
}
globalThis.document={createElement:tag=>new Node(tag),createTextNode:text=>Object.assign(new Node('#text'),{textContent:text})};
registerHooks({resolve(spec,context,next){if((spec.startsWith('./')||spec.startsWith('../'))&&!/\.[a-z0-9]+$/i.test(spec)){try{return next(spec+'.ts',context)}catch{}try{return next(spec+'.js',context)}catch{}}return next(spec,context)}});
const {parseDocument}=await import('../src/document-input.ts');
const {businessDetail}=await import('../src/document-view.ts');
const {findingLinks}=await import('../src/findings.ts');
const {activityRole,roleGroupKey}=await import('../src/roles.ts');
const read=path=>readFileSync(path,'utf8'),parse=path=>parseDocument(read(path));
const authority=read('verification/procedure-exception.check-items.json');
const ids=['CONTINUITY-001','CONTINUITY-002','CONTINUITY-003','CONTINUITY-004','CONTINUITY-005','CONTINUITY-006'];
const verifyAuthority=raw=>{assert.equal(createHash('sha256').update(raw).digest('hex'),'3d63791567be5be75753a5ca0502408e3140b25bd59deda555dec5297d12c227');assert.deepEqual(JSON.parse(raw).checks.map(x=>x.id),ids);};
const verifyCoverage=done=>{assert.equal(new Set(done).size,done.length);assert.deepEqual([...done].sort(),[...ids].sort());};
verifyAuthority(authority);const altered=JSON.parse(authority);altered.checks.shift();assert.throws(()=>verifyAuthority(JSON.stringify(altered)));assert.throws(()=>verifyCoverage(ids.slice(1)));assert.throws(()=>verifyCoverage([...ids,ids[0]]));const covered=[];

const draft=parse('../tools/document_storage/examples/continuity-draft-v06.json'),detail=businessDetail(draft,'fill');
for(const text of ['申請者','発生条件','下書きとして保存','再開条件','下書きを探して開き','再開する手順','手順1','申請内容'])assert.ok(detail.textContent.includes(text),text);
assert.equal(detail.querySelectorAll('table').length,1);assert.deepEqual(detail.querySelectorAll('th').map(x=>x.textContent),['Step','From','To','Data','Action']);
covered.push(ids[0]);
const ended=JSON.parse(read('../tools/document_storage/examples/continuity-draft-v06.json'));Object.assign(ended.documents[0].exceptions[0].continuity,{outcome:'end',onInterrupt:null,resumeCondition:null,resumeAction:null,interruptedAtStepId:null,resumeAtStepId:null,retainedDataIds:null});const endDetail=businessDetail(parseDocument(JSON.stringify(ended)),'fill');assert.match(endDetail.textContent,/終了/);assert.doesNotMatch(endDetail.textContent,/再開条件|再開方法|中断時の扱い/);
covered.push(ids[1]);
const source=read('../tools/document_storage/examples/paper-manual-v06.json'),paper=parseDocument(source),paperDetail=businessDetail(paper,'copy');
assert.equal(paper.markdown,source);assert.equal(paperDetail.querySelectorAll('tr').length,3);assert.deepEqual(paper.graph.relations.map(x=>[x.kind,x.from,x.to]),[['input','paper','copy'],['output','copy','memo']]);
assert.match(paperDetail.textContent,/作業者.*紙.*記載内容.*読む/);assert.doesNotMatch(paperDetail.textContent,/記載成功|返す/);
assert.match(paperDetail.textContent,/紙 — 記載内容/);assert.match(paperDetail.textContent,/メモ — 記載内容/);assert.match(paperDetail.textContent,/紙に記載された内容/);
const noRelation=JSON.parse(source);noRelation.documents[0].activities[0].procedure.steps[0].exchange.relationId=null;noRelation.documents[0].relations=noRelation.documents[0].relations.filter(r=>r.id!=='paper-in');const derived=parseDocument(JSON.stringify(noRelation));assert.match(businessDetail(derived,'copy').textContent,/紙 — 記載内容/);
const unresolved=JSON.parse(source);unresolved.documents[0].objects[0].scope=null;const u=parseDocument(JSON.stringify(unresolved));assert.equal(u.graph.nodes.find(x=>x.id==='paper').scope,null);assert.match(businessDetail(u,'paper').textContent,/未決/);
for(const who of [{kind:'system',name:'自動処理'},{kind:'scheduler',name:'定刻スケジューラー'}]){const p=JSON.parse(read('../tools/document_storage/examples/continuity-draft-v06.json'));p.documents[0].activities[0].who=who;const view=parseDocument(JSON.stringify(p));assert.equal(view.graph.nodes.find(x=>x.id==='fill').who,who.name);assert.equal(activityRole(view,'fill'),undefined);assert.equal(roleGroupKey(view,'fill',who.name),who.kind+':'+who.name);}
const malformed=JSON.parse(read('../tools/document_storage/examples/continuity-draft-v06.json'));malformed.documents[0].exceptions[0].continuity.resumeAtStepId='missing';assert.throws(()=>parseDocument(JSON.stringify(malformed)));
covered.push(ids[2]);
const oldSource=read('web/fixtures/json-05-reviewed-seed.json'),old=parseDocument(oldSource);assert.equal(old.markdown,oldSource);assert.equal(old.graph.nodes.find(x=>x.id==='c-guidance').who,'未決');assert.equal(old.model.checks[0].items[0].reviewState,'確認済み');
covered.push(ids[3]);
let chosen='';const oldDetail=businessDetail(old,'c-guidance',id=>{chosen=id;});const warnings=oldDetail.querySelectorAll('p').filter(n=>n.dataset.structureIssue);assert.ok(warnings.length>=1);warnings[0].querySelector('button').onclick();assert.equal(chosen,warnings[0].dataset.structureIssue);
const authored={id:'authored-finding',kind:'question',status:'open',scope:'items',targets:['c-guidance'],summary:'原文の指摘',content:'確認',unresolvedTargets:[]};old.findings.push(authored);
const links=findingLinks(old,'c-guidance',()=>{},true);assert.ok(links.children.some(x=>x.dataset.findingLink==='authored-finding'));assert.ok(!links.children.some(x=>x.dataset.findingLink?.startsWith('viewer:')));
const current=parse('../work/viewer-json/issue-274/json-native/independent.json');assert.equal(current.model.formatVersion,'0.4');assert.ok(current.graph.relations.length);
const linked=JSON.parse(read('../tools/document_storage/examples/continuity-draft-v06.json')),second=structuredClone(linked.documents[0].activities[0]);second.id='confirm';second.name='内容を確認する';second.procedure.steps[0].id='confirm-step';second.procedure.steps[0].exchange.relationId=null;second.results[0].id='confirm-result';linked.documents[0].activities.push(second);linked.documents[0].relations.push({id:'exception-route',kind:'business-exception',fromId:'fill',toId:'confirm',label:'確認が必要'});const route=parseDocument(JSON.stringify(linked));assert.ok(route.graph.relations.some(r=>r.kind==='business-exception'&&r.from==='fill'&&r.to==='confirm'&&r.label==='確認が必要'));
covered.push(ids[4],ids[5]);verifyCoverage(covered);
console.log('Procedure/exception model and renderer checks passed; real browser remains separate.');
