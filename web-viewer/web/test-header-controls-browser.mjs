import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';

const actionIDs=['node-list-toggle','open','open-url','open-text','theme','github-link','drawer'];
const captionIDs=['open','open-url','open-text'];
const fixedIconIDs=['node-list-toggle','theme','github-link','drawer'];
const matrixWidths=[1440,1280,1101,1100,1001,1000,801,800,768,640,601,600,481,480,393,390,375,360,359,320,768,320,1440];
const settle=page=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));

async function readHeader(page){
 return page.evaluate(({actionIDs,captionIDs})=>{
  const header=document.querySelector('header'),title=header.querySelector('strong');
  const actions=actionIDs.map(id=>document.getElementById(id));
  // Measure the expanded presentation independently, then restore the rendered
  // mode synchronously. A small viewport must not change canonical metrics.
  const wasIconsOnly=header.classList.contains('header-icons-only');
  header.classList.remove('header-icons-only');
  const expanded=getComputedStyle(header),gap=parseFloat(expanded.columnGap)||0;
  const padding=parseFloat(expanded.paddingLeft)+parseFloat(expanded.paddingRight);
  const actionWidths=actions.map(action=>action.getBoundingClientRect().width);
  const titleWidth=title.getBoundingClientRect().width;
  const captionedRequired=actionWidths.reduce((sum,width)=>sum+width,0)+gap*actions.length+padding;
  const canonical={fullRequired:captionedRequired+titleWidth+gap,captionedRequired,titleWidth,actionWidths,gap,padding,titleFontSize:getComputedStyle(title).fontSize,buttonFontSizes:actions.filter(n=>n.tagName==='BUTTON').map(n=>getComputedStyle(n).fontSize)};
  header.classList.toggle('header-icons-only',wasIconsOnly);

  const visible=node=>{const s=getComputedStyle(node),r=node.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0;};
  const hr=header.getBoundingClientRect(),tr=title.getBoundingClientRect();
  const badge=document.querySelector('#preview-badge'),br=badge.getBoundingClientRect();
  const controls=actions.map(node=>{
   const r=node.getBoundingClientRect(),icon=node.querySelector('svg'),s=icon.getBoundingClientRect(),caption=node.querySelector('.source-caption');
   const points=[[r.x+r.width/2,r.y+r.height/2],[r.x+2,r.y+2],[r.right-2,r.bottom-2]];
   return {id:node.id,x:r.x,y:r.y,width:r.width,height:r.height,cy:r.y+r.height/2,svgCY:s.y+s.height/2,svgHeight:s.height,svgWidth:s.width,padding:getComputedStyle(node).padding,disabled:!!node.disabled,name:node.getAttribute('aria-label'),hit:points.every(([x,y])=>node.contains(document.elementFromPoint(x,y))),svgVisible:visible(icon),caption:caption?visible(caption):null,captionFits:!caption||!visible(caption)||(caption.getBoundingClientRect().right<=r.right&&caption.getBoundingClientRect().left>=r.left)};
  });
  const brandVisible=visible(title);
  const visibleSet=[...controls.filter(c=>c.svgVisible).map(c=>'icon:'+c.id),...(brandVisible?['title']:[]),...captionIDs.filter(id=>controls.find(c=>c.id===id).caption).map(id=>'caption:'+id)];
  return {width:innerWidth,dpr:devicePixelRatio,canonical,iconsOnly:wasIconsOnly,visibleSet,brand:{visible:brandVisible,width:title.clientWidth,scrollWidth:title.scrollWidth,cy:tr.y+tr.height/2},header:{top:hr.top,bottom:hr.bottom,height:hr.height,clientHeight:header.clientHeight,scrollHeight:header.scrollHeight,clientWidth:header.clientWidth,scrollWidth:header.scrollWidth},badge:{hidden:badge.hidden,height:br.height,top:br.top,bottom:br.bottom,overflowsHeaderVertically:!badge.hidden&&(br.top<hr.top||br.bottom>hr.bottom)},controls};
 },{actionIDs,captionIDs});
}

