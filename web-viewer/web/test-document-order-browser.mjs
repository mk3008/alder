import {assertCaptionRows} from './caption-row-oracle.mjs';
import {useUngroupedSample} from './legacy-sample-browser.mjs';
import {openSourceAction} from './source-menu-browser.mjs';
import {ensureDocumentActions} from './test-tab-strip-browser.mjs';
import {openDisplaySettings} from './toolbar-settings-control.mjs';
import {setScope} from './scope-control.mjs';
import {assertRoundedPaths} from './test-controls-browser.mjs';
import {parseDesign} from '../src/graph.ts';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
// Independently derive the small public fixture's SCC/order constraints. This
// avoids treating historical 220-unit review coordinates as today's layout.
export function assertCompactStaircase(positions,design){
 const {nodes,relations}=design.graph,ids=nodes.map(n=>n.id),normal=relations.filter(r=>r.kind==='input'||r.kind==='output');
 const reach=new Map(ids.map(id=>{
  const visited=new Set([id]),queue=[id];
  for(let i=0;i<queue.length;i++)for(const r of normal)if(r.from===queue[i]&&!visited.has(r.to)){visited.add(r.to);queue.push(r.to);}
  return [id,visited];
 }));
 const sameComponent=(a,b)=>reach.get(a).has(b)&&reach.get(b).has(a);
 const order=new Map(design.activityOrder.map((id,i)=>[id,2*i]));
 for(const n of nodes.filter(n=>n.type==='object')){
  const writers=normal.filter(r=>r.kind==='output'&&r.to===n.id&&sameComponent(r.from,n.id));
  order.set(n.id,Math.min(Infinity,...writers.map(r=>order.get(r.from)+1)));
 }
 const forward=normal.filter(r=>!sameComponent(r.from,r.to)||order.get(r.from)<order.get(r.to));
 const rank=new Map(ids.map(id=>[id,0]));let changed=true,passes=0;
 while(changed){assert.ok(passes++<=ids.length,'forward constraints must be acyclic');changed=false;for(const r of forward){const next=rank.get(r.from)+1;if(rank.get(r.to)<next){rank.set(r.to,next);changed=true;}}}
 assert.deepEqual(Object.keys(positions).sort(),ids.slice().sort());assertCaptionRows(positions,forward);
 for(const id of ids){const [x,y]=positions[id];assert.ok(Number.isInteger((x-40)/64)&&x>=40,'logical column projects exactly to the 64-unit grid');assert.ok(Number.isInteger(y)&&y>=40,'vertical projection is finite and integral');}
 for(const r of forward){
  const a=positions[r.from],b=positions[r.to];assert.ok(a[0]+32.5<b[0]&&a[1]+68<b[1],'forward L has a lower-right target: '+r.from+' → '+r.to);
  for(const id of ids.filter(id=>id!==r.from&&id!==r.to)){const n=positions[id],x=a[0]+32.5;assert.ok(!(x>n[0]&&x<n[0]+260&&n[1]<b[1]+34&&n[1]+68>a[1]+68),'vertical L corridor clears '+id);}
 }
 for(let i=0;i<ids.length;i++)for(let j=0;j<i;j++){const [ax,ay]=positions[ids[i]],[bx,by]=positions[ids[j]];assert.ok(ax+260<=bx||bx+260<=ax||ay+68<=by||by+68<=ay,'compact cards do not overlap: '+ids[i]+' / '+ids[j]);}
 return {forward:forward.length,feedback:normal.length-forward.length};
}
export async function verifyDocumentOrder(browser){
 const page=await browser.newPage({viewport:{width:1280,height:960}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const raw=readFileSync('web/authorities/ungrouped-alder.md','utf8'),order=raw.split('\n').filter(l=>l.startsWith('# Activity ')).map(l=>l.slice(11));
 const positions=()=>page.locator('.node').evaluateAll(ns=>Object.fromEntries(ns.map(n=>[n.dataset.node,[parseFloat(n.style.left),parseFloat(n.style.top)]])));
 try{
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled);await page.locator('#open-sample').click();await useUngroupedSample(page);await page.locator('#drawer').click();
  const initial=await positions();const old=JSON.parse(readFileSync('web/authorities/overview-matrix-c407.json','utf8'));for(const [id,[x]]of Object.entries(old))assert.equal(initial[id][0],x,'approved horizontal corridors remain exact');assert.deepEqual(Object.keys(initial).sort((a,b)=>initial[a][1]-initial[b][1]),Object.keys(old).sort((a,b)=>old[a][1]-old[b][1]),'approved row order remains exact');assert.ok(initial['業務設計書'][0]<initial['同期漏れ検査'][0]);const constraints=assertCompactStaircase(initial,parseDesign(raw));assert.deepEqual(constraints,{forward:49,feedback:12});assert.equal(Math.max(...Object.values(initial).map(p=>p[0])),1384,'approved matrix rightmost column remains exact');
  for(const width of [320,393,1280]){await page.setViewportSize({width,height:960});assert.deepEqual(await positions(),initial,'viewport does not change initial layout');}
  const boxes=await page.locator('.node').evaluateAll(ns=>ns.map(n=>{const b=n.getBoundingClientRect();return {x:b.x,y:b.y,w:b.width,h:b.height};}));
  for(let i=0;i<boxes.length;i++)for(let j=0;j<i;j++){const a=boxes[i],b=boxes[j];assert.ok(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y);}
  const extent=await page.locator('#edges').evaluate(svg=>{const b=svg.getBBox();return {width:parseFloat(svg.style.width),height:parseFloat(svg.style.height),right:b.x+b.width,bottom:b.y+b.height};});assert.ok(extent.width>=extent.right&&extent.height>=extent.bottom);
  await assertRoundedPaths(page);
  await setScope(page,'hide');assert.equal(await page.locator('.node.outside').count(),0);await setScope(page,'show');await openDisplaySettings(page);await page.locator('#prefer-write').check();assert.equal(await page.locator('.node').count(),25);assert.deepEqual(await positions(),initial);
  assert.equal(await page.locator('.close').isVisible(),true);await page.waitForFunction(()=>document.querySelector('#app').dataset.saveState==='saved');await page.reload();await page.waitForFunction(()=>!document.querySelector('#open').disabled);await openSourceAction(page,'open-sample-menu');assert.deepEqual(await positions(),initial);
  // A new input follows the new section order; reading the same input keeps its layout.
  const sections=raw.split(/(?=^# (?:Activity|Object|Scope|Graph exceptions) )/m),reversed=sections.filter(s=>s.startsWith('# Activity ')).reverse();let next=0;
  const flipped=sections.map(s=>s.startsWith('# Activity ')?reversed[next++]:s).join('');
  await openSourceAction(page,'open-text');await page.locator('#source-text').fill(flipped);await page.locator('#source-submit').click();await page.waitForFunction(()=>document.querySelector('#source-dialog').hidden&&!document.querySelector('#open').disabled&&document.querySelector('#app').dataset.saveState==='saved');const reversedPositions=await positions();assert.notDeepEqual(reversedPositions,initial);assertCompactStaircase(reversedPositions,parseDesign(flipped));
  await ensureDocumentActions(page);await page.locator('#view-markdown').click();assert.equal(await page.locator('#source-text').inputValue(),flipped);assert.equal(await page.locator('#source-text').getAttribute('readonly'),'');await page.locator('#source-cancel').click();assert.deepEqual(await positions(),reversedPositions);
  assert.deepEqual(errors,[]);return {activities:order,constraints,knownOrderExceptions:'Cycles use document order only as display hint; return arrows keep original endpoints',checks:'directed sample geometry; viewport independent320/393/1280; no card overlap; rounded route/label extent; finite L/Q routes; compact64 ranks; forward downward constraints; Scope/Write preserve positions; close/reload/reopen exact layout; new input uses reversed order; readonly source retains saved positions',pageErrors:errors};
 }finally{await page.close();}
}
