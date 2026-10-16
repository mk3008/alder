import {useUngroupedSample} from './legacy-sample-browser.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseDesign} from '../src/graph.ts';
import {runBrowserCases} from './browser-cases.mjs';
import {assertToolbarLayout} from './test-toolbar-layout.mjs';
import {openDisplaySettings,closeDisplaySettings} from './toolbar-settings-control.mjs';
import {waitSavedViewer} from './wait-saved-viewer.mjs';

// Prepared native-browser gate only. Importing this module never launches a
// browser or server; test-browser.mjs owns both the caller and case collection.
const origin='http://127.0.0.1:4173/';
const optionIDs=['show-outside','prefer-write','show-exceptions','selected-edges-only'];

export const toolbarSettingsLimits={caseMs:30000,cleanupMs:3000};
async function bounded(promise,ms,message){let timer;try{return await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error(message)),ms);})]);}finally{clearTimeout(timer);}}
// Include setup and native geometry in the case deadline. Cleanup failures are
// retained alongside the original error, and never skip later isolated cases.
export async function withToolbarPage(browser,viewport,run,limits=toolbarSettingsLimits){
 let context,expired=false,cleanup,result;const errors=[],failures=[];
 const close=()=>cleanup??=bounded(Promise.resolve().then(()=>context.close()),limits.cleanupMs,'Toolbar cleanup deadline exceeded');
 const work=(async()=>{
  context=await browser.newContext({viewport});if(expired){await close();return;}
  const page=await context.newPage();if(expired)return;
  page.setDefaultTimeout(4000);page.setDefaultNavigationTimeout(5000);page.on('pageerror',e=>errors.push(e.message));
  return run(page,errors);
 })();
 try{result=await bounded(work,limits.caseMs,'Toolbar case deadline exceeded');}catch(error){failures.push(error);}
 finally{expired=true;if(context)try{await close();}catch(error){failures.push(error);}}
 if(failures.length>1)throw new AggregateError(failures,'Toolbar case and cleanup failed');if(failures.length)throw failures[0];return result;
}

const settle=page=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
const settings=page=>page.locator('#display-options input').evaluateAll(inputs=>Object.fromEntries(inputs.map(e=>[e.id,{checked:e.checked,mixed:e.indeterminate}])));

function graphSnapshotInPage(){
 const v=document.querySelector('#viewport'),rect=e=>{const r=e.getBoundingClientRect();return [r.left,r.top,r.width,r.height];};
 return {nodes:[...document.querySelectorAll('.node')].map(n=>[n.dataset.node,n.style.left,n.style.top,rect(n)]),paths:[...document.querySelectorAll('.edge')].map(p=>[p.dataset.relation,p.getAttribute('d')]),labels:[...document.querySelectorAll('.edge-label')].map(n=>[n.dataset.relation,n.getAttribute('x'),n.getAttribute('y'),n.textContent]),selected:document.querySelector('.node.selected')?.dataset.node??null,scroll:[v.scrollLeft,v.scrollTop],zoom:document.querySelector('#zoom').textContent,locked:document.querySelector('#layout-lock').getAttribute('aria-pressed')};
}
async function startGraphProbe(page){
 await page.evaluate(()=>{
  const roots=[document.querySelector('#nodes'),document.querySelector('#edges')],selector='.node,.edge,.edge-label';
  const probe={roots,references:[...document.querySelectorAll(selector)],records:[],selector};
  probe.observer=new MutationObserver(records=>probe.records.push(...records));
  roots.forEach(root=>probe.observer.observe(root,{childList:true,subtree:true}));
  window.__toolbarSettingsProbe=probe;
 });
 return page.evaluate(graphSnapshotInPage);
}
async function assertGraphProbe(page,before,label){
 const result=await page.evaluate(()=>{
  const p=window.__toolbarSettingsProbe;p.records.push(...p.observer.takeRecords());
  const current=[...document.querySelectorAll(p.selector)];
  return {sameRoots:p.roots[0]===document.querySelector('#nodes')&&p.roots[1]===document.querySelector('#edges'),sameNodes:p.references.length===current.length&&p.references.every((n,i)=>n===current[i]&&n.isConnected),added:p.records.reduce((sum,r)=>sum+r.addedNodes.length,0),removed:p.records.reduce((sum,r)=>sum+r.removedNodes.length,0)};
 });
 assert.deepEqual(result,{sameRoots:true,sameNodes:true,added:0,removed:0},label+': settings toggle never replaces nodes, paths or labels');
 assert.deepEqual(await page.evaluate(graphSnapshotInPage),before,label+': coordinates, paths, labels, selection, zoom, lock and camera stay exact');
 return result;
}
async function stopGraphProbe(page){await page.evaluate(()=>{window.__toolbarSettingsProbe?.observer.disconnect();delete window.__toolbarSettingsProbe;});}
async function camera(page){return page.locator('#viewport').evaluate(v=>({scroll:[v.scrollLeft,v.scrollTop],extent:[v.scrollWidth,v.scrollHeight],canvas:[document.querySelector('#canvas').style.width,document.querySelector('#canvas').style.height]}));}
async function openSample(page){
 await page.goto(origin);await page.waitForFunction(()=>!document.querySelector('#open').disabled);
 assert.equal(await page.locator('.toolbar').isVisible(),false,'empty graph has no settings toolbar');
 await page.locator('#open-sample').click();await useUngroupedSample(page);await page.waitForFunction(()=>document.querySelectorAll('.node').length===25);
 // Complete optional onboarding before measuring ordinary toolbar invariants.
 await page.locator('#check-followup-later').click();
 if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
 assert.equal(await page.locator('#display-settings-toggle').getAttribute('aria-expanded'),'false','settings start collapsed');
 await settle(page);
}

