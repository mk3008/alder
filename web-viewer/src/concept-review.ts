import {contentFor} from './data-examples';
import {createElement,SquareArrowOutUpRight,ArrowLeft} from 'lucide';
import {reviewGroups,type ReviewGroup} from './concept-review-fixture';
function add(root:HTMLElement,tag:string,value:string){const el=document.createElement(tag);el.textContent=value;root.append(el);return el;}
function command(root:HTMLElement,label:string,action:()=>void,back=false){const b=document.createElement('button');b.type='button';b.className=back?'review-back':'review-open';b.append(createElement(back?ArrowLeft:SquareArrowOutUpRight,{'aria-hidden':'true','stroke-width':1.8}));add(b,'span',label);b.onclick=action;root.append(b);return b;}
export function renderReviewLandscape(root:HTMLElement,open:(id:string)=>void,graph=false,changeMode:(graph:boolean)=>void=()=>{}){
 root.replaceChildren();add(root,'h1','データ構造全体像');
 const modes=document.createElement('div');modes.className='data-example-modes landscape-modes';modes.setAttribute('aria-label','全体像の表示切替');for(const [label,mode]of [['概要',false],['グラフ',true]] as const){const b=add(modes,'button',label) as HTMLButtonElement;b.type='button';b.setAttribute('aria-pressed',String(graph===mode));b.onclick=()=>changeMode(mode);}root.append(modes);root.dataset.mode=graph?'graph':'overview';const content=document.createElement('div');content.className='landscape-overview';content.hidden=graph;root.append(content);
 const cards=document.createElement('div');cards.className='review-group-grid';content.append(cards);
 for(const [index,group]of reviewGroups.entries()){const card=document.createElement('article');card.className='review-group-card';card.dataset.reviewGroup=group.id;add(card,'span',String(index+1).padStart(2,'0')).className='review-group-number';const content=contentFor(group.id)!;add(card,'h2',content.title);add(card,'p',content.description);add(card,'strong','レビュアー');add(card,'p',content.reviewer.role).className='review-owner';command(card,'データ構造を開く',()=>open(group.id)).setAttribute('aria-label',group.name+'のデータ構造を開く');cards.append(card);}

}
export function renderReviewHeading(root:HTMLElement,group:ReviewGroup,overview:()=>void){
 root.replaceChildren();command(root,'データ構造全体像',overview,true);add(root,'h1',contentFor(group.id)?.title??group.name);
}
export function renderReviewOverview(root:HTMLElement,group:ReviewGroup,openSample:(id:string)=>void=()=>{},openActivity:(id:string)=>void=()=>{},activities:{id:string;name:string}[]=[]){
 const content=contentFor(group.id);root.replaceChildren();if(!content)return;
 add(root,'p',content.description).className='review-description';
 add(root,'h3','レビュアー');add(root,'p',content.reviewer.role).className='review-owner';
 add(root,'h3','関連業務');const related=document.createElement('ul');related.className='review-related-activities';for(const activity of content.relatedActivities){const li=document.createElement('li');const target=activities.find(a=>a.id===activity.id&&a.name===activity.name);const b=command(li,activity.name,()=>{if(target)openActivity(target.id);});b.disabled=!target;b.setAttribute('aria-label',activity.name+'を業務タブで開く');b.querySelector('svg')?.setAttribute('data-icon','square-arrow-out-up-right');b.append(b.querySelector('svg')!);related.append(li);}root.append(related);
 add(root,'h3','できること');for(const capability of content.capabilities){const section=document.createElement('section');section.className='review-capability';section.dataset.capability=capability.id;add(section,'h4',capability.title);add(section,'p',capability.description);for(const sample of capability.samples){const b=document.createElement('button');b.className='review-sample-link';b.type='button';b.dataset.sample=sample.id;b.textContent='サンプル：'+sample.name;b.onclick=()=>openSample(sample.id);section.append(b);}root.append(section);}
 add(root,'h3','できないこと');for(const limitation of content.limitations){const section=document.createElement('section');section.className='review-limitation';add(section,'h4',limitation.title);add(section,'p',limitation.description);add(section,'h5','理由');add(section,'p',limitation.reason);root.append(section);}
}
