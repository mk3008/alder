import {createElement,Settings,LockKeyhole,LockKeyholeOpen,Minus,Plus,SquareArrowOutUpRight} from 'lucide';
import styles from './canvas-toolbar.css?url';
/** Use the same Lucide paths and stylesheet inside the isolated concept canvas. */
export function styleConceptToolbar(doc:Document){
 const bar=doc.querySelector<HTMLElement>('.canvas-controls');if(!bar)return;
 if(!doc.querySelector('[data-canvas-toolbar-style]')){const link=doc.createElement('link');link.rel='stylesheet';link.href=styles;link.dataset.canvasToolbarStyle='';doc.head.append(link);}
 const put=(selector:string,icon:Parameters<typeof createElement>[0],className?:string)=>{const svg=createElement(icon,{'stroke-width':1.8,'aria-hidden':'true'});if(className)svg.classList.add(className);bar.querySelector(selector)?.append(svg);};
 for(const selector of ['.graph-settings-toggle','.layout-lock','.zoom-out','.zoom-in'])bar.querySelector(selector)?.replaceChildren();
 put('.graph-settings-toggle',Settings);put('.layout-lock',LockKeyhole,'lock-closed');put('.layout-lock',LockKeyholeOpen,'lock-open');put('.zoom-out',Minus);put('.zoom-in',Plus);
}

/** Populate shape commands with Lucide without duplicating icon paths in the fixture. */
export function styleConceptNodes(doc:Document){
 for(const button of Array.from(doc.querySelectorAll<HTMLButtonElement>('.concept-open-action'))){
  if(button.querySelector('svg'))continue;
  button.append(createElement(SquareArrowOutUpRight,{'aria-hidden':'true','stroke-width':1.8}));
 }
}
