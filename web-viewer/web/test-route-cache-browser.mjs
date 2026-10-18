import {openSourceAction} from './source-menu-browser.mjs';
import {openDisplaySettings} from './toolbar-settings-control.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseDesign} from '../src/graph.ts';
import {setScope} from './scope-control.mjs';
import {waitForExactRead,waitSavedViewer} from './wait-saved-viewer.mjs';

// At zoom1, an integer pointer delta produces an independently known integer
// world coordinate. Never derive the persistence oracle from serialized CSS.
export function integerDragPlan(fixture,moving,box,crossing){
 const start=[Math.round(box.x+130),Math.round(box.y+34)],end=crossing.screen.map(Math.round);
 const expected=Object.fromEntries(Object.entries(fixture).map(([id,p])=>[id,[...p]]));
 expected[moving]=fixture[moving].map((v,i)=>v+end[i]-start[i]);
 assert.ok(start[0]>box.x&&start[0]<box.x+box.width&&start[1]>box.y&&start[1]<box.y+box.height,'integer pointer starts inside card');
 assert.ok([...start,...end,...expected[moving]].every(Number.isSafeInteger));
 const p=expected[moving];assert.ok(crossing.world[0]>p[0]&&crossing.world[0]<p[0]+260&&crossing.world[1]>p[1]&&crossing.world[1]<p[1]+68,'integer drag still covers original unrelated path');
 return {start,end,expected};
}

