import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {registerHooks} from 'node:module';
import {JSDOM} from 'jsdom';
import {build} from 'esbuild';

registerHooks({resolve(s,c,n){if((s.startsWith('./')||s.startsWith('../'))&&!/\.[a-z0-9]+$/i.test(s)){try{return n(s+'.ts',c)}catch{}try{return n(s+'.js',c)}catch{}}return n(s,c)}});
const hash=data=>createHash('sha256').update(data).digest('hex');
const authorityPath='verification/structure-explorer-tab.check-items.json';
const authorityHash='85552428a8e1c1161eda3bd42ba498b87fb227261f152c9d51dee9c39069efa1';
const authority=readFileSync(authorityPath);
function checkAuthority(bytes){assert.equal(hash(bytes),authorityHash,'fixed tab authority');}
checkAuthority(authority);assert.throws(()=>checkAuthority(Buffer.from('{}')),/fixed tab authority/);
const ids=JSON.parse(authority).checks.map(check=>check.id);
assert.deepEqual(ids,['STRUCTURE-TAB-001','STRUCTURE-TAB-002','STRUCTURE-TAB-003']);
const covered=[];
function checkCoverage(actual){assert.deepEqual([...actual].sort(),ids.slice().sort(),'all tab guarantees are covered');assert.equal(new Set(actual).size,actual.length,'tab results are unique');}
assert.throws(()=>checkCoverage(ids.slice(1)),/all tab guarantees/);
assert.throws(()=>checkCoverage([...ids,ids[0]]),/all tab guarantees|unique/);

