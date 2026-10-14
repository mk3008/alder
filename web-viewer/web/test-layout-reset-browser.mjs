import assert from 'node:assert/strict';
import {parseDesign} from '../src/graph.ts';
import {initialPositions} from '../src/layout.ts';
import {runBrowserCases} from './browser-cases.mjs';
import {withToolbarPage} from './test-toolbar-settings-browser.mjs';
import {assertToolbarLayout} from './test-toolbar-layout.mjs';
import {readSessionInPage,waitSavedViewer,waitForExactRead} from './wait-saved-viewer.mjs';

// Synthetic documents in a fresh native browser context; never user storage.
const markdown=`# Layout reset test
# Object Request
## Scope
true
## Icon
file-text
## Information
- Details
# Object Archive
## Scope
false
## Icon
archive
## Information
- Approved details
# Activity Review
## Scope
true
## Why
Review the request
## When
A request arrives
## Who
Reviewer
## Where
Office
## How
### Input
- Request — Details
### Procedure
1. Review details.
### Output
- Archive — Approved details
## Result
Details are reviewed.
`;
const design=parseDesign(markdown),positions=initialPositions(design.graph,design.activityOrder);
const tab={key:'reset',name:'Reset',design,positions,scroll:[0,0],zoom:1,viewInset:[40,0],selected:'Review',hiddenNodes:[],showExceptions:false,selectedEdgesOnly:true,source:{kind:'text'},draft:markdown+'\nUnapplied text'};
const state={tabs:[tab,{...tab,key:'other',name:'Other',positions:{Request:[1500,300],Archive:[2000,1000],Review:[1000,800]},scroll:[600,200],zoom:.5,viewInset:[80,60],canvasOrigin:[100,200],source:{kind:'url',url:'https://example.org/other.md'}}],active:'reset',dark:false,drawer:false,nodeDrawer:false,width:380,preferWrite:true};
const plain=value=>JSON.parse(JSON.stringify(value));
const nonLayout=t=>{const {positions,scroll,zoom,viewInset,canvasOrigin,...rest}=t;return rest;};
const geometry=page=>page.evaluate(()=>({nodes:[...document.querySelectorAll('.node')].map(n=>[n.dataset.node,n.style.left,n.style.top]),edges:[...document.querySelectorAll('.edge,.edge-label')].map(e=>[e.dataset.relation,e.getAttribute('d'),e.getAttribute('x'),e.getAttribute('y')]),scroll:[document.querySelector('#viewport').scrollLeft,document.querySelector('#viewport').scrollTop],zoom:document.querySelector('#zoom').textContent}));
async function seed(page,value){
 await page.evaluate(value=>new Promise((resolve,reject)=>{const r=indexedDB.open('alder-web-viewer',1);r.onsuccess=()=>{const db=r.result,tx=db.transaction('session','readwrite'),s=tx.objectStore('session');s.put(value,'current');s.put(1,'generation');tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>reject(tx.error);};r.onerror=()=>reject(r.error);}),value);
 await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled&&document.querySelectorAll('.node').length===3);
}
export async function verifyLayoutReset(browser){
 return runBrowserCases([320,393,1280].map(width=>({name:`layout reset ${width}`,run:()=>withToolbarPage({newContext:options=>browser.newContext({...options,hasTouch:width<800})},{width,height:800},async(page,errors)=>{
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);
  await seed(page,state);const original=await geometry(page);
  const modified=structuredClone(state);modified.tabs[0].positions={Request:[20,40],Archive:[30,280],Review:[20,160]};modified.tabs[0].viewInset=[0,0];modified.tabs[0].canvasOrigin=[0,0];
  await seed(page,modified);await page.locator('#layout-lock').click();
  for(const id of ['Request','Review']){
   const box=await page.locator('.node').evaluateAll((nodes,id)=>{const r=nodes.find(n=>n.dataset.node===id).getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};},id);
   const x=Math.round(box.x+100),y=Math.round(box.y+30);await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+20,y+18,{steps:3});await page.mouse.up();
  }
  await page.waitForFunction(()=>document.querySelector('#app').dataset.saveState==='saved');const before=await page.evaluate(readSessionInPage);
  assert.notDeepEqual(before.tabs[0].positions.Request,modified.tabs[0].positions.Request);assert.notDeepEqual(before.tabs[0].positions.Review,modified.tabs[0].positions.Review);
  await page.locator('#out').click();await page.locator('#viewport').evaluate(v=>{v.scrollLeft=400;v.scrollTop=300;});
  await page.locator('#display-settings-toggle').click();await assertToolbarLayout(page,{open:true});
  const button=page.getByRole('button',{name:'レイアウトを初期値に戻す',exact:true});await button.focus();await page.keyboard.press('Enter');
  const saved=await waitSavedViewer(page,{positions:plain(positions),scroll:[0,0],zoom:1,viewInset:[40,0]});
  assert.deepEqual(nonLayout(saved.tabs[0]),nonLayout(before.tabs[0]));assert.deepEqual(saved.tabs[1],before.tabs[1]);assert.deepEqual({...saved,tabs:[]},{...before,tabs:[]});
  assert.deepEqual(await geometry(page),original,'nodes, routes, labels and camera match fresh initial rendering');
  assert.equal(await page.locator('#layout-lock').getAttribute('aria-pressed'),'false');assert.equal(await page.evaluate(()=>document.activeElement.id),'reset-layout');
  if(width<800)await button.tap();
  await page.keyboard.press('Space');await page.keyboard.press('Enter');await page.keyboard.press('Escape');assert.equal(await page.locator('#display-options').isVisible(),false);assert.equal(await page.evaluate(()=>document.activeElement.id),'display-settings-toggle');
  await page.locator('.tab').nth(1).locator('button').first().click();await page.locator('.tab').nth(0).locator('button').first().click();await waitSavedViewer(page,{positions:plain(positions),scroll:[0,0],zoom:1});
  await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);assert.deepEqual(await geometry(page),original);
  await waitForExactRead(()=>page.evaluate(readSessionInPage),plain(saved),{project:plain});assert.deepEqual(errors,[]);
  return {width,checks:['two native drags','native Enter/Space reset, mobile tap and Escape focus','visible unclipped reset action','fresh node/path/label/camera equivalence','draft/source/filters/selection/other tab preserved','tab switch and reload'],pageErrors:errors};
 })})));
}
