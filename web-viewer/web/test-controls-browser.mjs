import {useUngroupedSample} from './legacy-sample-browser.mjs';
import {openSourceAction} from './source-menu-browser.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
// Inspect the rendered SVG, so mixed L/Q paths do not depend on a Q-only parser.
export async function assertRoundedPaths(page){
 const edges=await page.locator('.edge').evaluateAll(ns=>ns.map(n=>{
  const length=n.getTotalLength(),points=Array.from({length:65},(_,i)=>{const p=n.getPointAtLength(length*i/64);return [p.x,p.y];});
  return {path:n.getAttribute('d'),length,points,arrow:n.getAttribute('marker-end'),exception:n.classList.contains('exception'),dash:getComputedStyle(n).strokeDasharray};
 }));
 assert.ok(edges.length>0,'route fixture must have rendered edges');
 for(const edge of edges){
  const commands=edge.path.replace(/[+-]?(?:\d*\.\d+|\d+\.?\d*)(?:e[+-]?\d+)?/gi,'').replace(/[,\s]/g,'');
  assert.match(commands,/^M[LQ]+$/,'rounded orthogonal paths use only straight runs and corner quadratics');
  assert.ok(commands.includes('L'),'a route retains a straight run');
  assert.ok(Number.isFinite(edge.length)&&edge.length>0&&edge.points.flat().every(Number.isFinite),'rendered route geometry is finite and nonempty');
  assert.match(edge.arrow,/arrow/);if(edge.exception)assert.notEqual(edge.dash,'none');
 }
 assert.ok(edges.some(edge=>edge.path.includes('Q')),'bent fixture routes retain rounded corners');
 return edges;
}
export async function verifyLayoutLock(browser){
 const page=await browser.newPage({viewport:{width:1280,height:960}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const positions=()=>page.locator('.node').evaluateAll(ns=>ns.map(n=>[n.dataset.node,n.style.left,n.style.top]));
 const routes=()=>assertRoundedPaths(page);
 try{
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);await openSourceAction(page,'open-sample-menu');await useUngroupedSample(page);await page.locator('#drawer').click();
  assert.equal(await page.locator('#layout-lock').getAttribute('aria-pressed'),'true');const initial=await positions();await routes();
  const extent=await page.locator('#edges').evaluate(svg=>({w:parseFloat(svg.style.width),h:parseFloat(svg.style.height),box:(()=>{const b=svg.getBBox();return {x:b.x,y:b.y,width:b.width,height:b.height};})()}));assert.ok(extent.w>=extent.box.x+extent.box.width&&extent.h>=extent.box.y+extent.box.height,'canvas includes rounded routes and labels');
  const node=page.locator('.node.object').first();await node.scrollIntoViewIfNeeded();const box=await node.boundingBox();
  const before=await page.locator('#viewport').evaluate(n=>({scroll:[n.scrollLeft,n.scrollTop],max:[n.scrollWidth-n.clientWidth,n.scrollHeight-n.clientHeight]}));const delta=before.scroll.map((v,i)=>before.max[i]-v>=40?-40:40),expected=before.scroll.map((v,i)=>Math.max(0,Math.min(before.max[i],v-delta[i])));assert.ok(expected.some((v,i)=>v!==before.scroll[i]));
  await page.mouse.move(box.x+100,box.y+30);await page.mouse.down();await page.mouse.move(box.x+100+delta[0],box.y+30+delta[1],{steps:4});await page.mouse.up();assert.deepEqual(await positions(),initial);assert.deepEqual(await page.locator('#viewport').evaluate(n=>[n.scrollLeft,n.scrollTop]),expected);assert.equal(await page.locator('.selected').count(),0);
  await node.click();const id=await node.getAttribute('data-node');assert.equal(await page.locator('.selected').getAttribute('data-node'),id);assert.ok((await page.locator('#detail').textContent()).length>0);
  await page.locator('#layout-lock').focus();await page.keyboard.press('Space');assert.equal(await page.locator('#layout-lock').getAttribute('aria-pressed'),'false');await node.scrollIntoViewIfNeeded();const unlocked=await node.boundingBox(),paths=await page.locator('.edge').evaluateAll(ns=>ns.map(n=>n.getAttribute('d')));
  await page.mouse.move(unlocked.x+100,unlocked.y+30);await page.mouse.down();await page.mouse.move(unlocked.x+130,unlocked.y+50,{steps:4});assert.notDeepEqual(await page.locator('.edge').evaluateAll(ns=>ns.map(n=>n.getAttribute('d'))),paths);await routes();await page.mouse.up();const moved=await positions();assert.notDeepEqual(moved,initial);
  assert.equal(await page.locator('.close').isVisible(),true);await page.waitForFunction(()=>document.querySelector('#app').dataset.saveState==='saved');await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);assert.equal(await page.locator('#layout-lock').getAttribute('aria-pressed'),'true');await openSourceAction(page,'open-sample-menu');await useUngroupedSample(page);assert.deepEqual(await positions(),moved);
  // Wheel scrolling exercises the unchanged Drawer independently of graph gestures.
  await openSourceAction(page,'open-text');await page.locator('#source-text').fill(readFileSync('../business-design/alder/README.md','utf8'));await page.locator('#source-submit').click();await page.locator('#drawer').click();if(!await page.locator('#node-list-drawer').isVisible())await page.locator('#node-list-toggle').click();await page.locator('[data-list-node="業務設計"] .node-navigate').click();await page.locator('#node-list-close').click();
  const detail=page.locator('#detail');assert.ok(await detail.evaluate(n=>n.scrollHeight>n.clientHeight+100));const graphBefore=await positions(),zoom=await page.locator('#zoom').textContent();await detail.hover();await page.mouse.wheel(0,200);await page.waitForFunction(()=>document.querySelector('#detail').scrollTop>0);assert.deepEqual(await positions(),graphBefore);assert.equal(await page.locator('#zoom').textContent(),zoom);
  assert.deepEqual(errors,[]);return {checks:'default lock mouse node pan and click selection; keyboard unlock; immediate rounded-orthogonal edges/arrow/exception retention on drag; save-close-reload locks again without moving coordinates; independent Drawer wheel scroll',pageErrors:errors};
 }finally{await page.close();}
}
