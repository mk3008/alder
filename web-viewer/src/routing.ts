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
function boundary(r: RouteNode, toward: Point): Point {
  const c = center(r), dx = toward[0] - c[0], dy = toward[1] - c[1];
  const scale = 1 / Math.max(Math.abs(dx) / (r.width / 2), Math.abs(dy) / (r.height / 2));
  return Number.isFinite(scale) ? [c[0] + dx * scale, c[1] + dy * scale] : c;
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
/**
 * Every route stays a quadratic curve, including obstacle detours. Compare at
 * most eight bowed candidates by card collisions, then length and turning.
 * Recomputed from current positions on drag; never edits the layout. Sampled
 * chords are inflated by their analytic error. Dense graphs can still contain
 * crossings or collisions; fallback reports the latter and blocked labels.
 */
export function routeEdge({ from, to, nodes, index = 0, labelWidth = 100, labelHeight = 20 }: RouteOptions): EdgeRoute {
  const source=nodes.find(n=>n.id===from),target=nodes.find(n=>n.id===to);
  if(!source||!target)throw new Error('Route endpoint is missing');
  const obstacles=nodes.filter(n=>n.id!==from&&n.id!==to),ac=center(source),bc=center(target);
  const a=boundary(source,bc),b=boundary(target,ac),dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy)||1,bend=40+(Math.abs(index)%3)*16;
  const c:Point=[(a[0]+b[0])/2-dy/length*bend,(a[1]+b[1])/2+dx/length*bend];
  let chosen=curve(a,c,b),bestScore=score(chosen.points,obstacles,CLEARANCE+chosen.error),rerouted=false;
  if(bestScore[0]){
    const reverse=ac[0]>bc[0]||(ac[0]===bc[0]&&ac[1]>bc[1]);
    const laneOffset=(Math.abs(Math.trunc(index))%4)*12+(reverse?72:0);
    const blockers=obstacles.filter(n=>routeCollisionCount(chosen.points,[n],CLEARANCE+chosen.error));
    for(const group of [blockers,obstacles]){
      const bounds=[...group,source,target];
      const left=Math.min(...bounds.map(n=>n.x))-CLEARANCE-LANE_GAP-laneOffset;
      const right=Math.max(...bounds.map(n=>n.x+n.width))+CLEARANCE+LANE_GAP+laneOffset;
      const top=Math.min(...bounds.map(n=>n.y))-CLEARANCE-LANE_GAP-laneOffset;
      const bottom=Math.max(...bounds.map(n=>n.y+n.height))+CLEARANCE+LANE_GAP+laneOffset;
      for(const control of [
        [(ac[0]+bc[0])/2,2*top-(ac[1]+bc[1])/2],[(ac[0]+bc[0])/2,2*bottom-(ac[1]+bc[1])/2],
        [2*left-(ac[0]+bc[0])/2,(ac[1]+bc[1])/2],[2*right-(ac[0]+bc[0])/2,(ac[1]+bc[1])/2]
      ] as Point[]){
        const candidate=curve(boundary(source,control),control,boundary(target,control));
        // Control points may lie outside the canvas; the actual curve may not.
        if(candidate.points.some(p=>p[0]<1||p[1]<1))continue;
        const candidateScore=score(candidate.points,obstacles,CLEARANCE+candidate.error);
        if(better(candidateScore,bestScore)){chosen=candidate;bestScore=candidateScore;rerouted=true;}
      }
    }
  }
  const label=labelAt(chosen.points,nodes,labelWidth,labelHeight);
  return {path:chosen.path,label:label.point,points:chosen.points,bounds:chosen.bounds,collisions:bestScore[0],rerouted,fallback:bestScore[0]>0||label.blocked};
}
