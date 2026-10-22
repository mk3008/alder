// The Gate A parser/validator is browser-safe; authoring and conversion are not imported.
// @ts-expect-error Gate A supplies JavaScript modules without TypeScript declarations.
import {parseStrict,validate} from '../../tools/document_storage/core.mjs';
import {parseDesign,type Design,type GraphNode} from './graph.ts';
export type Run={kind:'text';value:string}|{kind:'reference';targetId:string;label:string}|{kind:'link';uri:string;label:string};
export type ObjectEntry={id:string;name:string;scope:boolean;icon:string;information:string[]};
export type ActivityEntry={id:string;name:string;scope:boolean;why:string;when:string;who:string;where:string;procedure:string;exception:string|null;result:string;problem:string|null;painLevel:string|null};
export type BD={id:string;kind:'businessDesign';revision:string;title:string;preface:string;scope:string;objects:ObjectEntry[];activities:ActivityEntry[];relations:{id:string;kind:'input'|'output'|'business-exception'|'object-exception';fromId:string;toId:string;label:string}[];findings:{id:string;sourceId:string;kind:'question'|'correction';status:'open'|'resolved';scope:'items'|'document'|'unassigned';targetIds:string[];unresolvedTargets:string[];summary:string;content:string}[]};
export type Check={id:string;kind:'checkItems';revision:string;title:string;basedOn:{documentId:string;revision:string;verification:'unverified'};intro:Run[];index:{activityId:string;purpose:string;connections:string;checkIds:string[]}[];sections:{id:string;activityId:string|null;title:string;preamble:Run[]}[];items:{id:string;checkId:string;title:string;reviewState:string;sectionId:string;detailSummary:string;fields:Record<string,Run[]>}[];guarantees:{id:string;sectionId:string;title:string;blocks:({kind:'prose';content:Run[]}|{kind:'example';exampleId:string})[]}[];examples:{id:string;guaranteeId:string;columns:string[];rows:Run[][][]}[];notes:{id:string;content:Run[]}[]};
export type JSONView={revision:string;business:BD;checks:Check[];diagnostics:string[]};

/** Direct projection into the existing display model. No Markdown document is generated.
 * `markdown` is the legacy session field for original source bytes, including JSON.
 * The projected graph uses persistent IDs; it is NOT a Business Graph v1 export.
 */
export function parseDocument(source:string):Design{
 if(!/^\s*[\[{]/.test(source))return parseDesign(source);
 const pkg=parseStrict(source);const result=validate(pkg);
 const business=pkg.documents.filter((d:BD|Check)=>d.kind==='businessDesign') as BD[];
 if(business.length!==1)throw Error('このViewerは、単一JSON内のBusiness Designが1件の場合に対応します。');
 const bd=business[0];const nodes:GraphNode[]=[...bd.objects.map(o=>({...o,type:'object' as const})),...bd.activities.map(a=>({id:a.id,type:'business' as const,name:a.name,scope:a.scope,why:a.why,when:a.when,who:a.who,where:a.where,result:a.result,...(a.problem===null?{}:{problem:a.problem,pain_level:a.painLevel})}))];
 return {sourceFormat:'json',markdown:source,sections:Object.fromEntries(nodes.map(n=>[n.id,''])),activityOrder:bd.activities.map(a=>a.id),
  graph:{version:1,scope:bd.scope,nodes,relations:bd.relations.map(r=>({kind:r.kind,from:r.fromId,to:r.toId,label:r.label}))},
  findings:bd.findings.map(f=>({...f,targets:f.targetIds})),json:{revision:pkg.revision,business:bd,checks:pkg.documents.filter((d:BD|Check)=>d.kind==='checkItems'),diagnostics:result.diagnostics}};
}
