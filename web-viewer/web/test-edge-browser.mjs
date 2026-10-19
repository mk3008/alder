import {useUngroupedSample} from './legacy-sample-browser.mjs';
import {openDisplaySettings} from './toolbar-settings-control.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseDesign} from '../src/graph.ts';
import {hiddenReadIndexes} from '../src/edge-visibility.ts';
export async function verifyEdgeOption(browser){
  const page=await browser.newPage({viewport:{width:1280,height:960}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('dialog',async dialog=>{errors.push('Unexpected dialog: '+dialog.type());await dialog.dismiss();});
  try {
    await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);
    assert.equal(await page.locator('#prefer-write').isChecked(),false);
    await page.locator('#open-sample').click();await useUngroupedSample(page);await page.waitForFunction(()=>document.querySelectorAll('.node').length>0);await page.locator('#drawer').click();
    const relations=parseDesign(readFileSync('../business-design/alder/README.md','utf8')).graph.relations;
    const hidden=hiddenReadIndexes(relations,true),expected=relations.map((_,i)=>i).filter(i=>!hidden.has(i));
    const selected=page.locator('.node.object').first(),id=await selected.getAttribute('data-node');await selected.click();
    const positions=await page.locator('.node').evaluateAll(ns=>ns.map(n=>[n.dataset.node,n.style.left,n.style.top]));
    await openDisplaySettings(page);await page.locator('#prefer-write').check();
    const assertEdges=async()=>{
      const edges=await page.locator('.edge').evaluateAll(ns=>ns.map(n=>({i:+n.dataset.relation,related:n.classList.contains('review-related'),exception:n.classList.contains('exception')})));
      assert.deepEqual(edges.map(n=>n.i).sort((a,b)=>a-b),expected);
      assert.deepEqual(await page.locator('.edge-label').evaluateAll(ns=>ns.flatMap(n=>(n.dataset.relations??n.dataset.relation).split(" ").map(Number)).sort((a,b)=>a-b)),expected);
      for(const edge of edges){const r=relations[edge.i];assert.equal(edge.related,r.from===id||r.to===id);assert.equal(edge.exception,r.kind.endsWith('exception'));}
      assert.equal(await page.locator('.node.selected').getAttribute('data-node'),id);
      assert.deepEqual(await page.locator('.node').evaluateAll(ns=>ns.map(n=>[n.dataset.node,n.style.left,n.style.top])),positions);
    };
    await assertEdges();await page.locator('#out').click();await page.locator('#theme').click();await assertEdges();
    await page.waitForFunction(()=>document.querySelector('#app')?.dataset.saveState==='saved');await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);
    assert.equal(await page.locator('#prefer-write').isChecked(),true);await assertEdges();
    await openDisplaySettings(page);await page.locator('#prefer-write').uncheck();assert.equal(await page.locator('.edge').count(),relations.length);assert.equal(await page.locator('.edge-label').count(),62,'one repeated source caption is shared');
    assert.deepEqual(errors,[]);return {all:relations.length,hiddenReads:hidden.size,visible:expected.length,checks:'default OFF; paired Reads/labels hidden; standalone Reads/Writes/exceptions retained; selection, positions, zoom/theme and reload'};
  } finally {await page.close();}
}
