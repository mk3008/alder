import {createElement,SquareArrowOutUpRight,ArrowRight,ArrowLeft} from 'lucide';
import {reviewGroups,reviewBoundaries,reviewActivityNames,type ReviewGroup} from './concept-review-fixture';
function add(root:HTMLElement,tag:string,value:string){const el=document.createElement(tag);el.textContent=value;root.append(el);return el;}
function command(root:HTMLElement,label:string,action:()=>void,back=false){const b=document.createElement('button');b.type='button';b.className=back?'review-back':'review-open';b.append(createElement(back?ArrowLeft:SquareArrowOutUpRight,{'aria-hidden':'true','stroke-width':1.8}));add(b,'span',label);b.onclick=action;root.append(b);return b;}
export function renderReviewLandscape(root:HTMLElement,open:(id:string)=>void){
 root.replaceChildren();add(root,'h1','購買業務の全体像');add(root,'p','申請から終結までを、情報を生成・確定する業務とレビューの責任から4つに分けて確認します。');
 const cards=document.createElement('div');cards.className='review-group-grid';root.append(cards);
 for(const [index,group]of reviewGroups.entries()){const card=document.createElement('article');card.className='review-group-card';card.dataset.reviewGroup=group.id;add(card,'span',String(index+1).padStart(2,'0')).className='review-group-number';add(card,'h2',group.name);add(card,'p',group.purpose);add(card,'p','レビュー責任ロール候補：'+group.reviewer).className='review-owner';add(card,'p','主業務：'+reviewActivityNames(group).join('／')).className='review-activities';command(card,'概念モデルを開く',()=>open(group.id)).setAttribute('aria-label',group.name+'の概念モデルを開く');cards.append(card);}
 add(root,'h2','まとまりの間で受け渡す情報');
 const boundaries=document.createElement('ul');boundaries.className='review-boundaries';root.append(boundaries);
 for(const boundary of reviewBoundaries){const li=document.createElement('li'),from=reviewGroups.find(g=>g.id===boundary.from)!,to=reviewGroups.find(g=>g.id===boundary.to)!;const route=document.createElement('div');route.className='review-boundary-route';for(const group of [from,to]){if(group===to)route.append(createElement(ArrowRight,{'aria-hidden':'true'}));const b=document.createElement('button');b.textContent=group.name;b.onclick=()=>open(group.id);route.append(b);}li.append(route);add(li,'strong',boundary.label);add(li,'p',boundary.promise);boundaries.append(li);}
 const note=document.createElement('details');add(note,'summary','範囲と確認事項');add(note,'p','分類はレビューする情報のまとまりです。サブシステムやテーブルの分割を指定しません。責任ロール名は候補で、実際の決定権は未確定です。外部の見積取得・発注管理・基幹マスタの内部構造は対象外です。');root.append(note);command(root,'全概念（詳細）を開く',()=>open('overview'));
}
export function renderReviewHeading(root:HTMLElement,group:ReviewGroup,overview:()=>void){
 root.replaceChildren();command(root,'購買業務の全体像',overview,true);add(root,'h1',group.name);add(root,'p',group.purpose);add(root,'p','レビュー責任ロール候補：'+group.reviewer).className='review-owner';
 const details=document.createElement('details');add(details,'summary','レビュー範囲・受け渡しを確認');const dl=document.createElement('dl');for(const [label,value]of [['主となる業務',reviewActivityNames(group).join('／')],['確認先',group.consult.join('／')],['受け取る情報',group.inputs],['後続への保証',group.guarantee],['確認したいこと',group.question]]){add(dl,'dt',label);add(dl,'dd',value);}details.append(dl);add(details,'p','責任ロール名は候補です。カード右端の別タブ操作は、分類を越えた隣接概念を開きます。');root.append(details);
}
