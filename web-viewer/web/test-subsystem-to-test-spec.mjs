import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';

const authorityPath='verification/subsystem-to-test-spec.check-items.json',authorityHash='2d6d81fcdf9a1206ddc11a8803faaa35ca99525d1cef25cc99e0fc6ea1e9bb82';
const verify=bytes=>assert.equal(createHash('sha256').update(bytes).digest('hex'),authorityHash);
const authority=readFileSync(authorityPath);verify(authority);assert.throws(()=>verify(Buffer.from('{}')));
const ids=JSON.parse(authority).checks.map(item=>item.id),coverage=[];
const complete=values=>{assert.equal(values.length,ids.length);assert.equal(new Set(values).size,values.length);assert.deepEqual(new Set(values),new Set(ids));};
const inputPath='../work/concept-review/issue-133/versions/purchase-v7-value-independent-review.json',input=readFileSync(inputPath);
const pkg=JSON.parse(input),model=pkg.documents.find(d=>d.kind==='conceptModel'),check=pkg.documents.find(d=>d.kind==='checkItems'),checkId=new Map(check.items.map(item=>[item.id,item.checkId]));
// The link resolver must use the current document and explicit Check membership.
const resolverCode=(await build({entryPoints:['src/test-spec-functions.ts'],bundle:true,write:false,format:'iife',globalName:'SpecFns'})).outputFiles[0].text;
const resolverWindow=new JSDOM('',{runScripts:'outside-only'}).window;
resolverWindow.eval(resolverCode+';globalThis.SpecFns=SpecFns;');
const {testFunctions,sampleDestination}=resolverWindow.SpecFns,business=pkg.documents.find(d=>d.kind==='businessDesign'),functions=testFunctions({business,model},[check]);
const draft=functions.find(item=>item.groupId==='group-request'&&item.capability.id==='save-draft');
assert(draft);assert.equal(sampleDestination(functions,'other-document',draft.capability.id,'request-draft-approved'),undefined);
const otherDocument=structuredClone(check);otherDocument.basedOn.documentId='different-document';
assert.equal(testFunctions({business,model},[otherDocument]).length,0,'another document cannot supply sample targets');
const noDisplayedDecision={...draft,decisionTableCheckIds:[]};
assert.equal(sampleDestination([noDisplayedDecision],draft.groupId,draft.capability.id,'request-draft-empty'),undefined,'a Check not displayed in the decision table is not a link target');
resolverWindow.close();
const code=(await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}})).outputFiles[0].text;
async function appFor(source){
 const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/spec-links',runScripts:'outside-only',pretendToBeVisual:true}).window;
 w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLElement.prototype.setPointerCapture=()=>{};
 const d=w.document,$=s=>d.querySelector(s),entry=key=>$(`[data-explorer-key="${key}"]`),until=async fn=>{for(let i=0;i<800;i++){if(fn())return;await new Promise(resolve=>setTimeout(resolve,5));}throw Error('Viewer did not become ready');};
 w.eval(code);await until(()=>$('#open')&&!$('#open').disabled);$('#open-text').click();$('#source-text').value=source;await $('#source-submit').onclick();await until(()=>['saved','unchanged'].includes($('#app').dataset.saveState));
 return {w,d,$,entry};
}
const app=await appFor(input.toString('utf8')),{w,$,entry}=app;
try{
 let resultCount=0,decisionCount=0;
 for(const group of model.reviewGroups)for(const capability of group.capabilities){
  const view=model.presentation.activityViews.find(v=>v.testSpecificationFunctions?.some(f=>f.groupId===group.id&&f.capabilityId===capability.id));assert(view,'explicit Activity/function link is needed');
  const spec=capability.testSpecification,key=`fn:${view.activityId}:${group.id}:${capability.id}`;
  for(const sample of capability.samples){
   entry('concept:'+group.id).click();if($('.concept-related').hidden)$('#drawer').click();
   const button=$(`[data-capability="${capability.id}"] [data-sample="${sample.id}"]`);assert(button&&!button.disabled,sample.id);button.click();
   assert.equal($('#app').dataset.workspaceArea,'tests',sample.id);assert($('.concept-related').hidden,'test specification uses the main area');
   const url=new URL(w.location.href),page=$('#tests-workspace'),samplePanel=[...page.querySelectorAll('.activity-test-samples')].find(node=>node.dataset.functionKey===key);
   if(spec.sampleIds.includes(sample.id)){
    assert.match(button.textContent,/^サンプル：/);assert.equal(url.searchParams.get('spec'),'activity:'+view.activityId);assert.equal(url.searchParams.get('specPart'),key);assert.equal(url.searchParams.get('dataExample'),sample.id);
    const current=samplePanel?.querySelector('[data-data-example]');assert(current,sample.id);assert.equal(current.dataset.dataExample,sample.id);assert(current.textContent.includes(sample.name),sample.id+' must show the selected scene');
    for(const id of sample.checkIds)assert(page.textContent.includes(checkId.get(id)),sample.id+' does not show '+id);resultCount++;
   }else{
    assert.match(button.textContent,/^可否判定：/);assert.equal(url.searchParams.get('spec'),'activity:'+view.activityId);assert.equal(url.searchParams.get('specPart'),'decision:'+key);assert.equal(url.searchParams.has('dataExample'),false);assert(page.querySelector('.decision-examples'),sample.id);
    assert(sample.checkIds.some(id=>page.textContent.includes(checkId.get(id))),sample.id+' does not show its decision Check');decisionCount++;
   }
  }
 }
 assert.equal(resultCount,20);assert.equal(decisionCount,13);coverage.push('SUBSYSTEM-SPEC-001','SUBSYSTEM-SPEC-002');
 // Opening a specific scene overrides the previous selection without duplicating the tab.
 entry('concept:group-request').click();if($('.concept-related').hidden)$('#drawer').click();
 $('[data-sample=request-draft-approved]').click();const focused=()=>[...$('#tests-workspace').querySelectorAll('.activity-test-samples')].find(node=>node.open);assert.equal(focused().querySelector('[data-data-example]').dataset.dataExample,'request-draft-approved');
 const activeURL=w.location.href;entry('concept:group-request').click();$('[data-sample=request-draft-prepared]').click();assert.equal(focused().querySelector('[data-data-example]').dataset.dataExample,'request-draft-prepared');
 const draftView=model.presentation.activityViews.find(v=>v.testSpecificationFunctions?.some(f=>f.groupId==='group-request'&&f.capabilityId==='save-draft'));
 const draftTab=`spec-tab-activity:${draftView.activityId}`;
 assert.equal([...w.document.querySelectorAll('.spec-tabs button')].filter(button=>button.id===draftTab).length,1,'the existing result tab is reused');
 // The saved test URL restores its exact sample, while Back returns to the original graph.
 w.history.pushState({},'',activeURL);w.dispatchEvent(new w.PopStateEvent('popstate'));assert.equal(focused().querySelector('[data-data-example]').dataset.dataExample,'request-draft-approved');
 w.history.back();await new Promise(resolve=>w.addEventListener('popstate',resolve,{once:true}));assert.equal($('#app').dataset.workspaceArea,'tests');assert.equal(focused().querySelector('[data-data-example]').dataset.dataExample,'request-draft-prepared');
 w.history.back();await new Promise(resolve=>w.addEventListener('popstate',resolve,{once:true}));assert.equal($('#app').dataset.workspaceArea,'concept');assert.equal($('.concept-related').hidden,false);
 coverage.push('SUBSYSTEM-SPEC-004');
}finally{w.close();}
// A legacy unlinked sample stays readable by its historic URL but cannot become an inferred test link.
const legacy=await appFor(readFileSync('../work/concept-review/issue-133/versions/purchase-v3-beta.json','utf8'));
try{
 legacy.entry('concept:group-request').click();if(legacy.$('.concept-related').hidden)legacy.$('#drawer').click();
 const button=legacy.$('[data-sample=request-submitted]'),url=legacy.w.location.href;assert(button.disabled);button.click();assert.equal(legacy.w.location.href,url);assert.equal(legacy.$('#app').dataset.workspaceArea,'concept');
 const oldURL=new URL(url);oldURL.searchParams.set('dataExample','request-submitted');legacy.w.history.pushState({},'',oldURL);legacy.w.dispatchEvent(new legacy.w.PopStateEvent('popstate'));
 assert.equal(legacy.$('.data-examples-panel').dataset.dataExample,'request-submitted');assert.equal(legacy.$('.data-examples-panel').hidden,false);coverage.push('SUBSYSTEM-SPEC-003');
}finally{legacy.w.close();}
complete(coverage);assert.throws(()=>complete(coverage.slice(1)));assert.throws(()=>complete([...coverage,coverage[0]]));verify(readFileSync(authorityPath));assert.deepEqual(readFileSync(inputPath),input);
console.log(JSON.stringify({authority:authorityPath,sha256:authorityHash,checks:coverage,resultSamples:20,decisionLinks:13,scope:'actual app DOM; native browser, visual and human review are separate'}));
