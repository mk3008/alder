import assert from 'node:assert/strict';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {parseDesign} from '../src/graph.ts';
import {parseDocument} from '../src/json-document.ts';
import {activityDesign} from '../src/activities.ts';
import {readSessionInPage} from './wait-saved-viewer.mjs';
const root='../work/viewer-json/issue-274/layout-regression/',md=readFileSync(root+'same-business.md','utf8'),json=readFileSync(root+'same-business.json','utf8');
const hash=b=>createHash('sha256').update(b).digest('hex');
export async function verifyJSONLayout(browser,{source=json,evidenceDirectory='web/evidence/json-layout'}={}){
 const out=evidenceDirectory;mkdirSync(out,{recursive:true});writeFileSync(out+'/same-business.md',md);writeFileSync(out+'/same-business.json',source);const results=[],pngs=new Map();
 for(const width of [1280,393]){
  const observed={};
  for(const [format,source] of [['md',md],['json',source]]){
   const design=format==='md'?parseDesign(source):parseDocument(source),names=new Map(design.graph.nodes.map(n=>[n.id,n.name]));
   const context=await browser.newContext({viewport:{width,height:960},acceptDownloads:true}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(15000);
   const ready=()=>page.waitForFunction(()=>!document.querySelector('#open').disabled),saved=async()=>{await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await page.waitForFunction(()=>['saved','unchanged'].includes(document.querySelector('#app')?.dataset.saveState));};
   async function snapshot(activity){
    await saved();await page.evaluate(()=>document.fonts.ready);const projected=activityDesign(design,activity);
    const dom=await page.evaluate(()=>({nodes:[...document.querySelectorAll('.node')].map(n=>({id:n.dataset.node,x:parseFloat(n.style.left),y:parseFloat(n.style.top),width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height,screen:[n.getBoundingClientRect().left,n.getBoundingClientRect().top]})),edges:[...document.querySelectorAll('.edge')].map(e=>{const l=document.querySelector(`.edge-label[data-relation="${e.dataset.relation}"]`);return {index:Number(e.dataset.relation),path:e.getAttribute('d'),label:[Number(l.getAttribute('x')),Number(l.getAttribute('y'))],text:l.textContent};}),scroll:[document.querySelector('#viewport').scrollLeft,document.querySelector('#viewport').scrollTop],zoom:document.querySelector('#zoom').textContent,viewBox:document.querySelector('#edges').getAttribute('viewBox'),offset:[document.querySelector('#nodes').style.left,document.querySelector('#nodes').style.top]}));
    assert.equal(dom.nodes.length,projected.graph.nodes.length);const nodes=dom.nodes.map(n=>({...n,id:names.get(n.id)})).sort((a,b)=>a.id.localeCompare(b.id));
    const edges=dom.edges.map(e=>{const r=projected.graph.relations[e.index];return {...e,index:undefined,kind:r.kind,from:names.get(r.from),to:names.get(r.to),labelText:r.label};}).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
    const stored=await page.evaluate(readSessionInPage),active=stored.tabs.find(t=>t.key===stored.active);
    const positions=Object.fromEntries(Object.entries(active.positions).map(([id,p])=>[names.get(id),p]).sort());
    const gaps=nodes.flatMap((a,i)=>nodes.slice(i+1).map(b=>[a.id,b.id,b.x-a.x,b.y-a.y]));
    return {...dom,nodes,edges,gaps,positions,camera:{scroll:active.scroll,zoom:active.zoom,inset:active.viewInset,origin:active.canvasOrigin??null,selected:active.selected?names.get(active.selected):null}};
   }
   async function evidence(key){
    await page.screenshot({path:`${out}/${format}-${key}-${width}.png`});
    if(width===1280){const [download]=await Promise.all([page.waitForEvent('download'),page.locator('#save-image').click()]);const path=`${out}/${format}-${key}-full.png`;await download.saveAs(path);const bytes=readFileSync(path);pngs.set(`${format}-${key}`,bytes);}
   }
   async function cameraRoundTrip(activity,key){
    // Use the existing toggle: the mobile Drawer overlays camera controls.
    if(await page.locator('#formattedMarkdownDrawer').isVisible())await page.locator('#drawer').click();
    const initial=await snapshot(activity);await page.locator('#in').click();await page.evaluate(()=>document.querySelector('#viewport').scrollTo(171,303));
    const moved=await snapshot(activity);assert.deepEqual(moved.positions,initial.positions,'zoom/scroll never change world coordinates');assert.notEqual(moved.zoom,initial.zoom);assert.ok(moved.scroll.some(n=>n>0));
    await page.reload();await ready();const restored=await snapshot(activity);assert.deepEqual(restored,moved,'native save/reload keeps exact geometry and camera');
    await page.locator('#display-settings-toggle').click();await page.locator('#reset-layout').click();await page.keyboard.press('Escape');const reset=await snapshot(activity);assert.deepEqual(reset.positions,initial.positions);assert.equal(reset.zoom,'100%');assert.deepEqual(reset.scroll,[0,0]);
    observed[format][key]={initial,moved,restored,reset};
   }
   try{
    await page.goto('http://127.0.0.1:4173/');await ready();await page.locator('#fallback').setInputFiles({name:`same-business.${format}`,mimeType:format==='json'?'application/json':'text/markdown',buffer:Buffer.from(source)});await page.waitForFunction(()=>document.querySelectorAll('.node').length===25);
    if(await page.locator('#check-followup').isVisible())await page.locator('#check-followup-later').click();
    observed[format]={overview:await snapshot()};await evidence('overview');await cameraRoundTrip(undefined,'overviewCamera');
    for(const [index,activity] of design.activityOrder.entries()){
     await page.locator('.tab').first().locator('button').first().click();await page.locator(`.node[data-activity="${activity}"] .activity-open`).press('Enter');await saved();
     const name=names.get(activity);observed[format][name]=await snapshot(activity);
     if(index===0){await evidence('activity-detail');await cameraRoundTrip(activity,'detailCamera');}
    }
    assert.deepEqual(errors,[]);
   }catch(error){await page.screenshot({path:`${out}/${format}-failure-${width}.png`}).catch(()=>{});throw error;}finally{writeFileSync(`${out}/${format}-geometry-${width}.json`,JSON.stringify(observed[format],null,2));await context.close();}
  }
  assert.deepEqual(observed.json,observed.md,`MD/JSON rendered world, screen, spacing, SVG endpoints/bends/labels, zoom/scroll/reload/reset at ${width}px`);
  results.push({width,views:11,comparison:'exact',worldTolerance:0,screenTolerance:0,zoomScrollResetReload:true});
 }
 for(const key of ['overview','activity-detail']){const a=pngs.get('md-'+key),b=pngs.get('json-'+key);assert.ok(a.equals(b),'native full graph PNG pixels and bytes match: '+key);results.push({nativePNG:key,identical:true,sha256:hash(a),bytes:a.length});}
 const result={browser:browser.version(),results};writeFileSync(`${out}/comparison-results.json`,JSON.stringify(result,null,2));return result;
}
