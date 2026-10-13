import type { Point } from './session';

/** Axis-aligned card bounds. Rounded cards use their conservative outer rectangle. */
export interface RouteNode { id: string; x: number; y: number; width: number; height: number }
export interface RouteOptions {
  from: string; to: string; nodes: readonly RouteNode[]; index?: number;
  /** Full rendered label dimensions in unscaled graph coordinates. */
  labelWidth?: number; labelHeight?: number;
}
export interface EdgeRoute {
  path: string; label: Point; points: Point[]; bounds: {right:number;bottom:number}; collisions: number; rerouted: boolean;
  /** Best effort: remaining card collisions, off-canvas geometry or a blocked label. */
  fallback: boolean;
}
const CLEARANCE = 14, RADIUS = 8, CORNER_STEPS = 4, LANE_GAP = 30;
const center = (r: RouteNode): Point => [r.x + r.width / 2, r.y + r.height / 2];
const distance = (a: Point, b: Point) => Math.hypot(b[0] - a[0], b[1] - a[1]);
type Side = 'left' | 'right' | 'top' | 'bottom';
const normals: Record<Side, Point> = {left:[-1,0],right:[1,0],top:[0,-1],bottom:[0,1]};
const add = (a:Point,b:Point,k=1):Point => [a[0]+b[0]*k,a[1]+b[1]*k];
function port(r:RouteNode,side:Side):Point {
  // Left-biased vertical ports leave room for the next small staircase step.
  // Ports depend only on the endpoint, never on obstacle/detour coordinates.
  return side==='top'||side==='bottom'?[r.x+r.width*.22,r.y+(side==='bottom'?r.height:0)]:[r.x+(side==='right'?r.width:0),r.y+r.height/2];
}
/** Segment/slab intersection also catches a tiny obstacle between vertices. */
function intersects(a: Point, b: Point, r: RouteNode, padding: number): boolean {
  let low = 0, high = 1;
  for (let axis = 0; axis < 2; axis++) {
    const min = (axis ? r.y : r.x) - padding;
    const max = min + (axis ? r.height : r.width) + 2 * padding;
    const delta = b[axis] - a[axis];
    if (Math.abs(delta) < 1e-10) { if (a[axis] < min || a[axis] > max) return false; }
    else {
      const t1 = (min - a[axis]) / delta, t2 = (max - a[axis]) / delta;
      low = Math.max(low, Math.min(t1, t2)); high = Math.min(high, Math.max(t1, t2));
      if (low > high) return false;
    }
  }
  return true;
}
export function routeCollisionCount(points: readonly Point[], nodes: readonly RouteNode[], padding = CLEARANCE): number {
  let count=0;
  for(const r of nodes)for(let i=1;i<points.length;i++)if(intersects(points[i-1],points[i],r,padding)){count++;break;}
  return count;
}
function better(a: readonly number[], b: readonly number[]): boolean {
  for (let i = 0; i < a.length; i++) if (Math.abs(a[i] - b[i]) > 1e-7) return a[i] < b[i];
  return false;
}
function pointAlong(points: readonly Point[], lengths: readonly number[], total:number, fraction: number): Point {
  let remaining=total*fraction;
  for (let i = 0; i < lengths.length; i++) {
    if (remaining <= lengths[i] && lengths[i]) {
      const t = remaining / lengths[i];
      return [points[i][0] + t * (points[i + 1][0] - points[i][0]), points[i][1] + t * (points[i + 1][1] - points[i][1])];
    }
    remaining -= lengths[i];
  }
  return points.at(-1)!;
}
function labelAt(points: Point[], nodes: readonly RouteNode[], width: number, height: number, minimum:Point): { point: Point; blocked: boolean } {
  const lengths=points.slice(1).map((p,i)=>distance(points[i],p)),total=lengths.reduce((a,b)=>a+b,0);
  const mid=pointAlong(points,lengths,total,.5);
  // 63 bounded candidates. Horizontal displacement accounts for the full label
  // width; a long label next to a vertical leg must not sit over the next card.
  const offsets:Point[]=[[0,0],[0,-height/2-6],[0,height/2+6],[-width/2-8,0],[width/2+8,0],[0,-height-16],[0,height+16],[-width/2-24,0],[width/2+24,0]];
  let best=mid,bestScore=[Infinity,Infinity];
  const consider=(p:Point)=>{
    let collisions=p[0]<minimum[0]+width/2||p[1]<minimum[1]+height/2?1:0;
    for(const r of nodes)if(p[0]+width/2+4>=r.x&&p[0]-width/2-4<=r.x+r.width&&p[1]+height/2+4>=r.y&&p[1]-height/2-4<=r.y+r.height)collisions++;
    const score=[collisions,distance(p,mid)];
    if(better(score,bestScore)){best=p;bestScore=score;}
  };
  for(const fraction of [.5,.4,.6,.3,.7,.2,.8]){
    const anchor=pointAlong(points,lengths,total,fraction);
    for(const offset of offsets)consider(add(anchor,offset));
  }
  // A 28-unit staircase gap has room for an 18-unit label, but only a narrow
  // interval of legal centers. Snap to nearby card boundaries rather than
  // hoping a sampled fraction happens to land in that interval.
  if(bestScore[0])for(const r of nodes){
    for(const y of [r.y-height/2-5,r.y+r.height+height/2+5])if(Math.abs(y-mid[1])<=64)consider([mid[0],y]);
    for(const x of [r.x-width/2-5,r.x+r.width+width/2+5])if(Math.abs(x-mid[0])<=width/2+24)consider([x,mid[1]]);
  }
  // A left-hand lane can leave a clear label anchor partly beyond the fixed
  // canvas boundary. Try bringing that label inside before reporting fallback.
  if(bestScore[0])consider([Math.max(minimum[0]+width/2+1,best[0]),Math.max(minimum[1]+height/2+1,best[1])]);
  return {point:best,blocked:bestScore[0]>0};
}
type Geometry={vertices:Point[];points:Point[];error:number;length:number;path:string;bounds:{right:number;bottom:number}};
/** Keep long legs exactly straight; only 90-degree corners get a short Q.
 * Four chords per corner have <= 0.177 graph-unit error (included in obstacle
 * tests). There are at most six vertices / 22 points in a template.
 */
