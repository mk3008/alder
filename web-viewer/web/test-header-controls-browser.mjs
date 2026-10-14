import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
export async function verifyHeaderControls(browser){
 const context=await browser.newContext(),page=await context.newPage(),results=[];
 const ids=['node-list-toggle','open','open-url','open-text','refresh','theme','drawer'];
 try{
  mkdirSync('web/evidence/header-controls',{recursive:true});
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled,null,{timeout:5000});
  if(await page.locator('#github-link').count())ids.splice(ids.indexOf('drawer'),0,'github-link');
  for(const width of [1440,1280,1101,1100,1001,1000,801,800,601,600,481,480,393,360,359,320])for(const theme of ['light','dark'])for(const preview of [false,true]){
   await page.setViewportSize({width,height:960});
   // Display-only fixture represents the exact long badge in the published URL.
   // It leaves all product control styles and dimensions untouched.
   await page.evaluate(({theme,preview})=>{document.documentElement.dataset.theme=theme;const b=document.querySelector('#preview-badge');b.hidden=!preview;b.textContent='確認用 · node-drawer-clearance-20261012-01';},{theme,preview});
   const m=await page.evaluate(ids=>{
    const h=document.querySelector('header'),hr=h.getBoundingClientRect(),brand=h.querySelector('strong'),b=document.querySelector('#preview-badge'),br=b.getBoundingClientRect();
    return {brand:{visible:getComputedStyle(brand).display!=='none',width:brand.clientWidth,scrollWidth:brand.scrollWidth},header:{top:hr.top,bottom:hr.bottom,height:hr.height,clientHeight:h.clientHeight,scrollHeight:h.scrollHeight,clientWidth:h.clientWidth,scrollWidth:h.scrollWidth},badge:{hidden:b.hidden,height:br.height,top:br.top,bottom:br.bottom,overflowsHeaderVertically:!b.hidden&&(br.top<hr.top||br.bottom>hr.bottom)},controls:ids.map(id=>{const n=document.getElementById(id),r=n.getBoundingClientRect(),s=n.querySelector('svg').getBoundingClientRect(),caption=n.querySelector('.source-caption');return {id,x:r.x,y:r.y,width:r.width,height:r.height,cy:r.y+r.height/2,svgCY:s.y+s.height/2,svgHeight:s.height,svgWidth:s.width,padding:getComputedStyle(n).padding,disabled:n.disabled,name:n.getAttribute('aria-label'),hit:n.disabled||n.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)),svgVisible:getComputedStyle(n.querySelector('svg')).display!=='none',caption:caption?getComputedStyle(caption).display:null};})};
   },ids);
   try{
   for(const c of m.controls){assert.equal(c.height,40,c.id);assert.ok(Math.abs(c.cy-m.controls[0].cy)<.1,c.id+' common center');if(c.svgVisible){assert.ok(Math.abs(c.svgCY-c.cy)<.1,c.id+' SVG centered');assert.equal(c.svgHeight,19);assert.equal(c.svgWidth,19);if(width<=600||['node-list-toggle','theme','drawer','github-link'].includes(c.id)){assert.equal(c.width,width<360?36:40,c.id+' common target width');assert.equal(c.padding,'7px',c.id+' common padding');}}assert.ok(c.y>=m.header.top&&c.y+c.height<=m.header.bottom,c.id+' not vertically clipped');if(c.caption!==null)assert.equal(c.caption==='none',width<=600,'caption responsive visibility');}
   if(m.brand.visible)assert.ok(m.brand.scrollWidth<=m.brand.width,'brand text stays in its column at '+width);
   assert.ok(m.header.scrollWidth<=m.header.clientWidth,'no horizontal header scroll at '+width);
   assert.ok(m.header.scrollHeight<=m.header.clientHeight,'no vertical header scroll at '+width);
   assert.equal(m.badge.overflowsHeaderVertically,false,'preview badge remains within header');
   for(let i=0;i<m.controls.length;i++){
    const c=m.controls[i];assert.ok(c.x>=0&&c.x+c.width<=width,c.id+' fully visible without scrolling at '+width);assert.ok(c.hit,c.id+' center is clickable');
    if(i)assert.ok(c.x>=m.controls[i-1].x+m.controls[i-1].width,c.id+' does not overlap previous control');
   }
   if([1440,601,393,320].includes(width)&&theme==='light')await page.screenshot({path:`web/evidence/header-controls/${width}-${preview?'preview':'production'}.png`});
   }catch(error){
    console.error(JSON.stringify({headerFailure:{width,theme,preview,...m,message:error.message}}));
    await page.screenshot({path:`web/evidence/header-controls/${width}-${theme}-${preview?'preview':'production'}-failure.png`});
    throw error;
   }
   results.push({width,theme,preview,...m});
  }
  return {results,limit:'Chromium viewport coverage; physical mobile devices and human interaction review are separate.'};
 }finally{await context.close();}
}
