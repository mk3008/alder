import {createElement,Box,Link,Search} from 'lucide';
import type {ConceptModel} from './concept-model';

type ValueDomain={kind?:unknown;values?:unknown;note?:unknown};
type Mapping={informationId:string;physicalName:string;relationIds:string[];valueType?:string;valueDomain?:ValueDomain;nullable?:boolean|null;nullableReason?:string;nullableStatus?:string;optional?:boolean;sourceSchemaPath?:string;logicalSourcePaths?:string[];logicalMeaning?:string;logicalPurpose?:string;representation?:string;relationKeyIds?:unknown;sampleValue?:unknown;sampleKind?:string;referenceValue?:unknown;referenceSource?:string};
type RelationField={relationId:string;physicalName:string};
type Relation=ConceptModel['relations'][number];
type Direction='owned'|'reference'|'owner'|'referencedBy'|'unknownOut'|'unknownIn';
type ReviewMark={kind:'legacy'|'needs-review';reason:string};
type EdgeField={name:string;physicalName:string;valueType?:string};
export type StructureEdge={relation:Relation;from:string;to:string;direction:Direction;count:string;reverseCount:string;fields:string[];visibleFields:string[];fieldDetails:EdgeField[];roleName?:string};
type StructureClassSelection={kind:'structure';conceptId:string;fromId?:string;relationId?:string;hideLegacy?:boolean};
type StructureAttributeSelection={kind:'attribute';conceptId:string;informationId:string;hideLegacy?:boolean;returnTo?:StructureClassSelection};
export type StructureSelection=StructureClassSelection|StructureAttributeSelection;
const visibleDirections:Direction[]=['owned','reference','unknownOut'];

// Only model-authored classifications are used. A name, version or missing
// classification cannot establish that an item is current or legacy.
function reviewMarks(model:ConceptModel){
 const meta=model.meta&&typeof model.meta==='object'&&!Array.isArray(model.meta)?model.meta as {compatibilityReview?:unknown}:{};
 const catalog=meta.compatibilityReview&&typeof meta.compatibilityReview==='object'&&!Array.isArray(meta.compatibilityReview)?meta.compatibilityReview as Record<string,unknown>:{};
 const get=(group:string,id:string):ReviewMark|undefined=>{
  const entries=catalog[group];if(!entries||typeof entries!=='object'||Array.isArray(entries))return;
  const value=(entries as Record<string,unknown>)[id];if(!value||typeof value!=='object'||Array.isArray(value))return;
  const mark=value as {kind?:unknown;reason?:unknown};
  return (mark.kind==='legacy'||mark.kind==='needs-review')&&typeof mark.reason==='string'&&!!mark.reason.trim()?{kind:mark.kind,reason:mark.reason}:undefined;
 };
 return {concept:(id:string)=>get('concepts',id),field:(id:string,owner:string)=>get('fields',id)??get('concepts',owner),relation:(id:string,target:string)=>get('relations',id)??get('concepts',target)};
}
const reviewLabel=(mark:ReviewMark)=>mark.kind==='legacy'?'互換・移行用':'要確認';

/** Read only declared concepts, mappings and relations; never infer a relation from a label. */
export function structureGraph(model:ConceptModel){
 const nodes=new Map(model.concepts.map(concept=>[concept.id,concept]));
 const meta=model.meta&&typeof model.meta==='object'?model.meta as {fieldMappings?:unknown;relationPhysicalFields?:unknown;relationNames?:unknown;reverseRelationNames?:unknown;conceptNames?:unknown}:{};
 const relationNames=meta.relationNames&&typeof meta.relationNames==='object'&&!Array.isArray(meta.relationNames)?meta.relationNames as Record<string,unknown>:{};
 const reverseRelationNames=meta.reverseRelationNames&&typeof meta.reverseRelationNames==='object'&&!Array.isArray(meta.reverseRelationNames)?meta.reverseRelationNames as Record<string,unknown>:{};
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
  const reverseAuthored=Object.hasOwn(reverseRelationNames,relation.id)?reverseRelationNames[relation.id]:undefined;
  const reverseRoleName=typeof reverseAuthored==='string'&&reverseAuthored.trim()?reverseAuthored.trim():undefined;
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
   direction:kind==='down'?'owner':kind==='reference'?'referencedBy':'unknownIn',count:count(relation.fromLabel),reverseCount:count(relation.toLabel),fields:reverseFields.map(field=>field.physicalName),visibleFields:reverseFields.map(field=>field.physicalName),fieldDetails:reverseFields,...(kind==='down'&&reverseRoleName?{roleName:reverseRoleName}:{})});
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

