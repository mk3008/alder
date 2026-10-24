/** Read compatibility only for frozen candidate 0.1–0.3. Never used by native 0.4 authoring/validation. */
import {validate,validateShape,demand} from './core.mjs';
// The old syntax is interpreted only at this explicitly versioned input boundary.
export function legacyExceptions(bd){
 return bd.activities.flatMap(a=>[...(a.exception??'').matchAll(/^- \*\*([^*]+)\*\* — (.*)$/gm)].map((m,i)=>({id:exceptionIdentity(bd.id,a.id,m[1]),activityId:a.id,name:m[1],description:m[2]})));
}
// Stable, browser/Node identical identity; source IDs stay opaque, including old Viewer names.
export function exceptionIdentity(documentId,activityId,name){
 const key=JSON.stringify([documentId,activityId,name]);let a=2166136261,b=2246822507;
 for(const c of key){a=Math.imul(a^c.codePointAt(0),16777619)>>>0;b=Math.imul(b^c.codePointAt(0),3266489909)>>>0;}
 return 'exception-'+a.toString(16).padStart(8,'0')+b.toString(16).padStart(8,'0');
}
export function legacyExceptionId(bd,activityId,name){
 if(name===null||name===undefined||name==='-')return null;
 const matches=bd.exceptions.filter(e=>e.activityId===activityId&&e.name===name);
 demand(matches.length===1,'Unknown or ambiguous State exception name: '+name);return matches[0].id;
}
/** In-memory input normalization: original bytes/revisions/IDs are not rewritten or saved. */
export function readLegacyPackage(pkg){
 demand(['0.1','0.2','0.3'].includes(pkg.formatVersion),'Legacy JSON version required');validateShape(pkg);validate(pkg);
 const next=structuredClone(pkg);next.formatVersion='0.4';
 next.diagnostics.push('旧JSON '+pkg.formatVersion+' の互換入力由来。業務意味・承認は未評価');
 for(const bd of next.documents.filter(d=>d.kind==='businessDesign')){
  bd.exceptions=legacyExceptions(bd);bd.roles??=[];bd.schemaVersion='0.3';
  for(const a of bd.activities){if(!Object.hasOwn(a,'roleId')){a.roleId=null;next.diagnostics.push('Role未確定: '+a.id+' — '+a.who);}}
 }
 for(const st of next.documents.filter(d=>d.kind==='stateTransition')){
  const bd=next.documents.find(d=>d.id===st.basedOn.documentId);st.schemaVersion='0.2';
  for(const t of st.transitions){t.exceptionId=legacyExceptionId(bd,t.activityId,t.exception);delete t.exception;if(t.path==='exception'&&t.exceptionId===null)next.diagnostics.push('例外参照未決: '+t.id);}
 }
 validate(next);return next;
}
/** Explicit migration candidate. All changed document and package revisions must be supplied. */
export function upgradeExceptions(pkg,{expectedRevision,revision,documentRevisions}){
 demand(pkg.revision===expectedRevision&&revision&&revision!==expectedRevision,'Migration package revision conflict');
 const next=readLegacyPackage(pkg),changed=next.documents.filter(d=>d.kind!=='checkItems'),ids=new Set(changed.map(d=>d.id));
 for(const d of next.documents)if(d.basedOn&&ids.has(d.basedOn.documentId))ids.add(d.id);
 for(const d of next.documents)if(ids.has(d.id)){
  const r=documentRevisions[d.id];demand(r&&r.expected===d.revision&&typeof r.next==='string'&&r.next.trim()&&r.next!==r.expected,'Migration document revision conflict: '+d.id);d.revision=r.next;
 }
 demand(Object.keys(documentRevisions).length===ids.size,'Migration revisions must match changed documents');
 for(const d of next.documents)if(d.basedOn&&ids.has(d.basedOn.documentId))d.basedOn.revision=documentRevisions[d.basedOn.documentId].next;
 next.revision=revision;validate(next);return next;
}
