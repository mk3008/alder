import {clampZoom} from './touch-gestures.ts';
import type {Point} from './session';
/** Business canvas contract: button zoom retains the current scroll origin. */
export type GraphCamera={zoom:number;scroll:Point};
export function cameraZoom(camera:GraphCamera,factor:number):GraphCamera{return {zoom:clampZoom(camera.zoom*factor),scroll:[...camera.scroll]};}
export function initialCamera():GraphCamera{return {zoom:1,scroll:[0,0]};}

export const ZOOM_FACTOR=1.2;
