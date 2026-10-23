// @ts-expect-error Legacy-only conversion boundary.
import {legacyExceptions,legacyExceptionId} from '../../tools/document_storage/legacy-json.mjs';
import {parseDesign} from './graph.ts';
import type {BD,StateDocument} from './json-document';
import type {NormalizedDocument} from './viewer-document';
import type {StateModel} from './state-transitions';
// @ts-expect-error Frozen declaration input grammar, not the Node/Python converter.
import {extractStateDeclarations} from '../../tools/document_storage/state-declaration.mjs';

/** Legacy grammar stops here. No formal storage migration, inferred IDs or new MD features. */
export function normalizeMarkdown(source:string):NormalizedDocument{
 const extracted=/^## State Transitions$/m.test(source)?extractStateDeclarations(source):{markdown:source,declarations:[]};
 let title='',preface='';const fields=new Map<string,Record<string,string>>(),old=parseDesign(extracted.markdown,{activity:(id,values)=>fields.set(id,values),document:(t,p)=>{title=t;preface=p;}});
 const bd:BD={id:'legacy-business-design',kind:'businessDesign',revision:'unversioned',title,preface,scope:old.graph.scope??'',
  objects:old.graph.nodes.filter(n=>n.type==='object').map(n=>({id:n.id,name:n.name,scope:n.scope,icon:String(n.icon),information:n.information as string[]})),
  activities:(old.activityOrder??[]).map(id=>{const n=old.graph.nodes.find(n=>n.id===id)!,v=fields.get(id)!;return {id,name:n.name,scope:n.scope,why:String(n.why),when:String(n.when),who:String(n.who),where:String(n.where),procedure:v['### Procedure'],exception:v['### Exception']??null,result:String(n.result),problem:n.problem===undefined?null:String(n.problem),painLevel:n.pain_level===undefined?null:String(n.pain_level)};}),
  relations:old.graph.relations.map((r,i)=>({id:'legacy-relation-'+i,kind:r.kind,fromId:r.from,toId:r.to,label:r.label})),
  findings:(old.findings??[]).map(f=>({...f,sourceId:f.id,targetIds:f.targets.filter(id=>old.graph.nodes.some(n=>n.id===id))}))};
 bd.exceptions=legacyExceptions(bd);
 const states:StateDocument[]=extracted.declarations.map((d:StateModel,i:number)=>({id:'legacy-state-'+i,kind:'stateTransition',revision:'unversioned',basedOn:{documentId:bd.id,revision:bd.revision,verification:'unverified'},objectId:d.object,
  states:d.states.map(name=>({id:name,name})),start:d.start,terminal:d.terminal,completeness:d.completeness,source:d.source,
  transitions:d.transitions.map(t=>({id:t.id,sourceId:t.id,fromId:t.from,toId:t.to,activityId:t.activity,exceptionId:legacyExceptionId(bd,t.activity,t.exception),event:t.event??null,condition:t.condition,effect:t.effect,path:t.path,evidence:t.evidence,note:t.note}))}));
 return {original:{format:'markdown',text:source},data:{version:1,formatVersion:'legacy-input',revision:'unversioned',business:bd,checks:[],states,diagnostics:[]}};
}