const labels:Record<Direction,string>={owned:'所有',reference:'参照',owner:'所属先',referencedBy:'参照元',unknownOut:'種類未定義（出）',unknownIn:'種類未定義（入）'};
const icon=(which:typeof Box,label?:string)=>{const svg=createElement(which,{'aria-hidden':'true','stroke-width':1.8});svg.classList.add('structure-icon');if(label){svg.removeAttribute('aria-hidden');svg.setAttribute('role','img');svg.setAttribute('aria-label',label);const title=document.createElementNS('http://www.w3.org/2000/svg','title');title.textContent=label;svg.prepend(title);}return svg;};
const text=(root:HTMLElement,tag:string,value:string,className?:string)=>{const el=document.createElement(tag);el.textContent=value;if(className)el.className=className;root.append(el);return el;};
const markReview=(row:HTMLElement,mark:ReviewMark|undefined)=>{if(!mark)return;row.classList.add('structure-review-'+mark.kind);text(row,'span',reviewLabel(mark),'structure-review-badge');};
const shortPhysicalName=(path:string)=>path.split(' / ').map(part=>part.trim().split('.').pop()??part).join(' / ');
function typeLabel(mapping:Mapping|undefined){
 const domain=mapping?.valueDomain,kind=domain?.kind;
 const values=domainValues(mapping);
 if((kind==='enum'||kind==='fixed')&&values.length)return values.map(value=>value.literal).join(' | ');
 const semanticTypes:Record<string,string>={identifier:'識別子',version:'版・改訂',reference:'参照',referenceType:'参照先の種類',hash:'SHA-256',uri:'URI',cardinality:'多重度'};
 if(typeof kind==='string'&&semanticTypes[kind])return semanticTypes[kind];
 const value=typeof mapping?.valueType==='string'&&mapping.valueType.trim()?mapping.valueType:'未定義';
 return mapping?.nullableStatus==='proposal'?value.split('|').map(part=>part.trim()).filter(part=>part!=='null').join(' | ')||'未定義':value;
}
function domainValues(mapping:Mapping|undefined){
 const domain=mapping?.valueDomain;if(!domain||!['enum','fixed'].includes(String(domain.kind))||!Array.isArray(domain.values))return [];
 const values:{value:string;literal:string;label?:string}[]=[];
 for(const item of domain.values){if(!item||typeof item!=='object'||!['string','number','boolean'].includes(typeof item.value))return [];const value=typeof item.value==='string'?(item.value||'""'):String(item.value);values.push({value,literal:JSON.stringify(item.value)??String(item.value),...(typeof item.label==='string'&&item.label.trim()?{label:item.label.trim()}:{})});}
 return values;
}
function domainValueText(item:{value:string;label?:string}){return item.label?item.value+'：'+item.label:item.value;}
function domainNote(mapping:Mapping|undefined){const note=mapping?.valueDomain?.note;return typeof note==='string'&&note.trim()?note.trim():undefined;}

// The proposed business constraint is separate from an example, the source
// format's type notation, and whether a property may be omitted.
function nullableLabel(mapping:Mapping|undefined){
 if(typeof mapping?.nullable==='boolean')return mapping.nullable?'許容する':'許容しない';
 return mapping&&Object.hasOwn(mapping,'nullable')?'未決':'未定義';
}

function attributeDescription(info:{description?:unknown},mapping:Mapping|undefined){
 const value=typeof info.description==='string'&&info.description.trim()?info.description:mapping?.logicalMeaning;
 return typeof value==='string'&&value.trim()?value:'この項目の説明はまだ記載されていません。';
}

function addCopyActions(root:HTMLElement,list:HTMLElement,identity:string,sourcePaths:string[]=[]){
 const controls=document.createElement('div');controls.className='structure-copy-actions';
 const status=document.createElement('span');status.className='structure-copy-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 const fullText=()=>{
  const lines:string[]=[];
  for(const item of Array.from(list.children)){
   if(item.tagName!=='DT')continue;
   const details=item.nextElementSibling;if(!details)continue;
   const table=details.querySelector('table');
   const cellText=(cell:Element)=>Array.from(cell.childNodes).map(node=>{
    if(node.nodeName==='UL'||node.nodeName==='OL')return Array.from(node.childNodes).map(item=>item.textContent?.trim()??'').filter(Boolean).join('、');
    return node.textContent?.trim()??'';
   }).filter(Boolean).join(' / ');
   const value=table?Array.from(table.querySelectorAll('tr')).map(row=>Array.from(row.children).map(cellText).join(' | ')).join('\n'):
    Array.from(details.childNodes).map(node=>node.nodeName==='BR'?'\n':node.textContent??'').join('');
   lines.push((item.textContent??'')+'：'+value);
  }
  return [identity,...(sourcePaths.length?['元の定義：'+sourcePaths.join('、')]:[]),...lines].join('\n');
 };
 const copy=async(full:boolean)=>{
  try{
   const clipboard=root.ownerDocument.defaultView?.navigator.clipboard;
   if(!clipboard?.writeText)throw Error('Clipboard unavailable');
   await clipboard.writeText(full?fullText():identity);
   status.textContent=full?'全文をコピーしました。':'識別情報をコピーしました。';
  }catch{status.textContent='コピーできませんでした。ブラウザーの設定を確認してください。';}
 };
 const short=document.createElement('button');short.type='button';short.className='structure-copy-id';short.textContent='識別情報をコピー';
 short.title='Shiftを押しながら選ぶと全文をコピー';short.addEventListener('click',event=>{void copy(event.shiftKey);});
 const full=document.createElement('button');full.type='button';full.className='structure-copy-full';full.textContent='全文をコピー';full.addEventListener('click',()=>{void copy(true);});
 controls.append(short,full,status);root.insertBefore(controls,list);
}

