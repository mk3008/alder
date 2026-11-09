import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {preparePreview as prepareBetaPreview} from '../361-beta-fixes/prepare-preview.mjs';
import {reviewDisplayCopy,copy} from './prepare-display-copy.mjs';
const repo=fileURLToPath(new URL('../../',import.meta.url));
const escape=value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
export function preparePreview(output){
 const result=prepareBetaPreview(output),{dest,manifest}=result;
 const reviewed=JSON.stringify(reviewDisplayCopy(),null,2)+'\n';
 writeFileSync(join(dest,'examples/json-complete-concept-review.json'),reviewed);
 writeFileSync(join(dest,'display-copy-provenance.json'),JSON.stringify(copy,null,2)+'\n');
 writeFileSync(join(dest,'flowstep-authoring-guide.html'),`<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>FlowStep 作成ガイド</title><style>body{font:1rem/1.8 system-ui,sans-serif;max-width:48rem;margin:2rem auto;padding:0 1rem;color:#182738;background:#fff}li{margin:1rem 0}a{color:#175ca5}</style><main><h1>FlowStep 作成ガイド</h1><p>フロー内の手順を記述するときのルールです。</p><ul>${copy.authoringRules.map(rule=>'<li>'+escape(rule)+'</li>').join('')}</ul><h2>元の記録</h2><p><a href="./examples/json-complete-concept-review.original.json">元JSON</a>の構造 <code>n-flow-step</code> と全体図のノード <code>overview-n-flow-step</code> にある説明に対応します。<a href="./display-copy-provenance.json">元の文章と表示文の対応</a>も確認できます。</p><p><a href="./?preview=1&view=concept&concept=structure-explorer%3An-flow-step#source=${encodeURIComponent('https://mk3008.github.io/alder/'+result.path+'examples/json-complete-concept-review.json')}">構造の説明に戻る</a></p></main></html>\n`);
 // A Preview-only entry point; no input-text processing or new general UI rule.
 writeFileSync(join(dest,'preview-authoring-guide.js'),`const badge=document.getElementById('preview-badge');if(badge){const link=document.createElement('a');link.href='./flowstep-authoring-guide.html';link.textContent='FlowStep 作成ガイド';link.style.color='inherit';link.style.marginInlineStart='1em';badge.append(link);}\n`);
 const index=join(dest,'index.html');writeFileSync(index,readFileSync(index,'utf8').replace('</body>','<script type="module" src="./preview-authoring-guide.js"></script></body>'));
 manifest.mainBase=execFileSync('git',['-C',repo,'rev-parse','c0376fcd'],{encoding:'utf8'}).trim();
 manifest.reviewedSha256=hash(reviewed);manifest.displayCopy='display-copy-provenance.json';manifest.authoringGuide='flowstep-authoring-guide.html';
 manifest.files=Object.fromEntries(readdirSync(dest,{recursive:true}).filter(file=>/\.(html|js|css|txt|json)$/.test(file)&&file!=='preview-manifest.json').sort().map(file=>[file,hash(readFileSync(join(dest,file)))]));
 writeFileSync(join(dest,'preview-manifest.json'),JSON.stringify(manifest,null,2)+'\n');return result;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){if(!process.argv[2])throw Error('Output directory required');console.log(JSON.stringify(preparePreview(resolve(process.argv[2]))));}
