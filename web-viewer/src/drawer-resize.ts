/** Width is presentation state; it never alters a graph or its selected page. */
export function installDrawerResize(drawer:HTMLElement,workspace:HTMLElement,storage:string){
 const handle=document.createElement('div');handle.className='concept-drawer-resize';handle.tabIndex=0;handle.setAttribute('role','separator');handle.setAttribute('aria-orientation','vertical');handle.setAttribute('aria-label','補足情報の幅');drawer.prepend(handle);
 let width=440;try{const saved=Number(sessionStorage.getItem(storage));if(Number.isFinite(saved)&&saved>=280)width=saved;}catch{}
 const limit=()=>{let available=workspace.clientWidth||innerWidth;const explorer=workspace.querySelector<HTMLElement>('#design-explorer');if(innerWidth>800&&explorer&&!explorer.hidden)available-=explorer.offsetWidth;return Math.max(280,Math.min(1000,available-(innerWidth>800?240:16)));};
 const apply=(next:number,persist=false)=>{width=Math.max(280,Math.min(limit(),next));drawer.style.setProperty('--concept-drawer-width',width+'px');handle.setAttribute('aria-valuemin','280');handle.setAttribute('aria-valuemax',String(limit()));handle.setAttribute('aria-valuenow',String(Math.round(width)));if(persist)try{sessionStorage.setItem(storage,String(width));}catch{}};
 handle.onkeydown=event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();apply(event.key==='Home'?280:event.key==='End'?limit():width+(event.key==='ArrowLeft'?40:-40),true);};
 handle.onpointerdown=event=>{if(event.button!==0)return;event.preventDefault();const start=event.clientX,initial=width;handle.setPointerCapture(event.pointerId);handle.classList.add('resizing');
  handle.onpointermove=move=>apply(initial+start-move.clientX);
  handle.onpointerup=()=>{handle.onpointermove=null;handle.onpointerup=null;handle.onpointercancel=null;handle.classList.remove('resizing');apply(width,true);};
  handle.onpointercancel=handle.onpointerup;
 };
 if(typeof ResizeObserver!=='undefined'){const observer=new ResizeObserver(()=>apply(width));observer.observe(workspace);const explorer=workspace.querySelector('#design-explorer');if(explorer)observer.observe(explorer);}
 window.addEventListener('resize',()=>apply(width));apply(width);
}
