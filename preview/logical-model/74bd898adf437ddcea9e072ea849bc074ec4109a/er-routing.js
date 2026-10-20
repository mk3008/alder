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
function sides(a,b,kind){
 // Downward staircase edges enter the child's left side. A vertical pair
 // keeps a horizontal landing for its endpoint count instead of a bottom/top Z.
 if(kind==='down'&&b.y>=a.y+a.h+24)return ['bottom',b.x>=60?'left':'right'];
 const horizontalOverlap=a.x<b.x+b.w&&a.x+a.w>b.x;
 if(horizontalOverlap&&b.y>=a.y+a.h+24)return ['bottom',b.x>=60?'left':'right'];
 if(horizontalOverlap&&a.y>=b.y+b.h+24)return [a.x>=60?'left':'right','bottom'];
 if(b.x>=a.x+a.w+36)return ['right','left'];
 if(a.x>=b.x+b.w+36)return ['left','right'];
 return b.y+b.h/2>=a.y+a.h/2?['bottom',b.x>=60?'left':'right']:[a.x>=60?'left':'right','bottom'];
}
function label(port,count){
 const [vx,vy]=vectors[port.side],horizontal=vx!==0,x=port.p.x+vx*24+(horizontal?0:10),y=port.p.y+vy*24+(horizontal?-10:4),w=count.length*8+10;
 return{x,y,w,h:18,left:horizontal?x-w/2:x-5,top:y-13,anchor:horizontal?'middle':'start',count,table:port.table};
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
  for(const [nx,ny,dir]of [[x-1,y,1],[x+1,y,1],[x,y-1,2],[x,y+1,2]]){if(nx<0||nx>=width||ny<0||ny>=yy.length)continue;const other=node(nx,ny),q=point(other);if((other!==target&&rects.some(r=>inside(q,r)))||!pass(n,other))continue;const next=other*3+dir,value=distance+Math.abs(p.x-q.x)+Math.abs(p.y-q.y)+(direction&&direction!==dir?20:0);if(value>=(cost.get(next)??Infinity))continue;cost.set(next,value);previous.set(next,key);push(heap,[value,next]);}
 }
 if(last===undefined)return null;
 const path=[];for(let k=last;k!==undefined;k=previous.get(k))path.push(point(Math.floor(k/3)));return path.reverse();
}
function simplify(points){const out=[];for(const p of points){if(out.length&&out.at(-1).x===p.x&&out.at(-1).y===p.y)continue;while(out.length>1){const a=out.at(-2),b=out.at(-1);if((a.x===b.x&&b.x===p.x&&(b.y-a.y)*(p.y-b.y)>=0)||(a.y===b.y&&b.y===p.y&&(b.x-a.x)*(p.x-b.x)>=0))out.pop();else break;}out.push(p);}return out;}
export function routeER(boxes,edges){
 const active=edges.filter(([a,b])=>boxes.has(a)&&boxes.has(b)).map(([from,to,fromCount,toCount,kind],id)=>({id,from,to,fromCount,toCount,kind})),ports=[];
 for(const e of active){const ss=sides(boxes.get(e.from),boxes.get(e.to),e.kind);e.ports=[{edge:e.id,table:e.from,side:ss[0],count:e.fromCount},{edge:e.id,table:e.to,side:ss[1],count:e.toCount}];ports.push(...e.ports);}
 for(const p of ports){const peers=ports.filter(q=>q.table===p.table&&q.side===p.side),i=peers.indexOf(p),b=boxes.get(p.table),vertical=p.side==='left'||p.side==='right',span=vertical?b.h:b.w,offset=peers.length===1?22:22+(span-44)*i/(peers.length-1);
  p.p={x:p.side==='left'?b.x:p.side==='right'?b.x+b.w:b.x+offset,y:p.side==='top'?b.y:p.side==='bottom'?b.y+b.h:b.y+offset};const [vx,vy]=vectors[p.side];p.q={x:p.p.x+vx*LEAD,y:p.p.y+vy*LEAD};p.label=label(p,p.count);
 }
 const rects=[...[...boxes.values()].map(b=>({x:b.x-8,y:b.y-8,w:b.w+16,h:b.h+16})),...ports.map(p=>({x:p.label.left-3,y:p.label.top-3,w:p.label.w+6,h:p.label.h+6}))];
 const leads=ports.map(p=>({...segment(p.p,p.q),edge:p.edge})),routed=[],lanes=ports.map(p=>p.q);let width=0,height=0;
 for(const e of active){const [a,b]=e.ports,reserved=[...leads,...routed.flatMap(r=>r.segments)];const middle=orthogonal(a.q,b.q,rects,reserved,lanes);
  // Never silently reuse a connector when tables leave no route. Keep each
  // endpoint and its count visible and flag the unresolved connection.
  const points=middle?simplify([a.p,...middle,b.p]):null,segments=points?points.slice(1).map((p,i)=>segment(points[i],p)):[];
  for(const p of points||[a.p,a.q,b.p,b.q]){width=Math.max(width,p.x+35);height=Math.max(height,p.y+35);}
  routed.push({...e,points,segments,unrouted:!middle,d:points?points.map((p,i)=>(i?'L':'M')+p.x+' '+p.y).join(' '):`M${a.p.x} ${a.p.y}L${a.q.x} ${a.q.y}M${b.q.x} ${b.q.y}L${b.p.x} ${b.p.y}`});
 }
 return {routes:routed,labels:ports.map(p=>p.label),width,height};
}
