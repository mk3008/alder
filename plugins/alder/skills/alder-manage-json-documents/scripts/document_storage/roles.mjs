/** Explicit structural upgrade. Existing MD Who text is retained; compound roles are not split or merged. */
import {createHash} from 'node:crypto';
import {validate,demand} from './core.mjs';
export const ROLE_PALETTE=['#8b5cf6','#2563eb','#c2410c','#008576','#be185d'];
export function initialRoleColor(who){let hash=0;for(const c of who)hash=(hash*31+c.codePointAt(0))>>>0;return ROLE_PALETTE[hash%5];}
export const simpleWho=who=>who===who.trim()&&/^[\p{L}\p{N}_ -]+$/u.test(who)&&!/(?:と|および|及び|または|又は|兼)/u.test(who);
export function withRoles(bd,diagnostics,previous,bindings={}){
 const next=structuredClone(bd);next.schemaVersion='0.2';next.roles=[];
 for(const a of next.activities){
  a.roleId=null;
  if(!simpleWho(a.who)){diagnostics.push('Role未確定: '+a.id+' — '+a.who);continue;}
  const priorActivity=previous?.activities.find(p=>p.id===a.id||p.name===a.name||bindings[p.id]===a.name);
  const old=priorActivity?.who===a.who?previous.roles?.find(r=>r.id===priorActivity.roleId):null;
  let role=next.roles.find(r=>old?r.id===old.id:r.name===a.who);
  if(!role){role=old?structuredClone(old):{id:'role-'+createHash('sha256').update(bd.id+':'+a.who).digest('hex').slice(0,32),name:a.who,color:initialRoleColor(a.who)};next.roles.push(role);}
  a.roleId=role.id;
 }
 return next;
}
/** Migration is an operation, not a silent read-time rewrite. No file writes or human approval. */
export function upgradeRoles(pkg,{expectedRevision,revision,documentRevisions}){
 validate(pkg);demand(['0.1','0.2'].includes(pkg.formatVersion),'Only 0.1/0.2 can be upgraded');demand(pkg.revision===expectedRevision&&revision&&revision!==expectedRevision,'Migration package revision conflict');
 const next=structuredClone(pkg),changed=new Set();next.formatVersion='0.3';next.revision=revision;
 const revisions=new Map();for(let i=0;i<next.documents.length;i++){const d=next.documents[i];if(d.kind==='businessDesign'){next.documents[i]=withRoles(d,next.diagnostics);changed.add(d.id);revisions.set(d.id,documentRevisions[d.id]?.next);}}
 for(const d of next.documents){if(d.basedOn&&revisions.has(d.basedOn.documentId)){d.basedOn.revision=revisions.get(d.basedOn.documentId);changed.add(d.id);}if(changed.has(d.id)){const r=documentRevisions[d.id];demand(r&&r.expected===d.revision&&typeof r.next==='string'&&r.next.trim()&&r.next!==r.expected,'Migration document revision conflict: '+d.id);d.revision=r.next;}}
 demand(Object.keys(documentRevisions).length===changed.size,'Migration revisions must match changed documents');validate(next);return next;
}
