// Independent acceptance arithmetic: 68px card + 24px clearance + 20px caption + 24px clearance, then one
// 22px line per additional distinct normal departure. No production constants.
import assert from 'node:assert/strict';
export function captionRows(ids,forward){
 const counts=new Map(),seen=new Set();
 for(const r of forward){const key=JSON.stringify([r.kind,r.from,r.label]);if(seen.has(key))continue;seen.add(key);counts.set(r.from,(counts.get(r.from)??0)+1);}
 let y=40;return Object.fromEntries(ids.map(id=>{const row=[id,y];y+=(counts.has(id)?136+22*(counts.get(id)-1):112);return row;}));
}
export function assertCaptionRows(positions,forward,ids=Object.keys(positions).sort((a,b)=>positions[a][1]-positions[b][1])){
 const rows=captionRows(ids,forward);for(const id of ids)assert.equal(positions[id][1],rows[id],'24px above/below caption rows; no-caption gap remains 44px: '+id);
}

// Snapshot only public SVG geometry and explicit transition membership.
// This function is also serialized into native Chrome; no production imports.
export function stateCaptionSnapshot(svg){
 return {
  nodes:[...svg.querySelectorAll('[data-state]')].map(e=>{const r=e.querySelector('rect');return {id:e.dataset.state,x:+r.getAttribute('x'),y:+r.getAttribute('y'),width:+r.getAttribute('width'),height:+r.getAttribute('height')};}),
  captions:[...svg.querySelectorAll('.state-diagram-edge-label')].map(e=>{const transition=e.querySelector('tspan').dataset.transitions.split(' ')[0],path=[...svg.querySelectorAll('path.edge[data-transitions]')].find(p=>p.dataset.transitions===transition),start=path.getAttribute('d').match(/^M(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);return {y:+e.getAttribute('y'),lines:e.querySelectorAll('tspan').length,transition,startX:+start[1]};})
 };
}
export function assertStateCaptionRows(snapshot,transitions){
 const occupied=new Map();
 for(const caption of snapshot.captions){
  const from=transitions.find(t=>t.id===caption.transition).from,node=snapshot.nodes.find(n=>n.id===from);
  if(Math.abs(caption.startX-(node.x+node.width))<1e-7)continue;
  const offset=occupied.has(from)?occupied.get(from)+8:0;
  assert.equal(caption.y,node.y+node.height+24+14+offset,'state caption uses the same 24px source clearance');
  occupied.set(from,offset+caption.lines*18);
 }
 const loops=new Map();
 for(const row of transitions)if(row.from===row.to){const caption=snapshot.captions.find(c=>c.transition===row.id),items=loops.get(row.from)??[];items.push(caption.lines*18);loops.set(row.from,items);}
 let y=40,occupiedBottom=4;
 for(const node of snapshot.nodes.slice().sort((a,b)=>a.y-b.y)){
  const heights=loops.get(node.id)??[],required=heights.length?32+heights.reduce((a,b)=>a+b,0)+8*(heights.length-1):0;
  if(required)y=Math.max(y,occupiedBottom+required+12);
  const height=Math.max(44,(heights.length+1)*14);assert.equal(node.height,height);assert.equal(node.y,y,'state rows reserve forward captions and self-loop captions once');
  occupiedBottom=y+height+(occupied.has(node.id)?24+occupied.get(node.id):0);
  y+=height+(occupied.has(node.id)?24+occupied.get(node.id)+24:44);
 }
 return {states:snapshot.nodes.length,captionGroups:snapshot.captions.length,clearance:24};
}
