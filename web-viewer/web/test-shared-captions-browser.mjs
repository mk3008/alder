import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
import {withToolbarPage} from './test-toolbar-settings-browser.mjs';
import {openSourceAction} from './source-menu-browser.mjs';
import {ensureDocumentActions} from './test-tab-strip-browser.mjs';
// The published fixture has resolved findings; reopen one in-memory so the mobile badge clearance is measured.
const raw=readFileSync(new URL('../../tools/fixtures/shared-captions/purchase-request.md',import.meta.url),'utf8').replace('### Status\n\nresolved','### Status\n\nopen');
export async function verifySharedCaptions(browser){
 mkdirSync('web/evidence/wiring',{recursive:true});const results=[];
 for(const width of [320,393,1280])results.push(await withToolbarPage(browser,{width,height:900},async(page,errors)=>{
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open-text').disabled);
  await openSourceAction(page,'open-text');await page.locator('#source-text').fill(raw);await page.locator('#source-submit').click();await page.waitForFunction(()=>document.querySelectorAll('.node').length===13);
  if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
  const captions=()=>page.locator('.edge-label').evaluateAll(ns=>ns.map(n=>({text:n.textContent,members:n.dataset.relations.split(' ').map(Number),x:+n.getAttribute('x'),y:+n.getAttribute('y')})));
  const labels=await captions();assert.equal(await page.locator('.edge').count(),24);
  const common=labels.filter(l=>l.text==='認証済み作業者の識別情報');assert.equal(common.length,1);assert.equal(common[0].members.length,5);
  assert.equal(labels.filter(l=>l.text==='従業員の識別情報 / 役職').length,1);assert.equal(labels.filter(l=>l.text==='役職ごとの決裁単位の上限額').length,1);
  assert.deepEqual(labels.flatMap(l=>l.members).sort((a,b)=>a-b),Array.from({length:24},(_,i)=>i));
  const boxes=await page.evaluate(()=>({cards:[...document.querySelectorAll('.node')].map(n=>({id:n.dataset.node,x:parseFloat(n.style.left),y:parseFloat(n.style.top),w:n.offsetWidth,h:n.offsetHeight})),labels:[...document.querySelectorAll('.edge-label')].map(n=>{const b=n.getBBox();return {text:n.textContent,x:b.x,y:b.y,w:b.width,h:b.height};})}));
  const hit=(a,b)=>a.x<b.x+b.w&&b.x<a.x+a.w&&a.y<b.y+b.h&&b.y<a.y+a.h;
  for(let i=0;i<boxes.labels.length;i++){for(const n of boxes.cards)assert.equal(hit(boxes.labels[i],n),false,'caption avoids every card');for(const other of boxes.labels.slice(i+1))assert.equal(hit(boxes.labels[i],other),false,'distinct native captions do not overlap');}
  const auth=boxes.cards.find(n=>n.id==='認証基盤'),next=boxes.cards.filter(n=>n.y>auth.y).sort((a,b)=>a.y-b.y)[0];assert.equal(next.y-auth.y,112,'five identical lines reserve just one line');
  // A real selected card casts a 17px blur with 5px spread. At each viewport,
  // adjacent card text and its upward finding badge must clear that glow.
  await page.locator('.node').first().click({position:{x:45,y:30}});
  assert.equal(await page.locator('.node.selected').count(),1);
  const clearance=await page.evaluate(()=>{
    const selected=document.querySelector('.node.selected'),glow=getComputedStyle(selected).boxShadow;
    const nodes=[...document.querySelectorAll('.node')].map(node=>({
      node,x:parseFloat(node.style.left),y:parseFloat(node.style.top),height:node.offsetHeight,width:node.offsetWidth
    }));
    let pairs=0,badgePairs=0,minClearance=Infinity;
    for(const upper of nodes)for(const lower of nodes){
      if(upper===lower||lower.y<upper.y+upper.height)continue;
      if(Math.max(upper.x,lower.x)>=Math.min(upper.x+upper.width,lower.x+lower.width))continue;
      const badge=lower.node.querySelector('.finding-badges');
      const nodeRect=lower.node.getBoundingClientRect(),scale=nodeRect.width/lower.width;
      const lowerVisualTop=badge?lower.y+(badge.getBoundingClientRect().top-nodeRect.top)/scale:lower.y;
      const remaining=lowerVisualTop-(upper.y+upper.height+22);
      minClearance=Math.min(minClearance,remaining);pairs++;if(badge)badgePairs++;
    }
    return {glow,findings:document.querySelectorAll('.finding-badges').length,pairs,badgePairs,minClearance};
  });
  assert.match(clearance.glow,/17px/,'selected node uses the actual review glow');
  assert.ok(clearance.findings>0&&clearance.badgePairs>0,'the regression measures a visible upward finding badge');
  assert.ok(clearance.pairs>0&&clearance.minClearance>=8,'neighbor text/badges keep at least 8px beyond the 22px selection halo');
  for(let i=0;i<7;i++)await page.locator('#out').click();
  await page.screenshot({path:`web/evidence/wiring/real-shared-captions-${width}.png`});
  await page.locator('[data-node="購入結果を登録する"] .activity-open').click();await page.waitForFunction(()=>document.querySelector('.node.selected')?.dataset.node==='購入結果を登録する');
  assert.equal((await captions()).filter(l=>l.text==='認証済み作業者の識別情報').length,1);assert.equal(await page.locator('.edge').count(),4);
  await page.evaluate(()=>{const d=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,'src');Object.defineProperty(HTMLImageElement.prototype,'src',{...d,set(value){if(String(value).startsWith('data:image/svg+xml'))window.sharedExportSvg=decodeURIComponent(String(value).split(',').slice(1).join(','));d.set.call(this,value);}});});
  await ensureDocumentActions(page);const download=page.waitForEvent('download');await page.locator('#save-image').click();await download;
  const png=await page.evaluate(()=>{const d=new DOMParser().parseFromString(window.sharedExportSvg,'image/svg+xml');return {edges:d.querySelectorAll('.edge').length,labels:[...d.querySelectorAll('.edge-label')].map(e=>e.textContent)};});assert.equal(png.edges,4);assert.equal(png.labels.filter(t=>t==='認証済み作業者の識別情報').length,1);
  assert.deepEqual(errors,[]);return {width,edges:24,labels:labels.length,authenticationMembers:5,compactGap:112,detailEdges:4,png};
 }));return results;
}
