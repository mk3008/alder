import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {packageViewerPreview} from '../../tools/viewer-preview.mjs';
export async function verifyJSONOfflinePreview(browser){
 const raw=readFileSync('../work/plugin-json/issue-273/snapshots/04-final-after-replay.json','utf8'),pkg=JSON.parse(raw),head=process.env.REVIEW_HEAD??execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),pr=process.env.REVIEW_PR??'279';
 const {offline,manifest}=packageViewerPreview({dist:resolve('dist'),output:resolve('review-package'),head,pr,fixture:resolve('../work/plugin-json/issue-273/snapshots/04-final-after-replay.json')});
 const context=await browser.newContext({viewport:{width:393,height:960}}),page=await context.newPage(),requests=[],errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});
 try{
  await page.goto(pathToFileURL(offline).href);await page.waitForFunction(()=>!document.querySelector('#open').disabled);assert.ok((await page.locator('#preview-badge').innerText()).includes(head));
  await page.locator('#fallback').setInputFiles({name:'gate-b.json',mimeType:'application/json',buffer:Buffer.from(raw)});await page.locator('.node').first().waitFor();await page.waitForFunction(()=>document.querySelector('#app')?.dataset.saveState==='saved');assert.equal(await page.locator('.node').count(),6);
  await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);assert.equal(await page.locator('.node').count(),6);
  const databases=await page.evaluate(()=>indexedDB.databases());assert.ok(databases.some(d=>d.name===`alder-web-viewer:preview:pr-${pr}:${head}`));assert.ok(!databases.some(d=>d.name==='alder-web-viewer'));
  if(await page.locator('#design-explorer').isVisible())await page.locator('#design-explorer .shell-heading button').click();await page.locator(`.node[data-node="${pkg.documents[0].activities[0].id}"]`).click();if(!await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();await page.locator('#detail-mode-checks').click();assert.ok((await page.locator('.json-checks').innerText()).includes('意味対応は未確認'));
  mkdirSync('web/evidence/json-document',{recursive:true});await page.screenshot({path:'web/evidence/json-document/offline-preview-393.png'});
  const unified=readFileSync('../work/concept-review/issue-133/versions/purchase-v3-beta.json');
  await page.locator('#fallback').setInputFiles({name:'unified.json',mimeType:'application/json',buffer:unified});
  if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();
  await page.locator('[data-explorer-key="concept:overview"]').click();
  const frame=page.frameLocator('iframe[data-concept-view="overview"]');await frame.locator('[data-node="request"]').waitFor();
  await frame.locator('[data-concept-open="request"]').click();const detail=page.frameLocator('iframe[data-concept-view="request"]');
  await detail.locator('[data-node="request"]').waitFor();assert.equal(await detail.locator('[data-node="request"] [data-concept-open="request"]').count(),0);
  await page.waitForFunction(()=>['saved','unchanged'].includes(document.querySelector('#app')?.dataset.saveState));await page.reload();
  await page.waitForFunction(()=>!document.querySelector('#open').disabled);await detail.locator('[data-node="request"]').waitFor();
  assert.deepEqual(requests,[]);assert.deepEqual(errors,[]);
  return {browser:browser.version(),source:head,offlinePath:manifest.offlinePath,fileProtocol:true,reload:true,unifiedConcept:true,previewOnlyIndexedDB:true,networkRequests:requests,pageErrors:errors,limits:['Physical smartphone/file manager and OS picker permissions are not emulated','HTTPS reads from file origin require Origin:null CORS permission']};
 }catch(error){
  const frame=await page.locator('iframe[data-concept-view="overview"]').evaluate(el=>{try{return {srcdoc:el.getAttribute('srcdoc')?.length??0,origin:el.contentWindow.location.origin,parentOrigin:el.ownerDocument.location.origin,body:el.contentDocument?.body?.textContent?.slice(0,200)};}catch(e){return {error:String(e)};}}).catch(()=>null);
  console.log('OFFLINE_CONCEPT_DIAGNOSTIC '+JSON.stringify({frame,pageErrors:errors,requests}));throw error;
 }finally{await context.close();}
}
