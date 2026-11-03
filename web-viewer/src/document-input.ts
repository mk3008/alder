/** Compatibility dispatch only. Native JSON features import json-document, never this module. */
// @ts-expect-error Browser-portable shared validator.
import {parseStrict} from '../../tools/document_storage/core.mjs';
// @ts-expect-error Versioned legacy input only.
import {readLegacyPackage} from '../../tools/document_storage/legacy-json.mjs';
// @ts-expect-error Browser-portable named-plan validator.
import {validateNamedPlans} from '../../tools/document_storage/named-plans.mjs';
import {normalizeMarkdown} from './legacy-document.ts';
import {isJSONSource,MAX_LOCAL_JSON_BYTES,validateJSONBudget,projectJSONPackage} from './json-document.ts';
import {readViewerDocument,type NormalizedDocument} from './viewer-document.ts';
import type {Design} from './graph';
export function normalizeDocument(source:string,selectedPlan?:string):NormalizedDocument{
 if(!isJSONSource(source)){if(selectedPlan!==undefined)throw Error('案を含まない文書です。');return normalizeMarkdown(source);}
 // Apply budgets before parsing, including old input versions.
 if(new TextEncoder().encode(source).byteLength>MAX_LOCAL_JSON_BYTES)throw Error('ローカルJSONは8MiB以内にしてください。');
 let pkg=parseStrict(source.replace(/^\uFEFF/,''));
 validateJSONBudget(pkg);
 let namedPlans:NormalizedDocument['namedPlans'];
 if(pkg?.format==='alder-named-plans'){
  validateNamedPlans(pkg);
  for(const plan of pkg.plans){
   validateJSONBudget(plan.package);
   if(plan.package.documents.filter((document:{kind:string})=>document.kind==='businessDesign').length!==1)throw Error('業務案 '+plan.id+' にはBusiness Designが1件必要です。');
  }
  const selected=selectedPlan??pkg.plans[0].id,plan=pkg.plans.find((value:{id:string})=>value.id===selected);
  if(!plan)throw Error('指定した業務案がありません: '+selected);
  namedPlans={selected,choices:pkg.plans.map(({id,name}:{id:string;name:string})=>({id,name}))};pkg=plan.package;
 }else if(selectedPlan!==undefined)throw Error('指定した業務案がありません: '+selectedPlan);
 if(['0.1','0.2','0.3'].includes(pkg?.formatVersion)){
  const normalized=projectJSONPackage(readLegacyPackage(pkg),source);
  // A derived storage catalog must not turn frozen pre-Role input's name colors into gray.
  // This is a viewing projection only; do not infer Role identities or rewrite storage JSON.
  if(['0.1','0.2'].includes(pkg.formatVersion)){
   const bd=normalized.data.business as typeof normalized.data.business & {schemaVersion:string};
   bd.schemaVersion='0.1';delete bd.roles;for(const activity of bd.activities)if('roleId' in activity)delete activity.roleId;
   normalized.data.diagnostics=normalized.data.diagnostics.filter(d=>!d.startsWith('Role未確定:'));
  }
  return {...normalized,...(namedPlans?{namedPlans}:{})};
 }
 return {...projectJSONPackage(pkg,source),...(namedPlans?{namedPlans}:{})};
}
export function parseDocument(source:string,selectedPlan?:string):Design{return readViewerDocument(normalizeDocument(source,selectedPlan));}
export async function readDesignFile(file:File):Promise<Design>{
 const expectedJSON=/\.json$/i.test(file.name)||/json/i.test(file.type);
 if(expectedJSON&&file.size>MAX_LOCAL_JSON_BYTES)throw Error('ローカルJSONは8MiB以内にしてください。');
 const source=await file.text();if(expectedJSON&&!isJSONSource(source))throw Error('JSONファイルの本文を確認してください。');return parseDocument(source);
}

export {isJSONSource,MAX_LOCAL_JSON_BYTES} from './json-document.ts';
