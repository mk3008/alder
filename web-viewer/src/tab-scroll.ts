/** Scroll the common tab row without changing the selected view. */
export function installTabScroll(strip:HTMLElement){
 strip.addEventListener('wheel',event=>{
  if(event.ctrlKey)return;
  const maximum=Math.max(0,strip.scrollWidth-strip.clientWidth);if(!maximum)return;
  const delta=Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY;if(!delta)return;
  const unit=event.deltaMode===1?16:event.deltaMode===2?strip.clientWidth:1;
  const before=strip.scrollLeft,next=Math.max(0,Math.min(maximum,before+delta*unit));
  if(next!==before){strip.scrollLeft=next;event.preventDefault();}
 },{passive:false});
}

/** Reveal the active tab without changing the page's vertical position. */
export function revealTab(strip:HTMLElement,tab:HTMLElement){
 const frame=strip.getBoundingClientRect(),item=tab.getBoundingClientRect();
 const delta=item.left<frame.left?item.left-frame.left:item.right>frame.right?item.right-frame.right:0;
 if(delta)strip.scrollLeft=Math.max(0,Math.min(strip.scrollWidth-strip.clientWidth,strip.scrollLeft+delta));
}