/** Present only information declared on the selected concept, field or relation. */
export function renderStructureDetails(root:HTMLElement,model:ConceptModel,selection?:StructureSelection,onSelect?:(next:StructureSelection)=>void){
 root.replaceChildren();
 if(!selection){text(root,'p','ツリーの項目を選択すると詳細を確認できます。');return;}
 const graph=structureGraph(model),marks=reviewMarks(model),concept=graph.nodes.get(selection.conceptId);if(!concept){text(root,'p','項目が見つかりません。');return;}
 const meta=model.meta&&typeof model.meta==='object'?model.meta as {modelStatus?:unknown;schemaCoverage?:unknown}:{};
 const study=meta.modelStatus==='normalized-study'||meta.modelStatus==='complete-package-study';
 const names=(id:string)=>{const node=graph.nodes.get(id),authored=graph.conceptNames[id] as {typeName?:unknown;logicalName?:unknown}|undefined;
  return {local:typeof authored?.logicalName==='string'&&authored.logicalName?authored.logicalName:node?.name??id,type:typeof authored?.typeName==='string'&&authored.typeName?authored.typeName:node?.name??'未定義'};};
 const list=document.createElement('dl');list.className='structure-detail-list';root.append(list);
 const select=(next:StructureSelection)=>{if(onSelect)onSelect(next);else renderStructureDetails(root,model,next);if(next.kind==='attribute')root.querySelector<HTMLButtonElement>('.structure-attribute-back')?.focus();else if(selection.kind==='attribute')Array.from(root.querySelectorAll<HTMLTableRowElement>('.structure-attribute-table tbody tr')).find(row=>row.dataset.informationId===selection.informationId)?.querySelector<HTMLButtonElement>('.structure-attribute-select')?.focus();};
 const add=(label:string,value:string|string[]|undefined)=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;const values=Array.isArray(value)?value:[value??'未定義'];if(!values.length)dd.textContent='なし';else for(const [index,item]of values.entries()){if(index)dd.append(document.createElement('br'));dd.append(document.createTextNode(item));}list.append(dt,dd);};
 if(selection.kind==='attribute'){
  if(selection.returnTo){const back=document.createElement('button');back.type='button';back.className='structure-attribute-back';back.textContent='項目一覧に戻る';back.onclick=()=>select(selection.returnTo!);root.insertBefore(back,list);}
  const info=concept.information.find(item=>item.id===selection.informationId);if(!info){list.remove();text(root,'p','項目が見つかりません。');return;}
  const mapping=graph.mappings.get(info.id),data=info as typeof info&{description?:unknown};
  const context=names(concept.id),identity='概念モデル：'+model.id+'（'+model.revision+'）\n構造：'+context.type+'［'+concept.id+'］\n項目：'+info.name+(mapping?.physicalName?'（'+shortPhysicalName(mapping.physicalName)+'）':'')+'［'+info.id+'］';
  const sourcePaths=Array.isArray(meta.schemaCoverage)?meta.schemaCoverage.flatMap(item=>item&&typeof item==='object'&&item.informationId===info.id&&typeof item.path==='string'?[item.path]:[]):[];
  addCopyActions(root,list,identity,sourcePaths);
  const references=mapping?.relationIds.flatMap(id=>{const edges=(graph.edges.get(concept.id)??[]).filter(edge=>edge.relation.id===id);return edges.length?edges.map(edge=>names(edge.to).local+'（'+labels[edge.direction]+'）'):[id+'（未定義）'];});
  add('論理名',mapping?.physicalName?shortPhysicalName(mapping.physicalName):undefined);add('ローカル名',info.name);add('型名',typeLabel(mapping));
  add('サンプル',sampleValue(mapping)??'未記載');
  add('null許容',nullableLabel(mapping));
  // An automatically supplied nullability reason is not an explanation of
  // the field. Only display an authored meaning, and make gaps explicit.
  add('説明',attributeDescription(data,mapping));
  add('用途',typeof mapping?.logicalPurpose==='string'?mapping.logicalPurpose:'');
  if(mapping?.nullableReason)add('null許容の理由',mapping.nullableReason);
  const values=domainValues(mapping);if(values.length)add(mapping?.valueDomain?.kind==='fixed'?'値':'選択肢',values.map(domainValueText));
  const constraint=domainNote(mapping);if(constraint)add('制約',constraint);
  const review=marks.field(info.id,concept.id);if(review)add('位置づけ',reviewLabel(review)+'：'+review.reason);
  add('所属',names(concept.id).local+'（'+names(concept.id).type+'）');add('参照',references);
  if(mapping?.logicalSourcePaths?.length)add('対応する定義',mapping.logicalSourcePaths);
  if(typeof mapping?.optional==='boolean')add('項目の省略',mapping.optional?'可能':'不可');
  if(mapping?.representation)add('対応の種類',mapping.representation);
  if(info.responsibilityStatus)add('責任の確認状態',info.responsibilityStatus);
  if(info.responsibleSubsystemId)add('責任を持つサブシステム',model.subsystems.find(item=>item.id===info.responsibleSubsystemId)?.name);
  return;
 }
 const edge=selection.relationId?graph.edges.get(selection.fromId??'')?.find(item=>item.relation.id===selection.relationId&&item.to===concept.id):undefined;
 const n=names(concept.id);
 const identity='概念モデル：'+model.id+'（'+model.revision+'）\n構造：'+n.type+'［'+concept.id+'］'+(selection.relationId?'\n関係：'+selection.relationId:'');
 addCopyActions(root,list,identity);
 const named=(id:string)=>{const value=names(id);return value.local+'（'+value.type+'）';};
 const owners=(graph.edges.get(concept.id)??[]).filter(item=>item.direction==='owner').map(item=>named(item.to));
 const ownership=edge?.direction==='owned'?[named(edge.from)]:owners;
 const owned=(graph.edges.get(concept.id)??[]).filter(item=>item.direction==='owned'&&(selection.hideLegacy===false||marks.relation(item.relation.id,item.to)?.kind!=='legacy')).map(item=>{
  const child=names(item.to),review=marks.relation(item.relation.id,item.to);return (review?reviewLabel(review)+'：':'')+(item.roleName??child.local)+'（'+child.type+'）';
 });
 const outgoing=(graph.edges.get(concept.id)??[]).filter(item=>item.direction==='reference').map(item=>(item.roleName??'参照')+'：'+names(item.to).local);
 // A single source array can represent several concept relationships. Its
 // name is not the logical name of each of those relationships.
 const relationNames=edge?.fieldDetails.filter(field=>!study||![...graph.mappings.values()].some(mapping=>mapping.physicalName===field.physicalName&&mapping.relationIds.length>1)).map(field=>field.physicalName).filter(Boolean).map(shortPhysicalName);
 add('論理名',edge?(relationNames?.length?relationNames:undefined):n.type);add('ローカル名',edge?.roleName??edge?.fieldDetails[0]?.name??n.local);add('型名',n.type);
 // A class selection summarizes its own attributes, never those of children.
 // Samples are authored per field and may come from different source records.
 const attributes=concept.information.filter(info=>!graph.relationKeys.has(info.id)&&(selection.hideLegacy===false||marks.field(info.id,concept.id)?.kind!=='legacy'));
 const title=document.createElement('dt'),contents=document.createElement('dd');title.textContent='項目とサンプル';list.append(title,contents);
 if(!attributes.length)text(contents,'p','表示する属性はありません。','structure-attribute-empty');
 else{
  const wrap=document.createElement('div'),table=document.createElement('table'),thead=document.createElement('thead'),head=document.createElement('tr'),tbody=document.createElement('tbody');
  wrap.className='structure-attribute-wrap';table.className='structure-attribute-table';table.setAttribute('aria-label',n.local+'の項目とサンプル');
  for(const label of ['項目','サンプル','説明','用途']){const th=document.createElement('th');th.scope='col';th.textContent=label;head.append(th);}thead.append(head);table.append(thead,tbody);wrap.append(table);contents.append(wrap);
  for(const info of attributes){
   const mapping=graph.mappings.get(info.id),data=info as typeof info&{description?:unknown},tr=document.createElement('tr'),name=document.createElement('th'),samples=document.createElement('td'),description=document.createElement('td'),purpose=document.createElement('td');
   tr.dataset.informationId=info.id;name.scope='row';const choose=document.createElement('button');choose.type='button';choose.className='structure-attribute-name structure-attribute-select';choose.textContent=info.name;choose.onclick=()=>select({kind:'attribute',conceptId:concept.id,informationId:info.id,hideLegacy:selection.hideLegacy,returnTo:selection});name.append(choose);
   const review=marks.field(info.id,concept.id);if(review)markReview(name,review);
   if(mapping?.physicalName)text(name,'span','論理名：'+shortPhysicalName(mapping.physicalName),'structure-attribute-meta');
   text(name,'span','型：'+typeLabel(mapping),'structure-attribute-meta');text(name,'span','null許容：'+nullableLabel(mapping),'structure-attribute-meta');
   const values=domainValues(mapping);if(values.length){text(name,'span',mapping?.valueDomain?.kind==='fixed'?'値：':'選択肢：','structure-attribute-meta');const options=document.createElement('ul');options.className='structure-domain-values';for(const value of values)text(options,'li',domainValueText(value));name.append(options);}
   const constraint=domainNote(mapping);if(constraint)text(name,'span','制約：'+constraint,'structure-attribute-meta');
   const example=sampleValue(mapping);if(example!==undefined)text(samples,'span',example,'structure-attribute-sample');
   else text(samples,'span','未記載','structure-attribute-missing');
   description.textContent=attributeDescription(data,mapping);purpose.textContent=typeof mapping?.logicalPurpose==='string'?mapping.logicalPurpose:'';tr.append(name,samples,description,purpose);tbody.append(tr);
  }
 }
 add('所属',ownership.length?[...new Set(ownership)]:undefined);if(owned.length)add('含む構造',[...new Set(owned)]);add('参照',edge?.direction==='reference'?[n.local+'（'+n.type+'）']:outgoing);
 // These study models have generator-supplied placeholders that do not
 // describe the structure. Preserve them in the model but not in the drawer.
 const generatedDescription=study&&(/^候補の .+。現行0\.7の物理構造そのものではない。$/.test(concept.description)||concept.description==='0.7候補の構造に基づく概念モデルの検討案。');
 const conceptDescription=generatedDescription?'':concept.description,description=edge?.relation.condition||conceptDescription;
 if(description)add('説明',description);
 const review=edge?marks.relation(edge.relation.id,concept.id):marks.concept(concept.id);if(review)add('位置づけ',reviewLabel(review)+'：'+review.reason);
 if(edge){add('関係の種類',labels[edge.direction]);add('多重度',edge.count);add('反対側の多重度',edge.reverseCount);if(edge.relation.sourceRefs.length)add('関係の出所',edge.relation.sourceRefs.map(ref=>[ref.documentId,ref.revision,ref.targetType,ref.targetId,ref.section].filter(Boolean).join(' / ')));if(edge.relation.condition&&conceptDescription)add('構造の説明',conceptDescription);}
 // These two study models use a synthetic subsystem and the same task note on
 // every concept. Other authored reasons and subsystem names remain visible.
 const studyReason=study&&(concept.reason==='正規化候補の構造レビュー。'||concept.reason==='Alder JSON概念モデルのレビュー候補。');
 if(concept.reason&&!studyReason)add('理由',concept.reason);
 if(concept.subsystemId){const subsystem=model.subsystems.find(item=>item.id===concept.subsystemId);if(!(study&&subsystem?.id==='format-review'))add('サブシステム',subsystem?.name);}
 const referencedBy=(graph.edges.get(concept.id)??[]).filter(item=>item.direction==='referencedBy').map(item=>{const role=graph.edges.get(item.to)?.find(source=>source.relation.id===item.relation.id&&source.direction==='reference'&&source.to===concept.id)?.roleName;return names(item.to).local+(role?'：'+role:'');});if(referencedBy.length)add('参照元',referencedBy);
 if(concept.businessObjectIds.length)add('関連する対象',concept.businessObjectIds);
 if(concept.activityLinks.length)add('関連する業務',concept.activityLinks.map(link=>link.activityId+(link.uses.length?'：'+link.uses.join('、'):'')));
 if(concept.sourceRefs.length)add('出所',concept.sourceRefs.map(ref=>[ref.documentId,ref.revision,ref.targetType,ref.targetId,ref.section].filter(Boolean).join(' / ')));
}
function sampleValue(mapping:Mapping|undefined){
 if(!mapping)return;
 // Reference data remains in the model; show it only as a fallback example.
 const value=Object.hasOwn(mapping,'sampleValue')&&mapping.sampleValue!==undefined?mapping.sampleValue:mapping.referenceValue;
 return typeof value==='string'?(value||'""'):JSON.stringify(value);
}

