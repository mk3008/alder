import {validate,inventory,demand} from './core.mjs';
/** Atomic, explicitly versioned edits. Does not infer rebasing or human review decisions. */
export function applyEdits(pkg,{expectedRevision,revision,documentRevisions,changes}){
 validate(pkg);demand(pkg.revision===expectedRevision,'Package revision conflict');demand(revision&&revision!==expectedRevision,'New package revision required');
 const next=structuredClone(pkg),inv=inventory(next),changed=new Set(),seen=new Set();
 for(const {id,values}of changes){demand(!seen.has(id),'Duplicate edit ID');seen.add(id);demand(inv.map.has(id),'Unknown edit ID');const owner=inv.owner.get(id),d=next.documents.find(d=>d.id===owner);demand(d,'External reference catalog is read-only');
 demand(documentRevisions[owner]?.expected===d.revision,'Document revision conflict');demand(!['id','kind','schemaVersion','checkId','sourceId','revision'].some(k=>Object.hasOwn(values,k)),'Identity/type is immutable');
 demand(!Object.keys(values).some(k=>['__proto__','constructor','prototype'].includes(k)),'Reserved edit key');Object.assign(inv.map.get(id),values);changed.add(owner);
 }
 demand(changed.size>0,'No edits');demand(Object.keys(documentRevisions).length===changed.size,'Revision entries must match edited documents');
 for(const id of changed){const d=next.documents.find(d=>d.id===id),r=documentRevisions[id];demand(typeof r.next==='string'&&r.next.trim()&&r.next!==r.expected,'New document revision required');d.revision=r.next;}
 next.revision=revision;validate(next);const final=inventory(next);for(const [id,e]of inventory(pkg).map){demand(final.map.has(id),'Existing identity cannot be removed by edit');demand(inv.types.get(id)===final.types.get(id)&&inv.owner.get(id)===final.owner.get(id),'Identity ownership/type cannot change');const actual=final.map.get(id);demand(actual.checkId===e.checkId&&actual.sourceId===e.sourceId,'Source identity cannot change');}return next;
}
