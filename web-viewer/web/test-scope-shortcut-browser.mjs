import {useUngroupedSample} from './legacy-sample-browser.mjs';
import {openDisplaySettings,closeCanvasOverlays} from './toolbar-settings-control.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseDesign} from '../src/graph.ts';
export async function verifyScopeShortcut(browser){
 const page=await browser.newPage({viewport:{width:1280,height:960}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const outside=parseDesign(readFileSync('../business-design/alder/README.md','utf8')).graph.nodes.filter(n=>!n.scope),n=outside[0];
 async function state(expected){const actual=await page.locator('#show-outside').evaluate(e=>({checked:e.checked,mixed:e.indeterminate,aria:e.getAttribute('aria-checked')}));assert.deepEqual(actual,{checked:expected==='true',mixed:expected==='mixed',aria:expected});assert.equal(await page.locator('#scope-outside').getAttribute('aria-pressed'),expected);}
 try{
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);assert.equal(await page.locator('#show-outside').isDisabled(),true);await page.locator('#open-sample').click();await useUngroupedSample(page);await page.waitForFunction(()=>document.querySelectorAll('.node').length>0);await page.locator('#drawer').click();await state('true');
  for(const width of [320,393,1280]){await page.setViewportSize({width,height:960});await closeCanvasOverlays(page);await openDisplaySettings(page);await page.locator('#show-outside').uncheck();await state('false');assert.equal(await page.locator('.node.outside').count(),0);await openDisplaySettings(page);await page.locator('#show-outside').check();await state('true');assert.equal(await page.locator('.node.outside').count(),outside.length);}
  await page.waitForFunction(()=>['saved','unchanged'].includes(document.querySelector('#app')?.dataset.saveState));await page.goto('http://127.0.0.1:4173/LICENSE.txt');
  await page.evaluate(id=>new Promise((resolve,reject)=>{const r=indexedDB.open('alder-web-viewer',1);r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,tx=db.transaction('session','readwrite'),store=tx.objectStore('session'),q=store.get('current');q.onsuccess=()=>{const value=q.result;value.views[0].hiddenNodes=[id];store.put(value,'current');};tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>reject(tx.error);};}),n.id);
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);await state('mixed');assert.equal(await page.locator('.node.outside').count(),outside.length-1);await openDisplaySettings(page);await page.locator('#show-outside').click();await state('true');assert.equal(await page.locator('.node.outside').count(),outside.length);
  assert.equal(await page.locator('.node-eye').count(),0);assert.deepEqual(errors,[]);return {checks:'toolbar Scope at 320/393/1280; legacy stored partial visibility remains mixed; mixed click shows all; no individual eye',pageErrors:errors};
 }finally{await page.close();}
}
