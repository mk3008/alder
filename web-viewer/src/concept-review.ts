import {contentFor} from './data-examples';
import {createElement,SquareArrowOutUpRight,ArrowLeft} from 'lucide';
import {type ReviewGroup} from './concept-review-fixture';
function add(root:HTMLElement,tag:string,value:string){const el=document.createElement(tag);el.textContent=value;root.append(el);return el;}
function command(root:HTMLElement,label:string,action:()=>void,back=false){const b=document.createElement('button');b.type='button';b.className=back?'review-back':'review-open';b.append(createElement(back?ArrowLeft:SquareArrowOutUpRight,{'aria-hidden':'true','stroke-width':1.8}));add(b,'span',label);b.onclick=action;root.append(b);return b;}
export type LandscapeMode='overview'|'graph';
export function renderReviewLandscape(root:HTMLElement,canvas:HTMLElement|undefined,mode:LandscapeMode='overview'){
 root.replaceChildren();add(root,'h1',mode==='overview'?'全体図':'概念相関図');root.dataset.mode=mode;
 if(mode==='overview'&&canvas){const content=document.createElement('div');content.className='landscape-overview';content.append(canvas);root.append(content);}

}
export function renderReviewHeading(root:HTMLElement,group:ReviewGroup,overview:()=>void){
 root.replaceChildren();command(root,'全体図',overview,true);add(root,'h1',contentFor(group.id)?.title??group.name);
}
export function renderReviewOverview(root:HTMLElement,group:ReviewGroup,openSample:(id:string)=>void=()=>{},openActivity:(id:string)=>void=()=>{},activities:{id:string;name:string}[]=[]){
 const content=contentFor(group.id);root.replaceChildren();if(!content)return;
 add(root,'p',content.description).className='review-description';
 add(root,'h3','レビュアー');add(root,'p',content.reviewer.role).className='review-owner';
 add(root,'h3','関連業務');const related=document.createElement('ul');related.className='review-related-activities';for(const activity of content.relatedActivities){const li=document.createElement('li');const target=activities.find(a=>a.id===activity.id&&a.name===activity.name);const b=command(li,activity.name,()=>{if(target)openActivity(target.id);});b.disabled=!target;b.setAttribute('aria-label',activity.name+'を業務タブで開く');b.querySelector('svg')?.setAttribute('data-icon','square-arrow-out-up-right');b.append(b.querySelector('svg')!);related.append(li);}root.append(related);
 add(root,'h3','情報の構造');for(const statement of content.structureStatements){const section=document.createElement('section');section.className='review-structure';section.dataset.structure=statement.id;add(section,'h4',statement.title);add(section,'p',statement.description);root.append(section);}
 add(root,'h3','できること');for(const capability of content.capabilities){const section=document.createElement('section');section.className='review-capability';section.dataset.capability=capability.id;add(section,'h4',capability.title);add(section,'p',capability.description);for(const sample of capability.samples){const b=document.createElement('button');b.className='review-sample-link';b.type='button';b.dataset.sample=sample.id;b.textContent='サンプル：'+sample.name;b.onclick=()=>openSample(sample.id);section.append(b);}root.append(section);}
 add(root,'h3','できないこと（業務上のルール）');for(const limitation of content.limitations){const section=document.createElement('section');section.className='review-limitation';add(section,'h4',limitation.title);add(section,'p',limitation.description);add(section,'h5','理由');add(section,'p',limitation.reason);root.append(section);}
}