async function verifyAppearance(browser,viewport,theme){
 return withToolbarPage(browser,viewport,async(page,errors)=>{
  await openSample(page);if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();
  const closed=await assertToolbarLayout(page,{open:false}),before=await startGraphProbe(page),originClosed=await camera(page),initialSettings=await settings(page);
  assert.deepEqual(originClosed.scroll,[0,0],'origin case really starts at zero scroll');
  let opened,originOpen;
  for(let cycle=0;cycle<3;cycle++){
   await openDisplaySettings(page);const layout=await assertToolbarLayout(page,{open:true}),current=await camera(page);
   if(!opened){opened=layout;originOpen=current;}
   else assert.deepEqual(current,originOpen,'origin open extent does not accumulate');
   assert.ok(layout.toolbar.top<closed.toolbar.top-31,'panel expands upward');
   assert.ok(Math.abs(layout.toolbar.bottom-closed.toolbar.bottom)<=.75,'bottom toolbar anchor stays fixed');
   const row=layout.items.find(i=>i.id==='display-settings-toggle'),oldRow=closed.items.find(i=>i.id==='display-settings-toggle');
   assert.ok(Math.abs(row.top-oldRow.top)<=.75&&Math.abs(row.bottom-oldRow.bottom)<=.75,'control row keeps its vertical screen position');
   await assertGraphProbe(page,before,'origin open '+cycle);
   await closeDisplaySettings(page);await assertToolbarLayout(page,{open:false});
   assert.deepEqual(await camera(page),originClosed,'origin close restores exact extent without growth');
   assert.deepEqual(await settings(page),initialSettings,'panel close retains all four settings');
   await assertGraphProbe(page,before,'origin close '+cycle);
  }
  await stopGraphProbe(page);
  // At the old maximum, preserve the user's camera even when the newly open
  // toolbar needs more bottom reserve. The maximum extent itself may grow.
  await page.locator('#viewport').evaluate(v=>{v.scrollLeft=v.scrollWidth;v.scrollTop=v.scrollHeight;});await settle(page);
  const maxBefore=await camera(page);assert.ok(maxBefore.scroll[0]>0&&maxBefore.scroll[1]>0,'max-scroll case overflows both axes');
  const maxGraph=await startGraphProbe(page);
  for(let cycle=0;cycle<3;cycle++){
   await openDisplaySettings(page);await assertGraphProbe(page,maxGraph,'maximum scroll open '+cycle);
   assert.deepEqual((await camera(page)).scroll,maxBefore.scroll,'opening does not move camera from previous maximum');
   await closeDisplaySettings(page);await assertGraphProbe(page,maxGraph,'maximum scroll close '+cycle);
   assert.deepEqual((await camera(page)).scroll,maxBefore.scroll,'closing does not clamp maximum-scroll camera');
  }
  await stopGraphProbe(page);assert.deepEqual(errors,[]);
  return {viewport,theme,closed,opened,originClosed,originOpen,maxScroll:maxBefore.scroll,cycles:3,nodeAndPathReplacements:0,pageErrors:errors};
 });
}