function assertHeader(m,label){
 const width=m.width;
 assert.equal(m.controls.length,7,label+' all seven header actions retained');
 assert.equal(m.brand.visible,m.canonical.fullRequired<=m.header.clientWidth,label+' title follows expanded fit');
 assert.equal(m.iconsOnly,m.canonical.captionedRequired>m.header.clientWidth,label+' captions follow expanded fit');
 assert.ok(!m.iconsOnly||!m.brand.visible,label+' title is removed before captions');
 assert.ok(m.header.scrollWidth<=m.header.clientWidth,label+' no horizontal header scroll');
 assert.ok(m.header.scrollHeight<=m.header.clientHeight,label+' no vertical header scroll');
 assert.equal(m.badge.overflowsHeaderVertically,false,label+' preview badge remains inside header');
 if(m.badge.hidden)assert.equal(m.header.height,64,label+' production header is one row');
 if(m.brand.visible){
  assert.ok(m.brand.scrollWidth<=m.brand.width,label+' title text fits');
  assert.ok(Math.abs(m.brand.cy-m.controls[0].cy)<.1,label+' title is on the action row');
 }
 for(const [index,c] of m.controls.entries()){
  const description=label+' '+c.id;
  assert.ok(c.name,description+' accessible name');
  assert.equal(c.height,40,description+' target height');
  assert.ok(Math.abs(c.cy-m.controls[0].cy)<.1,description+' common center');
  assert.equal(c.svgVisible,true,description+' icon always visible');
  assert.ok(Math.abs(c.svgCY-c.cy)<.1,description+' SVG centered');
  assert.equal(c.svgHeight,19,description+' SVG height');
  assert.equal(c.svgWidth,19,description+' SVG width');
  if(m.iconsOnly||fixedIconIDs.includes(c.id))assert.equal(c.width,m.iconsOnly&&width<360?36:40,description+' target width');
  assert.equal(c.padding,'7px',description+' common padding');
  if(c.caption!==null)assert.equal(c.caption,!m.iconsOnly,description+' shared caption visibility');
  assert.ok(c.captionFits,description+' caption is not clipped');
  assert.ok(c.y>=m.header.top&&c.y+c.height<=m.header.bottom,description+' not vertically clipped');
  assert.ok(c.x>=0&&c.x+c.width<=width,description+' fully visible without scrolling');
  assert.ok(c.hit,description+' center and inset corners retain hit target');
  if(index)assert.ok(c.x>=m.controls[index-1].x+m.controls[index-1].width,description+' does not overlap preceding action');
 }
}

function sweepWidths(canonical){
 // A 16px grid plus every former media boundary and both content thresholds.
 const widths=new Set([320,1440,...matrixWidths]);
 for(let width=320;width<=1440;width+=16)widths.add(width);
 for(const boundary of [359,360,480,600,800,1000,1100,canonical.fullRequired,canonical.captionedRequired]){
  for(let offset=-2;offset<=2;offset++)widths.add(Math.ceil(boundary)+offset);
 }
 return [...widths].filter(width=>width>=320&&width<=1440).sort((a,b)=>a-b);
}

