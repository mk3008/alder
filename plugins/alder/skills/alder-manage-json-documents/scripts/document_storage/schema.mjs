// Candidate storage contracts. Complete lifecycles remain unsupported.
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
const structuredTransitionFields=Object.fromEntries(Object.entries({...stateTransition.properties.transitions.items.properties,exceptionId:nullable(id)}).filter(([key])=>key!=='exception'));
const structuredState=obj({...stateTransition.properties,schemaVersion:{enum:['0.2']},transitions:array(obj({...structuredTransitionFields,conditionLabel:text},Object.keys(structuredTransitionFields)))});
// Concept data is part of the same package. Metadata is retained as authored;
// it is not interpreted as a rule or used to synthesize Viewer content.
const conceptSource=obj({documentId:id,revision:text,targetType:text,targetId:id,section:text});
const conceptInformation=obj({id,name:text,responsibilityStatus:text,responsibleSubsystemId:id},['id','name']);
const conceptEntry=obj({id,name:text,subsystemId:id,information:array(conceptInformation),reason:str,description:str,
 businessObjectIds:array(id),activityLinks:array(obj({activityId:id,uses:array(text)})),sourceRefs:array(conceptSource),reviewState:text});
const modelRelation=obj({id,fromConceptId:id,toConceptId:id,fromPerTarget:text,toPerSource:text,condition:str,reviewState:text,
 sourceRefs:array(conceptSource),fromLabel:text,toLabel:text,kind:{enum:['down','reference']}});
const subsystem=obj({id,name:text,purpose:str,information:array(text),reason:str,activityIds:array(id),reviewState:text});
const handoff=obj({id,fromSubsystemId:id,toSubsystemId:id,information:text,description:str,activityIds:array(id),flowDirection:{enum:['forward','return']},reviewState:text});
const sampleCell=obj({columnId:id,value:{anyOf:[str,{type:'number'}]},linkId:text},['columnId','value']);
const sampleBlock=obj({card:id,columns:array(obj({id,name:text,informationId:id})),rows:array(obj({id,cells:array(sampleCell)})),empty:str},['card','columns','rows']);
const sample=obj({id,name:text,when:str,meaning:str,blocks:array(sampleBlock),note:str},['id','name','when','meaning','blocks']);
const capability=obj({id,title:text,description:str,meta:{},samples:array(sample)});
const limitation=obj({id,title:text,description:str,reason:str,meta:{}});
const viewNode=obj({conceptId:id,name:text,fields:array(text),description:str,sources:array(text),sourceActivityIds:array(id)});
const viewEdge=obj({id,fromConceptId:id,toConceptId:id,relationIds:array(id),scope:str,fromLabel:text,toLabel:text,kind:{enum:['down','reference']}});
// Optional subsystem-specific projections describe which information appears
// in each boundary. A projection is not a new entity or a physical table.
const boundaryNode=obj({id,conceptId:id,subsystemId:id,name:text,description:str,sources:array(text),fields:array(obj({name:text,informationId:id}))});
const boundaryEdge=obj({id,fromViewId:id,toViewId:id,relationIds:array(id),fromLabel:text,toLabel:text,kind:{enum:['down','reference']}});
const boundaryViews=obj({nodes:array(boundaryNode),edges:array(boundaryEdge),handoffIds:array(id)});
const reviewGroup=obj({id,subsystemId:id,title:text,description:str,reviewer:obj({roleId:id}),relatedActivityIds:array(id),
 graph:obj({conceptIds:array(id),nodes:array(viewNode),edges:array(viewEdge),subsystemViews:boundaryViews},['conceptIds','nodes','edges']),
 structureStatements:array(obj({id,title:text,description:str,sampleIds:array(id),sourceRefs:array(conceptSource)})),
 capabilities:array(capability),limitations:array(limitation),meta:obj({questions:array(text),hypotheses:{}},['questions'])});
const conceptModel=obj({id,schemaVersion:{enum:['0.1']},kind:{enum:['conceptModel']},revision:text,
 basedOn:obj({documentId:id,revision:text,verification:{enum:['unverified']}}),
 relatedStates:array(obj({documentId:id,revision:text,verification:{enum:['unverified']}})),
 subsystems:array(subsystem),concepts:array(conceptEntry),relations:array(modelRelation),handoffs:array(handoff),reviewGroups:array(reviewGroup),
 benefits:array(text),considerations:array(text),reviewPoints:array(text),meta:{},
 presentation:obj({activityViews:{},creatorActivityIds:{},sampleCaption:str,subsystemViews:boundaryViews,landscapeRelationships:array(obj({from:id,to:id})),
  reviewBoundaries:array(obj({from:id,to:id,label:str,promise:str}))},['landscapeRelationships','reviewBoundaries'])});
const packageShape=(version,kinds)=>obj({format:{enum:['alder-document-package']},formatVersion:{enum:[version]},revision:text,documents:array({anyOf:kinds.map(ref)}),sources:array(obj({documentId:id,revision:text,sha256:{type:'string',pattern:'^[0-9a-f]{64}$'},uri:str})),externalDocuments:array(obj({id,kind:{enum:['businessDesign']},revision:text,activities:array(obj({id,name:text}))})),diagnostics:array(text)});
export const schema={anyOf:[packageShape('0.1',['businessDesign','checkItems']),packageShape('0.2',['businessDesign','checkItems','stateTransition']),packageShape('0.3',['businessDesignRoles','checkItems','stateTransition']),packageShape('0.4',['businessDesignStructured','checkItems','stateTransitionStructured','conceptModel'])],$schema:'https://json-schema.org/draft/2020-12/schema',$defs:{businessDesign:bd,businessDesignRoles:roleBD,businessDesignStructured:structuredBD,checkItems:checks,stateTransition,stateTransitionStructured:structuredState,conceptModel}};
