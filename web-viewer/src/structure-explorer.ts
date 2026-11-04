import {createElement,Box,FileText,Folder,Link,Search} from 'lucide';
import type {ConceptModel} from './concept-model';

type Mapping={informationId:string;physicalName:string;relationIds:string[];valueType?:string;nullable?:boolean};
type Relation=ConceptModel['relations'][number];
type Direction='owned'|'reference'|'owner'|'referencedBy'|'unknownOut'|'unknownIn';
export type StructureEdge={relation:Relation;from:string;to:string;direction:Direction;count:string;reverseCount:string;fields:string[]};

/** Read only declared concepts, mappings and relations; never infer a relation from a label. */
export function structureGraph(model:ConceptModel){
 const nodes=new Map(model.concepts.map(concept=>[concept.id,concept]));
 const meta=model.meta&&typeof model.meta==='object'?model.meta as {fieldMappings?:unknown}:{};
 const mappings:Mapping[]=Array.isArray(meta.fieldMappings)?meta.fieldMappings.filter((m):m is Mapping=>
  !!m&&typeof m==='object'&&typeof m.informationId==='string'&&typeof m.physicalName==='string'&&Array.isArray(m.relationIds)&&m.relationIds.every((id:unknown)=>typeof id==='string')):[];
 const grouped=new Map<string,Mapping[]>();
 for(const mapping of mappings){const list=grouped.get(mapping.informationId)??[];list.push(mapping);grouped.set(mapping.informationId,list);}
 // Duplicate metadata for one information ID is ambiguous; do not select one.
 const byInformation=new Map([...grouped].filter(([,items])=>items.length===1).map(([id,items])=>[id,items[0]]));
 // The candidate explicitly maps the Activity identifier to activities.id.
 // An unrelated name, ID, or a non-unique mapping is not a type declaration.
 const activityMappings=mappings.filter(mapping=>mapping.physicalName==='activities.id');
 const roots=activityMappings.length===1&&grouped.get(activityMappings[0].informationId)?.length===1
  ?model.concepts.filter(concept=>concept.information.some(info=>info.id===activityMappings[0].informationId)):[];
 const root=roots.length===1?roots[0].id:undefined;
 const edges=new Map<string,StructureEdge[]>();for(const id of nodes.keys())edges.set(id,[]);
 for(const relation of model.relations){
  if(!nodes.has(relation.fromConceptId)||!nodes.has(relation.toConceptId))continue;
  const count=(value:unknown)=>typeof value==='string'&&value.trim()?value:'未定義';
  const fields=(owner:string)=>nodes.get(owner)!.information.flatMap(info=>{const m=byInformation.get(info.id);return m?.relationIds.includes(relation.id)?[m.physicalName]:[];});
  const kind=relation.kind as string;
  edges.get(relation.fromConceptId)!.push({relation,from:relation.fromConceptId,to:relation.toConceptId,
   direction:kind==='down'?'owned':kind==='reference'?'reference':'unknownOut',count:count(relation.toLabel),reverseCount:count(relation.fromLabel),fields:fields(relation.fromConceptId)});
  edges.get(relation.toConceptId)!.push({relation,from:relation.toConceptId,to:relation.fromConceptId,
   direction:kind==='down'?'owner':kind==='reference'?'referencedBy':'unknownIn',count:count(relation.fromLabel),reverseCount:count(relation.toLabel),fields:fields(relation.toConceptId)});
 }
 const reachable=new Set<string>();if(root){const todo=[root];while(todo.length){const id=todo.pop()!;if(reachable.has(id))continue;reachable.add(id);for(const edge of edges.get(id)??[])if(!reachable.has(edge.to))todo.push(edge.to);}}
 return {nodes,edges,mappings:byInformation,root,reachable};
}

