import {openDisplaySettings} from './toolbar-settings-control.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseDesign} from '../src/graph.ts';
export async function verifyScopeShortcut(browser){
 const page=await browser.newPage({viewport:{width:1280,height:960}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const outside=parseDesign(readFileSync('../business-design/alder/README.md','utf8')).graph.nodes.filter(n=>!n.scope),n=outside[0];
 async function state(expected){const actual=await page.locator('#show-outside').evaluate(e=>({checked:e.checked,mixed:e.indeterminate,aria:e.getAttribute('aria-checked')}));assert.deepEqual(actual,{checked:expected==='true',mixed:expected==='mixed',aria:expected});assert.equal(await page.locator('#scope-outside').getAttribute('aria-pressed'),expected);}
 try{
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);assert.equal(await page.locator('#show-outside').isDisabled(),true);await page.locator('#open-sample').click();await page.waitForFunction(()=>document.querySelectorAll('.node').length>0);await page.locator('#drawer').click();await state('true');
  for(const width of [320,393,1280]){await page.setViewportSize({width,height:960});await openDisplaySettings(page);await page.locator('#show-outside').uncheck();await state('false');assert.equal(await page.locator('.node.outside').count(),0);await openDisplaySettings(page);await page.locator('#show-outside').check();await state('true');assert.equal(await page.locator('.node.outside').count(),outside.length);}
  await page.locator('#node-list-toggle').click();await page.locator(`[data-category="${n.type==='business'?'activity':'object'}"]`).click();await page.getByRole('button',{name:n.name+'を非表示',exact:true}).click();await state('mixed');await page.locator('#node-list-close').click();await openDisplaySettings(page);await page.locator('#show-outside').click();await state('true');assert.equal(await page.locator('.node.outside').count(),outside.length);
  await page.locator('#node-list-toggle').click();await page.locator('#scope-outside').click();await state('false');await page.locator('#node-list-close').click();await openDisplaySettings(page);await page.locator('#show-outside').click();await state('true');assert.deepEqual(errors,[]);return {checks:'toolbar Scope at320/393/1280; drawer and toolbar share checked/mixed/unchecked state; individual hide reflected; mixed click shows all',pageErrors:errors};
 }finally{await page.close();}
}
