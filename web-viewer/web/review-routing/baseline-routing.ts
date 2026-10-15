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
  /** Best effort: remaining card collisions or no card-free label candidate. */
  fallback: boolean;
}
const CLEARANCE = 14, SAMPLES = 32, LANE_GAP = 30;
const center = (r: RouteNode): Point => [r.x + r.width / 2, r.y + r.height / 2];
const distance = (a: Point, b: Point) => Math.hypot(b[0] - a[0], b[1] - a[1]);
type Side = 'left' | 'right' | 'top' | 'bottom';
const normals: Record<Side, Point> = {left:[-1,0],right:[1,0],top:[0,-1],bottom:[0,1]};
const add = (a:Point,b:Point,k=1):Point => [a[0]+b[0]*k,a[1]+b[1]*k];
const unit = (a:Point,b:Point):Point => {const d=distance(a,b)||1;return [(b[0]-a[0])/d,(b[1]-a[1])/d];};
function port(r:RouteNode,side:Side):Point {
  const n=normals[side],c=center(r);return [c[0]+n[0]*r.width/2,c[1]+n[1]*r.height/2];
}
/** Ports depend on the endpoints, never on a moving obstacle or detour handle. */
function facing(a:RouteNode,b:RouteNode):[Side,Side] {
  const ac=center(a),bc=center(b),dx=bc[0]-ac[0],dy=bc[1]-ac[1];
  return Math.abs(dx)>=Math.abs(dy)?(dx>=0?['right','left']:['left','right']):(dy>=0?['bottom','top']:['top','bottom']);
}
/** Segment/slab intersection also catches a small obstacle between sampled vertices. */
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
  return nodes.filter(r => points.some((p, i) => i > 0 && intersects(points[i - 1], p, r, padding))).length;
}
function score(points: Point[], obstacles: readonly RouteNode[], padding = CLEARANCE): number[] {
  let length = 0, turn = 0;
  for (let i = 1; i < points.length; i++) {
    length += distance(points[i - 1], points[i]);
    if (i > 1) {
      const a = points[i - 2], b = points[i - 1], c = points[i];
      const ab = distance(a, b), bc = distance(b, c);
      if (ab && bc) turn += Math.acos(Math.max(-1, Math.min(1,
        ((b[0] - a[0]) * (c[0] - b[0]) + (b[1] - a[1]) * (c[1] - b[1])) / (ab * bc))));
    }
  }
  return [routeCollisionCount(points, obstacles, padding), length, turn];
}
function better(a: number[], b: number[]): boolean {
  for (let i = 0; i < a.length; i++) if (Math.abs(a[i] - b[i]) > 1e-7) return a[i] < b[i];
  return false;
}
function pointAlong(points: Point[], fraction: number): Point {
  const lengths = points.slice(1).map((p, i) => distance(points[i], p));
  let remaining = lengths.reduce((a, b) => a + b, 0) * fraction;
  for (let i = 0; i < lengths.length; i++) {
    if (remaining <= lengths[i] && lengths[i]) {
      const t = remaining / lengths[i];
      return [points[i][0] + t * (points[i + 1][0] - points[i][0]), points[i][1] + t * (points[i + 1][1] - points[i][1])];
    }
    remaining -= lengths[i];
  }
  return points.at(-1)!;
}
function labelAt(points: Point[], nodes: readonly RouteNode[], width: number, height: number): { point: Point; blocked: boolean } {
  const mid = pointAlong(points, .5);
  // Fixed 63 candidates: prefer near the middle, but leave space for the entire text box.
  const candidates: Point[] = [];
  for (const fraction of [.5, .4, .6, .3, .7, .2, .8]) {
    const p = pointAlong(points, fraction);
    for (const [dx, dy] of [[0, 0], [0, -20], [0, 20], [-24, 0], [24, 0], [0, -48], [0, 48], [-64, 0], [64, 0]]) candidates.push([p[0] + dx, p[1] + dy]);
  }
  let best = candidates[0], bestScore = [Infinity, Infinity];
  for (const p of candidates) {
    const collisions = nodes.filter(r => p[0] + width / 2 + 4 >= r.x && p[0] - width / 2 - 4 <= r.x + r.width && p[1] + height / 2 + 4 >= r.y && p[1] - height / 2 - 4 <= r.y + r.height).length;
    const s = [collisions + (p[0] < width / 2 || p[1] < height / 2 ? 1 : 0), distance(p, mid)];
    if (better(s, bestScore)) { best = p; bestScore = s; }
  }
  return { point: best, blocked: bestScore[0] > 0 };
}
/** Sample the same quadratic that is drawn; use an analytic chord-error margin. */
function curve(a:Point,c:Point,b:Point){
  const points:Point[]=Array.from({length:SAMPLES+1},(_,i)=>{const t=i/SAMPLES,s=1-t;return [s*s*a[0]+2*s*t*c[0]+t*t*b[0],s*s*a[1]+2*s*t*c[1]+t*t*b[1]];});
  const error=Math.hypot(a[0]-2*c[0]+b[0],a[1]-2*c[1]+b[1])/(4*SAMPLES*SAMPLES);
  const extents=[a,b];
  for(let axis=0;axis<2;axis++){
    const denominator=a[axis]-2*c[axis]+b[axis],t=denominator?(a[axis]-c[axis])/denominator:0;
    if(t>0&&t<1){const s=1-t;extents.push([s*s*a[0]+2*s*t*c[0]+t*t*b[0],s*s*a[1]+2*s*t*c[1]+t*t*b[1]]);}
  }
  const bounds={right:Math.max(...extents.map(p=>p[0])),bottom:Math.max(...extents.map(p=>p[1]))};
  return {points,error,bounds,path:`M${a} Q${c} ${b}`};
}
/** Interpolate waypoints with tangent-continuous pairs of quadratic curves.
 * Short handles round local bends without pulling endpoint ports toward a lane.
 */
