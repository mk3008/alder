import type {MatrixWire} from './matrix-layout';
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

  /** Explicit whole-layout changes need a fresh route pass for this tab only. */
  invalidate(tab: object): void { this.tabs.delete(tab); }

  update(tab: object, design: object, nodes: readonly RouteNode[], relations: readonly Relation[], matrix?:readonly MatrixWire[]): readonly (EdgeRoute | undefined)[] {
    const structure = JSON.stringify([
      nodes.map(n => [n.id, n.width, n.height]),
      relations.map(r => [r.kind, r.from, r.to, r.label]),matrix
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
        from: r.from, to: r.to, index, nodes, kind: r.kind, matrix:matrix?.[index],
        // Reserve Output captions above their receiving cards before earlier
        // exceptions/Inputs choose a label. Reservations never affect paths.
        labels: [...(r.kind==='output'?[]:relations.flatMap((other,i)=>{
          const target=nodes.find(n=>n.id===other.to),source=nodes.find(n=>n.id===other.from);
          return other.kind==='output'&&target&&source?[{id:`output-${i}`,x:source.x+source.width*.125+8,y:target.y-23,width:Math.max(30,other.label.length*12),height:18}]:[];
        })),...routes.flatMap((route,i)=>route&&i<index?[{
          id:String(i),x:route.label[0]-Math.max(30,relations[i].label.length*12)/2,
          y:route.label[1]-9,width:Math.max(30,relations[i].label.length*12),height:18
        }]:[])],
        wires: routes.flatMap((route,i)=>route&&i<index?[route.points]:[]),
        labelWidth: Math.max(30, r.label.length * 12), labelHeight: 18
      }) : undefined;
    });
    this.tabs.set(tab, {design, structure, nodes: new Map(nodes.map(n => [n.id, {...n}])), routes});
    return routes;
  }
}
