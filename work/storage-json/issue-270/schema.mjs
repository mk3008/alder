// Experimental structural schema. Cross-reference constraints live in core.mjs.
const str={type:'string'},text={type:'string',minLength:1},id={type:'string',pattern:'^[A-Za-z0-9_-]+$'},nullable=s=>({anyOf:[s,{type:'null'}]}),array=items=>({type:'array',items});
const obj=(properties,required=Object.keys(properties))=>({type:'object',properties,required,additionalProperties:false});
const ref=name=>({$ref:'#/$defs/'+name});
const rich=array({anyOf:[obj({kind:{enum:['text']},value:str}),obj({kind:{enum:['reference']},targetId:id,label:str}),obj({kind:{enum:['link']},uri:text,label:str})]});
const entity=obj({id,name:text,scope:{type:'boolean'}}).properties;
const relation=obj({id,kind:{enum:['input','output','business-exception','object-exception']},fromId:id,toId:id,label:text});
const finding=obj({id,sourceId:id,kind:{enum:['question','correction']},status:{enum:['open','resolved']},scope:{enum:['items','document','unassigned']},targetIds:array(id),unresolvedTargets:array(text),summary:text,content:text});
const bd=obj({id,kind:{enum:['businessDesign']},revision:text,title:text,preface:str,scope:str,
 objects:array(obj({...entity,icon:text,information:array(text),draftAnnotations:obj({'Medium':text,'SR Dependencies':text},[])})),
 activities:array(obj({...entity,why:text,when:text,who:text,where:text,procedure:text,exception:nullable(text),result:text,problem:nullable(text),painLevel:nullable({enum:['Low','Medium','High']})})),
 relations:array(relation),findings:array(finding)});
const checkFields=Object.fromEntries(['classification','condition','expectedResult','guarantee','evidence','derivation','related','testEvidence','question','alternatives'].map(k=>[k,rich]));
const checks=obj({id,kind:{enum:['checkItems']},revision:text,title:text,basedOn:obj({documentId:id,revision:text,sourceClaimRevision:text,verification:{enum:['unverified']}}),intro:rich,
 index:array(obj({activityId:id,purpose:str,connections:str,checkIds:array(id)})),
 sections:array(obj({id,activityId:id,preamble:rich})),
 guarantees:array(obj({id,sectionId:id,title:text,blocks:array({anyOf:[obj({kind:{enum:['prose']},content:rich}),obj({kind:{enum:['example']},exampleId:id})]})})),
 examples:array(obj({id,guaranteeId:id,columns:array(text),rows:array(array(rich))})),
 items:array(obj({id,title:text,sectionId:id,reviewState:{enum:['未レビュー','要確認','確認済み','要修正']},fields:obj(checkFields,[])})),
 notes:array(obj({id,title:text,content:rich}))});
export const schema={...obj({format:{enum:['alder-typed-storage-poc']},formatVersion:{enum:['0.2-poc']},revision:text,documents:array({anyOf:[ref('businessDesign'),ref('checkItems')]}),archives:array(obj({documentId:id,revision:text,sha256:{type:'string',pattern:'^[0-9a-f]{64}$'},mediaType:{enum:['text/markdown']},text:str})),diagnostics:array(text)}),$schema:'https://json-schema.org/draft/2020-12/schema',$defs:{businessDesign:bd,checkItems:checks}};
