import assert from 'node:assert/strict';

/** Read-only rendered assertions; does not resize, click, scroll or alter styles.
 * Four options occupy two equal-width rows, followed by one 40px zoom row.
 * The toolbar may grow for wrapping, but must leave at least two thirds of the
 * graph viewport height unobscured. Return actual geometry for review evidence.
 */
export async function assertToolbarLayout(page){
 const measured=await page.evaluate(()=>{
  const box=e=>{const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};};
  const toolbar=document.querySelector('.toolbar'),viewport=document.querySelector('#viewport');
  if(!toolbar||!viewport)throw Error('Missing viewer toolbar or viewport');
  const items=[...toolbar.querySelectorAll('.edge-option,button,#zoom')].map(e=>{
   const rect=box(e),hit=document.elementFromPoint(rect.left+rect.width/2,rect.top+rect.height/2),walker=document.createTreeWalker(e,NodeFilter.SHOW_TEXT),textRects=[];
   let text;while(text=walker.nextNode()){if(!text.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(text);for(const r of range.getClientRects())textRects.push({left:r.left,right:r.right,top:r.top,bottom:r.bottom});}
   const checkbox=e.querySelector('input[type="checkbox"]');
   return {id:checkbox?.id||e.id,name:e.textContent||e.getAttribute('aria-label'),kind:e.classList.contains('edge-option')?'option':e.id==='zoom'?'zoom-value':'button',...rect,hit:e===hit||e.contains(hit),textRects,checkbox:checkbox&&box(checkbox),scrollWidth:e.scrollWidth,clientWidth:e.clientWidth,scrollHeight:e.scrollHeight,clientHeight:e.clientHeight};
  });
  return {window:{width:innerWidth,height:innerHeight},viewport:box(viewport),toolbar:box(toolbar),items};
 });
 const epsilon=.75,contains=(outer,inner)=>inner.left>=outer.left-epsilon&&inner.right<=outer.right+epsilon&&inner.top>=outer.top-epsilon&&inner.bottom<=outer.bottom+epsilon,near=(a,b)=>Math.abs(a-b)<=epsilon;
 const {toolbar,viewport,items}=measured,options=items.filter(i=>i.kind==='option'),zoom=items.filter(i=>i.kind!=='option'),buttons=zoom.filter(i=>i.kind==='button');
 const message=label=>label+': '+JSON.stringify(measured);
 assert.equal(options.length,4,message('four display options'));
 assert.deepEqual(zoom.map(i=>i.id),['layout-lock','out','zoom','in'],message('lock and zoom order'));
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
  }else if(item.kind==='button')assert.ok(item.height>=40-epsilon&&item.width>=32-epsilon,message(item.id+' zoom button hit area40px high and at least32px wide'));
  else assert.ok(item.height>0&&item.width>=32-epsilon,message(item.id+' visible zoom value at least32px wide'));
 }
 for(let i=0;i<items.length;i++)for(let j=0;j<i;j++){const a=items[i],b=items[j];assert.ok(a.right<=b.left+epsilon||b.right<=a.left+epsilon||a.bottom<=b.top+epsilon||b.bottom<=a.top+epsilon,message(a.id+' and '+b.id+' do not overlap'));}
 for(const row of [options.slice(0,2),options.slice(2)]){
  assert.ok(near(row[0].top,row[1].top)&&near(row[0].bottom,row[1].bottom),message('paired option row alignment'));
  assert.ok(near(row[0].width,row[1].width)&&near(row[0].right,row[1].left),message('two equal adjoining option cells'));
 }
 assert.ok(near(options[0].left,options[2].left)&&near(options[1].right,options[3].right),message('option columns align'));
 assert.ok(near(options[0].bottom,options[2].top),message('exactly two adjoining option rows'));
 const buttonRow=buttons[0];
 assert.ok(buttons.every(i=>i.top>=options[2].bottom-epsilon&&near(i.top,buttonRow.top)&&near(i.bottom,buttonRow.bottom)),message('zoom buttons occupy one separate row'));
 const zoomValue=zoom.find(i=>i.kind==='zoom-value');
 assert.ok(zoomValue.top>=buttonRow.top-epsilon&&zoomValue.bottom<=buttonRow.bottom+epsilon&&near((zoomValue.top+zoomValue.bottom)/2,(buttonRow.top+buttonRow.bottom)/2),message('zoom value is contained and vertically centered in the button row'));
 // Detect arbitrary blank/padded height as well as overlaps: the measured bar
 // is exactly these three content rows plus its borders/separator (<=4px).
 const rowsHeight=options[0].height+options[2].height+buttonRow.height;
 assert.ok(toolbar.height>=rowsHeight-epsilon&&toolbar.height<=rowsHeight+4,message('toolbar height explained by two option rows and zoom row'));
 return measured;
}
