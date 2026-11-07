import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';

const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const authority='verification/structure-explorer-ownership-context.check-items.json';
const authorityHash='9d7ba7d2248b2c45c8814ba1dcdd26f609e1a92994aa47b3a8d11bf1b0c75102';
const fixed={
 '../business-design/alder/json-complete-concept-review.json':'e93657d3680bac31907b7d54e96498e79dcff8ffd66c420ef3ca9441cc5a7181',
 '../business-design/alder/business-design.json':'b8356070947d73502197e08560a9084e139aa8c0f7c88c64109a98502d7182c9',
 '../tools/document_storage/schema.mjs':'e46e388660df746173e16e8c72b56e9a9a74f6fcd6935f5bff304737961dddb2',
 '../work/normalization-candidate/information-ownership-acceptance.json':'bff949d37401d01f5edc157fbbe12f57e5d853bd1af5be2792404209ff538337'
};
const verify=()=>{assert.equal(hash(readFileSync(authority)),authorityHash);for(const [path,digest] of Object.entries(fixed))assert.equal(hash(readFileSync(path)),digest,path);};
verify();const required=JSON.parse(readFileSync(authority)).checks.map(item=>item.id),covered=[];
const coverage=ids=>{assert.equal(ids.length,required.length);assert.equal(new Set(ids).size,ids.length);assert.deepEqual(new Set(ids),new Set(required));};
assert.throws(()=>coverage(required.slice(1)));assert.throws(()=>coverage([...required,required[0]]));
const pkg=JSON.parse(readFileSync('../business-design/alder/json-complete-concept-review.json'));
const model=pkg.documents.find(item=>item.kind==='conceptModel'),before=JSON.stringify(model);
const code=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const w=new JSDOM('<div id="tree"></div><div id="detail"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
try{
 w.eval(code+';globalThis.Explorer=Explorer;');const tree=w.document.querySelector('#tree'),detail=w.document.querySelector('#detail');
 const render=(m,id)=>w.Explorer.renderStructureExplorer(tree,m,{rootId:id,select:selection=>w.Explorer.renderStructureDetails(detail,m,selection)});
 const lines=label=>{const dd=[...detail.querySelectorAll('dt')].find(item=>item.textContent===label)?.nextElementSibling;return dd?[...dd.childNodes].filter(node=>node.nodeType===w.Node.TEXT_NODE).map(node=>node.textContent):[];};
 const open=li=>{assert(li);const d=li.querySelector(':scope > details');assert(d);d.open=true;d.dispatchEvent(new w.Event('toggle'));return d;};
 const direct=(parent,id,direction)=>parent.querySelector(`:scope > ul > [data-relation-id="${id}"][data-relation-direction="${direction}"]`);
 const summary=li=>li.querySelector(':scope > details > summary');
 const ownerText='対象（Object）',childText='情報項目（InformationItem）';

 render(model,'n-object');const root=tree.querySelector('.structure-root > li'),rootDetails=root.querySelector(':scope > details');summary(root).click();
 assert.deepEqual(lines('所属'),['業務設計書（BusinessDesign）']);
 assert(lines('含む構造').includes(childText),'the object names what belongs to it');
 covered.push('STRUCTURE-OWNER-CONTEXT-001');

 const owned=direct(rootDetails,'nr-object-information','owned');const ownedDetails=open(owned);
 assert.equal(direct(ownedDetails,'nr-object-information','owner'),null,'do not repeat the immediate owner');
 summary(owned).click();assert.deepEqual(lines('所属'),[ownerText]);
 covered.push('STRUCTURE-OWNER-CONTEXT-002');

 render(model,'n-dataitem');const member=tree.querySelector('.structure-root > li > details');
 const referenced=direct(member,'nr-dataitem-information','reference'),referencedDetails=open(referenced);
 const owner=direct(referencedDetails,'nr-object-information','owner');assert(owner,'a referenced item retains its owner link');
 summary(referenced).click();assert.deepEqual(lines('所属'),[ownerText]);
 const viaObject=structuredClone(model),r=structuredClone(model.relations.find(item=>item.id==='nr-axis-data'));
 Object.assign(r,{id:'test-object-group',fromConceptId:'n-object',toConceptId:'n-data'});viaObject.relations.push(r);viaObject.meta.relationNames[r.id]='参照するグループ';
 render(viaObject,'n-object');const o=tree.querySelector('.structure-root > li > details');
 const group=open(direct(o,'test-object-group','reference'));
 const item=open(direct(group,'nr-data-dataitem','owned'));
 const info=open(direct(item,'nr-dataitem-information','reference'));
 assert(direct(info,'nr-object-information','owner'),'an earlier object in the path does not hide a reference-context owner');
 covered.push('STRUCTURE-OWNER-CONTEXT-003');

 render(model,'n-information');const infoRoot=tree.querySelector('.structure-root > li > details');
 const rootOwner=direct(infoRoot,'nr-object-information','owner');assert(rootOwner);summary(rootOwner).click();
 assert.deepEqual(lines('所属'),['業務設計書（BusinessDesign）'],'the selected object names its actual owner');
 assert(lines('含む構造').includes(childText),'the reverse relation is shown as a child of the selected object');
 covered.push('STRUCTURE-OWNER-CONTEXT-004');

 render(model,'n-bd');const query=tree.querySelector('input[type="search"]');query.value='所属する対象';query.dispatchEvent(new w.Event('input',{bubbles:true}));
 const visible=[...tree.querySelectorAll('[data-relation-id="nr-object-information"][data-relation-direction="owner"]')].filter(node=>!node.closest('[hidden]'));
 assert(visible.length>0,'search finds owner navigation through a reference even if the owned item was visited first');
 assert(tree.querySelectorAll('.structure-item').length<model.relations.length+model.concepts.length+25,'cycles and repeated contexts remain bounded');
 render(model,'n-activity');summary(tree.querySelector('.structure-root > li')).click();assert(lines('含む構造').some(line=>line.startsWith('要確認：順序制約')),'a review marker is not lost in the drawer summary');
 render(model,'n-package');summary(tree.querySelector('.structure-root > li')).click();const checkbox=tree.querySelector('.structure-compatibility-filter input');
 assert(!lines('含む構造').some(line=>line.includes('外部業務設計書の目録')),'legacy ownership is hidden with the default filter');
 checkbox.checked=false;checkbox.dispatchEvent(new w.Event('change',{bubbles:true}));assert(lines('含む構造').some(line=>line.startsWith('互換・移行用：外部業務設計書の目録')),'turning the filter off also updates the drawer');
 checkbox.checked=true;checkbox.dispatchEvent(new w.Event('change',{bubbles:true}));assert(!lines('含む構造').some(line=>line.includes('外部業務設計書の目録')),'turning the filter back on hides the drawer entry');
 const without=structuredClone(model);delete without.meta.reverseRelationNames;render(without,'n-information');assert(!tree.querySelector('[data-relation-direction="owner"]'),'do not invent an unannotated inverse link');
 assert.equal(JSON.stringify(model),before);verify();covered.push('STRUCTURE-OWNER-CONTEXT-005');coverage(covered);
}finally{w.close();}
console.log(JSON.stringify({checks:covered,scope:'ownership detail, contextual owner navigation, search and source preservation'}));
