// Concept relationships use a straight line or one elbow. A self reference is
// a distinct top-right loop. Other diagrams use their own router.
const vectors={left:[-1,0],right:[1,0],top:[0,-1],bottom:[0,1]};
const SHAPE_MARGIN=12;
const single=count=>count==='1'||count==='0..1';
export const isOneToOne=edge=>single(edge[2])&&single(edge[3]);
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
 if(offsets.length&&offsets.at(-1)<span-10)offsets.push(span-10);
 if(!offsets.length)offsets.push(span/2);
 return offsets.map(offset=>{
  const p={x:side==='left'?box.x:side==='right'?box.x+box.w:box.x+offset,y:side==='top'?box.y:side==='bottom'?box.y+box.h:box.y+offset};
  const result={edge,table,side,count,p};result.label=label(result,count);return result;
 });
}
function straightPairs(e,fromBox,toBox){
 const left=fromBox.x+fromBox.w<toBox.x,right=toBox.x+toBox.w<fromBox.x;if(!left&&!right)return [];
 const fromSide=left?'right':'left',toSide=left?'left':'right';
 const top=Math.max(fromBox.y,toBox.y)+18,bottom=Math.min(fromBox.y+fromBox.h,toBox.y+toBox.h)-10,pairs=[];
 for(let y=top;y<=bottom;y+=20){
  const from={edge:e.id,table:e.from,side:fromSide,count:e.fromCount,p:{x:left?fromBox.x+fromBox.w:fromBox.x,y}};
  const to={edge:e.id,table:e.to,side:toSide,count:e.toCount,p:{x:left?toBox.x:toBox.x+toBox.w,y}};
  from.label=label(from,e.fromCount);to.label=label(to,e.toCount);pairs.push([from,to]);
 }
 return pairs;
}
const better=(a,b)=>a.some((v,i)=>v!==b[i]&&v<b[i]&&a.slice(0,i).every((n,j)=>n===b[j]));
function path(start,corner,end){
 const radius=Math.min(6,Math.abs(corner.y-start.y)/2,Math.abs(end.x-corner.x)/2),dy=Math.sign(corner.y-start.y),dx=Math.sign(end.x-corner.x);
 return `M ${start.x} ${start.y} L ${corner.x} ${corner.y-dy*radius} Q ${corner.x} ${corner.y} ${corner.x+dx*radius} ${corner.y} L ${end.x} ${end.y}`;
}
function loopPath(points){
 let d=`M ${points[0].x} ${points[0].y}`;
 for(let i=1;i<points.length-1;i++){
  const a=points[i-1],b=points[i],c=points[i+1],radius=Math.min(6,(Math.abs(a.x-b.x)+Math.abs(a.y-b.y))/2,(Math.abs(c.x-b.x)+Math.abs(c.y-b.y))/2);
  const before={x:b.x+Math.sign(a.x-b.x)*radius,y:b.y+Math.sign(a.y-b.y)*radius},after={x:b.x+Math.sign(c.x-b.x)*radius,y:b.y+Math.sign(c.y-b.y)*radius};
  d+=` L ${before.x} ${before.y} Q ${b.x} ${b.y} ${after.x} ${after.y}`;
 }
 const last=points.at(-1);return d+` L ${last.x} ${last.y}`;
}
function separation(a,b){
 return Math.max(0,a.x-(b.x+b.w),b.x-(a.x+a.w))+Math.max(0,a.y-(b.y+b.h),b.y-(a.y+a.h));
}
export function routeER(boxes,edges){
 const active=edges.filter(([a,b])=>boxes.has(a)&&boxes.has(b)).map(([from,to,fromCount,toCount,kind],id)=>({id,from,to,fromCount,toCount,kind}));
 const work=[...active].sort((a,b)=>separation(boxes.get(a.from),boxes.get(a.to))-separation(boxes.get(b.from),boxes.get(b.to))||a.id-b.id);
 const used=[],placed=[],routed=[],cards=[...boxes.values()].map(r=>({left:r.x,top:r.y,w:r.w,h:r.h}));let width=0,height=0,left=0,top=0;
 for(const e of work){
  const self=e.from===e.to,reference=e.kind==='reference',fromBox=boxes.get(e.from),toBox=boxes.get(e.to),straight=!self&&isOneToOne([e.from,e.to,e.fromCount,e.toCount]);
  const fromPorts=ports(e.id,e.from,fromBox,self||reference?'top':'bottom',e.fromCount),toPorts=ports(e.id,e.to,toBox,self||reference?'right':'left',e.toCount);
  const pairs=straight?straightPairs(e,fromBox,toBox):fromPorts.flatMap(from=>toPorts.map(to=>[from,to]));
  const prior=routed.flatMap(r=>r.segments);
  let best,bestScore;
  for(const [from,to]of pairs)for(const depth of self?[32,52,72,92]:[0]){
   const a=from.p,b=to.p;
   // No reversal or extra corner is permitted, including for saved positions.
   if(!self&&!straight&&(reference?!(a.x>b.x+2&&a.y>b.y+2):!(a.x+2<b.x&&a.y+2<b.y)))continue;
   const corner=straight||self?null:{x:a.x,y:b.y};
   const points=self?[a,{x:a.x,y:fromBox.y-depth},{x:fromBox.x+fromBox.w+depth,y:fromBox.y-depth},{x:fromBox.x+fromBox.w+depth,y:b.y},b]:straight?[a,b]:[a,corner,b];
   const segments=points.slice(1).map((point,i)=>segment(points[i],point));
   const obstacles=[...boxes].filter(([id,box])=>id!==e.from&&id!==e.to&&segments.some(s=>blocked(s.a,s.b,{x:box.x-SHAPE_MARGIN,y:box.y-SHAPE_MARGIN,w:box.w+2*SHAPE_MARGIN,h:box.h+2*SHAPE_MARGIN}))).map(([id])=>id);
   if(!straight&&obstacles.length)continue;
   const duplicates=[from,to].filter(p=>used.some(q=>p.table===q.table&&p.side===q.side&&p.p.x===q.p.x&&p.p.y===q.p.y)).length;
   const shared=segments.reduce((n,s)=>n+prior.filter(t=>sharedRun(s.a,s.b,t.a,t.b)).length,0);
   const cross=segments.reduce((n,s)=>n+prior.filter(t=>crosses(s,t)).length,0);
   const first=nearLabel(from.label,cards,placed,[...prior,...segments]);
   const second=nearLabel(to.label,cards,first?[...placed,first]:placed,[...prior,...segments]);
   const labelConflicts=Number(!first)+Number(!second)+segments.reduce((n,s)=>n+placed.filter(l=>crossesLabel(s,l)).length,0);
   const length=segments.reduce((n,s)=>n+Math.abs(s.a.x-s.b.x)+Math.abs(s.a.y-s.b.y),0),score=[obstacles.length,duplicates,shared,cross,labelConflicts,length];
   if(!best||better(score,bestScore)){best={from,to,points,segments,obstacles,labels:[first??{...from.label,conflict:true},second??{...to.label,conflict:true}]};bestScore=score;}
  }
  if(!best){routed.push({...e,ports:[],points:[],segments:[],shapeObstacles:[],unrouted:true,d:''});continue;}
  const p=[best.from,best.to],points=best.points;used.push(...p);placed.push(...best.labels);
  width=Math.max(width,...points.map(v=>v.x+35));height=Math.max(height,...points.map(v=>v.y+35));left=Math.min(left,...points.map(v=>v.x-6));top=Math.min(top,...points.map(v=>v.y-6));
  const d=self?loopPath(points):straight?`M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`:path(...points);
  routed.push({...e,ports:p,points,segments:best.segments,shapeObstacles:best.obstacles,unrouted:false,d});
 }
 const segments=routed.flatMap(r=>r.segments),labels=placed.map(l=>segments.some(s=>crossesLabel(s,l))?{...l,conflict:true}:l);
 for(const l of labels){width=Math.max(width,l.left+l.w+20);height=Math.max(height,l.top+l.h+20);left=Math.min(left,l.left-6);top=Math.min(top,l.top-6);}
 return {routes:routed.sort((a,b)=>a.id-b.id),labels,width,height,left,top};
}
