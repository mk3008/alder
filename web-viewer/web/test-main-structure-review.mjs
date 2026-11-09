import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {build} from 'esbuild';
import {JSDOM} from 'jsdom';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const base='777b79a4f919a1456c74a724b949bc7748f32df1';
const source='887c0f60a191d06e1db0ed50567844cca2ec1950';
const prepared='d3123341';
const git=(...args)=>execFileSync('git',['-C','..',...args],{maxBuffer:20*1024*1024});
const authorityPath='work/340-structure-explorer-review/acceptance.json';
const authority=git('show',prepared+':'+authorityPath);
const verifyAuthority=bytes=>assert.deepEqual(bytes,authority,'pre-implementation authority is immutable');
verifyAuthority(readFileSync('../'+authorityPath));
const requirements=JSON.parse(authority);
const expected=requirements.checks.flatMap(check=>check.cases.map(name=>({id:check.id,case:name})));
const coverage=results=>{
 assert.equal(results.length,expected.length,'all applicable cases have a result');
 assert.deepEqual(results.map(({id,case:name})=>id+':'+name).sort(),expected.map(({id,case:name})=>id+':'+name).sort());
 assert(results.every(result=>['pass','pending','fail'].includes(result.status)));
};
const complete=expected.map(item=>({...item,status:'pending'}));
coverage(complete);
assert.throws(()=>coverage(complete.slice(1)));
assert.throws(()=>coverage([...complete,complete[0]]));
const fewerIds=structuredClone(requirements);fewerIds.checks.shift();assert.throws(()=>verifyAuthority(Buffer.from(JSON.stringify(fewerIds))));
const fewerCases=structuredClone(requirements);fewerCases.checks[0].cases=[];assert.throws(()=>verifyAuthority(Buffer.from(JSON.stringify(fewerCases))));
assert.throws(()=>verifyAuthority(Buffer.alloc(0)));
const frozen=JSON.parse(git('show',prepared+':work/340-structure-explorer-review/authority-sha256.json'));
for(const [path,digest] of Object.entries(frozen))assert.equal(hash(readFileSync('../'+path)),digest,path);
const results=[];
const record=(id,name)=>results.push({id,case:name,status:'pass'});
const file='business-design/alder/json-complete-concept-review.json';
const bytes=readFileSync('../'+file),pkg=JSON.parse(bytes),model=pkg.documents.find(d=>d.kind==='conceptModel');
assert.equal(hash(bytes),'e93657d3680bac31907b7d54e96498e79dcff8ffd66c420ef3ca9441cc5a7181');
const fields=model.meta.fieldMappings,undecided=fields.filter(field=>field.nullable===null);
assert.equal(fields.length,339);assert.equal(undecided.length,47);assert(undecided.every(field=>field.nullableReason&&field.nullableStatus==='proposal'));
record('MAIN-REVIEW-001','fixed-source');
// Compare all existing files on the protected surfaces, rather than accepting
// a candidate-generated baseline. Only the named presentation integration points differ.
const editable=new Set(['web-viewer/src/viewer-shell.ts','web-viewer/src/viewer-shell.css','web-viewer/src/drawer-resize.ts']);
const protectedPaths=git('ls-tree','-r','--name-only',base,'--','web-viewer/src','web-viewer/verification','tools/document_storage','plugins','business-design').toString().trim().split('\n').filter(path=>!editable.has(path));
for(const path of protectedPaths)assert.deepEqual(readFileSync('../'+path),git('show',base+':'+path),path+' retains main');
// Candidate-only schema and old input are archived test data; main contracts stay above.
for(const [path,upstream] of [
 ['work/340-structure-explorer-review/source-schema.mjs','tools/document_storage/schema.mjs'],
 ['work/340-structure-explorer-review/paper-manual-v06.json','tools/document_storage/examples/paper-manual-v06.json'],
 ...['json-complete-concept-review.json','json-normalized-model-review.json','json-structure-review.json'].map(name=>['business-design/alder/'+name,'business-design/alder/'+name])
])assert.equal(hash(readFileSync('../'+path)),hash(git('show',source+':'+upstream)),path+' equals pinned source');
record('MAIN-REVIEW-002','main-preservation');
const code=(await build({entryPoints:['src/structure-explorer.ts'],bundle:true,write:false,format:'iife',globalName:'Explorer'})).outputFiles[0].text;
const window=new JSDOM('<div id="tree"></div><div id="detail"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;
const before=JSON.stringify(model),checked=[];
try{
 window.eval(code+';globalThis.Explorer=Explorer;');
 const detail=window.document.querySelector('#detail');
 window.Explorer.renderStructureExplorer(window.document.querySelector('#tree'),model);
 assert.equal(window.document.querySelector('.structure-pending').textContent,'null許容が未決：47項目（互換・移行用を含む）');
 for(const field of undecided){
  const owner=model.concepts.find(concept=>concept.information.some(info=>info.id===field.informationId));assert(owner);
  window.Explorer.renderStructureDetails(detail,model,{kind:'structure',conceptId:owner.id,hideLegacy:false});
  const row=[...detail.querySelectorAll('[data-information-id]')].find(item=>item.dataset.informationId===field.informationId);
  assert(row,field.physicalName+' is accessible with compatibility filter off');
  assert(row.textContent.includes('null許容：未決'));
  row.querySelector('button').click();
  const value=label=>[...detail.querySelectorAll('dt')].find(dt=>dt.textContent===label)?.nextElementSibling?.textContent;
  assert.equal(value('null許容'),'未決',field.physicalName);
  assert.equal(value('null許容の理由'),field.nullableReason,field.physicalName);
  checked.push(field.informationId);
 }
 assert.equal(new Set(checked).size,47);assert.equal(JSON.stringify(model),before);
 assert.equal(hash(readFileSync('../'+file)),hash(bytes));
}finally{window.close();}
record('MAIN-REVIEW-003','all-undecided-details');
const pending=expected.filter(item=>!results.some(result=>result.id===item.id&&result.case===item.case)).map(item=>({...item,status:'pending'}));
coverage([...results,...pending]);verifyAuthority(readFileSync('../'+authorityPath));
console.log(JSON.stringify({authorityCommit:prepared,base,source,sourceSha256:hash(bytes),fields:fields.length,undecided:checked.length,results,pending,scope:'source/main preservation and all undecided details; shell and published-preview cases are reconciled separately'}));
