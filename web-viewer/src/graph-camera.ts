import {clampZoom} from './touch-gestures.ts';
import type {Point} from './session';
/** Business canvas contract: button zoom retains the current scroll origin. */
export type GraphCamera={zoom:number;scroll:Point};
export function cameraZoom(camera:GraphCamera,factor:number):GraphCamera{return {zoom:clampZoom(camera.zoom*factor),scroll:[...camera.scroll]};}
export function initialCamera():GraphCamera{return {zoom:1,scroll:[0,0]};}

export const ZOOM_FACTOR=1.2;

/** Signed world expansion from the business camera, with integer screen deltas. */
export function cameraOrigin(previous:Point,minimum:Point,zoom:number){
 const growth:Point=[Math.ceil(Math.max(0,(minimum[0]<0?24-minimum[0]:0)-previous[0])*zoom),Math.ceil(Math.max(0,(minimum[1]<0?24-minimum[1]:0)-previous[1])*zoom)];
 return {growth,origin:[previous[0]+growth[0]/zoom,previous[1]+growth[1]/zoom] as Point};
}
