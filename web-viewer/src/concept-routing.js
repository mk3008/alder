import {routeEdge} from './routing.ts';
// Independent ER edges: distinct table ports, no shared parallel runs.
const GAP=18, LEAD=44;
const vectors={left:[-1,0],right:[1,0],top:[0,-1],bottom:[0,1]};
const overlap=(a,b,c,d)=>Math.min(Math.max(a,b),Math.max(c,d))-Math.max(Math.min(a,b),Math.min(c,d))>0.01;
const segment=(a,b)=>({a,b});
function inside(p,r){return p.x>r.x&&p.x<r.x+r.w&&p.y>r.y&&p.y<r.y+r.h;}
function blocked(a,b,r){return a.x===b.x?a.x>r.x&&a.x<r.x+r.w&&overlap(a.y,b.y,r.y,r.y+r.h):a.y>r.y&&a.y<r.y+r.h&&overlap(a.x,b.x,r.x,r.x+r.w);}
export function sharedRun(a,b,c,d,gap=0.01){
 if(a.x===b.x&&c.x===d.x)return Math.abs(a.x-c.x)<gap&&overlap(a.y,b.y,c.y,d.y);
 if(a.y===b.y&&c.y===d.y)return Math.abs(a.y-c.y)<gap&&overlap(a.x,b.x,c.x,d.x);
 return false;
}
function intersects(a,b,c,d){
 const v=a.x===b.x?{a,b}:{a:c,b:d},h=a.x===b.x?{a:c,b:d}:{a,b};
 return v.a.x===v.b.x&&h.a.y===h.b.y&&v.a.x>=Math.min(h.a.x,h.b.x)&&v.a.x<=Math.max(h.a.x,h.b.x)&&h.a.y>=Math.min(v.a.y,v.b.y)&&h.a.y<=Math.max(v.a.y,v.b.y);
}
function sides(){return ['bottom','left'];}
function rectOverlap(a,b){return a.left<b.left+b.w&&a.left+a.w>b.left&&a.top<b.top+b.h&&a.top+a.h>b.top;}
function label(port,count){
 const [vx,vy]=vectors[port.side],horizontal=vx!==0,x=port.p.x+vx*24+(horizontal?0:10),y=port.p.y+vy*24+(horizontal?-10:4),w=count.length*8+10;
 return{x,y,w,h:18,left:horizontal?x-w/2:x-5,top:y-13,anchor:horizontal?'middle':'start',count,table:port.table,edge:port.edge};
}
// Check the completed rounded route, not just the 44px port lead. A narrow
// saved/local layout can extend the vertical leg behind the arrival count.
function crossesLabel({a,b},r){
 let low=0,high=1;
 for(const axis of ['x','y']){
  const min=(axis==='x'?r.left:r.top)-3,max=min+(axis==='x'?r.w:r.h)+6,delta=b[axis]-a[axis];
  if(!delta){if(a[axis]<min||a[axis]>max)return false;}
  else{const t1=(min-a[axis])/delta,t2=(max-a[axis])/delta;low=Math.max(low,Math.min(t1,t2));high=Math.min(high,Math.max(t1,t2));if(low>high)return false;}
 }return true;
}
function placeLabels(labels,boxes,routes){
 const placed=[],segments=routes.flatMap(r=>r.segments),cards=[...boxes.values()].map(b=>({left:b.x,top:b.y,w:b.w,h:b.h}));
 for(const label of labels){
  let next;
  for(const dy of [0,-22,22,-44,44]){
   for(const dx of [0,8,-8,16,-16,24,-24,48,-48,80,-80]){
    const c={...label,x:label.x+dx,y:label.y+dy,left:label.left+dx,top:label.top+dy};
    if(c.left<0||c.top<0||cards.some(b=>rectOverlap(c,b))||placed.some(b=>rectOverlap(c,b))||segments.some(segment=>crossesLabel(segment,c)))continue;
    next=c;break;
   }if(next)break;
  }
  // Never hide an unresolved collision with an opaque label background.
  placed.push(next||{...label,conflict:true});
 }return placed;
}
export function routeER(boxes,edges){
 const active=edges.filter(([a,b])=>boxes.has(a)&&boxes.has(b)).map(([from,to,fromCount,toCount,kind],id)=>({id,from,to,fromCount,toCount,kind})),ports=[];
 for(const e of active){const ss=sides(boxes.get(e.from),boxes.get(e.to),e.kind);e.ports=[{edge:e.id,table:e.from,side:ss[0],count:e.fromCount},{edge:e.id,table:e.to,side:ss[1],count:e.toCount}];ports.push(...e.ports);}
 // Allocate independent ports near the safe edge, not across the entire
 // bottom edge: a far-right outlet may point straight into the next card.
 const allocated=[];
 // Order independent outlets by the opposite endpoint. Long downward links
 // take the left outlet so they can pass left of the nearer staircase link.
 // Left landings put nearer/lower sources first, with long downward links
 // below them so their horizontal segments do not cross the nearer drop.
 const opposite=p=>{const e=active[p.edge],b=boxes.get(p.table===e.from?e.to:e.from);return{x:b.x+b.w/2,y:b.y+b.h/2};};
 const portOrder=(a,b)=>{
  const av=a.side==='left'||a.side==='right',bv=b.side==='left'||b.side==='right';
  if(av!==bv)return Number(av)-Number(bv);
  if(a.table===b.table&&a.side===b.side){const aa=opposite(a),bb=opposite(b);return av?(a.side==='left'?bb.y-aa.y:aa.y-bb.y):a.side==='bottom'?bb.y-aa.y:aa.x-bb.x;}
  return a.table.localeCompare(b.table)||a.side.localeCompare(b.side)||a.edge-b.edge;
 };
 for(const p of [...ports].sort(portOrder)){
  const b=boxes.get(p.table),vertical=p.side==='left'||p.side==='right',span=vertical?b.h:b.w;
  const offsets=[];for(let offset=22;offset<=span-22;offset+=36)offsets.push(offset);
  const candidates=offsets.map(offset=>{
   const point={x:p.side==='left'?b.x:p.side==='right'?b.x+b.w:b.x+offset,y:p.side==='top'?b.y:p.side==='bottom'?b.y+b.h:b.y+offset};
   const [vx,vy]=vectors[p.side],q={x:point.x+vx*LEAD,y:point.y+vy*LEAD},candidate={...p,p:point,q};candidate.label=label(candidate,p.count);return candidate;
  });
  const safe=c=>![...boxes].some(([id,r])=>id!==p.table&&(blocked(c.p,c.q,{x:r.x-8,y:r.y-8,w:r.w+16,h:r.h+16})||inside(c.q,{x:r.x-8,y:r.y-8,w:r.w+16,h:r.h+16})||rectOverlap(c.label,{left:r.x,top:r.y,w:r.w,h:r.h})))&&!allocated.some(a=>(a.table===p.table&&a.side===p.side&&Math.abs((vertical?a.p.y:a.p.x)-(vertical?c.p.y:c.p.x))<32)||rectOverlap(a.label,c.label)||blocked(c.p,c.q,{x:a.label.left-3,y:a.label.top-3,w:a.label.w+6,h:a.label.h+6})||blocked(a.p,a.q,{x:c.label.left-3,y:c.label.top-3,w:c.label.w+6,h:c.label.h+6})||sharedRun(a.p,a.q,c.p,c.q));
  let c=candidates.find(safe);
  if(!c){const peers=allocated.filter(a=>a.table===p.table&&a.side===p.side),offset=22+peers.length*36,point={x:p.side==='left'?b.x:p.side==='right'?b.x+b.w:b.x+offset,y:p.side==='top'?b.y:p.side==='bottom'?b.y+b.h:b.y+offset},[vx,vy]=vectors[p.side];c={...p,p:point,q:{x:point.x+vx*LEAD,y:point.y+vy*LEAD},portConflict:true};c.label=label(c,p.count);}
  Object.assign(p,c);allocated.push(p);
 }
 const nodes=[...boxes].map(([id,b])=>({id,x:b.x,y:b.y,width:b.w,height:b.h})),routed=[];let width=0,height=0;
 for(const e of active){const [a,b]=e.ports,source=boxes.get(e.from),target=boxes.get(e.to);
  const route=routeEdge({from:e.from,to:e.to,nodes,index:e.id,kind:'input',matrix:{returning:false,captionLane:0},ports:{from:(a.p.x-source.x)/source.w,to:(b.p.y-target.y)/target.h},labelWidth:0,labelHeight:0});
  const points=route.points.map(([x,y])=>({x,y})),segments=points.slice(1).map((p,i)=>segment(points[i],p));
  width=Math.max(width,route.bounds.right+35);height=Math.max(height,route.bounds.bottom+35);
  routed.push({...e,points,segments,unrouted:route.fallback,d:route.path});
 }
 return {routes:routed.sort((a,b)=>a.id-b.id),labels:placeLabels(ports.map(p=>p.label),boxes,routed),width,height};
}
