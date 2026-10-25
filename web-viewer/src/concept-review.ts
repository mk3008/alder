import {contentFor} from './data-examples';
import {createElement,SquareArrowOutUpRight,ArrowRight,ArrowLeft} from 'lucide';
import {reviewGroups,reviewBoundaries,type ReviewGroup} from './concept-review-fixture';
function add(root:HTMLElement,tag:string,value:string){const el=document.createElement(tag);el.textContent=value;root.append(el);return el;}
function command(root:HTMLElement,label:string,action:()=>void,back=false){const b=document.createElement('button');b.type='button';b.className=back?'review-back':'review-open';b.append(createElement(back?ArrowLeft:SquareArrowOutUpRight,{'aria-hidden':'true','stroke-width':1.8}));add(b,'span',label);b.onclick=action;root.append(b);return b;}
export function renderReviewLandscape(root:HTMLElement,open:(id:string)=>void){
 root.replaceChildren();add(root,'h1','購買業務の全体像');add(root,'p','申請から終結まで、各業務で使う情報と生成する情報を4つのレビュー範囲で確認します。');
 const cards=document.createElement('div');cards.className='review-group-grid';root.append(cards);
 for(const [index,group]of reviewGroups.entries()){const card=document.createElement('article');card.className='review-group-card';card.dataset.reviewGroup=group.id;add(card,'span',String(index+1).padStart(2,'0')).className='review-group-number';const content=contentFor(group.id)!;add(card,'h2',content.title);add(card,'p',content.description);add(card,'strong','レビュアー');add(card,'p',content.reviewer.role).className='review-owner';command(card,'データ構造を開く',()=>open(group.id)).setAttribute('aria-label',group.name+'のデータ構造を開く');cards.append(card);}
 add(root,'h2','まとまりの間で受け渡す情報');
 const boundaries=document.createElement('ul');boundaries.className='review-boundaries';root.append(boundaries);
 for(const boundary of reviewBoundaries){const li=document.createElement('li'),from=reviewGroups.find(g=>g.id===boundary.from)!,to=reviewGroups.find(g=>g.id===boundary.to)!;const route=document.createElement('div');route.className='review-boundary-route';for(const group of [from,to]){if(group===to)route.append(createElement(ArrowRight,{'aria-hidden':'true'}));const b=document.createElement('button');b.textContent=group.name;b.onclick=()=>open(group.id);route.append(b);}li.append(route);add(li,'strong',boundary.label);add(li,'p',boundary.promise);boundaries.append(li);}
 const note=document.createElement('details');add(note,'summary','範囲と確認事項');add(note,'p','分類はレビューする情報のまとまりです。サブシステムやテーブルの分割を指定しません。レビュアーは業務設計書に定義された作業者のロールです。外部の見積取得・発注管理・基幹マスタの内部構造は対象外です。');root.append(note);command(root,'全データ（参考関連図）を開く',()=>open('overview'));
}
export function renderReviewHeading(root:HTMLElement,group:ReviewGroup,overview:()=>void){
 root.replaceChildren();command(root,'購買業務の全体像',overview,true);add(root,'h1',contentFor(group.id)?.title??group.name);
}
export function renderReviewOverview(root:HTMLElement,group:ReviewGroup,openSample:(id:string)=>void=()=>{},openActivity:(id:string)=>void=()=>{},activities:{id:string;name:string}[]=[]){
 const content=contentFor(group.id);root.replaceChildren();if(!content)return;
 add(root,'p',content.description).className='review-description';
 add(root,'h3','レビュアー');add(root,'p',content.reviewer.role).className='review-owner';
 add(root,'h3','関連業務');const related=document.createElement('ul');related.className='review-related-activities';for(const activity of content.relatedActivities){const li=document.createElement('li');const target=activities.find(a=>a.id===activity.id&&a.name===activity.name);const b=command(li,activity.name,()=>{if(target)openActivity(target.id);});b.disabled=!target;b.setAttribute('aria-label',activity.name+'を業務タブで開く');b.querySelector('svg')?.setAttribute('data-icon','square-arrow-out-up-right');b.append(b.querySelector('svg')!);related.append(li);}root.append(related);
 add(root,'h3','できること');for(const capability of content.capabilities){const section=document.createElement('section');section.className='review-capability';section.dataset.capability=capability.id;add(section,'h4',capability.title);add(section,'p',capability.description);for(const sample of capability.samples){const b=document.createElement('button');b.className='review-sample-link';b.type='button';b.dataset.sample=sample.id;b.textContent='サンプル：'+sample.name;b.onclick=()=>openSample(sample.id);section.append(b);}root.append(section);}
 add(root,'h3','できないこと');for(const limitation of content.limitations){const section=document.createElement('section');section.className='review-limitation';add(section,'h4',limitation.title);add(section,'p',limitation.description);add(section,'h5','理由');add(section,'p',limitation.reason);root.append(section);}
}
