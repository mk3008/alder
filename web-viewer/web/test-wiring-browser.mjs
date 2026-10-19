import {verifyRolePorts} from './test-role-ports-browser.mjs';
import {activityDesign} from '../src/activities.ts';
import {matrixPlan} from '../src/matrix-layout.ts';
import {initialPositions} from '../src/layout.ts';
import {parseDesign} from '../src/graph.ts';
import assert from 'node:assert/strict';
import {mkdirSync,readFileSync} from 'node:fs';
const saved128=JSON.parse(readFileSync(new URL('./authorities/overview-128-layout.json',import.meta.url),'utf8'));
import {openSourceAction} from './source-menu-browser.mjs';
const object=id=>`# Object ${id}\n\n## Scope\n\ntrue\n\n## Icon\n\nfile-text\n\n## Information\n\n- Record\n\n`;
const activity=(id,label,output='(none)')=>`# Activity ${id}\n\n## Scope\n\ntrue\n\n## Why\n\nReview\n\n## When\n\nRequested\n\n## Who\n\nReviewer\n\n## Where\n\nOffice\n\n## How\n\n### Input\n\n- Record — ${label}\n\n### Procedure\n\nReview record\n\n### Output\n\n${output}\n\n## Result\n\nReviewed\n\n`;
const source='# Wiring\n\n'+object('Record')+object('Result')+activity('Review A','data A')+activity('Review B','data B','- Result — written');
export async function verifyWiring(browser){
 const results=[];mkdirSync('web/evidence/wiring',{recursive:true});
 for(const width of [1280,320]){
  const context=await browser.newContext({viewport:{width,height:900},hasTouch:width===320}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(5000);
  try{
   await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);
   await openSourceAction(page,'open-text');await page.locator('#source-text').fill(source);await page.locator('#source-submit').click();
   await page.locator('.node[data-node="Record"]').waitFor();if(await page.locator('#check-followup').isVisible())await page.locator('#check-followup-later').click();
   if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
   const coords=()=>page.locator('.node').evaluateAll(ns=>Object.fromEntries(ns.map(n=>[n.dataset.node,[parseFloat(n.style.left),parseFloat(n.style.top)]])));
   const original=await coords();
   for(const theme of ['light','dark']){
    if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();
    for(const detail of [false,true]){
     if(detail)await page.locator('.node[data-node="Review A"] .activity-open').press('Enter');
     await page.locator('#node-list-toggle').click();await page.locator('#node-category-object').click();await page.locator('[data-list-node="Record"] .node-navigate').click();
     if(await page.locator('#node-list-drawer').isVisible())await page.locator('#node-list-close').click();
     if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
     const state=await page.evaluate(()=>{
      const s=document.querySelector('.node[data-node="Record"]'),p=document.querySelector('.edge[data-relation="0"]'),label=document.querySelector('.edge-label[data-relation="0"]'),children=[...document.querySelector('#edges').children].filter(e=>e.matches('.edge,.edge-label'));
      const layer=e=>e.classList.contains('review-related')?(e.classList.contains('edge-label')?3:2):(e.classList.contains('edge-label')?1:0);
      const start=p.getPointAtLength(0),length=p.getTotalLength(),points=Array.from({length:101},(_,i)=>{const q=p.getPointAtLength(length*i/100);return [q.x,q.y];});
      const labels=[...document.querySelectorAll('.edge-label')].map(n=>{const b=n.getBBox();return {x:b.x,y:b.y,width:b.width,height:b.height};});
      return {selected:s.classList.contains('selected'),source:[parseFloat(s.style.left),parseFloat(s.style.top)],start:[start.x,start.y],label:[+label.getAttribute('x'),+label.getAttribute('y')],points,layers:children.map(layer),labels,nodeAbove:!!(document.querySelector('#edges').compareDocumentPosition(document.querySelector('#nodes'))&Node.DOCUMENT_POSITION_FOLLOWING),opaque:[...document.querySelectorAll('.node')].every(n=>getComputedStyle(n).opacity==='1'&&!getComputedStyle(n).backgroundColor.endsWith(', 0)'))};
     });
     assert.equal(state.selected,true);assert.equal(state.nodeAbove,true);assert.equal(state.opaque,true);
     assert.ok(state.layers.every((n,i)=>!i||state.layers[i-1]<=n),'selected wires/labels are above all unrelated wires/labels');
     assert.ok(state.points.slice(1).every((p,i)=>p[0]>=state.points[i][0]-.01&&p[1]>=state.points[i][1]-.01),'normal route reads down/right');
     assert.ok(state.label[1]>state.source[1]+68&&state.label[1]<=state.source[1]+96,'Input caption is near source');
     assert.ok(state.labels[0].x>=state.start[0]+8||state.labels[0].x+state.labels[0].width<=state.start[0]-8,'complete left-aligned Input glyph clears vertical leg');
     for(let i=0;i<state.labels.length;i++)for(let j=i+1;j<state.labels.length;j++){
      const a=state.labels[i],b=state.labels[j];assert.ok(a.x+a.width<=b.x||b.x+b.width<=a.x||a.y+a.height<=b.y||b.y+b.height<=a.y,'rendered captions do not overlap');
     }
     await page.screenshot({path:`web/evidence/wiring/${width}-${theme}-${detail?'detail':'overview'}.png`});
     // Existing hide/show clears selection without changing saved coordinates.
     await page.locator('#node-list-toggle').click();await page.locator('#node-category-object').click();
     const eye=page.locator('[data-list-node="Record"] .node-eye');await eye.click();await eye.click();
     await page.locator('#node-list-close').click();assert.equal(await page.locator('.node.selected').count(),0);
     assert.equal(await page.locator('.edge.review-related,.edge-label.review-related').count(),0);
     if(detail)await page.locator('.tab').first().locator('button').first().click();
    }
   }
   assert.deepEqual(await coords(),original,'selection/theme/detail switches do not move saved cards');
   assert.deepEqual(errors,[]);results.push({width,overview:true,detail:true,lightDark:true,sourceCaption:true,captionCollision:false,layerOrder:true,coordinatesUnchanged:true});
  }finally{await context.close();}
 }
 results.push({realSample:await verifyRealWiring(browser)});
 results.push({rolePorts:await verifyRolePorts(browser)});
 return results;
}

