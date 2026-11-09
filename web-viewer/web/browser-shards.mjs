// CI scheduling only. The browser registry and every case/assertion stay in the runner.
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync,readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const manifest=JSON.parse(readFileSync(new URL('./browser-shards.json',import.meta.url),'utf8'));
const runner=fileURLToPath(new URL('./test-browser.mjs',import.meta.url));
function plan(args=[]){
 const run=spawnSync(process.execPath,[runner,'--list',...args],{encoding:'utf8'});
 assert.equal(run.status,0,run.stderr);
 return JSON.parse(run.stdout).browserPlan;
}
const full=plan(),all=manifest.shards.flatMap(shard=>shard.cases);
assert.deepEqual(manifest.shards.map(shard=>shard.id),['1','2','3'],'shard IDs must match the workflow matrix');
assert.ok(manifest.shards.every(shard=>shard.cases.length>0),'empty shard');
assert.equal(new Set(all).size,all.length,'duplicate case across shards');
assert.deepEqual([...all].sort(),[...full.selected].sort(),'shards must cover the current full browser registry exactly');
const [id,logPath,...extra]=process.argv.slice(2);
assert.equal(extra.length,0,'usage: browser-shards.mjs SHARD_ID [RESULT_LOG]');
const shard=manifest.shards.find(shard=>shard.id===id);
assert.ok(shard,'unknown shard ID');
const selected=plan(['--cases',shard.cases.join(',')]).selected;
assert.equal(selected.length,shard.cases.length,'runner selection dropped a case');
if(logPath){
 // Individual cases also emit summaries for their own nested checks. Only the
 // outer runner reports the complete registry's available count.
 const summaries=readFileSync(logPath,'utf8').split('\n')
  .filter(line=>line.startsWith('{"browserSummary":'))
  .map(line=>JSON.parse(line).browserSummary)
  .filter(summary=>summary.available===full.available);
 assert.equal(summaries.length,1,'expected exactly one outer browser summary');
 const summary=summaries[0];
 assert.equal(summary.available,full.available,'result registry differs from plan');
 assert.deepEqual(summary.selected,selected,'result selection differs from shard');
 assert.equal(summary.total,selected.length,'incomplete shard result');
 assert.equal(summary.passed,selected.length,'not all shard cases passed');
 assert.equal(summary.failed,0,'failed shard case');
 assert.deepEqual(summary.results.map(result=>result.name),selected,'missing or duplicate case result');
 assert.ok(summary.results.every(result=>result.status==='passed'),'non-passing case result');
 assert.ok(Number.isFinite(summary.durationMs)&&summary.durationMs>=0,'missing duration');
 // Preserve the two previously mandatory upload directories on their owning shard.
 for(const [name,directory] of [['jsonLayout','json-layout'],['jsonDocuments','json-document']]){
  if(selected.includes(name))assert.ok(readdirSync(`web/evidence/${directory}`).length>0,`${name} review evidence missing`);
 }
 console.log(JSON.stringify({browserShard:{id,available:full.available,selected,total:summary.total,passed:summary.passed,failed:summary.failed,durationMs:summary.durationMs,cases:summary.results.map(({name,status,durationMs})=>({name,status,durationMs}))}}));
}else console.log(`cases=${selected.join(',')}`);
