/** Explicit persistence only. Compatibility readers remain display/input models. */
import fs from 'node:fs';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import {parseStrict,stringify,validate,inventory,demand} from './core.mjs';
import {fingerprint,packageVersionPolicy,requireEditablePackage} from './authoring.mjs';
import {upgradeExceptions} from './legacy-json.mjs';

const equal=(a,b)=>a===b||a!==undefined&&b!==undefined&&fingerprint(a)===fingerprint(b);
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
function legacyPolicy(pkg,target){
 const policy=packageVersionPolicy(pkg,target);
 demand(!policy.editable,target+': already 0.4; explicit conversion requires 0.1, 0.2 or 0.3');
 return policy;
}
// A migration commit must contain exactly the structural conversion, with caller
// supplied revisions. Business edits and human decisions belong to later operations.
export function verifyConversionCandidate(previous,next,target='target'){
 legacyPolicy(previous,target);requireEditablePackage(next,'candidate');validate(previous);validate(next);
 const documentRevisions=Object.fromEntries(previous.documents.flatMap(d=>{
  const n=next.documents.find(n=>n.id===d.id);
  return n&&n.revision!==d.revision?[[d.id,{expected:d.revision,next:n.revision}]]:[];
 }));
 const expected=upgradeExceptions(previous,{expectedRevision:previous.revision,revision:next.revision,documentRevisions});
 demand(equal(expected,next),target+': candidate must contain only the explicit 0.4 structural conversion; preserve IDs, provenance, references, Who, Role, Check review states and unresolved meaning');
}
function differences(before,after,at='$'){
 if(equal(before,after))return [];
 if(before&&after&&typeof before==='object'&&typeof after==='object'){
  return [...new Set([...Object.keys(before),...Object.keys(after)])].flatMap(key=>differences(before[key],after[key],at+'.'+key));
 }
 return [{path:at,before:before??null,after:after??null}];
}
function reportConversion(previous,next,target){
 verifyConversionCandidate(previous,next,target);
 const old=inventory(previous),fresh=inventory(next);
 const preserved=[...old.map.keys()];
 demand(preserved.every(id=>fresh.map.has(id)&&old.types.get(id)===fresh.types.get(id)&&old.owner.get(id)===fresh.owner.get(id)),'Migration identity loss');
 const unresolved=[];
 for(const d of next.documents){
  for(const a of d.activities??[])if(a.roleId===null)unresolved.push({documentId:d.id,id:a.id,kind:'Role / Who',who:a.who,roleId:null});
  for(const t of d.transitions??[])if(t.path==='exception'&&t.exceptionId===null)unresolved.push({documentId:d.id,id:t.id,kind:'exception reference',exceptionId:null});
 }
 return {target,fromVersion:previous.formatVersion,toVersion:next.formatVersion,migration:'exceptions-0.4',
  editable:requireEditablePackage(next).editable,approval:'not-evaluated',
  revision:{before:previous.revision,after:next.revision},
  identities:{preserved,added:[...fresh.map.keys()].filter(id=>!old.map.has(id))},
  sourcesPreserved:equal(previous.sources,next.sources),externalDocumentsPreserved:equal(previous.externalDocuments,next.externalDocuments),
  documents:next.documents.map((d,i)=>({id:d.id,kind:d.kind,changed:!equal(previous.documents[i],d),
   revision:{before:previous.documents[i].revision,after:d.revision},changes:differences(previous.documents[i],d),
   basedOn:{before:previous.documents[i].basedOn??null,after:d.basedOn??null},
   reviews:(d.items??[]).map(item=>({id:item.id,reviewState:item.reviewState,preserved:true}))})),
  unresolved,diagnostics:validate(next).diagnostics};
}

/** Separate new output; a named-plan conversion returns a whole candidate bundle. */
export async function prepareVersionUpgrade(source,output,requestFile,planId){
 let temp,result;
 const target=planId===undefined?source:source+' plan '+planId;
 try{
  demand(path.resolve(source)!==path.resolve(output),'Migration must preserve the source; output must be separate');
  const before=fs.readFileSync(source),sourceSha256=hash(before),input=parseStrict(before.toString('utf8'));
  const request=parseStrict(fs.readFileSync(requestFile,'utf8'));
  demand(request&&Object.keys(request).every(k=>['expectedSha256','expectedRevision','revision','documentRevisions'].includes(k)),'Unknown conversion request field');
  demand(request.expectedSha256===sourceSha256,'File content conflict');
  let previous=input,plans;
  if(planId!==undefined){
   plans=await import('./named-plans.mjs');
   demand(input?.format==='alder-named-plans'&&input.formatVersion==='1.0','Unsupported bundle format='+JSON.stringify(input?.format)+' formatVersion='+JSON.stringify(input?.formatVersion)+'; expected alder-named-plans 1.0');
   if(Array.isArray(input.plans))for(const plan of input.plans)packageVersionPolicy(plan?.package,'Plan '+plan?.id);
   previous=plans.selectNamedPlan(input,planId).package;
  }
  legacyPolicy(previous,target);
  const next=upgradeExceptions(previous,request),report=reportConversion(previous,next,target);
  let candidate=next;
  if(plans){
   candidate=structuredClone(input);candidate.plans.find(p=>p.id===planId).package=next;plans.validateNamedPlans(candidate);
   report.untouchedPlans=input.plans.filter(p=>p.id!==planId).map(p=>({id:p.id,preserved:equal(p,candidate.plans.find(n=>n.id===p.id))}));
  }
  temp=path.join(path.dirname(path.resolve(output)),'.alder-conversion-'+randomUUID());
  const fd=fs.openSync(temp,'wx',0o600);
  try{fs.writeFileSync(fd,stringify(candidate),'utf8');fs.fsyncSync(fd);}finally{fs.closeSync(fd);}
  const staged=parseStrict(fs.readFileSync(temp,'utf8'));if(plans)plans.validateNamedPlans(staged);else validate(staged);
  const afterSha256=hash(fs.readFileSync(source));demand(afterSha256===sourceSha256,'Source changed while preparing conversion');
  fs.linkSync(temp,output);
  return result={candidate:output,sourceSha256,sourceAfterSha256:afterSha256,sourceUnchanged:true,plan:planId??null,...report};
 }catch(error){throw Error(target+': '+error.message,{cause:error});}
 finally{if(temp)try{fs.unlinkSync(temp);}catch(error){if(error.code!=='ENOENT'){
  const cleanupWarning={code:'CLEANUP_WARNING',message:error.message};
  if(result)result.cleanupWarning=cleanupWarning;else console.error(JSON.stringify(cleanupWarning));
 }}}
}
