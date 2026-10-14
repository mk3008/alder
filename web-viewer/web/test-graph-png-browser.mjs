// Native Chromium gate against the built viewer. Synthetic/public input only.
// Importing this module never starts a browser or server. Download events and
// decoded PNG pixels are native; SVG interception observes, never substitutes,
// the image passed to Chromium. Clipboard checks write only this synthetic graph
// and paste only after a successful write, in an isolated CI browser context.
// No clipboard-read API or permission override is used. This is not screenshot
// visual acceptance or an OS/browser compatibility claim.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {parseDesign} from '../src/graph.ts';
import {hiddenReadIndexes} from '../src/edge-visibility.ts';
import {runBrowserCases} from './browser-cases.mjs';
import {assertToolbarLayout} from './test-toolbar-layout.mjs';
import {assertTabStripActions} from './test-tab-strip-browser.mjs';
import {openDisplaySettings} from './toolbar-settings-control.mjs';
import {readConcurrencyRecord} from './test-session-concurrency-browser.mjs';

const origin='http://127.0.0.1:4173/';
const names={
 person:'問い合わせを行う範囲外の利用者と長い日本語の名称',
 record:'確認した内容と判断結果を記録する共有の業務台帳',
 read:'受け付けた問い合わせの内容と関連情報を確認する',
 approve:'確認結果を承認して利用者に対応内容を通知する',
};
const labels={
 Question:'利用者から受け付けた問い合わせの内容と確認事項',
 'Existing context':'過去の対応履歴と今回の確認に必要な関連情報',
 Explanation:'確認した内容と判断の理由を記録した説明資料',
 Notification:'利用者に伝える対応内容と次の手続きの案内',
 'Return if unclear':'判断に必要な情報が不足している場合は確認へ戻す',
 'Exceptional association':'通常の関連付けでは扱えない情報を例外として共有する',
};
export function graphPngFixture(){
 let raw=JSON.parse(readFileSync(new URL('./authorities/contract-cases.json',import.meta.url),'utf8')).find(c=>c.name==='test_explicit_exception_kinds').input;
 for(const [from,to] of Object.entries(names))raw=raw.replace(new RegExp('\\b'+from+'\\b','g'),to);
 for(const [from,to] of Object.entries(labels))raw=raw.replaceAll(from,to);
 raw=raw.replaceAll('Analyst','確認担当者');
 return {raw,design:parseDesign(raw)};
}
const fixture=graphPngFixture();
const positions={ [names.person]:[-280,-160], [names.record]:[1300,700], [names.read]:[650,50], [names.approve]:[650,1040] };
const settle=page=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
const ready=page=>page.waitForFunction(()=>document.querySelector('#open')&&!document.querySelector('#open').disabled);
const record=page=>page.evaluate(readConcurrencyRecord);
async function saved(page){
 await settle(page);
 await page.evaluate(()=>window.dispatchEvent(new Event('blur')));
 await page.waitForFunction(()=>['saved','unchanged'].includes(document.querySelector('#app').dataset.saveState));
 return record(page);
}

// Observe real browser boundaries. Only explicit failure/concurrency cases
// alter toBlob delivery; normal cases retain the native encoder unchanged.
function installPngProbe(){
 const probe=globalThis.__graphPng={svgs:[],blobCalls:0,failBlob:false,holdBlob:false,pending:[],urls:[],revoked:[],clipboardItems:[],writes:[],denyWrite:false};
 const descriptor=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,'src');
 Object.defineProperty(HTMLImageElement.prototype,'src',{...descriptor,set(value){
  if(String(value).startsWith('data:image/svg+xml'))probe.svgs.push(decodeURIComponent(String(value).split(',').slice(1).join(',')));
  descriptor.set.call(this,value);
 }});
 const toBlob=HTMLCanvasElement.prototype.toBlob;
 HTMLCanvasElement.prototype.toBlob=function(callback,...args){
  probe.blobCalls++;
  if(probe.failBlob){queueMicrotask(()=>callback(null));return;}
  return toBlob.call(this,blob=>{
   if(probe.holdBlob)probe.pending.push(()=>callback(blob));else callback(blob);
  },...args);
 };
 const create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL);
 URL.createObjectURL=blob=>{const url=create(blob);probe.urls.push({url,type:blob.type});return url;};
 URL.revokeObjectURL=url=>{probe.revoked.push(url);return revoke(url);};
 // Observe constructor data and write timing without replacing native encoding,
 // ClipboardItem or the clipboard service in successful cases.
 if(typeof ClipboardItem==='function'){
  globalThis.ClipboardItem=new Proxy(ClipboardItem,{construct(target,args){
   const png=args[0]?.['image/png'];probe.clipboardItems.push({types:Object.keys(args[0]??{}),promise:png instanceof Promise,activation:navigator.userActivation.isActive});
   return Reflect.construct(target,args);
  }});
 }
 if(navigator.clipboard?.write){
  const write=navigator.clipboard.write.bind(navigator.clipboard);
  Object.defineProperty(navigator.clipboard,'write',{configurable:true,value(items){
   const entry={types:items.map(item=>[...item.types]),blobCalls:probe.blobCalls,pending:probe.pending.length,activation:navigator.userActivation.isActive,completed:false,error:null};probe.writes.push(entry);
   const result=probe.denyWrite?Promise.reject(new DOMException('Synthetic write denial','NotAllowedError')):write(items);
   return result.then(()=>{entry.completed=true;},error=>{entry.error=error.name;throw error;});
  }});
 }
}


