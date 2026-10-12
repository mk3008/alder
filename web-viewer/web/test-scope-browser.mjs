import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseDesign} from '../src/graph.ts';
import {hiddenReadIndexes} from '../src/edge-visibility.ts';
export async function verifyScopeOption(browser){
 const page=await browser.newPage({viewport:{width:1280,height:960}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const source=readFileSync('../business-design/alder/README.md','utf8'),design=parseDesign(source),ids=new Set(design.graph.nodes.filter(n=>n.scope).map(n=>n.id));
 const positions=()=>page.locator('.node').evaluateAll(ns=>ns.map(n=>[n.dataset.node,n.style.left,n.style.top]));
 const saved=()=>page.evaluate(()=>new Promise((resolve,reject)=>{const r=indexedDB.open('alder-web-viewer',1);r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,g=db.transaction('session').objectStore('session').get('current');g.onsuccess=()=>{db.close();resolve(g.result);};};}));
 try{
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);assert.equal(await page.locator('#hide-outside').isChecked(),false);
  await page.locator('#open-sample').click();const initial=await positions(),fullDetail=await page.locator('#detail').textContent();
  await page.locator('#drawer').click();await page.locator('.node.outside').first().click();assert.equal(await page.locator('.node.selected').count(),1);
  const canvas=await page.locator('#canvas').evaluate(n=>[n.style.width,n.style.height]);
  await page.locator('#hide-outside').check();assert.equal(await page.locator('.node').count(),ids.size);assert.equal(await page.locator('.node.outside,.node.selected,.muted').count(),0);assert.equal(await page.locator('#detail').textContent(),fullDetail);await page.locator('#drawer').click();assert.equal(await page.locator('#formattedMarkdownDrawer').isVisible(),true);assert.equal(await page.locator('#detail').textContent(),fullDetail);await page.locator('#drawer').click();assert.deepEqual(await page.locator('#canvas').evaluate(n=>[n.style.width,n.style.height]),canvas);
  const verify=async prefer=>{const hidden=hiddenReadIndexes(design.graph.relations,prefer),expected=design.graph.relations.map((r,i)=>({r,i})).filter(({r,i})=>ids.has(r.from)&&ids.has(r.to)&&!hidden.has(i)).map(({i})=>i);for(const css of ['.edge','.edge-label'])assert.deepEqual(await page.locator(css).evaluateAll(ns=>ns.map(n=>+n.dataset.relation).sort((a,b)=>a-b)),expected);return expected.length;};
  const scopeEdges=await verify(false);await page.locator('#prefer-write').check();const combinedEdges=await verify(true);assert.deepEqual(await positions(),initial.filter(([id])=>ids.has(id)));
  const inside=page.locator('.node.business').first(),id=await inside.getAttribute('data-node');await inside.click();assert.equal(await page.locator('.selected').getAttribute('data-node'),id);
  const box=await inside.boundingBox();await page.mouse.move(box.x+70,box.y+30);await page.mouse.down();await page.mouse.move(box.x+105,box.y+55,{steps:3});await page.mouse.up();const moved=await positions();await verify(true);
  const viewportBefore=await page.locator('#viewport').evaluate(n=>[n.scrollLeft,n.scrollTop]);await page.locator('#hide-outside').uncheck();assert.equal(await page.locator('.node').count(),25);assert.equal(await page.locator('.selected').getAttribute('data-node'),id);assert.deepEqual((await positions()).filter(([node])=>!ids.has(node)),initial.filter(([node])=>!ids.has(node)));await page.locator('#hide-outside').check();assert.deepEqual(await positions(),moved);assert.deepEqual(await page.locator('#viewport').evaluate(n=>[n.scrollLeft,n.scrollTop]),viewportBefore);
  await page.locator('#theme').click();await page.locator('#out').click();await verify(true);await page.waitForTimeout(300);
  const snapshot=await saved();assert.equal(JSON.stringify(snapshot.tabs[0].design),JSON.stringify(design));assert.equal(Object.keys(snapshot.tabs[0].positions).length,25);
  await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);assert.equal(await page.locator('#hide-outside').isChecked(),true);assert.equal(await page.locator('#prefer-write').isChecked(),true);assert.equal(await page.locator('.selected').getAttribute('data-node'),id);assert.deepEqual(await positions(),moved);await verify(true);assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  // All-outside document opened while filtering remains enabled.
  await page.locator('#open-text').click();await page.locator('#source-text').fill(source.replace(/(## Scope\s+)true/g,'$1false'));await page.locator('#source-submit').click();assert.equal(await page.locator('.node,.edge,.edge-label').count(),0);assert.equal(await page.locator('#scope-empty').isVisible(),true);assert.equal(await page.locator('#empty').isVisible(),false);
  await page.locator('#hide-outside').uncheck();assert.equal(await page.locator('.node').count(),25);assert.equal(await page.locator('#scope-empty').isVisible(),false);await page.locator('#hide-outside').check();
  await page.locator('.tab>button:first-child').first().click();assert.equal(await page.locator('.node').count(),12);assert.equal(await page.locator('.selected').getAttribute('data-node'),id);
  for(const width of [393,320]){await page.setViewportSize({width,height:852});const toolbar=await page.locator('.toolbar').boundingBox();assert.ok(toolbar.x>=0&&toolbar.x+toolbar.width<=width&&toolbar.height<=66);for(const id of ['hide-outside','prefer-write']){const input=await page.locator('#'+id).boundingBox();assert.ok(input.x>=toolbar.x&&input.x+input.width<=toolbar.x+toolbar.width);assert.equal(await page.locator('#'+id).isVisible(),true);}await page.locator('#hide-outside').focus();await page.keyboard.press('Space');assert.equal(await page.locator('#hide-outside').isChecked(),false);await page.keyboard.press('Space');assert.equal(await page.locator('#hide-outside').isChecked(),true);}
  assert.deepEqual(errors,[]);return {allNodes:25,scopeNodes:ids.size,allEdges:63,scopeEdges,combinedEdges,checks:'scope/Write filtering, hidden selection and full Drawer, stable canvas/positions/scroll, drag, visible selection, original data, theme/zoom/reload, all-outside input, tab switching, narrow toolbar and keyboard checkbox',pageErrors:errors};
 }finally{await page.close();}
}
