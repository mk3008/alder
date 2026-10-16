import {openSourceAction} from './source-menu-browser.mjs';
import {waitSavedViewer} from './wait-saved-viewer.mjs';
import {installFacingTrace,readFacingStorage} from './trace-facing-storage.mjs';
import assert from 'node:assert/strict';
import {assertRoundedPaths} from './test-controls-browser.mjs';
// Wait for the real debounced IndexedDB write, not an arbitrary delay. This
// test checks reload after save; it does not promise immediate unload durability.
export async function waitForSavedPositions(page,positions){return await waitSavedViewer(page,{positions});}
export async function verifyFacingRoutes(browser){
 const page=await browser.newPage({viewport:{width:1440,height:960}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const trace=[];page.on('console',m=>{if(m.text().startsWith('FACING_TRACE ')){try{trace.push(JSON.parse(m.text().slice(13)));}catch(e){errors.push('Diagnostic trace parse: '+e.message);}}});await page.addInitScript(installFacingTrace);
 const text='# Facing route fixture\n\n'+['A source','B obstacle'].map(id=>'# Object '+id+'\n\n## Scope\n\ntrue\n\n## Icon\n\nfile-text\n\n## Information\n\n- Synthetic routing test\n\n').join('')+'# Activity C target\n\n## Scope\n\ntrue\n\n## Why\n\nTest\n\n## When\n\nTest\n\n## Who\n\nTester\n\n## Where\n\nTest\n\n## How\n\n### Input\n\n- A source — Input\n\n### Procedure\n\nTest\n\n### Output\n\n- B obstacle — Output\n\n## Result\n\nTest\n';
 try{
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);await openSourceAction(page,'open-text');await page.locator('#source-text').fill(text);await page.locator('#source-submit').click();await page.waitForFunction(()=>document.querySelectorAll('.node').length>0);await page.locator('#drawer').click();
  // Preserve this obstacle regression independently of the initial-layout policy.
  // Commit explicit saved geometry, then restore it through the normal product path.
  const positions=()=>page.locator('.node').evaluateAll(ns=>Object.fromEntries(ns.map(n=>[n.dataset.node,[parseFloat(n.style.left),parseFloat(n.style.top)]])));
  await waitForSavedPositions(page,await positions());
  const fixturePositions={'A source':[40,40],'B obstacle':[760,40],'C target':[400,40]};
  await page.goto('http://127.0.0.1:4173/LICENSE.txt');
  await page.evaluate(positions=>new Promise((resolve,reject)=>{
   const request=indexedDB.open('alder-web-viewer',1);
   request.onerror=()=>reject(request.error);
   request.onsuccess=()=>{
    const db=request.result,tx=db.transaction('session','readwrite'),store=tx.objectStore('session'),get=store.get('current');let failure;
    get.onsuccess=()=>{
     const session=get.result,tab=(session?.format>=2?session.views:session?.tabs)?.find(t=>t.key===session.active);
     if(!tab){failure=Error('Routing fixture session not saved');tx.abort();return;}
     tab.positions=positions;tab.zoom=1;tab.scroll=[0,0];tab.viewInset=[0,0];tab.canvasOrigin=[0,0];
     session.drawer=false;store.put(session,'current');
    };
    tx.oncomplete=()=>{db.close();resolve();};
    tx.onerror=tx.onabort=()=>{db.close();reject(failure??tx.error??Error('Routing fixture transaction failed'));};
   };
  }),fixturePositions);
  await waitSavedViewer(page,{positions:fixturePositions,zoom:1,scroll:[0,0],viewInset:[0,0],canvasOrigin:[0,0]});
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled&&document.querySelectorAll('.node').length===3);
  assert.deepEqual(await positions(),fixturePositions,'saved obstacle geometry restores without migration');
  assert.equal(await page.locator('#formattedMarkdownDrawer').isVisible(),false);
  const target=page.locator('.node[data-node="C target"]');await page.locator('#layout-lock').click();const box=await target.locator('.node-drag-handle').boundingBox();
  await page.mouse.move(box.x+20,box.y+22);await page.mouse.down();await page.mouse.move(box.x+700,box.y+22,{steps:8});await page.mouse.up();
  const inspect=()=>page.evaluate(()=>{
   const node=id=>{const n=document.querySelector(`.node[data-node="${id}"]`);return {x:parseFloat(n.style.left),y:parseFloat(n.style.top),w:260,h:68};};
   const edge=document.querySelector('.edge[data-relation="0"]'),length=edge.getTotalLength(),at=distance=>{const p=edge.getPointAtLength(distance);return [p.x,p.y];},box=edge.getBBox(),obstacle=node('B obstacle');
   const points=Array.from({length:257},(_,i)=>at(length*i/256));
   return {source:node('A source'),target:node('C target'),obstacle,start:at(0),afterStart:at(Math.min(1,length/4)),beforeEnd:at(Math.max(0,length-1)),end:at(length),path:edge.getAttribute('d'),collisions:edge.dataset.collisions,maxX:box.x+box.width,obstacleIntrusions:points.filter(([x,y])=>x>obstacle.x+.01&&x<obstacle.x+obstacle.w-.01&&y>obstacle.y+.01&&y<obstacle.y+obstacle.h-.01).length};
  });
  const route=await inspect();
  assert.ok(route.target.x>route.obstacle.x+route.obstacle.w,'target was dragged beyond the intervening card');assert.equal(route.target.x,1080);
  assert.ok(route.start[0]>route.source.x&&route.start[0]<route.source.x+route.source.w/2,'source uses a left-biased bottom port');
  assert.ok(Math.abs(route.start[1]-(route.source.y+route.source.h))<.01,'source port is on its bottom perimeter');
  assert.ok(Math.abs(route.afterStart[0]-route.start[0])<.01&&route.afterStart[1]>route.start[1],'source has a vertical outward stub');
  assert.ok(Math.abs(route.end[0]-route.target.x)<.01&&route.end[1]>=route.target.y&&route.end[1]<=route.target.y+route.target.h,'far-right target receives on its left perimeter');
  assert.ok(Math.abs(route.beforeEnd[1]-route.end[1])<.01&&route.beforeEnd[0]<route.end[0],'target entry is horizontal and approaches from the left');
  assert.equal(route.collisions,'0','dragged route avoids intervening card');assert.equal(route.obstacleIntrusions,0,'rendered SVG avoids the intervening card interior');
  assert.ok(route.maxX<=route.target.x+1,'route never loops behind far-right target');await assertRoundedPaths(page);
  const paths=await page.locator('.edge').evaluateAll(ns=>ns.map(n=>n.getAttribute('d')));await waitForSavedPositions(page,{'A source':[route.source.x,route.source.y],'B obstacle':[route.obstacle.x,route.obstacle.y],'C target':[route.target.x,route.target.y]});await readFacingStorage(page,'before-reload');await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);await readFacingStorage(page,'after-restore');assert.equal(await page.locator('#layout-lock').getAttribute('aria-pressed'),'true');assert.deepEqual(await inspect(),route);assert.deepEqual(await page.locator('.edge').evaluateAll(ns=>ns.map(n=>n.getAttribute('d'))),paths);assert.deepEqual(errors,[]);
  return {checks:'committed saved obstacle geometry independent of initial layout; real pointer drag beyond obstacle; left-biased bottom source/left target perimeter; vertical departure/horizontal entry stubs; rounded orthogonal route; endpoint direction; reload exact routes and positions',route,pageErrors:errors};
 }finally{console.log('FACING_DIAGNOSTIC '+JSON.stringify({trace,errors,limit:'Test-only instrumentation can affect event timing; no product code or equality assertion changed.'}));await page.close();}
}
