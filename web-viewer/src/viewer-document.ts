// @ts-expect-error Source-independent shared reference validator.
import {validateReferences} from '../../tools/document_storage/core.mjs';
import type {Design,GraphNode} from './graph';
import type {DocumentModel} from './json-document';
import {canonicalJSONGraph} from './json-layout.ts';
import type {StateModel} from './state-transitions';

/** The JSON feature model is also the sole output of the legacy input adapter.
 * It is a viewing value, not an automatically migrated storage package. */
export type ViewerDocumentJSON=DocumentModel & {version:1};
export type OriginalDocument={format:'markdown'|'json';text:string};
export type NormalizedDocument={data:ViewerDocumentJSON;original:OriginalDocument};

/** Both formats project through this boundary; renderers never re-read MD sections. */
export function readViewerDocument({data,original}:NormalizedDocument):Design{
 if(data.version!==1)throw Error('Unsupported Viewer document version');
 const validation:{diagnostics:string[]}=validateReferences({formatVersion:'0.4',documents:[data.business,...data.checks,...data.states,...(data.concepts??[])],sources:[],externalDocuments:[],diagnostics:data.diagnostics},{allowUnresolvedFindings:true});
 data={...data,diagnostics:[...new Set(validation.diagnostics)]};
 const bd=data.business,all=[...bd.objects,...bd.activities];
 const roleName=(a:typeof bd.activities[number])=>bd.roles?.find(r=>r.id===a.roleId)?.name??a.who;
 const nodes:GraphNode[]=[...bd.objects.map(o=>({...o,type:'object' as const})),...bd.activities.map(a=>({id:a.id,type:'business' as const,name:a.name,scope:a.scope,why:a.why,when:a.when,who:roleName(a),where:a.where,result:a.result,...(a.problem===null?{}:{problem:a.problem,pain_level:a.painLevel})}))];
 const objectStateTransitions=Object.assign(Object.create(null),Object.fromEntries(data.states.filter(d=>d.basedOn.documentId===bd.id).map(d=>{
  const labels=new Map(d.states.map(s=>[s.id,s.name]));
  const model:StateModel={object:all.find(n=>n.id===d.objectId)!.name,states:d.states.map(s=>s.name),start:d.start,terminal:d.terminal,completeness:d.completeness,source:d.source,
   transitions:d.transitions.map(t=>({id:t.sourceId,from:labels.get(t.fromId)??t.fromId,to:labels.get(t.toId)??t.toId,activity:t.activityId,...(t.event?{event:t.event}:{}),...(t.exceptionId?{exceptionId:t.exceptionId,exception:bd.exceptions?.find(e=>e.id===t.exceptionId)?.name}:{}),condition:t.condition,...(t.conditionLabel?{conditionLabel:t.conditionLabel}:{}),effect:t.effect,path:t.path,evidence:t.evidence,note:t.note}))};
  return [d.objectId,{model}];
 })));
 return {graph:canonicalJSONGraph({version:1,...(bd.scope?{scope:bd.scope}:{}),nodes,relations:bd.relations.map(r=>({kind:r.kind,from:r.fromId,to:r.toId,label:r.label}))}),
  // Kept empty for old Session decoders; never a second business representation.
  sections:Object.fromEntries(nodes.map(n=>[n.id,''])),markdown:original.text,
  ...(original.format==='json'?{sourceFormat:'json' as const}:{}),model:data,
  activityOrder:bd.activities.map(a=>a.id),objectStateTransitions,
  findings:bd.findings.map(f=>({...f,displayId:f.sourceId,targets:[...f.targetIds,...f.unresolvedTargets],targetNames:[...f.targetIds,...f.unresolvedTargets].map(id=>all.find(n=>n.id===id)?.name??id)}))};
}
