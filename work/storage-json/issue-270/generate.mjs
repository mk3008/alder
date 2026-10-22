import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {parseStrict,stringify,validate} from './core.mjs';
import {markdown} from './export-md.mjs';
const dir=fileURLToPath(new URL('./',import.meta.url));
const input=parseStrict(fs.readFileSync(dir+'fixtures/purchase.json','utf8'));
fs.mkdirSync(dir+'.generated',{recursive:true});
for(const count of [5,100,1000]){
 const p=structuredClone(input),d=p.documents[0],seed=d.activities[0],seedRelations=d.relations.filter(r=>r.fromId===seed.id||r.toId===seed.id);
 for(let i=d.activities.length;i<count;i++){
  const a=structuredClone(seed);a.id='synthetic-'+i;a.name='合成申請'+String(i).padStart(4,'0');d.activities.push(a);
  for(const [j,r]of seedRelations.entries())d.relations.push({...r,id:`synthetic-${i}-relation-${j}`,fromId:r.fromId===seed.id?a.id:r.fromId,toId:r.toId===seed.id?a.id:r.toId});
 }
 d.revision='synthetic-'+count;validate(p);fs.writeFileSync(dir+`.generated/activities-${count}.json`,stringify(p));
}
// Files are regenerated locally, never uploaded by the harness.
const big=structuredClone(input);big.documents[0].activities[0].why='x'.repeat(17*1024*1024);fs.writeFileSync(dir+'.generated/over-budget.json',stringify(big));
// Legacy MD remains a separate frozen source, outside the JSON package.
fs.copyFileSync(dir+'inputs/check-source.md',dir+'fixtures/legacy.md');
fs.writeFileSync(dir+'fixtures/current-export.md',markdown(input,input.documents[0].id).text);
// Historical Codex trial files are immutable evidence; generation never rewrites them.
console.log([5,100,1000].map(n=>({activities:n,bytes:fs.statSync(dir+`.generated/activities-${n}.json`).size})));
