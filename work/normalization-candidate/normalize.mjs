import {isDeepStrictEqual} from 'node:util';
import {validate,validateShape,validateReferences,inventory} from '../../tools/document_storage/core.mjs';

// Review-only relational projection of the 0.7 Business Design. Other document
// kinds remain attached to the original source, with their bytes/meaning intact.
// This is not a new official Alder package or a production migration.
const names=['businessDesigns','actors','objects','information','activities','steps','stepTargetData','stepInteractions','interactionData','stepParties','stepDecisions','dependencies','orderRules','orderRuleSteps','results','decisions','axes','axisData','rows','conditions','resultData','resultExceptions','rowChecks','exceptions','continuities','continuityData','data','dataItems','relations','findings','findingTargets','findingUnresolved'];
const fail=message=>{throw Error(message);};
const assert=(value,message)=>{if(!value)fail(message);};
const INTERNAL=Symbol('normalization-internal');
const copy=value=>structuredClone(value);
const without=(value,...keys)=>Object.fromEntries(Object.entries(value).filter(([key])=>!keys.includes(key)));
const state=value=>value===null?'null':'array';

/** Explicit bindings: {"<bdId>/<activityId>": {id, evidence}} for each automatic Who. */
export function normalizePackage(source,bindings={},options={}){
 if(options.allowUnresolvedFindings){validateShape(source);validateReferences(source,{allowUnresolvedFindings:true});}else validate(source);
 assert(source.formatVersion==='0.7','Only the 0.7 candidate is supported');
 const usedBindings=new Set(),existing=inventory(source).map,entities=Object.fromEntries(names.map(name=>[name,[]]));
 const add=(name,value)=>entities[name].push(value);
 const indexed=(items,fn)=>items.forEach((value,ordinal)=>fn(value,ordinal));
 const refList=(table,ownerKey,owner,items,targetKey)=>{if(items)indexed(items,(id,ordinal)=>add(table,{[ownerKey]:owner,[targetKey]:id,ordinal}));};
 const documents=[];
 for(const [documentOrder,doc] of source.documents.entries()){
  if(doc.kind!=='businessDesign'){documents.push({documentOrder,document:copy(doc)});continue;}
  const bd=doc;assert(bd.schemaVersion==='0.6','Expected 0.7 Business Design schema 0.6');
  add('businessDesigns',{...without(bd,'roles','activities','objects','exceptions','data','relations','findings'),documentOrder});
  const actors=new Map();
  indexed(bd.roles,(role,ordinal)=>{const row={id:role.id,documentId:bd.id,kind:'role',name:role.name,color:role.color,roleOrdinal:ordinal};actors.set(role.id,row);add('actors',row);});
  indexed(bd.objects,(o,ordinal)=>{add('objects',{...without(o,'information'),documentId:bd.id,ordinal});indexed(o.information,(item,i)=>add('information',{...item,objectId:o.id,ordinal:i}));});
  indexed(bd.activities,(a,ordinal)=>{
   let whoId=null;
   if(a.who?.kind==='role')whoId=a.who.roleId;
   else if(a.who){
    const key=bd.id+'/'+a.id,binding=bindings[key];
    assert(binding&&typeof binding.id==='string'&&/^[A-Za-z0-9_-]+$/.test(binding.id)&&typeof binding.evidence==='string'&&binding.evidence.trim(),'Explicit automatic Who identity required: '+key);
    usedBindings.add(key);whoId=binding.id;
    const prior=actors.get(whoId);
    if(prior)assert(prior.kind===a.who.kind&&prior.name===a.who.name,'Automatic Who binding conflicts: '+key);
    else{assert(!existing.has(whoId),'Automatic Who ID conflicts with source: '+whoId);const row={id:whoId,documentId:bd.id,kind:a.who.kind,name:a.who.name};actors.set(whoId,row);add('actors',row);}
   }
   add('activities',{...without(a,'who','procedure','decisions','results'),documentId:bd.id,ordinal,whoId});
   indexed(a.procedure.steps,(s,i)=>{
    const step={...without(s,'whatDataIds','exchange','parties','decisionIds','whenDecision','dependsOn'),activityId:a.id,ordinal:i,
     targetDataState:state(s.whatDataIds),exchangeKind:s.exchange.kind,partiesPresent:Object.hasOwn(s,'parties'),whenDecisionRowId:s.whenDecision?.rowId??null,
     dependencyState:!Object.hasOwn(s,'dependsOn')?'absent':state(s.dependsOn)};
    add('steps',step);refList('stepTargetData','stepId',s.id,s.whatDataIds,'dataId');refList('stepDecisions','stepId',s.id,s.decisionIds,'decisionId');
    if(s.exchange.kind==='interaction'){
     const x=s.exchange;add('stepInteractions',{...without(x,'kind','dataIds'),stepId:s.id,dataState:state(x.dataIds)});
     refList('interactionData','stepId',s.id,x.dataIds,'dataId');
    }
    if(s.parties)for(const side of ['from','to'])if(s.parties[side])add('stepParties',{stepId:s.id,side,...s.parties[side]});
    if(Array.isArray(s.dependsOn))indexed(s.dependsOn,(d,n)=>add('dependencies',{stepId:s.id,prerequisiteStepId:d.stepId,whenDecisionRowId:d.whenDecision?.rowId??null,ordinal:n}));
   });
   indexed(a.procedure.orderRules,(r,i)=>{
    add('orderRules',{...without(r,'stepIds'),activityId:a.id,ordinal:i});
    if(r.kind==='interchangeable')indexed(r.stepIds,(id,n)=>add('orderRuleSteps',{activityId:a.id,ruleOrdinal:i,stepId:id,ordinal:n}));
   });
   indexed(a.results,(r,i)=>add('results',{...r,activityId:a.id,ordinal:i}));
   indexed(a.decisions,(d,i)=>{
    add('decisions',{...without(d,'appliesWhen','axes','rows'),activityId:a.id,ordinal:i,appliesWhenRowId:d.appliesWhen?.rowId??null});
    indexed(d.axes,(axis,n)=>{add('axes',{...without(axis,'dataIds'),decisionId:d.id,ordinal:n});refList('axisData','axisId',axis.id,axis.dataIds,'dataId');});
    indexed(d.rows,(row,n)=>{
     add('rows',{id:row.id,decisionId:d.id,ordinal:n,resultKind:row.result.kind,resultText:row.result.text});
     row.conditions.forEach(condition=>add('conditions',{...condition,rowId:row.id}));
     refList('resultData','rowId',row.id,row.result.dataIds,'dataId');refList('resultExceptions','rowId',row.id,row.result.exceptionIds,'exceptionId');
     indexed(row.checkRefs,(c,j)=>add('rowChecks',{...c,rowId:row.id,ordinal:j}));
    });
   });
  });
  indexed(bd.exceptions,(e,i)=>{
   add('exceptions',{...without(e,'continuity'),ordinal:i});
   if(Object.hasOwn(e,'continuity')){const c=e.continuity;add('continuities',{...without(c,'retainedDataIds'),exceptionId:e.id,dataState:state(c.retainedDataIds)});refList('continuityData','exceptionId',e.id,c.retainedDataIds,'dataId');}
  });
  indexed(bd.data,(d,i)=>{add('data',{...without(d,'items'),documentId:bd.id,ordinal:i});indexed(d.items,(item,n)=>add('dataItems',{...item,dataId:d.id,ordinal:n}));});
  indexed(bd.relations,(r,i)=>add('relations',{...r,documentId:bd.id,ordinal:i}));
  indexed(bd.findings,(f,i)=>{add('findings',{...without(f,'targetIds','unresolvedTargets'),documentId:bd.id,ordinal:i});refList('findingTargets','findingId',f.id,f.targetIds,'targetId');refList('findingUnresolved','findingId',f.id,f.unresolvedTargets,'text');});
 }
 assert(Object.keys(bindings).every(key=>usedBindings.has(key)),'Binding does not correspond to an automatic Who');
 const result={format:'alder-normalized-business-design-study',version:'0.1',source:without(source,'documents'),documents,entities};
 const restored=restorePackage(result,{...options,[INTERNAL]:true});
 assert(isDeepStrictEqual(restored,source),'Normalization did not preserve every source field');
 return result;
}

