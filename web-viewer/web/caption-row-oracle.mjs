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
  captions:[...svg.querySelectorAll('.state-diagram-edge-label')].map(e=>{const transition=e.querySelector('tspan').dataset.transitions.split(' ')[0],path=[...svg.querySelectorAll('path.edge[data-transitions]')].find(p=>p.dataset.transitions.split(' ').includes(transition)),start=path.getAttribute('d').match(/^M(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);return {y:+e.getAttribute('y'),lines:e.querySelectorAll('tspan').length,transition,startX:+start[1]};})
 };
}
export function assertStateCaptionRows(snapshot,transitions){
 const occupied=new Map();
 for(const caption of snapshot.captions){
  const row=transitions.find(t=>t.id===caption.transition),from=row.from,node=snapshot.nodes.find(n=>n.id===from);
  if(row.from===row.to)continue;
  if(Math.abs(caption.startX-(node.x+node.width))<1e-7)continue;
  const offset=occupied.has(from)?occupied.get(from)+8:0;
  const loopCaptions=transitions.filter(t=>t.from===from&&t.to===from).map(t=>snapshot.captions.find(c=>c.transition===t.id));
  const loopDepth=loopCaptions.length?24+loopCaptions.reduce((n,c)=>n+c.lines*18,0)+8*(loopCaptions.length-1)+8:0;
  assert.equal(caption.y,node.y+node.height+24+loopDepth+14+offset,'forward caption follows reserved loop space');
  occupied.set(from,offset+caption.lines*18);
 }
 const loops=new Map();
 for(const row of transitions)if(row.from===row.to){const caption=snapshot.captions.find(c=>c.transition===row.id),items=loops.get(row.from)??[];items.push(caption.lines*18);loops.set(row.from,items);}
 let y=40;
 for(const node of snapshot.nodes.slice().sort((a,b)=>a.y-b.y)){
  const heights=loops.get(node.id)??[],required=heights.length?24+heights.reduce((a,b)=>a+b,0)+8*(heights.length-1)+8:0;
  const height=44;assert.equal(node.height,height);assert.equal(node.y,y,'state rows reserve forward captions and self-loop captions once');
  const captions=(occupied.get(node.id)??0)+required;
  y+=height+(captions?24+captions+24:44);
 }
 return {states:snapshot.nodes.length,captionGroups:snapshot.captions.length,clearance:24};
}
