import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {reviewDisplayCopy} from '../361-copy-separation/prepare-display-copy.mjs';
import {preparePreview as previousPreview} from '../361-copy-separation/prepare-preview.mjs';
import {structureReviewCandidates} from '../../web-viewer/src/structure-review-candidates.ts';
export const candidates=JSON.parse(readFileSync(new URL('./candidates.json',import.meta.url)));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
export function verifyReviewOrigin(bytes,origin){assert.equal(hash(bytes),origin.sha256,'original source bytes');}
export async function reviewCandidatePackage(){
 const pkg=reviewDisplayCopy(),model=pkg.documents.find(d=>d.kind==='conceptModel');
 assert.deepEqual(candidates.origin,{repository:'mk3008/alder',commit:'887c0f60a191d06e1db0ed50567844cca2ec1950',path:'business-design/alder/json-complete-concept-review.json',sha256:'e93657d3680bac31907b7d54e96498e79dcff8ffd66c420ef3ca9441cc5a7181'},'fixed source for this Preview scope');
 verifyReviewOrigin(readFileSync(new URL('../../'+candidates.origin.path,import.meta.url)),candidates.origin);
 assert(!Object.hasOwn(model.meta,'previewStructureReview'));model.meta.previewStructureReview=structuredClone(candidates);
 const result=await structureReviewCandidates(model);assert.equal(result.code,'valid','Preview integrity gate: '+result.code);return pkg;
}
export async function preparePreview(output){
 const reviewed=JSON.stringify(await reviewCandidatePackage(),null,2)+'\n';
 // Validate before generating any distribution output.
 const result=previousPreview(output);writeFileSync(join(result.dest,'examples/json-complete-concept-review.json'),reviewed);
 const catalog=readFileSync(new URL('./candidates.json',import.meta.url));writeFileSync(join(result.dest,'structure-review-candidates.json'),catalog);
 result.manifest.reviewedSha256=hash(reviewed);result.manifest.structureReview={catalog:'structure-review-candidates.json',sha256:hash(catalog)};
 result.manifest.files['examples/json-complete-concept-review.json']=hash(reviewed);result.manifest.files['structure-review-candidates.json']=hash(catalog);
 writeFileSync(join(result.dest,'preview-manifest.json'),JSON.stringify(result.manifest,null,2)+'\n');return result;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){if(!process.argv[2])throw Error('Output directory required');console.log(JSON.stringify(await preparePreview(resolve(process.argv[2]))));}
