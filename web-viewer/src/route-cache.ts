import {captionKey,CAPTION_LINE_STEP,type MatrixWire} from './matrix-layout.ts';
import {captionOnRow, routeEdge, type EdgeRoute, type RouteNode, type RouteOptions} from './routing.ts';
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
    const recomputed:number[]=[];
    relations.forEach((r, index) => {
      if (!full && !moved.has(r.from) && !moved.has(r.to)) return;
      recomputed.push(index);
      // Incomplete transient graphs must not retain or attempt a stale endpoint.
      routes[index] = ids.has(r.from) && ids.has(r.to) ? this.router({
        from: r.from, to: r.to, index, nodes, kind: r.kind, matrix:matrix?.[index],
        // Generic fallback also reserves earlier captions on their departure rows.
        labels: matrix?.[index]?[]:[...routes.flatMap((route,i)=>route&&i<index?[{
          id:String(i),x:route.label[0]-Math.max(30,relations[i].label.length*12)/2,
          y:route.label[1]-9,width:Math.max(30,relations[i].label.length*12),height:18
        }]:[])],
        wires: matrix?.[index]?[]:routes.flatMap((route,i)=>route&&i<index?[route.points]:[]),
        labelWidth: Math.max(30, r.label.length * 12), labelHeight: 18
      }) : undefined;
    });
    // Geometry remains incident-only. Matrix caption reservations are a separate
    // deterministic pass: a moved card may cover a nonincident caption, so its
    // caption slot must be reconsidered without rerouting that wire.
    if(matrix){
      const placed:RouteNode[]=[],shared=new Map<string,[number,number]>();
      // Reserve the normal departure stack before return captions escape it.
      const order=routes.map((_,i)=>i).sort((a,b)=>Number(matrix[a].returning)-Number(matrix[b].returning));
      for(const i of order){
        const route=routes[i];
        if(!route)continue;
        const source=nodes.find(n=>n.id===relations[i].from)!,width=Math.max(30,relations[i].label.length*12);
        const anchor: [number,number]=matrix[i].returning?[Math.max(...route.points.map(p=>p[0]))+8+width/2,route.points[0][1]]:[source.x+source.width*.125+8+width/2,source.y+source.height+14+matrix[i].captionLane*CAPTION_LINE_STEP];
        const key=captionKey(relations[i],i,matrix[i]),label=shared.get(key)??captionOnRow(anchor,width,18,nodes,placed);
        if(label[0]!==route.label[0]||label[1]!==route.label[1])routes[i]={...route,label};
        if(!shared.has(key)){shared.set(key,label);placed.push({id:String(i),x:label[0]-width/2,y:label[1]-9,width,height:18});}
      }
    }
    this.tabs.set(tab, {design, structure, nodes: new Map(nodes.map(n => [n.id, {...n}])), routes});
    return routes;
  }
}
