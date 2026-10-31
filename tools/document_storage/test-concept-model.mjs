import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validate} from './core.mjs';
import {guardAuthoring} from './authoring.mjs';

const previous=JSON.parse(readFileSync(new URL('../../work/concept-review/issue-133/versions/purchase-v3-beta.json',import.meta.url),'utf8'));
const concept=pkg=>pkg.documents.find(doc=>doc.kind==='conceptModel');
const update=change=>{const next=structuredClone(previous);next.revision+='-next';concept(next).revision+='-next';change(concept(next));return next;};
const operation={expectedRevision:previous.revision};
test('one-file concept model validates without claiming business approval',()=>{
 const result=validate(previous);assert.ok(result.diagnostics.some(line=>line.includes('概念モデルの業務意味は未確認')));
});
test('renaming preserves concept identity; nested IDs cannot silently disappear',()=>{
 const renamed=update(model=>{model.concepts[0].name+='（改名）';});assert.equal(guardAuthoring(previous,renamed,operation).valid,true);
 const removedSample=update(model=>{model.reviewGroups[0].capabilities[0].samples.shift();});validate(removedSample);
 assert.throws(()=>guardAuthoring(previous,removedSample,operation),/Existing Concept ID was removed/);
 const replacedColumn=update(model=>{const block=model.reviewGroups[0].capabilities[0].samples[0].blocks[0];const old=block.columns[0].id;block.columns[0].id+='-new';for(const row of block.rows)for(const cell of row.cells)if(cell.columnId===old)cell.columnId+='-new';});validate(replacedColumn);
 assert.throws(()=>guardAuthoring(previous,replacedColumn,operation),/Existing Concept ID was removed/);
});
