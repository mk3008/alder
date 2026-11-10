import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {preparePreview} from './prepare-preview.mjs';
import {verifyStructureReviewHypotheses} from '../../web-viewer/web/test-structure-review-hypotheses-browser.mjs';
import {verifyTabClose} from '../../web-viewer/web/test-tab-close-browser.mjs';
const expected=preparePreview(process.env.EXPECTED_DIR),base='https://mk3008.github.io/alder/'+expected.path,hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const manifestResponse=await fetch(base+'preview-manifest.json',{cache:'no-store',signal:AbortSignal.timeout(15000)});assert.equal(manifestResponse.status,200);
const manifestBytes=Buffer.from(await manifestResponse.arrayBuffer());assert.equal(hash(manifestBytes),hash(readFileSync(expected.dest+'/preview-manifest.json')));
for(const [file,digest]of Object.entries(expected.manifest.files)){const response=await fetch(base+file,{cache:'no-store',signal:AbortSignal.timeout(15000)});assert.equal(response.status,200,file);assert.equal(hash(Buffer.from(await response.arrayBuffer())),digest,file);}
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE),browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome'});
try{
 const hypotheses=await verifyStructureReviewHypotheses(browser,{base,published:true}),tabs=await verifyTabClose(browser,{base});
 const result={source:expected.manifest.source,base,manifestSha256:hash(manifestBytes),files:Object.keys(expected.manifest.files).length,hypotheses,tabs,humanGuiReview:'not-performed'};
 mkdirSync('web/evidence/review-hypotheses',{recursive:true});writeFileSync('web/evidence/review-hypotheses/published-results.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{await browser.close();}
