import {cpSync,mkdirSync,readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {reviewSamples,sourceURL} from './prepare-review-samples.mjs';
const repo=fileURLToPath(new URL('../../',import.meta.url));
const git=(...args)=>execFileSync('git',['-C',repo,...args],{encoding:'utf8'}).trim();
export function preparePreview(output){
 const head=git('rev-parse','HEAD'),path=`preview/pr-357/${head}-main-review/`,dest=join(output,path);
 mkdirSync(dest,{recursive:true});cpSync(join(repo,'web-viewer/dist'),dest,{recursive:true});mkdirSync(join(dest,'examples'),{recursive:true});
 const original=readFileSync(sourceURL),reviewed=JSON.stringify(reviewSamples(),null,2)+'\n';
 writeFileSync(join(dest,'examples/json-complete-concept-review.original.json'),original);
 writeFileSync(join(dest,'examples/json-complete-concept-review.json'),reviewed);
 const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
 const files=readdirSync(dest,{recursive:true}).filter(file=>!file.endsWith('preview-manifest.json')&&!file.endsWith('/')&&!file.includes('..')).filter(file=>/\.(?:html|js|css|txt|json)$/.test(file)).sort();
 const manifest={source:head,sourceTree:git('rev-parse','HEAD^{tree}'),mainBase:'777b79a4f919a1456c74a724b949bc7748f32df1',modelSource:'887c0f60a191d06e1db0ed50567844cca2ec1950',originalSha256:hash(original),reviewedSha256:hash(reviewed),humanGuiReview:'not-performed',files:Object.fromEntries(files.map(file=>[file,hash(readFileSync(join(dest,file)))]))};
 writeFileSync(join(dest,'preview-manifest.json'),JSON.stringify(manifest,null,2)+'\n');return {dest,path,manifest};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){if(!process.argv[2])throw Error('Output directory required');console.log(JSON.stringify(preparePreview(resolve(process.argv[2]))));}
