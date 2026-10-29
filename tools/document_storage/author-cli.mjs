#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {parseStrict,validate,stringify,demand} from './core.mjs';
import {upgradeRoles} from './roles.mjs';
import {guardAuthoring,fingerprint,meaningHash} from './authoring.mjs';
export async function run(args){
 let temp,lock,ownsLock=false;
 try{
  demand(Number(process.versions.node.split('.')[0])>=24,'Node 24+ required');const [command,...rest]=args;
  if(command==='runtime'){
   demand(!rest.length,'runtime takes no arguments');const p=spawnSync(process.env.ALDER_PYTHON||'python3',['-c','import sys,json;print(json.dumps(list(sys.version_info[:3])))'],{encoding:'utf8'});let version=null;try{version=JSON.parse(p.stdout);}catch{}
   console.log(JSON.stringify({node:process.version,directJSON:true,python:version,markdownConversion:!!version&&(version[0]>3||version[0]===3&&version[1]>=12)}));return 0;
  }
  if(['prepare-role-upgrade','prepare-exception-upgrade','prepare-structure-upgrade'].includes(command)){
   demand(rest.length===3,command+' source.json new-candidate.json request.json');const [source,output,request]=rest;
   demand(path.resolve(source)!==path.resolve(output),'Migration must preserve the source');const previous=parseStrict(fs.readFileSync(source,'utf8')),next=(command==='prepare-structure-upgrade'?(await import('./structured.mjs')).upgradeStructure:command==='prepare-exception-upgrade'?(await import('./legacy-json.mjs')).upgradeExceptions:upgradeRoles)(previous,parseStrict(fs.readFileSync(request,'utf8'))),text=stringify(next);
   if(!['0.4','0.5'].includes(previous.formatVersion))(await import('./legacy-json.mjs')).readLegacyPackage(previous);
   temp=path.join(path.dirname(path.resolve(output)),'.alder-json-'+randomUUID());const fd=fs.openSync(temp,'wx',0o600);try{fs.writeFileSync(fd,text,'utf8');fs.fsyncSync(fd);}finally{fs.closeSync(fd);}validate(parseStrict(fs.readFileSync(temp,'utf8')));fs.linkSync(temp,output);
   console.log(JSON.stringify({candidate:output,approval:'not-evaluated',revision:next.revision,diagnostics:validate(next).diagnostics}));return 0;
  }
  if(command==='ids'){const n=Number(rest[0]);demand(rest.length===1&&Number.isInteger(n)&&n>0&&n<=100,'ids expects 1..100');console.log(JSON.stringify(Array.from({length:n},()=>randomUUID())));return 0;}
  if(command==='inspect'){
   demand(rest.length===1,'inspect package.json');const text=fs.readFileSync(rest[0],'utf8'),pkg=parseStrict(text);validate(['0.4','0.5'].includes(pkg.formatVersion)?pkg:(await import('./legacy-json.mjs')).readLegacyPackage(pkg));
   console.log(JSON.stringify({sha256:fingerprint(text),revision:pkg.revision,documents:pkg.documents.map(d=>({id:d.id,kind:d.kind,revision:d.revision})),checks:pkg.documents.flatMap(d=>(d.items??[]).map(i=>({id:i.id,checkId:i.checkId,reviewState:i.reviewState,meaningSha256:meaningHash(pkg,i)})))}));return 0;
  }
  demand(['create','commit'].includes(command)&&rest.length===3,'Usage: create candidate.json target.json operation.json | commit target.json candidate.json operation.json | inspect package.json | ids N | runtime');
  const [a,b,op]=rest,target=path.resolve(command==='create'?b:a),candidate=path.resolve(command==='create'?a:b);
  demand(candidate!==target,'Candidate must be separate from target');const operation=parseStrict(fs.readFileSync(op,'utf8')),next=parseStrict(fs.readFileSync(candidate,'utf8'));
  let previous=null;
  if(command==='commit'){
   const stat=fs.lstatSync(target);demand(stat.isFile()&&!stat.isSymbolicLink()&&stat.nlink===1,'Target must be an unlinked regular JSON file');
   lock=target+'.alder-lock';const fd=fs.openSync(lock,'wx',0o600);ownsLock=true;fs.closeSync(fd);
   const current=fs.readFileSync(target,'utf8');demand(operation.expectedSha256===fingerprint(current),'File content conflict');previous=parseStrict(current);
  }
  for(const pkg of [previous,next].filter(Boolean))if(!['0.4','0.5'].includes(pkg.formatVersion))(await import('./legacy-json.mjs')).readLegacyPackage(pkg);
  const result=guardAuthoring(previous,next,operation),text=stringify(next);
  temp=path.join(path.dirname(target),'.alder-json-'+randomUUID());const fd=fs.openSync(temp,'wx',0o600);try{fs.writeFileSync(fd,text,'utf8');fs.fsyncSync(fd);}finally{fs.closeSync(fd);}
  validate(parseStrict(fs.readFileSync(temp,'utf8')));
  if(command==='create')fs.linkSync(temp,target);
  else{demand(fingerprint(fs.readFileSync(target,'utf8'))===operation.expectedSha256,'File changed while preparing save');fs.renameSync(temp,target);temp=null;}
  console.log(JSON.stringify({target,sha256:fingerprint(fs.readFileSync(target,'utf8')),...result}));return 0;
 }catch(e){console.error(JSON.stringify({diagnostics:e.diagnostics??[{code:'JSON_OPERATION',message:e.message}]}));return 2;}
 finally{for(const f of [temp,ownsLock?lock:null])if(f)try{fs.unlinkSync(f);}catch(e){if(e.code!=='ENOENT')console.error(JSON.stringify({code:'CLEANUP_WARNING',message:e.message}));}}
}
if(path.resolve(process.argv[1]??'')===fileURLToPath(import.meta.url))process.exitCode=await run(process.argv.slice(2));
