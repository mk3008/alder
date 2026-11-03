// The Gate A parser/validator is browser-safe; authoring and conversion are not imported.
// @ts-expect-error Gate A supplies JavaScript modules without TypeScript declarations.
import {parseStrict,validate} from '../../tools/document_storage/core.mjs';
// @ts-expect-error Frozen, read-only compatibility validator from the unreleased 0.5 candidate.
import {validate as validate05} from './compat-json-05/core.mjs';
import type {Design} from './graph.ts';
export type StateDocument={id:string;kind:'stateTransition';revision:string;basedOn:{documentId:string;revision:string;verification:'unverified'};objectId:string;states:{id:string;name:string}[];start:string;terminal:string;completeness:string;source:string;transitions:{id:string;sourceId:string;fromId:string;toId:string;activityId:string;exceptionId:string|null;event:string|null;condition:string;conditionLabel?:string;effect:string;path:string;evidence:string;note:string}[]};
import {readViewerDocument,type NormalizedDocument} from './viewer-document.ts';
import type {ConceptModel} from './concept-model';
export type Run={kind:'markdown';value:string}|{kind:'text';value:string}|{kind:'reference';targetId:string;label:string}|{kind:'link';uri:string;label:string};
export type Information={id:string;name:string;description:string};
export type ObjectEntry={id:string;name:string;scope:boolean|null;icon:string;information:(string|Information)[]};
type ActivityBase={id:string;name:string;scope:boolean|null;why:string;when:string;where:string;problem:string|null;painLevel:string|null};
export type LegacyActivity=ActivityBase & {roleId?:string|null;who:string;procedure:string;exception:string|null;result:string};
export type StructuredActivity=ActivityBase & {performers:{objectId:string;roleIds:string[]}[]|null;procedure:{steps:{id:string;text:string;obligation:'required'|'optional';appliesWhen:string|null;performerObjectIds:string[]|null}[];orderRules:({kind:'before';beforeId:string;afterId:string}|{kind:'interchangeable';stepIds:string[]})[]};results:{id:string;text:string}[]};
export type Party={kind:'who'}|{kind:'object';objectId:string};
export type DecisionPointer={decisionId:string;rowId:string};
export type DecisionAxis={id:string;name:string;dataIds:string[];unit?:string;trueLabel?:string;falseLabel?:string};
export type DecisionCondition={axisId:string;kind:'value';operator:'is'|'eq'|'gte'|'lte'|'gt'|'lt';value:string|number|boolean}|{axisId:string;kind:'else'|'any'|'undecided'};
export type DecisionRow={id:string;conditions:DecisionCondition[];result:{kind:'accepted'|'error'|'value'|'undecided';text:string|null;dataIds:string[];exceptionIds:string[]};checkRefs:{checkId:string;coverage:'full'|'partial'}[]};
export type BusinessDecision={id:string;title:string;kind:'authorization'|'validation'|'algorithm';note:string|null;appliesWhen:DecisionPointer|null;axes:DecisionAxis[];rows:DecisionRow[]};
export type ProcedureStep={id:string;action:string;method:string|null;whatDataIds:string[]|null;legacyText?:string;obligation:'required'|'optional';appliesWhen:string|null;effect:string|null;parties?:{from:Party|null;to:Party|null};decisionIds?:string[];whenDecision?:DecisionPointer|null;exchange:{kind:'interaction';phase:'request'|'response'|'not-applicable'|null;direction:'input'|'output';objectId:string;dataIds:string[]|null;relationId:string|null;pairedStepId:string|null}|{kind:'internal'|'unresolved'}};
export type ProcedureActivity=ActivityBase & {who:{kind:'role';roleId:string}|{kind:'system'|'scheduler';name:string}|null;procedure:{steps:ProcedureStep[];orderRules:({kind:'before';beforeId:string;afterId:string}|{kind:'interchangeable';stepIds:string[]})[]};decisions?:BusinessDecision[];results:{id:string;text:string}[]};
export type ActivityEntry=LegacyActivity|StructuredActivity|ProcedureActivity;
export type RelationEntry={id:string;kind:'input'|'output'|'business-exception'|'object-exception';fromId:string;toId:string;label?:string;dataId?:string};
export type Continuity={trigger:string|null;onInterrupt:string|null;outcome:'resume'|'continue'|'end'|null;resumeCondition:string|null;resumeAction:string|null;interruptedAtStepId:string|null;resumeAtStepId:string|null;retainedDataIds:string[]|null};
export type BD={id:string;kind:'businessDesign';revision:string;title:string;preface:string;scope:string;exceptions?:{id:string;activityId:string;name:string;description:string;continuity?:Continuity}[];roles?:{id:string;name:string;color:string}[];data?:{id:string;name:string;items:{informationId:string;condition:string|null}[]}[];objects:ObjectEntry[];activities:ActivityEntry[];relations:RelationEntry[];findings:{id:string;sourceId:string;kind:'question'|'correction';status:'open'|'resolved';scope:'items'|'document'|'unassigned';targetIds:string[];unresolvedTargets:string[];summary:string;content:string}[]};
export type Check={id:string;kind:'checkItems';revision:string;title:string;basedOn:{documentId:string;revision:string;verification:'unverified'};intro:Run[];index:{activityId:string;purpose:string;connections:string;checkIds:string[]}[];sections:{id:string;activityId:string|null;title:string;preamble:Run[]}[];items:{id:string;checkId:string;title:string;reviewState:string;sectionId:string;detailSummary:string;fields:Record<string,Run[]>}[];guarantees:{id:string;sectionId:string;title:string;blocks:({kind:'prose';content:Run[]}|{kind:'example';exampleId:string})[]}[];examples:{id:string;guaranteeId:string;columns:string[];rows:Run[][][]}[];notes:{id:string;title:string;content:Run[]}[]};
export type DocumentModel={formatVersion:string;revision:string;business:BD;checks:Check[];states:StateDocument[];concepts?:ConceptModel[];sources?:{documentId:string;revision:string;sha256:string;uri:string}[];externalDocuments?:{id:string;kind:'businessDesign';revision:string;activities:{id:string;name:string}[]}[];diagnostics:string[]};

