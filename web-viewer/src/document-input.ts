/** Compatibility dispatch only. Native JSON features import json-document, never this module. */
// @ts-expect-error Browser-portable shared validator.
import {parseStrict} from '../../tools/document_storage/core.mjs';
// @ts-expect-error Versioned legacy input only.
import {readLegacyPackage} from '../../tools/document_storage/legacy-json.mjs';
import {normalizeMarkdown} from './legacy-document.ts';
import {isJSONSource,MAX_LOCAL_JSON_BYTES,validateJSONBudget,projectJSONPackage} from './json-document.ts';
import {readViewerDocument,type NormalizedDocument} from './viewer-document.ts';
import type {Design} from './graph';
export function normalizeDocument(source:string):NormalizedDocument{
 if(!isJSONSource(source))return normalizeMarkdown(source);
 // Apply budgets before parsing, including old input versions.
 if(new TextEncoder().encode(source).byteLength>MAX_LOCAL_JSON_BYTES)throw Error('ローカルJSONは8MiB以内にしてください。');
 const pkg=parseStrict(source.replace(/^\uFEFF/,''));
 validateJSONBudget(pkg);
 if(['0.1','0.2','0.3'].includes(pkg?.formatVersion)){
  const normalized=projectJSONPackage(readLegacyPackage(pkg),source);
  // A derived storage catalog must not turn frozen pre-Role input's name colors into gray.
  // This is a viewing projection only; do not infer Role identities or rewrite storage JSON.
  if(['0.1','0.2'].includes(pkg.formatVersion)){
   const bd=normalized.data.business as typeof normalized.data.business & {schemaVersion:string};
   bd.schemaVersion='0.1';delete bd.roles;for(const activity of bd.activities)if('roleId' in activity)delete activity.roleId;
   // The adapter's derived Role catalog was removed for pre-Role input. Its
   // synthetic Role diagnostics must not be revalidated as source claims.
   normalized.data.diagnostics=normalized.data.diagnostics.filter(d=>!d.startsWith('Role未確定:'));
  }
  return normalized;
 }
 return projectJSONPackage(pkg,source);
}
export function parseDocument(source:string):Design{return readViewerDocument(normalizeDocument(source));}
export async function readDesignFile(file:File):Promise<Design>{
 const expectedJSON=/\.json$/i.test(file.name)||/json/i.test(file.type);
 if(expectedJSON&&file.size>MAX_LOCAL_JSON_BYTES)throw Error('ローカルJSONは8MiB以内にしてください。');
 const source=await file.text();if(expectedJSON&&!isJSONSource(source))throw Error('JSONファイルの本文を確認してください。');return parseDocument(source);
}

export {isJSONSource,MAX_LOCAL_JSON_BYTES} from './json-document.ts';