async function verifySweep(page,canonical,label){
 const widths=sweepWidths(canonical),seen=new Map(),summary=[];
 const passes=[['shrink',widths.toReversed()],['expand',widths],['mixed',widths.toSorted((a,b)=>(a*37%149)-(b*37%149)||a-b)]];
 for(const [direction,sequence] of passes){
  let previous;
  for(const width of sequence){
   await page.setViewportSize({width,height:960});await settle(page);
   const m=await readHeader(page),description=`${label} ${direction} ${width}`;
   assertHeader(m,description);
   assert.deepEqual(m.canonical,canonical,description+' canonical metrics are viewport/mode independent');
   if(previous&&direction==='shrink')assert.ok(m.visibleSet.every(item=>previous.visibleSet.includes(item)),description+' shrink can only remove visible content');
   if(previous&&direction==='expand')assert.ok(previous.visibleSet.every(item=>m.visibleSet.includes(item)),description+' expand can only restore visible content');
   const state={visibleSet:m.visibleSet,iconsOnly:m.iconsOnly};
   if(seen.has(width))assert.deepEqual(state,seen.get(width),description+' identical state regardless of resize history');
   else seen.set(width,state);
   previous=m;
  }
  summary.push({direction,cases:sequence.length});
 }
 return {font:label,canonical,passes:summary,total:widths.length*passes.length};
}