// Caller owns Chromium and the shared saved-state preflight. This module only
// runs one isolated case, with public fixture data and bounded committed writes.
export async function verifyRouteCache(browser){
 const context=await browser.newContext({viewport:{width:1440,height:960}}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const raw=JSON.parse(readFileSync('web/authorities/contract-cases.json','utf8')).find(c=>c.name==='test_explicit_exception_kinds').input;
 const design=parseDesign(raw),relations=design.graph.relations,moving='person';
 const unrelated=relations.findIndex(r=>r.from==='record'&&r.to==='read');
 assert.ok(unrelated>=0);assert.ok(relations.some(r=>r.from===moving||r.to===moving));
 const positions=()=>page.locator('.node').evaluateAll(ns=>Object.fromEntries(ns.map(n=>[n.dataset.node,[parseFloat(n.style.left),parseFloat(n.style.top)]])));
 const routes=()=>page.evaluate(()=>Object.fromEntries([...document.querySelectorAll('.edge')].map(n=>{const label=document.querySelector(`.edge-label[data-relation="${n.dataset.relation}"]`);return [n.dataset.relation,{path:n.getAttribute('d'),label:[label.getAttribute('x'),label.getAttribute('y')]}];})));
 const ready=()=>page.waitForFunction(()=>!document.querySelector('#open').disabled&&document.querySelectorAll('.node').length===4);
 try{
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);
  await openSourceAction(page,'open-text');await page.locator('#source-text').fill(raw);await page.locator('#source-submit').click();await page.waitForFunction(()=>document.querySelectorAll('.node').length===4);await page.locator('#drawer').click();await ready();
  await waitSavedViewer(page,{positions:await positions()});
  const fixture={record:[80,100],read:[650,420],person:[1040,100],approve:[1040,650]};
  await page.goto('http://127.0.0.1:4173/LICENSE.txt');
  await waitForExactRead(()=>page.evaluate(positions=>new Promise((resolve,reject)=>{
   const request=indexedDB.open('alder-web-viewer',1);request.onerror=()=>reject(request.error);
   request.onsuccess=()=>{const db=request.result,tx=db.transaction('session','readwrite'),store=tx.objectStore('session'),get=store.get('current');let failure;
    get.onsuccess=()=>{const session=get.result,tab=(session?.format>=2?session.views:session?.tabs)?.find(t=>t.key===session.active);if(!tab){failure=Error('Route-cache fixture session missing');tx.abort();return;}tab.positions=positions;tab.zoom=1;tab.scroll=[0,0];tab.hiddenNodes=[];tab.viewInset=[0,0];tab.canvasOrigin=[0,0];session.drawer=false;store.put(session,'current');};
    tx.oncomplete=()=>{db.close();resolve(true);};tx.onerror=tx.onabort=()=>{db.close();reject(failure??tx.error??Error('Route-cache fixture commit failed'));};
   };
  }),fixture),true,{timeoutMs:5000});
  await waitSavedViewer(page,{positions:fixture,zoom:1,scroll:[0,0],viewInset:[0,0],canvasOrigin:[0,0]});await page.goto('http://127.0.0.1:4173/');await ready();assert.deepEqual(await positions(),fixture);
  const initial=await routes();assert.equal(Object.keys(initial).length,relations.length);
  // Use the real rendered path's midpoint, not a fresh routeEdge prediction.
  const crossing=await page.locator(`.edge[data-relation="${unrelated}"]`).evaluate(path=>{const point=path.getPointAtLength(path.getTotalLength()/2),screen=point.matrixTransform(path.getScreenCTM());return {world:[point.x,point.y],screen:[screen.x,screen.y]};});
  await page.locator('#layout-lock').click();const card=page.locator('.node[data-node="person"]'),box=await card.boundingBox();
  assert.equal(await page.locator('#zoom').textContent(),'100%');
  const drag=integerDragPlan(fixture,moving,box,crossing);
  console.log('ROUTE_CACHE_EXPECTED '+JSON.stringify({start:drag.start,end:drag.end,expected:drag.expected,crossing}));
  await page.mouse.move(...drag.start);await page.mouse.down();await page.mouse.move(...drag.end,{steps:6});
  const during=await routes(),moved=await positions(),p=moved[moving];
  console.log('ROUTE_CACHE_DOM '+JSON.stringify({stage:'during-drag',expected:drag.expected,observed:moved}));
  assert.deepEqual(moved,drag.expected,'DOM matches independently calculated integer input delta');
  assert.ok(crossing.world[0]>p[0]&&crossing.world[0]<p[0]+260&&crossing.world[1]>p[1]&&crossing.world[1]<p[1]+68,'moved card covers the original unrelated path');
  assert.notDeepEqual(moved,fixture);
  let changedIncident=0;
  for(const [index,r] of relations.entries()){
   if(r.from===moving||r.to===moving){if(during[index].path!==initial[index].path)changedIncident++;}
   else {assert.equal(during[index].path,initial[index].path,'unrelated path stays cached during drag');assert.equal(during[index].label[1],initial[index].label[1],'unrelated caption stays on its departure row');}
  }
  assert.ok(changedIncident>0,'incident geometry follows the moved card');
  const captionHits=await page.evaluate(()=>{
   const cards=[...document.querySelectorAll('.node')].map(n=>({x:parseFloat(n.style.left),y:parseFloat(n.style.top),width:n.offsetWidth,height:n.offsetHeight}));
   return [...document.querySelectorAll('.edge-label')].flatMap(n=>{const b=n.getBBox();return cards.filter(c=>b.x<c.x+c.width&&b.x+b.width>c.x&&b.y<c.y+c.height&&b.y+b.height>c.y).map(c=>n.dataset.relation);});
  });
  assert.deepEqual(captionHits,[],'native captions escape moved cards while nonincident paths remain cached');
  // A moved endpoint must be on the moved card perimeter, not just a new path.
  const endpoint=await page.locator(`.edge[data-relation="${relations.findIndex(r=>r.from===moving)}"]`).evaluate(path=>{const p=path.getPointAtLength(0);return [p.x,p.y];});
  assert.ok(endpoint[0]>=p[0]-.01&&endpoint[0]<=p[0]+260.01&&endpoint[1]>=p[1]-.01&&endpoint[1]<=p[1]+68.01);
  assert.ok(Math.min(Math.abs(endpoint[0]-p[0]),Math.abs(endpoint[0]-p[0]-260),Math.abs(endpoint[1]-p[1]),Math.abs(endpoint[1]-p[1]-68))<.01);
  await page.mouse.up();assert.deepEqual(await routes(),during,'pointer release retains final cached geometry');
  await page.locator('.node[data-node="record"]').click();assert.deepEqual(await routes(),during,'selection after drag retains cached geometry');
  for(const id of ['selected-edges-only','show-exceptions','prefer-write']){
   await openDisplaySettings(page);const control=page.locator('#'+id),before=await control.isChecked();await control.setChecked(!before);await control.setChecked(before);assert.deepEqual(await routes(),during,id+' roundtrip retains cached paths and labels');
  }
  await setScope(page,'hide');await setScope(page,'show');assert.deepEqual(await positions(),moved);assert.deepEqual(await routes(),during,'Scope roundtrip retains hidden incident and unrelated routes');
  const firstKey=await page.locator('.tab.active').getAttribute('data-key');
  await page.locator('.node[data-activity] .activity-open').first().press('Enter');await page.locator('.tab').first().locator('button').first().click();
  assert.equal(await page.locator('.tab.active').getAttribute('data-key'),firstKey);assert.deepEqual(await positions(),moved);assert.deepEqual(await routes(),during,'Group tab switch preserves route history');
  let lastObserved;
  await waitSavedViewer(page,{positions:drag.expected,hiddenNodes:[],zoom:1},{observe:({reads,observed})=>{const serialized=JSON.stringify(observed);if(serialized!==lastObserved){console.log('ROUTE_CACHE_DB '+JSON.stringify({reads,expected:drag.expected,observed}));lastObserved=serialized;}}});
  await page.reload();await ready();const restored=await positions();console.log('ROUTE_CACHE_DOM '+JSON.stringify({stage:'cold-restore',expected:drag.expected,observed:restored}));assert.deepEqual(restored,drag.expected,'cold restore matches independent integer coordinates');
  const cold=await routes();assert.equal(Object.keys(cold).length,relations.length);
  // Reload is a fresh full routing pass. Equality with history-dependent routes
  // is deliberately not an invariant; report changes rather than require them.
  const coldChanged=relations.map((_,i)=>i).filter(i=>cold[i].path!==during[i].path||JSON.stringify(cold[i].label)!==JSON.stringify(during[i].label));
  assert.deepEqual(errors,[]);
  return {checks:'real pointer crossing unrelated cached path; exact path/departure-row retention, horizontal caption/card separation; incident endpoint follows; pointerup and selection preserve geometry; selected-only/exception/Write/Scope roundtrips; per-tab history; bounded IDB commit; cold reload coordinates',expectedPositions:drag.expected,observedPositions:moved,restoredPositions:restored,unrelatedRelation:unrelated,changedIncident,coldChangedRelations:coldChanged,pageErrors:errors,limit:'Runtime route history is intentionally not persisted; cold reload may change paths and labels.'};
 }finally{await context.close();}
}
