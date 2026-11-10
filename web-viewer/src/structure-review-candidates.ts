// Optional authored Preview metadata. It never derives business meaning or
// changes the source mappings, review states, or nullability proposals.
export type StructureReviewCandidate={purpose?:string;sample?:string;perspectives:string[];reason:string;perspectiveReason:string;sampleReason?:string;source:string};
const object=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==='object'&&!Array.isArray(value);
const present=(value:unknown):value is string=>typeof value==='string'&&!!value.trim();
export function structureReviewCandidates(meta:unknown){
 const catalog=object(meta)&&object(meta.previewStructureReview)?meta.previewStructureReview:undefined;
 const fields=catalog?.format==='alder-preview-structure-review/1'&&catalog.status==='hypothesis'&&object(catalog.fields)?catalog.fields:undefined;
 return {enabled:!!fields,get(id:string):StructureReviewCandidate|undefined{
  if(!fields||!Object.hasOwn(fields,id))return;
  const entry=fields[id];if(!object(entry)||entry.status!=='hypothesis'||!present(entry.source)||!present(entry.reason)||!present(entry.perspectiveReason))return;
  if(!Array.isArray(entry.perspectives)||!entry.perspectives.length||entry.perspectives.length>3||new Set(entry.perspectives).size!==entry.perspectives.length||!entry.perspectives.every(role=>['依頼者','設計者','開発者'].includes(role)))return;
  if(entry.purpose!==undefined&&!present(entry.purpose))return;
  let sample:string|undefined;
  if(Object.hasOwn(entry,'sample')){
   if(!present(entry.sampleReason))return;
   try{sample=typeof entry.sample==='string'?(entry.sample||'""'):JSON.stringify(entry.sample);}catch{return;}
   if(sample===undefined)return;
  }
  return {purpose:entry.purpose as string|undefined,sample,perspectives:entry.perspectives as string[],reason:entry.reason,perspectiveReason:entry.perspectiveReason,sampleReason:entry.sampleReason as string|undefined,source:entry.source};
 }};
}