/** Direct projection into the existing display model. No Markdown document is generated.
 * `markdown` is the legacy session field for original source bytes, including JSON.
 * The projected graph uses persistent IDs; it is NOT a Business Graph v1 export.
 */
export const MAX_LOCAL_JSON_BYTES=8*1024*1024;
export function isJSONSource(source:string){return /^\s*[\[{]/.test(source);}
export function parseJSONDocument(source:string):Design{
 return readViewerDocument(normalizeJSONDocument(source));
}
/** Native JSON only. Compatibility dispatch lives at the input boundary. */
export function normalizeJSONDocument(source:string):NormalizedDocument{

 if(new TextEncoder().encode(source).byteLength>MAX_LOCAL_JSON_BYTES)throw Error('ローカルJSONは8MiB以内にしてください。');
 const pkg=parseStrict(source.replace(/^\uFEFF/,''));
 return projectJSONPackage(pkg,source);
}
export function validateJSONBudget(pkg:any){
 // Viewer resource budgets are separate from the storage Schema.
 const pending=[pkg];let containers=0;while(pending.length){const value=pending.pop();if(value&&typeof value==='object'){if(++containers>100000)throw Error('JSONの構造が表示上限を超えています。');for(const v of Object.values(value))if(v&&typeof v==='object')pending.push(v);}}
 for(const d of Array.isArray(pkg?.documents)?pkg.documents:[]){if(d&&typeof d==='object'&&d.kind==='businessDesign'&&((d.objects?.length??0)+(d.activities?.length??0)>2000||(d.relations?.length??0)>5000))throw Error('図の表示上限は2000要素・5000関係です。');}
}
export function projectJSONPackage(pkg:any,source:string):NormalizedDocument{
 if(!pkg||!['0.4','0.5','0.6','0.7'].includes(pkg.formatVersion))throw Error('JSON専用経路はformatVersion 0.4、旧候補0.5または候補0.6・0.7が必要です（旧形式は互換入力adapter）。');
 validateJSONBudget(pkg);
 const result=pkg.formatVersion==='0.5'?validate05(pkg):validate(pkg);
 const business=pkg.documents.filter((d:BD|Check)=>d.kind==='businessDesign') as BD[];
 if(business.length!==1)throw Error('このViewerは、単一JSON内のBusiness Designが1件の場合に対応します。');
 const bd=business[0];
 return {original:{format:'json',text:source},data:{version:1,formatVersion:pkg.formatVersion,revision:pkg.revision,business:bd,checks:pkg.documents.filter((d:BD|Check)=>d.kind==='checkItems'),states:pkg.documents.filter((d:StateDocument)=>d.kind==='stateTransition'),concepts:pkg.documents.filter((d:ConceptModel)=>d.kind==='conceptModel'),sources:pkg.sources,externalDocuments:pkg.externalDocuments,diagnostics:result.diagnostics}};
}