// Seed only after navigating away from the app, so no live debounce can race
// the fixture transaction. Leave the saved generation intact and read it back.
function seedPngSession({layout,global={}}){return new Promise((resolve,reject)=>{
 const request=indexedDB.open('alder-web-viewer',1);request.onerror=()=>reject(request.error);
 request.onsuccess=()=>{const db=request.result;let failure;
  const tx=db.transaction('session','readwrite'),store=tx.objectStore('session'),get=store.get('current');
  get.onsuccess=()=>{const session=get.result,tab=session?.tabs?.find(t=>t.key===session.active);
   if(!tab){failure=Error('PNG fixture needs a saved active tab');tx.abort();return;}
   Object.assign(tab,layout);Object.assign(session,{drawer:false,nodeDrawer:false},global);store.put(session,'current');
  };
  tx.oncomplete=()=>{db.close();resolve(true);};tx.onerror=tx.onabort=()=>{db.close();reject(failure??tx.error??Error('PNG fixture commit failed'));};
 };
});}
async function seed(page,layout,global){
 await saved(page);await page.goto(origin+'LICENSE.txt');
 assert.equal(await page.evaluate(seedPngSession,{layout,global}),true);
 const committed=await record(page),tab=committed.current.tabs.find(t=>t.key===committed.current.active);
 for(const [key,value] of Object.entries(layout))assert.deepEqual(tab[key],value,'committed fixture '+key);
 await page.goto(origin);await ready(page);await saved(page);
 // File-source restore has an expected warning; dismiss its actual close
 // control before native hit testing the toolbar underneath.
 if(await page.locator('#status').isVisible()){assert.match(await page.locator('#status-text').textContent(),/保存時の内容/);await page.locator('#status-close').click();}
 return tab;
}
async function openFixture(page,name='日本語の業務図.md',raw=fixture.raw){
 await page.locator('#fallback').setInputFiles({name,mimeType:'text/markdown',buffer:Buffer.from(raw)});
 await page.waitForFunction(()=>document.querySelectorAll('.node').length>0);
 if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
 if(await page.locator('#node-list-drawer').isVisible())await page.locator('#node-list-close').click();
 await saved(page);
}
async function prepare(page,overrides={}){
 await openFixture(page);
 await seed(page,{positions,zoom:1,scroll:[600,400],viewInset:[40,0],canvasOrigin:[1024,1024],selected:names.read,hiddenNodes:[],showExceptions:true,selectedEdgesOnly:false,...overrides});
}
function stateInPage(){
 const $=id=>document.getElementById(id),v=$('viewport');
 return {nodes:$('nodes').outerHTML,edges:$('edges').outerHTML,canvasStyle:$('canvas').getAttribute('style'),scroll:[v.scrollLeft,v.scrollTop],zoom:$('zoom').textContent,
  tabs:[...document.querySelectorAll('.tab')].map(t=>[t.dataset.key,t.className,t.textContent]),theme:document.documentElement.dataset.theme,
  settings:[...document.querySelectorAll('#display-options input')].map(e=>[e.id,e.checked,e.indeterminate]),settingsOpen:$('display-settings-toggle').getAttribute('aria-expanded'),
  drawers:['formattedMarkdownDrawer','node-list-drawer'].map(id=>[$(id).hidden,$(id).getAttribute('style')]),detail:$('detail').innerHTML,
  editor:[$('source-dialog').hidden,$('source-dialog').dataset.mode,$('source-text').value,$('source-url').value],locked:$('layout-lock').getAttribute('aria-pressed'),url:location.href,history:history.length};
}
function sceneInPage(){
 const rect=b=>({x:b.x,y:b.y,width:b.width,height:b.height});
 const v=document.querySelector('#viewport').getBoundingClientRect();
 const cards=[...document.querySelectorAll('#nodes > .node')].map(node=>{
  const r=node.getBoundingClientRect(),name=node.querySelector('.node-name'),n=name.getBoundingClientRect(),scale=r.width/node.offsetWidth,s=getComputedStyle(node);
  const icon=node.querySelector(':scope > svg'),iconRect=icon?.getBoundingClientRect();
  return {id:node.dataset.node,text:node.textContent,classes:node.className,icon:icon?{box:{x:parseFloat(node.style.left)+(iconRect.left-r.left)/scale,y:parseFloat(node.style.top)+(iconRect.top-r.top)/scale,width:iconRect.width/scale,height:iconRect.height/scale},ink:getComputedStyle(icon).color}:null,box:{x:parseFloat(node.style.left),y:parseFloat(node.style.top),width:node.offsetWidth,height:node.offsetHeight},background:s.backgroundColor,
   nameBox:{x:parseFloat(node.style.left)+(n.left-r.left)/scale,y:parseFloat(node.style.top)+(n.top-r.top)/scale,width:n.width/scale,height:n.height/scale},ink:getComputedStyle(name).color,
   offscreen:r.right<v.left||r.left>v.right||r.bottom<v.top||r.top>v.bottom};
 });
 const paths=[...document.querySelectorAll('#edges > .edge')].map(e=>({d:e.getAttribute('d'),classes:e.getAttribute('class'),marker:e.getAttribute('marker-end'),stroke:getComputedStyle(e).stroke,strokeWidth:getComputedStyle(e).strokeWidth,dash:getComputedStyle(e).strokeDasharray,box:rect(e.getBBox()),arrow:(()=>{const length=e.getTotalLength(),end=e.getPointAtLength(length),prior=e.getPointAtLength(Math.max(0,length-1)),angle=Math.atan2(end.y-prior.y,end.x-prior.x),stroke=parseFloat(getComputedStyle(e).strokeWidth),distance=stroke*3;return {radius:Math.max(.5,stroke*.35),points:[-1,1].map(side=>[end.x-Math.cos(angle)*distance-Math.sin(angle)*stroke*1.3*side,end.y-Math.sin(angle)*distance+Math.cos(angle)*stroke*1.3*side])};})(),points:[.12,.33,.67,.88].map(f=>{const p=e.getPointAtLength(e.getTotalLength()*f);return [p.x,p.y];})}));
 const labels=[...document.querySelectorAll('#edges > .edge-label')].map(e=>({text:e.textContent,x:e.getAttribute('x'),y:e.getAttribute('y'),box:rect(e.getBBox()),fill:getComputedStyle(e).fill}));
 return {cards,paths,labels,background:getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()};
}
function inspectSvgInPage(svg){
 const doc=new DOMParser().parseFromString(svg,'image/svg+xml'),root=doc.documentElement;
 if(doc.querySelector('parsererror'))throw Error('Export SVG is not valid XML');
 const group=[...root.children].find(n=>n.localName==='g'),translation=group?.getAttribute('transform')?.match(/^translate\(([-\d.]+)[ ,]+([-\d.]+)\)$/);
 return {width:+root.getAttribute('width'),height:+root.getAttribute('height'),viewBox:root.getAttribute('viewBox').split(/[ ,]+/).map(Number),offset:translation?.slice(1).map(Number),background:root.firstElementChild.getAttribute('fill'),
  cards:[...doc.querySelectorAll('foreignObject .node')].map(n=>({text:n.textContent,classes:n.getAttribute('class'),x:parseFloat(n.style.left),y:parseFloat(n.style.top),background:n.style.backgroundColor})),
  paths:[...group.querySelectorAll(':scope > .edge')].map(e=>({d:e.getAttribute('d'),classes:e.getAttribute('class'),marker:e.getAttribute('marker-end'),stroke:e.style.stroke,strokeWidth:e.style.strokeWidth,dash:e.style.strokeDasharray})),
  labels:[...group.querySelectorAll(':scope > .edge-label')].map(e=>({text:e.textContent,x:e.getAttribute('x'),y:e.getAttribute('y'),fill:e.style.fill})),
  markerIDs:[...doc.querySelectorAll('marker')].map(e=>e.id),foreignObjects:doc.querySelectorAll('foreignObject').length,chrome:doc.querySelectorAll('header,aside,button,input,textarea,#tabs,#detail,#viewport,.toolbar').length,
  external:[...doc.querySelectorAll('*')].flatMap(e=>[...e.attributes].filter(a=>/https?:\/\/|@import|url\(["']?(?!#)/i.test(a.value)&&a.name!=='xmlns').map(a=>a.name+':'+a.value))};
}
export function inspectPng(buffer){
 assert.deepEqual([...buffer.subarray(0,8)],[137,80,78,71,13,10,26,10],'native download is PNG, not an SVG renamed to .png');
 assert.equal(buffer.toString('ascii',12,16),'IHDR');
 const width=buffer.readUInt32BE(16),height=buffer.readUInt32BE(20);
 assert.ok(width>0&&height>0&&width<=8192&&height<=8192&&width*height<=16_000_000,'bounded real PNG dimensions');
 return {width,height,sha256:createHash('sha256').update(buffer).digest('hex')};
}
async function bytesOf(download){
 assert.equal(await download.failure(),null,'native browser download succeeds');
 const stream=await download.createReadStream();assert.ok(stream,'native PNG download exposes bytes');
 const chunks=[];for await(const chunk of stream)chunks.push(chunk);return Buffer.concat(chunks);
}
const near=(a,b,message)=>assert.ok(Number.isFinite(a)&&Math.abs(a-b)<.1,`${message}: ${a} ≈ ${b}`);
function assertSvg(scene,svg,png){
 assert.equal(svg.chrome,0,'headers, drawers and controls are not exported');assert.equal(svg.foreignObjects,1);assert.deepEqual(svg.external,[],'self-contained SVG has no external image, font or stylesheet URLs');
 assert.deepEqual([svg.width,svg.height],[png.width,png.height]);assert.deepEqual(svg.viewBox.slice(0,2),[0,0]);assert.equal(svg.background,scene.background);assert.ok(svg.offset?.every(Number.isFinite));
 const scale=png.width/svg.viewBox[2];assert.ok(scale>=.999&&scale<=2.001);near(png.height/svg.viewBox[3],scale,'uniform raster scale');
 assert.equal(svg.cards.length,scene.cards.length);assert.equal(svg.paths.length,scene.paths.length);assert.equal(svg.labels.length,scene.labels.length);
 for(let i=0;i<scene.cards.length;i++){
  const actual=svg.cards[i],expected=scene.cards[i];assert.equal(actual.text,expected.text);assert.equal(actual.classes,expected.classes);assert.equal(actual.background,expected.background);
  near(actual.x,expected.box.x+svg.offset[0],'card graph x');near(actual.y,expected.box.y+svg.offset[1],'card graph y');
 }
 for(let i=0;i<scene.paths.length;i++){
  const {box,points,arrow,...expected}=scene.paths[i];assert.deepEqual(svg.paths[i],expected,'SVG route, selected stroke, dash and marker remain exact');
  const id=expected.marker.match(/#([^)]*)\)/)?.[1];assert.ok(svg.markerIDs.includes(id),'referenced arrow marker is embedded');
 }
 for(let i=0;i<scene.labels.length;i++){const {box,...expected}=scene.labels[i];assert.deepEqual(svg.labels[i],expected,'long Japanese labels retain native positions and theme ink');}
 for(const {box} of [...scene.cards,...scene.paths,...scene.labels]){
  const x=box.x+svg.offset[0],y=box.y+svg.offset[1];
  assert.ok(x>=12&&y>=12&&x+box.width<=svg.viewBox[2]-12&&y+box.height<=svg.viewBox[3]-12,'entire native node/path/label box fits, including signed/offscreen coordinates');
 }
 return scale;
}
// Inspect actual decoded pixels using an independent PNG Image. Samples are
// geometry-based, not a screenshot match, OCR or a Japanese typography claim.
async function pixelEvidence(page,buffer,scene,svg){return page.evaluate(async({base64,scene,svg})=>{
 const bitmap=new Image();bitmap.src='data:image/png;base64,'+base64;await bitmap.decode();
 const canvas=document.createElement('canvas');canvas.width=bitmap.naturalWidth;canvas.height=bitmap.naturalHeight;
 const context=canvas.getContext('2d',{willReadFrequently:true});context.drawImage(bitmap,0,0);const pixels=context.getImageData(0,0,canvas.width,canvas.height).data;
 const color=value=>{context.fillStyle=value;context.fillRect(0,0,1,1);return [...context.getImageData(0,0,1,1).data].slice(0,3);};
 const background=color(scene.background),scale=canvas.width/svg.viewBox[2],at=(x,y)=>{const i=(Math.max(0,Math.min(canvas.height-1,Math.round(y)))*canvas.width+Math.max(0,Math.min(canvas.width-1,Math.round(x))))*4;return [...pixels.slice(i,i+4)];};
 const distance=(a,b)=>Math.max(...b.map((n,i)=>Math.abs(a[i]-n)));
 const world=(x,y)=>[(x+svg.offset[0])*scale,(y+svg.offset[1])*scale];
 const inkCount=(box,ink,tolerance=45)=>{
  const [x,y]=world(box.x,box.y),right=Math.min(canvas.width,Math.ceil(x+box.width*scale)),bottom=Math.min(canvas.height,Math.ceil(y+box.height*scale));let count=0;
  for(let py=Math.max(0,Math.floor(y));py<bottom;py++)for(let px=Math.max(0,Math.floor(x));px<right;px++)if(distance(at(px,py),ink)<tolerance)count++;
  return count;
 };
 const cards=scene.cards.map(n=>{const [x,y]=world(n.box.x+n.box.width-13,n.box.y+n.box.height-13);return {id:n.id,background:at(x,y),expected:color(n.background),textPixels:inkCount(n.nameBox,color(n.ink),35)};});
 const icons=scene.cards.filter(card=>card.icon).map(card=>({id:card.id,pixels:inkCount(card.icon.box,color(card.icon.ink),35)}));
 // Sample the triangle wings away from the route's centerline: a bare
 // stroked path without its marker must not satisfy the arrow check.
 const arrows=scene.paths.map(path=>path.arrow.points.map(([x,y])=>{const r=path.arrow.radius;return inkCount({x:x-r,y:y-r,width:r*2,height:r*2},color(path.stroke),35);}));
 const paths=scene.paths.map(path=>{
  const ink=color(path.stroke);return path.points.filter(([x,y])=>!scene.cards.some(n=>x>=n.box.x-5&&x<=n.box.x+n.box.width+5&&y>=n.box.y-5&&y<=n.box.y+n.box.height+5)).map(([x,y])=>inkCount({x:x-4,y:y-4,width:8,height:8},ink,35));
 });
 const labels=scene.labels.map(label=>({text:label.text,pixels:inkCount(label.box,color(label.fill),35)}));
 const corners=[[1,1],[canvas.width-2,1],[1,canvas.height-2],[canvas.width-2,canvas.height-2]].map(([x,y])=>at(x,y));
 // Scan the whole native bitmap at a bounded stride, so transparent/blank or
// one-corner-only renders cannot pass the content checks.
 let opaque=0,ink=0,samples=0;for(let y=0;y<canvas.height;y+=4)for(let x=0;x<canvas.width;x+=4){const p=at(x,y);samples++;if(p[3]===255)opaque++;if(distance(p,background)>12)ink++;}
 canvas.width=canvas.height=0;return {background,corners,cards,icons,expectedIconCount:scene.cards.filter(n=>n.classes.split(' ').includes('object')).length,arrows,paths,labels,opaque,ink,samples};
 },{base64:buffer.toString('base64'),scene,svg});}
function assertPixels(pixels){
 assert.equal(pixels.opaque,pixels.samples,'PNG has an opaque themed background throughout');assert.ok(pixels.ink>300,'download contains actual graph ink');
 for(const corner of pixels.corners)assert.deepEqual(corner,[...pixels.background,255],'outer graph padding stays blank');
 for(const card of pixels.cards){assert.ok(card.background.slice(0,3).every((v,i)=>Math.abs(v-card.expected[i])<=3),'HTML node theme background is rasterized: '+card.id);assert.ok(card.textPixels>20,'HTML Japanese node name has real text pixels: '+card.id);}
 assert.equal(pixels.icons.length,pixels.expectedIconCount,'every visible Object has its embedded SVG icon');
 assert.ok(pixels.icons.every(icon=>icon.pixels>8),'HTML-embedded object SVG icons have actual ink pixels');
 assert.ok(pixels.arrows.length===0||pixels.arrows.some(samples=>samples.every(count=>count>2)),'embedded arrow-marker wings have route-colored pixels away from the path centerline');
 assert.ok(pixels.paths.length===0||pixels.paths.some(samples=>samples.some(count=>count>4)),'native SVG route stroke appears in PNG');
 assert.ok(pixels.labels.length===0||pixels.labels.some(label=>label.pixels>20),'native SVG label glyphs appear in PNG');
}
const exportIDs=['save-image','copy-image'];
const idleExports=page=>page.waitForFunction(()=>['save-image','copy-image'].every(id=>{const b=document.getElementById(id);return !b.disabled&&b.getAttribute('aria-busy')==='false';}));
async function assertExportBusy(page,busy){
 for(const id of exportIDs){assert.equal(await page.locator('#'+id).isDisabled(),busy,id+' synchronized busy guard');assert.equal(await page.locator('#'+id).getAttribute('aria-busy'),String(busy),id+' accessible busy state');}
}
async function pressExport(page,id,input){
 const button=page.locator('#'+id);
 if(input==='keyboard'){await button.focus();await page.keyboard.press('Enter');}
 else if(input==='tap')await button.tap();
 else await button.click();
}
// This page exists only in the test router. Never paste before a successful
// native write of our fixed synthetic graph, and never request clipboard-read
// permission or call navigator.clipboard.read/readText. The ephemeral browser
// used by test-browser.mjs is not attached to an owner's browser or clipboard.
async function pasteSyntheticPng(f){
 const {page,context}=f;
 assert.equal(await page.evaluate(()=>__graphPng.writes.at(-1)?.completed),true,'paste is armed only after successful synthetic native write');
 const url=origin+'__graph-png-paste-fixture.html',handler=route=>route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><meta charset="utf-8"><title>Synthetic PNG paste test</title><link rel="icon" href="data:,"><div id="paste" contenteditable="true" aria-label="Synthetic PNG paste target" style="min-height:100px"></div>'});
 await context.route(url,handler);let target;
 try{
  target=await context.newPage();target.setDefaultTimeout(8000);await target.goto(url);
  await target.evaluate(()=>{
   globalThis.__pastedPng={events:0,result:null,error:null};
   document.getElementById('paste').addEventListener('paste',async event=>{
    event.preventDefault();const state=globalThis.__pastedPng;state.events++;
    try{
     if(!event.isTrusted)throw Error('Paste must be a native trusted event');
     const files=[...event.clipboardData.files];
     if(files.length!==1||files[0].type!=='image/png')throw Error('Expected one synthetic PNG clipboard file');
     const bytes=new Uint8Array(await files[0].arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=0x8000)binary+=String.fromCharCode(...bytes.subarray(i,i+0x8000));
     state.result={type:files[0].type,size:files[0].size,base64:btoa(binary),trusted:event.isTrusted};
    }catch(error){state.error=error.message;}
   },{once:true});
  });
  await target.locator('#paste').click();await target.keyboard.press('Control+V');
  await target.waitForFunction(()=>__pastedPng.result||__pastedPng.error);
  const pasted=await target.evaluate(()=>__pastedPng);assert.equal(pasted.error,null);assert.equal(pasted.events,1);assert.equal(pasted.result.trusted,true);assert.ok(pasted.result.size>0);
  return Buffer.from(pasted.result.base64,'base64');
 }finally{if(target)await target.close();await context.unroute(url,handler);await page.bringToFront();}
}
async function copyPng(f,{input='click'}={}){
 const {page}=f;await saved(page);
 const state=await page.evaluate(stateInPage),before=await record(page),scene=await page.evaluate(sceneInPage),requestCount=f.requests.length,downloadCount=f.downloads.length;
 const counts=await page.evaluate(()=>({sources:__graphPng.svgs.length,writes:__graphPng.writes.length,items:__graphPng.clipboardItems.length,blobs:__graphPng.blobCalls}));
 await pressExport(page,'copy-image',input);
 await page.waitForFunction(n=>__graphPng.writes.length===n+1&&__graphPng.writes.at(-1).completed,counts.writes);await idleExports(page);
 const probe=await page.evaluate(()=>({svgs:__graphPng.svgs,writes:__graphPng.writes,items:__graphPng.clipboardItems}));
 assert.equal(probe.svgs.length,counts.sources+1);assert.equal(probe.items.length,counts.items+1);assert.deepEqual(probe.items.at(-1),{types:['image/png'],promise:true,activation:true},'native ClipboardItem receives a promised PNG while user activation is live');
 assert.deepEqual(probe.writes.at(-1),{types:[['image/png']],blobCalls:counts.blobs,pending:0,activation:true,completed:true,error:null},'native write starts before asynchronous raster encoding');
 assert.equal(f.requests.length,requestCount,'copy has no network read or upload');assert.equal(f.downloads.length,downloadCount,'copy never starts a download');
 await saved(page);assert.deepEqual(await record(page),before,'copy leaves session and generation untouched');assert.deepEqual(await page.evaluate(stateInPage),state,'copy retains graph, view, tabs, selection, settings and drafts');
 const buffer=await pasteSyntheticPng(f),png=inspectPng(buffer),svg=await page.evaluate(inspectSvgInPage,probe.svgs.at(-1));
 assertSvg(scene,svg,png);const pixels=await pixelEvidence(page,buffer,scene,svg);assertPixels(pixels);
 assert.equal(f.requests.length,requestCount+1,'only the test-owned paste page is requested');await saved(page);assert.deepEqual(await record(page),before);assert.deepEqual(await page.evaluate(stateInPage),state);
 return {png,svg,pixels,scene,buffer,nativePaste:true};
}

async function exportPng(f,{input='click',nonmutation=true}={}){
 const {page}=f;await saved(page);
 const state=await page.evaluate(stateInPage),before=await record(page),scene=await page.evaluate(sceneInPage),requestCount=f.requests.length,sourceCount=await page.evaluate(()=>__graphPng.svgs.length);
 const [download]=await Promise.all([page.waitForEvent('download'),input==='tap'?page.locator('#save-image').tap():page.locator('#save-image').click()]);
 const buffer=await bytesOf(download),png=inspectPng(buffer);
 await idleExports(page);
 const sources=await page.evaluate(()=>__graphPng.svgs);assert.equal(sources.length,sourceCount+1,'one export creates one raster input');
 const svg=await page.evaluate(inspectSvgInPage,sources.at(-1));assertSvg(scene,svg,png);
 const pixels=await pixelEvidence(page,buffer,scene,svg);assertPixels(pixels);
 if(nonmutation){await saved(page);assert.deepEqual(await record(page),before,'export changes neither saved session nor generation');assert.deepEqual(await page.evaluate(stateInPage),state,'export preserves camera, graph, selection, filters, drafts, drawers and tabs');}
 assert.equal(f.requests.length,requestCount,'export performs no network read or upload');assert.match(download.suggestedFilename(),/^alder-.+\.png$/);
 assert.equal(await page.locator('a[download]').count(),0,'temporary download link is removed');
 return {png,svg,pixels,scene,buffer,filename:download.suggestedFilename()};
}
// Emit only these fixed synthetic-fixture images, never arbitrary app data.
// CI can inspect the actual downloaded pixels separately from geometric checks.
async function reportSyntheticImage(page,theme,result){
 if(theme==='light'&&result.buffer.length<=2_000_000)console.log('GRAPH_PNG_NATIVE_IMAGE '+JSON.stringify({theme,...result.png,base64:result.buffer.toString('base64'),note:'Original synthetic native PNG download for full-resolution Japanese glyph review.'}));
 const source={width:result.png.width,height:result.png.height,sha256:result.png.sha256};
 if(result.buffer.length<200_000){
  console.log('GRAPH_PNG_IMAGE '+JSON.stringify({theme,...source,base64:result.buffer.toString('base64'),note:'Original bytes from the native PNG download; no resizing or screenshot substitution.'}));return;
 }
 const preview=await page.evaluate(async base64=>{
  const bitmap=new Image();bitmap.src='data:image/png;base64,'+base64;await bitmap.decode();
  const ratio=Math.min(1,1000/bitmap.naturalWidth,800/bitmap.naturalHeight),canvas=document.createElement('canvas');
  canvas.width=Math.max(1,Math.round(bitmap.naturalWidth*ratio));canvas.height=Math.max(1,Math.round(bitmap.naturalHeight*ratio));
  canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);
  const result={width:canvas.width,height:canvas.height,base64:canvas.toDataURL('image/png').split(',')[1]};canvas.width=canvas.height=0;return result;
 },result.buffer.toString('base64'));
 console.log('GRAPH_PNG_IMAGE '+JSON.stringify({theme,...preview,source,note:'Downscaled PNG preview of the actual native PNG download, fitted within 1000 × 800; not a screenshot. Source SHA-256 and dimensions identify the unscaled download.'}));
}
async function bounded(promise,ms,message){let timer;try{return await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error(message)),ms);})]);}finally{clearTimeout(timer);}}
async function withPage(browser,{width=1280,height=960,touch=false}={},run){
 let context,expired=false,cleanup;const failures=[];
 const close=()=>cleanup??=bounded(Promise.resolve().then(()=>context.close()),5000,'PNG context cleanup timed out');
 const work=(async()=>{
  context=await browser.newContext({viewport:{width,height},hasTouch:touch,acceptDownloads:true});if(expired){await close();return;}
  await context.addInitScript(installPngProbe);
  const requests=[],external=[],errors=[],downloads=[];
  context.on('request',request=>{if(/^https?:/.test(request.url())){requests.push({url:request.url(),method:request.method()});if(new URL(request.url()).origin!==new URL(origin).origin)external.push(request.url());}});
  await context.route('**/*',route=>new URL(route.request().url()).origin===new URL(origin).origin?route.continue():route.abort());
  const page=await context.newPage();page.setDefaultTimeout(8000);page.setDefaultNavigationTimeout(12000);page.on('pageerror',error=>errors.push(error.message));page.on('download',download=>downloads.push(download));
  page.on('dialog',async dialog=>{errors.push('Unexpected dialog: '+dialog.type());await dialog.dismiss();});
  await page.goto(origin);await ready(page);
  const result=await run({page,context,requests,downloads});assert.deepEqual(errors,[]);assert.deepEqual(external,[],'PNG regression never sends data to an external service');return result;
 })();
 let result;try{result=await bounded(work,75000,'PNG browser case timed out');}catch(error){failures.push(error);}
 finally{expired=true;if(context)try{await close();}catch(error){failures.push(error);}}
 if(failures.length>1)throw new AggregateError(failures,'PNG case and cleanup failed');if(failures.length)throw failures[0];return result;
}

