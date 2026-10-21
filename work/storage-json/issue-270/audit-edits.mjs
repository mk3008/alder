import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {parseStrict,validate,inventory} from './core.mjs';
const dir=fileURLToPath(new URL('./',import.meta.url)),read=p=>fs.readFileSync(dir+p,'utf8');
const rows=[],beforeJSON=parseStrict(read('edits/before.json')),beforeMD=read('edits/before.md');
for(const task of ['why','rename','review'])for(const format of ['md','json']){
 const path='edits/'+task+'.'+format,after=read(path);let expected,parsed;
 if(format==='json'){
  expected=structuredClone(beforeJSON);const d=expected.documents[0];
  if(task==='why')d.activities[0].why+='（保存形式PoCの編集例）';
  if(task==='rename'){d.objects.find(o=>o.name==='購入用CSV').name='購買CSV';d.activities.find(a=>a.name==='購入を準備する').name='購買を準備する';}
  if(task==='review')expected.documents[2].items.find(i=>i.id==='JA-EX-01').reviewState='要確認';
  parsed=parseStrict(after);validate(parsed);
 }else{
  expected=beforeMD;
  if(task==='why')expected=expected.replace('購入の必要性と希望内容を記録し、承認者が購入可否を判断できる状態にするため。','購入の必要性と希望内容を記録し、承認者が購入可否を判断できる状態にするため。（保存形式PoCの編集例）');
  if(task==='rename')expected=expected.replace('# Object 購入用CSV\n','# Object 購買CSV\n').replace('# Activity 購入を準備する\n','# Activity 購買を準備する\n').replace('- 購入用CSV — 購入準備番号','- 購買CSV — 購入準備番号').replace('- 購入を準備する\n','- 購買を準備する\n');
  if(task==='review')expected=expected.replace('### JA-EX-01 — 新しい購入申請が提出済みになる\n\n- 人間レビュー状態：未レビュー','### JA-EX-01 — 新しい購入申請が提出済みになる\n\n- 人間レビュー状態：要確認');
  const result=spawnSync('python',[dir+'validate_md.py',dir+path],{encoding:'utf8',maxBuffer:1024*1024});if(result.status!==0)throw Error(result.stderr);parsed=JSON.parse(result.stdout);validate(parsed);
 }
 const correct=format==='json'?JSON.stringify(parsed)===JSON.stringify(expected):after===expected;
 const cmd=spawnSync('git',['diff','--no-index','--numstat',dir+'edits/before.'+format,dir+path],{encoding:'utf8'});if(cmd.status!==1)throw Error(cmd.stderr);
 const [added,removed]=cmd.stdout.split('\t').slice(0,2).map(Number);
 const patch=spawnSync('git',['diff','--no-index','--no-prefix',dir+'edits/before.'+format,dir+path],{encoding:'utf8'}).stdout.replaceAll(dir,'');
 fs.writeFileSync(dir+'results/edit-'+task+'.'+format+'.patch',patch);
 const idsPreserved=format==='json'&&JSON.stringify([...inventory(parsed).map.keys()])===JSON.stringify([...inventory(beforeJSON).map.keys()]);
 rows.push({task,format,attempt:'explicit retry after atomic batch context rejection',syntaxValid:true,referencesValid:true,goalMatched:correct,unintendedChanges:correct?0:'detected',stableIDs:format==='json'?idsPreserved:'not encoded by source MD',addedLines:added,removedLines:removed,changedLineBytes:patch.split('\n').filter(l=>(l.startsWith('+')&&!l.startsWith('+++'))||(l.startsWith('-')&&!l.startsWith('---'))).reduce((n,l)=>n+Buffer.byteLength(l),0)});
 if(!correct)throw Error('Unexpected edit '+path);
}
fs.writeFileSync(dir+'results/edits.json',JSON.stringify({method:'actual Codex authored patches, not deterministic edits; same session, unblinded; see protocol and first-attempt.json',rows},null,2)+'\n');
console.log(rows);
