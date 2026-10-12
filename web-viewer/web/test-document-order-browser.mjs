import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
export async function verifyDocumentOrder(browser){
 const page=await browser.newPage({viewport:{width:1280,height:960}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const raw=readFileSync('../business-design/alder/README.md','utf8'),order=raw.split('\n').filter(l=>l.startsWith('# Activity ')).map(l=>l.slice(11));
 const positions=()=>page.locator('.node').evaluateAll(ns=>Object.fromEntries(ns.map(n=>[n.dataset.node,[parseFloat(n.style.left),parseFloat(n.style.top)]])));
 const checkOrder=async(expected,maxBackwards)=>{const p=await positions();const backwards=expected.reduce((sum,id,i)=>sum+expected.slice(i+1).filter(other=>p[other][1]<p[id][1]).length,0);assert.ok(backwards<=maxBackwards);assert.ok(p[expected[0]][1]<p[expected.at(-1)][1]);return p;};
 try{
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('#open-sample').click();await page.locator('#drawer').click();
  const initial=await checkOrder(order,1);assert.deepEqual(initial,JSON.parse(readFileSync('web/evidence/document-order-20261012/sample-layout.json','utf8')));
  const boxes=await page.locator('.node').evaluateAll(ns=>ns.map(n=>{const b=n.getBoundingClientRect();return {x:b.x,y:b.y,w:b.width,h:b.height};}));
  for(let i=0;i<boxes.length;i++)for(let j=0;j<i;j++){const a=boxes[i],b=boxes[j];assert.ok(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y);}
  const extent=await page.locator('#edges').evaluate(svg=>{const b=svg.getBBox();return {width:parseFloat(svg.style.width),height:parseFloat(svg.style.height),right:b.x+b.width,bottom:b.y+b.height};});assert.ok(extent.width>=extent.right&&extent.height>=extent.bottom);
  for(const path of await page.locator('.edge').evaluateAll(ns=>ns.map(n=>n.getAttribute('d')))){assert.match(path,/ Q/);assert.doesNotMatch(path,/[LHV]/);}
  await page.locator('#dim-outside').check();await page.locator('#prefer-write').check();assert.equal(await page.locator('.node').count(),25);assert.deepEqual(await positions(),initial);
  await page.locator('.close').click();await page.locator('.tab').waitFor({state:'detached'});await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('#open-sample').click();assert.deepEqual(await positions(),initial);
  // A new input follows the new section order; editing the same input keeps its layout.
  const sections=raw.split(/(?=^# (?:Activity|Object|Scope|Graph exceptions) )/m),reversed=sections.filter(s=>s.startsWith('# Activity ')).reverse();let next=0;
  const flipped=sections.map(s=>s.startsWith('# Activity ')?reversed[next++]:s).join('');
  await page.locator('#open-text').click();await page.locator('#source-text').fill(flipped);await page.locator('#source-submit').click();const reversedPositions=await checkOrder([...order].reverse(),0);assert.notDeepEqual(reversedPositions,initial);
  await page.locator('#refresh').click();await page.locator('#source-text').fill(raw);await page.locator('#source-submit').click();assert.deepEqual(await positions(),reversedPositions);
  assert.deepEqual(errors,[]);return {activities:order,knownOrderExceptions:'製品検証 sits one row below the following 検証結果の統合; same-row Activities may be horizontally reordered',checks:'document-order geometry and snapshot; no card overlap; curve/label extent; all curves; Scope/Write preserve positions; close/reload/reopen exact layout; new input uses reversed order; editing retains saved positions',pageErrors:errors};
 }finally{await page.close();}
}
