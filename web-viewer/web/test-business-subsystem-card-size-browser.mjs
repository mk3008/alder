import assert from 'node:assert/strict';
import {loadPurchaseReview} from './purchase-review-browser.mjs';

export async function verifyBusinessSubsystemCardSize(browser){
 const observations=[];
 for(const width of [393,1280]){
  const context=await browser.newContext({viewport:{width,height:960},hasTouch:true}),page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  try{
   await loadPurchaseReview(page);
   const choose=async key=>{if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();await page.locator(`[data-explorer-key="${key}"]`).click();};
   const measureBusiness=()=>page.locator('#nodes .node').evaluateAll(nodes=>nodes.map(node=>{const b=node.getBoundingClientRect();return [b.width,b.height];}));
   const measureSubsystem=()=>page.locator('[data-review-group]').evaluateAll(nodes=>nodes.map(node=>{const rect=node.querySelector('.state-diagram-node').getBoundingClientRect(),surface=node.querySelector('.graph-card-surface').getBoundingClientRect(),name=node.querySelector('.subsystem-overview-name'),role=node.querySelector('.subsystem-overview-role'),button=node.querySelector('.subsystem-overview-open'),nameBox=name.getBoundingClientRect(),buttonBox=button.getBoundingClientRect();return{size:[rect.width,rect.height],surface:[surface.width,surface.height],textFits:name.scrollWidth<=name.clientWidth+1&&role.scrollWidth<=role.clientWidth+1,buttonSeparate:nameBox.right<=buttonBox.left+1};}));
   const same=(actual,expected)=>actual.every((n,i)=>Math.abs(n-expected[i])<.2);
   for(const theme of ['light','dark']){
    if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();
    for(const [zoom,factor] of [[100,1],[120,1.2]]){
     await choose('business:overview');if(zoom===120)await page.locator('#in').click();assert.equal((await page.locator('#zoom').textContent()).trim(),zoom+'%');const business=await measureBusiness();assert(business.length>0&&business.every(size=>same(size,[260*factor,68*factor])),'all business cards use the reference dimensions');
     await choose('concept:landscape');if(zoom===120)await page.locator('.subsystem-overview-canvas .zoom-in').click();assert.equal((await page.locator('.subsystem-overview-canvas .canvas-zoom').textContent()).trim(),zoom+'%');const subsystem=await measureSubsystem();assert.equal(subsystem.length,4);for(const node of subsystem){assert(same(node.size,business[0]),JSON.stringify({width,theme,zoom,node,business:business[0]}));assert(same(node.surface,node.size));assert(node.textFits,'sample names and roles fit their card');assert(node.buttonSeparate,'text cannot overlap the open button');}observations.push({width,theme,zoom,size:business[0]});
    }
    await page.locator('.subsystem-overview-canvas .zoom-out').click();await choose('business:overview');await page.locator('#out').click();await choose('concept:landscape');
   }
   assert.deepEqual(errors,[]);
  }finally{await context.close();}
 }
 return {authority:'CARD-SIZE-001/002',observations};
}