/** Restore a candidate to its original format, then run the existing validator. */
export function restorePackage(candidate,options={}){
 assert(candidate?.format==='alder-normalized-business-design-study'&&candidate.version==='0.1','Unsupported study format');
 const e=candidate.entities;assert(e&&isDeepStrictEqual(Object.keys(e).sort(),[...names].sort()),'Missing or unexpected entity table');
 for(const name of names)assert(Array.isArray(e[name]),'Missing entity table: '+name);
 const seen=Object.fromEntries(names.map(name=>[name,new Set()]));
 const take=(name,predicate)=>e[name].filter((row,i)=>{if(!predicate(row))return false;assert(!seen[name].has(i),'Row belongs to more than one owner: '+name);seen[name].add(i);return true;});
 const ordered=rows=>{const out=rows.slice().sort((a,b)=>a.ordinal-b.ordinal);assert(out.every((x,i)=>x.ordinal===i),'Non-contiguous or duplicate order');return out;};
 const list=(name,ownerKey,owner,targetKey)=>ordered(take(name,r=>r[ownerKey]===owner)).map(r=>r[targetKey]);
 const one=(name,predicate,required=false)=>{const result=take(name,predicate);assert(result.length<2&&(!required||result.length===1),'Invalid 1:1 relation: '+name);return result[0];};
 const rowPointer=id=>{if(id===null)return null;const matches=e.rows.filter(row=>row.id===id);assert(matches.length===1,'Unknown decision row: '+id);return {decisionId:matches[0].decisionId,rowId:id};};
 const docs=candidate.documents.map(({documentOrder,document})=>({documentOrder,document:copy(document)}));
 const ids=new Set();for(const table of ['businessDesigns','actors','objects','information','activities','steps','results','decisions','axes','rows','exceptions','data','relations','findings'])for(const row of e[table]){assert(typeof row.id==='string'&&!ids.has(row.id),'Duplicate entity ID: '+row.id);ids.add(row.id);}
 for(const b of take('businessDesigns',()=>true)){
  const actorRows=take('actors',r=>r.documentId===b.id),actorById=new Map(actorRows.map(a=>[a.id,a])),usedAutomatic=new Set();
  for(const a of actorRows){assert(['role','system','scheduler'].includes(a.kind),'Invalid Who kind');assert(typeof a.name==='string'&&a.name.trim(),'Invalid Who name');if(a.kind!=='role')assert(!Object.hasOwn(a,'color')&&!Object.hasOwn(a,'roleOrdinal'),'Invalid automatic Who properties');}
  const roles=ordered(actorRows.filter(x=>x.kind==='role').map(x=>({...x,ordinal:x.roleOrdinal}))).map(x=>({id:x.id,name:x.name,color:x.color}));
  const objects=ordered(take('objects',o=>o.documentId===b.id)).map(o=>({...without(o,'documentId','ordinal'),information:ordered(take('information',x=>x.objectId===o.id)).map(x=>without(x,'objectId','ordinal'))}));
  const activities=ordered(take('activities',a=>a.documentId===b.id)).map(a=>{
   let who=null;if(a.whoId!==null){const actor=actorById.get(a.whoId);assert(actor,'Missing or cross-document Who: '+a.id);who=actor.kind==='role'?{kind:'role',roleId:actor.id}:{kind:actor.kind,name:actor.name};if(actor.kind!=='role')usedAutomatic.add(actor.id);}
   const steps=ordered(take('steps',s=>s.activityId===a.id)).map(s=>{
    assert(['null','array'].includes(s.targetDataState),'Invalid target Data state');assert(['absent','null','array'].includes(s.dependencyState),'Invalid dependency state');assert(typeof s.partiesPresent==='boolean','Invalid parties state');
    const targetIds=list('stepTargetData','stepId',s.id,'dataId');if(s.targetDataState==='null')assert(!targetIds.length,'Unknown target Data cannot have members');
    let exchange;const interaction=one('stepInteractions',r=>r.stepId===s.id,s.exchangeKind==='interaction');
    if(s.exchangeKind==='interaction'){
     assert(interaction&&['null','array'].includes(interaction.dataState),'Invalid interaction');const dataIds=list('interactionData','stepId',s.id,'dataId');if(interaction.dataState==='null')assert(!dataIds.length,'Unknown interaction Data cannot have members');
     exchange={kind:'interaction',...without(interaction,'stepId','dataState'),dataIds:interaction.dataState==='null'?null:dataIds};
    }else{assert(['internal','unresolved'].includes(s.exchangeKind)&&!interaction,'Invalid exchange kind');exchange={kind:s.exchangeKind};}
    const parties=take('stepParties',p=>p.stepId===s.id);assert(s.partiesPresent||!parties.length,'Unexpected parties');assert(parties.every(p=>['from','to'].includes(p.side))&&new Set(parties.map(p=>p.side)).size===parties.length,'Duplicate or invalid party');
    const deps=ordered(take('dependencies',d=>d.stepId===s.id));if(s.dependencyState!=='array')assert(!deps.length,'Unexpected prerequisites');
    const step={...without(s,'activityId','ordinal','targetDataState','exchangeKind','partiesPresent','whenDecisionRowId','dependencyState'),whatDataIds:s.targetDataState==='null'?null:targetIds,exchange,
     decisionIds:list('stepDecisions','stepId',s.id,'decisionId'),whenDecision:rowPointer(s.whenDecisionRowId)};
    if(s.partiesPresent){step.parties={from:null,to:null};for(const p of parties)step.parties[p.side]=without(p,'stepId','side');}
    if(s.dependencyState!=='absent')step.dependsOn=s.dependencyState==='null'?null:deps.map(d=>({stepId:d.prerequisiteStepId,whenDecision:rowPointer(d.whenDecisionRowId)}));
    return step;
   });
   const orderRules=ordered(take('orderRules',r=>r.activityId===a.id)).map(r=>{const members=ordered(take('orderRuleSteps',x=>x.activityId===a.id&&x.ruleOrdinal===r.ordinal));if(r.kind==='before')assert(!members.length,'Unexpected before members');const rule=without(r,'activityId','ordinal');if(r.kind==='interchangeable')rule.stepIds=members.map(x=>x.stepId);return rule;});
   const results=ordered(take('results',r=>r.activityId===a.id)).map(r=>without(r,'activityId','ordinal'));
   const decisions=ordered(take('decisions',d=>d.activityId===a.id)).map(d=>{
    const axes=ordered(take('axes',x=>x.decisionId===d.id)).map(x=>({...without(x,'decisionId','ordinal'),dataIds:list('axisData','axisId',x.id,'dataId')}));
    const rows=ordered(take('rows',x=>x.decisionId===d.id)).map(x=>{
     const conditions=take('conditions',c=>c.rowId===x.id);assert(conditions.length===axes.length&&new Set(conditions.map(c=>c.axisId)).size===axes.length,'Decision axes and conditions differ');
     const sorted=axes.map(axis=>{const value=conditions.find(c=>c.axisId===axis.id);assert(value,'Missing condition');return without(value,'rowId');});
     const result={kind:x.resultKind,text:x.resultText,dataIds:list('resultData','rowId',x.id,'dataId'),exceptionIds:list('resultExceptions','rowId',x.id,'exceptionId')};
     const checkRefs=ordered(take('rowChecks',c=>c.rowId===x.id)).map(c=>without(c,'rowId','ordinal'));
     return {id:x.id,conditions:sorted,result,checkRefs};
    });
    return {...without(d,'activityId','ordinal','appliesWhenRowId'),appliesWhen:rowPointer(d.appliesWhenRowId),axes,rows};
   });
   return {...without(a,'documentId','ordinal','whoId'),who,procedure:{steps,orderRules},decisions,results};
  });
  for(const actor of actorRows)if(actor.kind!=='role')assert(usedAutomatic.has(actor.id),'Unreferenced automatic Who: '+actor.id);
  const activityIds=new Set(activities.map(x=>x.id));
  const exceptions=ordered(take('exceptions',x=>activityIds.has(x.activityId))).map(x=>{const c=one('continuities',v=>v.exceptionId===x.id),r=without(x,'ordinal');if(c){assert(['null','array'].includes(c.dataState),'Invalid continuity Data state');const dataIds=list('continuityData','exceptionId',x.id,'dataId');if(c.dataState==='null')assert(!dataIds.length,'Unknown continuity Data cannot have members');r.continuity={...without(c,'exceptionId','dataState'),retainedDataIds:c.dataState==='null'?null:dataIds};}return r;});
  const data=ordered(take('data',x=>x.documentId===b.id)).map(x=>({...without(x,'documentId','ordinal'),items:ordered(take('dataItems',v=>v.dataId===x.id)).map(v=>without(v,'dataId','ordinal'))}));
  const relations=ordered(take('relations',x=>x.documentId===b.id)).map(x=>without(x,'documentId','ordinal'));
  const findings=ordered(take('findings',x=>x.documentId===b.id)).map(x=>({...without(x,'documentId','ordinal'),targetIds:list('findingTargets','findingId',x.id,'targetId'),unresolvedTargets:list('findingUnresolved','findingId',x.id,'text')}));
  docs.push({documentOrder:b.documentOrder,document:{...without(b,'documentOrder'),roles,objects,activities,exceptions,data,relations,findings}});
 }
 for(const name of names)assert(seen[name].size===e[name].length,'Orphan or unused row: '+name);
 docs.sort((a,b)=>a.documentOrder-b.documentOrder);assert(docs.every((x,i)=>x.documentOrder===i),'Invalid document order');
 const source={...copy(candidate.source),documents:docs.map(x=>x.document)};
 if(options.allowUnresolvedFindings){validateShape(source);validateReferences(source,{allowUnresolvedFindings:true});}else validate(source);
 if(!options[INTERNAL]){
  // Reject fields or records the reverse projection would otherwise ignore.
  // Relation-row array order is immaterial; every explicit ordinal is retained.
  const bindings={};
  for(const a of e.activities){if(a.whoId===null)continue;const actor=e.actors.find(x=>x.id===a.whoId);if(actor&&actor.kind!=='role')bindings[a.documentId+'/'+a.id]={id:actor.id,evidence:'再構成時の明示参照'};}
  const regenerated=normalizePackage(source,bindings,options);
  const canonical=value=>Array.isArray(value)?value.map(canonical):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])])):value;
  const comparable=value=>({...canonical(without(value,'documents','entities')),documents:value.documents.map(x=>JSON.stringify(canonical(x))).sort(),
   entities:Object.fromEntries(names.map(name=>[name,value.entities[name].map(x=>JSON.stringify(canonical(x))).sort()]))});
  assert(isDeepStrictEqual(comparable(candidate),comparable(regenerated)),'Unknown or lost normalized content');
 }
 return source;
}
