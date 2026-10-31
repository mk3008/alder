import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {parseDocument} from '../src/document-input.ts';
import {createConceptViews} from '../src/concept-views.ts';
import {createDataExamples} from '../src/data-examples.ts';

const path='verification/sample-identification-links.check-items.json';
const expectedHash='2061ec0491aae5f8925bf041bb61884447e282d3f59547001ae3f0b4eb06b5e6';
const expectedIds=['SAMPLE-IDENTITY-001','SAMPLE-IDENTITY-002','SAMPLE-IDENTITY-003','SAMPLE-IDENTITY-004'];
const verifyAuthority=bytes=>{assert.equal(createHash('sha256').update(bytes).digest('hex'),expectedHash);const a=JSON.parse(bytes);assert.deepEqual(a.checks.map(c=>c.id),expectedIds);for(const c of a.checks)for(const field of ['condition','guarantee','reason','source','verification'])assert(c[field]);return a;};
const frozen=readFileSync(path),authority=verifyAuthority(frozen),missingId=structuredClone(authority),missingCondition=structuredClone(authority);
missingId.checks.pop();missingCondition.checks[0].condition='';assert.throws(()=>verifyAuthority(Buffer.from(JSON.stringify(missingId))));assert.throws(()=>verifyAuthority(Buffer.from(JSON.stringify(missingCondition))));
const coverage=[],record=id=>coverage.push(id),complete=ids=>{assert.equal(ids.length,expectedIds.length);assert.equal(new Set(ids).size,ids.length);assert.deepEqual(new Set(ids),new Set(expectedIds));};
const pkg=JSON.parse(readFileSync('../work/concept-review/issue-133/versions/purchase-v3-beta.json','utf8'));
const parsed=parseDocument(JSON.stringify(pkg)),context={business:parsed.model.business,model:parsed.model.concepts[0]},views=createConceptViews(context),samples=createDataExamples(context);
const dom=new JSDOM('<body></body>'),doc=dom.window.document;
const render=(group,id,ctx=context)=>{const root=doc.createElement('article'),v=createConceptViews(ctx),d=createDataExamples(ctx);d.renderDataExample(root,v.findGroup(group),id,()=>{});return root;};
const cells=(root,key)=>[...root.querySelectorAll('[data-sample-key]')].filter(cell=>cell.dataset.sampleKey===key);
const sameTone=(root,key,count)=>{const found=cells(root,key);assert.equal(found.length,count,key);const tone=found[0].dataset.keyTone;assert(tone);assert(found.every(c=>c.dataset.keyTone===tone),key);return tone;};
const at=(root,card,row,column)=>{const section=root.querySelector(`[data-example-card="${card}"]`),headers=[...section.querySelectorAll('th')].map(h=>h.textContent),index=headers.indexOf(column);assert(index>=0,card+':'+column);const tr=section.querySelectorAll('tbody tr')[row];assert(tr);return tr.children[index];};

const approved=render('group-request','request-draft-approved');
assert(approved.textContent.includes('同じ色は同じ対象を示します。'));
const requestTone=sameTone(approved,'request:R-101',5),v1Tone=sameTone(approved,'version:R-101:V1',3),draftTone=sameTone(approved,'version:R-101:D1',2);
assert.equal(new Set([requestTone,v1Tone,draftTone]).size,3);
assert.equal(at(approved,'version',0,'版').textContent,'V1');assert.equal(at(approved,'item',0,'版').dataset.keyTone,v1Tone);
assert.equal(at(approved,'version',1,'版').textContent,'D1');assert.equal(at(approved,'item',1,'版').dataset.keyTone,draftTone);
const batch=render('group-handoff','handoff-batch'),a=sameTone(batch,'version:R-101:V1',4),b=sameTone(batch,'version:R-102:V1',3);
assert.notEqual(a,b,'the same displayed version name in different requests is not the same target');
assert.equal(at(batch,'request',0,'対象版').textContent,at(batch,'request',1,'対象版').textContent);
const expectedVersionCells={'request-draft-empty':0,'request-draft':2,'request-draft-approved':5,'request-draft-prepared':5,'request-submitted':4,'decision-approved':3,'decision-resubmitted':3,'handoff-batch':7,'handoff-retry':7,'result-partial':5,'result-closed':7,'result-none':3};
for(const group of context.model.reviewGroups)for(const cap of group.capabilities)for(const scene of cap.samples){
 const versions=[];for(const block of scene.blocks){const labels=new Map(block.columns.map(col=>[col.id,col.name]));for(const row of block.rows){const parent=row.cells.find(c=>['申請','対象申請'].includes(labels.get(c.columnId)));for(const cell of row.cells)if(/版/.test(labels.get(cell.columnId))&&/^[VD][0-9]+$/.test(String(cell.value))){assert(parent,scene.id+' version needs its displayed request');versions.push({cell,key:`version:${parent.value}:${cell.value}`});}}}
 let linked=0;for(const entry of versions){const repeated=versions.filter(v=>v.key===entry.key).length>1;if(repeated){assert.equal(entry.cell.linkId,entry.key,scene.id+' must explicitly link each repeated version');linked++;}else assert.equal(entry.cell.linkId,undefined,scene.id+' need not color an unpaired version');}
 assert.equal(linked,expectedVersionCells[scene.id],scene.id+' version coverage');
}
const withoutLink=structuredClone(context.model),unlinked=withoutLink.reviewGroups[0].capabilities[0].samples.find(s=>s.id==='request-draft-approved');
const unlinkedBlock=unlinked.blocks.find(b=>b.card==='version'),versionCol=unlinkedBlock.columns.find(c=>c.name==='版').id;delete unlinkedBlock.rows[0].cells.find(c=>c.columnId===versionCol).linkId;
const unlinkedDOM=render('group-request','request-draft-approved',{business:context.business,model:withoutLink});assert.equal(at(unlinkedDOM,'version',0,'版').textContent,'V1');assert.equal(at(unlinkedDOM,'version',0,'版').dataset.keyTone,undefined,'Viewer must not infer a link from matching text');
record('SAMPLE-IDENTITY-001');

