// Read-only calls into production parsers. No production changes or dependencies.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {parseDesign} from '../../../web-viewer/src/graph.ts';
import {parseChecks} from '../../../web-viewer/src/check-items.ts';
import {fetchMarkdown} from '../../../web-viewer/src/source.ts';
const base=new URL('./',import.meta.url);
const read=p=>readFileSync(new URL(p,base),'utf8');
const results=[];
function probe(name,fn,expectedSuccess){
  let success=true,error;
  try{fn();}catch(e){success=false;error=e.message;}
  assert.equal(success,expectedSuccess,name);
  results.push({name,success,error,expected:true});
}
probe('existing legacy purchase BD',()=>parseDesign(read('inputs/check-source.md')),true);
probe('pinned PR254 purchase draft',()=>parseDesign(read('inputs/purchase.md')),false);
probe('Plugin 0.4.8 shared-guarantee Check sample',()=>parseChecks(read('inputs/checks.md')),false);
probe('legacy Check sample in main',()=>parseChecks(read('../../../docs/examples/purchase-check-review.ja.md')),true);
probe('combined MD fixture directly in current Viewer',()=>parseDesign(read('fixtures/purchase.md')),false);
for(const fmt of ['json','jsonl'])probe(`${fmt} storage is not Graph v1`,()=>parseDesign(read(`fixtures/purchase.${fmt}`)),false);
const originalFetch=globalThis.fetch;
try{
  for(const [type,expected] of [['text/markdown',true],['application/json',false],['application/x-ndjson',false]]){
    globalThis.fetch=async()=>new Response('# title\n',{headers:{'content-type':type}});
    let success=true,error;
    try{await fetchMarkdown('https://example.invalid/frozen-input');}catch(e){success=false;error=e.message;}
    assert.equal(success,expected);
    results.push({name:`current URL MIME gate ${type}`,success,error,expected:true,note:'mock fetch; no external network'});
  }
}finally{globalThis.fetch=originalFetch;}
writeFileSync(new URL('results/compatibility.json',base),JSON.stringify({node:process.version,results},null,2)+'\n');
console.log(JSON.stringify(results,null,2));
