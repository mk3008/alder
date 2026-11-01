import assert from 'node:assert/strict';
import {openLegacySampleInBrowser} from './legacy-sample-route.mjs';
import {createHash} from 'node:crypto';
import {mkdirSync,readFileSync} from 'node:fs';

export function contrast(a,b){
 const luminance=value=>{const rgb=value.match(/[\d.]+/g)?.slice(0,3).map(Number);assert.equal(rgb?.length,3,'expected a computed RGB color: '+value);return rgb.map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);};
 const [low,high]=[luminance(a),luminance(b)].sort((x,y)=>x-y);return (high+.05)/(low+.05);
}

export async function verifyStructureDrawer(page){
 assert.equal(createHash('sha256').update(readFileSync('verification/subsystem-dark-region.check-items.json')).digest('hex'),'588a274dcbe01c62d5cba672470560e186536b84c9b34bc735d68f204efce1d8');
 await page.setViewportSize({width:1280,height:960});
 const drawer=page.locator('.concept-related');
 for(const id of ['group-request','group-decision','group-handoff','group-result']){
  await page.locator('[data-explorer-key="concept:'+id+'"]').click();
  await page.frameLocator('iframe[data-concept-view="'+id+'"]').locator('.node').first().waitFor();
  assert.equal(await page.locator('.concept-main .data-example-modes,.concept-main h1').count(),0);
  if(!await drawer.isVisible())await page.locator('#drawer').click();
  assert.equal(await page.locator('.concept-child-tabs,.concept-related [role=tablist]').count(),0);assert(await page.locator('.data-review-overview').isVisible());
  assert.equal(await page.locator('.data-review-overview .review-owner').count(),0);assert.equal(await page.locator('.data-review-overview h3').filter({hasText:'レビュアー'}).count(),0);
  assert.equal(await page.locator('.data-review-overview .review-related-activities button:not(:disabled)').count()>0,true);
  const graph=page.frameLocator('iframe[data-concept-view="'+id+'"]'),heading=await drawer.locator('.shell-heading strong').textContent();
  await graph.locator('.node .concept-select').first().click();await graph.locator('.node.selected').first().waitFor();
  // Selection is sent from the graph iframe to the parent asynchronously.
  await drawer.locator('.concept-selection-clear').waitFor({state:'visible'});
  assert(await drawer.locator('.concept-selection-clear').isVisible());
  await graph.locator('.canvas').click({position:{x:4,y:4}});
  await page.waitForFunction(expected=>document.querySelector('.concept-related .shell-heading strong')?.textContent===expected,heading);
  assert.equal(await graph.locator('.node.selected').count(),0);assert(await page.locator('.data-review-overview').isVisible());
  await graph.locator('.node .concept-select').first().click();await drawer.locator('.concept-selection-clear').click();await graph.locator('.node.selected').waitFor({state:'detached'});assert.equal(await graph.locator('.node.selected').count(),0);
  await graph.locator('.node .concept-select').first().click();await graph.locator('.canvas').press('Escape');assert.equal(await graph.locator('.node.selected').count(),0);
  await graph.locator('.node .concept-select').first().click();const bounds=await graph.locator('.canvas').boundingBox();await page.touchscreen.tap(bounds.x+4,bounds.y+4);
  await page.waitForFunction(expected=>document.querySelector('.concept-related .shell-heading strong')?.textContent===expected,heading);assert.equal(await graph.locator('.node.selected').count(),0);
  if(id==='group-result')for(const theme of ['light','dark']){
   if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();
   await page.waitForFunction(expected=>document.querySelector('iframe[data-concept-view=group-result]')?.contentDocument?.documentElement.dataset.theme===expected,theme);
   const style=await graph.locator('.concept-subsystem-region').first().evaluate(el=>{
    const doc=el.ownerDocument,css=target=>doc.defaultView.getComputedStyle(target),canvas=css(doc.querySelector('.canvas')).backgroundColor;
    return {fill:css(el).fill,border:css(el).stroke,width:css(el).strokeWidth,background:canvas==='rgba(0, 0, 0, 0)'?css(doc.querySelector('.stage')).backgroundColor:canvas,title:css(doc.querySelector('.concept-subsystem-title')).fill,cardBorder:css(doc.querySelector('.concept-card-surface')).borderColor,wire:css(doc.querySelector('.wire')).stroke};
   });
   if(theme==='light'){assert.equal(style.fill,'rgb(255, 255, 255)');assert.equal(style.border,'rgb(211, 220, 229)');assert.equal(style.width,'1.5px');}
   else{assert(contrast(style.fill,style.background)>=1.35,'region fill distinguishes the dark canvas');assert(contrast(style.border,style.fill)>=3,'region border contrasts with the fill');assert(contrast(style.border,style.background)>=3,'region border contrasts with the canvas');assert(contrast(style.title,style.fill)>=4.5,'region title remains readable');assert(contrast(style.cardBorder,style.fill)>=3,'card outline remains visible');assert(contrast(style.wire,style.fill)>=3,'wire remains visible');assert.equal(style.width,'2px');
    await graph.locator('.concept-subsystem-region').first().click({position:{x:12,y:10}});assert.equal(await graph.locator('.concept-subsystem-selected .concept-subsystem-region').first().evaluate(el=>getComputedStyle(el).strokeWidth),'3px');
    await graph.locator('.canvas').click({position:{x:4,y:4}});await page.waitForFunction(expected=>document.querySelector('.concept-related .shell-heading strong')?.textContent===expected,heading);
    mkdirSync('web/evidence/shell',{recursive:true});await page.screenshot({path:'web/evidence/shell/subsystem-detail-dark-regions.png'});
   }
  }
 }
 await page.locator('[data-explorer-key="concept:group-request"]').click();
 if(await drawer.isVisible())await page.locator('#drawer').click();
 const graph=page.frameLocator('iframe[data-concept-view=group-request]');
 const select=async(id,name)=>{await graph.locator('[data-node='+id+'] .concept-select').click();await graph.locator('[data-node='+id+'].selected').waitFor();await page.waitForFunction(expected=>document.querySelector('.concept-related .shell-heading strong')?.textContent===expected,name);};
 await select('request','購入申請');assert.equal(await drawer.isVisible(),false,'shape selection keeps drawer closed');await page.locator('#drawer').click();
 assert.equal(await page.locator('.concept-related-content').textContent().then(s=>s.includes('申請者')),true);
 assert(await page.locator('[data-sample=request-submitted]').isDisabled());await openLegacySampleInBrowser(page,'request-submitted');
 assert(await page.locator('.concept-example-back').isVisible());assert(await page.locator('.data-examples-panel').isVisible());
 assert.equal(await page.locator('iframe[data-concept-view=group-request]').isVisible(),true);
 const zoom=await graph.locator('.zoom-value').textContent();await graph.locator('.zoom-in').click();assert.notEqual(await graph.locator('.zoom-value').textContent(),zoom,'canvas zoom works during example review');
 await select('item','申請品目');assert.equal(await page.locator('.data-examples-panel').getAttribute('data-data-example'),'request-submitted');assert.match(await page.locator('.concept-related-content').textContent(),/依頼数量/);assert.match(await page.locator('.concept-page-details').textContent(),/申請者/);
 const separator=page.getByRole('separator',{name:'補足情報の幅'});await separator.focus();const before=Number(await separator.getAttribute('aria-valuenow'));await separator.press('ArrowLeft');assert.equal(Number(await separator.getAttribute('aria-valuenow')),before+40);
 const point=await separator.boundingBox();await page.mouse.move(point.x+point.width/2,point.y+40);await page.mouse.down();await page.mouse.move(point.x-80,point.y+40,{steps:5});await page.mouse.up();assert(Number(await separator.getAttribute('aria-valuenow'))>before+40,'pointer expands drawer');
 await separator.press('Home');assert.equal(Number(await separator.getAttribute('aria-valuenow')),280);
 const table=page.locator('.data-example-table').filter({has:page.locator('table')}).last();await table.scrollIntoViewIfNeeded();const tableScroll=await table.evaluate(el=>{el.scrollLeft=el.scrollWidth;return{left:el.scrollLeft,width:el.clientWidth,content:el.scrollWidth};});assert(tableScroll.content>tableScroll.width&&tableScroll.left>0,'table can scroll independently');
 await page.reload();await page.frameLocator('iframe[data-concept-view=group-request]').locator('.node').first().waitFor();assert.equal(await drawer.isVisible(),true);assert.equal(await page.locator('.data-examples-panel').getAttribute('data-data-example'),'request-submitted');assert.equal(Number(await separator.getAttribute('aria-valuenow')),280);
 mkdirSync('web/evidence/shell',{recursive:true});
 for(const theme of ['light','dark']){if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();for(const width of [1280,393]){
  await page.setViewportSize({width,height:960});if(await page.locator('#design-explorer').isVisible()&&width===393)await page.locator('#node-list-toggle').click();await separator.focus();await separator.press('End');
  const bounds=await drawer.boundingBox();assert(bounds.x>=0&&bounds.x+bounds.width<=width+1,'drawer fits viewport');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert(await page.locator('iframe[data-concept-view=group-request]').isVisible());await page.screenshot({path:`web/evidence/shell/structure-drawer-${width}-${theme}.png`});
 }}
 await page.setViewportSize({width:1280,height:960});await page.locator('.concept-related .shell-heading button').click();assert.equal(await drawer.isVisible(),false);await select('version','購入申請版');assert.equal(await drawer.isVisible(),false);await page.locator('#drawer').click();assert.match(await page.locator('.concept-related-content').textContent(),/未確定／確定/);
 const sampleURL=new URL(page.url());assert.equal(sampleURL.searchParams.get('dataExample'),'request-submitted');
 await page.locator('.concept-example-back').click();await page.waitForFunction(()=>!new URL(location.href).searchParams.has('dataExample'));await page.goBack();await page.waitForFunction(()=>new URL(location.href).searchParams.get('dataExample')==='request-submitted');assert(await page.locator('.data-examples-panel').isVisible());await page.goForward();await page.waitForFunction(()=>!document.querySelector('.data-review-overview').hidden);assert(await page.locator('.data-review-overview').isVisible());
 if(await drawer.isVisible())await page.locator('#drawer').click();if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();await page.locator('[data-explorer-key="concept:landscape"]').click();
 return {checks:'STRUCTURE-SHELL-001..005, SUBSYSTEM-RETURN-001..002: four graph-first pages, background click/touch/clear/Escape, manual drawer, overview/sample separation, selection during samples, pointer/keyboard width, table scroll, persistence, Back/Forward, 1280/393 light/dark'};
}