function rounded(waypoints:readonly Point[]):Geometry|undefined {
  const vertices:Point[]=[];
  for(const p of waypoints){
    if(vertices.length&&distance(vertices.at(-1)!,p)<1e-7)continue;
    if(vertices.length){const last=vertices.at(-1)!;if(last[0]!==p[0]&&last[1]!==p[1])return;}
    while(vertices.length>1){
      const a=vertices.at(-2)!,b=vertices.at(-1)!;
      if((a[0]===b[0]&&b[0]===p[0])||(a[1]===b[1]&&b[1]===p[1])){
        if((b[0]-a[0])*(p[0]-b[0])+(b[1]-a[1])*(p[1]-b[1])<0)return;
        vertices.pop();
      }else break;
    }
    vertices.push(p);
  }
  if(vertices.length<2)return;
  const points:Point[]=[vertices[0]];let path=`M${vertices[0]}`,error=0,length=0;
  const line=(p:Point)=>{if(distance(points.at(-1)!,p)>1e-7){length+=distance(points.at(-1)!,p);points.push(p);path+=` L${p}`;}};
  for(let i=1;i<vertices.length-1;i++){
    const previous=vertices[i-1],corner=vertices[i],next=vertices[i+1];
    const before=distance(previous,corner),after=distance(corner,next),radius=Math.min(RADIUS,before/2,after/2);
    const a:Point=[corner[0]+(previous[0]-corner[0])*radius/before,corner[1]+(previous[1]-corner[1])*radius/before];
    const b:Point=[corner[0]+(next[0]-corner[0])*radius/after,corner[1]+(next[1]-corner[1])*radius/after];
    line(a);path+=` Q${corner} ${b}`;
    for(let step=1;step<=CORNER_STEPS;step++){
      const t=step/CORNER_STEPS,s=1-t,p:Point=[s*s*a[0]+2*s*t*corner[0]+t*t*b[0],s*s*a[1]+2*s*t*corner[1]+t*t*b[1]];
      length+=distance(points.at(-1)!,p);points.push(p);
    }
    error=Math.max(error,Math.SQRT2*radius/(4*CORNER_STEPS*CORNER_STEPS));
  }
  line(vertices.at(-1)!);
  // Axis-monotone quarter corners stay within the extrema of the straight legs.
  return {vertices,points,error,length,path,bounds:{right:Math.max(...points.map(p=>p[0])),bottom:Math.max(...points.map(p=>p[1]))}};
}
/**
 * Bounded orthogonal templates: at most 16 port pairs x 12 candidates
 * (192 total). Clear
 * preferred bottom/left routes finish after one pair. Forward routes exhaust
 * left-target pairs (vertical departures first) before changing the arrival
 * side. Returns prefer right/right ports and the shortest clear lane, retaining
 * graph-wide lanes as obstacle fallbacks. No search graph, large curve
 * sampling, or input mutation.
 * The runtime cache can therefore reroute only incident edges after a drag.
 * Overlaps and obstructed ports may be unavoidable; a finite best effort is
 * returned with fallback=true rather than concealing remaining collisions.
 */