async function verifyKeyboardAndRetention(browser){
 return withToolbarPage(browser,{width:320,height:568},async(page,errors)=>{
 const hiddenNodes=parseDesign(readFileSync(new URL('../../business-design/alder/README.md',import.meta.url),'utf8')).graph.nodes.filter(n=>!n.scope).map(n=>n.id);
 const active=()=>page.evaluate(()=>document.activeElement?.id);
  await openSample(page);const gear=page.locator('#display-settings-toggle');
  await gear.focus();
  for(const id of ['layout-lock','out','in','viewport']){await page.keyboard.press('Tab');assert.equal(await active(),id,'collapsed settings never enter Tab order');}
  await page.locator('#layout-lock').focus();await page.keyboard.press('Shift+Tab');assert.equal(await active(),'display-settings-toggle');
  await page.keyboard.press('Enter');assert.equal(await gear.getAttribute('aria-expanded'),'true');await assertToolbarLayout(page,{open:true});
  for(const id of [...optionIDs,'reset-layout','layout-lock']){await page.keyboard.press('Tab');assert.equal(await active(),id,'expanded keyboard order: '+id);}
  await page.locator('#prefer-write').focus();await page.keyboard.press('Escape');
  assert.equal(await gear.getAttribute('aria-expanded'),'false');assert.equal(await active(),'display-settings-toggle','Escape returns focus to gear');
  await page.keyboard.press('Space');assert.equal(await gear.getAttribute('aria-expanded'),'true','Space opens gear');
  await page.keyboard.press('Space');assert.equal(await gear.getAttribute('aria-expanded'),'false','Space closes gear');
  await page.keyboard.press('Enter');assert.equal(await gear.getAttribute('aria-expanded'),'true');
  await page.keyboard.press('Enter');assert.equal(await gear.getAttribute('aria-expanded'),'false','Enter also closes gear');
  await openDisplaySettings(page);await page.locator('#show-outside').focus();await page.keyboard.press('Space');
  assert.equal(await page.locator('#show-outside').isChecked(),false);assert.equal(await page.locator('.node').count(),12);
  await openDisplaySettings(page);await page.locator('#prefer-write').check();
  await openDisplaySettings(page);await page.locator('#show-exceptions').uncheck();
  await openDisplaySettings(page);await page.locator('#selected-edges-only').check();
  const expected=Object.fromEntries(optionIDs.map(id=>[id,{checked:['prefer-write','selected-edges-only'].includes(id),mixed:false}]));
  assert.deepEqual(await settings(page),expected);
  await closeDisplaySettings(page);assert.deepEqual(await settings(page),expected);
  await openDisplaySettings(page);assert.deepEqual(await settings(page),expected);
  await waitSavedViewer(page,{hiddenNodes,preferWrite:true,showExceptions:false,selectedEdgesOnly:true});
  await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled&&document.querySelectorAll('.node').length===12);
  assert.equal(await gear.getAttribute('aria-expanded'),'false','reload collapses presentation state');
  await assertToolbarLayout(page,{open:false});await openDisplaySettings(page);assert.deepEqual(await settings(page),expected,'reload retains display preferences');
  await assertToolbarLayout(page,{open:true});await page.locator('#show-exceptions').focus();await page.keyboard.press('Escape');assert.equal(await active(),'display-settings-toggle');
  assert.deepEqual(errors,[]);return {viewport:{width:320,height:568},checks:['collapsed Tab/Shift+Tab skip options','expanded Tab order reaches all options','Enter and Space open and close','Escape closes from a checkbox and restores gear focus','keyboard checkbox change','all four settings survive collapse/reopen/reload'],pageErrors:errors};
 });
}

export async function verifyToolbarSettings(browser){
 const viewports=[{width:320,height:960},{width:393,height:960},{width:1280,height:960},{width:320,height:568}];
 return runBrowserCases([
  ...viewports.flatMap(viewport=>['light','dark'].map(theme=>({name:`toolbar ${viewport.width}x${viewport.height} ${theme}`,run:()=>verifyAppearance(browser,viewport,theme)}))),
  {name:'toolbar keyboard and preference retention',run:()=>verifyKeyboardAndRetention(browser)}
 ]);
}
