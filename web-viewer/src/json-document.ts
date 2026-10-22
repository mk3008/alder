// The Gate A parser/validator is browser-safe; authoring and conversion are not imported.
// @ts-expect-error Gate A supplies JavaScript modules without TypeScript declarations.
import {parseStrict,validate} from '../../tools/document_storage/core.mjs';
import {parseDesign,type Design,type GraphNode} from './graph.ts';
// @ts-expect-error Explicit experimental declaration grammar is shared with the converter.
import {extractStateDeclarations} from '../../tools/document_storage/state-declaration.mjs';
import type {StateDocument} from './state-projection';
import {canonicalJSONGraph} from './json-layout.ts';
export type Run={kind:'text';value:string}|{kind:'reference';targetId:string;label:string}|{kind:'link';uri:string;label:string};
export type ObjectEntry={id:string;name:string;scope:boolean;icon:string;information:string[]};
export type ActivityEntry={id:string;name:string;scope:boolean;roleId?:string|null;why:string;when:string;who:string;where:string;procedure:string;exception:string|null;result:string;problem:string|null;painLevel:string|null};
export type BD={id:string;kind:'businessDesign';revision:string;title:string;preface:string;scope:string;roles?:{id:string;name:string;color:string}[];objects:ObjectEntry[];activities:ActivityEntry[];relations:{id:string;kind:'input'|'output'|'business-exception'|'object-exception';fromId:string;toId:string;label:string}[];findings:{id:string;sourceId:string;kind:'question'|'correction';status:'open'|'resolved';scope:'items'|'document'|'unassigned';targetIds:string[];unresolvedTargets:string[];summary:string;content:string}[]};
export type Check={id:string;kind:'checkItems';revision:string;title:string;basedOn:{documentId:string;revision:string;verification:'unverified'};intro:Run[];index:{activityId:string;purpose:string;connections:string;checkIds:string[]}[];sections:{id:string;activityId:string|null;title:string;preamble:Run[]}[];items:{id:string;checkId:string;title:string;reviewState:string;sectionId:string;detailSummary:string;fields:Record<string,Run[]>}[];guarantees:{id:string;sectionId:string;title:string;blocks:({kind:'prose';content:Run[]}|{kind:'example';exampleId:string})[]}[];examples:{id:string;guaranteeId:string;columns:string[];rows:Run[][][]}[];notes:{id:string;title:string;content:Run[]}[]};
export type JSONView={formatVersion:string;revision:string;business:BD;checks:Check[];states:StateDocument[];diagnostics:string[]};

/** Direct projection into the existing display model. No Markdown document is generated.
 * `markdown` is the legacy session field for original source bytes, including JSON.
 * The projected graph uses persistent IDs; it is NOT a Business Graph v1 export.
 */
export const MAX_LOCAL_JSON_BYTES=8*1024*1024;
export function isJSONSource(source:string){return /^\s*[\[{]/.test(source);}
export async function readDesignFile(file:File):Promise<Design>{
 const expectedJSON=/\.json$/i.test(file.name)||/json/i.test(file.type);
 if(expectedJSON&&file.size>MAX_LOCAL_JSON_BYTES)throw Error('ローカルJSONは8MiB以内にしてください。');
 const source=await file.text();if(expectedJSON&&!isJSONSource(source))throw Error('JSONファイルの本文を確認してください。');return parseDocument(source);
}
export function parseDocument(source:string):Design{
 if(!isJSONSource(source)){
  if(!/^## State Transitions$/m.test(source))return parseDesign(source);
  const extracted=extractStateDeclarations(source);if(!extracted.declarations.length)return parseDesign(source);const design=parseDesign(extracted.markdown);
  return {...design,markdown:source,objectStateTransitions:Object.fromEntries(extracted.declarations.map((model:unknown)=>{const m=model as {object:string};return [m.object,{model}];}))};
 }
 if(new TextEncoder().encode(source).byteLength>MAX_LOCAL_JSON_BYTES)throw Error('ローカルJSONは8MiB以内にしてください。');
 const pkg=parseStrict(source.replace(/^\uFEFF/,''));
 // Viewer resource budgets are separate from the storage Schema.
 const pending=[pkg];let containers=0;while(pending.length){const value=pending.pop();if(value&&typeof value==='object'){if(++containers>100000)throw Error('JSONの構造が表示上限を超えています。');for(const v of Object.values(value))if(v&&typeof v==='object')pending.push(v);}}
 for(const d of Array.isArray(pkg.documents)?pkg.documents:[]){if(d&&typeof d==='object'&&d.kind==='businessDesign'&&((d.objects?.length??0)+(d.activities?.length??0)>2000||(d.relations?.length??0)>5000))throw Error('図の表示上限は2000要素・5000関係です。');}
 const result=validate(pkg);
 const business=pkg.documents.filter((d:BD|Check)=>d.kind==='businessDesign') as BD[];
 if(business.length!==1)throw Error('このViewerは、単一JSON内のBusiness Designが1件の場合に対応します。');
 const bd=business[0];const roleName=(a:ActivityEntry)=>bd.roles?.find(r=>r.id===a.roleId)?.name??a.who;const nodes:GraphNode[]=[...bd.objects.map(o=>({...o,type:'object' as const})),...bd.activities.map(a=>({id:a.id,type:'business' as const,name:a.name,scope:a.scope,why:a.why,when:a.when,who:roleName(a),where:a.where,result:a.result,...(a.problem===null?{}:{problem:a.problem,pain_level:a.painLevel})}))];
 return {sourceFormat:'json',markdown:source,sections:Object.fromEntries(nodes.map(n=>[n.id,''])),activityOrder:bd.activities.map(a=>a.id),
  graph:canonicalJSONGraph({version:1,scope:bd.scope,nodes,relations:bd.relations.map(r=>({kind:r.kind,from:r.fromId,to:r.toId,label:r.label}))}),
  findings:bd.findings.map(f=>({...f,displayId:f.sourceId,targets:f.targetIds,targetNames:f.targetIds.map(id=>[...bd.objects,...bd.activities].find(n=>n.id===id)!.name)})),json:{formatVersion:pkg.formatVersion,revision:pkg.revision,business:bd,checks:pkg.documents.filter((d:BD|Check)=>d.kind==='checkItems'),states:pkg.documents.filter((d:StateDocument)=>d.kind==='stateTransition'),diagnostics:result.diagnostics}};
}