// Acceptance uses the shipped standard sample, not just an easy synthetic star.
export async function verifyRealWiring(browser){
 const results=[],specs=[
  {activity:'業務設計',slug:'business',stair:['Alder: 業務ナレッジ','Alder: 業務相関ナレッジ','業務設計'],count:8,exceptions:2},
  {activity:'検査項目の設計',slug:'check',stair:['Alder: 検査項目設計ナレッジ','業務設計書','検査項目の設計'],count:6,exceptions:1}
 ];
 for(const width of [1280,393,320]){
  const context=await browser.newContext({viewport:{width,height:1000},hasTouch:width!==1280}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(5000);
  const positions=()=>page.locator('.node').evaluateAll(ns=>Object.fromEntries(ns.map(n=>[n.dataset.node,[parseFloat(n.style.left),parseFloat(n.style.top)]])));
  const saved=()=>page.waitForFunction(()=>['saved','unchanged'].includes(document.querySelector('#app').dataset.saveState));
  const closeDrawers=async()=>{if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();};
  const inspect=()=>page.evaluate(()=>{
   const cards=[...document.querySelectorAll('.node')].map(n=>{const b=n.getBoundingClientRect(),icon=n.firstElementChild.getBoundingClientRect();return {id:n.dataset.node,x:parseFloat(n.style.left),y:parseFloat(n.style.top),width:260,height:68,object:n.classList.contains('object'),iconX:parseFloat(n.style.left)+(icon.x+icon.width/2-b.x)*260/b.width};});
   const wires=[...document.querySelectorAll('.edge')].map(path=>{
    const title=path.querySelector('title').textContent,source=cards.find(n=>title.startsWith(n.id+' → ')),target=cards.find(n=>title.startsWith(source.id+' → '+n.id+': '));
    const label=document.querySelector(`.edge-label[data-relations~="${path.dataset.relation}"]`),b=label.getBBox(),length=path.getTotalLength();
    return {index:+path.dataset.relation,source,target,title,labelText:label.textContent,anchor:label.getAttribute('text-anchor'),label:[+label.getAttribute('x'),+label.getAttribute('y')],glyph:{x:b.x,y:b.y,width:b.width,height:b.height},points:Array.from({length:257},(_,i)=>{const p=path.getPointAtLength(length*i/256);return [p.x,p.y];}),exception:path.classList.contains('exception'),paintRuns:document.querySelectorAll(`.edge-paint[data-relation="${path.dataset.relation}"]`).length,dash:getComputedStyle(path).strokeDasharray,marker:path.getAttribute('marker-end'),collisions:+path.dataset.collisions};
   });return {cards,wires};
  });
  const sourceDesign=parseDesign(readFileSync('web/authorities/ungrouped-alder.md','utf8'));let routeDesign=sourceDesign,sourcePlan=matrixPlan(sourceDesign.graph,sourceDesign.activityOrder);
  const assertDeparture=(r,fixed=false,matrixReturn)=>{
   const ri=routeDesign.graph.relations.findIndex(e=>e.from===r.source.id&&e.to===r.target.id&&e.label===r.labelText),wire=sourcePlan.wires[ri];
   const returning=matrixReturn??wire.returning;
   if(returning||r.exception){
    assert.ok(Math.abs(r.points[0][0]-r.source.x-260)<.01);assert.ok(Math.abs(r.points[0][1]-r.source.y-68*(wire.fromPort??.5))<.01);assert.ok(r.points[1][0]>r.points[0][0]);
    if(returning&&fixed&&r.source.x>=r.target.x)assert.ok(Math.abs(Math.max(...r.points.map(p=>p[0]))-r.source.x-282-16*(wire.returnLane??0))<.01,'aligned return corridor uses constant card clearance');
    assert.ok(Math.abs(r.points.at(-1)[0]-r.target.x-260)<.01);assert.ok(Math.abs(r.points.at(-1)[1]-r.target.y-68*(wire.toPort??.5))<.01);assert.ok(r.points.at(-2)[0]>r.points.at(-1)[0]);
    assert.ok(r.points.some(p=>p[1]<r.points[0][1])||r.target.y>=r.source.y,'right return preserves directed arrival');
   }else{
    assert.ok(Math.abs(r.points[0][0]-(r.source.x+32.5))<.01);assert.equal(r.points[0][1],r.source.y+68);
    assert.ok(Math.abs(r.points[0][0]-r.source.iconX)<=6,'ordinary/exception departure follows rendered icon column');assert.ok(r.points[1][1]>r.points[0][1]);
   }
  };
  try{
   await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('#open-sample').click();
   if(await page.locator('#check-followup').isVisible())await page.locator('#check-followup-later').click();await closeDrawers();
   const overview=await positions();
   const columns=[...new Set(Object.values(overview).map(p=>p[0]))].sort((a,b)=>a-b);for(let i=1;i<columns.length;i++)assert.equal(columns[i]-columns[i-1],64,'overview uses the same compact step as detail');
   // Freeze a real older overview in IndexedDB while the app is disposed.
   // Restore must preserve it; only the user's reset operation applies 64.
   await saved();await page.route('**/__overview-layout-seed__',route=>route.fulfill({contentType:'text/html',body:'<p>layout fixture</p>'}));await page.goto('http://127.0.0.1:4173/__overview-layout-seed__');
   await page.evaluate(positions=>new Promise((resolve,reject)=>{const request=indexedDB.open('alder-web-viewer',1);request.onerror=()=>reject(request.error);request.onsuccess=()=>{const db=request.result,tx=db.transaction('session','readwrite'),store=tx.objectStore('session'),get=store.get('current');get.onsuccess=()=>{const state=get.result,view=(state.views??state.tabs).find(v=>v.key===state.active);view.positions=positions;store.put(state,'current');};tx.oncomplete=()=>{db.close();resolve();};tx.onerror=tx.onabort=()=>{db.close();reject(tx.error);};};}),saved128);
   await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);assert.deepEqual(await positions(),saved128,'old overview survives native restore without migration');await closeDrawers();
   await page.locator('#display-settings-toggle').click();await page.locator('#reset-layout').click();await page.locator('#display-settings-toggle').click();assert.deepEqual(await positions(),overview,'explicit overview reset applies common 64-unit layout');await saved();await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);assert.deepEqual(await positions(),overview,'new overview reset survives reload');
   for(const theme of ['light','dark']){if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();for(let i=0;i<7;i++)await page.locator('#out').click();await page.locator('#viewport').evaluate(v=>{v.scrollLeft=0;v.scrollTop=0;});await page.screenshot({path:`web/evidence/wiring/real-overview-${width}-${theme}.png`});for(let i=0;i<7;i++)await page.locator('#in').click();}

   const overviewRoutes=await inspect();const matrixDesign=parseDesign(readFileSync('web/authorities/ungrouped-alder.md','utf8')),matrix=matrixPlan(matrixDesign.graph,matrixDesign.activityOrder);for(const r of overviewRoutes.wires){assertDeparture(r,false,matrix.wires[r.index].returning);assert.equal(r.collisions,0,'all approved initial L/return paths clear every card');if(r.source.id.startsWith('Alder: ')&&!r.exception){assert.deepEqual(r.points.at(-1),[r.target.x,r.target.y+34],'upstream Knowledge Input enters Activity on the left');assert.equal(r.collisions,0);}}
   for(const spec of specs){
    routeDesign=activityDesign(sourceDesign,spec.activity);sourcePlan=matrixPlan(routeDesign.graph,routeDesign.activityOrder,spec.activity);
    await page.locator(`.node[data-activity="${spec.activity}"] .activity-open`).press('Enter');await closeDrawers();
    assert.equal(await page.locator('.node').count(),spec.count);const detail=await positions();
    spec.stair.forEach((id,i)=>assert.deepEqual(detail[id],[40+i*64,40+i*112],'ordinary Input then focus staircase'));
    const outputIDs=sourceDesign.graph.relations.filter(r=>r.kind==='output'&&r.from===spec.activity).map(r=>r.to);
    for(const n of sourceDesign.graph.nodes.filter(n=>n.type==='business'&&n.id!==spec.activity&&detail[n.id]))for(const id of outputIDs)assert.ok(detail[n.id][1]>detail[id][1],'exception peers follow every ordinary Output');
    for(const theme of ['light','dark']){
     if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();
     const measured=await inspect(),overlap=(a,b)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
     assert.equal(measured.wires.filter(r=>r.exception).length,spec.exceptions);let inputs=0;
     for(const [i,r]of measured.wires.entries()){
      assert.equal(r.collisions,0);assertDeparture(r,true);assert.equal(r.anchor,'start');
      if(!r.exception&&r.source.id===spec.activity){assert.ok(r.label[0]>=r.points[0][0]+8-.01,'Output text starts at or to the right of its departure');assert.equal(r.label[1],r.source.y+82+sourcePlan.wires[r.index].captionLane*22,'Output caption follows source stack');}
      assert.ok(r.marker.includes('arrow'));assert.equal(r.title,r.source.id+' → '+r.target.id+': '+r.labelText,'directed endpoints and label meaning preserved');
      if(r.exception){assert.notEqual(r.dash,'none');assert.ok(r.paintRuns>0,'exception has visible coordinate-phased paint runs');if(spec.slug==='check'){assert.equal(r.source.id,'検査項目の設計');assert.equal(r.target.id,'業務設計');assert.ok(r.points.at(-1)[1]>r.points[0][1]);}}
      if(!r.exception&&r.target.id===spec.activity){
       inputs++;if(r.source.y>=r.target.y+68){assert.ok(r.label[0]>=Math.max(...r.points.map(p=>p[0]))+8-.01,'return caption starts beyond the outer bend');assert.ok(Math.abs(r.label[1]-r.points[0][1])<.001,'return caption shares the bend height');}else assert.equal(r.label[1],r.source.y+82+sourcePlan.wires[r.index].captionLane*22,'forward Input stays in its source stack');
       if(r.source.y<r.target.y){assert.equal(r.points.at(-1)[0],r.target.x);assert.ok(r.points.slice(1).every((p,j)=>p[0]>=r.points[j][0]-.01&&p[1]>=r.points[j][1]-.01),'forward Input remains down/right');}
      }
      for(const n of measured.cards)assert.equal(overlap(r.glyph,n),false,'native Japanese glyph does not cover shapes');
      for(const other of measured.wires.slice(i+1))assert.equal(overlap(r.glyph,other.glyph),false,'native captions do not overlap');
     }assert.equal(inputs,4);
     // Product zoom and ordinary scrolling only; screenshots show all nodes.
     const outs=width===1280?0:5;for(let i=0;i<outs;i++)await page.locator('#out').click();
     await page.locator('#viewport').evaluate(v=>{v.scrollLeft=0;v.scrollTop=0;});
     await page.screenshot({path:`web/evidence/wiring/real-${spec.slug}-${width}-${theme}.png`});
     for(let i=0;i<outs;i++)await page.locator('#in').click();
    }
    // Reproduce the review: drag the downstream data Object far below its
    // initial row. Both captions must follow their own endpoint, at real zoom.
    await page.locator('#layout-lock').click();
    const dataID=spec.slug==='business'?'業務設計書':'検査項目';
    const data=page.locator(`.node[data-node="${dataID}"]`);await data.scrollIntoViewIfNeeded();
    const dataBox=await data.boundingBox();
    await page.mouse.move(dataBox.x+80,dataBox.y+30);await page.mouse.down();await page.mouse.move(dataBox.x+105,dataBox.y+480,{steps:8});await page.mouse.up();
    const dragged=await positions();assert.ok(dragged[dataID][1]>detail[dataID][1]+400);
    const checkCaptions=async()=>{
     const measured=await inspect(),incoming=measured.wires.find(r=>!r.exception&&r.target.id===dataID&&r.source.id===spec.activity),returning=measured.wires.find(r=>!r.exception&&r.source.id===dataID&&r.target.id===spec.activity);
     assert.equal(incoming.anchor,'start');assert.equal(returning.anchor,'start');
     assert.ok(incoming.label[0]>=incoming.points[0][0]+8-.01,'Output text clears its departure');assert.equal(incoming.label[1],incoming.source.y+82+sourcePlan.wires[incoming.index].captionLane*22,'dragging target never moves caption away from source stack');
     assert.ok(returning.label[0]>=Math.max(...returning.points.map(p=>p[0]))+8-.01,'return caption follows the dragged bend');assert.ok(Math.abs(returning.label[1]-returning.points[0][1])<.001,'return caption shares the dragged bend height');
     for(const r of [incoming,returning])for(const n of measured.cards)assert.ok(!(r.glyph.x<n.x+n.width&&r.glyph.x+r.glyph.width>n.x&&r.glyph.y<n.y+n.height&&r.glyph.y+r.glyph.height>n.y),'dragged captions clear shapes');
    };
    await checkCaptions();await saved();await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);assert.deepEqual(await positions(),dragged);await checkCaptions();
    for(let i=0;i<5;i++)await page.locator('#out').click();await checkCaptions();
    await page.screenshot({path:`web/evidence/wiring/dragged-${spec.slug}-${width}.png`});
    for(let i=0;i<5;i++)await page.locator('#in').click();
    await page.locator('#display-settings-toggle').click();await page.locator('#reset-layout').click();await page.locator('#display-settings-toggle').click();assert.deepEqual(await positions(),detail);
    // Move a node through the actual drag UI, persist/reload, then explicitly reset.
    await page.locator('#layout-lock').click();const first=page.locator(`.node[data-node="${spec.stair[0]}"]`);await first.scrollIntoViewIfNeeded();const box=await first.boundingBox();
    await page.mouse.move(box.x+50,box.y+30);await page.mouse.down();await page.mouse.move(box.x+80,box.y+60,{steps:4});await page.mouse.up();
    const moved=await positions();assert.notDeepEqual(moved[spec.stair[0]],detail[spec.stair[0]]);await saved();await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);assert.deepEqual(await positions(),moved,'manual saved coordinates survive native reload');
    await page.locator('#display-settings-toggle').click();await page.locator('#reset-layout').click();await page.locator('#display-settings-toggle').click();assert.deepEqual(await positions(),detail,'explicit reset uses new staircase');await saved();await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);assert.deepEqual(await positions(),detail,'new reset survives reload');
    await page.locator('.tab').first().locator('button').first().click();assert.deepEqual(await positions(),overview,'other view remains exact');
    results.push({width,activity:spec.activity,nodes:spec.count,sourceCaptions:4,commonOutlets:true,exceptionMeaning:true,nativeGlyphOverlaps:0,manualSaveReload:true,resetReload:true});
   }
   assert.deepEqual(errors,[]);
  }finally{await context.close();}
 }
 return results;
}
