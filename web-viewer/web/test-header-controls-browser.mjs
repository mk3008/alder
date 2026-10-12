import assert from 'node:assert/strict';
export async function verifyHeaderControls(browser){
 const context=await browser.newContext(),page=await context.newPage(),results=[];
 const ids=['node-list-toggle','open','open-url','open-text','refresh','theme','drawer'];
 try{
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled,null,{timeout:5000});
  for(const width of [1280,800,601,600,393,320])for(const theme of ['light','dark'])for(const preview of [false,true]){
   await page.setViewportSize({width,height:960});
   // Display-only fixture represents the exact long badge in the published URL.
   // It leaves all product control styles and dimensions untouched.
   await page.evaluate(({theme,preview})=>{document.documentElement.dataset.theme=theme;const b=document.querySelector('#preview-badge');b.hidden=!preview;b.textContent='確認用 · node-drawer-clearance-20261012-01';},{theme,preview});
   const m=await page.evaluate(ids=>{
    const h=document.querySelector('header'),hr=h.getBoundingClientRect(),b=document.querySelector('#preview-badge'),br=b.getBoundingClientRect();
    return {header:{top:hr.top,bottom:hr.bottom,height:hr.height,clientHeight:h.clientHeight,scrollHeight:h.scrollHeight,clientWidth:h.clientWidth,scrollWidth:h.scrollWidth},badge:{hidden:b.hidden,height:br.height,top:br.top,bottom:br.bottom,overflowsHeaderVertically:!b.hidden&&(br.top<hr.top||br.bottom>hr.bottom)},controls:ids.map(id=>{const n=document.getElementById(id),r=n.getBoundingClientRect(),s=n.querySelector('svg').getBoundingClientRect(),caption=n.querySelector('.source-caption');return {id,x:r.x,y:r.y,width:r.width,height:r.height,cy:r.y+r.height/2,svgCY:s.y+s.height/2,svgHeight:s.height,svgVisible:getComputedStyle(n.querySelector('svg')).display!=='none',caption:caption?getComputedStyle(caption).display:null};})};
   },ids);
   for(const c of m.controls){assert.equal(c.height,40,c.id);assert.ok(Math.abs(c.cy-m.controls[0].cy)<.1,c.id+' common center');if(c.svgVisible){assert.ok(Math.abs(c.svgCY-c.cy)<.1,c.id+' SVG centered');assert.equal(c.svgHeight,19);}assert.ok(c.y>=m.header.top&&c.y+c.height<=m.header.bottom,c.id+' not vertically clipped');if(c.caption!==null)assert.equal(c.caption==='none',width<=600,'caption responsive visibility');}
   for(const id of ids){
    await page.locator('#'+id).scrollIntoViewIfNeeded({timeout:5000});
    const c=await page.locator('#'+id).boundingBox(),h=await page.locator('header').boundingBox();
    assert.ok(c.x>=Math.max(0,h.x)-.5&&c.x+c.width<=Math.min(width,h.x+h.width)+.5,id+' reachable with header scroll');
   }
   await page.locator('header').evaluate(h=>{h.scrollLeft=0;h.scrollTop=0;});
   results.push({width,theme,preview,...m});
  }
  return {results,limit:'Badge overflow is recorded, not redesigned; any existing horizontal header scroll remains accessible.'};
 }finally{await context.close();}
}