/** The DOM is lazy per path. A full expansion visits each concept once. */
export function renderStructureExplorer(host:HTMLElement,model:ConceptModel,options:{rootId?:string;autoSelect?:boolean;select?:(selection:StructureSelection,reason:'select'|'filter'|'initial')=>void;clearSelection?:()=>void}={}){
 const graph=structureGraph(model),marks=reviewMarks(model);host.replaceChildren();host.className='structure-explorer';
 if(!graph.roots.length){text(host,'p','この構造モデルには概念がありません。','structure-empty');return;}
 if(options.rootId&&!graph.nodes.has(options.rootId)){text(host,'p','指定した構造が見つかりません。','structure-empty');return;}
 const roots=options.rootId?[options.rootId]:graph.roots;
 const panel=document.createElement('section');panel.className='structure-panel';host.append(panel);
 const toolbar=document.createElement('div');toolbar.className='structure-toolbar';panel.append(toolbar);
 const all=document.createElement('button');all.type='button';all.textContent='すべて展開';toolbar.append(all);
 const collapse=document.createElement('button');collapse.type='button';collapse.textContent='すべて折りたたみ';toolbar.append(collapse);
 const compatibility=document.createElement('label');compatibility.className='structure-compatibility-filter';
 const hideLegacy=document.createElement('input');hideLegacy.type='checkbox';hideLegacy.checked=true;
 compatibility.append(hideLegacy,document.createTextNode('互換・移行用を非表示'));compatibility.title='互換・移行用と明示された項目を非表示にします。';toolbar.append(compatibility);
 const searchLabel=document.createElement('label');searchLabel.className='structure-search';searchLabel.append(icon(Search));
 const search=document.createElement('input');search.type='search';search.placeholder='構造名・項目名で検索';search.setAttribute('aria-label','構造名・項目名で検索');searchLabel.append(search);toolbar.append(searchLabel);
 if(!options.rootId&&!graph.packageRoot&&!graph.hasOwnershipRoots)text(panel,'p','JSON全体のルートと所有関係の起点を特定できないため、すべての構造を表示します。','structure-unreachable');
 const unreachable=[...graph.nodes.keys()].filter(id=>!graph.reachable.has(id));
 if(!options.rootId&&unreachable.length)text(panel,'p',`この起点からたどれない構造：${unreachable.length}件`,'structure-unreachable');
 const undecided=[...graph.mappings.values()].filter(mapping=>mapping.nullable===null).length;
 if(undecided)text(panel,'p',`null許容が未決：${undecided}項目（互換・移行用を含む）`,'structure-pending');
 const tree=document.createElement('div');tree.className='structure-tree';tree.setAttribute('aria-label','構造のツリー');panel.append(tree);
 const empty=document.createElement('p');empty.className='structure-filter-empty';empty.hidden=true;empty.textContent='互換・移行用の構造は非表示です。表示するにはフィルターをOFFにしてください。';tree.before(empty);
 const noMatches=document.createElement('p');noMatches.className='structure-filter-empty';noMatches.hidden=true;noMatches.setAttribute('role','status');noMatches.textContent='検索結果は0件です。';tree.before(noMatches);
 let savedTree:Node|null=null,selectedKey:string|undefined,currentSelection:StructureSelection|undefined,selectedRow:HTMLElement|undefined;
 const keyOf=(selection:StructureSelection)=>JSON.stringify(selection.kind==='attribute'?['attribute',selection.conceptId,selection.informationId]:['structure',selection.conceptId,selection.fromId??'',selection.relationId??'']);
 const mark=(row:HTMLElement)=>{row.classList.add('structure-selected');row.setAttribute('aria-current','true');};
 const restoreSelection=()=>{tree.querySelectorAll<HTMLElement>('.structure-selected').forEach(item=>{item.classList.remove('structure-selected');item.removeAttribute('aria-current');});const row=selectedRow&&tree.contains(selectedRow)&&selectedRow.dataset.structureSelection===selectedKey?selectedRow:Array.from(tree.querySelectorAll<HTMLElement>('[data-structure-selection]')).find(item=>item.dataset.structureSelection===selectedKey);if(row){selectedRow=row;mark(row);}};
 const select=(selection:StructureSelection,row:HTMLElement,reason:'select'|'initial'='select')=>{currentSelection=selection;selectedKey=keyOf(selection);selectedRow=row;tree.querySelectorAll<HTMLElement>('.structure-selected').forEach(item=>{item.classList.remove('structure-selected');item.removeAttribute('aria-current');});mark(row);options.select?.({...selection,hideLegacy:hideLegacy.checked},reason);};

 const buildNode=(id:string,path:ReadonlySet<string>,edge?:StructureEdge,seen?:Set<string>):HTMLLIElement=>{
  const concept=graph.nodes.get(id)!;const item=document.createElement('li');item.className='structure-item';item.dataset.conceptId=id;
  const review=edge?marks.relation(edge.relation.id,id):marks.concept(id);if(review)item.dataset.compatibility=review.kind;
  const authored=Object.hasOwn(graph.conceptNames,id)?graph.conceptNames[id]:undefined;
  const declared=authored&&typeof authored==='object'&&!Array.isArray(authored)?authored as {typeName?:unknown;logicalName?:unknown}:{};
  const hasType=typeof declared.typeName==='string'&&!!declared.typeName.trim();
  const typeName=hasType?declared.typeName as string:concept.name;
  const logicalName=hasType&&typeof declared.logicalName==='string'&&declared.logicalName.trim()?declared.logicalName:'';
  const names=(includeLegacy:boolean)=>concept.information.filter(info=>includeLegacy||marks.field(info.id,id)?.kind!=='legacy').flatMap(info=>[info.name,graph.mappings.get(info.id)?.physicalName??'']);
  const searchText=(includeLegacy:boolean)=>[concept.name,typeName,logicalName,concept.id,...names(includeLegacy),edge?.roleName??'',...(edge?.fieldDetails.flatMap(field=>[field.name,field.physicalName])??[]),...(edge?.fields??[]),edge?.relation.condition??''].join(' ').toLocaleLowerCase();
  item.dataset.searchText=searchText(true);item.dataset.searchVisibleText=searchText(false);
  if(edge){item.dataset.relationId=edge.relation.id;item.dataset.relationDirection=edge.direction;}
  // A repeated reference can need an owner link that the direct ownership
  // path intentionally hides. Expand each such context at most once.
  const hasNamedOwner=(graph.edges.get(id)??[]).some(item=>item.direction==='owner'&&!!item.roleName);
  const referenceVisit=hasNamedOwner&&edge?.direction==='reference',visitKey=referenceVisit?id+'\u0000reference':id;
  const cycle=path.has(id),visited=!!seen?.has(visitKey),previouslySeen=visited||!!seen?.has(referenceVisit?id:id+'\u0000reference'),row=document.createElement('summary');
  row.className='structure-node-row';row.append(icon(edge?.direction==='reference'||edge?.direction==='owner'?Link:Box,edge?labels[edge.direction]:'構造'));markReview(row,review);
  const selectedStructure:StructureSelection={kind:'structure',conceptId:id,...(edge?{fromId:edge.from,relationId:edge.relation.id}:{})};row.dataset.structureSelection=keyOf(selectedStructure);
  row.addEventListener('click',()=>select(selectedStructure,row));
  if(edge){if(edge.direction==='unknownOut')text(row,'span',labels[edge.direction],'structure-type');text(row,'span',edge.count,'structure-count');row.title=`${labels[edge.direction]}：移動先 ${edge.count}／反対側 ${edge.reverseCount}${edge.relation.condition?' — '+edge.relation.condition:''}${edge.fields.length>edge.visibleFields.length?' — 物理項目：'+edge.fields.join('、'):''}`;}
  if(edge){
   const fields=edge.fieldDetails.length?edge.fieldDetails:[undefined];
   const entry=(name:string)=>{const label=document.createElement('span');label.className='structure-element';row.append(label);text(label,'strong',name);};
   if(edge.roleName&&fields.length===1)entry(edge.roleName);
   else{if(edge.roleName)entry(edge.roleName);fields.forEach((field,index)=>{if(index||edge.roleName)text(row,'span','／');entry(field?.name?.trim()||'名前未定義');});}
  }else text(row,'strong',logicalName||concept.name);
  if(cycle||previouslySeen)text(row,'span','既出','structure-seen');
  const hasChildren=(graph.edges.get(id)??[]).some(rel=>visibleDirections.includes(rel.direction)||rel.direction==='owner'&&!!rel.roleName&&!(edge?.direction==='owned'&&edge.relation.id===rel.relation.id&&edge.from===rel.to));
  const details=document.createElement('details');details.className='structure-node'+(hasChildren?'':' structure-leaf');details.append(row);item.append(details);
  let built=false;const nextPath=new Set(path);nextPath.add(id);
  const build=(expand?:Set<string>)=>{if(built)return;built=true;
   const children=document.createElement('ul');children.className='structure-children';details.append(children);
   // Reverse ownership is opt-in display metadata on an existing relation;
   // it does not invent a second model relationship.
   for(const direction of [...visibleDirections,'owner'] as Direction[]){const outgoing=(graph.edges.get(id)??[]).filter(rel=>rel.direction===direction&&(direction!=='owner'||!!rel.roleName&&!(edge?.direction==='owned'&&edge.relation.id===rel.relation.id&&edge.from===rel.to)));if(!outgoing.length)continue;
    for(const relation of outgoing)children.append(buildNode(relation.to,nextPath,relation,expand));
   }if(tree.contains(details)){restoreSelection();filter();}
  };
  row.addEventListener('keydown',event=>{
   if(!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft','Home','End'].includes(event.key)||event.altKey||event.ctrlKey||event.metaKey)return;
   event.preventDefault();event.stopPropagation();
   const rows=Array.from(tree.querySelectorAll<HTMLElement>('summary')).filter(candidate=>{
    if(candidate.closest('[hidden]'))return false;
    for(let parent=candidate.parentElement?.parentElement;parent&&parent!==tree;parent=parent.parentElement)if(parent instanceof HTMLDetailsElement&&!parent.open)return false;
    return true;
   });
   const index=rows.indexOf(row);
   if(event.key==='ArrowDown')rows[index+1]?.focus();
   else if(event.key==='ArrowUp')rows[index-1]?.focus();
   else if(event.key==='Home')rows[0]?.focus();
   else if(event.key==='End')rows.at(-1)?.focus();
   else if(event.key==='ArrowRight'&&hasChildren){if(!details.open){details.open=true;build();}else details.querySelector<HTMLElement>(':scope > .structure-children > li:not([hidden]) > details > summary')?.focus();}
   else if(event.key==='ArrowLeft'){if(details.open&&hasChildren)details.open=false;else item.parentElement?.closest('.structure-item')?.querySelector<HTMLElement>(':scope > details > summary')?.focus();}
  });
  details.addEventListener('toggle',()=>{if(details.open)build();});
  if(seen&&!visited&&!cycle){seen.add(visitKey);details.open=true;build(seen);}
  return item;
 };
 const render=(expand:boolean)=>{const ul=document.createElement('ul');ul.className='structure-root';const seen=expand?new Set<string>():undefined;for(const id of roots)ul.append(buildNode(id,new Set(),undefined,seen));tree.replaceChildren(ul);if(!expand){const first=ul.querySelector<HTMLDetailsElement>('.structure-node')!;first.open=true;first.dispatchEvent(new Event('toggle'));}restoreSelection();};
 const filter=()=>{const query=search.value.trim().toLocaleLowerCase();
  if(query&&!savedTree){savedTree=tree.firstChild;render(true);}else if(!query&&savedTree){tree.replaceChildren(savedTree);savedTree=null;restoreSelection();}
  const items=Array.from(tree.querySelectorAll<HTMLElement>('[data-search-text]')).reverse();
  // Reverse DOM order settles children first; propagate only visible direct
  // children so a hidden compatibility branch still blocks its descendants.
  const parentsWithVisibleChildren=new Set<HTMLElement>();
  for(const item of items){
   const own=(hideLegacy.checked?item.dataset.searchVisibleText??item.dataset.searchText:item.dataset.searchText)?.includes(query)??false;
   item.hidden=(hideLegacy.checked&&item.dataset.compatibility==='legacy')||(!!query&&!own&&!parentsWithVisibleChildren.has(item));
   if(!item.hidden){const parent=item.parentElement?.closest<HTMLElement>('[data-search-text]');if(parent)parentsWithVisibleChildren.add(parent);}
  }
  empty.hidden=!!query||!hideLegacy.checked||!roots.every(id=>marks.concept(id)?.kind==='legacy');
  noMatches.hidden=!query||Array.from(tree.querySelectorAll('.structure-root > li')).some(item=>!(item as HTMLElement).hidden);
 };
 hideLegacy.onchange=()=>{const selected=tree.querySelector<HTMLElement>('.structure-selected');if(hideLegacy.checked&&selected?.closest('[data-compatibility="legacy"]')){selectedKey=undefined;currentSelection=undefined;options.clearSelection?.();}else if(currentSelection)options.select?.({...currentSelection,hideLegacy:hideLegacy.checked},'filter');filter();restoreSelection();};
 all.onclick=()=>{savedTree=null;search.value='';render(true);filter();};collapse.onclick=()=>{savedTree=null;search.value='';render(false);const first=tree.querySelector<HTMLDetailsElement>('.structure-node');if(first)first.open=false;filter();};search.oninput=filter;
 render(false);
 if(options.autoSelect){const first=Array.from(tree.querySelectorAll<HTMLElement>('.structure-root > .structure-item')).find(item=>!item.hidden),row=first?.querySelector<HTMLElement>(':scope > details > summary');if(first?.dataset.conceptId&&row)select({kind:'structure',conceptId:first.dataset.conceptId},row,'initial');}
}
