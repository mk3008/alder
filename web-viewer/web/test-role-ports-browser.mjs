import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {openSourceAction} from './source-menu-browser.mjs';
export async function verifyRolePorts(browser){
 const results=[];
 for(const width of [1280,320]){
  const context=await browser.newContext({viewport:{width,height:1000}}),page=await context.newPage();
  try{
   await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);
   await openSourceAction(page,'open-text');await page.locator('#source-text').fill(readFileSync('web/authorities/activity-return-ports.md','utf8'));await page.locator('#source-submit').click();await page.locator('.node[data-activity="確認"]').waitFor();
   if(await page.locator('#check-followup').isVisible())await page.locator('#check-followup-later').click();
   if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
   const inspect=()=>page.evaluate(()=>{
    const focus=document.querySelector('.node[data-node="確認"]'),x=parseFloat(focus.style.left),y=parseFloat(focus.style.top);
    return [...document.querySelectorAll('.edge')].map(e=>{const a=e.getPointAtLength(0),b=e.getPointAtLength(e.getTotalLength());return {title:e.querySelector('title').textContent,path:e.getAttribute('d'),a:[a.x-x,a.y-y],b:[b.x-x,b.y-y]};});
   });
   for(const detail of [false,true]){
    if(detail)await page.locator('.node[data-activity="確認"] .activity-open').press('Enter');
    const paths=await inspect(),find=prefix=>paths.find(e=>e.title.startsWith(prefix));
    assert.deepEqual(find('記録 → 確認:').b,[260,17],'data return ends at 1/4');
    assert.deepEqual(find('差し戻し元 → 確認:').b,[260,34],'process return ends at 1/2');
    assert.deepEqual(find('確認 → 例外対応:').a,[260,51],'process return starts at 3/4');
    assert.deepEqual(find('確認 → 記録:').a,[32.5,68],'normal Output keeps icon-side bottom outlet');
    if(detail){
     const positions=await page.locator('.node').evaluateAll(ns=>Object.fromEntries(ns.map(n=>[n.dataset.node,parseFloat(n.style.top)])));
     assert.ok(positions['差し戻し元']>positions['記録']&&positions['例外対応']>positions['記録'],'all exception Activities follow normal Output');
    }
    await page.locator('#display-settings-toggle').click();await page.locator('#show-exceptions').click();await page.locator('#display-settings-toggle').click();
    assert.deepEqual((await inspect()).find(e=>e.title.startsWith('記録 → 確認:')).b,[260,17],'hiding process returns leaves data port fixed');
    await page.locator('#display-settings-toggle').click();await page.locator('#show-exceptions').click();await page.locator('#display-settings-toggle').click();assert.deepEqual(await inspect(),paths);
    if(width===320)for(let i=0;i<5;i++)await page.locator('#out').click();
    await page.locator('#viewport').evaluate(v=>{v.scrollLeft=0;v.scrollTop=0;});await page.screenshot({path:`web/evidence/wiring/real-three-roles-${width}-${detail?'detail':'overview'}.png`});
    if(width===320)for(let i=0;i<5;i++)await page.locator('#in').click();
   }
   // The reported shared Object must split arrival and departure roles too.
   await openSourceAction(page,'open-text');await page.locator('#source-text').fill(readFileSync('../business-design/alder/README.md','utf8'));await page.locator('#source-submit').click();await page.locator('.node[data-node="依頼者"]').waitFor();
   if(await page.locator('#check-followup').isVisible())await page.locator('#check-followup-later').click();
   if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
   const requester=await page.evaluate(()=>{
    const n=document.querySelector('.node[data-node="依頼者"]'),x=parseFloat(n.style.left)+260,y=parseFloat(n.style.top);
    const arrivals=[],departures=[];
    for(const e of document.querySelectorAll('.edge')){const title=e.querySelector('title').textContent,a=e.getPointAtLength(0),b=e.getPointAtLength(e.getTotalLength());if(title.includes(' → 依頼者:')&&Math.abs(b.x-x)<.01)arrivals.push(b.y-y);if(title.startsWith('依頼者 → ')&&Math.abs(a.x-x)<.01)departures.push(a.y-y);}
    return {arrivals,departures};
   });
   assert.equal(requester.arrivals.length,4);assert.equal(requester.departures.length,1);
   for(const y of requester.arrivals)assert.ok(Math.abs(y-68/3)<.001,'Object return arrivals use 1/3');for(const y of requester.departures)assert.ok(Math.abs(y-136/3)<.001,'Object return departure uses 2/3');
   // Captions follow their own bend on its row; the existing text halo
   // keeps unrelated wire crossings readable.
   const captions=await page.evaluate(()=>{
    const wires=[...document.querySelectorAll('.edge')].map(e=>{const length=e.getTotalLength(),a=e.getPointAtLength(0),label=document.querySelector(`.edge-label[data-relation="${e.dataset.relation}"]`),b=label.getBBox();return {title:e.querySelector('title').textContent,a:[a.x,a.y],label:[+label.getAttribute('x'),+label.getAttribute('y')],box:{x:b.x,y:b.y,width:b.width,height:b.height},points:Array.from({length:257},(_,i)=>{const p=e.getPointAtLength(length*i/256);return [p.x,p.y];})};});
    return {all:wires,focus:wires.filter(r=>r.title.startsWith('検査項目の設計 → ')&&r.points[1][0]>r.a[0]&&r.points[1][1]===r.a[1])};
   });
   assert.equal(captions.focus.length,2);
   for(const r of captions.focus){assert.ok(Math.abs(r.label[1]-r.a[1])<.001,'caption at actual bend row');assert.ok(Math.abs(r.box.x-(Math.max(...r.points.map(p=>p[0]))+8))<.1,'native caption immediately follows its bend');}

   for(const id of ['依頼者','検査項目の設計']){
    await page.locator('#node-list-toggle').click();if(id==='依頼者')await page.locator('#node-category-object').click();else await page.locator('#node-category-activity').click();await page.locator(`[data-list-node="${id}"] .node-navigate`).click();if(await page.locator('#node-list-drawer').isVisible())await page.locator('#node-list-close').click();if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
    await page.screenshot({path:`web/evidence/wiring/real-${id==='依頼者'?'requester':'caption-bend'}-${width}.png`});
   }
   results.push({requester,width,captionBends:true,captionAtOwnBend:true});
   results.push({width,roles:3,ports:[17,34,51],overview:true,detail:true,filterStable:true});
  }finally{await context.close();}
 }
 return results;
}