const verifyItemLinks=model=>{for(const id of ['result-partial','result-closed']){
 const scene=model.reviewGroups.flatMap(g=>g.capabilities.flatMap(c=>c.samples)).find(s=>s.id===id),item=scene.blocks.find(b=>b.card==='item'),line=scene.blocks.find(b=>b.card==='line');
 const rows=block=>block.rows.map(row=>Object.fromEntries(block.columns.map(c=>[c.name,row.cells.find(cell=>cell.columnId===c.id)])));
 const items=rows(item),lines=rows(line);assert.equal(items.length,2);assert(lines.length>=2);
 for(const row of items){const key=`item:${row['申請'].value}:${row['対象版'].value}:${row['品目番号'].value}`;assert.equal(row['品目番号'].linkId,key);}
 assert.equal(new Set(items.map(row=>row['品目番号'].linkId)).size,items.length);
 for(const row of lines){const key=`item:${row['申請'].value}:${row['対象版'].value}:${row['元品目番号'].value}`;assert.equal(row['元品目番号'].linkId,key);assert(items.some(itemRow=>itemRow['品目番号'].linkId===key),'every receipt line points to a displayed item');}
 }};
verifyItemLinks(context.model);
for(const [id,counts] of [['result-partial',[2,2]],['result-closed',[3,3]]]){const r=render('group-result',id),one=sameTone(r,'item:R-101:V1:01',counts[0]),two=sameTone(r,'item:R-101:V1:02',counts[1]);assert.notEqual(one,two);assert.equal(at(r,'item',0,'品目番号').textContent,'01');assert.equal(at(r,'line',0,'元品目番号').textContent,'01');}
const badItem=structuredClone(context.model),badScene=badItem.reviewGroups.flatMap(g=>g.capabilities.flatMap(c=>c.samples)).find(s=>s.id==='result-partial'),badLine=badScene.blocks.find(b=>b.card==='line'),badColumn=badLine.columns.find(c=>c.name==='元品目番号');badLine.rows[0].cells.find(c=>c.columnId===badColumn.id).linkId='item:R-101:V1:02';assert.throws(()=>verifyItemLinks(badItem));
const sameNames=structuredClone(context.model),sameScene=sameNames.reviewGroups.flatMap(g=>g.capabilities.flatMap(c=>c.samples)).find(s=>s.id==='result-partial');for(const block of sameScene.blocks.filter(b=>['item','line'].includes(b.card))){const col=block.columns.find(c=>c.name===(block.card==='item'?'品名':'元の品名'));for(const row of block.rows)row.cells.find(c=>c.columnId===col.id).value='同じ品名';}verifyItemLinks(sameNames);const sameNameDOM=render('group-result','result-partial',{business:context.business,model:sameNames});assert.notEqual(sameTone(sameNameDOM,'item:R-101:V1:01',2),sameTone(sameNameDOM,'item:R-101:V1:02',2));
record('SAMPLE-IDENTITY-002');

const notes={request:'申請の識別で、別の申請と区別する想定。',version:'申請と、その申請内の版の識別を組み合わせて区別する想定。',item:'申請版と、その版内の品目の識別を組み合わせて区別する想定。'};
for(const [id,note] of Object.entries(notes)){const concept=context.model.concepts.find(c=>c.id===id);assert(concept.description.endsWith(note));assert.equal(concept.reviewState,'未レビュー');assert(views.tables[id].note.endsWith(note));assert(views.findGroup('group-request').concepts[id].note.endsWith(note));}
assert.equal(context.model.concepts.find(c=>c.id==='version').information[0].name,'版の識別');assert.equal(context.model.concepts.find(c=>c.id==='item').information[0].name,'版内の品目の識別');
record('SAMPLE-IDENTITY-003');

assert.equal(samples.dataExamples.length,12);assert.equal(views.groups.length,4);
for(const sample of samples.dataExamples){const r=render(sample.group,sample.id);assert(r.textContent.includes('架空のデータ例'));assert(r.textContent.includes('同じ色は同じ対象を示します。'));const tones=new Map();for(const cell of r.querySelectorAll('[data-sample-key]')){const key=cell.dataset.sampleKey,tone=cell.dataset.keyTone;assert(cell.textContent&&tone);if(tones.has(key))assert.equal(tones.get(key),tone);tones.set(key,tone);}assert.equal(new Set(tones.values()).size,tones.size);}
record('SAMPLE-IDENTITY-004');
complete(coverage);assert.throws(()=>complete(coverage.slice(1)));assert.throws(()=>complete([...coverage,coverage[0]]));verifyAuthority(readFileSync(path));dom.window.close();
console.log(JSON.stringify({authority:path,sha256:expectedHash,checks:coverage,scope:'V3 JSON and real DOM; both themes and native Chrome checked separately'}));