export async function verifyHeaderControls(browser){
 const context=await browser.newContext(),page=await context.newPage(),results=[],boundaries=[];
 const pageErrors=[],resizeObserverErrors=[];
 const watchErrors=page=>{
  page.on('pageerror',error=>pageErrors.push(error.message));
  page.on('console',message=>{if(/ResizeObserver.*loop/i.test(message.text()))resizeObserverErrors.push(message.text());});
 };
 watchErrors(page);
 try{
  mkdirSync('web/evidence/header-controls',{recursive:true});
  await page.goto('http://127.0.0.1:4173/');
  await page.waitForFunction(()=>!document.querySelector('#open').disabled,null,{timeout:5000});
  await page.evaluate(()=>document.fonts.ready);
  let canonical;
  // Preserve the original 92 geometry cases, including both themes and badges.
  for(const width of matrixWidths)for(const theme of ['light','dark'])for(const preview of [false,true]){
   await page.setViewportSize({width,height:960});
   await page.evaluate(({theme,preview})=>{document.documentElement.dataset.theme=theme;const b=document.querySelector('#preview-badge');b.hidden=!preview;b.textContent='確認用 · node-drawer-clearance-20261012-01';},{theme,preview});
   await settle(page);
   const m=await readHeader(page);
   try{
    assertHeader(m,`matrix ${width} ${theme} ${preview?'preview':'production'}`);
    canonical??=m.canonical;
    assert.deepEqual(m.canonical,canonical,'canonical metrics do not depend on viewport, theme or preview badge');
    assert.equal(m.canonical.titleFontSize,'22px');
    assert.ok(m.canonical.buttonFontSizes.every(size=>size==='16px'));
    assert.equal(m.canonical.gap,16);assert.equal(m.canonical.padding,48);
    if([1440,601,393,320].includes(width)&&theme==='light')await page.screenshot({path:`web/evidence/header-controls/${width}-${preview?'preview':'production'}.png`});
   }catch(error){
    console.error(JSON.stringify({headerFailure:{width,theme,preview,...m,message:error.message}}));
    await page.screenshot({path:`web/evidence/header-controls/${width}-${theme}-${preview?'preview':'production'}-failure.png`});
    throw error;
   }
   results.push({width,theme,preview,...m});
  }
  await page.evaluate(()=>{document.documentElement.dataset.theme='light';document.querySelector('#preview-badge').hidden=true;});
  // Exact content-fit boundaries are independent of all former CSS breakpoints.
  for(const [mode,required] of [['full',canonical.fullRequired],['captioned',canonical.captionedRequired]]){
   for(const width of [Math.ceil(required)-1,Math.ceil(required),Math.ceil(required)+1]){
    await page.setViewportSize({width,height:960});await settle(page);
    const m=await readHeader(page);assertHeader(m,mode+' boundary '+width);
    // Repeated frames must settle even though canonical measuring temporarily
    // expands compact controls and restores them before the next paint.
    for(let frame=0;frame<3;frame++){
     await settle(page);
     assert.deepEqual(await readHeader(page),m,mode+' boundary remains settled at '+width);
    }
    boundaries.push({mode,width,required,visibleSet:m.visibleSet});
   }
  }
  const sweeps=[await verifySweep(page,canonical,'default')];

  // A font-family change alters measured text without a viewport resize.
  await page.setViewportSize({width:1440,height:960});
  const fontStyle=await page.addStyleTag({content:'header, header > button { font-family: monospace; }'});
  await settle(page);
  const alternate=(await readHeader(page)).canonical;
  assert.notEqual(alternate.fullRequired,canonical.fullRequired,'alternate font changes the measured full width');
  const fontBoundary=Math.floor((alternate.fullRequired+canonical.fullRequired)/2);
  await fontStyle.evaluate(style=>{style.disabled=true;});
  await page.setViewportSize({width:fontBoundary,height:960});await settle(page);
  const beforeFont=await readHeader(page);assertHeader(beforeFont,'before font change');
  await fontStyle.evaluate(style=>{style.disabled=false;});await settle(page);
  const afterFont=await readHeader(page);assertHeader(afterFont,'after font change without resize');
  assert.notEqual(afterFont.brand.visible,beforeFont.brand.visible,'font change recomputes title fit without a resize');
  sweeps.push(await verifySweep(page,alternate,'monospace'));
  await fontStyle.evaluate(style=>style.remove());await settle(page);
  const restored=await readHeader(page);assertHeader(restored,'font restored');
  assert.deepEqual(restored.canonical,canonical,'restoring the font restores canonical measurements');

  // Browser zoom reflows the viewport in CSS pixels. These viewport/DPR pairs
  // cover 1280px at 125%, 150%, 200% and 400%, including the compact target mode.
  const zoomResults=[];
  for(const zoom of [1.25,1.5,2,4]){
   const zc=await browser.newContext({viewport:{width:Math.floor(1280/zoom),height:Math.floor(960/zoom)},deviceScaleFactor:zoom}),zp=await zc.newPage();
   try{
    watchErrors(zp);
    await zp.goto('http://127.0.0.1:4173/');await zp.waitForFunction(()=>!document.querySelector('#open').disabled);
    await zp.evaluate(()=>document.fonts.ready);await settle(zp);
    const m=await readHeader(zp);assertHeader(m,'zoom '+zoom);
    assert.deepEqual(m.canonical,canonical,'zoom uses the same canonical CSS-pixel measurements');
    zoomResults.push({zoom,...m});
   }finally{await zc.close();}
  }
  assert.equal(await page.locator('header #refresh').count(),0,'document refresh is outside responsive header measurements');
  assert.equal(await page.locator('#refresh .source-caption').count(),0,'document refresh remains icon-only');
  assert.equal(await page.locator('#refresh').isVisible(),false,'no active document hides refresh');
  await page.locator('#open-sample').click();await page.locator('.node').first().waitFor();await settle(page);
  const withSample=await readHeader(page);assertHeader(withSample,'sample open');assert.deepEqual(withSample.canonical,canonical,'sample document does not change canonical header measurements');
  assert.equal(await page.locator('#refresh').isVisible(),true,'selected sample keeps refresh visible');assert.equal(await page.locator('#refresh').isDisabled(),true,'sample has no reloadable external source');assert.equal(await page.locator('#refresh').evaluate(button=>getComputedStyle(button).opacity),'0.4','sample refresh remains gray');
  assert.deepEqual(pageErrors,[],'header resize/font tests have no page errors, including ResizeObserver loops');
  assert.deepEqual(resizeObserverErrors,[],'header resize/font tests do not log ResizeObserver loop errors');
  return {results,boundaries,sweeps,sampleRefresh:{visible:true,disabled:true,headerMetricsUnchanged:true},pageErrors,resizeObserverErrors,fontChange:{width:fontBoundary,before:beforeFont.visibleSet,after:afterFont.visibleSet},zoomResults,limit:'Chromium CSS viewport/DPR zoom-equivalent coverage; native browser zoom UI, physical mobile devices and human interaction review are separate.'};
 }finally{await context.close();}
}
