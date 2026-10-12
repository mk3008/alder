import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
export async function verifyDocumentOrder(browser){
 const page=await browser.newPage({viewport:{width:1280,height:960}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const raw=readFileSync('../business-design/alder/README.md','utf8'),order=raw.split('\n').filter(l=>l.startsWith('# Activity ')).map(l=>l.slice(11));
 const positions=()=>page.locator('.node').evaluateAll(ns=>Object.fromEntries(ns.map(n=>[n.dataset.node,[parseFloat(n.style.left),parseFloat(n.style.top)]])));
 try{
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('#open-sample').click();await page.locator('#drawer').click();
  const initial=await positions();assert.ok(initial['業務設計書'][0]<initial['同期漏れ検査'][0]);assert.ok(Math.max(...Object.values(initial).map(p=>p[0]))>4000);
  for(const width of [320,393,1280]){await page.setViewportSize({width,height:960});assert.deepEqual(await positions(),initial,'viewport does not change initial layout');}
  const boxes=await page.locator('.node').evaluateAll(ns=>ns.map(n=>{const b=n.getBoundingClientRect();return {x:b.x,y:b.y,w:b.width,h:b.height};}));
  for(let i=0;i<boxes.length;i++)for(let j=0;j<i;j++){const a=boxes[i],b=boxes[j];assert.ok(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y);}
  const extent=await page.locator('#edges').evaluate(svg=>{const b=svg.getBBox();return {width:parseFloat(svg.style.width),height:parseFloat(svg.style.height),right:b.x+b.width,bottom:b.y+b.height};});assert.ok(extent.width>=extent.right&&extent.height>=extent.bottom);
  for(const path of await page.locator('.edge').evaluateAll(ns=>ns.map(n=>n.getAttribute('d')))){assert.match(path,/ Q/);assert.doesNotMatch(path,/[LHV]/);}
  await page.locator('#scope-outside').selectOption('hide');assert.equal(await page.locator('.node.outside').count(),0);await page.locator('#scope-outside').selectOption('show');await page.locator('#prefer-write').check();assert.equal(await page.locator('.node').count(),25);assert.deepEqual(await positions(),initial);
  await page.locator('.close').click();await page.locator('.tab').waitFor({state:'detached'});await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('#open-sample').click();assert.deepEqual(await positions(),initial);
  // A new input follows the new section order; editing the same input keeps its layout.
  const sections=raw.split(/(?=^# (?:Activity|Object|Scope|Graph exceptions) )/m),reversed=sections.filter(s=>s.startsWith('# Activity ')).reverse();let next=0;
  const flipped=sections.map(s=>s.startsWith('# Activity ')?reversed[next++]:s).join('');
  await page.locator('#open-text').click();await page.locator('#source-text').fill(flipped);await page.locator('#source-submit').click();const reversedPositions=await positions();assert.notDeepEqual(reversedPositions,initial);
  await page.locator('#refresh').click();await page.locator('#source-text').fill(raw);await page.locator('#source-submit').click();assert.deepEqual(await positions(),reversedPositions);
  assert.deepEqual(errors,[]);return {activities:order,knownOrderExceptions:'Cycles use document order only as display hint; return arrows keep original endpoints',checks:'directed sample geometry; viewport independent320/393/1280; no card overlap; curve/label extent; all curves; Scope/Write preserve positions; close/reload/reopen exact layout; new input uses reversed order; editing retains saved positions',pageErrors:errors};
 }finally{await page.close();}
}
