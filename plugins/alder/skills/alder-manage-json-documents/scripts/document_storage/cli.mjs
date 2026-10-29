#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
import {parseStrict,validate,stringify} from './core.mjs';
// All inputs are read and validated before a new output is exclusively committed.
export async function run(args){
 let temp;
 try{
  if(!((args[0]==='convert'&&args.length===3)||(args[0]==='validate'&&args.length===2)))throw Error('Usage: node cli.mjs convert request.json output.json | validate package.json');
  const [command,input,output]=args;
  if(command==='validate'){const pkg=parseStrict(fs.readFileSync(input,'utf8'));const r=validate(['0.4','0.5'].includes(pkg.formatVersion)?pkg:(await import('./legacy-json.mjs')).readLegacyPackage(pkg));process.stdout.write(JSON.stringify({valid:true,...r})+'\n');return 0;}
  const request=parseStrict(fs.readFileSync(input,'utf8')),base=path.dirname(path.resolve(input));
  if(!Array.isArray(request.sources))throw Error('Sources required');
  request.sources=request.sources.map(s=>{if(typeof s.path!=='string'||Object.hasOwn(s,'text'))throw Error('Source path required; inline text belongs to API');const {path:p,...meta}=s;return {...meta,text:fs.readFileSync(path.resolve(base,p),'utf8')};});
  if(request.previousPackagePath){if(Object.hasOwn(request,'previousPackage'))throw Error('Choose previousPackagePath only');request.previousPackage=parseStrict(fs.readFileSync(path.resolve(base,request.previousPackagePath),'utf8'));delete request.previousPackagePath;}
  const {convertMarkdown}=await import('./convert.mjs');
  const result=convertMarkdown(request),text=stringify(result.package);
  // New-only output prevents source, hardlink, symlink and unrelated-file overwrites.
  if(fs.existsSync(output)||fs.lstatSync(path.dirname(path.resolve(output))).isSymbolicLink())throw Error('Output must be a new file in an existing directory');
  temp=path.join(path.dirname(path.resolve(output)),'.alder-storage-'+randomUUID());
  fs.writeFileSync(temp,text,{flag:'wx',mode:0o600});
  fs.linkSync(temp,output);
  process.stdout.write(JSON.stringify({output,diagnostics:result.diagnostics,approval:result.approval})+'\n');return 0;
 }catch(e){process.stderr.write(JSON.stringify({diagnostics:e.diagnostics??[{code:'CLI_ERROR',severity:'error',message:e.message}]})+'\n');return 2;}
 finally{if(temp)try{fs.unlinkSync(temp);}catch(e){if(e.code!=='ENOENT')process.stderr.write(JSON.stringify({code:'TEMP_CLEANUP_WARNING',message:e.message})+'\n');}}
}
if(path.resolve(process.argv[1]??'')===fileURLToPath(import.meta.url))process.exitCode=await run(process.argv.slice(2));
