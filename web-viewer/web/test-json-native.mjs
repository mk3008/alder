import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {parseJSONDocument} from '../src/json-document.ts';
import {parseDocument} from '../src/document-input.ts';
const source=readFileSync('../work/viewer-json/issue-274/json-native/independent.json','utf8'),pkg=JSON.parse(source);
// Fail import resolution if native JSON reaches any MD business parser/adapter.
const compiled=await build({stdin:{contents:"export {parseJSONDocument} from './src/json-document.ts'; export {stateTransitionPanel} from './src/state-transitions.ts'; export {businessDetail,renderChecks} from './src/document-view.ts';",resolveDir:process.cwd()},plugins:[{name:'no-md-business',setup(b){b.onResolve({filter:/(?:legacy-|document-input|\/graph\.ts$)/},args=>{throw Error('MD dependency forbidden: '+args.path);});}}],bundle:true,write:false,metafile:true,format:'iife',globalName:'nativeJSON'});
assert.ok(!Object.keys(compiled.metafile.inputs).some(p=>/legacy-|document-input|graph\.ts$/.test(p)));
const dom=new JSDOM('<body></body>',{runScripts:'outside-only'});dom.window.eval(compiled.outputFiles[0].text+'\nwindow.nativeJSON=nativeJSON;');const ui=dom.window.nativeJSON;
try{
 const design=ui.parseJSONDocument(source),navigated=[],panel=ui.stateTransitionPanel(design,'object-request',id=>navigated.push(id));
 assert.equal(design.model.formatVersion,'0.4');assert.deepEqual(Array.from(panel.querySelectorAll('[data-transition]'),n=>n.dataset.transition),['T01','T02']);assert.ok(panel.textContent.includes('例外名：入力エラー'));
 panel.querySelector('[data-transition] button').click();assert.deepEqual(navigated,['activity-receive']);assert.ok(ui.businessDetail(design,'activity-receive').textContent.includes('項目を確認する。'));
 const withCheck=structuredClone(pkg);withCheck.documents.push({id:'check-document',schemaVersion:'0.1',kind:'checkItems',revision:'c1',title:'受付のCheck',basedOn:{documentId:'bd-native',revision:'bd-r1',verification:'unverified'},intro:[],index:[{activityId:'activity-receive',purpose:'',connections:'',checkIds:['check-1']}],sections:[{id:'section-receive',activityId:'activity-receive',title:'受付',preamble:[]}],guarantees:[],examples:[],items:[{id:'check-1',checkId:'CI-001',title:'受付条件',detailSummary:'',sectionId:'section-receive',reviewState:'要確認',fields:{condition:[{kind:'text',value:'番号がある'}],expectedResult:[{kind:'text',value:'受付を記録する'}]}}],notes:[]});
 const checked=ui.parseJSONDocument(JSON.stringify(withCheck)),checks=ui.renderChecks(checked,'activity-receive');assert.ok(checks.textContent.includes('番号がある'));assert.ok(checks.textContent.includes('要確認'));assert.equal(checked.model.checks[0].basedOn.verification,'unverified');
 const originalSVG=panel.querySelector('svg').outerHTML;
 for(const description of ['plain prose','**装飾の変更**\n- **偽の例外** — 説明','1. 番号付き\n\n別段落']){
  const changed=structuredClone(pkg);changed.documents[0].exceptions[0].description=description;changed.documents[0].activities[0].exception=description;
  const next=ui.parseJSONDocument(JSON.stringify(changed)),nextPanel=ui.stateTransitionPanel(next,'object-request',()=>{});assert.equal(nextPanel.querySelector('svg').outerHTML,originalSVG);assert.equal(next.model.states[0].transitions[1].exceptionId,'exception-receive');
 }
 assert.throws(()=>parseJSONDocument('# Activity old'),/JSON|value/);
 const md=readFileSync('web/authorities/business-design.md','utf8');assert.equal(parseDocument(md).sourceFormat,undefined);assert.ok(parseDocument(md).model.business.activities.length);
 const bad=structuredClone(pkg);bad.documents[1].transitions[1].exceptionId='unknown';bad.documents[0].activities[0].exception='- **入力エラー** — 表示用';assert.throws(()=>parseJSONDocument(JSON.stringify(bad)),/Dangling/);
}finally{dom.window.close();}
console.log('Native JSON state/detail bundle excludes MD business modules; IDs survive prose changes; independent T01/T02/Activity expectations pass');

// Observe actual dispatch: native JSON never calls the MD adapter; only an MD input does.
const dispatch=await build({entryPoints:['src/document-input.ts'],bundle:true,write:false,platform:'node',format:'cjs',plugins:[{name:'observe-md-adapter',setup(b){b.onLoad({filter:/legacy-document\.ts$/},args=>({contents:readFileSync(args.path,'utf8').replace('export function normalizeMarkdown(source:string):NormalizedDocument{','export function normalizeMarkdown(source:string):NormalizedDocument{ globalThis.__mdAdapterCalls=(globalThis.__mdAdapterCalls??0)+1;'),loader:'ts',resolveDir:process.cwd()+'/src'}));}}]});
const module={exports:{}};new Function('module','exports',dispatch.outputFiles[0].text)(module,module.exports);globalThis.__mdAdapterCalls=0;
module.exports.parseDocument(source);assert.equal(globalThis.__mdAdapterCalls,0);module.exports.parseDocument(readFileSync('web/authorities/business-design.md','utf8'));assert.equal(globalThis.__mdAdapterCalls,1);module.exports.parseDocument(source);assert.equal(globalThis.__mdAdapterCalls,1);delete globalThis.__mdAdapterCalls;
