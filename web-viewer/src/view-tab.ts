import {createElement,Workflow,GitBranch,Database,PanelsTopLeft,ListChecks,X,ChevronDown,ChevronRight} from 'lucide';

export type ViewKind='business'|'states'|'concept'|'subsystems'|'tests';
const kinds={subsystems:{full:'サブシステム',icon:PanelsTopLeft},business:{full:'業務設計',icon:Workflow},states:{full:'状態遷移',icon:GitBranch},concept:{full:'データ構造',icon:Database},tests:{full:'テスト仕様',icon:ListChecks}};
export function viewTabLabel(button:HTMLButtonElement,kind:ViewKind,name:string){
 const type=kinds[kind],label=document.createElement('span'),badge=document.createElement('span'),title=document.createElement('span');
 label.className='view-tab-label';badge.className='view-tab-kind';badge.setAttribute('aria-hidden','true');
 badge.append(createElement(type.icon,{'aria-hidden':'true','stroke-width':1.8}));
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
