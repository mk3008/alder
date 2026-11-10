import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const source='07a732f5d874b75fe89962000728c15cb0fe7131',product=resolve(process.env.PRODUCT_ROOT);
const {preparePreview}=await import(pathToFileURL(product+'/work/361-review-display-cleanup/prepare-preview.mjs'));
const {verifyStructureReviewHypotheses}=await import(pathToFileURL(product+'/web-viewer/web/test-structure-review-hypotheses-browser.mjs'));
const {verifyTabClose}=await import(pathToFileURL(product+'/web-viewer/web/test-tab-close-browser.mjs'));
const expected=await preparePreview(process.env.EXPECTED_DIR),base='https://mk3008.github.io/alder/'+expected.path,hash=bytes=>createHash('sha256').update(bytes).digest('hex');
assert.equal(expected.manifest.source,source);
mkdirSync('web/evidence/review-cleanup',{recursive:true});
const response=await fetch(base+'preview-manifest.json',{cache:'no-store',signal:AbortSignal.timeout(15000)});
const manifestBytes=Buffer.from(await response.arrayBuffer());
const probe={source,base,manifestStatus:response.status,actualSha256:hash(manifestBytes),expectedSha256:hash(readFileSync(expected.dest+'/preview-manifest.json'))};writeFileSync('web/evidence/review-cleanup/public-probe.json',JSON.stringify(probe,null,2)+'\n');console.log(JSON.stringify({publicProbe:probe}));assert.equal(response.status,200);assert.equal(hash(manifestBytes),hash(readFileSync(expected.dest+'/preview-manifest.json')));
const files=[];
for(const [file,digest]of Object.entries(expected.manifest.files)){const r=await fetch(base+file,{cache:'no-store',signal:AbortSignal.timeout(15000)});assert.equal(r.status,200,file);const actual=hash(Buffer.from(await r.arrayBuffer()));assert.equal(actual,digest,file);files.push({file,status:r.status,sha256:actual});}
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE),browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome'});
try{
 const display=await verifyStructureReviewHypotheses(browser,{base,published:true}),tabs=await verifyTabClose(browser,{base});
 const result={source,base,manifestSha256:hash(manifestBytes),files,display,tabs,humanGuiReview:'not-performed',meaningApproval:'not-evaluated'};
 mkdirSync('web/evidence/review-cleanup',{recursive:true});writeFileSync('web/evidence/review-cleanup/published-results.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{await browser.close();}