function smooth(waypoints:Point[], departure:Point, arrival:Point) {
  const vertices=waypoints.filter((p,i)=>!i||distance(p,waypoints[i-1])>1e-6);
  if(vertices.length<2)vertices.push(add(vertices[0],[1,0],1));
  const tangents=vertices.map((p,i):Point=>{
    if(!i)return departure;
    if(i===vertices.length-1)return arrival;
    const before=unit(vertices[i-1],p),after=unit(p,vertices[i+1]);
    return unit([0,0],add(before,after));
  });
  const segments:ReturnType<typeof curve>[]=[];
  for(let i=1;i<vertices.length;i++){
    const a=vertices[i-1],b=vertices[i],handle=Math.min(28,distance(a,b)*.24);
    const c=add(a,tangents[i-1],handle),d=add(b,tangents[i],-handle);
    const mid:Point=[(c[0]+d[0])/2,(c[1]+d[1])/2];
    segments.push(curve(a,c,mid),curve(mid,d,b));
  }
  return {
    points:segments.flatMap((s,i)=>i?s.points.slice(1):s.points),
    error:Math.max(...segments.map(s=>s.error)),
    bounds:{right:Math.max(...segments.map(s=>s.bounds.right)),bottom:Math.max(...segments.map(s=>s.bounds.bottom))},
    path:segments.map((s,i)=>i?s.path.slice(s.path.indexOf(' Q')):s.path).join('')
  };
}
/**
 * Facing ports are preferred even when a shorter detour uses another side.
 * Try local and global curved lanes with these ports first; alternative sides
 * are considered only if all facing candidates collide. Candidate counts and
 * sampling are bounded independently of graph density. Coordinates are read
 * fresh on every drag. Fallback exposes unavoidable collisions/blocked labels.
 */
export function routeEdge({ from, to, nodes, index = 0, labelWidth = 100, labelHeight = 20 }: RouteOptions): EdgeRoute {
  const source=nodes.find(n=>n.id===from),target=nodes.find(n=>n.id===to);
  if(!source||!target)throw new Error('Route endpoint is missing');
  const obstacles=nodes.filter(n=>n.id!==from&&n.id!==to),ac=center(source),bc=center(target);
  const sides=facing(source,target),a=port(source,sides[0]),b=port(target,sides[1]);
  const direction=unit(a,b),bend=40+(Math.abs(Math.trunc(index))%3)*16;
  const middle:Point=[(a[0]+b[0])/2-direction[1]*bend,(a[1]+b[1])/2+direction[0]*bend];
  let chosen=smooth([a,middle,b],normals[sides[0]],add([0,0],normals[sides[1]],-1));
  // End cards are tested with a tiny inset: touching a port is allowed, but
  // departing through or returning through the card is not.
  const evaluate=(candidate:ReturnType<typeof smooth>)=>{
    const s=score(candidate.points,obstacles,CLEARANCE+candidate.error);
    s[0]+=routeCollisionCount(candidate.points,[source,target],-.1);
    return s;
  };
  let bestScore=evaluate(chosen),rerouted=false;
  if(bestScore[0]){
    const reverse=ac[0]>bc[0]||(ac[0]===bc[0]&&ac[1]>bc[1]);
    const laneOffset=(Math.abs(Math.trunc(index))%4)*12+(reverse?72:0);
    const blockers=obstacles.filter(n=>routeCollisionCount(chosen.points,[n],CLEARANCE+chosen.error));
    const groups=[blockers,obstacles];
    const tryPorts=(pair:[Side,Side])=>{
      const start=port(source,pair[0]),end=port(target,pair[1]);
      const normalA=normals[pair[0]],normalB=normals[pair[1]];
      const reach=Math.min(36,Math.max(8,distance(start,end)*.08));
      const exit=add(start,normalA,reach),entry=add(end,normalB,reach);
      for(const group of groups){
        const bounds=[...group,source,target];
        const left=Math.min(...bounds.map(n=>n.x))-CLEARANCE-LANE_GAP-laneOffset;
        const right=Math.max(...bounds.map(n=>n.x+n.width))+CLEARANCE+LANE_GAP+laneOffset;
        const top=Math.min(...bounds.map(n=>n.y))-CLEARANCE-LANE_GAP-laneOffset;
        const bottom=Math.max(...bounds.map(n=>n.y+n.height))+CLEARANCE+LANE_GAP+laneOffset;
        for(const lane of [
          [[exit[0],top],[entry[0],top]],[[exit[0],bottom],[entry[0],bottom]],
          [[left,exit[1]],[left,entry[1]]],[[right,exit[1]],[right,entry[1]]]
        ] as Point[][]){
          const candidate=smooth([start,exit,...lane,entry,end],normalA,add([0,0],normalB,-1));
          if(candidate.points.some(p=>p[0]<1||p[1]<1))continue;
          const candidateScore=evaluate(candidate);
          if(better(candidateScore,bestScore)){chosen=candidate;bestScore=candidateScore;rerouted=true;}
        }
      }
    };
    tryPorts(sides);
    if(bestScore[0]){
      for(const side of ['top','bottom','left','right'] as Side[])tryPorts([side,side]);
    }
  }
  const label=labelAt(chosen.points,nodes,labelWidth,labelHeight);
  return {path:chosen.path,label:label.point,points:chosen.points,bounds:chosen.bounds,collisions:bestScore[0],rerouted,fallback:bestScore[0]>0||label.blocked};
}
