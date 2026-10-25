import {initialCamera} from './graph-camera.ts';
import {initialPositionsForDesign} from './json-layout.ts';
import type {Tab} from './session';

/** Reset only this document's layout, using its currently displayed Graph. */
export function resetLayout(tab:Tab):Tab {
  const positions=initialPositionsForDesign(tab.design);
  const unchanged=Object.keys(tab.positions).length===Object.keys(positions).length
    &&Object.entries(positions).every(([id,p])=>tab.positions[id]?.every((v,i)=>v===p[i]))
    &&tab.zoom===1&&tab.scroll.every(v=>v===0)
    &&tab.viewInset?.[0]===40&&tab.viewInset[1]===0
    &&(!tab.canvasOrigin||tab.canvasOrigin.every(v=>v===0));
  if(unchanged)return tab;
  return {...tab,positions,...initialCamera(),viewInset:[40,0],canvasOrigin:undefined};
}
