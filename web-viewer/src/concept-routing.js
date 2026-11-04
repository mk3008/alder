// Concept relationships deliberately use one elbow only. Other diagrams use
// their own router and are not affected by this layout rule.
const vectors={left:[-1,0],right:[1,0],top:[0,-1],bottom:[0,1]};
const overlap=(a,b,c,d)=>Math.min(Math.max(a,b),Math.max(c,d))-Math.max(Math.min(a,b),Math.min(c,d))>0.01;
const segment=(a,b)=>({a,b});
function blocked(a,b,r){return a.x===b.x?a.x>r.x&&a.x<r.x+r.w&&overlap(a.y,b.y,r.y,r.y+r.h):a.y===b.y&&a.y>r.y&&a.y<r.y+r.h&&overlap(a.x,b.x,r.x,r.x+r.w);}
export function sharedRun(a,b,c,d,gap=0.01){
 if(a.x===b.x&&c.x===d.x)return Math.abs(a.x-c.x)<gap&&overlap(a.y,b.y,c.y,d.y);
 if(a.y===b.y&&c.y===d.y)return Math.abs(a.y-c.y)<gap&&overlap(a.x,b.x,c.x,d.x);
 return false;
}
function crosses(a,b){
 const av=a.a.x===a.b.x,bv=b.a.x===b.b.x;if(av===bv)return false;
 const v=av?a:b,h=av?b:a,x=v.a.x,y=h.a.y;
 return x>Math.min(h.a.x,h.b.x)&&x<Math.max(h.a.x,h.b.x)&&y>Math.min(v.a.y,v.b.y)&&y<Math.max(v.a.y,v.b.y);
}
function rectOverlap(a,b){return a.left<b.left+b.w&&a.left+a.w>b.left&&a.top<b.top+b.h&&a.top+a.h>b.top;}
function label(port,count){
 const [vx,vy]=vectors[port.side],horizontal=vx!==0,x=port.p.x+vx*24+(horizontal?0:10),y=port.p.y+vy*24+(horizontal?-10:4),w=count.length*8+10;
 return{x,y,w,h:18,left:horizontal?x-w/2:x-5,top:y-13,anchor:horizontal?'middle':'start',count,table:port.table,edge:port.edge};
}
function crossesLabel({a,b},r){
 let low=0,high=1;
 for(const axis of ['x','y']){
  const min=(axis==='x'?r.left:r.top)-3,max=min+(axis==='x'?r.w:r.h)+6,delta=b[axis]-a[axis];
  if(!delta){if(a[axis]<min||a[axis]>max)return false;}
  else{const t1=(min-a[axis])/delta,t2=(max-a[axis])/delta;low=Math.max(low,Math.min(t1,t2));high=Math.min(high,Math.max(t1,t2));if(low>high)return false;}
 }return true;
}
const labelOffsets=[];
for(const dy of [0,-10,10,-20,20,-30,30])for(const dx of [0,-8,8,-16,16,-24,24,-32,32])if(Math.abs(dx)+Math.abs(dy)<=32)labelOffsets.push([dx,dy]);
labelOffsets.sort((a,b)=>Math.abs(a[0])+Math.abs(a[1])-Math.abs(b[0])-Math.abs(b[1]));
function nearLabel(item,cards,placed,segments){
 for(const [dx,dy]of labelOffsets){
  const c={...item,x:item.x+dx,y:item.y+dy,left:item.left+dx,top:item.top+dy};
  if(c.left<0||c.top<0||cards.some(b=>rectOverlap(c,b))||placed.some(b=>rectOverlap(c,b))||segments.some(s=>crossesLabel(s,c)))continue;
  return c;
 }
}
function ports(edge,table,box,side,count){
 const horizontal=side==='top'||side==='bottom',span=horizontal?box.w:box.h,offsets=[],spacing=Math.max(20,Math.ceil((span-28)/24));
 for(let n=18;n<=span-10;n+=spacing)offsets.push(n);
 if(!offsets.length)offsets.push(span/2);
 return offsets.map(offset=>{
  const p={x:side==='left'?box.x:side==='right'?box.x+box.w:box.x+offset,y:side==='top'?box.y:side==='bottom'?box.y+box.h:box.y+offset};
  const result={edge,table,side,count,p};result.label=label(result,count);return result;
 });
}
const better=(a,b)=>a.some((v,i)=>v!==b[i]&&v<b[i]&&a.slice(0,i).every((n,j)=>n===b[j]));
function path(start,corner,end){
 const radius=Math.min(6,Math.abs(corner.y-start.y)/2,Math.abs(end.x-corner.x)/2),dy=Math.sign(corner.y-start.y),dx=Math.sign(end.x-corner.x);
 return `M ${start.x} ${start.y} L ${corner.x} ${corner.y-dy*radius} Q ${corner.x} ${corner.y} ${corner.x+dx*radius} ${corner.y} L ${end.x} ${end.y}`;
}
export function routeER(boxes,edges){
 const active=edges.filter(([a,b])=>boxes.has(a)&&boxes.has(b)).map(([from,to,fromCount,toCount,kind],id)=>({id,from,to,fromCount,toCount,kind}));
 const used=[],placed=[],routed=[],cards=[...boxes.values()].map(r=>({left:r.x,top:r.y,w:r.w,h:r.h}));let width=0,height=0;
 for(const e of active){
  const reference=e.kind==='reference',fromBox=boxes.get(e.from),toBox=boxes.get(e.to);
  const fromPorts=ports(e.id,e.from,fromBox,reference?'top':'bottom',e.fromCount),toPorts=ports(e.id,e.to,toBox,reference?'right':'left',e.toCount);
  const prior=routed.flatMap(r=>r.segments);
  let best,bestScore;
  for(const from of fromPorts)for(const to of toPorts){
   const a=from.p,b=to.p;
   // No reversal or extra corner is permitted, including for saved positions.
   if(reference?!(a.x>b.x+2&&a.y>b.y+2):!(a.x+2<b.x&&a.y+2<b.y))continue;
   const corner={x:a.x,y:b.y},segments=[segment(a,corner),segment(corner,b)];
   if([...boxes].some(([id,box])=>id!==e.from&&id!==e.to&&segments.some(s=>blocked(s.a,s.b,box))))continue;
   const duplicates=[from,to].filter(p=>used.some(q=>p.table===q.table&&p.side===q.side&&p.p.x===q.p.x&&p.p.y===q.p.y)).length;
   const shared=segments.reduce((n,s)=>n+prior.filter(t=>sharedRun(s.a,s.b,t.a,t.b)).length,0);
   const cross=segments.reduce((n,s)=>n+prior.filter(t=>crosses(s,t)).length,0);
   const first=nearLabel(from.label,cards,placed,[...prior,...segments]);
   const second=nearLabel(to.label,cards,first?[...placed,first]:placed,[...prior,...segments]);
   const labelConflicts=Number(!first)+Number(!second)+segments.reduce((n,s)=>n+placed.filter(l=>crossesLabel(s,l)).length,0);
   const score=[duplicates,shared,labelConflicts,cross,Math.abs(a.x-b.x)+Math.abs(a.y-b.y)];
   if(!best||better(score,bestScore)){best={from,to,corner,segments,labels:[first??{...from.label,conflict:true},second??{...to.label,conflict:true}]};bestScore=score;}
  }
  if(!best){routed.push({...e,ports:[],points:[],segments:[],unrouted:true,d:''});continue;}
  const p=[best.from,best.to],points=[best.from.p,best.corner,best.to.p];used.push(...p);placed.push(...best.labels);
  width=Math.max(width,...points.map(v=>v.x+35));height=Math.max(height,...points.map(v=>v.y+35));
  routed.push({...e,ports:p,points,segments:best.segments,unrouted:false,d:path(...points)});
 }
 const segments=routed.flatMap(r=>r.segments),labels=placed.map(l=>segments.some(s=>crossesLabel(s,l))?{...l,conflict:true}:l);
 for(const l of labels){width=Math.max(width,l.left+l.w+20);height=Math.max(height,l.top+l.h+20);}
 return {routes:routed,labels,width,height};
}
