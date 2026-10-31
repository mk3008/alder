import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {loadPurchaseReview} from './purchase-review-browser.mjs';

export async function verifyConceptInitial(browser){
 const observations=[];mkdirSync('web/evidence/shell',{recursive:true});
 for(const width of [393,1280])for(const theme of ['light','dark']){
  const page=await browser.newPage({viewport:{width,height:850}});
  try{
   await loadPurchaseReview(page);
   if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('#theme').click();
   for(const focus of ['', 'preparation','request','version','item','receipt','line']){
    if(!await page.locator('#design-explorer').isVisible())await page.locator('#node-list-toggle').click();
    const view=focus||'overview';await page.locator(`[data-explorer-key="concept:${view}"]`).click();
    const frame=page.frameLocator(`iframe[data-concept-view="${view}"]`);
    await frame.locator('.node').first().waitFor();await frame.locator('.node').first().evaluate(async node=>{await node.ownerDocument.fonts.ready;});
    for(const level of [0,1,6]){
     if(level)for(let i=0;i<(level===1?1:5);i++)await frame.locator('.zoom-in').click();
     const result=await frame.locator('#overview').evaluate(section=>{
      const labels=[...section.querySelectorAll('.endpoint-count')],wires=[...section.querySelectorAll('.wire')],collisions=[];
      for(const label of labels){const b=label.getBBox();for(const wire of wires){const length=wire.getTotalLength();for(let distance=0;distance<=length;distance+=.5){const p=wire.getPointAtLength(distance);if(p.x>=b.x-2&&p.x<=b.x+b.width+2&&p.y>=b.y-2&&p.y<=b.y+b.height+2){collisions.push({count:label.textContent,from:wire.dataset.from,to:wire.dataset.to});break;}}}}
      return {collisions,wires:wires.length,labels:labels.length,zoom:section.querySelector('.zoom-value').textContent,warning:section.querySelector('.routing-warning').textContent,backgrounds:section.querySelectorAll('.world>svg>rect').length};
     });
     assert.deepEqual(result.collisions,[],JSON.stringify({width,theme,focus,...result}));assert.equal(result.backgrounds,0);assert.equal(result.warning,'');assert.equal(result.labels,result.wires*2);
     observations.push({width,theme,focus:focus||'overview',...result});
     if(width===393&&['','preparation'].includes(focus)&&level===1)await page.screenshot({path:`web/evidence/shell/concept-initial-${focus||'overview'}-${theme}.png`});
    }
   }
  }finally{await page.close();}
 }
 return {checks:'overview and all six local initial graphs, 393/1280 light/dark at 100/120/250%, native SVG count bounds never overlap any full wire',observations};
}
