import type {ConceptModel} from './concept-model';
export type StructureReviewCandidate={purpose?:string;sample?:string;perspectives:string[]};
export type ReviewProjection={enabled:boolean;get:(id:string)=>StructureReviewCandidate|undefined};
export const noStructureReview:ReviewProjection={enabled:false,get:()=>undefined};
const object=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const present=(v:unknown):v is string=>typeof v==='string'&&!!v.trim();
const keys=(v:Record<string,unknown>,allowed:string[])=>Object.keys(v).every(k=>allowed.includes(k));
export function canonicalReviewJSON(value:unknown):string{
 if(Array.isArray(value))return '['+value.map(canonicalReviewJSON).join(',')+']';
 if(object(value))return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonicalReviewJSON(value[k])).join(',')+'}';
 return JSON.stringify(value);
}
export function reviewModelBytes(model:ConceptModel){
 const copy=JSON.parse(JSON.stringify(model)) as ConceptModel;if(object(copy.meta))delete copy.meta.previewStructureReview;
 return new TextEncoder().encode(canonicalReviewJSON(copy));
}
export async function reviewDigest(bytes:Uint8Array){
 const result=await globalThis.crypto.subtle.digest('SHA-256',new Uint8Array(bytes));
 return Array.from(new Uint8Array(result),b=>b.toString(16).padStart(2,'0')).join('');
}
/** Consumes a private input snapshot. Origin bytes are checked by the builder,
 * never fetched or authenticated by the Viewer. No business meaning is inferred. */
export async function structureReviewCandidates(model:ConceptModel,digest=reviewDigest):Promise<{projection:ReviewProjection;code:string}>{
 const fail=(code:string)=>({projection:noStructureReview,code});
 const meta=model.meta,catalog=object(meta)?meta.previewStructureReview:undefined;
 if(catalog===undefined)return fail('absent');
 if(!object(catalog)||catalog.format!=='alder-preview-structure-review/2'||!keys(catalog,['format','basedOn','origin','fields']))return fail('catalog-shape');
 const bound=catalog.basedOn,origin=catalog.origin;
 if(!object(bound)||!keys(bound,['kind','documentId','revision','modelSha256'])||bound.kind!=='conceptModel'||!present(bound.modelSha256)||!/^[a-f0-9]{64}$/.test(bound.modelSha256))return fail('binding-shape');
 if(bound.documentId!==model.id||bound.revision!==model.revision)return fail('wrong-model');
 if(!object(origin)||!keys(origin,['repository','commit','path','sha256'])||!present(origin.repository)||!present(origin.path)||typeof origin.commit!=='string'||!/^[a-f0-9]{40}$/.test(origin.commit)||typeof origin.sha256!=='string'||!/^[a-f0-9]{64}$/.test(origin.sha256))return fail('origin-shape');
 if(!Array.isArray(catalog.fields))return fail('fields-shape');
 const concepts=new Map<string,ConceptModel['concepts'][number]>(),infos=new Map<string,string>(),relations=new Map<string,ConceptModel['relations'][number]>(),mappings=new Map<string,Record<string,unknown>>();
 for(const c of model.concepts){if(concepts.has(c.id))return fail('duplicate-concept');concepts.set(c.id,c);for(const i of c.information){if(infos.has(i.id))return fail('duplicate-information');infos.set(i.id,c.id);}}
 for(const r of model.relations){if(relations.has(r.id))return fail('duplicate-relation');relations.set(r.id,r);}
 if(!object(meta)||!Array.isArray(meta.fieldMappings))return fail('missing-mappings');
 for(const m of meta.fieldMappings){if(!object(m)||!present(m.informationId)||mappings.has(m.informationId))return fail('duplicate-or-invalid-mapping');if(!infos.has(m.informationId))return fail('missing-mapping-target');mappings.set(m.informationId,m);}
 const values=new Map<string,StructureReviewCandidate>();
 for(const entry of catalog.fields){
  if(!object(entry)||!keys(entry,['target','purpose','sample','perspectives'])||!object(entry.target)||!keys(entry.target,['conceptId','informationId']))return fail('entry-shape');
  const target=entry.target,id=target.informationId;
  if(!present(id)||infos.get(id)!==target.conceptId)return fail('missing-target');
  if(values.has(id))return fail('duplicate-target');
  const mapping=mappings.get(id);if(!mapping||!Array.isArray(mapping.relationIds))return fail('missing-mapping');
  const dependencies=mapping.representation==='relationKey'?mapping.relationKeyIds:mapping.relationIds;
  if(!Array.isArray(dependencies))return fail('missing-dependency');
  for(const rid of dependencies){const r=typeof rid==='string'?relations.get(rid):undefined;if(!r||!concepts.has(r.fromConceptId)||!concepts.has(r.toConceptId)||(r.fromConceptId!==target.conceptId&&r.toConceptId!==target.conceptId))return fail('missing-dependency');}
  if(entry.purpose!==undefined&&!present(entry.purpose))return fail('purpose-shape');
  if(!Array.isArray(entry.perspectives)||!entry.perspectives.length||entry.perspectives.length>3||new Set(entry.perspectives).size!==entry.perspectives.length||!entry.perspectives.every(r=>['依頼者','設計者','開発者'].includes(r)))return fail('perspectives-shape');
  let sample:string|undefined;
  if(entry.sample!==undefined){
   const s=entry.sample;if(!object(s)||!keys(s,['value','coverage','when'])||!Object.hasOwn(s,'value')||!['field-value','document-fragment'].includes(String(s.coverage)))return fail('sample-shape');
   if(s.coverage==='document-fragment'&&(!Array.isArray(s.value)||!s.value.every(object)))return fail('fragment-shape');
   const type=mapping.valueType,value=s.value,domain=mapping.valueDomain;
   if((type==='string[]'&&(!Array.isArray(value)||!value.every(v=>typeof v==='string')))||(type==='array'&&!Array.isArray(value))||(type==='boolean'&&typeof value!=='boolean')||(typeof type==='string'&&type.startsWith('object')&&!object(value))||(typeof type==='string'&&type.startsWith('string')&&!type.includes('number')&&!type.includes('boolean')&&type!=='string[]'&&typeof value!=='string'))return fail('sample-type');
   if(object(domain)&&Array.isArray(domain.values)&&!domain.values.some(v=>object(v)&&canonicalReviewJSON(v.value)===canonicalReviewJSON(value)))return fail('sample-domain');
   if(s.when!==undefined){if(!Array.isArray(s.when)||!s.when.length)return fail('condition-shape');for(const condition of s.when){if(!object(condition)||!keys(condition,['target','predicate'])||condition.predicate!=='nonempty'||!object(condition.target)||!keys(condition.target,['conceptId','informationId'])||infos.get(String(condition.target.informationId))!==condition.target.conceptId||condition.target.conceptId!==target.conceptId)return fail('missing-dependency');}}
   try{sample=typeof s.value==='string'?(s.value||'""'):JSON.stringify(s.value);}catch{return fail('sample-shape');}if(sample===undefined)return fail('sample-shape');
  }
  values.set(id,{purpose:entry.purpose as string|undefined,sample,perspectives:[...entry.perspectives] as string[]});
 }
 if(values.size!==infos.size)return fail('incomplete-targets');
 try{if(await digest(reviewModelBytes(model))!==bound.modelSha256)return fail('model-content-mismatch');}catch{return fail('digest-unavailable');}
 return {code:'valid',projection:{enabled:true,get:id=>values.get(id)}};
}
