import assert from 'node:assert/strict';

/** Read-only rendered assertions; does not resize, click, scroll or alter styles.
 * Closed: one 40px gear/lock/zoom row. Open: four options in two equal-width
 * rows above that same control row. Both states retain the existing height,
 * text bounds, native hit testing and touch-size requirements.
 */
export async function assertToolbarLayout(page,{open}={}){
 const measured=await page.evaluate(()=>{
  const box=e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
  const toolbar=document.querySelector('.toolbar'),viewport=document.querySelector('#viewport'),panel=document.querySelector('#display-options'),toggle=document.querySelector('#display-settings-toggle');
  if(!toolbar||!viewport||!panel||!toggle)throw Error('Missing viewer toolbar, viewport, settings gear or panel');
  const allOptions=[...panel.querySelectorAll('.edge-option')].map(e=>({id:e.querySelector('input')?.id,rects:e.getClientRects().length,...box(e)}));
  const items=[...toolbar.querySelectorAll('.edge-option,button,#zoom')].filter(e=>e.getClientRects().length&&e.getBoundingClientRect().height>0).map(e=>{
   const rect=box(e),hit=document.elementFromPoint(rect.left+rect.width/2,rect.top+rect.height/2),walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT),textRects=[];
   let text;while(text=walker.nextNode()){if(!text.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(text);for(const r of range.getClientRects())textRects.push({left:r.left,right:r.right,top:r.top,bottom:r.bottom});}
   const checkbox=e.querySelector('input[type="checkbox"]');
   return {id:checkbox?.id||e.id,name:e.textContent||e.getAttribute('aria-label'),kind:e.classList.contains('edge-option')?'option':e.id==='zoom'?'zoom-value':'button',...rect,hit:e===hit||e.contains(hit),textRects,checkbox:checkbox&&box(checkbox),scrollWidth:e.scrollWidth,clientWidth:e.clientWidth,scrollHeight:e.scrollHeight,clientHeight:e.clientHeight};
  });
  return {window:{width:innerWidth,height:innerHeight},viewport:box(viewport),toolbar:box(toolbar),items,allOptions,expanded:toggle.getAttribute('aria-expanded'),toolbarState:toolbar.dataset.settingsOpen,panel:{...box(panel),hidden:panel.hidden,position:getComputedStyle(panel).position,display:getComputedStyle(panel).display},controls:toggle.getAttribute('aria-controls')};
 });
 const epsilon=.75,contains=(outer,inner)=>inner.left>=outer.left-epsilon&&inner.right<=outer.right+epsilon&&inner.top>=outer.top-epsilon&&inner.bottom<=outer.bottom+epsilon,near=(a,b)=>Math.abs(a-b)<=epsilon;
 const {toolbar,viewport,items}=measured,options=items.filter(i=>i.kind==='option'),controls=items.filter(i=>i.kind!=='option'),buttons=controls.filter(i=>i.kind==='button');
 const message=label=>label+': '+JSON.stringify(measured);
 assert.ok(measured.expanded==='true'||measured.expanded==='false',message('gear exposes expansion state'));
 const expanded=measured.expanded==='true';if(open!==undefined)assert.equal(expanded,open,message('requested expansion state'));
 assert.equal(measured.toolbarState,measured.expanded,message('toolbar expansion state follows gear'));
 assert.equal(measured.controls,'display-options',message('gear controls display options'));
 assert.equal(measured.panel.hidden,!expanded,message('hidden attribute follows gear'));
 assert.deepEqual(measured.allOptions.map(i=>i.id),['show-outside','prefer-write','show-exceptions','selected-edges-only'],message('all four display options retained'));
 assert.equal(options.length,expanded?4:0,message('only expanded settings have visible option cells'));
 assert.deepEqual(controls.map(i=>i.id),['display-settings-toggle','layout-lock','out','zoom','in'],message('gear, lock and zoom order'));
 assert.ok(contains({left:0,top:0,right:measured.window.width,bottom:measured.window.height},toolbar),message('toolbar within window'));
 assert.ok(contains(viewport,toolbar),message('toolbar within graph viewport'));
 assert.ok(toolbar.height<=viewport.height/3,message('toolbar must leave at least two thirds of graph viewport height unobscured'));
 for(const item of items){
  assert.ok(contains(toolbar,item),message(item.id+' within toolbar'));
  assert.ok(item.hit,message(item.id+' center hit target'));
  assert.ok(item.scrollHeight<=item.clientHeight+1&&item.scrollWidth<=item.clientWidth+1,message(item.id+' unclipped content'));
  assert.ok(item.textRects.length>0||item.kind==='button',message(item.id+' visible caption'));
  for(const text of item.textRects)assert.ok(contains(item,text),message(item.id+' text inside its own cell'));
  if(item.kind==='option'){
   assert.ok(item.height>=32-epsilon&&item.width>=32-epsilon,message(item.id+' label hit area at least32px'));
   assert.ok(item.checkbox&&contains(item,item.checkbox),message(item.id+' checkbox inside its own label'));
  }else if(item.kind==='button')assert.ok(item.height>=40-epsilon&&item.width>=32-epsilon,message(item.id+' control hit area40px high and at least32px wide'));
  else assert.ok(item.height>0&&item.width>=32-epsilon,message(item.id+' visible zoom value at least32px wide'));
 }
 for(let i=0;i<items.length;i++)for(let j=0;j<i;j++){const a=items[i],b=items[j];assert.ok(a.right<=b.left+epsilon||b.right<=a.left+epsilon||a.bottom<=b.top+epsilon||b.bottom<=a.top+epsilon,message(a.id+' and '+b.id+' do not overlap'));}
 const buttonRow=buttons[0];
 assert.ok(buttons.every(i=>near(i.top,buttonRow.top)&&near(i.bottom,buttonRow.bottom)),message('gear, lock and zoom buttons occupy one row'));
 const zoomValue=controls.find(i=>i.kind==='zoom-value');
 assert.ok(zoomValue.top>=buttonRow.top-epsilon&&zoomValue.bottom<=buttonRow.bottom+epsilon&&near((zoomValue.top+zoomValue.bottom)/2,(buttonRow.top+buttonRow.bottom)/2),message('zoom value is contained and vertically centered in the button row'));
 let rowsHeight=buttonRow.height;
 if(expanded){
  assert.ok(['static','relative'].includes(measured.panel.position),message('settings panel stays in normal flow'));
  assert.ok(contains(toolbar,measured.panel),message('panel belongs to measured toolbar bounds'));
  for(const row of [options.slice(0,2),options.slice(2)]){
   assert.ok(near(row[0].top,row[1].top)&&near(row[0].bottom,row[1].bottom),message('paired option row alignment'));
   assert.ok(near(row[0].width,row[1].width)&&near(row[0].right,row[1].left),message('two equal adjoining option cells'));
  }
  assert.ok(near(options[0].left,options[2].left)&&near(options[1].right,options[3].right),message('option columns align'));
  assert.ok(near(options[0].bottom,options[2].top),message('exactly two adjoining option rows'));
  assert.ok(options.every(i=>i.bottom<=buttonRow.top+epsilon),message('settings expand above control row'));
  assert.ok(measured.panel.bottom<=buttonRow.top+epsilon,message('panel ends above always-visible controls'));
  rowsHeight+=options[0].height+options[2].height;
 }else{
  assert.equal(measured.panel.display,'none',message('collapsed panel has no rendered display'));
  assert.ok(measured.allOptions.every(i=>i.rects===0&&i.width===0&&i.height===0),message('collapsed options have no rendered hit targets'));
 }
 // Preserve the strict content-height oracle: no arbitrary blank/padded height.
 assert.ok(toolbar.height>=rowsHeight-epsilon&&toolbar.height<=rowsHeight+4,message('toolbar height explained by its visible rows and borders'));
 return measured;
}
