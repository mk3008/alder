import {createElement,Workflow,GitBranch,Database,X,ChevronDown,ChevronRight} from 'lucide';

export type ViewKind='business'|'states'|'concept';
const kinds={business:{name:'業務',full:'業務設計',icon:Workflow},states:{name:'状態',full:'状態遷移',icon:GitBranch},concept:{name:'概念',full:'概念モデル',icon:Database}};
export function viewTabLabel(button:HTMLButtonElement,kind:ViewKind,name:string){
 const type=kinds[kind],label=document.createElement('span'),badge=document.createElement('span'),title=document.createElement('span');
 label.className='view-tab-label';badge.className='view-tab-kind';badge.setAttribute('aria-hidden','true');
 badge.append(createElement(type.icon,{'aria-hidden':'true','stroke-width':1.8}),document.createTextNode(type.name));
 title.className='view-tab-name';title.textContent=name;label.append(badge,title);button.replaceChildren(label);
 button.title=type.full+' / '+name;button.setAttribute('aria-label',type.full+'：'+name);
}
export function viewTabClose(label:string){
 const button=document.createElement('button');button.type='button';button.className='close';button.title=label;button.setAttribute('aria-label',label);
 button.append(createElement(X,{'aria-hidden':'true','stroke-width':1.8}));return button;
}

// MENU-001 placement with the application's shared Lucide icon set.
export function menuChevron(open:boolean){
 const svg=createElement(open?ChevronDown:ChevronRight,{'aria-hidden':'true','stroke-width':1.5});
 svg.classList.add('explorer-chevron');svg.dataset.icon=open?'chevron-down':'chevron-right';return svg;
}
