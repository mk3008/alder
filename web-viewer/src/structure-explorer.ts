import {createElement,Box,ExternalLink,FileText,Link,Search} from 'lucide';
import type {ConceptModel} from './concept-model';

type Mapping={informationId:string;physicalName:string;relationIds:string[];valueType?:string;nullable?:boolean;representation?:string;relationKeyIds?:unknown;sampleValue?:unknown;sampleKind?:string;referenceValue?:unknown};
type RelationField={relationId:string;physicalName:string};
type Relation=ConceptModel['relations'][number];
type Direction='owned'|'reference'|'owner'|'referencedBy'|'unknownOut'|'unknownIn';
type EdgeField={name:string;physicalName:string;valueType?:string};
export type StructureEdge={relation:Relation;from:string;to:string;direction:Direction;count:string;reverseCount:string;fields:string[];visibleFields:string[];fieldDetails:EdgeField[];roleName?:string};
const visibleDirections:Direction[]=['owned','reference','unknownOut'];

/** Read only declared concepts, mappings and relations; never infer a relation from a label. */
export function structureGraph(model:ConceptModel){
 const nodes=new Map(model.concepts.map(concept=>[concept.id,concept]));
 const meta=model.meta&&typeof model.meta==='object'?model.meta as {fieldMappings?:unknown;relationPhysicalFields?:unknown;relationNames?:unknown;conceptNames?:unknown}:{};
 const relationNames=meta.relationNames&&typeof meta.relationNames==='object'&&!Array.isArray(meta.relationNames)?meta.relationNames as Record<string,unknown>:{};
 const conceptNames=meta.conceptNames&&typeof meta.conceptNames==='object'&&!Array.isArray(meta.conceptNames)?meta.conceptNames as Record<string,unknown>:{};
 const mappings:Mapping[]=Array.isArray(meta.fieldMappings)?meta.fieldMappings.filter((m):m is Mapping=>
  !!m&&typeof m==='object'&&typeof m.informationId==='string'&&typeof m.physicalName==='string'&&Array.isArray(m.relationIds)&&m.relationIds.every((id:unknown)=>typeof id==='string')):[];
 const grouped=new Map<string,Mapping[]>();
 for(const mapping of mappings){const list=grouped.get(mapping.informationId)??[];list.push(mapping);grouped.set(mapping.informationId,list);}
 // Duplicate metadata for one information ID is ambiguous; do not select one.
 const byInformation=new Map([...grouped].filter(([,items])=>items.length===1).map(([id,items])=>[id,items[0]]));
 const mappedRelations=(mapping:Mapping)=>mapping.representation==='relationKey'
  ?Array.isArray(mapping.relationKeyIds)&&mapping.relationKeyIds.every((id:unknown)=>typeof id==='string')?mapping.relationKeyIds as string[]:[]
  :mapping.relationIds;
 const groupedRelations=new Map<string,Relation[]>();
 for(const relation of model.relations){const list=groupedRelations.get(relation.id)??[];list.push(relation);groupedRelations.set(relation.id,list);}
 const relationsById=new Map([...groupedRelations].filter(([,items])=>items.length===1).map(([id,items])=>[id,items[0]]));
 const relationKeys=new Set<string>();
 for(const concept of model.concepts)for(const info of concept.information){
  const mapping=byInformation.get(info.id);
  if(mapping?.representation!=='relationKey'||!mappedRelations(mapping).length)continue;
  if(mappedRelations(mapping).every(id=>{const relation=relationsById.get(id);return !!relation&&nodes.has(relation.fromConceptId)&&nodes.has(relation.toConceptId)&&
   ((relation.kind==='reference'&&relation.fromConceptId===concept.id)||(relation.kind==='down'&&(relation.fromConceptId===concept.id||relation.toConceptId===concept.id)));}))relationKeys.add(info.id);
 }
 const relationFields:RelationField[]=Array.isArray(meta.relationPhysicalFields)?meta.relationPhysicalFields.filter((field):field is RelationField=>
  !!field&&typeof field==='object'&&typeof field.relationId==='string'&&typeof field.physicalName==='string'&&!!field.physicalName.trim()):[];
 const edges=new Map<string,StructureEdge[]>();for(const id of nodes.keys())edges.set(id,[]);
 for(const relation of model.relations){
  if(!nodes.has(relation.fromConceptId)||!nodes.has(relation.toConceptId))continue;
  const count=(value:unknown)=>typeof value==='string'&&value.trim()?value:'未定義';
  const fieldDetails=(owner:string):EdgeField[]=>nodes.get(owner)!.information.flatMap(info=>{const m=byInformation.get(info.id);return m&&mappedRelations(m).includes(relation.id)?[{name:info.name,physicalName:m.physicalName,valueType:m.valueType}]:[];});
  const forwardFields=fieldDetails(relation.fromConceptId),reverseFields=fieldDetails(relation.toConceptId);
  const authored=Object.hasOwn(relationNames,relation.id)?relationNames[relation.id]:undefined;
  const roleName=typeof authored==='string'&&authored.trim()?authored.trim():undefined;
  const kind=relation.kind as string;
  // For ownership, an FK can be stored on the child even though the visible
  // relationship runs from parent to child. Keep that path on the visible row.
  const childKeys=kind==='down'?nodes.get(relation.toConceptId)!.information.flatMap(info=>{
   const mapping=byInformation.get(info.id);return relationKeys.has(info.id)&&mapping&&mappedRelations(mapping).includes(relation.id)?[mapping.physicalName]:[];
  }):[];
  const forwardKeys=nodes.get(relation.fromConceptId)!.information.flatMap(info=>{
   const mapping=byInformation.get(info.id);return relationKeys.has(info.id)&&mapping&&mappedRelations(mapping).includes(relation.id)?[mapping.physicalName]:[];
  });
  const declaredKeys=relationFields.filter(field=>field.relationId===relation.id).map(field=>field.physicalName);
  const physicalNames=[...new Set([...forwardFields.map(field=>field.physicalName),...childKeys,...declaredKeys])];
  const keyNames=new Set([...forwardKeys,...childKeys,...declaredKeys]);
  const unmarkedNames=new Set(nodes.get(relation.fromConceptId)!.information.flatMap(info=>{
   const mapping=byInformation.get(info.id);return !relationKeys.has(info.id)&&mapping&&mappedRelations(mapping).includes(relation.id)?[mapping.physicalName]:[];
  }));
  const visibleFields=physicalNames.filter(name=>!keyNames.has(name)||unmarkedNames.has(name));
  edges.get(relation.fromConceptId)!.push({relation,from:relation.fromConceptId,to:relation.toConceptId,
   direction:kind==='down'?'owned':kind==='reference'?'reference':'unknownOut',count:count(relation.toLabel),reverseCount:count(relation.fromLabel),fields:physicalNames,visibleFields,fieldDetails:forwardFields,roleName});
  edges.get(relation.toConceptId)!.push({relation,from:relation.toConceptId,to:relation.fromConceptId,
   direction:kind==='down'?'owner':kind==='reference'?'referencedBy':'unknownIn',count:count(relation.fromLabel),reverseCount:count(relation.toLabel),fields:reverseFields.map(field=>field.physicalName),visibleFields:reverseFields.map(field=>field.physicalName),fieldDetails:reverseFields});
 }
 // Select a package only when its explicit mappings describe the package and
 // documents relationship. A logical entity root is not a JSON package root.
 const owned=new Set(model.relations.filter(r=>r.kind==='down'&&nodes.has(r.fromConceptId)&&nodes.has(r.toConceptId)).map(r=>r.toConceptId));
 const ownershipRoots=model.concepts.filter(concept=>!owned.has(concept.id));
 const packages=ownershipRoots.filter(concept=>{
  const fields=concept.information.map(info=>byInformation.get(info.id)).filter((value):value is Mapping=>!!value);
  const docs=fields.find(field=>field.physicalName==='documents[]'&&field.valueType==='array');
  return fields.some(field=>field.physicalName==='format')&&fields.some(field=>/^formatVersion(?:\s*:.*)?$/.test(field.physicalName))&&
   fields.some(field=>field.physicalName==='revision')&&!!docs&&docs.relationIds.some(id=>model.relations.some(r=>r.id===id&&r.kind==='down'&&r.fromConceptId===concept.id));
 });
 const packageRoot=packages.length===1?packages[0].id:undefined;
 const roots=packageRoot?[packageRoot]:(ownershipRoots.length?ownershipRoots:model.concepts).map(concept=>concept.id);
 const reachable=new Set<string>(),todo=[...roots];while(todo.length){const id=todo.pop()!;if(reachable.has(id))continue;reachable.add(id);for(const edge of edges.get(id)??[])if(visibleDirections.includes(edge.direction)&&!reachable.has(edge.to))todo.push(edge.to);}
 return {nodes,edges,mappings:byInformation,relationKeys,conceptNames,packageRoot,roots,hasOwnershipRoots:ownershipRoots.length>0,reachable};
}

