// This opt-in browser case is the ONLY capture entry point. Do not run locally.
// Its single authorized CI invocation emits exactly two PNGs, once each, to logs.
import assert from 'node:assert/strict';
import {loadReviewModel,buildReviewPlans,contains,overlap,sha256,checkPayloadBudget,REVIEW_LIMITS,EXPECTED_VISIBLE} from './review-routing/model.mjs';
import {renderReviewHTML} from './review-routing/render.mjs';
let invoked=false;

async function inspectPage(page,plan){
  await page.evaluate(async()=>{await document.fonts.ready;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));});
  const measured=await page.evaluate(()=>{
    const box=r=>({x:r.x,y:r.y,width:r.width,height:r.height});
    return {
      image:document.querySelector('.review-sheet').dataset.image,
      reviewOnly:document.querySelector('.review-sheet').dataset.reviewOnly,
      sheet:box(document.querySelector('.review-sheet').getBoundingClientRect()),
      viewport:{width:innerWidth,height:innerHeight,devicePixelRatio},
      fontsStatus:document.fonts.status,
      panels:Array.from(document.querySelectorAll('.review-panel'),panel=>({
        id:panel.dataset.scene,router:panel.dataset.router,
        crop:box(panel.querySelector('.review-crop').getBoundingClientRect()),
        transform:getComputedStyle(panel.querySelector('.review-world')).transform,
        svgCount:panel.querySelectorAll('svg').length,
        diagramCount:panel.querySelectorAll('svg.review-edges').length,
        markerCount:panel.querySelectorAll('marker').length,
        nodes:Array.from(panel.querySelectorAll('.node'),n=>({id:n.dataset.node,x:parseFloat(n.style.left),y:parseFloat(n.style.top),width:parseFloat(getComputedStyle(n).width),height:parseFloat(getComputedStyle(n).height),type:n.classList.contains('business')?'business':'object',whoBadge:n.querySelectorAll('.who-badge').length,name:n.querySelector('.node-name').textContent})),
        paths:Array.from(panel.querySelectorAll('.edge'),p=>({index:Number(p.dataset.relation),path:p.getAttribute('d'),marker:p.getAttribute('marker-end'),exception:p.classList.contains('exception'),box:box(p.getBBox())})),
        labels:Array.from(panel.querySelectorAll('.edge-label'),n=>({index:Number(n.dataset.relation),text:n.textContent,x:Number(n.getAttribute('x')),y:Number(n.getAttribute('y')),box:box(n.getBBox()),style:{fontSize:getComputedStyle(n).fontSize,fontFamily:getComputedStyle(n).fontFamily,strokeWidth:getComputedStyle(n).strokeWidth,fill:getComputedStyle(n).fill}}))
      }))
    };
  });
  assert.equal(measured.reviewOnly,'true');assert.equal(measured.image,plan.id);
  assert.deepEqual(measured.viewport,{width:plan.width,height:plan.height,devicePixelRatio:1});
  assert.deepEqual(measured.sheet,{x:0,y:0,width:plan.width,height:plan.height});
  assert.equal(measured.fontsStatus,'loaded');assert.equal(measured.panels.length,2);
  const reports=[];
  for(let i=0;i<2;i++){
    const data=measured.panels[i],scene=plan.panels[i].scene;
    assert.equal(data.id,scene.id);assert.equal(data.router,scene.router);
    assert.equal(data.diagramCount,1);assert.equal(data.svgCount,26);assert.equal(data.markerCount,1);
    assert.equal(data.crop.width,plan.panelWidth);assert.equal(data.crop.height,plan.panelHeight);
    assert.ok(contains(measured.sheet,data.crop));
    assert.equal(data.nodes.length,25);assert.deepEqual(data.nodes.map(n=>n.id),scene.nodes.map(n=>n.id));
    for(let j=0;j<25;j++){
      const n=data.nodes[j],expected=scene.nodes[j];
      for(const key of ['id','x','y','width','height','type','name'])assert.equal(n[key],expected[key]);
      assert.equal(n.whoBadge,n.type==='business'?1:0);
    }
    assert.deepEqual(data.paths.map(p=>p.index),EXPECTED_VISIBLE);assert.deepEqual(data.labels.map(p=>p.index),EXPECTED_VISIBLE);
    assert.equal(data.paths.filter(p=>p.exception).length,2);
    for(let j=0;j<53;j++){
      const edge=scene.edges[j],path=data.paths[j],label=data.labels[j];
      assert.equal(path.path,edge.route.path);assert.equal(path.marker,`url(#arrow-${plan.id}-${i})`);
      assert.equal(label.text,edge.label);assert.equal(label.x,edge.route.label[0]);assert.equal(label.y,edge.route.label[1]);
      assert.equal(label.style.fontSize,'12px');assert.equal(label.style.strokeWidth,'6px');assert.ok(label.box.width>0&&label.box.height>0);
      assert.match(label.style.fontFamily,/Noto Sans CJK JP/);
      if(plan.id==='overview'){
        assert.ok(contains(plan.crop,path.box),`Overview clips route ${edge.index}`);
        assert.ok(contains(plan.crop,{x:label.box.x-3,y:label.box.y-3,width:label.box.width+6,height:label.box.height+6}),`Overview clips rendered label ${edge.index}`);
      }
    }
    const focus=data.labels.find(e=>e.index===59),focusEdge=scene.edges.find(e=>e.index===59);
    if(plan.id!=='overview')assert.ok(contains(plan.crop,{x:focus.box.x-3,y:focus.box.y-3,width:focus.box.width+6,height:focus.box.height+6}),'Detail must retain all of relation 59 label');
    reports.push({scene:scene.id,transform:data.transform,worldCrop:plan.crop,scale:plan.scale,nodeCount:25,visibleRelations:53,svgCount:data.svgCount,focus:{relation:59,estimatedBounds:focusEdge.labelBounds,browserTextBounds:focus.box,estimatedCardOverlaps:scene.nodes.filter(n=>overlap(focusEdge.labelBounds,n)).map(n=>n.id),browserTextCardOverlaps:data.nodes.filter(n=>overlap(focus.box,n)).map(n=>n.id),routingFallback:focusEdge.route.fallback},labelStyle:focus.style});
  }
  assert.equal(measured.panels[0].transform,measured.panels[1].transform,'A comparison must use one identical world transform');
  assert.deepEqual(reports[0].labelStyle,reports[1].labelStyle);
  if(plan.id!=='overview')assert.deepEqual(measured.panels[0].nodes,measured.panels[1].nodes,'Detail isolates the router at identical coordinates');
  // Report Chrome's actual glyph font, rather than treating fonts.check as proof.
  const cdp=await page.context().newCDPSession(page);
  try{
    await cdp.send('DOM.enable');await cdp.send('CSS.enable');
    const {root}=await cdp.send('DOM.getDocument');
    for(let i=0;i<2;i++){
      const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector:`.review-panel:nth-of-type(${i+1}) .edge-label[data-relation="59"]`});
      assert.ok(nodeId,'Missing focus label for platform-font inspection');
      const {fonts}=await cdp.send('CSS.getPlatformFontsForNode',{nodeId});
      assert.ok(fonts.some(f=>/Noto Sans CJK JP/.test(f.familyName)&&f.glyphCount>0),'Install the official Noto CJK fonts before this single capture');
      reports[i].platformFonts=fonts;
    }
    assert.deepEqual(reports[0].platformFonts,reports[1].platformFonts,'Comparison glyph fonts must match');
  }finally{await cdp.detach();}
  return reports;
}

