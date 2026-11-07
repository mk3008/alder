import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {structureGraph} from '../src/structure-explorer.ts';

const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const authorities={
 'verification/structure-explorer-ownership-label.check-items.json':'8df0738425422c29efe899d3242915402ec65edce19bfde64a2f954c92a12b32',
 'verification/structure-explorer-description-cleanup.check-items.json':'07627e9973fec6ef004a13412338ccb8fcd106e4fcc6d07e0fd1cf3d9b90bdda'
};
const files={
 '../business-design/alder/json-complete-concept-review.json':'e93657d3680bac31907b7d54e96498e79dcff8ffd66c420ef3ca9441cc5a7181',
 '../business-design/alder/business-design.json':'b8356070947d73502197e08560a9084e139aa8c0f7c88c64109a98502d7182c9',
 '../tools/document_storage/schema.mjs':'e46e388660df746173e16e8c72b56e9a9a74f6fcd6935f5bff304737961dddb2'
};
const verify=()=>{for(const [path,digest] of Object.entries({...authorities,...files}))assert.equal(hash(readFileSync(path)),digest,path);};verify();
const required=Object.keys(authorities).flatMap(path=>JSON.parse(readFileSync(path)).checks.map(item=>item.id)),covered=[];
const coverage=ids=>{assert.equal(ids.length,required.length);assert.equal(new Set(ids).size,ids.length);assert.deepEqual(new Set(ids),new Set(required));};assert.throws(()=>coverage(required.slice(1)));assert.throws(()=>coverage([...required,required[0]]));
const model=JSON.parse(readFileSync('../business-design/alder/json-complete-concept-review.json')).documents.find(d=>d.kind==='conceptModel'),before=JSON.stringify(model);
const code=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const w=new JSDOM('<div id="tree"></div><div id="detail"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
try{
 w.eval(code+';globalThis.Explorer=Explorer;');const tree=w.document.querySelector('#tree'),detail=w.document.querySelector('#detail');
 const show=(m,s)=>w.Explorer.renderStructureDetails(detail,m,s);
 const values=label=>{const dd=[...detail.querySelectorAll('dt')].find(dt=>dt.textContent===label)?.nextElementSibling;return dd?[...dd.childNodes].filter(n=>n.nodeType===w.Node.TEXT_NODE).map(n=>n.textContent):[];};
 const relation=id=>model.relations.find(r=>r.id===id);
 const select=(m,id,fromId,relationId)=>show(m,{kind:'structure',conceptId:id,...(fromId?{fromId,relationId}:{})});
 const bdWho=relation('nr-bd-actor');assert.deepEqual([bdWho.kind,bdWho.fromConceptId,bdWho.toConceptId],['down','n-bd','n-who']);
 select(model,'n-who','n-bd','nr-bd-actor');assert.deepEqual(values('所属'),['業務設計書（BusinessDesign）']);assert(!values('所属')[0].includes('所属'));
 select(model,'n-information','n-object','nr-object-information');assert.deepEqual(values('所属'),['対象（Object）']);
 select(model,'n-object');assert.deepEqual(values('所属'),['業務設計書（BusinessDesign）']);covered.push('STRUCTURE-OWNER-LABEL-001');
 const without=structuredClone(model);without.relations=without.relations.filter(r=>!(r.kind==='down'&&r.toConceptId==='n-who'));without.concepts.find(c=>c.id==='n-who').description='業務設計書に所属すると書かれていても関係ではない。';select(without,'n-who');assert.deepEqual(values('所属'),['未定義']);
 const unrelated=structuredClone(model),owner=unrelated.relations.find(r=>r.id==='nr-bd-actor');owner.kind='other';owner.condition='業務設計書に主体が所属する。';select(unrelated,'n-who');assert.deepEqual(values('所属'),['未定義']);covered.push('STRUCTURE-OWNER-LABEL-002');
 select(model,'n-object','n-information','nr-object-information');assert.deepEqual(values('所属'),['業務設計書（BusinessDesign）']);assert(values('含む構造').includes('情報項目（InformationItem）'));
 const multiple=structuredClone(model);multiple.relations.push({...structuredClone(bdWho),id:'test-other-owner',fromConceptId:'n-package'});select(multiple,'n-who');assert.deepEqual(new Set(values('所属')),new Set(['業務設計書（BusinessDesign）','文書パッケージ（DocumentPackage）']));select(multiple,'n-who','n-bd','nr-bd-actor');assert.deepEqual(values('所属'),['業務設計書（BusinessDesign）']);covered.push('STRUCTURE-OWNER-LABEL-003');
 w.Explorer.renderStructureExplorer(tree,model,{rootId:'n-dataitem',select:s=>show(model,s)});const info=tree.querySelector('[data-relation-id="nr-dataitem-information"] > details');info.open=true;info.dispatchEvent(new w.Event('toggle'));assert(info.querySelector('[data-relation-id="nr-object-information"][data-relation-direction="owner"]'));info.querySelector(':scope > summary').click();assert.deepEqual(values('所属'),['対象（Object）']);
 const attr=model.meta.fieldMappings.find(m=>m.physicalName==='activities.name');show(model,{kind:'attribute',conceptId:'n-activity',informationId:attr.informationId});assert.deepEqual(values('所属'),['業務（Activity）']);assert.equal(JSON.stringify(model),before);covered.push('STRUCTURE-OWNER-LABEL-004');
 const who=model.concepts.find(c=>c.id==='n-who');assert.match(who.description,/候補の actors/);
 select(model,'n-who','n-bd','nr-bd-actor');assert(!detail.textContent.includes(who.description));assert.deepEqual(values('構造の説明'),[]);assert(values('説明').includes(bdWho.condition));
 select(model,'n-who');assert.deepEqual(values('説明'),[]);assert(!detail.textContent.includes('現行0.7の物理構造そのものではない'));
 const generic=model.concepts.find(c=>c.description==='0.7候補の構造に基づく概念モデルの検討案。');assert(generic);select(model,generic.id);assert.deepEqual(values('説明'),[]);covered.push('STRUCTURE-DESCRIPTION-CLEANUP-001');
 const activity=model.concepts.find(c=>c.id==='n-activity'),activityEdge=relation('nr-bd-activity');select(model,'n-activity','n-bd','nr-bd-activity');assert(values('説明').includes(activityEdge.condition));assert(values('構造の説明').includes(activity.description));
 const normal=structuredClone(model);delete normal.meta.modelStatus;const explicit=normal.concepts.find(c=>c.id==='n-who');select(normal,'n-who');assert.deepEqual(values('説明'),[explicit.description],'other models retain explicitly authored descriptions');covered.push('STRUCTURE-DESCRIPTION-CLEANUP-002');
 select(model,'n-bd');assert(!detail.textContent.includes('サンプルは項目ごとの例'));assert(detail.textContent.includes('bd-review-1'));assert(detail.querySelector('table.structure-attribute-table'));covered.push('STRUCTURE-DESCRIPTION-CLEANUP-003');
 select(model,'n-who','n-bd','nr-bd-actor');const sources=values('参照元');assert(sources.includes('業務：実行主体'));assert(sources.includes('概念レビューの単位：レビュー担当ロール'));const incoming=structureGraph(model).edges.get('n-who').filter(e=>e.direction==='referencedBy');assert.deepEqual(new Set(incoming.map(e=>e.relation.id)),new Set(['nr-who-activity','cr-acb6243ed4da17']));const unnamed=structuredClone(model);delete unnamed.meta.relationNames['nr-who-activity'];select(unnamed,'n-who');assert(values('参照元').includes('業務'),'an absent role name is not inferred');assert.equal(JSON.stringify(model),before);verify();covered.push('STRUCTURE-DESCRIPTION-CLEANUP-004');
}finally{w.close();}
coverage(covered);verify();console.log(JSON.stringify({checks:covered,scope:'structured ownership, meaningful descriptions, sample note and source preservation'}));
