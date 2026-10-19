// Independent acceptance arithmetic: 68px card, 44px base gap, then one
// 22px line per additional distinct normal departure. No production constants.
import assert from 'node:assert/strict';
export function captionRows(ids,forward){
 const counts=new Map(),seen=new Set();
 for(const r of forward){const key=JSON.stringify([r.kind,r.from,r.label]);if(seen.has(key))continue;seen.add(key);counts.set(r.from,(counts.get(r.from)??0)+1);}
 let y=40;return Object.fromEntries(ids.map(id=>{const row=[id,y];y+=112+22*Math.max(0,(counts.get(id)??0)-1);return row;}));
}
export function assertCaptionRows(positions,forward,ids=Object.keys(positions).sort((a,b)=>positions[a][1]-positions[b][1])){
 const rows=captionRows(ids,forward);for(const id of ids)assert.equal(positions[id][1],rows[id],'only additional caption lines expand the 44px card gap: '+id);
}
