// Candidate storage contracts. Concept models and complete lifecycles remain unsupported.
const str={type:'string'},text={type:'string',minLength:1,pattern:'\\S'},id={type:'string',pattern:'^[A-Za-z0-9_-]+$'},nullable=s=>({anyOf:[s,{type:'null'}]}),array=items=>({type:'array',items});
const obj=(properties,required=Object.keys(properties))=>({type:'object',properties,required,additionalProperties:false});
const ref=name=>({$ref:'#/$defs/'+name});
const rich=array({anyOf:[obj({kind:{enum:['text']},value:str}),obj({kind:{enum:['reference']},targetId:id,label:str}),obj({kind:{enum:['link']},uri:text,label:str})]});
const entity=obj({id,name:text,scope:{type:'boolean'}}).properties;
const relation=obj({id,kind:{enum:['input','output','business-exception','object-exception']},fromId:id,toId:id,label:text});
const finding=obj({id,sourceId:id,kind:{enum:['question','correction']},status:{enum:['open','resolved']},scope:{enum:['items','document','unassigned']},targetIds:array(id),unresolvedTargets:array(text),summary:text,content:text});
const bd=obj({id,schemaVersion:{enum:['0.1']},kind:{enum:['businessDesign']},revision:text,title:text,preface:str,scope:str,
 objects:array(obj({...entity,icon:text,information:array(text)})),
 activities:array(obj({...entity,why:text,when:text,who:text,where:text,procedure:text,exception:nullable(text),result:text,problem:nullable(text),painLevel:nullable({enum:['Low','Medium','High']})})),
 relations:array(relation),findings:array(finding)});
const role=obj({id,name:text,color:{enum:['#8b5cf6','#2563eb','#c2410c','#008576','#be185d']}});
const roleBD=obj({...bd.properties,schemaVersion:{enum:['0.2']},roles:array(role),activities:array(obj({...bd.properties.activities.items.properties,roleId:nullable(id)}))});
const structuredBD=obj({...roleBD.properties,schemaVersion:{enum:['0.3']},exceptions:array(obj({id,activityId:id,name:text,description:str}))});
const nonempty=items=>({...array(items),minItems:1});
const information=obj({id,name:text,description:str});
const performer=obj({objectId:id,roleIds:array(id)});
const step=obj({id,text,obligation:{enum:['required','optional']},appliesWhen:nullable(text),performerObjectIds:nullable(nonempty(id))});
const orderRule={anyOf:[obj({kind:{enum:['before']},beforeId:id,afterId:id}),obj({kind:{enum:['interchangeable']},stepIds:{...array(id),minItems:2}})]};
const activityProperties=Object.fromEntries(Object.entries(structuredBD.properties.activities.items.properties).filter(([key])=>!['who','roleId','procedure','result','exception'].includes(key)));
const d2BD=obj({...structuredBD.properties,schemaVersion:{enum:['0.4']},
 objects:array(obj({...entity,icon:text,information:array(information)})),
 activities:nonempty(obj({...activityProperties,performers:nullable(nonempty(performer)),procedure:obj({steps:nonempty(step),orderRules:array(orderRule)}),results:nonempty(obj({id,text}))})),
 data:array(obj({id,name:text,items:nonempty(obj({informationId:id,condition:nullable(text)}))})),
 relations:array({anyOf:[obj({id,kind:{enum:['input','output']},fromId:id,toId:id,dataId:id}),obj({...relation.properties,kind:{enum:['business-exception','object-exception']}})]})});
const checkFields=Object.fromEntries(['classification','condition','expectedResult','guarantee','evidence','derivation','related','testEvidence','question','alternatives','confidence'].map(k=>[k,rich]));
const checks=obj({id,schemaVersion:{enum:['0.1']},kind:{enum:['checkItems']},revision:text,title:text,basedOn:obj({documentId:id,revision:text,verification:{enum:['unverified']}}),intro:rich,
 index:array(obj({activityId:id,purpose:str,connections:str,checkIds:array(id)})),
 sections:array(obj({id,activityId:nullable(id),title:text,preamble:rich})),
 guarantees:array(obj({id,sectionId:id,title:text,blocks:array({anyOf:[obj({kind:{enum:['prose']},content:rich}),obj({kind:{enum:['example']},exampleId:id})]})})),
 examples:array(obj({id,guaranteeId:id,columns:array(text),rows:array(array(rich))})),
 items:array(obj({id,checkId:id,title:text,detailSummary:str,sectionId:id,reviewState:{enum:['未レビュー','要確認','確認済み','要修正']},fields:obj(checkFields,[])})),
 notes:array(obj({id,title:text,content:rich}))});
const stateTransition=obj({id,schemaVersion:{enum:['0.1']},kind:{enum:['stateTransition']},revision:text,title:text,
 basedOn:obj({documentId:id,revision:text,verification:{enum:['unverified']}}),objectId:id,
 states:array(obj({id,name:text})),start:{enum:['@new']},terminal:{enum:['@unknown']},completeness:{enum:['partial']},source:text,
 transitions:array(obj({id,sourceId:text,fromId:text,activityId:id,event:nullable(text),exception:nullable(text),condition:text,toId:text,
 effect:{enum:['change','unchanged','no-create','constraint']},path:{enum:['normal','exception']},evidence:text,note:text}))});
const structuredState=obj({...stateTransition.properties,schemaVersion:{enum:['0.2']},transitions:array(obj(Object.fromEntries(Object.entries({...stateTransition.properties.transitions.items.properties,exceptionId:nullable(id)}).filter(([key])=>key!=='exception'))))});
const packageShape=(version,kinds)=>obj({format:{enum:['alder-document-package']},formatVersion:{enum:[version]},revision:text,documents:array({anyOf:kinds.map(ref)}),sources:array(obj({documentId:id,revision:text,sha256:{type:'string',pattern:'^[0-9a-f]{64}$'},uri:str})),externalDocuments:array(obj({id,kind:{enum:['businessDesign']},revision:text,activities:array(obj({id,name:text}))})),diagnostics:array(text)});
export const schema={anyOf:[packageShape('0.1',['businessDesign','checkItems']),packageShape('0.2',['businessDesign','checkItems','stateTransition']),packageShape('0.3',['businessDesignRoles','checkItems','stateTransition']),packageShape('0.4',['businessDesignStructured','checkItems','stateTransitionStructured']),packageShape('0.5',['businessDesignD2','checkItems','stateTransitionStructured'])],$schema:'https://json-schema.org/draft/2020-12/schema',$defs:{businessDesign:bd,businessDesignRoles:roleBD,businessDesignStructured:structuredBD,businessDesignD2:d2BD,checkItems:checks,stateTransition,stateTransitionStructured:structuredState}};
