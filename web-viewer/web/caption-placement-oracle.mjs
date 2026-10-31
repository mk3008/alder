import assert from 'node:assert/strict';

// Read actual rendered SVG geometry, without importing the production router.
export function stateCaptionGeometry(svg){
 const nodes=[...svg.querySelectorAll('[data-state]')].map(e=>{const r=e.querySelector('rect');return {id:e.dataset.state,x:+r.getAttribute('x'),y:+r.getAttribute('y'),width:+r.getAttribute('width'),height:+r.getAttribute('height')};});
 const paths=[...svg.querySelectorAll('path.edge[data-transitions]')].map(e=>({id:e.dataset.transitions,d:e.getAttribute('d')}));
 const captions=[...svg.querySelectorAll('.state-diagram-edge-label')].map(e=>({id:e.dataset.transitionId,x:+e.getAttribute('x'),y:+e.getAttribute('y'),lines:[...e.querySelectorAll('tspan')].map(t=>t.textContent)}));
 return {nodes,paths,captions};
}

export function assertStateCaptionPlacement(snapshot,rows){
 const boxes=[],occupied=new Map();
 assert.equal(snapshot.paths.length,rows.length);assert.equal(snapshot.captions.length,rows.length);
 for(const row of rows){
  const node=snapshot.nodes.find(n=>n.id===row.from),caption=snapshot.captions.find(c=>c.id===row.id),path=snapshot.paths.find(p=>p.id===row.id);
  assert.ok(node&&caption&&path,'one state, caption, and path for '+row.id);
  const nums=path.d.match(/-?\d+(?:\.\d+)?/g).map(Number),x0=nums[0],y0=nums[1];
  const width=Math.max(...caption.lines.map(s=>Array.from(s).length*14)),height=caption.lines.length*18;
  const returning=Math.abs(x0-(node.x+node.width))<1e-7;
  if(row.from===row.to){
   const xs=nums.filter((_,i)=>i%2===0),ys=nums.filter((_,i)=>i%2===1),lastX=nums.at(-2),lastY=nums.at(-1);
   assert.ok(x0>node.x&&x0<node.x+node.width&&y0===node.y,'self-loop leaves the top of its own state: '+row.id);
   assert.ok(lastX>node.x&&lastX<node.x+node.width&&lastY===node.y,'self-loop returns to the top of the same state: '+row.id);
   assert.ok(caption.x>=Math.max(...xs)+8-1e-7,'self-loop caption follows its bend: '+row.id);
   assert.ok(Math.abs(caption.y-14+height/2-Math.min(...ys))<1e-7,'self-loop caption shares its upper line: '+row.id);
  }else if(returning){
   const right=Math.max(...nums.filter((_,i)=>i%2===0));
   assert.ok(caption.x>=right+8-1e-7,'return caption follows its right-hand bend: '+row.id);
   assert.ok(Math.abs(caption.y-14+height/2-y0)<1e-7,'return caption shares the departure line: '+row.id);
  }else{
   assert.ok(Math.abs(y0-(node.y+node.height))<1e-7,'forward line departs below its state: '+row.id);
   const offset=occupied.has(row.from)?occupied.get(row.from)+8:0;
   assert.ok(Math.abs(caption.y-(node.y+node.height+24+14+offset))<1e-7,'forward caption has 24px departure clearance: '+row.id);
   occupied.set(row.from,offset+height);
  }
  boxes.push({id:row.id,x:caption.x,y:caption.y-14,width,height});
 }
 const overlap=(a,b)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
 for(const [i,box]of boxes.entries()){
  for(const node of snapshot.nodes)assert.equal(overlap(box,node),false,'caption '+box.id+' does not cover state '+node.id);
  for(const other of boxes.slice(i+1))assert.equal(overlap(box,other),false,'captions '+box.id+' and '+other.id+' do not overlap');
 }
 return {captions:boxes.length,clearance:24};
}
