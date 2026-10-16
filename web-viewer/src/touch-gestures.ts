import type {Point} from './session';
import type {createNodeDrag} from './node-drag';

export const clampZoom=(zoom:number)=>Math.max(.25,Math.min(2.5,zoom));
type View={key:string;zoom:number;scroll:Point;locked?:boolean};
type Change={zoom?:number;scroll?:Point;node?:{id:string;position:Point};selected?:string;activate?:boolean};
type Host={read:()=>View|undefined;position:(id:string)=>Point|undefined;change:(value:Change)=>void;finish:()=>void;nodeDrag?:ReturnType<typeof createNodeDrag>};
type Single={kind:'single';view:View;start:Point;node?:{id:string;position:Point;draggable:boolean;handle:boolean};moved:boolean};
type Pinch={kind:'pinch';view:View;distance:number;anchor:Point};
const middle=(a:Point,b:Point):Point=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
const distance=(a:Point,b:Point)=>Math.hypot(a[0]-b[0],a[1]-b[1]);

// Capture touch on the persistent viewport: redrawing nodes must not lose a finger.
// Mouse/pen and controls outside the graph keep their existing handlers.
export function installTouchGestures(viewport:HTMLElement,host:Host){
  const points=new Map<number,Point>();
  let gesture:Single|Pinch|undefined,blocked=false;
  const local=(p:Point):Point=>{const r=viewport.getBoundingClientRect();return [p[0]-r.left-viewport.clientLeft,p[1]-r.top-viewport.clientTop];};
  const valid=()=>gesture&&host.read()?.key===gesture.view.key;
  const cancel=()=>{host.nodeDrag?.cancel();gesture=undefined;blocked=points.size>0;};
  const consume=(e:PointerEvent)=>{e.preventDefault();e.stopImmediatePropagation();};
  viewport.addEventListener('pointerdown',e=>{
    if(e.pointerType!=='touch'||((e.target as Element).closest('a,button,input')&&!(e.target as Element).closest('.node-drag-handle,.activity-open')))return;
    const view=host.read();if(!view)return;
    consume(e);points.set(e.pointerId,[e.clientX,e.clientY]);viewport.setPointerCapture(e.pointerId);
    if(blocked)return;
    if(points.size===1){
      const id=(e.target as Element).closest<HTMLElement>('.node')?.dataset.node,position=id?host.position(id):undefined;
      gesture={kind:'single',view,start:[e.clientX,e.clientY],node:id&&position?{id,position:[...position],draggable:!(e.target as Element).closest('.node.business')||!!(e.target as Element).closest('.node-drag-handle'),handle:!!(e.target as Element).closest('.node-drag-handle')}:undefined,moved:false};
      if(id&&position&&!view.locked&&gesture.node?.draggable)host.nodeDrag?.begin(id,[e.clientX,e.clientY]);
    }else if(points.size===2){
      // A first finger may have started a drag while the second was landing.
      // Undo that tentative node movement before starting the two-finger gesture.
      if(gesture?.kind==='single'&&gesture.node&&gesture.node.draggable&&!gesture.view.locked){if(host.nodeDrag)host.nodeDrag.cancel(true);else host.change({node:gesture.node});}
      else host.nodeDrag?.cancel();
      const [a,b]=[...points.values()],mid=local(middle(a,b)),now=host.read();
      if(!now){cancel();return;}
      gesture={kind:'pinch',view:now,distance:Math.max(1,distance(a,b)),anchor:[(now.scroll[0]+mid[0])/now.zoom,(now.scroll[1]+mid[1])/now.zoom]};
    }else{cancel();}
  },true);
  viewport.addEventListener('pointermove',e=>{
    if(!points.has(e.pointerId))return;consume(e);points.set(e.pointerId,[e.clientX,e.clientY]);
    if(blocked||!valid()){cancel();return;}
    const g=gesture!;
    if(g.kind==='pinch'){
      const [a,b]=[...points.values()],mid=local(middle(a,b)),zoom=clampZoom(g.view.zoom*distance(a,b)/g.distance);
      host.change({zoom,scroll:[Math.max(0,g.anchor[0]*zoom-mid[0]),Math.max(0,g.anchor[1]*zoom-mid[1])]});
    }else{
      const dx=e.clientX-g.start[0],dy=e.clientY-g.start[1];if(Math.hypot(dx,dy)>3)g.moved=true;
      if(g.node&&g.node.draggable&&!g.view.locked){if(host.nodeDrag)host.nodeDrag.move([e.clientX,e.clientY]);else if(g.moved)host.change({node:{id:g.node.id,position:[g.node.position[0]+dx/g.view.zoom,g.node.position[1]+dy/g.view.zoom]}});}
      else host.change({scroll:[Math.max(0,g.view.scroll[0]-dx),Math.max(0,g.view.scroll[1]-dy)]});
    }
  },true);
  const end=(e:PointerEvent)=>{
    // A child's implicit capture can be released when capture transfers here.
    // Only loss of the viewport's own capture terminates our gesture.
    if(e.type==='lostpointercapture'&&e.target!==viewport)return;
    if(!points.has(e.pointerId))return;consume(e);
    if(e.type==='pointerup'&&!blocked&&valid()&&gesture?.kind==='single'&&!gesture.moved&&gesture.node)host.change({selected:gesture.node.id,activate:!gesture.node.handle});
    points.delete(e.pointerId);
    // After a pinch/cancel, the remaining finger cannot accidentally drag/select.
    cancel();if(!points.size)blocked=false;
    if(viewport.hasPointerCapture?.(e.pointerId))viewport.releasePointerCapture(e.pointerId);
    host.finish();
  };
  for(const type of ['pointerup','pointercancel','lostpointercapture'])viewport.addEventListener(type,end as EventListener,true);
  return {cancel};
}
