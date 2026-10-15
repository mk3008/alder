/** Small toolbar menus. Original buttons retain their handlers and IDs. */
export function installDropdown(toggle:HTMLButtonElement,menu:HTMLElement,beforeOpen=()=>{}){
  menu.classList.add('toolbar-menu');menu.setAttribute('role','menu');menu.hidden=true;
  toggle.setAttribute('aria-haspopup','menu');toggle.setAttribute('aria-controls',menu.id);toggle.setAttribute('aria-expanded','false');
  const items=()=>Array.from(menu.querySelectorAll<HTMLButtonElement>('button')).filter(b=>!b.hidden&&!b.disabled);
  for(const b of Array.from(menu.querySelectorAll('button')))b.setAttribute('role','menuitem');
  const close=(restore=false)=>{menu.hidden=true;toggle.setAttribute('aria-expanded','false');if(restore)(toggle.getBoundingClientRect().width?toggle:document.getElementById('document-actions-toggle'))?.focus({preventScroll:true});};
  const show=(last=false)=>{if(toggle.disabled)return;beforeOpen();menu.hidden=false;toggle.setAttribute('aria-expanded','true');const anchor=toggle.getBoundingClientRect().width?toggle:document.getElementById('document-actions-toggle')!,rect=anchor.getBoundingClientRect();menu.style.left=Math.max(8,Math.min(rect.right-menu.offsetWidth,innerWidth-menu.offsetWidth-8))+'px';menu.style.top=Math.max(8,Math.min(rect.bottom+4,innerHeight-menu.offsetHeight-8))+'px';(last?items().at(-1):items()[0])?.focus({preventScroll:true});};
  toggle.onclick=()=>menu.hidden?show():close(true);
  toggle.onkeydown=e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();show(e.key==='ArrowUp');}};
  menu.addEventListener('keydown',e=>{const event=e as KeyboardEvent,enabled=items(),i=enabled.indexOf(document.activeElement as HTMLButtonElement);let next:number|undefined;if(event.key==='ArrowDown')next=(i+1)%enabled.length;if(event.key==='ArrowUp')next=(i+enabled.length-1)%enabled.length;if(event.key==='Home')next=0;if(event.key==='End')next=enabled.length-1;if(next!==undefined){event.preventDefault();enabled[next]?.focus();}});
  menu.addEventListener('click',e=>{const b=(e.target as Element).closest('button');if(!menu.hidden&&b&&!b.disabled)close(true);},true);
  document.addEventListener('keydown',e=>{if(!menu.hidden&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close(true);}},true);
  document.addEventListener('pointerdown',e=>{if(!menu.hidden&&!menu.contains(e.target as Node)&&!toggle.contains(e.target as Node))close();});
  document.addEventListener('focusin',e=>{if(!menu.hidden&&!menu.contains(e.target as Node)&&e.target!==toggle)close();});
  window.addEventListener('resize',()=>close());return {close};
}
