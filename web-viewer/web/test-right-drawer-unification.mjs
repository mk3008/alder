import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';

const authority='verification/right-drawer-unification.check-items.json',expected='0eac6710bdf65df70baea17e7a906ba64a1f8b298aa1a63e59b1000ae1ae5d21';
const verify=bytes=>assert.equal(createHash('sha256').update(bytes).digest('hex'),expected);
const frozen=readFileSync(authority);verify(frozen);assert.throws(()=>verify(Buffer.from('{}')));
const parsed=JSON.parse(frozen),missingId=structuredClone(parsed),missingCondition=structuredClone(parsed);missingId.checks.pop();missingCondition.checks[0].condition='';
assert.throws(()=>verify(Buffer.from(JSON.stringify(missingId))));assert.throws(()=>verify(Buffer.from(JSON.stringify(missingCondition))));
const checks=parsed.checks,coverage=[];
const code=(await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}})).outputFiles[0].text;
const source=readFileSync('../work/concept-review/issue-133/versions/purchase-v3-beta.json','utf8'),pkg=JSON.parse(source),bd=pkg.documents.find(x=>x.kind==='businessDesign'),state=pkg.documents.find(x=>x.kind==='stateTransition');
const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/drawer',runScripts:'outside-only',pretendToBeVisual:true}).window;
w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLElement.prototype.setPointerCapture=()=>{};
const d=w.document,$=selector=>d.querySelector(selector),entry=id=>$('[data-explorer-key="'+id+'"]'),until=async fn=>{for(let i=0;i<1000;i++){if(fn())return;await new Promise(r=>setTimeout(r,5));}throw Error('not ready: '+fn);};
try{
 w.eval(code);await until(()=>!$('#open').disabled);$('#open-text').click();$('#source-text').value=source;await $('#source-submit').onclick();await until(()=>['saved','unchanged'].includes($('#app').dataset.saveState));
 const object=bd.objects.find(x=>x.id===state.objectId);entry('object:'+object.id).click();
 assert.equal($('#detail .right-drawer-heading h1').textContent,object.name);assert($('#business-drawer-close'));assert.equal($('#detail-mode-states'),null);
 assert.deepEqual([...d.querySelectorAll('#detail .right-drawer-tabs [role=tab]')].map(x=>x.textContent),['業務内容','チェック項目']);
 $('#detail-mode-checks').click();assert.equal($('#detail-mode-checks').getAttribute('aria-selected'),'true');$('#detail-mode-business').click();assert.equal($('#detail-mode-business').getAttribute('aria-selected'),'true');
 $('#business-drawer-close').click();assert($('#formattedMarkdownDrawer').hidden);$('#drawer').click();assert(!$('#formattedMarkdownDrawer').hidden);
 entry('business:'+bd.activities[0].id).click();assert.equal($('#detail h1').textContent,bd.activities[0].name);assert.equal($('#detail-mode-states'),null);coverage.push('DRAWER-UI-001');
 entry('states:'+object.id).click();assert($('.state-detail-page .state-diagram'),'state graph stays reachable from the explorer');entry('concept:group-request').click();
 assert.equal($('.concept-related .shell-heading strong').textContent,'購入要求・申請内容');assert.equal($('.concept-page-title'),null);assert.equal($('.concept-page-details details.concept-overview-section'),null);
 assert.deepEqual([...d.querySelectorAll('.concept-child-tabs [role=tab]')].map(x=>x.textContent),['概要','データ例']);assert.equal($('#concept-drawer-overview').getAttribute('aria-selected'),'true');assert.equal($('.data-review-overview').hidden,false);
 const frame=$('[data-concept-view=group-request]');$('[data-sample=request-submitted]').click();assert.equal($('#concept-drawer-examples').getAttribute('aria-selected'),'true');assert.equal($('.data-examples-panel').dataset.dataExample,'request-submitted');
 w.dispatchEvent(new w.MessageEvent('message',{origin:w.location.origin,source:frame.contentWindow,data:{type:'alder-concept-select',id:'item'}}));assert.equal($('.concept-related .shell-heading strong').textContent,'申請品目');assert.match($('.concept-related-content').textContent,/依頼数量/);assert.equal($('.data-examples-panel').dataset.dataExample,'request-submitted');
 $('#concept-drawer-examples').dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}));assert.equal($('#concept-drawer-overview').getAttribute('aria-selected'),'true');assert.equal(d.activeElement.id,'concept-drawer-overview');assert.equal($('.data-review-overview').hidden,false);
 $('.concept-related .shell-heading button').click();w.dispatchEvent(new w.MessageEvent('message',{origin:w.location.origin,source:frame.contentWindow,data:{type:'alder-concept-select',id:'version'}}));assert($('.concept-related').hidden,'selection must not reopen a closed drawer');$('#drawer').click();assert.equal($('.concept-related .shell-heading strong').textContent,'購入申請版');coverage.push('DRAWER-UI-002','DRAWER-UI-003');
 entry('concept:request').click();assert($('.concept-child-tabs').hidden,'single concept details have no extra tabs');assert.equal($('.concept-related .shell-heading strong').textContent,'購入申請');
 assert.equal($('.concept-related .shell-heading').classList.contains('right-drawer-heading'),true);entry('business:overview').click();assert.equal($('#detail .right-drawer-heading').classList.contains('right-drawer-heading'),true);coverage.push('DRAWER-UI-004','DRAWER-UI-005');
}finally{w.close();}
const complete=ids=>{assert.equal(ids.length,checks.length);assert.equal(new Set(ids).size,ids.length);assert.deepEqual(new Set(ids),new Set(checks.map(c=>c.id)));};complete(coverage);assert.throws(()=>complete(coverage.slice(1)));assert.throws(()=>complete([...coverage,coverage[0]]));verify(readFileSync(authority));
console.log(JSON.stringify({authority,sha256:expected,checks:coverage,scope:'DOM and shared structure; Chrome checks real geometry, themes and native interaction'}));
