import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {reviewDisplayCopy} from '../361-copy-separation/prepare-display-copy.mjs';
import {preparePreview as previousPreview} from '../361-copy-separation/prepare-preview.mjs';
export const candidates=JSON.parse(readFileSync(new URL('./candidates.json',import.meta.url)));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
export function reviewHypothesisPackage(){
 const pkg=reviewDisplayCopy();assert.equal(hash(JSON.stringify(pkg)),candidates.source.baselinePreviewSha256,'candidate source must remain the reviewed display copy');
 const model=pkg.documents.find(d=>d.kind==='conceptModel'),ids=model.concepts.flatMap(c=>c.information.map(i=>i.id));
 assert.deepEqual(Object.keys(candidates.fields).sort(),ids.sort());assert(!Object.hasOwn(model.meta,'previewStructureReview'));
 model.meta.previewStructureReview=structuredClone(candidates);return pkg;
}
export function preparePreview(output){
 const result=previousPreview(output),reviewed=JSON.stringify(reviewHypothesisPackage(),null,2)+'\n';
 writeFileSync(join(result.dest,'examples/json-complete-concept-review.json'),reviewed);
 const catalogBytes=readFileSync(new URL('./candidates.json',import.meta.url));writeFileSync(join(result.dest,'structure-review-candidates.json'),catalogBytes);
 result.manifest.reviewedSha256=hash(reviewed);result.manifest.reviewHypotheses={catalog:'structure-review-candidates.json',status:'unreviewed',sha256:hash(catalogBytes)};
 result.manifest.files['examples/json-complete-concept-review.json']=hash(reviewed);result.manifest.files['structure-review-candidates.json']=hash(catalogBytes);
 writeFileSync(join(result.dest,'preview-manifest.json'),JSON.stringify(result.manifest,null,2)+'\n');return result;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){if(!process.argv[2])throw Error('Output directory required');console.log(JSON.stringify(preparePreview(resolve(process.argv[2]))));}