export async function verifyGraphPng(browser){
 const cases=[],add=(name,run,options)=>cases.push({name:'graph PNG: '+name,run:()=>withPage(browser,options,run)});
 add('whole signed/offscreen graph, long Japanese names/labels, light/dark, exact camera invariance',async f=>{
  const {page}=f;await prepare(page);
  const light=await exportPng(f);await reportSyntheticImage(page,'light',light);assert.ok(light.scene.cards.some(n=>n.box.x<0&&n.box.y<0));assert.ok(light.scene.cards.some(n=>n.offscreen),'fixture includes nodes beyond the current viewport');
  assert.ok(light.scene.labels.every(l=>l.text.length>15),'fixture has long Japanese SVG labels');assert.equal(light.svg.cards.length,4);assert.equal(light.svg.paths.length,10);
  // A camera-only change must produce identical PNG bytes, not a cropped
// viewport image. Hover is kept over toolbar controls, away from graph cards.
  await page.locator('#out').click();await page.locator('#out').click();await page.locator('#viewport').evaluate(v=>{v.scrollLeft+=170;v.scrollTop+=90;});await saved(page);
  const camera=await exportPng(f);
  await page.locator('#theme').click();await saved(page);const dark=await exportPng(f);await reportSyntheticImage(page,'dark',dark);
  if(camera.png.sha256!==light.png.sha256){const inputs=await page.evaluate(()=>__graphPng.svgs.slice(0,2));let at=0;while(at<Math.min(inputs[0].length,inputs[1].length)&&inputs[0][at]===inputs[1][at])at++;console.log('GRAPH_PNG_CAMERA_DIAGNOSTIC '+JSON.stringify({light:light.png,camera:camera.png,firstDifference:at,before:inputs[0].slice(Math.max(0,at-120),at+240),after:inputs[1].slice(Math.max(0,at-120),at+240)}));}
  assert.deepEqual(camera.png,light.png,'zoom/scroll have no effect on full-graph raster dimensions or bytes');
  assert.deepEqual([dark.png.width,dark.png.height],[light.png.width,light.png.height]);assert.notEqual(dark.png.sha256,light.png.sha256);assert.notDeepEqual(dark.pixels.background,light.pixels.background);
  await page.waitForFunction(()=>__graphPng.urls.length>0&&__graphPng.urls.every(item=>__graphPng.revoked.includes(item.url)));
  return {nodes:4,paths:10,japaneseLabels:10,light:light.png,dark:dark.png,negativeAndOffscreen:true,cameraInvariant:true,blobURLsReleased:true};
 });
 add('current visibility and selected-edge settings, open drawers and saved editor draft stay unchanged',async f=>{
  const {page}=f;await prepare(page);await openDisplaySettings(page);
  await page.locator('#show-outside').uncheck();await page.locator('#prefer-write').check();await page.locator('#show-exceptions').uncheck();await page.locator('#selected-edges-only').check();await saved(page);
  const relations=fixture.design.graph.relations,hidden=hiddenReadIndexes(relations,true),visible=relations.flatMap((r,i)=>!hidden.has(i)&&!r.kind.endsWith('exception')&&r.from!==names.person&&r.to!==names.person&&(r.from===names.read||r.to===names.read)?[String(i)]:[]);
  assert.ok(visible.length>0&&visible.length<10);assert.deepEqual(await page.locator('.edge').evaluateAll(es=>es.map(e=>e.dataset.relation).sort()),visible.sort());
  await page.locator('#drawer').click();await page.locator('#node-list-toggle').click();await saved(page);
  const result=await exportPng(f);assert.equal(result.svg.cards.length,3);assert.equal(result.svg.paths.length,visible.length);assert.equal(result.svg.cards.some(n=>n.text.includes(names.person)),false);
  assert.ok(result.svg.paths.every(p=>p.classes.includes('review-related')));
  // An open editor and unsent draft are retained as data even though neither
// is part of the graph export. Keep the click path reachable by closing its
// modal surface before exporting; the draft is preserved by the real dialog.
  const draftText=fixture.raw.replace('Determine the next action.','Synthetic unsent draft.');assert.notEqual(draftText,fixture.raw,'draft fixture must change the original Markdown');
  await page.locator('#edit-markdown').click();await page.locator('#source-text').fill(draftText);
  await page.locator('#source-cancel').click();if(await page.locator('#source-close-dialog').isVisible())await page.locator('#source-close-confirm').click();await page.locator('#source-dialog').waitFor({state:'hidden'});await saved(page);
  const draft=await record(page);assert.equal(draft.current.tabs.find(t=>t.key===draft.current.active).draft,draftText,'read the exact committed editor draft, not merely a save-state label');
  const retained=await exportPng(f);assert.equal(retained.png.sha256,result.png.sha256,'saved editor draft is excluded from graph raster');
  return {visibleNodes:3,visibleEdges:visible.length,selectedStroke:true,drawersAndDraftPreserved:true};
 });
 add('isolated visible Activity exports with no routes, labels or Object icon',async f=>{
  const {page}=f;await prepare(page,{hiddenNodes:fixture.design.graph.nodes.map(n=>n.id).filter(id=>id!==names.read)});
  const result=await exportPng(f);assert.equal(result.svg.cards.length,1);assert.equal(result.svg.paths.length,0);assert.equal(result.svg.labels.length,0);assert.equal(result.pixels.icons.length,0);
  assert.ok(result.svg.cards[0].text.includes(names.read));assert.ok(result.png.width<1000&&result.png.height<500,'hidden nodes do not expand the exported crop');
  return {visibleNodes:1,paths:0,labels:0,png:result.png};
 });
 for(const width of [320,393])add('native touch PNG actions precede source sharing at '+width+'px',async f=>{
  const {page}=f;await openFixture(page);assert.equal(await page.locator('#display-settings-toggle').getAttribute('aria-expanded'),'false','PNG actions need no gear expansion');
  const strip=await assertTabStripActions(page),closed=await assertToolbarLayout(page,{open:false});
  console.log('GRAPH_PNG_TOOLBAR_IMAGE '+JSON.stringify({width,height:width===320?568:852,base64:(await page.screenshot({type:'png',fullPage:true})).toString('base64'),note:'Synthetic full-page native screenshot: PNG save/copy immediately before source sharing, settings closed.'}));
  const result=await exportPng(f,{input:'tap'});assert.equal(await page.locator('#display-settings-toggle').getAttribute('aria-expanded'),'false');
  await openDisplaySettings(page);const opened=await assertToolbarLayout(page,{open:true});await assertTabStripActions(page);
  console.log('GRAPH_PNG_SETTINGS_IMAGE '+JSON.stringify({width,height:width===320?568:852,base64:(await page.screenshot({type:'png',fullPage:true})).toString('base64'),note:'Synthetic full-page native screenshot: compact PNG actions stay in tab-strip; expanded settings contain only reset action.'}));
  return {width,tabActions:strip.actions.map(a=>({id:a.id,width:a.width,height:a.height,hit:a.hit})),closedToolbarHeight:closed.toolbar.height,openedToolbarHeight:opened.toolbar.height,viewportHeight:opened.viewport.height,hitTest:true,nativeTapDownload:true,png:result.png};
 },{width,height:width===320?568:852,touch:true});
 for(const failure of ['empty','huge','toBlob'])add(failure+' failure preserves saved state and unlocks retry',async f=>{
  const {page,downloads}=f;for(const id of ['save-image','copy-image']){assert.equal(await page.locator('#'+id).isVisible(),false,'no document hides '+id);assert.equal(await page.locator('#'+id).isDisabled(),true);}await prepare(page);
  if(failure==='empty')await seed(page,{hiddenNodes:fixture.design.graph.nodes.map(n=>n.id)});
  if(failure==='huge')await seed(page,{positions:{...positions,[names.record]:[100000,700]}});
  if(failure==='toBlob')await page.evaluate(()=>{__graphPng.failBlob=true;});
  const before=await saved(page),state=await page.evaluate(stateInPage),requests=f.requests.length;
  await page.locator('#save-image').click();await page.waitForFunction(()=>!document.querySelector('#save-image').disabled&&document.querySelector('#status').dataset.kind==='error'&&!document.querySelector('#status').hidden);
  const message=await page.locator('#status-text').textContent();assert.match(message,/画像/);assert.match(message,failure==='empty'?/項目がありません/:failure==='huge'?/大きすぎる/:/PNG/);
  assert.equal(await page.locator('#status-text').getAttribute('role'),'alert');assert.equal(downloads.length,0);assert.equal(await page.locator('#save-image').getAttribute('aria-busy'),'false');
  await saved(page);assert.deepEqual(await record(page),before);assert.deepEqual(await page.evaluate(stateInPage),state);assert.equal(f.requests.length,requests);
  if(failure!=='toBlob')assert.equal(await page.evaluate(()=>__graphPng.blobCalls),0,'unsafe/empty image is rejected before canvas allocation');
  await page.locator('#status-close').click();
  if(failure==='toBlob')await page.evaluate(()=>{__graphPng.failBlob=false;});else await seed(page,{positions,hiddenNodes:[]});
  const retry=await exportPng(f);assert.equal(downloads.length,1);return {failure,recovered:true,png:retry.png};
 });
 add('repeat native clicks and tab change during encoding keep the original snapshot/name',async f=>{
  const {page,downloads}=f;await openFixture(page,'first-original.md');await openFixture(page,'second-current.md',fixture.raw.replaceAll('確認担当者','別の担当者'));
  const keys=await page.locator('.tab').evaluateAll(ts=>ts.map(t=>t.dataset.key));await page.locator(`.tab[data-key="${keys[0]}"] > button`).first().click();await saved(page);
  const first=await page.evaluate(sceneInPage);await page.evaluate(()=>{__graphPng.holdBlob=true;});await page.locator('#save-image').click();
  await page.waitForFunction(()=>__graphPng.pending.length===1);await assertExportBusy(page,true);
  const box=await page.locator('#save-image').boundingBox();await page.mouse.click(box.x+box.width/2,box.y+box.height/2);await page.mouse.click(box.x+box.width/2,box.y+box.height/2);
  const copyBox=await page.locator('#copy-image').boundingBox();await page.mouse.click(copyBox.x+copyBox.width/2,copyBox.y+copyBox.height/2);
  assert.equal(await page.evaluate(()=>__graphPng.writes.length),0,'save in flight blocks clipboard copy');
  assert.equal(await page.evaluate(()=>__graphPng.blobCalls),1);assert.equal(await page.evaluate(()=>__graphPng.svgs.length),1);assert.equal(downloads.length,0);
  await page.locator(`.tab[data-key="${keys[1]}"] > button`).first().click();await saved(page);await assertExportBusy(page,true);
  const before=await record(page),state=await page.evaluate(stateInPage),requestCount=f.requests.length;
  const [download]=await Promise.all([page.waitForEvent('download'),page.evaluate(()=>{__graphPng.holdBlob=false;__graphPng.pending.splice(0).forEach(release=>release());})]);
  const buffer=await bytesOf(download),png=inspectPng(buffer),svg=await page.evaluate(inspectSvgInPage,await page.evaluate(()=>__graphPng.svgs[0]));
  assert.equal(download.suggestedFilename(),'alder-first-original.png');assertSvg(first,svg,png);assertPixels(await pixelEvidence(page,buffer,first,svg));
  await idleExports(page);await saved(page);assert.deepEqual(await record(page),before);assert.deepEqual(await page.evaluate(stateInPage),state);assert.equal(f.requests.length,requestCount);assert.equal(downloads.length,1);
  const next=await exportPng(f);assert.equal(next.filename,'alder-second-current.png');assert.equal(downloads.length,2);
  return {firstSnapshotRetained:true,duplicateDownloads:0,tabSwitchPreserved:true,retryAfterCompletion:true};
 });
 add('native clipboard write and trusted paste retain the whole graph in light/dark without changing the viewer',async f=>{
  const {page}=f;await prepare(page);assert.equal(await page.locator('#display-settings-toggle').getAttribute('aria-expanded'),'false');
  const light=await copyPng(f,{input:'keyboard'});assert.ok(light.scene.cards.some(n=>n.offscreen));assert.ok(light.scene.cards.some(n=>n.box.x<0&&n.box.y<0));
  await page.locator('#theme').click();await saved(page);const dark=await copyPng(f);
  assert.deepEqual([light.png.width,light.png.height],[dark.png.width,dark.png.height]);assert.notEqual(light.png.sha256,dark.png.sha256);assert.notDeepEqual(light.pixels.background,dark.pixels.background);
  assert.equal(f.downloads.length,0);return {nativeClipboardWrites:2,nativeTrustedPastes:2,promisedPng:true,light:light.png,dark:dark.png,settingsStayedClosed:true};
 });
 for(const fault of ['clipboard missing','write missing','ClipboardItem missing','PNG type unsupported'])add(fault+' explains PNG save and allows explicit download fallback',async f=>{
  const {page,downloads}=f;await prepare(page);
  await page.evaluate(fault=>{
   if(fault==='clipboard missing')Object.defineProperty(navigator,'clipboard',{configurable:true,value:undefined});
   if(fault==='write missing')Object.defineProperty(navigator,'clipboard',{configurable:true,value:{}});
   if(fault==='ClipboardItem missing')Object.defineProperty(globalThis,'ClipboardItem',{configurable:true,value:undefined});
   if(fault==='PNG type unsupported')Object.defineProperty(ClipboardItem,'supports',{configurable:true,value:()=>false});
  },fault);
  const before=await saved(page),state=await page.evaluate(stateInPage),requests=f.requests.length;
  await page.locator('#copy-image').click();await page.waitForFunction(()=>!document.getElementById('status').hidden&&document.getElementById('status').dataset.kind==='error');await idleExports(page);
  assert.match(await page.locator('#status-text').textContent(),/PNG.*保存/);assert.equal(await page.locator('#status-text').getAttribute('role'),'alert');
  assert.equal(await page.evaluate(()=>__graphPng.writes.length),0,'unsupported API cannot attempt a clipboard write');assert.equal(await page.evaluate(()=>__graphPng.blobCalls),0,'unsupported API fails before raster encoding');
  assert.equal(downloads.length,0,'unsupported copy never silently downloads');await saved(page);assert.deepEqual(await record(page),before);assert.deepEqual(await page.evaluate(stateInPage),state);assert.equal(f.requests.length,requests);
  await page.locator('#status-close').click();const fallback=await exportPng(f);assert.equal(downloads.length,1);
  return {fault,copyErrorAnnounced:true,noAutomaticDownload:true,explicitSaveWorks:true,png:fallback.png};
 });
 add('clipboard write denial preserves graph and offers working PNG save without silent download',async f=>{
  const {page,downloads}=f;await prepare(page);await page.evaluate(()=>{__graphPng.denyWrite=true;});
  const before=await saved(page),state=await page.evaluate(stateInPage),requests=f.requests.length;
  await page.locator('#copy-image').click();await page.waitForFunction(()=>!document.getElementById('status').hidden&&document.getElementById('status').dataset.kind==='error');await idleExports(page);
  assert.match(await page.locator('#status-text').textContent(),/PNG.*保存/);assert.equal(await page.locator('#status-text').getAttribute('role'),'alert');
  const write=await page.evaluate(()=>__graphPng.writes.at(-1));assert.equal(write.error,'NotAllowedError');assert.equal(write.completed,false);assert.equal(downloads.length,0);
  await saved(page);assert.deepEqual(await record(page),before);assert.deepEqual(await page.evaluate(stateInPage),state);assert.equal(f.requests.length,requests);
  await page.locator('#status-close').click();const fallback=await exportPng(f);assert.equal(downloads.length,1);assert.equal(await page.evaluate(()=>__graphPng.writes.length),1,'fallback does not retry rejected clipboard write');
  return {deniedWrite:true,noAutomaticDownload:true,explicitSaveWorks:true,png:fallback.png};
 });
 add('delayed clipboard encoding writes immediately and blocks both actions across tab switching',async f=>{
  const {page,downloads}=f;await openFixture(page,'first-copy.md');await openFixture(page,'second-copy.md',fixture.raw.replaceAll('確認担当者','別の担当者'));
  const keys=await page.locator('.tab').evaluateAll(ts=>ts.map(t=>t.dataset.key));await page.locator(`.tab[data-key="${keys[0]}"] > button`).first().click();await saved(page);
  const first=await page.evaluate(sceneInPage);await page.evaluate(()=>{__graphPng.holdBlob=true;});await page.locator('#copy-image').click();
  await page.waitForFunction(()=>__graphPng.pending.length===1);await assertExportBusy(page,true);
  const observation=await page.evaluate(()=>({item:__graphPng.clipboardItems[0],write:__graphPng.writes[0]}));
  assert.deepEqual(observation.item,{types:['image/png'],promise:true,activation:true});assert.deepEqual(observation.write,{types:[['image/png']],blobCalls:0,pending:0,activation:true,completed:false,error:null},'write receives a promise before generation completes');
  for(const id of ['copy-image','copy-image','save-image']){const box=await page.locator('#'+id).boundingBox();await page.mouse.click(box.x+box.width/2,box.y+box.height/2);}
  assert.equal(await page.evaluate(()=>__graphPng.writes.length),1);assert.equal(await page.evaluate(()=>__graphPng.blobCalls),1);assert.equal(downloads.length,0);
  await page.locator(`.tab[data-key="${keys[1]}"] > button`).first().click();await saved(page);await assertExportBusy(page,true);
  const before=await record(page),state=await page.evaluate(stateInPage),requests=f.requests.length;
  await page.evaluate(()=>{__graphPng.holdBlob=false;__graphPng.pending.splice(0).forEach(release=>release());});
  await page.waitForFunction(()=>__graphPng.writes[0].completed);await idleExports(page);await saved(page);
  assert.deepEqual(await record(page),before);assert.deepEqual(await page.evaluate(stateInPage),state);assert.equal(f.requests.length,requests);assert.equal(downloads.length,0);
  const buffer=await pasteSyntheticPng(f),png=inspectPng(buffer),svg=await page.evaluate(inspectSvgInPage,await page.evaluate(()=>__graphPng.svgs[0]));assertSvg(first,svg,png);assertPixels(await pixelEvidence(page,buffer,first,svg));
  await saved(page);assert.deepEqual(await record(page),before);assert.deepEqual(await page.evaluate(stateInPage),state);
  const next=await exportPng(f);assert.equal(next.filename,'alder-second-copy.png');assert.equal(downloads.length,1);
  return {nativeWriteBeforeEncoding:true,originalSnapshotPasted:true,duplicateWrites:0,crossActionBusyGuard:true,tabSwitchPreserved:true,saveAfterCopy:true,png};
 });
 const results=await runBrowserCases(cases);
 return {cases:results.length,passed:results.length,limits:['Native Chromium download, clipboard write and trusted paste on isolated localhost CI; PNG pixels and touch emulation. API/denial faults are injected. No user clipboard read, permission grant, screenshot visual acceptance, physical mobile, OS save dialog or cross-browser claim.']};
}
