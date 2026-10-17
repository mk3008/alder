import {openSourceAction} from './source-menu-browser.mjs';
import {openDisplaySettings,closeDisplaySettings} from './toolbar-settings-control.mjs';
import {assertToolbarLayout} from './test-toolbar-layout.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseDesign} from '../src/graph.ts';
import {hiddenReadIndexes} from '../src/edge-visibility.ts';
import {setScope} from './scope-control.mjs';
import {waitSavedViewer} from './wait-saved-viewer.mjs';
// Call from the real-browser runner. This module alone does not launch Chrome.
export async function verifyExceptionOption(browser){
 const page=await browser.newPage({viewport:{width:1280,height:960}}),errors=[],toolbarLayouts=[];
 page.on('pageerror',e=>errors.push(e.message));
 const raw=JSON.parse(readFileSync('web/authorities/contract-cases.json','utf8')).find(c=>c.name==='test_explicit_exception_kinds').input,design=parseDesign(raw),relations=design.graph.relations;
 const exception=r=>r.kind==='business-exception'||r.kind==='object-exception';
 const snapshot=()=>page.evaluate(()=>({nodes:[...document.querySelectorAll('.node')].map(n=>[n.dataset.node,n.style.left,n.style.top]),paths:[...document.querySelectorAll('.edge')].map(n=>[n.dataset.relation,n.getAttribute('d')]),canvas:document.querySelector('#canvas').getAttribute('style'),viewBox:document.querySelector('#edges').getAttribute('viewBox'),scroll:[document.querySelector('#viewport').scrollLeft,document.querySelector('#viewport').scrollTop]}));
 async function check(show=true,write=false,scope=true){const selected=await page.locator('#selected-edges-only').isChecked()?await page.locator('.node.selected').evaluateAll(ns=>ns[0]?.dataset.node??null):null;const hidden=hiddenReadIndexes(relations,write),visible=new Set(design.graph.nodes.filter(n=>scope||n.scope).map(n=>n.id)),expected=relations.flatMap((r,i)=>(!selected||r.from===selected||r.to===selected)&&(show||!exception(r))&&!hidden.has(i)&&visible.has(r.from)&&visible.has(r.to)?[i]:[]);for(const selector of ['.edge','.edge-label'])assert.deepEqual(await page.locator(selector).evaluateAll(ns=>ns.map(n=>+n.dataset.relation).sort((a,b)=>a-b)),expected);assert.equal(await page.locator('#show-exceptions').isChecked(),show);}
 try{
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);assert.equal(await page.locator('#show-exceptions').isChecked(),true);assert.equal(await page.locator('#show-exceptions').isDisabled(),true);
  await openSourceAction(page,'open-text');await page.locator('#source-text').fill(raw);await page.locator('#source-submit').click();await page.waitForFunction(()=>document.querySelectorAll('.node').length>0);await page.locator('#drawer').click();await check();assert.equal(await page.locator('#selected-edges-only').isChecked(),false);await openDisplaySettings(page);await page.locator('#selected-edges-only').check();await check();await openDisplaySettings(page);await page.locator('#selected-edges-only').uncheck();
  for(const width of [320,393,1280]){
   await page.setViewportSize({width,height:960});
   await closeDisplaySettings(page);toolbarLayouts.push(await assertToolbarLayout(page,{open:false}));await openDisplaySettings(page);toolbarLayouts.push(await assertToolbarLayout(page,{open:true}));
   await page.locator('#viewport').evaluate(v=>{v.scrollLeft=v.scrollWidth-v.clientWidth;v.scrollTop=v.scrollHeight-v.clientHeight;});
   const before=await snapshot();await openDisplaySettings(page);await page.locator('#show-exceptions').uncheck();await check(false);const after=await snapshot();assert.deepEqual({...after,paths:undefined},{...before,paths:undefined});assert.deepEqual(after.paths,before.paths.filter(([i])=>!exception(relations[+i])));
   await openDisplaySettings(page);await page.locator('#show-exceptions').check();await check();assert.deepEqual(await snapshot(),before);
  }
  await openDisplaySettings(page);await page.locator('#show-exceptions').uncheck();await openDisplaySettings(page);await page.locator('#prefer-write').check();await check(false,true);await setScope(page,'hide');await check(false,true,false);await openDisplaySettings(page);await page.locator('#show-exceptions').check();await check(true,true,false);await setScope(page,'show');await openDisplaySettings(page);await page.locator('#prefer-write').uncheck();await openDisplaySettings(page);await page.locator('#show-exceptions').uncheck();await check(false);
  await page.setViewportSize({width:1280,height:960});await page.locator('#node-list-toggle').click();await page.locator('[data-category="object"]').click();await page.locator('[data-list-node="record"] .node-navigate').click();await page.locator('#node-list-close').click();const selectedBefore=await snapshot();await openDisplaySettings(page);await page.locator('#selected-edges-only').check();await check(false);const selectedAfter=await snapshot();assert.deepEqual({...selectedAfter,paths:undefined},{...selectedBefore,paths:undefined});assert.equal(await page.locator('.node').count(),design.graph.nodes.length);await waitSavedViewer(page,{showExceptions:false,selectedEdgesOnly:true,selected:'record'});await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);await check(false);
  await openSourceAction(page,'open-text');await page.locator('#source-text').fill(raw);await page.locator('#source-submit').click();await page.locator('#source-dialog').waitFor({state:'hidden'});await check();assert.equal(await page.locator('#selected-edges-only').isChecked(),false);assert.equal(await page.locator('#document-recovery').count(),0);assert.equal(await page.locator('.selected').count(),0);
  assert.deepEqual(errors,[]);return {checks:'both Graph exception kinds; default ON; paths and labels only; 320/393/1280 toolbar text/control bounds and hit tests; tail camera/extents and cached geometry retained; independent Write/Scope; exact saved false and reload; per-tab state; selected-only default OFF/no-selection fallback/direct incident relations; drawer selection sync; node/camera preservation; closed compact row and two normal-flow expanded display rows; measured height recorded',toolbarLayouts,pageErrors:errors};
 }finally{await page.close();}
}
