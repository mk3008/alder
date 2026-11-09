import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdirSync,readFileSync} from 'node:fs';

const contract='verification/explorer-resize-scroll.check-items.json';
const contractHash='58b1d23f61e256cac9fdb3123bd58d2a7abc997667a01d70c2ce8a0ac8929407';
const verifyContract=()=>assert.equal(createHash('sha256').update(readFileSync(contract)).digest('hex'),contractHash);

// The fixture is fulfilled locally; actual browser layout and pointer events are used.
export async function verifyExplorerResizeScroll(browser){
 verifyContract();
 const ids=JSON.parse(readFileSync(contract)).checks.map(item=>item.id),covered=[];
 const coverage=actual=>{assert.equal(actual.length,ids.length);assert.equal(new Set(actual).size,actual.length);assert.deepEqual(new Set(actual),new Set(ids));};
 assert.throws(()=>coverage(ids.slice(1)));assert.throws(()=>coverage([...ids,ids[0]]));
 const fixture='https://fixture.test/explorer-resize.json';
 const raw=readFileSync('../business-design/alder/json-complete-concept-review.json','utf8');
 const results=[],out='web/evidence/explorer-resize-scroll';mkdirSync(out,{recursive:true});
 for(const width of [1280,393]){
  const context=await browser.newContext({viewport:{width,height:700},hasTouch:width<=800}),page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  try{
   await context.route(fixture,route=>route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:raw}));
   await page.goto('http://127.0.0.1:4173/?view=concept&concept=structure-explorer%3An-bd#source='+encodeURIComponent(fixture));
   await page.locator('.structure-detail-page:not([hidden])').waitFor({state:'visible',timeout:30000});
   if(await page.locator('#check-followup').isVisible())await page.locator('#check-followup-later').click();
   const explorer=page.locator('#design-explorer');if(!await explorer.isVisible())await page.locator('#node-list-toggle').click();
   // Retain main's close -> search native Tab path, and keep new mode tabs reachable.
   const close=page.locator('#design-explorer .shell-heading button');await close.focus();await page.keyboard.press('Shift+Tab');
   assert.equal(await page.locator('#explorer-tab-structure').evaluate(el=>document.activeElement===el),true);
   await page.keyboard.press('ArrowLeft');assert.equal(await page.locator('#explorer-tab-document').getAttribute('aria-selected'),'true');
   await close.focus();await page.keyboard.press('Tab');assert.equal(await page.locator('.explorer-search input').evaluate(el=>document.activeElement===el),true);
   await close.focus();await page.keyboard.press('Shift+Tab');assert.equal(await page.locator('#explorer-tab-document').evaluate(el=>document.activeElement===el),true);
   await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#explorer-tab-structure').getAttribute('aria-selected'),'true');
   const separator=page.getByRole('separator',{name:'エクスプローラーの幅'}),tree=page.locator('#explorer-structure-panel .structure-tree');
   await tree.waitFor({state:'visible'});const initial=(await explorer.boundingBox()).width;
   const handle=await separator.boundingBox();await page.mouse.move(handle.x+handle.width/2,handle.y+100);await page.mouse.down();await page.mouse.move(handle.x+handle.width/2+60,handle.y+100,{steps:5});await page.mouse.up();
   let dragged=(await explorer.boundingBox()).width;assert(dragged>=initial+50,'dragging right widens the left drawer');
   if(width<=800){
    const touch=await context.newCDPSession(page),edge=await separator.boundingBox(),x=edge.x+edge.width/2,y=edge.y+100;
    await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});await touch.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+20,y}]});await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    const touched=(await explorer.boundingBox()).width;assert(touched>=dragged+18,'touch drag widens the left drawer');dragged=touched;await touch.detach();
   }
   assert.equal(Number(await separator.getAttribute('aria-valuenow')),Math.round(dragged));
   await separator.focus();await separator.press('ArrowLeft');const narrowed=(await explorer.boundingBox()).width;assert(Math.abs(narrowed-(dragged-40))<=1,'left arrow narrows the drawer');
   await separator.press('ArrowRight');assert(Math.abs((await explorer.boundingBox()).width-dragged)<=1,'right arrow widens the drawer');
   const documentTab=page.locator('#explorer-tab-document'),structureTab=page.locator('#explorer-tab-structure');await documentTab.click();assert(Math.abs((await explorer.boundingBox()).width-dragged)<=1);await structureTab.click();
   await page.locator('#explorer-structure-panel .structure-toolbar button').first().click();
   const fitted=await tree.evaluate(el=>({scroll:el.scrollWidth,client:el.clientWidth}));
   assert(fitted.scroll<=fitted.client,'review labels fit the resized drawer');
   // EXPLORER-SCROLL-001 is conditional on content wider than the drawer.
   // BETA-002 now wraps ordinary labels, so force that condition separately
   // and retain the horizontal-scroll fallback and selection assertions.
   const wideRows=await page.addStyleTag({content:'.structure-tree .structure-node-row{min-width:700px}'});
   const before=await tree.evaluate(el=>({scrollWidth:el.scrollWidth,clientWidth:el.clientWidth,toolbarLeft:el.parentElement.querySelector('.structure-toolbar').getBoundingClientRect().left}));
   assert(before.scrollWidth>before.clientWidth+10,'expanded hierarchy creates genuine horizontal overflow');
   await tree.evaluate(el=>{el.scrollLeft=el.scrollWidth;});
   const after=await tree.evaluate(el=>{const visible=[...el.querySelectorAll('.structure-node-row strong')].filter(item=>item.getClientRects().length);const target=visible.reduce((a,b)=>a.getBoundingClientRect().right>b.getBoundingClientRect().right?a:b);target.setAttribute('data-scroll-test','target');const bounds=el.getBoundingClientRect(),text=target.getBoundingClientRect();return {scrollLeft:el.scrollLeft,right:bounds.right,textRight:text.right,toolbarLeft:el.parentElement.querySelector('.structure-toolbar').getBoundingClientRect().left,pageOverflow:document.documentElement.scrollWidth>innerWidth};});
   assert(after.scrollLeft>0,'tree scrolls horizontally');assert(after.textRight<=after.right+1,'furthest label can be reached');assert.equal(after.toolbarLeft,before.toolbarLeft,'tree scrolling does not move the toolbar');assert.equal(after.pageOverflow,false,'whole page does not overflow');
   await page.locator('[data-scroll-test="target"]').click();assert(await page.locator('[data-scroll-test="target"]').evaluate(el=>el.closest('summary').classList.contains('structure-selected')),'scrolled item is selectable');
   await page.screenshot({path:`${out}/tree-${width}.png`});
   await wideRows.evaluate(el=>el.remove());
   const search=page.locator('#explorer-structure-panel input[type=search]');await search.fill('業務');assert(await page.locator('#explorer-structure-panel .structure-item:not([hidden])').count()>0);await search.fill('');
   const filter=page.locator('#explorer-structure-panel .structure-compatibility-filter input');assert(await filter.isChecked());await filter.uncheck();assert(!await filter.isChecked());await filter.check();
   await page.locator('#design-explorer .shell-heading button').click();assert(!await explorer.isVisible());await page.locator('#node-list-toggle').click();assert(Math.abs((await explorer.boundingBox()).width-dragged)<=1,'opening the drawer retains its width');
   await page.reload();await page.locator('.structure-detail-page:not([hidden])').waitFor({state:'visible',timeout:30000});if(!await explorer.isVisible())await page.locator('#node-list-toggle').click();assert(Math.abs((await explorer.boundingBox()).width-dragged)<=1,'reload restores the width in this session');
   if(width>800){
    await documentTab.click();const group=page.locator('#explorer-document-panel [data-explorer-key="group:subsystems"]');if(await group.getAttribute('aria-expanded')==='false')await group.click();await page.locator('#explorer-document-panel [data-explorer-key="concept:landscape"]').click();
    const right=page.locator('.concept-related');if(!await right.isVisible())await page.locator('#drawer').click();await right.waitFor({state:'visible'});
    const rightBefore=(await right.boundingBox()).width,leftBefore=(await explorer.boundingBox()).width;
    await separator.focus();await separator.press('ArrowLeft');assert(Math.abs((await right.boundingBox()).width-rightBefore)<=1,'left resize leaves right width unchanged');
    const leftAfter=(await explorer.boundingBox()).width;assert(leftAfter<leftBefore);
    const rightSeparator=page.getByRole('separator',{name:'補足情報の幅'});await rightSeparator.focus();await rightSeparator.press('ArrowLeft');assert((await right.boundingBox()).width>rightBefore);assert(Math.abs((await explorer.boundingBox()).width-leftAfter)<=1,'right resize leaves left width unchanged');
    assert(await right.isVisible(),'resizing keeps the right drawer open');
   }
   assert.deepEqual(errors,[]);results.push({width,initial,dragged,horizontalOverflow:before.scrollWidth-before.clientWidth,scrollLeft:after.scrollLeft});
  }finally{await context.close();}
 }
 covered.push('EXPLORER-RESIZE-001','EXPLORER-RESIZE-002','EXPLORER-SCROLL-001','EXPLORER-REGRESSION-001');
 coverage(covered);verifyContract();
 return {checks:covered,browser:browser.version(),results};
}
