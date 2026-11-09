import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {preparePreview} from '../../work/361-beta-fixes/prepare-preview.mjs';
import {verifyStructureBetaFixes} from './test-structure-beta-browser.mjs';
const expected=preparePreview(process.env.EXPECTED_DIR),base='https://mk3008.github.io/alder/'+expected.path;
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const bytes=readFileSync(expected.dest+'/preview-manifest.json');let last;
for(let attempt=1;attempt<=36;attempt++){
 try{
  const response=await fetch(base+'preview-manifest.json',{cache:'no-store',signal:AbortSignal.timeout(15000)});assert.equal(response.status,200);
  assert.equal(hash(Buffer.from(await response.arrayBuffer())),hash(bytes),'manifest matches the independently rebuilt fixed commit');last=undefined;break;
 }catch(error){last=error;console.log(JSON.stringify({attempt,error:error.message}));if(attempt<36)await new Promise(resolve=>setTimeout(resolve,5000));}
}
if(last)throw last;
for(const [file,digest]of Object.entries(expected.manifest.files)){
 const response=await fetch(base+file,{cache:'no-store',signal:AbortSignal.timeout(15000)});assert.equal(response.status,200,file);assert.equal(hash(Buffer.from(await response.arrayBuffer())),digest,file);
}
const require=createRequire(import.meta.url),{chromium}=require(process.env.PLAYWRIGHT_MODULE);
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',headless:true});
const out=process.env.EVIDENCE_DIR;mkdirSync(out,{recursive:true});
try{console.log(JSON.stringify({manifestSha256:hash(bytes),files:Object.keys(expected.manifest.files).length,...await verifyStructureBetaFixes(browser,{base,published:true,out})}));}finally{await browser.close();}
