import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
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
     assert.ok(Math.abs(state.label[0]-state.start[0])>=30,'Input caption is beside vertical leg');
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
 return results;
}

// Acceptance uses the shipped standard sample, not just an easy synthetic star.
export async function verifyRealWiring(browser){
 const results=[];
 for(const width of [1280,393,320]){
  const context=await browser.newContext({viewport:{width,height:900},hasTouch:width!==1280}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(5000);
  const positions=()=>page.locator('.node').evaluateAll(ns=>Object.fromEntries(ns.map(n=>[n.dataset.node,[parseFloat(n.style.left),parseFloat(n.style.top)]])));
  const saved=()=>page.waitForFunction(()=>['saved','unchanged'].includes(document.querySelector('#app').dataset.saveState));
  try{
   await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('#open-sample').click();
   if(await page.locator('#check-followup').isVisible())await page.locator('#check-followup-later').click();
   const overview=await positions();await page.locator('.node[data-activity="業務設計"] .activity-open').press('Enter');
   assert.equal(await page.locator('.node').count(),8);const detail=await positions();
   if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
   const inspect=()=>page.evaluate(()=>{
    const card=id=>{const n=[...document.querySelectorAll('.node')].find(n=>n.dataset.node===id);return {x:parseFloat(n.style.left),y:parseFloat(n.style.top),width:260,height:68};};
    const target=card('業務設計'),inputs=[];
    for(const label of document.querySelectorAll('.edge-label')){
     const r=label.dataset.relation,path=document.querySelector(`.edge[data-relation="${r}"]`),title=path.querySelector('title').textContent;
     const sourceID=['Alder: 業務ナレッジ','Alder: 業務相関ナレッジ','依頼者','業務設計書'].find(id=>title.startsWith(id+' → 業務設計: '));if(!sourceID)continue;
     const length=path.getTotalLength(),points=Array.from({length:257},(_,i)=>{const p=path.getPointAtLength(length*i/256);return [p.x,p.y];}),glyph=label.getBBox();
     inputs.push({sourceID,source:card(sourceID),points,label:[+label.getAttribute('x'),+label.getAttribute('y')],glyph:{x:glyph.x,y:glyph.y,width:glyph.width,height:glyph.height},collisions:+path.dataset.collisions});
    }
    return {target,inputs,cards:[...document.querySelectorAll('.node')].map(n=>card(n.dataset.node)),exceptions:[...document.querySelectorAll('.edge.exception')].map(n=>[n.dataset.relation,n.getAttribute('d')])};
   });
   const initial=await inspect();assert.equal(initial.inputs.length,4);assert.equal(initial.exceptions.length,2);
   for(const theme of ['light','dark']){
    if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();
    const measured=await inspect();
    for(const r of measured.inputs){
     assert.equal(r.collisions,0);assert.ok(r.label[1]>=r.source.y+r.source.height&&r.label[1]<=r.source.y+r.source.height+28,'all four captions follow their Object, including horizontal return departures');
     for(const n of measured.cards)assert.ok(r.glyph.x+r.glyph.width<=n.x||n.x+n.width<=r.glyph.x||r.glyph.y+r.glyph.height<=n.y||n.y+n.height<=r.glyph.y,'native Input glyph never covers a card');
     if(r.source.y<measured.target.y){
      assert.equal(r.points[0][1],r.source.y+r.source.height);
      assert.equal(r.points.at(-1)[1],measured.target.y,'normal Input arrives at Activity top, not its right side');
      assert.ok(r.points.slice(1).every((p,i)=>p[0]>=r.points[i][0]-.01&&p[1]>=r.points[i][1]-.01),'real sample Input reads down/right');
      assert.ok(Math.max(...r.points.map(p=>p[0]))<=measured.target.x+measured.target.width,'no exterior right detour');
     }
    }
    assert.deepEqual(measured.exceptions,initial.exceptions);
    await page.locator('#node-list-toggle').click();await page.locator('#node-category-object').click();await page.locator('[data-list-node="Alder: 業務ナレッジ"] .node-navigate').click();await page.locator('#node-list-close').click();
    if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
    // Fit the reported detail into a mobile review image using product zoom.
    for(let i=0;i<3;i++)await page.locator('#out').click();
    await page.locator('#viewport').evaluate(view=>{
     const first=document.querySelector('.node[data-node="Alder: 業務ナレッジ"]').getBoundingClientRect(),v=view.getBoundingClientRect();
     view.scrollLeft+=first.left-v.left-24;view.scrollTop+=first.top-v.top-24;
    });
    await page.screenshot({path:`web/evidence/wiring/real-${width}-${theme}.png`});
    for(let i=0;i<3;i++)await page.locator('#in').click();
   }
   await saved();await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);assert.deepEqual(await positions(),detail,'existing detail positions survive reload');
   await page.locator('.tab').first().locator('button').first().click();assert.deepEqual(await positions(),overview,'other view positions remain exact');
   assert.deepEqual(errors,[]);results.push({width,nodes:8,forwardInputs:2,sideDepartureCaptions:2,exceptions:2,lightDark:true,nativeGlyphCardCollisions:0,savedPositionsExact:true});
  }finally{await context.close();}
 }
 return results;
}
