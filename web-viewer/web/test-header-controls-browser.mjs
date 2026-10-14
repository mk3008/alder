import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
export async function verifyHeaderControls(browser){
 const context=await browser.newContext(),page=await context.newPage(),results=[];
 const ids=['node-list-toggle','open','open-url','open-text','refresh','theme','drawer'];
 try{
  mkdirSync('web/evidence/header-controls',{recursive:true});
  await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>!document.querySelector('#open').disabled,null,{timeout:5000});
  if(await page.locator('#github-link').count())ids.splice(ids.indexOf('drawer'),0,'github-link');
  for(const width of [1440,1280,1101,1100,1001,1000,801,800,768,640,601,600,481,480,393,390,375,360,359,320,768,320,1440])for(const theme of ['light','dark'])for(const preview of [false,true]){
   await page.setViewportSize({width,height:960});
   // Display-only fixture represents the exact long badge in the published URL.
   // It leaves all product control styles and dimensions untouched.
   await page.evaluate(({theme,preview})=>{document.documentElement.dataset.theme=theme;const b=document.querySelector('#preview-badge');b.hidden=!preview;b.textContent='確認用 · node-drawer-clearance-20261012-01';},{theme,preview});
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const m=await page.evaluate(ids=>{
    const h=document.querySelector('header'),hr=h.getBoundingClientRect(),brand=h.querySelector('strong'),b=document.querySelector('#preview-badge'),br=b.getBoundingClientRect();
    const hs=getComputedStyle(h),required=ids.reduce((sum,id)=>sum+document.getElementById(id).getBoundingClientRect().width,0)+brand.getBoundingClientRect().width+(parseFloat(hs.columnGap)||0)*(ids.length+1)+parseFloat(hs.paddingLeft)+parseFloat(hs.paddingRight);
    return {required,brand:{visible:getComputedStyle(brand).display!=='none'&&getComputedStyle(brand).visibility!=='hidden',width:brand.clientWidth,scrollWidth:brand.scrollWidth,cy:brand.getBoundingClientRect().y+brand.getBoundingClientRect().height/2},header:{top:hr.top,bottom:hr.bottom,height:hr.height,clientHeight:h.clientHeight,scrollHeight:h.scrollHeight,clientWidth:h.clientWidth,scrollWidth:h.scrollWidth},badge:{hidden:b.hidden,height:br.height,top:br.top,bottom:br.bottom,overflowsHeaderVertically:!b.hidden&&(br.top<hr.top||br.bottom>hr.bottom)},controls:ids.map(id=>{const n=document.getElementById(id),r=n.getBoundingClientRect(),s=n.querySelector('svg').getBoundingClientRect(),caption=n.querySelector('.source-caption');return {id,x:r.x,y:r.y,width:r.width,height:r.height,cy:r.y+r.height/2,svgCY:s.y+s.height/2,svgHeight:s.height,svgWidth:s.width,padding:getComputedStyle(n).padding,disabled:n.disabled,name:n.getAttribute('aria-label'),hit:n.disabled||n.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)),svgVisible:getComputedStyle(n.querySelector('svg')).display!=='none',caption:caption?getComputedStyle(caption).display:null};})};
   },ids);
   try{
   for(const c of m.controls){assert.equal(c.height,40,c.id);assert.ok(Math.abs(c.cy-m.controls[0].cy)<.1,c.id+' common center');if(c.svgVisible){assert.ok(Math.abs(c.svgCY-c.cy)<.1,c.id+' SVG centered');assert.equal(c.svgHeight,19);assert.equal(c.svgWidth,19);if(width<=600||['node-list-toggle','theme','drawer','github-link'].includes(c.id)){assert.equal(c.width,width<360?36:40,c.id+' common target width');assert.equal(c.padding,'7px',c.id+' common padding');}}assert.ok(c.y>=m.header.top&&c.y+c.height<=m.header.bottom,c.id+' not vertically clipped');if(c.caption!==null)assert.equal(c.caption==='none',width<=600,'caption responsive visibility');}
   assert.equal(m.brand.visible,m.required<=width,'title follows measured fit at '+width);
   if(m.brand.visible){assert.ok(m.brand.scrollWidth<=m.brand.width,'brand text stays in its column at '+width);assert.ok(Math.abs(m.brand.cy-m.controls[0].cy)<.1,'title stays on action row');}
   if(!preview)assert.equal(m.header.height,64,'production header is one row at '+width);
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
  const boundaries=[];
  for(const seed of [600,800,1100,1280]){
   await page.setViewportSize({width:seed,height:960});
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const required=await page.evaluate(()=>{const h=document.querySelector('header'),s=getComputedStyle(h),a=[...h.querySelectorAll(':scope > button,:scope > a')];return a.reduce((n,x)=>n+x.getBoundingClientRect().width,0)+h.querySelector('strong').getBoundingClientRect().width+(parseFloat(s.columnGap)||0)*(a.length+1)+parseFloat(s.paddingLeft)+parseFloat(s.paddingRight);});
   for(const width of [Math.ceil(required)-1,Math.ceil(required),Math.ceil(required)+1]){
    await page.setViewportSize({width,height:960});
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const result=await page.evaluate(()=>{const h=document.querySelector('header'),b=h.querySelector('strong'),s=getComputedStyle(h),a=[...h.querySelectorAll(':scope > button,:scope > a')],cy=a.map(x=>{const r=x.getBoundingClientRect();return r.y+r.height/2;});return{width:innerWidth,visible:getComputedStyle(b).visibility!=='hidden',required:a.reduce((n,x)=>n+x.getBoundingClientRect().width,0)+b.getBoundingClientRect().width+(parseFloat(s.columnGap)||0)*(a.length+1)+parseFloat(s.paddingLeft)+parseFloat(s.paddingRight),cy,overflow:h.scrollWidth>h.clientWidth};});
    assert.equal(result.visible,result.required<=width);assert.equal(result.overflow,false);assert.ok(result.cy.every(y=>Math.abs(y-result.cy[0])<.1));boundaries.push(result);
   }
  }
  // Browser zoom reflows the viewport in CSS pixels. Check 1280px at 125%,
  // 150%, 200% and 400% using matching CSS viewport/DPR pairs.
  const zoomResults=[];
  for(const zoom of [1.25,1.5,2,4]){
   const zc=await browser.newContext({viewport:{width:Math.floor(1280/zoom),height:Math.floor(960/zoom)},deviceScaleFactor:zoom}),zp=await zc.newPage();
   try{await zp.goto('http://127.0.0.1:4173/');await zp.waitForFunction(()=>!document.querySelector('#open').disabled);await zp.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const m=await zp.evaluate(()=>{const h=document.querySelector('header');return{width:innerWidth,dpr:devicePixelRatio,height:h.offsetHeight,overflow:h.scrollWidth>h.clientWidth,controls:[...h.querySelectorAll(':scope > button,:scope > a')].map(x=>{const r=x.getBoundingClientRect();return{x:r.x,right:r.right,cy:r.y+r.height/2,name:x.getAttribute('aria-label')};})};});
    assert.equal(m.height,64);assert.equal(m.overflow,false);assert.equal(m.controls.length,8);for(const c of m.controls){assert.ok(c.name);assert.ok(c.x>=0&&c.right<=m.width);assert.ok(Math.abs(c.cy-m.controls[0].cy)<.1);}zoomResults.push({zoom,...m});
   }finally{await zc.close();}
  }
  return {results,boundaries,zoomResults,limit:'Chromium CSS viewport/DPR zoom-equivalent coverage; native browser zoom UI, physical mobile devices and human interaction review are separate.'};
 }finally{await context.close();}
}
