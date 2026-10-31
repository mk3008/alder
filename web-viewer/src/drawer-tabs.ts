type DrawerTab={id:string;label:string;selected:boolean;select:()=>void};

/** The drawer's local modes share the same keyboard and visual treatment. */
export function drawerTabs(label:string,items:DrawerTab[]):HTMLElement{
 const nav=document.createElement('nav');nav.className='right-drawer-tabs';nav.setAttribute('role','tablist');nav.setAttribute('aria-label',label);
 for(const item of items){
  const tab=document.createElement('button');tab.type='button';tab.id=item.id;tab.textContent=item.label;tab.setAttribute('role','tab');tab.setAttribute('aria-selected',String(item.selected));tab.tabIndex=item.selected?0:-1;tab.onclick=item.select;nav.append(tab);
 }
 nav.onkeydown=event=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  const tabs=Array.from(nav.querySelectorAll<HTMLButtonElement>('button[role=tab]')),index=tabs.indexOf(event.target as HTMLButtonElement);if(index<0||!tabs.length)return;
  const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
  event.preventDefault();const id=tabs[next].id;tabs[next].click();document.getElementById(id)?.focus({preventScroll:true});
 };
 return nav;
}
