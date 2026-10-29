import {validate,inventory,demand} from './core.mjs';
const unique=(xs,message)=>demand(new Set(xs).size===xs.length,message);

/** Typed 0.5 invariants. Natural-language conditions are never executed. */
export function validateStructure(bd,inv,target){
 const ref=(id,type,parent)=>{const value=target(id,type,bd.id);if(parent)demand(inv.parent.get(id)===parent,'Structure owner mismatch: '+id);return value;};
 unique(bd.data.map(d=>d.name),'Duplicate Data name');
 for(const d of bd.data){demand(d.name===d.name.trim(),'Data name whitespace');unique(d.items.map(i=>i.informationId),'Duplicate Data information');for(const i of d.items)ref(i.informationId,'information');}
 for(const a of bd.activities){
  if(a.performers!==null){unique(a.performers.map(p=>p.objectId),'Duplicate performer');for(const p of a.performers){ref(p.objectId,'object');unique(p.roleIds,'Duplicate performer Role');for(const role of p.roleIds)ref(role,'role');}}
  let unresolved=a.performers===null;
  for(const s of a.procedure.steps){
   if(s.performerObjectIds!==null){unique(s.performerObjectIds,'Duplicate Step performer');for(const id of s.performerObjectIds)demand(a.performers?.some(p=>p.objectId===id),'Step performer outside Activity assignment: '+id);}
   else if(a.performers?.length!==1)unresolved=true;
  }
  if(unresolved)demand(bd.findings.some(f=>f.status==='open'&&f.scope==='items'&&f.targetIds.includes(a.id)),'Unresolved performer requires an open Activity Finding: '+a.id);
  const ids=a.procedure.steps.map(s=>s.id),edges=new Map(ids.map(id=>[id,[]])),before=new Set(),swaps=[];
  for(const rule of a.procedure.orderRules){
   if(rule.kind==='before'){
    ref(rule.beforeId,'step',a.id);ref(rule.afterId,'step',a.id);
    demand(rule.beforeId!==rule.afterId,'Self Step order');const key=JSON.stringify([rule.beforeId,rule.afterId]);demand(!before.has(key),'Duplicate Step order');before.add(key);edges.get(rule.beforeId).push(rule.afterId);
    demand(ids.indexOf(rule.beforeId)<ids.indexOf(rule.afterId),'Standard Step order contradicts before constraint');
   }else{unique(rule.stepIds,'Duplicate interchangeable Step');for(const id of rule.stepIds)ref(id,'step',a.id);swaps.push(rule.stepIds);}
  }
  // Iterative traversal avoids a JS recursion limit for a long but valid Procedure.
  const reaches=(from,to)=>{const pending=[from],seen=new Set();while(pending.length){const id=pending.pop();if(seen.has(id))continue;seen.add(id);for(const n of edges.get(id)){if(n===to)return true;pending.push(n);}}return false;};
  for(const id of ids)demand(!reaches(id,id),'Step order cycle');
  const groups=new Set();for(const group of swaps){const key=JSON.stringify([...group].sort());demand(!groups.has(key),'Duplicate interchangeable group');groups.add(key);for(const x of group)for(const y of group)if(x!==y)demand(!reaches(x,y),'Interchangeable Steps conflict with before constraint');}
 }
 for(const r of bd.relations)if(['input','output'].includes(r.kind)){
  const d=ref(r.dataId,'data'),objectId=r.kind==='input'?r.fromId:r.toId;
  for(const item of d.items)ref(item.informationId,'information',objectId);
 }
}

/** Explicit candidate preparation only. The caller supplies the structured BD;
 * no prose is split, no actor is inferred, and no human approval is generated. */
export function upgradeStructure(previous,request){
 validate(previous);demand(previous.formatVersion==='0.4','Structure migration requires package 0.4');
 demand(request&&Object.keys(request).every(k=>['expectedRevision','revision','documentRevisions','businessDesigns'].includes(k)),'Unknown structure migration option');
 const {expectedRevision,revision,documentRevisions,businessDesigns}=request;
 demand(expectedRevision===previous.revision&&typeof revision==='string'&&revision.trim()&&revision!==expectedRevision,'Migration package revision conflict');
 demand(Array.isArray(businessDesigns)&&businessDesigns.length>0,'Explicit structured Business Designs required');
 const oldBD=previous.documents.filter(d=>d.kind==='businessDesign');unique(businessDesigns.map(d=>d.id),'Duplicate migration BD');demand(businessDesigns.length===oldBD.length&&businessDesigns.every(d=>oldBD.some(p=>p.id===d.id)),'Migration must cover exactly the existing Business Designs');
 const ids=new Set(oldBD.map(d=>d.id));
 demand(documentRevisions&&Object.keys(documentRevisions).length===ids.size&&Object.keys(documentRevisions).every(id=>ids.has(id)),'BD-only migration revisions required; dependent Check/State stay in the original package');
 const documents=oldBD.map(d=>{
  const r=documentRevisions[d.id];demand(r&&r.expected===d.revision&&typeof r.next==='string'&&r.next.trim()&&r.next!==r.expected,'Migration document revision conflict: '+d.id);
  const replacement=structuredClone(businessDesigns.find(b=>b.id===d.id));demand(replacement.revision===r.next,'Structured BD revision mismatch');return replacement;
 });
 // A separate BD-only candidate cannot claim the old dependent documents fit a new revision.
 const next={...structuredClone(previous),formatVersion:'0.5',revision,documents,
  sources:structuredClone(previous.sources.filter(s=>ids.has(s.documentId))),externalDocuments:[],diagnostics:[]};
 validate(next);const old=inventory(previous),fresh=inventory(next);
 for(const [id,e]of old.map){if(!ids.has(old.owner.get(id)))continue;const n=fresh.map.get(id);demand(n&&old.types.get(id)===fresh.types.get(id)&&old.owner.get(id)===fresh.owner.get(id)&&old.parent.get(id)===fresh.parent.get(id),'Migration identity/type/owner changed: '+id);if(old.types.get(id)==='exception')demand(e.activityId===n.activityId&&e.name===n.name&&e.description===n.description,'Existing Exception definition must be preserved during structure migration: '+id);demand(e.checkId===n.checkId&&e.sourceId===n.sourceId,'Migration source identity changed');}
 for(const d of oldBD){const replacement=documents.find(b=>b.id===d.id);for(const a of d.activities)if(a.exception!==null){
  demand(replacement.exceptions.some(e=>e.activityId===a.id&&e.description===a.exception),'Legacy exception text must be explicitly preserved in the same Activity exception catalog: '+a.id);
 }}
 return next;
}