export function routeEdge({from,to,nodes,index=0,labelWidth=100,labelHeight=20}:RouteOptions):EdgeRoute {
  const source=nodes.find(n=>n.id===from),target=nodes.find(n=>n.id===to);
  if(!source||!target)throw new Error('Route endpoint is missing');
  // Preserve positive-world routing exactly. A signed axis has no fixed zero
  // boundary: the camera expands to contain its finite route and label bounds.
  const minimum:Point=[nodes.some(n=>n.x<0)?-Infinity:0,nodes.some(n=>n.y<0)?-Infinity:0];
  const offCanvas=(points:Point[])=>points.some(p=>p[0]<minimum[0]+1||p[1]<minimum[1]+1)?1:0;
  const obstacles=nodes.filter(n=>n.id!==from&&n.id!==to),endpoints=source===target?[source]:[source,target];
  const ac=center(source),bc=center(target),returning=target.y+target.height<=source.y||(bc[0]<ac[0]&&bc[1]<=ac[1])||source===target;
  const preferred:[Side,Side]=returning?['right','right']:['bottom','left'];
  const spread=(Math.abs(Math.trunc(index))%4)*10,reach=CLEARANCE+RADIUS+spread;
  const bounds={left:Math.min(...nodes.map(n=>n.x))-CLEARANCE-LANE_GAP-spread,right:Math.max(...nodes.map(n=>n.x+n.width))+CLEARANCE+LANE_GAP+spread,top:Math.min(...nodes.map(n=>n.y))-CLEARANCE-LANE_GAP-spread,bottom:Math.max(...nodes.map(n=>n.y+n.height))+CLEARANCE+LANE_GAP+spread};
  let chosen:Geometry|undefined,bestScore=[Infinity,Infinity,Infinity,Infinity],rerouted=false;
  const evaluate=(waypoints:Point[],pair:[Side,Side],primary:boolean)=>{
    const geometry=rounded(waypoints);if(!geometry)return;
    const v=geometry.vertices,a=v[0],next=v[1],b=v.at(-1)!,previous=v.at(-2)!;
    if((next[0]-a[0])*normals[pair[0]][0]+(next[1]-a[1])*normals[pair[0]][1]<=0||(previous[0]-b[0])*normals[pair[1]][0]+(previous[1]-b[1])*normals[pair[1]][1]<=0)return;
    const collisions=routeCollisionCount(geometry.points,obstacles,CLEARANCE+geometry.error)+routeCollisionCount(geometry.points,endpoints,-.1);
    const outside=offCanvas(geometry.points);
    const score=[collisions,outside,geometry.length+12*(geometry.vertices.length-2),geometry.vertices.length];
    if(better(score,bestScore)){chosen=geometry;bestScore=score;rerouted=!primary;}
  };
  const tried=new Set<string>();
  const tryPorts=(pair:[Side,Side])=>{
    const key=pair.join('/');if(tried.has(key))return;tried.add(key);
    const a=port(source,pair[0]),b=port(target,pair[1]),exit=add(a,normals[pair[0]],reach),entry=add(b,normals[pair[1]],reach);
    const localRight=Math.max(source.x+source.width,target.x+target.width)+CLEARANCE+LANE_GAP+spread;
    const localLeft=Math.min(source.x,target.x)-CLEARANCE-LANE_GAP-spread;
    const localTop=Math.min(source.y,target.y)-CLEARANCE-LANE_GAP-spread;
    const localBottom=Math.max(source.y+source.height,target.y+target.height)+CLEARANCE+LANE_GAP+spread;
    const primary=pair[0]===preferred[0]&&pair[1]===preferred[1];
    // Score local and global lanes together, including for returns. Accepting
    // a clear graph-wide return first would stretch it past unrelated distant
    // cards; accepting localRight first could skip an even shorter clear lane.
    evaluate([a,[a[0],b[1]],b],pair,primary&&!returning);
    evaluate([a,[b[0],a[1]],b],pair,primary&&!returning);
    evaluate([a,exit,[entry[0],exit[1]],entry,b],pair,primary&&!returning);
    evaluate([a,exit,[exit[0],entry[1]],entry,b],pair,primary&&!returning);
    for(const x of [localRight,localLeft,bounds.right,bounds.left])evaluate([a,exit,[x,exit[1]],[x,entry[1]],entry,b],pair,false);
    for(const y of [localBottom,localTop,bounds.bottom,bounds.top])evaluate([a,exit,[exit[0],y],[entry[0],y],entry,b],pair,false);
  };
  tryPorts(preferred);
  if(!returning&&(bestScore[0]||bestScore[1])){
    // Keep the reading direction at the target before relaxing the source
    // departure. An obstructed bottom/left pair must not choose bottom/right
    // while a clear top/left or side/left pair is still available.
    for(const a of ['top','right','left'] as Side[]){tryPorts([a,'left']);if(!bestScore[0]&&!bestScore[1])break;}
  }
  if(bestScore[0]||bestScore[1]){
    // Keep vertical departure / horizontal arrival before trying side departures.
    vertical: for(const a of ['bottom','top'] as Side[])for(const b of ['left','right'] as Side[]){tryPorts([a,b]);if(!bestScore[0]&&!bestScore[1])break vertical;}
    if(bestScore[0]||bestScore[1])other: for(const a of ['right','left','bottom','top'] as Side[])for(const b of ['right','left','top','bottom'] as Side[]){tryPorts([a,b]);if(!bestScore[0]&&!bestScore[1])break other;}
  }
  // Coincident/covered ports can invalidate every direction. A short exterior
  // loop always exists geometrically; collision reporting remains honest.
  if(!chosen){
    const a=port(source,'right'),b=port(target,'top'),x=Math.max(source.x+source.width,target.x+target.width)+reach,y=Math.min(source.y,target.y)-reach;
    chosen=rounded([a,[x,a[1]],[x,y],[b[0],y],b])!;
    bestScore=[routeCollisionCount(chosen.points,obstacles,CLEARANCE+chosen.error)+routeCollisionCount(chosen.points,endpoints,-.1),offCanvas(chosen.points)];rerouted=true;
  }
  const label=labelAt(chosen.points,nodes,labelWidth,labelHeight,minimum);
  return {path:chosen.path,label:label.point,points:chosen.points,bounds:chosen.bounds,collisions:bestScore[0],rerouted,fallback:bestScore[0]>0||bestScore[1]>0||label.blocked};
}
