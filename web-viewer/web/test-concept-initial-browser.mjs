import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';

export async function verifyConceptInitial(browser){
 const observations=[];mkdirSync('web/evidence/shell',{recursive:true});
 for(const width of [393,1280])for(const theme of ['light','dark']){
  const page=await browser.newPage({viewport:{width,height:850}});
  try{
   for(const focus of ['', 'preparation','request','version','item','receipt','line']){
    await page.goto('http://127.0.0.1:4173/concept.html'+(focus?'?focus='+focus:''));
    await page.locator('.node').first().waitFor();await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);
    await page.evaluate(()=>document.fonts.ready);
    for(const level of [0,1,6]){
     if(level)for(let i=0;i<(level===1?1:5);i++)await page.locator('.zoom-in').click();
     const result=await page.evaluate(()=>{
      const labels=[...document.querySelectorAll('.endpoint-count')],wires=[...document.querySelectorAll('.wire')],collisions=[];
      for(const label of labels){const b=label.getBBox();for(const wire of wires){const length=wire.getTotalLength();for(let distance=0;distance<=length;distance+=.5){const p=wire.getPointAtLength(distance);if(p.x>=b.x-2&&p.x<=b.x+b.width+2&&p.y>=b.y-2&&p.y<=b.y+b.height+2){collisions.push({count:label.textContent,from:wire.dataset.from,to:wire.dataset.to});break;}}}}
      return {collisions,wires:wires.length,labels:labels.length,zoom:document.querySelector('.zoom-value').textContent,warning:document.querySelector('.routing-warning').textContent,backgrounds:document.querySelectorAll('.world>svg>rect').length};
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
