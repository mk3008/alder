import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {structureGraph} from '../src/structure-explorer.ts';

const expectedHash='c8354e49c016f6aeaef9ba058a9f9cf327a965c3f5b5be383fd21840e35bc046';
const authority=readFileSync('verification/structure-explorer-relation-names.check-items.json');
const hash=value=>createHash('sha256').update(value).digest('hex');
const verify=bytes=>assert.equal(hash(bytes),expectedHash,'relation-name authority must not change');
verify(authority);assert.throws(()=>verify(Buffer.from('{}')),/authority must not change/);
const ids=JSON.parse(authority).checks.map(x=>x.id);
assert.deepEqual(ids,['STRUCTURE-NAME-001','STRUCTURE-NAME-002','STRUCTURE-NAME-003']);
const checkCoverage=results=>assert.deepEqual(results.slice().sort(),ids.slice().sort(),'all relation-name guarantees must be exercised once');
assert.throws(()=>checkCoverage(ids.slice(1)),/all relation-name guarantees/);assert.throws(()=>checkCoverage([...ids,ids[0]]),/all relation-name guarantees/);

const read=path=>JSON.parse(readFileSync(path,'utf8'));
const normalized=read('../business-design/alder/json-normalized-model-review.json').documents.find(d=>d.kind==='conceptModel');
const physical=read('../business-design/alder/json-structure-review.json').documents.find(d=>d.kind==='conceptModel');
const names=normalized.meta.relationNames;
assert.deepEqual(Object.keys(names).sort(),normalized.relations.map(r=>r.id).sort(),'every relation has exactly one authored name');
assert.equal(Object.keys(names).length,54);
for(const relation of normalized.relations)assert.equal(typeof names[relation.id]==='string'&&!!names[relation.id].trim(),true,relation.id);
for(const concept of normalized.concepts){const siblings=normalized.relations.filter(r=>r.fromConceptId===concept.id).map(r=>names[r.id]);assert.equal(new Set(siblings).size,siblings.length,'different roles from one source remain distinguishable: '+concept.id);}
const exemplars={
 'nr-bd-activity':'業務','nr-who-activity':'実行主体','nr-activity-step':'手順','nr-step-data':'操作対象の項目グループ',
 'nr-exchange-data':'受け渡す項目グループ','nr-exchange-pair':'対応する手順','nr-dependency-step':'前提の手順',
 'nr-continuity-interrupted':'中断時の手順','nr-continuity-resume':'再開時の手順',
 'nr-order-before':'前の手順','nr-order-after':'後の手順','nr-order-member':'対象手順',
 'nr-relation-from-activity':'出発点の業務','nr-relation-to-activity':'到着点の業務',
 'nr-relation-from-object':'出発点の対象','nr-relation-to-object':'到着点の対象',
 'nr-bd-checkdoc':'原典の業務設計書','nr-external-checkdoc':'原典の外部業務設計書の目録項目'
};
for(const [id,name] of Object.entries(exemplars))assert.equal(names[id],name,id+' expresses the corresponding role');
const graph=structureGraph(normalized);
assert.equal(graph.edges.get('n-exchange').find(x=>x.relation.id==='nr-exchange-pair'&&x.direction==='reference').roleName,'対応する手順');
assert.equal(graph.edges.get('n-step').find(x=>x.relation.id==='nr-exchange-pair'&&x.direction==='referencedBy').roleName,undefined,'a name for one direction is not silently reused backwards');
const covered=['STRUCTURE-NAME-001'];

