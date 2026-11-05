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
const test=boot('https://viewer.test/?view=concept&concept=structure-explorer');
let saved;
try{
 const {w,d}=test,rootPage=livePage(d),root=firstRoot(rootPage);
 assert.equal(root.dataset.conceptId,'n-bd');
 rootPage.querySelector('.structure-field button').click();assert(d.querySelector('#concept-related-panel').hidden,'selection preserves a closed drawer');
 const activity=rootPage.querySelector('[data-relation-id="nr-bd-activity"][data-relation-direction="owned"] > details');
 const openActivity=activity.querySelector(':scope > summary > button.structure-open');
 assert(openActivity?.querySelector('svg'),'each structure has an external-link icon');
 assert.equal(openActivity.getAttribute('aria-label'),'業務（Activity）の構造を別タブで開く');
 activity.open=true;activity.dispatchEvent(new w.Event('toggle'));
 openActivity.click();
 assert(activity.open,'opening another tab does not collapse the source');
 assert(rootPage.hidden,'original tree remains available in its own tab');
 const activityPage=livePage(d),activityRoot=firstRoot(activityPage);
 assert.equal(activityRoot.dataset.conceptId,'n-activity');
 assert(activityRoot.textContent.includes('識別子'));
 activityRoot.querySelector('.structure-field button').click();d.querySelector('#drawer').click();assert(d.querySelector('.concept-related-content').textContent.includes('activities.id'),'the identifier mapping appears in the detail');
 const search=activityPage.querySelector('input[type=search]');search.value='名前';search.dispatchEvent(new w.Event('input'));activityPage.querySelector('[data-information-id="n-activity-field-2"] button').click();search.value='';search.dispatchEvent(new w.Event('input'));assert(activityPage.querySelector('[data-information-id="n-activity-field-2"] button').classList.contains('structure-selected'),'selection follows the restored tree after search');assert(d.querySelector('.concept-related-content').textContent.includes('activities.name'));
 assert(activityRoot.querySelector('[data-relation-id="nr-activity-step"]'));
 assert(activityRoot.querySelector('[data-relation-id="nr-who-activity"]'));
 assert(!activityRoot.querySelector(':scope > details > summary > button.structure-open'),'current root has no self-link');
 assert(!activityPage.textContent.includes('この起点からたどれない構造'));
 assert(!activityPage.textContent.includes('JSON全体のルートを'));
 assert.equal(new URL(w.location.href).searchParams.get('concept'),'structure-explorer:n-activity');
 assert(structureTab(d,'業務（Activity）・構造'));

 const step=activityPage.querySelector('[data-relation-id="nr-activity-step"] > details');
 const openStep=step.querySelector(':scope > summary > button.structure-open');
 openStep.click();
 const stepPage=livePage(d);assert.equal(firstRoot(stepPage).dataset.conceptId,'n-step');
 assert.equal(structureTab(d,'手順行（Step）・構造').getAttribute('aria-current'),'true');
 structureTab(d,'業務（Activity）・構造').click();assert.equal(livePage(d),activityPage);
 assert(d.querySelector('.concept-related-content').textContent.includes('activities.name'),'each tab restores its selection');
 structureTab(d,'構造エクスプローラー').click();assert.equal(livePage(d),rootPage);assert(activity.open);
 assert(d.querySelector('.concept-related-content').textContent.includes('businessDesigns.id'),'returning to the root restores its selection');
 const count=d.querySelectorAll('.concept-tabs .tab').length;openActivity.click();
 assert.equal(d.querySelectorAll('.concept-tabs .tab').length,count,'opening an existing structure reuses its tab');
 assert.equal(livePage(d),activityPage);
 assert(d.querySelector('.concept-related-content').textContent.includes('activities.name'));
 covered.push('STRUCTURE-TAB-001');

 activityPage.querySelector('.structure-toolbar button').click();
 assert(activityPage.querySelector('.structure-seen'),'cycles or shared structures are marked');
 assert(activityPage.querySelectorAll('.structure-item').length<=normal.model.relations.length+1,'focused expansion is bounded');
 assert(activityPage.querySelector('[data-relation-id="nr-step-dependency"]'),'recursive relationships remain available');
 assert.equal(activityPage.querySelectorAll('[data-relation-direction="owner"],[data-relation-direction="referencedBy"]').length,0);
 activityPage.querySelectorAll('.structure-toolbar button')[1].click();assert(!firstRoot(activityPage).querySelector(':scope > details').open);
 covered.push('STRUCTURE-TAB-003');

 saved=w.sessionStorage.getItem('alder-explorer-v1:/');
 structureTab(d,'手順行（Step）・構造').click();
 const closeStep=d.querySelector('[aria-label="データ構造：手順行（Step）・構造のタブを閉じる"]');closeStep.click();
 assert.equal(livePage(d),activityPage,'closing the focused tab returns to the previous open tab');
 const closeActivity=d.querySelector('[aria-label="データ構造：業務（Activity）・構造のタブを閉じる"]');closeActivity.click();
 assert.equal(livePage(d),rootPage);assert(activity.open);
 openActivity.click();test.change(physical,'other');
 assert(!structureTab(d,'業務（Activity）・構造'),'document changes remove tabs from the old model');
 assert(!d.querySelector('[data-concept-id="n-activity"]'),'document changes remove old tree pages');
 d.querySelector('[data-explorer-key="concept:structure-explorer"]').click();
 assert.equal(firstRoot(livePage(d)).dataset.conceptId,'fmt-package');
 covered.push('STRUCTURE-TAB-002');
}finally{test.w.close();}
const direct=boot('https://viewer.test/?view=concept&concept=structure-explorer%3An-activity');
try{assert.equal(firstRoot(livePage(direct.d)).dataset.conceptId,'n-activity');assert(structureTab(direct.d,'業務（Activity）・構造'));}finally{direct.w.close();}
const restored=boot('https://viewer.test/?view=concept&concept=structure-explorer%3An-activity',normal,'candidate',saved);
try{assert.equal(firstRoot(livePage(restored.d)).dataset.conceptId,'n-activity');assert(structureTab(restored.d,'構造エクスプローラー'));}finally{restored.w.close();}
const invalid=boot('https://viewer.test/?view=concept&concept=structure-explorer%3Amissing');
try{assert.equal(livePage(invalid.d),null,'unknown direct roots do not select an unrelated structure');}finally{invalid.w.close();}
checkCoverage(covered);checkAuthority(readFileSync(authorityPath));
console.log('STRUCTURE-TAB-001..003: focused tabs, navigation, document isolation and bounded recursion verified.');
