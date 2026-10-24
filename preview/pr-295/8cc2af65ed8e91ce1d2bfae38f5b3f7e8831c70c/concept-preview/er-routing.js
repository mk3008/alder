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
function sides(a,b,kind){
 // All downward relations, including references, leave the bottom and
 // enter the left: down first, then right (the reviewer's water route).
 if(b.y>=a.y+a.h+24)return ['bottom',b.x>=60?'left':'right'];
 // Downward staircase edges enter the child's left side. A vertical pair
 // keeps a horizontal landing for its endpoint count instead of a bottom/top Z.
 if(kind.startsWith('down')&&b.y>=a.y+a.h+24)return ['bottom',b.x>=60?'left':'right'];
 const horizontalOverlap=a.x<b.x+b.w&&a.x+a.w>b.x;
 if(horizontalOverlap&&b.y>=a.y+a.h+24)return ['bottom',b.x>=60?'left':'right'];
 if(horizontalOverlap&&a.y>=b.y+b.h+24)return [a.x>=60?'left':'right','bottom'];
 if(b.x>=a.x+a.w+36)return ['right','left'];
 if(a.x>=b.x+b.w+36)return ['left','right'];
 return b.y+b.h/2>=a.y+a.h/2?['bottom',b.x>=60?'left':'right']:[a.x>=60?'left':'right','bottom'];
}
function rectOverlap(a,b){return a.left<b.left+b.w&&a.left+a.w>b.left&&a.top<b.top+b.h&&a.top+a.h>b.top;}
function label(port,count){
 const [vx,vy]=vectors[port.side],horizontal=vx!==0,x=port.p.x+vx*24+(horizontal?0:10),y=port.p.y+vy*24+(horizontal?-10:4),w=count.length*8+10;
 return{x,y,w,h:18,left:horizontal?x-w/2:x-5,top:y-13,anchor:horizontal?'middle':'start',count,table:port.table,edge:port.edge};
}
function push(heap,v){heap.push(v);let i=heap.length-1;while(i){const p=(i-1)>>1;if(heap[p][0]<=v[0])break;heap[i]=heap[p];i=p;}heap[i]=v;}
function pop(heap){const root=heap[0],v=heap.pop();if(heap.length){let i=0;while(i*2+1<heap.length){let c=i*2+1;if(c+1<heap.length&&heap[c+1][0]<heap[c][0])c++;if(heap[c][0]>=v[0])break;heap[i]=heap[c];i=c;}heap[i]=v;}return root;}
function orthogonal(start,end,rects,reserved,lanes){
 const xs=new Set([start.x,end.x,8]),ys=new Set([start.y,end.y,8]);
 for(const r of rects){xs.add(Math.max(8,r.x-12));xs.add(r.x+r.w+12);ys.add(Math.max(8,r.y-12));ys.add(r.y+r.h+12);}
 for(const p of lanes){xs.add(p.x);ys.add(p.y);}
 for(const s of reserved){for(const p of [s.a,s.b]){xs.add(Math.max(8,p.x-GAP));xs.add(p.x+GAP);ys.add(Math.max(8,p.y-GAP));ys.add(p.y+GAP);}}
 const xx=[...xs].sort((a,b)=>a-b),yy=[...ys].sort((a,b)=>a-b),width=xx.length;
 const node=(x,y)=>y*width+x,point=n=>({x:xx[n%width],y:yy[Math.floor(n/width)]}),source=node(xx.indexOf(start.x),yy.indexOf(start.y)),target=node(xx.indexOf(end.x),yy.indexOf(end.y));
 const heap=[],cost=new Map(),previous=new Map(),allowed=new Map();
 const pass=(a,b)=>{const key=a<b?a+':'+b:b+':'+a;if(allowed.has(key))return allowed.get(key);const p=point(a),q=point(b),ok=!rects.some(r=>blocked(p,q,r))&&!reserved.some(s=>sharedRun(p,q,s.a,s.b,GAP));allowed.set(key,ok);return ok;};
 cost.set(source*3,0);push(heap,[0,source*3]);let last;
 while(heap.length){const [distance,key]=pop(heap);if(distance!==cost.get(key))continue;const n=Math.floor(key/3),direction=key%3;if(n===target){last=key;break;}const x=n%width,y=Math.floor(n/width),p=point(n);
  for(const [nx,ny,dir]of [[x-1,y,1],[x+1,y,1],[x,y-1,2],[x,y+1,2]]){if(nx<0||nx>=width||ny<0||ny>=yy.length)continue;const other=node(nx,ny),q=point(other);if((other!==target&&rects.some(r=>inside(q,r)))||!pass(n,other))continue;const next=other*3+dir,value=distance+Math.abs(p.x-q.x)+Math.abs(p.y-q.y)+(direction&&direction!==dir?20:0)+reserved.filter(s=>intersects(p,q,s.a,s.b)).length*10000;if(value>=(cost.get(next)??Infinity))continue;cost.set(next,value);previous.set(next,key);push(heap,[value,next]);}
 }
 if(last===undefined)return null;
 const path=[];for(let k=last;k!==undefined;k=previous.get(k))path.push(point(Math.floor(k/3)));return path.reverse();
}
function simplify(points){const out=[];for(const p of points){if(out.length&&out.at(-1).x===p.x&&out.at(-1).y===p.y)continue;while(out.length>1){const a=out.at(-2),b=out.at(-1);if((a.x===b.x&&b.x===p.x&&(b.y-a.y)*(p.y-b.y)>=0)||(a.y===b.y&&b.y===p.y&&(b.x-a.x)*(p.x-b.x)>=0))out.pop();else break;}out.push(p);}return out;}
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
 const rects=[...[...boxes.values()].map(b=>({x:b.x-8,y:b.y-8,w:b.w+16,h:b.h+16})),...ports.map(p=>({x:p.label.left-3,y:p.label.top-3,w:p.label.w+6,h:p.label.h+6}))];
 const leads=ports.map(p=>({...segment(p.p,p.q),edge:p.edge})),routed=[],lanes=ports.map(p=>p.q);let width=0,height=0;
 const length=e=>Math.abs(e.ports[0].q.x-e.ports[1].q.x)+Math.abs(e.ports[0].q.y-e.ports[1].q.y);
 for(const e of [...active].sort((a,b)=>length(a)-length(b)||a.id-b.id)){const [a,b]=e.ports,reserved=[...leads.filter(p=>p.edge!==e.id),...routed.flatMap(r=>r.segments)];const bend={x:a.p.x,y:b.p.y};
  const landing=segment(bend,b.q),drop=segment(a.q,bend);
  const direct=a.side==='bottom'&&b.side==='left'&&b.q.x>a.q.x&&b.p.y>a.q.y&&
   !rects.some(r=>blocked(drop.a,drop.b,r)||blocked(landing.a,landing.b,r))&&
   !reserved.some(s=>sharedRun(drop.a,drop.b,s.a,s.b,GAP)||sharedRun(landing.a,landing.b,s.a,s.b,GAP));
  const middle=a.portConflict||b.portConflict?null:direct?[a.q,bend,b.q]:orthogonal(a.q,b.q,rects,reserved,lanes);
  // Never silently reuse a connector when tables leave no route. Keep each
  // endpoint and its count visible and flag the unresolved connection.
  const points=middle?simplify([a.p,...middle,b.p]):null,segments=points?points.slice(1).map((p,i)=>segment(points[i],p)):[];
  for(const p of points||[a.p,a.q,b.p,b.q]){width=Math.max(width,p.x+35);height=Math.max(height,p.y+35);}
  routed.push({...e,points,segments,unrouted:!middle,d:points?points.map((p,i)=>(i?'L':'M')+p.x+' '+p.y).join(' '):`M${a.p.x} ${a.p.y}L${a.q.x} ${a.q.y}M${b.q.x} ${b.q.y}L${b.p.x} ${b.p.y}`});
 }
 return {routes:routed.sort((a,b)=>a.id-b.id),labels:ports.map(p=>p.label),width,height};
}
