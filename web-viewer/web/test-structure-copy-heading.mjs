import './test-structure-review-hypotheses.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
const snapshot=JSON.parse(readFileSync('../work/361-copy-heading/payloads.json'));
// Only the explicitly renamed UI caption differs from the frozen payload.
for(const item of snapshot.cases)item.full=item.full.replaceAll(' | 用途',' | 使用目的').replaceAll('\n用途：','\n使用目的：');
const model=JSON.parse(readFileSync('../business-design/alder/json-complete-concept-review.json')).documents.find(d=>d.kind==='conceptModel');
const before=JSON.stringify(model),code=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const w=new JSDOM('<div id="detail"></div>',{url:'https://viewer.test/',runScripts:'outside-only'}).window;
const results=[],record=name=>results.push({case:name,status:'pass'});
try{
 w.eval(code+';globalThis.Explorer=Explorer;');const detail=w.document.querySelector('#detail'),tick=()=>new Promise(r=>setTimeout(r,0));let writes=[];
 const clipboard=writeText=>Object.defineProperty(w.navigator,'clipboard',{configurable:true,value:writeText?{writeText}:undefined});
 const identity='概念モデル：alder-complete-package-study（package-study-1）\n構造：DocumentPackage［n-package］';
 for(const expected of snapshot.cases){
  writes=[];clipboard(async value=>writes.push(value));w.Explorer.renderStructureDetails(detail,model,expected.selection);
  const list=detail.querySelector('dl'),heading=list.firstElementChild,caption=heading.querySelector('.structure-detail-caption'),controls=heading.querySelector('.structure-copy-actions');
  assert.equal(heading.tagName,'DT');assert.equal(caption.textContent,'論理名');assert(controls);assert.equal(list.querySelectorAll('.structure-copy-actions').length,1);assert(!detail.querySelector(':scope > .structure-copy-actions'));
  assert.deepEqual([...controls.querySelectorAll('button')].map(b=>b.textContent),['識別情報をコピー','全文をコピー']);
  assert.deepEqual([...list.children].filter(n=>n.tagName==='DT').slice(0,3).map(n=>n.querySelector('.structure-detail-caption')?.textContent??n.textContent),['論理名','ローカル名','型名']);
  const visibleWithoutControls=detail.cloneNode(true);visibleWithoutControls.querySelector('.structure-copy-actions').remove();assert(!visibleWithoutControls.textContent.includes('［n-package］'));assert(!visibleWithoutControls.textContent.includes('［cf-fa56ab6bd9ad29］'));
  if(expected.name==='structure'){assert.equal(heading.nextElementSibling.textContent,'DocumentPackage');assert.equal(expected.short,identity);}
  if(expected.name==='attribute')assert.equal(expected.short,identity+'\n項目：形式（format）［cf-fa56ab6bd9ad29］');
  if(expected.name==='relation')assert.equal(expected.short,'概念モデル：alder-complete-package-study（package-study-1）\n構造：BusinessDesign［n-bd］\n関係：nr-package-bd');
  detail.querySelector('.structure-copy-id').click();await tick();assert.equal(writes.at(-1),expected.short);assert.equal(detail.querySelector('[role=status]').textContent,'識別情報をコピーしました。');
  detail.querySelector('.structure-copy-full').click();await tick();assert.equal(writes.at(-1),expected.full);assert.equal(detail.querySelector('[role=status]').textContent,'全文をコピーしました。');
  detail.querySelector('.structure-copy-id').dispatchEvent(new w.MouseEvent('click',{bubbles:true,shiftKey:true}));await tick();assert.equal(writes.at(-1),expected.full);record(expected.name+'-short-full-shift');
  detail.querySelector('.structure-copy-full').click();await tick();assert.equal(writes.at(-1),expected.full);assert.match(writes.at(-1),/\n論理名：/);assert(!writes.at(-1).includes('識別情報をコピー'));assert(!writes.at(-1).includes('全文をコピー'));record(expected.name);
 }
 record('repeat-after-success');
 clipboard(async()=>{throw Error('denied');});detail.querySelector('.structure-copy-full').click();await tick();assert.equal(detail.querySelector('[role=status]').textContent,'コピーできませんでした。ブラウザーの設定を確認してください。');record('denied');
 clipboard();detail.querySelector('.structure-copy-id').click();await tick();assert.match(detail.querySelector('[role=status]').textContent,/コピーできませんでした/);record('unavailable');
 clipboard(async value=>writes.push(value));detail.querySelector('.structure-copy-full').click();await tick();assert.equal(writes.at(-1),snapshot.cases.find(c=>c.name==='relation').full);record('repeat-after-failure');
 const other=structuredClone(model);other.id='different-model';other.concepts.find(c=>c.id==='n-package').id='different-structure';other.meta.conceptNames['different-structure']=other.meta.conceptNames['n-package'];w.Explorer.renderStructureDetails(detail,other,{kind:'structure',conceptId:'different-structure'});detail.querySelector('.structure-copy-id').click();await tick();assert.equal(writes.at(-1),'概念モデル：different-model（package-study-1）\n構造：DocumentPackage［different-structure］');record('same-name-identities');
 assert.equal(JSON.stringify(model),before);record('frozen-model');
 console.log(JSON.stringify({copyHeadingNode:{results,scope:'DOM/payload/notification evidence; actual keyboard/touch/geometry require browser'}}));
}finally{w.close();}
