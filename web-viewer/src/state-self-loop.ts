import {routeCollisionCount,type EdgeRoute,type RouteNode} from './routing.ts';
import type {Point} from './session';

export type StateSelfLoop={index:number;count:number;depth:number;labelLeft:number};

function intersectsWire(a:Point,b:Point,c:Point,d:Point):boolean{
 const cross=(p:Point,q:Point,r:Point)=>(q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]);
 const p=cross(a,b,c),q=cross(a,b,d),r=cross(c,d,a),s=cross(c,d,b),epsilon=1e-6;
 if(p*q< -epsilon&&r*s< -epsilon)return true;
 if(Math.max(Math.abs(p),Math.abs(q),Math.abs(r),Math.abs(s))>epsilon)return false;
 const axis=Math.abs(b[0]-a[0])>=Math.abs(b[1]-a[1])?0:1;
 return Math.min(Math.max(a[axis],b[axis]),Math.max(c[axis],d[axis]))-Math.max(Math.min(a[axis],b[axis]),Math.min(c[axis],d[axis]))>.1;
}

/** State-only shape; shared routing and label-placement contracts stay intact. */
export function stateSelfLoopRoute(source:RouteNode,nodes:readonly RouteNode[],loop:StateSelfLoop,labelWidth:number,wires:readonly (readonly Point[])[]=[]):EdgeRoute{
 const right=source.x+source.width,step=24;
 const bottom=source.y+source.height;
 const nominal=right-8-(2*(loop.count-loop.index)-1)*step;
 const obstacles=nodes.filter(n=>n.id!==source.id);
 let best:{path:string;points:Point[];collisions:number;wireCollisions:number;low:number;extra:number;shift:number}|undefined;
 for(const shift of [0,-24,24,-48,48,-72,72])for(const extra of [0,16,32,64,128,256]){
  const a:Point=[nominal+shift,bottom],b:Point=[a[0]+step,bottom];
  if(a[0]<source.x+8||b[0]>right-8)continue;
  const low=bottom+loop.depth+extra,radius=Math.min(12,(b[0]-a[0])/2,(low-bottom)/2);
  const points:Point[]=[a];let path=`M${a}`;
  const line=(p:Point)=>{path+=` L${p}`;points.push(p);};
  const corner=(control:Point,end:Point)=>{const start=points.at(-1)!;path+=` Q${control} ${end}`;for(let i=1;i<=4;i++){const t=i/4,s=1-t;points.push([s*s*start[0]+2*s*t*control[0]+t*t*end[0],s*s*start[1]+2*s*t*control[1]+t*t*end[1]]);}};
  line([a[0],low-radius]);corner([a[0],low],[a[0]+radius,low]);
  line([b[0]-radius,low]);corner([b[0],low],[b[0],low-radius]);line(b);
  const collisions=routeCollisionCount(points,obstacles,.3);
  const wireCollisions=wires.filter(w=>points.slice(1).some((p,i)=>w.slice(1).some((v,j)=>intersectsWire(points[i],p,w[j],v)))).length;
  if(!best||collisions<best.collisions||(collisions===best.collisions&&wireCollisions<best.wireCollisions))best={path,points,collisions,wireCollisions,low,extra,shift};
  if(collisions===0&&wireCollisions===0)break;
 }
 const {path,points,collisions,wireCollisions,low,extra,shift}=best!;
 return {path,points,label:[Math.max(right+8,loop.labelLeft)+labelWidth/2,low],bounds:{right:Math.max(...points.map(p=>p[0])),bottom:Math.max(...points.map(p=>p[1]))},collisions:collisions+wireCollisions,rerouted:extra>0||shift!==0,fallback:collisions+wireCollisions>0};
}
