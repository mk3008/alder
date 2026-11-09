import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

const hash=value=>createHash('sha256').update(value).digest('hex');
const authority='verification/structure-explorer-review-feedback.check-items.json';
const digest='37d4e3a12625c87eb5a68cf93484df2c6178733af4e7830930c6ebbf55880fa5';
const authorityBytes=readFileSync(authority);assert.equal(hash(authorityBytes),digest);
const required=JSON.parse(authorityBytes).checks.map(item=>item.id),covered=[];
const coverage=actual=>{assert.deepEqual(new Set(actual),new Set(required));assert.equal(actual.length,required.length);assert.equal(new Set(actual).size,required.length);};
assert.throws(()=>coverage(required.slice(1)));assert.throws(()=>coverage([...required,required[0]]));
const source='../business-design/alder/json-complete-concept-review.json',bytes=readFileSync(source);
const pkg=JSON.parse(bytes),model=pkg.documents.find(item=>item.kind==='conceptModel'),before=JSON.stringify(model);
const fixed={
 '../business-design/alder/business-design.json':'b8356070947d73502197e08560a9084e139aa8c0f7c88c64109a98502d7182c9',
 '../work/normalization-candidate/example-source.json':'fa94aa2098a3a4578648c2403f184bb73bb65e2e40311442f9e7d848743d0b8f',
 '../work/normalization-candidate/example-normalized.json':'cfb0ee8dd1dd7b0aa99e868abc3844542c3c6881cc7c8315fb8f3a5a6566152a',
 '../tools/document_storage/schema.mjs':'9a6f63990f5b679ea807d873e56e0c5895aae28d1b253d78c3af63f4141546df'
};
const verifyFixed=()=>{for(const [path,digest]of Object.entries(fixed))assert.equal(hash(readFileSync(path)),digest,path);};
verifyFixed();
const code=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const w=new JSDOM('<div id="detail"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
try{
 w.eval(code+';globalThis.Explorer=Explorer;');const detail=w.document.querySelector('#detail');
 const map=(m,path)=>{const x=m.meta.fieldMappings.find(item=>item.physicalName===path);assert(x,path);return x;};
 const row=(m,path)=>detail.querySelector('tr[data-information-id="'+map(m,path).informationId+'"]');
 const show=(m,id,hideLegacy=true)=>w.Explorer.renderStructureDetails(detail,m,{kind:'structure',conceptId:id,hideLegacy});
 const value=label=>[...detail.querySelectorAll('dt')].find(item=>item.textContent===label)?.nextElementSibling?.textContent;
 show(model,'n-who');const kind=row(model,'actors.kind');assert(kind.textContent.includes('型："role" | "system" | "scheduler"'));
 for(const label of ['role：人が担う役割','system：自動実行するシステム','scheduler：スケジューラー'])assert(kind.textContent.includes(label));
 kind.querySelector('button').click();assert.equal(value('型名'),'"role" | "system" | "scheduler"');assert.equal(value('null許容'),'許容しない');
 const alt=structuredClone(model),domain=map(alt,'actors.kind').valueDomain;domain.values=[{value:0},{value:false},{value:''}];show(alt,'n-who');
 assert(row(alt,'actors.kind').textContent.includes('型：0 | false | ""'));
 domain.values=[{value:'<script>alert(1)</script>'}];show(alt,'n-who');assert(!detail.querySelector('script'));assert(row(alt,'actors.kind').textContent.includes('<script>alert(1)</script>'));
 covered.push('STRUCTURE-FEEDBACK-001');

 show(model,'n-activity');assert.deepEqual([...detail.querySelectorAll('thead th')].map(x=>x.textContent),['項目','サンプル','説明','用途']);
 assert.equal(row(model,'activities.problem').querySelectorAll('td')[2].textContent,'業務改善を検討する際、解決したい困りごとを把握する。');
 assert.equal(row(model,'activities.painLevel').querySelectorAll('td')[2].textContent,'');
 row(model,'activities.problem').querySelector('button').click();assert.equal(value('用途'),'業務改善を検討する際、解決したい困りごとを把握する。');
 show(model,'n-activity');row(model,'activities.painLevel').querySelector('button').click();assert.equal(value('用途'),'');
 covered.push('STRUCTURE-FEEDBACK-002');

 const writes=[];Object.defineProperty(w.navigator,'clipboard',{configurable:true,value:{writeText:async text=>{writes.push(text);}}});
 show(model,'n-activity');row(model,'activities.problem').querySelector('button').click();
 detail.querySelector('.structure-copy-id').click();await new Promise(resolve=>setTimeout(resolve,0));
 const short=writes.at(-1);assert(short.includes(model.id));assert(short.includes('n-activity'));assert(short.includes(map(model,'activities.problem').informationId));assert(!short.includes('用途：'));
 detail.querySelector('.structure-copy-full').click();await new Promise(resolve=>setTimeout(resolve,0));
 const full=writes.at(-1);assert(full.includes(short));assert(full.includes('用途：業務改善を検討'));assert(full.includes('元の定義：'));assert(detail.querySelector('[role="status"]').textContent.includes('全文'));
 detail.querySelector('.structure-copy-id').dispatchEvent(new w.MouseEvent('click',{bubbles:true,shiftKey:true}));await new Promise(resolve=>setTimeout(resolve,0));assert.equal(writes.at(-1),full);
 show(model,'n-who');detail.querySelector('.structure-copy-id').click();await new Promise(resolve=>setTimeout(resolve,0));assert(writes.at(-1).includes('n-who'));assert.notEqual(writes.at(-1),short);
 detail.querySelector('.structure-copy-full').click();await new Promise(resolve=>setTimeout(resolve,0));
 assert.match(writes.at(-1),/論理名：kind \/ 型：/);assert(writes.at(-1).includes('role：人が担う役割、system：自動実行するシステム'));

 Object.defineProperty(w.navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('denied');}}});detail.querySelector('.structure-copy-full').click();await new Promise(resolve=>setTimeout(resolve,0));assert.match(detail.querySelector('[role="status"]').textContent,/コピーできませんでした/);
 covered.push('STRUCTURE-FEEDBACK-003');

 const flow=model.concepts.find(item=>item.id==='n-flow-step');assert(flow);assert(!flow.information.some(item=>item.name==='実施条件の確定状態'));
 const legacy=map(model,'steps.appliesWhen');assert.equal(model.meta.compatibilityReview.fields[legacy.informationId].kind,'legacy');
 show(model,'n-flow-step');assert(!row(model,'steps.appliesWhen'));show(model,'n-flow-step',false);assert.match(row(model,'steps.appliesWhen').textContent,/互換・移行用/);
 const coverageEntry=model.meta.schemaCoverage.find(item=>item.path==='BD.activities[].procedure.steps[].appliesWhen');assert(coverageEntry);assert.equal(coverageEntry.stateInformationId,undefined);assert.match(coverageEntry.note,/null.*推測|推測.*null|自動確定しない/);
 assert(model.relations.some(item=>item.id==='nr-step-when'));covered.push('STRUCTURE-FEEDBACK-004');

 assert.match(flow.description,/バリデーション.*例外/);assert.match(flow.description,/通常の流れ/);assert.match(flow.description,/倒れたもの.*独立した条件/);
 show(model,'n-flow-step');assert(detail.textContent.includes('倒れたものを立て直す'));covered.push('STRUCTURE-FEEDBACK-005');
 assert.equal(JSON.stringify(model),before);assert.deepEqual(readFileSync(source),bytes);
}finally{w.close();}
coverage(covered);verifyFixed();assert.equal(hash(readFileSync(authority)),digest);
console.log(JSON.stringify({checks:covered,scope:'typed values, purpose, copy modes and FlowStep legacy preservation'}));