const {parseDocument}=await import('../src/document-input.ts');
const read=path=>{const model=parseDocument(readFileSync(path,'utf8')).model;return {model:model.concepts[0],business:model.business};};
const normal=read('../business-design/alder/json-normalized-model-review.json');
const physical=read('../business-design/alder/json-structure-review.json');
const code=(await build({entryPoints:['src/viewer-shell.ts'],bundle:true,write:false,format:'iife',globalName:'Shell',loader:{'.css':'empty'}})).outputFiles[0].text;
const markup='<div id="app"><header><button id="node-list-toggle"></button><button id="drawer"></button></header><div class="tab-strip"><nav id="tabs"></nav></div><div class="workspace"><aside id="node-list-drawer" hidden></aside><main></main></div></div>';
function boot(url,initial=normal,key='candidate',saved){
 const w=new JSDOM(markup,{url,runScripts:'outside-only',pretendToBeVisual:true}).window;
 if(saved)w.sessionStorage.setItem('alder-explorer-v1:'+w.location.pathname,saved);
 w.eval(code+';globalThis.Shell=Shell;');
 let current=initial,documentKey=key;
 const shell=w.Shell.installViewerShell(w.document.querySelector('#app'),{capture(){},business:()=>({key:documentKey,concept:current,activities:[],objects:[],states:[],views:[{key:'overview',name:'全体図'}],viewKey:'overview'}),openActivity(){},openObject(){},openOverview(){},activateView(){},statePanel(){},closeLegacyList(){},refresh(){}});
 shell.syncDocument();
 return {w,d:w.document,shell,change(next,nextKey){current=next;documentKey=nextKey;shell.syncDocument();}};
}
const livePage=d=>d.querySelector('.structure-explorer:not([hidden])');
const firstRoot=page=>page?.querySelector('.structure-root > .structure-item');
const structureTab=(d,name)=>[...d.querySelectorAll('.concept-tabs button')].find(button=>button.getAttribute('aria-label')==='データ構造：'+name);
const detailValue=(d,label)=>[...d.querySelectorAll('.structure-detail-page:not([hidden]) dt')].find(dt=>dt.textContent===label)?.nextElementSibling?.textContent;
const selectedField=(d,local,owner)=>{assert.equal(detailValue(d,'ローカル名'),local);assert.match(detailValue(d,'所属'),owner);};
const test=boot('https://viewer.test/?view=concept&concept=structure-explorer');
let saved;
try{
 const {w,d}=test,rootPage=livePage(d),root=firstRoot(rootPage),content=()=>d.querySelector('.structure-detail-page:not([hidden]) .structure-detail-content');
 const go=id=>{const url=new URL(w.location.href);url.searchParams.set('view','concept');url.searchParams.set('concept',id);w.history.pushState({},'',url);w.dispatchEvent(new w.PopStateEvent('popstate'));};
 assert.equal(root.dataset.conceptId,'n-bd');assert(!rootPage.querySelector('.structure-open'),'separate-open controls were removed');assert(d.querySelector('#drawer').disabled);assert(d.querySelector('#concept-related-panel').hidden);
 content().querySelector('.structure-attribute-select').click();selectedField(d,'識別子',/業務設計書/);
 const activity=rootPage.querySelector('[data-relation-id="nr-bd-activity"][data-relation-direction="owned"] > details');activity.open=true;activity.dispatchEvent(new w.Event('toggle'));
 go('structure-explorer:n-activity');assert(activity.open,'switching a direct URL preserves the original expansion');assert(rootPage.hidden);
 const activityPage=livePage(d),activityRoot=firstRoot(activityPage);assert.equal(activityRoot.dataset.conceptId,'n-activity');assert(!activityRoot.querySelector('.structure-field'));assert(!activityRoot.querySelector('.structure-open'));
 content().querySelector('.structure-attribute-select').click();selectedField(d,'識別子',/業務/);
 const search=activityPage.querySelector('input[type=search]');search.value='名前';search.dispatchEvent(new w.Event('input'));content().querySelector('.structure-attribute-back').click();content().querySelector('[data-information-id="n-activity-field-2"] button').click();search.value='';search.dispatchEvent(new w.Event('input'));assert(activityPage.querySelector('.structure-selected'),'selection follows the restored tree after search');selectedField(d,'名前',/業務/);
 assert(activityRoot.querySelector('[data-relation-id="nr-activity-step"]'));assert(activityRoot.querySelector('[data-relation-id="nr-who-activity"]'));
 assert(!activityPage.textContent.includes('この起点からたどれない構造'));assert(!activityPage.textContent.includes('JSON全体のルートを'));
 assert.equal(new URL(w.location.href).searchParams.get('concept'),'structure-explorer:n-activity');assert(structureTab(d,'構造-業務'));
 go('structure-explorer:n-step');const stepPage=livePage(d);assert.equal(firstRoot(stepPage).dataset.conceptId,'n-step');assert.equal(structureTab(d,'構造-手順行').getAttribute('aria-current'),'true');
 structureTab(d,'構造-業務').click();assert.equal(livePage(d),activityPage);selectedField(d,'名前',/業務/);
 structureTab(d,'構造-業務設計書').click();assert.equal(livePage(d),rootPage);assert(activity.open);selectedField(d,'識別子',/業務設計書/);
 const count=d.querySelectorAll('.concept-tabs .tab').length;go('structure-explorer:n-activity');assert.equal(d.querySelectorAll('.concept-tabs .tab').length,count,'an existing direct URL reuses its tab');assert.equal(livePage(d),activityPage);selectedField(d,'名前',/業務/);covered.push('STRUCTURE-TAB-001');
 activityPage.querySelector('.structure-toolbar button').click();assert(activityPage.querySelector('.structure-seen'));assert(activityPage.querySelectorAll('.structure-item').length<=normal.model.relations.length+1);assert(activityPage.querySelector('[data-relation-id="nr-step-dependency"]'));assert.equal(activityPage.querySelectorAll('[data-relation-direction="owner"],[data-relation-direction="referencedBy"]').length,0);
 activityPage.querySelectorAll('.structure-toolbar button')[1].click();assert(!firstRoot(activityPage).querySelector(':scope > details').open);covered.push('STRUCTURE-TAB-003');
 saved=w.sessionStorage.getItem('alder-explorer-v1:/');structureTab(d,'構造-手順行').click();
 d.querySelector('[aria-label="データ構造：構造-手順行のタブを閉じる"]').click();assert.equal(livePage(d),activityPage);
 d.querySelector('[aria-label="データ構造：構造-業務のタブを閉じる"]').click();assert.equal(livePage(d),rootPage);assert(activity.open);
 go('structure-explorer:n-activity');test.change(physical,'other');assert(!structureTab(d,'構造-業務'));assert(!d.querySelector('[data-concept-id="n-activity"]'));
 d.querySelector('#explorer-tab-structure').click();assert.equal(firstRoot(livePage(d)).dataset.conceptId,'fmt-package');covered.push('STRUCTURE-TAB-002');
}finally{test.w.close();}
const direct=boot('https://viewer.test/?view=concept&concept=structure-explorer%3An-activity');
try{assert.equal(firstRoot(livePage(direct.d)).dataset.conceptId,'n-activity');assert(structureTab(direct.d,'構造-業務'));}finally{direct.w.close();}
const restored=boot('https://viewer.test/?view=concept&concept=structure-explorer%3An-activity',normal,'candidate',saved);
try{assert.equal(firstRoot(livePage(restored.d)).dataset.conceptId,'n-activity');assert(structureTab(restored.d,'構造-業務設計書'));}finally{restored.w.close();}
const invalid=boot('https://viewer.test/?view=concept&concept=structure-explorer%3Amissing');
try{assert.equal(livePage(invalid.d),null,'unknown direct roots do not select an unrelated structure');}finally{invalid.w.close();}

