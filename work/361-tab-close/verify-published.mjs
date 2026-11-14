// Run on the normal GitHub Actions published-check path after Pages succeeds.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {preparePreview} from '../361-copy-separation/prepare-preview.mjs';
import {verifyTabClose} from '../../web-viewer/web/test-tab-close-browser.mjs';
const expected=preparePreview(process.env.EXPECTED_DIR),base='https://mk3008.github.io/alder/'+expected.path;
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const response=await fetch(base+'preview-manifest.json',{cache:'no-store',signal:AbortSignal.timeout(15000)});
assert.equal(response.status,200);const manifestBytes=Buffer.from(await response.arrayBuffer());
assert.equal(hash(manifestBytes),hash(readFileSync(expected.dest+'/preview-manifest.json')));
for(const [file,digest] of Object.entries(expected.manifest.files)){
 const asset=await fetch(base+file,{cache:'no-store',signal:AbortSignal.timeout(15000)});assert.equal(asset.status,200,file);assert.equal(hash(Buffer.from(await asset.arrayBuffer())),digest,file);
}
const {chromium}=createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE),browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome'});
const out='web/evidence/tab-close';mkdirSync(out,{recursive:true});const live=[];
try{
 for(const width of [1280,393]){
  const context=await browser.newContext({viewport:{width,height:960}}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'?preview=1&view=concept&concept=structure-explorer#source='+encodeURIComponent(base+'examples/json-complete-concept-review.json'));
  await page.locator('.structure-detail-page:not([hidden]) .structure-attribute-table').waitFor({timeout:45000});
  assert.equal(await page.locator('.structure-pending').first().textContent(),'null許容が未決：47項目（互換・移行用を含む）');
  assert.ok((await page.locator('#preview-badge').textContent()).includes(expected.manifest.source.slice(0,8)));
  if(width===393&&await page.locator('#design-explorer').isVisible())await page.locator('#design-explorer .shell-heading button').click();
  const close=page.locator('.shell-open-tabs .tab.active .close'),count=await page.locator('.shell-open-tabs .tab:not([hidden])').count();
  await close.hover();await page.screenshot({path:`${out}/published-structure-${width}.png`});
  await close.click({position:{x:2,y:2}});await page.waitForFunction(n=>document.querySelectorAll('.shell-open-tabs .tab:not([hidden])').length===n,count-1);
  assert.deepEqual(errors,[]);live.push({width,source:expected.manifest.source,undecided:47,close:true,pageErrors:errors});await context.close();
 }
 const interaction=await verifyTabClose(browser,{base});
 const result={base,source:expected.manifest.source,manifestSha256:hash(manifestBytes),files:Object.keys(expected.manifest.files).length,live,interaction};
 writeFileSync(out+'/published-results.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{await browser.close();}
