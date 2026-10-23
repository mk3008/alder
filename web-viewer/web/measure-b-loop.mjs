// One bounded, opt-in comparison in the existing Chrome job; no browser fallback.
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdirSync,writeFileSync,readFileSync,openSync,closeSync} from 'node:fs';
import {resolve,join} from 'node:path';
const baseline=resolve(process.argv[2]??''),candidate=process.cwd(),out=resolve('web/evidence/b-loop');
assert.notEqual(baseline,candidate,'an explicit detached baseline is required');
mkdirSync(out,{recursive:true});
const revision='441dfb8b2fbf36bb4215ec885852dc14fa6a3e59';
function git(args){const r=spawnSync('git',args,{encoding:'utf8'});assert.equal(r.status,0,r.stderr);return r.stdout.trim();}
assert.equal(git(['-C',baseline,'rev-parse','HEAD']),revision);
// A shared build is valid only when all product, runtime dependencies and inputs match.
assert.equal(git(['diff',revision,'HEAD','--','src','index.html','package.json','package-lock.json','public',
 '../tools/document_storage','../tools/viewer-preview.mjs','../work/viewer-json/issue-274/layout-regression',
 '../work/json-roles','../work/json-states','../work/plugin-json']), '','baseline/candidate product, dependencies and fixtures must be identical');
const result={baseline:revision,candidate:process.env.REVIEW_HEAD??git(['rev-parse','HEAD']),
 conditions:{node:process.version,platform:process.platform,arch:process.arch,runner:process.env.RUNNER_OS??null,sharedProductBuild:true,order:'targeted pairs AB/BA/AB, then full A/B; sequential, one runner/browser version/font'},preflight:[],fast:[],targeted:[],full:[]};
const save=()=>writeFileSync(join(out,'comparison.json'),JSON.stringify(result,null,2));
function run(kind,label,index,args){
 const path=join(out,`${kind}-${label}-${index}.log`),fd=openSync(path,'w'),start=performance.now();
 let r;try{r=spawnSync(process.execPath,args,{cwd:label==='before'?baseline:candidate,stdio:['ignore',fd,fd],env:{...process.env,REVIEW_HEAD:label==='before'?revision:result.candidate},timeout:900000});}finally{closeSync(fd);}
 const elapsedMs=Math.round(performance.now()-start),log=readFileSync(path,'utf8');
 const summaries=log.split('\n').flatMap(line=>{const at=line.indexOf('{"browserSummary":');if(at<0)return [];try{return [JSON.parse(line.slice(at)).browserSummary];}catch{return [];}});
 const summary=summaries.at(-1),record={label,index,elapsedMs,status:r.status,signal:r.signal??null};
 if(kind!=='fast'){
  record.summary=summary?{scope:summary.scope,total:summary.total,passed:summary.passed,failed:summary.failed,durationMs:summary.durationMs,jsonLayoutMs:summary.results.find(c=>c.name==='jsonLayout')?.durationMs}:null;
  if(summary)record.cases=summary.results.map(c=>({name:c.name,status:c.status,durationMs:c.durationMs}));
 }
 result[kind].push(record);save();console.log(JSON.stringify({bLoopProgress:record}));
 assert.equal(r.status,0,`${kind} ${label} ${index} failed; inspect ${path}: ${r.error?.message??log.slice(-3500)}`);
 if(kind!=='fast'){assert.ok(summary);assert.equal(summary.failed,0);assert.equal(summary.total,kind==='full'?47:1);assert.equal(summary.scope,kind==='full'?'full':'targeted');}
 return record;
}
// Preview metadata and local dist are separate boundaries from app byte equality.
// Check both before paying for either full suite.
for(const label of ['before','after'])run('preflight',label,0,['web/test-browser.mjs','--cases','jsonOfflinePreview']);
const reuseSource='ec7796cc808eb8763ea979c381bd0c6f2d7c5f86';
const reuse=git(['show','-s','--format=%B',process.env.REVIEW_HEAD??'HEAD']).split('\n').includes('Benchmark-B-Loop-Full-Only: '+reuseSource);
if(reuse){
 git(['fetch','--no-tags','--depth=1','origin',reuseSource]);
 assert.equal(git(['diff',reuseSource,'HEAD','--','web/test-json-layout.mjs','web/test-json-layout-browser.mjs','web/json-layout-contract.mjs','web/test-document-loader.mjs']), '','reuse requires byte-identical measured tests');
 result.reusedTargeted={source:reuseSource,run:39923980332,reason:'three successful paired samples retained; fix only benchmark Preview provenance/build setup'};save();
}else for(let i=0;i<3;i++)for(const label of i%2?['after','before']:['before','after']){
 run('fast',label,i,['--experimental-strip-types','--test','--test-isolation=process','--test-concurrency=2','web/test-json-layout.mjs','web/test-document-loader.mjs']);
 run('targeted',label,i,['web/test-browser.mjs','--cases','jsonLayout']);
}
for(const label of ['before','after'])run('full',label,0,['web/test-browser.mjs']);
const median=a=>[...a].sort((x,y)=>x-y)[Math.floor(a.length/2)];
result.comparison=Object.fromEntries(['fast','targeted','full'].filter(kind=>result[kind].length).map(kind=>{
 const metric=r=>kind==='fast'?r.elapsedMs:r.summary.durationMs;
 const before=median(result[kind].filter(r=>r.label==='before').map(metric)),after=median(result[kind].filter(r=>r.label==='after').map(metric));
 return [kind,{beforeMs:before,afterMs:after,deltaMs:after-before,reductionPercent:Math.round((before-after)/before*1000)/10,samplesPerSide:kind==='full'?1:3}];
}));save();console.log(JSON.stringify({bLoopComparison:result.comparison}));
