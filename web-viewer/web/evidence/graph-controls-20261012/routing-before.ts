import type { Point } from '../../../src/session';

/** Axis-aligned card bounds. Rounded cards use their conservative outer rectangle. */
export interface RouteNode { id: string; x: number; y: number; width: number; height: number }
export interface RouteOptions {
  from: string; to: string; nodes: readonly RouteNode[]; index?: number;
  /** Full rendered label dimensions in unscaled graph coordinates. */
  labelWidth?: number; labelHeight?: number;
}
export interface EdgeRoute {
  path: string; label: Point; points: Point[]; collisions: number; rerouted: boolean;
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
/**
 * Stateless local routing, recalculated from the caller's current positions on drag.
 * Preserve the fixed quadratic when clear. Otherwise compare at most eight lane
 * detours by unique card collisions, then length, then total turning angle.
 * No graph search or dependency: O(nodes * (32 + 8*3 + 63)) per edge.
 * Curve chords are inflated by their analytic maximum approximation error.
 * Dense/overlapping layouts fall back to the least-colliding candidate; edge-edge
 * crossings and complete collision elimination are deliberately not guaranteed.
 */
export function routeEdge({ from, to, nodes, index = 0, labelWidth = 100, labelHeight = 20 }: RouteOptions): EdgeRoute {
  const source = nodes.find(n => n.id === from), target = nodes.find(n => n.id === to);
  if (!source || !target) throw new Error('Route endpoint is missing');
  const obstacles = nodes.filter(n => n.id !== from && n.id !== to);
  const ac = center(source), bc = center(target), a = boundary(source, bc), b = boundary(target, ac);
  const dx = b[0] - a[0], dy = b[1] - a[1], length = Math.hypot(dx, dy) || 1, bend = 40 + (index % 3) * 16;
  const c: Point = [(a[0] + b[0]) / 2 - dy / length * bend, (a[1] + b[1]) / 2 + dx / length * bend];
  let points: Point[] = Array.from({ length: SAMPLES + 1 }, (_, i) => {
    const t = i / SAMPLES, s = 1 - t;
    return [s * s * a[0] + 2 * s * t * c[0] + t * t * b[0], s * s * a[1] + 2 * s * t * c[1] + t * t * b[1]];
  });
  const curveError = Math.hypot(a[0] - 2 * c[0] + b[0], a[1] - 2 * c[1] + b[1]) / (4 * SAMPLES * SAMPLES);
  let bestScore = score(points, obstacles, CLEARANCE + curveError), path = `M${a} Q${c} ${b}`, rerouted = false;
  if (bestScore[0]) {
    // Separate opposite directions into disjoint lane-offset bands; index adds a
    // small bounded spread for parallel relations. This is best effort, not a
    // global edge-edge router, and never changes an already-clear fixed curve.
    const reverseDirection = ac[0] > bc[0] || (ac[0] === bc[0] && ac[1] > bc[1]);
    const laneOffset = (Math.abs(Math.trunc(index)) % 4) * 4 + (reverseDirection ? 40 : 0);
    const blockers = obstacles.filter(r => routeCollisionCount(points, [r], CLEARANCE + curveError));
    for (const group of [blockers, obstacles]) {
      const bounds = [...group, source, target];
      const left = Math.min(...bounds.map(r => r.x)) - CLEARANCE - LANE_GAP - laneOffset;
      const right = Math.max(...bounds.map(r => r.x + r.width)) + CLEARANCE + LANE_GAP + laneOffset;
      const top = Math.min(...bounds.map(r => r.y)) - CLEARANCE - LANE_GAP - laneOffset;
      const bottom = Math.max(...bounds.map(r => r.y + r.height)) + CLEARANCE + LANE_GAP + laneOffset;
      for (const [first, last] of [
        [[ac[0], top], [bc[0], top]], [[ac[0], bottom], [bc[0], bottom]],
        [[left, ac[1]], [left, bc[1]]], [[right, ac[1]], [right, bc[1]]]
      ] as [Point, Point][]) {
        if (first.some(v => v < 0) || last.some(v => v < 0)) continue;
        const candidate = [boundary(source, first), first, last, boundary(target, last)].filter((p, i, all) => !i || distance(p, all[i - 1]) > 1e-7);
        const s = score(candidate, obstacles);
        if (better(s, bestScore)) { points = candidate; bestScore = s; path = `M${candidate.map(p => p.join(',')).join(' L')}`; rerouted = true; }
      }
    }
  }
  const label = labelAt(points, nodes, labelWidth, labelHeight);
  return { path, label: label.point, points, collisions: bestScore[0], rerouted, fallback: bestScore[0] > 0 || label.blocked };
}
