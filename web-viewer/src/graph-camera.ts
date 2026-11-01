import {clampZoom} from './touch-gestures.ts';
import type {Point} from './session';
/** Business canvas contract: button zoom retains the current scroll origin. */
export type GraphCamera={zoom:number;scroll:Point};
export function cameraZoom(camera:GraphCamera,factor:number):GraphCamera{return {zoom:clampZoom(camera.zoom*factor),scroll:[...camera.scroll]};}
export function initialCamera():GraphCamera{return {zoom:1,scroll:[0,0]};}

export const ZOOM_FACTOR=1.2;

/** Zoom only while Ctrl-wheel is over a graph; preserve the point under the pointer. */
export function installCtrlWheelZoom(host:HTMLElement,options:{read:()=>GraphCamera|undefined;change:(camera:GraphCamera)=>void}){
 const wheel=(event:WheelEvent)=>{
  if(!event.ctrlKey||event.metaKey||event.altKey||event.shiftKey||!event.cancelable||!Number.isFinite(event.deltaY)||event.deltaY===0)return;
  const camera=options.read();if(!camera||!Number.isFinite(camera.zoom)||camera.zoom<=0)return;
  event.preventDefault();
  const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?host.clientHeight:1);
  const zoom=clampZoom(camera.zoom*Math.exp(-Math.max(-500,Math.min(500,delta))*Math.log(ZOOM_FACTOR)/100));
  if(zoom===camera.zoom)return;
  const rect=host.getBoundingClientRect(),x=event.clientX-rect.left-host.clientLeft,y=event.clientY-rect.top-host.clientTop,ratio=zoom/camera.zoom;
  options.change({zoom,scroll:[Math.max(0,(camera.scroll[0]+x)*ratio-x),Math.max(0,(camera.scroll[1]+y)*ratio-y)]});
 };
 host.addEventListener('wheel',wheel,{passive:false});return ()=>host.removeEventListener('wheel',wheel);
}

/** Signed world expansion from the business camera, with integer screen deltas. */
export function cameraOrigin(previous:Point,minimum:Point,zoom:number){
 const growth:Point=[Math.ceil(Math.max(0,(minimum[0]<0?24-minimum[0]:0)-previous[0])*zoom),Math.ceil(Math.max(0,(minimum[1]<0?24-minimum[1]:0)-previous[1])*zoom)];
 return {growth,origin:[previous[0]+growth[0]/zoom,previous[1]+growth[1]/zoom] as Point};
}
