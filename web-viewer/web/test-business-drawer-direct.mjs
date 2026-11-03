import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {build as legacyBuild} from './legacy-current-sample-fixture.mjs';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';

const sources=[
 ['verification/business-drawer-direct.check-items.json','77d9b60258a6edac81be7c541c4ceae153ab3d2b232923b9a7b31b0edd8f26e0'],
 ['verification/review-identifiers.check-items.json','1080f8994bc11192b44181aaa0ac1fec788a2e1cd16880c7803212231f71b4f0']
];
const hash=bytes=>createHash('sha256').update(bytes).digest('hex'),covered=new Set();
const authorities=sources.map(([path,expected])=>{const b=readFileSync(path);assert.equal(hash(b),expected);return JSON.parse(b);});
const required=authorities.flatMap(a=>a.checks.map(c=>c.id));
assert.deepEqual(required,['BUSINESS-DRAWER-001','BUSINESS-DRAWER-002','BUSINESS-DRAWER-003','BUSINESS-DRAWER-004','REVIEW-ID-001','REVIEW-ID-002','REVIEW-ID-003']);
const purchaseRaw=readFileSync('../work/concept-review/issue-133/versions/purchase-v3-beta.json','utf8'),purchase=JSON.parse(purchaseRaw);
const bd=purchase.documents.find(d=>d.kind==='businessDesign'),f05=bd.findings.find(f=>f.sourceId==='F05'),activity=bd.activities.find(a=>f05.targetIds.includes(a.id));
const nativePkg=JSON.parse(readFileSync('../business-design/alder/business-design.json','utf8')),nativeBD=nativePkg.documents.find(d=>d.kind==='businessDesign'),nativeCheck=nativePkg.documents.find(d=>d.kind==='checkItems');
const standardActivity=nativeBD.activities.find(a=>a.name==='業務設計'),standardItem=nativeCheck.items.find(i=>i.checkId==='SAMPLE-01');
const options={entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text','.json':'text'}};
const [normal,legacy]=(await Promise.all([build(options),legacyBuild(options)])).map(x=>x.outputFiles[0].text),windows=[];
async function boot(script,db=new IDBFactory()){
 const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/direct-drawer',runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);
 w.indexedDB=db;w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};w.eval(script);
 const $=s=>w.document.querySelector(s),entry=key=>$('[data-explorer-key="'+key+'"]'),until=async fn=>{for(let i=0;i<500&&!fn();i++)await new Promise(r=>setTimeout(r,10));assert.ok(fn(),'expected app state');};
 await until(()=>!!$('#open')&&!$('#open').disabled);return {w,$,entry,until};
}
function checkRelationLists(doc,business,activityId){
 const names=new Map([...business.objects,...business.activities].map(item=>[item.id,item.name]));
 const detail=doc.querySelector('#detail>.markdown');
 for(const [kind,title] of [['input','Input'],['output','Output']]){
  const expected=business.relations.filter(r=>r.kind===kind&&(r.fromId===activityId||r.toId===activityId)).map(r=>`${names.get(r.fromId)} → ${names.get(r.toId)} — ${r.label}`);
  const heading=[...detail.children].find(el=>el.tagName==='H3'&&el.textContent===title);
  assert.equal(!!heading,expected.length>0,`${title}: heading exists only when relations exist`);
  if(!heading)continue;
  const list=heading.nextElementSibling;assert.equal(list?.tagName,'UL',`${title}: relations use a list`);
  assert.deepEqual([...list.children].map(el=>[el.tagName,el.textContent]),expected.map(text=>['LI',text]),`${title}: retain each relation and its order`);
 }
}
try{
 const app=await boot(normal),{$,entry,until}=app;$('#open-text').click();$('#source-text').value=purchaseRaw;await $('#source-submit').onclick();await until(()=>!!entry('business:'+activity.id));
 assert.equal($('#detail .right-drawer-tabs'),null);assert.match($('#detail').textContent,/項目を選択すると業務内容/);
 const graphZoom=$('#zoom').textContent,graphWheel=new app.w.WheelEvent('wheel',{bubbles:true,cancelable:true,ctrlKey:true,deltaY:-100,clientX:100,clientY:100});$('#viewport').dispatchEvent(graphWheel);assert(graphWheel.defaultPrevented);assert.notEqual($('#zoom').textContent,graphZoom);
 entry('business:'+activity.id).click();assert.equal($('#detail .right-drawer-tabs'),null);assert.equal($('#detail h1').textContent,activity.name);assert($('#detail>.markdown'));checkRelationLists(app.w.document,bd,activity.id);
 const prepare=bd.activities.find(a=>a.name==='購入を準備する');entry('business:'+prepare.id).click();checkRelationLists(app.w.document,bd,prepare.id);entry('business:'+activity.id).click();
 const activityCard=$('[data-node="'+activity.id+'"] .who-badge'),activityTitle=$('#detail h1 .who-badge');assert(activityCard&&activityTitle);assert.equal(activityTitle.style.getPropertyValue('--role-color'),activityCard.style.getPropertyValue('--role-color'));assert.equal(activityTitle.querySelector('svg').innerHTML,activityCard.querySelector('svg').innerHTML);assert.equal(activityTitle.getAttribute('aria-hidden'),'true');
 const finding=$('#detail [data-finding-link="'+f05.id+'"]');assert(finding);assert.match(finding.textContent,/F05/);assert.match(finding.textContent,/下書き保存/);finding.click();
 assert.match($('#node-list .finding-card').textContent,/F05/);assert.match($('#node-list .finding-card').textContent,/仮説/);assert.equal(f05.status,'open');covered.add('REVIEW-ID-001');
 entry('object:'+bd.objects[0].id).click();assert.equal($('#detail .right-drawer-tabs'),null);assert($('#detail>.markdown'));const objectCard=$('[data-node="'+bd.objects[0].id+'"]>svg'),objectTitle=$('#detail h1>svg.drawer-node-icon');assert(objectCard&&objectTitle);assert.equal(objectTitle.innerHTML,objectCard.innerHTML);assert.equal(objectTitle.getAttribute('aria-hidden'),'true');assert(![...$('#detail .markdown').querySelectorAll('h2,h3')].some(h=>h.textContent==='Icon'));assert.match($('#detail .markdown').textContent,/Information/);covered.add('BUSINESS-DRAWER-001');
 entry('concept:group-request').click();if($('.concept-related').hidden)$('#drawer').click();assert.equal($('.concept-child-tabs'),null);assert.equal($('.data-review-overview').hidden,false);
 $('.concept-related .shell-heading button').click();entry('business:overview').click();assert($('#formattedMarkdownDrawer').hidden);$('#drawer').click();assert(!$('#formattedMarkdownDrawer').hidden);covered.add('BUSINESS-DRAWER-004');
 $('#open-sample').click();await until(()=>!!entry('tests:activity:'+standardActivity.id));entry('tests:activity:'+standardActivity.id).click();
 const shown=$('#tests-workspace [data-check-id="SAMPLE-01"]');assert(shown);assert.equal(shown.querySelector('.activity-test-check-id').textContent,'SAMPLE-01');assert.equal(shown.querySelector('h3').textContent,standardItem.title);assert(!shown.textContent.includes(standardItem.id));assert.match(shown.textContent,/業務上の意味/);covered.add('BUSINESS-DRAWER-002');covered.add('REVIEW-ID-002');
 const legacyApp=await boot(legacy),L=legacyApp.$;L('#open-sample').click();await legacyApp.until(()=>!!L('#open-checks')&&!L('#open-checks').hidden);L('#check-open-sample').click();
 await legacyApp.until(()=>!!legacyApp.entry('tests:activity:業務設計'));legacyApp.entry('tests:activity:業務設計').click();assert.match(L('#tests-workspace [data-check-id="SAMPLE-01"]').textContent,/SAMPLE-01/);
 legacyApp.entry('business:業務設計').click();assert.equal(L('#detail .right-drawer-tabs'),null);assert(L('#detail>.markdown'));for(const title of ['Input','Output']){const heading=[...L('#detail>.markdown').children].find(el=>el.tagName==='H3'&&el.textContent===title);assert(heading&&heading.nextElementSibling?.tagName==='UL'&&heading.nextElementSibling.querySelector('li'),`legacy ${title} keeps its relations in a list`);}covered.add('BUSINESS-DRAWER-003');
 assert.equal(hash(readFileSync('../work/concept-review/issue-133/versions/purchase-v3-beta.json')),hash(purchaseRaw));assert.equal(standardItem.reviewState,'未レビュー');covered.add('REVIEW-ID-003');
 assert.deepEqual([...covered].sort(),required.sort());for(const [path,expected] of sources)assert.equal(hash(readFileSync(path)),expected);
 console.log(JSON.stringify({passed:[...covered],authorities:sources,scope:'application DOM; real browser and semantic review are separate'}));
}finally{for(const w of windows)w.close();}