const labels:Record<Direction,string>={owned:'所有',reference:'参照',owner:'所有先',referencedBy:'参照元',unknownOut:'種類未定義（出）',unknownIn:'種類未定義（入）'};
const icon=(which:typeof Box,label?:string)=>{const svg=createElement(which,{'aria-hidden':'true','stroke-width':1.8});svg.classList.add('structure-icon');if(label){svg.removeAttribute('aria-hidden');svg.setAttribute('role','img');svg.setAttribute('aria-label',label);const title=document.createElementNS('http://www.w3.org/2000/svg','title');title.textContent=label;svg.prepend(title);}return svg;};
const text=(root:HTMLElement,tag:string,value:string,className?:string)=>{const el=document.createElement(tag);el.textContent=value;if(className)el.className=className;root.append(el);return el;};
const shortPhysicalName=(path:string)=>path.split(' / ').map(part=>part.trim().split('.').pop()??part).join(' / ');
function typeLabel(mapping:Mapping|undefined){
 const value=typeof mapping?.valueType==='string'&&mapping.valueType.trim()?mapping.valueType:'未定義';
 return value+(mapping?.nullable===true?'・未決可':'');
}
function sampleLabels(mapping:Mapping|undefined){
 if(!mapping)return [];
 const labels:string[]=[];
 const add=(value:unknown,prefix:string)=>{const sample=typeof value==='string'?(value||'""'):JSON.stringify(value);if(sample!==undefined)labels.push(prefix+sample);};
 if(Object.hasOwn(mapping,'sampleValue'))add(mapping.sampleValue,mapping.sampleKind==='reference'?'参考例：':'例：');
 if(Object.hasOwn(mapping,'referenceValue'))add(mapping.referenceValue,'参考例：');
 return labels;
}

