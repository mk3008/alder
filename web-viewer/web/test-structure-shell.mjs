import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

const path='verification/structure-navigation-drawer.check-items.json',hash='645206078b8c41c7de054ab2effb896d3fff3b0dd967cd4b06655e6c9a1a32eb';
const frozen=readFileSync(path),verify=bytes=>assert.equal(createHash('sha256').update(bytes).digest('hex'),hash);
verify(frozen);assert.throws(()=>verify(Buffer.from('{}')));
const authority=JSON.parse(frozen),coverage=new Set();
const code=(await build({entryPoints:['src/viewer-shell.ts'],bundle:true,write:false,format:'iife',globalName:'Shell',loader:{'.css':'empty'}})).outputFiles[0].text;
const pkg=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v2-beta.json')),bd=pkg.documents.find(d=>d.kind==='businessDesign');
function boot(query='&concept=group-request',saved){
 const w=new JSDOM('<div id="app"><header><button id="node-list-toggle">Left</button><button id="drawer">Right</button></header><div class="tab-strip"><nav id="tabs"></nav></div><div class="workspace"><aside id="node-list-drawer" hidden></aside><main></main></div></div>',{url:'https://viewer.test/?view=concept&conceptFixture=purchase'+query,runScripts:'outside-only',pretendToBeVisual:true}).window;
 if(saved)w.sessionStorage.setItem('alder-explorer-v1:/',JSON.stringify(saved));w.eval(code+';globalThis.Shell=Shell;');let key='purchase',opened;
 const shell=w.Shell.installViewerShell(w.document.querySelector('#app'),{capture(){},business:()=>({key,viewKey:'overview',activities:bd.activities,states:[],views:[{key:'overview',name:'全体図'}]}),openActivity(id){opened=id;},openObject(){},openOverview(){},activateView(){},statePanel(){},closeLegacyList(){},refresh(){}});shell.syncDocument();return {w,d:w.document,shell,opened:()=>opened,other(){key='other';shell.syncDocument();}};
}
const t=boot();try{
 const {d,w}=t,keys=selector=>[...d.querySelectorAll(selector)].map(b=>b.dataset.explorerKey);
 assert.deepEqual(keys('#explorer-subsystems>.explorer-item'),['concept:landscape']);
 assert.deepEqual(keys('#explorer-subsystem-approval .explorer-item'),['concept:group-request','concept:group-decision']);
 assert.deepEqual(keys('#explorer-subsystem-receiving .explorer-item'),['concept:group-handoff','concept:group-result']);
 assert.deepEqual(keys('#explorer-concept>.explorer-item'),['concept:overview']);
 assert.deepEqual(keys('#explorer-concept-relations .explorer-item'),['concept:request','concept:version','concept:item','concept:preparation','concept:receipt','concept:line']);
 const entries=keys('.explorer-groups [data-explorer-key^="concept:"]');assert.equal(entries.length,12);assert.equal(new Set(entries).size,12);assert.equal(d.querySelector('[data-explorer-key="group:concept-model"]'),null);
 const parent=d.querySelector('[data-explorer-key="group:subsystem-approval"]');parent.click();const input=d.querySelector('input');input.value='購入要求';input.dispatchEvent(new w.Event('input'));assert(!d.querySelector('#explorer-subsystem-approval').hidden);assert(!d.querySelector('#explorer-subsystems').hidden);input.value='';input.dispatchEvent(new w.Event('input'));assert(d.querySelector('#explorer-subsystem-approval').hidden);
 const saved=JSON.parse(w.sessionStorage.getItem('alder-explorer-v1:/'));const restored=boot('',saved);try{assert(restored.d.querySelector('#explorer-subsystem-approval').hidden);}finally{restored.w.close();}coverage.add('STRUCTURE-SHELL-001');
 for(const id of ['group-request','group-decision','group-handoff','group-result']){
  d.querySelector('[data-explorer-key="concept:'+id+'"]').click();assert.equal(d.querySelector('.concept-main .data-example-modes, .concept-main h1'),null);assert.equal(d.querySelector('[data-concept-view="'+id+'"]').hidden,false);assert(d.querySelector('.data-review-overview').closest('.concept-related'));assert(d.querySelector('.data-examples-panel').closest('.concept-related'));assert(d.querySelector('.review-capability [data-sample]'));assert(d.querySelector('.review-related-activities button:not(:disabled)'));assert.equal(d.querySelector('[data-explorer-key="concept:'+id+'"]').getAttribute('aria-current'),'page');
 }
 d.querySelector('[data-explorer-key="concept:group-request"]').click();const frame=d.querySelector('[data-concept-view=group-request]'),send=id=>w.dispatchEvent(new w.MessageEvent('message',{origin:w.location.origin,source:frame.contentWindow,data:{type:'alder-concept-select',id}}));
 assert(d.querySelector('.concept-related').hidden);send('request');assert(d.querySelector('.concept-related').hidden);d.querySelector('#drawer').click();
 const page=d.querySelector('.concept-page-details');d.querySelector('[data-sample=request-submitted]').click();assert.equal(frame.hidden,false);assert(d.querySelector('.concept-examples-section').open);assert.equal(d.querySelector('.data-examples-panel').dataset.dataExample,'request-submitted');send('item');assert.equal(d.querySelector('.concept-page-details'),page);assert.equal(d.querySelector('.data-examples-panel').dataset.dataExample,'request-submitted');assert.match(d.querySelector('.concept-related-content').textContent,/依頼数量/);assert.match(page.textContent,/申請者/);coverage.add('STRUCTURE-SHELL-003');
 const separator=d.querySelector('[role=separator]');const width=+separator.getAttribute('aria-valuenow');separator.dispatchEvent(new w.KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}));assert.equal(+separator.getAttribute('aria-valuenow'),width+40);separator.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Home',bubbles:true}));assert.equal(+separator.getAttribute('aria-valuenow'),280);assert.equal(w.sessionStorage.getItem('alder-explorer-v1:/:drawer-width'),'280');coverage.add('STRUCTURE-SHELL-004');
 t.other();assert.equal(d.querySelectorAll('[data-explorer-key^="concept:group-"]').length,0);assert.equal(d.querySelector('.concept-page-details').hidden,true);assert.equal(d.querySelector('.data-review-overview').textContent,'');coverage.add('STRUCTURE-SHELL-005');
}finally{t.w.close();}
for(const query of ['&concept=group-request&dataView=overview','&concept=group-request&dataExample=request-submitted']){const x=boot(query);try{assert.equal(x.d.querySelector('[data-concept-view=group-request]').hidden,false);assert.equal(x.d.querySelector('.concept-related').hidden,false);assert.equal(x.d.querySelector('.concept-examples-section').open,query.includes('dataExample'));}finally{x.w.close();}}
coverage.add('STRUCTURE-SHELL-002');
for(const version of [2,3]){const x=boot('',{expandedVersion:version,expanded:['business','concept']});try{assert(x.d.querySelector('#explorer-business-activity').hidden);assert(!x.d.querySelector('#explorer-subsystems').hidden);assert(!x.d.querySelector('#explorer-subsystem-approval').hidden);}finally{x.w.close();}}
assert.deepEqual(new Set(authority.checks.map(c=>c.id)),coverage);verify(readFileSync(path));console.log(JSON.stringify({authority:path,sha256:hash,checks:[...coverage],status:'pass',scope:'DOM; Chrome verifies rendering, pointer resize, themes and mobile'}));
