import {ensureDocumentActions} from './test-tab-strip-browser.mjs';
import assert from 'node:assert/strict';
import {readFileSync,mkdirSync} from 'node:fs';
import {parseDesign} from '../src/graph.ts';
export const gettingStartedFile=readFileSync(new URL('./authorities/business-design.md',import.meta.url),'utf8');
assert.ok(parseDesign(gettingStartedFile).graph.nodes.length,'file fixture must satisfy the real parser');
import {waitForExactRead} from './wait-saved-viewer.mjs';
function readSession(database){return new Promise((resolve,reject)=>{
 const request=indexedDB.open(database,1);request.onupgradeneeded=()=>request.transaction.abort();request.onerror=()=>reject(request.error);
 request.onsuccess=()=>{const db=request.result,tx=db.transaction('session','readonly'),get=tx.objectStore('session').get('current');let value;get.onsuccess=()=>{value=get.result;};tx.oncomplete=()=>{db.close();resolve(value?.format>=2?{...value,tabs:value.views.map(v=>({...value.document,...v}))}:value);};tx.onerror=tx.onabort=()=>{db.close();reject(tx.error);};};
});}
export async function verifyGettingStarted(browser,origin='http://127.0.0.1:4173/'){
 const context=await browser.newContext(),page=await context.newPage(),results=[];
 const fresh=async(url)=>{await page.waitForFunction(()=>['saved','unchanged'].includes(document.querySelector('#app').dataset.saveState));await page.goto(new URL('LICENSE.txt',url).href);await page.evaluate(()=>Promise.all(['alder-web-viewer','alder-web-viewer:preview:pr-204:always-visible'].map(name=>new Promise((resolve,reject)=>{const r=indexedDB.deleteDatabase(name);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error);})))) ;await page.goto(url);await page.waitForFunction(()=>!document.querySelector('#open').disabled);};

 // Exercise the supported input-file fallback with a real browser file chooser.
 await context.addInitScript(()=>{window.showOpenFilePicker=undefined;});
 mkdirSync('web/evidence/header-controls',{recursive:true});
 await context.route('https://viewer-guide.test/design.md',route=>route.fulfill({status:200,contentType:'text/markdown',headers:{'access-control-allow-origin':'*'},body:gettingStartedFile}));
 // Serve identical built bytes at the nested path, as the preview-isolation gate does.
 await context.route('**/preview/pr-204/always-visible/**',async route=>{const url=new URL(route.request().url()),path=url.pathname.replace(/^\/preview\/pr-204\/always-visible\//,'/');await route.fulfill({response:await route.fetch({url:new URL(path+url.search,origin).href})});});
 try{
  for(const preview of [false,true])for(const width of [1440,1001,1000,800,600,481,393,360,320]){
   await page.setViewportSize({width,height:width===320?568:852});await page.goto(preview?new URL('preview/pr-204/always-visible/',origin).href:origin);
   await page.waitForFunction(()=>document.querySelector('#open')&&!document.querySelector('#open').disabled);
   const github=page.locator('#github-link'),guide=page.locator('#authoring-guide');
   assert.equal(await github.getAttribute('aria-label'),'GitHubを開く');assert.equal(await github.getAttribute('title'),'GitHubを開く');
   assert.deepEqual(await github.evaluate(e=>[e.previousElementSibling.id,e.nextElementSibling.id]),['help-menu-toggle','drawer']);
   assert.equal(await github.isVisible(),true);assert.equal(await guide.isVisible(),true);
   const frame=await page.locator('#empty').evaluate(e=>{
    const r=e.getBoundingClientRect(),v=e.parentElement.getBoundingClientRect();
    return {top:r.top,bottom:r.bottom,left:r.left,right:r.right,viewport:{top:v.top,bottom:v.bottom,left:v.left,right:v.right},touch:getComputedStyle(e.parentElement).touchAction};
   });
   assert.ok(frame.top>=frame.viewport.top&&frame.bottom<=frame.viewport.bottom+1,'empty content frame fits vertically');
   assert.ok(frame.left>=frame.viewport.left&&frame.right<=frame.viewport.right+1,'empty content frame fits horizontally');
   assert.equal(frame.touch,'pan-y','overflowing empty help permits native touch scrolling');
   assert.equal(await github.getAttribute('href'),'https://github.com/mk3008/alder');
   assert.equal(await guide.locator('a').getAttribute('href'),'https://github.com/mk3008/alder/blob/main/README.ja.md');
   {
    await page.locator('body').click({position:{x:1,y:1}});
    let reached=false;
    for(let i=0;i<15;i++){await page.keyboard.press('Tab');if(await github.evaluate(e=>document.activeElement===e)){reached=true;break;}}
    assert.ok(reached,'repository link is in keyboard traversal');
    assert.equal(await github.evaluate(e=>getComputedStyle(e).outlineStyle),'solid');
   }
   for(const id of ['node-list-toggle','github-link','open-menu-toggle','theme','help-menu-toggle','drawer']){
    const control=page.locator('#'+id);assert.equal(await control.isVisible(),true,id+' always visible');
    const r=await control.boundingBox();assert.ok(r.x>=-.5&&r.x+r.width<=width+.5,id+' remains reachable');
   }
   assert.equal(await page.locator('#refresh').isVisible(),false,'no document hides source refresh');
   const header=await page.locator('header').evaluate(e=>{
    const nodes=[...e.querySelectorAll('button,a#github-link,strong,#preview-badge')].filter(n=>!n.hidden&&getComputedStyle(n).display!=='none'&&getComputedStyle(n).visibility!=='hidden');
    return {scroll:e.scrollWidth,width:e.clientWidth,rects:nodes.map(n=>{const r=n.getBoundingClientRect();return {id:n.id||'brand',x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height};})};
   });
   const brand=page.locator('header strong');
   if(!await brand.isVisible())assert.equal(await brand.evaluate(e=>getComputedStyle(e).pointerEvents),'none','hidden title cannot intercept controls');
   assert.ok(header.scroll<=header.width+1,'header has no horizontal overflow');
   for(const r of header.rects){assert.ok(r.width>0&&r.height>0&&r.x>=0&&r.right<=width+.5,r.id+' fits');for(const q of header.rects){if(q.id!==r.id)assert.ok(Math.min(q.right,r.right)-Math.max(q.x,r.x)<=.5||Math.min(q.bottom,r.bottom)-Math.max(q.y,r.y)<=.5,r.id+' overlaps '+q.id);}}
   assert.equal(await page.locator('#preview-badge').isVisible(),preview);
   const opening=page.locator('#opening-guide');
   assert.equal(await opening.isVisible(),true);
   const typography=await page.locator('.empty-guide').evaluateAll(nodes=>nodes.map(n=>{const h=n.querySelector('h2'),r=n.getBoundingClientRect();return {x:r.x,width:r.width,font:getComputedStyle(h).fontSize,align:getComputedStyle(n).textAlign};}));
   assert.deepEqual(typography[0],typography[1],'both guides share heading style and alignment');
   const actionLeft=await page.locator('#open-sample').evaluate(e=>({x:e.getBoundingClientRect().x,padding:getComputedStyle(e).paddingLeft}));assert.equal(actionLeft.x,typography[0].x);assert.equal(actionLeft.padding,'0px');
   if([1440,393,320].includes(width)){await page.screenshot({path:`web/evidence/header-controls/guide-${width}-${preview?'preview':'production'}.png`});}
   for(const [id,title,input] of [['guide-open-url','URLを開く','source-url'],['guide-open-text','テキストを入力','source-text']]){
    const action=page.locator('#'+id);await action.scrollIntoViewIfNeeded();await action.focus();await page.keyboard.press('Enter');
    assert.equal(await page.locator('#source-title').textContent(),title);assert.equal(await page.locator('#source-dialog').isVisible(),true);
    await page.locator('#'+input).fill(id==='guide-open-url'?'http://invalid.example/design.md':'# invalid');
    await page.locator('#source-submit').click();assert.equal(await page.locator('#source-dialog').isVisible(),true);assert.equal(await page.locator('.tab').count(),0);
    await page.locator('#source-cancel').click();assert.equal(await page.locator('#source-dialog').isVisible(),false);assert.equal(await action.evaluate(e=>document.activeElement===e),true);
   }
   await page.locator('#status-close').click();
   await page.locator('#guide-open-url').click();await page.locator('#source-url').fill('https://viewer-guide.test/design.md');await page.locator('#source-submit').click();await page.waitForSelector('.tab');assert.equal(await opening.isVisible(),false);await ensureDocumentActions(page);assert.equal(await page.locator('#refresh').isVisible(),true);assert.equal(await page.locator('#refresh').isEnabled(),true);
   const refetch=page.waitForRequest('https://viewer-guide.test/design.md');await ensureDocumentActions(page);await page.locator('#refresh').click();await refetch;await page.waitForFunction(()=>!document.querySelector('#refresh').disabled);assert.equal(await page.locator('.tab').count(),1,'native refresh rereads the existing URL document');assert.equal(await page.locator('.close').isVisible(),false);await fresh(page.url());
   await page.locator('#guide-open-text').click();await page.locator('#source-text').fill(gettingStartedFile);await page.locator('#source-submit').click();await page.waitForSelector('.tab');assert.equal(await opening.isVisible(),false);await ensureDocumentActions(page);assert.equal(await page.locator('#refresh').isVisible(),true);assert.equal(await page.locator('#refresh').isDisabled(),true);assert.equal(await page.locator('.close').isVisible(),false);await fresh(page.url());
   for(const id of ['guide-open','guide-open-url','guide-open-text','open-sample']){const action=page.locator('#'+id);await action.scrollIntoViewIfNeeded();const r=await action.boundingBox();assert.ok(r.height>=44&&r.x>=0&&r.x+r.width<=width,'guide action target '+id);}
   const readme=guide.locator('a');await readme.scrollIntoViewIfNeeded();await readme.focus();
   assert.equal(await readme.evaluate(e=>document.activeElement===e),true);
   assert.equal(await readme.evaluate(e=>{const r=e.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return hit===e||e.contains(hit);}),true,'README link is reachable after scrolling');
   const bounds=await page.locator('#empty').evaluate(e=>({width:e.getBoundingClientRect().width,scroll:e.scrollWidth}));
   assert.ok(bounds.scroll<=bounds.width+1,'guide has no horizontal overflow');
   if([1440,393,320].includes(width)){if(await page.locator('#status').isVisible())await page.locator('#status-close').click();await readme.scrollIntoViewIfNeeded();await page.screenshot({path:`web/evidence/header-controls/guide-end-${width}-${preview?'preview':'production'}.png`});}
   await page.locator('#open-sample').click();await page.waitForSelector('.node');await ensureDocumentActions(page);assert.equal(await page.locator('#refresh').isVisible(),true);assert.equal(await page.locator('#refresh').isDisabled(),true);
   assert.equal(await guide.isVisible(),false);
   assert.equal(await page.locator('.close').isVisible(),false);await fresh(page.url());await page.waitForFunction(()=>!document.querySelector('.tab'));
   assert.equal(await guide.isVisible(),true);
   const chooserPromise=page.waitForEvent('filechooser');await page.locator('#guide-open').click();const chooser=await chooserPromise;await chooser.setFiles({name:'getting-started.md',mimeType:'text/markdown',buffer:Buffer.from(gettingStartedFile)});
   await page.waitForSelector('.tab');assert.equal(await guide.isVisible(),false);await ensureDocumentActions(page);assert.equal(await page.locator('#refresh').isVisible(),true);assert.equal(await page.locator('#refresh').isEnabled(),true);
   // A tab is rendered before the asynchronous fallback change handler completes.
   // Wait for its public completion state before sending a new native key action.
   await page.waitForFunction(()=>!document.querySelector('#open').disabled&&document.querySelector('#fallback').value==='');
   const fileKey=await page.locator('.tab').getAttribute('data-key');await ensureDocumentActions(page);await page.locator('#refresh').focus();assert.equal(await page.locator('#refresh').evaluate(el=>document.activeElement===el),true);
   const reselectPromise=page.waitForEvent('filechooser');await page.locator('#refresh').press('Enter');const reselect=await reselectPromise.catch(async error=>{console.error(JSON.stringify({fileRefreshFailure:{width,preview,...await page.evaluate(()=>({active:document.activeElement?.id,refreshDisabled:document.querySelector('#refresh').disabled,openDisabled:document.querySelector('#open').disabled,status:document.querySelector('#status-text').textContent,fileInputs:[...document.querySelectorAll('input[type=file]')].map(input=>({id:input.id,hidden:input.hidden,value:input.value}))}))}}));throw error;});await reselect.setFiles({name:'getting-started.md',mimeType:'text/markdown',buffer:Buffer.from(gettingStartedFile)});await page.waitForFunction(()=>!document.querySelector('#refresh').disabled);assert.equal(await page.locator('.tab').getAttribute('data-key'),fileKey,'native file refresh keeps the same document tab');
   await waitForExactRead(()=>page.evaluate(readSession,preview?'alder-web-viewer:preview:pr-204:always-visible':'alder-web-viewer'),true,{project:s=>s?.tabs?.some(t=>t.name==='getting-started.md')});
   await page.reload();await page.waitForSelector('.tab');assert.equal(await guide.isVisible(),false);await ensureDocumentActions(page);assert.equal(await page.locator('#refresh').isVisible(),true);assert.equal(await page.locator('#refresh').isEnabled(),true);
   assert.equal(await page.locator('.close').isVisible(),false);await fresh(page.url());await page.waitForFunction(()=>!document.querySelector('.tab'));
   assert.equal(await guide.isVisible(),true);assert.equal(await page.locator('#refresh').isVisible(),false);
   results.push({width,preview,repositoryVisible:true,guide:'no horizontal overflow; sample/file/reload/close passed'});
  }
  return {results,limits:'Chromium desktop emulation; native mobile and human acceptance remain separate.'};
 }finally{await context.close();}
}
