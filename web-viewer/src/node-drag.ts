import type {Point} from './session';

export type DragView={key:string;zoom:number;scroll:Point;offset:Point};
export type DragBounds={left:number;top:number;right:number;bottom:number};
type Host={
  read:()=>DragView|undefined;
  position:(id:string)=>Point|undefined;
  connected:(id:string)=>boolean;
  bounds:()=>DragBounds;
  change:(id:string,position:Point)=>void;
  pan:(delta:Point)=>void;
  requestFrame:(callback:FrameRequestCallback)=>number;
  cancelFrame:(id:number)=>void;
};
const camera=(view:DragView):Point=>[view.scroll[0]/view.zoom-view.offset[0],view.scroll[1]/view.zoom-view.offset[1]];
/** Edge speed is in screen pixels/second, independent of graph zoom. */
export function edgeVelocity(point:Point,bounds:DragBounds):Point {
  const axis=(p:number,low:number,high:number)=>{
    if(high<=low)return 0;
    const band=Math.min(48,(high-low)/3);
    return p<low+band?-600*Math.min(1,(low+band-p)/band):p>high-band?600*Math.min(1,(p-high+band)/band):0;
  };
  return [axis(point[0],bounds.left,bounds.right),axis(point[1],bounds.top,bounds.bottom)];
}
/** One drag model for mouse, pen and a single touch. Only the dragged card is
 * mutated. The host can grow its camera origin without rebasing world geometry.
 */
export function createNodeDrag(host:Host){
  let drag:{id:string;view:DragView;position:Point;start:Point;point:Point;camera:Point;moved:boolean}|undefined;
  let frame:number|undefined,lastTime:number|undefined;
  const stopFrame=()=>{if(frame!==undefined)host.cancelFrame(frame);frame=undefined;lastTime=undefined;};
  const cancel=(rollback=false)=>{const previous=drag;drag=undefined;stopFrame();if(rollback&&previous&&host.read()?.key===previous.view.key)host.change(previous.id,previous.position);};
  const valid=()=>{const view=host.read();return drag&&view&&view.key===drag.view.key&&view.zoom===drag.view.zoom&&host.connected(drag.id)?view:undefined;};
  const update=()=>{
    const view=valid();if(!view||!drag){cancel();return;}
    if(!drag.moved)return;
    const now=camera(view);
    host.change(drag.id,[drag.position[0]+(drag.point[0]-drag.start[0])/view.zoom+(now[0]-drag.camera[0]),drag.position[1]+(drag.point[1]-drag.start[1])/view.zoom+(now[1]-drag.camera[1])]);
  };
  const schedule=()=>{
    if(!drag?.moved||!valid()){stopFrame();return;}
    const velocity=edgeVelocity(drag.point,host.bounds());
    if(!velocity.some(Boolean)){stopFrame();return;}
    if(frame===undefined)frame=host.requestFrame(tick);
  };
  const tick=(time:number)=>{
    frame=undefined;
    if(!drag?.moved||!valid()){cancel();return;}
    const velocity=edgeVelocity(drag.point,host.bounds());
    if(!velocity.some(Boolean)){stopFrame();return;}
    // A throttled/background frame must never jump the camera by elapsed seconds.
    const elapsed=lastTime===undefined?1000/60:Math.max(0,Math.min(32,time-lastTime));lastTime=time;
    host.pan([velocity[0]*elapsed/1000,velocity[1]*elapsed/1000]);
    update();schedule();
  };
  return {
    begin(id:string,point:Point){cancel();const view=host.read(),position=host.position(id);if(!view||!position)return;drag={id,view,position:[...position],start:[...point],point:[...point],camera:camera(view),moved:false};},
    move(point:Point){if(!drag)return;drag.point=[...point];if(Math.hypot(point[0]-drag.start[0],point[1]-drag.start[1])>3)drag.moved=true;update();schedule();},
    end(){const result=drag?{id:drag.id,moved:drag.moved}:undefined;cancel();return result;},
    cancel
  };
}
