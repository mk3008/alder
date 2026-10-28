// Read-only verification phase. Expected behavior comes from the separate
// verification authority, never from canOpenDetail or copied code predicates.
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {resolve,dirname} from 'node:path';
import {JSDOM} from 'jsdom';
import {build} from 'esbuild';
import {IDBFactory} from 'fake-indexeddb';
import {baselineCommit,authorityPath,frozenAuthorities,assertAuthorities,assertCoverage} from './navigation-authority-gate.mjs';
const frozenFiles=frozenAuthorities(),frozen=frozenFiles.get(authorityPath),raw=readFileSync(authorityPath),authority=JSON.parse(raw),sha=s=>createHash('sha256').update(s).digest('hex');
assertAuthorities(frozenFiles,readFileSync);
assert.equal(authority.format,'viewer-verification/1');assert(authority.checks.length);assert(existsSync(resolve(dirname(authorityPath),authority.requirement.split('#')[0])));
const ids=new Set();for(const c of authority.checks){assert(c.id&&!ids.has(c.id));ids.add(c.id);for(const k of ['condition','guarantee','reason'])assert(c[k]?.trim());assert.equal(c.verification,'web/review-navigation-contract.mjs');assert(['detail','overview'].includes(c.context));assert(['current','neighbor'].includes(c.target));assert.equal(typeof c.expected.detailLink,'boolean');assert(c.domains.length&&c.selections.length);}
const bundle=async entry=>(await build({entryPoints:[entry],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}})).outputFiles[0].text;
const [businessCode,conceptCode]=await Promise.all([bundle('src/main.ts'),bundle('src/concept-canvas.js')]);
const source=JSON.parse(readFileSync('../work/json-state/issue-275/purchase.json','utf8')),activities=source.documents.find(d=>d.kind==='businessDesign').activities;
const businessIDs={current:activities.find(a=>a.name==='購入申請を再申請・破棄する').id,neighbor:activities.find(a=>a.name==='備品購入を申請する').id},conceptIDs={current:'preparation',neighbor:'request'};
async function until(fn){for(let i=0;i<500;i++){if(fn())return;await new Promise(r=>setTimeout(r,10));}throw Error('UI did not become ready');}
function tap(w,node){for(const type of ['pointerdown','pointerup']){const e=new w.MouseEvent(type,{bubbles:true,button:0,clientX:10,clientY:10});Object.defineProperties(e,{pointerId:{value:1},pointerType:{value:'mouse'}});node.dispatchEvent(e);}}
async function observe(domain,c,selection){
 const concept=domain==='concept',keys=concept?conceptIDs:businessIDs,current=c.context==='detail'?keys.current:undefined;
 let parentWindow,frame;
 if(concept){parentWindow=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/contract/index.html?conceptFixture=purchase',runScripts:'outside-only',pretendToBeVisual:true}).window;parentWindow.indexedDB=new IDBFactory();parentWindow.structuredClone=structuredClone;parentWindow.TextEncoder=TextEncoder;parentWindow.HTMLElement.prototype.scrollIntoView=()=>{};parentWindow.eval(businessCode);await until(()=>!parentWindow.document.querySelector('#open').disabled);parentWindow.document.querySelector('#open-text').click();parentWindow.document.querySelector('#source-text').value=JSON.stringify(source);await parentWindow.document.querySelector('#source-submit').onclick();parentWindow.document.querySelector('[data-explorer-key="concept:landscape"]').click();const graph=[...parentWindow.document.querySelectorAll('.landscape-modes button')].find(button=>button.textContent==='グラフ');assert(graph,'landscape graph tab must exist');graph.click();if(current){const overview=parentWindow.document.querySelector('iframe[data-concept-view=overview]');assert(overview&&!overview.hidden);parentWindow.dispatchEvent(new parentWindow.MessageEvent('message',{origin:parentWindow.location.origin,source:overview.contentWindow,data:{type:'alder-concept-open',id:current}}));}frame=[...parentWindow.document.querySelectorAll('.concept-frame')].find(f=>!f.hidden);assert(frame,'active parent frame must exist');}
 const w=new JSDOM(concept?readFileSync('concept.html','utf8'):'<div id="app"></div>',{url:'https://viewer.test/contract/'+(concept?'concept.html'+(current?'?focus='+current:''):'index.html'),runScripts:'outside-only',pretendToBeVisual:true}).window;
 w.scrollTo=()=>{};w.HTMLElement.prototype.scrollTo=function(x,y){this.scrollLeft=x;this.scrollTop=y;};w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.hasPointerCapture=()=>false;w.SVGElement.prototype.focus=()=>{};
 // Deliver actual child messages to the actual shell handler with the active iframe identity.
 if(concept)Object.defineProperty(w,'parent',{value:{postMessage:(data,origin)=>parentWindow.dispatchEvent(new parentWindow.MessageEvent('message',{data,origin,source:frame.contentWindow}))}});
 try{
  if(concept){w.HTMLCanvasElement.prototype.getContext=()=>({measureText:s=>({width:s.length*14})});w.eval(conceptCode);}
  else{w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.eval(businessCode);await until(()=>!w.document.querySelector('#open').disabled);w.document.querySelector('#open-text').click();w.document.querySelector('#source-text').value=JSON.stringify(source);await w.document.querySelector('#source-submit').onclick();if(current)w.document.querySelector(`[data-explorer-key="business:${current}"]`).click();}
  const selected=keys[selection],target=keys[c.target];
  let card=w.document.querySelector(`[data-node="${selected}"]`);assert(card,'selection scenario must exist');
  if(concept)card.querySelector('.concept-select').dispatchEvent(new w.KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));else tap(w,card);
  assert.equal(w.document.querySelector('.node.selected')?.dataset.node,selected,'selection must be applied, not inferred');
  card=w.document.querySelector(`[data-node="${target}"]`);assert(card,'target scenario must exist');const link=card.querySelector(concept?'.concept-open-action':'.activity-open');
  const result={detailLink:!!link};
  if(link){link.click();if(concept){const opened=parentWindow.document.querySelector(`iframe[data-concept-view="${target}"]`);assert(opened&&!opened.hidden,'parent must activate target detail iframe');assert.equal(new URL(opened.src).searchParams.get('focus'),target,'parent must set target focus');assert.equal(parentWindow.document.querySelector(`#concept-tab-${target}`).getAttribute('aria-current'),'true','parent must activate target tab');}else{assert(w.document.querySelector(`#explorer-business [data-explorer-key="business:${target}"][aria-current="page"]`),'link must navigate to the target detail');}}
  return result;
 }finally{w.close();parentWindow?.close();}
}
const results=[];
for(const c of authority.checks)for(const domain of c.domains)for(const selection of c.selections){
 const result={id:c.id,domain,selection};try{assert(['business','concept'].includes(domain));assert(['current','neighbor'].includes(selection));const actual=await observe(domain,c,selection);assert.deepEqual(actual,c.expected,c.id+' '+c.reason);results.push({...result,status:'pass'});}catch(e){results.push({...result,status:'fail',message:e.message});}
}
assertAuthorities(frozenFiles,readFileSync);
assertCoverage(results,frozen);
const report={authority:{path:authorityPath,baselineCommit,sha256:sha(raw),files:[...frozenFiles].map(([path,bytes])=>({path,sha256:sha(bytes)})),unchanged:true,coverageComplete:true},candidate:{commit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),workingTreeChanges:execFileSync('git',['status','--porcelain','--','src','web/review-navigation-contract.mjs','web/navigation-authority-gate.mjs','web/test-navigation-authority-gate.mjs','verification','graph-rendering.ja.md'],{encoding:'utf8'}).trim().split('\n').filter(Boolean),businessBundle:sha(businessCode),conceptBundle:sha(conceptCode)},results,passed:results.filter(r=>r.status==='pass').length,failed:results.filter(r=>r.status==='fail').length};
console.log(JSON.stringify(report,null,2));if(report.failed)process.exitCode=1;
