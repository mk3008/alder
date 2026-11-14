// The pinned review source remains byte-identical. Only the published copy's
// display examples change; fields, types, constraints and reference data stay.
import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
export const sourceURL=new URL('../../business-design/alder/json-complete-concept-review.json',import.meta.url);
export const samples=JSON.parse(readFileSync(new URL('./review-sample-values.json',import.meta.url),'utf8'));
export function reviewSamples(){
 const pkg=JSON.parse(readFileSync(sourceURL,'utf8'));
 const model=pkg.documents.find(doc=>doc.kind==='conceptModel');
 for(const [id,value]of Object.entries(samples)){
  const field=model.meta.fieldMappings.find(field=>field.informationId===id);
  if(!field||typeof field.sampleValue!=='string')throw Error('Unknown string sample: '+id);
  field.sampleValue=value;
 }
 return pkg;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 if(!process.argv[2])throw Error('Output path is required');
 writeFileSync(process.argv[2],JSON.stringify(reviewSamples(),null,2)+'\n');
}