export async function verifyRoutingReviewImages(browser){
  assert.equal(invoked,false,'Review image generation is one-shot; do not retry or recapture');invoked=true;
  const model=loadReviewModel(),plans=buildReviewPlans(model),context=await browser.newContext({deviceScaleFactor:1,colorScheme:'light',reducedMotion:'reduce',locale:'ja-JP'});
  const pages=[],requests=[],errors=[],captures=[],inspections=[];
  // Self-contained setContent only: no app, storage, network, cache or artifact.
  await context.route('**/*',async route=>{requests.push(route.request().url());await route.abort();});
  try{
    // Complete both DOM/font preflights before the first and only captures.
    for(const plan of plans){
      const page=await context.newPage();pages.push(page);await page.setViewportSize({width:plan.width,height:plan.height});
      page.on('pageerror',e=>errors.push(e.message));
      await page.setContent(renderReviewHTML(model,plan),{waitUntil:'load'});
      inspections.push(await inspectPage(page,plan));
    }
    assert.deepEqual(requests,[]);assert.deepEqual(errors,[]);
    for(let i=0;i<plans.length;i++){
      // Exactly one screenshot call per PNG. No path, artifact upload or retry.
      const bytes=await pages[i].screenshot({type:'png',fullPage:false,animations:'disabled',caret:'hide',scale:'css',timeout:30000});
      assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
      assert.equal(bytes.toString('ascii',12,16),'IHDR');
      assert.equal(bytes.readUInt32BE(16),plans[i].width);assert.equal(bytes.readUInt32BE(20),plans[i].height);
      captures.push(bytes);
    }
    assert.deepEqual(requests,[]);assert.deepEqual(errors,[]);
    const totals=checkPayloadBudget(captures),batch=sha256(captures.map(sha256).join(':')).slice(0,16);
    const images=plans.map((plan,i)=>({id:plan.id,fileName:`routing-review-${plan.id}.png`,mimeType:'image/png',width:plan.width,height:plan.height,pngBytes:captures[i].length,base64Characters:4*Math.ceil(captures[i].length/3),sha256:sha256(captures[i]),chunks:Math.ceil((4*Math.ceil(captures[i].length/3))/REVIEW_LIMITS.chunkCharacters),worldCrop:plan.crop,scale:plan.scale,panels:inspections[i]}));
    const metadata={format:'alder-routing-review-v1',batch,reviewOnly:true,notLiveProductScreenshot:true,source:'business-design/alder/README.md (public sample)',browser:browser.version(),sourceHashes:model.sourceHashes,visibleIndexes:model.visibleIndexes,hiddenIndexes:model.hiddenIndexes,kinds:model.kinds,estimatedConflict:model.estimatedOverlap,limits:REVIEW_LIMITS,...totals,images,storage:'memory and bounded CI log chunks only; no artifact or cache',recovery:'For each image, collect ROUTING_REVIEW_CHUNK records matching batch/id/sha256, require each 1-based index exactly once, concatenate data in index order, base64-decode, and verify pngBytes and sha256. Never recapture to recover missing logs.'};
    console.log('ROUTING_REVIEW_METADATA '+JSON.stringify(metadata));
    for(let i=0;i<images.length;i++){
      const item=images[i],base64=captures[i].toString('base64');
      for(let index=0;index<item.chunks;index++){
        const data=base64.slice(index*REVIEW_LIMITS.chunkCharacters,(index+1)*REVIEW_LIMITS.chunkCharacters);
        assert.ok(data.length<=REVIEW_LIMITS.chunkCharacters);
        console.log('ROUTING_REVIEW_CHUNK '+JSON.stringify({format:'alder-routing-review-v1',batch,id:item.id,sha256:item.sha256,index:index+1,total:item.chunks,characters:data.length,data}));
      }
    }
    console.log('ROUTING_REVIEW_COMPLETE '+JSON.stringify({batch,images:images.map(({id,sha256,pngBytes,chunks})=>({id,sha256,pngBytes,chunks})),...totals}));
    // The browser harness may repeat this summary, never the base64 payload.
    return {reviewOnly:true,batch,imageCount:captures.length,...totals,images:images.map(({id,sha256,pngBytes,width,height})=>({id,sha256,pngBytes,width,height})),checks:'Frozen public sources; 25 cards / original 53 visible relation indexes; real Chrome text bounds and platform fonts; same scale/crop/style per comparison; PNG IHDR and aggregate payload caps; no network or artifacts',limits:['Review-only diagram, not a live product screenshot','Overview changes both layout and router; detail keeps the staircase layout fixed','Overview text is intentionally small; the second PNG gives a 1× relation-59 detail','Routing estimated-box conflicts and browser text-box conflicts are reported separately']};
  }finally{await context.close();}
}