/** The DOM is lazy per path. A full expansion visits each concept once. */
export function renderStructureExplorer(host:HTMLElement,model:ConceptModel,options:{rootId?:string;openStructure?:(id:string)=>void}={}){
 const graph=structureGraph(model);host.replaceChildren();host.className='structure-explorer';
 if(!graph.roots.length){text(host,'p','この構造モデルには概念がありません。','structure-empty');return;}
 if(options.rootId&&!graph.nodes.has(options.rootId)){text(host,'p','指定した構造が見つかりません。','structure-empty');return;}
 const roots=options.rootId?[options.rootId]:graph.roots;
 const panel=document.createElement('section');panel.className='structure-panel';host.append(panel);
 const toolbar=document.createElement('div');toolbar.className='structure-toolbar';panel.append(toolbar);
 const all=document.createElement('button');all.type='button';all.textContent='すべて展開';toolbar.append(all);
 const collapse=document.createElement('button');collapse.type='button';collapse.textContent='すべて折りたたみ';toolbar.append(collapse);
 const searchLabel=document.createElement('label');searchLabel.className='structure-search';searchLabel.append(icon(Search));
 const search=document.createElement('input');search.type='search';search.placeholder='構造名・項目名で検索';search.setAttribute('aria-label','構造名・項目名で検索');searchLabel.append(search);toolbar.append(searchLabel);
 if(!options.rootId&&!graph.packageRoot&&!graph.hasOwnershipRoots)text(panel,'p','JSON全体のルートと所有関係の起点を特定できないため、すべての構造を表示します。','structure-unreachable');
 const unreachable=[...graph.nodes.keys()].filter(id=>!graph.reachable.has(id));
 if(!options.rootId&&unreachable.length)text(panel,'p',`この起点からたどれない構造：${unreachable.length}件`,'structure-unreachable');
 const tree=document.createElement('div');tree.className='structure-tree';tree.setAttribute('aria-label','構造のツリー');panel.append(tree);
 let savedTree:Node|null=null;

 const buildNode=(id:string,path:ReadonlySet<string>,edge?:StructureEdge,seen?:Set<string>):HTMLLIElement=>{
  const concept=graph.nodes.get(id)!;const item=document.createElement('li');item.className='structure-item';item.dataset.conceptId=id;
  const authored=Object.hasOwn(graph.conceptNames,id)?graph.conceptNames[id]:undefined;
  const declared=authored&&typeof authored==='object'&&!Array.isArray(authored)?authored as {typeName?:unknown;logicalName?:unknown}:{};
  const hasType=typeof declared.typeName==='string'&&!!declared.typeName.trim();
  const typeName=hasType?declared.typeName as string:concept.name;
  const logicalName=hasType&&typeof declared.logicalName==='string'&&declared.logicalName.trim()?declared.logicalName:'';
  const names=concept.information.flatMap(info=>[info.name,graph.mappings.get(info.id)?.physicalName??'']);
  item.dataset.searchText=[concept.name,typeName,logicalName,concept.id,...names,edge?.roleName??'',...(edge?.fieldDetails.flatMap(field=>[field.name,field.physicalName])??[]),...(edge?.fields??[]),edge?.relation.condition??''].join(' ').toLocaleLowerCase();
  if(edge){item.dataset.relationId=edge.relation.id;item.dataset.relationDirection=edge.direction;}
  const cycle=path.has(id),visited=!!seen?.has(id),row=document.createElement('summary');
  row.className='structure-node-row';row.append(icon(edge?.direction==='reference'?Link:Box,edge?labels[edge.direction]:'構造'));
  if(edge){if(edge.direction==='unknownOut')text(row,'span',labels[edge.direction],'structure-type');text(row,'span',edge.count,'structure-count');row.title=`${labels[edge.direction]}：${edge.relation.id}：移動先 ${edge.count}／反対側 ${edge.reverseCount}${edge.relation.condition?' — '+edge.relation.condition:''}${edge.fields.length>edge.visibleFields.length?' — 物理項目：'+edge.fields.join('、'):''}`;}
  if(edge){
   const fields=edge.fieldDetails.length?edge.fieldDetails:[undefined];
   const entry=(name:string,field:EdgeField|undefined)=>{const label=document.createElement('span');label.className='structure-element';row.append(label);text(label,'strong',name);text(label,'span','型：'+typeName+(field?.valueType==='array'?'[]':''),'structure-element-type');};
   if(edge.roleName&&fields.length===1)entry(edge.roleName,fields[0]);
   else{if(edge.roleName)entry(edge.roleName,undefined);fields.forEach((field,index)=>{if(index||edge.roleName)text(row,'span','／');entry(field?.name?.trim()||'名前未定義',field);});}
  }else{ text(row,'strong',typeName);if(logicalName&&logicalName!==typeName)text(row,'span',logicalName,'structure-type'); }
  if(options.openStructure&&id!==options.rootId){const open=document.createElement('button');open.type='button';open.className='structure-open';open.setAttribute('aria-label',concept.name+'の構造を別タブで開く');open.title='構造を別タブで開く';open.append(icon(ExternalLink));open.onclick=event=>{event.preventDefault();event.stopPropagation();options.openStructure!(id);};row.append(open);}
  if(edge?.relation.condition)text(row,'span',edge.relation.condition,'structure-condition');
  if(edge?.visibleFields.length){const detail=text(row,'span',edge.visibleFields.map(shortPhysicalName).join('、'),'structure-edge-detail');detail.title=edge.visibleFields.join('、');}
  if(cycle||visited)text(row,'span','既出','structure-seen');
  const details=document.createElement('details');details.className='structure-node';details.append(row);item.append(details);
  let built=false;const nextPath=new Set(path);nextPath.add(id);
  const build=(expand?:Set<string>)=>{if(built)return;built=true;
   const children=document.createElement('ul');children.className='structure-children';details.append(children);
   for(const info of concept.information){if(graph.relationKeys.has(info.id))continue;const field=document.createElement('li'),mapping=graph.mappings.get(info.id);field.className='structure-field';field.dataset.entryKind='attribute';field.dataset.searchText=[info.name,info.id,mapping?.physicalName??''].join(' ').toLocaleLowerCase();field.append(icon(FileText,'属性'));text(field,'span',info.name);text(field,'span','型：'+typeLabel(mapping),'structure-type');if(mapping?.physicalName)text(field,'code',mapping.physicalName);for(const sample of sampleLabels(mapping)){const example=text(field,'span',sample,'structure-example');example.title=sample;}children.append(field);}
   for(const direction of visibleDirections){const outgoing=(graph.edges.get(id)??[]).filter(rel=>rel.direction===direction);if(!outgoing.length)continue;
    for(const relation of outgoing)children.append(buildNode(relation.to,nextPath,relation,expand));
   }
  };
  details.addEventListener('toggle',()=>{if(details.open)build();});
  if(seen&&!visited&&!cycle){seen.add(id);details.open=true;build(seen);}
  return item;
 };
 const render=(expand:boolean)=>{const ul=document.createElement('ul');ul.className='structure-root';const seen=expand?new Set<string>():undefined;for(const id of roots)ul.append(buildNode(id,new Set(),undefined,seen));tree.replaceChildren(ul);if(!expand){const first=ul.querySelector<HTMLDetailsElement>('.structure-node')!;first.open=true;first.dispatchEvent(new Event('toggle'));}};
 const filter=()=>{const query=search.value.trim().toLocaleLowerCase();
  if(query&&!savedTree){savedTree=tree.firstChild;render(true);}else if(!query&&savedTree){tree.replaceChildren(savedTree);savedTree=null;return;}
  const items=Array.from(tree.querySelectorAll<HTMLElement>('[data-search-text]')).reverse();
  for(const item of items){const own=(item.dataset.searchText??'').includes(query),descendant=Array.from(item.querySelectorAll<HTMLElement>('[data-search-text]')).some(child=>!child.hidden);item.hidden=!!query&&!own&&!descendant;}
 };
 all.onclick=()=>{savedTree=null;search.value='';render(true);};collapse.onclick=()=>{savedTree=null;search.value='';render(false);const first=tree.querySelector<HTMLDetailsElement>('.structure-node');if(first)first.open=false;};search.oninput=filter;
 render(false);
}
