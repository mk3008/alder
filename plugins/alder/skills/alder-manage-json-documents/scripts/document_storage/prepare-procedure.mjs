import {demand,inventory,validate} from './core.mjs';

const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const orderRuleKey=rule=>rule.kind==='before'?JSON.stringify([rule.kind,rule.beforeId,rule.afterId]):JSON.stringify([rule.kind,...[...rule.stepIds].sort()]);

/** Validate a separately authored candidate against a legacy source.
 * This does not infer Scope, split prose, choose Who, rebase a dependent
 * document, or claim that the resulting business meaning was approved. */
export function prepareProcedureUpgrade(previous,candidate,request){
 validate(previous);validate(candidate);
 demand(['0.4','0.5'].includes(previous.formatVersion),'Only old 0.4 or old 0.5 can be prepared');
 demand(candidate.formatVersion==='0.6','Candidate must use the new format');
 demand(request&&Object.keys(request).every(k=>['expectedRevision','expectedSha256','scopeDecisions','whoDecisions'].includes(k)),'Unknown migration request field');
 demand(request.expectedRevision===previous.revision,'Source package revision conflict');
 demand(typeof request.expectedSha256==='string'&&/^[0-9a-f]{64}$/.test(request.expectedSha256),'Source SHA-256 required');
 demand(candidate.revision!==previous.revision,'Candidate needs a new revision');
 const originals=previous.documents.filter(d=>d.kind==='businessDesign'),next=candidate.documents;
 demand(originals.length>0&&next.length===originals.length&&next.every(d=>d.kind==='businessDesign'&&originals.some(p=>p.id===d.id)),'Candidate must contain exactly the Business Designs; existing Check/State/Concept stay with the original');
 demand(candidate.externalDocuments.length===0,'Original external catalogs stay with the original');
 for(const source of previous.sources.filter(s=>originals.some(d=>d.id===s.documentId)))demand(candidate.sources.some(s=>equal(source,s)),'Original provenance must be preserved');
 const old=inventory(previous),fresh=inventory(candidate);
 for(const [id,value] of old.map){
  if(!originals.some(d=>d.id===old.owner.get(id)))continue;
  const newer=fresh.map.get(id);demand(newer&&old.types.get(id)===fresh.types.get(id)&&old.owner.get(id)===fresh.owner.get(id)&&old.parent.get(id)===fresh.parent.get(id),'Migration identity/type/owner changed: '+id);
  const type=old.types.get(id);
  if(['object','activity','role','data','information'].includes(type))demand(value.name===newer.name,'Migration changed an existing name: '+id);
  if(type==='role')demand(equal(value,newer),'Migration changed Role: '+id);
  if(type==='object')demand(value.icon===newer.icon,'Migration changed Object icon: '+id);
  if(type==='activity')demand(['why','when','where','problem','painLevel'].every(key=>value[key]===newer[key]),'Migration changed Activity content: '+id);
  if(type==='information')demand(value.description===newer.description,'Migration changed Information description: '+id);
  if(type==='exception')demand(equal(value,newer),'Migration changed exception: '+id);
  if(type==='finding')demand(equal(value,newer),'Migration changed finding: '+id);
  if(type==='result')demand(equal(value,newer),'Migration changed Result: '+id);
  if(type==='step')demand(value.text===newer.legacyText&&value.obligation===newer.obligation&&value.appliesWhen===newer.appliesWhen,'Migration changed or omitted legacy Step text/conditions: '+id);
  if(type==='data')demand(equal(value.items,newer.items),'Migration changed Data items: '+id);
  if(type==='relation'){
   demand(value.kind===newer.kind&&value.fromId===newer.fromId&&value.toId===newer.toId,'Migration changed relation endpoint: '+id);
   if(['business-exception','object-exception'].includes(value.kind))demand(value.label===newer.label,'Migration changed exception relation: '+id);
   if(previous.formatVersion==='0.5'&&['input','output'].includes(value.kind)){
    const doc=candidate.documents.find(d=>d.id===old.owner.get(id));
    demand(doc.activities.some(a=>a.procedure.steps.some(s=>s.exchange.kind==='interaction'&&s.exchange.relationId===id&&s.exchange.dataIds?.includes(value.dataId))),'Old Relation/Data needs an explicit Step mapping: '+id);
   }
  }
 }
 const scopes=request.scopeDecisions??{},who=request.whoDecisions??{};
 const knownScopes=new Set(originals.flatMap(d=>[...d.objects,...d.activities].map(x=>x.id))),knownActivities=new Set(originals.flatMap(d=>d.activities.map(x=>x.id)));
 demand(Object.keys(scopes).every(id=>knownScopes.has(id))&&Object.keys(who).every(id=>knownActivities.has(id)),'Unknown migration decision target');
 for(const original of originals){const doc=next.find(d=>d.id===original.id);demand(doc.revision!==original.revision,'Candidate Business Design needs a new revision: '+doc.id);
  demand(doc.objects.length===original.objects.length&&doc.activities.length===original.activities.length,'Migration must not invent Objects or Activities');
  for(const object of original.objects){const updated=doc.objects.find(x=>x.id===object.id);if(previous.formatVersion==='0.4')for(const text of object.information)demand(updated.information.some(i=>i.name===text),'Legacy Information needs explicit preservation: '+object.id);}
  if(previous.formatVersion==='0.5')for(const activity of original.activities){
   const updated=doc.activities.find(item=>item.id===activity.id),rules=new Set(updated.procedure.orderRules.map(orderRuleKey));
   for(const rule of activity.procedure.orderRules)demand(rules.has(orderRuleKey(rule)),'Migration changed or omitted legacy Step order: '+activity.id);
  }
  if(previous.formatVersion==='0.4')for(const activity of original.activities)if(activity.exception!==null)demand(doc.exceptions.some(e=>e.activityId===activity.id&&e.description===activity.exception),'Legacy exception text needs explicit preservation: '+activity.id);
  for(const item of [...doc.objects,...doc.activities]){
   const decision=scopes[item.id];if(item.scope===null){demand(!decision||decision.value===null,'Unresolved Scope decision mismatch: '+item.id);continue;}
   demand(decision&&decision.value===item.scope&&typeof decision.evidence==='string'&&decision.evidence.trim(),'Explicit Scope evidence required: '+item.id);
  }
  for(const activity of doc.activities){const decision=who[activity.id];
   if(activity.who===null){demand(!decision||decision.value===null,'Unresolved Who decision mismatch: '+activity.id);continue;}
   demand(decision&&equal(decision.value,activity.who)&&typeof decision.evidence==='string'&&decision.evidence.trim(),'Explicit Who evidence required: '+activity.id);
  }
 }
 const manualReview=[];
 for(const original of originals){
  if(previous.formatVersion==='0.4'){
   for(const activity of original.activities)manualReview.push({kind:'legacy-procedure-result-who',id:activity.id,reason:'旧本文と候補の意味対応を原本と照合'});
   for(const relation of original.relations.filter(r=>['input','output'].includes(r.kind)))manualReview.push({kind:'legacy-relation-label',id:relation.id,reason:'旧ラベルとStep/Dataの対応を原本と照合'});
  }else for(const activity of original.activities){
   manualReview.push({kind:'legacy-performers',id:activity.id,reason:'旧担当情報は原本に保持し、新しいWhoとの対応を推測しない'});
   for(const step of activity.procedure.steps)if(step.performerObjectIds!==null)manualReview.push({kind:'legacy-step-performers',id:step.id,reason:'旧Step担当情報は原本に保持し、自動的に新Whoへ移さない'});
  }
 }
 return {approval:'not-evaluated',sourceFormat:previous.formatVersion,candidateFormat:candidate.formatVersion,sourceRevision:previous.revision,candidateRevision:candidate.revision,
  diagnostics:validate(candidate).diagnostics,manualReview,decisionEvidence:{scopeDecisions:scopes,whoDecisions:who},
  review:['業務意味・Scope・Whoの妥当性は人間確認が必要','旧原本のProcedure・担当情報とCheck/State/概念の確認状態は原本側に保持']};
}
