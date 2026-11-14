import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {reviewSamples} from '../361-beta-fixes/prepare-review-samples.mjs';

export const copy=JSON.parse(readFileSync(new URL('./display-copy.json',import.meta.url),'utf8'));
// Only this pinned Preview's distribution copy is edited. The general Viewer
// receives ordinary input text and does not classify or suppress its wording.
export function reviewDisplayCopy(){
 const pkg=reviewSamples(),model=pkg.documents.find(doc=>doc.id===copy.documentId);
 assert(model,'pinned concept document exists');
 const concept=model.concepts.find(item=>item.id===copy.conceptId);
 const node=model.presentation.subsystemViews.nodes.find(item=>item.id===copy.nodeId);
 for(const target of [concept,node]){
  assert.equal(target?.description,copy.original,'source text must match reviewed record exactly');
  target.description=copy.description;
 }
 return pkg;
}
