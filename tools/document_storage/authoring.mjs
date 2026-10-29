/** Gate B operation guards. No storage Schema change; evidence is operation input, not approval in the package. */
import {createHash} from 'node:crypto';
import {validate,inventory,demand} from './core.mjs';
const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
export const fingerprint=v=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(canonical(v))).digest('hex');
const equal=(a,b)=>fingerprint(a)===fingerprint(b);
const receipt=r=>r&&typeof r.source==='string'&&r.source.trim()&&typeof r.quote==='string'&&r.quote.trim();
export function checkMeaning(pkg,item){
 const doc=pkg.documents.find(d=>d.items?.some(i=>i.id===item.id)),inv=inventory(pkg),seen=new Map();
 const primary=fields=>Object.fromEntries(Object.entries(fields).filter(([k])=>!['evidence','derivation','confidence','related','testEvidence'].includes(k)));
 const normalize=(e,type)=>type==='check'?{id:e.id,title:e.title,fields:primary(e.fields)}:type==='section'?{id:e.id,activityId:e.activityId,preamble:e.preamble}:e;
 const visit=v=>{if(!v||typeof v!=='object')return;for(const [k,value]of Object.entries(v)){if(['targetId','exampleId'].includes(k)&&typeof value==='string'&&!seen.has(value)){const target=normalize(inv.map.get(value),inv.types.get(value));seen.set(value,target);visit(target);}else if(typeof value==='object')visit(value);}};
 const fields=primary(item.fields);visit(fields);const section=doc.sections.find(s=>s.id===item.sectionId);visit(section.preamble);
 return {title:item.title,fields,sectionPreamble:section.preamble,dependencies:[...seen].sort(([a],[b])=>a.localeCompare(b)).map(([,e])=>e)};
}
export const meaningHash=(pkg,item)=>fingerprint(checkMeaning(pkg,item));
function confirmedBD(pkg,check,operation){
 const r=operation.bdConfirmations?.find(r=>r.documentId===check.basedOn.documentId&&r.revision===check.basedOn.revision);
 demand(r&&receipt(r.evidence),'Human Business Design confirmation for this exact revision is required');
 demand(pkg.documents.some(d=>d.id===r.documentId&&d.kind==='businessDesign'),'Direct JSON authoring requires an in-package Business Design');
}
export function guardAuthoring(previous,next,operation={}){
 validate(next);if(previous)validate(previous);
 const allowed=['expectedSha256','expectedRevision','bdConfirmations','humanDecisions','migration'];
 const structuredUpgrade=operation.migration==='exceptions-0.4'&&previous&&['0.1','0.2','0.3'].includes(previous.formatVersion)&&next.formatVersion==='0.4';
 const d2Upgrade=operation.migration==='structure-0.5'&&previous?.formatVersion==='0.4'&&next.formatVersion==='0.5';
 demand(!operation.migration||structuredUpgrade||d2Upgrade||operation.migration==='roles-0.3'&&previous&&['0.1','0.2'].includes(previous.formatVersion)&&next.formatVersion==='0.3','Unsupported migration operation');
 if(previous)demand(previous.formatVersion===next.formatVersion||!!operation.migration,'Package contract changed: version change requires explicit migration');
 demand(Object.keys(operation).every(k=>allowed.includes(k)),'Unknown authoring operation field');
 const decisions=operation.humanDecisions??[];demand(Array.isArray(decisions),'Human decisions must be an array');
 demand(new Set(decisions.map(d=>d.id)).size===decisions.length,'Duplicate human decision');
 const old=previous?inventory(previous):null,fresh=inventory(next),changedDocs=new Set();
 if(previous){
  demand(operation.expectedRevision===previous.revision,'Package revision conflict');demand(previous.revision!==next.revision,'New package revision required');
  for(const [id,e]of old.map){demand(fresh.map.has(id),'Existing ID was removed or replaced: '+id);demand(fresh.types.get(id)===old.types.get(id)&&fresh.owner.get(id)===old.owner.get(id)&&fresh.parent.get(id)===old.parent.get(id),'Identity type/owner changed');const n=fresh.map.get(id);if(old.types.get(id)==='exception')demand(e.activityId===n.activityId,'Exception Activity ownership changed');demand(e.checkId===n.checkId&&e.sourceId===n.sourceId,'Source identity changed');}
  demand(equal(previous.externalDocuments,next.externalDocuments),'External reference catalog is read-only');
  for(const s of previous.sources)demand(next.sources.some(n=>equal(s,n)),'Import provenance must be retained');
  for(const d of next.documents){const p=previous.documents.find(p=>p.id===d.id);if(!p){changedDocs.add(d.id);continue;}demand((d.schemaVersion===p.schemaVersion||d2Upgrade&&d.kind==='businessDesign'&&p.schemaVersion==='0.3'&&d.schemaVersion==='0.4'||structuredUpgrade&&((d.kind==='businessDesign'&&d.schemaVersion==='0.3')||(d.kind==='stateTransition'&&d.schemaVersion==='0.2'))||operation.migration==='roles-0.3'&&d.kind==='businessDesign'&&p.schemaVersion==='0.1'&&d.schemaVersion==='0.2')&&d.kind===p.kind,'Document contract changed');const changed=!equal({...d,revision:''},{...p,revision:''});demand(changed?d.revision!==p.revision:d.revision===p.revision,'Document revision must track actual changes: '+d.id);if(changed)changedDocs.add(d.id);}
 }
 const used=new Set();
 for(const d of next.documents.filter(d=>d.kind==='checkItems')){
  const prior=previous?.documents.find(p=>p.id===d.id),needsBD=!prior||changedDocs.has(d.id);
  if(needsBD)confirmedBD(next,d,operation);
  for(const item of d.items){const before=prior?.items.find(p=>p.id===item.id),decision=decisions.find(r=>r.id===item.id);
   const changed=before&&!equal(checkMeaning(previous,before),checkMeaning(next,item));
   if(decision){demand(before,'New drafts cannot be immediately human-confirmed');demand(receipt(decision.evidence),'Explicit human feedback source and quotation required');demand(decision.meaningSha256===meaningHash(next,item),'Human decision is for a different Check expectation');demand(decision.state===item.reviewState,'Human decision/state mismatch');confirmedBD(next,d,operation);used.add(item.id);}
   else if(!before)demand(['未レビュー','要確認'].includes(item.reviewState),'New Check must be unreviewed or undecided');
   else if(changed)demand(item.reviewState===(before.reviewState==='要修正'?'要修正':'要確認'),'Changed expectation needs renewed human review; do not carry confirmation');
   else demand(before.reviewState===item.reviewState,'Human review state cannot change without explicit feedback');
  }
 }
 demand(used.size===decisions.length,'Human decision target is unknown');
 return {valid:true,approval:'not-evaluated',diagnostics:validate(next).diagnostics};
}
