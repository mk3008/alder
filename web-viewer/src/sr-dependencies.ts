import type {Design} from './graph';
/** Only declared contracts; Scope, icon and Medium never imply a dependency. */
export function dependencyDetails(design:Design,id:string){
 const node=design.graph.nodes.find(n=>n.id===id&&n.type==='object'),contracts=design.objectSRDependencies?.[id];
 if(!node||!contracts?.length)return undefined;
 const related=new Set(design.graph.relations.filter(r=>(r.kind==='input'&&r.from===id)||(r.kind==='output'&&r.to===id)).map(r=>r.kind==='input'?r.to:r.from));
 return {contracts,information:node.information as string[],activities:design.graph.nodes.filter(n=>n.type==='business'&&related.has(n.id)).map(n=>({id:n.id,name:n.name})),verification:{status:'unmatched' as const}};
}
export function dependencyPanel(design:Design,id:string,navigate:(id:string)=>void):HTMLElement|undefined{
 const data=dependencyDetails(design,id);if(!data)return undefined;
 const root=document.createElement('section');root.className='sr-dependency-panel';root.setAttribute('aria-label','SR依存の詳細');
 const heading=document.createElement('h2');heading.id='sr-dependency-heading';heading.tabIndex=-1;heading.textContent='SR依存';root.append(heading);
 const status=document.createElement('p');status.className='sr-verification';status.textContent='SR照合状況：未照合';root.append(status);
 const note=document.createElement('p');note.textContent='SRは読み込まれていないため、仕様の提供有無や不足は判定していません。';root.append(note);
 const list=(title:string,values:string[])=>{const h=document.createElement('h3');h.textContent=title;root.append(h);const ul=document.createElement('ul');for(const value of values){const li=document.createElement('li');li.textContent=value;ul.append(li);}root.append(ul);};
 list('必要な外部契約の種類',data.contracts);list('必要な業務情報',data.information);
 const h=document.createElement('h3');h.textContent='関連するActivity';root.append(h);const ul=document.createElement('ul');for(const activity of data.activities){const li=document.createElement('li'),button=document.createElement('button');button.type='button';button.textContent=activity.name;button.onclick=()=>navigate(activity.id);li.append(button);ul.append(li);}root.append(ul);if(!data.activities.length){const p=document.createElement('p');p.textContent='この業務設計書には関連する入出力がありません。';root.append(p);}return root;
}
