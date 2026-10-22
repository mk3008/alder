import {schema} from './schema.mjs';
export const demand=(ok,message)=>{if(!ok)throw Error(message);};
// JSON.parse itself discards duplicate keys. This preflight rejects them before parsing.
export function parseStrict(text){
 let i=0;const ws=()=>{while(/\s/.test(text[i]??'')&&i<text.length)i++;};
 const string=()=>{const start=i++;while(i<text.length){const c=text[i++];if(c==='"')return JSON.parse(text.slice(start,i));if(c==='\\')i++;}throw Error('Unclosed JSON string');};
 const value=(depth=0)=>{demand(depth<=64,'JSON depth limit');ws();const c=text[i];
  if(c==='"'){string();return;}
  if(c==='{'){i++;ws();const keys=new Set();if(text[i]==='}'){i++;return;}while(i<text.length){ws();demand(text[i]==='"','JSON object key required');const key=string();demand(!keys.has(key),'Duplicate JSON key: '+key);keys.add(key);ws();demand(text[i++]===':','JSON colon required');value(depth+1);ws();const end=text[i++];if(end==='}')return;demand(end===',','JSON comma required');}throw Error('Truncated object');}
  if(c==='['){i++;ws();if(text[i]===']'){i++;return;}while(i<text.length){value(depth+1);ws();const end=text[i++];if(end===']')return;demand(end===',','JSON array comma required');}throw Error('Truncated array');}
  const start=i;while(i<text.length&&!/[\s,\]}]/.test(text[i]))i++;demand(i>start,'JSON value required');JSON.parse(text.slice(start,i));
 };value();ws();demand(i===text.length,'Trailing JSON content');return JSON.parse(text);
}
export function validateShape(value,s=schema,path='$'){
 if(s.$ref)return validateShape(value,schema.$defs[s.$ref.split('/').at(-1)],path);
 if(s.anyOf){const errors=[];for(const alt of s.anyOf){try{validateShape(value,alt,path);return;}catch(e){errors.push(e.message);}}throw Error('No schema variant at '+path+': '+errors.join('; '));}
 if(s.enum)demand(s.enum.includes(value),'Invalid enum at '+path);
 if(s.type){const type=value===null?'null':Array.isArray(value)?'array':typeof value;demand(type===s.type,'Invalid type at '+path);}
 if(s.minLength)demand(value.length>=s.minLength,'Empty field at '+path);
 if(s.pattern)demand(new RegExp(s.pattern).test(value),'Invalid pattern at '+path);
 if(s.type==='object'){for(const k of s.required??[])demand(Object.hasOwn(value,k),'Missing '+path+'.'+k);for(const k of Object.keys(value)){demand(Object.hasOwn(s.properties,k),'Unknown field '+path+'.'+k);validateShape(value[k],s.properties[k],path+'.'+k);}}
 if(s.type==='array')value.forEach((v,i)=>validateShape(v,s.items,path+'['+i+']'));
}
export function inventory(pkg){
 const map=new Map(),owner=new Map(),types=new Map();
 const add=(e,doc,type)=>{demand(!map.has(e.id),'Duplicate ID: '+e.id);map.set(e.id,e);owner.set(e.id,doc.id);types.set(e.id,type);};
 for(const d of pkg.documents){add(d,d,'document');for(const [key,type] of Object.entries({objects:'object',activities:'activity',relations:'relation',findings:'finding',sections:'section',guarantees:'guarantee',examples:'example',items:'check',notes:'note'}))for(const e of d[key]??[])add(e,d,type);}
 for(const d of pkg.externalDocuments){add(d,d,'document');for(const a of d.activities)add(a,d,'activity');}
 return {map,owner,types};
}
export function validate(pkg){
 validateShape(pkg);demand(pkg.documents.length>0,'Document required');const {map,owner,types}=inventory(pkg),diagnostics=[...pkg.diagnostics];
 const target=(id,type,doc)=>{demand(map.has(id),'Dangling reference: '+id);if(type)demand(types.get(id)===type,'Reference type mismatch: '+id);if(doc)demand(owner.get(id)===doc,'Cross-document mismatch: '+id);return map.get(id);};
 const rich=(runs,doc)=>{for(const r of runs){if(r.kind==='reference'){target(r.targetId,null,doc);demand(['document','section','guarantee','example','check','note'].includes(types.get(r.targetId)),'Invalid rich reference target');}if(r.kind==='link')demand(/^https:\/\//.test(r.uri),'Unsafe external link');}};
 for(const d of pkg.documents){
  if(d.kind==='businessDesign'){
   demand(d.activities.length>0,'Activity required');const names=[...d.objects,...d.activities].map(x=>x.name);demand(new Set(names).size===names.length,'Duplicate visible name');demand(names.every(n=>n===n.trim()&&!['\n','\r',' — ',' → ','<!--'].some(t=>n.includes(t))),'Invalid Graph-visible name');for(const o of d.objects)demand(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(o.icon),'Invalid icon');
   for(const a of d.activities){demand((a.problem===null)===(a.painLevel===null),'Problem/Pain pair mismatch');}
   const endpoints={input:['object','activity'],output:['activity','object'],'business-exception':['activity','activity'],'object-exception':['object','object']};const seen=new Set();
   for(const r of d.relations){target(r.fromId,endpoints[r.kind][0],d.id);target(r.toId,endpoints[r.kind][1],d.id);const key=JSON.stringify([r.kind,r.fromId,r.toId,r.label]);demand(!seen.has(key),'Duplicate relation');seen.add(key);}
   for(const f of d.findings){demand(f.scope==='items'?f.targetIds.length+f.unresolvedTargets.length>0:!f.targetIds.length&&!f.unresolvedTargets.length,'Finding scope mismatch');demand(new Set(f.targetIds).size===f.targetIds.length,'Duplicate Finding target');for(const t of f.targetIds){target(t,null,d.id);demand(['object','activity'].includes(types.get(t)),'Invalid Finding target');}if(f.unresolvedTargets.length)diagnostics.push('Finding未解決: '+f.sourceId);}
  }else{
   const bd=target(d.basedOn.documentId,'document');demand(bd.kind==='businessDesign','Check source is not BD');demand(bd.revision===d.basedOn.revision,'Stale Check source revision');diagnostics.push('Check原典の意味対応は未確認: '+d.id);
   const rowActs=new Set();for(const row of d.index){target(row.activityId,'activity',bd.id);demand(!rowActs.has(row.activityId),'Duplicate Activity index');rowActs.add(row.activityId);demand(new Set(row.checkIds).size===row.checkIds.length,'Duplicate Check binding');for(const id of row.checkIds)target(id,'check',d.id);}
   for(const s of d.sections){target(s.activityId,'activity',bd.id);rich(s.preamble,d.id);}
   for(const g of d.guarantees){target(g.sectionId,'section',d.id);for(const b of g.blocks)if(b.kind==='prose')rich(b.content,d.id);else{const e=target(b.exampleId,'example',d.id);demand(e.guaranteeId===g.id,'Example owner mismatch');}}
   for(const ex of d.examples){target(ex.guaranteeId,'guarantee',d.id);demand(ex.columns.length>0,'Example columns required');for(const row of ex.rows){demand(row.length===ex.columns.length,'Example column mismatch');for(const cell of row)rich(cell,d.id);}}
   for(const item of d.items){target(item.sectionId,'section',d.id);demand(item.fields.guarantee?.length||item.fields.condition?.length&&item.fields.expectedResult?.length,'Check guarantee required');for(const runs of Object.values(item.fields))rich(runs,d.id);demand(d.index.some(row=>row.checkIds.includes(item.id)),'Unbound Check');}
   for(const n of d.notes)rich(n.content,d.id);rich(d.intro,d.id);
  }
 }
 const sourceKeys=new Set();for(const s of pkg.sources){target(s.documentId,'document');const key=s.documentId+'@'+s.revision;demand(!sourceKeys.has(key),'Duplicate source descriptor');sourceKeys.add(key);}
 for(const d of pkg.externalDocuments){demand(pkg.sources.some(s=>s.documentId===d.id&&s.revision===d.revision),'External source revision missing');demand(d.activities.length>0,'External activity catalog required');diagnostics.push('外部原典はID・表示名の参照目録のみ。本文・業務意味・ハッシュの内容照合は未検証: '+d.id);}
 return {diagnostics,entities:map.size};
}
export function graphV1(pkg,documentId){
 const d=pkg.documents.find(d=>d.id===documentId&&d.kind==='businessDesign');demand(d,'BD not found');const names=new Map([...d.objects,...d.activities].map(n=>[n.id,n.name]));
 const nodes=[...d.objects.map(o=>({id:o.name,type:'object',name:o.name,scope:o.scope,icon:o.icon,information:o.information})),...d.activities.map(a=>({id:a.name,type:'business',name:a.name,scope:a.scope,why:a.why,when:a.when,who:a.who,where:a.where,result:a.result,...(a.problem===null?{}:{problem:a.problem,pain_level:a.painLevel})}))];
 return {version:1,scope:d.scope,nodes,relations:d.relations.map(r=>({kind:r.kind,from:names.get(r.fromId),to:names.get(r.toId),label:r.label}))};
}
export function update(pkg,id,changes,expectedRevision,nextRevision){
 const clone=structuredClone(pkg),{map,owner}=inventory(clone);demand(map.has(id),'Unknown ID');const d=clone.documents.find(x=>x.id===owner.get(id));demand(d,'External reference catalog is read-only');demand(d.revision===expectedRevision,'Revision conflict');demand(!Object.hasOwn(changes,'id'),'ID is immutable');Object.assign(map.get(id),changes);d.revision=nextRevision;clone.revision=nextRevision;validate(clone);return clone;
}
export const stringify=pkg=>JSON.stringify(pkg,null,2)+'\n';
export function select(pkg,id){const i=inventory(pkg);demand(i.map.has(id),'Unknown ID');return i.map.get(id);}
