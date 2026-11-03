import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';

const source=readFileSync('../examples/molkky/business-design.json','utf8');
const pkg=JSON.parse(source),bd=pkg.documents.find(doc=>doc.kind==='businessDesign');
const checks=pkg.documents.find(doc=>doc.kind==='checkItems'),activities=bd.activities;
const hash=value=>createHash('sha256').update(value).digest('hex');
const authorityPath='verification/activity-test-spec.check-items.json',authority=readFileSync(authorityPath);
assert.equal(hash(authority),'5684b2be9a021d23d1be0e24a5719fa9702daa6ff126d49feeccd28952725ad0');
assert.deepEqual(JSON.parse(authority).checks.map(check=>check.id),['TEST-ACTIVITY-001','TEST-ACTIVITY-002','TEST-ACTIVITY-003','TEST-ACTIVITY-004']);
const bundle=async fixture=>(await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',
 loader:{'.css':'empty','.md':'text','.json':'text'},plugins:[{name:'sample',setup(builder){
  builder.onLoad({filter:/business-design\.json$/},()=>({contents:JSON.stringify(fixture),loader:'text'}));
 }}]})).outputFiles[0].text;
const windows=[];
async function open(code,url='https://viewer.test/activity-spec'){
 const w=new JSDOM('<div id="app"></div>',{url,runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);
 w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;
 w.HTMLElement.prototype.scrollIntoView=function(){w.__scrolled=this.dataset.checkId||this.textContent;};
 w.HTMLElement.prototype.setPointerCapture=()=>{};w.eval(code);
 const $=selector=>w.document.querySelector(selector),entry=key=>w.document.querySelector('[data-explorer-key="'+key+'"]');
 const until=async predicate=>{for(let i=0;i<500&&!predicate();i++)await new Promise(resolve=>setTimeout(resolve,10));assert.ok(predicate(),'expected app state');};
 await until(()=>$('#open')&&!$('#open').disabled);$('#open-sample').click();await until(()=>entry('group:tests'));
 return {w,$,entry,until};
}
try{
 const code=await bundle(pkg),app=await open(code),{$,entry,w,until}=app;
 entry('group:tests').click();
 const tree=$('#explorer-tests'),entries=[...tree.querySelectorAll('[data-explorer-key]')];
 assert.deepEqual(entries.map(node=>node.textContent),activities.map(activity=>activity.name),'only Activity names are listed');
 assert.equal(tree.querySelector('.explorer-subparent'),null);
 entry('tests:activity:'+activities[0].id).click();
 assert.equal($('#app').dataset.workspaceArea,'tests');
 assert.match($('.spec-tabs').textContent,new RegExp('テスト'+activities[0].id));
 assert.equal($('.activity-test-spec h1').textContent,activities[0].name);
 assert.equal($('.activity-test-status').textContent,'テストの対応・実行結果・証拠の鮮度：未確認');
 assert.equal($('#tests-workspace [aria-label="テスト成功"]'),null,'prose evidence must not become a pass');
 assert.equal($('#tests-workspace [aria-label="テスト失敗"]'),null);
 const ids=checks.index.find(row=>row.activityId===activities[0].id).checkIds;
 assert.deepEqual([...$('#tests-workspace').querySelectorAll('.activity-test-check')].map(node=>node.dataset.elementId),ids);
 const first=$('[data-check-id="MK-01"]');
 assert.match(first.textContent,/その回の点数は0点になる/);
 assert.match(first.textContent,/人間レビュー：要確認/);
 assert.doesNotMatch(first.textContent,/導出|確信度|技術対応はmapped/);
 assert.ok($('#tests-workspace table'),'authored examples remain visible');
 assert.ok($('.activity-test-evidence details'),'stored evidence is available as an unverified record');
 assert.match($('.activity-test-evidence').textContent,/対応、実行結果、鮮度は確認されていません/);
 const toc=[...$('.activity-test-toc').querySelectorAll('button')];
 assert.equal(toc[0].textContent,'仕様');assert.equal(toc.at(-1).textContent,'テスト');
 toc.find(button=>button.textContent==='MK-01').click();
 assert.equal(w.__scrolled,'MK-01');assert.equal(w.document.activeElement,first);
 entry('tests:activity:'+activities[0].id).click();
 assert.equal($('.spec-tabs').querySelectorAll('.tab').length,1,'reselection reuses its Activity tab');
 entry('tests:activity:'+activities[1].id).click();
 assert.equal($('.spec-tabs').querySelectorAll('.tab').length,2);
 assert.equal(new URL(w.location.href).searchParams.get('spec'),'activity:'+activities[1].id);
 w.history.back();await until(()=>$('.activity-test-spec h1')?.textContent===activities[0].name);
 assert.equal($('.spec-tabs').querySelectorAll('.tab').length,2,'back reuses open tabs');
 $('.spec-tabs .tab.active .close').click();
 assert.equal($('.spec-tabs').querySelectorAll('.tab').length,1);
 entry('tests:activity:'+activities[0].id).click();
 assert.equal($('.spec-tabs').querySelectorAll('.tab').length,2,'closed Activity can be reopened');

 const empty=structuredClone(pkg),emptyChecks=empty.documents.find(doc=>doc.kind==='checkItems');
 for(const item of emptyChecks.items)delete item.fields.testEvidence;
 const missing=await open(await bundle(empty),'https://viewer.test/activity-spec-empty');
 missing.entry('group:tests').click();
 assert.ok(missing.$('[data-explorer-key="tests:activity:'+activities[0].id+'"] .activity-test-unlinked'));
 missing.entry('tests:activity:'+activities[0].id).click();
 assert.match(missing.$('.activity-test-evidence').textContent,/記録はありません/);

 const linked=structuredClone(pkg),linkedCheck=linked.documents.find(doc=>doc.kind==='checkItems').items.find(item=>item.checkId==='MK-01');
 linkedCheck.fields.testEvidence=[{kind:'link',uri:'https://example.org/project/test.ts#L12',label:'保存された参照'}];
 const linkedApp=await open(await bundle(linked),'https://viewer.test/activity-spec-link');
 linkedApp.entry('tests:activity:'+activities[0].id).click();
 const link=linkedApp.$('.activity-test-evidence a');
 assert.equal(link.href,'https://example.org/project/test.ts#L12');
 assert.equal(link.rel,'noopener noreferrer');
 assert.match(link.parentElement.textContent,/リンク先未確認/);
 assert.equal(hash(readFileSync('../examples/molkky/business-design.json','utf8')),hash(source),'source JSON stays unchanged');
 assert.equal(hash(readFileSync(authorityPath)),hash(authority),'verification authority stays unchanged');
 console.log(JSON.stringify({passed:['TEST-ACTIVITY-001','TEST-ACTIVITY-002','TEST-ACTIVITY-003'],partial:'TEST-ACTIVITY-004: DOM click only; native scrolling, narrow width and drawer geometry require browser',authority:authorityPath,scope:'DOM with source JSON and explicitly unverified evidence'}));
}finally{for(const w of windows)w.close();}
