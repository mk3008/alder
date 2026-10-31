import {routeCollisionCount,type EdgeRoute,type RouteNode} from './routing.ts';
import type {Point} from './session';

export type StateSelfLoop={index:number;count:number;rise:number;outerReach:number};

/** State-only shape; shared routing and label-placement contracts stay intact. */
export function stateSelfLoopRoute(source:RouteNode,nodes:readonly RouteNode[],loop:StateSelfLoop,labelWidth:number):EdgeRoute{
 const right=source.x+source.width,a:Point=[right,source.y+source.height*(loop.index+1)/(loop.count+1)];
 const b:Point=[right-source.width*(loop.index+1)/(loop.count+1),source.y],obstacles=nodes.filter(n=>n.id!==source.id);
 let best:{path:string;points:Point[];collisions:number;lane:number;top:number;extra:number}|undefined;
 for(const extra of [0,16,32,64,128,256]){
  const lane=right+32+16*loop.index+extra,top=source.y-loop.rise-extra;
  const radius=Math.min(12,(lane-right)/2,(a[1]-top)/2,(lane-b[0])/2,(b[1]-top)/2);
  const points:Point[]=[a];let path=`M${a}`;
  const line=(p:Point)=>{path+=` L${p}`;points.push(p);};
  const corner=(control:Point,end:Point)=>{const start=points.at(-1)!;path+=` Q${control} ${end}`;for(let i=1;i<=4;i++){const t=i/4,s=1-t;points.push([s*s*start[0]+2*s*t*control[0]+t*t*end[0],s*s*start[1]+2*s*t*control[1]+t*t*end[1]]);}};
  line([lane-radius,a[1]]);corner([lane,a[1]],[lane,a[1]-radius]);
  line([lane,top+radius]);corner([lane,top],[lane-radius,top]);
  line([b[0]+radius,top]);corner([b[0],top],[b[0],top+radius]);line(b);
  const collisions=routeCollisionCount(points,obstacles,.3);
  if(!best||collisions<best.collisions)best={path,points,collisions,lane,top,extra};
  if(collisions===0)break;
 }
 const {path,points,collisions,lane,top,extra}=best!;
 return {path,points,label:[Math.max(right+loop.outerReach,lane)+8+labelWidth/2,top],bounds:{right:Math.max(...points.map(p=>p[0])),bottom:Math.max(...points.map(p=>p[1]))},collisions,rerouted:extra>0,fallback:collisions>0};
}