const code=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const w=new JSDOM('<div id="host"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
try{
 w.eval(code+';globalThis.Explorer=Explorer;');const host=w.document.getElementById('host');
 let shown;const render=(m,rootId)=>{shown=m;w.Explorer.renderStructureExplorer(host,m,{rootId});};
 const row=id=>host.querySelector(`[data-relation-id="${id}"] > details > summary`);
 const pairs=s=>{assert(!s.querySelector('.structure-element-type'));const item=s.closest('.structure-item'),parent=item.parentElement.closest('.structure-item'),probe=w.document.createElement('div');w.Explorer.renderStructureDetails(probe,shown,{kind:'structure',conceptId:item.dataset.conceptId,fromId:parent.dataset.conceptId,relationId:item.dataset.relationId});const type=[...probe.querySelectorAll('dt')].find(dt=>dt.textContent==='型名').nextElementSibling.textContent;return [...s.querySelectorAll(':scope > .structure-element')].map(n=>[n.querySelector('strong').textContent,'型：'+type]);};
 const changed=structuredClone(normalized);changed.meta.relationNames['nr-step-data']='モデルに記録した操作対象';
 render(changed,'n-step');
 assert.deepEqual(pairs(row('nr-step-data')),[['モデルに記録した操作対象','型：InformationGroup']],'the loaded model is the source of the name');
 const search=host.querySelector('input[type=search]');search.value='モデルに記録した操作対象';search.dispatchEvent(new w.Event('input'));
 assert([...host.querySelectorAll('[data-relation-id="nr-step-data"]')].some(item=>!item.hidden),'search indexes the conceptual name');
 assert(host.querySelectorAll('.structure-item').length<=normalized.relations.length+1,'search stops at repeated structures');
 const different=structuredClone(normalized);different.meta.relationNames['nr-exchange-pair']='概念上の対応手順';render(different,'n-exchange');
 assert.deepEqual(pairs(row('nr-exchange-pair')),[['概念上の対応手順','型：Step']],'an authored conceptual name takes precedence over a different physical field label');
 assert.match(row('nr-exchange-pair').title,/stepInteractions\.pairedStepId/,'the existing physical mapping remains available');
 render(normalized,'n-order');
 for(const id of ['nr-order-before','nr-order-after','nr-order-member'])assert.deepEqual(pairs(row(id)),[[names[id],'型：Step']]);
 render(normalized,'n-continuity');
 for(const id of ['nr-continuity-interrupted','nr-continuity-resume'])assert.deepEqual(pairs(row(id)),[[names[id],'型：Step']]);
 w.Explorer.renderStructureExplorer(host,normalized);host.querySelector('.structure-toolbar button').click();
 assert.equal(host.querySelectorAll('.structure-item').length<=normalized.relations.length+3,true,'expand all stays bounded');
 assert(!host.textContent.includes('名前未定義'),'authored names are visible throughout the candidate');
 assert.equal(new Set([...host.querySelectorAll('[data-relation-id]')].map(item=>item.dataset.relationId)).size,54);
 covered.push('STRUCTURE-NAME-002');

 const missing=structuredClone(normalized);delete missing.meta.relationNames;
 render(missing,'n-step');assert.deepEqual(pairs(row('nr-step-data')),[['名前未定義','型：InformationGroup']]);
 render(missing,'n-exchange');assert.deepEqual(pairs(row('nr-exchange-pair')),[['対応する手順','型：Step']],'existing explicit field mappings remain a valid fallback');
 const invalid=structuredClone(normalized);invalid.meta.relationNames['nr-exchange-pair']=42;render(invalid,'n-exchange');
 assert.deepEqual(pairs(row('nr-exchange-pair')),[['対応する手順','型：Step']],'a non-string conceptual name does not override a valid field mapping');
 invalid.meta.relationNames['nr-step-data']=' ';render(invalid,'n-step');assert.deepEqual(pairs(row('nr-step-data')),[['名前未定義','型：InformationGroup']]);
 render(physical,'fmt-package');assert.deepEqual(pairs(row('rel-package-bd')),[['文書一覧','型：業務設計書（Business Design）']]);
 const multi=structuredClone(physical);multi.meta.relationNames={'rel-order-step':'順序規則の手順'};render(multi,'fmt-order');
 assert.deepEqual(pairs(row('rel-order-step')),[['順序規則の手順','型：手順行（Step）'],['前後の手順','型：手順行（Step）'],['対象手順','型：手順行（Step）']],'conceptual names do not erase multiple physical field names or array information');
 covered.push('STRUCTURE-NAME-003');
}finally{w.close();}
checkCoverage(covered);verify(readFileSync('verification/structure-explorer-relation-names.check-items.json'));
console.log('STRUCTURE-NAME-001..003: 54 authored directional names, independent model lookup, search, fallbacks and preserved mappings verified.');
