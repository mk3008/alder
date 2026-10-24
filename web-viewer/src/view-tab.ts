import {createElement,Workflow,GitBranch,Network,X} from 'lucide';

export type ViewKind='business'|'states'|'concept';
const kinds={business:{name:'業務',full:'業務設計',icon:Workflow},states:{name:'状態',full:'状態遷移',icon:GitBranch},concept:{name:'概念',full:'概念モデル',icon:Network}};
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

// MENU-001's line chevrons, including their asymmetry in the two appearances.
export function menuChevron(open:boolean){
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg'),path=document.createElementNS(svg.namespaceURI,'path');
 svg.setAttribute('viewBox','0 0 16 16');svg.setAttribute('aria-hidden','true');svg.classList.add('explorer-chevron');
 path.setAttribute('d',open?'m4 6 4 4 4-4':'m6 3 4 5-4 5');path.setAttribute('fill','none');path.setAttribute('stroke','currentColor');path.setAttribute('stroke-width','1.5');svg.append(path);return svg;
}
