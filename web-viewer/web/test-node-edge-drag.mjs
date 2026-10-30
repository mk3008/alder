import {joinedSession} from './session-test-view.mjs';
const loadSession=async()=>joinedSession(await loadStoredSession());
// Legacy no-Group input regression; the current Group sample is tested separately.
// Deterministic RAF and DOM/IndexedDB model, not native browser input evidence.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from './legacy-viewer-fixture.mjs';
import {JSDOM} from 'jsdom';
import {IDBFactory} from 'fake-indexeddb';
import {parseDesign} from '../src/graph.ts';
import {reconcile,saveSession,loadSession as loadStoredSession} from '../src/session.ts';
import {routeEdge} from '../src/routing.ts';
import {createNodeDrag,edgeVelocity} from '../src/node-drag.ts';

const markdown=readFileSync('web/authorities/ungrouped-alder.md','utf8'),design=parseDesign(markdown);
const initial=reconcile({key:'edge-drag',name:'Alder',design,positions:{},scroll:[0,0],zoom:1,source:{kind:'sample'}},design);
const firstID=design.graph.nodes[0].id;
assert.deepEqual(edgeVelocity([500,300],{left:100,top:100,right:900,bottom:628}),[0,0]);
assert.deepEqual(edgeVelocity([-100,900],{left:100,top:100,right:900,bottom:628}),[-600,600]);
assert.deepEqual(edgeVelocity([0,0],{left:0,top:0,right:0,bottom:0}),[0,0]);

// The pure controller shares the exact pointer/camera equation at every zoom.
for(const zoom of [.25,1,2.5]){
 const tab=structuredClone(initial);tab.zoom=zoom;
 let connected=true,allowed=true,sequence=0,time=0;const frames=new Map();
 const controller=createNodeDrag({
  read:()=>allowed?{key:tab.key,zoom,scroll:tab.scroll,offset:tab.canvasOrigin??[0,0]}:undefined,
  position:id=>tab.positions[id],connected:()=>connected,bounds:()=>({left:100,top:100,right:900,bottom:628}),
  change:(id,p)=>{tab.positions[id]=p;},pan:d=>{tab.scroll=[tab.scroll[0]+d[0],tab.scroll[1]+d[1]];},
  requestFrame:cb=>{frames.set(++sequence,cb);return sequence;},cancelFrame:id=>frames.delete(id)
 });
 const step=ms=>{time+=ms;const pending=[...frames.values()];frames.clear();pending.forEach(cb=>cb(time));};
 const start=[...tab.positions[firstID]],other=structuredClone(tab.positions);
 controller.begin(firstID,[500,300]);controller.move([890,300]);assert.equal(frames.size,1);
 step(16);const once=tab.positions[firstID][0];step(100000);
 assert.ok(tab.positions[firstID][0]>once,'stationary edge hold keeps moving');
 assert.ok((tab.positions[firstID][0]-once)*zoom<=600*.032+1e-9,'a delayed frame is bounded');
 assert.equal(tab.positions[firstID][0],start[0]+390/zoom+tab.scroll[0]/zoom);
 for(const [id,p] of Object.entries(other))if(id!==firstID)assert.deepEqual(tab.positions[id],p);
 controller.move([500,300]);assert.equal(frames.size,0,'leaving the edge stops RAF');
 controller.move([890,300]);controller.cancel(true);assert.deepEqual(tab.positions[firstID],start);assert.equal(frames.size,0);
 for(const end of ['end','cancel','disconnect','lock','tab']){
  connected=allowed=true;tab.key='edge-drag';controller.begin(firstID,[500,300]);controller.move([890,300]);assert.equal(frames.size,1);
  if(end==='end')controller.end();else if(end==='cancel')controller.cancel();else if(end==='disconnect')connected=false;else if(end==='lock')allowed=false;else tab.key='different';
  const before=structuredClone(tab.positions);step(16);assert.deepEqual(tab.positions,before,end);assert.equal(frames.size,0,end);
 }
}
// A real relation translated into the signed world retains a finite, usable route.
const relation=design.graph.relations.find(r=>r.from!==r.to),ids=[relation.from,relation.to];
const positive=ids.map(id=>({id,x:initial.positions[id][0]+2000,y:initial.positions[id][1]+2000,width:260,height:68}));
const route=routeEdge({from:relation.from,to:relation.to,nodes:positive,labelWidth:Math.max(30,relation.label.length*12),labelHeight:18});
const negative=positive.map(n=>({...n,x:n.x-10000,y:n.y-10000}));
const signed=routeEdge({from:relation.from,to:relation.to,nodes:negative,labelWidth:Math.max(30,relation.label.length*12),labelHeight:18});
assert.equal(signed.fallback,route.fallback);
assert.deepEqual(signed.points.map(p=>p.map(v=>v+10000)),route.points);
// Fractional arclength captions incur IEEE-754 translation rounding (<1e-12).
assert.deepEqual(signed.label.map(v=>+(v+10000).toFixed(9)),route.label.map(v=>+v.toFixed(9)));

