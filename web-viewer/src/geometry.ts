import type { Point } from './session';

export const NODE_WIDTH = 260, NODE_HEIGHT = 68;
export function nodeBoundary(position: Point, toward: Point, capsule: boolean): Point {
  const halfWidth = NODE_WIDTH / 2, radius = NODE_HEIGHT / 2;
  const center: Point = [position[0] + halfWidth, position[1] + radius];
  const dx = toward[0] - center[0], dy = toward[1] - center[1];
  if (!dx && !dy) return center;
  if (!capsule) {
    const scale = 1 / Math.max(Math.abs(dx) / halfWidth, Math.abs(dy) / radius);
    return [center[0] + dx * scale, center[1] + dy * scale];
  }
  const length = Math.hypot(dx, dy), ux = dx / length, uy = dy / length;
  const straight = halfWidth - radius;
  const top = uy ? radius / Math.abs(uy) : Infinity;
  if (Math.abs(ux * top) <= straight) return [center[0] + ux * top, center[1] + uy * top];
  const capCenter = Math.sign(ux) * straight;
  const distance = ux * capCenter + Math.sqrt(radius * radius - capCenter * capCenter * uy * uy);
  return [center[0] + ux * distance, center[1] + uy * distance];
}
