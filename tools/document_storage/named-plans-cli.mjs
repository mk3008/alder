#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
import {parseStrict,stringify,demand} from './core.mjs';
import {fingerprint,guardAuthoring} from './authoring.mjs';
import {validateNamedPlans,selectNamedPlan} from './named-plans.mjs';

export async function run(args){
 let temp,lock,ownsLock=false;
 const read=file=>parseStrict(fs.readFileSync(file,'utf8'));
 const stage=(target,text)=>{
  temp=path.join(path.dirname(path.resolve(target)),'.alder-plans-'+randomUUID());
  const fd=fs.openSync(temp,'wx',0o600);
  try{fs.writeFileSync(fd,text,'utf8');fs.fsyncSync(fd);}finally{fs.closeSync(fd);}
 };
 try{
  demand(Number(process.versions.node.split('.')[0])>=24,'Node 24+ required');
  const [command,...rest]=args;
  if(command==='inspect'){
   demand(rest.length===1,'inspect plans.json');
   const text=fs.readFileSync(rest[0],'utf8'),bundle=parseStrict(text),result=validateNamedPlans(bundle);
   console.log(JSON.stringify({...result,sha256:fingerprint(text),plans:bundle.plans.map(({id,name,package:pkg})=>({id,name,revision:pkg.revision}))}));return 0;
  }
  if(command==='create'){
   demand(rest.length>=4&&(rest.length-1)%3===0,'create output.json plan-id name source.json [plan-id name source.json ...]');
   const [target,...entries]=rest,plans=[];
   for(let i=0;i<entries.length;i+=3){const [id,name,source]=entries.slice(i,i+3);demand(path.resolve(source)!==path.resolve(target),'Source must be separate from output');plans.push({id,name,package:read(source)});}
   const bundle={format:'alder-named-plans',formatVersion:'1.0',plans};validateNamedPlans(bundle);
   stage(target,stringify(bundle));validateNamedPlans(read(temp));fs.linkSync(temp,target);
   console.log(JSON.stringify({target,sha256:fingerprint(fs.readFileSync(target,'utf8')),approval:'not-evaluated'}));return 0;
  }
  if(command==='extract'){
   demand(rest.length===3,'extract plans.json plan-id output.json');const [source,id,target]=rest;
   demand(path.resolve(source)!==path.resolve(target),'Source must be separate from output');
   const plan=selectNamedPlan(read(source),id);stage(target,stringify(plan.package));fs.linkSync(temp,target);
   console.log(JSON.stringify({target,plan:id,approval:'not-evaluated'}));return 0;
  }
  if(command==='commit'){
   demand(rest.length===4,'commit plans.json plan-id candidate.json operation.json');const [target,id,candidate,opfile]=rest;
   demand(path.resolve(target)!==path.resolve(candidate),'Candidate must be separate from target');
   const stat=fs.lstatSync(target);demand(stat.isFile()&&!stat.isSymbolicLink()&&stat.nlink===1,'Target must be an unlinked regular JSON file');
   lock=target+'.alder-lock';const fd=fs.openSync(lock,'wx',0o600);ownsLock=true;fs.closeSync(fd);
   const current=fs.readFileSync(target,'utf8'),bundle=parseStrict(current),operation=read(opfile),next=read(candidate);
   demand(operation.expectedSha256===fingerprint(current),'File content conflict');
   const previous=selectNamedPlan(bundle,id).package;
   const result=guardAuthoring(previous,next,operation);
   const updated=structuredClone(bundle);updated.plans.find(p=>p.id===id).package=next;validateNamedPlans(updated);
   stage(target,stringify(updated));validateNamedPlans(read(temp));
   demand(fingerprint(fs.readFileSync(target,'utf8'))===operation.expectedSha256,'File changed while preparing save');
   fs.renameSync(temp,target);temp=null;
   console.log(JSON.stringify({target,plan:id,sha256:fingerprint(fs.readFileSync(target,'utf8')),...result}));return 0;
  }
  throw Error('Usage: named-plans-cli.mjs create | inspect | extract | commit');
 }catch(error){console.error(JSON.stringify({diagnostics:[{code:'NAMED_PLANS_OPERATION',message:error.message}]}));return 2;}
 finally{for(const file of [temp,ownsLock?lock:null])if(file)try{fs.unlinkSync(file);}catch(error){if(error.code!=='ENOENT')console.error(JSON.stringify({code:'CLEANUP_WARNING',message:error.message}));}}
}
if(path.resolve(process.argv[1]??'')===fileURLToPath(import.meta.url))process.exitCode=await run(process.argv.slice(2));