const {outputFiles}=await build({entryPoints:['src/main.ts'],bundle:true,write:false,format:'iife',loader:{'.css':'empty','.md':'text'},plugins:[{name:'count-routes',setup(b){b.onLoad({filter:/\/routing\.ts$/},args=>({contents:readFileSync(args.path,'utf8').replace('const source=nodes.find','globalThis.__routeCalls=(globalThis.__routeCalls??0)+1;const source=nodes.find'),loader:'ts'}));}}]});
const windows=[];
async function boot(db=new IDBFactory(),zoom=1){
 globalThis.indexedDB=db;
 if(!await loadSession())await saveSession({tabs:[{...structuredClone(initial),zoom}],active:initial.key,dark:false,drawer:true,width:380});
 const w=new JSDOM('<div id="app"></div>',{url:'https://viewer.test/',runScripts:'outside-only',pretendToBeVisual:true}).window;windows.push(w);
 w.indexedDB=db;w.structuredClone=structuredClone;const frames=new Map();let sequence=0,time=0;
 w.requestAnimationFrame=cb=>{frames.set(++sequence,cb);return sequence;};w.cancelAnimationFrame=id=>frames.delete(id);
 w.HTMLElement.prototype.setPointerCapture=()=>{};w.HTMLElement.prototype.releasePointerCapture=()=>{};
 w.eval(outputFiles[0].text);const d=w.document,$=id=>d.getElementById(id),v=$('viewport');
 for(let i=0;i<120&&$('open').disabled;i++)await new Promise(r=>setTimeout(r,10));assert.equal($('open').disabled,false);
 const rect=(left,top,width,height)=>({left,top,right:left+width,bottom:top+height,width,height,x:left,y:top,toJSON(){}});
 Object.defineProperties(v,{clientWidth:{value:800},clientHeight:{value:600}});v.getBoundingClientRect=()=>rect(100,100,800,600);
 $('formattedMarkdownDrawer').getBoundingClientRect=()=>rect(900,100,380,600);
 $('node-list-drawer').getBoundingClientRect=()=>rect(-200,100,300,600);
 d.querySelector('.toolbar').getBoundingClientRect=()=>rect(420,640,460,40);
 for(const [property,size] of [['scrollLeft','width'],['scrollTop','height']]){
  let value=v[property];const viewportSize=size==='width'?800:600;
  Object.defineProperty(v,property,{get:()=>Math.max(0,Math.min(value,parseFloat($('canvas').style[size])-viewportSize)),set:x=>{value=Math.round(Math.max(0,Math.min(x,parseFloat($('canvas').style[size])-viewportSize)));}});
 }
 w.dispatchEvent(new w.Event('resize'));
 const fire=(kind,type,id,x,y,target=v)=>{const event=new w.Event(type,{bubbles:true,cancelable:true});Object.assign(event,{pointerType:kind,pointerId:id,button:0,clientX:x,clientY:y});target.dispatchEvent(event);};
 const step=(ms=16)=>{time+=ms;const pending=[...frames.values()];frames.clear();pending.forEach(cb=>cb(time));};
 const node=id=>[...d.querySelectorAll('.node')].find(n=>n.dataset.node===id);
 const positions=()=>Object.fromEntries([...d.querySelectorAll('.node')].map(n=>[n.dataset.node,[parseFloat(n.style.left),parseFloat(n.style.top)]]));
 const paths=()=>Object.fromEntries([...d.querySelectorAll('.edge,.edge-label')].map(n=>[n.tagName+':'+n.dataset.relation,n.tagName==='path'?n.getAttribute('d'):[n.getAttribute('x'),n.getAttribute('y')]]));
 const camera=()=>[v.scrollLeft-parseFloat($('nodes').style.left),v.scrollTop-parseFloat($('nodes').style.top)];
 const screen=id=>{const p=positions()[id],c=camera();return [p[0]*zoom-c[0],p[1]*zoom-c[1]];};
 return {w,d,$,v,db,fire,step,node,positions,paths,camera,screen,frames};
}
try{
 for(const zoom of [.25,1,2.5]){
  let e=await boot(undefined,zoom);let {w,d,$,v,fire,step,node,positions,paths,camera,screen}=e;
  $('layout-lock').click();const incident=design.graph.relations.flatMap((r,i)=>r.from===firstID||r.to===firstID?[i]:[]);
  const baseline=positions(),unrelated=design.graph.nodes.find(n=>n.id!==firstID).id,originalRoutes=paths();
  let card=node(firstID),start=[...positions()[firstID]],oldCamera=camera();w.__routeCalls=0;
  fire('mouse','pointerdown',1,500,300,card);fire('mouse','pointermove',1,890,300,card);
  const atEdge=positions()[firstID];step();step();
  assert.ok(positions()[firstID][0]>atEdge[0],'right edge hold advances world position');assert.ok(v.scrollLeft>0);
  assert.equal(positions()[firstID][0],start[0]+(390+camera()[0]-oldCamera[0])/zoom,'drag uses realized rounded scroll');
  assert.equal(w.__routeCalls,incident.length*3,'each pointer/RAF move routes incident edges only');
  for(const [key,p] of Object.entries(originalRoutes))if(!incident.includes(+key.split(':')[1]))assert.deepEqual(paths()[key],p,'unrelated route and label remain exact');
  fire('mouse','pointerup',1,890,300,card);const released=positions();step();assert.deepEqual(positions(),released);
  // A fresh parser-seeded fixture isolates exact signed drag arithmetic from
  // the fractional positions produced by the earlier RAF hold. Integer pointer
  // inputs and the original fixture determine the expected moved coordinate.
  w.close();e=await boot(undefined,zoom);({w,d,$,v,fire,step,node,positions,paths,camera,screen}=e);$('layout-lock').click();
  // Expansion compensates scroll: unrelated cards must not jump on screen.
  v.scrollLeft=0;v.scrollTop=0;card=node(firstID);start=[...initial.positions[firstID]];assert.deepEqual(positions()[firstID],start);const fixedScreen=screen(unrelated);oldCamera=camera();
  const target=[Math.round(500-(start[0]+200)*zoom),Math.round(300-(start[1]+200)*zoom)],expected=[start[0]+(target[0]-500)/zoom,start[1]+(target[1]-300)/zoom];
  fire('pen','pointerdown',2,500,300,card);fire('pen','pointermove',2,...target,card);
  assert.deepEqual(positions()[firstID],expected);assert.ok(expected.every(v=>v<0));assert.deepEqual(screen(unrelated),fixedScreen,'origin growth cannot jump unrelated cards');
  assert.ok(parseFloat($('nodes').style.left)>0);assert.ok($('edges').getAttribute('viewBox').startsWith('-'));
  assert.deepEqual(camera(),oldCamera,'origin compensation keeps the camera fixed');
  fire('pen','pointercancel',2,0,0,card);const cancelled=positions();step();assert.deepEqual(positions(),cancelled);
  // Top/left stationary hold works after its negative reserve runs out.
  v.scrollLeft=0;v.scrollTop=0;card=node(firstID);fire('touch','pointerdown',3,200,200,card);fire('touch','pointermove',3,102,102);step();const held=positions()[firstID];step();
  assert.ok(positions()[firstID][0]<held[0]&&positions()[firstID][1]<held[1]);
  const originalTouch=cancelled[firstID];fire('touch','pointerdown',4,250,200);assert.deepEqual(positions()[firstID],originalTouch,'second finger rolls back only tentative node movement');
  const afterSecond=positions();step();assert.deepEqual(positions(),afterSecond);fire('touch','pointermove',4,270,200);fire('touch','pointerup',3,102,102);fire('touch','pointerup',4,270,200);
  // Never rewrite another stored coordinate during either kind of expansion.
  for(const [id,p] of Object.entries(baseline))if(id!==firstID)assert.deepEqual(positions()[id],p);
  // Restore/reopen tests below use the signed positions, offset, zoom and camera.
  const snapshot=positions(),scroll=[v.scrollLeft,v.scrollTop],offset=[$('nodes').style.left,$('nodes').style.top],zoomText=$('zoom').textContent;
  assert.equal(d.querySelector('.close').hidden,false);w.dispatchEvent(new w.Event('blur'));await new Promise(r=>setTimeout(r,250));await d.querySelector('.close').onclick();assert.equal($('empty-workspace').hidden,false);w.close();
  const reopened=await boot(e.db,zoom);reopened.$('open-sample').click();
  assert.deepEqual(reopened.positions(),snapshot);
  // A full route pass may grow the signed-world reserve; its scroll compensation
  // must preserve the exact screen position of EVERY stored coordinate.
  const newOffset=[reopened.$('nodes').style.left,reopened.$('nodes').style.top],newScroll=[reopened.v.scrollLeft,reopened.v.scrollTop];
  for(const axis of [0,1])assert.equal(parseFloat(newOffset[axis])-newScroll[axis],parseFloat(offset[axis])-scroll[axis],'reload reserve growth cannot jump the camera');
  for(const [id,p]of Object.entries(snapshot))assert.deepEqual(reopened.screen(id),p.map((v,axis)=>v*zoom-(scroll[axis]-parseFloat(offset[axis]))));
  assert.equal(reopened.$('zoom').textContent,zoomText);
  reopened.w.close();
 }
 // Active-input stop paths and occluded viewport edges use one measured fixture.
 const e=await boot(),{w,d,$,v,fire,step,node,positions}=e;$('layout-lock').click();
 for(const end of ['pointerup','pointercancel','lostpointercapture','lock','redraw','blur','detach']){
  if($('layout-lock').getAttribute('aria-pressed')==='true')$('layout-lock').click();
  const card=node(firstID);fire('mouse','pointerdown',10,500,300,card);fire('mouse','pointermove',10,890,300,card);step();
  if(end==='lock')$('layout-lock').click();else if(end==='redraw')$('drawer').click();else if(end==='blur')w.dispatchEvent(new w.Event('blur'));else if(end==='detach')card.remove();else fire('mouse',end,10,890,300,card);
  const snapshot=positions(),scroll=[v.scrollLeft,v.scrollTop];step();step();assert.deepEqual(positions(),snapshot,end);assert.deepEqual([v.scrollLeft,v.scrollTop],scroll,end);
  if(end==='detach'){$('layout-lock').click();$('layout-lock').click();}
 }
 // A detached node's delayed events cannot terminate a newer live drag.
 const stale=node(firstID);fire('mouse','pointerdown',30,500,300,stale);$('drawer').click();let fresh=node(firstID);fire('mouse','pointerdown',31,500,300,fresh);fire('mouse','pointermove',31,890,300,fresh);fire('mouse','pointerup',30,500,300,stale);fire('mouse','lostpointercapture',30,500,300,stale);const stillDragging=positions()[firstID];step();assert.ok(positions()[firstID][0]>stillDragging[0]);fire('mouse','pointerup',31,890,300,fresh);
 // Bottom toolbar clearance triggers above the occluded region, with no x motion.
 let card=node(firstID);fire('pen','pointerdown',20,500,500,card);fire('pen','pointermove',20,500,620,card);const bottomStart=positions()[firstID];step();assert.ok(positions()[firstID][1]>bottomStart[1]);assert.equal(positions()[firstID][0],bottomStart[0]);fire('pen','pointerup',20,500,620,card);
 if($('formattedMarkdownDrawer').hidden)$('drawer').click();$('formattedMarkdownDrawer').getBoundingClientRect=()=>({left:750,top:100,right:1130,bottom:700,width:380,height:600});
 card=node(firstID);fire('mouse','pointerdown',21,500,300,card);fire('mouse','pointermove',21,740,300,card);const overlay=positions()[firstID];step();assert.ok(positions()[firstID][0]>overlay[0],'visible right boundary excludes Markdown overlay');fire('mouse','pointerup',21,740,300,card);
 // The drawer can navigate signed nodes without altering any world coordinates.
 card=node(firstID);const at=positions()[firstID];fire('mouse','pointerdown',23,500,300,card);fire('mouse','pointermove',23,500-at[0]-200,300-at[1]-200,card);fire('mouse','pointerup',23,0,0,card);assert.deepEqual(positions()[firstID],[-200,-200]);
 if($('design-explorer').hidden)$('node-list-toggle').click();const objectEntry=d.querySelector(`[data-explorer-key="object:${firstID}"]`);assert.ok(objectEntry);objectEntry.click();assert.equal(d.querySelector('.tab.active').dataset.object,firstID);
 card=node(firstID);const detailAt=positions()[firstID];fire('mouse','pointerdown',24,500,300,card);fire('mouse','pointermove',24,500-detailAt[0]-200,300-detailAt[1]-200,card);fire('mouse','pointerup',24,0,0,card);assert.deepEqual(positions()[firstID],[-200,-200]);const beforeNavigation=positions();d.querySelector(`[data-explorer-key="object:${firstID}"]`).click();assert.deepEqual(positions(),beforeNavigation);assert.deepEqual(e.screen(firstID),[325-130,300-34]);
 // Closing a tab cancels an in-flight edge drag before persisting the final layout.
 card=node(firstID);fire('mouse','pointerdown',22,500,300,card);fire('mouse','pointermove',22,740,300,card);step();assert.equal(d.querySelector('.tab.active .close').hidden,false);w.dispatchEvent(new w.Event('blur'));await new Promise(r=>setTimeout(r,250));await d.querySelector('.tab.active .close').onclick();step();assert.equal(d.querySelectorAll('.tab').length,1);const stationary=positions();step();assert.deepEqual(positions(),stationary,'blur cancels drag; overview remains');
 console.log(JSON.stringify({model:'pure controller + measured DOM/rounded-scroll/IndexedDB',passed:12,checks:['bounded stationary RAF at 25/100/250%','shared mouse/pen/touch equation','zero-boundary signed routes','right/top/left expansion','camera-only origin compensation','incident-only paths/labels exact','second finger rollback and pinch','pointer/cancel/capture/lock/redraw/blur/disconnect stop','measured toolbar and drawer edges','unrelated world coordinates unchanged','signed sample close/reload/reopen exact','signed drawer navigation and close during drag']},null,2));
}finally{windows.forEach(w=>w.close());}
