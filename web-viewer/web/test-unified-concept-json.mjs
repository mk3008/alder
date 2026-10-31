import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {parseDocument} from '../src/document-input.ts';
import {createConceptViews} from '../src/concept-views.ts';
import {createDataExamples} from '../src/data-examples.ts';

const raw=readFileSync('verification/unified-concept-json.check-items.json');
assert.equal(createHash('sha256').update(raw).digest('hex'),'1dac953ee2b6c41a00a8bade8b6a770c69d6c6fced407f89d01ef128c062a3fd');
const authority=JSON.parse(raw),expectedIds=authority.checks.map(item=>item.id);
assert.deepEqual(expectedIds,['UNIFIED-CONCEPT-001','UNIFIED-CONCEPT-002','UNIFIED-CONCEPT-003','UNIFIED-CONCEPT-004','UNIFIED-CONCEPT-005','UNIFIED-CONCEPT-006','UNIFIED-CONCEPT-007']);
for(const item of authority.checks)for(const field of ['condition','guarantee','reason','verification'])assert(item[field],item.id+' '+field);
const source=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v3-beta.json','utf8'));
const bd=source.documents.find(item=>item.kind==='businessDesign'),states=source.documents.find(item=>item.kind==='stateTransition'),model=source.documents.find(item=>item.kind==='conceptModel');
const design=parseDocument(JSON.stringify(source));
assert.equal(design.model.business.id,bd.id);assert.equal(design.model.states[0].id,states.id);assert.equal(design.model.concepts[0].id,model.id);
const context={business:design.model.business,model:design.model.concepts[0]},views=createConceptViews(context),examples=createDataExamples(context);
assert.equal(views.groups.length,4);assert.equal(Object.keys(views.tables).length,6);assert.equal(examples.dataExamples.length,12);
assert.equal(views.findGroup('group-request').name,'購入要求・申請内容');

const another=structuredClone(source),other=another.documents.find(item=>item.kind==='conceptModel');
other.reviewGroups[0].title='別業務のまとまり';other.concepts[0].name='別業務の情報';other.reviewGroups[0].graph.nodes[0].name='別業務の情報';other.reviewGroups[0].capabilities[0].samples[0].name='別業務の例';
const otherDesign=parseDocument(JSON.stringify(another)),otherContext={business:otherDesign.model.business,model:otherDesign.model.concepts[0]};
assert.equal(createConceptViews(otherContext).findGroup('group-request').name,'別業務のまとまり');
assert.equal(createDataExamples(otherContext).dataExamples[0].name,'別業務の例');assert.equal(views.findGroup('group-request').name,'購入要求・申請内容');
const absent=structuredClone(source);absent.documents=absent.documents.filter(item=>item.kind!=='conceptModel');assert.equal(parseDocument(JSON.stringify(absent)).model.concepts.length,0);

const invalid=mutate=>{const pkg=structuredClone(source);mutate(pkg.documents.find(item=>item.kind==='conceptModel'),pkg);assert.throws(()=>parseDocument(JSON.stringify(pkg)));};
invalid(m=>{m.basedOn.revision='stale';});invalid(m=>{m.relatedStates[0].documentId='missing';});
invalid(m=>{m.reviewGroups[0].reviewer.roleId='missing';});invalid(m=>{m.subsystems[0].activityIds[0]='missing';});
invalid(m=>{m.reviewGroups[0].graph.nodes[0].conceptId='missing';});invalid(m=>{m.reviewGroups[0].graph.edges[0].relationIds=['missing'];});
invalid(m=>{m.reviewGroups[0].capabilities[0].samples[0].blocks[0].rows[0].cells[0].columnId='missing';});
invalid(m=>{m.concepts.push(structuredClone(m.concepts[0]));});

const injected=structuredClone(source),im=injected.documents.find(item=>item.kind==='conceptModel');
im.reviewGroups[0].title='<img src=x onerror=alert(1)>';im.reviewGroups[0].capabilities[0].samples[0].name='<svg onload=alert(2)>';
const injectDesign=parseDocument(JSON.stringify(injected)),injectContext={business:injectDesign.model.business,model:injectDesign.model.concepts[0]},injectViews=createConceptViews(injectContext),injectExamples=createDataExamples(injectContext);
const doc=new JSDOM('<div></div>').window.document,root=doc.querySelector('div');injectExamples.renderDataExample(root,injectViews.groups[0],'request-draft-empty',()=>{});
assert(root.textContent.includes('<svg onload=alert(2)>'));assert.equal(root.querySelector('svg,img,script'),null);

const code=(await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'}})).outputFiles[0].text;
const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/app/index.html',runScripts:'outside-only',pretendToBeVisual:true}).window;
w.indexedDB=new IDBFactory();w.structuredClone=structuredClone;w.TextEncoder=TextEncoder;w.HTMLElement.prototype.scrollIntoView=()=>{};w.eval(code);
async function until(test){for(let i=0;i<500;i++){if(test())return;await new Promise(resolve=>setTimeout(resolve,10));}throw Error('Viewer did not become ready');}
async function open(pkg){await until(()=>!w.document.querySelector('#open').disabled);w.document.querySelector('#open-text').click();w.document.querySelector('#source-text').value=JSON.stringify(pkg);await w.document.querySelector('#source-submit').onclick();await until(()=>w.document.querySelector('#source-modal')?.hidden!==false);}
await open(source);
assert(w.document.querySelector('[data-explorer-key="concept:group-request"]'));
assert(w.document.querySelector('[data-explorer-key="states:'+states.objectId+'"]'));
w.document.querySelector('[data-explorer-key="concept:landscape"]').click();assert(w.document.querySelector('[data-review-group="group-request"]'));
await open(another);assert(w.document.body.textContent.includes('別業務のまとまり'));assert(!w.document.body.textContent.includes('購入要求・申請内容'));
await open(absent);assert(!w.document.querySelector('[data-explorer-key="concept:group-request"]'));assert(!w.document.body.textContent.includes('別業務のまとまり'));
// Domain IDs may equal a view name or an ID of another kind. Internal view keys
// must distinguish them without adding Viewer-specific restrictions to the JSON.
const collision=structuredClone(source),cm=collision.documents.find(item=>item.kind==='conceptModel');
cm.reviewGroups[0].id='request';for(const edge of [...cm.presentation.landscapeRelationships,...cm.presentation.reviewBoundaries]){if(edge.from==='group-request')edge.from='request';if(edge.to==='group-request')edge.to='request';}
await open(collision);
const groupEntry=w.document.querySelector('[data-explorer-key="concept:group:request"]'),conceptEntry=w.document.querySelector('[data-explorer-key="concept:concept:request"]');
assert(groupEntry&&conceptEntry);groupEntry.click();assert(w.document.querySelector('iframe[data-concept-view="group:request"]:not([hidden])'));
conceptEntry.click();assert(w.document.querySelector('iframe[data-concept-view="concept:request"]:not([hidden])'));
const reserved=JSON.parse(JSON.stringify(source).replaceAll('"request"','"overview"'));
await open(reserved);const reservedEntry=w.document.querySelector('[data-explorer-key="concept:concept:overview"]');assert(reservedEntry);reservedEntry.click();
assert(w.document.querySelector('iframe[data-concept-view="concept:overview"]:not([hidden])'));
w.close();
console.log('UNIFIED-CONCEPT: one-file parse, model projections, invalid references, safe text, document switching verified; browser/iframe and full regression separate.');