const selected=boot('https://viewer.test/?view=concept&concept=structure-explorer');
let selectedTabs,selectedUrl;
try{
 const {w,d}=selected,tree=livePage(d);
 const activity=tree.querySelector('[data-relation-id="nr-bd-activity"] > details');
 const open=(row)=>row.querySelector(':scope > summary').click();
 open(activity);activity.open=true;activity.dispatchEvent(new w.Event('toggle'));
 const activityTab=()=>structureTab(d,'構造-業務');
 assert.equal(activityTab().getAttribute('aria-current'),'true');assert.equal(structureTab(d,'構造-業務設計書').getAttribute('aria-current'),'false');
 assert.equal(detailValue(d,'ローカル名'),'業務');
 assert.match(d.querySelector('.structure-detail-page:not([hidden]) .structure-detail-content').textContent,/BusinessDesign/);
 const step=activity.querySelector('[data-relation-id="nr-activity-step"] > details');open(step);
 assert.equal(detailValue(d,'型名'),'Step');assert.equal(livePage(d),tree);
 const tabs=()=>d.querySelectorAll('.concept-tabs .tab').length;
 assert.equal(tabs(),3);activityTab().click();assert.equal(detailValue(d,'型名'),'Activity');
 assert.equal(tree.querySelector('[aria-current=true]').closest('[data-concept-id]').dataset.conceptId,'n-activity');
 open(step);assert.equal(tabs(),3,'reselecting a structure uses its existing tab');
 selectedTabs=w.sessionStorage.getItem('alder-explorer-v1:/');selectedUrl=w.location.href;
}finally{selected.w.close();}
const reloaded=boot(selectedUrl,normal,'candidate',selectedTabs);
try{
 assert.equal(firstRoot(livePage(reloaded.d)).dataset.conceptId,'n-bd','tree context survives reloading a tab opened from the full tree');
 assert.equal(structureTab(reloaded.d,'構造-手順行').getAttribute('aria-current'),'true');
 assert.equal(reloaded.d.querySelectorAll('.concept-tabs .tab').length,3);
}finally{reloaded.w.close();}

const duplicateNames=structuredClone(normal);
duplicateNames.model.meta.conceptNames['n-bd'].logicalName='業務';
const named=boot('https://viewer.test/?view=concept&concept=structure-explorer',duplicateNames);
try{
 const {d}=named;
 assert(structureTab(d,'構造-業務1'));
 livePage(d).querySelector('[data-relation-id="nr-bd-activity"] > details > summary').click();
 assert(structureTab(d,'構造-業務1'));assert.equal(structureTab(d,'構造-業務2').getAttribute('aria-current'),'true');
}finally{named.w.close();}
checkCoverage(covered);checkAuthority(readFileSync(authorityPath));
console.log('STRUCTURE-TAB-001..003: focused tabs, navigation, document isolation and bounded recursion verified.');
