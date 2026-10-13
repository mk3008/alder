import {setScope} from './scope-control.mjs';
import assert from 'node:assert/strict';
export async function verifyPreviewIsolation(browser){
 const context=await browser.newContext({viewport:{width:393,height:852}}),errors=[],origin='http://127.0.0.1:4173',a='/preview/pr-194/stairs-20261012-01/',b='/preview/pr-194/second/';
 // Mount the same built bytes at nested URLs. Production deployment is verified separately.
 await context.route('**/preview/pr-194/**',async route=>{const u=new URL(route.request().url()),path=u.pathname.replace(/^\/preview\/pr-194\/[^/]+\//,'/');await route.fulfill({response:await route.fetch({url:origin+path+u.search})});});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 const ready=async path=>{await page.goto(origin+path);await page.waitForFunction(()=>!document.querySelector('#open').disabled);};
 const saved=()=>page.evaluate(()=>new Promise((resolve,reject)=>{const r=indexedDB.open('alder-web-viewer',1);r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,g=db.transaction('session').objectStore('session').get('current');g.onsuccess=()=>{db.close();resolve(g.result);};};}));
 try{
  await ready('/');assert.equal(await page.locator('#preview-badge').isVisible(),false);await page.locator('#open-sample').click();await page.waitForFunction(()=>document.querySelectorAll('.node').length>0);await page.locator('#drawer').click();await page.waitForTimeout(300);const production=await saved();
  await ready(a);assert.equal(await page.locator('.tab').count(),0);assert.equal(await page.locator('#preview-badge').textContent(),'確認用 · stairs-20261012-01');
  for(const width of [393,320]){await page.setViewportSize({width,height:852});const badge=await page.locator('#preview-badge').boundingBox();assert.ok(badge.x>=0&&badge.x+badge.width<=width&&badge.y>=0&&badge.y+badge.height<=64);}
  await page.locator('#open-sample').click();await page.waitForFunction(()=>document.querySelectorAll('.node').length>0);await page.locator('#drawer').click();await setScope(page,'hide');await page.locator('#theme').click();await page.waitForTimeout(300);
  assert.deepEqual(await saved(),production);
  await ready(a+'index.html?mode=test#ignored');assert.equal(await page.locator('.node').count(),12);assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  await ready(b);assert.equal(await page.locator('.tab').count(),0);await page.locator('#open-sample').click();await page.waitForFunction(()=>document.querySelectorAll('.node').length>0);await page.locator('#drawer').click();await page.locator('#prefer-write').check();await page.waitForTimeout(300);
  const root=await context.newPage();await root.goto(origin+'/');await root.waitForFunction(()=>!document.querySelector('#open').disabled);assert.equal(await root.locator('.node').count(),25);assert.equal(await root.locator('.edge').count(),63);assert.equal(await root.locator('html').getAttribute('data-theme'),'light');assert.equal(await root.locator('#preview-badge').isVisible(),false);await root.close();
  await ready('/');assert.deepEqual(await saved(),production);assert.equal(await page.locator('#scope-outside').getAttribute('aria-pressed'),'true');assert.equal(await page.locator('.edge').count(),63);
  await ready(a+'?new=value#another');assert.equal(await page.locator('.node').count(),12);assert.equal(await page.locator('#prefer-write').isChecked(),false);
  assert.deepEqual(errors,[]);return {checks:'same built bytes at root/two nested preview paths; production existing session unchanged; no import; same/different-tab navigation; preview reload/query/hash/index; 320/393px badge; independent version data',pageErrors:errors,limit:'nested static mount modeled in browser routing; public deployment checked separately'};
 }finally{await context.close();}
}
