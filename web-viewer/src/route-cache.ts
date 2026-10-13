import {routeEdge, type EdgeRoute, type RouteNode, type RouteOptions} from './routing.ts';
import type {Relation} from './graph';

type Snapshot = {
  design: object;
  structure: string;
  nodes: Map<string, RouteNode>;
  routes: (EdgeRoute | undefined)[];
};

/** Runtime-only geometry, isolated by tab. Reload/reopen intentionally routes afresh.
 * Every initial/structural pass considers ALL cards and relations, before filters.
 * Position-only changes reroute the union of incident edges, even when a moved
 * card crosses an unrelated cached path. Display state never invalidates routes.
 */
export class RouteCache {
  private tabs = new WeakMap<object, Snapshot>();
  private router: (options: RouteOptions) => EdgeRoute;
  constructor(router: (options: RouteOptions) => EdgeRoute = routeEdge) { this.router = router; }

  update(tab: object, design: object, nodes: readonly RouteNode[], relations: readonly Relation[]): readonly (EdgeRoute | undefined)[] {
    const structure = JSON.stringify([
      nodes.map(n => [n.id, n.width, n.height]),
      relations.map(r => [r.kind, r.from, r.to, r.label])
    ]);
    const previous = this.tabs.get(tab);
    const full = !previous || previous.design !== design || previous.structure !== structure;
    const moved = new Set(nodes.filter(n => {
      const old = previous?.nodes.get(n.id);
      return !old || old.x !== n.x || old.y !== n.y;
    }).map(n => n.id));
    const ids = new Set(nodes.map(n => n.id));
    const routes = full ? new Array<EdgeRoute | undefined>(relations.length) : previous.routes.slice();
    relations.forEach((r, index) => {
      if (!full && !moved.has(r.from) && !moved.has(r.to)) return;
      // Incomplete transient graphs must not retain or attempt a stale endpoint.
      routes[index] = ids.has(r.from) && ids.has(r.to) ? this.router({
        from: r.from, to: r.to, index, nodes,
        labelWidth: Math.max(30, r.label.length * 12), labelHeight: 18
      }) : undefined;
    });
    this.tabs.set(tab, {design, structure, nodes: new Map(nodes.map(n => [n.id, {...n}])), routes});
    return routes;
  }
}
