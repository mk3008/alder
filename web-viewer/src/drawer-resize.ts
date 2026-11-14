/** Width is presentation state; it never alters a graph or its selected page. */
export function installDrawerResize(drawer:HTMLElement,workspace:HTMLElement,storage:string,side:'left'|'right'='right'){
 const isLeft=side==='left',handle=document.createElement('div');handle.className=isLeft?'explorer-drawer-resize':'concept-drawer-resize';handle.tabIndex=0;handle.setAttribute('role','separator');handle.setAttribute('aria-orientation','vertical');handle.setAttribute('aria-label',isLeft?'エクスプローラーの幅':'補足情報の幅');drawer.prepend(handle);
 let width=isLeft?280:440;try{const saved=Number(sessionStorage.getItem(storage));if(Number.isFinite(saved)&&saved>=280)width=saved;}catch{}
 const opposite=isLeft?Array.from(workspace.querySelectorAll<HTMLElement>('#formattedMarkdownDrawer,.concept-related,.spec-related')):[workspace.querySelector<HTMLElement>('#design-explorer')].filter((item):item is HTMLElement=>!!item);
 const limit=()=>{let available=workspace.clientWidth||innerWidth;if(innerWidth>800){const visible=opposite.find(item=>!item.hidden);if(visible)available-=visible.offsetWidth;}return Math.max(280,Math.min(1000,available-(innerWidth>800?240:16)));};
 const apply=(next:number,persist=false)=>{width=Math.max(280,Math.min(limit(),next));drawer.style.setProperty(isLeft?'--explorer-drawer-width':'--concept-drawer-width',width+'px');handle.setAttribute('aria-valuemin','280');handle.setAttribute('aria-valuemax',String(limit()));handle.setAttribute('aria-valuenow',String(Math.round(width)));if(persist)try{sessionStorage.setItem(storage,String(width));}catch{}};
 handle.onkeydown=event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const direction=event.key==='ArrowLeft'?-1:1;apply(event.key==='Home'?280:event.key==='End'?limit():width+direction*(isLeft?40:-40),true);};
 handle.onpointerdown=event=>{if(event.button!==0)return;event.preventDefault();const start=event.clientX,initial=width;handle.setPointerCapture(event.pointerId);handle.classList.add('resizing');
  handle.onpointermove=move=>apply(initial+(isLeft?move.clientX-start:start-move.clientX));
  handle.onpointerup=()=>{handle.onpointermove=null;handle.onpointerup=null;handle.onpointercancel=null;handle.classList.remove('resizing');apply(width,true);};
  handle.onpointercancel=handle.onpointerup;
 };
 if(typeof ResizeObserver!=='undefined'){const observer=new ResizeObserver(()=>apply(width));observer.observe(workspace);for(const item of opposite)observer.observe(item);}
 window.addEventListener('resize',()=>apply(width));apply(width);
}