const labels:Record<Direction,string>={owned:'所有関係',reference:'参照関係',owner:'所有元',referencedBy:'参照元',unknownOut:'種類未定義（出）',unknownIn:'種類未定義（入）'};
const directions:Direction[]=['owned','reference','owner','referencedBy','unknownOut','unknownIn'];
const icon=(which:typeof Box)=>{const svg=createElement(which,{'aria-hidden':'true','stroke-width':1.8});svg.classList.add('structure-icon');return svg;};
const text=(root:HTMLElement,tag:string,value:string,className?:string)=>{const el=document.createElement(tag);el.textContent=value;if(className)el.className=className;root.append(el);return el;};
function typeLabel(mapping:Mapping|undefined){
 const value=typeof mapping?.valueType==='string'&&mapping.valueType.trim()?mapping.valueType:'未定義';
 return value+(mapping?.nullable===true?'・未決可':'');
}

/** The DOM is lazy per path. A full expansion visits each concept once. */
export function renderStructureExplorer(host:HTMLElement,model:ConceptModel){
 const graph=structureGraph(model);host.replaceChildren();host.className='structure-explorer';
 const heading=document.createElement('div');heading.className='structure-heading';
 const title=document.createElement('div');title.append(icon(Box));text(title,'h2','構造エクスプローラー');heading.append(title);host.append(heading);
 text(host,'p','ツリーの階層は探索経路です。所有・参照と多重度は記録された関係を示します。','structure-intro');
 if(!graph.root){text(host,'p','Activityの構造を一意に特定できません。明示された対応が必要です。','structure-empty');return;}
 const rootId=graph.root;
 const workspace=document.createElement('div');workspace.className='structure-workspace';host.append(workspace);
 const panel=document.createElement('section');panel.className='structure-panel';workspace.append(panel);
 const toolbar=document.createElement('div');toolbar.className='structure-toolbar';panel.append(toolbar);
 const all=document.createElement('button');all.type='button';all.textContent='すべて展開';toolbar.append(all);
 const collapse=document.createElement('button');collapse.type='button';collapse.textContent='すべて折りたたみ';toolbar.append(collapse);
 const searchLabel=document.createElement('label');searchLabel.className='structure-search';searchLabel.append(icon(Search));
 const search=document.createElement('input');search.type='search';search.placeholder='構造名・項目名で検索';search.setAttribute('aria-label','構造名・項目名で検索');searchLabel.append(search);toolbar.append(searchLabel);
 const tree=document.createElement('div');tree.className='structure-tree';tree.setAttribute('aria-label','構造のツリー');panel.append(tree);
 const aside=document.createElement('section');aside.className='structure-help';workspace.append(aside);
 const guide=document.createElement('div');guide.className='structure-help-card';aside.append(guide);text(guide,'h3','表示ルール');
 const list=document.createElement('ul');guide.append(list);
 for(const item of ['階層は探索経路です。','所有関係・所有元は包含の両方向です。','参照関係・参照元は参照の両方向です。','件数は移動先、括弧内は反対側です。','既出は同じ構造です。循環はそこで止まります。','記載のない属性の型は「未定義」です。'])text(list,'li',item);
 const unreachable=[...graph.nodes.keys()].filter(id=>!graph.reachable.has(id));
 if(unreachable.length)text(guide,'p',`この起点からたどれない構造：${unreachable.length}件`,'structure-unreachable');
 let savedTree:Node|null=null;

 const buildNode=(id:string,path:ReadonlySet<string>,edge?:StructureEdge,seen?:Set<string>):HTMLLIElement=>{
  const concept=graph.nodes.get(id)!;const item=document.createElement('li');item.className='structure-item';item.dataset.conceptId=id;
  const names=concept.information.flatMap(info=>[info.name,graph.mappings.get(info.id)?.physicalName??'']);
  item.dataset.searchText=[concept.name,concept.id,...names,edge?.relation.condition??''].join(' ').toLocaleLowerCase();
  if(edge){item.dataset.relationId=edge.relation.id;item.dataset.relationDirection=edge.direction;}
  const cycle=path.has(id),visited=!!seen?.has(id),row=cycle?document.createElement('div'):document.createElement('summary');
  row.className='structure-node-row';row.append(icon(Box));
  if(edge){text(row,'span',edge.count,'structure-count');row.title=`${edge.relation.id}：移動先 ${edge.count}／反対側 ${edge.reverseCount}${edge.relation.condition?' — '+edge.relation.condition:''}`;}
  text(row,'strong',concept.name);text(row,'span',concept.id,'structure-id');
  if(edge){text(row,'span',`逆 ${edge.reverseCount}`,'structure-reverse');
   const allEdges=graph.edges.get(edge.from)??[],parallel=allEdges.filter(other=>other.to===edge.to&&other.direction===edge.direction).length>1;
   const detail=edge.fields.join('、')||(parallel?edge.relation.condition:'');if(detail)text(row,'span',detail,'structure-edge-detail');
  }
  if(cycle||visited)text(row,'span','既出','structure-seen');
  if(cycle){row.setAttribute('aria-label',concept.name+'、既出のため展開しません');item.append(row);return item;}
  const details=document.createElement('details');details.className='structure-node';details.append(row);item.append(details);
  let built=false;const nextPath=new Set(path);nextPath.add(id);
  const build=(expand?:Set<string>)=>{if(built)return;built=true;
   if(edge?.relation.condition)text(details,'p',edge.relation.condition,'structure-condition');
   const children=document.createElement('ul');children.className='structure-children';details.append(children);
   if(concept.information.length){const li=document.createElement('li'),folder=document.createElement('details'),summary=document.createElement('summary');folder.className='structure-group';folder.open=true;summary.append(icon(Folder));text(summary,'span','属性');folder.append(summary);li.append(folder);children.append(li);
    const fields=document.createElement('ul');fields.className='structure-fields';folder.append(fields);
    for(const info of concept.information){const field=document.createElement('li'),mapping=graph.mappings.get(info.id);field.className='structure-field';field.dataset.searchText=[info.name,info.id,mapping?.physicalName??''].join(' ').toLocaleLowerCase();field.append(icon(FileText));text(field,'span',info.name);if(mapping?.physicalName)text(field,'code',mapping.physicalName);text(field,'span','型：'+typeLabel(mapping),'structure-type');fields.append(field);}
   }
   for(const direction of directions){const outgoing=(graph.edges.get(id)??[]).filter(rel=>rel.direction===direction);if(!outgoing.length)continue;
    const li=document.createElement('li'),folder=document.createElement('details'),summary=document.createElement('summary');folder.className='structure-group';folder.open=true;summary.append(icon(direction==='reference'||direction==='referencedBy'?Link:Folder));text(summary,'span',labels[direction]);folder.append(summary);li.append(folder);children.append(li);
    const targets=document.createElement('ul');targets.className='structure-children';folder.append(targets);
    for(const relation of outgoing)targets.append(buildNode(relation.to,nextPath,relation,expand));
   }
  };
  details.addEventListener('toggle',()=>{if(details.open)build();});
  if(seen&&!visited){seen.add(id);details.open=true;build(seen);}
  return item;
 };
 const render=(expand:boolean)=>{const ul=document.createElement('ul');ul.className='structure-root';ul.append(buildNode(rootId,new Set(),undefined,expand?new Set():undefined));tree.replaceChildren(ul);if(!expand){const first=ul.querySelector<HTMLDetailsElement>('.structure-node')!;first.open=true;first.dispatchEvent(new Event('toggle'));}};
 const filter=()=>{const query=search.value.trim().toLocaleLowerCase();
  if(query&&!savedTree){savedTree=tree.firstChild;render(true);}else if(!query&&savedTree){tree.replaceChildren(savedTree);savedTree=null;return;}
  const items=Array.from(tree.querySelectorAll<HTMLElement>('[data-search-text]')).reverse();
  for(const item of items){const own=(item.dataset.searchText??'').includes(query),descendant=Array.from(item.querySelectorAll<HTMLElement>('[data-search-text]')).some(child=>!child.hidden);item.hidden=!!query&&!own&&!descendant;}
 };
 all.onclick=()=>{savedTree=null;search.value='';render(true);};collapse.onclick=()=>{savedTree=null;search.value='';render(false);const first=tree.querySelector<HTMLDetailsElement>('.structure-node');if(first)first.open=false;};search.oninput=filter;
 render(false);
}
